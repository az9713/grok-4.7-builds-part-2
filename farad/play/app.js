const MARK = 10;
const TOL = 0.2;
const canvas = document.getElementById("plates");
const ctx = canvas.getContext("2d");
let volts = 2;

function microcoulomb(value) {
  return (5 * value) / 2;
}

function paint() {
  const charge = microcoulomb(volts);
  document.getElementById("v-val").textContent = volts + " V";
  document.getElementById("q-val").textContent = charge.toFixed(1) + " µC";
  document.getElementById("status").textContent = Math.abs(charge - MARK) <= TOL
    ? "The charge meets the mark."
    : "The charge misses the mark.";
  draw(charge);
}

function draw(charge) {
  const barX = 520;
  const barBottom = 350;
  const barH = 250;
  const barW = 28;
  const fillH = (charge / 30) * barH;
  const markH = (MARK / 30) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#7ec8c9";
  ctx.fillRect(90, 120, 16, 160);
  ctx.fillRect(150, 120, 16, 160);
  ctx.fillStyle = "#d8e8e8";
  const dots = Math.max(1, Math.round(charge / 5));
  for (let i = 0; i < dots; i++) {
    ctx.beginPath();
    ctx.arc(128, 150 + i * 28, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#24343c";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#7ec8c9";
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
  if (Math.abs(charge - MARK) > 0.05) {
    ctx.fillText("10.0 µC", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  volts = Number(button.dataset.v);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
