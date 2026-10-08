const MARK = 0.5;
const TOL = 0.01;
const canvas = document.getElementById("engine");
const ctx = canvas.getContext("2d");
let cold = 150;

function efficiency(temperature) {
  return 1 - temperature / 600;
}

function paint() {
  const value = efficiency(cold);
  document.getElementById("k-val").textContent = cold + " K";
  document.getElementById("e-val").textContent = value.toFixed(2);
  document.getElementById("status").textContent = Math.abs(value - MARK) <= TOL
    ? "The efficiency meets the mark."
    : "The efficiency misses the mark.";
  draw(value);
}

function draw(value) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = value * barH;
  const markH = MARK * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#c45a32";
  ctx.fillRect(70, 90, 100, 150);
  ctx.fillStyle = "#7eb6c9";
  ctx.fillRect(220, 140, 90, 110);
  ctx.strokeStyle = "#c4a090";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(170, 160);
  ctx.lineTo(220, 190);
  ctx.stroke();
  ctx.strokeStyle = "#3c2820";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e07a4a";
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
  if (Math.abs(value - MARK) > 0.01) {
    ctx.fillText("0.50", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  cold = Number(button.dataset.k);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
