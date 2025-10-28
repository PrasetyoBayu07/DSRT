// src/physics/mechanics.js
// ==============================================
// DSRT Simple Mechanics (Gears, Springs, Rods)
// ==============================================

import { context } from '../core/canvas.js';
import { drawCircle, drawLine } from '../graphics/draw.js';

export class Gear {
  constructor(x, y, radius = 40, teeth = 12, speed = 0.01, color = '#888') {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.teeth = teeth;
    this.angle = 0;
    this.speed = speed;
    this.color = color;
  }

  update() {
    this.angle += this.speed;
  }

  draw() {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.strokeStyle = this.color;
    context.lineWidth = 2;
    drawCircle(0, 0, this.radius, this.color, 'transparent', 2);

    for (let i = 0; i < this.teeth; i++) {
      const angle = (i / this.teeth) * 2 * Math.PI;
      const x1 = Math.cos(angle) * this.radius;
      const y1 = Math.sin(angle) * this.radius;
      const x2 = Math.cos(angle) * (this.radius + 8);
      const y2 = Math.sin(angle) * (this.radius + 8);
      drawLine(x1, y1, x2, y2, 2, this.color);
    }
    context.restore();
  }
}

export class Spring {
  constructor(x1, y1, x2, y2, coils = 10, color = '#555') {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.coils = coils;
    this.color = color;
  }

  draw() {
    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const step = dist / (this.coils * 2);

    context.save();
    context.translate(this.x1, this.y1);
    context.rotate(angle);
    context.beginPath();
    context.moveTo(0, 0);
    for (let i = 0; i < this.coils * 2; i++) {
      const dir = i % 2 === 0 ? 1 : -1;
      context.lineTo((i + 1) * step, dir * 5);
    }
    context.strokeStyle = this.color;
    context.lineWidth = 2;
    context.stroke();
    context.restore();
  }
}

export class Rod {
  constructor(x1, y1, x2, y2, color = '#000') {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
  }

  draw() {
    drawLine(this.x1, this.y1, this.x2, this.y2, 3, this.color);
  }
}
