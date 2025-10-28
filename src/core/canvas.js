// ==============================================
// DSRT Core Canvas Initialization & Control
// ==============================================

export let canvas = null;
export let context = null;
export let backgroundColor = "#ffffff";
export let funcDB = [];
let isLooping = false;

/**
 * Initialize canvas and prepare context
 */
export function initCanvas(id, bg = "#ffffff") {
  canvas = document.getElementById(id);
  if (!canvas) throw new Error("Canvas element not found: " + id);
  context = canvas.getContext("2d");
  backgroundColor = bg;
  clearScreen(bg);
}

/**
 * Clears and fills background, and optionally runs function or resets queue
 */
export function clearScreen(color = backgroundColor, obj = {}) {
  backgroundColor = color;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (obj.stat === "run") funcDB.push(obj.func);
  if (obj.stat === "clear") funcDB = [];

  if (funcDB.length > 0 && !isLooping) startLoop();
}

/**
 * Run a single render or logic function
 */
export function run(func) {
  if (typeof func === "function") func();
}

/**
 * Start animation loop (60 FPS)
 */
export function startLoop() {
  if (isLooping) return;
  isLooping = true;
  function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < funcDB.length; i++) {
      if (typeof funcDB[i] === "function") funcDB[i]();
    }
    requestAnimationFrame(loop);
  }
  loop();
}

/**
 * Stop animation loop
 */
export function stopLoop() {
  isLooping = false;
}

/**
 * Reset all render functions and clear canvas
 */
export function resetAll() {
  funcDB = [];
  clearScreen(backgroundColor);
}

/**
 * Returns current 2D context
 */
export function getContext() {
  return context;
}

/**
 * Optional: fade in entire scene
 * usage: fadeInScene("#000", 800)
 */
export async function fadeInScene(color = "#000", duration = 800) {
  const steps = 30;
  for (let i = 0; i <= steps; i++) {
    const alpha = i / steps;
    context.fillStyle = color;
    context.globalAlpha = 1 - alpha;
    context.fillRect(0, 0, canvas.width, canvas.height);
    await new Promise(r => setTimeout(r, duration / steps));
  }
  context.globalAlpha = 1;
}
