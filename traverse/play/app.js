const MARK = { x: 5, y: 3 };
const POND = { x: 2.5, y: 0, r: 0.9 };
const WIN = 0.45;
const canvas = document.getElementById("plot");
const ctx = canvas.getContext("2d");
let legs = [];

function endPoint(list) {
  let x = 0;
  let y = 0;
  const pts = [{ x: 0, y: 0 }];
  list.forEach((leg) => {
    const b = leg.bearing * Math.PI / 180;
    x += leg.distance * Math.sin(b);
    y += leg.distance * Math.cos(b);
    pts.push({ x, y });
  });
  return pts;
}

function hits(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const fx = a.x - POND.x;
  const fy = a.y - POND.y;
  const A = dx * dx + dy * dy;
  const B = 2 * (fx * dx + fy * dy);
  const C = fx * fx + fy * fy - POND.r * POND.r;
  const disc = B * B - 4 * A * C;
  if (disc < 0 || A === 0) return false;
  const s = Math.sqrt(disc);
  return [(-B - s) / (2 * A), (-B + s) / (2 * A)].some((t) => t >= 0 && t <= 1);
}

function ponded(pts) {
  return pts.some((p, i) => i > 0 && hits(pts[i - 1], p));
}

function draw(pts, bad) {
  const w = canvas.width;
  const h = canvas.height;
  const scale = 68;
  const X = (x) => 70 + x * scale;
  const Y = (y) => h - 96 - y * scale;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#3c4a30";
  ctx.strokeRect(24, 24, w - 48, h - 48);
  ctx.fillStyle = "#1d4e5f";
  ctx.beginPath();
  ctx.arc(X(POND.x), Y(POND.y), POND.r * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = bad ? "#d35a3e" : "#e6c36a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  pts.forEach((p, i) => {
    if (i === 0) ctx.moveTo(X(p.x), Y(p.y));
    else ctx.lineTo(X(p.x), Y(p.y));
  });
  ctx.stroke();
  ctx.fillStyle = "#e4ecd4";
  ctx.beginPath();
  ctx.arc(X(0), Y(0), 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d35a3e";
  ctx.beginPath();
  ctx.moveTo(X(MARK.x), Y(MARK.y) - 16);
  ctx.lineTo(X(MARK.x), Y(MARK.y) + 8);
  ctx.strokeStyle = "#d35a3e";
  ctx.stroke();
  ctx.fillRect(X(MARK.x), Y(MARK.y) - 16, 12, 8);
  ctx.fillStyle = "#9aa58a";
  ctx.font = "14px Consolas, monospace";
  ctx.fillText("N", X(0) - 6, 46);
}

function paint() {
  const pts = endPoint(legs);
  const bad = ponded(pts);
  const tip = pts[pts.length - 1];
  const miss = Math.hypot(tip.x - MARK.x, tip.y - MARK.y);
  const status = document.getElementById("status");
  if (!legs.length) status.textContent = "The mark is open. The pond blocks a straight east chain.";
  else if (bad) status.textContent = "The chain meets the pond.";
  else if (miss <= WIN) status.textContent = "The chain closes on the mark.";
  else status.textContent = "The free end misses the mark by " + miss.toFixed(2) + ".";
  document.getElementById("legs").textContent = legs.length
    ? legs.map((leg, i) => (i + 1) + ". " + leg.bearing + "° / " + leg.distance).join("  ")
    : "No legs yet.";
  draw(pts, bad);
}

document.getElementById("add").addEventListener("click", () => {
  if (legs.length >= 4) {
    document.getElementById("status").textContent = "The chain allows 4 legs.";
    return;
  }
  const bearing = Number(document.getElementById("bearing").value);
  const distance = Number(document.getElementById("distance").value);
  if (!Number.isInteger(bearing) || bearing < 0 || bearing > 359) return;
  if (!Number.isInteger(distance) || distance < 1 || distance > 8) return;
  legs.push({ bearing, distance });
  paint();
});
document.getElementById("undo").addEventListener("click", () => {
  legs.pop();
  paint();
});
document.getElementById("clear").addEventListener("click", () => {
  legs = [];
  paint();
});
paint();
