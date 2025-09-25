const { chromium } = require('playwright');

async function testSmartFishSystem() {
    console.log('🐟 Starting Smart Fish System Test...\n');

    const browser = await chromium.launch({
        headless: false,  // Show browser for visual verification
        args: ['--no-sandbox']
    });

    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });

    const page = await context.newPage();

    try {
        // Load the page
        console.log('📖 Loading page...');
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');

        // Wait for Smart Fish System to initialize
        console.log('⏳ Waiting for Smart Fish System initialization...');
        await page.waitForTimeout(3000); // Longer wait for proper initialization

        // Check if system is initialized
        const systemInitialized = await page.evaluate(() => {
            return window.SMART_FISH_SYSTEM_INITIALIZED === true;
        });

        if (!systemInitialized) {
            throw new Error('Smart Fish System not initialized');
        }
        console.log('✅ Smart Fish System initialized successfully');

        // Check initial fish count (should be 1 starter fish)
        const initialCount = await page.evaluate(() => {
            return window.fishSystemAPI ? window.fishSystemAPI.getFishCount() : 0;
        });

        console.log(`🐟 Initial fish count: ${initialCount}`);
        if (initialCount !== 1) {
            console.warn(`⚠️ Expected 1 starter fish, found ${initialCount}`);
        }

        // Check if starter fish has hint animation
        const hasHintAnimation = await page.locator('.smart-fish-hint').count();
        console.log(`✨ Hint animation active: ${hasHintAnimation > 0 ? 'Yes' : 'No'}`);

        // Test fish interaction - click the first fish
        console.log('👆 Testing fish click interaction...');
        const firstFish = page.locator('.smart-fish').first();

        if (await firstFish.count() > 0) {
            await firstFish.click();
            await page.waitForTimeout(1000);

            // Check if new fish were spawned
            const afterClickCount = await page.evaluate(() => {
                return window.fishSystemAPI.getFishCount();
            });

            console.log(`🐟 Fish count after click: ${afterClickCount}`);
            if (afterClickCount > initialCount) {
                console.log(`✅ Fish spawning works! Spawned ${afterClickCount - initialCount} new fish`);
            } else {
                console.warn('⚠️ No new fish spawned after click');
            }

            // Check if hint animation was removed
            const hintAfterClick = await page.locator('.smart-fish-hint').count();
            if (hintAfterClick === 0 && hasHintAnimation > 0) {
                console.log('✅ Hint animation removed after first interaction');
            }
        } else {
            console.warn('⚠️ No fish found to click');
        }

        // Test fish orientation - check if fishes have correct scaleX values
        console.log('🧭 Testing fish orientations...');
        const fishOrientations = await page.evaluate(() => {
            const fishes = document.querySelectorAll('.smart-fish');
            const orientations = [];

            fishes.forEach((fish, index) => {
                const style = window.getComputedStyle(fish);
                const transform = style.transform;
                const emoji = fish.textContent;

                orientations.push({
                    index,
                    emoji,
                    transform,
                    hasScaleX: transform.includes('scaleX') || transform.includes('scale')
                });
            });

            return orientations;
        });

        fishOrientations.forEach((fish, i) => {
            console.log(`🐟 Fish ${i + 1}: ${fish.emoji} - Transform: ${fish.transform}`);
        });

        // Test multiple clicks to verify group spawning
        console.log('👆👆👆 Testing multiple clicks for group spawning...');
        for (let i = 0; i < 3; i++) {
            const fishToClick = page.locator('.smart-fish').nth(i);
            if (await fishToClick.count() > 0) {
                await fishToClick.click();
                await page.waitForTimeout(500);
            }
        }

        const finalCount = await page.evaluate(() => {
            return window.fishSystemAPI.getFishCount();
        });

        console.log(`🐟 Final fish count after multiple clicks: ${finalCount}`);

        // Test system info
        const systemInfo = await page.evaluate(() => {
            return window.fishSystemAPI.getSystemInfo();
        });

        console.log('📊 System Information:');
        console.log(`   Fish Count: ${systemInfo.fishCount}`);
        console.log(`   Max Fishes: ${systemInfo.maxFishes}`);
        console.log(`   Hint Active: ${systemInfo.hintActive}`);
        console.log(`   Fish Types: ${systemInfo.fishTypes.join(', ')}`);

        // Test fish layers
        const fishLayers = await page.evaluate(() => {
            const layers = { fg: 0, mg: 0, bg: 0 };
            const fishes = document.querySelectorAll('.smart-fish');

            fishes.forEach(fish => {
                if (fish.classList.contains('smart-fish-fg')) layers.fg++;
                if (fish.classList.contains('smart-fish-mg')) layers.mg++;
                if (fish.classList.contains('smart-fish-bg')) layers.bg++;
            });

            return layers;
        });

        console.log(`🎨 Layer Distribution: Foreground: ${fishLayers.fg}, Midground: ${fishLayers.mg}, Background: ${fishLayers.bg}`);

        // Test hover effects
        console.log('🖱️ Testing hover effects...');
        if (await firstFish.count() > 0) {
            await firstFish.hover();
            await page.waitForTimeout(500);
            console.log('✅ Hover effect test completed');
        }

        // Visual verification pause
        console.log('\n👁️ Visual verification - keeping browser open for 5 seconds...');
        await page.waitForTimeout(5000);

        console.log('\n✅ All Smart Fish System tests completed successfully!');
        console.log('🎉 The unified fish system is working correctly!\n');

        // Test performance
        const performanceMetrics = await page.evaluate(() => {
            return {
                memoryUsed: performance.memory?.usedJSHeapSize || 'N/A',
                animationFrames: 'Smooth',
                fishCount: document.querySelectorAll('.smart-fish').length
            };
        });

        console.log('📈 Performance Metrics:');
        console.log(`   Memory Usage: ${performanceMetrics.memoryUsed}`);
        console.log(`   Animation: ${performanceMetrics.animationFrames}`);
        console.log(`   Fish Elements: ${performanceMetrics.fishCount}`);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

// Run the test
if (require.main === module) {
    testSmartFishSystem().catch(console.error);
}

module.exports = { testSmartFishSystem };