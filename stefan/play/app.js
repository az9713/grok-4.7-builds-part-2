const MARK = 16;
const TOL = 0.05;
const canvas = document.getElementById("glow");
const ctx = canvas.getContext("2d");
let kelvin = 300;

function powerOf(value) {
  return Math.pow(value / 300, 4);
}

function paint() {
  const power = powerOf(kelvin);
  document.getElementById("t-val").textContent = kelvin + " K";
  document.getElementById("p-val").textContent = power.toFixed(2);
  document.getElementById("status").textContent = Math.abs(power - MARK) <= TOL
    ? "The power meets the mark."
    : "The power misses the mark.";
  draw(power);
}

function draw(power) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (power / 20) * barH;
  const markH = (MARK / 20) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e07a4a";
  ctx.beginPath();
  ctx.arc(180, 210, 12 + power * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#3c2c28";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e07a4a";
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
  if (Math.abs(power - MARK) > 0.01) {
    ctx.fillText("16.00", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  kelvin = Number(button.dataset.t);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
