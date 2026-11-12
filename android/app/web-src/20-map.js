  /* ---------------- Mapa (Leaflet + OpenStreetMap) ---------------- */
  var Map = {
    map: null, layers: {}, me: null, network: null, showNetwork: false,
    init: function () {
      if (this.map || !window.L) return;
      var el = $('#map');
      this.map = L.map(el, { zoomControl: false, attributionControl: true, minZoom: 10, maxZoom: 19 })
        .setView([D.QUITO_CENTER.lat, D.QUITO_CENTER.lon], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
      this.map.attributionControl.setPrefix(false);
      L.control.zoom({ position: 'topleft' }).addTo(this.map);
      var self = this;
      this.map.on('click', function (e) { if (self.onClick) self.onClick(e.latlng); });
      this.map.on('moveend', function () { if (self.showNetwork) self.drawStops(); });
    },
    mount: function (slot) {
      this.init();
      var el = $('#map');
      if (slot) slot.appendChild(el); else $('#mapWrap').appendChild(el);
      var m = this.map;
      if (m) { m.invalidateSize(false); setTimeout(function () { m.invalidateSize(); }, 60); }
    },
    clear: function (group) {
      if (this.layers[group]) { this.map.removeLayer(this.layers[group]); delete this.layers[group]; }
    },
    group: function (name) {
      this.clear(name);
      var g = L.layerGroup().addTo(this.map);
      this.layers[name] = g;
      return g;
    },
    pin: function (kind) {
      return L.divIcon({ className: '', html: '<div class="pin ' + kind + '"></div>', iconSize: [30, 30], iconAnchor: [15, 30] });
    },
    setMe: function (lat, lon, acc) {
      if (!this.map) return;
      if (!this.me) {
        this.me = L.marker([lat, lon], { icon: L.divIcon({ className: '', html: '<div class="me-dot"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }), zIndexOffset: 1000 }).addTo(this.map);
        this.meAcc = L.circle([lat, lon], { radius: acc || 30, color: '#2B6CE6', weight: 1, fillOpacity: 0.08 }).addTo(this.map);
      } else {
        this.me.setLatLng([lat, lon]);
        this.meAcc.setLatLng([lat, lon]).setRadius(acc || 30);
      }
    },
    toggleNetwork: function (force) {
      this.showNetwork = force === undefined ? !this.showNetwork : force;
      if (!this.showNetwork) { this.clear('network'); this.clear('osmstops'); return; }
      this.drawStops();
      var g = this.group('network');
      D.LINES.forEach(function (line) {
        var pts = line.stations.map(function (s) { return [s[1], s[2]]; });
        var trunk = line.kind === 'troncal';
        L.polyline(pts, trunk ? { color: line.color, weight: 4, opacity: 0.6 } : { color: line.color, weight: 2.5, opacity: 0.45, dashArray: '6 6' })
          .bindTooltip(line.name).addTo(g);
        if (!trunk) return; // en buses solo se dibuja el recorrido aproximado
        line.stations.forEach(function (s) {
          L.circleMarker([s[1], s[2]], { radius: 5, color: '#fff', weight: 2, fillColor: line.color, fillOpacity: 1 })
            .bindTooltip(line.short + ' · ' + s[0]).addTo(g);
        });
      });
    },
    /* Paradas reales de bus (OpenStreetMap): solo las visibles y desde el zoom 15, para no saturar. */
    drawStops: function () {
      if (!this.showNetwork || !this.map || !window.OSM_STOPS) return;
      if (!this.stopRenderer) this.stopRenderer = L.canvas({ padding: 0.3 });
      var g = this.group('osmstops');
      if (this.map.getZoom() < 15) return;
      var b = this.map.getBounds().pad(0.2), n = 0, r = this.stopRenderer;
      for (var i = 0; i < OSM_STOPS.length && n < 600; i++) {
        var s = OSM_STOPS[i];
        if (!b.contains([s[1], s[2]])) continue;
        n++;
        L.circleMarker([s[1], s[2]], { renderer: r, radius: 5, color: '#fff', weight: 1.5, fillColor: '#2E9B5B', fillOpacity: 0.95 })
          .bindTooltip(s[0] || 'Parada de bus').addTo(g);
      }
    },
    drawItinerary: function (it, groupName) {
      var g = this.group(groupName || 'route');
      var bounds = [];
      it.legs.forEach(function (l) {
        var pts = l.geometry || l.points;
        if (pts.length < 2) return;
        var style = l.kind === 'walk' ? { color: MODE_COLOR.walk, weight: 5, dashArray: '2 9', opacity: 0.9 } :
          { color: MODE_COLOR[l.mode] || '#333', weight: 6, opacity: 0.9 };
        if (l.kind === 'bus') style.dashArray = '10 8';
        L.polyline(pts, style).addTo(g);
        pts.forEach(function (p) { bounds.push(p); });
        if (l.kind === 'ride') {
          l.points.forEach(function (p, i) {
            L.circleMarker(p, { radius: i === 0 || i === l.points.length - 1 ? 7 : 4, color: '#fff', weight: 2, fillColor: l.color, fillOpacity: 1 })
              .bindTooltip(l.stops[i] || '').addTo(g);
          });
        }
      });
      L.marker([it.origin.lat, it.origin.lon], { icon: this.pin('a') }).bindTooltip(it.origin.name).addTo(g);
      L.marker([it.dest.lat, it.dest.lon], { icon: this.pin('b') }).bindTooltip(it.dest.name).addTo(g);
      bounds.push([it.origin.lat, it.origin.lon], [it.dest.lat, it.dest.lon]);
      if (bounds.length) this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    }
  };

  /* Geometría real de caminata (servidor libre de FOSSGIS/OSRM). Es opcional. */
  function enrichWalkGeometry(it, done) {
    if (!Bridge.online()) { done && done(); return; }
    var pending = 0;
    it.legs.forEach(function (l) {
      if (l.kind !== 'walk' || l.geometry || l.points.length < 2 || l.km < 0.12) return;
      var a = l.points[0], b = l.points[l.points.length - 1];
      var url = 'https://routing.openstreetmap.de/routed-foot/route/v1/foot/' + a[1] + ',' + a[0] + ';' + b[1] + ',' + b[0] + '?overview=full&geometries=geojson';
      pending++;
      Bridge.httpGet(url, function (res) {
        try {
          if (res.ok && res.data && res.data.status === 200) {
            var j = JSON.parse(res.data.body);
            if (j.routes && j.routes[0]) {
              l.geometry = j.routes[0].geometry.coordinates.map(function (c) { return [c[1], c[0]]; });
              var km = j.routes[0].distance / 1000;
              if (km > 0) { l.km = Math.round(km * 100) / 100; l.min = Math.max(1, Math.round(j.routes[0].distance / 1000 / 4.5 * 60)); }
            }
          }
        } catch (e) { /* se mantiene la línea recta */ }
        pending--;
        if (pending === 0 && done) done();
      });
    });
    if (pending === 0 && done) done();
  }

  /* Búsqueda de lugares: guardados, referencias locales, estaciones y Nominatim. */
  function localSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    var nq = norm(q);
    var out = [];
    S.places.forEach(function (p) { if (norm(p.name).indexOf(nq) >= 0) out.push({ name: p.name, lat: p.lat, lon: p.lon, kind: 'guardado' }); });
    D.PLACES.forEach(function (p) { if (norm(p.name).indexOf(nq) >= 0) out.push({ name: p.name, lat: p.lat, lon: p.lon, kind: p.type }); });
    D.LINES.forEach(function (line) {
      line.stations.forEach(function (s) {
        if (norm(s[0]).indexOf(nq) >= 0) out.push({ name: s[0] + ' (' + line.short + ')', lat: s[1], lon: s[2], kind: 'estación' });
      });
    });
    if (out.length < 8 && nq.length >= 3 && window.OSM_STOPS) {
      for (var i = 0; i < OSM_STOPS.length && out.length < 8; i++) {
        if (OSM_STOPS[i][0] && norm(OSM_STOPS[i][0]).indexOf(nq) >= 0) out.push({ name: OSM_STOPS[i][0], lat: OSM_STOPS[i][1], lon: OSM_STOPS[i][2], kind: 'parada de bus' });
      }
    }
    return out.slice(0, 8);
  }
  /* Parada de bus real más cercana (catálogo OSM) dentro de maxKm. */
  function nearestBusStop(lat, lon, maxKm) {
    var best = null, bd = maxKm;
    if (!window.OSM_STOPS) return null;
    for (var i = 0; i < OSM_STOPS.length; i++) {
      var s = OSM_STOPS[i];
      if (!s[0]) continue;
      var d = P.distKm({ lat: lat, lon: lon }, { lat: s[1], lon: s[2] });
      if (d < bd) { bd = d; best = s; }
    }
    return best ? { name: best[0], km: bd } : null;
  }
  var lastNominatim = 0;
  function remoteSearch(q, cb) {
    if (!Bridge.online() || q.trim().length < 3) { cb([]); return; }
    var now = Date.now();
    if (now - lastNominatim < 1100) { cb([]); return; } // política de uso: 1 consulta por segundo
    lastNominatim = now;
    var b = D.QUITO_BOUNDS;
    var url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&accept-language=es&countrycodes=ec&bounded=1&viewbox=' +
      b.west + ',' + b.north + ',' + b.east + ',' + b.south + '&q=' + encodeURIComponent(q);
    Bridge.httpGet(url, function (res) {
      try {
        if (res.ok && res.data.status === 200) {
          var arr = JSON.parse(res.data.body);
          cb(arr.map(function (r) {
            var name = r.name || String(r.display_name || '').split(',')[0];
            var ctx = String(r.display_name || '').split(',').slice(1, 3).join(',').trim();
            return { name: name, detail: ctx, lat: parseFloat(r.lat), lon: parseFloat(r.lon), kind: 'mapa' };
          }));
          return;
        }
      } catch (e) { /* nada */ }
      cb([]);
    });
  }
  function reverseName(lat, lon, cb) {
    var fallback = 'Punto en el mapa';
    var ns = P.nearestStation({ lat: lat, lon: lon }, 0.25);
    if (ns) fallback = 'Cerca de ' + ns.station.name;
    else { var bs = nearestBusStop(lat, lon, 0.15); if (bs) fallback = 'Cerca de la parada ' + bs.name; }
    if (!Bridge.online()) { cb(fallback); return; }
    var url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&accept-language=es&lat=' + lat + '&lon=' + lon;
    Bridge.httpGet(url, function (res) {
      try {
        if (res.ok && res.data.status === 200) {
          var j = JSON.parse(res.data.body);
          var a = j.address || {};
          var name = j.name || [a.road, a.house_number].filter(Boolean).join(' ') || a.neighbourhood || a.suburb;
          if (name) { cb(name + (a.suburb && name !== a.suburb ? ', ' + a.suburb : '')); return; }
        }
      } catch (e) { /* nada */ }
      cb(fallback);
    });
  }

