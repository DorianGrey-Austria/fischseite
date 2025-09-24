const { chromium } = require('playwright');

async function debugFishSystem() {
    console.log('🐛 Fish System Debug');
    console.log('===================');

    const browser = await chromium.launch({
        headless: false,
        devtools: true // Open dev tools
    });
    const page = await browser.newPage();

    // Listen to console logs
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();

        if (text.includes('fish') || text.includes('Fish') || text.includes('🐟')) {
            console.log(`[${type.toUpperCase()}] ${text}`);
        }
    });

    // Listen to errors
    page.on('pageerror', error => {
        console.error('❌ Page Error:', error.message);
    });

    try {
        console.log('\n📍 Loading website...');
        await page.goto(`file://${__dirname}/index.html`);

        console.log('\n📍 Waiting for scripts to load...');
        await page.waitForTimeout(5000);

        // Check if the fish manager is loaded
        const fishManagerStatus = await page.evaluate(() => {
            return {
                v1Exists: !!window.UnifiedFishManager,
                v2Exists: !!window.UnifiedFishManagerV2,
                fishManagerExists: !!window.fishManager,
                errors: window.fishSystemErrors || []
            };
        });

        console.log('📊 Fish Manager Status:');
        console.log(`   V1 Class Available: ${fishManagerStatus.v1Exists}`);
        console.log(`   V2 Class Available: ${fishManagerStatus.v2Exists}`);
        console.log(`   Fish Manager Instance: ${fishManagerStatus.fishManagerExists}`);

        if (fishManagerStatus.errors.length > 0) {
            console.log('❌ Errors found:', fishManagerStatus.errors);
        }

        // Check DOM elements
        const domStatus = await page.evaluate(() => {
            const styles = document.getElementById('unified-fish-styles-v2');
            const fish = document.querySelectorAll('.unified-fish');

            return {
                stylesLoaded: !!styles,
                fishCount: fish.length,
                allScripts: Array.from(document.querySelectorAll('script[src*="fish"]')).map(s => s.src)
            };
        });

        console.log('\n📊 DOM Status:');
        console.log(`   Styles loaded: ${domStatus.stylesLoaded}`);
        console.log(`   Fish elements: ${domStatus.fishCount}`);
        console.log(`   Fish scripts: ${domStatus.allScripts.length}`);
        domStatus.allScripts.forEach(script => {
            console.log(`     - ${script}`);
        });

        // Try manual initialization
        console.log('\n📍 Attempting manual initialization...');
        const manualInit = await page.evaluate(() => {
            try {
                if (window.UnifiedFishManagerV2) {
                    // Clean up existing
                    if (window.fishManager) {
                        window.fishManager.cleanup();
                    }

                    // Create new instance
                    window.fishManager = new window.UnifiedFishManagerV2();

                    return {
                        success: true,
                        fishCount: window.fishManager.getFishCount()
                    };
                } else {
                    return {
                        success: false,
                        error: 'UnifiedFishManagerV2 class not found'
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        });

        console.log('Manual Init Result:', manualInit);

        if (manualInit.success) {
            await page.waitForTimeout(2000);

            const finalFishCount = await page.evaluate(() => {
                return document.querySelectorAll('.unified-fish').length;
            });

            console.log(`🐟 Final fish count: ${finalFishCount}`);

            if (finalFishCount > 0) {
                console.log('✅ Fish system is working after manual init!');

                // Test a click
                console.log('\n📍 Testing click interaction...');
                await page.click('.unified-fish');
                await page.waitForTimeout(1000);

                const afterClickCount = await page.evaluate(() => {
                    return document.querySelectorAll('.unified-fish').length;
                });

                console.log(`🐟 After click: ${afterClickCount} fish`);
            }
        }

        console.log('\n⏱️ Keeping browser open for 30 seconds for inspection...');
        await page.waitForTimeout(30000);

    } catch (error) {
        console.error('❌ Debug error:', error.message);
    } finally {
        await browser.close();
    }
}

debugFishSystem().catch(console.error);