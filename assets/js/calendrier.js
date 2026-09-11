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

/* Fuseaux de la communauté, calculés automatiquement (gère l'heure
   d'été de chaque pays grâce à Intl + la base de fuseaux IANA — pas
   de calcul manuel qui pourrait se tromper). */
const FUSEAUX_MONDE = [
  { pays: 'Canada · Toronto / Montréal', tz: 'America/Toronto' },
  { pays: 'Venezuela · Caracas', tz: 'America/Caracas' },
  { pays: 'Équateur · Quito', tz: 'America/Guayaquil' },
  { pays: 'Chili · Santiago', tz: 'America/Santiago' },
  { pays: 'États-Unis · New York', tz: 'America/New_York' },
  { pays: 'États-Unis · Los Angeles', tz: 'America/Los_Angeles' },
  { pays: 'France · Paris', tz: 'Europe/Paris' },
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
  const wrap = document.getElementById('fuseaux-monde');
  if (!wrap) return;
  const debut = versUtcDate(ev.dateLancement, ev.heureDebut, ev.decalageUtc);
  const fin = versUtcDate(ev.dateLancement, ev.heureFin, ev.decalageUtc);
  const jourMexique = formatJourZone(debut, ev.fuseauIana);

  wrap.innerHTML = FUSEAUX_MONDE.map(f => {
    const jour = formatJourZone(debut, f.tz);
    const noteJour = jour !== jourMexique ? ` <span class="fuseau-note">(${jour})</span>` : '';
    return `<div class="fuseau-item"><span class="fuseau-pays">${f.pays}</span><span class="fuseau-heure">${formatHeureZone(debut, f.tz)} – ${formatHeureZone(fin, f.tz)}${noteJour}</span></div>`;
  }).join('');
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
