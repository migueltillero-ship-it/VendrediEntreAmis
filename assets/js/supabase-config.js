/**
 * Configuración del cliente de Supabase — Carnet de Voyage.
 *
 * Usa el MISMO proyecto Supabase que la plataforma docente/estudiantil de
 * migueltillero-ship-it/MiguelTillero (assets/js/supabase-config.js allí).
 * La "publishable key" es pública por diseño (no es un secreto: la
 * protección real vive en las políticas RLS y funciones del lado del
 * servidor — ver supabase/carnet-vendredi-entre-amis.sql en ese repo).
 *
 * Este archivo debe cargarse DESPUÉS del script del CDN de supabase-js:
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
 *   <script src="../assets/js/supabase-config.js"></script>
 */
const SUPABASE_URL = 'https://yfrdlzveleevkjqekdoq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_KrCwsrcn0Y6tQ6oqYNBObg_droR0ta3';

/* On attache explicitement à window : d'autres scripts chargés séparément
   (carnet.js) en dépendent, et un `const`/`let` de premier niveau ne
   devient PAS une propriété de window (contrairement à `var`). */
window.supabaseClient = null;
if (window.supabase) {
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/* Si le CDN n'a pas chargé (connexion coupée, bloqueur de pub...), les
   pages doivent afficher leur propre message plutôt que d'appeler un
   client qui n'existe pas. */
window.supabaseConfigurado = window.supabaseClient !== null;
