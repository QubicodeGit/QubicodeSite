const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const modal = document.querySelector(".trailer-modal");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1001px)").matches;
const mobileLayout = matchMedia("(max-width: 760px)").matches;

requestAnimationFrame(() => {
  requestAnimationFrame(() => document.documentElement.classList.add("startup-ready"));
});

const syncVisibility = () => document.documentElement.classList.toggle("page-hidden", document.hidden);
document.addEventListener("visibilitychange", syncVisibility);
syncVisibility();
if ("IntersectionObserver" in window) {
  const motionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle("motion-visible", entry.isIntersecting));
  });
  document.querySelectorAll("main > section, footer").forEach(section => {
    section.classList.add("motion-section");
    motionObserver.observe(section);
  });
}

let scrollTicking = false;
const updateScrollEffects = () => {
  if (!mobileLayout) {
    const maxScroll = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    const progress = Math.min(scrollY / maxScroll, 1);
    document.documentElement.style.setProperty("--scroll-y", scrollY.toFixed(1));
    document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(3));
  }
  header?.classList.toggle("scrolled", scrollY > 30);
  scrollTicking = false;
};
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    requestAnimationFrame(updateScrollEffects);
    scrollTicking = true;
  }
}, { passive: true });
updateScrollEffects();

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.classList.toggle("active");
    nav.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    menuButton.classList.remove("active");
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }));
}

const revealItems = document.querySelectorAll(".reveal");
revealItems.forEach((element, index) => {
  element.style.transitionDelay = `${(index % 4) * 70}ms`;
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -7%" });

  revealItems.forEach(element => revealObserver.observe(element));

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.count);
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / 900, 1);
        entry.target.textContent = Math.floor(progress * target);
        if (progress < 1 && !reducedMotion) requestAnimationFrame(tick);
      };
      if (reducedMotion) {
        entry.target.textContent = target;
      } else {
        requestAnimationFrame(tick);
      }
      countObserver.unobserve(entry.target);
    });
  }, { threshold: .8 });
  document.querySelectorAll("[data-count]").forEach(count => countObserver.observe(count));
} else {
  revealItems.forEach(element => element.classList.add("visible"));
  document.querySelectorAll("[data-count]").forEach(count => {
    count.textContent = count.dataset.count;
  });
}

const botDetails = {
  green: { name: "Bolt", label: "Green BrawlBots character" },
  blue: { name: "Surge", label: "Blue BrawlBots character" },
  yellow: { name: "Spark", label: "Yellow BrawlBots character" },
  orange: { name: "Blaze", label: "Orange BrawlBots character" }
};

document.querySelectorAll(".bot-dot").forEach(button => button.addEventListener("click", () => {
  document.querySelector(".bot-dot.active")?.classList.remove("active");
  document.querySelectorAll(".bot-dot").forEach(dot => dot.setAttribute("aria-pressed", String(dot === button)));
  button.classList.add("active");
  const color = button.dataset.bot;
  const showcase = document.querySelector(".bot-showcase");
  if (showcase) showcase.className = `bot-showcase reveal visible bot-${color}`;
  const botName = document.querySelector("#bot-name");
  const botImage = document.querySelector("#bot-image");
  if (botName) botName.textContent = botDetails[color].name;
  if (botImage) botImage.alt = botDetails[color].label;
}));

const modalClose = document.querySelector(".modal-close");
const modalImage = modal?.querySelector("img");
const defaultPreview = { src: modalImage?.getAttribute("src"), alt: modalImage?.alt };
const pageRegions = [...document.querySelectorAll("body > header, body > main, body > footer")];
let previewTrigger = null;
function openPreview(image = defaultPreview, screenshot = false) {
  if (!modal || !modalImage) return;
  previewTrigger = document.activeElement;
  modalImage.src = image.src;
  modalImage.alt = image.alt;
  modal.classList.toggle("screenshot-mode", screenshot);
  modal.setAttribute("aria-label", screenshot ? image.alt : "BrawlBots game preview");
  modal?.classList.add("open");
  modal?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  pageRegions.forEach(region => { region.inert = true; });
  modalClose?.focus();
}
document.querySelector(".trailer-button")?.addEventListener("click", () => openPreview());
document.querySelectorAll(".arena-overlay button").forEach(button => button.addEventListener("click", () => {
  const image = button.closest(".arena-card").querySelector("img");
  openPreview({ src: image.getAttribute("src"), alt: image.alt }, true);
}));
const closeModal = () => {
  if (!modal?.classList.contains("open")) return;
  modal?.classList.remove("open");
  modal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  pageRegions.forEach(region => { region.inert = false; });
  if (previewTrigger?.isConnected) previewTrigger.focus({ preventScroll: true });
};
modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
  if (event.key === "Tab" && modal?.classList.contains("open")) {
    event.preventDefault();
    modalClose?.focus();
  }
});

if (finePointer && !reducedMotion) {
  const cursorGlow = document.querySelector(".cursor-glow");
  const depthItems = document.querySelectorAll("[data-depth]");

  document.querySelectorAll(".feature-card").forEach(card => {
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - .5) * 8;
      const rotateX = (.5 - (y / rect.height)) * 8;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
      card.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
      card.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
      card.style.setProperty("--shadow-x", `${(-rotateY * 1.2).toFixed(1)}px`);
      card.style.setProperty("--shadow-y", `${(18 + rotateX).toFixed(1)}px`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rotate-x", "0deg");
      card.style.setProperty("--rotate-y", "0deg");
      card.style.setProperty("--shadow-x", "0px");
      card.style.setProperty("--shadow-y", "20px");
    });
  });

  document.addEventListener("pointermove", event => {
    if (cursorGlow) cursorGlow.style.cssText = `left:${event.clientX}px;top:${event.clientY}px`;
    const x = (event.clientX / innerWidth - .5);
    const y = (event.clientY / innerHeight - .5);
    depthItems.forEach(item => {
      const depth = Number(item.dataset.depth);
      item.style.translate = `${x * depth * 8}px ${y * depth * 8}px`;
    });
  });
}
