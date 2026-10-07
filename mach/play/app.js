const MARK = 2;
const TOL = 0.02;
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
let speed = 170;

function machOf(value) {
  return value / 340;
}

function paint() {
  const mach = machOf(speed);
  document.getElementById("s-val").textContent = speed + " m/s";
  document.getElementById("m-val").textContent = mach.toFixed(2);
  document.getElementById("status").textContent = Math.abs(mach - MARK) <= TOL
    ? "The Mach number meets the mark."
    : "The Mach number misses the mark.";
  draw(mach);
}

function draw(mach) {
  const barX = 520;
  const barBottom = 350;
  const barH = 250;
  const barW = 28;
  const fillH = (mach / 3) * barH;
  const markH = (MARK / 3) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8ea0b8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(70, 210);
  ctx.lineTo(150, 188);
  ctx.lineTo(150, 232);
  ctx.closePath();
  ctx.stroke();
  if (mach >= 1) {
    const ang = Math.asin(1 / mach);
    ctx.strokeStyle = "#7eb6e0";
    ctx.beginPath();
    ctx.moveTo(150, 210);
    ctx.lineTo(150 + Math.cos(ang) * 200, 210 - Math.sin(ang) * 200);
    ctx.moveTo(150, 210);
    ctx.lineTo(150 + Math.cos(ang) * 200, 210 + Math.sin(ang) * 200);
    ctx.stroke();
  }
  ctx.strokeStyle = "#2a3648";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#7eb6e0";
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
  if (Math.abs(mach - MARK) > 0.01) {
    ctx.fillText("2.00", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  speed = Number(button.dataset.s);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
