import test from "node:test";
import assert from "node:assert/strict";
import engine from "../runner-engine.js";
import art from "../runner-art.js";

const { DashRunner, RUNNER, overlaps } = engine;
const { runnerFrame, moonPosition, SCENERY } = art;

function advance(game, seconds) {
  for (let time = 0; time < seconds; time += 1 / 120) game.step(1 / 120);
}

function obstacle(kind, x = 270) {
  return kind === "car"
    ? { kind, x, y: -51, width: 176, height: 51 }
    : { kind, x, y: -116, width: 90, height: 49 };
}

function isolatedGame() {
  const game = new DashRunner({ width: 640, random: () => .5 });
  game.start();
  game.untilSpawn = Infinity;
  return game;
}

test("a car collision ends the run and retains the best score after restarting", () => {
  const game = isolatedGame();
  game.obstacles = [obstacle("car")];
  advance(game, 1);
  assert.equal(game.state, "gameover");
  assert.equal(game.crash, "car");
  assert.ok(game.score > 0);
  const score = game.score;
  game.start();
  assert.equal(game.best, score);
  assert.equal(game.score, 0);
  assert.equal(game.obstacles.length, 0);
});

test("a well-timed jump clears a car and lands without a second midair jump", () => {
  const game = isolatedGame();
  game.obstacles = [obstacle("car", 210)];
  assert.equal(game.jump(), true);
  assert.equal(game.jump(), false);
  advance(game, 1.1);
  assert.equal(game.state, "playing");
  assert.equal(game.cleared, 1);
  assert.equal(game.height, 0);
  assert.equal(game.velocity, 0);
});

test("clouds hit a standing character but pass safely over a ducking character", () => {
  const standing = isolatedGame();
  standing.obstacles = [obstacle("cloud")];
  advance(standing, 1);
  assert.equal(standing.state, "gameover");
  assert.equal(standing.crash, "cloud");
  const ducking = isolatedGame();
  ducking.obstacles = [obstacle("cloud")];
  ducking.setDuck(true);
  advance(ducking, 1);
  assert.equal(ducking.state, "playing");
  assert.equal(ducking.cleared, 1);
  ducking.setDuck(false);
  assert.equal(ducking.crouched, false);
});

test("ducking does not allow the player to pass through cars", () => {
  const game = isolatedGame();
  game.obstacles = [obstacle("car")];
  game.setDuck(true);
  advance(game, 1);
  assert.equal(game.state, "gameover");
});

test("pause freezes score, physics and obstacles and releases held duck", () => {
  const game = isolatedGame();
  game.obstacles = [obstacle("car", 500)];
  game.jump();
  advance(game, .2);
  game.setDuck(true);
  game.pause();
  const snapshot = [game.height, game.distance, game.obstacles[0].x];
  advance(game, 5);
  assert.deepEqual([game.height, game.distance, game.obstacles[0].x], snapshot);
  assert.equal(game.ducking, false);
  assert.equal(game.jump(), false);
  game.resume();
  advance(game, .1);
  assert.ok(game.distance > snapshot[1]);
});

test("spawns introduce cars before clouds with recoverable spacing at max speed", () => {
  const game = isolatedGame();
  game.speed = RUNNER.maxSpeed;
  for (let i = 0; i < 3; i++) {
    game.spawn();
    assert.ok(game.untilSpawn >= RUNNER.maxSpeed * 1.25 + 176);
    assert.ok(game.obstacles.at(-1).x > game.width);
  }
  assert.deepEqual(game.obstacles.map((item) => item.kind), ["car", "car", "cloud"]);
});

test("both obstacles remain beatable at maximum speed", () => {
  const jumping = isolatedGame();
  jumping.elapsed = 100;
  jumping.obstacles = [obstacle("car", 275)];
  jumping.jump();
  advance(jumping, 1);
  assert.equal(jumping.state, "playing");
  assert.equal(jumping.cleared, 1);
  const ducking = isolatedGame();
  ducking.elapsed = 100;
  ducking.obstacles = [obstacle("cloud")];
  ducking.setDuck(true);
  advance(ducking, 1);
  assert.equal(ducking.state, "playing");
  assert.equal(ducking.cleared, 1);
});

test("a slow frame still catches collisions and invalid deltas do nothing", () => {
  const game = isolatedGame();
  game.elapsed = 100;
  game.obstacles = [obstacle("cloud", 200)];
  game.step(2);
  assert.equal(game.state, "gameover");
  const idle = isolatedGame();
  idle.step(NaN);
  idle.step(-1);
  assert.equal(idle.distance, 0);
  assert.equal(overlaps({x: 0, y: 0, width: 10, height: 10}, {x: 10, y: 0, width: 10, height: 10}), false);
});

test("running and ducking pass through their in-between pose on both halves of a stride", () => {
  const game = isolatedGame();
  for (const crouched of [false, true]) {
    game.setDuck(crouched);
    const frames = [0, 22, 43, 64, 85].map((distance) => {
      game.distance = distance;
      return runnerFrame(game);
    });
    const pose = crouched ? "duck" : "run";
    assert.deepEqual(frames, [pose + "1", pose + "2", pose + "3", pose + "2", pose + "1"]);
  }
  assert.equal(runnerFrame(game, true), "duck1");
  game.jump();
  assert.equal(runnerFrame(game), "jump");
});

test("idle is used while waiting or stopped, and pausing in midair preserves the jump pose", () => {
  const game = new DashRunner();
  assert.equal(runnerFrame(game), "idle");
  game.start();
  game.pause();
  assert.equal(runnerFrame(game), "idle");
  game.resume();
  game.jump();
  game.pause();
  assert.equal(runnerFrame(game), "jump");
  const crashed = isolatedGame();
  crashed.obstacles = [obstacle("car")];
  advance(crashed, 1);
  assert.equal(crashed.state, "gameover");
  assert.equal(runnerFrame(crashed), "idle");
});

test("the moon crosses right to left and fully exits at five minutes", () => {
  for (const width of [640, 1280, 1920]) {
    const start = moonPosition(width, 98, 0);
    const half = moonPosition(width, 98, 150);
    assert.ok(start > width * .8);
    assert.ok(half < start && half > 0);
    assert.ok(moonPosition(width, 98, 299) + 98 > 0);
    assert.equal(moonPosition(width, 98, 300), -98);
    assert.equal(moonPosition(width, 98, 600), -98);
  }
  assert.ok(SCENERY.citySpeed > 0 && SCENERY.citySpeed < 1);
});

test("resizing preserves the distance to an approaching obstacle", () => {
  const game = isolatedGame();
  game.obstacles = [obstacle("car", game.playerX + 145)];
  game.pause();
  game.resize(1920);
  assert.equal(game.obstacles[0].x - game.playerX, 145);
  game.resize(640);
  assert.equal(game.obstacles[0].x - game.playerX, 145);
  game.resume();
  game.jump();
  advance(game, 1.2);
  assert.equal(game.state, "playing");
  assert.equal(game.cleared, 1);
});
