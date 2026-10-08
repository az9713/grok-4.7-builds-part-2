const MARK = 36.8;
const TOL = 0.05;
const canvas = document.getElementById("slab");
const ctx = canvas.getContext("2d");
let centimetres = 0;

function percent(value) {
  return 100 * Math.exp(-value / 5);
}

function paint() {
  const transmission = percent(centimetres);
  document.getElementById("c-val").textContent = centimetres + " cm";
  document.getElementById("p-val").textContent = transmission.toFixed(1) + " %";
  document.getElementById("status").textContent = Math.abs(transmission - MARK) <= TOL
    ? "The transmission meets the mark."
    : "The transmission misses the mark.";
  draw(transmission);
}

function draw(transmission) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (transmission / 100) * barH;
  const markH = (MARK / 100) * barH;
  const layers = Math.max(1, Math.round(centimetres / 5));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < layers; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#d08058" : "#3c2c24";
    ctx.fillRect(50 + i * 28, 90, 24, 180);
  }
  const beam = (transmission / 100) * 220;
  ctx.strokeStyle = "#f6efe8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(50, 180);
  ctx.lineTo(50 + beam, 180);
  ctx.stroke();
  ctx.strokeStyle = "#3c2c24";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#d08058";
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
  if (Math.abs(transmission - MARK) > TOL) {
    ctx.fillText("36.8 %", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  centimetres = Number(button.dataset.c);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
