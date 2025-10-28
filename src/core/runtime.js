// src/core/runtime.js

// ============================================================
// DSRT ENGINE RUNTIME MODULE
// Core game loop, scene management, screen handling
// ============================================================

var DSRT = DSRT || {};

DSRT.Runtime = (function () {

  let canvas, ctx;
  let currentScene = null;
  let nextScene = null;
  let frame = 0;
  let lastTime = 0;
  let deltaTime = 0;
  let gameWidth = 800;
  let gameHeight = 600;
  let paused = false;
  let fullScreen = false;

  // ========== INITIALIZE CANVAS ==========
  function setGame(size = "800x600") {
    const [w, h] = size.split("x").map(Number);
    gameWidth = w;
    gameHeight = h;

    canvas = document.createElement("canvas");
    canvas.width = gameWidth;
    canvas.height = gameHeight;
    canvas.style.background = "#fff";
    document.body.style.margin = "0";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");

    DSRT.Core.setContext(ctx);
    DSRT.UI.initEvents();

    console.log(`[DSRT] Game initialized: ${w}x${h}`);
  }

  // ========== CLEAR SCREEN ==========
  function clearScreen(color = "#ffffff") {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // ========== RUN A SCENE ==========
  function run(sceneFunction) {
    currentScene = sceneFunction;
    lastTime = performance.now();
    frame = 0;
    requestAnimationFrame(loop);
  }

  function loop(time) {
    if (paused) return;
    deltaTime = (time - lastTime) / 1000;
    lastTime = time;
    frame++;

    if (typeof currentScene === "function") currentScene(deltaTime);

    DSRT.Particles.update(deltaTime);
    DSRT.Particles.draw();

    DSRT.UI.resetClick();
    requestAnimationFrame(loop);
  }

  // ========== SWITCH SCENE ==========
  function setScene(scene) {
    nextScene = scene;
  }

  function updateScene() {
    if (nextScene) {
      currentScene = nextScene;
      nextScene = null;
    }
  }

  // ========== RESIZE BUTTON (Fullscreen Toggle) ==========
  function resizeBtn(x = 50, y = 50) {
    const btn = DSRT.UI.textButton(fullScreen ? "Minimize" : "Maximize", x, y, 100, 40, "#444");
    if (DSRT.UI.pressed(btn)) toggleFullScreen();
  }

  // ========== FULLSCREEN HANDLER ==========
  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      canvas.requestFullscreen();
      fullScreen = true;
    } else {
      document.exitFullscreen();
      fullScreen = false;
    }
  }

  // ========== PAUSE / RESUME ==========
  function pause() {
    paused = true;
  }

  function resume() {
    paused = false;
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  // ========== UTILITY ==========
  function getCanvas() {
    return canvas;
  }

  function getContext() {
    return ctx;
  }

  function getDeltaTime() {
    return deltaTime;
  }

  function getFrame() {
    return frame;
  }

  function getSize() {
    return { width: gameWidth, height: gameHeight };
  }

  return {
    setGame,
    clearScreen,
    run,
    loop,
    setScene,
    updateScene,
    resizeBtn,
    toggleFullScreen,
    pause,
    resume,
    getCanvas,
    getContext,
    getDeltaTime,
    getFrame,
    getSize
  };

})();
