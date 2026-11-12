/*
 * SafeGo · interfaz. El código fuente está dividido en app/web-src/*.js
 * (se unen en orden alfabético dentro de un mismo bloque). Todas las partes comparten
 * el ámbito de la función que abre 00-base.js y cierra 99-main.js.
 */
(function () {
  'use strict';

  var N = window.TSNative || null;
  var IS_NATIVE = !!N;
  var D = window.TSData;
  var P = window.TSPlanner;
  var VERSION = '2.0.0';
  // Página de seguimiento que abre la familia desde WhatsApp (GitHub Pages, carpeta viewer/ del proyecto).
  // La app solo la ofrece cuando comprueba que está publicada; si no, comparte el código para pegar en la app.
  var TS_VIEWER_URL = 'https://juanfercaicedo.github.io/TransporteSeguro/vivo/';

  /* ---------------- Iconos (trazos propios, estilo línea) ---------------- */
  var PATHS = {
    home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    route: 'M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 15V9a4 4 0 0 1 4-4h2M18 9v6a4 4 0 0 1-4 4h-2',
    nav: 'M3 11 21 3l-8 18-2-8z',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
    menu: 'M4 6h16M4 12h16M4 18h16',
    back: 'M15 18l-6-6 6-6',
    chev: 'M9 18l6-6-6-6',
    pin: 'M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    bus: 'M6 17h12M5 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11H5zM5 11h14M8 20v-3M16 20v-3M8 14h.01M16 14h.01',
    train: 'M8 3h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zM5 10h14M9 21l2-4M15 21l-2-4M9 14h.01M15 14h.01',
    walk: 'M13 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM10 22l2-7 3 3v4M9 12l1-4 4 1 2 4 3 1M10 8 7 10l-1 4',
    phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z',
    msg: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
    alert: 'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
    check: 'M20 6 9 17l-5-5',
    x: 'M18 6 6 18M6 6l12 12',
    plus: 'M12 5v14M5 12h14',
    trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
    edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z',
    locate: 'M12 2v3M12 19v3M2 12h3M19 12h3M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
    share: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
    star: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z',
    gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
    history: 'M3 3v5h5M3.1 13A9 9 0 1 0 6 5.3L3 8M12 7v5l4 2',
    info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01',
    book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
    swap: 'M7 16V4M3 8l4-4 4 4M17 8v12M21 16l-4 4-4-4',
    play: 'M6 3l14 9-14 9z',
    stop: 'M6 6h12v12H6z',
    layers: 'M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    key: 'M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zM15.5 7.5l3 3L22 7l-3-3',
    heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z',
    school: 'M22 10 12 5 2 10l10 5zM6 12v5c3 2 9 2 12 0v-5',
    wifi: 'M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0M12 20h.01',
    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
    eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'
  };
  function icon(name, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' +
      (extra ? ' ' + extra : '') + '><path d="' + (PATHS[name] || PATHS.info) + '"/></svg>';
  }
  var MODE_ICON = { metro: 'train', trole: 'bus', ecovia: 'bus', ccn: 'bus', cso: 'bus', alim: 'bus', bus: 'bus', inter: 'bus', walk: 'walk' };
  var MODE_NAME = { metro: 'Metro', trole: 'Trolebús', ecovia: 'Ecovía', ccn: 'Metrobús (Central Norte)', cso: 'Corredor Sur Occidental',
    alim: 'Alimentadores', bus: 'Buses urbanos', inter: 'Buses a los valles y aeropuerto', walk: 'Caminar' };
  var MODE_COLOR = { metro: '#B3303F', trole: '#2E7D5B', ecovia: '#C77A12', ccn: '#6A4C93', cso: '#1C7C8C', alim: '#4F6DB8', bus: '#3A5BA0', inter: '#3D8B37', walk: '#766168' };
  var MODE_ORDER = ['metro', 'trole', 'ecovia', 'ccn', 'cso', 'alim', 'bus', 'inter'];

  /* ---------------- Utilidades ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function hhmm(t) { var d = new Date(t); return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function fmtDate(t) {
    var d = new Date(t);
    var days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    return days[d.getDay()] + ' ' + d.getDate() + '/' + (d.getMonth() + 1) + ' · ' + hhmm(t);
  }
  function fmtMin(m) {
    m = Math.round(m);
    if (m < 60) return m + ' min';
    return Math.floor(m / 60) + ' h ' + (m % 60 ? (m % 60) + ' min' : '');
  }
  function fmtKm(km) { return km < 1 ? Math.round(km * 1000) + ' m' : (Math.round(km * 10) / 10) + ' km'; }
  function debounce(fn, ms) { var t; return function () { var a = arguments, s = this; clearTimeout(t); t = setTimeout(function () { fn.apply(s, a); }, ms); }; }
  function osmLink(lat, lon) { return 'https://www.openstreetmap.org/?mlat=' + lat.toFixed(5) + '&mlon=' + lon.toFixed(5) + '#map=17/' + lat.toFixed(5) + '/' + lon.toFixed(5); }
  function normalizePhone(p) {
    var d = String(p || '').replace(/[^\d+]/g, '');
    if (!d) return '';
    if (d.charAt(0) === '+') return d.slice(1);
    if (d.indexOf('00') === 0) return d.slice(2);
    if (d.length === 10 && d.charAt(0) === '0') return '593' + d.slice(1);  // celular Ecuador 09xxxxxxxx
    if (d.length === 9 && d.charAt(0) === '9') return '593' + d;
    return d;
  }
  function validPhone(p) { var n = normalizePhone(p); return n.length >= 7 && n.length <= 15; }
  function firstName(n) { return String(n || '').trim().split(/\s+/)[0] || ''; }

  var toastTimer;
  function toast(msg, ms) {
    var el = $('#toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.add('hidden'); }, ms || 2800);
  }

  /* ---------------- Estado persistente ---------------- */
  var DEFAULT_SETTINGS = {
    channel: IS_NATIVE ? 'sms' : 'whatsapp', // sms | whatsapp ('ambos' = sms, versiones previas)
    autoSmsArrival: true,
    smsOnStart: false,
    smsOnLate: true,
    toleranceMin: 10,
    arrivalRadius: 150,
    transferAlerts: true,
    familyNotices: true,
    liveShare: true,    // al iniciar cada viaje se comparte el seguimiento en vivo con la familia (se puede apagar)
    autoDeleteDays: 30, // el historial se borra solo pasado este tiempo
    discreet: false,
    keepScreenOn: false,
    theme: 'auto',
    avoid: {}
  };
  var S;
  function defaultState() {
    return {
      v: 1, onboarded: false, role: 'estudiante',
      profile: { name: '', studentName: '' },
      contacts: [], places: [], favorites: [],
      settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
      history: [], trip: null, lastArrival: null,
      stats: { autoNotices: 0, manualNotices: 0 }
    };
  }
  function loadState() {
    var raw = null;
    try { if (IS_NATIVE && N.loadState) raw = N.loadState(); } catch (e) { raw = null; }
    if (!raw) { try { raw = localStorage.getItem('ts_state'); } catch (e) { raw = null; } }
    var st = defaultState();
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          Object.keys(parsed).forEach(function (k) { st[k] = parsed[k]; });
          st.settings = Object.assign({}, DEFAULT_SETTINGS, parsed.settings || {});
          st.profile = Object.assign({ name: '', studentName: '' }, parsed.profile || {});
          st.stats = Object.assign({ autoNotices: 0, manualNotices: 0 }, parsed.stats || {});
          ['contacts', 'places', 'favorites', 'history'].forEach(function (k) { if (!Array.isArray(st[k])) st[k] = []; });
        }
      } catch (e) { console.warn('Estado dañado, se reinicia', e); }
    }
    // Borrado automático: los viajes viejos no se guardan más de lo necesario (datos de menores, LOPDP)
    var days = +st.settings.autoDeleteDays;
    if (days > 0) {
      var limit = Date.now() - days * 86400000;
      st.history = st.history.filter(function (r) { return (r.startedAt || 0) >= limit; });
    }
    return st;
  }
  var saveTimer;
  function save(now) {
    clearTimeout(saveTimer);
    var doSave = function () {
      if (S.history.length > 200) S.history = S.history.slice(0, 200);
      var json = JSON.stringify(S);
      try { localStorage.setItem('ts_state', json); } catch (e) { /* almacenamiento lleno o bloqueado */ }
      try { if (IS_NATIVE && N.saveState) N.saveState(json); } catch (e) { /* ignorar */ }
    };
    if (now) doSave(); else saveTimer = setTimeout(doSave, 250);
  }

