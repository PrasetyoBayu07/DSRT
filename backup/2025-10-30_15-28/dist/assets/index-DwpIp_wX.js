(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) n(o);
  new MutationObserver((o) => {
    for (const l of o)
      if (l.type === "childList")
        for (const r of l.addedNodes) r.tagName === "LINK" && r.rel === "modulepreload" && n(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(o) {
    const l = {};
    return (
      o.integrity && (l.integrity = o.integrity),
      o.referrerPolicy && (l.referrerPolicy = o.referrerPolicy),
      o.crossOrigin === "use-credentials"
        ? (l.credentials = "include")
        : o.crossOrigin === "anonymous"
          ? (l.credentials = "omit")
          : (l.credentials = "same-origin"),
      l
    );
  }
  function n(o) {
    if (o.ep) return;
    o.ep = !0;
    const l = e(o);
    fetch(o.href, l);
  }
})();
let f = null,
  i = null,
  v = "#ffffff",
  m = [],
  C = !1;
function $(s, t = "#ffffff") {
  if (((f = document.getElementById(s)), !f)) throw new Error("Canvas element not found: " + s);
  ((i = f.getContext("2d")), (v = t), j(t));
}
function j(s = v, t = {}) {
  ((v = s),
    i.clearRect(0, 0, f.width, f.height),
    (i.fillStyle = v),
    i.fillRect(0, 0, f.width, f.height),
    t.stat === "run" && m.push(t.func),
    t.stat === "clear" && (m = []),
    m.length > 0 && !C && z());
}
function K(s) {
  typeof s == "function" && s();
}
function z() {
  if (C) return;
  C = !0;
  function s() {
    (i.clearRect(0, 0, f.width, f.height), (i.fillStyle = v), i.fillRect(0, 0, f.width, f.height));
    for (let t = 0; t < m.length; t++) typeof m[t] == "function" && m[t]();
    requestAnimationFrame(s);
  }
  s();
}
function J() {
  C = !1;
}
function Q() {
  ((m = []), j(v));
}
function V() {
  return i;
}
async function Z(s = "#000", t = 800) {
  for (let n = 0; n <= 30; n++) {
    const o = n / 30;
    ((i.fillStyle = s),
      (i.globalAlpha = 1 - o),
      i.fillRect(0, 0, f.width, f.height),
      await new Promise((l) => setTimeout(l, t / 30)));
  }
  i.globalAlpha = 1;
}
const tt = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      get backgroundColor() {
        return v;
      },
      get canvas() {
        return f;
      },
      clearScreen: j,
      get context() {
        return i;
      },
      fadeInScene: Z,
      get funcDB() {
        return m;
      },
      getContext: V,
      initCanvas: $,
      resetAll: Q,
      run: K,
      startLoop: z,
      stopLoop: J,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
function E(s, t, e, n) {
  return Math.sqrt((e - s) ** 2 + (n - t) ** 2);
}
function et(s, t) {
  return E(s.x, s.y, t.x, t.y);
}
function B(s) {
  return Math.floor(Math.random() * s);
}
function it(s) {
  return (s * Math.PI) / 180;
}
function st(s, t = 1) {
  let e;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(s))
    return (
      (e = s.substring(1).split("")),
      e.length === 3 && (e = [e[0], e[0], e[1], e[1], e[2], e[2]]),
      (e = "0x" + e.join("")),
      `rgba(${[(e >> 16) & 255, (e >> 8) & 255, e & 255].join(",")},${t})`
    );
  throw new Error("Invalid HEX color code.");
}
function nt(s, t, e) {
  const n = s.getImageData(t, e, 1, 1).data;
  return "#" + ("000000" + ot(n[0], n[1], n[2])).slice(-6);
}
function ot(s, t, e) {
  if (s > 255 || t > 255 || e > 255) throw "Invalid RGB component";
  return ((s << 16) | (t << 8) | e).toString(16);
}
const lt = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      degToRad: it,
      distance: E,
      distanceObj: et,
      getPixelColor: nt,
      hexToRGBA: st,
      randomInt: B,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
class rt {
  constructor(t = !1) {
    ((this.value = !!t), (this.listeners = []));
  }
  toggle() {
    ((this.value = !this.value), this.notify());
  }
  on() {
    ((this.value = !0), this.notify());
  }
  off() {
    ((this.value = !1), this.notify());
  }
  set(t) {
    ((this.value = !!t), this.notify());
  }
  notify() {
    this.listeners.forEach((t) => t(this.value));
  }
  subscribe(t) {
    this.listeners.push(t);
  }
  unsubscribe(t) {
    this.listeners = this.listeners.filter((e) => e !== t);
  }
  isTrue() {
    return this.value === !0;
  }
  isFalse() {
    return this.value === !1;
  }
}
const at = Object.freeze(
  Object.defineProperty({ __proto__: null, BoolState: rt }, Symbol.toStringTag, { value: "Module" })
);
class ht {
  constructor() {
    ((this.steps = []), (this.currentIndex = 0), (this.isRunning = !1));
  }
  add(t) {
    typeof t == "function" && this.steps.push(t);
  }
  start() {
    ((this.isRunning = !0), (this.currentIndex = 0), this._runNext());
  }
  stop() {
    this.isRunning = !1;
  }
  reset() {
    this.currentIndex = 0;
  }
  _runNext() {
    if (this.isRunning)
      if (this.currentIndex < this.steps.length) {
        const t = this.steps[this.currentIndex];
        (t(), this.currentIndex++, requestAnimationFrame(() => this._runNext()));
      } else this.isRunning = !1;
  }
}
const ct = Object.freeze(
  Object.defineProperty({ __proto__: null, Flow: ht }, Symbol.toStringTag, { value: "Module" })
);
function H(s, t, e, n, o = 1, l = "#000", r = "#fff") {
  (i.beginPath(),
    (i.lineWidth = o),
    (i.strokeStyle = l),
    (i.fillStyle = r),
    i.rect(s, t, e, n),
    i.fill(),
    i.stroke(),
    i.closePath());
}
function d(s, t, e, n, o = 4, l = 1, r = "#000", a = "#fff") {
  (i.beginPath(),
    (i.lineWidth = l),
    (i.strokeStyle = r),
    (i.fillStyle = a),
    i.moveTo(s + o, t),
    i.lineTo(s + e - o, t),
    i.quadraticCurveTo(s + e, t, s + e, t + o),
    i.lineTo(s + e, t + n - o),
    i.quadraticCurveTo(s + e, t + n, s + e - o, t + n),
    i.lineTo(s + o, t + n),
    i.quadraticCurveTo(s, t + n, s, t + n - o),
    i.lineTo(s, t + o),
    i.quadraticCurveTo(s, t, s + o, t),
    i.fill(),
    i.stroke(),
    i.closePath());
}
function b(s, t, e, n, o = 1, l = "#000") {
  (i.beginPath(),
    (i.strokeStyle = l),
    (i.lineWidth = o),
    i.moveTo(s, t),
    i.lineTo(e, n),
    i.stroke(),
    i.closePath());
}
function D(s, t, e, n = "#000", o = "#fff", l = 1) {
  (i.beginPath(),
    i.arc(s, t, e, 0, 2 * Math.PI, !1),
    (i.fillStyle = o),
    i.fill(),
    (i.lineWidth = l),
    (i.strokeStyle = n),
    i.stroke(),
    i.closePath());
}
function ut(s, t, e, n, o = 1, l = "#000") {
  const a = e - s,
    h = n - t,
    c = Math.atan2(h, a);
  (b(s, t, e, n, o, l),
    i.beginPath(),
    i.moveTo(e, n),
    i.lineTo(e - 10 * Math.cos(c - Math.PI / 6), n - 10 * Math.sin(c - Math.PI / 6)),
    i.lineTo(e - 10 * Math.cos(c + Math.PI / 6), n - 10 * Math.sin(c + Math.PI / 6)),
    i.lineTo(e, n),
    (i.strokeStyle = l),
    i.stroke(),
    i.closePath());
}
function F(s, t, e, n = null, o = null) {
  const l = new Image();
  ((l.src = s),
    (l.onload = () => {
      n && o ? i.drawImage(l, t, e, n, o) : i.drawImage(l, t, e);
    }));
}
function g(s, t, e, n = "12pt Calibri", o = "#000", l = "center") {
  ((i.font = n), (i.fillStyle = o), (i.textAlign = l), i.fillText(s, t, e));
}
const ft = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      drawArrow: ut,
      drawCircle: D,
      drawImage: F,
      drawLine: b,
      drawRect: H,
      drawRoundedRect: d,
      drawText: g,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
function dt() {
  const s = new Audio("./assets/audio/audio-click.wav");
  ((s.volume = 0.5), s.play().catch(() => {}));
}
function pt() {
  const s = new Audio("./assets/audio/audio-click.wav");
  ((s.volume = 0.25), s.play().catch(() => {}));
}
let y = [],
  gt = !0,
  O = null;
function mt() {
  y = [];
}
function G(
  s,
  t,
  e,
  n,
  o,
  l = "bold 12pt Calibri",
  r = "#000",
  a = "#000",
  h = "#adadad",
  c = !1,
  P = null
) {
  const u = s.split("/id="),
    x = u[0],
    S = u.length > 1 ? u[1] : x,
    L = O === S ? "#00c2ff" : h;
  (c ? d(t, e, n, o, 8, 1, a, L) : H(t, e, n, o, 1, a, L),
    (i.textBaseline = "middle"),
    g(x, t + n / 2, e + o / 2, l, r, "center"),
    (i.textBaseline = "alphabetic"),
    y.some((U) => U[0] === S) || y.push([S, t, e, n, o, P]));
}
function bt(s, t, e, n, o, l, r = null) {
  F(l, t, e, n, o);
  const a = s.split("/id="),
    h = a[0],
    c = a.length > 1 ? a[1] : h;
  y.some((u) => u[0] === c) || y.push([c, t, e, n, o, r]);
}
function q(s) {
  const t = document.getElementById("scene"),
    e = s.pageX - t.offsetLeft,
    n = s.pageY - t.offsetTop;
  let o = null;
  for (let l of y)
    if (e > l[1] && e < l[1] + l[3] && n > l[2] && n < l[2] + l[4]) {
      o = l[0];
      break;
    }
  o !== O && ((O = o), o && pt());
}
function X(s) {
  const t = document.getElementById("scene"),
    e = s.pageX - t.offsetLeft,
    n = s.pageY - t.offsetTop;
  let o = "";
  for (let l of y)
    e > l[1] &&
      e < l[1] + l[3] &&
      n > l[2] &&
      n < l[2] + l[4] &&
      ((o = l[0]), dt(), l[5] && l[5]());
  return o;
}
const yt = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      button: G,
      get buttonDB() {
        return y;
      },
      buttonsActive: gt,
      checkButtonClick: X,
      checkButtonHover: q,
      get hoveredButton() {
        return O;
      },
      imageButton: bt,
      resetButtons: mt,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
let w = [],
  vt = !0;
function xt() {
  w = [];
}
function St(s) {
  const {
    type: t,
    label: e,
    x: n,
    y: o,
    width: l,
    height: r,
    min: a,
    max: h,
    value: c,
    decimals: P,
  } = s;
  if (t === "H" || t === "h") {
    (e &&
      (g(`${a} ${e}`, n + 20, o + 5, "12pt Calibri", "#000", "right"),
      g(`${h} ${e}`, n + 45 + l, o + 5, "12pt Calibri", "#000", "left")),
      d(n + 30, o, l, 5, 2));
    const u = ((c - a) / (h - a)) * l;
    (d(n + 30, o, u, 5, 2, 1, "#000", "#adadad"), d(n + 30 + u - 6, o - 6, 18, 17, 2));
  } else {
    (e &&
      (g(`${h} ${e}`, n, o + 5, "12pt Calibri", "#000", "center"),
      g(`${a} ${e}`, n, o + l + 43, "12pt Calibri", "#000", "center")),
      d(n, o + 20, 5, l, 2));
    const u = ((c - a) / (h - a)) * l;
    (d(n, o + 20 + l - u, 5, u, 2, 1, "#000", "#adadad"), d(n - 7, o + l + 11 - u, 19, 18, 2));
  }
  s.isPushed || ((s.isPushed = !0), w.push(s));
}
function Tt(s) {
  const t = document.getElementById("scene"),
    e = s.pageX - t.offsetLeft,
    n = s.pageY - t.offsetTop;
  let o = null;
  for (let l = 0; l < w.length; l++) {
    const r = w[l];
    if (r.type === "H" || r.type === "h") {
      const a = ((r.value - r.min) / (r.max - r.min)) * r.width;
      e > r.x + 20 + a &&
        e < r.x + a + 40 &&
        n > r.y - 6 &&
        n < r.y + 12 &&
        ((r.value = ((e - (r.x + 30)) / r.width) * (r.max - r.min) + r.min),
        (r.value = parseFloat(r.value.toFixed(r.decimals))),
        (o = r));
    } else {
      const a = ((r.value - r.min) / (r.max - r.min)) * r.width;
      n > r.y + r.width + 11 - a &&
        n < r.y + 38 + r.width - a &&
        e > r.x - 10 &&
        e < r.x + 15 &&
        ((r.value = ((r.y + r.width + 20 - n) / r.width) * (r.max - r.min) + r.min),
        (r.value = parseFloat(r.value.toFixed(r.decimals))),
        (o = r));
    }
  }
  return o;
}
const wt = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      checkSlider: Tt,
      resetSliders: xt,
      slider: St,
      get sliderDB() {
        return w;
      },
      slidersActive: vt,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
let I = [],
  _ = "",
  M = !1,
  Y = "",
  Mt = !0;
function _t(s, t, e, n, o, l = "12pt Calibri", r = "#000", a = "#fff", h = null) {
  d(t, e, n, o, 4, 1, "#000", a);
  const c = I.find((A) => A.name === s);
  c ||
    I.push({ name: s, x: t, y: e, width: n, height: o, text: "", font: l, color: r, callback: h });
  const u = _ === s && M,
    x = c ? c.text : "",
    S = u ? x + "|" : x;
  g(S, t + 5, e + o / 2, l, r, "left");
}
function Pt(s) {
  const t = I.find((e) => e.name === _);
  t &&
    (s.key === "Backspace"
      ? (t.text = t.text.slice(0, -1))
      : s.key.length === 1 && (t.text += s.key),
    t.callback && t.callback(t.text));
}
function Ct(s) {
  ((_ = s), (Y = setInterval(() => (M = !M), 500)));
}
function Ot() {
  ((_ = ""), (M = !1), clearInterval(Y));
}
const It = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      get activeInput() {
        return _;
      },
      get blinking() {
        return M;
      },
      deactivateInput: Ot,
      handleKeyInput: Pt,
      inputBox: _t,
      inputDB: I,
      inputsActive: Mt,
      setActiveInput: Ct,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
let R = [],
  p = null;
function kt(s, t, e, n, o, l = null) {
  R.push({ id: s, x: t, y: e, width: n, height: o, onDrag: l });
}
function Bt(s) {
  const t = document.getElementById("scene"),
    e = s.pageX - t.offsetLeft,
    n = s.pageY - t.offsetTop;
  for (const o of R)
    if (e > o.x && e < o.x + o.width && n > o.y && n < o.y + o.height) {
      p = o;
      break;
    }
}
function jt(s) {
  if (!p) return;
  const t = document.getElementById("scene"),
    e = s.pageX - t.offsetLeft,
    n = s.pageY - t.offsetTop;
  ((p.x = e - p.width / 2), (p.y = n - p.height / 2), p.onDrag && p.onDrag(p));
}
function Dt() {
  p = null;
}
const Rt = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      checkDragEnd: Dt,
      checkDragMove: jt,
      checkDragStart: Bt,
      draggableDB: R,
      makeDraggable: kt,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
function At(s, t, e, n = 20, o = "12pt Calibri", l = "#000", r = "left") {
  const a = s.split(`
`);
  ((i.font = o), (i.fillStyle = l), (i.textAlign = r));
  for (let h = 0; h < a.length; h++) i.fillText(a[h], t, e + h * n);
}
function Lt(s, t, e, n = "normal", o = 14, l = "#000", r = "center") {
  ((i.font = `${n} ${o}px Calibri`), (i.fillStyle = l), (i.textAlign = r), i.fillText(s, t, e));
}
function $t(s, t, e, n = "bold 14pt Calibri", o = "#000", l = "#aaa") {
  (i.save(),
    (i.shadowColor = l),
    (i.shadowBlur = 3),
    (i.shadowOffsetX = 2),
    (i.shadowOffsetY = 2),
    (i.font = n),
    (i.fillStyle = o),
    (i.textAlign = "center"),
    i.fillText(s, t, e),
    i.restore());
}
const zt = Object.freeze(
  Object.defineProperty(
    { __proto__: null, drawMultilineText: At, drawShadowText: $t, drawStyledText: Lt },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
function Et(s, t, e, n, o = 20, l = "#ccc") {
  (i.beginPath(), (i.strokeStyle = l));
  for (let r = 0; r <= e; r += o) b(s + r, t, s + r, t + n, 1, l);
  for (let r = 0; r <= n; r += o) b(s, t + r, s + e, t + r, 1, l);
  i.closePath();
}
function Ht(s, t, e, n, o = "#000") {
  (b(s, t + n / 2, s + e, t + n / 2, 2, o),
    b(s + e / 2, t, s + e / 2, t + n, 2, o),
    drawArrow(s + e / 2, t, s + e / 2, t - 10, 2, o),
    drawArrow(s + e, t + n / 2, s + e + 10, t + n / 2, 2, o));
}
function Ft(s = [], t, e, n = 1, o = "#f00") {
  (i.beginPath(), (i.strokeStyle = o), (i.lineWidth = 2));
  for (let l = 0; l < s.length; l++) {
    const r = t + s[l].x * n,
      a = e - s[l].y * n;
    l === 0 ? i.moveTo(r, a) : i.lineTo(r, a);
  }
  (i.stroke(), i.closePath());
}
const Gt = Object.freeze(
  Object.defineProperty(
    { __proto__: null, drawAxes: Ht, drawGrid: Et, plotData: Ft },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
class W {
  constructor(t, e, n, o, l, r, a = 100) {
    ((this.x = t),
      (this.y = e),
      (this.vx = n),
      (this.vy = o),
      (this.size = l),
      (this.color = r),
      (this.life = a));
  }
  update() {
    ((this.x += this.vx), (this.y += this.vy), this.life--);
  }
  draw() {
    (i.beginPath(),
      (i.fillStyle = this.color),
      (i.globalAlpha = Math.max(0, this.life / 100)),
      i.arc(this.x, this.y, this.size, 0, 2 * Math.PI),
      i.fill(),
      (i.globalAlpha = 1),
      i.closePath());
  }
  isDead() {
    return this.life <= 0;
  }
}
class T {
  constructor(t, e, n = "#f00", o = 2) {
    ((this.x = t), (this.y = e), (this.color = n), (this.emissionRate = o), (this.particles = []));
  }
  emit() {
    for (let t = 0; t < this.emissionRate; t++) {
      const e = (Math.random() - 0.5) * 2,
        n = -Math.random() * 2,
        o = B(3) + 2,
        l = new W(this.x, this.y, e, n, o, this.color, B(80) + 40);
      this.particles.push(l);
    }
  }
  update() {
    (this.emit(),
      this.particles.forEach((t) => t.update()),
      (this.particles = this.particles.filter((t) => !t.isDead())));
  }
  draw() {
    this.particles.forEach((t) => t.draw());
  }
}
const qt = {
    fire(s, t) {
      return new T(s, t, "orange", 4);
    },
    smoke(s, t) {
      return new T(s, t, "gray", 2);
    },
    bubbles(s, t) {
      return new T(s, t, "#66ccff", 3);
    },
  },
  Xt = Object.freeze(
    Object.defineProperty(
      { __proto__: null, Particle: W, ParticlePresets: qt, ParticleSystem: T },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
class Yt {
  constructor(t, e, n = 40, o = 12, l = 0.01, r = "#888") {
    ((this.x = t),
      (this.y = e),
      (this.radius = n),
      (this.teeth = o),
      (this.angle = 0),
      (this.speed = l),
      (this.color = r));
  }
  update() {
    this.angle += this.speed;
  }
  draw() {
    (i.save(),
      i.translate(this.x, this.y),
      i.rotate(this.angle),
      (i.strokeStyle = this.color),
      (i.lineWidth = 2),
      D(0, 0, this.radius, this.color, "transparent", 2));
    for (let t = 0; t < this.teeth; t++) {
      const e = (t / this.teeth) * 2 * Math.PI,
        n = Math.cos(e) * this.radius,
        o = Math.sin(e) * this.radius,
        l = Math.cos(e) * (this.radius + 8),
        r = Math.sin(e) * (this.radius + 8);
      b(n, o, l, r, 2, this.color);
    }
    i.restore();
  }
}
class Wt {
  constructor(t, e, n, o, l = 10, r = "#555") {
    ((this.x1 = t),
      (this.y1 = e),
      (this.x2 = n),
      (this.y2 = o),
      (this.coils = l),
      (this.color = r));
  }
  draw() {
    const t = this.x2 - this.x1,
      e = this.y2 - this.y1,
      n = Math.sqrt(t * t + e * e),
      o = Math.atan2(e, t),
      l = n / (this.coils * 2);
    (i.save(), i.translate(this.x1, this.y1), i.rotate(o), i.beginPath(), i.moveTo(0, 0));
    for (let r = 0; r < this.coils * 2; r++) {
      const a = r % 2 === 0 ? 1 : -1;
      i.lineTo((r + 1) * l, a * 5);
    }
    ((i.strokeStyle = this.color), (i.lineWidth = 2), i.stroke(), i.restore());
  }
}
class Nt {
  constructor(t, e, n, o, l = "#000") {
    ((this.x1 = t), (this.y1 = e), (this.x2 = n), (this.y2 = o), (this.color = l));
  }
  draw() {
    b(this.x1, this.y1, this.x2, this.y2, 3, this.color);
  }
}
const Ut = Object.freeze(
  Object.defineProperty({ __proto__: null, Gear: Yt, Rod: Nt, Spring: Wt }, Symbol.toStringTag, {
    value: "Module",
  })
);
class Kt {
  constructor(t, e, n, o, l = "#66ccff", r = 0.5) {
    ((this.x = t),
      (this.y = e),
      (this.width = n),
      (this.height = o),
      (this.fillColor = l),
      (this.level = r),
      (this.temperature = 25),
      (this.isBoiling = !1),
      (this.bubbles = []),
      (this.reactionColor = null));
  }
  setLevel(t) {
    this.level = Math.max(0, Math.min(1, t));
  }
  setTemperature(t) {
    ((this.temperature = t), (this.isBoiling = t >= 100));
  }
  setReactionColor(t) {
    this.reactionColor = t;
  }
  updateBubbles() {
    this.isBoiling &&
      (Math.random() < 0.3 &&
        this.bubbles.push({
          x: this.x + Math.random() * this.width,
          y: this.y + this.height - this.height * this.level,
          radius: 2 + Math.random() * 3,
          speed: 0.5 + Math.random() * 1.5,
        }),
      this.bubbles.forEach((t) => (t.y -= t.speed)),
      (this.bubbles = this.bubbles.filter((t) => t.y > this.y)));
  }
  draw() {
    d(this.x, this.y, this.width, this.height, 8, 2, "#aaa", "rgba(255,255,255,0.2)");
    const t = this.height * this.level;
    if (
      ((i.fillStyle = this.reactionColor || this.fillColor),
      i.fillRect(this.x, this.y + this.height - t, this.width, t),
      this.temperature > 40)
    ) {
      const e = Math.min((this.temperature - 40) / 60, 1) * 0.3;
      ((i.fillStyle = `rgba(255,100,0,${e})`),
        i.fillRect(this.x, this.y + this.height - t, this.width, t));
    }
    (this.updateBubbles(),
      (i.fillStyle = "rgba(255,255,255,0.7)"),
      this.bubbles.forEach((e) => {
        (i.beginPath(), i.arc(e.x, e.y, e.radius, 0, Math.PI * 2), i.fill());
      }),
      (i.font = "12px sans-serif"),
      (i.fillStyle = "#ccc"),
      i.fillText(`${Math.round(this.temperature)}°C`, this.x + this.width / 2 - 10, this.y - 5));
  }
}
const Jt = Object.freeze(
  Object.defineProperty({ __proto__: null, Beaker: Kt }, Symbol.toStringTag, { value: "Module" })
);
class Qt {
  constructor(t, e, n = 200, o = 20, l = "red") {
    ((this.x = t),
      (this.y = e),
      (this.height = n),
      (this.temp = o),
      (this.color = l),
      (this.targetTemp = o),
      (this.minTemp = 0),
      (this.maxTemp = 100),
      (this.glassGlow = 0),
      (this.label = "Thermo"));
  }
  setTemp(t) {
    this.temp = Math.max(this.minTemp, Math.min(this.maxTemp, t));
  }
  setTargetTemp(t) {
    this.targetTemp = Math.max(this.minTemp, Math.min(this.maxTemp, t));
  }
  update() {
    ((this.temp += (this.targetTemp - this.temp) * 0.05),
      (this.glassGlow = Math.min(1, Math.abs(this.temp - 25) / 80)));
  }
  getDynamicColor() {
    const t = this.temp;
    return t < 10 ? "#33aaff" : t < 40 ? "#55dd55" : t < 70 ? "#ffaa33" : "#ff3333";
  }
  draw() {
    this.update();
    const t = (this.temp / this.maxTemp) * this.height,
      e = this.getDynamicColor(),
      n = i.createLinearGradient(this.x, this.y, this.x + 20, this.y + this.height);
    (n.addColorStop(0, "rgba(255,255,255,0.3)"),
      n.addColorStop(1, `rgba(255,255,255,${0.1 + this.glassGlow * 0.3})`),
      d(this.x, this.y, 20, this.height, 10, 2, "#aaa", n),
      (i.fillStyle = e),
      i.fillRect(this.x, this.y + this.height - t, 20, t),
      D(this.x + 10, this.y + this.height + 10, 15, "#aaa", e),
      (i.font = "11px sans-serif"),
      (i.fillStyle = "#999"),
      i.fillText("0°", this.x + 25, this.y + this.height),
      i.fillText("50°", this.x + 25, this.y + this.height / 2),
      i.fillText("100°", this.x + 25, this.y),
      g(
        `${Math.round(this.temp)}°C`,
        this.x + 10,
        this.y - 10,
        "bold 14pt Calibri",
        "#000",
        "center"
      ),
      g(this.label, this.x + 10, this.y + this.height + 40, "10pt Calibri", "#444", "center"));
  }
}
const Vt = Object.freeze(
  Object.defineProperty({ __proto__: null, Thermometer: Qt }, Symbol.toStringTag, {
    value: "Module",
  })
);
class Zt {
  constructor(t, e) {
    ((this.x = t),
      (this.y = e),
      (this.active = !0),
      (this.particles = new T(t + 10, e - 10, "orange", 5)),
      (this.heatOutput = 0),
      (this.maxHeat = 300),
      (this.glow = 0),
      (this.hovered = !1));
  }
  toggle() {
    this.active = !this.active;
  }
  setHeat(t) {
    this.heatOutput = Math.max(0, Math.min(1, t));
  }
  getTemperature() {
    return this.heatOutput * this.maxHeat;
  }
  update() {
    (this.active
      ? (this.heatOutput = Math.min(1, this.heatOutput + 0.02))
      : (this.heatOutput = Math.max(0, this.heatOutput - 0.01)),
      (this.glow = this.heatOutput * 0.8),
      (this.particles.intensity = this.heatOutput * 10));
  }
  checkHover(t, e) {
    this.hovered = t >= this.x && t <= this.x + 20 && e >= this.y && e <= this.y + 50;
  }
  draw() {
    const t = this.hovered ? "#777" : "#555";
    if ((d(this.x, this.y, 20, 50, 4, 2, t, "#999"), this.glow > 0.1)) {
      const n = i.createRadialGradient(this.x + 10, this.y, 5, this.x + 10, this.y, 20);
      (n.addColorStop(0, `rgba(255,80,0,${this.glow})`),
        n.addColorStop(1, "rgba(255,80,0,0)"),
        (i.fillStyle = n),
        i.beginPath(),
        i.arc(this.x + 10, this.y, 15, 0, Math.PI * 2),
        i.fill());
    }
    (this.active || this.heatOutput > 0.1) &&
      ((this.particles.x = this.x + 10),
      (this.particles.y = this.y),
      this.particles.update(),
      this.particles.draw());
    const e = Math.round(this.getTemperature());
    ((i.font = "12px sans-serif"),
      (i.fillStyle = "#ffb"),
      i.fillText(`${e}°C`, this.x - 5, this.y - 10));
  }
}
const te = Object.freeze(
    Object.defineProperty({ __proto__: null, Burner: Zt }, Symbol.toStringTag, { value: "Module" })
  ),
  k = {
    name: "DSRT",
    version: "1.0.0",
    build: new Date().toISOString(),
    Canvas: tt,
    Utils: lt,
    Bool: at,
    Flow: ct,
    UI: { Buttons: yt, Sliders: wt, Inputs: It, Drag: Rt },
    Graphics: { Draw: ft, Text: zt, Chart: Gt },
    Physics: { Particles: Xt, Mechanics: Ut },
    Lab: { Beaker: Jt, Thermometer: Vt, Burner: te },
  };
typeof window < "u" &&
  ((window.DSRT = k), console.info(`✅ DSRT v${k.version} initialized at ${k.build}`));
$("scene", "#000");
const N = document.getElementById("scene");
N.addEventListener("click", X);
N.addEventListener("mousemove", q);
G("Start/id=startBtn", 320, 220, 160, 50, "bold 14pt Arial", "#fff", "#0ff", "#111", !0, () => {
  alert("Simulation Started!");
});
