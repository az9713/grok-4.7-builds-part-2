const MARK = 6;
const TOL = 0.2;
const canvas = document.getElementById("tube");
const ctx = canvas.getContext("2d");
let radius = 2;

function millimetres(value) {
  return 24 / value;
}

function paint() {
  const height = millimetres(radius);
  document.getElementById("r-val").textContent = radius + " mm";
  document.getElementById("h-val").textContent = height.toFixed(1) + " mm";
  document.getElementById("status").textContent = Math.abs(height - MARK) <= TOL
    ? "The height meets the mark."
    : "The height misses the mark.";
  draw(height);
}

function draw(height) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (height / 14) * barH;
  const markH = (MARK / 14) * barH;
  const liquid = height * 16;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8aa8b0";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(150, 80);
  ctx.lineTo(150, 330);
  ctx.moveTo(196, 80);
  ctx.lineTo(196, 330);
  ctx.stroke();
  ctx.fillStyle = "#2f5f78";
  ctx.fillRect(153, 320 - liquid, 40, liquid);
  ctx.strokeStyle = "#24343c";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#7eb6c9";
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
  if (Math.abs(height - MARK) > 0.2) {
    ctx.fillText("6.0 mm", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  radius = Number(button.dataset.r);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
