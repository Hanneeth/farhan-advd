/* Lesson C: your Lecture 6 page, region by region (+ two background scenes the questions need). */
'use strict';
const C6 = 'Lec 6 · Your page';

/* NMOS-input folded cascode, fully differential. Lecture naming by default. */
function foldN(S, n = {}) {
  const N = { tail: 'M11', in: ['M1', 'M2'], top: ['M9', 'M10'], pc: ['M7', 'M8'], nc: ['M5', 'M6'], bot: ['M3', 'M4'], fold: ['X', 'Y'], ...n };
  // gate-bias names: generic by default; a past paper passes its own (n.bias) so the figure matches the printed question
  const Bn = { top: 'V_b4', pc: 'V_b3', nc: 'V_b2', bot: 'V_b1', tail: 'V_b5', ...(n.bias || {}) };
  const g = S.g(); const r = S.into(g);
  rail(S, 150, 960, 150);
  const L = 600, R = 820;
  const row = (y, a, b, p, gate) => { const A = fet(S, L, y, { p, name: a, right: true, gl: 26, nameSide: 'l' }); const B = fet(S, R, y, { p, name: b, gl: 26, nameSide: 'r' }); wire(S, [[A.gate[0], y], [B.gate[0], y]]); if (gate) txt(S, 710, y - 9, gate, { size: 16, color: C.muted, anchor: 'middle' }); };
  row(205, N.top[0], N.top[1], true, Bn.top); wire(S, [[L, 150], [L, 155]]); wire(S, [[R, 150], [R, 155]]);
  wire(S, [[L, 255], [L, 280]]); wire(S, [[R, 255], [R, 280]]); dot(S, L, 268); dot(S, R, 268);
  txt(S, L - 12, 290, N.fold[0], { size: 19, color: C.bad, weight: 750, anchor: 'end' }); txt(S, R + 12, 290, N.fold[1], { size: 19, color: C.bad, weight: 750 });
  row(330, N.pc[0], N.pc[1], true, Bn.pc);
  wire(S, [[L, 380], [L, 420]]); wire(S, [[R, 380], [R, 420]]); dot(S, L, 400); dot(S, R, 400);
  txt(S, L + 12, 418, 'V_out1', { size: 16, color: C.volt, weight: 700 }); txt(S, R - 12, 418, 'V_out2', { size: 16, color: C.volt, weight: 700, anchor: 'end' });
  row(470, N.nc[0], N.nc[1], false, Bn.nc); wire(S, [[L, 520], [L, 530]]); wire(S, [[R, 520], [R, 530]]);
  row(580, N.bot[0], N.bot[1], false, Bn.bot); gnd(S, L, 630); gnd(S, R, 630);
  nmos(S, 230, 420, { name: N.in[0], gate: 'V_in1' }); nmos(S, 370, 420, { name: N.in[1], gate: 'V_in2', right: true, nameSide: 'l' });
  wire(S, [[230, 370], [230, 268], [L, 268]]); wire(S, [[370, 370], [370, 240], [700, 240], [700, 268], [R, 268]]);
  wire(S, [[230, 470], [230, 490], [370, 490], [370, 470]]); dot(S, 300, 490);
  nmos(S, 300, 540, { name: N.tail, gate: Bn.tail, gl: 24 }); gnd(S, 300, 590);
  r(); return g;
}

/* single-ended telescopic. o.load: 'diode' (diode-stack cascode mirror) | 'lvc' (M7, M8 gates on X); o.buffer: M2's gate on V_out */
function teleSE(S, o = {}) {
  // node and bias names: generic by default; a past paper passes the names it prints (o.pname, o.rname = node under M4, o.vb = M3/M4 gate)
  const xn = o.xname ?? 'X', qn = o.qname ?? 'Q', pn = o.pname ?? 'P';
  const g = S.g(); const r = S.into(g);
  rail(S, 300, 860, 150);
  const L = 470, R = 690;
  const m7 = pmos(S, L, 205, { name: 'M7', right: true, gl: 26, nameSide: 'l' }); const m8 = pmos(S, R, 205, { name: 'M8', gl: 26 });
  wire(S, [[L, 150], [L, 155]]); wire(S, [[R, 150], [R, 155]]); wire(S, [[m7.gate[0], 205], [m8.gate[0], 205]]); dot(S, 580, 205);
  wire(S, [[L, 255], [L, 265]]); wire(S, [[R, 255], [R, 265]]); dot(S, L, 260); if (pn) txt(S, L - 12, 266, pn, { size: 17, color: C.bad, weight: 750, anchor: 'end' });
  const m5 = pmos(S, L, 315, { name: 'M5', right: true, gl: 26, nameSide: 'l' }); const m6 = pmos(S, R, 315, { name: 'M6', gl: 26 });
  wire(S, [[m5.gate[0], 315], [m6.gate[0], 315]]);
  wire(S, [[L, 365], [L, 400]]); wire(S, [[R, 365], [R, 400]]); dot(S, L, 382); dot(S, R, 382);
  if (xn) txt(S, L - 12, 388, xn, { size: 18, color: C.bad, weight: 750, anchor: 'end' });
  wire(S, [[R, 382], [800, 382]]); txt(S, 808, 389, 'V_out', { size: 20, color: C.volt, weight: 700 });
  if (o.load === 'lvc') { wire(S, [[580, 205], [580, 382], [L, 382]], { color: C.amb }); txt(S, 530, 306, 'V_b2', { size: 17, color: C.muted, anchor: 'middle' }); }
  else { wire(S, [[L, 260], [530, 260], [530, 205]], { color: C.amb }); dot(S, 530, 205); wire(S, [[L, 382], [520, 382], [520, 315]], { color: C.amb }); dot(S, 520, 315); }
  const m3 = nmos(S, L, 450, { name: 'M3', right: true, gl: 26, nameSide: 'l' }); const m4 = nmos(S, R, 450, { name: 'M4', gl: 26 });
  wire(S, [[m3.gate[0], 450], [m4.gate[0], 450]]); txt(S, 580, 441, o.vb || 'V_b1', { size: 17, color: C.muted, anchor: 'middle' });
  wire(S, [[L, 500], [L, 510]]); wire(S, [[R, 500], [R, 510]]); dot(S, L, 505); if (qn) txt(S, L - 12, 511, qn, { size: 17, color: qn === 'Q' ? C.muted : C.bad, weight: 700, anchor: 'end' });
  if (o.rname) { dot(S, R, 505); txt(S, R + 12, 511, o.rname, { size: 18, color: C.bad, weight: 750 }); }
  nmos(S, L, 560, { name: 'M1', gate: 'V_in1' });
  if (o.buffer) { const m2 = nmos(S, R, 560, { name: 'M2', right: true, nameSide: 'l', gl: 30 }); wire(S, [[m2.gate[0], 560], [780, 560], [780, 382]], { color: C.volt }); dot(S, 780, 382); }
  else nmos(S, R, 560, { name: 'M2', gate: 'V_in2', right: true, nameSide: 'l' });
  wire(S, [[L, 610], [L, 630], [R, 630], [R, 610]]); isrc(S, 580, 672, { label: 'I_SS', len: 42 }); gnd(S, 580, 714);
  r(); return g;
}

/* the column the CM range lives in, with live node readouts */
scene(C6, 'PMOS-input folded cascode: the input CM range', 96, (S) => {
  header(S, 'LEC 6 · YOUR PAGE, TOP LEFT', 'How low and how high can the input CM go?');
  const g = foldP(S); g.setAttribute('transform', 'translate(-60 30) scale(0.62)');
  S.fade(g, 0.2, 0.8);
  S.say(0.2, 'Your page’s first circuit: the PMOS-input folded cascode you just built. Question: what range of input CM keeps every transistor saturated?');
  S.say(6, 'Only one column matters for the input: <b>M11 → P → M1 → X → M9</b>. Let us lift it out.');
  // column
  const c = S.g(); const r = S.into(c);
  rail(S, 600, 760, 170);
  pmos(S, 680, 230, { name: 'M11', gate: 'V_b5', gl: 30 }); wire(S, [[680, 170], [680, 180]]);
  wire(S, [[680, 280], [680, 330]]); dot(S, 680, 305); txt(S, 692, 300, 'P', { size: 20, color: C.bad, weight: 800 });
  pmos(S, 680, 380, { name: 'M1', gate: 'V_in', gl: 30 });
  wire(S, [[680, 430], [680, 480]]); dot(S, 680, 455); txt(S, 692, 450, 'X', { size: 20, color: C.bad, weight: 800 });
  nmos(S, 680, 530, { name: 'M9', gate: 'V_b1', gl: 30 }); gnd(S, 680, 580);
  r();
  c.style.opacity = 0; S.fade(c, 7, 0.8);
  S.say(10, 'Two facts fix this column. <b>X is held at $V_{ov9}$ = 0.2 V</b> by the bias of M9 (and the cascode above it). And P sits one <b>link</b> above the gate: $P = V_{in} + |V_{GS1}| = V_{in} + 0.7$.');
  S.say(18, 'So changing $V_{in}$ moves only P — and P decides how the 1.8 V above X is shared between M11 (above P) and M1 (below P).');
  // tower + readouts
  const yb = 780, sc = 300, x0 = 1040;
  const rect = (n) => { const rr = S.el('rect', { x: x0, width: 110, rx: 4, 'stroke-width': 2 }); const t = txt(S, x0 + 55, 0, n, { size: 19, color: '#fff', weight: 750, anchor: 'middle' }); return { rr, t }; };
  const B = { M9: rect('M9'), M1: rect('M1'), M11: rect('M11') };
  const vinL = S.el('line', { x1: x0 - 70, x2: x0 + 124, stroke: C.volt, 'stroke-width': 2.6, 'stroke-dasharray': '6 5' });
  const vinT = txt(S, x0 - 76, 0, '', { size: 18, color: C.volt, weight: 700, anchor: 'end' });
  const rd = [txt(S, 1220, 300, '', { size: 21, color: C.text, mono: true, weight: 700 }), txt(S, 1220, 336, '', { size: 19, color: C.muted, mono: true }), txt(S, 1220, 372, '', { size: 19, color: C.muted, mono: true }), txt(S, 1220, 408, '', { size: 19, color: C.muted, mono: true })];
  const twG = [B.M9.rr, B.M1.rr, B.M11.rr, B.M9.t, B.M1.t, B.M11.t, vinL, vinT, ...rd]; twG.forEach((e) => { e.style.opacity = 0; S.fade(e, 22, 0.6); });
  const vAt = (t) => (t < 30 ? 0.3 : t < 40 ? lerp(0.3, 0.9, E.inout((t - 30) / 10)) : t < 52 ? 0.9 : t < 62 ? lerp(0.9, -0.3, E.inout((t - 52) / 10)) : -0.3);
  S.anim(0, 1e4, 'cm', (_p, t) => {
    const vin = vAt(t), P = vin + 0.7, X = 0.2;
    [['M9', 0, X], ['M1', X, P], ['M11', P, 1.8]].forEach(([n, a, b]) => {
      const y1 = yb - b * sc, y2 = yb - a * sc; const sq = b - a <= 0.2001 && n !== 'M9';
      const st = sq ? 'sq' : b - a > 0.21 ? 'ok' : 'min';
      B[n].rr.setAttribute('y', y1); B[n].rr.setAttribute('height', y2 - y1); B[n].rr.setAttribute('fill', TST[st][0]); B[n].rr.setAttribute('stroke', TST[st][1]);
      B[n].t.setAttribute('y', (y1 + y2) / 2 + 7); B[n].t.setAttribute('fill', TST[st][1]);
    });
    const yv = yb - vin * sc; vinL.setAttribute('y1', yv); vinL.setAttribute('y2', yv); vinT.setAttribute('y', yv + 6); vinT.textContent = ''; richText(vinT, `V_in ${vin.toFixed(2)}`, 18);
    rd[0].textContent = `Vin = ${vin.toFixed(2)} V`; rd[1].textContent = `P = Vin + 0.7 = ${P.toFixed(2)} V (link)`;
    rd[2].textContent = `M11 check: 1.8 − P = ${(1.8 - P).toFixed(2)} V`; rd[3].textContent = `M1 check:  P − X = ${(P - 0.2).toFixed(2)} V`;
  }, E.lin);
  S.say(22, 'The tower of that column (1.8 V tall). M9’s block is fixed at 0.2 V; M1’s block runs from X to P; M11’s from P to $V_{DD}$.');
  S.say(30, '<b>Ceiling:</b> push $V_{in}$ up. P rises with it, and <b>M11’s</b> block shrinks… squeezed to 0.2 V when P = 1.6 V, i.e. $V_{in} = 1.6 - 0.7 = 0.9$ V.');
  eqAt(S, 'V_{in,CM,max} = V_{DD} - |V_{ov11}| - |V_{GS1}| = 1.8 - 0.2 - 0.7 = 0.9\\,\\mathrm{V}', 500, 690, 40, { size: 24, w: 900, color: '#ffd38a' });
  S.say(40, 'In symbols: check M11 ($|V_{ov11}|$ below $V_{DD}$), then the link down to the gate ($|V_{GS1}|$). Your page’s first line.');
  S.say(52, '<b>Floor:</b> pull $V_{in}$ down. P falls towards X and now <b>M1’s</b> block shrinks — squeezed when P = X + 0.2 = 0.4 V, i.e. $V_{in} = 0.4 - 0.7 = -0.3$ V. <b>Below ground!</b>');
  eqAt(S, 'V_{in,CM,min} = V_{ov9} + |V_{ov1}| - |V_{GS1}| = V_{ov9} - |V_{thp}| = 0.2 - 0.5 = -0.3\\,\\mathrm{V}', 500, 770, 62, { size: 22, w: 960, color: '#ffd38a' });
  S.say(62, 'Your page writes it two ways: walk up — check M9, check M1, then back down the link: $V_{ov9} + |V_{ov1}| - |V_{GS1}|$. Since $|V_{GS1}| = |V_{ov1}| + |V_{thp}|$ the $V_{ov1}$’s cancel: $V_{ov9} - |V_{thp}|$.');
  whyBox(S, 1200, 460, 360, 230, '**Why below ground is possible:** folding put M1’s drain at X, only one $V_{ov}$ above ground, and a PMOS gate may sit $|V_{th}|$ below its drain. Razavi: the main gift of folding.', 74);
  S.say(74, '<span class="why">Why “V_ov for M11 but V_GS for M1”?</span> M11’s step is a check (through its channel); M1’s step is the link to its gate, where $V_{in}$ lives. Both limits use both kinds; only the squeezed block changes.');
});

scene(C6, 'NMOS-input folded cascode: gain and CM range', 80, (S) => {
  header(S, 'LEC 6 · YOUR PAGE, TOP RIGHT', 'Swap every device type: the ceiling now passes V_DD');
  const g = foldN(S); g.setAttribute('transform', 'translate(-110 50)');
  S.draw(g, 0.3, 2.4);
  S.say(0.3, 'Your second circuit: the mirror image. NMOS input pair M1, M2 with tail M11 to ground; it folds into the <b>top</b>: fold nodes X, Y hang under PMOS sources M9, M10. Below them: PMOS cascodes M7, M8, the outputs, NMOS cascodes M5, M6 and bottom sources M3, M4.');
  eqAt(S, 'R_{up} = g_{m8}r_{O8}(r_{O10}\\parallel r_{O2})', 1220, 230, 10, { size: 28, w: 620, color: C.p });
  S.say(10, '<b>Gain, two looks.</b> Up from $V_{out2}$: the PMOS cascode M8, and under its source (Y) hang two $r_O$: M10’s and the input device M2’s.');
  eqAt(S, 'R_{down} = g_{m6}r_{O6}r_{O4}', 1220, 300, 16, { size: 28, w: 620, color: C.n });
  eqAt(S, 'A_v = g_{m1,2}\\left[g_{m8}r_{O8}(r_{O10}\\parallel r_{O2})\\parallel g_{m6}r_{O6}r_{O4}\\right]', 1220, 380, 20, { size: 25, w: 660, color: '#ffd38a' });
  S.say(16, 'Down: an ordinary NMOS cascode M6 on M4. Multiply by $G_m ≈ g_{m1}$ (the current divider again).');
  S.say(28, '<b>CM range, same method.</b> Column: M9 (from $V_{DD}$) → X → M1 → its source S → tail M11. X is held at $V_{DD} - |V_{ov9}|$ = 1.6 V; the link is now $S = V_{in} - V_{GS1}$.');
  eqAt(S, '\\text{floor: } V_{in} = \\underbrace{V_{ov11}}_{\\text{tail check}} + \\underbrace{V_{GS1}}_{\\text{link}} = 0.2 + 0.7 = 0.9\\,\\mathrm{V}', 1220, 480, 36, { size: 24, w: 680, h: 110 });
  S.say(36, '<b>Floor:</b> pull $V_{in}$ down; S falls and the tail’s block is squeezed: $V_{in,min} = V_{ov11} + V_{GS1} = 0.9$ V.');
  eqAt(S, '\\text{ceiling: } V_{in} = \\underbrace{V_{DD} - |V_{ov10}|}_{X} - V_{ov1} + V_{GS1} = V_{DD} - |V_{ov10}| + V_{th1} = 2.1\\,\\mathrm{V}', 1180, 600, 44, { size: 20, w: 780, h: 110, color: '#ffd38a' });
  S.say(44, '<b>Ceiling:</b> push $V_{in}$ up; S rises towards X and <b>M1’s</b> block is squeezed at S = 1.4 V: $V_{in,max} = 1.4 + 0.7 = 2.1$ V — <b>above $V_{DD}$</b>.');
  whyBox(S, 1140, 690, 420, 150, '**One rule for both:** the input pair’s drain sits near the **opposite** rail, so its CM range passes that rail.', 54);
  S.say(54, 'One rule for both versions: PMOS input → floor below ground; NMOS input → ceiling above $V_{DD}$. The other limit is always the usual tail check plus link.');
});

scene(C6, 'Rail-to-rail input: both pairs at once', 60, (S) => {
  header(S, 'LEC 6 · YOUR PAGE, BOTTOM LEFT', 'An NMOS pair + a PMOS pair, folded into the same cascodes');
  const g = S.g(); const r = S.into(g);
  rail(S, 100, 740, 170); S.el('line', { x1: 100, y1: 640, x2: 740, y2: 640, stroke: C.wire, 'stroke-width': 3.4 });
  S.el('rect', { x: 110, y: 220, width: 230, height: 120, rx: 14, fill: 'rgba(167,139,250,0.08)', stroke: C.n, 'stroke-width': 2.4 }); txt(S, 225, 270, 'NMOS pair M1, M2', { size: 19, color: C.n, weight: 700, anchor: 'middle' }); txt(S, 225, 298, 'works near V_DD', { size: 17, color: C.n, anchor: 'middle' });
  S.el('rect', { x: 110, y: 470, width: 230, height: 120, rx: 14, fill: 'rgba(45,212,191,0.08)', stroke: C.p, 'stroke-width': 2.4 }); txt(S, 225, 520, 'PMOS pair M3, M4', { size: 19, color: C.p, weight: 700, anchor: 'middle' }); txt(S, 225, 548, 'works near 0 V', { size: 17, color: C.p, anchor: 'middle' });
  S.el('rect', { x: 470, y: 220, width: 240, height: 370, rx: 14, fill: 'rgba(255,255,255,0.03)', stroke: '#3a475b', 'stroke-width': 2.4 }); txt(S, 590, 395, 'shared folded', { size: 19, color: C.text, weight: 700, anchor: 'middle' }); txt(S, 590, 422, 'cascodes M5–M12', { size: 19, color: C.text, weight: 700, anchor: 'middle' });
  arrow(S, 340, 280, 468, 280, { color: C.n }); arrow(S, 340, 530, 468, 530, { color: C.p });
  txt(S, 40, 410, 'V_in1, V_in2 → both pairs', { size: 18, color: C.volt, weight: 700 });
  r();
  S.draw(g, 0.3, 1.6);
  S.say(0.3, 'Each folded version passes only <b>one</b> rail. So your page puts both pairs in parallel: an NMOS pair and a PMOS pair take the same inputs and fold into the same cascode branches.');
  const x0 = 860, y0 = 560;
  const ax = axes(S, x0, y0, 660, 360, { x: 'input CM', y: 'G_m' }); S.fade(ax, 6, 0.5);
  const xv = (v) => x0 + 40 + ((v + 0.4) / 2.6) * 600;
  [[0, '0 V'], [1.8, 'V_DD']].forEach(([v, s]) => { S.el('line', { x1: xv(v), y1: y0, x2: xv(v), y2: y0 - 340, stroke: '#2a3546', 'stroke-dasharray': '4 5' }); txt(S, xv(v), y0 + 28, s, { size: 17, color: C.muted, anchor: 'middle' }); });
  const curveG = (v) => { const p = v <= 1.2 ? 1 : 0, n = v >= 0.6 ? 1 : 0; return p + n; };
  S.el('polyline', { points: ptsOf(300, -0.35, 2.15, (v) => [xv(v), y0 - 120 * curveG(v)]), fill: 'none', stroke: C.cur, 'stroke-width': 3.4 });
  txt(S, xv(0.25), y0 - 140, 'PMOS only', { size: 17, color: C.p, anchor: 'middle' }); txt(S, xv(0.9), y0 - 260, 'both: 2g_m', { size: 17, color: C.amb, anchor: 'middle' }); txt(S, xv(1.6), y0 - 140, 'NMOS only', { size: 17, color: C.n, anchor: 'middle' });
  const mk = S.el('circle', { r: 9, fill: '#fff' }); const mt = txt(S, 0, 0, '', { size: 18, color: C.text, mono: true, weight: 700 });
  mk.style.opacity = 0; mt.style.opacity = 0; S.fade(mk, 12, 0.4); S.fade(mt, 12, 0.4);
  S.anim(0, 1e4, 'rr', (_p, t) => { const v = t < 12 ? -0.3 : t < 34 ? lerp(-0.3, 2.1, E.inout((t - 12) / 22)) : 2.1; mk.setAttribute('cx', xv(v)); mk.setAttribute('cy', y0 - 120 * curveG(v)); mt.setAttribute('x', xv(v) - 40); mt.setAttribute('y', y0 - 120 * curveG(v) - 48); mt.textContent = `${v.toFixed(2)} V`; }, E.lin);
  S.say(12, 'Sweep the input CM from below ground to above $V_{DD}$. Near ground only the PMOS pair conducts; in the middle both do; near $V_{DD}$ only the NMOS pair. Some pair always works: <b>rail-to-rail</b>.');
  whyBox(S, 860, 620, 700, 170, '**Side effect:** where both pairs work their currents add, so $G_m$ (and the gain) roughly **doubles** in the middle. Keeping $G_m$ constant needs extra circuitry (not in the mid-sem).', 30);
  S.say(30, 'One exam-worthy side effect: $G_m$ is not constant — it roughly doubles where both pairs conduct.');
});

scene(C6, 'Background: the telescopic buffer window', 70, (S) => {
  header(S, 'BACKGROUND (LEC 3–4)', 'Output tied to M2’s gate: two fences squeeze it');
  const g = teleSE(S, { load: 'diode', buffer: true }); g.setAttribute('transform', 'translate(-160 40)');
  S.draw(g, 0.3, 2.2);
  S.say(0.3, 'Before your page’s folded buffer, the telescopic one it is compared with (Lec 3–4, and three questions here). A unity-gain buffer: $V_{out}$ is wired to M2’s gate, the inverting input.');
  S.say(7, 'Now the output is also an input gate, so it has to keep two transistors happy. First a <b>link</b>: Q (M2’s drain = M4’s source) sits one $V_{GS4}$ below M4’s gate: $Q = V_{b1} - V_{GS4}$, fixed.');
  eqAt(S, '\\text{M4 (check): } V_{out} \\ge V_{b1} - V_{th4}', 1180, 240, 14, { size: 30, w: 700 });
  S.say(14, '<b>Floor — M4:</b> its drain is $V_{out}$, its gate $V_{b1}$: NMOS fence $V_{out} \\ge V_{b1} - V_{th4}$.');
  eqAt(S, '\\text{M2: } V_{out} \\le Q + V_{th2} = V_{b1} - V_{GS4} + V_{th2}', 1180, 330, 22, { size: 26, w: 760 });
  S.say(22, '<b>Ceiling — M2:</b> its gate is now $V_{out}$, its drain is the pinned Q. An NMOS gate may sit at most $V_{th}$ above its drain: $V_{out} \\le V_{b1} - V_{GS4} + V_{th2}$.');
  eqAt(S, '\\text{width} = V_{th} - V_{ov4} \\approx 0.25\\text{–}0.5\\,\\mathrm{V}', 1180, 420, 30, { size: 30, w: 700, color: '#ffb36b' });
  S.say(30, 'Subtract: $V_{b1}$ cancels and only $V_{th} - V_{ov4}$ is left — a tiny window. Moving $V_{b1}$ only slides it.');
  whyBox(S, 820, 500, 740, 200, '**Why so tight?** M2 sits **under** the output in the same column: raising $V_{out}$ raises M2’s gate while its drain Q is pinned, so M2 gets squeezed. Keep this picture — the folded buffer removes exactly this.', 38);
  S.say(38, '<span class="why">The root cause:</span> the input device M2 shares the output’s column. Your Lecture 6 page shows what happens when it doesn’t.');
});

scene(C6, 'Folded cascode with the output shorted to an input', 76, (S) => {
  header(S, 'LEC 6 · YOUR PAGE, MIDDLE', 'In the folded buffer both fences are floors');
  const g = S.g(); const r = S.into(g);
  wire(S, [[300, 170], [300, 220]]); txt(S, 312, 190, 'from the PMOS cascode above', { size: 16, color: C.muted });
  dot(S, 300, 200); txt(S, 288, 206, 'V_out', { size: 21, color: C.volt, weight: 700, anchor: 'end' });
  nmos(S, 300, 270, { name: 'M4', gate: 'V_b2 = 0.8', gl: 30 });
  wire(S, [[300, 320], [300, 360]]); dot(S, 300, 340); txt(S, 312, 360, 'fold node', { size: 18, color: C.bad, weight: 700 });
  nmos(S, 300, 410, { name: 'M10', gate: 'V_b1', gl: 30 }); gnd(S, 300, 460);
  const m2 = pmos(S, 520, 280, { name: 'M2', right: true, nameSide: 'l', gl: 40 }); wire(S, [[520, 230], [520, 200]]); txt(S, 530, 210, 'tail', { size: 16, color: C.muted });
  wire(S, [[520, 330], [520, 340], [300, 340]]);
  wire(S, [[m2.gate[0], 280], [600, 280], [600, 140], [300, 140], [300, 200]], { color: C.volt });
  txt(S, 610, 230, 'gate = V_out', { size: 18, color: C.volt, weight: 700 });
  r();
  S.draw(g, 0.3, 1.8);
  S.say(0.3, 'Your page zooms into the folded cascode used as a buffer: $V_{out}$ wired to the gate of the PMOS input M2. The NMOS cascode M4 (gate $V_{b2}$) sits above the bottom source M10; between them is the fold node — which is also M2’s drain.');
  S.say(8, 'Same job as the telescopic: write each device’s condition with $V_{out}$ in it. First the link: fold node = $V_{b2} - V_{GS4}$ = 0.8 − 0.6 = 0.2 V, pinned.');
  eqAt(S, '\\text{M4: } V_{out} \\ge V_{b2} - V_{th4} = 0.8 - 0.4 = 0.4\\,\\mathrm{V}', 1150, 230, 14, { size: 28, w: 800 });
  S.say(14, '<b>M4 (NMOS):</b> drain $V_{out}$ ≥ gate − $V_{th}$: $V_{out} \\ge 0.4$ V. (Your page writes the fence with the source terms cancelling — same line.)');
  eqAt(S, '\\text{M2 (PMOS): } \\underbrace{V_{b2} - V_{GS4}}_{\\text{drain}} \\le \\underbrace{V_{out}}_{\\text{gate}} + |V_{th2}| \\Rightarrow V_{out} \\ge -0.3\\,\\mathrm{V}', 1150, 340, 22, { size: 26, w: 820, h: 110 });
  S.say(22, '<b>M2 (PMOS):</b> drain may be at most $|V_{th}|$ above the gate: $0.2 \\le V_{out} + 0.5$, so $V_{out} \\ge -0.3$ V.');
  const yv = (v) => 820 - (v + 0.4) * 200;
  const ld = S.g();
  S.el('line', { x1: 200, y1: yv(-0.4), x2: 200, y2: yv(1.0), stroke: C.dim, 'stroke-width': 2 }, ld);
  [[0.8, 'V_b2 = 0.8', C.muted], [0.4, 'M4 floor 0.4 V ← binds', C.ok], [0, '0 V', C.muted], [-0.3, 'M2 floor −0.3 V', C.muted]].forEach(([v, s, col]) => { S.el('line', { x1: 190, y1: yv(v), x2: 210, y2: yv(v), stroke: col, 'stroke-width': 3 }, ld); txt(S, 222, yv(v) + 7, s, { size: 19, color: col, weight: 600 }, ld); });
  S.el('rect', { x: 194, y: yv(1.0), width: 12, height: yv(0.4) - yv(1.0), rx: 4, fill: C.ok, 'fill-opacity': 0.5 }, ld);
  ld.style.opacity = 0; S.fade(ld, 30, 0.7);
  S.say(30, 'Both are <b>floors</b> ($V_{out} \\ge$ …), and the output must satisfy both, so the <b>higher</b> one binds: $V_{out} \\ge 0.4$ V. There is no squeezing ceiling from M2.');
  whyBox(S, 820, 470, 740, 230, '**Why it is far better than the telescopic:** M2’s drain is the fold node, pinned by $V_{b2}$ in **another column**. Raising the output raises M2’s gate, which only makes M2 **more** saturated. The input left the output column — the second gift of folding.', 40);
  S.say(40, '<span class="why">Why it works:</span> the fold node does not move with the output, so M2 can never be squeezed by a rising output. Compare the half-volt telescopic window you just saw.');
});

scene(C6, 'Background: the diode-stack mirror and its tax', 58, (S) => {
  header(S, 'BACKGROUND (LEC 3)', 'A diode-stack cascode mirror costs one extra |V_thp|');
  const g = teleSE(S, { load: 'diode' }); g.setAttribute('transform', 'translate(-160 40)');
  S.draw(g, 0.3, 2.2);
  S.say(0.3, 'The single-ended telescopic needs a mirror on top. The simple way (Lec 3): M7 and M5 are both <b>diodes</b> (gates tied to their drains, orange), and M8, M6 copy their gates.');
  const tw = tower(S, 1000, 520, [{ v: 0.7, name: 'M5 diode', st: 'diode', note: 'another whole |V_GS|' }, { v: 0.7, name: 'M7 diode', st: 'diode', note: 'a whole |V_GS| (0.7)' }], 220, { w: 110, nodes: ['X (M6 gate)', 'P', 'V_DD'] });
  tw.style.opacity = 0; S.fade(tw, 8, 0.6);
  S.say(8, 'A diode always takes a whole $|V_{GS}|$, never just $|V_{ov}|$. Two diodes in a row put M6’s gate (= X) two $|V_{GS}|$ below $V_{DD}$.');
  eqAt(S, 'V_{out,max} = V_{G6} + |V_{th}| = V_{DD} - 2|V_{GS}| + |V_{th}| = V_{DD} - |V_{ov8}| - |V_{ov6}| - |V_{thp}|', 1180, 600, 16, { size: 19, w: 760, color: '#ffb36b' });
  S.say(16, 'M6 stays saturated while its drain ($V_{out}$) is at most $|V_{th}|$ above its gate. So the output tops out at $V_{DD} - 2|V_{GS}| + |V_{th}|$ = $V_{DD} - |V_{ov8}| - |V_{ov6}| - |V_{thp}|$.');
  whyBox(S, 560, 680, 1000, 130, '**The diode tax:** compared with ideal cascode loads ($V_{DD} - |V_{ov8}| - |V_{ov6}|$), one whole **$|V_{thp}|$** of swing is lost. Your page’s last circuit removes it.', 26);
  S.say(26, 'Compared with ideal cascode sources, one whole $|V_{thp}|$ is wasted — the “diode tax”. Problem Set 1 P5 and the 2024 mid-sem Q3 use this. Your page’s last circuit is the fix.');
});

scene(C6, 'The last circuit: a cascode load without the diode tax', 84, (S) => {
  header(S, 'LEC 6 · YOUR PAGE, BOTTOM', 'M7, M8 gates go to X: V_b1 sits between two fences');
  const g = teleSE(S, { load: 'lvc' }); g.setAttribute('transform', 'translate(-160 40)');
  S.draw(g, 0.3, 2.2);
  S.say(0.3, 'Look closely at the last circuit: the gates of M7 and M8 are <b>not</b> tied to M7’s drain. They go down to <b>X</b>, the drain of the cascode M5 (orange). M5, M6 get their own bias (called $V_{b2}$ here, $V_{b1}$ on your page).');
  S.say(9, 'Read the voltages from the top. M7’s source is $V_{DD}$ and its gate is X — a <b>link</b>: $X = V_{DD} - |V_{GS7}|$ = 1.8 − 0.7 = 1.1 V.');
  eqAt(S, '\\text{M5 saturated: } X \\le V_{b} + |V_{th5}| \\Rightarrow V_{b} \\ge V_{DD} - |V_{GS7}| - |V_{th5}| = 0.6\\,\\mathrm{V}', 1210, 230, 17, { size: 18, w: 720 });
  S.say(17, '<b>M5 saturated</b> (PMOS fence): its drain X may be at most $|V_{th5}|$ above its gate: $V_b \\ge 1.1 - 0.5 = 0.6$ V — your page’s first line.');
  eqAt(S, '\\text{M7 saturated: } P \\le V_{DD} - |V_{ov7}|,\\;\\; P = V_b + |V_{GS5}| \\Rightarrow V_b \\le 0.9\\,\\mathrm{V}', 1230, 320, 26, { size: 19, w: 660 });
  S.say(26, '<b>M7 saturated</b>: its drain P (= M5’s source, one link above $V_b$) must keep $|V_{ov7}|$ below $V_{DD}$: $P_{max} = 1.6$ V, so $V_b \\le 1.6 - 0.7 = 0.9$ V.');
  const yv = (v) => 820 - v * 240;
  const ld = S.g();
  S.el('line', { x1: 860, y1: yv(0), x2: 860, y2: yv(1.8), stroke: C.dim, 'stroke-width': 2 }, ld);
  [[1.8, 'V_DD', C.muted], [1.6, 'P max = V_DD − |V_ov7|', C.p], [1.1, 'X = V_DD − |V_GS7|', C.bad], [0.9, 'V_b max', C.ok], [0.6, 'V_b min', C.ok], [0, '0', C.muted]].forEach(([v, s, col]) => { S.el('line', { x1: 850, y1: yv(v), x2: 870, y2: yv(v), stroke: col, 'stroke-width': 3 }, ld); txt(S, 882, yv(v) + 7, s, { size: 18, color: col, weight: 600 }, ld); });
  S.el('rect', { x: 854, y: yv(0.9), width: 12, height: yv(0.6) - yv(0.9), rx: 4, fill: C.ok, 'fill-opacity': 0.55 }, ld);
  ld.style.opacity = 0; S.fade(ld, 34, 0.7);
  S.say(34, 'So the bias has a window, 0.6–0.9 V, set by two fences. Anywhere inside, both M5 and M7 are saturated.');
  whyBox(S, 1140, 400, 420, 260, '**The payoff:** with $V_b$ near its top, $V_{out,max} = V_b + |V_{th}| ≈ V_{DD} - |V_{ov8}| - |V_{ov6}|$ = 1.4 V, versus 0.9 V with the diode stack — **no diode tax**.', 42);
  S.say(42, 'And the reason to bother: the output can now rise to $V_{DD} - |V_{ov8}| - |V_{ov6}|$ (1.4 V) instead of losing a $|V_{thp}|$ (0.9 V).');
  whyBox(S, 1140, 680, 420, 150, 'Your page expands $P_{max}$ as $V_{DD} - |V_{GS7}| - |V_{th7}|$; it should be **+ $|V_{th7}|$** ($|V_{ov7}| = |V_{GS7}| - |V_{th7}|$).', 52);
  S.say(52, 'One slip to fix on your page: $V_{DD} - |V_{ov7}|$ expands to $V_{DD} - |V_{GS7}| + |V_{th7}|$, with a plus. Tutorial 3 Q1(d) asks for this exact window.');
});

scene(C6, 'Gain boosting begins: A_v = G_m × R_out', 44, (S) => {
  header(S, 'LEC 6 · YOUR PAGE, LAST LINE', 'G_m is pinned; R_out is the factor to grow');
  eqAt(S, 'A_v = G_m \\times R_{out}', 800, 220, 0.4, { size: 58 });
  S.say(0.4, 'Your page ends by opening the next topic. Every gain is $G_m$ times $R_{out}$.');
  const c1 = chip(S, 650, 320, 'G_m ≈ g_m = 2I_D/V_ov: costs power', { color: C.bad, size: 20 }); c1.style.opacity = 0; S.pop(c1, 6);
  const c2 = chip(S, 1000, 380, 'R_out: × g_m r_O per cascode', { color: C.ok, size: 20 }); c2.style.opacity = 0; S.pop(c2, 10);
  S.say(6, '$G_m$ is the input device’s $g_m = 2I_D/V_{ov}$: more of it needs more current. Hard.');
  S.say(10, '$R_{out}$ can be multiplied by $g_mr_O$ with every cascode — but each stacked cascode costs another $V_{ov}$ block.');
  whyBox(S, 300, 480, 1000, 200, '**Lectures 7–8:** two ways to more gain **without** stacking more devices in the output column — a **second stage**, and **gain boosting** (an amplifier that multiplies $R_{out}$ by $(1 + A_1)$). Your Lec 7–12 lesson continues from here.', 16);
  S.say(16, 'Lectures 7 and 8 answer it — a second stage, and gain boosting. The Lec 7–12 lesson picks up exactly here.');
});

scene(C6, 'Lecture 6 in one card', 28, (S) => {
  header(S, 'LEC 6 · REMEMBER', 'Everything from Lecture 6');
  remember(S, [
    'PMOS input: $V_{DD} - |V_{ov11}| - |V_{GS1}| \\ge V_{in,CM} \\ge V_{ov9} + |V_{ov1}| - |V_{GS1}| = V_{ov9} - |V_{thp}|$ (below 0).',
    'NMOS input: $V_{ov11} + V_{GS1} \\le V_{in,CM} \\le V_{DD} - |V_{ov10}| + V_{th1}$ (above $V_{DD}$); $A_v = g_{m1}[g_{m8}r_{O8}(r_{O10}\\parallel r_{O2})\\parallel g_{m6}r_{O6}r_{O4}]$.',
    'Rail-to-rail: both pairs; $G_m$ doubles in the middle.',
    'Telescopic buffer: floor $V_{b1} - V_{th4}$, ceiling $V_{b1} - V_{GS4} + V_{th2}$ (width $V_{th} - V_{ov}$). Folded buffer: both floors, higher binds.',
    'Diode stack: $V_{out,max} = V_{DD} - |V_{ov8}| - |V_{ov6}| - |V_{thp}|$. Low-voltage load: $X = V_{DD} - |V_{GS7}|$, $V_b \\in [V_{DD} - |V_{GS7}| - |V_{th5}|,\\; V_{DD} - |V_{ov7}| - |V_{GS5}|]$.',
    '$A_v = G_mR_{out}$: grow $R_{out}$ next (Lec 7–8).',
  ], 0.4, 'Lecture 6 · remember');
  S.say(0.4, 'Now every question tied to Lecture 6 — you solve each part first.');
});
