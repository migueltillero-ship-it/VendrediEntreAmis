/* ════════════════════════════════════════════════
   PAGE-CAFE.JS — Le Café du Vendredi
════════════════════════════════════════════════ */
let CAFE_DATA = null;

(async function () {
  CAFE_DATA = await ClubData.cargar();
  poblarSelectorSemanas();
  renderCafe(SEMANA_ACTUAL);
  activarLevelTabs();
})();

function poblarSelectorSemanas() {
  const select = document.getElementById('week-select');
  select.innerHTML = '';
  CAFE_DATA.semanas.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.semana;
    const label = s.destino ? `${s.destino} — ${s.tema}` : s.tema;
    opt.textContent = `Semaine ${s.semana} · ${label}`;
    if (s.semana === SEMANA_ACTUAL) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', e => renderCafe(parseInt(e.target.value, 10)));
}

function renderCafe(numSemana) {
  const semana = ClubData.porNumero(CAFE_DATA.semanas, numSemana);
  if (!semana) return;

  document.getElementById('cafe-destino').textContent = semana.destino || semana.temporada_nombre;
  document.getElementById('cafe-pais').textContent = semana.pais || semana.tema_desc || '';
  document.getElementById('cafe-tema').textContent = semana.tema;

  renderVocab('a1a2', semana);
  renderVocab('b1b2', semana);

  document.getElementById('expr-a1a2-fr').textContent = semana.a1a2.expresion.fr;
  document.getElementById('expr-a1a2-es').textContent = semana.a1a2.expresion.es;
  document.getElementById('expr-b1b2-fr').textContent = semana.b1b2.expresion.fr;
  document.getElementById('expr-b1b2-es').textContent = semana.b1b2.expresion.es;

  const culturaWrap = document.getElementById('cultura-wrap');
  if (semana.cultura) {
    culturaWrap.style.display = '';
    document.getElementById('cultura-texto').textContent = semana.cultura;
  } else {
    culturaWrap.style.display = 'none';
  }
}

function renderVocab(nivel, semana) {
  const ul = document.getElementById('vocab-' + nivel);
  ul.innerHTML = '';
  semana[nivel].vocabulario.forEach(item => {
    const li = document.createElement('li');
    const div = document.createElement('div');
    div.innerHTML = `<div class="vocab-fr">${item.fr}</div><div class="vocab-es">${item.es}</div>`;
    li.appendChild(div);
    li.appendChild(botonEscuchar(item.fr));
    ul.appendChild(li);
  });
}

function activarLevelTabs() {
  document.querySelectorAll('.level-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.level-tabs button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.level-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('panel-' + btn.dataset.level).classList.add('active');
    });
  });
}
