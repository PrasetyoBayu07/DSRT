// ==============================================
// DSRT Button System + Hover + Click Animation + Sound
// ==============================================

import { context } from '../core/canvas.js';
import { drawRect, drawRoundedRect, drawText, drawImage } from '../graphics/draw.js';

export let buttonDB = [];
export let buttonsActive = true;
let hoveredButton = null;
let pressedButton = null;
let pressScale = 1.0;

// Load audio
const clickAudio = new Audio('./audio/audio-click.mp3');
clickAudio.volume = 0.6;

const hoverAudio = new Audio('./audio/audio-hover.mp3');
hoverAudio.volume = 0.4;

// Reset button database
export function resetButtons() {
  buttonDB = [];
  hoveredButton = null;
  pressedButton = null;
}

/**
 * Create text button
 */
export function button(
  name, x, y, w, h,
  font = 'bold 12pt Calibri',
  fontColor = '#000',
  strokeColor = '#000',
  fillColor = '#adadad',
  rounded = false,
  callback = null
) {
  const split = name.split('/id=');
  const label = split[0];
  const id = split.length > 1 ? split[1] : label;

  // Hover & Press animation
  const isHovered = hoveredButton === id;
  const isPressed = pressedButton === id;
  const hoverColor = isHovered ? '#dcdcdc' : fillColor;
  const scale = isPressed ? 0.9 : 1.0;

  const offsetX = x + (w * (1 - scale)) / 2;
  const offsetY = y + (h * (1 - scale)) / 2;
  const newW = w * scale;
  const newH = h * scale;

  if (rounded) {
    drawRoundedRect(offsetX, offsetY, newW, newH, 8, 1, strokeColor, hoverColor);
  } else {
    drawRect(offsetX, offsetY, newW, newH, 1, strokeColor, hoverColor);
  }

  context.textBaseline = 'middle';
  drawText(label, offsetX + newW / 2, offsetY + newH / 2, font, fontColor, 'center');
  context.textBaseline = 'alphabetic';

  const exists = buttonDB.some(btn => btn[0] === id);
  if (!exists) {
    buttonDB.push([id, x, y, w, h, callback]);
  }
}

/**
 * Create image button
 */
export function imageButton(name, x, y, w, h, src, callback = null) {
  const split = name.split('/id=');
  const label = split[0];
  const id = split.length > 1 ? split[1] : label;
  const isHovered = hoveredButton === id;
  const isPressed = pressedButton === id;
  const scale = isPressed ? 0.9 : 1.0;

  const offsetX = x + (w * (1 - scale)) / 2;
  const offsetY = y + (h * (1 - scale)) / 2;
  const newW = w * scale;
  const newH = h * scale;

  drawImage(src, offsetX, offsetY, newW, newH);

  const exists = buttonDB.some(btn => btn[0] === id);
  if (!exists) {
    buttonDB.push([id, x, y, w, h, callback]);
  }
}

/**
 * Handle button click
 */
export function checkButtonClick(e) {
  if (!buttonsActive) return;
  const id = document.getElementById('scene');
  const xClick = e.pageX - id.offsetLeft;
  const yClick = e.pageY - id.offsetTop;
  let result = '';

  for (let i = 0; i < buttonDB.length; i++) {
    const b = buttonDB[i];
    if (
      xClick > b[1] && xClick < b[1] + b[3] &&
      yClick > b[2] && yClick < b[2] + b[4]
    ) {
      pressedButton = b[0];
      setTimeout(() => { pressedButton = null; }, 150); // reset press after animation

      if (clickAudio) {
        clickAudio.currentTime = 0;
        clickAudio.play().catch(() => {});
      }

      result = b[0];
      if (b[5]) b[5]();
    }
  }

  return result;
}

/**
 * Handle hover state
 */
export function checkButtonHover(e) {
  if (!buttonsActive) return;
  const id = document.getElementById('scene');
  const xMove = e.pageX - id.offsetLeft;
  const yMove = e.pageY - id.offsetTop;
  let foundHover = null;

  for (let i = 0; i < buttonDB.length; i++) {
    const b = buttonDB[i];
    if (
      xMove > b[1] && xMove < b[1] + b[3] &&
      yMove > b[2] && yMove < b[2] + b[4]
    ) {
      foundHover = b[0];
      break;
    }
  }

  if (foundHover !== hoveredButton) {
    hoveredButton = foundHover;
    if (hoveredButton && hoverAudio) {
      hoverAudio.currentTime = 0;
      hoverAudio.play().catch(() => {});
    }
  }
}
