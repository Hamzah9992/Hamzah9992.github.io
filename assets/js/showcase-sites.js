(() => {
  'use strict';
  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => [...root.querySelectorAll(s)];

  const progress = qs('[data-page-progress]');
  const updateProgress = () => {
    if (!progress) return;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.width = `${Math.min(100, Math.max(0, (window.scrollY / max) * 100))}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  const revealTargets = qsa('.card,.shot,.stat,.price,.conversion-map div,.experience-grid article,.cta,.mock,.lux-reveal,.visual-card,.menu-card,.booking-panel,.story-card,.timeline-step,.gallery-card,.hours-card,.cafe-reveal,.cafe-card,.product-tile,.order-panel,.loyalty-card,.cafe-gallery-card,.editorial-reveal,.realty-reveal,.saas-reveal,.fashion-reveal,.education-reveal,.clinic-reveal,.fitness-reveal,.fitness-card,.trainer-card,.proof-card,.booking-card,.legal-reveal,.legal-card,.attorney-card,.matter-card,.trust-card,.arch-reveal,.arch-card,.project-card,.process-note-card,.travel-reveal,.travel-card,.trip-card,.planning-note-card,.app-reveal,.app-card,.feature-card,.app-note,.finance-reveal,.finance-card,.solution-card,.proof-card,.beauty-reveal,.beauty-card,.stylist-card,.gallery-card,.detail-reveal,.detail-card,.coating-card,.badge-card,.coffee-reveal,.coffee-card,.roast-card,.brew-card,.construction-reveal,.construction-card,.safety-card,.project-card,.event-reveal,.event-card,.venue-card,.package-card,.proof-tile,.folio-card,.chapter-card,.story-note,.plate-card,.private-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((target) => observer.observe(target));

  const copy = qs('[data-copy-page]');
  copy?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      copy.textContent = 'Copied link';
      setTimeout(() => { copy.textContent = 'Copy demo link'; }, 1400);
    } catch {
      copy.textContent = 'Copy failed';
      setTimeout(() => { copy.textContent = 'Copy demo link'; }, 1400);
    }
  });
})();
