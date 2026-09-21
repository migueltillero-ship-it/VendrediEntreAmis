/* ════════════════════════════════════════════════
   PAGE-AMIS.JS — Entre Amis
   Une question par semaine, en écho au thème du Café du
   Vendredi de cette semaine-là (voir data/semaines.json).
   Si une semaine venait à manquer, une question générique
   est utilisée à la place.
════════════════════════════════════════════════ */
const PREGUNTAS_ENTRE_AMIS = {
  1: "Quel est votre café ou restaurant préféré, et pourquoi ?",
  2: "Quel plat représente le mieux votre ville ou région ?",
  3: "Quelle couleur associez-vous à votre ville, et pourquoi ?",
  4: "Quelle est une expression drôle ou typique de votre région ?",
  5: "Êtes-vous plutôt ponctuel·le ou toujours en retard ? Racontez une anecdote.",
  6: "Que représente pour vous le mot « chez-soi » ?",
  7: "Quel lieu historique de votre pays recommanderiez-vous de visiter ?",
  8: "Quelle est une tradition d'hospitalité de votre pays ?",
  9: "Existe-t-il un mot d'argot, dans votre langue, que vous adorez utiliser ?",
  10: "Quelles cultures se mélangent dans votre ville ou votre famille ?",
  11: "Comment votre pays équilibre-t-il tradition et modernité ?",
  12: "Connaissez-vous une culture née du mélange de plusieurs langues, comme le cadien ?",
  13: "Parlez-vous, ou connaissez-vous, plus d'une langue à la maison ?",
  14: "Si vous deviez vivre sur une île, laquelle choisiriez-vous, et pourquoi ?",
  15: "Vous sentez-vous parfois « entre deux mondes » ? Expliquez.",
  16: "Quel plat du Moyen-Orient aimeriez-vous goûter (ou avez-vous déjà goûté) ?",
  17: "Quelle est votre relation avec la mer Méditerranée, ou avec la mer en général ?",
  18: "Quelle est la ville la plus animée que vous ayez visitée ?",
  19: "Qui, dans votre famille, vous a le plus influencé·e ?",
  20: "Quel est votre souvenir d'enfance le plus heureux ?",
  21: "Si vous pouviez changer de métier demain, que feriez-vous ?",
  22: "Quel voyage vous a le plus marqué·e, et pourquoi ?",
  23: "Qu'est-ce qui fait, pour vous, un·e véritable ami·e ?",
  24: "Quelle est votre passion, celle que vous pourriez pratiquer des heures sans voir le temps passer ?",
  25: "Quel est un rêve que vous espérez réaliser un jour ?",
  26: "Quelle tradition familiale espérez-vous transmettre ?",
  27: "Le temps passe-t-il plus vite en vieillissant, selon vous ?",
  28: "Quel a été le changement le plus important de votre vie ?",
  29: "Quel objet emporteriez-vous si vous deviez quitter votre maison en urgence ?",
  30: "Quel livre vous a le plus marqué·e ?",
  31: "Quel est votre film préféré, et pourquoi vous touche-t-il autant ?",
  32: "Quelle chanson évoque un souvenir précis pour vous ?",
  33: "Quelle recette de famille aimeriez-vous transmettre ?",
  34: "Quel est le lieu où vous vous sentez le plus vous-même ?",
  35: "Pour quoi êtes-vous le/la plus reconnaissant·e en ce moment ?",
  36: "La technologie nous rapproche-t-elle vraiment les uns des autres ?",
  37: "Quel geste faites-vous, au quotidien, pour l'environnement ?",
  38: "Quel enseignant·e ou quelle expérience a le plus marqué votre parcours ?",
  39: "Quel plat français rêvez-vous encore de goûter ?",
  40: "Connaissez-vous un film francophone que vous recommanderiez ?",
  41: "Votre style vestimentaire a-t-il changé avec le temps ? Comment ?",
  42: "Comment vous informez-vous au quotidien ?",
  43: "Quelle habitude vous fait le plus de bien ?",
  44: "Comment trouvez-vous l'équilibre entre travail et vie personnelle ?",
  45: "Quelle est votre fête préférée, et pourquoi ?",
  46: "Quelle œuvre d'art vous a marqué·e ?",
  47: "Y a-t-il un auteur francophone que vous aimeriez découvrir ?",
  48: "Quel rôle le sport joue-t-il dans votre vie ?",
  49: "Quelle invention a le plus changé votre quotidien ?",
  50: "Qu'est-ce que la Francophonie représente pour vous ?",
  51: "Riez-vous facilement ? Qu'est-ce qui vous fait rire ?",
  52: "Quel est le plus grand progrès que vous avez fait cette année, en français ou ailleurs ?",
};

(function () {
  const pregunta = PREGUNTAS_ENTRE_AMIS[SEMANA_ACTUAL] || "Quel est un souvenir que vous aimez raconter ?";
  document.getElementById('entre-amis-pregunta').textContent = pregunta;

  const key = 'entre-amis-reponse-' + SEMANA_ACTUAL;
  const textarea = document.getElementById('entre-amis-texto');
  textarea.value = localStorage.getItem(key) || '';
  textarea.addEventListener('input', () => localStorage.setItem(key, textarea.value));

  document.getElementById('entre-amis-whatsapp').addEventListener('click', () => {
    const texto = encodeURIComponent(`${pregunta}\n\n${textarea.value}`);
    window.open(`https://wa.me/?text=${texto}`, '_blank');
  });
})();
