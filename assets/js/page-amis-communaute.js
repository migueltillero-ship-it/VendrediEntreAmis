/* ════════════════════════════════════════════════
   PAGE-AMIS-COMMUNAUTE.JS
   Branche les 4 blocs communautaires de pages/amis.html
   (Portrait, Carte, Réussites, Journal) sur les données
   Google Sheets chargées par community-data.js, et pointe
   chaque bouton « data-form » vers le Google Form associé.
════════════════════════════════════════════════ */

const CLES_A_IGNORER = /horodateur|timestamp|marca de tiempo|adresse e-?mail|email address/i;

function champsUtiles(ligne) {
  return Object.keys(ligne).filter(cle => cle.trim() !== '' && !CLES_A_IGNORER.test(cle));
}

function trouverChamp(ligne, motsCles) {
  const cles = champsUtiles(ligne);
  const trouve = cles.find(c => motsCles.some(mot => c.toLowerCase().includes(mot)));
  return trouve ? ligne[trouve] : '';
}

function brancherBouton(cle) {
  document.querySelectorAll(`[data-form="${cle}"]`).forEach(btn => {
    const url = lienFormulaire(cle);
    if (url) {
      btn.href = url;
    } else {
      btn.style.display = 'none';
    }
  });
}

function videEtat(messageVide, cle) {
  const url = lienFormulaire(cle);
  const lien = url ? `<br><a class="btn secondary" href="${url}" target="_blank" rel="noopener" style="margin-top:.75rem;display:inline-block;">Sois le·la premier·ère →</a>` : '';
  return `<div class="empty-state">${messageVide}${lien}</div>`;
}

/* ─── PORTRAIT DE LA SEMAINE ─── */
function rendrePortraits(lignes) {
  const wrap = document.getElementById('portrait-wrap');
  if (!wrap) return;
  if (!lignes.length) {
    wrap.innerHTML = videEtat('Personne ne s’est encore présenté cette semaine.', 'portrait');
    return;
  }
  const derniere = lignes[lignes.length - 1];
  const nom = trouverChamp(derniere, ['prénom', 'prenom', 'nom', 'name', 'pseudo']) || 'Un membre du club';
  const ville = trouverChamp(derniere, ['ville', 'pays', 'city', 'country', 'origine']);
  const citation = trouverChamp(derniere, ['message', 'présente', 'presente', 'citation', 'phrase', 'motivation', 'français', 'francais']);
  wrap.innerHTML = `
    <div class="portrait-card">
      <div class="avatar-fallback">${(nom || '?').trim().charAt(0).toUpperCase()}</div>
      <div>
        <strong>${nom}</strong>${ville ? ` <span class="muted">· ${ville}</span>` : ''}
        ${citation ? `<blockquote>« ${citation} »</blockquote>` : ''}
      </div>
    </div>`;
}

/* ─── CARTE DU MONDE DES AMIS ─── */
function rendreCarte(lignes) {
  const wrap = document.getElementById('carte-wrap');
  if (!wrap) return;
  if (!lignes.length) {
    wrap.innerHTML = videEtat('La carte est encore vierge — sois le premier point dessus !', 'carte');
    return;
  }
  wrap.innerHTML = lignes.slice().reverse().slice(0, 24).map(l => {
    const nom = trouverChamp(l, ['prénom', 'prenom', 'nom', 'name', 'pseudo']) || 'Un·e ami·e';
    const lieu = trouverChamp(l, ['ville', 'pays', 'city', 'country', 'origine']);
    const passion = trouverChamp(l, ['passion', 'aime', 'intérêt', 'interet', 'hobby']);
    return `<div class="carte-item"><strong>${nom}</strong>${lieu ? `<br><span class="muted">${lieu}</span>` : ''}${passion ? `<p style="margin-top:.4rem;">${passion}</p>` : ''}</div>`;
  }).join('');
}

/* ─── MUR DES RÉUSSITES ─── */
function rendreReussites(lignes) {
  const wrap = document.getElementById('reussites-wrap');
  if (!wrap) return;
  if (!lignes.length) {
    wrap.innerHTML = videEtat('Aucune réussite partagée pour l’instant.', 'reussites');
    return;
  }
  wrap.innerHTML = lignes.slice().reverse().slice(0, 24).map(l => {
    const nom = trouverChamp(l, ['prénom', 'prenom', 'nom', 'name', 'pseudo']) || 'Un·e ami·e';
    const reussite = trouverChamp(l, ['réussite', 'reussite', 'progrès', 'progres', 'accompli', 'fier', 'fière']);
    return `<div class="reussite-card"><div class="trophee">🏆</div><div class="nom">${nom}</div>${reussite ? `<p style="margin-top:.4rem;">${reussite}</p>` : ''}</div>`;
  }).join('');
}

/* ─── JOURNAL DE LA COMMUNAUTÉ ─── */
function rendreJournal(lignes) {
  const wrap = document.getElementById('journal-wrap');
  if (!wrap) return;
  if (!lignes.length) {
    wrap.innerHTML = videEtat('Le journal attend son premier article.', 'journal');
    return;
  }
  wrap.innerHTML = lignes.slice().reverse().slice(0, 12).map(l => {
    const nom = trouverChamp(l, ['prénom', 'prenom', 'nom', 'name', 'pseudo']) || 'Un·e ami·e';
    const titre = trouverChamp(l, ['titre', 'title', 'sujet']);
    const texte = trouverChamp(l, ['article', 'texte', 'message', 'réflexion', 'reflexion', 'témoignage', 'temoignage']);
    return `<div class="journal-post"><p class="meta">${nom}</p>${titre ? `<h3>${titre}</h3>` : ''}${texte ? `<p>${texte}</p>` : ''}</div>`;
  }).join('');
}

(async function initCommunaute() {
  ['portrait', 'carte', 'reussites', 'journal'].forEach(brancherBouton);

  const [portraits, carte, reussites, journal] = await Promise.all([
    chargerCommunaute('portrait'),
    chargerCommunaute('carte'),
    chargerCommunaute('reussites'),
    chargerCommunaute('journal'),
  ]);

  rendrePortraits(portraits);
  rendreCarte(carte);
  rendreReussites(reussites);
  rendreJournal(journal);
})();
