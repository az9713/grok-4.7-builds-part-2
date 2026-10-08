const MARK = 495;
const TOL = 0.5;
const canvas = document.getElementById("eights");
const ctx = canvas.getContext("2d");
let group = 10;

function ogdoad(value) {
  let count = 1;
  for (let i = 0; i < 8; i++) count *= value - i;
  return count / 40320;
}

function paint() {
  const count = ogdoad(group);
  document.getElementById("n-val").textContent = "Group " + group;
  document.getElementById("o-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The ogdoad meets the mark."
    : "The ogdoad misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 3003) * barH;
  const markH = (MARK / 3003) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f8f0ee";
  for (let i = 0; i < group; i++) {
    ctx.beginPath();
    ctx.arc(32 + i * 20, 70, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#c8a898";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
    const x = 160 + 50 * Math.cos(angle);
    const y = 248 + 50 * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = "#3c302c";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#c8a898";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("ogdoad 495", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  group = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
