/* Lesson F: Lecture 19 — designing the Miller two-stage op amp spec by spec (Allen–Holberg order, as on the page),
   the nulling resistor, Tutorial 7 Q1, and the page's own spec (CL = 5 pF), whose power check fails and is fixed.
   Lecture names: M1, M2 input · M3, M4 mirror · M5 tail · M6 second-stage PMOS · M7 sink · M0 bias.
   Tutorial 7 prints: M6 bias diode · M7 second-stage PMOS · M8 sink. Numbers: F.t7, F.l19, F.l19b (f_num.js). */
'use strict';
const L19 = 'Lec 19 · Designing the two-stage';
const u3 = (v, m, unit) => `${fx(v / m, 3)}\\,\\text{${unit}}`;

/* Tutorial 7's figure, names exactly as printed (INN on M1, INP on M2, I_BIAS into the diode M6, M7 PMOS output, M8 sink) */
function t7Fig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 80, 760, 170);
  const m3 = pmos(S, 220, 240, { name: 'M3', right: true, gl: 30, nameSide: 'l' }); const m4 = pmos(S, 420, 240, { name: 'M4', gl: 30 });
  wire(S, [[220, 170], [220, 190]]); wire(S, [[420, 170], [420, 190]]); wire(S, [[m3.gate[0], 240], [m4.gate[0], 240]]);
  wire(S, [[220, 290], [220, 310], [280, 310], [280, 240]]); dot(S, 280, 240); dot(S, 220, 310);
  wire(S, [[220, 290], [220, 360]]); wire(S, [[420, 290], [420, 360]]); dot(S, 420, 320);
  nmos(S, 220, 410, { name: 'M1', gate: 'INN', gl: 30 }); nmos(S, 420, 410, { name: 'M2', gate: 'INP', right: true, nameSide: 'l', gl: 30 });
  wire(S, [[220, 460], [220, 480], [420, 480], [420, 460]]); dot(S, 320, 480);
  nmos(S, 320, 530, { name: 'M5', gl: 40 }); gnd(S, 320, 580);
  // bias: I_BIAS into the diode M6, mirrored to M5 and M8
  isrc(S, 120, 330, { label: 'I_BIAS', left: true, len: 50 }); wire(S, [[120, 170], [120, 280]]); wire(S, [[120, 380], [120, 480]]);
  nmos(S, 120, 530, { name: 'M6', right: true, gl: 30, nameSide: 'l' }); gnd(S, 120, 580);
  wire(S, [[120, 488], [180, 488], [180, 530]]); dot(S, 120, 488); dot(S, 180, 530); wire(S, [[180, 530], [250, 530]]);
  wire(S, [[180, 530], [180, 616], [560, 616], [560, 530], [570, 530]]);
  // second stage
  const m7 = pmos(S, 640, 250, { name: 'M7', gl: 30 }); wire(S, [[640, 170], [640, 200]]);
  wire(S, [[420, 320], [560, 320], [560, 250], [m7.gate[0], 250]]);
  wire(S, [[640, 300], [640, 480]]); dot(S, 640, 380);
  wire(S, [[640, 380], [740, 380]]); txt(S, 748, 387, 'OUT', { size: 20, color: C.volt, weight: 700 });
  nmos(S, 640, 530, { name: 'M8', gl: 40 }); gnd(S, 640, 580);
  const cx = 540;
  wire(S, [[420, 320], [450, 320], [450, 380], [cx - 6, 380]]);
  S.el('line', { x1: cx - 6, y1: 362, x2: cx - 6, y2: 398, stroke: C.amb, 'stroke-width': 3.6 }); S.el('line', { x1: cx + 6, y1: 362, x2: cx + 6, y2: 398, stroke: C.amb, 'stroke-width': 3.6 });
  wire(S, [[cx + 6, 380], [640, 380]]); txt(S, cx, 352, 'C_c', { size: 20, color: C.amb, weight: 700, anchor: 'middle' });
  r(); return g;
}

scene(L19, 'Which spec sizes which transistor', 72, (S) => {
  header(S, 'LEC 19 · YOUR PAGE', 'Every specification lands on one device: the red arrows on your page');
  pagePeek(S, 'n19', 1140, 120, 400, 421, 0.4, 4.6);
  const t = twoStageFig(S, { x: 40, y: 60, sc: 1, caps: false }); S.draw(t.g, 0.3, 2.2);
  S.say(0.3, 'Lecture 19 turns the two-stage op amp into a recipe. Your page marks each specification with a red arrow to the one device it decides.');
  // a column of tags; the device each one decides pulses while its tag is read. All leave before the stop (you answer from memory).
  const tags = [
    [5, 'GBW → M1, M2 (g_m1)', [[260, 470], [460, 470]], C.n], [9, 'ICMR+ → M3, M4', [[260, 300], [460, 300]], C.p], [13, 'ICMR− → M5', [[360, 590]], C.n],
    [17, 'SR → I5 (with C_c)', [[360, 545]], C.ok], [21, 'PM → C_c', [[580, 440]], C.amb], [25, 'zero: g_m6 ≥ 10 g_m1 → M6', [[680, 310]], C.p],
    [29, 'V_out,min or I6/I5 → M7', [[680, 590]], C.n], [33, 'power → all currents (bias M0)', [[260, 232], [460, 232], [680, 232]], C.bad],
  ];
  tags.forEach(([t0, s2, spots, col], i) => {
    const c = chip(S, 980, 170 + i * 80, s2, { color: col, size: 18 }); c.style.opacity = 0; S.pop(c, t0); S.out(c, 41.5, 0.5);
    spots.forEach(([x, y]) => S.ring(x, y, 34, col, t0, t0 + 4));
  });
  S.say(5, 'The GBW spec decides the input pair: $GBW = g_{m1}/C_c$.');
  S.say(9, 'The highest input common-mode level decides the mirror M3, M4: their $|V_{GS}|$ eats into the headroom above M1.');
  S.say(13, 'The lowest input common-mode level decides the tail M5: it needs its $V_{DS}$ under M1’s $V_{GS}$.');
  S.say(17, 'The slew rate decides the tail current $I_5$, because during slewing $I_5$ charges $C_c$.');
  S.say(21, 'The phase margin decides $C_c$ (Lecture 18: at least $0.22\\,C_L$).');
  S.say(25, 'The zero rule decides M6: $g_{m6} \\ge 10\\,g_{m1}$, with $|V_{GS6}| = |V_{GS4}|$ so the first stage stays balanced.');
  S.say(29, 'M7 is a copy of M5 scaled to carry $I_6$, or sized for the lowest output voltage.');
  S.say(33, 'And the power budget is $V_{DD}$ times every current, including the bias branch M0.');
  S.stop(44, {
    src: 'Exam-style check',
    q: 'Which specification decides the tail current I₅ (before any transistor is sized)?',
    choices: ['The slew rate, through $I_5 = SR\\cdot C_c$', 'The GBW, through $g_{m1} = GBW\\cdot C_c$', 'The lowest input CM level, through $V_{DS5}$', 'The power budget alone'],
    answer: 0,
    hint: ['During slewing, which current flows into which capacitor?', 'Slewing: $I_5$ charges $C_c$, so $SR = I_5/C_c$.'],
    how: ['With a large input step one input device turns off; the whole tail current $I_5$ goes through the mirror into $C_c$.', 'So $SR = I_5/C_c$, and once $C_c$ is fixed (from the PM), $$I_5 = SR\\cdot C_c$$', 'The power budget only checks the result afterwards.'],
  });
});

scene(L19, 'The design order, step by step', 66, (S) => {
  header(S, 'LEC 19 · THE RECIPE', 'Eight steps, always in this order: each one uses only the steps before it');
  const steps = [
    '**1 · PM →** $C_c \\ge 0.22\\,C_L$',
    '**2 · SR →** $I_5 = SR\\cdot C_c$',
    '**3 · ICMR+ →** $\\left(\\frac{W}{L}\\right)_3 = \\dfrac{I_5}{\\mu_pC_{ox}\\left[V_{DD} - V_{in,max} - |V_{th3}|_{max} + V_{th1,min}\\right]^2}$',
    '**4 · GBW →** $g_{m1} = 2\\pi\\,GBW\\,C_c$, $\\left(\\frac{W}{L}\\right)_1 = \\dfrac{g_{m1}^2}{\\mu_nC_{ox}I_5}$',
    '**5 · ICMR− →** $V_{DS5} = V_{in,min} - \\sqrt{\\dfrac{I_5}{\\mu_nC_{ox}(W/L)_1}} - V_{th1,max}$, $\\left(\\frac{W}{L}\\right)_5 = \\dfrac{2I_5}{\\mu_nC_{ox}V_{DS5}^2}$',
    '**6 · zero →** $g_{m6} \\ge 10\\,g_{m1}$; $|V_{GS6}| = |V_{GS4}|$: $\\left(\\frac{W}{L}\\right)_6 = \\dfrac{g_{m6}}{\\mu_pC_{ox}|V_{ov4}|}$, $I_6 = \\tfrac12 g_{m6}|V_{ov4}|$',
    '**7 · current ratio →** $\\left(\\frac{W}{L}\\right)_7 = \\left(\\frac{W}{L}\\right)_5\\dfrac{I_6}{I_5}$',
    '**8 · check** power $V_{DD}(I_{bias} + I_5 + I_6) \\le P_{max}$, PM, gain',
  ];
  steps.forEach((s, i) => { const fo = html(S, 90, 130 + i * 88, 1420, 82, `<div class="whybox" style="padding:10px 16px">${rt(s)}</div>`); fo.style.opacity = 0; S.slideIn(fo, 0.6 + i * 5, 0.6, 30, 0); });
  const say = ['Step one: the phase margin fixes $C_c$ from the load, 0.22 $C_L$.', 'Step two: the slew rate and $C_c$ fix the tail current.',
    'Step three: the highest input CM fixes M3 and M4. Worst case: M3’s threshold at its largest, M1’s at its smallest. Your page writes $V_{th1}$ max here; the worst case, and the 2025 mid-sem key, use $V_{th1}$ min with $|V_{th3}|$ max, and so do we.',
    'Step four: GBW and $C_c$ give $g_{m1}$; with the current per device, $I_5/2$, that sizes M1 and M2.',
    'Step five: the lowest input CM leaves $V_{DS5}$ for the tail after M1’s full $V_{GS}$; that sizes M5.',
    'Step six: the zero rule gives $g_{m6}$; making $|V_{GS6}| = |V_{GS4}|$ gives M6’s overdrive, so its size and current follow.',
    'Step seven: M7 mirrors M5, scaled to carry $I_6$.', 'Step eight: check the power, the phase margin and the gain. If one fails, go back and change a choice.'];
  say.forEach((s2, i) => S.say(0.6 + i * 5, s2));
  S.stop(44, {
    src: 'Exam-style check',
    q: 'Why must step 4 (sizing M1 from the GBW) come after step 1 and step 2?',
    choices: ['It needs $C_c$ (from step 1) for $g_{m1} = 2\\pi GBW\\,C_c$, and $I_5$ (from step 2) for the current through M1', 'It needs the power budget first', 'It needs $(W/L)_5$ first', 'It does not: the order does not matter'],
    answer: 0,
    hint: ['Look at the formula of step 4: which symbols are not specifications?', '$\\left(\\frac{W}{L}\\right)_1 = \\dfrac{(2\\pi GBW\\,C_c)^2}{\\mu_nC_{ox}I_5}$'],
    how: ['Step 4 is $(W/L)_1 = g_{m1}^2/(\\mu_nC_{ox}I_5)$ with $g_{m1} = 2\\pi\\,GBW\\,C_c$.', '$C_c$ comes from step 1 and $I_5$ from step 2; neither is a given.'],
  });
});

scene(L19, 'Slew rate sets I5; ICMR± size M3 and M5', 84, (S) => {
  header(S, 'LEC 19 · THE FIRST THREE SIZES', 'Each comes from one equation of the input stage, written on a tower');
  const tw = (x, title, blocks, t0) => { const g = S.g(); const r = S.into(g); txt(S, x + 60, 196, title, { size: 19, color: C.muted, anchor: 'middle', weight: 700 }); tower(S, x, 760, blocks, 300, { w: 120 }); r(); g.style.opacity = 0; S.fade(g, t0, 0.6); };
  tw(140, 'top: V_in,max', [{ v: 0.9, name: 'M1 V_GS1', st: 'min' }, { v: 0.05, name: '', st: 'room' }, { v: 0.67, name: '|V_GS3|', st: 'diode' }], 10);
  tw(420, 'bottom: V_in,min', [{ v: 0.10, name: 'V_DS5', st: 'ok' }, { v: 0.70, name: 'V_GS1', st: 'min' }], 32);
  eqAt(S, 'SR = \\frac{I_5}{C_c} \\;\\Rightarrow\\; I_5 = SR\\cdot C_c', 1150, 200, 0.6, { size: 30, w: 760 });
  S.say(0.6, 'Slewing first: with M2 off, all of $I_5$ flows through the mirror into $C_c$. So the slew rate is $I_5/C_c$, and the tail current is $SR\\cdot C_c$.');
  eqAt(S, 'V_{in,max} = V_{DD} - |V_{GS3}| + V_{th1}', 1150, 300, 10, { size: 26, w: 760 });
  eqAt(S, '\\Rightarrow\\; |V_{ov3}| \\le V_{DD} - V_{in,max} - |V_{th3}|_{max} + V_{th1,min}', 1150, 360, 10.4, { size: 24, w: 800 });
  S.say(10, 'The top of the input range: M1’s drain is held one $|V_{GS3}|$ below $V_{DD}$ by the diode M3, and M1’s gate may be at most $V_{th1}$ above its drain. So the room left for M3’s overdrive is $V_{DD} - V_{in,max} - |V_{th3}| + V_{th1}$, taken at the worst-case thresholds.');
  eqAt(S, '\\left(\\frac{W}{L}\\right)_3 = \\frac{I_5}{\\mu_pC_{ox}|V_{ov3}|^2}', 1150, 440, 18, { size: 28, w: 760 });
  S.say(18, 'Then the square law with M3’s own current $I_5/2$ gives its size.');
  eqAt(S, 'V_{in,min} = V_{DS5} + V_{GS1} \\;\\Rightarrow\\; V_{DS5} = V_{in,min} - V_{ov1} - V_{th1,max}', 1150, 540, 32, { size: 24, w: 800 });
  eqAt(S, '\\left(\\frac{W}{L}\\right)_5 = \\frac{2I_5}{\\mu_nC_{ox}V_{DS5}^2}', 1150, 640, 38, { size: 28, w: 760 });
  S.say(32, 'The bottom of the input range: M1’s gate sits one $V_{GS1}$ above the tail node, and the tail needs its $V_{DS5}$. What is left of $V_{in,min}$ after M1’s full $V_{GS}$ (worst case: largest threshold) is the room for M5, and the square law sizes it.');
  S.stop(48, {
    src: 'Exam-style check',
    q: 'V_DD = 1.8 V, V_in,max (ICMR+) = 1.6 V, |V_th3|max = 0.51 V, V_th1(min) = 0.47 V. How much overdrive may M3 have?',
    hint: ['Use the top-of-range line, at the worst-case thresholds.', '$|V_{ov3}| = V_{DD} - V_{in,max} - |V_{th3}|_{max} + V_{th1,min}$'],
    how: ['$$|V_{ov3}| = 1.8 - 1.6 - 0.51 + 0.47 = 0.16\\,\\text{V}$$', 'Only 0.16 V: M3 and M4 will be wide.'],
    answer: 0.16, unit: 'V', tol: 0.02,
  });
  S.say(49, '0.16 V of overdrive for M3: a high input range costs mirror width.');
});

scene(L19, 'M6 and M7: the zero, the match, the ratio', 72, (S) => {
  header(S, 'LEC 19 · THE SECOND STAGE', 'g_m6 from the zero rule; its overdrive copied from M4; its current mirrored into M7');
  const t = twoStageFig(S, { x: 20, y: 60, sc: 0.95, caps: false }); S.draw(t.g, 0.3, 2);
  eqAt(S, 'g_{m6} \\ge 10\\,g_{m1}', 1150, 200, 2, { size: 32, w: 760 });
  S.say(0.3, 'The second stage. Lecture 18 gave the first number: $g_{m6} \\ge 10g_{m1}$, so the right-half-plane zero sits ten times above the GB.');
  eqAt(S, '|V_{GS6}| = |V_{GS4}|\\;\\Rightarrow\\; |V_{ov6}| = |V_{ov4}|', 1150, 300, 10, { size: 30, w: 760 });
  S.say(10, 'Its gate is P, which sits one $|V_{GS4}|$ below $V_{DD}$ when the first stage is balanced. For no offset, M6 must want exactly that $|V_{GS}|$: same overdrive as M4.');
  eqAt(S, '\\left(\\frac{W}{L}\\right)_6 = \\frac{g_{m6}}{\\mu_pC_{ox}|V_{ov4}|},\\qquad I_6 = \\tfrac12\\,g_{m6}|V_{ov4}|', 1150, 400, 18, { size: 28, w: 800 });
  S.say(18, 'With $g_m = \\mu_pC_{ox}(W/L)|V_{ov}|$ the size follows, and so does its current: $I_D = \\tfrac12 g_m|V_{ov}|$.');
  eqAt(S, '\\left(\\frac{W}{L}\\right)_7 = \\left(\\frac{W}{L}\\right)_5\\frac{I_6}{I_5}', 1150, 510, 26, { size: 30, w: 760 });
  S.say(26, 'M7 sinks that current and shares M5’s gate, so it is M5 scaled by the current ratio.');
  S.stop(36, {
    src: 'Exam-style check',
    q: 'g_m6 must be 2 mS and M4’s overdrive is |V_ov4| = 0.16 V. What current I₆ does M6 carry?',
    hint: ['Same overdrive as M4. Use the current form of g_m.', '$I_6 = \\tfrac12\\,g_{m6}|V_{ov}|$'],
    how: ['From $g_m = 2I_D/|V_{ov}|$: $$I_6 = \\frac{g_{m6}|V_{ov4}|}{2} = \\frac{2\\,\\text{mS}\\times0.16}{2} = 160\\,\\mu\\text{A}$$'],
    why: 'The second stage dominates the power: a big $g_{m6}$ at a fixed overdrive costs current.',
    answer: 160e-6, unit: 'A', tol: 0.02,
  });
  S.stop(44, {
    src: 'Exam-style check',
    q: 'Same design: I₅ = 20 µA and (W/L)₅ = 12. Size M7 so it sinks I₆ = 160 µA.',
    hint: ['M7 mirrors M5: sizes scale with currents.', '$(W/L)_7 = (W/L)_5\\cdot I_6/I_5$'],
    how: ['$$\\left(\\frac{W}{L}\\right)_7 = 12\\times\\frac{160}{20} = 96$$'],
    answer: 96, unit: '', tol: 0.02,
  });
});

scene(L19, 'The nulling resistor R_z', 68, (S) => {
  header(S, 'LEC 19 · NULLING RESISTOR', 'A resistor in series with C_c moves the zero: R_z = 1/g_m6 sends it to infinity');
  pagePeek(S, 'n19b', 1110, 120, 400, 386, 0.4, 14);
  const t = twoStageFig(S, { x: 20, y: 60, sc: 1, rz: true, caps: false }); S.draw(t.g, 0.3, 2);
  S.say(0.3, 'The right-half-plane zero exists because $C_c$ feeds the signal straight across, against M6. Your page’s fix: put a resistor $R_z$ in series with $C_c$.');
  eqAt(S, '\\omega_z = \\frac{1}{C_c\\left(\\frac{1}{g_{m6}} - R_z\\right)}', 1180, 560, 8, { size: 34, w: 700 });
  S.say(8, 'The zero becomes $1/(C_c(1/g_{m6} - R_z))$. With $R_z = 0$ it is the old $g_{m6}/C_c$.');
  // the zero moving along the real axis as Rz grows
  const ax = S.g(); wire(S, [[200, 760], [1000, 760]], { color: C.muted, w: 2 }, ax); wire(S, [[600, 730], [600, 790]], { color: C.muted, w: 2 }, ax);
  txt(S, 610, 820, 'jω axis', { size: 16, color: C.muted }, ax); txt(S, 990, 790, 'right half-plane (bad)', { size: 16, color: C.bad, anchor: 'end' }, ax); txt(S, 210, 790, 'left half-plane (helps)', { size: 16, color: C.ok }, ax);
  ax.style.opacity = 0; S.fade(ax, 14, 0.5);
  const zc = S.el('circle', { r: 11, fill: 'none', stroke: C.amb, 'stroke-width': 3.5 }); zc.style.opacity = 0; S.fade(zc, 14, 0.4);
  const rl = txt(S, 600, 712, '', { size: 18, color: C.amb, anchor: 'middle', weight: 700, mono: true });
  S.anim(14, 18, 'rz', (p) => {
    const k = 0.4 + 1.3 * p, inv = 1 - k; // Rz = k/gm6; zero ∝ 1/(1 − k)
    const x = Math.abs(inv) < 0.04 ? (inv > 0 ? 1100 : 100) : 600 + 160 / inv;
    zc.setAttribute('cx', clamp(x, 210, 990)); zc.setAttribute('cy', 760);
    rl.textContent = `R_z = ${fx(k, 2)} / g_m6`;
  }, E.inout);
  S.say(14, 'Watch the zero as $R_z$ grows. Below $1/g_{m6}$ it is still on the right, moving out. At exactly $R_z = 1/g_{m6}$ the bracket is zero: the zero is at infinity, gone. Larger still, it reappears on the left, where it adds phase instead of costing it.');
  S.stop(36, {
    src: 'Exam-style check',
    q: 'g_m6 = 0.829 mS. Which R_z removes the zero completely?',
    hint: ['Make the bracket zero.', '$R_z = \\dfrac{1}{g_{m6}}$'],
    how: ['$$\\frac{1}{g_{m6}} - R_z = 0 \\;\\Rightarrow\\; R_z = \\frac{1}{g_{m6}} = \\frac{1}{0.829\\,\\text{mS}} = 1.21\\,\\text{k}\\Omega$$'],
    why: 'With the zero gone, the 10 GB rule no longer forces $g_{m6} \\ge 10g_{m1}$ for the zero (the second pole still needs $\\omega_{p2} \\ge 2.2\\,GB$).',
    answer: 1 / 0.829e-3, unit: 'Ω', tol: 0.02,
  });
});

/* ── Tutorial 7 Q1: the full design, names as printed ── */
const T7 = F.t7;
scene(L19, 'Tutorial 7 Q1: design the Miller two-stage', 150, (S) => {
  const s = F.t7spec;
  pyqFrame(S, {
    paper: 't7q1', tag: 'LEC 19 · TUTORIAL 7', title: 'Design it spec by spec, then check power and PM', src: 'Tutorial 7 Q1',
    q: 'Miller two-stage op amp (M1 INN, M2 INP, M3/M4 mirror, M5 tail, M6 bias diode with $I_{BIAS}$, M7 second stage, M8 sink). DC gain 60 dB, GBW = 30 MHz, PM ≥ 60°, SR = 20 V/µs, ICMR+ = 1.6 V, ICMR− = 0.8 V, $C_L$ = 2 pF, power ≤ 300 µW. Size every transistor.',
    giv: '$\\mu_nC_{ox} = 300\\,\\mu$A/V², $V_{th1}$ max/min = 0.59/0.47 V, $\\mu_pC_{ox} = 60\\,\\mu$A/V², $|V_{th3}|_{max} = 0.51$ V. Assumed: $V_{DD} = 1.8$ V, $V_{SS} = 0$ (the sheet prints only $V_{SS}$; 1.8 V is the lecture’s supply), $I_{BIAS} = I_5$ ($(W/L)_6 = (W/L)_5$).',
    qh: 330,
    tests: 'the Lecture 19 order: $C_c$ → $I_5$ → M3 → M1 → M5 → M7 → M8, then the power and PM checks. Tutorial 7’s M7 is the lecture’s M6, its M8 the lecture’s M7.',
    fig: (S2) => { const g = t7Fig(S2); g.setAttribute('transform', 'translate(40 150)'); },
    steps: [
      { t: 8, title: '**1 · PM → $C_c$.** Lecture 18’s rule for 60°.', tex: `C_c = 0.22\\,C_L = 0.22\\times2\\,\\text{pF} = ${u3(T7.cc, 1e-12, 'pF')}`,
        try: { q: 'Step 1: the compensation capacitor C_c for PM ≥ 60°?', answer: T7.cc, unit: 'F', tol: 0.02,
          hint: ['Lecture 18: with the second-stage $g_m$ at ten times $g_{m1}$, $C_c$ must be at least 0.22 of the load.', '$C_c = 0.22\\,C_L$'],
          how: ['$$C_c = 0.22\\,C_L = 0.22\\times2\\,\\text{pF} = 0.44\\,\\text{pF}$$'] }, say: 'C_c = 0.44 pF.' },
      { t: 16, title: '**2 · SR → $I_5$.** During slewing the tail current charges $C_c$.', tex: `I_5 = SR\\cdot C_c = (20\\,\\text{V}/\\mu\\text{s})(0.44\\,\\text{pF}) = ${u3(T7.i5, 1e-6, 'µA')}`,
        try: { q: 'Step 2: the tail current I₅ for SR = 20 V/µs (C_c from step 1)?', answer: T7.i5, unit: 'A', tol: 0.02,
          hint: ['Slewing: all of $I_5$ flows into $C_c$.', '$I_5 = SR\\cdot C_c$'],
          how: ['$$I_5 = SR\\cdot C_c = (20\\times10^{6})(0.44\\times10^{-12}) = 8.8\\,\\mu\\text{A}$$', 'Each input device carries $I_5/2 = 4.4\\,\\mu$A.'],
          calc: [{ what: 'SR × Cc', keys: '20M × 0.44p [EXE]', shows: '8.8µ' }] }, say: 'I5 = 8.8 µA, 4.4 µA per side.' },
      { t: 24, title: '**3 · ICMR+ → M3, M4.** Room for M3’s overdrive at worst-case thresholds, then the square law with $I_5/2$.', tex: `|V_{ov3}| = 1.8 - 1.6 - 0.51 + 0.47 = 0.16\\,\\text{V},\\quad \\left(\\tfrac WL\\right)_3 = \\frac{${fx(T7.i5 * 1e6, 3)}\\,\\mu}{60\\,\\mu\\times0.16^2} = ${fx(T7.wl3, 3)}`,
        try: { q: 'Step 3: (W/L)₃ = (W/L)₄ from ICMR+ = 1.6 V (I₅ from step 2)?', answer: T7.wl3, unit: '', tol: 0.02,
          parts: [{ q: 'First the overdrive M3 may have, $|V_{ov3}|$?', answer: T7.vgs3room, unit: 'V', tol: 0.02, hint: ['$V_{DD} - V_{in,max} - |V_{th3}|_{max} + V_{th1,min}$'], how: ['$$1.8 - 1.6 - 0.51 + 0.47 = 0.16\\,\\text{V}$$'] }],
          hint: ['The top of the input range leaves M3 an overdrive of $V_{DD} - V_{in,max} - |V_{th3}|_{max} + V_{th1,min}$. M3 carries $I_5/2$.', '$\\left(\\frac WL\\right)_3 = \\dfrac{2(I_5/2)}{\\mu_pC_{ox}|V_{ov3}|^2} = \\dfrac{I_5}{\\mu_pC_{ox}|V_{ov3}|^2}$'],
          how: ['M1’s drain is held one $|V_{GS3}|$ below $V_{DD}$; M1’s gate may sit at most $V_{th1}$ above it (fence). Worst case: $$|V_{ov3}| = V_{DD} - V_{in,max} - |V_{th3}|_{max} + V_{th1,min} = 0.16\\,\\text{V}$$', `Square law with $I_D = I_5/2$: $$\\left(\\frac WL\\right)_3 = \\frac{I_5}{\\mu_pC_{ox}|V_{ov3}|^2} = \\frac{8.8\\,\\mu}{60\\,\\mu\\times0.0256} = ${fx(T7.wl3, 3)}$$`] }, say: `(W/L)3,4 = ${fx(T7.wl3, 3)}.` },
      { t: 32, title: '**4 · GBW → M1, M2.** GBW in hertz, so $2\\pi$; then the square law in its $g_m$ form.', tex: `g_{m1} = 2\\pi(30\\,\\text{M})(0.44\\,\\text{p}) = ${u3(T7.gm1, 1e-6, 'µS')},\\quad \\left(\\tfrac WL\\right)_1 = \\frac{g_{m1}^2}{\\mu_nC_{ox}I_5} = ${fx(T7.wl1, 3)}`,
        try: { q: 'Step 4: (W/L)₁ = (W/L)₂ from GBW = 30 MHz (C_c, I₅ from steps 1–2)?', answer: T7.wl1, unit: '', tol: 0.02,
          parts: [{ q: 'First $g_{m1}$ for GBW = 30 MHz?', answer: T7.gm1, unit: 'S', tol: 0.02, hint: ['$GBW$ is in Hz: $g_{m1} = 2\\pi\\,GBW\\,C_c$.'], how: ['$$g_{m1} = 2\\pi(30\\times10^6)(0.44\\times10^{-12}) = 82.9\\,\\mu\\text{S}$$'] }],
          hint: ['$GB = g_{m1}/C_c$ in rad/s. Then $g_m^2 = 2\\mu_nC_{ox}(W/L)I_D$ with $I_D = I_5/2$.', '$\\left(\\frac WL\\right)_1 = \\dfrac{g_{m1}^2}{2\\mu_nC_{ox}(I_5/2)} = \\dfrac{g_{m1}^2}{\\mu_nC_{ox}I_5}$'],
          how: ['$$g_{m1} = 2\\pi\\,GBW\\,C_c = 82.9\\,\\mu\\text{S}$$', `$$\\left(\\frac WL\\right)_1 = \\frac{(82.9\\,\\mu)^2}{300\\,\\mu\\times8.8\\,\\mu} = ${fx(T7.wl1, 3)}$$`],
          calc: [{ what: 'g_m1 then (W/L)1', keys: '2 [π] × 30M × 0.44p [VARIABLE] ▸ A ▸ Store; [SHIFT][4] [x²] ÷ ( 300µ × 8.8µ ) [EXE]', shows: fx(T7.wl1, 4) }] }, say: `gm1 = 82.9 µS, (W/L)1,2 = ${fx(T7.wl1, 3)}.` },
      { t: 40, title: '**5 · ICMR− → M5.** What is left under M1’s full $V_{GS}$ (largest threshold) is $V_{DS5}$.', tex: `V_{ov1} = \\sqrt{\\frac{I_5}{\\mu_nC_{ox}(W/L)_1}} = ${fx(T7.vov1, 3)}\\,\\text{V},\\quad V_{DS5} = 0.8 - ${fx(T7.vov1, 3)} - 0.59 = ${fx(T7.vds5, 3)}\\,\\text{V}`,
        try: { q: 'Step 5: the voltage V_DS5 left for the tail at ICMR− = 0.8 V (using (W/L)₁ from step 4)?', answer: T7.vds5, unit: 'V', tol: 0.02,
          parts: [{ q: 'First M1’s overdrive at $I_5/2$?', answer: T7.vov1, unit: 'V', tol: 0.02, hint: ['$V_{ov1} = \\sqrt{2(I_5/2)/(\\mu_nC_{ox}(W/L)_1)}$'], how: [`$$V_{ov1} = \\sqrt{\\frac{8.8\\,\\mu}{300\\,\\mu\\times${fx(T7.wl1, 3)}}} = ${fx(T7.vov1, 3)}\\,\\text{V}$$`] }],
          hint: ['At the bottom of the range: $V_{in,min} = V_{DS5} + V_{GS1}$, with the largest threshold.', '$V_{DS5} = V_{in,min} - V_{ov1} - V_{th1,max}$'],
          how: ['The input sits one $V_{GS1}$ above the tail node, which needs $V_{DS5}$: $$V_{in,min} = V_{DS5} + V_{ov1} + V_{th1,max}$$', `$$V_{DS5} = 0.8 - ${fx(T7.vov1, 3)} - 0.59 = ${fx(T7.vds5, 3)}\\,\\text{V}$$`] }, say: `VDS5 = ${fx(T7.vds5, 3)} V.` },
      { t: 48, title: '**5 · then size M5** with the full $I_5$ at $V_{ov5} = V_{DS5}$.', tex: `\\left(\\tfrac WL\\right)_5 = \\frac{2I_5}{\\mu_nC_{ox}V_{DS5}^2} = \\frac{2(8.8\\,\\mu)}{300\\,\\mu\\times${fx(T7.vds5, 3)}^2} = ${fx(T7.wl5, 3)}`,
        try: { q: 'Size the tail M5 (it carries I₅, overdrive = V_DS5 from above).', answer: T7.wl5, unit: '', tol: 0.02,
          hint: ['Square law, full $I_5$, with the overdrive at its saturation edge.', '$\\left(\\frac WL\\right)_5 = \\dfrac{2I_5}{\\mu_nC_{ox}V_{DS5}^2}$'],
          how: [`$$\\left(\\frac WL\\right)_5 = \\frac{2(8.8\\,\\mu)}{300\\,\\mu\\times(${fx(T7.vds5, 3)})^2} = ${fx(T7.wl5, 3)}$$`] }, say: `(W/L)5 = ${fx(T7.wl5, 3)}; M6 copies it for I_BIAS = I5.` },
      { t: 56, title: '**6 · zero → $g_{m7}$** (the tutorial’s M7 is the lecture’s M6).', tex: `g_{m7} = 10\\,g_{m1} = ${u3(T7.gm6, 1e-6, 'µS')}`,
        try: { q: 'Step 6: the second-stage transconductance g_m7 that puts the zero at 10·GB?', answer: T7.gm6, unit: 'S', tol: 0.02,
          hint: ['Lecture 18: zero $= g_{m7}/C_c$, GB $= g_{m1}/C_c$.', '$g_{m7} = 10\\,g_{m1}$'],
          how: ['$$g_{m7} = 10\\,g_{m1} = 10\\times82.9\\,\\mu\\text{S} = 829\\,\\mu\\text{S}$$'] }, say: 'gm7 = 829 µS.' },
      { t: 64, title: '**6 · size M7:** same overdrive as M4 (no offset), then its current.', tex: `|V_{ov4}| = \\sqrt{\\frac{I_5}{\\mu_pC_{ox}(W/L)_4}} = ${fx(T7.vov4, 3)}\\,\\text{V},\\; \\left(\\tfrac WL\\right)_7 = \\frac{g_{m7}}{\\mu_pC_{ox}|V_{ov4}|} = ${fx(T7.wl6, 3)}`,
        try: { q: 'Size M7 so that |V_GS7| = |V_GS4| (overdrive of M4 at I₅/2, W/L from step 3).', answer: T7.wl6, unit: '', tol: 0.02,
          parts: [{ q: 'First M4’s overdrive $|V_{ov4}|$?', answer: T7.vov4, unit: 'V', tol: 0.02, hint: ['$\\sqrt{2(I_5/2)/(\\mu_pC_{ox}(W/L)_4)}$ — it is the 0.16 V of step 3.'], how: [`$$|V_{ov4}| = \\sqrt{\\frac{8.8\\,\\mu}{60\\,\\mu\\times${fx(T7.wl3, 3)}}} = ${fx(T7.vov4, 3)}\\,\\text{V}$$`] }],
          hint: ['$g_m = \\mu_pC_{ox}(W/L)|V_{ov}|$ with the same overdrive as M4.', '$\\left(\\frac WL\\right)_7 = \\dfrac{g_{m7}}{\\mu_pC_{ox}|V_{ov4}|}$'],
          how: ['M7’s gate is M4’s drain level, so $|V_{GS7}| = |V_{GS4}|$: same overdrive, 0.16 V.', `$$\\left(\\frac WL\\right)_7 = \\frac{829\\,\\mu}{60\\,\\mu\\times0.16} = ${fx(T7.wl6, 3)}$$`] }, say: `(W/L)7 = ${fx(T7.wl6, 3)}.` },
      { t: 72, title: '**6 · its current** follows from $g_m$ and the overdrive.', tex: `I_7 = \\tfrac12\\,g_{m7}|V_{ov4}| = \\tfrac12(829\\,\\mu)(0.16) = ${u3(T7.i6, 1e-6, 'µA')}`,
        try: { q: 'What current I₇ does M7 then carry?', answer: T7.i6, unit: 'A', tol: 0.02,
          hint: ['$g_m = 2I_D/|V_{ov}|$, turned round.', '$I_7 = \\tfrac12 g_{m7}|V_{ov4}|$'],
          how: [`$$I_7 = \\frac{g_{m7}|V_{ov4}|}{2} = \\frac{829\\,\\mu\\times0.16}{2} = ${fx(T7.i6 * 1e6, 3)}\\,\\mu\\text{A}$$`] }, say: `I7 = ${fx(T7.i6 * 1e6, 3)} µA.` },
      { t: 80, title: '**7 · current ratio → M8.** M8 shares M5’s gate.', tex: `\\left(\\tfrac WL\\right)_8 = \\left(\\tfrac WL\\right)_5\\frac{I_7}{I_5} = ${fx(T7.wl5, 3)}\\times\\frac{${fx(T7.i6 * 1e6, 3)}}{8.8} = ${fx(T7.wl7, 3)}`,
        try: { q: 'Step 7: size the sink M8 (W/L)₈ so it carries I₇ (from above).', answer: T7.wl7, unit: '', tol: 0.02,
          hint: ['M8 mirrors M5: same gate, same overdrive, so size ∝ current.', '$\\left(\\frac WL\\right)_8 = \\left(\\frac WL\\right)_5\\dfrac{I_7}{I_5}$'],
          how: [`$$\\left(\\frac WL\\right)_8 = ${fx(T7.wl5, 3)}\\times\\frac{${fx(T7.i6 * 1e6, 3)}\\,\\mu}{8.8\\,\\mu} = ${fx(T7.wl7, 3)}$$`] }, say: `(W/L)8 = ${fx(T7.wl7, 3)}.` },
      { t: 88, title: '**8 · power check.** $I_{BIAS} = I_5$ through M6, $I_5$ through the pair, $I_7$ through the output.', tex: `P = V_{DD}(I_{BIAS} + I_5 + I_7) = 1.8(8.8 + 8.8 + ${fx(T7.i6 * 1e6, 3)})\\,\\mu = ${u3(T7.pdAll, 1e-6, 'µW')} \\le 300\\,\\mu\\text{W}\\;✓`,
        try: { q: 'Step 8: the total power (bias branch I_BIAS = I₅ included)? Is it within 300 µW?', answer: T7.pdAll, unit: 'W', tol: 0.02,
          hint: ['Every branch from $V_{DD}$ to ground: the bias diode, the tail, the output stage.', '$P = V_{DD}(I_{BIAS} + I_5 + I_7)$'],
          how: [`$$P = 1.8\\times(8.8 + 8.8 + ${fx(T7.i6 * 1e6, 3)})\\,\\mu\\text{A} = ${fx(T7.pdAll * 1e6, 3)}\\,\\mu\\text{W}$$`, 'Well inside 300 µW ✓.'] }, say: `Power ${fx(T7.pdAll * 1e6, 3)} µW: inside the budget.` },
      { t: 96, title: '**8 · PM check** with $\\omega_{p2} = g_{m7}/C_L$ and $\\omega_z = g_{m7}/C_c$.', tex: `\\omega_{p2} = \\frac{829\\,\\mu}{2\\,\\text{p}} = 2.2\\,GB,\\quad PM = 90 - \\tan^{-1}\\frac{1}{2.2} - \\tan^{-1}\\frac{1}{10} = ${fx(T7.pm, 3)}^\\circ`,
        try: { q: 'Step 8: the phase margin of this design (GB = g_m1/C_c, ω_p2 = g_m7/C_L, ω_z = g_m7/C_c)?', answer: T7.pm, unit: '°', tol: 0.01,
          parts: [{ q: 'First $\\omega_{p2}/GB = (g_{m7}/C_L)/(g_{m1}/C_c)$?', answer: T7.p2 / T7.gb, unit: '', tol: 0.02, hint: ['$10\\times C_c/C_L$'], how: ['$$\\frac{\\omega_{p2}}{GB} = \\frac{g_{m7}}{g_{m1}}\\cdot\\frac{C_c}{C_L} = 10\\times0.22 = 2.2$$'] }],
          hint: ['Dominant pole 90°; second pole $\\tan^{-1}(GB/\\omega_{p2})$; zero at 10 GB.', '$PM = 90^\\circ - \\tan^{-1}\\frac{1}{2.2} - \\tan^{-1}\\frac{1}{10}$'],
          how: ['$$PM = 90 - \\tan^{-1}(0.4545) - \\tan^{-1}(0.1) = 90 - 24.4 - 5.7 = 59.8^\\circ$$', 'Essentially 60°: 0.22 is the rounded 0.2216. Use $C_c = 0.45$ pF for a little room.'] }, say: `PM ≈ ${fx(T7.pm, 3)}°: on target.` },
      { t: 106, ans: true, title: `**Answers:** $C_c = 0.44$ pF · $I_5 = 8.8\\,\\mu$A · $(W/L)_{1,2} = ${fx(T7.wl1, 3)}$ · $(W/L)_{3,4} = ${fx(T7.wl3, 3)}$ · $(W/L)_{5,6} = ${fx(T7.wl5, 3)}$ · $(W/L)_7 = ${fx(T7.wl6, 3)}$ · $(W/L)_8 = ${fx(T7.wl7, 3)}$ · $I_7 = ${fx(T7.i6 * 1e6, 3)}\\,\\mu$A · $P = ${fx(T7.pdAll * 1e6, 3)}\\,\\mu$W · PM ≈ 60°. The 60 dB gain needs λ, which the sheet does not give.`, say: 'Every device sized from one spec each. The gain cannot be checked: the sheet gives no λ.' },
    ],
  });
}, { q: 'Tutorial 7 Q1' });

/* ── the page's own spec: CL = 5 pF. The power check fails; bigger M3/M4 fix it. ── */
const L19X = F.l19, L19B = F.l19b, L19F = F.l19fix;
scene(L19, 'Your page’s spec: C_L = 5 pF, and the power check fails', 106, (S) => {
  pyqFrame(S, {
    tag: 'LEC 19 · YOUR PAGE’S EXAMPLE', title: 'Same recipe, bigger load: the power check fails, then the fix', src: 'Lec 19 example (your page)',
    q: '$V_{DD} = 1.8$ V, $A_v = 60$ dB, GBW ≥ 30 MHz, ICMR+ = 1.6 V, ICMR− = 0.8 V, $C_L = 5$ pF, power ≤ 300 µW, SR = 20 V/µs, PM ≥ 60°. Run the recipe and check the power.',
    giv: 'Process as in Tutorial 7: $\\mu_nC_{ox} = 300\\,\\mu$, $\\mu_pC_{ox} = 60\\,\\mu$A/V², $V_{th1}$ = 0.47–0.59 V, $|V_{th3}|_{max}$ = 0.51 V; bias branch $I_{bias} = I_5$. Names as on your page (M6 output PMOS, M7 sink).', qh: 270,
    tests: 'the same eight steps; then what to change when a check fails. Only the load differs from Tutorial 7, and that is enough to break the power budget.',
    fig: (S2) => { const t = twoStageFig(S2, { x: 60, y: 120, sc: 1, caps: true }); return t; },
    steps: [
      { t: 6, title: '**1–6 · the recipe, exactly as in Tutorial 7** (you solved each step there; only $C_L$ changed). The 0.16 V overdrive and $V_{DS5}$ do not change.',
        tex: `C_c = 0.22(5\\,\\text{p}) = 1.1\\,\\text{pF},\\; I_5 = 20\\,\\tfrac{\\text{V}}{\\mu\\text{s}}(1.1\\,\\text{p}) = ${u3(L19X.i5, 1e-6, 'µA')},\\; g_{m1} = 2\\pi(30\\,\\text{M})(1.1\\,\\text{p}) = ${u3(L19X.gm1, 1e-6, 'µS')},\\; g_{m6} = 10g_{m1},\\; I_6 = \\tfrac12 g_{m6}(0.16) = ${u3(L19X.i6, 1e-6, 'µA')}`,
        say: `Same recipe: $C_c$ = 1.1 pF, $I_5$ = 22 µA, $g_{m1}$ = ${fx(L19X.gm1 * 1e6, 3)} µS, and M6 must carry ${fx(L19X.i6 * 1e6, 3)} µA. Now the check.` },
      { t: 16, title: '**8 · power check: it fails.**', tex: `P = 1.8(22 + 22 + ${fx(L19X.i6 * 1e6, 3)})\\,\\mu = ${u3(L19X.pdAll, 1e-6, 'µW')} > 300\\,\\mu\\text{W}\\;✗`,
        try: { q: `Total power with the bias branch? Use $I_{bias} = I_5 = 22\\,\\mu$A and $I_6 = ${fx(L19X.i6 * 1e6, 3)}\\,\\mu$A from the recipe above; compare with 300 µW.`, answer: L19X.pdAll, unit: 'W', tol: 0.02,
          hint: ['Add every branch current and multiply by $V_{DD}$.', '$P = V_{DD}(I_{bias} + I_5 + I_6)$'], how: [`$$P = 1.8\\times(22 + 22 + ${fx(L19X.i6 * 1e6, 3)})\\,\\mu = ${fx(L19X.pdAll * 1e6, 3)}\\,\\mu\\text{W}$$`, 'Over the 300 µW budget ✗.'],
          why: 'The output stage is the culprit: $I_6 = \\tfrac12g_{m6}|V_{ov}|$ grows with the load (through $C_c$, $g_{m1}$, $g_{m6}$).' }, say: `${fx(L19X.pdAll * 1e6, 3)} µW: over budget. Go back.` },
      { t: 26, title: '**The fix:** $g_{m6}$ cannot drop (PM), but its **overdrive** can. A smaller $|V_{ov4}| = |V_{ov6}|$ means wider M3, M4, M6 and less $I_6$.', tex: `I_6 \\le \\frac{300\\,\\mu}{1.8} - 2(22\\,\\mu) = ${u3(L19F.i6max, 1e-6, 'µA')}\\;\\Rightarrow\\; |V_{ov}| \\le \\frac{2I_6}{g_{m6}} = ${fx(L19F.vov, 3)}\\,\\text{V}`,
        try: { q: 'What is the largest overdrive |V_ov4| = |V_ov6| that keeps the power at 300 µW?', answer: L19F.vov, unit: 'V', tol: 0.02,
          parts: [{ q: 'First the largest $I_6$ the budget allows (bias and tail take 22 µA each)?', answer: L19F.i6max, unit: 'A', tol: 0.02, hint: ['$P_{max}/V_{DD} - 2I_5$'], how: [`$$\\frac{300\\,\\mu}{1.8} - 44\\,\\mu = ${fx(L19F.i6max * 1e6, 3)}\\,\\mu\\text{A}$$`] }],
          hint: ['$I_6 = \\tfrac12 g_{m6}|V_{ov}|$ with $g_{m6}$ fixed.', '$|V_{ov}| = \\dfrac{2I_{6,max}}{g_{m6}}$'], how: [`$$|V_{ov}| \\le \\frac{2\\times${fx(L19F.i6max * 1e6, 3)}\\,\\mu}{2.07\\,\\text{m}} = ${fx(L19F.vov, 3)}\\,\\text{V}$$`] }, say: `|Vov| at most ${fx(L19F.vov, 3)} V.` },
      { t: 36, title: '**…so M3, M4 get wider** than the ICMR+ minimum (this only improves ICMR+).', tex: `\\left(\\tfrac WL\\right)_3 = \\frac{I_5}{\\mu_pC_{ox}|V_{ov}|^2} = ${fx(L19F.wl3, 3)}\\;\\to\\;${Math.ceil(L19F.wl3)},\\quad P = ${u3(L19B.pdAll, 1e-6, 'µW')}\\;✓`,
        try: { q: 'The new (W/L)₃ = (W/L)₄ for that overdrive (I₅ = 22 µA)?', answer: L19F.wl3, unit: '', tol: 0.02,
          hint: ['Square law for M3 at $I_5/2$ with the new overdrive.', '$\\left(\\frac WL\\right)_3 = \\dfrac{I_5}{\\mu_pC_{ox}|V_{ov}|^2}$'], how: [`$$\\left(\\frac WL\\right)_3 = \\frac{22\\,\\mu}{60\\,\\mu\\times${fx(L19F.vov, 3)}^2} = ${fx(L19F.wl3, 3)}$$`, `Round up to ${Math.ceil(L19F.wl3)}: then $I_6 = ${fx(L19B.i6 * 1e6, 3)}\\,\\mu$A and $P = ${fx(L19B.pdAll * 1e6, 3)}\\,\\mu$W ✓. A smaller $|V_{GS3}|$ also raises the ICMR+.`],
          why: 'When a check fails, change a choice that the failing quantity depends on but the satisfied specs do not: here the overdrive, not $g_{m6}$ or $C_c$.' }, say: `(W/L)3,4 ≈ ${Math.ceil(L19F.wl3)}: power ${fx(L19B.pdAll * 1e6, 3)} µW.` },
      { t: 46, ans: true, title: `**Result:** $C_c = 1.1$ pF, $I_5 = 22\\,\\mu$A, $(W/L)_{3,4} = ${Math.ceil(L19F.wl3)}$, $(W/L)_6 = ${fx(L19B.wl6, 3)}$, $I_6 = ${fx(L19B.i6 * 1e6, 3)}\\,\\mu$A, $(W/L)_7 = ${fx(L19B.wl7, 3)}$, $P = ${fx(L19B.pdAll * 1e6, 3)}\\,\\mu$W. Design is iteration: the recipe gives a first try, the checks decide.`, say: 'Same recipe; one failed check; one choice changed. That is how Lecture 19’s procedure is used in practice.' },
    ],
  });
}, { q: 'Lec 19 example' });

scene(L19, 'Lecture 19 in one card', 30, (S) => {
  header(S, 'LEC 19 · CARD', 'The recipe');
  remember(S, ['$C_c = 0.22C_L$ → $I_5 = SR\\cdot C_c$ → $(W/L)_3 = \\dfrac{I_5}{\\mu_pC_{ox}[V_{DD} - V_{in,max} - |V_{th3}|_{max} + V_{th1,min}]^2}$',
    '$g_{m1} = 2\\pi GBW\\,C_c$ → $(W/L)_1 = g_{m1}^2/(\\mu_nC_{ox}I_5)$',
    '$V_{DS5} = V_{in,min} - \\sqrt{I_5/(\\mu_nC_{ox}(W/L)_1)} - V_{th1,max}$ → $(W/L)_5 = 2I_5/(\\mu_nC_{ox}V_{DS5}^2)$',
    '$g_{m6} = 10g_{m1}$, $|V_{ov6}| = |V_{ov4}|$ → $(W/L)_6 = g_{m6}/(\\mu_pC_{ox}|V_{ov4}|)$, $I_6 = \\tfrac12g_{m6}|V_{ov4}|$ → $(W/L)_7 = (W/L)_5I_6/I_5$',
    'Check $P = V_{DD}(I_{bias} + I_5 + I_6)$, PM, gain. Too much power: lower $|V_{ov4,6}|$ (wider M3, M4, M6).',
    'Nulling resistor: $\\omega_z = 1/(C_c(1/g_{m6} - R_z))$; $R_z = 1/g_{m6}$ removes the zero.'], 0.4, 'Lecture 19 in one card');
  S.say(0.4, 'The whole procedure on one card, with the two fixes: shrink the overdrive when the power is too high, and add $R_z = 1/g_{m6}$ to remove the zero.');
}, { recall: ['C c is 0.22 C L, then I 5 is S R times C c.', 'g m 1 is two pi G B W times C c.', 'g m 6 is ten g m 1, with the same overdrive as M 4.', 'R z equals one over g m 6 removes the zero.'] });
