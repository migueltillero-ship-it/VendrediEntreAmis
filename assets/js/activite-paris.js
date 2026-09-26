/* ════════════════════════════════════════════════
   ACTIVITE-PARIS.JS — Classe les monuments de Paris (Semaine 1)
   Widget bespoke : l'étudiant compose son Top 10 en cliquant sur des
   monuments (banque de 20), réordonne avec les flèches, et enregistre
   le résultat dans son Carnet de Voyage (assets/js/carnet.js).
════════════════════════════════════════════════ */
const MONUMENTS_PARIS = [
  { id: 'eiffel', nom: 'Tour Eiffel', icone: 'fa-monument' },
  { id: 'louvre', nom: 'Musée du Louvre', icone: 'fa-palette' },
  { id: 'notredame', nom: 'Cathédrale Notre-Dame', icone: 'fa-church' },
  { id: 'arc', nom: 'Arc de Triomphe', icone: 'fa-archway' },
  { id: 'sacrecoeur', nom: 'Basilique du Sacré-Cœur', icone: 'fa-place-of-worship' },
  { id: 'saintechapelle', nom: 'Sainte-Chapelle', icone: 'fa-gem' },
  { id: 'pantheon', nom: 'Panthéon', icone: 'fa-building-columns' },
  { id: 'orsay', nom: "Musée d'Orsay", icone: 'fa-clock' },
  { id: 'garnier', nom: 'Palais Garnier (Opéra)', icone: 'fa-masks-theater' },
  { id: 'concorde', nom: 'Place de la Concorde', icone: 'fa-chess-rook' },
  { id: 'luxembourg', nom: 'Jardin du Luxembourg', icone: 'fa-tree' },
  { id: 'versailles', nom: 'Château de Versailles', icone: 'fa-crown' },
  { id: 'pompidou', nom: 'Centre Pompidou', icone: 'fa-shapes' },
  { id: 'invalides', nom: 'Les Invalides', icone: 'fa-shield-halved' },
  { id: 'alexandre3', nom: 'Pont Alexandre III', icone: 'fa-bridge' },
  { id: 'champs', nom: 'Avenue des Champs-Élysées', icone: 'fa-road' },
  { id: 'vendome', nom: 'Place Vendôme', icone: 'fa-ring' },
  { id: 'perelachaise', nom: 'Cimetière du Père Lachaise', icone: 'fa-leaf' },
  { id: 'conciergerie', nom: 'La Conciergerie', icone: 'fa-landmark' },
  { id: 'defense', nom: 'La Grande Arche de la Défense', icone: 'fa-cube' },
];

(function () {
  const STORAGE_KEY = 'vea-classement-paris-semaine1';
  const banque = document.getElementById('paris-banque');
  const liste = document.getElementById('paris-classement');
  const btnEnregistrer = document.getElementById('paris-enregistrer');
  const statut = document.getElementById('paris-statut');
  if (!banque || !liste || !btnEnregistrer) return;

  let classement = [];
  try { classement = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { classement = []; }

  function sauvegarder() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classement));
  }

  function render() {
    liste.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const id = classement[i];
      const mon = MONUMENTS_PARIS.find(m => m.id === id);
      const li = document.createElement('li');
      li.style.cssText = 'display:flex; align-items:center; gap:0.7rem; background:rgba(0,0,0,0.3); border:1px solid var(--line); border-radius:8px; padding:0.6rem 0.8rem; min-height:3rem;';
      if (mon) {
        li.innerHTML = `
          <span style="font-family:'Syne'; font-weight:700; color:var(--gold); width:1.4rem; flex-shrink:0;">${i + 1}</span>
          <i class="fa-solid ${mon.icone}" style="color:var(--gold-claro); width:1.2rem; text-align:center; flex-shrink:0;"></i>
          <span style="flex:1;">${mon.nom}</span>
          <button type="button" data-monter="${i}" ${i === 0 ? 'disabled' : ''} style="background:none; border:none; color:rgba(255,255,255,${i === 0 ? '0.25' : '0.6'}); cursor:${i === 0 ? 'default' : 'pointer'};" title="Monter" aria-label="Monter ${mon.nom}"><i class="fa-solid fa-chevron-up"></i></button>
          <button type="button" data-descendre="${i}" ${i === classement.length - 1 ? 'disabled' : ''} style="background:none; border:none; color:rgba(255,255,255,${i === classement.length - 1 ? '0.25' : '0.6'}); cursor:${i === classement.length - 1 ? 'default' : 'pointer'};" title="Descendre" aria-label="Descendre ${mon.nom}"><i class="fa-solid fa-chevron-down"></i></button>
          <button type="button" data-retirer="${mon.id}" style="background:none; border:none; color:rgba(255,255,255,0.6); cursor:pointer;" title="Retirer" aria-label="Retirer ${mon.nom}"><i class="fa-solid fa-xmark"></i></button>
        `;
      } else {
        li.innerHTML = `<span style="font-family:'Syne'; font-weight:700; color:rgba(255,255,255,0.35); width:1.4rem;">${i + 1}</span><span style="color:rgba(255,255,255,0.4); font-style:italic;">— à compléter —</span>`;
      }
      liste.appendChild(li);
    }

    banque.innerHTML = '';
    MONUMENTS_PARIS.forEach(m => {
      const dejaChoisi = classement.includes(m.id);
      const plein = classement.length >= 10;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.disabled = dejaChoisi || plein;
      btn.style.cssText = `display:flex; flex-direction:column; align-items:center; gap:0.5rem; padding:1rem 0.6rem; background:${dejaChoisi ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)'}; border:1px solid var(--line); border-radius:8px; color:#fff; font-family:'Syne',sans-serif; font-size:0.82rem; text-align:center; cursor:${dejaChoisi || plein ? 'default' : 'pointer'}; opacity:${dejaChoisi ? '0.35' : '1'};`;
      btn.innerHTML = `<i class="fa-solid ${m.icone}" style="font-size:1.4rem; color:var(--gold-claro);"></i><span>${m.nom}</span>`;
      if (!dejaChoisi && !plein) {
        btn.addEventListener('click', () => {
          classement.push(m.id);
          sauvegarder();
          render();
        });
      }
      banque.appendChild(btn);
    });

    liste.querySelectorAll('[data-retirer]').forEach(btn => {
      btn.addEventListener('click', () => {
        classement = classement.filter(id => id !== btn.dataset.retirer);
        sauvegarder();
        render();
      });
    });
    liste.querySelectorAll('[data-monter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.monter);
        if (i > 0) {
          [classement[i - 1], classement[i]] = [classement[i], classement[i - 1]];
          sauvegarder();
          render();
        }
      });
    });
    liste.querySelectorAll('[data-descendre]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.descendre);
        if (i < classement.length - 1) {
          [classement[i + 1], classement[i]] = [classement[i], classement[i + 1]];
          sauvegarder();
          render();
        }
      });
    });

    const complet = classement.length === 10;
    btnEnregistrer.disabled = !complet;
    btnEnregistrer.style.opacity = complet ? '1' : '0.5';
    statut.textContent = complet ? '' : `${classement.length} / 10 sélectionnés`;
  }

  btnEnregistrer.addEventListener('click', () => {
    const texte = classement.map((id, i) => {
      const mon = MONUMENTS_PARIS.find(m => m.id === id);
      return `${i + 1}. ${mon.nom}`;
    }).join('\n');
    if (typeof agregarAlCarnet === 'function') {
      agregarAlCarnet(`Mon Top 10 des monuments de Paris :\n${texte}`, 'Activité Semaine 1');
    } else {
      alert("Le Carnet n'a pas pu être contacté — réessaie dans un instant.");
    }
  });

  render();
})();
