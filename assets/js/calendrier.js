/* ════════════════════════════════════════════════
   CALENDRIER.JS — « Ajouter à mon calendrier »
   Génère un lien Google Calendar et un fichier .ics pour la
   séance hebdomadaire du vendredi (événement récurrent).

   ⚠️ À CONFIRMER : Miguel doit vérifier/ajuster DATE_LANCEMENT,
   HEURE_DEBUT, HEURE_FIN et FUSEAU ci-dessous une seule fois —
   tout le reste (lien Google Calendar + .ics) se génère seul.
════════════════════════════════════════════════ */
const EVENEMENT_CLUB = {
  titre: 'Vendredi entre Amis — Club de conversation en français',
  lieu: 'En ligne (Zoom) — lien dans le groupe WhatsApp',
  description: "Chaque vendredi, une conversation. Chaque semaine, une nouvelle destination francophone. Rejoignez-nous sur Zoom : https://us02web.zoom.us/j/2368165321",
  dateLancement: '2026-09-11', // 1er vendredi — à confirmer si besoin
  heureDebut: '19:00',         // heure locale — À CONFIRMER par Miguel
  heureFin: '20:30',           // heure locale — À CONFIRMER par Miguel
  fuseauIana: 'America/Mexico_City', // À CONFIRMER — utilisé par Google Calendar (ctz)
  decalageUtc: -6,             // décalage fixe du fuseau ci-dessus, en heures (sans heure d'été)
};

function pad(n) { return String(n).padStart(2, '0'); }

function versUtc(dateStr, heureStr, decalageUtc) {
  const [an, mois, jour] = dateStr.split('-').map(Number);
  const [h, m] = heureStr.split(':').map(Number);
  const d = new Date(Date.UTC(an, mois - 1, jour, h - decalageUtc, m, 0));
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
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
