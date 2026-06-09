/**
 * i18n.js — Landing page internationalization runtime.
 *
 * Language resolution order:
 *   1. localStorage key "pitchalert_lang" (user's saved choice)
 *   2. navigator.languages / navigator.language mapped to supported locale
 *   3. Default: "en"
 *
 * Dictionaries are loaded from window.__I18N_DATA__ (set by i18n-data.js,
 * loaded synchronously before this script) so no async fetch is needed
 * and there is zero Flash Of Untranslated Content.
 *
 * Public API (used by the language switcher):
 *   window.i18n.setLang(code)  — persists choice, re-applies translations
 *   window.i18n.getLang()      — returns current locale code
 */

(function () {
  'use strict';

  var SUPPORTED = ['en', 'es', 'pt-br'];
  var LS_KEY    = 'pitchalert_lang';
  var data      = window.__I18N_DATA__ || {};

  /* ── Language resolution ─────────────────────────────────────────────── */

  function mapBrowserLang(raw) {
    if (!raw) return null;
    var l = raw.toLowerCase();
    if (l.startsWith('pt')) return 'pt-br';
    if (l.startsWith('es')) return 'es';
    if (l.startsWith('en')) return 'en';
    return null;
  }

  function detectLang() {
    // 1. Saved user choice
    try {
      var saved = localStorage.getItem(LS_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (_) { /* localStorage blocked */ }

    // 2. Browser language list
    var langs = (navigator.languages && navigator.languages.length)
      ? Array.prototype.slice.call(navigator.languages)
      : [navigator.language || navigator.userLanguage || ''];

    for (var i = 0; i < langs.length; i++) {
      var mapped = mapBrowserLang(langs[i]);
      if (mapped) return mapped;
    }

    // 3. Default
    return 'en';
  }

  /* ── Translation lookup ──────────────────────────────────────────────── */

  function t(lang, key) {
    var dict = data[lang] || {};
    if (Object.prototype.hasOwnProperty.call(dict, key)) return dict[key];
    // Fallback to English
    var en = data['en'] || {};
    return Object.prototype.hasOwnProperty.call(en, key) ? en[key] : key;
  }

  /* ── Apply translations to the DOM ──────────────────────────────────── */

  function applyLang(lang) {
    // Update <html lang>
    document.documentElement.lang = lang === 'pt-br' ? 'pt-BR' : lang;

    // Text nodes: [data-i18n="key"]
    var textNodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < textNodes.length; i++) {
      var el  = textNodes[i];
      var key = el.getAttribute('data-i18n');
      var val = t(lang, key);
      // <title> is updated via document.title, not textContent, to avoid quirks
      if (el.tagName && el.tagName.toLowerCase() === 'title') {
        document.title = val;
        continue;
      }
      // Allow safe HTML for FAQ answers and pricing notes (contain <a> and <strong>)
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }

    // Attributes: [data-i18n-attr="attr1:key1,attr2:key2"]
    var attrNodes = document.querySelectorAll('[data-i18n-attr]');
    for (var j = 0; j < attrNodes.length; j++) {
      var node  = attrNodes[j];
      var pairs = node.getAttribute('data-i18n-attr').split(',');
      for (var k = 0; k < pairs.length; k++) {
        var pair  = pairs[k].trim().split(':');
        var attr  = pair[0].trim();
        var aKey  = pair.slice(1).join(':').trim(); // handle keys with colons (none here, but safe)
        if (attr && aKey) {
          node.setAttribute(attr, t(lang, aKey));
        }
      }
    }

    // <title> and <meta name="description"> — handled via data-i18n-attr on those elements,
    // but for safety also update them explicitly here if the attrs are present.
    var titleEl = document.querySelector('title[data-i18n-attr]');
    if (titleEl) {
      var titleAttr = titleEl.getAttribute('data-i18n-attr');
      // already handled above; skip to avoid double processing
    }

    // Update switcher active state
    updateSwitcher(lang);
  }

  /* ── Language switcher ───────────────────────────────────────────────── */

  function updateSwitcher(lang) {
    var btns = document.querySelectorAll('.lang-btn');
    for (var i = 0; i < btns.length; i++) {
      var btn = btns[i];
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('lang-btn--active', active);
      btn.setAttribute('aria-current', active ? 'true' : 'false');
    }
    // Update the current-language label displayed in the toggle
    var labels = document.querySelectorAll('.lang-switcher-current');
    for (var j = 0; j < labels.length; j++) {
      labels[j].textContent = lang.toUpperCase();
    }
  }

  /* ── Switcher dropdown toggle ────────────────────────────────────────── */

  function initSwitcherToggle() {
    var toggles = document.querySelectorAll('.lang-switcher-toggle');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].addEventListener('click', function (e) {
        e.stopPropagation();
        var parent = this.closest('.lang-switcher');
        if (!parent) return;
        var open = parent.classList.toggle('lang-switcher--open');
        this.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    // Close on outside click
    document.addEventListener('click', function () {
      var switchers = document.querySelectorAll('.lang-switcher--open');
      for (var i = 0; i < switchers.length; i++) {
        switchers[i].classList.remove('lang-switcher--open');
        var t2 = switchers[i].querySelector('.lang-switcher-toggle');
        if (t2) t2.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var switchers = document.querySelectorAll('.lang-switcher--open');
        for (var i = 0; i < switchers.length; i++) {
          switchers[i].classList.remove('lang-switcher--open');
          var t3 = switchers[i].querySelector('.lang-switcher-toggle');
          if (t3) { t3.setAttribute('aria-expanded', 'false'); t3.focus(); }
        }
      }
    });
  }

  /* ── Language button click handler ──────────────────────────────────── */

  function initLangButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-btn');
      if (!btn) return;
      var lang = btn.getAttribute('data-lang');
      if (!lang || SUPPORTED.indexOf(lang) === -1) return;
      e.stopPropagation();
      // Save and apply
      try { localStorage.setItem(LS_KEY, lang); } catch (_) {}
      currentLang = lang;
      applyLang(lang);
      // Close all dropdowns after selection
      var switchers = document.querySelectorAll('.lang-switcher--open');
      for (var i = 0; i < switchers.length; i++) {
        switchers[i].classList.remove('lang-switcher--open');
        var tgl = switchers[i].querySelector('.lang-switcher-toggle');
        if (tgl) tgl.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Boot ─────────────────────────────────────────────────────────────── */

  var currentLang = detectLang();

  document.addEventListener('DOMContentLoaded', function () {
    initSwitcherToggle();
    initLangButtons();
    applyLang(currentLang);
  });

  // Public API
  window.i18n = {
    setLang: function (lang) {
      if (SUPPORTED.indexOf(lang) === -1) return;
      try { localStorage.setItem(LS_KEY, lang); } catch (_) {}
      currentLang = lang;
      applyLang(lang);
    },
    getLang: function () { return currentLang; }
  };

}());
