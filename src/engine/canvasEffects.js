"use strict";

/**
 * CanvasEngine Effects Module
 * ---------------------------
 * Contains fire, water, smoke, bubbles, and vapor particle systems.
 * All logic is preserved exactly from the original file.
 */

import { ctx } from "./canvasCore.js";
import { distance } from "./canvasPhysics.js";

//===========================//
//   Particle Base Utility   //
//===========================//

/**
 * Generic particle generator helper.
 */
class Particle {
  constructor(x, y, radius, vx, vy, color, life) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = life;
    this.maxLife = life;
  }

  update(gravity = 0) {
    this.x += this.vx;
    this.y += this.vy + gravity;
    this.life--;
  }

  draw() {
    const alpha = Math.max(this.life / this.maxLife, 0);
    ctx.beginPath();
    ctx.fillStyle = this.color.replace("ALPHA", alpha.toFixed(2));
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  isAlive() {
    return this.life > 0;
  }
}

//===========================//
//         Fire Effect       //
//===========================//

let fireParticles = [];

/**
 * Draw fire flame animation.
 * @param {Object} opt - {x, y, v, rad, max, color}
 */
export function fire(opt) {
  const { x = 0, y = 0, v = 2, rad = 8, max = 40, color = "rgba(255,140,0,ALPHA)" } = opt;
  // spawn
  if (fireParticles.length < max) {
    const p = new Particle(x + (Math.random() - 0.5) * 10, y, rad, (Math.random() - 0.5) * 0.8, -Math.random() * v, color, 40);
    fireParticles.push(p);
  }

  // update
  fireParticles.forEach(p => {
    p.update(-0.02);
    p.draw();
  });

  // remove dead
  fireParticles = fireParticles.filter(p => p.isAlive());
}

//===========================//
//         Water Effect      //
//===========================//

let waterParticles = [];

/**
 * Water drops falling animation.
 */
export function water(opt) {
  const { x = 0, y = 0, v = 2, rad = 5, max = 50, color = "rgba(0,150,255,ALPHA)" } = opt;
  if (waterParticles.length < max) {
    const p = new Particle(x + (Math.random() - 0.5) * 10, y, rad, (Math.random() - 0.5) * 0.3, Math.random() * v + 1, color, 60);
    waterParticles.push(p);
  }

  waterParticles.forEach(p => {
    p.update(0.08);
    p.draw();
  });

  waterParticles = waterParticles.filter(p => p.isAlive());
}

//===========================//
//         Smoke Effect      //
//===========================//

let smokeParticles = [];

/**
 * Rising smoke particles.
 */
export function smoke(opt) {
  const { x = 0, y = 0, v = 1, rad = 6, max = 30, color = "rgba(120,120,120,ALPHA)" } = opt;
  if (smokeParticles.length < max) {
    const p = new Particle(x + (Math.random() - 0.5) * 15, y, rad, (Math.random() - 0.5) * 0.5, -Math.random() * v, color, 80);
    smokeParticles.push(p);
  }

  smokeParticles.forEach(p => {
    p.update(-0.01);
    p.draw();
  });

  smokeParticles = smokeParticles.filter(p => p.isAlive());
}

//===========================//
//        Bubble Effect      //
//===========================//

let bubbleParticles = [];

/**
 * Floating air bubbles animation.
 */
export function bubbles(opt) {
  const { x = 0, y = 0, v = 1, rad = 5, max = 40, color = "rgba(200,240,255,ALPHA)" } = opt;
  if (bubbleParticles.length < max) {
    const p = new Particle(x + (Math.random() - 0.5) * 20, y, rad, (Math.random() - 0.5) * 0.3, -Math.random() * v, color, 100);
    bubbleParticles.push(p);
  }

  bubbleParticles.forEach(p => {
    p.update(-0.005);
    p.draw();
  });

  bubbleParticles = bubbleParticles.filter(p => p.isAlive());
}

//===========================//
//         Vapor Effect      //
//===========================//

let vaporParticles = [];

/**
 * Vapor or mist-like motion.
 */
export function vapor(opt) {
  const { x = 0, y = 0, v = 1, rad = 5, max = 60, color = "rgba(180,180,200,ALPHA)" } = opt;
  if (vaporParticles.length < max) {
    const p = new Particle(x + (Math.random() - 0.5) * 30, y, rad, (Math.random() - 0.5) * 0.6, -Math.random() * v, color, 90);
    vaporParticles.push(p);
  }

  vaporParticles.forEach(p => {
    p.update(-0.005);
    p.draw();
  });

  vaporParticles = vaporParticles.filter(p => p.isAlive());
}

//===========================//
//       Utility Reset       //
//===========================//

/**
 * Reset all particle arrays.
 */
export function resetEffects() {
  fireParticles = [];
  waterParticles = [];
  smokeParticles = [];
  bubbleParticles = [];
  vaporParticles = [];
}
