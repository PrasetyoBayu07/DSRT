// src/lab/thermometer.js
// ==============================================
// DSRT Thermometer Visualization
// ==============================================

import { context } from "../core/canvas.js";
import { drawRoundedRect, drawCircle, drawText } from "../graphics/draw.js";

export class Thermometer {
  constructor(x, y, height = 200, temp = 20, color = "red") {
    this.x = x;
    this.y = y;
    this.height = height;
    this.temp = temp;
    this.color = color;

    // [NEW] tambahan properti
    this.targetTemp = temp;
    this.minTemp = 0;
    this.maxTemp = 100;
    this.glassGlow = 0;
    this.label = "Thermo";
  }

  setTemp(temp) {
    this.temp = Math.max(this.minTemp, Math.min(this.maxTemp, temp));
  }

  // [NEW] target suhu untuk animasi (smooth)
  setTargetTemp(temp) {
    this.targetTemp = Math.max(this.minTemp, Math.min(this.maxTemp, temp));
  }

  // [NEW] update animasi naik/turun suhu
  update() {
    this.temp += (this.targetTemp - this.temp) * 0.05;
    this.glassGlow = Math.min(1, Math.abs(this.temp - 25) / 80); // efek pijar
  }

  // [NEW] warna dinamis sesuai suhu
  getDynamicColor() {
    const t = this.temp;
    if (t < 10) return "#33aaff"; // dingin
    if (t < 40) return "#55dd55"; // hangat
    if (t < 70) return "#ffaa33"; // panas
    return "#ff3333"; // sangat panas
  }

  draw() {
    // panggil update untuk animasi suhu
    this.update();

    const filledHeight = (this.temp / this.maxTemp) * this.height;
    const thermoColor = this.getDynamicColor();

    // [NEW] efek pijar kaca termometer
    const grad = context.createLinearGradient(this.x, this.y, this.x + 20, this.y + this.height);
    grad.addColorStop(0, "rgba(255,255,255,0.3)");
    grad.addColorStop(1, `rgba(255,255,255,${0.1 + this.glassGlow * 0.3})`);

    // badan termometer
    drawRoundedRect(this.x, this.y, 20, this.height, 10, 2, "#aaa", grad);

    // cairan suhu
    context.fillStyle = thermoColor;
    context.fillRect(this.x, this.y + this.height - filledHeight, 20, filledHeight);

    // bola bawah termometer
    drawCircle(this.x + 10, this.y + this.height + 10, 15, "#aaa", thermoColor);

    // [NEW] indikator zona suhu
    context.font = "11px sans-serif";
    context.fillStyle = "#999";
    context.fillText("0°", this.x + 25, this.y + this.height);
    context.fillText("50°", this.x + 25, this.y + this.height / 2);
    context.fillText("100°", this.x + 25, this.y);

    // [NEW] label dan nilai suhu
    drawText(
      `${Math.round(this.temp)}°C`,
      this.x + 10,
      this.y - 10,
      "bold 14pt Calibri",
      "#000",
      "center"
    );

    // [NEW] label nama termometer
    drawText(this.label, this.x + 10, this.y + this.height + 40, "10pt Calibri", "#444", "center");
  }
}
