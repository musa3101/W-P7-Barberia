/**
 * sobre-carousel.js — Galería 1 infinita interactiva (Autoplay + Dedo en móvil + Ratón en PC)
 * P7 Barber Master Studio · JS puro 60fps
 */
document.addEventListener('DOMContentLoaded', () => {
  const marquee = document.querySelector('.galeria-marquee');
  if (!marquee) return;

  const track = marquee.querySelector('.galeria-marquee-track');
  const firstGroup = marquee.querySelector('.galeria-marquee-group');
  if (!track || !firstGroup) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AUTO_SPEED = 0.55; // px por frame a 60fps

  let groupWidth = firstGroup.getBoundingClientRect().width || 1;
  let offset = 0;
  let velocity = 0;
  let isPointerDown = false;
  let isHovering = false;
  let isHorizontalDrag = false;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastTime = 0;
  let resumeTimer = 0;
  let pausedByUser = false;

  const normalizeOffset = () => {
    if (groupWidth <= 0) return;
    offset = ((offset % groupWidth) + groupWidth) % groupWidth;
  };

  const render = () => {
    normalizeOffset();
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  };

  const measure = () => {
    groupWidth = firstGroup.getBoundingClientRect().width || 1;
    render();
  };

  if ('ResizeObserver' in window) {
    new ResizeObserver(measure).observe(firstGroup);
  }
  window.addEventListener('resize', measure, { passive: true });
  measure();

  /* Ratón (PC) */
  marquee.addEventListener('mouseenter', () => {
    isHovering = true;
  });

  marquee.addEventListener('mouseleave', () => {
    isHovering = false;
    if (isPointerDown) {
      isPointerDown = false;
      marquee.classList.remove('is-dragging');
    }
  });

  marquee.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return; // Touch se gestiona con eventos táctiles nativos
    isPointerDown = true;
    isHorizontalDrag = true;
    pausedByUser = true;
    clearTimeout(resumeTimer);
    startX = e.clientX;
    lastX = e.clientX;
    lastTime = performance.now();
    velocity = 0;
    marquee.classList.add('is-dragging');
    if (typeof marquee.setPointerCapture === 'function') {
      try { marquee.setPointerCapture(e.pointerId); } catch (_) {}
    }
  });

  marquee.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' || !isPointerDown) return;
    const now = performance.now();
    const dx = e.clientX - lastX;
    const dt = Math.max(8, now - lastTime);
    offset -= dx;
    velocity = (-dx / dt) * 16;
    lastX = e.clientX;
    lastTime = now;
    render();
  });

  const endMouseDrag = () => {
    if (!isPointerDown) return;
    isPointerDown = false;
    marquee.classList.remove('is-dragging');
    clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      pausedByUser = false;
    }, 900);
  };

  marquee.addEventListener('pointerup', endMouseDrag);
  marquee.addEventListener('pointercancel', endMouseDrag);

  /* Trackpad / rueda horizontal en ordenador */
  marquee.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 2) {
      e.preventDefault();
      offset += e.deltaX;
      pausedByUser = true;
      clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        pausedByUser = false;
      }, 900);
      render();
    }
  }, { passive: false });

  /* Táctil (Móvil): permite deslizar adelante/atrás sin bloquear el scroll vertical */
  let touchActive = false;
  let touchDirectionLocked = false;

  marquee.addEventListener('touchstart', (e) => {
    if (!e.touches.length) return;
    touchActive = true;
    touchDirectionLocked = false;
    isHorizontalDrag = false;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    lastX = startX;
    lastTime = performance.now();
    velocity = 0;
    clearTimeout(resumeTimer);
  }, { passive: true });

  marquee.addEventListener('touchmove', (e) => {
    if (!touchActive || !e.touches.length) return;
    const tx = e.touches[0].clientX;
    const ty = e.touches[0].clientY;

    if (!touchDirectionLocked) {
      const adx = Math.abs(tx - startX);
      const ady = Math.abs(ty - startY);
      if (adx > 6 || ady > 6) {
        touchDirectionLocked = true;
        isHorizontalDrag = adx > ady;
      }
    }

    if (isHorizontalDrag) {
      e.preventDefault();
      pausedByUser = true;
      const now = performance.now();
      const dx = tx - lastX;
      const dt = Math.max(8, now - lastTime);
      offset -= dx;
      velocity = (-dx / dt) * 16;
      lastX = tx;
      lastTime = now;
      render();
    }
  }, { passive: false });

  const endTouch = () => {
    if (!touchActive) return;
    touchActive = false;
    touchDirectionLocked = false;
    isHorizontalDrag = false;
    clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      pausedByUser = false;
    }, 900);
  };

  marquee.addEventListener('touchend', endTouch, { passive: true });
  marquee.addEventListener('touchcancel', endTouch, { passive: true });

  /* Bucle 60fps: inercia al soltar + autoplay continuo */
  let lastFrame = performance.now();
  const tick = (now) => {
    const dtFactor = Math.min(2, (now - lastFrame) / 16.67);
    lastFrame = now;

    if (!isPointerDown && !touchActive) {
      if (Math.abs(velocity) > 0.08) {
        offset += velocity * dtFactor;
        velocity *= 0.92;
        render();
      } else {
        velocity = 0;
        if (!reduced && !isHovering && !pausedByUser) {
          offset += AUTO_SPEED * dtFactor;
          render();
        }
      }
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
});
