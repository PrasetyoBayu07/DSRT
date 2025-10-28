// src/lab/burner.js
// ==============================================
// DSRT Bunsen Burner Simulation
// ==============================================

import { context } from '../core/canvas.js';
import { ParticleSystem } from '../physics/particles.js';
import { drawRoundedRect } from '../graphics/draw.js';

export class Burner {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.active = true;
    this.particles = new ParticleSystem(x + 10, y - 10, 'orange', 5);
  }

  toggle() {
    this.active = !this.active;
  }

  draw() {
    // Burner body
    drawRoundedRect(this.x, this.y, 20, 50, 4, 2, '#555', '#999');

    // Flame
    if (this.active) {
      this.particles.x = this.x + 10;
      this.particles.y = this.y;
      this.particles.update();
      this.particles.draw();
    }
  }
}
