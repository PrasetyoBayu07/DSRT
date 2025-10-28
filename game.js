"use strict";

/**
 * Game Main Script (Ported for CanvasEngine)
 * ------------------------------------------
 * This is the modern ES6 version of your original `game.js`,
 * adapted to work seamlessly with the modular CanvasEngine system.
 */

import * as CE from "./engine/index.js";

//===========================//
//     Game Configuration    //
//===========================//

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 600;
const ASSET_PATH = "assets";

const images = {
  logo: `${ASSET_PATH}/logo.png`,
  startBtn: `${ASSET_PATH}/tombolStart.png`,
  cover: `${ASSET_PATH}/cover.jpg`,
  playBtn: `${ASSET_PATH}/btn-play.png`,
  maxBtn: `${ASSET_PATH}/maxBtn.png`,
  minBtn: `${ASSET_PATH}/minBtn.png`
};

const sounds = {}; // not used yet

let loadedImages = {};

//===========================//
//     Game Initialization   //
//===========================//

/**
 * Initialize the game canvas and start loading assets.
 */
export function initGame() {
  const { canvas } = CE.initCanvas("scene");
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;

  CE.preloadImages(Object.values(images), (loaded) => {
    loadedImages = Object.fromEntries(
      loaded.map((item) => [item.url.split("/").pop().replace(/\.[^/.]+$/, ""), item.img])
    );
    startScreen();
  });
}

//===========================//
//        Start Screen       //
//===========================//

function startScreen() {
  CE.clearScreen("#67d2d6");
  CE.drawImage(loadedImages.logo, 600 - 150, 250 - 75); // adjust for centering
  const btn = {
    id: "start",
    ...CE.button("Start", 540, 350, 120, 40, "bold 14pt Calibri", "#fff", "#1a8")
  };

  // handle click
  setupClickHandler((x, y) => {
    const pressed = CE.checkButton(x, y);
    if (pressed === "Start") coverScreen();
  });
}

//===========================//
//        Cover Screen       //
//===========================//

function coverScreen() {
  CE.clearScreen("#67d2d6");
  CE.drawImage(loadedImages.cover, 0, 0);

  const playBtn = CE.button("Play", 1040, 500, 120, 40, "bold 14pt Calibri", "#fff", "#333");

  setupClickHandler((x, y) => {
    const pressed = CE.checkButton(x, y);
    if (pressed === "Play") {
      setInitialState();
      runGameLoop();
    }
  });
}

//===========================//
//      Game Loop Setup      //
//===========================//

let gameRunning = false;
let loopId = null;

/**
 * Prepare variables before game starts.
 */
function setInitialState() {
  // Example: you can initialize player, enemies, etc.
  gameRunning = true;
}

/**
 * Run the main game loop.
 */
function runGameLoop() {
  function loop() {
    if (!gameRunning) return;
    CE.clearScreen("#67d2d6");

    // Example placeholder (replace with your logic)
    CE.drawText("Game is running...", GAME_WIDTH / 2, GAME_HEIGHT / 2, "bold 18pt Calibri", "#fff");

    loopId = requestAnimationFrame(loop);
  }

  loop();
}

/**
 * Stop the game loop.
 */
function stopGame() {
  gameRunning = false;
  cancelAnimationFrame(loopId);
}

//===========================//
//   Canvas Input Handling   //
//===========================//

/**
 * Attach click handler for buttons.
 */
function setupClickHandler(callback) {
  const { canvas } = CE;
  if (!canvas) return;
  canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    callback(mx, my);
  };
}
