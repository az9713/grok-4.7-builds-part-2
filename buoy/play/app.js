const MARK = 20;
const TOL = 1;
const canvas = document.getElementById("tank");
const ctx = canvas.getContext("2d");
let litres = 1;

function newtons(volume) {
  return 4 * volume;
}

function paint() {
  const force = newtons(litres);
  document.getElementById("l-val").textContent = litres + " L";
  document.getElementById("f-val").textContent = force.toFixed(0) + " N";
  document.getElementById("status").textContent = Math.abs(force - MARK) <= TOL
    ? "The force meets the mark."
    : "The force misses the mark.";
  draw(force);
}

function draw(force) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (force / 50) * barH;
  const markH = (MARK / 50) * barH;
  const blockH = 36 + litres * 10;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8ab0aa";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(70, 70);
  ctx.lineTo(70, 340);
  ctx.lineTo(250, 340);
  ctx.lineTo(250, 70);
  ctx.stroke();
  ctx.fillStyle = "#2f6f78";
  ctx.fillRect(73, 180, 174, 160);
  ctx.fillStyle = "#d4b483";
  ctx.fillRect(120, 180 - blockH / 2, 70, blockH);
  ctx.strokeStyle = "#243c3c";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#5eb0b0";
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
  if (Math.abs(force - MARK) > 0.5) {
    ctx.fillText("20 N", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  litres = Number(button.dataset.l);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
