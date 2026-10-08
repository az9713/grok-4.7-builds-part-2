const MARK = 36;
const TOL = 0.5;
const canvas = document.getElementById("steps");
const ctx = canvas.getContext("2d");
let steps = 5;

function total(value) {
  return (value * (value + 1)) / 2;
}

function paint() {
  const sum = total(steps);
  document.getElementById("n-val").textContent = steps + " steps";
  document.getElementById("s-val").textContent = sum.toFixed(0);
  document.getElementById("status").textContent = Math.abs(sum - MARK) <= TOL
    ? "The sum meets the mark."
    : "The sum misses the mark.";
  draw(sum);
}

function draw(sum) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (sum / 45) * barH;
  const markH = (MARK / 45) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#c89858";
  for (let i = 0; i < steps; i++) {
    const h = 18 + i * 14;
    ctx.fillRect(36 + i * 26, 300 - h, 22, h);
  }
  ctx.strokeStyle = "#2c4034";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#c89858";
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
  if (Math.abs(sum - MARK) > TOL) ctx.fillText("sum 36", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  steps = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
