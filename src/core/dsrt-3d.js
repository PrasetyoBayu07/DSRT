// src/core/dsrt-3d.js

// ============================================================
// DSRT ENGINE 3D MODULE
// Lightweight 3D system built on 2D Canvas projection
// ============================================================

var DSRT = DSRT || {};

DSRT.ThreeD = (function () {

  const ctx = () => DSRT.Core.getContext();

  // ========== 3D VECTOR CLASS ==========
  class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    add(v) {
      return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    sub(v) {
      return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    scale(s) {
      return new Vec3(this.x * s, this.y * s, this.z * s);
    }

    dot(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
      return new Vec3(
        this.y * v.z - this.z * v.y,
        this.z * v.x - this.x * v.z,
        this.x * v.y - this.y * v.x
      );
    }

    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
      const len = this.length() || 1;
      return this.scale(1 / len);
    }
  }

  // ========== CAMERA ==========
  class Camera {
    constructor(x = 0, y = 0, z = -500, fov = 500) {
      this.pos = new Vec3(x, y, z);
      this.fov = fov;
    }

    project(point) {
      const scale = this.fov / (this.fov + point.z - this.pos.z);
      const screenX = DSRT.Runtime.getSize().width / 2 + (point.x - this.pos.x) * scale;
      const screenY = DSRT.Runtime.getSize().height / 2 - (point.y - this.pos.y) * scale;
      return { x: screenX, y: screenY, scale };
    }
  }

  // ========== 3D OBJECT ==========
  class Object3D {
    constructor(vertices = [], edges = [], color = "#007acc") {
      this.vertices = vertices;
      this.edges = edges;
      this.color = color;
      this.rotation = new Vec3(0, 0, 0);
      this.position = new Vec3(0, 0, 0);
    }

    rotate(rx, ry, rz) {
      this.rotation.x += rx;
      this.rotation.y += ry;
      this.rotation.z += rz;
    }

    getTransformedVertices() {
      const cosX = Math.cos(this.rotation.x), sinX = Math.sin(this.rotation.x);
      const cosY = Math.cos(this.rotation.y), sinY = Math.sin(this.rotation.y);
      const cosZ = Math.cos(this.rotation.z), sinZ = Math.sin(this.rotation.z);

      return this.vertices.map(v => {
        let x = v.x, y = v.y, z = v.z;

        // Rotate X
        let y1 = y * cosX - z * sinX;
        let z1 = y * sinX + z * cosX;
        y = y1; z = z1;

        // Rotate Y
        let x2 = x * cosY + z * sinY;
        let z2 = -x * sinY + z * cosY;
        x = x2; z = z2;

        // Rotate Z
        let x3 = x * cosZ - y * sinZ;
        let y3 = x * sinZ + y * cosZ;
        x = x3; y = y3;

        return new Vec3(x + this.position.x, y + this.position.y, z + this.position.z);
      });
    }

    draw(camera) {
      const c = ctx();
      const points = this.getTransformedVertices().map(v => camera.project(v));

      c.save();
      c.strokeStyle = this.color;
      c.lineWidth = 2;
      this.edges.forEach(edge => {
        const p1 = points[edge[0]];
        const p2 = points[edge[1]];
        c.beginPath();
        c.moveTo(p1.x, p1.y);
        c.lineTo(p2.x, p2.y);
        c.stroke();
      });
      c.restore();
    }
  }

  // ========== PRESET OBJECTS ==========

  function cube(size = 100, color = "#007acc") {
    const s = size / 2;
    const vertices = [
      new Vec3(-s, -s, -s), new Vec3(s, -s, -s),
      new Vec3(s, s, -s), new Vec3(-s, s, -s),
      new Vec3(-s, -s, s), new Vec3(s, -s, s),
      new Vec3(s, s, s), new Vec3(-s, s, s)
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    return new Object3D(vertices, edges, color);
  }

  // ========== 3D SCENE MANAGER ==========
  const objects = [];
  const mainCamera = new Camera(0, 0, -400);

  function add(obj) {
    objects.push(obj);
  }

  function clear() {
    objects.length = 0;
  }

  function render() {
    for (const obj of objects) obj.draw(mainCamera);
  }

  // ========== ANIMATION LOOP ==========
  function rotateAll(speedX = 0.01, speedY = 0.02) {
    for (const obj of objects) {
      obj.rotate(speedX, speedY, 0);
    }
  }

  // ========== PUBLIC API ==========
  return {
    Vec3,
    Camera,
    Object3D,
    cube,
    add,
    clear,
    render,
    rotateAll,
    mainCamera
  };

})();
