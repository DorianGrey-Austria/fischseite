/* 🐠 STABLE FISH SPAWNER
   Löst das Problem mit instabilen Fish-Elementen
   Ermöglicht zuverlässiges Click-Spawning
*/

class StableFishSpawner {
    constructor() {
        this.fishes = new Map();
        this.maxFishes = 15;
        this.fishId = 0;
        this.clickCooldown = new Set(); // Prevent rapid clicking
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        // Create stable styles without interfering animations
        this.createStableStyles();

        // Set up event delegation for stable clicking
        this.setupStableEventHandling();

        // Create initial fish
        this.createInitialFish();

        this.initialized = true;
        console.log('🐠 Stable Fish Spawner initialized');
    }

    createStableStyles() {
        const style = document.createElement('style');
        style.id = 'stable-fish-styles';
        style.textContent = `
            .stable-fish {
                position: fixed;
                font-size: 32px;
                cursor: pointer;
                user-select: none;
                z-index: 100;
                transition: none; /* Remove transitions that cause instability */
                pointer-events: auto;
                filter: drop-shadow(0 2px 4px rgba(0,105,148,0.2));
            }

            .stable-fish:hover {
                filter: drop-shadow(0 4px 12px currentColor);
                transform: scale(1.1);
            }

            .stable-fish.spawning {
                animation: stable-spawn 0.6s ease-out;
            }

            @keyframes stable-spawn {
                0% {
                    transform: scale(0.5);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.2);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            .stable-fish.swimming {
                animation: stable-swim 4s ease-in-out infinite;
            }

            @keyframes stable-swim {
                0%, 100% { transform: translateY(0px) translateX(0px); }
                25% { transform: translateY(-5px) translateX(2px); }
                75% { transform: translateY(5px) translateX(-2px); }
            }
        `;
        document.head.appendChild(style);
    }

    setupStableEventHandling() {
        // Use event delegation to avoid attaching/detaching listeners
        document.addEventListener('click', (e) => {
            const fishEl = e.target.closest('.stable-fish');
            if (!fishEl) return;

            e.preventDefault();
            e.stopPropagation();

            const fishId = fishEl.dataset.fishId;

            // Cooldown check
            if (this.clickCooldown.has(fishId)) return;

            this.handleFishClick(e, fishEl);
        }, { capture: true });

        // Touch support
        document.addEventListener('touchstart', (e) => {
            const fishEl = e.target.closest('.stable-fish');
            if (!fishEl) return;

            e.preventDefault();
            const touch = e.touches[0];

            // Convert touch to click-like event
            this.handleFishClick({
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => {},
                stopPropagation: () => {}
            }, fishEl);
        }, { passive: false });
    }

    handleFishClick(e, fishEl) {
        const fishId = fishEl.dataset.fishId;

        // Add cooldown
        this.clickCooldown.add(fishId);
        setTimeout(() => this.clickCooldown.delete(fishId), 500);

        // Visual feedback
        this.showClickFeedback(fishEl);

        // Spawn new fish near click position
        const spawnX = e.clientX + (Math.random() - 0.5) * 100;
        const spawnY = e.clientY + (Math.random() - 0.5) * 100;

        this.spawnFish(spawnX, spawnY);

        console.log('🐠 Fish clicked, spawning new fish');
    }

    showClickFeedback(fishEl) {
        // Quick scale feedback without affecting stability
        const originalTransform = fishEl.style.transform || '';
        fishEl.style.transform = originalTransform + ' scale(1.3)';

        setTimeout(() => {
            fishEl.style.transform = originalTransform;
        }, 200);
    }

    spawnFish(x, y, fishType = null) {
        if (this.fishes.size >= this.maxFishes) {
            console.log('🐠 Max fish limit reached');
            return null;
        }

        const fishEmojis = ['🐠', '🐟', '🐡', '🦈', '🦐', '🦞', '🐙'];
        const emoji = fishType || fishEmojis[Math.floor(Math.random() * fishEmojis.length)];
        const id = `stable-fish-${++this.fishId}`;

        // Ensure spawn position is within viewport
        const safeX = Math.max(50, Math.min(x, window.innerWidth - 50));
        const safeY = Math.max(50, Math.min(y, window.innerHeight - 50));

        const fish = {
            id: id,
            emoji: emoji,
            x: safeX,
            y: safeY,
            element: null,
            spawnTime: Date.now()
        };

        // Create stable DOM element
        const el = document.createElement('div');
        el.className = 'stable-fish spawning';
        el.dataset.fishId = id;
        el.innerHTML = emoji;
        el.title = `${emoji} Click to spawn more fish!`;

        // Position without transforms that cause instability
        el.style.left = `${safeX}px`;
        el.style.top = `${safeY}px`;

        // Add to DOM immediately for stability
        document.body.appendChild(el);

        // Add swimming animation after spawn animation
        setTimeout(() => {
            el.classList.remove('spawning');
            el.classList.add('swimming');
        }, 600);

        // Auto-remove after lifetime
        setTimeout(() => {
            this.removeFish(id);
        }, 20000); // 20 seconds lifetime

        fish.element = el;
        this.fishes.set(id, fish);

        return fish;
    }

    removeFish(id) {
        const fish = this.fishes.get(id);
        if (!fish || !fish.element) return;

        fish.element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fish.element.style.opacity = '0';
        fish.element.style.transform = 'scale(0.5)';

        setTimeout(() => {
            if (fish.element && fish.element.parentNode) {
                fish.element.remove();
            }
            this.fishes.delete(id);
        }, 500);
    }

    createInitialFish() {
        // Create one stable starter fish
        const centerX = window.innerWidth * 0.3;
        const centerY = window.innerHeight * 0.4;

        this.spawnFish(centerX, centerY, '🐠');
    }

    // Cleanup method
    cleanup() {
        this.fishes.forEach((fish, id) => {
            this.removeFish(id);
        });
        this.fishes.clear();

        const styleEl = document.getElementById('stable-fish-styles');
        if (styleEl) styleEl.remove();

        this.initialized = false;
        console.log('🐠 Stable Fish Spawner cleaned up');
    }

    // Status for debugging
    getStatus() {
        return {
            fishCount: this.fishes.size,
            maxFishes: this.maxFishes,
            initialized: this.initialized,
            cooldownActive: this.clickCooldown.size
        };
    }
}

// Initialize when DOM ready
window.stableFishSpawner = new StableFishSpawner();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.stableFishSpawner.init();
    });
} else {
    window.stableFishSpawner.init();
}