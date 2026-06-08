/**
 * carousel.js — Vanilla JS carousel / slider.
 * Handles: prev/next buttons, dot indicators, keyboard nav,
 * touch/swipe, and auto-updates aria-hidden on slides.
 */

(function () {
  'use strict';

  var wrapper = document.querySelector('.carousel-wrapper');
  if (!wrapper) { return; }

  var track  = wrapper.querySelector('.carousel-track');
  var slides = wrapper.querySelectorAll('.carousel-slide');
  var dots   = wrapper.querySelectorAll('.carousel-dot');
  var btnPrev = wrapper.querySelector('.carousel-btn-prev');
  var btnNext = wrapper.querySelector('.carousel-btn-next');

  var total   = slides.length;
  var current = 0;

  function goTo(index) {
    if (index < 0) { index = total - 1; }
    if (index >= total) { index = 0; }
    current = index;

    track.style.transform = 'translateX(-' + (current * 100) + '%)';

    slides.forEach(function (slide, i) {
      slide.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
  }

  // Initial state
  goTo(0);

  if (btnPrev) {
    btnPrev.addEventListener('click', function () { goTo(current - 1); });
  }
  if (btnNext) {
    btnNext.addEventListener('click', function () { goTo(current + 1); });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); });
  });

  // Keyboard navigation when carousel is focused
  wrapper.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); }
    if (e.key === 'ArrowRight') { goTo(current + 1); }
  });

  // Touch / swipe support
  var touchStartX = null;

  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    if (touchStartX === null) { return; }
    var delta = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) < 40) { return; }  // ignore tiny swipes
    if (delta < 0) { goTo(current + 1); }
    else           { goTo(current - 1); }
  }, { passive: true });
}());
