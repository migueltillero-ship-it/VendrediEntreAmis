/* ════════ MON CARNET DE VOYAGE (Local Storage) ════════ */
const CARNET_KEY = 'mt-carnet-voyage';
function leerCarnet() { try { return JSON.parse(localStorage.getItem(CARNET_KEY)) || []; } catch(e) { return []; } }
function guardarCarnet(lista) { localStorage.setItem(CARNET_KEY, JSON.stringify(lista)); }

function agregarAlCarnet(texto, tipo) {
    if (!texto) return;
    const lista = leerCarnet();
    lista.push({ texto, tipo, fecha: new Date().toLocaleDateString('fr-FR') });
    guardarCarnet(lista);
    alert('✨ "' + texto + '" a été ajouté à ton carnet !');
}

/* Rendu de la liste dans un conteneur, avec suppression */
function renderCarnet(idContenedor) {
  const cont = document.getElementById(idContenedor);
  if (!cont) return;
  const lista = leerCarnet();
  cont.innerHTML = '';
  if (lista.length === 0) {
    cont.innerHTML = '<div class="empty-state">Ton carnet est vide pour l\'instant — ajoute ton premier mot, expression ou réflexion ci-dessus.</div>';
    return;
  }
  lista.slice().reverse().forEach((item) => {
    const idxReal = lista.indexOf(item);
    const div = document.createElement('div');
    div.className = 'entry';
    div.innerHTML = `
      <div>
        <div class="vocab-fr">${item.texto}</div>
        <div class="vocab-es">${item.tipo} · ${item.fecha}</div>
      </div>
      <button class="del" aria-label="Supprimer">✕</button>
    `;
    div.querySelector('.del').addEventListener('click', () => {
      const actual = leerCarnet();
      actual.splice(idxReal, 1);
      guardarCarnet(actual);
      renderCarnet(idContenedor);
    });
    cont.appendChild(div);
  });
}

/* Branche le formulaire d'ajout sur le carnet et rafraîchit la liste */
function initCarnetForm(idFormulario, idTexto, idTipo, idContenedor) {
  const form = document.getElementById(idFormulario);
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const texto = document.getElementById(idTexto).value.trim();
    const tipo = document.getElementById(idTipo).value;
    if (!texto) return;
    const lista = leerCarnet();
    lista.push({ texto, tipo, fecha: new Date().toLocaleDateString('fr-FR') });
    guardarCarnet(lista);
    document.getElementById(idTexto).value = '';
    renderCarnet(idContenedor);
  });
}
