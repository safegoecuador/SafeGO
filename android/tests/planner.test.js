/* Pruebas del planificador. Ejecutar: node tests/planner.test.js */
'use strict';
const assert = require('assert');
const path = require('path');
require(path.join(__dirname, '../app/assets/www/data.js'));
require(path.join(__dirname, '../app/assets/www/planner.js'));
const P = globalThis.TSPlanner;

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ok  ' + name); }
  catch (e) { console.error('  FALLÓ ' + name + '\n       ' + e.message); process.exitCode = 1; }
}
const near = (a, b) => Math.abs(a.lat - b.lat) < 1e-9 && Math.abs(a.lon - b.lon) < 1e-9;

const CASES = [
  ['Solanda → Colegio Mejía', { name: 'A', lat: -0.2700, lon: -78.5450 }, { name: 'B', lat: -0.2150, lon: -78.5061 }],
  ['Quitumbe → PUCE', { name: 'A', lat: -0.3000, lon: -78.5600 }, { name: 'B', lat: -0.2099, lon: -78.4921 }],
  ['Carcelén → Centro', { name: 'A', lat: -0.0945, lon: -78.4728 }, { name: 'B', lat: -0.2200, lon: -78.5120 }],
  ['Trayecto corto norte', { name: 'A', lat: -0.1800, lon: -78.4800 }, { name: 'B', lat: -0.1900, lon: -78.4850 }],
  ['El Recreo → La Carolina', { name: 'A', lat: -0.2516, lon: -78.5226 }, { name: 'B', lat: -0.1827, lon: -78.4845 }]
];

console.log('Planificador');
CASES.forEach(([name, o, d]) => {
  test(name + ': hay rutas válidas', () => {
    const r = P.plan(o, d);
    assert.ok(r.length >= 1, 'sin rutas');
    r.forEach(it => {
      assert.ok(it.legs.length >= 1);
      assert.ok(isFinite(it.totalMin) && it.totalMin > 0, 'tiempo inválido');
      const sum = it.legs.reduce((s, l) => s + l.min + l.waitMin, 0);
      assert.strictEqual(it.totalMin, Math.round(sum), 'el total no coincide con los tramos');
      for (let i = 0; i < it.legs.length - 1; i++) {
        assert.ok(near(it.legs[i].to, it.legs[i + 1].from), 'tramos desconectados en ' + i);
      }
      assert.ok(near(it.legs[0].from, o), 'no empieza en el origen');
      assert.ok(near(it.legs[it.legs.length - 1].to, d), 'no termina en el destino');
      assert.ok(it.ease >= 10 && it.ease <= 100);
      assert.strictEqual(it.safety, undefined, 'no debe existir un puntaje de «seguridad»');
      it.legs.forEach(l => { assert.ok(isFinite(l.km) && l.km >= 0); assert.ok(l.min >= 1); });
    });
  });
});

test('ordenadas de la más rápida a la más lenta', () => {
  const r = P.plan(CASES[1][1], CASES[1][2]);
  for (let i = 1; i < r.length; i++) assert.ok(r[i].totalMin >= r[i - 1].totalMin);
});

test('evitar el Metro no devuelve tramos de Metro', () => {
  const r = P.plan(CASES[1][1], CASES[1][2], { avoid: { metro: true } });
  assert.ok(r.length >= 1);
  r.forEach(it => it.legs.forEach(l => assert.notStrictEqual(l.mode, 'metro')));
});

test('trayecto corto ofrece ir caminando', () => {
  const r = P.plan(CASES[3][1], CASES[3][2]);
  assert.ok(r.some(it => it.profile === 'caminando'));
});

test('mismo origen y destino no rompe', () => {
  const r = P.plan(CASES[0][1], CASES[0][1]);
  assert.ok(Array.isArray(r));
});

test('entradas inválidas devuelven lista vacía', () => {
  assert.deepStrictEqual(P.plan(null, CASES[0][2]), []);
  assert.deepStrictEqual(P.plan({ lat: NaN, lon: 0 }, CASES[0][2]), []);
});

test('avisos: «subir» antes de «bajar» en cada tramo', () => {
  CASES.forEach(([, o, d]) => {
    P.plan(o, d).forEach(it => {
      const pts = P.alertPoints(it);
      const rides = it.legs.filter(l => l.kind === 'ride').length;
      assert.strictEqual(pts.filter(p => p.kind === 'subir').length, rides);
      it.legs.filter(l => l.kind === 'ride').forEach(l => {
        const up = pts.findIndex(p => p.kind === 'subir' && p.name === l.from.name);
        const down = pts.findIndex(p => p.kind === 'bajar' && p.name === l.to.name && p.msg.indexOf('bajas en') >= 0);
        assert.ok(up >= 0 && down > up, 'orden incorrecto en ' + l.from.name + ' → ' + l.to.name);
      });
      pts.forEach(p => assert.ok(p.radius > 0 && isFinite(p.lat) && isFinite(p.lon) && p.msg));
    });
  });
});

test('todas las estaciones están dentro de Quito', () => {
  const b = globalThis.TSData.QUITO_BOUNDS;
  globalThis.TSData.LINES.forEach(l => l.stations.forEach(s => {
    assert.ok(s[1] > b.south && s[1] < b.north && s[2] > b.west && s[2] < b.east, s[0]);
  }));
});

console.log('Líneas de bus');
const L = globalThis.TSData.LINES;
test('hay corredores, alimentadores y buses con nombre', () => {
  ['metro', 'trole', 'ecovia', 'ccn', 'cso', 'alim', 'bus', 'inter'].forEach(m => assert.ok(L.some(l => l.mode === m), 'falta ' + m));
  const ids = L.map(l => l.id);
  assert.strictEqual(new Set(ids).size, ids.length, 'ids repetidos');
  assert.strictEqual(L.find(l => l.id === 'trole').stations.length, 51);
});
test('los circuitos nombran paradas que existen', () => {
  L.filter(l => l.services).forEach(l => l.services.forEach(sv => {
    assert.ok(l.stations.some(s => s[0] === sv.from), sv.code + ' desde ' + sv.from);
    assert.ok(l.stations.some(s => s[0] === sv.to), sv.code + ' hasta ' + sv.to);
  }));
});
test('cada tramo dice qué tomar y en qué dirección', () => {
  CASES.forEach(([, o, d]) => P.plan(o, d).forEach(it => it.legs.filter(l => l.kind === 'ride').forEach(l => {
    assert.ok(l.instruction && l.headsign && l.badge, 'tramo sin detalle: ' + l.short);
    assert.ok(/dirección/.test(l.instruction));
  })));
});
test('Trolebús: un tramo que ningún circuito cubre se divide en un cambio de circuito', () => {
  const r = P.plan({ name: 'A', lat: -0.0950, lon: -78.4726 }, { name: 'B', lat: -0.2985, lon: -78.5559 }, { avoid: { metro: true, ecovia: true, ccn: true, cso: true, bus: true, inter: true, alim: true } });
  assert.ok(r.length >= 1);
  const it = r.find(x => x.legs.some(l => l.mode === 'trole'));
  assert.ok(it, 'sin ruta en Trolebús');
  const tro = it.legs.filter(l => l.mode === 'trole');
  assert.ok(tro.length >= 2, 'debería cambiar de circuito');
  tro.forEach(l => assert.ok(l.services.length >= 1, 'tramo sin circuito'));
  assert.ok(tro.slice(1).every(l => l.sameStation));
});
test('Comité del Pueblo → PUCE sugiere una línea con nombre (alimentador o bus)', () => {
  const r = P.plan({ name: 'A', lat: -0.1225, lon: -78.4650 }, { name: 'B', lat: -0.2099, lon: -78.4921 });
  assert.ok(r.some(it => it.legs.some(l => l.kind === 'ride' && (l.mode === 'alim' || l.mode === 'bus'))));
});
test('Cumbayá → Universidad Central usa el bus Cumbayá – Universidad Central', () => {
  const r = P.plan({ name: 'A', lat: -0.2005, lon: -78.4330 }, { name: 'B', lat: -0.1998, lon: -78.5038 });
  assert.ok(r.some(it => it.legs.some(l => l.lineId === 'bus-cumbaya-uce')));
});
test('evitar buses quita todos los tramos de bus urbano', () => {
  const r = P.plan({ name: 'A', lat: -0.2005, lon: -78.4330 }, { name: 'B', lat: -0.1998, lon: -78.5038 }, { avoid: { bus: true, inter: true } });
  r.forEach(it => it.legs.forEach(l => assert.ok(l.mode !== 'inter' && !(l.kind === 'ride' && l.mode === 'bus'))));
});

console.log(passed + ' pruebas correctas' + (process.exitCode ? ', con fallos' : ''));
