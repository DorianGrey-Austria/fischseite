const { chromium } = require('playwright');

async function testLocalhostServer() {
    console.log('🌐 Testing Fish System on Localhost Server');
    console.log('==========================================');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 50
    });
    const page = await browser.newPage();

    // Listen to all console messages
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        console.log(`[${type.toUpperCase()}] ${text}`);
    });

    // Listen to errors
    page.on('pageerror', error => {
        console.error('❌ Page Error:', error.message);
    });

    // Listen to network requests
    page.on('response', response => {
        const url = response.url();
        if (url.includes('fish') || url.includes('localhost:8000')) {
            console.log(`📡 ${response.status()} ${url}`);
        }
    });

    try {
        console.log('\n📍 Loading http://localhost:8000...');
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

        console.log('\n📍 Waiting for scripts to initialize...');
        await page.waitForTimeout(5000);

        // Check if fish system is loaded
        const systemStatus = await page.evaluate(() => {
            return {
                fishSystemExists: !!window.fishSystem,
                fishElementsFound: document.querySelectorAll('.simple-fish').length,
                scriptsLoaded: Array.from(document.querySelectorAll('script')).map(s => s.src).filter(s => s.includes('fish')),
                errors: window.fishSystemErrors || [],
                allFishElements: Array.from(document.querySelectorAll('div')).filter(d => d.className.includes('fish')).length
            };
        });

        console.log('\n📊 System Status:');
        console.log(`   Fish System Instance: ${systemStatus.fishSystemExists}`);
        console.log(`   Simple Fish Elements: ${systemStatus.fishElementsFound}`);
        console.log(`   All Fish-related Elements: ${systemStatus.allFishElements}`);
        console.log(`   Scripts loaded: ${systemStatus.scriptsLoaded.length}`);
        systemStatus.scriptsLoaded.forEach(script => {
            console.log(`     - ${script}`);
        });

        if (systemStatus.errors.length > 0) {
            console.log('❌ Errors:', systemStatus.errors);
        }

        // Test manual initialization if needed
        if (!systemStatus.fishSystemExists) {
            console.log('\n📍 Attempting manual troubleshooting...');

            const troubleshoot = await page.evaluate(() => {
                // Check if script is present
                const script = document.querySelector('script[src*="simple-fish-system"]');

                if (script) {
                    // Try to execute script content manually
                    return {
                        scriptFound: true,
                        scriptSrc: script.src,
                        scriptLoaded: script.onload !== null
                    };
                }

                return { scriptFound: false };
            });

            console.log('Troubleshoot result:', troubleshoot);
        }

        // If system exists, test functionality
        if (systemStatus.fishSystemExists || systemStatus.fishElementsFound > 0) {
            console.log('\n🎯 FISH SYSTEM DETECTED - RUNNING TESTS');

            // Test 1: Initial fish count
            console.log('\n📍 Test 1: Initial Fish');
            const fishCount = await page.$$eval('.simple-fish', els => els.length);
            console.log(`🐟 Fish on screen: ${fishCount}`);

            if (fishCount > 0) {
                // Test 2: Click interaction
                console.log('\n📍 Test 2: Click Interaction');

                try {
                    // Use force click to avoid stability issues
                    await page.locator('.simple-fish').first().click({ force: true });
                    await page.waitForTimeout(2000);

                    const fishCountAfterClick = await page.$$eval('.simple-fish', els => els.length);
                    console.log(`🐟 Fish after click: ${fishCountAfterClick}`);

                    if (fishCountAfterClick > fishCount) {
                        console.log('✅ Click spawning works!');
                    } else {
                        console.log('⚠️ Click spawning might not be working');
                    }
                } catch (clickError) {
                    console.log('⚠️ Click test failed:', clickError.message);
                }

                // Test 3: Fish animation and direction
                console.log('\n📍 Test 3: Fish Animation & Direction');

                const fishInfo = await page.evaluate(() => {
                    const fish = document.querySelectorAll('.simple-fish');
                    return Array.from(fish).map((f, i) => {
                        const style = getComputedStyle(f);
                        return {
                            index: i,
                            emoji: f.innerHTML,
                            position: { left: f.style.left, top: f.style.top },
                            transform: f.style.transform,
                            opacity: f.style.opacity,
                            layer: f.className.includes('foreground') ? 'foreground' : 'background',
                            clickable: style.pointerEvents !== 'none'
                        };
                    });
                });

                fishInfo.forEach(fish => {
                    const direction = fish.transform.includes('scaleX(-1)') ? 'Right (flipped)' : 'Right (normal)';
                    console.log(`🐟 ${fish.emoji} - ${direction} - ${fish.layer} - opacity: ${fish.opacity} - clickable: ${fish.clickable}`);
                });

                // Test 4: Long press
                console.log('\n📍 Test 4: Long Press Test');
                if (fishCount > 0) {
                    try {
                        await page.hover('.simple-fish');
                        await page.mouse.down();
                        await page.waitForTimeout(600);
                        await page.mouse.up();
                        await page.waitForTimeout(1500);

                        const fishCountAfterLongPress = await page.$$eval('.simple-fish', els => els.length);
                        console.log(`🐟 Fish after long press: ${fishCountAfterLongPress}`);

                        if (fishCountAfterLongPress < fishCount) {
                            console.log('✅ Long press removal works!');
                        } else {
                            console.log('⚠️ Long press removal might not be working');
                        }
                    } catch (longPressError) {
                        console.log('⚠️ Long press test failed:', longPressError.message);
                    }
                }
            }

            console.log('\n🎉 LOCALHOST SERVER TEST COMPLETED');
            console.log('==================================');

        } else {
            console.log('\n❌ FISH SYSTEM NOT DETECTED');
            console.log('============================');
            console.log('Possible issues:');
            console.log('- Script not loading properly');
            console.log('- JavaScript errors preventing initialization');
            console.log('- Timing issues with DOM loading');
        }

        // Keep browser open for manual inspection
        console.log('\n⏱️ Keeping browser open for manual inspection...');
        console.log('🌐 URL: http://localhost:8000');
        console.log('📱 Test fish interactions manually if needed');

        await page.waitForTimeout(30000); // 30 seconds for manual testing

    } catch (error) {
        console.error('❌ Test error:', error.message);
    } finally {
        await browser.close();
    }
}

testLocalhostServer().catch(console.error);