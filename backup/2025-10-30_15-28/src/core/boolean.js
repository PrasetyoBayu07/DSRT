// src/core/boolean.js
// ==============================================
// DSRT Boolean State System
// ==============================================

export class BoolState {
  constructor(defaultValue = false) {
    this.value = !!defaultValue;
    this.listeners = [];
  }

  toggle() {
    this.value = !this.value;
    this.notify();
  }

  on() {
    this.value = true;
    this.notify();
  }

  off() {
    this.value = false;
    this.notify();
  }

  set(value) {
    this.value = !!value;
    this.notify();
  }

  notify() {
    this.listeners.forEach((cb) => cb(this.value));
  }

  subscribe(cb) {
    this.listeners.push(cb);
  }

  unsubscribe(cb) {
    this.listeners = this.listeners.filter((l) => l !== cb);
  }

  isTrue() {
    return this.value === true;
  }

  isFalse() {
    return this.value === false;
  }
}
