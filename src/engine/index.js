"use strict";

/**
 * CanvasEngine - Main Export Module
 * ---------------------------------
 * This file imports all individual engine modules and exports them together
 * as a single, unified namespace: CanvasEngine.
 * 
 * Usage Example:
 * import * as CE from './engine/index.js';
 * CE.initCanvas('scene');
 * CE.button('Start', 100, 100, 120, 40);
 * CE.fire({ x: 200, y: 400 });
 */

//===========================//
//        Imports            //
//===========================//

import * as Core from "./canvasCore.js";
import * as UI from "./canvasUI.js";
import * as Physics from "./canvasPhysics.js";
import * as Effects from "./canvasEffects.js";
import * as Objects from "./canvasObjects.js";
import * as Loader from "./canvasLoader.js";

//===========================//
//       Combined Export     //
//===========================//

export const CanvasEngine = {
  // Core
  ...Core,

  // UI
  ...UI,

  // Physics
  ...Physics,

  // Effects
  ...Effects,

  // Objects
  ...Objects,

  // Loader
  ...Loader,
};

//===========================//
//    Default Export Alias   //
//===========================//

export default CanvasEngine;
