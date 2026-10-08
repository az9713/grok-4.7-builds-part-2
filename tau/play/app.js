const MARK = 3;
const TOL = 0.02;
const canvas = document.getElementById("curve");
const ctx = canvas.getContext("2d");
let kilohms = 5;

function seconds(value) {
  return value / 5;
}

function paint() {
  const time = seconds(kilohms);
  document.getElementById("k-val").textContent = kilohms + " kΩ";
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
  const fillH = (time / 6) * barH;
  const markH = (MARK / 6) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#24382c";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 80);
  ctx.lineTo(50, 310);
  ctx.lineTo(360, 310);
  ctx.stroke();
  ctx.strokeStyle = "#8fd0a0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 300);
  for (let x = 0; x <= 280; x += 8) {
    const y = 300 - (1 - Math.exp(-(x / 40) / time)) * 160;
    ctx.lineTo(50 + x, y);
  }
  ctx.stroke();
  ctx.strokeStyle = "#24382c";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#8fd0a0";
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
  if (Math.abs(time - MARK) > 0.02) {
    ctx.fillText("3.00 s", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  kilohms = Number(button.dataset.k);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
