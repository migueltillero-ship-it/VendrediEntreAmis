/* ════════════════════════════════════════════════
   ACTIVITÉ BESPOKE — Semaine 5 (23 octobre) : quiz culture/art
   et activité d'expression « Si j'avais un rêve à accomplir... »
   Déplacée dans la carte du journal par assets/js/page-mur.js.
════════════════════════════════════════════════ */
const QUIZ_ART = [
  { oeuvre: 'La Joconde', peintre: 'Léonard de Vinci' },
  { oeuvre: 'La Liberté guidant le peuple', peintre: 'Eugène Delacroix' },
  { oeuvre: 'Impression, soleil levant', peintre: 'Claude Monet' },
  { oeuvre: 'Les Nymphéas', peintre: 'Claude Monet' },
  { oeuvre: 'Le Déjeuner sur l\'herbe', peintre: 'Édouard Manet' },
  { oeuvre: 'Olympia', peintre: 'Édouard Manet' },
  { oeuvre: 'La Nuit étoilée', peintre: 'Vincent van Gogh' },
  { oeuvre: 'La Chambre à Arles', peintre: 'Vincent van Gogh' },
  { oeuvre: 'Le Cri', peintre: 'Edvard Munch' },
  { oeuvre: 'Guernica', peintre: 'Pablo Picasso' },
  { oeuvre: 'Les Demoiselles d\'Avignon', peintre: 'Pablo Picasso' },
  { oeuvre: 'Le Déjeuner des canotiers', peintre: 'Auguste Renoir' },
];

function melangerArt(tableau) {
  const copie = tableau.slice();
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

function optionsPourQuestion(indexCorrect) {
  const autres = QUIZ_ART.filter((_, i) => i !== indexCorrect).map(q => q.peintre);
  const distracteurs = melangerArt(autres).slice(0, 3);
  return melangerArt([QUIZ_ART[indexCorrect].peintre, ...distracteurs]);
}

function initQuizArt(idContenedor) {
  const cont = document.getElementById(idContenedor);
  if (!cont) return;

  let indexActuel = 0;
  let score = 0;

  function afficherQuestion() {
    if (indexActuel >= QUIZ_ART.length) {
      cont.innerHTML = `
        <div style="text-align:center; padding:1.5rem; background:rgba(255,255,255,0.05); border-radius:10px;">
          <p style="font-size:1.3rem; color:var(--gold-claro); margin:0 0 0.5rem;">Quiz terminé !</p>
          <p style="font-size:1.1rem; color:#fff; margin:0;">Votre score : <strong>${score} / ${QUIZ_ART.length}</strong></p>
        </div>`;
      return;
    }
    const question = QUIZ_ART[indexActuel];
    const options = optionsPourQuestion(indexActuel);
    cont.innerHTML = `
      <div style="background:rgba(255,255,255,0.05); border-radius:10px; padding:1.5rem;">
        <p style="font-size:0.95rem; color:rgba(255,255,255,0.7); margin:0 0 0.5rem;">Question ${indexActuel + 1} sur ${QUIZ_ART.length}</p>
        <p style="font-size:1.25rem; color:#fff; margin:0 0 1.2rem;">Qui a peint « <strong>${question.oeuvre}</strong> » ?</p>
        <div id="art-options" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.8rem;"></div>
        <p id="art-feedback" style="margin-top:1rem; font-size:1.1rem; min-height:1.5em;"></p>
      </div>`;

    const optionsWrap = cont.querySelector('#art-options');
    const feedback = cont.querySelector('#art-feedback');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = opt;
      btn.style.cssText = 'font-size:1.1rem; padding:1rem 1.2rem; border-radius:10px; border:2px solid var(--gold-claro); background:rgba(255,255,255,0.08); color:#fff; cursor:pointer; min-height:3.2rem;';
      btn.addEventListener('click', () => {
        optionsWrap.querySelectorAll('button').forEach(b => b.disabled = true);
        const bonneReponse = opt === question.peintre;
        if (bonneReponse) {
          score++;
          btn.style.background = 'rgba(80,180,100,0.35)';
          feedback.textContent = '✔ Exact !';
          feedback.style.color = '#8fe3a0';
        } else {
          btn.style.background = 'rgba(200,80,80,0.35)';
          feedback.textContent = `✘ C'était « ${question.peintre} ».`;
          feedback.style.color = '#f3a0a0';
        }
        setTimeout(() => { indexActuel++; afficherQuestion(); }, 1200);
      });
      optionsWrap.appendChild(btn);
    });
  }

  afficherQuestion();
}

function initEspaceEmotionnel() {
  const textarea = document.getElementById('reve-texte');
  const boton = document.getElementById('reve-enregistrer');
  const statut = document.getElementById('reve-statut');
  if (!textarea || !boton) return;

  boton.addEventListener('click', () => {
    const texte = textarea.value.trim();
    if (!texte) {
      statut.textContent = 'Écrivez votre réponse avant de l\'enregistrer.';
      return;
    }
    boton.disabled = true;
    agregarEntrada(texte, 'Réflexion').then(res => {
      boton.disabled = false;
      if (res.ok) {
        statut.textContent = '✨ Enregistré dans votre Carnet de Voyage !';
        textarea.value = '';
      } else {
        statut.textContent = 'Impossible d\'enregistrer pour le moment — réessayez.';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initQuizArt('art-quiz');
  initEspaceEmotionnel();
});
