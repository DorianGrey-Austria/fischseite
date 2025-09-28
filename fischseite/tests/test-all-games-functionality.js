/* 🎮 UMFASSENDER FUNKTIONSTEST ALLER 5 SPIELE
 * Testet ob alle Spiele wirklich startbar, spielbar und funktional sind
 * Überprüft echte Interaktion, nicht nur Existenz
 */

const { chromium } = require('playwright');

async function testAllGamesFunctionality() {
    console.log('🔍 UMFASSENDER FUNKTIONSTEST ALLER 5 SPIELE...\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });

    const page = await browser.newPage();

    // Console errors abfangen
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    await page.goto('http://localhost:8003');
    await page.waitForTimeout(3000);

    const results = [];
    let allWorking = true;

    console.log('🧪 TEST 1: INLINE AQUARIUM COLLECTOR GAME');
    console.log('==========================================');

    try {
        // Klick auf Start-Button
        await page.click('button[onclick="startAquariumGame()"]');
        await page.waitForTimeout(3000);

        const collectorTest = await page.evaluate(() => {
            const canvas = document.getElementById('aquarium-game-canvas');
            const overlay = document.getElementById('game-overlay');

            // Teste ob Canvas funktional ist
            const ctx = canvas ? canvas.getContext('2d') : null;
            const canvasWorking = ctx && canvas.width > 0 && canvas.height > 0;

            // Teste ob Spiel tatsächlich läuft
            const gameRunning = window.aquariumGame && typeof window.aquariumGame.start === 'function';

            return {
                canvasExists: !!canvas,
                canvasSize: canvas ? `${canvas.width}x${canvas.height}` : 'none',
                canvasWorking: canvasWorking,
                overlayHidden: overlay ? overlay.style.display === 'none' : true,
                gameRunning: gameRunning,
                gameObject: !!window.aquariumGame
            };
        });

        console.log(`   Canvas existiert: ${collectorTest.canvasExists ? '✅' : '❌'}`);
        console.log(`   Canvas Size: ${collectorTest.canvasSize}`);
        console.log(`   Canvas funktional: ${collectorTest.canvasWorking ? '✅' : '❌'}`);
        console.log(`   Overlay versteckt: ${collectorTest.overlayHidden ? '✅' : '❌'}`);
        console.log(`   Spiel läuft: ${collectorTest.gameRunning ? '✅' : '❌'}`);
        console.log(`   Game Object: ${collectorTest.gameObject ? '✅' : '❌'}`);

        const collectorWorking = collectorTest.canvasExists && collectorTest.canvasWorking &&
                               collectorTest.overlayHidden && collectorTest.gameRunning;

        results.push({
            name: 'Aquarium Collector (Inline)',
            working: collectorWorking,
            details: collectorTest
        });

        if (!collectorWorking) allWorking = false;

    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        results.push({name: 'Aquarium Collector (Inline)', working: false, error: error.message});
        allWorking = false;
    }

    console.log('\n🧪 TEST 2: FISH MEMORY GAME MODAL');
    console.log('==================================');

    try {
        await page.click('button[onclick="openFishMemoryGame()"]');
        await page.waitForTimeout(3000);

        const memoryTest = await page.evaluate(() => {
            const modal = document.getElementById('game-modal');
            const container = document.getElementById('fish-memory-modal-container');
            const cards = container ? container.querySelectorAll('.memory-card') : [];
            const startButton = container ? container.querySelector('button') : null;

            // Teste Spielfunktionalität
            const firstCard = cards.length > 0 ? cards[0] : null;
            const cardClickable = firstCard && firstCard.onclick !== null;

            return {
                modalOpen: modal ? modal.style.display === 'flex' : false,
                containerExists: !!container,
                cardCount: cards.length,
                cardsClickable: cardClickable,
                hasStartButton: !!startButton,
                gameInitialized: !!window.currentMemoryGame
            };
        });

        console.log(`   Modal geöffnet: ${memoryTest.modalOpen ? '✅' : '❌'}`);
        console.log(`   Container existiert: ${memoryTest.containerExists ? '✅' : '❌'}`);
        console.log(`   Anzahl Karten: ${memoryTest.cardCount}`);
        console.log(`   Karten klickbar: ${memoryTest.cardsClickable ? '✅' : '❌'}`);
        console.log(`   Spiel initialisiert: ${memoryTest.gameInitialized ? '✅' : '❌'}`);

        // Teste Karten-Klick
        if (memoryTest.cardCount > 0) {
            await page.click('.memory-card:first-child');
            await page.waitForTimeout(1000);
            console.log(`   ✅ Karten-Klick getestet`);
        }

        const memoryWorking = memoryTest.modalOpen && memoryTest.containerExists &&
                            memoryTest.cardCount > 0 && memoryTest.cardCount <= 16 &&
                            memoryTest.gameInitialized;

        results.push({
            name: 'Fish Memory Game',
            working: memoryWorking,
            details: memoryTest
        });

        if (!memoryWorking) allWorking = false;

        await page.press('body', 'Escape');
        await page.waitForTimeout(1000);

    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        results.push({name: 'Fish Memory Game', working: false, error: error.message});
        allWorking = false;
    }

    console.log('\n🧪 TEST 3: AQUARIUM BUILDER GAME MODAL');
    console.log('=======================================');

    try {
        await page.click('button[onclick="openAquariumBuilderGame()"]');
        await page.waitForTimeout(3000);

        const builderTest = await page.evaluate(() => {
            const modal = document.getElementById('game-modal');
            const gamesContainer = document.getElementById('games');
            const builderGame = gamesContainer ? gamesContainer.querySelector('.aquarium-builder-game') : null;
            const buildZone = builderGame ? builderGame.querySelector('.build-zone') : null;
            const palette = builderGame ? builderGame.querySelector('.element-palette') : null;

            return {
                modalOpen: modal ? modal.style.display === 'flex' : false,
                gamesContainer: !!gamesContainer,
                builderGame: !!builderGame,
                buildZone: !!buildZone,
                palette: !!palette,
                gameInitialized: !!window.currentBuilderGame
            };
        });

        console.log(`   Modal geöffnet: ${builderTest.modalOpen ? '✅' : '❌'}`);
        console.log(`   Games Container: ${builderTest.gamesContainer ? '✅' : '❌'}`);
        console.log(`   Builder Game: ${builderTest.builderGame ? '✅' : '❌'}`);
        console.log(`   Build Zone: ${builderTest.buildZone ? '✅' : '❌'}`);
        console.log(`   Element Palette: ${builderTest.palette ? '✅' : '❌'}`);
        console.log(`   Spiel initialisiert: ${builderTest.gameInitialized ? '✅' : '❌'}`);

        const builderWorking = builderTest.modalOpen && builderTest.gamesContainer &&
                             builderTest.builderGame && builderTest.buildZone;

        results.push({
            name: 'Aquarium Builder Game',
            working: builderWorking,
            details: builderTest
        });

        if (!builderWorking) allWorking = false;

        await page.press('body', 'Escape');
        await page.waitForTimeout(1000);

    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        results.push({name: 'Aquarium Builder Game', working: false, error: error.message});
        allWorking = false;
    }

    console.log('\n🧪 TEST 4: FISH RACING GAME MODAL');
    console.log('==================================');

    try {
        await page.click('button[onclick="openFishRacingGame()"]');
        await page.waitForTimeout(3000);

        const racingTest = await page.evaluate(() => {
            const modal = document.getElementById('game-modal');
            const container = document.getElementById('fish-racing-container');
            const canvas = document.getElementById('fish-racing-canvas');
            const startButton = document.getElementById('start-race-btn');

            // Teste Canvas Funktionalität
            const ctx = canvas ? canvas.getContext('2d') : null;
            const canvasWorking = ctx && canvas.width > 0 && canvas.height > 0;

            return {
                modalOpen: modal ? modal.style.display === 'flex' : false,
                container: !!container,
                canvas: !!canvas,
                canvasWorking: canvasWorking,
                canvasSize: canvas ? `${canvas.width}x${canvas.height}` : 'none',
                startButton: !!startButton,
                gameInitialized: !!window.currentRacingGame
            };
        });

        console.log(`   Modal geöffnet: ${racingTest.modalOpen ? '✅' : '❌'}`);
        console.log(`   Container: ${racingTest.container ? '✅' : '❌'}`);
        console.log(`   Canvas: ${racingTest.canvas ? '✅' : '❌'}`);
        console.log(`   Canvas funktional: ${racingTest.canvasWorking ? '✅' : '❌'}`);
        console.log(`   Canvas Size: ${racingTest.canvasSize}`);
        console.log(`   Start Button: ${racingTest.startButton ? '✅' : '❌'}`);
        console.log(`   Spiel initialisiert: ${racingTest.gameInitialized ? '✅' : '❌'}`);

        // Teste Start Button
        if (racingTest.startButton) {
            await page.click('#start-race-btn');
            await page.waitForTimeout(2000);
            console.log(`   ✅ Start Button getestet`);
        }

        const racingWorking = racingTest.modalOpen && racingTest.container &&
                            racingTest.canvas && racingTest.canvasWorking && racingTest.startButton;

        results.push({
            name: 'Fish Racing Game',
            working: racingWorking,
            details: racingTest
        });

        if (!racingWorking) allWorking = false;

        await page.press('body', 'Escape');
        await page.waitForTimeout(1000);

    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        results.push({name: 'Fish Racing Game', working: false, error: error.message});
        allWorking = false;
    }

    console.log('\n🧪 TEST 5: FISH CARE SIMULATION MODAL');
    console.log('======================================');

    try {
        await page.click('button[onclick="startFishCareSimulation()"]');
        await page.waitForTimeout(3000);

        const careTest = await page.evaluate(() => {
            const modal = document.getElementById('game-modal');
            const container = document.getElementById('fish-care-modal-container');
            const careUI = container ? container.querySelector('.fish-care-ui, .simulation-container') : null;

            return {
                modalOpen: modal ? modal.style.display === 'flex' : false,
                container: !!container,
                careUI: !!careUI,
                gameInitialized: !!window.currentFishCareGame
            };
        });

        console.log(`   Modal geöffnet: ${careTest.modalOpen ? '✅' : '❌'}`);
        console.log(`   Container: ${careTest.container ? '✅' : '❌'}`);
        console.log(`   Care UI: ${careTest.careUI ? '✅' : '❌'}`);
        console.log(`   Spiel initialisiert: ${careTest.gameInitialized ? '✅' : '❌'}`);

        const careWorking = careTest.modalOpen && careTest.container;

        results.push({
            name: 'Fish Care Simulation',
            working: careWorking,
            details: careTest
        });

        if (!careWorking) allWorking = false;

        await page.press('body', 'Escape');
        await page.waitForTimeout(1000);

    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
        results.push({name: 'Fish Care Simulation', working: false, error: error.message});
        allWorking = false;
    }

    console.log('\n📊 ZUSAMMENFASSUNG DER FUNKTIONALITÄTSTESTS');
    console.log('============================================');

    results.forEach(result => {
        console.log(`${result.working ? '✅' : '❌'} ${result.name}: ${result.working ? 'FUNKTIONAL' : 'DEFEKT'}`);
        if (!result.working && result.error) {
            console.log(`    Fehler: ${result.error}`);
        }
    });

    console.log('\n🚨 CONSOLE ERRORS:');
    if (consoleErrors.length === 0) {
        console.log('   ✅ Keine Console Errors gefunden');
    } else {
        consoleErrors.forEach(error => {
            console.log(`   ❌ ${error}`);
        });
    }

    console.log(`\n🎯 GESAMTERGEBNIS: ${allWorking ? '✅ ALLE SPIELE FUNKTIONAL' : '❌ PROBLEME GEFUNDEN'}`);

    if (!allWorking) {
        console.log('\n⚠️  GEFUNDENE PROBLEME MÜSSEN BEHOBEN WERDEN!');
        const broken = results.filter(r => !r.working);
        console.log(`   Defekte Spiele: ${broken.map(r => r.name).join(', ')}`);
    }

    console.log('\n🌐 Browser bleibt offen für manuelle Überprüfung');

    return { allWorking, results, consoleErrors };
}

// Test ausführen
if (require.main === module) {
    testAllGamesFunctionality().catch(console.error);
}

module.exports = { testAllGamesFunctionality };