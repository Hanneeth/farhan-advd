/* Foundations for Lectures 11–12: triode sensing, the CMFB loop as feedback, the pinned-CM equation, replica CMFB. */
'use strict';
const L11 = 'Lec 11–12 · Foundations';

/* telescopic with a triode-sensing tail; names per page/question */
function triodeTele(S, n) {
  const g = S.g(); const r = S.into(g);
  rail(S, 380, 1000, 150);
  const L = 560, R = 840;
  const row = (y, a, b, p, gate) => {
    const A = fet(S, L, y, { p, name: a, right: true, gl: 26, nameSide: 'l' });
    const B = fet(S, R, y, { p, name: b, gl: 26, nameSide: 'r' });
    wire(S, [[A.gate[0], y], [B.gate[0], y]]); txt(S, 700, y - 9, gate, { size: 18, color: C.muted, anchor: 'middle' });
  };
  row(205, n.top[0], n.top[1], true, 'V_b4'); wire(S, [[L, 150], [L, 155]]); wire(S, [[R, 150], [R, 155]]);
  wire(S, [[L, 255], [L, 265]]); wire(S, [[R, 255], [R, 265]]);
  row(315, n.pc[0], n.pc[1], true, 'V_b3');
  wire(S, [[L, 365], [L, 400]]); wire(S, [[R, 365], [R, 400]]); dot(S, L, 382); dot(S, R, 382);
  txt(S, L - 14, 370, 'V_out1', { size: 19, color: C.volt, weight: 700, anchor: 'end' }); txt(S, R + 14, 370, 'V_out2', { size: 19, color: C.volt, weight: 700 });
  row(450, n.nc[0], n.nc[1], false, 'V_b2');
  wire(S, [[L, 500], [L, 510]]); wire(S, [[R, 500], [R, 510]]);
  row(560, n.inp[0], n.inp[1], false, 'V_b1');
  wire(S, [[L, 610], [L, 650], [R, 650], [R, 610]]); dot(S, 700, 650); txt(S, 700, 640, 'P', { size: 20, color: C.bad, weight: 750, anchor: 'middle' });
  const ta = nmos(S, 620, 720, { name: n.tri[0], gl: 30, nameSide: 'r' }); const tb = nmos(S, 780, 720, { name: n.tri[1], right: true, gl: 30, nameSide: 'l' });
  wire(S, [[620, 670], [620, 650]]); wire(S, [[780, 670], [780, 650]]); gnd(S, 620, 770); gnd(S, 780, 770);
  wire(S, [[ta.gate[0], 720], [445, 720], [445, 382], [L, 382]], { color: C.volt });
  wire(S, [[tb.gate[0], 720], [955, 720], [955, 382], [R, 382]], { color: C.volt });
  r();
  return g;
}

scene(L11, 'A transistor in deep triode is a resistor', 60, (S) => {
  header(S, 'LEC 11 · YOUR PAGE, RIGHT', 'Small V_DS: the triode equation becomes Ohm’s law');
  const ln = [
    ['I_D = \\tfrac12\\mu_nC_{ox}\\tfrac{W}{L}\\left[2(V_{GS}-V_{th})V_{DS} - V_{DS}^2\\right]', 0.4, 'The triode equation (your page). Now make $V_{DS}$ tiny — tens of millivolts.'],
    ['I_D \\approx \\mu_nC_{ox}\\tfrac{W}{L}(V_{GS}-V_{th})\\,V_{DS}', 7, 'Then $V_{DS}^2$ is negligible next to $2(V_{GS}-V_{th})V_{DS}$: drop it. The current is <b>proportional to $V_{DS}$</b>.'],
    ['R_{on} = \\frac{V_{DS}}{I_D} = \\frac{1}{\\mu_nC_{ox}\\tfrac{W}{L}(V_{GS}-V_{th})}', 13, 'A current proportional to the voltage is a <b>resistor</b>: $R_{on} = 1/(\\mu_nC_{ox}\\tfrac WL(V_{GS}-V_{th}))$.'],
  ];
  ln.forEach(([tex, t, say], i) => { eqAt(S, tex, 450, 220 + i * 110, t, { size: 30, w: 820, color: i === 2 ? '#ffd38a' : C.text }); S.say(t, say); });
  // ID-VDS curves
  const x0 = 960, y0 = 620;
  const ax = axes(S, x0, y0, 560, 440, { x: 'V_DS', y: 'I_D' }); S.fade(ax, 2, 0.6);
  const mk = (k, col, t) => { const vs = 120 * k; const c = curve(S, (x) => { const v = x - x0; return y0 - (v < vs ? (2 * vs * v - v * v) / vs * 0.9 * k / 2 * 1.6 : vs * 0.9 * k / 2 * 1.6 + (v - vs) * 0.03); }, x0, x0 + 540, { color: col }); S.draw(c, t, 1.4); return c; };
  mk(1, C.n, 3); mk(1.4, C.p, 3.6); mk(1.8, C.amb, 4.2);
  [[1, C.n], [1.4, C.p], [1.8, C.amb]].forEach(([k, col]) => { const ln = S.el('line', { x1: x0, y1: y0, x2: x0 + 70, y2: y0 - 1.44 * k * 70, stroke: col, 'stroke-width': 2, 'stroke-dasharray': '5 4' }); S.fade(ln, 23, 0.6); });
  label(S, x0 + 470, 360, 'bigger V_GS', 4.2, { size: 18, color: C.amb });
  S.say(19, 'On the $I_D$–$V_{DS}$ curves (your sketch): near the origin each curve is a <b>straight line</b> through zero. Its slope is $1/R_{on}$.');
  S.cam(22, 3, x0 + 90, y0 - 90, 2.6);
  S.cam(32, 2.5, 800, 450, 1);
  S.say(22, 'Zoom in: every curve is a line. A bigger $V_{GS}$ gives a steeper line — a smaller resistance. <b>The gate controls the resistance.</b>');
  whyBox(S, 120, 610, 760, 200, '**Saturation:** a voltage-controlled **current source** (VCCS), $I_D = \\tfrac12\\mu_nC_{ox}\\tfrac WL(V_{GS}-V_{th})^2$. **Deep triode:** a voltage-controlled **resistor**. CMFB uses the second one to sense the output CM.', 35);
  S.say(35, 'Your page’s one-liner: in saturation a MOSFET is a voltage-controlled <b>current source</b>; in deep triode it is a voltage-controlled <b>resistor</b>. Lectures 11–12 use the resistor.');
});

/* ── Follow the current: telescopic with a triode tail (Tutorial 5 Q1 numbers: 0.5 mA per branch) ── */
scene(L11, 'Follow the current: telescopic with a triode tail', 74, (S) => {
  header(S, 'LEC 11 · FOLLOW THE CURRENT', 'Where the 0.5 mA of each column goes, and how it meets at P');
  const ID = 0.5e-3; // Tutorial 5 Q1: each branch carries 0.5 mA
  const g = triodeTele(S, { top: ['M8', 'M9'], pc: ['M6', 'M7'], nc: ['M4', 'M5'], inp: ['M2', 'M3'], tri: ['M10', 'M11'] });
  g.setAttribute('transform', 'translate(-300 30)');
  S.draw(g, 0.3, 2.6);
  S.say(0.3, 'Let us follow the current in Lecture 11’s telescopic, with the numbers of Tutorial 5 Question 1: each column carries half a milliamp.');
  // columns: top part (V_DD → output) and bottom part (output → P)
  const LX = 260, RX = 540, YO = 412, YP = 680;
  current(S, [[LX, 180], [LX, YO]], 5, null, 'I_D = 0.5 mA', { color: C.p, at: [110, 300] });
  current(S, [[RX, 180], [RX, YO]], 7, null, 'I_D = 0.5 mA', { color: C.n, at: [700, 300] });
  S.say(5, 'Start at the top. M8 and M9 have a fixed gate bias, so they are current sources: each pushes half a milliamp down its own column. A PMOS conducts from its source at the supply to its drain, so the current flows down.');
  current(S, [[LX, YO], [LX, YP]], 13, 28, 'I_D', { color: C.p, at: [110, 590] });
  current(S, [[RX, YO], [RX, YP]], 13, 28, 'I_D', { color: C.n, at: [700, 590] });
  S.say(13, 'Nothing leaves the column on the way down. The same current passes the output node, then the NMOS cascode and the input device. An NMOS conducts from drain to source: down again.');
  label(S, 40, 470, 'gates draw', 19, { size: 16, color: C.volt, out: 27 }); label(S, 40, 490, 'no current', 19, { size: 16, color: C.volt, out: 27 });
  S.say(19, 'The blue wires from the outputs to the gates of M10 and M11 carry a voltage, not a current: a gate draws no current.');
  S.ring(400, 680, 20, C.amb, 23, 6);
  eqAt(S, 'I_{D2} + I_{D3} = I_{D10} + I_{D11}', 1140, 230, 23, { size: 30, w: 760 });
  S.say(23, 'At node P the two columns meet. Kirchhoff’s current law: whatever flows into P must flow out, and the only way out is down through the triode devices M10 and M11.');
  S.stop(26, {
    q: 'Both outputs sit at the same voltage, and each column carries $I_D = 0.5$ mA. How much current flows from P to ground through M10 and M11 **together**?',
    hint: ['Use KCL at node P: everything that arrives must leave. Gates draw no current.', '$I_{D10} + I_{D11} = I_{D2} + I_{D3}$, and each input device carries one column current $I_D$.'],
    how: [
      'Each column brings its whole current down to P: $$I_{D2} = I_{D3} = I_D = 0.5\\,\\mathrm{mA}$$',
      'Nothing else connects to P (the gate wires carry no current), so KCL at P gives $$I_{D10} + I_{D11} = I_{D2} + I_{D3} = 0.5 + 0.5 = 1\\,\\mathrm{mA}$$',
      'With equal outputs, M10 and M11 have equal gate voltages, so they are equal resistors and take **0.5 mA each**.',
    ],
    why: 'The tail current is the sum of the column currents: $2I_D$. Here nobody “sets” the tail; the top sources do.',
    answer: 2 * ID, unit: 'A', tol: 0.02,
  });
  const pc = chip(S, 400, 622, '2I_D = 1 mA', { color: C.amb, size: 17 }); pc.style.opacity = 0; S.fade(pc, 26.5, 0.5); S.out(pc, 32, 0.4);
  current(S, [[320, YP], [320, 800]], 26.5, null, 'I_D10 = 0.5 mA', { color: C.p, at: [215, 845] });
  current(S, [[480, YP], [480, 800]], 26.5, null, 'I_D11 = 0.5 mA', { color: C.n, at: [585, 845] });
  eqAt(S, '= 0.5 + 0.5 = 1\\,\\mathrm{mA}', 1140, 300, 26.5, { size: 30, w: 760, color: '#ffd38a' });
  S.say(26.5, 'One milliamp arrives at P. With equal outputs, M10 and M11 are equal resistors, so they split it equally: half a milliamp each, down to ground.');
  // small differential input
  current(S, [[LX, YO], [LX, YP]], 33, null, 'I_D + ΔI', { color: C.p, at: [100, 590] });
  current(S, [[RX, YO], [RX, YP]], 33, null, 'I_D − ΔI', { color: C.n, at: [705, 590] });
  S.say(33, 'Now add a small differential input: the input device M2 takes a little more, I D plus delta I, and M3 a little less, I D minus delta I.');
  S.stop(37, {
    q: 'With this small differential input, what happens to the **total** current flowing from P to ground?',
    choices: ['It stays $2I_D$ = 1 mA', 'It rises by $\\Delta I$', 'It rises by $2\\Delta I$', 'It falls by $\\Delta I$'], answer: 0,
    hint: ['Add the two currents that arrive at P.', '$(I_D + \\Delta I) + (I_D - \\Delta I) = \\;?$'],
    how: [
      'KCL at P: the total leaving equals the sum arriving: $$I_{tail} = (I_D + \\Delta I) + (I_D - \\Delta I) = 2I_D = 1\\,\\mathrm{mA}$$',
      'The $+\\Delta I$ and $-\\Delta I$ cancel: a differential input only **moves** current from one side to the other.',
      '“Rises by $\\Delta I$” is the trap of looking at one side only.',
    ],
    why: 'Differential signal: one side $+\\Delta I$, the other $-\\Delta I$, the total never changes.',
  });
  eqAt(S, '(I_D + \\Delta I) + (I_D - \\Delta I) = 2I_D', 1140, 400, 37.5, { size: 30, w: 760, color: '#ffd38a' });
  S.say(37.5, 'Add them at P: plus delta I and minus delta I cancel. The total stays at one milliamp; the input only moves current from one side to the other.');
  const v1 = chip(S, 100, 440, 'V_out1 ↓', { color: C.bad, size: 17 }); v1.style.opacity = 0; S.fade(v1, 44, 0.5);
  const v2 = chip(S, 705, 440, 'V_out2 ↑', { color: C.ok, size: 17 }); v2.style.opacity = 0; S.fade(v2, 44, 0.5);
  whyBox(S, 900, 480, 640, 150, 'The top source still gives exactly $I_D$, but the input device takes $I_D + \\Delta I$: the missing $\\Delta I$ is pulled **out of the output node**, so $V_{out1}$ falls. On the right, $V_{out2}$ rises.', 44);
  S.say(44, 'But the PMOS source on top still gives exactly I D. The extra delta I on the left has to come out of the output node, so V out 1 falls, and on the right V out 2 rises. That current mismatch is the output signal.');
  S.say(54, 'And the tail? V out 1 down makes M10 a bigger resistor, V out 2 up makes M11 a smaller one: the split under P shifts, but the sum still matches one milliamp.');
  remember(S, [
    'The **top sources** (M8, M9) set the current: $I_D$ = 0.5 mA per column, flowing **down** (PMOS: source → drain; NMOS: drain → source).',
    'Gates draw **no current**: the wires from the outputs to M10, M11 carry a voltage only.',
    'KCL at P: $I_{D10} + I_{D11} = I_{D2} + I_{D3} = 2I_D$ = 1 mA.',
    'Equal outputs ⇒ equal triode resistors ⇒ 0.5 mA each.',
    'Differential input: $I_D \\pm \\Delta I$ in the pair, the total stays $2I_D$; the mismatch with the top source moves the outputs.',
  ], 62, 'Follow the current · triode-tail telescopic');
});

scene(L11, 'Triode sensing: the outputs drive the tail resistors', 72, (S) => {
  header(S, 'LEC 11 · YOUR PAGE, TOP', 'M10, M11 in deep triode: only V_out1 + V_out2 matters');
  const g = triodeTele(S, { top: ['M8', 'M9'], pc: ['M6', 'M7'], nc: ['M4', 'M5'], inp: ['M2', 'M3'], tri: ['M10', 'M11'] });
  g.setAttribute('transform', 'translate(-300 30)');
  S.draw(g, 0.3, 2.6);
  S.say(0.3, 'Your page’s circuit: a telescopic op amp whose tail is two transistors M10, M11 in <b>deep triode</b>, with their gates driven by the two <b>outputs</b>.');
  S.say(7, 'They sit between node P and ground with only a tiny $V_{DS}$ (= $V_P$), so each is a resistor set by its gate — that is, by an output voltage.');
  const ln = [
    ['R_{tot,P} = R_{on10}\\parallel R_{on11}', 12],
    ['\\frac{1}{R_{tot,P}} = \\mu_nC_{ox}\\tfrac WL\\left[(V_{out1}-V_{th}) + (V_{out2}-V_{th})\\right]', 16],
    ['R_{tot,P} = \\frac{1}{\\mu_nC_{ox}(W/L)(V_{out1}+V_{out2}-2V_{th})}', 21],
  ];
  ln.forEach(([tex, t], i) => eqAt(S, tex, 1160, 220 + i * 100, t, { size: 28, w: 800, color: i === 2 ? '#ffd38a' : C.text }));
  S.say(12, 'In parallel, conductances add: $1/R_{tot} = 1/R_{on10} + 1/R_{on11}$…');
  S.say(16, '…each conductance is $\\mu_nC_{ox}\\tfrac WL(V_{GS}-V_{th})$ with $V_{GS}$ = an output…');
  S.say(21, '…so only the <b>sum</b> $V_{out1}+V_{out2}$ appears — twice the output CM.');
  // DM vs CM bars
  const bx = 1060, by = 840;
  const bar = (x, col) => S.el('rect', { x, y: by, width: 50, height: 0, rx: 6, fill: col });
  const b1 = bar(bx, C.n), b2 = bar(bx + 70, C.p), bt = bar(bx + 180, C.amb);
  txt(S, bx + 25, by + 26, 'G10', { size: 18, color: C.n, anchor: 'middle' }); txt(S, bx + 95, by + 26, 'G11', { size: 18, color: C.p, anchor: 'middle' }); txt(S, bx + 205, by + 26, 'total', { size: 18, color: C.amb, anchor: 'middle' });
  const set = (b, h) => { b.setAttribute('y', by - h); b.setAttribute('height', h); };
  S.anim(26, 1e4, 'bars', (_p, t) => {
    let d = 0, c = 0;
    if (t > 28 && t < 38) d = 40 * Math.sin((t - 28) * 1.6);
    if (t > 40) c = 50 * Math.sin(Math.min(1, (t - 40) / 3) * Math.PI / 2);
    set(b1, 60 + 0.6 * d + 0.6 * c); set(b2, 60 - 0.6 * d + 0.6 * c); set(bt, 120 + 1.2 * c);
  }, E.lin);
  S.say(28, 'Watch the conductances. A <b>differential</b> signal raises one output and lowers the other: G10 grows, G11 shrinks by the same amount — the total does not move. The sensor ignores the signal.');
  S.say(40, 'A <b>common-mode</b> rise raises both: the total conductance grows, $R_{tot}$ falls, the tail pulls harder, and the outputs are pulled back down. Feedback, built right into the tail.');
  whyBox(S, 980, 490, 580, 100, '**Triode sensor:** sees the CM, blind to the DM — exactly what a CM sensor must do.', 50);
});

/* pair sensing from your page: followers M1, M2, PMOS pair M3, M4 (gates at V_REF) sharing M5 */
function pairSenseFig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 300, 1160, 160);
  pmos(S, 730, 215, { name: 'M5', gate: 'V_b', gl: 26 }); wire(S, [[730, 160], [730, 165]]);
  wire(S, [[730, 265], [730, 290], [620, 290], [620, 310]]); wire(S, [[730, 290], [840, 290], [840, 310]]);
  txt(S, 860, 214, 'current source of the amplifier', { size: 17, color: C.muted });
  const m3 = pmos(S, 620, 360, { name: 'M3', right: true, gl: 26, nameSide: 'l' }); const m4 = pmos(S, 840, 360, { name: 'M4', gl: 26 });
  wire(S, [[m3.gate[0], 360], [m4.gate[0], 360]]); txt(S, 730, 351, 'V_REF', { size: 18, color: C.amb, anchor: 'middle', weight: 700 });
  const m1 = nmos(S, 440, 330, { name: 'M1', gate: 'V_out1' }); wire(S, [[440, 160], [440, 280]]);
  wire(S, [[440, 380], [440, 440], [620, 440], [620, 410]]); isrc(S, 440, 490, { label: 'I_1', left: true }); gnd(S, 440, 532);
  const m2 = nmos(S, 1020, 330, { name: 'M2', gate: 'V_out2', right: true }); wire(S, [[1020, 160], [1020, 280]]);
  wire(S, [[1020, 380], [1020, 440], [840, 440], [840, 410]]); isrc(S, 1020, 490, { label: 'I_1' }); gnd(S, 1020, 532);
  r();
  return g;
}

/* ── Follow the current: pair sensing (teaching numbers: I_5 = 20 µA, each sink I_1 = 50 µA) ── */
scene(L11, 'Follow the current: sensing with differential pairs', 56, (S) => {
  header(S, 'LEC 11 · FOLLOW THE CURRENT', 'One source on top, two sinks below: every node balances');
  const I5 = 20e-6, I1 = 50e-6; // teaching numbers, stated in the captions and the stop
  const g = pairSenseFig(S);
  S.draw(g, 0.3, 2.2);
  S.say(0.3, 'Follow the current in the pair sensor. Two sources set everything: M5 at the top, and the two sinks I 1 at the bottom. Take M5 as 20 microamps and each sink as 50.');
  current(S, [[730, 160], [730, 290]], 5, null, 'I_5 = 20 µA', { color: C.amb, at: [565, 205] });
  S.say(5, 'M5 is a PMOS with a fixed gate bias: a current source. Its 20 microamps flow down from the supply, source to drain, into the node below it.');
  current(S, [[730, 290], [620, 290], [620, 440], [440, 440]], 10, null, 'I_D3', { color: C.p, at: [530, 476] });
  current(S, [[730, 290], [840, 290], [840, 440], [1020, 440]], 10, null, 'I_D4', { color: C.n, at: [930, 476] });
  eqAt(S, 'I_5 = I_{D3} + I_{D4}', 1360, 260, 10, { size: 30, w: 400 });
  S.say(10, 'At that node it splits: part goes down through M3, the rest through M4. K C L: I 5 equals I D 3 plus I D 4. With equal outputs the circuit is symmetric, so the halves are equal. When the outputs move away from V REF, the split shifts with the square of the difference: that shift is what the sensor measures.');
  current(S, [[440, 160], [440, 440]], 17, null, 'I_D1', { color: C.p, at: [372, 230] });
  current(S, [[1020, 160], [1020, 440]], 17, null, 'I_D2', { color: C.n, at: [1092, 230] });
  current(S, [[440, 440], [440, 532]], 17, null, null, { color: C.cur });
  current(S, [[1020, 440], [1020, 532]], 17, null, null, { color: C.cur });
  eqAt(S, 'I_1 = I_{D1} + I_{D3}', 1360, 340, 17, { size: 30, w: 400 });
  S.say(17, 'Each follower carries its own current from the supply, drain to source. At the follower’s source node it meets M3’s current, and the sink below takes both: I 1 equals I D 1 plus I D 3.');
  S.stop(24, {
    q: 'The outputs are equal. M5 supplies $I_5 = 20\\,\\mu$A and each sink is $I_1 = 50\\,\\mu$A. How much current flows through the follower **M1**?',
    hint: ['First split M5’s current between M3 and M4 (equal outputs ⇒ symmetric). Then use KCL at M1’s source node.', '$I_{D3} = I_5/2$, and $I_1 = I_{D1} + I_{D3}$.'],
    how: [
      'Equal outputs make the circuit symmetric, so M5’s current splits equally: $$I_{D3} = I_{D4} = \\frac{I_5}{2} = \\frac{20\\,\\mu}{2} = 10\\,\\mu\\mathrm A$$',
      'At M1’s source two currents arrive (M1 from above, M3 from the side) and one leaves (the sink): $$I_1 = I_{D1} + I_{D3}$$',
      'Solve for the follower: $$I_{D1} = I_1 - I_{D3} = 50\\,\\mu - 10\\,\\mu = 40\\,\\mu\\mathrm A$$',
    ],
    why: 'A fixed sink shared by two branches: whatever one branch brings, the other gives up.',
    parts: [{ q: 'How much of M5’s current flows through M3?', hint: ['Equal outputs ⇒ the two sides are identical ⇒ equal split.'], how: ['$$I_{D3} = \\frac{I_5}{2} = \\frac{20\\,\\mu}{2}$$'], answer: I5 / 2, unit: 'A', tol: 0.02 }],
    answer: I1 - I5 / 2, unit: 'A', tol: 0.02,
  });
  eqAt(S, 'I_{D3} = I_{D4} = 10\\,\\mu\\mathrm A', 1360, 420, 24.5, { size: 28, w: 400, color: '#ffd38a' });
  eqAt(S, 'I_{D1} = 50 - 10 = 40\\,\\mu\\mathrm A', 1360, 490, 25, { size: 28, w: 400, color: '#ffd38a' });
  S.say(24.5, 'M3 gets 10 microamps, so the follower M1 carries the rest of the sink: 50 minus 10, 40 microamps. The same on the right.');
  whyBox(S, 1160, 560, 400, 200, 'Nobody “chooses” a current: M5 and the sinks **set** it, the branches **share** it. If M3 takes more, M1 must take less.', 31);
  S.say(31, 'The rule for every node: the sources set the currents, the devices only share them. If M3 takes more, M1 must take less, because the sink below is fixed.');
  remember(S, [
    'M5 (PMOS source) sets $I_5$; it flows **down** and splits: $I_5 = I_{D3} + I_{D4}$.',
    'Each sink fixes $I_1$ at a follower’s source: $I_1 = I_{D1} + I_{D3}$ (and $I_1 = I_{D2} + I_{D4}$).',
    'Equal outputs ⇒ symmetric ⇒ $I_{D3} = I_{D4} = I_5/2$.',
    'Directions: PMOS source → drain, NMOS drain → source — both downward from $V_{DD}$ to ground.',
  ], 42, 'Follow the current · pair sensing');
});

scene(L11, 'Sensing with differential pairs (and why it is nonlinear)', 52, (S) => {
  header(S, 'LEC 11 · YOUR PAGE, BOTTOM', 'Pairs compare each output with V_REF: works only for small swings');
  const g = pairSenseFig(S);
  S.draw(g, 0.3, 2.2);
  S.say(0.3, 'Another sensor on your page: followers M1, M2 copy the outputs, and PMOS devices M3, M4 (gates at $V_{REF}$) compare them, sharing the current source M5.');
  eqAt(S, 'I_D \\propto (V_{REF}-V_{out1})^2 + (V_{REF}-V_{out2})^2', 800, 620, 8, { size: 32, w: 900 });
  S.say(8, 'Each device’s current follows the <b>square law</b> of its own difference from $V_{REF}$ — so the sensed current is a sum of <b>squares</b> (your page’s last line).');
  whyBox(S, 360, 700, 880, 140, '**The flaw:** $(a)^2 + (b)^2$ is not a function of $a + b$ alone. For large swings the differential signal leaks into the “CM” reading. **Use it only for small output swings.**', 15);
  S.say(15, 'And a sum of squares does not depend only on the sum of the outputs: for big swings the differential signal leaks into the reading. Good for small swings only.');
  S.say(26, 'Compare the triode sensor, whose reading depends exactly on $V_{out1}+V_{out2}$ (as long as the devices stay in deep triode).');
});

scene(L11, 'CMFB is just a feedback loop (and where it acts)', 58, (S) => {
  header(S, 'LEC 11–12 · FEEDBACK VIEW', 'Same rules as Lec 1: error ≈ 1/(βA)');
  eqAt(S, '\\frac{A}{1+\\beta A}, \\qquad \\varepsilon \\approx \\frac{1}{\\beta A}', 800, 200, 0.4, { size: 46 });
  S.say(0.4, 'Your page writes Lecture 1’s two lines again: the closed-loop result $A/(1+\\beta A)$ and the error $\\approx 1/(\\beta A)$ (circled).');
  S.say(6, 'The CMFB loop is an ordinary negative-feedback loop. How close the output CM gets to $V_{REF}$ depends on its <b>loop gain</b>, just like the gain error of Lecture 1.');
  const tb = html(S, 160, 300, 1280, 330, `<table class="tbl"><tr><th>your circuit</th><th>sensing</th><th>where the correction acts</th></tr>
    <tr><td>folded cascode + error amp</td><td>R₁, R₂ at the outputs</td><td>the input pair’s tail M11 (Lec 11) — or the bottom sources M3, M4 (Lec 12)</td></tr>
    <tr><td>telescopic</td><td>triode M11, M12 at the bottom</td><td>built in: the sensing devices <b>are</b> the tail</td></tr></table>`);
  tb.style.opacity = 0; S.slideIn(tb, 12, 0.8);
  S.say(12, 'Your two circuits: an error amplifier comparing the resistor-sensed CM with $V_{REF}$ and driving a current source; or triode devices that sense and correct in one go.');
  S.say(22, 'Lecture 12 adds that the error amplifier can drive <b>any</b> current source in the output path — the input tail, or the bottom sources. Wherever it acts, it moves a current until $V_{out,CM} = V_{REF}$.');
  whyBox(S, 300, 680, 1000, 130, 'Tutorial 5 Q2 and the 2024 mid-sem Q1 ask for this **loop gain**: break the loop, push a CM change round it, multiply every gain on the way.', 32);
  S.say(32, 'Exam link: the loop gain you computed in Lecture 10’s past papers is exactly this $\\beta A$ of the CM loop.');
});

scene(L11, 'The triode equation pins the output CM', 60, (S) => {
  header(S, 'LEC 12 · YOUR PAGE, TOP', 'V_b1 − V_GS3 = 2I_D R_tot,P  →  solve for V_out1 + V_out2');
  const g = triodeTele(S, { top: ['M9', 'M10'], pc: ['M7', 'M8'], nc: ['M5', 'M6'], inp: ['M3', 'M4'], tri: ['M11', 'M12'] });
  g.setAttribute('transform', 'translate(-300 30)');
  S.fade(g, 0.2, 0.8);
  S.say(0.2, 'Lecture 12’s version (devices renamed: input pair M3, M4 with gates at $V_{b1}$, triode pair M11, M12).');
  S.ring(400, 680, 18, C.bad, 5, 16);
  S.say(5, '<b>Link:</b> node P is M3’s source, one $V_{GS3}$ below its gate: $V_P = V_{b1} - V_{GS3}$. The bias fixes P.');
  S.say(10, '<b>Ohm’s law:</b> the whole tail current $2I_D$ flows through $R_{tot,P}$, so $V_P = 2I_DR_{tot,P}$.');
  const ln = [
    ['V_{b1} - V_{GS3} = 2I_D\\,R_{tot,P}', 5],
    ['= \\frac{2I_D}{\\mu_nC_{ox}(W/L)_{11,12}(V_{out1}+V_{out2}-2V_{th})}', 14],
    ['V_{out1}+V_{out2} = \\frac{2I_D}{\\mu_nC_{ox}(W/L)_{11,12}}\\cdot\\frac{1}{V_{b1}-V_{GS3}} + 2V_{th}', 20],
  ];
  ln.forEach(([tex, t], i) => eqAt(S, tex, 1170, 230 + i * 110, t, { size: i === 2 ? 25 : 28, w: 820, color: i === 2 ? '#ffd38a' : C.text }));
  S.say(14, 'Put in the triode $R_{tot,P}$ from Lecture 11…');
  S.say(20, '…and solve for $V_{out1}+V_{out2}$: the output CM is now <b>fixed by sizes and biases</b>. Questions use it both ways: size W/L for a wanted CM, or find the CM from the sizes.');
  whyBox(S, 860, 600, 700, 200, '**Exam use (Tutorial 5 Q1 = 2025 mid-sem Q4, Quiz 2):** given $V_P$, $I_D$ and the wanted $V_{out,CM}$, find $(W/L)$ of the triode pair; then walk links for the biases.', 30);
  S.say(30, 'This is exactly Tutorial 5 Q1 — asked again as the 2025 mid-sem Q4 — and Quiz 2. Solved below.');
});

/* replica CMFB, simplified from the page */
function replicaFig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 160, 1040, 150);
  // replica branch
  isrc(S, 260, 230, { label: 'I_1', left: true }); wire(S, [[260, 150], [260, 188]]);
  const m14 = nmos(S, 260, 340, { name: 'M14', right: true, gl: 40, nameSide: 'l' });
  wire(S, [[260, 272], [260, 290]]); dot(S, 260, 280); wire(S, [[260, 280], [330, 280], [330, 340]]); dot(S, 330, 340);
  nmos(S, 260, 480, { name: 'M15', gate: 'V_REF', gcol: C.amb }); wire(S, [[260, 390], [260, 430]]); gnd(S, 260, 530);
  // main: pair + tail M11 + triode M12 ∥ M13
  nmos(S, 640, 260, { name: 'M1', gate: 'V_in1' }); nmos(S, 900, 260, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[640, 210], [640, 180]]); wire(S, [[900, 210], [900, 180]]); txt(S, 770, 186, 'to the folded cascode', { size: 17, color: C.muted, anchor: 'middle' });
  wire(S, [[640, 310], [640, 330], [900, 330], [900, 310]]); dot(S, 770, 330);
  const m11 = nmos(S, 770, 380, { name: 'M11', gl: 60 }); wire(S, [[770, 330], [770, 330]]);
  wire(S, [[330, 340], [330, 380], [m11.gate[0], 380]]);
  wire(S, [[770, 430], [770, 450], [700, 450], [700, 470]]); wire(S, [[770, 450], [840, 450], [840, 470]]); dot(S, 770, 450);
  nmos(S, 700, 520, { name: 'M12', gate: 'V_out1', gl: 26, gcol: C.volt }); nmos(S, 840, 520, { name: 'M13', gate: 'V_out2', gl: 26, right: true, gcol: C.volt, nameSide: 'l' });
  gnd(S, 700, 570); gnd(S, 840, 570);
  r();
  return g;
}

/* ── Follow the current: replica CMFB (teaching number: I_1 = 100 µA) ── */
scene(L11, 'Follow the current: replica CMFB', 70, (S) => {
  header(S, 'LEC 12 · FOLLOW THE CURRENT', 'I_1 is set on the left, copied into M11, shared by the pair and by M12, M13');
  const I1 = 100e-6; // teaching number, stated in the captions and the stops
  const g = replicaFig(S); g.setAttribute('transform', 'translate(0 60)');
  S.draw(g, 0.3, 2.4);
  S.say(0.3, 'Follow the current in the replica circuit. Take the source on the left as I 1 equals 100 microamps.');
  current(S, [[260, 210], [260, 590]], 4, null, 'I_1 = 100 µA', { color: C.amb, at: [100, 470] });
  S.say(4, 'Start on the left, the replica branch. The source pushes I 1 down through M14 and M15 to ground. M14 is diode-connected: its gate settles at whatever voltage lets it carry I 1.');
  glowBox(S, 300, 385, 400, 70, C.volt, 11, 22);
  S.say(11, 'Now look right. M11 is the tail of the input pair, and its gate is tied to M14’s gate. That wire carries a voltage, not a current.');
  S.stop(15, {
    q: 'M11 has the same size as M14 and the same gate voltage. With the outputs at $V_{REF}$, how much current does the tail device **M11** carry? ($I_1 = 100\\,\\mu$A)',
    choices: ['$I_1$ = 100 µA: it copies M14', '$I_1/2$ = 50 µA', '$2I_1$ = 200 µA', 'Zero: the gate wire carries no current'], answer: 0,
    hint: ['Two devices with the same size and the same $V_{GS}$ form a **current mirror**.', 'Same $V_{GS}$, same W/L ⇒ same $I_D = \\tfrac12\\mu_nC_{ox}\\tfrac WL V_{ov}^2$.'],
    how: [
      'M14 carries $I_1$ (it is in series with the source). Its gate voltage is whatever makes that true.',
      'M11 sees the same gate voltage, and at balance ($V_{out,CM} = V_{REF}$) its source sits where M14’s does, so the same $V_{GS}$: $$I_{D11} = \\tfrac12\\mu_nC_{ox}\\left(\\tfrac WL\\right)_{11}V_{ov}^2 = I_{D14} = I_1 = 100\\,\\mu\\mathrm A$$',
      '“Zero” is the trap: the gate wire carries no current, but it carries the **voltage** that makes M11 copy $I_1$.',
    ],
    why: 'A mirror copies a current through a voltage: same $V_{GS}$, same size ⇒ same current.',
  });
  current(S, [[770, 390], [770, 510]], 15.5, null, 'I_SS = I_1 = 100 µA', { color: C.amb, at: [945, 450] });
  S.say(15.5, 'Same size, same gate voltage: M11 copies M14 and carries I 1, 100 microamps. That is the tail current of the input pair.');
  current(S, [[640, 240], [640, 390], [770, 390]], 22, null, 'I_SS/2', { color: C.p, at: [560, 262] });
  current(S, [[900, 240], [900, 390], [770, 390]], 22, null, 'I_SS/2', { color: C.n, at: [985, 262] });
  eqAt(S, 'I_{D1} + I_{D2} = I_{D11}', 1300, 300, 22, { size: 30, w: 480 });
  S.say(22, 'Where does the tail current come from? From the folded cascode above, down through M1 and M2, drain to source. They join at the tail node: I D 1 plus I D 2 equals I D 11. Equal inputs, so half each.');
  current(S, [[770, 510], [700, 510], [700, 630]], 29, null, 'I_D12', { color: C.p, at: [690, 690] });
  current(S, [[770, 510], [840, 510], [840, 630]], 29, null, 'I_D13', { color: C.n, at: [850, 690] });
  eqAt(S, 'I_{D11} = I_{D12} + I_{D13}', 1300, 380, 29, { size: 30, w: 480 });
  S.say(29, 'Below M11 the current splits again, into the two triode sensors M12 and M13, and goes to ground. K C L: I D 11 equals I D 12 plus I D 13.');
  S.stop(34, {
    q: 'Both outputs sit at $V_{REF}$ and $I_1 = 100\\,\\mu$A. How much current flows through **each** sensing device, M12 and M13?',
    hint: ['The tail current through M11 is the copy of $I_1$. It splits between M12 and M13.', '$I_{D11} = I_{D12} + I_{D13}$; equal gates ($V_{out1} = V_{out2}$) ⇒ equal split.'],
    how: [
      'M11 copies the replica current: $$I_{D11} = I_1 = 100\\,\\mu\\mathrm A$$',
      'KCL at the node under M11: $$I_{D12} + I_{D13} = I_{D11} = 100\\,\\mu\\mathrm A$$',
      'Equal outputs ⇒ equal gate voltages ⇒ equal triode resistors, so they share equally: $$I_{D12} = I_{D13} = \\frac{100\\,\\mu}{2} = 50\\,\\mu\\mathrm A$$',
    ],
    why: 'A current only splits evenly when the two branches are identical; here that means $V_{out1} = V_{out2}$.',
    answer: I1 / 2, unit: 'A', tol: 0.02,
  });
  eqAt(S, 'I_{D12} = I_{D13} = \\frac{100\\,\\mu}{2} = 50\\,\\mu\\mathrm A', 1300, 470, 34.5, { size: 28, w: 480, color: '#ffd38a' });
  S.say(34.5, 'Equal outputs make M12 and M13 equal resistors, so they share the 100 microamps: 50 each.');
  whyBox(S, 1060, 540, 500, 250, 'If the output CM **rises**: M12, M13 conduct better, the node under M11 drops, $V_{GS11}$ grows, and M11 pulls **more** than $I_1$. More tail current leaves less for the output branches, so the outputs come back **down**. Balance only at $V_{out,CM} = V_{REF}$.', 41);
  S.say(41, 'Now let the output common mode rise. M12 and M13 conduct better, the node under M11 drops, M11 gets a bigger gate-source voltage and pulls more than I 1. More tail current leaves less for the output branches, and the outputs come back down. The only resting point is V out CM equal to V REF.');
  remember(S, [
    'The replica branch **sets** the current: $I_1$ flows down through M14 and M15.',
    'M11 **copies** it through the gate voltage (a mirror): $I_{D11} = I_1$ when $V_{out,CM} = V_{REF}$.',
    'KCL at the tail: $I_{D1} + I_{D2} = I_{D11}$ (half each for equal inputs).',
    'KCL under M11: $I_{D11} = I_{D12} + I_{D13}$ (half each for equal outputs).',
    'CM too high ⇒ M11 pulls more than $I_1$ ⇒ outputs pulled down: negative feedback.',
  ], 56, 'Follow the current · replica CMFB');
});

scene(L11, 'Replica CMFB: a twin that sets the CM to V_REF', 66, (S) => {
  header(S, 'LEC 12 · REPLICA', 'M14 copies M11, M15 copies M12 + M13: balanced only at V_out,CM = V_REF');
  const g = replicaFig(S); g.setAttribute('transform', 'translate(0 60)');
  S.draw(g, 0.3, 2.4);
  S.say(0.3, 'Instead of solving the square law, build a <b>twin</b>. On the right, the real tail: M11 above the triode sensors M12, M13 (gates on the outputs). On the left, a replica branch fed by $I_1$.');
  S.say(8, 'M14 is M11’s twin (same size, same gate, same current $I_1$). M15 is the twin of M12 and M13 <b>together</b>, but its gate sits at $V_{REF}$ instead of the outputs.');
  const ln = [
    ['I_{D11} = I_{D14} = I_1', 14],
    ['(W/L)_{14} = (W/L)_{11}', 18],
    ['(W/L)_{15} = (W/L)_{12} + (W/L)_{13}', 22],
  ];
  ln.forEach(([tex, t], i) => eqAt(S, tex, 1270, 250 + i * 80, t, { size: 30, w: 560 }));
  S.say(14, 'Your page’s three lines. Same gate voltage and same current only if the two bottom “resistors” match: M15’s conductance must equal M12’s + M13’s.');
  S.say(22, 'With $(W/L)_{15} = (W/L)_{12}+(W/L)_{13}$ that happens exactly when the outputs average to $V_{REF}$. The CM is set by $V_{REF}$ directly — no square-law algebra.');
  whyBox(S, 1000, 520, 560, 150, '**Copy error:** $V_{DS11} \\ne V_{DS14}$, so the currents differ a little ($r_O$). Fix: add M17, M18 — copies of M1, M2 — above M14.', 32);
  eqAt(S, '(W/L)_{17} = (W/L)_1,\\quad (W/L)_{18} = (W/L)_2', 1180, 730, 36, { size: 26, w: 760, color: '#ffd38a' });
  S.say(32, 'Last refinement on your page: M14’s drain does not sit where M11’s does, so $V_{DS}$ differs and the copy is slightly off. Put copies of M1, M2 (M17, M18) on top of M14 — now the replica matches exactly.');
});

scene(L11, 'Lectures 11–12 in one card', 26, (S) => {
  header(S, 'LEC 11–12 · REMEMBER', 'The foundations');
  remember(S, [
    'Deep triode = resistor: $R_{on} = 1/(\\mu_nC_{ox}\\tfrac WL(V_{GS}-V_{th}))$. Saturation = current source.',
    'Triode pair at the tail: $R_{tot} = 1/(\\mu_nC_{ox}\\tfrac WL(V_{out1}+V_{out2}-2V_{th}))$ — sees CM, blind to DM.',
    'Pair sensing: $I \\propto (V_{REF}-V_{out1})^2 + (V_{REF}-V_{out2})^2$ — nonlinear, small swings only.',
    'CMFB is a feedback loop: error $\\approx 1/(\\beta A)$; it can act on the tail or the bottom sources.',
    'Pinned CM: $V_{b1} - V_{GS3} = 2I_DR_{tot,P}$ ⇒ $V_{out1}+V_{out2} = \\frac{2I_D}{\\mu_nC_{ox}(W/L)}\\frac{1}{V_{b1}-V_{GS3}} + 2V_{th}$.',
    'Replica: $(W/L)_{14} = (W/L)_{11}$, $(W/L)_{15} = (W/L)_{12}+(W/L)_{13}$; copy fix $(W/L)_{17,18} = (W/L)_{1,2}$.',
  ], 0.4, 'Lectures 11–12 · remember');
  S.say(0.4, 'And the questions: Tutorial 5 Q1 (the 2025 mid-sem Q4), Quiz 2, and Problem Set 2 P5.');
});

/* ── Lectures 11–12 past papers ── */
scene(L11, 'Tutorial 5 Q1 = 2025 mid-sem Q4: size the triode CMFB', 80, (S) => {
  const T = tfm(1, -300, 30);
  const off = PAPERS.t5q1 ? 9 : 0; // pyqFrame's intro length when the printed paper is shown
  const wl = ans('bank-t5q1', 'wl'), vb1 = ans('bank-t5q1', 'vb1'), sw = ans('bank-t5q1', 'swing');
  const vovn = Math.sqrt(2 * 0.5e-3 / (135e-6 * wl)), vovp = Math.sqrt(2 * 0.5e-3 / (40e-6 * wl));
  const vmin = 0.1 + 2 * vovn, vmax = 3 - 2 * vovp;
  pyqFrame(S, {
    paper: 't5q1', tag: 'LEC 11–12 · PAST PAPER 1 OF 3', title: 'Triode sensing with numbers', src: 'Tutorial 5 Q1 = Mid-sem 2025-26 Q4',
    q: 'Each branch carries 0.5 mA. M7, M8 (gates on the outputs) are the tail, in deep triode. (a) W/L of M7, M8 for an output CM of 1.5 V with $V_P$ = 100 mV. (b) If all transistors have that size, $V_{b1}$? (c) Maximum differential swing.',
    giv: '$V_{DD} = 3$ V, $\\mu_nC_{ox} = 135\\,\\mu$A/V², $\\mu_pC_{ox} = 40\\,\\mu$A/V², $V_{thn} = 0.7$ V, $|V_{thp}| = 0.8$ V', qh: 240,
    tests: 'the **triode equation** with $V_{GS}$ = the output CM and $V_{DS}$ = $V_P$, a **link** for $V_{b1}$, and the **output range by checks**.',
    fig: (S2) => {
      const g = triodeTele(S2, { top: ['M11', 'M12'], pc: ['M9', 'M10'], nc: ['M3', 'M4'], inp: ['M5', 'M6'], tri: ['M7', 'M8'] }); g.setAttribute('transform', 'translate(-300 30)');
      current(S2, [[320, 680], [320, 800]], off + 8, off + 16.5, 'I_D7 = 0.5 mA', { color: C.p, at: [215, 840] });
      current(S2, [[480, 680], [480, 800]], off + 8, off + 16.5, 'I_D8 = 0.5 mA', { color: C.n, at: [585, 840] });
    },
    steps: [
      { t: 8, title: '**(a) Size the triode pair.** M7, M8 sit between P and ground, so $V_{DS} = V_P = 0.1$ V (tiny: **triode**). Their gates are the outputs, so $V_{GS}$ = output CM = 1.5 V. Each carries 0.5 mA. Use the full triode equation, as the key does.',
        tex: `V_{GS}-V_{th} = 1.5 - 0.7 = 0.8\\,\\mathrm V,\\; I_D = \\tfrac12\\mu_nC_{ox}\\tfrac WL\\left[2(V_{GS}-V_{th})V_{DS}-V_{DS}^2\\right],\\; 0.5\\,\\mathrm{mA} = \\tfrac12(135\\,\\mu)\\tfrac WL\\left[2(0.8)(0.1)-0.1^2\\right] = (67.5\\,\\mu)(0.15)\\tfrac WL,\\; \\left(\\tfrac WL\\right)_{7,8} = \\frac{0.5\\,\\mathrm m}{10.125\\,\\mu} = ${fx(wl, 4)}`,
        hl: [T([600, 660, 200, 120, C.amb])],
        try: {
          q: '**(a)** Find $(W/L)_{7,8}$ of the triode pair so that the output CM is 1.5 V with $V_P = 100$ mV.',
          hint: ['M7, M8 have $V_{DS} = V_P$ = 0.1 V (tiny), so they are in **triode**. Their gates are the outputs, so $V_{GS}$ = the output CM.',
            'Triode equation: $I_D = \\tfrac12\\mu_nC_{ox}\\tfrac WL\\left[2(V_{GS}-V_{th})V_{DS} - V_{DS}^2\\right]$, with $I_D$ = 0.5 mA in each device.'],
          how: [
            'M7 and M8 sit between P and ground, so their drain–source voltage is just $V_P$, which is tiny: **triode**. $$V_{DS} = V_P = 0.1\\,\\mathrm V$$',
            'Their gates are tied to the outputs, so the gate–source voltage is the output CM: $$V_{GS} - V_{th} = 1.5 - 0.7 = 0.8\\,\\mathrm V$$',
            'Work out the triode bracket: $$2(V_{GS}-V_{th})V_{DS} - V_{DS}^2 = 2(0.8)(0.1) - 0.1^2 = 0.15\\,\\mathrm{V^2}$$',
            `Each device carries one branch current, 0.5 mA (the two branches meet at P and split equally). Solve for W/L: $$\\tfrac WL = \\frac{2I_D}{\\mu_nC_{ox}\\times 0.15} = \\frac{2(0.5\\,\\mathrm m)}{135\\,\\mu\\times 0.15} = ${fx(wl, 4)}$$`,
          ],
          why: 'The deep-triode shortcut (drop $V_{DS}^2$) gives 46.3 — also marked right. Write the full equation to match the key.',
          calc: [{ what: 'W/L in one line (prefixes on)', keys: '2 × 0.5m ÷ ( 135µ × ( 2 × 0.8 × 0.1 − 0.1 [x²] ) )', shows: fx(wl, 4), note: 'Type µ and m with [CATALOG] ▸ Engineer Symbol.' }],
          parts: [
            { q: 'The overdrive of M7, M8, $V_{GS} - V_{th}$.', hint: ['Their gates are the outputs: $V_{GS}$ = output CM.'], how: ['$$V_{GS} - V_{th} = 1.5 - 0.7 = 0.8\\,\\mathrm V$$'], answer: 0.8, unit: 'V', tol: 0.01 },
            { q: 'The triode bracket $2(V_{GS}-V_{th})V_{DS} - V_{DS}^2$ (in V²), with $V_{DS} = V_P$.', hint: ['$V_{DS} = V_P = 0.1$ V.'], how: ['$$2(0.8)(0.1) - 0.1^2 = 0.16 - 0.01 = 0.15$$'], answer: 2 * 0.8 * 0.1 - 0.01, unit: 'V²', tol: 0.01 },
          ],
          answer: wl, unit: '', tol: 0.07,
        },
        say: 'Triode equation with $V_{GS} = 1.5$ V and $V_{DS} = 0.1$ V: $(W/L)_{7,8} = 49.4$. (Dropping $V_{DS}^2$ gives 46.3 — both marked right.)' },
      { t: 17, title: `**(b) Find $V_{b1}$ by a link.** Every device now has W/L = ${fx(wl, 4)} (from part a). M5 stands on P and carries 0.5 mA, so its gate $V_{b1}$ sits one $V_{GS5}$ above P.`,
        tex: `V_{ov5} = \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}} = \\sqrt{\\frac{2(0.5\\,\\mathrm m)}{135\\,\\mu\\times ${fx(wl, 4)}}} = ${fx(vovn, 3)}\\,\\mathrm V,\\; V_{b1} = V_P + V_{th} + V_{ov5} = 0.1 + 0.7 + ${fx(vovn, 3)} = ${fx(vb1, 4)}\\,\\mathrm V`,
        hl: [T([480, 520, 440, 80, C.volt])],
        try: {
          q: `**(b)** Every transistor now has $W/L = ${fx(wl, 4)}$ (from part a). Find the gate bias $V_{b1}$ of M5, M6.`,
          hint: ['M5’s source is node P (known from part a). Its gate sits one $V_{GS5}$ above its source: a **link**.',
            '$V_{b1} = V_P + V_{th} + V_{ov5}$ with $V_{ov5} = \\sqrt{2I_D/(\\mu_nC_{ox}\\,W/L)}$.'],
          how: [
            'The device with $V_{b1}$ on its gate is M5 (and M6). Its source is node P, which we know: $V_P = 0.1$ V.',
            `M5 is an NMOS in saturation carrying the branch current 0.5 mA. Its overdrive: $$V_{ov5} = \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}} = \\sqrt{\\frac{2(0.5\\,\\mathrm m)}{135\\,\\mu\\times ${fx(wl, 4)}}} = ${fx(vovn, 3)}\\,\\mathrm V$$`,
            `Its gate is one $V_{GS5} = V_{th} + V_{ov5}$ above P: $$V_{b1} = V_P + V_{th} + V_{ov5} = 0.1 + 0.7 + ${fx(vovn, 3)} = ${fx(vb1, 4)}\\,\\mathrm V$$`,
          ],
          why: 'A gate bias = the node under the device + one $V_{GS}$ (a link).',
          parts: [{ q: 'The overdrive $V_{ov5}$ of M5 (0.5 mA, W/L from part a).', hint: ['$V_{ov} = \\sqrt{2I_D/(\\mu_nC_{ox}\\,W/L)}$'], how: [`$$V_{ov5} = \\sqrt{\\frac{2(0.5\\,\\mathrm m)}{135\\,\\mu\\times ${fx(wl, 4)}}}$$`], answer: vovn, unit: 'V', tol: 0.01 }],
          answer: vb1, unit: 'V', tol: 0.01,
        },
        say: 'M5’s source is P, so its gate sits one $V_{GS5}$ above: $V_{b1} = 0.1 + 0.7 + 0.387 = 1.187$ V.' },
      { t: 26, title: '**(c) Swing by checks.** Lowest output: P plus the two NMOS overdrives below it (M5, M3). Highest: $V_{DD}$ minus the two PMOS overdrives above it (M9, M11). The differential swing is twice the single-ended range.',
        tex: `|V_{ov,p}| = \\sqrt{\\frac{2(0.5\\,\\mathrm m)}{40\\,\\mu\\times ${fx(wl, 4)}}} = ${fx(vovp, 3)}\\,\\mathrm V,\\; V_{out,min} = V_P + 2V_{ov,n} = 0.1 + 2(${fx(vovn, 3)}) = ${fx(vmin, 3)}\\,\\mathrm V,\\; V_{out,max} = V_{DD} - 2|V_{ov,p}| = 3 - 2(${fx(vovp, 3)}) = ${fx(vmax, 4)}\\,\\mathrm V,\\; V_{pp,diff} = 2(${fx(vmax, 4)} - ${fx(vmin, 3)}) = ${fx(sw, 3)}\\,\\mathrm V`,
        hl: [T([480, 150, 440, 470, C.volt])],
        try: {
          q: '**(c)** All devices are sized as in (a) and carry 0.5 mA. Find the maximum **differential** output swing (peak-to-peak).',
          hint: ['Each output can fall until the two NMOS below it (M3, M5) leave saturation, and rise until the two PMOS above it (M9, M11) leave saturation.',
            '$V_{out,min} = V_P + V_{ov3} + V_{ov5}$, $V_{out,max} = V_{DD} - |V_{ov9}| - |V_{ov11}|$; differential swing $= 2(V_{out,max} - V_{out,min})$.'],
          how: [
            `NMOS overdrive (from part b): $V_{ov,n} = ${fx(vovn, 3)}$ V. PMOS overdrive, same W/L and 0.5 mA: $$|V_{ov,p}| = \\sqrt{\\frac{2(0.5\\,\\mathrm m)}{40\\,\\mu\\times ${fx(wl, 4)}}} = ${fx(vovp, 3)}\\,\\mathrm V$$`,
            `Lowest output: start at P and add the two NMOS overdrives below the output: $$V_{out,min} = 0.1 + 2(${fx(vovn, 3)}) = ${fx(vmin, 3)}\\,\\mathrm V$$`,
            `Highest output: $V_{DD}$ minus the two PMOS overdrives above it: $$V_{out,max} = 3 - 2(${fx(vovp, 3)}) = ${fx(vmax, 4)}\\,\\mathrm V$$`,
            `The differential output $V_{out1} - V_{out2}$ swings twice as far as one side: $$V_{pp,diff} = 2(${fx(vmax, 4)} - ${fx(vmin, 3)}) = ${fx(sw, 3)}\\,\\mathrm V$$`,
          ],
          why: 'Differential swing = 2 × the single-ended range. The key rounds to 1.412 V.',
          calc: [{ what: 'PMOS overdrive', keys: '[√] ( 2 × 0.5m ÷ ( 40µ × 49.38 ) )', shows: fx(vovp, 4) }, { what: 'swing', keys: '2 × ( 3 − 2 × [Ans] − 0.8746 )', shows: fx(sw, 4), note: 'Ans is the last result: press [Ans].' }],
          parts: [
            { q: 'The PMOS overdrive $|V_{ov,p}|$ (0.5 mA, same W/L, $\\mu_pC_{ox} = 40\\,\\mu$A/V²).', hint: ['$|V_{ov,p}| = \\sqrt{2I_D/(\\mu_pC_{ox}\\,W/L)}$'], how: [`$$|V_{ov,p}| = \\sqrt{\\frac{2(0.5\\,\\mathrm m)}{40\\,\\mu\\times ${fx(wl, 4)}}}$$`], answer: vovp, unit: 'V', tol: 0.01 },
            { q: 'The lowest output $V_{out,min}$.', hint: ['Start at P, add the overdrives of the two NMOS below the output (M5, M3); $V_{ov,n}$ is from part (b).'], how: [`$$V_{out,min} = V_P + 2V_{ov,n} = 0.1 + 2(${fx(vovn, 3)})$$`], answer: vmin, unit: 'V', tol: 0.01 },
            { q: 'The highest output $V_{out,max}$.', hint: ['Start at $V_{DD}$, subtract the overdrives of the two PMOS above the output (M9, M11).'], how: [`$$V_{out,max} = V_{DD} - 2|V_{ov,p}| = 3 - 2(${fx(vovp, 3)})$$`], answer: vmax, unit: 'V', tol: 0.01 },
          ],
          answer: sw, unit: 'V', tol: 0.01,
        },
        say: 'Output range by checks: [0.875, 1.58] V per side; doubled for the differential output, 1.40 V.' },
      { t: 35, ans: true, title: `**Answers:** (a) $(W/L)_{7,8} = ${fx(wl, 4)}$ (46.3 with the shortcut) · (b) $V_{b1} = ${fx(vb1, 4)}$ V · (c) differential swing $${fx(sw, 3)}$ V`, say: 'Key values: 49.38, 1.187 V, 1.412 V. The method: triode equation for the sensors, a link for the bias, checks for the swing.' },
    ],
  });
}, { q: 'Tutorial 5 Q1 / Mid-sem 2025 Q4' });

scene(L11, 'Quiz 2 Parts A, B, C: triode sensing on a telescopic', 72, (S) => {
  const T = tfm(1, -300, 30);
  const A = (k) => ans('bank-quiz2a', k), B = (k) => ans('bank-quiz2b', k), Cc = (k) => ans('bank-quiz2c', k);
  const ova = Math.sqrt(2 * 40e-6 / (200e-6 * 50)), ovb = Math.sqrt(2 * 50e-6 / (150e-6 * 40)), ovc = Math.sqrt(2 * 60e-6 / (120e-6 * 60));
  pyqFrame(S, {
    tag: 'LEC 11–12 · PAST PAPER 2 OF 3', title: 'Quiz 2: V_P and the size of the triode pair', src: 'Quiz 2 2024-25 · Part A (reconstructed from your key)',
    q: 'Telescopic with a triode-pair tail M11, M12 (gates on the outputs). PMOS $M_{3,4}$: W/L = 50 at 50 µA. NMOS: W/L = 50 at 40 µA each, $V_{b1} = 0.6$ V on the input pair, output CM = $0.5V_{DD}$. Find $V_P$, $(W/L)_{11,12}$, $V_{out,min}$.',
    giv: '$V_{DD} = 1.8$ V, $\\mu_nC_{ox} = 200\\,\\mu$A/V², $\\mu_pC_{ox} = 100\\,\\mu$A/V², $V_{thn} = 0.4$ V, $|V_{thp}| = 0.5$ V',
    qh: 250, tests: 'a **link** down from $V_{b1}$ to P, then the **triode-pair equation** solved for W/L, then **checks** for the lowest output.',
    fig: (S2) => { const g = triodeTele(S2, { top: ['M3', 'M4'], pc: ['M7', 'M8'], nc: ['M5', 'M6'], inp: ['M9', 'M10'], tri: ['M11', 'M12'] }); g.setAttribute('transform', 'translate(-300 30)'); },
    steps: [
      { t: 6, title: '**Find $V_P$ by a link.** P is the source of the input device M10 (gate at $V_{b1}$, 40 µA, W/L = 50), so P sits one $V_{GS10}$ below $V_{b1}$.',
        tex: `V_{ov} = \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}} = \\sqrt{\\frac{2(40\\,\\mu)}{200\\,\\mu\\times 50}} = ${fx(ova, 3)}\\,\\mathrm V,\\; V_P = V_{b1} - V_{th} - V_{ov} = 0.6 - 0.4 - ${fx(ova, 3)} = ${fx(A('vp'), 4)}\\,\\mathrm V`,
        hl: [T([480, 520, 440, 150, C.volt])],
        try: {
          q: '**Part A:** find the voltage $V_P$ at the tail node.',
          hint: ['P is the source of the input device M10, whose gate is at $V_{b1}$. Walk **down** one $V_{GS}$ (a link).', '$V_P = V_{b1} - V_{th} - V_{ov}$ with $V_{ov} = \\sqrt{2I_D/(\\mu_nC_{ox}\\,W/L)}$.'],
          how: [
            `The device standing on P is the NMOS input device M10: 40 µA, W/L = 50. Its overdrive: $$V_{ov} = \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}} = \\sqrt{\\frac{2(40\\,\\mu)}{200\\,\\mu\\times 50}} = ${fx(ova, 3)}\\,\\mathrm V$$`,
            `Its gate–source voltage: $$V_{GS} = V_{th} + V_{ov} = 0.4 + ${fx(ova, 3)} = ${fx(0.4 + ova, 3)}\\,\\mathrm V$$`,
            `P is its source, one $V_{GS}$ below the gate: $$V_P = V_{b1} - V_{GS} = 0.6 - ${fx(0.4 + ova, 3)} = ${fx(A('vp'), 3)}\\,\\mathrm V$$`,
          ],
          why: 'Known gate, unknown source: subtract one $V_{GS}$.',
          parts: [{ q: 'The overdrive of the input device M10 (40 µA, W/L = 50).', hint: ['$V_{ov} = \\sqrt{2I_D/(\\mu_nC_{ox}\\,W/L)}$'], how: ['$$V_{ov} = \\sqrt{\\frac{2(40\\,\\mu)}{200\\,\\mu\\times 50}}$$'], answer: ova, unit: 'V', tol: 0.02 }],
          answer: A('vp'), unit: 'V', tol: 0.02,
        },
        say: 'Link down from the gate bias: $V_P = 0.6 - (0.4 + 0.089) = 0.111$ V.' },
      { t: 15, title: '**Size the triode pair.** The whole tail current $2I_D$ flows through $R_{tot,P}$, and $R_{tot,P}$ is set by the output CM on the gates. Solve the Lecture 12 equation for W/L.',
        tex: `V_P = \\frac{2I_D}{\\mu_nC_{ox}(W/L)(V_{out1}+V_{out2}-2V_{th})},\\; \\left(\\tfrac WL\\right)_{11,12} = \\frac{2I_D}{\\mu_nC_{ox}V_P(V_{out1}+V_{out2}-2V_{th})} = \\frac{80\\,\\mu}{200\\,\\mu\\times ${fx(A('vp'), 4)}\\times(1.8-0.8)} = ${fx(A('wl'), 4)}`,
        hl: [T([600, 660, 200, 120, C.amb])],
        try: {
          q: '**Part A:** the output CM is $0.5V_{DD}$. Using $V_P$ from the previous part, find $(W/L)_{11,12}$ of the triode pair.',
          hint: ['The triode pair is one resistor $R_{tot,P}$ that carries the whole tail current $2I_D$ and drops $V_P$. Its gates sit at the outputs.',
            '$V_P = 2I_D\\,R_{tot,P}$ with $R_{tot,P} = \\dfrac{1}{\\mu_nC_{ox}(W/L)(V_{out1}+V_{out2}-2V_{th})}$.'],
          how: [
            'The tail carries both branches together: $$2I_D = 2(40\\,\\mu) = 80\\,\\mu\\mathrm A$$',
            'Both outputs sit at the CM, $0.5V_{DD} = 0.9$ V: $$V_{out1}+V_{out2}-2V_{th} = 1.8 - 0.8 = 1.0\\,\\mathrm V$$',
            `Ohm’s law at P with the triode resistance, solved for W/L: $$\\tfrac WL = \\frac{2I_D}{\\mu_nC_{ox}V_P(1.0)} = \\frac{80\\,\\mu}{200\\,\\mu\\times ${fx(A('vp'), 4)}\\times 1.0} = ${fx(A('wl'), 3)}$$`,
          ],
          why: 'The key rounds $V_P$ to 0.11 V and gets ≈ 3.64; both are marked right.',
          parts: [
            { q: 'The tail current $2I_D$ through the triode pair.', hint: ['Both branches (40 µA each) meet at P.'], how: ['$$2I_D = 2(40\\,\\mu)$$'], answer: 80e-6, unit: 'A', tol: 0.01 },
            { q: '$V_{out1}+V_{out2}-2V_{th}$ with the outputs at the CM $0.5V_{DD}$.', hint: ['Each output sits at $0.5 \\times 1.8 = 0.9$ V.'], how: ['$$0.9 + 0.9 - 2(0.4) = 1.8 - 0.8$$'], answer: 1.0, unit: 'V', tol: 0.01 },
          ],
          answer: A('wl'), unit: '', tol: 0.03,
        },
        say: 'Rearrange the Lecture 12 equation: $(W/L)_{11,12} = 2I_D/(\\mu_nC_{ox}V_P(1.8 - 0.8)) ≈ 3.62$.' },
      { t: 24, title: '**Lowest output by checks.** Below each output stand two NMOS (the input device and its cascode); each needs one overdrive across it to stay saturated.',
        tex: `V_{out,min} = V_P + 2V_{ov} = ${fx(A('vp'), 4)} + 2(${fx(ova, 3)}) = ${fx(A('vmin'), 3)}\\,\\mathrm V`,
        hl: [T([480, 380, 440, 260, C.volt])],
        try: {
          q: '**Part A:** how low can each output go before an NMOS below it leaves saturation? Find $V_{out,min}$.',
          hint: ['Two NMOS stand between P and the output (the input device and the cascode). Each needs its overdrive across it.', '$V_{out,min} = V_P + V_{ov,in} + V_{ov,casc}$.'],
          how: [
            `Start at P (from the first part): $V_P = ${fx(A('vp'), 4)}$ V.`,
            `The input device needs $V_{DS} \\ge V_{ov}$ and the cascode on top needs another $V_{ov}$. Same size and current, so both are $${fx(ova, 3)}$ V (from the first part).`,
            `Add them: $$V_{out,min} = V_P + 2V_{ov} = ${fx(A('vp'), 4)} + 2(${fx(ova, 3)}) = ${fx(A('vmin'), 3)}\\,\\mathrm V$$`,
          ],
          answer: A('vmin'), unit: 'V', tol: 0.02,
        },
        say: 'Two checks above P: $0.111 + 2(0.089) = 0.289$ V.' },
      { t: 32, title: '**Part B, same moves:** $\\mu_nC_{ox} = 150\\,\\mu$A/V², NMOS W/L = 40 at 50 µA, $V_{b1} = 0.6$ V, output CM = $0.6V_{DD}$ = 1.08 V. Link down to P, then the triode equation.',
        tex: `V_{ov} = \\sqrt{\\frac{2(50\\,\\mu)}{150\\,\\mu\\times 40}} = ${fx(ovb, 3)}\\,\\mathrm V,\\; V_P = 0.6 - 0.4 - ${fx(ovb, 3)} = ${fx(B('vp'), 3)}\\,\\mathrm V,\\; \\left(\\tfrac WL\\right)_{11,12} = \\frac{100\\,\\mu}{150\\,\\mu\\times ${fx(B('vp'), 3)}\\times(2.16 - 0.8)} = ${fx(B('wl'), 3)}`,
        try: {
          q: '**Part B** (new numbers, same circuit): $\\mu_nC_{ox} = 150\\,\\mu$A/V², NMOS W/L = 40 at 50 µA each, $V_{b1} = 0.6$ V, $V_{thn} = 0.4$ V, $V_{DD} = 1.8$ V, output CM = $0.6V_{DD}$. Find $(W/L)_{11,12}$.',
          hint: ['Same two moves as Part A: link down from $V_{b1}$ to get $V_P$, then the triode equation for W/L.',
            '$V_P = V_{b1} - V_{th} - \\sqrt{2I_D/(\\mu_nC_{ox}\\,W/L)}$, then $\\tfrac WL = \\dfrac{2I_D}{\\mu_nC_{ox}V_P(V_{out1}+V_{out2}-2V_{th})}$.'],
          how: [
            `Overdrive of the input device (50 µA, W/L = 40): $$V_{ov} = \\sqrt{\\frac{2(50\\,\\mu)}{150\\,\\mu\\times 40}} = ${fx(ovb, 3)}\\,\\mathrm V$$`,
            `Link down to P: $$V_P = V_{b1} - V_{th} - V_{ov} = 0.6 - 0.4 - ${fx(ovb, 3)} = ${fx(B('vp'), 3)}\\,\\mathrm V$$`,
            'Outputs at $0.6V_{DD} = 1.08$ V each; tail current $2I_D = 100\\,\\mu$A: $$V_{out1}+V_{out2}-2V_{th} = 2.16 - 0.8 = 1.36\\,\\mathrm V$$',
            `Triode equation for W/L: $$\\tfrac WL = \\frac{2I_D}{\\mu_nC_{ox}V_P(1.36)} = \\frac{100\\,\\mu}{150\\,\\mu\\times ${fx(B('vp'), 3)}\\times 1.36} = ${fx(B('wl'), 3)}$$`,
          ],
          calc: [
            { what: '$V_P$, then store it', keys: '0.6 − 0.4 − [√] ( 2 × 50µ ÷ ( 150µ × 40 ) ) [EXE], then [VARIABLE] ▸ A ▸ Store', shows: fx(B('vp'), 4) },
            { what: 'W/L using A', keys: '100µ ÷ ( 150µ × [SHIFT] [4] × ( 2.16 − 0.8 ) )', shows: fx(B('wl'), 4), note: '[SHIFT] [4] types the variable A.' },
          ],
          parts: [
            { q: 'The overdrive of the input device (50 µA, W/L = 40).', hint: ['$V_{ov} = \\sqrt{2I_D/(\\mu_nC_{ox}\\,W/L)}$'], how: ['$$V_{ov} = \\sqrt{\\frac{2(50\\,\\mu)}{150\\,\\mu\\times 40}}$$'], answer: ovb, unit: 'V', tol: 0.02 },
            { q: '$V_P$, by a link down from $V_{b1}$.', hint: ['$V_P = V_{b1} - V_{th} - V_{ov}$'], how: [`$$V_P = 0.6 - 0.4 - ${fx(ovb, 3)}$$`], answer: B('vp'), unit: 'V', tol: 0.02 },
            { q: '$V_{out1}+V_{out2}-2V_{th}$ with the outputs at $0.6V_{DD}$.', hint: ['Each output sits at $0.6 \\times 1.8 = 1.08$ V.'], how: ['$$2(1.08) - 2(0.4) = 2.16 - 0.8$$'], answer: 1.36, unit: 'V', tol: 0.01 },
          ],
          answer: B('wl'), unit: '', tol: 0.03,
        },
        say: 'Part B, new numbers: link down from $V_{b1}$ gives $V_P = 0.071$ V; the triode equation gives $(W/L)_{11,12} = 6.91$.' },
      { t: 41, title: '**Part C, same method:** $\\mu_nC_{ox} = 120\\,\\mu$A/V², $V_{thn} = 0.3$ V, NMOS W/L = 60 at 60 µA, $V_{b1} = 0.55$ V, output CM = $0.4V_{DD}$ = 0.72 V.',
        tex: `V_{ov} = \\sqrt{\\frac{2(60\\,\\mu)}{120\\,\\mu\\times 60}} = ${fx(ovc, 3)}\\,\\mathrm V,\\; V_P = 0.55 - 0.3 - ${fx(ovc, 3)} = ${fx(Cc('vp'), 3)}\\,\\mathrm V,\\; \\left(\\tfrac WL\\right)_{11,12} = \\frac{120\\,\\mu}{120\\,\\mu\\times ${fx(Cc('vp'), 3)}\\times(1.44 - 0.6)} = ${fx(Cc('wl'), 3)}`,
        try: {
          q: '**Part C** (same circuit): $\\mu_nC_{ox} = 120\\,\\mu$A/V², $V_{thn} = 0.3$ V, NMOS W/L = 60 at 60 µA each, $V_{b1} = 0.55$ V, $V_{DD} = 1.8$ V, output CM = $0.4V_{DD}$. Find $(W/L)_{11,12}$.',
          hint: ['Link down from $V_{b1}$ to P, then solve the triode-pair equation for W/L.', '$\\tfrac WL = \\dfrac{2I_D}{\\mu_nC_{ox}V_P(V_{out1}+V_{out2}-2V_{th})}$.'],
          how: [
            `Overdrive of the input device (60 µA, W/L = 60): $$V_{ov} = \\sqrt{\\frac{2(60\\,\\mu)}{120\\,\\mu\\times 60}} = ${fx(ovc, 3)}\\,\\mathrm V$$`,
            `Link down to P: $$V_P = 0.55 - 0.3 - ${fx(ovc, 3)} = ${fx(Cc('vp'), 3)}\\,\\mathrm V$$`,
            'Outputs at $0.4V_{DD} = 0.72$ V each; tail current $2I_D = 120\\,\\mu$A: $$V_{out1}+V_{out2}-2V_{th} = 1.44 - 0.6 = 0.84\\,\\mathrm V$$',
            `Triode equation for W/L: $$\\tfrac WL = \\frac{120\\,\\mu}{120\\,\\mu\\times ${fx(Cc('vp'), 3)}\\times 0.84} = ${fx(Cc('wl'), 3)}$$`,
          ],
          why: 'Three versions, one recipe: link to P, triode equation for W/L.',
          parts: [
            { q: 'The overdrive of the input device (60 µA, W/L = 60).', hint: ['$V_{ov} = \\sqrt{2I_D/(\\mu_nC_{ox}\\,W/L)}$'], how: ['$$V_{ov} = \\sqrt{\\frac{2(60\\,\\mu)}{120\\,\\mu\\times 60}}$$'], answer: ovc, unit: 'V', tol: 0.02 },
            { q: '$V_P$, by a link down from $V_{b1}$.', hint: ['$V_P = V_{b1} - V_{th} - V_{ov}$'], how: [`$$V_P = 0.55 - 0.3 - ${fx(ovc, 3)}$$`], answer: Cc('vp'), unit: 'V', tol: 0.02 },
            { q: '$V_{out1}+V_{out2}-2V_{th}$ with the outputs at $0.4V_{DD}$.', hint: ['Each output sits at $0.4 \\times 1.8 = 0.72$ V.'], how: ['$$2(0.72) - 2(0.3) = 1.44 - 0.6$$'], answer: 0.84, unit: 'V', tol: 0.01 },
          ],
          answer: Cc('wl'), unit: '', tol: 0.03,
        },
        say: 'Part C: $V_P = 0.121$ V and $(W/L)_{11,12} = 9.85$.' },
      { t: 50, ans: true, title: `**Answers:** A: $V_P = ${fx(A('vp'), 3)}$ V, W/L = ${fx(A('wl'), 4)}, $V_{out,min} = ${fx(A('vmin'), 3)}$ V · B: $V_P$ = ${fx(B('vp'), 3)} V, W/L = ${fx(B('wl'), 4)} · C: $V_P$ = ${fx(Cc('vp'), 3)} V, W/L = ${fx(Cc('wl'), 4)}`, say: 'Three versions, one method: link to P, triode equation for W/L, checks for the swing.' },
    ],
  });
}, { q: 'Quiz 2 (A, B, C)' });

scene(L11, 'Problem Set 2 P5: sizing the replica', 58, (S) => {
  const T = tfm(1, 0, 60);
  const v = ans('bank-ps2-p5', 'v');
  pyqFrame(S, {
    tag: 'LEC 11–12 · PAST PAPER 3 OF 3', title: 'Replica sizes, and what a wrong size does', src: 'Problem Set 2 P5 (Lec 12)',
    q: '$(W/L)_{11} = 40$, sensing devices $(W/L)_{12} = (W/L)_{13} = 12$ (deep triode), $V_{REF} = 1.5$ V, $V_{th} = 0.7$ V. (a) $(W/L)_{14}$, $(W/L)_{15}$ so that $V_{out,CM} = V_{REF}$. (b) With $(W/L)_{15} = 30$, where does the CM settle?',
    qh: 230, tests: 'the **replica rules**, and the balance condition as **matched conductances** — $\\tfrac WL(V_{GS}-V_{th})$ on both sides.',
    fig: (S2) => { const g = replicaFig(S2); g.setAttribute('transform', 'translate(40 120) scale(0.82)'); },
    steps: [
      { t: 6, title: '**(a) M14 is M11’s twin.** Same gate voltage and the same current $I_1$ ⇒ it must have the same size, or the copy fails.', tex: '(W/L)_{14} = (W/L)_{11} = 40', hl: [T([190, 290, 160, 100, C.n]), T([700, 330, 160, 100, C.n])],
        try: {
          q: '**(a)** M14 must be an exact copy of the tail device M11. Find $(W/L)_{14}$.',
          hint: ['M14 and M11 share the same gate voltage and should carry the same current $I_1$.', 'Same $V_{GS}$ and same current ⇒ same size: $(W/L)_{14} = (W/L)_{11}$.'],
          how: [
            'M14 and M11 have their gates tied together, so (at balance) they have the same $V_{GS}$.',
            'Square law: $I_D = \\tfrac12\\mu_nC_{ox}\\tfrac WL V_{ov}^2$. Same $V_{ov}$ and the same current $I_1$ need the same W/L.',
            'So copy the size: $$(W/L)_{14} = (W/L)_{11} = 40$$',
          ],
          why: 'Replica rule 1: copy the device above exactly.',
          answer: ans('bank-ps2-p5', 'w14'), unit: '', tol: 0.01,
        },
        say: 'Same current, same gate: $(W/L)_{14} = (W/L)_{11} = 40$.' },
      { t: 13, title: '**M15 stands in for M12 ∥ M13.** Two parallel devices with the same gate voltage act like one device whose W/L is the sum.', tex: '(W/L)_{15} = (W/L)_{12} + (W/L)_{13} = 12 + 12 = 24', hl: [T([190, 430, 160, 120, C.amb])],
        try: {
          q: '**(a)** Now find $(W/L)_{15}$ so that the loop settles with $V_{out,CM} = V_{REF}$.',
          hint: ['M15 alone (gate at $V_{REF}$) must conduct exactly like M12 and M13 together (gates at the outputs) when the outputs sit at $V_{REF}$.',
            'Deep triode: conductance $= \\mu_nC_{ox}\\tfrac WL(V_{GS}-V_{th})$; parallel conductances add.'],
          how: [
            'In deep triode each device is a conductance $$G = \\mu_nC_{ox}\\tfrac WL(V_{GS}-V_{th})$$',
            'M12 and M13 are in parallel, so their conductances add: $$G_{12}+G_{13} = \\mu_nC_{ox}\\left[(W/L)_{12}+(W/L)_{13}\\right](V_{out,CM}-V_{th})$$',
            'At balance $V_{out,CM} = V_{REF}$, the same gate voltage as M15, so M15 needs the summed size: $$(W/L)_{15} = (W/L)_{12}+(W/L)_{13} = 12 + 12 = 24$$',
          ],
          why: 'Replica rule 2: devices in parallel below ⇒ add their W/L.',
          answer: ans('bank-ps2-p5', 'w15'), unit: '', tol: 0.01,
        },
        say: 'Two parallel devices act like one with the summed width: $(W/L)_{15} = 24$.' },
      { t: 21, title: '**(b) A wrong size moves the CM.** The loop still forces equal conductance: M15 at $V_{REF}$ must match M12 + M13 at the output CM.',
        tex: `30(V_{REF}-V_{th}) = 24(V_{out,CM}-V_{th}),\\; V_{out,CM} = V_{th} + \\frac{30}{24}(V_{REF}-V_{th}) = 0.7 + \\frac{30}{24}(0.8) = ${fx(v, 3)}\\,\\mathrm V`,
        try: {
          q: '**(b)** Someone uses $(W/L)_{15} = 30$ instead (M12, M13 stay at 12 each). Where does the output CM settle?',
          hint: ['The loop still settles where M15’s conductance (gate at $V_{REF}$) equals M12’s + M13’s (gates at the outputs).',
            '$(W/L)_{15}(V_{REF}-V_{th}) = \\left[(W/L)_{12}+(W/L)_{13}\\right](V_{out,CM}-V_{th})$.'],
          how: [
            'Balance means equal conductance; the common $\\mu_nC_{ox}$ cancels: $$30(V_{REF}-V_{th}) = 24(V_{out,CM}-V_{th})$$',
            'Left side: $$30(1.5 - 0.7) = 30\\times 0.8 = 24\\,\\mathrm V$$',
            'So $V_{out,CM} - 0.7 = 24/24 = 1.0$ V. Add back $V_{th}$: $$V_{out,CM} = 0.7 + 1.0 = 1.7\\,\\mathrm V$$',
          ],
          why: 'An oversized M15 conducts more at $V_{REF}$, so the outputs must rise until M12 + M13 match it: the CM ends 0.2 V too high.',
          parts: [{ q: 'How far above $V_{th}$ must the output CM sit, $V_{out,CM} - V_{th}$?', hint: ['$30(V_{REF}-V_{th}) = 24(V_{out,CM}-V_{th})$'], how: ['$$V_{out,CM} - V_{th} = \\frac{30(1.5 - 0.7)}{24} = \\frac{24}{24}$$'], answer: 30 * 0.8 / 24, unit: 'V', tol: 0.01 }],
          answer: v, unit: 'V', tol: 0.01,
        },
        say: 'An oversized M15 conducts more at $V_{REF}$, so the loop pushes the outputs up until M12 + M13 match it: 1.7 V instead of 1.5 V.' },
      { t: 29, ans: true, title: `**Answers:** (a) $(W/L)_{14} = 40$, $(W/L)_{15} = 24$ · (b) with 30: $V_{out,CM} = ${fx(v, 3)}$ V`, say: 'Replica questions are always “match the twin”: copy the device above, sum the devices below, and balance the conductances.' },
    ],
  });
}, { q: 'Problem Set 2 P5' });
