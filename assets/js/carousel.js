/* ════════════════════════════════════════════════
   CAROUSEL.JS — Galerie d'identité visuelle (accueil)
   Carrousel basé sur le scroll-snap natif (fluide et tactile
   sur mobile) + flèches, points et défilement automatique
   doux qui respecte prefers-reduced-motion et se met en pause
   dès que l'utilisateur interagit.
════════════════════════════════════════════════ */
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.children);

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Aller à l'image ${i + 1} sur ${slides.length}`);
    dot.addEventListener('click', () => allerA(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function indexActuel() {
    const scrollGauche = track.scrollLeft;
    let plusProche = 0, distanceMin = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - scrollGauche);
      if (d < distanceMin) { distanceMin = d; plusProche = i; }
    });
    return plusProche;
  }

  function majDots() {
    const i = indexActuel();
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  }

  function allerA(i) {
    slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => allerA(Math.max(0, indexActuel() - 1)));
  if (nextBtn) nextBtn.addEventListener('click', () => allerA(Math.min(slides.length - 1, indexActuel() + 1)));

  let debounceScroll;
  track.addEventListener('scroll', () => {
    clearTimeout(debounceScroll);
    debounceScroll = setTimeout(majDots, 100);
  }, { passive: true });
  majDots();

  const reduitAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduitAnimations) {
    let auto = setInterval(() => {
      const i = indexActuel();
      allerA(i >= slides.length - 1 ? 0 : i + 1);
    }, 5000);
    const stopper = () => clearInterval(auto);
    ['pointerdown', 'touchstart', 'wheel'].forEach(ev => track.addEventListener(ev, stopper, { passive: true }));
    [prevBtn, nextBtn].forEach(b => b && b.addEventListener('click', stopper));
  }
}

document.addEventListener('DOMContentLoaded', initCarousel);
