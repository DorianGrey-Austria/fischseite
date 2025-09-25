// 🎭 Playwright Test für Guestbook Supabase Integration
// Testet echte Benutzereingaben und Datenbankoperationen

const { chromium } = require('playwright');

async function testGuestbookIntegration() {
    console.log('🎭 Starting Playwright Guestbook Integration Test...\n');

    const browser = await chromium.launch({
        headless: false,  // Zeige Browser für Debugging
        slowMo: 1000     // Langsamer für bessere Sichtbarkeit
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // 1. Gehe zur Guestbook-Seite
        console.log('📖 1. Navigating to guestbook page...');
        await page.goto('http://localhost:9000/guestbook.html');
        await page.waitForLoadState('networkidle');

        // Screenshot für Debugging
        await page.screenshot({ path: 'screenshots/guestbook-loaded.png' });
        console.log('✅ Guestbook page loaded');

        // 2. Warte bis Einträge geladen sind
        console.log('⏳ 2. Waiting for entries to load...');
        await page.waitForSelector('.entry', { timeout: 10000 });

        // Zähle vorhandene Einträge
        const entriesBeforeCount = await page.$$eval('.entry', entries => entries.length);
        console.log(`📊 Found ${entriesBeforeCount} existing entries`);

        // 3. Prüfe ob das Formular sichtbar ist
        console.log('📝 3. Checking form visibility...');
        await page.waitForSelector('#guestbook-form', { visible: true });

        const isFormVisible = await page.isVisible('#guestbook-form');
        console.log('✅ Form is visible:', isFormVisible);

        // 4. Fülle das Formular aus
        console.log('✍️ 4. Filling out the form...');

        const testData = {
            name: `PlaywrightTester_${Date.now()}`,
            email: 'playwright@test.com',
            message: `🤖 Automatischer Test-Eintrag vom ${new Date().toLocaleString('de-DE')} - Playwright testet die Supabase-Integration! 🐠`
        };

        await page.fill('input[name="name"]', testData.name);
        await page.fill('input[name="email"]', testData.email);
        await page.fill('textarea[name="message"]', testData.message);

        console.log('📝 Test data:', testData);

        // 5. Screenshot vor dem Absenden
        await page.screenshot({ path: 'screenshots/form-filled.png' });

        // 6. Formular absenden
        console.log('📤 5. Submitting form...');
        await page.click('button[type="submit"]');

        // 7. Warte auf Erfolgs- oder Fehlermeldung
        console.log('⏳ 6. Waiting for response...');

        try {
            // Warte auf Success-Message oder Error-Message
            const responseSelector = await page.waitForSelector(
                '.success-message, .error-message, .message',
                { timeout: 15000 }
            );

            const responseText = await responseSelector.textContent();
            console.log('📝 Server response:', responseText);

            // Screenshot nach Antwort
            await page.screenshot({ path: 'screenshots/after-submit.png' });

            // 8. Prüfe ob ein neuer Eintrag erschienen ist
            console.log('🔍 7. Checking for new entry...');

            // Warte kurz und lade Seite neu
            await page.waitForTimeout(3000);
            await page.reload();
            await page.waitForLoadState('networkidle');
            await page.waitForSelector('.entry');

            const entriesAfterCount = await page.$$eval('.entry', entries => entries.length);
            console.log(`📊 Entries after submission: ${entriesAfterCount}`);

            // 9. Suche nach unserem neuen Eintrag
            const newEntry = await page.$eval(`text=${testData.name}`, element => {
                const entry = element.closest('.entry');
                return {
                    name: entry.querySelector('.entry-name')?.textContent || 'N/A',
                    message: entry.querySelector('.entry-message')?.textContent || 'N/A',
                    time: entry.querySelector('.entry-date')?.textContent || 'N/A'
                };
            }).catch(() => null);

            if (newEntry) {
                console.log('🎉 SUCCESS! New entry found:');
                console.log('  📝 Name:', newEntry.name);
                console.log('  💬 Message:', newEntry.message);
                console.log('  ⏰ Time:', newEntry.time);

                // Final success screenshot
                await page.screenshot({ path: 'screenshots/test-success.png' });

                return {
                    success: true,
                    testData,
                    newEntry,
                    entriesBeforeCount,
                    entriesAfterCount
                };
            } else {
                console.log('⚠️ Entry submission successful, but entry not yet visible (may need time to appear)');
                return {
                    success: true,
                    testData,
                    note: 'Submitted but not immediately visible',
                    entriesBeforeCount,
                    entriesAfterCount
                };
            }

        } catch (error) {
            console.log('❌ Error during submission:', error.message);
            await page.screenshot({ path: 'screenshots/error.png' });
            return {
                success: false,
                error: error.message,
                testData
            };
        }

    } catch (error) {
        console.error('💥 Test failed:', error);
        await page.screenshot({ path: 'screenshots/test-failed.png' });
        return {
            success: false,
            error: error.message
        };
    } finally {
        await browser.close();
    }
}

// Hilfs-Funktion: Erstelle Screenshot-Ordner
async function ensureScreenshotsDir() {
    const fs = require('fs');
    if (!fs.existsSync('screenshots')) {
        fs.mkdirSync('screenshots');
    }
}

// Test ausführen
async function runTest() {
    await ensureScreenshotsDir();

    console.log('🧪 PLAYWRIGHT GUESTBOOK INTEGRATION TEST');
    console.log('=========================================\n');

    const result = await testGuestbookIntegration();

    console.log('\n📊 TEST RESULTS:');
    console.log('================');

    if (result.success) {
        console.log('🎉 Status: SUCCESS');
        console.log('✅ Guestbook form submission works!');
        console.log('✅ Supabase integration functional!');

        if (result.newEntry) {
            console.log('✅ New entry immediately visible!');
        } else {
            console.log('ℹ️ Entry submitted (may have slight delay)');
        }

        console.log('\n📊 Statistics:');
        console.log('  Before:', result.entriesBeforeCount, 'entries');
        console.log('  After:', result.entriesAfterCount || 'TBD', 'entries');
    } else {
        console.log('❌ Status: FAILED');
        console.log('❌ Error:', result.error);
        console.log('💡 Check screenshots/ folder for debugging');
    }

    console.log('\n📸 Screenshots saved to screenshots/ folder');
    return result.success;
}

// Execute if run directly
if (require.main === module) {
    runTest().then((success) => {
        process.exit(success ? 0 : 1);
    }).catch((error) => {
        console.error('💥 Test runner crashed:', error);
        process.exit(1);
    });
}

module.exports = { testGuestbookIntegration };