// src/core/canvas.js
// ==============================================
// DSRT Core Canvas Initialization & Control
// ==============================================

export let canvas = null;
export let context = null;
export let backgroundColor = "#ffffff";
export let funcDB = [];

export function initCanvas(id, bg = "#ffffff") {
  canvas = document.getElementById(id);
  if (!canvas) throw new Error("Canvas element not found: " + id);
  context = canvas.getContext("2d");
  backgroundColor = bg;
  clearScreen(bg);
}

export function clearScreen(color = backgroundColor, obj = {}) {
  backgroundColor = color;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (obj.stat === "run") funcDB.push(obj.func);
  if (obj.stat === "clear") funcDB = [];

  if (funcDB.length > 0) run(funcDB[0]);
}

export function run(func) {
  if (typeof func === "function") func();
}

export function resetAll() {
  funcDB = [];
  clearScreen(backgroundColor);
}

export function getContext() {
  return context;
}
