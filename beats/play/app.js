const F1 = 440;
const MARK = 4;
const TOL = 0.5;
const SPAN = 0.5;
const canvas = document.getElementById("scope");
const ctx = canvas.getContext("2d");
let f2 = 442;

function beatHz(freq) {
  return Math.abs(freq - F1);
}

function paint() {
  const beat = beatHz(f2);
  document.getElementById("f-val").textContent = f2 + " Hz";
  document.getElementById("beat-val").textContent = beat + " Hz";
  document.getElementById("status").textContent = Math.abs(beat - MARK) <= TOL
    ? "The beat meets the mark."
    : "The beat misses the mark.";
  draw(beat);
}

function draw(beat) {
  const w = canvas.width;
  const h = canvas.height;
  const left = 48;
  const right = w - 28;
  const mid = 168;
  const amp = 100;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#322c3c";
  ctx.beginPath();
  ctx.moveTo(left, 36);
  ctx.lineTo(left, h - 36);
  ctx.lineTo(right, h - 36);
  ctx.stroke();
  ctx.strokeStyle = "#e6c36a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 240; i++) {
    const t = SPAN * i / 240;
    const x = left + (right - left) * t / SPAN;
    const y = mid - amp * Math.abs(Math.cos(Math.PI * beat * t));
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = "#9a90a8";
  ctx.font = "13px Consolas, monospace";
  ctx.fillText("0 s", left - 8, h - 16);
  ctx.fillText("0.50 s", right - 48, h - 16);
  ctx.fillText(beat + " Hz", left + 8, 28);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  f2 = Number(button.dataset.f);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});
paint();
