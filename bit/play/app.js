const MARK = 3;
const TOL = 0.005;
const canvas = document.getElementById("cells");
const ctx = canvas.getContext("2d");
let states = 2;

function bits(value) {
  return Math.log2(value);
}

function paint() {
  const count = bits(states);
  document.getElementById("n-val").textContent = String(states);
  document.getElementById("b-val").textContent = count.toFixed(2) + " bits";
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The count meets the mark."
    : "The count misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 6) * barH;
  const markH = (MARK / 6) * barH;
  const cols = Math.min(8, states);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#88a0e0";
  for (let i = 0; i < states; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    ctx.fillRect(40 + col * 28, 80 + row * 28, 20, 20);
  }
  ctx.strokeStyle = "#242838";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#88a0e0";
  ctx.fillRect(barX, barBottom - fillH, barW, barH);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(barX - 16, barBottom - markH);
  ctx.lineTo(barX + barW + 16, barBottom - markH);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  if (Math.abs(count - MARK) > TOL) {
    ctx.fillText("3.00 bits", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  states = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
