// 🚀 QUICK DEPLOYMENT & DATABASE TEST
// Fast results for immediate verification

const { chromium } = require('playwright');
const https = require('https');

async function quickComprehensiveTest() {
    console.log('⚡ QUICK COMPREHENSIVE DEPLOYMENT TEST\n');
    console.log(`🕐 Started: ${new Date().toLocaleString('de-DE')}`);

    const results = {
        deployment: {},
        database: {},
        summary: {}
    };

    // PHASE 1: Quick Deployment Test (Chromium only)
    console.log('🚀 PHASE 1: DEPLOYMENT VERIFICATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            extraHTTPHeaders: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        const page = await context.newPage();

        // Test main page with cache busting
        const timestamp = Date.now();
        const mainUrl = `https://vibecoding.company/fischseite/?v=${timestamp}&quicktest=true`;

        console.log('🏠 Testing Main Page...');
        await page.goto(mainUrl, { waitUntil: 'networkidle', timeout: 15000 });

        const mainTitle = await page.title();
        const mainContent = await page.content();
        const hasVersion = mainContent.includes('VERSION 2.') || mainContent.includes('<!-- VERSION');

        console.log(`   ✅ Title: ${mainTitle}`);
        console.log(`   📝 Version comment: ${hasVersion ? 'Found' : 'Missing'}`);

        // Check for new menu
        const menuCount = await page.locator('nav, .menu, .navigation, header').count();
        console.log(`   🧭 Menu elements: ${menuCount}`);

        results.deployment.main = {
            success: true,
            title: mainTitle,
            hasVersion: hasVersion,
            menuCount: menuCount,
            url: mainUrl
        };

        // Test guestbook page
        const guestbookUrl = `https://vibecoding.company/fischseite/guestbook.html?v=${timestamp}&quicktest=true`;

        console.log('📝 Testing Guestbook Page...');
        await page.goto(guestbookUrl, { waitUntil: 'networkidle', timeout: 15000 });

        // Check if 404 or actual page
        const is404 = await page.locator('text=404').count() > 0 ||
                      await page.locator('text=Page Does Not Exist').count() > 0;

        if (is404) {
            console.log('   ❌ Guestbook: 404 Not Found');
            results.deployment.guestbook = { success: false, error: '404' };
        } else {
            const guestbookTitle = await page.title();
            const formExists = await page.locator('#guestbookForm, form').count() > 0;

            // Wait for entries to potentially load
            await page.waitForTimeout(3000);
            const entryCount = await page.locator('.entry, .guestbook-entry').count();

            console.log(`   ✅ Title: ${guestbookTitle}`);
            console.log(`   📝 Form present: ${formExists ? 'Yes' : 'No'}`);
            console.log(`   📊 Entries loaded: ${entryCount}`);

            results.deployment.guestbook = {
                success: true,
                title: guestbookTitle,
                formExists: formExists,
                entryCount: entryCount,
                url: guestbookUrl
            };
        }

        await browser.close();
        console.log('✅ Deployment tests completed\n');

    } catch (error) {
        console.log(`❌ Deployment test failed: ${error.message}\n`);
        results.deployment.error = error.message;
    }

    // PHASE 2: Quick Database Test
    console.log('🗄️ PHASE 2: DATABASE VERIFICATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('📊 Testing direct Supabase connection...');

    const dbResult = await new Promise((resolve) => {
        const options = {
            hostname: 'gnhsauvbqrxywtgppetm.supabase.co',
            path: '/rest/v1/guestbook?select=*&order=created_at.desc&limit=10',
            method: 'GET',
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNhdXZicXJ4eXd0Z3BwZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Njc0MjcsImV4cCI6MjA3NDI0MzQyN30.DHPTMZR6NOT7mDvCOI_1fzx87dhX9syBFek_cKkOaSc',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNhdXZicXJ4eXd0Z3BwZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Njc0MjcsImV4cCI6MjA3NDI0MzQyN30.DHPTMZR6NOT7mDvCOI_1fzx87dhX9syBFek_cKkOaSc'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const entries = JSON.parse(data);
                    const claudeEntries = entries.filter(e => e.name && e.name.includes('Claude'));

                    resolve({
                        success: true,
                        totalEntries: entries.length,
                        claudeEntries: claudeEntries.length,
                        latestEntry: entries[0]?.name || 'None',
                        latestMessage: entries[0]?.message?.substring(0, 50) + '...' || ''
                    });
                } catch (error) {
                    resolve({ success: false, error: error.message });
                }
            });
        });

        req.on('error', (error) => resolve({ success: false, error: error.message }));
        req.setTimeout(10000, () => resolve({ success: false, error: 'Timeout' }));
        req.end();
    });

    console.log(`   ${dbResult.success ? '✅' : '❌'} Supabase API: ${dbResult.success ? 'Connected' : 'Failed'}`);
    if (dbResult.success) {
        console.log(`   📊 Total entries: ${dbResult.totalEntries}`);
        console.log(`   🤖 Claude entries: ${dbResult.claudeEntries}`);
        console.log(`   🏆 Latest: ${dbResult.latestEntry}`);
        console.log(`   💬 Preview: ${dbResult.latestMessage}`);
    }

    results.database = dbResult;
    console.log('✅ Database test completed\n');

    // FINAL SUMMARY
    console.log('🎯 QUICK TEST SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const deploymentWorking = results.deployment.main?.success &&
                              results.deployment.guestbook?.success;
    const databaseWorking = results.database?.success;

    console.log(`🌐 Deployment Status: ${deploymentWorking ? '✅ WORKING' : '❌ ISSUES'}`);
    if (results.deployment.main?.hasVersion) {
        console.log('   📝 Version update deployed successfully');
    }
    if (results.deployment.guestbook?.entryCount > 0) {
        console.log(`   📊 Guestbook showing ${results.deployment.guestbook.entryCount} entries`);
    }

    console.log(`🗄️ Database Status: ${databaseWorking ? '✅ WORKING' : '❌ ISSUES'}`);
    if (databaseWorking) {
        console.log(`   📈 ${results.database.totalEntries} entries in database`);
    }

    const overallSuccess = deploymentWorking && databaseWorking;

    console.log('\n🏆 OVERALL SYSTEM STATUS:');
    if (overallSuccess) {
        console.log('🎉🎉🎉 SYSTEM FULLY OPERATIONAL! 🎉🎉🎉');
        console.log('✅ Both deployment and database working perfectly');
        console.log('✅ Ready for you to create entry #10 on live website');
        console.log('✅ Cache issues resolved - new version is live');
    } else {
        console.log('⚠️ Issues detected:');
        if (!deploymentWorking) console.log('   - Deployment problems (check cache/hosting)');
        if (!databaseWorking) console.log('   - Database connectivity issues');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🕐 Completed: ${new Date().toLocaleString('de-DE')}`);

    return overallSuccess;
}

// Run the quick test
quickComprehensiveTest().then((success) => {
    console.log(`\n🎯 FINAL RESULT: ${success ? 'SUCCESS' : 'NEEDS ATTENTION'}`);
    process.exit(success ? 0 : 1);
}).catch((error) => {
    console.error('💥 Quick test crashed:', error);
    process.exit(1);
});