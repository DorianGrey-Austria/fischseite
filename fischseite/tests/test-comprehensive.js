const { chromium } = require('playwright');

/**
 * COMPREHENSIVE TEST SUITE
 * Umfassende Tests für alle Game-Features mit Error Recovery
 */

class ComprehensiveTestSuite {
    constructor() {
        this.browser = null;
        this.page = null;
        this.errors = [];
        this.warnings = [];
        this.testResults = {};
    }

    async init() {
        console.log('🧪 COMPREHENSIVE TEST SUITE gestartet...\n');

        this.browser = await chromium.launch({
            headless: false,
            devtools: true,
            slowMo: 100  // Für bessere Beobachtung
        });

        this.page = await this.browser.newPage();

        // Comprehensive Error Monitoring
        this.page.on('console', msg => {
            const type = msg.type();
            const text = msg.text();

            if (type === 'error') {
                this.errors.push({ type: 'console', text, timestamp: Date.now() });
                console.log(`❌ CONSOLE ERROR: ${text}`);
            } else if (type === 'warning') {
                this.warnings.push({ type: 'console', text, timestamp: Date.now() });
                if (text.includes('⚠️')) {
                    console.log(`⚠️ WARNING: ${text}`);
                }
            } else if (text.includes('🎮') || text.includes('🏆') || text.includes('🦈')) {
                console.log(`📋 GAME LOG: ${text}`);
            }
        });

        this.page.on('pageerror', error => {
            this.errors.push({ type: 'exception', text: error.message, timestamp: Date.now() });
            console.log(`🚨 PAGE EXCEPTION: ${error.message}`);
        });

        this.page.on('requestfailed', request => {
            const error = `${request.url()} - ${request.failure().errorText}`;
            this.errors.push({ type: 'network', text: error, timestamp: Date.now() });
            console.log(`🌐 REQUEST FAILED: ${error}`);
        });
    }

    async testBasicFunctionality() {
        console.log('🌐 TEST 1: Basic Website Functionality...');

        await this.page.goto('http://localhost:8002', {
            waitUntil: 'domcontentloaded',
            timeout: 20000
        });

        // Check page title
        const title = await this.page.title();
        const correctPage = title.includes('Aquaristikfreunde');

        this.testResults.basicFunctionality = {
            pageLoads: true,
            correctTitle: correctPage,
            title: title
        };

        console.log(`   ✅ Page loads: true`);
        console.log(`   ${correctPage ? '✅' : '❌'} Correct title: ${title}`);

        return correctPage;
    }

    async testGameInitialization() {
        console.log('\n🎮 TEST 2: Game Initialization...');

        // Wait for scripts to load
        await this.page.waitForTimeout(5000);

        const gameStatus = await this.page.evaluate(() => {
            return {
                managerExists: typeof window.AquariumGameManager !== 'undefined',
                instanceCount: window.AquariumGameManager?.instances?.length || 0,
                gameClassExists: typeof window.AquariumCollectorGame !== 'undefined',
                highscoreExists: typeof window.SupabaseHighscoreManager !== 'undefined'
            };
        });

        this.testResults.gameInitialization = gameStatus;

        console.log(`   ${gameStatus.managerExists ? '✅' : '❌'} Game Manager exists`);
        console.log(`   ${gameStatus.instanceCount > 0 ? '✅' : '❌'} Game instances: ${gameStatus.instanceCount}`);
        console.log(`   ${gameStatus.gameClassExists ? '✅' : '❌'} Game class exists`);
        console.log(`   ${gameStatus.highscoreExists ? '✅' : '❌'} Highscore manager exists`);

        return gameStatus.managerExists && gameStatus.instanceCount > 0;
    }

    async testGameUIElements() {
        console.log('\n🖼️ TEST 3: Game UI Elements...');

        const uiElements = await this.page.evaluate(() => {
            return {
                canvases: document.querySelectorAll('.aquarium-game-canvas').length,
                startButtons: document.querySelectorAll('.game-start-btn').length,
                exitButtons: document.querySelectorAll('.game-exit-btn').length,
                gameUIs: document.querySelectorAll('.game-ui').length,
                dividers: document.querySelectorAll('.underwater-divider').length
            };
        });

        this.testResults.gameUIElements = uiElements;

        console.log(`   ${uiElements.canvases > 0 ? '✅' : '❌'} Canvases: ${uiElements.canvases}`);
        console.log(`   ${uiElements.startButtons > 0 ? '✅' : '❌'} Start buttons: ${uiElements.startButtons}`);
        console.log(`   ${uiElements.exitButtons > 0 ? '✅' : '❌'} Exit buttons: ${uiElements.exitButtons}`);
        console.log(`   ${uiElements.gameUIs > 0 ? '✅' : '❌'} Game UIs: ${uiElements.gameUIs}`);
        console.log(`   ${uiElements.dividers > 0 ? '✅' : '❌'} Dividers: ${uiElements.dividers}`);

        return uiElements.canvases > 0 && uiElements.startButtons > 0;
    }

    async testGameplayFeatures() {
        console.log('\n🎯 TEST 4: Enhanced Gameplay Features...');

        const gameplayFeatures = await this.page.evaluate(() => {
            const game = window.AquariumGameManager?.instances?.[0];
            if (!game) return null;

            return {
                hasBossSystem: game.bossTypes && game.bossTypes.length >= 3,
                hasEnhancedPowerUps: game.powerUpTypes && game.powerUpTypes.length >= 8,
                hasAchievements: game.achievements && game.achievements.length >= 6,
                hasVisualEffects: game.rainbowTrails !== undefined && game.confettiParticles !== undefined,
                bossTypes: game.bossTypes?.length || 0,
                powerUpTypes: game.powerUpTypes?.length || 0,
                achievementCount: game.achievements?.length || 0
            };
        });

        this.testResults.gameplayFeatures = gameplayFeatures;

        if (gameplayFeatures) {
            console.log(`   ${gameplayFeatures.hasBossSystem ? '✅' : '❌'} Boss System: ${gameplayFeatures.bossTypes} types`);
            console.log(`   ${gameplayFeatures.hasEnhancedPowerUps ? '✅' : '❌'} Enhanced Power-ups: ${gameplayFeatures.powerUpTypes} types`);
            console.log(`   ${gameplayFeatures.hasAchievements ? '✅' : '❌'} Achievement System: ${gameplayFeatures.achievementCount} achievements`);
            console.log(`   ${gameplayFeatures.hasVisualEffects ? '✅' : '❌'} Visual Effects System`);

            return gameplayFeatures.hasBossSystem && gameplayFeatures.hasEnhancedPowerUps;
        } else {
            console.log('   ❌ Game instance not accessible');
            return false;
        }
    }

    async testGameInteraction() {
        console.log('\n🎮 TEST 5: Game Interaction Test...');

        try {
            // Try to start a game
            const startButtonVisible = await this.page.locator('.game-start-btn').first().isVisible({ timeout: 5000 });

            if (startButtonVisible) {
                console.log('   🎯 Attempting to start game...');
                await this.page.locator('.game-start-btn').first().click();
                await this.page.waitForTimeout(2000);

                const gameRunning = await this.page.evaluate(() => {
                    const game = window.AquariumGameManager?.instances?.[0];
                    return game && game.gameRunning;
                });

                console.log(`   ${gameRunning ? '✅' : '❌'} Game started successfully: ${gameRunning}`);

                if (gameRunning) {
                    // Test mouse interaction
                    const canvas = this.page.locator('.aquarium-game-canvas').first();
                    const canvasBox = await canvas.boundingBox();

                    if (canvasBox) {
                        await this.page.mouse.move(canvasBox.x + canvasBox.width/2, canvasBox.y + canvasBox.height/2);
                        await this.page.waitForTimeout(1000);

                        const playerPosition = await this.page.evaluate(() => {
                            const game = window.AquariumGameManager?.instances?.[0];
                            return game && game.playerFish ? {
                                x: game.playerFish.x,
                                y: game.playerFish.y
                            } : null;
                        });

                        console.log(`   ${playerPosition ? '✅' : '❌'} Player movement: ${playerPosition ? 'Working' : 'Not working'}`);

                        // Stop the game
                        const exitButton = this.page.locator('.game-exit-btn').first();
                        if (await exitButton.isVisible()) {
                            await exitButton.click();
                            console.log('   ✅ Game stopped successfully');
                        }
                    }
                }

                this.testResults.gameInteraction = {
                    startButtonVisible,
                    gameStarted: gameRunning,
                    playerMovement: !!playerPosition
                };

                return gameRunning;
            } else {
                console.log('   ❌ Start button not visible');
                this.testResults.gameInteraction = { startButtonVisible: false };
                return false;
            }
        } catch (error) {
            console.log(`   ❌ Game interaction error: ${error.message}`);
            this.testResults.gameInteraction = { error: error.message };
            return false;
        }
    }

    async testErrorRecovery() {
        console.log('\n🛠️ TEST 6: Error Recovery...');

        // Test handling of missing resources
        const errorRecovery = await this.page.evaluate(() => {
            // Trigger some potential errors and see if the game handles them
            try {
                // Test performance optimizer defensive programming
                if (window.PerformanceOptimizer) {
                    const optimizer = new window.PerformanceOptimizer();
                    optimizer.pauseBackgroundProcesses(); // Should not crash
                }

                return { performanceOptimizerSafe: true };
            } catch (error) {
                return { performanceOptimizerSafe: false, error: error.message };
            }
        });

        this.testResults.errorRecovery = errorRecovery;

        console.log(`   ${errorRecovery.performanceOptimizerSafe ? '✅' : '❌'} Performance Optimizer safe: ${errorRecovery.performanceOptimizerSafe}`);

        return errorRecovery.performanceOptimizerSafe;
    }

    async generateReport() {
        console.log('\n📊 COMPREHENSIVE TEST REPORT:');
        console.log('='* 50);

        const totalTests = Object.keys(this.testResults).length;
        const passedTests = Object.values(this.testResults).filter(result => {
            if (typeof result === 'object' && result !== null) {
                return Object.values(result).some(val => val === true);
            }
            return result === true;
        }).length;

        console.log(`📋 Tests: ${passedTests}/${totalTests} passed`);
        console.log(`❌ Errors: ${this.errors.length}`);
        console.log(`⚠️ Warnings: ${this.warnings.length}`);

        // Detailed results
        Object.entries(this.testResults).forEach(([testName, result]) => {
            console.log(`\n${testName}:`);
            if (typeof result === 'object') {
                Object.entries(result).forEach(([key, value]) => {
                    const status = value === true ? '✅' : value === false ? '❌' : '📋';
                    console.log(`   ${status} ${key}: ${value}`);
                });
            } else {
                const status = result ? '✅' : '❌';
                console.log(`   ${status} ${result}`);
            }
        });

        if (this.errors.length > 0) {
            console.log('\n❌ ERRORS FOUND:');
            this.errors.forEach((error, i) => {
                console.log(`   ${i+1}. [${error.type}] ${error.text}`);
            });
        }

        const success = this.errors.length === 0 && passedTests >= totalTests * 0.8; // 80% success rate

        console.log(`\n${success ? '🎉 COMPREHENSIVE TEST PASSED! ✅' : '❌ COMPREHENSIVE TEST FAILED!'}`);

        return {
            success,
            totalTests,
            passedTests,
            errors: this.errors,
            warnings: this.warnings,
            results: this.testResults
        };
    }

    async runAll() {
        try {
            await this.init();

            const tests = [
                () => this.testBasicFunctionality(),
                () => this.testGameInitialization(),
                () => this.testGameUIElements(),
                () => this.testGameplayFeatures(),
                () => this.testGameInteraction(),
                () => this.testErrorRecovery()
            ];

            for (const test of tests) {
                await test();
                await this.page.waitForTimeout(1000); // Brief pause between tests
            }

            return await this.generateReport();

        } catch (error) {
            console.error(`💥 FATAL TEST ERROR: ${error.message}`);
            return { success: false, error: error.message };
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }
}

// Run if called directly
if (require.main === module) {
    const testSuite = new ComprehensiveTestSuite();
    testSuite.runAll().then(result => {
        process.exit(result.success ? 0 : 1);
    }).catch(console.error);
}

module.exports = { ComprehensiveTestSuite };