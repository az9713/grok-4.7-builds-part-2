const TICKET = "SOCKET DARK";
const MEASURE = 24;
const caseEl = document.getElementById("case");
const stickEl = document.getElementById("stick");
const sheet = document.getElementById("sheet");
const statusEl = document.getElementById("status");
const measureEl = document.getElementById("measure");
const lockBtn = document.getElementById("lock");
const proofBtn = document.getElementById("proof");

let line = [];
let locked = false;

function width(ch) {
  if (ch === " ") return 1;
  if ("IJL".includes(ch)) return 1;
  if ("MW".includes(ch)) return 3;
  return 2;
}

function used() {
  return line.reduce((sum, ch) => sum + width(ch), 0);
}

function render() {
  stickEl.textContent = "";
  line.forEach((ch) => {
    const span = document.createElement("span");
    span.className = "metal";
    span.textContent = ch === " " ? "\u00a0" : ch;
    const nick = document.createElement("i");
    span.appendChild(nick);
    stickEl.appendChild(span);
  });
  measureEl.textContent = used() + " / " + MEASURE;
  proofBtn.disabled = !locked;
}

function add(ch) {
  if (locked) {
    statusEl.textContent = "The chase is locked. Open the chase to change the line.";
    return;
  }
  if (used() + width(ch) > MEASURE) {
    statusEl.textContent = "The sort does not fit the measure.";
    return;
  }
  line.push(ch);
  sheet.textContent = "Pull a proof after the chase is locked.";
  statusEl.textContent = "Sort added. The stick shows the metal backwards.";
  render();
}

function renderCase() {
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ ".split("").forEach((ch) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sort";
    btn.textContent = ch === " " ? "space" : ch;
    const nick = document.createElement("span");
    nick.className = "nick";
    btn.appendChild(nick);
    btn.addEventListener("click", () => add(ch));
    caseEl.appendChild(btn);
  });
}

document.getElementById("back").addEventListener("click", () => {
  if (locked) {
    statusEl.textContent = "The chase is locked. Open the chase to change the line.";
    return;
  }
  line.pop();
  statusEl.textContent = line.length ? "Last sort removed." : "The stick is empty.";
  render();
});

lockBtn.addEventListener("click", () => {
  locked = !locked;
  lockBtn.textContent = locked ? "Open the chase" : "Lock the chase";
  statusEl.textContent = locked ? "The chase is locked." : "The chase is open.";
  render();
});

proofBtn.addEventListener("click", () => {
  const text = line.join("");
  sheet.textContent = text || " ";
  if (!text) statusEl.textContent = "The chase is empty.";
  else if (text === TICKET) statusEl.textContent = "The proof matches the ticket.";
  else statusEl.textContent = "The proof does not match the ticket.";
});

renderCase();
render();
