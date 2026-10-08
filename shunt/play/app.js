const MARK = 6;
const TOL = 0.005;
const canvas = document.getElementById("pair");
const ctx = canvas.getContext("2d");
let ohms = 4;

function parallel(value) {
  return (value * 12) / (value + 12);
}

function paint() {
  const pair = parallel(ohms);
  document.getElementById("r-val").textContent = ohms + " Ω";
  document.getElementById("p-val").textContent = pair.toFixed(2) + " Ω";
  document.getElementById("status").textContent = Math.abs(pair - MARK) <= TOL
    ? "The resistance meets the mark."
    : "The resistance misses the mark.";
  draw(pair);
}

function zigzag(y, teeth) {
  ctx.beginPath();
  ctx.moveTo(50, y);
  const step = 240 / teeth;
  for (let i = 1; i <= teeth; i++) {
    const x = 50 + i * step;
    const dy = i % 2 === 0 ? 18 : -18;
    ctx.lineTo(x, y + dy);
  }
  ctx.lineTo(320, y);
  ctx.stroke();
}

function draw(pair) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (pair / 12) * barH;
  const markH = (MARK / 12) * barH;
  const teeth = Math.max(3, Math.round(ohms / 4));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#b0b898";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 140);
  ctx.lineTo(50, 280);
  ctx.moveTo(320, 140);
  ctx.lineTo(320, 280);
  ctx.stroke();
  ctx.strokeStyle = "#c4d070";
  ctx.lineWidth = 2;
  zigzag(160, 6);
  ctx.strokeStyle = "#f4f6e8";
  zigzag(260, teeth);
  ctx.strokeStyle = "#303820";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#c4d070";
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
  if (Math.abs(pair - MARK) > TOL) {
    ctx.fillText("6.00 Ω", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  ohms = Number(button.dataset.r);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
