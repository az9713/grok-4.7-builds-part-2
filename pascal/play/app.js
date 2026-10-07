const MARK = 49;
const TOL = 0.2;
const canvas = document.getElementById("tank");
const ctx = canvas.getContext("2d");
let depth = 1;

function pressureKpa(metres) {
  return (98 * metres) / 10;
}

function paint() {
  const pressure = pressureKpa(depth);
  document.getElementById("d-val").textContent = depth + " m";
  document.getElementById("p-val").textContent = pressure.toFixed(1) + " kPa";
  document.getElementById("status").textContent = Math.abs(pressure - MARK) <= TOL
    ? "The pressure meets the mark."
    : "The pressure misses the mark.";
  draw();
}

function draw() {
  const bottom = 380;
  const px = 16;
  const surface = bottom - depth * px;
  const markY = bottom - 5 * px;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8aa8b0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(80, 40);
  ctx.lineTo(80, bottom);
  ctx.lineTo(300, bottom);
  ctx.lineTo(300, 40);
  ctx.stroke();
  ctx.fillStyle = "#3d7ea6";
  ctx.fillRect(83, surface, 214, bottom - surface);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(60, markY);
  ctx.lineTo(340, markY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  if (depth !== 5) ctx.fillText("5 m", 348, markY + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  depth = Number(button.dataset.d);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
