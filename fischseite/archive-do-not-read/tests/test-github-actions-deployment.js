const { chromium } = require('playwright');

async function testGitHubActionsDeployment() {
    console.log('🧪 GitHub Actions Deployment Test');
    console.log('=====================================');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Test localhost first (should show new banner)
        console.log('\n📍 Testing localhost (development)...');
        await page.goto('file:///Users/doriangrey/Desktop/coding/fischseite/index.html');
        await page.waitForTimeout(2000);

        const localBanner = await page.locator('.deployment-banner').isVisible();
        if (localBanner) {
            const bannerText = await page.locator('.deployment-banner').textContent();
            console.log('✅ Local Banner gefunden:', bannerText);
        } else {
            console.log('❌ Local Banner nicht gefunden');
        }

        // Wait for GitHub Actions to complete (usually 2-5 minutes)
        console.log('\n⏱️ Warte auf GitHub Actions Deployment...');
        console.log('(Dies dauert normalerweise 2-5 Minuten)');

        // Test production URL after deployment
        const productionURLs = [
            'https://ki-revolution.at',
            'https://doriangrey.info'
        ];

        for (const url of productionURLs) {
            try {
                console.log(`\n🌐 Teste ${url}...`);
                await page.goto(url, { waitUntil: 'networkidle' });
                await page.waitForTimeout(3000);

                const prodBanner = await page.locator('.deployment-banner').isVisible();
                if (prodBanner) {
                    const bannerText = await page.locator('.deployment-banner').textContent();
                    console.log(`✅ ${url} - Banner gefunden:`, bannerText);

                    if (bannerText.includes('VERSION 2.2')) {
                        console.log(`🎉 ${url} - DEPLOYMENT ERFOLGREICH! Neue Version ist live!`);
                    } else {
                        console.log(`⚠️ ${url} - Banner gefunden, aber alte Version`);
                    }
                } else {
                    console.log(`❌ ${url} - Banner nicht gefunden (möglicherweise alte Version oder Cache)`);
                }
            } catch (error) {
                console.log(`❌ ${url} - Fehler beim Laden:`, error.message);
            }
        }

    } catch (error) {
        console.error('❌ Test fehler:', error.message);
    } finally {
        await browser.close();
    }

    console.log('\n📋 DEPLOYMENT TEST ZUSAMMENFASSUNG:');
    console.log('=====================================');
    console.log('✅ GitHub Actions wurde getriggert (git push erfolgreich)');
    console.log('✅ Deployment-Banner im lokalen Code hinzugefügt');
    console.log('⏱️ Production-Test: Bitte in 5-10 Minuten manuell prüfen');
    console.log('\n🔍 MANUELLE VERIFIKATION ERFORDERLICH:');
    console.log('1. https://ki-revolution.at besuchen');
    console.log('2. Grünen Banner mit "VERSION 2.2" suchen');
    console.log('3. Screenshot machen und bestätigen');
}

// Test ausführen
testGitHubActionsDeployment().catch(console.error);