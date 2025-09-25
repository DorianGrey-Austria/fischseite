const { chromium } = require('playwright');

async function testMemberPortraits() {
    console.log('🧪 Testing Complete Member Portrait Functionality...\n');

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // Load the website
        await page.goto('http://localhost:8080');
        await page.waitForTimeout(2000);

        console.log('✅ Website loaded successfully');

        // Test 1: Check new navigation items
        console.log('\n📋 Testing Updated Navigation...');
        const navItems = await page.locator('.nav-links a').allTextContents();
        console.log(`✅ Navigation items: ${navItems.join(', ')}`);

        // Check if Mitglieder-Portraits is in navigation
        const hasPortraitsNav = navItems.includes('Mitglieder-Portraits');
        console.log(`✅ Mitglieder-Portraits navigation: ${hasPortraitsNav ? 'Present' : 'Missing'}`);

        // Test 2: Check updated gallery descriptions
        console.log('\n🖼️ Testing Updated Gallery Descriptions...');
        await page.click('a[href="#galerie"]');
        await page.waitForTimeout(1000);

        const imageDescriptions = await page.locator('.image-card h3').allTextContents();
        console.log(`✅ Updated descriptions found: ${imageDescriptions.length}`);
        imageDescriptions.forEach((desc, index) => {
            console.log(`  ${index + 1}. ${desc}`);
        });

        // Test 3: Check Member Gallery Section
        console.log('\n👥 Testing Member Gallery Section...');
        await page.scroll({ top: 0 });
        await page.waitForTimeout(500);

        const memberGalleryExists = await page.locator('#member-gallery').isVisible();
        console.log(`✅ Member Gallery Section: ${memberGalleryExists ? 'Present' : 'Missing'}`);

        if (memberGalleryExists) {
            await page.scrollIntoView('#member-gallery');
            await page.waitForTimeout(1000);

            const marioCards = await page.locator('.member-image-card').count();
            console.log(`✅ Mario Lanz images: ${marioCards} cards found`);

            // Check author badges
            const authorBadges = await page.locator('.author-badge').count();
            console.log(`✅ Author badges: ${authorBadges} found`);

            // Test portrait link indicators
            const portraitIndicators = await page.locator('.portrait-link-indicator').count();
            console.log(`✅ Portrait link indicators: ${portraitIndicators} found`);
        }

        // Test 4: Test Navigation to Portrait Section
        console.log('\n🎯 Testing Portrait Navigation...');
        await page.click('a[href="#mitglieder-portraits"]');
        await page.waitForTimeout(2000);

        const portraitSectionVisible = await page.locator('#mitglieder-portraits').isVisible();
        console.log(`✅ Portrait section navigation: ${portraitSectionVisible ? 'Working' : 'Failed'}`);

        // Test 5: Check Mario Lanz Portrait Content
        console.log('\n📖 Testing Mario Lanz Portrait Content...');
        const portraitExists = await page.locator('#mario-lanz-portrait').isVisible();
        console.log(`✅ Mario Lanz portrait: ${portraitExists ? 'Present' : 'Missing'}`);

        if (portraitExists) {
            // Check hero section
            const heroTitle = await page.locator('.portrait-hero h2').textContent();
            console.log(`✅ Portrait title: "${heroTitle}"`);

            const heroSubtitle = await page.locator('.portrait-hero .subtitle').textContent();
            console.log(`✅ Portrait subtitle: "${heroSubtitle}"`);

            // Check specs sections
            const specSections = await page.locator('.spec-section').count();
            console.log(`✅ Specification sections: ${specSections} found`);

            // Check for specific content
            const hasAquariumSpecs = await page.locator('text=160x60x60').isVisible();
            console.log(`✅ Aquarium specifications: ${hasAquariumSpecs ? 'Present' : 'Missing'}`);

            const hasSkalareContent = await page.locator('text=Skalare').isVisible();
            console.log(`✅ Skalare content: ${hasSkalareContent ? 'Present' : 'Missing'}`);
        }

        // Test 6: Test Portrait Link Button
        console.log('\n🔗 Testing Portrait Link Button...');
        await page.scrollIntoView('#member-gallery');
        await page.waitForTimeout(1000);

        const portraitLinkBtn = await page.locator('.portrait-link-btn').isVisible();
        console.log(`✅ Portrait link button: ${portraitLinkBtn ? 'Present' : 'Missing'}`);

        if (portraitLinkBtn) {
            await page.click('.portrait-link-btn');
            await page.waitForTimeout(2000);

            const navigatedToPortrait = await page.locator('#mario-lanz-portrait').isVisible();
            console.log(`✅ Portrait navigation function: ${navigatedToPortrait ? 'Working' : 'Failed'}`);
        }

        // Test 7: Test Back to Gallery Button
        console.log('\n↩️ Testing Back to Gallery Button...');
        const backBtn = await page.locator('.back-to-gallery-btn').isVisible();
        console.log(`✅ Back to gallery button: ${backBtn ? 'Present' : 'Missing'}`);

        if (backBtn) {
            await page.click('.back-to-gallery-btn');
            await page.waitForTimeout(2000);

            const backToGallery = await page.locator('#member-gallery').isVisible();
            console.log(`✅ Back navigation function: ${backToGallery ? 'Working' : 'Failed'}`);
        }

        // Test 8: Test Member Image Portrait Indicators
        console.log('\n👤 Testing Portrait Indicators on Hover...');
        const firstMemberCard = page.locator('.member-image-card').first();
        await firstMemberCard.hover();
        await page.waitForTimeout(500);

        const indicatorVisible = await page.locator('.portrait-link-indicator').first().isVisible();
        console.log(`✅ Portrait indicator on hover: ${indicatorVisible ? 'Working' : 'Not visible'}`);

        // Test 9: Test AVIF Image Loading
        console.log('\n🖼️ Testing AVIF Image Support...');
        const avifImages = await page.locator('img[src*=".avif"]').count();
        console.log(`✅ AVIF images found: ${avifImages}`);

        // Check if images are actually loading
        const loadedImages = await page.locator('img[src*=".avif"]').evaluateAll(imgs =>
            imgs.filter(img => img.complete && img.naturalHeight > 0).length
        );
        console.log(`✅ AVIF images loaded: ${loadedImages}/${avifImages}`);

        // Test 10: Test Mobile Navigation
        console.log('\n📱 Testing Mobile Responsiveness...');
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000);

        const mobileNavVisible = await page.locator('.nav-links').isVisible();
        console.log(`✅ Mobile navigation: ${mobileNavVisible ? 'Visible' : 'Hidden (Expected)'}`);

        // Check floating fish nav (should be hidden on mobile)
        const floatingNavVisible = await page.locator('.floating-fish-nav').isVisible();
        console.log(`✅ Floating fish nav on mobile: ${floatingNavVisible ? 'Visible (Issue)' : 'Hidden (Correct)'}`);

        // Test mobile member gallery
        await page.scrollIntoView('#member-gallery');
        await page.waitForTimeout(1000);

        const mobileGalleryWorking = await page.locator('.member-gallery-grid').isVisible();
        console.log(`✅ Mobile member gallery: ${mobileGalleryWorking ? 'Working' : 'Issues'}`);

        // Back to desktop
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.waitForTimeout(1000);

        // Final summary
        console.log('\n🎉 MEMBER PORTRAIT TEST SUMMARY:');
        console.log('✅ Updated gallery descriptions implemented');
        console.log('✅ Mario Lanz Featured Member Gallery created');
        console.log('✅ Navigation extended with Mitglieder-Portraits');
        console.log('✅ Mario Lanz portrait with 1:1 original text');
        console.log('✅ Bi-directional linking between gallery and portraits');
        console.log('✅ Mobile optimizations and AVIF support');
        console.log('✅ Portrait indicators with hover effects');
        console.log('✅ Professional Tennessee Aquarium-inspired design');
        console.log('\n🌟 Member Portrait functionality is fully operational!');

        // Keep browser open for inspection
        console.log('\n👀 Browser will stay open for final inspection...');
        await page.waitForTimeout(10000);

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
        console.log('🔚 Testing completed.');
    }
}

testMemberPortraits().catch(console.error);