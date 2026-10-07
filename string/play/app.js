const L = 1.2;
const MARK = 0.4;
const TOL = 0.02;
const SPEED = 240;
const canvas = document.getElementById("wire");
const ctx = canvas.getContext("2d");

function nearest(n) {
  let best = L;
  for (let k = 0; k <= n; k += 1) {
    best = Math.min(best, Math.abs(MARK - k * L / n));
  }
  return best;
}

function paint() {
  const n = Number(document.getElementById("n").value);
  const gap = nearest(n);
  const freq = n * SPEED / (2 * L);
  document.getElementById("n-val").textContent = String(n);
  document.getElementById("freq").textContent = freq.toFixed(0) + " Hz";
  document.getElementById("near").textContent = gap.toFixed(2) + " m";
  document.getElementById("status").textContent = gap <= TOL
    ? "A node sits on the mark."
    : "The mark is not a node.";
  draw(n);
}

function draw(n) {
  const w = canvas.width;
  const h = canvas.height;
  const left = 48;
  const right = w - 48;
  const mid = h * 0.55;
  const xOf = (x) => left + (x / L) * (right - left);
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#3a3428";
  ctx.beginPath();
  ctx.moveTo(left, mid);
  ctx.lineTo(right, mid);
  ctx.stroke();
  ctx.strokeStyle = "#e2c27a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 240; i += 1) {
    const x = (i / 240) * L;
    const y = mid - Math.sin(n * Math.PI * x / L) * 78;
    if (i === 0) ctx.moveTo(xOf(x), y);
    else ctx.lineTo(xOf(x), y);
  }
  ctx.stroke();
  ctx.fillStyle = "#e2c27a";
  for (let k = 0; k <= n; k += 1) {
    ctx.beginPath();
    ctx.arc(xOf(k * L / n), mid, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  const mx = xOf(MARK);
  ctx.strokeStyle = "#d4533a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(mx, 36);
  ctx.lineTo(mx, h - 36);
  ctx.stroke();
  ctx.fillStyle = "#d4533a";
  ctx.font = "14px Consolas, monospace";
  ctx.fillText("0.40 m", mx + 8, 52);
}

document.getElementById("n").addEventListener("input", paint);
paint();
