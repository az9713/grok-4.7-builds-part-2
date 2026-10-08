const MARK = 200;
const TOL = 1;
const canvas = document.getElementById("filter");
const ctx = canvas.getContext("2d");
let kohm = 2;

function hertz(value) {
  return 1000 / value;
}

function paint() {
  const frequency = hertz(kohm);
  document.getElementById("r-val").textContent = kohm + " kΩ";
  document.getElementById("f-val").textContent = frequency.toFixed(0) + " Hz";
  document.getElementById("status").textContent = Math.abs(frequency - MARK) <= TOL
    ? "The frequency meets the mark."
    : "The frequency misses the mark.";
  draw(frequency);
}

function draw(frequency) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (frequency / 600) * barH;
  const markH = (MARK / 600) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#d0a0c0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 210);
  ctx.lineTo(100, 170);
  ctx.lineTo(140, 250);
  ctx.lineTo(180, 170);
  ctx.lineTo(220, 210);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(250, 160);
  ctx.lineTo(250, 260);
  ctx.moveTo(270, 160);
  ctx.lineTo(270, 260);
  ctx.stroke();
  ctx.strokeStyle = "#3c3040";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#d0a0c0";
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
  if (Math.abs(frequency - MARK) > 0.5) {
    ctx.fillText("200 Hz", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  kohm = Number(button.dataset.r);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
