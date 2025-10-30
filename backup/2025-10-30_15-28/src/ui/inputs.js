// src/ui/inputs.js
// ==============================================
// DSRT Text Input (Canvas-Based)
// ==============================================

import { context, canvas } from "../core/canvas.js";
import { drawRoundedRect, drawText } from "../graphics/draw.js";

export let inputDB = [];
export let activeInput = "";
export let blinking = false;
let blinkCode = "";
export let inputsActive = true;

/**
 * Draws and manages an on-canvas input box.
 */
export function inputBox(
  name,
  x,
  y,
  width,
  height,
  font = "12pt Calibri",
  color = "#000",
  bg = "#fff",
  callback = null
) {
  drawRoundedRect(x, y, width, height, 4, 1, "#000", bg);

  const input = inputDB.find((i) => i.name === name);
  if (!input) {
    inputDB.push({ name, x, y, width, height, text: "", font, color, callback });
  }

  const active = activeInput === name;
  const showCursor = active && blinking;

  const displayText = input ? input.text : "";
  const textToDraw = showCursor ? displayText + "|" : displayText;

  drawText(textToDraw, x + 5, y + height / 2, font, color, "left");
}

export function handleKeyInput(e) {
  if (!inputsActive) return;
  const active = inputDB.find((i) => i.name === activeInput);
  if (!active) return;

  if (e.key === "Backspace") {
    active.text = active.text.slice(0, -1);
  } else if (e.key.length === 1) {
    active.text += e.key;
  }

  if (active.callback) active.callback(active.text);
}

export function setActiveInput(name) {
  activeInput = name;
  blinkCode = setInterval(() => (blinking = !blinking), 500);
}

export function deactivateInput() {
  activeInput = "";
  blinking = false;
  clearInterval(blinkCode);
}
