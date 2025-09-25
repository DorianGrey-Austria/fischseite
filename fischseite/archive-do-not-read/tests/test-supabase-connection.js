// 🐠 Supabase Connection Test - Fischseite
// Direkte Verbindung ohne MCP zur Überprüfung der Datenbankintegration

class SupabaseConnectionTester {
    constructor() {
        this.supabaseUrl = 'https://gnhsauvbqrxywtgppetm.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNhdXZicXJ4eXd0Z3BwZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Njc0MjcsImV4cCI6MjA3NDI0MzQyN30.DHPTMZR6NOT7mDvCOI_1fzx87dhX9syBFek_cKkOaSc';
        this.supabase = null;
    }

    async init() {
        try {
            // Check if we're in browser environment
            if (typeof window === 'undefined') {
                console.log('❌ Browser environment required for Supabase client');
                return false;
            }

            // Load Supabase dynamically
            if (!window.supabase) {
                await this.loadSupabaseClient();
            }

            // Create client
            this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);

            console.log('🔗 Supabase client created successfully');
            return true;
        } catch (error) {
            console.error('❌ Supabase initialization failed:', error);
            return false;
        }
    }

    async loadSupabaseClient() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = () => resolve();
            script.onerror = (error) => reject(error);
            document.head.appendChild(script);
        });
    }

    async testConnection() {
        if (!this.supabase) {
            console.log('❌ Supabase client not initialized');
            return false;
        }

        try {
            // Test basic connection
            console.log('🔍 Testing basic connection...');
            const { data, error } = await this.supabase.from('highscores').select('count').limit(1);

            if (error) {
                console.error('❌ Connection test failed:', error.message);
                return false;
            }

            console.log('✅ Basic connection successful');
            return true;
        } catch (error) {
            console.error('❌ Connection test error:', error);
            return false;
        }
    }

    async testHighscoreOperations() {
        console.log('\n🎮 Testing Highscore Operations...');

        try {
            // 1. Test Read
            console.log('📖 Testing read operations...');
            const { data: readData, error: readError } = await this.supabase
                .from('highscores')
                .select('*')
                .limit(5);

            if (readError) {
                console.error('❌ Read test failed:', readError.message);
                return false;
            }

            console.log(`✅ Read successful - found ${readData.length} records`);

            // 2. Test Insert
            console.log('➕ Testing insert operations...');
            const testEntry = {
                player_name: 'TestUser_' + Date.now(),
                score: 150,
                collected_items: 15,
                game_time: 45,
                ip_address: '127.0.0.1'
            };

            const { data: insertData, error: insertError } = await this.supabase
                .from('highscores')
                .insert([testEntry])
                .select();

            if (insertError) {
                console.error('❌ Insert test failed:', insertError.message);
                return false;
            }

            console.log('✅ Insert successful:', insertData[0]);

            // 3. Test Top 10 query
            console.log('🏆 Testing top 10 query...');
            const { data: topData, error: topError } = await this.supabase
                .from('top_highscores')
                .select('*')
                .limit(10);

            if (topError) {
                console.error('❌ Top 10 query failed:', topError.message);
                return false;
            }

            console.log(`✅ Top 10 query successful - ${topData.length} records`);

            return true;
        } catch (error) {
            console.error('❌ Highscore operations failed:', error);
            return false;
        }
    }

    async testGuestbookOperations() {
        console.log('\n💬 Testing Guestbook Operations...');

        try {
            // Check if guestbook table exists
            const { data, error } = await this.supabase
                .from('guestbook')
                .select('count')
                .limit(1);

            if (error) {
                console.log('⚠️ Guestbook table not found - needs to be created');
                console.log('   Run SUPABASE_SETUP.sql to create guestbook structure');
                return false;
            }

            console.log('✅ Guestbook table exists');

            // Test insert
            const testGuestbookEntry = {
                name: 'TestVisitor_' + Date.now(),
                email: 'test@example.com',
                message: 'Test message from connection tester',
                ip_address: '127.0.0.1'
            };

            const { data: insertData, error: insertError } = await this.supabase
                .from('guestbook')
                .insert([testGuestbookEntry])
                .select();

            if (insertError) {
                console.error('❌ Guestbook insert failed:', insertError.message);
                return false;
            }

            console.log('✅ Guestbook insert successful:', insertData[0]);
            return true;

        } catch (error) {
            console.error('❌ Guestbook operations failed:', error);
            return false;
        }
    }

    async runAllTests() {
        console.log('🧪 Supabase Connection Test Suite Starting...\n');

        // 1. Initialize
        const initSuccess = await this.init();
        if (!initSuccess) return false;

        // 2. Test basic connection
        const connectionSuccess = await this.testConnection();
        if (!connectionSuccess) return false;

        // 3. Test highscore operations
        const highscoreSuccess = await this.testHighscoreOperations();

        // 4. Test guestbook operations
        const guestbookSuccess = await this.testGuestbookOperations();

        // Summary
        console.log('\n📊 Test Results Summary:');
        console.log('✅ Connection:', connectionSuccess ? 'PASS' : 'FAIL');
        console.log('✅ Highscore Operations:', highscoreSuccess ? 'PASS' : 'FAIL');
        console.log('✅ Guestbook Operations:', guestbookSuccess ? 'PASS' : 'FAIL');

        const allSuccess = connectionSuccess && highscoreSuccess && guestbookSuccess;
        console.log('\n🎯 Overall Result:', allSuccess ? '✅ ALL TESTS PASS' : '⚠️ SOME TESTS FAILED');

        return allSuccess;
    }
}

// Auto-run when loaded in browser
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', async () => {
        const tester = new SupabaseConnectionTester();
        await tester.runAllTests();
    });

    // Also make available globally
    window.SupabaseConnectionTester = SupabaseConnectionTester;
} else {
    console.log('This test requires a browser environment');
}