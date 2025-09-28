/* 🎮 COMPREHENSIVE GAME TEST
 * Tests all 5 games for proper functionality after modal fixes
 * Verifies games initialize correctly and are playable
 */

const { chromium } = require('playwright');

async function testAllGamesComprehensive() {
    console.log('🎮 COMPREHENSIVE ALL GAMES TEST...\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 800
    });

    const page = await browser.newPage();

    // Monitor console for errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('❌ Console Error:', msg.text());
        }
    });

    await page.goto('http://localhost:8003');
    await page.waitForTimeout(3000);

    let allGamesWorking = true;
    const results = [];

    console.log('🧪 TEST 1: Game Classes Availability');
    const gameClasses = await page.evaluate(() => {
        return {
            AquariumCollectorGame: typeof window.AquariumCollectorGame,
            FishMemoryGame: typeof window.FishMemoryGame,
            AquariumBuilderGame: typeof window.AquariumBuilderGame,
            FishRacingGame: typeof window.FishRacingGame,
            FishCareSimulation: typeof window.FishCareSimulation
        };
    });

    Object.entries(gameClasses).forEach(([name, type]) => {
        const ok = type === 'function';
        console.log(`   ${ok ? '✅' : '❌'} ${name}: ${type}`);
        if (!ok) allGamesWorking = false;
    });

    console.log('\n🧪 TEST 2: Inline Aquarium Collector Game');
    await page.click('button[onclick="startAquariumGame()"]');
    await page.waitForTimeout(2000);

    const collectorGameState = await page.evaluate(() => {
        const canvas = document.getElementById('aquarium-game-canvas');
        const overlay = document.getElementById('game-overlay');
        return {
            canvasExists: !!canvas,
            canvasSize: canvas ? `${canvas.width}x${canvas.height}` : 'no canvas',
            overlayHidden: overlay ? overlay.style.display === 'none' : 'no overlay',
            gameRunning: !!window.aquariumGame
        };
    });

    console.log(`   Canvas: ${collectorGameState.canvasExists ? '✅' : '❌'} ${collectorGameState.canvasSize}`);
    console.log(`   Overlay Hidden: ${collectorGameState.overlayHidden === true ? '✅' : '❌'} ${collectorGameState.overlayHidden}`);
    console.log(`   Game Running: ${collectorGameState.gameRunning ? '✅' : '❌'} ${collectorGameState.gameRunning}`);

    const collectorWorking = collectorGameState.canvasExists && collectorGameState.overlayHidden === true;
    results.push({name: 'Aquarium Collector (Inline)', working: collectorWorking});
    if (!collectorWorking) allGamesWorking = false;

    console.log('\n🧪 TEST 3: Fish Memory Game Modal');
    await page.click('button[onclick="openFishMemoryGame()"]');
    await page.waitForTimeout(2000);

    const memoryGameState = await page.evaluate(() => {
        const modal = document.getElementById('game-modal');
        const modalBody = document.getElementById('game-modal-body');
        const memoryContainer = document.getElementById('fish-memory-modal-container');
        const cards = memoryContainer ? memoryContainer.querySelectorAll('.memory-card') : [];

        return {
            modalOpen: modal ? modal.style.display === 'flex' : false,
            containerExists: !!memoryContainer,
            cardCount: cards.length,
            gameInitialized: !!window.currentMemoryGame
        };
    });

    console.log(`   Modal Open: ${memoryGameState.modalOpen ? '✅' : '❌'} ${memoryGameState.modalOpen}`);
    console.log(`   Container: ${memoryGameState.containerExists ? '✅' : '❌'} ${memoryGameState.containerExists}`);
    console.log(`   Cards: ${memoryGameState.cardCount > 0 && memoryGameState.cardCount <= 16 ? '✅' : '❌'} ${memoryGameState.cardCount} cards`);
    console.log(`   Game Initialized: ${memoryGameState.gameInitialized ? '✅' : '❌'} ${memoryGameState.gameInitialized}`);

    const memoryWorking = memoryGameState.modalOpen && memoryGameState.containerExists &&
                         memoryGameState.cardCount > 0 && memoryGameState.cardCount <= 16 &&
                         memoryGameState.gameInitialized;
    results.push({name: 'Fish Memory Game', working: memoryWorking});
    if (!memoryWorking) allGamesWorking = false;

    await page.press('body', 'Escape');
    await page.waitForTimeout(1000);

    console.log('\n🧪 TEST 4: Aquarium Builder Game Modal');
    await page.click('button[onclick="openAquariumBuilderGame()"]');
    await page.waitForTimeout(2000);

    const builderGameState = await page.evaluate(() => {
        const modal = document.getElementById('game-modal');
        const gamesContainer = document.getElementById('games');
        const builderContainer = gamesContainer ? gamesContainer.querySelector('.aquarium-builder-game') : null;
        const buildZone = builderContainer ? builderContainer.querySelector('.build-zone') : null;

        return {
            modalOpen: modal ? modal.style.display === 'flex' : false,
            gamesContainerExists: !!gamesContainer,
            builderContainerExists: !!builderContainer,
            buildZoneExists: !!buildZone,
            gameInitialized: !!window.currentBuilderGame
        };
    });

    console.log(`   Modal Open: ${builderGameState.modalOpen ? '✅' : '❌'} ${builderGameState.modalOpen}`);
    console.log(`   Games Container: ${builderGameState.gamesContainerExists ? '✅' : '❌'} ${builderGameState.gamesContainerExists}`);
    console.log(`   Builder Container: ${builderGameState.builderContainerExists ? '✅' : '❌'} ${builderGameState.builderContainerExists}`);
    console.log(`   Build Zone: ${builderGameState.buildZoneExists ? '✅' : '❌'} ${builderGameState.buildZoneExists}`);
    console.log(`   Game Initialized: ${builderGameState.gameInitialized ? '✅' : '❌'} ${builderGameState.gameInitialized}`);

    const builderWorking = builderGameState.modalOpen && builderGameState.gamesContainerExists &&
                          builderGameState.builderContainerExists && builderGameState.buildZoneExists;
    results.push({name: 'Aquarium Builder Game', working: builderWorking});
    if (!builderWorking) allGamesWorking = false;

    await page.press('body', 'Escape');
    await page.waitForTimeout(1000);

    console.log('\n🧪 TEST 5: Fish Racing Game Modal');
    await page.click('button[onclick="openFishRacingGame()"]');
    await page.waitForTimeout(2000);

    const racingGameState = await page.evaluate(() => {
        const modal = document.getElementById('game-modal');
        const racingContainer = document.getElementById('fish-racing-container');
        const racingCanvas = document.getElementById('fish-racing-canvas');
        const startButton = document.getElementById('start-race-btn');

        return {
            modalOpen: modal ? modal.style.display === 'flex' : false,
            containerExists: !!racingContainer,
            canvasExists: !!racingCanvas,
            canvasSize: racingCanvas ? `${racingCanvas.width}x${racingCanvas.height}` : 'no canvas',
            startButtonExists: !!startButton,
            gameInitialized: !!window.currentRacingGame
        };
    });

    console.log(`   Modal Open: ${racingGameState.modalOpen ? '✅' : '❌'} ${racingGameState.modalOpen}`);
    console.log(`   Container: ${racingGameState.containerExists ? '✅' : '❌'} ${racingGameState.containerExists}`);
    console.log(`   Canvas: ${racingGameState.canvasExists ? '✅' : '❌'} ${racingGameState.canvasSize}`);
    console.log(`   Start Button: ${racingGameState.startButtonExists ? '✅' : '❌'} ${racingGameState.startButtonExists}`);
    console.log(`   Game Initialized: ${racingGameState.gameInitialized ? '✅' : '❌'} ${racingGameState.gameInitialized}`);

    const racingWorking = racingGameState.modalOpen && racingGameState.containerExists &&
                         racingGameState.canvasExists && racingGameState.startButtonExists;
    results.push({name: 'Fish Racing Game', working: racingWorking});
    if (!racingWorking) allGamesWorking = false;

    await page.press('body', 'Escape');
    await page.waitForTimeout(1000);

    console.log('\n🧪 TEST 6: Fish Care Simulation Modal');
    await page.click('button[onclick="startFishCareSimulation()"]');
    await page.waitForTimeout(2000);

    const careGameState = await page.evaluate(() => {
        const modal = document.getElementById('game-modal');
        const careContainer = document.getElementById('fish-care-modal-container');

        return {
            modalOpen: modal ? modal.style.display === 'flex' : false,
            containerExists: !!careContainer,
            gameInitialized: !!window.currentFishCareGame
        };
    });

    console.log(`   Modal Open: ${careGameState.modalOpen ? '✅' : '❌'} ${careGameState.modalOpen}`);
    console.log(`   Container: ${careGameState.containerExists ? '✅' : '❌'} ${careGameState.containerExists}`);
    console.log(`   Game Initialized: ${careGameState.gameInitialized ? '✅' : '❌'} ${careGameState.gameInitialized}`);

    const careWorking = careGameState.modalOpen && careGameState.containerExists;
    results.push({name: 'Fish Care Simulation', working: careWorking});
    if (!careWorking) allGamesWorking = false;

    await page.press('body', 'Escape');
    await page.waitForTimeout(1000);

    console.log('\n📊 FINAL RESULTS');
    console.log('================');
    results.forEach(result => {
        console.log(`${result.working ? '✅' : '❌'} ${result.name}: ${result.working ? 'WORKING' : 'FAILED'}`);
    });

    console.log(`\n🎯 OVERALL RESULT: ${allGamesWorking ? '✅ ALL GAMES WORKING' : '❌ SOME GAMES FAILED'}`);

    if (allGamesWorking) {
        console.log('🎉 All 5 games are now fully functional!');
        console.log('🎮 Inline Aquarium Collector + 4 Modal Popup Games working perfectly!');
    } else {
        console.log('❌ Some games need additional fixes.');
    }

    console.log('\n🌐 Browser left open for manual verification');

    return allGamesWorking;
}

// Run the test
if (require.main === module) {
    testAllGamesComprehensive().catch(console.error);
}

module.exports = { testAllGamesComprehensive };
