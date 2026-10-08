const MARK = 27;
const TOL = 0.5;
const canvas = document.getElementById("block");
const ctx = canvas.getContext("2d");
let side = 1;

function millilitres(value) {
  return value * value * value;
}

function paint() {
  const volume = millilitres(side);
  document.getElementById("s-val").textContent = side + " cm";
  document.getElementById("v-val").textContent = volume.toFixed(0) + " mL";
  document.getElementById("status").textContent = Math.abs(volume - MARK) <= TOL
    ? "The volume meets the mark."
    : "The volume misses the mark.";
  draw(volume);
}

function draw(volume) {
  const barX = 520;
  const barBottom = 350;
  const barH = 250;
  const barW = 28;
  const fillH = (volume / 125) * barH;
  const markH = (MARK / 125) * barH;
  const edge = 30 + side * 22;
  const x = 70;
  const y = 90;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#70c8b0";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, edge, edge);
  ctx.strokeRect(x + 18, y + 18, edge, edge);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 18, y + 18);
  ctx.moveTo(x + edge, y);
  ctx.lineTo(x + edge + 18, y + 18);
  ctx.moveTo(x, y + edge);
  ctx.lineTo(x + 18, y + edge + 18);
  ctx.moveTo(x + edge, y + edge);
  ctx.lineTo(x + edge + 18, y + edge + 18);
  ctx.stroke();
  ctx.strokeStyle = "#1c3430";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#70c8b0";
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
  if (Math.abs(volume - MARK) > TOL) {
    ctx.fillText("27 mL", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  side = Number(button.dataset.s);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
