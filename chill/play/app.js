const MARK = 9;
const TOL = 0.005;
const canvas = document.getElementById("cabinet");
const ctx = canvas.getContext("2d");
let kelvin = 540;

function ratio(value) {
  return 270 / (value - 270);
}

function paint() {
  const gain = ratio(kelvin);
  document.getElementById("k-val").textContent = kelvin + " K";
  document.getElementById("c-val").textContent = gain.toFixed(2);
  document.getElementById("status").textContent = Math.abs(gain - MARK) <= TOL
    ? "The ratio meets the mark."
    : "The ratio misses the mark.";
  draw(gain);
}

function draw(gain) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (gain / 10) * barH;
  const markH = (MARK / 10) * barH;
  const coil = ((kelvin - 270) / 270) * 150;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#eef6f6";
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 90, 130, 180);
  ctx.fillStyle = "#78d0c8";
  ctx.fillRect(84, 150, 82, 96);
  ctx.strokeStyle = "#78d0c8";
  ctx.strokeRect(210, 270 - coil, 24, coil);
  ctx.strokeStyle = "#24383c";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#78d0c8";
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
  if (Math.abs(gain - MARK) > TOL) {
    ctx.fillText("9.00", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  kelvin = Number(button.dataset.k);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
