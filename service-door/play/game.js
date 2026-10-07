(() => {
  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const status = document.getElementById("status");

  const TILE = 48;
  const COLS = 20;
  const ROWS = 11;
  const keys = Object.create(null);

  const assets = {};
  const names = [
    "hero-idle", "hero-walk", "hero-strike", "guard-full", "elevator-clean", "shelf", "floor", "wall"
  ];

  function load(name, ext) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = "art/" + name + ext;
    });
  }

  const shelves = [
    { x: 5, y: 2, w: 2, h: 3 },
    { x: 5, y: 7, w: 2, h: 3 },
    { x: 11, y: 2, w: 2, h: 3 },
    { x: 11, y: 7, w: 2, h: 3 }
  ];

  const player = {
    x: 2.2, y: 5.2, w: 0.7, h: 0.9, vx: 0, vy: 0, facing: 1, frame: 0, t: 0, speed: 3.1
  };
  const guard = {
    x: 8, y: 5.2, w: 0.85, h: 0.95, dir: 1, min: 7.2, max: 13.4, speed: 1.35, down: false, t: 0
  };
  const elevator = { x: 17.2, y: 4.1, w: 2.2, h: 3.2 };
  let win = false;
  let takedownLock = 0;
  let strikeT = 0;

  function blocked(nx, ny, w, h) {
    if (nx < 1 || ny < 1 || nx + w > COLS - 1 || ny + h > ROWS - 1) return true;
    for (const s of shelves) {
      if (nx < s.x + s.w && nx + w > s.x && ny < s.y + s.h && ny + h > s.y) return true;
    }
    return false;
  }

  function overlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function drawTile(img, tx, ty) {
    ctx.drawImage(img, tx * TILE, ty * TILE, TILE, TILE);
  }

  function drawSheet(img, cells, index, x, y, flip, h) {
    const cw = img.width / cells;
    const ch = img.height;
    ctx.save();
    ctx.translate(x, y);
    if (flip) { ctx.scale(-1, 1); ctx.translate(-h, 0); }
    ctx.drawImage(img, index * cw, 0, cw, ch, 0, 0, h, h * (ch / cw));
    ctx.restore();
  }

  function restart() {
    player.x = 2.2; player.y = 5.2; player.facing = 1; win = false;
    strikeT = 0;
    guard.x = 8; guard.dir = 1; guard.down = false;
    status.textContent = "night shift · floor B3";
  }

  window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase()) || e.key === " ") e.preventDefault();
    if ((e.key === "r" || e.key === "R") && win) restart();
  });
  window.addEventListener("keyup", (e) => { keys[e.key.toLowerCase()] = false; });

  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!win) update(dt);
    draw();
    requestAnimationFrame(tick);
  }

  function update(dt) {
    let ix = 0, iy = 0;
    if (keys["a"] || keys["arrowleft"]) ix -= 1;
    if (keys["d"] || keys["arrowright"]) ix += 1;
    if (keys["w"] || keys["arrowup"]) iy -= 1;
    if (keys["s"] || keys["arrowdown"]) iy += 1;
    const moving = ix !== 0 || iy !== 0;
    if (moving) {
      const len = Math.hypot(ix, iy);
      ix /= len; iy /= len;
      if (ix !== 0) player.facing = ix < 0 ? -1 : 1;
    }
    const nx = player.x + ix * player.speed * dt;
    const ny = player.y + iy * player.speed * dt;
    if (!blocked(nx, player.y, player.w, player.h)) player.x = nx;
    if (!blocked(player.x, ny, player.w, player.h)) player.y = ny;
    player.moving = moving;
    player.t += dt;
    if (moving) player.frame = Math.floor(player.t * 10) % 8;
    else player.frame = Math.floor(player.t * 6) % 8;

    takedownLock = Math.max(0, takedownLock - dt);
    if (strikeT > 0) strikeT = Math.max(0, strikeT - dt);
    if (!guard.down) {
      guard.x += guard.dir * guard.speed * dt;
      if (guard.x > guard.max) { guard.x = guard.max; guard.dir = -1; }
      if (guard.x < guard.min) { guard.x = guard.min; guard.dir = 1; }
      guard.t += dt;
      const dx = (player.x + player.w / 2) - (guard.x + guard.w / 2);
      const dy = (player.y + player.h / 2) - (guard.y + guard.h / 2);
      const near = Math.hypot(dx, dy) < 1.15;
      if (near && takedownLock === 0 && (keys[" "] || keys["space"])) {
        guard.down = true;
        takedownLock = 0.8;
        strikeT = 0.8;
        status.textContent = "guard down · get to the lift";
      }
    }

    if (guard.down && overlap(player, elevator)) {
      win = true;
      status.textContent = "shift over · R to restart";
    } else if (!guard.down && overlap(player, elevator)) {
      status.textContent = "lift locked · put the guard down";
    }
  }

  function draw() {
    ctx.fillStyle = "#222428";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const edge = x === 0 || y === 0 || x === COLS - 1 || y === ROWS - 1;
        drawTile(edge ? assets.wall : assets.floor, x, y);
      }
    }
    for (const s of shelves) {
      ctx.drawImage(assets.shelf, s.x * TILE, s.y * TILE, s.w * TILE, s.h * TILE);
    }
    ctx.drawImage(assets["elevator-clean"], elevator.x * TILE, elevator.y * TILE, elevator.w * TILE, elevator.h * TILE);

    const gh = TILE * 1.7;
    if (guard.down) {
      ctx.save();
      ctx.translate(guard.x * TILE, guard.y * TILE + gh * 0.55);
      ctx.rotate(-Math.PI / 2.4);
      ctx.globalAlpha = 0.85;
      ctx.drawImage(assets["guard-full"], 0, 0, gh * 0.7, gh);
      ctx.restore();
    } else {
      ctx.save();
      if (guard.dir < 0) {
        ctx.translate(guard.x * TILE + gh, guard.y * TILE - 18);
        ctx.scale(-1, 1);
        ctx.drawImage(assets["guard-full"], 0, 0, gh * 0.72, gh);
      } else {
        ctx.drawImage(assets["guard-full"], guard.x * TILE, guard.y * TILE - 18, gh * 0.72, gh);
      }
      ctx.restore();
    }

    const ph = TILE * 1.65;
    if (strikeT > 0) {
      const strikeFrame = Math.min(7, Math.floor((0.8 - strikeT) / 0.1));
      drawSheet(assets["hero-strike"], 8, strikeFrame, player.x * TILE, player.y * TILE - 22, player.facing < 0, ph);
    } else {
      const sheet = player.moving ? assets["hero-walk"] : assets["hero-idle"];
      drawSheet(sheet, 8, player.frame, player.x * TILE, player.y * TILE - 22, player.facing < 0, ph);
    }

    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(12, canvas.height - 28, 420, 18);
    ctx.fillStyle = "#c8c2b4";
    ctx.font = "12px monospace";
    ctx.fillText(win ? "FREIGHT LIFT · SHIFT COMPLETE · R RESTART" : "CONTRACTOR · B3 ARCHIVE", 18, canvas.height - 15);

    if (win) {
      ctx.fillStyle = "rgba(18,16,14,0.55)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#d65a31";
      ctx.font = "bold 28px monospace";
      ctx.fillText("SHIFT COMPLETE", 320, 250);
      ctx.fillStyle = "#c8c2b4";
      ctx.font = "14px monospace";
      ctx.fillText("Press R to run it again", 360, 280);
    }
  }

  Promise.all([
    load("hero-idle", ".png"),
    load("hero-walk", ".png"),
    load("hero-strike", ".png"),
    load("guard-full", ".png"),
    load("elevator-clean", ".png"),
    load("shelf", ".png"),
    load("floor", ".jpg"),
    load("wall", ".jpg")
  ]).then((imgs) => {
    names.forEach((n, i) => { assets[n] = imgs[i]; });
    requestAnimationFrame(tick);
  }).catch((err) => {
    status.textContent = "art failed to load";
    console.error(err);
  });
})();
