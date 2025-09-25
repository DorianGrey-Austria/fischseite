// 🔍 Debug Guestbook Loading Issues
const { chromium } = require('playwright');

async function debugGuestbook() {
    console.log('🔍 GUESTBOOK DEBUG SESSION\n');

    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext();

    // Listen to console messages
    context.on('console', msg => {
        const type = msg.type();
        console.log(`🌐 [${type.toUpperCase()}] ${msg.text()}`);
    });

    // Listen to errors
    context.on('pageerror', error => {
        console.log('❌ PAGE ERROR:', error.message);
    });

    const page = await context.newPage();

    try {
        console.log('📍 Loading guestbook with debug info...');
        await page.goto('http://localhost:8080/guestbook.html');
        await page.waitForLoadState('networkidle');

        // Check console for errors
        console.log('\n🔍 Checking JavaScript execution...');

        // Check if guestbook object exists
        const guestbookExists = await page.evaluate(() => {
            return typeof window.guestbook !== 'undefined';
        });
        console.log('📋 Guestbook object exists:', guestbookExists);

        // Check Supabase connection manually
        const supabaseTest = await page.evaluate(async () => {
            try {
                if (!window.supabase) return 'Supabase not loaded';

                const SUPABASE_URL = 'https://gnhsauvbqrxywtgppetm.supabase.co';
                const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNhdXZicXJ4eXd0Z3BwZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Njc0MjcsImV4cCI6MjA3NDI0MzQyN30.DHPTMZR6NOT7mDvCOI_1fzx87dhX9syBFek_cKkOaSc';

                const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                const { data, error } = await client.from('guestbook').select('*').limit(1);

                if (error) return `Error: ${error.message}`;
                return `Success: ${data.length} entries found`;
            } catch (e) {
                return `Exception: ${e.message}`;
            }
        });

        console.log('🗄️ Manual Supabase test:', supabaseTest);

        // Wait and check if entries appear
        console.log('\n⏳ Waiting 5 seconds for entries to load...');
        await page.waitForTimeout(5000);

        const entriesAfterWait = await page.evaluate(() => {
            return document.querySelectorAll('.guestbook-entry').length;
        });
        console.log('📊 Entries after wait:', entriesAfterWait);

        // Check for specific error messages
        const errorElements = await page.locator('.error').count();
        console.log('❌ Error elements on page:', errorElements);

        if (errorElements > 0) {
            const errorText = await page.locator('.error').first().textContent();
            console.log('📄 Error message:', errorText);
        }

        // Check network requests
        console.log('\n🌐 Checking network activity...');

        // Force reload entries
        await page.evaluate(() => {
            if (window.guestbook && window.guestbook.loadEntries) {
                window.guestbook.loadEntries();
            }
        });

        await page.waitForTimeout(3000);

        const finalEntryCount = await page.evaluate(() => {
            return document.querySelectorAll('.guestbook-entry').length;
        });
        console.log('🎯 Final entry count:', finalEntryCount);

        return finalEntryCount > 0;

    } catch (error) {
        console.error('💥 Debug failed:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

debugGuestbook().then((success) => {
    console.log('\n🎯 DEBUG RESULT:', success ? 'Entries loaded successfully' : 'Issue confirmed - needs fixing');
}).catch(console.error);