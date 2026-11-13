(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");
  document.querySelector("#year").textContent = new Date().getFullYear();

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  function closeNavigation() {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
  }
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeNavigation));
  document.addEventListener("click", event => {
    if (!event.target.closest(".site-header")) closeNavigation();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeNavigation();
      navToggle.focus();
    }
  });
  window.matchMedia("(min-width: 821px)").addEventListener("change", event => {
    if (event.matches) closeNavigation();
  });

  const shots = [
    { file: "research-compound", label: "The research compound", alt: "An armored scientist outside the A1 research compound", width: 1584, height: 891 },
    { file: "ash-forest", label: "Forest environment", alt: "A first-person view of a foggy conifer forest", width: 1580, height: 889 },
    { file: "relay-console", label: "Relay terminal", alt: "A green WRC radio relay terminal requesting a keycard scan", width: 1584, height: 891 },
    { file: "storm-approach", label: "Storm environment", alt: "A pistol held toward an industrial building in an orange dust storm", width: 1586, height: 892 },
    { file: "buried-city", label: "Buried settlement", alt: "A ruined settlement disappearing into desert dust", width: 1582, height: 890 },
    { file: "desert-railway", label: "Desert railway", alt: "A railway curving toward a distant tower in a sand-covered landscape", width: 1520, height: 855 },
    { file: "crew-train", label: "Crew and train", alt: "Three teammates beside the armored train in the rain", width: 1516, height: 853 }
  ];
  const source = shot => `images/captured/${shot.file}.jpg`;
  const normalize = index => (index + shots.length) % shots.length;
  const count = index => `${String(index + 1).padStart(2, "0")} / ${String(shots.length).padStart(2, "0")}`;
  const galleryImage = document.querySelector("#gallery-image");
  const galleryOpen = document.querySelector(".gallery-open");
  const thumbs = [...document.querySelectorAll(".gallery-thumb")];
  let selectedShot = 0;
  function setImage(image, shot) {
    image.src = source(shot);
    image.alt = shot.alt;
    image.width = shot.width;
    image.height = shot.height;
  }
  function selectShot(index) {
    selectedShot = normalize(index);
    const shot = shots[selectedShot];
    setImage(galleryImage, shot);
    galleryOpen.href = source(shot);
    galleryOpen.setAttribute("aria-label", `Enlarge screenshot: ${shot.label}`);
    document.querySelector("#gallery-count").textContent = count(selectedShot);
    document.querySelector("#gallery-caption").textContent = shot.label;
    thumbs.forEach((thumb, position) => {
      thumb.classList.toggle("selected", position === selectedShot);
      if (position === selectedShot) thumb.setAttribute("aria-current", "true");
      else thumb.removeAttribute("aria-current");
    });
  }
  const isPlainClick = event => !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0;
  thumbs.forEach((thumb, index) => thumb.addEventListener("click", event => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    selectShot(index);
  }));
  document.querySelectorAll(".gallery-step").forEach(button => button.addEventListener("click", () => selectShot(selectedShot + Number(button.dataset.direction))));
  document.querySelector(".gallery-viewer").addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? shots.length - 1 : selectedShot + (event.key === "ArrowRight" ? 1 : -1);
    selectShot(next);
    thumbs[selectedShot].focus({ preventScroll: true });
    thumbs[selectedShot].scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  });

  const lightbox = document.querySelector(".lightbox");
  const closeButton = lightbox.querySelector(".lightbox-close");
  let expandedShot = 0;
  let opener = null;
  function showExpanded(index) {
    expandedShot = normalize(index);
    const shot = shots[expandedShot];
    setImage(lightbox.querySelector(".lightbox-image"), shot);
    lightbox.querySelector("#lightbox-caption").textContent = shot.label;
    lightbox.querySelector("#lightbox-count").textContent = count(expandedShot);
    lightbox.querySelector(".lightbox-download").href = source(shot);
  }
  function openExpanded(event, index) {
    if (!isPlainClick(event) || typeof lightbox.showModal !== "function") return;
    event.preventDefault();
    opener = event.currentTarget;
    showExpanded(index);
    lightbox.showModal();
    document.body.classList.add("modal-open");
    closeButton.focus({ preventScroll: true });
  }
  document.querySelectorAll(".open-shot").forEach(link => link.addEventListener("click", event => openExpanded(event, Number(link.dataset.shot))));
  galleryOpen.addEventListener("click", event => openExpanded(event, selectedShot));
  closeButton.addEventListener("click", () => lightbox.close());
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showExpanded(expandedShot - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => showExpanded(expandedShot + 1));
  lightbox.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showExpanded(expandedShot + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  lightbox.addEventListener("click", event => {
    if (event.target !== lightbox) return;
    const bounds = lightbox.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) lightbox.close();
  });
  lightbox.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (opener) opener.focus({ preventScroll: true });
  });
})();
