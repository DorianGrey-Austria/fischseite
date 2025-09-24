/* 🐟 UNIFIED FISH MANAGER - Professional Fish System
 * Replaces all existing fish systems with single, coordinated solution
 * Features: Direction intelligence, game exclusion, single/double-click handling
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
    constructor(id, emoji, x, y, speed, color) {
        this.id = id;
        this.emoji = emoji;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.color = color;
        this.direction = 'right'; // Always swim forward (right)
        this.size = 32; // Start large
        this.opacity = 1.0;
        this.age = 0;
        this.maxAge = 30000; // 30 seconds lifecycle
        this.element = null;
        this.verticalOffset = 0;
        this.verticalSpeed = 0.05;

        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'unified-fish';
        this.element.innerHTML = this.emoji;
        this.element.dataset.fishId = this.id;

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
            z-index: 100;
            transform: ${flipTransform};
            transition: opacity 0.3s ease;
            user-select: none;
            pointer-events: auto;
        `;
    }

    update(deltaTime) {
        // Move horizontally (always right)
        this.x += this.speed * (deltaTime / 16.67); // Normalize to 60fps

        // Natural swimming motion (up/down)
        this.verticalOffset = Math.sin(this.age * 0.001) * 15;

        // Age and lifecycle
        this.age += deltaTime;
        const ageProgress = this.age / this.maxAge;

        // Shrink and fade over time
        if (ageProgress > 0.7) {
            const fadeProgress = (ageProgress - 0.7) / 0.3;
            this.size = Math.max(16, 32 * (1 - fadeProgress * 0.5));
            this.opacity = Math.max(0.1, 1 - fadeProgress * 0.9);
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

class UnifiedFishManager {
    constructor() {
        this.directionManager = new FishDirectionManager();
        this.fishes = new Map();
        this.fishCounter = 0;
        this.maxFishes = 50;
        this.lastUpdate = performance.now();
        this.clickTimeouts = new Map();
        this.doubleClickDelay = 300; // ms

        // Game exclusion zones
        this.exclusionZones = [
            '#aquarium-game-container',
            '.game-ui',
            '.highscore-dialog',
            '.game-menu',
            'canvas'
        ];

        this.fishTypes = [
            { emoji: '🐠', speed: 2.0, color: '#4ECDC4' },
            { emoji: '🐟', speed: 2.3, color: '#FF6B6B' },
            { emoji: '🐡', speed: 1.8, color: '#FFE66D' },
            { emoji: '🦈', speed: 3.0, color: '#006994' },
            { emoji: '🐙', speed: 1.5, color: '#8B5CF6' },
            { emoji: '🦐', speed: 2.5, color: '#FFA07A' },
            { emoji: '🦞', speed: 1.2, color: '#DC2626' }
        ];

        this.init();
    }

    init() {
        this.createStyles();
        this.setupEventListeners();
        this.spawnInitialFish();
        this.startAnimationLoop();
        this.setupCleanup();

        // Make globally available
        window.fishManager = this;

        console.log('🐟 Unified Fish Manager initialized - All fish swim forward!');
    }

    createStyles() {
        const style = document.createElement('style');
        style.id = 'unified-fish-styles';
        style.textContent = `
            .unified-fish {
                position: fixed;
                font-size: 32px;
                cursor: pointer;
                z-index: 100;
                user-select: none;
                pointer-events: auto;
                transition: opacity 0.3s ease, transform 0.1s ease;
            }

            .unified-fish:hover {
                transform: scale(1.1);
                filter: drop-shadow(0 0 8px currentColor);
            }

            .unified-fish:active {
                transform: scale(0.95);
            }
        `;

        // Remove old styles
        const oldStyle = document.getElementById('unified-fish-styles');
        if (oldStyle) oldStyle.remove();

        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Event delegation for fish clicks
        document.addEventListener('click', (e) => {
            const fishElement = e.target.closest('.unified-fish');
            if (fishElement) {
                e.preventDefault();
                e.stopPropagation();
                this.handleFishClick(fishElement.dataset.fishId, e);
            }
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => this.cleanup());
    }

    handleFishClick(fishId, event) {
        const fish = this.fishes.get(fishId);
        if (!fish) return;

        // Check for double-click
        if (this.clickTimeouts.has(fishId)) {
            // Double-click: Remove fish
            clearTimeout(this.clickTimeouts.get(fishId));
            this.clickTimeouts.delete(fishId);
            this.removeFish(fishId);
            console.log(`🐟 Double-click: Removed fish ${fishId}`);
        } else {
            // Single-click: Spawn new fish (after delay)
            const timeout = setTimeout(() => {
                this.clickTimeouts.delete(fishId);
                this.spawnNewFish(event.clientX, event.clientY);
                console.log(`🐟 Single-click: Spawned new fish from ${fishId}`);
            }, this.doubleClickDelay);

            this.clickTimeouts.set(fishId, timeout);
        }
    }

    spawnInitialFish() {
        // Start with single fish in safe area
        const safeX = 100;
        const safeY = window.innerHeight * 0.3;
        this.spawnNewFish(safeX, safeY);
    }

    spawnNewFish(x, y) {
        if (this.fishes.size >= this.maxFishes) {
            console.log(`🐟 Max fish limit reached (${this.maxFishes})`);
            return null;
        }

        // Check if position conflicts with game areas
        if (!this.isPositionSafe(x, y)) {
            // Spawn in safe area instead
            x = 100;
            y = window.innerHeight * (0.2 + Math.random() * 0.6);
        }

        const fishType = this.fishTypes[Math.floor(Math.random() * this.fishTypes.length)];
        const fishId = `fish-${++this.fishCounter}`;

        const fish = new Fish(
            fishId,
            fishType.emoji,
            x,
            y,
            fishType.speed,
            fishType.color
        );

        this.fishes.set(fishId, fish);
        console.log(`🐟 Spawned: ${fishType.emoji} (${fishId}) - Total: ${this.fishes.size}`);

        return fish;
    }

    removeFish(fishId) {
        const fish = this.fishes.get(fishId);
        if (fish) {
            fish.destroy();
            this.fishes.delete(fishId);

            // Clear any pending click timeouts
            if (this.clickTimeouts.has(fishId)) {
                clearTimeout(this.clickTimeouts.get(fishId));
                this.clickTimeouts.delete(fishId);
            }

            console.log(`🐟 Removed: ${fishId} - Remaining: ${this.fishes.size}`);
        }
    }

    isPositionSafe(x, y, buffer = 50) {
        // Check against game exclusion zones
        for (const selector of this.exclusionZones) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (!element.offsetParent) continue; // Skip hidden elements

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
            const deltaTime = currentTime - this.lastUpdate;
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
        // Cleanup function for page unload
        window.addEventListener('beforeunload', () => this.cleanup());
    }

    cleanup() {
        // Clear all timeouts
        for (const timeout of this.clickTimeouts.values()) {
            clearTimeout(timeout);
        }
        this.clickTimeouts.clear();

        // Remove all fish
        for (const fish of this.fishes.values()) {
            fish.destroy();
        }
        this.fishes.clear();

        // Remove styles
        const style = document.getElementById('unified-fish-styles');
        if (style) style.remove();

        console.log('🐟 Unified Fish Manager cleaned up');
    }

    // Public API
    getFishCount() {
        return this.fishes.size;
    }

    getMaxFishes() {
        return this.maxFishes;
    }

    getAllFish() {
        return Array.from(this.fishes.values());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new UnifiedFishManager();
    });
} else {
    new UnifiedFishManager();
}

// Export for potential future use
window.UnifiedFishManager = UnifiedFishManager;