const MARK = 121;
const TOL = 0.5;
const canvas = document.getElementById("octs");
const ctx = canvas.getContext("2d");
let ring = 3;

function hubCount(value) {
  return 4 * value * (value - 1) + 1;
}

function paint() {
  const count = hubCount(ring);
  document.getElementById("n-val").textContent = "Ring " + ring;
  document.getElementById("p-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The hub meets the mark."
    : "The hub misses the mark.";
  draw(count);
}

function octagon(cx, cy, radius) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 169) * barH;
  const markH = (MARK / 169) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#b8c0a0";
  ctx.lineWidth = 2;
  octagon(140, 220, 72);
  octagon(140, 220, 34);
  ctx.fillStyle = "#b8c0a0";
  for (let i = 0; i < ring; i++) ctx.fillRect(28 + i * 22, 52, 16, 16);
  ctx.strokeStyle = "#2c3830";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#b8c0a0";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("hub 121", barX + barW + 18, barBottom - markH + 4);
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
