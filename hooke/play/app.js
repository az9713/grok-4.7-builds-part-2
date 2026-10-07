const MARK = 10;
const TOL = 0.2;
const canvas = document.getElementById("bench");
const ctx = canvas.getContext("2d");
let force = 2;

function extensionMm(newtons) {
  return newtons / 0.4;
}

function paint() {
  const extension = extensionMm(force);
  document.getElementById("f-val").textContent = force + " N";
  document.getElementById("x-val").textContent = extension.toFixed(1) + " mm";
  document.getElementById("status").textContent = Math.abs(extension - MARK) <= TOL
    ? "The spring meets the mark."
    : "The spring misses the mark.";
  draw(extension);
}

function draw(extension) {
  const y = 170;
  const start = 90;
  const px = 22;
  const end = start + extension * px;
  const massX = end;
  const springEnd = massX - 18;
  const markX = start + MARK * px;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#3a3228";
  ctx.fillRect(50, 70, 16, 200);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(markX, 70);
  ctx.lineTo(markX, 280);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("10.0 mm", markX - 28, 58);
  ctx.strokeStyle = "#d4b483";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(66, y);
  ctx.lineTo(start, y);
  const turns = 10;
  const span = Math.max(12, springEnd - start);
  for (let i = 0; i <= turns; i++) {
    const x = start + (span * i) / turns;
    const dy = i % 2 === 0 ? -18 : 18;
    ctx.lineTo(x, y + (i === 0 || i === turns ? 0 : dy));
  }
  ctx.stroke();
  ctx.fillStyle = "#e07a5f";
  ctx.beginPath();
  ctx.arc(massX, y, 16, 0, Math.PI * 2);
  ctx.fill();
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  force = Number(button.dataset.f);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
