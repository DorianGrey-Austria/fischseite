/* 🎬 PROFESSIONELLER VIDEO PRELOADER
   - Alle Videos vorladen für ruckelfreie Wiedergabe
   - Aquarium-Design Ladeanimation
   - Progress-Tracking
   - Fallback für langsamere Verbindungen
*/

class VideoPreloader {
    constructor() {
        this.videos = [];
        this.loaded = 0;
        this.total = 0;
        this.loadingComplete = false;
        this.isActive = false;
        this.userInitiated = false;
    }

    // Wird nur aufgerufen, wenn User Videos ansehen möchte
    startPreloading() {
        if (this.isActive || this.loadingComplete) {
            return;
        }

        console.log('🎬 Video-Preloader wird gestartet...');
        this.userInitiated = true;
        this.init();
    }

    init() {
        this.isActive = true;
        this.findVideos();
        this.createLoadingScreen();
        this.preloadAll();
    }

    findVideos() {
        // Sammle alle Video-URLs aus der Website
        const videoElements = document.querySelectorAll('video');
        const videoSources = document.querySelectorAll('source');

        videoElements.forEach(video => {
            if (video.src) {
                this.videos.push(video.src);
            }
        });

        videoSources.forEach(source => {
            if (source.src) {
                this.videos.push(source.src);
            }
        });

        // Manuelle Video-Liste (falls nicht im DOM)
        const manualVideos = [
            'videos/video1.mov',
            'videos/video2.mov',
            'videos/video3.mov',
            'videos/video4.mov',
            'videos/video5.mov',
            'videos/video6.mov',
            'videos/video7.mov'
        ];

        // Füge manuelle Videos hinzu, die existieren könnten
        manualVideos.forEach(url => {
            if (!this.videos.includes(url)) {
                this.videos.push(url);
            }
        });

        this.total = this.videos.length;
        console.log(`🎬 Found ${this.total} videos to preload:`, this.videos);
    }

    createLoadingScreen() {
        // Loading Screen HTML
        const loadingHTML = `
            <div id="video-loading-screen" class="video-loading-screen">
                <div class="loading-aquarium">
                    <div class="loading-fish">🐠</div>
                    <div class="loading-bubbles">
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                        <div class="bubble"></div>
                    </div>
                    <div class="loading-text">
                        <h2>🎬 Videos werden geladen...</h2>
                        <p>Für die beste Erfahrung laden wir alle Videos vor</p>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" id="progress-fill"></div>
                            </div>
                            <div class="progress-text">
                                <span id="progress-current">0</span> / <span id="progress-total">${this.total}</span>
                                (<span id="progress-percent">0</span>%)
                            </div>
                        </div>
                    </div>
                    <div class="loading-skip">
                        <button id="skip-loading" class="skip-btn">
                            ⏭️ Überspringen und fortfahren
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Loading Screen CSS
        const loadingCSS = `
            <style>
                .video-loading-screen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(180deg, #87CEEB 0%, #4682B4 50%, #191970 100%);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    color: white;
                    font-family: 'Segoe UI', sans-serif;
                    transition: opacity 0.5s ease;
                }

                .loading-aquarium {
                    text-align: center;
                    max-width: 500px;
                    padding: 2rem;
                }

                .loading-fish {
                    font-size: 80px;
                    animation: swim-loading 3s ease-in-out infinite;
                    margin-bottom: 2rem;
                    display: inline-block;
                }

                @keyframes swim-loading {
                    0%, 100% {
                        transform: translateX(-30px) scaleX(1) rotate(0deg);
                    }
                    25% {
                        transform: translateX(-15px) scaleX(1) rotate(5deg);
                    }
                    50% {
                        transform: translateX(30px) scaleX(-1) rotate(0deg);
                    }
                    75% {
                        transform: translateX(15px) scaleX(-1) rotate(-5deg);
                    }
                }

                .loading-bubbles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    overflow: hidden;
                }

                .bubble {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    animation: bubble-rise 4s infinite linear;
                }

                .bubble:nth-child(1) {
                    width: 10px;
                    height: 10px;
                    left: 10%;
                    animation-delay: 0s;
                    animation-duration: 4s;
                }

                .bubble:nth-child(2) {
                    width: 15px;
                    height: 15px;
                    left: 30%;
                    animation-delay: 1s;
                    animation-duration: 5s;
                }

                .bubble:nth-child(3) {
                    width: 8px;
                    height: 8px;
                    left: 60%;
                    animation-delay: 2s;
                    animation-duration: 3.5s;
                }

                .bubble:nth-child(4) {
                    width: 12px;
                    height: 12px;
                    left: 80%;
                    animation-delay: 3s;
                    animation-duration: 4.5s;
                }

                .bubble:nth-child(5) {
                    width: 18px;
                    height: 18px;
                    left: 90%;
                    animation-delay: 0.5s;
                    animation-duration: 6s;
                }

                @keyframes bubble-rise {
                    0% {
                        bottom: -50px;
                        opacity: 0;
                        transform: translateX(0);
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        bottom: 100vh;
                        opacity: 0;
                        transform: translateX(20px);
                    }
                }

                .loading-text h2 {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }

                .loading-text p {
                    font-size: 1.2rem;
                    margin-bottom: 2rem;
                    opacity: 0.9;
                }

                .progress-container {
                    margin: 2rem 0;
                }

                .progress-bar {
                    width: 100%;
                    height: 12px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4ECDC4, #44A08D);
                    width: 0%;
                    transition: width 0.3s ease;
                    box-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
                    border-radius: 6px;
                }

                .progress-text {
                    font-size: 1.1rem;
                    font-weight: bold;
                    color: rgba(255, 255, 255, 0.9);
                }

                .loading-skip {
                    margin-top: 2rem;
                }

                .skip-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 16px;
                    backdrop-filter: blur(10px);
                }

                .skip-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.5);
                    transform: translateY(-2px);
                }

                .fade-out {
                    opacity: 0;
                    pointer-events: none;
                }

                @media (max-width: 768px) {
                    .loading-aquarium {
                        padding: 1rem;
                    }

                    .loading-fish {
                        font-size: 60px;
                    }

                    .loading-text h2 {
                        font-size: 1.5rem;
                    }

                    .loading-text p {
                        font-size: 1rem;
                    }
                }
            </style>
        `;

        // CSS zu Head hinzufügen
        document.head.insertAdjacentHTML('beforeend', loadingCSS);

        // Loading Screen zu Body hinzufügen
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);

        // Skip Button Event
        document.getElementById('skip-loading').addEventListener('click', () => {
            this.hideLoadingScreen();
        });
    }

    async preloadAll() {
        if (this.total === 0) {
            console.log('📹 No videos found to preload');
            this.hideLoadingScreen();
            return;
        }

        console.log(`🚀 Starting preload of ${this.total} videos...`);

        // Timeout für langsame Verbindungen (30 Sekunden)
        const timeout = setTimeout(() => {
            console.log('⏰ Preload timeout - continuing anyway');
            this.hideLoadingScreen();
        }, 30000);

        try {
            // Videos parallel laden (max 3 gleichzeitig)
            const batchSize = 3;
            for (let i = 0; i < this.videos.length; i += batchSize) {
                const batch = this.videos.slice(i, i + batchSize);
                const promises = batch.map(url => this.preloadVideo(url));
                await Promise.allSettled(promises);
            }

            clearTimeout(timeout);
            this.loadingComplete = true;

            // Kurz warten, dann ausblenden
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 1000);

        } catch (error) {
            console.error('❌ Error during video preload:', error);
            clearTimeout(timeout);
            this.hideLoadingScreen();
        }
    }

    preloadVideo(url) {
        return new Promise((resolve) => {
            console.log(`📹 Preloading: ${url}`);

            const video = document.createElement('video');
            video.preload = 'auto';
            video.src = url;

            const onLoad = () => {
                this.loaded++;
                this.updateProgress();
                console.log(`✅ Loaded: ${url} (${this.loaded}/${this.total})`);
                cleanup();
                resolve();
            };

            const onError = () => {
                console.warn(`⚠️ Failed to load: ${url}`);
                this.loaded++;
                this.updateProgress();
                cleanup();
                resolve(); // Continue anyway
            };

            const onTimeout = () => {
                console.warn(`⏰ Timeout loading: ${url}`);
                this.loaded++;
                this.updateProgress();
                cleanup();
                resolve(); // Continue anyway
            };

            const cleanup = () => {
                video.removeEventListener('canplaythrough', onLoad);
                video.removeEventListener('error', onError);
                clearTimeout(timeoutId);
            };

            video.addEventListener('canplaythrough', onLoad);
            video.addEventListener('error', onError);

            // Timeout pro Video (10 Sekunden)
            const timeoutId = setTimeout(onTimeout, 10000);

            // Video-Element zum DOM hinzufügen (versteckt)
            video.style.display = 'none';
            document.body.appendChild(video);
        });
    }

    updateProgress() {
        const percent = Math.round((this.loaded / this.total) * 100);

        const progressFill = document.getElementById('progress-fill');
        const progressCurrent = document.getElementById('progress-current');
        const progressPercent = document.getElementById('progress-percent');

        if (progressFill) progressFill.style.width = percent + '%';
        if (progressCurrent) progressCurrent.textContent = this.loaded;
        if (progressPercent) progressPercent.textContent = percent;

        console.log(`📊 Progress: ${this.loaded}/${this.total} (${percent}%)`);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('video-loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }

        // Event für andere Scripts
        document.dispatchEvent(new CustomEvent('videosPreloaded', {
            detail: {
                loaded: this.loaded,
                total: this.total,
                completed: this.loadingComplete
            }
        }));

        console.log('🎉 Video preloading completed!');
    }

    // Öffentliche Methode um Status zu prüfen
    isReady() {
        return this.loadingComplete;
    }

    // Methode um einzelnes Video zu prüfen
    isVideoReady(url) {
        return this.loaded > 0; // Vereinfacht - könnte spezifischer sein
    }
}

// Video Preloader Setup (erst auf User-Anfrage)
let videoPreloader = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Video Preloader bereit - wartet auf User-Interaktion');

    // Preloader-Instanz erstellen aber noch nicht starten
    videoPreloader = new VideoPreloader();

    // Global verfügbar machen
    window.videoPreloader = videoPreloader;

    // Event Listener für Video-bezogene User-Aktionen
    setupVideoTriggers();
});

// Setup für automatische Triggers
function setupVideoTriggers() {
    // 1. Wenn User zu Video-Galerie scrollt
    const videoSections = document.querySelectorAll('[class*="video"], [class*="galerie"]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && videoPreloader && !videoPreloader.isActive) {
                console.log('📺 User scrollt zu Video-Bereich - starte Preloader');
                videoPreloader.startPreloading();
            }
        });
    }, {
        rootMargin: '200px' // Starte schon 200px bevor Sektion sichtbar wird
    });

    videoSections.forEach(section => observer.observe(section));

    // 2. Beim ersten Klick auf ein Video
    document.addEventListener('click', (e) => {
        const video = e.target.closest('video');
        if (video && videoPreloader && !videoPreloader.isActive) {
            console.log('🎬 User klickt auf Video - starte Preloader');
            videoPreloader.startPreloading();
        }
    });

    // 3. Manual Trigger über Button (optional)
    const videoButtons = document.querySelectorAll('[data-action="preload-videos"]');
    videoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (videoPreloader && !videoPreloader.isActive) {
                console.log('🎥 Manual Video-Preloader Start');
                videoPreloader.startPreloading();
            }
        });
    });

    console.log('✅ Video-Trigger eingerichtet - Preloader startet bei Bedarf');
}

// Event Listener für bessere Video-Performance
document.addEventListener('videosPreloaded', (e) => {
    console.log('📺 Videos ready for playback:', e.detail);

    // Alle Video-Elemente optimieren
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.setAttribute('preload', 'auto');

        // Autoplay vorbereiten (falls gewünscht)
        video.addEventListener('loadstart', () => {
            console.log(`🎥 Video loading: ${video.src}`);
        });

        video.addEventListener('canplaythrough', () => {
            console.log(`✅ Video ready: ${video.src}`);
        });
    });
});

// Export für andere Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoPreloader;
}