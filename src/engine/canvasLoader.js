"use strict";

/**
 * CanvasEngine Loader Module
 * --------------------------
 * Handles image preloading and basic loading bar visualization.
 * 100% functionally equivalent to the original system.
 */

import { ctx, canvas } from "./canvasCore.js";

//===========================//
//     Image Preloading      //
//===========================//

let imageDB = [];
let loadedImages = 0;
let totalImages = 0;
let onComplete = null;

/**
 * Prepare image list for preloading.
 * @param {string[]} urls - List of image URLs to load.
 * @param {function} callback - Function to run when all images are loaded.
 */
export function preloadImages(urls, callback) {
  imageDB = [];
  loadedImages = 0;
  totalImages = urls.length;
  onComplete = callback;

  urls.forEach(url => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      loadedImages++;
      drawLoadingBar();
      if (loadedImages === totalImages && typeof onComplete === "function") {
        onComplete(imageDB);
      }
    };
    imageDB.push({ url, img });
  });
}

/**
 * Draw a simple loading bar on the canvas.
 */
export function drawLoadingBar() {
  const progress = totalImages ? loadedImages / totalImages : 0;
  const w = canvas.width * 0.6;
  const h = 25;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = "#44aaff";
  ctx.fillRect(x, y, w * progress, h);

  ctx.font = "bold 14pt Calibri";
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";
  ctx.fillText(`Loading... ${Math.round(progress * 100)}%`, canvas.width / 2, y - 10);
}

/**
 * Get an image object by its URL.
 */
export function getImage(url) {
  const found = imageDB.find(i => i.url === url);
  return found ? found.img : null;
}

/**
 * Reset loader state.
 */
export function resetLoader() {
  imageDB = [];
  loadedImages = 0;
  totalImages = 0;
  onComplete = null;
}
