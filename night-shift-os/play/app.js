const apps = [
  { id: "mail", title: "Mail", icon: "art/icon-mail.jpg", body: "<p>From: Yard</p><p>Socket on Orbit-2 is dark. Carry the cell. Do not regenerate the faces.</p>" },
  { id: "map", title: "Map", icon: "art/icon-map.jpg", body: "<p>West dock → kiln → house cutaway. The teal door is left of center. If it moves, the lock failed.</p>" },
  { id: "kettle", title: "Kettle", icon: "art/icon-kettle.jpg", body: "<p>Night-shift tea. Boil. Sit. The OS is the game.</p>" },
];
const dock = document.getElementById("dock");
const windowsEl = document.getElementById("windows");
let z = 10;

function clock() {
  const d = new Date();
  document.getElementById("clock").textContent = d.toTimeString().slice(0, 8);
}
setInterval(clock, 1000); clock();

function openApp(app, x, y) {
  if (document.getElementById("w-" + app.id)) {
    document.getElementById("w-" + app.id).style.zIndex = ++z;
    return;
  }
  const w = document.createElement("section");
  w.className = "window";
  w.id = "w-" + app.id;
  w.style.left = (x || 120) + "px";
  w.style.top = (y || 80) + "px";
  w.style.zIndex = ++z;
  w.innerHTML = `<div class="title"><span>${app.title}</span><button type="button" aria-label="Close">×</button></div><div class="body">${app.body}</div>`;
  w.querySelector("button").onclick = () => w.remove();
  w.addEventListener("mousedown", () => { w.style.zIndex = ++z; });
  const title = w.querySelector(".title");
  title.addEventListener("mousedown", (e) => {
    const r = w.getBoundingClientRect();
    const ox = e.clientX - r.left, oy = e.clientY - r.top;
    function move(ev) {
      w.style.left = ev.clientX - ox + "px";
      w.style.top = ev.clientY - oy + "px";
    }
    function up() {
      removeEventListener("mousemove", move);
      removeEventListener("mouseup", up);
    }
    addEventListener("mousemove", move);
    addEventListener("mouseup", up);
  });
  windowsEl.appendChild(w);
  if (app.id === "mail") {
    document.getElementById("shift").textContent = "Shift note read. Socket on Orbit-2 stays dark.";
  }
}

apps.forEach((app) => {
  const b = document.createElement("button");
  b.className = "icon";
  b.innerHTML = `<img src="${app.icon}" alt="${app.title}">`;
  b.onclick = () => openApp(app);
  dock.appendChild(b);
});
const dead = document.createElement("button");
dead.className = "icon";
dead.disabled = true;
dead.innerHTML = `<img src="art/icon-mail.jpg" alt="Disabled mail">`;
dock.appendChild(dead);
