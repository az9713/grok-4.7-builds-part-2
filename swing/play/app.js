const G = 9.81;
const MARK = 2;
const TOL = 0.02;
const canvas = document.getElementById("well");
const ctx = canvas.getContext("2d");
let length = 0.5;

function periodS(metres) {
  return 2 * Math.PI * Math.sqrt(metres / G);
}

function paint() {
  const period = periodS(length);
  document.getElementById("l-val").textContent = length.toFixed(2) + " m";
  document.getElementById("p-val").textContent = period.toFixed(2) + " s";
  document.getElementById("status").textContent = Math.abs(period - MARK) <= TOL
    ? "The period meets the mark."
    : "The period misses the mark.";
  draw(length);
}

function draw(metres) {
  const pivotX = 250;
  const pivotY = 48;
  const px = 190;
  const bobY = pivotY + metres * px;
  const markY = pivotY + 0.99 * px;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(160, markY);
  ctx.lineTo(360, markY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  if (Math.abs(metres - 0.99) > 0.001) ctx.fillText("0.99 m", 368, markY + 4);
  ctx.strokeStyle = "#d9d3c7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(pivotX, bobY - 16);
  ctx.stroke();
  ctx.fillStyle = "#e0c07a";
  ctx.beginPath();
  ctx.arc(pivotX, bobY, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#9a907c";
  ctx.fillText(metres.toFixed(2) + " m", pivotX + 36, bobY - 22);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  length = Number(button.dataset.l);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
