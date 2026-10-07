const MARK = 2;
const TOL = 0.05;
const canvas = document.getElementById("axis");
const ctx = canvas.getContext("2d");
let nm = 400;

function electronVolts(wavelength) {
  return 1240 / wavelength;
}

function paint() {
  const energy = electronVolts(nm);
  document.getElementById("n-val").textContent = nm + " nm";
  document.getElementById("e-val").textContent = energy.toFixed(2) + " eV";
  document.getElementById("status").textContent = Math.abs(energy - MARK) <= TOL
    ? "The energy meets the mark."
    : "The energy misses the mark.";
  draw(energy);
}

function xOf(energy) {
  return 50 + (energy - 1.2) * 240;
}

function ink(wavelength) {
  if (wavelength < 460) return "#8a78d0";
  if (wavelength < 540) return "#7dba6a";
  if (wavelength < 650) return "#e07a3d";
  return "#e05a4a";
}

function draw(energy) {
  const axisY = 190;
  const markX = xOf(MARK);
  const x = xOf(energy);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#3a2c38";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, axisY);
  ctx.lineTo(640, axisY);
  ctx.stroke();
  ctx.strokeStyle = "#e6b15a";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(markX, 60);
  ctx.lineTo(markX, 300);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#e6b15a";
  ctx.font = "13px Consolas, monospace";
  if (Math.abs(energy - MARK) > 0.01) ctx.fillText("2.00 eV", markX + 8, 78);
  ctx.strokeStyle = ink(nm);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, 96);
  ctx.lineTo(x, 280);
  ctx.stroke();
  ctx.fillStyle = ink(nm);
  ctx.beginPath();
  ctx.arc(x, axisY, 7, 0, Math.PI * 2);
  ctx.fill();
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  nm = Number(button.dataset.nm);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
