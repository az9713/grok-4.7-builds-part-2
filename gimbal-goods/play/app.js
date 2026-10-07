(function () {
  "use strict";

  var KEY = "gimbal-goods-cart";

  var SKUS = [
    { id: "axis3-graphite", name: "Axis-3 Graphite", price: 420, image: "../art/lamp.jpg" },
    { id: "axis3-brass", name: "Axis-3 Brass", price: 480, image: "../art/lamp-brass.jpg" }
  ];

  var PLATES = [
    { id: "01", src: "../art/lamp.jpg", cap: "Canonical lock · graphite · lit", filter: "studio", sku: "axis3-graphite" },
    { id: "02", src: "../art/lamp-front.jpg", cap: "Front elevation · shade down", filter: "studio", sku: "axis3-graphite" },
    { id: "03", src: "../art/lamp-top.jpg", cap: "Plan · collar and knuckle", filter: "studio", sku: "axis3-graphite" },
    { id: "04", src: "../art/lamp-off.jpg", cap: "Unlit · studio sweep", filter: "studio", sku: "axis3-graphite" },
    { id: "05", src: "../art/lamp-desk.jpg", cap: "Desk · 21:40 · tungsten", filter: "desk", sku: "axis3-graphite" },
    { id: "06", src: "../art/lamp-brass.jpg", cap: "Finish chain · brushed brass", filter: "finish", sku: "axis3-brass" }
  ];

  var filter = "all";
  var cart = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(cart));
  }

  function skuById(id) {
    var i;
    for (i = 0; i < SKUS.length; i += 1) {
      if (SKUS[i].id === id) return SKUS[i];
    }
    return null;
  }

  function add(id) {
    var line = cart.filter(function (l) { return l.id === id; })[0];
    if (line) line.qty += 1;
    else cart.push({ id: id, qty: 1 });
    save();
    renderCart();
  }

  function setQty(id, qty) {
    if (qty <= 0) {
      cart = cart.filter(function (l) { return l.id !== id; });
    } else {
      cart.forEach(function (l) { if (l.id === id) l.qty = qty; });
    }
    save();
    renderCart();
  }

  function count() {
    return cart.reduce(function (n, l) { return n + l.qty; }, 0);
  }

  function total() {
    return cart.reduce(function (n, l) {
      var s = skuById(l.id);
      return n + (s ? s.price * l.qty : 0);
    }, 0);
  }

  function money(n) {
    return "$" + n.toFixed(0);
  }

  function renderSkus() {
    var row = document.getElementById("sku-row");
    row.innerHTML = "";
    SKUS.forEach(function (s) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sku";
      btn.innerHTML = "<span>" + s.name + "</span><span class=\"price\">" + money(s.price) + "</span><span class=\"add\">Add to hold</span>";
      btn.addEventListener("click", function () { add(s.id); openCart(); });
      row.appendChild(btn);
    });
  }

  function renderLookbook() {
    var root = document.getElementById("lookbook");
    root.innerHTML = "";
    PLATES.filter(function (p) {
      return filter === "all" || p.filter === filter;
    }).forEach(function (p) {
      var fig = document.createElement("figure");
      fig.className = "plate";
      fig.innerHTML = "<img src=\"" + p.src + "\" alt=\"Axis-3 plate " + p.id + "\"><figcaption><span>Plate " + p.id + "</span><span>" + p.cap + "</span></figcaption>";
      fig.addEventListener("click", function () {
        document.getElementById("hero-img").src = p.src;
        document.querySelector(".hero-fig figcaption").innerHTML =
          "<span class=\"plate-no\">Plate " + p.id + "</span><span>" + p.cap + "</span>";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      root.appendChild(fig);
    });
  }

  function renderCart() {
    document.getElementById("cart-count").textContent = String(count());
    var lines = document.getElementById("lines");
    lines.innerHTML = "";
    if (!cart.length) {
      lines.innerHTML = "<li>Hold is empty.</li>";
    } else {
      cart.forEach(function (l) {
        var s = skuById(l.id);
        if (!s) return;
        var li = document.createElement("li");
        li.innerHTML = "<span>" + s.name + "</span>";
        var qty = document.createElement("div");
        qty.className = "qty";
        var minus = document.createElement("button");
        minus.type = "button";
        minus.textContent = "−";
        minus.addEventListener("click", function () { setQty(l.id, l.qty - 1); });
        var n = document.createElement("span");
        n.textContent = String(l.qty);
        var plus = document.createElement("button");
        plus.type = "button";
        plus.textContent = "+";
        plus.addEventListener("click", function () { setQty(l.id, l.qty + 1); });
        qty.appendChild(minus);
        qty.appendChild(n);
        qty.appendChild(plus);
        var price = document.createElement("span");
        price.textContent = money(s.price * l.qty);
        li.appendChild(qty);
        li.appendChild(price);
        lines.appendChild(li);
      });
    }
    document.getElementById("total").textContent = money(total());
  }

  function openCart() {
    document.getElementById("cart").hidden = false;
    document.getElementById("scrim").hidden = false;
  }

  function closeCart() {
    document.getElementById("cart").hidden = true;
    document.getElementById("scrim").hidden = true;
  }

  document.querySelectorAll(".filters button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      filter = btn.getAttribute("data-filter");
      document.querySelectorAll(".filters button").forEach(function (b) {
        b.classList.toggle("on", b === btn);
      });
      renderLookbook();
    });
  });

  document.getElementById("open-cart").addEventListener("click", openCart);
  document.getElementById("close-cart").addEventListener("click", closeCart);
  document.getElementById("scrim").addEventListener("click", closeCart);
  document.getElementById("clear-cart").addEventListener("click", function () {
    cart = [];
    save();
    document.getElementById("ticket").hidden = true;
    renderCart();
  });
  document.getElementById("stamp").addEventListener("click", function () {
    var el = document.getElementById("ticket");
    if (!cart.length) {
      el.hidden = false;
      el.textContent = "Nothing to stamp.";
      return;
    }
    var id = "GG-" + Date.now().toString(36).toUpperCase();
    el.hidden = false;
    el.textContent = "Ticket " + id + " · " + count() + " object(s) · " + money(total()) + " · hold kept in this browser.";
  });

  renderSkus();
  renderLookbook();
  renderCart();
})();
