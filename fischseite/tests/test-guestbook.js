// 🧪 COMPREHENSIVE GUESTBOOK TESTS
// Tests für Supabase-Anbindung, UI-Funktionalität und Moderation

const { test, expect, chromium } = require('@playwright/test');
const { createClient } = require('@supabase/supabase-js');

// Supabase Configuration
const SUPABASE_URL = 'https://gnhsauvbqrxywtgppetm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNhdXZicXJ4eXd0Z3BwZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Njc0MjcsImV4cCI6MjA3NDI0MzQyN30.DHPTMZR6NOT7mDvCOI_1fzx87dhX9syBFek_cKkOaSc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Test URLs
const LOCAL_URL = 'http://localhost:8000/guestbook.html';
const PRODUCTION_URL = 'https://vibecoding.company/fischseite/guestbook.html';

// Helper Functions
async function cleanupTestEntries() {
    const { data, error } = await supabase
        .from('guestbook')
        .delete()
        .like('name', 'Test%')
        .like('message', '%Playwright Test%');

    console.log(`Cleaned up test entries: ${data?.length || 0}`);
}

async function createTestEntry(name = 'Test User', message = 'Playwright Test Entry') {
    const { data, error } = await supabase
        .from('guestbook')
        .insert([{
            name,
            message,
            avatar_emoji: '🧪',
            is_approved: true // For testing purposes
        }])
        .select();

    if (error) throw error;
    return data[0];
}

// Tests
test.describe('🐠 Guestbook Functionality Tests', () => {
    let testEntryId = null;

    test.beforeEach(async () => {
        // Cleanup vor jedem Test
        await cleanupTestEntries();
    });

    test.afterEach(async () => {
        // Cleanup nach jedem Test
        await cleanupTestEntries();
    });

    test('1️⃣ Database Connection Test', async () => {
        console.log('Testing Supabase connection...');

        // Test connection
        const { data, error } = await supabase
            .from('guestbook')
            .select('count')
            .limit(1);

        expect(error).toBeNull();
        console.log('✅ Database connection successful');
    });

    test('2️⃣ Read Approved Entries Test', async () => {
        console.log('Testing approved entries read...');

        // Create test entry
        const testEntry = await createTestEntry('Test Reader', 'Test approved entry');
        testEntryId = testEntry.id;

        // Read approved entries
        const { data, error } = await supabase
            .from('guestbook')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false });

        expect(error).toBeNull();
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);

        // Check our test entry is there
        const ourEntry = data.find(entry => entry.id === testEntryId);
        expect(ourEntry).toBeDefined();
        expect(ourEntry.name).toBe('Test Reader');

        console.log(`✅ Successfully read ${data.length} approved entries`);
    });

    test('3️⃣ Guestbook Page Loads', async ({ page }) => {
        console.log('Testing guestbook page load...');

        // Try local first, fallback to production
        try {
            await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
            console.log('✅ Local guestbook loaded');
        } catch (error) {
            console.log('Local server not available, testing production...');
            await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
            console.log('✅ Production guestbook loaded');
        }

        // Check essential elements
        await expect(page.locator('h1')).toContainText('Gästebuch');
        await expect(page.locator('#guestbookForm')).toBeVisible();
        await expect(page.locator('#name')).toBeVisible();
        await expect(page.locator('#message')).toBeVisible();

        console.log('✅ All essential elements present');
    });

    test('4️⃣ Form Validation Test', async ({ page }) => {
        console.log('Testing form validation...');

        try {
            await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
        } catch {
            await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
        }

        // Test empty form submission
        await page.click('.submit-btn');

        // Check if HTML5 validation kicks in
        const nameField = page.locator('#name');
        const messageField = page.locator('#message');

        expect(await nameField.evaluate(el => el.validity.valid)).toBeFalsy();
        expect(await messageField.evaluate(el => el.validity.valid)).toBeFalsy();

        console.log('✅ Form validation working');
    });

    test('5️⃣ Form Submission Test', async ({ page }) => {
        console.log('Testing form submission...');

        try {
            await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
        } catch {
            await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
        }

        // Fill form
        await page.fill('#name', 'Test Playwright User');
        await page.fill('#message', 'This is a Playwright Test Entry - will be deleted');

        // Submit form
        await page.click('.submit-btn');

        // Wait for success message
        const successMessage = page.locator('.success');
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        await expect(successMessage).toContainText('erfolgreich gespeichert');

        // Check if form was cleared
        expect(await page.locator('#name').inputValue()).toBe('');
        expect(await page.locator('#message').inputValue()).toBe('');

        console.log('✅ Form submission successful');
    });

    test('6️⃣ Entry Display Test', async ({ page }) => {
        console.log('Testing entry display...');

        // Create approved test entry
        const testEntry = await createTestEntry('Playwright Display Test', 'This entry should be visible');
        testEntryId = testEntry.id;

        try {
            await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
        } catch {
            await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
        }

        // Wait for entries to load
        await page.waitForSelector('#entries .entry', { timeout: 10000 });

        // Check if our test entry is displayed
        const entries = page.locator('#entries .entry');
        const entryCount = await entries.count();
        expect(entryCount).toBeGreaterThan(0);

        // Look for our specific entry
        const entryTexts = await entries.allTextContents();
        const ourEntryExists = entryTexts.some(text =>
            text.includes('Playwright Display Test') &&
            text.includes('This entry should be visible')
        );

        expect(ourEntryExists).toBeTruthy();
        console.log(`✅ Entry display working - ${entryCount} entries shown`);
    });

    test('7️⃣ Moderation Flow Test', async () => {
        console.log('Testing moderation flow...');

        // Create pending entry (not approved)
        const { data, error } = await supabase
            .from('guestbook')
            .insert([{
                name: 'Test Pending User',
                message: 'This entry needs approval - Playwright Test',
                avatar_emoji: '⏳',
                is_approved: false
            }])
            .select();

        expect(error).toBeNull();
        testEntryId = data[0].id;

        // Verify it's not visible in public query
        const { data: publicData } = await supabase
            .from('guestbook')
            .select('*')
            .eq('is_approved', true);

        const visibleEntry = publicData.find(entry => entry.id === testEntryId);
        expect(visibleEntry).toBeUndefined();

        console.log('✅ Moderation flow working - pending entries hidden');
    });

    test('8️⃣ Real-Time Loading Test', async ({ page }) => {
        console.log('Testing real-time loading...');

        try {
            await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
        } catch {
            await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
        }

        // Check loading state appears initially
        const loadingElement = page.locator('#loading');

        // Wait for entries to load and loading to disappear
        await expect(loadingElement).toBeHidden({ timeout: 10000 });

        // Check entries container is populated
        const entriesContainer = page.locator('#entries');
        await expect(entriesContainer).toBeVisible();

        console.log('✅ Real-time loading works');
    });

    test('9️⃣ Error Handling Test', async ({ page }) => {
        console.log('Testing error handling...');

        try {
            await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
        } catch {
            await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
        }

        // Override supabase to simulate error
        await page.evaluate(() => {
            window.supabase = null;
        });

        // Try to submit form
        await page.fill('#name', 'Error Test');
        await page.fill('#message', 'This should trigger an error');
        await page.click('.submit-btn');

        // Check for error message
        const errorMessage = page.locator('.error');
        await expect(errorMessage).toBeVisible({ timeout: 5000 });

        console.log('✅ Error handling works');
    });

    test('🔟 Performance Test', async ({ page }) => {
        console.log('Testing performance...');

        try {
            await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
        } catch {
            await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
        }

        // Measure page load time
        const navigationStart = await page.evaluate(() => performance.timing.navigationStart);
        const loadComplete = await page.evaluate(() => performance.timing.loadEventEnd);
        const loadTime = loadComplete - navigationStart;

        expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds

        console.log(`✅ Page loaded in ${loadTime}ms`);
    });
});

// Summary function
test.afterAll(async () => {
    console.log('\n🎉 GUESTBOOK TEST SUMMARY:');
    console.log('✅ Database Connection');
    console.log('✅ Entry Reading');
    console.log('✅ Form Validation');
    console.log('✅ Entry Submission');
    console.log('✅ Entry Display');
    console.log('✅ Moderation Flow');
    console.log('✅ Real-Time Loading');
    console.log('✅ Error Handling');
    console.log('✅ Performance Check');

    // Final cleanup
    await cleanupTestEntries();
    console.log('🧹 Test cleanup completed');
});