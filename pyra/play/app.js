const MARK = 55;
const TOL = 0.5;
const canvas = document.getElementById("stack");
const ctx = canvas.getContext("2d");
let layers = 2;

function balls(value) {
  return (value * (value + 1) * (2 * value + 1)) / 6;
}

function paint() {
  const count = balls(layers);
  document.getElementById("n-val").textContent = layers + " layers";
  document.getElementById("b-val").textContent = count.toFixed(0) + " balls";
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The stack meets the mark."
    : "The stack misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 91) * barH;
  const markH = (MARK / 91) * barH;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#c0d070";
  let y = 36;
  for (let row = 1; row <= layers; row++) {
    const x0 = 150 - ((row - 1) * 10) / 2;
    for (let gx = 0; gx < row; gx++) {
      for (let gy = 0; gy < row; gy++) {
        ctx.fillRect(x0 + gx * 10, y + gy * 10, 8, 8);
      }
    }
    y += row * 10 + 8;
  }
  ctx.strokeStyle = "#3c4020";
  ctx.lineWidth = 2;
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#c0d070";
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
  if (Math.abs(count - MARK) > TOL) {
    ctx.fillText("55 balls", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  layers = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
