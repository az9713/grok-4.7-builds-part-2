const MARK = 94;
const TOL = 0.5;
const canvas = document.getElementById("sum4");
const ctx = canvas.getContext("2d");
let step = 8;

function tetr(value) {
  if (value < 5) return 1;
  let first = 1;
  let second = 1;
  let third = 1;
  let fourth = 1;
  for (let i = 5; i <= value; i++) {
    const next = first + second + third + fourth;
    first = second;
    second = third;
    third = fourth;
    fourth = next;
  }
  return fourth;
}

function paint() {
  const count = tetr(step);
  document.getElementById("n-val").textContent = "Term " + step;
  document.getElementById("t-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The tetr meets the mark."
    : "The tetr misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 349) * barH;
  const markH = (MARK / 349) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#a8b0c8";
  for (let i = 0; i < step; i++) ctx.fillRect(24 + i * 22, 56, 16, 16);
  ctx.strokeStyle = "#a8b0c8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(32, 120);
  ctx.lineTo(76, 120);
  ctx.moveTo(32, 148);
  ctx.lineTo(120, 148);
  ctx.moveTo(32, 176);
  ctx.lineTo(164, 176);
  ctx.moveTo(32, 204);
  ctx.lineTo(208, 204);
  ctx.stroke();
  ctx.strokeStyle = "#302c38";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#a8b0c8";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("tetr 94", barX + barW + 18, barBottom - markH + 4);
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
