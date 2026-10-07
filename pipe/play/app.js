const MARK = 250;
const TOL = 1;
const canvas = document.getElementById("tube");
const ctx = canvas.getContext("2d");
let mm = 200;

function hertz(lengthMm) {
  return 85000 / lengthMm;
}

function paint() {
  const freq = hertz(mm);
  document.getElementById("m-val").textContent = (mm / 1000).toFixed(2) + " m";
  document.getElementById("f-val").textContent = freq.toFixed(0) + " Hz";
  document.getElementById("status").textContent = Math.abs(freq - MARK) <= TOL
    ? "The pitch meets the mark."
    : "The pitch misses the mark.";
  draw();
}

function draw() {
  const y = 190;
  const start = 70;
  const px = 0.6;
  const end = start + mm * px;
  const markX = start + 340 * px;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(markX, 78);
  ctx.lineTo(markX, 300);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("0.34 m", markX - 22, 64);
  ctx.fillStyle = "#3a4034";
  ctx.fillRect(start - 14, y - 48, 14, 96);
  ctx.strokeStyle = "#c4b49a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(start, y - 36);
  ctx.lineTo(end, y - 36);
  ctx.moveTo(start, y + 36);
  ctx.lineTo(end, y + 36);
  ctx.stroke();
  ctx.strokeStyle = "#7eb6c9";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = start + (end - start) * t;
    const dy = Math.sin((t * Math.PI) / 2) * 28;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y - dy);
  }
  ctx.stroke();
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  mm = Number(button.dataset.mm);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
