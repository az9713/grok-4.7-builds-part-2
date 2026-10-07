const U = 30;
const SCREEN = 60;
const TOL = 2;
const S = 6;
const canvas = document.getElementById("bench");
const ctx = canvas.getContext("2d");
let fCm = 10;

function imageCm(f) {
  const inv = 1 / f - 1 / U;
  if (inv <= 0) return null;
  return 1 / inv;
}

function paint() {
  const v = imageCm(fCm);
  document.getElementById("f-val").textContent = fCm + " cm";
  document.getElementById("v-val").textContent = v === null ? "none" : v.toFixed(1) + " cm";
  let line = "The image misses the screen.";
  if (v === null) line = "The rays do not meet on the screen.";
  else if (Math.abs(v - SCREEN) <= TOL) line = "The image meets the screen.";
  document.getElementById("status").textContent = line;
  draw(fCm, v);
}

function strokeThrough(x0, y0, x1, y1, xStop) {
  const dx = x1 - x0;
  const t = (xStop - x0) / dx;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(xStop, y0 + t * (y1 - y0));
  ctx.stroke();
}

function draw(f, v) {
  const w = canvas.width;
  const lensX = 230;
  const axis = 210;
  const objH = 48;
  const objX = lensX - U * S;
  const screenX = lensX + SCREEN * S;
  const tipY = axis - objH;
  ctx.clearRect(0, 0, w, canvas.height);
  ctx.strokeStyle = "#2a3338";
  ctx.beginPath();
  ctx.moveTo(24, axis);
  ctx.lineTo(w - 24, axis);
  ctx.stroke();
  ctx.strokeStyle = "#e7e1d6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(screenX, axis - 130);
  ctx.lineTo(screenX, axis + 150);
  ctx.stroke();
  ctx.strokeStyle = "#d4b483";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(lensX, axis, 12, 118, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#7ec8c3";
  ctx.lineWidth = 2;
  const stop = v !== null && lensX + v * S < w - 28 ? lensX + v * S : w - 28;
  strokeThrough(objX, tipY, lensX, axis, stop);
  ctx.beginPath();
  ctx.moveTo(objX, tipY);
  ctx.lineTo(lensX, tipY);
  ctx.stroke();
  strokeThrough(lensX, tipY, lensX + f * S, axis, stop);
  ctx.strokeStyle = "#e7e1d6";
  ctx.beginPath();
  ctx.moveTo(objX, axis);
  ctx.lineTo(objX, tipY);
  ctx.stroke();
  if (v !== null && lensX + v * S < w - 20) {
    const imageX = lensX + v * S;
    const imageH = objH * v / U;
    ctx.strokeStyle = "#e07a5f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(imageX, axis);
    ctx.lineTo(imageX, axis + imageH);
    ctx.stroke();
  }
  const focusX = lensX + f * S;
  if (focusX < w - 20) {
    ctx.fillStyle = "#d4b483";
    ctx.fillRect(focusX - 1, axis - 8, 2, 16);
    ctx.font = "13px Consolas, monospace";
    ctx.fillText("F", focusX - 4, axis - 14);
  }
  ctx.fillStyle = "#8d938c";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("object", objX - 24, axis + 28);
  ctx.fillText("lens", lensX - 16, axis + 146);
  ctx.fillText("60 cm", screenX - 22, axis - 138);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  fCm = Number(button.dataset.f);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});
paint();
