/**
 * DSRT Playground Script
 * Runs any JavaScript snippet inside a safe sandbox with DSRT engine context.
 */

const editor = document.getElementById("editor");
const runBtn = document.getElementById("runBtn");
const canvas = document.getElementById("canvas");

runBtn.addEventListener("click", async () => {
  const code = editor.value;
  runBtn.disabled = true;
  runBtn.textContent = "Running...";

  try {
    // Clear canvas before run
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dynamic import of DSRT core
    const DSRT = await import("https://raw.githubusercontent.com/PrasetyoBayu07/DSRT/main/src/dsrt.js");

    // Isolate execution
    const sandbox = new Function("DSRT", "canvas", "ctx", code);
    sandbox(DSRT, canvas, ctx);
  } catch (e) {
    console.error(e);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    ctx.font = "14px monospace";
    ctx.fillText("⚠️ Error: " + e.message, 10, 20);
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = "▶ Run";
  }
});
