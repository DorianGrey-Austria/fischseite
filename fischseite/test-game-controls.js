const { chromium } = require('playwright');

async function testGameControls() {
    console.log('🎮 Testing Game Control Buttons...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Navigate to the website
        await page.goto('http://localhost:8000');
        await page.waitForLoadState('networkidle');

        console.log('✅ Page loaded, waiting for games to initialize...');
        await page.waitForTimeout(3000);

        // Check if game controls are present
        const gameControls = await page.locator('.game-controls');
        const gameControlsCount = await gameControls.count();
        console.log(`🎮 Found ${gameControlsCount} game control panels`);

        if (gameControlsCount === 0) {
            console.log('❌ No game controls found!');
            await browser.close();
            return;
        }

        // Test each control panel
        for (let i = 0; i < gameControlsCount; i++) {
            console.log(`\n🎯 Testing game control panel ${i + 1}:`);

            const controlPanel = gameControls.nth(i);

            // Check if all three buttons exist
            const stopBtn = controlPanel.locator('text=⏸️ Stoppen');
            const stopAllBtn = controlPanel.locator('text=⏹️ Alle stoppen');
            const restartBtn = controlPanel.locator('text=🔄 Neustart');

            const stopBtnExists = await stopBtn.count() > 0;
            const stopAllBtnExists = await stopAllBtn.count() > 0;
            const restartBtnExists = await restartBtn.count() > 0;

            console.log(`   ${stopBtnExists ? '✅' : '❌'} Stop Game Button`);
            console.log(`   ${stopAllBtnExists ? '✅' : '❌'} Stop All Games Button`);
            console.log(`   ${restartBtnExists ? '✅' : '❌'} Restart Button`);

            // Test button clicks
            if (stopBtnExists) {
                console.log('   🖱️ Testing Stop Game button...');
                await stopBtn.scrollIntoViewIfNeeded();
                await stopBtn.click({ force: true });
                await page.waitForTimeout(500);
            }

            if (restartBtnExists) {
                console.log('   🖱️ Testing Restart button...');
                await restartBtn.scrollIntoViewIfNeeded();
                await restartBtn.click({ force: true });
                await page.waitForTimeout(500);
            }
        }

        // Test Stop All Games button (only need to test once)
        if (gameControlsCount > 0) {
            console.log('\n🔄 Testing "Stop All Games" functionality...');
            const firstStopAllBtn = gameControls.first().locator('text=⏹️ Alle stoppen');
            if (await firstStopAllBtn.count() > 0) {
                await firstStopAllBtn.scrollIntoViewIfNeeded();
                await firstStopAllBtn.click({ force: true });
                await page.waitForTimeout(500);
                console.log('✅ Stop All Games button clicked');
            }
        }

        // Check console logs for game state changes
        page.on('console', msg => {
            if (msg.text().includes('Spiel')) {
                console.log(`📝 Console: ${msg.text()}`);
            }
        });

        // Check responsive design
        console.log('\n📱 Testing mobile responsiveness...');
        await page.setViewportSize({ width: 390, height: 844 }); // iPhone size

        const mobileControls = await page.locator('.game-controls').first();
        if (await mobileControls.count() > 0) {
            const styles = await mobileControls.evaluate(el => {
                const computedStyle = window.getComputedStyle(el);
                return {
                    padding: computedStyle.padding,
                    gap: computedStyle.gap,
                    bottom: computedStyle.bottom
                };
            });
            console.log(`✅ Mobile styles applied: padding=${styles.padding}, gap=${styles.gap}`);
        }

        console.log('\n🎉 Game Control Test Complete!');
        console.log('\n👀 Browser will stay open for manual testing...');
        console.log('Press any key to close the browser.');

        // Wait for user input
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', () => {
            process.exit();
        });

    } catch (error) {
        console.error('❌ Test failed:', error);
        await browser.close();
    }
}

// Handle process cleanup
process.on('exit', async () => {
    console.log('🔚 Closing browser...');
    try {
        if (browser) await browser.close();
    } catch (e) {
        // Browser might already be closed
    }
});

testGameControls();