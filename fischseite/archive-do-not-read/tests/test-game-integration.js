// 🎮 Test Game Integration mit Supabase
// Simuliert wie das Spiel auf fehlende Tabellen reagiert

const https = require('https');

// Simuliere die SupabaseHighscoreManager Logik
class GameIntegrationTest {
    constructor() {
        this.supabaseUrl = 'https://gnhsauvbqrxywtgppetm.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNhdXZicXJ4eXd0Z3BwZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Njc0MjcsImV4cCI6MjA3NDI0MzQyN30.DHPTMZR6NOT7mDvCOI_1fzx87dhX9syBFek_cKkOaSc';
        this.isConnected = false;
    }

    async testConnectionLikeInGame() {
        console.log('🎮 Testing connection wie im echten Spiel...\n');

        try {
            // Simuliere den Test aus aquarium-collector-game.js
            const response = await this.makeRequest('/highscores?select=count&limit=1');

            if (response.success) {
                this.isConnected = true;
                console.log('🏆 Supabase Highscore System connected successfully!');
                return true;
            } else {
                this.isConnected = false;
                console.log('⚠️ Supabase connection failed, using offline mode:', response.data);
                return false;
            }
        } catch (error) {
            this.isConnected = false;
            console.log('⚠️ Supabase initialization failed, using offline mode:', error.message);
            return false;
        }
    }

    async simulateGameEnd() {
        console.log('\n🎯 Simuliere Spielende mit Perfect Score...');

        const gameData = {
            playerName: 'TestPlayer',
            score: 300,
            collected: 20, // Perfect score!
            gameTime: 45,
            isPerfectScore: true
        };

        console.log('📊 Game Data:', gameData);

        if (!this.isConnected) {
            console.log('⚠️ Offline-Modus: Highscore nicht gespeichert');
            console.log('🎮 Spiel würde Dialog zeigen: "Offline-Modus - Highscore nicht gespeichert"');
            return { success: false, error: 'Offline mode' };
        }

        try {
            const highscoreData = {
                player_name: gameData.playerName,
                score: gameData.score,
                collected_items: gameData.collected,
                game_time: gameData.gameTime,
                ip_address: '127.0.0.1'
            };

            const response = await this.makeRequest('/highscores', 'POST', highscoreData);

            if (response.success) {
                console.log('🎉 Perfect Score gespeichert!');
                console.log('📊 Saved data:', response.data);
                return { success: true, data: response.data };
            } else {
                console.log('❌ Speichern fehlgeschlagen:', response.data);
                return { success: false, error: response.data };
            }
        } catch (error) {
            console.log('❌ Netzwerk-Fehler:', error.message);
            return { success: false, error: error.message };
        }
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

    async runGameScenario() {
        console.log('🎮 GAME INTEGRATION TEST - Wie reagiert das Spiel?\n');

        // Test 1: Connection Check
        await this.testConnectionLikeInGame();

        // Test 2: Game End Scenario
        const result = await this.simulateGameEnd();

        console.log('\n📋 ERWARTETES VERHALTEN:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (this.isConnected) {
            console.log('✅ Connected: Spiel zeigt Highscore-Dialog');
            console.log('🎯 Perfect Score: Automatische Speicherung');
            console.log('🏆 Success: Zeige Highscore-Liste');
        } else {
            console.log('⚠️ Offline: Spiel funktioniert trotzdem');
            console.log('🎮 Spieler kann normal spielen');
            console.log('📱 Kein Highscore-Dialog, nur lokale Anzeige');
            console.log('');
            console.log('💡 LÖSUNG: HIGHSCORE_SETUP.sql in Supabase ausführen');
        }

        return result;
    }
}

// Run test
const tester = new GameIntegrationTest();
tester.runGameScenario();