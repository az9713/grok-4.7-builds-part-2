const MARK = 8;
const TOL = 0.2;
const canvas = document.getElementById("coil");
const ctx = canvas.getContext("2d");
let turns = 10;

function volts(count) {
  return (count * 2) / 10;
}

function paint() {
  const voltage = volts(turns);
  document.getElementById("n-val").textContent = turns + " turns";
  document.getElementById("v-val").textContent = voltage.toFixed(1) + " V";
  document.getElementById("status").textContent = Math.abs(voltage - MARK) <= TOL
    ? "The voltage meets the mark."
    : "The voltage misses the mark.";
  draw(voltage);
}

function loopsOf(x, loops) {
  ctx.strokeStyle = "#d4c4a8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const top = 80;
  const span = 220;
  ctx.moveTo(x, top + span);
  for (let i = 0; i < loops; i++) {
    const y = top + span - ((i + 1) * span) / loops;
    ctx.arc(x, y + span / loops / 2, 16, Math.PI / 2, -Math.PI / 2, true);
  }
  ctx.stroke();
}

function draw(voltage) {
  const loops = Math.max(1, Math.round(turns / 10));
  const barX = 520;
  const barBottom = 350;
  const barH = 250;
  const barW = 28;
  const fillH = (voltage / 20) * barH;
  const markH = (MARK / 20) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e07a5f";
  ctx.fillRect(70, 160, 36, 80);
  ctx.fillStyle = "#8a8078";
  ctx.fillRect(106, 160, 36, 80);
  loopsOf(240, loops);
  ctx.strokeStyle = "#3c3428";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e07a5f";
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
  if (Math.abs(voltage - MARK) > 0.05) ctx.fillText("8.0 V", barX + barW + 20, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  turns = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
