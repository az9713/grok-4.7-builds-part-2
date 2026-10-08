const MARK = 126;
const TOL = 0.5;
const canvas = document.getElementById("ten");
const ctx = canvas.getContext("2d");
let rank = 4;

function decagon(value) {
  return value * (4 * value - 3);
}

function paint() {
  const count = decagon(rank);
  document.getElementById("n-val").textContent = "Index " + rank;
  document.getElementById("h-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The decagon meets the mark."
    : "The decagon misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 232) * barH;
  const markH = (MARK / 232) * barH;
  const cx = 140;
  const cy = 220;
  const radius = 68;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#c09878";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 10;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "#c09878";
  for (let i = 0; i < rank; i++) ctx.fillRect(28 + i * 22, 52, 16, 16);
  ctx.strokeStyle = "#2c3440";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#c09878";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("decagon 126", barX + barW + 18, barBottom - markH + 4);
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
