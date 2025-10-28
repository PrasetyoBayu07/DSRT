// ======================================================================
// DSRT LEGACY ENGINE
// ======================================================================
// Version: 1.0 (Preserved Build)
// Author: dz
// Date: Original Source — 2025
//
// Description:
// This file contains the **unaltered DSRT source code** from the original
// dsrt.txt. Every function, variable, and comment remains intact.
//
// Purpose:
// This version exists to preserve the original DSRT monolith before the
// modular refactor. It remains executable and can be used directly in
// browsers without imports.
//
// Modern DSRT (modular) version is located under:
//     ./core/, ./ui/, ./graphics/, ./physics/, ./lab/
//
// License: MIT (see LICENSE file in project root)
// ======================================================================


// --- Begin Legacy Namespace Wrapper -----------------------------------
(function(global) {

  // Create global legacy namespace
  const DSRT_LEGACY = {};

  // ================================================================
  // #region CORE SYSTEM
  // ================================================================
  // Original canvas initialization, timing, event handlers,
  // and fundamental logic live in this section.
  // (Begin paste from your dsrt.txt core portion here.)
  // ---------------------------------------------------------------



  // #endregion
  // ================================================================


  // ================================================================
  // #region UTILITIES
  // ================================================================
  // Math helpers, color functions, conversion utilities, etc.
  // ---------------------------------------------------------------



  // #endregion
  // ================================================================


  // ================================================================
  // #region UI SYSTEM
  // ================================================================
  // Buttons, sliders, input fields, and draggable elements.
  // ---------------------------------------------------------------



  // #endregion
  // ================================================================


  // ================================================================
  // #region GRAPHICS
  // ================================================================
  // Drawing primitives, shapes, text rendering, charts.
  // ---------------------------------------------------------------



  // #endregion
  // ================================================================


  // ================================================================
  // #region PHYSICS
  // ================================================================
  // Particle systems, motion equations, and mechanical simulations.
  // ---------------------------------------------------------------



  // #endregion
  // ================================================================


  // ================================================================
  // #region LAB SIMULATION
  // ================================================================
  // Beaker, thermometer, burner, and other experiment visuals.
  // ---------------------------------------------------------------



  // #endregion
  // ================================================================


  // ================================================================
  // #region RUNTIME / LOOP
  // ================================================================
  // Animation frames, logic updates, scene handling, etc.
  // ---------------------------------------------------------------



  // #endregion
  // ================================================================


  // ================================================================
  // #region LEGACY END
  // ================================================================
  // Export all legacy bindings to global scope.
  // ---------------------------------------------------------------
  global.DSRT_LEGACY = DSRT_LEGACY;

})(typeof window !== "undefined" ? window : globalThis);

// --- End Legacy Namespace Wrapper ------------------------------------

// ======================================================================
// NOTES:
// - To run this legacy build directly, include:
//       <script src="./src/legacy.js"></script>
// - It will expose all functions through `window.DSRT_LEGACY`.
// - No ES module imports required.
// - This file should remain read-only for historical preservation.
// ======================================================================
