const { chromium } = require('playwright');

async function testLocalWebsite() {
    console.log('🔍 Testing Local Fischseite Version...');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Load local version
        await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });

        // Check title
        const title = await page.title();
        console.log(`📝 Title: ${title}`);

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

        console.log('✅ Local version analysis complete');
        return {
            title,
            heroSections: hero,
            smartFishLoaded: smartFishScript > 0,
            imageCount: images,
            fishElements,
            version: versionComment
        };

    } catch (error) {
        console.error('❌ Error testing local version:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

testLocalWebsite().catch(console.error);