const { chromium } = require('playwright');

async function testAllGames() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto('http://localhost:8003');
    await page.waitForTimeout(1000);

    // Test 1: Check game class availability
    const gameClasses = await page.evaluate(() => {
        return {
            AquariumCollectorGame: typeof window.AquariumCollectorGame,
            FishMemoryGame: typeof window.FishMemoryGame,
            AquariumBuilderGame: typeof window.AquariumBuilderGame,
            FishRacingGame: typeof window.FishRacingGame,
            FishCareSimulation: typeof window.FishCareSimulation
        };
    });
    
    console.log('Game Classes Available:');
    Object.entries(gameClasses).forEach(([name, gameType]) => {
        const ok = gameType === 'function';
        console.log(`  ${ok ? '✅' : '❌'} ${name}: ${gameType}`);
    });

    // Test 2: Check inline Aquarium Collector
    const collectorCanvas = await page.evaluate(() => {
        const canvas = document.getElementById('aquarium-game-canvas');
        return canvas ? {
            exists: true,
            width: canvas.width,
            height: canvas.height,
            style: canvas.style.display
        } : { exists: false };
    });
    
    console.log('\nInline Aquarium Collector Canvas:', collectorCanvas);

    // Test 3: Check modal structure
    const modalStructure = await page.evaluate(() => {
        return {
            modal: !!document.getElementById('game-modal'),
            modalTitle: !!document.getElementById('game-modal-title'),
            modalBody: !!document.getElementById('game-modal-body'),
            modalClose: !!document.querySelector('.close-modal')
        };
    });
    
    console.log('\nModal Structure:', modalStructure);

    await browser.close();
    
    const allOK = Object.values(gameClasses).every(t => t === 'function') &&
                  collectorCanvas.exists &&
                  Object.values(modalStructure).every(Boolean);
    
    console.log('\n' + (allOK ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED'));
    
    return allOK;
}

testAllGames().catch(console.error);
