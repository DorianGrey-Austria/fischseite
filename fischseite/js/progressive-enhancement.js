/*
🚀 PROGRESSIVE ENHANCEMENT 2025
   - Instant Page Load (sofort sichtbar)
   - Background Resource Loading
   - Smart Lazy Loading
   - NO BLOCKING UI!
*/

class ProgressiveEnhancementManager {
    constructor() {
        this.resourceQueue = new Map();
        this.loadingPhases = {
            instant: ['core-css', 'core-js'],           // 0ms - sofort
            background: ['games', 'fish-system'],        // 500ms - nach first paint
            lazy: ['images', 'videos'],                  // on-demand
            enhanced: ['animations', 'sound']            // user-triggered
        };

        this.loadedResources = new Set();
        this.isPageReady = false;

        console.log('🚀 Progressive Enhancement Manager gestartet');
        this.init();
    }

    init() {
        // 1. INSTANT: Seite ist sofort sichtbar!
        this.enableInstantInteractivity();

        // 2. BACKGROUND: Nach 500ms - Games & Fish laden
        setTimeout(() => this.loadBackgroundFeatures(), 500);

        // 3. LAZY: Videos nur bei Bedarf
        this.setupLazyVideoLoading();

        // 4. ENHANCED: Sound & Animations bei User-Interaktion
        this.setupEnhancedFeatures();
    }

    enableInstantInteractivity() {
        // Seite ist SOFORT benutzbar!
        this.isPageReady = true;

        // Basis-Navigation sofort verfügbar
        this.enableBasicNavigation();

        // Schnelle Micro-Interactions
        this.enableQuickActions();

        console.log('✅ INSTANT: Seite sofort interaktiv!');
        this.showProgressIndicator('Seite geladen', 100, 'instant');
    }

    enableBasicNavigation() {
        // Tab-Switching sofort verfügbar
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => {
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        });

        // Scroll-Navigation
        this.enableSmoothScrolling();
    }

    enableQuickActions() {
        // Click-to-spawn Fish (lightweight version erst mal)
        const existingFish = document.querySelectorAll('.floating-fish img');
        existingFish.forEach(fish => {
            fish.addEventListener('click', (e) => {
                this.createQuickFishSpawn(e.target);
            });
        });

        console.log('🐠 Basis-Fish-Interactions verfügbar');
    }

    createQuickFishSpawn(clickedFish) {
        // Lightweight fish spawn (kein schweres System laden)
        const newFish = clickedFish.cloneNode(true);
        newFish.style.position = 'absolute';
        newFish.style.left = (Math.random() * 80) + 'vw';
        newFish.style.top = (Math.random() * 60 + 20) + 'vh';
        newFish.style.animation = 'swim-simple 8s linear infinite';
        newFish.style.opacity = '0.8';
        newFish.style.transform = 'scale(0.8)';

        document.body.appendChild(newFish);

        // Auto-remove nach 10 Sekunden
        setTimeout(() => newFish.remove(), 10000);

        this.showProgressIndicator('🐠 Fisch gespawnt!', 100, 'instant', 1000);
    }

    async loadBackgroundFeatures() {
        console.log('🔄 BACKGROUND: Lade Games & Enhanced Fish System...');

        try {
            // Games laden (nicht-blockierend)
            await this.loadFeature('aquarium-game', () => {
                return this.loadScript('js/aquarium-collector-game.js');
            });

            // Enhanced Fish System laden
            await this.loadFeature('smart-fish', () => {
                return this.loadScript('js/smart-fish-system.js');
            });

            // Highscore System laden
            await this.loadFeature('highscore-display', () => {
                return this.loadScript('js/highscore-display.js');
            });

            // Performance & Loading Manager laden (niedrige Priorität)
            setTimeout(() => {
                this.loadFeature('performance-optimizer', () => {
                    return this.loadScript('js/performance-optimizer.js');
                });
                // REMOVED: loading-manager.js (was causing blocking loader screen)
                this.loadFeature('error-handler', () => {
                    return this.loadScript('js/error-handler.js');
                });
            }, 2000);

            console.log('✅ BACKGROUND: Games, Fish-System & Highscores bereit!');
            this.showProgressIndicator('Alle Features bereit', 100, 'background');

        } catch (error) {
            console.warn('⚠️ Background loading error:', error);
            // Seite funktioniert trotzdem!
        }
    }

    setupLazyVideoLoading() {
        console.log('📺 LAZY: Video Intersection Observer setup...');

        const videoContainers = document.querySelectorAll('.video-card, video');

        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadVideoOnDemand(entry.target);
                    videoObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '200px' // Laden bevor sichtbar
        });

        videoContainers.forEach(container => {
            videoObserver.observe(container);
            this.addVideoPlaceholder(container);
        });
    }

    loadVideoOnDemand(videoContainer) {
        console.log('📹 Loading video on demand:', videoContainer);

        const video = videoContainer.querySelector('video');
        if (video && !video.src) {
            // Video lazy loaden
            const dataSrc = video.getAttribute('data-src');
            if (dataSrc) {
                video.src = dataSrc;

                this.showProgressIndicator('Video lädt...', 0, 'lazy');

                video.addEventListener('loadstart', () => {
                    this.showProgressIndicator('Video lädt...', 25, 'lazy');
                });

                video.addEventListener('canplay', () => {
                    this.showProgressIndicator('Video bereit', 100, 'lazy', 2000);
                });
            }
        }
    }

    addVideoPlaceholder(container) {
        const video = container.querySelector('video');
        if (video) {
            // Placeholder Poster
            video.poster = video.poster || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDY4MkI0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNHB4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNsaWNrIHRvIFBsYXk8L3RleHQ+PC9zdmc+';
        }
    }

    setupEnhancedFeatures() {
        // Sound & Advanced Animations nur bei User-Interaktion
        document.addEventListener('click', () => {
            if (!this.loadedResources.has('enhanced-audio')) {
                this.loadEnhancedAudio();
            }
        }, { once: true });

        // Advanced Animations bei Hover
        document.addEventListener('mouseover', () => {
            if (!this.loadedResources.has('advanced-animations')) {
                this.loadAdvancedAnimations();
            }
        }, { once: true });
    }

    async loadEnhancedAudio() {
        try {
            console.log('🔊 Loading enhanced audio features...');
            // Audio-Features laden falls vorhanden
            this.loadedResources.add('enhanced-audio');
            this.showProgressIndicator('Sound aktiviert', 100, 'enhanced', 1500);
        } catch (error) {
            console.warn('Audio loading failed:', error);
        }
    }

    async loadAdvancedAnimations() {
        try {
            console.log('✨ Loading advanced animations...');
            // Erweiterte Animationen aktivieren
            document.body.classList.add('enhanced-animations');
            this.loadedResources.add('advanced-animations');
            this.showProgressIndicator('Animationen erweitert', 100, 'enhanced', 1500);
        } catch (error) {
            console.warn('Animation enhancement failed:', error);
        }
    }

    async loadFeature(featureName, loadFunction) {
        if (this.loadedResources.has(featureName)) {
            return;
        }

        try {
            await loadFunction();
            this.loadedResources.add(featureName);
            console.log(`✅ Feature loaded: ${featureName}`);
        } catch (error) {
            console.warn(`⚠️ Feature failed: ${featureName}`, error);
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    enableSmoothScrolling() {
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    showProgressIndicator(message, percentage, phase, duration = 3000) {
        // MICRO-INDICATOR - DISABLED (no visual loading indicators)
        return; // Early return - no loading indicators shown

        const indicator = document.createElement('div');
        indicator.className = 'progress-micro-indicator';
        indicator.innerHTML = `
            <div class="micro-indicator-content">
                <span class="micro-message">${message}</span>
                <div class="micro-progress">
                    <div class="micro-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;

        // Styling direkt eingebettet
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(70, 130, 180, 0.95);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1000;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 250px;
        `;

        // Micro Progress Bar
        const microProgress = indicator.querySelector('.micro-progress');
        if (microProgress) {
            microProgress.style.cssText = `
                width: 100%;
                height: 3px;
                background: rgba(255,255,255,0.3);
                border-radius: 2px;
                margin-top: 6px;
                overflow: hidden;
            `;
        }

        const microFill = indicator.querySelector('.micro-fill');
        if (microFill) {
            microFill.style.cssText = `
                height: 100%;
                background: linear-gradient(90deg, #4ECDC4, #44A08D);
                border-radius: 2px;
                transition: width 0.3s ease;
            `;
        }

        document.body.appendChild(indicator);

        // Slide in
        setTimeout(() => {
            indicator.style.transform = 'translateX(0)';
        }, 100);

        // Slide out
        setTimeout(() => {
            indicator.style.transform = 'translateX(100%)';
            setTimeout(() => indicator.remove(), 300);
        }, duration);
    }

    // Public API
    isFeatureReady(featureName) {
        return this.loadedResources.has(featureName);
    }

    getLoadingStatus() {
        return {
            pageReady: this.isPageReady,
            loadedFeatures: Array.from(this.loadedResources),
            totalFeatures: Object.keys(this.loadingPhases).reduce(
                (total, phase) => total + this.loadingPhases[phase].length, 0
            )
        };
    }
}

// Auto-Start (aber non-blocking!)
document.addEventListener('DOMContentLoaded', () => {
    window.progressiveManager = new ProgressiveEnhancementManager();

    // Global verfügbar für andere Scripts
    window.addEventListener('load', () => {
        console.log('🎉 Page vollständig geladen - alle Features aktiv!');
    });
});

// CSS für bessere Performance
const progressiveCSS = `
<style>
.micro-indicator-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.micro-message {
    font-weight: 500;
    font-size: 13px;
}

/* Simple fish animation for quick spawns */
@keyframes swim-simple {
    0% { transform: translateX(-20px) scaleX(1); }
    25% { transform: translateX(20vw) scaleX(1) rotate(5deg); }
    50% { transform: translateX(60vw) scaleX(-1) rotate(0deg); }
    75% { transform: translateX(80vw) scaleX(-1) rotate(-5deg); }
    100% { transform: translateX(100vw) scaleX(-1); }
}

/* Enhanced animations - nur bei Hover laden */
.enhanced-animations .floating-fish {
    transition: transform 0.3s ease;
}

.enhanced-animations .floating-fish:hover {
    transform: scale(1.1) rotate(5deg);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', progressiveCSS);

// Export nur für Module-Umgebungen
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProgressiveEnhancementManager };
}