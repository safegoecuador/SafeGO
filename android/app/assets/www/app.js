/* ARCHIVO GENERADO por build.sh a partir de app/web-src/. No lo edites aquí. */
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
  var TS_VIEWER_URL = 'https://juanfercaicedo.github.io/SafeGO/vivo/';

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

  /* ---------------- Puente nativo con alternativas web ---------------- */
  var callbacks = {};
  var cbSeq = 0;
  function registerCb(fn, timeoutMs, onTimeout) {
    var id = 'cb' + (++cbSeq);
    var timer = null;
    callbacks[id] = function (res) { if (timer) clearTimeout(timer); delete callbacks[id]; fn(res); };
    if (timeoutMs) {
      timer = setTimeout(function () {
        if (callbacks[id]) { delete callbacks[id]; (onTimeout || fn)({ ok: false, error: 'timeout' }); }
      }, timeoutMs);
    }
    return id;
  }
  function call(name) {
    var args = Array.prototype.slice.call(arguments, 1);
    try {
      if (IS_NATIVE && typeof N[name] === 'function') return N[name].apply(N, args);
    } catch (e) { console.error('Error nativo en ' + name, e); }
    return undefined;
  }

  var Bridge = {
    getLocation: function (cb) {
      if (IS_NATIVE) {
        var id = registerCb(cb, 20000);
        call('getLocation', id);
        return;
      }
      if (!navigator.geolocation) { cb({ ok: false, error: 'sin-gps' }); return; }
      navigator.geolocation.getCurrentPosition(function (p) {
        cb({ ok: true, data: { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy, t: Date.now() } });
      }, function (err) { cb({ ok: false, error: err && err.message || 'error' }); }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 });
    },
    httpGet: function (url, cb) {
      if (IS_NATIVE) {
        var id = registerCb(cb, 20000);
        call('httpGet', url, id);
        return;
      }
      fetch(url).then(function (r) { return r.text().then(function (t) { cb({ ok: r.ok, data: { status: r.status, body: t } }); }); })
        .catch(function (e) { cb({ ok: false, error: String(e) }); });
    },
    permissions: function () {
      var r = call('permissionStatus');
      if (r) { try { return JSON.parse(r); } catch (e) { /* nada */ } }
      return { location: true, notifications: true, sms: false, web: !IS_NATIVE };
    },
    requestPermissions: function (list, cb) {
      if (!IS_NATIVE) { cb && cb({ ok: true, data: Bridge.permissions() }); return; }
      var id = registerCb(function (res) { cb && cb(res); }, 120000);
      call('requestPermissions', id, JSON.stringify(list));
    },
    sendSms: function (phones, text, cb) {
      phones = phones.map(normalizePhone).filter(Boolean);
      if (!phones.length) { cb && cb({ ok: false, error: 'sin-contactos' }); return; }
      if (IS_NATIVE) {
        var id = registerCb(function (res) { cb && cb(res); }, 60000);
        call('sendSms', id, JSON.stringify(phones), text);
        return;
      }
      window.location.href = 'sms:' + phones.map(function (p) { return '+' + p; }).join(',') + '?body=' + encodeURIComponent(text);
      cb && cb({ ok: true, data: { sent: phones.length, manual: true } });
    },
    whatsapp: function (phone, text) {
      var p = normalizePhone(phone);
      if (IS_NATIVE) { call('whatsapp', p, text); return; }
      window.open('https://wa.me/' + p + '?text=' + encodeURIComponent(text), '_blank');
    },
    share: function (text) {
      if (IS_NATIVE) { call('share', text); return; }
      if (navigator.share) navigator.share({ text: text }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { toast('Copiado al portapapeles'); });
    },
    dial: function (phone) {
      if (IS_NATIVE) { call('dial', String(phone)); return; }
      window.location.href = 'tel:' + phone;
    },
    openUrl: function (url) { if (IS_NATIVE) call('openUrl', url); else window.open(url, '_blank'); },
    vibrate: function (ms) {
      if (IS_NATIVE) { call('vibrate', JSON.stringify(ms)); return; }
      if (navigator.vibrate) navigator.vibrate(ms);
    },
    notify: function (title, text) { if (IS_NATIVE) call('notify', title, text); },
    keepScreenOn: function (on) { call('keepScreenOn', !!on); },
    battery: function () {
      var r = call('battery');
      return typeof r === 'number' ? r : -1;
    },
    copy: function (text) {
      if (IS_NATIVE) { call('copy', text); toast('Copiado'); return; }
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { toast('Copiado'); });
    },
    online: function () {
      var r = call('isOnline');
      if (r === undefined) return navigator.onLine !== false;
      return !!r;
    }
  };

  /* Eventos que llegan desde Android */
  window.TS = {
    onNative: function (type, json) {
      var data = null;
      try { data = typeof json === 'string' ? JSON.parse(json) : json; } catch (e) { data = json; }
      try {
        if (type === 'cb' && data && callbacks[data.id]) callbacks[data.id](data);
        else if (type === 'trip') Trip.onNativeEvent(data);
        else if (type === 'resume') onResume();
        else if (type === 'online') renderOfflineBar();
      } catch (e) { console.error('onNative', type, e); }
    },
    onBack: function () { return goBack(); },
    debugState: function () { return S; }
  };

  /* ---------------- Mapa (Leaflet + OpenStreetMap) ---------------- */
  var Map = {
    map: null, layers: {}, me: null, network: null, showNetwork: false,
    init: function () {
      if (this.map || !window.L) return;
      var el = $('#map');
      this.map = L.map(el, { zoomControl: false, attributionControl: true, minZoom: 10, maxZoom: 19 })
        .setView([D.QUITO_CENTER.lat, D.QUITO_CENTER.lon], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
      this.map.attributionControl.setPrefix(false);
      L.control.zoom({ position: 'topleft' }).addTo(this.map);
      var self = this;
      this.map.on('click', function (e) { if (self.onClick) self.onClick(e.latlng); });
      this.map.on('moveend', function () { if (self.showNetwork) self.drawStops(); });
    },
    mount: function (slot) {
      this.init();
      var el = $('#map');
      if (slot) slot.appendChild(el); else $('#mapWrap').appendChild(el);
      var m = this.map;
      if (m) { m.invalidateSize(false); setTimeout(function () { m.invalidateSize(); }, 60); }
    },
    clear: function (group) {
      if (this.layers[group]) { this.map.removeLayer(this.layers[group]); delete this.layers[group]; }
    },
    group: function (name) {
      this.clear(name);
      var g = L.layerGroup().addTo(this.map);
      this.layers[name] = g;
      return g;
    },
    pin: function (kind) {
      return L.divIcon({ className: '', html: '<div class="pin ' + kind + '"></div>', iconSize: [30, 30], iconAnchor: [15, 30] });
    },
    setMe: function (lat, lon, acc) {
      if (!this.map) return;
      if (!this.me) {
        this.me = L.marker([lat, lon], { icon: L.divIcon({ className: '', html: '<div class="me-dot"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }), zIndexOffset: 1000 }).addTo(this.map);
        this.meAcc = L.circle([lat, lon], { radius: acc || 30, color: '#2B6CE6', weight: 1, fillOpacity: 0.08 }).addTo(this.map);
      } else {
        this.me.setLatLng([lat, lon]);
        this.meAcc.setLatLng([lat, lon]).setRadius(acc || 30);
      }
    },
    toggleNetwork: function (force) {
      this.showNetwork = force === undefined ? !this.showNetwork : force;
      if (!this.showNetwork) { this.clear('network'); this.clear('osmstops'); return; }
      this.drawStops();
      var g = this.group('network');
      D.LINES.forEach(function (line) {
        var pts = line.stations.map(function (s) { return [s[1], s[2]]; });
        var trunk = line.kind === 'troncal';
        L.polyline(pts, trunk ? { color: line.color, weight: 4, opacity: 0.6 } : { color: line.color, weight: 2.5, opacity: 0.45, dashArray: '6 6' })
          .bindTooltip(line.name).addTo(g);
        if (!trunk) return; // en buses solo se dibuja el recorrido aproximado
        line.stations.forEach(function (s) {
          L.circleMarker([s[1], s[2]], { radius: 5, color: '#fff', weight: 2, fillColor: line.color, fillOpacity: 1 })
            .bindTooltip(line.short + ' · ' + s[0]).addTo(g);
        });
      });
    },
    /* Paradas reales de bus (OpenStreetMap): solo las visibles y desde el zoom 15, para no saturar. */
    drawStops: function () {
      if (!this.showNetwork || !this.map || !window.OSM_STOPS) return;
      if (!this.stopRenderer) this.stopRenderer = L.canvas({ padding: 0.3 });
      var g = this.group('osmstops');
      if (this.map.getZoom() < 15) return;
      var b = this.map.getBounds().pad(0.2), n = 0, r = this.stopRenderer;
      for (var i = 0; i < OSM_STOPS.length && n < 600; i++) {
        var s = OSM_STOPS[i];
        if (!b.contains([s[1], s[2]])) continue;
        n++;
        L.circleMarker([s[1], s[2]], { renderer: r, radius: 5, color: '#fff', weight: 1.5, fillColor: '#2E9B5B', fillOpacity: 0.95 })
          .bindTooltip(s[0] || 'Parada de bus').addTo(g);
      }
    },
    drawItinerary: function (it, groupName) {
      var g = this.group(groupName || 'route');
      var bounds = [];
      it.legs.forEach(function (l) {
        var pts = l.geometry || l.points;
        if (pts.length < 2) return;
        var style = l.kind === 'walk' ? { color: MODE_COLOR.walk, weight: 5, dashArray: '2 9', opacity: 0.9 } :
          { color: MODE_COLOR[l.mode] || '#333', weight: 6, opacity: 0.9 };
        if (l.kind === 'bus') style.dashArray = '10 8';
        L.polyline(pts, style).addTo(g);
        pts.forEach(function (p) { bounds.push(p); });
        if (l.kind === 'ride') {
          l.points.forEach(function (p, i) {
            L.circleMarker(p, { radius: i === 0 || i === l.points.length - 1 ? 7 : 4, color: '#fff', weight: 2, fillColor: l.color, fillOpacity: 1 })
              .bindTooltip(l.stops[i] || '').addTo(g);
          });
        }
      });
      L.marker([it.origin.lat, it.origin.lon], { icon: this.pin('a') }).bindTooltip(it.origin.name).addTo(g);
      L.marker([it.dest.lat, it.dest.lon], { icon: this.pin('b') }).bindTooltip(it.dest.name).addTo(g);
      bounds.push([it.origin.lat, it.origin.lon], [it.dest.lat, it.dest.lon]);
      if (bounds.length) this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    }
  };

  /* Geometría real de caminata (servidor libre de FOSSGIS/OSRM). Es opcional. */
  function enrichWalkGeometry(it, done) {
    if (!Bridge.online()) { done && done(); return; }
    var pending = 0;
    it.legs.forEach(function (l) {
      if (l.kind !== 'walk' || l.geometry || l.points.length < 2 || l.km < 0.12) return;
      var a = l.points[0], b = l.points[l.points.length - 1];
      var url = 'https://routing.openstreetmap.de/routed-foot/route/v1/foot/' + a[1] + ',' + a[0] + ';' + b[1] + ',' + b[0] + '?overview=full&geometries=geojson';
      pending++;
      Bridge.httpGet(url, function (res) {
        try {
          if (res.ok && res.data && res.data.status === 200) {
            var j = JSON.parse(res.data.body);
            if (j.routes && j.routes[0]) {
              l.geometry = j.routes[0].geometry.coordinates.map(function (c) { return [c[1], c[0]]; });
              var km = j.routes[0].distance / 1000;
              if (km > 0) { l.km = Math.round(km * 100) / 100; l.min = Math.max(1, Math.round(j.routes[0].distance / 1000 / 4.5 * 60)); }
            }
          }
        } catch (e) { /* se mantiene la línea recta */ }
        pending--;
        if (pending === 0 && done) done();
      });
    });
    if (pending === 0 && done) done();
  }

  /* Búsqueda de lugares: guardados, referencias locales, estaciones y Nominatim. */
  function localSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    var nq = norm(q);
    var out = [];
    S.places.forEach(function (p) { if (norm(p.name).indexOf(nq) >= 0) out.push({ name: p.name, lat: p.lat, lon: p.lon, kind: 'guardado' }); });
    D.PLACES.forEach(function (p) { if (norm(p.name).indexOf(nq) >= 0) out.push({ name: p.name, lat: p.lat, lon: p.lon, kind: p.type }); });
    D.LINES.forEach(function (line) {
      line.stations.forEach(function (s) {
        if (norm(s[0]).indexOf(nq) >= 0) out.push({ name: s[0] + ' (' + line.short + ')', lat: s[1], lon: s[2], kind: 'estación' });
      });
    });
    if (out.length < 8 && nq.length >= 3 && window.OSM_STOPS) {
      for (var i = 0; i < OSM_STOPS.length && out.length < 8; i++) {
        if (OSM_STOPS[i][0] && norm(OSM_STOPS[i][0]).indexOf(nq) >= 0) out.push({ name: OSM_STOPS[i][0], lat: OSM_STOPS[i][1], lon: OSM_STOPS[i][2], kind: 'parada de bus' });
      }
    }
    return out.slice(0, 8);
  }
  /* Parada de bus real más cercana (catálogo OSM) dentro de maxKm. */
  function nearestBusStop(lat, lon, maxKm) {
    var best = null, bd = maxKm;
    if (!window.OSM_STOPS) return null;
    for (var i = 0; i < OSM_STOPS.length; i++) {
      var s = OSM_STOPS[i];
      if (!s[0]) continue;
      var d = P.distKm({ lat: lat, lon: lon }, { lat: s[1], lon: s[2] });
      if (d < bd) { bd = d; best = s; }
    }
    return best ? { name: best[0], km: bd } : null;
  }
  var lastNominatim = 0;
  function remoteSearch(q, cb) {
    if (!Bridge.online() || q.trim().length < 3) { cb([]); return; }
    var now = Date.now();
    if (now - lastNominatim < 1100) { cb([]); return; } // política de uso: 1 consulta por segundo
    lastNominatim = now;
    var b = D.QUITO_BOUNDS;
    var url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&accept-language=es&countrycodes=ec&bounded=1&viewbox=' +
      b.west + ',' + b.north + ',' + b.east + ',' + b.south + '&q=' + encodeURIComponent(q);
    Bridge.httpGet(url, function (res) {
      try {
        if (res.ok && res.data.status === 200) {
          var arr = JSON.parse(res.data.body);
          cb(arr.map(function (r) {
            var name = r.name || String(r.display_name || '').split(',')[0];
            var ctx = String(r.display_name || '').split(',').slice(1, 3).join(',').trim();
            return { name: name, detail: ctx, lat: parseFloat(r.lat), lon: parseFloat(r.lon), kind: 'mapa' };
          }));
          return;
        }
      } catch (e) { /* nada */ }
      cb([]);
    });
  }
  function reverseName(lat, lon, cb) {
    var fallback = 'Punto en el mapa';
    var ns = P.nearestStation({ lat: lat, lon: lon }, 0.25);
    if (ns) fallback = 'Cerca de ' + ns.station.name;
    else { var bs = nearestBusStop(lat, lon, 0.15); if (bs) fallback = 'Cerca de la parada ' + bs.name; }
    if (!Bridge.online()) { cb(fallback); return; }
    var url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&accept-language=es&lat=' + lat + '&lon=' + lon;
    Bridge.httpGet(url, function (res) {
      try {
        if (res.ok && res.data.status === 200) {
          var j = JSON.parse(res.data.body);
          var a = j.address || {};
          var name = j.name || [a.road, a.house_number].filter(Boolean).join(' ') || a.neighbourhood || a.suburb;
          if (name) { cb(name + (a.suburb && name !== a.suburb ? ', ' + a.suburb : '')); return; }
        }
      } catch (e) { /* nada */ }
      cb(fallback);
    });
  }

  /* ---------------- Mensajes ---------------- */
  function who() {
    var n = S.role === 'familia' ? (S.profile.studentName || S.profile.name) : S.profile.name;
    return firstName(n) || 'El estudiante';
  }
  var Msg = {
    start: function (t) {
      return who() + ' salió de ' + t.origin.name + ' hacia ' + t.dest.name + '. Llegada estimada: ' + hhmm(t.expectedAt) +
        '. Ruta: ' + routeSummary(t.itinerary) + '. (SafeGo)';
    },
    boarding: function (a) {
      return who() + ' está en la estación ' + a.name + ' y toma el ' + a.short + ' hacia ' + a.toward + ' ({hora}). (SafeGo)';
    },
    nearStop: function (a) {
      return who() + ' está por bajar en ' + P.cleanName(a.name) + ' ({hora}). (SafeGo)';
    },
    nearDest: function (destName) {
      return who() + ' está cerca de ' + destName + ' y llegará en unos minutos ({hora}). (SafeGo)';
    },
    arrival: function (destName) { return who() + ' llegó bien a ' + destName + ' a las {hora}. (SafeGo)'; },
    late: function (t) { return 'Aviso: ' + who() + ' aún no llega a ' + t.dest.name + ' (llegada esperada ' + hhmm(t.expectedAt) + '). Última ubicación: {link} (SafeGo)'; },
    delay: function (t, extraMin) {
      var dest = t ? t.dest.name : 'su destino';
      // En un viaje activo, expectedAt ya incluye el retraso informado
      var eta = t ? hhmm(t.expectedAt) : hhmm(Date.now() + extraMin * 60000);
      return who() + ' va con retraso hacia ' + dest + '. Nueva hora estimada: ' + eta + '. Todo bien. (SafeGo)';
    },
    ok: function (link, legName) { return who() + ' está bien' + (legName ? ', va en ' + legName : '') + '.' + (link ? ' Ubicación: ' + link : '') + ' (SafeGo)'; },
    sos: function () { return 'EMERGENCIA: ' + who() + ' necesita ayuda. Ubicación: {link} (precisión {precision} m) a las {hora}. Llama o pide ayuda al 911. (SafeGo)'; },
    location: function (link) { return 'Ubicación de ' + who() + ' a las ' + hhmm(Date.now()) + ': ' + link + ' (SafeGo)'; }
  };
  function fill(text, vars) {
    return text.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; });
  }
  function routeSummary(it) {
    if (!it) return '';
    return it.legs.filter(function (l) { return l.kind !== 'walk'; }).map(function (l) {
      return l.kind === 'ride' ? (l.fullShort || l.short) + ' de ' + P.cleanName(l.from.name) + ' a ' + P.cleanName(l.to.name) : 'bus hacia ' + l.to.name;
    }).join(', ') || 'a pie';
  }

  /* Envía un aviso por el canal configurado. auto=true intenta SMS sin intervención. */
  function sendNotice(text, opts) {
    opts = opts || {};
    var contacts = S.contacts.filter(function (c) { return c.phone; });
    if (!contacts.length) {
      openSheet(noContactsSheet());
      return;
    }
    var ch = S.settings.channel;
    var perms = Bridge.permissions();
    var smsOk = IS_NATIVE && perms.sms;
    var openWa = function () {
      if (contacts.length === 1) Bridge.whatsapp(contacts[0].phone, text);
      else openSheet(whatsappPickerSheet(text, false));
    };
    if (ch !== 'whatsapp' && smsOk) {
      // SMS automático; si falla, WhatsApp como respaldo
      Bridge.sendSms(contacts.map(function (c) { return c.phone; }), text, function (res) {
        if (res && res.ok) { toast('Aviso enviado por SMS a ' + contacts.length + (contacts.length === 1 ? ' contacto' : ' contactos')); S.stats.manualNotices++; save(); }
        else { toast('No se pudo enviar el SMS. Abriendo WhatsApp…'); openWa(); }
      });
    } else {
      openWa();
    }
    logNotice(opts.kind || 'aviso', text);
  }
  function logNotice(kind, text, auto) {
    if (S.trip) { S.trip.notices = S.trip.notices || []; S.trip.notices.push({ t: Date.now(), kind: kind, text: text, auto: !!auto }); save(); }
  }
  function whatsappPickerSheet(text, alsoSms) {
    var html = '<h3>Enviar por WhatsApp</h3><p class="sub">' + (alsoSms ? 'El SMS ya salió. ' : '') +
      'Toca cada contacto para abrir WhatsApp con el mensaje listo.</p><div class="list">';
    S.contacts.forEach(function (c, i) {
      html += '<div class="item"><div class="ic">' + icon('msg') + '</div><div class="grow"><b>' + esc(c.name) + '</b><div class="sub small">' + esc(c.relation || '') + '</div></div>' +
        '<button class="btn btn-wa sm" data-wa="' + i + '">WhatsApp</button></div>';
    });
    html += '</div><button class="btn btn-ghost block" data-wa="group" style="margin-top:8px">Elegir chat o grupo familiar</button>' +
      '<div class="kbd" style="margin-top:12px">' + esc(text) + '</div>' +
      '<button class="btn btn-light block" data-close style="margin-top:12px">Listo</button>';
    return {
      html: html, bind: function (root) {
        $$('[data-wa]', root).forEach(function (b) {
          b.onclick = function () {
            var v = b.getAttribute('data-wa');
            if (v === 'group') Bridge.whatsapp('', text);
            else Bridge.whatsapp(S.contacts[+v].phone, text);
            b.classList.add('btn-ok'); b.classList.remove('btn-wa');
          };
        });
      }
    };
  }
  function transferNoticeSheet(text) {
    return {
      html: '<h3>Avisa a tu familia</h3><p class="sub">Un toque y WhatsApp abre el mensaje listo.</p><div class="kbd">' + esc(text) + '</div>' +
        '<button class="btn btn-wa block" id="tnWa" style="margin-top:12px">' + icon('msg') + 'Enviar por WhatsApp</button>' +
        '<button class="btn btn-ghost block" data-close style="margin-top:8px">Ahora no</button>',
      bind: function (root) {
        $('#tnWa', root).onclick = function () {
          closeSheet();
          logNotice('transbordo', text);
          S.stats.manualNotices++; save();
          if (S.contacts.length === 1) Bridge.whatsapp(S.contacts[0].phone, text);
          else openSheet(whatsappPickerSheet(text, false));
        };
      }
    };
  }
  function noContactsSheet() {
    return {
      html: '<h3>Primero agrega a tu familia</h3><p class="sub">Necesitamos al menos un contacto de confianza para enviar los avisos.</p>' +
        '<button class="btn block" id="goAddContact">' + icon('plus') + 'Agregar contacto</button>',
      bind: function (root) { $('#goAddContact', root).onclick = function () { closeSheet(); openSheet(contactSheet(null)); }; }
    };
  }

  /* ---------------- Viaje en curso ---------------- */
  var Trip = {
    watchId: null,
    start: function (it) {
      Live.sync();
      if (S.role !== 'familia' && !S.contacts.length) {
        openSheet(noContactsSheet());
        return;
      }
      var now = Date.now();
      var trip = {
        id: uid(), startedAt: now, itinerary: it, origin: it.origin, dest: it.dest,
        expectedAt: now + it.totalMin * 60000, toleranceMin: +S.settings.toleranceMin || 10,
        status: 'running', currentLeg: 0, fired: {}, notices: [], lastLoc: null, lateNotified: false
      };
      var shareOk = consentOk();
      var familyOn = shareOk && S.settings.familyNotices !== false;
      var alerts = P.alertPoints(it).filter(function (a) {
        return S.settings.transferAlerts || (familyOn && a.kind === 'subir');
      });
      if (familyOn) {
        alerts.forEach(function (a) {
          if (a.kind === 'subir') a.notice = Msg.boarding(a);
          else if (a.kind === 'bajar') a.notice = Msg.nearStop(a);
        });
        // Aviso a la familia cuando se acerca al destino (si no hay ya un aviso de bajada junto al destino)
        var nearEnd = alerts.some(function (a) { return a.kind === 'bajar' && P.distKm(a, it.dest) * 1000 < 700; });
        if (!nearEnd) {
          alerts.push({ name: it.dest.name, lat: it.dest.lat, lon: it.dest.lon, radius: 500, kind: 'cerca',
            msg: 'Estás cerca de ' + it.dest.name, notice: Msg.nearDest(it.dest.name) });
        }
      }
      var payload = {
        tripId: trip.id,
        destName: it.dest.name, destLat: it.dest.lat, destLon: it.dest.lon,
        arrivalRadius: +S.settings.arrivalRadius || 150,
        startedAt: now,
        expectedAt: trip.expectedAt,
        lateAt: trip.expectedAt + trip.toleranceMin * 60000,
        alerts: alerts,
        contacts: S.contacts.map(function (c) { return { name: c.name, phone: normalizePhone(c.phone) }; }),
        autoSmsArrival: shareOk && !!S.settings.autoSmsArrival && S.settings.channel !== 'whatsapp',
        noticeSms: S.settings.channel !== 'whatsapp',
        smsOnLate: shareOk && !!S.settings.smsOnLate && S.settings.channel !== 'whatsapp',
        discreet: !!S.settings.discreet,
        studentName: who(),
        texts: { arrival: Msg.arrival(it.dest.name), late: Msg.late(trip), sos: Msg.sos() },
        // Estaciones del Metro de este viaje: bajo tierra no hay GPS y el servicio lo tiene en cuenta
        metro: metroPoints(it)
      };
      trip.batteryStart = Bridge.battery();
      trip.payload = payload;
      var ok = true;
      if (IS_NATIVE) {
        var r = call('startTrip', JSON.stringify(payload));
        if (r && String(r).indexOf('error') === 0) {
          ok = false;
          var reason = String(r).slice(6);
          if (reason.indexOf('permiso') >= 0) {
            Bridge.requestPermissions(['location', 'notifications'], function () { toast('Vuelve a tocar «Iniciar viaje»'); });
          }
          toast('No se pudo iniciar el seguimiento: ' + reason, 4000);
        }
      } else {
        this.webWatch(payload);
      }
      if (!ok) return;
      S.trip = trip;
      save(true);
      if (shareOk && S.settings.smsOnStart) sendNotice(Msg.start(trip), { kind: 'salida' });
      // El seguimiento en vivo se comparte solo: la familia recibe el enlace al iniciar cada viaje
      if (shareOk) setTimeout(function () { Live.sendStartLink(trip); }, 800);
      if (S.settings.keepScreenOn) Bridge.keepScreenOn(true);
      toast('Viaje iniciado. Te avisaremos en cada transbordo.');
      go('trip');
    },
    /* Seguimiento en el navegador (vista previa web); en Android lo hace el servicio nativo. */
    webWatch: function (payload) {
      if (!navigator.geolocation) return;
      var self = this;
      if (this.watchId !== null) navigator.geolocation.clearWatch(this.watchId);
      this.watchId = navigator.geolocation.watchPosition(function (p) {
        self.onNativeEvent({ type: 'loc', lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy, t: Date.now() });
        var t = S.trip;
        if (!t || t.status !== 'running') return;
        var me = { lat: p.coords.latitude, lon: p.coords.longitude };
        payload.alerts.forEach(function (a, i) {
          if (t.fired[i]) return;
          if (P.distKm(me, a) * 1000 <= a.radius) {
            t.fired[i] = true;
            self.onNativeEvent({ type: 'alert', idx: i, msg: a.msg, kind: a.kind, notice: a.notice ? fill(a.notice, { hora: hhmm(Date.now()) }) : null, sms: 0 });
          }
        });
        if (P.distKm(me, { lat: payload.destLat, lon: payload.destLon }) * 1000 <= Math.max(payload.arrivalRadius, Math.min(p.coords.accuracy || 0, 300))) {
          self.onNativeEvent({ type: 'arrived', t: Date.now(), sms: 0, auto: true });
        }
      }, function () {}, { enableHighAccuracy: true, maximumAge: 10000 });
    },
    stopWeb: function () {
      if (this.watchId !== null && navigator.geolocation) navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    },
    onNativeEvent: function (ev) {
      if (!ev) return;
      var t = S.trip;
      if (ev.type === 'loc') {
        if (Map.map) Map.setMe(ev.lat, ev.lon, ev.acc);
        if (t && t.status === 'running') {
          t.lastLoc = { lat: ev.lat, lon: ev.lon, acc: ev.acc, t: ev.t || Date.now() };
          this.updateLeg(t);
          save();
          if (currentTab === 'trip' && !stack.length) updateTripPanel();
        }
        lastKnown = { lat: ev.lat, lon: ev.lon, acc: ev.acc, t: ev.t || Date.now() };
      } else if (ev.type === 'alert') {
        if (t) { t.fired = t.fired || {}; t.fired[ev.idx] = true; }
        if (!IS_NATIVE) Bridge.vibrate([300, 150, 300]);
        toast(ev.msg, 5000);
        if (ev.notice) {
          if (ev.sms) { S.stats.autoNotices += ev.sms; logNotice(ev.kind === 'subir' ? 'subida' : 'transbordo', ev.notice, true); toast('Avisamos a tu familia: ' + ev.msg, 5000); }
          else if (S.contacts.length) openSheet(transferNoticeSheet(ev.notice));
        }
        if (t) { this.updateLeg(t); save(); }
        if (currentTab === 'trip') updateTripPanel();
      } else if (ev.type === 'arrived') {
        this.finish('llegó', ev);
      } else if (ev.type === 'late') {
        if (t) { t.lateNotified = true; save(); }
        if (currentTab === 'trip') updateTripPanel();
      } else if (ev.type === 'stopped') {
        if (t && t.status === 'running') this.finish('cancelado', ev);
      } else if (ev.type === 'sms') {
        if (ev.sent) { S.stats.autoNotices += ev.sent; save(); }
      } else if (ev.type === 'metro') {
        if (t) {
          t.underground = !!ev.on;
          if (ev.on) t.metroGaps = (t.metroGaps || 0) + 1;
          save();
        }
        if (ev.on) toast('Estás en el Metro: sin señal GPS. Seguimos tu viaje al salir.', 4500);
        if (currentTab === 'trip') updateTripPanel();
      }
    },
    updateLeg: function (t) {
      if (!t.lastLoc) return;
      var legs = t.itinerary.legs;
      var me = t.lastLoc;
      var best = t.currentLeg || 0, bd = Infinity;
      for (var i = t.currentLeg || 0; i < legs.length; i++) {
        var pts = legs[i].geometry || legs[i].points;
        for (var j = 0; j < pts.length; j++) {
          var d = P.distKm(me, { lat: pts[j][0], lon: pts[j][1] });
          if (d < bd - 0.05) { bd = d; best = i; }
        }
        // Si ya pasamos el final de este tramo, avanzamos
      }
      var leg = legs[best];
      if (leg && best < legs.length - 1 && P.distKm(me, leg.to) < 0.15) best++;
      t.currentLeg = Math.max(t.currentLeg || 0, best);
    },
    arriveManual: function () {
      if (!S.trip) return;
      if (IS_NATIVE) {
        var r = call('tripAction', 'arrive');
        if (r === 'ok') return; // el servicio confirmará con el evento 'arrived'
      }
      this.finish('llegó', { t: Date.now(), manual: true, sms: 0 });
    },
    cancel: function () {
      if (!S.trip) return;
      if (IS_NATIVE) call('tripAction', 'cancel');
      this.finish('cancelado', { t: Date.now() });
    },
    finish: function (status, ev) {
      var t = S.trip;
      if (!t) return;
      this.stopWeb();
      Bridge.keepScreenOn(false);
      var end = ev.t || Date.now();
      t.status = status;
      var rec = {
        id: t.id, origin: t.origin.name, dest: t.dest.name, startedAt: t.startedAt, endedAt: end,
        plannedMin: t.itinerary.totalMin, actualMin: Math.round((end - t.startedAt) / 60000), status: status,
        onTime: status === 'llegó' && end <= t.expectedAt + t.toleranceMin * 60000,
        modes: t.itinerary.modes || [], notices: (t.notices || []).length + (ev.sms || 0),
        // Datos para las pruebas reales: llegada detectada sola, avisos enviados, batería y tramos sin GPS en el Metro
        autoArrival: status === 'llegó' && !ev.manual,
        autoNotices: (t.notices || []).filter(function (n) { return n.auto; }).length + (ev.sms || 0),
        noticeLog: (t.notices || []).map(function (n) { return { t: n.t, kind: n.kind, auto: !!n.auto }; })
          .concat(ev.sms ? [{ t: end, kind: 'llegada', auto: true }] : []),
        metroGaps: t.metroGaps || 0
      };
      var bEnd = Bridge.battery();
      if (t.batteryStart >= 0 && bEnd >= 0) rec.battery = Math.max(0, t.batteryStart - bEnd);
      S.history.unshift(rec);
      if (ev.sms) S.stats.autoNotices += ev.sms;
      S.trip = null;
      if (status === 'llegó') {
        S.lastArrival = { t: end, dest: t.dest.name, smsSent: ev.sms || 0, manual: !!ev.manual };
        var text = fill(Msg.arrival(t.dest.name), { hora: hhmm(end) });
        // Sin SMS automático, ofrecemos enviar el aviso por WhatsApp de inmediato.
        if (!ev.sms) {
          setTimeout(function () { sendNotice(text, { kind: 'llegada' }); }, 300);
        } else {
          toast('Llegaste. Tu familia ya recibió el aviso por SMS.', 4500);
        }
      } else {
        toast('Viaje terminado');
      }
      save(true);
      render();
    },
    restore: function () {
      // Sincroniza con el servicio nativo (por si la app se cerró en medio del viaje)
      if (!IS_NATIVE) {
        if (S.trip && S.trip.status === 'running' && S.trip.payload) this.webWatch(S.trip.payload);
        return;
      }
      var raw = call('tripStatus');
      var st = null;
      try { st = raw ? JSON.parse(raw) : null; } catch (e) { st = null; }
      if (st && st.events && st.events.length) {
        // Eventos ocurridos mientras la interfaz estaba cerrada
        st.events.forEach(function (ev) { Trip.onNativeEvent(ev); });
      }
      if (S.trip && S.trip.status === 'running' && (!st || !st.running)) {
        if (st && st.arrivedAt) this.finish('llegó', { t: st.arrivedAt, sms: st.smsSent || 0 });
        else if (st && st.stoppedAt) this.finish('cancelado', { t: st.stoppedAt });
        else {
          // El servicio no está activo (p. ej., reinicio del teléfono): lo reanudamos
          var r = call('startTrip', JSON.stringify(S.trip.payload));
          if (r && String(r).indexOf('error') === 0) toast('El seguimiento se detuvo. Ábrelo desde «Viaje».', 4000);
        }
      }
      if (st && st.last) Trip.onNativeEvent({ type: 'loc', lat: st.last.lat, lon: st.last.lon, acc: st.last.acc, t: st.last.t });
    }
  };
  var lastKnown = null;
  function metroPoints(it) {
    var out = [];
    (it.legs || []).forEach(function (l) {
      if (l.kind === 'ride' && l.mode === 'metro') (l.points || []).forEach(function (p) { out.push([p[0], p[1]]); });
    });
    return out;
  }

  /* ---------------- SOS ---------------- */
  var sosTimer = null;
  function startSos() {
    var ov = $('#sosOverlay');
    var n = 3;
    $('#sosCount').textContent = n;
    $('#sosText').textContent = S.contacts.length ?
      'Se enviará tu ubicación a ' + S.contacts.length + (S.contacts.length === 1 ? ' contacto' : ' contactos') + ' de confianza.' :
      'No tienes contactos. Te ayudaremos a llamar al 911.';
    ov.classList.remove('hidden');
    Bridge.vibrate([200, 100, 200]);
    clearInterval(sosTimer);
    sosTimer = setInterval(function () {
      n--;
      $('#sosCount').textContent = n;
      if (n <= 0) { clearInterval(sosTimer); ov.classList.add('hidden'); fireSos(); }
    }, 1000);
  }
  $('#sosCancel').onclick = function () { clearInterval(sosTimer); $('#sosOverlay').classList.add('hidden'); toast('SOS cancelado'); };

  function fireSos() {
    toast('Obteniendo tu ubicación…');
    var done = false;
    var proceed = function (loc) {
      if (done) return; done = true;
      var link = loc ? osmLink(loc.lat, loc.lon) : '(ubicación no disponible)';
      var text = fill(Msg.sos(), { link: link, precision: loc && loc.acc ? Math.round(loc.acc) : '?', hora: hhmm(Date.now()) });
      var phones = S.contacts.map(function (c) { return c.phone; });
      var perms = Bridge.permissions();
      var smsResult = 'no';
      if (phones.length && IS_NATIVE && perms.sms) {
        smsResult = 'enviando';
        Bridge.sendSms(phones, text, function (res) {
          toast(res && res.ok ? 'SOS enviado por SMS' : 'No se pudo enviar el SMS de SOS', 4000);
        });
      }
      logNotice('sos', text);
      openSheet(sosResultSheet(text, smsResult));
    };
    Bridge.getLocation(function (res) {
      if (res && res.ok) proceed(res.data); else proceed(lastKnown);
    });
    setTimeout(function () { proceed(lastKnown); }, 9000);
  }
  function sosResultSheet(text, smsResult) {
    var html = '<h3 style="color:var(--primary)">SOS activado</h3>' +
      (smsResult === 'enviando' ? '<p>Enviamos un SMS con tu ubicación a tus contactos.</p>' :
        '<p>Envía el mensaje por WhatsApp o llama al 911.</p>') +
      '<button class="btn block" id="call911">' + icon('phone') + 'Llamar al 911 (ECU 911)</button>' +
      '<div style="height:8px"></div>';
    if (S.contacts.length) {
      html += '<button class="btn btn-wa block" id="sosWa">' + icon('msg') + 'Enviar por WhatsApp</button><div style="height:8px"></div>';
      S.contacts.slice(0, 3).forEach(function (c, i) {
        html += '<button class="btn btn-light block" data-call="' + i + '" style="margin-bottom:8px">' + icon('phone') + 'Llamar a ' + esc(c.name) + '</button>';
      });
    }
    html += '<button class="btn btn-ghost block" data-close>Cerrar</button>';
    return {
      html: html, bind: function (root) {
        $('#call911', root).onclick = function () { Bridge.dial('911'); };
        var wa = $('#sosWa', root);
        if (wa) wa.onclick = function () { if (S.contacts.length === 1) Bridge.whatsapp(S.contacts[0].phone, text); else { closeSheet(); openSheet(whatsappPickerSheet(text, smsResult === 'enviando')); } };
        $$('[data-call]', root).forEach(function (b) { b.onclick = function () { Bridge.dial(S.contacts[+b.getAttribute('data-call')].phone); }; });
      }
    };
  }
  function bindHoldSos(btn) {
    if (!btn) return;
    var timer = null, fillEl = $('.fill', btn), startT = 0, raf = null;
    var HOLD = 1500;
    function step() {
      var p = Math.min(1, (Date.now() - startT) / HOLD);
      if (fillEl) fillEl.style.width = (p * 100) + '%';
      if (p < 1) raf = requestAnimationFrame(step);
    }
    function down(e) {
      e.preventDefault();
      startT = Date.now();
      raf = requestAnimationFrame(step);
      timer = setTimeout(function () { up(); startSos(); }, HOLD);
    }
    function up() {
      clearTimeout(timer); cancelAnimationFrame(raf);
      if (fillEl) fillEl.style.width = '0';
    }
    btn.addEventListener('touchstart', down, { passive: false });
    btn.addEventListener('mousedown', down);
    ['touchend', 'touchcancel', 'mouseup', 'mouseleave'].forEach(function (ev) { btn.addEventListener(ev, up); });
  }

  /* ---------------- Hoja inferior ---------------- */
  var sheetOpen = false;
  function openSheet(spec) {
    Tips.clear();
    var body = $('#sheetBody');
    body.innerHTML = spec.html;
    $('#sheet').classList.remove('hidden');
    sheetOpen = true;
    $$('[data-close]', body).forEach(function (b) { b.onclick = closeSheet; });
    if (spec.bind) spec.bind(body);
  }
  function closeSheet() { $('#sheet').classList.add('hidden'); $('#sheetBody').innerHTML = ''; sheetOpen = false; }
  $('#sheet').addEventListener('click', function (e) { if (e.target.id === 'sheet') closeSheet(); });

  /* ---------------- Navegación ---------------- */
  var currentTab = 'home';
  var stack = []; // subpantallas dentro de "Más" u otras
  function go(tab) { currentTab = tab; stack = []; render(); $('#view').scrollTop = 0; }
  function push(view) { stack.push(view); render(); $('#view').scrollTop = 0; }
  function goBack() {
    if (!$('#sosOverlay').classList.contains('hidden')) { $('#sosCancel').click(); return true; }
    if (sheetOpen) { closeSheet(); return true; }
    if ($('#tutorial')) { Tutorial.close(); return true; }
    if (!S.onboarded && onbStep > 0) {
      onbStep = (onbStep === 5 && onbDraft.role === 'familia') ? 3 : onbStep - 1;
      render(); return true;
    }
    if (stack.length) { stack.pop(); render(); return true; }
    if (currentTab === 'plan' && planState.selected !== null) { planState.selected = null; render(); return true; }
    if (currentTab !== 'home') { go('home'); return true; }
    return false;
  }
  $$('#tabs .tab').forEach(function (b) {
    b.innerHTML = b.innerHTML.replace(/<i data-ic="(\w+)"><\/i>/, function (m, n) { return icon(n); });
    b.onclick = function () { go(b.getAttribute('data-tab')); };
  });
  $('#backBtn').innerHTML = icon('back');
  $('#backBtn').onclick = goBack;
  $('#sosTop').onclick = function () { startSos(); };

  var VIEWS = {};
  function render() {
    applyTheme();
    var view = $('#view');
    var onb = !S.onboarded;
    $('#tabs').classList.toggle('hidden', onb);
    $('#sosTop').classList.toggle('hidden', onb);
    $$('#tabs .tab').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-tab') === currentTab); });
    var tripTab = $('#tabs [data-tab="trip"]');
    var dot = $('.dot', tripTab);
    if (S.trip && S.trip.status === 'running') { if (!dot) { dot = document.createElement('div'); dot.className = 'dot'; tripTab.appendChild(dot); } }
    else if (dot) dot.remove();
    document.body.classList.toggle('discreet', !!S.settings.discreet);

    var name = onb ? 'onboarding' : (stack.length ? stack[stack.length - 1] : currentTab);
    var v = VIEWS[name] || VIEWS.home;
    $('#backBtn').classList.toggle('hidden', !(stack.length || (onb && onbStep > 0)));
    $('#title').textContent = v.title ? v.title() : 'SafeGo';
    Map.onClick = null;
    Map.mount(null);
    if (name !== 'live' && Map.map) Map.clear('live');
    view.className = v.full ? 'full' : '';
    try {
      view.innerHTML = v.html();
      if (v.bind) v.bind(view);
    } catch (e) {
      console.error(e);
      view.className = '';
      view.innerHTML = '<div class="card warn"><h3>Algo salió mal</h3><p class="sub">' + esc(e.message) + '</p><button class="btn block" id="errHome">Volver al inicio</button></div>';
      $('#errHome').onclick = function () { stack = []; go('home'); };
    }
    var slot = $('.map-slot', view);
    if (slot) { Map.mount(slot); if (v.onMap) v.onMap(); }
    renderOfflineBar();
    Tips.clear();
    if (!onb && !stack.length) setTimeout(function () { Tips.show(currentTab); }, 400);
  }
  function renderOfflineBar() {
    var bar = $('#offlineBar');
    var off = !Bridge.online();
    if (off && !bar) {
      bar = document.createElement('div');
      bar.id = 'offlineBar'; bar.className = 'offline-bar';
      bar.textContent = 'Sin conexión: el planificador y los SMS siguen funcionando; el mapa usa lo guardado.';
      $('#topbar').after(bar);
    } else if (!off && bar) bar.remove();
  }
  window.addEventListener('online', renderOfflineBar);
  window.addEventListener('offline', renderOfflineBar);
  function applyTheme() {
    var t = S.settings.theme;
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  }

  /* ---------------- Bienvenida ---------------- */
  var onbStep = 0;
  var onbDraft = { role: 'estudiante', name: '', studentName: '', cName: '', cPhone: '', cRel: '' };
  VIEWS.onboarding = {
    title: function () { return 'Bienvenida'; },
    html: function () {
      var d = onbDraft;
      if (onbStep === 0) {
        return '<div class="onb"><div class="art"><div class="onb-logo"><img src="img/logo.webp" alt="SafeGo"></div>' +
          '<h1 style="margin-top:18px">Llega con más tranquilidad.</h1><p style="opacity:.92">Rutas de Bus, Trolebús, Ecovía y Metro de Quito en una sola pantalla, y tu familia te sigue en vivo hasta que llegas.</p></div>' +
          '<div class="card flat"><div class="row"><div class="ic" style="color:var(--primary)">' + icon('route', 'width="26" height="26"') + '</div><div><b>Rutas con transbordos</b><div class="sub small">Te avisamos antes de bajar y al cambiar de transporte.</div></div></div></div>' +
          '<div class="card flat"><div class="row"><div class="ic" style="color:var(--primary)">' + icon('bell', 'width="26" height="26"') + '</div><div><b>Aviso automático de llegada</b><div class="sub small">Tu familia sabe que llegaste sin tener que llamar.</div></div></div></div>' +
          '<div class="card flat"><div class="row"><div class="ic" style="color:var(--primary)">' + icon('shield', 'width="26" height="26"') + '</div><div><b>Botón SOS discreto</b><div class="sub small">Comparte tu ubicación sin sacar el celular por mucho tiempo.</div></div></div></div>' +
          '<button class="btn block" id="next">Empezar</button>' +
          '<button class="btn btn-ghost block" id="import">Tengo un código de configuración</button></div>';
      }
      if (onbStep === 1) {
        return '<div class="onb"><h1>¿Quién usará la app?</h1><p class="sub">Puedes cambiarlo luego en Ajustes.</p>' +
          '<button class="choice ' + (d.role === 'estudiante' ? 'sel' : '') + '" data-role="estudiante">' + icon('school') + '<div><b>Soy estudiante</b><div class="sub small">Viajo solo/a y quiero rutas claras y avisar al llegar.</div></div></button>' +
          '<button class="choice ' + (d.role === 'familia' ? 'sel' : '') + '" data-role="familia">' + icon('heart') + '<div><b>Soy madre, padre o representante</b><div class="sub small">Quiero planificar su ruta y recibir los avisos.</div></div></button>' +
          '<button class="btn block" id="next">Continuar</button></div>';
      }
      if (onbStep === 2) {
        var fam = d.role === 'familia';
        return '<div class="onb"><h1>' + (fam ? 'Cuéntanos de tu familia' : '¿Cómo te llamas?') + '</h1>' +
          '<label class="field"><span>' + (fam ? 'Tu nombre' : 'Tu nombre') + '</span><input class="input" id="fName" maxlength="40" value="' + esc(d.name) + '" placeholder="Ej.: Ana"></label>' +
          (fam ? '<label class="field"><span>Nombre del estudiante</span><input class="input" id="fStudent" maxlength="40" value="' + esc(d.studentName) + '" placeholder="Ej.: Mateo"></label>' : '') +
          '<p class="sub small">Solo se usa en los mensajes de aviso. Se guarda únicamente en este teléfono.</p>' +
          '<button class="btn block" id="next">Continuar</button></div>';
      }
      if (onbStep === 3) {
        var fam2 = d.role === 'familia';
        return '<div class="onb"><h1>' + (fam2 ? '¿A quién avisa ' + esc(firstName(d.studentName) || 'el estudiante') + '?' : '¿A quién avisamos cuando llegues?') + '</h1>' +
          '<p class="sub">' + (fam2 ? 'Pon tu número. Lo incluiremos en el código para configurar su teléfono.' : 'Agrega a tu mamá, papá o representante. Puedes añadir más después.') + '</p>' +
          '<label class="field"><span>Nombre</span><input class="input" id="cName" maxlength="40" value="' + esc(d.cName || (fam2 ? d.name : '')) + '" placeholder="Ej.: Mamá"></label>' +
          '<label class="field"><span>Celular</span><input class="input" id="cPhone" type="tel" inputmode="tel" maxlength="20" value="' + esc(d.cPhone) + '" placeholder="09xxxxxxxx"></label>' +
          '<label class="field"><span>Relación</span><input class="input" id="cRel" maxlength="30" value="' + esc(d.cRel || (fam2 ? 'Representante' : '')) + '" placeholder="Ej.: Madre"></label>' +
          '<button class="btn block" id="next">Continuar</button><button class="btn btn-ghost block" id="skip">Lo hago después</button></div>';
      }
      if (onbStep === 4 && d.role !== 'familia') return consentHtml(d.consent !== false, d.cName ? esc(firstName(d.cName)) : null);
      return '<div class="onb"><h1>Permisos para cuidarte</h1>' +
        '<div class="card flat"><b>' + icon('pin', 'width="18" height="18"') + ' Ubicación</b><p class="sub small">Para saber cuándo llegas y avisarte antes de bajar. Solo durante un viaje que tú inicias.</p></div>' +
        '<div class="card flat"><b>' + icon('bell', 'width="18" height="18"') + ' Notificaciones</b><p class="sub small">Para los avisos de transbordo y llegada, con vibración.</p></div>' +
        '<div class="card flat"><b>' + icon('msg', 'width="18" height="18"') + ' SMS (opcional)</b><p class="sub small">Para que el aviso de llegada salga solo, sin abrir WhatsApp. Usa tu saldo de SMS.</p></div>' +
        '<button class="btn block" id="perm">Permitir y terminar</button><button class="btn btn-ghost block" id="finish">Terminar sin permisos</button></div>';
    },
    bind: function (root) {
      var d = onbDraft;
      var next = $('#next', root);
      $$('[data-role]', root).forEach(function (b) { b.onclick = function () { d.role = b.getAttribute('data-role'); render(); }; });
      if (onbStep === 0) {
        next.onclick = function () { onbStep = 1; render(); };
        $('#import', root).onclick = function () { openSheet(importSheet(true)); };
      } else if (onbStep === 1) {
        next.onclick = function () { onbStep = 2; render(); };
      } else if (onbStep === 2) {
        next.onclick = function () {
          d.name = $('#fName', root).value.trim();
          if ($('#fStudent', root)) d.studentName = $('#fStudent', root).value.trim();
          if (!d.name) { toast('Escribe tu nombre'); return; }
          onbStep = 3; render();
        };
      } else if (onbStep === 3) {
        next.onclick = function () {
          d.cName = $('#cName', root).value.trim(); d.cPhone = $('#cPhone', root).value.trim(); d.cRel = $('#cRel', root).value.trim();
          if (!d.cName || !validPhone(d.cPhone)) { toast('Revisa el nombre y el número'); return; }
          onbStep = d.role === 'familia' ? 5 : 4; render();
        };
        $('#skip', root).onclick = function () { d.cName = ''; d.cPhone = ''; onbStep = d.role === 'familia' ? 5 : 4; render(); };
      } else if (onbStep === 4 && d.role !== 'familia') {
        bindConsent(root, function (given) { d.consent = given; onbStep = 5; render(); });
      } else {
        var finish = function () {
          S.role = d.role;
          S.profile.name = d.name;
          S.profile.studentName = d.studentName;
          if (d.role !== 'familia') setConsent(d.consent !== false);
          if (d.cName && validPhone(d.cPhone) && !S.contacts.some(function (c) { return normalizePhone(c.phone) === normalizePhone(d.cPhone); })) {
            S.contacts.push({ id: uid(), name: d.cName, phone: d.cPhone, relation: d.cRel });
          }
          S.onboarded = true;
          save(true);
          go('home');
          Tutorial.start();
        };
        $('#perm', root).onclick = function () { Bridge.requestPermissions(['location', 'notifications', 'sms'], function () { finish(); }); };
        $('#finish', root).onclick = finish;
      }
    }
  };


  /* ---------------- Consentimiento del estudiante ---------------- */
  // Los avisos automáticos (llegada, subida, retraso) comparten la ubicación del estudiante.
  // Solo se activan si el estudiante lo acepta en su propio teléfono.
  var CONSENT_VERSION = 2; // 2: se agregó la ubicación en vivo
  function consentOk() {
    return S.role === 'familia' || !!(S.consent && S.consent.given && S.consent.v === CONSENT_VERSION);
  }
  function setConsent(given) {
    S.consent = { given: !!given, at: Date.now(), v: CONSENT_VERSION };
    save();
    Live.sync();
  }
  function consentHtml(checked, namesHtml) {
    var fam = namesHtml ? namesHtml : S.contacts.length ? S.contacts.map(function (c) { return esc(firstName(c.name)); }).join(', ') : 'tus contactos de confianza';
    return '<div class="onb"><h1>Lo que compartes con tu familia</h1>' +
      '<p class="sub">Tú decides. Esto es lo que recibirán ' + fam + ':</p>' +
      '<div class="card flat"><div class="list">' +
      '<div class="item"><div class="ic">' + icon('bell') + '</div><div class="grow"><b>Avisos en los momentos que importan</b><div class="sub small">Tu familia recibe un SMS cuando subes, cuando haces transbordo, cuando estás por bajar o cerca de tu destino, cuando llegas y si te retrasas (con tu última ubicación).</div></div></div>' +
      '<div class="item"><div class="ic">' + icon('pin') + '</div><div class="grow"><b>Seguimiento en vivo, solo durante tu viaje</b><div class="sub small">Al iniciar cada viaje, tu familia recibe por SMS un enlace para verte en el mapa. Termina cuando llegas o terminas el viaje; fuera de un viaje no se comparte nada. Puedes apagarlo en Familia.</div></div></div>' +
      '<div class="item"><div class="ic">' + icon('alert') + '</div><div class="grow"><b>SOS, solo si tú lo activas</b><div class="sub small">Mantienes presionado el botón y se envía tu ubicación.</div></div></div>' +
      '<div class="item"><div class="ic">' + icon('shield') + '</div><div class="grow"><b>Cifrado, sin cuentas</b><div class="sub small">La ubicación en vivo viaja cifrada por ntfy.sh (servicio libre) y solo tu familia tiene la clave. Puedes apagarla cuando quieras en Familia o en Más › Ajustes.</div></div></div>' +
      '</div></div>' +
      '<label class="card flat row" style="cursor:pointer"><div class="grow"><b>Acepto compartir estos avisos con mi familia</b><div class="sub small">Si eres menor de 18 años, tu representante debe estar de acuerdo (Ley Orgánica de Protección de Datos Personales).</div></div>' +
      '<span class="switch"><input type="checkbox" id="consentChk" ' + (checked ? 'checked' : '') + '><span></span></span></label>' +
      '<button class="btn block" id="consentOk">Continuar</button>' +
      '<p class="sub small">Si no aceptas, la app igual te guía en el viaje y tú decides cuándo enviar cada mensaje.</p></div>';
  }
  function bindConsent(root, done) {
    $('#consentOk', root).onclick = function () { done($('#consentChk', root).checked); };
  }
  function consentSheet(after) {
    return {
      html: consentHtml(true).replace('<div class="onb">', '<div>'),
      bind: function (root) {
        bindConsent(root, function (given) {
          setConsent(given);
          closeSheet();
          toast(given ? 'Avisos automáticos activados' : 'Avisos automáticos apagados. Tú envías cada mensaje.', 3500);
          if (after) after(given); else render();
        });
      }
    };
  }

  /* ---------------- Tutorial: ventanas de bienvenida y consejos en pantalla ---------------- */
  var TUTORIAL_VERSION = 1;

  // Ilustraciones: un círculo de color con un ícono grande y pequeñas insignias alrededor.
  function tutArt(main, color, badges) {
    var b = (badges || []).map(function (x, i) {
      var pos = ['top:6px;right:18%', 'bottom:10px;left:16%', 'top:40%;left:6%'][i];
      return '<span class="tut-badge" style="' + pos + ';background:' + x[1] + '">' + icon(x[0], 'width="18" height="18"') + '</span>';
    }).join('');
    return '<div class="tut-art"><div class="tut-circle" style="background:' + color + '">' + icon(main, 'width="56" height="56"') + '</div>' + b + '</div>';
  }

  function tutorialSlides() {
    if (S.role === 'familia') {
      var st = esc(firstName(S.profile.studentName) || 'tu hijo/a');
      return [
        { art: tutArt('heart', '#B3303F', [['bell', '#2E7D5B'], ['msg', '#1F8A4C']]), title: 'Bienvenida a SafeGo',
          text: 'Sabrás que ' + st + ' llegó bien sin parar tu trabajo para llamar. Te mostramos cómo en 4 pasos.' },
        { art: tutArt('route', '#3A5BA0', [['train', '#B3303F'], ['bus', '#2E7D5B']]), title: '1. Arma su ruta',
          text: 'En <b>Rutas</b> eliges desde dónde sale y a qué colegio va. Verás Bus, Trolebús, Ecovía y Metro con cada transbordo, y puedes enviársela por WhatsApp.' },
        { art: tutArt('key', '#C77A12', [['users', '#B3303F']]), title: '2. Configura su teléfono',
          text: 'En <b>Familia › Crear código</b> generas un código con tus contactos y sus lugares. ' + st + ' lo pega en su app y queda listo. Su app le pedirá aceptar qué se comparte contigo.' },
        { art: tutArt('bell', '#2E7D5B', [['check', '#2E7D5B'], ['clock', '#C77A12']]), title: '3. Recibe los avisos',
          text: 'Te llega un mensaje cuando sube en cada estación, cuando llega y si se retrasa (con su última ubicación). Por SMS automático o WhatsApp.' },
        { art: tutArt('alert', '#B3303F', [['phone', '#392126']]), title: '4. SOS siempre a mano',
          text: 'Si algo pasa, se mantiene presionado <b>SOS</b> y recibes su ubicación al instante. También puede llamar al 911.' }
      ];
    }
    return [
      { art: tutArt('shield', '#B3303F', [['bus', '#3A5BA0'], ['heart', '#2E7D5B']]), title: 'Bienvenido a SafeGo',
        text: 'Te ayuda a no perderte en los transbordos y avisa a tu familia sin que tengas que sacar el celular. Mira cómo en 5 pasos.' },
      { art: tutArt('pin', '#3A5BA0', [['home', '#2E7D5B'], ['school', '#B3303F']]), title: '1. Elige a dónde vas',
        text: 'Toca <b>Casa</b> o tu colegio en Inicio, o busca un lugar en <b>Rutas</b>. También puedes tocar 📍 y marcarlo en el mapa.' },
      { art: tutArt('route', '#2E7D5B', [['train', '#B3303F'], ['walk', '#766168']]), title: '2. Escoge cómo ir',
        text: 'Compara las opciones. La <b>Recomendada</b> tiene pocos transbordos y poca caminata. Toca una para ver cada paso: dónde subir y dónde bajar.' },
      { art: tutArt('play', '#B3303F', [['bell', '#C77A12'], ['users', '#2E7D5B']]), title: '3. Inicia el viaje y guarda el celular',
        text: 'Toca <b>Iniciar viaje</b>. El teléfono vibra antes de cada estación donde bajas, y avisa a tu familia cuando subes. Funciona con la pantalla apagada.' },
      { art: tutArt('check', '#2E7D5B', [['msg', '#1F8A4C']]), title: '4. Llegas y tu familia lo sabe',
        text: 'Al llegar a tu destino se envía el aviso solo (SMS) o con un toque por WhatsApp. Si te retrasas, toca <b>Voy tarde</b>.' },
      { art: tutArt('alert', '#B3303F', [['phone', '#392126']]), title: '5. Si algo pasa: SOS',
        text: 'Mantén presionado <b>SOS</b> un segundo y medio. Tienes 3 segundos para cancelar; luego se envía tu ubicación y puedes llamar al 911.' }
    ];
  }

  var Tutorial = {
    idx: 0,
    slides: [],
    start: function (force) {
      if (!force && S.tutorial && S.tutorial.v >= TUTORIAL_VERSION) return;
      this.slides = tutorialSlides();
      this.idx = 0;
      var el = document.getElementById('tutorial');
      if (!el) {
        el = document.createElement('div');
        el.id = 'tutorial';
        el.className = 'tut-overlay';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        document.body.appendChild(el);
      }
      this.paint();
      this.bindSwipe(el);
    },
    paint: function () {
      var el = document.getElementById('tutorial');
      if (!el) return;
      var s = this.slides[this.idx];
      var last = this.idx === this.slides.length - 1;
      el.innerHTML = '<div class="tut-card">' +
        '<button class="tut-skip" id="tutSkip">' + (last ? '' : 'Saltar') + '</button>' +
        s.art + '<h2 class="tut-title">' + s.title + '</h2><p class="tut-text">' + s.text + '</p>' +
        '<div class="tut-dots">' + this.slides.map(function (x, i) { return '<span class="' + (i === Tutorial.idx ? 'on' : '') + '"></span>'; }).join('') + '</div>' +
        '<div class="row" style="gap:10px">' +
        (this.idx > 0 ? '<button class="btn btn-ghost" id="tutPrev" style="flex:1">Atrás</button>' : '') +
        '<button class="btn" id="tutNext" style="flex:2">' + (last ? '¡Empezar!' : 'Siguiente') + '</button></div></div>';
      var self = this;
      $('#tutNext', el).onclick = function () { self.next(); };
      var pv = $('#tutPrev', el);
      if (pv) pv.onclick = function () { self.prev(); };
      $('#tutSkip', el).onclick = function () { self.close(); };
    },
    next: function () { if (this.idx < this.slides.length - 1) { this.idx++; this.paint(); } else this.close(); },
    prev: function () { if (this.idx > 0) { this.idx--; this.paint(); } },
    close: function () {
      var el = document.getElementById('tutorial');
      if (el) el.remove();
      S.tutorial = { v: TUTORIAL_VERSION, at: Date.now() };
      save();
      // Quien actualiza desde una versión anterior también debe decidir sobre el consentimiento
      if (S.role !== 'familia' && !(S.consent && S.consent.v === CONSENT_VERSION)) setTimeout(function () { openSheet(consentSheet()); }, 250);
      else setTimeout(function () { Tips.show(currentTab); }, 300);
    },
    bindSwipe: function (el) {
      var x0 = null, self = this;
      el.ontouchstart = function (e) { x0 = e.touches[0].clientX; };
      el.ontouchend = function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        x0 = null;
        if (dx < -50) self.next(); else if (dx > 50) self.prev();
      };
    }
  };

  /* Consejos de una sola vez: una pequeña ventana junto al botón que explican. */
  var SCREEN_TIPS = {
    home: [['#sosBig', 'sos', 'Mantén presionado este botón un segundo y medio si necesitas ayuda. Tienes 3 segundos para cancelar.'],
      ['[data-goto]', 'goto', 'Toca uno de tus lugares para ver al instante cómo llegar desde donde estás.']],
    plan: [['#pickDest', 'pick', 'Toca aquí y luego el mapa para marcar tu destino exacto.'],
      ['#fabLayers', 'layers', 'Muestra u oculta las líneas de Metro, Trolebús, Ecovía, Metrobús y buses.'],
      ['.opt', 'opt', 'Toca una opción para ver cada paso: dónde subir, dónde bajar y cuánto caminar.']],
    trip: [['#tArrived', 'arrived', 'Si la app no detectó tu llegada (por ejemplo, dentro de un edificio), toca aquí para avisar.'],
      ['#tDelay', 'delay', '¿Se demoró el bus? Avisa el retraso y tu familia no tendrá que llamarte.']],
    family: [['#addC', 'contact', 'Agrega a quienes deben recibir tus avisos. Usa números celulares de Ecuador (09…).']]
  };
  var Tips = {
    show: function (tab) {
      if (!S.onboarded || document.getElementById('tutorial') || sheetOpen || stack.length) return;
      if (!S.tutorial) return; // primero el tutorial
      S.seenTips = S.seenTips || {};
      var list = SCREEN_TIPS[tab] || [];
      for (var i = 0; i < list.length; i++) {
        var key = tab + ':' + list[i][1];
        if (S.seenTips[key]) continue;
        var target = $(list[i][0]);
        if (!target || !target.offsetParent) continue;
        this.bubble(target, list[i][2], key);
        return;
      }
    },
    bubble: function (target, text, key) {
      this.clear();
      var r = target.getBoundingClientRect();
      var tip = document.createElement('div');
      tip.className = 'tip';
      tip.id = 'tipBubble';
      tip.innerHTML = '<div>' + esc(text) + '</div><button class="btn sm btn-light" id="tipOk">Entendido</button>';
      document.body.appendChild(tip);
      var below = r.top < window.innerHeight / 2;
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      var left = Math.max(12, Math.min(window.innerWidth - tw - 12, r.left + r.width / 2 - tw / 2));
      tip.style.left = left + 'px';
      tip.style.top = (below ? r.bottom + 12 : r.top - th - 12) + 'px';
      tip.classList.add(below ? 'below' : 'above');
      tip.style.setProperty('--ax', Math.max(16, Math.min(tw - 16, r.left + r.width / 2 - left)) + 'px');
      target.classList.add('tip-target');
      var self = this;
      $('#tipOk', tip).onclick = function () {
        S.seenTips[key] = true; save();
        self.clear();
        setTimeout(function () { self.show(currentTab); }, 200);
      };
    },
    clear: function () {
      var t = document.getElementById('tipBubble');
      if (t) t.remove();
      $$('.tip-target').forEach(function (e) { e.classList.remove('tip-target'); });
    },
    reset: function () { S.seenTips = {}; save(); }
  };

  /* ---------------- Inicio ---------------- */
  VIEWS.home = {
    title: function () { return 'SafeGo'; },
    html: function () {
      return S.role === 'familia' ? homeFamily() : homeStudent();
    },
    bind: function (root) {
      bindHoldSos($('#sosBig', root));
      $$('[data-quick]', root).forEach(function (b) {
        b.onclick = function () { quickAction(b.getAttribute('data-quick')); };
      });
      $$('[data-goto]', root).forEach(function (b) {
        b.onclick = function () {
          var to = S.places.filter(function (p) { return p.id === b.getAttribute('data-goto'); })[0];
          if (to) startPlanTo(to);
        };
      });
      $$('[data-nav]', root).forEach(function (b) {
        b.onclick = function () {
          var n = b.getAttribute('data-nav');
          if (VIEWS[n] && VIEWS[n].sub) { currentTab = VIEWS[n].tab || currentTab; stack = [n]; render(); } else go(n);
        };
      });
      var dismiss = $('#dismissArrival', root);
      if (dismiss) dismiss.onclick = function () { S.lastArrival = null; save(); render(); };
      var resend = $('#resendArrival', root);
      if (resend) resend.onclick = function () { sendNotice(fill(Msg.arrival(S.lastArrival.dest), { hora: hhmm(S.lastArrival.t) }), { kind: 'llegada' }); };
    }
  };
  function placeIcon(p) { return p.kind === 'casa' ? 'home' : p.kind === 'estudio' ? 'school' : 'star'; }
  function homeStudent() {
    var h = '';
    var hr = new Date().getHours();
    var greet = hr < 12 ? 'Buenos días' : hr < 19 ? 'Buenas tardes' : 'Buenas noches';
    if (S.trip && S.trip.status === 'running') {
      var t = S.trip;
      h += '<div class="card hero"><div class="sub">Viaje en curso</div><h1>' + esc(t.dest.name) + '</h1><p class="sub">Llegada estimada ' + hhmm(t.expectedAt) + ' · ' + esc(routeSummary(t.itinerary)) + '</p>' +
        '<button class="btn btn-light block" data-nav="trip" style="margin-top:8px">' + icon('nav') + 'Ver mi viaje</button></div>';
    } else {
      h += '<div class="card hero"><div class="sub">' + greet + (S.profile.name ? ', ' + esc(firstName(S.profile.name)) : '') + '</div><h1>¿A dónde vas hoy?</h1>';
      if (S.places.length) {
        h += '<div class="grid2" style="margin-top:10px">';
        S.places.slice(0, 4).forEach(function (p) {
          h += '<button class="btn btn-light" data-goto="' + p.id + '">' + icon(placeIcon(p)) + esc(p.name) + '</button>';
        });
        h += '</div>';
      } else {
        h += '<p class="sub">Guarda tu casa y tu centro de estudios para ir con un toque.</p>';
      }
      h += '<button class="btn btn-dark block" data-nav="plan" style="margin-top:10px">' + icon('search') + 'Planificar un viaje</button></div>';
    }
    if (S.lastArrival && Date.now() - S.lastArrival.t < 3 * 3600000) {
      h += '<div class="card ok"><div class="row"><div class="grow"><b>' + icon('check', 'width="18" height="18"') + ' Llegaste a ' + esc(S.lastArrival.dest) + ' a las ' + hhmm(S.lastArrival.t) + '</b>' +
        '<div class="sub small">' + (S.lastArrival.smsSent ? 'Tu familia recibió el aviso por SMS.' : '¿Ya le avisaste a tu familia?') + '</div></div>' +
        '<button class="icon-btn" id="dismissArrival" aria-label="Cerrar">' + icon('x') + '</button></div>' +
        (S.lastArrival.smsSent ? '' : '<button class="btn btn-wa block sm" id="resendArrival" style="margin-top:8px">Avisar que llegué</button>') + '</div>';
    }
    if (!(S.trip && S.trip.status === 'running')) {
      h += '<div class="card list">' + navItem('demo', 'play', 'Demostración', 'Así le llegan los avisos a tu familia: subió, transbordo y llegó') + '</div>';
    }
    if (!S.contacts.length) {
      h += '<div class="card warn"><b>Agrega a tu familia</b><p class="sub small">Sin contactos de confianza no podemos avisar cuando llegues.</p><button class="btn sm" data-nav="family">Agregar contacto</button></div>';
    }
    h += '<button class="sos-big" id="sosBig"><div class="fill"></div><span>' + icon('alert', 'width="26" height="26"') + '</span><span>Mantén presionado para SOS</span></button>';
    h += '<h2>Avisos rápidos</h2><div class="grid2">' +
      quickBtn('arrived', 'check', 'Ya llegué', 'Aviso de llegada') +
      quickBtn('delay', 'clock', 'Voy tarde', 'Avisar retraso') +
      quickBtn('ok', 'heart', 'Estoy bien', 'Con tu ubicación') +
      quickBtn('location', 'pin', 'Mi ubicación', 'Compartir ahora') + '</div>';
    h += statsCard();
    h += '<h2>Consejo de hoy</h2><div class="card flat"><p>' + esc(tipOfDay()) + '</p></div>';
    return h;
  }
  function homeFamily() {
    var st = firstName(S.profile.studentName) || 'tu hijo/a';
    var h = '<div class="card hero"><div class="sub">Hola' + (S.profile.name ? ', ' + esc(firstName(S.profile.name)) : '') + '</div><h1>Que ' + esc(st) + ' llegue bien, sin parar tu trabajo.</h1>' +
      '<p class="sub">El teléfono de ' + esc(st) + ' te avisa al salir, si se retrasa y al llegar.</p></div>';
    h += '<div class="list card">' +
      navItem('live', 'nav', 'Ver en vivo', (S.following || []).length ? 'Mira en el mapa cómo avanza ' + st + ' durante su viaje.' : 'Activa el seguimiento en tiempo real de ' + st + '.') +
      navItem('plan', 'route', 'Planifica su ruta', 'Bus, Trolebús, Ecovía y Metro con transbordos. Envíasela por WhatsApp.') +
      navItem('setup', 'key', 'Configura su teléfono', 'Crea un código con tus datos y sus lugares, sin escribir nada en su celular.') +
      navItem('family', 'users', 'Contactos que reciben avisos', S.contacts.length + (S.contacts.length === 1 ? ' contacto' : ' contactos')) +
      navItem('howto', 'bell', 'Cómo llegan los avisos', 'SMS automático o WhatsApp, tú eliges.') + '</div>';
    h += '<button class="sos-big" id="sosBig"><div class="fill"></div><span>' + icon('alert', 'width="26" height="26"') + '</span><span>Mantén presionado para SOS</span></button>';
    h += statsCard();
    h += '<h2>Consejo de hoy</h2><div class="card flat"><p>' + esc(tipOfDay()) + '</p></div>';
    return h;
  }
  function navItem(view, ic, title, sub) {
    return '<div class="item" data-nav="' + view + '" role="button"><div class="ic">' + icon(ic) + '</div><div class="grow"><b>' + esc(title) + '</b><div class="sub small">' + esc(sub) + '</div></div><div class="chev">' + icon('chev') + '</div></div>';
  }
  function quickBtn(id, ic, title, sub) {
    return '<button class="quick" data-quick="' + id + '">' + icon(ic) + '<b>' + title + '</b><span>' + sub + '</span></button>';
  }
  function statsCard() {
    var trips = S.history.filter(function (r) { return r.status === 'llegó'; });
    var onTime = trips.filter(function (r) { return r.onTime; }).length;
    var pct = trips.length ? Math.round(onTime / trips.length * 100) + '%' : '–';
    var notices = S.stats.autoNotices + S.stats.manualNotices;
    return '<h2>Tu resumen</h2><div class="card grid2" style="grid-template-columns:1fr 1fr 1fr;gap:0">' +
      '<div class="stat"><b>' + trips.length + '</b><span>viajes completos</span></div>' +
      '<div class="stat"><b>' + pct + '</b><span>a tiempo</span></div>' +
      '<div class="stat"><b>' + notices + '</b><span>avisos sin llamar</span></div></div>';
  }
  var TIPS = [
    'En hora pico sal 10 minutos antes: esperar la siguiente unidad es lo que más tiempo quita al cambiar de transporte.',
    'Activa el «modo discreto» en Ajustes: los avisos vibran y no necesitas sacar el celular en la calle.',
    'Si el bus no llega, revisa la opción «Más tranquila»: suele usar el Metro y menos caminata.',
    'Acuerda con tu familia una hora de llegada. Si te pasas, la app avisa sola con tu última ubicación.',
    'En las estaciones, espera en zonas iluminadas y cerca de otras personas o del personal.',
    'Guarda el celular antes de bajar; la app te avisa con vibración cuando te acercas a tu parada.',
    'Si algo sale mal, mantén presionado SOS: se envía tu ubicación y puedes llamar al 911.'
  ];
  function tipOfDay() { var d = new Date(); return TIPS[(d.getDate() + d.getMonth()) % TIPS.length]; }

  function withLocation(cb, opts) {
    opts = opts || {};
    if (!opts.silent) toast('Buscando tu ubicación…', 2000);
    Bridge.getLocation(function (res) {
      if (res && res.ok) { lastKnown = res.data; Map.setMe && Map.map && Map.setMe(res.data.lat, res.data.lon, res.data.acc); cb(res.data); }
      else if (lastKnown && Date.now() - lastKnown.t < 10 * 60000) cb(lastKnown);
      else {
        if (res && res.error === 'permiso') {
          Bridge.requestPermissions(['location'], function () { toast('Permiso actualizado, inténtalo de nuevo'); });
        } else toast('No pudimos obtener tu ubicación. Activa el GPS.', 3500);
        cb(null);
      }
    });
  }
  function quickAction(id) {
    if (id === 'arrived') {
      if (S.trip && S.trip.status === 'running') { Trip.arriveManual(); return; }
      openSheet(pickPlaceSheet('¿A dónde llegaste?', function (p) {
        S.lastArrival = { t: Date.now(), dest: p.name, smsSent: 0, manual: true };
        save();
        sendNotice(fill(Msg.arrival(p.name), { hora: hhmm(Date.now()) }), { kind: 'llegada' });
        render();
      }));
    } else if (id === 'delay') {
      openSheet(delaySheet());
    } else if (id === 'ok') {
      withLocation(function (loc) {
        var leg = S.trip ? S.trip.itinerary.legs[S.trip.currentLeg || 0] : null;
        var legName = leg ? (leg.kind === 'ride' ? (leg.fullShort || leg.short) : leg.kind === 'bus' ? 'bus' : null) : null;
        sendNotice(Msg.ok(loc ? osmLink(loc.lat, loc.lon) : '', legName), { kind: 'estoy-bien' });
      });
    } else if (id === 'location') {
      withLocation(function (loc) {
        if (!loc) return;
        sendNotice(Msg.location(osmLink(loc.lat, loc.lon)), { kind: 'ubicacion' });
      });
    }
  }
  function delaySheet() {
    var html = '<h3>¿Cuánto te vas a retrasar?</h3><p class="sub">Avisaremos a tu familia la nueva hora estimada.</p><div class="grid2">' +
      [5, 10, 15, 20, 30, 45].map(function (m) { return '<button class="btn btn-light" data-min="' + m + '">+' + m + ' min</button>'; }).join('') +
      '</div><button class="btn btn-ghost block" data-close style="margin-top:12px">Cancelar</button>';
    return {
      html: html, bind: function (root) {
        $$('[data-min]', root).forEach(function (b) {
          b.onclick = function () {
            var m = +b.getAttribute('data-min');
            closeSheet();
            if (S.trip && S.trip.status === 'running') {
              S.trip.expectedAt += m * 60000;
              var lateAt = S.trip.expectedAt + S.trip.toleranceMin * 60000;
              if (S.trip.payload) S.trip.payload.lateAt = lateAt;
              call('tripAction', 'delay:' + S.trip.expectedAt + ':' + lateAt);
              if (S.trip.payload) S.trip.payload.expectedAt = S.trip.expectedAt;
              save();
            }
            sendNotice(Msg.delay(S.trip, m), { kind: 'retraso' });
          };
        });
      }
    };
  }
  function pickPlaceSheet(title, onPick) {
    var html = '<h3>' + esc(title) + '</h3><div class="list">';
    S.places.forEach(function (p, i) {
      html += '<div class="item" data-pi="' + i + '" role="button"><div class="ic">' + icon(placeIcon(p)) + '</div><div class="grow"><b>' + esc(p.name) + '</b></div></div>';
    });
    html += '<div class="item" data-pi="other" role="button"><div class="ic">' + icon('pin') + '</div><div class="grow"><b>Otro lugar</b><div class="sub small">Escribe el nombre</div></div></div></div>' +
      '<div id="otherBox" class="hidden"><input class="input" id="otherName" maxlength="60" placeholder="Ej.: casa de mi abuela"><button class="btn block" id="otherOk" style="margin-top:8px">Avisar</button></div>' +
      '<button class="btn btn-ghost block" data-close style="margin-top:10px">Cancelar</button>';
    return {
      html: html, bind: function (root) {
        $$('[data-pi]', root).forEach(function (el) {
          el.onclick = function () {
            var v = el.getAttribute('data-pi');
            if (v === 'other') { $('#otherBox', root).classList.remove('hidden'); $('#otherName', root).focus(); return; }
            closeSheet(); onPick(S.places[+v]);
          };
        });
        $('#otherOk', root).onclick = function () {
          var n = $('#otherName', root).value.trim();
          if (!n) return;
          closeSheet(); onPick({ name: n });
        };
      }
    };
  }

  /* ---------------- Planificador ---------------- */
  var planState = { origin: null, dest: null, results: [], selected: null, picking: null, query: '', field: null };
  function startPlanTo(place) {
    planState.dest = { name: place.name, lat: place.lat, lon: place.lon };
    planState.results = []; planState.selected = null;
    go('plan');
    withLocation(function (loc) {
      if (loc) {
        var near = S.places.filter(function (p) { return P.distKm(loc, p) < 0.25; })[0];
        planState.origin = { name: near ? near.name : 'Mi ubicación', lat: loc.lat, lon: loc.lon };
        runPlan();
      } else {
        // Sin GPS: si va a la casa, sale del centro de estudios y viceversa
        var other = S.places.filter(function (p) { return p.id !== place.id; })[0];
        if (other) { planState.origin = { name: other.name, lat: other.lat, lon: other.lon }; runPlan(); }
        else render();
      }
    }, { silent: false });
  }
  function runPlan() {
    if (!planState.origin || !planState.dest) { render(); return; }
    if (P.distKm(planState.origin, planState.dest) < 0.08) { toast('El origen y el destino están en el mismo lugar'); planState.results = []; render(); return; }
    planState.results = P.plan(planState.origin, planState.dest, { avoid: S.settings.avoid });
    planState.selected = null;
    if (!planState.results.length) toast('No encontramos una ruta. Prueba con otro punto.');
    if (currentTab !== 'plan') go('plan'); else render();
  }
  function recommendedIndex(results) {
    if (!results.length) return -1;
    var fastest = Math.min.apply(null, results.map(function (r) { return r.totalMin; }));
    var best = 0, bs = -1;
    var named = results.some(function (r) { return r.profile !== 'bus'; });
    results.forEach(function (r, i) {
      // «Solo bus urbano» no dice qué línea tomar: solo se recomienda si no hay otra opción
      if (named && r.profile === 'bus') return;
      if (r.totalMin <= fastest * 1.25 + 3 && r.ease > bs) { bs = r.ease; best = i; }
    });
    return best;
  }
  function legPills(it) {
    var parts = it.legs.map(function (l) {
      var label = l.kind === 'walk' ? Math.max(1, l.min) + "'" : (l.kind === 'ride' ? (l.badge || l.short) : 'Bus');
      return '<span class="pill mode ' + l.mode + '">' + icon(MODE_ICON[l.mode], 'width="13" height="13"') + esc(label) + '</span>';
    });
    return '<div class="legs">' + parts.join('<span class="arrow">›</span>') + '</div>';
  }
  function stepsHtml(it, current) {
    var h = '<div class="steps">';
    var tAcc = 0;
    var base = S.trip && S.trip.itinerary === it ? S.trip.startedAt : Date.now();
    h += stepRow('#2E7D5B', 'pin', '<b>Sales de ' + esc(it.origin.name) + '</b><div class="sub small">' + hhmm(base) + '</div>', '', false);
    it.legs.forEach(function (l, i) {
      var cls = current === undefined ? '' : (i < current ? 'done' : i === current ? 'current' : '');
      var body = '';
      if (l.kind === 'walk') {
        body = '<b>Camina ' + fmtKm(l.km) + ' (' + l.min + ' min)</b><div class="sub small">hasta ' + esc(l.to.name) + '</div>';
        if (l.waitMin) body += '<div class="sub small">Espera estimada: ' + l.waitMin + ' min</div>';
      } else if (l.kind === 'bus') {
        body = '<b>Bus urbano o alimentador hacia ' + esc(l.to.name) + '</b><div class="sub small">' + fmtKm(l.km) + ' · ~' + l.min + ' min' + (l.waitMin ? ' + ' + l.waitMin + ' min de espera' : '') + '</div>' +
          '<div class="sub small">' + esc(l.note || 'Confirma la línea en la parada o pregunta al controlador.') + '</div>';
      } else {
        body = rideBody(l);
      }
      tAcc += l.min + l.waitMin;
      h += stepRow(MODE_COLOR[l.mode], MODE_ICON[l.mode], body, cls, true);
    });
    h += stepRow('#B3303F', 'school', '<b>Llegas a ' + esc(it.dest.name) + '</b><div class="sub small">aprox. ' + hhmm(base + it.totalMin * 60000) + '</div>', '', false, true);
    return h + '</div>';
  }
  /* Detalle de un tramo en transporte: qué línea, qué dirección, dónde subir y dónde bajar. */
  function rideBody(l) {
    var cn = P.cleanName;
    var mid = l.stops.filter(function (s, k) { return k > 0 && k < l.stops.length - 1 && !/^Parada entre /.test(s); }).length;
    var approx = l.mode === 'bus' || l.mode === 'inter' || l.mode === 'alim' || l.mode === 'cso';
    var h = '<b>' + esc(l.title || l.short) + '</b>';
    h += '<div><span class="headsign">Dirección ' + esc(l.headsign || cn(l.to.name)) + '</span></div>';
    if (l.headsignAll && l.headsignAll.length > 1) h += '<div class="sub small">Sirve cualquiera: ' + esc(l.headsignAll.join(' · ')) + '</div>';
    h += '<div class="leg-detail">' +
      '<div class="row-i"><span class="k">' + (l.sameStation ? 'Cambia' : 'Sube') + '</span><span>' + esc(cn(l.from.name)) + (l.sameStation ? ' (misma estación, no pagas otra vez)' : '') + '</span></div>' +
      '<div class="row-i"><span class="k">Baja</span><span><b>' + esc(cn(l.to.name)) + '</b></span></div>' +
      '<div class="sub small">' + (mid > 0 ? mid + (mid === 1 ? ' parada' : ' paradas') + ' en medio · ' : '') + (approx ? 'aprox. ' : '') + l.min + ' min' + (l.waitMin ? ' + ' + l.waitMin + ' de espera' : '') + '</div>';
    if (l.via) h += '<div class="sub small">Por ' + esc(l.via) + '</div>';
    if (l.codes) h += '<div class="sub small">' + esc(l.codes) + '</div>';
    if (l.lineNote) h += '<div class="sub small">' + esc(l.lineNote) + '</div>';
    if (approx) h += '<div class="sub small">Confirma el letrero del bus o pregunta al controlador.</div>';
    return h + '</div>';
  }
  function stepRow(color, ic, body, cls, bar, last) {
    return '<div class="step ' + (cls || '') + '">' + (last ? '' : '<div class="bar" style="background:' + color + '33"></div>') +
      '<div class="ic" style="background:' + color + '">' + icon(ic) + '</div><div>' + body + '</div></div>';
  }

  VIEWS.plan = {
    full: true,
    title: function () { return S.role === 'familia' ? 'Ruta del estudiante' : 'Planificar viaje'; },
    html: function () {
      var ps = planState;
      var h = '<div class="map-slot">' +
        '<button class="map-fab" id="fabLocate" style="top:12px" aria-label="Mi ubicación">' + icon('locate') + '</button>' +
        '<button class="map-fab" id="fabLayers" style="top:66px" aria-label="Red de transporte">' + icon('layers') + '</button></div>';
      h += '<div class="panel" id="planPanel">';
      if (ps.picking) {
        h += '<div class="card ok flat" style="margin:0"><b>Toca el mapa</b> para elegir el ' + (ps.picking === 'origin' ? 'origen' : 'destino') + '.<button class="btn btn-ghost sm block" id="cancelPick" style="margin-top:8px">Cancelar</button></div></div>';
        return h;
      }
      if (ps.selected !== null && ps.results[ps.selected]) {
        var it = ps.results[ps.selected];
        h += '<div class="row between"><div><div class="big" style="font-size:24px;font-weight:800">≈ ' + fmtMin(it.totalMin) + '</div><div class="sub small">' +
          it.transfers + (it.transfers === 1 ? ' transbordo' : ' transbordos') + ' · ' + fmtKm(it.walkKm) + ' a pie · tiempos estimados</div></div>' +
          '<button class="btn btn-ghost sm" id="backOpts">Opciones</button></div>';
        h += legPills(it);
        h += '<div style="margin-top:12px">' + stepsHtml(it) + '</div>';
        if (S.role === 'familia') {
          h += '<button class="btn btn-wa block" id="shareRoute">' + icon('msg') + 'Enviar ruta por WhatsApp</button>';
        } else {
          h += '<button class="btn block" id="startTrip">' + icon('play') + 'Iniciar viaje y avisar</button>' +
            '<button class="btn btn-ghost block" id="shareRoute" style="margin-top:8px">' + icon('share') + 'Compartir ruta</button>';
        }
        h += '<button class="btn btn-ghost block" id="favRoute" style="margin-top:8px">' + icon('star') + 'Guardar destino</button>';
        h += '<p class="sub small" style="margin-top:10px">Tiempos estimados con datos aproximados de la red. No es información oficial ni en tiempo real.</p>';
        return h + '</div>';
      }
      h += '<div class="od">' +
        '<div class="dotA"></div><input class="input" id="inOrigin" placeholder="¿Desde dónde sales?" value="' + esc(ps.origin ? ps.origin.name : '') + '" autocomplete="off">' +
        '<button class="icon-btn" id="pickOrigin" aria-label="Elegir en el mapa">' + icon('pin') + '</button>' +
        '<div class="dotB"></div><input class="input" id="inDest" placeholder="¿A dónde vas?" value="' + esc(ps.dest ? ps.dest.name : '') + '" autocomplete="off">' +
        '<button class="icon-btn" id="pickDest" aria-label="Elegir en el mapa">' + icon('pin') + '</button></div>' +
        '<div class="row wrap" style="margin-top:8px">' +
        '<button class="btn btn-light sm" id="useMe">' + icon('locate') + 'Mi ubicación</button>' +
        '<button class="btn btn-light sm" id="swap">' + icon('swap') + 'Invertir</button>' +
        '<button class="btn btn-light sm" id="avoidBtn">' + icon('gear') + 'Preferencias</button></div>' +
        '<div id="suggest"></div>';
      if (!ps.results.length) {
        if (S.places.length) {
          h += '<h3 style="margin-top:14px">Tus lugares</h3><div class="row wrap">';
          S.places.forEach(function (p) { h += '<button class="btn btn-ghost sm" data-place="' + p.id + '">' + icon(placeIcon(p)) + esc(p.name) + '</button>'; });
          h += '</div>';
        }
        h += '<p class="sub small" style="margin-top:12px">Escribe un lugar, elige uno de tus lugares o toca ' + icon('pin', 'width="14" height="14"') + ' para marcarlo en el mapa.</p>';
      } else {
        var rec = recommendedIndex(ps.results);
        h += '<p class="sub small" style="margin:12px 0 0">' + icon('info', 'width="14" height="14"') + ' Tiempos estimados con datos aproximados de la red, no son horarios oficiales.</p>';
        ps.results.forEach(function (it, i) {
          h += '<div class="opt" data-opt="' + i + '" role="button"><div class="row between"><div><span class="big">≈ ' + fmtMin(it.totalMin) + '</span>' +
            ' <span class="sub small">llegas aprox. ' + hhmm(Date.now() + it.totalMin * 60000) + '</span></div>' +
            (i === rec ? '<span class="pill ok">Recomendada</span>' : '<span class="pill">' + esc(it.profileLabel) + '</span>') + '</div>' +
            (i === rec ? '<div class="sub small" style="margin-top:4px">Pocos transbordos y poca caminata para su tiempo.</div>' : '') +
            legPills(it) +
            '<div class="sub small" style="margin-top:6px">' + it.transfers + (it.transfers === 1 ? ' transbordo' : ' transbordos') + ' · ' + fmtKm(it.walkKm) + ' a pie</div></div>';
        });
      }
      return h + '</div>';
    },
    bind: function (root) {
      var ps = planState;
      $('#fabLocate', root).onclick = function () {
        withLocation(function (loc) { if (loc && Map.map) Map.map.setView([loc.lat, loc.lon], 16); });
      };
      $('#fabLayers', root).onclick = function () { Map.toggleNetwork(); toast(Map.showNetwork ? 'Mostrando Metro, Trolebús, Ecovía y paradas de bus (acerca el mapa)' : 'Red oculta'); };
      if (ps.picking) {
        $('#cancelPick', root).onclick = function () { ps.picking = null; render(); };
        return;
      }
      if (ps.selected !== null && ps.results[ps.selected]) {
        var it = ps.results[ps.selected];
        $('#backOpts', root).onclick = function () { ps.selected = null; render(); };
        var st = $('#startTrip', root);
        if (st) st.onclick = function () { confirmStart(it); };
        $('#shareRoute', root).onclick = function () {
          var text = 'Ruta de ' + it.origin.name + ' a ' + it.dest.name + ' (' + fmtMin(it.totalMin) + '):\n' + it.legs.map(function (l, i) {
            if (l.kind === 'walk') return (i + 1) + '. Camina ' + fmtKm(l.km) + ' hasta ' + l.to.name;
            if (l.kind === 'bus') return (i + 1) + '. Bus hacia ' + l.to.name;
            return (i + 1) + '. ' + (l.instruction || l.short) + '. Sube en ' + P.cleanName(l.from.name) + ', baja en ' + P.cleanName(l.to.name);
          }).join('\n') + '\nDestino: ' + osmLink(it.dest.lat, it.dest.lon) + '\n(SafeGo)';
          if (S.role === 'familia' && S.contacts.length === 0) Bridge.whatsapp('', text);
          else Bridge.share(text);
        };
        $('#favRoute', root).onclick = function () { openSheet(placeSheet({ name: it.dest.name, lat: it.dest.lat, lon: it.dest.lon })); };
        return;
      }
      var inO = $('#inOrigin', root), inD = $('#inDest', root);
      var search = debounce(function (field, q) { showSuggestions(field, q); }, 450);
      inO.oninput = function () { search('origin', inO.value); };
      inD.oninput = function () { search('dest', inD.value); };
      inO.onfocus = function () { if (inO.value === 'Mi ubicación') inO.select(); };
      $('#pickOrigin', root).onclick = function () { ps.picking = 'origin'; render(); };
      $('#pickDest', root).onclick = function () { ps.picking = 'dest'; render(); };
      $('#useMe', root).onclick = function () {
        withLocation(function (loc) {
          if (!loc) return;
          ps.origin = { name: 'Mi ubicación', lat: loc.lat, lon: loc.lon };
          if (ps.dest) runPlan(); else render();
        });
      };
      $('#swap', root).onclick = function () { var o = ps.origin; ps.origin = ps.dest; ps.dest = o; if (ps.origin && ps.dest) runPlan(); else render(); };
      $('#avoidBtn', root).onclick = function () { openSheet(avoidSheet()); };
      $$('[data-place]', root).forEach(function (b) {
        b.onclick = function () {
          var p = S.places.filter(function (x) { return x.id === b.getAttribute('data-place'); })[0];
          if (!p) return;
          if (!ps.dest) ps.dest = { name: p.name, lat: p.lat, lon: p.lon };
          else ps.origin = { name: p.name, lat: p.lat, lon: p.lon };
          if (ps.origin && ps.dest) runPlan(); else render();
        };
      });
      $$('[data-opt]', root).forEach(function (el) {
        el.onclick = function () {
          ps.selected = +el.getAttribute('data-opt');
          render();
          var it = ps.results[ps.selected];
          enrichWalkGeometry(it, function () { if (planState.selected !== null && planState.results[planState.selected] === it && currentTab === 'plan' && Map.map) Map.drawItinerary(it); });
        };
      });
    },
    onMap: function () {
      var ps = planState;
      Map.clear('route'); Map.clear('pins');
      if (Map.showNetwork) Map.toggleNetwork(true);
      if (ps.selected !== null && ps.results[ps.selected]) {
        Map.drawItinerary(ps.results[ps.selected]);
      } else {
        var g = Map.group('pins');
        var pts = [];
        if (ps.origin) { L.marker([ps.origin.lat, ps.origin.lon], { icon: Map.pin('a') }).addTo(g); pts.push([ps.origin.lat, ps.origin.lon]); }
        if (ps.dest) { L.marker([ps.dest.lat, ps.dest.lon], { icon: Map.pin('b') }).addTo(g); pts.push([ps.dest.lat, ps.dest.lon]); }
        if (ps.results.length) {
          var it = ps.results[recommendedIndex(ps.results)];
          Map.drawItinerary(it, 'route');
        } else if (pts.length === 2) Map.map.fitBounds(pts, { padding: [50, 50] });
        else if (pts.length === 1) Map.map.setView(pts[0], 15);
      }
      if (lastKnown) Map.setMe(lastKnown.lat, lastKnown.lon, lastKnown.acc);
      Map.onClick = function (ll) {
        if (!ps.picking) return;
        var field = ps.picking;
        ps.picking = null;
        var pt = { name: 'Punto en el mapa', lat: ll.lat, lon: ll.lng };
        ps[field] = pt;
        if (ps.origin && ps.dest) runPlan(); else render();
        reverseName(ll.lat, ll.lng, function (name) {
          if (ps[field] === pt) { pt.name = name; if (currentTab === 'plan') { if (ps.results.length) { ps.results.forEach(function (r) { if (field === 'origin') r.origin.name = name; else r.dest.name = name; }); } render(); } }
        });
      };
    }
  };
  function showSuggestions(field, q) {
    var box = $('#suggest');
    if (!box) return;
    if (!q || q.trim().length < 2) { box.innerHTML = ''; return; }
    var local = localSearch(q);
    var paint = function (remote) {
      var all = local.concat(remote || []);
      if (!all.length) { box.innerHTML = '<div class="suggest"><div class="item sub small" style="padding:12px">Sin resultados. Prueba tocando el mapa.</div></div>'; return; }
      box.innerHTML = '<div class="suggest">' + all.map(function (r, i) {
        return '<div class="item" data-sg="' + i + '" role="button"><div class="ic">' + icon(r.kind === 'estación' ? 'train' : r.kind === 'guardado' ? 'star' : r.kind === 'estudio' ? 'school' : 'pin') + '</div>' +
          '<div class="grow"><b>' + esc(r.name) + '</b><div class="sub small">' + esc(r.detail || r.kind) + '</div></div></div>';
      }).join('') + '</div>';
      $$('[data-sg]', box).forEach(function (el) {
        el.onclick = function () {
          var r = all[+el.getAttribute('data-sg')];
          planState[field] = { name: r.name, lat: r.lat, lon: r.lon };
          if (planState.origin && planState.dest) runPlan(); else render();
        };
      });
    };
    paint([]);
    remoteSearch(q, function (remote) { if ($('#suggest') === box) paint(remote); });
  }
  function avoidSheet() {
    var a = S.settings.avoid || {};
    var html = '<h3>Preferencias de ruta</h3><p class="sub">Desactiva los sistemas que no quieres usar.</p><div class="list">' +
      MODE_ORDER.map(function (m) {
        var n = D.LINES.filter(function (l) { return l.mode === m; }).length;
        if (!n) return '';
        return '<div class="item"><span class="pill mode ' + m + '">' + icon(MODE_ICON[m], 'width="13" height="13"') + '</span><div class="grow">' + esc(MODE_NAME[m]) +
          '<div class="sub small">' + n + (n === 1 ? ' línea' : ' líneas') + '</div></div>' +
          '<label class="switch"><input type="checkbox" data-mode="' + m + '" ' + (a[m] ? '' : 'checked') + '><span></span></label></div>';
      }).join('') + '</div><button class="btn block" id="avOk" style="margin-top:10px">Aplicar</button>';
    return {
      html: html, bind: function (root) {
        $('#avOk', root).onclick = function () {
          var av = {};
          $$('[data-mode]', root).forEach(function (c) { if (!c.checked) av[c.getAttribute('data-mode')] = true; });
          S.settings.avoid = av; save(); closeSheet();
          if (planState.origin && planState.dest) runPlan(); else render();
        };
      }
    };
  }
  function confirmStart(it) {
    var s = S.settings;
    var shareOk = consentOk();
    var smsAuto = shareOk && IS_NATIVE && Bridge.permissions().sms && s.channel !== 'whatsapp' && s.autoSmsArrival;
    var html = '<h3>Iniciar viaje a ' + esc(it.dest.name) + '</h3>' +
      '<p class="sub">Llegada estimada <b>' + hhmm(Date.now() + it.totalMin * 60000) + '</b>. Si pasan ' + s.toleranceMin + ' min más, ' + (s.smsOnLate && smsAuto ? 'avisaremos a tu familia con tu ubicación.' : 'te preguntaremos si estás bien.') + '</p>' +
      (shareOk ? '' : '<div class="card warn flat"><b>Avisos automáticos apagados</b><p class="sub small">No aceptaste compartir avisos con tu familia. La app te guía igual y tú decides cuándo enviar cada mensaje.</p><button class="btn sm" id="consentOn">Revisar</button></div>') +
      '<div class="list">' +
      '<div class="item"><div class="ic">' + icon('bell') + '</div><div class="grow"><b>Avisos de transbordo</b><div class="sub small">Vibra antes de bajar</div></div><label class="switch"><input type="checkbox" id="cTransfer" ' + (s.transferAlerts ? 'checked' : '') + '><span></span></label></div>' +
      (shareOk ? '<div class="item"><div class="ic">' + icon('users') + '</div><div class="grow"><b>Avisar a mi familia al subir</b><div class="sub small">' + (smsAuto ? 'SMS automático en cada estación donde subes o cambias' : 'Mensaje de WhatsApp listo en cada transbordo') + '</div></div><label class="switch"><input type="checkbox" id="cFamily" ' + (s.familyNotices !== false ? 'checked' : '') + '><span></span></label></div>' +
      (shareOk && Live.sharing() ? '<div class="item"><div class="ic">' + icon('pin') + '</div><div class="grow"><b>Seguimiento en vivo</b><div class="sub small">Tu familia recibe el enlace para verte en el mapa al iniciar' + (smsAuto ? ' (SMS automático)' : '') + '</div></div></div>' : '') +
      '<div class="item"><div class="ic">' + icon('msg') + '</div><div class="grow"><b>Avisar que salí</b><div class="sub small">Mensaje al iniciar</div></div><label class="switch"><input type="checkbox" id="cStart" ' + (s.smsOnStart ? 'checked' : '') + '><span></span></label></div>' : '') +
      '<div class="item"><div class="ic">' + icon('check') + '</div><div class="grow"><b>Aviso de llegada</b><div class="sub small">' + (smsAuto ? 'Automático por SMS a ' + S.contacts.length + ' contacto(s)' : 'Te pediremos enviarlo por WhatsApp') + '</div></div></div>' +
      '</div>' +
      (S.contacts.length ? '' : '<div class="card warn flat">No tienes contactos. Agrega uno en Familia.</div>') +
      (IS_NATIVE && Bridge.permissions().location && Bridge.permissions().preciseLocation === false ? '<div class="card warn flat">Tienes la ubicación «aproximada». Para detectar bien tu llegada, activa la ubicación precisa en los permisos de la app.</div>' : '') +
      (IS_NATIVE && call('batteryOptimized') ? '<p class="sub small">Consejo: en Más › Ajustes quita la app del ahorro de batería para que el seguimiento no se detenga.</p>' : '') +
      '<button class="btn block" id="go" style="margin-top:10px">' + icon('play') + 'Iniciar</button><button class="btn btn-ghost block" data-close style="margin-top:8px">Cancelar</button>';
    openSheet({
      html: html, bind: function (root) {
        var co = $('#consentOn', root);
        if (co) co.onclick = function () { closeSheet(); openSheet(consentSheet(function () { confirmStart(it); })); };
        $('#go', root).onclick = function () {
          S.settings.transferAlerts = $('#cTransfer', root).checked;
          if ($('#cFamily', root)) S.settings.familyNotices = $('#cFamily', root).checked;
          if ($('#cStart', root)) S.settings.smsOnStart = $('#cStart', root).checked;
          save();
          closeSheet();
          var go2 = function () { Trip.start(it); };
          if (IS_NATIVE) {
            var p = Bridge.permissions();
            if (!p.location || !p.notifications) {
              Bridge.requestPermissions(['location', 'notifications'], function () {
                var p2 = Bridge.permissions();
                if (p2.location) go2(); else toast('Sin permiso de ubicación no podemos detectar tu llegada.', 4000);
              });
              return;
            }
          }
          go2();
        };
      }
    });
  }

  /* ---------------- Viaje ---------------- */
  VIEWS.trip = {
    full: true,
    title: function () { return 'Mi viaje'; },
    html: function () {
      var t = S.trip;
      if (!t || t.status !== 'running') {
        var h = '<div style="padding:16px;overflow-y:auto">';
        if (S.lastArrival && Date.now() - S.lastArrival.t < 6 * 3600000) {
          h += '<div class="card ok"><h3>' + icon('check', 'width="18" height="18"') + ' Llegaste a ' + esc(S.lastArrival.dest) + '</h3><p class="sub">' + hhmm(S.lastArrival.t) +
            (S.lastArrival.smsSent ? ' · aviso enviado por SMS' : '') + '</p><button class="btn btn-wa sm" id="resendArrival">Avisar por WhatsApp</button></div>';
        }
        h += '<div class="empty">' + icon('nav') + '<h3>No tienes un viaje activo</h3><p>Planifica tu ruta y toca «Iniciar viaje». Te avisaremos antes de bajar y tu familia sabrá cuando llegues.</p>' +
          '<button class="btn" id="goPlan">' + icon('route') + 'Planificar viaje</button></div>';
        if (S.role === 'familia') h += '<div class="card flat"><p class="sub">En modo familia, el seguimiento se hace desde el teléfono del estudiante. Configúralo desde Inicio › «Configura su teléfono».</p></div>';
        return h + '</div>';
      }
      return '<div class="map-slot" style="min-height:200px">' +
        '<button class="map-fab" id="fabCenter" style="top:12px" aria-label="Centrar">' + icon('locate') + '</button></div>' +
        '<div class="panel" id="tripPanel">' + tripPanelHtml() + '</div>';
    },
    bind: function (root) {
      var gp = $('#goPlan', root);
      if (gp) gp.onclick = function () { go('plan'); };
      var rs = $('#resendArrival', root);
      if (rs) rs.onclick = function () { sendNotice(fill(Msg.arrival(S.lastArrival.dest), { hora: hhmm(S.lastArrival.t) }), { kind: 'llegada' }); };
      var fc = $('#fabCenter', root);
      if (fc) fc.onclick = function () {
        if (lastKnown && Map.map) Map.map.setView([lastKnown.lat, lastKnown.lon], 16);
        else withLocation(function (loc) { if (loc && Map.map) Map.map.setView([loc.lat, loc.lon], 16); });
      };
      bindTripPanel(root);
    },
    onMap: function () {
      var t = S.trip;
      Map.clear('pins');
      if (!t) return;
      Map.drawItinerary(t.itinerary, 'route');
      var pts = Map.group('pins');
      (t.payload && t.payload.alerts || []).forEach(function (a) {
        if (a.kind === 'bajar') L.circle([a.lat, a.lon], { radius: a.radius, color: '#B3303F', weight: 1, dashArray: '4 4', fillOpacity: 0.04 }).addTo(pts);
      });
      L.circle([t.dest.lat, t.dest.lon], { radius: +S.settings.arrivalRadius || 150, color: '#2E7D5B', weight: 2, fillOpacity: 0.1 }).addTo(pts);
      var loc = t.lastLoc || lastKnown;
      if (loc) Map.setMe(loc.lat, loc.lon, loc.acc);
    }
  };
  function tripPanelHtml() {
    var t = S.trip;
    var it = t.itinerary;
    var now = Date.now();
    var remainingKm = null, pct = 0;
    if (t.lastLoc) {
      remainingKm = P.distKm(t.lastLoc, t.dest);
      var total = Math.max(0.1, P.distKm(t.origin, t.dest));
      pct = Math.max(0, Math.min(100, Math.round((1 - remainingKm / total) * 100)));
    }
    var late = now > t.expectedAt + t.toleranceMin * 60000;
    var leg = it.legs[t.currentLeg || 0];
    var nextTxt = '';
    if (leg) {
      if (leg.kind === 'ride') nextTxt = 'Vas en ' + esc(leg.fullShort || leg.short) + ' (dirección ' + esc(leg.headsign || '') + '). Baja en <b>' + esc(P.cleanName(leg.to.name)) + '</b>';
      else if (leg.kind === 'bus') nextTxt = 'Vas en bus hacia <b>' + esc(leg.to.name) + '</b>';
      else nextTxt = 'Camina hacia <b>' + esc(leg.to.name) + '</b>';
    }
    var h = '<div class="row between"><div><div class="sub small">Llegada estimada</div><div style="font-size:26px;font-weight:800">' + hhmm(t.expectedAt) + '</div></div>' +
      (late ? '<span class="pill warn">Con retraso</span>' : '<span class="pill ok">En camino</span>') + '</div>' +
      '<div class="progress" style="margin:10px 0"><div style="width:' + pct + '%"></div></div>' +
      '<div class="sub small">' + (remainingKm !== null ? 'Faltan ' + fmtKm(remainingKm) + ' en línea recta' : 'Esperando señal GPS…') +
      (t.lastLoc ? ' · GPS ±' + Math.round(t.lastLoc.acc || 0) + ' m' : '') + '</div>' +
      (nextTxt ? '<div class="card flat" style="margin:10px 0">' + nextTxt + '</div>' : '') +
      (t.underground ? '<div class="card warn" style="margin:10px 0"><b>En el Metro, sin señal GPS</b><div class="sub small">Es normal bajo tierra. Mantenemos tu hora estimada y retomamos el seguimiento al salir de la estación.</div></div>' : '') +
      '<div class="grid2" style="margin:10px 0">' +
      '<button class="btn btn-ok" id="tArrived">' + icon('check') + 'Llegué</button>' +
      '<button class="btn btn-light" id="tOk">' + icon('heart') + 'Estoy bien</button>' +
      '<button class="btn btn-light" id="tDelay">' + icon('clock') + 'Voy tarde</button>' +
      '<button class="btn" id="tSos">' + icon('alert') + 'SOS</button></div>' +
      '<h3 style="margin-top:14px">Tu recorrido</h3>' + stepsHtml(it, t.currentLeg || 0) +
      '<button class="btn btn-ghost block" id="tCancel">' + icon('stop') + 'Terminar sin llegar</button>' +
      '<p class="sub small" style="margin-top:8px">El seguimiento sigue aunque cierres la app o bloquees el teléfono.</p>';
    return h;
  }
  function bindTripPanel(root) {
    var b = $('#tArrived', root);
    if (!b) return;
    b.onclick = function () { Trip.arriveManual(); };
    $('#tOk', root).onclick = function () { quickAction('ok'); };
    $('#tDelay', root).onclick = function () { quickAction('delay'); };
    $('#tSos', root).onclick = function () { startSos(); };
    $('#tCancel', root).onclick = function () {
      openSheet({
        html: '<h3>¿Terminar el viaje?</h3><p class="sub">Dejaremos de seguir tu ubicación y no se enviará el aviso de llegada.</p>' +
          '<button class="btn block" id="yes">Sí, terminar</button><button class="btn btn-ghost block" data-close style="margin-top:8px">Seguir el viaje</button>',
        bind: function (r) { $('#yes', r).onclick = function () { closeSheet(); Trip.cancel(); }; }
      });
    };
  }
  function updateTripPanel() {
    var panel = $('#tripPanel');
    if (!panel || !S.trip) return;
    var st = panel.scrollTop;
    panel.innerHTML = tripPanelHtml();
    panel.scrollTop = st;
    bindTripPanel(panel);
  }

  /* ---------------- Familia / contactos ---------------- */
  VIEWS.family = {
    title: function () { return 'Familia y avisos'; },
    html: function () {
      var h = '<h1>Contactos de confianza</h1><p class="sub">Reciben los avisos de salida, retraso, llegada y SOS.</p><div class="card list">';
      if (!S.contacts.length) h += '<div class="empty">' + icon('users') + '<p>Aún no tienes contactos.</p></div>';
      S.contacts.forEach(function (c, i) {
        h += '<div class="item"><div class="ic">' + icon('users') + '</div><div class="grow"><b>' + esc(c.name) + '</b><div class="sub small">' + esc(c.relation || 'Contacto') + ' · ' + esc(c.phone) + '</div></div>' +
          '<button class="icon-btn" data-edit="' + i + '" aria-label="Editar">' + icon('edit') + '</button></div>';
      });
      h += '</div><button class="btn block" id="addC">' + icon('plus') + 'Agregar contacto</button>';
      var ch = S.settings.channel;
      var perms = Bridge.permissions();
      h += '<h2>¿Cómo enviamos los avisos?</h2><div class="card list">' +
        radioItem('channel', 'sms', ch === 'ambos' ? 'sms' : ch, 'SMS automático (recomendado)', 'Sale solo, sin sacar el celular. Si falla, abrimos WhatsApp. Usa tu saldo de SMS.') +
        radioItem('channel', 'whatsapp', ch, 'WhatsApp', 'Abre WhatsApp con el mensaje listo; tú tocas enviar.') + '</div>';
      if (IS_NATIVE && !perms.sms && ch !== 'whatsapp') {
        h += '<div class="card warn"><b>Falta el permiso de SMS</b><p class="sub small">Sin él, los avisos se enviarán por WhatsApp.</p><button class="btn sm" id="permSms">Dar permiso</button></div>';
      }
      h += '<button class="btn btn-light block" id="testMsg">' + icon('msg') + 'Enviar mensaje de prueba</button>';
      h += liveCardHtml();
      if (S.role === 'familia') h += '<h2>En vivo</h2><div class="card list">' + navItem('live', 'nav', 'Ver en vivo', 'Sigue su viaje en el mapa en tiempo real.') + '</div>';
      h += '<h2>Sincronizar con la familia</h2><div class="card list">' +
        navItem('setup', 'key', S.role === 'familia' ? 'Crear código para el estudiante' : 'Compartir mi configuración', 'Contactos y lugares en un código para pegar en otro teléfono.') +
        '<div class="item" id="importBtn" role="button"><div class="ic">' + icon('key') + '</div><div class="grow"><b>Importar un código</b><div class="sub small">Pega el código que te enviaron.</div></div><div class="chev">' + icon('chev') + '</div></div></div>';
      return h;
    },
    bind: function (root) {
      $('#addC', root).onclick = function () { openSheet(contactSheet(null)); };
      $$('[data-edit]', root).forEach(function (b) { b.onclick = function () { openSheet(contactSheet(+b.getAttribute('data-edit'))); }; });
      $$('[data-radio="channel"]', root).forEach(function (el) {
        el.onclick = function () {
          S.settings.channel = el.getAttribute('data-value'); save();
          if (S.settings.channel !== 'whatsapp' && IS_NATIVE && !Bridge.permissions().sms) Bridge.requestPermissions(['sms'], function () { render(); });
          render();
        };
      });
      var ps = $('#permSms', root);
      if (ps) ps.onclick = function () { Bridge.requestPermissions(['sms'], function () { render(); }); };
      $('#testMsg', root).onclick = function () { sendNotice('Mensaje de prueba de SafeGo: así te llegarán los avisos de ' + who() + '.', { kind: 'prueba' }); };
      $$('[data-nav]', root).forEach(function (b) { b.onclick = function () { push(b.getAttribute('data-nav')); }; });
      $('#importBtn', root).onclick = function () { openSheet(importSheet(false)); };
      bindLiveCard(root);
    }
  };
  function radioItem(group, value, current, title, sub) {
    var on = value === current;
    return '<div class="item" data-radio="' + group + '" data-value="' + value + '" role="radio" aria-checked="' + on + '"><div class="ic" style="' + (on ? 'background:var(--primary);color:#fff' : '') + '">' +
      icon(on ? 'check' : 'msg') + '</div><div class="grow"><b>' + esc(title) + '</b><div class="sub small">' + esc(sub) + '</div></div></div>';
  }
  function contactSheet(idx) {
    var c = idx === null ? { name: '', phone: '', relation: '' } : S.contacts[idx];
    var html = '<h3>' + (idx === null ? 'Nuevo contacto' : 'Editar contacto') + '</h3>' +
      '<label class="field"><span>Nombre</span><input class="input" id="ccName" maxlength="40" value="' + esc(c.name) + '" placeholder="Ej.: Mamá"></label>' +
      '<label class="field"><span>Celular</span><input class="input" id="ccPhone" type="tel" inputmode="tel" maxlength="20" value="' + esc(c.phone) + '" placeholder="09xxxxxxxx o +593…"></label>' +
      '<label class="field"><span>Relación</span><input class="input" id="ccRel" maxlength="30" value="' + esc(c.relation || '') + '" placeholder="Ej.: Madre, Padre, Tío"></label>' +
      '<button class="btn block" id="ccSave">Guardar</button>' +
      (idx !== null ? '<button class="btn btn-ghost block" id="ccDel" style="margin-top:8px;color:var(--primary)">' + icon('trash') + 'Eliminar</button>' : '') +
      '<button class="btn btn-ghost block" data-close style="margin-top:8px">Cancelar</button>';
    return {
      html: html, bind: function (root) {
        $('#ccSave', root).onclick = function () {
          var n = $('#ccName', root).value.trim(), p = $('#ccPhone', root).value.trim(), r = $('#ccRel', root).value.trim();
          if (!n) { toast('Escribe un nombre'); return; }
          if (!validPhone(p)) { toast('Revisa el número (ej.: 0991234567)'); return; }
          if (idx === null) S.contacts.push({ id: uid(), name: n, phone: p, relation: r });
          else { S.contacts[idx].name = n; S.contacts[idx].phone = p; S.contacts[idx].relation = r; }
          save(); closeSheet(); render(); toast('Contacto guardado');
        };
        var del = $('#ccDel', root);
        if (del) del.onclick = function () { S.contacts.splice(idx, 1); save(); closeSheet(); render(); toast('Contacto eliminado'); };
      }
    };
  }

  /* Código de configuración: comparte contactos y lugares sin servidor. */
  function makeCode(includeSelf) {
    var data = {
      v: 1,
      s: S.role === 'familia' ? S.profile.studentName : S.profile.name,
      c: S.contacts.map(function (c) { return [c.name, c.phone, c.relation || '']; }),
      p: S.places.map(function (p) { return [p.name, +p.lat.toFixed(5), +p.lon.toFixed(5), p.kind || 'otro']; }),
      t: S.settings.toleranceMin
    };
    if (S.role === 'familia') { var ch = Live.setupChannel(); data.l = [ch.topic, ch.key]; }
    var json = JSON.stringify(data);
    return 'TS1:' + btoa(unescape(encodeURIComponent(json)));
  }
  function readCode(code) {
    var m = String(code || '').match(/TS1:([A-Za-z0-9+/=]+)/);
    if (!m) throw new Error('Código no válido');
    var data = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
    if (!data || data.v !== 1) throw new Error('Versión de código no compatible');
    return data;
  }
  function applyCode(data) {
    var added = 0;
    (data.c || []).forEach(function (c) {
      if (!c[0] || !validPhone(c[1])) return;
      if (S.contacts.some(function (x) { return normalizePhone(x.phone) === normalizePhone(c[1]); })) return;
      S.contacts.push({ id: uid(), name: String(c[0]).slice(0, 40), phone: String(c[1]).slice(0, 20), relation: String(c[2] || '').slice(0, 30) });
      added++;
    });
    var addedP = 0;
    (data.p || []).forEach(function (p) {
      if (!p[0] || !isFinite(p[1]) || !isFinite(p[2])) return;
      if (S.places.some(function (x) { return x.name === p[0]; })) return;
      S.places.push({ id: uid(), name: String(p[0]).slice(0, 40), lat: +p[1], lon: +p[2], kind: p[3] || 'otro' });
      addedP++;
    });
    if (data.t) S.settings.toleranceMin = +data.t || S.settings.toleranceMin;
    // Canal en vivo creado por la familia: el estudiante publica ahí (si acepta compartir)
    if (data.l && Live.validChannel(data.l[0], data.l[1])) { S.live = { topic: data.l[0], key: data.l[1] }; Live.sync(); }
    return { contacts: added, places: addedP, student: data.s };
  }
  function importSheet(fromOnboarding) {
    return {
      html: '<h3>Importar configuración</h3><p class="sub">Pega el código que empieza con <b>TS1:</b></p>' +
        '<textarea class="input" id="codeIn" rows="4" placeholder="TS1:..."></textarea><button class="btn block" id="codeOk" style="margin-top:10px">Importar</button>' +
        '<button class="btn btn-ghost block" data-close style="margin-top:8px">Cancelar</button>',
      bind: function (root) {
        $('#codeOk', root).onclick = function () {
          try {
            var data = readCode($('#codeIn', root).value);
            var r = applyCode(data);
            if (fromOnboarding) {
              S.role = 'estudiante';
              if (data.s) S.profile.name = String(data.s).slice(0, 40);
              S.onboarded = !!S.profile.name;
              if (!S.onboarded) { onbDraft.role = 'estudiante'; onbStep = 2; }
            }
            save(true); closeSheet(); render();
            toast('Listo: ' + r.contacts + ' contacto(s) y ' + r.places + ' lugar(es) importados', 4000);
            if (fromOnboarding && S.onboarded) setTimeout(function () { openSheet(consentSheet(function () { render(); Tutorial.start(); })); }, 400);
          } catch (e) { toast(e.message || 'Código no válido'); }
        };
      }
    };
  }
  VIEWS.setup = {
    sub: true, tab: 'family',
    title: function () { return 'Configurar otro teléfono'; },
    html: function () {
      var code = makeCode();
      var st = firstName(S.profile.studentName) || 'el estudiante';
      return '<h1>' + (S.role === 'familia' ? 'Configura el teléfono de ' + esc(st) : 'Comparte tu configuración') + '</h1>' +
        '<ol class="sub" style="line-height:1.6;padding-left:20px"><li>Instala SafeGo en su teléfono.</li><li>Envíale este código por WhatsApp.</li><li>En su app: Bienvenida › «Tengo un código», o Familia › «Importar un código».</li><li>Su app le mostrará qué se comparte contigo y le pedirá aceptarlo. Sin su aceptación no se envían avisos automáticos.</li>' +
        (S.role === 'familia' ? '<li>Listo: en Inicio › «Ver en vivo» lo verás moverse en el mapa durante cada viaje.</li>' : '') + '</ol>' +
        '<div class="card"><div class="sub small">Incluye ' + S.contacts.length + ' contacto(s) y ' + S.places.length + ' lugar(es).</div><div class="kbd" style="margin-top:8px">' + esc(code) + '</div></div>' +
        (S.places.length ? '' : '<div class="card warn flat"><b>Sugerencia:</b> guarda primero «Casa» y su centro de estudios en Más › Mis lugares.</div>') +
        '<button class="btn btn-wa block" id="sendCode">' + icon('msg') + 'Enviar por WhatsApp</button>' +
        '<button class="btn btn-light block" id="copyCode" style="margin-top:8px">Copiar código</button>';
    },
    bind: function (root) {
      var code = makeCode();
      var msg = 'Configura SafeGo con este código (Familia › Importar un código):\n' + code;
      $('#sendCode', root).onclick = function () { Bridge.whatsapp('', msg); };
      $('#copyCode', root).onclick = function () { Bridge.copy(code); };
    }
  };
  VIEWS.howto = {
    sub: true, tab: 'home',
    title: function () { return 'Cómo llegan los avisos'; },
    html: function () {
      return '<h1>Así te enteras, sin llamar</h1>' +
        '<div class="card"><h3>1. Sale de casa</h3><p class="sub">Inicia el viaje en su app. Si lo activa, te llega «salió de Casa hacia el colegio, llega aprox. 7:40».</p></div>' +
        '<div class="card"><h3>2. En cada transbordo</h3><p class="sub">Cuando llega a la estación donde sube (o cambia de transporte) te llega «está en la estación El Recreo y toma el Metro hacia La Alameda». Además, su teléfono vibra antes de cada estación donde debe bajar.</p></div>' +
        '<div class="card"><h3>3. Llega</h3><p class="sub">Al entrar al área del centro de estudios, la app envía sola un SMS: «llegó bien a las 7:38». También puede mandarlo por WhatsApp.</p></div>' +
        '<div class="card warn"><h3>Si se retrasa</h3><p class="sub">Si pasan los minutos de tolerancia y no ha llegado, te llega un SMS con su última ubicación en el mapa.</p></div>' +
        '<div class="card"><h3>SOS</h3><p class="sub">Si mantiene presionado SOS, recibes su ubicación al instante y puede llamar al 911.</p></div>' +
        '<div class="card"><h3>En vivo</h3><p class="sub">Durante el viaje puedes abrir Inicio › «Ver en vivo» y verlo moverse en el mapa, con la hora del último punto, su destino y la hora estimada de llegada.</p></div>' +
        '<p class="sub small">Los avisos salen del teléfono del estudiante por SMS o WhatsApp. La ubicación en vivo viaja cifrada por ntfy.sh (servicio libre, sin cuentas) y se borra a las pocas horas; solo quien tiene el código puede verla.</p>';
    }
  };

  /* ---------------- Ubicación en vivo (familia sigue el viaje en el mapa) ----------------
   * El teléfono del estudiante publica su posición cifrada en un canal de ntfy.sh (servicio libre).
   * La clave solo viaja dentro del código que se comparte con la familia.
   */
  var LIVE_STALE_MS = 3 * 60000;

  function b64url(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  Bridge.liveNew = function () {
    var r = call('liveNew');
    if (r) { try { return JSON.parse(r); } catch (e) { /* sigue */ } }
    var t = new Uint8Array(16), k = new Uint8Array(32);
    crypto.getRandomValues(t); crypto.getRandomValues(k);
    return { topic: 'ts-' + Array.prototype.map.call(t, function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''), key: b64url(k) };
  };
  Bridge.liveConfig = function (topic, key, on) { call('liveConfig', topic || '', key || '', !!on); };
  Bridge.liveFetch = function (topic, key, since, cb) {
    if (!IS_NATIVE || typeof N.liveFetch !== 'function') { cb({ ok: false, error: 'solo-app' }); return; }
    var id = registerCb(cb, 25000);
    call('liveFetch', topic, key, since || '', id);
  };

  var Live = {
    validChannel: function (t, k) { return /^[A-Za-z0-9_-]{8,64}$/.test(t || '') && /^[A-Za-z0-9_-]{43}$/.test(k || ''); },
    /* Estudiante: activa o apaga la publicación según su consentimiento y su ajuste. */
    sync: function () {
      if (S.role === 'familia') { Bridge.liveConfig('', '', false); return; }
      if (!S.live || !Live.validChannel(S.live.topic, S.live.key)) { S.live = Bridge.liveNew(); save(); }
      Bridge.liveConfig(S.live.topic, S.live.key, Live.sharing());
    },
    sharing: function () { return S.role !== 'familia' && consentOk() && S.settings.liveShare !== false; },
    /* Código en base64 «seguro para URL» (sin + / =): sirve igual dentro de un enlace de WhatsApp. */
    code: function (name, ch) {
      var b = btoa(unescape(encodeURIComponent(JSON.stringify({ v: 1, n: name || '', t: ch.topic, k: ch.key }))));
      return 'TSV1:' + b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    },
    /* Acepta el código suelto, el enlace completo o el mensaje entero de WhatsApp. */
    read: function (text) {
      var m = String(text || '').match(/TSV1:([A-Za-z0-9+/=_-]+)/);
      if (!m) throw new Error('Pega el enlace o el código que empieza con TSV1:');
      var b = m[1].replace(/-/g, '+').replace(/_/g, '/');
      while (b.length % 4) b += '=';
      var d = JSON.parse(decodeURIComponent(escape(atob(b))));
      if (!d || d.v !== 1 || !Live.validChannel(d.t, d.k)) throw new Error('Enlace o código de seguimiento no válido');
      return { name: String(d.n || 'Estudiante').slice(0, 40), topic: d.t, key: d.k };
    },
    /* Familia: agrega (o actualiza) a quién sigue. */
    follow: function (f) {
      S.following = S.following || [];
      var ex = S.following.filter(function (x) { return x.topic === f.topic; })[0];
      if (ex) { ex.name = f.name || ex.name; ex.key = f.key; }
      else S.following.push({ id: uid(), name: f.name, topic: f.topic, key: f.key });
      save();
    },
    /* Familia: canal que viaja dentro del código de configuración del estudiante. */
    setupChannel: function () {
      if (!S.setupLive || !Live.validChannel(S.setupLive.topic, S.setupLive.key)) { S.setupLive = Bridge.liveNew(); save(); }
      Live.follow({ name: S.profile.studentName || 'Estudiante', topic: S.setupLive.topic, key: S.setupLive.key });
      return S.setupLive;
    },
    /* ¿La página de seguimiento ya está publicada? Se comprueba con un archivo de texto; sin ella no se ofrece enlace. */
    viewer: { ok: false, at: 0, busy: false },
    checkViewer: function (cb) {
      var v = Live.viewer, now = Date.now();
      if (!TS_VIEWER_URL) { cb && cb(false); return; }
      if (v.ok && now - v.at < 6 * 3600000) { cb && cb(true); return; }
      if (v.busy || (!v.ok && now - v.at < 20000)) { cb && cb(v.ok); return; }
      v.busy = true;
      var done = function (ok) { v.busy = false; v.ok = ok; v.at = Date.now(); cb && cb(ok); };
      Bridge.httpGet(TS_VIEWER_URL + 'ok.json?t=' + now, function (res) {
        try { done(!!(res.ok && res.data && res.data.status === 200 && JSON.parse(res.data.body).viewer === 1)); }
        catch (e) { done(false); }
      });
    },
    /* Mensaje de WhatsApp: con enlace (se abre en el navegador o se pega en la app) si la página está lista; si no, solo el código. */
    msg: function (name, ch, mine) {
      var code = Live.code(name, ch);
      var who = mine ? 'Sígueme en vivo mientras viajo.' : 'Sigue en vivo el viaje de ' + (name || 'tu familiar') + '.';
      if (Live.viewer.ok) {
        return who + '\n• En el navegador, sin instalar nada: abre el enlace.\n• En la app SafeGo: Inicio › Ver en vivo › Agregar, y pega este mismo enlace.\n' +
          TS_VIEWER_URL + '#' + code;
      }
      return who + ' En la app SafeGo: Inicio › Ver en vivo › Agregar, y pega este código:\n' + code;
    },
    shareMsg: function () {
      Live.sync();
      return Live.msg(S.profile.name, S.live, true);
    },
    /* Al iniciar un viaje, la familia recibe sola el enlace para seguirlo en vivo (SMS; si no hay SMS, WhatsApp con un toque). */
    sendStartLink: function (trip) {
      if (!Live.sharing() || !S.contacts.length) return;
      Live.sync();
      Live.checkViewer(function () {
        var name = who();
        var code = Live.code(S.profile.name, S.live);
        var head = name + ' inició su viaje a ' + trip.dest.name + '. Llegada estimada: ' + hhmm(trip.expectedAt) + '. ';
        var text = Live.viewer.ok ?
          head + 'Síguelo en vivo: ' + TS_VIEWER_URL + '#' + code :
          head + 'Para seguirlo en vivo, en la app SafeGo: Inicio › Ver en vivo › Agregar, y pega este código: ' + code;
        sendNotice(text + ' (SafeGo)', { kind: 'enlace en vivo' });
      });
    }
  };

  /* ---------- Vista en vivo (familia) ---------- */
  var liveView = { idx: 0, points: [], last: null, busy: false, error: null, lastState: null, timer: null, fitted: false };
  var LIVE_STATES = {
    viaje: ['ok', 'En camino'], tarde: ['warn', 'Con retraso'], sos: ['sos', 'SOS'], metro: ['ok', 'En el Metro (sin señal)'],
    llego: ['ok', 'Llegó'], llego_manual: ['ok', 'Llegó'], fin: ['', 'Viaje terminado']
  };
  function liveTarget() { return (S.following || [])[liveView.idx] || null; }
  function liveReset() { liveView.points = []; liveView.last = null; liveView.error = null; liveView.lastState = null; liveView.fitted = false; }
  /* Puntos del viaje más reciente (desde el último final anterior). */
  function liveTrail() {
    var p = liveView.points;
    var start = 0;
    for (var i = p.length - 2; i >= 0; i--) {
      if (/^(fin|llego)/.test(p[i].st)) { start = i + 1; break; }
    }
    return p.slice(start);
  }
  function livePoll() {
    var f = liveTarget();
    if (!f || liveView.busy) return;
    liveView.busy = true;
    Bridge.liveFetch(f.topic, f.key, liveView.last || '3h', function (res) {
      liveView.busy = false;
      if (liveTarget() !== f) return;
      if (!res.ok) { liveView.error = res.error || 'red'; updateLivePanel(); return; }
      liveView.error = null;
      var d = res.data || {};
      (d.points || []).forEach(function (p) {
        if (!isFinite(p.lat) || !isFinite(p.lon)) return;
        if (liveView.points.some(function (q) { return q.sent === p.sent && q.st === p.st; })) return;
        liveView.points.push(p);
      });
      liveView.points.sort(function (a, b) { return (a.sent || a.t) - (b.sent || b.t); });
      if (liveView.points.length > 600) liveView.points = liveView.points.slice(-600);
      if (d.last) liveView.last = d.last;
      var cur = liveView.points[liveView.points.length - 1];
      if (cur && liveView.lastState && cur.st !== liveView.lastState) {
        if (cur.st === 'sos') { Bridge.vibrate([600, 200, 600, 200, 600]); Bridge.notify('SOS de ' + f.name, 'Abre SafeGo para ver su ubicación.'); }
        else if (/^llego/.test(cur.st)) Bridge.notify(f.name + ' llegó', 'Llegó a ' + (cur.dest || 'su destino') + ' a las ' + hhmm(cur.t));
      }
      if (cur) liveView.lastState = cur.st;
      updateLivePanel(); // primero el panel: cambia la altura del mapa
      drawLive();
    });
  }
  function drawLive() {
    if (!Map.map) return;
    var g = Map.group('live');
    var trail = liveTrail();
    if (!trail.length) return;
    var cur = trail[trail.length - 1];
    var ll = trail.map(function (p) { return [p.lat, p.lon]; });
    if (ll.length > 1) L.polyline(ll, { color: '#2B6CE6', weight: 5, opacity: 0.75 }).addTo(g);
    if (isFinite(cur.dlat)) {
      L.marker([cur.dlat, cur.dlon], { icon: Map.pin('b') }).bindTooltip(cur.dest || 'Destino').addTo(g);
    }
    L.circle([cur.lat, cur.lon], { radius: Math.max(10, cur.acc || 30), color: '#2B6CE6', weight: 1, fillOpacity: 0.1 }).addTo(g);
    L.marker([cur.lat, cur.lon], { icon: L.divIcon({ className: '', html: '<div class="me-dot live' + (cur.st === 'sos' ? ' sos' : '') + '"></div>', iconSize: [22, 22], iconAnchor: [11, 11] }), zIndexOffset: 1000 })
      .bindTooltip(esc(liveTarget() ? liveTarget().name : '')).addTo(g);
    if (!liveView.fitted) {
      var b = ll.slice();
      if (isFinite(cur.dlat)) b.push([cur.dlat, cur.dlon]);
      var fit = function () {
        if (!Map.map) return;
        Map.map.invalidateSize(false);
        if (b.length > 1) Map.map.fitBounds(b, { padding: [40, 40], maxZoom: 16 }); else Map.map.setView(ll[0], 16);
      };
      fit(); setTimeout(fit, 150); // el panel puede cambiar la altura del mapa
      liveView.fitted = true;
    } else if (liveView.follow !== false) {
      Map.map.panTo([cur.lat, cur.lon], { animate: true });
    }
  }
  function ago(t) {
    var s = Math.max(0, Math.round((Date.now() - t) / 1000));
    if (s < 60) return 'hace ' + s + ' s';
    if (s < 3600) return 'hace ' + Math.round(s / 60) + ' min';
    return 'a las ' + hhmm(t);
  }
  function livePanelHtml() {
    var f = liveTarget();
    if (!f) return '';
    var list = S.following || [];
    var h = '';
    if (list.length > 1) {
      h += '<div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:8px">' + list.map(function (x, i) {
        return '<button class="btn sm ' + (i === liveView.idx ? '' : 'btn-light') + '" data-lv="' + i + '">' + esc(firstName(x.name) || x.name) + '</button>';
      }).join('') + '</div>';
    }
    var trail = liveTrail();
    var cur = trail[trail.length - 1];
    if (!IS_NATIVE) return h + '<div class="card warn flat"><b>Disponible en la app de Android</b><p class="sub small">El seguimiento en vivo necesita la app instalada.</p></div>';
    if (!cur) {
      return h + '<h3 style="margin:0 0 4px">' + esc(f.name) + '</h3>' +
        (liveView.error ? '<div class="card warn flat"><b>Sin conexión</b><p class="sub small">Reintentamos solos cada 10 segundos.</p></div>' :
          '<p class="sub">' + (liveView.busy && !liveView.last ? 'Buscando su ubicación…' : 'Todavía no hay un viaje activo. Cuando inicie un viaje, aquí lo verás moverse en el mapa.') + '</p>') +
        '<p class="sub small">Su app debe tener activado «Ubicación en vivo para mi familia».</p>';
    }
    var t = cur.sent || cur.t;
    var st = LIVE_STATES[cur.st] || LIVE_STATES.viaje;
    var stale = (cur.st === 'viaje' || cur.st === 'tarde') && Date.now() - t > LIVE_STALE_MS;
    var dist = isFinite(cur.dlat) ? P.distKm(cur, { lat: cur.dlat, lon: cur.dlon }) : null;
    h += '<div class="row between"><div><h3 style="margin:0">' + esc(f.name) + '</h3><div class="sub small">Actualizado ' + ago(t) + (cur.acc ? ' · ±' + cur.acc + ' m' : '') + '</div></div>' +
      '<span class="pill ' + (cur.st === 'sos' ? 'warn' : st[0]) + '">' + st[1] + '</span></div>';
    if (cur.st === 'sos') h += '<div class="card warn flat" style="margin-top:8px"><b>Pidió ayuda (SOS) a las ' + hhmm(t) + '</b><p class="sub small">Llama al 911 si no te responde.</p><button class="btn sm" data-dial="911">' + icon('phone') + 'Llamar al 911</button></div>';
    if (stale) h += '<div class="card warn flat" style="margin-top:8px"><b>Sin señal desde las ' + hhmm(t) + '</b><p class="sub small">Puede ir en el Metro (bajo tierra no hay GPS) o sin datos móviles. El mapa se actualiza solo cuando vuelva la señal.</p></div>';
    h += '<div class="list" style="margin-top:6px">';
    if (cur.dest) h += '<div class="item"><div class="ic">' + icon('school') + '</div><div class="grow"><b>' + esc(cur.dest) + '</b><div class="sub small">' +
      (/^llego/.test(cur.st) ? 'Llegó a las ' + hhmm(t) : [cur.eta ? 'Llegada estimada ' + hhmm(cur.eta) : '', dist !== null ? 'faltan ' + fmtKm(dist) + ' en línea recta' : ''].filter(Boolean).join(' · ')) + '</div></div></div>';
    if (cur.spd) h += '<div class="item"><div class="ic">' + icon('bus') + '</div><div class="grow"><b>' + cur.spd + ' km/h</b><div class="sub small">velocidad aproximada</div></div></div>';
    h += '</div><div class="row" style="gap:8px;margin-top:10px"><button class="btn btn-light sm" id="lvCenter" style="flex:1">' + icon('locate') + 'Centrar</button>' +
      '<button class="btn btn-light sm" id="lvOsm" style="flex:1">' + icon('pin') + 'Abrir en mapa</button></div>' +
      '<button class="btn btn-ghost block sm" id="lvShare" style="margin-top:6px">' + icon('users') + 'Compartir con otro familiar</button>';
    return h;
  }
  function bindLivePanel(root) {
    $$('[data-lv]', root).forEach(function (b) {
      b.onclick = function () { liveView.idx = +b.getAttribute('data-lv'); liveReset(); Map.clear('live'); updateLivePanel(); livePoll(); };
    });
    $$('[data-dial]', root).forEach(function (b) { b.onclick = function () { Bridge.dial(b.getAttribute('data-dial')); }; });
    var c = $('#lvCenter', root);
    if (c) c.onclick = function () { liveView.fitted = false; liveView.follow = true; drawLive(); };
    var sh = $('#lvShare', root);
    if (sh) sh.onclick = function () {
      var f = liveTarget();
      if (f) Bridge.whatsapp('', Live.msg(f.name, f, false));
    };
    var o = $('#lvOsm', root);
    if (o) o.onclick = function () { var tr = liveTrail(), cur = tr[tr.length - 1]; if (cur) Bridge.openUrl(osmLink(cur.lat, cur.lon)); };
  }
  function updateLivePanel() {
    var p = $('#livePanel');
    if (!p) return;
    p.innerHTML = livePanelHtml();
    bindLivePanel(p);
  }
  function liveActive() { return stack.length && stack[stack.length - 1] === 'live'; }
  setInterval(function () {
    if (liveActive() && !document.hidden) livePoll();
  }, 10000);
  setInterval(function () { if (liveActive()) updateLivePanel(); }, 5000); // «hace X s»

  VIEWS.live = {
    sub: true, tab: 'home',
    full: true,
    title: function () { return 'En vivo'; },
    html: function () {
      if (!(S.following || []).length) {
        return '<div style="padding:16px;overflow-y:auto"><div class="empty">' + icon('nav') + '<h3>Sigue su viaje en el mapa</h3>' +
          '<p>Cuando ' + esc(firstName(S.profile.studentName) || 'el estudiante') + ' inicie un viaje, verás cómo avanza en tiempo real, cuándo llega y si pide ayuda.</p></div>' +
          '<div class="card"><h3>Cómo activarlo</h3><ol class="sub" style="line-height:1.6;padding-left:20px">' +
          '<li>El estudiante abre Familia › «Ubicación en vivo» y toca <b>Enviar enlace</b>. Te llega por WhatsApp.</li>' +
          '<li>Tócalo para verlo en el <b>navegador</b> (sin instalar nada), o pega ese mismo enlace aquí para verlo <b>en la app</b>.</li>' +
          '<li>Si configuraste su teléfono con tu código, ya está listo: vuelve a crear el código en Familia y envíaselo de nuevo.</li></ol>' +
          '<button class="btn block" id="lvAdd">' + icon('plus') + 'Pegar enlace o código</button></div></div>';
      }
      if (liveView.idx >= S.following.length) liveView.idx = 0;
      return '<div class="map-slot" style="min-height:240px"><button class="map-fab" id="lvAddFab" style="top:12px" aria-label="Agregar">' + icon('plus') + '</button></div>' +
        '<div class="panel" id="livePanel">' + livePanelHtml() + '</div>';
    },
    bind: function (root) {
      var a = $('#lvAdd', root) || $('#lvAddFab', root);
      if (a) a.onclick = function () { openSheet(followSheet()); };
      bindLivePanel(root);
      if (Map.map) Map.map.once('dragstart', function () { liveView.follow = false; });
      Live.checkViewer();
      livePoll();
    },
    onMap: function () { liveView.fitted = false; drawLive(); }
  };
  function followSheet() {
    return {
      html: '<h3>Seguir en vivo</h3><p class="sub">Pega el <b>enlace</b> que te enviaron por WhatsApp (o el código que empieza con <b>TSV1:</b>). Sirve el mensaje completo.</p>' +
        '<textarea class="input" id="lvCode" rows="4" placeholder="https://…#TSV1:…"></textarea><button class="btn block" id="lvOk" style="margin-top:10px">Agregar</button>' +
        ((S.following || []).length ? '<h3 style="margin-top:16px">Sigues a</h3><div class="list">' + S.following.map(function (f, i) {
          return '<div class="item"><div class="grow"><b>' + esc(f.name) + '</b></div><button class="icon-btn" data-unf="' + i + '" aria-label="Dejar de seguir">' + icon('trash') + '</button></div>';
        }).join('') + '</div>' : '') +
        '<button class="btn btn-ghost block" data-close style="margin-top:8px">Cerrar</button>',
      bind: function (root) {
        $('#lvOk', root).onclick = function () {
          try {
            var f = Live.read($('#lvCode', root).value);
            Live.follow(f);
            liveView.idx = S.following.length - 1; liveReset();
            closeSheet(); render(); toast('Listo: sigues a ' + f.name);
          } catch (e) { toast(e.message || 'Código no válido'); }
        };
        $$('[data-unf]', root).forEach(function (b) {
          b.onclick = function () { S.following.splice(+b.getAttribute('data-unf'), 1); save(); liveView.idx = 0; liveReset(); closeSheet(); render(); };
        });
      }
    };
  }

  /* ---------- Tarjeta del estudiante en Familia ---------- */
  function liveHint() {
    return Live.viewer.ok ? 'Tu familia lo abre en el navegador sin instalar nada, o pega el mismo enlace en su app (Inicio › Ver en vivo).'
      : 'Tu familia lo pega en su app (Inicio › Ver en vivo). Cuando la página de seguimiento esté publicada, también podrán abrirlo con un enlace, sin instalar nada.';
  }
  function liveCardHtml() {
    if (S.role === 'familia') return '';
    var on = Live.sharing();
    var why = !consentOk() ? 'Apagado: primero acepta compartir avisos con tu familia.' :
      S.settings.liveShare === false ? 'Apagado: tu familia recibe los avisos por SMS pero no puede verte en el mapa.' : 'Al iniciar cada viaje, tu familia recibe por SMS el enlace para verte en el mapa. Fuera de un viaje no se comparte nada.';
    return '<h2>Seguimiento en vivo</h2><div class="card">' +
      '<label class="row" style="cursor:pointer;gap:10px"><div class="grow"><b>Ubicación en vivo para mi familia</b><div class="sub small">' + esc(why) + '</div></div>' +
      '<span class="switch"><input type="checkbox" id="liveSw" ' + (on ? 'checked' : '') + '><span></span></span></label>' +
      '<p class="sub small" style="margin-top:8px">Se envía cifrada: solo quien tiene tu enlace o código puede verla. Pasa por ntfy.sh, un servicio libre que la borra a las pocas horas.</p>' +
      '<button class="btn btn-wa block" id="liveSend">' + icon('msg') + (Live.viewer.ok ? 'Enviar enlace por WhatsApp' : 'Enviar código por WhatsApp') + '</button>' +
      '<p class="sub small" id="liveHint" style="margin:6px 0 0">' + esc(liveHint()) + '</p>' +
      '<button class="btn btn-ghost block sm" id="liveReset" style="margin-top:6px">Cambiar código (quien lo tenga deja de verte)</button></div>';
  }
  function bindLiveCard(root) {
    var sw = $('#liveSw', root);
    if (!sw) return;
    sw.onchange = function () {
      if (sw.checked && !consentOk()) { sw.checked = false; openSheet(consentSheet(function () { Live.sync(); render(); })); return; }
      S.settings.liveShare = sw.checked; save(); Live.sync(); render();
    };
    Live.checkViewer(function (ok) {
      var b = $('#liveSend', root), h = $('#liveHint', root);
      if (b) b.innerHTML = icon('msg') + (ok ? 'Enviar enlace por WhatsApp' : 'Enviar código por WhatsApp');
      if (h) h.textContent = liveHint();
    });
    $('#liveSend', root).onclick = function () {
      var c = S.contacts.filter(function (x) { return x.phone; })[0];
      Bridge.whatsapp(c ? c.phone : '', Live.shareMsg());
    };
    $('#liveReset', root).onclick = function () {
      S.live = Bridge.liveNew(); save(); Live.sync();
      toast('Código cambiado. Envía el nuevo a tu familia.', 3500);
    };
  }
  /* ---------------- Más ---------------- */
  VIEWS.more = {
    title: function () { return 'Más'; },
    html: function () {
      return '<div class="card list">' +
        navItem('demo', 'play', 'Demostración', 'Mira cómo le llegan los avisos a tu familia') +
        navItem('tests', 'check', 'Pruebas reales', 'Llegadas, avisos y batería de tus viajes') + '</div>' +
        '<div class="card list">' +
        navItem('places', 'star', 'Mis lugares', S.places.length + ' guardado(s): casa, centro de estudios…') +
        navItem('history', 'history', 'Historial de viajes', S.history.length + ' viaje(s)') +
        navItem('lines', 'train', 'Líneas y estaciones', 'Metro, Trolebús y Ecovía') +
        navItem('guide', 'shield', 'Guía de seguridad y emergencias', 'Consejos y números útiles') +
        '<div class="item" id="replayTut" role="button"><div class="ic">' + icon('info') + '</div><div class="grow"><b>Cómo usar la app</b><div class="sub small">Vuelve a ver el tutorial y los consejos</div></div><div class="chev">' + icon('chev') + '</div></div></div>' +
        '<div class="card list">' +
        navItem('settings', 'gear', 'Ajustes', 'Avisos, tolerancia, modo discreto, tema') +
        navItem('privacy', 'shield', 'Privacidad y datos', 'Avisos sin vigilancia, consentimiento y borrado') +
        navItem('about', 'info', 'Acerca de SafeGo', 'Versión ' + VERSION + ' · créditos y datos') + '</div>';
    },
    bind: function (root) {
      $$('[data-nav]', root).forEach(function (b) { b.onclick = function () { push(b.getAttribute('data-nav')); }; });
      $('#replayTut', root).onclick = function () { Tips.reset(); Tutorial.start(true); };
    }
  };
  VIEWS.places = {
    sub: true,
    title: function () { return 'Mis lugares'; },
    html: function () {
      var h = '<p class="sub">Guarda tu casa y tu centro de estudios para planificar con un toque y detectar tu llegada.</p><div class="card list">';
      if (!S.places.length) h += '<div class="empty">' + icon('star') + '<p>Sin lugares guardados.</p></div>';
      S.places.forEach(function (p, i) {
        h += '<div class="item"><div class="ic">' + icon(placeIcon(p)) + '</div><div class="grow"><b>' + esc(p.name) + '</b><div class="sub small">' + p.lat.toFixed(4) + ', ' + p.lon.toFixed(4) + '</div></div>' +
          '<button class="icon-btn" data-go="' + i + '" aria-label="Ir">' + icon('route') + '</button><button class="icon-btn" data-ed="' + i + '" aria-label="Editar">' + icon('edit') + '</button></div>';
      });
      return h + '</div><button class="btn block" id="addPlace">' + icon('plus') + 'Agregar lugar</button>';
    },
    bind: function (root) {
      $('#addPlace', root).onclick = function () { openSheet(placeSheet(null)); };
      $$('[data-ed]', root).forEach(function (b) { b.onclick = function () { openSheet(placeSheet(null, +b.getAttribute('data-ed'))); }; });
      $$('[data-go]', root).forEach(function (b) { b.onclick = function () { startPlanTo(S.places[+b.getAttribute('data-go')]); }; });
    }
  };
  /* Hoja para crear/editar un lugar. preset = {name,lat,lon} opcional */
  function placeSheet(preset, idx) {
    var editing = idx !== undefined && idx !== null;
    var p = editing ? S.places[idx] : (preset || { name: '', lat: null, lon: null, kind: 'estudio' });
    var draft = { name: p.name, lat: p.lat, lon: p.lon, kind: p.kind || 'estudio' };
    var html = '<h3>' + (editing ? 'Editar lugar' : 'Nuevo lugar') + '</h3>' +
      '<div class="row wrap">' + ['casa', 'estudio', 'otro'].map(function (k) {
        return '<button class="btn sm ' + (draft.kind === k ? '' : 'btn-light') + '" data-kind="' + k + '">' + icon(k === 'casa' ? 'home' : k === 'estudio' ? 'school' : 'star') + (k === 'casa' ? 'Casa' : k === 'estudio' ? 'Estudios' : 'Otro') + '</button>';
      }).join('') + '</div>' +
      '<label class="field"><span>Nombre</span><input class="input" id="plName" maxlength="40" value="' + esc(draft.name) + '" placeholder="Ej.: Colegio Mejía"></label>' +
      '<label class="field"><span>Ubicación</span><input class="input" id="plSearch" placeholder="Buscar dirección o lugar" autocomplete="off"></label><div id="plSug"></div>' +
      '<div class="row wrap"><button class="btn btn-light sm" id="plHere">' + icon('locate') + 'Estoy aquí</button></div>' +
      '<p class="sub small" id="plCoord">' + (draft.lat !== null ? 'Ubicación: ' + draft.lat.toFixed(5) + ', ' + draft.lon.toFixed(5) : 'Aún sin ubicación') + '</p>' +
      '<button class="btn block" id="plSave">Guardar</button>' +
      (editing ? '<button class="btn btn-ghost block" id="plDel" style="margin-top:8px;color:var(--primary)">' + icon('trash') + 'Eliminar</button>' : '') +
      '<button class="btn btn-ghost block" data-close style="margin-top:8px">Cancelar</button>';
    return {
      html: html, bind: function (root) {
        var setCoord = function (lat, lon) { draft.lat = lat; draft.lon = lon; $('#plCoord', root).textContent = 'Ubicación: ' + lat.toFixed(5) + ', ' + lon.toFixed(5); };
        $$('[data-kind]', root).forEach(function (b) {
          b.onclick = function () {
            draft.kind = b.getAttribute('data-kind');
            $$('[data-kind]', root).forEach(function (x) { x.classList.toggle('btn-light', x !== b); });
            var nm = $('#plName', root);
            if (!nm.value && draft.kind === 'casa') nm.value = 'Casa';
          };
        });
        $('#plHere', root).onclick = function () { withLocation(function (loc) { if (loc) setCoord(loc.lat, loc.lon); }); };
        var sg = $('#plSug', root);
        var doSearch = debounce(function (q) {
          if (q.trim().length < 2) { sg.innerHTML = ''; return; }
          var local = localSearch(q);
          var paint = function (remote) {
            var all = local.concat(remote || []);
            sg.innerHTML = all.length ? '<div class="suggest">' + all.map(function (r, i) {
              return '<div class="item" data-ps="' + i + '" role="button"><div class="grow"><b>' + esc(r.name) + '</b><div class="sub small">' + esc(r.detail || r.kind) + '</div></div></div>';
            }).join('') + '</div>' : '';
            $$('[data-ps]', sg).forEach(function (el) {
              el.onclick = function () {
                var r = all[+el.getAttribute('data-ps')];
                setCoord(r.lat, r.lon);
                var nm = $('#plName', root);
                if (!nm.value) nm.value = r.name.replace(/ \(.*\)$/, '').slice(0, 40);
                sg.innerHTML = '';
                $('#plSearch', root).value = r.name;
              };
            });
          };
          paint([]);
          remoteSearch(q, paint);
        }, 450);
        $('#plSearch', root).oninput = function (e) { doSearch(e.target.value); };
        $('#plSave', root).onclick = function () {
          draft.name = $('#plName', root).value.trim();
          if (!draft.name) { toast('Escribe un nombre'); return; }
          if (draft.lat === null) { toast('Elige la ubicación: busca o toca «Estoy aquí»'); return; }
          if (editing) Object.assign(S.places[idx], draft);
          else S.places.push({ id: uid(), name: draft.name, lat: draft.lat, lon: draft.lon, kind: draft.kind });
          save(); closeSheet(); render(); toast('Lugar guardado');
        };
        var del = $('#plDel', root);
        if (del) del.onclick = function () { S.places.splice(idx, 1); save(); closeSheet(); render(); };
      }
    };
  }
  VIEWS.history = {
    sub: true,
    title: function () { return 'Historial'; },
    html: function () {
      if (!S.history.length) return '<div class="empty">' + icon('history') + '<p>Aquí verás tus viajes: hora de salida, llegada y si llegaste a tiempo.</p></div>';
      var h = statsCard() + '<h2>Viajes</h2><div class="card list">';
      S.history.slice(0, 100).forEach(function (r) {
        var ok = r.status === 'llegó';
        h += '<div class="item"><div class="ic" style="' + (ok ? 'background:var(--ok-soft);color:var(--ok)' : '') + '">' + icon(ok ? 'check' : 'x') + '</div><div class="grow"><b>' + esc(r.origin) + ' → ' + esc(r.dest) + '</b>' +
          '<div class="sub small">' + fmtDate(r.startedAt) + ' · ' + r.actualMin + ' min (estimado ' + r.plannedMin + ')</div></div>' +
          (ok ? (r.onTime ? '<span class="pill ok">A tiempo</span>' : '<span class="pill warn">Tarde</span>') : '<span class="pill">Cancelado</span>') + '</div>';
      });
      return h + '</div><button class="btn btn-ghost block" id="clearHist">' + icon('trash') + 'Borrar historial</button>';
    },
    bind: function (root) {
      var c = $('#clearHist', root);
      if (c) c.onclick = function () {
        openSheet({
          html: '<h3>¿Borrar el historial?</h3><button class="btn block" id="y">Borrar</button><button class="btn btn-ghost block" data-close style="margin-top:8px">Cancelar</button>',
          bind: function (r) { $('#y', r).onclick = function () { S.history = []; save(); closeSheet(); render(); }; }
        });
      };
    }
  };
  VIEWS.lines = {
    sub: true, full: false,
    title: function () { return 'Líneas y estaciones'; },
    html: function () {
      var h = '<p class="sub">' + D.LINES.length + ' líneas: Metro, Trolebús (circuitos C1–C6), Ecovía (E1–E3), Metrobús, Corredor Sur Occidental, alimentadores y buses que conectan con el Metro, los valles y el aeropuerto. ' +
        'Nombres y orden de paradas tomados de fuentes públicas (octubre de 2026); las ubicaciones en el mapa son aproximadas.</p>';
      MODE_ORDER.forEach(function (m) {
        var lines = D.LINES.filter(function (l) { return l.mode === m; });
        if (!lines.length) return;
        h += '<details class="line-group"' + (m === 'metro' ? ' open' : '') + '><summary><span class="pill mode ' + m + '">' + icon(MODE_ICON[m], 'width="13" height="13"') + '</span>' +
          esc(MODE_NAME[m]) + '<span class="sub small" style="margin-left:auto">' + lines.length + '</span></summary>';
        lines.forEach(function (l) { h += lineCard(l); });
        h += '</details>';
      });
      return h;
    }
  };
  function lineCard(l) {
    var h = '<div style="padding:12px 0;border-bottom:1px solid var(--line)"><b>' + esc(l.name) + '</b>' +
      '<div class="sub small" style="margin:4px 0 8px">Horario referencial ' + esc(l.hours) + ' · espera aprox. ' + l.waitMin + ' min' + (l.via ? '<br>Por ' + esc(l.via) : '') +
      (l.codes ? '<br>' + esc(l.codes) : '') + (l.note ? '<br>' + esc(l.note) : '') + '</div>';
    if (l.services) {
      h += '<div class="list" style="margin-bottom:8px">' + l.services.map(function (sv) {
        return '<div class="row" style="gap:8px;padding:3px 0"><span class="pill mode ' + l.mode + '">' + esc(sv.code) + '</span><span class="small">' + esc(P.cleanName(sv.from)) + ' ⇄ ' + esc(P.cleanName(sv.to)) + (sv.label && sv.label !== sv.code ? ' · ' + esc(sv.label.replace(sv.code + ' ', '')) : '') + '</span></div>';
      }).join('') + '</div>';
    }
    h += '<div class="steps">';
    l.stations.forEach(function (s, i) {
      var transfers = [];
      if (l.kind === 'troncal') {
        D.LINES.forEach(function (o) {
          if (o.id === l.id || o.kind !== 'troncal') return;
          o.stations.forEach(function (os) { if (P.distKm({ lat: s[1], lon: s[2] }, { lat: os[1], lon: os[2] }) < 0.4) transfers.push(o.short); });
        });
      }
      var uniq = transfers.filter(function (x, k) { return transfers.indexOf(x) === k; });
      h += '<div class="step" style="padding-bottom:6px">' + (i < l.stations.length - 1 ? '<div class="bar" style="background:' + l.color + '"></div>' : '') +
        '<div class="ic" style="background:' + l.color + ';width:26px;height:26px"><span style="font-size:11px;font-weight:800">' + (i + 1) + '</span></div><div><b>' + esc(P.cleanName(s[0])) + '</b>' +
        (uniq.length ? ' <span class="sub small">· conexión ' + esc(uniq.join(', ')) + '</span>' : '') + '</div></div>';
    });
    return h + '</div></div>';
  }
  VIEWS.guide = {
    sub: true,
    title: function () { return 'Seguridad y emergencias'; },
    html: function () {
      var h = '<div class="card hero"><h3 style="color:#fff">Emergencias</h3><p class="sub">En Ecuador, ECU 911 atiende policía, bomberos y ambulancias.</p>';
      D.EMERGENCY.forEach(function (e) { h += '<button class="btn btn-light block" data-dial="' + esc(e.phone) + '" style="margin-top:8px">' + icon('phone') + esc(e.name) + ' · ' + esc(e.phone) + '</button>'; });
      h += '</div>';
      var sections = [
        ['Antes de salir', ['Planifica la ruta y revisa dónde haces cada transbordo.', 'Acuerda con tu familia una hora de llegada.', 'Carga el celular y guarda la app con tu ruta abierta.']],
        ['En la parada y la estación', ['Espera en zonas iluminadas y cerca de otras personas o del personal.', 'Ten lista la tarjeta o el pasaje para no sacar la billetera.', 'En hora pico, deja pasar una unidad muy llena si no puedes subir con seguridad.']],
        ['Durante el viaje', ['Guarda el celular: la app vibra antes de que bajes.', 'Lleva la mochila adelante en unidades llenas.', 'Si alguien te incomoda, acércate al conductor o al personal de la estación.']],
        ['Si algo sale mal', ['Si el bus no llega, mira otra opción en Rutas (por ejemplo, el Metro).', 'Avisa el retraso con «Voy tarde»: tu familia no tendrá que llamarte.', 'Si te sientes en peligro, mantén presionado SOS y llama al 911.']]
      ];
      sections.forEach(function (s) {
        h += '<h2>' + esc(s[0]) + '</h2><div class="card">' + s[1].map(function (t) { return '<p>• ' + esc(t) + '</p>'; }).join('') + '</div>';
      });
      h += '<h2>Lo que nos contaron 40 personas</h2><div class="card flat"><p class="sub">Lo que más cuesta al cambiar de transporte: esperar la siguiente unidad (14), la aglomeración al subir o bajar (9) y caminar entre paradas (8). Por eso la app prioriza rutas con menos esperas y caminatas, y te avisa antes de bajar.</p></div>';
      return h;
    },
    bind: function (root) { $$('[data-dial]', root).forEach(function (b) { b.onclick = function () { Bridge.dial(b.getAttribute('data-dial')); }; }); }
  };
  VIEWS.settings = {
    sub: true,
    title: function () { return 'Ajustes'; },
    html: function () {
      var s = S.settings;
      var perms = Bridge.permissions();
      var sw = function (id, on, title, sub) {
        return '<div class="item"><div class="grow"><b>' + title + '</b><div class="sub small">' + sub + '</div></div><label class="switch"><input type="checkbox" data-set="' + id + '" ' + (on ? 'checked' : '') + '><span></span></label></div>';
      };
      var sel = function (id, val, opts) {
        return '<select class="input" data-sel="' + id + '" style="width:auto;min-height:40px;padding:6px 10px">' + opts.map(function (o) { return '<option value="' + o[0] + '" ' + (String(o[0]) === String(val) ? 'selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>';
      };
      return '<h2 style="margin-top:4px">Perfil</h2><div class="card">' +
        '<label class="field"><span>Tu nombre</span><input class="input" id="sName" maxlength="40" value="' + esc(S.profile.name) + '"></label>' +
        (S.role === 'familia' ? '<label class="field"><span>Nombre del estudiante</span><input class="input" id="sStudent" maxlength="40" value="' + esc(S.profile.studentName) + '"></label>' : '') +
        '<div class="row between"><span>Modo</span>' + sel('role', S.role, [['estudiante', 'Estudiante'], ['familia', 'Familia']]) + '</div></div>' +
        '<h2>Viaje y avisos</h2><div class="card list">' +
        (S.role === 'familia' ? '' : '<div class="item"><div class="grow"><b>Compartir avisos con mi familia</b><div class="sub small">' + (consentOk() ? 'Aceptado el ' + fmtDate(S.consent.at) : 'Apagado: tú envías cada mensaje') + '</div></div><label class="switch"><input type="checkbox" id="consentSw" ' + (consentOk() ? 'checked' : '') + '><span></span></label></div>') +
        sw('autoSmsArrival', s.autoSmsArrival, 'Aviso automático de llegada', 'Envía un SMS al entrar a tu destino') +
        sw('smsOnLate', s.smsOnLate, 'Avisar a la familia si me retraso', 'Con tu última ubicación, pasada la tolerancia') +
        sw('smsOnStart', s.smsOnStart, 'Avisar cuando salgo', 'Mensaje al iniciar cada viaje') +
        sw('familyNotices', s.familyNotices !== false, 'Avisar a la familia al subir', 'En cada estación donde subes o haces transbordo') +
        sw('transferAlerts', s.transferAlerts, 'Avisos antes de bajar', 'Vibración al acercarte a tu estación') +
        '<div class="item"><div class="grow"><b>Tolerancia de retraso</b><div class="sub small">Minutos extra antes de avisar</div></div>' + sel('toleranceMin', s.toleranceMin, [[5, '5 min'], [10, '10 min'], [15, '15 min'], [20, '20 min'], [30, '30 min']]) + '</div>' +
        '<div class="item"><div class="grow"><b>Radio de llegada</b><div class="sub small">Distancia al destino para darte por llegado</div></div>' + sel('arrivalRadius', s.arrivalRadius, [[80, '80 m'], [150, '150 m'], [250, '250 m'], [400, '400 m']]) + '</div></div>' +
        '<h2>Pantalla</h2><div class="card list">' +
        sw('discreet', s.discreet, 'Modo discreto', 'Avisos solo con vibración, sin sonido') +
        sw('keepScreenOn', s.keepScreenOn, 'Pantalla encendida en viaje', 'Útil si llevas el teléfono en la mano') +
        '<div class="item"><div class="grow"><b>Tema</b></div>' + sel('theme', s.theme, [['auto', 'Automático'], ['light', 'Claro'], ['dark', 'Oscuro']]) + '</div></div>' +
        '<h2>Permisos</h2><div class="card list">' +
        permItem('Ubicación', perms.location) + permItem('Notificaciones', perms.notifications) + permItem('SMS', perms.sms) +
        '</div><button class="btn btn-light block" id="reqPerms">Revisar permisos</button>' +
        (IS_NATIVE ? '<button class="btn btn-ghost block" id="appSettings" style="margin-top:8px">Abrir ajustes de Android</button>' : '') +
        (IS_NATIVE && call('batteryOptimized') ? '<div class="card warn" style="margin-top:10px"><b>Ahorro de batería activo</b><p class="sub small">Algunos teléfonos detienen el seguimiento para ahorrar batería. Quita SafeGo de la optimización para que el aviso de llegada no falle.</p><button class="btn sm" id="battery">Abrir ajustes de batería</button></div>' : '') +
        '<h2>Datos</h2><button class="btn btn-ghost block" id="resetAll" style="color:var(--primary)">' + icon('trash') + 'Borrar todos mis datos</button>';
    },
    bind: function (root) {
      var csw = $('#consentSw', root);
      if (csw) csw.onchange = function () {
        if (csw.checked) { csw.checked = false; openSheet(consentSheet()); }
        else { setConsent(false); toast('Avisos automáticos apagados'); render(); }
      };
      $$('[data-set]', root).forEach(function (c) {
        c.onchange = function () {
          S.settings[c.getAttribute('data-set')] = c.checked; save();
          if (c.getAttribute('data-set') === 'autoSmsArrival' && c.checked && IS_NATIVE && !Bridge.permissions().sms) Bridge.requestPermissions(['sms'], function () { render(); });
        };
      });
      $$('[data-sel]', root).forEach(function (c) {
        c.onchange = function () {
          var k = c.getAttribute('data-sel');
          if (k === 'role') { S.role = c.value; save(); render(); return; }
          S.settings[k] = (k === 'theme') ? c.value : +c.value;
          save(); if (k === 'theme') applyTheme();
        };
      });
      $('#sName', root).onchange = function (e) { S.profile.name = e.target.value.trim(); save(); };
      var stn = $('#sStudent', root);
      if (stn) stn.onchange = function (e) { S.profile.studentName = e.target.value.trim(); save(); };
      $('#reqPerms', root).onclick = function () { Bridge.requestPermissions(['location', 'notifications', 'sms'], function () { render(); }); };
      var bt = $('#battery', root);
      if (bt) bt.onclick = function () { call('openBatterySettings'); };
      var as = $('#appSettings', root);
      if (as) as.onclick = function () { call('openAppSettings'); };
      $('#resetAll', root).onclick = function () {
        openSheet({
          html: '<h3>¿Borrar todo?</h3><p class="sub">Se eliminarán contactos, lugares, historial y ajustes de este teléfono.</p><button class="btn block" id="y">Borrar todo</button><button class="btn btn-ghost block" data-close style="margin-top:8px">Cancelar</button>',
          bind: function (r) {
            $('#y', r).onclick = function () {
              if (S.trip) Trip.cancel();
              S = defaultState(); onbStep = 0; save(true); closeSheet(); stack = []; currentTab = 'home'; render();
            };
          }
        });
      };
    }
  };
  function permItem(name, on) {
    return '<div class="item"><div class="grow">' + name + '</div>' + (on ? '<span class="pill ok">Permitido</span>' : '<span class="pill warn">Sin permiso</span>') + '</div>';
  }
  VIEWS.about = {
    sub: true,
    title: function () { return 'Acerca de'; },
    html: function () {
      return '<div class="card hero"><div class="logo" style="background:#fff;color:var(--primary)">SG</div><h1 style="margin-top:12px">SafeGo</h1><p class="sub">Versión ' + VERSION + ' · Llegó bien. Sin llamadas.</p></div>' +
        '<div class="card"><p>Reúne en una sola pantalla las rutas de Bus, Trolebús, Ecovía y Metro de Quito, y avisa a la familia cuando el estudiante llega a su centro de estudios.</p></div>' +
        '<div class="card"><h3>Equipo</h3><p class="sub">Fernando Caicedo · Esteban Caicedo · Anthony Rosero · Esteban García<br>Pontificia Universidad Católica del Ecuador · Emprendimiento Tecnológico</p></div>' +
        '<div class="card"><h3>Datos y privacidad</h3><p class="sub">Tus contactos, lugares, historial y ubicación se guardan solo en este teléfono. Los avisos salen por SMS o WhatsApp desde tu teléfono. No hay cuentas ni servidores propios. Detalles en Más › Privacidad y datos.</p>' +
        '<p class="sub">Las estaciones y los tiempos son aproximados y referenciales; no son datos oficiales ni en tiempo real.</p></div>' +
        '<div class="card"><h3>Créditos de código abierto</h3><p class="sub">Mapas © colaboradores de OpenStreetMap (ODbL). Biblioteca de mapas Leaflet (BSD-2). Búsqueda de direcciones: Nominatim. Rutas a pie: OSRM / FOSSGIS (routing.openstreetmap.de).</p></div>';
    }
  };

  /* ---------------- Demostración: viaje simulado de 1 minuto; los avisos pueden llegar por SMS a un celular de prueba ---------------- */
  var Demo = {
    it: null, tick: 0, total: 66, jury: '', sms: 0, timer: null, msgs: [], status: '', paused: false, startAt: 0, legStarts: [], names: null,
    build: function () {
      var o = { name: 'Casa (El Recreo)', lat: -0.2516, lon: -78.5226 };
      var d = { name: 'Colegio (La Carolina)', lat: -0.1827, lon: -78.4845 };
      var r = P.plan(o, d);
      this.it = r && r[0] ? r[0] : null;
      if (!this.it) return;
      var legs = this.it.legs, w = legs.map(function (l) { return Math.max(4, l.min + (l.waitMin || 0)); });
      var sum = w.reduce(function (a, b) { return a + b; }, 0), acc = 0;
      this.legStarts = legs.map(function (l, i) { var s = Math.round(acc / sum * Demo.total); acc += w[i]; return s; });
      this.names = { st: firstName(S.profile.studentName || S.profile.name) || 'Daniela' };
    },
    reset: function () {
      this.stop();
      this.tick = 0; this.msgs = []; this.sms = 0; this.status = 'Listo para empezar'; this.paused = false;
      this.startAt = new Date().setHours(6, 50, 0, 0);
    },
    stop: function () { if (this.timer) { clearInterval(this.timer); this.timer = null; } },
    clock: function () { return this.startAt + this.tick / this.total * this.it.totalMin * 60000; },
    say: function (text, sms) {
      this.msgs.push({ t: this.clock(), text: text, sms: !!(sms && this.jury) });
      // Aviso real al celular de quien hace de mamá o papá (solo en el teléfono, con permiso de SMS)
      if (sms && this.jury && IS_NATIVE) {
        Demo.sms++;
        Bridge.sendSms([this.jury], text + ' (SafeGo, demostración)', function (res) {
          if (!res || !res.ok) toast('No se pudo enviar el SMS de la demostración', 3000);
        });
      }
    },
    pointAt: function (pts, f) {
      if (pts.length < 2) return pts[0];
      var seg = [], tot = 0, i;
      for (i = 0; i < pts.length - 1; i++) { var d = P.distKm({ lat: pts[i][0], lon: pts[i][1] }, { lat: pts[i + 1][0], lon: pts[i + 1][1] }); seg.push(d); tot += d; }
      var target = f * tot;
      for (i = 0; i < seg.length; i++) {
        if (target <= seg[i] || i === seg.length - 1) {
          var k = seg[i] ? Math.min(1, target / seg[i]) : 0;
          return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
        }
        target -= seg[i];
      }
      return pts[pts.length - 1];
    },
    legAt: function (tick) { var idx = 0; for (var i = 0; i < this.legStarts.length; i++) if (tick >= this.legStarts[i]) idx = i; return idx; },
    step: function () {
      if (!demoActive()) { this.stop(); return; }
      if (this.tick >= this.total) { this.finish(); return; }
      var legs = this.it.legs, st = this.names.st;
      var prev = this.tick;
      this.tick++;
      var idx = this.legAt(this.tick), leg = legs[idx];
      var end = idx + 1 < legs.length ? this.legStarts[idx + 1] : this.total;
      var f = Math.min(1, (this.tick - this.legStarts[idx]) / Math.max(1, end - this.legStarts[idx]));
      var p = this.pointAt(leg.points, f);
      Map.setMe(p[0], p[1], 15);
      if (Map.map) Map.map.panTo(p, { animate: true, duration: 0.5 });
      // eventos de aviso a la familia
      if (prev === 0) this.say(st + ' salió de ' + this.it.origin.name + ' hacia ' + this.it.dest.name + '. Llegada estimada: ' + hhmm(this.startAt + this.it.totalMin * 60000) + '.');
      if (this.legStarts[idx] === this.tick || (prev < this.legStarts[idx] && this.tick >= this.legStarts[idx])) {
        var firstRide = !legs.slice(0, idx).some(function (l) { return l.kind !== 'walk'; });
        if (leg.kind === 'ride') {
          this.say(firstRide ?
            st + ' subió al ' + (leg.fullShort || leg.short) + ' en ' + P.cleanName(leg.from.name) + ', hacia ' + P.cleanName(leg.to.name) + '.' :
            st + ' hizo transbordo en ' + P.cleanName(leg.from.name) + ': ahora va en ' + (leg.fullShort || leg.short) + ' hacia ' + P.cleanName(leg.to.name) + '.', true);
          this.status = 'En ' + (leg.fullShort || leg.short) + ' · baja en ' + P.cleanName(leg.to.name);
        } else if (leg.kind === 'bus') {
          this.say(firstRide ? st + ' subió a un bus hacia ' + leg.to.name + '.' : st + ' hizo transbordo: ahora va en bus hacia ' + leg.to.name + '.', true);
          this.status = 'En bus hacia ' + leg.to.name;
        } else {
          this.status = 'Camina hacia ' + P.cleanName(leg.to.name);
          if (idx > 0) this.say(st + ' bajó y camina hacia ' + P.cleanName(leg.to.name) + '.');
        }
      }
      if (leg.kind === 'ride' && f >= 0.85 && !leg._warned && idx < legs.length - 1) {
        leg._warned = true;
        Bridge.vibrate && Bridge.vibrate(200);
        toast('Prepárate: bájate en ' + P.cleanName(leg.to.name), 3000);
      }
      updateDemoPanel();
      if (this.tick >= this.total) this.finish();
    },
    finish: function () {
      this.stop();
      this.say(this.names.st + ' llegó bien a ' + this.it.dest.name + ' a las ' + hhmm(this.clock()) + '.', true);
      this.status = 'Llegó a ' + this.it.dest.name;
      this.it.legs.forEach(function (l) { delete l._warned; });
      updateDemoPanel();
    },
    start: function () {
      if (!this.it) return;
      if (this.tick >= this.total || !this.tick) this.reset();
      this.paused = false; this.stop();
      this.timer = setInterval(function () { Demo.step(); }, 900);
      this.step();
    },
    pause: function () { this.paused = true; this.stop(); updateDemoPanel(); }
  };
  function demoActive() { return stack.length && stack[stack.length - 1] === 'demo'; }
  function demoPanelHtml() {
    var D_ = Demo;
    if (!D_.it) return '<div class="card warn"><b>No se pudo armar el viaje de ejemplo.</b></div>';
    var pct = Math.round(D_.tick / D_.total * 100), running = !!D_.timer, done = D_.tick >= D_.total;
    var h = '<div class="row between"><div><div class="sub small">Hora simulada</div><div style="font-size:24px;font-weight:800">' + hhmm(D_.clock()) + '</div></div>' +
      '<span class="pill ' + (done ? 'ok' : 'mode metro') + '">' + (done ? 'Llegó' : running ? 'En camino' : 'Demostración') + '</span></div>' +
      '<div class="progress" style="margin:10px 0"><div style="width:' + pct + '%"></div></div>' +
      '<div class="sub small" style="margin-bottom:8px">' + esc(D_.status) + '</div>';
    h += '<div class="row" style="gap:8px;margin-bottom:10px">' +
      (running ? '<button class="btn block" id="demoPause">Pausar</button>' : '<button class="btn block" id="demoGo">' + icon('play') + (D_.tick && !done ? 'Continuar' : done ? 'Repetir' : 'Iniciar viaje de ejemplo') + '</button>') +
      (D_.tick ? '<button class="btn btn-light" id="demoReset">Reiniciar</button>' : '') + '</div>';
    if (!D_.tick || done) {
      h += '<div class="card flat" style="margin:0 0 10px"><b>¿A qué celular quieres enviar los avisos de prueba?</b><div class="sub small" style="margin:4px 0 8px">Escribe el celular de tu mamá, papá o de quien quieras que reciba por SMS los avisos de «subió», «hizo transbordo» y «llegó» (unos 3 o 4 SMS). Déjalo vacío para ver los avisos solo en pantalla. El número no se guarda.</div>' +
        '<input class="input" id="demoJury" type="tel" inputmode="tel" placeholder="Ej.: 0991234567" value="' + esc(D_.jury) + '"></div>';
    }
    h += '<b>Lo que recibe la familia</b>';
    if (!D_.msgs.length) h += '<p class="sub small">Aquí aparecerán los avisos: al salir, en cada transbordo y al llegar.</p>';
    D_.msgs.slice().reverse().forEach(function (m) {
      h += '<div class="card ok" style="margin:6px 0;padding:10px"><div class="sub small">' + hhmm(m.t) + ' · aviso de SafeGo' + (m.sms ? ' · enviado por SMS' : '') + '</div><div>' + esc(m.text) + '</div></div>';
    });
    h += '<p class="sub small" style="margin-top:8px">Simulación de un viaje (Casa → Colegio) en 1 minuto. No usa tu GPS. SafeGo avisa solo en los momentos que importan: sin seguir al estudiante en el mapa.</p>';
    return h;
  }
  function updateDemoPanel() {
    var p = $('#demoPanel');
    if (!p) return;
    var top = p.scrollTop;
    p.innerHTML = demoPanelHtml();
    p.scrollTop = top;
    bindDemo(p);
  }
  function bindDemo(root) {
    var g = $('#demoGo', root), pz = $('#demoPause', root), r = $('#demoReset', root);
    if (g) g.onclick = function () {
      var j = $('#demoJury', root);
      var num = j ? j.value.trim() : '';
      if (num && !validPhone(num)) { toast('Revisa el número del celular'); return; }
      Demo.jury = num ? normalizePhone(num) : '';
      if (Demo.jury && IS_NATIVE && !Bridge.permissions().sms) {
        Bridge.requestPermissions(['sms'], function () {
          if (!Bridge.permissions().sms) { toast('Sin permiso de SMS: los avisos se verán solo en pantalla', 3500); Demo.jury = ''; }
          Demo.start();
        });
        return;
      }
      Demo.start();
    };
    if (pz) pz.onclick = function () { Demo.pause(); };
    if (r) r.onclick = function () { Demo.reset(); if (Demo.it) { Map.setMe(Demo.it.origin.lat, Demo.it.origin.lon, 15); } updateDemoPanel(); };
  }
  VIEWS.demo = {
    sub: true, tab: 'home', full: true,
    title: function () { return 'Demostración'; },
    html: function () {
      if (!Demo.it) Demo.build();
      if (!Demo.tick && !Demo.timer) Demo.reset();
      return '<div class="map-slot" style="min-height:220px"></div><div class="panel" id="demoPanel">' + demoPanelHtml() + '</div>';
    },
    bind: function (root) { bindDemo(root); },
    onMap: function () {
      Map.clear('pins');
      if (!Demo.it) return;
      Map.drawItinerary(Demo.it, 'route');
      var loc = Demo.it.legs[Demo.tick ? Demo.legAt(Demo.tick) : 0].points[0];
      Map.setMe(loc[0], loc[1], 15);
    }
  };
  /* ---------------- Pruebas reales: avisos a tiempo, batería y Metro ---------------- */
  function testStats() {
    var hs = S.history;
    var done = hs.filter(function (r) { return r.status === 'llegó'; });
    var withBat = done.filter(function (r) { return typeof r.battery === 'number' && r.actualMin > 0; });
    var batTrip = withBat.length ? withBat.reduce(function (a, r) { return a + r.battery; }, 0) / withBat.length : null;
    var batHour = withBat.length ? withBat.reduce(function (a, r) { return a + r.battery / r.actualMin * 60; }, 0) / withBat.length : null;
    return {
      trips: hs.length, arrived: done.length,
      auto: done.filter(function (r) { return r.autoArrival; }).length,
      onTime: done.filter(function (r) { return r.onTime; }).length,
      notices: hs.reduce(function (a, r) { return a + (r.autoNotices || 0); }, 0),
      metro: hs.reduce(function (a, r) { return a + (r.metroGaps || 0); }, 0),
      batTrip: batTrip, batHour: batHour, batN: withBat.length
    };
  }
  function round1(n) { return Math.round(n * 10) / 10; }
  function testReport() {
    var st = testStats();
    var lines = ['Pruebas de SafeGo (' + fmtDate(Date.now()) + ')',
      'Viajes: ' + st.trips + ' · llegaron: ' + st.arrived + ' · a tiempo: ' + st.onTime,
      'Llegada detectada sola (sin tocar «Llegué»): ' + st.auto + ' de ' + st.arrived,
      'Avisos automáticos enviados a la familia: ' + st.notices,
      'Tramos en el Metro sin GPS: ' + st.metro,
      'Batería: ' + (st.batTrip === null ? 'sin datos' : round1(st.batTrip) + ' % por viaje, ' + round1(st.batHour) + ' % por hora (' + st.batN + ' viajes)'),
      '', 'fecha;origen;destino;estado;min_estimados;min_reales;a_tiempo;llegada_auto;avisos_auto;bateria_%;metro_sin_gps'];
    S.history.forEach(function (r) {
      lines.push([fmtDate(r.startedAt), r.origin, r.dest, r.status, r.plannedMin, r.actualMin, r.onTime ? 'sí' : 'no',
        r.autoArrival ? 'sí' : 'no', r.autoNotices || 0, typeof r.battery === 'number' ? r.battery : '', r.metroGaps || 0].join(';'));
    });
    return lines.join('\n');
  }
  VIEWS.tests = {
    sub: true,
    title: function () { return 'Pruebas reales'; },
    html: function () {
      var st = testStats();
      var big = function (n, label) { return '<div class="card flat" style="margin:0;text-align:center"><div style="font-size:26px;font-weight:800;color:var(--primary)">' + n + '</div><div class="sub small">' + label + '</div></div>'; };
      var h = '<p class="sub">Haz viajes reales con la app (por ejemplo, PUCE → El Recreo con transbordo en el Trole). Aquí ves cuántos avisos salieron solos, cuántos viajes llegaron a tiempo y cuánta batería gastó cada uno. Puedes compartir los resultados con quien quieras.</p>' +
        '<div class="grid2" style="gap:8px;margin:10px 0">' +
        big(st.arrived + '/' + st.trips, 'viajes que llegaron') +
        big(st.auto + '/' + st.arrived, 'llegadas detectadas solas') +
        big(st.notices, 'avisos automáticos') +
        big(st.batTrip === null ? '–' : round1(st.batTrip) + ' %', 'batería por viaje') + '</div>' +
        '<div class="card flat"><p class="sub small" style="margin:0">A tiempo: ' + st.onTime + ' de ' + st.arrived + ' · Tramos en el Metro sin GPS: ' + st.metro +
        (st.batHour !== null ? ' · ' + round1(st.batHour) + ' % de batería por hora' : '') + '</p></div>';
      if (!S.history.length) h += '<div class="empty">' + icon('history') + '<p>Aún no hay viajes. Planifica uno y toca «Iniciar viaje».</p></div>';
      else {
        h += '<h2>Viajes</h2><div class="card list">';
        S.history.slice(0, 50).forEach(function (r) {
          h += '<div class="item"><div class="grow"><b>' + esc(r.origin) + ' → ' + esc(r.dest) + '</b><div class="sub small">' + fmtDate(r.startedAt) + ' · ' + r.actualMin + ' min · ' +
            (r.status === 'llegó' ? (r.autoArrival ? 'llegada detectada sola' : 'llegada marcada a mano') : 'cancelado') +
            ' · ' + (r.autoNotices || 0) + ' aviso(s)' + (typeof r.battery === 'number' ? ' · batería −' + r.battery + ' %' : '') + (r.metroGaps ? ' · Metro sin GPS' : '') + '</div></div></div>';
        });
        h += '</div>';
      }
      return h + '<button class="btn block" id="shareTests" style="margin-top:10px">' + icon('share') + 'Compartir resultados</button>';
    },
    bind: function (root) { $('#shareTests', root).onclick = function () { Bridge.share(testReport()); }; }
  };

  /* ---------------- Privacidad de menores (LOPDP) ---------------- */
  var PRIVACY_URL = 'https://juanfercaicedo.github.io/SafeGO/privacidad/';
  VIEWS.privacy = {
    sub: true,
    title: function () { return 'Privacidad y datos'; },
    html: function () {
      var days = +S.settings.autoDeleteDays || 0;
      var sel = '<select class="input" id="pvDays" style="width:auto;min-height:40px;padding:6px 10px">' +
        [[7, '7 días'], [30, '30 días'], [90, '90 días'], [0, 'Nunca']].map(function (o) { return '<option value="' + o[0] + '" ' + (o[0] === days ? 'selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>';
      return '<div class="card hero"><h3 style="color:#fff">Tú decides qué se comparte</h3><p class="sub">SafeGo avisa a la familia por SMS en los momentos que importan y, al iniciar un viaje, le envía el enlace para seguirlo en vivo. Solo durante el viaje.</p></div>' +
        '<div class="card"><h3>Qué datos usamos</h3><p class="sub">La ubicación del teléfono, solo durante un viaje que el estudiante inicia. Los nombres y teléfonos de los contactos de confianza, los lugares guardados y el historial de viajes.</p></div>' +
        '<div class="card"><h3>Dónde se guardan</h3><p class="sub">Solo en este teléfono. No hay cuentas ni servidores de SafeGo, y los avisos salen por SMS desde este teléfono. El seguimiento en vivo se comparte durante cada viaje y viaja cifrado (AES-GCM) por ntfy.sh, que lo borra a las pocas horas; solo la familia tiene la clave. Se puede apagar en Familia.</p></div>' +
        '<div class="card"><h3>Consentimiento</h3><p class="sub">La ubicación de menores de edad es un dato sensible según la Ley Orgánica de Protección de Datos Personales del Ecuador. Los avisos automáticos solo se activan si el estudiante acepta en su propio teléfono y, si es menor de 18 años, con autorización de su representante. Se puede retirar en cualquier momento en Ajustes.</p>' +
        '<p class="sub small">Estado: ' + (consentOk() && S.consent ? 'aceptado el ' + fmtDate(S.consent.at) : (S.role === 'familia' ? 'modo familia' : 'no aceptado; tú envías cada mensaje')) + '</p></div>' +
        '<div class="card list"><div class="item"><div class="grow"><b>Borrar historial automáticamente</b><div class="sub small">Los viajes más antiguos se eliminan solos</div></div>' + sel + '</div></div>' +
        '<button class="btn btn-light block" id="pvPolicy">' + icon('book') + 'Ver la política de privacidad completa</button>' +
        '<button class="btn btn-ghost block" id="pvReset" style="margin-top:8px;color:var(--primary)">' + icon('trash') + 'Borrar todos mis datos</button>';
    },
    bind: function (root) {
      $('#pvDays', root).onchange = function (e) {
        S.settings.autoDeleteDays = +e.target.value;
        var days = S.settings.autoDeleteDays;
        if (days > 0) { var lim = Date.now() - days * 86400000; S.history = S.history.filter(function (r) { return (r.startedAt || 0) >= lim; }); }
        save(); toast('Guardado');
      };
      $('#pvPolicy', root).onclick = function () { Bridge.openUrl(PRIVACY_URL); };
      $('#pvReset', root).onclick = function () {
        openSheet({
          html: '<h3>¿Borrar todo?</h3><p class="sub">Se eliminarán contactos, lugares, historial y ajustes de este teléfono.</p><button class="btn block" id="y">Borrar todo</button><button class="btn btn-ghost block" data-close style="margin-top:8px">Cancelar</button>',
          bind: function (r) {
            $('#y', r).onclick = function () {
              if (S.trip) Trip.cancel();
              S = defaultState(); onbStep = 0; save(true); closeSheet(); stack = []; currentTab = 'home'; render();
            };
          }
        });
      };
    }
  };
  /* ---------------- Ciclo de vida ---------------- */
  function onResume() {
    Trip.restore();
    if (currentTab === 'trip' && !stack.length && S.trip) updateTripPanel(); else if (!sheetOpen) render();
  }

  function init() {
    S = loadState();
    // Ajustes de compatibilidad para estados antiguos
    if (!S.settings.channel) S.settings.channel = DEFAULT_SETTINGS.channel;
    if (S.trip && (!S.trip.itinerary || !S.trip.dest)) S.trip = null;
    onbDraft.role = S.role;
    render();
    if (S.onboarded && !(S.tutorial && S.tutorial.v >= TUTORIAL_VERSION)) Tutorial.start();
    else if (S.onboarded && S.role !== 'familia' && S.consent && S.consent.v !== CONSENT_VERSION) {
      // Cambió lo que se comparte (ubicación en vivo): se vuelve a preguntar
      setTimeout(function () { openSheet(consentSheet()); }, 600);
    }
    Live.sync();
    Trip.restore();
    if (S.trip && S.trip.status === 'running') render();
    // Refresca el panel del viaje cada 30 s (hora, retraso)
    setInterval(function () {
      if (S.trip && currentTab === 'trip' && !stack.length) updateTripPanel();
    }, 30000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) onResume(); });
  }

  window.addEventListener('error', function (e) { console.error('Error global', e.message); });
  try { init(); } catch (e) {
    console.error(e);
    document.getElementById('view').innerHTML = '<div class="card warn"><h3>No se pudo iniciar</h3><p>' + esc(e.message) + '</p></div>';
  }
})();
