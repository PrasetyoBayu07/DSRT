// src/lab/burner.js
// ==============================================
// DSRT Bunsen Burner Simulation
// ==============================================

import { context } from "../core/canvas.js";
import { ParticleSystem } from "../physics/particles.js";
import { drawRoundedRect } from "../graphics/draw.js";

export class Burner {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.active = true;
    this.particles = new ParticleSystem(x + 10, y - 10, "orange", 5);

    // [NEW] tambahan properti
    this.heatOutput = 0.0; // 0–1
    this.maxHeat = 300; // suhu maksimum yang bisa diberikan (°C)
    this.glow = 0; // efek pijar logam
    this.hovered = false; // untuk interaksi mouse
  }

  toggle() {
    this.active = !this.active;
  }

  // [NEW] set tingkat panas manual
  setHeat(level) {
    this.heatOutput = Math.max(0, Math.min(1, level));
  }

  // [NEW] kembalikan suhu panas aktual dalam °C
  getTemperature() {
    return this.heatOutput * this.maxHeat;
  }

  // [NEW] update efek nyala api dan pijaran
  update() {
    if (!this.active) {
      this.heatOutput = Math.max(0, this.heatOutput - 0.01);
    } else {
      this.heatOutput = Math.min(1, this.heatOutput + 0.02);
    }

    this.glow = this.heatOutput * 0.8;
    this.particles.intensity = this.heatOutput * 10;
  }

  // [NEW] deteksi apakah kursor berada di area burner (untuk UI interaktif)
  checkHover(mx, my) {
    this.hovered = mx >= this.x && mx <= this.x + 20 && my >= this.y && my <= this.y + 50;
  }

  draw() {
    // Burner body
    const bodyColor = this.hovered ? "#777" : "#555";
    drawRoundedRect(this.x, this.y, 20, 50, 4, 2, bodyColor, "#999");

    // [NEW] efek pijar merah di bagian atas
    if (this.glow > 0.1) {
      const grad = context.createRadialGradient(this.x + 10, this.y, 5, this.x + 10, this.y, 20);
      grad.addColorStop(0, `rgba(255,80,0,${this.glow})`);
      grad.addColorStop(1, "rgba(255,80,0,0)");
      context.fillStyle = grad;
      context.beginPath();
      context.arc(this.x + 10, this.y, 15, 0, Math.PI * 2);
      context.fill();
    }

    // Flame
    if (this.active || this.heatOutput > 0.1) {
      this.particles.x = this.x + 10;
      this.particles.y = this.y;
      this.particles.update();
      this.particles.draw();
    }

    // [NEW] tampilkan indikator suhu di atas burner
    const temp = Math.round(this.getTemperature());
    context.font = "12px sans-serif";
    context.fillStyle = "#ffb";
    context.fillText(`${temp}°C`, this.x - 5, this.y - 10);
  }
}
