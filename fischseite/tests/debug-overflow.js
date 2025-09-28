/* 🔧 OVERFLOW DIAGNOSTIC TOOL
 * Finds elements causing horizontal/vertical overflow
 */

const { chromium } = require('playwright');

async function debugOverflow() {
    console.log('🔍 Diagnosing overflow issues...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:8003');
        await page.waitForLoadState('networkidle');

        // Detect overflow elements
        const overflowElements = await page.evaluate(() => {
            const elements = [];
            const allElements = document.querySelectorAll('*');

            allElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);

                // Check for horizontal overflow
                if (rect.right > window.innerWidth) {
                    elements.push({
                        tag: el.tagName,
                        className: el.className,
                        id: el.id,
                        issue: 'horizontal_overflow',
                        right: rect.right,
                        width: rect.width,
                        overflow: style.overflow,
                        overflowX: style.overflowX
                    });
                }

                // Check for vertical overflow
                if (rect.bottom > window.innerHeight + 100) { // +100px tolerance
                    elements.push({
                        tag: el.tagName,
                        className: el.className,
                        id: el.id,
                        issue: 'vertical_overflow',
                        bottom: rect.bottom,
                        height: rect.height,
                        overflow: style.overflow,
                        overflowY: style.overflowY
                    });
                }
            });

            return elements;
        });

        console.log('🚨 OVERFLOW ELEMENTS FOUND:');
        console.log(`   Total: ${overflowElements.length} elements`);

        const screenWidth = await page.evaluate(() => window.innerWidth);
        const screenHeight = await page.evaluate(() => window.innerHeight);

        overflowElements.forEach((el, index) => {
            console.log(`\n${index + 1}. ${el.tag}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className.split(' ')[0] : ''}`);
            console.log(`   Issue: ${el.issue}`);
            if (el.issue === 'horizontal_overflow') {
                console.log(`   Right edge: ${el.right}px (screen: ${screenWidth}px)`);
                console.log(`   Width: ${el.width}px`);
            } else {
                console.log(`   Bottom edge: ${el.bottom}px (screen: ${screenHeight}px)`);
                console.log(`   Height: ${el.height}px`);
            }
            console.log(`   Overflow: ${el.overflow}, OverflowX: ${el.overflowX || 'N/A'}, OverflowY: ${el.overflowY || 'N/A'}`);
        });

        // Check specific game containers
        console.log('\n🎮 GAME CONTAINER ANALYSIS:');
        const gameContainers = await page.evaluate(() => {
            const containers = [];
            const gameElements = document.querySelectorAll('.game-container, [class*="game"], [class*="aquarium"]');

            gameElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);

                containers.push({
                    selector: `${el.tagName}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className.split(' ')[0] : ''}`,
                    width: rect.width,
                    height: rect.height,
                    visible: style.display !== 'none',
                    overflow: style.overflow,
                    position: style.position
                });
            });

            return containers;
        });

        gameContainers.forEach(container => {
            console.log(`   ${container.selector}: ${container.width}x${container.height}px, visible: ${container.visible}`);
        });

        console.log('\n✅ Diagnostic complete. Browser will close in 3 seconds...');
        await page.waitForTimeout(3000);

    } catch (error) {
        console.error('❌ Diagnostic failed:', error.message);
    } finally {
        await browser.close();
    }
}

// Run diagnostic
debugOverflow().then(() => {
    console.log('🔧 Overflow diagnostic completed');
});