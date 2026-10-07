const MARK = 8;
const TOL = 0.2;
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");
let radius = 1;

function periodYears(au) {
  return Math.pow(au, 1.5);
}

function paint() {
  const period = periodYears(radius);
  document.getElementById("a-val").textContent = radius + " AU";
  document.getElementById("p-val").textContent = period.toFixed(2) + " years";
  document.getElementById("status").textContent = Math.abs(period - MARK) <= TOL
    ? "The period meets the mark."
    : "The period misses the mark.";
  draw(radius);
}

function draw(au) {
  const cx = 330;
  const cy = 210;
  const px = 22;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8fb089";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(cx, cy, 4 * px, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  if (au !== 4) ctx.fillText("4 AU", cx - 18, cy - 4 * px - 10);
  ctx.strokeStyle = "#e6b15a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, au * px, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#e6b15a";
  ctx.beginPath();
  ctx.arc(cx, cy, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#efe6d4";
  ctx.beginPath();
  ctx.arc(cx + au * px, cy, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#9a907c";
  ctx.fillText(au + " AU", cx + au * px + 12, cy - 12);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  radius = Number(button.dataset.a);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
