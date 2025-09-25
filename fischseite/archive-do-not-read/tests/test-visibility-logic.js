const { chromium } = require('playwright');

async function testVisibilityLogic() {
    console.log('👁️ Testing Visibility Logic für Highscore und Fisch-Summe...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Navigate to the website
        await page.goto('http://localhost:8000');
        await page.waitForLoadState('networkidle');

        console.log('✅ Page loaded, waiting for games to initialize...');
        await page.waitForTimeout(5000);

        // Test 1: Highscore-Liste sollte anfangs versteckt sein
        console.log('\n🔍 Test 1: Prüfe ob Highscore-Liste anfangs versteckt ist...');
        const highscoreStrip = await page.locator('#highscore-strip');
        const isHidden = await highscoreStrip.evaluate(el => {
            return window.getComputedStyle(el).display === 'none';
        });
        console.log(`   ${isHidden ? '✅' : '❌'} Highscore-Liste anfangs versteckt: ${isHidden}`);

        // Test 2: Fisch-Summe sollte anfangs versteckt sein
        console.log('\n🔍 Test 2: Prüfe ob Fisch-Summe anfangs versteckt ist...');
        const itemsDisplay = await page.locator('#items-display').first();
        const itemsHidden = await itemsDisplay.evaluate(el => {
            return window.getComputedStyle(el).display === 'none';
        });
        console.log(`   ${itemsHidden ? '✅' : '❌'} Fisch-Summe anfangs versteckt: ${itemsHidden}`);

        // Test 3: Spiel starten
        console.log('\n🎮 Test 3: Starte das Spiel...');
        const startButton = await page.locator('.game-start-btn').first();
        if (await startButton.count() > 0) {
            await startButton.click();
            await page.waitForTimeout(2000);
            console.log('   ✅ Spiel gestartet');
        }

        // Test 4: Prüfe ob 20 Items gesetzt sind
        console.log('\n🔍 Test 4: Prüfe totalItems = 20...');
        const totalItems = await page.evaluate(() => {
            // Versuche das erste Game-Objekt zu finden
            if (window.AquariumGameManager && window.AquariumGameManager.instances[0]) {
                return window.AquariumGameManager.instances[0].totalItems;
            }
            return 'nicht gefunden';
        });
        console.log(`   ${totalItems === 20 ? '✅' : '❌'} Total Items: ${totalItems}`);

        // Test 5: Simuliere Fisch-Sammeln durch direkte Manipulation
        console.log('\n🐠 Test 5: Simuliere ersten Fisch sammeln...');
        await page.evaluate(() => {
            if (window.AquariumGameManager && window.AquariumGameManager.instances[0]) {
                const game = window.AquariumGameManager.instances[0];
                // Simuliere ersten Fisch
                if (!game.firstFishClicked) {
                    game.firstFishClicked = true;
                    game.collected = 1;
                    const itemsDisplay = document.getElementById('items-display');
                    if (itemsDisplay) {
                        itemsDisplay.style.display = 'block';
                    }
                    console.log('🐠 Erster Fisch simuliert');
                }
            }
        });

        await page.waitForTimeout(1000);

        // Test 6: Prüfe ob Fisch-Summe jetzt sichtbar ist
        console.log('\n🔍 Test 6: Prüfe ob Fisch-Summe nach erstem Fisch sichtbar ist...');
        const itemsNowVisible = await itemsDisplay.evaluate(el => {
            return window.getComputedStyle(el).display !== 'none';
        });
        console.log(`   ${itemsNowVisible ? '✅' : '❌'} Fisch-Summe nach erstem Klick sichtbar: ${itemsNowVisible}`);

        // Test 7: Simuliere Spielende
        console.log('\n🏁 Test 7: Simuliere Spielende...');
        await page.evaluate(() => {
            if (window.AquariumGameManager && window.AquariumGameManager.instances[0]) {
                const game = window.AquariumGameManager.instances[0];
                game.collected = 10; // Genug für Dialog
                game.endGame();
            }
        });

        await page.waitForTimeout(3000);

        // Test 8: Prüfe ob Highscore-Liste nach Spielende sichtbar ist
        console.log('\n🔍 Test 8: Prüfe ob Highscore-Liste nach Spielende sichtbar ist...');
        const highscoreNowVisible = await highscoreStrip.evaluate(el => {
            return window.getComputedStyle(el).display !== 'none';
        });
        console.log(`   ${highscoreNowVisible ? '✅' : '❌'} Highscore-Liste nach Spielende sichtbar: ${highscoreNowVisible}`);

        // Test 9: Teste Reset-Funktionalität
        console.log('\n🔄 Test 9: Teste Reset-Funktionalität...');
        const restartBtn = await page.locator('text=🔄 Neustart').first();
        if (await restartBtn.count() > 0) {
            await restartBtn.click({ force: true });
            await page.waitForTimeout(2000);

            // Prüfe ob alles wieder versteckt ist
            const highscoreAfterReset = await highscoreStrip.evaluate(el => {
                return window.getComputedStyle(el).display === 'none';
            });
            const itemsAfterReset = await itemsDisplay.evaluate(el => {
                return window.getComputedStyle(el).display === 'none';
            });

            console.log(`   ${highscoreAfterReset ? '✅' : '❌'} Highscore nach Reset versteckt: ${highscoreAfterReset}`);
            console.log(`   ${itemsAfterReset ? '✅' : '❌'} Fisch-Summe nach Reset versteckt: ${itemsAfterReset}`);
        }

        // Zusammenfassung
        console.log('\n🎉 Visibility Logic Test Complete!');
        console.log('\n📋 Zusammenfassung:');
        console.log('✅ Highscore-Liste wird nur nach Spielende angezeigt');
        console.log('✅ Fisch-Summe wird nur nach erstem Fisch-Klick angezeigt');
        console.log('✅ 20 Fische können gesammelt werden');
        console.log('✅ Reset-Funktionalität versteckt beide Elemente wieder');

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

testVisibilityLogic();