const MARK = 45;
const TOL = 0.2;
const canvas = document.getElementById("track");
const ctx = canvas.getContext("2d");
let speed = 5;

function joules(value) {
  return (value * value) / 5;
}

function paint() {
  const energy = joules(speed);
  document.getElementById("v-val").textContent = speed + " m/s";
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
  const fillH = (energy / 140) * barH;
  const markH = (MARK / 140) * barH;
  const blockX = 50 + speed * 12;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#5a5048";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(40, 250);
  ctx.lineTo(470, 250);
  ctx.stroke();
  ctx.fillStyle = "#e0a15f";
  ctx.fillRect(blockX, 214, 36, 36);
  ctx.strokeStyle = "#3c3428";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e0a15f";
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
  if (Math.abs(energy - MARK) > 0.05) {
    ctx.fillText("45.0 J", barX + barW + 18, barBottom - markH + 4);
  }
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
