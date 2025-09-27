// 🐠 GUESTBOOK DATABASE CONNECTION TEST
// Testet Supabase-Verbindung und Datenbankstruktur

const { createClient } = require('@supabase/supabase-js');

// Supabase Configuration (aus guestbook.html)
const SUPABASE_URL = 'https://gnhsauvbqrxywtgppetm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNhdXZicXJ4eXd0Z3BwZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Njc0MjcsImV4cCI6MjA3NDI0MzQyN30.DHPTMZR6NOT7mDvCOI_1fzx87dhX9syBFek_cKkOaSc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testGuestbookDatabase() {
    console.log('🔄 Testing Guestbook Database Connection...\n');

    try {
        // 1. Basic Connection Test
        console.log('1️⃣ Testing basic connection...');
        const { data: testData, error: testError } = await supabase
            .from('guestbook')
            .select('count')
            .limit(1);

        if (testError) {
            console.log('❌ Connection failed:', testError.message);
            return false;
        }
        console.log('✅ Basic connection successful\n');

        // 2. Schema Validation
        console.log('2️⃣ Testing schema structure...');
        const { data: schemaTest, error: schemaError } = await supabase
            .from('guestbook')
            .select('id, name, message, created_at, avatar_emoji, is_approved')
            .limit(1);

        if (schemaError) {
            if (schemaError.message.includes('is_approved')) {
                console.log('❌ CRITICAL: is_approved column missing!');
                console.log('   📋 Run GUESTBOOK_SCHEMA_UPDATE.sql in Supabase SQL Editor');
                return false;
            }
            console.log('❌ Schema error:', schemaError.message);
            return false;
        }
        console.log('✅ Schema structure valid\n');

        // 3. Test approved entries read
        console.log('3️⃣ Testing approved entries read...');
        const { data: approvedData, error: approvedError } = await supabase
            .from('guestbook')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false });

        if (approvedError) {
            console.log('❌ Approved entries read failed:', approvedError.message);
            return false;
        }
        console.log(`✅ Successfully read ${approvedData.length} approved entries\n`);

        // 4. Test write operation (with cleanup)
        console.log('4️⃣ Testing write operation...');
        const testEntry = {
            name: 'Test User',
            message: 'This is a test entry - will be deleted',
            avatar_emoji: '🧪',
            is_approved: false
        };

        const { data: insertData, error: insertError } = await supabase
            .from('guestbook')
            .insert([testEntry])
            .select();

        if (insertError) {
            console.log('❌ Insert failed:', insertError.message);
            return false;
        }

        const testId = insertData[0].id;
        console.log('✅ Test entry created with ID:', testId);

        // 5. Clean up test entry
        console.log('5️⃣ Cleaning up test entry...');
        const { error: deleteError } = await supabase
            .from('guestbook')
            .delete()
            .eq('id', testId);

        if (deleteError) {
            console.log('⚠️ Warning: Could not delete test entry:', deleteError.message);
        } else {
            console.log('✅ Test entry cleaned up\n');
        }

        // 6. Final Summary
        console.log('📊 DATABASE TEST RESULTS:');
        console.log('✅ Connection: Working');
        console.log('✅ Schema: Valid with is_approved field');
        console.log('✅ Read Operations: Working');
        console.log('✅ Write Operations: Working');
        console.log(`📈 Total approved entries: ${approvedData.length}`);

        return true;

    } catch (error) {
        console.log('❌ Unexpected error:', error.message);
        return false;
    }
}

// Run if called directly
if (require.main === module) {
    testGuestbookDatabase().then(success => {
        if (success) {
            console.log('\n🎉 All tests passed! Guestbook database is ready.');
            process.exit(0);
        } else {
            console.log('\n💥 Some tests failed. Check configuration and schema.');
            process.exit(1);
        }
    });
}

module.exports = { testGuestbookDatabase };