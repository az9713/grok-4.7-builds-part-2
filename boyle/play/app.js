const MARK = 250;
const TOL = 5;
const canvas = document.getElementById("cylinder");
const ctx = canvas.getContext("2d");
let litres = 4;

function pressure(volume) {
  return 400 / volume;
}

function paint() {
  const kpa = pressure(litres);
  document.getElementById("v-val").textContent = litres.toFixed(1) + " L";
  document.getElementById("p-val").textContent = kpa.toFixed(1) + " kPa";
  document.getElementById("status").textContent = Math.abs(kpa - MARK) <= TOL
    ? "The pressure meets the mark."
    : "The pressure misses the mark.";
  draw(litres, kpa);
}

function draw(volume, kpa) {
  const bottom = 360;
  const left = 120;
  const width = 160;
  const px = 52;
  const wallTop = bottom - 4 * px - 28;
  const pistonY = bottom - volume * px;
  const markY = bottom - 1.6 * px;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#3d6b7a";
  ctx.fillRect(left + 3, pistonY, width - 6, bottom - pistonY);
  ctx.fillStyle = "#c4845c";
  ctx.fillRect(left - 10, pistonY - 14, width + 20, 16);
  ctx.strokeStyle = "#8fb089";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left - 28, markY);
  ctx.lineTo(left + width + 18, markY);
  ctx.stroke();
  ctx.strokeStyle = "#a89884";
  ctx.strokeRect(left, wallTop, width, bottom - wallTop);
  const cx = 500;
  const cy = 250;
  const radius = 78;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI, 0, true);
  ctx.stroke();
  const markAngle = Math.PI * (1 - MARK / 400);
  ctx.strokeStyle = "#8fb089";
  ctx.beginPath();
  ctx.moveTo(cx + Math.cos(markAngle) * (radius - 10), cy - Math.sin(markAngle) * (radius - 10));
  ctx.lineTo(cx + Math.cos(markAngle) * (radius + 12), cy - Math.sin(markAngle) * (radius + 12));
  ctx.stroke();
  const needle = Math.PI * (1 - Math.max(0, Math.min(400, kpa)) / 400);
  ctx.strokeStyle = "#f3ecdf";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(needle) * (radius - 16), cy - Math.sin(needle) * (radius - 16));
  ctx.stroke();
  ctx.fillStyle = "#c4845c";
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#a89884";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("1.6 L", left + width + 24, markY + 4);
  ctx.fillText("250", cx + Math.cos(markAngle) * (radius + 24) - 12, cy - Math.sin(markAngle) * (radius + 24));
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  litres = Number(button.dataset.v);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});
paint();
