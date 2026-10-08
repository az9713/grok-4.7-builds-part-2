const MARK = 3;
const TOL = 0.005;
const canvas = document.getElementById("wave");
const ctx = canvas.getContext("2d");
let mass = 1;

function seconds(value) {
  return Math.sqrt(value);
}

function paint() {
  const period = seconds(mass);
  document.getElementById("m-val").textContent = mass + " kg";
  document.getElementById("t-val").textContent = period.toFixed(2) + " s";
  document.getElementById("status").textContent = Math.abs(period - MARK) <= TOL
    ? "The period meets the mark."
    : "The period misses the mark.";
  draw(period);
}

function draw(period) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (period / 6) * barH;
  const markH = (MARK / 6) * barH;
  const hump = 40 + period * 48;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#98a8b4";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 240);
  ctx.lineTo(340, 240);
  ctx.stroke();
  ctx.strokeStyle = "#80b0d8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 240);
  for (let x = 0; x <= hump; x += 4) {
    const y = 240 - Math.sin((x / hump) * Math.PI * 2) * 70;
    ctx.lineTo(40 + x, y);
  }
  ctx.stroke();
  ctx.fillStyle = "#80b0d8";
  ctx.beginPath();
  ctx.arc(40 + hump, 240, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#243038";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#80b0d8";
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
  if (Math.abs(period - MARK) > TOL) {
    ctx.fillText("3.00 s", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  mass = Number(button.dataset.m);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
