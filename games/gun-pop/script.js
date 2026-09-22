"use strict";

document.body.classList.add("enhanced");
document.querySelector("#year").textContent = new Date().getFullYear();

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const motionButton = document.querySelector(".motion-toggle");
const soundButton = document.querySelector(".sound-toggle");
let motionPaused = reducedMotion.matches;
let soundEnabled = false;
let audioContext = null;

function updateMotion() {
  document.body.classList.toggle("motion-paused", motionPaused);
  motionButton.setAttribute("aria-pressed", String(motionPaused));
  motionButton.setAttribute("aria-label", reducedMotion.matches ? "Reduced motion enabled by your device" : motionPaused ? "Resume animations" : "Pause animations");
  motionButton.disabled = reducedMotion.matches;
}

motionButton.addEventListener("click", () => {
  motionPaused = !motionPaused;
  updateMotion();
});
reducedMotion.addEventListener("change", () => {
  motionPaused = reducedMotion.matches;
  updateMotion();
});
updateMotion();

// Short toy-like notes play only after the visitor explicitly enables sound.
function playPop(pitch = 650) {
  if (!soundEnabled || !audioContext || audioContext.state !== "running") return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(pitch, now);
  oscillator.frequency.exponentialRampToValueAtTime(pitch * .35, now + .14);
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(.07, now + .01);
  gain.gain.exponentialRampToValueAtTime(.0001, now + .16);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + .18);
  oscillator.addEventListener("ended", () => { oscillator.disconnect(); gain.disconnect(); }, { once: true });
}

soundButton.addEventListener("click", async () => {
  if (soundEnabled) {
    soundEnabled = false;
  } else {
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) {
      soundButton.setAttribute("aria-label", "Sound is unavailable in this browser");
      soundButton.disabled = true;
      return;
    }
    try {
      audioContext ||= new AudioEngine();
      await audioContext.resume();
      soundEnabled = true;
      playPop(900);
    } catch {
      soundEnabled = false;
    }
  }
  soundButton.setAttribute("aria-pressed", String(soundEnabled));
  soundButton.setAttribute("aria-label", soundEnabled ? "Mute sound" : "Enable sound");
});

document.querySelectorAll(".flip-prop").forEach((gun) => {
  gun.addEventListener("click", () => {
    if (gun.classList.contains("is-flipping")) return;
    playPop(450);
    gun.classList.add("is-flipping");
    setTimeout(() => gun.classList.remove("is-flipping"), 720);
  });
});

const booth = document.querySelector(".shooting-booth");
const effects = document.querySelector(".pop-effects");
const scoreOutput = document.querySelector("#score");
const shotAnnouncement = document.querySelector("#shot-announcement");
let score = 0;
let combo = 0;
let lastHit = -Infinity;

function temporaryEffect(className, duration) {
  const element = document.createElement("span");
  element.className = className;
  effects.append(element);
  setTimeout(() => element.remove(), duration);
  return element;
}

document.querySelectorAll(".pop-target").forEach((target) => {
  target.addEventListener("click", () => {
    if (target.getAttribute("aria-disabled") === "true") return;
    const points = Number(target.dataset.points);
    const now = performance.now();
    combo = now - lastHit < 2500 ? combo + 1 : 1;
    lastHit = now;
    score += points;
    scoreOutput.textContent = String(score).padStart(3, "0");
    shotAnnouncement.textContent = `${points} points! Total score: ${score}.${combo > 1 ? ` Combo times ${combo}!` : ""}`;
    target.classList.add("is-hit");
    target.setAttribute("aria-disabled", "true");
    playPop(550 + Math.min(combo, 8) * 130);
    setTimeout(() => {
      target.classList.remove("is-hit");
      target.removeAttribute("aria-disabled");
    }, 860);

    const stageBounds = booth.getBoundingClientRect();
    const targetBounds = target.getBoundingClientRect();
    const x = targetBounds.left + targetBounds.width / 2 - stageBounds.left;
    const y = targetBounds.top + targetBounds.height / 2 - stageBounds.top;
    const word = temporaryEffect("pop-word", 1150);
    word.style.left = `${x}px`;
    word.style.top = `${y}px`;
    word.textContent = combo >= 3 ? `COMBO ×${combo}!` : combo === 2 ? "NICE SHOT!" : `POP! +${points}`;

    if (motionPaused || reducedMotion.matches) return;
    for (let index = 0; index < 8; index += 1) {
      const particle = temporaryEffect("pop-bit", 850);
      const angle = index / 8 * Math.PI * 2;
      particle.textContent = index % 2 ? "✦" : "•";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty("--dx", `${Math.cos(angle) * (65 + Math.random() * 50)}px`);
      particle.style.setProperty("--dy", `${Math.sin(angle) * (65 + Math.random() * 50)}px`);
    }
    const gunBounds = document.querySelector(".hero-gun").getBoundingClientRect();
    const muzzleX = gunBounds.left - stageBounds.left + gunBounds.width * .05;
    const muzzleY = gunBounds.top - stageBounds.top + gunBounds.height * .2;
    const line = temporaryEffect("shot-line", 200);
    line.style.left = `${muzzleX}px`;
    line.style.top = `${muzzleY}px`;
    line.style.width = `${Math.hypot(x - muzzleX, y - muzzleY)}px`;
    line.style.transform = `rotate(${Math.atan2(y - muzzleY, x - muzzleX)}rad)`;
  });
});

const bossToggle = document.querySelector(".boss-toggle");
const bossWindow = document.querySelector(".boss-window");
bossToggle.addEventListener("click", () => {
  const open = bossWindow.classList.toggle("is-open");
  bossToggle.setAttribute("aria-expanded", String(open));
  bossToggle.textContent = open ? "Close the shutters" : "Knock, knock! ✊";
  document.querySelector(".boss-reaction").textContent = open ? "Yep. That's a barrel with a helmet." : "Someone's hiding in there.";
  playPop(open ? 260 : 200);
});

const lootStage = document.querySelector(".loot-stage");
const crateButton = document.querySelector(".crate-button");
const crateTrigger = document.querySelector(".crate-trigger");
const rewardFan = document.querySelector(".reward-fan");
function toggleCrate() {
  const open = lootStage.classList.toggle("is-open");
  crateButton.setAttribute("aria-expanded", String(open));
  crateTrigger.setAttribute("aria-expanded", String(open));
  crateButton.setAttribute("aria-label", open ? "Close the Workshop Crate" : "Open the Workshop Crate");
  rewardFan.setAttribute("aria-hidden", String(!open));
  crateTrigger.textContent = open ? "Close the crate" : "Pop the crate! ✦";
  document.querySelector(".loot-caption").textContent = open ? "Coins! Skins! Upgrade tokens!" : "Go on. You know you want to.";
  playPop(open ? 1100 : 500);
}
crateButton.addEventListener("click", toggleCrate);
crateTrigger.addEventListener("click", toggleCrate);
crateTrigger.setAttribute("aria-expanded", "false");

// Keep the floating game menu on the scene nearest the visitor's reading position.
const dockLinks = [...document.querySelectorAll(".game-dock a")];
const scenes = [...document.querySelectorAll("main > section[id]")];
let scrollFrame = 0;
function updateDock() {
  const readingLine = innerHeight * .4;
  let current = scenes[0].id;
  for (const scene of scenes) {
    if (scene.getBoundingClientRect().top <= readingLine) current = scene.id;
  }
  dockLinks.forEach((link) => {
    if (link.hash === `#${current}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  scrollFrame = 0;
}
addEventListener("scroll", () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateDock);
}, { passive: true });
addEventListener("resize", updateDock);
updateDock();

const screenshots = [...document.querySelectorAll(".photo-wall .screenshot-link")];
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxCaption = lightbox.querySelector("figcaption");
let currentScreenshot = 0;
let lightboxTrigger = null;

function showScreenshot(index) {
  currentScreenshot = (index + screenshots.length) % screenshots.length;
  const link = screenshots[currentScreenshot];
  lightboxImage.src = link.href;
  lightboxImage.alt = link.querySelector("img").alt;
  lightboxCaption.textContent = `${currentScreenshot + 1} / ${screenshots.length} — ${link.closest("figure").querySelector("figcaption").textContent}`;
}

document.querySelectorAll(".screenshot-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof lightbox.showModal !== "function") return;
    event.preventDefault();
    lightboxTrigger = link;
    showScreenshot(Number(link.dataset.shot));
    lightbox.showModal();
    document.body.classList.add("modal-open");
  });
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showScreenshot(currentScreenshot - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showScreenshot(currentScreenshot + 1));
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showScreenshot(currentScreenshot + (event.key === "ArrowRight" ? 1 : -1));
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
