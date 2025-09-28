/* 📱 HAPTIC FEEDBACK SYSTEM für Mobile Touch Events
   - Navigator.vibrate API für Android/iOS Support
   - Touch-optimierte Patterns für verschiedene Game Actions
   - Battery-optimiert mit Smart Timing
   - Accessibility-friendly mit User Preferences
*/

class AquariumHapticSystem {
    constructor() {
        this.isSupported = 'vibrate' in navigator;
        this.isEnabled = true;
        this.patterns = this.initializePatterns();
        this.lastVibration = 0;
        this.minInterval = 50; // Minimum 50ms between vibrations

        console.log(`📱 Haptic System: ${this.isSupported ? 'Supported' : 'Not Supported'}`);
    }

    // Initialize vibration patterns for different game actions
    initializePatterns() {
        return {
            // Quick feedback (50ms or less)
            'click': [30],
            'button': [25],
            'hover': [15],

            // Game actions (100-200ms)
            'collect': [40, 20, 40],
            'spawn': [60],
            'score': [80, 30, 50],

            // Success patterns (200-500ms)
            'win': [100, 50, 100, 50, 150],
            'achievement': [200, 100, 200],
            'perfect': [80, 40, 80, 40, 80, 40, 120],

            // Error patterns (sharp and distinctive)
            'error': [200, 100, 200],
            'lose': [500],

            // Special aquarium effects
            'bubble': [20, 10, 20],
            'splash': [60, 30, 40, 20, 30],
            'swim': [15, 5, 10],

            // Touch gestures
            'drag_start': [40],
            'drag_end': [20, 10, 20],
            'pinch': [30, 15, 30],
            'swipe': [50]
        };
    }

    // Main vibration method with throttling
    vibrate(pattern, force = false) {
        if (!this.isSupported || !this.isEnabled) {
            return false;
        }

        const now = Date.now();
        if (!force && (now - this.lastVibration) < this.minInterval) {
            return false; // Throttle rapid vibrations
        }

        try {
            let vibrationPattern;

            if (typeof pattern === 'string') {
                vibrationPattern = this.patterns[pattern] || [30];
            } else if (Array.isArray(pattern)) {
                vibrationPattern = pattern;
            } else if (typeof pattern === 'number') {
                vibrationPattern = [pattern];
            } else {
                vibrationPattern = [30]; // Default
            }

            // Ensure pattern doesn't exceed mobile limits (most support max 5000ms total)
            const totalDuration = vibrationPattern.reduce((sum, duration) => sum + duration, 0);
            if (totalDuration > 1000) {
                console.warn('📱 Vibration pattern too long, truncating');
                vibrationPattern = [100]; // Fallback to simple vibration
            }

            navigator.vibrate(vibrationPattern);
            this.lastVibration = now;
            return true;
        } catch (error) {
            console.warn('📱 Vibration failed:', error);
            return false;
        }
    }

    // Convenient methods for common game actions
    click() { return this.vibrate('click'); }
    button() { return this.vibrate('button'); }
    collect() { return this.vibrate('collect'); }
    spawn() { return this.vibrate('spawn'); }
    score() { return this.vibrate('score'); }
    win() { return this.vibrate('win'); }
    lose() { return this.vibrate('lose'); }
    error() { return this.vibrate('error'); }
    achievement() { return this.vibrate('achievement'); }
    perfect() { return this.vibrate('perfect'); }
    bubble() { return this.vibrate('bubble'); }
    splash() { return this.vibrate('splash'); }
    swim() { return this.vibrate('swim'); }

    // Touch gesture feedback
    dragStart() { return this.vibrate('drag_start'); }
    dragEnd() { return this.vibrate('drag_end'); }
    pinch() { return this.vibrate('pinch'); }
    swipe() { return this.vibrate('swipe'); }

    // Dynamic feedback based on game state
    scoreMultiplier(multiplier) {
        const intensity = Math.min(200, 50 + (multiplier * 20));
        return this.vibrate([intensity]);
    }

    healthWarning(healthLevel) {
        // More intense vibration for lower health (0.0 to 1.0)
        const intensity = Math.round(200 * (1 - healthLevel));
        return this.vibrate([intensity, 100, intensity]);
    }

    proximityFeedback(distance) {
        // Vibration intensity based on proximity (0.0 = close, 1.0 = far)
        const intensity = Math.round(80 * (1 - distance));
        if (intensity > 10) {
            return this.vibrate([intensity]);
        }
        return false;
    }

    // Progressive feedback for sequences
    sequenceStep(step, totalSteps) {
        const baseIntensity = 30;
        const stepIntensity = baseIntensity + (step * 10);
        return this.vibrate([stepIntensity]);
    }

    // Special combination patterns
    comboFeedback(comboLength) {
        if (comboLength <= 1) return this.collect();

        const pattern = [];
        for (let i = 0; i < Math.min(comboLength, 5); i++) {
            pattern.push(30 + (i * 10));
            if (i < comboLength - 1) pattern.push(15);
        }
        return this.vibrate(pattern);
    }

    // Fish interaction patterns
    fishHappy() {
        return this.vibrate([40, 20, 40, 20, 60]);
    }

    fishHungry() {
        return this.vibrate([80, 40, 80]);
    }

    fishSick() {
        return this.vibrate([200, 50, 100, 50, 200]);
    }

    // Racing game patterns
    raceStart() {
        return this.vibrate([100, 100, 100, 200]); // Ready, Set, Go!
    }

    raceFinish(position) {
        switch(position) {
            case 1: return this.vibrate([200, 50, 200, 50, 300]); // 1st place
            case 2: return this.vibrate([150, 50, 150]); // 2nd place
            case 3: return this.vibrate([100, 50, 100]); // 3rd place
            default: return this.vibrate([50]); // Other positions
        }
    }

    raceLap() {
        return this.vibrate([60, 30, 60]);
    }

    // Memory game patterns
    memoryCardFlip() {
        return this.vibrate([25]);
    }

    memoryMatch() {
        return this.vibrate([50, 25, 75]);
    }

    memoryMismatch() {
        return this.vibrate([100, 50, 100]);
    }

    // Builder game patterns
    placePiece() {
        return this.vibrate([40]);
    }

    snapToGrid() {
        return this.vibrate([20, 10, 30]);
    }

    removepiece() {
        return this.vibrate([60, 30, 20]);
    }

    // Advanced features
    customPattern(durations, intensities = null) {
        if (!Array.isArray(durations)) return false;

        // If intensities provided, map them to duration (mobile vibration doesn't support intensity)
        // but we can simulate with duration variation
        if (intensities && Array.isArray(intensities)) {
            const mappedPattern = durations.map((duration, index) => {
                const intensity = intensities[index] || 1.0;
                return Math.round(duration * intensity);
            });
            return this.vibrate(mappedPattern);
        }

        return this.vibrate(durations);
    }

    // Settings and control
    enable() {
        this.isEnabled = true;
        console.log('📱 Haptic feedback enabled');
        return this.isEnabled;
    }

    disable() {
        this.isEnabled = false;
        navigator.vibrate(0); // Cancel any ongoing vibration
        console.log('📱 Haptic feedback disabled');
        return this.isEnabled;
    }

    toggle() {
        return this.isEnabled ? this.disable() : this.enable();
    }

    isAvailable() {
        return this.isSupported;
    }

    // Test all patterns (for debugging/setup)
    async testAllPatterns() {
        if (!this.isSupported) {
            console.log('📱 Haptic testing not supported on this device');
            return;
        }

        console.log('📱 Testing all haptic patterns...');

        for (const [name, pattern] of Object.entries(this.patterns)) {
            console.log(`Testing: ${name}`);
            this.vibrate(pattern);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('📱 Haptic pattern testing complete');
    }
}

// Initialize haptic system and make globally available
if (typeof window !== 'undefined') {
    window.aquariumHaptics = new AquariumHapticSystem();
    console.log('📱 Aquarium Haptic System ready!');
}

// Export for use in other modules
window.AquariumHapticSystem = AquariumHapticSystem;