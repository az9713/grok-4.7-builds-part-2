const MARK = 68;
const TOL = 0.05;
const canvas = document.getElementById("pair");
const ctx = canvas.getContext("2d");
let celsius = 0;

function fahrenheit(value) {
  return 32 + 1.8 * value;
}

function paint() {
  const reading = fahrenheit(celsius);
  document.getElementById("c-val").textContent = celsius + " °C";
  document.getElementById("f-val").textContent = reading.toFixed(1) + " °F";
  document.getElementById("status").textContent = Math.abs(reading - MARK) <= TOL
    ? "The reading meets the mark."
    : "The reading misses the mark.";
  draw(reading);
}

function thermo(x, frac) {
  ctx.strokeStyle = "#f6f4e8";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, 90, 16, 150);
  ctx.fillStyle = "#e0d090";
  ctx.beginPath();
  ctx.arc(x + 8, 252, 16, 0, Math.PI * 2);
  ctx.fill();
  const h = Math.max(0, Math.min(1, frac)) * 130;
  ctx.fillRect(x + 4, 230 - h, 8, h);
}

function draw(reading) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (reading / 220) * barH;
  const markH = (MARK / 220) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  thermo(80, celsius / 100);
  thermo(190, reading / 220);
  ctx.strokeStyle = "#3c3824";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e0d090";
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
  if (Math.abs(reading - MARK) > TOL) {
    ctx.fillText("68.0 °F", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  celsius = Number(button.dataset.c);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
