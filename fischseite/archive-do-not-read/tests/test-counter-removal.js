const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    console.log('🔍 Testing for fish counter presence...');

    try {
        await page.goto('http://localhost:8000');
        await page.waitForTimeout(2000); // Let page load

        // Look for any counter elements
        const counters = await page.$$eval('*', elements => {
            return elements.filter(el => {
                const text = el.textContent || '';
                const className = el.className || '';
                return text.includes('/10') ||
                       text.includes('Fische') ||
                       text.includes('counter') ||
                       className.includes('counter') ||
                       className.includes('fish-counter');
            }).map(el => ({
                tag: el.tagName,
                className: el.className,
                text: el.textContent?.substring(0, 100),
                id: el.id
            }));
        });

        console.log(`Found ${counters.length} potential counter elements:`);
        counters.forEach((counter, i) => {
            console.log(`  ${i + 1}. ${counter.tag} - class: "${counter.className}" - id: "${counter.id}"`);
            console.log(`     Text: "${counter.text}"`);
        });

        // Also check for visible UI elements that might be counters
        const visibleCounters = await page.$$eval('[style*="position"]', elements => {
            return elements.filter(el => {
                const style = window.getComputedStyle(el);
                const text = el.textContent || '';
                return style.position === 'fixed' &&
                       (text.includes('/') || text.includes('reset') || text.includes('Reset'));
            }).map(el => ({
                tag: el.tagName,
                text: el.textContent?.substring(0, 50),
                style: el.style.cssText
            }));
        });

        console.log(`Found ${visibleCounters.length} visible positioned counter elements:`);
        visibleCounters.forEach((counter, i) => {
            console.log(`  ${i + 1}. ${counter.tag} - Text: "${counter.text}"`);
            console.log(`     Style: ${counter.style}`);
        });

        // Check what fish system is active
        const fishSystemInfo = await page.evaluate(() => {
            return {
                smartFishSystemLoaded: !!window.SMART_FISH_SYSTEM_INITIALIZED,
                smartFishSystem: !!window.smartFishSystem,
                fishSystemAPI: !!window.fishSystemAPI,
                interactiveFishSpawner: !!window.fishSpawner
            };
        });

        console.log('🐟 Fish system status:', fishSystemInfo);

        // Take a screenshot for reference
        await page.screenshot({ path: 'fish-counter-test.png', fullPage: false });
        console.log('📸 Screenshot saved as fish-counter-test.png');

    } catch (error) {
        console.error('❌ Error during test:', error.message);
    } finally {
        await browser.close();
    }
})();