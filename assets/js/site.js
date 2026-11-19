/**
 * P7 Barber Master Studio — Interactividad Ligera (v1)
 * Cero dependencias pesadas. Respeta prefers-reduced-motion y WCAG 2.2.2.
 */
(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js-ready');

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = () => motionQuery.matches;

  /* ------------------------------------------------------------------------
     1. Header sólido al hacer scroll > 40px + Barra de progreso 2:1:1
     ------------------------------------------------------------------------ */
  const header = document.getElementById('site-header');
  const progressBar = document.getElementById('scroll-progress');
  let scrollTicking = false;

  const updateScrollUI = () => {
    scrollTicking = false;
    const y = window.scrollY || window.pageYOffset || 0;

    if (header) {
      header.classList.toggle('is-scrolled', y > 40);
    }

    if (progressBar) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0;
      progressBar.style.transform = `scaleX(${ratio})`;
    }
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateScrollUI);
      }
    },
    { passive: true }
  );
  updateScrollUI();

  /* ------------------------------------------------------------------------
     2. Vídeo Hero + Fallback Ken Burns + Botón WCAG 2.2.2 + Reduced Motion
     ------------------------------------------------------------------------ */
  const heroVideo = document.getElementById('hero-video');
  const heroPoster = document.querySelector('.hero-poster-media');
  const videoToggle = document.getElementById('hero-video-toggle');
  let userPaused = false;
  let videoAvailable = false;

  const syncToggleUI = (isPlaying) => {
    if (!videoToggle) return;
    videoToggle.setAttribute('aria-pressed', String(!isPlaying));
    videoToggle.textContent = isPlaying ? 'Pausar ambiente' : 'Reproducir ambiente';
  };

  const applyMediaMotionState = () => {
    const shouldPlay = !prefersReducedMotion() && !userPaused;

    if (heroVideo) {
      if (!shouldPlay) {
        heroVideo.removeAttribute('autoplay');
        heroVideo.pause();
      } else if (videoAvailable) {
        heroVideo.setAttribute('autoplay', '');
        const p = heroVideo.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
    }

    if (heroPoster) {
      heroPoster.classList.toggle('is-ken-burns', shouldPlay);
    }

    syncToggleUI(shouldPlay);
  };

  if (heroVideo) {
    const markVideoUnavailable = () => {
      videoAvailable = false;
      heroVideo.classList.add('is-unavailable');
      heroVideo.pause();
      applyMediaMotionState();
    };

    const markVideoAvailable = () => {
      videoAvailable = true;
      heroVideo.classList.remove('is-unavailable');
      applyMediaMotionState();
    };

    heroVideo.addEventListener('loadeddata', markVideoAvailable, { once: true });
    heroVideo.addEventListener('error', markVideoUnavailable);

    const sources = heroVideo.querySelectorAll('source');
    let failedSources = 0;
    sources.forEach((src) => {
      src.addEventListener('error', () => {
        failedSources += 1;
        if (failedSources >= sources.length) {
          markVideoUnavailable();
        }
      });
    });

    // Si tras cargar el DOM no hay fuente válida, mantiene el póster Ken Burns
    if (heroVideo.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      markVideoUnavailable();
    }
  }

  if (videoToggle) {
    videoToggle.addEventListener('click', () => {
      userPaused = !userPaused;
      applyMediaMotionState();
    });
  }

  motionQuery.addEventListener('change', applyMediaMotionState);
  applyMediaMotionState();

  /* ------------------------------------------------------------------------
     3. IntersectionObserver: [data-reveal] y .separador-sastreria
     ------------------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll('[data-reveal], .separador-sastreria');

  if (revealTargets.length > 0) {
    if ('IntersectionObserver' in window && !prefersReducedMotion()) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
      );

      revealTargets.forEach((el) => revealObserver.observe(el));
    } else {
      revealTargets.forEach((el) => el.classList.add('is-visible'));
    }
  }

  /* ------------------------------------------------------------------------
     4. Parallax suave (±20px) en [data-parallax] solo con no-preference
     ------------------------------------------------------------------------ */
  const parallaxItems = document.querySelectorAll('[data-parallax]');
  let parallaxTicking = false;

  const updateParallax = () => {
    parallaxTicking = false;
    if (prefersReducedMotion() || parallaxItems.length === 0) return;

    const vh = window.innerHeight || 1;
    parallaxItems.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
      const shift = Math.max(-20, Math.min(20, centerOffset * -40));
      el.style.setProperty('--parallax-y', `${shift.toFixed(2)}px`);
    });
  };

  if (parallaxItems.length > 0) {
    const resetParallax = () => {
      parallaxItems.forEach((el) => {
        el.style.removeProperty('--parallax-y');
        el.style.transform = '';
      });
    };

    const onScrollParallax = () => {
      if (!parallaxTicking) {
        parallaxTicking = true;
        window.requestAnimationFrame(updateParallax);
      }
    };

    if (!prefersReducedMotion()) {
      window.addEventListener('scroll', onScrollParallax, { passive: true });
      updateParallax();
    }

    motionQuery.addEventListener('change', (e) => {
      if (e.matches) {
        resetParallax();
      } else {
        window.addEventListener('scroll', onScrollParallax, { passive: true });
        updateParallax();
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. Menú Móvil 100dvh
     ------------------------------------------------------------------------ */
  const menuOverlay = document.getElementById('mobile-menu');
  const menuOpenBtn = document.getElementById('mobile-menu-open');
  const menuCloseBtn = document.getElementById('mobile-menu-close');

  const closeMobileMenu = () => {
    if (!menuOverlay || menuOverlay.hidden) return;
    menuOverlay.classList.remove('is-open');
    menuOverlay.hidden = true;
    if (menuOpenBtn) {
      menuOpenBtn.setAttribute('aria-expanded', 'false');
      menuOpenBtn.focus();
    }
  };

  const openMobileMenu = () => {
    if (!menuOverlay) return;
    menuOverlay.hidden = false;
    window.requestAnimationFrame(() => {
      menuOverlay.classList.add('is-open');
    });
    if (menuOpenBtn) menuOpenBtn.setAttribute('aria-expanded', 'true');
    if (menuCloseBtn) menuCloseBtn.focus();
  };

  if (menuOpenBtn) menuOpenBtn.addEventListener('click', openMobileMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMobileMenu);

  if (menuOverlay) {
    menuOverlay.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
    document.addEventListener('keydown', (e) => {
      if (menuOverlay.hidden) return;
      if (e.key === 'Escape') {
        closeMobileMenu();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = Array.from(
          menuOverlay.querySelectorAll('a[href], button:not([disabled])')
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. Filtros de Galería (#nuestro-trabajo)
     ------------------------------------------------------------------------ */
  const gallerySection = document.getElementById('nuestro-trabajo');
  if (gallerySection) {
    const filterButtons = gallerySection.querySelectorAll('[data-filter]');
    const galleryItems = gallerySection.querySelectorAll('[data-category]');

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-filter') || 'todos';
        filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        galleryItems.forEach((item) => {
          const cat = item.getAttribute('data-category');
          item.hidden = target !== 'todos' && cat !== target;
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. Selector de Reseñas (#resenas)
     ------------------------------------------------------------------------ */
  const reviewsSection = document.getElementById('resenas');
  if (reviewsSection) {
    const reviewButtons = reviewsSection.querySelectorAll('[data-review-index]');
    const reviewPanels = reviewsSection.querySelectorAll('[data-review-panel]');

    reviewButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-review-index');
        reviewButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        reviewPanels.forEach((panel) => {
          panel.hidden = panel.getAttribute('data-review-panel') !== idx;
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. Diálogos nativos (<dialog>) + Fallback completo closedby="any"
     ------------------------------------------------------------------------ */
  const setupLightDismissFallback = (dialog) => {
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    let pointerStartedOutside = false;
    const isOutside = (e) => {
      const rect = dialog.getBoundingClientRect();
      return (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      );
    };

    dialog.addEventListener('pointerdown', (e) => {
      pointerStartedOutside = isOutside(e);
    });

    dialog.addEventListener('pointerup', (e) => {
      if (pointerStartedOutside && isOutside(e)) {
        dialog.close('backdrop');
      }
      pointerStartedOutside = false;
    });
  };

  const initDialog = (dialog) => {
    if (!dialog) return;
    setupLightDismissFallback(dialog);

    dialog.addEventListener('close', () => {
      // Leer returnValue si hace falta y resetearlo inmediatamente
      const _returnValue = dialog.returnValue;
      dialog.returnValue = '';
    });

    dialog.querySelectorAll('[data-dialog-close]').forEach((btn) => {
      btn.addEventListener('click', () => dialog.close('close-button'));
    });
  };

  // Lightbox
  const lightboxDialog = document.getElementById('lightbox-dialog');
  initDialog(lightboxDialog);

  if (lightboxDialog) {
    const lbImg = document.getElementById('lightbox-image');
    const lbTitle = document.getElementById('lightbox-title');
    const lbCat = document.getElementById('lightbox-category');

    document.querySelectorAll('[data-lightbox-src]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        if (lbImg) {
          lbImg.src = trigger.getAttribute('data-lightbox-src') || '';
          lbImg.alt = trigger.getAttribute('data-lightbox-title') || '';
        }
        if (lbTitle) lbTitle.textContent = trigger.getAttribute('data-lightbox-title') || '';
        if (lbCat) {
          const cat = trigger.getAttribute('data-lightbox-cat') || '';
          lbCat.textContent = cat;
          lbCat.hidden = !cat;
        }
        lightboxDialog.showModal();
      });
    });
  }

  // Legal Dialog
  const legalDialog = document.getElementById('legal-dialog');
  initDialog(legalDialog);

  const LEGAL_CONTENT = {
    aviso: {
      title: 'Aviso Legal',
      body: '<p><strong>P7 Barber Master Studio</strong><br>Dirección: C/ Miguel Ángel Riera, 2 — 07004 Palma de Mallorca, Illes Balears.<br>Actividad: Servicios de barbería artesanal y cuidado masculino bajo cita previa.</p>'
    },
    privacidad: {
      title: 'Política de Privacidad',
      body: '<p>Esta web informativa no recopila datos personales mediante formularios propios. Las reservas se gestionan directamente en las plataformas externas autorizadas (Booksy y Setmore) bajo sus respectivas políticas de privacidad.</p>'
    },
    cookies: {
      title: 'Política de Cookies',
      body: '<p>Este sitio web no utiliza cookies publicitarias ni de seguimiento de terceros. Únicamente se emplean recursos técnicos esenciales para la correcta visualización de la página.</p>'
    }
  };

  if (legalDialog) {
    const legalTitle = document.getElementById('legal-title');
    const legalBody = document.getElementById('legal-body');

    document.querySelectorAll('[data-legal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-legal');
        const doc = LEGAL_CONTENT[key] || LEGAL_CONTENT.aviso;
        if (legalTitle) legalTitle.textContent = doc.title;
        if (legalBody) legalBody.innerHTML = doc.body;
        legalDialog.showModal();
      });
    });
  }
})();
