const MARK = 0.06;
const TOL = 0.002;
const canvas = document.getElementById("loop");
const ctx = canvas.getContext("2d");
let ohms = 100;

function currentA(resistance) {
  return 12 / resistance;
}

function paint() {
  const current = currentA(ohms);
  document.getElementById("r-val").textContent = ohms + " Ω";
  document.getElementById("i-val").textContent = current.toFixed(3) + " A";
  document.getElementById("status").textContent = Math.abs(current - MARK) <= TOL
    ? "The current meets the mark."
    : "The current misses the mark.";
  draw(current);
}

function draw(current) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#a89884";
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 150, 70, 110);
  ctx.fillStyle = "#d4845a";
  ctx.fillRect(78, 196, 54, 10);
  ctx.fillStyle = "#7d9a72";
  ctx.fillRect(78, 214, 54, 10);
  ctx.strokeStyle = "#d4845a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(140, 205);
  let x = 160;
  const y = 205;
  ctx.lineTo(x, y);
  for (let n = 0; n < 6; n++) {
    ctx.lineTo(x + 10, y - 16);
    ctx.lineTo(x + 20, y + 16);
    x += 20;
  }
  ctx.lineTo(x + 16, y);
  ctx.stroke();
  const barX = 520;
  const barBottom = 340;
  const barH = 220;
  const barW = 26;
  ctx.strokeStyle = "#3a3228";
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  const fillH = Math.min(barH, (current / 0.12) * barH);
  ctx.fillStyle = "#d4845a";
  ctx.fillRect(barX, barBottom - fillH, barW, fillH);
  const tick = barBottom - (0.06 / 0.12) * barH;
  ctx.strokeStyle = "#7d9a72";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(barX - 12, tick);
  ctx.lineTo(barX + barW + 10, tick);
  ctx.stroke();
  ctx.fillStyle = "#7d9a72";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("0.060 A", barX - 78, tick + 4);
  ctx.fillStyle = "#a89884";
  ctx.fillText("12 V", 82, 140);
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
