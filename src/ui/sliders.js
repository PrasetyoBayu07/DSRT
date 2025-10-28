// src/ui/sliders.js
// ==============================================
// DSRT Slider System
// ==============================================

import { context } from '../core/canvas.js';
import { drawRoundedRect, drawText } from '../graphics/draw.js';

export let sliderDB = [];
export let slidersActive = true;

export function resetSliders() {
  sliderDB = [];
}

/**
 * Creates a horizontal or vertical slider.
 */
export function slider(cfg) {
  const { type, label, x, y, width, height, min, max, value, decimals } = cfg;

  if (type === 'H' || type === 'h') {
    if (label) {
      drawText(`${min} ${label}`, x + 20, y + 5, '12pt Calibri', '#000', 'right');
      drawText(`${max} ${label}`, x + 45 + width, y + 5, '12pt Calibri', '#000', 'left');
    }
    drawRoundedRect(x + 30, y, width, 5, 2);
    const posX = ((value - min) / (max - min)) * width;
    drawRoundedRect(x + 30, y, posX, 5, 2, 1, '#000', '#adadad');
    drawRoundedRect(x + 30 + posX - 6, y - 6, 18, 17, 2);
  } else {
    if (label) {
      drawText(`${max} ${label}`, x, y + 5, '12pt Calibri', '#000', 'center');
      drawText(`${min} ${label}`, x, y + width + 43, '12pt Calibri', '#000', 'center');
    }
    drawRoundedRect(x, y + 20, 5, width, 2);
    const posY = ((value - min) / (max - min)) * width;
    drawRoundedRect(x, y + 20 + width - posY, 5, posY, 2, 1, '#000', '#adadad');
    drawRoundedRect(x - 7, y + width + 11 - posY, 19, 18, 2);
  }

  if (!cfg.isPushed) {
    cfg.isPushed = true;
    sliderDB.push(cfg);
  }
}

/**
 * Detects slider movement and updates value.
 */
export function checkSlider(e) {
  if (!slidersActive) return null;
  const id = document.getElementById('scene');
  const xClick = e.pageX - id.offsetLeft;
  const yClick = e.pageY - id.offsetTop;
  let result = null;

  for (let i = 0; i < sliderDB.length; i++) {
    const s = sliderDB[i];
    if (s.type === 'H' || s.type === 'h') {
      const posX = ((s.value - s.min) / (s.max - s.min)) * s.width;
      if (
        xClick > s.x + 20 + posX && xClick < s.x + posX + 40 &&
        yClick > s.y - 6 && yClick < s.y + 12
      ) {
        s.value = (((xClick - (s.x + 30)) / s.width) * (s.max - s.min)) + s.min;
        s.value = parseFloat(s.value.toFixed(s.decimals));
        result = s;
      }
    } else {
      const posY = ((s.value - s.min) / (s.max - s.min)) * s.width;
      if (
        yClick > s.y + s.width + 11 - posY && yClick < s.y + 38 + s.width - posY &&
        xClick > s.x - 10 && xClick < s.x + 15
      ) {
        s.value = (((s.y + s.width + 20 - yClick) / s.width) * (s.max - s.min)) + s.min;
        s.value = parseFloat(s.value.toFixed(s.decimals));
        result = s;
      }
    }
  }
  return result;
}
