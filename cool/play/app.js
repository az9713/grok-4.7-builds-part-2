const MARK = 40;
const TOL = 0.05;
const canvas = document.getElementById("bulb");
const ctx = canvas.getContext("2d");
let minutes = 5;

function celsius(value) {
  return 800 / (10 + value);
}

function paint() {
  const temp = celsius(minutes);
  document.getElementById("m-val").textContent = minutes + " min";
  document.getElementById("c-val").textContent = temp.toFixed(1) + " °C";
  document.getElementById("status").textContent = Math.abs(temp - MARK) <= TOL
    ? "The temperature meets the mark."
    : "The temperature misses the mark.";
  draw(temp);
}

function draw(temp) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (temp / 80) * barH;
  const markH = (MARK / 80) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e09860";
  ctx.beginPath();
  ctx.arc(120, 300, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f6efe8";
  ctx.lineWidth = 2;
  ctx.strokeRect(110, 90, 20, 190);
  const merc = (temp / 80) * 150;
  ctx.fillStyle = "#e09860";
  ctx.fillRect(113, 270 - merc, 14, merc);
  ctx.strokeStyle = "#e09860";
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const y = 110 + i * 28;
    ctx.beginPath();
    ctx.moveTo(168, y);
    ctx.lineTo(300, y - 16);
    ctx.stroke();
  }
  ctx.strokeStyle = "#3c2820";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e09860";
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
  if (Math.abs(temp - MARK) > TOL) {
    ctx.fillText("40.0 °C", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  minutes = Number(button.dataset.m);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
