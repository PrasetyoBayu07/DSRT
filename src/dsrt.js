// src/dsrt.js
// ==============================================
// DSRT Main Integration Layer
// ==============================================

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

// Combine everything into one unified DSRT namespace
export const DSRT = {
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

export default DSRT;
