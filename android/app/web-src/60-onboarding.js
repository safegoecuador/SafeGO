  /* ---------------- Bienvenida ---------------- */
  var onbStep = 0;
  var onbDraft = { role: 'estudiante', name: '', studentName: '', cName: '', cPhone: '', cRel: '' };
  VIEWS.onboarding = {
    title: function () { return 'Bienvenida'; },
    html: function () {
      var d = onbDraft;
      if (onbStep === 0) {
        return '<div class="onb"><div class="art"><div class="onb-logo"><img src="img/logo.webp" alt="SafeGo"></div>' +
          '<h1 style="margin-top:18px">Llega con más tranquilidad.</h1><p style="opacity:.92">Rutas de Bus, Trolebús, Ecovía y Metro de Quito en una sola pantalla, y tu familia te sigue en vivo hasta que llegas.</p></div>' +
          '<div class="card flat"><div class="row"><div class="ic" style="color:var(--primary)">' + icon('route', 'width="26" height="26"') + '</div><div><b>Rutas con transbordos</b><div class="sub small">Te avisamos antes de bajar y al cambiar de transporte.</div></div></div></div>' +
          '<div class="card flat"><div class="row"><div class="ic" style="color:var(--primary)">' + icon('bell', 'width="26" height="26"') + '</div><div><b>Aviso automático de llegada</b><div class="sub small">Tu familia sabe que llegaste sin tener que llamar.</div></div></div></div>' +
          '<div class="card flat"><div class="row"><div class="ic" style="color:var(--primary)">' + icon('shield', 'width="26" height="26"') + '</div><div><b>Botón SOS discreto</b><div class="sub small">Comparte tu ubicación sin sacar el celular por mucho tiempo.</div></div></div></div>' +
          '<button class="btn block" id="next">Empezar</button>' +
          '<button class="btn btn-ghost block" id="import">Tengo un código de configuración</button></div>';
      }
      if (onbStep === 1) {
        return '<div class="onb"><h1>¿Quién usará la app?</h1><p class="sub">Puedes cambiarlo luego en Ajustes.</p>' +
          '<button class="choice ' + (d.role === 'estudiante' ? 'sel' : '') + '" data-role="estudiante">' + icon('school') + '<div><b>Soy estudiante</b><div class="sub small">Viajo solo/a y quiero rutas claras y avisar al llegar.</div></div></button>' +
          '<button class="choice ' + (d.role === 'familia' ? 'sel' : '') + '" data-role="familia">' + icon('heart') + '<div><b>Soy madre, padre o representante</b><div class="sub small">Quiero planificar su ruta y recibir los avisos.</div></div></button>' +
          '<button class="btn block" id="next">Continuar</button></div>';
      }
      if (onbStep === 2) {
        var fam = d.role === 'familia';
        return '<div class="onb"><h1>' + (fam ? 'Cuéntanos de tu familia' : '¿Cómo te llamas?') + '</h1>' +
          '<label class="field"><span>' + (fam ? 'Tu nombre' : 'Tu nombre') + '</span><input class="input" id="fName" maxlength="40" value="' + esc(d.name) + '" placeholder="Ej.: Ana"></label>' +
          (fam ? '<label class="field"><span>Nombre del estudiante</span><input class="input" id="fStudent" maxlength="40" value="' + esc(d.studentName) + '" placeholder="Ej.: Mateo"></label>' : '') +
          '<p class="sub small">Solo se usa en los mensajes de aviso. Se guarda únicamente en este teléfono.</p>' +
          '<button class="btn block" id="next">Continuar</button></div>';
      }
      if (onbStep === 3) {
        var fam2 = d.role === 'familia';
        return '<div class="onb"><h1>' + (fam2 ? '¿A quién avisa ' + esc(firstName(d.studentName) || 'el estudiante') + '?' : '¿A quién avisamos cuando llegues?') + '</h1>' +
          '<p class="sub">' + (fam2 ? 'Pon tu número. Lo incluiremos en el código para configurar su teléfono.' : 'Agrega a tu mamá, papá o representante. Puedes añadir más después.') + '</p>' +
          '<label class="field"><span>Nombre</span><input class="input" id="cName" maxlength="40" value="' + esc(d.cName || (fam2 ? d.name : '')) + '" placeholder="Ej.: Mamá"></label>' +
          '<label class="field"><span>Celular</span><input class="input" id="cPhone" type="tel" inputmode="tel" maxlength="20" value="' + esc(d.cPhone) + '" placeholder="09xxxxxxxx"></label>' +
          '<label class="field"><span>Relación</span><input class="input" id="cRel" maxlength="30" value="' + esc(d.cRel || (fam2 ? 'Representante' : '')) + '" placeholder="Ej.: Madre"></label>' +
          '<button class="btn block" id="next">Continuar</button><button class="btn btn-ghost block" id="skip">Lo hago después</button></div>';
      }
      if (onbStep === 4 && d.role !== 'familia') return consentHtml(d.consent !== false, d.cName ? esc(firstName(d.cName)) : null);
      return '<div class="onb"><h1>Permisos para cuidarte</h1>' +
        '<div class="card flat"><b>' + icon('pin', 'width="18" height="18"') + ' Ubicación</b><p class="sub small">Para saber cuándo llegas y avisarte antes de bajar. Solo durante un viaje que tú inicias.</p></div>' +
        '<div class="card flat"><b>' + icon('bell', 'width="18" height="18"') + ' Notificaciones</b><p class="sub small">Para los avisos de transbordo y llegada, con vibración.</p></div>' +
        '<div class="card flat"><b>' + icon('msg', 'width="18" height="18"') + ' SMS (opcional)</b><p class="sub small">Para que el aviso de llegada salga solo, sin abrir WhatsApp. Usa tu saldo de SMS.</p></div>' +
        '<button class="btn block" id="perm">Permitir y terminar</button><button class="btn btn-ghost block" id="finish">Terminar sin permisos</button></div>';
    },
    bind: function (root) {
      var d = onbDraft;
      var next = $('#next', root);
      $$('[data-role]', root).forEach(function (b) { b.onclick = function () { d.role = b.getAttribute('data-role'); render(); }; });
      if (onbStep === 0) {
        next.onclick = function () { onbStep = 1; render(); };
        $('#import', root).onclick = function () { openSheet(importSheet(true)); };
      } else if (onbStep === 1) {
        next.onclick = function () { onbStep = 2; render(); };
      } else if (onbStep === 2) {
        next.onclick = function () {
          d.name = $('#fName', root).value.trim();
          if ($('#fStudent', root)) d.studentName = $('#fStudent', root).value.trim();
          if (!d.name) { toast('Escribe tu nombre'); return; }
          onbStep = 3; render();
        };
      } else if (onbStep === 3) {
        next.onclick = function () {
          d.cName = $('#cName', root).value.trim(); d.cPhone = $('#cPhone', root).value.trim(); d.cRel = $('#cRel', root).value.trim();
          if (!d.cName || !validPhone(d.cPhone)) { toast('Revisa el nombre y el número'); return; }
          onbStep = d.role === 'familia' ? 5 : 4; render();
        };
        $('#skip', root).onclick = function () { d.cName = ''; d.cPhone = ''; onbStep = d.role === 'familia' ? 5 : 4; render(); };
      } else if (onbStep === 4 && d.role !== 'familia') {
        bindConsent(root, function (given) { d.consent = given; onbStep = 5; render(); });
      } else {
        var finish = function () {
          S.role = d.role;
          S.profile.name = d.name;
          S.profile.studentName = d.studentName;
          if (d.role !== 'familia') setConsent(d.consent !== false);
          if (d.cName && validPhone(d.cPhone) && !S.contacts.some(function (c) { return normalizePhone(c.phone) === normalizePhone(d.cPhone); })) {
            S.contacts.push({ id: uid(), name: d.cName, phone: d.cPhone, relation: d.cRel });
          }
          S.onboarded = true;
          save(true);
          go('home');
          Tutorial.start();
        };
        $('#perm', root).onclick = function () { Bridge.requestPermissions(['location', 'notifications', 'sms'], function () { finish(); }); };
        $('#finish', root).onclick = finish;
      }
    }
  };


  /* ---------------- Consentimiento del estudiante ---------------- */
  // Los avisos automáticos (llegada, subida, retraso) comparten la ubicación del estudiante.
  // Solo se activan si el estudiante lo acepta en su propio teléfono.
  var CONSENT_VERSION = 2; // 2: se agregó la ubicación en vivo
  function consentOk() {
    return S.role === 'familia' || !!(S.consent && S.consent.given && S.consent.v === CONSENT_VERSION);
  }
  function setConsent(given) {
    S.consent = { given: !!given, at: Date.now(), v: CONSENT_VERSION };
    save();
    Live.sync();
  }
  function consentHtml(checked, namesHtml) {
    var fam = namesHtml ? namesHtml : S.contacts.length ? S.contacts.map(function (c) { return esc(firstName(c.name)); }).join(', ') : 'tus contactos de confianza';
    return '<div class="onb"><h1>Lo que compartes con tu familia</h1>' +
      '<p class="sub">Tú decides. Esto es lo que recibirán ' + fam + ':</p>' +
      '<div class="card flat"><div class="list">' +
      '<div class="item"><div class="ic">' + icon('bell') + '</div><div class="grow"><b>Avisos en los momentos que importan</b><div class="sub small">Tu familia recibe un SMS cuando subes, cuando haces transbordo, cuando estás por bajar o cerca de tu destino, cuando llegas y si te retrasas (con tu última ubicación).</div></div></div>' +
      '<div class="item"><div class="ic">' + icon('pin') + '</div><div class="grow"><b>Seguimiento en vivo, solo durante tu viaje</b><div class="sub small">Al iniciar cada viaje, tu familia recibe por SMS un enlace para verte en el mapa. Termina cuando llegas o terminas el viaje; fuera de un viaje no se comparte nada. Puedes apagarlo en Familia.</div></div></div>' +
      '<div class="item"><div class="ic">' + icon('alert') + '</div><div class="grow"><b>SOS, solo si tú lo activas</b><div class="sub small">Mantienes presionado el botón y se envía tu ubicación.</div></div></div>' +
      '<div class="item"><div class="ic">' + icon('shield') + '</div><div class="grow"><b>Cifrado, sin cuentas</b><div class="sub small">La ubicación en vivo viaja cifrada por ntfy.sh (servicio libre) y solo tu familia tiene la clave. Puedes apagarla cuando quieras en Familia o en Más › Ajustes.</div></div></div>' +
      '</div></div>' +
      '<label class="card flat row" style="cursor:pointer"><div class="grow"><b>Acepto compartir estos avisos con mi familia</b><div class="sub small">Si eres menor de 18 años, tu representante debe estar de acuerdo (Ley Orgánica de Protección de Datos Personales).</div></div>' +
      '<span class="switch"><input type="checkbox" id="consentChk" ' + (checked ? 'checked' : '') + '><span></span></span></label>' +
      '<button class="btn block" id="consentOk">Continuar</button>' +
      '<p class="sub small">Si no aceptas, la app igual te guía en el viaje y tú decides cuándo enviar cada mensaje.</p></div>';
  }
  function bindConsent(root, done) {
    $('#consentOk', root).onclick = function () { done($('#consentChk', root).checked); };
  }
  function consentSheet(after) {
    return {
      html: consentHtml(true).replace('<div class="onb">', '<div>'),
      bind: function (root) {
        bindConsent(root, function (given) {
          setConsent(given);
          closeSheet();
          toast(given ? 'Avisos automáticos activados' : 'Avisos automáticos apagados. Tú envías cada mensaje.', 3500);
          if (after) after(given); else render();
        });
      }
    };
  }

