/* Lesson F: Lecture 18 — the two-stage op amp's transfer function, its two poles and RHP zero, and where the
   PM = 60° rules (ωp2 ≥ 2.2 GB, ωz ≥ 10 GB, gm6 ≥ 10 gm1, Cc ≥ 0.22 CL) come from. Numbers: F.ex18, F.rules (f_num.js). */
'use strict';
const L18 = 'Lec 18 · Two-stage poles & PM rules';
const X18 = F.ex18; // gm1 = 0.1 mS, gm2 = gm6 = 1 mS, R1 = 200 kΩ, R2 = 100 kΩ, C1 = 0.1 pF, C2 = CL = 2 pF, Cc = 0.5 pF
const EX18 = 'Exam-style check';
const GIV18 = '$G_{m1} = 0.1$ mS, $G_{m2} = 1$ mS, $R_1 = 200$ kΩ, $R_2 = 100$ kΩ, $C_1 = 0.1$ pF, $C_2 = C_L = 2$ pF, $C_c = 0.5$ pF';

/* the small-signal model of the two-stage op amp: two Gm·R stages, C1 at P, C2 at the output, Cc bridging them */
function ssModel(S, x, y) {
  const g = S.g(); const r = S.into(g);
  const yt = y + 100, yb = y + 330, P = x + 340, O = x + 540;
  wire(S, [[x + 110, yt], [P, yt]]); wire(S, [[O, yt], [x + 820, yt]]); wire(S, [[x + 110, yb], [x + 690, yb]]); gnd(S, x + 450, yb);
  isrc(S, x + 110, y + 215, { label: 'G_m1 v_in', left: true, len: 115, lsize: 20 });
  res(S, x + 210, yt, yb, { label: 'R_1', lsize: 20 }); wire(S, [[x + 300, yt], [x + 300, y + 190]]); cap(S, x + 300, y + 190, { label: 'C_1' });
  dot(S, P, yt); txt(S, P - 4, yt - 16, 'P', { size: 22, color: C.bad, weight: 800, anchor: 'middle' });
  // Cc between P and the output
  wire(S, [[P, yt], [x + 434, yt]]); S.el('line', { x1: x + 434, y1: yt - 18, x2: x + 434, y2: yt + 18, stroke: C.amb, 'stroke-width': 3.6 });
  S.el('line', { x1: x + 446, y1: yt - 18, x2: x + 446, y2: yt + 18, stroke: C.amb, 'stroke-width': 3.6 }); wire(S, [[x + 446, yt], [O, yt]]);
  txt(S, x + 440, yt - 30, 'C_c', { size: 21, color: C.amb, weight: 700, anchor: 'middle' });
  isrc(S, O + 60, y + 215, { label: 'G_m2 v_P', len: 115, lsize: 20, left: true }); wire(S, [[O, yt], [O + 60, yt]]);
  res(S, x + 690, yt, yb, { label: 'R_2', lsize: 20 }); wire(S, [[x + 780, yt], [x + 780, y + 190]]); cap(S, x + 780, y + 190, { label: 'C_2' });
  dot(S, O, yt); txt(S, x + 830, yt + 7, 'v_out', { size: 22, color: C.volt, weight: 700 });
  r(); return g;
}

scene(L18, 'Your page: two stages, two nodes', 62, (S) => {
  header(S, 'LEC 18 · YOUR PAGE', 'Two high-resistance nodes: P after stage 1, and the output');
  pagePeek(S, 'n18a', 1080, 140, 440, 372, 0.4, 14);
  const t = twoStageFig(S, { x: 0, y: 40, sc: 1 }); S.draw(t.g, 0.3, 2.4);
  S.say(0.3, 'Lecture 18 opens with the two-stage op amp you met in Lecture 17: a differential pair M1, M2 with mirror M3, M4 and tail M5, then the common-source stage M6 with its current source M7, and the Miller capacitor $C_c$ from P to the output.');
  glowBox(S, 350, 300, 160, 110, C.bad, 8, 30); glowBox(S, 600, 360, 160, 120, C.bad, 8, 30);
  S.say(8, 'Only two nodes matter for speed: P, the first stage’s output, and the final output. Each sees a large resistance and some capacitance — each is one pole, exactly as in the ground-up scenes.');
  const ms = S.g(); const rm = S.into(ms); ssModel(S, 0, 0); rm(); ms.setAttribute('transform', 'translate(860 380) scale(0.8)'); ms.style.opacity = 0; S.fade(ms, 16, 0.8);
  S.say(16, 'Replace each stage by what it does: a transconductance pushing current into a resistance and a capacitance. Stage 1: $G_{m1}v_{in}$ into $R_1$ and $C_1$ at P. Stage 2: $G_{m2}v_P$ into $R_2$ and $C_2$ at the output. $C_c$ bridges them.');
  const tb = html(S, 40, 660, 700, 200, `<div class="whybox"><b>Who is who</b><br>${rt('$G_{m1} = g_{m1,2}$ · $G_{m2} = g_{m6}$ · $R_1 = r_{O2}\\parallel r_{O4}$ · $R_2 = r_{O6}\\parallel r_{O7}$ · $C_2 \\approx C_L$ · $C_1$: small (gate of M6 and drains of M2, M4)')}</div>`);
  tb.style.opacity = 0; S.slideIn(tb, 26, 0.7);
  S.say(26, 'The dictionary from your page: $G_{m1}$ is the input pair’s $g_m$, $G_{m2}$ is $g_{m6}$, $R_1$ is $r_{O2}\\parallel r_{O4}$, $R_2$ is $r_{O6}\\parallel r_{O7}$, $C_2$ is essentially the load $C_L$, and $C_1$ is small.');
  S.stop(40, {
    src: EX18,
    q: `With ${GIV18}: what is the op amp's DC gain $A_0$?`,
    hint: ['At DC every capacitor is open. Each stage is $G_m$ times its $R$, and the stages multiply.', '$A_0 = (G_{m1}R_1)(G_{m2}R_2)$'],
    how: ['Stage 1: $$A_1 = G_{m1}R_1 = (0.1\\,\\text{m})(200\\,\\text{k}) = 20$$', 'Stage 2: $$A_2 = G_{m2}R_2 = (1\\,\\text{m})(100\\,\\text{k}) = 100$$', 'They multiply: $$A_0 = 20\\times100 = 2000\\;(66\\,\\text{dB})$$'],
    parts: [{ q: 'First stage gain $A_1 = G_{m1}R_1$?', answer: X18.a1, unit: 'V/V', tol: 0.02, hint: ['$G_{m1}R_1$'], how: ['$$0.1\\,\\text{m}\\times200\\,\\text{k} = 20$$'] },
      { q: 'Second stage gain $A_2 = G_{m2}R_2$?', answer: X18.a2, unit: 'V/V', tol: 0.02, hint: ['$G_{m2}R_2$'], how: ['$$1\\,\\text{m}\\times100\\,\\text{k} = 100$$'] }],
    answer: X18.a0, unit: 'V/V', tol: 0.02,
  });
  S.say(41, '20 × 100 = 2000. We keep these numbers for the whole lecture.');
});

scene(L18, 'Follow the current: the two-stage op amp', 52, (S) => {
  header(S, 'LEC 18 · FOLLOW THE CURRENT', 'Tail I5 splits in two; the output branch carries I6 through M6 and M7');
  const t = twoStageFig(S, { x: 300, y: 60, sc: 1.05, caps: false }); S.draw(t.g, 0.3, 2.2);
  const T = (x, y) => [300 + x * 1.05, 60 + y * 1.05];
  S.say(0.3, 'Before any frequency maths, follow the DC currents of this circuit.');
  current(S, [T(320, 484), T(320, 578)], 4, null, 'I_5', { color: C.ok, at: T(400, 560) });
  current(S, [T(220, 178), T(220, 480), T(314, 480)], 9, null, 'I_5/2', { color: C.n, at: T(150, 205) });
  current(S, [T(420, 178), T(420, 480), T(326, 480)], 9, null, 'I_5/2', { color: C.p, at: T(495, 205) });
  current(S, [T(640, 178), T(640, 578)], 15, null, 'I_6', { color: C.cur, at: T(720, 470) });
  S.say(4, 'The tail M5 pulls $I_5$ out of the pair. At rest it splits equally: $I_5/2$ down each side, through M3 into M1 and through M4 into M2. PMOS source to drain, NMOS drain to source: always downwards.');
  S.say(15, 'The second stage is a separate branch: M6 pushes $I_6$ down into M7 and the load. $I_6$ is set by M7, a copy of the tail’s bias, scaled by $(W/L)_7/(W/L)_5$.');
  whyBox(S, 1080, 640, 480, 180, '**Why it matters later:** slewing uses $I_5$ (it charges $C_c$); the second pole uses $g_{m6}$, which needs $I_6$; power is $V_{DD}$ × all of them.', 24);
  S.say(24, 'Keep these three currents in mind: $I_5$ will set the slew rate, $I_6$ the second pole, and together they set the power.');
  S.stop(34, {
    src: EX18,
    q: 'If I₅ = 20 µA and M7 is sized (W/L)₇ = 7.5 × (W/L)₅ (same gate voltage), what current I₆ flows in the second stage?',
    hint: ['M5 and M7 share their gate voltage: a mirror. Currents scale with W/L.', '$I_6 = I_5\\cdot\\dfrac{(W/L)_7}{(W/L)_5}$'],
    how: ['M5 and M7 have the same $V_{GS}$, so the same overdrive: their currents are in the ratio of their sizes.', '$$I_6 = I_5\\times7.5 = 20\\,\\mu\\text{A}\\times7.5 = 150\\,\\mu\\text{A}$$'],
    answer: 150e-6, unit: 'A', tol: 0.02,
  });
});

scene(L18, 'The transfer function, read slowly', 74, (S) => {
  header(S, 'LEC 18 · THE TRANSFER FUNCTION', 'One fraction, but every piece has a meaning');
  pagePeek(S, 'n18a', 1080, 140, 440, 372, 0.4, 10);
  eqAt(S, '\\frac{v_{out}}{v_{in}}(s) = \\frac{G_{m1}G_{m2}R_1R_2\\left(1 - \\frac{sC_c}{G_{m2}}\\right)}{1 + s\\left[C_1R_1 + (1 + G_{m2}R_2)C_cR_1 + (C_c + C_2)R_2\\right] + s^2R_1R_2\\left[C_1C_c + C_cC_2 + C_1C_2\\right]}', 640, 220, 2, { size: 26, w: 1240 });
  S.say(0.4, 'Solving the model’s two node equations gives your page’s transfer function. It looks frightening; read it piece by piece.');
  const pieces = [
    [10, 350, C.ok, '**At $s = 0$ it is just the DC gain:** $G_{m1}R_1\\cdot G_{m2}R_2 = A_0$.'],
    [18, 440, C.bad, '**The numerator vanishes at $s = +G_{m2}/C_c$:** a zero in the right half-plane. Through $C_c$ the input of stage 2 reaches the output directly, and at that frequency it cancels $G_{m2}v_P$.'],
    [30, 560, C.volt, '**The denominator is second order:** two poles, $\\omega_{p1}$ and $\\omega_{p2}$. The biggest term in the $s$ coefficient is $(1 + G_{m2}R_2)C_cR_1$: the Miller-multiplied $C_c$.'],
  ];
  pieces.forEach(([t0, y, col, s]) => { const fo = html(S, 120, y, 1360, 90, `<div class="whybox" style="border-color:${col}">${rt(s)}</div>`); fo.style.opacity = 0; S.slideIn(fo, t0, 0.7); });
  S.say(10, 'At $s = 0$ the fraction is $G_{m1}R_1G_{m2}R_2$: the DC gain, 2000 in our example.');
  S.say(18, 'The numerator has its own root: $1 - sC_c/G_{m2} = 0$ at $s = +G_{m2}/C_c$. A positive root is a zero in the right half-plane. It lifts the gain like any zero but adds lag like a pole: the worst of both.');
  S.say(30, 'The denominator is a quadratic in $s$: two poles. Look inside the $s$ coefficient: the $(1 + G_{m2}R_2)C_cR_1$ term is $C_c$ multiplied by the second stage’s gain. That is the Miller effect, and it will be the dominant pole.');
  S.stop(44, {
    src: EX18,
    q: `With ${GIV18}: where is the right-half-plane zero, $\\omega_z$ (rad/s)?`,
    hint: ['The numerator is zero when $sC_c = G_{m2}$.', '$\\omega_z = \\dfrac{G_{m2}}{C_c}$'],
    how: ['Set the numerator to zero: $$1 - \\frac{sC_c}{G_{m2}} = 0 \\;\\Rightarrow\\; s = +\\frac{G_{m2}}{C_c}$$', '$$\\omega_z = \\frac{1\\,\\text{mS}}{0.5\\,\\text{pF}} = 2\\times10^{9}\\,\\text{rad/s}$$'],
    why: 'Positive $s$: right half-plane. It costs phase like a pole while the gain rises like a zero.',
    answer: X18.wz, unit: 'rad/s', tol: 0.02,
  });
  S.say(45, '$\\omega_z = 2\\times10^9$ rad/s. Keep it for the phase margin.');
});

scene(L18, 'Two poles out of one denominator', 86, (S) => {
  header(S, 'LEC 18 · COEFFICIENT MATCHING', 'Write the denominator as (1 + s/ωp1)(1 + s/ωp2) and match it term by term');
  pagePeek(S, 'n18a', 1120, 140, 400, 338, 0.4, 12);
  eqAt(S, 'D(s) = \\left(1 + \\frac{s}{\\omega_{p1}}\\right)\\left(1 + \\frac{s}{\\omega_{p2}}\\right) = 1 + s\\left(\\frac{1}{\\omega_{p1}} + \\frac{1}{\\omega_{p2}}\\right) + \\frac{s^2}{\\omega_{p1}\\omega_{p2}}', 560, 190, 0.6, { size: 26, w: 1060 });
  S.say(0.6, 'Any two-pole denominator can be written as $(1 + s/\\omega_{p1})(1 + s/\\omega_{p2})$. Multiply it out: the $s$ coefficient is $1/\\omega_{p1} + 1/\\omega_{p2}$, and the $s^2$ coefficient is $1/(\\omega_{p1}\\omega_{p2})$.');
  eqAt(S, '\\omega_{p1} \\ll \\omega_{p2}:\\quad \\frac{1}{\\omega_{p1}} \\approx (1 + G_{m2}R_2)C_cR_1 \\;\\Rightarrow\\; \\omega_{p1} \\approx \\frac{1}{G_{m2}R_2R_1C_c}', 560, 300, 10, { size: 26, w: 1060, color: '#ffd38a' });
  S.say(10, 'Compensation makes the poles far apart. Then $1/\\omega_{p1}$ dominates the $s$ coefficient, and inside it the Miller term dominates: $\\omega_{p1} \\approx 1/(G_{m2}R_2R_1C_c)$. A tiny $C_c$, multiplied by the second-stage gain, makes a very low first pole.');
  eqAt(S, '\\omega_{p2} = \\frac{1}{\\omega_{p1}R_1R_2[\\,C_1C_c + C_cC_2 + C_1C_2\\,]} = \\frac{G_{m2}C_c}{(C_1 + C_2)C_c + C_1C_2} \\approx \\frac{G_{m2}}{C_1 + C_2} \\approx \\frac{G_{m2}}{C_L}', 560, 420, 20, { size: 25, w: 1060, color: '#ffd38a' });
  S.say(20, 'The $s^2$ coefficient gives the product; divide by $\\omega_{p1}$ and the second pole falls out: $G_{m2}C_c/((C_1 + C_2)C_c + C_1C_2)$. When $C_c$ is larger than $C_1C_2/(C_1+C_2)$ this is about $G_{m2}/(C_1 + C_2)$, and with $C_1$ small, $G_{m2}/C_L$.');
  whyBox(S, 120, 520, 860, 130, '**Pole splitting:** the bigger $C_c$, the **lower** $\\omega_{p1}$ and the **higher** $\\omega_{p2}$ (it now depends on $G_{m2}/C_L$, not on $R_2$). One capacitor pushes the poles apart.', 32);
  S.say(32, 'That is pole splitting: $C_c$ pushes the first pole down and the second one up, to $G_{m2}/C_L$. The second pole no longer depends on $R_2$: M6 acts like a diode at high frequency through $C_c$.');
  S.stop(44, {
    src: EX18,
    q: `With ${GIV18}: the dominant pole $\\omega_{p1}$ (rad/s)?`,
    hint: ['The Miller-multiplied $C_c$ seen through $R_1$.', '$\\omega_{p1} \\approx \\dfrac{1}{G_{m2}R_2R_1C_c}$'],
    how: ['$$G_{m2}R_2 = 100,\\quad G_{m2}R_2\\cdot R_1C_c = 100\\times(200\\,\\text{k})(0.5\\,\\text{p}) = 10^{-5}\\,\\text{s}$$', '$$\\omega_{p1} \\approx \\frac{1}{10^{-5}} = 10^{5}\\,\\text{rad/s}\\;(15.9\\,\\text{kHz})$$'],
    parts: [{ q: 'First, the Miller capacitance $G_{m2}R_2\\,C_c$ seen at P?', answer: 100 * 0.5e-12, unit: 'F', tol: 0.02, hint: ['$C_c$ multiplied by the second-stage gain $G_{m2}R_2 = 100$.'], how: ['$$100\\times0.5\\,\\text{pF} = 50\\,\\text{pF}$$'] }],
    answer: X18.wp1, unit: 'rad/s', tol: 0.02,
  });
  S.stop(54, {
    src: EX18,
    q: `Same values: the second pole $\\omega_{p2} \\approx G_{m2}/(C_1 + C_2)$ (rad/s)?`,
    hint: ['At high frequency M6 sees both capacitances.', '$\\omega_{p2} \\approx \\dfrac{G_{m2}}{C_1 + C_2}$'],
    how: ['$$\\omega_{p2} \\approx \\frac{G_{m2}}{C_1 + C_2} = \\frac{1\\,\\text{mS}}{0.1\\,\\text{p} + 2\\,\\text{p}} = 4.76\\times10^{8}\\,\\text{rad/s}$$', 'The exact line on your page, $G_{m2}C_c/((C_1+C_2)C_c + C_1C_2)$, gives $4.0\\times10^8$: the approximation needs $C_c \\gg C_1C_2/(C_1+C_2)$, here only about 5×. Exams use the approximation.'],
    answer: X18.wp2a, unit: 'rad/s', tol: 0.02,
  });
  S.say(55, '$\\omega_{p1} = 10^5$ and $\\omega_{p2} \\approx 4.8\\times10^8$ rad/s: almost four decades apart. That is what compensation buys.');
});

scene(L18, 'GB = Gm1/Cc: the Rs cancel again', 58, (S) => {
  header(S, 'LEC 18 · GAIN–BANDWIDTH', 'GB = A0 · ωp1: every R cancels, leaving Gm1 / Cc');
  eqAt(S, 'GB = A_0\\,\\omega_{p1} = G_{m1}R_1G_{m2}R_2\\cdot\\frac{1}{G_{m2}R_2R_1C_c} = \\frac{G_{m1}}{C_c}', 800, 230, 0.4, { size: 34, w: 1300 });
  S.say(0.4, 'Exactly like the single stage in the ground-up chapter: multiply the gain by the dominant pole and every resistance cancels. What is left is the input $g_m$ over $C_c$.');
  whyBox(S, 220, 330, 1160, 150, '**Read it as a design knob:** for a wanted GB you choose $g_{m1}$ and $C_c$; the resistances (and the gain) do not enter. In hertz: $GBW = \\dfrac{g_{m1}}{2\\pi C_c}$.', 10);
  S.say(10, 'So the GB is a design choice: $g_{m1}$ over $C_c$. Lecture 19 runs this backwards: from the GBW spec and $C_c$ to $g_{m1}$.');
  S.stop(22, {
    src: EX18,
    q: `With ${GIV18}: the unity-gain frequency GB (rad/s)?`,
    hint: ['Input transconductance over the Miller capacitor.', '$GB = \\dfrac{G_{m1}}{C_c}$'],
    how: ['$$GB = \\frac{G_{m1}}{C_c} = \\frac{0.1\\,\\text{mS}}{0.5\\,\\text{pF}} = 2\\times10^{8}\\,\\text{rad/s}$$', 'Check: $$A_0\\,\\omega_{p1} = 2000\\times10^{5} = 2\\times10^{8}$$ ✓ (31.8 MHz).'],
    answer: X18.gb, unit: 'rad/s', tol: 0.02,
  });
  S.say(23, 'GB = 2 × 10⁸ rad/s, the same both ways.');
});

scene(L18, 'Where 60° comes from: three angles', 92, (S) => {
  header(S, 'LEC 18 · PM = 60° AT ω = GB', 'Spend the 120° of lag you may use: 90° + the second pole + the zero');
  pagePeek(S, 'n18b', 1180, 120, 330, 711, 0.4, 16);
  eqAt(S, 'PM = 180^\\circ - \\tan^{-1}\\frac{GB}{\\omega_{p1}} - \\tan^{-1}\\frac{GB}{\\omega_{p2}} - \\tan^{-1}\\frac{GB}{\\omega_z}', 560, 180, 0.4, { size: 28, w: 1060 });
  S.say(0.4, 'At the unity-gain frequency, three things lag: the dominant pole, the second pole, and the right-half-plane zero (which lags like a pole). The phase margin is what is left of 180°.');
  eqAt(S, 'PM = 60^\\circ:\\quad \\tan^{-1}\\frac{GB}{\\omega_{p1}} + \\tan^{-1}\\frac{GB}{\\omega_{p2}} + \\tan^{-1}\\frac{GB}{\\omega_z} \\le 120^\\circ', 560, 270, 8, { size: 26, w: 1060 });
  S.say(8, 'For 60° of margin the three lags together may use at most 120°.');
  eqAt(S, '\\frac{GB}{\\omega_{p1}} = A_0 \\gg 1 \\;\\Rightarrow\\; \\tan^{-1}A_0 \\approx 90^\\circ', 560, 360, 14, { size: 26, w: 1060 });
  S.say(14, 'The first one is easy: $GB/\\omega_{p1}$ is the DC gain, a thousand or more, so it costs essentially the full 90°. That leaves 30° for the second pole and the zero together.');
  S.stop(24, {
    src: EX18,
    q: 'Your page puts the zero at ten times the GB (ωz = 10 GB). How many degrees of lag does the zero cost at ω = GB?',
    hint: ['At ω = GB, the zero’s angle is tan⁻¹(GB/ωz).', '$\\tan^{-1}\\dfrac{1}{10}$'],
    how: ['$$\\tan^{-1}\\frac{GB}{\\omega_z} = \\tan^{-1}\\frac{1}{10} = 5.71^\\circ$$'],
    answer: F.rules.zDeg, unit: '°', tol: 0.01,
  });
  eqAt(S, '90^\\circ + \\tan^{-1}\\frac{GB}{\\omega_{p2}} + 5.71^\\circ \\le 120^\\circ', 560, 450, 24.4, { size: 26, w: 1060 });
  S.say(25, 'So $90° + \\tan^{-1}(GB/\\omega_{p2}) + 5.71° \\le 120°$.');
  S.stop(34, {
    src: EX18,
    q: 'How many degrees may the second pole cost at ω = GB?',
    hint: ['Subtract the dominant pole’s 90° and the zero’s 5.71° from the 120° budget.', '$120 - 90 - 5.71$'],
    how: ['$$\\tan^{-1}\\frac{GB}{\\omega_{p2}} \\le 120 - 90 - 5.71 = 24.29^\\circ$$'],
    answer: F.rules.left, unit: '°', tol: 0.01,
  });
  S.stop(44, {
    src: EX18,
    q: 'So how far above GB must the second pole sit? Find the smallest ratio ωp2 / GB.',
    hint: ['Undo the tan⁻¹: GB/ωp2 ≤ tan(24.29°). Then flip it.', '$\\dfrac{\\omega_{p2}}{GB} \\ge \\dfrac{1}{\\tan 24.29^\\circ}$'],
    how: ['$$\\frac{GB}{\\omega_{p2}} \\le \\tan 24.29^\\circ = 0.451$$', 'Flip both sides: $$\\frac{\\omega_{p2}}{GB} \\ge \\frac{1}{0.451} = 2.2$$'],
    parts: [{ q: 'First $\\tan(24.29^\\circ)$, the largest allowed $GB/\\omega_{p2}$?', answer: F.rules.x, unit: '', tol: 0.01, hint: ['Calculator in degree mode.'], how: ['$$\\tan 24.29^\\circ = 0.451$$'] }],
    answer: F.rules.ratio, unit: '', tol: 0.02,
    calc: [{ what: 'Ratio in one line (degree mode)', keys: '( [tan] ( 120 − 90 − [SHIFT][tan] 0.1 ) ) [SHIFT][^] [EXE]', shows: '2.216' }],
  });
  const rule = html(S, 120, 560, 900, 140, `<div class="whybox"><b>Lec 18’s two rules for PM = 60°</b><br>${rt('$\\omega_z \\ge 10\\,GB$ and $\\omega_{p2} \\ge 2.2\\,GB$')}</div>`);
  rule.style.opacity = 0; S.slideIn(rule, 44.6, 0.7);
  S.say(45, 'The second pole must sit at least 2.2 times above the GB, and the zero at least 10 times. Those are the two boxed results on your page.');
});

scene(L18, 'From rules to transistors: gm6 ≥ 10 gm1, Cc ≥ 0.22 CL', 84, (S) => {
  header(S, 'LEC 18 · DESIGN RULES', 'Turn the two frequency rules into one g_m ratio and one capacitor');
  eqAt(S, '\\omega_z \\ge 10\\,GB:\\quad \\frac{G_{m2}}{C_c} \\ge 10\\,\\frac{G_{m1}}{C_c} \\;\\Rightarrow\\; g_{m6} \\ge 10\\,g_{m1}', 800, 220, 0.4, { size: 30, w: 1300 });
  S.say(0.4, 'Rule one: the zero is $G_{m2}/C_c$ and the GB is $G_{m1}/C_c$. $C_c$ cancels: the second stage needs at least ten times the input pair’s $g_m$. That is why M6 is big and carries a large current.');
  eqAt(S, '\\omega_{p2} \\ge 2.2\\,GB:\\quad \\frac{g_{m6}}{C_L} \\ge 2.2\\,\\frac{g_{m1}}{C_c} \\;\\Rightarrow\\; C_c \\ge 2.2\\,\\frac{g_{m1}}{g_{m6}}\\,C_L', 800, 330, 12, { size: 30, w: 1300 });
  S.say(12, 'Rule two: the second pole $g_{m6}/C_L$ (with $C_1$ small and $C_2 \\approx C_L$) must be 2.2 times $g_{m1}/C_c$. Solve for $C_c$.');
  eqAt(S, 'g_{m6} = 10\\,g_{m1}:\\quad C_c \\ge \\frac{2.2}{10}\\,C_L = 0.22\\,C_L', 800, 440, 22, { size: 32, w: 1300, color: '#ffd38a' });
  S.say(22, 'With $g_{m6}$ exactly ten times $g_{m1}$: $C_c \\ge 0.22\\,C_L$. The first number of every Lecture 19 design.');
  S.stop(32, {
    src: EX18,
    q: 'Tutorial 7’s load is C_L = 2 pF. With g_m6 = 10 g_m1, what is the smallest C_c for PM = 60°?',
    hint: ['The rule of this scene.', '$C_c \\ge 0.22\\,C_L$'],
    how: ['$$C_c \\ge 0.22\\,C_L = 0.22\\times2\\,\\text{pF} = 0.44\\,\\text{pF}$$'],
    answer: 0.44e-12, unit: 'F', tol: 0.02,
  });
  S.stop(42, {
    src: EX18,
    q: 'Suppose you can only afford g_m6 = 5 g_m1 (half the current in M6). The zero now sits at 5 GB. What C_c / C_L is needed for 60° now?',
    hint: ['Redo the budget: the zero now costs tan⁻¹(1/5). What is left sets ωp2/GB, and Cc/CL = (ωp2/GB)·(gm1/gm6).', '$\\frac{C_c}{C_L} = \\frac{1}{\\tan(30^\\circ - \\tan^{-1}0.2)}\\cdot\\frac{1}{5}$'],
    how: ['The zero at $5\\,GB$ costs $$\\tan^{-1}\\frac15 = 11.31^\\circ$$', 'Left for the second pole: $$30 - 11.31 = 18.69^\\circ \\;\\Rightarrow\\; \\frac{\\omega_{p2}}{GB} \\ge \\frac{1}{\\tan18.69^\\circ} = 2.95$$', 'With $g_{m6} = 5g_{m1}$: $$C_c \\ge 2.95\\times\\frac{g_{m1}}{g_{m6}}C_L = \\frac{2.95}{5}C_L = 0.59\\,C_L$$'],
    parts: [{ q: 'First, the angle left for the second pole (30° minus the zero’s lag)?', answer: 30 - Math.atan(0.2) * 180 / Math.PI, unit: '°', tol: 0.01, hint: ['$30^\\circ - \\tan^{-1}(1/5)$'], how: ['$$30 - 11.31 = 18.69^\\circ$$'] }],
    why: 'Saving current in M6 costs capacitance: $C_c$ grows from 0.22 to 0.59 $C_L$, and a bigger $C_c$ means a smaller GB (or more $g_{m1}$) and a smaller slew rate.',
    answer: FN.pmRules(60, 5).ccOverCl, unit: '', tol: 0.02,
  });
  S.say(43, '0.44 pF for Tutorial 7; and halving $g_{m6}$ would push $C_c$ to 0.59 $C_L$. Everything is a trade.');
});

scene(L18, 'Check the example: its phase margin', 52, (S) => {
  header(S, 'LEC 18 · CHECK', 'Put the example’s GB, ωp2 and ωz back into the PM formula');
  eqAt(S, 'PM = 180^\\circ - 90^\\circ - \\tan^{-1}\\frac{GB}{\\omega_{p2}} - \\tan^{-1}\\frac{GB}{\\omega_z}', 800, 220, 0.4, { size: 30, w: 1300 });
  S.say(0.4, 'Back to our example. From the earlier stops: $GB = 2\\times10^8$, $\\omega_{p2} \\approx 4.76\\times10^8$, $\\omega_z = 2\\times10^9$ rad/s.');
  S.stop(8, {
    src: EX18,
    q: 'Using GB = 2×10⁸, ωp2 ≈ 4.76×10⁸ and ωz = 2×10⁹ rad/s (from the stops above), what is the phase margin?',
    hint: ['Two angles to subtract after the 90°.', '$90^\\circ - \\tan^{-1}\\frac{2}{4.76} - \\tan^{-1}\\frac{2}{20}$'],
    how: ['Second pole: $$\\tan^{-1}\\frac{2\\times10^8}{4.76\\times10^8} = 22.8^\\circ$$', 'Zero: $$\\tan^{-1}\\frac{2\\times10^8}{2\\times10^9} = 5.71^\\circ$$', '$$PM = 90 - 22.8 - 5.71 = 61.5^\\circ$$'],
    parts: [{ q: 'The second pole’s lag at GB?', answer: Math.atan(X18.gb / X18.wp2a) * 180 / Math.PI, unit: '°', tol: 0.01, hint: ['$\\tan^{-1}(GB/\\omega_{p2})$'], how: ['$$\\tan^{-1}(2/4.76) = 22.8^\\circ$$'] }],
    answer: FN.pm2(X18.gb, X18.wp2a, X18.wz), unit: '°', tol: 0.01,
  });
  whyBox(S, 220, 330, 1160, 160, '**Why just over 60°?** Here $C_c/C_L = 0.25 > 0.22$ and $g_{m6} = 10g_{m1}$, so both rules hold with a little room. With the exact $\\omega_{p2}$ ($4.0\\times10^8$, since $C_1$ is not tiny) it would be 57.7°: real designs keep some margin.', 9);
  S.say(9, '61.5°: both rules are met with a little room. Using the exact second pole it would be 57.7°, which is why designers do not sit exactly on 0.22.');
});

scene(L18, 'Lecture 18 in one card', 30, (S) => {
  header(S, 'LEC 18 · CARD', 'Two poles, one RHP zero, three rules');
  remember(S, ['$A_0 = G_{m1}R_1\\cdot G_{m2}R_2$, $G_{m1} = g_{m1}$, $G_{m2} = g_{m6}$, $R_1 = r_{O2}\\parallel r_{O4}$, $R_2 = r_{O6}\\parallel r_{O7}$.',
    '$\\omega_{p1} \\approx \\dfrac{1}{G_{m2}R_2R_1C_c}$ (Miller) · $\\omega_{p2} \\approx \\dfrac{G_{m2}}{C_1 + C_2} \\approx \\dfrac{g_{m6}}{C_L}$ · $\\omega_z = \\dfrac{G_{m2}}{C_c}$ (RHP).',
    '$GB = A_0\\omega_{p1} = \\dfrac{g_{m1}}{C_c}$.',
    '$PM = 180° - \\tan^{-1}\\frac{GB}{\\omega_{p1}} - \\tan^{-1}\\frac{GB}{\\omega_{p2}} - \\tan^{-1}\\frac{GB}{\\omega_z}$, first term ≈ 90°.',
    'PM = 60°: $\\omega_z \\ge 10\\,GB$ (5.71°) and $\\omega_{p2} \\ge 2.2\\,GB$ (24.3°).',
    '→ $g_{m6} \\ge 10\\,g_{m1}$ and $C_c \\ge 0.22\\,C_L$.'], 0.4, 'Lecture 18 in one card');
  S.say(0.4, 'Lecture 18 in six lines: the dictionary, the two poles and the zero, the GB, the phase-margin sum, and the two rules that become $g_{m6} \\ge 10g_{m1}$ and $C_c \\ge 0.22C_L$.');
}, { recall: ['The dominant pole is one over G m 2 R 2 R 1 C c.', 'The second pole is about g m 6 over C L.', 'G B is g m 1 over C c.', 'For sixty degrees: the zero at ten G B, the second pole at 2.2 G B, so g m 6 at least ten g m 1 and C c at least 0.22 C L.'] });
