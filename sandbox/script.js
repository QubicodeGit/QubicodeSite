document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const storagePrefix = "qubicode-sandbox:";

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function roundRect(x, y, w, h, r) {
    const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    this.moveTo(x + radius, y);
    this.arcTo(x + w, y, x + w, y + h, radius);
    this.arcTo(x + w, y + h, x, y + h, radius);
    this.arcTo(x, y + h, x, y, radius);
    this.arcTo(x, y, x + w, y, radius);
    return this;
  };
}

const assets = {};
[
  ["playerCar", "images/playercar.png"],
  ["npcCar", "images/npccar.png"],
  ["laser", "images/laser.png"],
  ["mirror", "images/mirror.png"],
  ["crate", "images/crate.png"],
  ["revolver", "images/revolver.png"],
  ["cube", "images/qubicodeCube.png"],
  ["boostPickup", "images/boostIcon.png"],
  ["boostFlame", "images/boost.png"]
].forEach(([key, src]) => {
  assets[key] = new Image();
  assets[key].src = src;
});

const ui = {
  score: Object.fromEntries([...document.querySelectorAll("[data-score]")].map((node) => [node.dataset.score, node])),
  high: Object.fromEntries([...document.querySelectorAll("[data-high]")].map((node) => [node.dataset.high, node])),
  status: Object.fromEntries([...document.querySelectorAll("[data-status]")].map((node) => [node.dataset.status, node])),
  overlay: Object.fromEntries([...document.querySelectorAll("[data-overlay]")].map((node) => [node.dataset.overlay, node]))
};

function getStore(key, fallback = 0) {
  return Number(localStorage.getItem(`${storagePrefix}${key}`)) || fallback;
}

function setStore(key, value) {
  localStorage.setItem(`${storagePrefix}${key}`, String(value));
}

function setText(node, value) {
  if (node) node.textContent = String(value);
}

setText(ui.high.driver, getStore("driver"));
setText(ui.high.bots, getStore("botsSolved"));
setText(ui.high.gun, getStore("gun"));
setText(ui.high.pong, getStore("pong"));

function sound(name) {
  window.dispatchEvent(new CustomEvent("qubicode:sound", { detail: { name } }));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function hitRect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function pointerPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function drawImageFit(ctx, image, x, y, w, h, rotation = 0) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(rotation);
  if (image.complete && image.naturalWidth) {
    ctx.drawImage(image, -w / 2, -h / 2, w, h);
  } else {
    ctx.fillStyle = "#26ddff";
    ctx.fillRect(-w / 2, -h / 2, w, h);
  }
  ctx.restore();
}

function pickLane(available) {
  if (!available.length) return (Math.random() * 3) | 0;
  return available[(Math.random() * available.length) | 0];
}

class MiniGame {
  constructor(key, canvasId) {
    this.key = key;
    this.canvas = document.querySelector(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.active = false;
    this.raf = 0;
    this.last = performance.now();
    this.particles = [];
    this.high = getStore(key);
    this.ready = false;
    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);
    window.addEventListener("resize", this.resize);
    this.resize();
    setText(ui.high[key], this.high);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = Math.max(300, rect.width);
    this.h = Math.max(230, rect.height);
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!this.ready) return;
    if (this.active) this.onResize();
    else this.drawPreview();
  }

  play() {
    this.stop(false);
    this.reset();
    this.active = true;
    this.last = performance.now();
    ui.overlay[this.key]?.classList.add("is-hidden");
    this.raf = requestAnimationFrame(this.loop);
  }

  restart() {
    if (this.active) this.play();
    else {
      this.reset();
      this.drawPreview();
    }
  }

  stop(showOverlay = true) {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.active = false;
    if (showOverlay) {
      this.drawPreview();
      ui.overlay[this.key]?.classList.remove("is-hidden");
    }
  }

  loop(time) {
    if (!this.active) return;
    const dt = Math.min(0.033, (time - this.last) / 1000 || 0.016);
    this.last = time;
    this.update(reducedMotion ? Math.min(dt, 0.018) : dt);
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  }

  saveHigh(value, storageKey = this.key) {
    this.high = Math.max(this.high, Math.floor(value));
    setStore(storageKey, this.high);
    setText(ui.high[this.key], this.high);
  }

  burst(x, y, colors, count = 18, power = 180) {
    const total = reducedMotion ? Math.ceil(count * 0.35) : count;
    for (let i = 0; i < total; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(power * 0.2, power);
      this.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: rand(0.25, 0.75), max: 0.75, size: rand(2, 7), color: colors[i % colors.length] });
    }
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const p = this.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 70 * dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  drawParticles() {
    for (let i = 0; i < this.particles.length; i += 1) {
      const p = this.particles[i];
      this.ctx.save();
      this.ctx.globalAlpha = clamp(p.life / p.max, 0, 1);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 12;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  drawPreview() {}
  onResize() {}
  reset() {}
  update() {}
  draw() {}
}

// Driver Dash: vertical 3-lane dodge game with sprite cars and downward road motion.
class DriverDashGame extends MiniGame {
  constructor() {
    super("driver", "#driver-canvas");
    window.addEventListener("keydown", (event) => {
      if (!this.active) return;
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") this.switchLane(-1);
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") this.switchLane(1);
    });
    let startX = 0;
    this.canvas.addEventListener("pointerdown", (event) => {
      if (!this.active) return;
      startX = event.clientX;
      this.canvas.setPointerCapture(event.pointerId);
    });
    this.canvas.addEventListener("pointerup", (event) => {
      if (!this.active) return;
      const dx = event.clientX - startX;
      if (Math.abs(dx) > 22) this.switchLane(dx > 0 ? 1 : -1);
    });
    this.ready = true;
    this.drawPreview();
  }

  reset() {
    this.lane = 1;
    this.targetLane = 1;
    this.score = 0;
    this.speed = 245;
    this.spawnTimer = 0.55;
    this.boostSpawnTimer = 2.4;
    this.boostTimer = 0;
    this.gameOver = false;
    this.obstacles = [];
    this.boosts = [];
    this.particles = [];
    setText(ui.score.driver, 0);
    setText(ui.status.driver, "Arrows / A D / Swipe");
  }

  switchLane(direction) {
    if (this.gameOver) return;
    this.targetLane = clamp(this.targetLane + direction, 0, 2);
    sound("driver-lane");
  }

  laneX(lane) {
    return this.w * (0.28 + lane * 0.22);
  }

  carRect(laneValue, y, w = 50, h = 80) {
    return { x: this.laneX(laneValue) - w / 2, y, w, h };
  }

  update(dt) {
    this.updateParticles(dt);
    this.boostTimer = Math.max(0, this.boostTimer - dt);
    if (this.gameOver) {
      if (!this.particles.length) this.stop(true);
      return;
    }
    const speedMultiplier = this.boostTimer > 0 ? 2 : 1;
    const effectiveSpeed = this.speed * speedMultiplier;
    this.speed += dt * 14;
    this.score += dt * (12 + effectiveSpeed / 42);
    this.lane += (this.targetLane - this.lane) * Math.min(1, dt * 13);
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      const blocked = [false, false, false];
      for (let i = Math.max(0, this.obstacles.length - 2); i < this.obstacles.length; i += 1) {
        blocked[this.obstacles[i].lane] = true;
      }
      const choices = [];
      for (let lane = 0; lane < 3; lane += 1) {
        if (!blocked[lane] || Math.random() < 0.45) choices.push(lane);
      }
      this.obstacles.push({ lane: pickLane(choices), y: -82, wobble: rand(-4, 4) });
      this.spawnTimer = Math.max(0.42, 1.05 - this.score / 1400);
    }
    this.boostSpawnTimer -= dt;
    if (this.boostSpawnTimer <= 0) {
      const occupied = [false, false, false];
      for (let i = Math.max(0, this.obstacles.length - 2); i < this.obstacles.length; i += 1) {
        occupied[this.obstacles[i].lane] = true;
      }
      for (let i = Math.max(0, this.boosts.length - 2); i < this.boosts.length; i += 1) {
        occupied[this.boosts[i].lane] = true;
      }
      const choices = [];
      for (let lane = 0; lane < 3; lane += 1) {
        if (!occupied[lane] || Math.random() < 0.4) choices.push(lane);
      }
      this.boosts.push({
        lane: pickLane(choices),
        y: -74,
        wobble: rand(-3, 3),
        spin: rand(-0.9, 0.9),
        pulse: rand(0, Math.PI * 2)
      });
      this.boostSpawnTimer = rand(4.5, 7.5);
    }
    const player = this.carRect(this.lane, this.h - 82, 56, 56);
    for (let i = this.obstacles.length - 1; i >= 0; i -= 1) {
      const car = this.obstacles[i];
      car.y += effectiveSpeed * dt;
      const npc = this.carRect(car.lane, car.y, 54, 54);
      if (hitRect(player, npc)) {
        if (this.boostTimer > 0) {
          this.obstacles.splice(i, 1);
          this.burst(player.x + player.w / 2, player.y + player.h / 2, ["#ffffff", "#ffcf4a", "#ff7a00"], 14, 220);
          sound("driver-lane");
        } else {
          this.crash(player);
          return;
        }
      }
      if (car.y >= this.h + 120) this.obstacles.splice(i, 1);
    }
    for (let i = this.boosts.length - 1; i >= 0; i -= 1) {
      const boost = this.boosts[i];
      boost.y += effectiveSpeed * dt * 0.94;
      const pickup = this.carRect(boost.lane, boost.y, 48, 48);
      if (hitRect(player, pickup)) {
        this.boostTimer = 4;
        this.boosts.splice(i, 1);
        this.burst(player.x + player.w / 2, player.y + player.h / 2, ["#c7ff2b", "#70ecff", "#ffffff"], 16, 260);
        sound("driver-lane");
      }
      if (boost.y >= this.h + 120) this.boosts.splice(i, 1);
    }
    setText(ui.score.driver, Math.floor(this.score));
    setText(ui.status.driver, this.boostTimer > 0 ? `BOOST ${this.boostTimer.toFixed(1)}s 2X SPEED` : "Arrows / A D / Swipe");
  }

  crash(player) {
    this.gameOver = true;
    this.saveHigh(this.score);
    setText(ui.status.driver, "Crash. Press Play or Restart.");
    this.burst(player.x + player.w / 2, player.y + player.h / 2, ["#ffc400", "#ff7a00", "#ef263c", "#ffffff"], 38, 330);
    sound("driver-crash");
  }

  drawRoad() {
    const ctx = this.ctx;
    const roadX = this.w * 0.18;
    const roadW = this.w * 0.64;
    ctx.fillStyle = "#131924";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.fillStyle = "#252d38";
    ctx.fillRect(roadX, 0, roadW, this.h);
    ctx.fillStyle = "#ffb703";
    ctx.fillRect(roadX - 8, 0, 5, this.h);
    ctx.fillRect(roadX + roadW + 3, 0, 5, this.h);
    ctx.fillStyle = "rgba(255,255,255,.16)";
    [this.w * 0.39, this.w * 0.61].forEach((x) => {
      ctx.fillRect(x - 1, 0, 2, this.h);
    });
    ctx.fillStyle = "rgba(38,221,255,.08)";
    ctx.fillRect(roadX + 12, 0, roadW - 24, 2);
    ctx.fillRect(roadX + 12, this.h - 2, roadW - 24, 2);
  }

  draw() {
    const ctx = this.ctx;
    const boostActive = this.boostTimer > 0;
    const flameAlpha = clamp(this.boostTimer / 2, 0.35, 1);
    ctx.clearRect(0, 0, this.w, this.h);
    this.drawRoad();
    this.boosts.forEach((boost) => {
      const x = this.laneX(boost.lane) - 24 + boost.wobble;
      const y = boost.y + Math.sin((this.score * 0.014) + boost.pulse) * 5;
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.shadowColor = "#c7ff2b";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "rgba(199,255,43,.12)";
      ctx.beginPath();
      ctx.ellipse(x + 24, y + 24, 28, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      drawImageFit(ctx, assets.boostPickup, x, y, 48, 48, boost.spin + Math.sin(this.score * 0.012) * 0.1);
    });
    this.obstacles.forEach((car) => drawImageFit(ctx, assets.npcCar, this.laneX(car.lane) - 30 + car.wobble, car.y, 60, 60));
    if (boostActive) {
      const flameX = this.laneX(this.lane) - 28;
      const flameY = this.h - 46;
      const flameW = 56;
      const flameH = 64;
      ctx.save();
      ctx.globalAlpha = flameAlpha;
      ctx.shadowColor = "#ff7a00";
      ctx.shadowBlur = 18;
      drawImageFit(ctx, assets.boostFlame, flameX, flameY, flameW, flameH);
      ctx.restore();
    }
    drawImageFit(ctx, assets.playerCar, this.laneX(this.lane) - 34, this.h - 86, 68, 68);
    this.drawParticles();
    if (this.gameOver) {
      ctx.fillStyle = "rgba(16,19,27,.72)";
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 40px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("CRASH", this.w / 2, this.h / 2);
    }
  }

  drawPreview() {
    this.drawRoad();
    drawImageFit(this.ctx, assets.npcCar, this.laneX(0) - 30, this.h * 0.24, 60, 60);
    drawImageFit(this.ctx, assets.boostPickup, this.laneX(2) - 24, this.h * 0.42, 48, 48);
    drawImageFit(this.ctx, assets.playerCar, this.laneX(1) - 36, this.h * 0.6, 72, 72);
    setText(ui.status.driver, "Play to dodge traffic");
  }
}

// Brawlbots: grid-based laser puzzle with draggable crates, rotatable mirrors, walls, gates and five handcrafted levels.
class BrawlbotsLaserGame extends MiniGame {
  constructor() {
    super("bots", "#bots-canvas");
    this.grid = { cols: 12, rows: 7 };
    this.levels = this.makeLevels();
    this.level = 0;
    this.solvedHigh = getStore("botsSolved");
    this.drag = null;
    this.tapTime = 0;
    this.canvas.addEventListener("pointerdown", (event) => this.pointerDown(event));
    this.canvas.addEventListener("pointermove", (event) => this.pointerMove(event));
    this.canvas.addEventListener("pointerup", (event) => this.pointerUp(event));
    this.ready = true;
    this.drawPreview();
  }

  makeLevels() {
    return [
      { emitter: { c: 1, r: 3, d: "right" }, receivers: [{ c: 10, r: 1 }], mirrors: [{ c: 4, r: 3, rot: 0 }, { c: 4, r: 1, rot: 1 }], crates: [], walls: [{ c: 7, r: 2 }, { c: 7, r: 3 }, { c: 7, r: 4 }], gates: [{ c: 10, r: 3 }] },
      { emitter: { c: 1, r: 5, d: "right" }, receivers: [{ c: 10, r: 1 }], mirrors: [{ c: 3, r: 5, rot: 0 }, { c: 3, r: 1, rot: 1 }], crates: [{ c: 6, r: 5 }], walls: [{ c: 6, r: 3 }, { c: 7, r: 3 }, { c: 8, r: 3 }], gates: [{ c: 10, r: 2 }] },
      { emitter: { c: 2, r: 1, d: "down" }, receivers: [{ c: 10, r: 5 }], mirrors: [{ c: 2, r: 4, rot: 0 }, { c: 8, r: 4, rot: 1 }, { c: 8, r: 5, rot: 0 }], crates: [{ c: 5, r: 4 }], walls: [{ c: 4, r: 2 }, { c: 5, r: 2 }, { c: 6, r: 2 }, { c: 7, r: 2 }], gates: [{ c: 10, r: 4 }] },
      { emitter: { c: 1, r: 2, d: "right" }, receivers: [{ c: 10, r: 5 }], mirrors: [{ c: 5, r: 2, rot: 0 }, { c: 5, r: 5, rot: 1 }], crates: [{ c: 3, r: 2 }, { c: 7, r: 5 }], walls: [{ c: 8, r: 2 }, { c: 8, r: 3 }, { c: 8, r: 4 }], gates: [{ c: 10, r: 4 }] },
      { emitter: { c: 1, r: 1, d: "right" }, receivers: [{ c: 10, r: 1 }, { c: 10, r: 5 }], mirrors: [{ c: 4, r: 1, rot: 0 }, { c: 4, r: 5, rot: 1 }, { c: 7, r: 5, rot: 0 }], crates: [{ c: 7, r: 1 }, { c: 6, r: 3 }], walls: [{ c: 3, r: 3 }, { c: 4, r: 3 }, { c: 5, r: 3 }, { c: 8, r: 2 }, { c: 8, r: 3 }, { c: 8, r: 4 }], gates: [{ c: 10, r: 3 }] }
    ];
  }

  onResize() {
    if (this.active) this.reset(false);
  }

  cell() {
    return { w: this.w / this.grid.cols, h: this.h / this.grid.rows };
  }

  fromCell(item) {
    const cell = this.cell();
    return { x: item.c * cell.w + cell.w * 0.12, y: item.r * cell.h + cell.h * 0.12, w: cell.w * 0.76, h: cell.h * 0.76 };
  }

  reset(clearParticles = true) {
    const level = this.levels[this.level];
    this.emitter = { ...level.emitter };
    this.receivers = level.receivers.map((x) => ({ ...x, powered: false }));
    this.mirrors = level.mirrors.map((x) => ({ ...x, type: "mirror" }));
    this.crates = level.crates.map((x) => ({ ...x, type: "crate" }));
    this.walls = level.walls.map((x) => ({ ...x }));
    this.gates = level.gates.map((x) => ({ ...x, open: false }));
    this.drag = null;
    this.solved = false;
    this.beams = [];
    if (clearParticles) this.particles = [];
    setText(ui.score.bots, this.level + 1);
    setText(ui.high.bots, this.solvedHigh);
    setText(ui.status.bots, "Drag crates and mirrors. Tap mirrors to rotate.");
  }

  nextLevel() {
    this.level = (this.level + 1) % this.levels.length;
    if (this.active) this.reset();
    else this.drawPreview();
  }

  pointerDown(event) {
    if (!this.active) return;
    const p = pointerPoint(this.canvas, event);
    this.tapTime = performance.now();
    const items = [...this.crates, ...this.mirrors].reverse();
    const item = items.find((candidate) => hitRect({ x: p.x, y: p.y, w: 1, h: 1 }, this.fromCell(candidate)));
    if (item) {
      const rect = this.fromCell(item);
      this.drag = { item, ox: p.x - rect.x, oy: p.y - rect.y, moved: false };
      this.canvas.setPointerCapture(event.pointerId);
    }
  }

  pointerMove(event) {
    if (!this.active || !this.drag) return;
    const p = pointerPoint(this.canvas, event);
    const cell = this.cell();
    const c = clamp(Math.round((p.x - this.drag.ox) / cell.w), 0, this.grid.cols - 1);
    const r = clamp(Math.round((p.y - this.drag.oy) / cell.h), 0, this.grid.rows - 1);
    if (c !== this.drag.item.c || r !== this.drag.item.r) this.drag.moved = true;
    if (!this.isBlocked(c, r, this.drag.item)) {
      this.drag.item.c = c;
      this.drag.item.r = r;
    }
  }

  pointerUp() {
    if (!this.active || !this.drag) return;
    if (!this.drag.moved && this.drag.item.type === "mirror" && performance.now() - this.tapTime < 260) {
      this.drag.item.rot = (this.drag.item.rot + 1) % 4;
      sound("bots-rotate");
    }
    this.drag = null;
  }

  isBlocked(c, r, moving) {
    if (this.emitter.c === c && this.emitter.r === r) return true;
    if (this.walls.some((w) => w.c === c && w.r === r)) return true;
    if (this.gates.some((g) => g.c === c && g.r === r && !g.open)) return true;
    if (this.receivers.some((rec) => rec.c === c && rec.r === r)) return true;
    return [...this.crates, ...this.mirrors].some((item) => item !== moving && item.c === c && item.r === r);
  }

  dirVector(dir) {
    return { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] }[dir];
  }

  reflect(dir, rot) {
    const slash = rot % 2 === 0;
    const mapSlash = { right: "up", up: "right", left: "down", down: "left" };
    const mapBack = { right: "down", down: "right", left: "up", up: "left" };
    return slash ? mapSlash[dir] : mapBack[dir];
  }

  update(dt) {
    this.updateParticles(dt);
    this.receivers.forEach((r) => { r.powered = false; });
    let c = this.emitter.c;
    let r = this.emitter.r;
    let dir = this.emitter.d;
    const beams = [];
    for (let step = 0; step < 32; step += 1) {
      const [dc, dr] = this.dirVector(dir);
      const start = { c, r };
      c += dc;
      r += dr;
      if (c < 0 || r < 0 || c >= this.grid.cols || r >= this.grid.rows) {
        beams.push({ from: start, to: { c: clamp(c, 0, this.grid.cols - 1), r: clamp(r, 0, this.grid.rows - 1) } });
        break;
      }
      beams.push({ from: start, to: { c, r } });
      if (this.walls.some((w) => w.c === c && w.r === r)) break;
      if (this.gates.some((g) => g.c === c && g.r === r && !g.open)) break;
      if (this.crates.some((box) => box.c === c && box.r === r)) break;
      const rec = this.receivers.find((target) => target.c === c && target.r === r);
      if (rec) rec.powered = true;
      const mirror = this.mirrors.find((m) => m.c === c && m.r === r);
      if (mirror) dir = this.reflect(dir, mirror.rot);
    }
    this.beams = beams;
    const solved = this.receivers.every((rec) => rec.powered);
    this.gates.forEach((gate) => { gate.open = solved; });
    if (solved && !this.solved) {
      this.solved = true;
      this.solvedHigh = Math.max(this.solvedHigh, this.level + 1);
      setStore("botsSolved", this.solvedHigh);
      setText(ui.high.bots, this.solvedHigh);
      setText(ui.status.bots, "Gate open. Level complete.");
      const rec = this.receivers[0];
      const cell = this.cell();
      this.burst((rec.c + 0.5) * cell.w, (rec.r + 0.5) * cell.h, ["#79f20d", "#ff2d3d", "#ffffff"], 26, 240);
      sound("bots-solved");
    }
    if (!solved) this.solved = false;
  }

  drawGrid() {
    const ctx = this.ctx;
    const cell = this.cell();
    ctx.fillStyle = "#071126";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.strokeStyle = "rgba(255,255,255,.08)";
    for (let c = 0; c <= this.grid.cols; c += 1) {
      ctx.beginPath(); ctx.moveTo(c * cell.w, 0); ctx.lineTo(c * cell.w, this.h); ctx.stroke();
    }
    for (let r = 0; r <= this.grid.rows; r += 1) {
      ctx.beginPath(); ctx.moveTo(0, r * cell.h); ctx.lineTo(this.w, r * cell.h); ctx.stroke();
    }
  }

  drawCellImage(image, item, rotation = 0) {
    const rect = this.fromCell(item);
    drawImageFit(this.ctx, image, rect.x, rect.y, rect.w, rect.h, rotation);
  }

  draw() {
    const ctx = this.ctx;
    const cell = this.cell();
    this.drawGrid();
    this.walls.forEach((w) => {
      const rect = this.fromCell(w);
      ctx.fillStyle = "#29304b";
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    });
    this.gates.forEach((g) => {
      if (g.open) return;
      const rect = this.fromCell(g);
      ctx.fillStyle = "rgba(255, 209, 102, .22)";
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 3;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    });
    ctx.shadowColor = "#ff2d3d";
    ctx.shadowBlur = 18;
    this.beams.forEach((beam) => {
      ctx.lineWidth = 7;
      ctx.strokeStyle = "rgba(255,45,61,.3)";
      ctx.beginPath();
      ctx.moveTo((beam.from.c + 0.5) * cell.w, (beam.from.r + 0.5) * cell.h);
      ctx.lineTo((beam.to.c + 0.5) * cell.w, (beam.to.r + 0.5) * cell.h);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffe9ec";
      ctx.stroke();
    });
    ctx.shadowBlur = 0;
    const emitterRotation = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 }[this.emitter.d];
    this.drawCellImage(assets.laser, this.emitter, emitterRotation);
    this.receivers.forEach((rec) => {
      const rect = this.fromCell(rec);
      ctx.fillStyle = rec.powered ? "#79f20d" : "#081329";
      ctx.strokeStyle = rec.powered ? "#ffffff" : "#ff2d3d";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(rect.x + rect.w / 2, rect.y + rect.h / 2, Math.min(rect.w, rect.h) * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    this.crates.forEach((crate) => this.drawCellImage(assets.crate, crate));
    this.mirrors.forEach((mirror) => this.drawCellImage(assets.mirror, mirror, mirror.rot * Math.PI / 2));
    this.drawParticles();
    if (this.solved) {
      ctx.fillStyle = "rgba(5,17,40,.74)";
      ctx.fillRect(0, this.h - 54, this.w, 54);
      ctx.fillStyle = "#79f20d";
      ctx.font = "900 21px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("LEVEL COMPLETE", this.w / 2, this.h - 20);
    }
  }

  drawPreview() {
    this.level = 0;
    this.reset(false);
    this.draw();
    setText(ui.status.bots, "Play to start the puzzle");
  }
}

// Gun Pop: center revolver spins, click/tap fires in current direction for a 30 second score chase.
class GunPopGame extends MiniGame {
  constructor() {
    super("gun", "#gun-canvas");
    this.canvas.addEventListener("pointerdown", () => { if (this.active) this.shoot(); });
    window.addEventListener("keydown", (event) => {
      if (this.active && event.code === "Space") {
        event.preventDefault();
        this.shoot();
      }
    });
    this.ready = true;
    this.drawPreview();
  }

  reset() {
    this.score = 0;
    this.combo = 1;
    this.time = 30;
    this.angle = -Math.PI / 2;
    this.spin = 4.45;
    this.spawn = 0.16;
    this.bullets = [];
    this.targets = [];
    this.floaters = [];
    this.shake = 0;
    this.muzzleFlash = 0;
    this.particles = [];
    for (let i = 0; i < 6; i += 1) this.spawnTarget();
    setText(ui.score.gun, 0);
    setText(ui.status.gun, "30 seconds. Click / tap / Space to shoot.");
  }

  spawnTarget() {
    const roll = Math.random();
    const edge = Math.floor(rand(0, 4));
    const x = edge === 0 ? rand(64, this.w - 64) : edge === 1 ? this.w - 62 : edge === 2 ? rand(64, this.w - 64) : 62;
    const y = edge === 0 ? 58 : edge === 1 ? rand(58, this.h - 80) : edge === 2 ? this.h - 80 : rand(58, this.h - 80);
    this.targets.push({
      x,
      y,
      r: roll < 0.16 ? 21 : 18,
      vx: roll < 0.58 ? rand(-115, 115) : 0,
      vy: roll < 0.58 ? rand(-88, 88) : 0,
      type: roll < 0.16 ? "gift" : roll < 0.48 ? "moving" : "normal"
    });
  }

  shoot() {
    if (this.time <= 0) return;
    const shotAngle = this.angle + Math.PI;
    this.shake = reducedMotion ? 0 : 4;
    this.muzzleFlash = 0.08;
    this.bullets.push({
      x: this.w / 2 + Math.cos(shotAngle) * 46,
      y: this.h / 2 + Math.sin(shotAngle) * 46,
      vx: Math.cos(shotAngle) * 760,
      vy: Math.sin(shotAngle) * 760,
      trail: []
    });
    this.burst(this.w / 2 + Math.cos(shotAngle) * 54, this.h / 2 + Math.sin(shotAngle) * 54, ["#ffd166", "#ff6fd8", "#ffffff"], 10, 190);
    sound("gun-shot");
  }

  addScore(target) {
    const base = target.type === "gift" ? 50 : target.type === "moving" ? 20 : 10;
    const points = base * this.combo;
    this.score += points;
    this.combo = Math.min(9, this.combo + 1);
    this.floaters.push({ x: target.x, y: target.y, text: `+${points}`, life: 0.85 });
    this.saveHigh(this.score);
    setText(ui.score.gun, this.score);
  }

  update(dt) {
    this.updateParticles(dt);
    if (this.time <= 0) {
      if (!this.particles.length) this.stop(true);
      return;
    }
    this.time = Math.max(0, this.time - dt);
    this.angle += this.spin * dt;
    this.spawn -= dt;
    this.shake = Math.max(0, this.shake - dt * 18);
    this.muzzleFlash = Math.max(0, this.muzzleFlash - dt);
    if (this.spawn <= 0 && this.targets.length < 11) {
      this.spawnTarget();
      this.spawn = Math.max(0.14, 0.48 - this.score / 5200);
    }
    this.targets.forEach((target) => {
      target.x += target.vx * dt;
      target.y += target.vy * dt;
      if (target.x < target.r || target.x > this.w - target.r) target.vx *= -1;
      if (target.y < target.r || target.y > this.h - target.r) target.vy *= -1;
    });
    const panels = [
      { x: this.w * 0.14, y: this.h * 0.22, w: 92, h: 10 },
      { x: this.w * 0.72, y: this.h * 0.68, w: 96, h: 10 }
    ];
    this.bullets.forEach((bullet) => {
      bullet.trail.unshift({ x: bullet.x, y: bullet.y });
      if (bullet.trail.length > 8) bullet.trail.length = 8;
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      panels.forEach((panel) => {
        if (hitRect({ x: bullet.x - 4, y: bullet.y - 4, w: 8, h: 8 }, panel)) {
          bullet.vy *= -1;
          bullet.y += bullet.vy > 0 ? 8 : -8;
          sound("gun-ricochet");
        }
      });
    });
    for (let i = this.bullets.length - 1; i >= 0; i -= 1) {
      const bullet = this.bullets[i];
      let removed = false;
      for (let j = this.targets.length - 1; j >= 0; j -= 1) {
        const target = this.targets[j];
        if (Math.hypot(bullet.x - target.x, bullet.y - target.y) < target.r + 5) {
          this.addScore(target);
          this.burst(target.x, target.y, target.type === "gift" ? ["#ffd166", "#ffffff", "#65ffbd"] : ["#ff6fd8", "#26ddff", "#ffffff"], 24, 270);
          this.targets.splice(j, 1);
          removed = true;
          this.shake = reducedMotion ? 0 : target.type === "gift" ? 9 : 5;
          sound("gun-hit");
          break;
        }
      }
      if (removed || bullet.x < -80 || bullet.x > this.w + 80 || bullet.y < -80 || bullet.y > this.h + 80) {
        this.bullets.splice(i, 1);
        if (!removed) this.combo = 1;
      }
    }
    this.floaters.forEach((floater) => { floater.life -= dt; floater.y -= 40 * dt; });
    this.floaters = this.floaters.filter((floater) => floater.life > 0);
    setText(ui.status.gun, `${Math.ceil(this.time)}s left | Combo x${this.combo}`);
    if (this.time <= 0) setText(ui.status.gun, "Time. Press Play or Restart.");
  }

  draw() {
    const ctx = this.ctx;
    const sx = this.shake ? rand(-this.shake, this.shake) : 0;
    const sy = this.shake ? rand(-this.shake, this.shake) : 0;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.save();
    ctx.translate(sx, sy);
    ctx.fillStyle = "#171026";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.fillStyle = "rgba(255,255,255,.055)";
    for (let x = -60; x < this.w; x += 42) ctx.fillRect(x, 0, 2, this.h);
    [{ x: this.w * 0.14, y: this.h * 0.22, w: 92, h: 10 }, { x: this.w * 0.72, y: this.h * 0.68, w: 96, h: 10 }].forEach((panel) => {
      ctx.fillStyle = "#ffd166";
      ctx.shadowColor = "#ffd166";
      ctx.shadowBlur = 16;
      ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
      ctx.shadowBlur = 0;
    });
    this.targets.forEach((target) => {
      ctx.fillStyle = target.type === "gift" ? "#ffd166" : target.type === "moving" ? "#26ddff" : "#ff6fd8";
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      if (target.type === "gift") ctx.roundRect(target.x - target.r, target.y - target.r, target.r * 2, target.r * 2, 6);
      else ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    this.bullets.forEach((bullet) => {
      bullet.trail.forEach((t, index) => {
        ctx.globalAlpha = 1 - index / bullet.trail.length;
        ctx.fillStyle = "#26ddff";
        ctx.beginPath(); ctx.arc(t.x, t.y, 4, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath(); ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2); ctx.fill();
    });
    drawImageFit(ctx, assets.revolver, this.w / 2 - 58, this.h / 2 - 58, 116, 116, this.angle);
    if (this.muzzleFlash > 0) {
      const shotAngle = this.angle + Math.PI;
      ctx.fillStyle = "#ffd166";
      ctx.shadowColor = "#ffd166";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(this.w / 2 + Math.cos(shotAngle) * 68, this.h / 2 + Math.sin(shotAngle) * 68, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 16px system-ui";
    ctx.fillText(`TIME ${Math.ceil(this.time)}`, 18, 28);
    ctx.fillText(`COMBO x${this.combo}`, 18, 52);
    this.floaters.forEach((floater) => {
      ctx.globalAlpha = clamp(floater.life / 0.85, 0, 1);
      ctx.fillStyle = "#ffd166";
      ctx.font = "900 22px system-ui";
      ctx.fillText(floater.text, floater.x, floater.y);
      ctx.globalAlpha = 1;
    });
    this.drawParticles();
    ctx.restore();
    if (this.time <= 0) {
      ctx.fillStyle = "rgba(11,18,32,.74)";
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.fillStyle = "#ffd166";
      ctx.font = "900 36px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("TIME", this.w / 2, this.h / 2);
      ctx.textAlign = "left";
    }
  }

  drawPreview() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.ctx.fillStyle = "#171026";
    this.ctx.fillRect(0, 0, this.w, this.h);
    drawImageFit(this.ctx, assets.revolver, this.w / 2 - 70, this.h / 2 - 70, 140, 140, -0.6);
    setText(ui.status.gun, "Play to start a 30 second round");
  }
}

// Qubicode Pong: bracket paddles, Qubicode cube ball, AI opponent and collectible powerups.
class QubicodePongGame extends MiniGame {
  constructor() {
    super("pong", "#pong-canvas");
    this.winStreak = getStore("pongWins");
    this.canvas.addEventListener("pointermove", (event) => {
      if (!this.active) return;
      this.left.y = pointerPoint(this.canvas, event).y - this.left.h / 2;
    });
    this.canvas.addEventListener("pointerdown", (event) => {
      if (!this.active) return;
      this.left.y = pointerPoint(this.canvas, event).y - this.left.h / 2;
      this.fire();
    });
    window.addEventListener("keydown", (event) => {
      if (this.active && event.code === "Space") this.fire();
    });
    this.ready = true;
    this.drawPreview();
  }

  reset() {
    this.left = { x: 36, y: this.h / 2 - 52, w: 20, h: 104 };
    this.right = { x: this.w - 56, y: this.h / 2 - 52, w: 20, h: 104 };
    this.balls = [{ x: this.w / 2, y: this.h / 2, vx: 245, vy: 120, r: 16, trail: [] }];
    this.bullets = [];
    this.powerups = [];
    this.leftScore = 0;
    this.rightScore = 0;
    this.spawnPower = 4;
    this.power = null;
    this.powerTimer = 0;
    this.done = false;
    this.particles = [];
    setText(ui.score.pong, this.winStreak);
    setText(ui.high.pong, this.high);
    setText(ui.status.pong, "Move mouse or touch to control {");
  }

  fire() {
    if (this.power !== "gun") return;
    this.bullets.push({ x: this.left.x + 32, y: this.left.y + this.left.h / 2, vx: 540 });
    sound("pong-fire");
  }

  activate(type) {
    this.power = type;
    this.powerTimer = 6;
    if (type === "recovery" && this.balls.length < 2) this.balls.push({ ...this.balls[0], vx: -this.balls[0].vx, vy: -this.balls[0].vy, trail: [] });
    if (type === "brawlbots") { this.left.h = 150; this.right.h = 150; }
    if (type === "scp") this.burst(this.w / 2, this.h / 2, ["#dfeeee", "#26ddff"], 18, 150);
    setText(ui.status.pong, `Powerup: ${type}`);
    sound(`pong-${type}`);
  }

  update(dt) {
    this.updateParticles(dt);
    if (this.done) {
      if (!this.particles.length) this.stop(true);
      return;
    }
    this.left.y = clamp(this.left.y, 18, this.h - this.left.h - 18);
    const lead = this.balls[0];
    this.right.y += (lead.y - (this.right.y + this.right.h / 2)) * dt * 4.3;
    this.right.y = clamp(this.right.y, 18, this.h - this.right.h - 18);
    this.spawnPower -= dt;
    if (this.spawnPower <= 0) {
      const types = ["recovery", "brawlbots", "gun", "scp", "shader"];
      this.powerups.push({ x: rand(this.w * 0.28, this.w * 0.72), y: rand(76, this.h - 76), type: types[Math.floor(Math.random() * types.length)], life: 9 });
      this.spawnPower = rand(7, 12);
    }
    for (let i = this.powerups.length - 1; i >= 0; i -= 1) {
      const p = this.powerups[i];
      p.life -= dt;
      if (p.life <= 0) this.powerups.splice(i, 1);
    }
    if (this.powerTimer > 0) {
      this.powerTimer -= dt;
      if (this.powerTimer <= 0) {
        this.power = null;
        this.left.h = 104;
        this.right.h = 104;
        if (this.balls.length > 1) this.balls = this.balls.slice(0, 1);
        setText(ui.status.pong, "Move mouse or touch to control {");
      }
    }
    this.balls.forEach((ball) => {
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      ball.trail.unshift({ x: ball.x, y: ball.y });
      const trailLimit = this.power === "shader" ? 18 : 9;
      if (ball.trail.length > trailLimit) ball.trail.length = trailLimit;
      if (ball.y < ball.r || ball.y > this.h - ball.r) ball.vy *= -1;
      [this.left, this.right].forEach((paddle, index) => {
        if (hitRect({ x: ball.x - ball.r, y: ball.y - ball.r, w: ball.r * 2, h: ball.r * 2 }, paddle)) {
          ball.vx = Math.abs(ball.vx) * (index === 0 ? 1 : -1) * 1.035;
          ball.vy += ((ball.y - (paddle.y + paddle.h / 2)) / paddle.h) * 220;
          this.burst(ball.x, ball.y, ["#26ddff", "#a66cff", "#ffffff"], 8, 120);
        }
      });
      for (let i = this.powerups.length - 1; i >= 0; i -= 1) {
        const p = this.powerups[i];
        if (Math.hypot(ball.x - p.x, ball.y - p.y) < ball.r + 18) {
          this.activate(p.type);
          this.powerups.splice(i, 1);
        }
      }
    });
    this.bullets.forEach((bullet) => { bullet.x += bullet.vx * dt; });
    this.bullets.forEach((bullet) => {
      this.balls.forEach((ball) => {
        if (Math.hypot(bullet.x - ball.x, bullet.y - ball.y) < ball.r + 5) {
          ball.vx += 140;
          ball.vy += rand(-150, 150);
          bullet.dead = true;
          this.burst(ball.x, ball.y, ["#ffd166", "#26ddff"], 12, 180);
        }
      });
    });
    this.bullets = this.bullets.filter((b) => !b.dead && b.x < this.w + 20);
    for (let i = this.balls.length - 1; i >= 0; i -= 1) {
      const ball = this.balls[i];
      if (ball.x < -40) { this.rightScore += 1; this.balls.splice(i, 1); }
      if (ball.x > this.w + 40) { this.leftScore += 1; this.balls.splice(i, 1); }
    }
    if (!this.balls.length) this.balls.push({ x: this.w / 2, y: this.h / 2, vx: (Math.random() < 0.5 ? -1 : 1) * 245, vy: rand(-125, 125), r: 16, trail: [] });
    if (this.leftScore >= 10 || this.rightScore >= 10) {
      this.done = true;
      if (this.leftScore > this.rightScore) {
        this.winStreak += 1;
        this.high = Math.max(this.high, this.winStreak);
      } else {
        this.winStreak = 0;
      }
      setStore("pongWins", this.winStreak);
      setStore("pong", this.high);
      setText(ui.score.pong, this.winStreak);
      setText(ui.high.pong, this.high);
      setText(ui.status.pong, this.leftScore > this.rightScore ? "You win. Press Play or Restart." : "AI wins. Restart.");
    }
  }

  symbol(type) {
    return { recovery: "RU", brawlbots: "BB", gun: "GP", scp: "087", shader: "PBR" }[type] || "?";
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.fillStyle = this.power === "scp" ? "#010204" : "#050711";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.strokeStyle = "rgba(38,221,255,.12)";
    for (let y = 24; y < this.h; y += 24) {
      ctx.beginPath(); ctx.moveTo(this.w / 2, y); ctx.lineTo(this.w / 2, y + 12); ctx.stroke();
    }
    ctx.font = "900 38px system-ui";
    ctx.textAlign = "center";
    ctx.fillStyle = "#26ddff";
    ctx.shadowColor = "#26ddff";
    ctx.shadowBlur = 18;
    ctx.fillText(String(this.leftScore), this.w * 0.38, 52);
    ctx.fillText(String(this.rightScore), this.w * 0.62, 52);
    ctx.font = `${this.left.h}px system-ui`;
    ctx.fillText("{", this.left.x + 8, this.left.y + this.left.h * 0.8);
    ctx.fillText("}", this.right.x + 8, this.right.y + this.right.h * 0.8);
    ctx.shadowBlur = 0;
    this.powerups.forEach((p) => {
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#a66cff";
      ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.arc(p.x, p.y, 21, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#050711";
      ctx.font = "900 11px system-ui";
      ctx.fillText(this.symbol(p.type), p.x, p.y + 4);
    });
    this.bullets.forEach((b) => {
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(b.x, b.y - 3, 16, 6);
    });
    this.balls.forEach((ball) => {
      ball.trail.forEach((t, i) => {
        ctx.globalAlpha = (1 - i / ball.trail.length) * 0.45;
        ctx.fillStyle = this.power === "shader" ? "#ff6fd8" : "#26ddff";
        ctx.beginPath(); ctx.arc(t.x, t.y, ball.r * (1 - i / (ball.trail.length * 1.4)), 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.shadowColor = this.power === "shader" ? "#ff6fd8" : "#26ddff";
      ctx.shadowBlur = this.power === "shader" ? 28 : 14;
      drawImageFit(ctx, assets.cube, ball.x - ball.r, ball.y - ball.r, ball.r * 2, ball.r * 2);
      ctx.shadowBlur = 0;
    });
    this.drawParticles();
    if (this.done) {
      ctx.fillStyle = "rgba(5,7,17,.76)";
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 36px system-ui";
      ctx.fillText(this.leftScore > this.rightScore ? "YOU WIN" : "AI WINS", this.w / 2, this.h / 2);
    }
    ctx.textAlign = "left";
  }

  drawPreview() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.left = { x: 36, y: this.h / 2 - 52, w: 20, h: 104 };
    this.right = { x: this.w - 56, y: this.h / 2 - 52, w: 20, h: 104 };
    this.balls = [{ x: this.w / 2, y: this.h / 2, r: 18, trail: [] }];
    this.bullets = [];
    this.leftScore = 0;
    this.rightScore = 0;
    this.power = null;
    this.done = false;
    this.particles = [];
    this.powerups = [{ x: this.w * 0.62, y: this.h * 0.42, type: "shader" }];
    this.draw();
    setText(ui.status.pong, "Play to control the left bracket");
  }
}

const factories = {
  driver: () => new DriverDashGame(),
  bots: () => new BrawlbotsLaserGame(),
  gun: () => new GunPopGame(),
  pong: () => new QubicodePongGame()
};
const games = {};

function previewCanvas(key) {
  const canvas = document.querySelector(`#${key === "bots" ? "bots" : key}-canvas`);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(300, rect.width);
  const h = Math.max(230, rect.height);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  if (key === "driver") {
    ctx.fillStyle = "#131924";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#252d38";
    ctx.fillRect(w * 0.18, 0, w * 0.64, h);
    ctx.fillStyle = "#ffb703";
    ctx.fillRect(w * 0.18 - 8, 0, 5, h);
    ctx.fillRect(w * 0.82 + 3, 0, 5, h);
    ctx.strokeStyle = "rgba(255,255,255,.82)";
    ctx.lineWidth = 4;
    ctx.setLineDash([28, 32]);
    [w * 0.39, w * 0.61].forEach((x) => {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    });
    ctx.setLineDash([]);
    drawImageFit(ctx, assets.npcCar, w * 0.27 - 30, h * 0.25, 60, 60);
    drawImageFit(ctx, assets.playerCar, w * 0.5 - 36, h * 0.62, 72, 72);
  } else if (key === "bots") {
    ctx.fillStyle = "#071126";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,.08)";
    for (let x = 0; x < w; x += w / 12) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += h / 7) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    drawImageFit(ctx, assets.laser, w * 0.1, h * 0.42, 54, 54);
    drawImageFit(ctx, assets.mirror, w * 0.42, h * 0.22, 58, 58, Math.PI / 2);
    drawImageFit(ctx, assets.crate, w * 0.58, h * 0.54, 64, 64);
    ctx.strokeStyle = "#ff2d3d";
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(w * 0.18, h * 0.5); ctx.lineTo(w * 0.5, h * 0.31); ctx.lineTo(w * 0.82, h * 0.31); ctx.stroke();
  } else if (key === "gun") {
    ctx.fillStyle = "#171026";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,.055)";
    for (let x = -60; x < w; x += 42) ctx.fillRect(x, 0, 2, h);
    drawImageFit(ctx, assets.revolver, w / 2 - 70, h / 2 - 70, 140, 140, -0.6);
    ctx.fillStyle = "#ff6fd8";
    ctx.beginPath(); ctx.arc(w * 0.72, h * 0.28, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffd166";
    ctx.beginPath(); ctx.roundRect(w * 0.2, h * 0.62, 42, 42, 6); ctx.fill();
  } else if (key === "pong") {
    ctx.fillStyle = "#050711";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(38,221,255,.12)";
    for (let y = 24; y < h; y += 24) { ctx.beginPath(); ctx.moveTo(w / 2, y); ctx.lineTo(w / 2, y + 12); ctx.stroke(); }
    ctx.fillStyle = "#26ddff";
    ctx.shadowColor = "#26ddff";
    ctx.shadowBlur = 18;
    ctx.font = "120px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("{", w * 0.12, h * 0.62);
    ctx.fillText("}", w * 0.88, h * 0.62);
    drawImageFit(ctx, assets.cube, w / 2 - 20, h / 2 - 20, 40, 40);
    ctx.shadowBlur = 0;
    ctx.textAlign = "left";
  }
}

function drawAllPreviews() {
  ["driver", "bots", "gun", "pong"].forEach((key) => {
    if (!games[key]) previewCanvas(key);
  });
}

Object.values(assets).forEach((image) => image.addEventListener("load", drawAllPreviews));
window.addEventListener("resize", drawAllPreviews);
drawAllPreviews();

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.game;
    try {
      if (button.dataset.action === "play") {
        games[key] = games[key] || factories[key]();
        Object.entries(games).forEach(([otherKey, game]) => {
          if (otherKey !== key && game.active) game.stop(true);
        });
        games[key].play();
        return;
      }
      const game = games[key];
      if (!game) {
        previewCanvas(key);
        return;
      }
      if (button.dataset.action === "level" && game.nextLevel) game.nextLevel();
      else game.restart();
    } catch (error) {
      console.error(error);
      setText(ui.status[key], "Could not start. Check the console.");
      ui.overlay[key]?.classList.remove("is-hidden");
    }
  });
});
