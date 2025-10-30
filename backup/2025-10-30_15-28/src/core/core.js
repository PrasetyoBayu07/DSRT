// ------------------------------
// CANVAS CORE & SETUP
// ------------------------------

// Inisialisasi variabel global canvas dan context
var canvas, konten;

// Boolean flow utama untuk mengatur interaksi
var isActive = true; // apakah user bisa berinteraksi
var inputAktif = ""; // input field yang sedang fokus
var popupAktif = ""; // popup yang sedang aktif

// Variabel tambahan untuk tracking event
var mouse = { x: 0, y: 0, down: false, touch: false };
var inputDB = []; // database semua input field
var tombolDB = []; // database semua tombol

// Variabel warna default
var warnaBG = "#ffffff"; // background default

// ------------------------------
// Fungsi Setup Canvas
// ------------------------------
function aturCanvas() {
  canvas = document.getElementById("scene");
  if (!canvas) throw new Error("Canvas dengan id 'scene' tidak ditemukan!");

  konten = canvas.getContext("2d");

  // Resize otomatis mengikuti window
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Setup event mouse
  canvas.addEventListener("mousemove", mouseMove, false);
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUp, false);

  // Setup event touch
  canvas.addEventListener("touchstart", touchStart, false);
  canvas.addEventListener("touchmove", touchMove, false);
  canvas.addEventListener("touchend", touchEnd, false);
}

// ------------------------------
// Event Handling – Mouse
// ------------------------------
function mouseMove(e) {
  var rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
}

function mouseDown(e) {
  mouse.down = true;
  cekKlik(mouse.x, mouse.y);
}

function mouseUp(e) {
  mouse.down = false;
}

// ------------------------------
// Event Handling – Touch
// ------------------------------
function touchStart(e) {
  mouse.touch = true;
  if (e.touches.length > 0) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
    cekKlik(mouse.x, mouse.y);
  }
  e.preventDefault();
}

function touchMove(e) {
  if (e.touches.length > 0) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
  }
  e.preventDefault();
}

function touchEnd(e) {
  mouse.touch = false;
  e.preventDefault();
}

// ------------------------------
// Fungsi Main Loop
// ------------------------------
var fps = 60;
function mainLoop() {
  if (!isActive) return; // jika interaksi nonaktif, skip update

  // Bersihkan canvas setiap frame
  konten.clearRect(0, 0, canvas.width, canvas.height);

  // TODO: Panggil semua draw / update objek lab disini
  // misal: drawTabung(), drawParticle(), drawUI()

  // Request frame berikutnya
  requestAnimationFrame(mainLoop);
}

// ------------------------------
// Fungsi Utility
// ------------------------------
function setJudul(str) {
  document.title = str;
}

// Jalankan fungsi callback
function jalankan(func) {
  if (typeof func === "function") func();
}

// ------------------------------
// Fungsi klik / interaksi
// ------------------------------
function cekKlik(x, y) {
  // Cek popup dulu
  if (popupAktif !== "") {
    cekPopup(x, y);
    return;
  }

  // Cek tombol
  for (var i = 0; i < tombolDB.length; i++) {
    var t = tombolDB[i];
    if (x > t.x && x < t.x + t.l && y > t.y && y < t.y + t.t) {
      if (typeof t.func === "function") t.func();
    }
  }

  // Cek input field
  cekTeksInput(x, y);
}
// ------------------------------
// UI & INPUT HANDLING (Bagian 2)
// ------------------------------

// Blink code untuk input aktif
var inputBlinking;
var blinkcode = "";

// Fungsi menggambar input field
function teksInput(data) {
  // Bersihkan area dulu
  konten.clearRect(data.x - 1, data.y - 1, data.p + 2, data.t + 2);

  var cl = data.warnaLayar || warnaBG;
  konten.fillStyle = cl;
  konten.fillRect(data.x - 1, data.y - 1, data.p + 2, data.t + 2);

  // Frame input
  kotakr(data.x, data.y, data.p, data.t, 5, 1, "#212121");

  // Hitung panjang teks
  var t_display = data.val;
  var lt = konten.measureText(t_display).width;
  var nt = 1;

  while (lt > data.p - 10) {
    t_display = t_display.substring(nt);
    lt = konten.measureText(t_display).width;
  }

  konten.textBaseline = "middle";
  teks(t_display + blinkcode, data.x + 5, data.y + data.t / 2, data.huruf, "#212121", "left");
  konten.textBaseline = "alphabetic";

  // Masukkan ke DB jika belum
  if (!data.isPushed) {
    data.isPushed = true;
    inputDB.push(data);
  }
}

// Cek klik pada input field
function cekTeksInput(x, y) {
  var findInput = false;
  var res = "";

  for (var i = 0; i < inputDB.length; i++) {
    var dt = inputDB[i];
    if (x > dt.x && x < dt.x + dt.p && y > dt.y && y < dt.y + dt.t) {
      findInput = true;
      res = dt;
    }
  }

  // Klik di luar input
  if (!findInput && inputAktif !== "") {
    blinkcode = "";
    teksInput(inputAktif);
    inputAktif = "";
    window.removeEventListener("keydown", tombolditahan, false);
    window.removeEventListener("keypress", tombolditekan, false);
    clearInterval(inputBlinking);
  }

  if (findInput && (inputAktif === "" || inputAktif.nama !== res.nama)) {
    if (inputAktif !== "" && inputAktif.nama !== res.nama) {
      blinkcode = "";
      teksInput(inputAktif);
      window.removeEventListener("keydown", tombolditahan, false);
      window.removeEventListener("keypress", tombolditekan, false);
      clearInterval(inputBlinking);
    }

    inputAktif = res;
    window.addEventListener("keydown", tombolditahan, false);
    window.addEventListener("keypress", tombolditekan, false);
    inputBlinking = setInterval(isBlink, 300);
  }

  return res;
}

// Fungsi blink untuk input
function isBlink() {
  blinkcode = blinkcode === "" ? "|" : "";
  teksInput(inputAktif);
}

// Handle tombol tahan (delete/backspace)
function tombolditahan(e) {
  var keycode = parseInt(e.which);

  if (keycode === 46 || keycode === 8) {
    e.preventDefault();
    inputAktif.val = inputAktif.val.slice(0, inputAktif.val.length - 1);
    teksInput(inputAktif);
  }
}

// Handle tombol tekan (karakter)
function tombolditekan(e) {
  var keycode = parseInt(e.which);

  if (keycode === 13) {
    // Enter
    e.preventDefault();
    blinkcode = "";
    teksInput(inputAktif);
    inputAktif = "";
    window.removeEventListener("keydown", tombolditahan, false);
    window.removeEventListener("keypress", tombolditekan, false);
    clearInterval(inputBlinking);
    return;
  }

  if (inputAktif.val.length < inputAktif.max) {
    if (inputAktif.limit === "*") inputAktif.val += String.fromCharCode(keycode);
    if (inputAktif.limit === "0-9" && keycode >= 48 && keycode <= 57)
      inputAktif.val += String.fromCharCode(keycode);
    if (
      (inputAktif.limit === "a-z" || inputAktif.limit === "A-Z") &&
      (keycode < 48 || keycode > 57)
    )
      inputAktif.val += String.fromCharCode(keycode);
  }

  teksInput(inputAktif);
}

// ------------------------------
// Popup Handling
// ------------------------------
function popup(data) {
  isActive = false;

  // Dark overlay
  kotak(0, 0, canvas.width, canvas.height, 1, "black", "rgba(0,0,0,0.3)");

  // Kotak popup
  kotakrs(data.x, data.y, data.l, data.t, 10, 2, data.warnaGaris, data.warnaBG, "black");

  // Teks popup
  teksHTML(data.val, data.x + 40, data.y + 30, data.l - 80, data.huruf, data.warnaHuruf);

  if (data.tutup === "ok") {
    tombol(
      "OK/id=popup",
      data.x + data.l / 2 - 40,
      data.y + data.t - 50,
      80,
      30,
      "bold 14pt Calibri",
      "white",
      "#12b098",
      "#12b098",
      "r"
    );
    popupAktif = data;
  }
}

// Cek klik popup
function cekPopup(x, y) {
  if (popupAktif !== "") {
    var t_pop = {
      x: popupAktif.x + popupAktif.l / 2 - 40,
      y: popupAktif.y + popupAktif.t - 50,
      l: 80,
      t: 30,
    };

    if (x > t_pop.x && x < t_pop.x + t_pop.l && y > t_pop.y && y < t_pop.y + t_pop.t) {
      // Hapus tombol popup dari DB
      for (var i = 0; i < tombolDB.length; i++) {
        if (tombolDB[i][0] === "popup") {
          tombolDB.splice(i, 1);
        }
      }
      isActive = true;
      jalankan(popupAktif.func);
      popupAktif = "";
    }
  }
}
// ------------------------------
// PARTICLE & LAB SIMULATION (Bagian 3)
// ------------------------------

// Fungsi acak kecil
function acak(max) {
  return Math.random() * max;
}

// ------------------------------
// PARTICLE CLASS
// ------------------------------
class Particle {
  constructor(x, y, xs, ys, rad, maxLife = 100) {
    this.x = x; // posisi x
    this.y = y; // posisi y
    this.xs = xs; // kecepatan horizontal
    this.ys = ys; // kecepatan vertikal
    this.rad = rad; // radius partikel
    this.life = 0; // umur partikel
    this.maxLife = maxLife; // maksimal umur
  }
}

// ------------------------------
// AIR PARTICLE SYSTEM
// ------------------------------
function air(data) {
  var ax = data.x,
    ay = data.y,
    speedx = data.vx,
    speedy = data.vy,
    g = data.grav,
    size = data.rad,
    max = data.max;
  if (!data.db) data.db = [];
  var particles = data.db;

  // Buat partikel baru
  var p = new Particle(
    ax,
    ay,
    speedx + (acak(10) - acak(10)) / 30,
    speedy + (acak(10) - acak(10)) / 30,
    size + (acak(10) - acak(10)) / 10,
    max
  );
  particles.push(p);

  for (var i = 0; i < particles.length; i++) {
    var px = particles[i].x;
    var py = particles[i].y;
    var rad = particles[i].rad - particles[i].life / 20;

    // Gradient untuk efek transparan
    var grd = konten.createRadialGradient(px, py, rad / 5, px - rad / 5, py, rad * 1);
    grd.addColorStop(0, "rgba(200,200,255,0.6)");
    grd.addColorStop(1, hexToRGBA(data.warna, 0));
    konten.fillStyle = grd;

    konten.beginPath();
    konten.arc(px, py, rad, 0, 2 * Math.PI);
    konten.fill();

    // Update posisi partikel
    var ox = particles[i].x;
    var oy = particles[i].y;
    particles[i].x += particles[i].xs;
    particles[i].y += particles[i].ys;
    particles[i].ys += g / 100;

    // Collision/block handling
    if (data.blok !== "none") {
      if (
        particles[i].y > data.blok.y - rad &&
        particles[i].y < data.blok.y + data.blok.t + rad &&
        particles[i].x > data.blok.x &&
        particles[i].x < data.blok.x + data.blok.l
      ) {
        particles[i].ys *= -0.5;
        particles[i].x = ox;
        particles[i].y = oy;
      } else if (
        particles[i].x > data.blok.x - rad &&
        particles[i].y < data.blok.y + data.blok.t &&
        particles[i].y > data.blok.y &&
        particles[i].y < data.blok.y + data.blok.t + rad
      ) {
        particles[i].xs *= -0.5;
        particles[i].x = ox;
        particles[i].y = oy;
      }
    }

    // Hapus partikel jika sudah melewati umur
    particles[i].life++;
    if (particles[i].life >= max) {
      particles.splice(i, 1);
      i--;
    }
  }
}

// ------------------------------
// BURNER / PEMANAS LAB
// ------------------------------
function burner(data) {
  var x = data.x,
    y = data.y,
    width = data.l,
    height = data.t,
    stroke = data.warnaGaris,
    fill = data.warnaIsi;

  // Burner body
  kotakr(x + width / 2 - 5, y - 10, 10, height, 2, 2, "#9b6517", "#9b6517");

  var radius = Math.min(width / 3, height / 3);
  radius = { tl: radius * 2, tr: radius * 2, br: radius, bl: radius };

  konten.beginPath();
  konten.moveTo(x + radius.tl, y);
  konten.lineTo(x + width - radius.tr, y);
  konten.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  konten.lineTo(x + width, y + height - radius.br);
  konten.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  konten.lineTo(x + radius.bl, y + height);
  konten.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  konten.lineTo(x, y + radius.tl);
  konten.quadraticCurveTo(x, y, x + radius.tl, y);
  konten.closePath();

  konten.fillStyle = hexToRGBA(fill, 0.3);
  konten.fill();
  konten.lineWidth = 2;
  konten.strokeStyle = stroke;
  konten.stroke();

  kotakr(x + width / 2 - width / 4, y - 4, width / 2, 5, 2, 2, stroke, stroke);
}

// ------------------------------
// LENS SIMULATION
// ------------------------------
function lensaCembung(x1, y1, radius, lensRadius, f) {
  konten.strokeStyle = "#000";
  konten.lineWidth = 2;
  konten.beginPath();
  konten.moveTo(x1 + 0.71 * radius, y1 + lensRadius);
  konten.quadraticCurveTo(x1 + 0.71 * radius - (110 - f), y1, x1 + 0.71 * radius, y1 - lensRadius);
  konten.moveTo(x1 + 0.71 * radius, y1 + lensRadius);
  konten.quadraticCurveTo(x1 + 0.71 * radius + (110 - f), y1, x1 + 0.71 * radius, y1 - lensRadius);
  konten.fillStyle = "rgba(255,255,250,0.7)";
  konten.stroke();
  konten.fill();
}

function lensaCekung(x1, y1, radius, lensRadius, f) {
  konten.strokeStyle = "#000";
  konten.lineWidth = 2;
  konten.beginPath();
  konten.moveTo(x1 + 0.71 * radius - 30, y1 + lensRadius);
  konten.lineTo(x1 + 0.71 * radius + 30, y1 + lensRadius);
  konten.quadraticCurveTo(
    x1 + 0.71 * radius + 30 - (0.4 * f + 60),
    y1,
    x1 + 0.71 * radius + 30,
    y1 - lensRadius
  );
  konten.lineTo(x1 + 0.71 * radius - 30, y1 - lensRadius);
  konten.quadraticCurveTo(
    x1 + 0.71 * radius - 30 + (0.4 * f + 60),
    y1,
    x1 + 0.71 * radius - 30,
    y1 + lensRadius
  );
  konten.fillStyle = "rgba(255,255,250,0.7)";
  konten.stroke();
  konten.fill();
}
// ------------------------------
// LAB GLASSWARE & REACTION SYSTEM (Bagian 4)
// ------------------------------

// ------------------------------
// TABUNG / BEAKER CLASS
// ------------------------------
class Tabung {
  constructor(x, y, width, height, color = "#88c0d0") {
    this.x = x; // posisi kiri atas
    this.y = y;
    this.l = width;
    this.t = height;
    this.color = color;
    this.contents = []; // array untuk partikel/larutan
    this.level = 0; // tinggi cairan
    this.maxLevel = height - 10;
    this.hasReaction = false; // boolean apakah ada reaksi
  }

  // Tambah cairan/tabung
  addVolume(vol) {
    this.level += vol;
    if (this.level > this.maxLevel) this.level = this.maxLevel;
  }

  // Gambar tabung + isi
  draw() {
    // tabung body
    kotakrs(this.x, this.y, this.l, this.t, 5, 2, "#222", "#ccc", "#000");

    // isi tabung
    if (this.level > 0) {
      konten.fillStyle = hexToRGBA(this.color, 0.5);
      konten.fillRect(this.x + 2, this.y + this.t - this.level, this.l - 4, this.level);
    }

    // efek gelembung / uap
    for (let i = 0; i < this.contents.length; i++) {
      let c = this.contents[i];
      air(c); // panggil particle system Bagian 3
    }
  }

  // Tambahkan reaksi kimia sederhana (uap / gas)
  startReaction() {
    if (!this.hasReaction) {
      this.hasReaction = true;
      let part = {
        x: this.x + this.l / 2,
        y: this.y + this.t - this.level,
        vx: 0,
        vy: -2,
        rad: 3,
        max: 50,
        db: [],
        warna: "#aaddff",
        grav: 0.1,
        blok: "none",
      };
      this.contents.push(part);
    }
  }

  // Update per-frame
  update() {
    if (this.hasReaction) {
      for (let i = 0; i < this.contents.length; i++) {
        let p = this.contents[i];
        air(p); // particle system
      }
    }
  }
}

// ------------------------------
// INTERAKSI MOUSE & TOUCH
// ------------------------------
var mouse = { x: 0, y: 0, down: false };
var activeTabung = null;

// event mouse
canvas.addEventListener("mousedown", (e) => {
  mouse.down = true;
  let rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  checkTabungClick(mouse.x, mouse.y);
});
canvas.addEventListener("mouseup", (e) => (mouse.down = false));
canvas.addEventListener("mousemove", (e) => {
  let rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// event touch
canvas.addEventListener("touchstart", (e) => {
  let rect = canvas.getBoundingClientRect();
  let t = e.touches[0];
  mouse.x = t.clientX - rect.left;
  mouse.y = t.clientY - rect.top;
  mouse.down = true;
  checkTabungClick(mouse.x, mouse.y);
});
canvas.addEventListener("touchend", (e) => (mouse.down = false));
canvas.addEventListener("touchmove", (e) => {
  let rect = canvas.getBoundingClientRect();
  let t = e.touches[0];
  mouse.x = t.clientX - rect.left;
  mouse.y = t.clientY - rect.top;
});

// ------------------------------
// CEK TABUNG DIKLIK
// ------------------------------
function checkTabungClick(x, y) {
  for (let i = 0; i < labTabung.length; i++) {
    let t = labTabung[i];
    if (x > t.x && x < t.x + t.l && y > t.y && y < t.y + t.t) {
      activeTabung = t;
      t.startReaction(); // trigger reaksi jika diklik
    }
  }
}

// ------------------------------
// LAB FLOW CONTROLLER
// ------------------------------
var labTabung = []; // array semua tabung
function labLoop() {
  konten.clearRect(0, 0, canvas.width, canvas.height);

  // update & draw semua tabung
  for (let i = 0; i < labTabung.length; i++) {
    labTabung[i].update();
    labTabung[i].draw();
  }

  // update particle tambahan jika perlu
  requestAnimationFrame(labLoop);
}

// ------------------------------
// INISIALISASI LAB
// ------------------------------
function initLab() {
  labTabung.push(new Tabung(100, 200, 50, 150, "#88c0d0"));
  labTabung.push(new Tabung(200, 220, 50, 130, "#c0a0d0"));
  labTabung.push(new Tabung(300, 210, 50, 140, "#a0d080"));

  labLoop(); // start loop
}
// ------------------------------
// LAB UI SYSTEM (Bagian 5)
// ------------------------------

// ------------------------------
// VARIABEL GLOBAL UI
// ------------------------------
var tombolDB = []; // semua tombol aktif
var inputDB = []; // semua input aktif
var inputAktif = ""; // input yang sedang diketik
var blinkcode = ""; // indikator kursor blinking
var inputBlinking; // interval kursor
var popupAktif = ""; // popup aktif
var isActive = true; // apakah lab menerima input / overlay aktif

// ------------------------------
// TOMBOL CLASS
// ------------------------------
class Tombol {
  constructor(label, x, y, w, h, font, color, bg, borderColor, id) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.l = w;
    this.t = h;
    this.font = font;
    this.color = color;
    this.bg = bg;
    this.border = borderColor;
    this.id = id;
    tombolDB.push(this);
  }

  draw() {
    kotakr(this.x, this.y, this.l, this.t, 5, 2, this.border, this.bg);
    teks(this.label, this.x + this.l / 2, this.y + this.t / 2, this.font, this.color, "center");
  }

  isHover(mx, my) {
    return mx > this.x && mx < this.x + this.l && my > this.y && my < this.y + this.t;
  }
}

// ------------------------------
// INPUT FIELD CLASS
// ------------------------------
class InputField {
  constructor(name, x, y, w, h, font, max = 10, limit = "*") {
    this.nama = name;
    this.x = x;
    this.y = y;
    this.p = w;
    this.t = h;
    this.huruf = font;
    this.val = "";
    this.max = max;
    this.limit = limit;
    inputDB.push(this);
  }

  draw() {
    konten.fillStyle = "#fff";
    konten.fillRect(this.x, this.y, this.p, this.t);
    kotakr(this.x, this.y, this.p, this.t, 5, 1, "#212121");
    teks(this.val + blinkcode, this.x + 5, this.y + this.t / 2, this.huruf, "#212121", "left");
  }

  focus() {
    inputAktif = this;
    blinkcode = "|";
    inputBlinking = setInterval(() => {
      blinkcode = blinkcode == "|" ? "" : "|";
      this.draw();
    }, 300);
    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keypress", keyPressHandler, false);
  }

  blur() {
    inputAktif = "";
    blinkcode = "";
    clearInterval(inputBlinking);
    window.removeEventListener("keydown", keyDownHandler);
    window.removeEventListener("keypress", keyPressHandler);
    this.draw();
  }
}

// ------------------------------
// POPUP CLASS
// ------------------------------
class Popup {
  constructor(x, y, l, t, bgColor, borderColor, font, text, closeType = "ok", func = null) {
    this.x = x;
    this.y = y;
    this.l = l;
    this.t = t;
    this.bg = bgColor;
    this.border = borderColor;
    this.font = font;
    this.text = text;
    this.tutup = closeType;
    this.func = func;
    popupAktif = this;
  }

  draw() {
    kotak(0, 0, canvas.width, canvas.height, 1, "black", "rgba(0,0,0,0.3)");
    kotakrs(this.x, this.y, this.l, this.t, 10, 2, this.border, this.bg);
    teksHTML(this.text, this.x + 20, this.y + 30, this.l - 40, this.font, "#000");

    if (this.tutup == "ok") {
      new Tombol(
        "OK",
        this.x + this.l / 2 - 40,
        this.y + this.t - 50,
        80,
        30,
        "bold 14pt Calibri",
        "white",
        "#12b098",
        "#12b098",
        "popup"
      );
    }
  }

  close() {
    isActive = true;
    popupAktif = "";
    jalankan(this.func);
  }
}

// ------------------------------
// KEYBOARD HANDLER FUNCTIONS
// ------------------------------
function keyDownHandler(e) {
  if (!inputAktif) return;
  if (e.key === "Backspace") {
    e.preventDefault();
    inputAktif.val = inputAktif.val.slice(0, -1);
    inputAktif.draw();
  }
}

function keyPressHandler(e) {
  if (!inputAktif) return;
  if (e.key === "Enter") {
    e.preventDefault();
    inputAktif.blur();
    return;
  }
  if (inputAktif.val.length < inputAktif.max) {
    if (
      inputAktif.limit === "*" ||
      (inputAktif.limit === "0-9" && /\d/.test(e.key)) ||
      (inputAktif.limit === "a-z" && /[a-zA-Z]/.test(e.key))
    ) {
      inputAktif.val += e.key;
      inputAktif.draw();
    }
  }
}

// ------------------------------
// MOUSE / TOUCH CLICK HANDLER
// ------------------------------
canvas.addEventListener("mousedown", handleUIClick);
canvas.addEventListener("touchstart", (e) => {
  let t = e.touches[0];
  handleUIClick({ clientX: t.clientX, clientY: t.clientY });
});

function handleUIClick(e) {
  if (!isActive) return;

  let rect = canvas.getBoundingClientRect();
  let mx = e.clientX - rect.left;
  let my = e.clientY - rect.top;

  // tombol
  for (let i = 0; i < tombolDB.length; i++) {
    let btn = tombolDB[i];
    if (btn.isHover(mx, my)) {
      if (btn.id === "popup") {
        // hapus tombol
        tombolDB.splice(i, 1);
        popupAktif.close();
      }
    }
  }

  // input
  for (let i = 0; i < inputDB.length; i++) {
    let inp = inputDB[i];
    if (mx > inp.x && mx < inp.x + inp.p && my > inp.y && my < inp.y + inp.t) {
      if (inputAktif && inputAktif !== inp) inputAktif.blur();
      inp.focus();
      return;
    }
  }

  // klik di luar input
  if (inputAktif) inputAktif.blur();
}

// ------------------------------
// DRAW UI
// ------------------------------
function drawUI() {
  for (let i = 0; i < tombolDB.length; i++) tombolDB[i].draw();
  for (let i = 0; i < inputDB.length; i++) inputDB[i].draw();
}
// ------------------------------
// BAGIAN 6 – INTEGRASI UTAMA
// ------------------------------

// ------------------------------
// VAR GLOBAL
// ------------------------------
var canvas, konten;
var isLocal = false;
var dataGambar = {};
var fps = 60;

// ------------------------------
// SETUP CANVAS
// ------------------------------
function aturCanvas() {
  canvas = document.getElementById("scene");
  konten = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // resize otomatis
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ------------------------------
// PRELOAD IMAGE / SPRITE
// ------------------------------
function preloadGambar(imgList, callback) {
  let loaded = 0;
  let images = {};
  let total = Object.keys(imgList).length;

  for (let key in imgList) {
    let img = new Image();
    img.src = imgList[key];
    img.onload = () => {
      loaded++;
      if (loaded === total) {
        callback(images);
      }
    };
    images[key] = { img: img };
  }
}

// ------------------------------
// LOOP UTAMA
// ------------------------------
function loop() {
  konten.clearRect(0, 0, canvas.width, canvas.height);

  // ----- BACKGROUND GRID -----
  gridBG();

  // ----- TABUNG / REAKSI -----
  if (typeof updateTabung === "function") updateTabung(); // Bagian 4

  // ----- SPRITE -----
  if (typeof updateSprite === "function") updateSprite(); // Bagian 3/4

  // ----- PARTICLE SYSTEM -----
  if (typeof updateParticle === "function") updateParticle(); // Bagian 2/4

  // ----- DRAW UI -----
  if (typeof drawUI === "function") drawUI(); // Bagian 5

  // ----- POPUP OVERLAY -----
  if (popupAktif !== "") popupAktif.draw();

  requestAnimationFrame(loop);
}

// ------------------------------
// START LAB
// ------------------------------
function startLab() {
  aturCanvas();

  // daftar gambar / sprite
  var images = {
    tabung: "assets/images/tabung.png",
    reaksi: "assets/images/reaksi.png",
    // sprite sheet tambahan
  };

  preloadGambar(images, function (gfx) {
    dataGambar = gfx;
    console.log("Preload selesai, lab siap.");

    // setup awal: UI, tombol, input
    setupUI();
    setupLab();

    // jalankan loop
    loop();
  });
}

// ------------------------------
// SETUP LAB (contoh awal)
// ------------------------------
function setupLab() {
  // contoh tabung / reaksi
  // updateTabung akan didefinisikan di Bagian 4
}

// ------------------------------
// SETUP UI
// ------------------------------
function setupUI() {
  // contoh tombol
  new Tombol("Reset", 20, 20, 100, 40, "bold 14pt Calibri", "white", "#e74c3c", "#c0392b", "reset");
  new InputField("Nama", 150, 20, 200, 40, "14pt Calibri", 20, "*");

  // klik global
  canvas.addEventListener("mousedown", handleUIClick);
  canvas.addEventListener("touchstart", (e) => {
    let t = e.touches[0];
    handleUIClick({ clientX: t.clientX, clientY: t.clientY });
  });
}

// ------------------------------
// JALANKAN LAB
// ------------------------------
window.onload = startLab;

// ------------------------------
// TAMBAHAN FLOW OPTIONAL
// ------------------------------
// fungsi jalankan callback
function jalankan(func) {
  if (typeof func === "function") func();
}
