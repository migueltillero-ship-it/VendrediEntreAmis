/* ════════════════════════════════════════════════
   PAGE-DICTEES.JS — La dictée du vendredi
   Une bibliothèque de textes par niveau (A1–A2, B1–B2,
   C1–C2), lus à voix haute via la synthèse vocale du
   navigateur (audio.js, voix française forcée). On choisit
   un texte dans la liste ou au hasard, on écrit ce qu'on
   entend, puis on compare avec le corrigé — mot à mot.
════════════════════════════════════════════════ */
const DICTEES = {
  a1a2: [
    { titre: 'Paris — Le club', texte: "Le vendredi, nous nous retrouvons pour parler français. Chaque semaine, nous visitons une nouvelle ville. Aujourd'hui, direction Paris !" },
    { titre: 'Paris — Le café', texte: "Marie aime le café le matin. Elle va souvent à la terrasse avec ses amis. Ils parlent et ils rient ensemble." },
    { titre: 'Lyon — Le marché', texte: "À Lyon, on mange très bien. Le marché est ouvert tous les jours. Les gens aiment goûter de nouveaux plats." },
    { titre: 'Le week-end', texte: "Le week-end, je me repose. Je lis un livre ou je regarde un film. Parfois, j'écoute de la musique française." },
    { titre: 'Notre club', texte: "Notre club s'appelle Vendredi entre amis. Nous sommes des amis qui apprennent le français ensemble, sans stress." },
    { titre: 'Provence — Le marché', texte: "En Provence, il y a des marchés très colorés. On y trouve des fleurs, des fruits et des épices. Le ciel est bleu presque toute l'année." },
    { titre: 'Bruxelles — L\'humour', texte: "À Bruxelles, les gens aiment les frites et le chocolat. Il y a aussi de belles bandes dessinées. On rit souvent, avec beaucoup d'humour." },
    { titre: 'Montréal — L\'hiver', texte: "À Montréal, il fait très froid en hiver. Les gens parlent français avec un accent différent. Ils disent souvent : « Bonjour, salut ! »" },
    { titre: 'Dakar — L\'accueil', texte: "À Dakar, le soleil brille toute l'année. Les gens sont très accueillants. On boit du thé à la menthe entre amis." },
    { titre: 'Genève — La ponctualité', texte: "Genève est une ville calme, près d'un grand lac. Les Suisses aiment la ponctualité. Le train part toujours à l'heure." },
  ],
  b1b2: [
    { titre: 'Paris — Notre rendez-vous', texte: "Chaque vendredi, notre petit groupe se réunit pour explorer, à travers la conversation, une nouvelle facette de la francophonie. Ce n'est pas un cours comme les autres : c'est un espace où l'on apprend en se racontant." },
    { titre: 'Oser parler', texte: "Bien que le français puisse sembler intimidant au début, il devient, semaine après semaine, un terrain de jeu où l'on ose enfin s'exprimer sans avoir peur de se tromper." },
    { titre: 'Lyon — Les bouchons', texte: "À Lyon, la gastronomie occupe une place centrale dans la vie quotidienne ; les bouchons lyonnais, avec leur ambiance conviviale, témoignent d'un art de vivre que l'on retrouve à chaque coin de rue." },
    { titre: 'Le télétravail', texte: "Le télétravail a profondément transformé notre rapport au temps et à l'espace, si bien que certains se demandent s'il est encore possible de séparer clairement la vie professionnelle de la vie personnelle." },
    { titre: 'Un cercle indépendant', texte: "Ce qui rend notre club unique, c'est qu'il n'appartient à aucune institution : il a été pensé comme un cercle indépendant, animé par la passion d'un professeur qui croit à l'apprentissage entre pairs." },
    { titre: 'Bruxelles — Le surréalisme', texte: "Bien que Bruxelles soit souvent éclipsée par Paris, cette ville surréaliste, entre Magritte et bande dessinée, cultive un humour pince-sans-rire qui désarçonne les visiteurs les moins attentifs." },
    { titre: 'Montréal — L\'accent québécois', texte: "Le français québécois, avec ses expressions colorées et son accent chantant, témoigne d'une histoire linguistique singulière, façonnée par des siècles d'isolement relatif du reste de la francophonie." },
    { titre: 'Dakar — La chaleur humaine', texte: "À Dakar, la chaleur humaine se manifeste dans les moindres interactions : on prend le temps de saluer, de s'enquérir de la famille, avant même d'aborder le sujet qui nous amène." },
    { titre: 'Genève — La douceur de vivre', texte: "Si la Suisse romande est réputée pour sa précision, elle recèle aussi une douceur de vivre insoupçonnée, entre lacs paisibles et montagnes qui semblent veiller sur la ville." },
    { titre: 'La technologie et nous', texte: "À mesure que la technologie transforme notre quotidien, il devient essentiel de préserver des espaces, comme ce club, où la parole circule sans écran interposé." },
  ],
  c1c2: [
    { titre: 'Littérature francophone', texte: "La littérature francophone contemporaine se caractérise par une pluralité de voix qui, loin de se cantonner à l'Hexagone, puisent leur inspiration dans les mémoires plurielles d'un monde postcolonial en perpétuelle redéfinition." },
    { titre: 'L\'humour français', texte: "L'humour français, souvent qualifié d'ironique voire caustique, repose sur un art consommé de la litote et du sous-entendu, où ce qui n'est pas dit importe parfois davantage que ce qui l'est." },
    { titre: 'L\'urgence environnementale', texte: "Face à l'urgence environnementale, un nombre croissant de francophones repensent leur rapport à la consommation, privilégiant la sobriété choisie à l'abondance qui a longtemps caractérisé les sociétés occidentales." },
    { titre: 'La Francophonie', texte: "La Francophonie, en tant qu'espace linguistique et culturel, ne saurait se réduire à une simple communauté de langue : elle incarne une diversité de sensibilités que l'histoire coloniale a paradoxalement contribué à faire dialoguer." },
    { titre: 'L\'art contemporain', texte: "Dans les musées parisiens comme dans les galeries d'art contemporain d'Abidjan ou de Montréal, se dessine une même volonté : interroger, par des moyens résolument actuels, l'héritage et les mutations d'un monde en mouvement." },
    { titre: 'Équilibre de vie', texte: "Si le travail occupe une place centrale dans nos existences, la quête d'un équilibre entre vie professionnelle et vie personnelle s'impose désormais comme une préoccupation transversale, indépendamment des frontières et des cultures." },
  ],
};

function nettoyerMot(mot) {
  return mot.toLowerCase().replace(/[.,;:!?«»"'()—]/g, '');
}

function comparerDictee(texteAttendu, texteUtilisateur) {
  const attendu = texteAttendu.split(/\s+/).filter(Boolean);
  const saisi = texteUtilisateur.split(/\s+/).filter(Boolean).map(nettoyerMot);
  let correct = 0;
  const spans = attendu.map((mot, i) => {
    const ok = saisi[i] !== undefined && saisi[i] === nettoyerMot(mot);
    if (ok) correct++;
    return `<span class="${ok ? 'mot-ok' : 'mot-erreur'}">${mot}</span>`;
  });
  const score = attendu.length ? Math.round((correct / attendu.length) * 100) : 0;
  return { html: spans.join(' '), score };
}

function remplirSelect(niveau) {
  const select = document.getElementById('dictee-select-' + niveau);
  select.innerHTML = '';
  DICTEES[niveau].forEach((d, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = d.titre;
    select.appendChild(opt);
  });
}

function initDictee(niveau) {
  remplirSelect(niveau);
  const select = document.getElementById('dictee-select-' + niveau);
  const textarea = document.getElementById('dictee-texte-' + niveau);
  const zoneCorrige = document.getElementById('dictee-corrige-' + niveau);
  const zoneScore = document.getElementById('dictee-score-' + niveau);
  let indexActuel = 0;

  function texteActuel() {
    return DICTEES[niveau][indexActuel].texte;
  }

  function chargerDictee(i) {
    indexActuel = i;
    select.value = i;
    textarea.value = '';
    zoneCorrige.textContent = texteActuel();
    zoneCorrige.parentElement.classList.remove('visible');
    zoneScore.innerHTML = '';
    if (!hayVozFrancesa()) {
      zoneScore.innerHTML = '<p class="muted" style="margin-top:.5rem;">⚠️ Aucune voix française n\'a été trouvée sur cet appareil : l\'audio pourrait ne pas fonctionner ou utiliser une autre langue. Essaie avec Chrome ou installe une voix française dans les paramètres de ton système.</p>';
    }
  }

  select.addEventListener('change', () => chargerDictee(parseInt(select.value, 10)));
  document.getElementById('dictee-aleatoire-' + niveau).addEventListener('click', () => {
    chargerDictee(Math.floor(Math.random() * DICTEES[niveau].length));
  });
  document.getElementById('dictee-ecouter-' + niveau).addEventListener('click', () => decirFrances(texteActuel()));
  document.getElementById('dictee-lent-' + niveau).addEventListener('click', () => decirFrances(texteActuel(), { rate: 0.65 }));
  document.getElementById('dictee-corriger-' + niveau).addEventListener('click', () => {
    zoneCorrige.parentElement.classList.add('visible');
  });
  document.getElementById('dictee-verifier-' + niveau).addEventListener('click', () => {
    const { html, score } = comparerDictee(texteActuel(), textarea.value);
    zoneScore.innerHTML = `<p class="dictee-score">Score : ${score}% des mots exacts</p><p>${html}</p>`;
  });

  chargerDictee(0);
}

document.addEventListener('DOMContentLoaded', () => {
  initDictee('a1a2');
  initDictee('b1b2');
  initDictee('c1c2');
});
