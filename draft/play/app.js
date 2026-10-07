const MARK = 0.6;
const TOL = 0.02;
const canvas = document.getElementById("tank");
const ctx = canvas.getContext("2d");
let rho = 0.4;

function paint() {
  const sunk = rho >= 1;
  const frac = sunk ? null : rho;
  document.getElementById("rho-val").textContent = rho.toFixed(2) + " g/cm³";
  document.getElementById("frac-val").textContent = sunk ? "sunk" : frac.toFixed(2);
  let line = "The waterline misses the mark.";
  if (sunk) line = "The hull sinks.";
  else if (Math.abs(frac - MARK) <= TOL) line = "The waterline meets the mark.";
  document.getElementById("status").textContent = line;
  draw(frac, sunk);
}

function draw(frac, sunk) {
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const left = 70;
  const right = 610;
  const top = 36;
  const bottom = 380;
  const hullX = 270;
  const hullW = 140;
  const hullH = 250;
  let hullTop = 78;
  let hullBot = hullTop + hullH;
  if (sunk) {
    const drop = bottom - hullBot;
    hullTop += drop;
    hullBot += drop;
  }
  const markY = hullBot - MARK * hullH;
  const waterY = sunk ? 48 : hullBot - frac * hullH;
  ctx.fillStyle = "#1a6a78";
  ctx.fillRect(left, waterY, right - left, bottom - waterY);
  if (!sunk) {
    ctx.fillStyle = "#c4a574";
    ctx.fillRect(hullX, hullTop, hullW, waterY - hullTop);
  }
  const wetTop = Math.max(waterY, hullTop);
  ctx.fillStyle = "#6d8f86";
  ctx.fillRect(hullX, wetTop, hullW, hullBot - wetTop);
  ctx.strokeStyle = "#e07a5f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(hullX - 16, markY);
  ctx.lineTo(hullX + hullW + 16, markY);
  ctx.stroke();
  ctx.strokeStyle = "#8aa3a8";
  ctx.strokeRect(left, top, right - left, bottom - top);
  ctx.strokeStyle = "#e4eef0";
  ctx.strokeRect(hullX, hullTop, hullW, hullH);
  ctx.fillStyle = "#8aa3a8";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("0.60", hullX + hullW + 22, markY + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  rho = Number(button.dataset.rho);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});
paint();
