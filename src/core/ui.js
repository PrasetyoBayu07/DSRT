// src/core/ui.js

// ============================================================
// DSRT ENGINE UI MODULE
// Handles buttons, sliders, drag, and mouse interaction
// ============================================================

var DSRT = DSRT || {};

DSRT.UI = (function () {

  let canvas, ctx;
  let mouseX = 0, mouseY = 0;
  let mouseDown = false;
  let lastClick = false;

  const buttons = [];
  const sliders = [];
  const drags = [];

  // Initialize mouse event listeners
  function initEvents() {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousemove", e => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener("mousedown", () => {
      mouseDown = true;
      lastClick = true;
    });

    canvas.addEventListener("mouseup", () => {
      mouseDown = false;
    });
  }

  // ========== BUTTONS ==========

  function button(img, x, y, w = 100, h = 50) {
    const btn = { x, y, w, h, img, pressed: false };
    buttons.push(btn);
    DSRT.Core.image(img, x - w / 2, y - h / 2, w, h);
    return btn;
  }

  function checkButton(btn) {
    return mouseX > btn.x - btn.w / 2 && mouseX < btn.x + btn.w / 2 &&
           mouseY > btn.y - btn.h / 2 && mouseY < btn.y + btn.h / 2;
  }

  function pressed(btn) {
    if (checkButton(btn) && lastClick) {
      lastClick = false;
      return true;
    }
    return false;
  }

  // Simple text button (without image)
  function textButton(label, x, y, w = 120, h = 40, bg = "#007acc", color = "#fff", radius = 8) {
    const ctx = DSRT.Core.getContext();
    ctx.save();
    ctx.fillStyle = bg;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - w / 2 + radius, y - h / 2);
    ctx.lineTo(x + w / 2 - radius, y - h / 2);
    ctx.quadraticCurveTo(x + w / 2, y - h / 2, x + w / 2, y - h / 2 + radius);
    ctx.lineTo(x + w / 2, y + h / 2 - radius);
    ctx.quadraticCurveTo(x + w / 2, y + h / 2, x + w / 2 - radius, y + h / 2);
    ctx.lineTo(x - w / 2 + radius, y + h / 2);
    ctx.quadraticCurveTo(x - w / 2, y + h / 2, x - w / 2, y + h / 2 - radius);
    ctx.lineTo(x - w / 2, y - h / 2 + radius);
    ctx.quadraticCurveTo(x - w / 2, y - h / 2, x - w / 2 + radius, y - h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    DSRT.Core.text(label, x, y, "bold 14pt Calibri", color);
    ctx.restore();

    const btn = { x, y, w, h, pressed: false, label };
    buttons.push(btn);
    return btn;
  }

  // ========== SLIDERS ==========

  function slider(x, y, w = 200, min = 0, max = 100, value = 50) {
    const s = { x, y, w, min, max, value };
    sliders.push(s);
    const ctx = DSRT.Core.getContext();

    // Draw line
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.lineTo(x + w / 2, y);
    ctx.stroke();

    // Handle position
    const pos = x - w / 2 + (value - min) / (max - min) * w;
    DSRT.Core.circle(pos, y, 10, 1, "#000", "#007acc");

    // Update value if dragging
    if (mouseDown && mouseX >= x - w / 2 && mouseX <= x + w / 2 &&
        mouseY >= y - 15 && mouseY <= y + 15) {
      s.value = min + ((mouseX - (x - w / 2)) / w) * (max - min);
    }
    return s;
  }

  // ========== DRAGGABLE ELEMENTS ==========

  function draggable(x, y, w, h, img = null) {
    const obj = { x, y, w, h, img, dragging: false };
    drags.push(obj);

    if (img) DSRT.Core.image(img, x - w / 2, y - h / 2, w, h);
    else DSRT.Core.rect(x - w / 2, y - h / 2, w, h, 1, "#000", "#ccc");

    // Update drag status
    if (mouseDown && mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2) {
      obj.dragging = true;
    } else if (!mouseDown) {
      obj.dragging = false;
    }

    if (obj.dragging) {
      obj.x = mouseX;
      obj.y = mouseY;
    }

    return obj;
  }

  // ========== INPUT TEXT BOX ==========
  // (Basic canvas text field simulation)
  function inputBox(x, y, w = 200, h = 40, placeholder = "Enter text...") {
    const ctx = DSRT.Core.getContext();
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.strokeRect(x - w / 2, y - h / 2, w, h);
    ctx.fillStyle = "#888";
    ctx.font = "14pt Calibri";
    ctx.textAlign = "left";
    ctx.fillText(placeholder, x - w / 2 + 10, y + 5);
    ctx.restore();
  }

  // Reset click
  function resetClick() {
    lastClick = false;
  }

  // Public exports
  return {
    initEvents,
    button,
    checkButton,
    pressed,
    textButton,
    slider,
    draggable,
    inputBox,
    resetClick
  };

})();
