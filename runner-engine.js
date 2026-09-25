(() => {
  "use strict";

  // The simulation has no browser dependencies. Distances are in logical pixels.
  const RUNNER = Object.freeze({
    playerWidth: 82,
    playerHeight: 96,
    duckWidth: 86,
    duckHeight: 69,
    gravity: 1600,
    jumpSpeed: 790,
    initialSpeed: 310,
    maxSpeed: 510,
    acceleration: 3.5,
  });

  function overlaps(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x &&
      a.y < b.y + b.height && a.y + a.height > b.y;
  }

  class DashRunner {
    constructor({ width = 1120, random = Math.random } = {}) {
      this.width = width;
      this.random = random;
      this.best = 0;
      this.reset();
    }

    reset() {
      this.state = "ready";
      this.distance = 0;
      this.elapsed = 0;
      this.speed = RUNNER.initialSpeed;
      this.height = 0;
      this.velocity = 0;
      this.ducking = false;
      this.obstacles = [];
      this.untilSpawn = 240;
      this.spawned = 0;
      this.cleared = 0;
      this.crash = null;
    }

    get score() { return Math.floor(this.distance / 10); }
    get playerX() { return this.width * .2; }
    get grounded() { return this.height === 0; }
    get crouched() { return this.ducking && this.grounded; }

    resize(width) {
      const shift = width * .2 - this.playerX;
      this.obstacles.forEach((obstacle) => { obstacle.x += shift; });
      this.width = width;
    }

    start() {
      this.reset();
      this.state = "playing";
    }

    pause() {
      if (this.state !== "playing") return;
      this.state = "paused";
      this.ducking = false;
    }

    resume() {
      if (this.state === "paused") this.state = "playing";
    }

    jump() {
      if (this.state !== "playing" || !this.grounded) return false;
      this.ducking = false;
      this.velocity = RUNNER.jumpSpeed;
      this.height = 0.01;
      return true;
    }

    setDuck(ducking) {
      this.ducking = this.state === "playing" && ducking;
    }

    playerBounds() {
      return this.crouched
        ? { x: this.playerX + 16, y: -RUNNER.duckHeight + 7, width: RUNNER.duckWidth - 28, height: RUNNER.duckHeight - 11 }
        : { x: this.playerX + 25, y: -this.height - RUNNER.playerHeight + 7, width: RUNNER.playerWidth - 40, height: RUNNER.playerHeight - 13 };
    }

    obstacleBounds(obstacle) {
      return obstacle.kind === "car"
        ? { x: obstacle.x + 10, y: -obstacle.height + 8, width: obstacle.width - 20, height: obstacle.height - 11 }
        : { x: obstacle.x + 10, y: obstacle.y + 9, width: obstacle.width - 20, height: obstacle.height - 15 };
    }

    spawn() {
      // Teach cars first, then introduce a low cloud to duck under.
      const cloud = this.spawned === 2 || (this.spawned > 2 && this.random() < 0.42);
      this.obstacles.push(cloud
        ? { kind: "cloud", x: this.width + 40, y: -116, width: 90, height: 49, passed: false }
        : { kind: "car", x: this.width + 40, y: -51, width: 176, height: 51, passed: false });
      this.spawned += 1;
      // At least 1.25 seconds between obstacles, even at maximum speed.
      this.untilSpawn = this.speed * (1.25 + this.random() * 0.6) + 176;
    }

    step(seconds) {
      if (this.state !== "playing" || !Number.isFinite(seconds) || seconds <= 0) return;
      let remaining = Math.min(seconds, 0.1);
      // Small steps prevent tunnelling through a car on a slow frame.
      while (remaining > 0 && this.state === "playing") {
        const dt = Math.min(remaining, 1 / 120);
        remaining -= dt;
        this.elapsed += dt;
        this.speed = Math.min(RUNNER.maxSpeed, RUNNER.initialSpeed + this.elapsed * RUNNER.acceleration);
        const travel = this.speed * dt;
        this.distance += travel;
        if (!this.grounded) {
          this.height = Math.max(0, this.height + this.velocity * dt - RUNNER.gravity * dt * dt / 2);
          this.velocity -= RUNNER.gravity * dt;
          if (this.grounded) this.velocity = 0;
        }
        this.untilSpawn -= travel;
        if (this.untilSpawn <= 0) this.spawn();
        const player = this.playerBounds();
        for (const obstacle of this.obstacles) {
          obstacle.x -= travel;
          if (overlaps(player, this.obstacleBounds(obstacle))) {
            this.state = "gameover";
            this.crash = obstacle.kind;
            this.best = Math.max(this.best, this.score);
            break;
          }
          if (!obstacle.passed && obstacle.x + obstacle.width < this.playerX) {
            obstacle.passed = true;
            this.cleared += 1;
          }
        }
        this.obstacles = this.obstacles.filter((obstacle) => obstacle.x + obstacle.width > -20);
      }
    }
  }

  const api = { RUNNER, overlaps, DashRunner };
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    window.QubicodeRunner = Object.assign(window.QubicodeRunner || {}, api);
  }
})();
