const MARK = 95;
const TOL = 0.5;
const canvas = document.getElementById("eleven");
const ctx = canvas.getContext("2d");
let rank = 3;

function hendecagon(value) {
  return (value * (9 * value - 7)) / 2;
}

function paint() {
  const count = hendecagon(rank);
  document.getElementById("n-val").textContent = "Index " + rank;
  document.getElementById("h-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The hendecagon meets the mark."
    : "The hendecagon misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 196) * barH;
  const markH = (MARK / 196) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#b09078";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 11; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 11;
    const x = 140 + 66 * Math.cos(angle);
    const y = 220 + 66 * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "#b09078";
  for (let i = 0; i < rank; i++) ctx.fillRect(28 + i * 22, 52, 16, 16);
  ctx.strokeStyle = "#322c34";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#b09078";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("hendecagon 95", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  rank = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
