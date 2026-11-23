/**
 * galeria.js — Staircase Carousel INFINITO (bucle sin fin) + Videos en bucle + Swipe vertical/horizontal
 * P7 Barber Master Studio · HTML + CSS + JS puro (0 dependencias externas)
 */

document.addEventListener('DOMContentLoaded', () => {
  const items = Array.isArray(window.P7_GALERIA_3) ? window.P7_GALERIA_3 : [];
  const root = document.getElementById('stc-root');
  const strip = document.getElementById('stc-strip');
  const titlesBox = document.getElementById('stc-titles');
  const dotsBox = document.getElementById('stc-dots');
  const prevBtn = document.getElementById('stc-prev');
  const nextBtn = document.getElementById('stc-next');
  const srStatus = document.getElementById('stc-sr');

  if (!root || !strip || items.length === 0) return;

  /* ------------------------------------------------------------------------
     1. Física de muelle exacta del StaircaseCarousel (21st.dev)
     ------------------------------------------------------------------------ */
  const CONFIG = {
    inactiveScale: 0.74,
    step: 0.88,
    mobileStep: 0.68,
    bounce: 0.1,
    duration: 0.78,
    stepDuration: 0.58,
    defaultIndex: 0
  };

  const n = items.length;

  function getItemTitle(item) {
    if (!item) return '';
    if (item.fixedTitle) return item.fixedTitle;
    if (item.sessionName) {
      return window.P7I18n
        ? window.P7I18n.t('gallery.sessionWith', { name: item.sessionName })
        : `Sesión con ${item.sessionName}`;
    }
    if (typeof item.cutNum === 'number') {
      return window.P7I18n
        ? window.P7I18n.t('gallery.cutN', { n: item.cutNum })
        : `Corte ${item.cutNum}`;
    }
    return item.title || '';
  }

  function getItemAlt(item) {
    if (!item) return '';
    const title = getItemTitle(item);
    if (item.type === 'video') {
      return window.P7I18n
        ? window.P7I18n.t('gallery.clipAlt', { title })
        : (item.alt || `${title} — clip en bucle P7 Barber Master Studio`);
    }
    return window.P7I18n
      ? window.P7I18n.t('gallery.photoAlt', { title })
      : (item.alt || `${title} — P7 Barber Master Studio`);
  }

  function getSlideAria(realIndex, item) {
    const title = getItemTitle(item);
    return window.P7I18n
      ? window.P7I18n.t('gallery.slideAria', { current: realIndex + 1, total: n, title })
      : `${realIndex + 1} de ${n}: ${title}`;
  }

  function getGotoAria(realIdx, item) {
    const title = getItemTitle(item);
    return window.P7I18n
      ? window.P7I18n.t('gallery.gotoAria', { current: realIdx + 1, title })
      : `Ir a ${realIdx + 1}: ${title}`;
  }

  function getItemStatusLabel(realIndex, item) {
    const title = getItemTitle(item);
    return window.P7I18n
      ? window.P7I18n.t('gallery.itemLabel', { current: realIndex + 1, total: n, title })
      : `Elemento ${realIndex + 1} de ${n}: ${title}`;
  }

  function mod(i) {
    return ((i % n) + n) % n;
  }

  function stepOf(i, activePos) {
    return i < activePos ? -1 : i > activePos ? 1 : 0;
  }

  function currentStepFactor() {
    return window.matchMedia('(max-width: 640px)').matches ? CONFIG.mobileStep : CONFIG.step;
  }

  function slideTransform(i, activePos) {
    const s = stepOf(i, activePos);
    const stepFactor = currentStepFactor();
    return `translateY(${s * stepFactor * 100}%) scale(${s === 0 ? 1 : CONFIG.inactiveScale})`;
  }

  function springAt(t, bounce, duration) {
    const zeta = 1 - Math.min(Math.max(bounce, 0), 0.9);
    const w = (2 * Math.PI) / Math.max(duration, 0.05);
    if (zeta >= 1) return 1 - Math.exp(-w * t) * (1 + w * t);
    const wd = w * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + ((zeta * w) / wd) * Math.sin(wd * t));
  }

  function springEasing(bounce, duration, samples = 48) {
    const zeta = 1 - Math.min(Math.max(bounce, 0), 0.9);
    const w = (2 * Math.PI) / Math.max(duration, 0.05);
    const T = Math.log(1000) / (zeta * w);
    const pts = [];
    for (let k = 0; k <= samples; k++) {
      const v = k === samples ? 1 : springAt((k / samples) * T, bounce, duration);
      pts.push(String(+v.toFixed(4)));
    }
    return { easing: `linear(${pts.join(', ')})`, ms: Math.round(T * 1000) };
  }

  const stripSpring = springEasing(CONFIG.bounce, CONFIG.duration);
  const popSpring = springEasing(0.2, 0.8);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     2. Triple Strip (3 copias) para bucle 100 % infinito sin cortes ni vacíos
     ------------------------------------------------------------------------ */
  const totalSlides = n * 3;
  let pos = n + CONFIG.defaultIndex; // Empezamos en la copia central
  let lastRealIndex = CONFIG.defaultIndex;
  let recenterTimer = null;

  const AUTOPLAY_INTERVAL_MS = 3600;
  const AUTOPLAY_RESUME_DELAY_MS = 4500;
  let autoplayTimer = null;
  let autoplayResumeTimer = null;
  let isLightboxOpen = false;
  let isPointerActive = false;

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function clearAutoplayResume() {
    if (autoplayResumeTimer) {
      clearTimeout(autoplayResumeTimer);
      autoplayResumeTimer = null;
    }
  }

  function startAutoplay() {
    if (prefersReduced || document.hidden || isLightboxOpen || isPointerActive || n <= 1) return;
    if (autoplayTimer) return;
    autoplayTimer = setInterval(() => {
      if (document.hidden || isLightboxOpen || isPointerActive) {
        stopAutoplay();
        return;
      }
      goDelta(1);
    }, AUTOPLAY_INTERVAL_MS);
  }

  function pauseAutoplayForInteraction(scheduleResume = true) {
    stopAutoplay();
    clearAutoplayResume();
    if (scheduleResume && !prefersReduced && !document.hidden && !isLightboxOpen && !isPointerActive) {
      autoplayResumeTimer = setTimeout(() => {
        autoplayResumeTimer = null;
        startAutoplay();
      }, AUTOPLAY_RESUME_DELAY_MS);
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
      clearAutoplayResume();
    } else if (!isLightboxOpen && !isPointerActive) {
      startAutoplay();
    }
  });

  const slideButtons = [];
  const dotButtons = [];
  const videoElements = new Map();
  const swipe = { id: -1, x: 0, y: 0, done: false };

  for (let i = 0; i < totalSlides; i++) {
    const realIndex = mod(i);
    const item = items[realIndex];

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'stc-slide';
    btn.setAttribute('aria-label', getSlideAria(realIndex, item));
    btn.style.transition = `transform ${CONFIG.stepDuration * 1000}ms ease-in-out`;

    if (item.type === 'video') {
      const video = document.createElement('video');
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = !prefersReduced;
      video.preload = 'metadata';
      if (item.poster) video.poster = item.poster;
      video.setAttribute('aria-label', getItemAlt(item));

      const sourceMain = document.createElement('source');
      sourceMain.src = item.src;
      sourceMain.type = item.src.endsWith('.webm') ? 'video/webm' : 'video/mp4';
      video.appendChild(sourceMain);

      if (item.fallbackSrc) {
        const sourceFallback = document.createElement('source');
        sourceFallback.src = item.fallbackSrc;
        sourceFallback.type = 'video/mp4';
        video.appendChild(sourceFallback);
      }

      btn.appendChild(video);
      videoElements.set(i, video);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = getItemAlt(item);
      img.draggable = false;
      img.decoding = 'async';
      img.loading = Math.abs(i - pos) <= 2 ? 'eager' : 'lazy';
      btn.appendChild(img);
    }

    btn.addEventListener('click', () => {
      if (swipe.done) return;
      if (i === pos) {
        openLightbox(item);
      } else {
        pauseAutoplayForInteraction(true);
        goToPos(i);
      }
    });

    strip.appendChild(btn);
    slideButtons.push(btn);
  }

  const pad = (num) => (num < 10 ? '0' + num : String(num));
  let countLabel = null;

  // Fiel a StaircaseCarousel (21st.dev): si hay > 14 fotos, mostrar contador numérico "01 / 26" en vez de 26 dots
  if (dotsBox) {
    if (n > 14) {
      countLabel = document.createElement('span');
      countLabel.className = 'stc-count';
      dotsBox.appendChild(countLabel);
    } else {
      items.forEach((item, realIdx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'stc-dot';
        dot.setAttribute('aria-label', getGotoAria(realIdx, item));
        dot.addEventListener('click', () => {
          pauseAutoplayForInteraction(true);
          goToPos(n + realIdx);
        });
        dotsBox.appendChild(dot);
        dotButtons.push(dot);
      });
    }
  }

  /* ------------------------------------------------------------------------
     3. Animación suave del título a la derecha (stc-in / stc-out)
     ------------------------------------------------------------------------ */
  let titleCleanupTimer = null;

  function renderTitle(realIndex, isInitial = false) {
    if (!titlesBox) return;
    const item = items[realIndex];
    if (!item) return;

    const titleText = getItemTitle(item);

    if (isInitial) {
      titlesBox.innerHTML = '';
      const el = document.createElement('div');
      el.className = 'stc-title';
      el.textContent = titleText;
      titlesBox.appendChild(el);
      return;
    }

    Array.from(titlesBox.children).forEach((child) => {
      child.setAttribute('data-out', '');
      child.style.animation = `stc-out ${popSpring.ms}ms ${popSpring.easing} both`;
    });

    const nextEl = document.createElement('div');
    nextEl.className = 'stc-title';
    nextEl.textContent = titleText;
    nextEl.style.animation = `stc-in ${popSpring.ms}ms ${popSpring.easing} both`;
    titlesBox.appendChild(nextEl);

    if (titleCleanupTimer) clearTimeout(titleCleanupTimer);
    titleCleanupTimer = setTimeout(() => {
      Array.from(titlesBox.querySelectorAll('[data-out]')).forEach((old) => old.remove());
    }, popSpring.ms + 40);
  }

  /* ------------------------------------------------------------------------
     4. Reproducción inteligente de vídeos en bucle + teletransporte infinito
     ------------------------------------------------------------------------ */
  function syncVideos() {
    if (prefersReduced) return;
    videoElements.forEach((video, idx) => {
      const isNear = Math.abs(idx - pos) <= 2;
      if (isNear) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      } else {
        video.pause();
      }
    });
  }

  function applyTransforms(instant = false) {
    strip.style.transition = instant
      ? 'none'
      : `transform ${stripSpring.ms}ms ${stripSpring.easing}`;
    strip.style.transform = `translateX(calc(${-pos} * var(--stc-w)))`;

    slideButtons.forEach((btn, i) => {
      const isActive = i === pos;
      btn.style.transition = instant
        ? 'none'
        : `transform ${CONFIG.stepDuration * 1000}ms ease-in-out`;
      btn.style.transform = slideTransform(i, pos);
      btn.tabIndex = isActive ? 0 : -1;
      if (isActive) {
        btn.setAttribute('aria-current', 'true');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    const realIndex = mod(pos);
    if (countLabel) {
      countLabel.textContent = `${pad(realIndex + 1)} / ${pad(n)}`;
    } else {
      dotButtons.forEach((dot, i) => {
        if (i === realIndex) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });
    }

    if (srStatus && items[realIndex]) {
      srStatus.textContent = getItemStatusLabel(realIndex, items[realIndex]);
    }

    syncVideos();
  }

  function scheduleRecenterIfNeeded() {
    if (recenterTimer) clearTimeout(recenterTimer);
    if (pos >= n && pos < 2 * n) return;

    recenterTimer = setTimeout(() => {
      pos = n + mod(pos);
      applyTransforms(true);
      // Forzar reflow para que la siguiente animación vuelva a tener transición suave
      void strip.offsetWidth;
    }, prefersReduced ? 0 : stripSpring.ms + 20);
  }

  function goToPos(nextPos) {
    if (nextPos === pos) return;

    // Si el usuario pulsa muy rápido cerca del límite extremo, recentrar primero sin salto
    if (nextPos <= 1 || nextPos >= totalSlides - 2) {
      const delta = nextPos - pos;
      pos = n + mod(pos);
      applyTransforms(true);
      void strip.offsetWidth;
      nextPos = pos + delta;
    }

    pos = nextPos;
    const realIndex = mod(pos);
    if (realIndex !== lastRealIndex) {
      lastRealIndex = realIndex;
      renderTitle(realIndex, false);
    }

    applyTransforms(false);
    scheduleRecenterIfNeeded();
  }

  function goDelta(delta) {
    goToPos(pos + delta);
  }

  // Botones < y > (siempre activos, bucle infinito)
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      pauseAutoplayForInteraction(true);
      goDelta(-1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      pauseAutoplayForInteraction(true);
      goDelta(1);
    });
  }

  // Teclado
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      pauseAutoplayForInteraction(true);
      goDelta(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      pauseAutoplayForInteraction(true);
      goDelta(-1);
    }
  });

  // Swipe táctil / arrastre: funciona en móvil y escritorio sin competir con el scroll vertical ni el autoplay
  root.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.stc-controls')) {
      pauseAutoplayForInteraction(true);
      return;
    }
    isPointerActive = true;
    pauseAutoplayForInteraction(false);
    swipe.id = e.pointerId;
    swipe.x = e.clientX;
    swipe.y = e.clientY;
    swipe.done = false;
  });

  root.addEventListener('pointermove', (e) => {
    if (swipe.id !== e.pointerId || swipe.done) return;
    const dx = e.clientX - swipe.x;
    const dy = e.clientY - swipe.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // Gesto horizontal o diagonal (deja libre el scroll vertical de la página hacia el separador y footer)
    if (absX > 24 && absX >= absY * 0.75) {
      swipe.done = true;
      pauseAutoplayForInteraction(false);
      goDelta(dx < 0 ? 1 : -1);
    }
  });

  window.addEventListener('resize', () => {
    applyTransforms(true);
  }, { passive: true });

  const endSwipe = () => {
    const wasActive = isPointerActive;
    isPointerActive = false;
    swipe.id = -1;
    if (wasActive && !isLightboxOpen) {
      pauseAutoplayForInteraction(true);
    }
    setTimeout(() => {
      swipe.done = false;
    }, 0);
  };
  window.addEventListener('pointerup', endSwipe);
  window.addEventListener('pointercancel', endSwipe);

  /* ------------------------------------------------------------------------
     5. Lightbox Modal al pulsar el elemento activo (Soporta foto y vídeo)
     ------------------------------------------------------------------------ */
  const dialog = document.getElementById('gal-dialog');
  const dialogMedia = document.getElementById('gal-dialog-media');
  const dialogTitle = document.getElementById('gal-dialog-title');
  const dialogClose = document.getElementById('gal-dialog-close');
  let closeDialogTimer = null;
  let isScrollLocked = false;
  let currentLightboxItem = null;

  function openLightbox(item) {
    if (!dialog || !dialogMedia) return;
    currentLightboxItem = item;
    if (closeDialogTimer) {
      clearTimeout(closeDialogTimer);
      closeDialogTimer = null;
    }
    dialog.classList.remove('is-closing');
    dialogMedia.innerHTML = '';

    if (item.type === 'video') {
      const v = document.createElement('video');
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.autoplay = true;
      v.controls = false;
      v.disablePictureInPicture = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('muted', '');
      v.setAttribute('aria-label', getItemAlt(item));
      if (item.poster) v.poster = item.poster;

      const s1 = document.createElement('source');
      s1.src = item.src;
      s1.type = item.src.endsWith('.webm') ? 'video/webm' : 'video/mp4';
      v.appendChild(s1);

      if (item.fallbackSrc) {
        const s2 = document.createElement('source');
        s2.src = item.fallbackSrc;
        s2.type = 'video/mp4';
        v.appendChild(s2);
      }
      dialogMedia.appendChild(v);
      v.play().catch(() => {});
    } else {
      const img = document.createElement('img');
      img.src = item.fullSrc || item.src;
      img.alt = getItemAlt(item);
      dialogMedia.appendChild(img);
    }

    if (dialogTitle) dialogTitle.textContent = getItemTitle(item);
    if (typeof dialog.showModal === 'function' && !dialog.open) {
      isLightboxOpen = true;
      stopAutoplay();
      clearAutoplayResume();
      window.P7ScrollLock?.lock();
      isScrollLocked = true;
      dialog.showModal();
    }
  }

  function closeLightbox() {
    if (!dialog || !dialog.open || dialog.classList.contains('is-closing')) return;
    if (prefersReduced) {
      dialog.close();
      return;
    }
    dialog.classList.add('is-closing');
    closeDialogTimer = setTimeout(() => {
      closeDialogTimer = null;
      dialog.classList.remove('is-closing');
      if (dialog.open) dialog.close();
    }, 180);
  }

  if (dialogClose && dialog) {
    dialogClose.addEventListener('click', closeLightbox);
  }

  if (dialog) {
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeLightbox();
    });
    dialog.addEventListener('close', () => {
      if (closeDialogTimer) {
        clearTimeout(closeDialogTimer);
        closeDialogTimer = null;
      }
      dialog.classList.remove('is-closing');
      if (dialogMedia) dialogMedia.innerHTML = '';
      if (isScrollLocked) {
        window.P7ScrollLock?.unlock();
        isScrollLocked = false;
      }
      isLightboxOpen = false;
      currentLightboxItem = null;
      startAutoplay();
    });
    dialog.addEventListener('click', (event) => {
      if (
        event.target === dialog ||
        event.target.classList.contains('gal-dialog-inner') ||
        event.target === dialogMedia
      ) {
        closeLightbox();
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. Botones "Volver al estudio"
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-back-to-studio]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (window.opener && !window.opener.closed) {
        e.preventDefault();
        window.close();
      }
    });
  });

  function refreshI18n() {
    slideButtons.forEach((btn, i) => {
      const realIndex = mod(i);
      const item = items[realIndex];
      if (!item) return;
      btn.setAttribute('aria-label', getSlideAria(realIndex, item));
      const media = btn.querySelector('img, video');
      if (media) {
        if (media.tagName === 'IMG') {
          media.alt = getItemAlt(item);
        } else {
          media.setAttribute('aria-label', getItemAlt(item));
        }
      }
    });

    dotButtons.forEach((dot, realIdx) => {
      const item = items[realIdx];
      if (item) {
        dot.setAttribute('aria-label', getGotoAria(realIdx, item));
      }
    });

    const activeRealIndex = mod(pos);
    renderTitle(activeRealIndex, true);
    if (srStatus && items[activeRealIndex]) {
      srStatus.textContent = getItemStatusLabel(activeRealIndex, items[activeRealIndex]);
    }

    if (isLightboxOpen && currentLightboxItem) {
      if (dialogTitle) dialogTitle.textContent = getItemTitle(currentLightboxItem);
      const lbMedia = dialogMedia?.querySelector('img, video');
      if (lbMedia) {
        if (lbMedia.tagName === 'IMG') {
          lbMedia.alt = getItemAlt(currentLightboxItem);
        } else {
          lbMedia.setAttribute('aria-label', getItemAlt(currentLightboxItem));
        }
      }
    }
  }

  document.addEventListener('p7:langchange', refreshI18n);

  // Inicializar en copia central sin salto visual
  renderTitle(mod(pos), true);
  applyTransforms(true);
  startAutoplay();
});
