/**
 * header.js — Comportamiento del Header P7 Barber Master Studio
 * - Transparente sobre Hero -> Cristal Carbono Oscuro a mitad del Hero (50%)
 * - Móvil (< 768px): Menú pantalla completa editorial en carbono
 * - Tablet / Escritorio (>= 768px): Curved Menu (21st.dev) con curva SVG elástica y letras escalonadas
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

  const isTabletOrDesktop = () => window.matchMedia('(min-width: 768px)').matches;
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

  /* 2. Reinicio de animación SVG AlignCenterIcon */
  const replayAlignIcon = (btn) => {
    if (!btn) return;
    const svg = btn.querySelector('.p7-align-icon');
    if (!svg) return;
    if (typeof svg.setCurrentTime === 'function') {
      svg.setCurrentTime(0);
    }
    svg.querySelectorAll('animate').forEach((anim) => {
      if (typeof anim.beginElement === 'function') {
        const begin = anim.getAttribute('begin');
        if (!begin) {
          anim.beginElement();
        } else {
          const delayMs = parseFloat(begin) * 1000;
          window.setTimeout(() => {
            if (typeof anim.beginElement === 'function') anim.beginElement();
          }, delayMs);
        }
      }
    });
  };

  /* 3. Split de letras para animación elástica del Curved Menu */
  document.querySelectorAll('[data-split-text]').forEach((el) => {
    const raw = el.textContent || '';
    el.textContent = '';
    Array.from(raw).forEach((ch, idx) => {
      const span = document.createElement('span');
      span.className = 'p7-curved-char';
      span.style.setProperty('--char-i', String(idx));
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      el.appendChild(span);
    });
  });

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

  /* 5. Congelación estricta del fondo (móvil, tablet y ordenador) */
  let isAnyMenuOpen = false;
  let savedScrollY = 0;

  const preventBackgroundScroll = (e) => {
    if (!isAnyMenuOpen) return;
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
    isAnyMenuOpen = lock;
    if (lock) {
      savedScrollY = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    }
  };

  /* 6. Estado del menú móvil (< 768px) */
  let isMobileOpen = false;

  const setMobileState = (open) => {
    if (!drawer || !toggleBtn) return;
    isMobileOpen = open;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    toggleBtn.setAttribute('aria-expanded', String(open));
    lockBodyScroll(open);

    if (open && closeBtn) {
      replayAlignIcon(closeBtn);
      window.setTimeout(() => closeBtn.focus(), 120);
    } else if (!open) {
      replayAlignIcon(toggleBtn);
      toggleBtn.focus();
    }
  };

  /* 7. Estado del Curved Menu (>= 768px) */
  let isCurvedOpen = false;

  const setCurvedState = (open) => {
    if (!curvedRoot || !toggleBtn) return;
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

  /* 8. Eventos de apertura / cierre */
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (isTabletOrDesktop()) {
        setCurvedState(!isCurvedOpen);
      } else {
        setMobileState(!isMobileOpen);
      }
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (isMobileOpen) setMobileState(false);
      if (isCurvedOpen) setCurvedState(false);
    }
  });

  window.addEventListener('resize', () => {
    if (isMobileOpen && isTabletOrDesktop()) setMobileState(false);
    if (isCurvedOpen && !isTabletOrDesktop()) setCurvedState(false);
    if (isCurvedOpen) setCurveControlX(100);
  });
});
