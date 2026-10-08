const MARK = 21;
const TOL = 0.5;
const canvas = document.getElementById("tiles");
const ctx = canvas.getContext("2d");
let step = 5;

function term(value) {
  let a = 1;
  let b = 1;
  for (let i = 3; i <= value; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}

function paint() {
  const value = term(step);
  document.getElementById("n-val").textContent = "Term " + step;
  document.getElementById("t-val").textContent = value.toFixed(0);
  document.getElementById("status").textContent = Math.abs(value - MARK) <= TOL
    ? "The term meets the mark."
    : "The term misses the mark.";
  draw(value);
}

function draw(value) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (value / 34) * barH;
  const markH = (MARK / 34) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e0b060";
  for (let i = 0; i < value; i++) {
    const col = i % 10;
    const row = Math.floor(i / 10);
    ctx.fillRect(36 + col * 20, 70 + row * 22, 16, 16);
  }
  ctx.strokeStyle = "#3c3424";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e0b060";
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
  if (Math.abs(value - MARK) > TOL) {
    ctx.fillText("term 21", barX + barW + 18, barBottom - markH + 4);
  }
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
