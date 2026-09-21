/* ════════════════════════════════════════════════
   PAGE-DEFIS.JS — Le Défi de la Semaine
════════════════════════════════════════════════ */
let DEFIS_DATA = null;
let defisFiltroActual = 'todos';

(async function () {
  DEFIS_DATA = await ClubData.cargar();
  renderRetoActual();
  renderHistorialDefis();
  activarFiltrosDefis();
  document.getElementById('defis-search').addEventListener('input', renderHistorialDefis);
})();

function renderRetoActual() {
  const semana = ClubData.porNumero(DEFIS_DATA.semanas, SEMANA_ACTUAL);
  if (!semana) return;

  document.getElementById('reto-a1a2-texto').textContent = semana.a1a2.reto;
  document.getElementById('reto-b1b2-texto').textContent = semana.b1b2.reto;

  ['a1a2', 'b1b2'].forEach(nivel => {
    const check = document.getElementById('reto-check-' + nivel);
    check.checked = retoCompletado(SEMANA_ACTUAL, nivel);
    check.onchange = () => marcarReto(SEMANA_ACTUAL, nivel, check.checked);
  });
}

function activarFiltrosDefis() {
  document.querySelectorAll('#defis-filtros button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#defis-filtros button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      defisFiltroActual = btn.dataset.nivel;
      renderHistorialDefis();
    });
  });
}

function renderHistorialDefis() {
  const cont = document.getElementById('defis-list');
  const busqueda = document.getElementById('defis-search').value.toLowerCase();
  const todos = ClubData.todosLosDefis(DEFIS_DATA.semanas, DEFIS_DATA.total_semanas);
  const datos = todos
    .filter(d => defisFiltroActual === 'todos' || d.nivel === defisFiltroActual)
    .filter(d => !busqueda || `${d.texto} ${d.tema}`.toLowerCase().includes(busqueda))
    .slice()
    .reverse();

  cont.innerHTML = '';
  if (datos.length === 0) {
    cont.innerHTML = '<div class="empty-state">Aucun défi ne correspond à ta recherche.</div>';
    return;
  }
  datos.forEach(d => {
    const div = document.createElement('div');
    div.className = 'entry';
    const check = retoCompletado(d.semana, d.nivel);
    div.innerHTML = `
      <div>
        <div class="vocab-fr">${d.texto}</div>
        <div class="vocab-es">${d.tema} · Semaine ${d.semana} · ${d.nivel.toUpperCase()}</div>
      </div>
      <label style="display:flex;align-items:center;gap:.4rem;cursor:pointer;">
        <input type="checkbox" ${check ? 'checked' : ''}>
      </label>
    `;
    div.querySelector('input[type="checkbox"]').addEventListener('change', e => {
      marcarReto(d.semana, d.nivel, e.target.checked);
    });
    cont.appendChild(div);
  });
}
