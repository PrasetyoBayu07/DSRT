# DSRT — Dynamic Simulation & Rendering Toolkit

DSRT is a modular JavaScript 2D engine built on top of HTML5 Canvas.  
It provides a fast, lightweight way to create visual simulations, UI components, physics systems, and lab-like experiments — all with modern ES6 modules.

---

## ✨ Features

- 🔹 Modular structure (`core`, `ui`, `graphics`, `physics`, `lab`)
- 🔹 Flow and Boolean systems for runtime logic
- 🔹 Canvas-based UI elements (buttons, sliders, inputs, drag)
- 🔹 Particle simulation (fire, smoke, bubbles)
- 🔹 Simple mechanical systems (gear, spring, rod)
- 🔹 Laboratory visuals (beaker, thermometer, burner)
- 🔹 ES6 module exports — usable in any modern browser
- 🔹 Fully self-contained — no external libraries required

---

## 📂 Project Structure

dsrt/ │ ├── index.html               # Main entry demo ├── src/ │   ├── core/                # Canvas, utils, boolean, flow │   ├── ui/                  # Buttons, sliders, inputs, drag │   ├── graphics/            # Draw, text, chart │   ├── physics/             # Particles, mechanics │   ├── lab/                 # Beaker, thermometer, burner │   ├── dsrt.js              # Integration layer │   └── legacy.js            # Original DSRT code (unmodified) │ ├── demo/                    # Example use cases ├── assets/                  # images │   └── images/ ├── package.json ├── README.md ├── .gitignore └── LICENSE

---

## 🚀 Usage

You can run DSRT directly in the browser — no installation required.

1. Open `index.html` in any modern browser.
2. Or, use a local server for live reload:

```bash
npm install
npm start
