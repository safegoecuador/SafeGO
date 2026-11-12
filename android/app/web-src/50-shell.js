  /* ---------------- Hoja inferior ---------------- */
  var sheetOpen = false;
  function openSheet(spec) {
    Tips.clear();
    var body = $('#sheetBody');
    body.innerHTML = spec.html;
    $('#sheet').classList.remove('hidden');
    sheetOpen = true;
    $$('[data-close]', body).forEach(function (b) { b.onclick = closeSheet; });
    if (spec.bind) spec.bind(body);
  }
  function closeSheet() { $('#sheet').classList.add('hidden'); $('#sheetBody').innerHTML = ''; sheetOpen = false; }
  $('#sheet').addEventListener('click', function (e) { if (e.target.id === 'sheet') closeSheet(); });

  /* ---------------- Navegación ---------------- */
  var currentTab = 'home';
  var stack = []; // subpantallas dentro de "Más" u otras
  function go(tab) { currentTab = tab; stack = []; render(); $('#view').scrollTop = 0; }
  function push(view) { stack.push(view); render(); $('#view').scrollTop = 0; }
  function goBack() {
    if (!$('#sosOverlay').classList.contains('hidden')) { $('#sosCancel').click(); return true; }
    if (sheetOpen) { closeSheet(); return true; }
    if ($('#tutorial')) { Tutorial.close(); return true; }
    if (!S.onboarded && onbStep > 0) {
      onbStep = (onbStep === 5 && onbDraft.role === 'familia') ? 3 : onbStep - 1;
      render(); return true;
    }
    if (stack.length) { stack.pop(); render(); return true; }
    if (currentTab === 'plan' && planState.selected !== null) { planState.selected = null; render(); return true; }
    if (currentTab !== 'home') { go('home'); return true; }
    return false;
  }
  $$('#tabs .tab').forEach(function (b) {
    b.innerHTML = b.innerHTML.replace(/<i data-ic="(\w+)"><\/i>/, function (m, n) { return icon(n); });
    b.onclick = function () { go(b.getAttribute('data-tab')); };
  });
  $('#backBtn').innerHTML = icon('back');
  $('#backBtn').onclick = goBack;
  $('#sosTop').onclick = function () { startSos(); };

  var VIEWS = {};
  function render() {
    applyTheme();
    var view = $('#view');
    var onb = !S.onboarded;
    $('#tabs').classList.toggle('hidden', onb);
    $('#sosTop').classList.toggle('hidden', onb);
    $$('#tabs .tab').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-tab') === currentTab); });
    var tripTab = $('#tabs [data-tab="trip"]');
    var dot = $('.dot', tripTab);
    if (S.trip && S.trip.status === 'running') { if (!dot) { dot = document.createElement('div'); dot.className = 'dot'; tripTab.appendChild(dot); } }
    else if (dot) dot.remove();
    document.body.classList.toggle('discreet', !!S.settings.discreet);

    var name = onb ? 'onboarding' : (stack.length ? stack[stack.length - 1] : currentTab);
    var v = VIEWS[name] || VIEWS.home;
    $('#backBtn').classList.toggle('hidden', !(stack.length || (onb && onbStep > 0)));
    $('#title').textContent = v.title ? v.title() : 'SafeGo';
    Map.onClick = null;
    Map.mount(null);
    if (name !== 'live' && Map.map) Map.clear('live');
    view.className = v.full ? 'full' : '';
    try {
      view.innerHTML = v.html();
      if (v.bind) v.bind(view);
    } catch (e) {
      console.error(e);
      view.className = '';
      view.innerHTML = '<div class="card warn"><h3>Algo salió mal</h3><p class="sub">' + esc(e.message) + '</p><button class="btn block" id="errHome">Volver al inicio</button></div>';
      $('#errHome').onclick = function () { stack = []; go('home'); };
    }
    var slot = $('.map-slot', view);
    if (slot) { Map.mount(slot); if (v.onMap) v.onMap(); }
    renderOfflineBar();
    Tips.clear();
    if (!onb && !stack.length) setTimeout(function () { Tips.show(currentTab); }, 400);
  }
  function renderOfflineBar() {
    var bar = $('#offlineBar');
    var off = !Bridge.online();
    if (off && !bar) {
      bar = document.createElement('div');
      bar.id = 'offlineBar'; bar.className = 'offline-bar';
      bar.textContent = 'Sin conexión: el planificador y los SMS siguen funcionando; el mapa usa lo guardado.';
      $('#topbar').after(bar);
    } else if (!off && bar) bar.remove();
  }
  window.addEventListener('online', renderOfflineBar);
  window.addEventListener('offline', renderOfflineBar);
  function applyTheme() {
    var t = S.settings.theme;
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  }

