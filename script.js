document.documentElement.classList.add("js");

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

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
    status: "Seeking publisher",
    statusClass: "status-seeking",
    platforms: ["Mobile", "iOS", "Android"],
    genre: "Endless Mobile Arcade",
    theme: "driver-dash",
    filters: ["mobile"],
    page: "games/driver-dash/index.html",
    image: "Images/driverdashHero.png",
    imageWidth: 1024,
    imageHeight: 500,
    logo: "Images/driverdashIcon.webp",
    logoWidth: 950,
    logoHeight: 950,
    description:
      "A finished mobile endless driving game inspired by fast lane-based arcade runners. Dodge obstacles across three lanes, use boost powerups, unlock cars, customize colors, spin the lucky wheel, open lootboxes, expand tycoon-style map properties, and take on boss fights.",
    tags: ["Endless Driving", "Mobile", "Arcade", "Customization", "Boss Fights"]
  },
  {
    title: "SCP-087: Exploration IV",
    status: "Future",
    statusClass: "status-future",
    platforms: ["Steam", "PC", "Singleplayer"],
    genre: "Singleplayer First-Person Horror",
    theme: "scp-087",
    filters: ["steam", "horror", "singleplayer"],
    page: "games/scp-087-exploration-iv/index.html",
    image: "games/scp-087-exploration-iv/images/scp087screenshot.jpg",
    imageWidth: 1579,
    imageHeight: 888,
    logo: "games/scp-087-exploration-iv/images/scp087icon.webp",
    logoWidth: 1254,
    logoHeight: 1254,
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
    imageWidth: 1511,
    imageHeight: 850,
    logo: "Images/RedSignalIcon.webp",
    logoWidth: 878,
    logoHeight: 878,
    description:
      "A first-person horror game set on Mars.",
    tags: ["Horror", "Mars", "Sci-Fi", "First Person", "Singleplayer", "Survival"]
  },
  {
    title: "Recovery Unit",
    status: "Future",
    statusClass: "status-future",
    platforms: ["Steam", "PC", "Multiplayer"],
    genre: "Multiplayer First-Person Infection Shooter",
    theme: "recovery-unit",
    filters: ["steam", "multiplayer"],
    page: "games/recovery-unit/index.html",
    image: "Images/recoveryunitScreenshot.webp",
    imageWidth: 1672,
    imageHeight: 941,
    logo: "Images/recoveryunitLogo.webp",
    logoWidth: 1254,
    logoHeight: 1254,
    description:
      "A multiplayer first-person infection shooter where up to four players enter dangerous contaminated areas filled with weak and extremely powerful mutated creatures. Survive hostile environments together.",
    tags: ["FPS", "Multiplayer", "Co-op", "Infection", "Survival"]
  },
  {
    title: "Brawlbots",
    status: "Future",
    statusClass: "status-future",
    platforms: ["Steam", "PC", "Multiplayer"],
    genre: "Third-Person Multiplayer Puzzle Brawler",
    theme: "brawlbots",
    filters: ["steam", "multiplayer"],
    page: "games/brawlbots/index.html",
    image: "Images/brawlbotsScreenshot.jpg",
    imageWidth: 1582,
    imageHeight: 890,
    description:
      "A third-person multiplayer puzzle brawler where up to four malfunctioning humanoid bots fight through a corrupted robot world.",
    tags: ["Third Person", "Co-op", "Puzzle", "Brawler", "Robots"]
  },
  {
    title: "Gun Pop",
    status: "In Development",
    statusClass: "status-development",
    platforms: ["Mobile"],
    genre: "Mobile Flick-Shooting Arcade",
    theme: "gun-pop",
    filters: ["mobile"],
    page: "games/gun-pop/index.html",
    image: "games/gun-pop/images/GunPopLogo.webp",
    imageWidth: 1448,
    imageHeight: 1086,
    imageAlt: "Gun Pop logo",
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
let gameCards = [];

if (year) {
  year.textContent = new Date().getFullYear();
}

function platformIcon(name) {
  const key = name.toLowerCase().replace(/\s*\/\s*/g, " ").split(" ")[0];
  return platformIcons[key] || platformIcons.default;
}

function platformMarkup(platforms) {
  return platforms
    .map((platform) => `<span class="platform-tag" title="${platform}">${platformIcon(platform)}<span class="sr-only">${platform}</span></span>`)
    .join("");
}

const shortcutArrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"></path></svg>';

const gameStatusPriority = new Map(
  ["published", "seeking publisher", "in development", "future", "inactive"]
    .map((status, index) => [status, index])
);

function gameStatusRank(game) {
  return gameStatusPriority.get(game.status.trim().toLowerCase()) ?? gameStatusPriority.size;
}

function renderGames() {
  if (!gameGrid) return;

  gameGrid.innerHTML = [...games]
    .sort((a, b) => gameStatusRank(a) - gameStatusRank(b))
    .map((game) => {
      const pageHref = game.page || "404.html";
      const pageLabel = game.page ? `View ${game.title}` : `${game.title} page coming soon`;
      const mediaClass = game.mediaMode === "contain" ? "game-media image-contain" : "game-media";
      const imageMarkup = game.image
        ? `<img src="${game.image}" width="${game.imageWidth}" height="${game.imageHeight}" alt="${game.imageAlt || `${game.title} screenshot`}" loading="lazy" decoding="async">`
        : `<div class="placeholder-media"><span>${game.title} visual coming soon</span></div>`;

      return `
        <article class="game-card game-tab game-theme-${game.theme}" data-filters=" ${game.filters.join(" ")} ">
          <div class="game-tab-visual">
            <div class="${mediaClass}">
              ${imageMarkup}
            </div>
          </div>
          <a class="game-card-link" href="${pageHref}" aria-label="${pageLabel}" title="${pageLabel}"></a>
          ${game.page ? `<a class="game-shortcut" href="${game.page}" aria-label="View ${game.title}">${shortcutArrow}</a>` : ""}
          <div class="game-content">
            <div class="card-topline">
              <span class="game-status badge ${game.statusClass}">${game.status}</span>
            </div>
            <h3>${game.title}</h3>
            <p class="game-description">${game.description}</p>
            <div class="game-actions">
              <div class="platform-list" aria-label="${game.title} platforms">
                ${platformMarkup(game.platforms)}
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
  gameCards = [...gameGrid.querySelectorAll(".game-card")];
}

function closeMobileNav() {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

function filterGames(filter) {
  gameCards.forEach((card) => {
    const matches = filter === "all" || card.dataset.filters.includes(` ${filter} `);
    card.hidden = !matches;
    card.classList.toggle("is-hidden", !matches);
  });
}

function setupActiveNav() {
  if (!("IntersectionObserver" in window)) return;
  const sections = [...document.querySelectorAll("main section[id]")];

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        const hasLink = [...navItems].some((item) => item.getAttribute("href") === `#${id}`);
        if (!hasLink) return;
        navItems.forEach((item) => {
          const isActive = item.getAttribute("href") === `#${id}`;
          item.classList.toggle("active", isActive);
          if (isActive) item.setAttribute("aria-current", "location");
          else item.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

renderGames();
setupActiveNav();

// CSS handles the movement; only its visibility needs to be tracked in JavaScript.
const cubeVisual = document.querySelector(".hero-visual:has(.floating-cube)");
if (cubeVisual) {
  const visibleCubeParts = new Set();
  const cubeParts = [...cubeVisual.querySelectorAll(".floating-cube, .cube-reflection")];
  const syncCube = () => cubeVisual.classList.toggle("cube-in-view", visibleCubeParts.size > 0 && !document.hidden);
  if ("IntersectionObserver" in window) {
    const cubeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleCubeParts.add(entry.target);
        else visibleCubeParts.delete(entry.target);
      });
      syncCube();
    });
    cubeParts.forEach((part) => cubeObserver.observe(part));
  } else {
    const checkCube = () => {
      cubeParts.forEach((part) => {
        const bounds = part.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < innerHeight) visibleCubeParts.add(part);
        else visibleCubeParts.delete(part);
      });
      syncCube();
    };
    addEventListener("scroll", checkCube, { passive: true });
    addEventListener("resize", checkCube);
    checkCube();
  }
  document.addEventListener("visibilitychange", syncCube);
  addEventListener("pagehide", () => cubeVisual.classList.remove("cube-in-view"));
  addEventListener("pageshow", syncCube);
}

document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));

navToggle?.addEventListener("click", () => {
  if (!navLinks) return;
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || navToggle?.getAttribute("aria-expanded") !== "true") return;
  closeMobileNav();
  navToggle.focus();
});

document.addEventListener("click", (event) => {
  if (navToggle?.getAttribute("aria-expanded") !== "true") return;
  if (!navLinks?.contains(event.target) && !navToggle.contains(event.target)) closeMobileNav();
});

window.matchMedia("(min-width: 821px)").addEventListener("change", (event) => {
  if (event.matches) closeMobileNav();
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
      target.scrollIntoView({ behavior: motionPreference.matches ? "auto" : "smooth" });
    }
    closeMobileNav();
  });
});

filterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    filterGames(button.dataset.filter || "all");
  });
});

const initialFilter = [...filterButtons].find((button) => button.classList.contains("active"));
filterGames(initialFilter?.dataset.filter || "all");

let scrollFrame = null;
const updateScrollState = () => {
  backToTop?.classList.toggle("is-visible", window.scrollY > 640);
  scrollFrame = null;
};

window.addEventListener(
  "scroll",
  () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(updateScrollState);
  },
  { passive: true }
);
window.addEventListener("resize", () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(updateScrollState);
});

updateScrollState();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: motionPreference.matches ? "auto" : "smooth" });
});
