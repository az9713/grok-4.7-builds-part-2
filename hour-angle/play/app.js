const canvas = document.getElementById("court");
const ctx = canvas.getContext("2d");

function solar(lat, day, hour) {
  const decl = 23.44 * Math.sin((Math.PI / 180) * (360 * (284 + day) / 365));
  const H = 15 * (hour - 12);
  const la = lat * Math.PI / 180;
  const d = decl * Math.PI / 180;
  const h = H * Math.PI / 180;
  let s = Math.sin(la) * Math.sin(d) + Math.cos(la) * Math.cos(d) * Math.cos(h);
  s = Math.max(-1, Math.min(1, s));
  const alt = Math.asin(s) * 180 / Math.PI;
  const y = Math.sin(h);
  const x = Math.cos(h) * Math.sin(la) - Math.tan(d) * Math.cos(la);
  const az = Math.atan2(y, x) * 180 / Math.PI;
  return { decl, alt, az };
}

function draw(sun, length) {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#4a4338";
  ctx.strokeRect(36, 36, w - 72, h - 72);
  ctx.fillStyle = "#b3a894";
  ctx.font = "16px Consolas, monospace";
  ctx.fillText("N", cx - 6, 28);
  ctx.fillStyle = "#efe6d4";
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fill();
  if (sun.alt <= 0) return;
  const az = sun.alt > 89 ? 0 : sun.az * Math.PI / 180;
  const len = Math.min(220, (length || 0) * 70);
  ctx.strokeStyle = "#0e0d0c";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.sin(az) * len, cy - Math.cos(az) * len);
  ctx.stroke();
  const reach = 250;
  ctx.fillStyle = "#e6b15a";
  ctx.beginPath();
  ctx.arc(cx - Math.sin(az) * reach * 0.55, cy + Math.cos(az) * reach * 0.55, 10, 0, Math.PI * 2);
  ctx.fill();
}

function deg1(n) {
  const text = n.toFixed(1);
  return text === "-0.0" ? "0.0" : text;
}

function paint() {
  const lat = Number(document.getElementById("lat").value);
  const day = Number(document.getElementById("day").value);
  const hour = Number(document.getElementById("hour").value);
  const sun = solar(lat, day, hour);
  document.getElementById("lat-val").textContent = lat.toFixed(1) + "°";
  document.getElementById("day-val").textContent = String(day);
  document.getElementById("hour-val").textContent = hour.toFixed(1);
  document.getElementById("decl").textContent = deg1(sun.decl) + "°";
  document.getElementById("alt").textContent = deg1(sun.alt) + "°";
  document.getElementById("az").textContent = deg1(sun.az) + "°";
  const status = document.getElementById("status");
  let length = null;
  if (sun.alt <= 0) {
    document.getElementById("shadow").textContent = "none";
    status.textContent = "The sun is below the horizon.";
  } else if (sun.alt > 89) {
    document.getElementById("shadow").textContent = "0.00";
    status.textContent = "The sun is overhead. The shadow has no length.";
  } else {
    length = 1 / Math.tan(sun.alt * Math.PI / 180);
    document.getElementById("shadow").textContent = length.toFixed(2);
    status.textContent = "The shadow is " + length.toFixed(2) + " gnomon heights.";
  }
  draw(sun, length);
}

["lat", "day", "hour"].forEach((id) => document.getElementById(id).addEventListener("input", paint));
paint();
