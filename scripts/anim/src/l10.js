/* Lecture 10: CM and DM, the CMFB loop, resistive and source-follower sensing. */
'use strict';
/* intermediates of the past papers, computed from the givens (they reproduce the bank's answers) */
const Q24 = (() => { // Quiz 2 2024 Q2
  const lam = 0.2, Ad = 50, vdd = 1.8, vthn = 0.4;
  const vov1 = 1 / (lam * Ad), vov5 = 2 * vov1, vov3 = 3 * vov1, vomin = vov5 + vov1, vomax = vdd - vov3, vref = (vomin + vomax) / 2;
  const vgs1 = vthn + vov1, vinmin = vov5 + vgs1, vinmax = vref + vthn, dvo = 2 * 0.01 * vref, dvin = vinmax - vinmin;
  return { vov1, vov5, vov3, vomin, vomax, vref, vgs1, vinmin, vinmax, dvo, dvin };
})();
const T5V = (() => { // Tutorial 5 Q3 = mid-sem 2024 Q1 (W/L = 50 for all)
  const un = 100e-6, up = 50e-6, WL = 50, I1 = 50e-6, I2 = 200e-6, R = 10e6, ln = 0.1, lp = 0.2, vdd = 1.8, vthn = 0.4;
  const id1 = I1, id5 = 2 * I1, id7 = I2 / 2;
  const gm1 = Math.sqrt(2 * un * WL * id1), rO1 = 1 / (ln * id1), rO3 = 1 / (lp * I1), rO5 = 1 / (ln * id5);
  const par = 1 / (1 / rO1 + 1 / rO3 + 1 / R), inv = 1 / gm1;
  const vov1 = Math.sqrt(2 * id1 / (un * WL)), vov5 = Math.sqrt(2 * id5 / (un * WL)), vov3 = Math.sqrt(2 * I1 / (up * WL));
  const vocm = (vov5 + vov1 + vdd - vov3) / 2, vinmin = vov5 + vthn + vov1, vinmax = vocm + vthn, dvo = 2 * 0.01 * vocm;
  const gm7 = Math.sqrt(2 * up * WL * id7), gm9 = Math.sqrt(2 * un * WL * id7), gm5 = Math.sqrt(2 * un * WL * id5);
  const R9 = 1 / (gm9 + ln * id7 + lp * id7), Rdn = rO1 + 2 * rO5 * (1 + gm1 * rO1), T = (gm7 / 2) * R9 * gm5 * 0.5 / (1 / rO3 + 1 / Rdn);
  return { id1, gm1, rO1, rO3, rO5, par, inv, vov1, vov5, vov3, vocm, vinmin, vinmax, dvo, gm7, gm5, R9, Rdn, T };
})();
const L10 = 'Lec 10 · CMFB: structure & sensing';

scene(L10, 'Common mode and differential mode', 62, (S) => {
  header(S, 'LEC 10 · YOUR PAGE, TOP', 'Any two signals = a shared part (CM) + a difference (DM)');
  eqAt(S, 'V_{in1} = \\underbrace{\\frac{V_{in1}+V_{in2}}{2}}_{\\text{CM}} + \\underbrace{\\frac{V_{in1}-V_{in2}}{2}}_{\\text{DM}/2}', 520, 215, 0.4, { size: 32, w: 900, h: 170 });
  eqAt(S, 'V_{in2} = \\frac{V_{in1}+V_{in2}}{2} + \\frac{V_{in2}-V_{in1}}{2}', 520, 345, 3, { size: 32, w: 900 });
  S.say(0.4, 'Your page starts with an identity that is always true: each input is the <b>average</b> of the two (the common mode) plus half the <b>difference</b>.');
  S.say(3, 'The CM part is the same in both. The DM part has equal size and <b>opposite</b> sign. Nothing else is needed to describe two signals.');
  // waveform: two inputs, then decomposition
  const x0 = 980, x1 = 1520, yc = 330;
  const ax = S.g(); S.el('rect', { x: x0 - 20, y: 150, width: x1 - x0 + 40, height: 360, rx: 14, fill: '#0f1520', stroke: '#1f2938' }, ax);
  txt(S, x0, 182, 'V_in1 and V_in2', { size: 19, color: C.muted }, ax);
  S.fade(ax, 6, 0.6);
  const cm = S.el('line', { x1: x0, y1: yc, x2: x1, y2: yc, stroke: C.amb, 'stroke-width': 2.4, 'stroke-dasharray': '8 6' });
  S.fade(cm, 10, 0.6);
  label(S, x1 - 4, yc - 12, 'V_CM (the average)', 10, { size: 19, color: C.amb, anchor: 'end', weight: 700 });
  const s1 = sine(S, x0, x1, yc, 90, { color: C.n, cycles: 2 }); S.draw(s1, 6.5, 1.5);
  const s2 = sine(S, x0, x1, yc, -90, { color: C.p, cycles: 2 }); S.draw(s2, 7, 1.5);
  S.say(6.5, 'Picture it: two sine waves moving in opposite directions around a shared level. That shared level is $V_{CM}$; the swinging part is the differential signal.');
  const cmov = S.g();
  S.anim(16, 8, 'cmshift', (p) => { const dy = -60 * Math.sin(Math.PI * p); [cm, s1, s2].forEach((e) => e.setAttribute('transform', `translate(0 ${dy})`)); }, E.inout);
  S.say(16, 'Change only the CM and <b>both</b> waves slide up together; the difference does not change. Change only the DM and they move further apart; the average stays put.');
  whyBox(S, 120, 420, 760, 190, '**Why this split matters for a fully differential op amp:** the **DM** part is the signal we amplify — it moves the outputs in **opposite** directions. The **CM** part moves both outputs **together**, and nothing in the amplifier itself controls it.', 26);
  S.say(26, '<span class="why">Why we care:</span> at the outputs, the differential part is our signal. The common part — the outputs’ shared DC level — is not controlled by anything yet.');
  const tb = html(S, 120, 640, 760, 200, `<table class="tbl"><tr><th></th><th>moves the outputs</th><th>who controls it?</th></tr>
    <tr><td>DM ($v_d$)</td><td>opposite ways (the signal)</td><td class="same">the gain $A_d$</td></tr>
    <tr><td>CM</td><td>together</td><td class="chg">nobody yet → CMFB</td></tr></table>`.replace(/\$([^$]+)\$/g, (m) => rt(m)));
  tb.style.opacity = 0; S.slideIn(tb, 34, 0.7);
  S.say(34, 'Lecture 9 showed what goes wrong: with current-source loads the output CM is set by a tiny current mismatch times a huge resistance. Lecture 10 builds the loop that fixes it.');
});

/* general CMFB structure of the page */
function cmfbGeneral(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 240, 760, 170);
  isrc(S, 360, 240, { label: 'I_1', left: true }); isrc(S, 600, 240, { label: 'I_1' });
  wire(S, [[360, 170], [360, 198]]); wire(S, [[600, 170], [600, 198]]);
  wire(S, [[360, 282], [360, 380]]); wire(S, [[600, 282], [600, 380]]); dot(S, 360, 320); dot(S, 600, 320);
  txt(S, 348, 314, 'V_out1', { size: 19, color: C.volt, weight: 700, anchor: 'end' }); txt(S, 612, 300, 'V_out2', { size: 19, color: C.volt, weight: 700 });
  nmos(S, 360, 430, { name: 'M1', gate: 'V_in1' }); nmos(S, 600, 430, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[360, 480], [360, 500], [600, 500], [600, 480]]);
  isrc(S, 480, 550, { label: 'I_SS', len: 50 }); gnd(S, 480, 600);
  // sensing box and amplifier
  S.el('rect', { x: 860, y: 240, width: 220, height: 120, rx: 12, fill: 'rgba(96,165,250,0.07)', stroke: C.volt, 'stroke-width': 2.4 });
  txt(S, 970, 290, 'CM sensing', { size: 21, color: C.volt, weight: 700, anchor: 'middle' }); txt(S, 970, 318, 'circuit', { size: 21, color: C.volt, weight: 700, anchor: 'middle' });
  wire(S, [[360, 320], [360, 210], [820, 210], [820, 270], [860, 270]]); wire(S, [[600, 320], [790, 320], [790, 330], [860, 330]]);
  wire(S, [[970, 360], [970, 450], [940, 450]]); txt(S, 982, 420, 'V_out,CM', { size: 19, color: C.amb, weight: 700 });
  const A = amp(S, 940, 470, { left: true, w: 120, h: 110, label: 'A_CMFB', lsize: 17, lpos: 0.52 }); // label clear of the ± signs
  wire(S, [[960, 498], [1040, 498]]); txt(S, 1048, 505, 'V_REF', { size: 20, color: C.muted });
  wire(S, [[820, 470], [700, 470], [700, 550], [501, 550]]);
  r();
  return g;
}

/* draw into a group shifted down by dy (to match a figure's position inside a past-paper frame) */
function l10Shift(S, dy, fn, tr) {
  const G = S.g(); G.setAttribute('transform', tr || `translate(0 ${dy})`);
  const r = S.into(G); fn(); r();
  return G;
}

scene(L10, 'Follow the current: the pair that CMFB controls', 72, (S) => {
  header(S, 'LEC 10 · FOLLOW THE CURRENT', 'Where I_1 and I_SS flow, and why they must agree');
  const g = cmfbGeneral(S);
  S.draw(g, 0.3, 2.2);
  S.say(0.3, 'Before the CMFB loop, follow the currents in the amplifier it controls. Two rules: in an NMOS, current flows from drain to source, downwards. And current never chooses a path: the sources set it, the devices share it.');
  current(S, [[480, 503], [480, 598]], 7, null, 'I_SS', { at: [405, 578], color: C.ok });
  S.say(7, 'Start at the bottom. The tail source pulls $I_{SS}$ out of node P, where the sources of M1 and M2 meet, and sends it to ground.');
  current(S, [[360, 330], [360, 500], [474, 500]], 13, 40, 'I_SS/2', { at: [292, 522], color: C.n });
  current(S, [[600, 330], [600, 500], [486, 500]], 13, 40, 'I_SS/2', { at: [612, 594], color: C.p });
  eqAt(S, '\\text{KCL at P: } I_{SS} = I_{D1} + I_{D2}', 420, 700, 13, { size: 28, w: 700, out: 40 });
  S.say(13, 'That current reaches P through M1 and M2. KCL at P: $I_{SS} = I_{D1} + I_{D2}$. With equal inputs the pair is symmetric, so each side carries half, $I_{SS}/2$.');
  current(S, [[360, 172], [360, 318]], 20, null, null, { color: C.amb });
  current(S, [[600, 172], [600, 318]], 20, null, null, { color: C.amb });
  S.say(20, 'At the top, each load source pushes $I_1$ down from $V_{DD}$ into its output node.');
  eqAt(S, '\\text{KCL at } V_{out1}\\text{: } I_1 = I_{D1}', 420, 780, 26, { size: 28, w: 700, out: 40 });
  S.say(26, 'KCL at each output: $I_1$ comes in and $I_{D1}$ goes out, so they must be equal. But two separate sources set them. Any mismatch has nowhere to go except the node’s huge resistance: that is the Lecture 9 drift.');
  S.stop(34, {
    src: 'Exam-style check',
    q: 'Example: each load source gives $I_1 = 0.5$ mA. For neither output to drift, how much current must the tail carry?',
    hint: ['KCL at each output node: what the load pushes in must leave through the input transistor. Then KCL at node P.',
      '$I_{D1} = I_{D2} = I_1$, $\\;I_{SS} = I_{D1} + I_{D2}$'],
    how: ['At $V_{out1}$, current in = current out, so M1 must carry the load’s current: $$I_{D1} = I_1 = 0.5\\,\\text{mA}$$',
      'Same at $V_{out2}$: $$I_{D2} = I_1 = 0.5\\,\\text{mA}$$',
      'Node P collects both and sends them into the tail: $$I_{SS} = I_{D1} + I_{D2} = 0.5 + 0.5 = 1\\,\\text{mA}$$'],
    why: 'The tail must equal exactly $2I_1$. Nothing guarantees that by itself, so the CMFB loop trims the tail until it does.',
    answer: 1e-3, unit: 'A', tol: 0.02,
  });
  S.flow([[820, 470], [700, 470], [700, 550], [501, 550]], 34.5, 40, { color: C.amb, speed: 50 });
  const tr = chip(S, 780, 612, 'CMFB trims I_SS to 2I_1', { color: C.amb, size: 18 }); tr.style.opacity = 0; S.pop(tr, 34.5); S.out(tr, 40);
  S.say(34.5, 'That is the CMFB amplifier’s job: it trims the tail until $I_{SS} = 2I_1$ exactly. Then both output nodes balance and nothing drifts.');
  current(S, [[360, 330], [360, 500], [474, 500]], 41, null, 'I_SS/2 + ΔI', { at: [268, 522], color: C.n });
  current(S, [[600, 330], [600, 500], [486, 500]], 41, null, 'I_SS/2 − ΔI', { at: [622, 594], color: C.p });
  eqAt(S, '\\left(\\tfrac{I_{SS}}{2}+\\Delta I\\right) + \\left(\\tfrac{I_{SS}}{2}-\\Delta I\\right) = I_{SS}', 420, 720, 41, { size: 28, w: 760, color: '#ffd38a' });
  S.say(41, 'Now a small differential input: $V_{in1}$ up a little, $V_{in2}$ down. M1 takes $\\Delta I$ more, M2 gives up the same $\\Delta I$. The total is still $I_{SS}$: the tail does not care how it is shared.');
  S.stop(49, {
    src: 'Exam-style check',
    q: 'With this differential input, M1 carries $I_{SS}/2 + \\Delta I$ and M2 carries $I_{SS}/2 - \\Delta I$, while each load still gives exactly $I_1 = I_{SS}/2$. What do the two outputs do?',
    choices: ['$V_{out1}$ falls and $V_{out2}$ rises: their average stays put',
      'Both outputs fall together',
      'Both outputs rise together',
      'Nothing moves: the tail absorbs $\\Delta I$'],
    answer: 0,
    hint: ['Do KCL at each output: compare what the load pushes in with what the input transistor pulls out.',
      'At $V_{out1}$: in $= I_{SS}/2$, out $= I_{SS}/2 + \\Delta I$. A node that loses charge falls.'],
    how: ['At $V_{out1}$ M1 pulls more than the load gives: $$I_{out} - I_{in} = \\left(\\tfrac{I_{SS}}{2}+\\Delta I\\right) - \\tfrac{I_{SS}}{2} = \\Delta I$$ The extra $\\Delta I$ is drawn out of the node, so $V_{out1}$ **falls**.',
      'At $V_{out2}$ M2 pulls $\\Delta I$ less than its load gives, so the node charges up and $V_{out2}$ **rises**.',
      'Equal and opposite moves: the average (the CM) is unchanged. “Both together” would need the **total** to change, and the tail keeps it at $I_{SS}$.'],
    why: 'A differential input only re-shares $I_{SS}$, so the CMFB loop never sees it.',
  });
  const d1 = chip(S, 480, 284, 'V_out1 ↓', { color: C.volt, size: 18 }); d1.style.opacity = 0; S.pop(d1, 49.4);
  const d2 = chip(S, 480, 352, 'V_out2 ↑', { color: C.volt, size: 18 }); d2.style.opacity = 0; S.pop(d2, 49.6);
  S.say(49.4, 'M1 pulls $\\Delta I$ more than its load gives, so $V_{out1}$ falls; $V_{out2}$ rises by the same amount. The average does not move, so the CMFB loop sees nothing.');
  remember(S, [
    'Direction: NMOS drain → source (down); a load source pushes current **down** from $V_{DD}$ into its output node.',
    'KCL at P: $I_{SS} = I_{D1} + I_{D2}$. Equal inputs ⇒ $I_{SS}/2$ each.',
    'KCL at each output: $I_1 = I_{D1}$ must hold. Any mismatch × the huge node resistance drives the CM to a rail.',
    'CMFB trims the tail until $I_{SS} = 2I_1$ exactly.',
    'Differential input: $I_{SS}/2 \\pm \\Delta I$; the total stays $I_{SS}$, the outputs move oppositely, the CM does not move.',
  ], 58, 'Follow the current · the CMFB pair');
  S.say(58, 'The current rules for this pair, in one card. Sources set the currents; KCL at each node tells you how they split.');
});

scene(L10, 'The CMFB loop: sense, compare, correct', 66, (S) => {
  header(S, 'LEC 10 · GENERAL STRUCTURE', 'Three blocks: a CM sensor, a CMFB amplifier, a current to correct');
  const g = cmfbGeneral(S);
  S.draw(g, 0.3, 2.6);
  S.say(0.3, 'Your page’s general structure. The pair M1, M2 with current-source loads $I_1$ — the amplifier whose output CM floats.');
  S.say(6, '<b>Block 1, the CM sensing circuit:</b> takes $V_{out1}$ and $V_{out2}$ and produces their average, $V_{out,CM}$, ignoring the differential signal.');
  S.say(12, '<b>Block 2, the CMFB amplifier:</b> compares $V_{out,CM}$ with a reference $V_{REF}$ — the level we want.');
  S.say(18, '<b>Block 3, the correction:</b> its output adjusts one current source — here the tail $I_{SS}$.');
  // loop walk-through
  const steps = [
    [24, 'V_out,CM too high ↑', 1260, 400, C.bad],
    [28, 'amp output ↑', 620, 620, C.amb],
    [32, 'I_SS ↑ (pulls harder)', 330, 600, C.cur],
    [36, 'both outputs pulled ↓', 210, 380, C.volt],
  ];
  steps.forEach(([t, s, x, y, col]) => { const c = chip(S, x, y, s, { color: col, size: 19 }); c.style.opacity = 0; S.pop(c, t); S.out(c, 46, 0.5); });
  S.flow([[970, 360], [970, 450], [940, 450]], 24, 46, { color: C.bad, speed: 50 });
  S.flow([[820, 470], [700, 470], [700, 550], [501, 550]], 28, 46, { color: C.amb, speed: 50 });
  S.flow([[480, 500], [480, 600]], 32, 46, { color: C.cur, speed: 80, w: 5 });
  S.say(24, 'Follow the loop. Suppose the outputs drift <b>up</b>: $V_{out,CM}$ exceeds $V_{REF}$…');
  S.say(28, '…the CMFB amplifier’s output rises…');
  S.say(32, '…the tail pulls more current…');
  S.say(36, '…and both outputs are pulled back <b>down</b>. Negative feedback: it settles where $V_{out,CM} = V_{REF}$.');
  whyBox(S, 1000, 600, 560, 220, '**Why it does not touch the signal:** a differential signal raises one output and lowers the other, so the **average does not change** — the sensor sees nothing, and the loop stays quiet. Only the common level is corrected.', 42);
  S.say(42, '<span class="why">Key point:</span> the differential signal leaves the average unchanged, so the CMFB loop never fights the signal. It only fixes the shared level.');
});

/* resistive sensing */
function resSense(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 300, 760, 170);
  const m3 = pmos(S, 400, 230, { name: 'M3', right: true, gl: 30, nameSide: 'l' }); const m4 = pmos(S, 640, 230, { name: 'M4', gl: 30 });
  wire(S, [[m3.gate[0], 230], [m4.gate[0], 230]]); txt(S, 520, 220, 'V_b', { size: 18, color: C.muted, anchor: 'middle' });
  wire(S, [[400, 170], [400, 180]]); wire(S, [[640, 170], [640, 180]]);
  wire(S, [[400, 280], [400, 380]]); wire(S, [[640, 280], [640, 380]]); dot(S, 400, 320); dot(S, 640, 320);
  resh(S, 400, 520, 320, { label: 'R_1' }); resh(S, 520, 640, 320, { label: 'R_2' }); dot(S, 520, 320);
  wire(S, [[520, 320], [520, 360]]); txt(S, 520, 384, 'V_out,CM', { size: 19, color: C.amb, weight: 700, anchor: 'middle' });
  txt(S, 388, 314, 'V_out1', { size: 19, color: C.volt, weight: 700, anchor: 'end' }); txt(S, 652, 300, 'V_out2', { size: 19, color: C.volt, weight: 700 });
  nmos(S, 400, 430, { name: 'M1', gate: 'V_in1' }); nmos(S, 640, 430, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[400, 480], [400, 500], [640, 500], [640, 480]]); isrc(S, 520, 545, { label: 'I_SS', len: 45 }); gnd(S, 520, 590);
  r();
  return g;
}

scene(L10, 'Follow the current: resistive CM sensing', 62, (S) => {
  header(S, 'LEC 10 · FOLLOW THE CURRENT', 'Bias currents go down; the resistor current goes across');
  const g = resSense(S);
  S.draw(g, 0.3, 2.2);
  S.say(0.3, 'The same pair, now with PMOS loads M3 and M4 and two sensing resistors between the outputs. Follow the bias currents first, then the resistor current.');
  current(S, [[520, 503], [520, 588]], 6, null, 'I_SS', { at: [452, 566], color: C.ok });
  current(S, [[400, 172], [400, 500], [514, 500]], 6, null, 'I_SS/2', { at: [334, 518], color: C.n });
  current(S, [[640, 172], [640, 500], [526, 500]], 6, null, 'I_SS/2', { at: [706, 518], color: C.p });
  S.say(6, 'Bias first. The tail pulls $I_{SS}$ out of node P. M3 and M4 each push $I_{SS}/2$ down from $V_{DD}$, straight through M1 and M2. PMOS: source to drain. NMOS: drain to source. Both downwards.');
  eqAt(S, 'V_{out1} = V_{out2} \\;\\Rightarrow\\; I_R = 0', 1180, 230, 13, { size: 28, w: 700 });
  S.say(13, 'At rest both outputs sit at the same voltage. No voltage across $R_1$ and $R_2$ means no current in them.');
  current(S, [[402, 320], [520, 320], [638, 320]], 20, 39, 'I_R', { at: [520, 268], color: C.pink });
  eqAt(S, 'I_R = \\frac{V_{out1} - V_{out2}}{R_1 + R_2}', 1180, 330, 20, { size: 30, w: 700 });
  S.say(20, 'Now a differential output: $V_{out1}$ up, $V_{out2}$ down. A current $I_R$ flows from the higher output, through $R_1$ and $R_2$, into the lower one. The midpoint stays at the average.');
  S.stop(27, {
    src: 'Exam-style check',
    q: 'Example: $V_{out1} = 1.0$ V, $V_{out2} = 0.8$ V, $R_1 = R_2 = 10$ kΩ. How much current flows through the sensing resistors?',
    hint: ['The two resistors are in series between the outputs, so one current flows through both; only the difference of the outputs drives it.',
      '$I_R = \\dfrac{V_{out1} - V_{out2}}{R_1 + R_2}$'],
    how: ['In series, the resistances add: $$R_1 + R_2 = 10 + 10 = 20\\,\\text{k}\\Omega$$',
      'The voltage across the pair is the output difference: $$V_{out1} - V_{out2} = 1.0 - 0.8 = 0.2\\,\\text{V}$$',
      'Ohm’s law gives the current, flowing from $V_{out1}$ to $V_{out2}$: $$I_R = \\frac{0.2\\,\\text{V}}{20\\,\\text{k}\\Omega} = 10\\,\\mu\\text{A}$$'],
    why: 'Only the differential part of the outputs drives current through the sensing resistors.',
    answer: 1e-5, unit: 'A', tol: 0.02,
  });
  eqAt(S, '= \\frac{0.2\\,\\text{V}}{20\\,\\text{k}\\Omega} = 10\\,\\mu\\text{A}', 1180, 420, 27.4, { size: 28, w: 700, color: '#ffd38a' });
  eqAt(S, '\\text{KCL at } V_{out1}\\text{: } I_{D3} = I_{D1} + I_R', 1180, 510, 32, { size: 28, w: 700 });
  S.say(32, 'Where does $I_R$ come from? KCL at $V_{out1}$: M3’s current now feeds both M1 and the resistor. The resistor takes signal current away from the output node. That is the gain loss: $R_1$ appears in parallel with $r_O$.');
  S.stop(40, {
    src: 'Exam-style check',
    q: 'Now both outputs rise by 50 mV together (a pure CM change), with $R_1 = R_2 = 10$ kΩ. What change of current flows in $R_1$?',
    choices: ['Zero: both ends of $R_1$ move together',
      '$50\\,\\text{mV}/10\\,\\text{k}\\Omega = 5\\,\\mu$A',
      '$50\\,\\text{mV}/20\\,\\text{k}\\Omega = 2.5\\,\\mu$A'],
    answer: 0,
    hint: ['A resistor carries current only when there is a voltage **across** it.',
      'In CM the midpoint is the average of the outputs, so it rises by the same 50 mV.'],
    how: ['The midpoint is the average, so it rises with the outputs: $$\\Delta V_{mid} = \\frac{0.05 + 0.05}{2} = 0.05\\,\\text{V}$$',
      'The voltage across $R_1$ does not change: $$\\Delta V_{R1} = \\Delta V_{out1} - \\Delta V_{mid} = 0.05 - 0.05 = 0$$',
      'No voltage across, no current. The tempting 5 µA uses 50 mV as if the midpoint stayed still: that only happens for a **differential** change.'],
    why: 'In the CM half circuit the R’s are open; in the DM half circuit their midpoint is AC ground.',
  });
  eqAt(S, '\\text{CM: } \\Delta V_{R1} = 0 \\;\\Rightarrow\\; \\Delta I_R = 0', 1180, 600, 40.4, { size: 28, w: 700, color: C.ok });
  S.say(40.4, 'In common mode the midpoint rises with the outputs, so no extra current flows. The sensing resistors carry only the differential current.');
  remember(S, [
    'Bias: M3, M4 push $I_{SS}/2$ each down through M1, M2 into the tail $I_{SS}$.',
    'Differential output: $I_R = \\frac{V_{out1} - V_{out2}}{R_1 + R_2}$ flows across, from the higher output to the lower.',
    'KCL at $V_{out1}$: $I_{D3} = I_{D1} + I_R$. The resistor steals signal current: $R_1 \\parallel r_O$ lowers the gain.',
    'Common-mode change: no voltage across the R’s, no current.',
  ], 48, 'Follow the current · resistive sensing');
  S.say(48, 'The current rules for resistive sensing: bias currents go down, the resistor current goes across, and only for a differential signal.');
});

scene(L10, 'Sensing with two resistors (and its cost)', 64, (S) => {
  header(S, 'LEC 10 · SENSING CIRCUIT 1', 'Two equal resistors average the outputs');
  const g = resSense(S);
  S.draw(g, 0.3, 2.2);
  S.say(0.3, 'The simplest CM sensor: two resistors $R_1 = R_2$ in series between the outputs. Their midpoint is the CM.');
  const ln = [
    ['V_{out}\\big|_{V_{out1}} = V_{out1}\\,\\frac{R_2}{R_1+R_2}', 6, 'Why the midpoint is the average — superposition (your page). Keep only $V_{out1}$ (set $V_{out2}$ to 0): a divider gives $V_{out1}R_2/(R_1+R_2)$.'],
    ['V_{out}\\big|_{V_{out2}} = V_{out2}\\,\\frac{R_1}{R_1+R_2}', 12, 'Keep only $V_{out2}$: $V_{out2}R_1/(R_1+R_2)$.'],
    ['V_{out,CM} = V_{out1}\\frac{R_2}{R_1+R_2} + V_{out2}\\frac{R_1}{R_1+R_2} = \\frac{V_{out1}+V_{out2}}{2}', 17, 'Add them; with $R_1 = R_2$ every factor is ½: exactly the average.'],
  ];
  ln.forEach(([tex, t, say], i) => { eqAt(S, tex, 1180, 220 + i * 95, t, { size: i === 2 ? 25 : 30, w: 780, color: i === 2 ? '#ffd38a' : C.text }); S.say(t, say); });
  // the cost
  S.ring(460, 320, 22, C.bad, 26, 44);
  eqAt(S, '\\text{without: } A_v = g_{m1}(r_{O1}\\parallel r_{O3})', 1180, 560, 26, { size: 28, w: 760, color: C.muted });
  eqAt(S, '\\text{with: } A_v = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R_1)', 1180, 630, 30, { size: 30, w: 760, color: '#ff8f86' });
  S.say(26, '<span class="why">The cost:</span> for the differential signal the midpoint is AC ground, so each output now has $R_1$ hanging on it — in parallel with $r_{O1}\\parallel r_{O3}$.');
  S.say(32, 'Unless $R_1$ is far bigger than $r_O$ (megohms), the gain drops. That is why Tutorial 5 Q3 uses R = 10 MΩ — and still loses a little.');
  whyBox(S, 820, 700, 740, 120, '**Fix:** isolate the outputs from the resistors with source followers (next scene).', 40);
  S.say(40, 'The fix on your page: put a source follower between each output and its resistor, so the resistors never touch the high-resistance outputs.');
});

/* source-follower sensing: main pair in the middle, followers M5, M6 at the sides, R1, R2 along the bottom */
function sfSense(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 120, 1300, 160);
  // main amp
  const m3 = pmos(S, 560, 220, { name: 'M3', right: true, gl: 26, nameSide: 'l' }); const m4 = pmos(S, 800, 220, { name: 'M4', gl: 26 });
  wire(S, [[m3.gate[0], 220], [m4.gate[0], 220]]); txt(S, 680, 210, 'V_b', { size: 18, color: C.muted, anchor: 'middle' });
  wire(S, [[560, 160], [560, 170]]); wire(S, [[800, 160], [800, 170]]);
  wire(S, [[560, 270], [560, 380]]); wire(S, [[800, 270], [800, 380]]); dot(S, 560, 310); dot(S, 800, 310);
  txt(S, 572, 304, '0.9', { size: 18, color: C.volt, weight: 700 }); txt(S, 788, 304, '0.9', { size: 18, color: C.volt, weight: 700, anchor: 'end' });
  nmos(S, 560, 430, { name: 'M1', gate: 'V_in1' }); nmos(S, 800, 430, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[560, 480], [560, 500], [800, 500], [800, 480]]); isrc(S, 680, 545, { label: 'I_SS', len: 45 }); gnd(S, 680, 590);
  // followers
  const m5 = nmos(S, 320, 310, { name: 'M5', right: true, gl: 40, nameSide: 'l' }); wire(S, [[320, 160], [320, 260]]);
  wire(S, [[m5.gate[0], 310], [560, 310]]);
  wire(S, [[320, 360], [320, 420]]); dot(S, 320, 390); txt(S, 308, 386, '0.5', { size: 18, color: C.amb, weight: 700, anchor: 'end' });
  isrc(S, 320, 470, { label: 'I_1', left: true }); gnd(S, 320, 512);
  const m6 = nmos(S, 1040, 310, { name: 'M6', gl: 40 }); wire(S, [[1040, 160], [1040, 260]]);
  wire(S, [[m6.gate[0], 310], [800, 310]]);
  wire(S, [[1040, 360], [1040, 420]]); dot(S, 1040, 390); txt(S, 1052, 386, '0.5', { size: 18, color: C.amb, weight: 700 });
  isrc(S, 1040, 470, { label: 'I_2' }); gnd(S, 1040, 512);
  wire(S, [[320, 390], [420, 390], [420, 640], [560, 640]]); resh(S, 560, 680, 640, { label: 'R_1' }); resh(S, 680, 800, 640, { label: 'R_2' }); wire(S, [[800, 640], [960, 640], [960, 390], [1040, 390]]);
  dot(S, 680, 640); wire(S, [[680, 640], [680, 690]]); txt(S, 680, 714, 'V_sense', { size: 19, color: C.amb, weight: 700, anchor: 'middle' });
  r();
  return g;
}

scene(L10, 'Follow the current: source-follower sensing', 56, (S) => {
  header(S, 'LEC 10 · FOLLOW THE CURRENT', 'Who supplies the resistor current? The followers, not the outputs');
  const g = sfSense(S);
  S.draw(g, 0.3, 2.4);
  S.say(0.3, 'The follower sensor. Three separate groups of current live here: the main pair, follower M5 with $I_1$, and follower M6 with $I_2$.');
  current(S, [[320, 162], [320, 510]], 5, null, null, { color: C.n });
  current(S, [[1040, 162], [1040, 510]], 5, null, null, { color: C.p });
  S.say(5, 'The followers carry their own bias. $I_1$ flows from $V_{DD}$ down through M5, drain to source, into its current source. $I_2$ does the same through M6.');
  current(S, [[560, 162], [560, 500], [674, 500]], 11, null, null, { color: C.cur });
  current(S, [[800, 162], [800, 500], [686, 500]], 11, null, null, { color: C.cur });
  current(S, [[680, 503], [680, 588]], 11, null, null, { color: C.ok });
  S.say(11, 'The main pair is unchanged: $I_{SS}$ in the tail, half down each side. The outputs touch only the followers’ gates, and a gate takes no current, so these groups never mix.');
  const pR = [[322, 390], [420, 390], [420, 640], [680, 640], [960, 640], [960, 390], [1038, 390]];
  current(S, pR, 18, null, 'I_R', { at: [540, 682], color: C.pink });
  S.say(18, 'Now a differential signal: M5’s source goes up, M6’s goes down. A current $I_R$ flows out of M5’s source, through $R_1$ and $R_2$, into M6’s source.');
  S.stop(25, {
    src: 'Exam-style check',
    parts: [{ q: 'First: how much current $I_R$ flows through $R_1$ and $R_2$?', answer: 0.2 / 100e3, unit: 'A', tol: 0.02,
      hint: '$I_R = \\dfrac{V_{S5} - V_{S6}}{R_1 + R_2}$', how: ['$$I_R = \\frac{0.6 - 0.4}{50\\,\\text{k} + 50\\,\\text{k}} = 2\\,\\mu\\text{A}$$'] }],
    q: 'Example: $I_1 = I_2 = 20\\,\\mu$A and $R_1 = R_2 = 50$ kΩ. A differential signal puts M5’s source at 0.6 V and M6’s source at 0.4 V. How much current does M5 carry now?',
    hint: ['First the resistor current (the two R’s are in series between the follower sources). Then KCL at M5’s source.',
      '$I_R = \\dfrac{V_{S5} - V_{S6}}{R_1 + R_2}$, $\\;I_{D5} = I_1 + I_R$'],
    how: ['Resistor current, series R’s between the two follower sources: $$I_R = \\frac{0.6 - 0.4}{50\\,\\text{k} + 50\\,\\text{k}} = \\frac{0.2\\,\\text{V}}{100\\,\\text{k}\\Omega} = 2\\,\\mu\\text{A}$$',
      'KCL at M5’s source: M5’s current leaves through $I_1$ **and** through the resistors: $$I_{D5} = I_1 + I_R = 20 + 2 = 22\\,\\mu\\text{A}$$',
      'M6 receives $I_R$, so it needs to supply less: $$I_{D6} = I_2 - I_R = 20 - 2 = 18\\,\\mu\\text{A}$$'],
    why: 'The followers, not the amplifier outputs, supply the resistor current.',
    answer: 22e-6, unit: 'A', tol: 0.02,
  });
  [[200, 230, 'I_1 + I_R', C.n], [1150, 230, 'I_2 − I_R', C.p]].forEach(([x, y, s, col], i) => { const c = chip(S, x, y, s, { color: col, size: 18 }); c.style.opacity = 0; S.pop(c, 25.4 + i * 0.3); });
  eqAt(S, 'I_{D5} = I_1 + I_R = 22\\,\\mu\\text{A},\\qquad I_{D6} = I_2 - I_R = 18\\,\\mu\\text{A}', 760, 800, 25.4, { size: 28, w: 1100, color: '#ffd38a' });
  S.say(25.4, 'KCL at M5’s source: M5 now supplies $I_1$ plus $I_R$, and M6 supplies $I_R$ less. The followers deliver the resistor current.');
  S.stop(33, {
    src: 'Exam-style check',
    q: 'How much of the resistor current $I_R$ comes out of the amplifier’s output nodes (the M1, M3 drains)?',
    choices: ['None: the outputs only drive the followers’ gates', 'All of it', 'Half of it'],
    answer: 0,
    hint: ['Follow $I_R$ backwards: out of M5’s source, through M5, back to where M5’s current enters.',
      'What does the output node connect to? A gate draws no DC or low-frequency current.'],
    how: ['$I_R$ leaves M5’s **source**; M5’s current enters at its **drain**, from $V_{DD}$.',
      'The output node connects only to M5’s **gate**, and a gate draws no current: $$I_{G5} = 0$$',
      'So the outputs supply none of $I_R$. Their resistance stays $r_{O1}\\parallel r_{O3}$ and the gain is untouched. “All of it” is what happens **without** followers (previous scene).'],
    why: 'Followers isolate: the resistor current comes from $V_{DD}$ through the follower, not from the output.',
  });
  S.say(33.4, 'So the outputs keep their full resistance and the gain is untouched. Only the followers work harder.');
  remember(S, [
    'Three separate current groups: main pair ($I_{SS}$, $I_{SS}/2$ each side), M5 with $I_1$, M6 with $I_2$, all flowing down.',
    'Differential signal: $I_R = \\frac{V_{S5} - V_{S6}}{R_1 + R_2}$ flows from M5’s source to M6’s source.',
    'KCL: $I_{D5} = I_1 + I_R$, $\\;I_{D6} = I_2 - I_R$.',
    'Gates draw no current, so the outputs supply none of $I_R$: no loading, the gain stays.',
  ], 40, 'Follow the current · follower sensing');
  S.say(40, 'The current rules for follower sensing: each follower carries its own bias, and the resistor current comes from the followers, never from the outputs.');
});

scene(L10, 'Sensing through source followers', 62, (S) => {
  header(S, 'LEC 10 · SENSING CIRCUIT 2', 'Followers isolate the outputs; the sensed level drops by one V_GS');
  const g = sfSense(S);
  S.draw(g, 0.3, 2.6);
  S.say(0.3, 'Your page’s second sensor: each output drives the gate of a <b>source follower</b> (M5, M6, biased by $I_1$, $I_2$). The resistors hang on the followers’ sources instead.');
  S.say(8, '<span class="why">Why it works:</span> a gate draws no current, so the outputs see nothing extra — their high resistance (and the gain) is untouched.');
  S.ring(320, 390, 18, C.amb, 14, 30); S.ring(1040, 390, 18, C.amb, 14, 30);
  S.say(14, 'The price: a follower’s source sits one <b>link</b> below its gate. Your page’s numbers: outputs at 0.9 V, follower sources at 0.5 V.');
  eqAt(S, 'V_{sense} = \\frac{V_{out1}+V_{out2}}{2} - V_{GS5,6}', 1200, 600, 20, { size: 32, w: 700, color: '#ffd38a' });
  S.say(20, 'So the sensed value is the average shifted down by $V_{GS5,6}$ — choose $V_{REF}$ (or the amplifier’s other input) to match.');
  whyBox(S, 1120, 660, 440, 170, 'Each follower output = **DC level** ($V_{out,CM} - V_{GS}$) **+ AC signal** ($\\pm v_{out}$). The resistors average away the AC; the DC remains.', 28);
  S.say(28, 'Your page also marks each follower output as “DC + AC”: the CM level plus the signal. Averaging cancels the signal and keeps the level.');
  S.say(40, 'One more cost to remember (Lec 10 handout): the outputs are now follower gates, so they cannot go below about $V_{GS} + V_{ov}$ — the followers eat some swing.');
});

scene(L10, 'Lecture 10 in one card', 26, (S) => {
  header(S, 'LEC 10 · REMEMBER', 'Everything from Lecture 10');
  remember(S, [
    'Two signals = CM $\\frac{V_1+V_2}{2}$ + DM $V_1 - V_2$. DM moves the outputs oppositely (signal), CM together (no one controls it).',
    '$I_X = I_P - I_N$ flows into $R_P\\parallel R_N$: the output CM drifts to a rail without CMFB.',
    'CMFB = **sense** $V_{out,CM}$ → **compare** with $V_{REF}$ → **correct** a current source. Signal untouched.',
    'Resistive sensing: $V_{out,CM} = \\frac{V_{out1}+V_{out2}}{2}$ (superposition), but $A_v = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R_1)$.',
    'Follower sensing: no loading, $V_{sense} = V_{out,CM} - V_{GS}$, costs some swing.',
  ], 0.4, 'Lecture 10 · remember');
  S.say(0.4, 'Now every Lecture 10 question: Quiz 2 2024 Q2, the 2024 mid-sem Q1 (Tutorial 5 Q3) in two parts, and Tutorial 5 Q2.');
});

/* ── Lecture 10 past papers ── */
/* Quiz 2 2024 Q2, as printed */
function q24bq2Fig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 90, 820, 160);
  const m6 = pmos(S, 170, 220, { name: 'M6', right: true, gl: 40, nameSide: 'l' }); wire(S, [[170, 160], [170, 170]]);
  wire(S, [[170, 270], [170, 330]]); dot(S, 170, 290); wire(S, [[170, 290], [240, 290], [240, 220]]); dot(S, 240, 220);
  isrc(S, 170, 372, { label: '50 µA', left: true, len: 42 }); gnd(S, 170, 414);
  const L = 400, R = 660;
  pmos(S, L, 220, { name: 'M3', gl: 30 }); pmos(S, R, 220, { name: 'M4', gl: 30, right: true });
  wire(S, [[240, 220], [336, 220]]); wire(S, [[L, 160], [L, 170]]); wire(S, [[R, 160], [R, 170]]);
  wire(S, [[240, 196], [500, 196], [500, 186], [760, 186], [760, 220], [724, 220]]);
  wire(S, [[L, 270], [L, 380]]); wire(S, [[R, 270], [R, 380]]); dot(S, L, 310); dot(S, R, 310);
  resh(S, L, 530, 310, { label: 'R' }); resh(S, 530, R, 310, { label: 'R' }); dot(S, 530, 310);
  txt(S, 530, 356, 'V_o,CM', { size: 18, color: C.amb, weight: 700, anchor: 'middle' }); wire(S, [[530, 310], [530, 334]]);
  nmos(S, L, 430, { name: 'M1', gate: 'V_in1' }); nmos(S, R, 430, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[L, 480], [L, 510], [R, 510], [R, 480]]); dot(S, 530, 510);
  const m5 = nmos(S, 530, 580, { name: 'M5', gl: 30, right: true, nameSide: 'l' }); wire(S, [[530, 510], [530, 530]]); gnd(S, 530, 630);
  amp(S, 760, 580, { left: true, w: 110, h: 100 });
  wire(S, [[m5.gate[0], 580], [650, 580]]);
  wire(S, [[760, 555], [800, 555]]); txt(S, 808, 561, 'V_o,CM', { size: 18, color: C.amb });
  wire(S, [[760, 605], [800, 605]]); txt(S, 808, 611, 'V_REF', { size: 18, color: C.muted });
  r();
  return g;
}

scene(L10, 'Follow the current: mirror loads, tail set by CMFB', 56, (S) => {
  header(S, 'LEC 10 · FOLLOW THE CURRENT', 'The mirrors set the loads; the CMFB amplifier sets the tail');
  const g = q24bq2Fig(S); g.setAttribute('transform', 'translate(0 110)');
  S.draw(g, 0.3, 2.4);
  const G1 = l10Shift(S, 110, () => {
    current(S, [[170, 162], [170, 412]], 4, null, null, { color: C.amb });
    current(S, [[400, 162], [400, 510], [524, 510]], 10, 34, '50 µA', { at: [340, 545], color: C.cur });
    current(S, [[660, 162], [660, 510], [536, 510]], 10, 34, '50 µA', { at: [742, 492], color: C.pink });
  });
  S.say(4, 'The Quiz 2 circuit. Start at the reference: 50 µA flows from $V_{DD}$ down through diode M6 into the current source.');
  S.say(10, 'M3 and M4 have the same W/L and the same gate voltage as M6, so each copies 50 µA. Each copy flows straight down through its input transistor, M1 or M2, into node P.');
  eqAt(S, 'I_{D3} = I_{D4} = I_{REF} = 50\\,\\mu\\text{A}', 1250, 250, 10, { size: 28, w: 600 });
  S.stop(17, {
    src: 'Exam-style check',
    parts: [{ q: 'First: how much current does M3 carry?', answer: 50e-6, unit: 'A', tol: 0.02,
      hint: 'M3 has the same W/L and the same $V_{GS}$ as diode M6.', how: ['A mirror copy with equal W/L: $$I_{D3} = I_{REF} = 50\\,\\mu\\text{A}$$ (M4 the same).'] }],
    q: 'In this circuit the reference is 50 µA and $(W/L)_{3} = (W/L)_{4} = (W/L)_{6}$. With the outputs at rest (no current in the R’s), how much current must the tail M5 carry?',
    hint: ['M3 and M4 copy the reference. Follow both copies down to node P.',
      'KCL at P: $I_{D5} = I_{D1} + I_{D2}$, with $I_{D1} = I_{D3}$ and $I_{D2} = I_{D4}$'],
    how: ['Same W/L and the same $V_{GS}$ as diode M6, so each PMOS copies the reference: $$I_{D3} = I_{D4} = 50\\,\\mu\\text{A}$$',
      'No current in the R’s at rest, so each copy goes straight down its side: $$I_{D1} = I_{D3} = 50\\,\\mu\\text{A},\\quad I_{D2} = I_{D4} = 50\\,\\mu\\text{A}$$',
      'KCL at node P: $$I_{D5} = I_{D1} + I_{D2} = 50 + 50 = 100\\,\\mu\\text{A}$$'],
    why: 'M5 is not a mirror here: the CMFB amplifier drives its gate until it pulls exactly $I_{D3} + I_{D4}$.',
    answer: 100e-6, unit: 'A', tol: 0.02,
  });
  l10Shift(S, 110, () => { current(S, [[530, 512], [530, 628]], 17.4, null, '100 µA', { at: [606, 545], color: C.ok }); });
  eqAt(S, '\\text{KCL at P: } I_{D5} = I_{D1} + I_{D2} = 100\\,\\mu\\text{A}', 1250, 330, 17.4, { size: 28, w: 620 });
  S.say(17.4, 'KCL at P: M5 must pull exactly 100 µA. Nothing copies that number into M5. The CMFB amplifier moves M5’s gate until it does.');
  l10Shift(S, 110, () => { S.flow([[650, 580], [592, 580]], 25, 33, { color: C.amb, speed: 40 }); });
  eqAt(S, 'I_{D5} = 110 > 100 \\Rightarrow V_{o,CM}\\downarrow \\Rightarrow V_{G5}\\downarrow', 1250, 420, 25, { size: 26, w: 620, color: C.muted, out: 33 });
  S.say(25, 'Suppose M5 pulled 110 µA. The loads still give only 100 µA, so the extra 10 µA is drawn out of the output nodes and both outputs fall. The amplifier sees $V_{o,CM}$ below $V_{REF}$ and lowers M5’s gate until the tail is back to 100 µA.');
  S.stop(34, {
    src: 'Exam-style check',
    q: 'Now $V_{in1}$ rises slightly and $V_{in2}$ falls by the same amount (a differential input). What happens to M5’s current?',
    choices: ['It stays at 100 µA: M1 gains exactly what M2 loses', 'It rises by the extra current in M1', 'It falls by the current M2 lost'],
    answer: 0,
    hint: ['The tail only sees the **sum** of the two input currents.',
      'Does a differential input move $V_{o,CM}$, the only thing the CMFB amplifier looks at?'],
    how: ['The tail sees the sum: $$I_{D5} = I_{D1} + I_{D2} = (50 + \\Delta I) + (50 - \\Delta I) = 100\\,\\mu\\text{A}$$',
      'The outputs move in opposite directions, so the midpoint of the R’s, $V_{o,CM}$, does not move.',
      'The CMFB amplifier sees no change, so M5’s gate stays put. The other two choices count only one side of the pair.'],
    why: 'A differential input only re-shares the tail current; only a CM change makes CMFB act.',
  });
  l10Shift(S, 110, () => {
    current(S, [[400, 162], [400, 510], [524, 510]], 34.4, null, '50 µA + ΔI', { at: [330, 545], color: C.cur });
    current(S, [[660, 162], [660, 510], [536, 510]], 34.4, null, '50 µA − ΔI', { at: [752, 492], color: C.pink });
  });
  S.say(34.4, 'A differential input only re-shares: M1 takes 50 µA plus $\\Delta I$, M2 takes 50 µA minus $\\Delta I$, and the tail still sees 100 µA.');
  remember(S, [
    'Reference → diode M6 → M3, M4 copy it (equal W/L): 50 µA each, flowing down into M1, M2.',
    'KCL at P: $I_{D5} = I_{D3} + I_{D4} = 100\\,\\mu$A.',
    'M5 is set by the CMFB amplifier, not by a mirror: too much tail current pulls the outputs down, and the loop backs it off.',
    'Differential input: $50 \\pm \\Delta I$, the tail stays 100 µA, CMFB does nothing.',
  ], 42, 'Follow the current · mirror loads + CMFB tail');
  S.say(42, 'The current rules for this circuit: the mirrors fix the loads, KCL fixes the tail, and the CMFB amplifier makes M5 obey it.');
  void G1;
});

scene(L10, 'Quiz 2 2024 Q2: VREF, optimum input CM, CM gain for ±1%', 84, (S) => {
  const T = tfm(1, 0, 110);
  pyqFrame(S, {
    paper: 'q24bq2', tag: 'LEC 10 · PAST PAPER 1 OF 4', title: 'Resistive-sensing CMFB: where should everything sit?', src: 'Quiz 2 2024-25 Q2 · 9 marks',
    q: '$A_d = 50$ without the sensing R’s and feedback amp. $2V_{ov1} = V_{ov5}$, $3V_{ov1} = |V_{ov3}|$. Find $V_{REF}$ for a symmetric output swing, the optimum $V_{in,CM}$, and the CM gain allowed if $V_{o,CM}$ may vary by ±1%.',
    giv: '$\\lambda_n = \\lambda_p = 0.2$ V⁻¹, $V_{thn} = 0.4$ V, $|V_{thp}| = 0.5$ V, $V_{DD} = 1.8$ V, $\\mu_nC_{ox} = 150$, $\\mu_pC_{ox} = 50\\,\\mu$A/V², $(W/L)_{3,4,6}$ equal, $I_{REF} = 50\\,\\mu$A', qh: 250,
    tests: 'turning a **gain into an overdrive** ($A_d = 1/(\\lambda V_{ov})$), the **output range from checks** (its middle is $V_{REF}$), the **input-CM range from a check + a fence**, and what “±1%” means for the CM gain.',
    fig: (S2) => { const g = q24bq2Fig(S2); g.setAttribute('transform', 'translate(0 110)'); },
    steps: [
      { t: 8, title: '**Turn the gain into an overdrive.** With equal λ the bias current cancels out of $A_d = g_{m1}(r_{O1}\\parallel r_{O3})$, leaving $A_d = 1/(\\lambda V_{ov1})$. The given ratios then give the other two overdrives.',
        tex: 'V_{ov1} = \\frac{1}{\\lambda A_d} = \\frac{1}{0.2\\times 50} = 0.1\\,\\text{V},\\; V_{ov5} = 2V_{ov1} = 0.2\\,\\text{V},\\; |V_{ov3}| = 3V_{ov1} = 0.3\\,\\text{V}', hl: [T([330, 380, 400, 110, C.n])],
        try: { q: 'The differential gain is $A_d = 50$ (without the R’s and the feedback amp), with $\\lambda_n = \\lambda_p = 0.2$ V⁻¹. Find the overdrive of the input pair, $V_{ov1}$.', answer: 0.1, unit: 'V', tol: 0.01,
          hint: ['Write $A_d = g_{m1}(r_{O1}\\parallel r_{O3})$ with $g_m$ and $r_O$ in terms of the drain current $I_D$: the current cancels.',
            '$g_{m1} = \\frac{2I_D}{V_{ov1}}$, $\\;r_{O1}\\parallel r_{O3} = \\frac{1}{2\\lambda I_D}$ $\\;\\Rightarrow\\; A_d = \\frac{1}{\\lambda V_{ov1}}$'],
          how: ['Write $g_m$ and $r_O$ with the same drain current $I_D$ (equal λ, so $r_{O1} = r_{O3}$): $$g_{m1} = \\frac{2I_D}{V_{ov1}},\\quad r_{O1}\\parallel r_{O3} = \\frac{1}{2\\lambda I_D}$$',
            'Multiply them; $I_D$ cancels: $$A_d = \\frac{2I_D}{V_{ov1}}\\cdot\\frac{1}{2\\lambda I_D} = \\frac{1}{\\lambda V_{ov1}}$$',
            'Solve for the overdrive: $$V_{ov1} = \\frac{1}{\\lambda A_d} = \\frac{1}{0.2\\times 50} = 0.1\\,\\text{V}$$'],
          why: 'Equal λ on both devices ⇒ $A_d = 1/(\\lambda V_{ov})$: no current needed.' },
        say: 'The trick: with equal λ, $r_{O1}\\parallel r_{O3} = 1/(2\\lambda I_D)$ and $g_m = 2I_D/V_{ov}$, so the current cancels: $A_d = 1/(\\lambda V_{ov1})$, giving $V_{ov1} = 0.1$ V, $V_{ov5} = 0.2$ V, $|V_{ov3}| = 0.3$ V.' },
      { t: 17, title: '**Output range from the checks.** Lowest output: the tail M5 and M1 must stay saturated. Highest: M3 must stay saturated. A **symmetric swing** puts $V_{REF}$ in the middle.',
        tex: 'V_{o,min} = V_{ov5} + V_{ov1} = 0.2 + 0.1 = 0.3\\,\\text{V},\\; V_{o,max} = V_{DD} - |V_{ov3}| = 1.8 - 0.3 = 1.5\\,\\text{V},\\; V_{REF} = \\frac{0.3 + 1.5}{2} = 0.9\\,\\text{V}', hl: [T([330, 160, 400, 380, C.volt])],
        try: { parts: [
          { q: 'First: the lowest output $V_{o,min}$ that keeps M5 and M1 saturated?', answer: Q24.vomin, unit: 'V', tol: 0.01, hint: '$V_{o,min} = V_{ov5} + V_{ov1}$, with $V_{ov5} = 2V_{ov1}$', how: ['$$V_{o,min} = 0.2 + 0.1 = 0.3\\,\\text{V}$$'] },
          { q: 'Next: the highest output $V_{o,max}$ that keeps M3 saturated?', answer: Q24.vomax, unit: 'V', tol: 0.01, hint: '$V_{o,max} = V_{DD} - |V_{ov3}|$, with $|V_{ov3}| = 3V_{ov1}$', how: ['$$V_{o,max} = 1.8 - 0.3 = 1.5\\,\\text{V}$$'] }],
          q: 'The CMFB loop holds the output CM at $V_{REF}$. Using the overdrives from the first part, choose $V_{REF}$ so the outputs can swing equally far up and down.', answer: 0.9, unit: 'V', tol: 0.01,
          hint: ['Find the lowest and the highest output that keep every device saturated; $V_{REF}$ sits in the middle.',
            '$V_{o,min} = V_{ov5} + V_{ov1}$, $\\;V_{o,max} = V_{DD} - |V_{ov3}|$, $\\;V_{REF} = \\frac{V_{o,min} + V_{o,max}}{2}$'],
          how: ['Lowest output: going down from the output, M1 and the tail M5 each need their overdrive: $$V_{o,min} = V_{ov5} + V_{ov1} = 0.2 + 0.1 = 0.3\\,\\text{V}$$',
            'Highest output: the PMOS load M3 needs $|V_{ov3}|$ below $V_{DD}$: $$V_{o,max} = V_{DD} - |V_{ov3}| = 1.8 - 0.3 = 1.5\\,\\text{V}$$',
            'Equal swing both ways means resting in the middle, and CMFB makes the output rest at $V_{REF}$: $$V_{REF} = \\frac{0.3 + 1.5}{2} = 0.9\\,\\text{V}$$'],
          why: '$V_{REF}$ = the middle of the output range.' },
        say: 'Lowest output: the tail’s and M1’s overdrives, 0.3 V. Highest: $1.8 - 0.3 = 1.5$ V. CMFB holds the CM at $V_{REF}$, so put it in the middle: 0.9 V.' },
      { t: 26, title: '**Input-CM range.** Floor: the tail needs $V_{ov5}$ at P, and the gate sits one $V_{GS1}$ above P. Ceiling: M1’s gate may be at most $V_{thn}$ above its drain, which sits at $V_{o,CM}$. The **optimum is the middle**.',
        tex: 'V_{in,min} = V_{ov5} + V_{GS1} = 0.2 + 0.5 = 0.7\\,\\text{V},\\; V_{in,max} = V_{o,CM} + V_{thn} = 0.9 + 0.4 = 1.3\\,\\text{V},\\; V_{in,CM} = \\frac{0.7 + 1.3}{2} = 1.0\\,\\text{V}', hl: [T([330, 380, 400, 260, C.amb])],
        try: { parts: [
          { q: 'First: M1’s gate–source voltage $V_{GS1}$?', answer: Q24.vgs1, unit: 'V', tol: 0.01, hint: '$V_{GS1} = V_{thn} + V_{ov1}$', how: ['$$V_{GS1} = 0.4 + 0.1 = 0.5\\,\\text{V}$$'] },
          { q: 'The lowest input CM $V_{in,min}$ (tail M5 just saturated)?', answer: Q24.vinmin, unit: 'V', tol: 0.01, hint: '$V_{in,min} = V_{ov5} + V_{GS1}$', how: ['$$V_{in,min} = 0.2 + 0.5 = 0.7\\,\\text{V}$$'] },
          { q: 'The highest input CM $V_{in,max}$ (M1 just saturated, drain at $V_{o,CM} = 0.9$ V)?', answer: Q24.vinmax, unit: 'V', tol: 0.01, hint: '$V_{in,max} = V_{o,CM} + V_{thn}$', how: ['$$V_{in,max} = 0.9 + 0.4 = 1.3\\,\\text{V}$$'] }],
          q: 'Find the optimum input common-mode level $V_{in,CM}$: the middle of the range of input CM that keeps M5 and M1 saturated, with the output CM at $V_{REF}$ from the previous part.', answer: 1.0, unit: 'V', tol: 0.01,
          hint: ['Bottom: keep the tail M5 saturated, then add M1’s gate–source voltage. Top: keep M1 saturated with its drain at $V_{o,CM}$.',
            '$V_{in,min} = V_{ov5} + (V_{thn} + V_{ov1})$, $\\;V_{in,max} = V_{o,CM} + V_{thn}$'],
          how: ['M1’s gate–source voltage: $$V_{GS1} = V_{thn} + V_{ov1} = 0.4 + 0.1 = 0.5\\,\\text{V}$$',
            'Lowest input CM: the tail needs $V_{ov5}$ at node P, and the gate sits $V_{GS1}$ above P: $$V_{in,min} = V_{ov5} + V_{GS1} = 0.2 + 0.5 = 0.7\\,\\text{V}$$',
            'Highest input CM: M1 stays saturated while its gate is at most $V_{thn}$ above its drain, at $V_{o,CM} = 0.9$ V: $$V_{in,max} = 0.9 + 0.4 = 1.3\\,\\text{V}$$',
            'Take the middle: $$V_{in,CM} = \\frac{0.7 + 1.3}{2} = 1.0\\,\\text{V}$$'],
          why: 'Floor = check + link; ceiling = the fence $V_{G} \\le V_{D} + V_{th}$.' },
        say: 'Floor: tail check plus the link up to M1’s gate, $0.2 + 0.5 = 0.7$ V. Ceiling: M1’s drain sits at $V_{o,CM} = 0.9$ V and its gate may be $V_{th}$ above: 1.3 V. The middle, 1.0 V, is the optimum.' },
      { t: 35, title: '**What “±1%” allows.** The output CM may move from −1% to +1% of $V_{o,CM}$ (a 2% window) while the input CM sweeps its whole range. The CM gain is the ratio of the two.',
        tex: '\\Delta V_{o,CM} = 2(0.01)(0.9) = 0.018\\,\\text{V},\\; \\Delta V_{in,CM} = 1.3 - 0.7 = 0.6\\,\\text{V},\\; |A_{CM}| = \\frac{0.018}{0.6} = 0.03',
        try: { parts: [
          { q: 'First: how much may the output CM move in total (±1% of 0.9 V)?', answer: Q24.dvo, unit: 'V', tol: 0.02, hint: '±1% is a 2% window: $\\Delta V_{o,CM} = 2(0.01)V_{o,CM}$', how: ['$$\\Delta V_{o,CM} = 2\\times 0.01\\times 0.9 = 0.018\\,\\text{V}$$'] },
          { q: 'Next: the full input-CM range $\\Delta V_{in,CM}$?', answer: Q24.dvin, unit: 'V', tol: 0.02, hint: '$\\Delta V_{in,CM} = V_{in,max} - V_{in,min}$ (previous part)', how: ['$$\\Delta V_{in,CM} = 1.3 - 0.7 = 0.6\\,\\text{V}$$'] }],
          q: 'The output CM may vary by ±1% of its value while the input CM moves over its full range (previous part). What is the largest CM gain $|A_{CM}|$ allowed?', answer: 0.03, unit: 'V/V', tol: 0.02,
          hint: ['CM gain = (output-CM change) ÷ (input-CM change). “±1%” is a total window of 2%.',
            '$|A_{CM}| = \\dfrac{2(0.01)\\,V_{o,CM}}{V_{in,max} - V_{in,min}}$'],
          how: ['Allowed output-CM change, from −1% to +1%: $$\\Delta V_{o,CM} = 2\\times0.01\\times0.9 = 0.018\\,\\text{V}$$',
            'Input-CM change: the whole range from the previous part: $$\\Delta V_{in,CM} = 1.3 - 0.7 = 0.6\\,\\text{V}$$',
            'Divide: $$|A_{CM}| = \\frac{0.018}{0.6} = 0.03$$'],
          why: 'The CMFB loop must make the CM gain at most 0.03.' },
        say: 'CM gain = output-CM change ÷ input-CM change: $(2\\times0.01\\times0.9)/0.6 = 0.03$. The CMFB loop must make the CM gain at least this small.' },
      { t: 43, ans: true, title: `**Answers:** $V_{REF} = 0.9$ V · $V_{in,CM,opt} = 1.0$ V · $|A_{CM}| \\le 0.03$`, say: 'Pattern for CMFB level questions: overdrives first, output range by checks (middle = $V_{REF}$), input range by check + link and fence (middle = optimum), then CM gain = allowed change ÷ input range.' },
    ],
  });
}, { q: 'Quiz 2 2024 Q2' });

/* 2024 mid-sem Q1 = Tutorial 5 Q3, as printed */
function t5q3Fig(S, sc = 1) {
  const g = S.g(); const r = S.into(g);
  rail(S, 60, 880, 150);
  const m6 = pmos(S, 110, 205, { name: 'M6', right: true, gl: 30, nameSide: 'l' }); wire(S, [[110, 150], [110, 155]]);
  wire(S, [[110, 255], [110, 300]]); dot(S, 110, 275); wire(S, [[110, 275], [170, 275], [170, 205]]); dot(S, 170, 205);
  isrc(S, 110, 340, { label: 'I_1', left: true, len: 40 }); gnd(S, 110, 380);
  const L = 270, R = 450;
  pmos(S, L, 205, { name: 'M3', gl: 30 }); pmos(S, R, 205, { name: 'M4', gl: 30, right: true });
  wire(S, [[170, 205], [206, 205]]); wire(S, [[L, 150], [L, 155]]); wire(S, [[R, 150], [R, 155]]);
  wire(S, [[170, 178], [540, 178], [540, 205], [514, 205]]);
  wire(S, [[L, 255], [L, 350]]); wire(S, [[R, 255], [R, 350]]); dot(S, L, 290); dot(S, R, 290);
  resh(S, L, 360, 290, { label: 'R' }); resh(S, 360, R, 290, { label: 'R' }); dot(S, 360, 290);
  wire(S, [[360, 290], [360, 310]]); txt(S, 360, 332, 'V_O,CM', { size: 16, color: C.amb, weight: 700, anchor: 'middle' });
  nmos(S, L, 400, { name: 'M1', gate: 'V_in1' }); nmos(S, R, 400, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[L, 450], [L, 470], [R, 470], [R, 450]]); dot(S, 360, 470);
  const m5 = nmos(S, 360, 540, { name: 'M5', right: true, gl: 40, nameSide: 'l' }); wire(S, [[360, 470], [360, 490]]); gnd(S, 360, 590);
  // error amplifier
  const m12 = pmos(S, 600, 205, { name: 'M12', right: true, gl: 30, nameSide: 'l' }); wire(S, [[600, 150], [600, 155]]);
  wire(S, [[600, 255], [600, 300]]); dot(S, 600, 275); wire(S, [[600, 275], [680, 275], [680, 205]]); dot(S, 680, 205);
  wire(S, [[656, 205], [680, 205]]);
  isrc(S, 600, 340, { label: 'I_2', left: true, len: 40 }); gnd(S, 600, 380);
  pmos(S, 780, 205, { name: 'M11', gl: 30 }); wire(S, [[680, 205], [716, 205]]); wire(S, [[780, 150], [780, 155]]);
  wire(S, [[780, 255], [780, 280]]); dot(S, 780, 280); wire(S, [[720, 280], [840, 280], [840, 300]]); wire(S, [[720, 280], [720, 300]]);
  pmos(S, 720, 350, { name: 'M7', gl: 24 }); pmos(S, 840, 350, { name: 'M8', gl: 24, right: true });
  // gate names under their leads: clear of the I_2 source on the left and of the panel edge on the right
  txt(S, 668, 388, 'V_REF', { size: 18, color: C.muted, anchor: 'end' }); txt(S, 898, 388, 'V_O,CM', { size: 18, color: C.amb, weight: 700, anchor: 'end' });
  wire(S, [[720, 400], [720, 490]]); wire(S, [[840, 400], [840, 490]]);
  const m9 = nmos(S, 720, 540, { name: 'M9', right: true, gl: 24, nameSide: 'l' }); dot(S, 720, 470); wire(S, [[720, 470], [764, 470], [764, 540]]);
  nmos(S, 840, 540, { name: 'M10', gl: 24, right: true }); dot(S, 840, 470); wire(S, [[840, 470], [884, 470], [884, 540]]);
  gnd(S, 720, 590); gnd(S, 840, 590);
  wire(S, [[m5.gate[0], 540], [440, 540], [440, 620], [650, 620], [650, 470], [720, 470]]); // clear of the M9 name
  r();
  return g;
}

scene(L10, 'Follow the current: the CMFB error amplifier M7–M12', 58, (S) => {
  header(S, 'LEC 10 · FOLLOW THE CURRENT', 'I_2 is shared by M7 and M8; M9’s share is copied into the tail');
  const g = t5q3Fig(S); g.setAttribute('transform', 'translate(0 100)');
  S.draw(g, 0.3, 2.4);
  l10Shift(S, 100, () => {
    current(S, [[110, 152], [110, 378]], 4, 19.4, null, { color: C.amb });
    current(S, [[270, 152], [270, 470], [354, 470]], 4, 19.4, '50 µA', { at: [215, 330], color: C.cur });
    current(S, [[450, 152], [450, 470], [366, 470]], 4, 19.4, '50 µA', { at: [505, 330], color: C.pink });
    current(S, [[360, 472], [360, 588]], 4, null, null, { color: C.ok });
  });
  S.say(4, 'The 2024 mid-sem circuit, with $I_1 = 50$ µA, $I_2 = 200$ µA and W/L = 50 for every device. The main amplifier is the Quiz circuit again: M3 and M4 copy 50 µA, so the tail M5 carries 100 µA. Now follow the error amplifier on the right.');
  l10Shift(S, 100, () => {
    current(S, [[600, 152], [600, 378]], 12, null, null, { color: C.amb });
    current(S, [[780, 152], [780, 280]], 12, null, '200 µA', { at: [852, 240], color: C.cur });
  });
  eqAt(S, 'I_{D11} = I_2 = 200\\,\\mu\\text{A}', 1250, 250, 12, { size: 28, w: 600 });
  S.say(12, 'In the error amplifier, $I_2 = 200$ µA flows down through diode M12. M11 has the same W/L and gate voltage, so it copies 200 µA and feeds the joined sources of the PMOS pair M7, M8.');
  S.stop(20, {
    src: 'Exam-style check',
    parts: [{ q: 'First: how much current does M11 carry?', answer: 200e-6, unit: 'A', tol: 0.02,
      hint: 'M11 has the same W/L and the same $V_{GS}$ as diode M12, which carries $I_2$.', how: ['A mirror copy with equal W/L: $$I_{D11} = I_2 = 200\\,\\mu\\text{A}$$'] }],
    q: 'At balance ($V_{O,CM} = V_{REF}$), how much current flows in M7? ($I_2 = 200\\,\\mu$A, all W/L = 50.)',
    hint: ['M11 copies $I_2$; then the pair M7, M8 shares M11’s current, like any differential pair shares its tail.',
      '$I_{D11} = I_{D7} + I_{D8}$; equal gate voltages ⇒ $I_{D7} = I_{D8}$'],
    how: ['M11 has the same W/L and $V_{GS}$ as diode M12, so it copies the reference: $$I_{D11} = I_2 = 200\\,\\mu\\text{A}$$',
      'KCL at the joined sources of M7 and M8: $$I_{D11} = I_{D7} + I_{D8}$$',
      'At balance the gates are equal ($V_{REF}$ and $V_{O,CM}$), so the split is even: $$I_{D7} = \\frac{200}{2} = 100\\,\\mu\\text{A}$$'],
    why: 'M11 is the “tail” of the error amplifier: its pair shares a fixed 200 µA.',
    answer: 100e-6, unit: 'A', tol: 0.02,
  });
  l10Shift(S, 100, () => {
    current(S, [[780, 282], [720, 282], [720, 588]], 20.4, 35, '100 µA', { at: [655, 430], color: C.volt });
    current(S, [[780, 282], [840, 282], [840, 588]], 20.4, 35, '100 µA', { at: [912, 430], color: C.pink });
  });
  eqAt(S, '\\text{KCL: } I_{D11} = I_{D7} + I_{D8} = 100 + 100\\,\\mu\\text{A}', 1250, 330, 20.4, { size: 26, w: 620 });
  S.say(20.4, 'KCL at the pair’s sources: the 200 µA splits. With $V_{O,CM} = V_{REF}$ the gates are equal, so 100 µA goes down each side, into the diodes M9 and M10.');
  l10Shift(S, 100, () => { const c = chip(S, 570, 655, 'M5 copies M9 (same V_GS, same W/L)', { color: C.amb, size: 17 }); c.style.opacity = 0; S.pop(c, 27); });
  eqAt(S, 'I_{D5} = I_{D9} = 100\\,\\mu\\text{A} = I_{D3} + I_{D4}', 1250, 410, 27, { size: 26, w: 620, color: C.ok });
  S.say(27, 'Diode M9 and the tail M5 share a gate voltage and have the same W/L, so M5 copies M9’s 100 µA. That is exactly the 100 µA the main amplifier needs: the loop is balanced.');
  S.stop(35, {
    src: 'Exam-style check',
    q: 'The output CM drifts **up**, above $V_{REF}$ ($V_{O,CM}$ drives M8’s gate). How does the 200 µA from M11 re-split, and what does the tail do?',
    choices: ['More through M7, less through M8: M9 and the copy in M5 rise, pulling the outputs back down',
      'More through M8, less through M7: M5 pulls less',
      'The total rises above 200 µA, so both M7 and M8 carry more'],
    answer: 0,
    hint: ['M8 is a PMOS: a higher gate voltage means a smaller $|V_{GS8}|$. M11’s 200 µA total cannot change.',
      '$I_{D7} = 200\\,\\mu\\text{A} - I_{D8}$, and M5 copies whatever flows in M7 (through diode M9).'],
    how: ['M8 is a PMOS with $V_{O,CM}$ on its gate. Gate up ⇒ $|V_{GS8}|$ down ⇒ M8 conducts less: $$I_{D8} = 100 - \\Delta I$$',
      'M11 still supplies a fixed 200 µA, so M7 takes what M8 gives up: $$I_{D7} = 200 - I_{D8} = 100 + \\Delta I$$',
      'M7’s extra current flows into diode M9; M5 copies it and pulls harder, dragging both outputs back **down**: negative feedback. The total can’t rise: M11 fixes it.'],
    why: 'The pair only re-shares $I_2$; the share in M7 is what the tail copies.',
  });
  l10Shift(S, 100, () => {
    current(S, [[780, 282], [720, 282], [720, 588]], 35.4, null, '100 µA + ΔI', { at: [640, 430], color: C.volt });
    current(S, [[780, 282], [840, 282], [840, 588]], 35.4, null, '100 µA − ΔI', { at: [925, 430], color: C.pink });
  });
  S.say(35.4, '$V_{O,CM}$ going up makes M8 conduct less, so M7 takes the extra share. M9’s current rises, M5 copies it and pulls harder, and both outputs come back down. Negative feedback.');
  remember(S, [
    'Main amplifier: $I_1$ → diode M6 → M3, M4 copy 50 µA each → M1, M2 → tail M5 = 100 µA.',
    'Error amplifier: $I_2$ → diode M12 → M11 copies 200 µA → shared by M7, M8 (100 µA each at balance).',
    'KCL at the pair’s sources: $I_{D7} + I_{D8} = 200\\,\\mu$A, always.',
    'M7’s share flows into diode M9, and M5 copies it: the CMFB loop’s link to the tail.',
    '$V_{O,CM}$ ↑ ⇒ M8 ↓, M7 ↑ ⇒ M5 ↑ ⇒ outputs ↓ (negative feedback).',
  ], 44, 'Follow the current · error amplifier M7–M12');
  S.say(44, 'The current rules for this CMFB circuit: each mirror copies its reference, the error pair re-shares a fixed 200 µA, and M5 copies M7’s share.');
});

scene(L10, '2024 mid-sem Q1 (Tutorial 5 Q3), part 1: no CMFB', 80, (S) => {
  const T = tfm(1, 0, 100);
  pyqFrame(S, {
    paper: 'm24q1', tag: 'LEC 10 · PAST PAPER 2 OF 4', title: 'The main amplifier on its own: A_d, A_CM, CMRR', src: 'Mid-sem 2024-25 Q1 = Tutorial 5 Q3 · 20 marks',
    q: '$I_1 = 50\\,\\mu$A, $I_2 = 200\\,\\mu$A, $W/L = 50$ for all, $R = 10$ MΩ. Without CMFB: differential gain, CM gain, optimum $V_{O,CM}$, CMRR.',
    giv: '$V_{DD} = 1.8$ V, $\\mu_nC_{ox} = 100\\,\\mu$, $\\mu_pC_{ox} = 50\\,\\mu$A/V², $\\lambda_p = 0.2$, $\\lambda_n = 0.1$ V⁻¹, $V_{thn} = 0.4$, $|V_{thp}| = 0.5$ V', qh: 240,
    tests: 'mirror currents, the **DM half circuit** (the R midpoint is AC ground), the **CM half circuit** (tail counts as $2r_{O5}$), the output range’s middle, and CMRR = $A_d/|A_{CM}|$.',
    fig: (S2) => {
      const g = t5q3Fig(S2); g.setAttribute('transform', 'translate(0 100)');
      l10Shift(S2, 100, () => { // step 1: where the mirror currents flow (shown during that step only)
        current(S2, [[270, 152], [270, 470], [354, 470]], 17, 26, '50 µA', { at: [215, 330], color: C.cur });
        current(S2, [[450, 152], [450, 470], [366, 470]], 17, 26, '50 µA', { at: [505, 330], color: C.pink });
        current(S2, [[360, 472], [360, 588]], 17, 26, '100 µA', { at: [292, 604], color: C.ok });
      });
    },
    steps: [
      { t: 8, title: '**Currents first, from the mirrors.** M3, M4 copy $I_1$ (same W/L as diode M6): 50 µA each, so the tail M5 carries 100 µA. Then each device’s $g_m$ and $r_O$ from its current.',
        tex: 'g_{m1} = \\sqrt{2\\mu_nC_{ox}\\tfrac{W}{L}I_{D1}} = \\sqrt{2(100\\,\\mu)(50)(50\\,\\mu)} = 0.707\\,\\text{mS},\\; r_{O1} = \\frac{1}{\\lambda_n I_{D1}} = \\frac{1}{0.1\\times 50\\,\\mu} = 200\\,\\text{k}\\Omega,\\; r_{O3} = \\frac{1}{\\lambda_p I_{D3}} = \\frac{1}{0.2\\times 50\\,\\mu} = 100\\,\\text{k}\\Omega,\\; r_{O5} = \\frac{1}{\\lambda_n I_{D5}} = \\frac{1}{0.1\\times 100\\,\\mu} = 100\\,\\text{k}\\Omega', hl: [T([60, 150, 500, 440, C.cur])],
        try: { parts: [
          { q: 'First: the drain current of M1?', answer: T5V.id1, unit: 'A', tol: 0.02, hint: 'M3 copies $I_1$ from diode M6 (equal W/L), and that current flows down through M1.', how: ['$$I_{D1} = I_{D3} = I_1 = 50\\,\\mu\\text{A}$$ (and the tail $I_{D5} = 100\\,\\mu$A)'] }],
          q: 'First find the bias currents from the mirrors (all W/L = 50). Then find $g_{m1}$ of the input transistor M1.', answer: 7.0711e-4, unit: 'S', tol: 0.02,
          hint: ['M6 is a diode carrying $I_1$; M3 and M4 have the same W/L and gate voltage, so they copy it. That current flows down through M1.',
            '$g_{m1} = \\sqrt{2\\,\\mu_nC_{ox}\\,(W/L)\\,I_{D1}}$'],
          how: ['M3 and M4 copy the reference (same W/L as diode M6): $$I_{D3} = I_{D4} = I_1 = 50\\,\\mu\\text{A}$$',
            'Each copy flows down through its input transistor, and the two meet in the tail: $$I_{D1} = 50\\,\\mu\\text{A},\\quad I_{D5} = 2\\times 50 = 100\\,\\mu\\text{A}$$',
            'Square-law $g_m$ of M1: $$g_{m1} = \\sqrt{2\\mu_nC_{ox}\\frac{W}{L}I_{D1}} = \\sqrt{2(100\\,\\mu)(50)(50\\,\\mu)} = 0.707\\,\\text{mS}$$'],
          why: 'In every CMFB question: currents from the mirrors first, then $g_m$ and $r_O$.',
          calc: [{ what: 'g_m in one line (Engineer Symbol on)', keys: '[√] ( 2 × 100µ × 50 × 50µ ) [EXE]', shows: '707.1µ', note: 'Type µ with [CATALOG] ▸ Engineer Symbol ▸ micro.' }] },
        say: 'Mirrors first: M3, M4 copy 50 µA, so M5 carries 100 µA. $g_{m1} = 0.707$ mS, $r_{O1} = 200$ kΩ, $r_{O3} = r_{O5} = 100$ kΩ.' },
      { t: 17, title: '**$A_d$ from the DM half circuit.** For a differential signal the midpoint of the R’s does not move (**AC ground**), so each output sees $r_{O1}\\parallel r_{O3}\\parallel R$.',
        tex: 'r_{O1}\\parallel r_{O3}\\parallel R = 200\\,\\text{k}\\parallel 100\\,\\text{k}\\parallel 10\\,\\text{M} = 66.2\\,\\text{k}\\Omega,\\; A_d = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R) = 0.707\\,\\text{m}\\times(200\\,\\text{k}\\parallel 100\\,\\text{k}\\parallel 10\\,\\text{M}) = 0.707\\,\\text{m}\\times 66.2\\,\\text{k} = 46.83', hl: [T([250, 270, 220, 60, C.volt])],
        try: { parts: [
          { q: 'First: $r_{O1}$ (NMOS, 50 µA)?', answer: T5V.rO1, unit: 'Ω', tol: 0.02, hint: '$r_{O} = \\dfrac{1}{\\lambda I_D}$ with $\\lambda_n = 0.1$ V⁻¹', how: ['$$r_{O1} = \\frac{1}{0.1\\times 50\\,\\mu} = 200\\,\\text{k}\\Omega$$'] },
          { q: 'Next: $r_{O3}$ (PMOS, 50 µA)?', answer: T5V.rO3, unit: 'Ω', tol: 0.02, hint: '$r_{O} = \\dfrac{1}{\\lambda I_D}$ with $\\lambda_p = 0.2$ V⁻¹', how: ['$$r_{O3} = \\frac{1}{0.2\\times 50\\,\\mu} = 100\\,\\text{k}\\Omega$$'] },
          { q: 'The resistance each output sees in DM: $r_{O1}\\parallel r_{O3}\\parallel R$?', answer: T5V.par, unit: 'Ω', tol: 0.02, hint: 'The R midpoint is AC ground in DM; add conductances.', how: ['$$200\\,\\text{k}\\parallel 100\\,\\text{k}\\parallel 10\\,\\text{M} = 66.2\\,\\text{k}\\Omega$$'] }],
          q: 'Find the differential gain $A_d$ with the sensing resistors $R$ connected (no CMFB amplifier yet). Use $g_m$ and $r_O$ from the first step.', answer: ans('bank-t5q3', 'ad'), unit: 'V/V', tol: 0.02,
          hint: ['DM half circuit: the midpoint between the two R’s does not move, so it is AC ground. Each output then sees three resistances to ground.',
            '$A_d = g_{m1}\\,(r_{O1}\\parallel r_{O3}\\parallel R)$'],
          how: ['In DM one output rises as the other falls, so the R midpoint stays put: AC ground. Each output sees $r_{O1}$, $r_{O3}$ and one $R$.',
            'Combine the transistor resistances: $$r_{O1}\\parallel r_{O3} = 200\\,\\text{k}\\parallel 100\\,\\text{k} = 66.7\\,\\text{k}\\Omega$$',
            'Add $R$ in parallel: $$66.7\\,\\text{k}\\parallel 10\\,\\text{M} = 66.2\\,\\text{k}\\Omega$$',
            'Gain: $$A_d = g_{m1}\\times 66.2\\,\\text{k}\\Omega = 0.707\\,\\text{mS}\\times 66.2\\,\\text{k}\\Omega = 46.8$$'],
          why: '$R$ in parallel with $r_O$ is the price of resistive sensing (Lec 10).',
          calc: [{ what: 'Gain with a 3-way parallel (x⁻¹ = [SHIFT] [^])', keys: '707.1µ × ( 200k [SHIFT] [^] + 100k [SHIFT] [^] + 10M [SHIFT] [^] ) [SHIFT] [^] [EXE]', shows: '46.83' }] },
        say: 'Lec 10’s cost of resistive sensing shows up here: $A_d = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R) = 46.8$.' },
      { t: 26, title: '**$A_{CM}$ from the CM half circuit.** In CM both outputs move together, so the R’s carry nothing. Each half sees the tail as $2r_{O5}$ in its source: a degenerated CS stage.',
        tex: '2r_{O5} = 2\\times 100\\,\\text{k} = 200\\,\\text{k}\\Omega,\\; \\frac{1}{g_{m1}} = \\frac{1}{0.707\\,\\text{mS}} = 1.41\\,\\text{k}\\Omega,\\; |A_{CM}| = \\frac{r_{O3}}{1/g_{m1} + 2r_{O5}} = \\frac{100\\,\\text{k}}{1.41\\,\\text{k} + 200\\,\\text{k}} = 0.4965', hl: [T([300, 490, 140, 110, C.n])],
        try: { parts: [
          { q: 'First: $r_{O5}$ of the tail (NMOS, 100 µA)?', answer: T5V.rO5, unit: 'Ω', tol: 0.02, hint: '$r_{O5} = \\dfrac{1}{\\lambda_n I_{D5}}$', how: ['$$r_{O5} = \\frac{1}{0.1\\times 100\\,\\mu} = 100\\,\\text{k}\\Omega$$'] },
          { q: 'Next: $1/g_{m1}$?', answer: T5V.inv, unit: 'Ω', tol: 0.02, hint: '$g_{m1} = 0.707$ mS from the first part.', how: ['$$\\frac{1}{g_{m1}} = \\frac{1}{0.707\\,\\text{mS}} = 1.41\\,\\text{k}\\Omega$$'] }],
          q: 'Find the common-mode gain $|A_{CM}|$ without CMFB (the R’s still connected).', answer: ans('bank-t5q3', 'acm'), unit: 'V/V', tol: 0.02,
          hint: ['CM half circuit: the R’s carry no current (both ends move together); split the tail into two halves of $2r_{O5}$ each. It is a CS stage with source degeneration.',
            '$|A_{CM}| = \\dfrac{r_{O3}}{1/g_{m1} + 2r_{O5}}$ ($r_{O1}$ ignored)'],
          how: ['In CM both outputs move together: no voltage across the R’s, no current. Drop them.',
            'Split the tail: each half has $2r_{O5}$ in its source and $r_{O3}$ as its load: $$2r_{O5} = 2\\times 100\\,\\text{k} = 200\\,\\text{k}\\Omega,\\quad \\frac{1}{g_{m1}} = \\frac{1}{0.707\\,\\text{mS}} = 1.41\\,\\text{k}\\Omega$$',
            'Degenerated CS gain: $$|A_{CM}| = \\frac{r_{O3}}{1/g_{m1} + 2r_{O5}} = \\frac{100\\,\\text{k}}{1.41\\,\\text{k} + 200\\,\\text{k}} = 0.497$$'],
          why: 'In CM the tail counts as $2r_{O5}$ per half, so $|A_{CM}| \\approx r_{O3}/(2r_{O5})$.' },
        say: 'In CM both outputs move together, so the R’s carry nothing. Each half sees the tail as $2r_{O5}$: $|A_{CM}| = r_{O3}/(1/g_{m1} + 2r_{O5}) ≈ 0.5$.' },
      { t: 35, title: '**Optimum $V_{O,CM}$: the middle of the output range.** Floor: M5 and M1 saturated ($V_{ov5} + V_{ov1}$). Ceiling: M3 saturated ($V_{DD} - |V_{ov3}|$).',
        tex: 'V_{ov1} = \\sqrt{\\tfrac{2(50\\,\\mu)}{100\\,\\mu\\cdot 50}} = 0.1414\\,\\text{V},\\; V_{ov5} = \\sqrt{\\tfrac{2(100\\,\\mu)}{100\\,\\mu\\cdot 50}} = 0.2\\,\\text{V},\\; |V_{ov3}| = \\sqrt{\\tfrac{2(50\\,\\mu)}{50\\,\\mu\\cdot 50}} = 0.2\\,\\text{V},\\; V_{O,min} = V_{ov5} + V_{ov1} = 0.2 + 0.1414 = 0.3414\\,\\text{V},\\; V_{O,max} = V_{DD} - |V_{ov3}| = 1.8 - 0.2 = 1.6\\,\\text{V},\\; V_{O,CM} = \\frac{0.3414 + 1.6}{2} = 0.9707\\,\\text{V}', hl: [T([250, 150, 220, 330, C.volt])],
        try: { parts: [
          { q: 'First: $V_{ov1}$ (M1: 50 µA)?', answer: T5V.vov1, unit: 'V', tol: 0.01, hint: '$V_{ov} = \\sqrt{\\dfrac{2I_D}{\\mu C_{ox}(W/L)}}$', how: ['$$V_{ov1} = \\sqrt{\\frac{2(50\\,\\mu)}{100\\,\\mu\\times 50}} = 0.141\\,\\text{V}$$'] },
          { q: 'Next: $V_{ov5}$ (tail M5: 100 µA)?', answer: T5V.vov5, unit: 'V', tol: 0.01, hint: 'Same formula, $I_D = 100\\,\\mu$A, $\\mu_nC_{ox}$', how: ['$$V_{ov5} = \\sqrt{\\frac{2(100\\,\\mu)}{100\\,\\mu\\times 50}} = 0.2\\,\\text{V}$$'] },
          { q: 'Next: $|V_{ov3}|$ (PMOS M3: 50 µA)?', answer: T5V.vov3, unit: 'V', tol: 0.01, hint: 'Same formula with $\\mu_pC_{ox} = 50\\,\\mu$A/V²', how: ['$$|V_{ov3}| = \\sqrt{\\frac{2(50\\,\\mu)}{50\\,\\mu\\times 50}} = 0.2\\,\\text{V}$$'] }],
          q: 'Find the optimum output CM level $V_{O,CM}$: the level that allows the largest symmetric output swing.', answer: ans('bank-t5q3', 'vocm'), unit: 'V', tol: 0.01,
          hint: ['Find each overdrive from its current, then the lowest and highest output that keep M5, M1 and M3 saturated; take the middle.',
            '$V_{ov} = \\sqrt{\\dfrac{2I_D}{\\mu C_{ox}(W/L)}}$, $\\;V_{O,CM} = \\frac{(V_{ov5} + V_{ov1}) + (V_{DD} - |V_{ov3}|)}{2}$'],
          how: ['Overdrives from the currents (W/L = 50): $$V_{ov1} = \\sqrt{\\frac{2(50\\,\\mu)}{100\\,\\mu\\times 50}} = 0.141\\,\\text{V},\\quad V_{ov5} = \\sqrt{\\frac{2(100\\,\\mu)}{100\\,\\mu\\times 50}} = 0.2\\,\\text{V},\\quad |V_{ov3}| = \\sqrt{\\frac{2(50\\,\\mu)}{50\\,\\mu\\times 50}} = 0.2\\,\\text{V}$$',
            'Lowest output (M5 and M1 saturated): $$V_{O,min} = V_{ov5} + V_{ov1} = 0.2 + 0.141 = 0.341\\,\\text{V}$$',
            'Highest output (M3 saturated): $$V_{O,max} = V_{DD} - |V_{ov3}| = 1.8 - 0.2 = 1.6\\,\\text{V}$$',
            'The middle: $$V_{O,CM} = \\frac{0.341 + 1.6}{2} = 0.971\\,\\text{V}$$'],
          calc: [{ what: 'The whole middle in one line', keys: '( 0.2 + [√] ( 2 × 50µ ÷ ( 100µ × 50 ) ) + 1.8 − 0.2 ) ÷ 2 [EXE]', shows: '0.9707', note: 'Close the √ bracket before adding 1.8.' }] },
        say: 'Output floor: tail + M1 overdrives, 0.341 V. Ceiling: $1.8 - |V_{ov3}| = 1.6$ V. Middle: 0.971 V.' },
      { t: 43, title: '**CMRR without CMFB** = the gain you want ÷ the gain you don’t.', tex: '\\text{CMRR} = \\frac{A_d}{|A_{CM}|} = \\frac{46.83}{0.4965} = 94.3\\;(39.5\\,\\text{dB})',
        try: { q: 'Find the CMRR of the amplifier without CMFB (as a ratio), from the two gains above.', answer: ans('bank-t5q3', 'cmrr'), unit: '', tol: 0.02,
          hint: ['CMRR compares the differential gain with the common-mode gain.',
            '$\\text{CMRR} = \\dfrac{A_d}{|A_{CM}|}$'],
          how: ['Divide the two gains: $$\\text{CMRR} = \\frac{A_d}{|A_{CM}|} = \\frac{46.83}{0.4965} = 94.3$$',
            'In dB: $$20\\log_{10}(94.3) = 39.5\\,\\text{dB}$$'],
          why: 'Poor: a CM gain near 0.5 lets the CM straight through. Part 2 adds the CMFB loop.' },
        say: 'CMRR = 46.8/0.497 ≈ 94 (39.5 dB). Poor — part 2 adds the CMFB loop.' },
      { t: 51, ans: true, title: `**Part 1 answers:** $A_d = ${fx(ans('bank-t5q3', 'ad'), 4)}$ · $|A_{CM}| = ${fx(ans('bank-t5q3', 'acm'), 4)}$ · $V_{O,CM} = ${fx(ans('bank-t5q3', 'vocm'), 4)}$ V · CMRR $= ${fx(ans('bank-t5q3', 'cmrr'), 3)}$`, say: 'These match the 2024 key. Two half circuits, two different answers: in DM the R midpoint is ground, in CM the R’s are open.' },
    ],
  });
}, { q: 'Mid-sem 2024 Q1 (part 1)' });

scene(L10, '2024 mid-sem Q1 (Tutorial 5 Q3), part 2: with CMFB', 84, (S) => {
  const T = tfm(1, 0, 100);
  pyqFrame(S, {
    paper: 'm24q1', intro: 5, tag: 'LEC 10 · PAST PAPER 3 OF 4', title: 'Close the CM loop: loop gain, new A_CM, new CMRR', src: 'Mid-sem 2024-25 Q1 = Tutorial 5 Q3 · part 2',
    q: 'With the CMFB circuit (M7–M12): the CM gain allowed for ±1% on $V_{O,CM}$, the CM loop gain, the CM gain achieved, and the CMRR with CMFB.',
    giv: '$I_1 = 50\\,\\mu$A, $I_2 = 200\\,\\mu$A, $W/L = 50$ for all, $R = 10$ MΩ, $V_{DD} = 1.8$ V, $\\mu_nC_{ox} = 100\\,\\mu$, $\\mu_pC_{ox} = 50\\,\\mu$A/V², $\\lambda_n = 0.1$, $\\lambda_p = 0.2$ V⁻¹, $V_{thn} = 0.4$, $|V_{thp}| = 0.5$ V. From part 1: $A_d = 46.83$, $|A_{CM}| = 0.4965$, $V_{O,CM} = 0.971$ V',
    qh: 200, tests: 'the **CMFB loop gain** traced around the loop (sense → error amp → tail → back), and **feedback dividing the CM gain by (1 + T)** while $A_d$ stays.',
    fig: (S2) => { const g = t5q3Fig(S2); g.setAttribute('transform', 'translate(0 100)'); },
    steps: [
      { t: 6, title: '**The ±1% target.** The output CM may move from −1% to +1% of $V_{O,CM}$ (a 2% window) while the input CM sweeps its whole range, from $V_{ov5} + V_{GS1}$ up to $V_{O,CM} + V_{thn}$.',
        tex: 'V_{in,min} = V_{ov5} + V_{thn} + V_{ov1} = 0.2 + 0.4 + 0.141 = 0.741\\,\\text{V},\\; V_{in,max} = V_{O,CM} + V_{thn} = 0.971 + 0.4 = 1.371\\,\\text{V},\\; |A_{CM}|_{req} = \\frac{2(0.01)(0.971)}{1.371 - 0.741} = \\frac{0.0194}{0.629} = 0.0309',
        try: { parts: [
          { q: 'First: the lowest input CM $V_{in,min}$ (tail M5 just saturated)?', answer: T5V.vinmin, unit: 'V', tol: 0.01, hint: '$V_{in,min} = V_{ov5} + V_{thn} + V_{ov1}$ (overdrives from part 1)', how: ['$$V_{in,min} = 0.2 + 0.4 + 0.141 = 0.741\\,\\text{V}$$'] },
          { q: 'Next: the highest input CM $V_{in,max}$ (M1 just saturated)?', answer: T5V.vinmax, unit: 'V', tol: 0.01, hint: '$V_{in,max} = V_{O,CM} + V_{thn}$', how: ['$$V_{in,max} = 0.971 + 0.4 = 1.371\\,\\text{V}$$'] },
          { q: 'Next: the allowed output-CM change (±1% of $V_{O,CM}$)?', answer: T5V.dvo, unit: 'V', tol: 0.02, hint: 'A 2% window: $2(0.01)V_{O,CM}$', how: ['$$\\Delta V_{O,CM} = 2\\times 0.01\\times 0.971 = 0.0194\\,\\text{V}$$'] }],
          q: '$V_{O,CM}$ (part 1) may vary by ±1% while the input CM moves over its full range. What is the largest CM gain allowed?', answer: ans('bank-t5q3', 'target'), unit: 'V/V', tol: 0.03,
          hint: ['Same method as Quiz 2 Q2: (allowed output-CM change) ÷ (input-CM range). First the input-CM range: a check at the tail plus a link up to M1’s gate, and the fence on M1.',
            '$V_{in,min} = V_{ov5} + V_{GS1}$, $\\;V_{in,max} = V_{O,CM} + V_{thn}$, $\\;|A_{CM}|_{req} = \\dfrac{2(0.01)V_{O,CM}}{V_{in,max} - V_{in,min}}$'],
          how: ['Lowest input CM: the tail’s overdrive plus M1’s $V_{GS}$ (overdrives from part 1): $$V_{in,min} = 0.2 + (0.4 + 0.141) = 0.741\\,\\text{V}$$',
            'Highest input CM: M1’s gate at most $V_{thn}$ above its drain: $$V_{in,max} = 0.971 + 0.4 = 1.371\\,\\text{V}$$',
            'Allowed output change (a 2% window): $$\\Delta V_{O,CM} = 2\\times 0.01\\times 0.971 = 0.0194\\,\\text{V}$$',
            'The ratio: $$|A_{CM}|_{req} = \\frac{0.0194}{1.371 - 0.741} = \\frac{0.0194}{0.629} = 0.0309$$'],
          why: '±1% means a 2% window over the **whole** input-CM range.' },
        say: 'Same method as the quiz: allowed output-CM change ÷ input-CM range = 0.031.' },
      { t: 15, title: '**CM loop gain: go once round the loop.** A CM change at the outputs enters M8; the pair passes $g_{m7}/2$ of it into diode M9 (≈ 971 Ω); M9 drives M5 ($g_{m5}$); M5’s change splits, half to each output, into $r_{O3}\\parallel R_{dn}$.', tex: 'g_{m7} = \\sqrt{2(50\\,\\mu)(50)(100\\,\\mu)} = 0.707\\,\\text{mS},\\; R_9 = \\tfrac{1}{g_{m9}}\\parallel r_{O9}\\parallel r_{O7} = 1\\,\\text{k}\\parallel 100\\,\\text{k}\\parallel 50\\,\\text{k} = 971\\,\\Omega,\\; g_{m5} = \\sqrt{2(100\\,\\mu)(50)(100\\,\\mu)} = 1\\,\\text{mS},\\; R_{dn} = r_{O1} + 2r_{O5}(1 + g_{m1}r_{O1}) = 200\\,\\text{k} + 200\\,\\text{k}(142.4) = 28.7\\,\\text{M}\\Omega,\\; T = \\tfrac{g_{m7}}{2}R_9\\,g_{m5}\\,\\tfrac{1}{2}(r_{O3}\\parallel R_{dn}) = (0.354\\,\\text{m})(971)(1\\,\\text{m})(49.8\\,\\text{k}) = 17.1', hl: [T([560, 150, 340, 450, C.amb]), T([300, 490, 140, 110, C.n])],
        try: { parts: [
          { q: 'Loop, block 1: $g_{m7}$ of the error-amp pair (PMOS, 100 µA each)?', answer: T5V.gm7, unit: 'S', tol: 0.02, hint: '$g_m = \\sqrt{2\\mu_pC_{ox}(W/L)I_D}$', how: ['$$g_{m7} = \\sqrt{2(50\\,\\mu)(50)(100\\,\\mu)} = 0.707\\,\\text{mS}$$'] },
          { q: 'Block 2: the resistance at M9’s drain, $\\frac{1}{g_{m9}}\\parallel r_{O9}\\parallel r_{O7}$ (both 100 µA)?', answer: T5V.R9, unit: 'Ω', tol: 0.02, hint: '$g_{m9} = \\sqrt{2(100\\,\\mu)(50)(100\\,\\mu)} = 1$ mS, $r_{O9} = \\frac{1}{0.1\\cdot 100\\,\\mu}$, $r_{O7} = \\frac{1}{0.2\\cdot 100\\,\\mu}$', how: ['$$1\\,\\text{k}\\parallel 100\\,\\text{k}\\parallel 50\\,\\text{k} = 971\\,\\Omega$$'] },
          { q: 'Block 3: $g_{m5}$ of the tail (NMOS, 100 µA)?', answer: T5V.gm5, unit: 'S', tol: 0.02, hint: '$g_m = \\sqrt{2\\mu_nC_{ox}(W/L)I_D}$', how: ['$$g_{m5} = \\sqrt{2(100\\,\\mu)(50)(100\\,\\mu)} = 1\\,\\text{mS}$$'] },
          { q: 'Block 4: $R_{dn}$, the CM resistance looking down into M1 (degenerated by $2r_{O5}$)?', answer: T5V.Rdn, unit: 'Ω', tol: 0.02, hint: '$R_{dn} = r_{O1} + 2r_{O5}(1 + g_{m1}r_{O1})$', how: ['$$R_{dn} = 200\\,\\text{k} + 200\\,\\text{k}\\times(1 + 141.4) = 28.7\\,\\text{M}\\Omega$$'] }],
          q: 'Find the CM loop gain $T$ of the CMFB loop (break it at the outputs and go once round: M8/M7 pair → diode M9 → tail M5 → back to the outputs).', answer: T5V.T, unit: '', tol: 0.03,
          hint: ['Multiply the gain of every block met going once round the loop: the pair gives $g_{m7}/2$, diode M9 turns it into a voltage, M5 turns that into a current, which splits half to each output.',
            '$T = \\frac{g_{m7}}{2}\\,R_9\\,g_{m5}\\,\\frac{1}{2}(r_{O3}\\parallel R_{dn})$'],
          how: ['Block by block: $$g_{m7} = 0.707\\,\\text{mS},\\quad R_9 = 971\\,\\Omega,\\quad g_{m5} = 1\\,\\text{mS}$$',
            'Each output sees $r_{O3}$ up and $R_{dn} = 28.7$ MΩ down: $$r_{O3}\\parallel R_{dn} = 100\\,\\text{k}\\parallel 28.7\\,\\text{M} = 99.7\\,\\text{k}\\Omega$$',
            'Multiply round the loop: $$T = (0.354\\,\\text{m})(971)(1\\,\\text{m})(49.8\\,\\text{k}) = 17.1$$'],
          why: 'Loop gain = product of every block once round the loop.' },
        say: 'Trace the loop once round: the output CM change enters M8, the pair passes half its $g_m$ into diode M9 (≈ 971 Ω), M9 drives M5, and M5’s current change splits into the two outputs. Product ≈ 17.' },
      { t: 25, title: '**Feedback divides the CM gain by (1 + T).** $A_d$ is untouched, because a differential signal does not move $V_{O,CM}$.', tex: stepTex('bank-t5q3', 7),
        try: { q: 'Using $|A_{CM}|$ without CMFB (part 1) and the loop gain $T$ just found, find the CM gain with the CMFB loop closed.', answer: ans('bank-t5q3', 'acmfb'), unit: 'V/V', tol: 0.03,
          hint: ['Negative feedback divides the open-loop gain by one plus the loop gain.',
            '$|A_{CM}|_{fb} = \\dfrac{|A_{CM}|}{1 + T}$'],
          how: ['The CMFB loop is negative feedback on the CM, so it divides the CM gain by $(1 + T)$: $$1 + T = 1 + 17.1 = 18.1$$',
            'Divide: $$|A_{CM}|_{fb} = \\frac{0.4965}{18.1} = 0.0274$$',
            'Compare with the target from the first step: 0.0274 < 0.0309, so the ±1% spec is met.'],
          why: 'Closed-loop CM gain = open-loop CM gain ÷ (1 + T).' },
        say: 'Feedback divides the CM gain by $(1 + T)$: $0.497/18.1 = 0.027$. The DM gain is unchanged.' },
      { t: 33, title: '**CMRR with CMFB:** the same $A_d$ over a much smaller CM gain.', tex: '\\text{CMRR} = \\frac{A_d}{|A_{CM}|_{fb}} = \\frac{46.83}{0.02743} = 1707\\;(64.6\\,\\text{dB})',
        try: { q: 'Find the CMRR with the CMFB loop closed (as a ratio).', answer: ans('bank-t5q3', 'cmrrfb'), unit: '', tol: 0.03,
          hint: ['CMFB does not change $A_d$; only the CM gain changes.',
            '$\\text{CMRR} = \\dfrac{A_d}{|A_{CM}|_{fb}}$'],
          how: ['CMFB leaves the differential gain alone: $A_d = 46.83$ (part 1).',
            'Divide by the new CM gain: $$\\text{CMRR} = \\frac{46.83}{0.02743} = 1707$$',
            'In dB: $$20\\log_{10}(1707) = 64.6\\,\\text{dB}$$ (up from 39.5 dB without CMFB).'],
          calc: [{ what: 'Ratio, then dB (log = [SHIFT] [x²])', keys: '46.83 ÷ 0.02743 [EXE]  then  20 × [SHIFT] [x²] Ans ) [EXE]', shows: '1707, then 64.65' }] },
        say: 'CMRR jumps to about 1700 (64.6 dB). And 0.027 is below the 0.031 allowed, so the ±1% spec is met.' },
      { t: 41, title: '**Note on the key:** it uses $g_{m10} = 0.316$ mS, but $\\sqrt{2\\cdot100\\mu\\cdot50\\cdot100\\mu} = 1$ mS. With 0.316 mS: T = 55.7, $A_{CM} = 0.0088$, CMRR 5373', tex: '',
        say: 'Your key’s loop gain (55.7) comes from a slip in one $g_m$. If the marker insists on the key, quote 55.7 and say why your 17 differs.' },
      { t: 49, ans: true, title: `**Part 2 answers:** $|A_{CM}|_{req} = ${fx(ans('bank-t5q3', 'target'), 3)}$ · $T ≈ ${fx(ans('bank-t5q3', 'loop'), 3)}$ · $|A_{CM}|_{fb} = ${fx(ans('bank-t5q3', 'acmfb'), 3)}$ · CMRR ≈ ${fx(ans('bank-t5q3', 'cmrrfb'), 4)}`, say: 'Write-up: loop gain = product of every gain around the CM loop; closed-loop CM gain = open-loop CM gain ÷ (1 + T); CMRR = $A_d$ ÷ that.' },
    ],
  });
}, { q: 'Mid-sem 2024 Q1 (part 2)' });

/* Tutorial 5 Q2 figure: NMOS-input folded cascode, R1/R2 sensing, error amp driving M3, M4 */
function t5q2Fig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 100, 860, 150);
  const L = 470, R = 690;
  pmos(S, L, 205, { right: true, gl: 26 }); pmos(S, R, 205, { gl: 26 }); wire(S, [[L + 56, 205], [R - 56, 205]]);
  wire(S, [[L, 150], [L, 155]]); wire(S, [[R, 150], [R, 155]]);
  wire(S, [[L, 255], [L, 280]]); wire(S, [[R, 255], [R, 280]]); dot(S, L, 268); dot(S, R, 268);
  pmos(S, L, 330, { right: true, gl: 26 }); pmos(S, R, 330, { gl: 26 }); wire(S, [[L + 56, 330], [R - 56, 330]]);
  wire(S, [[L, 380], [L, 460]]); wire(S, [[R, 380], [R, 460]]); dot(S, L, 410); dot(S, R, 410);
  resh(S, L, 580, 410, { label: 'R_1' }); resh(S, 580, R, 410, { label: 'R_2' }); dot(S, 580, 410);
  txt(S, L - 12, 404, 'V_out1', { size: 18, color: C.volt, weight: 700, anchor: 'end' }); txt(S, R + 12, 404, 'V_out2', { size: 18, color: C.volt, weight: 700 });
  nmos(S, L, 510, { right: true, gl: 26 }); nmos(S, R, 510, { gl: 26 }); wire(S, [[L + 56, 510], [R - 56, 510]]);
  wire(S, [[L, 560], [L, 590]]); wire(S, [[R, 560], [R, 590]]);
  const m3 = nmos(S, L, 640, { name: 'M3', right: true, gl: 26, nameSide: 'l' }); const m4 = nmos(S, R, 640, { name: 'M4', gl: 26 });
  wire(S, [[L + 56, 640], [R - 56, 640]]); txt(S, 580, 632, 'V_E', { size: 18, color: C.amb, weight: 700, anchor: 'middle' });
  gnd(S, L, 690); gnd(S, R, 690);
  // input pair at left
  nmos(S, 180, 480, { name: 'M1', gate: 'V_in1' }); nmos(S, 320, 480, { name: 'M2', right: true, gate: 'V_in2' });
  wire(S, [[180, 430], [180, 268], [L, 268]]); wire(S, [[320, 430], [320, 240], [R + 0, 240], [R, 268]]);
  wire(S, [[180, 530], [180, 550], [320, 550], [320, 530]]); isrc(S, 250, 590, { label: 'I_SS', len: 40 }); gnd(S, 250, 630);
  // error amp
  amp(S, 860, 600, { left: true, w: 110, h: 100 });
  wire(S, [[580, 410], [580, 440], [900, 440], [900, 575], [860, 575]]); txt(S, 908, 520, 'V_out,CM', { size: 18, color: C.amb, weight: 700 });
  wire(S, [[860, 625], [900, 625]]); txt(S, 908, 631, 'V_REF', { size: 18, color: C.muted });
  wire(S, [[750, 600], [750, 725], [580, 725], [580, 640]]); dot(S, 580, 640); // amp output → the M3/M4 gate bus (V_E), clear of M4
  r();
  return g;
}

scene(L10, 'Follow the current: folded cascode with CMFB on M3, M4', 56, (S) => {
  header(S, 'LEC 10 · FOLLOW THE CURRENT', 'I_P folds: part goes into the input pair, the rest down the cascode');
  const TR = 'translate(30 140) scale(0.88)';
  const g = t5q2Fig(S); g.setAttribute('transform', TR);
  S.draw(g, 0.3, 2.4);
  const F = (fn) => l10Shift(S, 0, fn, TR);
  F(() => {
    current(S, [[470, 152], [470, 266]], 4, null, 'I_P', { at: [405, 205], color: C.cur });
    current(S, [[690, 152], [690, 266]], 4, null, 'I_P', { at: [755, 205], color: C.cur });
  });
  S.say(4, 'The Tutorial 5 Q2 folded cascode. Two PMOS sources at the top each push $I_P$ down from $V_{DD}$ into a folding node.');
  F(() => {
    current(S, [[250, 553], [250, 628]], 10, null, null, { color: C.ok });
    current(S, [[470, 268], [180, 268], [180, 550], [244, 550]], 10, 32, 'I_SS/2', { at: [118, 350], color: C.n });
    current(S, [[690, 268], [690, 240], [320, 240], [320, 550], [256, 550]], 10, 32, 'I_SS/2', { at: [252, 350], color: C.pink });
  });
  S.say(10, 'The input pair hangs from those nodes. The tail pulls $I_{SS}$, and with equal inputs M1 and M2 each take $I_{SS}/2$, out of the left and the right folding node.');
  eqAt(S, '\\text{KCL at the folding node: } I_P = I_{D1} + I_{casc}', 1250, 250, 16, { size: 26, w: 620 });
  S.say(16, 'KCL at the left folding node: $I_P$ comes in, and leaves either through M1 or down the cascode branch.');
  S.stop(22, {
    src: 'Exam-style check',
    parts: [{ q: 'First: how much current does the input transistor M1 carry?', answer: 1e-3 / 2, unit: 'A', tol: 0.02,
      hint: 'Equal inputs: the tail splits evenly, $I_{D1} = I_{SS}/2$.', how: ['$$I_{D1} = \\frac{I_{SS}}{2} = \\frac{1\\,\\text{mA}}{2} = 0.5\\,\\text{mA}$$'] }],
    q: 'Example numbers (Tutorial 5 Q2 gives none): each top PMOS source gives $I_P = 1$ mA and the tail gives $I_{SS} = 1$ mA, with equal inputs. How much current flows down each cascode branch into M3 and M4?',
    hint: ['KCL at the folding node where M1’s drain joins: $I_P$ comes in, two currents leave.',
      '$I_P = \\frac{I_{SS}}{2} + I_{casc}$, so $I_{casc} = I_P - \\frac{I_{SS}}{2}$'],
    how: ['Equal inputs, so the tail splits evenly: $$I_{D1} = \\frac{I_{SS}}{2} = \\frac{1}{2} = 0.5\\,\\text{mA}$$',
      'KCL at the left folding node: the top source’s current leaves either through M1 or down the cascode: $$I_P = I_{D1} + I_{casc}$$',
      'The cascode branch gets the rest: $$I_{casc} = I_P - I_{D1} = 1 - 0.5 = 0.5\\,\\text{mA}$$',
      'That current runs through both cascodes and must be sunk exactly by M3 (and by M4 on the right).'],
    why: 'Folded cascode: cascode current = $I_P - I_{SS}/2$. M3, M4 must sink exactly that; $V_E$ (the CMFB) makes them.',
    answer: 0.5e-3, unit: 'A', tol: 0.02,
  });
  F(() => {
    current(S, [[470, 270], [470, 688]], 22.4, 32, 'I_P − I_SS/2', { at: [395, 576], color: C.amb });
    current(S, [[690, 270], [690, 688]], 22.4, 32, 'I_P − I_SS/2', { at: [775, 470], color: C.amb });
  });
  eqAt(S, 'I_{casc} = I_P - \\tfrac{I_{SS}}{2} = 1 - 0.5 = 0.5\\,\\text{mA}', 1250, 330, 22.4, { size: 26, w: 620, color: '#ffd38a' });
  S.say(22.4, 'The rest, $I_P - I_{SS}/2$, folds down through the PMOS cascode, the output node and the NMOS cascode into M3. M3 must sink exactly that, and its gate is $V_E$: the CMFB amplifier makes it match.');
  S.stop(32, {
    src: 'Exam-style check',
    q: 'A small differential input makes M1 carry $I_{SS}/2 + \\Delta I$. The top source still gives $I_P$. What flows down the left cascode branch now?',
    choices: ['$I_P - I_{SS}/2 - \\Delta I$', '$I_P - I_{SS}/2 + \\Delta I$', '$I_P - I_{SS}/2$ (unchanged)'],
    answer: 0,
    hint: ['The top source is fixed; only the share taken by M1 changed.',
      'KCL at the left folding node: $I_{casc,1} = I_P - I_{D1}$'],
    how: ['The top source is a current source: it still gives $I_P$.',
      'KCL at the left folding node: $$I_{casc,1} = I_P - I_{D1} = I_P - \\left(\\tfrac{I_{SS}}{2} + \\Delta I\\right)$$ so the cascode loses $\\Delta I$.',
      'On the right, M2 carries $\\Delta I$ less, so that cascode gains $\\Delta I$. M3, M4 still sink the old value, so $V_{out1}$ falls and $V_{out2}$ rises: a differential output, CM untouched.'],
    why: 'In a folded cascode the cascode current moves opposite to the input device’s current.',
  });
  F(() => {
    current(S, [[470, 270], [470, 688]], 32.4, null, 'I_P − I_SS/2 − ΔI', { at: [395, 576], color: C.amb });
    current(S, [[690, 270], [690, 688]], 32.4, null, 'I_P − I_SS/2 + ΔI', { at: [790, 470], color: C.amb });
  });
  S.say(32.4, 'With a differential input each cascode branch changes opposite to its input transistor. M3 and M4 do not change, so the difference flows out of one output and into the other. The outputs move apart; the CM stays.');
  remember(S, [
    'Top PMOS sources push $I_P$ down into the folding nodes.',
    'Each folding node splits: $I_P = I_{SS}/2 + I_{casc}$ (input device + cascode branch).',
    'Cascode branch: $I_P - I_{SS}/2$ flows down through both cascodes and the output into M3 (M4).',
    'M3, M4 must sink exactly that: their gate $V_E$ is set by the CMFB amplifier.',
    'Differential input: the cascode currents become $I_P - I_{SS}/2 \\mp \\Delta I$, opposite to M1, M2.',
  ], 40, 'Follow the current · folded cascode + CMFB');
  S.say(40, 'The current rules for the folded cascode: the top source current folds, part into the input pair and the rest down the cascode, and the CMFB sets the bottom sinks to match.');
});

scene(L10, 'Tutorial 5 Q2: which pair for the CMFB amplifier, and its loop gain', 66, (S) => {
  const T = tfm(1, 0, 90);
  pyqFrame(S, {
    paper: 't5q2', tag: 'LEC 10 · PAST PAPER 4 OF 4', title: 'Design the CMFB amplifier: PMOS or NMOS pair? Loop gain?', src: 'Tutorial 5 Q2 · Razavi 9.12',
    q: 'The amplifier sensing $V_{out,CM}$ is a differential pair with an active mirror load and drives M3, M4 through $V_E$. (a) PMOS or NMOS input pair? (b) The CMFB loop gain.',
    qh: 200, tests: 'Lec 9’s habit of **matching an amplifier to the levels around it**, and the **CM loop gain** read as sense → amplify → current → resistance.',
    fig: (S2) => { const g = t5q2Fig(S2); g.setAttribute('transform', 'translate(30 140) scale(0.88)'); },
    steps: [
      { t: 8, title: '**(a) Levels decide the pair.** $V_E$ drives the gates of M3, M4 (NMOS, sources on ground), so it must sit near $V_{GS3}$: **low**. A 5-transistor OTA’s output rests near the diode level of its mirror.', tex: stepTex('bank-t5q2', 0), hl: [T([400, 590, 360, 110, C.amb])],
        try: { q: 'The error amplifier is a differential pair with a current-mirror load, and its output $V_E$ drives the gates of M3 and M4. Should its input pair be PMOS or NMOS?', choices: ['PMOS input pair (with an NMOS mirror at the bottom)', 'NMOS input pair (with a PMOS mirror at the top)'], answer: 0,
          hint: ['What DC level must $V_E$ have to bias M3, M4 (NMOS with their sources on ground)?',
            'The mirror load sits on the rail opposite the input pair, and the output rests about one diode $V_{GS}$ from that rail.'],
          how: ['M3 and M4 are NMOS with sources on ground, so their gates need $$V_E \\approx V_{GS3} = V_{thn} + V_{ov3}$$ which is low, near ground.',
            'PMOS input pair: its mirror is NMOS, at the bottom, so the output rests about one $V_{GS,n}$ above ground: exactly the level M3, M4 need.',
            'NMOS input pair: its mirror is PMOS, at the top, so the output rests near $V_{DD} - |V_{GS,p}|$: far too high, it would turn M3, M4 hard on. So: **PMOS pair**.'],
          why: 'Pick the pair whose mirror sits on the same rail as the devices it drives.' },
        say: 'Levels decide it. $V_E$ must sit near $V_{GS3}$, close to ground. A PMOS input pair has its NMOS mirror at the bottom, so its output rests near $V_{GS,n}$ — the right level. An NMOS pair’s output would rest near $V_{DD} - |V_{GS,p}|$.' },
      { t: 18, title: '**(b) Go round the loop once.** $V_{out,CM}$ → sensing resistors (gain 1) → error amp ($A_{EA}$) → $V_E$ → M3, M4 ($g_{m3}$ each) → a CM current into each output.', tex: stepTex('bank-t5q2', 1), hl: [T([560, 400, 360, 260, C.amb])],
        say: 'Break the loop and follow a CM change: the sensor passes it with gain 1, the error amp multiplies by $A_{EA}$, M3, M4 turn it into $g_{m3}A_{EA}$ times that current…' },
      { t: 27, title: '**Close the loop at the outputs.** In CM, R₁ and R₂ carry no current (both ends move together), so that current meets only $R_{up}\\parallel R_{down}$ at each output.', tex: stepTex('bank-t5q2', 2), hl: [T([440, 190, 280, 390, C.volt])],
        try: { q: 'Which expression is the CMFB loop gain $T_{CM}$?', choices: ['$A_{EA}\\,g_{m3}\\,(R_{up}\\parallel R_{down})$', '$A_{EA}\\,g_{m3}\\,(R_1 + R_2)$', '$A_{EA}\\,(R_{up}\\parallel R_{down})$', '$g_{m3}\\,(R_{up}\\parallel R_{down})$'], answer: 0,
          hint: ['Multiply every gain met going once round the loop: sensing, error amp, M3 (voltage → current), output node (current → voltage).',
            'In CM the R’s carry no current, so which resistance does each output see?'],
          how: ['Sensing: the R midpoint follows the output CM with gain 1.',
            'Error amp, then M3 turns voltage into current: $$\\Delta I = g_{m3}\\,A_{EA}\\,\\Delta V_{out,CM}$$',
            'At each output that current meets only the cascodes (R₁, R₂ carry nothing in CM): $$T_{CM} = A_{EA}\\,g_{m3}\\,(R_{up}\\parallel R_{down})$$',
            'The others are wrong: $(R_1 + R_2)$ only matters for a DM signal; dropping $g_{m3}$ or $A_{EA}$ skips a block of the loop.'],
          why: 'Loop gain = product of every block going once round the loop.' },
        say: '…and that current lands on each output, which (for a CM change) sees only the cascodes: $R_{up}\\parallel R_{down}$. Loop gain $T = A_{EA}g_{m3}(R_{up}\\parallel R_{down})$.' },
      { t: 36, ans: true, title: '**Answers:** (a) PMOS input pair · (b) $T_{CM} = A_{EA}\\,g_{m3}\\,(R_{up}\\parallel R_{down})$', say: 'Check the sign too: $V_{out,CM}$ up → $V_E$ up → M3, M4 pull harder → outputs down. Negative feedback, as required.' },
    ],
  });
}, { q: 'Tutorial 5 Q2' });
