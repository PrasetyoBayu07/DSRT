// src/index.js
// Import 
import './core.js';
import './graphics.js';
import './particles.js';
import './ui.js';
import './runtime.js';
import './loader.js';
import './audio.js';
import './lab.js';
import './utils.js';
import './dsrt-3d.js';

// Namespace utama
var DSRT = window.DSRT || {};

// Pastikan modul ada
DSRT.Core      = DSRT.Core      || {};
DSRT.Graphics  = DSRT.Graphics  || {};
DSRT.Particles = DSRT.Particles || {};
DSRT.UI        = DSRT.UI        || {};
DSRT.Runtime   = DSRT.Runtime   || {};
DSRT.Loader    = DSRT.Loader    || {};
DSRT.Audio     = DSRT.Audio     || {};
DSRT.Lab       = DSRT.Lab       || {};
DSRT.Utils     = DSRT.Utils     || {};
DSRT.ThreeD    = DSRT.ThreeD    || {};

// ------------------ Core shortcuts ------------------
DSRT.init      = (canvasId="scene", size) => DSRT.Core.initCanvas(canvasId, size);
DSRT.clear     = DSRT.Core.clearScreen;
DSRT.rect      = DSRT.Core.rect;
DSRT.circle    = DSRT.Core.circle;
DSRT.line      = DSRT.Core.line;
DSRT.text      = DSRT.Core.text;
DSRT.rectRounded = DSRT.Core.rectRounded;
DSRT.image     = DSRT.Core.image;
DSRT.imageFull = DSRT.Core.imageFull;
DSRT.imageRotated = DSRT.Core.imageRotated;
DSRT.arrow     = DSRT.Core.arrow;

// ------------------ Graphics shortcuts ------------------
DSRT.grid      = DSRT.Graphics.grid;
DSRT.cartesian = DSRT.Graphics.cartesian;
DSRT.gear      = DSRT.Graphics.gear;
DSRT.spring    = DSRT.Graphics.spring;
DSRT.wheel     = DSRT.Graphics.wheel;
DSRT.graph     = DSRT.Graphics.graph;
DSRT.vector    = DSRT.Graphics.vector;

// ------------------ Particles ------------------
DSRT.fire      = DSRT.Particles.fire;
DSRT.smoke     = DSRT.Particles.smoke;
DSRT.water     = DSRT.Particles.water;
DSRT.bubbles   = DSRT.Particles.bubbles;
DSRT.updateParticles = DSRT.Particles.update;
DSRT.drawParticles   = DSRT.Particles.draw;

// ------------------ UI ------------------
DSRT.button     = DSRT.UI.button;
DSRT.textButton = DSRT.UI.textButton;
DSRT.slider     = DSRT.UI.slider;
DSRT.draggable  = DSRT.UI.draggable;
DSRT.inputBox   = DSRT.UI.inputBox;
DSRT.resetClick = DSRT.UI.resetClick;

// ------------------ Lab tools ------------------
DSRT.testTube   = DSRT.Lab.testTube;
DSRT.thermometer= DSRT.Lab.thermometer;
DSRT.burner     = DSRT.Lab.burner;
DSRT.beaker     = DSRT.Lab.beaker;

// ------------------ Runtime ------------------
DSRT.start      = DSRT.Runtime.run;
DSRT.stop       = DSRT.Runtime.stop;
DSRT.runScene   = DSRT.Runtime.runScene;

// ------------------ Loader ------------------
DSRT.loadImages = DSRT.Loader.loadImages;
DSRT.loadSounds = DSRT.Loader.loadSounds;
DSRT.loadAll    = DSRT.Loader.loadAll || DSRT.Loader.loading;
DSRT.setAssetFolder = path => {
    if(DSRT.Loader.setFolder) DSRT.Loader.setFolder(path);
    else DSRT.Loader.folder = path;
};

// ------------------ 3D ------------------
DSRT.add3D       = obj => { if(DSRT.ThreeD.add) DSRT.ThreeD.add(obj); };

// ------------------ Audio ------------------
DSRT.playSound   = (name, loop=false, vol=1.0) => {
    if(DSRT.Audio.play) DSRT.Audio.play(name, loop, vol);
};

// ------------------ Utils ------------------
DSRT.random      = DSRT.Utils.random || (()=>Math.random());
DSRT.distance    = DSRT.Utils.distance || (()=>0);
DSRT.rgbToHex    = DSRT.Utils.rgbToHex || (()=>"#000");

// ------------------ Attach to window ------------------
window.DSRT = DSRT;

console.log(`[DSRT] Full Engine loaded — ready to use`);
