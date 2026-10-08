const MARK = 120;
const TOL = 0.5;
const canvas = document.getElementById("chain");
const ctx = canvas.getContext("2d");
let factors = 2;

function product(value) {
  let out = 1;
  for (let i = 2; i <= value; i++) out *= i;
  return out;
}

function paint() {
  const count = product(factors);
  document.getElementById("n-val").textContent = factors + " factors";
  document.getElementById("p-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The factorial meets the mark."
    : "The factorial misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 720) * barH;
  const markH = (MARK / 720) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e09858";
  for (let i = 0; i < factors; i++) ctx.fillRect(36 + i * 36, 160, 28, 28);
  ctx.strokeStyle = "#3c2830";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e09858";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("fact 120", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  factors = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
