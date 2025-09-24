const { chromium } = require('playwright');

async function analyzeMenu() {
    console.log('🔍 Analysiere aktuelles Menü-Design...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Local server starten
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

        // Warten auf vollständiges Laden
        await page.waitForTimeout(2000);

        // Menü analysieren
        console.log('📱 MOBILE MENU ANALYSE:');

        // Mobile Viewport setzen
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000);

        // Hamburger Button prüfen
        const hamburger = await page.locator('.menu-toggle');
        if (await hamburger.isVisible()) {
            console.log('✅ Hamburger Menu gefunden');

            // Screenshot vor Klick
            await page.screenshot({ path: 'menu-closed.png', fullPage: true });
            console.log('📸 Screenshot: menu-closed.png');

            // Menü öffnen
            await hamburger.click();
            await page.waitForTimeout(500);

            // Screenshot nach Klick
            await page.screenshot({ path: 'menu-open.png', fullPage: true });
            console.log('📸 Screenshot: menu-open.png');

            // Menü-Items analysieren
            const menuItems = await page.locator('.mobile-menu a').all();
            console.log(`📋 Anzahl Menü-Items: ${menuItems.length}`);

            for (let i = 0; i < menuItems.length; i++) {
                const text = await menuItems[i].textContent();
                const visible = await menuItems[i].isVisible();
                console.log(`   ${i+1}. "${text}" - Sichtbar: ${visible}`);
            }

        } else {
            console.log('❌ Kein Hamburger Menu gefunden');
        }

        console.log('\n🖥️ DESKTOP MENU ANALYSE:');

        // Desktop Viewport
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.waitForTimeout(1000);

        // Desktop Menu Screenshot
        await page.screenshot({ path: 'menu-desktop.png', fullPage: true });
        console.log('📸 Screenshot: menu-desktop.png');

        // Navigation analysieren
        const nav = await page.locator('nav');
        if (await nav.isVisible()) {
            console.log('✅ Desktop Navigation gefunden');

            const navItems = await page.locator('nav a').all();
            console.log(`📋 Anzahl Nav-Items: ${navItems.length}`);

            for (let i = 0; i < navItems.length; i++) {
                const text = await navItems[i].textContent();
                const visible = await navItems[i].isVisible();
                console.log(`   ${i+1}. "${text}" - Sichtbar: ${visible}`);
            }
        }

        // CSS Styling analysieren
        console.log('\n🎨 STYLING ANALYSE:');

        // Menü-Container Styling
        const menuContainer = await page.locator('.mobile-menu');
        if (await menuContainer.isVisible()) {
            const styles = await menuContainer.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    backgroundColor: computed.backgroundColor,
                    position: computed.position,
                    zIndex: computed.zIndex,
                    opacity: computed.opacity,
                    transform: computed.transform
                };
            });
            console.log('📱 Mobile Menu Styles:', styles);
        }

        console.log('\n✅ Menü-Analyse abgeschlossen!');
        console.log('📸 Screenshots gespeichert für visuelle Inspektion');

    } catch (error) {
        console.error('❌ Fehler bei der Menü-Analyse:', error.message);
        console.log('\n💡 Tipp: Stelle sicher, dass der lokale Server läuft:');
        console.log('   python3 -m http.server 8000');
    }

    await browser.close();
}

// Ausführen
analyzeMenu();