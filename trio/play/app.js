const MARK = 20;
const TOL = 0.5;
const canvas = document.getElementById("items");
const ctx = canvas.getContext("2d");
let items = 4;

function ways(value) {
  return (value * (value - 1) * (value - 2)) / 6;
}

function paint() {
  const count = ways(items);
  document.getElementById("n-val").textContent = items + " items";
  document.getElementById("w-val").textContent = count.toFixed(0) + " ways";
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The total meets the mark."
    : "The total misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 56) * barH;
  const markH = (MARK / 56) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f8eef2";
  for (let i = 0; i < items; i++) {
    ctx.beginPath();
    ctx.arc(48 + i * 28, 90, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#e090b0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 230);
  ctx.lineTo(96, 160);
  ctx.lineTo(144, 230);
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = "#3c2834";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e090b0";
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
  if (Math.abs(count - MARK) > TOL) {
    ctx.fillText("20 ways", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  items = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
