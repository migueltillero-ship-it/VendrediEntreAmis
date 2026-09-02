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
