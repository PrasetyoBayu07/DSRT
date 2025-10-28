// src/lab/thermometer.js
// ==============================================
// DSRT Thermometer Visualization
// ==============================================

import { context } from '../core/canvas.js';
import { drawRoundedRect, drawCircle, drawText } from '../graphics/draw.js';

export class Thermometer {
  constructor(x, y, height = 200, temp = 20, color = 'red') {
    this.x = x;
    this.y = y;
    this.height = height;
    this.temp = temp;
    this.color = color;
  }

  setTemp(temp) {
    this.temp = Math.max(0, Math.min(100, temp));
  }

  draw() {
    const filledHeight = (this.temp / 100) * this.height;
    drawRoundedRect(this.x, this.y, 20, this.height, 10, 2, '#aaa', '#fff');
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y + this.height - filledHeight, 20, filledHeight);
    drawCircle(this.x + 10, this.y + this.height + 10, 15, '#aaa', this.color);
    drawText(`${this.temp}°C`, this.x + 10, this.y - 10, 'bold 14pt Calibri', '#000', 'center');
  }
}
