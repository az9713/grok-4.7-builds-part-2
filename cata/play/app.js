const MARK = 42;
const TOL = 0.5;
const canvas = document.getElementById("path");
const ctx = canvas.getContext("2d");
let step = 3;

function catalan(value) {
  let bin = 1;
  for (let k = 1; k <= value; k++) {
    bin = (bin * (value + k)) / k;
  }
  return bin / (value + 1);
}

function paint() {
  const count = catalan(step);
  document.getElementById("n-val").textContent = "Step " + step;
  document.getElementById("c-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The catalan meets the mark."
    : "The catalan misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 429) * barH;
  const markH = (MARK / 429) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#d080a8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 280);
  ctx.lineTo(80, 210);
  ctx.lineTo(120, 280);
  ctx.lineTo(160, 210);
  ctx.lineTo(200, 280);
  ctx.lineTo(240, 210);
  ctx.lineTo(280, 280);
  ctx.stroke();
  ctx.fillStyle = "#d080a8";
  for (let i = 0; i < step; i++) ctx.fillRect(36 + i * 28, 58, 22, 22);
  ctx.strokeStyle = "#3c2838";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#d080a8";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("catalan 42", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  step = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
