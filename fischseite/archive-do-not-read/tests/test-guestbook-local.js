// 💬 Test Guestbook Local Functionality
const { chromium } = require('playwright');

async function testGuestbookLocal() {
    console.log('🧪 LOCAL GUESTBOOK FUNCTIONALITY TEST\n');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();

    try {
        console.log('📍 Opening local guestbook...');
        await page.goto('http://localhost:8080/guestbook.html');
        await page.waitForLoadState('networkidle');

        // Check if page loads
        const title = await page.title();
        console.log('📄 Page title:', title);

        // Check for VERSION 2.2
        const content = await page.content();
        const hasVersion = content.includes('VERSION 2.2 - Guestbook Deployment Fix');
        console.log('✅ VERSION 2.2 in source:', hasVersion);

        // Check if form is visible
        const formVisible = await page.locator('.guestbook-form').isVisible();
        console.log('📝 Guestbook form visible:', formVisible);

        // Check if entries container exists
        const entriesVisible = await page.locator('.entries-container').isVisible();
        console.log('📋 Entries container visible:', entriesVisible);

        // Check if Supabase script loaded
        const supabaseLoaded = await page.evaluate(() => {
            return typeof window.supabase !== 'undefined';
        });
        console.log('🗄️ Supabase script loaded:', supabaseLoaded);

        // Wait for guestbook to initialize
        await page.waitForTimeout(3000);

        // Check if entries are loaded from Supabase
        const entriesLoaded = await page.evaluate(() => {
            const entries = document.querySelectorAll('.guestbook-entry');
            return entries.length > 0;
        });
        console.log('📊 Entries loaded from Supabase:', entriesLoaded);

        if (entriesLoaded) {
            const entryCount = await page.evaluate(() => {
                return document.querySelectorAll('.guestbook-entry').length;
            });
            console.log('📈 Number of entries displayed:', entryCount);

            // Check if Claude's entry is visible
            const claudeEntryVisible = await page.locator('text=Claude Code Assistant').isVisible();
            console.log('🤖 Claude entry visible:', claudeEntryVisible);
        }

        console.log('\n📊 LOCAL TEST RESULTS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Page loads:', title ? 'PASS' : 'FAIL');
        console.log('✅ VERSION 2.2:', hasVersion ? 'PASS' : 'FAIL');
        console.log('✅ Form visible:', formVisible ? 'PASS' : 'FAIL');
        console.log('✅ Supabase loaded:', supabaseLoaded ? 'PASS' : 'FAIL');
        console.log('✅ Entries loaded:', entriesLoaded ? 'PASS' : 'FAIL');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const allPassed = title && hasVersion && formVisible && supabaseLoaded && entriesLoaded;

        if (allPassed) {
            console.log('🎉 ALL LOCAL TESTS PASSED!');
            console.log('✅ Guestbook is fully functional locally');
            console.log('⏳ Now waiting for GitHub Actions deployment...');
        } else {
            console.log('⚠️ Some issues detected - check above');
        }

        return allPassed;

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

testGuestbookLocal().then((success) => {
    console.log('\n🏁 Local test completed:', success ? 'SUCCESS' : 'FAILURE');
    process.exit(success ? 0 : 1);
}).catch((error) => {
    console.error('💥 Local test crashed:', error);
    process.exit(1);
});