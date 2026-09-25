(() => {
  "use strict";

  const { DashRunner, RUNNER, SPRITES, SCENERY, runnerFrame, moonPosition } = window.QubicodeRunner;
  // Resolve local images from this script for both file:// and GitHub Pages paths.
  const artBase = new URL("./Images/runner/", document.currentScript.src);

  const panel = document.querySelector(".runner");
  const canvas = document.querySelector("#runner-canvas");
  const context = canvas?.getContext("2d");

  if (panel && context) {
    const stage = panel.querySelector(".runner-stage");
    const overlay = panel.querySelector(".runner-overlay");
    const title = panel.querySelector("#runner-prompt-title");
    const copy = panel.querySelector("#runner-prompt-copy");
    const kicker = panel.querySelector("#runner-kicker");
    const startButton = panel.querySelector(".runner-start");
    const pauseButton = panel.querySelector(".runner-pause");
    const jumpButton = panel.querySelector("#runner-jump");
    const duckButton = panel.querySelector("#runner-duck");
    const scoreLabel = panel.querySelector("#runner-score");
    const bestLabel = panel.querySelector("#runner-best");
    const status = panel.querySelector("#runner-status");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const game = new DashRunner();
    const art = {};
    let ready = false;
    let loading = false;
    let visible = false;
    let frame = 0;
    let lastTime = 0;
    let width = 1120;
    let height = 310;
    let scale = 1;
    let dpr = 1;
    let lastScore = -1;
    let sceneryElapsed = 0;
    let sceneryDistance = 0;
    let cityCache = null;
    let cityWidth = 0;
    let cityHeight = 0;

    function drawSprite(image, sprite, x, y, spriteWidth, spriteHeight, ctx = context) {
      if (!image) return;
      ctx.drawImage(image, sprite.x, sprite.y, sprite.width, sprite.height,
        x, y, spriteWidth, spriteHeight);
    }

    function prepareCity() {
      if (!art.scenery) return;
      cityHeight = Math.min(240, (height - 6) * .72);
      cityWidth = cityHeight * SCENERY.city.width / SCENERY.city.height;
      cityCache = document.createElement("canvas");
      cityCache.width = Math.ceil(cityWidth * dpr * scale);
      cityCache.height = Math.ceil(cityHeight * dpr * scale);
      const ctx = cityCache.getContext("2d");
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
      ctx.globalAlpha = .42;
      drawSprite(art.scenery, SCENERY.city, 0, 0, cityWidth, cityHeight, ctx);
      // Tint once when the viewport changes, rather than applying filters per frame.
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = "#040b143d";
      ctx.fillRect(0, 0, cityWidth, cityHeight);
    }

    function drawScenery(ground) {
      const movingDistance = reducedMotion.matches ? 0 : sceneryDistance;
      if (art.scenery) {
        const moonWidth = 98;
        const moonHeight = moonWidth * SCENERY.moon.height / SCENERY.moon.width;
        const moonX = moonPosition(width, moonWidth, reducedMotion.matches ? 0 : sceneryElapsed);
        const moonY = Math.max(58, ground - cityHeight - 60);
        context.globalAlpha = .78;
        drawSprite(art.scenery, SCENERY.moon, moonX, moonY, moonWidth, moonHeight);
        context.globalAlpha = 1;
      }
      if (cityCache) {
        const offset = movingDistance * SCENERY.citySpeed % cityWidth;
        for (let x = -offset; x < width; x += cityWidth) {
          context.drawImage(cityCache, x, ground - cityHeight, cityWidth, cityHeight);
        }
      }
      if (art.scenery) {
        const spacing = SCENERY.lampSpacing;
        const first = Math.floor(movingDistance / spacing);
        const offset = movingDistance % spacing;
        context.globalAlpha = .43;
        for (let i = -1; i <= Math.ceil(width / spacing); i += 1) {
          const lamp = SCENERY.lamps[((first + i) % SCENERY.lamps.length + SCENERY.lamps.length) % SCENERY.lamps.length];
          const lampHeight = 148;
          const lampWidth = lampHeight * lamp.width / lamp.height;
          drawSprite(art.scenery, lamp, i * spacing + 35 - offset,
            ground - lampHeight, lampWidth, lampHeight);
        }
        context.globalAlpha = 1;
      }
      context.fillStyle = "#122635";
      context.fillRect(0, ground, width, 6);
      context.fillStyle = "#285268";
      context.fillRect(0, ground, width, 1);
      context.fillStyle = "#0b1524";
      context.fillRect(0, ground + 3, width, 3);
    }

    function drawDriver(ground) {
      const sprite = SPRITES[runnerFrame(game, reducedMotion.matches)];
      // Keep the supplied poses at one scale and align their feet to the road.
      const spriteScale = RUNNER.playerHeight / SPRITES.run1.height;
      const spriteWidth = sprite.width * spriteScale;
      const spriteHeight = sprite.height * spriteScale;
      const bodyWidth = game.crouched ? RUNNER.duckWidth : RUNNER.playerWidth;
      const headX = bodyWidth * (game.crouched ? .74 : .67);
      const x = game.playerX + headX - sprite.anchorX * spriteScale;
      const y = ground - game.height - spriteHeight;
      context.fillStyle = "#01070c66";
      context.beginPath();
      context.ellipse(game.playerX + bodyWidth / 2, ground, bodyWidth * .36, 2, 0, 0, Math.PI * 2);
      context.fill();
      drawSprite(art.player, sprite, x, y, spriteWidth, spriteHeight);
    }

    function drawObstacle(obstacle, ground) {
      drawSprite(art.sprites, SPRITES[obstacle.kind], obstacle.x, ground + obstacle.y,
        obstacle.width, obstacle.height);
    }

    function render() {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
      const ground = height - 6;
      drawScenery(ground);
      if (game.state === "ready") {
        drawObstacle({ kind: "car", x: width * .78, y: -51, width: 176, height: 51 }, ground);
        drawObstacle({ kind: "cloud", x: width * .56, y: -116, width: 90, height: 49 }, ground);
      }
      for (const obstacle of game.obstacles) drawObstacle(obstacle, ground);
      drawDriver(ground);
      if (lastScore !== game.score) {
        lastScore = game.score;
        scoreLabel.textContent = String(game.score).padStart(5, "0");
      }
    }

    function stopFrames() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    }

    function syncUI(message = "") {
      panel.dataset.state = game.state;
      overlay.hidden = game.state === "playing";
      const playing = game.state === "playing";
      pauseButton.disabled = !playing && game.state !== "paused";
      pauseButton.setAttribute("aria-label", game.state === "paused" ? "Resume game" : "Pause game");
      pauseButton.title = game.state === "paused" ? "Resume game (P)" : "Pause game (P)";
      pauseButton.querySelector("path").setAttribute("d", game.state === "paused" ? "m9 5 10 7-10 7Z" : "M8 5v14M16 5v14");
      jumpButton.disabled = !playing;
      duckButton.disabled = !playing;
      duckButton.setAttribute("aria-pressed", String(game.ducking));
      bestLabel.textContent = String(game.best).padStart(5, "0");
      if (game.state === "paused") {
        kicker.textContent = "Game paused";
        title.textContent = "Paused.";
        copy.textContent = "Your run is right where you left it.";
        startButton.textContent = "Resume";
      } else if (game.state === "gameover") {
        kicker.textContent = `${game.score} POINTS / ${game.cleared} OBSTACLES CLEARED`;
        title.textContent = "One more run?";
        copy.textContent = game.crash === "cloud" ? "Hold down to duck under the clouds." : "Jump over the cars.";
        startButton.textContent = "Retry";
      }
      if (message) status.textContent = message;
    }

    function tick(timestamp) {
      frame = 0;
      if (game.state !== "playing" || !visible || document.hidden) return;
      if (lastTime) {
        const delta = Math.max(0, (timestamp - lastTime) / 1000);
        const previousDistance = game.distance;
        game.step(Math.min(delta, .05));
        if (!reducedMotion.matches) {
          sceneryDistance += game.distance - previousDistance;
          sceneryElapsed += delta;
        }
      }
      lastTime = timestamp;
      render();
      if (game.state === "gameover") {
        stopFrames();
        syncUI(`Run over. ${game.score} points. ${game.cleared} obstacles cleared. Press Space or choose Retry.`);
      } else {
        frame = requestAnimationFrame(tick);
      }
    }

    function play() {
      if (!ready || !visible || document.hidden) return;
      stopFrames();
      if (game.state === "paused") game.resume();
      else game.start();
      syncUI("Run started. Space or up to jump, hold down to duck. P pauses.");
      canvas.focus({ preventScroll: true });
      frame = requestAnimationFrame(tick);
    }

    function pause(message = "Game paused. Choose Resume when you are ready.") {
      if (game.state !== "playing") return;
      game.pause();
      stopFrames();
      syncUI(message);
      render();
    }

    function duck(value) {
      game.setDuck(value);
      duckButton.setAttribute("aria-pressed", String(game.ducking));
    }

    function resize() {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // Retain enough warning distance on a narrow phone screen.
      scale = Math.min(1, rect.width / 640);
      width = rect.width / scale;
      height = rect.height / scale;
      game.resize(width);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      prepareCity();
      // Resizing must not cost the player a life or create an unseen obstacle.
      pause("Game paused after resizing. Choose Resume when you are ready.");
      render();
    }

    async function loadArt() {
      if (loading) return;
      loading = true;
      await Promise.all([["player", "player"], ["sprites", "sprites"], ["scenery", "city-atlas"]].map(async ([name, file]) => {
        const img = new Image();
        img.decoding = "async";
        await new Promise((resolve) => {
          img.onload = () => { art[name] = img; resolve(); };
          img.onerror = resolve;
          img.src = new URL(`${file}.webp`, artBase).href;
        });
      }));
      if (!art.player || !art.sprites) {
        title.textContent = "Game art could not load.";
        copy.textContent = "Refresh the page to try again.";
        startButton.textContent = "Unavailable";
        status.textContent = "The game artwork could not load. Refresh the page to try again.";
        return;
      }
      prepareCity();
      ready = true;
      startButton.disabled = false;
      startButton.textContent = "Play";
      syncUI("Ready to play. Choose Play. Space or up to jump over cars, hold down to duck under clouds.");
      render();
    }

    startButton.addEventListener("click", play);
    pauseButton.addEventListener("click", () => game.state === "paused" ? play() : pause());
    jumpButton.addEventListener("click", () => game.jump());
    canvas.addEventListener("pointerdown", () => {
      canvas.focus({ preventScroll: true });
      if (game.state === "playing") game.jump();
      else play();
    });
    duckButton.addEventListener("pointerdown", (event) => {
      if (game.state !== "playing" || event.button !== 0) return;
      event.preventDefault();
      duckButton.setPointerCapture(event.pointerId);
      duck(true);
    });
    for (const event of ["pointerup", "pointercancel", "lostpointercapture"]) {
      duckButton.addEventListener(event, () => duck(false));
    }
    // Keyboard activation of the on-screen button toggles duck without a held pointer.
    duckButton.addEventListener("click", (event) => {
      if (event.detail === 0) duck(!game.ducking);
    });
    panel.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const key = event.key.toLowerCase();
      if ((key === " " || key === "enter") && event.target.closest("button, a")) return;
      if ([" ", "arrowup", "w"].includes(key)) {
        event.preventDefault();
        if (event.repeat) return;
        if (game.state === "playing") game.jump();
        else play();
      } else if (["arrowdown", "s"].includes(key)) {
        event.preventDefault();
        duck(true);
      } else if ((key === "p" || key === "escape") && !event.repeat) {
        event.preventDefault();
        if (game.state === "paused" && key === "p") play();
        else pause();
      }
    });
    window.addEventListener("keyup", (event) => {
      if (["arrowdown", "s"].includes(event.key.toLowerCase())) duck(false);
    });
    panel.addEventListener("focusout", (event) => {
      // During focusout, activeElement can still be the document body. The new
      // target prevents a click on an in-game control from briefly pausing first.
      if (!panel.contains(event.relatedTarget)) pause();
    });
    window.addEventListener("blur", () => pause());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pause("Game paused while the tab is hidden. Choose Resume to continue.");
    });
    reducedMotion.addEventListener("change", () => render());

    resize();
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(stage);
    else window.addEventListener("resize", resize, { passive: true });
    if ("IntersectionObserver" in window) {
      const loader = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        loadArt();
        loader.disconnect();
      }, { rootMargin: "400px" });
      loader.observe(panel);
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= .2;
        if (!visible) pause("Game paused while off screen. Choose Resume to continue.");
      }, { threshold: [0, .2] }).observe(stage);
    } else {
      visible = true;
      loadArt();
    }
  } else if (panel) {
    panel.querySelector("#runner-prompt-title").textContent = "A pit stop for another browser.";
    panel.querySelector("#runner-prompt-copy").textContent = "This mini game needs a browser with canvas support.";
    panel.querySelector(".runner-start").hidden = true;
  }
})();
