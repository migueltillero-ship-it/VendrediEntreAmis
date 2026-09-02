/* ════════════════════════════════════════════════
   PAGE-INDEX.JS — Accueil
════════════════════════════════════════════════ */
(async function () {
  const data = await ClubData.cargar();
  const semana = ClubData.porNumero(data.semanas, SEMANA_ACTUAL);
  const nombreDestino = semana.destino ? `${semana.destino}, ${semana.pais}` : semana.tema;

  document.getElementById('accueil-tema-actual').textContent = nombreDestino;
  document.getElementById('accueil-semana-num').textContent = `Semaine ${semana.semana}`;
  document.getElementById('accueil-temporada').textContent = semana.temporada_nombre;

  renderProgressBar(data.total_semanas, 'accueil-progress-bar', 'accueil-progress-label');

  const proxima = ClubData.porNumero(data.semanas, SEMANA_ACTUAL + 1);
  document.getElementById('accueil-proxima').textContent = proxima
    ? (proxima.destino ? `${proxima.destino}, ${proxima.pais}` : proxima.tema)
    : "Bilan de fin d'année 🎉";

  renderPassport(data.semanas, 'passport-grid');
})();
