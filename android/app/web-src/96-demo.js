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
