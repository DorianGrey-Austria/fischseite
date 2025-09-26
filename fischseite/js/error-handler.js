/* 🛡️ GLOBAL ERROR HANDLER
   - Graceful Error Handling
   - Fallback für Offline-Modus
   - User-Friendly Error Messages
*/

class GlobalErrorHandler {
    constructor() {
        this.errors = [];
        this.warningShown = false;
        this.offlineMode = false;

        this.setupHandlers();
        this.checkConnectivity();
    }

    setupHandlers() {
        // Global Error Handler
        window.addEventListener('error', (e) => {
            this.handleError(e.error || new Error(e.message), e.filename, e.lineno);
            e.preventDefault();
        });

        // Unhandled Promise Rejection
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError(new Error(e.reason), 'Promise');
            e.preventDefault();
        });

        // Network Status
        window.addEventListener('online', () => {
            this.offlineMode = false;
            this.showNotification('Verbindung wiederhergestellt', 'success');
        });

        window.addEventListener('offline', () => {
            this.offlineMode = true;
            this.showNotification('Offline-Modus aktiviert', 'warning');
        });
    }

    handleError(error, source = 'Unknown', line = 0) {
        console.error(`[Error Handler] ${source}:${line}`, error);

        this.errors.push({
            message: error.message,
            source,
            line,
            timestamp: new Date()
        });

        // Spezifische Fehlerbehandlung
        if (error.message?.includes('Supabase') || error.message?.includes('supabase')) {
            this.handleSupabaseError(error);
        } else if (error.message?.includes('fetch')) {
            this.handleNetworkError(error);
        } else if (error.message?.includes('TypeError')) {
            this.handleTypeError(error);
        }
    }

    handleSupabaseError(error) {
        console.warn('Supabase nicht verfügbar - Offline-Modus aktiviert');

        // Deaktiviere Highscore-Features
        const highscoreElements = document.querySelectorAll('.highscore-strip, #highscore-dialog');
        highscoreElements.forEach(el => {
            el.style.display = 'none';
        });

        if (!this.warningShown) {
            this.showNotification('Highscore-System offline - Spiel funktioniert trotzdem!', 'info');
            this.warningShown = true;
        }
    }

    handleNetworkError(error) {
        console.warn('Netzwerkfehler:', error);

        // Fallback für fehlende Ressourcen
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete || img.naturalHeight === 0) {
                img.src = 'data:image/svg+xml;base64,' + btoa(`
                    <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#E8F4F8"/>
                        <text x="50%" y="50%" text-anchor="middle" fill="#006994" font-size="14">
                            🐠 Bild lädt...
                        </text>
                    </svg>
                `);
            }
        });
    }

    handleTypeError(error) {
        console.warn('Type Error - möglicherweise fehlende Funktion:', error);
    }

    checkConnectivity() {
        // Teste Supabase-Verbindung
        if (window.SupabaseHighscoreManager) {
            const testManager = new SupabaseHighscoreManager();
            setTimeout(() => {
                if (!testManager.isConnected) {
                    this.handleSupabaseError(new Error('Supabase connection failed'));
                }
            }, 3000);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `error-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#FF6B6B' :
                         type === 'warning' ? '#FFA500' :
                         type === 'success' ? '#4ECDC4' : '#006994'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-size: 14px;
            animation: slideDown 0.3s ease;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Sichere Funktion für Game-Initialisierung
    safeGameInit(callback) {
        try {
            callback();
        } catch (error) {
            this.handleError(error, 'Game Initialization');
            this.showNotification('Spielfehler - Seite neu laden empfohlen', 'warning');
        }
    }

    // Sichere Fetch-Wrapper
    async safeFetch(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                signal: AbortSignal.timeout(10000) // 10 Sekunden Timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return response;
        } catch (error) {
            this.handleError(error, 'Network Request');

            // Return dummy response für graceful degradation
            return {
                ok: false,
                json: async () => ({}),
                text: async () => '',
                status: 0
            };
        }
    }
}

// Animation Styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideDown {
        from { opacity: 0; transform: translate(-50%, -20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes slideUp {
        from { opacity: 1; transform: translate(-50%, 0); }
        to { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(animationStyles);

// Initialisiere Global Error Handler
window.errorHandler = new GlobalErrorHandler();

console.log('🛡️ Global Error Handler aktiviert');