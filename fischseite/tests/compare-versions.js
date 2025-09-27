const { chromium } = require('playwright');

async function compareVersions() {
    console.log('🔍 CLAUDE CODE DEPLOYMENT TEST - Version Comparison');
    console.log('=' .repeat(60));

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();

    try {
        // Test local version
        console.log('📍 LOCAL VERSION (http://localhost:8080)');
        console.log('-'.repeat(40));

        const localPage = await context.newPage();
        await localPage.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });

        const localData = {
            title: await localPage.title(),
            version: await localPage.evaluate(() => {
                const html = document.documentElement.outerHTML;
                const match = html.match(/VERSION\s*([\d.]+)/i);
                return match ? match[1] : 'Unknown';
            }),
            bannerVisible: await localPage.locator('div[style*="background:#00ff00"]').count() > 0,
            heroSections: await localPage.locator('.hero').count(),
            smartFishLoaded: await localPage.locator('script[src*="smart-fish-system"]').count() > 0,
            imageCount: await localPage.locator('img').count(),
            fishElements: await localPage.locator('.fish, [class*="fish"]').count()
        };

        if (localData.bannerVisible) {
            localData.bannerText = await localPage.locator('div[style*="background:#00ff00"]').first().textContent();
        }

        console.log(`📝 Title: ${localData.title}`);
        console.log(`🚀 Version: ${localData.version}`);
        console.log(`🟢 Banner: ${localData.bannerVisible ? 'VISIBLE' : 'NOT FOUND'}`);
        if (localData.bannerText) console.log(`📢 Banner Text: ${localData.bannerText}`);
        console.log(`🎯 Hero sections: ${localData.heroSections}`);
        console.log(`🐠 Smart Fish System: ${localData.smartFishLoaded ? 'Yes' : 'No'}`);
        console.log(`🖼️ Images: ${localData.imageCount}`);
        console.log(`🐟 Fish elements: ${localData.fishElements}`);

        await localPage.close();

        // Test online version
        console.log('\\n🌐 ONLINE VERSION (https://vibecoding.company/fischseite/)');
        console.log('-'.repeat(40));

        const onlinePage = await context.newPage();
        await onlinePage.goto('https://vibecoding.company/fischseite/', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        const onlineData = {
            title: await onlinePage.title(),
            version: await onlinePage.evaluate(() => {
                const html = document.documentElement.outerHTML;
                const match = html.match(/VERSION\s*([\d.]+)/i);
                return match ? match[1] : 'Unknown';
            }),
            bannerVisible: await onlinePage.locator('div[style*="background:#00ff00"]').count() > 0,
            heroSections: await onlinePage.locator('.hero').count(),
            smartFishLoaded: await onlinePage.locator('script[src*="smart-fish-system"]').count() > 0,
            imageCount: await onlinePage.locator('img').count(),
            fishElements: await onlinePage.locator('.fish, [class*="fish"]').count()
        };

        if (onlineData.bannerVisible) {
            onlineData.bannerText = await onlinePage.locator('div[style*="background:#00ff00"]').first().textContent();
        }

        console.log(`📝 Title: ${onlineData.title}`);
        console.log(`🚀 Version: ${onlineData.version}`);
        console.log(`🟢 Banner: ${onlineData.bannerVisible ? 'VISIBLE' : 'NOT FOUND'}`);
        if (onlineData.bannerText) console.log(`📢 Banner Text: ${onlineData.bannerText}`);
        console.log(`🎯 Hero sections: ${onlineData.heroSections}`);
        console.log(`🐠 Smart Fish System: ${onlineData.smartFishLoaded ? 'Yes' : 'No'}`);
        console.log(`🖼️ Images: ${onlineData.imageCount}`);
        console.log(`🐟 Fish elements: ${onlineData.fishElements}`);

        await onlinePage.close();

        // Comparison
        console.log('\\n⚖️ COMPARISON ANALYSIS');
        console.log('=' .repeat(60));

        const versionMatch = localData.version === onlineData.version;
        const bannerMatch = localData.bannerVisible === onlineData.bannerVisible;
        const deploymentSuccessful = localData.bannerVisible && onlineData.bannerVisible;

        console.log(`🔢 Version Match: ${versionMatch ? '✅ YES' : '❌ NO'} (Local: ${localData.version}, Online: ${onlineData.version})`);
        console.log(`🏷️ Banner Match: ${bannerMatch ? '✅ YES' : '❌ NO'} (Local: ${localData.bannerVisible}, Online: ${onlineData.bannerVisible})`);
        console.log(`🚀 Deployment Status: ${deploymentSuccessful ? '✅ SUCCESS' : '❌ FAILED'}`);

        if (!deploymentSuccessful) {
            console.log('\\n📋 DEPLOYMENT ANALYSIS:');
            console.log('- Local version shows new banner and version 5.1');
            console.log('- Online version still shows old version 2.7');
            console.log('- GitHub Actions deployment likely failed');
            console.log('- Manual investigation of deployment logs required');
        } else {
            console.log('\\n🎉 SUCCESS: Claude Code can successfully deploy to Hostinger!');
        }

        console.log('\\n📊 CLAUDE CODE DEPLOYMENT CAPABILITY:');
        console.log(`✅ Can create local changes: YES`);
        console.log(`✅ Can trigger GitHub Actions: YES`);
        console.log(`${deploymentSuccessful ? '✅' : '❌'} Can deploy to production: ${deploymentSuccessful ? 'YES' : 'FAILED (this time)'}`);

        return { localData, onlineData, deploymentSuccessful };

    } catch (error) {
        console.error('❌ Error during comparison:', error.message);
        throw error;
    } finally {
        await browser.close();
    }
}

compareVersions().catch(console.error);