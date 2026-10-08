const MARK = 3;
const TOL = 0.02;
const canvas = document.getElementById("bar");
const ctx = canvas.getContext("2d");
let force = 4;

function strain(value) {
  return value / 4;
}

function paint() {
  const value = strain(force);
  document.getElementById("f-val").textContent = force + " N";
  document.getElementById("s-val").textContent = value.toFixed(2);
  document.getElementById("status").textContent = Math.abs(value - MARK) <= TOL
    ? "The strain meets the mark."
    : "The strain misses the mark.";
  draw(value);
}

function draw(value) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (value / 6) * barH;
  const markH = (MARK / 6) * barH;
  const width = 90 + value * 30;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e0a15f";
  ctx.fillRect(70, 180, width, 36);
  ctx.strokeStyle = "#c4b09a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(70, 198);
  ctx.lineTo(40, 198);
  ctx.moveTo(70 + width, 198);
  ctx.lineTo(70 + width + 30, 198);
  ctx.stroke();
  ctx.strokeStyle = "#3c3428";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e0a15f";
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
  if (Math.abs(value - MARK) > 0.02) {
    ctx.fillText("3.00", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  force = Number(button.dataset.f);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
