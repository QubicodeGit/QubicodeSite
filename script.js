document.documentElement.classList.add("js");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const platformIcons = {
  mobile:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.4"></rect><path d="M10.5 18.5h3"></path></svg>',
  ios:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 3.2c-.3 1.7-1.5 3-3.1 3.1-.1-1.7 1.2-3.1 3.1-3.1Z"></path><path d="M19 16.8c-.5 1.2-.8 1.7-1.5 2.8-1 1.5-2.4 3.3-4.1 3.3-1.5 0-1.9-1-3.9-1s-2.5 1-3.9 1c-1.7 0-3-1.7-4-3.2-2.7-4.2-3-9.1-1.3-11.7 1.2-1.9 3.1-3 4.9-3 1.8 0 2.9 1 4.4 1 1.4 0 2.3-1 4.4-1 1.6 0 3.3.9 4.5 2.3-4 2.2-3.3 7.8.5 9.5Z"></path></svg>',
  android:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10h10v7.5A2.5 2.5 0 0 1 14.5 20h-5A2.5 2.5 0 0 1 7 17.5V10Z"></path><path d="M8.5 6 7 3.8M15.5 6 17 3.8M7 10c0-2.8 2.2-5 5-5s5 2.2 5 5M5 10v6M19 10v6M10 8h.1M14 8h.1"></path></svg>',
  steam:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="16.5" cy="7.5" r="3.2"></circle><circle cx="16.5" cy="7.5" r="1.2"></circle><path d="M3 13.5 9.3 16a3.6 3.6 0 1 0 1.5-2.6l-3.2-1.3"></path><circle cx="11.8" cy="16.8" r="2"></circle></svg>',
  pc:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.8"></rect><path d="M9 20h6M12 16v4"></path></svg>',
  multiplayer:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 20c.5-3 2.1-5 4.5-5s4 2 4.5 5M11.5 20c.5-3 2.1-5 4.5-5s4 2 4.5 5"></path></svg>',
  singleplayer:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 21c.7-4 3-6 7-6s6.3 2 7 6"></path></svg>',
  default:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7.5h14v9H5z"></path><path d="M8 12h3M9.5 10.5v3M15 11.2h.1M17 13h.1"></path></svg>'
};

// Edit this array to update game cards, filters, images, and project copy.
const games = [
  {
    title: "Driver Dash",
    status: "Inactive / Seeking Publisher",
    statusClass: "status-inactive",
    platforms: ["Mobile", "iOS", "Android"],
    genre: "Endless Mobile Arcade",
    theme: "driver-dash",
    filters: ["mobile"],
    page: "games/driver-dash/index.html",
    image: "Images/driverdashHero.png",
    logo: "Images/driverdashIcon.png",
    description:
      "A finished mobile endless driving game inspired by fast lane-based arcade runners. Dodge obstacles across three lanes, use boost powerups, unlock cars, customize colors, spin the lucky wheel, open lootboxes, expand tycoon-style map properties, and take on boss fights.",
    tags: ["Endless Driving", "Mobile", "Arcade", "Customization", "Boss Fights"]
  },
  {
    title: "SCP-087: Exploration IV",
    status: "In Development",
    statusClass: "status-development",
    platforms: ["Steam", "PC", "Singleplayer"],
    genre: "Singleplayer First-Person Horror",
    theme: "scp-087",
    filters: ["steam", "horror", "singleplayer"],
    page: "games/scp-087-exploration-iv/index.html",
    image: "games/scp-087-exploration-iv/images/scp087screenshot.jpg",
    logo: "games/scp-087-exploration-iv/images/scp087icon.png",
    description:
      "A short first-person horror experience based on SCP-087. A D-Class personnel is ordered to descend into the infamous infinite staircase and document its depths.",
    tags: ["Horror", "SCP", "First Person", "Singleplayer", "Psychological Horror"]
  },
  {
    title: "Red Signal",
    status: "In Development",
    statusClass: "status-development",
    platforms: ["Steam", "PC", "Singleplayer"],
    genre: "Singleplayer First-Person Horror",
    theme: "red-signal",
    filters: ["steam", "horror", "singleplayer"],
    page: "games/red-signal/index.html",
    image: "Images/RedSignalScreenshot.jpg",
    logo: "Images/RedSignalIcon.jpg",
    description:
      "A first-person horror game set on Mars.",
    tags: ["Horror", "Mars", "Sci-Fi", "First Person", "Singleplayer", "Survival"]
  },
  {
    title: "Recovery Unit",
    status: "Future",
    statusClass: "muted-badge",
    platforms: ["Steam", "PC", "Multiplayer"],
    genre: "Multiplayer First-Person Infection Shooter",
    theme: "recovery-unit",
    filters: ["steam", "multiplayer"],
    page: "",
    image: "Images/recoveryunitScreenshot.png",
    logo: "Images/recoveryunitLogo.png",
    description:
      "A multiplayer first-person infection shooter where up to four players enter dangerous contaminated areas filled with weak and extremely powerful mutated creatures. Survive hostile environments together.",
    tags: ["FPS", "Multiplayer", "Co-op", "Infection", "Survival"]
  },
  {
    title: "Brawlbots",
    status: "Future",
    statusClass: "muted-badge",
    platforms: ["Steam", "PC", "Multiplayer"],
    genre: "Third-Person Multiplayer Puzzle Brawler",
    theme: "brawlbots",
    filters: ["steam", "multiplayer"],
    page: "games/brawlbots/index.html",
    image: "Images/brawlbotsScreenshot.jpg",
    logo: "Images/BrawlbotsIcon.png",
    description:
      "A third-person multiplayer puzzle brawler where up to four malfunctioning humanoid bots fight through a corrupted robot world.",
    tags: ["Third Person", "Co-op", "Puzzle", "Brawler", "Robots"]
  },
  {
    title: "Gun Pop",
    status: "Future",
    statusClass: "muted-badge",
    platforms: ["Mobile"],
    genre: "Mobile Flick-Shooting Arcade",
    theme: "gun-pop",
    filters: ["mobile"],
    page: "",
    image: "Images/gunpopIcon.png",
    logo: "Images/gunpopIcon.png",
    mediaMode: "contain",
    description:
      "A mobile flick-shooting game where a gun is thrown into the air and players time shots while it flips to hit targets, gifts, and ricochet panels.",
    tags: ["Mobile", "Arcade", "Flick Shot", "Guns", "Skins"]
  }
];

const year = document.querySelector("#year");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const gameGrid = document.querySelector("#game-grid");
const filterButtons = document.querySelectorAll(".filter-button");
const backToTop = document.querySelector(".back-to-top");
const parallaxItems = document.querySelectorAll("[data-depth]");
const hideTimers = new WeakMap();

year.textContent = new Date().getFullYear();

function setupDynamicShell() {
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const amount = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleX(${amount})`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

function tagMarkup(items, className = "") {
  return items.map((item) => `<span class="${className}">${item}</span>`).join("");
}

function platformIcon(name) {
  const key = name.toLowerCase().replace(/\s*\/\s*/g, " ").split(" ")[0];
  return platformIcons[key] || platformIcons.default;
}

function platformMarkup(platforms) {
  return platforms
    .map((platform) => `<span class="platform-tag">${platformIcon(platform)}${platform}</span>`)
    .join("");
}

function renderGames() {
  gameGrid.innerHTML = games
    .map((game, index) => {
      const mediaClass = game.mediaMode === "contain" ? "game-media image-contain" : "game-media";
      const imageMarkup = game.image
        ? `<img src="${game.image}" alt="${game.title} screenshot" loading="lazy">`
        : `<div class="placeholder-media"><span>${game.title} visual coming soon</span></div>`;
      const logoMarkup = game.logo
        ? `<div class="game-logo"><img src="${game.logo}" alt="${game.title} logo" loading="lazy"></div>`
        : "";

      return `
        <article class="game-card game-tab game-theme-${game.theme} reveal" data-filters="${game.filters.join(" ")}" style="transition-delay: ${index * 70}ms">
          <div class="game-tab-visual">
            <div class="${mediaClass}">
              ${imageMarkup}
            </div>
            ${logoMarkup}
          </div>
          <div class="game-content">
            <div class="card-topline">
              <span class="badge ${game.statusClass}">${game.status}</span>
              <div class="platform-list" aria-label="${game.title} platforms">
                ${platformMarkup(game.platforms)}
              </div>
            </div>
            <h3>${game.title}</h3>
            <p class="genre-line">${game.genre}</p>
            <p>${game.description}</p>
            <div class="tag-list" aria-label="${game.title} tags">
              ${tagMarkup(game.tags)}
            </div>
            <div class="game-actions">
              ${
                game.page
                  ? `<a class="card-link ripple" href="${game.page}">View Game</a>`
                  : `<span class="card-link disabled-link" aria-disabled="true">Page Coming Later</span>`
              }
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function closeMobileNav() {
  navToggle.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

// Reveals sections and cards as they enter the viewport.
function setupReveal() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px" }
  );

  items.forEach((item) => revealObserver.observe(item));
}

function filterGames(filter) {
  document.querySelectorAll(".game-card").forEach((card) => {
    const matches = filter === "all" || card.dataset.filters.split(" ").includes(filter);
    window.clearTimeout(hideTimers.get(card));

    if (matches) {
      card.style.display = "";
    }

    card.classList.toggle("is-hidden", !matches);

    if (!matches) {
      const timer = window.setTimeout(() => {
        card.style.display = "none";
      }, 210);
      hideTimers.set(card, timer);
    }
  });
}

// Lightweight pointer tilt for cards and the hero logo panel.
function setupTilt() {
  if (prefersReducedMotion) return;

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateY(-3px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

function setupActiveNav() {
  const sections = [...document.querySelectorAll("main section[id]")];

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        const hasLink = [...navItems].some((item) => item.getAttribute("href") === `#${id}`);
        if (!hasLink) return;
        navItems.forEach((item) => item.classList.toggle("active", item.getAttribute("href") === `#${id}`));
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// Moves background shapes gently with the pointer.
function setupParallax() {
  if (prefersReducedMotion) return;

  let frame = null;
  window.addEventListener("pointermove", (event) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      parallaxItems.forEach((item) => {
        const depth = Number(item.dataset.depth) || 0.1;
        item.style.translate = `${x * depth * 56}px ${y * depth * 56}px`;
      });

      frame = null;
    });
  });
}

function setupRipples() {
  document.querySelectorAll(".ripple").forEach((element) => {
    element.addEventListener("pointerdown", (event) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
      element.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
      element.classList.remove("is-rippling");
      void element.offsetWidth;
      element.classList.add("is-rippling");
    });

    element.addEventListener("animationend", () => element.classList.remove("is-rippling"));
  });
}

function setupGameTabEffects() {
  if (prefersReducedMotion) return;

  document.querySelectorAll(".game-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    });
  });
}

renderGames();
setupDynamicShell();
setupReveal();
setupTilt();
setupActiveNav();
setupParallax();
setupRipples();
setupGameTabEffects();

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});


navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    const href = item.getAttribute("href");
    if (!href || !href.startsWith("#")) {
      closeMobileNav();
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
    closeMobileNav();
  });
});

document.querySelectorAll(".hero-actions a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    filterGames(button.dataset.filter);
  });
});

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("is-visible", window.scrollY > 640);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});

