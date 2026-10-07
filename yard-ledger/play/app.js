const canvas = document.getElementById("iso");
const ctx = canvas.getContext("2d");
const logEl = document.getElementById("log");
const crashEl = document.getElementById("crash");

const loco = new Image(); loco.src = "art/locomotive.jpg";
const box = new Image(); box.src = "art/boxcar.jpg";
const tank = new Image(); tank.src = "art/tanker.jpg";
const track = new Image(); track.src = "art/track.jpg";

const TILE = 56;
function iso(i, j) {
  return { x: 420 + (i - j) * TILE, y: 80 + (i + j) * (TILE * 0.5) };
}

// SW0 sends Ash 4 down the siding. SW1 sends Brick 12 off the main before M3.
const cells = [];
for (let i = 0; i < 8; i++) cells.push({ i, j: 3, id: `M${i}` });
for (let i = 3; i < 8; i++) cells.push({ i, j: 1, id: `S${i}` });

const switches = [
  { id: 0, i: 2, j: 3, thrown: false },
  { id: 1, i: 5, j: 3, thrown: false },
];

function pathFor(train) {
  const main = cells.filter((c) => c.j === 3).sort((a, b) => a.i - b.i);
  const side = cells.filter((c) => c.j === 1).sort((a, b) => a.i - b.i);
  if (train.line === "siding" && switches[0].thrown) {
    return [...main.filter((c) => c.i < 3), ...side];
  }
  if (train.line === "main" && switches[1].thrown) {
    // M3 is where the two heads meet. Leave the main at column 2.
    // S3 and S4 connect that ladder to the east spur (columns 5 to 7).
    const approach = side.filter((c) => c.i < 5);
    const spur = side.filter((c) => c.i >= 5);
    return [...main.filter((c) => c.i < 3), ...approach, ...spur];
  }
  return main;
}

const trains = [
  { name: "Brick 12", line: "main", at: 0, dir: 1, sprite: loco, cars: [box] },
  { name: "Ash 4", line: "siding", at: 6, dir: -1, sprite: tank, cars: [] },
];

let paused = false;
let tickN = 0;

function occupy() {
  const map = new Map();
  const crashes = [];
  trains.forEach((t) => {
    const path = pathFor(t);
    const cell = path[Math.max(0, Math.min(path.length - 1, t.at))];
    if (!cell) return;
    const k = cell.id;
    if (map.has(k)) crashes.push(k);
    map.set(k, t.name);
  });
  return { map, crashes };
}

function step() {
  if (paused) return;
  trains.forEach((t) => {
    const path = pathFor(t);
    t.at += t.dir;
    if (t.at >= path.length - 1) t.dir = -1;
    if (t.at <= 0) t.dir = 1;
  });
  tickN += 1;
  const { crashes } = occupy();
  const line = document.createElement("li");
  line.textContent = `t${tickN}  ${trains.map((t) => t.name + "@" + t.at).join("  ")}`;
  logEl.prepend(line);
  if (crashes.length) {
    crashEl.textContent = "Occupancy clash on " + crashes.join(", ");
    crashEl.className = "bad";
    paused = true;
  } else {
    crashEl.textContent = "Clear.";
    crashEl.className = "ok";
  }
}

function draw() {
  ctx.fillStyle = "#2a3d30";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  cells.forEach((c) => {
    const p = iso(c.i, c.j);
    if (track.complete) ctx.drawImage(track, p.x - 40, p.y - 10, 88, 88);
    ctx.fillStyle = "#d7c48a";
    ctx.font = "10px ui-monospace";
    ctx.fillText(c.id, p.x - 10, p.y + 40);
  });
  switches.forEach((s) => {
    const p = iso(s.i, s.j);
    ctx.fillStyle = s.thrown ? "#c4a36a" : "#9a3b24";
    ctx.beginPath(); ctx.arc(p.x, p.y + 8, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#e7e1c8";
    ctx.fillText("SW" + s.id, p.x - 12, p.y - 8);
  });
  const { map, crashes } = occupy();
  trains.forEach((t) => {
    const path = pathFor(t);
    const cell = path[Math.max(0, Math.min(path.length - 1, t.at))];
    if (!cell) return;
    const p = iso(cell.i, cell.j);
    const hit = crashes.includes(cell.id);
    if (hit) {
      ctx.fillStyle = "rgba(180,40,30,0.45)";
      ctx.fillRect(p.x - 42, p.y - 20, 90, 70);
    }
    if (t.sprite.complete) ctx.drawImage(t.sprite, p.x - 48, p.y - 36, 96, 96);
    t.cars.forEach((car, n) => {
      const behind = t.at - t.dir * (n + 1);
      if (behind < 0 || behind >= path.length) return;
      const cellB = path[behind];
      const bp = iso(cellB.i, cellB.j);
      if (car.complete) ctx.drawImage(car, bp.x - 48, bp.y - 36, 96, 96);
    });
  });
  requestAnimationFrame(draw);
}

canvas.addEventListener("click", (e) => {
  const r = canvas.getBoundingClientRect();
  const x = (e.clientX - r.left) * (canvas.width / r.width);
  const y = (e.clientY - r.top) * (canvas.height / r.height);
  switches.forEach((s) => {
    const p = iso(s.i, s.j);
    if (Math.hypot(x - p.x, y - (p.y + 8)) < 18) s.thrown = !s.thrown;
  });
});
addEventListener("keydown", (e) => { if (e.code === "Space") { e.preventDefault(); paused = !paused; } });
document.getElementById("reset").onclick = () => {
  trains[0].at = 0; trains[0].dir = 1; trains[1].at = 6; trains[1].dir = -1;
  paused = false; crashEl.textContent = "Clear."; crashEl.className = "ok";
};
setInterval(step, 900);
draw();
