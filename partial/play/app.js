const ratios = [1, 2, 3, 5];
const amps = [0.55, 0.28, 0.16, 0.1];
const gesture = new Float32Array(128);
gesture.fill(0.7);
let fund = 220;
let audio = null;
let master = null;
let oscs = [];
let gains = [];
let sounding = false;
let playhead = 0;
let last = performance.now();

const scope = document.getElementById("scope");
const stringEl = document.getElementById("string");
const sctx = scope.getContext("2d");
const gctx = stringEl.getContext("2d");
const statusEl = document.getElementById("status");
const rows = document.getElementById("rows");

function gestureAt(index) {
  const i = Math.floor(Number(index) || 0);
  const v = gesture[((i % 128) + 128) % 128];
  return Number.isFinite(v) ? v : 0;
}

function drawScope() {
  const w = scope.width;
  const h = scope.height;
  const g = gestureAt(playhead);
  sctx.fillStyle = "#120c08";
  sctx.fillRect(0, 0, w, h);
  sctx.lineWidth = 1;
  for (let p = 0; p < 4; p += 1) {
    sctx.strokeStyle = "rgba(255,178,90,0.25)";
    sctx.beginPath();
    for (let x = 0; x < w; x += 1) {
      const t = (x / w) * Math.PI * 2;
      const y = h / 2 - Math.sin(t * ratios[p]) * amps[p] * g * (h * 0.38);
      if (x === 0) sctx.moveTo(x, y);
      else sctx.lineTo(x, y);
    }
    sctx.stroke();
  }
  sctx.strokeStyle = "#ffb25a";
  sctx.lineWidth = 2;
  sctx.beginPath();
  for (let x = 0; x < w; x += 1) {
    const t = (x / w) * Math.PI * 2;
    let sum = 0;
    for (let p = 0; p < 4; p += 1) sum += Math.sin(t * ratios[p]) * amps[p];
    const y = h / 2 - sum * g * (h * 0.38);
    if (x === 0) sctx.moveTo(x, y);
    else sctx.lineTo(x, y);
  }
  sctx.stroke();
}

function drawString() {
  const w = stringEl.width;
  const h = stringEl.height;
  gctx.fillStyle = "#24160e";
  gctx.fillRect(0, 0, w, h);
  gctx.strokeStyle = "#c4a574";
  gctx.lineWidth = 2;
  gctx.beginPath();
  for (let i = 0; i < gesture.length; i += 1) {
    const x = (i / (gesture.length - 1)) * w;
    const y = h - 8 - gesture[i] * (h - 16);
    if (i === 0) gctx.moveTo(x, y);
    else gctx.lineTo(x, y);
  }
  gctx.stroke();
  const px = (playhead / 128) * w;
  gctx.strokeStyle = "#ffb25a";
  gctx.beginPath();
  gctx.moveTo(px, 0);
  gctx.lineTo(px, h);
  gctx.stroke();
}

function applyAudio() {
  if (!audio || !sounding) return;
  const gnow = gestureAt(playhead);
  master.gain.setTargetAtTime(0.18, audio.currentTime, 0.03);
  for (let i = 0; i < 4; i += 1) {
    const freq = fund * ratios[i];
    const level = amps[i] * gnow;
    if (Number.isFinite(freq)) oscs[i].frequency.setTargetAtTime(freq, audio.currentTime, 0.02);
    if (Number.isFinite(level)) gains[i].gain.setTargetAtTime(level, audio.currentTime, 0.03);
  }
}

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (sounding) playhead = (playhead + (dt / 2) * 128) % 128;
  drawScope();
  drawString();
  applyAudio();
  requestAnimationFrame(frame);
}

function buildRows() {
  for (let i = 0; i < 4; i += 1) {
    const row = document.createElement("div");
    row.className = "row";
    const name = document.createElement("span");
    name.textContent = "Partial " + (i + 1);
    const ratioBox = document.createElement("span");
    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Lower partial " + (i + 1) + " ratio");
    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Raise partial " + (i + 1) + " ratio");
    const read = document.createElement("span");
    const show = () => { read.textContent = "×" + ratios[i]; };
    minus.addEventListener("click", () => {
      ratios[i] = Math.max(1, ratios[i] - 1);
      show();
      applyAudio();
    });
    plus.addEventListener("click", () => {
      ratios[i] = Math.min(9, ratios[i] + 1);
      show();
      applyAudio();
    });
    show();
    ratioBox.append(minus, read, plus);
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "1";
    slider.step = "0.01";
    slider.value = String(amps[i]);
    slider.setAttribute("aria-label", "Partial " + (i + 1) + " height");
    const ampRead = document.createElement("span");
    ampRead.textContent = amps[i].toFixed(2);
    slider.addEventListener("input", () => {
      amps[i] = Number(slider.value);
      ampRead.textContent = amps[i].toFixed(2);
      applyAudio();
    });
    row.append(name, ratioBox, slider, ampRead);
    rows.appendChild(row);
  }
}

async function sound() {
  try {
    if (!audio) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) throw new Error("no-audio");
      audio = new Ctx();
      master = audio.createGain();
      master.gain.value = 0;
      master.connect(audio.destination);
      for (let i = 0; i < 4; i += 1) {
        const osc = audio.createOscillator();
        osc.type = "sine";
        osc.frequency.value = fund * ratios[i];
        const gain = audio.createGain();
        gain.gain.value = 0;
        osc.connect(gain);
        gain.connect(master);
        osc.start();
        oscs.push(osc);
        gains.push(gain);
      }
    }
    await audio.resume();
    if (audio.state !== "running") throw new Error("suspended");
    sounding = true;
    statusEl.textContent = "The partials are sounding. Drag the string to change the loudness.";
    applyAudio();
  } catch (err) {
    sounding = false;
    statusEl.textContent = "This browser did not open the audio device.";
  }
}

function silence() {
  sounding = false;
  if (master && audio) master.gain.setTargetAtTime(0, audio.currentTime, 0.03);
  statusEl.textContent = "Silence. The drawing remains.";
}

function flatBow() {
  gesture.fill(0.7);
  statusEl.textContent = "The bow is flat at 0.70.";
}

function writeGesture(event) {
  const rect = stringEl.getBoundingClientRect();
  const x = Math.min(Math.max(0, event.clientX - rect.left), rect.width);
  const y = Math.min(Math.max(0, event.clientY - rect.top), rect.height);
  const i = Math.round((x / rect.width) * 127);
  const amp = 1 - y / rect.height;
  for (let k = -3; k <= 3; k += 1) {
    const j = i + k;
    if (j >= 0 && j < 128) gesture[j] = Math.min(1, Math.max(0, amp));
  }
}

let drawing = false;
stringEl.addEventListener("pointerdown", (event) => {
  drawing = true;
  stringEl.setPointerCapture(event.pointerId);
  writeGesture(event);
});
stringEl.addEventListener("pointermove", (event) => { if (drawing) writeGesture(event); });
stringEl.addEventListener("pointerup", () => { drawing = false; });
stringEl.addEventListener("pointercancel", () => { drawing = false; });

document.getElementById("sound").addEventListener("click", sound);
document.getElementById("silence").addEventListener("click", silence);
document.getElementById("flat").addEventListener("click", flatBow);
document.getElementById("fund").addEventListener("input", (event) => {
  fund = Number(event.target.value);
  document.getElementById("fund-val").textContent = fund + " Hz";
  applyAudio();
});

buildRows();
requestAnimationFrame(frame);
