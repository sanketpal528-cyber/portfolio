/* ═══════════════════════════════════════════════════════════════════
   BINARY UNIVERSE BACKGROUND ENGINE
   Matrix Rain · Antigravity Floaters · Binary Clusters
   Mouse Gravity Field · Glowing Pulses · Constellation Connections
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initAll(); });

  // ── Mouse ──────────────────────────────────────────────────────
  const mouse = { x: W / 2, y: H / 2, active: false };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  const rand  = (a, b) => Math.random() * (b - a) + a;
  const randI = (a, b) => Math.floor(rand(a, b));

  // Colors
  const COLORS = {
    green:   '#00ff41',
    cyan:    '#00d4ff',
    purple:  '#a89cff',
    pink:    '#f72585',
    white:   '#ffffff',
    dim:     'rgba(0,255,65,0.15)',
  };

  /* ══════════════════════════════════════════════════════════════
     1.  MATRIX RAIN COLUMNS — classic falling binary
  ══════════════════════════════════════════════════════════════ */
  const FONT_SIZE = 14;
  let cols = [];

  class MatrixColumn {
    constructor(x) {
      this.x       = x;
      this.y       = rand(-H, 0);
      this.speed   = rand(1.5, 4);
      this.len     = randI(8, 25);
      this.chars   = Array.from({ length: this.len }, () => Math.random() > 0.5 ? '1' : '0');
      this.timer   = 0;
      this.swapEvery = randI(4, 12);
      this.alpha   = rand(0.5, 1);
      this.color   = Math.random() > 0.7 ? COLORS.purple : COLORS.green;
    }
    update() {
      this.y += this.speed;
      this.timer++;
      if (this.timer % this.swapEvery === 0) {
        const idx = randI(0, this.len);
        this.chars[idx] = Math.random() > 0.5 ? '1' : '0';
      }
      if (this.y - this.len * FONT_SIZE > H) {
        this.y = rand(-H * 0.5, 0);
        this.speed = rand(1.5, 4);
      }
    }
    draw() {
      ctx.font = `${FONT_SIZE}px 'Courier New', monospace`;
      for (let i = 0; i < this.chars.length; i++) {
        const cy = this.y + i * FONT_SIZE;
        if (cy < 0 || cy > H) continue;
        // Head of column is bright white/cyan
        if (i === this.chars.length - 1) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = COLORS.cyan;
          ctx.shadowBlur  = 12;
          ctx.globalAlpha = this.alpha;
        } else {
          const fade = i / this.chars.length;
          ctx.globalAlpha = this.alpha * fade * 0.8;
          ctx.fillStyle   = this.color;
          ctx.shadowBlur  = i > this.chars.length - 3 ? 6 : 0;
          ctx.shadowColor = this.color;
        }
        ctx.fillText(this.chars[i], this.x, cy);
      }
      ctx.shadowBlur  = 0;
      ctx.globalAlpha = 1;
    }
  }

  /* ══════════════════════════════════════════════════════════════
     2.  ANTIGRAVITY FLOATERS — 0s and 1s that defy gravity
         They fall slowly, but near the mouse they FLY UPWARD
  ══════════════════════════════════════════════════════════════ */
  const FLOATER_COUNT = 80;
  let floaters = [];

  class Floater {
    constructor(init) {
      this.reset(init);
    }
    reset(init) {
      this.x     = rand(0, W);
      this.y     = init ? rand(0, H) : H + 20;
      this.char  = Math.random() > 0.5 ? '1' : '0';
      this.size  = rand(10, 22);
      this.vx    = rand(-0.3, 0.3);
      this.vy    = rand(-0.15, -0.05);  // naturally rises slowly
      this.alpha = rand(0.15, 0.55);
      this.color = [COLORS.green, COLORS.cyan, COLORS.purple, COLORS.pink][randI(0,4)];
      this.glow  = Math.random() > 0.7;
      this.rotSpeed = rand(-0.01, 0.01);
      this.rot   = rand(0, Math.PI * 2);
      this.pulse = rand(0, Math.PI * 2);
      this.pulseSpeed = rand(0.02, 0.06);
    }
    update() {
      // Antigravity field from mouse
      const dx   = this.x - mouse.x;
      const dy   = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 200 && mouse.active) {
        // Strong upward push + radial repulsion near mouse
        const force = (200 - dist) / 200;
        this.vx += (dx / dist) * force * 0.6;
        this.vy -= force * 1.2;  // antigravity: push UP strongly
      }

      // Gentle gravity pulls back down slowly
      this.vy += 0.008;
      this.vx *= 0.97;
      this.vy  = Math.max(this.vy, -3); // cap upward velocity

      this.x  += this.vx;
      this.y  += this.vy;
      this.rot += this.rotSpeed;
      this.pulse += this.pulseSpeed;

      // Randomly flip 0/1
      if (Math.random() < 0.002) this.char = this.char === '1' ? '0' : '1';

      // Wrap horizontal
      if (this.x < -30) this.x = W + 30;
      if (this.x > W + 30) this.x = -30;
      // Reset if too far up
      if (this.y < -50) this.reset(false);
      // Reset if falls below
      if (this.y > H + 50) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      const pulse = 0.7 + 0.3 * Math.sin(this.pulse);
      ctx.globalAlpha = this.alpha * pulse;
      ctx.font = `bold ${this.size}px 'Courier New', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (this.glow) {
        ctx.shadowColor = this.color;
        ctx.shadowBlur  = 15;
      }
      ctx.fillStyle = this.color;
      ctx.fillText(this.char, 0, 0);
      ctx.shadowBlur  = 0;
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }

  /* ══════════════════════════════════════════════════════════════
     3.  BINARY CLUSTERS — groups of bits forming hex-like blobs
  ══════════════════════════════════════════════════════════════ */
  const CLUSTER_COUNT = 12;
  let clusters = [];

  class BinaryCluster {
    constructor() { this.reset(); }
    reset() {
      this.x     = rand(50, W - 50);
      this.y     = rand(50, H - 50);
      this.bits  = Array.from({ length: randI(4, 8) }, () => Math.random() > 0.5 ? '1' : '0');
      this.alpha = rand(0.04, 0.1);
      this.size  = rand(11, 18);
      this.life  = rand(200, 500);
      this.age   = 0;
      this.drift = { x: rand(-0.2, 0.2), y: rand(-0.2, 0.2) };
      this.color = Math.random() > 0.5 ? COLORS.purple : COLORS.cyan;
    }
    update() {
      this.age++;
      this.x += this.drift.x;
      this.y += this.drift.y;
      if (this.age % 30 === 0) {
        const i = randI(0, this.bits.length);
        this.bits[i] = this.bits[i] === '1' ? '0' : '1';
      }
      if (this.age > this.life) this.reset();
    }
    draw() {
      const fade = Math.sin((this.age / this.life) * Math.PI);
      ctx.font = `${this.size}px 'Courier New', monospace`;
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha * fade;
      ctx.textAlign = 'left';
      const spacing = this.size * 1.2;
      this.bits.forEach((b, i) => {
        ctx.fillText(b, this.x + i * spacing, this.y);
      });
      ctx.globalAlpha = 1;
    }
  }

  /* ══════════════════════════════════════════════════════════════
     4.  BINARY CONSTELLATION — dots connected by lines
         Each node shows a 0 or 1
  ══════════════════════════════════════════════════════════════ */
  const NODE_COUNT = 40;
  let nodes = [];

  class BinaryNode {
    constructor() { this.reset(true); }
    reset(init) {
      this.x     = rand(0, W);
      this.y     = init ? rand(0, H) : rand(0, H);
      this.vx    = rand(-0.25, 0.25);
      this.vy    = rand(-0.25, 0.25);
      this.r     = rand(2, 4);
      this.char  = Math.random() > 0.5 ? '1' : '0';
      this.color = Math.random() > 0.6 ? COLORS.purple : COLORS.green;
      this.alpha = rand(0.3, 0.7);
      this.flipTimer = randI(60, 200);
    }
    update() {
      // Mouse gravity pulls nodes gently
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 250 && dist > 0 && mouse.active) {
        const f = (250 - dist) / 250 * 0.015;
        this.vx += (dx / dist) * f;
        this.vy += (dy / dist) * f;
      }
      this.vx *= 0.99;
      this.vy *= 0.99;
      this.x  += this.vx;
      this.y  += this.vy;
      // Bounce
      if (this.x < 0 || this.x > W) { this.vx *= -1; this.x = Math.max(0, Math.min(W, this.x)); }
      if (this.y < 0 || this.y > H) { this.vy *= -1; this.y = Math.max(0, Math.min(H, this.y)); }
      // Flip bit occasionally
      this.flipTimer--;
      if (this.flipTimer <= 0) {
        this.char = this.char === '1' ? '0' : '1';
        this.flipTimer = randI(60, 200);
      }
    }
    draw() {
      // Node dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 8;
      ctx.fill();
      // Bit label
      ctx.font = '9px Courier New';
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha * 0.8;
      ctx.textAlign = 'center';
      ctx.shadowBlur = 4;
      ctx.fillText(this.char, this.x, this.y - 8);
      ctx.shadowBlur  = 0;
      ctx.globalAlpha = 1;
    }
  }

  function drawConstellations() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = COLORS.green;
          ctx.globalAlpha = (1 - dist / 130) * 0.12;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  /* ══════════════════════════════════════════════════════════════
     5.  MOUSE GRAVITY VISUALIZER — ripple ring at cursor
  ══════════════════════════════════════════════════════════════ */
  let ripples = [];

  function addRipple() {
    if (mouse.active) {
      ripples.push({ x: mouse.x, y: mouse.y, r: 0, alpha: 0.4 });
    }
  }
  setInterval(addRipple, 800);

  function drawRipples() {
    ripples = ripples.filter(rp => rp.alpha > 0.01);
    ripples.forEach(rp => {
      rp.r     += 1.5;
      rp.alpha *= 0.96;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = COLORS.cyan;
      ctx.globalAlpha = rp.alpha;
      ctx.lineWidth   = 1;
      ctx.stroke();
      // Inner binary label
      if (rp.r < 30) {
        ctx.font = '10px Courier New';
        ctx.fillStyle = COLORS.cyan;
        ctx.textAlign = 'center';
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', rp.x, rp.y + 4);
      }
      ctx.globalAlpha = 1;
    });
  }

  /* ══════════════════════════════════════════════════════════════
     6.  SCROLLING BINARY TICKER — bottom edge
  ══════════════════════════════════════════════════════════════ */
  let ticker = '';
  let tickerX = W;
  for (let i = 0; i < 200; i++) ticker += (Math.random() > 0.5 ? '1' : '0') + ' ';

  function drawTicker(t) {
    tickerX -= 0.8;
    if (tickerX < -ticker.length * 8) tickerX = W;
    ctx.font = '11px Courier New';
    ctx.fillStyle = COLORS.green;
    ctx.globalAlpha = 0.06;
    ctx.textAlign = 'left';
    ctx.fillText(ticker, tickerX, H - 10);
    ctx.fillText(ticker, tickerX + ticker.length * 8, H - 10);
    ctx.globalAlpha = 1;
  }

  /* ══════════════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════════════ */
  function initAll() {
    const colCount = Math.floor(W / 22);
    cols     = Array.from({ length: colCount }, (_, i) => new MatrixColumn(i * 22 + 11));
    floaters = Array.from({ length: FLOATER_COUNT }, (_, i) => new Floater(true));
    clusters = Array.from({ length: CLUSTER_COUNT }, () => new BinaryCluster());
    nodes    = Array.from({ length: NODE_COUNT },    () => new BinaryNode());
  }
  initAll();

  /* ══════════════════════════════════════════════════════════════
     RENDER LOOP
  ══════════════════════════════════════════════════════════════ */
  let t = 0;

  function loop() {
    // Dark fade trail — gives the matrix rain its tail effect
    ctx.fillStyle = 'rgba(10, 10, 15, 0.18)';
    ctx.fillRect(0, 0, W, H);

    // Layer 1: Binary clusters (background)
    clusters.forEach(c => { c.update(); c.draw(); });

    // Layer 2: Matrix rain columns
    cols.forEach(c => { c.update(); c.draw(); });

    // Layer 3: Constellation nodes + connections
    drawConstellations();
    nodes.forEach(n => { n.update(); n.draw(); });

    // Layer 4: Antigravity floaters
    floaters.forEach(f => { f.update(); f.draw(); });

    // Layer 5: Mouse ripples
    drawRipples();

    // Layer 6: Ticker
    drawTicker(t);

    // Layer 7: Mouse glow halo
    if (mouse.active) {
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 160);
      grad.addColorStop(0,   'rgba(0,255,65,0.08)');
      grad.addColorStop(0.5, 'rgba(0,212,255,0.04)');
      grad.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 160, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      // Tiny binary chars burst near cursor
      ctx.font = '9px Courier New';
      ctx.textAlign = 'center';
      for (let i = 0; i < 3; i++) {
        const angle = (t * 0.05 + i * 2.1) % (Math.PI * 2);
        const r     = 60 + Math.sin(t * 0.03 + i) * 20;
        const bx    = mouse.x + Math.cos(angle) * r;
        const by    = mouse.y + Math.sin(angle) * r;
        ctx.fillStyle   = i % 2 === 0 ? COLORS.cyan : COLORS.green;
        ctx.globalAlpha = 0.5;
        ctx.fillText(t % 60 < 30 ? '1' : '0', bx, by);
        ctx.globalAlpha = 1;
      }
    }

    t++;
    requestAnimationFrame(loop);
  }

  loop();

})();
