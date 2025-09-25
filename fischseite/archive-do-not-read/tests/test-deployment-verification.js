// 🧪 Deployment Verification Test
// Tests if GitHub Actions deployment to live website worked

const { chromium } = require('playwright');

async function testDeployment() {
    console.log('🚀 DEPLOYMENT VERIFICATION TEST\n');

    const browser = await chromium.launch({
        headless: true
    });

    const context = await browser.newContext({
        // Disable cache to get fresh version
        extraHTTPHeaders: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    });

    const page = await context.newPage();

    try {
        // Test 1: Local Version Check
        console.log('📍 Testing LOCAL version...');
        await page.goto('file://' + __dirname + '/index.html');
        await page.waitForTimeout(2000);

        const localContent = await page.content();
        const localHasVersion = localContent.includes('VERSION 2.1 - GitHub Actions Deployment Test');

        console.log('✅ Local version contains VERSION 2.1:', localHasVersion);

        // Test 2: Live Website Check (if URL is available)
        // Note: We need the actual domain URL to test this
        console.log('\n🌐 Testing LIVE website...');

        // This would need the actual domain
        // const liveUrl = 'https://your-domain.com'; // Replace with actual URL

        console.log('ℹ️ Live website testing requires actual domain URL');
        console.log('📝 Manual verification steps:');
        console.log('   1. Open your live website in incognito mode');
        console.log('   2. View page source (Ctrl+U or Cmd+Option+U)');
        console.log('   3. Search for "VERSION 2.1 - GitHub Actions Deployment Test"');
        console.log('   4. If found: ✅ Deployment successful!');
        console.log('   5. If not found: ⏳ Wait 2-5 more minutes, clear cache, retry');

        // Test 3: Basic functionality check
        console.log('\n🎮 Testing basic website functionality...');

        await page.goto('file://' + __dirname + '/index.html');
        await page.waitForLoadState('networkidle');

        // Check if main elements are present
        const title = await page.title();
        const hasAquariumGame = await page.locator('#aquarium-collector-game').isVisible();
        const hasGallery = await page.locator('.gallery-container').isVisible();

        console.log('📄 Page title:', title);
        console.log('🎮 Aquarium game present:', hasAquariumGame);
        console.log('🖼️ Gallery present:', hasGallery);

        // Test 4: CSS and JavaScript loading
        const cssLoaded = await page.evaluate(() => {
            const styles = window.getComputedStyle(document.body);
            return styles.background.includes('gradient') || styles.background.includes('blue');
        });

        console.log('🎨 CSS loaded correctly:', cssLoaded);

        // Test 5: JavaScript functionality
        const jsWorking = await page.evaluate(() => {
            return typeof window.initializeAquariumCollectorGame === 'function';
        });

        console.log('🔧 JavaScript loaded:', jsWorking);

        console.log('\n📊 LOCAL TEST RESULTS SUMMARY:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Version 2.1 in source:', localHasVersion ? 'PASS' : 'FAIL');
        console.log('✅ Page loads correctly:', title ? 'PASS' : 'FAIL');
        console.log('✅ Game module present:', hasAquariumGame ? 'PASS' : 'FAIL');
        console.log('✅ Gallery present:', hasGallery ? 'PASS' : 'FAIL');
        console.log('✅ CSS working:', cssLoaded ? 'PASS' : 'FAIL');
        console.log('✅ JavaScript working:', jsWorking ? 'PASS' : 'FAIL');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const allTestsPassed = localHasVersion && title && hasAquariumGame && hasGallery && cssLoaded && jsWorking;

        if (allTestsPassed) {
            console.log('🎉 ALL LOCAL TESTS PASSED!');
            console.log('✅ The website is ready for deployment');
            console.log('🌐 Check live website manually for deployment verification');
        } else {
            console.log('⚠️ Some tests failed - check the issues above');
        }

        return allTestsPassed;

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

// Run the test
testDeployment().then((success) => {
    console.log('\n🏁 Test completed with status:', success ? 'SUCCESS' : 'FAILURE');
    process.exit(success ? 0 : 1);
}).catch((error) => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
});