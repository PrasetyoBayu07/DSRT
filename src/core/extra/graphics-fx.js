// src/extra/graphics-fx.js
// ============================================================
// DSRT ENGINE EXTRA: GRAPHICS FX MODULE
// Adds smooth animation, pseudo-3D projection, and interactive helpers
// ============================================================

var DSRT = DSRT || {};
DSRT.Extra = DSRT.Extra || {};

DSRT.Extra.GraphicsFX = (function () {

  const ctx = () => DSRT.Core.getContext();

  // ------------------ SMOOTH ANIMATION ------------------
  function animateGear(x, y, radius, teeth, hole, fill, border, rotationSpeed = 1) {
    let angle = 0;
    function step() {
      DSRT.Graphics.gear(x, y, radius, teeth, hole, fill, border, angle);
      angle += rotationSpeed;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function animateWheel(x, y, radius, spokes, fill, stroke, rotationSpeed = 1) {
    let angle = 0;
    function step() {
      DSRT.Graphics.wheel(x, y, radius, spokes, fill, stroke, angle);
      angle += rotationSpeed;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function animateSpring(x1, y1, x2, y2, coils, amplitude, color, width, oscillation = 1) {
    let t = 0;
    function step() {
      const amp = amplitude * Math.sin(t);
      DSRT.Graphics.spring(x1, y1, x2, y2, coils, amp, color, width);
      t += oscillation * 0.1;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ------------------ PSEUDO-3D / ISOMETRIC HELPERS ------------------
  function projectIso(x, y, z, scale = 1) {
    const isoX = (x - y) * Math.cos(Math.PI / 6) * scale;
    const isoY = (x + y) * Math.sin(Math.PI / 6) * scale - z * scale;
    return { x: isoX, y: isoY };
  }

  function drawGear3D(x, y, z, radius, teeth, hole, fill, border, rotation = 0, scale = 1) {
    const pos = projectIso(x, y, z, scale);
    DSRT.Graphics.gear(pos.x, pos.y, radius * scale, teeth, hole * scale, fill, border, rotation);
  }

  function drawWheel3D(x, y, z, radius, spokes, fill, stroke, rotation = 0, scale = 1) {
    const pos = projectIso(x, y, z, scale);
    DSRT.Graphics.wheel(pos.x, pos.y, radius * scale, spokes, fill, stroke, rotation);
  }

  // ------------------ INTERACTIVE HELPERS ------------------
  function draggable(obj, onUpdate) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function mouseDown(e) {
      const mx = e.offsetX;
      const my = e.offsetY;
      if (Math.hypot(mx - obj.x, my - obj.y) <= obj.radius) {
        isDragging = true;
        offsetX = mx - obj.x;
        offsetY = my - obj.y;
      }
    }

    function mouseMove(e) {
      if (!isDragging) return;
      obj.x = e.offsetX - offsetX;
      obj.y = e.offsetY - offsetY;
      if (typeof onUpdate === "function") onUpdate(obj);
    }

    function mouseUp() {
      isDragging = false;
    }

    const canvas = ctx().canvas;
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mouseup", mouseUp);
  }

  return {
    animateGear,
    animateWheel,
    animateSpring,
    projectIso,
    drawGear3D,
    drawWheel3D,
    draggable
  };

})();
