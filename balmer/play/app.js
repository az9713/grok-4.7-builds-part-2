const R = 1.097e7;
const MARK = 486.2;
const TOL = 0.2;
const canvas = document.getElementById("axis");
const ctx = canvas.getContext("2d");
let level = 3;

function peakNm(n) {
  return 1e9 / (R * (0.25 - 1 / (n * n)));
}

function paint() {
  const peak = peakNm(level);
  document.getElementById("n-val").textContent = "n = " + level;
  document.getElementById("w-val").textContent = peak.toFixed(1) + " nm";
  document.getElementById("status").textContent = Math.abs(peak - MARK) <= TOL
    ? "The line meets the mark."
    : "The line misses the mark.";
  draw(peak);
}

function xOf(nm) {
  return 50 + (nm - 380) * 1.5;
}

function ink(nm) {
  if (nm > 620) return "#e05a4a";
  if (nm > 560) return "#d4b44a";
  if (nm > 500) return "#7dba6a";
  if (nm > 460) return "#5eb0c8";
  return "#8a78d0";
}

function draw(peak) {
  const axisY = 200;
  const markX = xOf(MARK);
  const x = xOf(peak);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#3a3048";
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
  if (Math.abs(peak - MARK) > 0.05) ctx.fillText("486.2 nm", markX + 8, 78);
  ctx.strokeStyle = ink(peak);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, 96);
  ctx.lineTo(x, 280);
  ctx.stroke();
  ctx.fillStyle = ink(peak);
  ctx.beginPath();
  ctx.arc(x, axisY, 7, 0, Math.PI * 2);
  ctx.fill();
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  level = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
