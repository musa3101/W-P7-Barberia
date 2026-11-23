/**
 * P7 Barber Master Studio — Motor i18n (ES / EN / DE)
 * - Persiste idioma en localStorage ('p7_lang') y soporta ?lang=es|en|de
 * - Traduce data-i18n (textContent), data-i18n-html (innerHTML),
 *   data-i18n-attr="attr:key;attr2:key2", y data-i18n-raw (BlurredStagger)
 * - Actualiza <html lang>, <title>, <meta name="description">, Open Graph
 * - Emite evento 'p7:langchange' para componentes dinámicos (header, trabajo, contacto, galeria)
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'p7_lang';
  const SUPPORTED = ['es', 'en', 'de'];

  function normalizeLang(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const code = raw.trim().toLowerCase().slice(0, 2);
    return SUPPORTED.includes(code) ? code : null;
  }

  function detectInitialLang() {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = normalizeLang(params.get('lang'));
      if (fromUrl) {
        try {
          window.localStorage.setItem(STORAGE_KEY, fromUrl);
        } catch (_) {}
        return fromUrl;
      }
    } catch (_) {}

    try {
      const stored = normalizeLang(window.localStorage.getItem(STORAGE_KEY));
      if (stored) return stored;
    } catch (_) {}

    return 'es';
  }

  let currentLang = detectInitialLang();

  function getDict(lang) {
    const dicts = window.P7_I18N_DICT || {};
    return dicts[lang] || dicts.es || {};
  }

  function t(key, params, langOverride) {
    const lang = langOverride || currentLang;
    const dict = getDict(lang);
    const fallback = getDict('es');
    let value = dict[key];
    if (value === undefined) value = fallback[key];
    if (value === undefined) return key;
    if (params && typeof value === 'string') {
      Object.keys(params).forEach((k) => {
        value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(params[k]));
      });
    }
    return value;
  }

  function applyMeta(lang) {
    document.documentElement.setAttribute('lang', lang);
    const pageKey = document.documentElement.getAttribute('data-i18n-page') ||
      document.body?.getAttribute('data-i18n-page') ||
      'home';

    const titleKey = `meta.${pageKey}.title`;
    const descKey = `meta.${pageKey}.desc`;
    const ogTitleKey = `meta.${pageKey}.ogTitle`;
    const ogDescKey = `meta.${pageKey}.ogDesc`;
    const ogLocaleKey = `meta.${pageKey}.ogLocale`;

    const title = t(titleKey, null, lang);
    if (title !== titleKey) document.title = title;

    const descMeta = document.querySelector('meta[name="description"]');
    const desc = t(descKey, null, lang);
    if (descMeta && desc !== descKey) descMeta.setAttribute('content', desc);

    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    const ogTitle = t(ogTitleKey, null, lang);
    if (ogTitleMeta && ogTitle !== ogTitleKey) ogTitleMeta.setAttribute('content', ogTitle);

    const ogDescMeta = document.querySelector('meta[property="og:description"]');
    const ogDesc = t(ogDescKey, null, lang);
    if (ogDescMeta && ogDesc !== ogDescKey) ogDescMeta.setAttribute('content', ogDesc);

    const ogLocaleMeta = document.querySelector('meta[property="og:locale"]');
    const ogLocale = t(ogLocaleKey, null, lang);
    if (ogLocaleMeta && ogLocale !== ogLocaleKey) ogLocaleMeta.setAttribute('content', ogLocale);
  }

  function applyDom(lang) {
    applyMeta(lang);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const val = t(key, null, lang);
      if (val !== key) {
        el.textContent = val;
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (!key) return;
      const val = t(key, null, lang);
      if (val !== key) {
        el.innerHTML = val;
      }
    });

    document.querySelectorAll('[data-i18n-raw]').forEach((el) => {
      const key = el.getAttribute('data-i18n-raw');
      if (!key) return;
      const val = t(key, null, lang);
      if (val !== key) {
        el.setAttribute('data-raw-text', val);
        el.textContent = val;
      }
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const spec = el.getAttribute('data-i18n-attr');
      if (!spec) return;
      spec.split(';').forEach((pair) => {
        const trimmed = pair.trim();
        if (!trimmed) return;
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx === -1) return;
        const attr = trimmed.slice(0, colonIdx).trim();
        const key = trimmed.slice(colonIdx + 1).trim();
        if (!attr || !key) return;
        const val = t(key, null, lang);
        if (val !== key) {
          el.setAttribute(attr, val);
        }
      });
    });

    // Sincronizar estado activo de botones selector de idioma
    document.querySelectorAll('[data-lang]').forEach((btn) => {
      const isMatch = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', isMatch);
      if (isMatch) {
        btn.setAttribute('aria-current', 'true');
      } else {
        btn.removeAttribute('aria-current');
      }
    });
  }

  function setLang(nextLang, options = {}) {
    const normalized = normalizeLang(nextLang);
    if (!normalized) return;
    currentLang = normalized;

    try {
      window.localStorage.setItem(STORAGE_KEY, currentLang);
    } catch (_) {}

    if (options.updateUrl !== false) {
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has('lang')) {
          url.searchParams.set('lang', currentLang);
          window.history.replaceState(null, '', url.toString());
        }
      } catch (_) {}
    }

    applyDom(currentLang);
    document.dispatchEvent(
      new CustomEvent('p7:langchange', { detail: { lang: currentLang } })
    );
  }

  function bindLangButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('[data-lang]') : null;
      if (!btn) return;
      const lang = btn.getAttribute('data-lang');
      if (lang) {
        setLang(lang);
      }
    });
  }

  function init() {
    bindLangButtons();
    applyDom(currentLang);
    document.dispatchEvent(
      new CustomEvent('p7:langchange', { detail: { lang: currentLang } })
    );
  }

  window.P7I18n = {
    t,
    setLang,
    getLang: () => currentLang,
    apply: () => applyDom(currentLang),
    supported: SUPPORTED.slice()
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
