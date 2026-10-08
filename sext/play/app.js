const MARK = 84;
const TOL = 0.5;
const canvas = document.getElementById("six");
const ctx = canvas.getContext("2d");
let cards = 7;

function sextet(value) {
  return (value * (value - 1) * (value - 2) * (value - 3) * (value - 4) * (value - 5)) / 720;
}

function paint() {
  const count = sextet(cards);
  document.getElementById("n-val").textContent = cards + " cards";
  document.getElementById("s-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The sextet meets the mark."
    : "The sextet misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 462) * barH;
  const markH = (MARK / 462) * barH;
  const cx = 150;
  const cy = 230;
  const radius = 62;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f4eef8";
  for (let i = 0; i < cards; i++) {
    ctx.beginPath();
    ctx.arc(40 + i * 26, 70, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#b090d0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 6;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = "#2c2438";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#b090d0";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("sextet 84", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  cards = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
