const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({
        headless: false,
        args: ['--no-sandbox']
    });

    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });

    const page = await context.newPage();

    try {
        // Log all console messages including loading messages
        page.on('console', msg => {
            console.log('BROWSER:', msg.text());
        });

        // Check before page load
        const beforeLoad = await page.evaluate(() => {
            return {
                smartFishInitialized: window.SMART_FISH_SYSTEM_INITIALIZED,
                fishSystemAPI: typeof window.fishSystemAPI,
                smartFishSystem: typeof window.smartFishSystem
            };
        });
        console.log('Before page load:', beforeLoad);

        await page.goto('http://localhost:8080');
        console.log('📖 Page loaded...');

        await page.waitForTimeout(1000);

        // Check after page load but before scripts run
        const afterLoad = await page.evaluate(() => {
            return {
                smartFishInitialized: window.SMART_FISH_SYSTEM_INITIALIZED,
                fishSystemAPI: typeof window.fishSystemAPI,
                smartFishSystem: typeof window.smartFishSystem,
                scripts: Array.from(document.scripts).map(s => s.src).filter(s => s.includes('fish'))
            };
        });
        console.log('After page load:', afterLoad);

        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Final check
        const final = await page.evaluate(() => {
            return {
                smartFishInitialized: window.SMART_FISH_SYSTEM_INITIALIZED,
                fishSystemAPI: typeof window.fishSystemAPI,
                smartFishSystem: typeof window.smartFishSystem
            };
        });
        console.log('Final state:', final);

        await page.waitForTimeout(3000);

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
})();