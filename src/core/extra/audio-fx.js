// src/extra/audio-fx.js
// ============================================================
// DSRT ENGINE EXTRA: AUDIO FX MODULE (FULL UPGRADE)
// Adds smooth fade, 3D spatial, and Web Audio API support
// ============================================================

var DSRT = DSRT || {};
DSRT.Extra = DSRT.Extra || {};

DSRT.Extra.AudioFX = (function () {

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const nodes = {}; // store GainNode & PannerNode per sound

  // ------------------ OLD FUNCTIONS ------------------
  function fadeIn(name, duration = 1.0) {
    const sound = DSRT.Audio.getSound(name);
    if (!sound) return;
    const step = 1 / (duration * 60);
    sound.volume = 0;
    const interval = setInterval(() => {
      sound.volume = Math.min(1, sound.volume + step);
      if (sound.volume >= 1) clearInterval(interval);
    }, 1000 / 60);
  }

  function fadeOut(name, duration = 1.0) {
    const sound = DSRT.Audio.getSound(name);
    if (!sound) return;
    const step = 1 / (duration * 60);
    const interval = setInterval(() => {
      sound.volume = Math.max(0, sound.volume - step);
      if (sound.volume <= 0) {
        DSRT.Audio.stop(name);
        clearInterval(interval);
      }
    }, 1000 / 60);
  }

  function spatial(name, x, y, listenerX, listenerY) {
    const sound = DSRT.Audio.getSound(name);
    if (!sound) return;
    const distance = Math.sqrt((x - listenerX) ** 2 + (y - listenerY) ** 2);
    const volume = Math.max(0, 1 - distance / 300);
    sound.volume = volume * DSRT.Audio.getMasterVolume();
  }

  // ------------------ SMOOTH FUNCTIONS ------------------
  function fadeInSmooth(name, duration = 1.0, onComplete = null) {
    const sObj = DSRT.Audio.sounds[name];
    const sound = DSRT.Audio.getSound(name);
    if (!sound || !sObj) return;

    const targetVolume = sObj.volume * DSRT.Audio.getMasterVolume();
    let currentVolume = 0;
    sound.volume = 0;

    function step() {
      currentVolume += targetVolume / (duration * 60);
      if (currentVolume >= targetVolume) {
        sound.volume = targetVolume;
        if (typeof onComplete === "function") onComplete(name, "fadeIn");
        return;
      }
      sound.volume = currentVolume;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function fadeOutSmooth(name, duration = 1.0, onComplete = null) {
    const sObj = DSRT.Audio.sounds[name];
    const sound = DSRT.Audio.getSound(name);
    if (!sound || !sObj) return;

    const startVolume = sound.volume;
    let currentVolume = startVolume;

    function step() {
      currentVolume -= startVolume / (duration * 60);
      if (currentVolume <= 0) {
        sound.volume = 0;
        DSRT.Audio.stop(name);
        if (typeof onComplete === "function") onComplete(name, "fadeOut");
        return;
      }
      sound.volume = currentVolume;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function spatial3D(name, x, y, listenerX, listenerY) {
    const sObj = DSRT.Audio.sounds[name];
    const sound = DSRT.Audio.getSound(name);
    if (!sound || !sObj) return;

    const dx = x - listenerX;
    const dy = y - listenerY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const maxDistance = 300;

    let volume = Math.max(0, 1 - distance / maxDistance);
    volume *= sObj.volume * DSRT.Audio.getMasterVolume();
    sound.volume = volume;

    if (typeof sound.pan !== "undefined") {
      sound.pan.value = Math.max(-1, Math.min(1, dx / maxDistance));
    }
  }

  // ------------------ WEB AUDIO API FUNCTIONS ------------------
  function _createNode(name) {
    if (nodes[name]) return nodes[name];
    const sObj = DSRT.Audio.sounds[name];
    const sound = DSRT.Audio.getSound(name);
    if (!sound || !sObj) return null;

    const track = audioCtx.createMediaElementSource(sound);
    const gainNode = audioCtx.createGain();
    const panner = audioCtx.createStereoPanner();

    track.connect(gainNode).connect(panner).connect(audioCtx.destination);

    nodes[name] = { gainNode, panner };
    return nodes[name];
  }

  function fadeInWeb(name, duration = 1.0, onComplete = null) {
    const nodeObj = _createNode(name);
    const sObj = DSRT.Audio.sounds[name];
    if (!nodeObj || !sObj) return;

    const gain = nodeObj.gainNode.gain;
    const target = sObj.volume * DSRT.Audio.getMasterVolume();
    gain.setValueAtTime(0, audioCtx.currentTime);
    gain.linearRampToValueAtTime(target, audioCtx.currentTime + duration);

    if (typeof onComplete === "function") {
      setTimeout(() => onComplete(name, "fadeInWeb"), duration * 1000);
    }
  }

  function fadeOutWeb(name, duration = 1.0, onComplete = null) {
    const nodeObj = _createNode(name);
    const sObj = DSRT.Audio.sounds[name];
    if (!nodeObj || !sObj) return;

    const gain = nodeObj.gainNode.gain;
    const current = sObj.volume * DSRT.Audio.getMasterVolume();
    gain.setValueAtTime(current, audioCtx.currentTime);
    gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

    if (typeof onComplete === "function") {
      setTimeout(() => {
        DSRT.Audio.stop(name);
        onComplete(name, "fadeOutWeb");
      }, duration * 1000);
    }
  }

  function spatial3DWeb(name, x, y, listenerX, listenerY) {
    const nodeObj = _createNode(name);
    const sObj = DSRT.Audio.sounds[name];
    const sound = DSRT.Audio.getSound(name);
    if (!nodeObj || !sObj || !sound) return;

    const dx = x - listenerX;
    const dy = y - listenerY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const maxDistance = 300;

    const volume = Math.max(0, 1 - distance / maxDistance) * sObj.volume * DSRT.Audio.getMasterVolume();
    nodeObj.gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);

    const pan = Math.max(-1, Math.min(1, dx / maxDistance));
    nodeObj.panner.pan.setValueAtTime(pan, audioCtx.currentTime);
  }

  return {
    fadeIn,
    fadeOut,
    spatial,
    fadeInSmooth,
    fadeOutSmooth,
    spatial3D,
    fadeInWeb,
    fadeOutWeb,
    spatial3DWeb
  };

})();
