// src/core/boolean.js
// ==============================================
// DSRT Boolean State System
// ==============================================

export class BoolState {
  constructor(defaultValue = false) {
    this.value = !!defaultValue;
  }

  toggle() {
    this.value = !this.value;
  }

  on() {
    this.value = true;
  }

  off() {
    this.value = false;
  }

  isTrue() {
    return this.value === true;
  }

  isFalse() {
    return this.value === false;
  }

  set(value) {
    this.value = !!value;
  }
}
