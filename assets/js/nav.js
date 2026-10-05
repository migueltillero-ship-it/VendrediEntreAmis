/* ════════════════════════════════════════════════
   NAV.JS — topbar compartida + Coin Sérénité (accesibilidad)
   Cada página define ANTES de incluir este script:
     window.PAGE_PREFIX = ""      (en index.html, raíz)
     window.PAGE_PREFIX = "../"   (en pages/*.html)
     window.CURRENT_PAGE = "cafe" (id de pestaña activa)

   Nota: "Le Coin Sérénité" no es una página aparte — vive
   en los botones A / A+ / A++ / ◐ del encabezado, visibles
   en todas las páginas. Por eso no aparece en esta lista.
════════════════════════════════════════════════ */
(function () {
  const prefix = window.PAGE_PREFIX ?? '';
  const current = window.CURRENT_PAGE ?? '';

  const links = [
    { id: 'accueil', href: prefix + 'index.html', label: 'Accueil' },
    { id: 'cafe', href: prefix + 'pages/cafe.html', label: 'Le Café du Vendredi' },
    { id: 'defis', href: prefix + 'pages/defis.html', label: 'Le Défi de la Semaine' },
    { id: 'carnet', href: prefix + 'pages/carnet.html', label: 'Mon Carnet' },
    { id: 'expressions', href: prefix + 'pages/expressions.html', label: 'La Boîte à Expressions' },
    { id: 'culture', href: prefix + 'pages/culture.html', label: 'Le Coin Culture' },
    { id: 'amis', href: prefix + 'pages/amis.html', label: 'Entre Amis' },
  ];

  const tabsHtml = links.map(l =>
    `<a href="${l.href}"${l.id === current ? ' class="active" aria-current="page"' : ''}>${l.label}</a>`
  ).join('');

  const html = `
    <div class="topbar-inner">
      <a class="brand" href="${prefix}index.html">Vendredi <span>entre Amis</span></a>
      <nav id="tabs" aria-label="Sections du club">${tabsHtml}</nav>
      <div class="a11y-controls" role="group" aria-label="Confort de lecture — Coin Sérénité">
        <button id="btn-a-normal" aria-pressed="true" title="Taille normale">A</button>
        <button id="btn-a-plus" aria-pressed="false" title="Texte agrandi">A+</button>
        <button id="btn-a-plusplus" aria-pressed="false" title="Texte très agrandi">A++</button>
        <button id="btn-contraste" aria-pressed="false" title="Contraste élevé">◐</button>
      </div>
    </div>`;

  barraDelSitio();
  document.getElementById('topbar-mount').innerHTML = html;
  initA11y();
  fondoDelSitio();
})();

function initA11y() {
  const html = document.documentElement;
  const guardado = JSON.parse(localStorage.getItem('a11y-prefs') || '{}');
  if (guardado.tamano) html.classList.add(guardado.tamano);
  if (guardado.contraste) html.classList.add('contraste');
  actualizarBotonesA11y();

  document.getElementById('btn-a-normal').addEventListener('click', () => setTamano(null));
  document.getElementById('btn-a-plus').addEventListener('click', () => setTamano('confort'));
  document.getElementById('btn-a-plusplus').addEventListener('click', () => setTamano('confort-plus'));
  document.getElementById('btn-contraste').addEventListener('click', () => {
    html.classList.toggle('contraste');
    guardarPrefsA11y();
    actualizarBotonesA11y();
  });
}
function setTamano(clase) {
  const html = document.documentElement;
  html.classList.remove('confort', 'confort-plus');
  if (clase) html.classList.add(clase);
  guardarPrefsA11y();
  actualizarBotonesA11y();
}
function guardarPrefsA11y() {
  const html = document.documentElement;
  const tamano = html.classList.contains('confort-plus') ? 'confort-plus' : (html.classList.contains('confort') ? 'confort' : null);
  localStorage.setItem('a11y-prefs', JSON.stringify({ tamano, contraste: html.classList.contains('contraste') }));
}
function actualizarBotonesA11y() {
  const html = document.documentElement;
  document.getElementById('btn-a-normal').setAttribute('aria-pressed', String(!html.classList.contains('confort') && !html.classList.contains('confort-plus')));
  document.getElementById('btn-a-plus').setAttribute('aria-pressed', String(html.classList.contains('confort')));
  document.getElementById('btn-a-plusplus').setAttribute('aria-pressed', String(html.classList.contains('confort-plus')));
  document.getElementById('btn-contraste').setAttribute('aria-pressed', String(html.classList.contains('contraste')));
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
