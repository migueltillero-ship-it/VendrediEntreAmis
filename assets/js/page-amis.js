/* ════════════════════════════════════════════════
   PAGE-AMIS.JS — Entre Amis
   Une question par semaine. Si la semaine actuelle n'a pas
   de question spécifique ci-dessous, une question générique
   est utilisée à la place — ajoute-en autant que tu veux.
════════════════════════════════════════════════ */
const PREGUNTAS_ENTRE_AMIS = {
  1: "Quel est votre café ou restaurant préféré, et pourquoi ?",
  2: "Quel plat représente le mieux votre ville ou région ?",
  6: "Que représente pour vous le mot « chez-soi » ?",
  8: "Quelle est une tradition d'hospitalité de votre pays ?",
};

(function () {
  const pregunta = PREGUNTAS_ENTRE_AMIS[SEMANA_ACTUAL] || "Quel est un souvenir que vous aimez raconter ?";
  document.getElementById('entre-amis-pregunta').textContent = pregunta;

  const key = 'entre-amis-reponse-' + SEMANA_ACTUAL;
  const textarea = document.getElementById('entre-amis-texto');
  textarea.value = localStorage.getItem(key) || '';
  textarea.addEventListener('input', () => localStorage.setItem(key, textarea.value));

  document.getElementById('entre-amis-whatsapp').addEventListener('click', () => {
    const texto = encodeURIComponent(`${pregunta}\n\n${textarea.value}`);
    window.open(`https://wa.me/?text=${texto}`, '_blank');
  });
})();
