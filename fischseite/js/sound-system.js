/* 🔊 UNIVERSAL SOUND SYSTEM für alle Fischseite Games
   - Web Audio API für beste Performance
   - Preloaded Sound Pool für Zero-Delay Playback
   - Spatial Audio für 3D Aquarium Effects
   - Mobile-optimiert mit User Interaction Gate
*/

class AquariumSoundSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.isEnabled = true;
        this.masterVolume = 0.7;
        this.isInitialized = false;
        this.soundPool = new Map(); // Pre-decoded audio buffers

        console.log('🔊 Aquarium Sound System initialized');
    }

    // Initialize Audio Context (requires user interaction)
    async initializeAudio() {
        if (this.isInitialized) return true;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Resume context if suspended (mobile requirement)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            await this.preloadSounds();
            this.isInitialized = true;
            console.log('🎵 Audio Context initialized successfully');
            return true;
        } catch (error) {
            console.warn('🔇 Audio initialization failed:', error);
            return false;
        }
    }

    // Preload all aquarium sound effects
    async preloadSounds() {
        const soundEffects = {
            // Game Actions
            'click': this.generateTone(800, 0.1, 'sine'),
            'collect': this.generateTone(1200, 0.15, 'triangle'),
            'score': this.generateTone(1600, 0.2, 'sawtooth'),
            'win': this.generateChord([523, 659, 784], 0.5), // C-E-G major
            'lose': this.generateTone(200, 0.8, 'square'),

            // Fish Actions
            'spawn': this.generateTone(600, 0.2, 'sine'),
            'swim': this.generateTone(400, 0.1, 'triangle'),
            'bubble': this.generateTone(1000, 0.3, 'sine'),

            // UI Actions
            'button': this.generateTone(880, 0.1, 'square'),
            'success': this.generateChord([440, 554, 659], 0.4),
            'error': this.generateTone(150, 0.5, 'sawtooth'),

            // Special Effects
            'splash': this.generateNoise(0.2),
            'achievement': this.generateChord([523, 659, 784, 988], 0.6)
        };

        for (const [name, audioBuffer] of Object.entries(soundEffects)) {
            this.soundPool.set(name, await audioBuffer);
        }
    }

    // Generate pure tone for specific frequency
    generateTone(frequency, duration, waveType = 'sine') {
        return new Promise((resolve) => {
            const sampleRate = this.audioContext?.sampleRate || 44100;
            const length = sampleRate * duration;
            const buffer = this.audioContext?.createBuffer(1, length, sampleRate);
            const data = buffer?.getChannelData(0);

            if (!data) {
                resolve(null);
                return;
            }

            for (let i = 0; i < length; i++) {
                const time = i / sampleRate;
                let sample = 0;

                switch (waveType) {
                    case 'sine':
                        sample = Math.sin(2 * Math.PI * frequency * time);
                        break;
                    case 'square':
                        sample = Math.sin(2 * Math.PI * frequency * time) > 0 ? 1 : -1;
                        break;
                    case 'triangle':
                        sample = 2 * Math.abs(2 * (frequency * time - Math.floor(frequency * time + 0.5))) - 1;
                        break;
                    case 'sawtooth':
                        sample = 2 * (frequency * time - Math.floor(frequency * time + 0.5));
                        break;
                }

                // Smooth envelope to prevent clicks
                const envelope = Math.sin((Math.PI * i) / length);
                data[i] = sample * envelope * 0.3;
            }

            resolve(buffer);
        });
    }

    // Generate chord from multiple frequencies
    generateChord(frequencies, duration) {
        return new Promise((resolve) => {
            const sampleRate = this.audioContext?.sampleRate || 44100;
            const length = sampleRate * duration;
            const buffer = this.audioContext?.createBuffer(1, length, sampleRate);
            const data = buffer?.getChannelData(0);

            if (!data) {
                resolve(null);
                return;
            }

            for (let i = 0; i < length; i++) {
                const time = i / sampleRate;
                let sample = 0;

                // Mix all frequencies
                frequencies.forEach(freq => {
                    sample += Math.sin(2 * Math.PI * freq * time) / frequencies.length;
                });

                // Smooth envelope
                const envelope = Math.sin((Math.PI * i) / length);
                data[i] = sample * envelope * 0.2;
            }

            resolve(buffer);
        });
    }

    // Generate white noise for water/splash effects
    generateNoise(duration) {
        return new Promise((resolve) => {
            const sampleRate = this.audioContext?.sampleRate || 44100;
            const length = sampleRate * duration;
            const buffer = this.audioContext?.createBuffer(1, length, sampleRate);
            const data = buffer?.getChannelData(0);

            if (!data) {
                resolve(null);
                return;
            }

            for (let i = 0; i < length; i++) {
                const envelope = Math.exp(-3 * i / length); // Fast decay for splash
                data[i] = (Math.random() * 2 - 1) * envelope * 0.1;
            }

            resolve(buffer);
        });
    }

    // Play sound effect with optional spatial positioning
    async playSound(soundName, volume = 1.0, pan = 0, pitch = 1.0) {
        if (!this.isEnabled || !this.isInitialized || !this.audioContext) {
            return false;
        }

        const audioBuffer = this.soundPool.get(soundName);
        if (!audioBuffer) {
            console.warn(`🔇 Sound '${soundName}' not found`);
            return false;
        }

        try {
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            const pannerNode = this.audioContext.createStereoPanner();

            source.buffer = audioBuffer;
            source.playbackRate.value = pitch;

            gainNode.gain.value = volume * this.masterVolume;
            pannerNode.pan.value = Math.max(-1, Math.min(1, pan));

            // Chain: source → gain → panner → destination
            source.connect(gainNode);
            gainNode.connect(pannerNode);
            pannerNode.connect(this.audioContext.destination);

            source.start();
            return true;
        } catch (error) {
            console.warn('🔇 Sound playback failed:', error);
            return false;
        }
    }

    // Convenient methods for common game sounds
    playClick() { return this.playSound('click', 0.8); }
    playCollect() { return this.playSound('collect', 0.9, Math.random() * 0.4 - 0.2); }
    playScore() { return this.playSound('score', 1.0); }
    playWin() { return this.playSound('win', 1.0); }
    playLose() { return this.playSound('lose', 0.8); }
    playSpawn() { return this.playSound('spawn', 0.6, Math.random() * 0.6 - 0.3); }
    playBubble() { return this.playSound('bubble', 0.4, Math.random() * 0.8 - 0.4, 0.8 + Math.random() * 0.4); }
    playButton() { return this.playSound('button', 0.7); }
    playSuccess() { return this.playSound('success', 0.9); }
    playError() { return this.playSound('error', 0.6); }
    playSplash() { return this.playSound('splash', 0.5); }
    playAchievement() { return this.playSound('achievement', 1.0); }

    // Spatial fish swimming sounds
    playSwimSound(x, y, containerWidth) {
        const pan = (x / containerWidth) * 2 - 1; // Convert position to -1..1 pan
        const pitch = 0.9 + Math.random() * 0.2; // Slight pitch variation
        return this.playSound('swim', 0.3, pan, pitch);
    }

    // Volume control
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    // Enable/disable all sounds
    toggleSounds(enabled = null) {
        this.isEnabled = enabled !== null ? enabled : !this.isEnabled;
        console.log(`🔊 Sounds ${this.isEnabled ? 'enabled' : 'disabled'}`);
        return this.isEnabled;
    }

    // Initialize on first user interaction
    static initializeOnUserInteraction() {
        const soundSystem = new AquariumSoundSystem();
        let initialized = false;

        const initHandler = async () => {
            if (!initialized) {
                initialized = true;
                await soundSystem.initializeAudio();

                // Remove listeners after first initialization
                document.removeEventListener('click', initHandler);
                document.removeEventListener('touchstart', initHandler);
                document.removeEventListener('keydown', initHandler);

                // Make globally available
                window.aquariumSounds = soundSystem;

                console.log('🎵 Aquarium Sound System ready for games!');
            }
        };

        // Listen for any user interaction
        document.addEventListener('click', initHandler);
        document.addEventListener('touchstart', initHandler);
        document.addEventListener('keydown', initHandler);

        return soundSystem;
    }
}

// Auto-initialize sound system
if (typeof window !== 'undefined') {
    window.aquariumSounds = AquariumSoundSystem.initializeOnUserInteraction();
}

// Export for use in other modules
window.AquariumSoundSystem = AquariumSoundSystem;