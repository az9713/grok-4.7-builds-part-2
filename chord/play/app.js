const MARK = 10;
const TOL = 0.005;
const canvas = document.getElementById("ring");
const ctx = canvas.getContext("2d");
let degrees = 0;

function centimetres(value) {
  return 20 * Math.sin((value * Math.PI) / 360);
}

function paint() {
  const length = centimetres(degrees);
  document.getElementById("d-val").textContent = degrees + "°";
  document.getElementById("c-val").textContent = length.toFixed(2) + " cm";
  document.getElementById("status").textContent = Math.abs(length - MARK) <= TOL
    ? "The chord meets the mark."
    : "The chord misses the mark.";
  draw(length);
}

function draw(length) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (length / 20) * barH;
  const markH = (MARK / 20) * barH;
  const cx = 140;
  const cy = 200;
  const radius = 80;
  const half = (degrees * Math.PI) / 360;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#eef2f6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#70b0e0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx + radius * Math.cos(-half), cy + radius * Math.sin(-half));
  ctx.lineTo(cx + radius * Math.cos(half), cy + radius * Math.sin(half));
  ctx.stroke();
  ctx.strokeStyle = "#2c3844";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#70b0e0";
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
  if (Math.abs(length - MARK) > TOL) {
    ctx.fillText("10.00 cm", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  degrees = Number(button.dataset.d);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
