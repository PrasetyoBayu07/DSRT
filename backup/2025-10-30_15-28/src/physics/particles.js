// src/physics/particles.js
// ==============================================
// DSRT Particle System (Fire, Smoke, Bubbles, etc.)
// ==============================================

import { context } from "../core/canvas.js";
import { randomInt } from "../core/utils.js";

export class Particle {
  constructor(x, y, vx, vy, size, color, life = 100) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.color = color;
    this.life = life;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw() {
    context.beginPath();
    context.fillStyle = this.color;
    context.globalAlpha = Math.max(0, this.life / 100);
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    context.fill();
    context.globalAlpha = 1;
    context.closePath();
  }

  isDead() {
    return this.life <= 0;
  }
}

export class ParticleSystem {
  constructor(x, y, color = "#f00", emissionRate = 2) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.emissionRate = emissionRate;
    this.particles = [];
  }

  emit() {
    for (let i = 0; i < this.emissionRate; i++) {
      const vx = (Math.random() - 0.5) * 2;
      const vy = -Math.random() * 2;
      const size = randomInt(3) + 2;
      const p = new Particle(this.x, this.y, vx, vy, size, this.color, randomInt(80) + 40);
      this.particles.push(p);
    }
  }

  update() {
    this.emit();
    this.particles.forEach((p) => p.update());
    this.particles = this.particles.filter((p) => !p.isDead());
  }

  draw() {
    this.particles.forEach((p) => p.draw());
  }
}

/**
 * Preset particle types for convenience.
 */
export const ParticlePresets = {
  fire(x, y) {
    return new ParticleSystem(x, y, "orange", 4);
  },
  smoke(x, y) {
    return new ParticleSystem(x, y, "gray", 2);
  },
  bubbles(x, y) {
    return new ParticleSystem(x, y, "#66ccff", 3);
  },
};
