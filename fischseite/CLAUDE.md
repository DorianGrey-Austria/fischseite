# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fischseite** is an interactive aquarium website for "Aquaristikfreunde Steiermark" - an Austrian aquarium club. Single-page application with modular JavaScript architecture featuring **5 games**, advanced animations, and Supabase integration.

**Current Status:** Version 5.1+ with expanded game portfolio deployed to **vibecoding.company/fischseite**

## Architecture

### Core Structure
- **`index.html`** - Main page with embedded CSS + core JavaScript (4000+ lines)
- **Modular JS** - 20+ external files for games/features, loaded via script tags
- **No build process** - Direct HTML/JS deployment to Hostinger FTP
- **Dependencies** - Font Awesome (CDN) + Supabase (optional) + Playwright (testing)

### Game Engine Architecture
- **`optimized-game-engine.js`** - Shared game utilities and performance optimization
- **`animation-coordinator.js`** - Centralized 60fps animation management
- **`game-balancer.js`** - AI-driven difficulty and performance balancing
- **`aaa-visual-effects-engine.js`** - Advanced particle effects and visual enhancements

### Fish System Architecture
- **`smart-fish-system.js`** - Unified fish spawning (click-to-spawn, max 50 fish)
- **`stable-fish-spawner.js`** - Alternative spawning implementation
- **Direction Management** - CSS `scaleX(-1)` transforms for proper fish orientation

### Game Modules (5 Complete Games)
- **`aquarium-collector-game.js`** - Food collection with physics, scoring, highscores
- **`aquarium-builder-game.js`** - Drag-and-drop aquarium construction system
- **`fish-memory-game.js`** - Memory matching game with fish pairs
- **`fish-racing-game.js`** - Racing simulation with multiple fish
- **`fish-care-simulation.js`** - Virtual pet care and feeding system

### Core System Modules
- **`video-preloader.js`** - Smart video loading with Intersection Observer
- **`highscore-display.js`** - Supabase highscore system with rate limiting
- **`performance-optimizer.js`** - RequestAnimationFrame monitoring
- **`progressive-enhancement.js`** - Feature detection and fallbacks
- **`sound-system.js`** - Audio management for games
- **`haptic-system.js`** - Touch feedback for mobile devices
- **`error-handler.js`** - Centralized error management
- **`loading-manager.js`** - Resource loading coordination

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Local development server (CRITICAL: Use port 8003 for fischseite)
npm run serve          # Python HTTP server on port 8002 (legacy)
npm run serve:dev      # Background server with logging
npm run serve:node     # Node.js alternative on port 8002
python3 -m http.server 8003 &  # RECOMMENDED for fischseite (matches global config)

# MANDATORY testing workflow (NEVER skip selftest!)
npm run test:selftest  # Comprehensive self-analysis (MANDATORY before browser)
npm run test:smoke     # Quick validation tests
npm run test:comprehensive # Full feature validation
npm run test:debug     # Debug game startup issues

# Game-specific testing
npm run test:fish      # Test fish spawning system
npm run test:enhanced  # Enhanced game features testing
node tests/test-game-collector.js    # Individual game tests
node tests/test-game-memory.js       # Memory game validation
node tests/test-game-racing.js       # Racing game validation
node tests/test-game-builder.js      # Builder game validation
node tests/test-fish-care-simulation.js # Care simulation testing

# Pre/post deployment validation
npm run test:pre-deploy   # Validate before deployment
npm run test:post-deploy  # Verify after deployment
npm run test:ci          # Continuous integration tests
npm run test:production  # Test live site

# Advanced testing and debugging
npm run test:all         # Complete feature testing
node tests/test-all-games-comprehensive.js # All games testing
node tests/test-gameplay-detailed.js       # Detailed gameplay validation
node tests/debug-game-startup.js           # Game startup debugging
node tests/test-progressive-enhancement.js # Progressive enhancement tests

# Development utilities
npm run debug:server     # Check server status and basic connectivity
node tests/continuous-monitor.js single    # Single monitoring run
```

### Development Workflow (CRITICAL - Follow Exactly)
```bash
# 1. FORCE COMPLETE CLEANUP (prevents cache issues)
osascript -e 'tell application "Google Chrome" to quit'
lsof -ti:8003 | xargs kill -9
rm -f server.log

# 2. FRESH START WITH VERSION UPDATE
sed -i '' 's/V5\.1.*UTC/V$(date +%Y%m%d) - $(date +%H:%M) UTC/g' index.html
python3 -m http.server 8003 > server.log 2>&1 &
sleep 5

# 3. MANDATORY SELF-TEST (NEVER skip!)
npm run test:selftest

# 4. VERSION VALIDATION (prevents cache confusion)
EXPECTED_DATE=$(date +%Y%m%d)
ACTUAL_VERSION=$(curl -s http://localhost:8003/ | grep -o "V[0-9]\+")
if [[ "$ACTUAL_VERSION" == *"$EXPECTED_DATE"* ]]; then
    open "http://localhost:8003/"
else
    echo "❌ VERSION MISMATCH - NO BROWSER OPENING"
    exit 1
fi

# 5. Deploy after changes (auto-deploys via GitHub Actions)
git add . && git commit -m "🎮 MEGA-UPDATE: [description]" && git push
# GitHub Actions auto-deploys to vibecoding.company/fischseite (2-5 min)
# Excludes: tests/, node_modules/, .git*, archive-do-not-read/
```

### USER vs SELF Testing Protocol
```bash
# SELF-TESTS (Claude internal validation - browser auto-closes)
npm run test:selftest    # For development/debugging

# USER-TESTS (Browser stays open for user inspection)
node tests/user-test.js  # When presenting finished work to user
```

### Database Setup (Supabase)
```bash
# SQL files (execute in Supabase SQL Editor):
# - HIGHSCORE_SETUP.sql - Highscore table with RLS
# - GUESTBOOK_SCHEMA_UPDATE.sql - Guestbook structure
# - FIX_RLS_POLICIES.sql - RLS fixes

# JS setup tools:
node test-supabase-connection.js  # Test connection
node test-guestbook-db.js         # Test guestbook functionality
```

## Architecture Patterns

### JavaScript Architecture
- **Modular Loading** - External JS files loaded via script tags with `defer`
- **Event-Driven** - Click handlers, Intersection Observer, RequestAnimationFrame
- **State Management** - Object-oriented games with proper cleanup
- **Error Handling** - Graceful degradation when Supabase unavailable
- **Performance** - Object pooling for animations, RAF for 60fps

### Key Interactive Systems
- **Smart Fish Spawner** - Click any fish → spawn new fish (max 50, unified system)
  - CSS `scaleX(-1)` transforms for proper fish direction
  - Single/double-click detection (300ms timeout)
  - Game area exclusion and collision avoidance
  - Professional lifecycle: spawn → grow → shrink → fade → remove
- **Game Portfolio** - 5 complete games with shared optimized engine:
  - **Collector Game** - 5 food types, physics engine, scoring, perfect score → Supabase highscore
  - **Builder Game** - Drag-and-drop aquarium construction with decoration system
  - **Memory Game** - Fish pair matching with flip animations and scoring
  - **Racing Game** - Multi-fish racing simulation with AI behavior
  - **Care Simulation** - Virtual fish care, feeding, and aquarium maintenance
- **Advanced Visual Systems**:
  - **AAA Visual Effects Engine** - Particle systems, advanced animations
  - **Animation Coordinator** - 60fps RequestAnimationFrame management
  - **Game Balancer** - AI-driven difficulty adjustment and performance optimization
- **Content Management**:
  - **Video Preloader** - Intersection Observer triggers smart loading (3 parallel max)
  - **Gallery System** - Tab switching images/videos, lightbox with touch gestures
  - **Progressive Enhancement** - Feature detection and graceful fallbacks
- **Audio & Feedback**:
  - **Sound System** - Ambient underwater audio with volume controls
  - **Haptic Feedback** - Touch vibrations for mobile interactions
- **Backend Integration**:
  - **Supabase Integration** - Highscores + guestbook with rate limiting (5/hour/IP)
  - **Error Handling** - Graceful degradation when database unavailable

### CSS Design System
```css
--primary-blue: #006994
--secondary-teal: #4ECDC4
--accent-coral: #FF6B6B
```
- **Responsive** - Mobile-first, breakpoints at 768px/1400px
- **Animations** - Underwater effects (bubbles, waves, fish swimming)
- **Glassmorphism** - Navigation and UI overlays

## File Organization

### Production Structure
```
fischseite/
├── index.html                 # Main site (4000+ lines, embedded CSS)
├── guestbook.html            # Supabase guestbook
├── js/                       # Interactive modules
├── bilder/                   # Image gallery (29 JPEG files)
├── videos/                   # Video gallery (9 MOV files)
├── assets/                   # Static assets
└── archive-do-not-read/      # Legacy files (excluded from deployment)
```

### Testing Coverage (Comprehensive Playwright Suite)
- **Game mechanics** - All 5 games with scoring validation and physics testing
- **Fish spawning** - Click interactions, max 50 fish limit, direction validation
- **Advanced game features** - Enhanced game mechanics, effects, AI behavior
- **Video preloader** - Progress indicators, loading management, intersection observer
- **Gallery system** - Tab switching, lightbox, touch gestures, responsive behavior
- **Performance optimization** - Animation frame rates, memory usage, game balancer
- **Progressive enhancement** - Feature detection, fallbacks, accessibility
- **Responsive design** - Multiple viewport sizes, mobile touch interactions
- **Integration testing**:
  - **Self-testing** - Comprehensive automated validation (play-ride-selftest.js)
  - **Smoke tests** - Quick functionality checks
  - **Production tests** - Live site validation
  - **Debug tools** - Game startup and error diagnostics
  - **Comprehensive tests** - Full feature validation across all games
  - **Individual game tests** - Isolated testing for each game module
  - **Real gameplay tests** - Actual user interaction simulation

## Development Guidelines

### Performance Limits
- **Video files:** MAX 25MB (use FFmpeg compression if larger)
- **Images:** MAX 5MB (optimize with WebP/JPEG)
- **JS modules:** MAX 500KB per file (split if larger)
- **Total project:** TARGET <200MB

### Code Patterns
- **CSS:** Use CSS variables, mobile-first responsive, performant animations
- **JavaScript:** Modular loading, RequestAnimationFrame for animations, graceful Supabase degradation
- **Error Handling:** Always fallback when database features unavailable

### Content Updates
- **Images**: Add to `bilder/`, update gallery HTML, use kebab-case naming
- **Videos**: Add to `videos/`, consider preloader integration, max 25MB files
- **Games**:
  - Collector game: Modify `aquarium-collector-game.js` for scoring/physics changes
  - Memory game: Update `fish-memory-game.js` for pair matching logic
  - Racing game: Adjust `fish-racing-game.js` for AI behavior
  - Builder game: Modify `aquarium-builder-game.js` for drag-and-drop features
  - Care simulation: Update `fish-care-simulation.js` for pet care mechanics
- **Fish system**: Update `smart-fish-system.js` for spawner changes, direction fixes
- **Visual effects**: Modify `aaa-visual-effects-engine.js` for particle systems
- **Performance**: Adjust `game-balancer.js` for difficulty/performance optimization

## Common Issues & Solutions

### Development Problems & Solutions
1. **Fish System:** Use `smart-fish-system.js` for all fish interactions (max 50 fish, unified system)
2. **Game Performance:** Check `game-balancer.js` and `animation-coordinator.js` for 60fps optimization
3. **Visual Effects:** Use `aaa-visual-effects-engine.js` for particle systems and advanced animations
4. **Supabase Connection:** Verify credentials and network connectivity, graceful fallback to localStorage
5. **Video Loading:** Check MOV file accessibility, use `video-preloader.js` for optimization
6. **Cross-Origin:** Always use HTTP server (not file://) for full functionality
7. **Cache Problems:** Use version validation workflow, force browser restart, wait 5+ min for deployment

### Critical Browser Cache Issues
**FISCHSEITE-SPECIFIC PROBLEM:** Browser may show old V5.1 instead of current version
- **Solution:** Use complete cleanup workflow in Development section
- **NEVER** open browser without version validation
- **ALWAYS** update version string before testing
- **FORCE** complete browser restart (quit Chrome)

### Browser Support & Performance
- **Modern:** Chrome 90+, Safari 14+, Firefox 88+ (full features, all 5 games)
- **Legacy:** Core functionality works without interactive features
- **Mobile:** iOS Safari, Android Chrome optimized with haptic feedback
- **Performance Target:** 95+ score, 60fps animations, sub-3s load times

### Troubleshooting Policy
For problems >30 minutes: Document in `docs/Troubleshooting.md` with symptoms, attempts, root cause, and solution. Current major issues documented:
- GitHub Actions FTP deployment fixes
- Browser cache problems and solutions
- Supabase integration setup
- SELF-TEST vs USER-TEST workflow confusion

## 🚨 CRITICAL: BROWSER-CACHE PROBLEM (28.09.2025)

### ❌ **WIEDERHOLTES VERSAGEN:**
- **3x INCIDENTS:** Browser zeigt alte V5.1 (27.09.2025 21:40 UTC) statt aktuelle Version
- **Problem:** Cache-Busting mit `?cache=` funktioniert NICHT
- **Root Cause:** Server cached responses + Browser cached resources
- **Evidence:** Screenshot 02:04 zeigt ?cache=1759017739 aber alte Version

### ✅ **CORRECTED FISCHSEITE WORKFLOW:**
```bash
# 1. FORCE COMPLETE CLEANUP
osascript -e 'tell application "Google Chrome" to quit'
lsof -ti:8003 | xargs kill -9
rm -f server.log

# 2. FRESH START WITH VERSION UPDATE
sed -i '' 's/V5\.1.*UTC/V$(date +%Y%m%d) - $(date +%H:%M) UTC/g' index.html
python3 -m http.server 8003 > server.log 2>&1 &
sleep 5

# 3. HARD REFRESH VALIDATION
curl -H "Cache-Control: no-cache" "http://localhost:8003/" | grep -i "deployed\|version"

# 4. ONLY OPEN BROWSER IF VERSION IS CURRENT
EXPECTED_DATE=$(date +%Y%m%d)
ACTUAL_VERSION=$(curl -s http://localhost:8003/ | grep -o "V[0-9]\+")
if [[ "$ACTUAL_VERSION" == *"$EXPECTED_DATE"* ]]; then
    open "http://localhost:8003/"
else
    echo "❌ VERSION MISMATCH - NO BROWSER OPENING"
    exit 1
fi
```

### 🔥 **FISCHSEITE-SPECIFIC RULES:**
1. **NEVER open browser without version validation**
2. **ALWAYS update version string before testing**
3. **FORCE complete browser restart (quit Chrome)**
4. **VERIFY current date in version banner**
5. **CLOSE ALL test tabs immediately after validation**

**LESSON:** Cache-busting queries are INSUFFICIENT - need server + content changes!