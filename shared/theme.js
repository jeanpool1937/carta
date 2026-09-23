/* Apply before first paint; one preference for the whole collection. */
(() => {
  'use strict';
  const key = 'carta-appearance';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const valid = value => ['system', 'light', 'dark'].includes(value);
  let preference = 'system';
  try { const saved = localStorage.getItem(key); if (valid(saved)) preference = saved; } catch (_) {}
  let select;
  const apply = () => {
    const theme = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    root.dataset.theme = theme;
    root.dataset.appearance = preference;
    root.style.colorScheme = theme;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
    meta.content = theme === 'dark' ? '#171020' : '#f6f1ea';
    if (select) select.value = preference;
  };
  apply();
  if (system.addEventListener) system.addEventListener('change', apply);
  else system.addListener(apply);
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      preference = valid(event.newValue) ? event.newValue : 'system';
      apply();
    }
  });
  window.addEventListener('pageshow', () => {
    try { const saved = localStorage.getItem(key); preference = valid(saved) ? saved : 'system'; } catch (_) {}
    apply();
  });
  document.addEventListener('DOMContentLoaded', () => {
    const control = document.createElement('label');
    control.className = 'appearance-control';
    control.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor"/></svg><span class="appearance-sr">Apariencia</span><select aria-label="Apariencia"><option value="system">Automático</option><option value="light">Claro</option><option value="dark">Oscuro</option></select>';
    select = control.querySelector('select');
    select.value = preference;
    select.addEventListener('change', () => {
      preference = valid(select.value) ? select.value : 'system';
      try { localStorage.setItem(key, preference); } catch (_) {}
      apply();
    });
    document.body.appendChild(control);
  }, { once: true });
})();
