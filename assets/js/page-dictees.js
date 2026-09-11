/* ════════════════════════════════════════════════
   PAGE-DICTEES.JS — La dictée du vendredi
   Un texte différent chaque semaine (par niveau), lu à voix
   haute via la synthèse vocale du navigateur (audio.js).
   L'apprenant·e écrit ce qu'il/elle entend, puis compare avec
   le corrigé affiché à la demande — la dictée classique, en
   autocorrection.
════════════════════════════════════════════════ */
const DICTEES = {
  a1a2: [
    "Le vendredi, nous nous retrouvons pour parler français. Chaque semaine, nous visitons une nouvelle ville. Aujourd'hui, direction Paris !",
    "Marie aime le café le matin. Elle va souvent à la terrasse avec ses amis. Ils parlent et ils rient ensemble.",
    "À Lyon, on mange très bien. Le marché est ouvert tous les jours. Les gens aiment goûter de nouveaux plats.",
    "Le week-end, je me repose. Je lis un livre ou je regarde un film. Parfois, j'écoute de la musique française.",
    "Notre club s'appelle Vendredi entre amis. Nous sommes des amis qui apprennent le français ensemble, sans stress.",
  ],
  b1b2: [
    "Chaque vendredi, notre petit groupe se réunit pour explorer, à travers la conversation, une nouvelle facette de la francophonie. Ce n'est pas un cours comme les autres : c'est un espace où l'on apprend en se racontant.",
    "Bien que le français puisse sembler intimidant au début, il devient, semaine après semaine, un terrain de jeu où l'on ose enfin s'exprimer sans avoir peur de se tromper.",
    "À Lyon, la gastronomie occupe une place centrale dans la vie quotidienne ; les bouchons lyonnais, avec leur ambiance conviviale, témoignent d'un art de vivre que l'on retrouve à chaque coin de rue.",
    "Le télétravail a profondément transformé notre rapport au temps et à l'espace, si bien que certains se demandent s'il est encore possible de séparer clairement la vie professionnelle de la vie personnelle.",
    "Ce qui rend notre club unique, c'est qu'il n'appartient à aucune institution : il a été pensé comme un cercle indépendant, animé par la passion d'un professeur qui croit à l'apprentissage entre pairs.",
  ],
};

function texteDeLaSemaine(niveau) {
  const liste = DICTEES[niveau];
  return liste[(SEMANA_ACTUAL - 1) % liste.length];
}

function initDictee(niveau) {
  const texte = texteDeLaSemaine(niveau);
  const zoneCorrige = document.getElementById('dictee-corrige-' + niveau);
  zoneCorrige.textContent = texte;

  document.getElementById('dictee-ecouter-' + niveau).addEventListener('click', () => decirFrances(texte));
  document.getElementById('dictee-lent-' + niveau).addEventListener('click', () => {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(texte);
    u.lang = 'fr-FR';
    u.rate = 0.65;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  });
  document.getElementById('dictee-corriger-' + niveau).addEventListener('click', () => {
    zoneCorrige.parentElement.classList.add('visible');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDictee('a1a2');
  initDictee('b1b2');
});
