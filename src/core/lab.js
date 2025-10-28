// src/core/lab.js

// ============================================================
// DSRT ENGINE LAB MODULE
// Laboratory visualization: tubes, thermometers, burners, liquids
// ============================================================

var DSRT = DSRT || {};

DSRT.Lab = (function () {

  const ctx = () => DSRT.Core.getContext();

  // ========== TEST TUBE ==========
  function testTube(x, y, w = 60, h = 200, liquidLevel = 0.6, color = "#00bfff", border = "#000") {
    const c = ctx();
    const r = w / 2;

    // Tube body
    c.save();
    c.beginPath();
    c.moveTo(x - r, y - h);
    c.lineTo(x - r, y);
    c.arc(x, y, r, Math.PI, 0, false);
    c.lineTo(x + r, y - h);
    c.strokeStyle = border;
    c.lineWidth = 2;
    c.stroke();

    // Liquid
    const liquidHeight = h * liquidLevel;
    const liquidY = y - liquidHeight;
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(x - r + 2, liquidY);
    c.lineTo(x - r + 2, y - 2);
    c.arc(x, y - 2, r - 2, Math.PI, 0, false);
    c.lineTo(x + r - 2, liquidY);
    c.closePath();
    c.fill();

    // Meniscus effect (top of liquid)
    c.beginPath();
    c.ellipse(x, liquidY, r - 4, 5, 0, 0, Math.PI * 2);
    c.fillStyle = `rgba(255,255,255,0.3)`;
    c.fill();
    c.restore();
  }

  // ========== THERMOMETER ==========
  function thermometer(x, y, h = 200, temp = 25, minTemp = 0, maxTemp = 100) {
    const c = ctx();
    const bulbR = 15;
    const tubeW = 10;
    const tubeH = h - bulbR * 2;
    const range = maxTemp - minTemp;
    const normalized = (temp - minTemp) / range;
    const mercuryHeight = tubeH * normalized;

    // Tube outline
    c.save();
    c.lineWidth = 2;
    c.strokeStyle = "#000";
    c.beginPath();
    c.moveTo(x, y - h);
    c.lineTo(x, y - bulbR);
    c.stroke();

    // Bulb
    c.beginPath();
    c.arc(x, y, bulbR, 0, Math.PI * 2);
    c.stroke();

    // Mercury fill
    c.fillStyle = "#ff3333";
    c.beginPath();
    c.arc(x, y, bulbR - 3, 0, Math.PI * 2);
    c.fill();

    c.beginPath();
    c.fillRect(x - tubeW / 2 + 1, y - bulbR - mercuryHeight, tubeW - 2, mercuryHeight);
    c.fill();

    // Temp text
    DSRT.Core.text(`${Math.round(temp)}°C`, x + 30, y - h / 2, "12pt Calibri", "#000", "left");
    c.restore();
  }

  // ========== BURNER ==========
  function burner(x, y, size = 40, flame = true) {
    const c = ctx();
    const baseH = 60;

    // Base
    c.save();
    c.fillStyle = "#444";
    c.beginPath();
    c.moveTo(x - size / 2, y);
    c.lineTo(x + size / 2, y);
    c.lineTo(x + size / 3, y + baseH);
    c.lineTo(x - size / 3, y + baseH);
    c.closePath();
    c.fill();

    // Flame
    if (flame) {
      const flameH = 50 + Math.random() * 10;
      const flameColor = ["#ff6600", "#ffaa00", "#ffee00"][Math.floor(Math.random() * 3)];
      c.beginPath();
      c.moveTo(x, y - 10);
      c.quadraticCurveTo(x - 10, y - flameH / 2, x, y - flameH);
      c.quadraticCurveTo(x + 10, y - flameH / 2, x, y - 10);
      c.closePath();
      c.fillStyle = flameColor;
      c.fill();
    }

    c.restore();
  }

  // ========== LIQUID FILL ANIMATION ==========
  function fillLiquid(current, target, speed = 0.01) {
    if (Math.abs(current - target) < speed) return target;
    return current + (target - current) * speed;
  }

  // ========== HEAT COLOR EFFECT ==========
  function heatColor(temp, minT = 20, maxT = 100) {
    const ratio = Math.min(1, Math.max(0, (temp - minT) / (maxT - minT)));
    const r = Math.round(255 * ratio);
    const g = Math.round(255 * (1 - ratio));
    const b = Math.round(100 * (1 - ratio));
    return `rgb(${r},${g},${b})`;
  }

  // ========== LAB SCENE COMPOSER ==========
  function labScene(x, y, level = 0.6, temp = 25) {
    // Example lab scene
    testTube(x, y, 60, 200, level, heatColor(temp));
    thermometer(x + 120, y, 200, temp);
    burner(x, y + 100, 40, temp > 40);
  }

  // ========== BEAKER ==========
  function beaker(x, y, w = 120, h = 160, level = 0.5, color = "#66ccff") {
    const c = ctx();
    const r = 15;

    c.save();
    // Outline
    c.beginPath();
    c.moveTo(x - w / 2, y - h);
    c.lineTo(x - w / 2, y);
    c.arc(x, y, w / 2, Math.PI, 0, false);
    c.lineTo(x + w / 2, y - h);
    c.strokeStyle = "#000";
    c.lineWidth = 2;
    c.stroke();

    // Liquid
    const liquidY = y - (h - r) * level;
    c.beginPath();
    c.rect(x - w / 2 + 3, liquidY, w - 6, y - liquidY);
    c.fillStyle = color;
    c.fill();

    // Meniscus
    c.beginPath();
    c.ellipse(x, liquidY, w / 2 - 6, 5, 0, 0, Math.PI * 2);
    c.fillStyle = "rgba(255,255,255,0.3)";
    c.fill();
    c.restore();
  }

  // ========== GAS BUBBLES IN LIQUID ==========
  function bubbleEffect(x, y, w, h, count = 5, color = "#b3ecff") {
    for (let i = 0; i < count; i++) {
      const bx = x + (Math.random() - 0.5) * w;
      const by = y - Math.random() * h;
      DSRT.Core.circle(bx, by, 2 + Math.random() * 3, 1, "#000", color);
    }
  }

  return {
    testTube,
    thermometer,
    burner,
    fillLiquid,
    heatColor,
    labScene,
    beaker,
    bubbleEffect
  };

})();
