const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const modal = document.querySelector(".trailer-modal");

requestAnimationFrame(() => {
  requestAnimationFrame(() => document.documentElement.classList.add("startup-ready"));
});

let scrollTicking = false;
const updateScrollEffects = () => {
  const maxScroll = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
  const progress = Math.min(scrollY / maxScroll, 1);
  document.documentElement.style.setProperty("--scroll-y", scrollY.toFixed(1));
  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(3));
  header.classList.toggle("scrolled", scrollY > 30);
  scrollTicking = false;
};
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    requestAnimationFrame(updateScrollEffects);
    scrollTicking = true;
  }
}, { passive: true });
updateScrollEffects();

menuButton.addEventListener("click", () => {
  const open = menuButton.classList.toggle("active");
  nav.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => {
  menuButton.classList.remove("active");
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${(index % 4) * 70}ms`;
  revealObserver.observe(element);
});

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = Number(entry.target.dataset.count);
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / 900, 1);
      entry.target.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(entry.target);
  });
}, { threshold: .8 });
document.querySelectorAll("[data-count]").forEach(count => countObserver.observe(count));

const botDetails = {
  green: { name: "Bolt", label: "Green BrawlBots character" },
  blue: { name: "Surge", label: "Blue BrawlBots character" },
  yellow: { name: "Spark", label: "Yellow BrawlBots character" },
  orange: { name: "Blaze", label: "Orange BrawlBots character" }
};

document.querySelectorAll(".bot-dot").forEach(button => button.addEventListener("click", () => {
  document.querySelector(".bot-dot.active").classList.remove("active");
  button.classList.add("active");
  const color = button.dataset.bot;
  const showcase = document.querySelector(".bot-showcase");
  showcase.className = `bot-showcase reveal visible bot-${color}`;
  document.querySelector("#bot-name").textContent = botDetails[color].name;
  document.querySelector("#bot-image").alt = botDetails[color].label;
}));

document.querySelector(".trailer-button").addEventListener("click", () => {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
});
const closeModal = () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
};
document.querySelector(".modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });

if (matchMedia("(pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
    document.querySelector(".cursor-glow").style.cssText = `left:${event.clientX}px;top:${event.clientY}px`;
    const x = (event.clientX / innerWidth - .5);
    const y = (event.clientY / innerHeight - .5);
    document.querySelectorAll("[data-depth]").forEach(item => {
      const depth = Number(item.dataset.depth);
      item.style.translate = `${x * depth * 8}px ${y * depth * 8}px`;
    });
  });
}
