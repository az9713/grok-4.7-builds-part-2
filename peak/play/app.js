const MARK = 46;
const TOL = 0.5;
const canvas = document.getElementById("wedge");
const ctx = canvas.getContext("2d");
let ring = 4;

function peakCount(value) {
  return (3 * value * (value - 1)) / 2 + 1;
}

function triangle(cx, cy, radius) {
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}

function paint() {
  const count = peakCount(ring);
  document.getElementById("n-val").textContent = "Ring " + ring;
  document.getElementById("p-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The peak meets the mark."
    : "The peak misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 85) * barH;
  const markH = (MARK / 85) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#c8a060";
  ctx.lineWidth = 2;
  triangle(140, 220, 78);
  triangle(140, 220, 40);
  ctx.fillStyle = "#c8a060";
  for (let i = 0; i < ring; i++) ctx.fillRect(36 + i * 24, 58, 16, 16);
  ctx.strokeStyle = "#304028";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#c8a060";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("peak 46", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  ring = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
