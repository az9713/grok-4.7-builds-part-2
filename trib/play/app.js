const MARK = 31;
const TOL = 0.5;
const canvas = document.getElementById("sum3");
const ctx = canvas.getContext("2d");
let step = 6;

function trib(value) {
  if (value < 4) return 1;
  let first = 1;
  let second = 1;
  let third = 1;
  for (let i = 4; i <= value; i++) {
    const next = first + second + third;
    first = second;
    second = third;
    third = next;
  }
  return third;
}

function paint() {
  const count = trib(step);
  document.getElementById("n-val").textContent = "Term " + step;
  document.getElementById("t-val").textContent = count.toFixed(0);
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The trib meets the mark."
    : "The trib misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 105) * barH;
  const markH = (MARK / 105) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#a090c8";
  for (let i = 0; i < step; i++) ctx.fillRect(36 + i * 26, 64, 20, 20);
  ctx.strokeStyle = "#a090c8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 220);
  ctx.lineTo(96, 220);
  ctx.moveTo(48, 248);
  ctx.lineTo(144, 248);
  ctx.moveTo(48, 276);
  ctx.lineTo(192, 276);
  ctx.stroke();
  ctx.strokeStyle = "#2c2c40";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#a090c8";
  ctx.fillRect(barX, barBottom - fillH, barW, fillH);
  ctx.strokeStyle = "#8fb089";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(barX - 16, barBottom - markH);
  ctx.lineTo(barX + barW + 16, barBottom - markH);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  if (Math.abs(count - MARK) > TOL) ctx.fillText("trib 31", barX + barW + 18, barBottom - markH + 4);
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  step = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
