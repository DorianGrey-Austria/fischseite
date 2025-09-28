/* 🐟 ISOLATED TEST: SMART FISH SYSTEM
 * Tests: Fish Spawning, Click-to-Spawn, Animation, Layer-System, Maximum Limits
 */

const { chromium } = require('playwright');

async function testSmartFishSystem() {
    console.log('🐟 Testing Smart Fish System...\n');

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await browser.newPage();

    const results = {
        systemInitialized: false,
        initialFishSpawn: false,
        clickToSpawn: false,
        fishAnimation: false,
        layerSystem: false,
        maximumLimits: false,
        soundIntegration: false
    };

    try {
        console.log('📖 Loading page...');
        await page.goto('http://localhost:8003');
        await page.waitForLoadState('networkidle');

        // Test 1: Smart Fish System initialized
        console.log('🎮 Testing system initialization...');
        const systemInitialized = await page.evaluate(() => {
            return typeof window.smartFishSystem !== 'undefined' ||
                   typeof window.SMART_FISH_SYSTEM_INITIALIZED !== 'undefined';
        });
        results.systemInitialized = systemInitialized;
        console.log(`   System Initialized: ${results.systemInitialized ? '✅' : '❌'}`);

        // Test 2: Initial fish spawn (should have some starter fish)
        console.log('🐠 Testing initial fish spawn...');
        await page.waitForTimeout(3000);
        const initialFishCount = await page.locator('.fish-sprite, [class*="fish"], .swimming-fish').count();
        results.initialFishSpawn = initialFishCount > 0;
        console.log(`   Initial Fish Count: ${initialFishCount} (${results.initialFishSpawn ? '✅' : '❌'})`);

        // Test 3: Click-to-spawn functionality
        console.log('👆 Testing click-to-spawn...');
        if (initialFishCount > 0) {
            const existingFish = await page.locator('.fish-sprite, [class*="fish"], .swimming-fish').first();
            await existingFish.click();
            await page.waitForTimeout(2000);

            const newFishCount = await page.locator('.fish-sprite, [class*="fish"], .swimming-fish').count();
            results.clickToSpawn = newFishCount > initialFishCount;
            console.log(`   New Fish Count: ${newFishCount} (${results.clickToSpawn ? '✅' : '❌'})`);
        } else {
            // Try clicking on hero area if no fish
            const heroArea = await page.locator('.hero-content, .aquarium-area, .fish-container').first();
            if (await heroArea.isVisible()) {
                await heroArea.click();
                await page.waitForTimeout(2000);
                const spawnedFish = await page.locator('.fish-sprite, [class*="fish"], .swimming-fish').count();
                results.clickToSpawn = spawnedFish > 0;
                console.log(`   Spawned Fish: ${spawnedFish} (${results.clickToSpawn ? '✅' : '❌'})`);
            } else {
                results.clickToSpawn = false;
            }
        }

        // Test 4: Fish animation (check if fish are moving)
        console.log('🎬 Testing fish animation...');
        const fishElements = await page.locator('.fish-sprite, [class*="fish"], .swimming-fish');
        const fishCount = await fishElements.count();

        if (fishCount > 0) {
            // Get initial position of first fish
            const firstFish = fishElements.first();
            const initialPosition = await firstFish.boundingBox();

            await page.waitForTimeout(2000);

            // Check if position changed (animation)
            const finalPosition = await firstFish.boundingBox();
            const positionChanged = initialPosition && finalPosition &&
                (Math.abs(initialPosition.x - finalPosition.x) > 5 ||
                 Math.abs(initialPosition.y - finalPosition.y) > 5);

            results.fishAnimation = positionChanged;
            console.log(`   Animation Active: ${results.fishAnimation ? '✅' : '❌'}`);
        } else {
            results.fishAnimation = false;
            console.log(`   Animation Active: ❌ (No fish to animate)`);
        }

        // Test 5: Layer system (different z-index/opacity levels)
        console.log('🎨 Testing layer system...');
        const layerElements = await page.evaluate(() => {
            const fishElements = document.querySelectorAll('.fish-sprite, [class*="fish"], .swimming-fish');
            const layers = { foreground: 0, midground: 0, background: 0 };

            fishElements.forEach(fish => {
                const styles = window.getComputedStyle(fish);
                const zIndex = parseInt(styles.zIndex) || 0;
                const opacity = parseFloat(styles.opacity) || 1;

                if (zIndex >= 150 || opacity > 0.8) layers.foreground++;
                else if (zIndex >= 100 || opacity > 0.5) layers.midground++;
                else layers.background++;
            });

            return layers;
        });

        const totalLayerFish = layerElements.foreground + layerElements.midground + layerElements.background;
        results.layerSystem = totalLayerFish > 0;
        console.log(`   Layer Distribution: F:${layerElements.foreground} M:${layerElements.midground} B:${layerElements.background} (${results.layerSystem ? '✅' : '❌'})`);

        // Test 6: Maximum limits (should enforce 15 fish max)
        console.log('🚫 Testing maximum limits...');
        const currentFishCount = await page.locator('.fish-sprite, [class*="fish"], .swimming-fish').count();
        results.maximumLimits = currentFishCount <= 15;
        console.log(`   Fish Count: ${currentFishCount}/15 (${results.maximumLimits ? '✅' : '❌'})`);

        // Test 7: Sound integration
        console.log('🔊 Testing sound integration...');
        const soundSystemAvailable = await page.evaluate(() => {
            return typeof window.aquariumSounds !== 'undefined';
        });
        results.soundIntegration = soundSystemAvailable;
        console.log(`   Sound System: ${results.soundIntegration ? '✅' : '❌'}`);

        // Summary
        const passed = Object.values(results).filter(r => r).length;
        const total = Object.keys(results).length;

        console.log('\n📊 SMART FISH SYSTEM TEST RESULTS:');
        console.log(`   Passed: ${passed}/${total} tests`);
        console.log(`   Success Rate: ${Math.round((passed/total)*100)}%`);

        Object.entries(results).forEach(([test, result]) => {
            console.log(`   ${test}: ${result ? '✅ PASS' : '❌ FAIL'}`);
        });

        // Keep browser open for manual verification
        console.log('\n👁️ Browser kept open for 5 seconds for visual verification...');
        await page.waitForTimeout(5000);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }

    return results;
}

// Self-executing test
if (require.main === module) {
    testSmartFishSystem().then(() => {
        console.log('🐟 Smart Fish System test completed');
    });
}

module.exports = { testSmartFishSystem };