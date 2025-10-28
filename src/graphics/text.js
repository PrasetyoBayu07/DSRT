// src/graphics/text.js
// ==============================================
// DSRT Text Rendering Utilities
// ==============================================

import { context } from '../core/canvas.js';

/**
 * Draws multi-line text.
 */
export function drawMultilineText(text, x, y, lineHeight = 20, font = '12pt Calibri', color = '#000', align = 'left') {
  const lines = text.split('\n');
  context.font = font;
  context.fillStyle = color;
  context.textAlign = align;
  for (let i = 0; i < lines.length; i++) {
    context.fillText(lines[i], x, y + (i * lineHeight));
  }
}

/**
 * Draws simple text with bold or italic variations.
 */
export function drawStyledText(text, x, y, style = 'normal', fontSize = 14, color = '#000', align = 'center') {
  context.font = `${style} ${fontSize}px Calibri`;
  context.fillStyle = color;
  context.textAlign = align;
  context.fillText(text, x, y);
}

/**
 * Draws text with a shadow effect.
 */
export function drawShadowText(text, x, y, font = 'bold 14pt Calibri', color = '#000', shadowColor = '#aaa') {
  context.save();
  context.shadowColor = shadowColor;
  context.shadowBlur = 3;
  context.shadowOffsetX = 2;
  context.shadowOffsetY = 2;
  context.font = font;
  context.fillStyle = color;
  context.textAlign = 'center';
  context.fillText(text, x, y);
  context.restore();
}
