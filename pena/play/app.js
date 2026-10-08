const MARK = 253;
const TOL = 0.5;
const canvas = document.getElementById("sum5");
const ctx = canvas.getContext("2d");
let step = 10;

function pentanacci(value) {
  if (value < 6) return 1;
  let first = 1;
  let second = 1;
  let third = 1;
  let fourth = 1;
  let fifth = 1;
  for (let i = 6; i <= value; i++) {
    const next = first + second + third + fourth + fifth;
    first = second;
    second = third;
    third = fourth;
    fourth = fifth;
    fifth = next;
  }
  return fifth;
}

function paint() {
  const count = pentanacci(step);
  document.getElementById("n-val").textContent = "Term " + step;
  document.getElementById("t-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The pentanacci meets the mark."
    : "The pentanacci misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 977) * barH;
  const markH = (MARK / 977) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#a8a0c0";
  for (let i = 0; i < step; i++) ctx.fillRect(24 + i * 16, 56, 14, 14);
  ctx.strokeStyle = "#a8a0c0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(28, 108);
  ctx.lineTo(28, 122);
  ctx.lineTo(44, 122);
  ctx.moveTo(28, 132);
  ctx.lineTo(28, 146);
  ctx.lineTo(60, 146);
  ctx.moveTo(28, 156);
  ctx.lineTo(28, 170);
  ctx.lineTo(76, 170);
  ctx.moveTo(28, 180);
  ctx.lineTo(28, 194);
  ctx.lineTo(92, 194);
  ctx.moveTo(28, 204);
  ctx.lineTo(28, 218);
  ctx.lineTo(108, 218);
  ctx.stroke();
  ctx.strokeStyle = "#342834";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#a8a0c0";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("pentanacci 253", barX + barW + 18, barBottom - markH + 4);
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
