/* 🐟 INTERAKTIVES FISCH-SPAWNING SYSTEM
   - Startet mit einem Fisch
   - Klick auf Fisch spawnt einen neuen
   - Maximal 10 Fische gleichzeitig
   - Bubble-Effekte beim Spawning
   - Verschiedene Fisch-Arten
*/

class InteractiveFishSpawner {
    constructor() {
        this.fishes = [];
        this.maxFishes = 10;
        this.fishTypes = [
            { emoji: '🐠', speed: 15, color: '#4ECDC4' },
            { emoji: '🐟', speed: 18, color: '#FF6B6B' },
            { emoji: '🐡', speed: 12, color: '#FFE66D' },
            { emoji: '🦈', speed: 25, color: '#006994' },
            { emoji: '🐙', speed: 10, color: '#8B5CF6' },
            { emoji: '🦐', speed: 20, color: '#FFA07A' },
            { emoji: '🦞', speed: 8, color: '#DC2626' }
        ];
        this.bubbles = [];
        this.init();
    }

    init() {
        this.createStyles();
        this.spawnFirstFish();
        this.startAnimationLoop();
        this.setupCleanup();
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .interactive-fish {
                position: fixed;
                font-size: 32px;
                cursor: pointer;
                z-index: 10;
                user-select: none;
                transition: transform 0.3s ease, z-index 0.3s ease;
                animation: swimming-motion 3s ease-in-out infinite;
                pointer-events: auto;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            }

            /* Hide fish during game */
            body.game-active .interactive-fish {
                z-index: -1;
                pointer-events: none;
                opacity: 0.2;
            }

            .interactive-fish:hover {
                transform: scale(1.2);
                filter: drop-shadow(0 0 10px var(--secondary-teal));
            }

            .interactive-fish.spawning {
                animation: spawn-fish 0.8s ease-out;
            }

            @keyframes spawn-fish {
                0% {
                    transform: scale(2.5) rotate(0deg);
                    opacity: 0.5;
                }
                50% {
                    transform: scale(1.5) rotate(180deg);
                    opacity: 0.9;
                }
                100% {
                    transform: scale(1) rotate(360deg);
                    opacity: 1;
                }
            }

            @keyframes swimming-motion {
                0%, 100% {
                    transform: translateY(0) rotate(0deg);
                }
                25% {
                    transform: translateY(-8px) rotate(2deg);
                }
                50% {
                    transform: translateY(5px) rotate(0deg);
                }
                75% {
                    transform: translateY(-5px) rotate(-2deg);
                }
            }

            .spawn-bubble {
                position: fixed;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 50%;
                pointer-events: none;
                z-index: 14;
                animation: bubble-rise-spawn 2s ease-out forwards;
            }

            @keyframes bubble-rise-spawn {
                0% {
                    transform: scale(0) translateY(0);
                    opacity: 1;
                }
                50% {
                    transform: scale(1) translateY(-30px);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(0.5) translateY(-80px);
                    opacity: 0;
                }
            }

            .fish-counter {
                position: fixed;
                top: 100px;
                right: 20px;
                background: rgba(255, 255, 255, 0.95);
                padding: 10px 15px;
                border-radius: 15px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 9999;  /* Höchste Priorität */
                font-family: 'Segoe UI', sans-serif;
                font-weight: bold;
                color: var(--primary-blue, #006994);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(78, 205, 196, 0.4);
                min-width: 120px;
                text-align: center;
            }

            /* Ensure counter stays visible during game */
            body.game-active .fish-counter {
                z-index: 9999;
            }

            .fish-counter .count {
                font-size: 18px;
                color: var(--secondary-teal, #4ECDC4);
            }

            .fish-counter .max-message {
                font-size: 12px;
                color: var(--accent-coral, #FF6B6B);
                margin-top: 5px;
            }

            .reset-fish-btn {
                background: linear-gradient(45deg, var(--accent-coral, #FF6B6B), #DC2626);
                color: white;
                border: 2px solid rgba(255, 107, 107, 0.3);
                padding: 10px 18px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 13px;
                margin-top: 8px;
                transition: all 0.3s ease;
                font-weight: bold;
                box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
            }

            .reset-fish-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
            }

            @media (max-width: 768px) {
                .interactive-fish {
                    font-size: 28px;
                }

                .fish-counter {
                    top: 80px;
                    right: 10px;
                    padding: 8px 12px;
                    font-size: 12px;
                }

                .fish-counter .count {
                    font-size: 16px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    spawnFirstFish() {
        this.createFishCounter();
        this.spawnFish(window.innerWidth / 2, window.innerHeight / 2, true);
    }

    createFishCounter() {
        const counter = document.createElement('div');
        counter.className = 'fish-counter';
        counter.id = 'fish-counter';
        counter.innerHTML = `
            <div>🐠 Fische: <span class="count">0</span>/${this.maxFishes}</div>
            <div style="font-size: 10px; margin-top: 3px;">Klicke auf Fische!</div>
            <button class="reset-fish-btn" onclick="window.fishSpawner?.resetAllFish()">
                🗑️ Reset
            </button>
        `;
        document.body.appendChild(counter);
    }

    spawnFish(x = null, y = null, isFirst = false) {
        if (this.fishes.length >= this.maxFishes && !isFirst) {
            this.showMaxFishMessage();
            return;
        }

        // Zufällige Position wenn nicht angegeben
        if (x === null || y === null) {
            x = Math.random() * (window.innerWidth - 100) + 50;
            y = Math.random() * (window.innerHeight - 200) + 100;
        }

        // Zufälligen Fisch-Typ wählen
        const fishType = this.fishTypes[Math.floor(Math.random() * this.fishTypes.length)];

        // Fisch-Element erstellen
        const fish = document.createElement('div');
        fish.className = 'interactive-fish';
        if (!isFirst) fish.classList.add('spawning');

        fish.textContent = fishType.emoji;
        fish.style.left = x + 'px';
        fish.style.top = y + 'px';
        fish.style.animationDuration = (fishType.speed + Math.random() * 10) + 's';

        // Fisch-Daten speichern
        const fishData = {
            element: fish,
            type: fishType,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            id: Date.now() + Math.random()
        };

        // Click-Handler hinzufügen
        fish.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onFishClick(fishData, e);
        });

        // Fisch zum DOM und Array hinzufügen
        document.body.appendChild(fish);
        this.fishes.push(fishData);

        // Bubble-Effekt beim Spawning
        if (!isFirst) {
            this.createSpawnBubbles(x, y);
        }

        this.updateCounter();

        console.log(`🐟 Spawned fish ${fishData.id}: ${fishType.emoji} at (${x}, ${y})`);
    }

    onFishClick(fishData, event) {
        // Bubble-Effekt am Klick-Punkt
        this.createClickBubbles(event.clientX, event.clientY);

        // Neuen Fisch in der Nähe spawnen
        const newX = fishData.x + (Math.random() - 0.5) * 200;
        const newY = fishData.y + (Math.random() - 0.5) * 200;

        // Bounds checking
        const clampedX = Math.max(50, Math.min(window.innerWidth - 100, newX));
        const clampedY = Math.max(100, Math.min(window.innerHeight - 150, newY));

        setTimeout(() => {
            this.spawnFish(clampedX, clampedY);
        }, 100);

        console.log(`🎯 Fish ${fishData.id} clicked! Spawning new fish nearby.`);
    }

    createSpawnBubbles(x, y) {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                this.createBubble(x, y, 'spawn');
            }, i * 100);
        }
    }

    createClickBubbles(x, y) {
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                this.createBubble(x, y, 'click');
            }, i * 50);
        }
    }

    createBubble(x, y, type) {
        const bubble = document.createElement('div');
        bubble.className = 'spawn-bubble';

        const size = type === 'spawn' ?
            (8 + Math.random() * 12) :
            (5 + Math.random() * 8);

        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = (x + (Math.random() - 0.5) * 40) + 'px';
        bubble.style.top = (y + (Math.random() - 0.5) * 40) + 'px';

        document.body.appendChild(bubble);

        // Bubble nach Animation entfernen
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, 2000);
    }

    showMaxFishMessage() {
        const counter = document.getElementById('fish-counter');
        if (counter) {
            const existing = counter.querySelector('.max-message');
            if (!existing) {
                const message = document.createElement('div');
                message.className = 'max-message';
                message.textContent = 'Maximum erreicht!';
                counter.appendChild(message);

                setTimeout(() => {
                    if (message.parentNode) {
                        message.parentNode.removeChild(message);
                    }
                }, 3000);
            }
        }

        console.log('🚫 Maximum number of fish reached!');
    }

    updateCounter() {
        const counter = document.querySelector('.fish-counter .count');
        if (counter) {
            counter.textContent = this.fishes.length;
        }
    }

    resetAllFish() {
        console.log('🗑️ Resetting all fish...');

        // Alle Fisch-Elemente entfernen
        this.fishes.forEach(fish => {
            if (fish.element && fish.element.parentNode) {
                fish.element.parentNode.removeChild(fish.element);
            }
        });

        // Array leeren
        this.fishes = [];

        // Counter aktualisieren
        this.updateCounter();

        // Ersten Fisch wieder spawnen
        setTimeout(() => {
            this.spawnFirstFish();
        }, 500);
    }

    startAnimationLoop() {
        // Schwimmende Bewegung für alle Fische
        setInterval(() => {
            this.fishes.forEach(fishData => {
                if (!fishData.element || !fishData.element.parentNode) return;

                // Sanfte zufällige Bewegung
                fishData.vx += (Math.random() - 0.5) * 0.1;
                fishData.vy += (Math.random() - 0.5) * 0.1;

                // Geschwindigkeit begrenzen
                fishData.vx = Math.max(-0.5, Math.min(0.5, fishData.vx));
                fishData.vy = Math.max(-0.5, Math.min(0.5, fishData.vy));

                // Position aktualisieren
                fishData.x += fishData.vx;
                fishData.y += fishData.vy;

                // Bounds checking mit "Bouncing"
                if (fishData.x < 0 || fishData.x > window.innerWidth - 50) {
                    fishData.vx *= -1;
                    fishData.x = Math.max(0, Math.min(window.innerWidth - 50, fishData.x));
                }

                if (fishData.y < 50 || fishData.y > window.innerHeight - 100) {
                    fishData.vy *= -1;
                    fishData.y = Math.max(50, Math.min(window.innerHeight - 100, fishData.y));
                }

                // DOM-Element aktualisieren
                fishData.element.style.left = fishData.x + 'px';
                fishData.element.style.top = fishData.y + 'px';

                // Fisch in Bewegungsrichtung drehen
                const rotation = Math.atan2(fishData.vy, fishData.vx) * 180 / Math.PI;
                fishData.element.style.transform = `rotate(${rotation}deg)`;
            });
        }, 100);
    }

    setupCleanup() {
        // Cleanup bei Seitenwechsel
        window.addEventListener('beforeunload', () => {
            this.resetAllFish();
        });

        // Cleanup bei Resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Fische innerhalb der neuen Grenzen halten
                this.fishes.forEach(fishData => {
                    fishData.x = Math.max(0, Math.min(window.innerWidth - 50, fishData.x));
                    fishData.y = Math.max(50, Math.min(window.innerHeight - 100, fishData.y));
                    if (fishData.element) {
                        fishData.element.style.left = fishData.x + 'px';
                        fishData.element.style.top = fishData.y + 'px';
                    }
                });
            }, 250);
        });
    }

    // Öffentliche API
    getFishCount() {
        return this.fishes.length;
    }

    getMaxFishCount() {
        return this.maxFishes;
    }

    setMaxFishCount(count) {
        this.maxFishes = Math.max(1, Math.min(20, count));
        this.updateCounter();
    }
}

// Auto-Init
let fishSpawner = null;

document.addEventListener('DOMContentLoaded', () => {
    // Warte kurz, damit andere Scripts laden können
    setTimeout(() => {
        console.log('🐟 Initializing Interactive Fish Spawner...');
        fishSpawner = new InteractiveFishSpawner();

        // Global verfügbar machen
        window.fishSpawner = fishSpawner;

        console.log('🎉 Fish Spawner ready! Click on fish to spawn more!');
    }, 2000);
});

// Export für andere Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveFishSpawner;
}