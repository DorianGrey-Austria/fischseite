// 🏆 Script to create Supabase highscores table via REST API
const https = require('https');

// Supabase Configuration (same as in test-supabase-direct.js)
const SUPABASE_URL = 'https://gnhsauvbqrxywtgppetm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNhdXZicXJ4eXd0Z3BwZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Njc0MjcsImV4cCI6MjA3NDI0MzQyN30.DHPTMZR6NOT7mDvCOI_1fzx87dhX9syBFek_cKkOaSc';

// For this to work, we need the service_role key, not anon key
// But let's try with a different approach - create a minimal table first

function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const url = `${SUPABASE_URL}/rest/v1${path}`;
        const headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
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

async function checkTableExists() {
    console.log('🔍 Checking if highscores table exists...');

    try {
        const response = await makeRequest('/highscores?limit=1');

        if (response.success) {
            console.log('✅ Table exists and is accessible!');
            console.log('📊 Response:', response.data);
            return true;
        } else {
            console.log('❌ Table does not exist or is not accessible');
            console.log('📄 Error:', response.data);
            return false;
        }
    } catch (error) {
        console.log('❌ Connection error:', error.message);
        return false;
    }
}

async function runTableCheck() {
    console.log('🏆 SUPABASE HIGHSCORES TABLE CHECKER\n');
    console.log('🔗 URL:', SUPABASE_URL);
    console.log('🔑 Using anon key (limited permissions)\n');

    const exists = await checkTableExists();

    if (exists) {
        console.log('\n🎉 SUCCESS: Highscores table is ready to use!');
        console.log('✅ No further action needed.');
    } else {
        console.log('\n⚠️ TABLE MISSING: The highscores table needs to be created.');
        console.log('📝 Next steps:');
        console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard');
        console.log('2. Open SQL Editor');
        console.log('3. Execute the HIGHSCORE_SETUP.sql file');
        console.log('4. Run this script again to verify');
    }

    return exists;
}

// Run the check
runTableCheck().then((success) => {
    process.exit(success ? 0 : 1);
}).catch((error) => {
    console.error('💥 Script crashed:', error);
    process.exit(1);
});