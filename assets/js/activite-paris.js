/* ════════════════════════════════════════════════
   ACTIVITE-PARIS.JS — Classe les monuments de Paris (Semaine 1)
   Widget bespoke : l'étudiant compose son Top 10 en cliquant sur des
   monuments (banque de 20, avec photo Wikimedia Commons), réordonne
   avec les flèches, et enregistre le résultat dans son Carnet de
   Voyage (assets/js/carnet.js).

   Les photos viennent de Wikimedia Commons via Special:FilePath (pas
   besoin de connaître le chemin haché de l'image) ; si une photo ne
   charge pas, la carte retombe automatiquement sur son icône Font
   Awesome (voir onerror plus bas), pour ne jamais afficher une image
   cassée.
════════════════════════════════════════════════ */
const MONUMENTS_PARIS = [
  { id: 'eiffel', nom: 'Tour Eiffel', icone: 'fa-monument', photo: 'Eiffel tower paris france.jpg' },
  { id: 'louvre', nom: 'Musée du Louvre', icone: 'fa-palette', photo: 'La Pyramide du Louvre.JPG' },
  { id: 'notredame', nom: 'Cathédrale Notre-Dame', icone: 'fa-church', photo: 'Notre Dame Cathedral.jpeg' },
  { id: 'arc', nom: 'Arc de Triomphe', icone: 'fa-archway', photo: 'Paris Arc de Triomphe.jpg' },
  { id: 'sacrecoeur', nom: 'Basilique du Sacré-Cœur', icone: 'fa-place-of-worship', photo: 'Basilika Sacre-Coeur de Montmartre- Paris.jpg' },
  { id: 'saintechapelle', nom: 'Sainte-Chapelle', icone: 'fa-gem', photo: 'La-Sainte-Chapelle-interior.jpg' },
  { id: 'pantheon', nom: 'Panthéon', icone: 'fa-building-columns', photo: 'Pantheon - Paris.jpg' },
  { id: 'orsay', nom: "Musée d'Orsay", icone: 'fa-clock', photo: "Musee d'Orsay Clock Face.jpg" },
  { id: 'garnier', nom: 'Palais Garnier (Opéra)', icone: 'fa-masks-theater', photo: '3849ParigiOperaGarnier.JPG' },
  { id: 'concorde', nom: 'Place de la Concorde', icone: 'fa-chess-rook', photo: 'Obelisk in Place de la Concorde, Paris.JPG' },
  { id: 'luxembourg', nom: 'Jardin du Luxembourg', icone: 'fa-tree', photo: 'Jardin du Luxembourg.JPG' },
  { id: 'versailles', nom: 'Château de Versailles', icone: 'fa-crown', photo: 'Versailles Palace.jpg' },
  { id: 'pompidou', nom: 'Centre Pompidou', icone: 'fa-shapes', photo: 'Pompidou Center Paris.jpg' },
  { id: 'invalides', nom: 'Les Invalides', icone: 'fa-shield-halved', photo: 'Paris - Le Dôme des Invalides - 109.jpg' },
  { id: 'alexandre3', nom: 'Pont Alexandre III', icone: 'fa-bridge', photo: 'Le pont Alexandre III, Alexander III bridge Paris 7.JPG' },
  { id: 'champs', nom: 'Avenue des Champs-Élysées', icone: 'fa-road', photo: 'Champs Elysees Paris Wikimedia Commons.jpg' },
  { id: 'vendome', nom: 'Place Vendôme', icone: 'fa-ring', photo: 'The Place Vendôme Column-Paris.jpg' },
  { id: 'perelachaise', nom: 'Cimetière du Père Lachaise', icone: 'fa-leaf', photo: 'Cimetière du Père-Lachaise, Paris, France.jpg' },
  { id: 'conciergerie', nom: 'La Conciergerie', icone: 'fa-landmark', photo: 'Conciergerie Paris.jpg' },
  { id: 'defense', nom: 'La Grande Arche de la Défense', icone: 'fa-cube', photo: 'La Grande arche.jpg' },
];

function urlPhotoParis(nomFichier, largeur) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(nomFichier.replace(/ /g, '_'))}?width=${largeur}`;
}

function vignetteMonument(m, taille) {
  return `
    <span style="position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden; background:rgba(255,255,255,0.05); border-radius:6px; width:${taille}; height:${taille}; flex-shrink:0;">
      <img src="${urlPhotoParis(m.photo, 200)}" alt="" loading="lazy" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <i class="fa-solid ${m.icone}" style="display:none; align-items:center; justify-content:center; font-size:1.3rem; color:var(--gold-claro); position:absolute; inset:0;"></i>
    </span>
  `;
}

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
      li.style.cssText = 'display:flex; align-items:center; gap:0.7rem; background:rgba(0,0,0,0.3); border:1px solid var(--line); border-radius:8px; padding:0.5rem 0.8rem; min-height:3.5rem;';
      if (mon) {
        li.innerHTML = `
          <span style="font-family:'Syne'; font-weight:700; color:var(--gold); width:1.4rem; flex-shrink:0;">${i + 1}</span>
          ${vignetteMonument(mon, '2.6rem')}
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
      btn.style.cssText = `display:flex; flex-direction:column; align-items:center; gap:0.6rem; padding:0.8rem; background:${dejaChoisi ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)'}; border:1px solid var(--line); border-radius:8px; color:#fff; font-family:'Syne',sans-serif; font-size:0.82rem; text-align:center; cursor:${dejaChoisi || plein ? 'default' : 'pointer'}; opacity:${dejaChoisi ? '0.35' : '1'};`;
      btn.innerHTML = `
        <span style="position:relative; display:block; overflow:hidden; background:rgba(255,255,255,0.05); border-radius:6px; width:100%; aspect-ratio:4/3;">
          <img src="${urlPhotoParis(m.photo, 300)}" alt="" loading="lazy" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <i class="fa-solid ${m.icone}" style="display:none; align-items:center; justify-content:center; font-size:1.8rem; color:var(--gold-claro); position:absolute; inset:0;"></i>
        </span>
        <span>${m.nom}</span>
      `;
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
