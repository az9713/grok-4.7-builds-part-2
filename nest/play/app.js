const MARK = 41;
const TOL = 0.5;
const canvas = document.getElementById("ring");
const ctx = canvas.getContext("2d");
let ring = 3;

function nestCount(value) {
  return 2 * value * (value - 1) + 1;
}

function paint() {
  const count = nestCount(ring);
  document.getElementById("n-val").textContent = "Ring " + ring;
  document.getElementById("q-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The nest meets the mark."
    : "The nest misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 85) * barH;
  const markH = (MARK / 85) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#c88858";
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 150, 140, 140);
  ctx.strokeRect(100, 180, 80, 80);
  ctx.fillStyle = "#c88858";
  for (let i = 0; i < ring; i++) ctx.fillRect(36 + i * 24, 58, 16, 16);
  ctx.strokeStyle = "#3c3028";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#c88858";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("nest 41", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  ring = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
