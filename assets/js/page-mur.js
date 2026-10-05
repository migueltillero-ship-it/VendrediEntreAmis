/* ════════════════════════════════════════════════
   PAGE-MUR.JS — Chaque vendredi
   Rend un journal (une carte par semaine déjà vécue, la plus récente
   en premier) à partir de data/semaines.json : date, destination,
   résumé (cultura) et activités à réaliser (a1a2.reto / b1b2.reto).
   Miguel n'a qu'à renseigner ces champs chaque vendredi pour que ce
   journal reste à jour tout seul.

   Quand une semaine porte un flag d'activité bespoke (ex.
   "activite_paris_monuments": true), le widget correspondant —
   défini statiquement dans mur.html et cablé par un script à part
   (ex. assets/js/activite-paris.js) — est déplacé dans sa carte.
════════════════════════════════════════════════ */
(async function () {
  const data = await ClubData.cargar();
  const semanas = data.semanas
    .filter(s => s.semana <= SEMANA_ACTUAL)
    .slice()
    .sort((a, b) => b.semana - a.semana);

  const cont = document.getElementById('journal-semaines');
  if (!cont || semanas.length === 0) return;

  cont.innerHTML = semanas.map(s => {
    const nombreDestino = s.destino ? `${s.destino}, ${s.pais}` : s.tema;
    const fechaTexto = s.fecha ? formatFecha(s.fecha) : `Semaine ${s.semana}`;
    return `
      <div class="tarjeta-valor" style="text-align:left;">
        <span style="font-family:'Syne'; font-size:0.7rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--gold-claro);">${fechaTexto} · Semaine ${s.semana}</span>
        <h3 style="margin:0.4rem 0 0.8rem; font-size:1.4rem;">${nombreDestino}</h3>
        <p style="margin-bottom:1.2rem; font-size:1.02rem;">${s.cultura || ''}</p>
        <p style="margin:0 0 0.5rem; font-weight:700; color:var(--gold-claro);">Activités à réaliser avant le prochain vendredi</p>
        <ul style="padding-left:1.2rem; margin:0; display:flex; flex-direction:column; gap:0.5rem;">
          <li><strong>A1-A2 :</strong> ${s.a1a2.reto}</li>
          <li><strong>B1-B2 :</strong> ${s.b1b2.reto}</li>
        </ul>
        <div data-activite-slot="${s.semana}"></div>
      </div>
    `;
  }).join('');

  semanas.filter(s => s.activite_paris_monuments).forEach(s => {
    const slot = cont.querySelector(`[data-activite-slot="${s.semana}"]`);
    const widget = document.getElementById('activite-paris');
    if (slot && widget) {
      widget.style.display = 'block';
      widget.style.marginTop = '1.5rem';
      widget.style.paddingTop = '1.5rem';
      widget.style.borderTop = '1px dashed var(--line)';
      slot.appendChild(widget);
    }
  });
})();

function formatFecha(iso) {
  const [an, mois, jour] = iso.split('-').map(Number);
  const d = new Date(Date.UTC(an, mois - 1, jour));
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
}
