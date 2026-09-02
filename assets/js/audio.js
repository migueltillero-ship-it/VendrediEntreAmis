/* ════════════════════════════════════════════════
   AUDIO.JS — pronunciación en voz alta (Web Speech API)
════════════════════════════════════════════════ */
function decirFrances(texto) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = 'fr-FR';
  u.rate = 0.92;
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
