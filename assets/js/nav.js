/* ════════════════════════════════════════════════
   NAV.JS — topbar compartida
   Cada página définit AVANT d'inclure ce script :
     window.PAGE_PREFIX = ""      (en index.html, raíz)
     window.PAGE_PREFIX = "../"   (en pages/*.html)
     window.CURRENT_PAGE = "cafe" (id de pestaña/enlace activo)
     window.TOPBAR_CTA = { href, label, icon }  (optionnel — bouton
       d'appel à l'action affiché dans la topbar, ex. « Rejoindre »
       sur les pages vitrine ; omis sur les pages d'activité)
════════════════════════════════════════════════ */
(function () {
  const prefix = window.PAGE_PREFIX ?? '';
  const current = window.CURRENT_PAGE ?? '';
  const cta = window.TOPBAR_CTA ?? null;

  const links = [
    { id: 'accueil', href: prefix + 'index.html', label: 'Accueil' },
    { id: 'cafe', href: prefix + 'pages/cafe.html', label: 'Le Café du Vendredi' },
    { id: 'defis', href: prefix + 'pages/defis.html', label: 'Le Défi de la Semaine' },
    { id: 'jeux', href: prefix + 'pages/jeux.html', label: 'Jeux' },
    { id: 'dictees', href: prefix + 'pages/dictees.html', label: 'Dictées' },
    { id: 'carnet', href: prefix + 'pages/carnet.html', label: 'Mon Carnet' },
    { id: 'expressions', href: prefix + 'pages/expressions.html', label: 'La Boîte à Expressions' },
    { id: 'culture', href: prefix + 'pages/culture.html', label: 'Le Coin Culture' },
    { id: 'amis', href: prefix + 'pages/amis.html', label: 'Entre Amis' },
  ];

  /* Ponts vers l'écosystème pédagogique complet (pages "hors nav"
     mais toujours en ligne : concept, pédagogie, ressources, contact...) */
  const liensDecouverte = [
    { id: 'pourquoi', href: prefix + 'pourquoi.html', label: 'Le Concept' },
    { id: 'animateur', href: prefix + 'animateur.html', label: "L'Animateur" },
    { id: 'niveles', href: prefix + 'niveles.html', label: 'Parcours CECR' },
    { id: 'funciona', href: prefix + 'funciona.html', label: 'Comment ça marche' },
    { id: 'recursos', href: prefix + 'recursos.html', label: 'Centre de Ressources' },
    { id: 'bibliotheque', href: prefix + 'bibliotheque.html', label: 'Bibliothèque de Conversation' },
    { id: 'mediatheque', href: prefix + 'mediatheque.html', label: 'Médiathèque' },
    { id: 'temas', href: prefix + 'temas.html', label: 'Thèmes de conversation' },
    { id: 'certification', href: prefix + 'certification.html', label: 'Espace DELF/DALF' },
    { id: 'calendario', href: prefix + 'calendario.html', label: 'Calendrier' },
    { id: 'comunidad', href: prefix + 'comunidad.html', label: 'Communauté' },
    { id: 'mur', href: prefix + 'mur.html', label: 'Le Mur de Vendredi' },
    { id: 'ideas', href: prefix + 'ideas.html', label: 'Contact & FAQ' },
  ];

  const tabsHtml = links.map(l =>
    `<a href="${l.href}"${l.id === current ? ' class="active" aria-current="page"' : ''}>${l.label}</a>`
  ).join('');

  const ctaHtml = cta
    ? `<a class="topbar-cta" href="${cta.href}" target="_blank" rel="noopener">${cta.icon ? `<i class="${cta.icon}"></i> ` : ''}${cta.label}</a>`
    : '';

  const html = `
    <div class="topbar-inner">
      <a class="brand" href="${prefix}index.html">Vendredi <span>entre Amis</span></a>
      <nav id="tabs" aria-label="Sections du club">${tabsHtml}</nav>
      ${ctaHtml}
    </div>`;

  barraDelSitio();
  document.getElementById('topbar-mount').innerHTML = html;
  peuplerFooter(prefix, liensDecouverte, current);
  fondoDelSitio();
})();

function peuplerFooter(prefix, liensDecouverte, current) {
  const footer = document.getElementById('club-footer');
  if (!footer) return;
  const copyright = footer.textContent.trim();
  const liensHtml = liensDecouverte.map(l =>
    `<a href="${l.href}"${l.id === current ? ' class="active" aria-current="page"' : ''}>${l.label}</a>`
  ).join('');
  footer.innerHTML = `
    <nav class="footer-decouverte" aria-label="Découvrir l'écosystème">${liensHtml}</nav>
    <p class="footer-copy">${copyright} · <a href="https://migueltillero-ship-it.github.io/MiguelTillero/" target="_blank" rel="noopener">Site principal de Miguel Tillero</a></p>
  `;
}

/* ════════════════════════════════════════════════
   Barra del sitio de Miguel + fondo de puntos 3D
   El club comparte el menú y el fondo del sitio principal
   (migueltillero-ship-it.github.io/MiguelTillero) para que
   pasar de uno a otro no se sienta como cambiar de web.
════════════════════════════════════════════════ */
function barraDelSitio() {
  const BASE = 'https://migueltillero-ship-it.github.io/MiguelTillero/';
  let lang = 'es';
  try { lang = (localStorage.getItem('preferenciaIdioma_MT') || 'es'); } catch (e) {}
  if (['es', 'fr', 'en'].indexOf(lang) === -1) lang = 'es';
  const items = [
    ['index.html',       { es: 'Inicio', fr: 'Accueil', en: 'Home' }],
    ['perfil.html',      { es: 'Perfil', fr: 'Profil', en: 'Profile' }],
    ['servicios.html',   { es: 'Servicios', fr: 'Services', en: 'Services' }],
    ['cursos.html',      { es: 'Cursos y exámenes', fr: 'Cours et examens', en: 'Courses & exams' }],
    ['galeria.html',     { es: 'Galería', fr: 'Galerie', en: 'Gallery' }],
    ['mi-espacio.html',  { es: 'Mi espacio', fr: 'Mon espace', en: 'My space' }],
    [null,               { es: 'Vendredi entre Amis', fr: 'Vendredi entre Amis', en: 'Vendredi entre Amis' }],
    ['inscribete.html',  { es: 'Inscríbete', fr: 'Inscription', en: 'Enroll' }],


    ['contacto.html',    { es: 'Contacto', fr: 'Contact', en: 'Contact' }],

  ];
  const links = items.map(it => it[0] === null
    ? '<a class="club-actual" href="' + (window.PAGE_PREFIX ?? '') + 'index.html" aria-current="page">' + it[1][lang] + '</a>'
    : '<a href="' + BASE + it[0] + '">' + it[1][lang] + '</a>').join('');
  const barra = document.createElement('div');
  barra.className = 'sitio-barra';
  barra.innerHTML = '<a class="sitio-marca" href="' + BASE + 'index.html">Miguel <em>Tillero</em></a><nav aria-label="Sitio de Miguel Tillero">' + links + '</nav>';
  document.body.insertBefore(barra, document.body.firstChild);
}

function fondoDelSitio() {
  if (document.getElementById('vanta-bg')) return;
  try {
    var cx = navigator.connection;
    if ((window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || (cx && (cx.saveData || /(^|-)2g$/.test(cx.effectiveType || ''))) ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || (navigator.deviceMemory && navigator.deviceMemory <= 2)) return;
  } catch (e) {}
  const bg = document.createElement('div');
  bg.id = 'vanta-bg';
  document.body.insertBefore(bg, document.body.firstChild);
  function cargar(src, listo) { const s = document.createElement('script'); s.src = src; s.onload = listo; document.head.appendChild(s); }
  function arrancar() {
    cargar('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js', function () {
      cargar('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js', function () {
        try {
          const movil = window.innerWidth < 768;
          VANTA.NET({ el: '#vanta-bg', THREE: window.THREE, mouseControls: true, touchControls: true, gyroControls: false,
            minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 0.6, color: 0xa5824a, backgroundColor: 0xbcdcc9,
            points: movil ? 5 : 8, maxDistance: movil ? 17 : 21, spacing: movil ? 25 : 21, showDots: true });
        } catch (e) {}
      });
    });
  }
  if (document.readyState === 'complete') setTimeout(arrancar, 400);
  else window.addEventListener('load', function () { setTimeout(arrancar, 400); });
}
