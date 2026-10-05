/* ════════════════════════════════════════════════
   MON CARNET DE VOYAGE
   Par défaut, le carnet vit dans le localStorage de l'appareil (comme
   avant — aucun changement pour qui n'active pas la synchronisation).
   Si la personne indique son numéro WhatsApp une fois, le carnet passe
   en mode « synchronisé » : il est lu/écrit dans Supabase (voir
   assets/js/supabase-config.js) et suit le même numéro sur n'importe
   quel appareil où il est ressaisi. Aucun mot de passe, aucun compte.
════════════════════════════════════════════════ */
const CARNET_KEY = 'mt-carnet-voyage';
const CARNET_TELEFONO_KEY = 'mt-carnet-telefono';
const CARNET_NOMBRE_KEY = 'mt-carnet-nombre';

function leerCarnetLocal() { try { return JSON.parse(localStorage.getItem(CARNET_KEY)) || []; } catch (e) { return []; } }
function guardarCarnetLocal(lista) { localStorage.setItem(CARNET_KEY, JSON.stringify(lista)); }

/* Ne garde que les chiffres et le "+" initial, pour que le numéro tapé par
   la personne corresponde toujours au même format, quel que soit la façon
   dont elle l'a écrit (espaces, tirets, parenthèses...). */
function normalizarTelefono(tel) {
  return (tel || '').trim().replace(/[^\d+]/g, '');
}

function telefonoGuardado() {
  return (localStorage.getItem(CARNET_TELEFONO_KEY) || '').trim() || null;
}
function guardarTelefono(telefono) {
  localStorage.setItem(CARNET_TELEFONO_KEY, normalizarTelefono(telefono));
}
function olvidarTelefono() {
  localStorage.removeItem(CARNET_TELEFONO_KEY);
}

function nombreGuardado() {
  return (localStorage.getItem(CARNET_NOMBRE_KEY) || '').trim() || null;
}
function guardarNombre(nombre) {
  localStorage.setItem(CARNET_NOMBRE_KEY, nombre);
}
function olvidarNombre() {
  localStorage.removeItem(CARNET_NOMBRE_KEY);
}

/* Bienvenue personnalisée : si le numéro correspond à un·e élève connu·e
   (voir supabase/carnet-bienvenida-estudiantes.sql), on récupère son
   prénom une fois et on le garde en cache local. */
async function buscarYCachearNombre(tel) {
  try {
    const { data, error } = await window.supabaseClient.rpc('vea_estudiante_por_telefono', { p_telefono: tel });
    if (error) throw error;
    if (data) { guardarNombre(data); return data; }
    olvidarNombre();
    return null;
  } catch (e) {
    console.warn('Carnet : recherche du prénom indisponible.', e);
    return null;
  }
}

function carnetSincronizado() {
  return !!(window.supabaseConfigurado && telefonoGuardado());
}

/* ─── Lecture / écriture, selon le mode actif ─── */

async function leerCarnet() {
  if (!carnetSincronizado()) return leerCarnetLocal();
  try {
    const { data, error } = await window.supabaseClient.rpc('vea_carnet_por_telefono', { p_telefono: telefonoGuardado() });
    if (error) throw error;
    return (data || []).map(fila => ({
      id: fila.id,
      texto: fila.texto,
      tipo: fila.tipo,
      fecha: new Date(fila.created_at).toLocaleDateString('fr-FR'),
    }));
  } catch (e) {
    console.warn('Carnet : lecture Supabase impossible, repli local.', e);
    return leerCarnetLocal();
  }
}

async function agregarEntrada(texto, tipo) {
  if (!texto) return { ok: false };
  if (carnetSincronizado()) {
    try {
      const { error } = await window.supabaseClient.from('vea_carnet').insert({
        telefono: telefonoGuardado(), texto, tipo,
      });
      if (error) throw error;
      return { ok: true };
    } catch (e) {
      console.warn('Carnet : écriture Supabase impossible.', e);
      return { ok: false, erreur: true };
    }
  }
  const lista = leerCarnetLocal();
  lista.push({ texto, tipo, fecha: new Date().toLocaleDateString('fr-FR') });
  guardarCarnetLocal(lista);
  return { ok: true };
}

async function eliminarEntrada(item, idxLocal) {
  if (carnetSincronizado() && item.id) {
    try {
      const { error } = await window.supabaseClient.rpc('vea_carnet_borrar', { p_id: item.id, p_telefono: telefonoGuardado() });
      if (error) throw error;
    } catch (e) {
      console.warn('Carnet : suppression Supabase impossible.', e);
    }
    return;
  }
  const actual = leerCarnetLocal();
  actual.splice(idxLocal, 1);
  guardarCarnetLocal(actual);
}

/* Point d'entrée utilisé ailleurs sur le site (ex. theme-routine.html,
   bouton 🔖 « ajouter au carnet » à côté du vocabulaire). */
function agregarAlCarnet(texto, tipo) {
  if (!texto) return;
  agregarEntrada(texto, tipo).then(res => {
    if (res.ok) alert('✨ "' + texto + '" a été ajouté à ton carnet !');
    else alert('Impossible d\'ajouter au carnet pour le moment — vérifie ta connexion et réessaie.');
  });
}

/* ─── Rendu de la liste, avec suppression ─── */
async function renderCarnet(idContenedor) {
  const cont = document.getElementById(idContenedor);
  if (!cont) return;
  cont.innerHTML = '<div class="empty-state">Chargement…</div>';
  const lista = await leerCarnet();
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
    div.querySelector('.del').addEventListener('click', async () => {
      await eliminarEntrada(item, idxReal);
      renderCarnet(idContenedor);
    });
    cont.appendChild(div);
  });
}

/* Branche le formulaire d'ajout sur le carnet et rafraîchit la liste */
function initCarnetForm(idFormulario, idTexto, idTipo, idContenedor) {
  const form = document.getElementById(idFormulario);
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const texto = document.getElementById(idTexto).value.trim();
    const tipo = document.getElementById(idTipo).value;
    if (!texto) return;
    const boton = form.querySelector('button[type="submit"]');
    if (boton) boton.disabled = true;
    const res = await agregarEntrada(texto, tipo);
    if (boton) boton.disabled = false;
    if (!res.ok) {
      alert('Impossible d\'ajouter au carnet pour le moment — vérifie ta connexion et réessaie.');
      return;
    }
    document.getElementById(idTexto).value = '';
    renderCarnet(idContenedor);
  });
}

/* ─── Bandeau de synchronisation (numéro WhatsApp, sans mot de passe) ─── */
function initCarnetSync(idContenedorListe) {
  const wrap = document.getElementById('carnetSync');
  if (!wrap) return;

  async function afficherEtat() {
    if (!window.supabaseConfigurado) {
      wrap.innerHTML = '<p class="muted">Ce carnet est privé à cet appareil.</p>';
      return;
    }
    const tel = telefonoGuardado();
    if (tel) {
      let nombre = nombreGuardado();
      if (!nombre) nombre = await buscarYCachearNombre(tel);
      const saludo = nombre
        ? `👋 Bienvenue, <strong>${nombre}</strong> ! Ton carnet te suit sur tous tes appareils.`
        : `📱 Synchronisé avec <strong>${tel}</strong> — retrouve ton carnet sur n'importe quel appareil.`;
      wrap.innerHTML = `
        <p class="muted">${saludo}
        <button type="button" class="btn secondary" id="btnOublierTel" style="margin-left:.5rem;">Changer de numéro</button></p>`;
      document.getElementById('btnOublierTel').addEventListener('click', () => {
        olvidarTelefono();
        olvidarNombre();
        afficherEtat();
        renderCarnet(idContenedorListe);
      });
    } else {
      wrap.innerHTML = `
        <form id="formActivarSync" class="entry-form" style="margin-bottom:1.5rem;">
          <label class="muted" for="carnetTelInput" style="margin-bottom:.3rem;">Synchronise ton carnet avec ton numéro WhatsApp (facultatif — sans mot de passe) :</label>
          <input type="tel" id="carnetTelInput" placeholder="+58 412 000 0000" required>
          <button type="submit" class="btn">Activer la synchronisation</button>
        </form>`;
      document.getElementById('formActivarSync').addEventListener('submit', e => {
        e.preventDefault();
        const input = document.getElementById('carnetTelInput');
        const tel = input.value.trim();
        if (!tel) return;
        guardarTelefono(tel);
        afficherEtat();
        renderCarnet(idContenedorListe);
      });
    }
  }

  afficherEtat();
}
