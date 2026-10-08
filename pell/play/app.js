const MARK = 70;
const TOL = 0.5;
const canvas = document.getElementById("grow");
const ctx = canvas.getContext("2d");
let step = 4;

function pell(value) {
  if (value === 1) return 1;
  if (value === 2) return 2;
  let previous = 1;
  let current = 2;
  for (let i = 3; i <= value; i++) {
    const next = 2 * current + previous;
    previous = current;
    current = next;
  }
  return current;
}

function paint() {
  const count = pell(step);
  document.getElementById("n-val").textContent = "Term " + step;
  document.getElementById("p-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The pell meets the mark."
    : "The pell misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 408) * barH;
  const markH = (MARK / 408) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#6898c0";
  for (let i = 0; i < step; i++) ctx.fillRect(36 + i * 28, 70, 22, 22);
  ctx.strokeStyle = "#6898c0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 250);
  ctx.lineTo(88, 250);
  ctx.moveTo(48, 278);
  ctx.lineTo(128, 278);
  ctx.moveTo(48, 306);
  ctx.lineTo(208, 306);
  ctx.stroke();
  ctx.strokeStyle = "#243844";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#6898c0";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("pell term 70", barX + barW + 18, barBottom - markH + 4);
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
