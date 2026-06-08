/* Subtle parallax for the hero screenshot — it drifts slightly slower than the
   page as you scroll, giving depth. No hover/tilt, just a clean parallax image. */
(function () {
  var el = document.querySelector('.hero-screenshot-wrap');
  if (!el) return;

  // Respect users who prefer reduced motion.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ticking = false;

  function update() {
    var y = window.scrollY || window.pageYOffset || 0;
    var offset = Math.min(y * 0.15, 110); // lag behind scroll, capped
    el.style.transform = 'translate3d(0, ' + offset.toFixed(1) + 'px, 0)';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();
