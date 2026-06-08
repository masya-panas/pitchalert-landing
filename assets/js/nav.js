/**
 * nav.js — Adds .scrolled to .site-nav when page is scrolled past the hero,
 * triggering the solid/blur background (transparent over hero, dark when scrolled).
 */

(function () {
  'use strict';

  var nav = document.querySelector('.site-nav');
  if (!nav) { return; }

  function update() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // run on load in case page is already scrolled
}());
