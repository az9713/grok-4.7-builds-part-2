const SPEED = 20;
const G = 10;
const MARK = 34.64;
const TOL = 0.3;
const SCALE = 15.5;
const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");

function range(deg) {
  const th = deg * Math.PI / 180;
  return (SPEED * SPEED / G) * Math.sin(2 * th);
}

function paint() {
  const deg = Number(document.getElementById("angle").value);
  const metres = range(deg);
  document.getElementById("angle-val").textContent = deg + "°";
  document.getElementById("range-val").textContent = metres.toFixed(2) + " m";
  document.getElementById("status").textContent = Math.abs(metres - MARK) <= TOL
    ? "The shot meets the mark."
    : "The shot misses the mark.";
  draw(deg, metres);
}

function draw(deg, metres) {
  const w = canvas.width;
  const ground = 340;
  const origin = 56;
  ctx.clearRect(0, 0, w, canvas.height);
  ctx.strokeStyle = "#3a3028";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(24, ground);
  ctx.lineTo(w - 24, ground);
  ctx.stroke();
  const flagX = origin + MARK * SCALE;
  ctx.strokeStyle = "#d35a3e";
  ctx.beginPath();
  ctx.moveTo(flagX, ground);
  ctx.lineTo(flagX, ground - 78);
  ctx.stroke();
  ctx.fillStyle = "#d35a3e";
  ctx.fillRect(flagX, ground - 78, 22, 14);
  const th = deg * Math.PI / 180;
  const flight = 2 * SPEED * Math.sin(th) / G;
  ctx.strokeStyle = "#e6c36a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 80; i++) {
    const t = flight * i / 80;
    const x = origin + SPEED * Math.cos(th) * t * SCALE;
    const y = ground - (SPEED * Math.sin(th) * t - 0.5 * G * t * t) * SCALE;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = "#f3ecdf";
  ctx.beginPath();
  ctx.arc(origin, ground, 7, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = "#a89884";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("34.64 m", flagX - 28, ground + 22);
  const landX = origin + metres * SCALE;
  if (Math.abs(landX - flagX) > 48) {
    ctx.fillText(metres.toFixed(2) + " m", landX - 24, ground + 22);
  }
}

document.getElementById("angle").addEventListener("input", paint);
paint();
