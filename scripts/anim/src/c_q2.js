/* Lesson C: two more questions from the guide’s bank (Tutorial 2 Q2, 2023 mid-sem Q3), placed before the playbook. */
'use strict';
scene(CQ, 'Tutorial 2 Q2: the diode-stack telescopic, every part', 70, (S) => {
  pyqFrame(S, {
    tag: 'LEC 6 · BACKGROUND QUESTION', title: 'Minimum width, swing and gain', src: 'Tutorial 2 Q2 · Razavi 9.2', paper: 't2q2',
    q: 'Single-ended telescopic with a diode-stack PMOS mirror (M2’s gate tied to the output): $(W/L)_{1-4}$ = 100/0.5, $I_{SS}$ = 1 mA, $V_b$ = 1.4 V, M5–M8 identical with L = 0.5 µm, $V_{DD}$ = 3 V. (a) Minimum PMOS width W for M3 to stay saturated. (b) Output swing. (c) Gain.', giv: SETA, qh: 260,
    tests: 'the diode tax: two PMOS diodes take two whole $|V_{GS}|$, then the NMOS fence on M3; the buffer fence on M2 for the ceiling.',
    fig: (S2) => { const g = teleSE(S2, { load: 'diode', buffer: true, xname: '', qname: '', pname: '', rname: 'X', vb: 'V_b' }); g.setAttribute('transform', 'translate(-200 30) scale(0.95)'); }, // names as printed in Tutorial 2 Q2
    steps: [
      { t: 6, title: '(a) **The diode tax sets the limit.** Two PMOS diodes from $V_{DD}$ put M3’s drain at $V_{DD} - 2|V_{GS,p}|$. M3’s NMOS fence (gate $V_b$) needs that drain ≥ $V_b - V_{thn}$, which caps the PMOS $|V_{GS}|$.', tex: '3 - 2|V_{GS,p}| \\ge 1.4 - 0.7 \\;\\Rightarrow\\; |V_{GS,p}| \\le 1.15\\,\\mathrm{V},\\;\\; |V_{ov,p}| \\le 1.15 - 0.8 = 0.35\\,\\mathrm{V}',
        try: {
          parts: [
            pt('Lowest voltage M3’s drain may sit at (M3 is the NMOS cascode, gate at $V_b = 1.4$ V)?', 0.7, 'V', ['NMOS fence: the drain may be at most $V_{thn}$ below the gate.', '$V_{D3} \\ge V_b - V_{thn}$'], ['$$V_{D3,min} = 1.4 - 0.7$$']),
            pt('Largest $|V_{GS}|$ each PMOS diode may take?', 1.15, 'V', ['The two PMOS diodes stack from $V_{DD}$ down to M3’s drain: $V_{D3} = V_{DD} - 2|V_{GS,p}|$.', '$3 - 2|V_{GS,p}| \\ge 0.7$'], ['$$|V_{GS,p}| \\le \\frac{3 - 0.7}{2}$$']),
          ],
          q: '(a) First the limit. M3 must stay saturated. What is the largest overdrive $|V_{ov,p}|$ the PMOS diodes may have?', answer: 0.35, unit: 'V', tol: 0.01,
          hint: ['M3’s drain hangs two PMOS diode drops below $V_{DD}$. M3’s NMOS fence (gate at $V_b$) says how low that drain may go, so it caps each diode’s $|V_{GS}|$.', '$V_{DD} - 2|V_{GS,p}| \\ge V_b - V_{thn}$, then $|V_{ov,p}| = |V_{GS,p}| - |V_{thp}|$'],
          how: ['M3’s drain is two PMOS diodes below the supply: $$V_{D3} = V_{DD} - 2|V_{GS,p}|$$', 'NMOS fence on M3 (gate at $V_b$): $$V_{D3} \\ge V_b - V_{thn} = 1.4 - 0.7 = 0.7\\,\\text{V}$$', 'Put them together: $$3 - 2|V_{GS,p}| \\ge 0.7 \\;\\Rightarrow\\; |V_{GS,p}| \\le 1.15\\,\\text{V}$$', 'Remove the threshold: $$|V_{ov,p}| \\le 1.15 - 0.8 = 0.35\\,\\text{V}$$'],
          why: 'The diode tax: each diode costs a whole $|V_{GS}|$, so only a small overdrive is left, and a small overdrive at fixed current needs a wide device.' },
        say: '$3 - 2|V_{GS,p}| \\ge 1.4 - 0.7$, so each PMOS may use at most 1.15 V: an overdrive of at most 0.35 V.' },
      { t: 14, title: '**Smallest width**: a smaller overdrive at the same 0.5 mA needs a wider PMOS. Square law at the largest allowed $|V_{ov}|$ = 0.35 V.', tex: '\\tfrac{W}{L} = \\frac{2(0.5\\,\\mathrm{m})}{38.36\\,\\mu\\,(0.35)^2} = 212.8 \\;\\Rightarrow\\; W = 212.8\\times0.5\\,\\mu\\mathrm{m} = 106\\,\\mu\\mathrm{m}',
        try: {
          parts: [
            pt('Smallest $W/L$ of the PMOS (0.5 mA at $|V_{ov}| = 0.35$ V)?', NUM.t22.wl, '', ['Square law turned round, with $\\mu_pC_{ox}$.', '$\\frac WL = \\frac{2I_D}{\\mu_pC_{ox}|V_{ov}|^2}$'], ['$$\\frac{2(0.5\\,\\text{m})}{38.36\\,\\mu\\times0.35^2}$$']),
          ],
          q: '(a) Step 1 found the largest allowed PMOS overdrive, $|V_{ov,p}| = 0.35$ V. What is the smallest PMOS width W (L = 0.5 µm)?', answer: ans('bank-t2q2', 'w'), unit: 'µm', tol: 0.02,
          hint: ['Each PMOS carries $I_{SS}/2$. Its overdrive may be at most 0.35 V (step 1); the width that gives exactly that overdrive is the smallest allowed. Use the square law turned round.', '$\\frac WL = \\frac{2I_D}{\\mu_pC_{ox}|V_{ov}|^2}$, $W = \\frac WL\\cdot L$'],
          how: ['Each PMOS carries $$I_D = \\frac{I_{SS}}{2} = 0.5\\,\\text{mA}$$', 'Square law at the largest allowed overdrive (step 1): $$\\frac WL = \\frac{2I_D}{\\mu_pC_{ox}|V_{ov}|^2} = \\frac{2(0.5\\,\\text{m})}{38.36\\,\\mu\\times0.35^2} = 212.8$$', 'Multiply by L: $$W = 212.8\\times0.5\\,\\mu\\text{m} = 106\\,\\mu\\text{m}$$', 'Any narrower and $|V_{ov}|$ grows, the diodes pull M3’s drain down, and M3 enters triode.'],
          calc: [{ what: 'W in µm in one line', keys: '2 × 0.5m ÷ ( 38.36µ × 0.35 [x²] ) × 0.5 [EXE]', shows: '106.4', note: PFX }] },
        say: '$W/L$ = 212.8, so W = 106 µm.' },
      { t: 23, title: '(b) **Floor: M4’s fence.** The output is M4’s drain, its gate is at $V_b$.', tex: 'V_{out,min} = V_b - V_{thn} = 1.4 - 0.7 = 0.7\\,\\mathrm{V}',
        try: { q: '(b) Lowest output voltage?', answer: ans('bank-t2q2', 'vmin'), unit: 'V', tol: 0.01,
          hint: ['The output is the drain of the NMOS cascode M4, whose gate is at $V_b$. Its saturation fence sets the floor.', '$V_{out,min} = V_b - V_{thn}$'],
          how: ['M4’s gate is fixed at $V_b = 1.4$ V and its drain is the output.', 'NMOS fence: the drain may be at most $V_{thn}$ below the gate: $$V_{out,min} = V_b - V_{thn} = 1.4 - 0.7 = 0.7\\,\\text{V}$$'] },
        say: '0.7 V.' },
      { t: 30, title: '**Ceiling: two candidates, the lower wins.** The PMOS stack allows $V_{DD} - |V_{thp}| - 2|V_{ov,p}| = 1.5$ V, but M2’s gate is on the output: M2 leaves saturation above $V_b - V_{GS4} + V_{thn}$.', tex: 'V_{out,max} = \\min(1.5,\\; 1.4 - 0.893 + 0.7) = 1.207\\,\\mathrm{V}',
        try: {
          parts: [
            pt('Ceiling allowed by the PMOS diode stack?', 1.5, 'V', ['The diode tax: a whole $|V_{thp}|$ plus the two PMOS overdrives below $V_{DD}$.', '$V_{DD} - |V_{thp}| - 2|V_{ov,p}|$'], ['$$3 - 0.8 - 2(0.35)$$']),
            pt('$V_{GS4}$ of the NMOS cascode (0.5 mA, W/L = 200)?', NUM.vgsn, 'V', ['Square law for the overdrive, plus the threshold.', '$V_{GS4} = V_{thn} + \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}}$'], [`$$0.7 + \\sqrt{\\frac{2(0.5\\,\\text{m})}{134.28\\,\\mu\\times200}} = 0.7 + ${fx(NUM.vovn, 3)}$$`]),
          ],
          q: '(b) Highest output voltage? (M2’s gate is tied to the output; from (a), $|V_{ov,p}| = 0.35$ V.)', answer: ans('bank-t2q2', 'vmax'), unit: 'V', tol: 0.02,
          hint: ['Two ceilings: the PMOS diode stack (M6, M8) and M2’s fence. M2’s drain is one $V_{GS4}$ below $V_b$; its gate is the output and may be at most $V_{thn}$ above that drain. The lower ceiling wins.', '$V_{out,max} = \\min(V_{DD} - |V_{thp}| - 2|V_{ov,p}|,\\;V_b - V_{GS4} + V_{thn})$, $V_{GS4} = V_{thn} + \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}}$'],
          how: ['Ceiling from the PMOS stack (overdrive 0.35 V from (a)): $$V_{DD} - |V_{thp}| - 2|V_{ov,p}| = 3 - 0.8 - 2(0.35) = 1.5\\,\\text{V}$$', 'M4 at 0.5 mA, W/L = 200: $$V_{GS4} = 0.7 + \\sqrt{\\frac{2(0.5\\,\\text{m})}{134.28\\,\\mu\\times200}} = 0.7 + 0.193 = 0.893\\,\\text{V}$$', 'M2’s fence (gate = output, drain $V_b - V_{GS4}$): $$V_b - V_{GS4} + V_{thn} = 1.4 - 0.893 + 0.7 = 1.207\\,\\text{V}$$', 'The lower ceiling binds: $V_{out,max} = 1.21$ V. The window is only about half a volt.'] },
        say: 'The buffer fence on M2 wins: 1.21 V. The window is only half a volt.' },
      { t: 39, title: '(c) **Gain by two looks**: down into the NMOS cascode M4 on M2, up into the PMOS cascode M6 on M8; each is about $g_mr_O\\cdot r_O$.', tex: 'A_v = g_{m1}(g_{m4}r_{O4}r_{O2}\\parallel g_{m6}r_{O6}r_{O8}) = 5.18\\,\\mathrm{mS}\\,(2.07\\,\\mathrm{M\\Omega}\\parallel 286\\,\\mathrm{k\\Omega}) \\approx 1301',
        try: {
          parts: [
            pt('$g_{m1}$ (= $g_{m4}$) of the NMOS (0.5 mA, $V_{ov} = 0.193$ V)?', NUM.t22.gm1, 'S', ['Fastest $g_m$: current and overdrive.', '$g_m = \\frac{2I_D}{V_{ov}}$'], [`$$\\frac{2(0.5\\,\\text{m})}{${fx(NUM.vovn, 4)}}$$`]),
            pt('$r_O$ of each NMOS (0.5 mA, $\\lambda_n = 0.1$ V⁻¹)?', NUM.t22.roN, 'Ω', ['From channel-length modulation.', '$r_O = \\frac{1}{\\lambda I_D}$'], ['$$\\frac{1}{0.1\\times0.5\\,\\text{m}}$$']),
            pt('Look down: $R_{down} = g_{m4}r_{O4}r_{O2}$?', NUM.t22.rdown, 'Ω', ['NMOS cascode M4 on M2.', '$R_{down} = g_{m4}r_{O4}r_{O2}$'], [`$$${mS(NUM.t22.gm1)}\\,\\text{m}\\times(20\\,\\text{k})^2$$`]),
            pt('$g_{m6}$ of the PMOS (0.5 mA, $|V_{ov}| = 0.35$ V)?', NUM.t22.gm6, 'S', ['Same formula, PMOS overdrive.', '$g_m = \\frac{2I_D}{|V_{ov}|}$'], ['$$\\frac{2(0.5\\,\\text{m})}{0.35}$$']),
            pt('$r_O$ of each PMOS (0.5 mA, $\\lambda_p = 0.2$ V⁻¹)?', NUM.t22.roP, 'Ω', ['Same formula, PMOS λ.', '$r_O = \\frac{1}{\\lambda_p I_D}$'], ['$$\\frac{1}{0.2\\times0.5\\,\\text{m}}$$']),
            pt('Look up: $R_{up} = g_{m6}r_{O6}r_{O8}$?', NUM.t22.rup, 'Ω', ['PMOS cascode M6 on M8.', '$R_{up} = g_{m6}r_{O6}r_{O8}$'], [`$$${mS(NUM.t22.gm6)}\\,\\text{m}\\times(10\\,\\text{k})^2$$`]),
          ],
          q: '(c) Open-loop gain $A_v$? All devices carry 0.5 mA; NMOS $V_{ov} = 0.193$ V, PMOS (minimum width from (a)) $|V_{ov}| = 0.35$ V.', answer: ans('bank-t2q2', 'av'), unit: '', tol: 0.03,
          hint: ['$G_m = g_{m1}$. Look down from the output into the NMOS cascode (M4 on M2) and up into the PMOS cascode (M6 on M8). NMOS: $V_{ov} = 0.193$ V; PMOS: $|V_{ov}| = 0.35$ V; all at 0.5 mA.', '$A_v = g_{m1}(g_{m4}r_{O4}r_{O2}\\parallel g_{m6}r_{O6}r_{O8})$, $g_m = \\frac{2I_D}{V_{ov}}$, $r_O = \\frac{1}{\\lambda I_D}$'],
          how: ['NMOS (0.5 mA, $V_{ov} = 0.193$ V): $$g_{m1} = g_{m4} = \\frac{2(0.5\\,\\text{m})}{0.193} = 5.18\\,\\text{mS},\\;\\; r_{ON} = \\frac{1}{0.1\\times0.5\\,\\text{m}} = 20\\,\\text{k}\\Omega$$', 'PMOS (0.5 mA, $|V_{ov}| = 0.35$ V): $$g_{m6} = \\frac{2(0.5\\,\\text{m})}{0.35} = 2.86\\,\\text{mS},\\;\\; r_{OP} = \\frac{1}{0.2\\times0.5\\,\\text{m}} = 10\\,\\text{k}\\Omega$$', 'Two looks: $$R_{down} = 5.18\\,\\text{m}\\times(20\\,\\text{k})^2 = 2.07\\,\\text{M}\\Omega,\\;\\; R_{up} = 2.86\\,\\text{m}\\times(10\\,\\text{k})^2 = 286\\,\\text{k}\\Omega$$', '$$A_v = 5.18\\,\\text{mS}\\times(2.07\\,\\text{M}\\parallel286\\,\\text{k}) = 5.18\\,\\text{mS}\\times251\\,\\text{k}\\Omega \\approx 1301$$'],
          calc: [{ what: 'Store g_m1 = 2I/V_ov, then both looks', keys: '1m ÷ 0.19297 [VARIABLE] ▸ A ▸ Store; then [SHIFT][4] × ( ( [SHIFT][4] × 20k [x²] ) [SHIFT][^] + ( 1m ÷ 0.35 × 10k [x²] ) [SHIFT][^] ) [SHIFT][^] [EXE]', shows: '1301', note: '[SHIFT][4] recalls A. ' + PFX }] },
        say: 'About 1300.' },
      { t: 47, ans: true, title: '**Answers:** W ≈ 106 µm · output from 0.7 V to 1.21 V · gain ≈ 1300', say: 'Exactly the diode tax and the buffer window from the background scenes, now with numbers.' },
    ],
  });
}, { q: 'Tutorial 2 Q2' });

scene(CQ, '2023 mid-sem Q3: design a high-swing telescopic', 80, (S) => {
  pyqFrame(S, {
    tag: 'LEC 6 · PAST PAPER', title: 'Sizes, bias limits and gain from the specs', src: 'Mid-sem 2023-24 Q3 · 14 marks', paper: 'm23q3',
    q: 'PMOS-input telescopic (tail M9, inputs M1, M2, PMOS cascodes M3, M4 with gate $V_{b2}$, NMOS cascodes M5, M6 with gate $V_{b1}$, NMOS sources M7, M8). All PMOS one size, all NMOS one size. SR = 5 V/µs into 10 pF; $V_{out,max}$ = 1.28 V, $V_{out,min}$ = 0.3 V. Find the sizes, $V_{b1,min}$, $V_{b2,max}$, $V_{b3}$ (tail gate) and the gain.', giv: '$V_{DD}$ = 2 V, $\\mu_nC_{ox}$ = 100, $\\mu_pC_{ox}$ = 50 µA/V², $V_{thn}$ = 0.3 V, $|V_{thp}|$ = 0.4 V, $\\lambda_n$ = 0.1, $\\lambda_p$ = 0.2 V⁻¹', qh: 260,
    tests: 'the design order: slew rate → current; floor → NMOS overdrive; ceiling → PMOS overdrive (the tail carries twice the side current); bias limits by checks and links; two-look gain.',
    fig: paperFig('m23q3f', [], 500),
    steps: [
      { t: 6, title: '**Slew rate sets the current**: the tail charges $C_L$, so $I_{SS} = SR\\cdot C_L$; each side gets half.', tex: 'I_{SS} = 5\\,\\mathrm{V/\\mu s}\\times10\\,\\mathrm{pF} = 50\\,\\mu\\mathrm{A},\\quad I_D = 25\\,\\mu\\mathrm{A}',
        try: { q: 'Start with the current. The output must slew at 5 V/µs into $C_L$ = 10 pF. What tail current $I_{SS}$ is needed?', answer: 50e-6, unit: 'A', tol: 0.01,
          hint: ['When the amplifier slews, the whole tail current charges the load capacitor, so the slew rate is that current over $C_L$.', '$SR = \\frac{I_{SS}}{C_L} \\Rightarrow I_{SS} = SR\\cdot C_L$'],
          how: ['During slewing one side is off and the full tail current flows into $C_L$: $$SR = \\frac{I_{SS}}{C_L}$$', 'Turn it round: $$I_{SS} = SR\\cdot C_L = (5\\times10^{6}\\,\\text{V/s})(10\\times10^{-12}\\,\\text{F}) = 50\\,\\mu\\text{A}$$', 'Each side then carries $I_D = 25\\,\\mu$A.'],
          why: '5 V/µs is $5\\times10^6$ V/s: convert before multiplying, or you lose a factor of a million.',
          calc: [{ what: 'SR × C_L', keys: '5M × 10p [EXE]', shows: '50µ', note: 'With Engineer Symbol on, type M and p from [CATALOG] ▸ Engineer Symbol.' }] },
        say: '$I_{SS}$ = 5 V/µs × 10 pF = 50 µA: 25 µA per side.' },
      { t: 12, title: '**Floor → NMOS size.** Under the output stand two NMOS (M6 on M8); the 0.3 V floor is their two overdrives. Then the square law at 25 µA.', tex: 'V_{ov,N} = \\frac{0.3}{2} = 0.15\\,\\mathrm{V},\\quad \\left(\\tfrac WL\\right)_N = \\frac{2(25\\,\\mu)}{100\\,\\mu\\,(0.15)^2} = 22.2',
        try: {
          parts: [
            pt('NMOS overdrive $V_{ov,N}$ (the floor is two NMOS overdrives)?', 0.15, 'V', ['Under the output: cascode M6 and source M8, one overdrive each.', '$V_{out,min} = 2V_{ov,N}$'], ['$$\\frac{0.3}{2}$$']),
          ],
          q: 'Size the NMOS from the output floor $V_{out,min}$ = 0.3 V (each side carries $I_D = 25\\,\\mu$A from step 1). What is $(W/L)_N$?', answer: ans('pyq-m23-q3', 'wlN'), unit: '', tol: 0.02,
          hint: ['Below the output stand two NMOS, the cascode M6 and the source M8; the 0.3 V floor is their two overdrives. Each carries 25 µA (step 1).', '$V_{out,min} = 2V_{ov,N}$, $\\frac WL = \\frac{2I_D}{\\mu_nC_{ox}V_{ov,N}^2}$'],
          how: ['From step 1, each side carries $I_D = 25\\,\\mu$A.', 'The floor is two NMOS overdrives: $$V_{ov,N} = \\frac{0.3}{2} = 0.15\\,\\text{V}$$', 'Square law turned round: $$\\left(\\frac WL\\right)_N = \\frac{2I_D}{\\mu_nC_{ox}V_{ov,N}^2} = \\frac{2(25\\,\\mu)}{100\\,\\mu\\times0.15^2} = 22.2$$'] },
        say: '22.2.' },
      { t: 21, title: '**Ceiling → PMOS size.** Above the output: M4, M2 (one $|V_{ov}|$ each) and the tail M9, which carries 50 µA and so needs $\\sqrt2|V_{ov}|$ at the same size. They share $2 - 1.28 = 0.72$ V.', tex: '|V_{ov,P}| = \\frac{0.72}{2 + \\sqrt2} = 0.211\\,\\mathrm{V},\\quad \\left(\\tfrac WL\\right)_P = \\frac{2(25\\,\\mu)}{50\\,\\mu\\,(0.211)^2} = 22.5',
        try: {
          parts: [
            pt('PMOS overdrive $|V_{ov,P}|$ (M4, M2 one each, the tail $\\sqrt2$ times)?', NUM.m23.vovP, 'V', ['They share $V_{DD} - V_{out,max} = 0.72$ V; the tail carries double current, so $\\sqrt2$ times the overdrive.', '$0.72 = (2 + \\sqrt2)|V_{ov,P}|$'], ['$$|V_{ov,P}| = \\frac{2 - 1.28}{2 + \\sqrt2}$$']),
          ],
          q: 'Now size the PMOS from the output ceiling $V_{out,max}$ = 1.28 V ($I_D = 25\\,\\mu$A per side, $I_{SS} = 50\\,\\mu$A in the tail). What is $(W/L)_P$?', answer: ans('pyq-m23-q3', 'wlP'), unit: '', tol: 0.02,
          hint: ['Above the output stand three PMOS: cascode M4, input M2, tail M9. They share $V_{DD} - V_{out,max}$. The tail carries 50 µA, twice the side current, so with the same W/L its overdrive is $\\sqrt2$ times larger.', '$V_{DD} - V_{out,max} = (2 + \\sqrt2)|V_{ov,P}|$, $\\frac WL = \\frac{2I_D}{\\mu_pC_{ox}|V_{ov,P}|^2}$'],
          how: ['Room above the output: $$V_{DD} - V_{out,max} = 2 - 1.28 = 0.72\\,\\text{V}$$', 'M4 and M2 take one $|V_{ov,P}|$ each; the tail (double current, $V_{ov} \\propto \\sqrt{I}$) takes $\\sqrt2|V_{ov,P}|$: $$|V_{ov,P}| = \\frac{0.72}{2 + \\sqrt2} = 0.211\\,\\text{V}$$', 'Square law at 25 µA: $$\\left(\\frac WL\\right)_P = \\frac{2(25\\,\\mu)}{50\\,\\mu\\times0.211^2} = 22.5$$'],
          calc: [{ what: 'Overdrive and size in one line', keys: '2 × 25µ ÷ ( 50µ × ( 0.72 ÷ ( 2 + [√] 2 ) ) [x²] ) [EXE]', shows: '22.49', note: 'Close the √ with ▶. ' + PFX }] },
        say: '22.5: both types end up the same size.' },
      { t: 31, title: '$V_{b1,min}$: **M7 at its edge** puts M5’s source at $V_{ov,N}$ (a check); M5’s gate $V_{b1}$ is one $V_{GS5}$ higher (a link).', tex: 'V_{b1,min} = V_{ov7} + V_{GS5} = 0.15 + (0.3 + 0.15) = 0.6\\,\\mathrm{V}',
        try: {
          parts: [
            pt('$V_{GS5}$ of the NMOS cascode?', 0.45, 'V', ['Threshold + overdrive.', '$V_{GS5} = V_{thn} + V_{ov,N}$'], ['$$0.3 + 0.15$$']),
          ],
          q: 'Lowest allowed $V_{b1}$ (gate of the NMOS cascodes M5, M6)? From the floor step: $V_{ov,N} = 0.15$ V.', answer: ans('pyq-m23-q3', 'vb1'), unit: 'V', tol: 0.01,
          hint: ['The bottom source M7 needs $V_{ov,N}$ (a check); M5’s gate sits one $V_{GS5}$ above M5’s source (a link).', '$V_{b1,min} = V_{ov7} + V_{GS5}$, $V_{GS5} = V_{thn} + V_{ov,N}$'],
          how: ['$$V_{GS5} = V_{thn} + V_{ov,N} = 0.3 + 0.15 = 0.45\\,\\text{V}$$', 'M7 at its edge puts M5’s source at $V_{ov7} = 0.15$ V; add the link: $$V_{b1,min} = 0.15 + 0.45 = 0.6\\,\\text{V}$$'] },
        say: '0.6 V.' },
      { t: 39, title: '$V_{b2,max}$: walk down from $V_{DD}$. **Tail check** ($\\sqrt2|V_{ov,P}|$), **M2’s check** ($|V_{ov,P}|$), then the **link** $|V_{GS4}|$ down to M4’s gate.', tex: 'V_{b2,max} = 2 - 0.298 - 0.211 - (0.4 + 0.211) = 0.88\\,\\mathrm{V}',
        try: {
          parts: [
            pt('Overdrive of the tail M9 ($\\sqrt2|V_{ov,P}|$)?', NUM.m23.tail, 'V', ['Double current at the same size: overdrive grows by $\\sqrt2$.', '$|V_{ov9}| = \\sqrt2\\,|V_{ov,P}|$'], ['$$1.414\\times0.211$$']),
            pt('$|V_{GS4}|$ of the PMOS cascode?', NUM.m23.vgs4, 'V', ['Threshold + overdrive.', '$|V_{GS4}| = |V_{thp}| + |V_{ov,P}|$'], ['$$0.4 + 0.211$$']),
          ],
          q: 'Highest allowed $V_{b2}$ (gate of the PMOS cascodes M3, M4) before M2 leaves saturation? From the ceiling step: $|V_{ov,P}| = 0.211$ V (tail $\\sqrt2$ times that).', answer: ans('pyq-m23-q3', 'vb2'), unit: 'V', tol: 0.02,
          hint: ['Walk down from $V_{DD}$: the tail M9 needs $\\sqrt2|V_{ov,P}|$, M2 needs $|V_{ov,P}|$ (two checks) — that is M4’s source at its highest. M4’s gate sits one $|V_{GS4}|$ lower (a link).', '$V_{b2,max} = V_{DD} - \\sqrt2|V_{ov,P}| - |V_{ov,P}| - |V_{GS4}|$'],
          how: ['Tail check: $$\\sqrt2|V_{ov,P}| = 1.414\\times0.211 = 0.298\\,\\text{V}$$', 'Link through M4: $$|V_{GS4}| = |V_{thp}| + |V_{ov,P}| = 0.4 + 0.211 = 0.611\\,\\text{V}$$', '$$V_{b2,max} = 2 - 0.298 - 0.211 - 0.611 = 0.88\\,\\text{V}$$'] },
        say: '0.88 V.' },
      { t: 47, title: '$V_{b3}$ **biases the tail M9** at 50 µA: its gate sits one $|V_{GS9}|$ below $V_{DD}$, with $|V_{ov9}| = \\sqrt2|V_{ov,P}|$.', tex: 'V_{b3} = V_{DD} - (|V_{thp}| + |V_{ov9}|) = 2 - (0.4 + 0.298) = 1.30\\,\\mathrm{V}',
        try: {
          parts: [
            pt('$|V_{ov9}|$ of the tail (50 µA, $(W/L)_P = 22.5$)?', NUM.m23.vov9, 'V', ['Square law at the tail current.', '$|V_{ov9}| = \\sqrt{\\frac{2I_{SS}}{\\mu_pC_{ox}(W/L)_P}}$'], ['$$\\sqrt{\\frac{2(50\\,\\mu)}{50\\,\\mu\\times22.5}}$$']),
          ],
          q: 'What tail gate bias $V_{b3}$ gives $I_{SS}$ = 50 µA? (M9 has the PMOS size, $(W/L)_P = 22.5$.)', answer: ans('pyq-m23-q3', 'vb3'), unit: 'V', tol: 0.02,
          hint: ['M9 is a PMOS with its source on $V_{DD}$, carrying 50 µA at the PMOS size: its gate is one $|V_{GS9}|$ below the supply.', '$V_{b3} = V_{DD} - |V_{thp}| - |V_{ov9}|$, $|V_{ov9}| = \\sqrt{\\frac{2I_{SS}}{\\mu_pC_{ox}(W/L)_P}}$'],
          how: ['Square law at 50 µA with $(W/L)_P = 22.5$: $$|V_{ov9}| = \\sqrt{\\frac{2(50\\,\\mu)}{50\\,\\mu\\times22.5}} = 0.298\\,\\text{V}$$', '$$|V_{GS9}| = 0.4 + 0.298 = 0.698\\,\\text{V}$$', '$$V_{b3} = V_{DD} - |V_{GS9}| = 2 - 0.698 = 1.30\\,\\text{V}$$'] },
        say: '1.3 V.' },
      { t: 54, title: '**Gain by two looks**: up into the PMOS cascode (M4 on M2), down into the NMOS cascode (M6 on M8); each about $g_mr_O^2$.', tex: 'A_v = g_{m2}(g_{m4}r_{OP}^2 \\parallel g_{m6}r_{ON}^2) = 0.237\\,\\mathrm{mS}\\,(9.48\\,\\mathrm{M\\Omega}\\parallel 53.3\\,\\mathrm{M\\Omega}) = 1909',
        try: {
          parts: [
            pt('$g_{m2}$ (= $g_{m4}$) of the PMOS (25 µA, $|V_{ov}| = 0.211$ V)?', NUM.m23.gm2, 'S', ['Fastest $g_m$.', '$g_m = \\frac{2I_D}{|V_{ov}|}$'], ['$$\\frac{2(25\\,\\mu)}{0.211}$$']),
            pt('$g_{m6}$ of the NMOS (25 µA, $V_{ov} = 0.15$ V)?', NUM.m23.gm6, 'S', ['Same formula.', '$g_m = \\frac{2I_D}{V_{ov}}$'], ['$$\\frac{2(25\\,\\mu)}{0.15}$$']),
            pt('$r_{OP}$ (25 µA, $\\lambda_p = 0.2$ V⁻¹)?', NUM.m23.roP, 'Ω', ['Channel-length modulation.', '$r_O = \\frac{1}{\\lambda I_D}$'], ['$$\\frac{1}{0.2\\times25\\,\\mu}$$']),
            pt('$r_{ON}$ (25 µA, $\\lambda_n = 0.1$ V⁻¹)?', NUM.m23.roN, 'Ω', ['Same formula, NMOS λ.', '$r_O = \\frac{1}{\\lambda I_D}$'], ['$$\\frac{1}{0.1\\times25\\,\\mu}$$']),
            pt('Look up: $g_{m4}r_{OP}^2$ (PMOS cascode M4 on M2)?', NUM.m23.lookP, 'Ω', ['Cascode: $g_mr_O$ times the $r_O$ under it.', '$R_{up} = g_{m4}r_{O4}r_{O2}$'], ['$$0.237\\,\\text{m}\\times(200\\,\\text{k})^2$$']),
            pt('Look down: $g_{m6}r_{ON}^2$ (NMOS cascode M6 on M8)?', NUM.m23.lookN, 'Ω', ['Same rule.', '$R_{down} = g_{m6}r_{O6}r_{O8}$'], ['$$0.333\\,\\text{m}\\times(400\\,\\text{k})^2$$']),
          ],
          q: 'Open-loop gain $A_v$? From above: $I_D = 25\\,\\mu$A per side, $V_{ov,N} = 0.15$ V, $|V_{ov,P}| = 0.211$ V.', answer: ans('pyq-m23-q3', 'av'), unit: '', tol: 0.03,
          hint: ['$G_m = g_{m2}$. Up: PMOS cascode M4 on input M2. Down: NMOS cascode M6 on source M8. Each look is $g_mr_O\\cdot r_O$; all devices carry 25 µA.', '$A_v = g_{m2}(g_{m4}r_{OP}^2\\parallel g_{m6}r_{ON}^2)$, $g_m = \\frac{2I_D}{V_{ov}}$, $r_O = \\frac{1}{\\lambda I_D}$'],
          how: ['Transconductances (overdrives from the sizing steps): $$g_{m2} = g_{m4} = \\frac{2(25\\,\\mu)}{0.211} = 0.237\\,\\text{mS},\\;\\; g_{m6} = \\frac{2(25\\,\\mu)}{0.15} = 0.333\\,\\text{mS}$$', '$$r_{OP} = \\frac{1}{0.2\\times25\\,\\mu} = 200\\,\\text{k}\\Omega,\\;\\; r_{ON} = \\frac{1}{0.1\\times25\\,\\mu} = 400\\,\\text{k}\\Omega$$', 'The two looks: $$g_{m4}r_{OP}^2 = 9.48\\,\\text{M}\\Omega,\\;\\; g_{m6}r_{ON}^2 = 53.3\\,\\text{M}\\Omega$$', '$$A_v = 0.237\\,\\text{mS}\\times(9.48\\,\\text{M}\\parallel53.3\\,\\text{M}) = 0.237\\,\\text{mS}\\times8.05\\,\\text{M}\\Omega = 1909$$'],
          calc: [{ what: 'Store g_m2, then both looks', keys: '50µ ÷ 0.21088 [VARIABLE] ▸ A ▸ Store; then [SHIFT][4] × ( ( [SHIFT][4] × 200k [x²] ) [SHIFT][^] + ( 0.333m × 400k [x²] ) [SHIFT][^] ) [SHIFT][^] [EXE]', shows: '1909', note: '[SHIFT][4] recalls A; type 0.33333m (or 50µ ÷ 0.15) for the NMOS g_m. ' + PFX }] },
        say: 'About 1900.' },
      { t: 62, ans: true, title: '**Answers:** $(W/L)_P ≈ 22.5$, $(W/L)_N ≈ 22.2$ · $V_{b1,min}$ = 0.6 V · $V_{b2,max}$ = 0.88 V · $V_{b3}$ = 1.3 V · gain ≈ 1909', say: 'Specs to sizes in a fixed order: current, floor, ceiling, biases, gain.' },
    ],
  });
}, { q: 'Mid-sem 2023 Q3' });
moveScenesBefore(['Tutorial 2 Q2: the diode-stack telescopic, every part', '2023 mid-sem Q3: design a high-swing telescopic'], 'How to attack any Lec 6 question');
