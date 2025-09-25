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
        this.container = containerEl;
        this.gameNumber = gameNumber;
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'aquarium-game-canvas';
        this.ctx = this.canvas.getContext('2d');
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

        this.setup();
        this.initControls();
        this.spawnInitialItems();
        this.createUI();
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
                // Schwierigkeits-Multiplikator für höhere Punkte
                const points = Math.floor(item.points * this.difficulty.pointsMultiplier);
                this.score += points;

                // Zeige Fisch-Summe beim ersten gesammelten Fisch
                if (!this.firstFishClicked) {
                    this.firstFishClicked = true;
                    const itemsDisplay = document.getElementById('items-display');
                    if (itemsDisplay) {
                        itemsDisplay.style.display = 'block';
                        console.log('🐠 Fisch-Summe wird nach erstem Klick angezeigt');
                    }
                }

                // Partikel-Effekt
                this.createCollectionEffect(item.x, item.y, item.color);

                // Item entfernen
                this.collectibles.splice(index, 1);

                this.updateUI();
            }
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Hintergrund
        this.drawBackground();

        // Blasen
        this.drawBubbles();

        // Sammelobjekte
        this.drawCollectibles();

        // Spieler-Fisch
        this.drawPlayerFish();

        // Partikel-Effekte
        this.drawParticles();

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
        const containers = document.querySelectorAll('.underwater-divider');
        containers.forEach((container, index) => {
            const gameNumber = index + 1;
            const game = new AquariumCollectorGame(container, gameNumber);
            this.instances.push(game);
            this.addGameControlsOutside(container, game, gameNumber);
        });
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