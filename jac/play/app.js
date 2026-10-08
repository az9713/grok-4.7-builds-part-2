const MARK = 85;
const TOL = 0.5;
const canvas = document.getElementById("pair");
const ctx = canvas.getContext("2d");
let step = 6;

function jacob(value) {
  if (value < 3) return 1;
  let older = 1;
  let newer = 1;
  for (let i = 3; i <= value; i++) {
    const next = newer + 2 * older;
    older = newer;
    newer = next;
  }
  return newer;
}

function paint() {
  const count = jacob(step);
  document.getElementById("n-val").textContent = "Term " + step;
  document.getElementById("j-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The jacob meets the mark."
    : "The jacob misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 341) * barH;
  const markH = (MARK / 341) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#70a0c0";
  for (let i = 0; i < step; i++) ctx.fillRect(36 + i * 26, 64, 20, 20);
  ctx.strokeStyle = "#70a0c0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 230);
  ctx.lineTo(96, 230);
  ctx.moveTo(48, 258);
  ctx.lineTo(144, 258);
  ctx.moveTo(48, 286);
  ctx.lineTo(240, 286);
  ctx.stroke();
  ctx.strokeStyle = "#1c3844";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#70a0c0";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("jacob 85", barX + barW + 18, barBottom - markH + 4);
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
