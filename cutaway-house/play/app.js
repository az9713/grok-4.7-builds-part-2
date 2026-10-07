const ROOMS = {
  front: { still: "art/house.jpg", cap: "Elevation · teal door left of center · chimney right", video: "video/front.mp4" },
  kitchen: { still: "art/house-kitchen.jpg", cap: "Kitchen cutaway · same cornice, same door", video: "video/kitchen.mp4" },
};
const still = document.getElementById("still");
const cap = document.getElementById("cap");
const walk = document.getElementById("walk");
function enter(id) {
  document.querySelectorAll(".room").forEach((r) => r.classList.toggle("on", r.dataset.room === id));
  const r = ROOMS[id];
  still.src = r.still; cap.textContent = r.cap;
  walk.style.display = "none";
  walk.src = r.video;
  walk.onloadeddata = () => { walk.style.display = "block"; walk.play().catch(() => { walk.style.display = "none"; }); };
  walk.onerror = () => { walk.style.display = "none"; };
}
document.querySelectorAll(".room").forEach((el) => {
  el.addEventListener("click", () => enter(el.dataset.room));
});
enter("front");
