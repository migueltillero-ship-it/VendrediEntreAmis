/* ════════════════════════════════════════════════
   CALENDRIER.JS — « Ajouter à mon calendrier » + heures dans le monde
   Génère un lien Google Calendar et un fichier .ics pour la séance
   hebdomadaire du vendredi (événement récurrent), et affiche l'heure
   correspondante dans plusieurs pays de la communauté.
════════════════════════════════════════════════ */
const EVENEMENT_CLUB = {
  titre: 'Vendredi entre Amis — Club de conversation en français',
  lieu: 'En ligne (Zoom) — lien dans le groupe WhatsApp',
  description: "Chaque vendredi, une conversation. Chaque semaine, une nouvelle destination francophone. Rejoignez-nous sur Zoom : https://us02web.zoom.us/j/2368165321",
  dateLancement: '2026-09-11', // 1er vendredi
  heureDebut: '18:00',         // heure du Mexique (confirmé)
  heureFin: '19:30',           // heure du Mexique (confirmé)
  fuseauIana: 'America/Mexico_City', // utilisé par Google Calendar (ctz)
  decalageUtc: -6,             // Mexique n'a plus d'heure d'été depuis 2022 : décalage fixe
};

/* Pays proposés dans le sélecteur « Découvre à quelle heure... ».
   Le calcul (y compris l'heure d'été de chaque pays) se fait via Intl
   + la base de fuseaux IANA — jamais à la main. */
const FUSEAUX_MONDE = [
  { pays: 'Mexique · Ciudad de México', tz: 'America/Mexico_City' },
  { pays: 'Canada · Toronto / Montréal', tz: 'America/Toronto' },
  { pays: 'États-Unis · New York', tz: 'America/New_York' },
  { pays: 'États-Unis · Los Angeles', tz: 'America/Los_Angeles' },
  { pays: 'Venezuela · Caracas', tz: 'America/Caracas' },
  { pays: 'Équateur · Quito', tz: 'America/Guayaquil' },
  { pays: 'Colombie · Bogotá', tz: 'America/Bogota' },
  { pays: 'Pérou · Lima', tz: 'America/Lima' },
  { pays: 'Chili · Santiago', tz: 'America/Santiago' },
  { pays: 'Argentine · Buenos Aires', tz: 'America/Argentina/Buenos_Aires' },
  { pays: 'Espagne · Madrid', tz: 'Europe/Madrid' },
  { pays: 'France · Paris', tz: 'Europe/Paris' },
  { pays: 'Belgique · Bruxelles', tz: 'Europe/Brussels' },
  { pays: 'Suisse · Genève / Zurich', tz: 'Europe/Zurich' },
  { pays: 'Maroc · Casablanca', tz: 'Africa/Casablanca' },
  { pays: 'Sénégal · Dakar', tz: 'Africa/Dakar' },
  { pays: 'Australie · Sydney', tz: 'Australia/Sydney' },
];

function pad(n) { return String(n).padStart(2, '0'); }

function versUtcDate(dateStr, heureStr, decalageUtc) {
  const [an, mois, jour] = dateStr.split('-').map(Number);
  const [h, m] = heureStr.split(':').map(Number);
  return new Date(Date.UTC(an, mois - 1, jour, h - decalageUtc, m, 0));
}

function versUtc(dateStr, heureStr, decalageUtc) {
  const d = versUtcDate(dateStr, heureStr, decalageUtc);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

function formatHeureZone(date, tz) {
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(date);
}

function formatJourZone(date, tz) {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', timeZone: tz }).format(date);
}

function rendreFuseauxMonde(ev) {
  const select = document.getElementById('fuseauSelect');
  const resultat = document.getElementById('fuseauResultat');
  if (!select || !resultat) return;

  const debut = versUtcDate(ev.dateLancement, ev.heureDebut, ev.decalageUtc);
  const fin = versUtcDate(ev.dateLancement, ev.heureFin, ev.decalageUtc);
  const jourMexique = formatJourZone(debut, ev.fuseauIana);

  let fuseauDetecte = null;
  try { fuseauDetecte = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { /* ignoré */ }
  const correspond = FUSEAUX_MONDE.some(f => f.tz === fuseauDetecte);

  let optionsHtml = FUSEAUX_MONDE.map(f =>
    `<option value="${f.tz}"${f.tz === fuseauDetecte ? ' selected' : ''}>${f.pays}</option>`
  ).join('');
  if (fuseauDetecte && !correspond) {
    const nomLisible = fuseauDetecte.split('/').pop().replace(/_/g, ' ');
    optionsHtml = `<option value="${fuseauDetecte}" selected>Chez toi (${nomLisible})</option>` + optionsHtml;
  }
  select.innerHTML = optionsHtml;

  function afficher() {
    const tz = select.value;
    const jour = formatJourZone(debut, tz);
    const noteJour = jour !== jourMexique ? ` <span class="fuseau-note">(${jour})</span>` : '';
    resultat.innerHTML = `${formatHeureZone(debut, tz)} – ${formatHeureZone(fin, tz)}${noteJour}`;
  }

  afficher();
  select.addEventListener('change', afficher);
}

function lienGoogleCalendar(ev) {
  const dateLocale = ev.dateLancement.replace(/-/g, '');
  const debut = `${dateLocale}T${ev.heureDebut.replace(':', '')}00`;
  const fin = `${dateLocale}T${ev.heureFin.replace(':', '')}00`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.titre,
    dates: `${debut}/${fin}`,
    details: ev.description,
    location: ev.lieu,
    ctz: ev.fuseauIana,
    recur: 'RRULE:FREQ=WEEKLY;BYDAY=FR',
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

function contenuIcs(ev) {
  const debutUtc = versUtc(ev.dateLancement, ev.heureDebut, ev.decalageUtc);
  const finUtc = versUtc(ev.dateLancement, ev.heureFin, ev.decalageUtc);
  const maintenant = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vendredi entre Amis//FR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:vendredi-entre-amis-${ev.dateLancement}@vendredientreamis`,
    `DTSTAMP:${maintenant}`,
    `DTSTART:${debutUtc}`,
    `DTEND:${finUtc}`,
    'RRULE:FREQ=WEEKLY;BYDAY=FR',
    `SUMMARY:${ev.titre}`,
    `DESCRIPTION:${ev.description}`,
    `LOCATION:${ev.lieu}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function initCalendrier() {
  const btnGoogle = document.getElementById('btn-calendrier-google');
  const btnIcs = document.getElementById('btn-calendrier-ics');
  rendreFuseauxMonde(EVENEMENT_CLUB);
  if (btnGoogle) btnGoogle.href = lienGoogleCalendar(EVENEMENT_CLUB);
  if (btnIcs) {
    btnIcs.addEventListener('click', (e) => {
      e.preventDefault();
      const blob = new Blob([contenuIcs(EVENEMENT_CLUB)], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vendredi-entre-amis.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
}

document.addEventListener('DOMContentLoaded', initCalendrier);
