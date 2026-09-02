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

  document.getElementById('topbar-mount').innerHTML = html;
  initA11y();
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
