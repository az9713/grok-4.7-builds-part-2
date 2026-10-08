const MARK = 18;
const TOL = 1;
const canvas = document.getElementById("sphere");
const ctx = canvas.getContext("2d");
let radius = 2;

function newtons(value) {
  return 3 * value;
}

function paint() {
  const force = newtons(radius);
  document.getElementById("r-val").textContent = radius + " mm";
  document.getElementById("f-val").textContent = force.toFixed(0) + " N";
  document.getElementById("status").textContent = Math.abs(force - MARK) <= TOL
    ? "The force meets the mark."
    : "The force misses the mark.";
  draw(force);
}

function draw(force) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (force / 36) * barH;
  const markH = (MARK / 36) * barH;
  const rad = 14 + radius * 5;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8aa8b4";
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const y = 120 + i * 40;
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(300, y);
    ctx.stroke();
  }
  ctx.fillStyle = "#5eb0b0";
  ctx.beginPath();
  ctx.arc(150, 210, rad, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#243848";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#5eb0b0";
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
  if (Math.abs(force - MARK) > 0.5) {
    ctx.fillText("18 N", barX + barW + 18, barBottom - markH + 4);
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
