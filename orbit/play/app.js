const MARK = 4;
const TOL = 0.05;
const canvas = document.getElementById("path");
const ctx = canvas.getContext("2d");
let radius = 4;

function metresPerSecond(value) {
  return 20 / Math.sqrt(value);
}

function paint() {
  const speed = metresPerSecond(radius);
  document.getElementById("r-val").textContent = radius + " m";
  document.getElementById("v-val").textContent = speed.toFixed(2) + " m/s";
  document.getElementById("status").textContent = Math.abs(speed - MARK) <= TOL
    ? "The speed meets the mark."
    : "The speed misses the mark.";
  draw(speed);
}

function draw(speed) {
  const barX = 520;
  const barBottom = 350;
  const barH = 250;
  const barW = 28;
  const fillH = (speed / 12) * barH;
  const markH = (MARK / 12) * barH;
  const cx = 170;
  const cy = 210;
  const rad = 24 + Math.sqrt(radius) * 8;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f4efe8";
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#d4b483";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, rad, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#3c3428";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#d4b483";
  ctx.fillRect(barX, barBottom - fillH, barW, fillH);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(barX - 16, barBottom - markH);
  ctx.lineTo(barX + barW + 16, barBottom - markH);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  if (Math.abs(speed - MARK) > 0.05) {
    ctx.fillText("4.00 m/s", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  radius = Number(button.dataset.r);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
