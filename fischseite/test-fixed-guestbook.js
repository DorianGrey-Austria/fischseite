// 🔧 Test Fixed Guestbook Version
const { chromium } = require('playwright');

async function testFixedGuestbook() {
    console.log('🧪 TESTING SIMPLE FIX GUESTBOOK\n');

    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext();

    // Listen to console messages
    context.on('console', msg => {
        const type = msg.type();
        console.log(`🌐 [${type.toUpperCase()}] ${msg.text()}`);
    });

    context.on('pageerror', error => {
        console.log('❌ PAGE ERROR:', error.message);
    });

    const page = await context.newPage();

    try {
        console.log('📍 Loading fixed guestbook...');
        await page.goto('http://localhost:8080/guestbook.html');
        await page.waitForLoadState('networkidle');

        // Check basic elements
        const title = await page.title();
        console.log('📄 Title:', title);

        const hasForm = await page.locator('#guestbookForm').isVisible();
        console.log('📝 Form visible:', hasForm);

        // Wait for entries to load
        console.log('\n⏳ Waiting for entries to load...');
        await page.waitForTimeout(5000);

        // Check if loading disappeared
        const loadingVisible = await page.locator('#loading').isVisible();
        console.log('⏳ Loading still visible:', loadingVisible);

        // Check entries
        const entries = await page.locator('.entry').count();
        console.log('📊 Entries loaded:', entries);

        if (entries > 0) {
            const firstEntry = await page.locator('.entry').first().textContent();
            console.log('🏆 First entry preview:', firstEntry.substring(0, 100) + '...');

            // Check if Claude's entry is there
            const claudeEntry = await page.locator('text=Claude Code Assistant').count();
            console.log('🤖 Claude entries found:', claudeEntry);
        }

        // Test form functionality
        console.log('\n📝 Testing form...');
        await page.fill('#name', 'Test User Local');
        await page.fill('#message', 'Test message from local Playwright test!');

        console.log('✅ Form filled successfully');

        console.log('\n📊 SIMPLE FIX TEST RESULTS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Page loads:', title ? 'PASS' : 'FAIL');
        console.log('✅ Form visible:', hasForm ? 'PASS' : 'FAIL');
        console.log('✅ Entries loaded:', entries > 0 ? 'PASS' : 'FAIL');
        console.log('✅ Form fillable:', 'PASS');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const success = title && hasForm && entries > 0;

        if (success) {
            console.log('🎉 SIMPLE FIX WORKS PERFECTLY!');
            console.log('✅ Ready for live deployment test');
        } else {
            console.log('⚠️ Some issues remain');
        }

        return success;

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

testFixedGuestbook().then((success) => {
    if (success) {
        console.log('\n🎯 LOCAL TEST: SUCCESS - Guestbook ready for live testing!');
        console.log('⏳ GitHub Actions should finish deployment in 2-3 minutes');
        console.log('🌐 Then test: vibecoding.company/fischseite/guestbook.html');
    } else {
        console.log('\n⚠️ LOCAL TEST: Issues detected');
    }
}).catch(console.error);