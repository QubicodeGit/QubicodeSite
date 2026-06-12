const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

if (!reduceMotion) {
  const parallax = document.querySelector('[data-parallax]');
  window.addEventListener('pointermove', (event) => {
    if (window.innerWidth < 900) return;
    const amount = Number(parallax.dataset.parallax);
    const x = (event.clientX - window.innerWidth / 2) * amount;
    const y = (event.clientY - window.innerHeight / 2) * amount;
    parallax.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });

  document.querySelectorAll('.gallery-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
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
  { image: 'images/agani.png', name: 'Agani', type: 'Legendary ride', tagline: 'Built for speed. Allergic to brakes.' },
  { image: 'images/airboat.png', name: 'Airboat', type: 'Epic ride', tagline: 'Roads are more of a suggestion.' },
  { image: 'images/fire.png', name: 'Fire', type: 'Hot rod', tagline: 'Classic shape. Extremely loud attitude.' },
  { image: 'images/ufo.png', name: 'UFO', type: 'Secret ride', tagline: 'Traffic rules do not apply in space.' },
  { image: 'images/armycar.png', name: 'Army Car', type: 'Heavy ride', tagline: 'Makes its own passing lane.' }
];

let currentRide = 0;
const rideImage = document.querySelector('.ride-image');
const rideName = document.querySelector('.ride-name');
const rideClass = document.querySelector('.ride-class');
const rideTagline = document.querySelector('.ride-tagline');
const dots = document.querySelector('.ride-dots');

rides.forEach((ride, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Show ${ride.name}`);
  dot.addEventListener('click', () => showRide(index));
  dots.appendChild(dot);
});

function showRide(index) {
  currentRide = (index + rides.length) % rides.length;
  const ride = rides[currentRide];
  rideImage.classList.add('switching');
  window.setTimeout(() => {
    rideImage.src = ride.image;
    rideImage.alt = ride.name;
    rideName.textContent = ride.name;
    rideClass.textContent = ride.type;
    rideTagline.textContent = ride.tagline;
    document.querySelectorAll('.ride-dots button').forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === currentRide);
    });
    rideImage.classList.remove('switching');
  }, reduceMotion ? 0 : 220);
}

document.querySelector('.ride-arrow--prev').addEventListener('click', () => showRide(currentRide - 1));
document.querySelector('.ride-arrow--next').addEventListener('click', () => showRide(currentRide + 1));
showRide(0);

document.querySelector('#year').textContent = new Date().getFullYear();
