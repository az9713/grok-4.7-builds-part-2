const MARK = 18;
const TOL = 1;
const canvas = document.getElementById("ring");
const ctx = canvas.getContext("2d");
let speed = 2;

function accel(v) {
  return (v * v) / 2;
}

function paint() {
  const value = accel(speed);
  document.getElementById("v-val").textContent = speed + " m/s";
  document.getElementById("a-val").textContent = value.toFixed(0) + " m/s²";
  document.getElementById("status").textContent = Math.abs(value - MARK) <= TOL
    ? "The acceleration meets the mark."
    : "The acceleration misses the mark.";
  draw(value);
}

function draw(value) {
  const cx = 220;
  const cy = 210;
  const r = 110;
  const barX = 500;
  const barBottom = 360;
  const barH = 280;
  const barW = 28;
  const fillH = (value / 60) * barH;
  const markH = (MARK / 60) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#5a5060";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#e0c07a";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + r, cy);
  ctx.stroke();
  ctx.fillStyle = "#e0c07a";
  ctx.beginPath();
  ctx.arc(cx + r, cy, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#3a3044";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e0c07a";
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
  if (Math.abs(value - MARK) > 0.5) ctx.fillText("18", barX + barW + 22, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  speed = Number(button.dataset.v);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
