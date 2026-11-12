  /* ---------------- Familia / contactos ---------------- */
  VIEWS.family = {
    title: function () { return 'Familia y avisos'; },
    html: function () {
      var h = '<h1>Contactos de confianza</h1><p class="sub">Reciben los avisos de salida, retraso, llegada y SOS.</p><div class="card list">';
      if (!S.contacts.length) h += '<div class="empty">' + icon('users') + '<p>Aún no tienes contactos.</p></div>';
      S.contacts.forEach(function (c, i) {
        h += '<div class="item"><div class="ic">' + icon('users') + '</div><div class="grow"><b>' + esc(c.name) + '</b><div class="sub small">' + esc(c.relation || 'Contacto') + ' · ' + esc(c.phone) + '</div></div>' +
          '<button class="icon-btn" data-edit="' + i + '" aria-label="Editar">' + icon('edit') + '</button></div>';
      });
      h += '</div><button class="btn block" id="addC">' + icon('plus') + 'Agregar contacto</button>';
      var ch = S.settings.channel;
      var perms = Bridge.permissions();
      h += '<h2>¿Cómo enviamos los avisos?</h2><div class="card list">' +
        radioItem('channel', 'sms', ch === 'ambos' ? 'sms' : ch, 'SMS automático (recomendado)', 'Sale solo, sin sacar el celular. Si falla, abrimos WhatsApp. Usa tu saldo de SMS.') +
        radioItem('channel', 'whatsapp', ch, 'WhatsApp', 'Abre WhatsApp con el mensaje listo; tú tocas enviar.') + '</div>';
      if (IS_NATIVE && !perms.sms && ch !== 'whatsapp') {
        h += '<div class="card warn"><b>Falta el permiso de SMS</b><p class="sub small">Sin él, los avisos se enviarán por WhatsApp.</p><button class="btn sm" id="permSms">Dar permiso</button></div>';
      }
      h += '<button class="btn btn-light block" id="testMsg">' + icon('msg') + 'Enviar mensaje de prueba</button>';
      h += liveCardHtml();
      if (S.role === 'familia') h += '<h2>En vivo</h2><div class="card list">' + navItem('live', 'nav', 'Ver en vivo', 'Sigue su viaje en el mapa en tiempo real.') + '</div>';
      h += '<h2>Sincronizar con la familia</h2><div class="card list">' +
        navItem('setup', 'key', S.role === 'familia' ? 'Crear código para el estudiante' : 'Compartir mi configuración', 'Contactos y lugares en un código para pegar en otro teléfono.') +
        '<div class="item" id="importBtn" role="button"><div class="ic">' + icon('key') + '</div><div class="grow"><b>Importar un código</b><div class="sub small">Pega el código que te enviaron.</div></div><div class="chev">' + icon('chev') + '</div></div></div>';
      return h;
    },
    bind: function (root) {
      $('#addC', root).onclick = function () { openSheet(contactSheet(null)); };
      $$('[data-edit]', root).forEach(function (b) { b.onclick = function () { openSheet(contactSheet(+b.getAttribute('data-edit'))); }; });
      $$('[data-radio="channel"]', root).forEach(function (el) {
        el.onclick = function () {
          S.settings.channel = el.getAttribute('data-value'); save();
          if (S.settings.channel !== 'whatsapp' && IS_NATIVE && !Bridge.permissions().sms) Bridge.requestPermissions(['sms'], function () { render(); });
          render();
        };
      });
      var ps = $('#permSms', root);
      if (ps) ps.onclick = function () { Bridge.requestPermissions(['sms'], function () { render(); }); };
      $('#testMsg', root).onclick = function () { sendNotice('Mensaje de prueba de SafeGo: así te llegarán los avisos de ' + who() + '.', { kind: 'prueba' }); };
      $$('[data-nav]', root).forEach(function (b) { b.onclick = function () { push(b.getAttribute('data-nav')); }; });
      $('#importBtn', root).onclick = function () { openSheet(importSheet(false)); };
      bindLiveCard(root);
    }
  };
  function radioItem(group, value, current, title, sub) {
    var on = value === current;
    return '<div class="item" data-radio="' + group + '" data-value="' + value + '" role="radio" aria-checked="' + on + '"><div class="ic" style="' + (on ? 'background:var(--primary);color:#fff' : '') + '">' +
      icon(on ? 'check' : 'msg') + '</div><div class="grow"><b>' + esc(title) + '</b><div class="sub small">' + esc(sub) + '</div></div></div>';
  }
  function contactSheet(idx) {
    var c = idx === null ? { name: '', phone: '', relation: '' } : S.contacts[idx];
    var html = '<h3>' + (idx === null ? 'Nuevo contacto' : 'Editar contacto') + '</h3>' +
      '<label class="field"><span>Nombre</span><input class="input" id="ccName" maxlength="40" value="' + esc(c.name) + '" placeholder="Ej.: Mamá"></label>' +
      '<label class="field"><span>Celular</span><input class="input" id="ccPhone" type="tel" inputmode="tel" maxlength="20" value="' + esc(c.phone) + '" placeholder="09xxxxxxxx o +593…"></label>' +
      '<label class="field"><span>Relación</span><input class="input" id="ccRel" maxlength="30" value="' + esc(c.relation || '') + '" placeholder="Ej.: Madre, Padre, Tío"></label>' +
      '<button class="btn block" id="ccSave">Guardar</button>' +
      (idx !== null ? '<button class="btn btn-ghost block" id="ccDel" style="margin-top:8px;color:var(--primary)">' + icon('trash') + 'Eliminar</button>' : '') +
      '<button class="btn btn-ghost block" data-close style="margin-top:8px">Cancelar</button>';
    return {
      html: html, bind: function (root) {
        $('#ccSave', root).onclick = function () {
          var n = $('#ccName', root).value.trim(), p = $('#ccPhone', root).value.trim(), r = $('#ccRel', root).value.trim();
          if (!n) { toast('Escribe un nombre'); return; }
          if (!validPhone(p)) { toast('Revisa el número (ej.: 0991234567)'); return; }
          if (idx === null) S.contacts.push({ id: uid(), name: n, phone: p, relation: r });
          else { S.contacts[idx].name = n; S.contacts[idx].phone = p; S.contacts[idx].relation = r; }
          save(); closeSheet(); render(); toast('Contacto guardado');
        };
        var del = $('#ccDel', root);
        if (del) del.onclick = function () { S.contacts.splice(idx, 1); save(); closeSheet(); render(); toast('Contacto eliminado'); };
      }
    };
  }

  /* Código de configuración: comparte contactos y lugares sin servidor. */
  function makeCode(includeSelf) {
    var data = {
      v: 1,
      s: S.role === 'familia' ? S.profile.studentName : S.profile.name,
      c: S.contacts.map(function (c) { return [c.name, c.phone, c.relation || '']; }),
      p: S.places.map(function (p) { return [p.name, +p.lat.toFixed(5), +p.lon.toFixed(5), p.kind || 'otro']; }),
      t: S.settings.toleranceMin
    };
    if (S.role === 'familia') { var ch = Live.setupChannel(); data.l = [ch.topic, ch.key]; }
    var json = JSON.stringify(data);
    return 'TS1:' + btoa(unescape(encodeURIComponent(json)));
  }
  function readCode(code) {
    var m = String(code || '').match(/TS1:([A-Za-z0-9+/=]+)/);
    if (!m) throw new Error('Código no válido');
    var data = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
    if (!data || data.v !== 1) throw new Error('Versión de código no compatible');
    return data;
  }
  function applyCode(data) {
    var added = 0;
    (data.c || []).forEach(function (c) {
      if (!c[0] || !validPhone(c[1])) return;
      if (S.contacts.some(function (x) { return normalizePhone(x.phone) === normalizePhone(c[1]); })) return;
      S.contacts.push({ id: uid(), name: String(c[0]).slice(0, 40), phone: String(c[1]).slice(0, 20), relation: String(c[2] || '').slice(0, 30) });
      added++;
    });
    var addedP = 0;
    (data.p || []).forEach(function (p) {
      if (!p[0] || !isFinite(p[1]) || !isFinite(p[2])) return;
      if (S.places.some(function (x) { return x.name === p[0]; })) return;
      S.places.push({ id: uid(), name: String(p[0]).slice(0, 40), lat: +p[1], lon: +p[2], kind: p[3] || 'otro' });
      addedP++;
    });
    if (data.t) S.settings.toleranceMin = +data.t || S.settings.toleranceMin;
    // Canal en vivo creado por la familia: el estudiante publica ahí (si acepta compartir)
    if (data.l && Live.validChannel(data.l[0], data.l[1])) { S.live = { topic: data.l[0], key: data.l[1] }; Live.sync(); }
    return { contacts: added, places: addedP, student: data.s };
  }
  function importSheet(fromOnboarding) {
    return {
      html: '<h3>Importar configuración</h3><p class="sub">Pega el código que empieza con <b>TS1:</b></p>' +
        '<textarea class="input" id="codeIn" rows="4" placeholder="TS1:..."></textarea><button class="btn block" id="codeOk" style="margin-top:10px">Importar</button>' +
        '<button class="btn btn-ghost block" data-close style="margin-top:8px">Cancelar</button>',
      bind: function (root) {
        $('#codeOk', root).onclick = function () {
          try {
            var data = readCode($('#codeIn', root).value);
            var r = applyCode(data);
            if (fromOnboarding) {
              S.role = 'estudiante';
              if (data.s) S.profile.name = String(data.s).slice(0, 40);
              S.onboarded = !!S.profile.name;
              if (!S.onboarded) { onbDraft.role = 'estudiante'; onbStep = 2; }
            }
            save(true); closeSheet(); render();
            toast('Listo: ' + r.contacts + ' contacto(s) y ' + r.places + ' lugar(es) importados', 4000);
            if (fromOnboarding && S.onboarded) setTimeout(function () { openSheet(consentSheet(function () { render(); Tutorial.start(); })); }, 400);
          } catch (e) { toast(e.message || 'Código no válido'); }
        };
      }
    };
  }
  VIEWS.setup = {
    sub: true, tab: 'family',
    title: function () { return 'Configurar otro teléfono'; },
    html: function () {
      var code = makeCode();
      var st = firstName(S.profile.studentName) || 'el estudiante';
      return '<h1>' + (S.role === 'familia' ? 'Configura el teléfono de ' + esc(st) : 'Comparte tu configuración') + '</h1>' +
        '<ol class="sub" style="line-height:1.6;padding-left:20px"><li>Instala SafeGo en su teléfono.</li><li>Envíale este código por WhatsApp.</li><li>En su app: Bienvenida › «Tengo un código», o Familia › «Importar un código».</li><li>Su app le mostrará qué se comparte contigo y le pedirá aceptarlo. Sin su aceptación no se envían avisos automáticos.</li>' +
        (S.role === 'familia' ? '<li>Listo: en Inicio › «Ver en vivo» lo verás moverse en el mapa durante cada viaje.</li>' : '') + '</ol>' +
        '<div class="card"><div class="sub small">Incluye ' + S.contacts.length + ' contacto(s) y ' + S.places.length + ' lugar(es).</div><div class="kbd" style="margin-top:8px">' + esc(code) + '</div></div>' +
        (S.places.length ? '' : '<div class="card warn flat"><b>Sugerencia:</b> guarda primero «Casa» y su centro de estudios en Más › Mis lugares.</div>') +
        '<button class="btn btn-wa block" id="sendCode">' + icon('msg') + 'Enviar por WhatsApp</button>' +
        '<button class="btn btn-light block" id="copyCode" style="margin-top:8px">Copiar código</button>';
    },
    bind: function (root) {
      var code = makeCode();
      var msg = 'Configura SafeGo con este código (Familia › Importar un código):\n' + code;
      $('#sendCode', root).onclick = function () { Bridge.whatsapp('', msg); };
      $('#copyCode', root).onclick = function () { Bridge.copy(code); };
    }
  };
  VIEWS.howto = {
    sub: true, tab: 'home',
    title: function () { return 'Cómo llegan los avisos'; },
    html: function () {
      return '<h1>Así te enteras, sin llamar</h1>' +
        '<div class="card"><h3>1. Sale de casa</h3><p class="sub">Inicia el viaje en su app. Si lo activa, te llega «salió de Casa hacia el colegio, llega aprox. 7:40».</p></div>' +
        '<div class="card"><h3>2. En cada transbordo</h3><p class="sub">Cuando llega a la estación donde sube (o cambia de transporte) te llega «está en la estación El Recreo y toma el Metro hacia La Alameda». Además, su teléfono vibra antes de cada estación donde debe bajar.</p></div>' +
        '<div class="card"><h3>3. Llega</h3><p class="sub">Al entrar al área del centro de estudios, la app envía sola un SMS: «llegó bien a las 7:38». También puede mandarlo por WhatsApp.</p></div>' +
        '<div class="card warn"><h3>Si se retrasa</h3><p class="sub">Si pasan los minutos de tolerancia y no ha llegado, te llega un SMS con su última ubicación en el mapa.</p></div>' +
        '<div class="card"><h3>SOS</h3><p class="sub">Si mantiene presionado SOS, recibes su ubicación al instante y puede llamar al 911.</p></div>' +
        '<div class="card"><h3>En vivo</h3><p class="sub">Durante el viaje puedes abrir Inicio › «Ver en vivo» y verlo moverse en el mapa, con la hora del último punto, su destino y la hora estimada de llegada.</p></div>' +
        '<p class="sub small">Los avisos salen del teléfono del estudiante por SMS o WhatsApp. La ubicación en vivo viaja cifrada por ntfy.sh (servicio libre, sin cuentas) y se borra a las pocas horas; solo quien tiene el código puede verla.</p>';
    }
  };

