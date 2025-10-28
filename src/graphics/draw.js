// src/graphics/draw.js
// ==============================================
// DSRT Drawing Core
// ==============================================

import { context } from '../core/canvas.js';

/**
 * Draws a simple filled rectangle with an optional stroke.
 */
export function drawRect(x, y, w, h, lineWidth = 1, stroke = '#000', fill = '#fff') {
  context.beginPath();
  context.lineWidth = lineWidth;
  context.strokeStyle = stroke;
  context.fillStyle = fill;
  context.rect(x, y, w, h);
  context.fill();
  context.stroke();
  context.closePath();
}

/**
 * Draws a rounded rectangle.
 */
export function drawRoundedRect(x, y, w, h, r = 4, lineWidth = 1, stroke = '#000', fill = '#fff') {
  context.beginPath();
  context.lineWidth = lineWidth;
  context.strokeStyle = stroke;
  context.fillStyle = fill;

  context.moveTo(x + r, y);
  context.lineTo(x + w - r, y);
  context.quadraticCurveTo(x + w, y, x + w, y + r);
  context.lineTo(x + w, y + h - r);
  context.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  context.lineTo(x + r, y + h);
  context.quadraticCurveTo(x, y + h, x, y + h - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);

  context.fill();
  context.stroke();
  context.closePath();
}

/**
 * Draws a straight line between two points.
 */
export function drawLine(x1, y1, x2, y2, width = 1, color = '#000') {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = width;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

/**
 * Draws a circle or ellipse.
 */
export function drawCircle(x, y, radius, stroke = '#000', fill = '#fff', lineWidth = 1) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = fill;
  context.fill();
  context.lineWidth = lineWidth;
  context.strokeStyle = stroke;
  context.stroke();
  context.closePath();
}

/**
 * Draws an arrow between two points.
 */
export function drawArrow(x1, y1, x2, y2, width = 1, color = '#000') {
  const headLength = 10;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);
  drawLine(x1, y1, x2, y2, width, color);
  context.beginPath();
  context.moveTo(x2, y2);
  context.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
  context.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
  context.lineTo(x2, y2);
  context.strokeStyle = color;
  context.stroke();
  context.closePath();
}

/**
 * Draws an image.
 */
export function drawImage(src, x, y, w = null, h = null) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    if (w && h) context.drawImage(img, x, y, w, h);
    else context.drawImage(img, x, y);
  };
}

/**
 * Draws text.
 */
export function drawText(txt, x, y, font = '12pt Calibri', color = '#000', align = 'center') {
  context.font = font;
  context.fillStyle = color;
  context.textAlign = align;
  context.fillText(txt, x, y);
}
