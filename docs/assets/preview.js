/**
 * DSRT Live Preview Engine v1.2
 * =============================
 * Loads, renders, and executes DSRT module previews dynamically.
 * Compatible with DSRT core (global namespace import).
 * Author: Prasetyo Bayu Widodo
 * License: MIT
 */

const PREVIEW_ID = "live-preview";
let scriptEl = null;

export async function loadPreview(filePath) {
  const container = document.getElementById(PREVIEW_ID);
  if (!container) {
    console.warn("⚠️ Missing container with id='live-preview'");
    return;
  }

  container.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
      <div class="dsrt-loading" style="color:#aaa;font-family:monospace;">⏳ Loading ${filePath}...</div>
    </div>
  `;

  const rawUrl = `https://raw.githubusercontent.com/PrasetyoBayu07/DSRT/main/${filePath}`;

  try {
    // Fetch code from repository
    const res = await fetch(rawUrl);
    if (!res.ok) throw new Error(`Failed to load: ${res.statusText}`);
    const code = await res.text();

    // Remove previous script if exists
    if (scriptEl) scriptEl.remove();

    // Build canvas element
    container.innerHTML = `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
        <canvas id="preview-canvas" width="400" height="300" style="border:1px solid #333;border-radius:10px;background:#111;"></canvas>
        <small style="color:#888;font-size:12px;margin-top:6px;">Source: ${filePath}</small>
        <div id="preview-error" style="color:#ff5555;font-family:monospace;font-size:13px;margin-top:4px;display:none;"></div>
      </div>
    `;

    // Prepare sandbox script
    scriptEl = document.createElement("script");
    scriptEl.type = "module";

    scriptEl.innerHTML = `
      import * as DSRT from "https://raw.githubusercontent.com/PrasetyoBayu07/DSRT/main/src/dsrt.js";

      const canvas = document.getElementById("preview-canvas");
      const ctx = canvas.getContext("2d");

      try {
        ${code}

        // Execute user-defined functions
        if (typeof init === "function") init(canvas, ctx, DSRT);
        if (typeof draw === "function") draw(ctx, DSRT);
        if (typeof start === "function") start(ctx, DSRT);
      } catch (err) {
        const errorPanel = document.getElementById("preview-error");
        errorPanel.style.display = "block";
        errorPanel.textContent = "⚠ " + err.message;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ff4444";
        ctx.font = "14px monospace";
        ctx.fillText("⚠️ Preview Error", 10, 30);
        console.error(err);
      }
    `;

    // Attach to body
    document.body.appendChild(scriptEl);
  } catch (err) {
    console.error("Preview load failed:", err);
    container.innerHTML = `
      <div style="padding:10px;background:#220000;color:#ff5555;border:1px solid #660000;border-radius:8px;">
        ⚠️ Failed to load preview: ${err.message}
      </div>
    `;
  }
}
