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

