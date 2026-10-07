const MARK = 2.4;
const TOL = 0.02;
const canvas = document.getElementById("cylinder");
const ctx = canvas.getContext("2d");
let temp = 273;

function volumeL(kelvin) {
  return 2 * kelvin / 300;
}

function paint() {
  const volume = volumeL(temp);
  document.getElementById("t-val").textContent = temp + " K";
  document.getElementById("v-val").textContent = volume.toFixed(2) + " L";
  document.getElementById("status").textContent = Math.abs(volume - MARK) <= TOL
    ? "The volume meets the mark."
    : "The volume misses the mark.";
  draw(volume, temp);
}

function draw(volume, kelvin) {
  const bottom = 360;
  const left = 150;
  const width = 150;
  const px = 80;
  const pistonY = bottom - volume * px;
  const markY = bottom - MARK * px;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#1f6a58";
  ctx.fillRect(left, pistonY, width, bottom - pistonY);
  ctx.strokeStyle = "#8eaa98";
  ctx.lineWidth = 2;
  ctx.strokeRect(left, 70, width, bottom - 70);
  ctx.fillStyle = "#d4a24c";
  ctx.fillRect(left - 10, pistonY - 10, width + 20, 12);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(left - 28, markY);
  ctx.lineTo(left + width + 28, markY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("2.40 L", left + width + 36, markY + 4);
  const tubeX = 470;
  const tubeTop = 90;
  const tubeH = 250;
  ctx.strokeStyle = "#24382c";
  ctx.strokeRect(tubeX, tubeTop, 22, tubeH);
  const fill = Math.max(0, Math.min(1, (kelvin - 250) / 180));
  ctx.fillStyle = "#d4a24c";
  ctx.fillRect(tubeX, tubeTop + tubeH * (1 - fill), 22, tubeH * fill);
  const tick = tubeTop + tubeH * (1 - (360 - 250) / 180);
  ctx.strokeStyle = "#8fb089";
  ctx.beginPath();
  ctx.moveTo(tubeX - 10, tick);
  ctx.lineTo(tubeX + 34, tick);
  ctx.stroke();
  ctx.fillText("360 K", tubeX + 40, tick + 4);
  ctx.fillStyle = "#8eaa98";
  ctx.fillText("pressure fixed", left, 56);
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
