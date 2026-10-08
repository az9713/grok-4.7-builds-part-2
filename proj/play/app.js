const MARK = 5;
const TOL = 0.005;
const canvas = document.getElementById("post");
const ctx = canvas.getContext("2d");
let degrees = 0;

function centimetres(value) {
  return 10 * Math.cos((value * Math.PI) / 180);
}

function paint() {
  const length = centimetres(degrees);
  document.getElementById("d-val").textContent = degrees + "°";
  document.getElementById("l-val").textContent = length.toFixed(2) + " cm";
  document.getElementById("status").textContent = Math.abs(length - MARK) <= TOL
    ? "The length meets the mark."
    : "The length misses the mark.";
  draw(length);
}

function draw(length) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (length / 10) * barH;
  const markH = (MARK / 10) * barH;
  const shadow = Math.max(0, length) * 18;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#d0a060";
  ctx.beginPath();
  ctx.arc(90, 120, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f4f0e8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(90, 150);
  ctx.lineTo(90, 300);
  ctx.stroke();
  ctx.strokeStyle = "#d0a060";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(90, 300);
  ctx.lineTo(90 + shadow, 300);
  ctx.stroke();
  ctx.strokeStyle = "#34302c";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#d0a060";
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
  if (Math.abs(length - MARK) > TOL) {
    ctx.fillText("5.00 cm", barX + barW + 18, barBottom - markH + 4);
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
