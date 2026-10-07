const m1 = 1;
const m2 = 1;
const l1 = 1;
const l2 = 1;
const g = 9.81;
const DT = 1 / 240;
const canvas = document.getElementById("well");
const ctx = canvas.getContext("2d");

let state = [0, 0, 0, 0];
let e0 = 0;
let running = false;
let acc = 0;
let last = 0;
let trace = [];

function accel(th1, w1, th2, w2) {
  const d = th1 - th2;
  const den = 2 * m1 + m2 - m2 * Math.cos(2 * th1 - 2 * th2);
  const a1 = (
    -g * (2 * m1 + m2) * Math.sin(th1)
    - m2 * g * Math.sin(th1 - 2 * th2)
    - 2 * Math.sin(d) * m2 * (w2 * w2 * l2 + w1 * w1 * l1 * Math.cos(d))
  ) / (l1 * den);
  const a2 = (
    2 * Math.sin(d) * (
      w1 * w1 * l1 * (m1 + m2)
      + g * (m1 + m2) * Math.cos(th1)
      + w2 * w2 * l2 * m2 * Math.cos(d)
    )
  ) / (l2 * den);
  return [a1, a2];
}

function deriv(y) {
  const a = accel(y[0], y[1], y[2], y[3]);
  return [y[1], a[0], y[3], a[1]];
}

function rk4(y, dt) {
  const k1 = deriv(y);
  const k2 = deriv(y.map((v, i) => v + 0.5 * dt * k1[i]));
  const k3 = deriv(y.map((v, i) => v + 0.5 * dt * k2[i]));
  const k4 = deriv(y.map((v, i) => v + dt * k3[i]));
  return y.map((v, i) => v + dt * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) / 6);
}

function energy(y) {
  const th1 = y[0];
  const w1 = y[1];
  const th2 = y[2];
  const w2 = y[3];
  const y1 = -l1 * Math.cos(th1);
  const y2 = y1 - l2 * Math.cos(th2);
  const vx1 = l1 * w1 * Math.cos(th1);
  const vy1 = l1 * w1 * Math.sin(th1);
  const vx2 = vx1 + l2 * w2 * Math.cos(th2);
  const vy2 = vy1 + l2 * w2 * Math.sin(th2);
  const kin = 0.5 * m1 * (vx1 * vx1 + vy1 * vy1) + 0.5 * m2 * (vx2 * vx2 + vy2 * vy2);
  const pot = m1 * g * y1 + m2 * g * y2;
  return kin + pot;
}

function fixed(n, d) {
  const text = n.toFixed(d);
  const zero = "0." + "0".repeat(d);
  return text === "-" + zero ? zero : text;
}

function bobs(y) {
  const x1 = l1 * Math.sin(y[0]);
  const y1 = -l1 * Math.cos(y[0]);
  const x2 = x1 + l2 * Math.sin(y[2]);
  const y2 = y1 - l2 * Math.cos(y[2]);
  return [x1, y1, x2, y2];
}

function hold() {
  running = false;
  acc = 0;
  last = 0;
  document.getElementById("run").setAttribute("aria-pressed", "false");
  const th1 = Number(document.getElementById("th1").value) * Math.PI / 180;
  const th2 = Number(document.getElementById("th2").value) * Math.PI / 180;
  state = [th1, 0, th2, 0];
  e0 = energy(state);
  trace = [];
  paint();
}

function pushTrace() {
  const p = bobs(state);
  trace.push([p[2], p[3]]);
  if (trace.length > 700) trace.shift();
}

function paint() {
  const e = energy(state);
  document.getElementById("a1").textContent = fixed(state[0] * 180 / Math.PI, 1) + "°";
  document.getElementById("a2").textContent = fixed(state[2] * 180 / Math.PI, 1) + "°";
  document.getElementById("energy").textContent = fixed(e, 4);
  document.getElementById("drift").textContent = fixed(e - e0, 6);
  document.getElementById("status").textContent = running ? "The bobs are in motion." : "The bobs are held.";
  draw();
}

function draw() {
  const w = canvas.width;
  const h = canvas.height;
  const sx = (x) => w / 2 + x * 150;
  const sy = (y) => 150 - y * 150;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#2a3344";
  ctx.strokeRect(16, 16, w - 32, h - 32);
  ctx.beginPath();
  trace.forEach((p, i) => {
    if (i === 0) ctx.moveTo(sx(p[0]), sy(p[1]));
    else ctx.lineTo(sx(p[0]), sy(p[1]));
  });
  ctx.strokeStyle = "#6eb0c4";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  const p = bobs(state);
  ctx.strokeStyle = "#d9d3c7";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(sx(0), sy(0));
  ctx.lineTo(sx(p[0]), sy(p[1]));
  ctx.lineTo(sx(p[2]), sy(p[3]));
  ctx.stroke();
  ctx.fillStyle = "#e0c07a";
  ctx.beginPath();
  ctx.arc(sx(p[0]), sy(p[1]), 10, 0, Math.PI * 2);
  ctx.arc(sx(p[2]), sy(p[3]), 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(sx(0) - 8, sy(0) - 4, 16, 8);
}

function frame(now) {
  if (!running) return;
  if (!last) last = now;
  acc += Math.min(0.05, (now - last) / 1000);
  last = now;
  let n = 0;
  while (acc >= DT && n < 12) {
    state = rk4(state, DT);
    pushTrace();
    acc -= DT;
    n += 1;
  }
  paint();
  requestAnimationFrame(frame);
}

document.getElementById("run").addEventListener("click", () => {
  running = !running;
  document.getElementById("run").setAttribute("aria-pressed", String(running));
  if (running) {
    last = 0;
    requestAnimationFrame(frame);
  }
  paint();
});

document.getElementById("step").addEventListener("click", () => {
  for (let i = 0; i < 240; i += 1) {
    state = rk4(state, DT);
    if (i % 4 === 0) pushTrace();
  }
  paint();
});

document.getElementById("reset").addEventListener("click", hold);
document.getElementById("th1").addEventListener("input", hold);
document.getElementById("th2").addEventListener("input", hold);
hold();
