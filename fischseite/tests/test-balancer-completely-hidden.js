/* 🎮 COMPLETE GAME BALANCER INVISIBILITY TEST
 * Verifies that Game Balancer is 100% invisible on homepage
 * and only appears when games are started
 */

const { chromium } = require('playwright');

async function testBalancerCompletelyHidden() {
    console.log('🔍 TESTING COMPLETE GAME BALANCER INVISIBILITY...\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 500
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:8003');
    await page.waitForTimeout(3000);

    console.log('🧪 TEST 1: Game Balancer completely invisible on homepage');

    const balancerExists = await page.evaluate(() => {
        const panel = document.getElementById('game-balancer-panel');
        return panel ? true : false;
    });

    const balancerVisible = await page.evaluate(() => {
        const panel = document.getElementById('game-balancer-panel');
        if (!panel) return false;

        const styles = window.getComputedStyle(panel);
        const transform = panel.style.transform;
        const display = panel.style.display;

        console.log('Panel display:', display);
        console.log('Panel transform:', transform);
        console.log('Panel computed display:', styles.display);

        return styles.display !== 'none' && display !== 'none' && transform !== 'translateX(100%)';
    });

    console.log(`   Panel exists: ${balancerExists}`);
    console.log(`   ${balancerVisible ? '❌' : '✅'} Game Balancer completely hidden: ${!balancerVisible}`);

    console.log('\n🧪 TEST 2: Game Balancer shows when modal game opens');
    await page.click('button[onclick="openFishMemoryGame()"]');
    await page.waitForTimeout(2000);

    const balancerShownInModal = await page.evaluate(() => {
        const panel = document.getElementById('game-balancer-panel');
        if (!panel) return false;

        const display = panel.style.display;
        const transform = panel.style.transform;

        return display === 'block' && transform === 'translateX(0px)';
    });

    console.log(`   ${balancerShownInModal ? '✅' : '❌'} Game Balancer shown in modal: ${balancerShownInModal}`);

    console.log('\n🧪 TEST 3: Game Balancer hides when modal closes');
    await page.press('body', 'Escape');
    await page.waitForTimeout(1000);

    const balancerHiddenAfterModal = await page.evaluate(() => {
        const panel = document.getElementById('game-balancer-panel');
        if (!panel) return true;

        const display = panel.style.display;
        const transform = panel.style.transform;

        // Should be either display:none or translateX(100%)
        return display === 'none' || transform === 'translateX(100%)';
    });

    console.log(`   ${balancerHiddenAfterModal ? '✅' : '❌'} Game Balancer hidden after modal close: ${balancerHiddenAfterModal}`);

    const finalResult = !balancerVisible && balancerShownInModal && balancerHiddenAfterModal;

    console.log('\n📊 FINAL RESULT');
    console.log('================');
    console.log(`${finalResult ? '✅' : '❌'} ALL TESTS: ${finalResult ? 'PASSED' : 'FAILED'}`);

    if (finalResult) {
        console.log('🎉 Game Balancer is now COMPLETELY HIDDEN on homepage!');
        console.log('🎮 Only appears when games are active - PERFECT!');
    } else {
        console.log('❌ Game Balancer still has visibility issues');
    }

    console.log('\n🌐 Browser left open for verification');

    // Keep browser open for user verification
    // await browser.close();

    return finalResult;
}

// Run the test
if (require.main === module) {
    testBalancerCompletelyHidden().catch(console.error);
}

module.exports = { testBalancerCompletelyHidden };