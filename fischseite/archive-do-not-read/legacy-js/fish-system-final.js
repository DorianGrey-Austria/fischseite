/* 🐟 FINAL FISH SYSTEM - ULTRA ROBUST
 * Definitive solution for all fish-related requirements
 * No cleanup conflicts, guaranteed single fish at startup
 */

(function() {
    'use strict';

    // Prevent multiple initializations
    if (window.FISH_SYSTEM_INITIALIZED) {
        console.log('🐟 Fish system already initialized, skipping...');
        return;
    }

    console.log('🐟 Final Fish System loading...');

    // Fish configuration
    const FISH_CONFIG = {
        '🐠': { flip: true, speed: 1.8, color: '#4ECDC4' },
        '🐟': { flip: true, speed: 2.1, color: '#FF6B6B' },
        '🐡': { flip: true, speed: 1.5, color: '#FFE66D' },
        '🦈': { flip: true, speed: 2.8, color: '#006994' },
        '🐙': { flip: false, speed: 1.3, color: '#8B5CF6' },
        '🦐': { flip: false, speed: 2.3, color: '#FFA07A' },
        '🦞': { flip: false, speed: 1.0, color: '#DC2626' }
    };

    const FISH_EMOJIS = Object.keys(FISH_CONFIG);

    let fishSystem = {
        fishes: new Map(),
        fishId: 0,
        maxFishes: 15,
        animationRunning: false,
        longPressTimer: null,
        initialized: false
    };

    // Create styles immediately
    function createStyles() {
        if (document.getElementById('final-fish-styles')) return;

        const style = document.createElement('style');
        style.id = 'final-fish-styles';
        style.textContent = `
            .final-fish {
                position: fixed;
                font-size: 32px;
                cursor: pointer;
                user-select: none;
                transition: all 0.2s ease;
                will-change: transform;
                pointer-events: auto;
            }
            .final-fish:hover {
                transform: scale(1.15) !important;
                filter: drop-shadow(0 0 8px currentColor) !important;
                z-index: 999 !important;
            }
            .final-fish-fg {
                z-index: 150;
                opacity: 0.9;
            }
            .final-fish-bg {
                z-index: 50;
                opacity: 0.35;
                filter: brightness(0.7);
            }
        `;
        document.head.appendChild(style);
    }

    // Create single fish
    function createFish(x, y, layer = 'fg') {
        if (fishSystem.fishes.size >= fishSystem.maxFishes) return null;

        const emoji = FISH_EMOJIS[Math.floor(Math.random() * FISH_EMOJIS.length)];
        const config = FISH_CONFIG[emoji];
        const id = `final-fish-${++fishSystem.fishId}`;

        const fish = {
            id: id,
            emoji: emoji,
            x: Math.max(50, Math.min(x, window.innerWidth - 100)),
            y: Math.max(50, Math.min(y, window.innerHeight - 100)),
            baseY: y,
            speed: config.speed + (Math.random() - 0.5) * 0.3,
            color: config.color,
            layer: layer,
            age: 0,
            maxAge: layer === 'bg' ? 12000 : 20000,
            element: null
        };

        // Create DOM element
        const el = document.createElement('div');
        el.className = `final-fish final-fish-${layer}`;
        el.dataset.fishId = id;
        el.innerHTML = emoji;
        el.title = `${emoji} Click = Spawn | Long Press = Remove`;

        // Apply styles
        const transform = config.flip ? 'scaleX(-1)' : 'scaleX(1)';
        el.style.cssText = `
            left: ${fish.x}px;
            top: ${fish.y}px;
            color: ${fish.color};
            transform: ${transform};
        `;

        fish.element = el;
        fishSystem.fishes.set(id, fish);
        document.body.appendChild(el);

        console.log(`🐟 Created fish: ${emoji} (${layer}) - Total: ${fishSystem.fishes.size}`);
        return fish;
    }

    // Remove fish
    function removeFish(id) {
        const fish = fishSystem.fishes.get(id);
        if (fish && fish.element) {
            fish.element.remove();
            fishSystem.fishes.delete(id);
            console.log(`🐟 Removed fish: ${id} - Remaining: ${fishSystem.fishes.size}`);
        }
    }

    // Update single fish
    function updateFish(fish, deltaTime) {
        fish.x += fish.speed * (deltaTime / 16.67);
        fish.y = fish.baseY + Math.sin(fish.age * 0.002) * 15;
        fish.age += deltaTime;

        const ageRatio = fish.age / fish.maxAge;
        if (ageRatio > 0.8) {
            const fadeRatio = (ageRatio - 0.8) / 0.2;
            const baseOpacity = fish.layer === 'bg' ? 0.35 : 0.9;
            fish.element.style.opacity = Math.max(0.1, baseOpacity * (1 - fadeRatio));
        }

        fish.element.style.left = fish.x + 'px';
        fish.element.style.top = fish.y + 'px';

        return fish.x > window.innerWidth + 50 || fish.age >= fish.maxAge;
    }

    // Animation loop
    let lastTime = 0;
    function animate(currentTime) {
        if (!fishSystem.animationRunning) return;

        const deltaTime = Math.min(currentTime - lastTime, 50);
        lastTime = currentTime;

        const toRemove = [];
        for (const [id, fish] of fishSystem.fishes) {
            if (updateFish(fish, deltaTime)) {
                toRemove.push(id);
            }
        }

        toRemove.forEach(id => removeFish(id));
        requestAnimationFrame(animate);
    }

    // Event handlers
    function handleMouseDown(e) {
        const fishEl = e.target.closest('.final-fish');
        if (!fishEl) return;

        e.preventDefault();
        e.stopPropagation();

        const fishId = fishEl.dataset.fishId;

        // Start long press timer
        fishSystem.longPressTimer = setTimeout(() => {
            removeFish(fishId);
            fishSystem.longPressTimer = null;
            console.log('🐟 Long press: Fish removed');
        }, 500);
    }

    function handleMouseUp(e) {
        const fishEl = e.target.closest('.final-fish');
        if (!fishEl) return;

        // Clear long press timer
        if (fishSystem.longPressTimer) {
            clearTimeout(fishSystem.longPressTimer);
            fishSystem.longPressTimer = null;

            // Short click = spawn fish
            const layer = Math.random() < 0.6 ? 'fg' : 'bg';
            createFish(e.clientX, e.clientY, layer);
            console.log('🐟 Short click: Fish spawned');
        }
    }

    // Touch handlers (same logic)
    function handleTouchStart(e) {
        const fishEl = e.target.closest('.final-fish');
        if (!fishEl) return;

        e.preventDefault();
        const fishId = fishEl.dataset.fishId;

        fishSystem.longPressTimer = setTimeout(() => {
            removeFish(fishId);
            fishSystem.longPressTimer = null;
        }, 500);
    }

    function handleTouchEnd(e) {
        const fishEl = e.target.closest('.final-fish');
        if (!fishEl) return;

        if (fishSystem.longPressTimer) {
            clearTimeout(fishSystem.longPressTimer);
            fishSystem.longPressTimer = null;

            const touch = e.changedTouches[0];
            const layer = Math.random() < 0.6 ? 'fg' : 'bg';
            createFish(touch.clientX, touch.clientY, layer);
        }
    }

    // Initialize system
    function initializeFishSystem() {
        if (fishSystem.initialized) return;

        console.log('🐟 Initializing Final Fish System...');

        createStyles();

        // Add event listeners
        document.addEventListener('mousedown', handleMouseDown, true);
        document.addEventListener('mouseup', handleMouseUp, true);
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });

        // Create initial fish
        createFish(200, window.innerHeight * 0.4, 'fg');

        // Start animation
        fishSystem.animationRunning = true;
        requestAnimationFrame(animate);

        fishSystem.initialized = true;
        window.fishSystemFinal = fishSystem;
        window.FISH_SYSTEM_INITIALIZED = true;

        console.log('🐟 Final Fish System ready!');
        console.log('📖 Controls: Click = Spawn | Long Press (500ms) = Remove');
    }

    // Public API
    window.fishSystemAPI = {
        getFishCount: () => fishSystem.fishes.size,
        spawnFish: (x, y, layer) => createFish(x || 200, y || 200, layer || 'fg'),
        reset: () => {
            fishSystem.fishes.forEach((fish, id) => removeFish(id));
            createFish(200, window.innerHeight * 0.4, 'fg');
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFishSystem);
    } else {
        // Small delay to ensure page is stable
        setTimeout(initializeFishSystem, 100);
    }

})();