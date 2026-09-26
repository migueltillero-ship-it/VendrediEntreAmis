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

  document.getElementById('topbar-mount').innerHTML = html;
  peuplerFooter(prefix, liensDecouverte, current);
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
