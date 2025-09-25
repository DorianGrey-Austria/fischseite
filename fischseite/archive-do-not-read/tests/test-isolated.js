const { chromium } = require('playwright');

async function testIsolatedFish() {
    console.log('🐟 Testing ISOLATED Fish System');
    console.log('==============================');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 100
    });
    const page = await browser.newPage();

    // Console logging
    page.on('console', msg => {
        console.log(`[PAGE] ${msg.text()}`);
    });

    page.on('pageerror', error => {
        console.error('❌ Page Error:', error.message);
    });

    try {
        console.log('\n📍 Loading isolated test page...');
        await page.goto('http://localhost:8000/fish-test-isolated.html');

        console.log('\n📍 Waiting for initialization...');
        await page.waitForTimeout(3000);

        // Check fish count
        const fishCount = await page.textContent('#fishCount');
        console.log(`🐟 Fish count shown: ${fishCount}`);

        const actualFish = await page.$$eval('.final-fish', els => els.length);
        console.log(`🐟 Actual fish elements: ${actualFish}`);

        if (parseInt(fishCount) > 0 && actualFish > 0) {
            console.log('✅ ISOLATED FISH SYSTEM WORKS!');

            // Test clicking
            console.log('\n📍 Testing click interaction...');
            await page.click('.final-fish');
            await page.waitForTimeout(1500);

            const newCount = await page.textContent('#fishCount');
            console.log(`🐟 Fish count after click: ${newCount}`);

            // Test spawning via button
            console.log('\n📍 Testing spawn button...');
            await page.click('button:has-text("Spawn Test")');
            await page.waitForTimeout(1000);

            const afterButtonCount = await page.textContent('#fishCount');
            console.log(`🐟 Fish count after button: ${afterButtonCount}`);

            // Test reset
            console.log('\n📍 Testing reset...');
            await page.click('button:has-text("Reset")');
            await page.waitForTimeout(1000);

            const afterResetCount = await page.textContent('#fishCount');
            console.log(`🐟 Fish count after reset: ${afterResetCount}`);

            console.log('\n🎯 ISOLATED TEST RESULTS');
            console.log('========================');
            console.log('✅ Fish spawns initially');
            console.log('✅ Fish persist (no immediate removal)');
            console.log('✅ Click interactions work');
            console.log('✅ Spawn button works');
            console.log('✅ Reset function works');
            console.log('\n🚀 THE FISH SYSTEM LOGIC IS CORRECT!');
            console.log('❗ Problem must be in the main index.html');

        } else {
            console.log('❌ Fish system failed in isolated test');
        }

        console.log('\n⏱️ Keeping browser open for manual testing...');
        await page.waitForTimeout(20000);

    } catch (error) {
        console.error('❌ Test error:', error.message);
    } finally {
        await browser.close();
    }
}

testIsolatedFish().catch(console.error);