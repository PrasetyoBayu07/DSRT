// ==============================================
// DSRT Button System
// ==============================================

import { context } from "../core/canvas.js";
import { drawRect, drawRoundedRect, drawText, drawImage } from "../graphics/draw.js";
import { playClickSound, playHoverSound } from "../audio/sound.js";

export let buttonDB = [];
export let buttonsActive = true;
export let hoveredButton = null;

export function resetButtons() {
  buttonDB = [];
}

/**
 * Creates a text button.
 */
export function button(
  name,
  x,
  y,
  w,
  h,
  font = "bold 12pt Calibri",
  fontColor = "#000",
  strokeColor = "#000",
  fillColor = "#adadad",
  rounded = false,
  callback = null
) {
  const split = name.split("/id=");
  const label = split[0];
  const id = split.length > 1 ? split[1] : label;

  const isHovered = hoveredButton === id;
  const hoverColor = isHovered ? "#00c2ff" : fillColor;

  if (rounded) {
    drawRoundedRect(x, y, w, h, 8, 1, strokeColor, hoverColor);
  } else {
    drawRect(x, y, w, h, 1, strokeColor, hoverColor);
  }

  context.textBaseline = "middle";
  drawText(label, x + w / 2, y + h / 2, font, fontColor, "center");
  context.textBaseline = "alphabetic";

  const exists = buttonDB.some((btn) => btn[0] === id);
  if (!exists) buttonDB.push([id, x, y, w, h, callback]);
}

/**
 * Creates an image-based button.
 */
export function imageButton(name, x, y, w, h, src, callback = null) {
  drawImage(src, x, y, w, h);

  const split = name.split("/id=");
  const label = split[0];
  const id = split.length > 1 ? split[1] : label;

  const exists = buttonDB.some((btn) => btn[0] === id);
  if (!exists) buttonDB.push([id, x, y, w, h, callback]);
}

/**
 * Detects button hover on canvas.
 */
export function checkButtonHover(e) {
  const id = document.getElementById("scene");
  const xHover = e.pageX - id.offsetLeft;
  const yHover = e.pageY - id.offsetTop;
  let found = null;

  for (let b of buttonDB) {
    if (xHover > b[1] && xHover < b[1] + b[3] && yHover > b[2] && yHover < b[2] + b[4]) {
      found = b[0];
      break;
    }
  }

  if (found !== hoveredButton) {
    hoveredButton = found;
    if (found) playHoverSound();
  }
}

/**
 * Detects button clicks on canvas.
 */
export function checkButtonClick(e) {
  if (!buttonsActive) return;
  const id = document.getElementById("scene");
  const xClick = e.pageX - id.offsetLeft;
  const yClick = e.pageY - id.offsetTop;
  let result = "";

  for (let b of buttonDB) {
    if (xClick > b[1] && xClick < b[1] + b[3] && yClick > b[2] && yClick < b[2] + b[4]) {
      result = b[0];
      playClickSound();
      if (b[5]) b[5]();
    }
  }
  return result;
}
