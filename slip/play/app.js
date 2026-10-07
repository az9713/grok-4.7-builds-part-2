const MARK = 0.5;
const TOL = 0.01;
const canvas = document.getElementById("bench");
const ctx = canvas.getContext("2d");
const slider = document.getElementById("angle");

function tangent(deg) {
  return Math.tan(deg * Math.PI / 180);
}

function paint() {
  const deg = Number(slider.value);
  const value = tangent(deg);
  document.getElementById("a-val").textContent = deg + "°";
  document.getElementById("t-val").textContent = value.toFixed(3);
  document.getElementById("status").textContent = Math.abs(value - MARK) <= TOL
    ? "The plank is at the slip angle."
    : "The plank is not at the slip angle.";
  draw(deg);
}

function draw(deg) {
  const th = deg * Math.PI / 180;
  const x0 = 90;
  const y0 = 320;
  const len = 280;
  const x1 = x0 + Math.cos(th) * len;
  const y1 = y0 - Math.sin(th) * len;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#3a3228";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, y0);
  ctx.lineTo(640, y0);
  ctx.stroke();
  ctx.strokeStyle = "#a89884";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x0, y0, 48, -th, 0);
  ctx.stroke();
  ctx.fillStyle = "#a89884";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText(deg + "°", x0 + 56, y0 - 8);
  ctx.strokeStyle = "#c4a574";
  ctx.lineWidth = 8;
  ctx.lineCap = "butt";
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  const size = 36;
  const nx = -Math.sin(th);
  const ny = -Math.cos(th);
  const mx = (x0 + x1) / 2 + nx * (size / 2 + 4);
  const my = (y0 + y1) / 2 + ny * (size / 2 + 4);
  ctx.save();
  ctx.translate(mx, my);
  ctx.rotate(-th);
  ctx.fillStyle = "#e07a5f";
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.restore();
}

slider.addEventListener("input", paint);
paint();
