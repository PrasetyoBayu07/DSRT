// ==============================================
// DSRT — Dynamic Simulation & Rendering Toolkit
// Main Integration Layer
// ==============================================

/**
 * @file dsrt.js
 * @description DSRT Main Integration Layer — combines all core, UI, graphics, physics, and lab modules.
 * @version 1.0.0
 * @license MIT
 */

import * as Canvas from './core/canvas.js';
import * as Utils from './core/utils.js';
import * as Bool from './core/boolean.js';
import * as Flow from './core/flow.js';

import * as UIButtons from './ui/buttons.js';
import * as UISliders from './ui/sliders.js';
import * as UIInputs from './ui/inputs.js';
import * as UIDrag from './ui/drag.js';

import * as Draw from './graphics/draw.js';
import * as Text from './graphics/text.js';
import * as Chart from './graphics/chart.js';

import * as Particles from './physics/particles.js';
import * as Mechanics from './physics/mechanics.js';

import * as LabBeaker from './lab/beaker.js';
import * as LabThermometer from './lab/thermometer.js';
import * as LabBurner from './lab/burner.js';

/**
 * @namespace DSRT
 * @description Dynamic Simulation & Rendering Toolkit (DSRT)
 * A modular ES6-based 2D simulation and rendering framework for interactive visual computation.
 *
 * @property {string} name - Toolkit name
 * @property {string} version - Current release version
 * @property {string} build - Build timestamp (ISO string)
 * @property {object} Canvas - Canvas and rendering core modules
 * @property {object} Utils - Utility and helper functions
 * @property {object} Bool - Boolean and logic systems
 * @property {object} Flow - Flow-based visual programming utilities
 * @property {object} UI - User interface modules (buttons, sliders, inputs, drag)
 * @property {object} Graphics - Drawing, text, and chart rendering modules
 * @property {object} Physics - Particle and mechanics simulation systems
 * @property {object} Lab - Laboratory simulation components (beaker, thermometer, burner)
 */
export const DSRT = {
  name: 'DSRT',
  version: '1.0.0',
  build: new Date().toISOString(),

  Canvas,
  Utils,
  Bool,
  Flow,

  UI: {
    Buttons: UIButtons,
    Sliders: UISliders,
    Inputs: UIInputs,
    Drag: UIDrag,
  },

  Graphics: {
    Draw,
    Text,
    Chart,
  },

  Physics: {
    Particles,
    Mechanics,
  },

  Lab: {
    Beaker: LabBeaker,
    Thermometer: LabThermometer,
    Burner: LabBurner,
  },
};

// ✅ Optional: attach DSRT globally (browser only)
if (typeof window !== 'undefined') {
  window.DSRT = DSRT;
  console.info(`✅ DSRT v${DSRT.version} initialized at ${DSRT.build}`);
}

export default DSRT;
