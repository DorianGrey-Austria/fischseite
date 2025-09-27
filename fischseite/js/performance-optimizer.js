/* ⚡ PERFORMANCE OPTIMIZER
   Real-time Performance Monitoring und automatische Optimierungen
   Integration mit Play/Ride Self-Test Framework
*/

class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            fps: 0,
            memoryUsage: 0,
            loadTime: 0,
            interactionDelay: 0
        };

        this.optimizations = {
            animationFrameLimit: false,
            imageQualityReduction: false,
            particleEffectReduction: false,
            backgroundProcessPause: false
        };

        this.thresholds = {
            minFPS: 50,
            maxMemoryMB: 100,
            maxLoadTimeMS: 3000,
            maxInteractionDelayMS: 100
        };

        this.init();
    }

    init() {
        this.startFPSMonitoring();
        this.startMemoryMonitoring();
        this.setupPerformanceObserver();
        this.createPerformanceIndicator();

        // Expose for Play/Ride tests
        if (window.PlayRideTestActive) {
            window.PerformanceOptimizer = this;
        }
    }

    startFPSMonitoring() {
        let frames = 0;
        let lastTime = performance.now();

        const measureFPS = (currentTime) => {
            frames++;

            if (currentTime - lastTime >= 1000) {
                this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;

                // Auto-optimize if FPS drops
                if (this.metrics.fps < this.thresholds.minFPS) {
                    this.autoOptimizePerformance();
                }

                this.updatePerformanceIndicator();
            }

            requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);
    }

    startMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                this.metrics.memoryUsage = Math.round(memInfo.usedJSHeapSize / 1024 / 1024);

                if (this.metrics.memoryUsage > this.thresholds.maxMemoryMB) {
                    this.autoOptimizeMemory();
                }
            }, 5000);
        }
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            // Monitor loading performance
            const loadObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'navigation') {
                        this.metrics.loadTime = entry.loadEventEnd - entry.loadEventStart;
                    }
                }
            });
            loadObserver.observe({ entryTypes: ['navigation'] });

            // Monitor interaction performance
            const interactionObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'first-input') {
                        this.metrics.interactionDelay = entry.processingStart - entry.startTime;
                    }
                }
            });
            interactionObserver.observe({ entryTypes: ['first-input'] });
        }
    }

    autoOptimizePerformance() {
        console.log('🔧 Auto-optimizing performance due to low FPS:', this.metrics.fps);

        // Reduce animation complexity
        if (!this.optimizations.animationFrameLimit) {
            this.limitAnimationFrames();
            this.optimizations.animationFrameLimit = true;
        }

        // Reduce particle effects
        if (!this.optimizations.particleEffectReduction && this.metrics.fps < 40) {
            this.reduceParticleEffects();
            this.optimizations.particleEffectReduction = true;
        }

        // Pause non-critical background processes
        if (!this.optimizations.backgroundProcessPause && this.metrics.fps < 30) {
            this.pauseBackgroundProcesses();
            this.optimizations.backgroundProcessPause = true;
        }
    }

    autoOptimizeMemory() {
        console.log('🧹 Auto-optimizing memory usage:', this.metrics.memoryUsage + 'MB');

        // Force garbage collection (if available)
        if (window.gc) {
            window.gc();
        }

        // Clear unused fish animations
        this.clearUnusedAnimations();

        // Reduce image quality for non-visible images
        if (!this.optimizations.imageQualityReduction) {
            this.reduceImageQuality();
            this.optimizations.imageQualityReduction = true;
        }
    }

    limitAnimationFrames() {
        // Implement frame skipping for animations
        let frameCount = 0;
        const originalRAF = window.requestAnimationFrame;

        window.requestAnimationFrame = function(callback) {
            frameCount++;
            if (frameCount % 2 === 0) { // Skip every other frame
                return originalRAF.call(this, callback);
            }
            return setTimeout(callback, 16); // Fallback timing
        };
    }

    reduceParticleEffects() {
        // Reduce bubble animations
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach((bubble, index) => {
            if (index % 2 === 0) {
                bubble.style.animationPlayState = 'paused';
            }
        });

        // Reduce fish animations
        const fish = document.querySelectorAll('.fish');
        fish.forEach((fishEl, index) => {
            if (index > 5) { // Limit to 5 animated fish
                fishEl.style.animation = 'none';
            }
        });
    }

    pauseBackgroundProcesses() {
        // Pause video preloading
        if (window.videoPreloader) {
            window.videoPreloader.pauseLoading();
        }

        // Reduce Supabase polling frequency
        if (window.highscoreDisplay) {
            window.highscoreDisplay.setUpdateInterval(60000); // 1 minute instead of 30s
        }
    }

    clearUnusedAnimations() {
        // Remove fish that are out of bounds
        const fish = document.querySelectorAll('.spawned-fish');
        fish.forEach(fishEl => {
            const rect = fishEl.getBoundingClientRect();
            if (rect.right < 0 || rect.left > window.innerWidth ||
                rect.bottom < 0 || rect.top > window.innerHeight) {
                fishEl.remove();
            }
        });
    }

    reduceImageQuality() {
        // Apply CSS filter to reduce rendering load
        const images = document.querySelectorAll('img:not([data-critical])');
        images.forEach(img => {
            if (!img.classList.contains('optimized')) {
                img.style.filter = 'contrast(0.9) brightness(0.95)';
                img.classList.add('optimized');
            }
        });
    }

    createPerformanceIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'performance-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 10000;
            display: none;
            font-family: monospace;
        `;

        document.body.appendChild(indicator);

        // Show/hide based on performance issues
        setInterval(() => {
            if (this.metrics.fps < this.thresholds.minFPS ||
                this.metrics.memoryUsage > this.thresholds.maxMemoryMB) {
                indicator.style.display = 'block';
            } else {
                indicator.style.display = 'none';
            }
        }, 2000);
    }

    updatePerformanceIndicator() {
        const indicator = document.getElementById('performance-indicator');
        if (indicator) {
            const status = this.getPerformanceStatus();
            indicator.innerHTML = `
                🎯 FPS: ${this.metrics.fps}
                💾 RAM: ${this.metrics.memoryUsage}MB
                ${status}
            `;

            // Color coding
            if (this.metrics.fps >= this.thresholds.minFPS) {
                indicator.style.background = 'rgba(34, 197, 94, 0.9)'; // Green
            } else if (this.metrics.fps >= 30) {
                indicator.style.background = 'rgba(251, 191, 36, 0.9)'; // Yellow
            } else {
                indicator.style.background = 'rgba(239, 68, 68, 0.9)'; // Red
            }
        }
    }

    getPerformanceStatus() {
        if (this.metrics.fps >= this.thresholds.minFPS &&
            this.metrics.memoryUsage <= this.thresholds.maxMemoryMB) {
            return '✅ Optimal';
        } else if (this.metrics.fps >= 30) {
            return '⚠️ Reduced';
        } else {
            return '🚨 Critical';
        }
    }

    getMetrics() {
        return {
            ...this.metrics,
            optimizations: this.optimizations,
            status: this.getPerformanceStatus()
        };
    }

    // Debug method for Play/Ride tests
    forceOptimization(type) {
        switch (type) {
            case 'performance':
                this.autoOptimizePerformance();
                break;
            case 'memory':
                this.autoOptimizeMemory();
                break;
            case 'reset':
                this.resetOptimizations();
                break;
        }
    }

    resetOptimizations() {
        // Reset all optimizations
        Object.keys(this.optimizations).forEach(key => {
            this.optimizations[key] = false;
        });

        // Restore original performance
        location.reload(); // Simple but effective reset
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.performanceOptimizer = new PerformanceOptimizer();
    });
} else {
    window.performanceOptimizer = new PerformanceOptimizer();
}