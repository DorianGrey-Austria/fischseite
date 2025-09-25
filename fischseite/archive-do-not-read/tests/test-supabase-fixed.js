// 🧪 Fixed Supabase Test (ohne ip_address Feld)
const https = require('https');

class FixedSupabaseTest {
    constructor() {
        this.supabaseUrl = 'https://gnhsauvbqrxywtgppetm.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNhdXZicXJ4eXd0Z3BwZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Njc0MjcsImV4cCI6MjA3NDI0MzQyN30.DHPTMZR6NOT7mDvCOI_1fzx87dhX9syBFek_cKkOaSc';
    }

    makeRequest(path, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const url = `${this.supabaseUrl}/rest/v1${path}`;
            const headers = {
                'apikey': this.supabaseKey,
                'Authorization': `Bearer ${this.supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            };

            const options = { method, headers };

            const req = https.request(url, options, (res) => {
                let responseData = '';
                res.on('data', (chunk) => { responseData += chunk; });
                res.on('end', () => {
                    try {
                        const parsed = responseData ? JSON.parse(responseData) : {};
                        resolve({
                            status: res.statusCode,
                            data: parsed,
                            success: res.statusCode >= 200 && res.statusCode < 300
                        });
                    } catch (e) {
                        resolve({
                            status: res.statusCode,
                            data: responseData,
                            success: res.statusCode >= 200 && res.statusCode < 300
                        });
                    }
                });
            });

            req.on('error', reject);
            if (data && method !== 'GET') {
                req.write(JSON.stringify(data));
            }
            req.end();
        });
    }

    async testHighscoreInsert() {
        console.log('\n➕ Testing Fixed Highscore Insert...');

        // Ohne ip_address Feld!
        const testData = {
            player_name: 'TestPlayer_' + Date.now(),
            score: 275,
            collected_items: 18,
            game_time: 48,
            bonus_points: 25
        };

        try {
            const response = await this.makeRequest('/highscores', 'POST', testData);

            if (response.success) {
                console.log('✅ Highscore insert successful!');
                console.log('📊 Inserted record:', response.data);
                return true;
            } else {
                console.log('❌ Highscore insert failed');
                console.log('📊 Status:', response.status);
                console.log('📄 Error:', response.data);
                return false;
            }
        } catch (error) {
            console.log('❌ Highscore insert error:', error.message);
            return false;
        }
    }

    async testHighscoreViews() {
        console.log('\n📊 Testing Highscore Views...');

        const views = [
            { name: 'top_highscores', path: '/top_highscores?limit=3' },
            { name: 'perfect_scores', path: '/perfect_scores?limit=3' },
            { name: 'highscore_stats', path: '/highscore_stats' }
        ];

        let allWorking = true;

        for (const view of views) {
            try {
                const response = await this.makeRequest(view.path);
                const status = response.success ? '✅' : '❌';
                console.log(`${status} ${view.name}: ${response.status}`);

                if (response.success && response.data) {
                    if (Array.isArray(response.data)) {
                        console.log(`   📊 Found ${response.data.length} records`);
                        if (response.data[0]) {
                            console.log(`   🏆 Top entry: ${JSON.stringify(response.data[0]).substring(0, 80)}...`);
                        }
                    } else {
                        console.log(`   📈 Stats: ${JSON.stringify(response.data).substring(0, 80)}...`);
                    }
                } else {
                    allWorking = false;
                }
            } catch (error) {
                console.log(`❌ ${view.name}: ${error.message}`);
                allWorking = false;
            }
        }

        return allWorking;
    }

    async runComprehensiveTest() {
        console.log('🎉 COMPLETE SUPABASE FUNCTIONALITY TEST\n');
        console.log('🔗 URL:', this.supabaseUrl);
        console.log('✨ Testing SIMPLE version without IP conflicts\n');

        // Test 1: Basic connection
        const connectionResponse = await this.makeRequest('/highscores?limit=1');
        const connection = connectionResponse.success;
        console.log('🔗 Connection:', connection ? '✅ PASS' : '❌ FAIL');

        // Test 2: Read highscores
        const readResponse = await this.makeRequest('/highscores?limit=5');
        const canRead = readResponse.success;
        console.log('📖 Highscore Read:', canRead ? '✅ PASS' : '❌ FAIL');
        if (canRead) {
            console.log(`   📊 Found ${readResponse.data.length} existing records`);
        }

        // Test 3: Insert new highscore (fixed)
        const canInsert = await this.testHighscoreInsert();

        // Test 4: Test views
        const viewsWorking = await this.testHighscoreViews();

        // Test 5: Guestbook (should still work)
        const guestbookResponse = await this.makeRequest('/guestbook?limit=1');
        const guestbookWorking = guestbookResponse.success;
        console.log('\n💬 Guestbook:', guestbookWorking ? '✅ PASS' : '❌ FAIL');

        console.log('\n🎯 FINAL COMPREHENSIVE TEST RESULTS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Connection:', connection ? 'PASS' : 'FAIL');
        console.log('✅ Highscore Read:', canRead ? 'PASS' : 'FAIL');
        console.log('✅ Highscore Insert:', canInsert ? 'PASS' : 'FAIL');
        console.log('✅ Views Working:', viewsWorking ? 'PASS' : 'FAIL');
        console.log('✅ Guestbook:', guestbookWorking ? 'PASS' : 'FAIL');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const totalTests = 5;
        const passedTests = [connection, canRead, canInsert, viewsWorking, guestbookWorking].filter(Boolean).length;

        console.log(`🏆 OVERALL RESULT: ${passedTests}/${totalTests} tests passed`);

        if (passedTests === totalTests) {
            console.log('\n🎉🎉🎉 PERFECT! ALL TESTS PASSED! 🎉🎉🎉');
            console.log('✅ Supabase integration is FULLY FUNCTIONAL!');
            console.log('🎮 Highscore system ready for production!');
            console.log('💬 Guestbook working perfectly!');
        } else if (passedTests >= 4) {
            console.log('\n🎊 EXCELLENT! Almost perfect - minor issues only');
            console.log(`✅ ${passedTests} out of ${totalTests} systems working`);
        } else {
            console.log('\n⚠️ Some critical issues need attention');
        }

        return passedTests === totalTests;
    }
}

// Run the comprehensive test
const tester = new FixedSupabaseTest();
tester.runComprehensiveTest().then((success) => {
    process.exit(success ? 0 : 1);
}).catch((error) => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
});