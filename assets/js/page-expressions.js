/* ════════════════════════════════════════════════
   PAGE-EXPRESSIONS.JS — La Boîte à Expressions
════════════════════════════════════════════════ */
let EXPR_DATA = null;

(async function () {
  EXPR_DATA = await ClubData.cargar();
  renderExpresiones();

  document.getElementById('expr-search').addEventListener('input', e => {
    const nivel = document.querySelector('.pill-filters button.active').dataset.nivel;
    renderExpresiones(nivel, e.target.value);
  });
  document.querySelectorAll('.pill-filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill-filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderExpresiones(btn.dataset.nivel, document.getElementById('expr-search').value);
    });
  });
})();

function renderExpresiones(filtroNivel = 'todos', busqueda = '') {
  const cont = document.getElementById('expr-list');
  const datos = ClubData.todasLasExpresiones(EXPR_DATA.semanas, SEMANA_ACTUAL).filter(e => {
    const pasaNivel = filtroNivel === 'todos' || e.nivel === filtroNivel;
    const q = busqueda.toLowerCase();
    const pasaBusqueda = !busqueda || e.fr.toLowerCase().includes(q) || e.es.toLowerCase().includes(q);
    return pasaNivel && pasaBusqueda;
  });

  cont.innerHTML = '';
  if (datos.length === 0) {
    cont.innerHTML = '<div class="empty-state">Aucune expression ne correspond à ta recherche.</div>';
    return;
  }
  datos.slice().reverse().forEach(e => {
    const div = document.createElement('div');
    div.className = 'entry';
    const wrap = document.createElement('div');
    wrap.innerHTML = `<div class="vocab-fr">${e.fr}</div><div class="vocab-es">${e.es} · Semaine ${e.semana} · ${e.nivel.toUpperCase()}</div>`;
    div.appendChild(wrap);
    div.appendChild(botonEscuchar(e.fr));
    cont.appendChild(div);
  });
}
