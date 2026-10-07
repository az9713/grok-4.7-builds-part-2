(function () {
  "use strict";

  var MORPHS = [
    { id: "ancestor", src: "../art/creature-ancestor.jpg", acc: "PT-04-001", latin: "C. striolata", form: "holotype" },
    { id: "armor", src: "../art/creature-armor.jpg", acc: "PT-04-002", latin: "C. striolata f. loricata", form: "sclerites" },
    { id: "horn", src: "../art/creature-horn.jpg", acc: "PT-04-003", latin: "C. striolata f. cornuta", form: "cephalic horn" },
    { id: "legs", src: "../art/creature-legs.jpg", acc: "PT-04-004", latin: "C. striolata f. cursor", form: "hypertrophied tarsi" },
    { id: "orange", src: "../art/creature-orange.jpg", acc: "PT-04-005", latin: "C. striolata f. fulva", form: "carotenoid elytra" },
    { id: "pale", src: "../art/creature-pale.jpg", acc: "PT-04-006", latin: "C. striolata f. pallida", form: "leucistic" },
    { id: "spread", src: "../art/creature-spread.jpg", acc: "PT-04-007", latin: "C. striolata f. expansa", form: "forewings abducted" },
    { id: "wings", src: "../art/creature-wings.jpg", acc: "PT-04-008", latin: "C. striolata f. serrata", form: "ciliate hindwings" }
  ];

  var sprites = {};
  var selected = MORPHS[0].id;
  var animals = [];
  var canvas = document.getElementById("terrarium");
  var ctx = canvas.getContext("2d");
  var censusEl = document.getElementById("census");
  var last = 0;

  function keyMagenta(img) {
    var c = document.createElement("canvas");
    c.width = img.naturalWidth || img.width;
    c.height = img.naturalHeight || img.height;
    var g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    var id, data, i, r, gn, b, thresh;
    try {
      id = g.getImageData(0, 0, c.width, c.height);
    } catch (err) {
      return c;
    }
    data = id.data;
    thresh = 70;
    for (i = 0; i < data.length; i += 4) {
      r = data[i];
      gn = data[i + 1];
      b = data[i + 2];
      if (r > 160 && b > 160 && gn < r - thresh && gn < b - thresh) {
        data[i + 3] = 0;
      }
    }
    g.putImageData(id, 0, 0);
    var box = alphaBox(id);
    if (!box) return c;
    var cropped = document.createElement("canvas");
    cropped.width = Math.max(1, box.w);
    cropped.height = Math.max(1, box.h);
    cropped.getContext("2d").drawImage(c, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
    return cropped;
  }

  function alphaBox(id) {
    var w = id.width;
    var h = id.height;
    var d = id.data;
    var minX = w;
    var minY = h;
    var maxX = 0;
    var maxY = 0;
    var x, y, a;
    for (y = 0; y < h; y += 1) {
      for (x = 0; x < w; x += 1) {
        a = d[(y * w + x) * 4 + 3];
        if (a > 12) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < minX) return null;
    return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  }

  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error("missing " + src)); };
      img.src = src;
    });
  }

  function renderTray() {
    var ul = document.getElementById("tray");
    ul.innerHTML = "";
    MORPHS.forEach(function (m) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pin" + (m.id === selected ? " selected" : "");
      btn.setAttribute("data-id", m.id);
      var fig = document.createElement("figure");
      fig.style.margin = "0";
      var holder = sprites[m.id];
      if (holder) {
        var thumb = document.createElement("canvas");
        thumb.width = 220;
        thumb.height = 140;
        var tctx = thumb.getContext("2d");
        tctx.fillStyle = "#efe3c4";
        tctx.fillRect(0, 0, 220, 140);
        tctx.beginPath();
        tctx.arc(110, 10, 3, 0, Math.PI * 2);
        tctx.fillStyle = "#6b5430";
        tctx.fill();
        var scale = Math.min(200 / holder.width, 118 / holder.height);
        var dw = holder.width * scale;
        var dh = holder.height * scale;
        tctx.drawImage(holder, (220 - dw) / 2, 140 - dh - 6, dw, dh);
        fig.appendChild(thumb);
      }
      var cap = document.createElement("figcaption");
      cap.innerHTML = "<span class=\"acc\">" + m.acc + " · " + m.form + "</span><span class=\"latin\">" + m.latin + "</span>";
      fig.appendChild(cap);
      btn.appendChild(fig);
      btn.addEventListener("click", function () {
        selected = m.id;
        renderTray();
        dropAt(80 + Math.random() * (canvas.width - 160), 24);
      });
      li.appendChild(btn);
      ul.appendChild(li);
    });
  }

  function dropAt(x, y) {
    var spr = sprites[selected];
    if (!spr) return;
    animals.push({
      id: selected,
      x: x,
      y: y,
      vy: 40,
      dir: Math.random() < 0.5 ? -1 : 1,
      speed: 28 + Math.random() * 36,
      phase: Math.random() * Math.PI * 2,
      grounded: false,
      scale: 0.42 + Math.random() * 0.08
    });
    census();
  }

  function census() {
    var counts = {};
    animals.forEach(function (a) {
      counts[a.id] = (counts[a.id] || 0) + 1;
    });
    censusEl.textContent = animals.length + " in habitat";
  }

  function drawHabitat() {
    var w = canvas.width;
    var h = canvas.height;
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#152016");
    g.addColorStop(0.55, "#1c2a1a");
    g.addColorStop(1, "#2a2214");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#3d2a16";
    ctx.beginPath();
    ctx.moveTo(0, h * 0.72);
    ctx.quadraticCurveTo(w * 0.25, h * 0.66, w * 0.5, h * 0.74);
    ctx.quadraticCurveTo(w * 0.75, h * 0.8, w, h * 0.7);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#2e4a28";
    moss(40, h * 0.74, 50);
    moss(180, h * 0.78, 40);
    moss(w - 120, h * 0.73, 55);
    moss(w * 0.48, h * 0.8, 36);

    fern(90, h * 0.76, -0.4);
    fern(w - 80, h * 0.74, 0.5);
    fern(w * 0.62, h * 0.79, 0.15);

    ctx.fillStyle = "rgba(8, 10, 6, 0.35)";
    ctx.fillRect(0, 0, 18, h);
    ctx.fillRect(w - 18, 0, 18, h);
  }

  function moss(x, y, r) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function fern(x, y, lean) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(lean);
    ctx.strokeStyle = "#4a6a3a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(8, -40, 4, -90);
    ctx.stroke();
    var i;
    for (i = 0; i < 7; i += 1) {
      ctx.beginPath();
      ctx.moveTo(2, -12 - i * 11);
      ctx.quadraticCurveTo(18 + i, -16 - i * 11, 22, -10 - i * 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(2, -12 - i * 11);
      ctx.quadraticCurveTo(-16 - i, -16 - i * 11, -20, -10 - i * 10);
      ctx.stroke();
    }
    ctx.restore();
  }

  function groundY(x) {
    var w = canvas.width;
    var h = canvas.height;
    var t = x / w;
    return h * (0.72 + Math.sin(t * Math.PI) * 0.04);
  }

  function tick(ts) {
    if (!last) last = ts;
    var dt = Math.min(0.04, (ts - last) / 1000);
    last = ts;
    drawHabitat();
    animals.forEach(function (a) {
      var spr = sprites[a.id];
      if (!spr) return;
      var gy = groundY(a.x) - 4;
      if (!a.grounded) {
        a.vy += 520 * dt;
        a.y += a.vy * dt;
        if (a.y >= gy) {
          a.y = gy;
          a.vy = 0;
          a.grounded = true;
        }
      } else {
        a.x += a.dir * a.speed * dt;
        a.phase += dt * 8;
        a.y = groundY(a.x) - 4;
        if (a.x < 40) { a.x = 40; a.dir = 1; }
        if (a.x > canvas.width - 40) { a.x = canvas.width - 40; a.dir = -1; }
      }
      var bob = a.grounded ? Math.sin(a.phase) * 3 : 0;
      var dw = spr.width * a.scale;
      var dh = spr.height * a.scale;
      ctx.save();
      ctx.translate(a.x, a.y + bob);
      ctx.scale(a.dir, 1);
      ctx.rotate(a.grounded ? Math.sin(a.phase) * 0.08 : 0);
      ctx.drawImage(spr, -dw / 2, -dh, dw, dh);
      ctx.restore();
    });
    requestAnimationFrame(tick);
  }

  canvas.addEventListener("click", function (ev) {
    var rect = canvas.getBoundingClientRect();
    var x = (ev.clientX - rect.left) * (canvas.width / rect.width);
    var y = (ev.clientY - rect.top) * (canvas.height / rect.height);
    dropAt(x, Math.min(y, 80));
  });

  document.getElementById("evacuate").addEventListener("click", function () {
    animals = [];
    census();
  });

  Promise.all(MORPHS.map(function (m) {
    return loadImage(m.src).then(function (img) {
      sprites[m.id] = keyMagenta(img);
    }).catch(function () {
      sprites[m.id] = null;
    });
  })).then(function () {
    renderTray();
    census();
    requestAnimationFrame(tick);
  });
})();
