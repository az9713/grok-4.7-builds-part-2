const MARK = 20;
const TOL = 0.5;
const canvas = document.getElementById("gon");
const ctx = canvas.getContext("2d");
let sides = 6;

function diagonals(value) {
  return (value * (value - 3)) / 2;
}

function paint() {
  const count = diagonals(sides);
  document.getElementById("n-val").textContent = sides + " sides";
  document.getElementById("d-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The diagonal meets the mark."
    : "The diagonal misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 35) * barH;
  const markH = (MARK / 35) * barH;
  const cx = 150;
  const cy = 200;
  const radius = 78;
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
    pts.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#f4f6ee";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < sides; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = "#d07070";
  ctx.beginPath();
  for (let i = 2; i <= sides - 2; i++) {
    ctx.moveTo(pts[0][0], pts[0][1]);
    ctx.lineTo(pts[i][0], pts[i][1]);
  }
  ctx.stroke();
  ctx.strokeStyle = "#304028";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#d07070";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("20 diagonals", barX + barW + 18, barBottom - markH + 4);
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
