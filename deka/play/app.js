const MARK = 1001;
const TOL = 0.5;
const canvas = document.getElementById("tens");
const ctx = canvas.getContext("2d");
let group = 12;

function dekad(value) {
  let count = 1;
  for (let i = 0; i < 10; i++) count *= value - i;
  return count / 3628800;
}

function paint() {
  const count = dekad(group);
  document.getElementById("n-val").textContent = "Group " + group;
  document.getElementById("o-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The dekad meets the mark."
    : "The dekad misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 8008) * barH;
  const markH = (MARK / 8008) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f8f2ee";
  for (let i = 0; i < group; i++) {
    ctx.beginPath();
    ctx.arc(28 + i * 16, 64, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#d0b0a0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 10;
    const x = 150 + 46 * Math.cos(angle);
    const y = 250 + 46 * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = "#403028";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#d0b0a0";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("dekad 1001", barX + barW + 18, barBottom - markH + 4);
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
