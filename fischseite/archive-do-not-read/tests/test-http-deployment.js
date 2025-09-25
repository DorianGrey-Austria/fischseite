// 🧪 HTTP Server Deployment Test
const { chromium } = require('playwright');

async function testHTTPDeployment() {
    console.log('🌐 HTTP SERVER DEPLOYMENT TEST\n');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        console.log('📍 Testing via HTTP server (localhost:8080)...');
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');

        // Check VERSION 2.1
        const content = await page.content();
        const hasVersion21 = content.includes('VERSION 2.1 - GitHub Actions Deployment Test');
        console.log('✅ VERSION 2.1 in source:', hasVersion21);

        // Test game presence
        const gameExists = await page.locator('#aquarium-collector-game').isVisible().catch(() => false);
        console.log('🎮 Aquarium game element:', gameExists);

        // Test gallery
        const galleryExists = await page.locator('.gallery-container').isVisible().catch(() => false);
        console.log('🖼️ Gallery element:', galleryExists);

        // Test JavaScript
        const jsLoaded = await page.evaluate(() => {
            return typeof window.initializeAquariumCollectorGame === 'function' ||
                   document.querySelectorAll('script[src*=".js"]').length > 0;
        }).catch(() => false);
        console.log('🔧 JavaScript modules loaded:', jsLoaded);

        // Test CSS
        const cssWorking = await page.evaluate(() => {
            const body = window.getComputedStyle(document.body);
            return body.background.includes('gradient') || body.background.includes('blue');
        }).catch(() => false);
        console.log('🎨 CSS working:', cssWorking);

        console.log('\n📊 HTTP SERVER TEST RESULTS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Version 2.1:', hasVersion21 ? 'PASS' : 'FAIL');
        console.log('✅ Game element:', gameExists ? 'PASS' : 'FAIL');
        console.log('✅ Gallery element:', galleryExists ? 'PASS' : 'FAIL');
        console.log('✅ JavaScript:', jsLoaded ? 'PASS' : 'FAIL');
        console.log('✅ CSS:', cssWorking ? 'PASS' : 'FAIL');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const allPassed = hasVersion21 && gameExists && galleryExists && jsLoaded && cssWorking;

        if (allPassed) {
            console.log('🎉 ALL HTTP TESTS PASSED!');
        } else {
            console.log('⚠️ Some HTTP tests failed');
        }

        return allPassed;

    } catch (error) {
        console.error('❌ HTTP test failed:', error.message);
        return false;
    } finally {
        await browser.close();
    }
}

testHTTPDeployment().then((success) => {
    process.exit(success ? 0 : 1);
}).catch((error) => {
    console.error('💥 HTTP test crashed:', error);
    process.exit(1);
});