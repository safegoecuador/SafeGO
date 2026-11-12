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

