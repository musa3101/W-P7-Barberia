/**
 * header.js — Comportamiento del Header P7 Barber Master Studio
 * - Transparente sobre Hero -> Cristal Carbono Oscuro a mitad del Hero (50%)
 * - Móvil y Tablet (< 1024px): StaggeredMenu lateral en capas (React Bits adaptado)
 * - Escritorio (>= 1024px): Curved Menu (21st.dev) con curva SVG elástica y letras escalonadas
 * - Bloqueo total del scroll de fondo cuando cualquier menú está abierto
 */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('p7-header');
  const toggleBtn = document.getElementById('p7-menu-toggle');
  const closeBtn = document.getElementById('p7-menu-close');
  const drawer = document.getElementById('p7-mobile-drawer');
  const closeTargets = document.querySelectorAll('[data-drawer-close]');

  const curvedRoot = document.getElementById('p7-curved-menu');
  const curvedCloseBtn = document.getElementById('p7-curved-close');
  const curvedCloseTargets = document.querySelectorAll('[data-curved-close]');
  const curvedPath = document.getElementById('p7-curved-path');

  const isTabletOrDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
  const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Estado cristal al pasar la mitad del Hero (Hero 100% limpio y sagrado) */
  const heroSection = document.getElementById('inicio');
  const getScrollThreshold = () => {
    if (heroSection && heroSection.offsetHeight > 0) {
      return Math.round(heroSection.offsetHeight * 0.5);
    }
    return Math.round(window.innerHeight * 0.5);
  };

  let scrollThreshold = getScrollThreshold();

  const syncHeaderScroll = () => {
    if (!header) return;
    if (header.dataset.alwaysScrolled === 'true') {
      header.setAttribute('data-scrolled', 'true');
      return;
    }
    const scrolled = window.scrollY >= scrollThreshold;
    header.setAttribute('data-scrolled', scrolled ? 'true' : 'false');
  };

  syncHeaderScroll();
  window.addEventListener('scroll', syncHeaderScroll, { passive: true });
  window.addEventListener('resize', () => {
    scrollThreshold = getScrollThreshold();
    syncHeaderScroll();
  }, { passive: true });

  /* 2. Reinicio de animación CSS del icono AlignCenterIcon (100% fiable en Safari iOS) */
  const replayAlignIcon = (btn) => {
    if (!btn) return;
    const svg = btn.querySelector('.p7-align-icon');
    if (!svg || prefersReduced()) return;
    svg.classList.add('is-resetting');
    void svg.getBoundingClientRect();
    svg.classList.remove('is-resetting');
  };

  /* Restauración limpia al volver por bfcache en Safari iOS */
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && toggleBtn) {
      const svg = toggleBtn.querySelector('.p7-align-icon');
      if (svg) svg.classList.remove('is-resetting');
    }
  });

  /* 3. Split de letras para animación elástica del Curved Menu (agrupado por palabras) */
  const splitCurvedTexts = () => {
    document.querySelectorAll('[data-split-text]').forEach((el) => {
      const raw = (el.textContent || '').trim();
      el.textContent = '';
      let charIdx = 0;
      raw.split(/\s+/).forEach((word) => {
        if (!word) return;
        const wordSpan = document.createElement('span');
        wordSpan.className = 'p7-curved-word';
        Array.from(word).forEach((ch) => {
          const span = document.createElement('span');
          span.className = 'p7-curved-char';
          span.style.setProperty('--char-i', String(charIdx++));
          span.textContent = ch;
          wordSpan.appendChild(span);
        });
        charIdx += 1;
        el.appendChild(wordSpan);
      });
    });
  };
  splitCurvedTexts();
  document.addEventListener('p7:langchange', splitCurvedTexts);

  /* 4. Animación SVG elástica de la curva (cubic-bezier(0.76, 0, 0.24, 1)) */
  let curveRaf = 0;

  const easeInOutQuartish = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const setCurveControlX = (ctrlX) => {
    if (!curvedPath) return;
    const h = window.innerHeight;
    curvedPath.setAttribute(
      'd',
      `M100 0 L200 0 L200 ${h} L100 ${h} Q${ctrlX} ${h / 2} 100 0`
    );
  };

  const animateCurve = (fromX, toX, durationMs) => {
    if (!curvedPath) return;
    cancelAnimationFrame(curveRaf);
    if (prefersReduced()) {
      setCurveControlX(toX);
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / durationMs);
      const eased = easeInOutQuartish(p);
      setCurveControlX(fromX + (toX - fromX) * eased);
      if (p < 1) {
        curveRaf = requestAnimationFrame(tick);
      }
    };
    curveRaf = requestAnimationFrame(tick);
  };

  setCurveControlX(-100);

  /* 5. Congelación estricta del fondo (delegado a P7ScrollLock con fallback iOS) */
  let isAnyMenuOpen = false;
  let savedScrollY = 0;
  let fallbackThemeColor = null;

  const preventBackgroundScroll = (e) => {
    if (!isAnyMenuOpen) return;
    if (window.P7ScrollLock) return;
    const insideMenu =
      e.target.closest('#p7-mobile-drawer .p7-drawer-sheet') ||
      e.target.closest('#p7-curved-menu .p7-curved-panel');
    if (!insideMenu) {
      e.preventDefault();
    }
  };

  window.addEventListener('wheel', preventBackgroundScroll, { passive: false });
  window.addEventListener('touchmove', preventBackgroundScroll, { passive: false });

  const lockBodyScroll = (lock) => {
    if (lock === isAnyMenuOpen) return;
    isAnyMenuOpen = lock;

    if (window.P7ScrollLock) {
      if (lock) {
        window.P7ScrollLock.lock();
      } else {
        window.P7ScrollLock.unlock();
      }
      return;
    }

    if (lock) {
      savedScrollY = window.scrollY || window.pageYOffset || 0;
      document.documentElement.classList.add('p7-scroll-locked');
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.classList.remove('p7-scroll-locked');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo({ top: savedScrollY, behavior: 'instant' });
    }
  };

  const setDrawerThemeColor = (open) => {
    if (window.P7ThemeColor) {
      if (open) {
        window.P7ThemeColor.setOverride('#C1091E');
      } else {
        window.P7ThemeColor.clearOverride();
      }
      return;
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    if (open) {
      fallbackThemeColor = meta.getAttribute('content') || '#0A0909';
      meta.setAttribute('content', '#C1091E');
    } else if (fallbackThemeColor !== null) {
      meta.setAttribute('content', fallbackThemeColor);
      fallbackThemeColor = null;
    }
  };

  /* 6. Estado del menú móvil (< 1024px) */
  let isMobileOpen = false;

  const setMobileState = (open) => {
    if (!drawer || !toggleBtn || isMobileOpen === open) return;
    isMobileOpen = open;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    toggleBtn.setAttribute('aria-expanded', String(open));
    lockBodyScroll(open);
    setDrawerThemeColor(open);

    if (open && closeBtn) {
      replayAlignIcon(closeBtn);
      window.setTimeout(() => closeBtn.focus(), 120);
    } else if (!open) {
      replayAlignIcon(toggleBtn);
      toggleBtn.focus();
    }
  };

  /* 7. Estado del Curved Menu (>= 1024px) */
  let isCurvedOpen = false;

  const setCurvedState = (open) => {
    if (!curvedRoot || !toggleBtn || isCurvedOpen === open) return;
    isCurvedOpen = open;
    curvedRoot.classList.toggle('is-open', open);
    curvedRoot.setAttribute('aria-hidden', String(!open));
    toggleBtn.setAttribute('aria-expanded', String(open));
    lockBodyScroll(open);

    if (open) {
      animateCurve(-100, 100, 950);
      if (curvedCloseBtn) {
        replayAlignIcon(curvedCloseBtn);
        window.setTimeout(() => curvedCloseBtn.focus(), 200);
      }
    } else {
      animateCurve(100, -100, 760);
      replayAlignIcon(toggleBtn);
      toggleBtn.focus();
    }
  };

  /* 8. Eventos de apertura / cierre (StaggeredMenu unificado en móvil, tablet y ordenador) */
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      setMobileState(!isMobileOpen);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => setMobileState(false));
  }

  if (curvedCloseBtn) {
    curvedCloseBtn.addEventListener('click', () => setCurvedState(false));
  }

  closeTargets.forEach((el) => {
    el.addEventListener('click', () => {
      if (isMobileOpen) setMobileState(false);
    });
  });

  curvedCloseTargets.forEach((el) => {
    el.addEventListener('click', () => {
      if (isCurvedOpen) setCurvedState(false);
    });
  });

  /* 9. Selector de idioma desplegable horizontal hacia la izquierda (Tablet & Ordenador >= 768px) */
  const headerActions = header ? header.querySelector('.p7-header-actions') : null;
  let langWrap = null;
  let langTrigger = null;
  let langCurrent = null;

  const setLangMenuOpen = (open) => {
    if (!langWrap || !langTrigger) return;
    langWrap.classList.toggle('is-open', open);
    langTrigger.setAttribute('aria-expanded', String(open));
  };

  const syncHeaderLangLabel = (langCode) => {
    const code = (
      langCode ||
      (window.P7I18n && typeof window.P7I18n.getLang === 'function' ? window.P7I18n.getLang() : null) ||
      document.documentElement.getAttribute('lang') ||
      'es'
    ).toUpperCase().slice(0, 2);
    if (langCurrent) langCurrent.textContent = code;
    if (langWrap) {
      langWrap.querySelectorAll('.p7-hdr-lang-opt').forEach((opt) => {
        const match = (opt.getAttribute('data-lang') || '').toUpperCase() === code;
        opt.classList.toggle('is-active', match);
        if (match) opt.setAttribute('aria-current', 'true');
        else opt.removeAttribute('aria-current');
      });
    }
  };

  if (headerActions && toggleBtn && !headerActions.querySelector('[data-lang-menu]')) {
    langWrap = document.createElement('div');
    langWrap.className = 'p7-hdr-lang';
    langWrap.setAttribute('data-lang-menu', '');
    langWrap.innerHTML =
      '<div class="p7-hdr-lang-panel" role="group" aria-label="Idioma">' +
        '<button type="button" class="p7-hdr-lang-opt" data-lang="es">ES</button>' +
        '<button type="button" class="p7-hdr-lang-opt" data-lang="en">EN</button>' +
        '<button type="button" class="p7-hdr-lang-opt" data-lang="de">DE</button>' +
      '</div>' +
      '<button type="button" class="p7-hdr-lang-trigger" aria-expanded="false" aria-label="Cambiar idioma">' +
        '<span class="p7-hdr-lang-current">ES</span>' +
      '</button>';

    headerActions.insertBefore(langWrap, toggleBtn);
    langTrigger = langWrap.querySelector('.p7-hdr-lang-trigger');
    langCurrent = langWrap.querySelector('.p7-hdr-lang-current');
    syncHeaderLangLabel();

    langTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !langWrap.classList.contains('is-open');
      setLangMenuOpen(willOpen);
    });

    langWrap.querySelectorAll('.p7-hdr-lang-opt').forEach((opt) => {
      opt.addEventListener('click', () => {
        const chosen = opt.getAttribute('data-lang');
        syncHeaderLangLabel(chosen);
        setLangMenuOpen(false);
      });
    });

    document.addEventListener('click', (e) => {
      if (langWrap && langWrap.classList.contains('is-open') && !langWrap.contains(e.target)) {
        setLangMenuOpen(false);
      }
    });

    document.addEventListener('p7:langchange', (e) => {
      syncHeaderLangLabel(e && e.detail ? e.detail.lang : null);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (isMobileOpen) setMobileState(false);
      if (isCurvedOpen) setCurvedState(false);
      setLangMenuOpen(false);
    }
  });
});
