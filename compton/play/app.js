const MARK = 6;
const TOL = 0.005;
const canvas = document.getElementById("scatter");
const ctx = canvas.getContext("2d");
let degrees = 0;

function picometres(value) {
  return 12 * (1 - Math.cos((value * Math.PI) / 180));
}

function paint() {
  const shift = picometres(degrees);
  document.getElementById("d-val").textContent = degrees + "°";
  document.getElementById("s-val").textContent = shift.toFixed(2) + " pm";
  document.getElementById("status").textContent = Math.abs(shift - MARK) <= TOL
    ? "The shift meets the mark."
    : "The shift misses the mark.";
  draw(shift);
}

function draw(shift) {
  const barX = 520;
  const barBottom = 350;
  const barH = 240;
  const barW = 28;
  const fillH = (shift / 24) * barH;
  const markH = (MARK / 24) * barH;
  const rad = (degrees * Math.PI) / 180;
  const len = 140;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#f6eeec";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(40, 210);
  ctx.lineTo(142, 210);
  ctx.stroke();
  ctx.fillStyle = "#e08870";
  ctx.beginPath();
  ctx.arc(160, 210, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#e08870";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(178, 210);
  ctx.lineTo(178 + Math.cos(rad) * len, 210 - Math.sin(rad) * len);
  ctx.stroke();
  ctx.strokeStyle = "#3c2828";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e08870";
  ctx.fillRect(barX, barBottom - fillH, barW, barH);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(barX - 16, barBottom - markH);
  ctx.lineTo(barX + barW + 16, barBottom - markH);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  if (Math.abs(shift - MARK) > TOL) {
    ctx.fillText("6.00 pm", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  degrees = Number(button.dataset.d);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
