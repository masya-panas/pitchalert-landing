/**
 * faq.js — Accordion behaviour for FAQ items.
 * Vanilla JS, no dependencies. Toggles .open class and aria-expanded.
 * Works for both single-column list and two-column layout (.faq-cols).
 */

(function () {
  'use strict';

  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      // Close all other items
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle the clicked item
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}());
