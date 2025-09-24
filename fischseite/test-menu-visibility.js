const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    console.log('🔍 Testing Menu Visibility...\n');

    // Test Desktop View
    await page.goto('http://localhost:8000');
    await page.waitForTimeout(2000);

    // Check if navigation is visible
    const navVisible = await page.isVisible('nav');
    console.log(`✅ Navigation element exists: ${navVisible}`);

    // Check menu items visibility
    const menuItems = await page.$$eval('.nav-links a', links =>
        links.map(link => ({
            text: link.textContent,
            visible: window.getComputedStyle(link).display !== 'none',
            color: window.getComputedStyle(link).color,
            backgroundColor: window.getComputedStyle(link).backgroundColor
        }))
    );

    console.log('\n📋 Desktop Menu Items:');
    menuItems.forEach(item => {
        console.log(`  - ${item.text}: ${item.visible ? '✅ Visible' : '❌ Hidden'}`);
        console.log(`    Color: ${item.color}, BG: ${item.backgroundColor}`);
    });

    // Check header styling
    const headerStyle = await page.$eval('header', header => ({
        backgroundColor: window.getComputedStyle(header).backgroundColor,
        height: window.getComputedStyle(header).height,
        position: window.getComputedStyle(header).position
    }));

    console.log('\n🎨 Header Styling:');
    console.log(`  Background: ${headerStyle.backgroundColor}`);
    console.log(`  Height: ${headerStyle.height}`);
    console.log(`  Position: ${headerStyle.position}`);

    // Test Mobile View
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    console.log('\n📱 Mobile View:');

    // Check hamburger menu
    const hamburgerVisible = await page.isVisible('.hamburger');
    console.log(`  Hamburger Menu: ${hamburgerVisible ? '✅ Visible' : '❌ Hidden'}`);

    if (hamburgerVisible) {
        // Test hamburger click
        await page.click('.hamburger');
        await page.waitForTimeout(500);

        const mobileMenuOpen = await page.$eval('.nav-links', nav =>
            nav.classList.contains('active')
        );
        console.log(`  Mobile Menu Opens: ${mobileMenuOpen ? '✅ Yes' : '❌ No'}`);
    }

    // Take screenshots
    await page.screenshot({ path: 'menu-desktop.png', fullPage: false });
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: 'menu-mobile.png', fullPage: false });

    console.log('\n📸 Screenshots saved: menu-desktop.png, menu-mobile.png');

    await browser.close();
})();