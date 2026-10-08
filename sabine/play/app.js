const MARK = 1.6;
const TOL = 0.02;
const canvas = document.getElementById("room");
const ctx = canvas.getContext("2d");
let area = 16;

function seconds(value) {
  return 48 / value;
}

function paint() {
  const time = seconds(area);
  document.getElementById("a-val").textContent = area + " m²";
  document.getElementById("t-val").textContent = time.toFixed(2) + " s";
  document.getElementById("status").textContent = Math.abs(time - MARK) <= TOL
    ? "The time meets the mark."
    : "The time misses the mark.";
  draw(time);
}

function draw(time) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (time / 4) * barH;
  const markH = (MARK / 4) * barH;
  const patches = Math.max(1, Math.round(area / 8));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#b3a48c";
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 80, 300, 220);
  ctx.fillStyle = "#d4b483";
  for (let i = 0; i < patches; i++) {
    const col = i % 5;
    const row = Math.floor(i / 5);
    ctx.fillRect(80 + col * 52, 110 + row * 48, 28, 18);
  }
  ctx.strokeStyle = "#3c3428";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#d4b483";
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
  if (Math.abs(time - MARK) > 0.01) {
    ctx.fillText("1.60 s", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  area = Number(button.dataset.a);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
