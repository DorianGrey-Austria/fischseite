/* 🐟 UNIFIED FISH MANAGER V2.0 - PROFESSIONAL FISH SYSTEM
 * Complete rewrite based on user requirements:
 * - Long-press to remove fish (instead of double-click)
 * - Short-click to spawn new fish
 * - Single fish at startup
 * - Transparent background fish, opaque foreground fish
 * - All fish swim in correct direction
 * - Performance optimized with z-index layers
 * - Central management for ALL fish
 */

class FishDirectionManager {
    constructor() {
        this.fishMetadata = new Map([
            ['🐠', { naturalDirection: 'left', requiresFlipForRight: true, name: 'tropical' }],
            ['🐟', { naturalDirection: 'left', requiresFlipForRight: true, name: 'fish' }],
            ['🐡', { naturalDirection: 'left', requiresFlipForRight: true, name: 'blowfish' }],
            ['🦈', { naturalDirection: 'left', requiresFlipForRight: true, name: 'shark' }],
            ['🐙', { naturalDirection: 'neutral', requiresFlipForRight: false, name: 'octopus' }],
            ['🦐', { naturalDirection: 'neutral', requiresFlipForRight: false, name: 'shrimp' }],
            ['🦞', { naturalDirection: 'neutral', requiresFlipForRight: false, name: 'lobster' }]
        ]);
    }

    shouldFlipForDirection(emoji, targetDirection) {
        const metadata = this.fishMetadata.get(emoji);
        if (!metadata) return false;

        // Always swim right (forward), flip if fish naturally faces left
        return targetDirection === 'right' && metadata.requiresFlipForRight;
    }

    getFishName(emoji) {
        const metadata = this.fishMetadata.get(emoji);
        return metadata ? metadata.name : 'unknown';
    }
}

class Fish {
    constructor(id, emoji, x, y, speed, color, layer = 'foreground') {
        this.id = id;
        this.emoji = emoji;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.color = color;
        this.layer = layer; // 'background' or 'foreground'
        this.direction = 'right'; // Always swim forward (right)
        this.size = 32;
        this.baseOpacity = layer === 'background' ? 0.3 : 0.9; // Background transparent
        this.opacity = this.baseOpacity;
        this.age = 0;
        this.maxAge = layer === 'background' ? 20000 : 30000; // Background fish live shorter
        this.element = null;
        this.verticalOffset = 0;
        this.verticalSpeed = 0.05 + Math.random() * 0.03; // Varied swimming motion
        this.zIndex = layer === 'background' ? 50 : 150; // Layering

        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = `unified-fish unified-fish-${this.layer}`;
        this.element.innerHTML = this.emoji;
        this.element.dataset.fishId = this.id;
        this.element.dataset.fishLayer = this.layer;

        // Apply initial styles
        this.updateElement();

        document.body.appendChild(this.element);
    }

    updateElement() {
        if (!this.element) return;

        const flipTransform = window.fishManager.directionManager.shouldFlipForDirection(this.emoji, this.direction)
            ? 'scaleX(-1)' : 'scaleX(1)';

        this.element.style.cssText = `
            position: fixed;
            left: ${this.x}px;
            top: ${this.y + this.verticalOffset}px;
            font-size: ${this.size}px;
            color: ${this.color};
            opacity: ${this.opacity};
            cursor: pointer;
            z-index: ${this.zIndex};
            transform: ${flipTransform};
            transition: opacity 0.3s ease, transform 0.2s ease;
            user-select: none;
            pointer-events: auto;
            filter: ${this.layer === 'background' ? 'brightness(0.8)' : 'none'};
        `;
    }

    update(deltaTime) {
        // Move horizontally (always right)
        this.x += this.speed * (deltaTime / 16.67); // Normalize to 60fps

        // Natural swimming motion (up/down) - varied per fish
        this.verticalOffset = Math.sin(this.age * this.verticalSpeed) * (10 + Math.random() * 10);

        // Age and lifecycle
        this.age += deltaTime;
        const ageProgress = this.age / this.maxAge;

        // Gradual fade and shrink over time
        if (ageProgress > 0.6) {
            const fadeProgress = (ageProgress - 0.6) / 0.4;
            this.size = Math.max(16, 32 * (1 - fadeProgress * 0.4));
            this.opacity = Math.max(0.05, this.baseOpacity * (1 - fadeProgress * 0.8));
        }

        this.updateElement();

        // Remove when off screen or too old
        return this.x > window.innerWidth + 100 || this.age >= this.maxAge;
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
    }
}

class UnifiedFishManagerV2 {
    constructor() {
        this.directionManager = new FishDirectionManager();
        this.fishes = new Map();
        this.fishCounter = 0;
        this.maxFishes = 25; // Reduced for better performance
        this.maxBackgroundFishes = 8; // Limit background fish
        this.lastUpdate = performance.now();

        // Long-press detection
        this.pressTimers = new Map();
        this.longPressDelay = 500; // 500ms for long-press

        // Game exclusion zones
        this.exclusionZones = [
            '#aquarium-game-container',
            '.game-ui',
            '.highscore-dialog',
            '.game-menu',
            'canvas',
            '.game-controls',
            '.game-area'
        ];

        this.fishTypes = [
            { emoji: '🐠', speed: 1.8, color: '#4ECDC4' },
            { emoji: '🐟', speed: 2.1, color: '#FF6B6B' },
            { emoji: '🐡', speed: 1.5, color: '#FFE66D' },
            { emoji: '🦈', speed: 2.8, color: '#006994' },
            { emoji: '🐙', speed: 1.3, color: '#8B5CF6' },
            { emoji: '🦐', speed: 2.3, color: '#FFA07A' },
            { emoji: '🦞', speed: 1.0, color: '#DC2626' }
        ];

        this.init();
    }

    init() {
        this.cleanup(); // Clean any existing systems
        this.createStyles();
        this.setupEventListeners();
        this.spawnInitialFish();
        this.startAnimationLoop();
        this.setupCleanup();

        // Make globally available
        window.fishManager = this;

        console.log('🐟 Unified Fish Manager V2.0 initialized');
        console.log('📖 Controls: Click = Spawn New Fish | Long-Press = Remove Fish');
    }

    createStyles() {
        const style = document.createElement('style');
        style.id = 'unified-fish-styles-v2';
        style.textContent = `
            .unified-fish {
                position: fixed;
                font-size: 32px;
                cursor: pointer;
                user-select: none;
                pointer-events: auto;
                transition: opacity 0.3s ease, transform 0.2s ease;
                will-change: transform, opacity;
            }

            .unified-fish-foreground {
                z-index: 150;
            }

            .unified-fish-background {
                z-index: 50;
                opacity: 0.3;
                filter: brightness(0.8);
            }

            .unified-fish:hover {
                transform: scale(1.15) !important;
                filter: drop-shadow(0 0 12px currentColor) !important;
                z-index: 200 !important;
            }

            .unified-fish:active {
                transform: scale(0.9) !important;
            }

            /* Smooth transitions for better UX */
            .unified-fish {
                transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
            }
        `;

        // Remove old styles
        const oldStyle = document.getElementById('unified-fish-styles-v2');
        if (oldStyle) oldStyle.remove();

        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Long-press and click detection
        document.addEventListener('mousedown', (e) => {
            const fishElement = e.target.closest('.unified-fish');
            if (fishElement) {
                e.preventDefault();
                e.stopPropagation();

                const fishId = fishElement.dataset.fishId;

                // Start long-press timer
                const timer = setTimeout(() => {
                    this.handleLongPress(fishId);
                }, this.longPressDelay);

                this.pressTimers.set(fishId, timer);
            }
        });

        document.addEventListener('mouseup', (e) => {
            const fishElement = e.target.closest('.unified-fish');
            if (fishElement) {
                const fishId = fishElement.dataset.fishId;

                if (this.pressTimers.has(fishId)) {
                    clearTimeout(this.pressTimers.get(fishId));
                    this.pressTimers.delete(fishId);

                    // Short click = spawn new fish
                    this.handleShortClick(e.clientX, e.clientY);
                }
            }
        });

        // Touch events for mobile
        document.addEventListener('touchstart', (e) => {
            const fishElement = e.target.closest('.unified-fish');
            if (fishElement) {
                e.preventDefault();

                const fishId = fishElement.dataset.fishId;
                const timer = setTimeout(() => {
                    this.handleLongPress(fishId);
                }, this.longPressDelay);

                this.pressTimers.set(fishId, timer);
            }
        });

        document.addEventListener('touchend', (e) => {
            const fishElement = e.target.closest('.unified-fish');
            if (fishElement) {
                const fishId = fishElement.dataset.fishId;

                if (this.pressTimers.has(fishId)) {
                    clearTimeout(this.pressTimers.get(fishId));
                    this.pressTimers.delete(fishId);

                    const touch = e.changedTouches[0];
                    this.handleShortClick(touch.clientX, touch.clientY);
                }
            }
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => this.cleanup());
    }

    handleShortClick(x, y) {
        console.log('🐟 Short click: Spawning new fish');

        // 70% chance for foreground, 30% for background
        const layer = Math.random() < 0.7 ? 'foreground' : 'background';
        this.spawnNewFish(x, y, layer);
    }

    handleLongPress(fishId) {
        console.log(`🐟 Long press: Removing fish ${fishId}`);
        this.removeFish(fishId);

        // Clear the timer
        if (this.pressTimers.has(fishId)) {
            clearTimeout(this.pressTimers.get(fishId));
            this.pressTimers.delete(fishId);
        }
    }

    spawnInitialFish() {
        // Start with single foreground fish in safe area
        const safeX = 150;
        const safeY = window.innerHeight * 0.4;
        this.spawnNewFish(safeX, safeY, 'foreground');

        console.log('🐟 Initial fish spawned');
    }

    spawnNewFish(x, y, layer = 'foreground') {
        // Check limits
        const currentForeground = Array.from(this.fishes.values()).filter(f => f.layer === 'foreground').length;
        const currentBackground = Array.from(this.fishes.values()).filter(f => f.layer === 'background').length;

        if (layer === 'foreground' && currentForeground >= this.maxFishes) {
            console.log('🐟 Max foreground fish limit reached');
            return null;
        }

        if (layer === 'background' && currentBackground >= this.maxBackgroundFishes) {
            console.log('🐟 Max background fish limit reached');
            return null;
        }

        // Check if position conflicts with game areas
        if (!this.isPositionSafe(x, y)) {
            x = 100 + Math.random() * 200;
            y = window.innerHeight * (0.2 + Math.random() * 0.6);
        }

        const fishType = this.fishTypes[Math.floor(Math.random() * this.fishTypes.length)];
        const fishId = `fish-v2-${++this.fishCounter}`;

        const fish = new Fish(
            fishId,
            fishType.emoji,
            x,
            y,
            fishType.speed + (Math.random() - 0.5) * 0.5, // Speed variation
            fishType.color,
            layer
        );

        this.fishes.set(fishId, fish);
        console.log(`🐟 Spawned: ${fishType.emoji} (${layer}) - Total: ${this.fishes.size}`);

        return fish;
    }

    removeFish(fishId) {
        const fish = this.fishes.get(fishId);
        if (fish) {
            fish.destroy();
            this.fishes.delete(fishId);

            console.log(`🐟 Removed: ${fishId} - Remaining: ${this.fishes.size}`);
        }
    }

    isPositionSafe(x, y, buffer = 80) {
        // Check against game exclusion zones
        for (const selector of this.exclusionZones) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (!element.offsetParent) continue;

                const rect = element.getBoundingClientRect();
                if (x >= rect.left - buffer &&
                    x <= rect.right + buffer &&
                    y >= rect.top - buffer &&
                    y <= rect.bottom + buffer) {
                    return false;
                }
            }
        }

        return true;
    }

    startAnimationLoop() {
        const animate = (currentTime) => {
            const deltaTime = Math.min(currentTime - this.lastUpdate, 50); // Cap delta for performance
            this.lastUpdate = currentTime;

            // Update all fish
            const fishToRemove = [];
            for (const [fishId, fish] of this.fishes) {
                const shouldRemove = fish.update(deltaTime);
                if (shouldRemove) {
                    fishToRemove.push(fishId);
                }
            }

            // Remove expired fish
            fishToRemove.forEach(fishId => this.removeFish(fishId));

            // Continue animation loop
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    setupCleanup() {
        window.addEventListener('beforeunload', () => this.cleanup());
    }

    cleanup() {
        console.log('🐟 Cleaning up fish systems...');

        // Clear all timers
        for (const timer of this.pressTimers.values()) {
            clearTimeout(timer);
        }
        this.pressTimers.clear();

        // Remove all fish
        for (const fish of this.fishes.values()) {
            fish.destroy();
        }
        this.fishes.clear();

        // Remove styles
        const style = document.getElementById('unified-fish-styles-v2');
        if (style) style.remove();

        console.log('🐟 Unified Fish Manager V2.0 cleaned up');
    }

    // Public API
    getFishCount() {
        return this.fishes.size;
    }

    getFishByLayer(layer) {
        return Array.from(this.fishes.values()).filter(f => f.layer === layer);
    }

    resetAllFish() {
        this.cleanup();
        setTimeout(() => {
            this.spawnInitialFish();
        }, 100);
    }

    // Debug API
    spawnTestFish() {
        const x = Math.random() * (window.innerWidth - 200) + 100;
        const y = Math.random() * (window.innerHeight - 200) + 100;
        const layer = Math.random() < 0.5 ? 'background' : 'foreground';
        return this.spawnNewFish(x, y, layer);
    }
}

// Initialize when DOM is ready, but clean up any existing systems first
if (window.fishManager) {
    window.fishManager.cleanup();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new UnifiedFishManagerV2();
    });
} else {
    new UnifiedFishManagerV2();
}

// Export for potential future use
window.UnifiedFishManagerV2 = UnifiedFishManagerV2;