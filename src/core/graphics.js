// src/core/graphics.js

// ============================================================
// DSRT ENGINE GRAPHICS MODULE
// Complex graphics: gear, spring, graphs, grid, and shapes
// ============================================================

var DSRT = DSRT || {};

DSRT.Graphics = (function () {

  const ctx = () => DSRT.Core.getContext();

  // ========== GRID ==========
  function grid(x, y, width, height, step = 50, color = "#ccc") {
    const c = ctx();
    c.save();
    c.strokeStyle = color;
    c.lineWidth = 1;
    for (let i = x; i <= x + width; i += step) {
      c.beginPath();
      c.moveTo(i, y);
      c.lineTo(i, y + height);
      c.stroke();
    }
    for (let j = y; j <= y + height; j += step) {
      c.beginPath();
      c.moveTo(x, j);
      c.lineTo(x + width, j);
      c.stroke();
    }
    c.restore();
  }

  // ========== CARTESIAN PLANE ==========
  function cartesian(x, y, width, height, step = 50, color = "#000") {
    const c = ctx();
    c.save();
    c.strokeStyle = color;
    c.lineWidth = 1.2;

    // Axes
    c.beginPath();
    c.moveTo(x, y + height / 2);
    c.lineTo(x + width, y + height / 2);
    c.moveTo(x + width / 2, y);
    c.lineTo(x + width / 2, y + height);
    c.stroke();

    // Grid lines
    c.strokeStyle = "#aaa";
    for (let i = x; i <= x + width; i += step) {
      c.beginPath();
      c.moveTo(i, y);
      c.lineTo(i, y + height);
      c.stroke();
    }
    for (let j = y; j <= y + height; j += step) {
      c.beginPath();
      c.moveTo(x, j);
      c.lineTo(x + width, j);
      c.stroke();
    }
    c.restore();
  }

  // ========== ARROW VECTOR ==========
  function vector(x, y, angle, length = 50, width = 2, color = "#000") {
    const c = ctx();
    const x2 = x + Math.cos(angle) * length;
    const y2 = y + Math.sin(angle) * length;
    DSRT.Core.arrow(x, y, x2, y2, width, color);
  }

  // ========== WAVE / FUNCTION GRAPH ==========
  function graph(func, x, y, width = 400, scaleX = 1, scaleY = 1, color = "#007acc") {
    const c = ctx();
    c.beginPath();
    for (let i = 0; i < width; i++) {
      const val = func(i / scaleX);
      const px = x + i;
      const py = y - val * scaleY;
      if (i === 0) c.moveTo(px, py);
      else c.lineTo(px, py);
    }
    c.strokeStyle = color;
    c.lineWidth = 2;
    c.stroke();
  }

  // ========== GEAR ==========
  function gear(x, y, radius = 50, teeth = 12, hole = 10, fill = "#ccc", border = "#000", rotation = 0) {
    const c = ctx();
    c.save();
    c.translate(x, y);
    c.rotate(rotation * Math.PI / 180);
    const angleStep = (Math.PI * 2) / teeth;
    const toothDepth = radius * 0.2;

    c.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a1 = i * angleStep;
      const a2 = a1 + angleStep / 2;
      const a3 = a1 + angleStep;
      const outer = radius + toothDepth / 2;
      const inner = radius - toothDepth / 2;

      c.lineTo(Math.cos(a1) * outer, Math.sin(a1) * outer);
      c.lineTo(Math.cos(a2) * inner, Math.sin(a2) * inner);
      c.lineTo(Math.cos(a3) * outer, Math.sin(a3) * outer);
    }
    c.closePath();
    c.fillStyle = fill;
    c.strokeStyle = border;
    c.lineWidth = 1.5;
    c.fill();
    c.stroke();

    // Hole
    c.beginPath();
    c.arc(0, 0, hole, 0, Math.PI * 2);
    c.fillStyle = "#fff";
    c.fill();
    c.stroke();
    c.restore();
  }

  // ========== SPRING ==========
  function spring(x1, y1, x2, y2, coils = 10, amplitude = 10, color = "#000", width = 2) {
    const c = ctx();
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const step = len / (coils * 2);

    c.save();
    c.translate(x1, y1);
    c.rotate(angle);
    c.beginPath();
    c.moveTo(0, 0);
    for (let i = 0; i <= coils * 2; i++) {
      const x = i * step;
      const y = (i % 2 === 0) ? amplitude : -amplitude;
      c.lineTo(x, y);
    }
    c.lineTo(len, 0);
    c.strokeStyle = color;
    c.lineWidth = width;
    c.stroke();
    c.restore();
  }

  // ========== WHEEL ==========
  function wheel(x, y, radius = 50, spokes = 8, fill = "#aaa", stroke = "#000", rotation = 0) {
    const c = ctx();
    c.save();
    c.translate(x, y);
    c.rotate(rotation * Math.PI / 180);
    DSRT.Core.circle(0, 0, radius, 2, stroke, fill);
    for (let i = 0; i < spokes; i++) {
      const angle = (2 * Math.PI / spokes) * i;
      DSRT.Core.line(0, 0, radius * Math.cos(angle), radius * Math.sin(angle), 1, stroke);
    }
    DSRT.Core.circle(0, 0, radius * 0.1, 1, stroke, "#fff");
    c.restore();
  }

  // ========== CHAIN / LINK ==========
  function chain(x1, y1, x2, y2, links = 10, radius = 8, color = "#555") {
    const c = ctx();
    const dx = (x2 - x1) / links;
    const dy = (y2 - y1) / links;
    for (let i = 0; i <= links; i++) {
      const px = x1 + i * dx;
      const py = y1 + i * dy;
      DSRT.Core.circle(px, py, radius, 1, "#000", color);
    }
  }

  // ========== ARROW FIELD (VECTOR MAP) ==========
  function vectorField(x, y, cols, rows, step = 40, func) {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const px = x + i * step;
        const py = y + j * step;
        const angle = func(px, py);
        vector(px, py, angle, step / 2, 1, "#007acc");
      }
    }
  }

  // ========== THICK CURVE (FOR MOTION PATHS) ==========
  function motionCurve(points, color = "#f00", width = 3) {
    const c = ctx();
    if (points.length < 2) return;
    c.beginPath();
    c.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      c.lineTo(points[i].x, points[i].y);
    }
    c.strokeStyle = color;
    c.lineWidth = width;
    c.stroke();
  }

  return {
    grid,
    cartesian,
    vector,
    graph,
    gear,
    spring,
    wheel,
    chain,
    vectorField,
    motionCurve
  };

})();
