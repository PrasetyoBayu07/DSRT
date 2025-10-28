"use strict";

/**
 * CanvasEngine Physics Module
 * ---------------------------
 * Geometry, distance, spring, and helper functions.
 * This preserves the full behavior of your original implementation.
 */

import { ctx } from "./canvasCore.js";

//===========================//
//     Geometry Helpers      //
//===========================//

/**
 * Calculate distance between two points.
 */
export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate distance between two objects with x/y properties.
 */
export function distanceBetween(obj1, obj2) {
  return distance(obj1.x, obj1.y, obj2.x, obj2.y);
}

/**
 * Calculate angle between two points (radians).
 */
export function angleBetween(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * Constrain an object to a maximum radius from a center.
 */
export function limitRadius(centerX, centerY, obj, radius) {
  const d = distance(centerX, centerY, obj.x, obj.y);
  if (d > radius) {
    const a = angleBetween(centerX, centerY, obj.x, obj.y);
    obj.x = centerX + radius * Math.cos(a);
    obj.y = centerY + radius * Math.sin(a);
  }
}

/**
 * Calculate angle in degrees.
 */
export function angleDeg(x1, y1, x2, y2) {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
}

/**
 * Hook / spring between two points.
 */
export function spring(x1, y1, x2, y2, stiffness = 0.1, length = 50) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const force = (dist - length) * stiffness;
  const fx = (dx / dist) * force;
  const fy = (dy / dist) * force;
  return { fx, fy };
}

/**
 * Draw a spring line between two points.
 */
export function drawSpring(x1, y1, x2, y2, width = 1, color = "#444") {
  const coils = 6;
  const amp = 5;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const step = dist / (coils * 2);
  const ang = Math.atan2(dy, dx);
  ctx.moveTo(x1, y1);
  for (let i = 0; i <= coils * 2; i++) {
    const dir = i % 2 === 0 ? 1 : -1;
    const px = x1 + i * step * Math.cos(ang) + dir * amp * Math.sin(ang);
    const py = y1 + i * step * Math.sin(ang) - dir * amp * Math.cos(ang);
    ctx.lineTo(px, py);
  }
  ctx.stroke();
}

/**
 * Draw hook or connector.
 */
export function hook(x, y, r, n, color = "#000") {
  ctx.beginPath();
  ctx.strokeStyle = color;
  for (let i = 0; i < n; i++) {
    ctx.arc(x, y + i * (r * 2), r, 0, Math.PI, true);
  }
  ctx.stroke();
}

/**
 * Draw grid lines for alignment or background.
 */
export function drawGrid(step = 50, color = "#e0e0e0") {
  const { canvas } = ctx;
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  for (let x = 0; x < canvas.width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}
