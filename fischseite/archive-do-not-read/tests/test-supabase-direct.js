// 🧪 Direkte Supabase Connection Test mit node-fetch
// Test ohne Browser-Environment

const https = require('https');
const http = require('http');

class DirectSupabaseTest {
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

            const options = {
                method,
                headers,
            };

            const req = https.request(url, options, (res) => {
                let responseData = '';

                res.on('data', (chunk) => {
                    responseData += chunk;
                });

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

            req.on('error', (error) => {
                reject(error);
            });

            if (data && method !== 'GET') {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }

    async testConnection() {
        console.log('🔍 Testing Supabase connection...');

        try {
            const response = await this.makeRequest('/highscores?select=count&limit=1');

            if (response.success) {
                console.log('✅ Connection successful!');
                console.log('📊 Response status:', response.status);
                return true;
            } else {
                console.log('❌ Connection failed');
                console.log('📊 Status:', response.status);
                console.log('📄 Response:', response.data);
                return false;
            }
        } catch (error) {
            console.log('❌ Connection error:', error.message);
            return false;
        }
    }

    async testHighscoreRead() {
        console.log('\n🎮 Testing Highscore Read...');

        try {
            const response = await this.makeRequest('/highscores?select=*&limit=5');

            if (response.success) {
                console.log('✅ Highscore read successful!');
                console.log('📊 Found records:', Array.isArray(response.data) ? response.data.length : 'N/A');
                if (Array.isArray(response.data) && response.data.length > 0) {
                    console.log('🏆 Sample record:', response.data[0]);
                }
                return true;
            } else {
                console.log('❌ Highscore read failed');
                console.log('📊 Status:', response.status);
                console.log('📄 Error:', response.data);
                return false;
            }
        } catch (error) {
            console.log('❌ Highscore read error:', error.message);
            return false;
        }
    }

    async testHighscoreInsert() {
        console.log('\n➕ Testing Highscore Insert...');

        const testData = {
            player_name: 'TestUser_' + Date.now(),
            score: 175,
            collected_items: 16,
            game_time: 52,
            ip_address: '127.0.0.1'
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

    async testGuestbookRead() {
        console.log('\n💬 Testing Guestbook Read...');

        try {
            const response = await this.makeRequest('/guestbook?select=*&limit=5');

            if (response.success) {
                console.log('✅ Guestbook read successful!');
                console.log('📊 Found records:', Array.isArray(response.data) ? response.data.length : 'N/A');
                if (Array.isArray(response.data) && response.data.length > 0) {
                    console.log('💌 Sample record:', response.data[0]);
                }
                return true;
            } else {
                console.log('❌ Guestbook read failed');
                console.log('📊 Status:', response.status);
                console.log('📄 Error:', response.data);

                // If table doesn't exist, that's expected
                if (response.status === 404 || (response.data && response.data.message && response.data.message.includes('relation "public.guestbook" does not exist'))) {
                    console.log('ℹ️ Guestbook table not found - needs to be created with SUPABASE_SETUP.sql');
                    return false;
                }
                return false;
            }
        } catch (error) {
            console.log('❌ Guestbook read error:', error.message);
            return false;
        }
    }

    async testGuestbookInsert() {
        console.log('\n➕ Testing Guestbook Insert...');

        const testData = {
            name: 'TestVisitor_' + Date.now(),
            message: 'Test message from direct connection test!',
            ip_address: '127.0.0.1'
        };

        try {
            const response = await this.makeRequest('/guestbook', 'POST', testData);

            if (response.success) {
                console.log('✅ Guestbook insert successful!');
                console.log('📊 Inserted record:', response.data);
                return true;
            } else {
                console.log('❌ Guestbook insert failed');
                console.log('📊 Status:', response.status);
                console.log('📄 Error:', response.data);
                return false;
            }
        } catch (error) {
            console.log('❌ Guestbook insert error:', error.message);
            return false;
        }
    }

    async runAllTests() {
        console.log('🧪 SUPABASE DIRECT CONNECTION TEST SUITE\n');
        console.log('🔗 URL:', this.supabaseUrl);
        console.log('🔑 Key: ***...***\n');

        const results = {
            connection: await this.testConnection(),
            highscoreRead: await this.testHighscoreRead(),
            highscoreInsert: await this.testHighscoreInsert(),
            guestbookRead: await this.testGuestbookRead(),
            guestbookInsert: false // Will test only if read works
        };

        // Only test guestbook insert if read worked
        if (results.guestbookRead) {
            results.guestbookInsert = await this.testGuestbookInsert();
        }

        console.log('\n📊 TEST RESULTS SUMMARY:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔗 Connection:', results.connection ? '✅ PASS' : '❌ FAIL');
        console.log('📖 Highscore Read:', results.highscoreRead ? '✅ PASS' : '❌ FAIL');
        console.log('➕ Highscore Insert:', results.highscoreInsert ? '✅ PASS' : '❌ FAIL');
        console.log('📖 Guestbook Read:', results.guestbookRead ? '✅ PASS' : '❌ FAIL');
        console.log('➕ Guestbook Insert:', results.guestbookInsert ? '✅ PASS' : '❌ FAIL');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const totalTests = Object.keys(results).length;
        const passedTests = Object.values(results).filter(r => r === true).length;

        console.log(`🎯 OVERALL: ${passedTests}/${totalTests} tests passed`);

        if (passedTests === totalTests) {
            console.log('🎉 ALL TESTS PASSED! Supabase integration is working perfectly!');
        } else if (results.connection && results.highscoreRead && results.highscoreInsert) {
            console.log('✅ Core functionality working! Guestbook needs SUPABASE_SETUP.sql execution.');
        } else {
            console.log('⚠️ Some critical tests failed. Check Supabase configuration.');
        }

        return passedTests === totalTests;
    }
}

// Run the test
const tester = new DirectSupabaseTest();
tester.runAllTests().then((success) => {
    process.exit(success ? 0 : 1);
}).catch((error) => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
});