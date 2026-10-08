const MARK = 60;
const TOL = 0.5;
const canvas = document.getElementById("row");
const ctx = canvas.getContext("2d");
let names = 3;

function order(value) {
  return value * (value - 1) * (value - 2);
}

function paint() {
  const count = order(names);
  document.getElementById("n-val").textContent = names + " names";
  document.getElementById("o-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The order meets the mark."
    : "The order misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 210) * barH;
  const markH = (MARK / 210) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#eef6f8";
  for (let i = 0; i < names; i++) {
    ctx.beginPath();
    ctx.arc(48 + i * 28, 90, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#70a8d0";
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) ctx.strokeRect(48 + i * 52, 180, 40, 40);
  ctx.strokeStyle = "#243840";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#70a8d0";
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
  if (Math.abs(count - MARK) > TOL) ctx.fillText("order 60", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  names = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
