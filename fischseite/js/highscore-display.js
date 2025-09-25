/* 🏆 HIGHSCORE DISPLAY SYSTEM
   - Schmales Streifen-Design
   - 3-5 Namen übereinander, endlos wiederholt
   - Live Updates mit Supabase
   - Elegante Scroll-Animation
*/

class HighscoreDisplay {
    constructor(containerId = 'highscore-strip') {
        this.containerId = containerId;
        this.container = null;
        this.highscoreManager = null;
        this.currentHighscores = [];
        this.animationFrame = null;
        this.scrollOffset = 0;
        this.itemHeight = 50; // Höhe pro Highscore-Eintrag
        this.visibleItems = 5; // Anzahl sichtbarer Items
        this.scrollSpeed = 0.5; // Pixel pro Frame
        this.isScrolling = true;
        this.newScoreHighlight = null; // Für neue Score Highlights
        this.particleEffects = [];

        this.init();
    }

    async init() {
        try {
            this.createContainer();
            this.createStyles();

            // Supabase Manager laden
            if (window.SupabaseHighscoreManager) {
                this.highscoreManager = new SupabaseHighscoreManager();

                // Warte bis Supabase verbunden ist
                await this.waitForConnection();

                // Initiale Highscores laden
                await this.loadHighscores();

                // Auto-Refresh alle 30 Sekunden
                setInterval(() => this.refresh(), 30000);

                // Start Animation
                this.startScrollAnimation();

                console.log('🏆 Highscore Display System initialized successfully!');
            } else {
                console.warn('⚠️ SupabaseHighscoreManager not available, showing placeholder');
                this.showPlaceholder();
            }

        } catch (error) {
            console.error('Error initializing Highscore Display:', error);
            this.showError();
        }
    }

    async waitForConnection() {
        return new Promise((resolve) => {
            const checkConnection = () => {
                if (this.highscoreManager && this.highscoreManager.isConnected) {
                    resolve();
                } else {
                    setTimeout(checkConnection, 500);
                }
            };
            checkConnection();
        });
    }

    createContainer() {
        // Finde oder erstelle Container
        this.container = document.getElementById(this.containerId);

        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = this.containerId;
            this.container.className = 'highscore-strip';

            // Füge zum Body hinzu (kann später verschoben werden)
            document.body.appendChild(this.container);
        }

        // Standardmäßig verstecken - wird erst nach Spielende angezeigt
        this.container.style.display = 'none';

        this.container.innerHTML = `
            <div class="highscore-strip-header">
                <h3>🏆 Top Scores 🏆</h3>
                <div class="live-indicator">
                    <span class="pulse-dot"></span>
                    <span>LIVE</span>
                </div>
                <div class="strip-controls">
                    <button id="toggle-scroll" class="control-btn" title="Scroll pausieren/fortsetzen">⏸️</button>
                    <button id="refresh-scores" class="control-btn" title="Aktualisieren">🔄</button>
                </div>
            </div>
            <div class="highscore-viewport">
                <div class="highscore-scroll-container" id="scroll-container">
                    <!-- Highscore Einträge werden hier eingefügt -->
                </div>
            </div>
            <div class="highscore-strip-footer">
                <div class="strip-status" id="strip-status">Loading...</div>
            </div>
        `;

        // Event Listeners
        document.getElementById('toggle-scroll').addEventListener('click', () => this.toggleScroll());
        document.getElementById('refresh-scores').addEventListener('click', () => this.refresh());

        // Hover zum Pausieren
        this.container.addEventListener('mouseenter', () => this.pauseScroll());
        this.container.addEventListener('mouseleave', () => this.resumeScroll());
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .highscore-strip {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                width: 280px;
                height: 350px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                border: 2px solid rgba(78, 205, 196, 0.3);
                z-index: 1000;
                font-family: 'Segoe UI', sans-serif;
                overflow: hidden;
                transition: all 0.3s ease;
            }

            .highscore-strip:hover {
                transform: translateY(-50%) scale(1.02);
                box-shadow: 0 12px 30px rgba(0,0,0,0.2);
            }

            .highscore-strip-header {
                background: linear-gradient(45deg, var(--secondary-teal, #4ECDC4), var(--primary-blue, #006994));
                color: white;
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .highscore-strip-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: bold;
            }

            .strip-controls {
                display: flex;
                gap: 8px;
            }

            .control-btn {
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .control-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .highscore-viewport {
                height: 250px;
                overflow: hidden;
                position: relative;
                background: linear-gradient(180deg, #f0f8ff 0%, #e6f3ff 100%);
            }

            .highscore-scroll-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                transition: transform 0.1s linear;
            }

            .highscore-item {
                height: 50px;
                padding: 8px 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(78, 205, 196, 0.2);
                transition: all 0.3s ease;
                background: rgba(255, 255, 255, 0.7);
            }

            .highscore-item:nth-child(odd) {
                background: rgba(240, 248, 255, 0.8);
            }

            .highscore-item.perfect-score {
                background: linear-gradient(90deg, rgba(255, 215, 0, 0.3), rgba(255, 223, 0, 0.1));
                border-left: 3px solid #FFD700;
            }

            .highscore-item:hover {
                background: rgba(78, 205, 196, 0.2);
                transform: translateX(5px);
            }

            .score-rank {
                font-weight: bold;
                font-size: 14px;
                color: var(--primary-blue, #006994);
                min-width: 30px;
            }

            .score-name {
                flex: 1;
                font-size: 13px;
                font-weight: 600;
                color: #333;
                margin: 0 8px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .score-value {
                font-weight: bold;
                font-size: 12px;
                color: var(--secondary-teal, #4ECDC4);
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 1px;
            }

            .score-points {
                font-size: 14px;
            }

            .score-details {
                font-size: 10px;
                color: #666;
                opacity: 0.8;
            }

            .highscore-strip-footer {
                background: rgba(240, 248, 255, 0.9);
                padding: 8px 15px;
                border-top: 1px solid rgba(78, 205, 196, 0.2);
            }

            .strip-status {
                font-size: 11px;
                color: #666;
                text-align: center;
            }

            .strip-status.loading::after {
                content: '...';
                animation: loading-dots 1.5s infinite;
            }

            @keyframes loading-dots {
                0%, 20% { content: ''; }
                40% { content: '.'; }
                60% { content: '..'; }
                80%, 100% { content: '...'; }
            }

            .perfect-badge {
                background: linear-gradient(45deg, #FFD700, #FFA500);
                color: white;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 10px;
                margin-left: 5px;
                font-weight: bold;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }

            /* Mobile Anpassungen */
            @media (max-width: 768px) {
                .highscore-strip {
                    right: 10px;
                    width: 260px;
                    height: 320px;
                }

                .highscore-viewport {
                    height: 220px;
                }

                .highscore-item {
                    height: 44px;
                    padding: 6px 12px;
                }

                .score-name {
                    font-size: 12px;
                }
            }

            /* Scroll-Animation pausiert */
            .scroll-paused .highscore-scroll-container {
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    async loadHighscores() {
        if (!this.highscoreManager) return;

        try {
            const scores = await this.highscoreManager.getTopHighscores(50);
            this.currentHighscores = scores;
            this.renderHighscores();
            this.updateStatus(`${scores.length} Scores geladen`);
        } catch (error) {
            console.error('Error loading highscores:', error);
            this.updateStatus('Fehler beim Laden');
        }
    }

    renderHighscores() {
        const scrollContainer = document.getElementById('scroll-container');
        if (!scrollContainer) return;

        if (this.currentHighscores.length === 0) {
            scrollContainer.innerHTML = '<div class="highscore-item"><div class="score-name">Noch keine Highscores</div></div>';
            return;
        }

        // Erstelle doppelte Liste für nahtloses Scrollen
        const duplicatedScores = [...this.currentHighscores, ...this.currentHighscores];

        let html = '';
        duplicatedScores.forEach((score, index) => {
            const rank = (index % this.currentHighscores.length) + 1;
            const isPerfectScore = score.collected_items === 20;
            const timePlayed = new Date(score.created_at).toLocaleDateString('de-DE');

            html += `
                <div class="highscore-item ${isPerfectScore ? 'perfect-score' : ''}">
                    <div class="score-rank">#${rank}</div>
                    <div class="score-name">
                        ${score.player_name}
                        ${isPerfectScore ? '<span class="perfect-badge">20/20</span>' : ''}
                    </div>
                    <div class="score-value">
                        <div class="score-points">${score.score}</div>
                        <div class="score-details">${score.collected_items}/20 • ${timePlayed}</div>
                    </div>
                </div>
            `;
        });

        scrollContainer.innerHTML = html;
    }

    startScrollAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const animate = () => {
            if (this.isScrolling && this.currentHighscores.length > 0) {
                this.scrollOffset += this.scrollSpeed;

                // Reset bei Ende der ersten Liste
                const maxScroll = this.currentHighscores.length * this.itemHeight;
                if (this.scrollOffset >= maxScroll) {
                    this.scrollOffset = 0;
                }

                const scrollContainer = document.getElementById('scroll-container');
                if (scrollContainer) {
                    scrollContainer.style.transform = `translateY(-${this.scrollOffset}px)`;
                }
            }

            this.animationFrame = requestAnimationFrame(animate);
        };

        animate();
    }

    pauseScroll() {
        this.isScrolling = false;
        this.container.classList.add('scroll-paused');
    }

    resumeScroll() {
        this.isScrolling = true;
        this.container.classList.remove('scroll-paused');
    }

    toggleScroll() {
        const btn = document.getElementById('toggle-scroll');
        if (this.isScrolling) {
            this.pauseScroll();
            btn.textContent = '▶️';
            btn.title = 'Scroll fortsetzen';
        } else {
            this.resumeScroll();
            btn.textContent = '⏸️';
            btn.title = 'Scroll pausieren';
        }
    }

    async refresh() {
        const btn = document.getElementById('refresh-scores');
        btn.style.transform = 'rotate(360deg)';

        this.updateStatus('Aktualisiere...');
        await this.loadHighscores();

        setTimeout(() => {
            btn.style.transform = 'rotate(0deg)';
        }, 500);
    }

    updateStatus(message) {
        const status = document.getElementById('strip-status');
        if (status) {
            status.textContent = message;
            status.className = 'strip-status';
        }
    }

    showPlaceholder() {
        const mockScores = [
            { player_name: 'AquaProfi', score: 520, collected_items: 20, created_at: new Date() },
            { player_name: 'FischMeister', score: 480, collected_items: 19, created_at: new Date() },
            { player_name: 'UnterwasserHeld', score: 450, collected_items: 18, created_at: new Date() },
            { player_name: 'KorallenKönig', score: 420, collected_items: 20, created_at: new Date() },
            { player_name: 'TaucherTom', score: 390, collected_items: 17, created_at: new Date() }
        ];

        this.currentHighscores = mockScores;
        this.renderHighscores();
        this.startScrollAnimation();
        this.updateStatus('Demo-Modus (offline)');
    }

    showAfterGameEnd() {
        // Zeige die Highscore-Liste nach dem Spielende
        if (this.container) {
            this.container.style.display = 'block';
            console.log('🏆 Highscore-Liste wird nach Spielende angezeigt');
        }
    }

    hideDisplay() {
        // Verstecke die Highscore-Liste
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    showError() {
        this.container.innerHTML = `
            <div class="highscore-strip-header">
                <h3>🏆 Top Scores</h3>
            </div>
            <div class="highscore-viewport">
                <div style="padding: 20px; text-align: center; color: #666;">
                    ⚠️ Fehler beim Laden der Highscores
                </div>
            </div>
        `;
    }

    // Öffentliche API
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.container && this.container.parentNode) {
            this.container.remove();
        }
    }

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    show() {
        if (this.container) {
            this.container.style.display = 'block';
        }
    }
}

// Auto-Init und globale Instanz
let highscoreDisplayInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    // Warte kurz, damit andere Scripts laden können
    setTimeout(() => {
        console.log('🏆 Initializing Highscore Display System...');
        highscoreDisplayInstance = new HighscoreDisplay();

        // Global verfügbar machen
        window.HighscoreDisplay = highscoreDisplayInstance;

        console.log('🎉 Highscore Display ready!');
    }, 3000);
});

// Export für andere Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HighscoreDisplay;
}