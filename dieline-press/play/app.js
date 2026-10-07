const SKU = {
  bergamot: { src: "art/bottle.jpg", label: "BERGAMOT", cap: "Bergamot · blank kraft · cork" },
  smoke: { src: "art/bottle-smoke.jpg", label: "SMOKE", cap: "Smoke · blank kraft · cork" },
  hibiscus: { src: "art/bottle-hibiscus.jpg", label: "HIBISCUS", cap: "Hibiscus · blank kraft · cork" },
};
const pack = document.getElementById("pack");
const cap = document.getElementById("cap");
const flavor = document.getElementById("flavor");
document.querySelectorAll(".skus button").forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll(".skus button").forEach((x) => x.classList.remove("on"));
    b.classList.add("on");
    const s = SKU[b.dataset.sku];
    pack.src = s.src; cap.textContent = s.cap; flavor.textContent = s.label;
  };
});
document.getElementById("print").onclick = () => window.print();
