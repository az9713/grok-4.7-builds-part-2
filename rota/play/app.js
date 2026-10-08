const MARK = 360;
const TOL = 0.5;
const canvas = document.getElementById("seats");
const ctx = canvas.getContext("2d");
let seats = 4;

function rotaCount(value) {
  return value * (value - 1) * (value - 2) * (value - 3);
}

function paint() {
  const count = rotaCount(seats);
  document.getElementById("n-val").textContent = "Seat " + seats;
  document.getElementById("r-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The rota meets the mark."
    : "The rota misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 1680) * barH;
  const markH = (MARK / 1680) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f8f0ee";
  for (let i = 0; i < seats; i++) {
    ctx.beginPath();
    ctx.arc(48 + i * 28, 78, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#d09888";
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) ctx.strokeRect(48 + i * 48, 180, 36, 36);
  ctx.strokeStyle = "#3c3030";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#d09888";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("rota 360", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  seats = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
