# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fischseite** is a modern, interactive website for "Aquaristikfreunde Steiermark" - an Austrian aquarium club. This is a multi-module application featuring a main HTML page with extensive interactive JavaScript components, including games, animations, and dynamic content management.

**Current Status:** Version 3.0 - Smart Fish System with deployment verification, deployed to **vibecoding.company/fischseite**

## Architecture

### Hybrid Structure
- **`index.html`** - Main page with embedded CSS and core JavaScript
- **Interactive Modules** - External JavaScript files for games and features
- **No build process** - Direct HTML/JS with runtime module loading
- **Minimal dependencies** - CDN resources only (Font Awesome, optional Supabase)

### Key Files & Directories
- **`index.html`** - Main aquarium-themed website
- **`guestbook.html`** - Supabase-integrated guestbook feature
- **`js/`** - Interactive JavaScript modules
  - `smart-fish-system.js` - Current unified fish spawning system
  - `aquarium-collector-game.js` - Main collection game with scoring
  - `video-preloader.js` - Smart video loading with animations
  - `highscore-display.js` - Supabase-connected highscore system
- **`bilder/`** - Image gallery (29 JPEG images)
- **`videos/`** - Video gallery (9 MOV files)
- **`assets/`** - Static assets (logos, sound files)
- **`tests/`** - Core Playwright tests (3 essential test files)
- **`docs/`** - Project documentation and PRD
- **`archive-do-not-read/`** - Legacy files, old tests, and deprecated modules

## Development Commands

### Testing (Playwright-based)
```bash
# Core website functionality
node tests/test-website.js

# Complete feature testing
node tests/test-complete-website.js

# Smart fish system testing
node tests/test-smart-fish-system.js

# All legacy and specialized tests are archived in archive-do-not-read/tests/
# Use the 3 core tests above for main functionality verification
```

### Local Development
```bash
# Install dependencies (Playwright for testing)
npm install

# Local server (required for full functionality - file:// has CORS limitations)
python3 -m http.server 8000    # Recommended
# OR
npx serve . -p 8000            # Node.js alternative

# Access locally
open http://localhost:8000                # Main site
open http://localhost:8000/guestbook.html # Guestbook

# Direct file access (limited - no database features, video preloading issues)
open index.html
```

### Database Setup (Optional)
```bash
# Supabase SQL setup for highscores and guestbook
# Execute HIGHSCORE_SETUP.sql in Supabase SQL Editor
# Execute SUPABASE_SETUP.sql for guestbook functionality

# Quick highscore table creation
node create-highscore-table.js

# Test Supabase connection
node test-supabase-connection.js
```

### Deployment & Verification
```bash
# 🚨 CRITICAL: AUTOMATIC DEPLOYMENT AFTER EVERY MAJOR CHANGE!
# Auto-deploy to vibecoding.company/fischseite via GitHub Actions
git add . && git commit -m "description" && git push

# ⚡ GitHub Actions automatically deploys to Hostinger within 2-5 minutes
# - Workflow: .github/workflows/hostinger-deploy.yml
# - Target: Hostinger FTP (vibecoding.company/fischseite/)
# - ALWAYS DEPLOY IMMEDIATELY after code changes!

# Verify deployment (in archive-do-not-read/ if needed)
# Legacy verification tools moved to archive-do-not-read/legacy-js/
```

## Code Architecture

### CSS Structure
- **CSS Variables** - Extensive use of CSS custom properties for theming
- **Responsive Design** - Mobile-first approach with breakpoints at 768px and 1400px
- **Animations** - Complex keyframe animations for underwater/aquatic effects:
  - Bubble animations
  - Wave effects
  - Fish swimming animations
  - Seaweed swaying

### Interactive JavaScript System
- **Modular Architecture** - External JS files loaded on demand
- **Game Engine** - Aquarium collector game with physics and scoring
- **Fish Spawning System** - Click-to-spawn interactive animations
- **Smart Video Preloading** - Intersection Observer with animated loading
- **Gallery Management** - Tab switching between images/videos
- **Lightbox System** - Full-screen image viewing with touch gestures
- **Mobile Navigation** - Hamburger menu with glassmorphism effects
- **Performance Optimizations** - RequestAnimationFrame animations, object pooling
- **Database Integration** - Supabase for highscores and guestbook functionality

### Design System
**Color Palette:**
```css
--primary-blue: #006994
--secondary-teal: #4ECDC4
--accent-coral: #FF6B6B
--deep-blue: #003A5C
--light-blue: #E8F4F8
```

**Key Interactive Components:**
- Hero section with animated underwater background and spawnable fish
- Floating fish navigation with glassmorphism effects
- Aquarium collector game with 5 different food types and scoring
- Image/video galleries with smart preloading and lightbox
- Interactive fish spawner (click to spawn, max 10 fish)
- Supabase-powered highscore system with perfect score detection
- Video preloader with aquarium-themed loading animations
- Coral dividers and bubble effects

## Content Management

### Image Standards
- **Gallery Images:** JPEG format, optimized for web
- **Member Images:** AVIF format with JPEG fallbacks
- **Lazy Loading:** Implemented for performance
- **Alt Text:** Required for accessibility

### Video Standards
- **Format:** MOV (QuickTime) with HTML5 video elements
- **Smart Loading:** Dynamic preloading via `video-preloader.js`
- **Loading Animation:** Custom aquarium-themed progress indicators
- **Controls:** Native browser controls with custom overlays
- **Performance:** Intersection Observer triggers, parallel loading (3 videos max)

## Testing Strategy

### Automated Testing (Playwright)
- **Interactive Game Testing** - Aquarium collector game mechanics and scoring
- **Fish Spawning** - Dynamic fish generation and click interactions
- **Video Preloading** - Smart loading system and progress indicators
- **3D Underwater Effects** - Animation performance and visual effects
- **Menu Visibility** - Navigation states and glassmorphism effects
- **Responsive Design** - Multiple viewport sizes and mobile interactions
- **Gallery Functionality** - Tab switching, lightbox operations, touch gestures
- **Performance Metrics** - Load time, resource counting, animation frame rates
- **Media Validation** - All images, videos, and interactive elements load correctly

### Manual Testing Checklist
1. **Game Functionality** - Play aquarium collector game, verify scoring and perfect score detection
2. **Interactive Fish** - Click fish to spawn new ones, test maximum limit (10 fish)
3. **Video Preloading** - Scroll to video sections, verify loading animations appear
4. **Supabase Integration** - Test highscore submission and guestbook (requires database setup)
5. **Responsive Design** - Test on multiple devices and orientations
6. **Animation Performance** - Verify smooth fish swimming, bubble effects, wave animations
7. **Touch Interactions** - Test mobile touch gestures for games and navigation
8. **Cross-browser Compatibility** - Test on Chrome, Safari, Firefox, Edge

## Deployment

### File Structure for Hosting
```
fischseite/
├── index.html                      # Main website entry point
├── guestbook.html                  # Supabase guestbook feature
├── js/                            # JavaScript modules
│   ├── smart-fish-system.js       # Unified fish system
│   ├── aquarium-collector-game.js # Collection game
│   ├── video-preloader.js         # Smart video loading
│   └── highscore-display.js       # Highscore system
├── bilder/                        # Image gallery (29 JPEG images)
├── videos/                        # Video gallery (9 MOV files)
├── assets/                        # Static assets (logos, sound)
├── tests/                         # Core functionality tests
├── docs/                          # Documentation and PRD
└── archive-do-not-read/           # Legacy files (not for production)
```

### Performance Considerations
- **JavaScript Modules:** External JS files loaded on demand for better caching
- **Animation Optimization:** RequestAnimationFrame for smooth 60fps animations
- **Video Loading:** Smart preloading prevents unnecessary bandwidth usage
- **Object Pooling:** Bubble and particle effects use efficient memory management
- **Image Optimization:** Consider WebP conversion for better compression
- **CDN:** Static assets (images/videos) should be served from CDN in production
- **Supabase:** Database queries optimized with rate limiting and error handling

## Key Development Guidelines

### CSS Best Practices
- Use CSS variables for consistent theming
- Maintain mobile-first responsive approach
- Keep animations performant (use transform/opacity)
- Ensure proper contrast ratios for accessibility

### JavaScript Patterns
- **Modular Architecture** - External files for major features, loaded via script tags
- **Unified Fish System** - All fish interactions consolidated in `smart-fish-system.js`
- **Game State Management** - Object-oriented approach for games with proper cleanup
- **Animation Framework** - RequestAnimationFrame with performance monitoring
- **Async Loading** - Promise-based operations for Supabase and video preloading
- **Event Management** - Proper delegation and cleanup for dynamic content
- **Error Handling** - Graceful degradation when database features unavailable

### Content Updates
- **New Images:** Add to `bilder/` directory and update gallery HTML
- **New Videos:** Add to `videos/` directory, update gallery HTML, consider preloader integration
- **Game Content:** Modify `aquarium-collector-game.js` for new food types or scoring
- **Interactive Features:** Update spawner configurations in `smart-fish-system.js`
- **Database Content:** Use Supabase dashboard for highscore and guestbook management

## Troubleshooting

### 🚨 CRITICAL: TROUBLESHOOTING.md POLICY
**Bei Problemen, die länger als 30 Minuten dauern:**
1. **SOFORT dokumentieren** in `docs/Troubleshooting.md`
2. **Problem-Symptome** detailliert beschreiben
3. **Lösungsversuche** chronologisch festhalten
4. **Root Cause** und finale Lösung dokumentieren
5. **Lessons Learned** für zukünftige Projekte
6. **Automatisierung** erstellen wenn möglich

**Ziel:** Nie wieder dasselbe Problem 2x debuggen!

### Common Issues

### Common Issues
1. **Fish System:** Use `smart-fish-system.js` - unified system for all fish interactions
2. **Game Performance:** If animations lag, check RequestAnimationFrame implementation in game modules
3. **Supabase Connection:** Verify credentials in JavaScript files and check network connectivity
4. **Video Loading:** If preloader fails, check MOV file accessibility and server MIME types
5. **Fish Spawning:** Maximum 10 fish limit prevents performance issues - check spawner logic in smart-fish-system.js
6. **Mobile Touch:** Touch events may conflict with click events - test on actual devices
7. **Cross-Origin:** Local file:// access limits some features - use HTTP server for full functionality
8. **Deployment Issues:** Check GitHub Actions logs and use deployment verification scripts
9. **Cache Problems:** After deployment, old versions may be cached. Use deployment verification banners and wait 5+ minutes for propagation

### Browser Compatibility
- **Primary:** Chrome 90+, Safari 14+, Firefox 88+ (full feature support)
- **JavaScript Games:** Require modern browser with RequestAnimationFrame support
- **Supabase Features:** Require fetch API and Promise support
- **Mobile:** iOS Safari, Android Chrome optimized with touch event handling
- **Fallback:** Core website functionality works in older browsers without interactive features

## Interactive Features Architecture

### Game System (`aquarium-collector-game.js`)
- **Food Types:** 5 different collectibles with varying point values (10-25 points)
- **Scoring:** Perfect score detection (20/20 items) triggers highscore submission
- **Physics:** Custom collision detection and item movement
- **UI:** Real-time score display, timer, and game state management

### Fish Spawner (`smart-fish-system.js`)
- **Click-to-Spawn:** Click any fish to generate new fish (max 10)
- **Fish Types:** 7 different species with unique animations
- **Animations:** Natural swimming patterns with random movement
- **Reset System:** Counter display with reset functionality
- **Unified System:** Replaces multiple legacy fish modules

### Video System (`video-preloader.js`)
- **Smart Triggering:** Intersection Observer detects when user approaches video areas
- **Parallel Loading:** Loads up to 3 videos simultaneously for efficiency
- **Progress Feedback:** Aquarium-themed loading animations with percentage display
- **Fallback Handling:** Skip button and timeout protection (30 seconds)

### Database Integration (`highscore-display.js`)
- **Supabase Connection:** Real-time highscore storage and retrieval
- **Rate Limiting:** 5 entries per IP per hour to prevent spam
- **Error Handling:** Graceful degradation when database unavailable
- **Display System:** Scrolling highscore ticker with golden badges for perfect scores

## BMAD Method Integration

This project includes BMAD (Breakthrough Method for Agile AI-Driven Development) framework:
- **`.bmad-core/`** - Core BMAD system with specialized agents
- **Agents Available:** PO, Architect, Developer, QA, Scrum Master, UX Expert
- **Task Management:** Structured development workflow with agent-driven planning
- **Documentation:** Comprehensive PRD and architectural guidelines in `docs/`