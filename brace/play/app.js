const MARK = 5;
const TOL = 0.005;
const canvas = document.getElementById("triangle");
const ctx = canvas.getContext("2d");
let metres = 0;

function span(value) {
  return Math.sqrt(9 + value * value);
}

function paint() {
  const length = span(metres);
  document.getElementById("m-val").textContent = metres + " m";
  document.getElementById("s-val").textContent = length.toFixed(2) + " m";
  document.getElementById("status").textContent = Math.abs(length - MARK) <= TOL
    ? "The span meets the mark."
    : "The span misses the mark.";
  draw(length);
}

function draw(length) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (length / 16) * barH;
  const markH = (MARK / 16) * barH;
  const x0 = 80;
  const y0 = 300;
  const rise = 84;
  const run = metres * 12;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#f6efe8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0, y0 - rise);
  ctx.stroke();
  ctx.strokeStyle = "#e09868";
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0 + run, y0);
  ctx.stroke();
  ctx.strokeStyle = "#f6efe8";
  ctx.beginPath();
  ctx.moveTo(x0, y0 - rise);
  ctx.lineTo(x0 + run, y0);
  ctx.stroke();
  ctx.strokeStyle = "#e09868";
  ctx.lineWidth = 2;
  ctx.strokeRect(x0, y0 - 18, 18, 18);
  ctx.strokeStyle = "#3c3028";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e09868";
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
  if (Math.abs(length - MARK) > TOL) {
    ctx.fillText("5.00 m", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  metres = Number(button.dataset.m);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
