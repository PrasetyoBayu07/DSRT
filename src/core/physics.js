// src/core/physics.js

// ============================================================
// DSRT ENGINE PHYSICS MODULE
// Lightweight 2D physics utilities: motion, collision, forces
// ============================================================

var DSRT = DSRT || {};

DSRT.Physics = (function () {

  // Internal constants
  const EPS = 0.0001;

  // ========== BASIC PHYSICS ==========
  function applyForce(obj, fx, fy, dt = 1 / 60) {
    if (!obj.mass) obj.mass = 1;
    obj.vx = (obj.vx || 0) + (fx / obj.mass) * dt * 60;
    obj.vy = (obj.vy || 0) + (fy / obj.mass) * dt * 60;
  }

  function applyGravity(obj, g = 9.8, dt = 1 / 60) {
    applyForce(obj, 0, obj.mass * g, dt);
  }

  function applyFriction(obj, friction = 0.98) {
    obj.vx *= friction;
    obj.vy *= friction;
  }

  function updatePosition(obj, dt = 1 / 60) {
    obj.x += (obj.vx || 0) * dt * 60;
    obj.y += (obj.vy || 0) * dt * 60;
  }

  // ========== COLLISIONS ==========
  function circleCollision(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < (a.r + b.r);
  }

  function rectCollision(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  function resolveBounce(a, b, restitution = 0.8) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) + EPS;
    const nx = dx / dist;
    const ny = dy / dist;

    // Relative velocity
    const dvx = (a.vx || 0) - (b.vx || 0);
    const dvy = (a.vy || 0) - (b.vy || 0);
    const impact = dvx * nx + dvy * ny;

    if (impact > 0) return;

    const impulse = (-(1 + restitution) * impact) / ((1 / a.mass) + (1 / b.mass));
    const ix = impulse * nx;
    const iy = impulse * ny;

    a.vx += ix / a.mass;
    a.vy += iy / a.mass;
    b.vx -= ix / b.mass;
    b.vy -= iy / b.mass;
  }

  // ========== BOUNDARY HANDLING ==========
  function keepInBounds(obj, width, height, bounce = 0.7) {
    if (obj.x - obj.r < 0) {
      obj.x = obj.r;
      obj.vx *= -bounce;
    } else if (obj.x + obj.r > width) {
      obj.x = width - obj.r;
      obj.vx *= -bounce;
    }
    if (obj.y - obj.r < 0) {
      obj.y = obj.r;
      obj.vy *= -bounce;
    } else if (obj.y + obj.r > height) {
      obj.y = height - obj.r;
      obj.vy *= -bounce;
    }
  }

  // ========== UTILITIES ==========
  function kineticEnergy(obj) {
    return 0.5 * obj.mass * ((obj.vx ** 2) + (obj.vy ** 2));
  }

  function momentum(obj) {
    return { px: obj.mass * (obj.vx || 0), py: obj.mass * (obj.vy || 0) };
  }

  // ========== PUBLIC API ==========
  return {
    applyForce,
    applyGravity,
    applyFriction,
    updatePosition,
    circleCollision,
    rectCollision,
    resolveBounce,
    keepInBounds,
    kineticEnergy,
    momentum
  };

})();
