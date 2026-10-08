const MARK = 49;
const TOL = 0.5;
const canvas = document.getElementById("skip");
const ctx = canvas.getContext("2d");
let step = 14;

function padovan(value) {
  if (value < 4) return 1;
  let first = 1;
  let second = 1;
  let third = 1;
  for (let i = 4; i <= value; i++) {
    const next = first + second;
    first = second;
    second = third;
    third = next;
  }
  return third;
}

function paint() {
  const count = padovan(step);
  document.getElementById("n-val").textContent = "Term " + step;
  document.getElementById("p-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The padovan meets the mark."
    : "The padovan misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 86) * barH;
  const markH = (MARK / 86) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#b8a0c0";
  for (let i = 0; i < step; i++) ctx.fillRect(24 + i * 18, 64, 14, 14);
  ctx.strokeStyle = "#b8a0c0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(31, 110);
  ctx.lineTo(31, 132);
  ctx.lineTo(67, 132);
  ctx.moveTo(31, 156);
  ctx.lineTo(31, 178);
  ctx.lineTo(85, 178);
  ctx.stroke();
  ctx.strokeStyle = "#342838";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#b8a0c0";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("padovan 49", barX + barW + 18, barBottom - markH + 4);
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
