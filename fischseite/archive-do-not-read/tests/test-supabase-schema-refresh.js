// 🔍 Supabase Schema Cache Refresh Test
// Sometimes Supabase needs time to refresh the schema cache after creating new tables

const https = require('https');

const SUPABASE_URL = 'https://gnhsauvbqrxywtgppetm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNhdXZicXJ4eXd0Z3BwZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Njc0MjcsImV4cCI6MjA3NDI0MzQyN30.DHPTMZR6NOT7mDvCOI_1fzx87dhX9syBFek_cKkOaSc';

function makeRequest(path, method = 'GET') {
    return new Promise((resolve, reject) => {
        const url = `${SUPABASE_URL}/rest/v1${path}`;
        const headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
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
        req.end();
    });
}

async function testSchemaRefresh() {
    console.log('🔍 SUPABASE SCHEMA CACHE REFRESH TEST\n');

    const attempts = 5;
    const delay = 3000; // 3 seconds between attempts

    for (let i = 1; i <= attempts; i++) {
        console.log(`📊 Attempt ${i}/${attempts}: Testing highscores table...`);

        try {
            // Try different endpoints to see what works
            const testEndpoints = [
                '/highscores?select=count',
                '/highscores?limit=1',
                '/highscores?select=*&limit=1'
            ];

            for (const endpoint of testEndpoints) {
                const response = await makeRequest(endpoint);
                console.log(`   🔗 ${endpoint}: Status ${response.status}`);

                if (response.success) {
                    console.log('   ✅ SUCCESS! Table is accessible');
                    console.log('   📄 Response:', response.data);
                    return true;
                }

                if (response.status !== 404) {
                    console.log('   📄 Non-404 response:', response.data);
                }
            }

            if (i < attempts) {
                console.log(`   ⏳ Waiting ${delay/1000}s for schema cache refresh...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }

        } catch (error) {
            console.log(`   ❌ Request failed: ${error.message}`);
        }
    }

    console.log('\n🤔 DIAGNOSTIC: Schema cache might need manual refresh');
    console.log('💡 Possible solutions:');
    console.log('   1. Wait 5-10 more minutes for automatic refresh');
    console.log('   2. Restart Supabase project (pause/unpause)');
    console.log('   3. Check SQL Editor for any error messages');
    console.log('   4. Verify table was created in correct schema (public)');

    return false;
}

// Test what tables ARE available
async function listAvailableTables() {
    console.log('\n📋 TESTING AVAILABLE ENDPOINTS:\n');

    const knownEndpoints = [
        '/guestbook?limit=1',
        '/guestbook_stats',
        '/public_guestbook?limit=1',
        '/highscore_stats',
        '/top_highscores?limit=1',
        '/perfect_scores?limit=1'
    ];

    for (const endpoint of knownEndpoints) {
        try {
            const response = await makeRequest(endpoint);
            const status = response.success ? '✅' : '❌';
            console.log(`${status} ${endpoint}: ${response.status}`);

            if (response.success && response.data) {
                console.log(`   📄 Sample data available: ${JSON.stringify(response.data).substring(0, 100)}...`);
            }
        } catch (error) {
            console.log(`❌ ${endpoint}: ${error.message}`);
        }
    }
}

async function runFullDiagnostic() {
    await testSchemaRefresh();
    await listAvailableTables();

    console.log('\n🎯 SUMMARY:');
    console.log('If highscores table is still not accessible:');
    console.log('1. 🔄 SQL might have failed silently - check SQL Editor logs');
    console.log('2. ⏳ Schema cache needs more time (try again in 10 minutes)');
    console.log('3. 🔧 Table might be created in wrong schema');
    console.log('4. 🔑 Permissions might need adjustment');
}

runFullDiagnostic().catch(console.error);