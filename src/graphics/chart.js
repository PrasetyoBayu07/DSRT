// src/graphics/chart.js
// ==============================================
// DSRT Cartesian Chart Renderer
// ==============================================

import { context } from '../core/canvas.js';
import { drawLine, drawText } from './draw.js';

/**
 * Draws a simple Cartesian coordinate grid.
 */
export function drawGrid(x, y, width, height, step = 20, color = '#ccc') {
  context.beginPath();
  context.strokeStyle = color;
  for (let i = 0; i <= width; i += step) {
    drawLine(x + i, y, x + i, y + height, 1, color);
  }
  for (let j = 0; j <= height; j += step) {
    drawLine(x, y + j, x + width, y + j, 1, color);
  }
  context.closePath();
}

/**
 * Draws X and Y axes with labels.
 */
export function drawAxes(x, y, width, height, color = '#000') {
  drawLine(x, y + height / 2, x + width, y + height / 2, 2, color);
  drawLine(x + width / 2, y, x + width / 2, y + height, 2, color);
  drawArrow(x + width / 2, y, x + width / 2, y - 10, 2, color);
  drawArrow(x + width, y + height / 2, x + width + 10, y + height / 2, 2, color);
}

/**
 * Plots data points on a Cartesian grid.
 */
export function plotData(points = [], xOrigin, yOrigin, scale = 1, color = '#f00') {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = 2;
  for (let i = 0; i < points.length; i++) {
    const x = xOrigin + points[i].x * scale;
    const y = yOrigin - points[i].y * scale;
    if (i === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.stroke();
  context.closePath();
}
