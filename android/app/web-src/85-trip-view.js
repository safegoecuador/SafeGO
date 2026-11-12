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

