const MARK = 99.8;
const TOL = 0.05;
const canvas = document.getElementById("duct");
const ctx = canvas.getContext("2d");
let speed = 20;

function pressureKpa(v) {
  return (101300 - (3 * v * v) / 5) / 1000;
}

function paint() {
  const pressure = pressureKpa(speed);
  document.getElementById("v-val").textContent = speed + " m/s";
  document.getElementById("p-val").textContent = pressure.toFixed(2) + " kPa";
  document.getElementById("status").textContent = Math.abs(pressure - MARK) <= TOL
    ? "The pressure meets the mark."
    : "The pressure misses the mark.";
  draw(pressure);
}

function draw(kPa) {
  const mid = 200;
  const half = 80 - speed;
  const barX = 560;
  const barBottom = 350;
  const barH = 250;
  const barW = 26;
  const fillH = ((kPa - 99) / 2.2) * barH;
  const markH = ((MARK - 99) / 2.2) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8aa4b0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(36, mid - 74);
  ctx.lineTo(170, mid - half);
  ctx.lineTo(330, mid - half);
  ctx.lineTo(490, mid - 74);
  ctx.moveTo(36, mid + 74);
  ctx.lineTo(170, mid + half);
  ctx.lineTo(330, mid + half);
  ctx.lineTo(490, mid + 74);
  ctx.stroke();
  ctx.strokeStyle = "#3a4a52";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#7eb6c9";
  ctx.fillRect(barX, barBottom - fillH, barW, fillH);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(barX - 18, barBottom - markH);
  ctx.lineTo(barX + barW + 18, barBottom - markH);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  if (Math.abs(kPa - MARK) > 0.01) ctx.fillText("99.80", barX - 56, barBottom - markH + 4);
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
