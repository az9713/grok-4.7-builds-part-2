const MARK = 34;
const TOL = 0.5;
const canvas = document.getElementById("range");
const ctx = canvas.getContext("2d");
let seconds = 0.1;

function rangeM(time) {
  return 340 * time / 2;
}

function paint() {
  const distance = rangeM(seconds);
  document.getElementById("t-val").textContent = seconds.toFixed(2) + " s";
  document.getElementById("d-val").textContent = distance.toFixed(2) + " m";
  document.getElementById("status").textContent = Math.abs(distance - MARK) <= TOL
    ? "The echo meets the cliff."
    : "The echo misses the cliff.";
  draw(distance);
}

function draw(distance) {
  const origin = 70;
  const ground = 250;
  const px = 10;
  const markX = origin + MARK * px;
  const cliffX = origin + distance * px;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#3a3228";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, ground);
  ctx.lineTo(680, ground);
  ctx.stroke();
  ctx.strokeStyle = "#e07a5f";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(markX, 70);
  ctx.lineTo(markX, ground);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#e07a5f";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("34.00 m", markX - 28, 58);
  ctx.fillStyle = "#d4b483";
  ctx.fillRect(cliffX - 8, 110, 16, ground - 110);
  ctx.fillStyle = "#7eb6c9";
  ctx.beginPath();
  ctx.arc(origin, ground - 28, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#7eb6c9";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(origin + 16, ground - 28);
  ctx.lineTo(cliffX - 14, ground - 28);
  ctx.stroke();
  if (Math.abs(distance - MARK) > 0.01) {
    ctx.fillStyle = "#a89884";
    ctx.fillText(distance.toFixed(2) + " m", cliffX - 28, 100);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  seconds = Number(button.dataset.t);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
