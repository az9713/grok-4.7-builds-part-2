const MARK = 2;
const TOL = 0.05;
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
let widthMm = 0.25;

function minimumMm(width) {
  return 1 / width;
}

function paint() {
  const pos = minimumMm(widthMm);
  document.getElementById("w-val").textContent = widthMm.toFixed(2) + " mm";
  document.getElementById("y-val").textContent = pos.toFixed(2) + " mm";
  document.getElementById("status").textContent = Math.abs(pos - MARK) <= TOL
    ? "The minimum meets the mark."
    : "The minimum misses the mark.";
  draw(pos);
}

function draw(yMin) {
  const cx = 340;
  const cy = 200;
  const px = 36;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#322838";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(70, cy);
  ctx.lineTo(620, cy);
  ctx.stroke();
  ctx.strokeStyle = "#7d9a72";
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  for (const side of [-1, 1]) {
    const x = cx + side * MARK * px;
    ctx.beginPath();
    ctx.moveTo(x, 36);
    ctx.lineTo(x, 360);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.strokeStyle = "#e6e2f0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 480; i++) {
    const s = (i / 480) * 12 - 6;
    const x = cx + s * px;
    const beta = Math.PI * s / yMin;
    const inten = Math.abs(beta) < 1e-6 ? 1 : (Math.sin(beta) / beta) ** 2;
    const y = cy - inten * 130;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.strokeStyle = "#e07a5f";
  ctx.lineWidth = 2;
  for (const side of [-1, 1]) {
    const x = cx + side * yMin * px;
    ctx.beginPath();
    ctx.moveTo(x, cy + 16);
    ctx.lineTo(x, cy + 150);
    ctx.stroke();
  }
  ctx.font = "13px Consolas, monospace";
  ctx.fillStyle = "#7d9a72";
  ctx.fillText("-2.00 mm", cx - MARK * px - 36, 28);
  ctx.fillText("2.00 mm", cx + MARK * px - 28, 28);
  ctx.fillStyle = "#e07a5f";
  ctx.fillText(yMin.toFixed(2) + " mm", cx + yMin * px + 6, cy + 146);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  widthMm = Number(button.dataset.w);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
