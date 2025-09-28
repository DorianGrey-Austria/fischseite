/* 🎮 GAME BALANCER - ADAPTIVE DIFFICULTY & ACHIEVEMENT SYSTEM
 * Central hub for cross-game balance, progression, and player engagement
 * Enhances all existing games with intelligent balancing and comprehensive achievements
 *
 * Features:
 * ✅ Adaptive Difficulty Adjustment
 * ✅ Cross-Game Achievement System
 * ✅ Persistent Player Profiles
 * ✅ Performance Metrics & Analytics
 * ✅ XP System & Level Progression
 * ✅ Daily/Weekly Challenges
 */

(function() {
    'use strict';

    // Prevent multiple initializations
    if (window.GAME_BALANCER_INITIALIZED) {
        console.log('🎮 Game Balancer already initialized, skipping...');
        return;
    }

    console.log('🎮 Game Balancer System V1.0 loading...');

    // 🏆 ACHIEVEMENT DEFINITIONS
    const ACHIEVEMENTS = {
        // Collector Game Achievements
        collector_speedster: {
            id: 'collector_speedster',
            name: 'Speed Collector',
            description: 'Complete collector game in under 15 seconds',
            icon: '⚡',
            game: 'collector',
            type: 'time',
            target: 15,
            xp: 100,
            rarity: 'rare'
        },
        collector_perfectionist: {
            id: 'collector_perfectionist',
            name: 'Perfect Collection',
            description: 'Collect all items without missing any',
            icon: '💎',
            game: 'collector',
            type: 'accuracy',
            target: 100,
            xp: 150,
            rarity: 'epic'
        },
        collector_streak: {
            id: 'collector_streak',
            name: 'Collection Master',
            description: 'Win 5 collector games in a row',
            icon: '🔥',
            game: 'collector',
            type: 'streak',
            target: 5,
            xp: 200,
            rarity: 'legendary'
        },

        // Memory Game Achievements
        memory_photographic: {
            id: 'memory_photographic',
            name: 'Photographic Memory',
            description: 'Complete memory game without any wrong matches',
            icon: '🧠',
            game: 'memory',
            type: 'accuracy',
            target: 100,
            xp: 120,
            rarity: 'rare'
        },
        memory_combo_master: {
            id: 'memory_combo_master',
            name: 'Combo Master',
            description: 'Achieve 8+ consecutive matches',
            icon: '🎯',
            game: 'memory',
            type: 'combo',
            target: 8,
            xp: 180,
            rarity: 'epic'
        },
        memory_speed_demon: {
            id: 'memory_speed_demon',
            name: 'Memory Speed Demon',
            description: 'Complete hard difficulty in under 60 seconds',
            icon: '👹',
            game: 'memory',
            type: 'speed',
            target: 60,
            xp: 250,
            rarity: 'legendary'
        },

        // Racing Game Achievements
        racing_prophet: {
            id: 'racing_prophet',
            name: 'Race Prophet',
            description: 'Predict winner correctly 5 times in a row',
            icon: '🔮',
            game: 'racing',
            type: 'prediction',
            target: 5,
            xp: 150,
            rarity: 'rare'
        },
        racing_high_roller: {
            id: 'racing_high_roller',
            name: 'High Roller',
            description: 'Reach 500+ betting points',
            icon: '💰',
            game: 'racing',
            type: 'points',
            target: 500,
            xp: 200,
            rarity: 'epic'
        },
        racing_comeback: {
            id: 'racing_comeback',
            name: 'Comeback King',
            description: 'Win after being down to 25 points or less',
            icon: '👑',
            game: 'racing',
            type: 'comeback',
            target: 25,
            xp: 300,
            rarity: 'legendary'
        },

        // Builder Game Achievements
        builder_architect: {
            id: 'builder_architect',
            name: 'Aquarium Architect',
            description: 'Create perfect aquarium with 100% score',
            icon: '🏗️',
            game: 'builder',
            type: 'score',
            target: 100,
            xp: 180,
            rarity: 'epic'
        },
        builder_efficiency: {
            id: 'builder_efficiency',
            name: 'Efficient Builder',
            description: 'Build quality aquarium in under 2 minutes',
            icon: '⏱️',
            game: 'builder',
            type: 'efficiency',
            target: 120,
            xp: 140,
            rarity: 'rare'
        },
        builder_environmentalist: {
            id: 'builder_environmentalist',
            name: 'Eco Warrior',
            description: 'Create sustainable aquarium setup',
            icon: '🌱',
            game: 'builder',
            type: 'environmental',
            target: 90,
            xp: 160,
            rarity: 'rare'
        },

        // Smart Fish Achievements
        fish_whisperer: {
            id: 'fish_whisperer',
            name: 'Fish Whisperer',
            description: 'Spawn 50 fish in one session',
            icon: '🗣️',
            game: 'fish',
            type: 'interaction',
            target: 50,
            xp: 100,
            rarity: 'common'
        },
        fish_diversity: {
            id: 'fish_diversity',
            name: 'Marine Biologist',
            description: 'Spawn all 10 different fish types',
            icon: '🔬',
            game: 'fish',
            type: 'diversity',
            target: 10,
            xp: 200,
            rarity: 'epic'
        },

        // Cross-Game Meta Achievements
        multi_gamer: {
            id: 'multi_gamer',
            name: 'Multi-Gamer',
            description: 'Play all 5 games in one session',
            icon: '🎮',
            game: 'meta',
            type: 'variety',
            target: 5,
            xp: 250,
            rarity: 'epic'
        },
        dedication: {
            id: 'dedication',
            name: 'Aquarium Devotee',
            description: 'Play for 30 minutes straight',
            icon: '⏰',
            game: 'meta',
            type: 'playtime',
            target: 1800, // 30 minutes
            xp: 300,
            rarity: 'legendary'
        },
        perfectionist_meta: {
            id: 'perfectionist_meta',
            name: 'Master of the Deep',
            description: 'Unlock all game-specific achievements',
            icon: '🏆',
            game: 'meta',
            type: 'completion',
            target: 15,
            xp: 500,
            rarity: 'mythic'
        }
    };

    // 📊 DIFFICULTY ADJUSTMENT PARAMETERS
    const DIFFICULTY_CONFIG = {
        collector: {
            baseTime: 30,
            baseItems: 21,
            adaptiveRange: { min: 15, max: 45 },
            performanceWindow: 5 // Last 5 games
        },
        memory: {
            basePairs: 8,
            baseTime: 120,
            adaptiveRange: { pairs: [6, 12], time: [60, 180] },
            performanceWindow: 3
        },
        racing: {
            baseSpeed: 1.0,
            baseEvents: 5,
            adaptiveRange: { speed: [0.7, 1.5], events: [3, 8] },
            performanceWindow: 4
        },
        builder: {
            baseComplexity: 5,
            baseTime: 300,
            adaptiveRange: { complexity: [3, 8], time: [180, 420] },
            performanceWindow: 3
        },
        fish: {
            baseSpawnRate: 1.0,
            maxFish: 10,
            adaptiveRange: { spawnRate: [0.5, 2.0], maxFish: [8, 15] },
            performanceWindow: 1
        }
    };

    // 🎯 XP LEVEL SYSTEM
    const XP_LEVELS = [
        { level: 1, xp: 0, title: 'Aquarium Rookie', badge: '🥽' },
        { level: 2, xp: 100, title: 'Fish Friend', badge: '🐠' },
        { level: 3, xp: 250, title: 'Water Warrior', badge: '⚔️' },
        { level: 4, xp: 450, title: 'Reef Ranger', badge: '🛡️' },
        { level: 5, xp: 700, title: 'Ocean Oracle', badge: '🔮' },
        { level: 6, xp: 1000, title: 'Sea Sage', badge: '🧙' },
        { level: 7, xp: 1350, title: 'Aquatic Ace', badge: '🎯' },
        { level: 8, xp: 1750, title: 'Marine Master', badge: '👑' },
        { level: 9, xp: 2200, title: 'Deep Legend', badge: '⭐' },
        { level: 10, xp: 2700, title: 'Poseidon', badge: '🔱' }
    ];

    // 📅 DAILY/WEEKLY CHALLENGES
    const CHALLENGES = {
        daily: [
            { id: 'daily_collector', name: 'Daily Collector', description: 'Complete 3 collector games', target: 3, xp: 50, icon: '📅' },
            { id: 'daily_memory', name: 'Memory Marathon', description: 'Complete 2 memory games', target: 2, xp: 60, icon: '🧠' },
            { id: 'daily_interaction', name: 'Fish Interaction', description: 'Spawn 25 fish', target: 25, xp: 40, icon: '🐟' }
        ],
        weekly: [
            { id: 'weekly_mastery', name: 'Game Mastery', description: 'Win at least one game in each category', target: 5, xp: 200, icon: '🏆' },
            { id: 'weekly_streak', name: 'Winning Streak', description: 'Win 10 games in a row', target: 10, xp: 300, icon: '🔥' },
            { id: 'weekly_perfectionist', name: 'Perfect Week', description: 'Achieve 5 perfect scores', target: 5, xp: 250, icon: '💎' }
        ]
    };

    // 🎮 GAME BALANCER CLASS
    class GameBalancer {
        constructor() {
            this.playerProfile = this.loadPlayerProfile();
            this.gameStats = this.loadGameStats();
            this.achievements = this.loadAchievements();
            this.challenges = this.loadChallenges();
            this.sessionStart = Date.now();
            this.gamesPlayedThisSession = new Set();

            this.initializeUI();
            this.startSessionTracking();

            console.log('🎮 Game Balancer initialized with profile:', this.playerProfile);
        }

        // 💾 PLAYER PROFILE MANAGEMENT
        loadPlayerProfile() {
            const saved = localStorage.getItem('aquarium_player_profile');
            return saved ? JSON.parse(saved) : {
                id: this.generatePlayerId(),
                name: 'Aquarium Explorer',
                level: 1,
                xp: 0,
                totalPlayTime: 0,
                gamesPlayed: 0,
                favoriteFish: '🐠',
                joinDate: Date.now(),
                lastActive: Date.now(),
                preferences: {
                    difficulty: 'auto',
                    sound: true,
                    haptics: true,
                    achievements: true
                }
            };
        }

        savePlayerProfile() {
            this.playerProfile.lastActive = Date.now();
            localStorage.setItem('aquarium_player_profile', JSON.stringify(this.playerProfile));
        }

        generatePlayerId() {
            return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        // 📊 GAME STATISTICS MANAGEMENT
        loadGameStats() {
            const saved = localStorage.getItem('aquarium_game_stats');
            return saved ? JSON.parse(saved) : {
                collector: { plays: 0, wins: 0, bestTime: null, averageScore: 0, streak: 0 },
                memory: { plays: 0, wins: 0, bestTime: null, maxCombo: 0, streak: 0 },
                racing: { plays: 0, wins: 0, bestPredictions: 0, maxPoints: 0, streak: 0 },
                builder: { plays: 0, builds: 0, bestScore: 0, averageTime: 0, streak: 0 },
                fish: { interactions: 0, fishSpawned: 0, speciesDiscovered: 0, sessionMax: 0 }
            };
        }

        saveGameStats() {
            localStorage.setItem('aquarium_game_stats', JSON.stringify(this.gameStats));
        }

        // 🏆 ACHIEVEMENT SYSTEM
        loadAchievements() {
            const saved = localStorage.getItem('aquarium_achievements');
            return saved ? new Map(JSON.parse(saved)) : new Map();
        }

        saveAchievements() {
            localStorage.setItem('aquarium_achievements', JSON.stringify(Array.from(this.achievements.entries())));
        }

        checkAchievement(achievementId, value) {
            if (this.achievements.has(achievementId)) return false;

            const achievement = ACHIEVEMENTS[achievementId];
            if (!achievement) {
                console.warn(`Achievement ${achievementId} not found`);
                return false;
            }

            let unlocked = false;
            switch (achievement.type) {
                case 'time':
                    unlocked = value <= achievement.target;
                    break;
                case 'accuracy':
                case 'score':
                    unlocked = value >= achievement.target;
                    break;
                case 'streak':
                case 'combo':
                case 'prediction':
                case 'points':
                case 'interaction':
                case 'diversity':
                case 'variety':
                case 'completion':
                    unlocked = value >= achievement.target;
                    break;
                case 'comeback':
                    unlocked = value <= achievement.target;
                    break;
                case 'playtime':
                    unlocked = (Date.now() - this.sessionStart) >= achievement.target * 1000;
                    break;
                case 'efficiency':
                case 'speed':
                    unlocked = value <= achievement.target;
                    break;
                case 'environmental':
                    unlocked = value >= achievement.target;
                    break;
                default:
                    console.warn(`Unknown achievement type: ${achievement.type}`);
                    return false;
            }

            if (unlocked) {
                this.unlockAchievement(achievementId);
                return true;
            }
            return false;
        }

        unlockAchievement(achievementId) {
            const achievement = ACHIEVEMENTS[achievementId];
            this.achievements.set(achievementId, {
                unlockedAt: Date.now(),
                notificationShown: false
            });

            // Award XP
            this.addXP(achievement.xp);

            // Show notification
            this.showAchievementNotification(achievement);

            // Check meta achievements
            this.checkMetaAchievements();

            this.saveAchievements();
            console.log(`🏆 Achievement unlocked: ${achievement.name}`);
        }

        checkMetaAchievements() {
            // Check if all game-specific achievements are unlocked
            const gameAchievements = Object.keys(ACHIEVEMENTS).filter(id => ACHIEVEMENTS[id].game !== 'meta');
            const unlockedGameAchievements = gameAchievements.filter(id => this.achievements.has(id));

            if (unlockedGameAchievements.length >= 15) {
                this.checkAchievement('perfectionist_meta', unlockedGameAchievements.length);
            }

            // Check multi-gamer achievement
            if (this.gamesPlayedThisSession.size >= 5) {
                this.checkAchievement('multi_gamer', this.gamesPlayedThisSession.size);
            }

            // Check dedication achievement (playtime)
            this.checkAchievement('dedication', 0);
        }

        // 📈 XP AND LEVELING SYSTEM
        addXP(amount) {
            this.playerProfile.xp += amount;
            this.checkLevelUp();
            this.savePlayerProfile();
        }

        checkLevelUp() {
            const currentLevel = this.playerProfile.level;
            const newLevel = this.calculateLevel(this.playerProfile.xp);

            if (newLevel > currentLevel) {
                this.playerProfile.level = newLevel;
                this.showLevelUpNotification(newLevel);
                console.log(`🎉 Level up! Now level ${newLevel}`);
            }
        }

        calculateLevel(xp) {
            for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
                if (xp >= XP_LEVELS[i].xp) {
                    return XP_LEVELS[i].level;
                }
            }
            return 1;
        }

        // 🎯 ADAPTIVE DIFFICULTY SYSTEM
        getAdaptiveDifficulty(gameName) {
            const stats = this.gameStats[gameName];
            const config = DIFFICULTY_CONFIG[gameName];

            if (!stats || stats.plays < 3) {
                // Not enough data, return base difficulty with multiplier
                return {
                    difficulty: 'normal',
                    adjustments: this.getDefaultAdjustments(gameName),
                    multiplier: 1.0
                };
            }

            const winRate = stats.wins / stats.plays;
            const recentPerformance = this.getRecentPerformance(gameName);

            let difficultyMultiplier = 1.0;

            // Adjust based on win rate
            if (winRate > 0.8) {
                difficultyMultiplier += 0.3; // Make it harder
            } else if (winRate < 0.3) {
                difficultyMultiplier -= 0.2; // Make it easier
            }

            // Adjust based on recent performance
            if (recentPerformance > 0.7) {
                difficultyMultiplier += 0.2;
            } else if (recentPerformance < 0.4) {
                difficultyMultiplier -= 0.1;
            }

            // Apply game-specific adjustments
            return this.calculateGameAdjustments(gameName, difficultyMultiplier);
        }

        getRecentPerformance(gameName) {
            // This would track recent game results if we had detailed history
            // For now, use current streak as indicator
            const streak = this.gameStats[gameName].streak;
            return Math.min(streak / 5, 1.0); // Normalize to 0-1
        }

        getDefaultAdjustments(gameName) {
            const config = DIFFICULTY_CONFIG[gameName];
            const adjustments = {};

            switch (gameName) {
                case 'collector':
                    adjustments.timeLimit = config.baseTime;
                    adjustments.itemCount = config.baseItems;
                    break;
                case 'memory':
                    adjustments.pairCount = config.basePairs;
                    adjustments.timeLimit = config.baseTime;
                    break;
                case 'racing':
                    adjustments.raceSpeed = config.baseSpeed;
                    adjustments.eventCount = config.baseEvents;
                    break;
                case 'builder':
                    adjustments.complexity = config.baseComplexity;
                    adjustments.timeLimit = config.baseTime;
                    break;
                case 'fish':
                    adjustments.spawnRate = config.baseSpawnRate;
                    adjustments.maxFish = config.maxFish;
                    break;
            }

            return adjustments;
        }

        calculateGameAdjustments(gameName, multiplier) {
            const config = DIFFICULTY_CONFIG[gameName];
            const adjustments = {};

            switch (gameName) {
                case 'collector':
                    adjustments.timeLimit = Math.max(
                        config.adaptiveRange.min,
                        Math.min(config.adaptiveRange.max, config.baseTime / multiplier)
                    );
                    adjustments.itemCount = Math.round(config.baseItems * multiplier);
                    break;

                case 'memory':
                    adjustments.pairCount = Math.max(
                        config.adaptiveRange.pairs[0],
                        Math.min(config.adaptiveRange.pairs[1], Math.round(config.basePairs * multiplier))
                    );
                    adjustments.timeLimit = Math.max(
                        config.adaptiveRange.time[0],
                        Math.min(config.adaptiveRange.time[1], config.baseTime / multiplier)
                    );
                    break;

                case 'racing':
                    adjustments.raceSpeed = Math.max(
                        config.adaptiveRange.speed[0],
                        Math.min(config.adaptiveRange.speed[1], config.baseSpeed * multiplier)
                    );
                    adjustments.eventCount = Math.max(
                        config.adaptiveRange.events[0],
                        Math.min(config.adaptiveRange.events[1], Math.round(config.baseEvents * multiplier))
                    );
                    break;

                case 'builder':
                    adjustments.complexity = Math.max(
                        config.adaptiveRange.complexity[0],
                        Math.min(config.adaptiveRange.complexity[1], Math.round(config.baseComplexity * multiplier))
                    );
                    adjustments.timeLimit = Math.max(
                        config.adaptiveRange.time[0],
                        Math.min(config.adaptiveRange.time[1], config.baseTime / multiplier)
                    );
                    break;

                case 'fish':
                    adjustments.spawnRate = Math.max(
                        config.adaptiveRange.spawnRate[0],
                        Math.min(config.adaptiveRange.spawnRate[1], config.baseSpawnRate * multiplier)
                    );
                    adjustments.maxFish = Math.max(
                        config.adaptiveRange.maxFish[0],
                        Math.min(config.adaptiveRange.maxFish[1], Math.round(config.maxFish * multiplier))
                    );
                    break;
            }

            return {
                difficulty: multiplier > 1.2 ? 'hard' : (multiplier < 0.8 ? 'easy' : 'normal'),
                adjustments,
                multiplier
            };
        }

        // 🎮 GAME EVENT TRACKING
        recordGameStart(gameName) {
            this.gamesPlayedThisSession.add(gameName);
            this.gameStats[gameName].plays++;
            this.playerProfile.gamesPlayed++;

            console.log(`🎮 Game started: ${gameName}`);
        }

        recordGameEnd(gameName, result) {
            if (result.won) {
                this.gameStats[gameName].wins++;
                this.gameStats[gameName].streak++;

                // Reset other game streaks (optional - for cross-game balance)
                // Object.keys(this.gameStats).forEach(game => {
                //     if (game !== gameName) this.gameStats[game].streak = 0;
                // });
            } else {
                this.gameStats[gameName].streak = 0;
            }

            // Record specific metrics
            this.updateGameSpecificStats(gameName, result);

            // Check achievements
            this.checkGameAchievements(gameName, result);

            // Award base XP
            const baseXP = result.won ? 20 : 10;
            const bonusXP = this.calculateBonusXP(gameName, result);
            this.addXP(baseXP + bonusXP);

            this.saveGameStats();
            this.savePlayerProfile();
        }

        updateGameSpecificStats(gameName, result) {
            const stats = this.gameStats[gameName];

            switch (gameName) {
                case 'collector':
                    if (!stats.bestTime || result.time < stats.bestTime) {
                        stats.bestTime = result.time;
                    }
                    stats.averageScore = ((stats.averageScore * (stats.plays - 1)) + result.score) / stats.plays;
                    break;

                case 'memory':
                    if (!stats.bestTime || result.time < stats.bestTime) {
                        stats.bestTime = result.time;
                    }
                    if (result.maxCombo > stats.maxCombo) {
                        stats.maxCombo = result.maxCombo;
                    }
                    break;

                case 'racing':
                    if (result.correctPredictions > stats.bestPredictions) {
                        stats.bestPredictions = result.correctPredictions;
                    }
                    if (result.finalPoints > stats.maxPoints) {
                        stats.maxPoints = result.finalPoints;
                    }
                    break;

                case 'builder':
                    stats.builds++;
                    if (result.score > stats.bestScore) {
                        stats.bestScore = result.score;
                    }
                    stats.averageTime = ((stats.averageTime * (stats.builds - 1)) + result.buildTime) / stats.builds;
                    break;

                case 'fish':
                    stats.interactions++;
                    stats.fishSpawned += result.fishSpawned || 0;
                    if ((result.fishSpawned || 0) > stats.sessionMax) {
                        stats.sessionMax = result.fishSpawned || 0;
                    }
                    if (result.newSpecies) {
                        stats.speciesDiscovered++;
                    }
                    break;
            }
        }

        calculateBonusXP(gameName, result) {
            let bonus = 0;

            // Performance bonuses
            if (result.won) {
                bonus += 10; // Win bonus
            }

            if (result.perfect) {
                bonus += 20; // Perfect performance
            }

            if (result.time && result.time < 20) {
                bonus += 15; // Speed bonus
            }

            // Streak bonuses
            const streak = this.gameStats[gameName].streak;
            if (streak >= 3) bonus += streak * 5;

            return Math.min(bonus, 50); // Cap bonus XP
        }

        checkGameAchievements(gameName, result) {
            switch (gameName) {
                case 'collector':
                    if (result.time && result.time <= 15) {
                        this.checkAchievement('collector_speedster', result.time);
                    }
                    if (result.accuracy >= 100) {
                        this.checkAchievement('collector_perfectionist', result.accuracy);
                    }
                    if (this.gameStats.collector.streak >= 5) {
                        this.checkAchievement('collector_streak', this.gameStats.collector.streak);
                    }
                    break;

                case 'memory':
                    if (result.accuracy >= 100) {
                        this.checkAchievement('memory_photographic', result.accuracy);
                    }
                    if (result.maxCombo >= 8) {
                        this.checkAchievement('memory_combo_master', result.maxCombo);
                    }
                    if (result.time && result.time <= 60 && result.difficulty === 'hard') {
                        this.checkAchievement('memory_speed_demon', result.time);
                    }
                    break;

                case 'racing':
                    if (this.gameStats.racing.bestPredictions >= 5) {
                        this.checkAchievement('racing_prophet', this.gameStats.racing.bestPredictions);
                    }
                    if (result.finalPoints >= 500) {
                        this.checkAchievement('racing_high_roller', result.finalPoints);
                    }
                    if (result.comebackFromPoints && result.comebackFromPoints <= 25) {
                        this.checkAchievement('racing_comeback', result.comebackFromPoints);
                    }
                    break;

                case 'builder':
                    if (result.score >= 100) {
                        this.checkAchievement('builder_architect', result.score);
                    }
                    if (result.buildTime <= 120) {
                        this.checkAchievement('builder_efficiency', result.buildTime);
                    }
                    if (result.environmentalScore >= 90) {
                        this.checkAchievement('builder_environmentalist', result.environmentalScore);
                    }
                    break;

                case 'fish':
                    if (this.gameStats.fish.fishSpawned >= 50) {
                        this.checkAchievement('fish_whisperer', this.gameStats.fish.fishSpawned);
                    }
                    if (this.gameStats.fish.speciesDiscovered >= 10) {
                        this.checkAchievement('fish_diversity', this.gameStats.fish.speciesDiscovered);
                    }
                    break;
            }
        }

        // 📅 CHALLENGE SYSTEM
        loadChallenges() {
            const saved = localStorage.getItem('aquarium_challenges');
            const defaultChallenges = {
                daily: { lastReset: 0, progress: {}, completed: [] },
                weekly: { lastReset: 0, progress: {}, completed: [] }
            };
            return saved ? JSON.parse(saved) : defaultChallenges;
        }

        saveChallenges() {
            localStorage.setItem('aquarium_challenges', JSON.stringify(this.challenges));
        }

        updateChallengeProgress(type, challengeId, progress) {
            if (!this.challenges[type]) return;

            this.challenges[type].progress[challengeId] = (this.challenges[type].progress[challengeId] || 0) + progress;

            // Check completion
            const challenge = CHALLENGES[type].find(c => c.id === challengeId);
            if (challenge && this.challenges[type].progress[challengeId] >= challenge.target) {
                if (!this.challenges[type].completed.includes(challengeId)) {
                    this.challenges[type].completed.push(challengeId);
                    this.addXP(challenge.xp);
                    this.showChallengeCompleteNotification(challenge);
                }
            }

            this.saveChallenges();
        }

        resetChallenges() {
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;
            const oneWeek = 7 * oneDay;

            // Reset daily challenges
            if (now - this.challenges.daily.lastReset > oneDay) {
                this.challenges.daily.progress = {};
                this.challenges.daily.completed = [];
                this.challenges.daily.lastReset = now;
            }

            // Reset weekly challenges
            if (now - this.challenges.weekly.lastReset > oneWeek) {
                this.challenges.weekly.progress = {};
                this.challenges.weekly.completed = [];
                this.challenges.weekly.lastReset = now;
            }

            this.saveChallenges();
        }

        // 🎨 UI SYSTEM
        initializeUI() {
            this.createBalancerUI();
        }

        createBalancerUI() {
            // Create floating balancer panel
            const panel = document.createElement('div');
            panel.id = 'game-balancer-panel';
            panel.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                width: 280px;
                background: rgba(0, 105, 148, 0.95);
                backdrop-filter: blur(10px);
                border: 2px solid var(--secondary-teal, #4ECDC4);
                border-radius: 15px;
                padding: 15px;
                color: white;
                font-family: 'Arial', sans-serif;
                font-size: 14px;
                z-index: 10000;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                transform: translateX(100%);
                transition: transform 0.3s ease;
                display: none;
            `;

            const levelData = XP_LEVELS.find(l => l.level === this.playerProfile.level) || XP_LEVELS[0];
            const nextLevel = XP_LEVELS.find(l => l.level === this.playerProfile.level + 1);
            const progressPercent = nextLevel ?
                ((this.playerProfile.xp - levelData.xp) / (nextLevel.xp - levelData.xp)) * 100 : 100;

            panel.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="font-weight: bold; font-size: 16px;">🎮 Game Balance</div>
                    <button id="balancer-toggle" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">📊</button>
                </div>

                <div id="player-info" style="margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <span style="font-size: 20px; margin-right: 8px;">${levelData.badge}</span>
                        <div>
                            <div style="font-weight: bold;">${this.playerProfile.name}</div>
                            <div style="font-size: 12px; opacity: 0.8;">${levelData.title}</div>
                        </div>
                    </div>

                    <div style="margin-bottom: 5px;">
                        <div style="display: flex; justify-content: space-between; font-size: 12px;">
                            <span>Level ${this.playerProfile.level}</span>
                            <span>${this.playerProfile.xp} XP</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.2); height: 6px; border-radius: 3px; overflow: hidden;">
                            <div style="background: var(--secondary-teal, #4ECDC4); height: 100%; width: ${progressPercent}%; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                </div>

                <div id="quick-stats" style="margin-bottom: 15px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                        <div style="text-align: center; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 5px;">
                            <div style="font-weight: bold;">${this.playerProfile.gamesPlayed}</div>
                            <div style="opacity: 0.8;">Games</div>
                        </div>
                        <div style="text-align: center; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 5px;">
                            <div style="font-weight: bold;">${this.achievements.size}</div>
                            <div style="opacity: 0.8;">Achievements</div>
                        </div>
                    </div>
                </div>

                <div id="recent-achievements" style="margin-bottom: 10px;">
                    <div style="font-size: 12px; font-weight: bold; margin-bottom: 5px;">Recent Achievements:</div>
                    <div id="achievement-list" style="max-height: 80px; overflow-y: auto; font-size: 11px;">
                        ${this.getRecentAchievementsHTML()}
                    </div>
                </div>

                <div style="display: flex; gap: 5px;">
                    <button id="show-full-stats" style="flex: 1; padding: 5px; background: var(--secondary-teal, #4ECDC4); border: none; border-radius: 5px; color: white; font-size: 11px; cursor: pointer;">Full Stats</button>
                    <button id="reset-progress" style="flex: 1; padding: 5px; background: rgba(255,107,107,0.8); border: none; border-radius: 5px; color: white; font-size: 11px; cursor: pointer;">Reset</button>
                </div>
            `;

            document.body.appendChild(panel);

            // Add event listeners
            document.getElementById('balancer-toggle').addEventListener('click', () => {
                const isVisible = panel.style.transform === 'translateX(0px)';
                panel.style.transform = isVisible ? 'translateX(100%)' : 'translateX(0px)';
            });

            document.getElementById('show-full-stats').addEventListener('click', () => {
                this.showFullStatsModal();
            });

            document.getElementById('reset-progress').addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
                    this.resetAllProgress();
                }
            });

            // ⚠️ CRITICAL: Panel stays hidden by default (User requirement!)
            // Only show when games are actively being played
            // Will be controlled by showGameBalancer() / hideGameBalancer() functions
        }

        getRecentAchievementsHTML() {
            const recent = Array.from(this.achievements.entries())
                .sort((a, b) => b[1].unlockedAt - a[1].unlockedAt)
                .slice(0, 3)
                .map(([id, data]) => {
                    const achievement = ACHIEVEMENTS[id];
                    return `<div style="display: flex; align-items: center; margin-bottom: 3px;">
                        <span style="margin-right: 5px;">${achievement.icon}</span>
                        <span style="font-size: 10px;">${achievement.name}</span>
                    </div>`;
                }).join('');

            return recent || '<div style="opacity: 0.6; font-style: italic;">No achievements yet</div>';
        }

        // 🔔 NOTIFICATION SYSTEM
        showAchievementNotification(achievement) {
            this.showNotification(`🏆 Achievement Unlocked!`, `${achievement.icon} ${achievement.name}`, `+${achievement.xp} XP`, 'achievement');
        }

        showLevelUpNotification(newLevel) {
            const levelData = XP_LEVELS.find(l => l.level === newLevel);
            this.showNotification(`🎉 Level Up!`, `${levelData.badge} You are now ${levelData.title}!`, `Level ${newLevel}`, 'levelup');
        }

        showChallengeCompleteNotification(challenge) {
            this.showNotification(`📅 Challenge Complete!`, `${challenge.icon} ${challenge.name}`, `+${challenge.xp} XP`, 'challenge');
        }

        showNotification(title, message, extra, type) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                width: 300px;
                background: ${type === 'achievement' ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                            type === 'levelup' ? 'linear-gradient(135deg, #4ECDC4, #00CED1)' :
                            'linear-gradient(135deg, #FF6B6B, #FF8E53)'};
                border: 2px solid white;
                border-radius: 15px;
                padding: 15px;
                color: white;
                font-family: 'Arial', sans-serif;
                z-index: 10001;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                transform: translateX(100%);
                transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            `;

            notification.innerHTML = `
                <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">${title}</div>
                <div style="font-size: 14px; margin-bottom: 5px;">${message}</div>
                <div style="font-size: 12px; opacity: 0.9;">${extra}</div>
            `;

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // Animate out and remove
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            }, 4000);
        }

        // 📊 ANALYTICS AND REPORTING
        startSessionTracking() {
            setInterval(() => {
                this.playerProfile.totalPlayTime += 1; // 1 second
                this.savePlayerProfile();
            }, 1000);

            // Reset challenges on new day/week
            this.resetChallenges();
        }

        getPerformanceReport() {
            const report = {
                player: this.playerProfile,
                stats: this.gameStats,
                achievements: {
                    total: this.achievements.size,
                    byRarity: this.getAchievementsByRarity(),
                    completion: (this.achievements.size / Object.keys(ACHIEVEMENTS).length) * 100
                },
                challenges: this.challenges,
                recommendations: this.getRecommendations()
            };

            return report;
        }

        getAchievementsByRarity() {
            const rarities = { common: 0, rare: 0, epic: 0, legendary: 0, mythic: 0 };

            Array.from(this.achievements.keys()).forEach(id => {
                const achievement = ACHIEVEMENTS[id];
                if (achievement && rarities[achievement.rarity] !== undefined) {
                    rarities[achievement.rarity]++;
                }
            });

            return rarities;
        }

        getRecommendations() {
            const recommendations = [];

            // Game-specific recommendations based on performance
            Object.keys(this.gameStats).forEach(game => {
                const stats = this.gameStats[game];
                const winRate = stats.plays > 0 ? stats.wins / stats.plays : 0;

                if (stats.plays === 0) {
                    recommendations.push(`Try the ${game} game - you haven't played it yet!`);
                } else if (winRate < 0.3) {
                    recommendations.push(`Practice the ${game} game to improve your skills`);
                } else if (winRate > 0.8 && stats.plays > 5) {
                    recommendations.push(`${game} difficulty might be too easy - try harder challenges!`);
                }
            });

            // Achievement recommendations
            const missingAchievements = Object.keys(ACHIEVEMENTS).filter(id => !this.achievements.has(id));
            if (missingAchievements.length > 0) {
                const easiest = missingAchievements.find(id => ACHIEVEMENTS[id].rarity === 'common');
                if (easiest) {
                    recommendations.push(`Try for the "${ACHIEVEMENTS[easiest].name}" achievement`);
                }
            }

            return recommendations.slice(0, 3); // Limit to 3 recommendations
        }

        // 🔄 UTILITY METHODS
        resetAllProgress() {
            localStorage.removeItem('aquarium_player_profile');
            localStorage.removeItem('aquarium_game_stats');
            localStorage.removeItem('aquarium_achievements');
            localStorage.removeItem('aquarium_challenges');

            location.reload(); // Reload to reinitialize
        }

        showFullStatsModal() {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10002;
            `;

            const content = document.createElement('div');
            content.style.cssText = `
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                color: #333;
            `;

            const report = this.getPerformanceReport();
            content.innerHTML = `
                <h2>🎮 Complete Performance Report</h2>
                <div style="margin-bottom: 20px;">
                    <h3>Player Profile</h3>
                    <p><strong>Level:</strong> ${report.player.level} (${report.player.xp} XP)</p>
                    <p><strong>Games Played:</strong> ${report.player.gamesPlayed}</p>
                    <p><strong>Total Play Time:</strong> ${Math.round(report.player.totalPlayTime / 60)} minutes</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3>Game Statistics</h3>
                    ${Object.keys(report.stats).map(game => {
                        const stats = report.stats[game];
                        const winRate = stats.plays > 0 ? ((stats.wins / stats.plays) * 100).toFixed(1) : 0;
                        return `
                            <div style="margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 5px;">
                                <strong>${game.charAt(0).toUpperCase() + game.slice(1)}:</strong><br>
                                Played: ${stats.plays} | Won: ${stats.wins} | Win Rate: ${winRate}% | Streak: ${stats.streak}
                            </div>
                        `;
                    }).join('')}
                </div>

                <div style="margin-bottom: 20px;">
                    <h3>Achievements (${report.achievements.total}/${Object.keys(ACHIEVEMENTS).length})</h3>
                    <p><strong>Completion:</strong> ${report.achievements.completion.toFixed(1)}%</p>
                    <p><strong>By Rarity:</strong>
                        Common: ${report.achievements.byRarity.common},
                        Rare: ${report.achievements.byRarity.rare},
                        Epic: ${report.achievements.byRarity.epic},
                        Legendary: ${report.achievements.byRarity.legendary},
                        Mythic: ${report.achievements.byRarity.mythic}
                    </p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3>Recommendations</h3>
                    ${report.recommendations.map(rec => `<p>• ${rec}</p>`).join('')}
                </div>

                <button onclick="this.parentElement.parentElement.remove()"
                        style="background: #006994; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    Close
                </button>
            `;

            modal.appendChild(content);
            document.body.appendChild(modal);

            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }
    }

    // 🚀 INITIALIZE GAME BALANCER
    window.gameBalancer = new GameBalancer();
    window.GAME_BALANCER_INITIALIZED = true;

    // 🔗 INTEGRATION HELPERS FOR EXISTING GAMES
    window.gameBalancerAPI = {
        // Called when any game starts
        gameStart: (gameName) => {
            window.gameBalancer.recordGameStart(gameName);
            return window.gameBalancer.getAdaptiveDifficulty(gameName);
        },

        // Called when any game ends
        gameEnd: (gameName, result) => {
            window.gameBalancer.recordGameEnd(gameName, result);
        },

        // Get current player level and XP
        getPlayerInfo: () => {
            return {
                level: window.gameBalancer.playerProfile.level,
                xp: window.gameBalancer.playerProfile.xp,
                achievements: window.gameBalancer.achievements.size
            };
        },

        // Manual achievement unlock (for custom events)
        unlockAchievement: (achievementId) => {
            return window.gameBalancer.checkAchievement(achievementId, 1);
        },

        // Update challenge progress
        updateChallenge: (type, challengeId, progress = 1) => {
            window.gameBalancer.updateChallengeProgress(type, challengeId, progress);
        },

        // 🎮 CRITICAL: Visibility Control Functions (User Requirement!)
        showGameBalancer: () => {
            const panel = document.getElementById('game-balancer-panel');
            if (panel) {
                panel.style.display = 'block';
                panel.style.transform = 'translateX(0px)';
                console.log('🎮 Game Balancer shown - game is active');
            }
        },

        hideGameBalancer: () => {
            const panel = document.getElementById('game-balancer-panel');
            if (panel) {
                panel.style.transform = 'translateX(100%)';
                // Hide completely after transition
                setTimeout(() => {
                    if (panel.style.transform === 'translateX(100%)') {
                        panel.style.display = 'none';
                    }
                }, 300);
                console.log('🎮 Game Balancer hidden - no active game');
            }
        }
    };

    console.log('🎮 Game Balancer System V1.0 loaded successfully!');
    console.log('🔗 Integration API available at window.gameBalancerAPI');

})();