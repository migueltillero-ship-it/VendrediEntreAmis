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
  const todos = ClubData.todosLosDefis(DEFIS_DATA.semanas, SEMANA_ACTUAL);
  const datos = todos
    .filter(d => defisFiltroActual === 'todos' || d.nivel === defisFiltroActual)
    .slice()
    .reverse();

  cont.innerHTML = '';
  if (datos.length === 0) {
    cont.innerHTML = '<div class="empty-state">Les défis des semaines précédentes apparaîtront ici au fil de l\'année.</div>';
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
