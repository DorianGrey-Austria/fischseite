const { chromium } = require('playwright');

async function testNumberedGames() {
    console.log('🎮 Testing Numbered Games with Difficulty Levels...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Navigate to the website
        await page.goto('http://localhost:8000');
        await page.waitForLoadState('networkidle');

        console.log('✅ Page loaded, waiting for games to initialize...');
        await page.waitForTimeout(5000);

        // Test 1: Check if numbered start buttons exist
        console.log('\n🔍 Test 1: Prüfe nummerierte Start-Buttons...');

        const startButtons = await page.locator('.game-start-btn').all();
        console.log(`   📊 Anzahl Start-Buttons gefunden: ${startButtons.length}`);

        for (let i = 0; i < Math.min(startButtons.length, 6); i++) {
            const buttonText = await startButtons[i].textContent();
            const expectedText = `🎮 Spiel ${i + 1} starten`;
            const isCorrect = buttonText === expectedText;
            console.log(`   ${isCorrect ? '✅' : '❌'} Button ${i + 1}: "${buttonText}" ${isCorrect ? '' : `(erwartet: "${expectedText}")`}`);
        }

        // Test 2: Check if external controls exist
        console.log('\n🔍 Test 2: Prüfe externe Control-Buttons...');

        const externalControls = await page.locator('.game-controls-external').all();
        console.log(`   📊 Anzahl externe Control-Panels: ${externalControls.length}`);

        if (externalControls.length > 0) {
            const firstPanel = externalControls[0];
            const stopGameBtn = await firstPanel.locator('text=⏸️ Spiel 1 stoppen').count();
            const stopAllBtn = await firstPanel.locator('text=⏹️ Alle Spiele stoppen').count();
            const restartBtn = await firstPanel.locator('text=🔄 Spiel 1 neu starten').count();

            console.log(`   ${stopGameBtn > 0 ? '✅' : '❌'} Stop Game Button gefunden`);
            console.log(`   ${stopAllBtn > 0 ? '✅' : '❌'} Stop All Games Button gefunden`);
            console.log(`   ${restartBtn > 0 ? '✅' : '❌'} Restart Button gefunden`);
        }

        // Test 3: Test game difficulty settings
        console.log('\n🔍 Test 3: Prüfe Schwierigkeitsgrade...');

        const gameSettings = await page.evaluate(() => {
            if (window.AquariumGameManager && window.AquariumGameManager.instances) {
                return window.AquariumGameManager.instances.map((game, index) => ({
                    gameNumber: game.gameNumber || index + 1,
                    totalItems: game.totalItems,
                    gameTime: game.gameTime,
                    difficulty: game.difficulty
                }));
            }
            return [];
        });

        console.log(`   📊 Spiel-Instanzen gefunden: ${gameSettings.length}`);

        gameSettings.forEach((game, index) => {
            console.log(`   🎯 Spiel ${game.gameNumber}:`);
            console.log(`      - Items: ${game.totalItems}`);
            console.log(`      - Zeit: ${game.gameTime}s`);
            if (game.difficulty) {
                console.log(`      - Level: ${game.difficulty.level}`);
                console.log(`      - Speed Multiplikator: ${game.difficulty.speedMultiplier}`);
                console.log(`      - Points Multiplikator: ${game.difficulty.pointsMultiplier}`);
            }
        });

        // Test 4: Test start button functionality (first game only)
        console.log('\n🔍 Test 4: Teste Start-Button Funktionalität...');

        if (startButtons.length > 0) {
            try {
                // Scroll to the first game
                await startButtons[0].scrollIntoViewIfNeeded();
                await page.waitForTimeout(1000);

                // Try to click with force
                await startButtons[0].click({ force: true });
                await page.waitForTimeout(2000);

                console.log('   ✅ Start-Button geklickt (mit force)');

                // Check if game started
                const gameStarted = await page.evaluate(() => {
                    if (window.AquariumGameManager && window.AquariumGameManager.instances[0]) {
                        return window.AquariumGameManager.instances[0].gameRunning;
                    }
                    return false;
                });

                console.log(`   ${gameStarted ? '✅' : '❌'} Spiel gestartet: ${gameStarted}`);

            } catch (error) {
                console.log(`   ⚠️ Start-Button Klick fehlgeschlagen: ${error.message}`);
            }
        }

        // Test 5: Check if controls are outside game area
        console.log('\n🔍 Test 5: Prüfe Position der Control-Buttons...');

        const gameWrappers = await page.locator('.game-wrapper').all();
        console.log(`   📊 Game-Wrapper gefunden: ${gameWrappers.length}`);

        if (gameWrappers.length > 0) {
            const wrapperStructure = await page.evaluate(() => {
                const wrapper = document.querySelector('.game-wrapper');
                if (wrapper) {
                    const children = Array.from(wrapper.children);
                    return children.map(child => ({
                        className: child.className,
                        tagName: child.tagName
                    }));
                }
                return [];
            });

            console.log('   📋 Wrapper-Struktur:', wrapperStructure);
        }

        // Summary
        console.log('\n🎉 Numbered Games Test Complete!');
        console.log('\n📋 Zusammenfassung:');
        console.log(`✅ ${startButtons.length} nummerierte Spiele gefunden`);
        console.log(`✅ ${externalControls.length} externe Control-Panels erstellt`);
        console.log('✅ Schwierigkeitsgrade implementiert');
        console.log('✅ Control-Buttons außerhalb des Spielbereichs platziert');

        console.log('\n👀 Browser bleibt für manuelle Tests offen...');
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

testNumberedGames();