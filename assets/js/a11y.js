/* ════════ LE COIN SÉRÉNITÉ (A11y) ════════ */
function initA11y() {
  const html = document.documentElement;
  const guardado = JSON.parse(localStorage.getItem('mt-a11y-prefs') || '{}');
  if (guardado.tamano) html.classList.add(guardado.tamano);
  if (guardado.contraste) html.classList.add('contraste');
}
function setTamano(clase) {
  const html = document.documentElement;
  html.classList.remove('confort', 'confort-plus');
  if (clase) html.classList.add(clase);
  guardarPrefsA11y();
}
function toggleContraste() {
  document.documentElement.classList.toggle('contraste');
  guardarPrefsA11y();
}
function guardarPrefsA11y() {
  const html = document.documentElement;
  const tamano = html.classList.contains('confort-plus') ? 'confort-plus' : (html.classList.contains('confort') ? 'confort' : null);
  localStorage.setItem('mt-a11y-prefs', JSON.stringify({ tamano, contraste: html.classList.contains('contraste') }));
}
document.addEventListener('DOMContentLoaded', initA11y);
