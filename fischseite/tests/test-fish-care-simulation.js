const { chromium } = require('playwright');

// 🐠 FISH CARE SIMULATION GAME TESTER
// Test das vierte Spiel der Fischseite - komplette Aquarium-Pflege Simulation

(async () => {
    console.log('🐠 FISH CARE SIMULATION GAME TESTER');
    console.log('=====================================');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    const errors = [];

    // Error tracking
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
    });

    try {
        // Navigate to the game
        console.log('🌐 Loading website...');
        await page.goto('http://localhost:8003', { waitUntil: 'networkidle' });

        // Wait for page load
        await page.waitForTimeout(2000);

        // Check if fish care simulation is loaded
        console.log('🔍 Checking Fish Care Simulation integration...');

        // Check if the script is loaded
        const scriptLoaded = await page.evaluate(() => {
            return typeof startFishCareSimulation === 'function';
        });

        if (scriptLoaded) {
            console.log('✅ Fish Care Simulation script loaded successfully');
        } else {
            console.log('❌ Fish Care Simulation script not found');
            return;
        }

        // Check if the game button exists
        const gameButton = await page.$('button[onclick="startFishCareSimulation()"]');
        if (gameButton) {
            console.log('✅ Game start button found');
        } else {
            console.log('❌ Game start button not found');
            return;
        }

        // Start the Fish Care Simulation
        console.log('🎮 Starting Fish Care Simulation...');
        await page.click('button[onclick="startFishCareSimulation()"]');

        // Wait for game interface to load
        await page.waitForTimeout(3000);

        // Check if game interface opened
        const gameContainer = await page.$('#fish-care-game');
        if (gameContainer) {
            console.log('✅ Fish Care Simulation interface opened');
        } else {
            console.log('❌ Fish Care Simulation interface not found');
            return;
        }

        // 🔬 TEST PARAMETER SYSTEM
        console.log('🔬 Testing Parameter System...');

        // Check if parameters are displayed
        const parameters = await page.$$('.parameter-panel');
        console.log(`  📊 Parameter panels found: ${parameters.length}`);

        if (parameters.length >= 7) {
            console.log('  ✅ All expected parameters present (Temperature, pH, Oxygen, etc.)');
        } else {
            console.log('  ⚠️ Some parameters missing');
        }

        // Check if parameter values are updating
        const temperatureValue = await page.$eval('#param-temperature', el => el.textContent);
        console.log(`  🌡️ Temperature: ${temperatureValue}°C`);

        const phValue = await page.$eval('#param-ph', el => el.textContent);
        console.log(`  ⚗️ pH Value: ${phValue}`);

        const oxygenValue = await page.$eval('#param-oxygen', el => el.textContent);
        console.log(`  💨 Oxygen: ${oxygenValue} mg/L`);

        // 🛠️ TEST MAINTENANCE SYSTEM
        console.log('🛠️ Testing Maintenance System...');

        // Check maintenance activities
        const maintenanceButtons = await page.$$('.maintenance-button');
        console.log(`  🔧 Maintenance activities found: ${maintenanceButtons.length}`);

        if (maintenanceButtons.length >= 6) {
            console.log('  ✅ All expected maintenance activities present');
        } else {
            console.log('  ⚠️ Some maintenance activities missing');
        }

        // Test performing a maintenance activity
        const feedingButton = await page.$('button[onclick*="feeding"]');
        if (feedingButton) {
            console.log('  🍽️ Testing feeding activity...');
            await feedingButton.click();
            await page.waitForTimeout(1000);

            // Check for notification
            const notification = await page.$('.notification');
            if (notification) {
                const notificationText = await notification.textContent();
                console.log(`  ✅ Maintenance notification: ${notificationText.substring(0, 50)}...`);
            }
        }

        // 🎯 TEST GAME STATS
        console.log('🎯 Testing Game Statistics...');

        const healthValue = await page.$eval('#health-value', el => el.textContent);
        const scoreValue = await page.$eval('#score-value', el => el.textContent);
        const timeValue = await page.$eval('#time-value', el => el.textContent);

        console.log(`  ❤️ Aquarium Health: ${healthValue}%`);
        console.log(`  🏆 Score: ${scoreValue}`);
        console.log(`  📅 Game Day: ${timeValue}`);

        // 🎓 TEST EDUCATIONAL CONTENT
        console.log('🎓 Testing Educational System...');

        // Click on a parameter for educational content
        const temperaturePanel = await page.$('[data-parameter="temperature"]');
        if (temperaturePanel) {
            await temperaturePanel.click();
            await page.waitForTimeout(1000);

            const educationContent = await page.$('#education-content .education-tip');
            if (educationContent) {
                const educationText = await educationContent.textContent();
                console.log(`  ✅ Educational content displayed: ${educationText.substring(0, 50)}...`);
            }
        }

        // 🎨 TEST VISUAL ELEMENTS
        console.log('🎨 Testing Visual Elements...');

        // Check aquarium visual
        const aquariumVisual = await page.$('.aquarium-visual');
        if (aquariumVisual) {
            console.log('  ✅ Aquarium visualization present');
        }

        // Check fish swimming animation
        const fishSwimming = await page.$('.fish-swimming');
        if (fishSwimming) {
            console.log('  ✅ Fish swimming animation present');
        }

        // Check plants decoration
        const plantsDecoration = await page.$('.plants-decoration');
        if (plantsDecoration) {
            console.log('  ✅ Plant decorations present');
        }

        // 📱 TEST RESPONSIVE DESIGN
        console.log('📱 Testing Responsive Design...');

        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000);

        const mobileLayout = await page.evaluate(() => {
            const container = document.querySelector('.fish-care-container');
            return container && container.offsetWidth < 400;
        });

        if (mobileLayout) {
            console.log('  ✅ Mobile layout adapts correctly');
        } else {
            console.log('  ⚠️ Mobile layout might need adjustment');
        }

        // Reset to desktop viewport
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.waitForTimeout(1000);

        // 🚨 TEST CRISIS MANAGEMENT (if any active)
        console.log('🚨 Testing Crisis Management...');

        const crisisPanel = await page.$('#crisis-panel');
        const crisisVisible = await page.evaluate(el => {
            return el && el.style.display !== 'none';
        }, crisisPanel);

        if (crisisVisible) {
            console.log('  🚨 Crisis detected - testing crisis management interface');
            const crisisContent = await page.$('#crisis-content');
            if (crisisContent) {
                console.log('  ✅ Crisis management interface active');
            }
        } else {
            console.log('  ✅ No crisis detected - system running normally');
        }

        // 🔄 TEST SIMULATION TIMING
        console.log('🔄 Testing Simulation Timing...');

        // Wait and check if values change
        const initialTemp = parseFloat(await page.$eval('#param-temperature', el => el.textContent));
        await page.waitForTimeout(3000);
        const updatedTemp = parseFloat(await page.$eval('#param-temperature', el => el.textContent));

        if (Math.abs(initialTemp - updatedTemp) > 0.001) {
            console.log(`  ✅ Simulation running - temperature changed from ${initialTemp} to ${updatedTemp}`);
        } else {
            console.log('  ⚠️ Simulation might not be updating parameters');
        }

        // 📊 FINAL ASSESSMENT
        console.log('\n📊 FISH CARE SIMULATION ASSESSMENT');
        console.log('===================================');

        let score = 0;
        const maxScore = 10;

        // Score components
        if (scriptLoaded) score += 1;
        if (gameContainer) score += 1;
        if (parameters.length >= 7) score += 1;
        if (maintenanceButtons.length >= 6) score += 1;
        if (parseInt(healthValue) > 0) score += 1;
        if (parseInt(scoreValue) >= 0) score += 1;
        if (aquariumVisual) score += 1;
        if (fishSwimming) score += 1;
        if (plantsDecoration) score += 1;
        if (Math.abs(initialTemp - updatedTemp) > 0.001) score += 1;

        const percentage = (score / maxScore) * 100;
        console.log(`🏆 Fish Care Simulation Score: ${score}/${maxScore} (${percentage}%)`);

        if (percentage >= 90) {
            console.log('🌟 EXCELLENT: Fish Care Simulation is fully functional!');
        } else if (percentage >= 80) {
            console.log('✅ GOOD: Fish Care Simulation working well with minor issues');
        } else if (percentage >= 70) {
            console.log('⚠️ FAIR: Fish Care Simulation needs some improvements');
        } else {
            console.log('❌ POOR: Fish Care Simulation has significant issues');
        }

        // Error summary
        if (errors.length > 0) {
            console.log(`\n🚨 Console Errors: ${errors.length}`);
            errors.forEach(error => console.log(`  ❌ ${error}`));
        } else {
            console.log('\n✅ No console errors detected');
        }

        // Wait a moment for user to see the results
        console.log('\n🔍 Fish Care Simulation test completed. Browser will remain open for manual inspection.');
        console.log('💡 You can now manually test the full simulation features!');

        // Keep browser open for manual testing
        await page.waitForTimeout(5000);

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }

    // Don't close browser - let user test manually
    // await browser.close();
})();