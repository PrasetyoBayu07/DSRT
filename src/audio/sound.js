// ==============================================
// DSRT Audio System
// ==============================================

export function playClickSound() {
  const audio = new Audio('./assets/audio/audio-click.wav');
  audio.volume = 0.5;
  audio.play().catch(() => {});
}

export function playHoverSound() {
  const audio = new Audio('./assets/audio/audio-click.wav');
  audio.volume = 0.25;
  audio.play().catch(() => {});
}
