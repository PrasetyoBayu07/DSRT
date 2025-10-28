// src/core/audio.js
// ============================================================
// DSRT ENGINE AUDIO MODULE
// Handles sound effects, music, and audio control (Enhanced + Hook Support)
// ============================================================

var DSRT = DSRT || {};

DSRT.Audio = (function () {

  const sounds = {};
  let masterVolume = 1.0;
  let audioEnabled = true;
  let onAudioStateChange = null; // <== optional event hook

  function _checkSound(name) {
    if (!sounds[name]) {
      console.warn(`[DSRT.Audio] Sound not found: ${name}`);
      return null;
    }
    return sounds[name];
  }

  // ====== Load Audio ======
  function load(name, src, { loop = false, volume = 1.0 } = {}) {
    if (!src) return console.warn(`[DSRT.Audio] Invalid source for: ${name}`);

    const audio = new Audio(src);
    audio.preload = "auto";
    audio.loop = loop;
    audio.volume = volume * masterVolume;

    sounds[name] = { element: audio, playing: false, loop, volume };

    audio.addEventListener("error", e => {
      console.error(`[DSRT.Audio] Failed to load '${name}':`, e);
    });

    console.log(`[DSRT.Audio] Loaded audio: ${name}`);
  }

  // ====== Play Sound ======
  async function play(name, loop = false, volume = 1.0) {
    if (!audioEnabled) return;
    const s = _checkSound(name);
    if (!s) return;

    s.element.pause();
    s.element.currentTime = 0;
    s.element.loop = loop;
    s.element.volume = volume * masterVolume;
    s.loop = loop;
    s.volume = volume;

    try {
      await s.element.play();
      s.playing = true;
      _dispatchEvent("play", name);
    } catch (err) {
      console.warn(`[DSRT.Audio] Play blocked: ${name}`, err);
    }
  }

  function stop(name) {
    const s = _checkSound(name);
    if (!s) return;
    s.element.pause();
    s.element.currentTime = 0;
    s.playing = false;
    _dispatchEvent("stop", name);
  }

  function pause(name) {
    const s = _checkSound(name);
    if (!s || !s.playing) return;
    s.element.pause();
    s.playing = false;
    _dispatchEvent("pause", name);
  }

  async function resume(name) {
    const s = _checkSound(name);
    if (!s || s.playing) return;
    try {
      await s.element.play();
      s.playing = true;
      _dispatchEvent("resume", name);
    } catch (err) {
      console.warn(`[DSRT.Audio] Resume blocked: ${name}`, err);
    }
  }

  // ====== Volume ======
  function setVolume(name, volume) {
    const s = _checkSound(name);
    if (!s) return;
    s.volume = Math.max(0, Math.min(1, volume));
    s.element.volume = s.volume * masterVolume;
  }

  function setMasterVolume(volume) {
    masterVolume = Math.max(0, Math.min(1, volume));
    for (const key in sounds)
      sounds[key].element.volume = sounds[key].volume * masterVolume;
  }

  // ====== Loop / Mute ======
  function toggleLoop(name) {
    const s = _checkSound(name);
    if (!s) return;
    s.loop = !s.loop;
    s.element.loop = s.loop;
  }

  function mute(name) {
    const s = _checkSound(name);
    if (s) s.element.muted = true;
  }

  function unmute(name) {
    const s = _checkSound(name);
    if (s) s.element.muted = false;
  }

  function muteAll() {
    for (const key in sounds) sounds[key].element.muted = true;
  }

  function unmuteAll() {
    for (const key in sounds) sounds[key].element.muted = false;
  }

  // ====== Global Enable/Disable ======
  function enableAudio() {
    audioEnabled = true;
    unmuteAll();
    _dispatchEvent("enable");
  }

  function disableAudio() {
    audioEnabled = false;
    muteAll();
    stopAll();
    _dispatchEvent("disable");
  }

  // ====== Utils ======
  function isPlaying(name) {
    const s = _checkSound(name);
    return s ? !s.element.paused : false;
  }

  function stopAll() {
    for (const key in sounds) stop(key);
  }

  function getMasterVolume() {
    return masterVolume;
  }

  function getSound(name) {
    return sounds[name]?.element || null;
  }

  // ====== Event System (optional hook) ======
  function _dispatchEvent(type, name = null) {
    if (typeof onAudioStateChange === "function") {
      onAudioStateChange({ type, name, timestamp: performance.now() });
    }
  }

  function onStateChange(callback) {
    onAudioStateChange = callback;
  }

  // ====== Public API ======
  return {
    sounds,
    load,
    play,
    stop,
    pause,
    resume,
    setVolume,
    setMasterVolume,
    getMasterVolume,
    toggleLoop,
    mute,
    unmute,
    muteAll,
    unmuteAll,
    enableAudio,
    disableAudio,
    isPlaying,
    stopAll,
    getSound,
    onStateChange
  };

})();
