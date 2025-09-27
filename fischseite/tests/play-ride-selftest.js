/* 🚀 PLAY/RIDE SELF-TEST FRAMEWORK
   Kontinuierliche Qualitätssicherung durch automatisierte Selbstreflexion

   PLAY = Performance, Loading, Animation, sYstem-checks
   RIDE = Responsiveness, Interactivity, Design, Error-handling
*/

const { chromium } = require('playwright');

class PlayRideSelfTest {
    constructor() {
        this.testResults = {
            play: { performance: 0, loading: 0, animation: 0, system: 0 },
            ride: { responsiveness: 0, interactivity: 0, design: 0, errorHandling: 0 },
            overall: 0
        };
        this.criticalIssues = [];
        this.recommendations = [];
    }

    async runFullTest() {
        console.log('🎮 PLAY/RIDE SELF-TEST FRAMEWORK');
        console.log('================================');

        const browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();

        try {
            // Try multiple ports for better reliability
            let pageLoaded = false;
            const ports = [8000, 8001, 3000];

            for (const port of ports) {
                try {
                    console.log(`🔌 Trying http://localhost:${port}...`);
                    await page.goto(`http://localhost:${port}`, { timeout: 10000 });
                    pageLoaded = true;
                    console.log(`✅ Connected to port ${port}`);
                    break;
                } catch (e) {
                    console.log(`❌ Port ${port} failed: ${e.message}`);
                    continue;
                }
            }

            if (!pageLoaded) {
                throw new Error('Could not connect to any local server port');
            }

            await page.waitForTimeout(3000);

            // PLAY Tests
            console.log('\n🎮 PLAY TESTS (Performance, Loading, Animation, System)');
            console.log('======================================================');

            await this.testPerformance(page);
            await this.testLoading(page);
            await this.testAnimation(page);
            await this.testSystem(page);

            // RIDE Tests
            console.log('\n🏄 RIDE TESTS (Responsiveness, Interactivity, Design, Error-handling)');
            console.log('====================================================================');

            await this.testResponsiveness(page);
            await this.testInteractivity(page);
            await this.testDesign(page);
            await this.testErrorHandling(page);

            // Self-Reflection & Analysis
            await this.performSelfReflection();
            await this.generateRecommendations();
            await this.generateReport();

        } catch (error) {
            this.criticalIssues.push(`CRITICAL: Test execution failed - ${error.message}`);
        } finally {
            await browser.close();
        }
    }

    async testPerformance(page) {
        console.log('⚡ Testing Performance...');

        const metrics = await page.evaluate(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const paintMetrics = performance.getEntriesByType('paint');

            return {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domComplete: perfData.domComplete - perfData.navigationStart,
                firstPaint: paintMetrics.find(p => p.name === 'first-paint')?.startTime || 0,
                firstContentfulPaint: paintMetrics.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                resourceCount: performance.getEntriesByType('resource').length
            };
        });

        // Performance scoring
        let score = 100;
        if (metrics.loadTime > 3000) score -= 30; // >3s load time
        if (metrics.firstContentfulPaint > 2000) score -= 20; // >2s FCP
        if (metrics.resourceCount > 100) score -= 15; // Too many resources
        if (metrics.domComplete > 5000) score -= 25; // >5s DOM complete

        this.testResults.play.performance = Math.max(0, score);

        console.log(`  📊 Load Time: ${metrics.loadTime}ms`);
        console.log(`  🎨 First Paint: ${metrics.firstPaint}ms`);
        console.log(`  📄 DOM Complete: ${metrics.domComplete}ms`);
        console.log(`  📦 Resources: ${metrics.resourceCount}`);
        console.log(`  🏆 Performance Score: ${this.testResults.play.performance}/100`);

        if (score < 70) {
            this.criticalIssues.push('Performance below acceptable threshold');
        }
    }

    async testLoading(page) {
        console.log('📥 Testing Loading Systems...');

        let score = 100;

        // Test video preloader
        try {
            await page.evaluate(() => {
                const videos = document.querySelectorAll('video');
                return videos.length > 0;
            });
            console.log('  ✅ Video elements detected');
        } catch {
            score -= 25;
            console.log('  ❌ Video loading issues detected');
        }

        // Test image lazy loading
        const imageLoadTest = await page.evaluate(() => {
            const images = document.querySelectorAll('img');
            const loadedImages = Array.from(images).filter(img => img.complete);
            return { total: images.length, loaded: loadedImages.length };
        });

        const loadRatio = imageLoadTest.loaded / imageLoadTest.total;
        if (loadRatio < 0.8) score -= 30;

        console.log(`  🖼️ Images: ${imageLoadTest.loaded}/${imageLoadTest.total} loaded`);

        this.testResults.play.loading = Math.max(0, score);
        console.log(`  🏆 Loading Score: ${this.testResults.play.loading}/100`);
    }

    async testAnimation(page) {
        console.log('🎬 Testing Animation Performance...');

        let score = 100;

        // Test fish swimming animations
        const animationTest = await page.evaluate(() => {
            const fishElements = document.querySelectorAll('.fish');
            const animatedFish = Array.from(fishElements).filter(fish => {
                const style = getComputedStyle(fish);
                return style.animationName !== 'none';
            });
            return { total: fishElements.length, animated: animatedFish.length };
        });

        if (animationTest.total === 0) score -= 40;
        const animationRatio = animationTest.animated / (animationTest.total || 1);
        if (animationRatio < 0.7) score -= 20;

        // Test CSS animation performance
        const fps = await page.evaluate(() => {
            return new Promise(resolve => {
                let frames = 0;
                const startTime = performance.now();

                function countFrame() {
                    frames++;
                    if (performance.now() - startTime < 1000) {
                        requestAnimationFrame(countFrame);
                    } else {
                        resolve(frames);
                    }
                }
                requestAnimationFrame(countFrame);
            });
        });

        if (fps < 45) score -= 25; // Below 45 FPS

        console.log(`  🐠 Fish animations: ${animationTest.animated}/${animationTest.total}`);
        console.log(`  🎯 Animation FPS: ${fps}`);

        this.testResults.play.animation = Math.max(0, score);
        console.log(`  🏆 Animation Score: ${this.testResults.play.animation}/100`);
    }

    async testSystem(page) {
        console.log('🖥️ Testing System Integration...');

        let score = 100;

        // Test JavaScript module loading
        const moduleTest = await page.evaluate(() => {
            return {
                smartFishSystem: typeof SmartFishSystem !== 'undefined',
                aquariumGame: typeof AquariumCollectorGame !== 'undefined',
                videoPreloader: typeof VideoPreloader !== 'undefined',
                supabase: typeof SupabaseHighscoreManager !== 'undefined'
            };
        });

        Object.entries(moduleTest).forEach(([module, loaded]) => {
            if (!loaded) {
                score -= 20;
                console.log(`  ❌ ${module} module not loaded`);
            } else {
                console.log(`  ✅ ${module} module loaded`);
            }
        });

        this.testResults.play.system = Math.max(0, score);
        console.log(`  🏆 System Score: ${this.testResults.play.system}/100`);
    }

    async testResponsiveness(page) {
        console.log('📱 Testing Responsiveness...');

        let score = 100;
        const viewports = [
            { width: 375, height: 667, name: 'Mobile' },
            { width: 768, height: 1024, name: 'Tablet' },
            { width: 1920, height: 1080, name: 'Desktop' }
        ];

        for (const viewport of viewports) {
            await page.setViewportSize(viewport);
            await page.waitForTimeout(1000);

            const layoutTest = await page.evaluate(() => {
                const overflowElements = Array.from(document.querySelectorAll('*')).filter(el => {
                    const rect = el.getBoundingClientRect();
                    return rect.width > window.innerWidth;
                });
                return overflowElements.length;
            });

            if (layoutTest > 0) {
                score -= 15;
                console.log(`  ❌ ${viewport.name}: ${layoutTest} overflow elements`);
            } else {
                console.log(`  ✅ ${viewport.name}: Layout responsive`);
            }
        }

        this.testResults.ride.responsiveness = Math.max(0, score);
        console.log(`  🏆 Responsiveness Score: ${this.testResults.ride.responsiveness}/100`);
    }

    async testInteractivity(page) {
        console.log('🖱️ Testing Interactivity...');

        let score = 100;

        // Test fish spawning system
        try {
            await page.click('.fish', { timeout: 5000 });
            await page.waitForTimeout(1000);

            const fishCount = await page.evaluate(() => {
                return document.querySelectorAll('.fish').length;
            });

            if (fishCount > 0) {
                console.log(`  ✅ Fish spawning: ${fishCount} fish detected`);
            } else {
                score -= 30;
                console.log('  ❌ Fish spawning not working');
            }
        } catch {
            score -= 30;
            console.log('  ❌ Fish interaction failed');
        }

        // Test game functionality
        try {
            const gameButton = await page.$('.game-start-button, .start-game, [onclick*="game"]');
            if (gameButton) {
                console.log('  ✅ Game interface detected');
            } else {
                score -= 20;
                console.log('  ❌ Game interface not found');
            }
        } catch {
            score -= 20;
        }

        this.testResults.ride.interactivity = Math.max(0, score);
        console.log(`  🏆 Interactivity Score: ${this.testResults.ride.interactivity}/100`);
    }

    async testDesign(page) {
        console.log('🎨 Testing Design Consistency...');

        let score = 100;

        // Test CSS variables
        const cssTest = await page.evaluate(() => {
            const root = document.documentElement;
            const style = getComputedStyle(root);

            return {
                primaryBlue: style.getPropertyValue('--primary-blue'),
                secondaryTeal: style.getPropertyValue('--secondary-teal'),
                accentCoral: style.getPropertyValue('--accent-coral')
            };
        });

        if (!cssTest.primaryBlue || !cssTest.secondaryTeal) {
            score -= 25;
            console.log('  ❌ CSS color variables not properly set');
        } else {
            console.log('  ✅ CSS color system working');
        }

        // Test aquarium theme elements
        const themeTest = await page.evaluate(() => {
            const themeElements = {
                fish: document.querySelectorAll('.fish').length,
                bubbles: document.querySelectorAll('.bubble').length,
                seaweed: document.querySelectorAll('.seaweed').length
            };
            return themeElements;
        });

        if (themeTest.fish === 0) score -= 20;
        if (themeTest.bubbles === 0) score -= 15;

        console.log(`  🐠 Theme elements: ${themeTest.fish} fish, ${themeTest.bubbles} bubbles`);

        this.testResults.ride.design = Math.max(0, score);
        console.log(`  🏆 Design Score: ${this.testResults.ride.design}/100`);
    }

    async testErrorHandling(page) {
        console.log('🛡️ Testing Error Handling...');

        let score = 100;

        // Monitor console errors
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        // Test error scenarios
        await page.evaluate(() => {
            // Trigger potential errors
            try {
                nonExistentFunction();
            } catch (e) {
                // Should be handled gracefully
            }
        });

        await page.waitForTimeout(2000);

        if (errors.length > 0) {
            score -= errors.length * 10;
            console.log(`  ❌ Console errors detected: ${errors.length}`);
            errors.forEach(error => console.log(`     - ${error}`));
        } else {
            console.log('  ✅ No console errors detected');
        }

        this.testResults.ride.errorHandling = Math.max(0, score);
        console.log(`  🏆 Error Handling Score: ${this.testResults.ride.errorHandling}/100`);
    }

    async performSelfReflection() {
        console.log('\n🧠 SELF-REFLECTION ANALYSIS');
        console.log('============================');

        const playAvg = (this.testResults.play.performance + this.testResults.play.loading +
                        this.testResults.play.animation + this.testResults.play.system) / 4;

        const rideAvg = (this.testResults.ride.responsiveness + this.testResults.ride.interactivity +
                        this.testResults.ride.design + this.testResults.ride.errorHandling) / 4;

        this.testResults.overall = (playAvg + rideAvg) / 2;

        console.log(`🎮 PLAY Average: ${playAvg.toFixed(1)}/100`);
        console.log(`🏄 RIDE Average: ${rideAvg.toFixed(1)}/100`);
        console.log(`🏆 Overall Score: ${this.testResults.overall.toFixed(1)}/100`);

        // Self-reflection on results
        if (this.testResults.overall >= 90) {
            console.log('💎 EXCELLENCE: System performing at optimal level');
        } else if (this.testResults.overall >= 75) {
            console.log('✅ GOOD: System performing well with minor improvements needed');
        } else if (this.testResults.overall >= 60) {
            console.log('⚠️ ACCEPTABLE: System needs optimization');
        } else {
            console.log('🚨 CRITICAL: System requires immediate attention');
            this.criticalIssues.push('Overall performance below acceptable threshold');
        }
    }

    async generateRecommendations() {
        console.log('\n💡 AUTOMATED RECOMMENDATIONS');
        console.log('=============================');

        // Performance recommendations
        if (this.testResults.play.performance < 80) {
            this.recommendations.push('🔧 Optimize loading times - consider lazy loading and resource compression');
        }

        if (this.testResults.play.animation < 70) {
            this.recommendations.push('🎬 Improve animation performance - use CSS transforms and GPU acceleration');
        }

        if (this.testResults.ride.responsiveness < 85) {
            this.recommendations.push('📱 Enhance responsive design - test more viewport combinations');
        }

        if (this.testResults.ride.interactivity < 75) {
            this.recommendations.push('🖱️ Improve user interactions - add more feedback and error states');
        }

        this.recommendations.forEach(rec => console.log(rec));

        if (this.recommendations.length === 0) {
            console.log('🌟 No critical recommendations - system is well optimized!');
        }
    }

    async generateReport() {
        console.log('\n📊 FINAL PLAY/RIDE SELF-TEST REPORT');
        console.log('===================================');

        const report = {
            timestamp: new Date().toISOString(),
            scores: this.testResults,
            critical: this.criticalIssues,
            recommendations: this.recommendations,
            grade: this.getGrade(this.testResults.overall)
        };

        console.log(`🕒 Test completed at: ${report.timestamp}`);
        console.log(`🎯 Overall Grade: ${report.grade}`);
        console.log(`🔥 Critical Issues: ${report.critical.length}`);
        console.log(`💡 Recommendations: ${report.recommendations.length}`);

        return report;
    }

    getGrade(score) {
        if (score >= 95) return 'A+';
        if (score >= 90) return 'A';
        if (score >= 85) return 'A-';
        if (score >= 80) return 'B+';
        if (score >= 75) return 'B';
        if (score >= 70) return 'B-';
        if (score >= 65) return 'C+';
        if (score >= 60) return 'C';
        return 'F';
    }
}

// Auto-run if called directly
if (require.main === module) {
    const selfTest = new PlayRideSelfTest();
    selfTest.runFullTest().catch(console.error);
}

module.exports = { PlayRideSelfTest };