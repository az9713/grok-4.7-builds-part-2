const shots = [
  { id: "throw", title: "01 Throw", still: "art/pot.jpg", video: "video/throw.mp4" },
  { id: "trim", title: "02 Trim", still: "art/pot-trimmed.jpg", video: "video/trim.mp4" },
  { id: "finish", title: "03 Finish", still: "art/pot-finished.jpg", video: "video/finish.mp4" },
];
const frame = document.getElementById("frame");
const vid = document.getElementById("vid");
const list = document.getElementById("shots");

function show(s, btn) {
  document.querySelectorAll(".shots button").forEach((b) => b.classList.remove("on"));
  btn.classList.add("on");
  frame.src = s.still;
  vid.pause();
  vid.style.display = "none";
  vid.src = s.video;
  vid.onloadeddata = () => {
    vid.style.display = "block";
    vid.play().catch(() => { vid.style.display = "none"; });
  };
  vid.onerror = () => { vid.style.display = "none"; };
}
shots.forEach((s, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = s.title;
  b.onclick = () => show(s, b);
  list.appendChild(b);
  if (i === 0) show(s, b);
});
