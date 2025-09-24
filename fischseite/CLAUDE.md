# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fischseite** is a modern, interactive website for "Aquaristikfreunde Steiermark" - an Austrian aquarium club. This is a multi-module application featuring a main HTML page with extensive interactive JavaScript components, including games, animations, and dynamic content management.

## Architecture

### Hybrid Structure
- **`index.html`** - Main page with embedded CSS and core JavaScript
- **Interactive Modules** - External JavaScript files for games and features
- **No build process** - Direct HTML/JS with runtime module loading
- **Minimal dependencies** - CDN resources only (Font Awesome, optional Supabase)

### Key Files & Directories
- **`index.html`** - Main aquarium-themed website
- **`guestbook.html`** - Supabase-integrated guestbook feature
- **`bilder/`** - Image gallery (6 JPEG images)
- **`videos/`** - Video gallery (7 MOV files)
- **`docs/prd.md`** - Comprehensive Product Requirements Document
- **Interactive JavaScript Modules:**
  - `aquarium-collector-game.js` - Main collection game with scoring
  - `interactive-fish-spawner.js` - Dynamic fish spawning system
  - `video-preloader.js` - Smart video loading with animations
  - `highscore-display.js` - Supabase-connected highscore system
  - `fish-game.js` - Legacy game module
- **Testing Scripts:** `test-*.js` - Comprehensive Playwright test suite

## Development Commands

### Testing (Playwright-based)
```bash
# Core website functionality
node test-website.js

# Complete feature testing
node test-complete-website.js

# Specific feature tests
node test-member-portraits.js
node test-3d-underwater-effects.js
node test-game-controls.js
node test-menu-visibility.js
```

### Local Development
```bash
# Install Playwright dependencies
npm install

# Python HTTP server (recommended)
python3 -m http.server 8000

# Direct browser opening (limited functionality)
open index.html

# Access guestbook
open http://localhost:8000/guestbook.html
```

### Database Setup (Optional)
```bash
# Supabase SQL setup for highscores and guestbook
# Execute HIGHSCORE_SETUP.sql in Supabase SQL Editor
# Execute SUPABASE_SETUP.sql for guestbook functionality
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
├── aquarium-collector-game.js      # Main collection game
├── interactive-fish-spawner.js     # Fish spawning system
├── video-preloader.js              # Smart video loading
├── highscore-display.js           # Highscore system
├── bilder/                        # Image gallery assets
├── videos/                        # Video gallery assets
├── HIGHSCORE_SETUP.sql           # Database setup script
├── SUPABASE_SETUP.sql            # Guestbook database setup
└── docs/prd.md                   # Product requirements
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
- **Game State Management** - Object-oriented approach for games with proper cleanup
- **Animation Framework** - RequestAnimationFrame with performance monitoring
- **Async Loading** - Promise-based operations for Supabase and video preloading
- **Event Management** - Proper delegation and cleanup for dynamic content
- **Error Handling** - Graceful degradation when database features unavailable

### Content Updates
- **New Images:** Add to `bilder/` directory and update gallery HTML
- **New Videos:** Add to `videos/` directory, update gallery HTML, consider preloader integration
- **Game Content:** Modify `aquarium-collector-game.js` for new food types or scoring
- **Interactive Features:** Update spawner configurations in `interactive-fish-spawner.js`
- **Database Content:** Use Supabase dashboard for highscore and guestbook management

## Troubleshooting

### Common Issues
1. **Game Performance:** If animations lag, check RequestAnimationFrame implementation in game modules
2. **Supabase Connection:** Verify credentials in JavaScript files and check network connectivity
3. **Video Loading:** If preloader fails, check MOV file accessibility and server MIME types
4. **Fish Spawning:** Maximum 10 fish limit prevents performance issues - check spawner logic
5. **Mobile Touch:** Touch events may conflict with click events - test on actual devices
6. **Cross-Origin:** Local file:// access limits some features - use HTTP server for full functionality

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

### Fish Spawner (`interactive-fish-spawner.js`)
- **Click-to-Spawn:** Click any fish to generate new fish (max 10)
- **Fish Types:** 7 different species with unique animations
- **Animations:** Natural swimming patterns with random movement
- **Reset System:** Counter display with reset functionality

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