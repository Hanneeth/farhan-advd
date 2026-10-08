/* Lesson C: every question tied to Lecture 6, solved by the student first. */
'use strict';
const CQ = 'Lec 6 · Questions';
// names and gate biases exactly as printed in Tutorial 2 Q3 (Razavi Problem 9.3): M9, M10 on V_b3; M7, M8 on V_b2; M3, M4 on V_b1; M5, M6 on V_b4; ideal tail I_SS
const RAZ = { tail: 'I_SS', in: ['M1', 'M2'], top: ['M9', 'M10'], pc: ['M7', 'M8'], nc: ['M3', 'M4'], bot: ['M5', 'M6'], bias: { top: 'V_b3', pc: 'V_b2', nc: 'V_b1', bot: 'V_b4', tail: null } };
const FT = tfm(0.82, -60, 140);
/* branch currents on foldFig (PMOS-input fold, figure coordinates): each input device sends I_SS/2 into its fold node,
   each cascode branch carries I down to it, so each bottom source sinks I_SS/2 + I (KCL at the fold) */
const FOLD_CUR = { tf: 'translate(-60 140) scale(0.82)', list: [
  [[[300, 270], [220, 270], [220, 530], [606, 530]], 'I_SS/2', { color: C.p, at: [150, 455] }],
  [[[300, 270], [380, 270], [380, 705], [915, 705], [915, 530], [854, 530]], 'I_SS/2', { color: C.p, at: [300, 640] }],
  [[[620, 160], [620, 520]], null, { color: C.cur }],
  [[[840, 160], [840, 520]], 'I', { color: C.cur, at: [915, 255] }],
  [[[620, 540], [620, 650]], null, { color: C.amb }],
  [[[840, 540], [840, 650]], 'I_SS/2 + I', { color: C.amb, at: [1005, 570] }],
] };
const foldFig = (S2) => { const g = foldP(S2, RAZ); g.setAttribute('transform', 'translate(-60 140) scale(0.82)'); };
/* Razavi's parameter "Set A" (the guide's bank), written out so every number on screen is traceable */
const SETA = 'Set A: $\\mu_nC_{ox} = 134.28\\,\\mu$A/V², $\\mu_pC_{ox} = 38.36\\,\\mu$A/V², $V_{thn} = 0.7$ V, $|V_{thp}| = 0.8$ V, $\\lambda_n = 0.1$ V⁻¹, $\\lambda_p = 0.2$ V⁻¹';
const PFX = 'Prefixes on: [SETTINGS] ▸ Calc Settings ▸ Engineer Symbol ▸ On; type µ, m, k with [CATALOG] ▸ Engineer Symbol.';
/* one checked intermediate result inside a stop (engine `parts`) */
const pt = (q, answer, unit, hint, how, tol = 0.02) => ({ q, answer, unit, tol, hint, how });
const par = (a, b) => (a * b) / (a + b);
const kO = (r) => fx(r / 1e3, 3), mS = (g) => fx(g * 1e3, 3);
/* intermediates computed from the givens (Set A: µnCox 134.28µ, µpCox 38.36µ, λn 0.1, λp 0.2), so cards, parts and answers agree */
const NUM = (() => {
  const kn = 134.28e-6, kp = 38.36e-6;
  // P6 / P7: I = 0.375 mA per branch and input device, bottom sources 0.75 mA; Vov 0.5 V (M3–M10), 0.3 V (M1, M2)
  const I6 = 0.375e-3;
  const p6 = { gm1: 2 * I6 / 0.3, gm3: 2 * I6 / 0.5, ro3: 1 / (0.1 * I6), roP: 1 / (0.2 * I6), ro5: 1 / (0.1 * 2 * I6) };
  p6.rup = p6.gm3 * p6.roP * p6.roP; p6.rdown = p6.gm3 * p6.ro3 * par(p6.roP, p6.ro5); p6.rpar = par(p6.rup, p6.rdown);
  p6.rs = par(1 / p6.gm3, p6.ro3); p6.rx = par(p6.roP, p6.ro5);
  // Tutorial 2 Q3: 0.5 mA branches and input devices, bottom sources 1 mA, every Vov 0.45 V
  const t23 = { gm: 2 * 0.5e-3 / 0.45, roN: 1 / (0.1 * 0.5e-3), roP: 1 / (0.2 * 0.5e-3), ro5: 1 / (0.1 * 1e-3) };
  t23.rup = t23.gm * t23.roP * t23.roP; t23.rdown = t23.gm * t23.roN * par(t23.roP, t23.ro5);
  // W/L = 200 devices at 0.5 mA (P5, Tutorial 3 Q1, Tutorial 2 Q2)
  const vovn = Math.sqrt(2 * 0.5e-3 / (kn * 200)), vovp = Math.sqrt(2 * 0.5e-3 / (kp * 200));
  // Tutorial 2 Q2: PMOS at |Vov| = 0.35 V
  const t22 = { wl: 2 * 0.5e-3 / (kp * 0.35 ** 2), gm1: 2 * 0.5e-3 / vovn, roN: 1 / (0.1 * 0.5e-3), gm6: 2 * 0.5e-3 / 0.35, roP: 1 / (0.2 * 0.5e-3) };
  t22.rdown = t22.gm1 * t22.roN ** 2; t22.rup = t22.gm6 * t22.roP ** 2;
  // 2023 mid-sem Q3: 25 µA per side
  const vovP = 0.72 / (2 + Math.SQRT2);
  const m23 = { vovP, tail: Math.SQRT2 * vovP, vgs4: 0.4 + vovP, gm2: 50e-6 / vovP, gm6: 50e-6 / 0.15, roP: 1 / (0.2 * 25e-6), roN: 1 / (0.1 * 25e-6) };
  m23.vov9 = Math.sqrt(2 * 50e-6 / (50e-6 * ans('pyq-m23-q3', 'wlP'))); m23.lookP = m23.gm2 * m23.roP ** 2; m23.lookN = m23.gm6 * m23.roN ** 2;
  return { p6, t23, vovn, vgsn: 0.7 + vovn, vovp, vgsp: 0.8 + vovp, t22, m23 };
})();

/* PMOS-input telescopic (2024 mid-sem Q3) */
function teleP(S, o = {}) {
  const g = S.g(); const r = S.into(g);
  rail(S, 300, 860, 150);
  const L = 470, R = 690;
  isrc(S, 580, 195, { label: 'I_SS', len: 45 }); dot(S, 580, 245); wire(S, [[L, 245], [R, 245]]); wire(S, [[L, 245], [L, 250]]); wire(S, [[R, 245], [R, 250]]);
  pmos(S, L, 300, { name: 'M1', gate: 'V_in1' });
  if (o.buffer) { const m2 = pmos(S, R, 300, { name: 'M2', right: true, nameSide: 'l', gl: 30 }); wire(S, [[m2.gate[0], 300], [790, 300], [790, 470]], { color: C.volt }); dot(S, 790, 470); }
  else pmos(S, R, 300, { name: 'M2', gate: 'V_in2', right: true, nameSide: 'l' });
  wire(S, [[L, 350], [L, 350]]);
  const m3 = pmos(S, L, 400, { name: 'M3', right: true, gl: 26, nameSide: 'l' }); const m4 = pmos(S, R, 400, { name: 'M4', gl: 26 });
  wire(S, [[m3.gate[0], 400], [m4.gate[0], 400]]); txt(S, 580, 391, 'V_b', { size: 17, color: C.muted, anchor: 'middle' });
  wire(S, [[L, 450], [L, 480]]); wire(S, [[R, 450], [R, 480]]); dot(S, L, 465); dot(S, R, 465);
  wire(S, [[R, 465], [830, 465]]); txt(S, 838, 472, 'V_out', { size: 20, color: C.volt, weight: 700 });
  const m5 = nmos(S, L, 530, { name: 'M5', right: true, gl: 26, nameSide: 'l' }); const m6 = nmos(S, R, 530, { name: 'M6', gl: 26 });
  wire(S, [[m5.gate[0], 530], [m6.gate[0], 530]]); wire(S, [[L, 465], [510, 465], [510, 530]], { color: C.amb }); dot(S, 510, 530);
  wire(S, [[L, 580], [L, 590]]); wire(S, [[R, 580], [R, 590]]); dot(S, L, 585);
  const m7 = nmos(S, L, 640, { name: 'M7', right: true, gl: 26, nameSide: 'l' }); const m8 = nmos(S, R, 640, { name: 'M8', gl: 26 });
  wire(S, [[m7.gate[0], 640], [m8.gate[0], 640]]); wire(S, [[L, 585], [545, 585], [545, 640]], { color: C.amb }); dot(S, 545, 640);
  gnd(S, L, 690); gnd(S, R, 690);
  r(); return g;
}

scene(CQ, 'Problem Set 1 P8: folded-cascode CM ranges', 58, (S) => {
  pyqFrame(S, {
    tag: 'LEC 6 · QUESTION 1 OF 9', title: 'Input and output ranges of a folded cascode', src: 'Problem Set 1 P8 (Lec 6)',
    q: 'The P6 folded cascode (PMOS input pair M1, M2). (a) Find the input CM range. (b) Find the output range, and pick one CM level that works at both the input and the output.',
    giv: '$V_{DD} = 3$ V · every swing-critical overdrive (M3–M10) $= 0.5$ V · $|V_{thp}| = 0.8$ V · input pair $|V_{GS1}| = 1.1$ V · the tail source needs 0.4 V across it', qh: 230,
    tests: 'your page’s first circuit with numbers: the PMOS input’s fence and the tail’s check give the input CM range, then checks on the output column give the output range.',
    fig: foldFig, currents: FOLD_CUR,
    steps: [
      { t: 7, title: '(a) **Floor of the input CM.** M1’s drain is the fold node X, held one $V_{ov5}$ above ground. A PMOS stays saturated while its gate is no more than $|V_{thp}|$ below its drain.', tex: 'V_{in,CM,min} = V_X - |V_{thp}| = 0.5 - 0.8 = -0.3\\,\\mathrm{V}', hl: [FT([200, 280, 440, 270, C.p])],
        try: { q: '(a) Start with the low end. How low can the input common-mode level go before M1 leaves saturation?', answer: -0.3, unit: 'V', tol: 0.01, abs: 0.005,
          hint: ['M1’s drain is the fold node X. X sits on the bottom NMOS source M5, which only needs its overdrive. M1 is a PMOS: its gate may sit up to $|V_{thp}|$ below its drain.', '$V_{in,CM,min} = V_X - |V_{thp}|$, with $V_X = V_{ov5}$'],
          how: ['M5 only needs its overdrive to stay saturated, so the fold node X can sit as low as $$V_X = V_{ov5} = 0.5\\,\\text{V}$$', 'M1 is a PMOS. It stays saturated while its drain is at most $|V_{thp}|$ above its gate: $$V_X \\le V_{in,CM} + |V_{thp}|$$', 'Solve for the lowest gate voltage: $$V_{in,CM,min} = V_X - |V_{thp}| = 0.5 - 0.8 = -0.3\\,\\text{V}$$'],
          why: 'A PMOS-input folded cascode accepts inputs below ground: its floor is $V_{ov5} - |V_{thp}|$.' },
        say: 'Floor: $0.5 - 0.8 = -0.3$ V — below ground.' },
      { t: 15, title: '**Ceiling of the input CM.** Walk down from $V_{DD}$: the tail keeps its 0.4 V (a check), then M1’s gate sits one $|V_{GS1}|$ below its source (a link).', tex: 'V_{in,CM,max} = V_{DD} - V_{tail} - |V_{GS1}| = 3 - 0.4 - 1.1 = 1.5\\,\\mathrm{V}', hl: [FT([220, 150, 160, 130, C.p])],
        try: { q: 'Now the high end. How high can the input common-mode level go before the tail current source runs out of room?', answer: 1.5, unit: 'V', tol: 0.01,
          hint: ['Walk down from $V_{DD}$: first the tail source needs its 0.4 V (a check), then M1’s gate is one $|V_{GS1}|$ below M1’s source (a link).', '$V_{in,CM,max} = V_{DD} - V_{tail} - |V_{GS1}|$'],
          how: ['The tail source sits between $V_{DD}$ and M1’s source P and needs 0.4 V, so P can rise only to $$V_P = V_{DD} - 0.4 = 3 - 0.4 = 2.6\\,\\text{V}$$', 'M1’s gate sits one $|V_{GS1}|$ below its source: $$V_{in,CM,max} = V_P - |V_{GS1}| = 2.6 - 1.1 = 1.5\\,\\text{V}$$', 'So the input CM range is −0.3 V to 1.5 V.'] },
        say: 'Ceiling: $3 - 0.4 - 1.1 = 1.5$ V.' },
      { t: 23, title: '(b) **Output floor.** Under the output stand two NMOS, the cascode M3 and the source M5; each needs one overdrive (two checks).', tex: 'V_{out,min} = V_{ov5} + V_{ov3} = 0.5 + 0.5 = 1\\,\\mathrm{V}', hl: [FT([560, 150, 330, 520, C.volt])],
        try: { q: '(b) Output range. First: what is the lowest output voltage before a transistor under the output leaves saturation?', answer: 1, unit: 'V', tol: 0.01,
          hint: ['Count the transistors between the output and ground: the NMOS cascode M3 and the NMOS source M5. Each needs its overdrive (a check).', '$V_{out,min} = V_{ov5} + V_{ov3}$'],
          how: ['Below the output: M3 (cascode) on top of M5 (current source). Each stays saturated with one $V_{ov}$ across it.', 'Add the two checks from ground: $$V_{out,min} = V_{ov5} + V_{ov3} = 0.5 + 0.5 = 1\\,\\text{V}$$', 'The input pair is not in this column (folding!), so it costs no headroom here.'] },
        say: 'Lowest output: $V_{ov5} + V_{ov3} = 1$ V.' },
      { t: 31, title: '**Output ceiling**: two PMOS overdrives (M7, M9) down from $V_{DD}$. Then pick a CM level inside both ranges.', tex: 'V_{out,max} = 3 - 0.5 - 0.5 = 2\\,\\mathrm{V}\\;\\Rightarrow\\;V_{CM} = 1.5\\,\\mathrm{V}\\in[-0.3, 1.5]\\cap[1, 2]', hl: [FT([560, 150, 330, 260, C.p])],
        try: { q: '(b) Now the top of the output range. How high can the output go before a transistor above it leaves saturation?', answer: 2, unit: 'V', tol: 0.01,
          hint: ['Count the transistors between $V_{DD}$ and the output: the PMOS source M9 and the PMOS cascode M7. Each needs its overdrive across it (a check). Every overdrive in the column is 0.5 V (question card).', '$V_{out,max} = V_{DD} - |V_{ov9}| - |V_{ov7}|$'],
          how: ['Above the output: M9 (PMOS current source, source on $V_{DD}$) and M7 (PMOS cascode). Each stays saturated with one $|V_{ov}|$ across it, so each is a check.', 'Walk down from the supply, one overdrive per device: $$V_{out,max} = V_{DD} - |V_{ov9}| - |V_{ov7}| = 3 - 0.5 - 0.5 = 2\\,\\text{V}$$', 'Output range [1 V, 2 V], input CM range [−0.3 V, 1.5 V]: any level in both, e.g. 1.5 V, can sit at the input and the output.'],
          why: 'Output ceiling = $V_{DD}$ minus the PMOS overdrives above the output; the input pair is folded away and costs nothing here.' },
        say: 'Highest: $3 - 0.5 - 0.5 = 2$ V. A CM of 1.5 V lies inside both the input range [−0.3, 1.5] and the output range [1, 2]: input CM = output CM is possible (the telescopic of Ex 9.6 could not do this).' },
      { t: 39, ans: true, title: '**Answers:** input CM from −0.3 V to 1.5 V · output from 1 V to 2 V · e.g. $V_{CM} = 1.5$ V works for both', say: 'This is why folded cascodes suit buffers and capacitive feedback: the same DC level can sit at the input and the output.' },
    ],
  });
}, { q: 'Problem Set 1 P8' });

scene(CQ, 'Tutorial 2 Q3: design a folded cascode (2.4 V, 6 mW)', 66, (S) => {
  pyqFrame(S, {
    paper: 't2q3', tag: 'LEC 6 · QUESTION 2 OF 9', title: 'Power and swing decide everything', src: 'Tutorial 2 Q3 · Razavi 9.3',
    q: 'PMOS-input folded cascode, $V_{DD} = 3$ V, all $L = 0.5$ µm, power 6 mW, maximum differential output swing 2.4 V. Find the currents, the overdrives, the gain, and whether the input CM can reach 0 V.', giv: SETA + '. Assume half the supply current goes to the input pair and equal overdrives in the output column.', qh: 250,
    tests: 'the Ex 9.7-style design order on a folded cascode (power → currents, swing → overdrives), the two looks for gain, and your page’s question: can a PMOS input pair take an input at ground?',
    fig: foldFig, currents: FOLD_CUR,
    steps: [
      { t: 7, title: '**Power budget.** The power fixes the supply current; half feeds the input pair (the tail), half feeds the two cascode branches.', tex: 'I_{total} = \\frac{P}{V_{DD}} = \\frac{6\\,\\mathrm{mW}}{3\\,\\mathrm{V}} = 2\\,\\mathrm{mA},\\quad I_{SS} = 1\\,\\mathrm{mA},\\quad I = 0.5\\,\\mathrm{mA}',
        try: {
          parts: [
            pt('Total current drawn from the supply?', 2e-3, 'A', ['Power = supply voltage × current.', '$I_{total} = P/V_{DD}$'], ['$$I_{total} = \\frac{6\\,\\text{mW}}{3\\,\\text{V}}$$']),
          ],
          q: 'Start with the currents. What tail current $I_{SS}$ does the input pair get?', answer: 1e-3, unit: 'A', tol: 0.01,
          hint: ['The power and the supply give the total current. The question card says half of it goes to the input pair.', '$I_{total} = P/V_{DD}$, $I_{SS} = I_{total}/2$'],
          how: ['Total current drawn from the supply: $$I_{total} = \\frac{P}{V_{DD}} = \\frac{6\\,\\text{mW}}{3\\,\\text{V}} = 2\\,\\text{mA}$$', 'Half of it goes through the tail to the input pair: $$I_{SS} = \\frac{2\\,\\text{mA}}{2} = 1\\,\\text{mA}$$', 'The other 1 mA feeds the two cascode branches, $I = 0.5$ mA each, so each bottom NMOS source carries $I_{SS}/2 + I = 1$ mA.'] },
        say: '$I_{SS} = 1$ mA (0.5 mA per input device), and each cascode branch gets 0.5 mA, so each bottom source carries 1 mA.' },
      { t: 15, title: '**Swing budget.** Each output swings half of 2.4 V. The four stacked transistors of the output column (M5, M3, M7, M9) share what is left of $V_{DD}$; the tail is not in this column.', tex: 'V_{ov} = \\frac{V_{DD} - 1.2}{4} = \\frac{3 - 1.2}{4} = 0.45\\,\\mathrm{V}', hl: [FT([560, 150, 330, 520, C.volt])],
        try: {
          parts: [
            pt('How much does EACH output swing (single-ended)?', 1.2, 'V', ['The two outputs move in opposite directions and share the differential swing equally.', '$\\text{swing per output} = \\frac{2.4}{2}$'], ['$$\\frac{2.4\\,\\text{V}}{2}$$']),
          ],
          q: 'Now the overdrives. All transistors in the output column get the same overdrive. What overdrive $V_{ov}$ allows the 2.4 V differential swing?', answer: 0.45, unit: 'V', tol: 0.01,
          hint: ['Each output swings half of the differential swing. The output column holds four transistors (two NMOS below, two PMOS above); they share whatever $V_{DD}$ leaves after the swing.', '$4V_{ov} = V_{DD} - \\text{swing per output}$'],
          how: ['Two outputs move in opposite directions, so each takes half: $$\\frac{2.4}{2} = 1.2\\,\\text{V}$$', 'The rest of $V_{DD}$ goes to the four overdrives in the column (M5, M3 below the output, M7, M9 above): $$4V_{ov} = 3 - 1.2 = 1.8\\,\\text{V}$$', 'Share it equally: $$V_{ov} = \\frac{1.8}{4} = 0.45\\,\\text{V}$$'],
          why: 'Folding takes the input pair and the tail out of the output column: four blocks, not five.' },
        say: 'Four blocks in each output column (tail is not in it — folding!): $V_{ov} = (3 - 1.2)/4 = 0.45$ V.' },
      { t: 23, title: '**Gain by two looks**: up into the PMOS cascode, down into the NMOS cascode whose source sees two $r_O$ at the fold node ($r_{O1}\\parallel r_{O5}$). Every device at 0.45 V overdrive (the input pair too, as in the key); 0.5 mA in branches and inputs, 1 mA in M5, M6.', tex: `\\begin{aligned} &g_m = \\tfrac{2(0.5\\,\\mathrm{m})}{0.45} = ${mS(NUM.t23.gm)}\\,\\mathrm{mS} \\\\ &R_{up} = g_{m7}r_{O7}r_{O9} = ${mS(NUM.t23.gm)}\\,\\mathrm{m}\\,(${kO(NUM.t23.roP)}\\,\\mathrm{k})^2 = ${kO(NUM.t23.rup)}\\,\\mathrm{k\\Omega} \\\\ &R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O5}) = ${mS(NUM.t23.gm)}\\,\\mathrm{m}\\times${kO(NUM.t23.roN)}\\,\\mathrm{k}\\times${kO(par(NUM.t23.roP, NUM.t23.ro5))}\\,\\mathrm{k} = ${kO(NUM.t23.rdown)}\\,\\mathrm{k\\Omega} \\\\ &A_v = g_{m1}(R_{up}\\parallel R_{down}) \\approx ${fx(ans('bank-t2q3', 'av'), 3)} \\end{aligned}`, hl: [FT([560, 260, 330, 200, C.n])],
        try: {
          parts: [
            pt('$g_m$ of every device (0.5 mA, $V_{ov} = 0.45$ V; the input pair has the same current and overdrive)?', NUM.t23.gm, 'S', ['Fastest form of $g_m$: current and overdrive.', '$g_m = \\frac{2I_D}{V_{ov}}$'], ['$$g_m = \\frac{2(0.5\\,\\text{m})}{0.45}$$']),
            pt('$r_{O3}$ of the NMOS cascode (0.5 mA, $\\lambda_n = 0.1$ V⁻¹)?', NUM.t23.roN, 'Ω', ['Output resistance from channel-length modulation.', '$r_O = \\frac{1}{\\lambda I_D}$'], ['$$r_{O3} = \\frac{1}{0.1\\times0.5\\,\\text{m}}$$']),
            pt('$r_O$ of each PMOS carrying 0.5 mA (M1, M7, M9; $\\lambda_p = 0.2$ V⁻¹)?', NUM.t23.roP, 'Ω', ['Same formula with the PMOS λ.', '$r_O = \\frac{1}{\\lambda_p I_D}$'], ['$$r_{OP} = \\frac{1}{0.2\\times0.5\\,\\text{m}}$$']),
            pt('$r_{O5}$ of the bottom NMOS source (it carries 1 mA)?', NUM.t23.ro5, 'Ω', ['KCL at the fold node: M5 carries the input device’s 0.5 mA plus the branch’s 0.5 mA.', '$r_{O5} = \\frac{1}{\\lambda_n I_{D5}}$'], ['$$r_{O5} = \\frac{1}{0.1\\times1\\,\\text{m}}$$']),
            pt('Look up from the output: $R_{up}$ of the PMOS cascode M7 on M9?', NUM.t23.rup, 'Ω', ['Looking into a cascode’s drain: its $g_mr_O$ multiplies the $r_O$ under its source.', '$R_{up} = g_{m7}r_{O7}r_{O9}$'], [`$$R_{up} = ${mS(NUM.t23.gm)}\\,\\text{mS}\\times${kO(NUM.t23.roP)}\\,\\text{k}\\times${kO(NUM.t23.roP)}\\,\\text{k}$$`]),
            pt('Look down: $R_{down}$ of the NMOS cascode M3, whose source sits on the fold node X?', NUM.t23.rdown, 'Ω', ['At X two resistances hang in parallel: $r_{O1}$ (the input PMOS’s drain) and $r_{O5}$ (the bottom source).', '$R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O5})$'], [`$$r_{O1}\\parallel r_{O5} = ${kO(par(NUM.t23.roP, NUM.t23.ro5))}\\,\\text{k}\\Omega,\\;\\; R_{down} = ${mS(NUM.t23.gm)}\\,\\text{mS}\\times${kO(NUM.t23.roN)}\\,\\text{k}\\times${kO(par(NUM.t23.roP, NUM.t23.ro5))}\\,\\text{k}$$`]),
          ],
          q: 'Find the open-loop gain $A_v$ with $G_m = g_{m1}$. From the steps above: 0.5 mA in each input device and each cascode branch, 1 mA in each bottom source M5, M6; every overdrive (input pair included) 0.45 V.', answer: ans('bank-t2q3', 'av'), unit: 'V/V', tol: 0.03,
          hint: ['Gain by two looks from the output. Up: the PMOS cascode M7 on the source M9. Down: the NMOS cascode M3, whose source sees two $r_O$ at the fold node. Each look is a cascode: $g_mr_O$ times what sits under its source.', '$A_v = g_{m1}(R_{up}\\parallel R_{down})$, $R_{up} = g_{m7}r_{O7}r_{O9}$, $R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O5})$'],
          how: [`Transconductance, the same for every device (0.5 mA at 0.45 V): $$g_m = \\frac{2I_D}{V_{ov}} = \\frac{2(0.5\\,\\text{m})}{0.45} = ${mS(NUM.t23.gm)}\\,\\text{mS}$$`, `Output resistances, $r_O = 1/(\\lambda I_D)$: $$r_{O3} = \\frac{1}{0.1\\times0.5\\,\\text{m}} = ${kO(NUM.t23.roN)}\\,\\text{k}\\Omega,\\;\\; r_{O1} = r_{O7} = r_{O9} = \\frac{1}{0.2\\times0.5\\,\\text{m}} = ${kO(NUM.t23.roP)}\\,\\text{k}\\Omega,\\;\\; r_{O5} = \\frac{1}{0.1\\times1\\,\\text{m}} = ${kO(NUM.t23.ro5)}\\,\\text{k}\\Omega$$`, `Look up (PMOS cascode M7 on M9): $$R_{up} = g_{m7}r_{O7}r_{O9} = ${mS(NUM.t23.gm)}\\,\\text{m}\\times${kO(NUM.t23.roP)}\\,\\text{k}\\times${kO(NUM.t23.roP)}\\,\\text{k} = ${kO(NUM.t23.rup)}\\,\\text{k}\\Omega$$`, `Look down (M3, two $r_O$ in parallel at the fold): $$R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O5}) = ${mS(NUM.t23.gm)}\\,\\text{m}\\times${kO(NUM.t23.roN)}\\,\\text{k}\\times${kO(par(NUM.t23.roP, NUM.t23.ro5))}\\,\\text{k} = ${kO(NUM.t23.rdown)}\\,\\text{k}\\Omega$$`, `$$A_v = g_{m1}(R_{up}\\parallel R_{down}) = ${mS(NUM.t23.gm)}\\,\\text{mS}\\times${kO(par(NUM.t23.rup, NUM.t23.rdown))}\\,\\text{k}\\Omega = ${fx(ans('bank-t2q3', 'av'), 3)}$$`],
          why: 'In a folded cascode the look down is weaker than in a telescopic: the fold node carries two $r_O$ in parallel (the input device and the bottom source).',
          calc: [{ what: 'Store g_m, then both looks, parallel, times g_m', keys: '2 × 0.5m ÷ 0.45 [VARIABLE] ▸ A ▸ Store; then [SHIFT][4] × ( ( [SHIFT][4] × 10k × 10k ) [SHIFT][^] + ( [SHIFT][4] × 20k × 5k ) [SHIFT][^] ) [SHIFT][^] [EXE]', shows: fx(ans('bank-t2q3', 'av'), 4), note: '[SHIFT][4] recalls A\\; [SHIFT][^] is x⁻¹. ' + PFX }] },
        say: 'Two looks: PMOS cascode up, NMOS cascode with two $r_O$ at the fold node down. About 247.' },
      { t: 31, title: '**Input CM floor.** M1’s drain is the fold node, one $V_{ov5}$ above ground; the PMOS fence lets M1’s gate sit $|V_{thp}|$ lower.', tex: stepTex('bank-t2q3', 3), hl: [FT([200, 280, 440, 270, C.p])],
        try: { q: 'Can the input common-mode level go down to 0 V? Find the lowest input CM level (from the swing step, every column overdrive is $V_{ov} = 0.45$ V).', answer: -0.35, unit: 'V', tol: 0.02,
          hint: ['M1 (PMOS) has its drain on the fold node, which sits one overdrive of M5 above ground. The PMOS fence lets its gate go $|V_{thp}|$ below its drain.', '$V_{in,CM,min} = V_{ov5} - |V_{thp}|$'],
          how: ['From the swing step, M5’s overdrive is 0.45 V, so the fold node can sit at $$V_X = V_{ov5} = 0.45\\,\\text{V}$$', 'PMOS fence on M1, gate as low as possible: $$V_{in,CM,min} = V_X - |V_{thp}| = 0.45 - 0.8 = -0.35\\,\\text{V}$$', 'That is below 0 V, so yes: the input CM can sit at ground.'] },
        say: '$0.45 - 0.8 = -0.35$ V < 0: yes, the input CM can go to 0 V (and below).' },
      { t: 39, ans: true, title: '**Answers:** $I_{SS} = 1$ mA, branches 0.5 mA · $V_{ov} = 0.45$ V · $A_v ≈ 247$ · CM floor −0.35 V, so 0 V is fine', say: 'Exactly your page’s point: the PMOS-input folded cascode accepts inputs at ground.' },
    ],
  });
}, { q: 'Tutorial 2 Q3' });

scene(CQ, 'Problem Set 1 P6: a full folded-cascode design', 74, (S) => {
  pyqFrame(S, {
    tag: 'LEC 6 · QUESTION 3 OF 9', title: 'Currents, overdrives, sizes, gain, ω_u', src: 'Problem Set 1 P6',
    q: 'PMOS-input folded cascode, $V_{DD} = 3$ V, $L = 0.5$ µm, $C_L = 2$ pF, differential swing 2.0 V, power 4.5 mW. (a) $I_{SS}$ and the branch current I. (b) Overdrives and W/L of M3–M10. (c) With $|V_{ov1,2}| = 0.3$ V, $(W/L)_{1,2}$. (d) Gain. (e) $\\omega_u$.', giv: SETA + '. Assume half the supply current goes to the input pair and equal overdrives in the output column.', qh: 250,
    tests: 'the folded-cascode bookkeeping: bottom sources carry $I_{SS}/2 + I$; four blocks share the headroom; square law for sizes; $\\omega_u = g_m/C_L$.',
    fig: foldFig, currents: FOLD_CUR,
    steps: [
      { t: 6, title: '(a) **Currents from the power.** 4.5 mW from 3 V is 1.5 mA: half to the pair, half to the two cascode branches. **KCL at the fold**: each bottom source carries $I_{SS}/2 + I$.', tex: 'I_{SS} = \\frac{1}{2}\\cdot\\frac{4.5\\,\\mathrm{mW}}{3\\,\\mathrm{V}} = 0.75\\,\\mathrm{mA},\\quad I = 0.375\\,\\mathrm{mA},\\quad I_{D5,6} = 0.375 + 0.375 = 0.75\\,\\mathrm{mA}',
        try: {
          parts: [
            pt('Total current drawn from the supply?', 1.5e-3, 'A', ['Power = supply voltage × current.', '$I_{total} = P/V_{DD}$'], ['$$I_{total} = \\frac{4.5\\,\\text{mW}}{3\\,\\text{V}}$$']),
          ],
          q: '(a) What is the tail current $I_{SS}$?', answer: 0.75e-3, unit: 'A', tol: 0.01,
          hint: ['Power divided by the supply gives the total current; the question card says half of it goes to the input pair.', '$I_{SS} = \\frac{1}{2}\\cdot\\frac{P}{V_{DD}}$'],
          how: ['Total supply current: $$I_{total} = \\frac{P}{V_{DD}} = \\frac{4.5\\,\\text{mW}}{3\\,\\text{V}} = 1.5\\,\\text{mA}$$', 'Half goes to the input pair: $$I_{SS} = \\frac{1.5\\,\\text{mA}}{2} = 0.75\\,\\text{mA}$$', 'The other half feeds the two cascode branches: $I = 0.375$ mA each. KCL at the fold: each bottom source carries $I_{SS}/2 + I = 0.75$ mA.'] },
        say: '$I_{SS} = 0.75$ mA, branch current $I = 0.375$ mA, bottom sources $0.375 + 0.375 = 0.75$ mA.' },
      { t: 14, title: '(b) **Swing budget.** Each output swings 1 V; the four overdrives of the output column share the other 2 V.', tex: 'V_{ov} = \\frac{V_{DD} - 1}{4} = \\frac{3 - 1}{4} = 0.5\\,\\mathrm{V}',
        try: {
          parts: [
            pt('How much does EACH output swing (single-ended)?', 1, 'V', ['The two outputs share the differential swing equally.', '$\\text{swing per output} = \\frac{2.0}{2}$'], ['$$\\frac{2.0\\,\\text{V}}{2}$$']),
          ],
          q: '(b) All of M3–M10 get the same overdrive. What $V_{ov}$ gives the 2.0 V differential swing?', answer: 0.5, unit: 'V', tol: 0.01,
          hint: ['Each output swings half of 2.0 V. The output column has four transistors (M5, M3 below the output; M7, M9 above); they share what $V_{DD}$ leaves.', '$4V_{ov} = V_{DD} - \\text{swing per output}$'],
          how: ['Each output takes half the differential swing: $$\\frac{2.0}{2} = 1\\,\\text{V}$$', 'Four overdrives share the rest of $V_{DD}$: $$4V_{ov} = 3 - 1 = 2\\,\\text{V}$$', '$$V_{ov} = \\frac{2}{4} = 0.5\\,\\text{V}$$'] },
        say: '$V_{ov} = 0.5$ V for M3–M10.' },
      { t: 22, title: '**Sizes by the square law**, one device type at a time, each with its own current: NMOS cascodes carry I, the bottom NMOS carry 0.75 mA, the PMOS carry I with $\\mu_pC_{ox}$.', tex: '\\left(\\tfrac{W}{L}\\right)_{3,4} = \\frac{2I}{\\mu_nC_{ox}V_{ov}^2} = \\frac{2(0.375\\,\\mathrm{m})}{134.28\\,\\mu\\,(0.5)^2} = 22.3,\\quad \\left(\\tfrac{W}{L}\\right)_{5,6} = 44.7,\\quad \\left(\\tfrac{W}{L}\\right)_{7-10} = 78.2',
        try: { q: 'Size the NMOS cascodes M3 and M4. From (a): $I_{SS} = 0.75$ mA, branch current $I = 0.375$ mA; from (b): $V_{ov} = 0.5$ V. Which current do M3, M4 carry, and what is $(W/L)_{3,4}$?', answer: ans('bank-ps1p6', 'wl3'), unit: '', tol: 0.02,
          hint: ['M3 and M4 sit in the cascode branches, so they carry the branch current I from part (a), not the 0.75 mA of the bottom sources. Use the square law turned round.', '$\\frac WL = \\frac{2I_D}{\\mu_nC_{ox}V_{ov}^2}$'],
          how: ['From (a), the cascodes carry the branch current: $$I_D = I = 0.375\\,\\text{mA}$$', 'From (b), $V_{ov} = 0.5$ V. Square law solved for the size: $$\\left(\\frac WL\\right)_{3,4} = \\frac{2I_D}{\\mu_nC_{ox}V_{ov}^2} = \\frac{2(0.375\\,\\text{m})}{134.28\\,\\mu\\times0.5^2} = 22.3$$', 'Same formula for the rest: M5, M6 carry 0.75 mA → 44.7; the PMOS M7–M10 carry 0.375 mA with $\\mu_pC_{ox}$ → 78.2.'],
          calc: [{ what: '(W/L) in one line', keys: '2 × 0.375m ÷ ( 134.28µ × 0.5 [x²] ) [EXE]', shows: '22.34', note: PFX }] },
        say: '$(W/L)_{3,4} = 22.3$; the bottom NMOS (twice the current) 44.7; the PMOS (I, lower mobility) 78.2.' },
      { t: 30, title: '(c) **Input pair**: each carries $I_{SS}/2 = 0.375$ mA at the chosen $|V_{ov}| = 0.3$ V (PMOS, so $\\mu_pC_{ox}$).', tex: '\\left(\\tfrac{W}{L}\\right)_{1,2} = \\frac{2(0.375\\,\\mathrm{m})}{38.36\\,\\mu\\,(0.3)^2} = 217',
        try: {
          parts: [
            pt('Drain current of each input device M1, M2?', 0.375e-3, 'A', ['The tail current from (a) splits equally between the two input devices.', '$I_{D1} = I_{SS}/2$'], ['$$I_{D1} = \\frac{0.75\\,\\text{mA}}{2}$$']),
          ],
          q: '(c) The input pair M1, M2 is PMOS and runs at the chosen $|V_{ov1,2}| = 0.3$ V. Using $I_{SS}$ from (a) and $\\mu_pC_{ox} = 38.36\\,\\mu$A/V² (Set A), find $(W/L)_{1,2}$.', answer: 2 * 0.375e-3 / (38.36e-6 * 0.09), unit: '', tol: 0.02,
          hint: ['Each input device carries half the tail current. It is a PMOS, so the square law uses $\\mu_pC_{ox}$, not $\\mu_nC_{ox}$.', '$\\left(\\frac WL\\right)_{1,2} = \\frac{2I_{D1}}{\\mu_pC_{ox}|V_{ov1}|^2}$'],
          how: ['Each input device carries half of $I_{SS} = 0.75$ mA: $$I_{D1} = 0.375\\,\\text{mA}$$', 'M1 is a PMOS, so use $\\mu_pC_{ox}$ in the square law solved for the size: $$\\left(\\frac WL\\right)_{1,2} = \\frac{2I_{D1}}{\\mu_pC_{ox}|V_{ov1}|^2} = \\frac{2(0.375\\,\\text{m})}{38.36\\,\\mu\\times0.3^2} = 217$$'],
          why: 'A small input overdrive (0.3 V) buys a large $g_{m1}$, but the low PMOS mobility makes the pair wide.',
          calc: [{ what: '(W/L)₁,₂ in one line', keys: '2 × 0.375m ÷ ( 38.36µ × 0.3 [x²] ) [EXE]', shows: '217.2', note: PFX }] },
        say: '$(W/L)_{1,2} = 2(0.375\\,\\text{m})/(38.36\\,\\mu\\times0.09) = 217$.' },
      { t: 37, title: '(d) **Gain by two looks**: up into the PMOS cascode M7 on M9; down into the NMOS cascode M3, whose source sees $r_{O1}\\parallel r_{O5}$ at the fold node.', tex: `\\begin{aligned} &g_{m1} = ${mS(NUM.p6.gm1)}\\,\\mathrm{mS},\\quad g_{m3} = g_{m7} = ${mS(NUM.p6.gm3)}\\,\\mathrm{mS} \\\\ &r_{O3} = ${kO(NUM.p6.ro3)}\\,\\mathrm{k\\Omega},\\quad r_{O1} = r_{O5} = r_{O7} = r_{O9} = ${kO(NUM.p6.roP)}\\,\\mathrm{k\\Omega} \\\\ &R_{up} = g_{m7}r_{O7}r_{O9} = ${kO(NUM.p6.rup)}\\,\\mathrm{k\\Omega} \\\\ &R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O5}) = ${kO(NUM.p6.rdown)}\\,\\mathrm{k\\Omega} \\\\ &A_v = g_{m1}(R_{up}\\parallel R_{down}) = ${mS(NUM.p6.gm1)}\\,\\mathrm{mS}\\times${kO(NUM.p6.rpar)}\\,\\mathrm{k\\Omega} = ${fx(ans('bank-ps1p6', 'av'), 3)} \\end{aligned}`,
        try: {
          parts: [
            pt('$g_{m1}$ of the input transistor (0.375 mA, $|V_{ov1}| = 0.3$ V)?', NUM.p6.gm1, 'S', ['Fastest form of $g_m$: current and overdrive.', '$g_m = \\frac{2I_D}{|V_{ov}|}$'], ['$$g_{m1} = \\frac{2(0.375\\,\\text{m})}{0.3}$$']),
            pt('$g_{m3}$ of the NMOS cascode (0.375 mA, $V_{ov} = 0.5$ V)? (The PMOS cascode M7 has the same current and overdrive, so $g_{m7} = g_{m3}$.)', NUM.p6.gm3, 'S', ['Same formula, the cascode’s own current and overdrive.', '$g_{m3} = \\frac{2I_D}{V_{ov}}$'], ['$$g_{m3} = \\frac{2(0.375\\,\\text{m})}{0.5}$$']),
            pt('$r_{O3}$ of the NMOS cascode (0.375 mA, $\\lambda_n = 0.1$ V⁻¹)?', NUM.p6.ro3, 'Ω', ['Output resistance from the channel-length modulation.', '$r_O = \\frac{1}{\\lambda I_D}$'], ['$$r_{O3} = \\frac{1}{0.1\\times0.375\\,\\text{m}}$$']),
            pt('$r_O$ of each PMOS carrying 0.375 mA (M1, M7, M9; $\\lambda_p = 0.2$ V⁻¹)?', NUM.p6.roP, 'Ω', ['Same formula with the PMOS λ.', '$r_O = \\frac{1}{\\lambda_p I_D}$'], ['Same value for M1, M7 and M9: $$r_{OP} = \\frac{1}{0.2\\times0.375\\,\\text{m}}$$']),
            pt('$r_{O5}$ of the bottom NMOS source (it carries 0.75 mA)?', NUM.p6.ro5, 'Ω', ['KCL at the fold: M5 carries $I_{SS}/2 + I = 0.75$ mA.', '$r_{O5} = \\frac{1}{\\lambda_n I_{D5}}$'], ['$$r_{O5} = \\frac{1}{0.1\\times0.75\\,\\text{m}}$$']),
            pt('Look up from the output: $R_{up}$ of the PMOS cascode M7 on M9?', NUM.p6.rup, 'Ω', ['Into a drain with a resistance under the source: the cascode multiplies it by $g_mr_O$.', '$R_{up} = g_{m7}r_{O7}r_{O9}$'], [`$$R_{up} = ${mS(NUM.p6.gm3)}\\,\\text{mS}\\times${kO(NUM.p6.roP)}\\,\\text{k}\\times${kO(NUM.p6.roP)}\\,\\text{k}$$`]),
            pt('Look down: $R_{down}$ of the NMOS cascode M3, whose source sees the fold node?', NUM.p6.rdown, 'Ω', ['Under M3’s source hang two $r_O$: of M1 and of M5, in parallel.', '$R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O5})$'], [`$$r_{O1}\\parallel r_{O5} = ${kO(NUM.p6.rx)}\\,\\text{k}\\Omega,\\;; R_{down} = ${mS(NUM.p6.gm3)}\\,\\text{mS}\\times${kO(NUM.p6.ro3)}\\,\\text{k}\\times${kO(NUM.p6.rx)}\\,\\text{k}$$`]),
          ],
          q: '(d) Find the open-loop gain $A_v$, taking $G_m = g_{m1}$. From (a)–(c): input devices and cascode branches carry 0.375 mA, the bottom sources M5, M6 carry 0.75 mA; $V_{ov} = 0.5$ V for M3–M10, $|V_{ov1}| = 0.3$ V.', answer: ans('bank-ps1p6', 'av'), unit: 'V/V', tol: 0.03,
          hint: ['Gain by two looks from the output. Up: a PMOS cascode (M7 on M9). Down: the NMOS cascode M3, whose source sees two $r_O$ at the fold node ($r_{O1}$ and $r_{O5}$). Get each $g_m$ from $2I_D/V_{ov}$ and each $r_O$ from $1/(\\lambda I_D)$.', '$A_v = g_{m1}(R_{up}\\parallel R_{down})$, $R_{up} = g_{m7}r_{O7}r_{O9}$, $R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O5})$'],
          how: ['Transconductances, $g_m = 2I_D/V_{ov}$ (currents from (a), overdrives from (b), (c)): $$g_{m1} = \\frac{2(0.375\\,\\text{m})}{0.3} = 2.5\\,\\text{mS},\\;\\; g_{m3} = g_{m7} = \\frac{2(0.375\\,\\text{m})}{0.5} = 1.5\\,\\text{mS}$$', 'Output resistances, $r_O = 1/(\\lambda I_D)$: $$r_{O3} = \\frac{1}{0.1\\times0.375\\,\\text{m}} = 26.7\\,\\text{k}\\Omega,\\;\\; r_{O1} = r_{O7} = r_{O9} = \\frac{1}{0.2\\times0.375\\,\\text{m}} = 13.3\\,\\text{k}\\Omega,\\;\\; r_{O5} = \\frac{1}{0.1\\times0.75\\,\\text{m}} = 13.3\\,\\text{k}\\Omega$$', 'Look up: $$R_{up} = g_{m7}r_{O7}r_{O9} = 1.5\\,\\text{m}\\times13.3\\,\\text{k}\\times13.3\\,\\text{k} = 267\\,\\text{k}\\Omega$$', 'Look down (two $r_O$ at the fold): $$R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O5}) = 1.5\\,\\text{m}\\times26.7\\,\\text{k}\\times6.67\\,\\text{k} = 267\\,\\text{k}\\Omega$$', '$$A_v = g_{m1}(R_{up}\\parallel R_{down}) = 2.5\\,\\text{mS}\\times133\\,\\text{k}\\Omega = 333$$'],
          calc: [{ what: 'Store g_m1, then the parallel and the product', keys: '2.5m [VARIABLE] ▸ A ▸ Store, then [SHIFT][4] × ( 267k [SHIFT][^] + 267k [SHIFT][^] ) [SHIFT][^] [EXE]', shows: '333', note: '[SHIFT][^] is x⁻¹: (a⁻¹ + b⁻¹)⁻¹ is the parallel. Use exact 266.67k for 333.3.' }] },
        say: '$A_v ≈ 333$ (with $G_m = g_{m1}$; P7 corrects this).' },
      { t: 45, title: '(e) **One dominant pole at the output**: the unity-gain frequency is the input $g_m$ over the load capacitance.', tex: '\\omega_u = \\frac{g_{m1}}{C_L} = \\frac{2.5\\,\\mathrm{mS}}{2\\,\\mathrm{pF}} = 1.25\\,\\mathrm{Grad/s}',
        try: { q: '(e) Find the unity-gain bandwidth $\\omega_u$ with $C_L = 2$ pF (each input device carries 0.375 mA at $|V_{ov1}| = 0.3$ V).', answer: ans('bank-ps1p6', 'wu'), unit: 'rad/s', tol: 0.02,
          hint: ['A one-stage op amp has one dominant pole at the output, so the gain–bandwidth product is the input transconductance divided by the load capacitance.', '$\\omega_u = g_{m1}/C_L$'],
          how: ['$g_{m1}$ from part (d): $$g_{m1} = \\frac{2I_{D1}}{|V_{ov1}|} = \\frac{2(0.375\\,\\text{m})}{0.3} = 2.5\\,\\text{mS}$$', 'Divide by the load: $$\\omega_u = \\frac{g_{m1}}{C_L} = \\frac{2.5\\,\\text{mS}}{2\\,\\text{pF}} = 1.25\\times10^9\\,\\text{rad/s}$$', 'In hertz: $1.25\\,\\text{G}/2\\pi ≈ 199$ MHz.'] },
        say: '$\\omega_u = 2.5\\,\\text{mS}/2\\,\\text{pF} = 1.25$ Grad/s.' },
      { t: 53, ans: true, title: `**Answers:** $I_{SS} = 0.75$ mA, I = 0.375 mA · $V_{ov} = 0.5$ V · W/L: 22.3, 44.7, 78.2, 217 · $A_v ≈ 333$ · $\\omega_u$ = 1.25 Grad/s`, say: 'Same order every time: power → currents, swing → overdrives, square law → sizes, then gain and speed.' },
    ],
  });
}, { q: 'Problem Set 1 P6' });

scene(CQ, 'Problem Set 1 P7: how much of M1’s current reaches the output?', 46, (S) => {
  pyqFrame(S, {
    tag: 'LEC 6 · QUESTION 4 OF 9', title: 'The current divider at the fold node', src: 'Problem Set 1 P7',
    q: 'In P6 you assumed $G_m = g_{m1}$. In reality M1’s signal current splits at the fold node: some goes up into M3, some is lost to AC ground. What fraction reaches the output, and what is the corrected gain?',
    giv: 'From P6: input devices and cascode branches carry 0.375 mA, the bottom sources M5, M6 carry 0.75 mA; $V_{ov3} = 0.5$ V; $\\lambda_n = 0.1$ V⁻¹, $\\lambda_p = 0.2$ V⁻¹; $A_v = 333$ (with $G_m = g_{m1}$)', qh: 230,
    tests: 'the current divider of the foundations — the reason $G_m ≈ g_{m1}$ — with real numbers.',
    fig: foldFig, currents: FOLD_CUR,
    steps: [
      { t: 6, title: '**Current divider at the fold node X.** Up into M3’s source the resistance is small ($\\approx 1/g_{m3}$); down it is $r_{O1}\\parallel r_{O5}$. The current prefers the small one.', tex: '\\text{fraction} = \\frac{r_{O1}\\parallel r_{O5}}{(\\tfrac{1}{g_{m3}}\\parallel r_{O3}) + (r_{O1}\\parallel r_{O5})} = \\frac{6.67\\,\\mathrm{k}}{0.650\\,\\mathrm{k} + 6.67\\,\\mathrm{k}} = 0.911', hl: [FT([560, 400, 330, 180, C.amb])],
        try: {
          parts: [
            pt('$g_{m3}$ of the NMOS cascode M3 (0.375 mA, $V_{ov3} = 0.5$ V)?', NUM.p6.gm3, 'S', ['Fastest form of $g_m$: current and overdrive.', '$g_m = \\frac{2I_D}{V_{ov}}$'], ['$$g_{m3} = \\frac{2(0.375\\,\\text{m})}{0.5}$$']),
            pt('$r_{O3}$ of M3 (NMOS, 0.375 mA)?', NUM.p6.ro3, 'Ω', ['Output resistance from channel-length modulation, NMOS λ.', '$r_O = \\frac{1}{\\lambda_n I_D}$'], ['$$r_{O3} = \\frac{1}{0.1\\times0.375\\,\\text{m}}$$']),
            pt('$r_{O1}$ of the input device M1 (PMOS, 0.375 mA)?', NUM.p6.roP, 'Ω', ['M1 is a PMOS: use $\\lambda_p$.', '$r_{O1} = \\frac{1}{\\lambda_p I_{D1}}$'], ['$$r_{O1} = \\frac{1}{0.2\\times0.375\\,\\text{m}}$$']),
            pt('$r_{O5}$ of the bottom source M5 (NMOS, 0.75 mA)?', NUM.p6.ro5, 'Ω', ['M5 carries the input device’s current plus the branch current (KCL at the fold).', '$r_{O5} = \\frac{1}{\\lambda_n I_{D5}}$'], ['$$r_{O5} = \\frac{1}{0.1\\times0.75\\,\\text{m}}$$']),
            pt('Resistance looking up into M3’s source: $\\frac{1}{g_{m3}}\\parallel r_{O3}$?', NUM.p6.rs, 'Ω', ['$1/g_{m3}$ in parallel with $r_{O3}$ (both from the steps above).', '$\\frac{1}{g_{m3}}\\parallel r_{O3} = \\frac{(1/g_{m3})\\,r_{O3}}{1/g_{m3} + r_{O3}}$'], [`$$\\frac{1}{1.5\\,\\text{mS}} = 667\\,\\Omega,\\;; 667\\,\\Omega\\parallel${kO(NUM.p6.ro3)}\\,\\text{k}\\Omega$$`]),
            pt('Resistance from the fold node down to AC ground: $r_{O1}\\parallel r_{O5}$?', NUM.p6.rx, 'Ω', ['Two equal resistors in parallel give half of one.', '$r_{O1}\\parallel r_{O5}$'], [`$$${kO(NUM.p6.roP)}\\,\\text{k}\\parallel${kO(NUM.p6.ro5)}\\,\\text{k}$$`]),
          ],
          q: 'What fraction of M1’s small-signal current goes up through M3 to the output?', answer: ans('bank-ps1p7', 'frac'), unit: '', tol: 0.02,
          hint: ['Two paths leave the fold node: up into M3’s source ($\\frac{1}{g_{m3}}\\parallel r_{O3}$) and down through $r_{O1}\\parallel r_{O5}$. In a current divider, each path’s share is set by the OTHER path’s resistance.', '$\\text{fraction} = \\frac{r_{O1}\\parallel r_{O5}}{(\\frac{1}{g_{m3}}\\parallel r_{O3}) + (r_{O1}\\parallel r_{O5})}$'],
          how: ['Device values from the P6 currents: $$g_{m3} = \\frac{2(0.375\\,\\text{m})}{0.5} = 1.5\\,\\text{mS},\\quad r_{O3} = \\frac{1}{0.1\\times0.375\\,\\text{m}} = 26.7\\,\\text{k}\\Omega,\\quad r_{O1} = \\frac{1}{0.2\\times0.375\\,\\text{m}} = 13.3\\,\\text{k}\\Omega,\\quad r_{O5} = \\frac{1}{0.1\\times0.75\\,\\text{m}} = 13.3\\,\\text{k}\\Omega$$', 'Path up, into M3’s source: $$\\frac{1}{g_{m3}}\\parallel r_{O3} = 667\\,\\Omega\\parallel26.7\\,\\text{k}\\Omega = 650\\,\\Omega$$', 'Path down, to AC ground: $$r_{O1}\\parallel r_{O5} = 13.3\\,\\text{k}\\parallel13.3\\,\\text{k} = 6.67\\,\\text{k}\\Omega$$', 'Current divider (the share going up uses the resistance of the path down): $$\\text{fraction} = \\frac{6.67\\,\\text{k}}{0.650\\,\\text{k} + 6.67\\,\\text{k}} = 0.911$$'],
          calc: [{ what: 'Both parallels and the divider in one line', keys: '( 13.3k ÷ 2 ) ÷ ( ( 1.5m + 26.7k [SHIFT][^] ) [SHIFT][^] + 13.3k ÷ 2 ) [EXE]', shows: '0.911', note: '1/g_m ∥ r_O = (g_m + 1/r_O)⁻¹: add conductances, then x⁻¹. ' + PFX }] },
        say: 'About 91 % of M1’s signal current goes up through M3; 9 % is lost into $r_{O1}\\parallel r_{O5}$.' },
      { t: 15, title: '**Scale the gain.** Only that fraction of M1’s current reaches the output, so $G_m$ shrinks by the same factor; the output resistance is unchanged.', tex: 'A_v = 333 \\times 0.911 = 304',
        try: { q: 'P6’s gain of 333 assumed all of M1’s current reaches the output. Using the fraction you just found (0.911), what is the corrected gain?', answer: ans('bank-ps1p7', 'av'), unit: 'V/V', tol: 0.02,
          hint: ['Only the fraction you just found reaches the output, so the effective transconductance is smaller by that factor.', '$A_v = (\\text{fraction}\\cdot g_{m1})(R_{up}\\parallel R_{down})$'],
          how: ['Effective transconductance: $$G_m = 0.911\\,g_{m1}$$', 'The output resistance does not change, so the gain scales by the same factor: $$A_v = 333\\times0.911 = 304$$'],
          why: '$G_m ≈ g_{m1}$ is a good approximation, not exact: the fold node loses a few percent.' },
        say: '$333 \\times 0.911 ≈ 304$.' },
      { t: 22, ans: true, title: '**Answers:** 91 % reaches the output · $A_v ≈ 304$', say: '“$G_m ≈ g_{m1}$” is a good approximation, not exact — the fold node loses a few percent.' },
    ],
  });
}, { q: 'Problem Set 1 P7' });

// names exactly as printed: M3, M4 gates = V_b2, M7, M8 gates = V_b1; M5, M6, M9, M10 and M11 are biased by the mirrors M_b2, M_b3, M_b1
const QZ = { tail: 'M11', in: ['M1', 'M2'], top: ['M5', 'M6'], pc: ['M3', 'M4'], nc: ['M7', 'M8'], bot: ['M9', 'M10'], fold: ['X', 'Y'], bias: { top: 'from M_b2', pc: 'V_b2', nc: 'V_b1', bot: 'from M_b3', tail: 'M_b1' } };
/* branch currents on the Quiz 1 2023 folded cascode (NMOS input, foldN coordinates): each top source supplies I_SS/2 + I,
   I_SS/2 leaves at the fold node into the input device, I continues down the cascode column */
const QZ_CUR = { tf: 'translate(-60 140) scale(0.82)', list: [
  [[[600, 160], [600, 262]], null, { color: C.amb }],
  [[[820, 160], [820, 262]], 'I_SS/2 + I', { color: C.amb, at: [985, 215] }],
  [[[600, 276], [600, 622]], null, { color: C.cur }],
  [[[820, 276], [820, 622]], 'I', { color: C.cur, at: [965, 470] }],
  [[[592, 268], [230, 268], [230, 372]], 'I_SS/2', { color: C.n, at: [470, 305] }],
  [[[812, 268], [700, 268], [700, 240], [370, 240], [370, 372]], null, { color: C.n }],
  [[[230, 470], [230, 490], [300, 490], [300, 582]], 'I_SS', { color: C.n, at: [400, 610] }],
] };
scene(CQ, 'Quiz 1 2023 Q2: NMOS-input folded cascode, all parts', 92, (S) => {
  const T = tfm(0.82, -60, 140);
  pyqFrame(S, {
    paper: 'q23q2', tag: 'LEC 6 · QUESTION 5 OF 9', title: 'CM range, bias limits, swing and gain', src: 'Quiz 1 2023-24 Q2',
    q: 'NMOS-input folded cascode. $V_{b2}$ (PMOS cascode gates) at its maximum, $V_{b1}$ (NMOS cascode gates) at its minimum. Find $V_{in,CM}$ min and max, $V_{b1,min}$, $V_{b2,max}$, the maximum differential swing and the gain. Then with $V_{b2}$ 0.1 V lower and $V_{b1}$ 0.1 V higher: $V_{in,CM,max}$ and swing.', giv: 'All devices: $|V_{ov}| = 0.15$ V, $r_O = 50$ kΩ, $g_m = 1$ mS, $|V_{th}| = 0.3$ V; $V_{DD} = 3$ V', qh: 270,
    tests: 'your page’s NMOS-input folded cascode: tail check + link for the floor, fold node + $V_{th}$ for the ceiling, links for the bias limits, fences for the swing, two looks for the gain.',
    currents: QZ_CUR,
    fig: (S2) => { const g = foldN(S2, QZ); g.setAttribute('transform', 'translate(-60 140) scale(0.82)'); },
    steps: [
      { t: 7, title: '**Input floor.** Walk up from ground: the tail M11 needs one $V_{ov}$ (a check), then M1’s gate sits one $V_{GS} = V_{th} + V_{ov}$ higher (a link).', tex: 'V_{in,CM,min} = V_{ov11} + V_{GS1} = 0.15 + (0.3 + 0.15) = 0.6\\,\\mathrm{V}', hl: [T([180, 370, 180, 260, C.n])],
        try: {
          parts: [
            pt('$V_{GS}$ of every NMOS ($V_{th} = 0.3$ V, $V_{ov} = 0.15$ V)?', 0.45, 'V', ['Gate–source voltage = threshold + overdrive.', '$V_{GS} = V_{th} + V_{ov}$'], ['$$V_{GS} = 0.3 + 0.15$$']),
          ],
          q: 'Lowest input common-mode level?', answer: 0.6, unit: 'V', tol: 0.01,
          hint: ['Walk up from ground: the tail M11 needs its overdrive (a check), then M1’s gate is one $V_{GS1}$ above M1’s source (a link).', '$V_{in,CM,min} = V_{ov11} + V_{GS1}$, $V_{GS1} = V_{th} + V_{ov}$'],
          how: ['M1’s gate–source voltage: $$V_{GS1} = V_{th} + V_{ov} = 0.3 + 0.15 = 0.45\\,\\text{V}$$', 'The tail M11 at its edge puts M1’s source at $$V_P = V_{ov11} = 0.15\\,\\text{V}$$', 'Add the link: $$V_{in,CM,min} = V_P + V_{GS1} = 0.15 + 0.45 = 0.6\\,\\text{V}$$'] },
        say: '$0.15 + 0.45 = 0.6$ V.' },
      { t: 15, title: '$V_{b2,max}$: **the top source M5 needs $|V_{ov}|$**, so the fold node can rise to 2.85 V; the fold node is M3’s source, one $|V_{GS3}|$ above its gate $V_{b2}$ (a link).', tex: 'V_{b2,max} = V_{DD} - |V_{ov5}| - |V_{GS3}| = 3 - 0.15 - 0.45 = 2.4\\,\\mathrm{V}', hl: [T([520, 150, 380, 250, C.p])],
        try: {
          parts: [
            pt('How high can the fold node rise before M5 leaves saturation?', 2.85, 'V', ['M5 (PMOS source on $V_{DD}$) needs its overdrive across it.', '$V_X = V_{DD} - |V_{ov5}|$'], ['$$V_X = 3 - 0.15$$']),
          ],
          q: 'How high can $V_{b2}$ go before the top PMOS source M5 leaves saturation?', answer: 2.4, unit: 'V', tol: 0.01,
          hint: ['M5 needs its overdrive below $V_{DD}$; that caps the fold node. The fold node is M3’s source, and M3’s gate ($V_{b2}$) sits one $|V_{GS3}|$ below it.', '$V_{b2,max} = V_{DD} - |V_{ov5}| - |V_{GS3}|$'],
          how: ['M5 at its edge: the fold node can rise to $$V_X = V_{DD} - |V_{ov5}| = 3 - 0.15 = 2.85\\,\\text{V}$$', 'The fold node is M3’s source; M3’s gate sits one $|V_{GS3}| = 0.3 + 0.15 = 0.45$ V lower: $$V_{b2,max} = 2.85 - 0.45 = 2.4\\,\\text{V}$$', 'A higher $V_{b2}$ would push the fold node up and squeeze M5 into triode.'] },
        say: 'Top source check: fold ≤ 2.85 V. The fold node is M3’s source, one link above its gate: $V_{b2} \\le 2.4$ V.' },
      { t: 24, title: '$V_{b1,min}$: **the bottom source M9 needs $V_{ov}$** under M7’s source; M7’s gate $V_{b1}$ is one $V_{GS7}$ higher (a check, then a link).', tex: 'V_{b1,min} = V_{ov9} + V_{GS7} = 0.15 + 0.45 = 0.6\\,\\mathrm{V}', hl: [T([520, 520, 380, 200, C.n])],
        try: { q: 'How low can $V_{b1}$ go before the bottom NMOS source M9 leaves saturation?', answer: 0.6, unit: 'V', tol: 0.01,
          hint: ['M9 needs its overdrive above ground at M7’s source (a check); M7’s gate, $V_{b1}$, is one $V_{GS7}$ higher (a link).', '$V_{b1,min} = V_{ov9} + V_{GS7}$'],
          how: ['M9 at its edge: M7’s source sits at $$V_{S7} = V_{ov9} = 0.15\\,\\text{V}$$', 'M7’s gate is one link higher, $V_{GS7} = 0.3 + 0.15 = 0.45$ V: $$V_{b1,min} = 0.15 + 0.45 = 0.6\\,\\text{V}$$'] },
        say: '$0.15 + 0.45 = 0.6$ V.' },
      { t: 32, title: '**Input ceiling.** M1’s drain is the fold node (2.85 V with $V_{b2}$ at its maximum); the NMOS fence lets M1’s gate rise $V_{th}$ above its drain.', tex: 'V_{in,CM,max} = V_X + V_{th} = 2.85 + 0.3 = 3.15\\,\\mathrm{V}\\;(\\text{capped at } V_{DD} = 3\\,\\mathrm{V})', hl: [T([180, 230, 470, 230, C.n])],
        try: { q: 'Highest input common-mode level (before you cap it at the supply)?', answer: 3.15, unit: 'V', tol: 0.01,
          hint: ['M1 is an NMOS whose drain is the fold node. Its fence lets the gate rise $V_{th}$ above the drain.', '$V_{in,CM,max} = V_X + V_{th}$, with $V_X = V_{DD} - |V_{ov5}|$'],
          how: ['With $V_{b2}$ at its maximum, the fold node (M1’s drain) sits at $$V_X = 3 - 0.15 = 2.85\\,\\text{V}$$', 'NMOS fence on M1, its gate may be $V_{th}$ above its drain: $$V_{in,CM,max} = V_X + V_{th} = 2.85 + 0.3 = 3.15\\,\\text{V}$$', 'That is above $V_{DD}$: in practice the input can go all the way to the 3 V rail.'] },
        say: '$2.85 + 0.3 = 3.15$ V — above $V_{DD}$, exactly your page’s point (in practice capped at 3 V).' },
      { t: 41, title: '**Swing by two fences** per output: floor = M7’s fence $V_{b1} - V_{th}$, ceiling = M3’s fence $V_{b2} + |V_{th}|$. Two outputs: ×2.', tex: '2[(V_{b2} + |V_{th}|) - (V_{b1} - V_{th})] = 2[(2.4 + 0.3) - (0.6 - 0.3)] = 4.8\\,\\mathrm{V}', hl: [T([520, 290, 380, 230, C.volt])],
        try: {
          parts: [
            pt('Lowest voltage of one output (M7’s fence, gate at $V_{b1} = 0.6$ V)?', 0.3, 'V', ['NMOS drain may sit at most $V_{th}$ below its gate.', '$V_{out,min} = V_{b1} - V_{th}$'], ['$$0.6 - 0.3$$']),
            pt('Highest voltage of one output (M3’s fence, gate at $V_{b2} = 2.4$ V)?', 2.7, 'V', ['PMOS drain may sit at most $|V_{th}|$ above its gate.', '$V_{out,max} = V_{b2} + |V_{th}|$'], ['$$2.4 + 0.3$$']),
          ],
          q: 'Maximum differential output swing, with the biases at the limits found above ($V_{b1,min} = 0.6$ V, $V_{b2,max} = 2.4$ V)?', answer: 4.8, unit: 'V', tol: 0.01,
          hint: ['Each output is held between two fences: the NMOS cascode M7 (gate $V_{b1}$) below and the PMOS cascode M3 (gate $V_{b2}$) above. The differential swing is twice one output’s range.', '$V_{b1} - V_{th} \\le V_{out} \\le V_{b2} + |V_{th}|$, swing $= 2(V_{out,max} - V_{out,min})$'],
          how: ['Floor, M7’s fence (gate at $V_{b1,min}$): $$V_{out,min} = V_{b1} - V_{th} = 0.6 - 0.3 = 0.3\\,\\text{V}$$', 'Ceiling, M3’s fence (gate at $V_{b2,max}$): $$V_{out,max} = V_{b2} + |V_{th}| = 2.4 + 0.3 = 2.7\\,\\text{V}$$', 'The two outputs move in opposite directions: $$\\text{swing} = 2(2.7 - 0.3) = 4.8\\,\\text{V}$$'] },
        say: 'Each output runs 0.3–2.7 V; differential $2 \\times 2.4 = 4.8$ V.' },
      { t: 50, title: '**Gain by two looks.** Up: PMOS cascode M3 on the fold node, which carries two $r_O$ (M1 and M5). Down: plain NMOS cascode M7 on M9.', tex: 'A_v = g_m(R_{up}\\parallel R_{down}) = 1\\,\\mathrm{mS}\\,(1.25\\,\\mathrm{M\\Omega}\\parallel 2.5\\,\\mathrm{M\\Omega}) = 833',
        try: {
          parts: [
            pt('Look up from the output: $R_{up}$ (PMOS cascode M3; the fold node under it carries $r_{O1}\\parallel r_{O5}$)?', 50 * par(50e3, 50e3), 'Ω', ['$g_mr_O = 1\\,\\text{mS}\\times50\\,\\text{k}\\Omega = 50$; it multiplies what hangs under M3’s source.', '$R_{up} = g_mr_O(r_O\\parallel r_O)$'], ['$$R_{up} = 50\\times(50\\,\\text{k}\\parallel50\\,\\text{k}) = 50\\times25\\,\\text{k}$$']),
            pt('Look down: $R_{down}$ (NMOS cascode M7 on M9)?', 50 * 50e3, 'Ω', ['A plain cascode: $g_mr_O$ times the $r_O$ under it.', '$R_{down} = g_mr_O\\,r_O$'], ['$$R_{down} = 50\\times50\\,\\text{k}$$']),
          ],
          q: 'Differential gain $A_v$?', answer: ans('pyq-q23-q2', 'av'), unit: 'V/V', tol: 0.02,
          hint: ['Look up from the output: PMOS cascode M3, whose source (the fold node) sees two $r_O$, of M1 and of M5. Look down: an ordinary NMOS cascode M7 on M9.', '$A_v = g_m(R_{up}\\parallel R_{down})$, $R_{up} = g_mr_O(r_O\\parallel r_O)$, $R_{down} = g_mr_Or_O$'],
          how: ['Intrinsic gain of every device: $$g_mr_O = 1\\,\\text{mS}\\times50\\,\\text{k}\\Omega = 50$$', 'Look up (fold node carries $r_{O1}\\parallel r_{O5}$): $$R_{up} = g_mr_O(r_O\\parallel r_O) = 50\\times25\\,\\text{k}\\Omega = 1.25\\,\\text{M}\\Omega$$', 'Look down: $$R_{down} = g_mr_Or_O = 50\\times50\\,\\text{k}\\Omega = 2.5\\,\\text{M}\\Omega$$', '$$A_v = g_m(R_{up}\\parallel R_{down}) = 1\\,\\text{mS}\\times833\\,\\text{k}\\Omega = 833$$'],
          calc: [{ what: 'Parallel and product', keys: '1m × ( 1.25M [SHIFT][^] + 2.5M [SHIFT][^] ) [SHIFT][^] [EXE]', shows: '833.3', note: PFX }] },
        say: '$1\\,\\text{mS} \\times 833\\,\\text{k} ≈ 833$.' },
      { t: 59, title: '**Part 2.** $V_{b2}$ 0.1 V lower lowers the fold node and both ceilings; $V_{b1}$ 0.1 V higher raises the floor.', tex: 'V_{in,CM,max} = (2.85 - 0.1) + 0.3 = 3.05\\,\\mathrm{V},\\quad \\text{swing} = 2[(2.3 + 0.3) - (0.7 - 0.3)] = 4.4\\,\\mathrm{V}',
        try: {
          parts: [
            pt('New highest output ($V_{b2} = 2.3$ V)?', 2.6, 'V', ['M3’s fence with the new gate voltage.', '$V_{out,max} = V_{b2} + |V_{th}|$'], ['$$2.3 + 0.3$$']),
            pt('New lowest output ($V_{b1} = 0.7$ V)?', 0.4, 'V', ['M7’s fence with the new gate voltage.', '$V_{out,min} = V_{b1} - V_{th}$'], ['$$0.7 - 0.3$$']),
          ],
          q: 'Part 2: $V_{b2}$ is 0.1 V below its maximum (2.4 V) and $V_{b1}$ 0.1 V above its minimum (0.6 V). New maximum differential swing?', answer: 4.4, unit: 'V', tol: 0.01,
          hint: ['Same two fences as before, with the new bias values: the floor rises with $V_{b1}$, the ceiling falls with $V_{b2}$.', '$\\text{swing} = 2[(V_{b2} + |V_{th}|) - (V_{b1} - V_{th})]$'],
          how: ['New biases: $$V_{b2} = 2.4 - 0.1 = 2.3\\,\\text{V},\\;\\; V_{b1} = 0.6 + 0.1 = 0.7\\,\\text{V}$$', 'Ceiling and floor of one output: $$V_{out,max} = 2.3 + 0.3 = 2.6\\,\\text{V},\\;\\; V_{out,min} = 0.7 - 0.3 = 0.4\\,\\text{V}$$', '$$\\text{swing} = 2(2.6 - 0.4) = 4.4\\,\\text{V}$$', 'The fold node also drops to 2.75 V, so the CM ceiling falls to 2.75 + 0.3 = 3.05 V.'] },
        say: 'Fold node 2.75 V → CM max 3.05 V; outputs 0.4–2.6 V → swing 4.4 V.' },
      { t: 67, ans: true, title: '**Answers:** CM from 0.6 V to 3.15 V (capped at 3 V) · $V_{b2,max}$ = 2.4 V · $V_{b1,min}$ = 0.6 V · swing 4.8 V · $A_v ≈ 833$ · part 2: CM max 3.05 V, swing 4.4 V', say: 'Every number came from a check, a link, or a fence. Biases at their limits buy the most swing.' },
    ],
  });
}, { q: 'Quiz 1 2023 Q2' });

scene(CQ, 'Razavi Ex 9.5: the telescopic buffer window', 44, (S) => {
  const T = tfm(0.82, -60, 140);
  pyqFrame(S, {
    tag: 'LEC 6 · QUESTION 6 OF 9', title: 'How small is the telescopic window?', src: 'Buffer window (tutoring chat, Razavi Ex 9.5)',
    q: 'A telescopic op amp is used as a unity-gain buffer (output tied to M2’s gate). Find the lowest and highest output, and the width of the window.', giv: '$V_{th} = 0.4$ V (all NMOS), $V_{ov4} = 0.15$ V, $V_{b1} = 1.2$ V (gate of the NMOS cascodes M3, M4)', qh: 200,
    tests: 'the background scene: M4’s fence gives the floor, M2’s fence (gate = output) the ceiling.',
    fig: (S2) => { const g = teleSE(S2, { load: 'diode', buffer: true, xname: '', qname: 'Q' }); g.setAttribute('transform', 'translate(-60 140) scale(0.82)'); },
    steps: [
      { t: 6, title: '**Floor: M4’s fence.** The output is M4’s drain and M4’s gate is fixed at $V_{b1}$; an NMOS drain may sit at most $V_{th}$ below its gate.', tex: 'V_{out,min} = V_{b1} - V_{th4} = 1.2 - 0.4 = 0.8\\,\\mathrm{V}', hl: [T([400, 400, 360, 100, C.n])],
        try: { q: 'Lowest output voltage of the buffer?', answer: 0.8, unit: 'V', tol: 0.01,
          hint: ['The output is M4’s drain; M4 is the NMOS cascode with its gate at $V_{b1}$. Its saturation fence sets the floor.', '$V_{out} \\ge V_{b1} - V_{th4}$'],
          how: ['M4’s gate is fixed at $V_{b1} = 1.2$ V and its drain is the output.', 'NMOS fence: the drain may be at most $V_{th}$ below the gate: $$V_{out,min} = V_{b1} - V_{th4} = 1.2 - 0.4 = 0.8\\,\\text{V}$$'] },
        say: '$1.2 - 0.4 = 0.8$ V.' },
      { t: 13, title: '**Ceiling: M2’s fence.** M2’s gate is the output, its drain is Q, one $V_{GS4}$ below $V_{b1}$ (a link). The gate may rise at most $V_{th}$ above the drain.', tex: 'V_{out,max} = V_{b1} - V_{GS4} + V_{th2} = 1.2 - 0.55 + 0.4 = 1.05\\,\\mathrm{V}', hl: [T([400, 500, 360, 110, C.bad])],
        try: {
          parts: [
            pt('$V_{GS4}$?', 0.55, 'V', ['Threshold + overdrive.', '$V_{GS4} = V_{th} + V_{ov4}$'], ['$$0.4 + 0.15$$']),
            pt('Voltage of node Q (M2’s drain, M4’s source)?', 0.65, 'V', ['One link below M4’s gate.', '$V_Q = V_{b1} - V_{GS4}$'], ['$$1.2 - 0.55$$']),
          ],
          q: 'Highest output voltage? Remember the output is also M2’s gate.', answer: 1.05, unit: 'V', tol: 0.01,
          hint: ['M2’s drain is node Q, one $V_{GS4}$ below $V_{b1}$ (a link). M2’s gate is the output, and the NMOS fence lets the gate be at most $V_{th}$ above the drain.', '$V_{out,max} = V_Q + V_{th2} = V_{b1} - V_{GS4} + V_{th2}$, $V_{GS4} = V_{th} + V_{ov4}$'],
          how: ['$$V_{GS4} = V_{th} + V_{ov4} = 0.4 + 0.15 = 0.55\\,\\text{V}$$', 'Node Q (M2’s drain) is one link below M4’s gate: $$V_Q = V_{b1} - V_{GS4} = 1.2 - 0.55 = 0.65\\,\\text{V}$$', 'M2’s gate (the output) may be at most $V_{th}$ above its drain: $$V_{out,max} = V_Q + V_{th2} = 0.65 + 0.4 = 1.05\\,\\text{V}$$'] },
        say: '$1.2 - 0.55 + 0.4 = 1.05$ V.' },
      { t: 20, title: '**Width** = ceiling − floor: one threshold minus one overdrive.', tex: '(V_{b1} - V_{GS4} + V_{th}) - (V_{b1} - V_{th}) = V_{th} - V_{ov4} = 0.4 - 0.15 = 0.25\\,\\mathrm{V}',
        try: { q: 'How wide is the buffer’s output window? Use the floor and the ceiling you just found.', answer: 0.25, unit: 'V', tol: 0.01,
          hint: ['The window is everything between the ceiling (M2’s fence) and the floor (M4’s fence).', 'width $= V_{out,max} - V_{out,min}$; in symbols it simplifies to $V_{th} - V_{ov4}$'],
          how: ['From the two steps above: floor 0.8 V (M4’s fence), ceiling 1.05 V (M2’s fence).', '$$\\text{width} = V_{out,max} - V_{out,min} = 1.05 - 0.8 = 0.25\\,\\text{V}$$', 'In symbols: $$(V_{b1} - V_{GS4} + V_{th}) - (V_{b1} - V_{th}) = V_{th} - V_{ov4}$$ so $V_{b1}$ cancels: no choice of bias widens it.'],
          why: 'The telescopic buffer window is only $V_{th} - V_{ov}$ wide, whatever $V_{b1}$ is: the reason the folded cascode exists.' },
        say: 'Only 0.25 V for the output.' },
      { t: 25, ans: true, title: '**Answers:** output from 0.8 V to 1.05 V · width 0.25 V', say: 'Compare the folded buffer on your page: no ceiling from M2 at all.' },
    ],
  });
}, { q: 'Razavi Ex 9.5' });

scene(CQ, 'Problem Set 1 P5: diode-stack mirror and its buffer window', 58, (S) => {
  const T = tfm(0.82, -60, 140);
  pyqFrame(S, {
    tag: 'LEC 6 · QUESTION 7 OF 9', title: 'The diode tax, then the buffer', src: 'Problem Set 1 P5',
    q: 'Single-ended telescopic with a diode cascode mirror, $V_{DD} = 3$ V, $(W/L)_{1-8} = 200$, $I_{SS} = 1$ mA, $V_{b1} = 1.6$ V. (a) $V_X$ (M1’s drain). (b) Output range. (c) Why is $V_{out,max}$ not $V_{DD} - |V_{ov8}| - |V_{ov6}|$? (d) With M2’s gate on $V_{out}$, the range.', giv: SETA, qh: 240,
    tests: 'a link for X, M4’s fence for the floor, the diode tax for the ceiling, and the buffer window.',
    fig: (S2) => { const g = teleSE(S2, { load: 'diode', xname: '', qname: 'X' }); g.setAttribute('transform', 'translate(-60 140) scale(0.82)'); },
    steps: [
      { t: 6, title: '(a) **X is M3’s source**, one $V_{GS3}$ below its gate $V_{b1}$ (a link). $V_{ov3}$ from the square law at $I_{SS}/2 = 0.5$ mA.', tex: 'V_{GS3} = 0.7 + \\sqrt{\\tfrac{2(0.5\\,\\mathrm{m})}{134.28\\,\\mu\\cdot200}} = 0.893\\,\\mathrm{V},\\quad V_X = 1.6 - 0.893 = 0.707\\,\\mathrm{V}', hl: [T([400, 420, 120, 110, C.volt])],
        try: {
          parts: [
            pt('$V_{ov3}$ of the NMOS cascode (0.5 mA, W/L = 200)?', NUM.vovn, 'V', ['Square law solved for the overdrive; each side carries $I_{SS}/2$.', '$V_{ov} = \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}}$'], ['$$\\sqrt{\\frac{2(0.5\\,\\text{m})}{134.28\\,\\mu\\times200}}$$']),
            pt('$V_{GS3}$?', NUM.vgsn, 'V', ['Threshold + overdrive.', '$V_{GS3} = V_{thn} + V_{ov3}$'], [`$$0.7 + ${fx(NUM.vovn, 3)}$$`]),
          ],
          q: '(a) Find $V_X$, the drain of M1 (which is also the source of the cascode M3).', answer: ans('bank-ps1p5', 'vx'), unit: 'V', tol: 0.01,
          hint: ['X is M3’s source and M3’s gate is at $V_{b1}$: one link down. Find $V_{GS3}$ from the square law, with each side carrying $I_{SS}/2$.', '$V_X = V_{b1} - V_{GS3}$, $V_{GS3} = V_{thn} + \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}}$'],
          how: ['Each side carries $I_D = I_{SS}/2 = 0.5$ mA.', 'Overdrive from the square law: $$V_{ov3} = \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}} = \\sqrt{\\frac{2(0.5\\,\\text{m})}{134.28\\,\\mu\\times200}} = 0.193\\,\\text{V}$$', '$$V_{GS3} = V_{thn} + V_{ov3} = 0.7 + 0.193 = 0.893\\,\\text{V}$$', 'One link below $V_{b1}$: $$V_X = V_{b1} - V_{GS3} = 1.6 - 0.893 = 0.707\\,\\text{V}$$'],
          calc: [{ what: 'V_GS3 and V_X in one line', keys: '1.6 − ( 0.7 + [√] 2 × 0.5m ÷ ( 134.28µ × 200 ) ) [EXE]', shows: '0.707', note: 'Close the √ with ▶ before “)”. ' + PFX }] },
        say: '$1.6 - 0.893 = 0.707$ V.' },
      { t: 14, title: '(b) **Floor: M4’s fence.** The output is M4’s drain, its gate is at $V_{b1}$.', tex: 'V_{out,min} = V_{b1} - V_{thn} = 1.6 - 0.7 = 0.9\\,\\mathrm{V}', hl: [T([620, 400, 140, 100, C.n])],
        try: { q: '(b) Output range, the low end first. How low can the output go before the NMOS cascode M4 leaves saturation?', answer: 0.9, unit: 'V', tol: 0.01,
          hint: ['The output is M4’s drain\\; M4’s gate is fixed at $V_{b1} = 1.6$ V. An NMOS stays saturated while its drain is no more than $V_{thn}$ below its gate (a fence).', '$V_{out,min} = V_{b1} - V_{thn}$'],
          how: ['M4 is the NMOS cascode on the output side: gate at $V_{b1} = 1.6$ V, drain = output.', 'NMOS fence (saturation needs $V_D \\ge V_G - V_{th}$): $$V_{out,min} = V_{b1} - V_{thn} = 1.6 - 0.7 = 0.9\\,\\text{V}$$'],
          why: 'With a fixed cascode gate, the floor is the gate minus one threshold\\; the overdrives below do not enter.' },
        say: '$V_{out} \\ge 1.6 - 0.7 = 0.9$ V.' },
      { t: 21, title: '**Ceiling: the diode tax.** The diode stack holds M6’s gate two $|V_{GS}|$ below $V_{DD}$, so M6’s PMOS fence allows only $V_{G6} + |V_{thp}|$: a whole $|V_{thp}|$ less than ideal cascode loads.', tex: 'V_{out,max} = V_{DD} - 2|V_{GS,p}| + |V_{thp}| = 3 - 2(1.161) + 0.8 = 1.478\\,\\mathrm{V}', hl: [T([400, 150, 360, 260, C.amb])],
        try: {
          parts: [
            pt('$|V_{ov}|$ of each PMOS (0.5 mA, W/L = 200)?', NUM.vovp, 'V', ['Square law with $\\mu_pC_{ox}$.', '$|V_{ov}| = \\sqrt{\\frac{2I_D}{\\mu_pC_{ox}(W/L)}}$'], ['$$\\sqrt{\\frac{2(0.5\\,\\text{m})}{38.36\\,\\mu\\times200}}$$']),
            pt('Voltage of M6’s gate (two PMOS diode drops below $V_{DD}$)?', 3 - 2 * NUM.vgsp, 'V', ['Each diode drops $|V_{GS}| = |V_{thp}| + |V_{ov}|$.', '$V_{G6} = V_{DD} - 2|V_{GS,p}|$'], [`$$|V_{GS,p}| = 0.8 + ${fx(NUM.vovp, 3)} = ${fx(NUM.vgsp, 4)}\\,\\text{V},\\;; V_{G6} = 3 - 2(${fx(NUM.vgsp, 4)})$$`]),
          ],
          q: '(b, c) Highest output voltage with this diode-stack mirror load?', answer: ans('bank-ps1p5', 'max'), unit: 'V', tol: 0.01,
          hint: ['The PMOS mirror is M8 (top) and M6 (cascode) on the output side. M6’s gate is set by the two diodes on the other side: two PMOS $|V_{GS}|$ below $V_{DD}$. Then M6’s PMOS fence: its drain (the output) may be at most $|V_{thp}|$ above its gate.', '$V_{out,max} = V_{G6} + |V_{thp}|$, $V_{G6} = V_{DD} - 2|V_{GS,p}|$, $|V_{GS,p}| = |V_{thp}| + \\sqrt{\\frac{2I_D}{\\mu_pC_{ox}(W/L)}}$'],
          how: ['PMOS overdrive at 0.5 mA, W/L = 200: $$|V_{ov}| = \\sqrt{\\frac{2(0.5\\,\\text{m})}{38.36\\,\\mu\\times200}} = 0.361\\,\\text{V},\\;\\; |V_{GS,p}| = 0.8 + 0.361 = 1.161\\,\\text{V}$$', 'Two diode drops below $V_{DD}$: $$V_{G6} = 3 - 2(1.161) = 0.678\\,\\text{V}$$', 'PMOS fence on M6: $$V_{out,max} = V_{G6} + |V_{thp}| = 0.678 + 0.8 = 1.478\\,\\text{V}$$', '(c) This equals $V_{DD} - |V_{thp}| - |V_{ov8}| - |V_{ov6}|$: a whole $|V_{thp}|$ below the ideal $V_{DD} - |V_{ov8}| - |V_{ov6}|$. That is the diode tax.'] },
        say: '(c) $3 - 0.8 - 0.361 - 0.361 = 1.478$ V: one $|V_{thp}|$ lower than ideal cascode loads would allow — the diode tax.' },
      { t: 30, title: '(d) **Buffer: M2’s fence.** M2’s gate is now the output and its drain sits at $V_{b1} - V_{GS4}$ (0.707 V, like X), so the output may rise only $V_{thn}$ above that.', tex: 'V_{out,max} = V_{b1} - V_{GS4} + V_{thn} = 1.6 - 0.893 + 0.7 = 1.407\\,\\mathrm{V}',
        try: { q: '(d) M2’s gate is now tied to $V_{out}$ (unity-gain buffer). Highest output voltage? (From (a): $V_{GS3} = V_{GS4} = 0.893$ V.)', answer: ans('bank-ps1p5', 'bufMax'), unit: 'V', tol: 0.01,
          hint: ['M2’s drain is one $V_{GS4}$ below $V_{b1}$, the same as X in part (a) by symmetry. M2’s gate is now the output, and an NMOS gate may be at most $V_{thn}$ above its drain.', '$V_{out,max} = V_{b1} - V_{GS4} + V_{thn}$'],
          how: ['M2’s drain is M4’s source, one link below $V_{b1}$ (same as part (a)): $$V_{b1} - V_{GS4} = 1.6 - 0.893 = 0.707\\,\\text{V}$$', 'NMOS fence on M2 with the gate on the output: $$V_{out,max} = 0.707 + V_{thn} = 0.707 + 0.7 = 1.407\\,\\text{V}$$', 'The floor is still M4’s fence, 0.9 V, so the buffer only works from 0.9 V to 1.407 V.'] },
        say: '1.407 V; the window is 0.9–1.407 V.' },
      { t: 38, ans: true, title: '**Answers:** $V_X$ = 0.707 V · output 0.9 V to 1.478 V · (c) the diode tax costs $|V_{thp}|$ · buffer 0.9 V to 1.407 V. (Check: with these sizes M3 is just in triode — the trap of Tutorial 2 Q2.)', say: 'One honesty note: with W/L = 200 the diode stack puts M3’s drain below X, so M3 is actually in triode; the key assumes saturation.' },
    ],
  });
}, { q: 'Problem Set 1 P5' });

scene(CQ, '2024 mid-sem Q3: PMOS-input telescopic, then as a buffer', 66, (S) => {
  const T = tfm(0.82, -60, 140);
  pyqFrame(S, {
    paper: 'm24q3', tag: 'LEC 6 · QUESTION 8 OF 9', title: 'Gain, swing, and the buffer floor', src: 'Mid-sem 2024-25 Q3 · 10 marks',
    q: 'PMOS-input telescopic. $I_{SS} = 50\\,\\mu$A, $V_{ov1-4} = 0.2$ V, $V_{ov5-8} = 0.1$ V, the tail needs 0.15 V, $V_b = 0.7$ V. Find the gain, $V_{out,max}$, $V_{out,min}$. Then with $V_{out}$ shorted to $V_{in2}$: $V_{out,max}$ and $V_{out,min}$.', giv: '$V_{DD} = 1.8$ V, $\\lambda_p = 0.2$, $\\lambda_n = 0.1$ V⁻¹, $V_{thn} = 0.4$, $|V_{thp}| = 0.5$ V', qh: 250,
    tests: 'the PMOS-flipped telescopic: two looks for gain, PMOS fence for the ceiling, the diode stack for the floor, and the buffer fence that now gives a floor.',
    fig: (S2) => { const g = teleP(S2); g.setAttribute('transform', 'translate(-60 140) scale(0.82)'); },
    steps: [
      { t: 7, title: '**Roles first**: M2 is the input, M4 the PMOS cascode, M6 the NMOS cascode, M8 the current source. Each side carries 25 µA; $g_m = 2I_D/V_{ov}$, $r_O = 1/(\\lambda I_D)$.', tex: stepTex('pyq-m24-q3', 0),
        try: {
          parts: [
            pt('Drain current of each side ($I_{SS} = 50\\,\\mu$A)?', 25e-6, 'A', ['The tail splits equally between the two sides.', '$I_D = I_{SS}/2$'], ['$$I_D = \\frac{50\\,\\mu\\text{A}}{2}$$']),
            pt('$g_{m6}$ of the NMOS cascode ($V_{ov6} = 0.1$ V)?', 0.5e-3, 'S', ['Same current, smaller overdrive: a larger $g_m$.', '$g_m = \\frac{2I_D}{V_{ov}}$'], ['$$g_{m6} = \\frac{2(25\\,\\mu)}{0.1}$$']),
            pt('$r_O$ of each PMOS ($\\lambda_p = 0.2$ V⁻¹)?', 200e3, 'Ω', ['From channel-length modulation.', '$r_O = \\frac{1}{\\lambda_p I_D}$'], ['$$r_{OP} = \\frac{1}{0.2\\times25\\,\\mu}$$']),
            pt('$r_O$ of each NMOS ($\\lambda_n = 0.1$ V⁻¹)?', 400e3, 'Ω', ['Same formula with the NMOS λ.', '$r_O = \\frac{1}{\\lambda_n I_D}$'], ['$$r_{ON} = \\frac{1}{0.1\\times25\\,\\mu}$$']),
          ],
          q: 'Roles: M2 is the input (PMOS), M4 the PMOS cascode, M6 the NMOS cascode, M8 the NMOS current source. Find the input transconductance $g_{m2}$ ($|V_{ov2}| = 0.2$ V).', answer: 0.25e-3, unit: 'S', tol: 0.02,
          hint: ['Each side carries $I_{SS}/2$. With the current and the overdrive given, use the fastest form of $g_m$.', '$g_m = \\frac{2I_D}{|V_{ov}|}$'],
          how: ['Each side carries half the tail: $$I_D = \\frac{50\\,\\mu}{2} = 25\\,\\mu\\text{A}$$', 'Input transconductance from current and overdrive: $$g_{m2} = \\frac{2I_D}{|V_{ov2}|} = \\frac{2(25\\,\\mu)}{0.2} = 0.25\\,\\text{mS}$$', 'The same recipe gives $g_{m4} = 0.25$ mS (also 0.2 V) and $g_{m6} = 2(25\\,\\mu)/0.1 = 0.5$ mS\\; $r_{OP} = 1/(0.2\\times25\\,\\mu) = 200$ kΩ, $r_{ON} = 1/(0.1\\times25\\,\\mu) = 400$ kΩ.'],
          why: 'Write the roles first: the gain needs $g_m$ of the input and of each cascode, and $r_O$ of every device in the two looks.' },
        say: 'M2 is the input, M4 the PMOS cascode, M6 the NMOS cascode, M8 the source. $g_{m2} = 0.25$ mS, $r_{OP} = 200$ kΩ, $r_{ON} = 400$ kΩ.' },
      { t: 14, title: '**Gain by two looks**: each side is a cascode, so each look multiplies, $g_mr_O\\cdot r_O$.', tex: 'A_v = g_{m2}(g_{m4}r_{O4}r_{O2}\\parallel g_{m6}r_{O6}r_{O8}) = 0.25\\,\\mathrm{mS}\\,(10\\,\\mathrm{M\\Omega}\\parallel 80\\,\\mathrm{M\\Omega}) = 2222',
        try: {
          parts: [
            pt('PMOS look: $g_{m4}r_{O4}r_{O2}$?', 0.25e-3 * 200e3 * 200e3, 'Ω', ['M4 is a cascode on top of M2’s $r_O$: it multiplies it by $g_{m4}r_{O4}$.', '$g_{m4}r_{O4}r_{O2}$'], ['$$0.25\\,\\text{m}\\times200\\,\\text{k}\\times200\\,\\text{k}$$']),
            pt('NMOS look: $g_{m6}r_{O6}r_{O8}$?', 0.5e-3 * 400e3 * 400e3, 'Ω', ['M6 is a cascode on top of M8’s $r_O$.', '$g_{m6}r_{O6}r_{O8}$'], ['$$0.5\\,\\text{m}\\times400\\,\\text{k}\\times400\\,\\text{k}$$']),
          ],
          q: 'Open-loop gain $A_v$ (output on M2’s side)? Step 1 gave, at 25 µA per side: $g_{m2} = g_{m4} = 0.25$ mS, $g_{m6} = 0.5$ mS, $r_{OP} = 200$ kΩ, $r_{ON} = 400$ kΩ.', answer: ans('pyq-m24-q3', 'av'), unit: 'V/V', tol: 0.02,
          hint: ['$G_m = g_{m2}$. Look into the output both ways: above is the PMOS cascode M4 stacked on input M2; below is the NMOS cascode M6 on source M8. Each look is $g_mr_O$ times the $r_O$ under it.', '$A_v = g_{m2}(g_{m4}r_{O4}r_{O2}\\parallel g_{m6}r_{O6}r_{O8})$'],
          how: ['Use the step-1 values (25 µA per side): $$g_{m2} = g_{m4} = 0.25\\,\\text{mS},\\;\\; g_{m6} = 0.5\\,\\text{mS},\\;\\; r_{OP} = 200\\,\\text{k}\\Omega,\\;\\; r_{ON} = 400\\,\\text{k}\\Omega$$', 'PMOS look: $$g_{m4}r_{O4}r_{O2} = 0.25\\,\\text{m}\\times200\\,\\text{k}\\times200\\,\\text{k} = 10\\,\\text{M}\\Omega$$', 'NMOS look: $$g_{m6}r_{O6}r_{O8} = 0.5\\,\\text{m}\\times400\\,\\text{k}\\times400\\,\\text{k} = 80\\,\\text{M}\\Omega$$', '$$A_v = 0.25\\,\\text{mS}\\times(10\\,\\text{M}\\parallel80\\,\\text{M}) = 0.25\\,\\text{mS}\\times8.89\\,\\text{M}\\Omega = 2222$$'],
          calc: [{ what: 'Both looks, parallel, times g_m2', keys: '0.25m × ( 10M [SHIFT][^] + 80M [SHIFT][^] ) [SHIFT][^] [EXE]', shows: '2222', note: PFX }] },
        say: '$0.25\\,\\text{mS}\\times8.9\\,\\text{M} ≈ 2222$.' },
      { t: 22, title: '**Ceiling: M4’s fence.** The output is M4’s drain; M4 is a PMOS with its gate at $V_b$, so the drain may rise at most $|V_{thp}|$ above it.', tex: 'V_{out,max} = V_b + |V_{thp}| = 0.7 + 0.5 = 1.2\\,\\mathrm{V}', hl: [T([400, 340, 360, 120, C.p])],
        try: { q: 'Highest output voltage $V_{out,max}$?', answer: 1.2, unit: 'V', tol: 0.01,
          hint: ['The output is the drain of the PMOS cascode M4, whose gate is fixed at $V_b$. Its saturation fence caps the drain.', '$V_{out,max} = V_b + |V_{thp}|$'],
          how: ['M4’s gate is fixed at $V_b = 0.7$ V and its drain is the output.', 'PMOS fence: the drain may be at most $|V_{thp}|$ above the gate: $$V_{out,max} = V_b + |V_{thp}| = 0.7 + 0.5 = 1.2\\,\\text{V}$$'] },
        say: '$0.7 + 0.5 = 1.2$ V.' },
      { t: 30, title: '**Floor: the diode stack.** M6’s gate sits at $V_{GS7} + V_{GS5}$ (two NMOS diodes on the other side); M6’s NMOS fence lets the output go $V_{thn}$ below that.', tex: 'V_{out,min} = (V_{GS7} + V_{GS5}) - V_{thn} = (0.5 + 0.5) - 0.4 = 0.6\\,\\mathrm{V}', hl: [T([400, 470, 360, 230, C.amb])],
        try: {
          parts: [
            pt('$V_{GS}$ of each NMOS diode (M5, M7)?', 0.5, 'V', ['Threshold + overdrive.', '$V_{GS} = V_{thn} + V_{ov}$'], ['$$0.4 + 0.1$$']),
            pt('Voltage of M6’s gate (two diodes stacked on ground)?', 1.0, 'V', ['M7’s diode on ground, M5’s diode on top: their gate–source voltages add.', '$V_{G6} = V_{GS7} + V_{GS5}$'], ['$$0.5 + 0.5$$']),
          ],
          q: 'Lowest output voltage $V_{out,min}$?', answer: 0.6, unit: 'V', tol: 0.01,
          hint: ['The output is M6’s drain. M6’s gate is set by the diode stack M7, M5 on the other side: two $V_{GS}$ above ground. Then M6’s NMOS fence.', '$V_{out,min} = V_{G6} - V_{thn}$, $V_{G6} = V_{GS7} + V_{GS5}$'],
          how: ['Each NMOS diode: $$V_{GS} = V_{thn} + V_{ov} = 0.4 + 0.1 = 0.5\\,\\text{V}$$', 'Two diodes stacked from ground: $$V_{G6} = V_{GS7} + V_{GS5} = 0.5 + 0.5 = 1.0\\,\\text{V}$$', 'NMOS fence on M6 (drain = output): $$V_{out,min} = V_{G6} - V_{thn} = 1.0 - 0.4 = 0.6\\,\\text{V}$$', 'Ideal cascode biasing would allow $2V_{ov} = 0.2$ V: the diode stack costs a whole $V_{thn}$.'] },
        say: '$1.0 - 0.4 = 0.6$ V — the diode tax again, this time at the bottom.' },
      { t: 38, title: '**Buffer: M2’s fence becomes a floor.** M2 is a PMOS with its gate on $V_{out}$; its drain is M4’s source, $V_b + |V_{GS4}| = 1.4$ V, and may be at most $|V_{thp}|$ above the gate.', tex: '1.4 \\le V_{out} + 0.5 \\;\\Rightarrow\\; V_{out,min} = 0.9\\,\\mathrm{V}', hl: [T([620, 240, 160, 120, C.bad])],
        try: {
          parts: [
            pt('$|V_{GS4}|$ of the PMOS cascode?', 0.7, 'V', ['Threshold + overdrive.', '$|V_{GS4}| = |V_{thp}| + |V_{ov4}|$'], ['$$0.5 + 0.2$$']),
            pt('Voltage of M2’s drain (= M4’s source)?', 1.4, 'V', ['M4’s source sits one $|V_{GS4}|$ above its gate $V_b$.', '$V_{D2} = V_b + |V_{GS4}|$'], ['$$0.7 + 0.7$$']),
          ],
          q: 'Now $V_{out}$ is shorted to $V_{in2}$ (M2’s gate). Lowest output voltage?', answer: 0.9, unit: 'V', tol: 0.01,
          hint: ['M2 is a PMOS whose drain is M4’s source, one $|V_{GS4}|$ above $V_b$. Its gate is now the output, and a PMOS drain may be at most $|V_{thp}|$ above its gate.', '$V_b + |V_{GS4}| \\le V_{out} + |V_{thp}|$'],
          how: ['$$|V_{GS4}| = |V_{thp}| + |V_{ov4}| = 0.5 + 0.2 = 0.7\\,\\text{V}$$', 'M2’s drain is M4’s source: $$V_{D2} = V_b + |V_{GS4}| = 0.7 + 0.7 = 1.4\\,\\text{V}$$', 'PMOS fence on M2 with its gate on the output: $$1.4 \\le V_{out} + 0.5\\;\\Rightarrow\\;V_{out,min} = 0.9\\,\\text{V}$$'],
          why: 'Flip NMOS to PMOS and the buffer fence flips too: for a PMOS input, M2 limits the output from below.' },
        say: '$1.4 \\le V_{out} + 0.5 \\Rightarrow V_{out} \\ge 0.9$ V: for a PMOS input, M2’s fence becomes a <b>floor</b>.' },
      { t: 46, title: '**Buffer ceiling** is still M4’s fence (unchanged by the short).', tex: 'V_{out,max} = V_b + |V_{thp}| = 1.2\\,\\mathrm{V}',
        try: { q: 'With $V_{out}$ shorted to $V_{in2}$, what happens to the highest output voltage?', choices: ['It stays at 1.2 V: M4’s gate is still $V_b$, so its fence is unchanged', 'It drops: M2’s fence now caps the output from above', 'It rises to $V_{DD} - |V_{ov}|$: the short removes M4’s limit'], answer: 0,
          hint: ['Ask which device set the ceiling before the short, and whether the short changes that device’s gate or drain.', 'Ceiling = M4’s fence, $V_b + |V_{thp}|$. Does $V_b$ move?'],
          how: ['Before the short the ceiling came from M4 (PMOS cascode, gate at $V_b$, drain = output).', 'The short ties the output to M2’s gate. M4’s gate is still $V_b$, so the same fence holds: $$V_{out,max} = V_b + |V_{thp}| = 0.7 + 0.5 = 1.2\\,\\text{V}$$', 'For a PMOS input, M2’s fence limits the output from below (0.9 V), so the buffer window is 0.9–1.2 V.'],
          why: 'The short only adds a fence on the input device; every fence that was there before still applies.' },
        say: 'Still 1.2 V. Buffer window 0.9–1.2 V.' },
      { t: 52, ans: true, title: '**Answers:** $A_v ≈ 2222$ · $V_{out}$ from 0.6 V to 1.2 V · buffer from 0.9 V to 1.2 V', say: 'Flip NMOS↔PMOS and every fence flips: the PMOS telescopic’s buffer window is limited from below by M2.' },
    ],
  });
}, { q: 'Mid-sem 2024 Q3' });

scene(CQ, 'Tutorial 3 Q1: your page’s last circuit with numbers', 74, (S) => {
  const T = tfm(0.82, -60, 140);
  pyqFrame(S, {
    paper: 't3q1', tag: 'LEC 6 · QUESTION 9 OF 9', title: 'The low-voltage cascode load, every part', src: 'Tutorial 3 Q1 · Razavi 9.4',
    q: 'Telescopic with the low-voltage cascode load. $(W/L)_{1-8} = 200$, $I_{SS} = 1$ mA, $V_{b1} = 1.7$ V, $V_{DD} = 3$ V. (a) Maximum input CM. (b) $V_X$. (c) Output range if M2’s gate is tied to the output. (d) Allowed range of $V_{b2}$.', giv: SETA, qh: 230,
    tests: 'a fence for the CM ceiling, a link for X, the telescopic buffer window, and the two fences that bound $V_{b2}$ — your page’s last circuit.',
    fig: (S2) => { const g = teleSE(S2, { load: 'lvc', xname: 'X', qname: '' }); g.setAttribute('transform', 'translate(-60 140) scale(0.82)'); },
    steps: [
      { t: 7, title: '(a) **M1’s drain is M3’s source**, one $V_{GS3}$ below $V_{b1}$ (a link); the NMOS fence lets M1’s gate rise $V_{thn}$ above it.', tex: 'V_{in,CM,max} = V_{b1} - V_{GS3} + V_{thn} = 1.7 - 0.893 + 0.7 = 1.507\\,\\mathrm{V}',
        try: {
          parts: [
            pt('$V_{GS3}$ of the NMOS cascode (0.5 mA, W/L = 200)?', NUM.vgsn, 'V', ['Square law for $V_{ov3}$, then add the threshold.', '$V_{GS3} = V_{thn} + \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}}$'], [`$$V_{ov3} = \\sqrt{\\frac{2(0.5\\,\\text{m})}{134.28\\,\\mu\\times200}} = ${fx(NUM.vovn, 3)}\\,\\text{V},\\;; V_{GS3} = 0.7 + ${fx(NUM.vovn, 3)}$$`]),
            pt('Voltage of M1’s drain (= M3’s source)?', 1.7 - NUM.vgsn, 'V', ['One link below M3’s gate.', '$V_{D1} = V_{b1} - V_{GS3}$'], [`$$1.7 - ${fx(NUM.vgsn, 3)}$$`]),
          ],
          q: '(a) Maximum input common-mode level?', answer: ans('bank-t3q1', 'cmMax'), unit: 'V', tol: 0.01,
          hint: ['M1’s drain is M3’s source, one $V_{GS3}$ below $V_{b1}$ (a link; each side carries $I_{SS}/2$). M1’s gate may rise $V_{thn}$ above its drain (NMOS fence).', '$V_{in,CM,max} = V_{b1} - V_{GS3} + V_{thn}$, $V_{GS3} = V_{thn} + \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}}$'],
          how: ['Each side carries 0.5 mA: $$V_{ov3} = \\sqrt{\\frac{2(0.5\\,\\text{m})}{134.28\\,\\mu\\times200}} = 0.193\\,\\text{V},\\;\\; V_{GS3} = 0.7 + 0.193 = 0.893\\,\\text{V}$$', 'M1’s drain, one link below $V_{b1}$: $$V_{D1} = V_{b1} - V_{GS3} = 1.7 - 0.893 = 0.807\\,\\text{V}$$', 'NMOS fence on M1: $$V_{in,CM,max} = V_{D1} + V_{thn} = 0.807 + 0.7 = 1.507\\,\\text{V}$$'] },
        say: '$1.7 - 0.893 + 0.7 = 1.507$ V.' },
      { t: 15, title: '(b) **M7’s gate is X and its source is $V_{DD}$**: X is one PMOS $|V_{GS7}|$ below the supply (a link), at 0.5 mA.', tex: '|V_{GS7}| = 0.8 + \\sqrt{\\tfrac{2(0.5\\,\\mathrm{m})}{38.36\\,\\mu\\cdot200}} = 1.161\\,\\mathrm{V},\\quad V_X = 3 - 1.161 = 1.839\\,\\mathrm{V}', hl: [T([400, 150, 360, 270, C.amb])],
        try: {
          parts: [
            pt('$|V_{ov7}|$ (0.5 mA, W/L = 200)?', NUM.vovp, 'V', ['Square law with $\\mu_pC_{ox}$.', '$|V_{ov}| = \\sqrt{\\frac{2I_D}{\\mu_pC_{ox}(W/L)}}$'], ['$$\\sqrt{\\frac{2(0.5\\,\\text{m})}{38.36\\,\\mu\\times200}}$$']),
            pt('$|V_{GS7}|$?', NUM.vgsp, 'V', ['Threshold + overdrive.', '$|V_{GS7}| = |V_{thp}| + |V_{ov7}|$'], [`$$0.8 + ${fx(NUM.vovp, 3)}$$`]),
          ],
          q: '(b) Node X is the gate of the PMOS M7 (source on $V_{DD}$). Find $V_X$.', answer: ans('bank-t3q1', 'vx'), unit: 'V', tol: 0.01,
          hint: ['M7 carries 0.5 mA with its source on $V_{DD}$ and its gate on X, so X is one $|V_{GS7}|$ below the supply. Get $|V_{ov7}|$ from the square law.', '$V_X = V_{DD} - |V_{GS7}|$, $|V_{GS7}| = |V_{thp}| + \\sqrt{\\frac{2I_D}{\\mu_pC_{ox}(W/L)}}$'],
          how: ['PMOS overdrive at 0.5 mA, W/L = 200: $$|V_{ov7}| = \\sqrt{\\frac{2(0.5\\,\\text{m})}{38.36\\,\\mu\\times200}} = 0.361\\,\\text{V}$$', '$$|V_{GS7}| = |V_{thp}| + |V_{ov7}| = 0.8 + 0.361 = 1.161\\,\\text{V}$$', 'One link below the supply: $$V_X = V_{DD} - |V_{GS7}| = 3 - 1.161 = 1.839\\,\\text{V}$$'],
          calc: [{ what: 'V_X in one line', keys: '3 − ( 0.8 + [√] 2 × 0.5m ÷ ( 38.36µ × 200 ) ) [EXE]', shows: '1.839', note: 'Close the √ with ▶ before “)”; store it ([VARIABLE] ▸ A ▸ Store) for part (d). ' + PFX }] },
        say: '$X = 3 - 1.161 = 1.839$ V.' },
      { t: 23, title: '(c) **Buffer window**: M4’s fence below ($V_{b1} - V_{thn}$), M2’s fence above (gate = output, drain $V_{b1} - V_{GS4}$).', tex: 'V_{b1} - V_{thn} = 1\\,\\mathrm{V} \\le V_{out} \\le V_{b1} - V_{GS4} + V_{thn} = 1.507\\,\\mathrm{V}',
        try: { q: '(c) M2’s gate is tied to the output. Lowest output voltage?', answer: 1, unit: 'V', tol: 0.01,
          hint: ['The output is M4’s drain; M4 is the NMOS cascode with its gate at $V_{b1}$. Its fence sets the floor.', '$V_{out,min} = V_{b1} - V_{thn}$'],
          how: ['M4’s gate is at $V_{b1} = 1.7$ V and its drain is the output.', 'NMOS fence on M4: $$V_{out,min} = V_{b1} - V_{thn} = 1.7 - 0.7 = 1.0\\,\\text{V}$$', 'The top of the window is M2’s fence: $V_{b1} - V_{GS4} + V_{thn} = 1.507$ V, the same as part (a).'] },
        say: 'Window 1.0–1.507 V (width $V_{th} - V_{ov4}$).' },
      { t: 31, title: '(d) **Lowest $V_{b2}$: M5’s fence.** M5 is the PMOS cascode with gate $V_{b2}$ and drain X; its drain may be at most $|V_{thp}|$ above its gate.', tex: 'V_X \\le V_{b2} + |V_{thp}| \\;\\Rightarrow\\; V_{b2} \\ge 1.839 - 0.8 = 1.039\\,\\mathrm{V}', hl: [T([400, 270, 120, 130, C.p])],
        try: { q: '(d) Range of $V_{b2}$, low end: what is the smallest $V_{b2}$ that keeps M5 saturated? (From (b): $V_X = 1.839$ V.)', answer: ans('bank-t3q1', 'vb2min'), unit: 'V', tol: 0.01,
          hint: ['M5 is the PMOS cascode: gate at $V_{b2}$, drain on node X. PMOS fence: the drain may be at most $|V_{thp}|$ above the gate.', '$V_X \\le V_{b2} + |V_{thp}|$, so $V_{b2,min} = V_X - |V_{thp}|$'],
          how: ['From (b): $V_X = 1.839$ V, and X is M5’s drain.', 'PMOS fence on M5: $$V_X \\le V_{b2} + |V_{thp}|$$', '$$V_{b2,min} = V_X - |V_{thp}| = 1.839 - 0.8 = 1.039\\,\\text{V}$$'] },
        say: '$V_{b2} \\ge 1.039$ V — your page’s first line.' },
      { t: 40, title: '**Highest $V_{b2}$: M7’s fence.** M7’s drain is M5’s source, $V_{b2} + |V_{GS5}|$; M7’s gate is X, so that drain may be at most $V_X + |V_{thp}|$.', tex: 'V_{b2} + |V_{GS5}| \\le V_X + |V_{thp}| \\;\\Rightarrow\\; V_{b2} \\le 1.839 + 0.8 - 1.161 = 1.478\\,\\mathrm{V}', hl: [T([400, 150, 120, 140, C.p])],
        try: { q: 'Now the high end: the largest $V_{b2}$ that keeps M7 saturated? (From (b): $V_X = 1.839$ V and every PMOS here has $|V_{GS}| = 1.161$ V.)', answer: ans('bank-t3q1', 'vb2max'), unit: 'V', tol: 0.01,
          hint: ['M7’s drain is M5’s source, one $|V_{GS5}|$ above $V_{b2}$ (M5 carries the same 0.5 mA as M7). M7’s gate is X, so its PMOS fence caps that drain at $V_X + |V_{thp}|$.', '$V_{b2} + |V_{GS5}| \\le V_X + |V_{thp}|$'],
          how: ['M5 has the same size and current as M7, so from (b): $|V_{GS5}| = 1.161$ V.', 'PMOS fence on M7 (gate X, drain = M5’s source): $$V_{b2} + |V_{GS5}| \\le V_X + |V_{thp}|$$', '$$V_{b2,max} = V_X + |V_{thp}| - |V_{GS5}| = 1.839 + 0.8 - 1.161 = 1.478\\,\\text{V}$$'] },
        say: '$V_{b2} \\le 1.478$ V. (Same as your page’s $P \\le V_{DD} - |V_{ov7}|$, written with M7’s gate at X.)' },
      { t: 49, ans: true, title: '**Answers:** CM max 1.507 V · $V_X$ = 1.839 V · buffer from 1.0 V to 1.507 V · $V_{b2}$ from 1.039 V to 1.478 V', say: 'Your page’s last circuit in exam form: one link for X, two fences for the bias window.' },
    ],
  });
}, { q: 'Tutorial 3 Q1' });

scene('Exam playbook', 'How to attack any Lec 6 question', 36, (S) => {
  header(S, 'EXAM PLAYBOOK', 'Lecture 6 in four moves');
  remember(S, [
    '**Currents:** power ÷ $V_{DD}$; pair gets half; bottom sources carry $I_{SS}/2 + I$; folding current ≥ $I_{SS}$.',
    '**Levels:** walk from a rail — check ($V_{ov}$) per channel, link ($V_{GS}$) to a gate. PMOS-input floor $X - |V_{thp}|$; NMOS-input ceiling fold + $V_{th}$.',
    '**Buffers and biases:** write each device’s fence with $V_{out}$ in it; floors take the max, ceilings the min. Bias limits = a source at its edge + a link.',
    '**Gain:** $g_{m1}(R_{up}\\parallel R_{down})$, the fold node carries two $r_O$; $G_m ≈ g_{m1}$ (≈ 91 %).',
  ], 0.4, 'The playbook');
  S.say(0.4, 'Four moves solve every Lecture 6 question: currents, levels by checks and links, fences for buffers and biases, and gain by two looks.');
});
