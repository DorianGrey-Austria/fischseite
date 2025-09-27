const { chromium } = require('playwright');

async function testOnlineWebsite() {
    console.log('🌐 Testing Online Fischseite Version...');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Load online version
        console.log('📡 Loading https://vibecoding.company/fischseite/...');
        await page.goto('https://vibecoding.company/fischseite/', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        // Check title
        const title = await page.title();
        console.log(`📝 Title: ${title}`);

        // Check for deployment banner
        const banner = await page.locator('div[style*="background:#00ff00"]').count();
        console.log(`🟢 Deployment Banner: ${banner > 0 ? 'VISIBLE' : 'NOT FOUND'}`);

        // Get banner text if present
        if (banner > 0) {
            const bannerText = await page.locator('div[style*="background:#00ff00"]').first().textContent();
            console.log(`📢 Banner Text: ${bannerText}`);
        }

        // Check for main elements
        const hero = await page.locator('.hero').count();
        console.log(`🎯 Hero sections: ${hero}`);

        // Check for JavaScript modules
        const smartFishScript = await page.locator('script[src*="smart-fish-system"]').count();
        console.log(`🐠 Smart Fish System loaded: ${smartFishScript > 0 ? 'Yes' : 'No'}`);

        // Check for images
        const images = await page.locator('img').count();
        console.log(`🖼️ Images found: ${images}`);

        // Check for interactive elements
        const fishElements = await page.locator('.fish, [class*="fish"]').count();
        console.log(`🐟 Fish elements: ${fishElements}`);

        // Get version info
        const versionComment = await page.evaluate(() => {
            const htmlContent = document.documentElement.outerHTML;
            const match = htmlContent.match(/VERSION\s*([\d.]+)/i);
            return match ? match[1] : 'Unknown';
        });
        console.log(`🚀 Version: ${versionComment}`);

        // Check page load performance
        const performanceTiming = await page.evaluate(() => performance.timing);
        const loadTime = performanceTiming.loadEventEnd - performanceTiming.navigationStart;
        console.log(`⚡ Load Time: ${loadTime}ms`);

        console.log('✅ Online version analysis complete');
        return {
            title,
            bannerVisible: banner > 0,
            bannerText: banner > 0 ? await page.locator('div[style*="background:#00ff00"]').first().textContent() : null,
            heroSections: hero,
            smartFishLoaded: smartFishScript > 0,
            imageCount: images,
            fishElements,
            version: versionComment,
            loadTime
        };

    } catch (error) {
        console.error('❌ Error testing online version:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

testOnlineWebsite().catch(console.error);