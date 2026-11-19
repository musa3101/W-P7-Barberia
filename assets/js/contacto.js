/**
 * P7 Barber Master Studio · Contacto & FAQs (Adaptación 21st.dev Ruixen UI)
 * Acordeón colapsable + Efecto BlurredStagger por caracteres
 */

(function () {
  'use strict';

  function initBlurredStagger() {
    const targets = document.querySelectorAll('.blurred-stagger[data-raw-text]');

    targets.forEach((el) => {
      const text = el.getAttribute('data-raw-text') || el.textContent.trim();
      el.setAttribute('aria-label', text);
      el.innerHTML = '';

      const words = text.split(' ');
      let charCounter = 0;

      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'blurred-word';

        const chars = word.split('');
        chars.forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'blurred-char';
          charSpan.textContent = char;
          charSpan.style.setProperty('--char-i', charCounter);
          charCounter++;
          wordSpan.appendChild(charSpan);
        });

        el.appendChild(wordSpan);

        if (wordIndex < words.length - 1) {
          const space = document.createTextNode(' ');
          el.appendChild(space);
          charCounter++;
        }
      });
    });
  }

  function initAccordion() {
    const items = Array.from(document.querySelectorAll('.faq-item'));

    items.forEach((item, index) => {
      const trigger = item.querySelector('.faq-trigger');
      const panel = item.querySelector('.faq-panel');

      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.getAttribute('data-state') === 'open';

        items.forEach((other) => {
          if (other !== item && other.getAttribute('data-state') === 'open') {
            closeItem(other);
          }
        });

        if (isOpen) {
          closeItem(item);
        } else {
          openItem(item);
        }
      });

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (index + 1) % items.length;
          items[nextIndex].querySelector('.faq-trigger')?.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (index - 1 + items.length) % items.length;
          items[prevIndex].querySelector('.faq-trigger')?.focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          items[0].querySelector('.faq-trigger')?.focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          items[items.length - 1].querySelector('.faq-trigger')?.focus();
        }
      });
    });

    function openItem(item) {
      item.setAttribute('data-state', 'open');
      const trigger = item.querySelector('.faq-trigger');
      const panel = item.querySelector('.faq-panel');
      trigger?.setAttribute('aria-expanded', 'true');
      panel?.removeAttribute('aria-hidden');

      const chars = item.querySelectorAll('.blurred-char');
      chars.forEach((c) => {
        c.style.animation = 'none';
        void c.offsetWidth;
        c.style.animation = '';
      });
    }

    function closeItem(item) {
      item.setAttribute('data-state', 'closed');
      const trigger = item.querySelector('.faq-trigger');
      const panel = item.querySelector('.faq-panel');
      trigger?.setAttribute('aria-expanded', 'false');
      panel?.setAttribute('aria-hidden', 'true');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initBlurredStagger();
      initAccordion();
    });
  } else {
    initBlurredStagger();
    initAccordion();
  }
})();
