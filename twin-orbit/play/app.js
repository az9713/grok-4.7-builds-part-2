const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");

const keys = new Set();
addEventListener("keydown", (e) => { keys.add(e.key.toLowerCase()); if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(e.key.toLowerCase())) e.preventDefault(); });
addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));

const img = (src) => { const i = new Image(); i.src = src; return i; };
const pilot = img("art/pilot.jpg");
const mechanic = img("art/mechanic.jpg");
const MAGENTA = [255, 0, 170];

const ledges = [
  { x: 40, y: 390, w: 340, h: 24 },
  { x: 580, y: 390, w: 340, h: 24 },
];
const socket = { x: 820, y: 350, w: 48, h: 40 };

function actor(x, front) {
  return { x, y: 250, w: 72, h: 96, vx: 0, vy: 0, on: false, img: front, hold: false };
}
const A = actor(80, pilot);
const B = actor(700, mechanic);
const battery = { x: 200, y: 360, w: 28, h: 18, vx: 0, vy: 0, air: false, home: null };
let won = false;

function grounded(p) {
  for (const L of ledges) {
    if (p.x + p.w > L.x && p.x < L.x + L.w && p.y + p.h <= L.y + 8 && p.y + p.h + p.vy >= L.y) {
      p.y = L.y - p.h; p.vy = 0; p.on = true; return;
    }
  }
  p.on = false;
}

function drive(p, left, right, jump, pick, throwKey) {
  const speed = 3.2;
  p.vx = 0;
  if (keys.has(left)) p.vx = -speed;
  if (keys.has(right)) p.vx = speed;
  if (keys.has(jump) && p.on) p.vy = -9.2;
  p.vy += 0.42;
  p.x += p.vx; p.y += p.vy;
  p.x = Math.max(0, Math.min(960 - p.w, p.x));
  if (p.y > 600) { p.y = 250; p.vy = 0; p.x = p === A ? 80 : 700; }
  grounded(p);
  const near = Math.hypot(p.x + p.w / 2 - (battery.x + 14), p.y + p.h / 2 - (battery.y + 9)) < 70;
  if (keys.has(pick) && near && !battery.home) {
    battery.home = p; p.hold = true; battery.air = false;
  }
  if (keys.has(throwKey) && battery.home === p) {
    battery.home = null; p.hold = false; battery.air = true;
    battery.vx = (p === A ? 6 : -6); battery.vy = -7;
  }
}

function tickBattery() {
  if (battery.home) {
    battery.x = battery.home.x + battery.home.w / 2 - 14;
    battery.y = battery.home.y + 28;
    return;
  }
  if (battery.air) {
    battery.vy += 0.4;
    battery.x += battery.vx; battery.y += battery.vy;
  }
  for (const L of ledges) {
    if (battery.x + 28 > L.x && battery.x < L.x + L.w && battery.y + 18 >= L.y && battery.y + 18 <= L.y + 18) {
      battery.y = L.y - 18; battery.vy = 0; battery.vx = 0; battery.air = false;
    }
  }
  if (battery.x + 28 > socket.x && battery.x < socket.x + socket.w && battery.y + 18 > socket.y && !battery.home) {
    won = true;
    battery.x = socket.x + 10; battery.y = socket.y + 8; battery.air = false; battery.vx = 0;
  }
}

function blit(image, x, y, w, h) {
  if (!image.complete || !image.naturalWidth) return;
  ctx.drawImage(image, x, y, w, h);
}

function loop() {
  if (!won) {
    drive(A, "a", "d", "w", "e", "f");
    drive(B, "arrowleft", "arrowright", "arrowup", ".", "/");
    tickBattery();
  }
  ctx.fillStyle = "#ff00aa";
  ctx.fillRect(0, 0, 960, 540);
  ctx.fillStyle = "#2a1220";
  ledges.forEach((L) => ctx.fillRect(L.x, L.y, L.w, L.h));
  ctx.fillStyle = won ? "#3ad7c8" : "#7ddcb0";
  ctx.fillRect(socket.x, socket.y, socket.w, socket.h);
  ctx.fillStyle = "#f4f0c8";
  ctx.font = "11px ui-monospace, monospace";
  ctx.fillText("SOCKET", socket.x + 4, socket.y - 6);
  blit(A.img, A.x, A.y, A.w, A.h);
  blit(B.img, B.x, B.y, B.w, B.h);
  ctx.fillStyle = "#f0d24a";
  ctx.fillRect(battery.x, battery.y, battery.w, battery.h);
  ctx.strokeStyle = "#1a0812";
  ctx.strokeRect(battery.x, battery.y, battery.w, battery.h);
  statusEl.textContent = won
    ? "Orbit locked. The cell is seated. Reload to hand it again."
    : "Get the battery into the socket on the right ledge.";
  requestAnimationFrame(loop);
}
loop();
