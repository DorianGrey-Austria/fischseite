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
        await page.goto('http://localhost:8080');

        // Log all console messages
        page.on('console', msg => {
            console.log('BROWSER:', msg.text());
        });

        // Wait for page load
        await page.waitForLoadState('networkidle');
        console.log('📖 Page loaded, waiting for initialization...');

        // Wait longer for starter fish
        await page.waitForTimeout(2000);

        // Check multiple times
        for (let i = 0; i < 5; i++) {
            await page.waitForTimeout(1000);

            const fishCount = await page.evaluate(() => {
                return {
                    apiCount: window.fishSystemAPI ? window.fishSystemAPI.getFishCount() : 'N/A',
                    domElements: document.querySelectorAll('.smart-fish').length,
                    hintActive: window.fishSystemAPI ? window.fishSystemAPI.getSystemInfo().hintActive : 'N/A'
                };
            });

            console.log(`Check ${i + 1}: API=${fishCount.apiCount}, DOM=${fishCount.domElements}, Hint=${fishCount.hintActive}`);

            if (fishCount.apiCount > 0) {
                console.log('✅ Starter fish found!');
                break;
            }
        }

        // Try a manual reset
        console.log('🔄 Trying manual reset...');
        await page.evaluate(() => {
            if (window.fishSystemAPI) {
                window.fishSystemAPI.reset();
            }
        });

        await page.waitForTimeout(1000);

        const afterReset = await page.evaluate(() => {
            return {
                apiCount: window.fishSystemAPI ? window.fishSystemAPI.getFishCount() : 'N/A',
                domElements: document.querySelectorAll('.smart-fish').length,
                hintActive: window.fishSystemAPI ? window.fishSystemAPI.getSystemInfo().hintActive : 'N/A'
            };
        });

        console.log(`After reset: API=${afterReset.apiCount}, DOM=${afterReset.domElements}, Hint=${afterReset.hintActive}`);

        // Keep browser open for visual inspection
        await page.waitForTimeout(5000);

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
})();