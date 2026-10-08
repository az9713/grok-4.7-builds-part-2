const MARK = 35;
const TOL = 0.5;
const canvas = document.getElementById("five");
const ctx = canvas.getContext("2d");
let rank = 3;

function figure(value) {
  return (value * (3 * value - 1)) / 2;
}

function paint() {
  const count = figure(rank);
  document.getElementById("n-val").textContent = "Rank " + rank;
  document.getElementById("f-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The figure meets the mark."
    : "The figure misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 70) * barH;
  const markH = (MARK / 70) * barH;
  const cx = 130;
  const cy = 220;
  const radius = 70;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#e0c070";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "#e0c070";
  for (let i = 0; i < rank; i++) ctx.fillRect(36 + i * 24, 58, 16, 16);
  ctx.strokeStyle = "#403828";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e0c070";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("figure 35", barX + barW + 18, barBottom - markH + 4);
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
