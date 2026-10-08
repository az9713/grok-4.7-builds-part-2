const MARK = 0.75;
const TOL = 0.005;
const canvas = document.getElementById("track");
const ctx = canvas.getContext("2d");
let speed = 0.2;

function sum(value) {
  return (0.5 + value) / (1 + 0.5 * value);
}

function paint() {
  const total = sum(speed);
  document.getElementById("v-val").textContent = speed.toFixed(2) + " c";
  document.getElementById("s-val").textContent = total.toFixed(2) + " c";
  document.getElementById("status").textContent = Math.abs(total - MARK) <= TOL
    ? "The speed meets the mark."
    : "The speed misses the mark.";
  draw(total);
}

function draw(total) {
  const barX = 520;
  const barBottom = 350;
  const barH = 240;
  const barW = 28;
  const fillH = (total / 1) * barH;
  const markH = (MARK / 1) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#2c2c44";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 220);
  ctx.lineTo(340, 220);
  ctx.stroke();
  ctx.fillStyle = "#a8a8c4";
  ctx.beginPath();
  ctx.arc(40 + 0.5 * 280, 180, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#9aa6f0";
  ctx.beginPath();
  ctx.arc(40 + speed * 280, 260, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#eeeef6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(40 + total * 280, 220, 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#2c2c44";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#9aa6f0";
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
  if (Math.abs(total - MARK) > TOL) {
    ctx.fillText("0.75 c", barX + barW + 18, barBottom - markH + 4);
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
