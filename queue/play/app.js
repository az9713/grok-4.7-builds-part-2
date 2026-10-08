const MARK = 30;
const TOL = 0.5;
const canvas = document.getElementById("pairs");
const ctx = canvas.getContext("2d");
let items = 4;

function pairs(value) {
  return value * (value - 1);
}

function paint() {
  const count = pairs(items);
  document.getElementById("n-val").textContent = items + " items";
  document.getElementById("p-val").textContent = count.toFixed(0) + " pairs";
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The product meets the mark."
    : "The product misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 56) * barH;
  const markH = (MARK / 56) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#f6f2e8";
  ctx.lineWidth = 2;
  for (let i = 0; i < items; i++) {
    ctx.beginPath();
    ctx.arc(48 + i * 32, 110, 12, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = "#7eb0d4";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(48, 170);
  ctx.lineTo(96, 170);
  ctx.lineTo(80, 156);
  ctx.moveTo(96, 170);
  ctx.lineTo(80, 184);
  ctx.stroke();
  ctx.strokeStyle = "#3c3428";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#7eb0d4";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("30 pairs", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  items = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
