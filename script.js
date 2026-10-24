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
  roblox:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" stroke="none" d="M5.4 1.8 22.2 5.4 18.6 22.2 1.8 18.6Zm4.8 7-1 5 5 1 1-5Z"></path></svg>',
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
    status: "In Development",
    statusClass: "status-development",
    platforms: ["Steam", "PC", "Singleplayer"],
    genre: "Singleplayer First-Person Horror",
    theme: "scp-087",
    filters: ["steam", "horror", "singleplayer"],
    page: "games/scp-087-exploration-iv/index.html",
    image: "games/scp-087-exploration-iv/images/scp087screenshot.jpg",
    imageWidth: 1579,
    imageHeight: 888,
    cardLogo: "games/scp-087-exploration-iv/images/scp087-wordmark.svg",
    cardLogoWidth: 800,
    cardLogoHeight: 240,
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
    image: "games/red-signal/images/red-signal-card-background.webp",
    imageWidth: 1280,
    imageHeight: 720,
    imageAlt: "Red-lit alien creature beneath a glowing planet above a Martian canyon",
    cardWordmark: ["RED", "SIGNAL"],
    logo: "Images/RedSignalIcon.webp",
    logoWidth: 878,
    logoHeight: 878,
    description:
      "First-person sci-fi horror on Mars. Follow a mysterious signal through dust storms, explore a dark station, and face what waits inside.",
    tags: ["Horror", "Mars", "Sci-Fi", "First Person", "Singleplayer", "Survival"]
  },
  {
    title: "Brawlbots",
    status: "In Development",
    statusClass: "status-development",
    platforms: ["Steam", "PC", "Multiplayer"],
    genre: "Third-Person Multiplayer Puzzle Brawler",
    theme: "brawlbots",
    filters: ["steam", "multiplayer"],
    page: "games/brawlbots/index.html",
    image: "games/brawlbots/images/scrapyard-card.webp",
    imageAlt: "Four colorful Brawlbots in the Scrapyard Facility, surrounded by cranes, trucks, and industrial machinery",
    imageWidth: 1589,
    imageHeight: 886,
    cardLogo: "games/brawlbots/images/brawlbots-wordmark.svg",
    cardLogoWidth: 800,
    cardLogoHeight: 400,
    description:
      "Four bots. One broken world. Team up, solve puzzles, and brawl through a robot uprising.",
    tags: ["Third Person", "Co-op", "Puzzle", "Brawler", "Robots"]
  },
  {
    title: "Gun Pop",
    status: "Seeking publisher",
    statusClass: "status-seeking",
    platforms: ["Mobile", "iOS", "Android"],
    genre: "One-Tap Arcade Shooter",
    theme: "gun-pop",
    filters: ["mobile"],
    page: "games/gun-pop/index.html",
    image: "games/gun-pop/images/gun-pop-preview.webp",
    imageWidth: 1280,
    imageHeight: 720,
    imageAlt: "Gun Pop logo surrounded by colorful guns, wooden bosses, and targets from the game",
    description:
      "Launch a spinning gun, time your shots, smash targets, and chase ×8 combos through colorful stages and boss fights.",
    tags: ["Mobile", "Arcade", "Timing", "Combos", "Bosses", "Customization"]
  },
  {
    title: "Recovery Unit",
    status: "In Development",
    statusClass: "status-development",
    platforms: ["PC", "Multiplayer"],
    genre: "Cooperative Survival FPS",
    theme: "recovery-unit",
    filters: ["steam", "multiplayer"],
    page: "games/recovery-unit/index.html",
    image: "games/recovery-unit/images/recovery-unit-key-art.webp",
    imageWidth: 1280,
    imageHeight: 720,
    imageAlt: "Recovery Unit title with four researchers and their armored train in a rain-soaked forest",
    description:
      "Four scientists. One armored train. Explore a world devastated by disease, recover vital samples, and search for a cure together.",
    tags: ["FPS", "Co-op", "Train", "Research", "Survival"]
  },
  {
    title: "REALMS RPG",
    status: "Published",
    statusClass: "status-published",
    platforms: ["Roblox", "Multiplayer"],
    genre: "Fantasy Action RPG",
    theme: "realms-rpg",
    filters: ["roblox", "multiplayer", "mobile"],
    page: "https://www.roblox.com/games/1827975522/REALMS-RPG",
    image: "Images/roblox/realms-rpg-card.webp",
    imageWidth: 960,
    imageHeight: 640,
    imageAlt: "REALMS RPG artwork with the red-and-gold knight, glowing sword, and sunlit stone ruins",
    description: "Explore 16 realms, collect swords and armor, and challenge 13 bosses with friends.",
    tags: ["Roblox", "RPG", "Fantasy", "Swords", "Bosses", "Adventure"]
  },
  {
    title: "Go Up!",
    status: "Published",
    statusClass: "status-published",
    platforms: ["Roblox", "Multiplayer"],
    genre: "Balloon Arcade",
    theme: "go-up",
    filters: ["roblox", "multiplayer"],
    page: "https://www.roblox.com/games/79253465106974/Go-Up",
    image: "Images/roblox/go-up-card.webp",
    imageWidth: 960,
    imageHeight: 640,
    imageAlt: "Go Up! artwork with a red balloon, orange-haired avatar, and floating islands",
    description: "Inflate your balloon, soar to new worlds, and pop rival players out of the sky.",
    tags: ["Roblox", "Arcade", "Balloons", "Flying", "Upgrades", "PvP"]
  },
  {
    title: "Break Everything",
    status: "In Development",
    statusClass: "status-development",
    platforms: ["Roblox", "Multiplayer"],
    genre: "Destruction Simulator",
    theme: "break-everything",
    filters: ["roblox", "multiplayer"],
    page: "https://www.roblox.com/games/75791954185614/Break-Everything",
    image: "Images/roblox/break-everything-card.webp",
    imageWidth: 960,
    imageHeight: 640,
    imageAlt: "Break Everything artwork with the hammer-wielding avatar smashing a red block wall",
    description: "Smash 15 realms, unlock 46 tools, and compete in chaotic demolition events.",
    tags: ["Roblox", "Destruction", "Simulator", "Tools", "Rebirth", "Demolition"]
  },
  {
    title: "COIN RUSH",
    status: "In Development",
    statusClass: "status-development",
    platforms: ["Roblox", "Multiplayer"],
    genre: "Roblox Experience",
    theme: "coin-rush",
    filters: ["roblox", "multiplayer"],
    page: "https://www.roblox.com/games/130059195387129/COIN-RUSH",
    image: "Images/roblox/coin-rush-card.webp",
    imageWidth: 960,
    imageHeight: 640,
    imageAlt: "COIN RUSH artwork with a smiling yellow avatar, hammer, gold coins, and green banknotes",
    description: "A colorful, coin-filled Roblox world. A new Qubicode experience in the making.",
    tags: ["Roblox", "Coins", "Currency"]
  },
  {
    title: "Build the Eiffel Tower!",
    status: "In Development",
    statusClass: "status-development",
    platforms: ["Roblox", "Multiplayer"],
    genre: "Cooperative Building Simulator",
    theme: "build-the-eiffel-tower",
    filters: ["roblox", "multiplayer", "mobile"],
    page: "https://www.roblox.com/games/122848283773531/Build-the-Eiffel-Tower",
    image: "Images/roblox/build-the-eiffel-tower-card.webp",
    imageWidth: 960,
    imageHeight: 640,
    imageAlt: "Build the Eiffel Tower! artwork with a French builder carrying a block beside the golden voxel tower",
    description: "Team up to build Paris, one block at a time. Train, upgrade, and reach the summit.",
    tags: ["Roblox", "Co-op", "Building", "Simulator", "Paris", "Eiffel Tower"]
  },
  {
    title: "ZombieShooter",
    status: "In Development",
    statusClass: "status-development",
    platforms: ["Roblox", "Multiplayer"],
    genre: "Zombie Shooter",
    theme: "zombie-shooter",
    filters: ["roblox", "multiplayer"],
    page: "https://www.roblox.com/games/112062639497548/ZombieShooter",
    image: "Images/roblox/zombie-shooter-card.webp",
    imageWidth: 960,
    imageHeight: 640,
    imageAlt: "ZombieShooter artwork with a blocky green zombie, a first-person rifle, and a crumbling stone wall",
    description: "Take aim at the undead in a blocky Roblox shooter. Currently in development.",
    tags: ["Roblox", "Zombies", "Shooter", "FPS"]
  }
];

const year = document.querySelector("#year");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const gameGrid = document.querySelector("#game-grid");
const filterButtons = document.querySelectorAll(".filter-bar .filter-button");
const gameSearch = document.querySelector("#game-search");
const gameResults = document.querySelector("#game-results");
const emptyGames = document.querySelector("#empty-games");
const resetGameFilters = document.querySelector("#reset-game-filters");
const backToTop = document.querySelector(".back-to-top");
let gameCards = [];
let activeGameFilter = "all";

if (year) {
  year.textContent = new Date().getFullYear();
}

function platformIcon(name) {
  const key = name.toLowerCase().replace(/\s*\/\s*/g, " ").split(" ")[0];
  return platformIcons[key] || platformIcons.default;
}

function platformMarkup(platforms) {
  return platforms
    .map((platform) => `<span class="platform-tag${platform === "Roblox" ? " platform-tag-named" : ""}" title="${platform}">${platformIcon(platform)}<span${platform === "Roblox" ? "" : ' class="sr-only"'}>${platform}</span></span>`)
    .join("");
}

function escapeAttribute(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
    .sort((a, b) =>
      Number(a.filters.includes("roblox")) - Number(b.filters.includes("roblox")) ||
      gameStatusRank(a) - gameStatusRank(b)
    )
    .map((game) => {
      const pageHref = game.page || "404.html";
      const isRoblox = game.filters.includes("roblox");
      const pageLabel = game.page ? `View ${game.title}${isRoblox ? " on Roblox" : ""}` : `${game.title} page coming soon`;
      const searchText = escapeAttribute([game.title, game.genre, game.description, ...game.platforms, ...game.filters, ...game.tags].join(" ").toLowerCase());
      const mediaClass = game.mediaMode === "contain" ? "game-media image-contain" : "game-media";
      const imageMarkup = game.image
        ? `<img src="${game.image}" width="${game.imageWidth}" height="${game.imageHeight}" alt="${game.imageAlt || `${game.title} screenshot`}" loading="lazy" decoding="async">`
        : `<div class="placeholder-media"><span>${game.title} visual coming soon</span></div>`;

      return `
        <article class="game-card game-tab game-theme-${game.theme}${isRoblox ? " game-platform-roblox" : ""}" data-filters=" ${game.filters.join(" ")} " data-search="${searchText}">
          <div class="game-tab-visual">
            <div class="${mediaClass}">
              ${imageMarkup}
            </div>
            ${game.cardWordmark ? `<div class="game-card-wordmark" aria-hidden="true">${game.cardWordmark.map(word => `<span>${word}</span>`).join("")}</div>` : ""}
            ${game.cardLogo ? `<img class="game-card-art-logo" src="${game.cardLogo}" width="${game.cardLogoWidth}" height="${game.cardLogoHeight}" alt="" aria-hidden="true" loading="lazy" decoding="async">` : ""}
          </div>
          <a class="game-card-link" href="${pageHref}" aria-label="${pageLabel}" title="${pageLabel}"></a>
          ${game.page ? `<a class="game-shortcut" href="${game.page}" aria-label="${pageLabel}">${shortcutArrow}</a>` : ""}
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
  activeGameFilter = filter;
  const terms = (gameSearch?.value || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  let visibleCount = 0;
  gameCards.forEach((card) => {
    const matchesCategory = filter === "all" || card.dataset.filters.includes(` ${filter} `);
    const matches = matchesCategory && terms.every((term) => card.dataset.search.includes(term));
    card.hidden = !matches;
    card.classList.toggle("is-hidden", !matches);
    if (matches) visibleCount += 1;
  });
  if (gameResults) gameResults.textContent = `Showing ${visibleCount} of ${gameCards.length} games`;
  if (emptyGames) emptyGames.hidden = visibleCount > 0;
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
gameSearch?.addEventListener("input", () => filterGames(activeGameFilter));
resetGameFilters?.addEventListener("click", () => {
  if (gameSearch) gameSearch.value = "";
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === "all";
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  filterGames("all");
  gameSearch?.focus();
});

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
