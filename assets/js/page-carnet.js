/* ════════════════════════════════════════════════
   PAGE-CARNET.JS — Mon Carnet de Voyage
════════════════════════════════════════════════ */
(function () {
  initCarnetSync('carnet-list');
  renderCarnet('carnet-list');
  initCarnetForm('carnet-form', 'carnet-texto', 'carnet-tipo', 'carnet-list');
})();
