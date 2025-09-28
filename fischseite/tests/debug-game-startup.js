const { chromium } = require('playwright');

async function debugGameStartup() {
    console.log('🔍 DEBUG: Analysiere warum das Spiel nicht startet...\n');

    const browser = await chromium.launch({
        headless: false,
        devtools: true  // DevTools öffnen
    });

    const page = await browser.newPage();

    // Sammle ALLE Console-Nachrichten
    const consoleMessages = [];
    const errors = [];

    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        consoleMessages.push(`[${type}] ${text}`);

        if (type === 'error') {
            errors.push(text);
            console.log(`❌ BROWSER ERROR: ${text}`);
        } else if (type === 'warning') {
            console.log(`⚠️ BROWSER WARNING: ${text}`);
        } else if (text.includes('🎮')) {
            console.log(`📋 GAME LOG: ${text}`);
        }
    });

    // Fange JavaScript-Exceptions
    page.on('pageerror', error => {
        console.log(`🚨 PAGE EXCEPTION: ${error.message}`);
        errors.push(`EXCEPTION: ${error.message}`);
    });

    // Network-Fehler tracken
    page.on('requestfailed', request => {
        console.log(`🌐 REQUEST FAILED: ${request.url()} - ${request.failure().errorText}`);
        errors.push(`NETWORK: ${request.url()} failed`);
    });

    try {
        console.log('📱 Loading website...');
        await page.goto('http://localhost:8002', { waitUntil: 'networkidle' });

        console.log('\n📋 STEP 1: Checking HTML structure...');
        const dividers = await page.evaluate(() => {
            const elements = document.querySelectorAll('.underwater-divider');
            return {
                count: elements.length,
                sizes: Array.from(elements).map(el => ({
                    width: el.offsetWidth,
                    height: el.offsetHeight,
                    display: window.getComputedStyle(el).display,
                    position: window.getComputedStyle(el).position
                }))
            };
        });
        console.log(`   - Found ${dividers.count} underwater-divider elements`);
        dividers.sizes.forEach((size, i) => {
            console.log(`   - Divider ${i+1}: ${size.width}x${size.height}px, display: ${size.display}, position: ${size.position}`);
        });

        console.log('\n📋 STEP 2: Checking script loading...');
        const scriptStatus = await page.evaluate(() => {
            const script = document.querySelector('script[src*="aquarium-collector-game"]');
            return {
                exists: !!script,
                src: script?.src,
                defer: script?.defer,
                async: script?.async
            };
        });
        console.log(`   - Script tag exists: ${scriptStatus.exists}`);
        console.log(`   - Script src: ${scriptStatus.src}`);
        console.log(`   - Script defer: ${scriptStatus.defer}, async: ${scriptStatus.async}`);

        // Warte auf Script-Ausführung
        await page.waitForTimeout(3000);

        console.log('\n📋 STEP 3: Checking global variables...');
        const globalVars = await page.evaluate(() => {
            return {
                hasManager: typeof window.AquariumGameManager !== 'undefined',
                hasClass: typeof window.AquariumCollectorGame !== 'undefined',
                hasSupabase: typeof window.SupabaseHighscoreManager !== 'undefined',
                managerType: typeof window.AquariumGameManager,
                managerInstances: window.AquariumGameManager?.instances?.length || 0
            };
        });
        console.log(`   - AquariumGameManager exists: ${globalVars.hasManager} (type: ${globalVars.managerType})`);
        console.log(`   - AquariumCollectorGame class: ${globalVars.hasClass}`);
        console.log(`   - SupabaseHighscoreManager class: ${globalVars.hasSupabase}`);
        console.log(`   - Game instances created: ${globalVars.managerInstances}`);

        console.log('\n📋 STEP 4: Checking DOM after initialization...');
        const domStatus = await page.evaluate(() => {
            const canvases = document.querySelectorAll('.aquarium-game-canvas');
            const startButtons = document.querySelectorAll('.game-start-btn');
            const exitButtons = document.querySelectorAll('.game-exit-btn');
            const gameUIs = document.querySelectorAll('.game-ui');

            return {
                canvases: canvases.length,
                startButtons: startButtons.length,
                exitButtons: exitButtons.length,
                gameUIs: gameUIs.length,
                canvasInfo: Array.from(canvases).map(c => ({
                    width: c.width,
                    height: c.height,
                    display: window.getComputedStyle(c).display
                }))
            };
        });
        console.log(`   - Game canvases: ${domStatus.canvases}`);
        console.log(`   - Start buttons: ${domStatus.startButtons}`);
        console.log(`   - Exit buttons: ${domStatus.exitButtons}`);
        console.log(`   - Game UIs: ${domStatus.gameUIs}`);
        domStatus.canvasInfo.forEach((info, i) => {
            console.log(`   - Canvas ${i+1}: ${info.width}x${info.height}, display: ${info.display}`);
        });

        console.log('\n📋 STEP 5: Trying manual initialization...');
        const manualInit = await page.evaluate(() => {
            try {
                if (window.AquariumGameManager && typeof window.AquariumGameManager.init === 'function') {
                    window.AquariumGameManager.init();
                    return { success: true, instances: window.AquariumGameManager.instances.length };
                } else {
                    return { success: false, error: 'AquariumGameManager not found or no init function' };
                }
            } catch (e) {
                return { success: false, error: e.toString() };
            }
        });

        if (manualInit.success) {
            console.log(`   ✅ Manual init successful! Created ${manualInit.instances} instances`);
        } else {
            console.log(`   ❌ Manual init failed: ${manualInit.error}`);
        }

        // Nochmal warten und prüfen
        await page.waitForTimeout(2000);

        console.log('\n📋 STEP 6: Final DOM check...');
        const finalCheck = await page.evaluate(() => {
            const testContainer = document.querySelector('.test-game-container');
            return {
                hasTestContainer: !!testContainer,
                gameInstances: window.AquariumGameManager?.instances?.length || 0,
                canvases: document.querySelectorAll('.aquarium-game-canvas').length
            };
        });
        console.log(`   - Test container created: ${finalCheck.hasTestContainer}`);
        console.log(`   - Final game instances: ${finalCheck.gameInstances}`);
        console.log(`   - Final canvas count: ${finalCheck.canvases}`);

        console.log('\n📊 SUMMARY:');
        console.log(`   - Total console messages: ${consoleMessages.length}`);
        console.log(`   - Total errors: ${errors.length}`);

        if (errors.length > 0) {
            console.log('\n❌ ERRORS FOUND:');
            errors.forEach((err, i) => {
                console.log(`   ${i+1}. ${err}`);
            });
        }

        // Debugging: Zeige alle Console-Logs
        if (consoleMessages.length > 0) {
            console.log('\n📝 ALL CONSOLE MESSAGES:');
            consoleMessages.forEach(msg => console.log(`   ${msg}`));
        }

        // Warte für manuelle Inspektion
        console.log('\n⏸️ Browser bleibt offen für manuelle Inspektion (30 Sekunden)...');
        await page.waitForTimeout(30000);

    } catch (error) {
        console.error('💥 FATAL ERROR:', error);
    } finally {
        await browser.close();
    }
}

// Run the debug script
debugGameStartup().catch(console.error);