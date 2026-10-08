/* Lesson F: Lecture 20 — static characteristics of an inverter: the VTC, its five voltages, why slope −1 marks the
   valid-logic edges (noise gain), noise margins, static power and area. Numbers: the lecture example P21 (f_num.js). */
'use strict';
const L20 = 'Lec 20 · Inverter static characteristics';
const P21 = { vdd: 5, kn: 100e-6, vt0: 1, rl: 50e3 }; // example used through Lec 20–22 (knRL = 5)
const R21 = FN.rInv(P21);

/* inverter symbol: triangle + bubble, input on the left at (x, y) */
function invSym(S, x, y, sc = 1, o = {}) {
  const g = S.g(); const r = S.into(g);
  const w = 90 * sc, h = 80 * sc;
  S.el('polygon', { points: `${x},${y - h / 2} ${x + w},${y} ${x},${y + h / 2}`, fill: 'rgba(96,165,250,0.08)', stroke: o.col || C.volt, 'stroke-width': 3, 'stroke-linejoin': 'round' });
  S.el('circle', { cx: x + w + 9 * sc, cy: y, r: 9 * sc, fill: C.bg, stroke: o.col || C.volt, 'stroke-width': 3 });
  r(); return Object.assign(g, { inP: [x, y], out: [x + w + 18 * sc, y] });
}
/* a VTC frame: Vin → x, Vout → y, both 0..vdd; returns mappers */
function vtcFrame(S, x0, y0, w, h, vdd, o = {}) {
  const g = S.g();
  S.el('rect', { x: x0, y: y0, width: w, height: h, rx: 8, fill: '#0e141e', stroke: '#222c3b' }, g);
  txt(S, x0 + 8, y0 - 12, o.title || 'V_out against V_in', { size: 18, color: C.muted }, g);
  txt(S, x0 + w, y0 + h + 52, 'V_in', { size: 19, color: C.volt, anchor: 'end', weight: 700 }, g);
  for (let v = 0; v <= vdd + 1e-9; v += o.step || 1) {
    const X = x0 + (v / vdd) * w, Y = y0 + h - (v / vdd) * h;
    S.el('line', { x1: X, y1: y0, x2: X, y2: y0 + h, stroke: '#1a2230', 'stroke-width': 1.2 }, g); txt(S, X, y0 + h + 24, `${fx(v, 2)}`, { size: 15, color: C.muted, anchor: 'middle' }, g);
    S.el('line', { x1: x0, y1: Y, x2: x0 + w, y2: Y, stroke: '#1a2230', 'stroke-width': 1.2 }, g); txt(S, x0 - 8, Y + 5, `${fx(v, 2)}`, { size: 15, color: C.muted, anchor: 'end' }, g);
  }
  return { g, X: (v) => x0 + (v / vdd) * w, Y: (v) => y0 + h - (v / vdd) * h, x0, y0, w, h };
}
/* the resistive-load inverter: R_L from V_DD to the output, NMOS driver M1 */
function rInvFig(S, x, y, o = {}) {
  const g = S.g(); const r = S.into(g);
  rail(S, x - 60, x + 60, y, 'V_DD');
  res(S, x, y, y + 130, { label: o.rl || 'R_L' }); dot(S, x, y + 160); wire(S, [[x, y + 130], [x, y + 190]]);
  wire(S, [[x, y + 160], [x + 110, y + 160]]); txt(S, x + 118, y + 167, 'V_out', { size: 21, color: C.cur, weight: 700 });
  nmos(S, x, y + 240, { name: 'M1', gate: 'V_in', gl: 40 }); gnd(S, x, y + 290);
  r(); return g;
}

scene(L20, 'An inverter: 0 in, 1 out', 52, (S) => {
  header(S, 'LEC 20 · YOUR PAGE', 'The simplest logic gate, and the curve that describes it');
  pagePeek(S, 'n20', 1060, 130, 460, 429, 0.4, 12);
  const iv = invSym(S, 200, 300, 1.3); iv.style.opacity = 0; S.fade(iv, 0.4, 0.6);
  wire(S, [[120, 300], [200, 300]]); txt(S, 110, 307, 'A', { size: 24, color: C.volt, anchor: 'end', weight: 700 });
  wire(S, [[iv.out[0], 300], [iv.out[0] + 70, 300]]); txt(S, iv.out[0] + 80, 307, 'Y', { size: 24, color: C.cur, weight: 700 });
  html(S, 200, 400, 260, 140, '<div class="whybox"><b>A → Y</b><br>0 → 1<br>1 → 0</div>');
  S.say(0.4, 'Lecture 20 starts the digital half with the inverter: a 0 at the input gives a 1 at the output, and a 1 gives a 0.');
  const F = vtcFrame(S, 620, 220, 360, 360, 5, { title: 'ideal: a cliff at V_DD/2' }); F.g.style.opacity = 0; S.fade(F.g, 12, 0.6);
  const ideal = S.el('polyline', { points: `${F.X(0)},${F.Y(5)} ${F.X(2.5)},${F.Y(5)} ${F.X(2.5)},${F.Y(0)} ${F.X(5)},${F.Y(0)}`, fill: 'none', stroke: C.volt, 'stroke-width': 4 });
  ideal.style.opacity = 0; S.fade(ideal, 13, 0.6);
  S.say(12, 'Its static behaviour is one curve: the output voltage against the input voltage, the VTC. The ideal inverter would be a cliff: output at $V_{DD}$ until the input reaches $V_{DD}/2$, then instantly zero.');
  whyBox(S, 1040, 620, 500, 150, '**Why a cliff would be ideal:** any input below $V_{DD}/2$ counts as 0 and any above counts as 1, with no in-between. Real inverters only approach it.', 22);
  S.say(22, 'With a cliff, any input on the low side is a clean 0 and any input on the high side a clean 1. A real inverter has a slope, and the next scenes measure how good that slope is.');
  S.stop(32, {
    src: 'Exam-style check',
    q: 'An ideal inverter on V_DD = 5 V receives 1.9 V. What does it output?',
    choices: ['5 V (1.9 V is below V_DD/2, so it is a logic 0 in)', '0 V', '2.5 V', '3.1 V'], answer: 0,
    hint: ['The ideal VTC switches at exactly $V_{DD}/2$.', '1.9 V < 2.5 V: logic 0 at the input.'],
    how: ['$V_{DD}/2 = 2.5$ V. The input 1.9 V is below it, so it is read as a 0.', 'An inverter turns a 0 into a 1: the output is $V_{DD} = 5$ V.'],
  });
});

scene(L20, 'Inside every inverter: a load and a switch', 54, (S) => {
  header(S, 'LEC 20 · THE CIRCUIT', 'An NMOS switch pulls the output down; a load pulls it up');
  const g = S.g(); const r = S.into(g);
  rail(S, 240, 420, 180, 'V_DD'); S.el('rect', { x: 290, y: 220, width: 80, height: 90, rx: 8, fill: 'rgba(251,191,36,0.08)', stroke: C.amb, 'stroke-width': 3 }); txt(S, 330, 272, 'load', { size: 22, color: C.amb, anchor: 'middle', weight: 700 });
  wire(S, [[330, 180], [330, 220]]); wire(S, [[330, 310], [330, 380]]); dot(S, 330, 350); wire(S, [[330, 350], [450, 350]]); txt(S, 460, 358, 'V_out', { size: 21, color: C.cur, weight: 700 });
  nmos(S, 330, 430, { name: 'M1', gate: 'V_in', gl: 40 }); gnd(S, 330, 480);
  r(); g.style.opacity = 0; S.fade(g, 0.3, 0.6);
  S.say(0.3, 'Your page draws every inverter the same way: a load from $V_{DD}$ to the output, and an NMOS switch from the output to ground, driven by the input.');
  current(S, [[330, 190], [330, 470]], 8, 24, 'I flows', { color: C.cur, at: [430, 420] });
  label(S, 560, 300, 'V_in high → M1 on → current through the load → V_out pulled LOW', 8, { size: 21, color: C.cur, weight: 700, out: 24 });
  S.say(8, 'Input high: M1 turns on, current flows through the load, and the drop across the load pulls the output down: a 0.');
  label(S, 560, 360, 'V_in low → M1 off → no current → no drop → V_out = V_DD', 24, { size: 21, color: C.ok, weight: 700 });
  S.say(24, 'Input low: M1 is off, no current flows, so there is no drop across the load and the output sits at $V_{DD}$: a 1.');
  whyBox(S, 560, 440, 900, 140, '**Lec 21–22:** the load is a resistor (resistive-load inverter); then both devices become transistors that take turns: the CMOS inverter, with no current in either steady state.', 34);
  S.stop(44, {
    src: 'Exam-style check',
    q: 'In this circuit, when does current flow from V_DD to ground in steady state?',
    choices: ['Only when the input is high (M1 on, output low)', 'Only when the input is low', 'Always', 'Never'], answer: 0,
    hint: ['Current needs a closed path from $V_{DD}$ through the load and M1 to ground.', 'Which input turns M1 on?'],
    how: ['The only path to ground is through M1. M1 conducts only with its gate high.', 'So current (and static power) flows only while the input is high and the output is low.'],
  });
});

scene(L20, 'The real VTC and its five voltages', 88, (S) => {
  header(S, 'LEC 20 · FIVE VOLTAGES', 'V_OH, V_OL, V_IL, V_IH, V_th: every static question is about these');
  const F = vtcFrame(S, 160, 170, 560, 560, 5); F.g.style.opacity = 0; S.fade(F.g, 0.3, 0.6);
  const vtc = (v) => FN.rInvVout(P21, v);
  tracePlot(S, vtc, (u) => F.X(u), (v) => F.Y(v), 1, 9, C.volt, 5);
  S.say(0.3, 'Here is a real VTC, from the resistive-load inverter of Lecture 21 with $V_{DD} = 5$ V. It starts high, falls steeply in the middle, and ends low but not at zero.');
  const mk = (t0, x1, y1, x2, y2, col, s, lx, ly, anchor = 'start') => { const ln = S.el('line', { x1, y1, x2, y2, stroke: col, 'stroke-width': 2.2, 'stroke-dasharray': '7 6' }); ln.style.opacity = 0; S.fade(ln, t0, 0.5); label(S, lx, ly, s, t0, { size: 19, color: col, weight: 700, anchor }); };
  mk(12, F.X(0), F.Y(R21.voh), F.X(5), F.Y(R21.voh), C.ok, 'V_OH', F.X(5) + 10, F.Y(R21.voh) + 6);
  S.say(12, '$V_{OH}$: the highest output, when the input is a solid 0.');
  mk(18, F.X(0), F.Y(R21.vol), F.X(5), F.Y(R21.vol), C.bad, 'V_OL', F.X(5) + 10, F.Y(R21.vol) + 6);
  S.say(18, '$V_{OL}$: the output when the input is $V_{OH}$ — what the previous gate really delivers as a 1.');
  const diag = S.el('line', { x1: F.X(0), y1: F.Y(0), x2: F.X(5), y2: F.Y(5), stroke: C.muted, 'stroke-width': 1.6, 'stroke-dasharray': '4 6' }); diag.style.opacity = 0; S.fade(diag, 26, 0.5);
  const dth = dot(S, F.X(R21.vth), F.Y(R21.vth), { color: C.amb, r: 7 }); dth.style.opacity = 0; S.fade(dth, 26.5, 0.4);
  label(S, F.X(R21.vth) + 14, F.Y(R21.vth) - 10, 'V_th: V_out = V_in', 26.5, { size: 19, color: C.amb, weight: 700 });
  S.say(26, '$V_{th}$, the switching threshold: where the curve crosses the line $V_{out} = V_{in}$.');
  const tang = (v, t0) => { const vo = vtc(v), L = 0.55; const ln = S.el('line', { x1: F.X(v - L), y1: F.Y(vo + L), x2: F.X(v + L), y2: F.Y(vo - L), stroke: C.p, 'stroke-width': 3 }); ln.style.opacity = 0; S.fade(ln, t0, 0.5); const d = dot(S, F.X(v), F.Y(vo), { color: C.p, r: 7 }); d.style.opacity = 0; S.fade(d, t0, 0.4); };
  tang(R21.vil, 34); tang(R21.vih, 40);
  label(S, F.X(R21.vil) - 12, F.Y(vtc(R21.vil)) + 40, 'V_IL', 34, { size: 20, color: C.p, weight: 700, anchor: 'end' });
  label(S, F.X(R21.vih) + 16, F.Y(vtc(R21.vih)) + 30, 'V_IH', 40, { size: 20, color: C.p, weight: 700 });
  S.say(34, '$V_{IL}$ and $V_{IH}$ are where the slope is exactly −1: the green tangent lines. Below $V_{IL}$ the input is a reliable 0; above $V_{IH}$ a reliable 1. In between, the gate cannot be trusted.');
  const defs = html(S, 820, 200, 720, 420, `<div class="whybox"><b>Your page’s definitions</b><br>${rt('$V_{OH}$: maximum output · $V_{OL}$: output when the input is $V_{OH}$ · $V_{IL}$: **lowest** input where $dV_{out}/dV_{in} = -1$ · $V_{IH}$: **highest** input where $dV_{out}/dV_{in} = -1$ · $V_{th}$: where $V_{out} = V_{in}$. Logic 0 input: $0 \\to V_{IL}$; logic 1 input: $V_{IH} \\to V_{DD}$.')}</div>`);
  defs.style.opacity = 0; S.slideIn(defs, 46, 0.7);
  S.say(46, 'Your page’s five definitions in one box. Learn them word for word: exam questions name them and expect you to know which equation each one comes from.');
  S.stop(60, {
    src: 'Exam-style check',
    q: 'Which point of the VTC is defined by the slope dV_out/dV_in = −1 at the HIGHER input voltage?',
    choices: ['$V_{IH}$', '$V_{IL}$', '$V_{th}$', '$V_{OL}$'], answer: 0,
    hint: ['Two points have slope −1. The one at the lower input is $V_{IL}$.', 'The higher one starts the region where the input is a reliable 1.'],
    how: ['Both $V_{IL}$ and $V_{IH}$ have slope −1.', '$V_{IL}$ is the lower input (end of reliable 0s); $V_{IH}$ the higher (start of reliable 1s).'],
  });
});

scene(L20, 'Why slope −1 marks the edges: noise gain', 70, (S) => {
  header(S, 'LEC 20 · NOISE GAIN', 'A wiggle on the input comes out multiplied by the slope of the VTC');
  pagePeek(S, 'n21', 1180, 120, 330, 541, 0.4, 10);
  eqAt(S, "V_{out}' = f(V_{in} + \\Delta V_{noise}) \\approx V_{out} + \\frac{dV_{out}}{dV_{in}}\\,\\Delta V_{noise}", 560, 200, 0.4, { size: 30, w: 1040 });
  S.say(0.4, 'Your Lecture 21 page explains the −1: add a little noise to the input. To first order the output changes by the slope of the VTC times the noise. The slope is the inverter’s gain for small wiggles.');
  const F = vtcFrame(S, 160, 300, 420, 420, 5); F.g.style.opacity = 0; S.fade(F.g, 8, 0.5);
  const vtc = (v) => FN.rInvVout(P21, v);
  const cv = S.el('polyline', { points: ptsOf(200, 0, 5, (v) => [F.X(v), F.Y(vtc(v))]), fill: 'none', stroke: C.volt, 'stroke-width': 3.4 }); cv.style.opacity = 0; S.fade(cv, 8, 0.5);
  // two wiggles: one in the flat part, one on the steep part
  const wig = (v0, t0, col) => {
    const d = S.el('circle', { r: 8, fill: col }); const hx = S.el('line', { stroke: col, 'stroke-width': 3 }); const vy = S.el('line', { stroke: col, 'stroke-width': 3 });
    [d, hx, vy].forEach((e) => { e.style.opacity = 0; S.fade(e, t0, 0.4); });
    S.anim(t0, 1e4, d.id + ':w', (_p, t) => { const dv = 0.25 * Math.sin((t - t0) * 3), v = v0 + dv, vo = vtc(v); d.setAttribute('cx', F.X(v)); d.setAttribute('cy', F.Y(vo));
      hx.setAttribute('x1', F.X(v0 - 0.25)); hx.setAttribute('x2', F.X(v0 + 0.25)); hx.setAttribute('y1', F.Y(0) - 10); hx.setAttribute('y2', F.Y(0) - 10);
      vy.setAttribute('x1', F.X(0) + 10); vy.setAttribute('x2', F.X(0) + 10); vy.setAttribute('y1', F.Y(vtc(v0 - 0.25))); vy.setAttribute('y2', F.Y(vtc(v0 + 0.25))); }, E.lin);
  };
  wig(0.6, 10, C.ok);
  S.say(10, 'Wiggle the input around 0.6 V, in the flat part: the output barely moves. Slope near 0: the noise is swallowed.');
  wig(1.9, 20, C.bad);
  S.say(20, 'Now around 1.9 V, on the steep part: the same input wiggle makes a huge output swing. Slope steeper than −1: the noise is amplified, and logic levels are lost.');
  whyBox(S, 640, 300, 520, 220, '**The edge of safety** is where the noise gain is exactly 1 in size: $|dV_{out}/dV_{in}| = 1$. Inputs where $|$slope$| < 1$ are safe logic levels. That is why $V_{IL}$ and $V_{IH}$ are defined at slope −1.', 30);
  S.say(30, 'So the boundary between “noise gets smaller” and “noise gets bigger” is a slope of exactly −1. That is the whole reason for the definition.');
  S.stop(44, {
    src: 'Exam-style check',
    q: 'At some input the VTC slope is −3. A 0.1 V noise spike arrives on the input. How big is the spike at the output?',
    hint: ['The output change is the slope times the input change.', '$|\\Delta V_{out}| = |dV_{out}/dV_{in}|\\cdot\\Delta V_{noise}$'],
    how: ['$$|\\Delta V_{out}| = 3\\times0.1 = 0.3\\,\\text{V}$$', 'Three times larger: this input is in the forbidden zone between $V_{IL}$ and $V_{IH}$.'],
    answer: 0.3, unit: 'V', tol: 0.02,
  });
});

scene(L20, 'Noise margins: how much junk a wire can carry', 76, (S) => {
  header(S, 'LEC 20 · NOISE MARGINS', 'Gate 1 delivers V_OH / V_OL; gate 2 needs ≥ V_IH / ≤ V_IL. The gap is the margin.');
  pagePeek(S, 'n20b', 1080, 120, 440, 372, 0.4, 10);
  const a = invSym(S, 140, 250, 1); const b = invSym(S, 520, 250, 1);
  wire(S, [[a.out[0], 250], [b.inP[0], 250]], { color: C.amb }); txt(S, 340, 236, 'wire + noise', { size: 18, color: C.amb, anchor: 'middle' });
  S.say(0.4, 'One gate drives the next through a wire, and wires pick up noise. Gate 1 delivers at worst $V_{OH}$ for a 1 and $V_{OL}$ for a 0. Gate 2 needs at least $V_{IH}$ to see a 1, and at most $V_{IL}$ to see a 0.');
  // the two bars, like the page
  const bar = (x, top, bot, col, s, t0) => { const r = S.el('rect', { x, y: top, width: 120, height: bot - top, fill: col, 'fill-opacity': 0.25, stroke: col, 'stroke-width': 2 }); r.style.opacity = 0; S.fade(r, t0, 0.5); label(S, x + 60, (top + bot) / 2 + 7, s, t0, { size: 17, color: col, weight: 700, anchor: 'middle' }); };
  const Yv = (v) => 780 - v * 80; // 5 V → 380
  label(S, 230, 360, 'gate 1 output', 10, { size: 18, color: C.muted, anchor: 'middle' }); label(S, 610, 360, 'gate 2 input', 10, { size: 18, color: C.muted, anchor: 'middle' });
  bar(170, Yv(5), Yv(R21.voh - 0.0001), C.ok, '', 10); bar(170, Yv(R21.vol), Yv(0), C.bad, 'V_OL', 10);
  bar(550, Yv(5), Yv(R21.vih), C.ok, '1 zone', 12); bar(550, Yv(R21.vil), Yv(0), C.bad, '0 zone', 12);
  label(S, 160, Yv(R21.voh) + 6, 'V_OH', 12, { size: 18, color: C.ok, weight: 700, anchor: 'end' });
  label(S, 680, Yv(R21.vih) + 6, 'V_IH', 12, { size: 18, color: C.ok, weight: 700 }); label(S, 680, Yv(R21.vil) + 6, 'V_IL', 12, { size: 18, color: C.bad, weight: 700 });
  const nm = (x, y1, y2, col, s, t0) => { const ar = arrow(S, x, y1, x, y2, { color: col, w: 3, head: 10 }); ar.style.opacity = 0; S.fade(ar, t0, 0.4); label(S, x + 12, (y1 + y2) / 2 + 6, s, t0, { size: 20, color: col, weight: 800 }); };
  nm(420, Yv(R21.voh), Yv(R21.vih), C.ok, 'NM_H', 20); nm(420, Yv(R21.vol), Yv(R21.vil), C.bad, 'NM_L', 20);
  eqAt(S, 'NM_L = V_{IL} - V_{OL},\\qquad NM_H = V_{OH} - V_{IH}', 1180, 600, 20, { size: 30, w: 760 });
  S.say(20, 'The margins are the gaps. For a 0, the wire may add up to $V_{IL} - V_{OL}$ before gate 2 is unsure: $NM_L$. For a 1, it may take away up to $V_{OH} - V_{IH}$: $NM_H$.');
  S.stop(34, {
    src: 'Exam-style check',
    q: 'An inverter has V_OH = 5 V, V_OL = 0.25 V, V_IL = 1.2 V and V_IH = 2.43 V. What is its low noise margin NM_L?',
    hint: ['For a 0: from what gate 1 sends ($V_{OL}$) up to what gate 2 still accepts ($V_{IL}$).', '$NM_L = V_{IL} - V_{OL}$'],
    how: ['$$NM_L = V_{IL} - V_{OL} = 1.2 - 0.25 = 0.95\\,\\text{V}$$'],
    answer: 0.95, unit: 'V', tol: 0.02,
  });
  S.stop(42, {
    src: 'Exam-style check',
    q: 'Same inverter: its high noise margin NM_H?',
    hint: ['For a 1: from what gate 1 sends ($V_{OH}$) down to what gate 2 still accepts ($V_{IH}$).', '$NM_H = V_{OH} - V_{IH}$'],
    how: ['$$NM_H = V_{OH} - V_{IH} = 5 - 2.43 = 2.57\\,\\text{V}$$', 'Unequal margins: a resistive-load inverter protects 1s much better than 0s.'],
    answer: 2.57, unit: 'V', tol: 0.02,
  });
  S.say(43, '0.95 V and 2.57 V: the 0 is the weak side of this inverter.');
});

scene(L20, 'Static power and area', 56, (S) => {
  header(S, 'LEC 21 · YOUR PAGE', 'Power: V_DD times the average current. Area: W × L, a rough indicator');
  pagePeek(S, 'n21', 1180, 120, 330, 541, 0.4, 30);
  eqAt(S, 'P_D = V_{DD}\\cdot\\frac{I_{DC}(V_{in} = 0) + I_{DC}(V_{in} = 1)}{2}', 560, 230, 0.4, { size: 32, w: 1040 });
  S.say(0.4, 'Your page adds two more static figures. Power: the gate spends half its time with each input, so the static power is $V_{DD}$ times the average of the two currents.');
  eqAt(S, '\\text{Area} \\approx W\\times L\\;\\;(\\text{an indicator, not the layout})', 560, 330, 10, { size: 28, w: 1040 });
  S.say(10, 'Area: roughly $W \\times L$ of each device. Lecture 22 shows that a resistor can cost far more area than the transistor.');
  whyBox(S, 120, 420, 940, 140, '**Resistive load:** with the input at 0 nothing flows; with the input at 1 the current is $(V_{DD} - V_{OL})/R_L$. So $P_D = \\frac{V_{DD}}{2}\\cdot\\frac{V_{DD} - V_{OL}}{R_L}$.', 18);
  S.say(18, 'For the resistive load: no current with the input low, and $(V_{DD} - V_{OL})/R_L$ with the input high.');
  S.stop(30, {
    src: 'Exam-style check',
    q: 'V_DD = 5 V, R_L = 50 kΩ and V_OL = 0.245 V. What is the average static power?',
    hint: ['Current only flows while the output is low; average it over the two states.', '$P_D = \\dfrac{V_{DD}}{2}\\cdot\\dfrac{V_{DD} - V_{OL}}{R_L}$'],
    how: ['Output low: $$I_{DC} = \\frac{5 - 0.245}{50\\,\\text{k}} = 95.1\\,\\mu\\text{A}$$', 'Half the time: $$P_D = \\frac{5}{2}\\times95.1\\,\\mu = 238\\,\\mu\\text{W}$$'],
    parts: [{ q: 'First the current while the output is low?', answer: R21.iLow, unit: 'A', tol: 0.02, hint: ['$(V_{DD} - V_{OL})/R_L$'], how: ['$$\\frac{5 - 0.245}{50\\,\\text{k}} = 95.1\\,\\mu\\text{A}$$'] }],
    answer: R21.pd, unit: 'W', tol: 0.02,
  });
});

scene(L20, 'Lecture 20 in one card', 28, (S) => {
  header(S, 'LEC 20 · CARD', 'Static characteristics');
  remember(S, ['$V_{OH}$: max output; $V_{OL}$: output for an input of $V_{OH}$; $V_{th}$: $V_{out} = V_{in}$.',
    '$V_{IL}$ / $V_{IH}$: the lower / higher input where $dV_{out}/dV_{in} = -1$.',
    'Why −1: $V_{out}\' \\approx V_{out} + \\frac{dV_{out}}{dV_{in}}\\Delta V_{noise}$; $|$slope$| < 1$ swallows noise.',
    '$NM_L = V_{IL} - V_{OL}$, $NM_H = V_{OH} - V_{IH}$.',
    '$P_D = V_{DD}\\cdot\\frac{I_{DC}(0) + I_{DC}(1)}{2}$; area ≈ $W\\times L$.'], 0.4, 'Lecture 20 in one card');
  S.say(0.4, 'Five voltages, the reason for minus one, the two margins, power and area.');
}, { recall: ['V I L and V I H are where the slope is minus one.', 'N M L is V I L minus V O L; N M H is V O H minus V I H.', 'Static power is V D D times the average current.'] });
