const MARK = 161;
const TOL = 0.5;
const canvas = document.getElementById("sum6");
const ctx = canvas.getContext("2d");
let step = 10;

function hexanacci(value) {
  if (value < 7) return 1;
  let first = 1;
  let second = 1;
  let third = 1;
  let fourth = 1;
  let fifth = 1;
  let sixth = 1;
  for (let i = 7; i <= value; i++) {
    const next = first + second + third + fourth + fifth + sixth;
    first = second;
    second = third;
    third = fourth;
    fourth = fifth;
    fifth = sixth;
    sixth = next;
  }
  return sixth;
}

function paint() {
  const count = hexanacci(step);
  document.getElementById("n-val").textContent = "Term " + step;
  document.getElementById("t-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The hexanacci meets the mark."
    : "The hexanacci misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 636) * barH;
  const markH = (MARK / 636) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#b0a8c8";
  for (let i = 0; i < step; i++) ctx.fillRect(24 + i * 16, 52, 14, 14);
  ctx.strokeStyle = "#b0a8c8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(28, 100);
  ctx.lineTo(28, 114);
  ctx.lineTo(44, 114);
  ctx.moveTo(28, 122);
  ctx.lineTo(28, 136);
  ctx.lineTo(60, 136);
  ctx.moveTo(28, 144);
  ctx.lineTo(28, 158);
  ctx.lineTo(76, 158);
  ctx.moveTo(28, 166);
  ctx.lineTo(28, 180);
  ctx.lineTo(92, 180);
  ctx.moveTo(28, 188);
  ctx.lineTo(28, 202);
  ctx.lineTo(108, 202);
  ctx.moveTo(28, 210);
  ctx.lineTo(28, 224);
  ctx.lineTo(124, 224);
  ctx.stroke();
  ctx.strokeStyle = "#322830";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#b0a8c8";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("hexanacci 161", barX + barW + 18, barBottom - markH + 4);
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
