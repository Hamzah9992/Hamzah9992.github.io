(() => {
  'use strict';

  const prices = {
    basic: { inr: '₹9,999', usd: '$105' },
    basicPriorityFee: { inr: '₹3,999', usd: '$42' },
    basicPriority: { inr: '₹13,998', usd: '$147' },
    complete: { inr: '₹16,999', usd: '$179' },
    completePriorityFee: { inr: '₹5,999', usd: '$63' },
    completePriority: { inr: '₹22,998', usd: '$242' }
  };

  const validModes = Object.freeze(['inr', 'usd', 'both']);
  const cacheKey = 'hamzah-pricing-mode-v2';
  const cacheMaxAgeMs = 24 * 60 * 60 * 1000;
  const refreshIntervalMs = 30 * 1000;

  const defaultConfig = Object.freeze({
    endpoint: 'https://nyc.cloud.appwrite.io/v1',
    projectId: '69cfde7a0007f614642b',
    pricingFunctionId: 'pricing-mode',
    pricingEdgeUrl: ''
  });

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const cfg = () => ({ ...defaultConfig, ...(window.HAMZAH_SITE_CONFIG || {}) });
  const isValidMode = (mode) => validModes.includes(mode);

  const readCachedPricingMode = () => {
    try {
      const raw = window.localStorage?.getItem(cacheKey);
      if (!raw) return '';
      const cached = JSON.parse(raw);
      if (!isValidMode(cached?.mode)) return '';
      if (Date.now() - Number(cached.savedAt || 0) > cacheMaxAgeMs) return '';
      return cached.mode;
    } catch (_) {
      return '';
    }
  };

  const saveCachedPricingMode = (mode) => {
    if (!isValidMode(mode)) return;
    try {
      window.localStorage?.setItem(cacheKey, JSON.stringify({
        mode,
        savedAt: Date.now()
      }));
    } catch (_) {
      // Pricing still works when storage is unavailable.
    }
  };

  const readAccountEmail = async () => {
    const config = cfg();
    const fetchFn = typeof fetch === 'function' ? fetch : window.fetch;

    if (fetchFn && config.endpoint && config.projectId) {
      try {
        const endpoint = String(config.endpoint).replace(/\/+$/, '');
        const response = await fetchFn(`${endpoint}/account`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'X-Appwrite-Project': config.projectId
          }
        });
        if (!response.ok) return '';
        const user = await response.json();
        return String(user?.email || '');
      } catch (_) {
        return '';
      }
    }

    return '';
  };

  const readFunctionPricingMode = async () => {
    const config = cfg();
    const fetchFn = typeof fetch === 'function' ? fetch : window.fetch;
    if (!fetchFn || !config.endpoint || !config.projectId || !config.pricingFunctionId) return '';

    try {
      const endpoint = String(config.endpoint).replace(/\/+$/, '');
      const response = await fetchFn(
        `${endpoint}/functions/${encodeURIComponent(config.pricingFunctionId)}/executions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': config.projectId
          },
          body: JSON.stringify({ body: '', async: false })
        }
      );
      if (!response.ok) return '';
      const execution = await response.json();
      const body = JSON.parse(execution?.responseBody || '{}');
      return isValidMode(body.mode) ? body.mode : '';
    } catch (_) {
      return '';
    }
  };

  const readEdgePricingMode = async () => {
    const config = cfg();
    const fetchFn = typeof fetch === 'function' ? fetch : window.fetch;
    if (!fetchFn || !config.pricingEdgeUrl) return '';

    try {
      const response = await fetchFn(config.pricingEdgeUrl, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          Accept: 'application/json'
        }
      });
      if (!response.ok) return '';
      const body = await response.json();
      return body.ok === true && isValidMode(body.mode) ? body.mode : '';
    } catch (_) {
      return '';
    }
  };

  const priceText = (key, mode) => {
    const price = prices[key] || prices.basic;
    if (mode === 'usd') return price.usd;
    if (mode === 'both') return `${price.inr} / ${price.usd}`;
    return price.inr;
  };

  const detectModeFromEmail = (email) => {
    const normalized = String(email || '').trim().toLowerCase();
    if (normalized === 'usd@gmail.com') return 'usd';
    if (normalized === 'usdinr@gmail.com') return 'both';
    return 'inr';
  };

  const applyPricing = (mode = 'inr', email = '', source = 'default') => {
    qsa('[data-price-key]').forEach((node) => {
      const key = node.getAttribute('data-price-key');
      node.textContent = priceText(key, mode);
      node.setAttribute('data-price-mode', mode);
    });

    qsa('[data-price-plan-note]').forEach((node) => {
      const baseKey = node.getAttribute('data-price-plan-note');
      const suffix = baseKey === 'complete' ? 'hosting/domain setup' : 'standard website';
      node.textContent = `${priceText(baseKey, mode)} · ${suffix}`;
    });

    const status = qs('[data-pricing-status]');
    if (status) {
      const label = mode === 'usd' ? 'USD' : mode === 'both' ? 'INR / USD' : 'INR';
      status.textContent = `Pricing view: ${label}`;
    }

    window.HAMZAH_PRICING_MODE = { mode, email, source };
  };

  const detectPricingMode = async () => {
    const isLocal = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    const params = new URLSearchParams(window.location.search);
    const queryEmail = isLocal ? params.get('pricingEmail') : '';
    if (queryEmail) return { mode: detectModeFromEmail(queryEmail), email: queryEmail };

    const overrideEmail = window.HAMZAH_PRICING_TEST_EMAIL;
    if (overrideEmail) return { mode: detectModeFromEmail(overrideEmail), email: String(overrideEmail) };

    const edgeMode = await readEdgePricingMode();
    if (edgeMode) return { mode: edgeMode, email: '', source: 'edge' };

    const functionMode = await readFunctionPricingMode();
    if (functionMode) return { mode: functionMode, email: '', source: 'function' };

    const email = await readAccountEmail();
    return { mode: detectModeFromEmail(email), email, source: email ? 'account' : 'default' };
  };

  const refreshPricingMode = async () => {
    const result = await detectPricingMode();
    applyPricing(result.mode, result.email, result.source);
    saveCachedPricingMode(result.mode);
    return result;
  };

  const init = async () => {
    const cachedMode = readCachedPricingMode();
    applyPricing(cachedMode || 'inr', '', cachedMode ? 'cache' : 'default');
    await refreshPricingMode();

    if (typeof window.setInterval === 'function') {
      window.setInterval(() => {
        refreshPricingMode().catch(() => {});
      }, refreshIntervalMs);
    }
  };

  window.HAMZAH_PRICING = {
    applyPricing,
    detectModeFromEmail,
    detectPricingMode,
    init,
    priceText,
    readCachedPricingMode,
    readEdgePricingMode,
    readFunctionPricingMode,
    refreshPricingMode,
    saveCachedPricingMode
  };
  window.addEventListener('DOMContentLoaded', init);
})();
