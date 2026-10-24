"use strict";

(() => {
  const root = document.documentElement;
  root.classList.add("js");
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  // Build the decorative layers once; CSS handles their motion without a render loop.
  document.querySelectorAll(".scene").forEach((scene, sceneIndex) => {
    const atmosphere = document.createElement("div");
    atmosphere.className = "scene-atmosphere";
    atmosphere.setAttribute("aria-hidden", "true");
    atmosphere.style.setProperty("--scene-offset", `${sceneIndex * -3.7}s`);
    for (const className of ["dust-haze", "warning-light warning-light--left", "warning-light warning-light--right"]) {
      const layer = document.createElement("span");
      layer.className = className;
      atmosphere.append(layer);
    }
    for (let index = 0; index < 28; index += 1) {
      const seed = index * 37 + sceneIndex * 19;
      const mote = document.createElement("i");
      mote.className = "dust-mote";
      mote.style.cssText = `--x:${seed % 104}%;--y:${(index * 29 + sceneIndex * 13) % 100}%;--size:${1 + (seed % 5) * .45}px;--alpha:${.22 + (seed % 7) * .06};--duration:${19 + seed % 17}s;--delay:-${seed % 31}s;--travel:${100 + seed % 130}px`;
      atmosphere.append(mote);
    }
    scene.prepend(atmosphere);
  });

  const atmosphereToggle = document.querySelector(".atmosphere-toggle");
  let atmospherePaused = false;
  atmosphereToggle.hidden = false;
  atmosphereToggle.addEventListener("click", () => {
    atmospherePaused = !atmospherePaused;
    syncMotion();
  });

  function closeNavigation(returnFocus = false) {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    if (returnFocus) navToggle.focus();
  }
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => closeNavigation()));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("open")) closeNavigation(true);
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".site-header")) closeNavigation();
  });
  matchMedia("(min-width: 801px)").addEventListener("change", event => {
    if (event.matches) closeNavigation();
  });

  const revealItems = [...document.querySelectorAll(".reveal")];
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: "0px 0px -20px" });
    revealItems.forEach(element => revealObserver.observe(element));

    const sceneObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle("is-in-view", entry.isIntersecting));
    }, { threshold: 0 });
    document.querySelectorAll(".scene").forEach(scene => sceneObserver.observe(scene));
  } else {
    revealItems.forEach(element => element.classList.add("visible"));
    document.querySelectorAll(".scene").forEach(scene => scene.classList.add("is-in-view"));
  }
  function syncMotion() {
    root.classList.toggle("page-hidden", document.hidden);
    root.classList.toggle("motion-paused", atmospherePaused || motionPreference.matches);
    atmosphereToggle.setAttribute("aria-pressed", String(!atmospherePaused && !motionPreference.matches));
    atmosphereToggle.querySelector("span").textContent = atmospherePaused || motionPreference.matches ? "Motion off" : "Motion on";
    if (motionPreference.matches) revealItems.forEach(element => element.classList.add("visible"));
  }
  document.addEventListener("visibilitychange", syncMotion);
  motionPreference.addEventListener("change", syncMotion);
  syncMotion();

  const shots = [
  {
    "file": "dust-canyon",
    "label": "The surface",
    "code": "SURFACE // LOW VISIBILITY",
    "alt": "Martian dust blowing through a canyon with illuminated guide poles",
    "w": 1589,
    "h": 890
  },
  {
    "file": "scanner",
    "label": "The signal",
    "code": "SCANNER // ACTIVE",
    "alt": "A handheld red terrain scanner held in a dense orange Martian dust storm",
    "w": 1592,
    "h": 891
  },
  {
    "file": "bulkhead",
    "label": "The bulkhead",
    "code": "STATION // ACCESS",
    "alt": "A gloved astronaut hand reaching toward an illuminated bulkhead door control",
    "w": 1592,
    "h": 890
  },
  {
    "file": "crew",
    "label": "The station",
    "code": "INTERIOR // UNKNOWN",
    "alt": "An astronaut suspended beside a dark station doorway",
    "w": 1591,
    "h": 891
  },
  {
    "file": "creature-close",
    "label": "First contact",
    "code": "CONTACT // CRITICAL",
    "alt": "A close view of a long-jawed alien creature under red emergency lighting",
    "w": 1592,
    "h": 890
  },
  {
    "file": "creature-front",
    "label": "Too close",
    "code": "PROXIMITY // CRITICAL",
    "alt": "A red-lit alien creature with an elongated head looming directly toward the camera",
    "w": 1590,
    "h": 889
  },
  {
    "file": "mars-orbit",
    "label": "Mars",
    "code": "ORBIT // MARS",
    "alt": "The glowing orange curve of Mars against deep black space",
    "w": 1590,
    "h": 890
  }
];
  const thumbs = [...document.querySelectorAll(".evidence-thumb")];
  const evidenceImage = document.querySelector("#evidence-image");
  const evidenceCaption = document.querySelector("#evidence-caption");
  const evidenceOpen = document.querySelector(".evidence-open");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const lightboxCaption = document.querySelector("#lightbox-caption");
  const lightboxCount = document.querySelector("#lightbox-count");
  let selectedShot = 0;
  let expandedShot = 0;
  let lightboxTrigger = null;
  const normalize = index => (index + shots.length) % shots.length;
  const source = shot => `images/captured/${shot.file}.jpg`;

  function updateImage(image, shot) {
    image.src = source(shot);
    image.alt = shot.alt;
    image.width = shot.w;
    image.height = shot.h;
  }
  function selectShot(index) {
    selectedShot = normalize(index);
    const shot = shots[selectedShot];
    updateImage(evidenceImage, shot);
    evidenceOpen.href = source(shot);
    evidenceOpen.setAttribute("aria-label", `Enlarge screenshot: ${shot.label}`);
    const counter = document.createElement("b");
    counter.textContent = `${String(selectedShot + 1).padStart(2, "0")} / 07`;
    evidenceCaption.replaceChildren(counter, document.createTextNode(` ${shot.code}`));
    thumbs.forEach((thumb, index) => {
      thumb.classList.toggle("is-selected", index === selectedShot);
      if (index === selectedShot) thumb.setAttribute("aria-current", "true");
      else thumb.removeAttribute("aria-current");
    });
  }
  function modifiedClick(event) {
    return event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0;
  }
  thumbs.forEach(thumb => thumb.addEventListener("click", event => {
    if (modifiedClick(event)) return;
    event.preventDefault();
    selectShot(Number(thumb.dataset.shotIndex));
  }));
  document.querySelectorAll(".gallery-step").forEach(button => {
    button.addEventListener("click", () => selectShot(selectedShot + Number(button.dataset.direction)));
  });
  document.querySelector(".evidence-viewer").addEventListener("keydown", event => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    selectShot(selectedShot + (event.key === "ArrowRight" ? 1 : -1));
    thumbs[selectedShot].focus({ preventScroll: true });
  });

  function showExpandedShot(index) {
    expandedShot = normalize(index);
    const shot = shots[expandedShot];
    updateImage(lightboxImage, shot);
    lightboxCaption.textContent = `${shot.label} · ${shot.code}`;
    lightboxCount.textContent = `${expandedShot + 1} / ${shots.length}`;
  }
  function openLightbox(event, index) {
    if (modifiedClick(event) || typeof lightbox.showModal !== "function") return;
    event.preventDefault();
    lightboxTrigger = event.currentTarget;
    showExpandedShot(index);
    lightbox.showModal();
    document.body.classList.add("modal-open");
  }
  evidenceOpen.addEventListener("click", event => openLightbox(event, selectedShot));
  document.querySelectorAll(".open-shot").forEach(link => {
    link.addEventListener("click", event => openLightbox(event, Number(link.dataset.shotIndex)));
  });
  document.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  document.querySelector(".lightbox-prev").addEventListener("click", () => showExpandedShot(expandedShot - 1));
  document.querySelector(".lightbox-next").addEventListener("click", () => showExpandedShot(expandedShot + 1));
  lightbox.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showExpandedShot(expandedShot + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  lightbox.addEventListener("click", event => {
    if (event.target !== lightbox) return;
    const rect = lightbox.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) lightbox.close();
  });
  lightbox.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    lightboxTrigger?.focus({ preventScroll: true });
  });
})();
