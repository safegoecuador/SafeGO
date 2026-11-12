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

