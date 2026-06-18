(() => {
  'use strict';

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const stages = [
    {
      label: 'Stage 01 of 06',
      title: 'Research',
      copy: 'Clarify goal, audience, references, content, competitors, and success criteria before touching the interface.',
      deliverables: ['Challenge brief', 'Site map', 'Reference audit']
    },
    {
      label: 'Stage 02 of 06',
      title: 'Strategy',
      copy: 'Turn the goal into a section plan, conversion path, visual direction, and launch checklist.',
      deliverables: ['Information architecture', 'CTA map', 'Content plan']
    },
    {
      label: 'Stage 03 of 06',
      title: 'Design',
      copy: 'Build a premium visual system with spacing, typography, surfaces, motion, and responsive behavior.',
      deliverables: ['Hero concept', 'Component style', 'Responsive rules']
    },
    {
      label: 'Stage 04 of 06',
      title: 'Development',
      copy: 'Code clean static sections, interactive cards, validated forms, command palette, and accessible navigation.',
      deliverables: ['HTML/CSS/JS', 'Interactions', 'Editable files']
    },
    {
      label: 'Stage 05 of 06',
      title: 'Optimization',
      copy: 'Tighten performance, metadata, reduced-motion support, semantic structure, links, and content accuracy.',
      deliverables: ['SEO meta', 'Syntax checks', 'Accessibility pass']
    },
    {
      label: 'Stage 06 of 06',
      title: 'Launch',
      copy: 'Ship to your domain, verify forms and links, check mobile views, and keep the project ready for future edits.',
      deliverables: ['Deploy guide', 'QA report', 'Handoff notes']
    }
  ];

  const initLoader = () => {
    window.addEventListener('load', () => {
      setTimeout(() => document.body.classList.add('loaded'), 220);
    });
  };

  const initScrollProgress = () => {
    const bar = qs('[data-scroll-progress]');
    if (!bar) return;
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
      bar.style.width = `${progress}%`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  };

  const initHeader = () => {
    const header = qs('[data-header]');
    const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  };

  const initTheme = () => {
    const key = 'hamzah-theme';
    const toggle = qs('[data-theme-toggle]');
    const updatePressed = () => toggle?.setAttribute('aria-pressed', document.documentElement.getAttribute('data-theme') === 'light' ? 'true' : 'false');
    const saved = localStorage.getItem(key);
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    updatePressed();

    toggle?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      if (current === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(key, 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem(key, 'light');
      }
      updatePressed();
    });
  };

  const initMobileMenu = () => {
    const toggle = qs('[data-menu-toggle]');
    const panel = qs('[data-mobile-panel]');
    if (!toggle || !panel) return;

    const close = () => {
      document.body.classList.remove('menu-open');
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-label', 'Open menu');
    };

    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      panel.setAttribute('aria-hidden', String(!open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    qsa('a', panel).forEach((link) => link.addEventListener('click', close));
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  };

  const initReveal = () => {
    const items = qsa('.reveal, .skill-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    items.forEach((item) => observer.observe(item));
  };

  const initCounters = () => {
    const counters = qsa('[data-counter]');
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const animate = (el) => {
      const target = Number(el.dataset.counter || 0);
      const start = performance.now();
      const duration = 1100;
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = String(Math.round(target * easeOut(progress)));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((counter) => observer.observe(counter));
  };

  const initSkillFilters = () => {
    const buttons = qsa('[data-filter]');
    const cards = qsa('.skill-card');
    cards.forEach((card) => card.style.setProperty('--skill-level', `${card.dataset.level || 0}%`));

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        buttons.forEach((item) => item.classList.toggle('active', item === button));
        cards.forEach((card) => {
          const shouldShow = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('hide', !shouldShow);
        });
      });
    });
  };

  const initProcess = () => {
    const buttons = qsa('[data-stage]');
    const card = qs('[data-stage-card]');
    if (!buttons.length || !card) return;

    const renderStage = (index) => {
      const stage = stages[index] || stages[0];
      buttons.forEach((button) => button.classList.toggle('active', Number(button.dataset.stage) === index));
      card.innerHTML = `
        <span class="stage-label">${stage.label}</span>
        <h3>${stage.title}</h3>
        <p>${stage.copy}</p>
        <ul>${stage.deliverables.map((item) => `<li>${item}</li>`).join('')}</ul>
      `;
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => renderStage(Number(button.dataset.stage)));
    });
  };

  const initDemoHub = () => {
    const cards = qsa('[data-demo-card]');
    if (!cards.length) return;
    const search = qs('[data-demo-search]');
    const buttons = qsa('[data-demo-filter]');
    const count = qs('[data-demo-count]');
    let active = 'all';

    const update = () => {
      const term = (search?.value || '').trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const categoryMatch = active === 'all' || card.dataset.category === active;
        const titleMatch = !term || (card.dataset.title || '').includes(term);
        const show = categoryMatch && titleMatch;
        card.classList.toggle('hide', !show);
        if (show) visible += 1;
      });
      if (count) count.textContent = String(visible);
    };

    search?.addEventListener('input', update);
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        active = button.dataset.demoFilter || 'all';
        buttons.forEach((item) => item.classList.toggle('active', item === button));
        update();
      });
    });
    update();
  };

  const initContactForm = () => {
    // The homepage now uses a direct email copy block. Keep the legacy handler inactive.
    const legacyForm = qs('[data-legacy-contact-form]');
    if (!legacyForm) return;
  };

  const initPlanIntentLinks = () => {
    const key = 'hamzah-selected-plan';
    const labels = {
      basic: 'Basic Website Plan',
      complete: 'Complete Website Plan'
    };
    const updateSelectedPlan = (plan) => {
      const label = labels[plan] || 'choose a plan above';
      qsa('[data-selected-plan-label]').forEach((node) => {
        node.textContent = label;
      });
    };
    try { updateSelectedPlan(sessionStorage.getItem(key)); } catch (_) { updateSelectedPlan(''); }
    qsa('[data-plan-intent]').forEach((link) => {
      link.addEventListener('click', () => {
        const plan = link.dataset.planIntent;
        if (!['basic', 'complete'].includes(plan)) return;
        try { sessionStorage.setItem(key, plan); } catch (_) {}
        updateSelectedPlan(plan);
      });
    });
  };

  const initCopyEmail = () => {
    const buttons = qsa('[data-copy-email]');
    if (!buttons.length) return;
    buttons.forEach((button) => {
      const originalText = button.textContent;
      button.addEventListener('click', async () => {
        const email = 'hamzahfullstack@gmail.com';
        const status = qs('[data-copy-status]');
        try {
          await navigator.clipboard.writeText(email);
          button.textContent = 'Copied';
          if (status) status.textContent = 'Email copied. Paste it in your inbox and send your brief.';
          setTimeout(() => { button.textContent = originalText || 'Copy Email'; }, 1400);
        } catch {
          button.textContent = email;
          if (status) status.textContent = email;
          setTimeout(() => { button.textContent = originalText || 'Copy Email'; }, 2200);
        }
      });
    });
  };


  const initIntakeTemplates = () => {
    const buttons = qsa('[data-intake-template]');
    if (!buttons.length) return;
    const type = qs('#type');
    const message = qs('#message');
    const count = qs('[data-char-count]');
    const templates = {
      business: {
        type: 'Portfolio / landing page',
        message: 'Project type: Business website\nGoal: Present services clearly and make it easy for customers to contact me.\nNeeded sections: Hero, services, proof/trust, FAQ, contact.\nReference links: [add links]\nDeadline or launch goal: [add date/goal]'
      },
      portfolio: {
        type: 'Portfolio / landing page',
        message: 'Project type: Portfolio website\nGoal: Show my work, identity, skills, and a strong contact path.\nNeeded sections: Hero, selected work, case study proof, about, contact.\nReference links: [add links]\nDeadline or launch goal: [add date/goal]'
      },
      store: {
        type: 'UI polish / rebuild',
        message: 'Project type: Storefront-style website\nGoal: Present products, categories, offers, and inquiry/purchase paths.\nNeeded sections: Hero, product cards, categories, offer/FAQ, contact.\nReference links: [add links]\nDeadline or launch goal: [add date/goal]'
      },
      dashboard: {
        type: 'Admin panel',
        message: 'Project type: Dashboard or product interface\nGoal: Create a polished static interface preview for an app, tool, or admin panel.\nNeeded sections: Dashboard preview, feature cards, UI modules, contact/handoff notes.\nReference links: [add links]\nDeadline or launch goal: [add date/goal]'
      }
    };
    buttons.forEach((button) => button.addEventListener('click', () => {
      const template = templates[button.dataset.intakeTemplate] || templates.business;
      if (type) {
        [...type.options].forEach((option) => { if (option.textContent === template.type) type.value = option.value || option.textContent; });
        type.classList.remove('invalid');
      }
      if (message) {
        message.value = template.message;
        message.classList.remove('invalid');
        if (count) count.textContent = String(message.value.length);
        message.focus({ preventScroll: true });
      }
    }));
  };

  const initCommandPalette = () => {
    const openButtons = qsa('[data-command-open]');
    const closeButton = qs('[data-command-close]');
    const palette = qs('[data-command-palette]');
    if (!openButtons.length || !palette) return;
    const search = qs('[data-command-search]', palette);
    const items = qsa('[data-command-item]', palette);
    const groups = qsa('[data-command-group]', palette);
    const empty = qs('[data-command-empty]', palette);
    let lastOpenButton = openButtons[0];

    const updateFilter = () => {
      const query = (search?.value || '').trim().toLowerCase();
      let visibleCount = 0;
      items.forEach((item) => {
        const haystack = `${item.textContent || ''} ${item.dataset.commandKeywords || ''}`.toLowerCase();
        const show = !query || haystack.includes(query);
        item.hidden = !show;
        if (show) visibleCount += 1;
      });
      groups.forEach((group) => {
        const visibleItems = qsa('[data-command-item]', group).some((item) => !item.hidden);
        group.hidden = !visibleItems;
      });
      if (empty) empty.hidden = visibleCount !== 0;
    };

    const open = (trigger = lastOpenButton) => {
      lastOpenButton = trigger;
      palette.classList.add('open');
      palette.setAttribute('aria-hidden', 'false');
      document.body.classList.add('palette-open');
      if (search) search.value = '';
      updateFilter();
      (search || qs('a', palette))?.focus();
    };
    const close = () => {
      palette.classList.remove('open');
      palette.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('palette-open');
      lastOpenButton?.focus({ preventScroll: true });
    };

    openButtons.forEach((button) => button.addEventListener('click', () => open(button)));
    closeButton?.addEventListener('click', close);
    search?.addEventListener('input', updateFilter);
    items.forEach((link) => link.addEventListener('click', close));
    palette.addEventListener('click', (event) => {
      if (event.target === palette) close();
    });
    window.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === 'k') {
        event.preventDefault();
        palette.classList.contains('open') ? close() : open();
      }
      if (event.key === 'Escape' && palette.classList.contains('open')) close();
    });
  };


  const initProjectFit = () => {
    const buttons = qsa('[data-fit-option]');
    const result = qs('[data-fit-result]');
    if (!buttons.length || !result) return;
    const content = {
      business: {
        title: 'Business website with trust-focused homepage.',
        copy: 'Best when a service, local business, or brand needs clear positioning, service explanation, FAQ, and easy contact paths.',
        items: ['Hero and trust structure', 'Services and packages', 'FAQ and contact brief']
      },
      portfolio: {
        title: 'Portfolio with work proof and strong identity.',
        copy: 'Best when a creator, student, freelancer, or developer needs selected work, project stories, skills, and a memorable personal brand.',
        items: ['Hero identity system', 'Selected work cards', 'About and contact path']
      },
      store: {
        title: 'Storefront-style layout for products and offers.',
        copy: 'Best when the goal is to present categories, product cards, offers, policies, and purchase-ready structure before adding a real checkout later.',
        items: ['Category and product cards', 'Offer and FAQ sections', 'Manual contact or future checkout path']
      },
      dashboard: {
        title: 'Dashboard or product interface concept.',
        copy: 'Best when a SaaS idea, admin panel, or tool needs a polished static interface preview, feature sections, onboarding screens, and UI components.',
        items: ['Dashboard preview screens', 'Feature and module cards', 'Responsive UI system']
      }
    };
    const render = (key) => {
      const data = content[key] || content.business;
      buttons.forEach((button) => {
        const active = button.dataset.fitOption === key;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
      });
      const body = qs('div', result);
      if (!body) return;
      body.innerHTML = `<span>Recommended direction</span><h3>${data.title}</h3><p>${data.copy}</p><ul>${data.items.map((item) => `<li>${item}</li>`).join('')}</ul><a class="btn btn-primary" href="#contact">Send this direction</a>`;
    };
    buttons.forEach((button) => button.addEventListener('click', () => render(button.dataset.fitOption || 'business')));
  };

  const initTilt = () => {
    const card = qs('.tilt-card');
    if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  };

  initLoader();
  initScrollProgress();
  initHeader();
  initTheme();
  initMobileMenu();
  initReveal();
  initCounters();
  initSkillFilters();
  initProcess();
  initDemoHub();
  initContactForm();
  initPlanIntentLinks();
  initCopyEmail();
  initIntakeTemplates();
  initCommandPalette();
  initProjectFit();
  initTilt();
})();

(() => {
  'use strict';
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const initParallax = () => {
    if (prefersReduced) return;
    const items = $$('[data-parallax]');
    if (!items.length) return;
    const onScroll = () => {
      const center = window.innerHeight * 0.5;
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const speed = Number(item.dataset.parallax || 10);
        const distance = (rect.top + rect.height * 0.5 - center) / center;
        item.style.transform = `translate3d(0, ${distance * speed * -1}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  };

  const initSpotlight = () => {
    if (prefersReduced) return;
    $$('.spotlight-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      });
    });
  };

  window.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initSpotlight();
  });
})();
