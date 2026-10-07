const MARK = 25;
const TOL = 0.5;
const canvas = document.getElementById("room");
const ctx = canvas.getContext("2d");
let metres = 1;

function luxAt(distance) {
  return 100 / (distance * distance);
}

function paint() {
  const lux = luxAt(metres);
  document.getElementById("d-val").textContent = metres.toFixed(1) + " m";
  document.getElementById("l-val").textContent = lux.toFixed(2) + " lx";
  document.getElementById("status").textContent = Math.abs(lux - MARK) <= TOL
    ? "The illuminance meets the mark."
    : "The illuminance misses the mark.";
  draw(lux);
}

function draw(lux) {
  const lampX = 70;
  const y = 180;
  const px = 90;
  const cardX = lampX + metres * px;
  const markX = lampX + 2 * px;
  const barX = 600;
  const barBottom = 340;
  const barH = 240;
  const barW = 26;
  const fillH = (lux / 110) * barH;
  const markH = (MARK / 110) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(markX, 70);
  ctx.lineTo(markX, 300);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  if (Math.abs(metres - 2) > 0.01) ctx.fillText("2.0 m", markX - 18, 56);
  ctx.strokeStyle = "#5a5044";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lampX, y);
  ctx.lineTo(cardX, y);
  ctx.stroke();
  ctx.fillStyle = "#e6b15a";
  ctx.beginPath();
  ctx.arc(lampX, y, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d4c4a8";
  ctx.fillRect(cardX - 8, y - 36, 16, 72);
  ctx.strokeStyle = "#3c3428";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e6b15a";
  ctx.fillRect(barX, barBottom - fillH, barW, fillH);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(barX - 14, barBottom - markH);
  ctx.lineTo(barX + barW + 14, barBottom - markH);
  ctx.stroke();
  ctx.setLineDash([]);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  metres = Number(button.dataset.d);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
