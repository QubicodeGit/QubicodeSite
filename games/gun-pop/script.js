"use strict";

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  siteNav.classList.remove("is-open");
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  siteNav.classList.toggle("is-open", open);
});
siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuToggle.focus();
  }
});
matchMedia("(min-width: 661px)").addEventListener("change", closeMenu);

const video = document.querySelector(".gameplay-player video");
document.querySelectorAll(".watch-gameplay").forEach((link) => {
  link.addEventListener("click", () => {
    video.play().catch(() => {});
  });
});
// Playback is visitor controlled. Leaving the player or tab always pauses it.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) video.pause();
});
if ("IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) video.pause();
  }, { threshold: 0 }).observe(video);
}

const showcase = window.gunPopShowcase;
const gunButtons = [...document.querySelectorAll("[data-gun]")];
const finishOptions = document.querySelector(".finish-options");
let selectedGun = showcase.arsenal.find(gun => gun.id === "pistol_i");
function showFinish(index) {
  const look = selectedGun.looks[index];
  const image = document.querySelector("#arsenal-image");
  image.src = look.image;
  image.alt = `${selectedGun.name} with the ${look.name} skin`;
  document.querySelector("#skin-name").textContent = look.name;
  document.querySelector("#skin-rarity").textContent = look.collection === "Animated" ? "Animated finish" : `${look.rarity} finish`;
  document.querySelector("#finish-note").textContent = look.collection === "Animated" ? "This finish animates in the game. The image shows one moment." : index === 0 ? "The gun’s original finish. Make your next look your own." : "A collectible look from the current game.";
  finishOptions.querySelectorAll("button").forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
}
function showGun(id) {
  selectedGun = showcase.arsenal.find(gun => gun.id === id);
  document.querySelector("#gun-name").textContent = selectedGun.name;
  document.querySelector("#gun-description").textContent = selectedGun.description;
  gunButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.gun === id)));
  finishOptions.replaceChildren(...selectedGun.looks.map((look, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "finish-option";
    button.setAttribute("aria-label", `${look.name}, ${look.collection === "Animated" ? "animated" : look.rarity} finish`);
    button.title = look.name;
    const image = document.createElement("img");
    image.src = look.image;
    image.alt = "";
    image.width = 512;
    image.height = 512;
    button.append(image);
    button.addEventListener("click", () => showFinish(index));
    return button;
  }));
  showFinish(2);
}
gunButtons.forEach(button => button.addEventListener("click", () => showGun(button.dataset.gun)));
showGun(selectedGun.id);
const themeButtons = [...document.querySelectorAll("[data-theme]")];
themeButtons.forEach(button => button.addEventListener("click", () => {
  const theme = showcase.themes[Number(button.dataset.theme)];
  themeButtons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  document.querySelector("#theme-name").textContent = theme.name;
  document.querySelector(".prop-lineup").replaceChildren(...theme.props.map((prop, index) => {
    const figure = document.createElement("figure");
    figure.style.setProperty("--prop-index", index);
    const image = document.createElement("img");
    image.src = prop.image;
    image.alt = `${prop.name} target model`;
    image.width = 400;
    image.height = 400;
    const caption = document.createElement("figcaption");
    caption.textContent = prop.name;
    figure.append(image, caption);
    return figure;
  }));
}));

const galleryTrack = document.querySelector(".gallery-track");
document.querySelectorAll(".gallery-scroll[data-direction]").forEach((button) => {
  button.addEventListener("click", () => {
    const first = galleryTrack.querySelector("figure");
    const gap = parseFloat(getComputedStyle(galleryTrack).gap) || 0;
    galleryTrack.scrollBy({ left: Number(button.dataset.direction) * (first.offsetWidth + gap), behavior: motionPreference.matches ? "instant" : "smooth" });
  });
});

const galleryLinks = [...galleryTrack.querySelectorAll(".gallery-link")];
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxCounter = document.querySelector("#lightbox-counter");
let currentImage = 0;
let lightboxTrigger = null;

function showImage(index) {
  currentImage = (index + galleryLinks.length) % galleryLinks.length;
  const link = galleryLinks[currentImage];
  lightboxImage.src = link.href;
  lightboxImage.alt = link.querySelector("img").alt;
  lightboxCaption.textContent = link.dataset.caption;
  lightboxCounter.textContent = `${currentImage + 1} / ${galleryLinks.length}`;
}
document.addEventListener("click", (event) => {
    const link = event.target.closest(".gallery-link");
    if (!link) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof lightbox.showModal !== "function") return;
    const galleryIndex = galleryLinks.findIndex((item) => item.href === link.href);
    if (galleryIndex < 0) return;
    event.preventDefault();
    lightboxTrigger = link.closest(".gallery-copy") ? galleryTrack : link;
    showImage(galleryIndex);
    lightbox.showModal();
    document.body.classList.add("modal-open");
    video.pause();
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showImage(currentImage - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showImage(currentImage + 1));
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showImage(currentImage + (event.key === "ArrowRight" ? 1 : -1));
  }
});
lightbox.addEventListener("click", (event) => {
  if (event.target !== lightbox) return;
  const bounds = lightbox.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) lightbox.close();
});
lightbox.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  lightboxTrigger?.focus({ preventScroll: true });
});

if ("IntersectionObserver" in window) {
  const navLinks = [...siteNav.querySelectorAll("a")];
  const sections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
  sections.forEach((section) => observer.observe(section));
}
