  /* ---------------- Mensajes ---------------- */
  function who() {
    var n = S.role === 'familia' ? (S.profile.studentName || S.profile.name) : S.profile.name;
    return firstName(n) || 'El estudiante';
  }
  var Msg = {
    start: function (t) {
      return who() + ' salió de ' + t.origin.name + ' hacia ' + t.dest.name + '. Llegada estimada: ' + hhmm(t.expectedAt) +
        '. Ruta: ' + routeSummary(t.itinerary) + '. (SafeGo)';
    },
    boarding: function (a) {
      return who() + ' está en la estación ' + a.name + ' y toma el ' + a.short + ' hacia ' + a.toward + ' ({hora}). (SafeGo)';
    },
    nearStop: function (a) {
      return who() + ' está por bajar en ' + P.cleanName(a.name) + ' ({hora}). (SafeGo)';
    },
    nearDest: function (destName) {
      return who() + ' está cerca de ' + destName + ' y llegará en unos minutos ({hora}). (SafeGo)';
    },
    arrival: function (destName) { return who() + ' llegó bien a ' + destName + ' a las {hora}. (SafeGo)'; },
    late: function (t) { return 'Aviso: ' + who() + ' aún no llega a ' + t.dest.name + ' (llegada esperada ' + hhmm(t.expectedAt) + '). Última ubicación: {link} (SafeGo)'; },
    delay: function (t, extraMin) {
      var dest = t ? t.dest.name : 'su destino';
      // En un viaje activo, expectedAt ya incluye el retraso informado
      var eta = t ? hhmm(t.expectedAt) : hhmm(Date.now() + extraMin * 60000);
      return who() + ' va con retraso hacia ' + dest + '. Nueva hora estimada: ' + eta + '. Todo bien. (SafeGo)';
    },
    ok: function (link, legName) { return who() + ' está bien' + (legName ? ', va en ' + legName : '') + '.' + (link ? ' Ubicación: ' + link : '') + ' (SafeGo)'; },
    sos: function () { return 'EMERGENCIA: ' + who() + ' necesita ayuda. Ubicación: {link} (precisión {precision} m) a las {hora}. Llama o pide ayuda al 911. (SafeGo)'; },
    location: function (link) { return 'Ubicación de ' + who() + ' a las ' + hhmm(Date.now()) + ': ' + link + ' (SafeGo)'; }
  };
  function fill(text, vars) {
    return text.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; });
  }
  function routeSummary(it) {
    if (!it) return '';
    return it.legs.filter(function (l) { return l.kind !== 'walk'; }).map(function (l) {
      return l.kind === 'ride' ? (l.fullShort || l.short) + ' de ' + P.cleanName(l.from.name) + ' a ' + P.cleanName(l.to.name) : 'bus hacia ' + l.to.name;
    }).join(', ') || 'a pie';
  }

  /* Envía un aviso por el canal configurado. auto=true intenta SMS sin intervención. */
  function sendNotice(text, opts) {
    opts = opts || {};
    var contacts = S.contacts.filter(function (c) { return c.phone; });
    if (!contacts.length) {
      openSheet(noContactsSheet());
      return;
    }
    var ch = S.settings.channel;
    var perms = Bridge.permissions();
    var smsOk = IS_NATIVE && perms.sms;
    var openWa = function () {
      if (contacts.length === 1) Bridge.whatsapp(contacts[0].phone, text);
      else openSheet(whatsappPickerSheet(text, false));
    };
    if (ch !== 'whatsapp' && smsOk) {
      // SMS automático; si falla, WhatsApp como respaldo
      Bridge.sendSms(contacts.map(function (c) { return c.phone; }), text, function (res) {
        if (res && res.ok) { toast('Aviso enviado por SMS a ' + contacts.length + (contacts.length === 1 ? ' contacto' : ' contactos')); S.stats.manualNotices++; save(); }
        else { toast('No se pudo enviar el SMS. Abriendo WhatsApp…'); openWa(); }
      });
    } else {
      openWa();
    }
    logNotice(opts.kind || 'aviso', text);
  }
  function logNotice(kind, text, auto) {
    if (S.trip) { S.trip.notices = S.trip.notices || []; S.trip.notices.push({ t: Date.now(), kind: kind, text: text, auto: !!auto }); save(); }
  }
  function whatsappPickerSheet(text, alsoSms) {
    var html = '<h3>Enviar por WhatsApp</h3><p class="sub">' + (alsoSms ? 'El SMS ya salió. ' : '') +
      'Toca cada contacto para abrir WhatsApp con el mensaje listo.</p><div class="list">';
    S.contacts.forEach(function (c, i) {
      html += '<div class="item"><div class="ic">' + icon('msg') + '</div><div class="grow"><b>' + esc(c.name) + '</b><div class="sub small">' + esc(c.relation || '') + '</div></div>' +
        '<button class="btn btn-wa sm" data-wa="' + i + '">WhatsApp</button></div>';
    });
    html += '</div><button class="btn btn-ghost block" data-wa="group" style="margin-top:8px">Elegir chat o grupo familiar</button>' +
      '<div class="kbd" style="margin-top:12px">' + esc(text) + '</div>' +
      '<button class="btn btn-light block" data-close style="margin-top:12px">Listo</button>';
    return {
      html: html, bind: function (root) {
        $$('[data-wa]', root).forEach(function (b) {
          b.onclick = function () {
            var v = b.getAttribute('data-wa');
            if (v === 'group') Bridge.whatsapp('', text);
            else Bridge.whatsapp(S.contacts[+v].phone, text);
            b.classList.add('btn-ok'); b.classList.remove('btn-wa');
          };
        });
      }
    };
  }
  function transferNoticeSheet(text) {
    return {
      html: '<h3>Avisa a tu familia</h3><p class="sub">Un toque y WhatsApp abre el mensaje listo.</p><div class="kbd">' + esc(text) + '</div>' +
        '<button class="btn btn-wa block" id="tnWa" style="margin-top:12px">' + icon('msg') + 'Enviar por WhatsApp</button>' +
        '<button class="btn btn-ghost block" data-close style="margin-top:8px">Ahora no</button>',
      bind: function (root) {
        $('#tnWa', root).onclick = function () {
          closeSheet();
          logNotice('transbordo', text);
          S.stats.manualNotices++; save();
          if (S.contacts.length === 1) Bridge.whatsapp(S.contacts[0].phone, text);
          else openSheet(whatsappPickerSheet(text, false));
        };
      }
    };
  }
  function noContactsSheet() {
    return {
      html: '<h3>Primero agrega a tu familia</h3><p class="sub">Necesitamos al menos un contacto de confianza para enviar los avisos.</p>' +
        '<button class="btn block" id="goAddContact">' + icon('plus') + 'Agregar contacto</button>',
      bind: function (root) { $('#goAddContact', root).onclick = function () { closeSheet(); openSheet(contactSheet(null)); }; }
    };
  }

