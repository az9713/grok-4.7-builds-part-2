const MARK = 6;
const TOL = 0.05;
const canvas = document.getElementById("cistern");
const ctx = canvas.getContext("2d");
let depth = 1;

function metresPerSecond(value) {
  return 2 * Math.sqrt(value);
}

function paint() {
  const speed = metresPerSecond(depth);
  document.getElementById("h-val").textContent = depth + " m";
  document.getElementById("v-val").textContent = speed.toFixed(2) + " m/s";
  document.getElementById("status").textContent = Math.abs(speed - MARK) <= TOL
    ? "The speed meets the mark."
    : "The speed misses the mark.";
  draw(speed);
}

function draw(speed) {
  const barX = 520;
  const barBottom = 350;
  const barH = 250;
  const barW = 28;
  const fillH = (speed / 12) * barH;
  const markH = (MARK / 12) * barH;
  const reach = speed * 12;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8aa8b4";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(70, 70);
  ctx.lineTo(70, 300);
  ctx.lineTo(250, 300);
  ctx.lineTo(250, 70);
  ctx.stroke();
  ctx.fillStyle = "#2f5f78";
  ctx.fillRect(73, 160, 174, 140);
  ctx.strokeStyle = "#7eb6c9";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(250, 240);
  for (let i = 0; i <= reach; i += 4) {
    const y = 240 + (i * i) / (speed * 18);
    ctx.lineTo(250 + i, y);
  }
  ctx.stroke();
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
  if (Math.abs(speed - MARK) > 0.05) {
    ctx.fillText("6.00 m/s", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  depth = Number(button.dataset.h);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
