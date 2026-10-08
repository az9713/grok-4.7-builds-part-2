const MARK = 400;
const TOL = 1;
const canvas = document.getElementById("pipe");
const ctx = canvas.getContext("2d");
let speed = 2;

function reynolds(value) {
  return 50 * value;
}

function paint() {
  const number = reynolds(speed);
  document.getElementById("v-val").textContent = speed + " m/s";
  document.getElementById("n-val").textContent = number.toFixed(0);
  document.getElementById("status").textContent = Math.abs(number - MARK) <= TOL
    ? "The number meets the mark."
    : "The number misses the mark.";
  draw(number);
}

function draw(number) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (number / 900) * barH;
  const markH = (MARK / 900) * barH;
  const streaks = Math.max(1, Math.round(speed / 2));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8aa0b4";
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 150, 280, 70);
  ctx.strokeStyle = "#7eb6e0";
  ctx.lineWidth = 2;
  for (let i = 0; i < streaks; i++) {
    const y = 166 + (i % 4) * 14;
    const bend = (i % 2) * 10;
    ctx.beginPath();
    ctx.moveTo(76, y);
    ctx.lineTo(180, y - bend);
    ctx.lineTo(320, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "#24303c";
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
  if (Math.abs(number - MARK) > 1) {
    ctx.fillText("400", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  speed = Number(button.dataset.v);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
