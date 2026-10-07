let home = 0, away = 0, sec = 12 * 60 + 4;
const score = document.getElementById("score");
const clock = document.getElementById("clock");
const end = document.getElementById("end");
const stage = document.querySelector(".stage");
function pad(n) { return String(n).padStart(2, "0"); }
setInterval(() => {
  sec += 1;
  clock.textContent = pad(Math.floor(sec / 60)) + ":" + pad(sec % 60);
}, 1000);
document.getElementById("home").onclick = () => {
  home += 1;
  score.textContent = home + "–" + away;
};
document.getElementById("away").onclick = () => {
  away += 1;
  score.textContent = home + "–" + away;
};
document.getElementById("wipe").onclick = () => {
  stage.classList.remove("wipe");
  void stage.offsetWidth;
  stage.classList.add("wipe");
};
document.getElementById("card").onclick = () => {
  end.hidden = !end.hidden;
};
