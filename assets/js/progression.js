/* ════════════════════════════════════════════════
   PROGRESSION.JS
   Miguel actualiza SEMANA_ACTUAL cada viernes (1 a 52).
   Todas las páginas del club se ajustan solas a partir
   de este único número — no hay que tocar nada más.
════════════════════════════════════════════════ */
const SEMANA_ACTUAL = 1;

function retoCompletado(semana, nivel) {
  return localStorage.getItem('reto-completado-' + semana + '-' + nivel) === '1';
}
function marcarReto(semana, nivel, completado) {
  localStorage.setItem('reto-completado-' + semana + '-' + nivel, completado ? '1' : '0');
}

function renderPassport(semanas, contenedorId) {
  const wrap = document.getElementById(contenedorId);
  if (!wrap) return;
  wrap.innerHTML = '';
  semanas.filter(s => s.temporada === 1).forEach(s => {
    const visitado = s.semana <= SEMANA_ACTUAL;
    const div = document.createElement('div');
    div.className = 'stamp' + (visitado ? ' done' : '');
    div.innerHTML = `
      <div class="flag">${visitado ? '✅' : '⏳'}</div>
      <div class="nom">${s.destino}</div>
      <div class="estado">${s.pais}</div>
    `;
    wrap.appendChild(div);
  });
}

function renderProgressBar(totalSemanas, barId, labelId) {
  const pct = Math.round((SEMANA_ACTUAL / totalSemanas) * 100);
  const bar = document.getElementById(barId);
  const label = document.getElementById(labelId);
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = `Étape ${SEMANA_ACTUAL} sur ${totalSemanas} — ${pct}% du parcours`;
}
