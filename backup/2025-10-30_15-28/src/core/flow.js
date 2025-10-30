// src/core/flow.js
// ==============================================
// DSRT Flow Control System
// ==============================================

export class Flow {
  constructor() {
    this.steps = [];
    this.currentIndex = 0;
    this.isRunning = false;
  }

  add(stepFn) {
    if (typeof stepFn === "function") this.steps.push(stepFn);
  }

  start() {
    this.isRunning = true;
    this.currentIndex = 0;
    this._runNext();
  }

  stop() {
    this.isRunning = false;
  }

  reset() {
    this.currentIndex = 0;
  }

  _runNext() {
    if (!this.isRunning) return;
    if (this.currentIndex < this.steps.length) {
      const fn = this.steps[this.currentIndex];
      fn();
      this.currentIndex++;
      requestAnimationFrame(() => this._runNext());
    } else {
      this.isRunning = false;
    }
  }
}
