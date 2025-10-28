"use strict";

/**
 * CanvasEngine Style Presets
 * --------------------------
 * Adds luxury dark theme with parallax pattern, breathing light,
 * and soft aurora-like color motion.
 */

import { ctx, canvas, drawPattern, clearScreen } from "./canvasCore.js";

let bgImage = null;
let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
let time = 0;

/**
 * Initialize Luxury Aurora Dark Theme
 * @param {string} imagePath - Path to texture (e.g. "./src/assets/dsrt-bg-pattern.png")
 */
export function initLuxuryDark(imagePath = "./src/assets/dsrt-bg-pattern.png") {
  bgImage = new Image();
  bgImage.src = imagePath;

  bgImage.onload = () => {
    animate();
  };

  // Mouse & Touch Tracking
  canvas.addEventListener("mousemove", e => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  canvas.addEventListener(
    "touchmove",
    e => {
      const t = e.touches[0];
      mouse.targetX = (t.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (t.clientY / window.innerHeight - 0.5) * 2;
    },
    { passive: true }
  );
}

/**
 * Main animation loop
 */
function animate() {
  requestAnimationFrame(animate);
  time += 0.02;

  // Smooth mouse
  mouse.x += (mouse.targetX - mouse.x) * 0.08;
  mouse.y += (mouse.targetY - mouse.y) * 0.08;

  clearScreen("#000");
  if (!bgImage.complete) return;

  const parallax = 60;
  const offsetX = mouse.x * parallax;
  const offsetY = mouse.y * parallax;
  drawPattern(bgImage, offsetX, offsetY);

  // === Breathing Light ===
  const pulse = (Math.sin(time) + 1) * 0.5;
  const lightIntensity = 0.05 + pulse * 0.1;

  const gradient = ctx.createRadialGradient(
    canvas.width / 2 + mouse.x * 300,
    canvas.height / 2 + mouse.y * 300,
    80 + pulse * 40,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 1.2
  );

  gradient.addColorStop(0, `rgba(255,255,255,${lightIntensity})`);
  gradient.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // === Aurora Layer ===
  const auroraX = Math.sin(time * 0.5) * canvas.width * 0.15;
  const auroraY = Math.cos(time * 0.7) * canvas.height * 0.1;

  const aurora = ctx.createLinearGradient(
    auroraX,
    auroraY,
    canvas.width - auroraX,
    canvas.height - auroraY
  );

  // Soft shifting hues (purplish, cyan, gold)
  aurora.addColorStop(0.0, `rgba(${180 + Math.sin(time) * 50}, 80, 255, 0.08)`);
  aurora.addColorStop(0.5, `rgba(0, 180, 255, 0.06)`);
  aurora.addColorStop(1.0, `rgba(255, 200, 100, 0.05)`);

  ctx.fillStyle = aurora;
  ctx.globalCompositeOperation = "screen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";

  // === Final Depth Overlay ===
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
