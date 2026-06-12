document.documentElement.classList.add("js");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
const year = document.querySelector("#year");
const flashlight = document.querySelector(".flashlight");
const dustLayer = document.querySelector(".scp-dust");
const revealItems = document.querySelectorAll(".reveal");
const track = document.querySelector(".gallery-track");
const viewport = document.querySelector(".gallery-viewport");
const slides = [...document.querySelectorAll(".gallery-slide")];
const prevButton = document.querySelector(".gallery-arrow.prev");
const nextButton = document.querySelector(".gallery-arrow.next");
const dots = document.querySelector(".gallery-dots");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox img");
const lightboxClose = document.querySelector(".lightbox-close");
const slideCount = document.querySelector(".slide-count");
const mobileGalleryQuery = window.matchMedia("(max-width: 820px)");
let currentSlide = 0;
let touchStartX = 0;
let glitchTimer = 0;
let resizeFrame = 0;
let scrollFrame = 0;

if (year) {
  year.textContent = new Date().getFullYear();
}

function closeNav() {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -60px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupDust() {
  if (prefersReducedMotion || !dustLayer || document.hidden) return;

  for (let index = 0; index < 38; index += 1) {
    const particle = document.createElement("span");
    particle.className = "dust-particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty("--duration", `${14 + Math.random() * 18}s`);
    particle.style.setProperty("--delay", `${Math.random() * -24}s`);
    particle.style.setProperty("--drift", `${-55 + Math.random() * 110}px`);
    dustLayer.appendChild(particle);
  }
}

function setupFlashlight() {
  if (prefersReducedMotion || !flashlight) return;

  window.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    document.body.classList.add("has-pointer");
    document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
    document.documentElement.style.setProperty("--my", `${event.clientY}px`);
  });

  window.addEventListener("pointerleave", () => {
    document.body.classList.remove("has-pointer");
  });
}

function makeDots() {
  if (!dots) return;
  dots.innerHTML = slides
    .map((_, index) => `<button type="button" aria-label="View screenshot ${index + 1}"></button>`)
    .join("");

  dots.querySelectorAll("button").forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });
}

function markActiveDot() {
  (dots?.querySelectorAll("button") || []).forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentSlide);
  });
  slides.forEach((slide, index) => {
    slide.classList.toggle("is-active", index === currentSlide);
  });
  if (slideCount) {
    slideCount.textContent = String(currentSlide + 1).padStart(2, "0");
  }
}

function triggerGlitch() {
  if (prefersReducedMotion || !track) return;
  if (mobileGalleryQuery.matches) return;
  window.clearTimeout(glitchTimer);
  track.style.setProperty("--gallery-x", `-${currentSlide * 100}%`);
  track.classList.add("is-glitching");
  glitchTimer = window.setTimeout(() => track.classList.remove("is-glitching"), 150);
}

function goToSlide(index) {
  if (!slides.length || !track || !viewport) return;
  currentSlide = (index + slides.length) % slides.length;
  if (mobileGalleryQuery.matches) {
    track.style.transform = "";
    viewport.scrollTo({
      left: currentSlide * viewport.clientWidth,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  } else {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
  markActiveDot();
  triggerGlitch();
}

function setupGallery() {
  if (!track || !viewport || !slides.length) return;
  makeDots();
  markActiveDot();

  prevButton?.addEventListener("click", () => goToSlide(currentSlide - 1));
  nextButton?.addEventListener("click", () => goToSlide(currentSlide + 1));

  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goToSlide(currentSlide - 1);
    if (event.key === "ArrowRight") goToSlide(currentSlide + 1);
  });

  viewport.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) {
      goToSlide(currentSlide + (delta < 0 ? 1 : -1));
    }
  }, { passive: true });

  viewport.addEventListener("scroll", () => {
    if (!mobileGalleryQuery.matches) return;
    const nextIndex = Math.round(viewport.scrollLeft / viewport.clientWidth);
    if (nextIndex !== currentSlide) {
      currentSlide = Math.max(0, Math.min(slides.length - 1, nextIndex));
      markActiveDot();
    }
  }, { passive: true });

  slides.forEach((slide) => {
    slide.addEventListener("click", () => openLightbox(slide.dataset.full));
  });
}

function openLightbox(src) {
  if (!lightbox || !lightboxImage || !lightboxClose) return;
  lightboxImage.src = src;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  lightboxClose.focus();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    closeNav();
  });
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
});

window.addEventListener("resize", () => {
  window.cancelAnimationFrame(resizeFrame);
  resizeFrame = window.requestAnimationFrame(() => goToSlide(currentSlide));
});

function updateDepthMeter() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const depth = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  document.documentElement.style.setProperty("--depth", depth.toFixed(3));
}

window.addEventListener("scroll", () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    updateDepthMeter();
    scrollFrame = 0;
  });
}, { passive: true });

setupReveal();
setupDust();
setupFlashlight();
setupGallery();
updateDepthMeter();
