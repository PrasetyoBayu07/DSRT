// src/lab/beaker.js
// ==============================================
// DSRT Lab Beaker Simulation
// ==============================================

import { context } from '../core/canvas.js';
import { drawRoundedRect } from '../graphics/draw.js';

export class Beaker {
  constructor(x, y, width, height, fillColor = '#66ccff', level = 0.5) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.level = level;
  }

  setLevel(lvl) {
    this.level = Math.max(0, Math.min(1, lvl));
  }

  draw() {
    // Glass outline
    drawRoundedRect(this.x, this.y, this.width, this.height, 8, 2, '#aaa', 'rgba(255,255,255,0.2)');

    // Liquid
    const fillHeight = this.height * this.level;
    context.fillStyle = this.fillColor;
    context.fillRect(this.x, this.y + this.height - fillHeight, this.width, fillHeight);
  }
}
