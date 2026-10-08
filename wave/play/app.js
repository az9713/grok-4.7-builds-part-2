const MARK = 340;
const TOL = 1;
const canvas = document.getElementById("ruler");
const ctx = canvas.getContext("2d");
let cm = 50;

function metresPerSecond(lengthCm) {
  return 2 * lengthCm;
}

function paint() {
  const speed = metresPerSecond(cm);
  document.getElementById("l-val").textContent = cm + " cm";
  document.getElementById("s-val").textContent = speed.toFixed(0) + " m/s";
  document.getElementById("status").textContent = Math.abs(speed - MARK) <= TOL
    ? "The speed meets the mark."
    : "The speed misses the mark.";
  draw(speed);
}

function draw(speed) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (speed / 600) * barH;
  const markH = (MARK / 600) * barH;
  const width = cm * 1.4;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8fd0a0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const left = 50;
  ctx.moveTo(left, 210);
  for (let x = 0; x <= width; x += 4) {
    const y = 210 - Math.sin((x / width) * Math.PI * 2) * 46;
    ctx.lineTo(left + x, y);
  }
  ctx.stroke();
  ctx.strokeStyle = "#2c3c30";
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
  if (Math.abs(speed - MARK) > 0.5) {
    ctx.fillText("340", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  cm = Number(button.dataset.l);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
