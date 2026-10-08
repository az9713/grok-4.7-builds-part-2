const MARK = 100;
const TOL = 0.5;
const canvas = document.getElementById("stack");
const ctx = canvas.getContext("2d");
let block = 2;

function heapCount(value) {
  const tri = (value * (value + 1)) / 2;
  return tri * tri;
}

function paint() {
  const count = heapCount(block);
  document.getElementById("n-val").textContent = "Block " + block;
  document.getElementById("h-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The heap meets the mark."
    : "The heap misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 441) * barH;
  const markH = (MARK / 441) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#d0a070";
  for (let i = 0; i < block; i++) {
    const h = 24 + i * 22;
    ctx.fillRect(40 + i * 36, 250 - h, 28, h);
  }
  ctx.strokeStyle = "#403828";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#d0a070";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("heap 100", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  block = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
