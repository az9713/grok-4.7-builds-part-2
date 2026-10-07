const MARK = 90;
const TOL = 1;
const canvas = document.getElementById("load");
const ctx = canvas.getContext("2d");
let amps = 1;

function watts(current) {
  return current * current * 10;
}

function paint() {
  const power = watts(amps);
  document.getElementById("i-val").textContent = amps + " A";
  document.getElementById("p-val").textContent = power.toFixed(0) + " W";
  document.getElementById("status").textContent = Math.abs(power - MARK) <= TOL
    ? "The power meets the mark."
    : "The power misses the mark.";
  draw(power);
}

function draw(power) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (power / 280) * barH;
  const markH = (MARK / 280) * barH;
  const glow = 12 + power / 12;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#d4b483";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 200);
  ctx.lineTo(120, 200);
  const turns = 8;
  for (let i = 0; i <= turns; i++) {
    const x = 120 + (i * 140) / turns;
    const dy = i === 0 || i === turns ? 0 : (i % 2 === 0 ? -16 : 16);
    ctx.lineTo(x, 200 + dy);
  }
  ctx.lineTo(340, 200);
  ctx.stroke();
  ctx.fillStyle = "#e07a5f";
  ctx.beginPath();
  ctx.arc(360, 200, glow, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#3c3428";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e07a5f";
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
  if (Math.abs(power - MARK) > 0.5) ctx.fillText("90 W", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  amps = Number(button.dataset.i);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
