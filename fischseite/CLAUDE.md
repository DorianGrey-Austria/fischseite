# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Fischseite** is a modern, mobile-responsive website for "Aquaristikfreunde Steiermark" - an Austrian aquarium club. This is a single-page HTML application with an aquatic/underwater theme, featuring extensive CSS animations, responsive design, and multimedia galleries.

## Architecture

### Single-File Structure
- **`index.html`** - Complete self-contained website with embedded CSS and JavaScript
- **No build process** - Direct HTML file with inline styles and scripts
- **No external dependencies** - Uses only CDN resources (Font Awesome)

### Key Directories
- **`bilder/`** - Image gallery (6 JPEG images + 7 AVIF member images)
- **`videos/`** - Video gallery (7 MOV files for aquarium videos)
- **`docs/`** - Contains comprehensive PRD (Product Requirements Document)
- **`test-*.js`** - Playwright testing scripts for functionality validation

## Development Commands

### Testing
```bash
# Run main website test
node test-website.js

# Run complete functionality test
node test-complete-website.js

# Run member portraits test
node test-member-portraits.js
```

### Local Development
```bash
# Simple HTTP server (Python)
python3 -m http.server 8000

# Open directly in browser
open index.html
```

### Dependencies
```bash
# Install testing dependencies
npm install
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

### JavaScript Features
- **Gallery Management** - Tab switching between images/videos
- **Lightbox System** - Full-screen image viewing
- **Mobile Navigation** - Hamburger menu with animations
- **Smooth Scrolling** - Anchor-based navigation with offset calculations
- **Touch Gestures** - Swipe to close lightbox
- **Performance Optimizations** - Intersection Observer for animations, image preloading

### Design System
**Color Palette:**
```css
--primary-blue: #006994
--secondary-teal: #4ECDC4
--accent-coral: #FF6B6B
--deep-blue: #003A5C
--light-blue: #E8F4F8
```

**Key Components:**
- Hero section with animated background
- Floating fish navigation
- Image/video galleries with tabs
- Member portrait system
- Coral dividers
- Feature cards with hover effects

## Content Management

### Image Standards
- **Gallery Images:** JPEG format, optimized for web
- **Member Images:** AVIF format with JPEG fallbacks
- **Lazy Loading:** Implemented for performance
- **Alt Text:** Required for accessibility

### Video Standards
- **Format:** MOV (QuickTime) with HTML5 video elements
- **Controls:** Native browser controls enabled
- **Preload:** Metadata only for performance

## Testing Strategy

### Automated Testing (Playwright)
- **Responsive Design** - Tests multiple viewport sizes
- **Gallery Functionality** - Tab switching, lightbox operations
- **Performance Metrics** - Load time and resource counting
- **Media Validation** - Checks all images and videos load correctly
- **Accessibility** - Basic alt text and navigation testing

### Manual Testing Checklist
1. Test on multiple devices (desktop, tablet, mobile)
2. Verify all animations perform smoothly
3. Check gallery tab switching
4. Test lightbox functionality
5. Validate mobile hamburger menu
6. Confirm touch gestures work on mobile

## Deployment

### File Structure for Hosting
```
fischseite/
├── index.html          # Main entry point
├── bilder/             # Image assets
├── videos/             # Video assets
└── (optional test files)
```

### Performance Considerations
- **Image Optimization:** Consider WebP conversion for better compression
- **CDN:** Images and videos should be served from CDN in production
- **Caching:** Set appropriate cache headers for static assets
- **Bundle Size:** Single HTML file is ~81KB (manageable size)

## Key Development Guidelines

### CSS Best Practices
- Use CSS variables for consistent theming
- Maintain mobile-first responsive approach
- Keep animations performant (use transform/opacity)
- Ensure proper contrast ratios for accessibility

### JavaScript Patterns
- Event delegation for dynamic content
- Throttled scroll listeners for performance
- Promise-based async operations
- Clean up event listeners appropriately

### Content Updates
- **New Images:** Add to `bilder/` directory and update gallery HTML
- **New Videos:** Add to `videos/` directory and update video gallery
- **Member Portraits:** Follow existing pattern with AVIF/JPEG fallbacks

## Troubleshooting

### Common Issues
1. **AVIF Support:** Fallback to JPEG implemented for older browsers
2. **Video Playback:** MOV files may need server MIME type configuration
3. **Mobile Performance:** Monitor animation performance on older devices
4. **Memory Usage:** Large number of media files - implement cleanup if needed

### Browser Compatibility
- **Primary:** Chrome 90+, Safari 14+, Firefox 88+
- **Fallbacks:** Basic IE 11 support for core functionality
- **Mobile:** iOS Safari, Android Chrome optimized

## Future Enhancements

Based on the PRD, planned features include:
- User authentication system
- Event management functionality
- Member profiles and discussion forums
- Marketplace for equipment trading
- Mobile app (PWA) capabilities

The current implementation serves as the visual foundation for these future community platform features.