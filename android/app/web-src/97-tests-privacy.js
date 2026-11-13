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
  var PRIVACY_URL = 'https://safegoecuador.github.io/SafeGO/privacidad/';
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
