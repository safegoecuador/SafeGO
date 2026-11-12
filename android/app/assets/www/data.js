/*
 * Red de transporte de Quito usada por el planificador.
 *
 * Fuentes de nombres, códigos y recorridos (consultadas en octubre de 2026):
 *  - Wikipedia «Trolebús de Quito»: 51 paradas del corredor y circuitos C1–C6, alimentadores LB/RE/MV/MG.
 *  - Extra.ec (2025): circuitos de la Ecovía E1, E1-M, E2 y E3.
 *  - Teleamazonas, El Comercio, El Diario (2023–2025): paradas del Corredor Sur Oriental (Ecovía sur).
 *  - Primicias / Teleamazonas (2024): rutas que conectan con el Metro (El Labrador, La Carolina, El Ejido, U. Central).
 *  - El Diario / Extra (2025): rutas del Corredor Sur Occidental (Av. Mariscal Sucre).
 *  - Primicias (2025): Corredor Central Norte (La Ofelia – Playón de la Marín, 36 paradas).
 *  - Guía de transporte USFQ: Metrobús por Av. América y La Prensa, buses verdes a los valles desde Río Coca.
 *  - Teleamazonas (2025): ruta Aeropuerto – Río Coca – El Labrador y buses al aeropuerto desde Quitumbe y Carcelén.
 *
 * IMPORTANTE: los nombres y el orden de las paradas vienen de esas fuentes, pero las COORDENADAS
 * son aproximadas (ubicadas a mano sobre las avenidas, sin datos GPS oficiales). Las rutas de bus
 * cambian seguido; la app pide confirmar la línea en el letrero del bus.
 *
 * Formato de cada línea:
 *  stations: [nombre, lat, lon]
 *  services: circuitos que recorren solo un tramo de la línea { code, from, to } (nombres de parada)
 *  dense: true = se agregan puntos de subida intermedios (el bus para en cualquier parada del recorrido)
 */
(function (global) {
  'use strict';

  var STATION_INDEX = {};
  function indexed(line) { line.stations.forEach(function (s) { STATION_INDEX[s[0]] = s; }); return line; }

  var LINES = [
    indexed({
      id: 'metro', mode: 'metro', kind: 'troncal',
      name: 'Metro de Quito · Línea 1', short: 'Metro', color: '#B3303F',
      speedKmh: 34, waitMin: 4, hours: '05:30 – 23:00',
      stations: [
        ['Quitumbe', -0.29790, -78.55470],
        ['Morán Valverde', -0.28480, -78.54380],
        ['Solanda', -0.26900, -78.54020],
        ['El Calzado', -0.25920, -78.53250],
        ['El Recreo', -0.25220, -78.52230],
        ['La Magdalena', -0.23830, -78.52360],
        ['San Francisco', -0.22100, -78.51460],
        ['La Alameda', -0.21190, -78.50130],
        ['El Ejido', -0.20750, -78.49660],
        ['Universidad Central', -0.20020, -78.50120],
        ['La Pradera', -0.18930, -78.48870],
        ['La Carolina', -0.18280, -78.48420],
        ['Iñaquito', -0.17620, -78.48540],
        ['Jipijapa', -0.16380, -78.48310],
        ['El Labrador', -0.15420, -78.48720]
      ]
    }),
    indexed({
      id: 'trole', mode: 'trole', kind: 'troncal',
      name: 'Trolebús (Av. 10 de Agosto · Maldonado)', short: 'Trolebús', color: '#2E7D5B',
      speedKmh: 17, waitMin: 6, hours: '05:00 – 23:45',
      via: 'Av. Galo Plaza Lasso, 10 de Agosto, Guayaquil, Maldonado',
      services: [
        { code: 'C1', from: 'El Recreo (Trole)', to: 'El Labrador (Trole)' },
        { code: 'C2', from: 'El Labrador (Trole)', to: 'Morán Valverde (Trole)' },
        { code: 'C3', from: 'El Labrador (Trole)', to: 'Santo Domingo' },
        { code: 'C4', from: 'Terminal Quitumbe', to: 'Colón (Trole)' },
        { code: 'C5', from: 'Terminal Carcelén', to: 'Ejido (Trole)' },
        { code: 'C6', from: 'El Recreo (Trole)', to: 'Terminal Quitumbe' }
      ],
      stations: [
        ['Terminal Carcelén', -0.09500, -78.47250],
        ['Santa Lucía', -0.09950, -78.47450],
        ['Sebastián Moreno', -0.10400, -78.47600],
        ['Parquenor', -0.10850, -78.47720],
        ['Parque de los Recuerdos', -0.11300, -78.47830],
        ['De los Cedros', -0.11750, -78.47920],
        ['Del Maestro', -0.12200, -78.48000],
        ['COTAC', -0.12650, -78.48080],
        ['Los Pinos', -0.13100, -78.48150],
        ['Parque Kennedy', -0.13550, -78.48220],
        ['Capitán Borja', -0.14000, -78.48300],
        ['La Luz', -0.14400, -78.48400],
        ['Isaac Albéniz', -0.14800, -78.48520],
        ['El Labrador (Trole)', -0.15400, -78.48750],
        ['Plaza de Toros', -0.16150, -78.48950],
        ['La Y', -0.16900, -78.49150],
        ['Estadio', -0.17600, -78.49120],
        ['Florón', -0.18300, -78.49180],
        ['Mariana de Jesús', -0.18950, -78.49250],
        ['Cuero y Caicedo', -0.19500, -78.49300],
        ['Colón (Trole)', -0.20050, -78.49380],
        ['Santa Clara', -0.20400, -78.49550],
        ['La Mariscal', -0.20700, -78.49700],
        ['Ejido (Trole)', -0.20980, -78.49880],
        ['Alameda (Trole)', -0.21280, -78.50220],
        ['Banco Central', -0.21580, -78.50550],
        ['Hermano Miguel', -0.21780, -78.50820],
        ['Plaza del Teatro', -0.21960, -78.51060],
        ['Plaza Marín', -0.22100, -78.50980],
        ['Plaza Chica', -0.22250, -78.51180],
        ['Santo Domingo', -0.22450, -78.51370],
        ['Cumandá', -0.22680, -78.51250],
        ['La Recoleta', -0.23100, -78.51180],
        ['Jefferson Pérez', -0.23450, -78.51220],
        ['Colina', -0.23780, -78.51320],
        ['Chimbacalle (Trole)', -0.24100, -78.51450],
        ['Villaflora', -0.24550, -78.51700],
        ['El Recreo (Trole)', -0.25180, -78.52120],
        ['El Calzado (Trole)', -0.25530, -78.52350],
        ['Integración España', -0.25880, -78.52570],
        ['Quito Sur', -0.26230, -78.52800],
        ['La Internacional', -0.26580, -78.53020],
        ['Ajaví', -0.26930, -78.53250],
        ['Marquesa de Solanda', -0.27280, -78.53470],
        ['Mercado Mayorista', -0.27630, -78.53700],
        ['Quimiag', -0.27980, -78.53920],
        ['Registro Civil', -0.28330, -78.54150],
        ['Morán Valverde (Trole)', -0.28650, -78.54350],
        ['Amaru Ñan', -0.29050, -78.54780],
        ['Cóndor Ñan', -0.29450, -78.55200],
        ['Terminal Quitumbe', -0.29850, -78.55600]
      ]
    }),
    {
      id: 'ecovia', mode: 'ecovia', kind: 'troncal',
      name: 'Ecovía (6 de Diciembre · Corredor Sur Oriental)', short: 'Ecovía', color: '#C77A12',
      speedKmh: 18, waitMin: 6, hours: '05:00 – 22:00',
      via: 'Av. 6 de Diciembre, Marín, Av. Napo, Corredor Sur Oriental hasta Guamaní',
      services: [
        { code: 'E3', from: 'Marín Central', to: 'Río Coca' },
        { code: 'E2', from: 'Marín Central', to: 'Río Coca', label: 'E2 (Quitumbe – Río Coca)' },
        { code: 'E1-M', from: 'Terminal Guamaní', to: 'Marín Central' },
        { code: 'E1', from: 'Terminal Guamaní', to: 'Casa de la Cultura', label: 'E1 (Guamaní – De las Universidades)' }
      ],
      stations: [
        ['Río Coca', -0.16280, -78.47590],
        ['Los Sauces', -0.16600, -78.47700],
        ['Jipijapa (Ecovía)', -0.17000, -78.47820],
        ['Naciones Unidas (Ecovía)', -0.17720, -78.47960],
        ['Eloy Alfaro', -0.18250, -78.48100],
        ['La Paz', -0.18840, -78.48450],
        ['Baca Ortiz', -0.20080, -78.48950],
        ['Casa de la Cultura', -0.20800, -78.49340],
        ['Manuela Cañizares', -0.21420, -78.50040],
        ['Marín Central', -0.22060, -78.50720],
        ['Colegio Montúfar', -0.23800, -78.51500],
        ['Teatro México', -0.24250, -78.51480],
        ['Estadio Chimbacalle', -0.24600, -78.51350],
        ['Puente de Guajaló', -0.28000, -78.52950],
        ['El Comercio', -0.28500, -78.53050],
        ['Eplicachima', -0.29000, -78.53150],
        ['Otoya', -0.29500, -78.53220],
        ['Simón Bolívar', -0.30100, -78.53300],
        ['El Beaterio', -0.30600, -78.53450],
        ['Nueva Aurora II', -0.31100, -78.53650],
        ['Santo Tomás', -0.31600, -78.53900],
        ['El Capulí', -0.32100, -78.54200],
        ['Guayanay Ñan', -0.32550, -78.54450],
        ['Caupicho', -0.32950, -78.54650],
        ['La Bretaña', -0.33350, -78.54850],
        ['San José de Guamaní', -0.33750, -78.55050],
        ['Terminal Guamaní', -0.34100, -78.55250]
      ]
    },
    {
      id: 'ccn', mode: 'ccn', kind: 'troncal',
      name: 'Metrobús · Corredor Central Norte', short: 'Metrobús', color: '#6A4C93',
      speedKmh: 16, waitMin: 7, hours: '06:00 – 22:00',
      via: 'Av. La Prensa, Av. América, Universitaria, hasta el Playón de la Marín',
      note: 'Corredor operado por cooperativas privadas: confirma el destino en el letrero.',
      stations: [
        ['La Ofelia', -0.11100, -78.49750],
        ['Cotocollao', -0.11950, -78.49620],
        ['La Concepción', -0.14300, -78.49350],
        ['Pinar Alto', -0.15050, -78.49480],
        ['Pinar Bajo', -0.15750, -78.49580],
        ['El Bosque', -0.16450, -78.49780],
        ['Quito Tennis', -0.17150, -78.49750],
        ['Granda Centeno', -0.17900, -78.49650],
        ['Iñaquito Alto', -0.18450, -78.49750],
        ['Mañosca', -0.19000, -78.49850],
        ['La Gasca', -0.19600, -78.49950],
        ['Universidad Central (Av. América)', -0.20100, -78.50150],
        ['Eugenio Espejo', -0.21000, -78.49900],
        ['Consejo Provincial', -0.21550, -78.50300],
        ['Playón de la Marín', -0.21950, -78.50680]
      ]
    },
    {
      id: 'cso', mode: 'cso', kind: 'corredor', dense: true,
      name: 'Corredor Sur Occidental (Av. Mariscal Sucre)', short: 'Sur Occidental', color: '#1C7C8C',
      speedKmh: 15, waitMin: 8, hours: '05:30 – 21:30',
      via: 'Av. Mariscal Sucre (Occidental) entre Quitumbe y el centro-norte',
      codes: 'Rutas R3, R13, R15, R17, R20, R21, A5, A8 y otras (21 rutas)',
      note: 'Buses urbanos del corredor: mira el código de ruta (R…) y el destino en el letrero.',
      stations: [
        ['Universidad Central (Av. Universitaria)', -0.20050, -78.50500],
        ['San Juan (Av. Mariscal Sucre)', -0.21200, -78.51600],
        ['El Tejar (Av. Mariscal Sucre)', -0.21900, -78.52000],
        ['San Diego (Av. Mariscal Sucre)', -0.22750, -78.52300],
        ['La Magdalena (Av. Mariscal Sucre)', -0.23800, -78.53000],
        ['Mena Dos (Av. Mariscal Sucre)', -0.25600, -78.54200],
        ['Chillogallo (Av. Mariscal Sucre)', -0.27900, -78.55500],
        ['Terminal Quitumbe (Sur Occidental)', -0.29800, -78.55650]
      ]
    },

    /* ---- Alimentadores del Trolebús y la Ecovía (pasaje integrado en la estación) ---- */
    feeder('LB03', 'Rumiñahui', 'El Labrador (Trole)', [['Barrio Rumiñahui', -0.12900, -78.48900]]),
    feeder('LB04', 'Kennedy', 'El Labrador (Trole)', [['Ciudadela Kennedy', -0.14100, -78.47750]]),
    feeder('LB05', 'Comité del Pueblo', 'El Labrador (Trole)', [['Av. Eloy Alfaro (Kennedy)', -0.13800, -78.47300], ['Comité del Pueblo', -0.12250, -78.46500]]),
    feeder('LB06', 'Los Laureles', 'El Labrador (Trole)', [['Av. Río Coca y Eloy Alfaro', -0.16000, -78.47450], ['Los Laureles', -0.15400, -78.46900]]),
    feeder('LB10', 'Cotocollao', 'El Labrador (Trole)', [['Av. La Prensa (La Concepción)', -0.14000, -78.49250], ['Cotocollao', -0.11800, -78.49900]]),
    feeder('LB44', 'Carcelén', 'El Labrador (Trole)', [['Av. Eloy Alfaro (El Inca)', -0.12000, -78.47700], ['Carcelén', -0.09900, -78.47900]]),
    feeder('IN62', 'Terminal Río Coca', 'El Labrador (Trole)', [['Terminal Río Coca (alimentador)', -0.16250, -78.47620]], 'Conecta Trolebús y Ecovía'),
    feeder('RE13', 'Oriente Quiteño', 'El Recreo (Trole)', [['Oriente Quiteño', -0.25200, -78.50300]]),
    feeder('RE14', 'Lucha de los Pobres', 'El Recreo (Trole)', [['Av. Pedro Vicente Maldonado (Recreo sur)', -0.26200, -78.51700], ['Lucha de los Pobres', -0.27600, -78.51700]]),
    feeder('RE15', 'Ferroviaria', 'El Recreo (Trole)', [['La Ferroviaria', -0.24400, -78.50600]]),
    feeder('RE26', 'Argelia', 'El Recreo (Trole)', [['La Argelia', -0.26400, -78.51000]]),
    feeder('', 'Solanda', 'El Recreo (Trole)', [['Solanda (alimentador)', -0.26800, -78.54000]]),
    feeder('', 'Chillogallo', 'El Recreo (Trole)', [['Av. Teniente Hugo Ortiz', -0.26300, -78.54400], ['Chillogallo', -0.28300, -78.55600]]),
    feeder('MG16', 'Forestal – Chimbacalle', 'La Magdalena', [['Chimbacalle (alimentador)', -0.24150, -78.51500], ['La Forestal', -0.25700, -78.51200]], 'Sale de la estación La Magdalena del Metro'),
    feeder('MV08', 'Martha Bucaram', 'Morán Valverde (Trole)', [['Martha Bucaram', -0.30200, -78.53500]]),
    feeder('MV45', 'Girón del Sur – Huarcay', 'Morán Valverde (Trole)', [['Girón del Sur', -0.30500, -78.55000], ['Huarcay', -0.31200, -78.55500]]),
    feeder('', 'Ciudadela del Ejército', 'Morán Valverde (Trole)', [['Ciudadela del Ejército', -0.29300, -78.53300]]),
    feeder('', 'Guamaní', 'Morán Valverde (Trole)', [['San Martín de Porres', -0.31200, -78.54800], ['Guamaní', -0.33000, -78.54900]]),

    /* ---- Buses urbanos que conectan con el Metro (rutas 2024–2025) ---- */
    bus('atucucho', 'Atucucho – El Labrador', [['Atucucho', -0.12500, -78.51100], ['Av. Mariscal Sucre (norte)', -0.13800, -78.50200], ['El Labrador (bus)', -0.15450, -78.48800]], 'Termina en la estación multimodal El Labrador (Metro, Trole, Ecovía)'),
    bus('pulida', 'La Pulida – El Labrador', [['La Pulida', -0.13300, -78.50400], ['El Labrador (bus)', -0.15450, -78.48800]]),
    bus('carmen', 'Carmen Bajo – El Labrador', [['Carmen Bajo', -0.11200, -78.50700], ['Av. La Prensa (Cotocollao)', -0.12600, -78.49600], ['El Labrador (bus)', -0.15450, -78.48800]]),
    bus('roldos-lab', 'Roldós – Condado – El Labrador', [['Roldós', -0.10800, -78.51100], ['El Condado', -0.10300, -78.49600], ['Av. La Prensa (La Ofelia)', -0.11300, -78.49600], ['El Labrador (bus)', -0.15450, -78.48800]]),
    bus('roldos-car', 'Roldós – La Carolina', [['Roldós', -0.10800, -78.51100], ['Av. Mariscal Sucre (Occidental norte)', -0.14000, -78.50400], ['Av. Mariana de Jesús (Occidental)', -0.17800, -78.50200], ['La Carolina (bus)', -0.18300, -78.48450]], 'Termina en la superficie de la estación La Carolina del Metro'),
    bus('atucucho-comite', 'Atucucho – Comité del Pueblo', [['Atucucho', -0.12500, -78.51100], ['Av. La Prensa (Cotocollao)', -0.12600, -78.49600], ['Av. Eloy Alfaro (El Inca)', -0.12000, -78.47700], ['Comité del Pueblo', -0.12250, -78.46500]]),
    bus('chillos-arbolito', 'Valle de los Chillos – El Arbolito', [['Sangolquí', -0.33000, -78.44800], ['San Rafael', -0.30200, -78.45000], ['El Trébol', -0.22900, -78.50500], ['Coliseo Rumiñahui (Av. Velasco Ibarra)', -0.21850, -78.50000], ['El Arbolito (Av. 12 de Octubre y Tarqui)', -0.21000, -78.49550]],
      'Conecta con la estación El Ejido del Metro y las universidades (Salesiana, Católica)', 'inter'),
    bus('cumbaya-uce', 'Cumbayá – Universidad Central (Trans Floresta)', [['Cumbayá (parque)', -0.20050, -78.43300], ['Av. Interoceánica (Guápulo)', -0.20100, -78.46400], ['La Floresta', -0.20700, -78.48350], ['Av. 12 de Octubre', -0.20850, -78.49300], ['Universidad Central (bus)', -0.20050, -78.50300]],
      'Conecta con la estación Universidad Central del Metro', 'inter'),

    /* ---- Buses interparroquiales (verdes) y al aeropuerto ---- */
    bus('coca-tumbaco', 'Río Coca – Cumbayá – Tumbaco', [['Terminal Río Coca (buses verdes)', -0.16300, -78.47550], ['Av. de los Granados', -0.16900, -78.46200], ['Cumbayá', -0.20050, -78.43300], ['Tumbaco', -0.21100, -78.40100]],
      'Buses verdes. Los que dicen Tumbaco, Pifo, Puembo, Yaruquí o El Quinche pasan por Cumbayá', 'inter'),
    bus('aeropuerto', 'El Labrador – Río Coca – Aeropuerto', [['El Labrador (bus)', -0.15450, -78.48800], ['Terminal Río Coca (buses verdes)', -0.16300, -78.47550], ['Cumbayá (Ruta Viva)', -0.19500, -78.42500], ['Puembo', -0.17600, -78.36100], ['Aeropuerto Mariscal Sucre', -0.12900, -78.35800]],
      'Cada 20–25 min (Reina del Quinche, Puembo, Yaruquí)', 'inter', true),
    bus('quitumbe-aero', 'Terminal Quitumbe – Aeropuerto', [['Terminal Quitumbe (buses al aeropuerto)', -0.29850, -78.55550], ['Aeropuerto Mariscal Sucre', -0.12900, -78.35800]],
      'Todos los días 05:00–22:00, cada 10–15 min', 'inter', true),
    bus('carcelen-aero', 'Terminal Carcelén – Aeropuerto', [['Terminal Carcelén (buses al aeropuerto)', -0.09500, -78.47200], ['Aeropuerto Mariscal Sucre', -0.12900, -78.35800]],
      'Lun–sáb 05:30–21:20, dom 06:00–20:20, cada 12–15 min', 'inter', true),
    bus('marin-conocoto', 'La Marín – Conocoto', [['Playón de la Marín (buses al valle)', -0.21950, -78.50650], ['El Trébol', -0.22900, -78.50500], ['Conocoto', -0.29300, -78.48000]], 'Buses verdes al Valle de los Chillos', 'inter'),
    bus('marin-sangolqui', 'La Marín – San Rafael – Sangolquí', [['Playón de la Marín (buses al valle)', -0.21950, -78.50650], ['El Trébol', -0.22900, -78.50500], ['San Rafael', -0.30200, -78.45000], ['Sangolquí', -0.33000, -78.44800]], 'Buses verdes por la Autopista General Rumiñahui', 'inter'),
    bus('ofelia-mitad', 'La Ofelia – Mitad del Mundo', [['La Ofelia (andén Mitad del Mundo)', -0.11100, -78.49700], ['Pomasqui', -0.05000, -78.45600], ['Mitad del Mundo', -0.00250, -78.45600]], 'Sale de la estación La Ofelia del Metrobús', 'inter'),
    bus('ofelia-calderon', 'La Ofelia – Carcelén – Calderón', [['La Ofelia (andén Calderón)', -0.11100, -78.49700], ['Terminal Carcelén', -0.09500, -78.47200], ['Calderón', -0.09850, -78.42200]], '', 'inter'),
    bus('carapungo-ejido', 'Carapungo – El Ejido', [['Carapungo', -0.09900, -78.44700], ['Av. Eloy Alfaro y Granados', -0.16000, -78.47000], ['Av. Eloy Alfaro y Amazonas', -0.18400, -78.48600], ['El Ejido (bus)', -0.20700, -78.49600]], 'Cooperativa Transporsel')
  ];

  /** Alimentador: sale de una estación troncal y va a un barrio (pasaje integrado). */
  function feeder(code, name, stationName, pts, note) {
    var st = findStation(stationName);
    return {
      id: 'alim-' + (code || name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      mode: 'alim', kind: 'alimentador', dense: true, code: code,
      name: 'Alimentador ' + (code ? code + ' · ' : '') + stationName.replace(' (Trole)', '') + ' – ' + name,
      short: code ? 'Alimentador ' + code : 'Alimentador ' + name,
      color: '#4F6DB8', speedKmh: 16, waitMin: 9, hours: '05:30 – 22:00',
      note: note || ('Sale de la estación ' + stationName.replace(' (Trole)', '') + '. Pasaje integrado con el Trolebús.'),
      stations: [[stationName.replace(' (Trole)', '') + ' (andén ' + (code || name) + ')', st[1], st[2]]].concat(pts)
    };
  }

  /** Bus urbano o interparroquial con nombre de ruta. */
  function bus(id, name, pts, note, mode, express) {
    var inter = mode === 'inter';
    return {
      id: 'bus-' + id, mode: inter ? 'inter' : 'bus', kind: inter ? 'interparroquial' : 'urbano', dense: !express,
      name: (inter ? 'Bus interparroquial · ' : 'Bus urbano · ') + name, short: 'Bus ' + name,
      color: inter ? '#3D8B37' : '#3A5BA0', speedKmh: inter ? 22 : 15, waitMin: inter ? 14 : 10,
      hours: inter ? '05:30 – 21:00' : '05:30 – 21:30', note: note || '', stations: pts
    };
  }

  function findStation(name) {
    var st = STATION_INDEX[name];
    if (!st) throw new Error('Estación desconocida en data.js: ' + name);
    return st;
  }

  // Lugares de referencia para sugerencias rápidas (aproximados).
  var PLACES = [
    { name: 'Universidad Central del Ecuador', lat: -0.19980, lon: -78.50380, type: 'estudio' },
    { name: 'PUCE (Pontificia Universidad Católica)', lat: -0.20990, lon: -78.49210, type: 'estudio' },
    { name: 'Escuela Politécnica Nacional', lat: -0.21070, lon: -78.48970, type: 'estudio' },
    { name: 'Universidad Politécnica Salesiana (El Girón)', lat: -0.21000, lon: -78.48850, type: 'estudio' },
    { name: 'USFQ (Cumbayá)', lat: -0.19700, lon: -78.43500, type: 'estudio' },
    { name: 'Colegio Mejía', lat: -0.21500, lon: -78.50610, type: 'estudio' },
    { name: 'Colegio Montúfar', lat: -0.24030, lon: -78.52010, type: 'estudio' },
    { name: 'Colegio 24 de Mayo', lat: -0.20180, lon: -78.49450, type: 'estudio' },
    { name: 'Parque La Carolina', lat: -0.18270, lon: -78.48450, type: 'lugar' },
    { name: 'Parque El Ejido', lat: -0.20750, lon: -78.49620, type: 'lugar' },
    { name: 'Centro Histórico (Plaza Grande)', lat: -0.22000, lon: -78.51230, type: 'lugar' },
    { name: 'C.C. El Recreo', lat: -0.25160, lon: -78.52260, type: 'lugar' },
    { name: 'C.C. Quicentro Sur', lat: -0.28500, lon: -78.54360, type: 'lugar' },
    { name: 'Terminal Quitumbe', lat: -0.29820, lon: -78.55560, type: 'lugar' },
    { name: 'Terminal Carcelén', lat: -0.09450, lon: -78.47280, type: 'lugar' },
    { name: 'Terminal Río Coca', lat: -0.16280, lon: -78.47590, type: 'lugar' },
    { name: 'Aeropuerto Mariscal Sucre (Tababela)', lat: -0.12900, lon: -78.35800, type: 'lugar' },
    { name: 'Mitad del Mundo', lat: -0.00250, lon: -78.45600, type: 'lugar' },
    { name: 'Solanda', lat: -0.26700, lon: -78.54000, type: 'lugar' },
    { name: 'La Magdalena', lat: -0.23900, lon: -78.52400, type: 'lugar' },
    { name: 'Iñaquito', lat: -0.17600, lon: -78.48500, type: 'lugar' },
    { name: 'Cumbayá', lat: -0.20050, lon: -78.43300, type: 'lugar' },
    { name: 'Sangolquí', lat: -0.33000, lon: -78.44800, type: 'lugar' },
    { name: 'Conocoto', lat: -0.29300, lon: -78.48000, type: 'lugar' },
    { name: 'Guamaní', lat: -0.33000, lon: -78.54900, type: 'lugar' },
    { name: 'Calderón', lat: -0.09850, lon: -78.42200, type: 'lugar' }
  ];

  var EMERGENCY = [
    { name: 'ECU 911 (emergencias)', phone: '911' }
  ];

  var QUITO_CENTER = { lat: -0.2050, lon: -78.4950 };
  var QUITO_BOUNDS = { south: -0.42, west: -78.62, north: 0.03, east: -78.30 };

  global.TSData = {
    LINES: LINES,
    PLACES: PLACES,
    EMERGENCY: EMERGENCY,
    QUITO_CENTER: QUITO_CENTER,
    QUITO_BOUNDS: QUITO_BOUNDS,
    SOURCES_CHECKED: '2026-10'
  };
})(typeof window !== 'undefined' ? window : globalThis);
