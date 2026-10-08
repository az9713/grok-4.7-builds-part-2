const MARK = 8;
const TOL = 0.2;
const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");
let cm = 2;

function microtesla(distance) {
  return 40 / distance;
}

function paint() {
  const field = microtesla(cm);
  document.getElementById("d-val").textContent = cm + " cm";
  document.getElementById("b-val").textContent = field.toFixed(1) + " µT";
  document.getElementById("status").textContent = Math.abs(field - MARK) <= TOL
    ? "The field meets the mark."
    : "The field misses the mark.";
  draw(field);
}

function draw(field) {
  const barX = 520;
  const barBottom = 350;
  const barH = 250;
  const barW = 28;
  const fillH = (field / 24) * barH;
  const markH = (MARK / 24) * barH;
  const cx = 180;
  const cy = 210;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#e7f3f4";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, 70);
  ctx.lineTo(cx, 350);
  ctx.stroke();
  ctx.strokeStyle = "#7eb6c9";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, cm * 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#24343c";
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
  if (Math.abs(field - MARK) > 0.05) {
    ctx.fillText("8.0 µT", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  cm = Number(button.dataset.d);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
