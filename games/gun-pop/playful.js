"use strict";

(() => {
  const root = document.documentElement;
  const motionButtons = [...document.querySelectorAll("[data-motion-toggle]")];
  let motionPaused = false;
  let refreshGallery = () => {};

  function syncMotion() {
    const paused = motionPaused || motionPreference.matches;
    root.classList.toggle("motion-paused", paused);
    root.classList.toggle("page-hidden", document.hidden);
    root.classList.toggle("video-playing", !video.paused && !video.ended);
    motionButtons.forEach(button => {
      button.hidden = motionPreference.matches;
      button.setAttribute("aria-pressed", String(paused));
      button.setAttribute("aria-label", paused ? "Resume animations" : "Pause animations");
      button.title = paused ? "Resume animations" : "Pause animations";
      const label = button.querySelector("span");
      if (label) label.textContent = paused ? "Resume motion" : "Pause motion";
    });
    refreshGallery();
  }
  motionButtons.forEach(button => button.addEventListener("click", () => {
    motionPaused = !motionPaused;
    syncMotion();
  }));
  document.addEventListener("visibilitychange", syncMotion);
  motionPreference.addEventListener("change", syncMotion);
  ["play", "pause", "ended"].forEach(event => video.addEventListener(event, syncMotion));

  // Phrases and colors come from the game's combo feedback profiles.
  const comboPhrases = [
    "DOUBLE POP!", "SUPER COMBO!", "ON FIRE!", "MEGA POP!",
    "LEGENDARY!", "HYPER COMBO!", "POP POP HOORAY!", "UNSTOPPABLE!",
    "COMBO COMET!", "HEATING UP!", "MAXIMUM COMBO!", "POP MASTER!"
  ];
  const comboPalettes = [
    "#ff285f,#ffe72a,#67ec20,#229dff,#ff3bcb",
    "#ffe432,#ffb30a,#ff7410,#fa1749",
    "#b6ffff,#23e6ff,#1385ff,#ddfbff",
    "#9432ff,#1bdaff,#d52bff,#ff36b7",
    "#36ffae,#0ddec9,#239fff,#f943e8",
    "#fff164,#ffd014,#ff9b08,#ff6317"
  ];

  // Decorative layers sit behind the content and never intercept input.
  const cloudAssets = [0, 1, 2].flatMap(index => showcase.themes.map(theme => theme.props[index]));
  const sections = [...document.querySelectorAll("main > section")];
  sections.forEach((section, sectionIndex) => {
    section.classList.add("motion-scene");
    if (section.matches(".build-facts")) return;
    const combos = document.createElement("div");
    combos.className = "ambient-combos";
    combos.setAttribute("aria-hidden", "true");
    [0, 1].forEach(side => {
      const phrase = document.createElement("span");
      phrase.className = `combo-flyby combo-flyby-${side ? "right" : "left"}`;
      let phraseIndex = (sectionIndex * 2 + side * 5) % comboPhrases.length;
      const updatePhrase = () => {
        phrase.textContent = comboPhrases[phraseIndex];
        phrase.style.setProperty("--combo-colors", comboPalettes[phraseIndex % comboPalettes.length]);
      };
      phrase.style.setProperty("--fly-duration", `${17 + (sectionIndex + side) % 5}s`);
      phrase.style.setProperty("--fly-delay", `${-(sectionIndex * 3.1 + side * 8 + 3)}s`);
      phrase.style.setProperty("--fly-top", `${(side ? 74 : 39) + sectionIndex % 3 * 4}%`);
      phrase.style.setProperty("--fly-x", `${side ? -54 : 54}px`);
      phrase.style.setProperty("--fly-tilt", `${side ? 10 : -12}deg`);
      updatePhrase();
      phrase.addEventListener("animationiteration", event => {
        if (event.animationName !== "combo-flyby") return;
        phraseIndex = (phraseIndex + 5) % comboPhrases.length;
        updatePhrase();
      });
      combos.append(phrase);
    });
    section.prepend(combos);
    if (section.matches(".target-section")) return;
    const backdrop = document.createElement("div");
    backdrop.className = "ambient-shutters";
    backdrop.setAttribute("aria-hidden", "true");
    [0, 1].forEach(side => {
      const themeIndex = (sectionIndex * 3 + side * 7) % showcase.themes.length;
      const propIndex = (sectionIndex + side) % 3;
      let targetIndex = propIndex * showcase.themes.length + themeIndex;
      const scene = document.createElement("div");
      scene.className = `shutter-scene shutter-${side ? "right" : "left"}`;
      scene.style.setProperty("--cycle", `${11 + (sectionIndex + side) % 5}s`);
      scene.style.setProperty("--phase", `${-(sectionIndex * 2.7 + side * 5.3 + 2)}s`);
      scene.style.setProperty("--tilt", `${side ? 7 : -9}deg`);
      scene.style.setProperty("--window-top", `${14 + sectionIndex % 3 * 9}%`);
      scene.style.setProperty("--window-bottom", `${7 + sectionIndex % 4 * 7}%`);
      const casing = document.createElement("div");
      casing.className = "shutter-casing";
      const target = document.createElement("img");
      target.className = "peek-target";
      target.src = cloudAssets[targetIndex].image;
      target.alt = "";
      target.width = 400;
      target.height = 400;
      target.loading = "lazy";
      target.decoding = "async";
      target.addEventListener("load", () => target.classList.add("is-ready"));
      if (target.complete && target.naturalWidth) target.classList.add("is-ready");
      target.addEventListener("animationiteration", event => {
        if (event.animationName !== "target-peek") return;
        // Swap behind closed doors. A seven-step stride visits all 48 props
        // and changes the family on every opening without consecutive repeats.
        targetIndex = (targetIndex + 7) % cloudAssets.length;
        target.classList.remove("is-ready");
        target.src = cloudAssets[targetIndex].image;
        if (target.complete && target.naturalWidth) target.classList.add("is-ready");
      });
      casing.append(target);
      ["left", "right"].forEach(direction => {
        const leaf = document.createElement("span");
        leaf.className = `shutter-leaf shutter-leaf-${direction}`;
        casing.append(leaf);
      });
      scene.append(casing);
      backdrop.append(scene);
    });
    section.prepend(backdrop);
  });

  const cloud = document.querySelector(".target-cloud");
  const columns = [-1, 7, 15, 23, 77, 85, 93, 101];
  cloudAssets.forEach((prop, index) => {
    const satellite = document.createElement("div");
    satellite.className = "target-satellite";
    const column = index % columns.length;
    const row = Math.floor(index / columns.length);
    satellite.style.setProperty("--x", `${columns[column] + (row % 2 ? 2 : -1)}%`);
    satellite.style.setProperty("--y", `${9 + row * 17 + column % 2 * 5}%`);
    satellite.style.setProperty("--size", `${82 + index * 13 % 37}px`);
    satellite.style.setProperty("--alpha", `${.34 + index % 4 * .065}`);
    satellite.style.setProperty("--tilt", `${(index * 19 % 52) - 26}deg`);
    satellite.style.setProperty("--float-duration", `${6 + index % 6}s`);
    satellite.style.setProperty("--float-delay", `${-(index * .73 % 9)}s`);
    satellite.style.setProperty("--mobile-x", `${index % 2 ? 99 : 1}%`);
    satellite.style.setProperty("--mobile-y", `${5 + Math.floor(index / 2) * 13}%`);
    const image = document.createElement("img");
    image.src = prop.image;
    image.alt = "";
    image.width = 400;
    image.height = 400;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("load", () => satellite.classList.add("is-ready"), { once: true });
    if (image.complete && image.naturalWidth) satellite.classList.add("is-ready");
    satellite.append(image);
    cloud.append(satellite);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle("is-in-view", entry.isIntersecting));
    }, { rootMargin: "40px 0px", threshold: 0 });
    sections.forEach(section => observer.observe(section));
  } else {
    sections.forEach(section => section.classList.add("is-in-view"));
  }

  const crate = document.querySelector(".crate-art");
  const crateButton = document.querySelector(".crate-button");
  const particles = document.querySelector(".crate-particles");
  let burstTimer = 0;
  crateButton.addEventListener("click", () => {
    if (motionPreference.matches || motionPaused) return;
    clearTimeout(burstTimer);
    crate.classList.remove("is-bursting");
    particles.replaceChildren();
    // Restart only this short, visitor-triggered effect on repeated taps.
    void crateButton.offsetWidth;
    crate.classList.add("is-bursting");
    const radius = Math.min(crate.clientWidth * .65, 270);
    const colors = ["#ffe278", "#d986ff", "#7ef7ec", "#ffa4e8", "#91cfff"];
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 24; index++) {
      const particle = document.createElement("i");
      const angle = index / 24 * Math.PI * 2;
      const distance = radius * (.7 + index % 4 * .1);
      particle.className = `crate-particle ${index % 4 === 0 ? "is-coin" : index % 2 ? "is-star" : ""}`;
      particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--dy", `${Math.sin(angle) * distance - 45}px`);
      particle.style.setProperty("--spin", `${index * 47 - 180}deg`);
      particle.style.setProperty("--particle-delay", `${index % 4 * 18}ms`);
      particle.style.setProperty("--particle-size", `${index % 4 === 0 ? 20 : 9 + index % 3 * 5}px`);
      particle.style.setProperty("--particle-color", colors[index % colors.length]);
      fragment.append(particle);
    }
    particles.append(fragment);
    burstTimer = setTimeout(() => {
      crate.classList.remove("is-bursting");
      particles.replaceChildren();
    }, 1200);
  });

  // Three identical sets allow rightward movement without a visible end jump.
  // Only the original 13 screenshots remain in the keyboard/accessibility order.
  const originals = [...galleryTrack.children];
  for (let copy = 0; copy < 2; copy++) {
    originals.forEach(figure => {
      const clone = figure.cloneNode(true);
      clone.classList.add("gallery-copy");
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("a").forEach(link => link.tabIndex = -1);
      galleryTrack.append(clone);
    });
  }
  galleryTrack.classList.add("is-looping");
  let cycleWidth = 0;
  let inView = false;
  let hovering = false;
  let dragging = false;
  let frame = 0;
  let previousTime = 0;
  let position = 0;
  let idleTimer = 0;
  let interactionUntil = 0;
  let initialized = false;

  function measureCycle() {
    const nextSet = galleryTrack.children[originals.length];
    if (!nextSet || motionPreference.matches) return;
    cycleWidth = nextSet.offsetLeft - originals[0].offsetLeft;
    if (!initialized && cycleWidth > 0) {
      galleryTrack.scrollLeft = cycleWidth;
      initialized = true;
    }
    position = galleryTrack.scrollLeft;
    refreshGallery();
  }
  function canMove() {
    return cycleWidth > 0 && inView && !motionPaused && !motionPreference.matches &&
      !document.hidden && !hovering && !dragging && !galleryTrack.matches(":focus-within") &&
      !lightbox.open && (video.paused || video.ended) && performance.now() >= interactionUntil;
  }
  function animate(time) {
    frame = 0;
    if (!canMove()) { previousTime = 0; return; }
    if (previousTime) {
      const elapsed = Math.min(time - previousTime, 64);
      position -= elapsed * .032;
      if (position < cycleWidth * .2) position += cycleWidth;
      if (position >= cycleWidth * 2) position -= cycleWidth;
      galleryTrack.scrollLeft = position;
    }
    previousTime = time;
    frame = requestAnimationFrame(animate);
  }
  refreshGallery = () => {
    if (canMove()) {
      if (!frame) {
        position = galleryTrack.scrollLeft;
        previousTime = 0;
        frame = requestAnimationFrame(animate);
      }
    } else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    }
  };
  function allowManualBrowsing() {
    interactionUntil = performance.now() + 5000;
    clearTimeout(idleTimer);
    refreshGallery();
    idleTimer = setTimeout(refreshGallery, 5050);
  }
  galleryTrack.addEventListener("pointerenter", event => {
    if (event.pointerType === "mouse") { hovering = true; refreshGallery(); }
  });
  galleryTrack.addEventListener("pointerleave", () => { hovering = false; refreshGallery(); });
  galleryTrack.addEventListener("pointerdown", () => { dragging = true; allowManualBrowsing(); });
  window.addEventListener("pointerup", () => {
    if (dragging) { dragging = false; allowManualBrowsing(); }
  });
  window.addEventListener("pointercancel", () => { dragging = false; refreshGallery(); });
  galleryTrack.addEventListener("wheel", allowManualBrowsing, { passive: true });
  galleryTrack.addEventListener("keydown", allowManualBrowsing);
  galleryTrack.addEventListener("focusin", refreshGallery);
  galleryTrack.addEventListener("focusout", () => setTimeout(refreshGallery, 0));
  document.querySelectorAll(".gallery-scroll[data-direction]").forEach(button => {
    button.addEventListener("click", allowManualBrowsing);
  });
  lightbox.addEventListener("close", refreshGallery);
  if ("MutationObserver" in window) {
    new MutationObserver(refreshGallery).observe(lightbox, { attributes: true, attributeFilter: ["open"] });
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      refreshGallery();
    }, { threshold: .05 }).observe(galleryTrack);
  } else {
    inView = true;
  }
  if ("ResizeObserver" in window) new ResizeObserver(measureCycle).observe(galleryTrack);
  window.addEventListener("resize", measureCycle);
  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) {
      galleryTrack.scrollLeft = 0;
      initialized = false;
    } else {
      measureCycle();
    }
  });
  measureCycle();
  syncMotion();
})();
