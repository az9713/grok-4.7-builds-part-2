const N = 1.5;
const BREW = Math.atan(N) * 180 / Math.PI;
const TOL = 0.5;
const canvas = document.getElementById("plate");
const ctx = canvas.getContext("2d");
const slider = document.getElementById("angle");

function paint() {
  const deg = Number(slider.value);
  document.getElementById("i-val").textContent = deg + "°";
  document.getElementById("b-val").textContent = BREW.toFixed(1) + "°";
  const win = Math.abs(deg - BREW) <= TOL;
  document.getElementById("status").textContent = win
    ? "The rays meet at a right angle."
    : "The rays are not at a right angle.";
  draw(deg, win);
}

function draw(deg, win) {
  const i = deg * Math.PI / 180;
  const r = Math.asin(Math.sin(i) / N);
  const px = 340;
  const py = 200;
  const len = 180;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#16362c";
  ctx.fillRect(36, py, 608, 170);
  ctx.strokeStyle = "#d4b483";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(36, py);
  ctx.lineTo(644, py);
  ctx.stroke();
  ctx.strokeStyle = "#2c3824";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(px, 36);
  ctx.lineTo(px, py);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = "#e6c36a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px - Math.sin(i) * len, py - Math.cos(i) * len);
  ctx.lineTo(px, py);
  ctx.lineTo(px + Math.sin(i) * len, py - Math.cos(i) * len);
  ctx.stroke();
  ctx.strokeStyle = "#7ec8c3";
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(px + Math.sin(r) * len, py + Math.cos(r) * len);
  ctx.stroke();
  const ax = Math.sin(i);
  const ay = -Math.cos(i);
  const bx = Math.sin(r);
  const by = Math.cos(r);
  const s = 16;
  ctx.strokeStyle = win ? "#8fb089" : "#8ea090";
  ctx.beginPath();
  ctx.moveTo(px + ax * s, py + ay * s);
  ctx.lineTo(px + (ax + bx) * s, py + (ay + by) * s);
  ctx.lineTo(px + bx * s, py + by * s);
  ctx.stroke();
  ctx.fillStyle = "#8ea090";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("air", 48, 48);
  ctx.fillText("glass 1.50", 48, py + 28);
  ctx.fillText(deg + "°", px - Math.sin(i) * len + 8, py - Math.cos(i) * len);
}

slider.addEventListener("input", paint);
paint();
