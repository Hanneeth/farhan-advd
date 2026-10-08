/* Lesson E: fast revision of Lectures 1–10 for the mid-sem. One scene per lecture (circuit + every exam formula +
   "if the question says…"), rapid-fire timed questions, say-it-back drills, and a closing formula sprint.
   The figure files of the other lessons are included only for their drawing functions; their scenes are dropped. */
'use strict';
SCENES.length = 0; CHAPTERS.length = 0;

/* scale a drawn group into a box, keeping its aspect ratio */
function fitFig(g, x, y, w, h) {
  const b = bbox(g); if (!b.width) return g;
  const k = Math.min(w / b.width, h / b.height, 1.25);
  g.setAttribute('transform', `translate(${x + (w - b.width * k) / 2 - b.x * k} ${y + (h - b.height * k) / 2 - b.y * k}) scale(${k})`);
  return g;
}

/* the revision layout: figure left, formula cards right (each lights up as the voice reads it), exam trigger below */
function revScene(ch, title, o) {
  const step = o.step || 7.5, t0 = o.t0 || 5, n = o.cards.length;
  const tTrig = t0 + n * step, dur = tTrig + (o.trigger ? 14 : 4);
  return scene(ch, title, dur, (S) => {
    header(S, o.tag, o.head);
    S.el('rect', { x: 36, y: 118, width: 820, height: 740, rx: 18, fill: 'rgba(255,255,255,0.015)', stroke: '#1d2633' });
    const g = S.g(); const r = S.into(g); o.fig(S); r();
    fitFig(g, 56, 138, 780, o.trigger ? 520 : 700);
    S.draw(g, 0.3, 2);
    if (o.figNote) { const fnote = txt(S, 446, 840, o.figNote, { size: 18, color: C.muted, anchor: 'middle' }); fnote.style.opacity = 0; S.fade(fnote, 2, 0.6); }
    const top = 118, hgt = (858 - top - 10) / n;
    o.cards.forEach(([lab, tex, say], i) => {
      const t = t0 + i * step, y = top + i * hgt;
      const fo = html(S, 880, y, 690, hgt - 8, `<div class="rcard"><div class="l">${rt(lab)}</div><div class="e">${katex.renderToString(tex, { throwOnError: false, displayMode: false })}</div></div>`);
      fo.style.opacity = 0; S.slideIn(fo, t, 0.6, 24, 0);
      const gl = S.el('rect', { x: 878, y: y - 2, width: 694, height: hgt - 4, rx: 12, fill: 'none', stroke: C.amb, 'stroke-width': 2.5 });
      gl.style.opacity = 0; S.fade(gl, t, 0.3); S.out(gl, t + step - 0.4, 0.3);
      S.say(t, say);
    });
    if (o.trigger) {
      const tb = html(S, 56, 680, 780, 168, `<div class="whybox trig"><b>If the question says…</b><br>${o.trigger.map(([q, a]) => `<span class="q">${rt(q)}</span> → ${rt(a)}`).join('<br>')}</div>`);
      tb.style.opacity = 0; S.slideIn(tb, tTrig, 0.7);
      S.say(tTrig, o.triggerSay);
    }
    S.say(0.4, o.intro);
  }, { recall: o.recall });
}

/* ── figures not drawn elsewhere ── */
function fbAmpFig(S) {
  amp(S, 300, 300, { w: 170, h: 170, label: 'A' });
  wire(S, [[150, 258], [300, 258]]); txt(S, 140, 265, 'V_in', { size: 22, color: C.volt, weight: 700, anchor: 'end' });
  wire(S, [[470, 300], [640, 300]]); dot(S, 600, 300); txt(S, 650, 307, 'V_out', { size: 22, color: C.volt, weight: 700 });
  wire(S, [[600, 300], [600, 360]]); res(S, 600, 360, 450, { label: 'R_1' }); dot(S, 600, 470); wire(S, [[600, 450], [600, 490]]); res(S, 600, 490, 580, { label: 'R_2' }); gnd(S, 600, 580);
  wire(S, [[600, 470], [250, 470], [250, 342], [300, 342]]); txt(S, 420, 498, 'V_f = βV_out', { size: 20, color: C.ok, weight: 700, anchor: 'middle' });
}
function fdPairFig(S) {
  rail(S, 150, 650, 150);
  pmos(S, 260, 230, { name: 'M3', right: true, nameSide: 'l', gate: 'V_b', gl: 30 }); pmos(S, 540, 230, { name: 'M4', gate: 'V_b', gl: 30 });
  wire(S, [[260, 150], [260, 180]]); wire(S, [[540, 150], [540, 180]]);
  wire(S, [[260, 280], [260, 360]]); wire(S, [[540, 280], [540, 360]]); dot(S, 260, 320); dot(S, 540, 320);
  txt(S, 248, 316, 'V_out1', { size: 19, color: C.volt, weight: 700, anchor: 'end' }); txt(S, 552, 316, 'V_out2', { size: 19, color: C.volt, weight: 700 });
  nmos(S, 260, 410, { name: 'M1', gate: 'V_in1' }); nmos(S, 540, 410, { name: 'M2', gate: 'V_in2', right: true, nameSide: 'l' });
  wire(S, [[260, 460], [260, 480], [540, 480], [540, 460]]); dot(S, 400, 480);
  isrc(S, 400, 525, { label: 'I_SS', len: 45 }); gnd(S, 400, 570);
}
function ota5Fig(S) {
  rail(S, 150, 650, 150);
  const m3 = pmos(S, 260, 230, { name: 'M3', right: true, nameSide: 'l', gl: 30 }); const m4 = pmos(S, 540, 230, { name: 'M4', gl: 30 });
  wire(S, [[260, 150], [260, 180]]); wire(S, [[540, 150], [540, 180]]); wire(S, [[m3.gate[0], 230], [m4.gate[0], 230]]);
  wire(S, [[260, 280], [260, 300], [330, 300], [330, 230]]); dot(S, 330, 230); dot(S, 260, 300);
  wire(S, [[260, 280], [260, 360]]); wire(S, [[540, 280], [540, 360]]); dot(S, 540, 320); wire(S, [[540, 320], [640, 320]]); txt(S, 648, 327, 'V_out', { size: 20, color: C.volt, weight: 700 });
  nmos(S, 260, 410, { name: 'M1', gate: 'V_in1' }); nmos(S, 540, 410, { name: 'M2', gate: 'V_in2', right: true, nameSide: 'l' });
  wire(S, [[260, 460], [260, 480], [540, 480], [540, 460]]); dot(S, 400, 480);
  isrc(S, 400, 525, { label: 'I_SS', len: 45 }); gnd(S, 400, 570);
}
function oneFetFig(S) {
  rail(S, 250, 520, 160);
  isrc(S, 380, 240, { label: 'I_D' }); wire(S, [[380, 160], [380, 198]]);
  wire(S, [[380, 282], [380, 350]]); dot(S, 380, 320); txt(S, 392, 316, 'drain', { size: 18, color: C.muted });
  nmos(S, 380, 400, { name: 'M', gate: 'V_GS', gl: 60 }); gnd(S, 380, 450);
  const lk = [['into the drain: r_O', 560, 300, C.n], ['into the source: ≈ 1/g_m', 560, 460, C.p], ['into the gate: ∞', 120, 470, C.amb]];
  lk.forEach(([s, x, y, col]) => txt(S, x, y, s, { size: 20, color: col, weight: 700 }));
}
function towerFig(S) {
  tower(S, 330, 700, [{ v: 0.5, name: 'tail', st: 'ok' }, { v: 0.2, name: 'M1' }, { v: 0.2, name: 'M3' }, { v: 0.75, name: 'swing', st: 'room' }, { v: 0.3, name: 'M5' }, { v: 0.3, name: 'M7' }, { v: 0, name: '' }], 220, { w: 130, nodes: ['0', '', '', '', '', '', 'V_DD'] });
  txt(S, 490, 140, 'one output column of a telescopic', { size: 20, color: C.muted, anchor: 'middle' });
  txt(S, 490, 168, 'blocks add up to V_DD', { size: 20, color: C.muted, anchor: 'middle' });
}

/* ── chapter 0: the toolkit ── */
const ET = 'Toolkit (all lectures)';
scene('Start here', 'Revision Lec 1–10: how to use this', 26, (S) => {
  titleCard(S, 'REVISION · LECTURES 1–10', 'Every formula, fast', 'one scene per lecture, then rapid-fire questions against the exam clock', ['Toolkit', 'Lec 1–3', 'Lec 4–6', 'Lec 7–9', 'Lec 10', 'Sprint']);
  S.say(0.3, 'This is the fast revision of Lectures 1 to 10, built for one goal: solving mid-sem and quiz questions quickly, with every formula in your head, because you cannot carry a sheet.');
  S.say(10, 'Each lecture gets one scene: its circuit on the left and every exam formula on the right, one at a time. Say each formula with the voice. Then an “if the question says” box tells you which formula a question is asking for.');
  S.say(19, 'Every few lectures, rapid-fire questions with a tight clock. At the end, a formula sprint. Use Memorise pace if you want longer pauses.');
});

revScene(ET, 'The transistor in five formulas', {
  tag: 'TOOLKIT · 1', head: 'Square law, three ways to write g_m, r_O, and the saturation fence',
  intro: 'Every number in this course comes from one transistor. Five formulas.',
  fig: oneFetFig,
  cards: [
    ['**Square law** (saturation)', 'I_D = \\tfrac12\\mu C_{ox}\\tfrac WL V_{ov}^2,\\;\\; V_{ov} = V_{GS} - V_{th}', 'Square law: $I_D = \\tfrac12\\mu C_{ox}\\tfrac WL V_{ov}^2$, and the overdrive is $V_{GS} - V_{th}$.'],
    ['**$g_m$**, three forms', 'g_m = \\mu C_{ox}\\tfrac WL V_{ov} = \\sqrt{2\\mu C_{ox}\\tfrac WL I_D} = \\frac{2I_D}{V_{ov}}', '$g_m$ three ways. The fastest in exams is $2I_D/V_{ov}$.'],
    ['**$r_O$** and the intrinsic gain', 'r_O = \\frac{1}{\\lambda I_D},\\quad g_mr_O = \\frac{2}{\\lambda V_{ov}}', '$r_O = 1/(\\lambda I_D)$, and the intrinsic gain $g_mr_O = 2/(\\lambda V_{ov})$.'],
    ['**Saturation fence**', '\\text{NMOS: } V_D \\ge V_G - V_{th},\\;\\; \\text{PMOS: } V_D \\le V_G + |V_{th}|', 'Saturated: NMOS drain at least $V_{th}$ below its gate; PMOS drain at most $|V_{th}|$ above.'],
    ['**Sizing** (design questions)', '\\frac WL = \\frac{2I_D}{\\mu C_{ox}V_{ov}^2}', 'And for every design question, the square law turned round: $W/L = 2I_D/(\\mu C_{ox}V_{ov}^2)$.'],
  ],
  trigger: [['“find W/L”', 'current and overdrive first, then the sizing formula'], ['“find $g_m$”', '$2I_D/V_{ov}$'], ['“is M saturated?”', 'the fence']],
  triggerSay: 'If a question asks for W over L: find the current and the overdrive first. For $g_m$: two $I_D$ over $V_{ov}$. For “is it saturated”: the fence.',
  recall: ['$g_m = 2I_D/V_{ov}$, $r_O = 1/(\\lambda I_D)$.', '$W/L = 2I_D/(\\mu C_{ox}V_{ov}^2)$.'],
});

revScene(ET, 'Looking in, gain by two looks, mirrors', {
  tag: 'TOOLKIT · 2', head: 'Up multiplies, down divides; A_v = G_m(R_up ∥ R_down)',
  intro: 'The second toolkit: what resistance you see looking into each terminal, and how every gain is built from it.',
  fig: (S) => { const g = foldP(S); return g; }, figNote: 'any op amp: look up and look down from the output',
  cards: [
    ['**Into a drain**, with $R_S$ under it', 'R \\approx g_mr_OR_S\\;\\;(\\text{plain: } r_O)', 'Into a drain: $r_O$. With $R_S$ under the source it multiplies: about $g_mr_OR_S$. Up multiplies.'],
    ['**Into a source**', 'R \\approx \\frac{1}{g_m}', 'Into a source: about $1/g_m$. Down divides.'],
    ['**Cascode**', 'R_{out} = g_{m2}r_{O2}r_{O1},\\;\\; A_v \\approx (g_mr_O)^2', 'A cascode: $g_{m2}r_{O2}r_{O1}$, so its gain is about $(g_mr_O)^2$.'],
    ['**Every gain**', 'A_v = G_m(R_{up}\\parallel R_{down}),\\;\\; G_m \\approx g_{m,in}', 'Every gain: $G_m$ times $R_{up}$ in parallel with $R_{down}$.'],
    ['**Mirror**', 'I_{out} = I_{ref}\\,\\frac{(W/L)_{out}}{(W/L)_{ref}}', 'Mirrors copy current in the ratio of the W over L values.'],
  ],
  trigger: [['“find the gain”', 'look up, look down, parallel, times $g_m$'], ['“currents”', 'mirror ratios from the sizes']],
  triggerSay: 'Any gain question: look up, look down, parallel them, times $g_m$. Any current question: mirror ratios.',
  recall: ['Up multiplies: $g_mr_OR_S$. Down divides: $1/g_m$.', '$A_v = G_m(R_{up}\\parallel R_{down})$.'],
});

/* ── Lec 1–3 ── */
const E13 = 'Lec 1–3';
revScene(E13, 'Lec 1: gain error and the minimum A', {
  tag: 'LEC 1 · 90-SECOND REVISION', head: 'β from the divider, A/(1 + βA), ε ≈ 1/βA',
  intro: 'Lecture 1, Razavi Example 9.1: why an op amp needs a huge open-loop gain.',
  fig: fbAmpFig,
  cards: [
    ['**Feedback factor**', '\\beta = \\frac{R_2}{R_1 + R_2},\\;\\; A_{ideal} = \\frac{1}{\\beta} = 1 + \\frac{R_1}{R_2}', 'The divider sets $\\beta = R_2/(R_1 + R_2)$, and the ideal gain is $1/\\beta$.'],
    ['**Closed-loop gain**', 'A_{closed} = \\frac{A}{1 + \\beta A}', 'The real gain is $A/(1 + \\beta A)$, a little below $1/\\beta$.'],
    ['**Gain error**', '\\varepsilon = \\frac{1}{1 + \\beta A} \\approx \\frac{1}{\\beta A}', 'The gain error: $1/(1 + \\beta A)$, about $1/(\\beta A)$.'],
    ['**Minimum open-loop gain**', 'A_{min} = \\frac{A_{closed}}{\\varepsilon} = \\frac{1}{\\beta\\,\\varepsilon}', 'So the minimum open-loop gain is the closed-loop gain divided by the allowed error.'],
  ],
  trigger: [['“gain error below x %”', '$A \\ge (1/\\beta)/\\varepsilon$'], ['“actual gain”', '$A/(1 + \\beta A)$']],
  triggerSay: 'Gain error below some percent: the open-loop gain must be at least the ideal gain divided by the error.',
  recall: ['$A_{closed} = \\frac{A}{1 + \\beta A}$, $\\varepsilon \\approx \\frac{1}{\\beta A}$.'],
});

revScene(E13, 'Lec 2: specs, the fully differential pair, the 5-T OTA', {
  tag: 'LEC 2 · 90-SECOND REVISION', head: 'Gain, input CM range, swing and bandwidth of both one-stage op amps',
  intro: 'Lecture 2: the two one-stage op amps. For each, four numbers: gain, input CM range, swing, bandwidth.', step: 7,
  fig: (S) => { const a = S.g(); const r = S.into(a); fdPairFig(S); r(); a.setAttribute('transform', 'translate(-120 0)'); const b = S.g(); const r2 = S.into(b); ota5Fig(S); r2(); b.setAttribute('transform', 'translate(560 0)'); },
  figNote: 'left: fully differential pair · right: 5-T OTA',
  cards: [
    ['**GBW** (one pole)', '\\omega_u = A_0\\,\\omega_0,\\quad BW = \\frac{1}{(r_{O2}\\parallel r_{O4})C_L}', 'One pole: GBW is $A_0$ times the pole, and the pole is the output resistance times $C_L$.'],
    ['**Both: gain**', 'A_v = g_{m1,2}(r_{O1,2}\\parallel r_{O3,4})', 'Gain of both: $g_m$ times $r_{O}$ of the input in parallel with $r_O$ of the load.'],
    ['**Input CM range**', 'V_{ISS} + V_{GS1} \\le V_{in,CM} \\le \\begin{cases} V_{DD} - |V_{ov3}| + V_{thn} & \\text{(diff.)} \\\\ V_{DD} - |V_{GS3}| + V_{th1} & \\text{(5-T)} \\end{cases}', 'Input CM: floor $V_{ISS} + V_{GS1}$ for both. Ceiling: with current-source loads $V_{DD} - |V_{ov3}| + V_{thn}$; with the diode of the 5-T, $V_{DD} - |V_{GS3}| + V_{th1}$.'],
    ['**Swing**, fully differential', '2\\,(V_{DD} - |V_{ov3}| - V_{ov1} - V_{ISS})', 'Fully differential swing: twice $V_{DD}$ minus three overdrives.'],
    ['**Swing**, 5-T OTA', 'V_{DD} - |V_{ov4}| - V_{ov2} - V_{ISS}', '5-T swing: no factor two, single output.'],
  ],
  trigger: [['“input CM range”', 'floor: tail check + link · ceiling: load + fence'], ['“swing”', '$V_{DD}$ minus the blocks in the output column']],
  triggerSay: 'Input CM range: floor is the tail check plus a link, ceiling is the load plus the fence. Swing: $V_{DD}$ minus the blocks in the output column.',
  recall: ['5-T: $A_v = g_{m2}(r_{O2}\\parallel r_{O4})$, CM max $V_{DD} - |V_{GS3}| + V_{th1}$.', 'Fully differential swing: $2(V_{DD} - |V_{ov3}| - V_{ov1} - V_{ISS})$.'],
});

revScene(E13, 'Lec 3: the buffer, the telescopic, the window', {
  tag: 'LEC 3 · 90-SECOND REVISION', head: '5-T buffer, telescopic gain and swing, the V_th − V_ov window',
  intro: 'Lecture 3: the 5-T as a unity-gain buffer, then the telescopic op amp and its narrow buffer window.', step: 7,
  fig: (S) => { const g = teleSE(S, { load: 'diode', buffer: true }); return g; }, figNote: 'telescopic with its output on M2’s gate (the buffer)',
  cards: [
    ['**5-T buffer**', 'R_{out,closed} \\approx \\frac{1}{g_{m2}},\\quad \\omega_{p,closed} = \\frac{g_{m2}}{C_L}', 'As a buffer the 5-T output resistance falls to $1/g_{m2}$ and its pole moves up to $g_{m2}/C_L$.'],
    ['**Telescopic gain**', 'A \\approx \\frac{(g_mr_O)^2}{2}', 'Telescopic gain: about $(g_mr_O)^2/2$.'],
    ['**Telescopic swing** (fully diff.)', '2[V_{DD} - (|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ISS})]', 'Fully differential telescopic swing: twice $V_{DD}$ minus five blocks.'],
    ['**Diode-stack mirror**', '\\text{swing} = V_{DD} - (\\ldots + |V_{thp}|)\\;\\;\\text{(the diode tax)}', 'With a diode-stack mirror, one whole $|V_{thp}|$ is lost.'],
    ['**Buffer window**', 'V_{b1} - V_{th4} \\le V_{out} \\le V_{b1} - V_{GS4} + V_{th2},\\;\\; \\text{width } V_{th} - V_{ov4}', 'As a buffer the telescopic only works in a window $V_{th} - V_{ov4}$ wide.'],
  ],
  trigger: [['“telescopic as a buffer”', 'two fences: M4 floor, M2 ceiling'], ['“gain of telescopic”', '$(g_mr_O)^2/2$ or two looks']],
  triggerSay: 'Telescopic used as a buffer: two fences, M4 gives the floor and M2 the ceiling.',
  recall: ['Telescopic: $A \\approx (g_mr_O)^2/2$.', 'Buffer window: $V_{b1} - V_{th4}$ to $V_{b1} - V_{GS4} + V_{th2}$.'],
});

/* rapid-fire figure: the formula sheet stays hidden (recall, don't read) and appears only when the round's answers do */
const sheetFig = (lines, tShow) => (S2) => {
  const ph = txt(S2, 470, 430, 'formula sheet appears after the round', { size: 24, color: C.muted, anchor: 'middle' });
  S2.out(ph, tShow - 0.3, 0.3);
  const g = S2.g(); const r = S2.into(g); eqFig(lines)(S2); r();
  g.style.opacity = 0; S2.fade(g, tShow, 0.6);
};
const PFX_E = 'Prefixes on: [SETTINGS] ▸ Calc Settings ▸ Engineer Symbol ▸ On; type µ with [CATALOG] ▸ Engineer Symbol.';

/* computed numbers for the rapid-fire rounds */
const RF = (() => {
  const kn = 100e-6, wl = 10, id = 50e-6, lam = 0.1;
  const vov = Math.sqrt((2 * id) / (kn * wl)), gm = (2 * id) / vov, ro = 1 / (lam * id);
  return { vov, gm, ro, gmro: gm * ro };
})();
scene(E13, 'Rapid fire: toolkit and Lec 1–3', 66, (S) => {
  pyqFrame(S, {
    tag: 'RAPID FIRE 1 · AGAINST THE CLOCK', title: 'Six quick ones', src: 'Revision drill (Lec 1–3)',
    q: '$\\mu_nC_{ox}$ = 100 µA/V², $W/L$ = 10, $I_D$ = 50 µA, $\\lambda$ = 0.1 V⁻¹. Then: gain 10 with < 1 % error; a 5-T OTA and a telescopic with every $|V_{ov}|$ = 0.2 V, $V_{th}$ = 0.4 V, $|V_{thp}|$ = 0.5 V, $V_{ISS}$ = 0.2 V, $V_{DD}$ = 1.8 V.', qh: 230,
    fig: sheetFig([['V_{ov} = \\sqrt{\\tfrac{2I_D}{\\mu C_{ox}W/L}},\\; g_m = \\tfrac{2I_D}{V_{ov}},\\; r_O = \\tfrac{1}{\\lambda I_D}', 280, 26], ['A_{min} = \\frac{1/\\beta}{\\varepsilon}', 390, 30], ['V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{th1}', 490, 28], ['\\text{swing} = 2[V_{DD} - 5\\,V_{ov}]', 590, 28, '#ffd38a']], 43),
    steps: [
      { t: 4, title: '**Overdrive from the square law**, turned round.', tex: `V_{ov} = \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}} = \\sqrt{\\frac{100\\,\\mu}{1000\\,\\mu}} = ${fx(RF.vov, 3)}\\,\\mathrm{V}`,
        try: { q: 'Overdrive $V_{ov}$ of this transistor?', answer: RF.vov, unit: 'V', tol: 0.02, secs: 40,
          hint: ['Saturation square law, solved for the overdrive.', '$V_{ov} = \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}}$'],
          how: [`Square law solved for $V_{ov}$: $$V_{ov} = \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}} = \\sqrt{\\frac{2(50\\,\\mu)}{100\\,\\mu\\times10}} = \\sqrt{0.1} = ${fx(RF.vov, 3)}\\,\\text{V}$$`],
          calc: [{ what: 'V_ov in one line', keys: '[√] 2 × 50µ ÷ ( 100µ × 10 ) [EXE]', shows: fx(RF.vov, 3), note: PFX_E }] },
        say: `${fx(RF.vov, 3)} volts.` },
      { t: 10, title: '**Intrinsic gain**: $g_m$ from current and overdrive, $r_O$ from λ.', tex: `g_m = \\frac{2I_D}{V_{ov}} = ${fx(RF.gm * 1e3, 3)}\\,\\mathrm{mS},\\; r_O = \\frac{1}{\\lambda I_D} = 200\\,\\mathrm{k\\Omega},\\; g_mr_O = ${fx(RF.gmro, 3)}`,
        try: {
          parts: [
            { q: '$g_m$ of this transistor?', answer: RF.gm, unit: 'S', tol: 0.02, hint: ['Fastest form: current over overdrive.', '$g_m = \\frac{2I_D}{V_{ov}}$'], how: [`$$\\frac{2(50\\,\\mu)}{${fx(RF.vov, 3)}}$$`] },
            { q: '$r_O$ of this transistor?', answer: RF.ro, unit: 'Ω', tol: 0.02, hint: ['From λ and the current.', '$r_O = \\frac{1}{\\lambda I_D}$'], how: ['$$\\frac{1}{0.1\\times50\\,\\mu}$$'] },
          ],
          q: `Intrinsic gain $g_mr_O$ of the same transistor (with your $V_{ov} = ${fx(RF.vov, 3)}$ V)?`, answer: RF.gmro, unit: '', tol: 0.02, secs: 45,
          hint: ['The fastest $g_m$ uses the current and the overdrive you just found; $r_O$ comes from λ.', '$g_m = \\frac{2I_D}{V_{ov}}$, $r_O = \\frac{1}{\\lambda I_D}$'],
          how: [`$$g_m = \\frac{2I_D}{V_{ov}} = \\frac{2(50\\,\\mu)}{${fx(RF.vov, 3)}} = ${fx(RF.gm * 1e3, 3)}\\,\\text{mS}$$`, '$$r_O = \\frac{1}{\\lambda I_D} = \\frac{1}{0.1\\times50\\,\\mu} = 200\\,\\text{k}\\Omega$$', `$$g_mr_O = ${fx(RF.gm * 1e3, 3)}\\,\\text{mS}\\times200\\,\\text{k}\\Omega = ${fx(RF.gmro, 3)}$$`] },
        say: `$g_m$ = ${fx(RF.gm * 1e3, 3)} millisiemens, $r_O$ = 200 kilo-ohms: $g_mr_O$ = ${fx(RF.gmro, 3)}.` },
      { t: 17, title: '**Minimum open-loop gain**: the error is about $1/(\\beta A)$, so $A \\ge (1/\\beta)/\\varepsilon$.', tex: 'A_{min} = \\frac{1/\\beta}{\\varepsilon} = \\frac{10}{0.01} = 1000',
        try: { q: 'A closed-loop gain of 10 must have less than 1 % gain error. Minimum open-loop gain A?', answer: 1000, unit: '', tol: 0.01, secs: 30,
          hint: ['The gain error is about one over the loop gain βA, and β is one over the ideal gain.', '$\\varepsilon \\approx \\frac{1}{\\beta A}$, so $A_{min} = \\frac{1/\\beta}{\\varepsilon}$'],
          how: ['Ideal gain 10 means $$\\beta = \\frac{1}{10} = 0.1$$', '$$A_{min} = \\frac{1}{\\beta\\,\\varepsilon} = \\frac{10}{0.01} = 1000$$'] },
        say: '10 over 0.01: 1000.' },
      { t: 23, title: '**5-T ceiling**: the diode M3 holds M1’s drain a whole $|V_{GS3}|$ below $V_{DD}$; M1’s gate may go $V_{th1}$ higher.', tex: 'V_{DD} - |V_{GS3}| + V_{th1} = 1.8 - (0.5 + 0.2) + 0.4 = 1.5\\,\\mathrm{V}',
        try: { q: '5-T OTA: highest input common-mode level?', answer: 1.5, unit: 'V', tol: 0.01, secs: 45,
          hint: ['The diode-connected load M3 holds M1’s drain one $|V_{GS3}|$ below $V_{DD}$; M1’s NMOS fence lets its gate go $V_{th}$ above that drain.', '$V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{th1}$'],
          how: ['$$|V_{GS3}| = |V_{thp}| + |V_{ov3}| = 0.5 + 0.2 = 0.7\\,\\text{V}$$', '$$V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{th1} = 1.8 - 0.7 + 0.4 = 1.5\\,\\text{V}$$'] },
        say: '1.8 minus 0.7 plus 0.4: 1.5 volts.' },
      { t: 30, title: '**Telescopic swing**: five blocks of 0.2 V in each output column (the tail too); two outputs double what is left.', tex: '2[V_{DD} - 5(0.2)] = 2(1.8 - 1.0) = 1.6\\,\\mathrm{V_{pp}}',
        try: { q: 'Fully differential telescopic: maximum output swing, peak to peak?', answer: 1.6, unit: 'V', tol: 0.01, secs: 45,
          hint: ['One output column holds five blocks: tail, input, NMOS cascode, PMOS cascode, PMOS source. Each output gets what is left of $V_{DD}$; the two outputs double it.', '$\\text{swing} = 2[V_{DD} - (V_{ISS} + V_{ov1} + V_{ov3} + |V_{ov5}| + |V_{ov7}|)]$'],
          how: ['Five blocks of 0.2 V each (the tail’s $V_{ISS}$ = 0.2 V too): $$5\\times0.2 = 1.0\\,\\text{V}$$', '$$\\text{swing} = 2(1.8 - 1.0) = 1.6\\,\\text{V}_{pp}$$'] },
        say: 'Five blocks of 0.2: 1.6 volts peak to peak.' },
      { t: 37, title: '**Buffer window** = M2’s fence − M4’s fence: one threshold minus one overdrive.', tex: 'V_{th} - V_{ov4} = 0.4 - 0.2 = 0.2\\,\\mathrm{V}',
        try: { q: 'Telescopic used as a unity-gain buffer: how wide is its output window?', answer: 0.2, unit: 'V', tol: 0.01, secs: 30,
          hint: ['Two fences bound the output: M4 from below, M2 (gate on the output) from above. Subtract them.', '$\\text{width} = (V_{b1} - V_{GS4} + V_{th}) - (V_{b1} - V_{th}) = V_{th} - V_{ov4}$'],
          how: ['Ceiling minus floor: $$(V_{b1} - V_{GS4} + V_{th}) - (V_{b1} - V_{th}) = V_{th} - V_{ov4}$$', '$$V_{th} - V_{ov4} = 0.4 - 0.2 = 0.2\\,\\text{V}$$'] },
        say: 'Only 0.2 volts.' },
      { t: 43, ans: true, title: `**Round 1:** ${fx(RF.vov, 3)} V · ${fx(RF.gmro, 3)} · 1000 · 1.5 V · 1.6 Vpp · 0.2 V`, say: 'If any of those took longer than its clock, replay that lecture’s scene once more.' },
    ],
  });
}, { q: 'Rapid fire 1' });

/* ── Lec 4–6 ── */
const E46 = 'Lec 4–6';
revScene(E46, 'Lec 4: designing a telescopic (Ex 9.7)', {
  tag: 'LEC 4 · 90-SECOND REVISION', head: 'Power → currents → swing budget → overdrives → W/L → gain → lengthen',
  intro: 'Lecture 4: the design recipe. Every design question follows the same order.',
  fig: towerFig, figNote: 'the swing budget: what is left of V_DD after the overdrives',
  cards: [
    ['① **Currents**', 'I_{total} = \\frac{P}{V_{DD}},\\;\\; I_{D1} = \\frac{I_{SS}}{2}', 'One: the power gives the current; each side gets half the tail.'],
    ['② **Overdrives** from the swing', '\\sum V_{ov} = V_{DD} - \\text{swing per side}', 'Two: the swing budget. What is left of $V_{DD}$ is shared among the stacked overdrives.'],
    ['③ **Sizes**', '\\frac WL = \\frac{2I_D}{\\mu C_{ox}V_{ov}^2}', 'Three: sizes from the square law.'],
    ['④ **Gain check**', 'A_v = g_{m1}(R_{up}\\parallel R_{down})', 'Four: check the gain with the two looks.'],
    ['⑤ **Too little gain?** Lengthen M5–M8', 'g_mr_O \\propto \\sqrt{\\tfrac{WL}{I_D}},\\;\\; \\lambda \\propto \\tfrac1L', 'Five: not enough gain? Make the loads longer: $g_mr_O$ grows with $\\sqrt{WL/I_D}$, while the overdrives stay put.'],
  ],
  trigger: [['“design for P, swing, gain”', 'the five steps, in this order']],
  triggerSay: 'Any design question: write the five steps down first, then fill in numbers.',
  recall: ['Design order: currents, overdrives, sizes, gain, lengthen.'],
});

revScene(E46, 'Lec 5: folding and the folded cascode', {
  tag: 'LEC 5 · 90-SECOND REVISION', head: 'KCL at the fold, R_up, R_down with two r_O, G_m ≈ g_m1',
  intro: 'Lecture 5: folding takes the input device out of the output column.',
  fig: (S) => foldP(S), figNote: 'PMOS-input folded cascode (your page’s names)',
  cards: [
    ['**Ex 9.6 output CM** (closed through C, R)', 'V_{CM} = V_b - (V_{GS3,4} - V_{th1,2})', 'Example 9.6: the output CM is $V_b - (V_{GS3,4} - V_{th1,2})$.'],
    ['**KCL at the fold**', 'I_{SS2} = I_{SS1} + \\frac{I_{SS}}{2}', 'KCL at the fold: each bottom source carries the cascode branch plus half the tail.'],
    ['**Look up**', 'R_{up} = g_{m5}r_{O5}r_{O7}', 'Looking up: an ordinary PMOS cascode.'],
    ['**Look down**', 'R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O9})', 'Looking down: two $r_O$ hang on the fold node, $r_{O1}$ and $r_{O9}$.'],
    ['**Gain**', 'A_v \\approx g_{m1}(R_{up}\\parallel R_{down})', 'Gain: $g_{m1}$ times the two looks in parallel.'],
  ],
  trigger: [['“currents in a folded cascode”', 'bottom = branch + $I_{SS}/2$'], ['“gain of folded”', 'two $r_O$ at the fold node']],
  triggerSay: 'Currents in a folded cascode: bottom source equals branch plus half the tail. Gain: remember the two $r_O$ at the fold node.',
  recall: ['$R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O9})$.', 'Bottom source $= I_{branch} + I_{SS}/2$.'],
});

revScene(E46, 'Lec 6: CM ranges, rail-to-rail, buffers, low-voltage load', {
  tag: 'LEC 6 · 90-SECOND REVISION', head: 'Folded inputs pass a rail; the folded buffer has two floors; no diode tax', step: 6.5,
  intro: 'Lecture 6, the page you have already done in detail. Six lines.',
  fig: (S) => foldN(S), figNote: 'NMOS-input folded cascode',
  cards: [
    ['**PMOS input** CM range', 'V_{ov9} - |V_{thp}| \\le V_{in,CM} \\le V_{DD} - |V_{ov11}| - |V_{GS1}|', 'PMOS input: floor $V_{ov9} - |V_{thp}|$, below ground; ceiling $V_{DD} - |V_{ov11}| - |V_{GS1}|$.'],
    ['**NMOS input** CM range', 'V_{ov11} + V_{GS1} \\le V_{in,CM} \\le V_{DD} - |V_{ov10}| + V_{th1}', 'NMOS input: floor $V_{ov11} + V_{GS1}$; ceiling $V_{DD} - |V_{ov10}| + V_{th1}$, above $V_{DD}$.'],
    ['**Rail-to-rail**', '\\text{N pair} \\parallel \\text{P pair}:\\; G_m \\text{ doubles in the middle}', 'Rail-to-rail: both pairs; $G_m$ doubles in the middle.'],
    ['**Folded buffer**', 'V_{out} \\ge \\max(V_{b2} - V_{th4},\\; V_{b2} - V_{GS4} - |V_{th2}|)', 'Folded buffer: two floors, the higher binds, no ceiling from the input device.'],
    ['**Diode tax**', 'V_{out,max} = V_{DD} - |V_{ov8}| - |V_{ov6}| - |V_{thp}|', 'Diode-stack load: a whole $|V_{thp}|$ is lost.'],
    ['**Low-voltage load** bias window', 'V_{DD} - |V_{GS7}| - |V_{th5}| \\le V_b \\le V_{DD} - |V_{ov7}| - |V_{GS5}|', 'Low-voltage cascode load: $V_b$ sits between two fences, and no diode tax.'],
  ],
  trigger: [['“input CM range of folded”', 'the input pair’s drain sits near the other rail'], ['“bias limits”', 'a source at its edge + a link']],
  triggerSay: 'Folded input range: it passes the rail opposite to the input pair. Bias limits: a source at its edge, then a link.',
  recall: ['PMOS input floor $V_{ov9} - |V_{thp}|$; NMOS input ceiling $V_{DD} - |V_{ov10}| + V_{th1}$.'],
});

scene(E46, 'Rapid fire: Lec 4–6', 60, (S) => {
  pyqFrame(S, {
    tag: 'RAPID FIRE 2 · AGAINST THE CLOCK', title: 'Five quick ones', src: 'Revision drill (Lec 4–6)',
    q: '$V_{DD}$ = 1.8 V, every $|V_{ov}|$ = 0.2 V, $V_{thn}$ = 0.4 V, $|V_{thp}|$ = 0.5 V, $\\mu_nC_{ox}$ = 200 µA/V². A telescopic draws P = 1.8 mW (ignore bias branches). A folded cascode has $I_{SS}$ = 1 mA and 0.5 mA per cascode branch.', qh: 230,
    fig: sheetFig([['I = P/V_{DD},\\;\\; W/L = \\tfrac{2I_D}{\\mu C_{ox}V_{ov}^2}', 290, 28], ['I_{bottom} = I_{branch} + I_{SS}/2', 400, 30], ['V_{ov9} - |V_{thp}|,\\;\\; V_{DD} - |V_{ov10}| + V_{th1}', 510, 28, '#ffd38a']], 37),
    steps: [
      { t: 4, title: '**Power → current**: $P/V_{DD}$ is the total; the tail splits it equally between the two sides.', tex: 'I = \\frac{P}{V_{DD}} = \\frac{1.8\\,\\mathrm{mW}}{1.8\\,\\mathrm{V}} = 1\\,\\mathrm{mA} \\Rightarrow 0.5\\,\\mathrm{mA}\\text{ per side}',
        try: { q: 'Telescopic: drain current of each input transistor?', answer: 0.5e-3, unit: 'A', tol: 0.01, secs: 30,
          hint: ['Power over supply gives the total current; the tail splits it equally between the two sides.', '$I = P/V_{DD}$, $I_D = I/2$'],
          how: ['$$I = \\frac{P}{V_{DD}} = \\frac{1.8\\,\\text{mW}}{1.8\\,\\text{V}} = 1\\,\\text{mA}$$', 'Half per side: $$I_D = \\frac{1\\,\\text{mA}}{2} = 0.5\\,\\text{mA}$$'] },
        say: '1 milliamp in total, 0.5 per side.' },
      { t: 10, title: '**Sizing**: the square law turned round, at 0.5 mA and 0.2 V.', tex: '\\frac WL = \\frac{2I_D}{\\mu_nC_{ox}V_{ov}^2} = \\frac{2(0.5\\,\\mathrm{m})}{200\\,\\mu\\,(0.2)^2} = 125',
        try: { q: '$(W/L)$ of an NMOS carrying that current (0.5 mA)?', answer: 125, unit: '', tol: 0.01, secs: 45,
          hint: ['Square law solved for the size, with the current you just found and the given overdrive.', '$\\frac WL = \\frac{2I_D}{\\mu_nC_{ox}V_{ov}^2}$'],
          how: ['Square law turned round: $$\\frac WL = \\frac{2I_D}{\\mu_nC_{ox}V_{ov}^2} = \\frac{2(0.5\\,\\text{m})}{200\\,\\mu\\times0.2^2} = \\frac{1\\,\\text{m}}{8\\,\\mu} = 125$$'],
          calc: [{ what: 'W/L in one line', keys: '2 × 0.5m ÷ ( 200µ × 0.2 [x²] ) [EXE]', shows: '125', note: PFX_E }] },
        say: '125.' },
      { t: 17, title: '**KCL at the fold**: each bottom source feeds its cascode branch and half the tail.', tex: 'I_{bottom} = I_{branch} + \\frac{I_{SS}}{2} = 0.5 + 0.5 = 1\\,\\mathrm{mA}',
        try: { q: 'Folded cascode: current in each bottom current source?', answer: 1e-3, unit: 'A', tol: 0.01, secs: 30,
          hint: ['KCL at the fold node: the bottom source carries both the cascode branch current and the input transistor’s current.', '$I_{bottom} = I_{branch} + I_{SS}/2$'],
          how: ['KCL at the fold: $$I_{bottom} = I_{branch} + \\frac{I_{SS}}{2} = 0.5\\,\\text{mA} + \\frac{1\\,\\text{mA}}{2} = 1\\,\\text{mA}$$'] },
        say: '1 milliamp.' },
      { t: 23, title: '**PMOS-input floor**: M1’s drain is one $V_{ov9}$ above ground; its gate may sit $|V_{thp}|$ lower.', tex: 'V_{ov9} - |V_{thp}| = 0.2 - 0.5 = -0.3\\,\\mathrm{V}',
        try: { q: 'PMOS-input folded cascode: lowest input common-mode level?', answer: -0.3, unit: 'V', tol: 0.01, abs: 0.005, secs: 40,
          hint: ['M1’s drain is the fold node, one overdrive of the bottom source above ground. A PMOS gate may sit $|V_{thp}|$ below its drain.', '$V_{in,CM,min} = V_{ov9} - |V_{thp}|$'],
          how: ['PMOS fence against the fold node: $$V_{in,CM,min} = V_{ov9} - |V_{thp}| = 0.2 - 0.5 = -0.3\\,\\text{V}$$', 'Below ground: folding lets the input pass the bottom rail.'] },
        say: 'Minus 0.3 volts, below ground.' },
      { t: 30, title: '**NMOS-input ceiling**: M1’s drain is one $|V_{ov10}|$ below $V_{DD}$; its gate may sit $V_{th1}$ higher.', tex: 'V_{DD} - |V_{ov10}| + V_{th1} = 1.8 - 0.2 + 0.4 = 2.0\\,\\mathrm{V}',
        try: { q: 'NMOS-input folded cascode: highest input common-mode level?', answer: 2.0, unit: 'V', tol: 0.01, secs: 40,
          hint: ['M1’s drain is the fold node, one overdrive of the top PMOS source below $V_{DD}$. An NMOS gate may sit $V_{th}$ above its drain.', '$V_{in,CM,max} = V_{DD} - |V_{ov10}| + V_{th1}$'],
          how: ['NMOS fence against the fold node: $$V_{in,CM,max} = V_{DD} - |V_{ov10}| + V_{th1} = 1.8 - 0.2 + 0.4 = 2.0\\,\\text{V}$$', 'Above $V_{DD}$: folding lets the input pass the top rail.'] },
        say: '2 volts, above $V_{DD}$.' },
      { t: 37, ans: true, title: '**Round 2:** 0.5 mA · 125 · 1 mA · −0.3 V · 2.0 V', say: 'Folding moves the input range past one rail. Remember which rail.' },
    ],
  });
}, { q: 'Rapid fire 2' });

/* ── Lec 7–9 ── */
const E79 = 'Lec 7–9';
revScene(E79, 'Lec 7: two stages, and the boosting idea', {
  tag: 'LEC 7 · 90-SECOND REVISION', head: 'Stage 1 gain × stage 2 swing; R_out boosted by (1 + A_1)',
  intro: 'Lecture 7: two stages split the jobs, and the first gain-boosting result.',
  fig: (S) => twoStage2(S), figNote: 'telescopic first stage, CS second stage',
  cards: [
    ['**Two stages**', 'A = A_1A_2', 'Two stages: the gains multiply.'],
    ['**Telescopic stage 1**', 'A_1 = g_{m1}[g_{m5}r_{O5}r_{O7}\\parallel g_{m3}r_{O3}r_{O1}]', 'Stage 1 telescopic: the two cascode looks.'],
    ['**CS stage 2**', 'A_2 = g_{m9}(r_{O9}\\parallel r_{O11})', 'Stage 2, a common-source: $g_{m9}$ times $r_{O9}\\parallel r_{O11}$.'],
    ['**Level between the stages** (a link)', 'V_X = V_{DD} - |V_{GS9}|', 'The DC level between the stages is a link: $V_{DD} - |V_{GS9}|$.'],
    ['**Boosting** (amp watches the source)', 'R_{out} = R_S + r_O + (1 + A_1)g_mR_Sr_O', 'Boosting: an amplifier holding the source multiplies the output resistance by $(1 + A_1)$.'],
  ],
  trigger: [['“two-stage gain/level at X”', 'A1·A2, and X by a link'], ['“$R_{out}$ with an aux amp”', 'multiply the cascode term by $(1 + A_1)$']],
  triggerSay: 'Two-stage: multiply the gains, find X by a link. Auxiliary amplifier: multiply the cascode term by one plus $A_1$.',
  recall: ['$A = A_1A_2$, $V_X = V_{DD} - |V_{GS9}|$.', '$R_{out} = R_S + r_O + (1 + A_1)g_mR_Sr_O$.'],
});

revScene(E79, 'Lec 8: the boosted cascode and three boosters', {
  tag: 'LEC 8 · 90-SECOND REVISION', head: 'G_m ≈ g_m1, R_out × (1 + A_1), (g_m r_O)³; CS, PMOS, folded boosters',
  intro: 'Lecture 8: the full boosted cascode, and the three ways to build the booster.',
  fig: (S) => regCascode(S), figNote: 'boosted cascode with a CS booster M3 (implementation 1)',
  cards: [
    ['**Boosted cascode**', 'G_m \\approx g_{m1},\\;\\; R_{out} \\approx (1 + A_1)g_{m2}r_{O2}r_{O1}', 'Boosted cascode: $G_m$ is still $g_{m1}$; $R_{out}$ gains a factor $(1 + A_1)$.'],
    ['**Gain**', 'A_v \\approx (g_mr_O)^3', 'So the gain is about $(g_mr_O)^3$.'],
    ['**CS booster** (M3)', 'A_1 = g_{m3}r_{O3},\\;\\; V_{out,min} = V_{GS3} + V_{ov2}', 'A CS booster: $A_1 = g_{m3}r_{O3}$, but X sits at $V_{GS3}$: the output floor is $V_{GS3} + V_{ov2}$.'],
    ['**PMOS booster**', 'V_{GS2} \\le |V_{th3}|\\;\\Rightarrow\\;\\text{fails}', 'A PMOS booster forces $V_{GS2} \\le |V_{th3}|$: M2 barely on. It fails.'],
    ['**Folded booster**', 'A_1 = g_{m3}g_{m4}r_{O3}r_{O4}', 'The folded booster: $A_1 = g_{m3}g_{m4}r_{O3}r_{O4}$, no swing lost.'],
  ],
  trigger: [['“$R_{out}$ or gain of a boosted cascode”', '$(1 + A_1)g_{m2}r_{O2}r_{O1}$'], ['“lowest output with CS booster”', '$V_{GS3} + V_{ov2}$']],
  triggerSay: 'Boosted cascode: $(1 + A_1)g_{m2}r_{O2}r_{O1}$. Lowest output with a CS booster: $V_{GS3} + V_{ov2}$.',
  recall: ['$R_{out} \\approx (1 + A_1)g_{m2}r_{O2}r_{O1}$.', 'CS booster: $V_{out,min} = V_{GS3} + V_{ov2}$.'],
});

revScene(E79, 'Lec 9: boosters as amplifiers, and why CMFB', {
  tag: 'LEC 9 · 90-SECOND REVISION', head: 'Booster gain, its headroom, its input type; the output CM is undefined',
  intro: 'Lecture 9: the booster is just another amplifier, and a fully differential op amp needs CMFB.',
  fig: (S) => teleBoosted(S), figNote: 'telescopic with both cascodes boosted',
  cards: [
    ['**Folded booster gain**', 'A_v = g_{m1}[1 + g_{m3}g_{m4}r_{O3}r_{O4}]g_{m2}r_{O2}r_{O1}', 'With the folded booster: $g_{m1}$ times one plus the booster gain times the cascode.'],
    ['**Differential CS booster** headroom', 'V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}', 'Differential CS booster: check, link, check: $V_{ISS1} + V_{GS5} + V_{ov3}$.'],
    ['**Folded-cascode booster**', 'A_{aux} = g_{m5}[g_{m11}r_{O11}r_{O13}\\parallel g_{m7}r_{O7}(r_{O9}\\parallel r_{O5})]', 'A whole folded cascode as booster: its gain by two looks.'],
    ['**Input type of a booster**', '\\text{NMOS cascodes} \\to \\text{PMOS-input};\\;\\; \\text{PMOS cascodes} \\to \\text{NMOS-input}', 'Low nodes need PMOS-input boosters; high nodes need NMOS-input ones.'],
    ['**Why CMFB**', '\\Delta V_{out,CM} = (I_P - I_N)(R_P\\parallel R_N)', 'Why CMFB: a tiny current mismatch times a huge resistance moves the output CM to a rail.'],
  ],
  trigger: [['“which input pair for the booster”', 'look at the level it must sit at'], ['“CM drift without CMFB”', '$\\Delta I\\,(R_P\\parallel R_N)$']],
  triggerSay: 'Which input pair: look at the DC level. CM drift: the mismatch current times $R_P$ parallel $R_N$.',
  recall: ['$\\Delta V_{out,CM} = (I_P - I_N)(R_P\\parallel R_N)$.', 'Low cascodes: PMOS-input booster. High cascodes: NMOS-input.'],
});

const RF3 = (() => { const g = 50; return { a2s: 1250 * 25, boost: g * g * (1 + g), vmin: 0.6 + 0.2, drift: 1e-6 * 5e5 }; })();
scene(E79, 'Rapid fire: Lec 7–9', 56, (S) => {
  pyqFrame(S, {
    tag: 'RAPID FIRE 3 · AGAINST THE CLOCK', title: 'Four quick ones', src: 'Revision drill (Lec 7–9)',
    q: 'Every $g_mr_O$ = 50, $V_{GS}$ = 0.6 V, $V_{ov}$ = 0.2 V. A two-stage has $A_1$ = 1250, $A_2$ = 25. A cascode is boosted by a CS booster with $A_1 = g_mr_O$. A fully differential output has $R_P = R_N$ = 1 MΩ and 1 µA of mismatch.', qh: 230,
    fig: sheetFig([['A = A_1A_2', 280, 32], ['A_v \\approx g_{m1}(1 + A_1)g_{m2}r_{O2}r_{O1}', 390, 28], ['V_{out,min} = V_{GS3} + V_{ov2}', 490, 28], ['\\Delta V = \\Delta I\\,(R_P\\parallel R_N)', 590, 28, '#ffd38a']], 30),
    steps: [
      { t: 4, title: '**Two stages in series**: the gains multiply.', tex: 'A = A_1A_2 = 1250 \\times 25 = 31\\,250',
        try: { q: 'Two-stage op amp: total open-loop gain?', answer: RF3.a2s, unit: '', tol: 0.01, secs: 25,
          hint: ['The second stage amplifies the first stage’s output: stages in series multiply.', '$A = A_1A_2$'],
          how: ['$$A = A_1A_2 = 1250\\times25 = 31\\,250$$', 'In dB: $20\\log_{10}31\\,250 ≈ 89.9$ dB.'] },
        say: '31 thousand 250.' },
      { t: 10, title: '**Boosted cascode**: the booster multiplies the cascode’s $R_{out}$ by $(1 + A_1)$; the gain is $g_{m1}$ times that.', tex: 'A_v \\approx g_{m1}r_{O1}(1 + A_1)g_{m2}r_{O2} = 50 \\times 51 \\times 50 = 127\\,500',
        try: { q: 'Gain of the boosted cascode stage?', answer: RF3.boost, unit: '', tol: 0.02, secs: 50,
          hint: ['The booster multiplies the cascode’s output resistance by one plus its own gain; the stage gain is $g_{m1}$ times that resistance.', '$A_v \\approx g_{m1}(1 + A_1)g_{m2}r_{O2}r_{O1} = g_{m1}r_{O1}\\,(1 + A_1)\\,g_{m2}r_{O2}$'],
          how: ['The booster gain: $A_1 = g_mr_O = 50$.', '$$A_v \\approx g_{m1}r_{O1}(1 + A_1)g_{m2}r_{O2} = 50\\times51\\times50 = 127\\,500$$', 'That is about $(g_mr_O)^3$.'] },
        say: '50 times 51 times 50: about 127 thousand. That is $(g_mr_O)^3$.' },
      { t: 17, title: '**CS booster headroom**: X sits at the booster’s $V_{GS3}$, and the cascode M2 needs its overdrive on top.', tex: 'V_{out,min} = V_{GS3} + V_{ov2} = 0.6 + 0.2 = 0.8\\,\\mathrm{V}',
        try: { q: 'Cascode with a CS booster: lowest output voltage?', answer: RF3.vmin, unit: 'V', tol: 0.01, secs: 30,
          hint: ['The CS booster’s gate is node X, so X sits at the booster’s $V_{GS}$; the cascode on top needs its overdrive.', '$V_{out,min} = V_{GS3} + V_{ov2}$'],
          how: ['X is the booster’s gate: $V_X = V_{GS3} = 0.6$ V.', '$$V_{out,min} = V_{GS3} + V_{ov2} = 0.6 + 0.2 = 0.8\\,\\text{V}$$'] },
        say: '0.8 volts.' },
      { t: 23, title: '**CM drift without CMFB**: the mismatch current flows into both output resistances in parallel.', tex: '\\Delta V = \\Delta I\\,(R_P\\parallel R_N) = 1\\,\\mu\\mathrm{A}\\times 0.5\\,\\mathrm{M\\Omega} = 0.5\\,\\mathrm{V}',
        try: { q: 'Fully differential output: how far does the output CM move because of the mismatch?', answer: RF3.drift, unit: 'V', tol: 0.01, secs: 30,
          hint: ['Without CMFB nothing absorbs the mismatch current: it flows into the output node, which sees the PMOS and NMOS resistances in parallel.', '$\\Delta V_{out,CM} = \\Delta I\\,(R_P\\parallel R_N)$'],
          how: ['$$R_P\\parallel R_N = 1\\,\\text{M}\\parallel1\\,\\text{M} = 0.5\\,\\text{M}\\Omega$$', '$$\\Delta V = 1\\,\\mu\\text{A}\\times0.5\\,\\text{M}\\Omega = 0.5\\,\\text{V}$$'] },
        say: 'Half a volt from one microamp: that is why CMFB.' },
      { t: 30, ans: true, title: '**Round 3:** 31 250 · ≈127 500 · 0.8 V · 0.5 V', say: 'Boosting multiplies, and every booster costs a little headroom.' },
    ],
  });
}, { q: 'Rapid fire 3' });

/* ── Lec 10 ── */
const E10 = 'Lec 10';
revScene(E10, 'Lec 10: CM and DM, the CMFB loop, two sensors', {
  tag: 'LEC 10 · 90-SECOND REVISION', head: 'Sense → compare → correct; resistive and follower sensing',
  intro: 'Lecture 10: common-mode feedback.',
  fig: (S) => cmfbGeneral(S),
  cards: [
    ['**CM and DM**', 'V_{CM} = \\frac{V_1 + V_2}{2},\\;\\; V_{DM} = V_1 - V_2', 'Any two signals: the average is CM, the difference is DM.'],
    ['**The loop**', '\\text{sense } V_{out,CM} \\to \\text{compare with } V_{REF} \\to \\text{correct a current}', 'CMFB: sense the output CM, compare with $V_{REF}$, correct a current source.'],
    ['**Resistive sensing**', 'V_{out,CM} = \\frac{V_{out1} + V_{out2}}{2},\\;\\; A_v = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R_1)', 'Two resistors average the outputs, but they load them: $R_1$ appears in parallel in the gain.'],
    ['**Follower sensing**', 'V_{sense} = V_{out,CM} - V_{GS}', 'Source followers do not load the outputs, but shift the level by $V_{GS}$ and cost swing.'],
    ['**Loop gain** (past papers)', 'T = A_{EA}\\,g_{m3}(R_{up}\\parallel R_{down})', 'The CMFB loop gain: error-amp gain, times $g_m$ of the corrected device, times the output resistance.'],
  ],
  trigger: [['“effect of sensing resistors on gain”', 'put $R$ in parallel'], ['“CMFB loop gain”', 'sense (1) × $A_{EA}$ × $g_m$ × $R_{out}$']],
  triggerSay: 'Sensing resistors: put them in parallel in the gain. CMFB loop gain: sense, amplify, current, resistance.',
  recall: ['Resistive sensing: $A_v = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R_1)$.', 'CMFB: sense, compare with $V_{REF}$, correct.'],
});

scene(E10, 'Rapid fire: Lec 10 and the sprint', 70, (S) => {
  pyqFrame(S, {
    tag: 'RAPID FIRE 4 · FORMULA SPRINT', title: 'Pick the right formula, fast', src: 'Revision drill (Lec 1–10)',
    q: 'Each stop: pick the formula, then move on. 20–30 seconds each, the way you would recall them in the exam.', qh: 150,
    fig: eqFig([['\\text{recall, don\\textquoteright t derive}', 420, 34, '#ffd38a']]),
    steps: [
      { t: 4, title: '**Resistive sensing** averages the two outputs: two equal resistors give the midpoint.', tex: 'V_{out,CM} = \\frac{V_{out1} + V_{out2}}{2} = \\frac{1.3 + 0.7}{2} = 1.0\\,\\mathrm{V}',
        try: { q: 'Resistive CM sensing, with $V_{out1}$ = 1.3 V and $V_{out2}$ = 0.7 V. What output CM level does it sense?', answer: 1.0, unit: 'V', tol: 0.01, secs: 20,
          hint: ['Two equal resistors from the outputs meet at the midpoint between them.', '$V_{out,CM} = \\frac{V_{out1} + V_{out2}}{2}$'],
          how: ['The equal resistors form a divider that gives the average: $$V_{out,CM} = \\frac{1.3 + 0.7}{2} = 1.0\\,\\text{V}$$'] },
        say: 'The average: 1 volt.' },
      { t: 9, title: '**Look down** into the NMOS cascode: its source (the fold node) carries two $r_O$.', tex: 'R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O9})',
        try: { q: 'PMOS-input folded cascode: which is $R_{down}$, looking down from the output?', choices: ['g_m3 r_O3 (r_O1 ∥ r_O9)', 'g_m3 r_O3 r_O9', 'g_m5 r_O5 r_O7'], answer: 0, secs: 25,
          hint: ['Looking down you see the NMOS cascode M3; under its source is the fold node.', 'Into a drain with $R_S$ under the source: $g_mr_OR_S$. Count what hangs on the fold node.'],
          how: ['Into a drain with $R_S$ under the source: $g_mr_OR_S$.', 'Here $R_S$ is everything on the fold node: the input device’s $r_{O1}$ and the bottom source’s $r_{O9}$, in parallel: $R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O9})$.', '$g_{m3}r_{O3}r_{O9}$ forgets $r_{O1}$; $g_{m5}r_{O5}r_{O7}$ is the look up, not down.'] },
        say: 'Two $r_O$ on the fold node.' },
      { t: 14, title: '**Gain error** is one over the loop gain βA.', tex: '\\varepsilon = \\frac{1}{1 + \\beta A} \\approx \\frac{1}{\\beta A}',
        try: { q: 'An op amp with open-loop gain A in feedback with factor β. Gain error ε ≈ ?', choices: ['1/(βA)', 'βA', '1/A'], answer: 0, secs: 20,
          hint: ['Compare the real closed-loop gain $A/(1 + \\beta A)$ with the ideal $1/\\beta$.', '$\\frac{A}{1 + \\beta A} = \\frac{1}{\\beta}\\left(1 - \\frac{1}{1 + \\beta A}\\right)$'],
          how: ['$$\\frac{A}{1 + \\beta A} = \\frac{1}{\\beta}\\cdot\\frac{\\beta A}{1 + \\beta A} = \\frac{1}{\\beta}\\left(1 - \\frac{1}{1 + \\beta A}\\right)$$', 'So the relative error is $1/(1 + \\beta A) \\approx 1/(\\beta A)$.', '$1/A$ is the tempting wrong one: it forgets the feedback factor β.'] },
        say: 'One over the loop gain.' },
      { t: 19, title: '**5-T ceiling**: the diode load takes a whole $|V_{GS3}|$, then M1’s fence adds $V_{th1}$.', tex: 'V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{th1}',
        try: { q: '5-T OTA (diode-connected PMOS load): highest input common-mode level?', choices: ['V_DD − |V_GS3| + V_th1', 'V_DD − |V_ov3| + V_thn', 'V_DD − |V_ov3|'], answer: 0, secs: 25,
          hint: ['M1’s drain is held by the diode-connected M3.', 'Drain at $V_{DD} - |V_{GS3}|$; the NMOS fence then lets M1’s gate go $V_{th1}$ higher.'],
          how: ['M3 is a diode, so M1’s drain sits a whole $|V_{GS3}|$ (not just $|V_{ov3}|$) below $V_{DD}$.', 'NMOS fence on M1: its gate may be $V_{th1}$ above its drain, giving $V_{DD} - |V_{GS3}| + V_{th1}$.', '$V_{DD} - |V_{ov3}| + V_{thn}$ is the fully differential pair with current-source loads, the tempting wrong one.'] },
        say: 'The diode takes a whole $V_{GS}$.' },
      { t: 24, title: '**Boosted $R_{out}$**: the plain cascode term times $(1 + A_1)$.', tex: 'R_{out} \\approx (1 + A_1)g_{m2}r_{O2}r_{O1}',
        try: { q: 'Cascode (M2 on M1) with a booster amplifier of gain $A_1$: output resistance?', choices: ['(1 + A₁) g_m2 r_O2 r_O1', 'A₁ g_m2 r_O2', '(1 + A₁) r_O1'], answer: 0, secs: 25,
          hint: ['Start from the plain cascode output resistance.', 'The booster holds M2’s source still and multiplies that by one plus its own gain.'],
          how: ['Plain cascode: $R_{out} \\approx g_{m2}r_{O2}r_{O1}$.', 'The booster multiplies it by $(1 + A_1)$: $R_{out} \\approx (1 + A_1)g_{m2}r_{O2}r_{O1}$.', 'The other two choices drop the $r_{O1}$ or the $g_{m2}r_{O2}$ of the cascode.'] },
        say: 'The cascode term times one plus $A_1$.' },
      { t: 29, title: '**Buffer window width**: ceiling (M2’s fence) minus floor (M4’s fence).', tex: '(V_{b1} - V_{GS4} + V_{th}) - (V_{b1} - V_{th}) = V_{th} - V_{ov4}',
        try: { q: 'Telescopic used as a unity-gain buffer: width of its output window?', choices: ['V_th − V_ov4', 'V_th + V_ov4', '2V_ov'], answer: 0, secs: 20,
          hint: ['Floor and ceiling are two fences: M4 below, M2 (gate on the output) above.', 'Subtract: $(V_{b1} - V_{GS4} + V_{th}) - (V_{b1} - V_{th})$, with $V_{GS4} = V_{th} + V_{ov4}$.'],
          how: ['$$(V_{b1} - V_{GS4} + V_{th}) - (V_{b1} - V_{th}) = 2V_{th} - V_{GS4}$$', 'With $V_{GS4} = V_{th} + V_{ov4}$ the width is $V_{th} - V_{ov4}$: a few tenths of a volt.'] },
        say: '$V_{th} - V_{ov4}$.' },
      { t: 34, ans: true, title: '**Sprint done.** Missed one? Replay that lecture’s 90-second scene.', say: 'That is Lectures 1 to 10. For the frequency, slewing and stability half, use the Lecture 11 to 14 and 15 to 17 lessons.' },
    ],
  });
}, { q: 'Formula sprint' });

scene('Exam playbook', 'Exam-hall strategy', 40, (S) => {
  header(S, 'EXAM PLAYBOOK', 'Time, order, and what to write first');
  remember(S, [
    '**Clock:** mid-sem 90 min / 60 marks = **1.5 min per mark**; quiz 30 min / 15 marks = **2 min per mark**. Over budget: write the method line, move on.',
    '**First 30 seconds of every question:** name the circuit, write the formula you will use (they give method marks).',
    '**Currents first** (power, mirrors, KCL at a fold), then **levels** (checks and links, fences), then **gain** (two looks).',
    '**Design order:** currents → overdrives → W/L → gain → fixes. **Units:** µA/pF = V/µs; Hz = rad/s ÷ 2π.',
    '**Sanity checks:** $g_mr_O$ ≈ 30–100; telescopic gain ≈ $(g_mr_O)^2/2$; CM ranges inside the rails unless folded.',
  ], 0.4, 'The exam playbook');
  S.say(0.4, 'Last: the clock. Mid-sem: one and a half minutes per mark. Quiz: two minutes per mark. If you are over, write the method line and move on.');
  S.say(14, 'Every question: name the circuit and write the formula first, then currents, then levels, then gain. Good luck tomorrow.');
});

FORMULAS = [
  ['Toolkit', [
    ['Square law', 'I_D = \\tfrac12\\mu C_{ox}\\tfrac WL V_{ov}^2'], ['g_m', 'g_m = \\tfrac{2I_D}{V_{ov}} = \\sqrt{2\\mu C_{ox}\\tfrac WL I_D}'], ['r_O', 'r_O = \\tfrac{1}{\\lambda I_D}'],
    ['Sizing', '\\tfrac WL = \\tfrac{2I_D}{\\mu C_{ox}V_{ov}^2}'], ['Looks', 'g_mr_OR_S \\;(\\text{up}),\\; 1/g_m \\;(\\text{down})'], ['Gain', 'A_v = G_m(R_{up}\\parallel R_{down})'],
  ]],
  ['Lec 1–3', [
    ['Closed loop', 'A_{cl} = \\tfrac{A}{1+\\beta A},\\; \\varepsilon \\approx \\tfrac{1}{\\beta A}'], ['Min gain', 'A_{min} = \\tfrac{1/\\beta}{\\varepsilon}'],
    ['One-stage gain', 'g_{m1}(r_{O1}\\parallel r_{O3})'], ['5-T CM', 'V_{ISS} + V_{GS1} \\le V_{CM} \\le V_{DD} - |V_{GS3}| + V_{th1}'],
    ['Diff. swing', '2(V_{DD} - |V_{ov3}| - V_{ov1} - V_{ISS})'], ['Telescopic', 'A \\approx (g_mr_O)^2/2,\\; \\text{window } V_{th} - V_{ov4}'],
  ]],
  ['Lec 4–6', [
    ['Design', 'P \\to I \\to V_{ov} \\to W/L \\to A_v'], ['Fold KCL', 'I_{bottom} = I_{branch} + I_{SS}/2'], ['Folded R_down', 'g_{m3}r_{O3}(r_{O1}\\parallel r_{O9})'],
    ['PMOS-in CM', 'V_{ov9} - |V_{thp}| \\le V_{CM} \\le V_{DD} - |V_{ov11}| - |V_{GS1}|'], ['NMOS-in CM', 'V_{ov11} + V_{GS1} \\le V_{CM} \\le V_{DD} - |V_{ov10}| + V_{th1}'],
  ]],
  ['Lec 7–10', [
    ['Two-stage', 'A = A_1A_2,\\; V_X = V_{DD} - |V_{GS9}|'], ['Boosted', 'R_{out} \\approx (1 + A_1)g_{m2}r_{O2}r_{O1}'], ['CS booster floor', 'V_{GS3} + V_{ov2}'],
    ['CM drift', '\\Delta V = (I_P - I_N)(R_P\\parallel R_N)'], ['Resistive sensing', 'A_v = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R_1)'],
  ]],
];
CARDS = [
  ['$g_m$ fastest form?', '$2I_D/V_{ov}$'], ['Gain error?', '$\\varepsilon \\approx 1/(\\beta A)$'], ['5-T CM ceiling?', '$V_{DD} - |V_{GS3}| + V_{th1}$'],
  ['Telescopic gain?', '$(g_mr_O)^2/2$'], ['Buffer window width?', '$V_{th} - V_{ov4}$'], ['Fold KCL?', 'bottom = branch + $I_{SS}/2$'],
  ['PMOS-input folded CM floor?', '$V_{ov9} - |V_{thp}|$ (below ground)'], ['Boosted $R_{out}$?', '$(1 + A_1)g_{m2}r_{O2}r_{O1}$'], ['Why CMFB?', '$\\Delta I(R_P\\parallel R_N)$ drifts to a rail'],
];
