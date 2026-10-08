const MARK = 18;
const TOL = 0.2;
const canvas = document.getElementById("coil");
const ctx = canvas.getContext("2d");
let current = 2;

function joules(value) {
  return (value * value) / 2;
}

function paint() {
  const energy = joules(current);
  document.getElementById("i-val").textContent = current + " A";
  document.getElementById("e-val").textContent = energy.toFixed(1) + " J";
  document.getElementById("status").textContent = Math.abs(energy - MARK) <= TOL
    ? "The energy meets the mark."
    : "The energy misses the mark.";
  draw(energy);
}

function draw(energy) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (energy / 60) * barH;
  const markH = (MARK / 60) * barH;
  const rings = Math.max(1, Math.round(current / 2));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#f6eef4";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(160, 50);
  ctx.lineTo(160, 370);
  ctx.stroke();
  ctx.strokeStyle = "#c9a0d0";
  ctx.lineWidth = 2;
  for (let i = 1; i <= rings; i++) {
    ctx.beginPath();
    ctx.arc(160, 210, i * 22, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = "#3c3040";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#c9a0d0";
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
  if (Math.abs(energy - MARK) > 0.2) {
    ctx.fillText("18.0 J", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  current = Number(button.dataset.i);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
