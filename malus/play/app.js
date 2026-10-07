const MARK = 0.25;
const TOL = 0.01;
const canvas = document.getElementById("bench");
const ctx = canvas.getContext("2d");

function intensity(deg) {
  const t = deg * Math.PI / 180;
  return Math.cos(t) * Math.cos(t);
}

function paint() {
  const deg = Number(document.getElementById("angle").value);
  const beam = intensity(deg);
  document.getElementById("angle-val").textContent = deg + "°";
  document.getElementById("beam").textContent = beam.toFixed(2);
  document.getElementById("status").textContent = Math.abs(beam - MARK) <= TOL
    ? "The analyzer hits the mark."
    : "The beam misses the mark.";
  draw(deg, beam);
}

function disc(x, y, deg, label) {
  ctx.strokeStyle = "#c8b48a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, 54, 0, Math.PI * 2);
  ctx.stroke();
  const t = deg * Math.PI / 180;
  ctx.beginPath();
  ctx.moveTo(x - Math.cos(t) * 46, y - Math.sin(t) * 46);
  ctx.lineTo(x + Math.cos(t) * 46, y + Math.sin(t) * 46);
  ctx.stroke();
  ctx.fillStyle = "#8e8a80";
  ctx.font = "14px Consolas, monospace";
  ctx.fillText(label, x - 28, y + 78);
}

function draw(deg, beam) {
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(242, 212, 138, " + (0.15 + 0.85 * beam) + ")";
  ctx.fillRect(70, h / 2 - 10, w - 140, 20);
  disc(170, h / 2, 0, "polarizer");
  disc(430, h / 2, deg, "analyzer");
  const x = w - 86;
  const top = 28;
  const barH = 150;
  const bottom = top + barH;
  ctx.strokeStyle = "#2a3038";
  ctx.strokeRect(x, top, 34, barH);
  ctx.fillStyle = "#f2d48a";
  ctx.fillRect(x, bottom - beam * barH, 34, beam * barH);
  const markY = bottom - MARK * barH;
  ctx.strokeStyle = "#7d9a72";
  ctx.beginPath();
  ctx.moveTo(x - 10, markY);
  ctx.lineTo(x + 44, markY);
  ctx.stroke();
  ctx.fillStyle = "#8e8a80";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("0.25", x - 52, markY + 4);
}

document.getElementById("angle").addEventListener("input", paint);
paint();
