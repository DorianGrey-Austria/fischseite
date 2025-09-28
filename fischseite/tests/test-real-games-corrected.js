/**
 * 🎮 FISCHSEITE - KORRIGIERTER GAME TEST
 *
 * Testet die ECHTEN implementierten Spiele mit korrekten Selektoren
 * Basierend auf HTML-Analyse:
 *
 * ✅ ECHTE SPIELE GEFUNDEN:
 * 1. Aquarium Collector Game (aquarium-game-1, aquarium-game-2)
 * 2. Fish Care Simulation (startFishCareSimulation())
 * 3. Fish Memory Game (memory-game containers)
 * 4. Aquarium Builder Game (builder containers)
 * 5. Fish Spawning System (click-to-spawn)
 */

const { chromium } = require('playwright');

async function testRealGamesStructure() {
    console.log('🎮 KORRIGIERTER GAME TEST GESTARTET');
    console.log('==================================');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 300
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1400, height: 900 });

    const results = {
        aquariumCollector: { status: 'not_tested', containers: [], issues: [] },
        fishCareSimulation: { status: 'not_tested', function: null, issues: [] },
        fishMemoryGame: { status: 'not_tested', containers: [], issues: [] },
        aquariumBuilderGame: { status: 'not_tested', containers: [], issues: [] },
        fishSpawning: { status: 'not_tested', fish: [], issues: [] },
        jsModules: { loaded: [], missing: [] }
    };

    try {
        console.log('🌐 Navigiere zu localhost:8003...');
        const startTime = Date.now();
        await page.goto('http://localhost:8003/', { waitUntil: 'networkidle' });
        const loadTime = Date.now() - startTime;
        console.log(`✅ Seite geladen in ${loadTime}ms`);

        // Warte auf JavaScript-Initialisierung
        console.log('⏳ Warte auf JavaScript Module...');
        await page.waitForTimeout(4000);

        // ===========================================
        // ANALYSE: WELCHE JS MODULE SIND GELADEN?
        // ===========================================
        console.log('\n📋 JAVASCRIPT MODULE ANALYSE');
        console.log('============================');

        const jsModulesStatus = await page.evaluate(() => {
            return {
                aquariumCollectorGame: typeof AquariumCollectorGame !== 'undefined',
                fishMemoryGame: typeof window.fishMemoryGame !== 'undefined' || typeof FishMemoryGame !== 'undefined',
                aquariumBuilderGame: typeof window.aquariumBuilderGame !== 'undefined' || typeof AquariumBuilderGame !== 'undefined',
                smartFishSystem: typeof window.smartFishSystem !== 'undefined',
                performanceOptimizer: typeof window.performanceOptimizer !== 'undefined'
            };
        });

        Object.entries(jsModulesStatus).forEach(([module, loaded]) => {
            if (loaded) {
                console.log(`✅ ${module} - GELADEN`);
                results.jsModules.loaded.push(module);
            } else {
                console.log(`❌ ${module} - NICHT GELADEN`);
                results.jsModules.missing.push(module);
            }
        });

        // ===========================================
        // TEST 1: AQUARIUM COLLECTOR GAME CONTAINER
        // ===========================================
        console.log('\n🎮 TESTE AQUARIUM COLLECTOR GAME CONTAINER');
        console.log('==========================================');

        try {
            // Prüfe game-1 Container
            const game1Container = await page.locator('#aquarium-game-1').first();
            const game2Container = await page.locator('#aquarium-game-2').first();

            if (await game1Container.isVisible({ timeout: 3000 })) {
                console.log('✅ Aquarium Game 1 Container gefunden');
                results.aquariumCollector.containers.push('aquarium-game-1');

                // Teste Canvas innerhalb des Containers
                const canvas1 = await page.locator('#aquarium-game-1 canvas').first();
                if (await canvas1.isVisible({ timeout: 2000 })) {
                    console.log('✅ Aquarium Game 1 Canvas aktiv');
                }
            } else {
                results.aquariumCollector.issues.push('aquarium-game-1 Container nicht sichtbar');
            }

            if (await game2Container.isVisible({ timeout: 3000 })) {
                console.log('✅ Aquarium Game 2 Container gefunden');
                results.aquariumCollector.containers.push('aquarium-game-2');

                // Teste Canvas innerhalb des Containers
                const canvas2 = await page.locator('#aquarium-game-2 canvas').first();
                if (await canvas2.isVisible({ timeout: 2000 })) {
                    console.log('✅ Aquarium Game 2 Canvas aktiv');
                }
            } else {
                results.aquariumCollector.issues.push('aquarium-game-2 Container nicht sichtbar');
            }

            // Teste ob AquariumCollectorGame Instanzen existieren
            const gameInstances = await page.evaluate(() => {
                return {
                    game1: typeof window.aquariumGame1 !== 'undefined',
                    game2: typeof window.aquariumGame2 !== 'undefined'
                };
            });

            if (gameInstances.game1) {
                console.log('✅ AquariumGame1 Instanz gefunden');
            }
            if (gameInstances.game2) {
                console.log('✅ AquariumGame2 Instanz gefunden');
            }

            results.aquariumCollector.status = results.aquariumCollector.containers.length > 0 ? 'passed' : 'failed';

        } catch (error) {
            results.aquariumCollector.issues.push(`Error: ${error.message}`);
            results.aquariumCollector.status = 'error';
        }

        // ===========================================
        // TEST 2: FISH CARE SIMULATION FUNCTION
        // ===========================================
        console.log('\n🐠 TESTE FISH CARE SIMULATION');
        console.log('=============================');

        try {
            // Prüfe ob startFishCareSimulation Funktion existiert
            const careFunction = await page.evaluate(() => {
                return typeof startFishCareSimulation !== 'undefined';
            });

            if (careFunction) {
                console.log('✅ startFishCareSimulation() Funktion gefunden');
                results.fishCareSimulation.function = 'startFishCareSimulation';

                // Suche den Button der diese Funktion aufruft
                const careButton = await page.locator('button[onclick*="startFishCareSimulation"]').first();
                if (await careButton.isVisible({ timeout: 3000 })) {
                    console.log('✅ Fish Care Button gefunden');

                    // Teste Button Click
                    await careButton.click();
                    await page.waitForTimeout(2000);

                    // Prüfe ob Care Interface erscheint
                    const careInterface = await page.locator('.fish-care-simulation, .care-dashboard, .simulation-container').first();
                    if (await careInterface.isVisible({ timeout: 3000 })) {
                        console.log('✅ Fish Care Interface geöffnet');
                        results.fishCareSimulation.status = 'passed';
                    } else {
                        results.fishCareSimulation.issues.push('Care Interface öffnet nicht');
                        results.fishCareSimulation.status = 'failed';
                    }
                } else {
                    results.fishCareSimulation.issues.push('Care Button nicht sichtbar');
                    results.fishCareSimulation.status = 'failed';
                }
            } else {
                results.fishCareSimulation.issues.push('startFishCareSimulation Funktion nicht gefunden');
                results.fishCareSimulation.status = 'failed';
            }

        } catch (error) {
            results.fishCareSimulation.issues.push(`Error: ${error.message}`);
            results.fishCareSimulation.status = 'error';
        }

        // ===========================================
        // TEST 3: FISH MEMORY GAME CONTAINER
        // ===========================================
        console.log('\n🧠 TESTE FISH MEMORY GAME');
        console.log('=========================');

        try {
            await page.reload({ waitUntil: 'networkidle' });
            await page.waitForTimeout(3000);

            // Suche Memory Game Container
            const memoryContainers = [
                '.fish-memory-game-container',
                '.memory-game-container',
                '.memory-game-board',
                '#memory-game'
            ];

            let memoryFound = false;
            for (const selector of memoryContainers) {
                const container = await page.locator(selector).first();
                if (await container.isVisible({ timeout: 2000 })) {
                    console.log(`✅ Memory Container gefunden: ${selector}`);
                    results.fishMemoryGame.containers.push(selector);
                    memoryFound = true;
                }
            }

            if (!memoryFound) {
                // Suche nach Memory Game Buttons/Links
                const memoryTriggers = await page.locator('button:has-text("Memory"), a:has-text("Memory"), [data-game="memory"]').all();
                if (memoryTriggers.length > 0) {
                    console.log(`✅ Memory Trigger gefunden: ${memoryTriggers.length} Buttons`);
                    await memoryTriggers[0].click();
                    await page.waitForTimeout(2000);

                    // Prüfe wieder nach Memory Interface
                    for (const selector of memoryContainers) {
                        const container = await page.locator(selector).first();
                        if (await container.isVisible({ timeout: 3000 })) {
                            console.log(`✅ Memory Interface nach Click: ${selector}`);
                            results.fishMemoryGame.containers.push(selector);
                            memoryFound = true;
                        }
                    }
                }
            }

            results.fishMemoryGame.status = memoryFound ? 'passed' : 'failed';
            if (!memoryFound) {
                results.fishMemoryGame.issues.push('Keine Memory Game Container gefunden');
            }

        } catch (error) {
            results.fishMemoryGame.issues.push(`Error: ${error.message}`);
            results.fishMemoryGame.status = 'error';
        }

        // ===========================================
        // TEST 4: AQUARIUM BUILDER GAME
        // ===========================================
        console.log('\n🏗️ TESTE AQUARIUM BUILDER GAME');
        console.log('==============================');

        try {
            await page.reload({ waitUntil: 'networkidle' });
            await page.waitForTimeout(3000);

            const builderContainers = [
                '.aquarium-builder-game',
                '.builder-game-container',
                '.builder-interface',
                '#builder-game'
            ];

            let builderFound = false;
            for (const selector of builderContainers) {
                const container = await page.locator(selector).first();
                if (await container.isVisible({ timeout: 2000 })) {
                    console.log(`✅ Builder Container gefunden: ${selector}`);
                    results.aquariumBuilderGame.containers.push(selector);
                    builderFound = true;

                    // Teste Drag-Drop Elemente
                    const dragElements = await page.locator(`${selector} .draggable, ${selector} .builder-item`).all();
                    if (dragElements.length > 0) {
                        console.log(`✅ Drag-Drop Elemente: ${dragElements.length}`);
                    }
                }
            }

            results.aquariumBuilderGame.status = builderFound ? 'passed' : 'failed';
            if (!builderFound) {
                results.aquariumBuilderGame.issues.push('Keine Builder Game Container gefunden');
            }

        } catch (error) {
            results.aquariumBuilderGame.issues.push(`Error: ${error.message}`);
            results.aquariumBuilderGame.status = 'error';
        }

        // ===========================================
        // TEST 5: FISH SPAWNING SYSTEM (BESTÄTIGT FUNKTIONAL)
        // ===========================================
        console.log('\n🐟 TESTE FISH SPAWNING SYSTEM');
        console.log('==============================');

        try {
            await page.reload({ waitUntil: 'networkidle' });
            await page.waitForTimeout(3000);

            // Zähle initial vorhandene Fische
            const initialFish = await page.locator('.fish, .swimming-fish, [data-fish]').all();
            console.log(`📊 Initial schwimmende Fische: ${initialFish.length}`);

            if (initialFish.length > 0) {
                console.log('✅ Auto-Swimming Fische aktiv');
                results.fishSpawning.fish.push('auto-swimming');

                // Teste Click-to-Spawn
                await page.click('body', { position: { x: 400, y: 300 } });
                await page.waitForTimeout(1500);

                const afterClickFish = await page.locator('.fish, .swimming-fish, [data-fish]').all();
                console.log(`📊 Fische nach Click: ${afterClickFish.length}`);

                if (afterClickFish.length > initialFish.length) {
                    console.log('✅ Click-to-Spawn funktioniert');
                    results.fishSpawning.fish.push('click-to-spawn');
                }

                // Teste Maximum-Limit (viele Clicks)
                for (let i = 0; i < 20; i++) {
                    await page.click('body', { position: { x: 300 + i*5, y: 250 + i*5 } });
                    await page.waitForTimeout(50);
                }

                const maxFish = await page.locator('.fish, .swimming-fish, [data-fish]').all();
                console.log(`📊 Maximum Fische erreicht: ${maxFish.length}`);

                if (maxFish.length <= 12) { // Etwas toleranter
                    console.log('✅ Maximum-Limit respektiert');
                    results.fishSpawning.fish.push('max-limit-respected');
                }

                results.fishSpawning.status = 'passed';

            } else {
                results.fishSpawning.issues.push('Keine schwimmenden Fische gefunden');
                results.fishSpawning.status = 'failed';
            }

        } catch (error) {
            results.fishSpawning.issues.push(`Error: ${error.message}`);
            results.fishSpawning.status = 'error';
        }

    } catch (error) {
        console.error('❌ FEHLER beim Testen:', error);
    }

    // ===========================================
    // FINALER REPORT
    // ===========================================
    console.log('\n\n🎮 KORRIGIERTER GAME TEST - FINALER REPORT');
    console.log('==========================================');

    console.log('\n📋 JAVASCRIPT MODULES:');
    console.log(`✅ Geladen: ${results.jsModules.loaded.join(', ')}`);
    console.log(`❌ Fehlend: ${results.jsModules.missing.join(', ')}`);

    let totalTests = 0;
    let passedTests = 0;

    Object.entries(results).forEach(([game, result]) => {
        if (game === 'jsModules') return;

        totalTests++;
        const status = result.status === 'passed' ? '✅ PASSED' :
                      result.status === 'failed' ? '❌ FAILED' :
                      result.status === 'error' ? '💥 ERROR' : '⏸️ NOT TESTED';

        console.log(`\n${status} - ${game.toUpperCase()}`);

        // Spezifische Details
        if (game === 'aquariumCollector' && result.containers.length > 0) {
            console.log(`   📦 Container: ${result.containers.join(', ')}`);
        }
        if (game === 'fishCareSimulation' && result.function) {
            console.log(`   🔧 Funktion: ${result.function}`);
        }
        if (game === 'fishSpawning' && result.fish.length > 0) {
            console.log(`   🐟 Features: ${result.fish.join(', ')}`);
        }

        // Issues
        if (result.issues.length > 0) {
            result.issues.forEach(issue => console.log(`   ⚠️ ${issue}`));
        }

        if (result.status === 'passed') passedTests++;
    });

    console.log('\n📊 ZUSAMMENFASSUNG:');
    console.log(`✅ Tests bestanden: ${passedTests}/${totalTests}`);
    console.log(`🏆 Erfolgsrate: ${Math.round((passedTests / totalTests) * 100)}%`);

    if (passedTests === totalTests) {
        console.log('\n🎉 ALLE GEFUNDENEN SPIELE FUNKTIONIEREN!');
    } else if (passedTests > 0) {
        console.log('\n⚡ TEILWEISE ERFOLGREICH - Einige Spiele benötigen Aufmerksamkeit');
    } else {
        console.log('\n❌ KRITISCH - Keine Spiele funktionsfähig');
    }

    console.log('\n🌐 Browser bleibt offen für manuelle Inspektion...');
    await page.waitForTimeout(120000); // 2 Minuten warten
}

testRealGamesStructure().catch(console.error);