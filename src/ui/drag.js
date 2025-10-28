// src/ui/drag.js
// ==============================================
// DSRT Drag-and-Drop Utility
// ==============================================

export let draggableDB = [];
let draggingItem = null;

export function makeDraggable(id, x, y, width, height, onDrag = null) {
  draggableDB.push({ id, x, y, width, height, onDrag });
}

export function checkDragStart(e) {
  const id = document.getElementById("scene");
  const xClick = e.pageX - id.offsetLeft;
  const yClick = e.pageY - id.offsetTop;

  for (const obj of draggableDB) {
    if (
      xClick > obj.x && xClick < obj.x + obj.width &&
      yClick > obj.y && yClick < obj.y + obj.height
    ) {
      draggingItem = obj;
      break;
    }
  }
}

export function checkDragMove(e) {
  if (!draggingItem) return;
  const id = document.getElementById("scene");
  const x = e.pageX - id.offsetLeft;
  const y = e.pageY - id.offsetTop;

  draggingItem.x = x - draggingItem.width / 2;
  draggingItem.y = y - draggingItem.height / 2;

  if (draggingItem.onDrag) draggingItem.onDrag(draggingItem);
}

export function checkDragEnd() {
  draggingItem = null;
}
