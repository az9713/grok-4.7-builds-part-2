const TICKET = { rise: 90, high: 90, fall: 90, low: 90, base: 50, lift: 30 };
const canvas = document.getElementById("plate");
const ctx = canvas.getContext("2d");

function radius(theta, spec) {
  let a = ((theta % 360) + 360) % 360;
  if (a < spec.rise) {
    const u = spec.rise === 0 ? 0 : a / spec.rise;
    return spec.base + (spec.lift / 2) * (1 - Math.cos(Math.PI * u));
  }
  a -= spec.rise;
  if (a < spec.high) return spec.base + spec.lift;
  a -= spec.high;
  if (a < spec.fall) {
    const u = spec.fall === 0 ? 1 : a / spec.fall;
    return spec.base + (spec.lift / 2) * (1 + Math.cos(Math.PI * u));
  }
  return spec.base;
}

function readSpec() {
  const spec = {};
  for (const id of ["rise", "high", "fall", "low", "base", "lift"]) {
    const n = Number(document.getElementById(id).value);
    if (!Number.isInteger(n)) return null;
    spec[id] = n;
  }
  const angleOk = ["rise", "high", "fall", "low"].every((id) => spec[id] >= 0 && spec[id] <= 360);
  const sizeOk = spec.base >= 30 && spec.base <= 70 && spec.lift >= 0 && spec.lift <= 40;
  if (!angleOk || !sizeOk) return { bad: true };
  return spec;
}

function worst(spec) {
  let gap = 0;
  for (let th = 0; th < 360; th += 15) {
    gap = Math.max(gap, Math.abs(radius(th, spec) - radius(th, TICKET)));
  }
  return gap;
}

function paint() {
  const spec = readSpec();
  const status = document.getElementById("status");
  const scrub = Number(document.getElementById("scrub").value);
  if (!spec) {
    status.textContent = "Use whole numbers.";
    document.getElementById("radius").textContent = "—";
    return;
  }
  if (spec.bad) {
    status.textContent = "Use the ranges on the fields.";
    document.getElementById("radius").textContent = "—";
    return;
  }
  document.getElementById("radius").textContent = radius(scrub, spec).toFixed(1);
  const sum = spec.rise + spec.high + spec.fall + spec.low;
  if (sum !== 360) status.textContent = "The circle is 360 degrees.";
  else {
    const gap = worst(spec);
    if (gap <= 0.05) status.textContent = "The follower matches the ticket.";
    else status.textContent = "The follower misses the ticket by " + gap.toFixed(1) + " mm.";
  }
  draw(spec, scrub);
}

function draw(spec, scrub) {
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const scale = 3.1;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "#3a342c";
  ctx.strokeRect(16, 16, w - 32, h - 32);
  const loop = (source, color, width, dash) => {
    ctx.beginPath();
    for (let a = 0; a <= 360; a += 2) {
      const t = (a - scrub) * Math.PI / 180;
      const r = radius(a, source) * scale;
      const x = cx + Math.sin(t) * r;
      const y = cy - Math.cos(t) * r;
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.setLineDash(dash);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.setLineDash([]);
  };
  loop(TICKET, "#7f9c98", 7, []);
  loop(spec, "#e07a3d", 2, []);
  const nose = radius(scrub, spec) * scale;
  ctx.strokeStyle = "#c8c2b4";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, cy - nose);
  ctx.lineTo(cx, cy - nose - 46);
  ctx.stroke();
  ctx.fillStyle = "#c8c2b4";
  ctx.fillRect(cx - 18, cy - nose - 6, 36, 8);
  ctx.fillStyle = "#8d8678";
  ctx.font = "14px Consolas, monospace";
  ctx.fillText("0", cx - 4, 36);
}

["rise", "high", "fall", "low", "base", "lift", "scrub"].forEach((id) => {
  document.getElementById(id).addEventListener("input", paint);
});
paint();
