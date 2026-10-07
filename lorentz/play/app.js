const MARK = 0.8;
const TOL = 0.02;
const canvas = document.getElementById("track");
const ctx = canvas.getContext("2d");
let beta = 0;

function lengthM(b) {
  return Math.sqrt(1 - b * b);
}

function paint() {
  const metres = lengthM(beta);
  document.getElementById("b-val").textContent = beta.toFixed(2) + " c";
  document.getElementById("l-val").textContent = metres.toFixed(2) + " m";
  document.getElementById("status").textContent = Math.abs(metres - MARK) <= TOL
    ? "The length meets the mark."
    : "The length misses the mark.";
  draw(metres);
}

function draw(metres) {
  const y = 180;
  const start = 80;
  const px = 480;
  const end = start + metres * px;
  const markX = start + MARK * px;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#e07a5f";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(markX, 70);
  ctx.lineTo(markX, 290);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#e07a5f";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("0.80 m", markX - 24, 56);
  ctx.fillStyle = "#8a7d6c";
  ctx.fillRect(start - 10, y - 28, 10, 56);
  ctx.fillStyle = "#d4c4a8";
  ctx.fillRect(start, y - 16, Math.max(2, end - start), 32);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  beta = Number(button.dataset.b);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
