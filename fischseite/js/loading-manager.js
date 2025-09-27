/* ⏳ LOADING MANAGER
   - Skeleton Screens
   - Progressive Loading
   - Performance Monitoring
*/

class LoadingManager {
    constructor() {
        this.loadingTasks = new Map();
        this.performanceMetrics = {};
        this.criticalResourcesLoaded = false;

        this.init();
    }

    init() {
        // Enhanced Performance Observer for Play/Ride tests
        if ('PerformanceObserver' in window) {
            const perfObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                        this.performanceMetrics.lcp = entry.startTime;
                    }
                    if (entry.entryType === 'first-input') {
                        this.performanceMetrics.fid = entry.processingStart - entry.startTime;
                    }
                    if (entry.entryType === 'layout-shift') {
                        this.performanceMetrics.cls = (this.performanceMetrics.cls || 0) + entry.value;
                    }
                }

                // Expose metrics for Play/Ride testing
                if (window.PlayRideTestActive) {
                    window.PlayRideMetrics = this.performanceMetrics;
                }
            });

            perfObserver.observe({
                entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']
            });
        }

        // Initial Loading Screen
        this.showInitialLoader();

        // Monitor Resource Loading
        this.monitorResources();
    }

    showInitialLoader() {
        const loader = document.createElement('div');
        loader.id = 'initial-loader';
        loader.innerHTML = `
            <div class="loader-container">
                <div class="aqua-loader">
                    <div class="fish-loader">🐠</div>
                    <div class="bubble b1"></div>
                    <div class="bubble b2"></div>
                    <div class="bubble b3"></div>
                </div>
                <p class="loading-text">Aquarium wird vorbereitet...</p>
                <div class="loading-progress">
                    <div class="progress-bar" id="load-progress"></div>
                </div>
            </div>
        `;

        const styles = document.createElement('style');
        styles.textContent = `
            #initial-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(180deg, #87CEEB 0%, #4682B4 100%);
                z-index: 99999;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: opacity 0.5s ease;
            }

            .loader-container {
                text-align: center;
            }

            .aqua-loader {
                position: relative;
                width: 200px;
                height: 200px;
                margin: 0 auto;
            }

            .fish-loader {
                font-size: 60px;
                animation: swim 2s ease-in-out infinite;
            }

            @keyframes swim {
                0%, 100% { transform: translateX(-30px) scaleX(1); }
                50% { transform: translateX(30px) scaleX(-1); }
            }

            .bubble {
                position: absolute;
                background: rgba(255,255,255,0.7);
                border-radius: 50%;
                animation: float 3s ease-in-out infinite;
            }

            .b1 { width: 20px; height: 20px; left: 30%; bottom: 20px; animation-delay: 0s; }
            .b2 { width: 15px; height: 15px; left: 50%; bottom: 30px; animation-delay: 0.5s; }
            .b3 { width: 25px; height: 25px; left: 70%; bottom: 15px; animation-delay: 1s; }

            @keyframes float {
                0% { transform: translateY(0) scale(1); opacity: 1; }
                100% { transform: translateY(-150px) scale(0.5); opacity: 0; }
            }

            .loading-text {
                color: white;
                font-size: 18px;
                margin-top: 20px;
                font-weight: 600;
            }

            .loading-progress {
                width: 200px;
                height: 6px;
                background: rgba(255,255,255,0.3);
                border-radius: 3px;
                margin: 20px auto;
                overflow: hidden;
            }

            .progress-bar {
                height: 100%;
                background: #4ECDC4;
                width: 0%;
                transition: width 0.3s ease;
            }
        `;
        document.head.appendChild(styles);
        document.body.appendChild(loader);
    }

    updateProgress(percent) {
        const progressBar = document.getElementById('load-progress');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
    }

    addTask(name, promise) {
        this.loadingTasks.set(name, {
            promise,
            startTime: performance.now(),
            status: 'pending'
        });

        promise
            .then(() => {
                const task = this.loadingTasks.get(name);
                task.status = 'completed';
                task.endTime = performance.now();
                this.checkAllTasksComplete();
            })
            .catch(error => {
                console.error(`Loading task failed: ${name}`, error);
                const task = this.loadingTasks.get(name);
                task.status = 'failed';
                this.checkAllTasksComplete();
            });

        return promise;
    }

    checkAllTasksComplete() {
        const total = this.loadingTasks.size;
        const completed = Array.from(this.loadingTasks.values())
            .filter(t => t.status !== 'pending').length;

        const progress = (completed / total) * 100;
        this.updateProgress(progress);

        if (completed === total) {
            this.onAllTasksComplete();
        }
    }

    onAllTasksComplete() {
        this.criticalResourcesLoaded = true;

        // Log Performance Metrics
        console.log('📊 Performance Metrics:', {
            tasks: Array.from(this.loadingTasks.entries()).map(([name, task]) => ({
                name,
                duration: task.endTime - task.startTime,
                status: task.status
            })),
            lcp: this.performanceMetrics.lcp
        });

        // Hide Loader
        setTimeout(() => {
            const loader = document.getElementById('initial-loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }
        }, 500);
    }

    monitorResources() {
        // Monitor kritische Ressourcen
        const criticalImages = document.querySelectorAll('img[loading="eager"]');
        const imagePromises = Array.from(criticalImages).map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                }
            });
        });

        if (imagePromises.length > 0) {
            this.addTask('critical-images', Promise.all(imagePromises));
        }

        // Monitor Scripts
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach((script, index) => {
            if (!script.async && !script.defer) {
                this.addTask(`script-${index}`, new Promise((resolve) => {
                    script.addEventListener('load', resolve);
                    script.addEventListener('error', resolve);
                }));
            }
        });
    }

    // Lazy Load Images
    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // Skeleton Screen für dynamischen Content
    showSkeleton(container, type = 'default') {
        const skeletons = {
            default: `
                <div class="skeleton-loader">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-line"></div>
                </div>
            `,
            card: `
                <div class="skeleton-card">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line short"></div>
                    </div>
                </div>
            `
        };

        container.innerHTML = skeletons[type] || skeletons.default;

        // Add skeleton styles if not exists
        if (!document.getElementById('skeleton-styles')) {
            const styles = document.createElement('style');
            styles.id = 'skeleton-styles';
            styles.textContent = `
                .skeleton-loader, .skeleton-card {
                    animation: pulse 1.5s ease-in-out infinite;
                }

                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                }

                .skeleton-line {
                    height: 12px;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    margin: 10px 0;
                    border-radius: 4px;
                }

                .skeleton-line.short {
                    width: 60%;
                }

                .skeleton-image {
                    width: 100%;
                    height: 200px;
                    background: #e0e0e0;
                    border-radius: 8px;
                }
            `;
            document.head.appendChild(styles);
        }
    }
}

// Initialisiere Loading Manager
window.loadingManager = new LoadingManager();

// Exportiere für andere Module
window.LoadingManager = LoadingManager;