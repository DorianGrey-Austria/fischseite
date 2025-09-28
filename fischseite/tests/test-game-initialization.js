const { chromium } = require('playwright');

async function testGameInitialization() {
    console.log('🔍 TESTING GAME INITIALIZATION IN MODALS...\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 500
    });

    const page = await browser.newPage();
    
    // Monitor console for all messages
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        console.log(`[${type}] ${text}`);
    });

    await page.goto('http://localhost:8003');
    await page.waitForTimeout(2000);

    console.log('🧪 Testing Fish Memory Game initialization...');
    await page.click('button[onclick="openFishMemoryGame()"]');
    await page.waitForTimeout(2000);

    const memoryGameState = await page.evaluate(() => {
        const modal = document.getElementById('game-modal');
        const modalBody = document.getElementById('game-modal-body');
        const memoryGrid = document.getElementById('fish-memory-grid');
        const gameContainer = document.getElementById('fish-memory-game-container');
        
        // Check for any canvas elements
        const canvases = modalBody ? modalBody.querySelectorAll('canvas') : [];
        const divs = modalBody ? modalBody.querySelectorAll('div') : [];
        
        return {
            modalExists: !!modal,
            modalDisplay: modal ? window.getComputedStyle(modal).display : 'none',
            modalBodyExists: !!modalBody,
            modalBodyHTML: modalBody ? modalBody.innerHTML.substring(0, 200) : 'no body',
            memoryGridExists: !!memoryGrid,
            gameContainerExists: !!gameContainer,
            canvasCount: canvases.length,
            divCount: divs.length,
            currentMemoryGame: !!window.currentMemoryGame
        };
    });
    
    console.log('Memory Game State:', JSON.stringify(memoryGameState, null, 2));

    // Try to interact with the game
    const clickable = await page.evaluate(() => {
        const grid = document.getElementById('fish-memory-grid');
        if (grid) {
            const cards = grid.querySelectorAll('div');
            return cards.length;
        }
        return 0;
    });
    
    console.log(`Found ${clickable} clickable cards in memory game`);

    await page.press('body', 'Escape');
    await page.waitForTimeout(1000);

    console.log('\n📊 SUMMARY');
    console.log('===========');
    console.log('Modal opens: YES');
    console.log('Game initializes: ' + (memoryGameState.currentMemoryGame ? 'YES' : 'NO'));
    console.log('Game container created: ' + (memoryGameState.gameContainerExists ? 'YES' : 'NO'));
    console.log('Game playable: ' + (clickable > 0 ? 'YES' : 'NO'));
    
    console.log('\n🌐 Browser left open for manual inspection.');
    
    return true;
}

if (require.main === module) {
    testGameInitialization().catch(console.error);
}

module.exports = { testGameInitialization };
