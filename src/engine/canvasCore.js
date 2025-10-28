"use strict";

/**
 * CanvasEngine Core Module
 * ------------------------
 * Provides initialization and core drawing utilities for 2D rendering.
 * This file is a direct modular translation of your original base engine.
 * Nothing is removed — only converted to English and modern syntax.
 */

let canvas = null;
let ctx = null;
let bgColor = "#ffffff";

//===========================//
//   Canvas Initialization   //
//===========================//

/**
 * Initialize the canvas context.
 * @param {string} id - The HTML canvas element ID.
 * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}}
 */
export function initCanvas(id) {
  canvas = document.getElementById(id);
  if (!canvas) throw new Error(`Canvas with ID "${id}" not found.`);
  ctx = canvas.getContext("2d");
  return { canvas, ctx };
}

/**
 * Clear the entire screen with a color.
 * Optionally run a function repeatedly if 'run' mode is enabled.
 */
let funcDB = [];
export function clearScreen(color = bgColor, opt = {}) {
  bgColor = color;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (opt.status === "run" && typeof opt.func === "function") {
    funcDB.push(opt.func);
  }
  if (opt.status === "clear") {
    funcDB = [];
  }
  if (funcDB.length > 0) requestAnimationFrame(() => funcDB[0]());
}

//===========================//
//   Basic Drawing Functions //
//===========================//

export function drawText(txt, x, y, font = "bold 16pt Calibri", color = "#2f2f2f", align = "center") {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(txt, x, y);
}

export function drawLine(x1, y1, x2, y2, width = 1, color = "#000", style = "") {
  if (style.includes("dash")) {
    const dashArr = style.split("-").slice(1).map(Number);
    ctx.setLineDash(dashArr.length ? dashArr : [5, 3]);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function drawBox(x, y, w, h, width = 1, stroke = "#000", fill = "#fff", style = "") {
  if (style.includes("dash")) {
    const dashArr = style.split("-").slice(1).map(Number);
    ctx.setLineDash(dashArr.length ? dashArr : [5, 3]);
  }
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  if (fill !== "none") {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke !== "none") {
    ctx.lineWidth = width;
    ctx.strokeStyle = stroke;
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

export function drawRoundedBox(x, y, w, h, radius = 5, width = 1, stroke = "#000", fill = "#fff") {
  const r = { tl: radius, tr: radius, br: radius, bl: radius };
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
  if (fill !== "none") {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke !== "none") {
    ctx.lineWidth = width;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

export function drawCircle(x, y, r, width = 1, stroke = "#000", fill = "#fff", style = "") {
  if (style.includes("dash")) {
    const dashArr = style.split("-").slice(1).map(Number);
    ctx.setLineDash(dashArr.length ? dashArr : [5, 3]);
  }
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  if (fill !== "none") {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke !== "none") {
    ctx.lineWidth = width;
    ctx.strokeStyle = stroke;
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

/**
 * Draw image (with optional rotation & offset).
 */
export function drawImage(img, x = 0, y = 0, opt = {}) {
  let px = x + (opt.x || 0);
  let py = y + (opt.y || 0);
  if (opt.r !== undefined) {
    if (opt.r === 0) {
      ctx.drawImage(img, px, py);
    } else {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((opt.r * Math.PI) / 180);
      ctx.translate(-x, -y);
      ctx.drawImage(img, px, py);
      ctx.restore();
    }
  } else {
    ctx.drawImage(img, px, py);
  }
}

/**
 * Draw arrow line.
 */
export function drawArrow(x, y, p, t, scale, width, color) {
  const theta = Math.atan2(t, p);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + scale * p, y - scale * t);
  ctx.stroke();
  ctx.lineWidth = 2;
  const d = Math.min(Math.sqrt(p * p + t * t), 5);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(
    x + scale * p - 3 * d * Math.cos(theta + 0.25 * Math.PI / 2),
    y - scale * t + 3 * d * Math.sin(theta + 0.25 * Math.PI / 2)
  );
  ctx.lineTo(x + scale * p, y - scale * t);
  ctx.lineTo(
    x + scale * p - 3 * d * Math.cos(theta - 0.25 * Math.PI / 2),
    y - scale * t + 3 * d * Math.sin(theta - 0.25 * Math.PI / 2)
  );
  ctx.stroke();
  ctx.fill();
}

/**
 * Draw an image to fill the entire canvas (fullscreen).
 * Automatically scales while maintaining aspect ratio.
 */
export function drawImageFull(img, mode = "cover") {
  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = img.width / img.height;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (mode === "cover") {
    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }
  } else {
    if (canvasRatio < imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

/**
 * Fill the canvas with a repeating pattern image.
 * Ideal for seamless textures like leather, fabric, or tiles.
 */
export function drawPattern(img, offsetX = 0, offsetY = 0) {
  const pattern = ctx.createPattern(img, "repeat");
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.fillStyle = pattern;
  ctx.fillRect(-offsetX, -offsetY, canvas.width, canvas.height);
  ctx.restore();
}
//===========================//
//  Canvas Resize Utilities  //
//===========================//

export function resizeCanvasToWindow(keepAspect = true) {
  if (!canvas || !ctx) return;

  const aspect = canvas.width / canvas.height;
  const pixelRatio = window.devicePixelRatio || 1;
  let newWidth = window.innerWidth;
  let newHeight = window.innerHeight;

  if (keepAspect) {
    const windowRatio = newWidth / newHeight;
    if (windowRatio > aspect) {
      newWidth = newHeight * aspect;
    } else {
      newHeight = newWidth / aspect;
    }
  }

  canvas.style.width = `${newWidth}px`;
  canvas.style.height = `${newHeight}px`;
  canvas.width = newWidth * pixelRatio;
  canvas.height = newHeight * pixelRatio;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

export function enableAutoResize(keepAspect = true) {
  resizeCanvasToWindow(keepAspect);
  window.addEventListener("resize", () => resizeCanvasToWindow(keepAspect));
}

//===========================//
//     Color Conversions     //
//===========================//

export function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255)
    throw new Error("Invalid RGB component value");
  return ((r << 16) | (g << 8) | b).toString(16);
}

export function hexToRGBA(hex, alpha) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    c = "0x" + c.join("");
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",")},${alpha})`;
  }
  throw new Error("Invalid hex color code.");
}

export function getPixel(x, y) {
  const p = ctx.getImageData(x, y, 1, 1).data;
  const hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
  return hex;
}

export { canvas, ctx };
