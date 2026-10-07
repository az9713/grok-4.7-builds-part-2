const MARK = 120;
const TOL = 0.2;
const canvas = document.getElementById("flask");
const ctx = canvas.getContext("2d");
let kelvin = 300;

function kpa(value) {
  return (100 * value) / 300;
}

function gasInk(value) {
  if (value <= 300) return "#6a8fb0";
  if (value <= 330) return "#7e9a78";
  if (value <= 360) return "#c4a06a";
  if (value <= 390) return "#d08050";
  return "#d06040";
}

function paint() {
  const pressure = kpa(kelvin);
  document.getElementById("t-val").textContent = kelvin + " K";
  document.getElementById("p-val").textContent = pressure.toFixed(1) + " kPa";
  document.getElementById("status").textContent = Math.abs(pressure - MARK) <= TOL
    ? "The pressure meets the mark."
    : "The pressure misses the mark.";
  draw(pressure);
}

function draw(pressure) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (pressure / 180) * barH;
  const markH = (MARK / 180) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = gasInk(kelvin);
  ctx.fillRect(120, 150, 150, 180);
  ctx.strokeStyle = "#a3b098";
  ctx.lineWidth = 3;
  ctx.strokeRect(120, 150, 150, 180);
  ctx.beginPath();
  ctx.moveTo(165, 150);
  ctx.lineTo(165, 70);
  ctx.lineTo(225, 70);
  ctx.lineTo(225, 150);
  ctx.stroke();
  ctx.strokeStyle = "#343828";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#c4d48a";
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
  if (Math.abs(pressure - MARK) > 0.05) {
    ctx.fillText("120.0 kPa", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  kelvin = Number(button.dataset.t);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
