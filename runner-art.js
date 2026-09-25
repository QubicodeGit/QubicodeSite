(() => {
  "use strict";

  // Source rectangles in the player, obstacle, and scenery WebP atlases.
  // The images retain their original dimensions; no generated frames are used.
  const SPRITES = Object.freeze({
    // Anchor each pose at its helmet so changing leg positions does not slide it sideways.
    idle: { x: 9, y: 19, width: 95, height: 209, anchorX: 50 },
    run1: { x: 123, y: 26, width: 147, height: 198, anchorX: 99 },
    run2: { x: 287, y: 21, width: 133, height: 205, anchorX: 82 },
    run3: { x: 427, y: 31, width: 142, height: 198, anchorX: 94 },
    jump: { x: 589, y: 19, width: 154, height: 190, anchorX: 102 },
    duck1: { x: 173, y: 257, width: 193, height: 145, anchorX: 146 },
    duck2: { x: 6, y: 257, width: 134, height: 145, anchorX: 88 },
    duck3: { x: 393, y: 256, width: 173, height: 140, anchorX: 120 },
    car: { x: 4, y: 14, width: 357, height: 103 },
    cloud: { x: 434, y: 31, width: 139, height: 75 },
  });

  const SCENERY = Object.freeze({
    city: { x: 17, y: 47, width: 2138, height: 358 },
    lamps: [
      { x: 226, y: 436, width: 213, height: 266 },
      { x: 471, y: 439, width: 414, height: 264 },
      { x: 940, y: 446, width: 186, height: 257 },
      { x: 1187, y: 456, width: 79, height: 248 },
    ],
    moon: { x: 1585, y: 405, width: 329, height: 307 },
    citySpeed: .12,
    lampSpacing: 440,
    moonCrossingSeconds: 300,
  });

  function runnerFrame(game, reducedMotion = false) {
    if (!game.grounded) return "jump";
    if (game.state !== "playing") return "idle";
    // Insert the passing pose between both strides, keeping the original cadence.
    const step = reducedMotion ? 0 : Math.floor(game.distance / 21) % 4;
    const pose = [1, 2, 3, 2][step];
    return `${game.crouched ? "duck" : "run"}${pose}`;
  }

  // Five minutes of active play from its initial position to completely offscreen.
  // Scenery time is preserved across runs and frozen while paused/offscreen.
  function moonPosition(width, moonWidth, elapsed) {
    const start = width * .82;
    const progress = Math.min(1, Math.max(0, elapsed) / SCENERY.moonCrossingSeconds);
    return start - (start + moonWidth) * progress;
  }

  const api = { SPRITES, SCENERY, runnerFrame, moonPosition };
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    window.QubicodeRunner = Object.assign(window.QubicodeRunner || {}, api);
  }
})();
