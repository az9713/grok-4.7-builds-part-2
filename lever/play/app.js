const MARK = 0;
const TOL = 0.5;
const canvas = document.getElementById("beam");
const ctx = canvas.getContext("2d");
let mass = 2;

function moment(kg) {
  return 4 * 30 - kg * 24;
}

function paint() {
  const value = moment(mass);
  document.getElementById("m-val").textContent = mass + " kg";
  document.getElementById("mom-val").textContent = value + " kg·cm";
  document.getElementById("status").textContent = Math.abs(value - MARK) <= TOL
    ? "The beam is level."
    : "The beam is not level.";
  draw(mass, value);
}

function draw(kg, value) {
  const fx = 330;
  const fy = 190;
  const tilt = Math.max(-0.35, Math.min(0.35, value / 300));
  const leftArm = 30 * 6;
  const rightArm = 24 * 6;
  const x1 = fx - Math.cos(tilt) * leftArm;
  const y1 = fy + Math.sin(tilt) * leftArm;
  const x2 = fx + Math.cos(tilt) * rightArm;
  const y2 = fy - Math.sin(tilt) * rightArm;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#d4b483";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.fillStyle = "#e7e1d6";
  ctx.beginPath();
  ctx.moveTo(fx, fy + 4);
  ctx.lineTo(fx - 16, fy + 52);
  ctx.lineTo(fx + 16, fy + 52);
  ctx.fill();
  ctx.fillStyle = "#e07a5f";
  ctx.beginPath();
  ctx.arc(x1, y1, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x2, y2, 8 + kg * 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#a89884";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("4 kg · 30 cm", x1 - 36, y1 + 36);
  ctx.fillText(kg + " kg · 24 cm", x2 - 36, y2 + 40);
  ctx.fillText("fulcrum", fx - 24, fy + 72);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  mass = Number(button.dataset.m);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});
paint();
