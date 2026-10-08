const MARK = 330;
const TOL = 0.5;
const canvas = document.getElementById("lots");
const ctx = canvas.getContext("2d");
let group = 9;

function septet(value) {
  let count = 1;
  for (let i = 0; i < 7; i++) count *= value - i;
  return count / 5040;
}

function paint() {
  const count = septet(group);
  document.getElementById("n-val").textContent = "Group " + group;
  document.getElementById("s-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The septet meets the mark."
    : "The septet misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 1716) * barH;
  const markH = (MARK / 1716) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f8eef2";
  for (let i = 0; i < group; i++) {
    ctx.beginPath();
    ctx.arc(36 + i * 22, 78, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#d0a0b0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 7; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 7;
    const x = 150 + 56 * Math.cos(angle);
    const y = 240 + 56 * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = "#402830";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#d0a0b0";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("septet 330", barX + barW + 18, barBottom - markH + 4);
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
