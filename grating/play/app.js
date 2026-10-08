const MARK = 30;
const TOL = 0.05;
const canvas = document.getElementById("grate");
const ctx = canvas.getContext("2d");
let order = 2;

function degrees(value) {
  return (Math.asin(value / 8) * 180) / Math.PI;
}

function paint() {
  const angle = degrees(order);
  document.getElementById("n-val").textContent = String(order);
  document.getElementById("a-val").textContent = angle.toFixed(1) + "°";
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
  const fillH = (angle / 60) * barH;
  const markH = (MARK / 60) * barH;
  const rad = (angle * Math.PI) / 180;
  const len = 240;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#9ab0b0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(48, 60);
  ctx.lineTo(48, 340);
  ctx.stroke();
  ctx.strokeStyle = "#7ec8c0";
  ctx.lineWidth = 2;
  for (let i = 0; i < 9; i++) {
    const y = 78 + i * 28;
    ctx.beginPath();
    ctx.moveTo(36, y);
    ctx.lineTo(60, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "#e8f4f2";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(60, 300);
  ctx.lineTo(60 + Math.cos(rad) * len, 300 - Math.sin(rad) * len);
  ctx.stroke();
  ctx.strokeStyle = "#24343c";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#7ec8c0";
  ctx.fillRect(barX, barBottom - fillH, barW, barH);
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
    ctx.fillText("30.0°", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  order = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
