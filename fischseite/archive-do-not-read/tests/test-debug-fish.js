const { chromium } = require('playwright');

async function debugFishSystem() {
    console.log('🐟 Debug Smart Fish System...\n');

    const browser = await chromium.launch({
        headless: false,
        args: ['--no-sandbox']
    });

    const page = await context.newPage();

    try {
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');

        // Enable console logging
        page.on('console', msg => {
            if (msg.text().includes('🐟')) {
                console.log('BROWSER:', msg.text());
            }
        });

        console.log('⏳ Waiting for system initialization...');
        await page.waitForTimeout(3000);

        // Check system state
        const debugInfo = await page.evaluate(() => {
            return {
                initialized: window.SMART_FISH_SYSTEM_INITIALIZED,
                fishSystemExists: typeof window.fishSystemAPI !== 'undefined',
                fishCount: window.fishSystemAPI ? window.fishSystemAPI.getFishCount() : 'N/A',
                systemState: window.smartFishSystem ? Object.keys(window.smartFishSystem) : 'N/A',
                fishElements: document.querySelectorAll('.smart-fish').length
            };
        });

        console.log('🔍 Debug Info:', debugInfo);

        // Force fish creation
        console.log('🔧 Forcing fish creation via API...');
        await page.evaluate(() => {
            if (window.fishSystemAPI) {
                window.fishSystemAPI.spawnFish(200, 200, 'foreground');
            }
        });

        await page.waitForTimeout(1000);

        const afterForce = await page.evaluate(() => ({
            fishCount: window.fishSystemAPI ? window.fishSystemAPI.getFishCount() : 'N/A',
            fishElements: document.querySelectorAll('.smart-fish').length
        }));

        console.log('🔧 After forced spawn:', afterForce);

        await page.waitForTimeout(5000);

    } catch (error) {
        console.error('❌ Debug failed:', error);
    } finally {
        await browser.close();
    }
}

// Run with proper context
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
        await page.waitForLoadState('networkidle');

        // Enable console logging
        page.on('console', msg => {
            if (msg.text().includes('🐟')) {
                console.log('BROWSER:', msg.text());
            }
        });

        console.log('⏳ Waiting for system initialization...');
        await page.waitForTimeout(3000);

        // Check system state
        const debugInfo = await page.evaluate(() => {
            return {
                initialized: window.SMART_FISH_SYSTEM_INITIALIZED,
                fishSystemExists: typeof window.fishSystemAPI !== 'undefined',
                fishCount: window.fishSystemAPI ? window.fishSystemAPI.getFishCount() : 'N/A',
                systemState: window.smartFishSystem ? Object.keys(window.smartFishSystem) : 'N/A',
                fishElements: document.querySelectorAll('.smart-fish').length
            };
        });

        console.log('🔍 Debug Info:', debugInfo);

        // Force fish creation
        console.log('🔧 Forcing fish creation via API...');
        await page.evaluate(() => {
            if (window.fishSystemAPI) {
                window.fishSystemAPI.spawnFish(200, 200, 'foreground');
            }
        });

        await page.waitForTimeout(1000);

        const afterForce = await page.evaluate(() => ({
            fishCount: window.fishSystemAPI ? window.fishSystemAPI.getFishCount() : 'N/A',
            fishElements: document.querySelectorAll('.smart-fish').length
        }));

        console.log('🔧 After forced spawn:', afterForce);

        await page.waitForTimeout(5000);

    } catch (error) {
        console.error('❌ Debug failed:', error);
    } finally {
        await browser.close();
    }
})();