/* 🎮 OPTIMIZED GAME ENGINE
   Performance-optimierte Version des Aquarium Collector Games
   Integriert mit Animation Coordinator für bessere FPS
*/

class OptimizedAquariumGame {
    constructor(containerId, gameNumber = 1) {
        this.containerId = containerId;
        this.gameNumber = gameNumber;
        this.container = document.getElementById(containerId);

        if (!this.container) {
            console.error(`Game container ${containerId} not found`);
            return;
        }

        // Performance optimizations
        this.targetFPS = 60;
        this.frameSkipCount = 0;
        this.maxFrameSkip = 2;

        // Game state
        this.gameState = 'stopped';
        this.score = 0;
        this.collectedItems = 0;
        this.timeLeft = 30;

        // Optimized rendering
        this.needsRedraw = true;
        this.lastRenderTime = 0;
        this.renderInterval = 1000 / 60; // 60 FPS target

        // Object pooling for better performance
        this.itemPool = [];
        this.bubblePool = [];
        this.activeItems = [];
        this.activeBubbles = [];

        this.init();
    }

    init() {
        this.createOptimizedUI();
        this.setupCanvas();
        this.setupObjectPools();
        this.registerWithAnimationCoordinator();

        console.log(`🎮 Optimized Aquarium Game ${this.gameNumber} initialized`);
    }

    createOptimizedUI() {
        this.container.innerHTML = `
            <div class="optimized-game-container">
                <div class="game-header">
                    <h3>🐠 Optimized Aquarium Collector</h3>
                    <p>Sammle Futter-Items - Now with 60 FPS!</p>
                </div>
                <div class="game-stats">
                    <div class="score-display">Score: <span id="opt-score-${this.containerId}">0</span></div>
                    <div class="items-display">Items: <span id="opt-items-${this.containerId}">0</span>/20</div>
                    <div class="timer-display">Zeit: <span id="opt-timer-${this.containerId}">30s</span></div>
                    <div class="fps-display">FPS: <span id="opt-fps-${this.containerId}">60</span></div>
                </div>
                <div class="game-canvas-container">
                    <canvas id="opt-canvas-${this.containerId}" class="optimized-canvas"></canvas>
                    <div class="game-controls">
                        <button class="start-btn" onclick="window.optGame${this.gameNumber}.startGame()">
                            🎮 Start Optimized Game
                        </button>
                        <button class="pause-btn" onclick="window.optGame${this.gameNumber}.pauseGame()">
                            ⏸️ Pause
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Optimized CSS for better performance
        const style = document.createElement('style');
        style.textContent = `
            .optimized-canvas {
                border: 2px solid var(--secondary-teal);
                border-radius: 10px;
                background: linear-gradient(180deg, #87CEEB 0%, #4682B4 50%, #191970 100%);
                cursor: crosshair;
                image-rendering: pixelated; /* Better performance for pixel-perfect rendering */
            }

            .game-stats {
                display: flex;
                gap: 15px;
                margin: 10px 0;
                font-weight: bold;
            }

            .fps-display {
                color: var(--accent-coral);
            }
        `;
        document.head.appendChild(style);
    }

    setupCanvas() {
        this.canvas = document.getElementById(`opt-canvas-${this.containerId}`);
        this.ctx = this.canvas.getContext('2d');

        // High DPI support with performance consideration
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit to 2x for performance
        const rect = this.container.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = 400 * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = '400px';

        this.ctx.scale(dpr, dpr);

        // Performance optimizations
        this.ctx.imageSmoothingEnabled = false; // Faster rendering

        // Click handler for item collection
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    }

    setupObjectPools() {
        // Pre-allocate objects to avoid garbage collection
        for (let i = 0; i < 20; i++) {
            this.itemPool.push(this.createPooledItem());
            this.bubblePool.push(this.createPooledBubble());
        }
        console.log('🎮 Object pools initialized');
    }

    createPooledItem() {
        return {
            x: 0,
            y: 0,
            width: 30,
            height: 30,
            type: 'food',
            emoji: '🍎',
            active: false,
            vx: 0,
            vy: 0,
            points: 10
        };
    }

    createPooledBubble() {
        return {
            x: 0,
            y: 0,
            radius: 5,
            opacity: 0.3,
            active: false,
            vy: -1
        };
    }

    registerWithAnimationCoordinator() {
        if (window.animationCoordinator) {
            window.animationCoordinator.registerSystem(`aquarium-game-${this.gameNumber}`, {
                update: (deltaTime) => this.update(deltaTime),
                render: (deltaTime) => this.render(deltaTime),
                priority: 2 // Higher priority than background animations
            });
            console.log('🎮 Registered with Animation Coordinator');
        } else {
            console.warn('🎮 Animation Coordinator not available, falling back to standalone mode');
            this.startStandaloneAnimation();
        }
    }

    startStandaloneAnimation() {
        const animate = (currentTime) => {
            if (this.gameState === 'stopped') return;

            const deltaTime = currentTime - this.lastRenderTime;

            if (deltaTime >= this.renderInterval) {
                this.update(deltaTime);
                this.render(deltaTime);
                this.lastRenderTime = currentTime;
            }

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    update(deltaTime) {
        if (this.gameState !== 'playing') return;

        // Update game timer
        this.timeLeft -= deltaTime / 1000;
        if (this.timeLeft <= 0) {
            this.endGame();
            return;
        }

        // Update active items
        this.activeItems.forEach(item => {
            item.x += item.vx;
            item.y += item.vy;

            // Remove items that are out of bounds
            if (item.y > this.canvas.height + 50) {
                this.returnItemToPool(item);
            }
        });

        // Update bubbles
        this.activeBubbles.forEach(bubble => {
            bubble.y += bubble.vy;
            if (bubble.y < -20) {
                bubble.y = this.canvas.height + 20;
                bubble.x = Math.random() * this.canvas.width;
            }
        });

        // Spawn new items
        if (Math.random() < 0.02) { // 2% chance per frame
            this.spawnItem();
        }

        this.updateUI();
    }

    render(deltaTime) {
        if (!this.needsRedraw && this.gameState !== 'playing') return;

        // Clear canvas efficiently
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render background bubbles
        this.renderBubbles();

        // Render items
        this.renderItems();

        this.needsRedraw = false;
    }

    renderBubbles() {
        this.ctx.save();
        this.activeBubbles.forEach(bubble => {
            this.ctx.globalAlpha = bubble.opacity;
            this.ctx.fillStyle = '#ADD8E6';
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.restore();
    }

    renderItems() {
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';

        this.activeItems.forEach(item => {
            this.ctx.fillText(item.emoji, item.x, item.y);
        });
    }

    spawnItem() {
        const item = this.getItemFromPool();
        if (!item) return;

        const foodTypes = [
            { emoji: '🍎', points: 10 },
            { emoji: '🥕', points: 15 },
            { emoji: '🌿', points: 20 },
            { emoji: '🦐', points: 25 }
        ];

        const foodType = foodTypes[Math.floor(Math.random() * foodTypes.length)];

        item.x = Math.random() * (this.canvas.width - 60) + 30;
        item.y = -30;
        item.vx = (Math.random() - 0.5) * 2;
        item.vy = 2 + Math.random() * 2;
        item.emoji = foodType.emoji;
        item.points = foodType.points;
        item.active = true;

        this.activeItems.push(item);
        this.needsRedraw = true;
    }

    getItemFromPool() {
        return this.itemPool.find(item => !item.active);
    }

    returnItemToPool(item) {
        item.active = false;
        const index = this.activeItems.indexOf(item);
        if (index > -1) {
            this.activeItems.splice(index, 1);
        }
    }

    handleCanvasClick(e) {
        if (this.gameState !== 'playing') return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check collision with items
        for (let i = this.activeItems.length - 1; i >= 0; i--) {
            const item = this.activeItems[i];
            const distance = Math.sqrt((x - item.x) ** 2 + (y - item.y) ** 2);

            if (distance < 20) {
                this.collectItem(item);
                break;
            }
        }
    }

    collectItem(item) {
        this.score += item.points;
        this.collectedItems++;
        this.returnItemToPool(item);
        this.needsRedraw = true;

        // Visual feedback
        this.showCollectionEffect(item.x, item.y);
    }

    showCollectionEffect(x, y) {
        // Simple visual feedback
        this.ctx.save();
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('+' + 10, x, y - 20);
        this.ctx.restore();
    }

    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.collectedItems = 0;
        this.timeLeft = 30;

        // Initialize bubbles
        for (let i = 0; i < 5; i++) {
            const bubble = this.bubblePool[i];
            bubble.x = Math.random() * this.canvas.width;
            bubble.y = Math.random() * this.canvas.height;
            bubble.radius = 3 + Math.random() * 5;
            bubble.opacity = 0.3 + Math.random() * 0.4;
            bubble.vy = -0.5 - Math.random() * 1;
            bubble.active = true;
            this.activeBubbles.push(bubble);
        }

        this.needsRedraw = true;
        console.log('🎮 Optimized game started');
    }

    pauseGame() {
        this.gameState = this.gameState === 'playing' ? 'paused' : 'playing';
        console.log('🎮 Game', this.gameState);
    }

    endGame() {
        this.gameState = 'stopped';

        // Clean up active objects
        this.activeItems.forEach(item => this.returnItemToPool(item));
        this.activeItems = [];

        this.activeBubbles = [];

        console.log(`🎮 Game ended. Final score: ${this.score}`);
        alert(`Spiel beendet! Score: ${this.score} (${this.collectedItems} Items gesammelt)`);
    }

    updateUI() {
        document.getElementById(`opt-score-${this.containerId}`).textContent = this.score;
        document.getElementById(`opt-items-${this.containerId}`).textContent = this.collectedItems;
        document.getElementById(`opt-timer-${this.containerId}`).textContent = Math.ceil(this.timeLeft) + 's';

        // Show FPS if performance optimizer is available
        if (window.performanceOptimizer) {
            const fps = window.performanceOptimizer.metrics.fps || 60;
            document.getElementById(`opt-fps-${this.containerId}`).textContent = fps;
        }
    }

    // Cleanup method
    destroy() {
        if (window.animationCoordinator) {
            window.animationCoordinator.unregisterSystem(`aquarium-game-${this.gameNumber}`);
        }

        this.gameState = 'stopped';
        console.log(`🎮 Optimized game ${this.gameNumber} destroyed`);
    }
}

// Auto-initialize optimized game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Only initialize if container exists
        if (document.getElementById('aquarium-game-container')) {
            window.optGame1 = new OptimizedAquariumGame('aquarium-game-container', 1);
        }
    });
} else {
    if (document.getElementById('aquarium-game-container')) {
        window.optGame1 = new OptimizedAquariumGame('aquarium-game-container', 1);
    }
}