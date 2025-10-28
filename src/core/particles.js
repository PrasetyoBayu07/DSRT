// src/core/particles.js

// ============================================================
// DSRT ENGINE PARTICLES MODULE
// Fire, smoke, water, and bubble particle systems
// ============================================================

var DSRT = DSRT || {};

DSRT.Particles = (function () {

  const ctx = () => DSRT.Core.getContext();
  const particles = [];

  // Base particle object
  class Particle {
    constructor(x, y, vx, vy, size, color, life, type = "generic") {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.size = size;
      this.color = color;
      this.life = life;
      this.type = type;
      this.age = 0;
      this.alpha = 1;
    }

    update(dt = 1 / 60) {
      this.x += this.vx * dt * 60;
      this.y += this.vy * dt * 60;
      this.age += dt;
      this.alpha = Math.max(0, 1 - this.age / this.life);
    }

    draw() {
      const c = ctx();
      c.save();
      c.globalAlpha = this.alpha;
      c.fillStyle = this.color;
      c.beginPath();
      c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    isAlive() {
      return this.age < this.life;
    }
  }

  // ========== FIRE ==========
  function fire(x, y, count = 5, color = "#ff6600") {
    for (let i = 0; i < count; i++) {
      const vx = (Math.random() - 0.5) * 20;
      const vy = -Math.random() * 40 - 10;
      const size = 3 + Math.random() * 3;
      const life = 0.8 + Math.random() * 0.6;
      const flameColor = ["#ff6600", "#ffaa00", "#ffee00"][Math.floor(Math.random() * 3)];
      particles.push(new Particle(x, y, vx, vy, size, flameColor, life, "fire"));
    }
  }

  // ========== SMOKE ==========
  function smoke(x, y, count = 3, color = "#777") {
    for (let i = 0; i < count; i++) {
      const vx = (Math.random() - 0.5) * 10;
      const vy = -Math.random() * 20 - 10;
      const size = 5 + Math.random() * 10;
      const life = 2 + Math.random() * 2;
      particles.push(new Particle(x, y, vx, vy, size, color, life, "smoke"));
    }
  }

  // ========== WATER ==========
  function water(x, y, count = 6, color = "#00bfff") {
    for (let i = 0; i < count; i++) {
      const vx = (Math.random() - 0.5) * 30;
      const vy = Math.random() * 30;
      const size = 2 + Math.random() * 2;
      const life = 1 + Math.random() * 0.5;
      particles.push(new Particle(x, y, vx, vy, size, color, life, "water"));
    }
  }

  // ========== BUBBLES ==========
  function bubbles(x, y, count = 5, color = "#b3ecff") {
    for (let i = 0; i < count; i++) {
      const vx = (Math.random() - 0.5) * 10;
      const vy = -Math.random() * 20 - 5;
      const size = 3 + Math.random() * 3;
      const life = 2 + Math.random();
      particles.push(new Particle(x, y, vx, vy, size, color, life, "bubble"));
    }
  }

  // ========== UPDATE & DRAW LOOP ==========
  function update(dt = 1 / 60) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update(dt);
      if (!p.isAlive()) particles.splice(i, 1);
    }
  }

  function draw() {
    for (const p of particles) p.draw();
  }

  // ========== COMBINED EFFECT HELPERS ==========
  function fireAndSmoke(x, y) {
    fire(x, y, 5);
    if (Math.random() < 0.3) smoke(x, y - 10);
  }

  function steam(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      const vx = (Math.random() - 0.5) * 5;
      const vy = -Math.random() * 15 - 5;
      const size = 3 + Math.random() * 3;
      const life = 1.5 + Math.random();
      const c = `rgba(200,200,200,${Math.random() * 0.5 + 0.3})`;
      particles.push(new Particle(x, y, vx, vy, size, c, life, "steam"));
    }
  }

  function splash(x, y) {
    water(x, y, 10);
    if (Math.random() < 0.2) bubbles(x, y);
  }

  // ========== PUBLIC API ==========
  return {
    fire,
    smoke,
    water,
    bubbles,
    fireAndSmoke,
    steam,
    splash,
    update,
    draw
  };

})();
