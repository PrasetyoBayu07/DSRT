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

    // [NEW] tambahan efek dan status reaksi
    this.temperature = 25; // suhu awal (°C)
    this.isBoiling = false;
    this.bubbles = []; // partikel gelembung
    this.reactionColor = null;
  }

  setLevel(lvl) {
    this.level = Math.max(0, Math.min(1, lvl));
  }

  // [NEW] ubah suhu cairan
  setTemperature(temp) {
    this.temperature = temp;
    this.isBoiling = temp >= 100;
  }

  // [NEW] ubah warna cairan saat reaksi
  setReactionColor(color) {
    this.reactionColor = color;
  }

  // [NEW] efek gelembung saat mendidih
  updateBubbles() {
    if (!this.isBoiling) return;

    // tambahkan gelembung baru
    if (Math.random() < 0.3) {
      this.bubbles.push({
        x: this.x + Math.random() * this.width,
        y: this.y + this.height - (this.height * this.level),
        radius: 2 + Math.random() * 3,
        speed: 0.5 + Math.random() * 1.5
      });
    }

    // update posisi gelembung
    this.bubbles.forEach(b => (b.y -= b.speed));
    // hapus yang keluar
    this.bubbles = this.bubbles.filter(b => b.y > this.y);
  }

  draw() {
    // Glass outline
    drawRoundedRect(this.x, this.y, this.width, this.height, 8, 2, '#aaa', 'rgba(255,255,255,0.2)');

    // Liquid
    const fillHeight = this.height * this.level;
    context.fillStyle = this.reactionColor || this.fillColor;
    context.fillRect(this.x, this.y + this.height - fillHeight, this.width, fillHeight);

    // [NEW] efek suhu: pantulan warna hangat/dingin
    if (this.temperature > 40) {
      const heatAlpha = Math.min((this.temperature - 40) / 60, 1) * 0.3;
      context.fillStyle = `rgba(255,100,0,${heatAlpha})`;
      context.fillRect(this.x, this.y + this.height - fillHeight, this.width, fillHeight);
    }

    // [NEW] gelembung saat mendidih
    this.updateBubbles();
    context.fillStyle = 'rgba(255,255,255,0.7)';
    this.bubbles.forEach(b => {
      context.beginPath();
      context.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      context.fill();
    });

    // [NEW] tampilkan suhu teks kecil
    context.font = '12px sans-serif';
    context.fillStyle = '#ccc';
    context.fillText(`${Math.round(this.temperature)}°C`, this.x + this.width / 2 - 10, this.y - 5);
  }
                                   }
