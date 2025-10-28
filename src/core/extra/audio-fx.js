// src/extra/audio-fx.js
// ============================================================
// DSRT ENGINE EXTRA: AUDIO FX MODULE
// Adds 3D spatial sound, fade effects, and dynamic filters
// ============================================================

var DSRT = DSRT || {};
DSRT.Extra = DSRT.Extra || {};

DSRT.Extra.AudioFX = (function () {

  function fadeIn(name, duration = 1.0) {
    const sound = DSRT.Audio.getSound(name);
    if (!sound) return;
    let t = 0;
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
    let t = 1;
    const step = 1 / (duration * 60);
    const interval = setInterval(() => {
      sound.volume = Math.max(0, sound.volume - step);
      if (sound.volume <= 0) {
        DSRT.Audio.stop(name);
        clearInterval(interval);
      }
    }, 1000 / 60);
  }

  // Contoh 3D positional audio (dummy)
  function spatial(name, x, y, listenerX, listenerY) {
    const sound = DSRT.Audio.getSound(name);
    if (!sound) return;
    const dist = Math.sqrt((x - listenerX) ** 2 + (y - listenerY) ** 2);
    const volume = Math.max(0, 1 - dist / 300);
    sound.volume = volume * DSRT.Audio.getMasterVolume();
  }

  return {
    fadeIn,
    fadeOut,
    spatial
  };

})();
