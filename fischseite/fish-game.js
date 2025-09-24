/* Minimal scroll-driven Endless Swimmer (Vanilla JS + Canvas)
   - One global RAF loop for all instances
   - IntersectionObserver to pause offscreen instances
   - Mouse Y controls fish vertical position
   - Speed couples to scroll position
*/
(function(){
  'use strict';

  class FishGame {
    constructor(containerEl) {
      this.container = containerEl;
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'fish-game-canvas';
      this.ctx = this.canvas.getContext('2d');
      this.container.appendChild(this.canvas);

      this.devicePixelRatio = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      this.width = 0;
      this.height = 0;

      // Game state
      this.active = false; // toggled by IO
      this.fishY = 0.5; // normalized 0..1 of height
      this.targetY = 0.5;
      this.fishX = 0.15; // relative position
      this.obstacles = [];
      this.spawnTimer = 0;
      this.score = 0;
      this.hitFlash = 0;
      this.trail = [];
      this.maxTrail = 10;
      this.bubbles = [];
      this._initBubbles && this._initBubbles(10);
      this._updateDifficulty && this._updateDifficulty();

      // Fish sprite (PNG) – loaded asynchronously; falls back to vector if not available
      this.fishImg = null;
      this.fishImgReady = false;
      this.fishAspect = 1.6; // updated after image load
      this._loadFishImage && this._loadFishImage();

      // Lives & game state
      this.lives = 5;
      this.invuln = 0; // seconds of invulnerability after hit
      this.gameOver = false;
      this._onRestart = () => { if (this.gameOver) this._resetGame(); };
      window.addEventListener('click', this._onRestart);

      // Interaction
      this._onMouseMove = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        if (rect.height <= 0) return;
        const y = (e.clientY - rect.top) / Math.max(1, rect.height);
        this.targetY = Math.min(1, Math.max(0, y));
      };
      // Use window so pointer-events: none on canvas won't block interaction
      window.addEventListener('mousemove', this._onMouseMove, { passive: true });

      // Optional keyboard controls
      this.keyUp = false;
      this.keyDown = false;
      this._onKeyDown = (e) => {
        if (e.key === 'ArrowUp') this.keyUp = true;
        if (e.key === 'ArrowDown') this.keyDown = true;
      };
      this._onKeyUp = (e) => {
        if (e.key === 'ArrowUp') this.keyUp = false;
        if (e.key === 'ArrowDown') this.keyDown = false;
      };
      window.addEventListener('keydown', this._onKeyDown);
      window.addEventListener('keyup', this._onKeyUp);

      // Touch controls
      this._onTouch = (e) => {
        const t = e.touches && e.touches[0];
        if (!t) return;
        const rect = this.canvas.getBoundingClientRect();
        if (rect.height <= 0) return;
        const y = (t.clientY - rect.top) / Math.max(1, rect.height);
        this.targetY = Math.min(1, Math.max(0, y));
      };
      window.addEventListener('touchstart', this._onTouch, { passive: true });
      window.addEventListener('touchmove', this._onTouch, { passive: true });

      this._onResize = () => this._resize();
      window.addEventListener('resize', this._onResize);

      this._resize();
    }

    setActive(isActive) {
      this.active = !!isActive;
    }

    destroy() {
      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('keydown', this._onKeyDown);
      window.removeEventListener('keyup', this._onKeyUp);
      window.removeEventListener('touchstart', this._onTouch);
      window.removeEventListener('touchmove', this._onTouch);
      window.removeEventListener('click', this._onRestart);
      window.removeEventListener('resize', this._onResize);
      this.container.removeChild(this.canvas);
    }

    _resize() {
      const cssWidth = this.container.clientWidth;
      const cssHeight = this.container.clientHeight;
      const dpr = this.devicePixelRatio;
      this.canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
      this.canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
      this.canvas.style.width = cssWidth + 'px';
      this.canvas.style.height = cssHeight + 'px';
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      if (this._updateDifficulty) this._updateDifficulty();
    }

    _loadFishImage() {
      try {
        const img = new Image();
        img.decoding = 'async';
        img.src = 'bilder/fisch freigestellt skalar mario lanz verein.png';
        img.onload = () => {
          this.fishImg = img;
          this.fishImgReady = true;
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          if (w && h) this.fishAspect = Math.max(0.8, Math.min(2.2, w / h));
        };
        img.onerror = () => {
          this.fishImgReady = false; // fallback stays vector
        };
      } catch (e) {
        // ignore, keep vector fallback
        this.fishImgReady = false;
      }
    }

    update(dt, gameSpeed) {
      if (this.gameOver) return;
      // Smoothly approach targetY
      const approachRate = 8; // higher = snappier
      this.fishY += (this.targetY - this.fishY) * Math.min(1, dt * approachRate);

      // Keyboard adjust of targetY
      const keyRate = 0.8; // normalized per second
      if (this.keyUp) this.targetY = Math.max(0, this.targetY - keyRate * dt);
      if (this.keyDown) this.targetY = Math.min(1, this.targetY + keyRate * dt);

      // Invulnerability decay
      if (this.invuln > 0) this.invuln = Math.max(0, this.invuln - dt);

      // Spawn obstacles
      const spawnRate = this.difficulty && this.difficulty.spawnRate ? this.difficulty.spawnRate : 1;
      // Make it easier overall
      this.spawnTimer -= dt * gameSpeed * spawnRate * 0.6;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = 1.6 + Math.random() * 1.0; // slower spawning
        this._spawnObstacle();
      }

      // Move obstacles left
      const pxSpeed = gameSpeed * (this.height / 80) * 60 * dt; // scale with divider height for consistency
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
        const ob = this.obstacles[i];
        ob.x -= pxSpeed;
        // Score when obstacle passes fish
        const fishX = this._fishAABB().x;
        if (!ob.scored && ob.x + ob.w < fishX) {
          ob.scored = true;
          this.score += 10;
        }
        if (ob.x + ob.w < -10) this.obstacles.splice(i, 1);
      }

      // Collision (AABB)
      const fish = this._fishAABB();
      for (const ob of this.obstacles) {
        if (fish.x < ob.x + ob.w && fish.x + fish.w > ob.x && fish.y < ob.y + ob.h && fish.y + fish.h > ob.y) {
          if (this.invuln <= 0) {
            ob.hit = true;
            this.hitFlash = 0.2;
            this.invuln = 1.2;
            this.lives -= 1;
            if (this.lives <= 0) {
              this.gameOver = true;
              break;
            }
          }
        }
      }

      // Trail update
      const fishCenterY = fish.y + fish.h * 0.5;
      this.trail.push({ x: fish.x + fish.w * 0.2, y: fishCenterY });
      if (this.trail.length > this.maxTrail) this.trail.shift();

      // Bubbles update
      if (this._updateBubbles) this._updateBubbles(dt, pxSpeed);

      // Hit flash decay
      if (this.hitFlash > 0) this.hitFlash = Math.max(0, this.hitFlash - dt);
    }

    draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      // Background: soft gradient overlay for depth
      ctx.save();
      const bg = ctx.createLinearGradient(0, 0, 0, this.height);
      bg.addColorStop(0, 'rgba(135,206,235,0.12)');
      bg.addColorStop(0.6, 'rgba(70,130,180,0.08)');
      bg.addColorStop(1, 'rgba(25,25,112,0.08)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();

      // Parallax streaks
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#ffffff';
      const t = performance.now() * 0.001;
      for (let i = 0; i < 6; i++) {
        const y = (i + ((t * 0.25) % 1)) * (this.height / 6);
        ctx.fillRect(0, y, this.width, 1 * this.devicePixelRatio);
      }
      ctx.restore();

      // Bubbles layer
      if (this._drawBubbles) this._drawBubbles(ctx);

      // Obstacles as rocks
      for (const ob of this.obstacles) {
        this._drawRock(ctx, ob);
        if (ob.hit) ob.hit = false; // reset flash
      }

      // Motion trail behind fish
      if (this._drawTrail) this._drawTrail(ctx);

      // Fish (simple vector)
      this._drawFish();

      // HUD: score (top-right)
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = Math.max(10, Math.floor(this.height * 0.18)) + 'px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText(String(this.score), this.width - 6 * this.devicePixelRatio, 2 * this.devicePixelRatio);
      ctx.restore();

      // Screen hit flash
      if (this.hitFlash > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 0, 0, ' + (0.25 * this.hitFlash / 0.15).toFixed(3) + ')';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
      }
    }

    _spawnObstacle() {
      // Rock variants suitable for small height
      const h = this.height;
      const w = this.width;
      const type = Math.random();
      const widthScale = this.difficulty && this.difficulty.width ? this.difficulty.width : 1;
      const heightScale = this.difficulty && this.difficulty.height ? this.difficulty.height : 1;
      const baseW = Math.max(10 * this.devicePixelRatio, Math.floor(h * (0.10 + Math.random()*0.06) * widthScale));

      if (type < 0.45) {
        // top rock ledge
        const height = Math.floor(h * (0.28 + Math.random() * 0.25) * heightScale);
        this.obstacles.push({ type: 'top', x: w + baseW, y: 0, w: baseW, h: height });
      } else if (type < 0.9) {
        // bottom boulder
        const height = Math.floor(h * (0.28 + Math.random() * 0.25) * heightScale);
        this.obstacles.push({ type: 'bottom', x: w + baseW, y: h - height, w: baseW, h: height });
      } else {
        // mid floating rock
        const height = Math.floor(h * (0.18 + Math.random() * 0.22) * heightScale);
        const y = Math.floor(h * (0.25 + Math.random() * 0.5));
        this.obstacles.push({ type: 'mid', x: w + baseW, y, w: baseW, h: height });
      }
    }

    _fishAABB() {
      const h = this.height;
      const w = this.width;
      const fishHeight = Math.max(10 * this.devicePixelRatio, Math.floor(h * 0.4));
      const fishWidth = Math.floor(fishHeight * this.fishAspect);
      const x = Math.floor(w * this.fishX);
      const y = Math.floor(this.fishY * h - fishHeight * 0.5);
      return { x, y, w: fishWidth, h: fishHeight };
    }

    _drawFish() {
      if (this.fishImgReady) {
        this._drawFishImage();
      } else {
        this._drawFishVector();
      }
    }

    _drawFishVector() {
      const ctx = this.ctx;
      const box = this._fishAABB();
      const cx = box.x;
      const cy = box.y + box.h / 2;

      ctx.save();
      ctx.translate(cx, cy);
      const bob = Math.sin(performance.now() * 0.003) * (box.h * 0.03);
      ctx.translate(0, bob);

      const bodyGrad = ctx.createLinearGradient(-box.w * 0.55, 0, box.w * 0.55, 0);
      bodyGrad.addColorStop(0, '#00577a');
      bodyGrad.addColorStop(0.5, '#006994');
      bodyGrad.addColorStop(1, '#2aa9a0');
      ctx.fillStyle = bodyGrad;
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = Math.max(1, Math.floor(this.devicePixelRatio));
      this._ellipse(ctx, box.w * 0.55, box.h * 0.35);

      const t = performance.now() * 0.006;
      const tailSwing = Math.sin(t) * (box.h * 0.1);
      ctx.save();
      ctx.translate(box.w * 0.5, 0);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(box.w * 0.25, -box.h * 0.18 + tailSwing);
      ctx.lineTo(box.w * 0.25, box.h * 0.18 + tailSwing);
      ctx.closePath();
      ctx.fillStyle = '#4ECDC4';
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(-box.w * 0.1, -box.h * 0.15);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(box.w * 0.12, -box.h * 0.25, box.w * 0.22, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(78,205,196,0.9)';
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(-box.w * 0.05, box.h * 0.18);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(box.w * 0.10, box.h * 0.18, box.w * 0.20, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(102,187,106,0.85)';
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(-box.w * 0.35, -box.h * 0.1, box.h * 0.06, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-box.w * 0.35, -box.h * 0.1, box.h * 0.03, 0, Math.PI * 2);
      ctx.fillStyle = '#003A5C';
      ctx.fill();

      ctx.restore();
    }

    _drawFishImage() {
      const ctx = this.ctx;
      const box = this._fishAABB();

      ctx.save();
      // Mirror horizontally so fish faces gameplay direction
      ctx.translate(box.x + box.w, box.y + box.h / 2);
      const bob = Math.sin(performance.now() * 0.003) * (box.h * 0.03);
      ctx.translate(0, bob);
      ctx.scale(-1, 1);
      const yaw = Math.sin(performance.now() * 0.006) * 0.08; // gentle swim yaw
      ctx.rotate(yaw);
      ctx.drawImage(this.fishImg, 0, -box.h * 0.5, box.w, box.h);
      ctx.restore();
    }

    _ellipse(ctx, rx, ry) {
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    _initBubbles(count) {
      this.bubbles.length = 0;
      for (let i = 0; i < count; i++) {
        this.bubbles.push({
          x: Math.random(),
          y: Math.random(),
          r: 0.6 + Math.random() * 1.6,
          s: 0.02 + Math.random() * 0.06
        });
      }
    }

    _updateBubbles(dt, pxSpeed) {
      for (const b of this.bubbles) {
        b.y -= b.s * dt * 30;
        b.x -= (pxSpeed / Math.max(1, this.width)) * dt * (0.4 + Math.random() * 0.2);
        if (b.y < -0.05) { b.y = 1 + Math.random() * 0.1; b.x = Math.random(); }
        if (b.x < -0.05) { b.x = 1 + Math.random() * 0.05; }
      }
    }

    _drawBubbles(ctx) {
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      for (const b of this.bubbles) {
        const x = Math.floor(b.x * this.width);
        const y = Math.floor(b.y * this.height);
        ctx.beginPath();
        ctx.arc(x, y, b.r * this.devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    _drawTrail(ctx) {
      if (this.trail.length < 2) return;
      ctx.save();
      for (let i = 0; i < this.trail.length; i++) {
        const p = this.trail[i];
        const a = (i + 1) / this.trail.length;
        ctx.globalAlpha = 0.08 * a;
        ctx.fillStyle = '#006994';
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, 10 * a * this.devicePixelRatio, 6 * a * this.devicePixelRatio, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    _updateDifficulty() {
      const w = window.innerWidth || this.container.clientWidth;
      const mobile = w <= 768;
      const tablet = w > 768 && w <= 1024;
      this.difficulty = {
        spawnRate: mobile ? 0.8 : tablet ? 0.9 : 1.0,
        width: mobile ? 0.9 : tablet ? 0.95 : 1.0,
        height: mobile ? 0.85 : tablet ? 0.9 : 1.0
      };
    }
  }

  const GameManager = {
    instances: [],
    running: false,
    lastTime: performance.now(),
    io: null,

    addInstance(containerEl) {
      const game = new FishGame(containerEl);
      this.instances.push(game);
      if (!this.io) this._setupIO();
      else this.io.observe(containerEl);
      return game;
    },

    _setupIO() {
      this.io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const target = this.instances.find(g => g.container === entry.target);
          if (target) target.setActive(entry.isIntersecting);
        });
      }, { threshold: 0.1 });

      this.instances.forEach(g => this.io.observe(g.container));
    },

    start() {
      if (this.running) return;
      this.running = true;
      this.lastTime = performance.now();
      const loop = () => {
        if (!this.running) return;
        const now = performance.now();
        const dt = Math.min(0.05, (now - this.lastTime) / 1000); // clamp 50 ms
        this.lastTime = now;

        const gameSpeed = this._calculateGameSpeed();

        for (const g of this.instances) {
          if (!g.active) continue;
          g.update(dt, gameSpeed);
          g.draw();
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },

    _calculateGameSpeed() {
      const doc = document.documentElement;
      const total = Math.max(1, doc.scrollHeight - window.innerHeight);
      let p = Math.min(1, Math.max(0, window.scrollY / total));
      const base = 1.6; // px/frame baseline
      const bonus = 6.0; // max extra
      return base + p * bonus;
    }
  };

  function initFishGames() {
    const containers = document.querySelectorAll('.underwater-divider');
    containers.forEach(c => GameManager.addInstance(c));
    GameManager.start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFishGames);
  } else {
    initFishGames();
  }
})();


