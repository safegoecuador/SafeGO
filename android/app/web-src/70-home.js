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

