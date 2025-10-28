// src/core/dsrt-engine.js

// ============================================================
// DSRT ENGINE — INTEGRATION / BOOTSTRAP
// Combines all DSRT modules into one coherent API surface.
// Place this file after all modular files are loaded.
// ============================================================

var DSRT = DSRT || {};

// Version info
DSRT.__version = "DSRT-modular-1.0";
DSRT.__buildDate = (new Date()).toISOString();

// Ensure expected submodules exist and warn if missing
(function () {
  const required = [
    "Core", "UI", "Graphics", "Particles",
    "Lab", "Loader", "Utils", "Runtime",
    "ThreeD", "Audio"
  ];

  for (const name of required) {
    if (!DSRT[name]) {
      console.warn(`[DSRT] Warning: DSRT.${name} not found. Some features may be unavailable.`);
      // create a safe placeholder to avoid runtime errors
      DSRT[name] = DSRT[name] || {};
    }
  }
})();

// ---- Convenience aliases for commonly used functions ----
DSRT.init = function (canvasId = "scene", size = null) {
  if (size) DSRT.Core.initCanvas(canvasId, size);
  else DSRT.Core.initCanvas(canvasId);
  // Hook up UI events if present
  if (DSRT.UI && typeof DSRT.UI.initEvents === "function") DSRT.UI.initEvents();
  // Set loader folder fallback
  if (DSRT.Loader && typeof DSRT.Loader.setFolder === "function" && !DSRT.Loader.folder) {
    DSRT.Loader.setFolder("assets");
  }
  return DSRT;
};

// Shortcuts
DSRT.start = function (sceneFunc) {
  if (DSRT.Runtime && typeof DSRT.Runtime.run === "function") {
    DSRT.Runtime.run(sceneFunc);
  } else {
    console.error("[DSRT] Runtime.run() not available.");
  }
};

DSRT.load = function (images = {}, sounds = {}, onComplete = null) {
  if (DSRT.Loader && typeof DSRT.Loader.loading === "function") {
    // older loader uses .loading(images, sounds, cb)
    if (DSRT.Loader.loading.length >= 3) {
      DSRT.Loader.loading(images, sounds, onComplete);
    } else if (typeof DSRT.Loader.loadAll === "function") {
      DSRT.Loader.loadAll(images, sounds, onComplete);
    } else {
      // fallback: try loadImages + loadSounds
      if (typeof DSRT.Loader.loadImages === "function") DSRT.Loader.loadImages(images);
      if (typeof DSRT.Loader.loadSounds === "function") DSRT.Loader.loadSounds(sounds);
      if (onComplete) onComplete();
    }
  } else {
    console.warn("[DSRT] Loader module missing; invoking callback immediately.");
    if (onComplete) onComplete();
  }
};

// Drawing shortcuts mapped to Core
DSRT.clear = DSRT.Core.clearScreen || (DSRT.Core.clear || function (c) { console.warn("clear not found"); });
DSRT.text = DSRT.Core.text;
DSRT.rect = DSRT.Core.rect;
DSRT.circle = DSRT.Core.circle;
DSRT.line = DSRT.Core.line;
DSRT.image = DSRT.Core.image;
DSRT.imageFull = DSRT.Core.imageFull;
DSRT.arrow = DSRT.Core.arrow;
DSRT.rectRounded = DSRT.Core.rectRounded;
DSRT.imageRotated = DSRT.Core.imageRotated;

// UI shortcuts
DSRT.button = DSRT.UI.button;
DSRT.textButton = DSRT.UI.textButton;
DSRT.slider = DSRT.UI.slider;
DSRT.draggable = DSRT.UI.draggable;
DSRT.inputBox = DSRT.UI.inputBox;
DSRT.resetClick = DSRT.UI.resetClick;

// Graphics shortcuts
DSRT.grid = DSRT.Graphics.grid;
DSRT.cartesian = DSRT.Graphics.cartesian;
DSRT.gear = DSRT.Graphics.gear;
DSRT.spring = DSRT.Graphics.spring;
DSRT.wheel = DSRT.Graphics.wheel;
DSRT.graph = DSRT.Graphics.graph;
DSRT.vector = DSRT.Graphics.vector;

// Particles
DSRT.particles = DSRT.Particles;
DSRT.fire = DSRT.Particles.fire;
DSRT.smoke = DSRT.Particles.smoke;
DSRT.water = DSRT.Particles.water;
DSRT.bubbles = DSRT.Particles.bubbles;
DSRT.updateParticles = DSRT.Particles.update;
DSRT.drawParticles = DSRT.Particles.draw;

// Lab tools
DSRT.lab = DSRT.Lab;
DSRT.testTube = DSRT.Lab.testTube;
DSRT.thermometer = DSRT.Lab.thermometer;
DSRT.burner = DSRT.Lab.burner;
DSRT.beaker = DSRT.Lab.beaker;

// Loader
DSRT.Loader = DSRT.Loader || {};
DSRT.loadImages = DSRT.Loader.loadImages || DSRT.Loader.loadImages;
DSRT.loadSounds = DSRT.Loader.loadSounds || DSRT.Loader.loadSounds;
DSRT.loadAll = DSRT.Loader.loadAll || DSRT.Loader.loading || DSRT.Loader.loadAll;
DSRT.setAssetFolder = function (path) {
  if (DSRT.Loader && typeof DSRT.Loader.setFolder === "function") DSRT.Loader.setFolder(path);
  else DSRT.Loader.folder = path;
};

// Utils (alias)
DSRT.Utils = DSRT.Utils || {};
DSRT.random = DSRT.Utils.random || function () { return Math.random(); };
DSRT.distance = DSRT.Utils.distance || function () { return 0; };
DSRT.rgbToHex = DSRT.Utils.rgbToHex || function () { return "#000"; };

// Runtime
DSRT.runScene = function (fn) {
  if (DSRT.Runtime && typeof DSRT.Runtime.run === "function") DSRT.Runtime.run(fn);
  else console.error("[DSRT] Runtime.run not found");
};
DSRT.stopScene = function () { if (DSRT.Runtime && DSRT.Runtime.stop) DSRT.Runtime.stop(); };

// 3D
DSRT.ThreeD = DSRT.ThreeD || {};
DSRT.add3D = function (obj) {
  if (DSRT.ThreeD && typeof DSRT.ThreeD.add === "function") DSRT.ThreeD.add(obj);
};

// Audio
DSRT.Audio = DSRT.Audio || {};
DSRT.playSound = function (name, loop, vol) {
  if (DSRT.Audio && typeof DSRT.Audio.play === "function") DSRT.Audio.play(name, loop, vol || 1.0);
};

// Small help: attach to window for direct access in older projects
if (typeof window !== "undefined") {
  window.DSRT = DSRT;
}

// End of integration file
console.log(`[DSRT] Engine integrated — version ${DSRT.__version}`);
