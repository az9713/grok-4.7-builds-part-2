const MARK = 40;
const TOL = 1;
const canvas = document.getElementById("packet");
const ctx = canvas.getContext("2d");
let speed = 2;

function picometres(value) {
  return 200 / value;
}

function paint() {
  const wavelength = picometres(speed);
  document.getElementById("v-val").textContent = speed + " m/s";
  document.getElementById("w-val").textContent = wavelength.toFixed(0) + " pm";
  document.getElementById("status").textContent = Math.abs(wavelength - MARK) <= TOL
    ? "The wavelength meets the mark."
    : "The wavelength misses the mark.";
  draw(wavelength);
}

function draw(wavelength) {
  const barX = 520;
  const barBottom = 350;
  const barH = 250;
  const barW = 28;
  const fillH = (wavelength / 120) * barH;
  const markH = (MARK / 120) * barH;
  const left = 70;
  const width = 280;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#eef0f8";
  ctx.beginPath();
  ctx.arc(70, 150, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#9aa6e0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left, 250);
  for (let x = 0; x <= width; x += 4) {
    const y = 250 - Math.sin((x / width) * speed * Math.PI * 2) * 36;
    ctx.lineTo(left + x, y);
  }
  ctx.stroke();
  ctx.strokeStyle = "#2a3048";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#9aa6e0";
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
  if (Math.abs(wavelength - MARK) > 0.5) {
    ctx.fillText("40 pm", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  speed = Number(button.dataset.v);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
