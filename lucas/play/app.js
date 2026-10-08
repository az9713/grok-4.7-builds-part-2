const MARK = 18;
const TOL = 0.5;
const canvas = document.getElementById("run");
const ctx = canvas.getContext("2d");
let step = 4;

function entry(value) {
  if (value < 3) return value === 1 ? 1 : 3;
  let a = 1;
  let b = 3;
  for (let i = 3; i <= value; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}

function paint() {
  const count = entry(step);
  document.getElementById("n-val").textContent = "Term " + step;
  document.getElementById("e-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The entry meets the mark."
    : "The entry misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 47) * barH;
  const markH = (MARK / 47) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#d0a0a0";
  for (let i = 0; i < step; i++) ctx.fillRect(36 + i * 28, 150, 22, 22);
  ctx.strokeStyle = "#403030";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#d0a0a0";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("entry 18", barX + barW + 18, barBottom - markH + 4);
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
