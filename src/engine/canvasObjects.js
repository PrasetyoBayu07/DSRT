"use strict";

/**
 * CanvasEngine Objects Module
 * ---------------------------
 * Visual lab objects: gears, wheels, beakers, thermometers, burners, etc.
 * Functionally identical to your original code.
 */

import { ctx } from "./canvasCore.js";
import { distance, angleBetween } from "./canvasPhysics.js";

//===========================//
//           Gear            //
//===========================//

/**
 * Draw a rotating gear.
 */
export function gear(x, y, radius = 40, teeth = 12, angle = 0, color = "#888") {
  const step = (2 * Math.PI) / teeth;
  const inner = radius * 0.7;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  for (let i = 0; i < teeth; i++) {
    const outerAngle = i * step;
    const innerAngle = outerAngle + step / 2;
    ctx.lineTo(Math.cos(outerAngle) * radius, Math.sin(outerAngle) * radius);
    ctx.lineTo(Math.cos(innerAngle) * inner, Math.sin(innerAngle) * inner);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "#444";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, inner * 0.5, 0, 2 * Math.PI);
  ctx.fillStyle = "#222";
  ctx.fill();
  ctx.restore();
}

//===========================//
//           Wheel           //
//===========================//

/**
 * Draw a wheel with spokes.
 */
export function wheel(x, y, radius = 40, spokes = 8, angle = 0, color = "#666") {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "#222";
  ctx.stroke();
  for (let i = 0; i < spokes; i++) {
    const a = (i * 2 * Math.PI) / spokes;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
    ctx.stroke();
  }
  ctx.restore();
}

//===========================//
//          Beaker           //
//===========================//

/**
 * Draw a chemistry beaker (tabung).
 */
export function beaker(x, y, w, h, fillLevel = 0.5, fillColor = "#33aaff") {
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w, y);
  ctx.stroke();

  const liquidHeight = h * fillLevel;
  ctx.fillStyle = fillColor;
  ctx.fillRect(x + 2, y + h - liquidHeight, w - 4, liquidHeight);
}

/**
 * Draw a thermometer.
 */
export function thermometer(x, y, w = 20, h = 120, temp = 0.5, color = "#ff4444") {
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.stroke();
  ctx.fillStyle = "#ccc";
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

  const mercuryHeight = (h - 8) * temp;
  ctx.fillStyle = color;
  ctx.fillRect(x + 2, y + h - 4 - mercuryHeight, w - 4, mercuryHeight);
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h + w / 2, w / 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

/**
 * Draw a Bunsen burner flame.
 */
export function burner(x, y, flame = 1, baseColor = "#888", flameColor = "rgba(255,140,0,0.8)") {
  // base
  ctx.fillStyle = baseColor;
  ctx.fillRect(x - 10, y, 20, 40);
  ctx.strokeStyle = "#333";
  ctx.strokeRect(x - 10, y, 20, 40);

  // flame
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x - 10, y - 20 * flame, x, y - 40 * flame);
  ctx.quadraticCurveTo(x + 10, y - 20 * flame, x, y);
  const grd = ctx.createRadialGradient(x, y - 30 * flame, 5, x, y - 30 * flame, 30);
  grd.addColorStop(0, flameColor);
  grd.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grd;
  ctx.fill();
}

//===========================//
//           Hook            //
//===========================//

/**
 * Draw a hanging hook.
 */
export function hook(x, y, r = 5, loops = 5, color = "#333") {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < loops; i++) {
    ctx.arc(x, y + i * (r * 2), r, 0, Math.PI, true);
  }
  ctx.stroke();
}

//===========================//
//           Grid            //
//===========================//

/**
 * Draw a vertical grid for scale or measurement visualization.
 */
export function verticalGrid(x, y, h, step = 20, color = "#bbb") {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let i = 0; i <= h; i += step) {
    ctx.beginPath();
    ctx.moveTo(x - 5, y + i);
    ctx.lineTo(x + 5, y + i);
    ctx.stroke();
  }
}
