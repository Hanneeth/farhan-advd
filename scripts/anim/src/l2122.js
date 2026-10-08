/* Lesson F: Lectures 21–22 — the resistive-load inverter worked out completely (V_OH, V_OL, V_IL, V_IH, V_th, power),
   the CMOS inverter, Tutorial 7 Q2–Q3, and a preview of the CMOS VTC (inverter tutorial Q4, compre 2024-25 Q4(b)).
   Numbers: R21 (lecture example, l20.js), F.q2, F.q3, F.c4 (f_num.js). */
'use strict';
const L21 = 'Lec 21–22 · Resistive-load inverter';
const LCP = 'Preview · CMOS inverter VTC';
const XC = 'Exam-style check';
const G21 = '$V_{DD} = 5$ V, $V_{T0} = 1$ V, $k_n = \\mu_nC_{ox}\\frac{W}{L} = 100\\,\\mu$A/V², $R_L = 50$ kΩ';

scene(L21, 'Follow the current: the resistive-load inverter', 50, (S) => {
  header(S, 'LEC 21 · FOLLOW THE CURRENT', 'One branch: V_DD → R_L → M1 → ground. Whatever flows in R_L flows in M1.');
  const g = rInvFig(S, 360, 180); S.draw(g, 0.3, 1.8);
  S.say(0.3, 'The resistive-load inverter: a resistor $R_L$ from $V_{DD}$ to the output, and the NMOS driver M1 from the output to ground.');
  current(S, [[360, 190], [360, 470]], 5, null, 'I_RL = I_D1', { color: C.cur, at: [500, 260] });
  eqAt(S, 'I_{R_L} = \\frac{V_{DD} - V_{out}}{R_L} = I_{D1}(V_{in}, V_{out})', 1060, 300, 8, { size: 32, w: 860 });
  S.say(5, 'There is no other path: the current through $R_L$ is the drain current of M1. That single equation — resistor current equals transistor current — gives every point of the VTC.');
  whyBox(S, 640, 400, 840, 160, '**The whole of Lec 21–22:** write $\\frac{V_{DD} - V_{out}}{R_L} = I_{D1}$ with the right equation for M1 (cutoff, saturation or triode), then add the condition that defines each voltage.', 16);
  S.say(16, 'Every critical voltage comes from that equation, with M1 in the right region, plus one extra condition: a slope of −1, or $V_{in} = V_{out}$.');
  S.stop(30, {
    src: XC,
    q: 'V_DD = 5 V, R_L = 50 kΩ, and the output sits at 1 V. How much current flows through M1?',
    hint: ['Whatever flows in $R_L$ flows in M1.', '$I_{D1} = \\dfrac{V_{DD} - V_{out}}{R_L}$'],
    how: ['$$I_{D1} = \\frac{5 - 1}{50\\,\\text{k}} = 80\\,\\mu\\text{A}$$'],
    answer: 80e-6, unit: 'A', tol: 0.02,
  });
});

scene(L21, 'Three regions as V_in rises', 80, (S) => {
  header(S, 'LEC 21 · REGIONS', 'Cutoff, then saturation, then triode: watch M1 change as the input rises');
  const g = rInvFig(S, 240, 180); S.fade(g, 0.3, 0.6);
  const F = vtcFrame(S, 640, 180, 520, 520, 5); F.g.style.opacity = 0; S.fade(F.g, 0.3, 0.6);
  const vtc = (v) => FN.rInvVout(P21, v);
  const bnd = S.el('polyline', { points: ptsOf(40, 1, 5, (v) => [F.X(v), F.Y(v - 1)]), fill: 'none', stroke: C.amb, 'stroke-width': 2, 'stroke-dasharray': '7 6' }); bnd.style.opacity = 0; S.fade(bnd, 30, 0.5);
  label(S, F.X(4.6), F.Y(3.6) - 8, 'V_out = V_in − V_T0', 30, { size: 17, color: C.amb, weight: 700, anchor: 'end' });
  const tr = liveLine(S, C.volt, 4), dt = S.el('circle', { r: 8, fill: C.cur });
  const st = txt(S, 240, 600, '', { size: 24, color: C.text, weight: 800, anchor: 'middle' });
  const vi = txt(S, 240, 640, '', { size: 19, color: C.muted, anchor: 'middle', mono: true });
  S.anim(4, 40, 'sweep', (p) => {
    const v = 5 * p, vo = vtc(v);
    tr.setAttribute('points', ptsOf(160, 0, Math.max(v, 0.001), (u) => [F.X(u), F.Y(vtc(u))])); dt.setAttribute('cx', F.X(v)); dt.setAttribute('cy', F.Y(vo));
    const reg = v <= 1 ? ['CUTOFF: V_in < V_T0', C.muted] : vo >= v - 1 ? ['SATURATION', C.ok] : ['TRIODE', C.p];
    st.textContent = reg[0]; st.setAttribute('fill', reg[1]); vi.textContent = `V_in = ${v.toFixed(2)} V   V_out = ${vo.toFixed(2)} V`;
  }, E.lin);
  S.say(0.3, 'Sweep the input from 0 to 5 V and watch the driver.');
  S.say(4, 'Below the threshold M1 is off: no current, no drop across $R_L$, the output sits at $V_{DD}$.');
  S.say(14, 'Past $V_{T0}$, M1 turns on in saturation: its current grows with the square of the overdrive, the drop across $R_L$ grows, the output falls fast.');
  S.say(30, 'Saturation needs $V_{out} \\ge V_{in} - V_{T0}$: the dashed line. Where the curve crosses it, M1 enters triode, and the output flattens near the bottom.');
  const tb = html(S, 1200, 240, 360, 300, `<div class="whybox"><b>Your page</b><br>${rt('1. $V_{in} < V_{T0}$: cutoff<br>2. $V_{T0} < V_{in} < V_{out} + V_{T0}$: saturation<br>3. $V_{in} > V_{out} + V_{T0}$: triode')}</div>`);
  tb.style.opacity = 0; S.slideIn(tb, 44, 0.6);
  S.say(44, 'Your page’s three regions, as inequalities.');
  S.stop(56, {
    src: XC,
    q: 'V_in = 3 V and the output is 0.5 V (V_T0 = 1 V). Which region is M1 in?',
    choices: ['Triode: $V_{in} > V_{out} + V_{T0}$', 'Saturation', 'Cutoff'], answer: 0,
    hint: ['Compare $V_{in}$ with $V_{out} + V_{T0}$.', '$3 > 0.5 + 1$?'],
    how: ['$V_{out} + V_{T0} = 0.5 + 1 = 1.5$ V, and $V_{in} = 3 > 1.5$: the drain is too low for saturation.', 'So M1 is in triode.'],
  });
});

scene(L21, 'V_OH and V_OL: off, and fully on', 92, (S) => {
  header(S, 'LEC 21 · V_OH AND V_OL', 'V_OH: M1 off. V_OL: input = V_OH, M1 in triode, a quadratic in V_OL');
  pagePeek(S, 'n21b', 1180, 120, 330, 545, 0.4, 14);
  eqAt(S, 'V_{in} < V_{T0}:\\; I_{R_L} = \\frac{V_{DD} - V_{out}}{R_L} = 0 \\;\\Rightarrow\\; V_{OH} = V_{DD}', 560, 190, 0.4, { size: 28, w: 1040 });
  S.say(0.4, '$V_{OH}$ first, and it is free: with M1 off no current flows, so nothing drops across $R_L$: $V_{OH} = V_{DD}$.');
  eqAt(S, 'V_{in} = V_{OH} = V_{DD}:\\quad \\frac{V_{DD} - V_{OL}}{R_L} = \\frac{k_n}{2}\\left[2(V_{DD} - V_{T0})V_{OL} - V_{OL}^2\\right]', 560, 290, 8, { size: 26, w: 1040 });
  S.say(8, '$V_{OL}$: the input is the previous gate’s $V_{OH} = V_{DD}$. The output is low, so M1 is in triode. Resistor current equals the triode current.');
  eqAt(S, 'V_{OL}^2 - 2\\left(V_{DD} - V_{T0} + \\frac{1}{k_nR_L}\\right)V_{OL} + \\frac{2V_{DD}}{k_nR_L} = 0', 560, 390, 16, { size: 26, w: 1040 });
  S.say(16, 'Multiply out and collect: a quadratic in $V_{OL}$, exactly as on your page.');
  eqAt(S, 'V_{OL} = V_{DD} - V_{T0} + \\frac{1}{k_nR_L} - \\sqrt{\\left(V_{DD} - V_{T0} + \\frac{1}{k_nR_L}\\right)^2 - \\frac{2V_{DD}}{k_nR_L}}', 560, 500, 24, { size: 26, w: 1040, h: 110, color: '#ffd38a' });
  S.say(24, 'Take the smaller root (the larger one would exceed $V_{DD}$). Notice everything depends on one product, $k_nR_L$.');
  whyBox(S, 120, 600, 900, 120, '**One number does it:** $k_nR_L$. Bigger $R_L$ or a wider M1 → smaller $V_{OL}$ → bigger $NM_L$, at the cost of area or speed.', 30);
  S.stop(40, {
    src: XC,
    q: `${G21}. What is V_OL?`,
    hint: ['Compute $k_nR_L$ first, then the bracket $a = V_{DD} - V_{T0} + 1/(k_nR_L)$, then the smaller root.', '$V_{OL} = a - \\sqrt{a^2 - \\dfrac{2V_{DD}}{k_nR_L}}$'],
    how: ['$$k_nR_L = (100\\,\\mu)(50\\,\\text{k}) = 5\\,\\text{V}^{-1}$$', '$$a = 5 - 1 + \\frac15 = 4.2\\,\\text{V}$$', '$$V_{OL} = 4.2 - \\sqrt{4.2^2 - \\frac{2\\times5}{5}} = 4.2 - \\sqrt{15.64} = 0.245\\,\\text{V}$$'],
    parts: [{ q: 'First the product $k_nR_L$ (in V⁻¹)?', answer: R21.k, unit: '', tol: 0.02, hint: ['$100\\,\\mu\\text{A/V}^2\\times50\\,\\text{k}\\Omega$'], how: ['$$k_nR_L = 100\\times10^{-6}\\times50\\times10^{3} = 5$$'] },
      { q: 'Then the bracket $a = V_{DD} - V_{T0} + 1/(k_nR_L)$?', answer: R21.a, unit: 'V', tol: 0.02, hint: ['$5 - 1 + 1/5$'], how: ['$$a = 4.2\\,\\text{V}$$'] }],
    answer: R21.vol, unit: 'V', tol: 0.02,
    calc: [{ what: 'Store a, then the root', keys: '4.2 [VARIABLE] ▸ A ▸ Store; [SHIFT][4] − [√] ( [SHIFT][4] [x²] − 2 × 5 ÷ 5 ) [EXE]', shows: '0.2453' }],
  });
});

scene(L21, 'V_IL: the first slope of −1', 84, (S) => {
  header(S, 'LEC 22 · V_IL', 'M1 just on, in saturation: differentiate, set the slope to −1');
  pagePeek(S, 'n22', 1180, 120, 330, 464, 0.4, 14);
  eqAt(S, '\\frac{V_{DD} - V_{out}}{R_L} = \\frac{k_n}{2}(V_{in} - V_{T0})^2', 560, 190, 0.4, { size: 30, w: 1040 });
  S.say(0.4, 'Near $V_{IL}$ the output is still high, so M1 is in saturation.');
  eqAt(S, '-\\frac{1}{R_L}\\frac{dV_{out}}{dV_{in}} = k_n(V_{in} - V_{T0})', 560, 290, 8, { size: 30, w: 1040 });
  S.say(8, 'Differentiate both sides with respect to $V_{in}$: the left side gives $-\\frac{1}{R_L}\\frac{dV_{out}}{dV_{in}}$.');
  eqAt(S, '\\frac{dV_{out}}{dV_{in}} = -1:\\quad V_{IL} = V_{T0} + \\frac{1}{k_nR_L}', 560, 390, 16, { size: 30, w: 1040, color: '#ffd38a' });
  S.say(16, 'Set the slope to −1: $\\frac{1}{R_L} = k_n(V_{IL} - V_{T0})$, so $V_{IL} = V_{T0} + 1/(k_nR_L)$. Just one step above threshold.');
  eqAt(S, 'V_{out}\\big|_{V_{IL}} = V_{DD} - \\frac{1}{2k_nR_L}', 560, 490, 24, { size: 30, w: 1040 });
  S.say(24, 'Put it back into the saturation equation and the output there is $V_{DD} - 1/(2k_nR_L)$: still almost at the top.');
  S.stop(36, {
    src: XC,
    q: `${G21}. What is V_IL?`,
    hint: ['One step above threshold, the size of the step set by $k_nR_L$.', '$V_{IL} = V_{T0} + \\dfrac{1}{k_nR_L}$'],
    how: ['$k_nR_L = 5$ V⁻¹ (from the $V_{OL}$ question).', '$$V_{IL} = 1 + \\frac15 = 1.2\\,\\text{V}$$'],
    answer: R21.vil, unit: 'V', tol: 0.02,
  });
  S.stop(44, {
    src: XC,
    q: 'And the output voltage at V_in = V_IL?',
    hint: ['Saturation equation at $V_{IL}$.', '$V_{out} = V_{DD} - \\dfrac{1}{2k_nR_L}$'],
    how: ['$$V_{out} = 5 - \\frac{1}{2\\times5} = 4.9\\,\\text{V}$$', 'Tutorial 5 (CMOS, 2024-25) calls this the worst-case $V_{OH}$.'],
    answer: R21.voutVil, unit: 'V', tol: 0.02,
  });
});

scene(L21, 'V_IH: the second slope of −1', 92, (S) => {
  header(S, 'LEC 22 · V_IH', 'Now M1 is in triode: differentiate again, then solve the pair');
  pagePeek(S, 'n22', 1180, 120, 330, 464, 0.4, 14);
  eqAt(S, '\\frac{V_{DD} - V_{out}}{R_L} = \\frac{k_n}{2}\\left[2(V_{in} - V_{T0})V_{out} - V_{out}^2\\right]', 560, 190, 0.4, { size: 28, w: 1040 });
  S.say(0.4, 'Near $V_{IH}$ the output is low: triode.');
  eqAt(S, '\\frac{dV_{out}}{dV_{in}} = -1:\\quad V_{IH} = V_{T0} + 2V_{out} - \\frac{1}{k_nR_L}', 560, 290, 8, { size: 28, w: 1040 });
  S.say(8, 'Differentiate (product rule on the $V_{in}V_{out}$ term), put the slope to −1, and your page gets $V_{IH} = V_{T0} + 2V_{out} - 1/(k_nR_L)$. One equation, two unknowns.');
  eqAt(S, '\\text{back in the triode line:}\\quad V_{out} = \\sqrt{\\frac{2V_{DD}}{3k_nR_L}}', 560, 390, 18, { size: 28, w: 1040 });
  S.say(18, 'Substitute that $V_{IH}$ back into the triode equation; the terms collapse to $\\frac32k_nR_LV_{out}^2 = V_{DD}$, so $V_{out} = \\sqrt{2V_{DD}/(3k_nR_L)}$.');
  eqAt(S, 'V_{IH} = V_{T0} + \\sqrt{\\frac{8V_{DD}}{3k_nR_L}} - \\frac{1}{k_nR_L}', 560, 490, 26, { size: 30, w: 1040, color: '#ffd38a' });
  S.say(26, 'And $V_{IH} = V_{T0} + \\sqrt{8V_{DD}/(3k_nR_L)} - 1/(k_nR_L)$, boxed on your page.');
  S.stop(38, {
    src: XC,
    q: `${G21}. What is V_IH?`,
    hint: ['First the output at $V_{IH}$, then $V_{IH} = V_{T0} + 2V_{out} - 1/(k_nR_L)$.', '$V_{out} = \\sqrt{\\dfrac{2V_{DD}}{3k_nR_L}}$'],
    how: ['$$V_{out} = \\sqrt{\\frac{2\\times5}{3\\times5}} = 0.816\\,\\text{V}$$', '$$V_{IH} = 1 + 2(0.816) - \\frac15 = 2.433\\,\\text{V}$$'],
    parts: [{ q: 'First the output voltage at $V_{IH}$?', answer: R21.voutVih, unit: 'V', tol: 0.02, hint: ['$\\sqrt{2V_{DD}/(3k_nR_L)}$ with $k_nR_L = 5$.'], how: ['$$\\sqrt{10/15} = 0.816\\,\\text{V}$$'] }],
    answer: R21.vih, unit: 'V', tol: 0.02,
  });
});

scene(L21, 'V_th: where the output equals the input', 70, (S) => {
  header(S, 'LEC 22 · V_th', 'At V_in = V_out the driver is saturated: one quadratic');
  eqAt(S, '\\frac{V_{DD} - V_{th}}{R_L} = \\frac{k_n}{2}(V_{th} - V_{T0})^2', 560, 200, 0.4, { size: 30, w: 1040 });
  S.say(0.4, 'At the switching threshold $V_{in} = V_{out} = V_{th}$, so $V_{DS} = V_{GS}$ and M1 is in saturation (always, since $V_{DS} \\ge V_{GS} - V_{T0}$).');
  eqAt(S, 'u = V_{th} - V_{T0}:\\quad \\frac{k_nR_L}{2}u^2 + u - (V_{DD} - V_{T0}) = 0 \\;\\Rightarrow\\; u = \\frac{-1 + \\sqrt{1 + 2k_nR_L(V_{DD} - V_{T0})}}{k_nR_L}', 560, 310, 10, { size: 24, w: 1040, color: '#ffd38a' });
  S.say(10, 'Call the overdrive $u$: it is a quadratic, and the positive root gives $V_{th} = V_{T0} + u$.');
  S.stop(24, {
    src: XC,
    q: `${G21}. What is the switching threshold V_th?`,
    hint: ['Solve for the overdrive u with the positive root, then add $V_{T0}$.', '$u = \\dfrac{-1 + \\sqrt{1 + 2k_nR_L(V_{DD} - V_{T0})}}{k_nR_L}$'],
    how: ['$$u = \\frac{-1 + \\sqrt{1 + 2(5)(4)}}{5} = \\frac{-1 + 6.403}{5} = 1.081\\,\\text{V}$$', '$$V_{th} = 1 + 1.081 = 2.081\\,\\text{V}$$'],
    parts: [{ q: 'First the overdrive $u = V_{th} - V_{T0}$?', answer: R21.vth - 1, unit: 'V', tol: 0.02, hint: ['Positive root of the quadratic.'], how: ['$$u = 1.081\\,\\text{V}$$'] }],
    answer: R21.vth, unit: 'V', tol: 0.02,
  });
  whyBox(S, 120, 420, 1000, 140, '**Check the picture:** $V_{IL} = 1.2 < V_{th} = 2.08 < V_{IH} = 2.43$ V, and $V_{th}$ is below $V_{DD}/2$: this inverter switches early. A larger $k_nR_L$ pushes it lower still.', 25);
});

scene(L21, 'Power, and the price of the resistor', 66, (S) => {
  header(S, 'LEC 22 · POWER AND AREA', 'Big R_L saves power and V_OL, but a resistor is huge on silicon');
  pagePeek(S, 'n22', 1180, 120, 330, 464, 0.4, 12);
  eqAt(S, 'P_D = \\frac{V_{DD}}{2}\\left[I_{DC}(V_{in} = 0) + I_{DC}(V_{in} = 1)\\right] = \\frac{V_{DD}}{2}\\cdot\\frac{V_{DD} - V_{OL}}{R_L}', 560, 200, 0.4, { size: 28, w: 1040 });
  S.say(0.4, 'Your page ends Lecture 22 with the power: zero current with the input low, $(V_{DD} - V_{OL})/R_L$ with it high, averaged.');
  // a meander resistor next to a transistor
  const m = S.g(); const r = S.into(m);
  S.el('polyline', { points: '220,330 220,560 270,560 270,360 320,360 320,560 370,560 370,360 420,360 420,560 470,560 470,330', fill: 'none', stroke: C.amb, 'stroke-width': 10, 'stroke-linejoin': 'round' });
  txt(S, 345, 610, 'a 50 kΩ poly resistor: a long meander', { size: 18, color: C.amb, anchor: 'middle', weight: 700 });
  S.el('rect', { x: 600, y: 430, width: 40, height: 30, fill: C.n, 'fill-opacity': 0.6, stroke: C.n }); txt(S, 620, 490, 'M1', { size: 18, color: C.n, anchor: 'middle', weight: 700 });
  r(); m.style.opacity = 0; S.fade(m, 10, 0.6);
  S.say(10, 'And the area: a resistor of tens of kilo-ohms is a long meander of polysilicon, many times the size of the transistor next to it. That, plus the static current, is why the resistive load was replaced.');
  S.stop(26, {
    src: XC,
    q: `${G21}; from the earlier stop V_OL = 0.245 V. What is the average static power?`,
    hint: ['Only the low-output state draws current.', '$P_D = \\dfrac{V_{DD}}{2}\\cdot\\dfrac{V_{DD} - V_{OL}}{R_L}$'],
    how: ['$$\\frac{5 - 0.245}{50\\,\\text{k}} = 95.1\\,\\mu\\text{A}$$', '$$P_D = 2.5\\times95.1\\,\\mu = 238\\,\\mu\\text{W}$$'],
    answer: R21.pd, unit: 'W', tol: 0.02,
  });
});

scene(L21, 'The CMOS inverter: no resistor, no static current', 70, (S) => {
  header(S, 'LEC 22 · CMOS', 'Replace R_L by a PMOS driven by the same input: one device is always off');
  const g = S.g(); const r = S.into(g);
  rail(S, 280, 440, 170, 'V_DD'); pmos(S, 360, 240, { name: 'PMOS', gate: '', gl: 40 }); wire(S, [[360, 170], [360, 190]]);
  wire(S, [[360, 290], [360, 380]]); dot(S, 360, 335); wire(S, [[360, 335], [470, 335]]); txt(S, 480, 342, 'V_out', { size: 21, color: C.cur, weight: 700 });
  nmos(S, 360, 430, { name: 'NMOS', gate: '', gl: 40 }); gnd(S, 360, 480);
  wire(S, [[290, 240], [250, 240], [250, 430], [290, 430]], { color: C.volt }); dot(S, 250, 335); wire(S, [[180, 335], [250, 335]], { color: C.volt }); txt(S, 170, 342, 'V_in', { size: 21, color: C.volt, weight: 700, anchor: 'end' });
  r(); S.draw(g, 0.3, 1.8);
  S.say(0.3, 'Your page’s last circuit: the CMOS inverter, complementary MOS. The load is now a PMOS whose gate is the same input.');
  label(S, 560, 260, 'V_in = 0: PMOS on, NMOS off → V_out = V_DD', 8, { size: 21, color: C.ok, weight: 700 });
  label(S, 560, 320, 'V_in = V_DD: PMOS off, NMOS on → V_out = 0', 14, { size: 21, color: C.bad, weight: 700 });
  S.say(8, 'Input low: the PMOS is on and the NMOS off. The output is pulled all the way to $V_{DD}$, with no current.');
  S.say(14, 'Input high: the opposite. The output goes all the way to 0, again with no steady current.');
  whyBox(S, 560, 380, 940, 170, '**Three wins at once:** $V_{OH} = V_{DD}$, $V_{OL} = 0$ exactly (full swing, bigger noise margins), no static power, and no resistor. On silicon the PMOS sits in an **n-well** inside the p-type substrate (your page’s cross-section).', 22);
  S.say(22, 'So CMOS gives the full swing, no static power and no resistor. The price is a second device type: the PMOS needs its own n-type well.');
  S.stop(36, {
    src: XC,
    q: 'What is V_OL of a CMOS inverter with V_DD = 3.3 V (input at V_DD)?',
    hint: ['With the input high, which device is off, and what does that mean for the current?', 'No current: no drop across the NMOS.'],
    how: ['Input at $V_{DD}$: the PMOS is off, so no steady current flows.', 'With zero current the on NMOS has zero $V_{DS}$: $$V_{OL} = 0\\,\\text{V}$$'],
    answer: 0, unit: 'V', tol: 0, abs: 0.01,
  });
});

scene(L21, 'Lectures 21–22 in one card', 30, (S) => {
  header(S, 'LEC 21–22 · CARD', 'The resistive-load inverter on one card');
  remember(S, ['One equation: $\\dfrac{V_{DD} - V_{out}}{R_L} = I_{D1}$, M1 in the right region. Everything depends on $k_nR_L$.',
    '$V_{OH} = V_{DD}$ · $V_{OL} = a - \\sqrt{a^2 - \\frac{2V_{DD}}{k_nR_L}}$, $a = V_{DD} - V_{T0} + \\frac{1}{k_nR_L}$',
    '$V_{IL} = V_{T0} + \\frac{1}{k_nR_L}$ (output $V_{DD} - \\frac{1}{2k_nR_L}$)',
    '$V_{IH} = V_{T0} + \\sqrt{\\frac{8V_{DD}}{3k_nR_L}} - \\frac{1}{k_nR_L}$ (output $\\sqrt{\\frac{2V_{DD}}{3k_nR_L}}$)',
    '$V_{th}$: $\\frac{k_nR_L}{2}u^2 + u - (V_{DD} - V_{T0}) = 0$, $V_{th} = V_{T0} + u$ · $P_D = \\frac{V_{DD}}{2}\\cdot\\frac{V_{DD} - V_{OL}}{R_L}$',
    'CMOS: full swing, no static current, no resistor.'], 0.4, 'Lectures 21–22 in one card');
  S.say(0.4, 'One equation, one product $k_nR_L$, five boxed results, the power, and why CMOS replaced it all.');
}, { recall: ['V I L is V T zero plus one over k n R L.', 'V I H is V T zero plus root of eight V D D over three k n R L, minus one over k n R L.', 'The power is V D D over two times V D D minus V O L, over R L.'] });

/* ── Tutorial 7 Q2, Q3 ── */
const Q2 = F.q2, Q3 = F.q3;
scene(L21, 'Tutorial 7 Q2: every critical voltage and both margins', 96, (S) => {
  pyqFrame(S, {
    paper: 't7q23', intro: 7, tag: 'LEC 21–22 · TUTORIAL 7', title: 'Critical voltages and noise margins', src: 'Tutorial 7 Q2',
    q: 'Resistive-load inverter: $V_{DD} = 5$ V, $k_n\' = 20\\,\\mu$A/V², $V_{T0} = 0.8$ V, $R_L = 200$ kΩ, $W/L = 2$. Find $V_{OL}$, $V_{OH}$, $V_{IL}$, $V_{IH}$ and the noise margins.', qh: 200,
    tests: 'the five boxed results of Lec 21–22, all through one number, $k_nR_L$ (careful: $k_n = k_n\'\\cdot W/L$).',
    fig: (S2) => { const g = rInvFig(S2, 380, 220); return g; },
    steps: [
      { t: 6, title: '**$k_nR_L$ first.** The sheet gives the process $k_n\'$; the device is twice that.', tex: 'k_n = k_n\'\\frac{W}{L} = 40\\,\\mu\\text{A/V}^2,\\quad k_nR_L = (40\\,\\mu)(200\\,\\text{k}) = 8\\,\\text{V}^{-1}',
        try: { q: 'First the product k_n·R_L (with k_n = k′_n·W/L), in V⁻¹?', answer: Q2.k, unit: '', tol: 0.02,
          hint: ['$k_n\'$ is per square; multiply by $W/L$ first.', '$k_nR_L = k_n\'\\frac WL R_L$'], how: ['$$k_n = 20\\,\\mu\\times2 = 40\\,\\mu\\text{A/V}^2$$', '$$k_nR_L = 40\\,\\mu\\times200\\,\\text{k} = 8\\,\\text{V}^{-1}$$'] }, say: 'kn RL = 8 per volt.' },
      { t: 13, title: '**$V_{OH}$ and $V_{OL}$.** M1 off; then M1 in triode with $V_{in} = V_{DD}$.', tex: `V_{OH} = 5\\,\\text{V},\\quad a = 5 - 0.8 + \\tfrac18 = 4.325,\\quad V_{OL} = 4.325 - \\sqrt{4.325^2 - \\tfrac{10}{8}} = ${fx(Q2.vol, 3)}\\,\\text{V}`,
        try: { q: 'V_OL? (V_OH = V_DD = 5 V)', answer: Q2.vol, unit: 'V', tol: 0.02,
          parts: [{ q: 'The bracket $a = V_{DD} - V_{T0} + 1/(k_nR_L)$?', answer: Q2.a, unit: 'V', tol: 0.01, hint: ['$5 - 0.8 + 1/8$'], how: ['$$a = 4.325\\,\\text{V}$$'] }],
          hint: ['Smaller root of the quadratic.', '$V_{OL} = a - \\sqrt{a^2 - 2V_{DD}/(k_nR_L)}$'], how: ['$$V_{OL} = 4.325 - \\sqrt{18.706 - 1.25} = 4.325 - 4.178 = 0.147\\,\\text{V}$$'] }, say: `VOL = ${fx(Q2.vol, 3)} V.` },
      { t: 21, title: '**$V_{IL}$** (saturation, slope −1).', tex: `V_{IL} = V_{T0} + \\frac{1}{k_nR_L} = 0.8 + 0.125 = ${fx(Q2.vil, 3)}\\,\\text{V}`,
        try: { q: 'V_IL?', answer: Q2.vil, unit: 'V', tol: 0.02, hint: ['One step $1/(k_nR_L)$ above threshold.', '$V_{IL} = V_{T0} + 1/(k_nR_L)$'], how: ['$$V_{IL} = 0.8 + \\frac18 = 0.925\\,\\text{V}$$'] }, say: 'VIL = 0.925 V.' },
      { t: 28, title: '**$V_{IH}$** (triode, slope −1).', tex: `V_{out} = \\sqrt{\\frac{2(5)}{3(8)}} = ${fx(Q2.voutVih, 3)},\\quad V_{IH} = 0.8 + 2(${fx(Q2.voutVih, 3)}) - 0.125 = ${fx(Q2.vih, 4)}\\,\\text{V}`,
        try: { q: 'V_IH?', answer: Q2.vih, unit: 'V', tol: 0.02,
          parts: [{ q: 'First the output at $V_{IH}$, $\\sqrt{2V_{DD}/(3k_nR_L)}$?', answer: Q2.voutVih, unit: 'V', tol: 0.02, hint: ['$\\sqrt{10/24}$'], how: ['$$\\sqrt{10/24} = 0.645\\,\\text{V}$$'] }],
          hint: ['$V_{IH} = V_{T0} + 2V_{out} - 1/(k_nR_L)$.'], how: ['$$V_{IH} = 0.8 + 2(0.645) - 0.125 = 1.966\\,\\text{V}$$'] }, say: 'VIH = 1.966 V.' },
      { t: 36, title: '**Noise margins.**', tex: `NM_L = 0.925 - ${fx(Q2.vol, 3)} = ${fx(Q2.nml, 3)}\\,\\text{V},\\quad NM_H = 5 - ${fx(Q2.vih, 4)} = ${fx(Q2.nmh, 4)}\\,\\text{V}`,
        try: { q: 'NM_L (from V_IL and V_OL above)?', answer: Q2.nml, unit: 'V', tol: 0.02, hint: ['$NM_L = V_{IL} - V_{OL}$'], how: ['$$NM_L = 0.925 - 0.147 = 0.778\\,\\text{V}$$', '$NM_H = V_{OH} - V_{IH} = 5 - 1.966 = 3.034$ V.'] }, say: 'NML = 0.778 V, NMH = 3.034 V: the answer key’s values.' },
      { t: 44, ans: true, title: `**Answers (match the key):** $V_{OL} = ${fx(Q2.vol, 3)}$ V · $V_{OH} = 5$ V · $V_{IL} = ${fx(Q2.vil, 3)}$ V · $V_{IH} = ${fx(Q2.vih, 4)}$ V · $NM_L = ${fx(Q2.nml, 3)}$ V · $NM_H = ${fx(Q2.nmh, 4)}$ V`, say: 'All six, from one product.' },
    ],
  });
}, { q: 'Tutorial 7 Q2' });

scene(L21, 'Tutorial 7 Q3: design W/L for V_OL = 0.6 V', 92, (S) => {
  pyqFrame(S, {
    paper: 't7q23', intro: 6, tag: 'LEC 21–22 · TUTORIAL 7', title: 'Run V_OL backwards to size the driver', src: 'Tutorial 7 Q3',
    q: 'Design a resistive-load inverter with $R = 1$ kΩ such that $V_{OL} = 0.6$ V. Driver: $V_{DD} = 5$ V, $V_{T0} = 1$ V, $\\gamma = 0.2\\,\\text{V}^{1/2}$, $\\lambda = 0$, $\\mu_nC_{ox} = 22\\,\\mu$A/V². (a) W/L. (b) $V_{IL}$, $V_{IH}$. (c) $NM_L$, $NM_H$.', qh: 220,
    tests: 'the $V_{OL}$ equation run backwards for $k_n$; then the same boxed results. $\\gamma$ is a decoy: M1’s source is on ground, so $V_{SB} = 0$ and $V_T = V_{T0}$.',
    fig: (S2) => { const g = rInvFig(S2, 380, 220, { rl: 'R = 1 kΩ' }); return g; },
    steps: [
      { t: 6, title: '**(a) $V_{OL}$ backwards.** Input $= V_{DD}$, M1 in triode, $V_{out} = 0.6$ V known; $k_n$ unknown. (γ plays no part: $V_{SB} = 0$.)', tex: `\\frac{5 - 0.6}{1\\,\\text{k}} = \\frac{k_n}{2}\\left[2(4)(0.6) - 0.36\\right] \\;\\Rightarrow\\; k_n = \\frac{2(4.4\\,\\text{m})}{4.44} = ${fx(F.q3kn * 1e3, 4)}\\,\\text{mA/V}^2`,
        try: { q: '(a) First the device constant k_n = µnCox·W/L that gives V_OL = 0.6 V (in A/V²).', answer: F.q3kn, unit: 'A/V²', tol: 0.02,
          parts: [{ q: 'The current through R when the output is 0.6 V?', answer: 4.4e-3, unit: 'A', tol: 0.01, hint: ['$(V_{DD} - V_{OL})/R$'], how: ['$$\\frac{5 - 0.6}{1\\,\\text{k}} = 4.4\\,\\text{mA}$$'] }],
          hint: ['Same equation as for $V_{OL}$, but now $V_{OL}$ is known and $k_n$ is the unknown.', '$\\dfrac{V_{DD} - V_{OL}}{R} = \\dfrac{k_n}{2}\\left[2(V_{DD} - V_{T0})V_{OL} - V_{OL}^2\\right]$'],
          how: ['Resistor current: $$\\frac{5 - 0.6}{1\\,\\text{k}} = 4.4\\,\\text{mA}$$', 'Triode bracket: $$2(5 - 1)(0.6) - 0.6^2 = 4.8 - 0.36 = 4.44\\,\\text{V}^2$$', `$$k_n = \\frac{2\\times4.4\\,\\text{m}}{4.44} = ${fx(F.q3kn * 1e3, 4)}\\,\\text{mA/V}^2$$`] }, say: `kn = ${fx(F.q3kn * 1e3, 4)} mA/V².` },
      { t: 14, title: '**(a) W/L.**', tex: `\\frac{W}{L} = \\frac{k_n}{\\mu_nC_{ox}} = \\frac{${fx(F.q3kn * 1e3, 4)}\\,\\text{m}}{22\\,\\mu} = ${fx(F.q3wl, 3)}`,
        try: { q: '(a) The aspect ratio W/L (µnCox = 22 µA/V²)?', answer: F.q3wl, unit: '', tol: 0.02, hint: ['$k_n = \\mu_nC_{ox}\\,W/L$'], how: [`$$\\frac WL = \\frac{${fx(F.q3kn * 1e3, 4)}\\times10^{-3}}{22\\times10^{-6}} = ${fx(F.q3wl, 3)} \\approx 90$$`] }, say: 'W/L ≈ 90: the key’s 90.' },
      { t: 22, title: '**(b) $V_{IL}$, $V_{IH}$** with $k_nR = ' + fx(Q3.k, 4) + '$ V⁻¹.', tex: `V_{IL} = 1 + \\frac{1}{${fx(Q3.k, 4)}} = ${fx(Q3.vil, 4)}\\,\\text{V},\\quad V_{IH} = 1 + \\sqrt{\\frac{40}{3(${fx(Q3.k, 4)})}} - \\frac{1}{${fx(Q3.k, 4)}} = ${fx(Q3.vih, 4)}\\,\\text{V}`,
        try: { q: '(b) V_IH? (k_n·R from (a))', answer: Q3.vih, unit: 'V', tol: 0.02,
          parts: [{ q: 'First $V_{IL} = V_{T0} + 1/(k_nR)$?', answer: Q3.vil, unit: 'V', tol: 0.02, hint: [`$k_nR = ${fx(Q3.k, 4)}$ V⁻¹`], how: [`$$V_{IL} = 1 + \\frac{1}{${fx(Q3.k, 4)}} = ${fx(Q3.vil, 4)}\\,\\text{V}$$`] }],
          hint: ['$V_{IH} = V_{T0} + \\sqrt{8V_{DD}/(3k_nR)} - 1/(k_nR)$'], how: [`$$V_{IH} = 1 + \\sqrt{\\frac{40}{${fx(3 * Q3.k, 4)}}} - ${fx(1 / Q3.k, 3)} = ${fx(Q3.vih, 4)}\\,\\text{V}$$`] }, say: `VIL = ${fx(Q3.vil, 4)} V, VIH = ${fx(Q3.vih, 4)} V.` },
      { t: 30, title: '**(c) Noise margins** with $V_{OL} = 0.6$ V (designed) and $V_{OH} = 5$ V.', tex: `NM_L = ${fx(Q3.vil, 4)} - 0.6 = ${fx(Q3.nml, 3)}\\,\\text{V},\\quad NM_H = 5 - ${fx(Q3.vih, 4)} = ${fx(Q3.nmh, 3)}\\,\\text{V}`,
        try: { q: '(c) NM_H?', answer: Q3.nmh, unit: 'V', tol: 0.02,
          parts: [{ q: 'First $NM_L = V_{IL} - V_{OL}$?', answer: Q3.nml, unit: 'V', tol: 0.02, hint: ['$V_{OL} = 0.6$ V by design.'], how: [`$$NM_L = ${fx(Q3.vil, 4)} - 0.6 = ${fx(Q3.nml, 3)}\\,\\text{V}$$`] }],
          hint: ['$NM_H = V_{OH} - V_{IH}$, $V_{OH} = V_{DD}$.'], how: [`$$NM_H = 5 - ${fx(Q3.vih, 4)} = ${fx(Q3.nmh, 3)}\\,\\text{V}$$`] }, say: 'NML = 0.905 V, NMH = 1.91 V.' },
      { t: 38, ans: true, title: `**Answers (match the key):** $W/L = ${fx(F.q3wl, 3)} \\approx 90$ · $V_{IL} = ${fx(Q3.vil, 4)}$ V · $V_{IH} = ${fx(Q3.vih, 4)}$ V · $NM_L = ${fx(Q3.nml, 3)}$ V · $NM_H = ${fx(Q3.nmh, 3)}$ V`, say: 'A 1 kΩ load needs a wide driver: W/L ≈ 90.' },
    ],
  });
}, { q: 'Tutorial 7 Q3' });

/* ── Preview: the CMOS VTC (beyond Lec 22; the 2024-25 tutorials and compre ask it) ── */
const PC4 = { vdd: 3.3, kn: 60e-6 * 8, kp: 25e-6 * 12, vtn: 0.6, vtp: -0.7 }, C4 = F.c4;
scene(LCP, 'CMOS VTC: five regions and the switching threshold', 84, (S) => {
  header(S, 'PREVIEW · CMOS VTC', 'Both devices saturated at V_th: one square root gives it');
  const F2 = vtcFrame(S, 160, 170, 520, 520, 3.3, { step: 0.5 }); F2.g.style.opacity = 0; S.fade(F2.g, 0.3, 0.5);
  tracePlot(S, (v) => FN.cmosVout(PC4, v), (u) => F2.X(u), (v) => F2.Y(v), 1, 10, C.volt, 3.3);
  S.say(0.3, 'This chapter goes one step beyond Lecture 22, because the 2024-25 tutorials and the compre ask it: the VTC of the CMOS inverter. Here with $V_{DD} = 3.3$ V.');
  S.say(5, 'It goes all the way from $V_{DD}$ to 0: full swing. The steep middle is where both transistors are on.');
  eqAt(S, '\\frac{k_n}{2}(V_{th} - V_{Tn})^2 = \\frac{k_p}{2}(V_{DD} - V_{th} - |V_{Tp}|)^2', 1120, 250, 14, { size: 26, w: 820 });
  S.say(14, 'At $V_{th}$ both are saturated and carry the same current.');
  eqAt(S, 'V_{th} = \\frac{V_{Tn} + \\sqrt{1/k_R}\\,(V_{DD} - |V_{Tp}|)}{1 + \\sqrt{1/k_R}},\\qquad k_R = \\frac{k_n}{k_p}', 1120, 360, 20, { size: 26, w: 820, color: '#ffd38a' });
  S.say(20, 'Take square roots and solve: $V_{th}$ depends on the strength ratio $k_R = k_n/k_p$. A stronger NMOS pulls $V_{th}$ down.');
  whyBox(S, 760, 440, 760, 240, '**$V_{IL}$, $V_{IH}$:** same slope −1 idea, with one device saturated and the other in triode. Symmetric inverter ($k_R = 1$, $V_{Tn} = |V_{Tp}| = V_T$): $V_{IL} = \\frac{3V_{DD} + 2V_T}{8}$, $V_{IH} = \\frac{5V_{DD} - 2V_T}{8}$, $V_{th} = V_{DD}/2$. Margins: $NM_L = V_{IL}$, $NM_H = V_{DD} - V_{IH}$.', 30);
  S.say(30, 'The slope −1 points use the same method as the resistive load, with one device saturated and the other in triode. For a symmetric inverter they reduce to $(3V_{DD} + 2V_T)/8$ and $(5V_{DD} - 2V_T)/8$. And since $V_{OL} = 0$ and $V_{OH} = V_{DD}$, the margins are simply $V_{IL}$ and $V_{DD} - V_{IH}$.');
  S.stop(44, {
    src: XC,
    q: 'A symmetric CMOS inverter: V_DD = 2.5 V, V_Tn = |V_Tp| = 0.6 V. What is V_IL?',
    hint: ['Symmetric: use the closed form.', '$V_{IL} = \\dfrac{3V_{DD} + 2V_T}{8}$'],
    how: ['$$V_{IL} = \\frac{3(2.5) + 2(0.6)}{8} = \\frac{8.7}{8} = 1.0875\\,\\text{V}$$', 'That is also $NM_L$, since $V_{OL} = 0$.'],
    answer: 1.0875, unit: 'V', tol: 0.01,
  });
});

scene(LCP, 'Inverter tutorial Q4: V_th and both margins (CMOS)', 86, (S) => {
  pyqFrame(S, {
    tag: 'PREVIEW · INVERTER TUTORIAL', title: 'An unsymmetric CMOS inverter, every number', src: 'Inverter tutorial Q4 (2023-24) = 2024-25 Tutorial 5 Q2',
    q: 'CMOS inverter, $V_{DD} = 3.3$ V. nMOS: $V_{T0,n} = 0.6$ V, $\\mu_nC_{ox} = 60\\,\\mu$A/V², $(W/L)_n = 8$. pMOS: $V_{T0,p} = -0.7$ V, $\\mu_pC_{ox} = 25\\,\\mu$A/V², $(W/L)_p = 12$. Find $V_{th}$ and the noise margins.', qh: 200,
    tests: 'the CMOS $V_{th}$ formula with $k_R$, and the slope −1 points for an unsymmetric inverter.',
    fig: (S2) => { const F2 = vtcFrame(S2, 140, 230, 560, 560, 3.3, { step: 0.5 }); S2.el('polyline', { points: ptsOf(200, 0, 3.3, (v) => [F2.X(v), F2.Y(FN.cmosVout(PC4, v))]), fill: 'none', stroke: C.volt, 'stroke-width': 3.4 }); return F2; },
    steps: [
      { t: 6, title: '**Strengths.** $k = \\mu C_{ox}\\cdot W/L$ for each device, then the ratio.', tex: 'k_n = 60\\,\\mu\\times8 = 480\\,\\mu,\\quad k_p = 25\\,\\mu\\times12 = 300\\,\\mu,\\quad k_R = \\frac{480}{300} = 1.6',
        try: { q: 'The strength ratio k_R = k_n / k_p?', answer: C4.kr, unit: '', tol: 0.01, hint: ['$k = \\mu C_{ox}(W/L)$ for each device.', '$k_R = \\dfrac{60\\,\\mu\\times8}{25\\,\\mu\\times12}$'], how: ['$$k_n = 480\\,\\mu\\text{A/V}^2,\\; k_p = 300\\,\\mu\\text{A/V}^2,\\; k_R = 1.6$$'] }, say: 'kR = 1.6.' },
      { t: 14, title: '**$V_{th}$.**', tex: `V_{th} = \\frac{0.6 + \\sqrt{1/1.6}\\,(3.3 - 0.7)}{1 + \\sqrt{1/1.6}} = ${fx(C4.vth, 4)}\\,\\text{V}`,
        try: { q: 'The switching threshold V_th?', answer: C4.vth, unit: 'V', tol: 0.01,
          parts: [{ q: 'First $\\sqrt{1/k_R}$?', answer: Math.sqrt(1 / C4.kr), unit: '', tol: 0.01, hint: ['$\\sqrt{1/1.6}$'], how: ['$$\\sqrt{0.625} = 0.7906$$'] }],
          hint: ['Both saturated with equal currents.', '$V_{th} = \\dfrac{V_{Tn} + \\sqrt{1/k_R}(V_{DD} - |V_{Tp}|)}{1 + \\sqrt{1/k_R}}$'], how: ['$$V_{th} = \\frac{0.6 + 0.7906\\times2.6}{1.7906} = \\frac{2.656}{1.7906} = 1.483\\,\\text{V}$$', 'Key: 1.48 V ✓'] }, say: `Vth = ${fx(C4.vth, 4)} V.` },
      { t: 22, title: '**$V_{IL}$:** nMOS saturated, pMOS in triode, slope −1 (solve the pair numerically or with the Kang formula).', tex: `V_{IL} = ${fx(C4.vil, 4)}\\,\\text{V}\\;(V_{out} = ${fx(C4.voutVil, 3)}\\,\\text{V}),\\quad NM_L = V_{IL} - 0 = ${fx(C4.vil, 4)}\\,\\text{V}`,
        try: { q: 'V_IL (= NM_L, since V_OL = 0)?', answer: C4.vil, unit: 'V', tol: 0.035,
          hint: ['Slope −1 with the nMOS saturated and the pMOS in triode gives $V_{out} = \\tfrac12[(1 + k_R)V_{IL} + V_{DD} - V_{Tp} - k_RV_{Tn}]$; put it into the current equality.', '$\\frac{k_n}{2}(V_{IL} - V_{Tn})^2 = \\frac{k_p}{2}\\left[2(V_{DD} - V_{IL} - |V_{Tp}|)(V_{DD} - V_{out}) - (V_{DD} - V_{out})^2\\right]$'],
          how: ['Slope −1 links the output to the input: $$V_{out} = \\tfrac12\\left[(1 + k_R)V_{IL} + V_{DD} + |V_{Tp}| - k_RV_{Tn}\\right]$$', 'Substitute into the current equality and solve (a quadratic in $V_{IL}$): $$V_{IL} = 1.199\\,\\text{V},\\quad V_{out} = 2.97\\,\\text{V}$$', 'A brute-force sweep of the VTC confirms 1.199 V. **Your answer key writes 1.16 V**: both are accepted here; say which method you used.'] }, say: 'VIL ≈ 1.20 V (the key prints 1.16).' },
      { t: 30, title: '**$V_{IH}$:** nMOS in triode, pMOS saturated, slope −1.', tex: `V_{IH} = ${fx(C4.vih, 4)}\\,\\text{V},\\quad NM_H = 3.3 - ${fx(C4.vih, 4)} = ${fx(C4.nmh, 4)}\\,\\text{V}`,
        try: { q: 'V_IH?', answer: C4.vih, unit: 'V', tol: 0.015,
          hint: ['Slope −1 now gives $V_{out} = \\tfrac12\\left[V_{IH} - V_{Tn} - (V_{DD} - V_{IH} - |V_{Tp}|)/k_R\\right]$.', 'Put it into $\\frac{k_n}{2}[2(V_{IH} - V_{Tn})V_{out} - V_{out}^2] = \\frac{k_p}{2}(V_{DD} - V_{IH} - |V_{Tp}|)^2$.'],
          how: ['Solving the pair: $$V_{IH} = 1.696\\,\\text{V}$$ (key: 1.69 V ✓)', '$$NM_H = V_{DD} - V_{IH} = 3.3 - 1.696 = 1.604\\,\\text{V}$$ (key: 1.61 V)'] }, say: `VIH = ${fx(C4.vih, 4)} V, NMH = ${fx(C4.nmh, 3)} V.` },
      { t: 38, ans: true, title: `**Answers:** $V_{th} = ${fx(C4.vth, 3)}$ V · $V_{IL} = NM_L ≈ ${fx(C4.vil, 3)}$ V (key 1.16) · $V_{IH} = ${fx(C4.vih, 3)}$ V · $NM_H = ${fx(C4.nmh, 3)}$ V`, say: 'A stronger nMOS (kR > 1) pulls Vth below VDD/2.' },
    ],
  });
}, { q: 'Inverter tutorial Q4' });

scene(LCP, 'Compre 2024-25 Q4(b): noise margins of a matched inverter', 60, (S) => {
  pyqFrame(S, {
    tag: 'PREVIEW · COMPRE 2024-25', title: 'Equal rise and fall → symmetric → closed forms', src: 'Compre 2024-25 Q4 · 9 marks',
    q: 'An inverter sized for equal rise and fall delays: $V_{DD} = 2.5$ V, $V_{Tn} = -V_{Tp} = 0.6$ V, $k_n\' = 3k_p\' = 120\\,\\mu$A/V². (b) Find the noise margins.', qh: 190,
    tests: 'recognising the symmetric inverter: equal delays mean equal strengths, $k_R = 1$.',
    fig: (S2) => { const P = { vdd: 2.5, kn: 120e-6, kp: 120e-6, vtn: 0.6, vtp: -0.6 }; const F2 = vtcFrame(S2, 140, 230, 560, 560, 2.5, { step: 0.5 }); S2.el('polyline', { points: ptsOf(200, 0, 2.5, (v) => [F2.X(v), F2.Y(FN.cmosVout(P, v))]), fill: 'none', stroke: C.volt, 'stroke-width': 3.4 }); return F2; },
    steps: [
      { t: 6, title: '**Equal delays → equal strengths.** The pMOS is made 3× wider to make up for its 3× lower $k\'$: $k_n = k_p$, $k_R = 1$, and the thresholds match.', tex: 'k_n = k_p \\;\\Rightarrow\\; V_{th} = \\frac{V_{DD}}{2} = 1.25\\,\\text{V}',
        try: { q: 'Equal rise/fall sizing makes the inverter symmetric. What is its V_th?', answer: 1.25, unit: 'V', tol: 0.01, hint: ['Symmetric: $k_R = 1$ and $V_{Tn} = |V_{Tp}|$.', '$V_{th} = V_{DD}/2$'], how: ['With $k_R = 1$ and equal thresholds the formula gives $$V_{th} = \\frac{V_{DD}}{2} = 1.25\\,\\text{V}$$'] }, say: 'Vth = 1.25 V.' },
      { t: 14, title: '**Margins** from the symmetric closed forms.', tex: 'V_{IL} = \\frac{3(2.5) + 2(0.6)}{8} = 1.0875,\\; V_{IH} = \\frac{5(2.5) - 2(0.6)}{8} = 1.4125,\\; NM_L = NM_H = 1.0875\\,\\text{V}',
        try: { q: '(b) The noise margin NM_L (= NM_H by symmetry)?', answer: 1.0875, unit: 'V', tol: 0.01,
          parts: [{ q: 'First $V_{IH} = (5V_{DD} - 2V_T)/8$?', answer: 1.4125, unit: 'V', tol: 0.01, hint: ['$(12.5 - 1.2)/8$'], how: ['$$V_{IH} = 1.4125\\,\\text{V}$$'] }],
          hint: ['$NM_L = V_{IL} - 0$ with $V_{IL} = (3V_{DD} + 2V_T)/8$.'], how: ['$$V_{IL} = \\frac{7.5 + 1.2}{8} = 1.0875\\,\\text{V} = NM_L$$', '$$NM_H = 2.5 - 1.4125 = 1.0875\\,\\text{V}$$'] }, say: 'Both margins 1.09 V.' },
      { t: 22, ans: true, title: '**Answers:** $V_{th} = 1.25$ V · $V_{IL} = 1.0875$ V · $V_{IH} = 1.4125$ V · $NM_L = NM_H = 1.0875$ V', say: 'Symmetric sizing gives equal margins.' },
    ],
  });
}, { q: 'Compre 2024-25 Q4' });
