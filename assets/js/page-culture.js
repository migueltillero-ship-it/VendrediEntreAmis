/* ════════════════════════════════════════════════
   PAGE-CULTURE.JS — Le Coin Culture
════════════════════════════════════════════════ */
let CULTURE_DATA = null;
let cultureFiltroActuel = 'toutes';

(async function () {
  CULTURE_DATA = await ClubData.cargar();
  renderCulture();

  document.getElementById('culture-search').addEventListener('input', () => renderCulture());
  document.querySelectorAll('#culture-filtres button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#culture-filtres button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cultureFiltroActuel = btn.dataset.saison;
      renderCulture();
    });
  });
})();

function renderCulture() {
  const cont = document.getElementById('culture-list');
  const busqueda = document.getElementById('culture-search').value.toLowerCase();
  const items = ClubData.todaLaCultura(CULTURE_DATA.semanas, CULTURE_DATA.total_semanas).filter(s => {
    const passeSaison = cultureFiltroActuel === 'toutes' || String(s.temporada) === cultureFiltroActuel;
    const texteRecherche = `${s.destino || ''} ${s.pais || ''} ${s.tema} ${s.cultura}`.toLowerCase();
    const passeRecherche = !busqueda || texteRecherche.includes(busqueda);
    return passeSaison && passeRecherche;
  });

  cont.innerHTML = '';
  if (items.length === 0) {
    cont.innerHTML = '<div class="empty-state">Aucun article ne correspond à ta recherche.</div>';
    return;
  }
  items.forEach(s => {
    const div = document.createElement('div');
    div.className = 'culture-card';
    const titre = s.destino ? `${s.destino}, ${s.pais}` : s.tema;
    div.innerHTML = `
      <p class="eyebrow" style="margin-bottom:.25rem;">Semaine ${s.semana} · ${s.temporada_nombre || ''}</p>
      <h3>${titre}</h3>
      <p>${s.cultura}</p>
    `;
    cont.appendChild(div);
  });
}
