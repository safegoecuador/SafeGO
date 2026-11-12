/*
 * Planificador multimodal (Metro, Trolebús, Ecovía, bus y caminata).
 * Funciona sin conexión: usa la red de data.js y estimaciones de tiempo.
 */
(function (global) {
  'use strict';

  var WALK_KMH = 4.5;
  var WALK_DETOUR = 1.3;     // las calles no son línea recta
  var BUS_KMH = 15;
  var BUS_DETOUR = 1.35;
  var BUS_WAIT = 8;
  var RIDE_DETOUR = 1.12;
  var DWELL_MIN = 0.5;       // tiempo detenido en cada estación
  var MAX_WALK_KM = 1.3;     // caminata máxima hacia/desde una estación
  var MAX_BUS_KM = 5;        // tramo en un bus sin línea identificada (último recurso)
  var MAX_TRANSFER_KM = 0.55;
  var DIRECT_WALK_KM = 2.2;
  var BUS_ACCESS_WALK_MIN = 6; // caminar a la parada y desde la parada (ida y vuelta)

  var PROFILES = {
    rapida: { label: 'Más rápida', walk: 1, bus: 1, transfer: 2, metro: 1, line: 1 },
    // Menos transbordos y menos caminata en la calle. No usa datos de seguridad (aún no existen datos abiertos).
    tranquila: { label: 'Más tranquila', walk: 1.8, bus: 1.4, transfer: 10, metro: 0.8, line: 1 },
    menos_transbordos: { label: 'Menos transbordos', walk: 1.2, bus: 1.1, transfer: 18, metro: 1, line: 1 },
    menos_caminata: { label: 'Menos caminata', walk: 3, bus: 1, transfer: 4, metro: 1, line: 1 }
  };

  function toRad(d) { return d * Math.PI / 180; }

  function distKm(a, b) {
    var R = 6371;
    var dLat = toRad(b.lat - a.lat);
    var dLon = toRad(b.lon - a.lon);
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }

  function walkMin(km) { return (km * WALK_DETOUR / WALK_KMH) * 60; }
  function busMin(km) { return (km * BUS_DETOUR / BUS_KMH) * 60 + BUS_WAIT; }

  var graphCache = null;

  var DENSE_STEP_KM = 0.7;    // en buses se puede subir en cualquier parada del recorrido
  var BUS_MODES = { bus: 1, alim: 1, inter: 1, cso: 1 };

  /* Paradas usadas en el grafo: en líneas «dense» se agregan puntos intermedios de subida. */
  function graphStations(line) {
    var st = line.stations;
    if (!line.dense) return st.map(function (s, i) { return { name: s[0], lat: s[1], lon: s[2], orig: i }; });
    var out = [];
    for (var i = 0; i < st.length; i++) {
      out.push({ name: st[i][0], lat: st[i][1], lon: st[i][2], orig: i });
      if (i === st.length - 1) break;
      var a = { lat: st[i][1], lon: st[i][2] }, b = { lat: st[i + 1][1], lon: st[i + 1][2] };
      var n = Math.floor(distKm(a, b) / DENSE_STEP_KM);
      for (var k = 1; k <= n; k++) {
        var f = k / (n + 1);
        out.push({ name: 'Parada entre ' + st[i][0] + ' y ' + st[i + 1][0], lat: a.lat + (b.lat - a.lat) * f, lon: a.lon + (b.lon - a.lon) * f, virtual: true });
      }
    }
    return out;
  }

  function buildGraph(lines) {
    var nodes = [];
    var byId = {};
    var perLine = {};
    lines.forEach(function (line) {
      perLine[line.id] = graphStations(line).map(function (s, i) {
        var n = { id: line.id + ':' + i, line: line, index: i, orig: s.orig, virtual: !!s.virtual, name: s.name, lat: s.lat, lon: s.lon, edges: [] };
        nodes.push(n);
        byId[n.id] = n;
        return n;
      });
    });
    // Tramos sobre la misma línea
    lines.forEach(function (line) {
      var ns = perLine[line.id];
      for (var i = 0; i < ns.length - 1; i++) {
        var a = ns[i], b = ns[i + 1];
        var km = distKm(a, b) * (BUS_MODES[line.mode] ? BUS_DETOUR : RIDE_DETOUR);
        var min = km / line.speedKmh * 60 + (a.virtual || b.virtual ? 0.2 : DWELL_MIN);
        a.edges.push({ to: b, kind: 'ride', km: km, min: min });
        b.edges.push({ to: a, kind: 'ride', km: km, min: min });
      }
    });
    // Transbordos caminando entre paradas cercanas de líneas distintas
    for (var i = 0; i < nodes.length; i++) {
      for (var j = 0; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j];
        if (a.line.id === b.line.id) continue;
        var km = distKm(a, b);
        if (km <= MAX_TRANSFER_KM) {
          a.edges.push({ to: b, kind: 'transfer', km: km, min: Math.max(2, walkMin(km)) + b.line.waitMin });
        }
      }
    }
    return { nodes: nodes, byId: byId, perLine: perLine };
  }

  function getGraph() {
    if (!graphCache) graphCache = buildGraph(global.TSData.LINES);
    return graphCache;
  }

  function weight(edgeKind, min, line, p) {
    switch (edgeKind) {
      case 'walk': return min * p.walk;
      case 'bus': return min * p.bus + 25; // bus sin línea identificada: se prefiere una línea conocida
      case 'transfer': return min * p.walk + p.transfer;
      case 'ride': return min * (line && line.mode === 'metro' ? p.metro : line && BUS_MODES[line.mode] ? p.bus : p.line);
      default: return min;
    }
  }

  function isBanned(line, banned) { return !!(banned && (banned[line.id] || banned[line.mode])); }

  // Dijkstra simple (la red es pequeña, no hace falta un heap).
  function shortest(origin, dest, profileKey, banned) {
    var p = PROFILES[profileKey] || PROFILES.rapida;
    var g = getGraph();
    var ORIGIN = { id: 'ORIGIN', name: origin.name || 'Origen', lat: origin.lat, lon: origin.lon, edges: [] };
    var DEST = { id: 'DEST', name: dest.name || 'Destino', lat: dest.lat, lon: dest.lon, edges: [] };

    var entry = [];
    g.nodes.forEach(function (n) {
      if (isBanned(n.line, banned)) return;
      var km = distKm(origin, n);
      if (km <= MAX_WALK_KM) {
        entry.push({ to: n, kind: 'walk', km: km, min: walkMin(km) + n.line.waitMin });
      } else if (km <= MAX_BUS_KM && n.line.kind === 'troncal') {
        entry.push({ to: n, kind: 'bus', km: km * BUS_DETOUR, min: busMin(km) + n.line.waitMin });
      }
    });
    ORIGIN.edges = entry;

    var exitEdges = {};
    g.nodes.forEach(function (n) {
      var km = distKm(n, dest);
      if (km <= MAX_WALK_KM) exitEdges[n.id] = { to: DEST, kind: 'walk', km: km, min: walkMin(km) };
      else if (km <= MAX_BUS_KM && n.line.kind === 'troncal') exitEdges[n.id] = { to: DEST, kind: 'bus', km: km * BUS_DETOUR, min: busMin(km) };
    });

    var dist = { ORIGIN: 0 };
    var prev = {};
    var visited = {};
    var queue = [ORIGIN];
    var all = { ORIGIN: ORIGIN, DEST: DEST };
    g.nodes.forEach(function (n) { all[n.id] = n; });

    while (queue.length) {
      var bi = 0;
      for (var q = 1; q < queue.length; q++) if (dist[queue[q].id] < dist[queue[bi].id]) bi = q;
      var u = queue.splice(bi, 1)[0];
      if (visited[u.id]) continue;
      visited[u.id] = true;
      if (u.id === 'DEST') break;
      var edges = u.edges.slice();
      if (exitEdges[u.id]) edges.push(exitEdges[u.id]);
      for (var e = 0; e < edges.length; e++) {
        var ed = edges[e];
        var v = ed.to;
        if (v.line && isBanned(v.line, banned)) continue;
        if (visited[v.id]) continue;
        var lineForWeight = ed.kind === 'ride' ? u.line : null;
        var nd = dist[u.id] + weight(ed.kind, ed.min, lineForWeight, p);
        if (dist[v.id] === undefined || nd < dist[v.id]) {
          dist[v.id] = nd;
          prev[v.id] = { from: u, edge: ed };
          queue.push(v);
        }
      }
    }
    if (!prev.DEST) return null;

    var path = [];
    var cur = 'DEST';
    while (cur !== 'ORIGIN') {
      var pr = prev[cur];
      path.unshift({ from: pr.from, to: all[cur], edge: pr.edge });
      cur = pr.from.id;
    }
    return toItinerary(path, origin, dest, profileKey);
  }

  function place(n) { return { name: n.name, lat: n.lat, lon: n.lon }; }

  /* ---------- Detalle de cada tramo: circuito, dirección, avenida ---------- */
  function terminusName(line, forward) {
    var st = line.stations;
    return (forward ? st[st.length - 1] : st[0])[0];
  }
  function stationIdx(line, name) {
    for (var i = 0; i < line.stations.length; i++) if (line.stations[i][0] === name) return i;
    return -1;
  }
  /* Circuitos que pasan por las paradas a y b (índices originales), con su destino en ese sentido. */
  function servicesFor(line, a, b) {
    if (!line.services) return [];
    var out = [];
    line.services.forEach(function (sv) {
      var i = stationIdx(line, sv.from), j = stationIdx(line, sv.to);
      if (i < 0 || j < 0) return;
      var lo = Math.min(i, j), hi = Math.max(i, j);
      if (Math.min(a, b) >= lo && Math.max(a, b) <= hi) {
        out.push({ code: sv.code, label: sv.label || sv.code, headsign: line.stations[b > a ? hi : lo][0], reach: b > a ? hi : lo });
      }
    });
    return out;
  }
  function cleanName(n) { return n.replace(/ \((Trole|Ecovía|bus|alimentador|Sur Occidental|andén [^)]*)\)$/, ''); }

  /* Completa un tramo en transporte; si ningún circuito cubre todo el tramo, lo divide donde hay que cambiar. */
  function describeRide(l) {
    var line = null;
    var lines = global.TSData.LINES;
    for (var k = 0; k < lines.length; k++) if (lines[k].id === l.lineId) line = lines[k];
    var parts = [l];
    if (line && line.services) {
      var origIdx = l.nodes.map(function (n) { return n.orig; });
      var s0 = origIdx[0], sN = origIdx[origIdx.length - 1];
      if (!servicesFor(line, s0, sN).length) {
        // Cambio de circuito: se toma el que llega más lejos y se sigue desde ahí
        parts = [];
        var pos = 0, guard = 0;
        while (pos < origIdx.length - 1 && guard++ < 6) {
          var best = -1;
          for (var e = origIdx.length - 1; e > pos; e--) {
            if (servicesFor(line, origIdx[pos], origIdx[e]).length) { best = e; break; }
          }
          if (best < 0) { parts = [l]; break; }
          parts.push(sliceLeg(l, pos, best, parts.length > 0 ? line.waitMin : 0));
          pos = best;
        }
      }
    }
    parts.forEach(function (p, i) {
      p.lineKind = line ? line.kind : '';
      p.via = line ? line.via || '' : '';
      p.lineNote = line ? line.note || '' : '';
      p.codes = line ? line.codes || '' : '';
      p.sameStation = i > 0;
      var a = p.nodes[0].orig, b = p.nodes[p.nodes.length - 1].orig;
      var forward = p.nodes[p.nodes.length - 1].index > p.nodes[0].index;
      var sv = line && a !== undefined && b !== undefined ? servicesFor(line, a, b) : [];
      p.services = sv.map(function (x) { return x.code; });
      p.headsign = cleanName(sv.length ? sv[0].headsign : line ? terminusName(line, forward) : p.to.name);
      if (sv.length > 1) {
        // Si los circuitos van a destinos distintos, se nombra el más cercano (el primero que sirve)
        sv.sort(function (x, y) { return Math.abs(x.reach - a) - Math.abs(y.reach - a); });
        p.headsign = cleanName(sv[0].headsign);
        p.headsignAll = sv.map(function (x) { return x.code + ' → ' + cleanName(x.headsign); });
      }
      var codesTxt = p.services.length ? (p.services.length === 1 ? 'circuito ' + p.services[0] : 'circuitos ' + p.services.join(' o ')) : '';
      p.badge = p.services.length ? (line.mode === 'trole' || line.mode === 'ecovia' ? p.services.slice(0, 2).join('/') : p.services[0]) :
        (line && line.code ? line.code : p.short.replace(/^Bus /, '').split(' – ')[0]);
      if (p.badge.length > 14) p.badge = p.badge.slice(0, 13) + '…';
      p.title = p.short + (codesTxt ? ' (' + codesTxt + ')' : '');
      p.instruction = 'Toma el ' + p.title + ' con dirección a ' + p.headsign;
      p.fullShort = p.short + (p.services.length ? ' ' + p.services.join('/') : '');
      delete p.nodes; delete p.segKm; delete p.segMin;
    });
    return parts;
  }
  function sliceLeg(l, i, j, waitMin) {
    var km = 0, min = 0;
    for (var k = i; k < j; k++) { km += l.segKm[k]; min += l.segMin[k]; }
    return {
      kind: 'ride', mode: l.mode, lineId: l.lineId, lineName: l.lineName, short: l.short, color: l.color,
      from: place(l.nodes[i]), to: place(l.nodes[j]),
      stops: l.stops.slice(i, j + 1), points: l.points.slice(i, j + 1), nodes: l.nodes.slice(i, j + 1),
      km: km, min: min, waitMin: waitMin
    };
  }

  function toItinerary(path, origin, dest, profileKey) {
    var legs = [];
    path.forEach(function (step) {
      var ed = step.edge;
      if (ed.kind === 'ride') {
        var line = step.from.line;
        var last = legs[legs.length - 1];
        if (last && last.kind === 'ride' && last.lineId === line.id) {
          last.to = place(step.to);
          last.stops.push(step.to.name);
          last.points.push([step.to.lat, step.to.lon]);
          last.nodes.push(step.to);
          last.segKm.push(ed.km); last.segMin.push(ed.min);
          last.km += ed.km;
          last.min += ed.min;
        } else {
          legs.push({
            kind: 'ride', mode: line.mode, lineId: line.id, lineName: line.name, short: line.short,
            color: line.color, from: place(step.from), to: place(step.to),
            stops: [step.from.name, step.to.name],
            points: [[step.from.lat, step.from.lon], [step.to.lat, step.to.lon]],
            nodes: [step.from, step.to], segKm: [ed.km], segMin: [ed.min],
            km: ed.km, min: ed.min, waitMin: 0
          });
        }
      } else {
        var mode = ed.kind === 'bus' ? 'bus' : 'walk';
        var waitMin = 0;
        // El tiempo de espera de la línea que sigue se cuenta en el tramo de acceso
        if (step.to.line) waitMin = step.to.line.waitMin;
        var moveMin = ed.min - waitMin;
        if (ed.kind === 'bus' && step.to.line) moveMin = ed.min - waitMin;
        legs.push({
          kind: mode, mode: mode, transfer: ed.kind === 'transfer',
          from: place(step.from), to: place(step.to),
          points: [[step.from.lat, step.from.lon], [step.to.lat, step.to.lon]],
          km: ed.km * (mode === 'walk' ? WALK_DETOUR : 1), min: moveMin, waitMin: waitMin,
          color: mode === 'bus' ? '#3A5BA0' : '#766168'
        });
      }
    });
    // Unir caminatas consecutivas y quitar caminatas insignificantes
    var merged = [];
    legs.forEach(function (l) {
      var last = merged[merged.length - 1];
      if (last && last.kind === 'walk' && l.kind === 'walk') {
        last.to = l.to; last.points = last.points.concat(l.points.slice(1));
        last.km += l.km; last.min += l.min; last.waitMin += l.waitMin;
      } else merged.push(l);
    });
    merged = [].concat.apply([], merged.map(function (l) { return l.kind === 'ride' ? describeRide(l) : [l]; }));
    merged.forEach(function (l) { l.min = Math.max(1, Math.round(l.min)); l.waitMin = Math.round(l.waitMin); l.km = Math.round(l.km * 100) / 100; });
    var total = merged.reduce(function (s, l) { return s + l.min + l.waitMin; }, 0);
    var rides = merged.filter(function (l) { return l.kind === 'ride' || l.kind === 'bus'; });
    var walkKm = merged.filter(function (l) { return l.kind === 'walk'; }).reduce(function (s, l) { return s + l.km; }, 0);
    return {
      id: merged.map(function (l) { return l.kind + (l.lineId || '') + l.to.name; }).join('|'),
      profile: profileKey,
      profileLabel: (PROFILES[profileKey] || PROFILES.rapida).label,
      origin: origin, dest: dest,
      legs: merged,
      totalMin: Math.round(total),
      transfers: Math.max(0, rides.length - 1),
      walkKm: Math.round(walkKm * 100) / 100,
      modes: rides.map(function (l) { return l.mode; })
    };
  }

  function directOptions(origin, dest) {
    var km = distKm(origin, dest);
    var out = [];
    if (km <= DIRECT_WALK_KM) {
      out.push({
        id: 'walk-direct', profile: 'caminando', profileLabel: 'Caminando',
        origin: origin, dest: dest, transfers: 0, walkKm: Math.round(km * WALK_DETOUR * 100) / 100, modes: [],
        legs: [{ kind: 'walk', mode: 'walk', from: origin, to: dest, points: [[origin.lat, origin.lon], [dest.lat, dest.lon]], km: Math.round(km * WALK_DETOUR * 100) / 100, min: Math.max(1, Math.round(walkMin(km))), waitMin: 0, color: '#766168' }],
        totalMin: Math.max(1, Math.round(walkMin(km)))
      });
    }
    if (km > 0.8 && km <= 15) {
      var bm = (km * BUS_DETOUR / BUS_KMH) * 60;
      out.push({
        id: 'bus-direct', profile: 'bus', profileLabel: 'Solo bus urbano',
        origin: origin, dest: dest, transfers: 0, walkKm: Math.round(BUS_ACCESS_WALK_MIN / 60 * WALK_KMH / WALK_DETOUR * 100) / 100, modes: ['bus'],
        legs: [
          { kind: 'bus', mode: 'bus', from: origin, to: dest, points: [[origin.lat, origin.lon], [dest.lat, dest.lon]], km: Math.round(km * BUS_DETOUR * 100) / 100, min: Math.round(bm) + BUS_ACCESS_WALK_MIN, waitMin: BUS_WAIT, color: '#3A5BA0', note: 'Camina a la parada más cercana y toma un bus que vaya hacia tu destino. Confirma la línea en la parada.' }
        ],
        totalMin: Math.round(bm + BUS_WAIT + BUS_ACCESS_WALK_MIN)
      });
    }
    return out;
  }

  /**
   * Devuelve hasta 4 alternativas ordenadas por tiempo.
   * opts.avoid: { metro: true, trole: true, ecovia: true }
   * opts.preferred: clave de perfil a destacar.
   */
  function plan(origin, dest, opts) {
    opts = opts || {};
    if (!origin || !dest || !isFinite(origin.lat) || !isFinite(dest.lat)) return [];
    var results = [];
    var seen = {};
    var banned = opts.avoid || {};
    Object.keys(PROFILES).forEach(function (k) {
      var it = null;
      try { it = shortest(origin, dest, k, banned); } catch (e) { it = null; }
      if (it && !seen[it.id]) {
        seen[it.id] = true;
        results.push(it);
      } else if (it && seen[it.id]) {
        // Misma ruta encontrada con otro criterio: se añade la etiqueta
        results.forEach(function (r) {
          if (r.id === it.id && r.alsoLabels === undefined) r.alsoLabels = [];
          if (r.id === it.id) r.alsoLabels.push(PROFILES[k].label);
        });
      }
    });
    directOptions(origin, dest).forEach(function (d) {
      // El bus directo solo vale si no hay red útil o es competitivo
      if (d.profile === 'bus' && results.length && d.totalMin > results[0].totalMin * 1.15) return;
      if (!seen[d.id]) { seen[d.id] = true; results.push(d); }
    });
    results.forEach(function (r) { r.ease = easeScore(r); });
    results.sort(function (a, b) { return a.totalMin - b.totalMin; });
    // Si la caminata directa es casi tan rápida, la mostramos primero
    return results.slice(0, 5);
  }

  /*
   * Puntaje interno de comodidad (0-100): menos transbordos, menos caminata y más Metro = mayor.
   * Solo se usa para elegir la opción «Recomendada»; NO mide seguridad y no se muestra como número.
   */
  function easeScore(it) {
    var s = 100;
    s -= it.transfers * 9;
    s -= Math.min(30, it.walkKm * 12);
    it.legs.forEach(function (l) {
      if (l.mode === 'bus' || l.mode === 'inter' || l.mode === 'cso') s -= 6;
      if (l.mode === 'alim') s -= 3;
      if (l.mode === 'metro') s += 4;
    });
    return Math.max(10, Math.min(100, Math.round(s)));
  }

  /** Puntos de aviso para el viaje en curso. */
  function alertPoints(it) {
    var pts = [];
    it.legs.forEach(function (l, i) {
      var next = it.legs[i + 1];
      if (l.kind === 'ride') {
        // Al llegar a la estación donde sube (inicio del tramo o transbordo)
        pts.push({ name: l.from.name, lat: l.from.lat, lon: l.from.lon, radius: 120, kind: 'subir',
          msg: 'Estás en ' + cleanName(l.from.name) + ': toma el ' + (l.fullShort || l.short) + ' dirección ' + (l.headsign || l.to.name) + ' y baja en ' + cleanName(l.to.name),
          short: l.fullShort || l.short, toward: cleanName(l.to.name) });
        var msg = 'Prepárate: bajas en ' + cleanName(l.to.name);
        if (next && next.kind === 'ride' && next.sameStation) {
          msg += ' y cambias al ' + (next.fullShort || next.short) + ' en la misma estación';
        } else if (next && next.kind === 'walk' && it.legs[i + 2] && it.legs[i + 2].kind === 'ride') {
          msg += ' y cambias a ' + (it.legs[i + 2].fullShort || it.legs[i + 2].short);
        } else if (next && next.kind === 'bus') {
          msg += ' y tomas un bus';
        }
        pts.push({ name: l.to.name, lat: l.to.lat, lon: l.to.lon, radius: 450, msg: msg, kind: 'bajar' });
        pts.push({ name: l.to.name, lat: l.to.lat, lon: l.to.lon, radius: 150, msg: 'Estás en ' + cleanName(l.to.name) + '. ' + (next ? 'Sigue al siguiente tramo.' : ''), kind: 'transbordo' });
      } else if (l.kind === 'bus' && next) {
        pts.push({ name: l.to.name, lat: l.to.lat, lon: l.to.lon, radius: 600, msg: 'Prepárate: bájate del bus cerca de ' + l.to.name, kind: 'bajar' });
      }
    });
    return pts;
  }

  function nearestStation(pt, maxKm) {
    var g = getGraph();
    var best = null, bd = Infinity;
    g.nodes.forEach(function (n) {
      var d = distKm(pt, n);
      if (d < bd) { bd = d; best = n; }
    });
    if (best && (maxKm === undefined || bd <= maxKm)) return { station: best, km: bd };
    return null;
  }

  global.TSPlanner = {
    plan: plan,
    distKm: distKm,
    alertPoints: alertPoints,
    nearestStation: nearestStation,
    PROFILES: PROFILES,
    easeScore: easeScore,
    walkMin: walkMin,
    cleanName: cleanName
  };
})(typeof window !== 'undefined' ? window : globalThis);
