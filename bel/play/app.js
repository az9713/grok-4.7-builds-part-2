const MARK = 30;
const TOL = 1;
const canvas = document.getElementById("meter");
const ctx = canvas.getContext("2d");
let ratio = 10;

function decibels(value) {
  return 10 * Math.log10(value);
}

function paint() {
  const level = decibels(ratio);
  document.getElementById("p-val").textContent = "x" + ratio;
  document.getElementById("b-val").textContent = level.toFixed(0) + " dB";
  document.getElementById("status").textContent = Math.abs(level - MARK) <= TOL
    ? "The level meets the mark."
    : "The level misses the mark.";
  draw(level);
}

function draw(level) {
  const barX = 300;
  const barBottom = 360;
  const barH = 280;
  const barW = 40;
  const fillH = (level / 60) * barH;
  const markH = (MARK / 60) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#3a3048";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#c49be0";
  ctx.fillRect(barX, barBottom - fillH, barW, fillH);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(barX - 24, barBottom - markH);
  ctx.lineTo(barX + barW + 24, barBottom - markH);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  if (Math.abs(level - MARK) > 0.5) ctx.fillText("30 dB", barX + barW + 32, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  ratio = Number(button.dataset.p);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
