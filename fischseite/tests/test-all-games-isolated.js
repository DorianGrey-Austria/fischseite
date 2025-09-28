/* 🎮 MASTER TEST RUNNER: ALL GAMES ISOLATED
 * Runs individual tests for all 5 games and provides comprehensive report
 */

const { testCollectorGame } = require('./test-game-collector');
const { testMemoryGame } = require('./test-game-memory');
const { testRacingGame } = require('./test-game-racing');
const { testBuilderGame } = require('./test-game-builder');
const { testSmartFishSystem } = require('./test-game-smart-fish');

async function runAllGameTests() {
    console.log('🎯 MASTER TEST RUNNER: ALL GAMES ISOLATED');
    console.log('===========================================\n');

    const startTime = Date.now();
    const testResults = {};

    try {
        // Test 1: Aquarium Collector Game
        console.log('🎮 1/5: AQUARIUM COLLECTOR GAME');
        console.log('--------------------------------');
        testResults.collector = await testCollectorGame();
        console.log('');

        // Wait between tests to prevent interference
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Test 2: Fish Memory Game
        console.log('🧠 2/5: FISH MEMORY GAME');
        console.log('-------------------------');
        testResults.memory = await testMemoryGame();
        console.log('');

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Test 3: Fish Racing Game
        console.log('🏁 3/5: FISH RACING GAME');
        console.log('-------------------------');
        testResults.racing = await testRacingGame();
        console.log('');

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Test 4: Aquarium Builder Game
        console.log('🏗️ 4/5: AQUARIUM BUILDER GAME');
        console.log('------------------------------');
        testResults.builder = await testBuilderGame();
        console.log('');

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Test 5: Smart Fish System
        console.log('🐟 5/5: SMART FISH SYSTEM');
        console.log('--------------------------');
        testResults.smartFish = await testSmartFishSystem();
        console.log('');

        // Generate comprehensive report
        generateComprehensiveReport(testResults, startTime);

    } catch (error) {
        console.error('❌ Master test runner failed:', error.message);
    }

    return testResults;
}

function generateComprehensiveReport(testResults, startTime) {
    const endTime = Date.now();
    const totalTime = Math.round((endTime - startTime) / 1000);

    console.log('📊 COMPREHENSIVE TEST REPORT');
    console.log('=============================\n');

    let totalTests = 0;
    let totalPassed = 0;
    const gameReports = [];

    Object.entries(testResults).forEach(([gameName, results]) => {
        const passed = Object.values(results).filter(r => r).length;
        const total = Object.keys(results).length;
        const successRate = Math.round((passed/total)*100);

        totalTests += total;
        totalPassed += passed;

        gameReports.push({
            name: gameName,
            passed,
            total,
            successRate,
            status: successRate >= 80 ? '✅ GOOD' : successRate >= 60 ? '⚠️ NEEDS WORK' : '❌ CRITICAL'
        });

        console.log(`🎮 ${gameName.toUpperCase()}:`);
        console.log(`   Tests: ${passed}/${total} (${successRate}%)`);
        console.log(`   Status: ${successRate >= 80 ? '✅ GOOD' : successRate >= 60 ? '⚠️ NEEDS WORK' : '❌ CRITICAL'}`);
        console.log('');
    });

    const overallSuccessRate = Math.round((totalPassed/totalTests)*100);

    console.log('🏆 OVERALL SUMMARY:');
    console.log(`   Total Tests: ${totalPassed}/${totalTests}`);
    console.log(`   Success Rate: ${overallSuccessRate}%`);
    console.log(`   Test Duration: ${totalTime}s`);
    console.log(`   Overall Grade: ${getGrade(overallSuccessRate)}`);

    console.log('\n🎯 PRIORITY ACTIONS:');
    gameReports
        .filter(game => game.successRate < 80)
        .sort((a, b) => a.successRate - b.successRate)
        .forEach(game => {
            console.log(`   🔧 ${game.name}: ${game.successRate}% - Needs improvement`);
        });

    if (overallSuccessRate >= 95) {
        console.log('\n🎉 EXCELLENT! All games performing well!');
    } else if (overallSuccessRate >= 80) {
        console.log('\n✅ GOOD! Minor improvements needed.');
    } else if (overallSuccessRate >= 60) {
        console.log('\n⚠️ MODERATE! Several games need attention.');
    } else {
        console.log('\n❌ CRITICAL! Major fixes required before deployment.');
    }

    console.log('\n' + '='.repeat(50));
}

function getGrade(percentage) {
    if (percentage >= 95) return 'A+ (EXCELLENT)';
    if (percentage >= 90) return 'A (VERY GOOD)';
    if (percentage >= 80) return 'B (GOOD)';
    if (percentage >= 70) return 'C (SATISFACTORY)';
    if (percentage >= 60) return 'D (NEEDS WORK)';
    return 'F (CRITICAL)';
}

// Self-executing master test
if (require.main === module) {
    runAllGameTests().then(() => {
        console.log('🎯 Master test runner completed');
        process.exit(0);
    });
}

module.exports = { runAllGameTests };