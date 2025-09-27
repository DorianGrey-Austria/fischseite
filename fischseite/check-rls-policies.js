// 🔍 RLS POLICIES CHECKER
// Zeigt aktuelle Row Level Security Policies für die guestbook Tabelle

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://gnhsauvbqrxywtgppetm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNhdXZicXJ4eXd0Z3BwZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Njc0MjcsImV4cCI6MjA3NDI0MzQyN30.DHPTMZR6NOT7mDvCOI_1fzx87dhX9syBFek_cKkOaSc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkRLSPolicies() {
    console.log('🔍 Checking RLS Policies for guestbook table...\n');

    try {
        // Query für aktuelle Policies
        const { data: policies, error } = await supabase
            .from('pg_policies')
            .select('*')
            .eq('tablename', 'guestbook');

        if (error) {
            console.log('❌ Error querying policies:', error.message);

            // Alternative: Versuche eine einfache INSERT um die Policy-Details zu sehen
            console.log('\n🧪 Testing INSERT to get detailed error...');
            const { data: testData, error: testError } = await supabase
                .from('guestbook')
                .insert([{
                    name: 'Test',
                    message: 'Test message',
                    avatar_emoji: '🧪',
                    is_approved: false
                }]);

            if (testError) {
                console.log('Detailed INSERT error:', testError);
            }

            return;
        }

        if (policies.length === 0) {
            console.log('⚠️ No RLS policies found for guestbook table');
        } else {
            console.log('📋 Current RLS Policies:');
            policies.forEach(policy => {
                console.log(`\n  Policy: ${policy.policyname}`);
                console.log(`  Command: ${policy.cmd}`);
                console.log(`  Permissive: ${policy.permissive}`);
                console.log(`  Roles: ${policy.roles}`);
                console.log(`  Qual: ${policy.qual}`);
                console.log(`  With Check: ${policy.with_check}`);
            });
        }

        // Prüfe RLS Status
        const { data: tableInfo, error: tableError } = await supabase
            .from('information_schema.tables')
            .select('*')
            .eq('table_name', 'guestbook');

        if (!tableError) {
            console.log('\n📊 Table Information:');
            console.log('Table exists:', tableInfo.length > 0);
        }

    } catch (error) {
        console.log('❌ Unexpected error:', error.message);
    }
}

checkRLSPolicies();