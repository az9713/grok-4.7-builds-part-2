const plates = [
  { src: "art/sculpture.jpg", light: "north", cap: "Plate 01 · north window, fracture sharp" },
  { src: "art/sculpture-raking.jpg", light: "raking", cap: "Plate 02 · raking left, long shadow" },
  { src: "art/sculpture-night.jpg", light: "night", cap: "Plate 03 · night spot, same gold line" },
];
const grid = document.getElementById("grid");
function render(f) {
  grid.innerHTML = "";
  plates.filter((p) => f === "all" || p.light === f).forEach((p) => {
    const el = document.createElement("figure");
    el.innerHTML = `<img src="${p.src}" alt="${p.cap}"><figcaption>${p.cap}</figcaption>`;
    grid.appendChild(el);
  });
}
document.querySelectorAll("nav button").forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll("nav button").forEach((x) => x.classList.remove("on"));
    b.classList.add("on");
    render(b.dataset.f);
  };
});
render("all");
