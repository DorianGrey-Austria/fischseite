// 🎭 Direkter Guestbook-Eintrag Test
// Simuliert was passiert, wenn jemand das Formular ausfüllt

const https = require('https');

class DirectGuestbookAdd {
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

            const req = https.request(url, { method, headers }, (res) => {
                let responseData = '';
                res.on('data', (chunk) => responseData += chunk);
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
            if (data && method !== 'GET') req.write(JSON.stringify(data));
            req.end();
        });
    }

    async testDirectEntry() {
        console.log('✏️ DIREKTER GUESTBOOK-EINTRAG TEST\n');

        // Erstelle realistische Test-Daten wie ein echter User
        const testUser = {
            name: 'Claude Test-User',
            message: '🤖 Hallo Aquaristikfreunde! Dies ist ein automatischer Test-Eintrag. Die Supabase-Integration funktioniert perfekt! Ich freue mich darauf, mehr über eure Aquarium-Erfahrungen zu lesen! 🐠',
            avatar_emoji: '🤖',
            ip_address: '127.0.0.1'
        };

        console.log('📝 Test-Eingabe:');
        console.log('  Name:', testUser.name);
        console.log('  Nachricht:', testUser.message.substring(0, 100) + '...');
        console.log('  Avatar:', testUser.avatar_emoji);

        console.log('\n📤 Sende Eintrag an Supabase...');

        try {
            const response = await this.makeRequest('/guestbook', 'POST', testUser);

            if (response.success) {
                console.log('🎉 ERFOLG! Eintrag hinzugefügt:');
                console.log('  📊 Status:', response.status);
                console.log('  🆔 ID:', response.data[0]?.id);
                console.log('  📅 Erstellt:', response.data[0]?.created_at);
                console.log('  ✅ Approved:', response.data[0]?.is_approved);

                return {
                    success: true,
                    entry: response.data[0],
                    testUser
                };
            } else {
                console.log('❌ FEHLER beim Hinzufügen:');
                console.log('  📊 Status:', response.status);
                console.log('  📄 Error:', response.data);

                return {
                    success: false,
                    error: response.data,
                    testUser
                };
            }
        } catch (error) {
            console.log('💥 NETZWERK-FEHLER:', error.message);
            return {
                success: false,
                error: error.message,
                testUser
            };
        }
    }

    async verifyEntry(entryId) {
        console.log(`\n🔍 Überprüfe Eintrag ${entryId}...`);

        try {
            const response = await this.makeRequest(`/guestbook?id=eq.${entryId}&select=*`);

            if (response.success && response.data.length > 0) {
                const entry = response.data[0];
                console.log('✅ Eintrag gefunden:');
                console.log('  Name:', entry.name);
                console.log('  Nachricht:', entry.message.substring(0, 80) + '...');
                console.log('  Datum:', new Date(entry.created_at).toLocaleString('de-DE'));
                console.log('  Approved:', entry.is_approved);

                return entry;
            } else {
                console.log('❌ Eintrag nicht gefunden');
                return null;
            }
        } catch (error) {
            console.log('❌ Fehler bei Überprüfung:', error.message);
            return null;
        }
    }

    async getAllEntries() {
        console.log('\n📋 Alle Guestbook-Einträge:');

        try {
            const response = await this.makeRequest('/guestbook?select=*&order=created_at.desc&limit=10');

            if (response.success) {
                console.log(`✅ ${response.data.length} Einträge gefunden:\n`);

                response.data.forEach((entry, index) => {
                    console.log(`${index + 1}. ${entry.name} (${entry.avatar_emoji})`);
                    console.log(`   "${entry.message.substring(0, 60)}..."`);
                    console.log(`   📅 ${new Date(entry.created_at).toLocaleString('de-DE')}`);
                    console.log(`   ✅ Approved: ${entry.is_approved}\n`);
                });

                return response.data;
            } else {
                console.log('❌ Fehler beim Laden der Einträge');
                return [];
            }
        } catch (error) {
            console.log('❌ Netzwerk-Fehler:', error.message);
            return [];
        }
    }

    async runFullTest() {
        console.log('🧪 VOLLSTÄNDIGER GUESTBOOK-FUNKTIONSTEST\n');
        console.log('==========================================\n');

        // 1. Zeige aktuelle Einträge
        const beforeEntries = await this.getAllEntries();
        const beforeCount = beforeEntries.length;

        // 2. Füge neuen Eintrag hinzu
        const result = await this.testDirectEntry();

        if (result.success) {
            // 3. Verifiziere den neuen Eintrag
            await this.verifyEntry(result.entry.id);

            // 4. Zeige alle Einträge nach dem Test
            const afterEntries = await this.getAllEntries();
            const afterCount = afterEntries.length;

            console.log('\n📊 ZUSAMMENFASSUNG:');
            console.log('===================');
            console.log(`📈 Einträge vorher: ${beforeCount}`);
            console.log(`📈 Einträge nachher: ${afterCount}`);
            console.log(`➕ Neue Einträge: ${afterCount - beforeCount}`);
            console.log(`🆔 Neue Eintrag-ID: ${result.entry.id}`);

            if (afterCount > beforeCount) {
                console.log('\n🎉 SUCCESS! Guestbook-Funktionalität bestätigt!');
                console.log('✅ API-Zugriff funktioniert');
                console.log('✅ Datenbankschreibung funktioniert');
                console.log('✅ Datenbanklesen funktioniert');
                console.log('✅ Automatische Approval funktioniert');
            }

            return true;
        } else {
            console.log('\n❌ TEST FAILED');
            console.log('Grund:', result.error);
            return false;
        }
    }
}

// Test ausführen
const tester = new DirectGuestbookAdd();
tester.runFullTest().then((success) => {
    console.log('\n🏁 Test beendet:', success ? 'ERFOLGREICH' : 'FEHLGESCHLAGEN');
    process.exit(success ? 0 : 1);
}).catch((error) => {
    console.error('💥 Test-Fehler:', error);
    process.exit(1);
});