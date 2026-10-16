const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const ambientMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 900px), (hover: none), (pointer: coarse)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)').matches;

if (menuButton && nav) {
  const closeMenu = () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

if (header) {
  let ticking = false;

  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
    ticking = false;
  };

  updateHeader();
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}

const revealElements = document.querySelectorAll('.reveal');

if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8%', threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

if (!motionPreference.matches && finePointer) {
  const parallax = document.querySelector('[data-parallax]');

  if (parallax) {
    const amount = Number(parallax.dataset.parallax) || 0;
    let pointerFrame = 0;

    window.addEventListener('pointermove', (event) => {
      if (motionPreference.matches || pointerFrame) return;

      pointerFrame = window.requestAnimationFrame(() => {
        const x = (event.clientX - window.innerWidth / 2) * amount;
        const y = (event.clientY - window.innerHeight / 2) * amount;
        parallax.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        pointerFrame = 0;
      });
    }, { passive: true });
  }

  document.querySelectorAll('.gallery-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (motionPreference.matches) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateY(${x * 8}deg) rotateX(${y * -8}deg) translateY(-4px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

const rides = [
  { image: 'images/agani.webp', name: 'Agani', type: 'Legendary ride', tagline: 'Built for speed. Allergic to brakes.' },
  { image: 'images/airboat.webp', name: 'Airboat', type: 'Epic ride', tagline: 'Roads are more of a suggestion.' },
  { image: 'images/fire.webp', name: 'Fire', type: 'Hot rod', tagline: 'Classic shape. Extremely loud attitude.' },
  { image: 'images/ufo.png', name: 'UFO', type: 'Secret ride', tagline: 'Traffic rules do not apply in space.' },
  { image: 'images/armycar.webp', name: 'Army Car', type: 'Heavy ride', tagline: 'Makes its own passing lane.' }
];

const rideImage = document.querySelector('.ride-image');
const rideName = document.querySelector('.ride-name');
const rideClass = document.querySelector('.ride-class');
const rideTagline = document.querySelector('.ride-tagline');
const dots = document.querySelector('.ride-dots');
const previousRide = document.querySelector('.ride-arrow--prev');
const nextRide = document.querySelector('.ride-arrow--next');
let currentRide = 0;
let dotButtons = [];

function showRide(index) {
  if (!rideImage || !rideName || !rideClass || !rideTagline) return;

  currentRide = (index + rides.length) % rides.length;
  const ride = rides[currentRide];

  rideImage.classList.add('switching');

  window.setTimeout(() => {
    rideImage.src = ride.image;
    rideImage.alt = ride.name;
    rideName.textContent = ride.name;
    rideClass.textContent = ride.type;
    rideTagline.textContent = ride.tagline;

    dotButtons.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentRide;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    rideImage.classList.remove('switching');
  }, motionPreference.matches ? 0 : 180);
}

// Mobile visitors see the poster and can choose to play the trailer themselves.
const trailer = document.querySelector('.hero-trailer video');
if (trailer) {
  let inView = false;
  let autoplayRequested = !ambientMotionPreference.matches;
  const syncTrailer = () => {
    if (ambientMotionPreference.matches || !inView || document.hidden) trailer.pause();
    else if (autoplayRequested) trailer.play().catch(() => {});
  };
  trailer.addEventListener('pause', () => {
    if (inView && !document.hidden && !ambientMotionPreference.matches) autoplayRequested = false;
  });
  ambientMotionPreference.addEventListener('change', () => {
    autoplayRequested = !ambientMotionPreference.matches;
    syncTrailer();
  });
  document.addEventListener('visibilitychange', syncTrailer);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncTrailer();
    }).observe(trailer);
  } else {
    inView = true;
    syncTrailer();
  }
}

if (dots) {
  dotButtons = rides.map((ride, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show ${ride.name}`);
    dot.addEventListener('click', () => showRide(index));
    dots.appendChild(dot);
    return dot;
  });
}

previousRide?.addEventListener('click', () => showRide(currentRide - 1));
nextRide?.addEventListener('click', () => showRide(currentRide + 1));
showRide(0);

const year = document.querySelector('#year');
if (year) {
  year.textContent = new Date().getFullYear();
}
