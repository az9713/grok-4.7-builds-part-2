const MARK = 24;
const TOL = 0.2;
const canvas = document.getElementById("coils");
const ctx = canvas.getContext("2d");
let turns = 50;

function volts(count) {
  return (12 * count) / 100;
}

function paint() {
  const voltage = volts(turns);
  document.getElementById("n-val").textContent = String(turns);
  document.getElementById("v-val").textContent = voltage.toFixed(1) + " V";
  document.getElementById("status").textContent = Math.abs(voltage - MARK) <= TOL
    ? "The voltage meets the mark."
    : "The voltage misses the mark.";
  draw(voltage);
}

function coil(x, loops, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  const top = 70;
  const span = 220;
  ctx.moveTo(x, top + span);
  for (let i = 0; i < loops; i++) {
    const y = top + span - ((i + 1) * span) / loops;
    ctx.arc(x, y + span / loops / 2, 16, Math.PI / 2, -Math.PI / 2, true);
  }
  ctx.stroke();
}

function draw(voltage) {
  const loops = Math.max(1, Math.round(turns / 50));
  const barX = 520;
  const barBottom = 350;
  const barH = 250;
  const barW = 28;
  const fillH = (voltage / 50) * barH;
  const markH = (MARK / 50) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#3a4034";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(80, 300);
  ctx.lineTo(360, 300);
  ctx.stroke();
  coil(120, 4, "#8a9a84");
  coil(300, loops, "#d4b483");
  ctx.strokeStyle = "#343c30";
  ctx.lineWidth = 2;
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
  if (Math.abs(voltage - MARK) > 0.05) ctx.fillText("24.0 V", barX + barW + 22, barBottom - markH + 4);
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
