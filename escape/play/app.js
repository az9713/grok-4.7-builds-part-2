const MARK = 12;
const TOL = 0.05;
const canvas = document.getElementById("well");
const ctx = canvas.getContext("2d");
let height = 2;

function metresPerSecond(value) {
  return Math.sqrt(8 * value);
}

function paint() {
  const speed = metresPerSecond(height);
  document.getElementById("h-val").textContent = height + " m";
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
  const fillH = (speed / 24) * barH;
  const markH = (MARK / 24) * barH;
  const cx = 150;
  const cy = 270;
  const pr = 42;
  const len = speed * 6;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e0c080";
  ctx.beginPath();
  ctx.arc(cx, cy, pr, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f4efe8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy - pr - 8);
  ctx.lineTo(cx, cy - pr - 8 - len);
  ctx.stroke();
  ctx.strokeStyle = "#3c3048";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e0c080";
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
    ctx.fillText("12.00 m/s", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  height = Number(button.dataset.h);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
