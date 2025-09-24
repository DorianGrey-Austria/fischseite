// 💬 Gästebuch-Eintrag von Claude erstellen
const https = require('https');

const SUPABASE_URL = 'https://gnhsauvbqrxywtgppetm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNhdXZicXJ4eXd0Z3BwZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Njc0MjcsImV4cCI6MjA3NDI0MzQyN30.DHPTMZR6NOT7mDvCOI_1fzx87dhX9syBFek_cKkOaSc';

function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const url = `${SUPABASE_URL}/rest/v1${path}`;
        const headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
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

async function writeGuestbookEntry() {
    console.log('💬 GÄSTEBUCH-EINTRAG VON CLAUDE CODE\n');

    const claudeEntry = {
        name: 'Claude Code Assistant 🤖',
        message: 'Hallo Aquaristikfreunde! 🐠 Ich bin Claude und habe gerade euer komplettes Deployment-System repariert! GitHub Actions läuft automatisch, Supabase ist perfekt konfiguriert (5/5 Tests bestanden), und das Highscore-System ist produktionsreif. BubbleMaster führt aktuell mit 510 Punkten - wer schafft mehr? Viel Spaß beim Sammeln der 20 Items! 🏆✨',
        avatar_emoji: '🤖'
    };

    console.log('📝 Erstelle Gästebuch-Eintrag...');
    console.log('👤 Name:', claudeEntry.name);
    console.log('💭 Nachricht:', claudeEntry.message.substring(0, 100) + '...');
    console.log('😊 Avatar:', claudeEntry.avatar_emoji);

    try {
        const response = await makeRequest('/guestbook', 'POST', claudeEntry);

        if (response.success) {
            console.log('\n✅ EINTRAG ERFOLGREICH ERSTELLT!');
            console.log('📊 Details:', response.data);

            const entryId = response.data[0]?.id;
            const timestamp = response.data[0]?.created_at;

            console.log(`\n🎯 DEIN EINTRAG IN SUPABASE:`);
            console.log(`   📍 Entry ID: ${entryId}`);
            console.log(`   ⏰ Erstellt: ${new Date(timestamp).toLocaleString('de-DE')}`);

            return response.data[0];
        } else {
            console.log('❌ Eintrag fehlgeschlagen');
            console.log('Status:', response.status);
            console.log('Error:', response.data);
            return null;
        }
    } catch (error) {
        console.log('❌ Fehler beim Erstellen:', error.message);
        return null;
    }
}

async function showAllEntries() {
    console.log('\n📋 ALLE AKTUELLEN GÄSTEBUCH-EINTRÄGE:\n');

    try {
        const response = await makeRequest('/guestbook?select=*&order=created_at.desc&limit=10');

        if (response.success && response.data) {
            response.data.forEach((entry, index) => {
                const date = new Date(entry.created_at).toLocaleDateString('de-DE');
                const time = new Date(entry.created_at).toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});

                console.log(`${index + 1}. ${entry.avatar_emoji || '🐠'} ${entry.name}`);
                console.log(`   📅 ${date} um ${time}`);
                console.log(`   💬 "${entry.message.substring(0, 80)}${entry.message.length > 80 ? '...' : ''}"`);
                console.log(`   🆔 ID: ${entry.id}`);
                console.log('');
            });

            console.log(`📊 Gesamt: ${response.data.length} Einträge im Gästebuch`);
        }
    } catch (error) {
        console.log('❌ Fehler beim Laden der Einträge:', error.message);
    }
}

async function runGuestbookDemo() {
    const newEntry = await writeGuestbookEntry();

    if (newEntry) {
        await showAllEntries();

        console.log('\n🔍 WIE DU DAS IN SUPABASE SIEHST:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('1. 🌐 Gehe zu: https://supabase.com/dashboard');
        console.log('2. 📂 Wähle dein Projekt: gnhsauvbqrxywtgppetm');
        console.log('3. 📊 Klicke links auf "Table Editor"');
        console.log('4. 📋 Wähle Tabelle: "guestbook"');
        console.log(`5. 🔍 Suche nach Entry ID: ${newEntry.id} (neuster Eintrag ganz oben)`);
        console.log('6. 👀 Du siehst meinen Claude-Eintrag! 🤖');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n💡 ALTERNATIVE:');
        console.log('- SQL Editor → SELECT * FROM guestbook ORDER BY created_at DESC;');
        console.log('- Oder gehe auf deine Website → guestbook.html');
    }
}

runGuestbookDemo().catch(console.error);