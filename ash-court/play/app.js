const SUITS = ["Moth", "Staff", "Cloak"];
const deck = [];
SUITS.forEach((s) => {
  for (let r = 1; r <= 6; r++) {
    deck.push({
      id: s[0] + r,
      suit: s,
      rank: r,
      art: r % 2 ? "art/magistrate.jpg" : "art/magistrate-rain.jpg",
    });
  }
});
function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
let pile = shuffle(deck);
let you = pile.slice(0, 9);
let opp = pile.slice(9);
let trick = [];
let lead = "you";
let ys = 0, os = 0;

const youEl = document.getElementById("you");
const oppEl = document.getElementById("opp");
const trickEl = document.getElementById("trick");
const msg = document.getElementById("msg");

function cardNode(c, face) {
  const d = document.createElement("button");
  d.className = "card";
  d.type = "button";
  if (face === "opp") {
    d.innerHTML = `<span class="back" aria-hidden="true"></span>`;
    d.setAttribute("aria-label", "Bench card");
    return d;
  }
  d.innerHTML = `<span class="badge">${c.suit[0]}${c.rank}</span><img src="${c.art}" alt="">`;
  if (face === "you") d.onclick = () => playYou(c);
  return d;
}
function render() {
  youEl.innerHTML = ""; you.forEach((c) => youEl.appendChild(cardNode(c, "you")));
  oppEl.innerHTML = ""; opp.forEach((c) => oppEl.appendChild(cardNode(c, "opp")));
  trickEl.innerHTML = "";
  trick.forEach((t) => {
    const n = cardNode(t.card, "");
    n.style.outline = t.who === "you" ? "2px solid #6a3b1e" : "2px solid #888";
    trickEl.appendChild(n);
  });
  document.getElementById("ys").textContent = ys;
  document.getElementById("os").textContent = os;
}
function legal(c) {
  if (lead !== "you" && trick.length === 0) return false;
  if (trick.length === 0) return true;
  const s = trick[0].card.suit;
  if (you.some((x) => x.suit === s)) return c.suit === s;
  return true;
}
function winner() {
  const led = trick[0].card.suit;
  const ofSuit = trick.filter((t) => t.card.suit === led);
  ofSuit.sort((a, b) => b.card.rank - a.card.rank);
  return ofSuit[0].who;
}
function playYou(c) {
  if (!legal(c) || trick.some((t) => t.who === "you")) return;
  you = you.filter((x) => x !== c);
  trick.push({ who: "you", card: c });
  render();
  if (trick.length === 1) setTimeout(playOpp, 400);
  else finish();
}
function playOpp() {
  const led = trick[0] ? trick[0].card.suit : null;
  let choice = led && opp.find((c) => c.suit === led);
  if (!choice) choice = opp[0];
  opp = opp.filter((x) => x !== choice);
  trick.push({ who: "opp", card: choice });
  render();
  if (trick.length === 2) finish();
}
function finish() {
  const w = winner();
  if (w === "you") ys += 1; else os += 1;
  msg.textContent = w === "you" ? "You take the trick." : "The bench takes it.";
  lead = w;
  setTimeout(() => {
    trick = [];
    if (ys >= 5 || os >= 5 || (you.length === 0 && opp.length === 0)) {
      msg.textContent = ys > os ? "Sitting to you." : "Sitting to the bench.";
      render(); return;
    }
    msg.textContent = lead === "you" ? "Your lead." : "Bench leads.";
    render();
    if (lead === "opp") setTimeout(playOpp, 500);
  }, 700);
}
document.getElementById("print").onclick = () => window.print();
render();
if (lead === "opp") playOpp();
