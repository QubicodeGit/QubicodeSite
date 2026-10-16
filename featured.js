(() => {
  const carousel = document.querySelector("[data-featured-carousel]");
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll("[data-feature-slide]")];
  const tabs = [...carousel.querySelectorAll("[data-feature-tab]")];
  const stage = carousel.querySelector("[data-feature-stage]");
  const tabList = carousel.querySelector("[data-feature-tabs]");
  const progress = carousel.querySelector("[data-feature-progress]");
  const toggle = carousel.querySelector("[data-feature-toggle]");
  const announcement = carousel.querySelector("[data-feature-status]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileMotion = window.matchMedia("(max-width: 900px), (hover: none), (pointer: coarse)");
  const mobileLayout = window.matchMedia("(max-width: 600px)");
  const duration = 8000;
  let activeIndex = 0;
  let elapsed = 0;
  let lastFrame = null;
  let frame = 0;
  let inView = false;
  let paused = reducedMotion.matches;
  let hovered = false;
  let touchStart = null;
  let suppressClick = false;

  const canRotate = () => inView && !document.hidden && !mobileMotion.matches && !paused && !hovered;

  function updateToggle() {
    toggle.dataset.paused = String(paused);
    toggle.setAttribute("aria-label", paused ? "Resume automatic rotation" : "Pause automatic rotation");
  }

  function selectFeature(index, announce = false) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === activeIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.inert = !active;
      tabs[slideIndex].classList.toggle("is-active", active);
      tabs[slideIndex].setAttribute("aria-selected", String(active));
      tabs[slideIndex].tabIndex = active ? 0 : -1;
    });
    elapsed = 0;
    lastFrame = canRotate() ? performance.now() : null;
    progress.style.transform = "scaleX(0)";
    if (announce) {
      const name = tabs[activeIndex].getAttribute("aria-label") || tabs[activeIndex].textContent.trim();
      announcement.textContent = `Feature ${activeIndex + 1} of ${slides.length}: ${name}`;
    }
  }

  function stopClock() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = null;
  }

  function tick(now) {
    if (!canRotate()) {
      stopClock();
      return;
    }
    if (lastFrame !== null) elapsed += now - lastFrame;
    if (elapsed >= duration) {
      const remainder = elapsed % duration;
      selectFeature(activeIndex + 1);
      elapsed = remainder;
    }
    lastFrame = now;
    progress.style.transform = `scaleX(${Math.min(elapsed / duration, 1)})`;
    frame = requestAnimationFrame(tick);
  }

  function syncClock() {
    carousel.dataset.rotation = canRotate() ? "playing" : "paused";
    if (canRotate()) {
      if (!frame) {
        lastFrame = performance.now();
        frame = requestAnimationFrame(tick);
      }
    } else stopClock();
  }

  tabs.forEach((tab, index) => {
    tab.disabled = false;
    tab.addEventListener("click", () => selectFeature(index, true));
    tab.addEventListener("keydown", (event) => {
      const offsets = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      let next = index;
      if (event.key in offsets) next = (index + offsets[event.key] + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      selectFeature(next, true);
    });
  });

  carousel.querySelector("[data-feature-previous]").addEventListener("click", () => selectFeature(activeIndex - 1, true));
  carousel.querySelector("[data-feature-next]").addEventListener("click", () => selectFeature(activeIndex + 1, true));
  toggle.addEventListener("click", () => {
    paused = !paused;
    updateToggle();
    syncClock();
  });
  carousel.querySelectorAll(".feature-control").forEach((control) => { control.hidden = false; });

  stage.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse") return;
    hovered = true;
    syncClock();
  });
  stage.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse") return;
    hovered = false;
    syncClock();
  });

  stage.addEventListener("pointerdown", (event) => {
    suppressClick = false;
    if (event.pointerType !== "touch" || event.target.closest("button")) return;
    touchStart = { x: event.clientX, y: event.clientY };
  });
  stage.addEventListener("pointerup", (event) => {
    if (!touchStart) return;
    const x = event.clientX - touchStart.x;
    const y = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(x) < 45 || Math.abs(x) < Math.abs(y) * 1.3) return;
    suppressClick = true;
    selectFeature(activeIndex + (x < 0 ? 1 : -1), true);
  });
  stage.addEventListener("pointercancel", () => { touchStart = null; });
  stage.addEventListener("click", (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    suppressClick = false;
  }, true);

  const updateOrientation = () => tabList.setAttribute("aria-orientation", mobileLayout.matches ? "horizontal" : "vertical");
  mobileLayout.addEventListener("change", updateOrientation);
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) paused = true;
    updateToggle();
    syncClock();
  });
  mobileMotion.addEventListener("change", syncClock);
  document.addEventListener("visibilitychange", syncClock);
  window.addEventListener("pagehide", stopClock);
  window.addEventListener("pageshow", syncClock);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= .15;
      syncClock();
    }, { threshold: [0, .15] }).observe(stage);
  } else inView = true;

  selectFeature(0);
  updateOrientation();
  updateToggle();
  syncClock();
})();
