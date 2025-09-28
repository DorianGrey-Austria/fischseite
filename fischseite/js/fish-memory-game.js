/* 🧠 FISH MEMORY MATCH GAME V1.0
   - Memory-Spiel mit österreichischen Süßwasser-Fischarten
   - Progressive Schwierigkeitsstufen (Easy/Medium/Hard)
   - Glassmorphism UI Design
   - Zeit-basierte Punkte + Accuracy Bonus
   - Integration mit Vereins-Bildergalerie
   - Performance-optimiert für Animation Coordinator
*/

// 🐟 ÖSTERREICHISCHE SÜßWASSER-FISCHARTEN (8 Paare)
const AUSTRIAN_FISH_PAIRS = [
    {
        id: 1,
        name: 'Forelle',
        emoji: '🐟',
        description: 'Österreichs beliebtester Angelfisch',
        habitat: 'Kalte, sauerstoffreiche Gewässer'
    },
    {
        id: 2,
        name: 'Karpfen',
        emoji: '🐠',
        description: 'Traditioneller Vereinsfisch',
        habitat: 'Stehende und langsam fließende Gewässer'
    },
    {
        id: 3,
        name: 'Hecht',
        emoji: '🦈',
        description: 'Raubfisch des Jahres',
        habitat: 'Pflanzenreiche Gewässer'
    },
    {
        id: 4,
        name: 'Barsch',
        emoji: '🐡',
        description: 'Heimischer Süßwasserfisch',
        habitat: 'Seen und größere Flüsse'
    },
    {
        id: 5,
        name: 'Wels',
        emoji: '🐟',
        description: 'Größter heimischer Fisch',
        habitat: 'Tiefe, warme Gewässer'
    },
    {
        id: 6,
        name: 'Äsche',
        emoji: '🐠',
        description: 'Seltene Bergwasser-Art',
        habitat: 'Schnell fließende Gebirgsbäche'
    },
    {
        id: 7,
        name: 'Zander',
        emoji: '🦈',
        description: 'Beliebter Angelfisch',
        habitat: 'Große Seen und Flüsse'
    },
    {
        id: 8,
        name: 'Bachsaibling',
        emoji: '🐡',
        description: 'Alpiner Gebirgsfisch',
        habitat: 'Kalte Berggewässer'
    }
];

// 🎯 SCHWIERIGKEITSSTUFEN
const DIFFICULTY_LEVELS = {
    easy: {
        name: 'Anfänger',
        pairs: 4,
        gridSize: '4x2',
        timeLimit: 90,
        description: 'Perfekt für Einsteiger'
    },
    medium: {
        name: 'Fortgeschritten',
        pairs: 6,
        gridSize: '4x3',
        timeLimit: 120,
        description: 'Für Aquaristik-Kenner'
    },
    hard: {
        name: 'Experte',
        pairs: 8,
        gridSize: '4x4',
        timeLimit: 150,
        description: 'Echte Herausforderung'
    }
};

// 🎮 MEMORY GAME KLASSE
class FishMemoryGame {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = null;
        this.gameData = {
            level: 'medium',
            cards: [],
            flippedCards: [],
            matchedPairs: 0,
            totalPairs: 0,
            moves: 0,
            timeElapsed: 0,
            score: 0,
            gameStarted: false,
            gameEnded: false,
            // 🔥 VERBESSERUNG #3: Combo-System
            comboCount: 0,
            lastMatchTime: 0,
            consecutiveMatches: 0,
            maxCombo: 0
        };
        this.gameTimer = null;
        this.gameStartTime = null;

        // 🔥 VERBESSERUNG #4: Inactivity Hint System
        this.inactivityTimer = null;
        this.lastInteractionTime = 0;
        this.hintInterval = 5000; // 5 seconds

        // Audio Feedback (optional)
        this.sounds = {
            flip: null,
            match: null,
            complete: null,
            wrong: null
        };

        this.init();
    }

    init() {
        console.log('🧠 Fish Memory Game initializing...');
        this.createGameContainer();
        this.showStartScreen();
        this.loadSounds();
    }

    createGameContainer() {
        // Wenn ein Ziel-Container bereits existiert (z.B. im Modal), nutze ihn statt ihn zu entfernen
        const existing = document.getElementById(this.containerId);
        if (existing) {
            this.container = existing;
            this.container.className = 'fish-memory-game-container';
            return;
        }

        // Erstelle neuen Container
        this.container = document.createElement('div');
        this.container.id = this.containerId;
        this.container.className = 'fish-memory-game-container';

        // Füge nach Game 2 oder als letztes Spiel hinzu
        const game2Container = document.getElementById('aquarium-game-2');
        if (game2Container && game2Container.parentNode) {
            game2Container.parentNode.insertBefore(this.container, game2Container.nextSibling);
        } else {
            // Fallback: nach der letzten Section
            const sections = document.querySelectorAll('section');
            const lastSection = sections[sections.length - 1];
            if (lastSection && lastSection.parentNode) {
                lastSection.parentNode.appendChild(this.container);
            }
        }
    }

    showStartScreen() {
        this.container.innerHTML = `
            <div class="memory-game-start-screen">
                <div class="memory-game-header">
                    <h2>🧠 Fish Memory Match</h2>
                    <p>Finde die Paare österreichischer Süßwasser-Fischarten!</p>
                </div>

                <div class="memory-difficulty-selector">
                    <h3>Schwierigkeitsstufe wählen:</h3>
                    <div class="difficulty-buttons">
                        ${Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => `
                            <button class="difficulty-btn ${key === 'medium' ? 'selected' : ''}"
                                    data-level="${key}">
                                <div class="difficulty-name">${level.name}</div>
                                <div class="difficulty-info">${level.gridSize} • ${level.pairs} Paare</div>
                                <div class="difficulty-time">${level.timeLimit}s Zeit</div>
                                <div class="difficulty-desc">${level.description}</div>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="memory-game-controls">
                    <button class="memory-start-btn" onclick="fishMemoryGame.startGame()">
                        🎮 Spiel starten
                    </button>
                    <button class="memory-gallery-btn" onclick="fishMemoryGame.openGallery()">
                        📷 Vereins-Galerie
                    </button>
                </div>

                <div class="memory-game-rules">
                    <h4>🎯 Spielregeln:</h4>
                    <ul>
                        <li>Finde alle Fisch-Paare durch Umdrehen der Karten</li>
                        <li>Merke dir die Positionen für weniger Züge</li>
                        <li>Schnellere Zeit = mehr Bonuspunkte</li>
                        <li>Erfahre mehr über heimische Fischarten</li>
                    </ul>
                </div>
            </div>
        `;

        // Event Listeners für Schwierigkeitsauswahl
        this.container.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Entferne selected von allen Buttons
                this.container.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
                // Füge selected zum geklickten Button hinzu
                btn.classList.add('selected');
                this.gameData.level = btn.dataset.level;
            });
        });
    }

    startGame() {
        console.log(`🎮 Starting Fish Memory Game - Level: ${this.gameData.level}`);

        // 🎮 GAME BALANCER INTEGRATION - Get adaptive difficulty
        let level = DIFFICULTY_LEVELS[this.gameData.level];
        if (window.gameBalancerAPI) {
            const adaptiveDifficulty = window.gameBalancerAPI.gameStart('memory');
            if (adaptiveDifficulty && adaptiveDifficulty.adjustments) {
                console.log('🎯 Applying adaptive difficulty to memory game:', adaptiveDifficulty);
                // Create modified level based on adaptive adjustments
                level = {
                    ...level,
                    pairs: adaptiveDifficulty.adjustments.pairCount || level.pairs,
                    timeLimit: adaptiveDifficulty.adjustments.timeLimit || level.timeLimit
                };
            }
        }

        this.gameData.totalPairs = level.pairs;
        this.gameData.timeLimit = level.timeLimit;
        this.gameData.cards = this.generateCards(level.pairs);
        this.gameData.gameStarted = true;
        this.gameData.gameEnded = false;
        this.gameData.matchedPairs = 0;
        this.gameData.moves = 0;
        this.gameData.timeElapsed = 0;
        this.gameData.score = 0;
        this.gameData.flippedCards = [];
        // 🔥 VERBESSERUNG #3: Reset combo system
        this.gameData.comboCount = 0;
        this.gameData.lastMatchTime = 0;
        this.gameData.consecutiveMatches = 0;
        this.gameData.maxCombo = 0;

        this.createGameBoard();
        this.startTimer();
        this.gameStartTime = Date.now();

        // 🔥 VERBESSERUNG #4: Start inactivity timer
        this.lastInteractionTime = Date.now();
        this.resetInactivityTimer();

        this.playSound('flip');
    }

    generateCards(pairCount) {
        // Wähle zufällige Fischarten aus
        const selectedFish = AUSTRIAN_FISH_PAIRS.slice(0, pairCount);
        const cards = [];

        // Erstelle Paare
        selectedFish.forEach((fish, index) => {
            // Karte A
            cards.push({
                id: `${fish.id}-a`,
                fishId: fish.id,
                fish: fish,
                isFlipped: false,
                isMatched: false,
                pairId: fish.id
            });

            // Karte B
            cards.push({
                id: `${fish.id}-b`,
                fishId: fish.id,
                fish: fish,
                isFlipped: false,
                isMatched: false,
                pairId: fish.id
            });
        });

        // Mische die Karten
        return this.shuffleArray(cards);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    createGameBoard() {
        const level = DIFFICULTY_LEVELS[this.gameData.level];
        const isEasy = this.gameData.level === 'easy';
        const isMedium = this.gameData.level === 'medium';

        this.container.innerHTML = `
            <div class="memory-game-board">
                <div class="memory-game-hud">
                    <div class="memory-hud-left">
                        <div class="memory-stat">
                            <span class="stat-label">Züge:</span>
                            <span class="stat-value" id="memory-moves">0</span>
                        </div>
                        <div class="memory-stat">
                            <span class="stat-label">Paare:</span>
                            <span class="stat-value" id="memory-pairs">0/${this.gameData.totalPairs}</span>
                        </div>
                    </div>

                    <div class="memory-hud-center">
                        <div class="memory-timer">
                            <span id="memory-time">${this.gameData.timeLimit}</span>s
                        </div>
                    </div>

                    <div class="memory-hud-right">
                        <div class="memory-stat">
                            <span class="stat-label">Punkte:</span>
                            <span class="stat-value" id="memory-score">0</span>
                        </div>
                        <button class="memory-exit-btn" onclick="fishMemoryGame.exitGame()">
                            ❌ Beenden
                        </button>
                    </div>
                </div>

                <div class="memory-cards-grid ${this.gameData.level}-grid">
                    ${this.gameData.cards.map((card, index) => `
                        <div class="memory-card" data-card-id="${card.id}" data-index="${index}">
                            <div class="memory-card-inner">
                                <div class="memory-card-front">
                                    <div class="card-back-pattern">🌊</div>
                                </div>
                                <div class="memory-card-back">
                                    <div class="fish-emoji">${card.fish.emoji}</div>
                                    <div class="fish-name">${card.fish.name}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="memory-game-info">
                    <div class="current-level-info">
                        <strong>${level.name}</strong> • ${level.gridSize} • ${this.gameData.totalPairs} Paare
                    </div>
                </div>
            </div>
        `;

        // Event Listeners für Karten
        this.container.querySelectorAll('.memory-card').forEach(cardElement => {
            cardElement.addEventListener('click', (e) => {
                const cardIndex = parseInt(cardElement.dataset.index);
                this.flipCard(cardIndex);
            });
        });
    }

    flipCard(cardIndex) {
        if (!this.gameData.gameStarted || this.gameData.gameEnded) return;

        const card = this.gameData.cards[cardIndex];
        if (card.isFlipped || card.isMatched) return;
        if (this.gameData.flippedCards.length >= 2) return;

        // 🔥 VERBESSERUNG #4: Track interaction for inactivity hints
        this.lastInteractionTime = Date.now();
        this.resetInactivityTimer();
        this.clearHints();

        // 🔥 VERBESSERUNG #1: Smooth Card-Flip Animation
        const cardElement = this.container.querySelector(`[data-index="${cardIndex}"]`);
        cardElement.classList.add('flipping');

        // Add haptic feedback
        if (window.aquariumHaptics) {
            window.aquariumHaptics.memoryCardFlip();
        }

        setTimeout(() => {
            // Karte umdrehen
            card.isFlipped = true;
            this.gameData.flippedCards.push(cardIndex);

            // 🔥 VERBESSERUNG #1: Complete flip animation
            cardElement.classList.remove('flipping');
            cardElement.classList.add('flipped');

            // 🔥 VERBESSERUNG #2: Enhanced Sound Integration
            if (window.aquariumSounds) {
                window.aquariumSounds.playClick();
            } else {
                this.playSound('flip');
            }

            // Prüfe auf Match
            if (this.gameData.flippedCards.length === 2) {
                this.gameData.moves++;
                this.updateHUD();

                setTimeout(() => {
                    this.checkForMatch();
                }, 600);
            }
        }, 300); // Half of flip animation duration
    }

    checkForMatch() {
        const [index1, index2] = this.gameData.flippedCards;
        const card1 = this.gameData.cards[index1];
        const card2 = this.gameData.cards[index2];

        if (card1.pairId === card2.pairId) {
            // Match gefunden!
            card1.isMatched = true;
            card2.isMatched = true;
            this.gameData.matchedPairs++;

            // 🔥 VERBESSERUNG #3: Combo System
            const currentTime = Date.now();
            const timeSinceLastMatch = currentTime - this.gameData.lastMatchTime;

            if (timeSinceLastMatch < 3000 && this.gameData.lastMatchTime > 0) {
                // Fast match - increment combo
                this.gameData.consecutiveMatches++;
                this.gameData.comboCount = this.gameData.consecutiveMatches;
                this.gameData.maxCombo = Math.max(this.gameData.maxCombo, this.gameData.comboCount);
            } else {
                // Reset combo
                this.gameData.consecutiveMatches = 1;
                this.gameData.comboCount = 1;
            }
            this.gameData.lastMatchTime = currentTime;

            // UI Update
            const cardElement1 = this.container.querySelector(`[data-index="${index1}"]`);
            const cardElement2 = this.container.querySelector(`[data-index="${index2}"]`);
            cardElement1.classList.add('matched');
            cardElement2.classList.add('matched');

            // 🔥 VERBESSERUNG #2: Enhanced Sound & Haptic for Match
            if (window.aquariumSounds) {
                if (this.gameData.comboCount > 1) {
                    window.aquariumSounds.playAchievement(); // Special sound for combos
                } else {
                    window.aquariumSounds.playSuccess();
                }
            } else {
                this.playSound('match');
            }

            if (window.aquariumHaptics) {
                if (this.gameData.comboCount > 1) {
                    window.aquariumHaptics.comboFeedback(this.gameData.comboCount);
                } else {
                    window.aquariumHaptics.memoryMatch();
                }
            }

            this.showFishInfo(card1.fish);

            // 🔥 VERBESSERUNG #3: Combo Bonus Points
            let basePoints = 100;
            let comboMultiplier = this.gameData.comboCount > 1 ? (1 + (this.gameData.comboCount - 1) * 0.5) : 1;
            let comboPoints = Math.round(basePoints * comboMultiplier);

            this.addScore(comboPoints);

            // Show combo notification
            if (this.gameData.comboCount > 1) {
                this.showComboNotification(this.gameData.comboCount, comboPoints);
            }

            // Prüfe auf Spielende
            if (this.gameData.matchedPairs === this.gameData.totalPairs) {
                setTimeout(() => {
                    this.gameComplete();
                }, 1000);
            }
        } else {
            // Kein Match - Reset combo
            this.gameData.consecutiveMatches = 0;
            this.gameData.comboCount = 0;

            // 🔥 VERBESSERUNG #2: Enhanced Sound & Haptic for Mismatch
            if (window.aquariumSounds) {
                window.aquariumSounds.playError();
            } else {
                this.playSound('wrong');
            }

            if (window.aquariumHaptics) {
                window.aquariumHaptics.memoryMismatch();
            }

            setTimeout(() => {
                card1.isFlipped = false;
                card2.isFlipped = false;

                const cardElement1 = this.container.querySelector(`[data-index="${index1}"]`);
                const cardElement2 = this.container.querySelector(`[data-index="${index2}"]`);
                cardElement1.classList.remove('flipped');
                cardElement2.classList.remove('flipped');
            }, 800);
        }

        this.gameData.flippedCards = [];
        this.updateHUD();
        this.resetInactivityTimer(); // Reset hint timer after match check
    }

    showFishInfo(fish) {
        // Zeige kurze Info über den gefundenen Fisch
        const infoElement = document.createElement('div');
        infoElement.className = 'fish-info-popup';
        infoElement.innerHTML = `
            <div class="fish-info-content">
                <div class="fish-info-emoji">${fish.emoji}</div>
                <div class="fish-info-name">${fish.name}</div>
                <div class="fish-info-desc">${fish.description}</div>
                <div class="fish-info-habitat">Lebensraum: ${fish.habitat}</div>
            </div>
        `;

        this.container.appendChild(infoElement);

        // Automatisch nach 3 Sekunden entfernen
        setTimeout(() => {
            if (infoElement.parentNode) {
                infoElement.remove();
            }
        }, 3000);
    }

    addScore(points) {
        this.gameData.score += points;
        this.updateHUD();
    }

    updateHUD() {
        const movesElement = this.container.querySelector('#memory-moves');
        const pairsElement = this.container.querySelector('#memory-pairs');
        const scoreElement = this.container.querySelector('#memory-score');

        if (movesElement) movesElement.textContent = this.gameData.moves;
        if (pairsElement) pairsElement.textContent = `${this.gameData.matchedPairs}/${this.gameData.totalPairs}`;
        if (scoreElement) scoreElement.textContent = this.gameData.score;
    }

    startTimer() {
        this.gameTimer = setInterval(() => {
            this.gameData.timeElapsed++;
            const timeLeft = this.gameData.timeLimit - this.gameData.timeElapsed;

            const timeElement = this.container.querySelector('#memory-time');
            if (timeElement) {
                timeElement.textContent = Math.max(0, timeLeft);

                // Warnung bei weniger als 30 Sekunden
                if (timeLeft <= 30 && timeLeft > 0) {
                    timeElement.parentNode.classList.add('warning');
                }

                // Kritisch bei weniger als 10 Sekunden
                if (timeLeft <= 10 && timeLeft > 0) {
                    timeElement.parentNode.classList.add('critical');
                }
            }

            // Zeit abgelaufen
            if (timeLeft <= 0) {
                this.gameTimeout();
            }
        }, 1000);
    }

    gameTimeout() {
        console.log('⏰ Game timeout');
        this.gameData.gameEnded = true;
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }

        // 🎮 GAME BALANCER INTEGRATION - Report timeout as loss
        if (window.gameBalancerAPI) {
            const gameResult = {
                won: false,
                score: this.gameData.score,
                time: this.gameData.timeElapsed,
                accuracy: (this.gameData.matchedPairs / this.gameData.totalPairs) * 100,
                maxCombo: this.gameData.maxCombo,
                difficulty: this.gameData.level
            };
            window.gameBalancerAPI.gameEnd('memory', gameResult);
        }

        this.playSound('wrong');
        this.showGameOverScreen('Zeit abgelaufen!', false);
    }

    gameComplete() {
        console.log('🎉 Game completed successfully!');
        this.gameData.gameEnded = true;
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }

        // Clear any active timers
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
            this.inactivityTimer = null;
        }

        // Bonus-Punkte berechnen
        const timeBonus = Math.max(0, (this.gameData.timeLimit - this.gameData.timeElapsed) * 5);
        const moveBonus = Math.max(0, (this.gameData.totalPairs * 2 - this.gameData.moves) * 10);
        const perfectBonus = this.gameData.moves === this.gameData.totalPairs ? 500 : 0;
        // 🔥 VERBESSERUNG #3: Combo Bonus
        const comboBonus = this.gameData.maxCombo > 1 ? this.gameData.maxCombo * 50 : 0;

        this.gameData.score += timeBonus + moveBonus + perfectBonus + comboBonus;

        // 🔥 VERBESSERUNG #5: Victory Dance Animation
        this.startVictoryDance();

        // 🔥 VERBESSERUNG #2: Enhanced Victory Sound & Haptic
        if (window.aquariumSounds) {
            window.aquariumSounds.playWin();
        } else {
            this.playSound('complete');
        }

        if (window.aquariumHaptics) {
            window.aquariumHaptics.perfect();
        }

        // 🎮 GAME BALANCER INTEGRATION - Report successful completion
        if (window.gameBalancerAPI) {
            const gameResult = {
                won: true,
                score: this.gameData.score,
                time: this.gameData.timeElapsed,
                accuracy: 100, // Found all pairs = 100% accuracy
                maxCombo: this.gameData.maxCombo,
                perfect: this.gameData.moves <= this.gameData.totalPairs * 2, // Perfect if no mistakes
                difficulty: this.gameData.level
            };
            window.gameBalancerAPI.gameEnd('memory', gameResult);

            // Update daily challenges
            window.gameBalancerAPI.updateChallenge('daily', 'daily_memory', 1);
        }

        this.saveScore();

        // Delay game over screen for victory animation
        setTimeout(() => {
            this.showGameOverScreen('Gratulation! Alle Paare gefunden!', true);
        }, 2000);
    }

    showGameOverScreen(message, success) {
        const level = DIFFICULTY_LEVELS[this.gameData.level];
        const gameTime = Date.now() - this.gameStartTime;
        const efficiency = Math.round((this.gameData.totalPairs / this.gameData.moves) * 100);

        const overlay = document.createElement('div');
        overlay.className = 'memory-game-overlay';
        overlay.innerHTML = `
            <div class="memory-game-over-screen">
                <div class="game-over-header ${success ? 'success' : 'failure'}">
                    <h2>${success ? '🏆' : '⏰'} ${message}</h2>
                </div>

                <div class="game-over-stats">
                    <div class="stat-row">
                        <span>Schwierigkeit:</span>
                        <span>${level.name} (${level.gridSize})</span>
                    </div>
                    <div class="stat-row">
                        <span>Gefundene Paare:</span>
                        <span>${this.gameData.matchedPairs}/${this.gameData.totalPairs}</span>
                    </div>
                    <div class="stat-row">
                        <span>Züge:</span>
                        <span>${this.gameData.moves}</span>
                    </div>
                    <div class="stat-row">
                        <span>Zeit:</span>
                        <span>${this.gameData.timeElapsed}s</span>
                    </div>
                    <div class="stat-row">
                        <span>Effizienz:</span>
                        <span>${efficiency}%</span>
                    </div>
                    <div class="stat-row total">
                        <span>Gesamtpunkte:</span>
                        <span>${this.gameData.score}</span>
                    </div>
                </div>

                ${success ? `
                    <div class="success-bonus-info">
                        <h3>🎁 Bonus-Informationen:</h3>
                        <p>Du hast alle österreichischen Süßwasser-Fischarten erfolgreich erkannt!</p>
                        <button class="gallery-link-btn" onclick="fishMemoryGame.openGallery()">
                            📷 Entdecke echte Bilder in unserer Vereins-Galerie
                        </button>
                    </div>
                ` : ''}

                <div class="game-over-actions">
                    <button class="memory-restart-btn" onclick="fishMemoryGame.restartGame()">
                        🔄 Nochmal spielen
                    </button>
                    <button class="memory-level-btn" onclick="fishMemoryGame.changeDifficulty()">
                        🎯 Schwierigkeit ändern
                    </button>
                    <button class="memory-exit-btn" onclick="fishMemoryGame.exitGame()">
                        🏠 Zur Startseite
                    </button>
                </div>
            </div>
        `;

        this.container.appendChild(overlay);
    }

    saveScore() {
        try {
            const scoreData = {
                level: this.gameData.level,
                score: this.gameData.score,
                moves: this.gameData.moves,
                timeElapsed: this.gameData.timeElapsed,
                matchedPairs: this.gameData.matchedPairs,
                totalPairs: this.gameData.totalPairs,
                date: new Date().toISOString(),
                gameVersion: '1.0'
            };

            // Lokaler Speicher
            const savedScores = JSON.parse(localStorage.getItem('fishMemoryScores') || '[]');
            savedScores.push(scoreData);

            // Behalte nur die besten 20 Scores pro Level
            const levelScores = savedScores.filter(s => s.level === this.gameData.level)
                                          .sort((a, b) => b.score - a.score)
                                          .slice(0, 20);

            const otherScores = savedScores.filter(s => s.level !== this.gameData.level);
            localStorage.setItem('fishMemoryScores', JSON.stringify([...levelScores, ...otherScores]));

            console.log('💾 Memory Game score saved successfully:', scoreData);
        } catch (error) {
            console.error('❌ Failed to save memory game score:', error);
        }
    }

    restartGame() {
        this.container.querySelector('.memory-game-overlay')?.remove();
        this.startGame();
    }

    changeDifficulty() {
        this.container.querySelector('.memory-game-overlay')?.remove();
        this.showStartScreen();
    }

    exitGame() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        this.showStartScreen();
    }

    openGallery() {
        // Scroll zur Bildergalerie oder öffne sie
        const gallerySection = document.querySelector('.gallery-section');
        if (gallerySection) {
            gallerySection.scrollIntoView({ behavior: 'smooth' });

            // Wechsle zu Bilder-Tab falls verfügbar
            const imageTab = document.querySelector('.tab-btn[data-tab="images"]');
            if (imageTab) {
                imageTab.click();
            }
        } else {
            // Fallback: Scroll zu Bildern
            const imageGallery = document.querySelector('.image-gallery');
            if (imageGallery) {
                imageGallery.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    // 🔥 VERBESSERUNG #3: Show Combo Notification
    showComboNotification(comboCount, points) {
        const notification = document.createElement('div');
        notification.className = 'combo-notification';
        notification.innerHTML = `
            <div class="combo-content">
                <div class="combo-title">🔥 ${comboCount}x COMBO!</div>
                <div class="combo-points">+${points} Punkte</div>
            </div>
        `;

        notification.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FFD700, #FF6B6B);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
            z-index: 1000;
            animation: comboAppear 1.5s ease-out forwards;
            font-weight: bold;
            text-align: center;
            border: 3px solid rgba(255, 255, 255, 0.3);
        `;

        this.container.appendChild(notification);
        setTimeout(() => notification.remove(), 1500);
    }

    // 🔥 VERBESSERUNG #4: Inactivity Hint System
    resetInactivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }

        if (this.gameData.gameStarted && !this.gameData.gameEnded) {
            this.inactivityTimer = setTimeout(() => {
                this.showInactivityHints();
            }, this.hintInterval);
        }
    }

    showInactivityHints() {
        if (this.gameData.gameEnded) return;

        // Find unmatched cards that can be flipped
        const availableCards = this.gameData.cards
            .map((card, index) => ({ card, index }))
            .filter(({ card }) => !card.isMatched && !card.isFlipped);

        if (availableCards.length < 2) return;

        // Pick 2 random cards to highlight
        const shuffled = availableCards.sort(() => Math.random() - 0.5);
        const hintCards = shuffled.slice(0, 2);

        hintCards.forEach(({ index }) => {
            const cardElement = this.container.querySelector(`[data-index="${index}"]`);
            if (cardElement) {
                cardElement.classList.add('hint-glow');
            }
        });

        // Remove hints after 2 seconds
        setTimeout(() => {
            this.clearHints();
            this.resetInactivityTimer(); // Start timer again
        }, 2000);
    }

    clearHints() {
        this.container.querySelectorAll('.hint-glow').forEach(card => {
            card.classList.remove('hint-glow');
        });
    }

    // 🔥 VERBESSERUNG #5: Victory Dance Animation
    startVictoryDance() {
        const cards = this.container.querySelectorAll('.memory-card.matched');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('victory-dance');
            }, index * 100);
        });

        // Add sparkle effects
        this.createSparkleEffects();
    }

    createSparkleEffects() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'victory-sparkle';
                sparkle.innerHTML = '✨';

                const x = Math.random() * this.container.offsetWidth;
                const y = Math.random() * this.container.offsetHeight;

                sparkle.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    font-size: ${20 + Math.random() * 20}px;
                    z-index: 999;
                    pointer-events: none;
                    animation: sparkleFloat 2s ease-out forwards;
                `;

                this.container.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 2000);
            }, i * 150);
        }
    }

    loadSounds() {
        // Optional: Lade Sounds für bessere UX
        try {
            this.sounds.flip = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp3KFQFAxGn+Hyvmm');
            this.sounds.match = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp3KFQFAxGn+Hyvmk');
            this.sounds.complete = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp3KFQFAxGn+Hyvmk');
            this.sounds.wrong = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp3KFQFAxGn+Hyvmk');
        } catch (error) {
            console.log('🔇 Audio not available, continuing without sound');
        }
    }

    playSound(type) {
        try {
            if (this.sounds[type] && typeof this.sounds[type].play === 'function') {
                this.sounds[type].currentTime = 0;
                this.sounds[type].volume = 0.3;
                this.sounds[type].play().catch(() => {
                    // Ignore audio play errors
                });
            }
        } catch (error) {
            // Ignore audio errors
        }
    }

    // 📊 PUBLIC API FOR PERFORMANCE MONITORING
    getPerformanceMetrics() {
        return {
            gameType: 'FishMemoryGame',
            level: this.gameData.level,
            isActive: this.gameData.gameStarted && !this.gameData.gameEnded,
            cardCount: this.gameData.cards.length,
            animationCount: this.container.querySelectorAll('.flipped, .matched').length,
            memoryUsage: this.calculateMemoryUsage()
        };
    }

    calculateMemoryUsage() {
        // Schätzung des Memory-Verbrauchs
        const baseMemory = 50; // KB für das Spiel selbst
        const cardMemory = this.gameData.cards.length * 2; // 2KB pro Karte
        const totalMemory = baseMemory + cardMemory;
        return Math.round(totalMemory);
    }

    // 🔧 CLEANUP METHOD
    destroy() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }

        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }

        console.log('🧠 Fish Memory Game destroyed');
    }
}

// 🌟 GLOBALE INSTANZ
let fishMemoryGame = null;

// 🚀 AUTO-INITIALISIERUNG
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('🧠 Initializing Fish Memory Game...');
        // Nur automatisch initialisieren, wenn ein entsprechender Platzhalter vorhanden ist
        const placeholder = document.getElementById('fish-memory-game-3');
        if (placeholder) {
            window.fishMemoryGame = new FishMemoryGame('fish-memory-game-3');
        }
    }, 2000); // Warte nach den anderen Spielen
});

// 🎨 CSS ENHANCEMENTS FOR ALL 5 IMPROVEMENTS
const memoryGameStyles = document.createElement('style');
memoryGameStyles.textContent = `
/* 🔥 VERBESSERUNG #1: Smooth Card-Flip Animations */
.memory-card {
    perspective: 1000px;
    transition: transform 0.1s ease;
}

.memory-card:hover:not(.flipped):not(.matched) {
    transform: scale(1.05);
    cursor: pointer;
}

.memory-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

.memory-card.flipping .memory-card-inner {
    animation: cardFlipStage1 0.3s ease-in-out forwards;
}

.memory-card.flipped .memory-card-inner {
    transform: rotateY(180deg);
}

.memory-card-front, .memory-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.memory-card-back {
    transform: rotateY(180deg);
    background: linear-gradient(135deg, rgba(78, 205, 196, 0.9), rgba(0, 105, 148, 0.9));
    color: white;
    border: 3px solid rgba(255, 255, 255, 0.3);
}

.memory-card-front {
    background: linear-gradient(135deg, rgba(0, 105, 148, 0.8), rgba(78, 205, 196, 0.8));
    border: 2px solid rgba(255, 255, 255, 0.2);
}

@keyframes cardFlipStage1 {
    0% { transform: rotateY(0deg) scale(1); }
    50% { transform: rotateY(90deg) scale(1.05); }
    100% { transform: rotateY(90deg) scale(1.05); }
}

/* 🔥 VERBESSERUNG #3: Combo Notifications */
@keyframes comboAppear {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
    }
    20% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.2);
    }
    40% {
        transform: translate(-50%, -50%) scale(1);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -80%) scale(1);
    }
}

.combo-notification {
    font-family: 'Arial', sans-serif;
    user-select: none;
    pointer-events: none;
}

.combo-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.combo-points {
    font-size: 18px;
    opacity: 0.9;
}

/* 🔥 VERBESSERUNG #4: Inactivity Hints */
.hint-glow {
    animation: hintGlow 2s ease-in-out infinite;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}

@keyframes hintGlow {
    0%, 100% {
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
        transform: scale(1);
    }
    50% {
        box-shadow: 0 0 25px rgba(255, 215, 0, 0.8);
        transform: scale(1.02);
    }
}

/* 🔥 VERBESSERUNG #5: Victory Dance Animations */
.victory-dance {
    animation: victoryBounce 1s ease-in-out infinite;
}

@keyframes victoryBounce {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    25% {
        transform: translateY(-10px) rotate(2deg);
    }
    50% {
        transform: translateY(-5px) rotate(-1deg);
    }
    75% {
        transform: translateY(-8px) rotate(1deg);
    }
}

@keyframes sparkleFloat {
    0% {
        opacity: 1;
        transform: translateY(0) rotate(0deg);
    }
    100% {
        opacity: 0;
        transform: translateY(-100px) rotate(360deg);
    }
}

/* Enhanced Matched Card Styling */
.memory-card.matched {
    opacity: 0.8;
    transform: scale(0.95);
    border: 3px solid #FFD700;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.memory-card.matched .memory-card-back {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(255, 107, 107, 0.9));
}

/* Responsive improvements for mobile */
@media (max-width: 768px) {
    .combo-notification {
        padding: 15px;
        border-radius: 12px;
    }

    .combo-title {
        font-size: 20px;
    }

    .combo-points {
        font-size: 16px;
    }

    .memory-card:hover:not(.flipped):not(.matched) {
        transform: scale(1.02);
    }
}
`;

document.head.appendChild(memoryGameStyles);

// 📤 EXPORT FÜR MODULE SYSTEM UND BROWSER
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FishMemoryGame, AUSTRIAN_FISH_PAIRS, DIFFICULTY_LEVELS };
}

// 🌐 BROWSER GLOBAL EXPORT (für Modal-System)
window.FishMemoryGame = FishMemoryGame;
window.AUSTRIAN_FISH_PAIRS = AUSTRIAN_FISH_PAIRS;
window.DIFFICULTY_LEVELS = DIFFICULTY_LEVELS;

console.log('🧠 Fish Memory Game module loaded and globally available');