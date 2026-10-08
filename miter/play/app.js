const MARK = 120;
const TOL = 0.5;
const canvas = document.getElementById("polygon");
const ctx = canvas.getContext("2d");
let sides = 3;

function degrees(value) {
  return ((value - 2) * 180) / value;
}

function paint() {
  const angle = degrees(sides);
  document.getElementById("n-val").textContent = sides + " sides";
  document.getElementById("a-val").textContent = angle.toFixed(0) + "°";
  document.getElementById("status").textContent = Math.abs(angle - MARK) <= TOL
    ? "The angle meets the mark."
    : "The angle misses the mark.";
  draw(angle);
}

function draw(angle) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (angle / 180) * barH;
  const markH = (MARK / 180) * barH;
  const cx = 150;
  const cy = 190;
  const radius = 88;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const theta = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
    const x = cx + radius * Math.cos(theta);
    const y = cy + radius * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = "#70d0b0";
  ctx.fill();
  ctx.strokeStyle = "#eef6f2";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.strokeStyle = "#243830";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#70d0b0";
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
  if (Math.abs(angle - MARK) > TOL) {
    ctx.fillText("120°", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  sides = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
