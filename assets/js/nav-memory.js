/**
 * nav-memory.js — Memoria de Navegación exacta (Regla UX MYNEXT)
 * - Guarda el scrollY exacto y la página de origen al entrar en páginas secundarias
 * - Al pulsar [data-nav-back] ("← Volver atrás") o al volver con el gesto de retroceso en Safari (bfcache),
 *   devuelve al usuario al píxel exacto donde estaba (sin mandarlo al inicio de la web)
 * - Si el usuario entró directo por enlace externo, usa el href de respaldo (#ancla)
 */
(() => {
  const ORIGIN_KEY = 'p7_nav_origin';
  const RESTORE_KEY = 'p7_nav_restore';
  const SUBPAGE_KEY = 'p7_nav_in_subpage';
  const SUBPAGES = ['galeria.html', 'equipo.html', 'aviso-legal.html', 'privacidad.html', 'cookies.html'];

  const currentFile = () => {
    const seg = window.location.pathname.split('/').pop();
    return seg || 'index.html';
  };

  const isSubpage = (file) => SUBPAGES.includes(file);
  const cur = currentFile();

  if (isSubpage(cur)) {
    try {
      sessionStorage.setItem(SUBPAGE_KEY, cur);
    } catch (_) {}
  }

  /* 1. Restaurar posición exacta al volver (instantáneo) */
  const restoreIfPending = () => {
    try {
      const fromSubpage = sessionStorage.getItem(SUBPAGE_KEY);
      const isPending = sessionStorage.getItem(RESTORE_KEY) === '1' || Boolean(fromSubpage);
      if (!isPending) return;

      const raw = sessionStorage.getItem(ORIGIN_KEY);
      if (!raw) return;
      const origin = JSON.parse(raw);
      if (!origin || origin.file !== cur) return;

      // Limpiar banderas
      sessionStorage.removeItem(RESTORE_KEY);
      sessionStorage.removeItem(SUBPAGE_KEY);

      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

      const targetY = Number(origin.scrollY) || 0;
      const applyScroll = () => {
        window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
      };

      applyScroll();
      requestAnimationFrame(applyScroll);
      setTimeout(applyScroll, 60);
      setTimeout(applyScroll, 200);
      setTimeout(applyScroll, 500);
    } catch (_) {}
  };

  // Restaurar de inmediato si estamos en index.html
  if (cur === 'index.html' || cur === '') {
    restoreIfPending();
    window.addEventListener('pageshow', () => {
      restoreIfPending();
    });
    window.addEventListener('load', () => {
      restoreIfPending();
    }, { once: true });
  }

  /* 2. Guardar origen exacto al salir hacia una página secundaria interna */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    // Botón explícito "← Volver atrás"
    if (link.hasAttribute('data-nav-back')) {
      try {
        const raw = sessionStorage.getItem(ORIGIN_KEY);
        if (raw) {
          const origin = JSON.parse(raw);
          if (origin && origin.url && origin.url !== window.location.href) {
            e.preventDefault();
            sessionStorage.setItem(RESTORE_KEY, '1');
            sessionStorage.removeItem(SUBPAGE_KEY);
            window.location.href = origin.url;
            return;
          }
        }
      } catch (_) {}
      // Sin origen guardado (entrada directa): deja seguir el href de respaldo (#ancla)
      return;
    }

    const href = link.getAttribute('href') || '';
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) {
      return;
    }

    const targetFile = href.split('#')[0].split('?')[0].split('/').pop() || 'index.html';
    // Si estamos saltando entre páginas legales entre sí, conservar el origen previo (footer)
    if (isSubpage(cur) && isSubpage(targetFile)) {
      return;
    }

    // Si vamos de index a una subpágina, guardar origen exacto
    if (isSubpage(targetFile)) {
      try {
        const cleanUrl = `${window.location.pathname}${window.location.search}`;
        sessionStorage.setItem(
          ORIGIN_KEY,
          JSON.stringify({
            url: cleanUrl,
            file: cur,
            scrollY: Math.round(window.scrollY),
          })
        );
      } catch (_) {}
    }
  });
})();
