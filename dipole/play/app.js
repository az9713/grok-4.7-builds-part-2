const MARK = 2;
const TOL = 0.005;
const canvas = document.getElementById("magnet");
const ctx = canvas.getContext("2d");
let degrees = 0;

function newtonMetres(value) {
  return 4 * Math.sin((value * Math.PI) / 180);
}

function paint() {
  const torque = newtonMetres(degrees);
  document.getElementById("d-val").textContent = degrees + "°";
  document.getElementById("q-val").textContent = torque.toFixed(2) + " N m";
  document.getElementById("status").textContent = Math.abs(torque - MARK) <= TOL
    ? "The torque meets the mark."
    : "The torque misses the mark.";
  draw(torque);
}

function draw(torque) {
  const barX = 520;
  const barBottom = 350;
  const barH = 250;
  const barW = 28;
  const fillH = (torque / 5) * barH;
  const markH = (MARK / 5) * barH;
  const rad = (degrees * Math.PI) / 180;
  const cx = 150;
  const cy = 210;
  const half = 70;
  const x1 = cx - Math.cos(rad) * half;
  const y1 = cy - Math.sin(rad) * half;
  const x2 = cx + Math.cos(rad) * half;
  const y2 = cy + Math.sin(rad) * half;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#c4a0ae";
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const y = 80 + i * 50;
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(300, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "#e07098";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.fillStyle = "#f6eef2";
  ctx.beginPath();
  ctx.arc(x1, y1, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e07098";
  ctx.beginPath();
  ctx.arc(x2, y2, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#3c2834";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e07098";
  ctx.fillRect(barX, barBottom - fillH, barW, barH);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(barX - 16, barBottom - markH);
  ctx.lineTo(barX + barW + 16, barBottom - markH);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  if (Math.abs(torque - MARK) > TOL) {
    ctx.fillText("2.00 N m", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  degrees = Number(button.dataset.d);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
