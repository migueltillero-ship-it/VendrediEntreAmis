/* ════════════════════════════════════════════════
   NAV.JS — topbar compartida
   Cada página define ANTES de incluir este script:
     window.PAGE_PREFIX = ""      (en index.html, raíz)
     window.PAGE_PREFIX = "../"   (en pages/*.html)
     window.CURRENT_PAGE = "cafe" (id de pestaña activa)
════════════════════════════════════════════════ */
(function () {
  const prefix = window.PAGE_PREFIX ?? '';
  const current = window.CURRENT_PAGE ?? '';

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
    { href: prefix + 'pourquoi.html', label: 'Le Concept' },
    { href: prefix + 'animateur.html', label: "L'Animateur" },
    { href: prefix + 'niveles.html', label: 'Parcours CECR' },
    { href: prefix + 'recursos.html', label: 'Centre de Ressources' },
    { href: prefix + 'calendario.html', label: 'Calendrier' },
    { href: prefix + 'ideas.html', label: 'Contact & FAQ' },
  ];

  const tabsHtml = links.map(l =>
    `<a href="${l.href}"${l.id === current ? ' class="active" aria-current="page"' : ''}>${l.label}</a>`
  ).join('');

  const html = `
    <div class="topbar-inner">
      <a class="brand" href="${prefix}index.html">Vendredi <span>entre Amis</span></a>
      <nav id="tabs" aria-label="Sections du club">${tabsHtml}</nav>
    </div>`;

  document.getElementById('topbar-mount').innerHTML = html;
  peuplerFooter(prefix, liensDecouverte);
})();

function peuplerFooter(prefix, liensDecouverte) {
  const footer = document.getElementById('club-footer');
  if (!footer) return;
  const copyright = footer.textContent.trim();
  const liensHtml = liensDecouverte.map(l => `<a href="${l.href}">${l.label}</a>`).join('');
  footer.innerHTML = `
    <nav class="footer-decouverte" aria-label="Découvrir l'écosystème">${liensHtml}</nav>
    <p class="footer-copy">${copyright} · <a href="https://migueltillero-ship-it.github.io/MiguelTillero/" target="_blank" rel="noopener">Site principal de Miguel Tillero</a></p>
  `;
}
