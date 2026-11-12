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

