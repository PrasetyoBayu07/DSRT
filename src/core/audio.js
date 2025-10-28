// src/core/audio.js

// ============================================================
// DSRT ENGINE AUDIO MODULE
// Handles sound effects, music, and audio control
// ============================================================

var DSRT = DSRT || {};

DSRT.Audio = (function () {

  const sounds = {};
  let masterVolume = 1.0;

  // ========== LOAD AUDIO ==========
  function load(name, src) {
    const audio = new Audio(src);
    audio.preload = "auto";
    sounds[name] = {
      element: audio,
      playing: false,
      loop: false,
      volume: 1.0
    };
    console.log(`[DSRT] Loaded audio: ${name}`);
  }

  // ========== PLAY SOUND ==========
  function play(name, loop = false, volume = 1.0) {
    const s = sounds[name];
    if (!s) {
      console.warn(`[DSRT] Sound not found: ${name}`);
      return;
    }
    s.element.pause();
    s.element.currentTime = 0;
    s.element.loop = loop;
    s.element.volume = volume * masterVolume;
    s.element.play();
    s.playing = true;
    s.loop = loop;
  }

  // ========== STOP SOUND ==========
  function stop(name) {
    const s = sounds[name];
    if (s) {
      s.element.pause();
      s.element.currentTime = 0;
      s.playing = false;
    }
  }

  // ========== PAUSE / RESUME ==========
  function pause(name) {
    const s = sounds[name];
    if (s && s.playing) {
      s.element.pause();
      s.playing = false;
    }
  }

  function resume(name) {
    const s = sounds[name];
    if (s && !s.playing) {
      s.element.play();
      s.playing = true;
    }
  }

  // ========== VOLUME CONTROL ==========
  function setVolume(name, volume) {
    const s = sounds[name];
    if (s) {
      s.volume = volume;
      s.element.volume = volume * masterVolume;
    }
  }

  function setMasterVolume(volume) {
    masterVolume = Math.max(0, Math.min(1, volume));
    for (const key in sounds) {
      const s = sounds[key];
      s.element.volume = s.volume * masterVolume;
    }
  }

  // ========== LOOP HANDLING ==========
  function toggleLoop(name) {
    const s = sounds[name];
    if (s) {
      s.loop = !s.loop;
      s.element.loop = s.loop;
    }
  }

  // ========== MUTE / UNMUTE ==========
  function mute(name) {
    const s = sounds[name];
    if (s) s.element.muted = true;
  }

  function unmute(name) {
    const s = sounds[name];
    if (s) s.element.muted = false;
  }

  function muteAll() {
    for (const key in sounds) {
      sounds[key].element.muted = true;
    }
  }

  function unmuteAll() {
    for (const key in sounds) {
      sounds[key].element.muted = false;
    }
  }

  // ========== CHECK STATUS ==========
  function isPlaying(name) {
    const s = sounds[name];
    return s ? !s.element.paused : false;
  }

  // ========== CLEANUP ==========
  function stopAll() {
    for (const key in sounds) stop(key);
  }

  // ========== PUBLIC API ==========
  return {
    sounds,
    load,
    play,
    stop,
    pause,
    resume,
    setVolume,
    setMasterVolume,
    toggleLoop,
    mute,
    unmute,
    muteAll,
    unmuteAll,
    isPlaying,
    stopAll
  };

})();
