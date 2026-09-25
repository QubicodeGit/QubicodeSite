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
    status: "Seeking Publisher",
    statusClass: "status-publisher",
    platforms: ["Mobile", "iOS", "Android"],
    genre: "Endless Mobile Arcade",
    theme: "driver-dash",
    filters: ["mobile"],
    page: "games/driver-dash/index.html",
    image: "Images/driverdashHero.png",
    imageWidth: 1024,
    imageHeight: 500,
    description:
      "Dodge traffic, boost past obstacles, and unlock your next ride in a fast-paced mobile arcade game."
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
    description:
      "Descend into the infamous infinite staircase. A short first-person horror experience based on SCP-087."
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
    description:
      "A first-person horror game set on Mars."
  },
  {
    title: "Recovery Unit",
    status: "Future",
    statusClass: "status-future",
    platforms: ["Steam", "PC", "Multiplayer"],
    genre: "Multiplayer First-Person Infection Shooter",
    theme: "recovery-unit",
    filters: ["steam", "multiplayer"],
    page: "",
    image: "Images/recoveryunitScreenshot.png",
    imageWidth: 1672,
    imageHeight: 941,
    description:
      "Enter contaminated zones and face mutated creatures in a four-player infection shooter."
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
      "Four malfunctioning bots. One corrupted world. A multiplayer puzzle brawler."
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
    image: "games/gun-pop/images/GunPopLogo.png",
    imageWidth: 1448,
    imageHeight: 1086,
    imageAlt: "Gun Pop logo",
    mediaMode: "contain",
    description:
      "Flick, flip, and time your shots. Hit targets and ricochet panels in a mobile arcade shooter."
  }
];

// Stable sorting keeps the original order of games within the same status.
const gameStatusOrder = {
  "Published": 0,
  "Seeking Publisher": 1,
  "In Development": 2,
  "Future": 3
};

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
    .map((platform) => `<span class="platform-tag">${platformIcon(platform)}${platform}</span>`)
    .join("");
}

function renderGames() {
  if (!gameGrid) return;
  gameGrid.innerHTML = [...games]
    .sort((a, b) => (gameStatusOrder[a.status] ?? 4) - (gameStatusOrder[b.status] ?? 4))
    .map((game) => {
      const mediaClass = game.mediaMode === "contain" ? "game-media image-contain" : "game-media";
      const platformList = `<div class="platform-list" aria-label="${game.title} platforms">${platformMarkup(game.platforms)}</div>`;

      return `
        <article class="game-card game-theme-${game.theme} reveal" data-filters=" ${game.filters.join(" ")} " aria-labelledby="game-${game.theme}">
          <div class="${mediaClass}">
            <img src="${game.image}" width="${game.imageWidth}" height="${game.imageHeight}" alt="${game.imageAlt || `${game.title} artwork`}" loading="lazy" decoding="async">
          </div>
          <div class="game-meta">
            ${platformList}
            <span class="badge ${game.statusClass}">${game.status}</span>
          </div>
          <div class="game-content">
            <h3 id="game-${game.theme}">${game.title}</h3>
            <p class="genre-line">${game.genre}</p>
            <p class="game-description">${game.description}</p>
            <div class="game-actions">
              ${
                game.page
                  ? `<a class="card-link" href="${game.page}" aria-label="View ${game.title}">View Game <span aria-hidden="true">&rarr;</span></a>`
                  : `<span class="card-link disabled-link">Details to follow</span>`
              }
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

// Reveals sections and cards as they enter the viewport.
function setupReveal() {
  const items = document.querySelectorAll(".reveal");

  if (motionPreference.matches || !("IntersectionObserver" in window)) {
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
  gameCards.forEach((card) => {
    card.hidden = filter !== "all" && !card.dataset.filters.includes(` ${filter} `);
  });
  const count = gameCards.filter((card) => !card.hidden).length;
  document.querySelector("#filter-status").textContent = filter === "all"
    ? `Showing all ${count} games`
    : `Showing ${count} ${filter} games`;
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
          const active = item.getAttribute("href") === `#${id}`;
          item.classList.toggle("active", active);
          if (active) item.setAttribute("aria-current", "location");
          else item.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// Only the visible hero needs continuous motion; CSS handles every frame.
function setupHeroMotion() {
  const hero = document.querySelector(".hero");
  if (!hero || !("IntersectionObserver" in window)) return;

  let inView = false;
  const updateMotion = () => {
    hero.classList.toggle("is-animating", inView && !document.hidden && !motionPreference.matches);
  };
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting && entry.intersectionRatio >= 0.01;
    updateMotion();
  }, { threshold: 0.01 });

  observer.observe(hero);
  document.addEventListener("visibilitychange", updateMotion);
  motionPreference.addEventListener("change", updateMotion);
}

renderGames();
setupReveal();
setupActiveNav();
setupHeroMotion();

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navToggle?.getAttribute("aria-expanded") === "true") {
    closeMobileNav();
    navToggle.focus();
  }
});

// A mobile menu must not leave the desktop page locked after resizing.
window.matchMedia("(max-width: 620px)").addEventListener("change", (event) => {
  if (!event.matches) closeMobileNav();
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

document.querySelectorAll(".hero-actions a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: motionPreference.matches ? "auto" : "smooth" });
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    filterGames(button.dataset.filter);
  });
});

let scrollFrame = null;
let backToTopVisible = false;
const updateScrollState = () => {
  const isVisible = window.scrollY > 640;
  if (isVisible !== backToTopVisible) {
    backToTop?.classList.toggle("is-visible", isVisible);
    backToTopVisible = isVisible;
  }
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
updateScrollState();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: motionPreference.matches ? "auto" : "smooth" });
});
