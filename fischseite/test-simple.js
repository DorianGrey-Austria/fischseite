const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(3000);

        const results = await page.evaluate(() => {
            // Reset and spawn fish
            if (window.fishSystemAPI) {
                window.fishSystemAPI.reset();
                for (let i = 0; i < 5; i++) {
                    window.fishSystemAPI.spawnFish(200 + i * 120, 300, 'foreground');
                }
            }

            setTimeout(() => {
                const fishes = document.querySelectorAll('.smart-fish');
                const orientations = [];

                fishes.forEach(fish => {
                    const emoji = fish.textContent.trim();
                    const transform = fish.style.transform;
                    
                    let correct = false;
                    if (['🐠', '🐟', '🐡', '🦈'].includes(emoji)) {
                        correct = transform.includes('scaleX(-1)');
                    } else if (['🦐', '🦞'].includes(emoji)) {
                        correct = transform.includes('scaleX(1)') && !transform.includes('-1');
                    } else {
                        correct = true;
                    }

                    orientations.push({ emoji, transform, correct });
                });

                console.log('Fish orientations:');
                orientations.forEach(o => {
                    console.log(`${o.correct ? '✅' : '❌'} ${o.emoji}: ${o.transform}`);
                });
            }, 1000);

            return 'test started';
        });

        await page.waitForTimeout(5000);
        console.log('✅ Test completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await browser.close();
    }
})();
