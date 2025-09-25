const { chromium } = require('playwright');

async function testMainSiteFish() {
    console.log('🐟 Testing Smart Fish System on Main Site');
    console.log('==========================================');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 100
    });
    const page = await browser.newPage();

    // Console logging
    page.on('console', msg => {
        if (msg.text().includes('🐟') || msg.text().includes('Fish')) {
            console.log(`[PAGE] ${msg.text()}`);
        }
    });

    page.on('pageerror', error => {
        console.error('❌ Page Error:', error.message);
    });

    try {
        console.log('\n📍 Loading main site...');
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

        console.log('\n📍 Waiting for fish system initialization...');
        await page.waitForTimeout(5000);

        // Check if fish system is working
        const fishStatus = await page.evaluate(() => {
            return {
                initialized: !!window.SMART_FISH_SYSTEM_INITIALIZED,
                apiExists: !!window.fishSystemAPI,
                fishCount: window.fishSystemAPI ? window.fishSystemAPI.getFishCount() : 0,
                smartFishElements: document.querySelectorAll('.smart-fish').length,
                allFishElements: document.querySelectorAll('[class*="fish"]').length
            };
        });

        console.log('\n📊 Fish System Status:');
        console.log(`   Initialized: ${fishStatus.initialized}`);
        console.log(`   API Available: ${fishStatus.apiExists}`);
        console.log(`   Fish Count (API): ${fishStatus.fishCount}`);
        console.log(`   Smart Fish Elements: ${fishStatus.smartFishElements}`);
        console.log(`   All Fish Elements: ${fishStatus.allFishElements}`);

        if (fishStatus.initialized && fishStatus.smartFishElements > 0) {
            console.log('\n✅ FISH SYSTEM IS WORKING ON MAIN SITE!');

            // Test fish details
            console.log('\n📍 Testing Fish Details:');
            const fishDetails = await page.evaluate(() => {
                const fish = document.querySelectorAll('.smart-fish');
                return Array.from(fish).map(f => {
                    const rect = f.getBoundingClientRect();
                    const style = getComputedStyle(f);
                    return {
                        emoji: f.innerHTML,
                        transform: f.style.transform,
                        opacity: style.opacity,
                        zIndex: style.zIndex,
                        position: {
                            x: parseInt(f.style.left) || 0,
                            y: parseInt(f.style.top) || 0
                        },
                        visible: rect.width > 0 && rect.height > 0,
                        clickable: f.style.pointerEvents !== 'none'
                    };
                });
            });

            fishDetails.forEach((fish, i) => {
                const direction = fish.transform.includes('scaleX(-1)') ? 'Right (flipped)' : 'Right (normal)';
                console.log(`🐟 Fish ${i+1}: ${fish.emoji} - ${direction} - pos(${fish.position.x}, ${fish.position.y}) - opacity: ${fish.opacity} - clickable: ${fish.clickable}`);
            });

            // Test speed by checking movement
            console.log('\n📍 Testing Fish Movement (Speed Check):');
            const initialPositions = await page.evaluate(() => {
                const fish = document.querySelectorAll('.smart-fish');
                return Array.from(fish).map(f => ({
                    id: f.dataset.fishId,
                    x: parseInt(f.style.left) || 0
                }));
            });

            await page.waitForTimeout(3000); // Wait 3 seconds

            const newPositions = await page.evaluate(() => {
                const fish = document.querySelectorAll('.smart-fish');
                return Array.from(fish).map(f => ({
                    id: f.dataset.fishId,
                    x: parseInt(f.style.left) || 0
                }));
            });

            initialPositions.forEach((initial, i) => {
                const final = newPositions.find(p => p.id === initial.id);
                if (final) {
                    const distance = final.x - initial.x;
                    const speed = distance / 3; // pixels per second
                    console.log(`🐟 Fish ${initial.id}: moved ${distance}px in 3s (${speed.toFixed(1)}px/s) - ${speed < 30 ? 'Good Speed ✅' : 'Too Fast ⚠️'}`);
                }
            });

            // Test interaction
            console.log('\n📍 Testing Fish Interaction:');
            const beforeClick = await page.$$eval('.smart-fish', els => els.length);

            try {
                // Click on a fish
                await page.locator('.smart-fish').first().click({ force: true, timeout: 5000 });
                await page.waitForTimeout(2000);

                const afterClick = await page.$$eval('.smart-fish', els => els.length);
                console.log(`🐟 Fish count: ${beforeClick} → ${afterClick} (${afterClick > beforeClick ? 'Spawning works ✅' : 'No spawn ⚠️'})`);

            } catch (error) {
                console.log(`⚠️ Click test failed: ${error.message.substring(0, 50)}...`);
            }

            // Test page visibility (main content should be visible)
            console.log('\n📍 Testing Main Site Visibility:');
            const siteVisibility = await page.evaluate(() => {
                const title = document.querySelector('title')?.textContent || 'No title';
                const h1 = document.querySelector('h1')?.textContent || 'No h1';
                const body = document.body?.innerHTML?.length || 0;
                const menuVisible = !!document.querySelector('.menu-button, nav, header');

                return {
                    title: title.substring(0, 50),
                    h1: h1.substring(0, 50),
                    bodyLength: body,
                    menuVisible,
                    fishObscuring: false // Fish shouldn't obscure main content
                };
            });

            console.log(`📄 Page Title: ${siteVisibility.title}`);
            console.log(`📄 Main Heading: ${siteVisibility.h1}`);
            console.log(`📄 Body Content: ${siteVisibility.bodyLength} characters`);
            console.log(`📄 Navigation Visible: ${siteVisibility.menuVisible}`);

            if (siteVisibility.bodyLength > 10000 && siteVisibility.menuVisible) {
                console.log('✅ Main site content is properly visible!');
            } else {
                console.log('⚠️ Main site visibility may be impaired');
            }

        } else {
            console.log('\n❌ FISH SYSTEM NOT WORKING ON MAIN SITE');
            console.log('Possible issues:');
            console.log('- Script conflicts with other modules');
            console.log('- Initialization timing problems');
            console.log('- DOM conflicts or CSS issues');
        }

        console.log('\n⏱️ Keeping browser open for manual inspection (20s)...');
        await page.waitForTimeout(20000);

    } catch (error) {
        console.error('❌ Test error:', error.message);
    } finally {
        await browser.close();
    }
}

testMainSiteFish().catch(console.error);