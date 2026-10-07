const MARK = 579.6;
const TOL = 2;
const canvas = document.getElementById("axis");
const ctx = canvas.getContext("2d");
let temp = 4500;

function peakNm(kelvin) {
  return 2898000 / kelvin;
}

function paint() {
  const peak = peakNm(temp);
  document.getElementById("t-val").textContent = temp + " K";
  document.getElementById("p-val").textContent = peak.toFixed(1) + " nm";
  document.getElementById("status").textContent = Math.abs(peak - MARK) <= TOL
    ? "The peak meets the mark."
    : "The peak misses the mark.";
  draw(peak);
}

function xOf(nm) {
  return 70 + (nm - 450) * 2.1;
}

function draw(peak) {
  const axisY = 180;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#322c34";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, axisY);
  ctx.lineTo(640, axisY);
  ctx.stroke();
  ctx.fillStyle = "#9a939c";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("450 nm", 52, axisY + 28);
  ctx.fillText("700 nm", 560, axisY + 28);
  const markX = xOf(MARK);
  ctx.strokeStyle = "#e6b15a";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(markX, 50);
  ctx.lineTo(markX, 280);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#e6b15a";
  if (Math.abs(peak - MARK) > 0.05) ctx.fillText("579.6 nm", markX - 32, 40);
  const peakX = xOf(peak);
  ctx.strokeStyle = "#e07a3d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(peakX, axisY - 70);
  ctx.lineTo(peakX, axisY + 70);
  ctx.stroke();
  ctx.fillStyle = "#e07a3d";
  ctx.beginPath();
  ctx.arc(peakX, axisY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText(peak.toFixed(1) + " nm", peakX + 12, axisY - 78);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  temp = Number(button.dataset.t);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
