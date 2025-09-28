/* 🎬 ANIMATION COORDINATOR
   Zentrale Koordination aller Animationen für optimale Performance
   Ersetzt multiple requestAnimationFrame calls
*/

class AnimationCoordinator {
    constructor() {
        this.systems = new Map();
        this.running = false;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        this.lastFrameTime = 0;
        this.frameSkip = 0;
    }

    registerSystem(name, system) {
        this.systems.set(name, {
            system: system,
            priority: system.priority || 1,
            active: true
        });
        console.log(`🎬 Registered animation system: ${name}`);
    }

    unregisterSystem(name) {
        this.systems.delete(name);
        console.log(`🎬 Unregistered animation system: ${name}`);
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.lastFrameTime = performance.now();
        this.animate();
        console.log('🎬 Animation Coordinator started');
    }

    stop() {
        this.running = false;
        console.log('🎬 Animation Coordinator stopped');
    }

    animate(currentTime = performance.now()) {
        if (!this.running) return;

        const deltaTime = currentTime - this.lastFrameTime;

        // FPS throttling - skip frames if going too fast
        if (deltaTime >= this.frameInterval) {
            // Sort systems by priority (higher priority = rendered first)
            const sortedSystems = Array.from(this.systems.entries())
                .filter(([name, data]) => data.active)
                .sort(([,a], [,b]) => b.priority - a.priority);

            // Update all active systems
            sortedSystems.forEach(([name, data]) => {
                try {
                    if (data.system.update) {
                        data.system.update(deltaTime);
                    }
                    if (data.system.render) {
                        data.system.render(deltaTime);
                    }
                } catch (error) {
                    console.warn(`🚨 Animation system '${name}' error:`, error);
                    data.active = false; // Deactivate broken systems
                }
            });

            this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);
        }

        requestAnimationFrame((time) => this.animate(time));
    }

    // Performance optimization methods
    setTargetFPS(fps) {
        this.targetFPS = Math.max(30, Math.min(fps, 120));
        this.frameInterval = 1000 / this.targetFPS;
        console.log(`🎬 Target FPS set to: ${this.targetFPS}`);
    }

    pauseSystem(name) {
        const system = this.systems.get(name);
        if (system) {
            system.active = false;
            console.log(`⏸️ Paused animation system: ${name}`);
        }
    }

    resumeSystem(name) {
        const system = this.systems.get(name);
        if (system) {
            system.active = true;
            console.log(`▶️ Resumed animation system: ${name}`);
        }
    }

    getSystemsStatus() {
        const status = {};
        this.systems.forEach((data, name) => {
            status[name] = {
                active: data.active,
                priority: data.priority
            };
        });
        return status;
    }
}

// Global instance
window.animationCoordinator = new AnimationCoordinator();

// Auto-start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.animationCoordinator.start();
    });
} else {
    window.animationCoordinator.start();
}