/* 🐠 AQUARIUM FUTTER-SAMMLER SPIEL V5.2
   - Verschiedene Futterobjekte sammeln in 30 Sekunden
   - Realistischer Aquarium-Hintergrund
   - Lokaler Score (OHNE Supabase Aufhänger!)
   - Pädagogische Aquarium-Tipps
   - Exit-Dialog
*/

// 🎮 Einfacher lokaler Score-Manager (kein Aufhängen!)
class LocalScoreManager {
    constructor() {
        this.isConnected = false; // Immer offline
        console.log('🎮 Local Score Manager initialized (no hanging!)');
    }

    async saveHighscore(playerName, score, collectedItems, gameTime, actualDuration, gameLevel = 1) {
        console.log(`🎯 Final Score: ${score} points (${collectedItems} items collected)`);
        return true; // Immer erfolgreich, kein Aufhängen
    }

    calculateBonusPoints(collectedItems, gameTime, actualDuration) {
        // Einfache Bonus-Berechnung
        const timeBonus = Math.max(0, (gameTime - actualDuration) * 1);
        const targetItems = this.getTargetItems();
        const collectionBonus = collectedItems >= targetItems ? 20 : 0;
        return Math.round(timeBonus + collectionBonus);
    }

    getTargetItems(gameLevel = 1) {
        // Ziel für 30 Sekunden: mehr Items
        const targets = { 1: 15, 2: 18, 3: 21, 4: 24, 5: 27, 6: 30 };
        return targets[gameLevel] || 30;
    }

    async getTopHighscores(limit = 10, gameLevel = null) {
        return []; // Keine Online-Highscores mehr
    }
}

// 🎓 PÄDAGOGISCHE AQUARIUM-TIPPS (30+ Tipps für 30 Sekunden!)
const AQUARIUM_EDUCATION_TIPS = [
    "💡 Der pH-Wert sollte zwischen 6-7 liegen für die meisten Fische!",
    "🕐 Neue Fische brauchen 2 Wochen Eingewöhnung ins Aquarium!",
    "🍽️ Täglich füttern, wöchentlich Wasser wechseln!",
    "📏 Größere Aquarien verzeihen Anfängerfehler besser!",
    "🌱 Pflanzen produzieren tagsüber Sauerstoff für die Fische!",
    "⚠️ Nitrit über 0.5 mg/l kann für Fische tödlich sein!",
    "🌡️ Tropische Fische brauchen 24-26°C Wassertemperatur!",
    "🦠 Filterbakterien wandeln giftiges Ammoniak in Nitrat um!",
    "❌ Nie zu viel füttern - das verschlechtert die Wasserqualität!",
    "🏠 Verstecke und Pflanzen reduzieren Stress bei Fischen!",
    "🧪 Wassertests helfen, die Gesundheit zu überwachen!",
    "🔄 Wasserwechsel entfernt schädliche Substanzen!",
    "💨 Belüftung sorgt für genug Sauerstoff im Wasser!",
    "🐠 Verschiedene Fischarten haben unterschiedliche Bedürfnisse!",
    "📈 Langsame Temperaturänderungen sind wichtig!",
    "🌿 Lebende Pflanzen helfen bei der Wasserreinigung!",
    "⚡ Zu starke Strömung stresst manche Fische!",
    "🔍 Beobachte deine Fische täglich auf Krankheitszeichen!",
    "🌙 Fische brauchen einen Tag-Nacht-Rhythmus!",
    "💧 Weiches Wasser ist besser für viele tropische Arten!",
    "🏊 Schwimmraum ist wichtiger als Dekoration!",
    "🦐 Garnelen sind tolle Putzer für das Aquarium!",
    "🐌 Schnecken helfen beim Algenabbau!",
    "⚖️ Ein Gleichgewicht zwischen Fischen und Pflanzen ist ideal!",
    "🔬 Quarantäne für neue Fische verhindert Krankheiten!",
    "🌊 Sanfte Filterströmung simuliert natürliche Gewässer!",
    "🍃 Algen sind normal, aber nicht zu viele!",
    "💡 LED-Beleuchtung ist energiesparend und pflanzentauglich!",
    "🎣 Überfütterung ist die häufigste Anfänger-Ursache für Probleme!",
    "🏔️ Verschiedene Wasserschichten bieten verschiedenen Fischen Lebensraum!",
    "🔄 Regelmäßigkeit bei der Pflege ist der Schlüssel zum Erfolg!"
];

// 🎲 Spiel-Tipps während des Spielens anzeigen
class EducationSystem {
    constructor() {
        this.usedTips = new Set();
        this.tipInterval = null;
    }

    startTipSystem(duration = 30000) {
        // Alle 3 Sekunden einen neuen Tipp anzeigen
        this.tipInterval = setInterval(() => {
            this.showRandomTip();
        }, 3000);

        // Nach Spiel-Ende stoppen
        setTimeout(() => {
            this.stopTipSystem();
        }, duration);
    }

    showRandomTip() {
        const availableTips = AQUARIUM_EDUCATION_TIPS.filter((_, index) => !this.usedTips.has(index));

        if (availableTips.length === 0) {
            this.usedTips.clear(); // Reset wenn alle Tipps gezeigt
        }

        const randomIndex = Math.floor(Math.random() * AQUARIUM_EDUCATION_TIPS.length);

        if (!this.usedTips.has(randomIndex)) {
            this.usedTips.add(randomIndex);
            this.displayTip(AQUARIUM_EDUCATION_TIPS[randomIndex]);
        }
    }

    displayTip(tip) {
        // Tipp-Anzeige mit Animation
        const tipElement = document.createElement('div');
        tipElement.className = 'aquarium-tip';
        tipElement.innerHTML = tip;

        tipElement.style.cssText = `
            position: fixed;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 150, 255, 0.95);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            animation: tipSlideIn 0.5s ease-out forwards;
            max-width: 80%;
            text-align: center;
            border: 2px solid rgba(255, 255, 255, 0.3);
        `;

        document.body.appendChild(tipElement);

        // Nach 2.5 Sekunden entfernen
        setTimeout(() => {
            if (tipElement.parentNode) {
                tipElement.style.animation = 'tipSlideOut 0.5s ease-in forwards';
                setTimeout(() => {
                    if (tipElement.parentNode) {
                        tipElement.remove();
                    }
                }, 500);
            }
        }, 2500);
    }

    stopTipSystem() {
        if (this.tipInterval) {
            clearInterval(this.tipInterval);
            this.tipInterval = null;
        }
    }
}

// 🎮 AQUARIUM COLLECTOR GAME - VEREINFACHT UND STABIL
class AquariumCollectorGame {
    constructor(containerId, gameNumber = 1) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.gameNumber = gameNumber;

        // Vereinfachtes System ohne Supabase-Aufhänger
        this.highscoreManager = new LocalScoreManager();
        this.educationSystem = new EducationSystem();

        // Game state
        this.gameActive = false;
        this.gameStarted = false;
        this.gamePaused = false;
        this.items = [];
        this.collected = 0;
        this.score = 0;
        this.gameStartTime = null;
        this.gameEndTime = null;

        // Neue 30-Sekunden Konfiguration
        this.difficulty = this.getDifficulty(gameNumber);
        this.gameTime = this.difficulty.time; // Jetzt 30 Sekunden!
        this.timeLeft = this.gameTime;

        // Canvas und Kontext
        this.canvas = null;
        this.ctx = null;

        // Timer
        this.gameTimer = null;
        this.itemSpawnTimer = null;

        // ⚡ PERFORMANCE: Frame rate control
        this.lastFrameTime = 0;
        this.frameRate = 60;
        this.frameDelay = 1000 / this.frameRate;
        this.animationFrameId = null;

        // 🎮 POWER-UPS State
        this.activePowerUps = new Map();

        this.setup();
    }

    // 🚀 NEUE 30-SEKUNDEN KONFIGURATION MIT MEHR ITEMS
    getDifficulty(gameNumber) {
        const difficulties = [
            { level: 1, items: 21, time: 30, speedMultiplier: 0.8, pointsMultiplier: 1.0, badItems: 3, itemLifetime: 5000 },
            { level: 2, items: 24, time: 30, speedMultiplier: 1.0, pointsMultiplier: 1.5, badItems: 4, itemLifetime: 4500 },
            { level: 3, items: 27, time: 30, speedMultiplier: 1.2, pointsMultiplier: 2.0, badItems: 5, itemLifetime: 4000 },
            { level: 4, items: 30, time: 30, speedMultiplier: 1.4, pointsMultiplier: 2.5, badItems: 6, itemLifetime: 3500 },
            { level: 5, items: 33, time: 30, speedMultiplier: 1.6, pointsMultiplier: 3.0, badItems: 7, itemLifetime: 3000 },
            { level: 6, items: 36, time: 30, speedMultiplier: 1.8, pointsMultiplier: 4.0, badItems: 8, itemLifetime: 2500 }
        ];

        // Schwierigkeit basierend auf Spielnummer
        const index = Math.min(gameNumber - 1, difficulties.length - 1);
        return difficulties[index];
    }

    setup() {
        this.createGameUI();
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Blasen-Animation für Hintergrund
        this.bubbles = [];
        for (let i = 0; i < 8; i++) {
            this.bubbles.push({
                x: Math.random() * (this.container.offsetWidth || 400),
                y: (this.container.offsetHeight || 300) + Math.random() * 100,
                radius: 3 + Math.random() * 8,
                speed: 0.5 + Math.random() * 1.5,
                opacity: 0.3 + Math.random() * 0.4
            });
        }
    }

    createGameUI() {
        this.container.innerHTML = `
            <div class="aquarium-game-container">
                <div class="game-header">
                    <h3>🐠 Aquarium Futter-Sammler</h3>
                    <p>Sammle in 30 Sekunden so viele Futter-Items wie möglich!</p>
                </div>
                <div class="game-stats">
                    <div class="score-display">Score: <span id="score-${this.containerId}">0</span></div>
                    <div class="items-display">Items: <span id="items-${this.containerId}">0</span>/${this.difficulty.items}</div>
                    <div class="timer-display">Zeit: <span id="timer-${this.containerId}">${this.timeLeft}s</span></div>
                </div>
                <div class="game-canvas-container">
                    <canvas id="game-canvas-${this.containerId}" class="aquarium-game-canvas"></canvas>
                    <div class="game-start-overlay" id="start-overlay-${this.containerId}">
                        <button class="game-start-btn" onclick="window.aquariumGame${this.gameNumber || ''}.startGame()">
                            🎮 Spiel Starten
                        </button>
                        <button class="game-pause-btn" id="pause-btn-${this.containerId}" onclick="window.aquariumGame${this.gameNumber || ''}.togglePause()" style="display:none;">
                            ⏸️ Pause
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Canvas Setup
        this.canvas = document.getElementById(`game-canvas-${this.containerId}`);
        this.ctx = this.canvas.getContext('2d');

        // ⚡ PERFORMANCE: Cache DOM references
        this.scoreElement = document.getElementById(`score-${this.containerId}`);
        this.itemsElement = document.getElementById(`items-${this.containerId}`);
        this.timerElement = document.getElementById(`timer-${this.containerId}`);
        this.overlayElement = document.getElementById(`start-overlay-${this.containerId}`);
        this.pauseButton = document.getElementById(`pause-btn-${this.containerId}`);

        // Global Game Referenz für Button
        if (this.gameNumber) {
            window[`aquariumGame${this.gameNumber}`] = this;
        } else {
            window.aquariumGame = this;
        }

        // Click Handler für Item-Sammlung
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    }

    resize() {
        if (!this.canvas || !this.container) return;

        const rect = this.container.getBoundingClientRect();
        const width = Math.max(400, rect.width - 40);
        const height = Math.max(300, 400);

        this.canvas.width = width;
        this.canvas.style.width = width + 'px';
        this.canvas.height = height;
        this.canvas.style.height = height + 'px';
    }

    startGame() {
        if (this.gameActive) return;

        console.log('🎮 Starting Aquarium Game with 30 seconds!');

        // 🎮 GAME BALANCER INTEGRATION - Get adaptive difficulty
        if (window.gameBalancerAPI) {
            const adaptiveDifficulty = window.gameBalancerAPI.gameStart('collector');
            if (adaptiveDifficulty && adaptiveDifficulty.adjustments) {
                console.log('🎯 Applying adaptive difficulty:', adaptiveDifficulty);
                // Apply adaptive adjustments to existing difficulty
                if (adaptiveDifficulty.adjustments.timeLimit) {
                    this.gameTime = adaptiveDifficulty.adjustments.timeLimit;
                }
                if (adaptiveDifficulty.adjustments.itemCount) {
                    this.difficulty.items = adaptiveDifficulty.adjustments.itemCount;
                }
            }
        }

        // Game State Reset
        this.gameActive = true;
        this.gameStarted = true;
        this.collected = 0;
        this.score = 0;
        this.items = [];
        this.timeLeft = this.gameTime; // Possibly adjusted by balancer!
        this.gameStartTime = Date.now();
        this.gameEndTime = null;

        // UI Hide/Show
        if (this.overlayElement) this.overlayElement.style.display = 'none';
        if (this.pauseButton) this.pauseButton.style.display = 'inline-block';

        // Update Displays
        this.updateDisplay();

        // 🎓 Starte Bildungs-Tipps System
        this.educationSystem.startTipSystem(this.gameTime * 1000);

        // Timer starten
        this.startTimer();

        // Items spawnen
        this.startItemSpawning();

        // Render-Loop
        this.render();
    }

    startItemSpawning() {
        // Spawn-Rate für 30 Sekunden angepasst
        const spawnInterval = Math.max(800, 3000 / this.difficulty.speedMultiplier);

        this.itemSpawnTimer = setInterval(() => {
            if (this.gameActive && this.items.length < 12) {
                this.spawnItem();
            }
        }, spawnInterval);
    }

    spawnItem() {
        const item = {
            id: Math.random().toString(36).substr(2, 9),
            x: Math.random() * (this.canvas.width - 40) + 20,
            y: -30,
            vx: (Math.random() - 0.5) * 2,
            vy: 1 + Math.random() * 2,
            type: this.getRandomItemType(),
            size: 20 + Math.random() * 15,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            lifetime: Date.now() + this.difficulty.itemLifetime,
            collected: false
        };

        this.items.push(item);
    }

    getRandomItemType() {
        const random = Math.random();

        // 🎮 POWER-UPS (5% chance)
        if (random < 0.05) {
            const powerUps = [
                { emoji: '⚡', type: 'speed_boost', points: 20, duration: 5000, description: 'Speed Boost!' },
                { emoji: '🧲', type: 'magnet', points: 15, duration: 8000, description: 'Magnet Power!' },
                { emoji: '🌟', type: 'double_points', points: 0, duration: 10000, description: '2x Points!' },
                { emoji: '⏰', type: 'time_freeze', points: 0, duration: 3000, description: 'Time Freeze!' }
            ];
            const powerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
            return {
                ...powerUp,
                good: true,
                isPowerUp: true
            };
        }

        const goodItems = ['🦐', '🐛', '🌱', '🟢', '🔵', '⭐', '🐠', '🐟', '🦀', '🦑'];
        const badItems = ['💀', '🗑️', '⚠️', '☠️'];

        // 80% gute Items, 15% bad items, 5% power-ups (above)
        if (random < 0.85) {
            return {
                emoji: goodItems[Math.floor(Math.random() * goodItems.length)],
                points: 5 + Math.floor(Math.random() * 10),
                good: true
            };
        } else {
            return {
                emoji: badItems[Math.floor(Math.random() * badItems.length)],
                points: -5,
                good: false
            };
        }
    }

    handleCanvasClick(e) {
        if (!this.gameActive) return;

        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Check for item collision
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            const distance = Math.sqrt((clickX - item.x)**2 + (clickY - item.y)**2);

            if (distance < item.size && !item.collected) {
                this.collectItem(item, i);
                break;
            }
        }
    }

    collectItem(item, index) {
        item.collected = true;
        this.items.splice(index, 1);

        this.collected++;

        // 🎮 POWER-UP ACTIVATION
        if (item.type.isPowerUp) {
            this.activatePowerUp(item.type);
        }

        // Calculate points with double_points multiplier
        const pointsMultiplier = this.activePowerUps.has('double_points') ? 2 : 1;
        this.score += Math.round(item.type.points * this.difficulty.pointsMultiplier * pointsMultiplier);

        // 🔊 VERBESSERUNG #2: Sound-Feedback bei Collect
        if (window.aquariumSounds) {
            if (item.type.good) {
                window.aquariumSounds.playCollect();
            } else {
                window.aquariumSounds.playError();
            }
        }

        // 📱 VERBESSERUNG #2: Haptic-Feedback bei Collect
        if (window.aquariumHaptics) {
            if (item.type.good) {
                window.aquariumHaptics.collect();
            } else {
                window.aquariumHaptics.error();
            }
        }

        // 🎨 AAA VISUAL EFFECTS: Advanced particle explosion on collection
        if (window.visualEffectsEngine) {
            const intensity = item.type.good ? 1.5 : 0.8;
            const canvasRect = this.canvas.getBoundingClientRect();
            const worldX = canvasRect.left + item.x;
            const worldY = canvasRect.top + item.y;

            // Create particle explosion at collection point
            window.visualEffectsEngine.createExplosion(worldX, worldY, intensity);

            // Add glow effect to score display for good items
            if (item.type.good) {
                const scoreElement = document.querySelector(`#score-display-${this.containerId}`) ||
                                   document.querySelector('.score-display');
                if (scoreElement) {
                    window.visualEffectsEngine.addGlowEffect(scoreElement, '#4ECDC4');
                }
            }

            // Screen shake for high-value items
            if (item.type.points >= 20) {
                window.visualEffectsEngine.startScreenShake(0.5, 200);
            }
        }

        // Visual Feedback (Enhanced)
        this.showCollectionEffect(item.x, item.y, item.type.points > 0);

        this.updateDisplay();

        // Perfect Score Check
        if (this.collected >= this.difficulty.items) {
            setTimeout(() => this.endGame(), 500);
        }
    }

    activatePowerUp(powerUpType) {
        const { type, duration, description } = powerUpType;

        // Add to active power-ups
        this.activePowerUps.set(type, {
            endTime: Date.now() + duration,
            description
        });

        // Show power-up notification
        this.showPowerUpNotification(powerUpType);

        // Apply immediate effects
        switch(type) {
            case 'speed_boost':
                // Items fall faster temporarily
                this.items.forEach(item => {
                    if (!item.isEffect) {
                        item.vy *= 1.5;
                    }
                });
                break;

            case 'magnet':
                // Auto-collect nearby items
                this.startMagnetEffect();
                break;

            case 'time_freeze':
                // Pause game timer
                this.timeFreeze = true;
                setTimeout(() => {
                    this.timeFreeze = false;
                }, duration);
                break;

            case 'double_points':
                // Points multiplier (handled in collectItem)
                break;
        }

        // Auto-remove after duration
        setTimeout(() => {
            this.activePowerUps.delete(type);
            this.hidePowerUpNotification(type);
        }, duration);

        console.log(`🎮 Power-Up activated: ${type}`);
    }

    showPowerUpNotification(powerUpType) {
        const notification = document.createElement('div');
        notification.className = 'power-up-notification';
        notification.dataset.powerUpType = powerUpType.type;
        notification.style.cssText = `
            position: fixed;
            top: 150px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(255, 165, 0, 0.5);
            animation: powerUpAppear 0.5s ease-out;
        `;
        notification.innerHTML = `${powerUpType.emoji} ${powerUpType.description}`;
        document.body.appendChild(notification);
    }

    hidePowerUpNotification(type) {
        const notification = document.querySelector(`.power-up-notification[data-power-up-type="${type}"]`);
        if (notification) {
            notification.style.animation = 'powerUpDisappear 0.5s ease-in forwards';
            setTimeout(() => notification.remove(), 500);
        }
    }

    startMagnetEffect() {
        const magnetInterval = setInterval(() => {
            if (!this.activePowerUps.has('magnet')) {
                clearInterval(magnetInterval);
                return;
            }

            // Auto-collect items within range
            this.items.forEach((item, index) => {
                if (!item.isEffect && !item.collected) {
                    const distance = Math.sqrt(
                        Math.pow(item.x - this.canvas.width / 2, 2) +
                        Math.pow(item.y - this.canvas.height / 2, 2)
                    );

                    if (distance < 200) {
                        this.collectItem(item, index);
                    }
                }
            });
        }, 100);
    }

    showCollectionEffect(x, y, isGood) {
        // Einfacher Partikel-Effekt
        const effect = {
            x: x,
            y: y,
            particles: [],
            duration: 500,
            startTime: Date.now()
        };

        // Partikel erstellen
        for (let i = 0; i < 6; i++) {
            effect.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1.0,
                color: isGood ? '#00ff88' : '#ff4444'
            });
        }

        // Temporär zu Items hinzufügen für Rendering
        this.items.push({ isEffect: true, effect: effect });
    }

    updateDisplay() {
        // ⚡ PERFORMANCE: Use cached DOM references
        if (this.scoreElement) this.scoreElement.textContent = this.score;
        if (this.itemsElement) this.itemsElement.textContent = `${this.collected}/${this.difficulty.items}`;
        if (this.timerElement) this.timerElement.textContent = this.timeLeft + 's';
    }

    render(currentTime = 0) {
        if (!this.gameActive) {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            return;
        }

        // ⚡ PERFORMANCE: Frame rate limiting (60 FPS)
        const deltaTime = currentTime - this.lastFrameTime;

        if (deltaTime >= this.frameDelay) {
            this.lastFrameTime = currentTime - (deltaTime % this.frameDelay);

            // Skip rendering if paused, but keep loop alive
            if (!this.gamePaused) {
                // Clear canvas
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                // Aquarium Background
                this.renderBackground();

                // Render Items
                this.renderItems();

                // Render Bubbles
                this.renderBubbles();
            }
        }

        // Continue render loop
        this.animationFrameId = requestAnimationFrame((time) => this.render(time));
    }

    renderBackground() {
        // Aquarium-Hintergrund
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#4da6ff');
        gradient.addColorStop(0.5, '#0066cc');
        gradient.addColorStop(1, '#003d7a');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Boden
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.canvas.height - 30, this.canvas.width, 30);
    }

    renderItems() {
        const now = Date.now();

        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];

            // Handle Effect Items
            if (item.isEffect) {
                this.renderEffect(item.effect);
                if (now - item.effect.startTime > item.effect.duration) {
                    this.items.splice(i, 1);
                }
                continue;
            }

            // Move item
            item.x += item.vx;
            item.y += item.vy;
            item.rotation += item.rotationSpeed;

            // Remove if out of bounds or expired
            if (item.y > this.canvas.height + 50 || now > item.lifetime) {
                this.items.splice(i, 1);
                continue;
            }

            // Render item
            this.ctx.save();
            this.ctx.translate(item.x, item.y);
            this.ctx.rotate(item.rotation);
            this.ctx.font = `${item.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(item.type.emoji, 0, 0);
            this.ctx.restore();
        }
    }

    renderEffect(effect) {
        const elapsed = Date.now() - effect.startTime;
        const progress = elapsed / effect.duration;

        for (const particle of effect.particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life = 1.0 - progress;

            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    renderBubbles() {
        for (const bubble of this.bubbles) {
            bubble.y -= bubble.speed;

            if (bubble.y < -bubble.radius) {
                bubble.y = this.canvas.height + bubble.radius;
                bubble.x = Math.random() * this.canvas.width;
            }

            this.ctx.save();
            this.ctx.globalAlpha = bubble.opacity;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    endGame() {
        if (!this.gameActive) return;

        this.gameActive = false;
        this.gameEndTime = Date.now();

        // Stop all timers
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }

        if (this.itemSpawnTimer) {
            clearInterval(this.itemSpawnTimer);
            this.itemSpawnTimer = null;
        }

        // Stop education system
        this.educationSystem.stopTipSystem();

        // Calculate final results
        const actualDuration = (this.gameEndTime - this.gameStartTime) / 1000;
        const bonusPoints = this.highscoreManager.calculateBonusPoints(this.collected, this.gameTime, actualDuration);
        const finalScore = this.score + bonusPoints;
        const isPerfectScore = this.collected >= this.difficulty.items;

        // Show results
        this.showResults({
            score: finalScore,
            collected: this.collected,
            target: this.difficulty.items,
            duration: actualDuration,
            bonusPoints: bonusPoints,
            isPerfect: isPerfectScore
        });

        // 🎮 GAME BALANCER INTEGRATION - Report game results
        if (window.gameBalancerAPI) {
            const gameResult = {
                won: isPerfectScore || this.collected >= this.difficulty.items * 0.7, // 70% completion = win
                score: finalScore,
                time: actualDuration,
                accuracy: (this.collected / this.difficulty.items) * 100,
                perfect: isPerfectScore,
                collected: this.collected,
                target: this.difficulty.items
            };
            window.gameBalancerAPI.gameEnd('collector', gameResult);

            // Update daily challenges
            window.gameBalancerAPI.updateChallenge('daily', 'daily_collector', 1);
        }

        // Local save (no hanging!)
        this.highscoreManager.saveHighscore('Player', finalScore, this.collected, this.gameTime, actualDuration, this.gameNumber);
    }

    showResults(results) {
        // 🔊 VERBESSERUNG #5: Sound für Game-Over
        if (window.aquariumSounds) {
            if (results.isPerfect) {
                window.aquariumSounds.playWin();
            } else if (results.collected >= results.target * 0.7) {
                window.aquariumSounds.playSuccess();
            } else {
                window.aquariumSounds.playLose();
            }
        }

        // 📱 VERBESSERUNG #5: Haptic für Game-Over
        if (window.aquariumHaptics) {
            if (results.isPerfect) {
                window.aquariumHaptics.perfect();
            } else if (results.collected >= results.target * 0.7) {
                window.aquariumHaptics.achievement();
            } else {
                window.aquariumHaptics.lose();
            }
        }

        // VERBESSERUNG #5: Enhanced Results mit Animation und Highscore
        const gradeEmoji = this.getGradeEmoji(results);
        const gradeText = this.getGradeText(results);
        const performanceColor = this.getPerformanceColor(results);

        const resultHTML = `
            <div class="game-results enhanced-results">
                <div class="result-header">
                    <div class="grade-circle" style="border-color: ${performanceColor}; color: ${performanceColor};">
                        <div class="grade-emoji">${gradeEmoji}</div>
                        <div class="grade-text">${gradeText}</div>
                    </div>
                    <h3 class="result-title">${results.isPerfect ? '🏆 PERFEKTE SAMMLUNG!' : '🎯 Spiel Beendet!'}</h3>
                </div>

                <div class="result-stats animated-stats">
                    <div class="stat-item">
                        <span class="stat-label">Final Score:</span>
                        <span class="stat-value highlight" data-target="${results.score}">0</span>
                        <span class="stat-unit">Punkte</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Items gesammelt:</span>
                        <span class="stat-value">${results.collected}/${results.target}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Zeit:</span>
                        <span class="stat-value">${results.duration.toFixed(1)}s von 30s</span>
                    </div>
                    ${results.bonusPoints > 0 ? `
                    <div class="stat-item bonus">
                        <span class="stat-label">Zeitbonus:</span>
                        <span class="stat-value">+${results.bonusPoints}</span>
                        <span class="stat-unit">Punkte</span>
                    </div>` : ''}
                </div>

                ${this.generateHighscoreDisplay(results)}

                <div class="result-actions">
                    <button onclick="window.aquariumGame${this.gameNumber || ''}.restartGame()" class="replay-btn">
                        🎮 Nochmal spielen
                    </button>
                    <button onclick="this.closest('.game-result-overlay').remove()" class="close-btn">
                        ❌ Schließen
                    </button>
                    ${results.isPerfect ? '<button onclick="this.shareScore()" class="share-btn">📱 Teilen</button>' : ''}
                </div>
            </div>
        `;

        // Enhanced result overlay with animation
        const overlay = document.createElement('div');
        overlay.className = 'game-result-overlay enhanced-overlay';
        overlay.innerHTML = resultHTML;
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0, 105, 148, 0.9), rgba(78, 205, 196, 0.9));
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            backdrop-filter: blur(10px);
            animation: resultFadeIn 0.5s ease-out forwards;
        `;

        this.container.style.position = 'relative';
        this.container.appendChild(overlay);

        // Animate score counting
        setTimeout(() => this.animateScoreCounting(overlay, results.score), 800);
    }

    getGradeEmoji(results) {
        const percentage = (results.collected / results.target) * 100;
        if (percentage >= 100) return '🏆';
        if (percentage >= 90) return '⭐';
        if (percentage >= 80) return '🎯';
        if (percentage >= 70) return '👍';
        if (percentage >= 50) return '📈';
        return '🤔';
    }

    getGradeText(results) {
        const percentage = (results.collected / results.target) * 100;
        if (percentage >= 100) return 'PERFEKT';
        if (percentage >= 90) return 'SEHR GUT';
        if (percentage >= 80) return 'GUT';
        if (percentage >= 70) return 'OKAY';
        if (percentage >= 50) return 'VERBESSERUNG';
        return 'VERSUCH\'S NOCHMAL';
    }

    getPerformanceColor(results) {
        const percentage = (results.collected / results.target) * 100;
        if (percentage >= 100) return '#FFD700';
        if (percentage >= 90) return '#00FF88';
        if (percentage >= 80) return '#4ECDC4';
        if (percentage >= 70) return '#FFA500';
        if (percentage >= 50) return '#FF6B6B';
        return '#FF4444';
    }

    generateHighscoreDisplay(results) {
        const localHighscores = this.getLocalHighscores();
        const isNewRecord = results.score > (localHighscores[0]?.score || 0);

        if (isNewRecord) {
            this.saveLocalHighscore(results);
        }

        return `
            <div class="highscore-section">
                <h4>🏆 Top Scores (Lokal)</h4>
                <div class="highscore-list">
                    ${localHighscores.slice(0, 3).map((score, index) => `
                        <div class="highscore-item ${score.score === results.score ? 'current-score' : ''}">
                            <span class="rank">#${index + 1}</span>
                            <span class="score">${score.score}</span>
                            <span class="items">${score.items}/${score.target}</span>
                            ${score.score === results.score ? '<span class="new-badge">NEU!</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getLocalHighscores() {
        const key = `aquarium-highscores-${this.gameNumber || 1}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    saveLocalHighscore(results) {
        const key = `aquarium-highscores-${this.gameNumber || 1}`;
        const highscores = this.getLocalHighscores();

        highscores.push({
            score: results.score,
            items: results.collected,
            target: results.target,
            date: new Date().toLocaleDateString('de-DE')
        });

        highscores.sort((a, b) => b.score - a.score);
        highscores.splice(10); // Keep only top 10

        localStorage.setItem(key, JSON.stringify(highscores));
    }

    animateScoreCounting(overlay, targetScore) {
        const scoreElement = overlay.querySelector('.stat-value.highlight');
        if (!scoreElement) return;

        let currentScore = 0;
        const increment = Math.max(1, Math.ceil(targetScore / 50));
        const timer = setInterval(() => {
            currentScore += increment;
            if (currentScore >= targetScore) {
                currentScore = targetScore;
                clearInterval(timer);

                // Flash effect on completion
                scoreElement.style.animation = 'scoreFlash 0.5s ease-out';
            }
            scoreElement.textContent = currentScore;
        }, 20);
    }

    togglePause() {
        if (!this.gameActive || !this.gameStarted) return;

        this.gamePaused = !this.gamePaused;

        if (this.gamePaused) {
            // Pause timers
            if (this.gameTimer) {
                clearInterval(this.gameTimer);
                this.gameTimer = null;
            }
            if (this.itemSpawnTimer) {
                clearInterval(this.itemSpawnTimer);
                this.itemSpawnTimer = null;
            }

            // Update button
            if (this.pauseButton) {
                this.pauseButton.textContent = '▶️ Resume';
            }

            // Show pause overlay
            const pauseOverlay = document.createElement('div');
            pauseOverlay.className = 'game-pause-overlay';
            pauseOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 100;
                font-size: 48px;
                color: white;
                font-weight: bold;
                backdrop-filter: blur(5px);
            `;
            pauseOverlay.textContent = '⏸️ PAUSE';
            this.container.querySelector('.game-canvas-container').appendChild(pauseOverlay);

            console.log('⏸️ Game paused');
        } else {
            // Resume game
            this.startTimer();
            this.startItemSpawning();

            // Update button
            if (this.pauseButton) {
                this.pauseButton.textContent = '⏸️ Pause';
            }

            // Remove pause overlay
            const pauseOverlay = this.container.querySelector('.game-pause-overlay');
            if (pauseOverlay) pauseOverlay.remove();

            console.log('▶️ Game resumed');
        }
    }

    startTimer() {
        // Timer starten
        this.gameTimer = setInterval(() => {
            // 🎮 POWER-UP: Time Freeze
            if (!this.timeFreeze) {
                this.timeLeft--;
                this.updateDisplay();

                if (this.timeLeft <= 0) {
                    this.endGame();
                }
            }
        }, 1000);
    }

    restartGame() {
        // Clean up current game
        const overlay = this.container.querySelector('.game-result-overlay');
        if (overlay) overlay.remove();

        // Reset game state
        this.gameActive = false;
        this.gameStarted = false;
        this.gamePaused = false;
        this.items = [];
        this.collected = 0;
        this.score = 0;
        this.timeLeft = this.gameTime;

        // Recreate UI and show start overlay
        this.createGameUI();
        this.resize();
    }
}

// CSS für Tipps-Animation
const tipStyles = `
    @keyframes tipSlideIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes tipSlideOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }

    .perfect-score {
        color: #00ff88;
        font-weight: bold;
        font-size: 1.2em;
        text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
    }

    /* 🎨 VERBESSERUNG #5: Enhanced Game Results Animations */
    @keyframes resultFadeIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes scoreFlash {
        0%, 100% { transform: scale(1); color: inherit; }
        50% { transform: scale(1.2); color: #FFD700; text-shadow: 0 0 10px #FFD700; }
    }

    @keyframes gradeCirclePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }

    .enhanced-results {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(232, 244, 248, 0.95));
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        border: 2px solid rgba(78, 205, 196, 0.3);
        backdrop-filter: blur(10px);
    }

    .result-header {
        margin-bottom: 30px;
    }

    .grade-circle {
        width: 80px;
        height: 80px;
        border: 4px solid;
        border-radius: 50%;
        margin: 0 auto 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        animation: gradeCirclePulse 2s ease-in-out infinite;
    }

    .grade-emoji {
        font-size: 32px;
        line-height: 1;
    }

    .grade-text {
        font-size: 12px;
        font-weight: bold;
        margin-top: 5px;
    }

    .result-title {
        margin: 0;
        font-size: 24px;
        color: var(--primary-blue);
    }

    .animated-stats {
        margin: 30px 0;
    }

    .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 15px 0;
        padding: 10px;
        background: rgba(78, 205, 196, 0.1);
        border-radius: 8px;
    }

    .stat-item.bonus {
        background: rgba(255, 215, 0, 0.2);
        border-left: 4px solid #FFD700;
    }

    .stat-label {
        font-weight: bold;
        color: var(--primary-blue);
    }

    .stat-value {
        font-size: 18px;
        font-weight: bold;
        color: var(--accent-coral);
    }

    .stat-value.highlight {
        color: #FFD700;
        text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
    }

    .highscore-section {
        margin: 30px 0;
        padding: 20px;
        background: rgba(0, 105, 148, 0.1);
        border-radius: 12px;
    }

    .highscore-section h4 {
        margin: 0 0 15px 0;
        color: var(--primary-blue);
    }

    .highscore-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .highscore-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 6px;
        font-size: 14px;
    }

    .highscore-item.current-score {
        background: rgba(255, 215, 0, 0.3);
        border: 2px solid #FFD700;
        animation: scoreFlash 2s ease-in-out infinite;
    }

    .new-badge {
        background: #FF6B6B;
        color: white;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: bold;
    }

    .rank {
        font-weight: bold;
        color: var(--primary-blue);
        min-width: 30px;
    }

    .game-results {
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 400px;
    }

    .result-stats p {
        margin: 10px 0;
        font-size: 16px;
    }

    .result-actions {
        margin-top: 20px;
    }

    .replay-btn, .close-btn {
        margin: 5px;
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        font-weight: bold;
    }

    .replay-btn {
        background: #4CAF50;
        color: white;
    }

    .close-btn {
        background: #f44336;
        color: white;
    }
`;

// CSS einbetten
if (!document.getElementById('aquarium-game-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'aquarium-game-styles';
    styleSheet.textContent = tipStyles;
    document.head.appendChild(styleSheet);
}

// 🏆 Game als global verfügbar machen
window.AquariumCollectorGame = AquariumCollectorGame;
window.LocalScoreManager = LocalScoreManager; // Fallback ohne Supabase

console.log('🎮 Aquarium Collector Game V5.2 loaded - 30 seconds, educational tips, no hanging!');