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
