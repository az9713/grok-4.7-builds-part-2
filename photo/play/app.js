const MARK = 2;
const TOL = 0.05;
const canvas = document.getElementById("plate");
const ctx = canvas.getContext("2d");
let nm = 620;

function electronEv(wavelength) {
  return 1240 / wavelength - 2;
}

function rayInk(wavelength) {
  if (wavelength >= 400) return "#e07a5f";
  if (wavelength >= 200) return "#7eb6e0";
  return "#c9a0e0";
}

function paint() {
  const energy = electronEv(nm);
  document.getElementById("w-val").textContent = nm + " nm";
  document.getElementById("e-val").textContent = energy.toFixed(2) + " eV";
  document.getElementById("status").textContent = Math.abs(energy - MARK) <= TOL
    ? "The electron energy meets the mark."
    : "The electron energy misses the mark.";
  draw(energy);
}

function draw(energy) {
  const barX = 520;
  const barBottom = 350;
  const barH = 250;
  const barW = 28;
  const fillH = (Math.max(energy, 0) / 10) * barH;
  const markH = (MARK / 10) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = rayInk(nm);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(40, 120);
  ctx.lineTo(150, 190);
  ctx.stroke();
  ctx.fillStyle = "#8a8090";
  ctx.fillRect(150, 140, 28, 140);
  ctx.fillStyle = "#d8d0e0";
  ctx.beginPath();
  ctx.arc(230, 250 - energy * 16, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#342838";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#c9a0e0";
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
  if (Math.abs(energy - MARK) > 0.01) {
    ctx.fillText("2.00 eV", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  nm = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
