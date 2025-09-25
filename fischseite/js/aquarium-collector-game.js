/* 🐠 AQUARIUM FUTTER-SAMMLER SPIEL
   - 20 verschiedene Futterobjekte sammeln
   - Realistischer Aquarium-Hintergrund
   - Score-System mit Feedback
   - Exit-Dialog
   - 🏆 HIGHSCORE-SYSTEM mit Supabase
   - Perfect Score Detection (20/20)
   - Name-Eingabe für Bestleistungen
*/

// 🚀 Supabase Integration für Highscores
class SupabaseHighscoreManager {
    constructor() {
        this.supabaseUrl = 'https://gnhsauvbqrxywtgppetm.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaHNhdXZicXJ4eXd0Z3BwZXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2Njc0MjcsImV4cCI6MjA3NDI0MzQyN30.DHPTMZR6NOT7mDvCOI_1fzx87dhX9syBFek_cKkOaSc';
        this.supabase = null;
        this.isConnected = false;
        this.init();
    }

    async init() {
        try {
            // Load Supabase dynamically from CDN
            if (!window.supabase) {
                await this.loadSupabaseClient();
            }

            this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);

            // Test connection
            const { data, error } = await this.supabase.from('highscores').select('count').limit(1);

            if (!error) {
                this.isConnected = true;
                console.log('🏆 Supabase Highscore System connected successfully!');
            } else {
                console.warn('⚠️ Supabase connection failed, using offline mode:', error);
            }
        } catch (err) {
            console.warn('⚠️ Supabase initialization failed, using offline mode:', err);
        }
    }

    async loadSupabaseClient() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async saveHighscore(playerName, score, collectedItems, gameTime, actualDuration, gameLevel = 1) {
        if (!this.isConnected || !this.supabase) {
            console.warn('⚠️ Cannot save highscore - offline mode');
            return { success: false, error: 'Offline mode', data: null };
        }

        try {
            const bonusPoints = this.calculateBonusPoints(collectedItems, gameTime, actualDuration);
            const finalScore = score + bonusPoints;

            const { data, error } = await this.supabase
                .from('highscores')
                .insert({
                    player_name: playerName.trim(),
                    score: finalScore,
                    collected_items: collectedItems,
                    game_time: gameTime,
                    game_duration_actual: actualDuration,
                    bonus_points: bonusPoints
                })
                .select();

            if (error) {
                console.error('Error saving highscore:', error);
                return { success: false, error: error.message, data: null };
            }

            console.log('🎉 Highscore saved successfully:', data);
            return { success: true, error: null, data: data[0] };

        } catch (err) {
            console.error('Exception saving highscore:', err);
            return { success: false, error: err.message, data: null };
        }
    }

    calculateBonusPoints(collectedItems, gameTime, actualDuration) {
        let bonus = 0;

        // Perfect Score Bonus - dynamisch basierend auf totalItems
        if (collectedItems >= 20) {  // Ab 20 Fischen gibt es Perfect Score Bonus
            bonus += 100 + (collectedItems - 20) * 10; // Extra Bonus für mehr Items
        }

        // Speed Bonus (je schneller, desto mehr Bonus)
        const timeBonus = Math.max(0, (gameTime - actualDuration) * 2);
        bonus += Math.floor(timeBonus);

        // Completion Rate Bonus
        const completionRate = collectedItems / 20;
        bonus += Math.floor(completionRate * 50);

        return bonus;
    }

    async getTopHighscores(limit = 50) {
        if (!this.isConnected || !this.supabase) {
            return [];
        }

        try {
            const { data, error } = await this.supabase
                .from('highscores')
                .select('*')
                .order('score', { ascending: false })
                .order('created_at', { ascending: true })
                .limit(limit);

            if (error) {
                console.error('Error fetching highscores:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('Exception fetching highscores:', err);
            return [];
        }
    }

    async getPerfectScores(limit = 20) {
        if (!this.isConnected || !this.supabase) {
            return [];
        }

        try {
            const { data, error } = await this.supabase
                .from('highscores')
                .select('*')
                .eq('collected_items', 20)
                .order('score', { ascending: false })
                .order('game_time', { ascending: true })
                .limit(limit);

            if (error) {
                console.error('Error fetching perfect scores:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.error('Exception fetching perfect scores:', err);
            return [];
        }
    }

    async getPlayerRank(score) {
        if (!this.isConnected || !this.supabase) {
            return 0;
        }

        try {
            const { count, error } = await this.supabase
                .from('highscores')
                .select('*', { count: 'exact', head: true })
                .gt('score', score);

            if (error) {
                console.error('Error getting player rank:', error);
                return 0;
            }

            return (count || 0) + 1;
        } catch (err) {
            console.error('Exception getting player rank:', err);
            return 0;
        }
    }
}

class AquariumCollectorGame {
    constructor(containerEl, gameNumber = 1) {
        if (!containerEl) {
            throw new Error('Container element is required');
        }

        this.container = containerEl;
        this.gameNumber = gameNumber;

        console.log(`🎮 Initialisiere AquariumCollectorGame ${gameNumber}...`);

        // Canvas mit Error-Handling erstellen
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'aquarium-game-canvas';
        this.canvas.style.cssText = `
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 10px;
            cursor: crosshair;
            background: transparent;
        `;

        try {
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                throw new Error('Canvas context not available');
            }
            console.log('✅ Canvas Context erfolgreich erstellt');
        } catch (error) {
            console.error('❌ Canvas-Fehler:', error);
            throw error;
        }

        this.container.appendChild(this.canvas);

        // Schwierigkeitsbasierte Game State
        this.difficulty = this.calculateDifficulty(gameNumber);
        this.totalItems = this.difficulty.items;
        this.collected = 0;
        this.missed = 0;
        this.score = 0;
        this.gameTime = this.difficulty.time;
        this.timeLeft = this.gameTime;
        this.gameRunning = false;
        this.gameEnded = false;
        this.firstFishClicked = false;

        // 🔥 COMBO SYSTEM
        this.combo = {
            streak: 0,
            multiplier: 1.0,
            maxMultiplier: 5.0,
            comboTimer: 3000, // 3 Sekunden für nächsten Combo
            lastCollectionTime: 0,
            displayTimer: null
        };

        // ⚡ POWER-UPS SYSTEM
        this.powerUps = [];
        this.activePowerUps = [];
        this.powerUpTypes = [
            {
                type: 'speed_boost',
                emoji: '💨',
                duration: 5000,
                spawnChance: 0.1,
                color: '#FFD700',
                effect: () => {
                    this.playerFish.speed *= 2;
                    this.showPowerUpEffect('SPEED BOOST!');
                }
            },
            {
                type: 'time_freeze',
                emoji: '❄️',
                duration: 3000,
                spawnChance: 0.08,
                color: '#00FFFF',
                effect: () => {
                    this.timeFrozen = true;
                    this.showPowerUpEffect('TIME FREEZE!');
                }
            },
            {
                type: 'magnet',
                emoji: '🧲',
                duration: 6000,
                spawnChance: 0.06,
                color: '#FF1493',
                effect: () => {
                    this.magnetActive = true;
                    this.magnetRadius = 150;
                    this.showPowerUpEffect('MAGNET!');
                }
            },
            {
                type: 'double_points',
                emoji: '💎',
                duration: 8000,
                spawnChance: 0.05,
                color: '#9370DB',
                effect: () => {
                    this.pointMultiplier = 2;
                    this.showPowerUpEffect('DOUBLE POINTS!');
                }
            }
        ];
        this.timeFrozen = false;
        this.magnetActive = false;
        this.magnetRadius = 0;
        this.pointMultiplier = 1;

        // 🎨 VISUAL EFFECTS
        this.screenShake = {
            active: false,
            intensity: 0,
            duration: 0,
            startTime: 0
        };
        this.colorOverlay = {
            active: false,
            color: 'rgba(0,0,0,0)',
            duration: 0,
            startTime: 0
        };
        this.comboEffects = [];
        this.powerUpEffects = [];

        // 🔊 SOUND SYSTEM
        this.soundEnabled = true;
        this.sounds = {
            collect: this.createSound(800, 0.1, 0.1),
            combo: this.createSound(1200, 0.1, 0.15),
            powerup: this.createSound(1500, 0.2, 0.2),
            perfect: this.createSound(2000, 0.3, 0.3),
            gameOver: this.createSound(300, 0.5, 0.2)
        };

        // 🏆 Highscore System
        this.highscoreManager = new SupabaseHighscoreManager();
        this.gameStartTime = null;
        this.gameEndTime = null;
        this.isPerfectScore = false;
        this.finalScore = 0;
        this.playerRank = 0;

        // Aquarium Setup
        this.playerFish = {
            x: 100,
            y: 200,
            width: 60,
            height: 40,
            speed: 5
        };

        // Futter-Typen mit verschiedenen Punktwerten - Größer für bessere Sichtbarkeit
        this.foodTypes = [
            { type: 'flakes', emoji: '🐟', points: 10, color: '#FF6B6B', size: 35 },
            { type: 'worms', emoji: '🪱', points: 20, color: '#4ECDC4', size: 30 },
            { type: 'pellets', emoji: '⭕', points: 15, color: '#45B7D1', size: 38 },
            { type: 'shrimp', emoji: '🦐', points: 25, color: '#FFA07A', size: 40 },
            { type: 'plant', emoji: '🌱', points: 12, color: '#98D8C8', size: 32 }
        ];

        this.collectibles = [];
        this.particles = [];
        this.bubbles = [];
        this.playerTrails = []; // Spieler-Trails für visuelle Effekte

        // Hintergrund laden
        this.backgroundImg = new Image();
        this.backgroundImg.src = 'data:image/svg+xml;base64,' + btoa(`
            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="water" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#4682B4;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#191970;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#water)"/>
                <!-- Aquarium Pflanzen -->
                <path d="M50 550 Q100 450 120 500 Q140 400 160 480 Q180 350 200 450"
                      stroke="#2E8B57" stroke-width="8" fill="none"/>
                <path d="M650 550 Q700 420 720 480 Q740 380 760 440"
                      stroke="#228B22" stroke-width="6" fill="none"/>
                <!-- Steine -->
                <ellipse cx="300" cy="580" rx="80" ry="20" fill="#696969"/>
                <ellipse cx="500" cy="570" rx="60" ry="25" fill="#778899"/>
            </svg>
        `);

        // Game-Styles hinzufügen
        this.addGameStyles();

        this.setup();
        this.initControls();
        this.spawnInitialItems();
        this.createUI();

        console.log(`🎉 AquariumCollectorGame ${gameNumber} vollständig initialisiert!`);
    }

    addGameStyles() {
        // Einmalig Game-Styles zum Document hinzufügen
        if (document.getElementById('aquarium-game-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'aquarium-game-styles';
        styles.textContent = `
            .aquarium-game-canvas {
                border: 3px solid rgba(78, 205, 196, 0.5);
                box-shadow:
                    0 0 20px rgba(78, 205, 196, 0.3),
                    inset 0 0 20px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
            }

            .aquarium-game-canvas:hover {
                border-color: rgba(78, 205, 196, 0.8);
                box-shadow:
                    0 0 30px rgba(78, 205, 196, 0.5),
                    inset 0 0 20px rgba(0, 0, 0, 0.1);
            }

            .game-start-btn {
                background: linear-gradient(135deg, #4ECDC4, #44A08D);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 100;
                box-shadow: 0 4px 15px rgba(78, 205, 196, 0.4);
                transition: all 0.3s ease;
                animation: pulse-glow 2s ease-in-out infinite;
            }

            .game-start-btn:hover {
                transform: translate(-50%, -50%) scale(1.05);
                box-shadow: 0 6px 25px rgba(78, 205, 196, 0.6);
            }

            @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 4px 15px rgba(78, 205, 196, 0.4); }
                50% { box-shadow: 0 8px 30px rgba(78, 205, 196, 0.8); }
            }

            .game-exit-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(255, 107, 107, 0.9);
                color: white;
                border: none;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                z-index: 101;
                transition: all 0.3s ease;
            }

            .game-exit-btn:hover {
                background: rgba(255, 107, 107, 1);
                transform: scale(1.1);
            }

            .game-ui {
                position: absolute;
                top: 10px;
                left: 10px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 15px;
                border-radius: 10px;
                font-family: 'Arial', sans-serif;
                font-weight: bold;
                z-index: 100;
                min-width: 200px;
                backdrop-filter: blur(5px);
                border: 1px solid rgba(78, 205, 196, 0.3);
            }

            .game-ui div {
                margin: 5px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .score-display {
                color: #4ECDC4;
                font-size: 16px;
            }

            .items-display {
                color: #FFD700;
                font-size: 14px;
            }

            .timer-display {
                color: #FF6B6B;
                font-size: 14px;
            }

            .test-game-container {
                animation: game-container-glow 3s ease-in-out infinite;
            }

            @keyframes game-container-glow {
                0%, 100% {
                    border-color: rgba(78, 205, 196, 0.3);
                    box-shadow: 0 0 20px rgba(78, 205, 196, 0.2);
                }
                50% {
                    border-color: rgba(78, 205, 196, 0.6);
                    box-shadow: 0 0 40px rgba(78, 205, 196, 0.4);
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // 🎨 NEUE VISUELLE EFFEKT METHODEN
    drawPlayerTrails() {
        this.playerTrails.forEach(trail => {
            this.ctx.save();
            this.ctx.globalAlpha = trail.opacity;
            this.ctx.font = '40px Arial';
            this.ctx.fillText('🐠', trail.x - 20, trail.y + 15);
            this.ctx.restore();
        });
    }

    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            this.ctx.save();
            this.ctx.translate(powerUp.x, powerUp.y);
            this.ctx.rotate(powerUp.rotation);

            // Glow-Effekt
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = powerUp.color;

            // Power-Up zeichnen
            this.ctx.font = `${powerUp.size}px Arial`;
            this.ctx.fillText(powerUp.emoji, -powerUp.size/2, powerUp.size/2);

            this.ctx.restore();
        });
    }

    drawComboEffects() {
        this.comboEffects.forEach(effect => {
            this.ctx.save();
            this.ctx.globalAlpha = effect.opacity;
            this.ctx.font = `bold ${20 * effect.scale}px Arial`;
            this.ctx.fillStyle = '#FFD700';
            this.ctx.strokeStyle = '#FF6B6B';
            this.ctx.lineWidth = 2;
            this.ctx.fillText(effect.text, effect.x, effect.y);
            this.ctx.strokeText(effect.text, effect.x, effect.y);
            this.ctx.restore();
        });
    }

    drawPowerUpEffects() {
        this.powerUpEffects.forEach(effect => {
            this.ctx.save();
            this.ctx.globalAlpha = effect.opacity;
            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillStyle = effect.color || '#FFFFFF';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 3;
            this.ctx.strokeText(effect.text, effect.x, effect.y);
            this.ctx.fillText(effect.text, effect.x, effect.y);
            this.ctx.restore();
        });
    }

    drawComboMeter() {
        const x = this.canvas.width - 150;
        const y = 100;

        this.ctx.save();

        // Combo-Hintergrund
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(x, y, 120, 40);

        // Combo-Text
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText(`COMBO x${this.combo.streak}`, x + 10, y + 18);

        // Multiplikator
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText(`${this.combo.multiplier.toFixed(1)}x Points`, x + 10, y + 34);

        this.ctx.restore();
    }

    drawActivePowerUps() {
        const x = 10;
        let y = 200;

        this.activePowerUps.forEach(active => {
            const remaining = Math.ceil((active.duration - (Date.now() - active.startTime)) / 1000);

            this.ctx.save();
            this.ctx.font = '16px Arial';
            this.ctx.fillStyle = active.powerUp.color;
            this.ctx.fillText(`${active.powerUp.emoji} ${remaining}s`, x, y);
            this.ctx.restore();

            y += 25;
        });
    }

    // 🔥 COMBO UND EFFEKT METHODEN
    showComboEffect(text) {
        this.comboEffects.push({
            text: text,
            x: this.canvas.width / 2,
            y: 100,
            opacity: 1.0,
            scale: 1.0
        });
    }

    showPowerUpEffect(text) {
        this.powerUpEffects.push({
            text: text,
            x: this.canvas.width / 2,
            y: 150,
            opacity: 1.0,
            color: '#FFFF00'
        });

        // Farb-Overlay aktivieren
        this.colorOverlay.active = true;
        this.colorOverlay.color = 'rgba(255, 255, 0, 0.1)';
        this.colorOverlay.duration = 500;
        this.colorOverlay.startTime = Date.now();
    }

    createPointsAnimation(x, y, text, isCombo) {
        const color = isCombo ? '#FFD700' : '#FFFFFF';
        this.powerUpEffects.push({
            text: text,
            x: x,
            y: y,
            opacity: 1.0,
            color: color
        });
    }

    triggerScreenShake(intensity, duration) {
        this.screenShake.active = true;
        this.screenShake.intensity = intensity;
        this.screenShake.duration = duration;
        this.screenShake.startTime = Date.now();
    }

    // ⚡ POWER-UP METHODEN
    spawnPowerUp() {
        // Zufällig Power-Ups spawnen
        this.powerUpTypes.forEach(type => {
            if (Math.random() < type.spawnChance * 0.1) { // Reduzierte Chance pro Update
                this.powerUps.push({
                    ...type,
                    x: Math.random() * (this.canvas.width - 60) + 30,
                    y: -50,
                    width: 40,
                    height: 40,
                    size: 35,
                    speed: 1.5,
                    rotation: 0
                });
            }
        });
    }

    activatePowerUp(powerUp) {
        // Aktiviere Power-Up Effekt
        powerUp.effect();

        // Füge zu aktiven Power-Ups hinzu
        this.activePowerUps.push({
            powerUp: powerUp,
            startTime: Date.now(),
            duration: powerUp.duration
        });

        // Screen-Effekte
        this.triggerScreenShake(10, 300);
        this.colorOverlay.active = true;
        this.colorOverlay.color = `${powerUp.color}33`; // 20% opacity
        this.colorOverlay.duration = 300;
        this.colorOverlay.startTime = Date.now();

        // Sound abspielen
        this.playSound('powerup');
    }

    deactivatePowerUp(active) {
        // Power-Up Effekte zurücksetzen
        switch(active.powerUp.type) {
            case 'speed_boost':
                this.playerFish.speed = 5;
                break;
            case 'time_freeze':
                this.timeFrozen = false;
                break;
            case 'magnet':
                this.magnetActive = false;
                this.magnetRadius = 0;
                break;
            case 'double_points':
                this.pointMultiplier = 1;
                break;
        }
    }

    createCollectionEffect(x, y, color, count = 8) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: Math.random() * 6 + 2,
                color: color,
                life: 1
            });
        }
    }

    // 🔊 SOUND METHODEN
    createSound(frequency, duration, volume) {
        return {
            frequency: frequency,
            duration: duration * 1000, // in ms
            volume: volume
        };
    }

    playSound(type) {
        if (!this.soundEnabled) return;

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const sound = this.sounds[type];
            if (!sound) return;

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = sound.frequency;
            gainNode.gain.value = sound.volume;

            oscillator.start(0);
            oscillator.stop(audioContext.currentTime + sound.duration / 1000);

            // Fade out
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration / 1000);
        } catch (error) {
            // Ignoriere Audio-Fehler (Browser-Kompatibilität)
            console.warn('Audio not available:', error);
        }
    }

    calculateDifficulty(gameNumber) {
        const difficulties = [
            { level: 1, items: 15, time: 90, speedMultiplier: 1.0, pointsMultiplier: 1.0 },
            { level: 2, items: 18, time: 85, speedMultiplier: 1.2, pointsMultiplier: 1.5 },
            { level: 3, items: 20, time: 80, speedMultiplier: 1.4, pointsMultiplier: 2.0 },
            { level: 4, items: 22, time: 75, speedMultiplier: 1.6, pointsMultiplier: 2.5 },
            { level: 5, items: 25, time: 70, speedMultiplier: 1.8, pointsMultiplier: 3.0 },
            { level: 6, items: 25, time: 65, speedMultiplier: 2.0, pointsMultiplier: 4.0 }
        ];

        // Falls mehr als 6 Spiele, verwende das schwerste Level
        const index = Math.min(gameNumber - 1, difficulties.length - 1);
        return difficulties[index];
    }

    setup() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Blasen initialisieren
        for (let i = 0; i < 8; i++) {
            this.bubbles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + Math.random() * 100,
                radius: 3 + Math.random() * 8,
                speed: 0.5 + Math.random() * 1.5,
                opacity: 0.3 + Math.random() * 0.4
            });
        }
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = Math.max(400, rect.height);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = this.canvas.height + 'px';
    }

    initControls() {
        // Maus-/Touch-Steuerung
        const updatePlayerPosition = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
            const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

            this.playerFish.x = Math.max(0, Math.min(this.canvas.width - this.playerFish.width, x - this.playerFish.width/2));
            this.playerFish.y = Math.max(0, Math.min(this.canvas.height - this.playerFish.height, y - this.playerFish.height/2));
        };

        this.canvas.addEventListener('mousemove', updatePlayerPosition);
        this.canvas.addEventListener('touchmove', updatePlayerPosition, { passive: true });

        // Keyboard-Steuerung
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;

            switch(e.key) {
                case 'ArrowLeft':
                    this.playerFish.x = Math.max(0, this.playerFish.x - this.playerFish.speed);
                    break;
                case 'ArrowRight':
                    this.playerFish.x = Math.min(this.canvas.width - this.playerFish.width, this.playerFish.x + this.playerFish.speed);
                    break;
                case 'ArrowUp':
                    this.playerFish.y = Math.max(0, this.playerFish.y - this.playerFish.speed);
                    break;
                case 'ArrowDown':
                    this.playerFish.y = Math.min(this.canvas.height - this.playerFish.height, this.playerFish.y + this.playerFish.speed);
                    break;
            }
        });
    }

    spawnInitialItems() {
        // Alle 20 Items zufällig verteilen
        for (let i = 0; i < this.totalItems; i++) {
            this.spawnFood();
        }
    }

    spawnFood() {
        const foodType = this.foodTypes[Math.floor(Math.random() * this.foodTypes.length)];
        const collectible = {
            ...foodType,
            id: Date.now() + Math.random(),
            x: Math.random() * (this.canvas.width - 50) + 25,
            y: Math.random() * (this.canvas.height - 100) + 50,
            targetY: Math.random() * (this.canvas.height - 100) + 50,
            bobSpeed: 0.02 + Math.random() * 0.03,
            bobOffset: Math.random() * Math.PI * 2,
            collected: false,
            glowIntensity: 0.5 + Math.random() * 0.5
        };

        this.collectibles.push(collectible);
    }

    createUI() {
        // Exit Button
        const exitBtn = document.createElement('button');
        exitBtn.innerHTML = '✕';
        exitBtn.className = 'game-exit-btn';
        exitBtn.onclick = () => this.showExitDialog();
        this.container.appendChild(exitBtn);

        // Start Button mit Spielnummer
        const startBtn = document.createElement('button');
        startBtn.innerHTML = `🎮 Spiel ${this.gameNumber} starten`;
        startBtn.className = 'game-start-btn';
        startBtn.onclick = () => this.startGame();
        this.container.appendChild(startBtn);

        // UI Container für Score etc.
        const uiContainer = document.createElement('div');
        uiContainer.className = 'game-ui';
        uiContainer.innerHTML = `
            <div class="score-display">Score: <span id="score">0</span></div>
            <div class="items-display" id="items-display" style="display: none;">Gesammelt: <span id="collected">0</span>/${this.totalItems}</div>
            <div class="timer-display">Zeit: <span id="timer">${this.timeLeft}s</span></div>
        `;
        this.container.appendChild(uiContainer);
    }

    startGame() {
        this.gameRunning = true;
        this.gameEnded = false;
        this.timeLeft = this.gameTime;
        this.collected = 0;
        this.score = 0;
        this.missed = 0;

        // Hide interactive fish during game
        document.body.classList.add('game-active');

        // 🏆 Highscore Tracking
        this.gameStartTime = Date.now();
        this.gameEndTime = null;
        this.isPerfectScore = false;
        this.finalScore = 0;
        this.playerRank = 0;

        // Reset collectibles
        this.collectibles = [];
        this.spawnInitialItems();

        // Hide start button
        const startBtn = this.container.querySelector('.game-start-btn');
        if (startBtn) startBtn.style.display = 'none';

        // Start timer
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateUI();

            if (this.timeLeft <= 0 || this.collected >= this.totalItems) {
                this.endGame();
            }
        }, 1000);

        this.gameLoop();
        console.log('🎮 Game started! Highscore tracking active.');
    }

    showExitDialog() {
        const userChoice = confirm(
            "Möchtest du das Spiel beenden?\\n\\n" +
            "OK = Spiel beenden\\n" +
            "Abbrechen = Weiterspielen"
        );

        if (userChoice) {
            this.endGame();
            this.showMainMenu();
        }
    }

    gameLoop() {
        if (!this.gameRunning) return;

        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Kollisionserkennung
        this.collectibles.forEach((item, index) => {
            if (item.collected) return;

            // Floating Animation
            item.y = item.targetY + Math.sin(Date.now() * item.bobSpeed + item.bobOffset) * 10;

            // Kollision mit Spieler-Fisch
            if (this.checkCollision(this.playerFish, item)) {
                item.collected = true;
                this.collected++;

                // 🔥 COMBO SYSTEM UPDATE
                const now = Date.now();
                if (now - this.combo.lastCollectionTime < this.combo.comboTimer) {
                    this.combo.streak++;
                    this.combo.multiplier = Math.min(1 + (this.combo.streak * 0.3), this.combo.maxMultiplier);
                    this.showComboEffect(`${this.combo.streak}x COMBO!`);
                    this.triggerScreenShake(5, 200);
                } else {
                    this.combo.streak = 0;
                    this.combo.multiplier = 1.0;
                }
                this.combo.lastCollectionTime = now;

                // Schwierigkeits-Multiplikator + Combo + Power-Up Multiplikator
                const basePoints = Math.floor(item.points * this.difficulty.pointsMultiplier);
                const points = Math.floor(basePoints * this.combo.multiplier * this.pointMultiplier);
                this.score += points;

                // Zeige Punkte-Animation
                this.createPointsAnimation(item.x, item.y, `+${points}`, this.combo.streak > 0);

                // Sound abspielen
                if (this.combo.streak > 5) {
                    this.playSound('combo');
                } else {
                    this.playSound('collect');
                }

                // Zeige Fisch-Summe beim ersten gesammelten Fisch
                if (!this.firstFishClicked) {
                    this.firstFishClicked = true;
                    const itemsDisplay = document.getElementById('items-display');
                    if (itemsDisplay) {
                        itemsDisplay.style.display = 'block';
                        console.log('🐠 Fisch-Summe wird nach erstem Klick angezeigt');
                    }
                }

                // Partikel-Effekt (verstärkt bei Combo)
                const particleCount = this.combo.streak > 0 ? 15 : 8;
                this.createCollectionEffect(item.x, item.y, item.color, particleCount);

                // Item entfernen
                this.collectibles.splice(index, 1);

                this.updateUI();
            }
        });

        // Power-Ups bewegen und checken
        this.powerUps.forEach((powerUp, index) => {
            powerUp.y += powerUp.speed;
            powerUp.rotation += 0.05;

            // Magnet-Effekt auf Power-Ups
            if (this.magnetActive) {
                const dx = this.playerFish.x - powerUp.x;
                const dy = this.playerFish.y - powerUp.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.magnetRadius) {
                    powerUp.x += dx * 0.08;
                    powerUp.y += dy * 0.08;
                }
            }

            // Kollision mit Spieler
            if (this.checkCollision(this.playerFish, powerUp)) {
                this.activatePowerUp(powerUp);
                this.powerUps.splice(index, 1);
            }

            // Entfernen wenn außerhalb
            if (powerUp.y > this.canvas.height + 50) {
                this.powerUps.splice(index, 1);
            }
        });

        // Aktive Power-Ups verwalten
        this.activePowerUps = this.activePowerUps.filter(active => {
            if (Date.now() - active.startTime > active.duration) {
                this.deactivatePowerUp(active);
                return false;
            }
            return true;
        });

        // Spieler-Trails bei Speed Boost
        if (this.playerFish.speed > 5) {
            this.playerTrails.push({
                x: this.playerFish.x,
                y: this.playerFish.y,
                opacity: 0.5
            });
        }
        this.playerTrails = this.playerTrails.filter(trail => {
            trail.opacity -= 0.05;
            return trail.opacity > 0;
        });

        // Blasen bewegen
        this.bubbles.forEach(bubble => {
            bubble.y -= bubble.speed;
            if (bubble.y < -bubble.radius) {
                bubble.y = this.canvas.height + bubble.radius;
                bubble.x = Math.random() * this.canvas.width;
            }
        });

        // Partikel-Effekte aktualisieren
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            particle.size *= 0.99;
            return particle.life > 0;
        });

        // Combo-Effekte aktualisieren
        this.comboEffects = this.comboEffects.filter(effect => {
            effect.y -= 2;
            effect.opacity -= 0.02;
            effect.scale += 0.02;
            return effect.opacity > 0;
        });

        // Power-Up-Effekte aktualisieren
        this.powerUpEffects = this.powerUpEffects.filter(effect => {
            effect.y -= 1.5;
            effect.opacity -= 0.015;
            return effect.opacity > 0;
        });
    }

    checkCollision(rect1, rect2) {
        // Größere Hitbox für einfacheres Sammeln
        const padding = 10;
        return rect1.x < rect2.x + rect2.size + padding &&
               rect1.x + rect1.width + padding > rect2.x &&
               rect1.y < rect2.y + rect2.size + padding &&
               rect1.y + rect1.height + padding > rect2.y;
    }

    createCollectionEffect(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                size: 3 + Math.random() * 6,
                color: color,
                life: 1
            });
        }
    }

    draw() {
        this.ctx.save();

        // Screen Shake Effekt
        if (this.screenShake.active) {
            const now = Date.now();
            const elapsed = now - this.screenShake.startTime;
            if (elapsed < this.screenShake.duration) {
                const shakeX = (Math.random() - 0.5) * this.screenShake.intensity;
                const shakeY = (Math.random() - 0.5) * this.screenShake.intensity;
                this.ctx.translate(shakeX, shakeY);
            } else {
                this.screenShake.active = false;
            }
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Hintergrund
        this.drawBackground();

        // Blasen
        this.drawBubbles();

        // Spieler-Trails
        this.drawPlayerTrails();

        // Sammelobjekte
        this.drawCollectibles();

        // Power-Ups
        this.drawPowerUps();

        // Spieler-Fisch
        this.drawPlayerFish();

        // Partikel-Effekte
        this.drawParticles();

        // Combo-Effekte
        this.drawComboEffects();

        // Power-Up Effekte
        this.drawPowerUpEffects();

        // Farb-Overlay für Power-Ups
        if (this.colorOverlay.active) {
            const now = Date.now();
            const elapsed = now - this.colorOverlay.startTime;
            if (elapsed < this.colorOverlay.duration) {
                this.ctx.fillStyle = this.colorOverlay.color;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            } else {
                this.colorOverlay.active = false;
            }
        }

        // Combo-Anzeige
        if (this.combo.streak > 0) {
            this.drawComboMeter();
        }

        // Aktive Power-Ups Anzeige
        this.drawActivePowerUps();

        this.ctx.restore();

        // Game Over Overlay
        if (this.gameEnded) {
            this.drawGameOverScreen();
        }
    }

    drawBackground() {
        // Aquarium-Gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#4682B4');
        gradient.addColorStop(1, '#191970');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Aquarium Pflanzen (vereinfacht)
        this.ctx.strokeStyle = '#2E8B57';
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(50, this.canvas.height - 50);
        this.ctx.quadraticCurveTo(100, this.canvas.height - 150, 120, this.canvas.height - 100);
        this.ctx.stroke();

        // Steine
        this.ctx.fillStyle = '#696969';
        this.ctx.beginPath();
        this.ctx.ellipse(300, this.canvas.height - 20, 80, 20, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawBubbles() {
        this.bubbles.forEach(bubble => {
            this.ctx.save();
            this.ctx.globalAlpha = bubble.opacity;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawCollectibles() {
        this.collectibles.forEach(item => {
            if (item.collected) return;

            this.ctx.save();

            // Glow-Effekt
            this.ctx.shadowColor = item.color;
            this.ctx.shadowBlur = 10 * item.glowIntensity;

            // Emoji oder Fallback
            this.ctx.font = `${item.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.emoji, item.x, item.y);

            this.ctx.restore();
        });
    }

    drawPlayerFish() {
        this.ctx.save();

        // Spieler-Fisch (Emoji oder einfache Form)
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🐠',
            this.playerFish.x + this.playerFish.width/2,
            this.playerFish.y + this.playerFish.height/2 + 15
        );

        this.ctx.restore();
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawGameOverScreen() {
        // Overlay
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Result Text
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';

        const percentage = (this.collected / this.totalItems) * 100;
        let message, emoji;

        if (percentage >= 90) {
            message = "Großartig! Du bist ein Aquaristik-Profi!";
            emoji = "🏆";
        } else if (percentage >= 60) {
            message = "Gut gemacht! Weiter so!";
            emoji = "👍";
        } else {
            message = "Versuch's nochmal! Übung macht den Meister!";
            emoji = "💪";
        }

        this.ctx.fillText(emoji, this.canvas.width/2, this.canvas.height/2 - 60);
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(message, this.canvas.width/2, this.canvas.height/2);

        this.ctx.font = '18px Arial';
        this.ctx.fillText(`Gesammelt: ${this.collected}/${this.totalItems}`, this.canvas.width/2, this.canvas.height/2 + 40);
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 70);

        this.ctx.restore();
    }

    updateUI() {
        const scoreEl = document.getElementById('score');
        const collectedEl = document.getElementById('collected');
        const timerEl = document.getElementById('timer');

        if (scoreEl) scoreEl.textContent = this.score;
        if (collectedEl) collectedEl.textContent = this.collected;
        if (timerEl) timerEl.textContent = this.timeLeft + 's';
    }

    async endGame() {
        this.gameRunning = false;
        this.gameEnded = true;
        this.gameEndTime = Date.now();

        // Show interactive fish again
        document.body.classList.remove('game-active');

        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }

        // 🏆 Perfect Score Detection
        this.isPerfectScore = (this.collected === this.totalItems);
        const actualDuration = Math.floor((this.gameEndTime - this.gameStartTime) / 1000);
        const bonusPoints = this.highscoreManager.calculateBonusPoints(this.collected, this.gameTime, actualDuration);
        this.finalScore = this.score + bonusPoints;

        console.log(`🎯 Game ended! Collected: ${this.collected}/${this.totalItems}, Score: ${this.finalScore}, Perfect: ${this.isPerfectScore}`);

        // Ermittle Rang
        this.playerRank = await this.highscoreManager.getPlayerRank(this.finalScore);

        // Zeige Highscore-Dialog für gute Leistungen
        if (this.isPerfectScore || this.collected >= 15 || this.playerRank <= 10) {
            setTimeout(() => {
                this.showHighscoreDialog();
            }, 2000);
        }

        // Show start button wieder
        setTimeout(() => {
            const startBtn = this.container.querySelector('.game-start-btn');
            if (startBtn) {
                startBtn.style.display = 'block';
                startBtn.innerHTML = '🎮 Nochmal spielen';
            }
        }, 3000);
    }

    showHighscoreDialog() {
        // 🏆 Name-Eingabe Dialog für Highscore
        const dialogHtml = `
            <div id="highscore-dialog" class="highscore-dialog">
                <div class="highscore-dialog-content">
                    <div class="highscore-header">
                        ${this.isPerfectScore ? '🏆' : '🎯'} ${this.isPerfectScore ? 'PERFECT SCORE!' : 'GREAT SCORE!'}
                    </div>

                    <div class="score-summary">
                        <div class="score-item">
                            <span class="label">Gesammelt:</span>
                            <span class="value">${this.collected}/20 ${this.isPerfectScore ? '🌟' : ''}</span>
                        </div>
                        <div class="score-item">
                            <span class="label">Base Score:</span>
                            <span class="value">${this.score}</span>
                        </div>
                        <div class="score-item">
                            <span class="label">Bonus:</span>
                            <span class="value">+${this.finalScore - this.score}</span>
                        </div>
                        <div class="score-item total">
                            <span class="label">Final Score:</span>
                            <span class="value">${this.finalScore}</span>
                        </div>
                        <div class="rank-info">
                            Rang #${this.playerRank} 🎖️
                        </div>
                    </div>

                    <div class="name-input-section">
                        <label for="player-name">Dein Name für die Highscore-Liste:</label>
                        <input type="text" id="player-name" placeholder="Aquaristik-Profi" maxlength="30" autocomplete="name">
                        <div class="name-hint">2-30 Zeichen (A-Z, 0-9, Leerzeichen erlaubt)</div>
                    </div>

                    <div class="dialog-buttons">
                        <button id="save-highscore-btn" class="primary-btn">🏆 Highscore speichern</button>
                        <button id="skip-highscore-btn" class="secondary-btn">⏭️ Überspringen</button>
                    </div>

                    <div id="save-status" class="save-status"></div>
                </div>
            </div>
        `;

        // Dialog zum DOM hinzufügen
        document.body.insertAdjacentHTML('beforeend', dialogHtml);

        // Event Listeners
        const dialog = document.getElementById('highscore-dialog');
        const nameInput = document.getElementById('player-name');
        const saveBtn = document.getElementById('save-highscore-btn');
        const skipBtn = document.getElementById('skip-highscore-btn');
        const statusDiv = document.getElementById('save-status');

        // Focus auf Name Input
        nameInput.focus();

        // Enter-Taste für Speichern
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && nameInput.value.trim().length >= 2) {
                this.saveHighscoreEntry(nameInput.value.trim(), statusDiv, dialog);
            }
        });

        // Save Button
        saveBtn.addEventListener('click', () => {
            const playerName = nameInput.value.trim();
            if (playerName.length < 2) {
                statusDiv.innerHTML = '⚠️ Name muss mindestens 2 Zeichen lang sein';
                statusDiv.className = 'save-status error';
                return;
            }
            this.saveHighscoreEntry(playerName, statusDiv, dialog);
        });

        // Skip Button
        skipBtn.addEventListener('click', () => {
            this.closeHighscoreDialog(dialog);
        });

        // ESC zum Schließen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeHighscoreDialog(dialog);
            }
        });
    }

    async saveHighscoreEntry(playerName, statusDiv, dialog) {
        statusDiv.innerHTML = '⏳ Speichere Highscore...';
        statusDiv.className = 'save-status loading';

        const actualDuration = Math.floor((this.gameEndTime - this.gameStartTime) / 1000);

        const result = await this.highscoreManager.saveHighscore(
            playerName,
            this.score,
            this.collected,
            this.gameTime,
            actualDuration,
            this.gameNumber
        );

        if (result.success) {
            statusDiv.innerHTML = `🎉 Highscore gespeichert! Du bist Rang #${this.playerRank}`;
            statusDiv.className = 'save-status success';

            // Dialog nach kurzer Zeit schließen
            setTimeout(() => {
                this.closeHighscoreDialog(dialog);
                this.refreshHighscoreDisplay();
            }, 2000);
        } else {
            statusDiv.innerHTML = `❌ Fehler: ${result.error}`;
            statusDiv.className = 'save-status error';
        }
    }

    closeHighscoreDialog(dialog) {
        if (dialog && dialog.parentNode) {
            dialog.remove();
        }
    }

    async refreshHighscoreDisplay() {
        // Triggert das Highscore-Display Update und zeigt es an
        if (window.HighscoreDisplay) {
            await window.HighscoreDisplay.refresh();
            window.HighscoreDisplay.showAfterGameEnd();
        }
    }

    resetGame() {
        // Spiel-State zurücksetzen
        this.gameRunning = false;
        this.gameEnded = false;
        this.collected = 0;
        this.missed = 0;
        this.score = 0;
        this.timeLeft = this.difficulty.time;
        this.gameStartTime = null;
        this.gameEndTime = null;
        this.isPerfectScore = false;
        this.finalScore = 0;
        this.firstFishClicked = false;

        // Arrays leeren
        this.collectibles = [];
        this.particles = [];
        this.bubbles = [];

        // Player-Position zurücksetzen
        this.playerFish.x = 100;
        this.playerFish.y = 200;

        // UI zurücksetzen - Fisch-Summe wieder verstecken
        const itemsDisplay = document.getElementById('items-display');
        if (itemsDisplay) {
            itemsDisplay.style.display = 'none';
        }

        // Highscore-Liste verstecken
        if (window.HighscoreDisplay) {
            window.HighscoreDisplay.hideDisplay();
        }

        // UI aktualisieren
        this.updateUI();

        // Neue Items spawnen
        this.spawnInitialItems();

        console.log('🎮 Spiel wurde zurückgesetzt');
    }

    showMainMenu() {
        // Zurück zum Hauptmenü
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Game Manager für alle Instanzen
const AquariumGameManager = {
    instances: [],

    init() {
        console.log('🎮 Aquarium Game Manager initialisiert...');

        // Suche nach underwater-divider Elementen und prüfe ob sie für Games geeignet sind
        const containers = document.querySelectorAll('.underwater-divider');
        console.log(`🎮 Gefunden: ${containers.length} underwater-divider Elemente`);

        if (containers.length === 0) {
            console.warn('⚠️ Keine underwater-divider gefunden - erstelle Test-Container');
            this.createTestGameContainer();
            return;
        }

        containers.forEach((container, index) => {
            // Überprüfe ob Container geeignet ist
            if (container.offsetWidth < 300 || container.offsetHeight < 200) {
                console.log(`🎮 Container ${index + 1} zu klein - erweitere Größe`);
                container.style.minHeight = '400px';
                container.style.minWidth = '600px';
            }

            const gameNumber = index + 1;
            console.log(`🎮 Initialisiere Spiel ${gameNumber} in Container:`, container);

            try {
                const game = new AquariumCollectorGame(container, gameNumber);
                this.instances.push(game);
                this.addGameControlsOutside(container, game, gameNumber);
                console.log(`✅ Spiel ${gameNumber} erfolgreich initialisiert`);
            } catch (error) {
                console.error(`❌ Fehler bei Spiel ${gameNumber}:`, error);
            }
        });

        console.log(`🎉 ${this.instances.length} Spiele erfolgreich geladen!`);
    },

    createTestGameContainer() {
        // Fallback: Erstelle einen Test-Container für das Spiel
        const testSection = document.createElement('section');
        testSection.className = 'game-test-section';
        testSection.style.cssText = `
            margin: 40px auto;
            max-width: 800px;
            padding: 20px;
            background: linear-gradient(135deg, rgba(0, 105, 148, 0.1), rgba(78, 205, 196, 0.1));
            border-radius: 20px;
            border: 2px solid rgba(78, 205, 196, 0.3);
        `;

        const testContainer = document.createElement('div');
        testContainer.className = 'underwater-divider test-game-container';
        testContainer.style.cssText = `
            min-height: 400px;
            min-width: 600px;
            position: relative;
            background: linear-gradient(180deg, #87CEEB 0%, #4682B4 50%, #191970 100%);
            border-radius: 15px;
            overflow: hidden;
        `;

        const title = document.createElement('h3');
        title.textContent = '🎮 Aquarium Sammler-Spiel';
        title.style.cssText = 'text-align: center; color: #4ECDC4; margin-bottom: 20px;';

        testSection.appendChild(title);
        testSection.appendChild(testContainer);

        // Füge zum Body hinzu
        const mainContent = document.querySelector('main') || document.querySelector('.container') || document.body;
        mainContent.appendChild(testSection);

        // Initialisiere Spiel im Test-Container
        const game = new AquariumCollectorGame(testContainer, 1);
        this.instances.push(game);
        this.addGameControlsOutside(testContainer, game, 1);

        console.log('✅ Test-Game-Container erfolgreich erstellt und initialisiert');
    },

    addGameControlsOutside(container, game, gameNumber) {
        // Erstelle Wrapper für das gesamte Spiel + Controls
        const gameWrapper = document.createElement('div');
        gameWrapper.className = 'game-wrapper';
        gameWrapper.style.cssText = `
            margin: 20px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        `;

        // Verschiebe den Container in den Wrapper
        const parent = container.parentNode;
        parent.insertBefore(gameWrapper, container);
        gameWrapper.appendChild(container);

        // Erstelle Control-Container unterhalb des Spiels
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'game-controls-external';
        controlsContainer.style.cssText = `
            margin-top: 15px;
            display: flex;
            gap: 10px;
            justify-content: center;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 15px;
            padding: 15px;
            backdrop-filter: blur(5px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        `;

        // Erstelle die drei Buttons
        const stopGameBtn = this.createControlButton(`⏸️ Spiel ${gameNumber} stoppen`, () => this.stopGame(game));
        const stopAllBtn = this.createControlButton('⏹️ Alle Spiele stoppen', () => this.stopAllGames());
        const restartBtn = this.createControlButton(`🔄 Spiel ${gameNumber} neu starten`, () => this.restartGame(game));

        controlsContainer.appendChild(stopGameBtn);
        controlsContainer.appendChild(stopAllBtn);
        controlsContainer.appendChild(restartBtn);

        // Füge Controls zum Wrapper hinzu
        gameWrapper.appendChild(controlsContainer);
    },

    addGameControls(container, game, index) {
        // Erstelle Control-Container
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'game-controls';
        controlsContainer.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 10px;
            padding: 10px;
            backdrop-filter: blur(5px);
        `;

        // Erstelle die drei Buttons
        const stopGameBtn = this.createControlButton('⏸️ Stoppen', () => this.stopGame(game));
        const stopAllBtn = this.createControlButton('⏹️ Alle stoppen', () => this.stopAllGames());
        const restartBtn = this.createControlButton('🔄 Neustart', () => this.restartGame(game));

        controlsContainer.appendChild(stopGameBtn);
        controlsContainer.appendChild(stopAllBtn);
        controlsContainer.appendChild(restartBtn);

        // Füge Controls zum Container hinzu
        container.style.position = 'relative';
        container.appendChild(controlsContainer);
    },

    createControlButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'game-control-btn';
        button.style.cssText = `
            background: linear-gradient(45deg, var(--secondary-teal, #4ECDC4), var(--primary-blue, #006994));
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 12px rgba(78, 205, 196, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });

        button.addEventListener('click', onClick);
        return button;
    },

    stopGame(game) {
        if (game && game.gameRunning) {
            game.gameRunning = false;
            console.log('🎮 Spiel gestoppt');
        }
    },

    stopAllGames() {
        this.instances.forEach(game => {
            if (game && game.gameRunning) {
                game.gameRunning = false;
            }
        });
        console.log('🎮 Alle Spiele gestoppt');
    },

    restartGame(game) {
        if (game) {
            game.resetGame();
            console.log('🎮 Spiel neu gestartet');
        }
    }
};

// Auto-Init nach DOM Load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AquariumGameManager.init());
} else {
    AquariumGameManager.init();
}