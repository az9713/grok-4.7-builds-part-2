const MARK = 15;
const TOL = 0.5;
const canvas = document.getElementById("posts");
const ctx = canvas.getContext("2d");
let posts = 3;

function links(value) {
  return (value * (value - 1)) / 2;
}

function paint() {
  const count = links(posts);
  document.getElementById("n-val").textContent = posts + " posts";
  document.getElementById("k-val").textContent = count.toFixed(0) + " links";
  document.getElementById("status").textContent = Math.abs(count - MARK) <= TOL
    ? "The mesh meets the mark."
    : "The mesh misses the mark.";
  draw(count);
}

function draw(count) {
  const barX = 520;
  const barBottom = 350;
  const barH = 260;
  const barW = 28;
  const fillH = (count / 28) * barH;
  const markH = (MARK / 28) * barH;
  const cx = 150;
  const cy = 190;
  const radius = 72;
  const points = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < posts; i++) {
    const theta = -Math.PI / 2 + (i * 2 * Math.PI) / posts;
    points.push([cx + radius * Math.cos(theta), cy + radius * Math.sin(theta)]);
  }
  ctx.strokeStyle = "#c090e8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < posts; i++) {
    for (let j = i + 1; j < posts; j++) {
      ctx.moveTo(points[i][0], points[i][1]);
      ctx.lineTo(points[j][0], points[j][1]);
    }
  }
  ctx.stroke();
  ctx.fillStyle = "#f4eef8";
  for (const point of points) {
    ctx.beginPath();
    ctx.arc(point[0], point[1], 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#342838";
  ctx.strokeRect(barX, barBottom - barH, barW, barH);
  ctx.fillStyle = "#c090e8";
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
    ctx.fillText("15 links", barX + barW + 18, barBottom - markH + 4);
  }
}

document.getElementById("bin").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  posts = Number(button.dataset.n);
  for (const el of document.querySelectorAll("#bin button")) {
    el.setAttribute("aria-pressed", el === button ? "true" : "false");
  }
  paint();
});

paint();
