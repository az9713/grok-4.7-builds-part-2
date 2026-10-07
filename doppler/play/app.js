const SOUND = 340;
const F0 = 500;
const MARK = 531.25;
const TOL = 0.5;
const canvas = document.getElementById("street");
const ctx = canvas.getContext("2d");

function pitch(vs) {
  return F0 * SOUND / (SOUND - vs);
}

function paint() {
  const vs = Number(document.getElementById("speed").value);
  const heard = pitch(vs);
  document.getElementById("speed-val").textContent = vs + " m/s";
  document.getElementById("pitch").textContent = heard.toFixed(2) + " Hz";
  document.getElementById("ahead").textContent = ((SOUND - vs) / F0).toFixed(2) + " m";
  document.getElementById("behind").textContent = ((SOUND + vs) / F0).toFixed(2) + " m";
  document.getElementById("status").textContent = Math.abs(heard - MARK) <= TOL
    ? "The pitch meets the mark."
    : "The pitch misses the mark.";
  draw(vs);
}

function draw(vs) {
  const w = canvas.width;
  const h = canvas.height;
  const y = h * 0.55;
  const source = 300;
  const listener = 590;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#243038";
  ctx.beginPath();
  ctx.moveTo(36, y + 28);
  ctx.lineTo(w - 36, y + 28);
  ctx.stroke();
  const ahead = ((SOUND - vs) / F0) * 80;
  const behind = ((SOUND + vs) / F0) * 80;
  ctx.strokeStyle = "#7eb6c9";
  ctx.lineWidth = 2;
  for (let x = source + ahead; x < listener - 16; x += ahead) {
    ctx.beginPath();
    ctx.arc(source, y, x - source, -0.7, 0.7);
    ctx.stroke();
  }
  for (let x = source - behind; x > 50; x -= behind) {
    ctx.beginPath();
    ctx.arc(source, y, source - x, Math.PI - 0.7, Math.PI + 0.7);
    ctx.stroke();
  }
  ctx.fillStyle = "#e07a4a";
  ctx.beginPath();
  ctx.arc(source, y, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e4e8ea";
  ctx.fillRect(listener, y - 28, 10, 40);
  ctx.beginPath();
  ctx.arc(listener + 5, y - 36, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8b98a1";
  ctx.font = "14px Consolas, monospace";
  ctx.fillText("source", source - 28, y + 56);
  ctx.fillText("listener", listener - 24, y + 56);
}

document.getElementById("speed").addEventListener("input", paint);
paint();
