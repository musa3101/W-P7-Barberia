/**
 * trabajo.js — Lógica pura para "Nuestro trabajo" (Expandable Gallery 21st.dev + Modal + Carta)
 * P7 Barber Master Studio · Sin dependencias externas
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. Galería 2: Expandable Gallery (Mobile Vertical Accordion / Desktop Flex)
     ------------------------------------------------------------------------ */
  const gallery = document.getElementById('exp-gallery');
  const galleryStage = document.querySelector('.exp-gallery-stage');
  const panels = Array.from(document.querySelectorAll('.exp-panel'));
  const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

  // Revelado suave de arriba hacia abajo de los textos laterales al llegar a la sección
  if (galleryStage) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                galleryStage.classList.add('is-revealed');
              }, 120);
              revealObserver.unobserve(galleryStage);
            }
          });
        },
        { threshold: 0.2 }
      );
      revealObserver.observe(galleryStage);
    } else {
      galleryStage.classList.add('is-revealed');
    }
  }

  let currentModalIndex = 0;

  const setActivePanelMobile = (targetPanel) => {
    if (gallery) gallery.classList.add('has-active');
    panels.forEach((panel) => {
      const isTarget = panel === targetPanel;
      panel.classList.toggle('is-active', isTarget);
      panel.setAttribute('aria-expanded', String(isTarget));
    });
  };

  panels.forEach((panel, index) => {
    // Desktop hover / focus
    panel.addEventListener('mouseenter', () => {
      if (!isDesktop() || !gallery) return;
      gallery.classList.add('has-hover');
      panels.forEach((el) => el.classList.remove('is-hovered'));
      panel.classList.add('is-hovered');
    });

    panel.addEventListener('focus', () => {
      if (!isDesktop() || !gallery) return;
      gallery.classList.add('has-hover');
      panels.forEach((el) => el.classList.remove('is-hovered'));
      panel.classList.add('is-hovered');
    });

    // Click: en escritorio abre modal directo; en móvil 1er toque despliega y 2º toque abre modal
    panel.addEventListener('click', () => {
      if (isDesktop()) {
        openModal(index);
      } else {
        if (panel.classList.contains('is-active')) {
          openModal(index);
        } else {
          setActivePanelMobile(panel);
        }
      }
    });
  });

  if (gallery) {
    gallery.addEventListener('mouseleave', () => {
      gallery.classList.remove('has-hover');
      panels.forEach((el) => el.classList.remove('is-hovered'));
    });

    gallery.addEventListener('focusout', (e) => {
      if (!gallery.contains(e.relatedTarget)) {
        gallery.classList.remove('has-hover');
        panels.forEach((el) => el.classList.remove('is-hovered'));
      }
    });
  }

  /* ------------------------------------------------------------------------
     2. Lightbox Modal Completo (Soporta Foto + Vídeo / Prev / Next / Swipe)
     ------------------------------------------------------------------------ */
  const dialog = document.getElementById('trabajo-dialog');
  const dialogStage = document.getElementById('trabajo-dialog-stage');
  const dialogMedia = document.getElementById('trabajo-dialog-media');
  const dialogTitle = document.getElementById('trabajo-dialog-title');
  const dialogCaption = document.getElementById('trabajo-dialog-caption');
  const dialogCounter = document.getElementById('trabajo-dialog-counter');
  const dialogClose = document.getElementById('trabajo-dialog-close');
  const dialogPrev = document.getElementById('trabajo-dialog-prev');
  const dialogNext = document.getElementById('trabajo-dialog-next');

  const renderModalSlide = (index) => {
    const panel = panels[index];
    if (!panel || !dialogMedia) return;

    currentModalIndex = index;
    const type = panel.dataset.type || 'image';
    const src = panel.dataset.fullSrc || panel.querySelector('img')?.src || '';
    const poster = panel.dataset.poster || '';
    const title = panel.dataset.title || '';
    const caption = panel.dataset.caption || '';

    dialogMedia.innerHTML = '';

    if (type === 'video') {
      const video = document.createElement('video');
      video.className = 'trabajo-dialog-video';
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = true;
      video.controls = false;
      video.disablePictureInPicture = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      if (poster) video.poster = poster;
      const source = document.createElement('source');
      source.src = src;
      source.type = 'video/mp4';
      video.appendChild(source);
      dialogMedia.appendChild(video);
      video.play().catch(() => {});
    } else {
      const img = document.createElement('img');
      img.className = 'trabajo-dialog-img';
      img.src = src;
      img.alt = `${title} — P7 Barber Master Studio`;
      dialogMedia.appendChild(img);
    }

    if (dialogTitle) dialogTitle.textContent = title;
    if (dialogCaption) dialogCaption.textContent = caption;
    if (dialogCounter) dialogCounter.textContent = `${index + 1} / ${panels.length}`;
  };

  const openModal = (index) => {
    if (!dialog) return;
    renderModalSlide(index);
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  };

  const goNext = () => {
    const nextIndex = (currentModalIndex + 1) % panels.length;
    renderModalSlide(nextIndex);
  };

  const goPrev = () => {
    const prevIndex = (currentModalIndex - 1 + panels.length) % panels.length;
    renderModalSlide(prevIndex);
  };

  if (dialogClose && dialog) {
    dialogClose.addEventListener('click', () => dialog.close());
  }
  if (dialogNext) dialogNext.addEventListener('click', goNext);
  if (dialogPrev) dialogPrev.addEventListener('click', goPrev);

  if (dialog) {
    dialog.addEventListener('close', () => {
      if (dialogMedia) dialogMedia.innerHTML = '';
    });
    // Cerrar al hacer click fuera de la foto/vídeo o de los botones
    dialog.addEventListener('click', (event) => {
      if (
        event.target === dialog ||
        event.target === dialogStage ||
        event.target === dialogMedia
      ) {
        dialog.close();
      }
    });

    // Navegación con flechas del teclado
    dialog.addEventListener('keydown', (event) => {
      if (!dialog.open) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      }
    });
  }

  // Swipe táctil izquierda/derecha dentro del modal en móvil
  if (dialogStage) {
    let touchStartX = 0;
    dialogStage.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    dialogStage.addEventListener(
      'touchend',
      (e) => {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) > 42) {
          if (deltaX < 0) goNext();
          else goPrev();
        }
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------------
     3. Botón Liquid Glass + Carta de Servicios Desplegable
        + Auto-cierre inteligente al pasarla hacia abajo (sin salto de scroll)
     ------------------------------------------------------------------------ */
  const toggleBtn = document.getElementById('precios-toggle-btn');
  const toggleLabel = document.getElementById('precios-toggle-label');
  const drawer = document.getElementById('precios-drawer');

  const setDrawerState = (open, instant = false) => {
    if (!toggleBtn || !drawer) return;

    if (instant) {
      const prevTransition = drawer.style.transition;
      drawer.style.transition = 'none';
      drawer.classList.toggle('is-open', open);
      void drawer.offsetHeight;
      drawer.style.transition = prevTransition;
    } else {
      drawer.classList.toggle('is-open', open);
    }

    toggleBtn.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));

    if (toggleLabel) {
      toggleLabel.textContent = open ? 'Ocultar lista de precios' : 'Lista de precios';
    }
  };

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const willOpen = !drawer.classList.contains('is-open');
      setDrawerState(willOpen, false);

      if (willOpen) {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setTimeout(() => {
          drawer.scrollIntoView({
            behavior: prefersReduced ? 'auto' : 'smooth',
            block: 'nearest'
          });
        }, 180);
      }
    });

    // Auto-cierre inteligente: cuando el usuario ya pasó la carta entera hacia abajo,
    // se cierra en silencio compensando scrollY para evitar cualquier salto visual.
    let scrollTicking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (scrollTicking || !drawer.classList.contains('is-open')) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
          scrollTicking = false;
          if (!drawer.classList.contains('is-open')) return;
          const rect = drawer.getBoundingClientRect();
          // Solo cerrar cuando toda la carta ya salió por arriba del viewport
          if (rect.bottom < -40) {
            const style = window.getComputedStyle(drawer);
            const marginTop = parseFloat(style.marginTop) || 0;
            const collapsedHeight = rect.height + marginTop;
            setDrawerState(false, true);
            window.scrollTo({
              top: Math.max(0, window.scrollY - collapsedHeight),
              behavior: 'instant'
            });
          }
        });
      },
      { passive: true }
    );
  }
});
