// src/core/utils.js
// ==============================================
// DSRT Utility Functions
// ==============================================

export function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function distanceObj(obj1, obj2) {
  return distance(obj1.x, obj1.y, obj2.x, obj2.y);
}

export function randomInt(num) {
  return Math.floor(Math.random() * num);
}

export function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

export function hexToRGBA(hex, alpha = 1.0) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    c = "0x" + c.join("");
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",")},${alpha})`;
  }
  throw new Error("Invalid HEX color code.");
}

export function getPixelColor(ctx, x, y) {
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  return "#" + ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);
}

function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255) throw "Invalid RGB component";
  return ((r << 16) | (g << 8) | b).toString(16);
}
