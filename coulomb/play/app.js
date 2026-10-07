const MARK = 0.1;
const TOL = 0.01;
const canvas = document.getElementById("bench");
const ctx = canvas.getContext("2d");
let separation = 0.15;

function forceN(metres) {
  return 0.009 / (metres * metres);
}

function paint() {
  const force = forceN(separation);
  document.getElementById("r-val").textContent = separation.toFixed(2) + " m";
  document.getElementById("f-val").textContent = force.toFixed(3) + " N";
  document.getElementById("status").textContent = Math.abs(force - MARK) <= TOL
    ? "The force meets the mark."
    : "The force misses the mark.";
  draw(separation, force);
}

function draw(metres, force) {
  const w = canvas.width;
  const h = canvas.height;
  const leftX = 90;
  const px = 640;
  const railY = 168;
  const rightX = leftX + metres * px;
  const markX = leftX + 0.3 * px;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#2a3344";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(36, railY);
  ctx.lineTo(530, railY);
  ctx.stroke();
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(markX, 70);
  ctx.lineTo(markX, 250);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("0.30 m", markX - 22, 62);
  ctx.fillStyle = "#e07a5f";
  ctx.beginPath();
  ctx.arc(leftX, railY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rightX, railY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#12141c";
  ctx.font = "16px Consolas, monospace";
  ctx.fillText("+", leftX - 5, railY + 6);
  ctx.fillText("+", rightX - 5, railY + 6);
  const reach = (force / 0.4) * 46;
  ctx.strokeStyle = "#7eb6c9";
  ctx.fillStyle = "#7eb6c9";
  ctx.lineWidth = 3;
  arrow(leftX - 24, railY, leftX - 24 - reach, railY);
  arrow(rightX + 24, railY, rightX + 24 + reach, railY);
  const barX = 580;
  const barBottom = 360;
  const barH = 250;
  const barW = 26;
  ctx.strokeStyle = "#2a3344";
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  const fillH = Math.min(barH, (force / 0.4) * barH);
  ctx.fillStyle = "#7eb6c9";
  ctx.fillRect(barX, barBottom - fillH, barW, fillH);
  const tick = barBottom - (0.1 / 0.4) * barH;
  ctx.strokeStyle = "#8fb089";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(barX - 12, tick);
  ctx.lineTo(barX + barW + 8, tick);
  ctx.stroke();
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("0.100 N", barX - 74, tick + 4);
}

function arrow(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 10 * Math.cos(ang - 0.45), y2 - 10 * Math.sin(ang - 0.45));
  ctx.lineTo(x2 - 10 * Math.cos(ang + 0.45), y2 - 10 * Math.sin(ang + 0.45));
  ctx.closePath();
  ctx.fill();
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  separation = Number(button.dataset.r);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
