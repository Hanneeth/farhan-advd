/* Lesson C foundations: everything Lec 6 assumes, built from one transistor. */
'use strict';
const CF = 'Foundations for Lec 6';

/* PMOS-input folded cascode, fully differential. n: names (lecture naming by default). */
function foldP(S, n = {}) {
  const N = { tail: 'M11', in: ['M1', 'M2'], top: ['M7', 'M8'], pc: ['M5', 'M6'], nc: ['M3', 'M4'], bot: ['M9', 'M10'], ...n };
  // gate-bias names: generic by default; a past paper passes its own (n.bias) so the figure matches the printed question.
  // bias.tail = null draws the tail as an ideal current source labelled N.tail (as printed in Razavi Fig. 9.17 / Problem 9.3).
  const Bn = { top: 'V_b4', pc: 'V_b3', nc: 'V_b2', bot: 'V_b1', tail: 'V_b5', ...(n.bias || {}) };
  const g = S.g(); const r = S.into(g);
  rail(S, 150, 960, 150);
  const L = 620, R = 840;
  const row = (y, a, b, p, gate) => { const A = fet(S, L, y, { p, name: a, right: true, gl: 26, nameSide: 'l' }); const B = fet(S, R, y, { p, name: b, gl: 26, nameSide: 'r' }); wire(S, [[A.gate[0], y], [B.gate[0], y]]); txt(S, 730, y - 9, gate, { size: 16, color: C.muted, anchor: 'middle' }); };
  row(205, N.top[0], N.top[1], true, Bn.top); wire(S, [[L, 150], [L, 155]]); wire(S, [[R, 150], [R, 155]]);
  row(305, N.pc[0], N.pc[1], true, Bn.pc);
  wire(S, [[L, 355], [L, 405]]); wire(S, [[R, 355], [R, 405]]); dot(S, L, 380); dot(S, R, 380);
  txt(S, L - 12, 374, 'V_out1', { size: 17, color: C.volt, weight: 700, anchor: 'end' }); txt(S, R + 12, 374, 'V_out2', { size: 17, color: C.volt, weight: 700 });
  row(455, N.nc[0], N.nc[1], false, Bn.nc);
  wire(S, [[L, 505], [L, 555]]); wire(S, [[R, 505], [R, 555]]); dot(S, L, 530); dot(S, R, 530);
  txt(S, L + 12, 548, 'X', { size: 19, color: C.bad, weight: 750 }); txt(S, R - 12, 548, 'Y', { size: 19, color: C.bad, weight: 750, anchor: 'end' });
  row(605, N.bot[0], N.bot[1], false, Bn.bot); gnd(S, L, 655); gnd(S, R, 655);
  if (Bn.tail === null) { isrc(S, 300, 205, { label: N.tail, len: 50 }); wire(S, [[300, 150], [300, 155]]); }
  else { pmos(S, 300, 205, { name: N.tail, gate: Bn.tail, gl: 24 }); wire(S, [[300, 150], [300, 155]]); }
  wire(S, [[300, 255], [300, 270]]); dot(S, 300, 270); txt(S, 312, 264, 'P', { size: 18, color: C.bad, weight: 750 });
  wire(S, [[220, 270], [380, 270]]); wire(S, [[220, 270], [220, 280]]); wire(S, [[380, 270], [380, 280]]);
  pmos(S, 220, 330, { name: N.in[0], gate: 'V_in1', gl: 24 }); pmos(S, 380, 330, { name: N.in[1], gate: 'V_in2', right: true, nameSide: 'l', gl: 24 });
  wire(S, [[220, 380], [220, 530], [L, 530]]);
  wire(S, [[380, 380], [380, 705], [915, 705], [915, 530], [R, 530]]); // clear of the M6/M10 names
  r(); return g;
}

scene(CF, 'The picture first: a tap and a waterfall', 66, (S) => {
  header(S, 'FOUNDATIONS · 0', 'A transistor is a tap; saturation is a waterfall');
  const WATER = '#38bdf8', VTH = 0.5;
  // ── left: the tap. Pipe from source to drain, a sluice gate lifted by V_GS
  const pipe = S.g(); const rp = S.into(pipe);
  S.el('rect', { x: 120, y: 300, width: 600, height: 64, fill: '#0d1a28' });
  wire(S, [[120, 300], [380, 300]]); wire(S, [[440, 300], [720, 300]]); wire(S, [[120, 364], [380, 364]]); wire(S, [[440, 364], [720, 364]]);
  S.el('rect', { x: 380, y: 364, width: 60, height: 110, fill: '#060a10', stroke: C.dim, 'stroke-width': 2 }); // slot the gate sinks into
  S.el('rect', { x: 380, y: 186, width: 60, height: 114, fill: '#060a10', stroke: C.dim, 'stroke-width': 2 }); // housing above
  txt(S, 120, 286, 'source', { size: 20, color: C.muted }); txt(S, 720, 286, 'drain', { size: 20, color: C.muted, anchor: 'end' });
  txt(S, 410, 172, 'gate = the handle', { size: 19, color: C.amb, anchor: 'middle', weight: 700 });
  rp();
  S.draw(pipe, 0.3, 1.2);
  const gate = S.el('rect', { x: 386, y: 186, width: 48, height: 288, rx: 4, fill: C.amb, 'fill-opacity': 0.85 });
  const flowIn = S.el('path', { d: 'M130 332 L720 332', fill: 'none', stroke: WATER, 'stroke-linecap': 'round', 'stroke-dasharray': '14 12' });
  const vgsT = txt(S, 120, 540, '', { size: 22, color: C.text, mono: true, weight: 700 });
  const idT = txt(S, 120, 576, '', { size: 20, color: WATER, mono: true, weight: 700 });
  const fee = chip(S, 610, 410, 'first V_th: entry fee, nothing flows', { color: C.bad, size: 18 });
  const ov = chip(S, 610, 460, 'the opening = V_ov', { color: C.ok, size: 18 });
  [gate, flowIn, vgsT, idT, fee, ov].forEach((e) => { e.style.opacity = 0; });
  [gate, vgsT, idT].forEach((e) => S.fade(e, 5, 0.5)); S.fade(fee, 7, 0.5); S.fade(ov, 14, 0.5);
  const vgsAt = (t) => (t < 6 ? 0 : t < 13 ? lerp(0, VTH, E.inout((t - 6) / 7)) : t < 18 ? lerp(VTH, 0.6, E.inout((t - 13) / 5)) : t < 22 ? lerp(0.6, 0.7, E.inout((t - 18) / 4)) : 0.7);
  S.anim(0, 1e4, 'tap', (_p, t) => {
    const vgs = vgsAt(t), vov = Math.max(0, vgs - VTH), open = Math.min(64, vov * 300); // 0.2 V of overdrive opens 60 px
    const yB = vgs < VTH ? 474 - (vgs / VTH) * 110 : 364 - open; // gate bottom: climbs out of the slot (entry fee), then opens the pipe
    gate.setAttribute('y', 186); gate.setAttribute('height', yB - 186);
    const rel = vov / 0.2, i = rel * rel; // square law, relative to V_ov = 0.2 V
    flowIn.style.opacity = vov > 0.002 ? 1 : 0;
    flowIn.setAttribute('stroke-width', 3 + 10 * i);
    flowIn.style.strokeDashoffset = -t * (40 + 50 * i);
    vgsT.textContent = ''; richText(vgsT, `V_GS = ${vgs.toFixed(2)} V → V_ov = ${vov.toFixed(2)} V`, 22);
    idT.textContent = ''; richText(idT, `I_D ∝ V_ov^2 = ${(100 * i).toFixed(0)} %`, 20);
  }, E.lin);
  S.say(0.3, 'Before any symbols, one picture. A transistor is a <b>tap</b>: current is water flowing from the source to the drain, and the gate is the handle.');
  S.say(6, 'Turn the gate voltage up from zero. At first nothing flows: the first $V_{th}$, half a volt, only lifts the gate to the edge of the pipe. That is the <b>entry fee</b>.');
  S.say(14, 'Past $V_{th}$, the opening is the <b>overdrive</b> $V_{ov}$. Half the opening gives a quarter of the flow: $I_D \\propto V_{ov}^2$. And $W/L$ is simply how big the pipe is.');
  // ── right: the waterfall. River → ledge → cliff of height V_DS → pool
  const yl = 520, xe = 1120, sc = 260, depth = 52; // depth = 0.2 V × sc = V_ov: the pool reaches the ledge exactly at V_DS = V_ov
  const fall = S.g(); fall.style.opacity = 0; S.fade(fall, 24, 0.7);
  const rf = S.into(fall);
  S.el('rect', { x: 840, y: yl, width: xe - 840, height: 860 - yl, fill: '#1a2433', stroke: '#2c3a4f', 'stroke-width': 2 });
  const river = S.el('rect', { x: 840, y: yl - 20, width: xe - 840, height: 20, fill: WATER, 'fill-opacity': 0.75 });
    const ground = S.el('rect', { x: xe, width: 420, fill: '#1a2433', stroke: '#2c3a4f', 'stroke-width': 2 });
  const pool = S.el('rect', { x: xe + 2, width: 418, fill: WATER, 'fill-opacity': 0.45 });
  const stream = S.el('path', { fill: 'none', stroke: WATER, 'stroke-linecap': 'round', 'stroke-dasharray': '10 9' });
  const hT = txt(S, 1180, 380, '', { size: 21, color: C.text, mono: true, weight: 700 });
  const fT = txt(S, 1180, 414, '', { size: 20, color: WATER, mono: true, weight: 700 });
  const stT = txt(S, 1180, 452, '', { size: 22, weight: 800 });
  txt(S, 850, yl - 34, 'from the tap →', { size: 18, color: C.muted });
  rf();
  const vdsAt = (t) => (t < 32 ? 0.6 : t < 38 ? lerp(0.6, 1.0, E.inout((t - 32) / 6)) : t < 42 ? 1.0 : t < 48 ? lerp(1.0, 0.25, E.inout((t - 42) / 6)) : t < 53 ? lerp(0.25, 0.07, E.inout((t - 48) / 5)) : t < 58 ? 0.07 : lerp(0.07, 0.6, E.inout(clamp((t - 58) / 4, 0, 1))));
  S.anim(0, 1e4, 'fall', (_p, t) => {
    const vds = vdsAt(t), yb = yl + vds * sc, ys = yb - depth;            // pool bottom and surface
    const sat = vds >= 0.2, x = Math.min(vds / 0.2, 1), i = sat ? 1 : 2 * x - x * x; // triode: 2x − x²
    ground.setAttribute('y', yb); ground.setAttribute('height', 860 - yb);
    pool.setAttribute('y', ys); pool.setAttribute('height', depth); // in triode the surface (ys) climbs above the ledge
    river.setAttribute('height', 20); river.setAttribute('fill', sat ? WATER : '#7dd3fc');
    stream.setAttribute('d', `M${xe} ${yl - 10} C ${xe + 40} ${yl - 6}, ${xe + 52} ${Math.min(ys, yl) - 10}, ${xe + 58} ${Math.max(ys, yl - 8)}`);
    stream.setAttribute('stroke-width', 3 + 12 * i); stream.style.strokeDashoffset = -t * (30 + 60 * i);
    hT.textContent = ''; richText(hT, `cliff V_DS = ${vds.toFixed(2)} V`, 21);
    fT.textContent = ''; richText(fT, `flow I_D = ${(100 * i).toFixed(0)} %`, 20);
    stT.textContent = sat ? 'saturation ✓' : 'triode ✗'; stT.setAttribute('fill', sat ? C.ok : C.bad);
  }, E.lin);
  S.say(24, 'Now the drain side. The water leaves the tap over a <b>cliff</b>, and the height of the cliff is $V_{DS}$.');
  S.say(32, 'Make the cliff taller: exactly the same water falls. The flow is decided <b>upstream</b>, by the opening, not by the cliff. That is <b>saturation</b>, and it is why a saturated transistor is a current source.');
  S.say(42, 'Now shrink the cliff. Once it is lower than $V_{ov}$, the pool below rises over the edge, pushes back, and the flow drops. That is <b>triode</b>: no longer a current source.');
  whyBox(S, 120, 620, 640, 190, '**The one rule of this whole lesson:** every transistor needs its cliff at least $V_{ov}$ tall, $|V_{DS}| \\ge |V_{ov}|$. Every CM range and swing is just “which cliff runs out first?”', 54);
  S.say(54, 'So the whole lesson rests on one rule: keep every cliff at least $V_{ov}$ tall. Next, the same picture in symbols.');
});

scene(CF, 'One transistor: entry fee, overdrive, saturation', 66, (S) => {
  header(S, 'FOUNDATIONS · 1', 'A MOSFET needs V_th to turn on, and V_ov to carry current');
  const g = S.g(); const r = S.into(g);
  rail(S, 300, 520, 200);
  isrc(S, 410, 280, { label: 'I_D' }); wire(S, [[410, 200], [410, 238]]);
  wire(S, [[410, 322], [410, 400]]); dot(S, 410, 370); txt(S, 420, 366, 'drain', { size: 18, color: C.muted });
  nmos(S, 410, 450, { name: 'M', gate: 'gate', gl: 60 }); gnd(S, 410, 500); txt(S, 420, 520, 'source', { size: 18, color: C.muted });
  r();
  S.draw(g, 0.3, 1.4);
  S.say(0.3, 'Everything in Lecture 6 is bookkeeping of voltages around transistors, so start with one. An NMOS has a gate, a source and a drain.');
  const tw = tower(S, 640, 720, [{ v: 0.5, name: 'V_th', st: 'diode', note: 'entry fee' }, { v: 0.2, name: 'V_ov', st: 'ok', note: 'overdrive' }], 400, { w: 100, nodes: ['source', '', 'gate'] });
  tw.style.opacity = 0; S.fade(tw, 5, 0.7);
  S.say(5, 'Gate-to-source voltage has two parts. The first $V_{th}$ (0.5 V here) is an <b>entry fee</b>: it only switches the channel on. Only the part above it, the <b>overdrive</b> $V_{ov}$, sets the current.');
  eqAt(S, '|V_{GS}| = |V_{th}| + |V_{ov}|,\\qquad I_D = \\tfrac12\\mu C_{ox}\\tfrac WL V_{ov}^2', 1180, 230, 12, { size: 30, w: 760 });
  S.say(12, 'So $V_{GS} = V_{th} + V_{ov}$ — with our numbers 0.7 V — and the square law ties the current to $V_{ov}$ alone.');
  const sat = whyBox(S, 980, 330, 580, 170, '**Saturated** (an amplifier) needs room across the channel: $V_{DS} \\ge V_{ov}$. Squeeze it below and the device drops into **triode** and stops acting as a current source.', 18);
  S.say(18, 'To amplify, the transistor must be <b>saturated</b>: the drain must keep at least $V_{ov}$ above the source. Less than that, it falls into triode.');
  eqAt(S, '\\text{NMOS: } V_D \\ge V_G - V_{th}', 1180, 540, 26, { size: 28, w: 700, color: '#ffd38a' }); eqAt(S, '\\text{PMOS: } V_D \\le V_G + |V_{th}|', 1180, 600, 26, { size: 28, w: 700, color: '#ffd38a' });
  S.say(26, 'The same rule measured from the gate: an NMOS drain may sit up to $V_{th}$ <b>below</b> its gate; a PMOS (the upside-down twin) drain may sit up to $|V_{th}|$ <b>above</b> its gate. These two lines are the “fences”.');
  whyBox(S, 980, 660, 580, 160, '**PMOS = NMOS upside down:** source at the top, current flows down out of the drain, every inequality flips. Every CM-range and swing answer is one of these fences.', 34);
  S.say(34, 'Every limit in Lecture 6 — every CM range, every swing — is one of these two fences applied to one transistor.');
});

scene(CF, 'Check vs link: the two kinds of step', 62, (S) => {
  header(S, 'FOUNDATIONS · 2', 'Walking along a column: checks can fail, links never do');
  const g = S.g(); const r = S.into(g);
  rail(S, 280, 540, 180);
  pmos(S, 400, 250, { name: 'M', gate: 'gate', gl: 50 }); wire(S, [[400, 180], [400, 200]]);
  wire(S, [[400, 300], [400, 360]]); txt(S, 412, 352, 'drain', { size: 18, color: C.muted });
  r();
  S.draw(g, 0.3, 1);
  const ck = S.g(); S.el('line', { x1: 470, y1: 184, x2: 470, y2: 296, stroke: C.bad, 'stroke-width': 3 }, ck); S.el('line', { x1: 462, y1: 184, x2: 478, y2: 184, stroke: C.bad, 'stroke-width': 3 }, ck); S.el('line', { x1: 462, y1: 296, x2: 478, y2: 296, stroke: C.bad, 'stroke-width': 3 }, ck);
  txt(S, 486, 236, 'CHECK', { size: 20, color: C.bad, weight: 800 }, ck); txt(S, 486, 260, 'source → drain ≥ |V_ov|', { size: 17, color: C.bad }, ck);
  ck.style.opacity = 0; S.fade(ck, 4, 0.5);
  const lk = S.g(); wire(S, [[400, 186], [330, 186], [330, 244]], { color: C.volt, w: 2.6, dash: '6 5' }, lk); arrow(S, 330, 230, 330, 248, { color: C.volt, w: 2.6, head: 10 }, lk);
  txt(S, 100, 290, 'LINK', { size: 20, color: C.volt, weight: 800 }, lk); txt(S, 100, 314, 'source → gate = |V_GS|', { size: 17, color: C.volt }, lk);
  lk.style.opacity = 0; S.fade(lk, 11, 0.5);
  S.say(0.3, 'Your second chat cleared this up for good. When you walk along a column of transistors you take two kinds of step.');
  S.say(4, 'A <b>check</b> goes through a channel, source to drain. It must be at least $|V_{ov}|$ (0.2 V). Checks are what <b>fail</b> — that is where limits come from.');
  S.say(11, 'A <b>link</b> goes from a source to its own gate. It is always exactly $|V_{GS}|$ (0.7 V). A link never fails; it just tells you where a gate sits once you know its source.');
  const ex = [
    ['\\text{Floor of an NMOS pair: } V_{in,min} = \\underbrace{V_{ISS}}_{\\text{tail check}} + \\underbrace{V_{GS1}}_{\\text{link}}', 18, 'Example: how low can an NMOS pair’s input go? Walk up from ground: the tail needs its check ($V_{ISS}$), then a link up to the gate ($V_{GS1}$).'],
    ['\\text{Fence = check + link: } V_D - V_S \\ge V_{ov},\\; V_G - V_S = V_{GS}\\;\\Rightarrow\\; V_D \\ge V_G - V_{th}', 28, 'And the fences of the last scene are just a check and a link combined: subtract them and the source drops out.'],
  ];
  ex.forEach(([tex, t, say], i) => { eqAt(S, tex, 1050, 440 + i * 120, t, { size: 26, w: 1000, h: 110 }); S.say(t, say); });
  whyBox(S, 60, 690, 1480, 140, '**The method for every limit:** ① push the input/output towards a rail; ② find the channel that gets squeezed — its **check** gives a limit on some node; ③ use **links** to turn that node into the gate you were asked about.', 38);
  S.say(38, 'The three-step method you will use in every scene and question: push towards a rail, find the squeezed channel (check), convert with links.');
});

scene(CF, 'How to read a tower', 64, (S) => {
  header(S, 'FOUNDATIONS · 3', 'One block per transistor; height = the voltage across it');
  const g = S.g(); const r = S.into(g);
  rail(S, 250, 460, 170);
  pmos(S, 350, 230, { name: 'load', gate: 'V_b', gl: 30 }); wire(S, [[350, 170], [350, 180]]);
  wire(S, [[350, 280], [350, 330]]); dot(S, 350, 305); wire(S, [[350, 305], [440, 305]]); txt(S, 448, 312, 'V_out', { size: 21, color: C.volt, weight: 700 });
  nmos(S, 350, 380, { name: 'casc', gate: 'V_b2', gl: 30 }); wire(S, [[350, 430], [350, 440]]);
  nmos(S, 350, 490, { name: 'input', gate: 'V_in', gl: 30 }); gnd(S, 350, 540);
  r();
  S.draw(g, 0.3, 1.4);
  S.say(0.3, 'A cascode amplifier: a load on top, a cascode device, an input device — three transistors stacked between 1.8 V and ground. Where can $V_{out}$ go?');
  const yb = 780, sc = 300, x0 = 760;
  const rects = {}; const mk = (n) => { const rr = S.el('rect', { x: x0, width: 110, rx: 4, 'stroke-width': 2 }); const t = txt(S, x0 + 55, 0, n, { size: 19, color: '#fff', weight: 750, anchor: 'middle' }); rects[n] = { rr, t }; };
  ['input', 'casc', 'load'].forEach(mk);
  const vl = S.el('line', { x1: x0 - 14, x2: x0 + 124, stroke: C.volt, 'stroke-width': 3, 'stroke-dasharray': '6 5' });
  const vt = txt(S, x0 + 140, 0, '', { size: 20, color: C.volt, weight: 700 });
  const vAt = (t) => (t < 14 ? 1.0 : t < 22 ? lerp(1.0, 1.6, E.inout((t - 14) / 8)) : t < 32 ? lerp(1.6, 0.4, E.inout((t - 22) / 10)) : lerp(0.4, 1.0, E.inout(clamp((t - 34) / 4, 0, 1))));
  S.anim(0, 1e4, 'tw', (_p, t) => {
    const v = vAt(t);
    [['input', 0, 0.2], ['casc', 0.2, v], ['load', v, 1.8]].forEach(([n, a, b]) => {
      const y1 = yb - b * sc, y2 = yb - a * sc; const sq = b - a <= 0.2001 && n !== 'input';
      const st = sq ? 'sq' : b - a > 0.21 ? 'ok' : 'min';
      rects[n].rr.setAttribute('y', y1); rects[n].rr.setAttribute('height', y2 - y1); rects[n].rr.setAttribute('fill', TST[st][0]); rects[n].rr.setAttribute('stroke', TST[st][1]);
      rects[n].t.setAttribute('y', (y1 + y2) / 2 + 7); rects[n].t.setAttribute('fill', TST[st][1]);
    });
    vl.setAttribute('y1', yb - v * sc); vl.setAttribute('y2', yb - v * sc); vt.setAttribute('y', yb - v * sc + 7); vt.textContent = ''; richText(vt, `V_out = ${v.toFixed(2)} V`, 20);
  }, E.lin);
  S.say(6, 'Draw the column as a <b>tower</b>: one block per transistor, its height = the voltage across it. The blocks always add up to 1.8 V. The input block is held at its 0.2 V (its check) by the bias.');
  S.say(14, 'Push $V_{out}$ up: the boundary slides, the load’s block shrinks… until it is squeezed to its 0.2 V minimum — <b>red</b>. That is the ceiling: 1.6 V.');
  S.say(22, 'Pull $V_{out}$ down: now the cascode’s block shrinks to 0.2 V at 0.4 V. That is the floor.');
  whyBox(S, 1000, 170, 560, 300, '**Reading rules:** one block = one transistor · height = top node − bottom node · blocks add to $V_{DD}$ · no block shorter than its $V_{ov}$ · moving a node grows one block and shrinks its neighbour · **red = squeezed = the limit**.', 34);
  S.say(34, 'Rules to keep. Every CM range and swing in this lesson is “which block gets squeezed first?”.');
});

scene(CF, 'Look-in resistances and gain by two looks', 70, (S) => {
  header(S, 'FOUNDATIONS · 4', 'Up multiplies, down divides — and A_v = G_m(R_up ∥ R_down)');
  const cases = [
    ['into a drain', 'r_O', 120],
    ['into a drain, R_S under it', '\\approx g_mr_O\\,R_S\\;\\;\\text{(up multiplies)}', 440],
    ['into a source', '\\frac{R_D + r_O}{1 + g_mr_O} \\approx \\frac{1}{g_m}\\;\\;\\text{(down divides)}', 820],
    ['into a gate', '\\infty', 1260],
  ];
  cases.forEach(([lab, tex, x], i) => {
    const g = S.g(); const r = S.into(g);
    const cx = x + 100;
    nmos(S, cx, 300, { gl: 30 });
    if (i === 0) { wire(S, [[cx, 250], [cx, 200]]); gnd(S, cx, 350); arrow(S, cx + 40, 205, cx + 40, 250, { color: C.n, w: 2.4, head: 10 }); }
    if (i === 1) { wire(S, [[cx, 250], [cx, 200]]); res(S, cx, 350, 430, { label: 'R_S' }); gnd(S, cx, 430); arrow(S, cx + 40, 205, cx + 40, 250, { color: C.n, w: 2.4, head: 10 }); }
    if (i === 2) { res(S, cx, 170, 250, { label: 'R_D' }); wire(S, [[cx, 350], [cx, 400]]); arrow(S, cx + 40, 405, cx + 40, 360, { color: C.p, w: 2.4, head: 10 }); }
    if (i === 3) { wire(S, [[cx, 250], [cx, 200]]); gnd(S, cx, 350); arrow(S, cx - 120, 300, cx - 72, 300, { color: C.amb, w: 2.4, head: 10 }); }
    txt(S, cx, 160, lab, { size: 18, color: C.muted, anchor: 'middle' });
    r();
    g.style.opacity = 0; S.fade(g, 1 + i * 5, 0.6);
    eqAt(S, tex, cx + 40, 500, 2 + i * 5, { size: 24, w: 380, color: '#ffd38a' });
  });
  S.say(1, 'The four look-in rules. Looking into a <b>drain</b> with the source grounded you see $r_O$ — big (tens of kΩ).');
  S.say(6, 'Put a resistance $R_S$ under the source and the drain looks $g_mr_O$ times bigger: the transistor fights any change. <b>Up multiplies.</b> This is why a cascode works.');
  S.say(11, 'Looking <b>into a source</b> you see only about $1/g_m$ — small (around a kΩ). <b>Down divides.</b> Current pushed into a source flows in easily.');
  S.say(16, 'Into a gate: no current at all — infinite.');
  eqAt(S, 'A_v = G_m\\,(R_{up}\\parallel R_{down}),\\qquad G_m \\approx g_m \\text{ of the input device}', 800, 640, 22, { size: 32, w: 1300 });
  S.say(22, 'Any gain is a current times a resistance: the input device makes $G_mv_{in}$, and at the output it meets the resistance looking <b>up</b> in parallel with the one looking <b>down</b>. Two roughly equal resistances in parallel halve.');
  whyBox(S, 260, 720, 1080, 120, '**Current divider:** a current reaching a node splits inversely to resistance: $I_{R_2} = I\\frac{R_1}{R_1+R_2}$. Faced with $1/g_m$ and $r_O$, nearly all of it takes the $1/g_m$ path.', 32);
  S.say(32, 'And the current divider: offered a source (about $1/g_m$) and an $r_O$, nearly all the current goes into the source. Folding relies on this.');
});

scene(CF, 'The differential pair and V_CM', 60, (S) => {
  header(S, 'FOUNDATIONS · 5', 'Two inputs = a shared level (V_CM) + a difference (v_d)');
  const g = S.g(); const r = S.into(g);
  rail(S, 240, 600, 170);
  isrc(S, 320, 240, { label: 'load', left: true }); isrc(S, 520, 240, { label: 'load' });
  wire(S, [[320, 170], [320, 198]]); wire(S, [[520, 170], [520, 198]]);
  wire(S, [[320, 282], [320, 330]]); wire(S, [[520, 282], [520, 330]]);
  nmos(S, 320, 380, { name: 'M1', gate: 'V_in1' }); nmos(S, 520, 380, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[320, 430], [320, 450], [520, 450], [520, 430]]); dot(S, 420, 450); txt(S, 430, 444, 'P', { size: 18, color: C.bad, weight: 750 });
  isrc(S, 420, 495, { label: 'I_SS (tail)', len: 45 }); gnd(S, 420, 540);
  r();
  S.draw(g, 0.3, 1.4);
  S.say(0.3, 'Op amps start with a <b>differential pair</b>: two matched devices sharing a tail current $I_{SS}$.');
  eqAt(S, 'V_{CM} = \\frac{V_{in1} + V_{in2}}{2},\\qquad v_d = V_{in1} - V_{in2}', 1150, 220, 5, { size: 32, w: 760 });
  S.say(5, 'Any two inputs can be described as their <b>average</b>, the common mode $V_{CM}$, plus their <b>difference</b> $v_d$. CM always means “the average of a pair”.');
  const ws = S.g(); const x0 = 860, x1 = 1500, yc = 450;
  S.el('line', { x1: x0, y1: yc, x2: x1, y2: yc, stroke: C.amb, 'stroke-width': 2.4, 'stroke-dasharray': '8 6' }, ws);
  sine(S, x0, x1, yc, 70, { color: C.n, cycles: 2 }, ws); sine(S, x0, x1, yc, -70, { color: C.p, cycles: 2 }, ws);
  txt(S, x1, yc - 12, 'V_CM', { size: 19, color: C.amb, anchor: 'end', weight: 700 }, ws);
  ws.style.opacity = 0; S.fade(ws, 11, 0.7);
  S.say(11, 'The difference is the signal: it <b>steers</b> current from one side to the other. The tail fixes the total, so the shared level $V_{CM}$ changes neither current.');
  whyBox(S, 860, 580, 700, 220, '**The input CM range** asks: how low and how high can the shared input level sit while every transistor stays saturated? Floor and ceiling are each one squeezed block. This is the first half of your Lec 6 page.', 20);
  S.say(20, 'So the question “input CM range” means: how far down and up can that shared level go with every device saturated? That is the first thing your Lecture 6 page computes, for folded cascodes.');
});

scene(CF, 'The cascode: pump, shield, and the headroom it costs', 70, (S) => {
  header(S, 'FOUNDATIONS · 6', 'Stacking a device on the input: huge gain, but one more block');
  const g = S.g(); const r = S.into(g);
  rail(S, 250, 460, 170);
  isrc(S, 350, 230, { label: 'load' }); wire(S, [[350, 170], [350, 188]]);
  wire(S, [[350, 272], [350, 330]]); dot(S, 350, 300); wire(S, [[350, 300], [440, 300]]); txt(S, 448, 307, 'V_out', { size: 21, color: C.volt, weight: 700 });
  nmos(S, 350, 380, { name: 'M2', gate: 'V_b', gl: 30 }); dot(S, 350, 440); txt(S, 362, 452, 'X', { size: 19, color: C.bad, weight: 750 });
  wire(S, [[350, 430], [350, 450]]); nmos(S, 350, 500, { name: 'M1', gate: 'V_in', gl: 30 }); gnd(S, 350, 550);
  r();
  S.draw(g, 0.3, 1.4);
  S.halo(260, 455, 180, 100, C.n, 4, null); S.halo(260, 335, 180, 95, C.p, 8, null);
  const hl1 = txt(S, 248, 470, 'PUMP', { size: 20, color: C.n, weight: 800, anchor: 'end' }), hl2 = txt(S, 248, 352, 'SHIELD', { size: 20, color: C.p, weight: 800, anchor: 'end' }), hl3 = txt(S, 248, 374, '(bodyguard)', { size: 16, color: C.p, weight: 700, anchor: 'end' });
  [hl1, hl2, hl3].forEach((e, i) => { e.style.opacity = 0; S.fade(e, i ? 8 : 4, 0.5); });
  S.say(4, 'A cascode is two devices in one column. <b>M1 is the pump</b>: its gate takes $V_{in}$ and it turns it into a current $g_{m1}v_{in}$.');
  S.say(8, '<b>M2 is the shield</b>, M1’s bodyguard: its gate is held at a fixed $V_b$, so its source X barely moves. M1 is protected from the output swinging, and looking down from $V_{out}$ you see $r_{O1}$ multiplied by $g_{m2}r_{O2}$.');
  eqAt(S, 'G_m \\approx g_{m1},\\quad R_{down} = g_{m2}r_{O2}r_{O1},\\quad A_v \\approx (g_mr_O)^2', 1150, 230, 14, { size: 30, w: 780 });
  S.say(14, 'Down divides at X, so all of M1’s current goes up through M2: $G_m ≈ g_{m1}$. Up multiplies: $R_{down} = g_{m2}r_{O2}r_{O1}$. The gain becomes about $(g_mr_O)^2$ — 2500 instead of 50.');
  const tw = tower(S, 1000, 760, [{ v: 0.2, name: 'M1' }, { v: 0.2, name: 'M2', st: 'sq' }, { v: 1.2, name: 'room', st: 'room' }, { v: 0.2, name: 'load' }], 200, { w: 90, nodes: ['0', '0.2', '0.4', '1.6', '1.8'] });
  tw.style.opacity = 0; S.fade(tw, 22, 0.7);
  S.say(22, 'The price, as a tower: one more block in the output column, so the output can go only down to 0.4 V instead of 0.2 V.');
  whyBox(S, 1150, 330, 410, 330, '**Telescopic op amp** = a cascoded pair with cascoded loads: 5 blocks per column (tail, input, NMOS cascode, PMOS cascode, PMOS source). With 1.8 V only 0.8 V is left for the output — and the **input** sits in the same column, fighting the output for room.', 28);
  S.say(28, 'Do it to a whole differential pair and you get the <b>telescopic</b> op amp: five blocks per column. The output gets only what is left, and the input pair sits in the same column — input and output fight over the same headroom.');
  S.say(40, 'Lecture 5’s answer to that fight is <b>folding</b>: move the input device out of the output column. Next scene, watched step by step.');
});

scene(CF, 'The fold: watch the input device move', 84, (S) => {
  header(S, 'FOUNDATIONS · 7', 'Flip the input device and feed the cascode from the side');
  rail(S, 300, 1000, 170);
  // fixed: load, M2
  isrc(S, 560, 230, { label: 'load I_1' }); wire(S, [[560, 170], [560, 188]]);
  wire(S, [[560, 272], [560, 330]]); dot(S, 560, 300); wire(S, [[560, 300], [660, 300]]); txt(S, 668, 307, 'V_out', { size: 21, color: C.volt, weight: 700 });
  nmos(S, 560, 380, { name: 'M2 (cascode)', gate: 'V_b', gl: 30 }); wire(S, [[560, 430], [560, 450]]); dot(S, 560, 450);
  txt(S, 572, 470, 'X', { size: 21, color: C.bad, weight: 800 });
  // original M1 (fades and slides)
  const old = S.g(); const r1 = S.into(old);
  nmos(S, 560, 500, { name: 'M1', gate: 'V_in', gl: 30 }); gnd(S, 560, 550);
  r1();
  S.say(0.3, 'Start with the plain cascode: input M1 under cascode M2, X between them.');
  S.halo(470, 455, 190, 120, C.amb, 5, 14);
  S.say(5, '<span class="why">The key observation:</span> M2 only needs a current pushed into its source at X. It does not care whether that current comes from below or from the side.');
  S.anim(14, 4, 'mv', (p) => { old.setAttribute('transform', `translate(${260 * p} ${-80 * p}) rotate(${180 * p} 560 500)`); old.style.opacity = 1 - p; }, E.inout);
  const neu = S.g(); const r2 = S.into(neu);
  pmos(S, 820, 330, { name: 'M1 (now PMOS)', gate: 'V_in', gl: 30 }); wire(S, [[820, 170], [820, 280]]);
  wire(S, [[820, 380], [820, 450], [560, 450]]);
  r2();
  neu.style.opacity = 0; S.fade(neu, 17.5, 0.8);
  S.say(14, 'So move M1 out of the column and turn it upside down: it becomes a <b>PMOS</b>, source on $V_{DD}$, gate on $V_{in}$, and its drain plugs into X <b>from the side</b>.');
  S.say(21, '<span class="why">Why does it have to flip type?</span> X now sits below the PMOS’s source at $V_{DD}$: current must flow down out of its drain into X — a PMOS does exactly that.');
  const ib = S.g(); const r3 = S.into(ib); isrc(S, 560, 500, { label: 'I_B (new)' }); gnd(S, 560, 542); r3();
  ib.style.opacity = 0; S.fade(ib, 28, 0.7);
  S.say(28, 'But now nothing below X carries current to ground. Add a current source $I_B$ from X to ground: it must carry M1’s current <b>and</b> M2’s current.');
  S.flow([[820, 180], [820, 450], [560, 450]], 34, null, { speed: 70, color: C.p });
  S.flow([[560, 180], [560, 450]], 34, null, { speed: 70 });
  S.flow([[560, 460], [560, 540]], 34, null, { speed: 90, w: 5 });
  eqAt(S, 'I_{D2} = I_B - I_{D1}\\quad\\text{(KCL at X)}', 1270, 260, 34, { size: 30, w: 560, color: '#ffd38a' });
  S.say(34, 'The currents now <b>turn</b> at X — they fold: $I_B$ is shared, so M2 carries $I_B - I_{D1}$. That is the meaning of “fold”.');
  whyBox(S, 1000, 330, 560, 230, '**Signal check:** $V_{in}$↑ → PMOS M1 pushes **less** into X → M2 carries **more** ($I_B - I_{D1}$) → $V_{out}$↓. Still inverting, still $g_{m1}v_{in}$ reaching the output: **same $G_m$**.', 42);
  S.say(42, 'Follow a signal: raise $V_{in}$, the PMOS pushes less current into X, so M2 must carry more, so $V_{out}$ falls. Same gain mechanism as before — the input device simply left the output column.');
  whyBox(S, 1000, 580, 560, 230, '**What it buys:** X is set only by $V_b$; the input level is free from the output column. **What it costs:** an extra current branch (power), a little gain ($r_O$ of $I_B$ in parallel at X), an extra pole at X.', 52);
  S.say(52, 'Gains and costs in one line: the input level and the output stop fighting; you pay with power, a bit of gain and an extra pole.');
});

scene(CF, 'The folded-cascode op amp: gain by two looks', 74, (S) => {
  header(S, 'FOUNDATIONS · 8', 'Fold a whole differential pair: the op amp of Lec 5 and 6');
  const g = foldP(S); g.setAttribute('transform', 'translate(-100 30)');
  S.draw(g, 0.3, 2.6);
  S.say(0.3, 'Fold a whole PMOS pair (M1, M2, tail M11) into two cascode columns, with your page’s names: top PMOS sources M7, M8; PMOS cascodes M5, M6; outputs; NMOS cascodes M3, M4; fold nodes X, Y; bottom sources M9, M10.');
  S.say(9, 'Each column from $V_{DD}$ to ground: source, cascode, output, cascode, source — four blocks. The input pair is <b>not</b> in it.');
  const up = arrow(S, 560, 410, 560, 290, { color: C.p }); S.fade(up, 16, 0.4);
  const dn = arrow(S, 560, 420, 560, 590, { color: C.n }); S.fade(dn, 20, 0.4);
  eqAt(S, 'R_{up} = g_{m5}r_{O5}r_{O7}', 1210, 230, 16, { size: 30, w: 600, color: C.p });
  S.say(16, 'Look <b>up</b> from $V_{out1}$: the PMOS cascode M5 on M7 — an ordinary cascode, $g_{m5}r_{O5}r_{O7}$.');
  eqAt(S, 'R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O9})', 1210, 310, 20, { size: 30, w: 600, color: C.n });
  S.say(20, 'Look <b>down</b>: the NMOS cascode M3 — but under its source (X) hang <b>two</b> things, the bottom source’s $r_{O9}$ and the input device’s $r_{O1}$. In parallel, about $r_O/2$. That is the only new piece.');
  eqAt(S, 'G_m \\approx g_{m1}\\;\\Rightarrow\\; A_v = g_{m1}(R_{up}\\parallel R_{down})', 1210, 400, 28, { size: 30, w: 640, color: '#ffd38a' });
  S.say(28, 'M1’s signal current reaches X and has two exits: up into M3’s source (≈ $1/g_{m3}$, easy) or down into $r_{O1}\\parallel r_{O9}$ (hard). Nearly all goes up, so $G_m ≈ g_{m1}$ and the gain is $g_{m1}(R_{up}\\parallel R_{down})$ — a little below a telescopic.');
  whyBox(S, 900, 470, 660, 200, '**KCL at each fold node:** the bottom source carries the cascode branch **plus** the input device: $I_{bottom} = I_{casc} + I_{SS}/2$. Keep the folding current ≥ $I_{SS}$ so a cascode never starves.', 38);
  S.say(38, 'Current bookkeeping you need for the design questions: each bottom source carries its cascode branch plus half the tail.');
  S.say(48, 'You now have every tool. Next: your Lecture 6 page.');
});

scene(CF, 'Foundations in one card', 28, (S) => {
  header(S, 'FOUNDATIONS · REMEMBER', 'The tools for Lecture 6');
  remember(S, [
    '$|V_{GS}| = |V_{th}| + |V_{ov}|$; saturated needs $|V_{DS}| \\ge |V_{ov}|$. Fences: NMOS $V_D \\ge V_G - V_{th}$, PMOS $V_D \\le V_G + |V_{th}|$.',
    '**Check** (source→drain ≥ $V_{ov}$, can fail) vs **link** (source→gate = $V_{GS}$). Limit = squeezed check, then links to the gate.',
    'Tower: block per device, height = voltage across it, red = squeezed = the limit.',
    'Up multiplies ($g_mr_OR_S$), down divides ($1/g_m$); $A_v = G_m(R_{up}\\parallel R_{down})$.',
    'Cascode: pump + shield, $(g_mr_O)^2$, one more block. Telescopic: input and output fight for room.',
    'Fold: input flips type, feeds X from the side; $I_{D,casc} = I_B - I_{D,in}$; $R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O9})$; $G_m ≈ g_{m1}$.',
  ], 0.4, 'Foundations · remember');
  S.say(0.4, 'Read it once. Now your Lecture 6 page.');
});
