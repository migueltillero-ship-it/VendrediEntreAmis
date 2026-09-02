/* ════════════════════════════════════════════════
   DATA-LOADER.JS
   Carga semaines.json una sola vez y expone helpers.
   semaines.json es la ÚNICA fuente de verdad: expressions,
   défis y culture se derivan de ahí para evitar que dos
   archivos con el mismo dato se desincronicen entre sí.
   ─────────────────────────────────────────────────
   Requiere que cada página defina antes de incluir este
   archivo: window.DATA_PATH = "data/semaines.json" (desde
   la raíz) o "../data/semaines.json" (desde pages/).
════════════════════════════════════════════════ */

const ClubData = (function () {
  let cache = null;

  async function cargar() {
    if (cache) return cache;
    const res = await fetch(window.DATA_PATH);
    cache = await res.json();
    return cache;
  }

  function porNumero(semanas, n) {
    return semanas.find(s => s.semana === n);
  }

  function todasLasExpresiones(semanas, hastaSemana) {
    const lista = [];
    semanas.filter(s => s.semana <= hastaSemana).forEach(s => {
      lista.push({ nivel: 'a1a2', fr: s.a1a2.expresion.fr, es: s.a1a2.expresion.es, semana: s.semana });
      lista.push({ nivel: 'b1b2', fr: s.b1b2.expresion.fr, es: s.b1b2.expresion.es, semana: s.semana });
    });
    return lista;
  }

  function todaLaCultura(semanas, hastaSemana) {
    return semanas.filter(s => s.semana <= hastaSemana && s.cultura);
  }

  function todosLosDefis(semanas, hastaSemana) {
    const lista = [];
    semanas.filter(s => s.semana <= hastaSemana).forEach(s => {
      lista.push({ nivel: 'a1a2', texto: s.a1a2.reto, semana: s.semana, tema: s.destino || s.tema });
      lista.push({ nivel: 'b1b2', texto: s.b1b2.reto, semana: s.semana, tema: s.destino || s.tema });
    });
    return lista;
  }

  return { cargar, porNumero, todasLasExpresiones, todaLaCultura, todosLosDefis };
})();
