(() => {
  'use strict';

  const countryCurrency = {
    AF:'AFN', AX:'EUR', AL:'ALL', DZ:'DZD', AS:'USD', AD:'EUR', AO:'AOA', AI:'XCD', AG:'XCD', AR:'ARS', AM:'AMD', AW:'AWG', AU:'AUD', AT:'EUR', AZ:'AZN',
    BS:'BSD', BH:'BHD', BD:'BDT', BB:'BBD', BY:'BYN', BE:'EUR', BZ:'BZD', BJ:'XOF', BM:'BMD', BT:'BTN', BO:'BOB', BQ:'USD', BA:'BAM', BW:'BWP', BR:'BRL', IO:'USD', BN:'BND', BG:'BGN', BF:'XOF', BI:'BIF',
    KH:'KHR', CM:'XAF', CA:'CAD', CV:'CVE', KY:'KYD', CF:'XAF', TD:'XAF', CL:'CLP', CN:'CNY', CX:'AUD', CC:'AUD', CO:'COP', KM:'KMF', CG:'XAF', CD:'CDF', CK:'NZD', CR:'CRC', CI:'XOF', HR:'EUR', CU:'CUP', CW:'ANG', CY:'EUR', CZ:'CZK',
    DK:'DKK', DJ:'DJF', DM:'XCD', DO:'DOP', EC:'USD', EG:'EGP', SV:'USD', GQ:'XAF', ER:'ERN', EE:'EUR', SZ:'SZL', ET:'ETB', FK:'FKP', FO:'DKK', FJ:'FJD', FI:'EUR', FR:'EUR', GF:'EUR', PF:'XPF', GA:'XAF', GM:'GMD', GE:'GEL', DE:'EUR', GH:'GHS', GI:'GIP', GR:'EUR', GL:'DKK', GD:'XCD', GP:'EUR', GU:'USD', GT:'GTQ', GG:'GBP', GN:'GNF', GW:'XOF', GY:'GYD',
    HT:'HTG', HN:'HNL', HK:'HKD', HU:'HUF', IS:'ISK', IN:'INR', ID:'IDR', IR:'IRR', IQ:'IQD', IE:'EUR', IM:'GBP', IL:'ILS', IT:'EUR', JM:'JMD', JP:'JPY', JE:'GBP', JO:'JOD', KZ:'KZT', KE:'KES', KI:'AUD', KP:'KPW', KR:'KRW', KW:'KWD', KG:'KGS',
    LA:'LAK', LV:'EUR', LB:'LBP', LS:'LSL', LR:'LRD', LY:'LYD', LI:'CHF', LT:'EUR', LU:'EUR', MO:'MOP', MG:'MGA', MW:'MWK', MY:'MYR', MV:'MVR', ML:'XOF', MT:'EUR', MH:'USD', MQ:'EUR', MR:'MRU', MU:'MUR', YT:'EUR', MX:'MXN', FM:'USD', MD:'MDL', MC:'EUR', MN:'MNT', ME:'EUR', MS:'XCD', MA:'MAD', MZ:'MZN', MM:'MMK', NA:'NAD', NR:'AUD', NP:'NPR', NL:'EUR', NC:'XPF', NZ:'NZD', NI:'NIO', NE:'XOF', NG:'NGN', NU:'NZD', NF:'AUD', MK:'MKD', MP:'USD', NO:'NOK', OM:'OMR',
    PK:'PKR', PW:'USD', PS:'ILS', PA:'PAB', PG:'PGK', PY:'PYG', PE:'PEN', PH:'PHP', PN:'NZD', PL:'PLN', PT:'EUR', PR:'USD', QA:'QAR', RE:'EUR', RO:'RON', RU:'RUB', RW:'RWF', BL:'EUR', SH:'SHP', KN:'XCD', LC:'XCD', MF:'EUR', PM:'EUR', VC:'XCD', WS:'WST', SM:'EUR', ST:'STN', SA:'SAR', SN:'XOF', RS:'RSD', SC:'SCR', SL:'SLL', SG:'SGD', SX:'ANG', SK:'EUR', SI:'EUR', SB:'SBD', SO:'SOS', ZA:'ZAR', GS:'GBP', SS:'SSP', ES:'EUR', LK:'LKR', SD:'SDG', SR:'SRD', SJ:'NOK', SE:'SEK', CH:'CHF', SY:'SYP', TW:'TWD', TJ:'TJS', TZ:'TZS', TH:'THB', TL:'USD', TG:'XOF', TK:'NZD', TO:'TOP', TT:'TTD', TN:'TND', TR:'TRY', TM:'TMT', TC:'USD', TV:'AUD', UG:'UGX', UA:'UAH', AE:'AED', GB:'GBP', US:'USD', UM:'USD', UY:'UYU', UZ:'UZS', VU:'VUV', VA:'EUR', VE:'VES', VN:'VND', VG:'USD', VI:'USD', WF:'XPF', EH:'MAD', YE:'YER', ZM:'ZMW', ZW:'ZWL',
    EU:'EUR'
  };
  const fallbackRatesFromINR = {
    INR:1, USD:0.012, EUR:0.011, GBP:0.0095, CAD:0.016, AUD:0.018, NZD:0.020, AED:0.044, SAR:0.045, QAR:0.044, KWD:0.0037, OMR:0.0046, BHD:0.0045,
    SGD:0.016, MYR:0.056, PKR:3.35, BDT:1.42, NPR:1.60, LKR:3.65, JPY:1.85, KRW:16.2, PHP:0.69, IDR:195, THB:0.43, VND:305, ZAR:0.22, NGN:18, KES:1.55, BRL:0.064, MXN:0.22, TRY:0.39,
    CNY:0.087, HKD:0.094, TWD:0.39, CHF:0.011, SEK:0.13, NOK:0.13, DKK:0.083, PLN:0.048, CZK:0.27, HUF:4.2, RON:0.055, BGN:0.022, RUB:1.1, UAH:0.49,
    ILS:0.043, JOD:0.0085, EGP:0.58, MAD:0.12, TND:0.038, DZD:1.62, GHS:0.18, TZS:31, UGX:45, RWF:16, ETB:0.68, XOF:7.2, XAF:7.2, XCD:0.033, ANG:0.022, BSD:0.012, BBD:0.024, BMD:0.012, BZD:0.024,
    ARS:12, CLP:11, COP:48, PEN:0.045, UYU:0.48, PYG:90, BOB:0.083, CRC:6.2, GTQ:0.094, HNL:0.30, NIO:0.44, DOP:0.72, JMD:1.9,
    FJD:0.027, PGK:0.046, WST:0.033, TOP:0.028, XPF:1.3, KZT:5.8, GEL:0.032, AMD:4.7, AZN:0.020, KGS:1.05, UZS:150, MNT:41, LAK:250, KHR:49, MMK:25
  };
  const currencySymbols = {
    INR: '₹', USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$', NZD: 'NZ$', AED: 'د.إ', SAR: '﷼', QAR: 'QR',
    KWD: 'KD', OMR: 'OMR', BHD: 'BD', SGD: 'S$', MYR: 'RM', PKR: '₨', BDT: '৳', NPR: 'रू', LKR: 'Rs',
    JPY: '¥', KRW: '₩', PHP: '₱', IDR: 'Rp', THB: '฿', VND: '₫', ZAR: 'R', NGN: '₦', KES: 'KSh', BRL: 'R$', MXN: 'MX$', TRY: '₺'
  };

  const state = {
    currency: 'INR',
    country: '',
    countryCode: '',
    source: 'base INR fallback',
    rate: 1,
    ratesLive: false
  };

  const regionFromLocale = () => {
    const locale = navigator.language || (navigator.languages && navigator.languages[0]) || '';
    const match = locale.match(/[-_]([A-Z]{2})\b/i);
    return match ? match[1].toUpperCase() : '';
  };

  const withTimeout = async (url, ms = 2200) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    try {
      const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  };

  const applyLocaleGuess = () => {
    // Browser locale alone can be wrong on VPNs, shared computers, and headless browsers.
    // We keep INR until the IP region service returns a currency.
  };

  const detectByIp = async () => {
    try {
      const data = await withTimeout('https://ipapi.co/json/');
      if (data) {
        const code = String(data.country_code || data.country || '').toUpperCase();
        const detectedCurrency = String(data.currency || countryCurrency[code] || '').toUpperCase();
        if (detectedCurrency) {
          state.currency = detectedCurrency;
          state.country = data.country_name || state.country;
          state.countryCode = code || state.countryCode;
          state.source = 'region auto-detected';
          state.rate = fallbackRatesFromINR[state.currency] || state.rate || 1;
        }
      }
    } catch (_) {
      // Private, blocked, offline, or local testing fallback is expected.
    }
  };

  const loadLiveRates = async () => {
    try {
      const data = await withTimeout('https://open.er-api.com/v6/latest/INR', 2600);
      const rate = Number(data?.rates?.[state.currency]);
      if (Number.isFinite(rate) && rate > 0) {
        state.rate = rate;
        state.ratesLive = true;
        return;
      }
    } catch (_) {
      state.ratesLive = false;
    }
    if (state.currency !== 'INR' && !fallbackRatesFromINR[state.currency]) {
      state.currency = 'INR';
      state.rate = 1;
      state.source = 'INR fallback after unavailable exchange rate';
    }
  };

  const format = (inrAmount) => {
    const amount = Number(inrAmount || 0);
    const converted = state.currency === 'INR' ? amount : amount * state.rate;
    const rounded = converted >= 1000 ? Math.round(converted) : Math.round(converted * 100) / 100;
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: state.currency,
        maximumFractionDigits: converted >= 1000 || ['JPY', 'KRW', 'VND', 'IDR'].includes(state.currency) ? 0 : 2
      }).format(rounded);
    } catch (_) {
      return `${currencySymbols[state.currency] || state.currency} ${rounded.toLocaleString()}`;
    }
  };

  const updateDom = () => {
    document.querySelectorAll('[data-local-price]').forEach((node) => {
      node.textContent = format(Number(node.dataset.localPrice || 0));
    });
    document.querySelectorAll('[data-currency-status]').forEach((node) => {
      const rateText = state.ratesLive ? 'live rate' : 'safe fallback rate';
      const place = state.country || state.countryCode || 'base pricing';
      node.textContent = `Showing ${state.currency} pricing for ${place}. ${state.source}; ${rateText}.`;
    });
    document.dispatchEvent(new CustomEvent('hamzah:pricing-ready', { detail: { ...state } }));
  };

  const init = async () => {
    applyLocaleGuess();
    updateDom();
    await detectByIp();
    updateDom();
    await loadLiveRates();
    updateDom();
  };

  const testApplyRegion = ({ countryCode = 'IN', country = '', currency = 'INR', rate = 1, live = true } = {}) => {
    const host = location.hostname;
    if (!['localhost', '127.0.0.1', ''].includes(host)) return false;
    const nextCurrency = String(currency || countryCurrency[String(countryCode || '').toUpperCase()] || 'INR').toUpperCase();
    state.currency = nextCurrency;
    state.countryCode = String(countryCode || '').toUpperCase();
    state.country = country || state.countryCode || 'test region';
    state.rate = Number(rate) > 0 ? Number(rate) : (fallbackRatesFromINR[nextCurrency] || 1);
    state.source = 'local QA region simulation';
    state.ratesLive = Boolean(live);
    updateDom();
    return true;
  };

  window.HAMZAH_PRICING = {
    getState: () => ({ ...state }),
    format,
    convert: (inrAmount) => Number(inrAmount || 0) * state.rate,
    ready: init(),
    supportedCountries: () => ({ ...countryCurrency }),
    testApplyRegion
  };
})();
