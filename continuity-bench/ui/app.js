(function () {
  "use strict";

  var AXES = ["identity", "wardrobe", "lighting"];
  var selected = null;

  function pct(n) {
    return Math.round(n * 100) + "%";
  }

  function framePass(frame, threshold) {
    return AXES.every(function (axis) {
      var s = frame.scores[axis];
      if (!s) return false;
      if (typeof s.pass === "boolean") return s.pass;
      return s.value >= threshold;
    });
  }

  function render(run) {
    var threshold = typeof run.threshold === "number" ? run.threshold : 0.8;
    document.getElementById("run-id").textContent = run.run_id || "—";
    document.getElementById("threshold").textContent = threshold.toFixed(2);
    document.getElementById("fail-closed").textContent = run.fail_closed ? "on" : "off";

    var frames = run.frames || [];
    var failed = frames.filter(function (f) { return !framePass(f, threshold); });
    var runFails = run.fail_closed ? failed.length > 0 : failed.length === frames.length;
    var verdict = document.getElementById("run-verdict");
    verdict.textContent = runFails ? "FAIL" : "PASS";
    verdict.className = runFails ? "fail" : "pass";

    document.getElementById("tally").textContent =
      frames.length + " frames · " + (frames.length - failed.length) + " pass · " +
      failed.length + " fail · red on any axis fails the frame";

    var canon = run.canonical || {};
    document.getElementById("canon").innerHTML =
      (canon.src ? "<img src=\"" + canon.src + "\" alt=\"Canonical lock\">" : "") +
      "<p><strong>" + (canon.label || "Canonical") + "</strong> Skeptics score every still against this lock. Not a chat.</p>";

    var grid = document.getElementById("grid");
    grid.innerHTML = "";
    frames.forEach(function (frame, index) {
      var ok = framePass(frame, threshold);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cell " + (ok ? "pass" : "fail");
      btn.setAttribute("data-index", String(index));
      var chips = AXES.map(function (axis) {
        var s = frame.scores[axis] || { value: 0, pass: false };
        var p = typeof s.pass === "boolean" ? s.pass : s.value >= threshold;
        return "<span class=\"chip " + (p ? "pass" : "fail") + "\">" + axis.slice(0, 2).toUpperCase() + " " + pct(s.value) + "</span>";
      }).join("");
      btn.innerHTML =
        "<img src=\"" + frame.src + "\" alt=\"" + (frame.label || frame.id) + "\">" +
        "<div class=\"meta\"><span class=\"id\">" + frame.id + " · shot " + (frame.shot || "—") + "</span>" +
        "<span class=\"label\">" + (frame.label || "") + "</span>" +
        "<div class=\"scores\">" + chips + "</div></div>";
      btn.addEventListener("click", function () {
        selected = index;
        document.querySelectorAll(".cell").forEach(function (c) {
          c.classList.toggle("on", c === btn);
        });
        showDetail(frame, threshold);
      });
      grid.appendChild(btn);
    });

    if (frames.length) {
      selected = 0;
      var first = grid.querySelector(".cell");
      if (first) first.classList.add("on");
      showDetail(frames[0], threshold);
    }
  }

  function showDetail(frame, threshold) {
    var panel = document.getElementById("detail");
    panel.hidden = false;
    document.getElementById("detail-title").textContent = frame.id + " — " + (frame.label || "");
    var img = document.getElementById("detail-img");
    img.src = frame.src;
    img.alt = frame.label || frame.id;
    var reasons = document.getElementById("reasons");
    reasons.innerHTML = AXES.map(function (axis) {
      var s = frame.scores[axis] || { value: 0, pass: false, reason: "No skeptic output." };
      var p = typeof s.pass === "boolean" ? s.pass : s.value >= threshold;
      return "<li><div class=\"axis " + (p ? "pass" : "fail") + "\">" + axis + " · " + pct(s.value) + " · " + (p ? "PASS" : "FAIL") + "</div><p>" + (s.reason || "") + "</p></li>";
    }).join("");
  }

  fetch("../fixtures/run.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Could not load fixtures/run.json");
      return res.json();
    })
    .then(render)
    .catch(function (err) {
      var el = document.getElementById("err");
      el.hidden = false;
      el.textContent = err.message + " Serve the repo over http so the fixture can load.";
    });
})();
