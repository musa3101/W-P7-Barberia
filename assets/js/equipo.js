/**
 * equipo.js — Carrusel editorial TeamMemberCard (P7 Barber Master Studio)
 * Auto-rotación suave, selector numérico 01 · 02 · 03, flechas y swipe táctil.
 */
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('tmc-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.tmc-slide'));
  const dots = Array.from(carousel.querySelectorAll('[data-tmc-goto]'));
  const prevBtns = Array.from(carousel.querySelectorAll('[data-tmc-prev]'));
  const nextBtns = Array.from(carousel.querySelectorAll('[data-tmc-next]'));
  if (slides.length < 2) return;

  let current = 0;
  let timer = null;
  const INTERVAL_MS = 6500;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const showSlide = (index) => {
    const next = (index + slides.length) % slides.length;
    if (next === current) return;

    slides.forEach((slide, i) => {
      const active = i === next;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    dots.forEach((dot, i) => {
      const active = i === next;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    current = next;
  };

  const stopAuto = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const startAuto = () => {
    stopAuto();
    if (reducedMotion) return;
    timer = window.setInterval(() => showSlide(current + 1), INTERVAL_MS);
  };

  prevBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      showSlide(current - 1);
      startAuto();
    });
  });

  nextBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      showSlide(current + 1);
      startAuto();
    });
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.dataset.tmcGoto);
      if (!Number.isNaN(idx)) {
        showSlide(idx);
        startAuto();
      }
    });
  });

  // Pausa al interactuar con ratón o foco
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', startAuto);

  // Soporte táctil swipe horizontal
  let startX = 0;
  let startY = 0;
  carousel.addEventListener(
    'touchstart',
    (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      stopAuto();
    },
    { passive: true }
  );

  carousel.addEventListener(
    'touchend',
    (e) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        showSlide(dx < 0 ? current + 1 : current - 1);
      }
      startAuto();
    },
    { passive: true }
  );

  startAuto();
});
