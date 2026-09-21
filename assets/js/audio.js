/* ════════════════════════════════════════════════
   AUDIO.JS — pronunciación en voz alta (Web Speech API)
   ─────────────────────────────────────────────────
   Poner lang = 'fr-FR' en el utterance NO basta : si el
   navegador no encuentra ninguna voz francesa instalada,
   muchos motores (sobre todo en systèmes en español) leen
   el texto igual, pero con la voz por defecto del sistema
   — es decir, en español, aunque las palabras sean en
   francés. Por eso buscamos explícitamente una voix fr-*
   entre las voces disponibles y se la asignamos al
   utterance con u.voice.
════════════════════════════════════════════════ */
let VOCES_DISPONIBLES = [];

function cargarVoces() {
  if ('speechSynthesis' in window) VOCES_DISPONIBLES = speechSynthesis.getVoices();
}
if ('speechSynthesis' in window) {
  cargarVoces();
  speechSynthesis.onvoiceschanged = cargarVoces;
}

function vozFrancesa() {
  if (!VOCES_DISPONIBLES.length) cargarVoces();
  return (
    VOCES_DISPONIBLES.find(v => v.lang === 'fr-FR') ||
    VOCES_DISPONIBLES.find(v => /^fr/i.test(v.lang)) ||
    null
  );
}

function hayVozFrancesa() {
  return !!vozFrancesa();
}

function decirFrances(texto, options) {
  if (!('speechSynthesis' in window)) return;
  const opts = options || {};
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = 'fr-FR';
  const voix = vozFrancesa();
  if (voix) u.voice = voix;
  u.rate = opts.rate || 0.92;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

function botonEscuchar(texto, extraClass) {
  const btn = document.createElement('button');
  btn.className = 'say-btn' + (extraClass ? ' ' + extraClass : '');
  btn.setAttribute('aria-label', 'Écouter ' + texto);
  btn.title = 'Écouter';
  btn.textContent = '🔊';
  btn.addEventListener('click', () => decirFrances(texto));
  return btn;
}
