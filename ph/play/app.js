const MARK = 5;
const TOL = 0.5;
const canvas = document.getElementById("scale");
const ctx = canvas.getContext("2d");
let exponent = -3;

function phOf(exp) {
  return -Math.log10(Math.pow(10, exp));
}

function paint() {
  const ph = phOf(exponent);
  document.getElementById("c-val").textContent = "1e" + exponent;
  document.getElementById("h-val").textContent = ph.toFixed(0);
  document.getElementById("status").textContent = Math.abs(ph - MARK) <= TOL
    ? "The pH meets the mark."
    : "The pH misses the mark.";
  draw(ph);
}

function xOf(ph) {
  return 70 + (ph - 2) * 80;
}

function ink(ph) {
  if (ph < 4) return "#e05a4a";
  if (ph < 5) return "#e07a3d";
  if (ph < 6) return "#8fb089";
  if (ph < 7) return "#5eb0c8";
  return "#6a78d0";
}

function draw(ph) {
  const axisY = 180;
  const markX = xOf(MARK);
  const x = xOf(ph);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#3c3428";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(70, axisY);
  ctx.lineTo(590, axisY);
  ctx.stroke();
  ctx.strokeStyle = "#8fb089";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(markX, 70);
  ctx.lineTo(markX, 290);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#8fb089";
  ctx.font = "13px Consolas, monospace";
  if (Math.abs(ph - MARK) > 0.05) ctx.fillText("pH 5", markX + 10, 88);
  ctx.fillStyle = ink(ph);
  ctx.beginPath();
  ctx.arc(x, axisY, 16, 0, Math.PI * 2);
  ctx.fill();
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  exponent = Number(button.dataset.e);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
