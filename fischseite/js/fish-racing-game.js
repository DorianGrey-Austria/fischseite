/* 🏁 FISH RACING GAME - Horse Racing Style mit Aquarium Fischen
   - 4 Fische treten gegeneinander an
   - 30 Sekunden Rennzeit mit Echtzeit-Rennen
   - Click-to-Boost für Player Fish
   - Sound & Haptic Integration
   - Betting System mit Punkten
*/

class FishRacingGame {
    constructor(canvasId) {
        this.gameContainer = null;
        this.isGameActive = false;
        this.raceInProgress = false;
        this.racePaused = false;
        this.gameTime = 30; // 30 seconds race
        this.timeRemaining = this.gameTime;
        this.raceDistance = 800; // pixels
        this.playerScore = 100; // Starting betting points
        this.selectedFish = null;

        // ⚡ PERFORMANCE: Race update control
        this.raceIntervalId = null;
        this.lastRaceUpdateTime = 0;

        // 🎮 TURBO METER SYSTEM - Makes racing interactive!
        this.turboEnergy = 100;
        this.maxTurboEnergy = 100;
        this.turboRechargeRate = 3; // per second
        this.turboConsumptionPerBoost = 20;

        // 🎁 TRACK POWER-UPS - Random power-ups on track!
        this.trackPowerUps = [];
        this.trackObstacles = [];

        // 🔥 VERBESSERUNG #3 & #5: Enhanced tracking for particle effects and stats
        this.raceStats = {
            startTime: null,
            endTime: null,
            winner: null,
            finalPositions: [],
            totalBoosts: 0,
            playerBoosts: 0,
            maxSpeed: 0,
            raceEvents: []
        };

        // 🔥 VERBESSERUNG #4: Crowd cheering system
        this.crowdCheerInterval = null;
        this.lastCheerTime = 0;

        this.raceFish = [
            {
                id: 'nemo',
                name: 'Nemo',
                emoji: '🐠',
                baseSpeed: 2.5,
                position: 0,
                lane: 1,
                boost: 0,
                color: '#FF6B35'
            },
            {
                id: 'dory',
                name: 'Dory',
                emoji: '🐟',
                baseSpeed: 2.8,
                position: 0,
                lane: 2,
                boost: 0,
                color: '#0077BE'
            },
            {
                id: 'bruce',
                name: 'Bruce',
                emoji: '🦈',
                baseSpeed: 3.2,
                position: 0,
                lane: 3,
                boost: 0,
                color: '#686868'
            },
            {
                id: 'flounder',
                name: 'Flounder',
                emoji: '🐡',
                baseSpeed: 2.2,
                position: 0,
                lane: 4,
                boost: 0,
                color: '#FFD700'
            },
            {
                id: 'marlin',
                name: 'Marlin',
                emoji: '🐬',
                baseSpeed: 3.0,
                position: 0,
                lane: 5,
                boost: 0,
                color: '#4A90E2'
            },
            {
                id: 'crush',
                name: 'Crush',
                emoji: '🐢',
                baseSpeed: 2.0,
                position: 0,
                lane: 6,
                boost: 0,
                color: '#7CB342'
            },
            {
                id: 'octopus',
                name: 'Octavia',
                emoji: '🐙',
                baseSpeed: 2.6,
                position: 0,
                lane: 7,
                boost: 0,
                color: '#9C27B0'
            },
            {
                id: 'squid',
                name: 'Squidy',
                emoji: '🦑',
                baseSpeed: 2.9,
                position: 0,
                lane: 8,
                boost: 0,
                color: '#E91E63'
            }
        ];

        this.canvasId = canvasId || 'fish-racing-canvas';
        console.log('🏁 Fish Racing Game initialized');
    }

    createGameHTML() {
        return `
            <div id="fish-racing-container" class="game-container" style="display: none;">
                <div class="game-header">
                    <h3>🏁 Fisch-Rennen</h3>
                    <div class="race-stats">
                        <div>⏱️ Zeit: <span id="race-timer">${this.gameTime}</span>s</div>
                        <div>💰 Punkte: <span id="race-score">${this.playerScore}</span></div>
                        <div id="race-status">🎯 Wähle deinen Favoriten!</div>
                        <div id="turbo-meter-container" style="display:none;">
                            🚀 Turbo:
                            <div style="display:inline-block; width:100px; height:16px; background:rgba(255,255,255,0.3); border-radius:8px; vertical-align:middle; position:relative; overflow:hidden;">
                                <div id="turbo-meter-fill" style="height:100%; background:linear-gradient(90deg, #FFD700, #FF6B35); width:100%; transition:width 0.1s;"></div>
                            </div>
                            <span id="turbo-meter-value">100</span>%
                        </div>
                        <button id="race-pause-btn" class="game-btn" style="display:none;" onclick="window.fishRacingGame.toggleRacePause()">⏸️ Pause</button>
                    </div>
                </div>

                <div class="betting-section" id="betting-section">
                    <h4>💰 Setze auf deinen Favoriten:</h4>
                    <div class="fish-selection">
                        ${this.raceFish.map(fish => `
                            <button class="fish-bet-btn" data-fish="${fish.id}">
                                <span class="fish-emoji">${fish.emoji}</span>
                                <div class="fish-name">${fish.name}</div>
                                <div class="fish-odds">3:1</div>
                            </button>
                        `).join('')}
                    </div>
                    <div class="bet-amount">
                        <label>Einsatz: </label>
                        <input type="range" id="bet-slider" min="10" max="50" value="20" step="5">
                        <span id="bet-amount">20</span> Punkte
                    </div>
                    <button id="start-race-btn" class="game-btn" disabled>🏁 Rennen starten!</button>
                </div>

                <div class="race-track" id="race-track" style="display: none;">
                    <div class="finish-line">🏁</div>
                    ${this.raceFish.map(fish => `
                        <div class="race-lane" data-lane="${fish.lane}">
                            <div class="lane-number">${fish.lane}</div>
                            <div class="race-fish" id="fish-${fish.id}" data-fish="${fish.id}">
                                <span class="fish-emoji">${fish.emoji}</span>
                                <div class="fish-trail"></div>
                            </div>
                            <div class="lane-name">${fish.name}</div>
                        </div>
                    `).join('')}
                    <div class="boost-hint" id="boost-hint">
                        💡 Klicke deinen Fisch für Boost!
                    </div>
                </div>

                <div class="game-controls">
                    <button id="close-fish-racing" class="game-btn close-btn">❌ Schließen</button>
                    <button id="reset-race-btn" class="game-btn" style="display: none;">🔄 Neues Rennen</button>
                </div>
            </div>
        `;
    }

    getGameCSS() {
        return `
            <style>
            #fish-racing-container {
                background: linear-gradient(180deg,
                    rgba(135, 206, 235, 0.95) 0%,
                    rgba(70, 130, 180, 0.95) 50%,
                    rgba(25, 25, 112, 0.95) 100%);
                border-radius: 20px;
                padding: 25px;
                max-width: 900px;
                margin: 20px auto;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.3);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }

            .race-stats {
                display: flex;
                gap: 20px;
                margin: 10px 0;
                font-weight: bold;
                background: rgba(255, 255, 255, 0.2);
                padding: 10px;
                border-radius: 10px;
            }

            .betting-section {
                background: rgba(255, 255, 255, 0.1);
                padding: 20px;
                border-radius: 15px;
                margin: 15px 0;
            }

            .fish-selection {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 15px 0;
            }

            .fish-bet-btn {
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid transparent;
                border-radius: 15px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
                color: white;
            }

            .fish-bet-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
            }

            .fish-bet-btn.selected {
                border-color: #FFD700;
                background: rgba(255, 215, 0, 0.3);
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
            }

            .fish-emoji {
                font-size: 48px;
                display: block;
                margin-bottom: 10px;
            }

            .fish-name {
                font-weight: bold;
                font-size: 18px;
                margin-bottom: 5px;
            }

            .fish-odds {
                color: #90EE90;
                font-weight: bold;
            }

            .bet-amount {
                margin: 20px 0;
                text-align: center;
            }

            #bet-slider {
                width: 200px;
                margin: 0 10px;
            }

            .race-track {
                background: linear-gradient(90deg,
                    rgba(30, 144, 255, 0.3) 0%,
                    rgba(30, 144, 255, 0.1) 95%,
                    rgba(255, 215, 0, 0.8) 95%,
                    rgba(255, 215, 0, 1) 100%);
                border-radius: 15px;
                padding: 20px;
                margin: 20px 0;
                position: relative;
                min-height: 400px;
            }

            .finish-line {
                position: absolute;
                right: 20px;
                top: 0;
                bottom: 0;
                width: 5px;
                background: repeating-linear-gradient(
                    to bottom,
                    #000 0px,
                    #000 10px,
                    #FFF 10px,
                    #FFF 20px
                );
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                z-index: 10;
            }


            .lane-number {
                background: rgba(0, 0, 0, 0.7);
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin: 0 10px;
                flex-shrink: 0;
            }

            .race-fish {
                position: absolute;
                left: 50px;
                transition: left 0.1s linear;
                z-index: 5;
                cursor: pointer;
                user-select: none;
            }

            .race-fish .fish-emoji {
                font-size: 32px;
                filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
                transition: transform 0.1s ease;
            }

            .race-fish:hover .fish-emoji {
                transform: scale(1.1);
            }

            .race-fish.boosted .fish-emoji {
                animation: fish-boost 0.5s ease-out;
            }

            @keyframes fish-boost {
                0% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.3) rotate(5deg); }
                100% { transform: scale(1) rotate(0deg); }
            }

            .fish-trail {
                position: absolute;
                right: 100%;
                top: 50%;
                height: 2px;
                background: linear-gradient(90deg,
                    transparent 0%,
                    rgba(255, 255, 255, 0.6) 50%,
                    transparent 100%);
                width: 30px;
                transform: translateY(-50%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .race-fish.moving .fish-trail {
                opacity: 1;
            }

            .lane-name {
                position: absolute;
                right: 10px;
                color: white;
                font-weight: bold;
                background: rgba(0, 0, 0, 0.5);
                padding: 5px 10px;
                border-radius: 5px;
            }

            .boost-hint {
                position: absolute;
                top: 10px;
                right: 60px;
                background: rgba(255, 215, 0, 0.9);
                color: black;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 14px;
                animation: pulse-hint 2s infinite;
            }

            @keyframes pulse-hint {
                0%, 100% { opacity: 0.7; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.05); }
            }

            .race-winner {
                animation: winner-celebration 1s ease-in-out infinite;
            }

            @keyframes winner-celebration {
                0%, 100% { transform: scale(1) rotate(0deg); }
                25% { transform: scale(1.2) rotate(5deg); }
                75% { transform: scale(1.2) rotate(-5deg); }
            }

            /* 🔥 VERBESSERUNG #1: Enhanced countdown animations */
            @keyframes countdownPulse {
                0% { transform: scale(0.8); opacity: 0; }
                50% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }

            @keyframes fadeOut {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }

            /* 🔥 VERBESSERUNG #2: Enhanced Race-Track Visuals */
            .race-lane {
                position: relative;
                height: 80px;
                margin: 10px 0;
                background: linear-gradient(90deg,
                    rgba(255, 255, 255, 0.1) 0%,
                    rgba(255, 255, 255, 0.05) 50%,
                    rgba(255, 255, 255, 0.1) 100%);
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                overflow: hidden;
                position: relative;
            }

            .race-lane::before {
                content: '';
                position: absolute;
                left: 50px;
                right: 50px;
                top: 50%;
                height: 2px;
                background: repeating-linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0.3) 0px,
                    rgba(255, 255, 255, 0.3) 20px,
                    transparent 20px,
                    transparent 40px
                );
                transform: translateY(-50%);
                z-index: 1;
            }

            .race-lane::after {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 5px;
                background: linear-gradient(180deg,
                    #00ff00 0%,
                    #ffff00 50%,
                    #ff0000 100%);
                border-radius: 5px 0 0 5px;
            }

            /* 🔥 VERBESSERUNG #3: Boost Particle Effects */
            .boost-particles {
                position: absolute;
                pointer-events: none;
                z-index: 20;
            }

            .boost-particle {
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: radial-gradient(circle, #FFD700, #FF6B35);
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
                animation: boostParticle 1s ease-out forwards;
            }

            @keyframes boostParticle {
                0% {
                    transform: scale(0) translate(0, 0);
                    opacity: 1;
                }
                50% {
                    transform: scale(1) translate(var(--dx), var(--dy));
                    opacity: 0.8;
                }
                100% {
                    transform: scale(0) translate(calc(var(--dx) * 2), calc(var(--dy) * 2));
                    opacity: 0;
                }
            }

            /* 🔥 VERBESSERUNG #4: Crowd atmosphere visual elements */
            .crowd-atmosphere {
                position: absolute;
                top: -10px;
                left: 0;
                right: 0;
                height: 10px;
                background: linear-gradient(90deg,
                    rgba(255, 215, 0, 0.1) 0%,
                    rgba(255, 107, 53, 0.1) 25%,
                    rgba(0, 119, 190, 0.1) 50%,
                    rgba(255, 215, 0, 0.1) 75%,
                    rgba(255, 107, 53, 0.1) 100%);
                animation: crowdWave 3s ease-in-out infinite;
            }

            @keyframes crowdWave {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.8; }
            }

            /* 🎁 POWER-UP ANIMATIONS */
            @keyframes powerUpFloat {
                0%, 100% { transform: translateY(0) scale(1); }
                50% { transform: translateY(-10px) scale(1.1); }
            }

            @keyframes powerUpCollect {
                0% { transform: scale(1); opacity: 1; }
                100% { transform: scale(2) translateY(-50px); opacity: 0; }
            }

            @keyframes powerUpNotify {
                0% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                10% { transform: translateX(-50%) translateY(0); opacity: 1; }
                90% { transform: translateX(-50%) translateY(0); opacity: 1; }
                100% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
            }

            @media (max-width: 768px) {
                .fish-selection {
                    grid-template-columns: repeat(2, 1fr);
                }

                .race-stats {
                    flex-direction: column;
                    gap: 10px;
                }

                .race-lane {
                    height: 60px;
                }

                .race-fish .fish-emoji {
                    font-size: 24px;
                }
            }
            </style>
        `;
    }

    initializeGame() {
        if (document.getElementById('fish-racing-container')) {
            console.log('🏁 Fish Racing Game already initialized');
            return;
        }

        // Add CSS
        const styleSheet = document.createElement('style');
        styleSheet.textContent = this.getGameCSS();
        document.head.appendChild(styleSheet);

        // Add HTML into modal/body if not present
        const existing = document.getElementById('fish-racing-container');
        if (!existing) {
            const gameHTML = this.createGameHTML();
            document.body.insertAdjacentHTML('beforeend', gameHTML);
        }

        this.gameContainer = document.getElementById('fish-racing-container');
        this.setupEventListeners();

        console.log('🏁 Fish Racing Game ready!');
    }

    setupEventListeners() {
        // Fish selection for betting
        document.querySelectorAll('.fish-bet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectFish(btn.dataset.fish);
                if (window.aquariumSounds) window.aquariumSounds.playButton();
                if (window.aquariumHaptics) window.aquariumHaptics.button();
            });
        });

        // Bet amount slider
        const betSlider = document.getElementById('bet-slider');
        const betAmountDisplay = document.getElementById('bet-amount');
        betSlider.addEventListener('input', (e) => {
            betAmountDisplay.textContent = e.target.value;
        });

        // Start race button
        document.getElementById('start-race-btn').addEventListener('click', () => {
            this.startRace();
        });

        // Fish boost clicks during race
        document.querySelectorAll('.race-fish').forEach(fish => {
            fish.addEventListener('click', (e) => {
                if (this.raceInProgress) {
                    this.boostFish(fish.dataset.fish);
                }
            });
        });

        // Control buttons
        document.getElementById('close-fish-racing').addEventListener('click', () => {
            this.closeGame();
        });

        document.getElementById('reset-race-btn').addEventListener('click', () => {
            this.resetRace();
        });
    }

    selectFish(fishId) {
        // Remove previous selection
        document.querySelectorAll('.fish-bet-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Select new fish
        const selectedBtn = document.querySelector(`[data-fish="${fishId}"]`);
        selectedBtn.classList.add('selected');
        this.selectedFish = fishId;

        // Enable start button
        document.getElementById('start-race-btn').disabled = false;

        console.log(`🎯 Selected fish: ${fishId}`);
    }

    startRace() {
        if (!this.selectedFish) return;

        this.raceInProgress = true;
        this.timeRemaining = this.gameTime;

        // Get bet amount
        const betAmount = parseInt(document.getElementById('bet-slider').value);
        this.currentBet = betAmount;
        this.playerScore -= betAmount;
        document.getElementById('race-score').textContent = this.playerScore;

        // 🎮 Reset turbo meter
        this.turboEnergy = this.maxTurboEnergy;
        this.updateTurboMeter();

        // Hide betting section, show race track
        document.getElementById('betting-section').style.display = 'none';
        document.getElementById('race-track').style.display = 'block';
        document.getElementById('reset-race-btn').style.display = 'inline-block';

        // Show turbo meter and pause button
        const turboContainer = document.getElementById('turbo-meter-container');
        if (turboContainer) turboContainer.style.display = 'inline-block';

        const pauseBtn = document.getElementById('race-pause-btn');
        if (pauseBtn) pauseBtn.style.display = 'inline-block';

        // 🎁 Clear and prepare power-ups/obstacles
        this.trackPowerUps = [];
        this.trackObstacles = [];

        // 🔥 VERBESSERUNG #4: Initialize crowd atmosphere
        this.initializeCrowdAtmosphere();

        // 🔥 VERBESSERUNG #5: Initialize race stats tracking
        this.raceStats = {
            startTime: Date.now(),
            endTime: null,
            winner: null,
            finalPositions: [],
            totalBoosts: 0,
            playerBoosts: 0,
            maxSpeed: 0,
            raceEvents: [],
            selectedFish: this.selectedFish,
            betAmount: betAmount
        };

        // Reset fish positions
        this.raceFish.forEach(fish => {
            fish.position = 0;
            fish.boost = 0;
            const fishElement = document.getElementById(`fish-${fish.id}`);
            fishElement.style.left = '50px';
            fishElement.classList.add('moving');
        });

        // Start race countdown
        this.raceCountdown();

        if (window.aquariumSounds) window.aquariumSounds.playSuccess();
        if (window.aquariumHaptics) window.aquariumHaptics.raceStart();

        console.log('🏁 Race started!');
    }

    raceCountdown() {
        let countdown = 3;
        const statusElement = document.getElementById('race-status');

        // 🔥 VERBESSERUNG #1: Enhanced Start-Countdown
        this.createCountdownOverlay();

        const countInterval = setInterval(() => {
            if (countdown > 0) {
                // Update both status and overlay
                statusElement.textContent = `🏁 ${countdown}...`;
                statusElement.style.fontSize = '24px';
                statusElement.style.color = '#FFD700';

                this.updateCountdownOverlay(countdown);

                if (window.aquariumSounds) window.aquariumSounds.playButton();
                if (window.aquariumHaptics) window.aquariumHaptics.button();

                countdown--;
            } else {
                statusElement.textContent = '🏁 LOS!';
                statusElement.style.color = '#90EE90';

                this.updateCountdownOverlay('GO!');

                clearInterval(countInterval);

                if (window.aquariumSounds) window.aquariumSounds.playSuccess();
                if (window.aquariumHaptics) window.aquariumHaptics.raceStart();

                setTimeout(() => {
                    this.removeCountdownOverlay();
                    this.runRace();
                }, 500);
            }
        }, 1000);
    }

    // 🔥 VERBESSERUNG #1: Create animated countdown overlay
    createCountdownOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'countdown-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            border-radius: 15px;
        `;

        const countdownText = document.createElement('div');
        countdownText.id = 'countdown-text';
        countdownText.style.cssText = `
            font-size: 120px;
            font-weight: bold;
            color: #FFD700;
            text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
            animation: countdownPulse 1s ease-in-out;
        `;

        overlay.appendChild(countdownText);
        document.getElementById('race-track').appendChild(overlay);
    }

    updateCountdownOverlay(text) {
        const countdownText = document.getElementById('countdown-text');
        if (countdownText) {
            countdownText.textContent = text;
            countdownText.style.animation = 'none';
            setTimeout(() => {
                countdownText.style.animation = 'countdownPulse 1s ease-in-out';
            }, 10);
        }
    }

    removeCountdownOverlay() {
        const overlay = document.getElementById('countdown-overlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => overlay.remove(), 500);
        }
    }

    runRace() {
        this.raceIntervalId = setInterval(() => {
            // ⚡ PERFORMANCE: Skip update if paused
            if (this.racePaused) return;

            this.timeRemaining -= 0.1;
            const timerElement = document.getElementById('race-timer');
            if (timerElement) {
                timerElement.textContent = Math.max(0, this.timeRemaining).toFixed(1);
            }

            // 🎮 RECHARGE TURBO ENERGY!
            if (this.turboEnergy < this.maxTurboEnergy) {
                this.turboEnergy = Math.min(this.maxTurboEnergy, this.turboEnergy + (this.turboRechargeRate * 0.1));
                this.updateTurboMeter();
            }

            // 🎁 SPAWN POWER-UPS randomly (5% chance per interval)
            if (Math.random() < 0.05 && this.trackPowerUps.length < 3) {
                this.spawnTrackPowerUp();
            }

            // 🎁 CHECK POWER-UP COLLECTION
            this.checkPowerUpCollection();

            // Move fish
            let raceFinished = false;
            this.raceFish.forEach(fish => {
                // Calculate speed with random variation and boost
                const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
                const speed = fish.baseSpeed * randomFactor + fish.boost;
                fish.position += speed;

                // Apply boost decay
                if (fish.boost > 0) {
                    fish.boost *= 0.95;
                }

                // Update visual position
                const fishElement = document.getElementById(`fish-${fish.id}`);
                if (fishElement) {
                    const newLeft = Math.min(50 + fish.position, this.raceDistance - 50);
                    fishElement.style.left = `${newLeft}px`;
                }

                // Check for finish line
                if (fish.position >= this.raceDistance - 100) {
                    raceFinished = true;
                    this.finishRace(fish);
                }
            });

            // Time up
            if (this.timeRemaining <= 0) {
                raceFinished = true;
                this.finishRace(this.getFurthestFish());
            }

            if (raceFinished) {
                clearInterval(this.raceIntervalId);
                this.raceIntervalId = null;
            }
        }, 100);
    }

    boostFish(fishId) {
        if (!this.raceInProgress || fishId !== this.selectedFish) return;

        // 🎮 CHECK TURBO ENERGY!
        if (this.turboEnergy < this.turboConsumptionPerBoost) {
            // Show "out of energy" feedback
            this.showTurboDepletedMessage();
            return;
        }

        const fish = this.raceFish.find(f => f.id === fishId);
        if (fish) {
            // Consume turbo energy
            this.turboEnergy = Math.max(0, this.turboEnergy - this.turboConsumptionPerBoost);
            this.updateTurboMeter();

            fish.boost = Math.min(fish.boost + 2, 5); // Max boost of 5
            const fishElement = document.getElementById(`fish-${fishId}`);
            fishElement.classList.add('boosted');

            // 🔥 VERBESSERUNG #3: Add boost particle effects
            this.createBoostParticles(fishElement);

            // 🔥 VERBESSERUNG #5: Track boost stats
            this.raceStats.playerBoosts++;
            this.raceStats.totalBoosts++;
            this.raceStats.raceEvents.push({
                time: Date.now() - this.raceStats.startTime,
                type: 'boost',
                fish: fishId,
                position: fish.position
            });

            setTimeout(() => {
                fishElement.classList.remove('boosted');
            }, 500);

            if (window.aquariumSounds) window.aquariumSounds.playCollect();
            if (window.aquariumHaptics) window.aquariumHaptics.collect();
        }
    }

    updateTurboMeter() {
        const percentage = (this.turboEnergy / this.maxTurboEnergy) * 100;
        const fillElement = document.getElementById('turbo-meter-fill');
        const valueElement = document.getElementById('turbo-meter-value');

        if (fillElement) {
            fillElement.style.width = `${percentage}%`;

            // Change color based on energy level
            if (percentage < 20) {
                fillElement.style.background = 'linear-gradient(90deg, #FF4444, #CC0000)';
            } else if (percentage < 50) {
                fillElement.style.background = 'linear-gradient(90deg, #FFA500, #FF6B35)';
            } else {
                fillElement.style.background = 'linear-gradient(90deg, #FFD700, #FF6B35)';
            }
        }

        if (valueElement) {
            valueElement.textContent = Math.round(percentage);
        }
    }

    showTurboDepletedMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 68, 68, 0.95);
            color: white;
            padding: 20px 40px;
            border-radius: 15px;
            font-size: 20px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
            pointer-events: none;
        `;
        message.textContent = '⚠️ Turbo leer! Warte auf Aufladung...';
        document.body.appendChild(message);

        setTimeout(() => message.remove(), 1500);

        if (window.aquariumSounds) window.aquariumSounds.playError();
    }

    spawnTrackPowerUp() {
        const powerUpTypes = [
            { emoji: '⚡', type: 'speed', description: '+2 Speed!' },
            { emoji: '🌟', type: 'mega_boost', description: 'Mega Boost!' },
            { emoji: '🔋', type: 'turbo_refill', description: 'Turbo Refill!' },
            { emoji: '🎯', type: 'teleport', description: 'Teleport +50px!' }
        ];

        const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        const randomLane = Math.floor(Math.random() * this.raceFish.length) + 1;
        const randomPosition = 100 + Math.random() * 300; // Spawn ahead

        const powerUp = {
            id: `powerup-${Date.now()}`,
            type: randomType.type,
            emoji: randomType.emoji,
            description: randomType.description,
            lane: randomLane,
            position: randomPosition,
            collected: false
        };

        this.trackPowerUps.push(powerUp);

        // Create visual element
        const lane = document.querySelector(`.race-lane[data-lane="${randomLane}"]`);
        if (lane) {
            const powerUpElement = document.createElement('div');
            powerUpElement.id = powerUp.id;
            powerUpElement.style.cssText = `
                position: absolute;
                left: ${50 + randomPosition}px;
                font-size: 24px;
                z-index: 3;
                animation: powerUpFloat 1s ease-in-out infinite;
                filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
                pointer-events: none;
            `;
            powerUpElement.textContent = randomType.emoji;
            lane.appendChild(powerUpElement);
        }

        console.log(`🎁 Power-Up spawned: ${randomType.type} at lane ${randomLane}`);
    }

    checkPowerUpCollection() {
        for (let i = this.trackPowerUps.length - 1; i >= 0; i--) {
            const powerUp = this.trackPowerUps[i];
            if (powerUp.collected) continue;

            // Check if any fish collected it
            this.raceFish.forEach(fish => {
                if (fish.lane === powerUp.lane && Math.abs(fish.position - powerUp.position) < 30) {
                    this.collectPowerUp(fish, powerUp, i);
                }
            });
        }
    }

    collectPowerUp(fish, powerUp, index) {
        powerUp.collected = true;

        // Apply power-up effect
        switch(powerUp.type) {
            case 'speed':
                fish.baseSpeed += 1;
                break;
            case 'mega_boost':
                fish.boost += 5;
                break;
            case 'turbo_refill':
                if (fish.id === this.selectedFish) {
                    this.turboEnergy = Math.min(this.maxTurboEnergy, this.turboEnergy + 40);
                    this.updateTurboMeter();
                }
                break;
            case 'teleport':
                fish.position += 50;
                break;
        }

        // Show notification if it's player's fish
        if (fish.id === this.selectedFish) {
            this.showPowerUpNotification(powerUp);
        }

        // Remove visual element
        const element = document.getElementById(powerUp.id);
        if (element) {
            element.style.animation = 'powerUpCollect 0.5s ease-out forwards';
            setTimeout(() => element.remove(), 500);
        }

        // Remove from array
        this.trackPowerUps.splice(index, 1);

        if (fish.id === this.selectedFish) {
            if (window.aquariumSounds) window.aquariumSounds.playSuccess();
            if (window.aquariumHaptics) window.aquariumHaptics.achievement();
        }

        console.log(`🎁 ${fish.name} collected power-up: ${powerUp.type}`);
    }

    showPowerUpNotification(powerUp) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 200px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: white;
            padding: 12px 24px;
            border-radius: 20px;
            font-size: 18px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(255, 165, 0, 0.5);
            animation: powerUpNotify 1s ease-out forwards;
            pointer-events: none;
        `;
        notification.textContent = `${powerUp.emoji} ${powerUp.description}`;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 1500);
    }

    getFurthestFish() {
        return this.raceFish.reduce((furthest, current) =>
            current.position > furthest.position ? current : furthest
        );
    }

    finishRace(winner) {
        this.raceInProgress = false;

        // 🔥 VERBESSERUNG #5: Finalize race stats
        this.raceStats.endTime = Date.now();
        this.raceStats.winner = winner;
        this.raceStats.finalPositions = [...this.raceFish]
            .sort((a, b) => b.position - a.position)
            .map((fish, index) => ({ ...fish, place: index + 1 }));

        // Stop all fish movement
        document.querySelectorAll('.race-fish').forEach(fish => {
            fish.classList.remove('moving');
        });

        // 🔥 VERBESSERUNG #4: Stop crowd atmosphere
        this.stopCrowdAtmosphere();

        // Highlight winner
        const winnerElement = document.getElementById(`fish-${winner.id}`);
        winnerElement.classList.add('race-winner');

        // Calculate winnings
        let message = '';
        let winnings = 0;
        if (winner.id === this.selectedFish) {
            winnings = this.currentBet * 3; // 3:1 odds
            this.playerScore += winnings;
            message = `🎉 ${winner.name} gewinnt! Du hast ${winnings} Punkte gewonnen!`;

            if (window.aquariumSounds) window.aquariumSounds.playWin();
            if (window.aquariumHaptics) window.aquariumHaptics.raceFinish(1);
        } else {
            message = `😔 ${winner.name} gewinnt! Du hast ${this.currentBet} Punkte verloren.`;

            if (window.aquariumSounds) window.aquariumSounds.playLose();
            if (window.aquariumHaptics) window.aquariumHaptics.raceFinish(4);
        }

        document.getElementById('race-status').textContent = message;
        document.getElementById('race-score').textContent = this.playerScore;

        // 🔥 VERBESSERUNG #5: Show replay button after 2 seconds
        setTimeout(() => {
            this.showReplayButton();
        }, 2000);

        console.log(`🏁 Race finished! Winner: ${winner.name}`);
    }

    resetRace() {
        this.raceInProgress = false;
        this.selectedFish = null;
        this.timeRemaining = this.gameTime;

        // Reset UI
        document.getElementById('betting-section').style.display = 'block';
        document.getElementById('race-track').style.display = 'none';
        document.getElementById('reset-race-btn').style.display = 'none';
        document.getElementById('start-race-btn').disabled = true;
        document.getElementById('race-timer').textContent = this.gameTime;
        document.getElementById('race-status').textContent = '🎯 Wähle deinen Favoriten!';

        // Hide pause button
        const pauseBtn = document.getElementById('race-pause-btn');
        if (pauseBtn) {
            pauseBtn.style.display = 'none';
            pauseBtn.textContent = '⏸️ Pause';
        }

        // Clear selections
        document.querySelectorAll('.fish-bet-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Reset fish
        this.raceFish.forEach(fish => {
            fish.position = 0;
            fish.boost = 0;
            const fishElement = document.getElementById(`fish-${fish.id}`);
            fishElement.classList.remove('race-winner', 'moving', 'boosted');
        });

        if (window.aquariumSounds) window.aquariumSounds.playButton();
        if (window.aquariumHaptics) window.aquariumHaptics.button();
    }

    showGame() {
        if (!this.gameContainer) {
            this.initializeGame();
        }
        this.gameContainer.style.display = 'block';
        this.isGameActive = true;

        // Reset to betting phase
        this.resetRace();

        console.log('🏁 Fish Racing Game opened');
    }

    toggleRacePause() {
        if (!this.raceInProgress) return;

        this.racePaused = !this.racePaused;

        const pauseBtn = document.getElementById('race-pause-btn');
        if (pauseBtn) {
            pauseBtn.textContent = this.racePaused ? '▶️ Resume' : '⏸️ Pause';
        }

        if (this.racePaused) {
            // Show pause overlay
            const track = document.getElementById('race-track');
            if (track) {
                const pauseOverlay = document.createElement('div');
                pauseOverlay.id = 'race-pause-overlay';
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
                    z-index: 1000;
                    font-size: 48px;
                    color: white;
                    font-weight: bold;
                    backdrop-filter: blur(5px);
                `;
                pauseOverlay.textContent = '⏸️ PAUSE';
                track.appendChild(pauseOverlay);
            }
            console.log('⏸️ Race paused');
        } else {
            // Remove pause overlay
            const pauseOverlay = document.getElementById('race-pause-overlay');
            if (pauseOverlay) pauseOverlay.remove();
            console.log('▶️ Race resumed');
        }

        if (window.aquariumSounds) window.aquariumSounds.playButton();
        if (window.aquariumHaptics) window.aquariumHaptics.button();
    }

    closeGame() {
        if (this.gameContainer) {
            this.gameContainer.style.display = 'none';
            this.isGameActive = false;
            this.raceInProgress = false;
            this.racePaused = false;
        }

        if (window.aquariumSounds) window.aquariumSounds.playButton();
        if (window.aquariumHaptics) window.aquariumHaptics.button();

        console.log('🏁 Fish Racing Game closed');
    }

    // 🔥 VERBESSERUNG #3: Create boost particle effects
    createBoostParticles(fishElement) {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'boost-particles';

        const rect = fishElement.getBoundingClientRect();
        const trackRect = document.getElementById('race-track').getBoundingClientRect();

        particleContainer.style.left = `${rect.left - trackRect.left + rect.width/2}px`;
        particleContainer.style.top = `${rect.top - trackRect.top + rect.height/2}px`;

        // Create 8 particles in different directions
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'boost-particle';

            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            particle.style.setProperty('--dx', `${dx}px`);
            particle.style.setProperty('--dy', `${dy}px`);

            particleContainer.appendChild(particle);
        }

        document.getElementById('race-track').appendChild(particleContainer);

        // Remove after animation
        setTimeout(() => {
            if (particleContainer.parentNode) {
                particleContainer.remove();
            }
        }, 1000);
    }

    // 🔥 VERBESSERUNG #4: Initialize crowd atmosphere
    initializeCrowdAtmosphere() {
        // Add visual crowd atmosphere to race track
        const atmosphere = document.createElement('div');
        atmosphere.className = 'crowd-atmosphere';
        atmosphere.id = 'crowd-atmosphere';
        document.getElementById('race-track').appendChild(atmosphere);

        // Start crowd cheering sounds (random intervals)
        this.crowdCheerInterval = setInterval(() => {
            if (this.raceInProgress && window.aquariumSounds) {
                // Random cheer every 3-7 seconds during race
                const cheerSounds = ['playButton', 'playSuccess', 'playCollect'];
                const randomCheer = cheerSounds[Math.floor(Math.random() * cheerSounds.length)];

                // Lower volume for ambient effect
                if (window.aquariumSounds[randomCheer]) {
                    window.aquariumSounds[randomCheer]();
                }
            }
        }, 3000 + Math.random() * 4000); // 3-7 seconds
    }

    // 🔥 VERBESSERUNG #4: Stop crowd atmosphere
    stopCrowdAtmosphere() {
        if (this.crowdCheerInterval) {
            clearInterval(this.crowdCheerInterval);
            this.crowdCheerInterval = null;
        }

        const atmosphere = document.getElementById('crowd-atmosphere');
        if (atmosphere) {
            atmosphere.remove();
        }
    }

    // 🔥 VERBESSERUNG #5: Show replay button with race statistics
    showReplayButton() {
        const replaySection = document.createElement('div');
        replaySection.id = 'race-replay-section';
        replaySection.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            border-radius: 15px;
            padding: 20px;
            margin: 20px 0;
            color: white;
            text-align: center;
            animation: slideUp 0.5s ease-out;
        `;

        const raceDuration = (this.raceStats.endTime - this.raceStats.startTime) / 1000;
        const winnerFish = this.raceStats.winner;
        const playerPlace = this.raceStats.finalPositions.find(f => f.id === this.selectedFish)?.place || 'N/A';

        replaySection.innerHTML = `
            <h4>📊 Rennen-Statistiken</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;">
                <div style="background: rgba(255, 255, 255, 0.1); padding: 10px; border-radius: 10px;">
                    <div style="font-size: 24px;">${winnerFish.emoji}</div>
                    <div>🏆 Gewinner: ${winnerFish.name}</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.1); padding: 10px; border-radius: 10px;">
                    <div style="font-size: 24px;">⏱️</div>
                    <div>Rennzeit: ${raceDuration.toFixed(1)}s</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.1); padding: 10px; border-radius: 10px;">
                    <div style="font-size: 24px;">🚀</div>
                    <div>Deine Boosts: ${this.raceStats.playerBoosts}</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.1); padding: 10px; border-radius: 10px;">
                    <div style="font-size: 24px;">🎯</div>
                    <div>Dein Platz: ${playerPlace}</div>
                </div>
            </div>
            <div style="margin: 15px 0;">
                <h5>🏁 Finales Ranking:</h5>
                ${this.raceStats.finalPositions.map(fish => `
                    <div style="display: flex; justify-content: space-between; align-items: center;
                         background: ${fish.id === this.selectedFish ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
                         margin: 5px 0; padding: 8px 12px; border-radius: 8px;">
                        <span>${fish.place}. ${fish.emoji} ${fish.name}</span>
                        <span>${fish.position.toFixed(0)}px</span>
                    </div>
                `).join('')}
            </div>
            <button id="replay-race-btn" class="game-btn" style="
                background: linear-gradient(45deg, #FF6B35, #F7931E);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                margin: 10px;
            ">🏁 Neues Rennen starten</button>
        `;

        // Add slideUp animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                0% { transform: translateY(30px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Insert before controls
        const controls = document.querySelector('#fish-racing-container .game-controls');
        controls.parentNode.insertBefore(replaySection, controls);

        // Add event listener for replay button
        document.getElementById('replay-race-btn').addEventListener('click', () => {
            replaySection.remove();
            this.resetRace();
            if (window.aquariumSounds) window.aquariumSounds.playButton();
            if (window.aquariumHaptics) window.aquariumHaptics.button();
        });
    }
}

// 🌐 BROWSER GLOBAL EXPORT (für Modal-System)
window.FishRacingGame = FishRacingGame; // Klasse für Modal-System

// Initialize and make globally available (für Backward-Compatibility)
if (typeof window !== 'undefined') {
    window.fishRacingGame = new FishRacingGame();

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.fishRacingGame.initializeGame();
        });
    } else {
        window.fishRacingGame.initializeGame();
    }
}

console.log('🏁 Fish Racing Game module loaded and globally available');