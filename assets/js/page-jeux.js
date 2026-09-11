/* ════════════════════════════════════════════════
   PAGE-JEUX.JS — Quiz de vocabulaire
   Pioche dans tout le vocabulaire déjà vu (semaines 1 à
   SEMANA_ACTUAL) pour composer des questions à choix multiple.
════════════════════════════════════════════════ */
let JEUX_DATA = null;
let niveauActif = 'todos';
let score = 0;
let total = 0;
let motActuel = null;

function melanger(tableau) {
  const copie = tableau.slice();
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

function vocabulairePool(niveau) {
  const niveaux = niveau === 'todos' ? ['a1a2', 'b1b2'] : [niveau];
  const pool = [];
  JEUX_DATA.semanas.filter(s => s.semana <= SEMANA_ACTUAL).forEach(s => {
    niveaux.forEach(n => s[n].vocabulario.forEach(v => pool.push(v)));
  });
  return pool;
}

function nouvelleQuestion() {
  const pool = vocabulairePool(niveauActif);
  const feedback = document.getElementById('quiz-feedback');
  feedback.textContent = '';
  if (pool.length < 4) {
    document.getElementById('quiz-mot-fr').textContent = '—';
    document.getElementById('quiz-options').innerHTML = '';
    feedback.textContent = "Pas encore assez de vocabulaire à ce niveau — reviens après quelques semaines !";
    return;
  }
  motActuel = pool[Math.floor(Math.random() * pool.length)];
  const distracteurs = melanger(pool.filter(v => v.es !== motActuel.es)).slice(0, 3);
  const options = melanger([motActuel, ...distracteurs]);

  document.getElementById('quiz-mot-fr').textContent = motActuel.fr;
  const cont = document.getElementById('quiz-options');
  cont.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt.es;
    btn.addEventListener('click', () => repondre(opt, btn));
    cont.appendChild(btn);
  });
}

function repondre(opt, btnClique) {
  const boutons = document.querySelectorAll('#quiz-options button');
  boutons.forEach(b => b.disabled = true);
  total++;
  const feedback = document.getElementById('quiz-feedback');
  if (opt.es === motActuel.es) {
    score++;
    btnClique.classList.add('correcte');
    feedback.textContent = '✔ Exact !';
  } else {
    btnClique.classList.add('incorrecte');
    boutons.forEach(b => { if (b.textContent === motActuel.es) b.classList.add('correcte'); });
    feedback.textContent = `✘ La bonne réponse était : ${motActuel.es}`;
  }
  document.getElementById('quiz-score').textContent = score;
  document.getElementById('quiz-total').textContent = total;
  setTimeout(nouvelleQuestion, 1400);
}

(async function () {
  JEUX_DATA = await ClubData.cargar();
  nouvelleQuestion();

  document.querySelectorAll('#quiz-filtros button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#quiz-filtros button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      niveauActif = btn.dataset.nivel;
      score = 0; total = 0;
      document.getElementById('quiz-score').textContent = 0;
      document.getElementById('quiz-total').textContent = 0;
      nouvelleQuestion();
    });
  });
})();
