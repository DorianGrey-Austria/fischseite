const { chromium } = require('playwright');

async function simpleTest() {
    console.log('🐟 Simple Fish Test...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

    try {
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Test fish orientations after spawning manually
        await page.evaluate(() => {
            // Clear existing fish
            if (window.fishSystemAPI) {
                window.fishSystemAPI.reset();
            }

            // Spawn test fish
            for (let i = 0; i < 8; i++) {
                const x = 200 + i * 100;
                const y = 200;
                window.fishSystemAPI.spawnFish(x, y, 'foreground');
            }
        });

        await page.waitForTimeout(1000);

        const results = await page.evaluate(() => {
            const fishes = document.querySelectorAll('.smart-fish');
            const orientations = [];

            fishes.forEach((fish, index) => {
                const emoji = fish.textContent.trim();
                const transform = fish.style.transform;

                // Check orientation based on fish type
                let expected = '';
                let actual = '';
                let correct = false;

                if (['🐠', '🐟', '🐡', '🦈'].includes(emoji)) {
                    expected = 'scaleX(-1)';
                    actual = transform;
                    correct = transform.includes('scaleX(-1)');
                } else if (['🦐', '🦞'].includes(emoji)) {
                    expected = 'scaleX(1)';
                    actual = transform;
                    correct = transform.includes('scaleX(1)') && !transform.includes('scaleX(-1)');
                } else {
                    expected = 'Any';
                    actual = transform;
                    correct = true;
                }

                orientations.push({
                    emoji,
                    expected,
                    actual,
                    correct
                });
            });

            return {
                orientations,
                totalFish: fishes.length,
                correctCount: orientations.filter(o => o.correct).length
            };
        });

        console.log('🧭 Fish Orientation Results:');
        results.orientations.forEach((fish, i) => {
            const status = fish.correct ? '✅' : '❌';
            console.log(`${status} ${fish.emoji}: Expected ${fish.expected}, Got ${fish.actual}`);
        });

        console.log(`\n📊 Summary: ${results.correctCount}/${results.totalFish} fish correctly oriented`);

        // Test interaction via API instead of clicking
        console.log('\n👆 Testing spawn interaction:');
        const initialCount = await page.evaluate(() => window.fishSystemAPI.getFishCount());

        await page.evaluate(() => {
            // Simulate click spawn
            window.fishSystemAPI.spawnFish(400, 300, 'foreground');
        });

        const afterSpawn = await page.evaluate(() => window.fishSystemAPI.getFishCount());
        console.log(`Fish count: ${initialCount} → ${afterSpawn} (${afterSpawn > initialCount ? '✅ Working' : '❌ Not working'})`);

        console.log('\n✅ Basic functionality test complete!');
        await page.waitForTimeout(3000);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

simpleTest();
