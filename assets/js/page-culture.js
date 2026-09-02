/* ════════════════════════════════════════════════
   PAGE-CULTURE.JS — Le Coin Culture
════════════════════════════════════════════════ */
(async function () {
  const data = await ClubData.cargar();
  const cont = document.getElementById('culture-list');
  const items = ClubData.todaLaCultura(data.semanas, SEMANA_ACTUAL);

  cont.innerHTML = '';
  if (items.length === 0) {
    cont.innerHTML = '<div class="empty-state">Le Coin Culture se remplit à partir de la semaine 1.</div>';
    return;
  }
  items.slice().reverse().forEach(s => {
    const div = document.createElement('div');
    div.className = 'culture-card';
    div.innerHTML = `<h3>${s.destino}, ${s.pais}</h3><p>${s.cultura}</p>`;
    cont.appendChild(div);
  });
})();
