/* ════════════════════════════════════════════════
   PAGE-MUR.JS — Bilan de la séance
   Affiche, sur mur.html, le récapitulatif (cultura) et les
   activités à réaliser (reto a1a2/b1b2) de la semaine en cours.
   Miguel n'a qu'à mettre à jour ces champs dans data/semaines.json
   chaque vendredi pour que ce bloc reste à jour tout seul.
════════════════════════════════════════════════ */
(async function () {
  const data = await ClubData.cargar();
  const semana = ClubData.porNumero(data.semanas, SEMANA_ACTUAL);
  if (!semana) return;

  const nombreDestino = semana.destino ? `${semana.destino}, ${semana.pais}` : semana.tema;
  document.getElementById('bilan-titre').textContent = `Semaine ${semana.semana} — ${nombreDestino}`;
  document.getElementById('bilan-resume').textContent = semana.cultura;
  document.getElementById('bilan-reto-a1a2').textContent = semana.a1a2.reto;
  document.getElementById('bilan-reto-b1b2').textContent = semana.b1b2.reto;
})();
