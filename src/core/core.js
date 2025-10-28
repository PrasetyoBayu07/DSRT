// src/core/core.js
// ============================================================
// DSRT ENGINE CORE MODULE
// Core rendering and drawing utilities (Enhanced Version)
// ============================================================

var DSRT = DSRT || {};

DSRT.Core = (function () {

  let canvas, ctx;
  let width = 1200, height = 600;
  let bgColor = "#ffffff";
  let dpr = window.devicePixelRatio || 1;

  // ====== Internal check ======
  function _checkContext() {
    if (!ctx) throw new Error("DSRT.Core: Canvas not initialized. Call DSRT.Core.initCanvas() first.");
  }

  // ====== Initialize canvas ======
  function initCanvas(id = "scene", size = "1200x600", retina = true) {
    const parts = size.split("x");
    width = parseInt(parts[0]);
    height = parseInt(parts[1]);
    canvas = document.getElementById(id);
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = id;
      document.body.appendChild(canvas);
    }

    // Retina / HiDPI support
    if (retina) {
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
    } else {
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext("2d");
    }
  }

  // ====== Resize Canvas ======
  function resizeCanvas(newWidth, newHeight, retina = true) {
    _checkContext();
    width = newWidth;
    height = newHeight;
    if (retina) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.scale(dpr, dpr);
    } else {
      canvas.width = width;
      canvas.height = height;
    }
  }

  // ====== Clear Screen ======
  function clearScreen(color = bgColor) {
    _checkContext();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }

  // ====== Drawing Primitives ======
  function line(x1, y1, x2, y2, stroke = 2, color = "#000") {
    _checkContext();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = stroke;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  function rect(x, y, w, h, stroke = 1, border = "#000", fill = "#fff") {
    _checkContext();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.lineWidth = stroke;
    ctx.strokeStyle = border;
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();
  }

  function rectRounded(x, y, w, h, radius = 10, stroke = 1, border = "#000", fill = "#fff") {
    _checkContext();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.lineWidth = stroke;
    ctx.strokeStyle = border;
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.stroke();
  }

  function circle(x, y, r, stroke = 1, border = "#000", fill = "#fff") {
    _checkContext();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = border;
    ctx.lineWidth = stroke;
    ctx.fill();
    ctx.stroke();
  }

  function ellipse(x, y, rx, ry, stroke = 1, border = "#000", fill = "#fff") {
    _checkContext();
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = border;
    ctx.lineWidth = stroke;
    ctx.fill();
    ctx.stroke();
  }

  // ====== Text & Image ======
  function text(str, x, y, font = "16pt Calibri", color = "#000", align = "center") {
    _checkContext();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillText(str, x, y);
  }

  function image(img, x, y, w, h, alpha = 1) {
    _checkContext();
    if (!img) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    if (w && h) ctx.drawImage(img, x, y, w, h);
    else ctx.drawImage(img, x, y);
    ctx.restore();
  }

  function imageFull(img, alpha = 1) {
    _checkContext();
    if (!img) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, 0, 0, width, height);
    ctx.restore();
  }

  function arrow(x1, y1, x2, y2, width = 2, color = "#000") {
    _checkContext();
    const headLength = 10;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6),
                y2 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6),
                y2 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  function imageRotated(img, x, y, w, h, angle) {
    _checkContext();
    if (!img) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  // ====== Utility ======
  function setBackgroundColor(color) {
    bgColor = color;
  }

  function getContext() {
    return ctx;
  }

  function getCanvas() {
    return canvas;
  }

  // ====== Public API ======
  return {
    initCanvas,
    resizeCanvas,
    clearScreen,
    line,
    rect,
    rectRounded,
    circle,
    ellipse,
    text,
    image,
    imageFull,
    arrow,
    imageRotated,
    setBackgroundColor,
    getContext,
    getCanvas
  };

})();
