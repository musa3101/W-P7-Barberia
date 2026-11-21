/* =========================================================================
   P7 BARBER MASTER STUDIO — Controlador Cinta Recta (GPU translate3d)
   - Bucle infinito sin saltos ni solapes en móvil, tablet y desktop
   - Aceleración suave reactiva al scroll vertical
   - Pausado automáticamente con IntersectionObserver cuando no está visible
   ========================================================================= */

(function () {
  function initStraightRibbon() {
    const section = document.getElementById('p7-ribbon-section');
    const track = section?.querySelector('.p7-ribbon-track');
    const firstGroup = track?.querySelector('.p7-ribbon-group');
    if (!section || !track || !firstGroup) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    // Asegurar copias suficientes para cubrir incluso pantallas ultrawide
    let groupWidth = 0;

    function ensureCopies() {
      groupWidth = firstGroup.getBoundingClientRect().width;
      if (!groupWidth) return;
      const needed = Math.ceil((window.innerWidth * 2) / groupWidth) + 1;
      const current = track.querySelectorAll('.p7-ribbon-group').length;
      for (let i = current; i < needed; i++) {
        const clone = firstGroup.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      }
    }

    let x = 0;
    let scrollBoost = 0;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let isVisible = true;
    let isHovered = false;
    let rafId = null;

    const baseSpeedPxPerSec = 48; // Velocidad suave y constante (60Hz / 120Hz)

    window.addEventListener('scroll', () => {
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      scrollBoost = Math.max(-240, Math.min(240, scrollBoost + dy * 1.15));
    }, { passive: true });

    section.addEventListener('mouseenter', () => { isHovered = true; });
    section.addEventListener('mouseleave', () => { isHovered = false; });

    window.addEventListener('resize', ensureCopies, { passive: true });

    function tick(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (!groupWidth) ensureCopies();

      scrollBoost *= Math.pow(0.08, dt);
      const speed = (isHovered ? baseSpeedPxPerSec * 0.25 : baseSpeedPxPerSec) + scrollBoost;

      if (groupWidth > 0) {
        x -= speed * dt;
        if (x <= -groupWidth) x += groupWidth;
        if (x > 0) x -= groupWidth;
        track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
      }

      if (isVisible) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }

    function start() {
      ensureCopies();
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          isVisible = entries[0]?.isIntersecting ?? true;
          if (isVisible && rafId === null) {
            lastTime = performance.now();
            rafId = requestAnimationFrame(tick);
          }
        }, { rootMargin: '80px 0px' });
        io.observe(section);
      }
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStraightRibbon);
  } else {
    initStraightRibbon();
  }
})();
