const VS = 2;
const P = 100;
const Q = 200;
const R = 150;
const canvas = document.getElementById("meter");
const ctx = canvas.getContext("2d");
let xOhm = 100;

function vdiff(x) {
  return VS * (R / (P + R) - x / (Q + x));
}

function paint() {
  const volts = vdiff(xOhm);
  document.getElementById("x-val").textContent = xOhm + " Ω";
  document.getElementById("deflection").textContent = volts.toFixed(3) + " V";
  document.getElementById("status").textContent = Math.abs(volts) < 0.001
    ? "The galvanometer is at null."
    : "The galvanometer is off null.";
  draw(volts);
}

function draw(volts) {
  const w = canvas.width;
  ctx.clearRect(0, 0, w, canvas.height);
  const top = { x: 320, y: 70 };
  const left = { x: 160, y: 190 };
  const right = { x: 480, y: 190 };
  const bottom = { x: 320, y: 310 };
  ctx.strokeStyle = "#c4845c";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(top.x, top.y);
  ctx.lineTo(left.x, left.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.lineTo(right.x, right.y);
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = "#efe6d0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left.x, left.y);
  ctx.lineTo(right.x, right.y);
  ctx.stroke();
  ctx.fillStyle = "#a89884";
  ctx.font = "15px Consolas, monospace";
  ctx.fillText("P 100", 200, 120);
  ctx.fillText("Q 200", 390, 120);
  ctx.fillText("R 150", 190, 280);
  ctx.fillText("X " + xOhm, 400, 280);
  ctx.fillText("+2 V", top.x - 18, top.y - 12);
  const cx = 320;
  const cy = 430;
  ctx.strokeStyle = "#efe6d0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 58, Math.PI, 0);
  ctx.stroke();
  const tilt = Math.max(-0.9, Math.min(0.9, volts / 0.6));
  const ang = -Math.PI / 2 + tilt;
  ctx.strokeStyle = "#f3ecdf";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(ang) * 50, cy + Math.sin(ang) * 50);
  ctx.stroke();
  ctx.fillStyle = volts === 0 ? "#7d9a72" : "#c4845c";
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();
}

document.getElementById("bin").addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;
  xOhm = Number(btn.dataset.x);
  document.querySelectorAll("#bin button").forEach((item) => {
    item.setAttribute("aria-pressed", String(Number(item.dataset.x) === xOhm));
  });
  paint();
});

paint();
