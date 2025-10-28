"use strict";

/**
 * CanvasEngine Style Presets
 * --------------------------
 * Predefined visual environments for CanvasEngine.
 * This file adds luxury dark theme styling with background pattern,
 * soft lighting, and interactive parallax.
 */

import { ctx, canvas, drawPattern, clearScreen } from "./canvasCore.js";

let bgImage = null;
let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

/**
 * Initialize Luxury Dark Theme
 * @param {string} imagePath - path to the background texture (e.g. "./src/assets/dsrt-bg-pattern.jpg")
 */
export function initLuxuryDark(imagePath = "./src/assets/dsrt-bg-pattern.jpg") {
  bgImage = new Image();
  bgImage.src = imagePath;

  bgImage.onload = () => {
    animate();
  };

  // Mouse & touch tracking
  canvas.addEventListener("mousemove", e => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  canvas.addEventListener("touchmove", e => {
    const t = e.touches[0];
    mouse.targetX = (t.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (t.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
}

/**
 * Draws the pattern with smooth parallax and light overlay.
 */
function animate() {
  requestAnimationFrame(animate);

  // Smooth follow
  mouse.x += (mouse.targetX - mouse.x) * 0.08;
  mouse.y += (mouse.targetY - mouse.y) * 0.08;

  clearScreen("#000");
  if (!bgImage.complete) return;

  const parallax = 60;
  const offsetX = mouse.x * parallax;
  const offsetY = mouse.y * parallax;

  // Draw repeating pattern background
  drawPattern(bgImage, offsetX, offsetY);

  // Add subtle dynamic lighting
  const gradient = ctx.createRadialGradient(
    canvas.width / 2 + mouse.x * 300,
    canvas.height / 2 + mouse.y * 300,
    80,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 1.2
  );
  gradient.addColorStop(0, "rgba(255,255,255,0.05)");
  gradient.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
