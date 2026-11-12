  /* ---------------- Ciclo de vida ---------------- */
  function onResume() {
    Trip.restore();
    if (currentTab === 'trip' && !stack.length && S.trip) updateTripPanel(); else if (!sheetOpen) render();
  }

  function init() {
    S = loadState();
    // Ajustes de compatibilidad para estados antiguos
    if (!S.settings.channel) S.settings.channel = DEFAULT_SETTINGS.channel;
    if (S.trip && (!S.trip.itinerary || !S.trip.dest)) S.trip = null;
    onbDraft.role = S.role;
    render();
    if (S.onboarded && !(S.tutorial && S.tutorial.v >= TUTORIAL_VERSION)) Tutorial.start();
    else if (S.onboarded && S.role !== 'familia' && S.consent && S.consent.v !== CONSENT_VERSION) {
      // Cambió lo que se comparte (ubicación en vivo): se vuelve a preguntar
      setTimeout(function () { openSheet(consentSheet()); }, 600);
    }
    Live.sync();
    Trip.restore();
    if (S.trip && S.trip.status === 'running') render();
    // Refresca el panel del viaje cada 30 s (hora, retraso)
    setInterval(function () {
      if (S.trip && currentTab === 'trip' && !stack.length) updateTripPanel();
    }, 30000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) onResume(); });
  }

  window.addEventListener('error', function (e) { console.error('Error global', e.message); });
  try { init(); } catch (e) {
    console.error(e);
    document.getElementById('view').innerHTML = '<div class="card warn"><h3>No se pudo iniciar</h3><p>' + esc(e.message) + '</p></div>';
  }
})();
