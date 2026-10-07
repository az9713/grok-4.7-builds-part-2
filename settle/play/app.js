const VS = 10;
const MARK = 6.32;
const TOL = 0.05;
const canvas = document.getElementById("scope");
const ctx = canvas.getContext("2d");
let ohms = 1000;
let micro = 100;

function voltsAt(t) {
  const tau = ohms * micro * 1e-6;
  return VS * (1 - Math.exp(-t / tau));
}

function paint() {
  const tau = ohms * micro * 1e-6;
  const v = voltsAt(1);
  document.getElementById("tau").textContent = tau.toFixed(2) + " s";
  document.getElementById("volts").textContent = v.toFixed(2);
  document.getElementById("status").textContent = Math.abs(v - MARK) <= TOL
    ? "The node is at the mark."
    : "The node misses the mark.";
  draw();
}

function draw() {
  const w = canvas.width;
  const h = canvas.height;
  const left = 48;
  const right = w - 16;
  const top = 16;
  const bottom = h - 36;
  const xOf = (t) => left + (t / 3) * (right - left);
  const yOf = (v) => bottom - (v / VS) * (bottom - top);
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#3c2e26";
  ctx.strokeRect(left, top, right - left, bottom - top);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(left, yOf(MARK));
  ctx.lineTo(right, yOf(MARK));
  ctx.moveTo(xOf(1), top);
  ctx.lineTo(xOf(1), bottom);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = "#d4845a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 180; i += 1) {
    const t = (i / 180) * 3;
    const x = xOf(t);
    const y = yOf(voltsAt(t));
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = "#a89078";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("0 s", left, h - 14);
  ctx.fillText("3 s", right - 28, h - 14);
  ctx.fillText("10 V", 8, top + 12);
  ctx.fillText("0", 28, bottom);
}

function choose(group, key, value) {
  group.querySelectorAll("button").forEach((btn) => {
    const on = Number(btn.dataset[key]) === value;
    btn.setAttribute("aria-pressed", String(on));
  });
}

document.getElementById("resistors").addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;
  ohms = Number(btn.dataset.r);
  choose(document.getElementById("resistors"), "r", ohms);
  paint();
});

document.getElementById("capacitors").addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;
  micro = Number(btn.dataset.c);
  choose(document.getElementById("capacitors"), "c", micro);
  paint();
});

paint();
