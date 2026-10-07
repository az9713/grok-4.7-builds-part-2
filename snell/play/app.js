const BELL_X = 0.42;
const BELL_Y = 0.85;
const TOL = 0.03;
const canvas = document.getElementById("tank");
const ctx = canvas.getContext("2d");
const angleEl = document.getElementById("angle");
const indexEl = document.getElementById("index");

function trace(iDeg, n) {
  const i = iDeg * Math.PI / 180;
  const s = n * Math.sin(i);
  const critical = Math.asin(Math.min(1, 1 / n)) * 180 / Math.PI;
  if (s > 1) return { critical, tir: true, rDeg: null, x: null };
  const r = Math.asin(s);
  const x = BELL_Y * Math.tan(r);
  return { critical, tir: false, rDeg: r * 180 / Math.PI, x };
}

function draw(iDeg, n, hit) {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w * 0.38;
  const sy = h * 0.46;
  const unit = h * 0.42;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#d7e4ea";
  ctx.fillRect(0, 0, w, sy);
  ctx.fillStyle = "#0e3a44";
  ctx.fillRect(0, sy, w, h - sy);
  ctx.strokeStyle = "#d4a24c";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, sy);
  ctx.lineTo(w, sy);
  ctx.stroke();
  ctx.strokeStyle = "rgba(213,228,234,0.35)";
  ctx.beginPath();
  ctx.moveTo(cx, sy - 70);
  ctx.lineTo(cx, sy + 70);
  ctx.stroke();
  const X = (x) => cx + x * unit;
  const Y = (y) => sy - y * unit;
  ctx.fillStyle = "#102126";
  ctx.beginPath();
  ctx.arc(X(0), Y(0), 5, 0, Math.PI * 2);
  ctx.fill();
  const i = iDeg * Math.PI / 180;
  ctx.strokeStyle = "#f4f7f8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(X(-Math.sin(i) * 0.95), Y(-Math.cos(i) * 0.95));
  ctx.lineTo(X(0), Y(0));
  if (hit.tir) {
    ctx.lineTo(X(Math.sin(i) * 0.95), Y(-Math.cos(i) * 0.95));
  } else {
    const r = hit.rDeg * Math.PI / 180;
    ctx.lineTo(X(Math.sin(r) * 1.05), Y(Math.cos(r) * 1.05));
  }
  ctx.stroke();
  ctx.fillStyle = "#d4a24c";
  ctx.beginPath();
  ctx.arc(X(BELL_X), Y(BELL_Y), 8, 0, Math.PI * 2);
  ctx.fill();
}

function paint() {
  const iDeg = Number(angleEl.value);
  const n = Number(indexEl.value);
  const hit = trace(iDeg, n);
  document.getElementById("angle-val").textContent = iDeg + "°";
  document.getElementById("index-val").textContent = n.toFixed(2);
  document.getElementById("critical").textContent = hit.critical.toFixed(1) + "°";
  document.getElementById("air").textContent = hit.tir ? "reflects" : hit.rDeg.toFixed(1) + "°";
  document.getElementById("miss").textContent = hit.tir ? "reflects" : Math.abs(hit.x - BELL_X).toFixed(3);
  const status = document.getElementById("status");
  if (hit.tir) status.textContent = "The ray reflects. The angle is past the critical angle.";
  else if (Math.abs(hit.x - BELL_X) <= TOL) status.textContent = "The ray meets the bell.";
  else status.textContent = "The ray misses the bell.";
  draw(iDeg, n, hit);
}

angleEl.addEventListener("input", paint);
indexEl.addEventListener("input", paint);
paint();
