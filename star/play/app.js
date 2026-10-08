const MARK = 73;
const TOL = 0.5;
const canvas = document.getElementById("spark");
const ctx = canvas.getContext("2d");
let point = 2;

function starCount(value) {
  return 6 * value * (value - 1) + 1;
}

function paint() {
  const count = starCount(point);
  document.getElementById("n-val").textContent = "Point " + point;
  document.getElementById("s-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The star meets the mark."
    : "The star misses the mark.";
  draw(count);
}

function triangle(cx, cy, radius, rotation) {
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = rotation + (i * 2 * Math.PI) / 3;
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
  const fillH = (count / 181) * barH;
  const markH = (MARK / 181) * barH;
  const cx = 140;
  const cy = 210;
  const radius = 72;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#d8a048";
  ctx.lineWidth = 2;
  triangle(cx, cy, radius, -Math.PI / 2);
  triangle(cx, cy, radius, -Math.PI / 2 + Math.PI / 3);
  ctx.fillStyle = "#f4f6ee";
  for (let i = 0; i < point; i++) {
    ctx.beginPath();
    ctx.arc(48 + i * 28, 72, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#343c28";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#d8a048";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("star point 73", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  point = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
