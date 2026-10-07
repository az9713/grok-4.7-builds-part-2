const GM = 1;
const R1 = 1;
const R2 = 1.85;
const PLANET = 0.32;
const THRUST = 0.12;
const FUEL0 = 0.48;
const DT = 1 / 120;

const canvas = document.getElementById("plot");
const ctx = canvas.getContext("2d");
const el = {
  fuel: document.getElementById("fuel"),
  dist: document.getElementById("dist"),
  near: document.getElementById("near"),
  far: document.getElementById("far"),
  size: document.getElementById("size"),
  ecc: document.getElementById("ecc"),
  status: document.getElementById("status"),
  pro: document.getElementById("pro"),
  ret: document.getElementById("ret"),
};

const keys = { pro: false, ret: false };
let pointerMode = 0;
let ship = null;
let trail = [];
let acc = 0;
let last = performance.now();
let stepCount = 0;

function fresh() {
  ship = {
    x: R1,
    y: 0,
    vx: 0,
    vy: Math.sqrt(GM / R1),
    fuel: FUEL0,
    phase: "fly",
    winHold: 0,
  };
  trail = [];
  acc = 0;
}

function metrics(s) {
  const r = Math.hypot(s.x, s.y) || 1e-6;
  const v2 = s.vx * s.vx + s.vy * s.vy;
  const energy = 0.5 * v2 - GM / r;
  const h = s.x * s.vy - s.y * s.vx;
  const e = Math.sqrt(Math.max(0, 1 + (2 * energy * h * h) / (GM * GM)));
  let a = Infinity;
  let rp = Infinity;
  let ra = Infinity;
  if (energy < -1e-8) {
    a = -GM / (2 * energy);
    rp = a * (1 - e);
    ra = a * (1 + e);
  }
  return { r, e, a, rp, ra, energy, v: Math.sqrt(v2) };
}

function rk4(s, dt) {
  const deriv = (px, py, pvx, pvy) => {
    const r2 = px * px + py * py;
    const r = Math.sqrt(r2);
    const inv = -GM / (r2 * r);
    return [pvx, pvy, inv * px, inv * py];
  };
  const x = s.x;
  const y = s.y;
  const vx = s.vx;
  const vy = s.vy;
  const k1 = deriv(x, y, vx, vy);
  const k2 = deriv(x + k1[0] * dt / 2, y + k1[1] * dt / 2, vx + k1[2] * dt / 2, vy + k1[3] * dt / 2);
  const k3 = deriv(x + k2[0] * dt / 2, y + k2[1] * dt / 2, vx + k2[2] * dt / 2, vy + k2[3] * dt / 2);
  const k4 = deriv(x + k3[0] * dt, y + k3[1] * dt, vx + k3[2] * dt, vy + k3[3] * dt);
  s.x += dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
  s.y += dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
  s.vx += dt / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
  s.vy += dt / 6 * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]);
}

function modeNow() {
  if (pointerMode) return pointerMode;
  if (keys.pro) return 1;
  if (keys.ret) return -1;
  return 0;
}

function step(mode) {
  const s = ship;
  if (s.phase !== "fly") return;
  if (mode && s.fuel > 0) {
    const burnT = Math.min(DT, s.fuel / THRUST);
    const sp = Math.hypot(s.vx, s.vy) || 1;
    const dv = THRUST * burnT * mode;
    s.vx += (s.vx / sp) * dv;
    s.vy += (s.vy / sp) * dv;
    s.fuel -= THRUST * burnT;
  }
  rk4(s, DT);
  const m = metrics(s);
  if (m.r < PLANET) s.phase = "crash";
  else if (m.energy >= 0 && m.r > 3.2) s.phase = "escape";
  else if (!mode && m.energy < 0 && m.e < 0.08 && Math.abs(m.a - R2) < 0.08) {
    s.winHold += DT;
    if (s.winHold >= 1.2) s.phase = "win";
  } else s.winHold = 0;
  stepCount += 1;
  if (stepCount % 4 === 0) {
    trail.push([s.x, s.y]);
    if (trail.length > 480) trail.shift();
  }
}

function statusText(mode, m) {
  if (ship.phase === "win") return "Apsis closed. The orbit is round on the outer line.";
  if (ship.phase === "crash") return "The craft meets the planet.";
  if (ship.phase === "escape") return "The craft leaves the well.";
  if (mode > 0) return "Prograde burn. Fuel falls. Release when the far point meets the green line.";
  if (mode < 0) return "Retrograde burn. Fuel falls.";
  if (m.ra > R2 - 0.05 && m.e >= 0.08) return "Coast to the far point. Then burn prograde until the path is round.";
  return "Coast. Raise the far point to the green line, then round the path.";
}

function draw(mode, m) {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const scale = (w * 0.42) / 2.15;
  const X = (x) => cx + x * scale;
  const Y = (y) => cy - y * scale;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#3a342c";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, R1 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#3f8f6b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, R2 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#2a211c";
  ctx.beginPath();
  ctx.arc(cx, cy, PLANET * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#6b5344";
  ctx.stroke();
  ctx.strokeStyle = "rgba(239,230,214,0.45)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  trail.forEach((p, i) => {
    const px = X(p[0]);
    const py = Y(p[1]);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();
  if (m.e > 0.02 && m.e < 0.98 && Number.isFinite(m.rp)) {
    const evx = ((m.v * m.v) / GM - 1 / m.r) * ship.x - ((ship.x * ship.vx + ship.y * ship.vy) / GM) * ship.vx;
    const evy = ((m.v * m.v) / GM - 1 / m.r) * ship.y - ((ship.x * ship.vx + ship.y * ship.vy) / GM) * ship.vy;
    const em = Math.hypot(evx, evy) || 1;
    const ux = evx / em;
    const uy = evy / em;
    ctx.fillStyle = "#e25b2a";
    ctx.beginPath();
    ctx.arc(X(ux * m.rp), Y(uy * m.rp), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#efe6d6";
    ctx.beginPath();
    ctx.arc(X(-ux * m.ra), Y(-uy * m.ra), 4, 0, Math.PI * 2);
    ctx.fill();
  }
  const ang = Math.atan2(ship.vy, ship.vx);
  const sx = X(ship.x);
  const sy = Y(ship.y);
  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(-ang);
  ctx.fillStyle = "#efe6d6";
  ctx.beginPath();
  ctx.moveTo(11, 0);
  ctx.lineTo(-8, 6);
  ctx.lineTo(-8, -6);
  ctx.closePath();
  ctx.fill();
  if (mode && ship.phase === "fly" && ship.fuel > 0) {
    ctx.strokeStyle = "#e25b2a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(-8 - 16 * mode, 0);
    ctx.stroke();
  }
  ctx.restore();
}

function paint() {
  const mode = ship.phase === "fly" ? modeNow() : 0;
  const m = metrics(ship);
  el.fuel.textContent = ship.fuel.toFixed(2);
  el.dist.textContent = m.r.toFixed(2);
  el.near.textContent = Number.isFinite(m.rp) ? m.rp.toFixed(2) : "open";
  el.far.textContent = Number.isFinite(m.ra) ? m.ra.toFixed(2) : "open";
  el.size.textContent = Number.isFinite(m.a) ? m.a.toFixed(2) : "open";
  el.ecc.textContent = m.e.toFixed(2);
  el.status.textContent = statusText(mode, m);
  el.pro.classList.toggle("hot", mode > 0);
  el.ret.classList.toggle("hot", mode < 0);
  draw(mode, m);
}

function frame(now) {
  const delta = Math.min(0.05, (now - last) / 1000);
  last = now;
  acc += delta;
  let guard = 0;
  const mode = modeNow();
  while (acc >= DT && guard < 10) {
    acc -= DT;
    step(mode);
    guard += 1;
  }
  paint();
  requestAnimationFrame(frame);
}

function hold(button, mode) {
  button.addEventListener("pointerdown", (event) => {
    pointerMode = mode;
    button.setPointerCapture(event.pointerId);
  });
  const release = () => {
    if (pointerMode === mode) pointerMode = 0;
  };
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
}

hold(el.pro, 1);
hold(el.ret, -1);
document.getElementById("reset").addEventListener("click", fresh);

window.addEventListener("keydown", (event) => {
  const k = event.key.toLowerCase();
  if (k === "w" || event.key === "ArrowUp") {
    keys.pro = true;
    event.preventDefault();
  } else if (k === "s" || event.key === "ArrowDown") {
    keys.ret = true;
    event.preventDefault();
  } else if (k === "r") fresh();
});
window.addEventListener("keyup", (event) => {
  const k = event.key.toLowerCase();
  if (k === "w" || event.key === "ArrowUp") keys.pro = false;
  if (k === "s" || event.key === "ArrowDown") keys.ret = false;
});

fresh();
requestAnimationFrame(frame);
