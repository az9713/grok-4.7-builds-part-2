const MARK = 40;
const TOL = 0.2;
const canvas = document.getElementById("strut");
const ctx = canvas.getContext("2d");
let cm = 2;

function newtons(length) {
  return 1000 / (length * length);
}

function paint() {
  const load = newtons(cm);
  document.getElementById("l-val").textContent = cm + " cm";
  document.getElementById("p-val").textContent = load.toFixed(1) + " N";
  document.getElementById("status").textContent = Math.abs(load - MARK) <= TOL
    ? "The load meets the mark."
    : "The load misses the mark.";
  draw(load);
}

function draw(load) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (load / 300) * barH;
  const markH = (MARK / 300) * barH;
  const top = 70;
  const height = 50 + cm * 22;
  const bow = (cm - 2) * 6;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#3c3428";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(90, top + height);
  ctx.lineTo(230, top + height);
  ctx.stroke();
  ctx.strokeStyle = "#e0a15f";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(150, top);
  ctx.quadraticCurveTo(150 + bow, top + height / 2, 150, top + height);
  ctx.stroke();
  ctx.strokeStyle = "#3c3428";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#e0a15f";
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
  if (Math.abs(load - MARK) > 0.2) {
    ctx.fillText("40.0 N", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  cm = Number(button.dataset.l);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
