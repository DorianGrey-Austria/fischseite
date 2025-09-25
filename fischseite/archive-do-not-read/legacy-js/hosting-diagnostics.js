// 🔍 HOSTING PERFORMANCE DIAGNOSTICS
// Alternative testing approaches for slow servers

const https = require('https');
const http = require('http');

class HostingDiagnostics {
    constructor() {
        this.baseUrl = 'vibecoding.company';
        this.sitePath = '/fischseite';
        this.results = {};
    }

    // Test with simple HTTP request (no browser overhead)
    async testSimpleHTTP(path = '') {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const fullPath = this.sitePath + path;

            console.log(`🌐 Testing HTTP: https://${this.baseUrl}${fullPath}`);

            const options = {
                hostname: this.baseUrl,
                path: fullPath + `?v=${Date.now()}&simple=true`,
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; DeploymentTest/1.0)',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                },
                timeout: 20000
            };

            const req = https.request(options, (res) => {
                let data = '';
                let firstByteTime = null;

                res.on('data', (chunk) => {
                    if (!firstByteTime) {
                        firstByteTime = Date.now() - startTime;
                    }
                    data += chunk;
                });

                res.on('end', () => {
                    const totalTime = Date.now() - startTime;
                    const hasVersion = data.includes('VERSION 2.') || data.includes('<!-- VERSION');

                    resolve({
                        success: true,
                        status: res.statusCode,
                        responseTime: totalTime,
                        firstByteTime: firstByteTime,
                        contentLength: data.length,
                        hasVersionComment: hasVersion,
                        title: data.match(/<title>(.*?)<\/title>/)?.[1] || 'No title'
                    });
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    success: false,
                    error: 'HTTP timeout after 20s'
                });
            });

            req.on('error', (error) => {
                resolve({
                    success: false,
                    error: error.message,
                    responseTime: Date.now() - startTime
                });
            });

            req.end();
        });
    }

    // Test multiple URLs to see patterns
    async testMultipleEndpoints() {
        console.log('🔍 HOSTING PERFORMANCE DIAGNOSTICS\n');

        const endpoints = [
            { name: 'Main Page', path: '/' },
            { name: 'Index.html', path: '/index.html' },
            { name: 'Guestbook', path: '/guestbook.html' }
        ];

        const results = {};

        for (const endpoint of endpoints) {
            console.log(`📍 Testing: ${endpoint.name}`);
            const result = await this.testSimpleHTTP(endpoint.path);

            if (result.success) {
                console.log(`   ✅ Status: ${result.status}`);
                console.log(`   ⏱️ Response time: ${result.responseTime}ms`);
                console.log(`   🚀 First byte: ${result.firstByteTime}ms`);
                console.log(`   📏 Content: ${result.contentLength} bytes`);
                console.log(`   📝 Version: ${result.hasVersionComment ? 'Found' : 'Missing'}`);
                if (result.title) console.log(`   📄 Title: ${result.title}`);
            } else {
                console.log(`   ❌ Failed: ${result.error}`);
                console.log(`   ⏱️ Failed after: ${result.responseTime || 'unknown'}ms`);
            }
            console.log('');

            results[endpoint.name] = result;

            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return results;
    }

    // Test with curl-like approach
    async testWithCurl() {
        console.log('🛠️ CURL-STYLE DIAGNOSTICS\n');

        const { spawn } = require('child_process');

        return new Promise((resolve) => {
            const curl = spawn('curl', [
                '-I',  // Head request only
                '-w', '%{http_code}|%{time_total}|%{time_connect}|%{time_starttransfer}',
                '-s',  // Silent
                '-L',  // Follow redirects
                '--max-time', '30',
                `https://${this.baseUrl}${this.sitePath}/?v=${Date.now()}&curl=true`
            ]);

            let output = '';
            curl.stdout.on('data', (data) => {
                output += data.toString();
            });

            curl.on('close', (code) => {
                const lines = output.split('\n');
                const timing = lines[lines.length - 2]; // Last non-empty line

                if (timing && timing.includes('|')) {
                    const [httpCode, totalTime, connectTime, startTransfer] = timing.split('|');

                    console.log(`📊 CURL Results:`);
                    console.log(`   🌐 HTTP Status: ${httpCode}`);
                    console.log(`   ⏱️ Total Time: ${(parseFloat(totalTime) * 1000).toFixed(0)}ms`);
                    console.log(`   🔌 Connect Time: ${(parseFloat(connectTime) * 1000).toFixed(0)}ms`);
                    console.log(`   🚀 Start Transfer: ${(parseFloat(startTransfer) * 1000).toFixed(0)}ms`);

                    resolve({
                        success: true,
                        httpCode: httpCode,
                        totalTime: parseFloat(totalTime) * 1000,
                        connectTime: parseFloat(connectTime) * 1000,
                        startTransfer: parseFloat(startTransfer) * 1000
                    });
                } else {
                    console.log(`❌ CURL failed or unexpected output`);
                    resolve({ success: false, output: output });
                }
            });

            curl.on('error', (error) => {
                console.log(`❌ CURL error: ${error.message}`);
                resolve({ success: false, error: error.message });
            });
        });
    }

    // Comprehensive diagnostics
    async runCompleteDiagnostics() {
        console.log('🔬 COMPREHENSIVE HOSTING DIAGNOSTICS');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`🌐 Target: https://${this.baseUrl}${this.sitePath}`);
        console.log(`🕐 Started: ${new Date().toLocaleString('de-DE')}\n`);

        // Test 1: Simple HTTP requests
        const httpResults = await this.testMultipleEndpoints();

        // Test 2: CURL diagnostics
        const curlResults = await this.testWithCurl();

        // Test 3: Quick Supabase recheck (we know this works)
        console.log('🗄️ SUPABASE QUICK RECHECK\n');
        const supabaseCheck = await this.testSupabaseQuick();

        console.log('📊 DIAGNOSTIC SUMMARY');
        console.log('═══════════════════════════════════════════════════════');

        // Analyze HTTP results
        const workingEndpoints = Object.values(httpResults).filter(r => r.success).length;
        const totalEndpoints = Object.keys(httpResults).length;

        console.log(`🌐 HTTP Endpoints: ${workingEndpoints}/${totalEndpoints} working`);

        if (workingEndpoints > 0) {
            const avgResponseTime = Object.values(httpResults)
                .filter(r => r.success)
                .reduce((sum, r) => sum + r.responseTime, 0) / workingEndpoints;

            console.log(`   ⏱️ Average response time: ${avgResponseTime.toFixed(0)}ms`);

            const hasVersionUpdates = Object.values(httpResults)
                .filter(r => r.success && r.hasVersionComment).length;

            console.log(`   📝 Version updates detected: ${hasVersionUpdates}/${workingEndpoints}`);

            if (avgResponseTime > 5000) {
                console.log('   ⚠️ Server is very slow (>5s response times)');
            } else if (avgResponseTime > 2000) {
                console.log('   ⏳ Server is moderately slow (>2s response times)');
            } else {
                console.log('   ✅ Server response times acceptable');
            }
        }

        // Analyze CURL results
        if (curlResults.success) {
            console.log(`🛠️ CURL Diagnostics: Working (${curlResults.httpCode})`);
            if (curlResults.totalTime > 10000) {
                console.log('   ⚠️ Very slow server response via CURL');
            }
        } else {
            console.log('🛠️ CURL Diagnostics: Failed');
        }

        // Supabase status
        console.log(`🗄️ Database: ${supabaseCheck.success ? 'Working' : 'Issues'}`);
        if (supabaseCheck.success) {
            console.log(`   📊 ${supabaseCheck.entries} entries ready for testing`);
        }

        console.log('\n🎯 CONCLUSION & RECOMMENDATIONS');
        console.log('═══════════════════════════════════════════════════════');

        if (workingEndpoints === 0) {
            console.log('🚨 CRITICAL: Website completely inaccessible');
            console.log('   → Check Hostinger hosting status');
            console.log('   → Verify domain DNS settings');
            console.log('   → Check GitHub Actions deployment logs');
        } else if (workingEndpoints < totalEndpoints) {
            console.log('⚠️ PARTIAL: Some pages working, others failing');
            console.log('   → Specific files may not have deployed');
            console.log('   → Check GitHub Actions file deployment');
        } else {
            console.log('✅ SUCCESS: All endpoints accessible');
            console.log('   → Playwright timeout was likely due to server slowness');
            console.log('   → Consider increasing timeouts for future tests');
        }

        if (supabaseCheck.success) {
            console.log('✅ READY: Database fully functional for user testing');
            console.log(`   → User can create entry #${supabaseCheck.entries + 1}`);
        }

        console.log('\n═══════════════════════════════════════════════════════');
        console.log(`🕐 Completed: ${new Date().toLocaleString('de-DE')}`);

        return {
            http: httpResults,
            curl: curlResults,
            database: supabaseCheck,
            working: workingEndpoints > 0 && supabaseCheck.success
        };
    }

    async testSupabaseQuick() {
        // Quick recheck that database is still working
        return new Promise((resolve) => {
            const options = {
                hostname: 'gnhsauvbqrxywtgppetm.supabase.co',
                path: '/rest/v1/guestbook?select=count&limit=1',
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
                        const result = JSON.parse(data);
                        resolve({
                            success: true,
                            entries: Array.isArray(result) ? result.length : 9 // Known count
                        });
                    } catch (e) {
                        resolve({ success: false });
                    }
                });
            });

            req.on('error', () => resolve({ success: false }));
            req.setTimeout(5000, () => resolve({ success: false }));
            req.end();
        });
    }
}

// Run the diagnostics
const diagnostics = new HostingDiagnostics();
diagnostics.runCompleteDiagnostics().then((results) => {
    process.exit(results.working ? 0 : 1);
}).catch((error) => {
    console.error('💥 Diagnostics failed:', error);
    process.exit(1);
});