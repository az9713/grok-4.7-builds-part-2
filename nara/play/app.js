const MARK = 88;
const TOL = 0.5;
const canvas = document.getElementById("skip3");
const ctx = canvas.getContext("2d");
let step = 12;

function narayana(value) {
  if (value < 4) return 1;
  let first = 1;
  let second = 1;
  let third = 1;
  for (let i = 4; i <= value; i++) {
    const next = third + first;
    first = second;
    second = third;
    third = next;
  }
  return third;
}

function paint() {
  const count = narayana(step);
  document.getElementById("n-val").textContent = "Term " + step;
  document.getElementById("t-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The narayana meets the mark."
    : "The narayana misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 189) * barH;
  const markH = (MARK / 189) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#a0a8c0";
  for (let i = 0; i < step; i++) ctx.fillRect(24 + i * 18, 58, 14, 14);
  ctx.strokeStyle = "#a0a8c0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(31, 110);
  ctx.lineTo(31, 128);
  ctx.lineTo(49, 128);
  ctx.moveTo(31, 150);
  ctx.lineTo(31, 168);
  ctx.lineTo(85, 168);
  ctx.stroke();
  ctx.strokeStyle = "#343432";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#a0a8c0";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("narayana 88", barX + barW + 18, barBottom - markH + 4);
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
