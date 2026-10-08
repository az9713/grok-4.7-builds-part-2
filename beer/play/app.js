const MARK = 1;
const TOL = 0.02;
const canvas = document.getElementById("cuvette");
const ctx = canvas.getContext("2d");
let conc = 2;

function absorbance(value) {
  return value / 5;
}

function paint() {
  const value = absorbance(conc);
  document.getElementById("c-val").textContent = conc + " mM";
  document.getElementById("a-val").textContent = value.toFixed(2);
  document.getElementById("status").textContent = Math.abs(value - MARK) <= TOL
    ? "The absorbance meets the mark."
    : "The absorbance misses the mark.";
  draw(value);
}

function draw(value) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (value / 2.4) * barH;
  const markH = (MARK / 2.4) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = Math.max(0.2, 1 - value / 2.5);
  ctx.fillStyle = "#8fd0a0";
  ctx.fillRect(40, 168, 280, 10);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#1a3a28";
  ctx.globalAlpha = Math.min(0.85, 0.2 + value / 3);
  ctx.fillRect(124, 144, 72, 62);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#8fb098";
  ctx.lineWidth = 3;
  ctx.strokeRect(120, 140, 80, 70);
  ctx.strokeStyle = "#24382c";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#8fd0a0";
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
  if (Math.abs(value - MARK) > 0.02) {
    ctx.fillText("1.00", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  conc = Number(button.dataset.c);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
