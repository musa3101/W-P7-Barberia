/**
 * nav-memory.js — Memoria de Navegación exacta (Regla UX MYNEXT)
 * - Guarda el scrollY exacto y la página de origen al entrar en páginas secundarias
 * - Al pulsar [data-nav-back] ("← Volver atrás"), devuelve al usuario en 1 toque
 *   al píxel exacto donde estaba (sin mandarlo al inicio de la web)
 * - Si el usuario entró directo por enlace externo, usa el href de respaldo (#ancla)
 */
(() => {
  const ORIGIN_KEY = 'p7_nav_origin';
  const RESTORE_KEY = 'p7_nav_restore';
  const LEGAL_PAGES = ['aviso-legal.html', 'privacidad.html', 'cookies.html'];

  const currentFile = () => {
    const seg = window.location.pathname.split('/').pop();
    return seg || 'index.html';
  };

  const isLegalPage = (file) => LEGAL_PAGES.includes(file);

  /* 1. Restaurar posición exacta al volver (sin salto ni animación lenta) */
  const restoreIfPending = () => {
    try {
      if (sessionStorage.getItem(RESTORE_KEY) !== '1') return;
      const raw = sessionStorage.getItem(ORIGIN_KEY);
      if (!raw) return;
      const origin = JSON.parse(raw);
      if (!origin || origin.file !== currentFile()) return;

      sessionStorage.removeItem(RESTORE_KEY);
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

      const targetY = Number(origin.scrollY) || 0;
      const applyScroll = () => {
        window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
      };

      applyScroll();
      requestAnimationFrame(applyScroll);
      window.addEventListener('load', () => {
        applyScroll();
        window.setTimeout(applyScroll, 60);
      }, { once: true });
    } catch (_) {}
  };

  restoreIfPending();

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

    // Si estamos saltando entre páginas legales entre sí, conservar el origen previo (footer)
    const fromFile = currentFile();
    const targetFile = href.split('#')[0].split('?')[0].split('/').pop() || 'index.html';
    if (isLegalPage(fromFile) && isLegalPage(targetFile)) {
      return;
    }

    // Guardar origen exacto antes de salir hacia la página secundaria
    try {
      const cleanUrl = `${window.location.pathname}${window.location.search}`;
      sessionStorage.setItem(
        ORIGIN_KEY,
        JSON.stringify({
          url: cleanUrl,
          file: fromFile,
          scrollY: Math.round(window.scrollY),
        })
      );
    } catch (_) {}
  });
})();
