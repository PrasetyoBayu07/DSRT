// ============================================================
// DSRT ENGINE EXTRA: LOADER MODULE
// Handles image preloading and caching
// ============================================================

var DSRT = DSRT || {};
DSRT.Extra = DSRT.Extra || {};

DSRT.Extra.Loader = (function () {

  const images = {};

  function load(name, src, onLoad) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      images[name] = img;
      if (onLoad) onLoad(img);
      console.log(`[DSRT.Loader] Loaded: ${name}`);
    };
    img.onerror = () => console.warn(`[DSRT.Loader] Failed to load: ${src}`);
  }

  function get(name) {
    return images[name] || null;
  }

  function loadBatch(list, onAllLoaded) {
    let loaded = 0;
    const total = Object.keys(list).length;
    for (const key in list) {
      load(key, list[key], () => {
        loaded++;
        if (loaded === total && onAllLoaded) onAllLoaded();
      });
    }
  }

  function all() {
    return images;
  }

  return { load, get, loadBatch, all };

})();
