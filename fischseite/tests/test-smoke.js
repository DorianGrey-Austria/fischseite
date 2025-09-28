const { chromium } = require('playwright');

/**
 * SMOKE TEST - Schnelle Basis-Funktionalität validieren
 * Läuft in < 30 Sekunden und prüft kritische Features
 */

async function smokeTest() {
    console.log('💨 SMOKE TEST: Kritische Funktionalität prüfen...\n');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const errors = [];
    const warnings = [];

    // Error Monitoring
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();

        if (type === 'error') {
            errors.push(text);
            console.log(`❌ ERROR: ${text}`);
        } else if (type === 'warning' && text.includes('⚠️')) {
            warnings.push(text);
            console.log(`⚠️ WARNING: ${text}`);
        }
    });

    page.on('pageerror', error => {
        errors.push(`PAGE EXCEPTION: ${error.message}`);
        console.log(`🚨 EXCEPTION: ${error.message}`);
    });

    try {
        // Test 1: Seite lädt ohne kritische Fehler
        console.log('🌐 Test 1: Seite laden...');
        await page.goto('http://localhost:8002', { timeout: 15000 });

        const title = await page.title();
        if (!title.includes('Aquaristikfreunde')) {
            throw new Error(`Falsche Seite geladen: ${title}`);
        }
        console.log('✅ Richtige Seite geladen');

        // Test 2: Game Manager initialisiert
        console.log('🎮 Test 2: Game Manager Check...');
        await page.waitForTimeout(8000); // Mehr Zeit für Script-Loading

        const gameManagerExists = await page.evaluate(() => {
            return typeof window.AquariumGameManager !== 'undefined';
        });

        if (!gameManagerExists) {
            throw new Error('AquariumGameManager nicht gefunden');
        }
        console.log('✅ Game Manager initialisiert');

        // Test 3: Spiele werden erstellt
        console.log('🎯 Test 3: Spiel-Instanzen Check...');
        const gameInstances = await page.evaluate(() => {
            return window.AquariumGameManager?.instances?.length || 0;
        });

        if (gameInstances === 0) {
            throw new Error('Keine Spiel-Instanzen erstellt');
        }
        console.log(`✅ ${gameInstances} Spiel-Instanzen erstellt`);

        // Test 4: Canvas-Elemente vorhanden
        console.log('🖼️ Test 4: Canvas-Elemente Check...');
        const canvasCount = await page.evaluate(() => {
            return document.querySelectorAll('.aquarium-game-canvas').length;
        });

        if (canvasCount === 0) {
            throw new Error('Keine Canvas-Elemente gefunden');
        }
        console.log(`✅ ${canvasCount} Canvas-Elemente gefunden`);

        // Test 5: JavaScript-Module geladen
        console.log('📦 Test 5: JavaScript-Module Check...');
        const modulesLoaded = await page.evaluate(() => {
            return {
                smartFish: typeof window.SmartFishSystem !== 'undefined',
                collectorGame: typeof window.AquariumCollectorGame !== 'undefined',
                highscore: typeof window.SupabaseHighscoreManager !== 'undefined'
            };
        });

        const moduleCount = Object.values(modulesLoaded).filter(Boolean).length;
        console.log(`✅ ${moduleCount}/3 Module geladen`);

        console.log('\n📊 SMOKE TEST ERGEBNIS:');
        console.log(`   - Errors: ${errors.length}`);
        console.log(`   - Warnings: ${warnings.length}`);
        console.log(`   - Game Instances: ${gameInstances}`);
        console.log(`   - Canvas Elements: ${canvasCount}`);

        if (errors.length === 0) {
            console.log('\n🎉 SMOKE TEST BESTANDEN! ✅');
            return { success: true, errors: [], warnings };
        } else {
            console.log('\n❌ SMOKE TEST FEHLGESCHLAGEN!');
            console.log('Errors:');
            errors.forEach(err => console.log(`   - ${err}`));
            return { success: false, errors, warnings };
        }

    } catch (error) {
        console.log(`\n💥 SMOKE TEST FEHLER: ${error.message}`);
        return { success: false, errors: [error.message], warnings };
    } finally {
        await browser.close();
    }
}

// Run if called directly
if (require.main === module) {
    smokeTest().then(result => {
        process.exit(result.success ? 0 : 1);
    }).catch(console.error);
}

module.exports = { smokeTest };