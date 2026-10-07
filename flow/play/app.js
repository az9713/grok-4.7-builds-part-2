const MARK = 81;
const TOL = 1;
const canvas = document.getElementById("tube");
const ctx = canvas.getContext("2d");
let radius = 1;

function flowOf(mm) {
  return mm * mm * mm * mm;
}

function paint() {
  const flow = flowOf(radius);
  document.getElementById("r-val").textContent = radius + " mm";
  document.getElementById("q-val").textContent = flow.toFixed(0);
  document.getElementById("status").textContent = Math.abs(flow - MARK) <= TOL
    ? "The flow meets the mark."
    : "The flow misses the mark.";
  draw(flow);
}

function draw(flow) {
  const y = 180;
  const half = 12 + radius * 16;
  const barX = 600;
  const barBottom = 320;
  const barH = 240;
  const barW = 26;
  const fillH = (flow / 700) * barH;
  const markH = (MARK / 700) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#7eb6c9";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(40, y - half);
  ctx.lineTo(520, y - half);
  ctx.moveTo(40, y + half);
  ctx.lineTo(520, y + half);
  ctx.stroke();
  ctx.strokeStyle = "#2c3c44";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#7eb6c9";
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
  if (Math.abs(flow - MARK) > 0.5) ctx.fillText("81", barX - 28, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  radius = Number(button.dataset.r);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
