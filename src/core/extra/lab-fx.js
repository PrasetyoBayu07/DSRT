// src/extra/lab-fx.js
// ============================================================
// DSRT ENGINE EXTRA: LAB FX MODULE
// Adds smooth liquid animation, thermometer updates, flame flicker, and bubble animation
// ============================================================

var DSRT = DSRT || {};
DSRT.Extra = DSRT.Extra || {};

DSRT.Extra.LabFX = (function () {

  const ctx = () => DSRT.Core.getContext();

  // ------------------ SMOOTH LIQUID FILL ------------------
  function animateLiquid(obj, targetLevel, speed = 0.01) {
    function step() {
      obj.level = DSRT.Lab.fillLiquid(obj.level, targetLevel, speed);
      DSRT.Lab.testTube(obj.x, obj.y, obj.width, obj.height, obj.level, obj.color, obj.border);
      if (Math.abs(obj.level - targetLevel) > 0.001) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // ------------------ THERMOMETER MERCURY ANIMATION ------------------
  function animateThermometer(obj, targetTemp, speed = 0.2) {
    function step() {
      obj.temp += (targetTemp - obj.temp) * speed;
      DSRT.Lab.thermometer(obj.x, obj.y, obj.height, obj.temp, obj.minTemp, obj.maxTemp);
      if (Math.abs(obj.temp - targetTemp) > 0.1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // ------------------ BURNER FLAME FLICKER ------------------
  function animateBurner(obj) {
    function step() {
      DSRT.Lab.burner(obj.x, obj.y, obj.size, true);
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ------------------ BUBBLE ANIMATION ------------------
  function animateBubbles(obj, count = 5, speed = 1) {
    const bubbles = [];
    for (let i = 0; i < count; i++) {
      bubbles.push({
        x: obj.x + (Math.random() - 0.5) * obj.width,
        y: obj.y - Math.random() * obj.height,
        radius: 2 + Math.random() * 3,
        speed: speed * (0.5 + Math.random())
      });
    }

    function step() {
      const c = ctx();
      c.clearRect(obj.x - obj.width/2, obj.y - obj.height, obj.width, obj.height);
      bubbles.forEach(b => {
        b.y -= b.speed;
        if (b.y < obj.y - obj.height) b.y = obj.y;
        DSRT.Core.circle(b.x, b.y, b.radius, 1, "#000", obj.color);
      });
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ------------------ LAB SCENE ANIMATION ------------------
  function animateLabScene(x, y, options = {}) {
    const tube = {
      x: x,
      y: y,
      width: options.tubeWidth || 60,
      height: options.tubeHeight || 200,
      level: options.level || 0.3,
      color: options.tubeColor || "#00bfff",
      border: options.tubeBorder || "#000"
    };
    const thermometerObj = {
      x: x + 120,
      y: y,
      height: options.thermoHeight || 200,
      temp: options.temp || 25,
      minTemp: options.minTemp || 0,
      maxTemp: options.maxTemp || 100
    };
    const burnerObj = {
      x: x,
      y: y + 100,
      size: options.burnerSize || 40
    };
    const bubbleObj = {
      x: x,
      y: y,
      width: tube.width,
      height: tube.height,
      color: options.bubbleColor || "#b3ecff"
    };

    animateLiquid(tube, options.targetLevel || 0.8, options.liquidSpeed || 0.02);
    animateThermometer(thermometerObj, options.targetTemp || 70, options.thermoSpeed || 0.1);
    animateBurner(burnerObj);
    animateBubbles(bubbleObj, options.bubbleCount || 8, options.bubbleSpeed || 1);
  }

  return {
    animateLiquid,
    animateThermometer,
    animateBurner,
    animateBubbles,
    animateLabScene
  };

})();
