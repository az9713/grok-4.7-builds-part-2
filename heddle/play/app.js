const WARPS = 8;
const PICKS = 8;
const tie = [0, 0, 0, 0].map(() => [false, false, false, false]);
const ticketTie = [
  [true, false, false, true],
  [true, true, false, false],
  [false, true, true, false],
  [false, false, true, true],
];
const ticketOrder = [0, 1, 2, 3, 0, 1, 2, 3];
let picks = [];

const tieEl = document.getElementById("tie");
const canvas = document.getElementById("cloth");
const ctx = canvas.getContext("2d");
const statusEl = document.getElementById("status");

function up(warp, treadle) {
  return tie[warp % 4][treadle];
}

function ticketUp(warp, pick) {
  const treadle = ticketOrder[pick];
  return ticketTie[warp % 4][treadle];
}

function matches() {
  if (picks.length !== PICKS) return false;
  for (let p = 0; p < PICKS; p += 1) {
    for (let w = 0; w < WARPS; w += 1) {
      if (up(w, picks[p]) !== ticketUp(w, p)) return false;
    }
  }
  return true;
}

function draw() {
  const cell = 40;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p = 0; p < PICKS; p += 1) {
    for (let w = 0; w < WARPS; w += 1) {
      const x = 20 + w * cell;
      const y = 20 + p * cell;
      if (p >= picks.length) {
        ctx.strokeStyle = "#3a322c";
        ctx.strokeRect(x, y, cell - 4, cell - 4);
      } else {
        ctx.fillStyle = up(w, picks[p]) ? "#cbb892" : "#6e2f3c";
        ctx.fillRect(x, y, cell - 4, cell - 4);
      }
    }
  }
}

function paint(message) {
  if (message) statusEl.textContent = message;
  else if (matches()) statusEl.textContent = "The cloth matches the ticket.";
  else if (picks.length === PICKS) statusEl.textContent = "The cloth does not match the ticket.";
  else statusEl.textContent = "Picks on the cloth: " + picks.length + " of 8.";
  draw();
}

for (let s = 0; s < 4; s += 1) {
  for (let t = 0; t < 4; t += 1) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", "Shaft " + (s + 1) + " treadle " + (t + 1));
    btn.dataset.s = String(s);
    btn.dataset.t = String(t);
    btn.addEventListener("click", () => {
      tie[s][t] = !tie[s][t];
      btn.setAttribute("aria-pressed", String(tie[s][t]));
      paint();
    });
    tieEl.appendChild(btn);
  }
}

document.querySelectorAll("[data-treadle]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (picks.length >= PICKS) {
      paint("The cloth holds 8 picks.");
      return;
    }
    picks.push(Number(btn.dataset.treadle));
    paint();
  });
});

document.getElementById("unweave").addEventListener("click", () => {
  picks.pop();
  paint();
});

paint("Tie the shafts, then throw eight picks.");
