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
     0. Utilidades globales: P7ScrollLock (iOS) y P7ThemeColor (Safari bar)
     ------------------------------------------------------------------------ */
  let lockCount = 0;
  let lockedScrollY = 0;

  const blockLockedTouchMove = (e) => {
    if (lockCount <= 0) return;
    if (e.target && typeof e.target.closest === 'function' && e.target.closest('[data-scroll-allow]')) {
      return;
    }
    e.preventDefault();
  };

  window.P7ScrollLock = {
    lock() {
      if (lockCount === 0) {
        lockedScrollY = window.scrollY || window.pageYOffset || 0;
        root.classList.add('p7-scroll-locked');
        document.body.style.position = 'fixed';
        document.body.style.top = `-${lockedScrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        window.addEventListener('touchmove', blockLockedTouchMove, { passive: false });
      }
      lockCount += 1;
    },
    unlock() {
      if (lockCount <= 0) return;
      lockCount -= 1;
      if (lockCount === 0) {
        window.removeEventListener('touchmove', blockLockedTouchMove);
        root.classList.remove('p7-scroll-locked');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo({ top: lockedScrollY, behavior: 'instant' });
      }
    },
    isLocked() {
      return lockCount > 0;
    }
  };

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const hasHeroSection = Boolean(document.querySelector('.hero'));
  const defaultThemeColor = themeColorMeta ? (themeColorMeta.getAttribute('content') || '#0A0909') : '#0A0909';
  let themeColorOverride = null;

  const computeThemeColor = () => {
    if (themeColorOverride) return themeColorOverride;
    return defaultThemeColor;
  };

  const syncThemeColor = () => {
    const nextColor = computeThemeColor();
    if (themeColorMeta && themeColorMeta.getAttribute('content') !== nextColor) {
      themeColorMeta.setAttribute('content', nextColor);
    }
  };
  syncThemeColor();

  window.P7ThemeColor = {
    setOverride(color) {
      themeColorOverride = color || null;
      syncThemeColor();
    },
    clearOverride() {
      themeColorOverride = null;
      syncThemeColor();
    },
    sync: syncThemeColor
  };

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

    syncThemeColor();
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
     2. Vídeo Hero (Autoplay infinito blindado para iOS Safari) + Vídeos Lazy
     ------------------------------------------------------------------------ */
  const heroVideo = document.getElementById('hero-video');
  const heroPoster = document.querySelector('.hero-poster-media');
  const videoToggle = document.getElementById('hero-video-toggle');
  let userPaused = false;
  let videoAvailable = false;
  let playInFlight = false;
  let heroEnsurePlay = () => {};

  const syncToggleUI = (isPlaying) => {
    if (!videoToggle) return;
    videoToggle.setAttribute('aria-pressed', String(!isPlaying));
    videoToggle.textContent = window.P7I18n
      ? window.P7I18n.t(isPlaying ? 'hero.pauseBg' : 'hero.playBg')
      : (isPlaying ? 'Pausar ambiente' : 'Reproducir ambiente');
  };

  const enforceHeroAttrs = () => {
    if (!heroVideo) return;
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;
    heroVideo.setAttribute('muted', '');
    heroVideo.setAttribute('playsinline', '');
    heroVideo.setAttribute('webkit-playsinline', '');
  };

  const applyMediaMotionState = () => {
    const shouldPlay = !userPaused;

    if (heroVideo) {
      enforceHeroAttrs();

      if (!shouldPlay) {
        heroVideo.removeAttribute('autoplay');
        heroVideo.pause();
      } else {
        heroVideo.setAttribute('autoplay', '');
        heroEnsurePlay();
      }
    }

    if (heroPoster) {
      heroPoster.classList.toggle('is-ken-burns', shouldPlay && !prefersReducedMotion());
    }

    syncToggleUI(shouldPlay);
  };

  if (heroVideo) {
    /* Guardián "nunca parar" (iOS Safari / iPadOS):
       - Prioridad absoluta al vídeo Hero (los vídeos secundarios usan lazy-play).
       - Usa playAttemptId + timeout de seguridad para evitar deadlocks o AbortError al rotar iPad.
       - Nunca oculta el vídeo por un NETWORK_NO_SOURCE transitorio al arrancar el DOM. */
    let retryTimer = null;
    let retryCount = 0;
    let playAttemptId = 0;
    let playInFlightTimer = null;

    const clearInFlight = () => {
      playInFlight = false;
      if (playInFlightTimer) {
        clearTimeout(playInFlightTimer);
        playInFlightTimer = null;
      }
    };

    const isHeroVisible = () => {
      const r = heroVideo.getBoundingClientRect();
      return r.bottom > 0 && r.top < (window.innerHeight || document.documentElement.clientHeight);
    };

    const scheduleRetry = () => {
      if (retryTimer || userPaused || heroVideo.classList.contains('is-unavailable')) return;
      const delay = Math.min(250 * 2 ** retryCount, 3000);
      retryCount += 1;
      retryTimer = window.setTimeout(() => {
        retryTimer = null;
        ensurePlay();
      }, delay);
    };

    const markVideoUnavailable = () => {
      videoAvailable = false;
      heroVideo.classList.add('is-unavailable');
      heroVideo.pause();
    };

    const markVideoAvailable = () => {
      if (videoAvailable) return;
      videoAvailable = true;
      heroVideo.classList.remove('is-unavailable');
    };

    const ensurePlay = (force = false) => {
      if (userPaused || document.visibilityState === 'hidden' || heroVideo.classList.contains('is-unavailable')) {
        return;
      }
      enforceHeroAttrs();
      if (!force && !heroVideo.paused && !heroVideo.ended) return;
      if (playInFlight && !force) return;

      const attemptId = ++playAttemptId;
      playInFlight = true;
      if (playInFlightTimer) clearTimeout(playInFlightTimer);
      playInFlightTimer = window.setTimeout(() => {
        if (attemptId === playAttemptId) clearInFlight();
      }, 2500);

      const p = heroVideo.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          if (attemptId !== playAttemptId) return;
          clearInFlight();
          retryCount = 0;
          markVideoAvailable();
        }).catch((err) => {
          if (attemptId !== playAttemptId) return;
          clearInFlight();
          if (err && err.name === 'NotAllowedError') {
            return; // En Modo Bajo Consumo de iOS esperamos al gesto táctil de unlock
          }
          scheduleRetry();
        });
      } else {
        clearInFlight();
      }
    };
    heroEnsurePlay = ensurePlay;

    // Red de seguridad: primer gesto táctil o tecla desbloquea reproducción (ej. Modo Bajo Consumo iOS)
    const unlockEvents = ['touchstart', 'touchend', 'pointerdown', 'click', 'keydown'];
    let unlockBound = true;
    const detachUnlock = () => {
      if (!unlockBound) return;
      unlockBound = false;
      unlockEvents.forEach((ev) => window.removeEventListener(ev, unlock, true));
    };
    const unlock = () => {
      ensurePlay(true);
    };
    unlockEvents.forEach((ev) => window.addEventListener(ev, unlock, { capture: true, passive: true }));

    // Re-arranque ante cualquier pausa no solicitada por el usuario (solo si está visible)
    heroVideo.addEventListener('pause', () => {
      if (
        !userPaused &&
        document.visibilityState === 'visible' &&
        !heroVideo.classList.contains('is-unavailable') &&
        isHeroVisible()
      ) {
        scheduleRetry();
      }
    });

    ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'stalled'].forEach((ev) =>
      heroVideo.addEventListener(ev, () => {
        if (heroVideo.readyState >= 2) markVideoAvailable();
        if (heroVideo.paused && isHeroVisible()) ensurePlay();
      })
    );

    heroVideo.addEventListener('playing', () => {
      playAttemptId += 1;
      clearInFlight();
      retryCount = 0;
      markVideoAvailable();
      detachUnlock();
    });

    // Garantía de bucle continuo e inmediato (force=true para saltar el early-return tras currentTime=0)
    heroVideo.addEventListener('ended', () => {
      if (userPaused) return;
      heroVideo.currentTime = 0;
      ensurePlay(true);
    });

    // Limpieza al salir hacia bfcache
    window.addEventListener('pagehide', () => {
      playAttemptId += 1;
      clearInFlight();
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
    });

    // Volver desde bfcache (recarga/atrás en Safari): comprueba variante y relanza sin congelar
    window.addEventListener('pageshow', (event) => {
      playAttemptId += 1;
      clearInFlight();
      retryCount = 0;
      if (event.persisted) {
        syncHeroVariant(false);
        if (heroVideo.readyState < 2) {
          heroVideo.load();
        }
      }
      ensurePlay(true);
    });

    window.addEventListener('focus', () => {
      if (isHeroVisible()) ensurePlay();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        retryCount = 0;
        if (isHeroVisible()) ensurePlay();
      } else {
        playAttemptId += 1;
        clearInFlight();
      }
    });

    // Vigilante ligero: si está visible y parado sin motivo, relanzar
    window.setInterval(() => {
      if (!userPaused && heroVideo.paused && document.visibilityState === 'visible' && isHeroVisible()) {
        ensurePlay();
      }
    }, 1500);

    // Solo marcar como no disponible si TODAS las fuentes activas fallan de verdad
    const bindSourceErrorGuards = () => {
      const sources = Array.from(heroVideo.querySelectorAll('source'));
      if (!sources.length) return;
      let failedSources = 0;
      sources.forEach((src) => {
        if (src.dataset.errBound === '1') return;
        src.dataset.errBound = '1';
        src.addEventListener('error', () => {
          failedSources += 1;
          if (failedSources >= sources.length) {
            markVideoUnavailable();
          }
        });
      });
    };

    // Cambio dinámico limpio entre vídeo Móvil/Tablet (<=1024px) y Ordenador (>=1025px)
    const heroDesktopMQ = window.matchMedia('(min-width: 1025px)');
    const syncHeroVariant = (forceReload = false) => {
      const targetMode = heroDesktopMQ.matches ? 'desktop' : 'mobile';
      const hasSources = heroVideo.querySelectorAll('source').length > 0;
      if (!forceReload && heroVideo.dataset.heroMode === targetMode && hasSources) {
        return false;
      }

      const isDesktop = targetMode === 'desktop';
      const mp4 = isDesktop ? heroVideo.dataset.desktopMp4 : heroVideo.dataset.mobileMp4;
      const webm = isDesktop ? heroVideo.dataset.desktopWebm : heroVideo.dataset.mobileWebm;
      if (!mp4 && !webm) return false;

      heroVideo.dataset.heroMode = targetMode;
      heroVideo.classList.remove('is-unavailable');
      videoAvailable = false;
      playAttemptId += 1;
      clearInFlight();
      retryCount = 0;
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }

      heroVideo.pause();
      heroVideo.width = isDesktop ? 1920 : 1080;
      heroVideo.height = isDesktop ? 1080 : 1920;

      heroVideo.innerHTML = '';
      [
        { src: mp4, type: 'video/mp4' },
        { src: webm, type: 'video/webm' }
      ].forEach((item) => {
        if (!item.src) return;
        const s = document.createElement('source');
        s.src = item.src;
        s.type = item.type;
        heroVideo.appendChild(s);
      });

      bindSourceErrorGuards();
      enforceHeroAttrs();
      heroVideo.load();
      ensurePlay(true);
      return true;
    };

    const swapped = syncHeroVariant(false);
    if (!swapped) {
      bindSourceErrorGuards();
      if (heroVideo.error) {
        markVideoUnavailable();
      } else if (heroVideo._initialPlayPromise && typeof heroVideo._initialPlayPromise.catch === 'function') {
        heroVideo._initialPlayPromise.catch((err) => {
          if (!err || err.name !== 'NotAllowedError') scheduleRetry();
        });
      }
    }

    if (typeof heroDesktopMQ.addEventListener === 'function') {
      heroDesktopMQ.addEventListener('change', () => syncHeroVariant(true));
    } else if (typeof heroDesktopMQ.addListener === 'function') {
      heroDesktopMQ.addListener(() => syncHeroVariant(true));
    }

    if (heroVideo.readyState >= 2) {
      markVideoAvailable();
    }
  }

  /* ------------------------------------------------------------------------
     2b. Vídeos secundarios lazy ([data-lazy-video]: Galería 1 y Nuestro Trabajo)
         Solo se reproducen cuando entran en pantalla para no saturar decodificadores
         hardware en iOS Safari y dejar el 100% de prioridad al vídeo Hero.
     ------------------------------------------------------------------------ */
  const lazyVideos = Array.from(document.querySelectorAll('video[data-lazy-video]'));
  if (lazyVideos.length > 0) {
    const visibleLazyVideos = new Set();

    const playLazyVideo = (video) => {
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      if (video.preload === 'none') {
        video.preload = 'metadata';
      }
      if (video.paused) {
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
    };

    if ('IntersectionObserver' in window) {
      const lazyVideoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting && document.visibilityState === 'visible') {
              visibleLazyVideos.add(video);
              playLazyVideo(video);
            } else {
              visibleLazyVideos.delete(video);
              if (!video.paused) video.pause();
            }
          });
        },
        { rootMargin: '120px 260px', threshold: 0.05 }
      );

      lazyVideos.forEach((v) => lazyVideoObserver.observe(v));

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          visibleLazyVideos.forEach(playLazyVideo);
        } else {
          visibleLazyVideos.forEach((v) => {
            if (!v.paused) v.pause();
          });
        }
      });
    } else {
      lazyVideos.forEach(playLazyVideo);
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
    const lbVideo = document.getElementById('lightbox-video');
    const lbTitle = document.getElementById('lightbox-title');
    const lbCat = document.getElementById('lightbox-category');

    const openLightbox = (trigger) => {
      const type = trigger.getAttribute('data-lightbox-type') || 'image';
      const src = trigger.getAttribute('data-lightbox-src') || '';
      const poster = trigger.getAttribute('data-lightbox-poster') || '';
      const title = trigger.getAttribute('data-lightbox-title') || '';
      const cat = trigger.getAttribute('data-lightbox-cat') || '';

      if (type === 'video' && lbVideo) {
        if (lbImg) {
          lbImg.hidden = true;
          lbImg.src = '';
        }
        lbVideo.controls = false;
        lbVideo.removeAttribute('controls');
        lbVideo.muted = true;
        lbVideo.loop = true;
        lbVideo.playsInline = true;
        lbVideo.poster = poster;
        lbVideo.src = src;
        lbVideo.hidden = false;
        const p = lbVideo.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } else if (lbImg) {
        if (lbVideo) {
          lbVideo.pause();
          lbVideo.hidden = true;
          lbVideo.removeAttribute('src');
        }
        lbImg.hidden = false;
        lbImg.src = src;
        lbImg.alt = title;
      }

      if (lbTitle) lbTitle.textContent = title;
      if (lbCat) {
        lbCat.textContent = cat;
        lbCat.hidden = !cat;
      }
      if (!lightboxDialog.open) {
        window.P7ScrollLock?.lock();
        lightboxDialog.showModal();
      }
    };

    lightboxDialog.addEventListener('close', () => {
      if (lbVideo) {
        lbVideo.pause();
        lbVideo.hidden = true;
        lbVideo.removeAttribute('src');
      }
      window.P7ScrollLock?.unlock();
    });

    document.querySelectorAll('[data-lightbox-src]').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        if (trigger.closest('.galeria-marquee')?.dataset.wasDragged === '1') {
          e.preventDefault();
          return;
        }
        openLightbox(trigger);
      });
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(trigger);
        }
      });
    });
  }

  // Legal Dialog
  const legalDialog = document.getElementById('legal-dialog');
  initDialog(legalDialog);

  const LEGAL_CONTENT = {
    aviso: {
      titleKey: 'legalDialog.avisoTitle',
      bodyKey: 'legalDialog.avisoBody',
      title: 'Aviso Legal',
      body: '<p><strong>P7 Barber Master Studio</strong><br>Dirección: C/ Miguel Ángel Riera, 2 — 07004 Palma de Mallorca, Illes Balears.<br>Actividad: Servicios de barbería artesanal y cuidado masculino bajo cita previa.</p>'
    },
    privacidad: {
      titleKey: 'legalDialog.privacidadTitle',
      bodyKey: 'legalDialog.privacidadBody',
      title: 'Política de Privacidad',
      body: '<p>Esta web informativa no recopila datos personales mediante formularios propios. Las reservas se gestionan directamente en las plataformas externas autorizadas (Booksy y Setmore) bajo sus respectivas políticas de privacidad.</p>'
    },
    cookies: {
      titleKey: 'legalDialog.cookiesTitle',
      bodyKey: 'legalDialog.cookiesBody',
      title: 'Política de Cookies',
      body: '<p>Este sitio web no utiliza cookies publicitarias ni de seguimiento de terceros. Únicamente se emplean recursos técnicos esenciales para la correcta visualización de la página.</p>'
    }
  };

  const getLegalDoc = (key) => {
    const entry = LEGAL_CONTENT[key] || LEGAL_CONTENT.aviso;
    if (window.P7I18n) {
      const title = window.P7I18n.t(entry.titleKey);
      const body = window.P7I18n.t(entry.bodyKey);
      return {
        title: title !== entry.titleKey ? title : entry.title,
        body: body !== entry.bodyKey ? body : entry.body
      };
    }
    return { title: entry.title, body: entry.body };
  };

  let activeLegalKey = null;

  if (legalDialog) {
    const legalTitle = document.getElementById('legal-title');
    const legalBody = document.getElementById('legal-body');

    const renderLegalDoc = (key) => {
      const doc = getLegalDoc(key);
      if (legalTitle) legalTitle.textContent = doc.title;
      if (legalBody) legalBody.innerHTML = doc.body;
    };

    document.querySelectorAll('[data-legal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeLegalKey = btn.getAttribute('data-legal') || 'aviso';
        renderLegalDoc(activeLegalKey);
        if (!legalDialog.open) {
          window.P7ScrollLock?.lock();
          legalDialog.showModal();
        }
      });
    });

    legalDialog.addEventListener('close', () => {
      window.P7ScrollLock?.unlock();
    });

    document.addEventListener('p7:langchange', () => {
      syncToggleUI(!userPaused);
      if (legalDialog.open && activeLegalKey) {
        renderLegalDoc(activeLegalKey);
      }
    });
  } else {
    document.addEventListener('p7:langchange', () => {
      syncToggleUI(!userPaused);
    });
  }

  /* ==========================================================================
     8. Animación editorial de títulos (21st.dev TextEffect Per Char — 1 vez)
     ========================================================================== */
  const initTitleTextEffect = () => {
    const TITLE_SELECTOR = [
      '.sobre-v2-h2',
      '.trabajo-v2-h2',
      '.showcase-title',
      '.contacto-h2',
      '.reserva-title',
      '.mapa-title',
      '.faq-heading',
      '.equipo-h1'
    ].join(', ');

    const titles = Array.from(document.querySelectorAll(TITLE_SELECTOR));
    if (!titles.length) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    const splitTitleIntoChars = (el) => {
      const rawText = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!rawText) return 0;

      el.setAttribute('aria-label', rawText);
      const frag = document.createDocumentFragment();
      const tokens = rawText.split(/(\s+)/);
      let charIndex = 0;

      tokens.forEach((token) => {
        if (!token) return;
        if (/^\s+$/.test(token)) {
          frag.appendChild(document.createTextNode(' '));
          return;
        }
        const wordSpan = document.createElement('span');
        wordSpan.className = 'p7-te-word';
        wordSpan.setAttribute('aria-hidden', 'true');

        Array.from(token).forEach((ch) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'p7-te-char';
          charSpan.style.setProperty('--te-i', String(charIndex));
          charSpan.textContent = ch;
          wordSpan.appendChild(charSpan);
          charIndex += 1;
        });

        frag.appendChild(wordSpan);
      });

      el.textContent = '';
      el.appendChild(frag);
      el.classList.add('p7-te-ready');
      return charIndex;
    };

    const revealTitle = (el) => {
      if (el.dataset.teAnimated === '1') return;
      el.dataset.teAnimated = '1';
      const totalChars = Number(el.dataset.teChars || '16');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.add('is-te-visible');
          window.setTimeout(() => {
            el.classList.add('is-te-done');
          }, totalChars * 48 + 720);
        });
      });
    };

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries, obs) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                revealTitle(entry.target);
                obs.unobserve(entry.target);
              });
            },
            { threshold: 0.18, rootMargin: '0px 0px -6% 0px' }
          )
        : null;

    titles.forEach((el) => {
      const count = splitTitleIntoChars(el);
      el.dataset.teChars = String(count);

      if (!observer) {
        revealTitle(el);
        return;
      }

      // Hero / título ya visible al cargar: se anima 1 sola vez al entrar
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        revealTitle(el);
      } else {
        observer.observe(el);
      }
    });

    // Compatibilidad total con cambio de idioma ES / EN / DE
    document.addEventListener('p7:langchange', () => {
      titles.forEach((el) => {
        const cleanText = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!cleanText) return;
        if (el.dataset.teAnimated === '1') {
          el.setAttribute('aria-label', cleanText);
          el.classList.remove('p7-te-ready', 'is-te-visible', 'is-te-done');
        } else {
          const count = splitTitleIntoChars(el);
          el.dataset.teChars = String(count);
        }
      });
    });
  };

  initTitleTextEffect();

  /* ==========================================================================
     9. Animación FlipText solo para el título Hero (21st.dev — 1 sola vez)
     ========================================================================== */
  const initHeroFlipText = () => {
    const heroTitle = document.querySelector('.hero-simple-title');
    if (!heroTitle) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    const splitHeroIntoFlipChars = (el) => {
      const rawText = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!rawText) return 0;

      el.setAttribute('aria-label', rawText);
      const frag = document.createDocumentFragment();
      const tokens = rawText.split(/(\s+)/);
      let charIndex = 0;

      tokens.forEach((token) => {
        if (!token) return;
        if (/^\s+$/.test(token)) {
          frag.appendChild(document.createTextNode(' '));
          return;
        }
        const wordSpan = document.createElement('span');
        wordSpan.className = 'p7-flip-word';
        wordSpan.setAttribute('aria-hidden', 'true');

        Array.from(token).forEach((ch) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'p7-flip-char';
          charSpan.style.setProperty('--flip-i', String(charIndex));
          charSpan.textContent = ch;
          wordSpan.appendChild(charSpan);
          charIndex += 1;
        });

        frag.appendChild(wordSpan);
      });

      el.textContent = '';
      el.appendChild(frag);
      el.classList.add('p7-flip-ready');
      return charIndex;
    };

    const count = splitHeroIntoFlipChars(heroTitle);
    heroTitle.dataset.flipAnimated = '1';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroTitle.classList.add('is-flip-visible');
        window.setTimeout(() => {
          heroTitle.classList.add('is-flip-done');
        }, count * 55 + 620);
      });
    });

    // Mantener limpio y visible si el usuario cambia de idioma ES / EN / DE
    document.addEventListener('p7:langchange', () => {
      const cleanText = (heroTitle.textContent || '').replace(/\s+/g, ' ').trim();
      if (!cleanText) return;
      heroTitle.setAttribute('aria-label', cleanText);
      heroTitle.classList.remove('p7-flip-ready', 'is-flip-visible', 'is-flip-done');
    });
  };

  initHeroFlipText();

  /* ==========================================================================
     10. Animación secuencial de 5 estrellas en el panel «Reserva tu hora.»
     ========================================================================== */
  const initReservaStars = () => {
    const starsWrap = document.querySelector('.reserva-proof-stars');
    if (!starsWrap) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    starsWrap.classList.add('is-stars-ready');

    const triggerStars = () => {
      if (starsWrap.dataset.starsDone === '1') return;
      starsWrap.dataset.starsDone = '1';
      requestAnimationFrame(() => {
        starsWrap.classList.add('is-stars-visible');
      });
    };

    if (!('IntersectionObserver' in window)) {
      triggerStars();
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          triggerStars();
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.45, rootMargin: '0px 0px -4% 0px' }
    );

    observer.observe(starsWrap);
  };

  initReservaStars();
})();
