const { chromium } = require('playwright');

async function debugModalGames() {
    console.log('🔍 DEBUGGING MODAL GAME INITIALIZATION...\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
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

    console.log('🧪 TEST 1: Checking if game classes exist');
    const gameClasses = await page.evaluate(() => {
        return {
            FishMemoryGame: typeof window.FishMemoryGame,
            AquariumBuilderGame: typeof window.AquariumBuilderGame,
            FishRacingGame: typeof window.FishRacingGame,
            FishCareSimulation: typeof window.FishCareSimulation
        };
    });
    console.log('Game Classes:', gameClasses);

    console.log('\n🧪 TEST 2: Testing Fish Memory Game Modal');
    await page.click('button[onclick="openFishMemoryGame()"]');
    await page.waitForTimeout(2000);

    const memoryModalState = await page.evaluate(() => {
        const modal = document.getElementById('game-modal');
        const modalGame = document.getElementById('modal-game-container');
        const canvas = modalGame ? modalGame.querySelector('canvas') : null;
        
        return {
            modalVisible: modal ? modal.style.display : 'no modal',
            modalGameExists: !!modalGame,
            canvasExists: !!canvas,
            canvasSize: canvas ? `${canvas.width}x${canvas.height}` : 'no canvas',
            gameInitialized: window.currentModalGame ? 'yes' : 'no'
        };
    });
    console.log('Memory Game Modal:', memoryModalState);

    // Close modal
    await page.press('body', 'Escape');
    await page.waitForTimeout(1000);

    console.log('\n🧪 TEST 3: Testing Aquarium Builder Game Modal');
    await page.click('button[onclick="openAquariumBuilderGame()"]');
    await page.waitForTimeout(2000);

    const builderModalState = await page.evaluate(() => {
        const modal = document.getElementById('game-modal');
        const modalGame = document.getElementById('modal-game-container');
        const canvas = modalGame ? modalGame.querySelector('canvas') : null;
        
        return {
            modalVisible: modal ? modal.style.display : 'no modal',
            modalGameExists: !!modalGame,
            canvasExists: !!canvas,
            canvasSize: canvas ? `${canvas.width}x${canvas.height}` : 'no canvas',
            gameInitialized: window.currentModalGame ? 'yes' : 'no'
        };
    });
    console.log('Builder Game Modal:', builderModalState);

    // Close modal
    await page.press('body', 'Escape');
    await page.waitForTimeout(1000);

    console.log('\n🧪 TEST 4: Testing Fish Racing Game Modal');
    await page.click('button[onclick="openFishRacingGame()"]');
    await page.waitForTimeout(2000);

    const racingModalState = await page.evaluate(() => {
        const modal = document.getElementById('game-modal');
        const modalGame = document.getElementById('modal-game-container');
        const canvas = modalGame ? modalGame.querySelector('canvas') : null;
        
        return {
            modalVisible: modal ? modal.style.display : 'no modal',
            modalGameExists: !!modalGame,
            canvasExists: !!canvas,
            canvasSize: canvas ? `${canvas.width}x${canvas.height}` : 'no canvas',
            gameInitialized: window.currentModalGame ? 'yes' : 'no'
        };
    });
    console.log('Racing Game Modal:', racingModalState);

    // Close modal
    await page.press('body', 'Escape');
    await page.waitForTimeout(1000);

    console.log('\n🧪 TEST 5: Testing Fish Care Simulation Modal');
    await page.click('button[onclick="startFishCareSimulation()"]');
    await page.waitForTimeout(2000);

    const careModalState = await page.evaluate(() => {
        const modal = document.getElementById('game-modal');
        const modalGame = document.getElementById('modal-game-container');
        const canvas = modalGame ? modalGame.querySelector('canvas') : null;
        
        return {
            modalVisible: modal ? modal.style.display : 'no modal',
            modalGameExists: !!modalGame,
            canvasExists: !!canvas,
            canvasSize: canvas ? `${canvas.width}x${canvas.height}` : 'no canvas',
            gameInitialized: window.currentModalGame ? 'yes' : 'no'
        };
    });
    console.log('Care Simulation Modal:', careModalState);

    console.log('\n🧪 TEST 6: Testing Inline Aquarium Collector Game');
    const collectorState = await page.evaluate(() => {
        const canvas = document.getElementById('aquarium-game-canvas');
        const container = document.querySelector('.aquarium-game-container');
        
        return {
            canvasExists: !!canvas,
            canvasSize: canvas ? `${canvas.width}x${canvas.height}` : 'no canvas',
            containerExists: !!container,
            gameRunning: window.aquariumGame ? 'yes' : 'no'
        };
    });
    console.log('Collector Game (inline):', collectorState);

    console.log('\n📊 SUMMARY');
    console.log('===========');
    
    // Keep browser open for inspection
    console.log('\n🌐 Browser left open for manual inspection.');
    console.log('Check the console for any error messages.');
    
    return true;
}

if (require.main === module) {
    debugModalGames().catch(console.error);
}

module.exports = { debugModalGames };
