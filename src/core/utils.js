// src/core/utils.js

// ============================================================
// DSRT ENGINE UTILS MODULE
// Math, color, random, and helper functions
// ============================================================

var DSRT = DSRT || {};

DSRT.Utils = (function () {

  // ========== MATH HELPERS ==========

  // Convert degrees to radians
  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  // Convert radians to degrees
  function radToDeg(rad) {
    return rad * (180 / Math.PI);
  }

  // Clamp a value between min and max
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  // Linear interpolation
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Distance between two points
  function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Random number between min and max
  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Random integer
  function randomInt(min, max) {
    return Math.floor(random(min, max));
  }

  // Check collision between two circles
  function circleCollision(x1, y1, r1, x2, y2, r2) {
    return distance(x1, y1, x2, y2) < (r1 + r2);
  }

  // ========== COLOR UTILITIES ==========

  // Convert RGB to HEX
  function rgbToHex(r, g, b) {
    const toHex = v => {
      const h = v.toString(16);
      return h.length === 1 ? "0" + h : h;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
  }

  // Convert HEX to RGBA
  function hexToRGBA(hex, alpha = 1) {
    const c = hex.replace("#", "");
    const bigint = parseInt(c, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // Lighten a color
  function lighten(hex, percent) {
    const c = hex.replace("#", "");
    const num = parseInt(c, 16);
    let r = (num >> 16) + Math.round(2.55 * percent);
    let g = ((num >> 8) & 0x00FF) + Math.round(2.55 * percent);
    let b = (num & 0x0000FF) + Math.round(2.55 * percent);
    r = (r < 255 ? r : 255);
    g = (g < 255 ? g : 255);
    b = (b < 255 ? b : 255);
    return rgbToHex(r, g, b);
  }

  // Darken a color
  function darken(hex, percent) {
    return lighten(hex, -percent);
  }

  // Random color
  function randomColor() {
    const r = randomInt(0, 255);
    const g = randomInt(0, 255);
    const b = randomInt(0, 255);
    return rgbToHex(r, g, b);
  }

  // ========== GEOMETRY HELPERS ==========

  // Map a value from one range to another
  function map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  // Check if a point is inside a rectangle
  function pointInRect(px, py, x, y, w, h) {
    return px > x && px < x + w && py > y && py < y + h;
  }

  // Angle between two points
  function angleBetween(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  }

  // ========== PHYSICS-LIKE HELPERS ==========

  // Apply gravity to velocity
  function applyGravity(vy, gravity = 0.5, limit = 10) {
    vy += gravity;
    return Math.min(vy, limit);
  }

  // Bounce off boundaries
  function bounce(value, min, max, speed) {
    if (value < min || value > max) speed *= -1;
    return { value: clamp(value, min, max), speed };
  }

  // ========== PIXEL COLOR SAMPLER ==========
  function getPixelColor(ctx, x, y) {
    const data = ctx.getImageData(x, y, 1, 1).data;
    return `rgba(${data[0]},${data[1]},${data[2]},${data[3] / 255})`;
  }

  // ========== EXPORT ==========
  return {
    degToRad,
    radToDeg,
    clamp,
    lerp,
    distance,
    random,
    randomInt,
    circleCollision,
    rgbToHex,
    hexToRGBA,
    lighten,
    darken,
    randomColor,
    map,
    pointInRect,
    angleBetween,
    applyGravity,
    bounce,
    getPixelColor
  };

})();
