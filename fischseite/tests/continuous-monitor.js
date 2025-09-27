/* 🔄 CONTINUOUS MONITORING SYSTEM
   Läuft Play/Ride Tests in regelmäßigen Abständen und trackt Verbesserungen
*/

const { PlayRideSelfTest } = require('./play-ride-selftest');
const fs = require('fs');
const path = require('path');

class ContinuousMonitor {
    constructor() {
        this.monitoringActive = false;
        this.testHistory = [];
        this.historyFile = path.join(__dirname, 'test-history.json');
        this.loadHistory();
    }

    loadHistory() {
        try {
            if (fs.existsSync(this.historyFile)) {
                const data = fs.readFileSync(this.historyFile, 'utf8');
                this.testHistory = JSON.parse(data);
                console.log(`📚 Loaded ${this.testHistory.length} historical test results`);
            }
        } catch (error) {
            console.warn('⚠️ Could not load test history:', error.message);
            this.testHistory = [];
        }
    }

    saveHistory() {
        try {
            fs.writeFileSync(this.historyFile, JSON.stringify(this.testHistory, null, 2));
        } catch (error) {
            console.error('❌ Could not save test history:', error.message);
        }
    }

    async runSingleTest() {
        console.log('🔍 Running Play/Ride self-test...');
        const selfTest = new PlayRideSelfTest();
        const result = await selfTest.runFullTest();

        this.testHistory.push(result);
        this.saveHistory();

        return result;
    }

    async startContinuousMonitoring(intervalMinutes = 30) {
        console.log(`🔄 Starting continuous monitoring (every ${intervalMinutes} minutes)`);
        this.monitoringActive = true;

        while (this.monitoringActive) {
            try {
                const result = await this.runSingleTest();
                this.analyzeProgress(result);

                console.log(`⏰ Next test in ${intervalMinutes} minutes...`);
                await this.sleep(intervalMinutes * 60 * 1000);

            } catch (error) {
                console.error('❌ Monitoring error:', error.message);
                await this.sleep(60000); // Wait 1 minute on error
            }
        }
    }

    stopMonitoring() {
        console.log('🛑 Stopping continuous monitoring');
        this.monitoringActive = false;
    }

    analyzeProgress(latestResult) {
        if (this.testHistory.length < 2) return;

        const previousResult = this.testHistory[this.testHistory.length - 2];
        const improvement = latestResult.scores.overall - previousResult.scores.overall;

        console.log('\n📈 PROGRESS ANALYSIS');
        console.log('====================');

        if (improvement > 5) {
            console.log('🚀 SIGNIFICANT IMPROVEMENT: +' + improvement.toFixed(1) + ' points');
        } else if (improvement > 1) {
            console.log('📈 Minor improvement: +' + improvement.toFixed(1) + ' points');
        } else if (improvement < -5) {
            console.log('📉 REGRESSION DETECTED: ' + improvement.toFixed(1) + ' points');
            console.log('🚨 Immediate attention required!');
        } else {
            console.log('📊 Stable performance: ' + improvement.toFixed(1) + ' points change');
        }

        this.generateTrendReport();
    }

    generateTrendReport() {
        if (this.testHistory.length < 3) return;

        const recent = this.testHistory.slice(-10); // Last 10 tests
        const scores = recent.map(r => r.scores.overall);

        const trend = this.calculateTrend(scores);
        console.log(`📊 Recent trend: ${trend > 0 ? '📈 Improving' : trend < 0 ? '📉 Declining' : '➡️ Stable'}`);
    }

    calculateTrend(scores) {
        if (scores.length < 2) return 0;

        let sum = 0;
        for (let i = 1; i < scores.length; i++) {
            sum += scores[i] - scores[i-1];
        }
        return sum / (scores.length - 1);
    }

    async generateDetailedReport() {
        console.log('\n📊 DETAILED HISTORICAL ANALYSIS');
        console.log('===============================');

        if (this.testHistory.length === 0) {
            console.log('No test data available');
            return;
        }

        const latest = this.testHistory[this.testHistory.length - 1];
        const first = this.testHistory[0];

        console.log(`📅 Analysis period: ${new Date(first.timestamp).toLocaleString()} - ${new Date(latest.timestamp).toLocaleString()}`);
        console.log(`🧪 Total tests run: ${this.testHistory.length}`);

        // Best and worst scores
        const allScores = this.testHistory.map(r => r.scores.overall);
        const best = Math.max(...allScores);
        const worst = Math.min(...allScores);

        console.log(`🏆 Best score: ${best.toFixed(1)}`);
        console.log(`🔻 Worst score: ${worst.toFixed(1)}`);
        console.log(`📈 Total improvement: ${(latest.scores.overall - first.scores.overall).toFixed(1)} points`);

        // Category analysis
        console.log('\n📊 Category Performance:');
        ['performance', 'loading', 'animation', 'system', 'responsiveness', 'interactivity', 'design', 'errorHandling'].forEach(category => {
            const categoryScores = this.testHistory.map(r => {
                return r.scores.play[category] !== undefined ? r.scores.play[category] : r.scores.ride[category];
            }).filter(s => s !== undefined);

            if (categoryScores.length > 0) {
                const avg = categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length;
                console.log(`  ${category}: ${avg.toFixed(1)}/100 average`);
            }
        });

        return {
            totalTests: this.testHistory.length,
            bestScore: best,
            worstScore: worst,
            currentScore: latest.scores.overall,
            improvement: latest.scores.overall - first.scores.overall
        };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// CLI Interface
if (require.main === module) {
    const monitor = new ContinuousMonitor();
    const command = process.argv[2];

    switch (command) {
        case 'start':
            const interval = parseInt(process.argv[3]) || 30;
            monitor.startContinuousMonitoring(interval);
            break;

        case 'single':
            monitor.runSingleTest();
            break;

        case 'report':
            monitor.generateDetailedReport();
            break;

        default:
            console.log('🔄 Continuous Monitor Usage:');
            console.log('  node continuous-monitor.js start [minutes] - Start monitoring');
            console.log('  node continuous-monitor.js single         - Run single test');
            console.log('  node continuous-monitor.js report         - Generate report');
    }
}

module.exports = { ContinuousMonitor };