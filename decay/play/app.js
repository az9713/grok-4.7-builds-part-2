const N0 = 800;
const WAIT = 12;
const MARK = 100;
const TOL = 2;
const canvas = document.getElementById("plot");
const ctx = canvas.getContext("2d");
let half = 2;

function counts(hours, halfLife) {
  return N0 * Math.pow(0.5, hours / halfLife);
}

function paint() {
  const n = counts(WAIT, half);
  document.getElementById("t-val").textContent = half + " h";
  document.getElementById("n-val").textContent = n.toFixed(1);
  document.getElementById("status").textContent = Math.abs(n - MARK) <= TOL
    ? "The count meets the mark."
    : "The count misses the mark.";
  draw(half, n);
}

function xOf(hours) {
  return 56 + hours * (560 / 16);
}

function yOf(n) {
  return 360 - n * (300 / N0);
}

function draw(halfLife, nNow) {
  const w = canvas.width;
  ctx.clearRect(0, 0, w, canvas.height);
  ctx.strokeStyle = "#3a3228";
  ctx.beginPath();
  ctx.moveTo(56, 40);
  ctx.lineTo(56, 360);
  ctx.lineTo(620, 360);
  ctx.stroke();
  ctx.strokeStyle = "#e0a15a";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(56, yOf(MARK));
  ctx.lineTo(620, yOf(MARK));
  ctx.moveTo(xOf(WAIT), 40);
  ctx.lineTo(xOf(WAIT), 360);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = "#b6d98a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 160; i++) {
    const hours = i * 16 / 160;
    const x = xOf(hours);
    const y = yOf(counts(hours, halfLife));
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = "#f0e6d4";
  ctx.beginPath();
  ctx.arc(xOf(WAIT), yOf(nNow), 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#9a907c";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("100", 16, yOf(MARK) + 4);
  ctx.fillText("12 h", xOf(WAIT) - 14, 28);
  ctx.fillText("800", 18, yOf(N0) + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  half = Number(button.dataset.t);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});
paint();
