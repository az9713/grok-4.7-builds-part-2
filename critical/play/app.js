const MARK = 41.8;
const TOL = 0.5;
const canvas = document.getElementById("face");
const ctx = canvas.getContext("2d");
let index = 1.33;

function degrees(n) {
  return (Math.asin(1 / n) * 180) / Math.PI;
}

function paint() {
  const angle = degrees(index);
  document.getElementById("n-val").textContent = index.toFixed(2);
  document.getElementById("a-val").textContent = angle.toFixed(1) + "°";
  document.getElementById("status").textContent = Math.abs(angle - MARK) <= TOL
    ? "The angle meets the mark."
    : "The angle misses the mark.";
  draw(angle);
}

function endOf(angle) {
  const rad = (angle * Math.PI) / 180;
  return [240 + Math.sin(rad) * 200, 150 + Math.cos(rad) * 200];
}

function draw(angle) {
  const ox = 240;
  const oy = 150;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#16303a";
  ctx.fillRect(40, oy, 560, 250);
  ctx.strokeStyle = "#d4c4a8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, oy);
  ctx.lineTo(600, oy);
  ctx.stroke();
  ctx.strokeStyle = "#5a6a72";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(ox, 36);
  ctx.stroke();
  ctx.setLineDash([]);
  const mark = endOf(MARK);
  const tip = endOf(angle);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(mark[0], mark[1]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = "#e6d3a1";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(tip[0], tip[1]);
  ctx.stroke();
  ctx.fillStyle = "#8fb089";
  ctx.beginPath();
  ctx.arc(mark[0], mark[1], 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "13px Consolas, monospace";
  if (Math.abs(angle - MARK) > 0.05) ctx.fillText("41.8°", ox + 14, 58);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  index = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
