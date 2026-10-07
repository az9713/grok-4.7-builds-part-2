const MARK = 0.5;
const TOL = 0.02;
const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");
let field = 2;

function radiusM(tesla) {
  return 4 / tesla;
}

function paint() {
  const radius = radiusM(field);
  document.getElementById("b-val").textContent = field + " T";
  document.getElementById("r-val").textContent = radius.toFixed(2) + " m";
  document.getElementById("status").textContent = Math.abs(radius - MARK) <= TOL
    ? "The radius meets the mark."
    : "The radius misses the mark.";
  draw(radius);
}

function draw(radius) {
  const cx = 300;
  const cy = 210;
  const px = 90;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8fb089";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(cx, cy, MARK * px, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = "13px Consolas, monospace";
  if (Math.abs(radius - MARK) > 0.001) {
    ctx.fillStyle = "#8fb089";
    ctx.fillText("0.50 m", cx - 24, cy - MARK * px - 8);
  }
  ctx.strokeStyle = "#7ec8c3";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * px, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#e07a5f";
  ctx.beginPath();
  ctx.arc(cx + radius * px, cy, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#9a90a6";
  ctx.fillText(radius.toFixed(2) + " m", cx + radius * px + 12, cy - 12);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  field = Number(button.dataset.b);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
