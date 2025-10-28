// src/core/loader.js

// ============================================================
// DSRT ENGINE LOADER MODULE
// Handles image, audio, and asset preloading with progress bar
// ============================================================

var DSRT = DSRT || {};

DSRT.Loader = (function () {

  const ctx = () => DSRT.Core.getContext();

  const images = {};
  const sounds = {};
  let totalAssets = 0;
  let loadedAssets = 0;
  let folder = "assets";
  let onComplete = null;

  // ========== LOAD IMAGE ==========
  function loadImage(name, file) {
    totalAssets++;
    const img = new Image();
    img.onload = () => {
      images[name] = img;
      loadedAssets++;
    };
    img.onerror = () => {
      console.warn(`⚠️ Failed to load image: ${file}`);
      loadedAssets++;
    };
    img.src = `${folder}/${file}`;
  }

  // ========== LOAD SOUND ==========
  function loadSound(name, file) {
    totalAssets++;
    const audio = new Audio();
    audio.oncanplaythrough = () => {
      sounds[name] = audio;
      loadedAssets++;
    };
    audio.onerror = () => {
      console.warn(`⚠️ Failed to load sound: ${file}`);
      loadedAssets++;
    };
    audio.src = `${folder}/${file}`;
  }

  // ========== LOAD MULTIPLE IMAGES ==========
  function loadImages(list) {
    for (let key in list) {
      loadImage(key, list[key]);
    }
  }

  // ========== LOAD MULTIPLE SOUNDS ==========
  function loadSounds(list) {
    for (let key in list) {
      loadSound(key, list[key]);
    }
  }

  // ========== MAIN LOADING FUNCTION ==========
  function loading(imagesList, soundsList, callback) {
    totalAssets = 0;
    loadedAssets = 0;
    onComplete = callback;

    loadImages(imagesList);
    loadSounds(soundsList);

    requestAnimationFrame(checkLoad);
  }

  function checkLoad() {
    drawLoadingScreen();
    if (loadedAssets >= totalAssets && totalAssets > 0) {
      if (onComplete) onComplete();
    } else {
      requestAnimationFrame(checkLoad);
    }
  }

  // ========== DRAW LOADING BAR ==========
  function drawLoadingScreen() {
    const c = ctx();
    const w = 300;
    const h = 20;
    const x = 450;
    const y = 300;
    const progress = totalAssets > 0 ? loadedAssets / totalAssets : 0;

    DSRT.Core.clearScreen("#67d2d6");
    DSRT.Core.text("Loading...", 600, 250, "bold 18pt Calibri", "#000");
    c.strokeStyle = "#000";
    c.lineWidth = 2;
    c.strokeRect(x, y, w, h);
    c.fillStyle = "#007acc";
    c.fillRect(x, y, w * progress, h);
    c.fillStyle = "#000";
    DSRT.Core.text(`${Math.floor(progress * 100)}%`, 600, 335, "14pt Consolas", "#000");
  }

  // ========== GETTERS ==========
  function getImage(name) {
    return images[name];
  }

  function getSound(name) {
    return sounds[name];
  }

  function setFolder(path) {
    folder = path;
  }

  return {
    images,
    sounds,
    totalAssets,
    loadedAssets,
    folder,
    loadImage,
    loadSound,
    loadImages,
    loadSounds,
    loading,
    getImage,
    getSound,
    setFolder
  };

})();
