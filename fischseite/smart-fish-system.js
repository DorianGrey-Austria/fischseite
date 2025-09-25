/* 🐟 SMART UNIFIED FISH SYSTEM - V3.0
 * Complete solution for all fish-related functionality
 * Anatomically correct orientation, intuitive interaction, optimized performance
 */

(function() {
    'use strict';

    // Prevent multiple initializations
    if (window.SMART_FISH_SYSTEM_INITIALIZED) {
        console.log('🐟 Smart Fish System already initialized, skipping...');
        return;
    }

    console.log('🐟 Smart Fish System V3.0 loading...');

    // Fish database with anatomically correct orientations
    const FISH_DATABASE = {
        // Traditional fish - swim left to right, head pointing right
        '🐠': { front: 'left', baseSpeed: 1.8, group: 'tropical', scaleX: -1 },
        '🐟': { front: 'left', baseSpeed: 2.1, group: 'tropical', scaleX: -1 },
        '🐡': { front: 'left', baseSpeed: 1.5, group: 'tropical', scaleX: -1 },
        '🦈': { front: 'left', baseSpeed: 2.8, group: 'predator', scaleX: -1 },

        // Crustaceans - different swimming pattern, often backwards/sideways
        '🦐': { front: 'right', baseSpeed: 2.3, group: 'crustacean', scaleX: 1 },
        '🦞': { front: 'right', baseSpeed: 1.0, group: 'crustacean', scaleX: 1 },

        // Cephalopods - no clear front/back, can move in any direction
        '🐙': { front: 'random', baseSpeed: 1.3, group: 'cephalopod', scaleX: 1 },
        '🦑': { front: 'random', baseSpeed: 1.4, group: 'cephalopod', scaleX: 1 }
    };

    const FISH_EMOJIS = Object.keys(FISH_DATABASE);

    // Spawn probability rules
    const SPAWN_RULES = {
        single: 0.6,    // 60% chance for 1 fish
        pair: 0.3,      // 30% chance for 2 fish
        trio: 0.1       // 10% chance for 3 fish
    };

    // Layer definitions for depth effect
    const LAYERS = {
        background: { opacity: 0.3, zIndex: 50, interactive: false, size: 0.7 },
        midground: { opacity: 0.6, zIndex: 100, interactive: true, size: 0.9 },
        foreground: { opacity: 0.9, zIndex: 150, interactive: true, size: 1.1 }
    };

    let fishSystem = {
        fishes: new Map(),
        fishId: 0,
        maxFishes: 15,
        animationRunning: false,
        hintActive: false,
        initialized: false
    };

    // Create dynamic styles
    function createStyles() {
        if (document.getElementById('smart-fish-styles')) return;

        const style = document.createElement('style');
        style.id = 'smart-fish-styles';
        style.textContent = `
            .smart-fish {
                position: fixed;
                font-size: 32px;
                cursor: pointer;
                user-select: none;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                will-change: transform, opacity;
                pointer-events: auto;
                filter: drop-shadow(0 2px 4px rgba(0,105,148,0.2));
            }

            .smart-fish:hover {
                transform: scale(1.2) !important;
                filter: drop-shadow(0 4px 12px currentColor) !important;
                z-index: 999 !important;
                transition: all 0.2s ease !important;
            }

            .smart-fish-fg {
                z-index: 150;
                opacity: 0.95;
            }

            .smart-fish-mg {
                z-index: 100;
                opacity: 0.65;
            }

            .smart-fish-bg {
                z-index: 50;
                opacity: 0.35;
                filter: brightness(0.8) blur(0.5px);
            }

            .smart-fish-hint {
                animation: fishHintPulse 2.5s ease-in-out infinite;
                z-index: 200 !important;
            }

            @keyframes fishHintPulse {
                0%, 100% {
                    transform: scale(1) scaleX(var(--fish-scale-x));
                    filter: drop-shadow(0 2px 4px rgba(0,105,148,0.2));
                }
                50% {
                    transform: scale(1.25) scaleX(var(--fish-scale-x));
                    filter: drop-shadow(0 6px 20px rgba(78,205,196,0.8));
                }
            }

            .smart-fish-spawn {
                animation: fishSpawnIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }

            @keyframes fishSpawnIn {
                0% {
                    transform: scale(0) scaleX(var(--fish-scale-x)) rotate(180deg);
                    opacity: 0;
                }
                60% {
                    transform: scale(1.2) scaleX(var(--fish-scale-x)) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: scale(1) scaleX(var(--fish-scale-x)) rotate(0deg);
                    opacity: var(--fish-opacity);
                }
            }

            @keyframes fishSwimming {
                0%, 100% { transform: translateY(0px) scaleX(var(--fish-scale-x)); }
                25% { transform: translateY(-8px) scaleX(var(--fish-scale-x)); }
                75% { transform: translateY(8px) scaleX(var(--fish-scale-x)); }
            }
        `;
        document.head.appendChild(style);
    }

    // Create a single fish
    function createFish(x, y, layer = 'foreground', showSpawnAnimation = true) {
        if (fishSystem.fishes.size >= fishSystem.maxFishes) {
            return null;
        }

        const emoji = FISH_EMOJIS[Math.floor(Math.random() * FISH_EMOJIS.length)];
        const config = FISH_DATABASE[emoji];
        const layerConfig = LAYERS[layer];
        const id = `smart-fish-${++fishSystem.fishId}`;

        // Size variation based on layer
        const sizeVariation = 0.7 + Math.random() * 0.6;
        const finalSize = layerConfig.size * sizeVariation;

        const fish = {
            id: id,
            emoji: emoji,
            x: Math.max(60, Math.min(x || 300, window.innerWidth - 100)),
            y: Math.max(60, Math.min(y || 200, window.innerHeight - 100)),
            baseY: y || 200,
            speed: config.baseSpeed * (0.8 + Math.random() * 0.4),
            scaleX: config.scaleX,
            layer: layer,
            size: finalSize,
            age: 0,
            maxAge: layerConfig.interactive ? 25000 : 18000,
            interactive: layerConfig.interactive,
            element: null,
            swimOffset: Math.random() * Math.PI * 2
        };

        // Create DOM element
        const el = document.createElement('div');
        const layerShort = layer.substring(0, 2);
        el.className = `smart-fish smart-fish-${layerShort}`;
        el.dataset.fishId = id;
        el.innerHTML = emoji;
        el.title = fish.interactive ? `${emoji} Click for more fish!` : `Background ${emoji}`;

        // Apply styles with correct transform
        el.style.cssText = `
            left: ${fish.x}px;
            top: ${fish.y}px;
            font-size: ${32 * fish.size}px;
            z-index: ${layerConfig.zIndex};
            opacity: ${layerConfig.opacity};
            transform: scaleX(${fish.scaleX});
            --fish-scale-x: ${fish.scaleX};
            --fish-opacity: ${layerConfig.opacity};
        `;

        // Add spawn animation
        if (showSpawnAnimation) {
            el.classList.add('smart-fish-spawn');
            setTimeout(() => {
                el.classList.remove('smart-fish-spawn');
            }, 600);
        }

        fish.element = el;
        fishSystem.fishes.set(id, fish);
        document.body.appendChild(el);

        return fish;
    }

    // Remove fish
    function removeFish(id) {
        const fish = fishSystem.fishes.get(id);
        if (fish && fish.element) {
            fish.element.style.transition = 'all 0.5s ease';
            fish.element.style.opacity = '0';
            fish.element.style.transform += ' scale(0.5)';

            setTimeout(() => {
                fish.element.remove();
                fishSystem.fishes.delete(id);
            }, 500);
        }
    }

    // Update fish animation
    function updateFish(fish, deltaTime) {
        // Swimming movement
        fish.x += fish.speed * (deltaTime / 16.67);
        fish.swimOffset += deltaTime * 0.0008; // Slower for stability
        fish.y = fish.baseY + Math.sin(fish.swimOffset) * 8; // Less vertical movement
        fish.age += deltaTime;

        // Fade out near end of life
        const ageRatio = fish.age / fish.maxAge;
        if (ageRatio > 0.8) {
            const fadeRatio = (ageRatio - 0.8) / 0.2;
            const currentOpacity = LAYERS[fish.layer].opacity;
            fish.element.style.opacity = Math.max(0.1, currentOpacity * (1 - fadeRatio));
        }

        // Update position while preserving transform
        fish.element.style.left = fish.x + 'px';
        fish.element.style.top = fish.y + 'px';
        fish.element.style.transform = `scaleX(${fish.scaleX})`;

        // Check if fish should be removed (out of bounds or too old)
        return fish.x > window.innerWidth + 100 || fish.age >= fish.maxAge;
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

    // Spawn multiple fish (1-3 based on probability)
    function spawnFishGroup(x, y, source = 'click') {
        const roll = Math.random();
        let count = 1;

        if (roll < SPAWN_RULES.trio) count = 3;
        else if (roll < SPAWN_RULES.trio + SPAWN_RULES.pair) count = 2;

        const newFishes = [];

        for (let i = 0; i < count; i++) {
            // Create varied positions for group
            const offsetX = i * 30 + (Math.random() - 0.5) * 20;
            const offsetY = i * 15 + Math.sin(i) * 10;

            // Choose layer (more foreground fish for interaction)
            let layer = 'foreground';
            if (Math.random() < 0.3) layer = 'midground';
            else if (Math.random() < 0.1) layer = 'background';

            const fish = createFish(x + offsetX, y + offsetY, layer, true);
            if (fish) newFishes.push(fish);
        }

        // Remove hint after first successful spawn
        if (fishSystem.hintActive && newFishes.length > 0) {
            removeHintAnimation();
        }

        return newFishes;
    }

    // Add hint animation to first fish
    function addHintAnimation(fish) {
        if (fish && fish.element) {
            fish.element.classList.add('smart-fish-hint');
            fishSystem.hintActive = true;
        }
    }

    // Remove hint animation
    function removeHintAnimation() {
        const hintFish = document.querySelector('.smart-fish-hint');
        if (hintFish) {
            hintFish.classList.remove('smart-fish-hint');
            fishSystem.hintActive = false;
        }
    }

    // Event handlers for interaction
    function handleFishClick(e) {
        const fishEl = e.target.closest('.smart-fish');
        if (!fishEl) return;

        e.preventDefault();
        e.stopPropagation();

        // Get fish data
        const fishId = fishEl.dataset.fishId;
        const fish = fishSystem.fishes.get(fishId);

        if (fish && fish.interactive) {
            // Spawn new fish group at click position
            spawnFishGroup(e.clientX || fish.x, e.clientY || fish.y, 'click');

            // Visual feedback on clicked fish
            fishEl.style.transform += ' scale(1.3)';
            setTimeout(() => {
                if (fishEl.style) {
                    fishEl.style.transform = fishEl.style.transform.replace(' scale(1.3)', '');
                }
            }, 200);
        }
    }

    // Touch support
    function handleTouchStart(e) {
        const fishEl = e.target.closest('.smart-fish');
        if (fishEl) {
            e.preventDefault();
            const touch = e.touches[0];
            handleFishClick({
                target: fishEl,
                preventDefault: () => {},
                stopPropagation: () => {},
                clientX: touch.clientX,
                clientY: touch.clientY
            });
        }
    }

    // Initialize the system
    function initializeSmartFishSystem() {
        if (fishSystem.initialized) {
            return;
        }

        createStyles();

        // Add event listeners
        document.addEventListener('click', handleFishClick, true);
        document.addEventListener('touchstart', handleTouchStart, { passive: false });

        // Create initial starter fish with hint
        const startX = Math.min(window.innerWidth * 0.3, 300);
        const startY = Math.min(window.innerHeight * 0.5, 300);
        const starterFish = createFish(startX, startY, 'foreground', false);

        if (starterFish) {
            addHintAnimation(starterFish);
        }

        // Start animation loop
        fishSystem.animationRunning = true;
        requestAnimationFrame(animate);

        // Mark as initialized
        fishSystem.initialized = true;
        window.smartFishSystem = fishSystem;
        window.SMART_FISH_SYSTEM_INITIALIZED = true;
    }

    // Public API
    window.fishSystemAPI = {
        getFishCount: () => fishSystem.fishes.size,
        spawnFish: (x, y, layer) => spawnFishGroup(x || 300, y || 200, 'api'),
        reset: () => {
            // Remove all fish
            fishSystem.fishes.forEach((fish, id) => {
                fish.element.remove();
            });
            fishSystem.fishes.clear();
            fishSystem.fishId = 0;
            fishSystem.hintActive = false;

            // Create new starter fish
            const startX = Math.min(window.innerWidth * 0.3, 300);
            const startY = Math.min(window.innerHeight * 0.5, 300);
            const starterFish = createFish(startX, startY, 'foreground', false);
            if (starterFish) {
                addHintAnimation(starterFish);
            }
        },
        getSystemInfo: () => ({
            fishCount: fishSystem.fishes.size,
            maxFishes: fishSystem.maxFishes,
            hintActive: fishSystem.hintActive,
            fishTypes: Object.keys(FISH_DATABASE)
        })
    };

    // Initialize when DOM is ready - improved timing
    function safeInitialize() {
        setTimeout(initializeSmartFishSystem, 200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', safeInitialize);
    } else if (document.readyState === 'interactive') {
        safeInitialize();
    } else {
        // Document is complete
        setTimeout(initializeSmartFishSystem, 100);
    }

    // Fallback initialization after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!fishSystem.initialized) {
                // Fallback initialization
                initializeSmartFishSystem();
            }
        }, 500);
    });

})();