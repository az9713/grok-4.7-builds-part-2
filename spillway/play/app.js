const COLS = 16;
const ROWS = 10;
const base = [];
const stone = [];
for (let r = 0; r < ROWS; r += 1) {
  base[r] = [];
  stone[r] = [];
  for (let c = 0; c < COLS; c += 1) {
    base[r][c] = 9 - r;
    stone[r][c] = false;
  }
}
for (let r = 1; r < ROWS; r += 1) {
  base[r][7] = 12;
  stone[r][7] = true;
}
for (let r = 0; r < ROWS; r += 1) {
  for (let c = 8; c < COLS; c += 1) {
    if (!stone[r][c]) base[r][c] = Math.max(0, 9 - r - 1);
  }
}

let height = base.map((row) => row.slice());
let water = base.map((row) => row.map(() => 0));
let moves = 18;
let tool = 1;
let running = false;
let timer = 0;
let archive = 0;
let cistern = 0;
let tick = 0;

const yard = document.getElementById("yard");
const statusEl = document.getElementById("status");
const movesEl = document.getElementById("moves");
const cisternEl = document.getElementById("cistern");
const archiveEl = document.getElementById("archive");
const buttons = [];

function isArchive(c, r) { return r === 9 && c < 7; }
function isCistern(c, r) { return r === 9 && c >= 8; }

function shade(h, w) {
  const ground = 28 + h * 12;
  const wet = Math.min(1, w / 1.2);
  const g = Math.round(ground * (1 - wet) + 61 * wet);
  const b = Math.round(ground * (1 - wet) + 170 * wet);
  const rd = Math.round(ground * (1 - wet) + 40 * wet);
  return `rgb(${rd}, ${g}, ${b})`;
}

function paint() {
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const btn = buttons[r][c];
      btn.style.background = stone[r][c] ? "#3a3f36" : shade(height[r][c], water[r][c]);
      btn.style.color = stone[r][c] || height[r][c] <= 3 || water[r][c] > 0.35 ? "#f2f6f1" : "#121614";
      btn.textContent = stone[r][c] ? "" : String(height[r][c]);
    }
  }
  movesEl.textContent = "Moves left: " + moves;
  cisternEl.textContent = "Cistern " + cistern.toFixed(1);
  archiveEl.textContent = "Archive " + archive.toFixed(1);
}

function build() {
  for (let r = 0; r < ROWS; r += 1) {
    buttons[r] = [];
    for (let c = 0; c < COLS; c += 1) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cell";
      if (stone[r][c]) btn.classList.add("stone");
      if (isArchive(c, r)) btn.classList.add("archive");
      if (isCistern(c, r)) btn.classList.add("cistern");
      if (c === 3 && r === 0) btn.classList.add("inlet");
      const label = stone[r][c]
        ? "Ridge"
        : "Tile column " + (c + 1) + " row " + (r + 1) + ", height " + height[r][c];
      btn.setAttribute("aria-label", label);
      btn.disabled = stone[r][c];
      btn.addEventListener("click", () => edit(c, r));
      yard.appendChild(btn);
      buttons[r][c] = btn;
    }
  }
  paint();
}

function edit(c, r) {
  if (running || stone[r][c] || moves <= 0) return;
  const next = height[r][c] + tool;
  if (next < 0 || next > 12 || next === height[r][c]) return;
  height[r][c] = next;
  moves -= 1;
  statusEl.textContent = tool > 0 ? "Tile raised." : "Tile lowered.";
  paint();
}

function clearWater() {
  water = base.map((row) => row.map(() => 0));
  archive = 0;
  cistern = 0;
  tick = 0;
}

function flowTick() {
  if (tick < 24) water[0][3] += 0.3;
  const nxt = water.map((row) => row.map(() => 0));
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const w = water[r][c];
      if (w <= 0) continue;
      if (isArchive(c, r)) { archive += w; continue; }
      if (isCistern(c, r)) { cistern += w; continue; }
      const surface = height[r][c] + w;
      let best = null;
      let bestS = surface;
      const strict = [[0, 1], [1, 0], [-1, 0], [0, -1]];
      for (const [dc, dr] of strict) {
        const nc = c + dc;
        const nr = r + dr;
        if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS) continue;
        const s = height[nr][nc] + water[nr][nc];
        if (s < bestS - 1e-9) { bestS = s; best = [nc, nr]; }
      }
      if (!best) {
        const flat = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [dc, dr] of flat) {
          const nc = c + dc;
          const nr = r + dr;
          if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS) continue;
          const s = height[nr][nc] + water[nr][nc];
          if (Math.abs(s - surface) <= 1e-9) { best = [nc, nr]; break; }
        }
      }
      if (!best) nxt[r][c] += w;
      else {
        const move = Math.min(w, 0.7);
        nxt[r][c] += w - move;
        nxt[best[1]][best[0]] += move;
      }
    }
  }
  water = nxt;
  tick += 1;
  paint();
  if (tick >= 94) finish();
}

function finish() {
  clearInterval(timer);
  running = false;
  document.getElementById("sky").disabled = false;
  if (cistern >= 6 && archive < 0.5) statusEl.textContent = "The cistern holds the spill.";
  else if (archive >= 0.5) statusEl.textContent = "Water is in the archive.";
  else statusEl.textContent = "The water sits on the roof.";
}

function openSky() {
  if (running) return;
  clearWater();
  running = true;
  document.getElementById("sky").disabled = true;
  statusEl.textContent = "Rain is on the roof.";
  timer = setInterval(flowTick, 70);
}

function setTool(next) {
  tool = next;
  document.getElementById("raise").setAttribute("aria-pressed", String(next === 1));
  document.getElementById("lower").setAttribute("aria-pressed", String(next === -1));
}

document.getElementById("raise").addEventListener("click", () => setTool(1));
document.getElementById("lower").addEventListener("click", () => setTool(-1));
document.getElementById("sky").addEventListener("click", openSky);
document.getElementById("dry").addEventListener("click", () => {
  if (running) return;
  clearWater();
  paint();
  statusEl.textContent = "The roof is dry. The tiles stay as you set them.";
});
document.getElementById("restore").addEventListener("click", () => {
  if (running) { clearInterval(timer); running = false; document.getElementById("sky").disabled = false; }
  height = base.map((row) => row.slice());
  moves = 18;
  clearWater();
  paint();
  statusEl.textContent = "The yard is restored. Moves left: 18.";
});

build();
