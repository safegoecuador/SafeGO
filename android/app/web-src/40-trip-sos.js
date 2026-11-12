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

