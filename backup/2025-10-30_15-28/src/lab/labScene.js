// src/lab/labScene.js
// ==============================================
// DSRT Lab Integrated Simulation Scene
// ==============================================

import { context, clearCanvas } from "../core/canvas.js";
import { Beaker } from "./beaker.js";
import { Burner } from "./burner.js";
import { Thermometer } from "./thermometer.js";

export class LabScene {
  constructor() {
    // posisi komponen utama
    this.burner = new Burner(150, 300);
    this.beaker = new Beaker(130, 120, 60, 180, "#66ccff", 0.6);
    this.thermometer = new Thermometer(250, 100, 180, 25);
    this.thermometer.label = "DSRT Lab Thermometer";

    this.mouse = { x: 0, y: 0, down: false };

    // [NEW] hubungan suhu antar objek
    this.heatTransferRate = 0.03; // seberapa cepat beaker menerima panas
    this.coolRate = 0.01; // pendinginan alami

    // Event listener
    this.initEvents();

    // mulai animasi
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initEvents() {
    const canvas = context.canvas;

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.burner.checkHover(this.mouse.x, this.mouse.y);
    });

    canvas.addEventListener("mousedown", () => {
      this.mouse.down = true;
      if (this.burner.hovered) this.burner.toggle();
    });

    canvas.addEventListener("mouseup", () => {
      this.mouse.down = false;
    });
  }

  updatePhysics() {
    // update burner
    this.burner.update();

    // suhu dari burner diteruskan ke beaker
    const burnerTemp = this.burner.getTemperature();
    if (this.burner.active) {
      this.beaker.setTemperature(
        this.beaker.temperature + (burnerTemp - this.beaker.temperature) * this.heatTransferRate
      );
    } else {
      // pendinginan alami beaker
      this.beaker.setTemperature(this.beaker.temperature - this.coolRate * this.beaker.temperature);
    }

    // update thermometer sesuai beaker
    this.thermometer.setTargetTemp(this.beaker.temperature);
  }

  drawUI() {
    // [NEW] teks bantuan
    context.font = "13px monospace";
    context.fillStyle = "#eee";
    context.fillText("🧪 DSRT Lab Simulation", 20, 25);
    context.fillText("Klik burner untuk hidup/mati 🔥", 20, 45);
  }

  animate() {
    clearCanvas();

    this.updatePhysics();

    // gambar semua objek
    this.burner.draw();
    this.beaker.draw();
    this.thermometer.draw();

    this.drawUI();

    requestAnimationFrame(this.animate);
  }
}

// ==============================================
// Inisialisasi otomatis saat modul diimpor
// ==============================================

let labInstance = null;
export function startLab() {
  if (!labInstance) labInstance = new LabScene();
  return labInstance;
}
