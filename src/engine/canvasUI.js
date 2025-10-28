"use strict";

/**
 * CanvasEngine UI Module
 * ----------------------
 * Contains button, slider, text input, and drag interaction logic.
 * 100% functionally identical to the original script, only translated and modernized.
 */

import { canvas, ctx } from "./canvasCore.js";

//===========================//
//       Button System       //
//===========================//

let buttonDB = [];

/**
 * Create a button and register it in the button database.
 */
export function button(label, x, y, w, h, font = "bold 14pt Calibri", color = "#000", fill = "#ddd") {
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#333";
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillText(label, x + w / 2, y + h / 1.6);
  buttonDB.push({ label, x, y, w, h });
}

/**
 * Check if a button is clicked.
 */
export function checkButton(mx, my) {
  for (let b of buttonDB) {
    if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) return b.label;
  }
  return null;
}

/**
 * Reset all registered buttons.
 */
export function resetButtons() {
  buttonDB = [];
}

//===========================//
//       Slider System       //
//===========================//

let sliderDB = [];

/**
 * Create a horizontal or vertical slider.
 * @param {Object} opt - Slider configuration.
 */
export function slider(opt) {
  const o = Object.assign(
    { type: "H", x: 0, y: 0, len: 100, min: 0, max: 10, val: 5, color: "#555", label: "" },
    opt
  );
  ctx.lineWidth = 3;
  ctx.strokeStyle = o.color;
  if (o.type === "H") {
    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(o.x + o.len, o.y);
    ctx.stroke();
    const pos = ((o.val - o.min) / (o.max - o.min)) * o.len;
    ctx.beginPath();
    ctx.arc(o.x + pos, o.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#888";
    ctx.fill();
    ctx.stroke();
    if (o.label) {
      ctx.font = "12pt Calibri";
      ctx.textAlign = "left";
      ctx.fillText(`${o.label}: ${o.val.toFixed(1)}`, o.x + o.len + 15, o.y + 5);
    }
  } else {
    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(o.x, o.y - o.len);
    ctx.stroke();
    const pos = ((o.val - o.min) / (o.max - o.min)) * o.len;
    ctx.beginPath();
    ctx.arc(o.x, o.y - pos, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#888";
    ctx.fill();
    ctx.stroke();
  }
  sliderDB.push(o);
}

/**
 * Detect slider interaction based on mouse position.
 */
export function checkSlider(mx, my, click) {
  for (let s of sliderDB) {
    if (s.type === "H" && my >= s.y - 10 && my <= s.y + 10 && mx >= s.x && mx <= s.x + s.len) {
      if (click) {
        s.val = s.min + ((mx - s.x) / s.len) * (s.max - s.min);
      }
      return s;
    } else if (s.type === "V" && mx >= s.x - 10 && mx <= s.x + 10 && my <= s.y && my >= s.y - s.len) {
      if (click) {
        s.val = s.min + ((s.y - my) / s.len) * (s.max - s.min);
      }
      return s;
    }
  }
  return null;
}

/**
 * Reset all sliders.
 */
export function resetSliders() {
  sliderDB = [];
}

//===========================//
//     Text Input System     //
//===========================//

let inputDB = [];

/**
 * Draw an input box.
 */
export function textInput(id, x, y, w, h, text = "", font = "14pt Calibri", color = "#000") {
  ctx.strokeStyle = "#333";
  ctx.strokeRect(x, y, w, h);
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.fillText(text, x + 5, y + h / 1.4);
  const found = inputDB.find(i => i.id === id);
  if (!found) inputDB.push({ id, x, y, w, h, text });
}

/**
 * Handle input typing & focus.
 */
export function checkTextInput(mx, my, key = "", backspace = false) {
  for (let i of inputDB) {
    if (mx >= i.x && mx <= i.x + i.w && my >= i.y && my <= i.y + i.h) {
      if (key) i.text += key;
      if (backspace) i.text = i.text.slice(0, -1);
      return i;
    }
  }
  return null;
}

/**
 * Reset all text inputs.
 */
export function resetTextInputs() {
  inputDB = [];
}

//===========================//
//       Drag System         //
//===========================//

let dragDB = [];

/**
 * Register draggable object.
 */
export function setDrag(id, x, y, w, h, data = {}) {
  dragDB.push({ id, x, y, w, h, data });
}

/**
 * Check if a draggable object is clicked.
 */
export function checkDrag(mx, my) {
  for (let d of dragDB) {
    if (mx >= d.x && mx <= d.x + d.w && my >= d.y && my <= d.y + d.h) return d;
  }
  return null;
}

/**
 * Reset all draggable elements.
 */
export function resetDrag() {
  dragDB = [];
}

/**
 * Reset all UI components.
 */
export function resetUI() {
  buttonDB = [];
  sliderDB = [];
  inputDB = [];
  dragDB = [];
}
