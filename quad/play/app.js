const MARK = 35;
const TOL = 0.5;
const canvas = document.getElementById("picks");
const ctx = canvas.getContext("2d");
let picks = 5;

function tally(value) {
  return (value * (value - 1) * (value - 2) * (value - 3)) / 24;
}

function paint() {
  const count = tally(picks);
  document.getElementById("n-val").textContent = picks + " picks";
  document.getElementById("t-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The tally meets the mark."
    : "The tally misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 126) * barH;
  const markH = (MARK / 126) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f0eef8";
  for (let i = 0; i < picks; i++) {
    ctx.beginPath();
    ctx.arc(48 + i * 28, 90, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#c090d8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 240);
  ctx.lineTo(140, 170);
  ctx.lineTo(232, 240);
  ctx.lineTo(140, 300);
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = "#2c2840";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#c090d8";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("tally 35", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  picks = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
