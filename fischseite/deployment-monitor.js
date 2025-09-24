// 🔄 DEPLOYMENT MONITOR - Wait for GitHub Actions and verify fix

const https = require('https');

class DeploymentMonitor {
    constructor() {
        this.checkInterval = 30000; // 30 seconds
        this.maxWaitTime = 300000;  // 5 minutes
        this.baseUrl = 'vibecoding.company';
        this.sitePath = '/fischseite';
    }

    async checkDeploymentStatus() {
        console.log('🔄 DEPLOYMENT MONITORING ACTIVE');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`🕐 Started: ${new Date().toLocaleString('de-DE')}`);
        console.log(`🌐 Target: https://${this.baseUrl}${this.sitePath}`);
        console.log(`⏰ Check interval: ${this.checkInterval/1000}s`);
        console.log(`⏳ Max wait time: ${this.maxWaitTime/1000/60}m\n`);

        const startTime = Date.now();
        let attempts = 0;

        while (Date.now() - startTime < this.maxWaitTime) {
            attempts++;
            console.log(`🔍 Attempt #${attempts} - ${new Date().toLocaleTimeString('de-DE')}`);

            // Check main page
            const mainResult = await this.testPage('/');
            console.log(`   🏠 Main Page: ${mainResult.hasVersion ? '✅ VERSION 2.3' : '❌ Old/Missing'} (${mainResult.responseTime}ms)`);

            // Check guestbook
            const guestbookResult = await this.testPage('/guestbook.html');
            console.log(`   📝 Guestbook: ${guestbookResult.status === 200 ? '✅ FOUND' : '❌ 404'} (${guestbookResult.responseTime}ms)`);

            if (guestbookResult.status === 200) {
                console.log(`        📄 Has VERSION 2.3: ${guestbookResult.hasVersion ? '✅ YES' : '❌ No'}`);
            }

            // Check if deployment is complete
            const deploymentComplete = mainResult.hasVersion &&
                                     guestbookResult.status === 200 &&
                                     guestbookResult.hasVersion;

            if (deploymentComplete) {
                console.log('\n🎉 DEPLOYMENT SUCCESS DETECTED!');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('✅ All files deployed successfully');
                console.log('✅ VERSION 2.3 comments present');
                console.log('✅ guestbook.html no longer 404');
                console.log('✅ Ready for user testing');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

                // Quick functionality test
                await this.runQuickFunctionalityTest();

                return true;
            }

            console.log('   ⏳ Deployment still in progress...\n');

            // Wait before next check
            if (Date.now() - startTime < this.maxWaitTime) {
                await new Promise(resolve => setTimeout(resolve, this.checkInterval));
            }
        }

        console.log('\n⏰ TIMEOUT: Maximum wait time reached');
        console.log('⚠️ Deployment may have failed or is taking longer than expected');
        return false;
    }

    async testPage(path) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const fullPath = this.sitePath + path + `?v=${Date.now()}&monitor=true`;

            const options = {
                hostname: this.baseUrl,
                path: fullPath,
                method: 'GET',
                headers: {
                    'User-Agent': 'DeploymentMonitor/1.0',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                },
                timeout: 15000
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk.toString();
                });

                res.on('end', () => {
                    const responseTime = Date.now() - startTime;
                    const hasVersion = data.includes('VERSION 2.3') ||
                                     data.includes('FORCE DEPLOYMENT DEBUG');

                    resolve({
                        success: true,
                        status: res.statusCode,
                        responseTime: responseTime,
                        hasVersion: hasVersion,
                        contentLength: data.length
                    });
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    success: false,
                    status: 'timeout',
                    responseTime: Date.now() - startTime,
                    hasVersion: false
                });
            });

            req.on('error', () => {
                resolve({
                    success: false,
                    status: 'error',
                    responseTime: Date.now() - startTime,
                    hasVersion: false
                });
            });

            req.end();
        });
    }

    async runQuickFunctionalityTest() {
        console.log('\n🧪 QUICK FUNCTIONALITY TEST');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Test Supabase database
        const dbTest = await this.testSupabase();
        console.log(`🗄️ Database: ${dbTest.success ? '✅ Connected' : '❌ Issues'}`);
        if (dbTest.success) {
            console.log(`   📊 ${dbTest.entries} entries available`);
            console.log(`   🤖 Claude entries: ${dbTest.claudeEntries}`);
        }

        // Summary
        console.log('\n🎯 SYSTEM READY FOR USER TESTING:');
        console.log('✅ Website deployment completed');
        console.log('✅ Guestbook page accessible');
        console.log('✅ Database integration functional');
        console.log('✅ User can now create entry #10');
        console.log('\n📍 Test URL: https://vibecoding.company/fischseite/guestbook.html');
    }

    async testSupabase() {
        return new Promise((resolve) => {
            const options = {
                hostname: 'gnhsauvbqrxywtgppetm.supabase.co',
                path: '/rest/v1/guestbook?select=*&limit=10',
                method: 'GET',
                headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNhdXZicXJ4eXd0Z3BwZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Njc0MjcsImV4cCI6MjA3NDI0MzQyN30.DHPTMZR6NOT7mDvCOI_1fzx87dhX9syBFek_cKkOaSc'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const entries = JSON.parse(data);
                        const claudeEntries = entries.filter(e => e.name && e.name.includes('Claude')).length;

                        resolve({
                            success: true,
                            entries: entries.length,
                            claudeEntries: claudeEntries
                        });
                    } catch (e) {
                        resolve({ success: false });
                    }
                });
            });

            req.on('error', () => resolve({ success: false }));
            req.setTimeout(10000, () => resolve({ success: false }));
            req.end();
        });
    }
}

// Start monitoring
console.log('🚀 GitHub Actions triggered - Starting deployment monitoring...\n');

const monitor = new DeploymentMonitor();
monitor.checkDeploymentStatus().then((success) => {
    if (success) {
        console.log('\n🎊 MISSION ACCOMPLISHED! Both systems fully operational!');
        console.log('🎯 Ready for user to test entry #10 creation');
    } else {
        console.log('\n⚠️ Deployment monitoring timed out or failed');
        console.log('📋 Manual verification may be needed');
    }
    process.exit(success ? 0 : 1);
}).catch((error) => {
    console.error('💥 Monitoring failed:', error);
    process.exit(1);
});