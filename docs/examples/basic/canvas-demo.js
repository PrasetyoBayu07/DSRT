/**
 * DSRT Example — Basic Canvas Demo (Animated)
 * -------------------------------------------
 * This example demonstrates basic DSRT canvas usage.
 * It draws animated text and moving gradient background.
 */

export function start(ctx) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  let t = 0;

  function loop() {
    t += 0.02;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, `hsl(${(t * 40) % 360}, 80%, 50%)`);
    grad.addColorStop(1, `hsl(${(t * 40 + 180) % 360}, 80%, 30%)`);

    // Background
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Animated Text
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(Math.sin(t) * 0.05);
    ctx.fillStyle = "#fff";
    ctx.font = "24px monospace";
    ctx.textAlign = "center";
    ctx.fillText("🚀 DSRT Canvas Demo", 0, 0);
    ctx.restore();

    requestAnimationFrame(loop);
  }

  loop();
}
