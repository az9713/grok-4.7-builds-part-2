const MARK = 700;
const TOL = 1;
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
let mpc = 5;

function speed(distance) {
  return 70 * distance;
}

function paint() {
  const kms = speed(mpc);
  document.getElementById("m-val").textContent = mpc + " Mpc";
  document.getElementById("v-val").textContent = kms.toFixed(0) + " km/s";
  document.getElementById("status").textContent = Math.abs(kms - MARK) <= TOL
    ? "The speed meets the mark."
    : "The speed misses the mark.";
  draw();
}

function draw() {
  const y = 190;
  const home = 70;
  const px = 28;
  const gx = home + mpc * px;
  const markX = home + 10 * px;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#e07a5f";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(markX, 70);
  ctx.lineTo(markX, 300);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#e07a5f";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("10 Mpc", markX - 24, 52);
  ctx.strokeStyle = "#2a3140";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(home, y);
  ctx.lineTo(gx, y);
  ctx.stroke();
  ctx.fillStyle = "#9bb0c8";
  ctx.beginPath();
  ctx.arc(home, y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e6e0d4";
  ctx.beginPath();
  ctx.arc(gx, y, 14, 0, Math.PI * 2);
  ctx.fill();
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  mpc = Number(button.dataset.m);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
