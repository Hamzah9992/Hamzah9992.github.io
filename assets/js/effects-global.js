(() => {
  'use strict';

  const doc = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  // Add this class only when JavaScript is active. Without JS, content remains visible.
  doc.classList.add('effects-ready');

  const ensureRevealTargets = () => {
    all('section, .capability-card, .pricing-card, .portfolio-showcase-card, .contact-side-card, .flow-rail article, .delivery-timeline div, .rebuild-quality-strip span, .deck-metrics div, .plan-pill, .card, .step, .panel, .footer-cta, .contact-command-form, .contact-command-side, .contact-direct-card, .contact-brief-card, .section-head, .short-section-head').forEach((item, index) => {
      if (!item.classList.contains('reveal')) item.classList.add('reveal');
      item.style.setProperty('--reveal-index', index % 8);
    });
  };

  const initReveal = () => {
    const targets = all('.reveal');
    if (!targets.length) return;
    const show = (target) => target.classList.add('visible', 'is-visible');
    const scanVisible = () => {
      const bottom = window.innerHeight * 0.92;
      targets.forEach((target) => {
        if (target.classList.contains('visible')) return;
        const rect = target.getBoundingClientRect();
        if (rect.top < bottom && rect.bottom > 0) show(target);
      });
    };
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(show);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    targets.forEach((target) => observer.observe(target));
    let ticking = false;
    const scheduleScan = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { scanVisible(); ticking = false; });
    };
    window.addEventListener('scroll', scheduleScan, { passive: true });
    window.addEventListener('resize', scheduleScan);
    window.requestAnimationFrame(scanVisible);
    window.setTimeout(scanVisible, 350);
  };

  const createAmbient = () => {
    if (document.querySelector('[data-fx-ambient]')) return;
    const ambient = document.createElement('div');
    ambient.className = 'fx-ambient';
    ambient.dataset.fxAmbient = '';
    ambient.setAttribute('aria-hidden', 'true');
    const count = reduceMotion ? 6 : 22;
    for (let i = 0; i < count; i += 1) {
      const dot = document.createElement('span');
      dot.className = 'fx-particle';
      dot.style.setProperty('--i', i);
      dot.style.setProperty('--x', `${4 + ((i * 19) % 92)}%`);
      dot.style.setProperty('--y', `${7 + ((i * 31) % 86)}%`);
      dot.style.setProperty('--s', `${5 + (i % 6) * 3}px`);
      dot.style.setProperty('--d', `${10 + (i % 7) * 2}s`);
      ambient.appendChild(dot);
    }
    document.body.prepend(ambient);
  };

  const initPointerGlow = () => {
    if (reduceMotion || document.querySelector('[data-fx-cursor]')) return;
    const glow = document.createElement('div');
    glow.className = 'fx-cursor';
    glow.dataset.fxCursor = '';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    const tick = () => {
      x += (tx - x) * 0.13;
      y += (ty - y) * 0.13;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', (event) => {
      tx = event.clientX;
      ty = event.clientY;
      doc.style.setProperty('--pointer-x', `${event.clientX}px`);
      doc.style.setProperty('--pointer-y', `${event.clientY}px`);
    }, { passive: true });
    tick();
  };

  const initInteractiveCards = () => {
    if (reduceMotion) return;
    const selector = '.capability-card,.pricing-card,.portfolio-showcase-card,.trust-card,.card,.step,.panel,.footer-cta,.contact-side-card,.plan-pill,.contact-command-form,.contact-direct-card,.contact-brief-card';
    all(selector).forEach((card) => {
      card.classList.add('fx-card');
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
        const rx = ((y / rect.height) - 0.5) * -4;
        const ry = ((x / rect.width) - 0.5) * 4;
        card.style.setProperty('--tilt', `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt', 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0)');
      });
    });
  };

  const initScrollDepth = () => {
    const progress = document.querySelector('[data-scroll-progress]');
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / max));
      doc.style.setProperty('--scroll-ratio', ratio.toFixed(4));
      if (progress) progress.style.width = `${ratio * 100}%`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  };

  const initVideoReadiness = () => {
    all('video').forEach((video) => {
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('aria-hidden', 'true');
      if (reduceMotion) {
        video.pause?.();
        return;
      }
      const play = video.play?.();
      if (play && typeof play.catch === 'function') play.catch(() => {});
    });
  };

  const initNavShadow = () => {
    const navs = all('.short-header,.showcase-nav');
    const update = () => navs.forEach((nav) => nav.classList.toggle('fx-nav-scrolled', window.scrollY > 18));
    update();
    window.addEventListener('scroll', update, { passive: true });
  };

  const initImageMotion = () => {
    all('.capability-card img,.portfolio-showcase-card img,.card img,.media-stack img').forEach((img) => img.classList.add('fx-image'));
  };

  const initCopyPolish = () => {
    all('h1,h2,h3,p,span,strong,small,a,li,button').forEach((node) => {
      if (!node.childElementCount && node.textContent) {
        node.textContent = node.textContent
          .replace(/\u00c2\u00b7/g, '-')
          .replace(/plan-first inquiry/gi, 'email-first inquiry');
      }
    });
  };

  const init = () => {
    initCopyPolish();
    ensureRevealTargets();
    createAmbient();
    initReveal();
    initPointerGlow();
    initInteractiveCards();
    initScrollDepth();
    initVideoReadiness();
    initNavShadow();
    initImageMotion();
    document.body.classList.add('fx-ready');
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
