/* 🎮 KEYBOARD NAVIGATION SYSTEM
 * Universal keyboard controls for all games
 *
 * Global Shortcuts:
 * - ESC: Pause/Resume current game
 * - SPACE: Pause/Resume current game
 * - P: Pause/Resume current game
 * - R: Restart current game
 * - Enter: Start game / Confirm action
 * - Numbers 1-8: Quick select (Racing, Memory difficulties)
 * - Arrow Keys: Navigate menus
 *
 * Game-Specific:
 * - Collector: Click to collect (mouse only)
 * - Memory: Tab to navigate cards, Enter to flip
 * - Racing: Space to boost selected fish
 * - Builder: Arrow keys to navigate items
 */

(function() {
    'use strict';

    console.log('⌨️ Keyboard Navigation System loading...');

    class KeyboardNavigationManager {
        constructor() {
            this.activeGame = null;
            this.keyBindings = new Map();
            this.setupGlobalHandlers();
            console.log('⌨️ Keyboard Navigation initialized');
        }

        setupGlobalHandlers() {
            document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));

            // Track active game (auto-detect from window globals)
            setInterval(() => this.detectActiveGame(), 500);
        }

        detectActiveGame() {
            // Auto-detect which game is currently active
            if (window.aquariumGame1?.gameActive) {
                this.activeGame = { type: 'collector', instance: window.aquariumGame1 };
            } else if (window.aquariumGame2?.gameActive) {
                this.activeGame = { type: 'collector', instance: window.aquariumGame2 };
            } else if (window.fishRacingGame?.raceInProgress) {
                this.activeGame = { type: 'racing', instance: window.fishRacingGame };
            } else if (window.fishMemoryGame?.gameActive) {
                this.activeGame = { type: 'memory', instance: window.fishMemoryGame };
            } else if (window.aquariumBuilderGame?.gameActive) {
                this.activeGame = { type: 'builder', instance: window.aquariumBuilderGame };
            } else {
                this.activeGame = null;
            }
        }

        handleGlobalKeydown(e) {
            // Ignore if typing in input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            const key = e.key.toLowerCase();
            const game = this.activeGame;

            // 🌐 GLOBAL SHORTCUTS (all games)
            switch(key) {
                case 'escape':
                case 'p':
                    e.preventDefault();
                    this.handlePauseToggle();
                    return;

                case ' ': // Space
                    e.preventDefault();
                    if (game?.type === 'racing') {
                        this.handleRacingBoost();
                    } else {
                        this.handlePauseToggle();
                    }
                    return;

                case 'r':
                    e.preventDefault();
                    this.handleRestart();
                    return;

                case 'h':
                case '?':
                    e.preventDefault();
                    this.showKeyboardHelp();
                    return;
            }

            // 🎮 GAME-SPECIFIC SHORTCUTS
            if (game) {
                switch(game.type) {
                    case 'memory':
                        this.handleMemoryKeys(e, game.instance);
                        break;
                    case 'builder':
                        this.handleBuilderKeys(e, game.instance);
                        break;
                    case 'racing':
                        this.handleRacingKeys(e, game.instance);
                        break;
                }
            }
        }

        handlePauseToggle() {
            const game = this.activeGame;
            if (!game) return;

            try {
                switch(game.type) {
                    case 'collector':
                        if (game.instance.togglePause) {
                            game.instance.togglePause();
                        }
                        break;
                    case 'racing':
                        if (game.instance.toggleRacePause) {
                            game.instance.toggleRacePause();
                        }
                        break;
                    case 'memory':
                        // Memory doesn't have pause yet - could be added
                        console.log('⏸️ Pause not available for Memory game');
                        break;
                    case 'builder':
                        // Builder doesn't have pause - doesn't need it
                        console.log('⏸️ Pause not applicable for Builder game');
                        break;
                }
                console.log('⌨️ Pause toggled via keyboard');
            } catch(e) {
                console.warn('⌨️ Pause toggle failed:', e);
            }
        }

        handleRestart() {
            const game = this.activeGame;
            if (!game) return;

            if (confirm('Restart current game?')) {
                try {
                    switch(game.type) {
                        case 'collector':
                            game.instance.restartGame?.();
                            break;
                        case 'racing':
                            game.instance.resetRace?.();
                            break;
                        case 'memory':
                            game.instance.resetGame?.();
                            break;
                        case 'builder':
                            game.instance.resetGame?.();
                            break;
                    }
                    console.log('⌨️ Game restarted via keyboard');
                } catch(e) {
                    console.warn('⌨️ Restart failed:', e);
                }
            }
        }

        handleMemoryKeys(e, instance) {
            const key = e.key.toLowerCase();

            // Number keys: Quick start with difficulty
            if (/^[1-3]$/.test(key)) {
                const difficultyMap = { '1': 'easy', '2': 'medium', '3': 'hard' };
                if (instance.startGame && !instance.gameActive) {
                    e.preventDefault();
                    instance.startGame(difficultyMap[key]);
                    console.log(`⌨️ Memory started with ${difficultyMap[key]} difficulty`);
                }
            }
        }

        handleBuilderKeys(e, instance) {
            const key = e.key;

            // Arrow keys: Navigate builder items (future enhancement)
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                e.preventDefault();
                // Builder navigation could be enhanced here
                console.log(`⌨️ Builder navigation: ${key}`);
            }

            // U/Z: Undo/Redo (if implemented)
            if ((e.ctrlKey || e.metaKey) && key === 'z') {
                e.preventDefault();
                if (instance.undo) {
                    instance.undo();
                    console.log('⌨️ Builder: Undo');
                }
            }
        }

        handleRacingKeys(e, instance) {
            const key = e.key.toLowerCase();

            // Number keys 1-8: Select fish
            if (/^[1-8]$/.test(key) && !instance.raceInProgress) {
                e.preventDefault();
                const fishIds = instance.raceFish.map(f => f.id);
                const fishId = fishIds[parseInt(key) - 1];
                if (fishId) {
                    instance.selectFish(fishId);
                    console.log(`⌨️ Selected fish: ${fishId}`);
                }
            }

            // Enter: Start race (if fish selected)
            if (key === 'enter' && instance.selectedFish && !instance.raceInProgress) {
                e.preventDefault();
                const startBtn = document.getElementById('start-race-btn');
                if (startBtn && !startBtn.disabled) {
                    startBtn.click();
                    console.log('⌨️ Race started via keyboard');
                }
            }
        }

        handleRacingBoost() {
            const game = this.activeGame;
            if (game?.type === 'racing' && game.instance.raceInProgress) {
                const selectedFish = game.instance.selectedFish;
                if (selectedFish) {
                    game.instance.boostFish(selectedFish);
                    console.log(`⌨️ Boosted fish: ${selectedFish}`);
                }
            }
        }

        showKeyboardHelp() {
            const helpModal = document.createElement('div');
            helpModal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 100000;
                animation: fadeIn 0.3s ease-out;
            `;

            helpModal.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #006994, #4ECDC4);
                    padding: 30px;
                    border-radius: 20px;
                    max-width: 600px;
                    color: white;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    font-family: Arial, sans-serif;
                ">
                    <h2 style="margin-top: 0; font-size: 28px;">⌨️ Keyboard Shortcuts</h2>

                    <div style="margin: 20px 0;">
                        <h3 style="font-size: 20px; color: #FFD700;">🌐 Global Shortcuts</h3>
                        <table style="width: 100%; font-size: 14px; line-height: 2;">
                            <tr><td><strong>ESC / P</strong></td><td>Pause/Resume game</td></tr>
                            <tr><td><strong>SPACE</strong></td><td>Pause or Boost (Racing)</td></tr>
                            <tr><td><strong>R</strong></td><td>Restart current game</td></tr>
                            <tr><td><strong>H / ?</strong></td><td>Show this help</td></tr>
                        </table>
                    </div>

                    <div style="margin: 20px 0;">
                        <h3 style="font-size: 20px; color: #FFD700;">🏁 Racing Game</h3>
                        <table style="width: 100%; font-size: 14px; line-height: 2;">
                            <tr><td><strong>1-8</strong></td><td>Select fish 1-8</td></tr>
                            <tr><td><strong>ENTER</strong></td><td>Start race</td></tr>
                            <tr><td><strong>SPACE</strong></td><td>Boost your fish</td></tr>
                        </table>
                    </div>

                    <div style="margin: 20px 0;">
                        <h3 style="font-size: 20px; color: #FFD700;">🧠 Memory Game</h3>
                        <table style="width: 100%; font-size: 14px; line-height: 2;">
                            <tr><td><strong>1/2/3</strong></td><td>Start Easy/Medium/Hard</td></tr>
                        </table>
                    </div>

                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: white;
                        color: #006994;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                        margin-top: 20px;
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        Got it! ✓
                    </button>
                </div>
            `;

            document.body.appendChild(helpModal);

            // Close on ESC or background click
            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) helpModal.remove();
            });

            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    helpModal.remove();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);

            console.log('⌨️ Keyboard help shown');
        }
    }

    // 🚀 INITIALIZE
    window.keyboardNavigationManager = new KeyboardNavigationManager();

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes powerUpAppear {
            0% { transform: translateX(-50%) translateY(-20px) scale(0.8); opacity: 0; }
            100% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
        }

        @keyframes powerUpDisappear {
            0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 1; }
            100% { transform: translateX(-50%) translateY(20px) scale(0.8); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    console.log('⌨️ Keyboard Navigation System loaded successfully!');
})();
