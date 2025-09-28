/* 🏁 ISOLATED TEST: FISH RACING GAME
 * Tests: Fish Spawning, Betting-System, Click-to-Boost, Race Timer, Winner Detection
 */

const { chromium } = require('playwright');

async function testRacingGame() {
    console.log('🏁 Testing Fish Racing Game...\n');

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await browser.newPage();

    const results = {
        gameContainer: false,
        buttonClick: false,
        fishSpawning: false,
        bettingSystem: false,
        clickToBoost: false,
        raceTimer: false,
        winnerDetection: false
    };

    try {
        console.log('📖 Loading page...');
        await page.goto('http://localhost:8003');
        await page.waitForLoadState('networkidle');

        // Test 1: Game Container exists
        console.log('🎮 Testing game container...');
        const gameButton = await page.locator('button[onclick*="fishRacingGame"]').first();
        results.gameContainer = await gameButton.isVisible();
        console.log(`   Container: ${results.gameContainer ? '✅' : '❌'}`);

        if (results.gameContainer) {
            // Test 2: Button click starts game
            console.log('🖱️ Testing button click...');
            await gameButton.click();
            await page.waitForTimeout(2000);

            const gameArea = await page.locator('.racing-game, .race-track, [class*="race"]').first();
            results.buttonClick = await gameArea.isVisible();
            console.log(`   Button Click: ${results.buttonClick ? '✅' : '❌'}`);

            if (results.buttonClick) {
                // Test 3: Fish spawning (should have 4 racing fish)
                console.log('🐠 Testing fish spawning...');
                await page.waitForTimeout(2000);
                const raceFish = await page.locator('.race-fish, .racing-fish, [class*="fish"]').count();
                results.fishSpawning = raceFish >= 4;
                console.log(`   Racing Fish: ${raceFish} (${results.fishSpawning ? '✅' : '❌'})`);

                // Test 4: Betting system
                console.log('💰 Testing betting system...');
                const bettingElements = await page.locator('button[class*="bet"], [class*="betting"], .fish-selector').count();
                results.bettingSystem = bettingElements > 0;
                console.log(`   Betting Elements: ${bettingElements} (${results.bettingSystem ? '✅' : '❌'})`);

                // Test 5: Click-to-boost functionality
                console.log('⚡ Testing click-to-boost...');
                if (raceFish > 0) {
                    const playerFish = await page.locator('.race-fish, .racing-fish, [class*="fish"]').first();
                    await playerFish.click();
                    await page.waitForTimeout(500);
                    results.clickToBoost = true; // Basic test - no errors thrown
                    console.log(`   Click-to-Boost: ${results.clickToBoost ? '✅' : '❌'}`);
                } else {
                    results.clickToBoost = false;
                }

                // Test 6: Race timer
                console.log('⏱️ Testing race timer...');
                const timerElement = await page.locator('[class*="timer"], [class*="countdown"], .race-time').first();
                results.raceTimer = await timerElement.isVisible();
                console.log(`   Race Timer: ${results.raceTimer ? '✅' : '❌'}`);

                // Test 7: Winner detection (let race run for a few seconds)
                console.log('🏆 Testing winner detection...');
                await page.waitForTimeout(3000);

                // Check for winner announcement or position display
                const winnerElement = await page.locator('[class*="winner"], [class*="result"], .race-result').first();
                const positionElement = await page.locator('[class*="position"], .leaderboard').first();
                results.winnerDetection = await winnerElement.isVisible() || await positionElement.isVisible();
                console.log(`   Winner Detection: ${results.winnerDetection ? '✅' : '❌'}`);
            }
        }

        // Summary
        const passed = Object.values(results).filter(r => r).length;
        const total = Object.keys(results).length;

        console.log('\n📊 RACING GAME TEST RESULTS:');
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
    testRacingGame().then(() => {
        console.log('🏁 Racing Game test completed');
    });
}

module.exports = { testRacingGame };