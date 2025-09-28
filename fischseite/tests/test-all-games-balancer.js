/* 🎮 COMPREHENSIVE GAME BALANCER VISIBILITY TEST
 * Tests all 5 games and verifies Game Balancer visibility rules
 * - Game Balancer hidden by default
 * - Game Balancer shown when games start
 * - Game Balancer hidden when games end/close
 */

const { chromium } = require('playwright');

async function testAllGamesBalancer() {
    console.log('🎮 TESTING ALL GAMES WITH BALANCER VISIBILITY...\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000 // Slow motion for better observation
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:8003');
    await page.waitForTimeout(3000);

    const results = {
        gamesTestedTotal: 5,
        gamesPassed: 0,
        balancerTests: []
    };

    try {
        // 🧪 TEST 1: Game Balancer hidden by default
        console.log('🧪 TEST 1: Game Balancer hidden by default');
        const initialBalancerHidden = await page.evaluate(() => {
            const panel = document.getElementById('game-balancer-panel');
            return panel ? panel.style.transform === 'translateX(100%)' : true;
        });

        console.log(`   ${initialBalancerHidden ? '✅' : '❌'} Game Balancer initially hidden: ${initialBalancerHidden}`);
        results.balancerTests.push({ test: 'Initially Hidden', passed: initialBalancerHidden });

        // 🧪 TEST 2: Aquarium Collector (Inline Game)
        console.log('\n🧪 TEST 2: Aquarium Collector (Inline Game)');
        await page.click('button[onclick="startAquariumGame()"]');
        await page.waitForTimeout(2000);

        const aquariumBalancerVisible = await page.evaluate(() => {
            const panel = document.getElementById('game-balancer-panel');
            return panel ? panel.style.transform === 'translateX(0px)' : false;
        });

        console.log(`   ${aquariumBalancerVisible ? '✅' : '❌'} Game Balancer shown during Aquarium Game: ${aquariumBalancerVisible}`);
        results.balancerTests.push({ test: 'Aquarium Game Balancer Visible', passed: aquariumBalancerVisible });
        if (aquariumBalancerVisible) results.gamesPassed++;

        await page.reload();
        await page.waitForTimeout(2000);

        // 🧪 TEST 3: Fish Memory Game (Modal)
        console.log('\n🧪 TEST 3: Fish Memory Game (Modal)');
        await page.click('button[onclick="openFishMemoryGame()"]');
        await page.waitForTimeout(2000);

        const memoryBalancerVisible = await page.evaluate(() => {
            const panel = document.getElementById('game-balancer-panel');
            return panel ? panel.style.transform === 'translateX(0px)' : false;
        });

        console.log(`   ${memoryBalancerVisible ? '✅' : '❌'} Game Balancer shown during Memory Game: ${memoryBalancerVisible}`);
        results.balancerTests.push({ test: 'Memory Game Balancer Visible', passed: memoryBalancerVisible });
        if (memoryBalancerVisible) results.gamesPassed++;

        // Test modal close hides balancer
        await page.press('body', 'Escape');
        await page.waitForTimeout(1000);

        const memoryBalancerHidden = await page.evaluate(() => {
            const panel = document.getElementById('game-balancer-panel');
            return panel ? panel.style.transform === 'translateX(100%)' : true;
        });

        console.log(`   ${memoryBalancerHidden ? '✅' : '❌'} Game Balancer hidden after modal close: ${memoryBalancerHidden}`);
        results.balancerTests.push({ test: 'Memory Game Balancer Hidden After Close', passed: memoryBalancerHidden });

        // 🧪 TEST 4: Aquarium Builder Game (Modal)
        console.log('\n🧪 TEST 4: Aquarium Builder Game (Modal)');
        await page.click('button[onclick="openAquariumBuilderGame()"]');
        await page.waitForTimeout(2000);

        const builderBalancerVisible = await page.evaluate(() => {
            const panel = document.getElementById('game-balancer-panel');
            return panel ? panel.style.transform === 'translateX(0px)' : false;
        });

        console.log(`   ${builderBalancerVisible ? '✅' : '❌'} Game Balancer shown during Builder Game: ${builderBalancerVisible}`);
        results.balancerTests.push({ test: 'Builder Game Balancer Visible', passed: builderBalancerVisible });
        if (builderBalancerVisible) results.gamesPassed++;

        await page.press('body', 'Escape');
        await page.waitForTimeout(1000);

        // 🧪 TEST 5: Fish Racing Game (Modal)
        console.log('\n🧪 TEST 5: Fish Racing Game (Modal)');
        await page.click('button[onclick="openFishRacingGame()"]');
        await page.waitForTimeout(2000);

        const racingBalancerVisible = await page.evaluate(() => {
            const panel = document.getElementById('game-balancer-panel');
            return panel ? panel.style.transform === 'translateX(0px)' : false;
        });

        console.log(`   ${racingBalancerVisible ? '✅' : '❌'} Game Balancer shown during Racing Game: ${racingBalancerVisible}`);
        results.balancerTests.push({ test: 'Racing Game Balancer Visible', passed: racingBalancerVisible });
        if (racingBalancerVisible) results.gamesPassed++;

        await page.press('body', 'Escape');
        await page.waitForTimeout(1000);

        // 🧪 TEST 6: Fish Care Simulation (Modal)
        console.log('\n🧪 TEST 6: Fish Care Simulation (Modal)');
        await page.click('button[onclick="startFishCareSimulation()"]');
        await page.waitForTimeout(2000);

        const careBalancerVisible = await page.evaluate(() => {
            const panel = document.getElementById('game-balancer-panel');
            return panel ? panel.style.transform === 'translateX(0px)' : false;
        });

        console.log(`   ${careBalancerVisible ? '✅' : '❌'} Game Balancer shown during Care Simulation: ${careBalancerVisible}`);
        results.balancerTests.push({ test: 'Care Simulation Balancer Visible', passed: careBalancerVisible });
        if (careBalancerVisible) results.gamesPassed++;

        await page.press('body', 'Escape');
        await page.waitForTimeout(1000);

        // Final check: Balancer hidden after all tests
        const finalBalancerHidden = await page.evaluate(() => {
            const panel = document.getElementById('game-balancer-panel');
            return panel ? panel.style.transform === 'translateX(100%)' : true;
        });

        console.log(`\n🧪 FINAL CHECK: Game Balancer hidden after all tests: ${finalBalancerHidden ? '✅' : '❌'}`);
        results.balancerTests.push({ test: 'Finally Hidden', passed: finalBalancerHidden });

    } catch (error) {
        console.error('❌ Test failed:', error);
    }

    // 📊 FINAL RESULTS
    console.log('\n📊 FINAL TEST RESULTS');
    console.log('========================');
    console.log(`Games Tested: ${results.gamesTestedTotal}`);
    console.log(`Games Passed Balancer Test: ${results.gamesPassed}/${results.gamesTestedTotal}`);
    console.log(`Success Rate: ${((results.gamesPassed / results.gamesTestedTotal) * 100).toFixed(1)}%`);

    const passedBalancerTests = results.balancerTests.filter(t => t.passed).length;
    console.log(`Balancer Tests Passed: ${passedBalancerTests}/${results.balancerTests.length}`);

    console.log('\nDetailed Results:');
    results.balancerTests.forEach(test => {
        console.log(`  ${test.passed ? '✅' : '❌'} ${test.test}`);
    });

    const overallSuccess = results.gamesPassed === results.gamesTestedTotal && passedBalancerTests === results.balancerTests.length;
    console.log(`\n🎯 OVERALL RESULT: ${overallSuccess ? '✅ ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`);

    // Keep browser open for user inspection
    console.log('\n🌐 Browser left open for manual inspection. Close manually when done.');
    // await browser.close();

    return overallSuccess;
}

// Run the test
if (require.main === module) {
    testAllGamesBalancer().catch(console.error);
}

module.exports = { testAllGamesBalancer };