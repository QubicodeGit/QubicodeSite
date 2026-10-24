(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");
  document.querySelector("#year").textContent = new Date().getFullYear();

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  function closeNavigation() {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
  }
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeNavigation));
  document.addEventListener("click", event => {
    if (!event.target.closest(".site-header")) closeNavigation();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeNavigation();
      navToggle.focus();
    }
  });
  window.matchMedia("(min-width: 821px)").addEventListener("change", event => {
    if (event.matches) closeNavigation();
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionToggle = document.querySelector(".motion-toggle");
  let motionPaused = false;
  function syncMotion() {
    const paused = motionPaused || reducedMotion.matches;
    root.classList.toggle("motion-paused", paused);
    root.classList.toggle("page-hidden", document.hidden);
    motionToggle.setAttribute("aria-pressed", String(!paused));
    motionToggle.title = reducedMotion.matches ? "Reduced motion is enabled in your device settings" : paused ? "Resume atmosphere" : "Pause atmosphere";
    motionToggle.querySelector("span").textContent = paused ? "Motion off" : "Motion on";
    motionToggle.disabled = reducedMotion.matches;
  }
  motionToggle.hidden = false;
  motionToggle.addEventListener("click", () => { motionPaused = !motionPaused; syncMotion(); });
  reducedMotion.addEventListener("change", syncMotion);
  document.addEventListener("visibilitychange", syncMotion);
  syncMotion();

  // Keep the active layer count small; only six streaks are shown on phones.
  const rain = document.querySelector(".rain");
  const streaks = document.createDocumentFragment();
  for (let index = 0; index < 12; index++) {
    const streak = document.createElement("i");
    streak.style.cssText = `--x:${(index * 37) % 105}%;--y:${(index * 17) % 65 - 25}%;--length:${25 + index % 5 * 9}px;--speed:${1.2 + index % 7 * .12}s;--delay:${-index * .37}s`;
    streaks.append(streak);
  }
  rain.append(streaks);

  document.querySelectorAll("[data-fog]").forEach(scene => {
    const fog = document.createElement("div");
    fog.className = "fog-field";
    fog.setAttribute("aria-hidden", "true");
    const bank = document.createElement("i");
    bank.className = "fog-bank";
    fog.append(bank);
    scene.append(fog);
  });

  // Animate the opacity of one small HTML layer around the cabin, rather than
  // repainting SVG groups on a layer the size of the entire photograph.
  const cabin = { x: 1110, y: 70, width: 390, height: 274 };
  const lightMaps = new Map();
  function alignTrainLights(image) {
    const map = lightMaps.get(image);
    const width = image.clientWidth;
    const height = image.clientHeight;
    if (!width || !height) { map.hidden = true; return; }
    const scale = Math.max(width / 1516, height / 853);
    const [horizontal, vertical] = getComputedStyle(image).objectPosition.split(" ").map(value => parseFloat(value) / 100);
    const left = (width - 1516 * scale) * horizontal + cabin.x * scale;
    const top = (height - 853 * scale) * vertical + cabin.y * scale;
    map.hidden = left >= width || left + cabin.width * scale <= 0 || top >= height || top + cabin.height * scale <= 0;
    map.style.width = `${cabin.width * scale}px`;
    map.style.height = `${cabin.height * scale}px`;
    map.style.left = `${image.offsetLeft + left}px`;
    map.style.top = `${image.offsetTop + top}px`;
    map.classList.add("aligned");
  }
  const lightObserver = "ResizeObserver" in window ? new ResizeObserver(entries => entries.forEach(entry => alignTrainLights(entry.target))) : null;
  document.querySelectorAll(".hero-image, #panel-prepare > img").forEach((image, index) => {
    const map = document.createElement("span");
    const gradient = `cabin-glow-${index}`;
    map.setAttribute("class", "train-light-map");
    map.setAttribute("aria-hidden", "true");
    map.innerHTML = `<svg viewBox="1110 70 390 274" aria-hidden="true" focusable="false"><defs><radialGradient id="${gradient}"><stop stop-color="#ffd18a" stop-opacity=".48"/><stop offset=".38" stop-color="#e9a84f" stop-opacity=".19"/><stop offset="1" stop-color="#e9a84f" stop-opacity="0"/></radialGradient></defs><ellipse cx="1305" cy="207" rx="195" ry="137" fill="url(#${gradient})"/><g><path d="M1217 175 1382 125 1389 239 1221 269Z" fill="#ffc477" fill-opacity=".29"/><path d="m1221 265 165-29-1 5-163 29Z" fill="#ffca7d" fill-opacity=".65"/></g><g fill="#ffe1a2"><rect x="1229" y="194" width="18" height="2.5"/><rect x="1230" y="202" width="11" height="2"/><rect x="1243" y="202" width="7" height="2"/></g></svg>`;
    image.insertAdjacentElement("afterend", map);
    lightMaps.set(image, map);
    alignTrainLights(image);
    lightObserver?.observe(image);
  });
  if (!lightObserver) window.addEventListener("resize", () => lightMaps.forEach((map, image) => alignTrainLights(image)), { passive: true });

  if ("IntersectionObserver" in window) {
    const reveals = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          reveals.unobserve(entry.target);
        }
      });
    }, { threshold: .04, rootMargin: "0px 0px -15px 0px" });
    document.querySelectorAll(".reveal").forEach(element => reveals.observe(element));
    const atmosphere = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle("in-view", entry.isIntersecting));
    });
    document.querySelectorAll(".atmospheric").forEach(element => atmosphere.observe(element));
  } else {
    document.querySelectorAll(".reveal").forEach(element => element.classList.add("visible"));
    document.querySelectorAll(".atmospheric").forEach(element => element.classList.add("in-view"));
  }

  const tabs = [...document.querySelectorAll(".journey-tab")];
  const panels = [...document.querySelectorAll(".journey-panel")];
  function selectPhase(index, focus = false) {
    tabs.forEach((tab, position) => {
      const selected = position === index;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[position].hidden = !selected;
      panels[position].classList.toggle("active", selected);
    });
    if (index === 0 && !lightObserver) alignTrainLights(panels[0].querySelector("img"));
    if (focus) tabs[index].focus({ preventScroll: true });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectPhase(index));
    tab.addEventListener("keydown", event => {
      let next = index;
      if (["ArrowDown", "ArrowRight"].includes(event.key)) next = (index + 1) % tabs.length;
      else if (["ArrowUp", "ArrowLeft"].includes(event.key)) next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectPhase(next, true);
    });
  });

  const shots = [
    { file: "research-compound", label: "The research compound", alt: "An armored scientist outside the A1 research compound", width: 1584, height: 891 },
    { file: "ash-forest", label: "Into the treeline", alt: "A first-person view of a foggy conifer forest", width: 1580, height: 889 },
    { file: "relay-console", label: "Make contact", alt: "A green WRC radio relay terminal requesting a keycard scan", width: 1584, height: 891 },
    { file: "storm-approach", label: "Through the storm", alt: "A pistol held toward an industrial building in an orange dust storm", width: 1586, height: 892 },
    { file: "buried-city", label: "A world buried", alt: "A ruined settlement disappearing into desert dust", width: 1582, height: 890 },
    { file: "desert-railway", label: "Follow the tracks", alt: "A railway curving toward a distant tower in a sand-covered landscape", width: 1520, height: 855 },
    { file: "crew-train", label: "All crew aboard", alt: "Three teammates beside the armored train in the rain", width: 1516, height: 853 }
  ];
  const source = shot => `images/captured/${shot.file}.jpg`;
  const normalize = index => (index + shots.length) % shots.length;
  const count = index => `${String(index + 1).padStart(2, "0")} / ${String(shots.length).padStart(2, "0")}`;
  const galleryImage = document.querySelector("#gallery-image");
  const galleryOpen = document.querySelector(".gallery-open");
  const thumbs = [...document.querySelectorAll(".gallery-thumb")];
  let selectedShot = 6;
  function setImage(image, shot) {
    image.src = source(shot);
    image.alt = shot.alt;
    image.width = shot.width;
    image.height = shot.height;
  }
  function selectShot(index) {
    selectedShot = normalize(index);
    const shot = shots[selectedShot];
    setImage(galleryImage, shot);
    galleryOpen.href = source(shot);
    galleryOpen.setAttribute("aria-label", `Enlarge screenshot: ${shot.label}`);
    document.querySelector("#gallery-count").textContent = count(selectedShot);
    document.querySelector("#gallery-caption").textContent = shot.label;
    thumbs.forEach((thumb, position) => {
      thumb.classList.toggle("selected", position === selectedShot);
      if (position === selectedShot) thumb.setAttribute("aria-current", "true");
      else thumb.removeAttribute("aria-current");
    });
  }
  const isPlainClick = event => !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0;
  thumbs.forEach((thumb, index) => thumb.addEventListener("click", event => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    selectShot(index);
  }));
  document.querySelectorAll(".gallery-step").forEach(button => button.addEventListener("click", () => selectShot(selectedShot + Number(button.dataset.direction))));
  document.querySelector(".gallery-viewer").addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? shots.length - 1 : selectedShot + (event.key === "ArrowRight" ? 1 : -1);
    selectShot(next);
    thumbs[selectedShot].focus({ preventScroll: true });
    thumbs[selectedShot].scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  });

  const lightbox = document.querySelector(".lightbox");
  const closeButton = lightbox.querySelector(".lightbox-close");
  let expandedShot = 0;
  let opener = null;
  function showExpanded(index) {
    expandedShot = normalize(index);
    const shot = shots[expandedShot];
    setImage(lightbox.querySelector(".lightbox-image"), shot);
    lightbox.querySelector("#lightbox-caption").textContent = shot.label;
    lightbox.querySelector("#lightbox-count").textContent = count(expandedShot);
    lightbox.querySelector(".lightbox-download").href = source(shot);
  }
  function openExpanded(event, index) {
    if (!isPlainClick(event) || typeof lightbox.showModal !== "function") return;
    event.preventDefault();
    opener = event.currentTarget;
    showExpanded(index);
    lightbox.showModal();
    document.body.classList.add("modal-open");
    closeButton.focus({ preventScroll: true });
  }
  document.querySelectorAll(".open-shot").forEach(link => link.addEventListener("click", event => openExpanded(event, Number(link.dataset.shot))));
  galleryOpen.addEventListener("click", event => openExpanded(event, selectedShot));
  closeButton.addEventListener("click", () => lightbox.close());
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showExpanded(expandedShot - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => showExpanded(expandedShot + 1));
  lightbox.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showExpanded(expandedShot + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  lightbox.addEventListener("click", event => {
    if (event.target !== lightbox) return;
    const bounds = lightbox.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) lightbox.close();
  });
  lightbox.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (opener) opener.focus({ preventScroll: true });
  });
})();
