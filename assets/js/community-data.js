/* ════════════════════════════════════════════════
   COMMUNITY-DATA.JS
   Charge le contenu communautaire d'« Entre Amis » depuis des
   Google Sheets publiées en CSV (réponses de Google Forms).
════════════════════════════════════════════════ */
const COMMUNITY_CONFIG = {
  portrait: {
    form: "https://docs.google.com/forms/d/e/1FAIpQLSc7WAWrr0LtcELDtU8NEDru-HM4Q4VQcGtuFhX-QKSUqKNhBQ/viewform",
    csv:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT8TUIQaTfaBqRl9jH0vwUFseiw_4MnX4hNlr4NlGDY0GpjmKxDppGJ1OKXnLi5mABiGOfiBaxDs2_B/pub?output=csv",
  },
  carte: {
    form: "https://docs.google.com/forms/d/e/1FAIpQLSdDGOyUvbW45sqOq11UiNG53_A1TeW-e7wG025RdTP83mzSHQ/viewform",
    csv:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRASm3DpRiGzYUHsIM4GNAwjrB3ncr5tHPFgsqs2AFkxgQ61VWTrK9VGyJBrwU5UT2PhykhoSNooW37/pub?output=csv",
  },
  reussites: {
    form: "https://docs.google.com/forms/d/e/1FAIpQLSex1AYKefbtkaisTD-eOITJoQIx4Oo1Nv3bIwKHNV3acjkZig/viewform",
    csv:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRub5b6a3l1xzErgVVjS-1U9e8ZzARJI9smbXCVV2T6XdA4_1jgWX4huG88zJujERNitlm-8dBlCSty/pub?output=csv",
  },
  journal: {
    form: "https://docs.google.com/forms/d/e/1FAIpQLSegXjj0LXpawgVWwyHNsJsRL4zWkwmJJJxvjHYHoTbtW1-Uyw/viewform",
    csv:  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFam0LrK_KXMXhUQxxcydkll6jLSfOvPgS50bECxe81RohK4pFoPqiM8uVLmVbvvCxaE5qkcNZWMeD/pub?output=csv",
  },
};

/* Parseur CSV minimal */
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
