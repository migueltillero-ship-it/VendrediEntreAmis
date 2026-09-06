/* ════════════════════════════════════════════════
   COMMUNITY-DATA.JS
   Charge le contenu communautaire d'« Entre Amis » depuis des
   Google Sheets publiées en CSV (réponses de Google Forms).

   ▶ CONFIGURATION (à faire une seule fois, voir
     CONFIGURATION-FORMULAIRES.md pour le pas-à-pas) :
   Pour chaque section, remplace les deux valeurs :
     - form : le lien du formulaire Google Forms (bouton "Participer")
     - csv  : le lien "Publier sur le web → CSV" de l'onglet
              de réponses correspondant dans Google Sheets
   Tant que csv n'est pas renseigné, la section affiche
   simplement un état vide — rien ne casse.
════════════════════════════════════════════════ */
const COMMUNITY_CONFIG = {
  portrait: {
    form: "COLLE_ICI_LE_LIEN_DU_FORMULAIRE_PORTRAIT",
    csv:  "COLLE_ICI_LE_LIEN_CSV_PORTRAIT",
  },
  carte: {
    form: "COLLE_ICI_LE_LIEN_DU_FORMULAIRE_CARTE",
    csv:  "COLLE_ICI_LE_LIEN_CSV_CARTE",
  },
  reussites: {
    form: "COLLE_ICI_LE_LIEN_DU_FORMULAIRE_REUSSITES",
    csv:  "COLLE_ICI_LE_LIEN_CSV_REUSSITES",
  },
  journal: {
    form: "COLLE_ICI_LE_LIEN_DU_FORMULAIRE_JOURNAL",
    csv:  "COLLE_ICI_LE_LIEN_CSV_JOURNAL",
  },
};

/* Parseur CSV minimal (gère les champs entre guillemets,
   avec virgules ou retours à la ligne à l'intérieur) —
   suffisant pour un export Google Sheets propre. */
function parseCSV(texte) {
  const lignes = [];
  let ligne = [], champ = '', dansGuillemets = false;
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i], suivant = texte[i + 1];
    if (dansGuillemets) {
      if (c === '"' && suivant === '"') { champ += '"'; i++; }
      else if (c === '"') { dansGuillemets = false; }
      else champ += c;
    } else {
      if (c === '"') dansGuillemets = true;
      else if (c === ',') { ligne.push(champ); champ = ''; }
      else if (c === '\n') { ligne.push(champ); lignes.push(ligne); ligne = []; champ = ''; }
      else if (c === '\r') { /* ignoré */ }
      else champ += c;
    }
  }
  if (champ.length || ligne.length) { ligne.push(champ); lignes.push(ligne); }
  if (!lignes.length) return [];
  const entetes = lignes[0].map(h => h.trim());
  return lignes.slice(1)
    .filter(l => l.some(v => (v || '').trim() !== ''))
    .map(l => {
      const obj = {};
      entetes.forEach((h, idx) => obj[h] = (l[idx] || '').trim());
      return obj;
    });
}

function estConfiguree(cle) {
  const url = COMMUNITY_CONFIG[cle] && COMMUNITY_CONFIG[cle].csv;
  return !!url && !url.startsWith('COLLE_ICI');
}

async function chargerCommunaute(cle) {
  if (!estConfiguree(cle)) return [];
  try {
    const res = await fetch(COMMUNITY_CONFIG[cle].csv);
    if (!res.ok) return [];
    return parseCSV(await res.text());
  } catch (e) {
    console.warn('Communauté : impossible de charger', cle, e);
    return [];
  }
}

function lienFormulaire(cle) {
  const url = COMMUNITY_CONFIG[cle] && COMMUNITY_CONFIG[cle].form;
  return (url && !url.startsWith('COLLE_ICI')) ? url : null;
}
