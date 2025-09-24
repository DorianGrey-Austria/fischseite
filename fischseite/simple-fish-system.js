/* 🐟 SIMPLE PROFESSIONAL FISH SYSTEM
 * Ultra-reliable fish system based on user requirements:
 * - One fish at startup
 * - Click = spawn new fish
 * - Long press = remove fish
 * - All fish swim right (correct direction)
 * - Transparent background, opaque foreground
 * - Performance optimized
 */

(function() {
    'use strict';

    // Fish metadata for direction intelligence
    const FISH_METADATA = {
        '🐠': { needsFlip: true, name: 'tropical' },
        '🐟': { needsFlip: true, name: 'fish' },
        '🐡': { needsFlip: true, name: 'blowfish' },
        '🦈': { needsFlip: true, name: 'shark' },
        '🐙': { needsFlip: false, name: 'octopus' },
        '🦐': { needsFlip: false, name: 'shrimp' },
        '🦞': { needsFlip: false, name: 'lobster' }
    };

    const FISH_TYPES = [
        { emoji: '🐠', speed: 1.8, color: '#4ECDC4' },
        { emoji: '🐟', speed: 2.1, color: '#FF6B6B' },
        { emoji: '🐡', speed: 1.5, color: '#FFE66D' },
        { emoji: '🦈', speed: 2.8, color: '#006994' },
        { emoji: '🐙', speed: 1.3, color: '#8B5CF6' },
        { emoji: '🦐', speed: 2.3, color: '#FFA07A' },
        { emoji: '🦞', speed: 1.0, color: '#DC2626' }
    ];

    class SimpleFishSystem {
        constructor() {
            this.fishes = new Map();
            this.fishCounter = 0;
            this.maxFishes = 20;
            this.longPressDelay = 500;
            this.pressTimers = new Map();
            this.animationId = null;
            this.lastUpdate = performance.now();

            console.log('🐟 Simple Fish System initializing...');
            this.init();
        }

        init() {
            this.cleanup();
            this.createStyles();
            this.setupEventListeners();
            this.spawnInitialFish();
            this.startAnimation();

            // Make globally available
            window.fishSystem = this;

            console.log('🐟 Simple Fish System ready!');
            console.log('📖 Controls: Click = Spawn Fish | Long-Press = Remove Fish');
        }

        createStyles() {
            const style = document.createElement('style');
            style.id = 'simple-fish-styles';
            style.textContent = `
                .simple-fish {
                    position: fixed;
                    font-size: 32px;
                    cursor: pointer;
                    user-select: none;
                    pointer-events: auto;
                    transition: all 0.2s ease;
                    will-change: transform;
                }

                .simple-fish-foreground {
                    z-index: 150;
                    opacity: 0.9;
                }

                .simple-fish-background {
                    z-index: 50;
                    opacity: 0.4;
                    filter: brightness(0.8);
                }

                .simple-fish:hover {
                    transform: scale(1.2) !important;
                    filter: drop-shadow(0 0 10px currentColor) !important;
                    z-index: 200 !important;
                }
            `;

            // Remove old styles
            const oldStyle = document.getElementById('simple-fish-styles');
            if (oldStyle) oldStyle.remove();

            document.head.appendChild(style);
        }

        setupEventListeners() {
            // Mouse events
            document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            document.addEventListener('mouseup', (e) => this.handleMouseUp(e));

            // Touch events
            document.addEventListener('touchstart', (e) => this.handleTouchStart(e));
            document.addEventListener('touchend', (e) => this.handleTouchEnd(e));

            // Cleanup on unload
            window.addEventListener('beforeunload', () => this.cleanup());
        }

        handleMouseDown(e) {
            const fishEl = e.target.closest('.simple-fish');
            if (fishEl) {
                e.preventDefault();
                this.startLongPressTimer(fishEl.dataset.fishId);
            }
        }

        handleMouseUp(e) {
            const fishEl = e.target.closest('.simple-fish');
            if (fishEl) {
                const fishId = fishEl.dataset.fishId;
                if (this.pressTimers.has(fishId)) {
                    clearTimeout(this.pressTimers.get(fishId));
                    this.pressTimers.delete(fishId);
                    this.spawnNewFish(e.clientX, e.clientY);
                }
            }
        }

        handleTouchStart(e) {
            const fishEl = e.target.closest('.simple-fish');
            if (fishEl) {
                e.preventDefault();
                this.startLongPressTimer(fishEl.dataset.fishId);
            }
        }

        handleTouchEnd(e) {
            const fishEl = e.target.closest('.simple-fish');
            if (fishEl) {
                const fishId = fishEl.dataset.fishId;
                if (this.pressTimers.has(fishId)) {
                    clearTimeout(this.pressTimers.get(fishId));
                    this.pressTimers.delete(fishId);

                    const touch = e.changedTouches[0];
                    this.spawnNewFish(touch.clientX, touch.clientY);
                }
            }
        }

        startLongPressTimer(fishId) {
            const timer = setTimeout(() => {
                this.removeFish(fishId);
                this.pressTimers.delete(fishId);
                console.log(`🐟 Long press: Removed fish ${fishId}`);
            }, this.longPressDelay);

            this.pressTimers.set(fishId, timer);
        }

        spawnInitialFish() {
            const x = 150;
            const y = window.innerHeight * 0.4;
            this.spawnNewFish(x, y, 'foreground');
        }

        spawnNewFish(x, y, layer = null) {
            if (this.fishes.size >= this.maxFishes) {
                console.log('🐟 Max fish limit reached');
                return;
            }

            // Auto-determine layer if not specified
            if (!layer) {
                layer = Math.random() < 0.7 ? 'foreground' : 'background';
            }

            // Safe positioning
            x = Math.max(50, Math.min(x, window.innerWidth - 100));
            y = Math.max(50, Math.min(y, window.innerHeight - 100));

            const fishType = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
            const fishId = `fish-${++this.fishCounter}`;

            const fish = {
                id: fishId,
                emoji: fishType.emoji,
                x: x,
                y: y,
                baseY: y,
                speed: fishType.speed + (Math.random() - 0.5) * 0.5,
                color: fishType.color,
                layer: layer,
                age: 0,
                maxAge: layer === 'background' ? 15000 : 25000,
                size: 32,
                opacity: layer === 'background' ? 0.4 : 0.9,
                element: null
            };

            this.createFishElement(fish);
            this.fishes.set(fishId, fish);

            console.log(`🐟 Spawned: ${fishType.emoji} (${layer}) - Total: ${this.fishes.size}`);
        }

        createFishElement(fish) {
            const el = document.createElement('div');
            el.className = `simple-fish simple-fish-${fish.layer}`;
            el.dataset.fishId = fish.id;
            el.innerHTML = fish.emoji;

            // Direction logic - flip if fish naturally faces left but should swim right
            const shouldFlip = FISH_METADATA[fish.emoji]?.needsFlip || false;
            const transform = shouldFlip ? 'scaleX(-1)' : 'scaleX(1)';

            el.style.cssText = `
                position: fixed;
                left: ${fish.x}px;
                top: ${fish.y}px;
                font-size: ${fish.size}px;
                color: ${fish.color};
                opacity: ${fish.opacity};
                transform: ${transform};
                z-index: ${fish.layer === 'background' ? 50 : 150};
                cursor: pointer;
                user-select: none;
                pointer-events: auto;
                transition: all 0.2s ease;
            `;

            fish.element = el;
            document.body.appendChild(el);
        }

        updateFish(fish, deltaTime) {
            // Move right (forward)
            fish.x += fish.speed * (deltaTime / 16.67);

            // Swimming motion (up/down)
            fish.y = fish.baseY + Math.sin(fish.age * 0.002) * 20;

            // Age
            fish.age += deltaTime;
            const ageRatio = fish.age / fish.maxAge;

            // Fade out when old
            if (ageRatio > 0.7) {
                const fadeRatio = (ageRatio - 0.7) / 0.3;
                fish.opacity = fish.layer === 'background'
                    ? Math.max(0.05, 0.4 * (1 - fadeRatio))
                    : Math.max(0.1, 0.9 * (1 - fadeRatio));
                fish.size = Math.max(20, 32 * (1 - fadeRatio * 0.3));
            }

            // Update element
            if (fish.element) {
                fish.element.style.left = fish.x + 'px';
                fish.element.style.top = fish.y + 'px';
                fish.element.style.opacity = fish.opacity;
                fish.element.style.fontSize = fish.size + 'px';
            }

            // Remove if off-screen or too old
            return fish.x > window.innerWidth + 100 || fish.age >= fish.maxAge;
        }

        removeFish(fishId) {
            const fish = this.fishes.get(fishId);
            if (fish && fish.element) {
                fish.element.remove();
                this.fishes.delete(fishId);

                // Clear timers
                if (this.pressTimers.has(fishId)) {
                    clearTimeout(this.pressTimers.get(fishId));
                    this.pressTimers.delete(fishId);
                }

                console.log(`🐟 Removed: ${fishId} - Remaining: ${this.fishes.size}`);
            }
        }

        startAnimation() {
            const animate = (currentTime) => {
                const deltaTime = Math.min(currentTime - this.lastUpdate, 50);
                this.lastUpdate = currentTime;

                // Update all fish
                const fishToRemove = [];
                for (const [fishId, fish] of this.fishes) {
                    const shouldRemove = this.updateFish(fish, deltaTime);
                    if (shouldRemove) {
                        fishToRemove.push(fishId);
                    }
                }

                // Remove expired fish
                fishToRemove.forEach(id => this.removeFish(id));

                this.animationId = requestAnimationFrame(animate);
            };

            this.animationId = requestAnimationFrame(animate);
        }

        cleanup() {
            console.log('🐟 Cleaning up fish system...');

            // Clear animation
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }

            // Clear timers
            for (const timer of this.pressTimers.values()) {
                clearTimeout(timer);
            }
            this.pressTimers.clear();

            // Remove all fish
            for (const fish of this.fishes.values()) {
                if (fish.element) fish.element.remove();
            }
            this.fishes.clear();

            // Remove styles
            const style = document.getElementById('simple-fish-styles');
            if (style) style.remove();

            console.log('🐟 Fish system cleaned up');
        }

        // Public API
        getFishCount() {
            return this.fishes.size;
        }

        reset() {
            this.cleanup();
            setTimeout(() => this.init(), 100);
        }
    }

    // Clean up any existing fish systems
    if (window.fishSystem) {
        window.fishSystem.cleanup();
    }

    // Initialize when DOM is ready
    function initFishSystem() {
        try {
            new SimpleFishSystem();
        } catch (error) {
            console.error('🐟 Fish system error:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFishSystem);
    } else {
        initFishSystem();
    }

})();