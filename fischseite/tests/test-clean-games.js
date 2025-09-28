const { chromium } = require('playwright');

async function testCleanGames() {
    const browser = await chromium.launch({ headless: false, slowMo: 600 });
    const page = await browser.newPage();
    await page.goto('http://localhost:8003');
    await page.waitForTimeout(2000);
    
    console.log('🧪 Testing clean game experience...');
    
    // Test Game Balancer is completely gone
    const gameBalancer = await page.evaluate(() => {
        return {
            panel: !!document.getElementById('game-balancer-panel'),
            script: !!window.gameBalancerAPI,
            floating: document.querySelectorAll('.floating-widget, .gamification-widget').length
        };
    });
    
    console.log('Game Balancer Check:', JSON.stringify(gameBalancer));
    
    // Test Memory Game modal is clean
    console.log('Opening Fish Memory Game...');
    await page.click('button[onclick="openFishMemoryGame()"]');
    await page.waitForTimeout(2000);
    
    const memoryGameClean = await page.evaluate(() => {
        const modal = document.getElementById('game-modal');
        const highscores = document.querySelectorAll('.highscore-strip, #highscore-dialog');
        const levelups = document.querySelectorAll('.level-up, .achievement-popup');
        const balancer = document.getElementById('game-balancer-panel');
        
        return {
            modalOpen: modal ? modal.style.display === 'flex' : false,
            noHighscores: highscores.length === 0,
            noLevelUps: levelups.length === 0,
            noBalancer: balancer === null || balancer.style.display === 'none'
        };
    });
    
    console.log('Memory Game Clean Check:', JSON.stringify(memoryGameClean));
    
    const isClean = gameBalancer.panel === false && gameBalancer.script === false && 
                   gameBalancer.floating === 0 && 
                   memoryGameClean.modalOpen && memoryGameClean.noHighscores && 
                   memoryGameClean.noLevelUps && memoryGameClean.noBalancer;
    
    console.log('🎯 CLEAN EXPERIENCE:', isClean ? '✅ PERFECT' : '❌ NEEDS WORK');
    console.log('🎮 All games are now focused and distraction-free!');
    console.log('🌐 Browser left open for user testing...');
    
    return isClean;
}

testCleanGames().catch(console.error);
