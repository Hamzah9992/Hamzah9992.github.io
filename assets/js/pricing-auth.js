(() => {
  'use strict';

  const prices = {
    basic: { inr: '₹9,999', usd: '$105' },
    basicPriority: { inr: '₹13,998', usd: '$147' },
    complete: { inr: '₹16,999', usd: '$179' },
    completePriority: { inr: '₹22,998', usd: '$242' }
  };

  const defaultConfig = Object.freeze({
    endpoint: 'https://nyc.cloud.appwrite.io/v1',
    projectId: '69cfde7a0007f614642b',
    pricingFunctionId: 'pricing-mode'
  });

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const cfg = () => ({ ...defaultConfig, ...(window.HAMZAH_SITE_CONFIG || {}) });

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
      return ['inr', 'usd', 'both'].includes(body.mode) ? body.mode : '';
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

  const applyPricing = (mode = 'inr', email = '') => {
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

    window.HAMZAH_PRICING_MODE = { mode, email };
  };

  const detectPricingMode = async () => {
    const isLocal = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    const params = new URLSearchParams(window.location.search);
    const queryEmail = isLocal ? params.get('pricingEmail') : '';
    if (queryEmail) return { mode: detectModeFromEmail(queryEmail), email: queryEmail };

    const overrideEmail = window.HAMZAH_PRICING_TEST_EMAIL;
    if (overrideEmail) return { mode: detectModeFromEmail(overrideEmail), email: String(overrideEmail) };

    const functionMode = await readFunctionPricingMode();
    if (functionMode) return { mode: functionMode, email: '', source: 'function' };

    const email = await readAccountEmail();
    return { mode: detectModeFromEmail(email), email, source: email ? 'account' : 'default' };
  };

  const init = async () => {
    applyPricing('inr', '');
    const result = await detectPricingMode();
    applyPricing(result.mode, result.email);
  };

  window.HAMZAH_PRICING = {
    applyPricing,
    detectModeFromEmail,
    detectPricingMode,
    priceText,
    readFunctionPricingMode
  };
  window.addEventListener('DOMContentLoaded', init);
})();
