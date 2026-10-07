const MARK = 1002;
const TOL = 0.009;
const canvas = document.getElementById("bench");
const ctx = canvas.getContext("2d");

function lengthMm(temp) {
  return (100000 + temp * 2) / 100;
}

function paint() {
  const temp = Number(document.getElementById("temp").value);
  const length = lengthMm(temp);
  document.getElementById("temp-val").textContent = temp + "°C";
  document.getElementById("len-val").textContent = length.toFixed(2) + " mm";
  document.getElementById("status").textContent = Math.abs(length - MARK) <= TOL
    ? "The rod meets the stop."
    : "The rod misses the stop.";
  draw(length);
}

function draw(length) {
  const w = canvas.width;
  const h = canvas.height;
  const y = 170;
  const coldX = 150;
  const px = 80;
  const tip = coldX + (length - 1000) * px;
  const stop = coldX + (MARK - 1000) * px;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#2a3640";
  ctx.beginPath();
  ctx.moveTo(36, y + 36);
  ctx.lineTo(w - 36, y + 36);
  ctx.stroke();
  ctx.fillStyle = "#d4845a";
  ctx.fillRect(40, y - 16, Math.max(8, tip - 40), 32);
  ctx.strokeStyle = "#8aa0ae";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(coldX, y - 48);
  ctx.lineTo(coldX, y + 48);
  ctx.stroke();
  ctx.strokeStyle = "#7d9a72";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(stop, y - 58);
  ctx.lineTo(stop, y + 58);
  ctx.stroke();
  ctx.fillStyle = "#8aa0ae";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("1000.00 mm", coldX - 36, y + 72);
  ctx.fillStyle = "#7d9a72";
  ctx.fillText("1002.00 mm", stop - 36, y - 68);
}

document.getElementById("temp").addEventListener("input", paint);
paint();
