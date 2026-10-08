/* Lesson B: Problem Set 1 P10 (settling + swing capstone) from the guide, placed with the Lec 13 questions. */
'use strict';
scene(L13, 'Problem Set 1 P10: design for settling and swing', 60, (S) => {
  const gm = ans('bank-ps1p10', 'gm'), vov = ans('bank-ps1p10', 'vov'), pw = ans('bank-ps1p10', 'power');
  const tau = 20e-9 / Math.log(1000), id = gm * vov / 2;
  pyqFrame(S, {
    tag: 'LEC 13 · CAPSTONE', title: 'Topology, g_m from settling, overdrives from swing', src: 'Problem Set 1 P10',
    q: 'Fully differential op amp: gain ≥ 500, differential swing ≥ 1.2 Vpp, $C_L$ = 2 pF, settle to 0.1 % in 20 ns in unity-gain feedback, input CM = output CM. (a) Topology. (b) Required $g_{m1,2}$. (c) Overdrive of the swing-critical devices. (d) Power.', qh: 250,
    giv: 'Set B: $V_{DD} = 1.8$ V, $\\mu_nC_{ox} = 200\\,\\mu$A/V², $\\mu_pC_{ox} = 100\\,\\mu$A/V², $V_{thn} = 0.4$ V, $|V_{thp}| = 0.5$ V, $\\lambda_n = 0.05$ V⁻¹, $\\lambda_p = 0.1$ V⁻¹',
    tests: 'the closed-loop τ = 1/(βω_u) and 6.91τ for 0.1 %, the buffer window that rules out a telescopic, and headroom shared by four overdrives.',
    fig: eqFig([['\\text{gain} \\ge 500,\\quad V_{pp,diff} \\ge 1.2\\,\\mathrm V', 280, 30], ['C_L = 2\\,\\mathrm{pF},\\quad \\beta = 1', 390, 30], ['\\text{settle to } 0.1\\,\\% \\text{ in } 20\\,\\mathrm{ns}', 500, 30, '#ffd38a'], ['V_{in,CM} = V_{out,CM},\\quad V_{DD} = 1.8\\,\\mathrm V', 610, 30]]),
    steps: [
      { t: 6, title: '**(a) Choose the folded cascode.** In unity feedback the input CM equals the output CM; a telescopic would leave only a $V_{th} - V_{ov}$ window for the swing, so fold.', tex: stepTex('bank-ps1p10', 0),
        try: {
          q: '**(a)** Which topology should you choose?', choices: ['Folded cascode', 'Telescopic cascode'], answer: 0,
          hint: ['In unity-gain feedback the input CM equals the output CM. Ask: can the input device stand under an output that sits at its own gate voltage?',
            'Lec 6: a telescopic buffer only has a window of about $V_{th} - V_{ov}$; the folded cascode has no such ceiling.'],
          how: [
            'Unity-gain feedback ties the output back to the input, so the input CM equals the output CM.',
            'In a **telescopic**, the input device and its cascode stand under the output. With the output at the input’s gate voltage, only about $V_{th} - V_{ov}$ is left for the swing — far less than 0.6 V per side. ✗',
            'In a **folded cascode** the input pair is folded away: the output stack does not stand on the input device, so input CM = output CM is fine and the swing is set by four overdrives. ✓',
          ],
          why: 'Unity-gain buffer with input CM = output CM ⇒ fold.',
        },
        say: 'Folded cascode.' },
      { t: 13, title: '**(b) Settling sets $g_m$.** With $\\beta = 1$, $\\tau = 1/\\omega_u = C_L/g_m$; settling to 0.1 % needs $\\ln(1000) = 6.91$ time constants inside 20 ns.',
        tex: `\\tau \\le \\frac{t_s}{6.91} = \\frac{20\\,\\mathrm{ns}}{6.91} = ${fx(tau * 1e9, 3)}\\,\\mathrm{ns},\\; g_m \\ge \\frac{C_L}{\\tau} = \\frac{6.91\\,C_L}{t_s} = \\frac{6.91\\times 2\\,\\mathrm{pF}}{20\\,\\mathrm{ns}} = ${fx(gm * 1e3, 3)}\\,\\mathrm{mS}`,
        try: {
          q: '**(b)** Find the minimum $g_{m1,2}$ of the input pair that meets the settling spec.',
          hint: ['Settling to 0.1 % takes $\\ln(1000) = 6.91$ time constants. In unity feedback ($\\beta = 1$) the time constant is $\\tau = 1/\\omega_u$.',
            '$\\omega_u = g_m/C_L$, so $6.91\\,C_L/g_m \\le t_s$ ⇒ $g_m \\ge 6.91\\,C_L/t_s$.'],
          how: [
            'The error after time $t_s$ is $e^{-t_s/\\tau}$. For 0.1 %: $$e^{-t_s/\\tau} = 0.001,\\; t_s = \\ln(1000)\\,\\tau = 6.91\\,\\tau$$',
            `That must fit in 20 ns: $$\\tau \\le \\frac{20\\,\\mathrm{ns}}{6.91} = ${fx(tau * 1e9, 3)}\\,\\mathrm{ns}$$`,
            `With $\\beta = 1$, $\\tau = 1/\\omega_u = C_L/g_m$, so $$g_m \\ge \\frac{C_L}{\\tau} = \\frac{2\\,\\mathrm{pF}}{${fx(tau * 1e9, 3)}\\,\\mathrm{ns}} = ${fx(gm * 1e3, 3)}\\,\\mathrm{mS}$$`,
          ],
          why: 'Unity feedback: $\\tau = C_L/g_m$. 0.1 % ⇒ 6.91τ, 1 % ⇒ 4.6τ.',
          calc: [{ what: 'g_m in one line (prefixes on)', keys: '[SHIFT] [log■□] 1000 × 2p ÷ 20n', shows: fx(gm * 1e6, 4) + 'µ', note: '[SHIFT] [log■□] is ln. Type p and n with [CATALOG] ▸ Engineer Symbol.' }],
          parts: [{ q: 'The largest time constant $\\tau$ that still settles to 0.1 % in 20 ns.', hint: ['0.1 % needs $\\ln(1000) = 6.91$ time constants.'], how: ['$$\\tau = \\frac{20\\,\\mathrm{ns}}{6.91}$$'], answer: tau, unit: 's', tol: 0.02 }],
          answer: gm, unit: 'S', tol: 0.02,
        },
        say: '0.69 mS.' },
      { t: 22, title: '**(c) Swing sets the overdrives.** Each output swings half of 1.2 Vpp = 0.6 V; the four devices of its stack (two above, two below) share the other 1.2 V. Equal overdrives assumed.',
        tex: `4V_{ov} = V_{DD} - V_{pp,single} = 1.8 - 0.6 = 1.2\\,\\mathrm V,\\; V_{ov} = \\frac{1.2}{4} = ${fx(vov, 3)}\\,\\mathrm V`,
        try: {
          q: '**(c)** Assume all swing-critical devices get the same overdrive. Find the overdrive that just meets the swing spec.',
          hint: ['A differential swing of 1.2 Vpp means each output swings half of it. Whatever $V_{DD}$ is left must keep the devices above and below the output saturated.',
            'In a folded cascode each output has two devices above and two below: $4V_{ov} = V_{DD} - V_{pp,single}$.'],
          how: [
            'The differential output is $V_{out1} - V_{out2}$; each side carries half the swing: $$V_{pp,single} = \\frac{1.2}{2} = 0.6\\,\\mathrm V$$',
            'The rest of the supply holds the output stack in saturation: two devices above the output and two below, one $V_{ov}$ each: $$4V_{ov} = V_{DD} - V_{pp,single} = 1.8 - 0.6 = 1.2\\,\\mathrm V$$',
            `Share it equally: $$V_{ov} = \\frac{1.2}{4} = ${fx(vov, 3)}\\,\\mathrm V$$`,
          ],
          why: 'Swing budget: $V_{DD}$ = the swing of one side + one $V_{ov}$ per device in its stack.',
          parts: [{ q: 'The peak-to-peak swing of **one** output.', hint: ['The differential swing is shared by the two outputs.'], how: ['$$V_{pp,single} = \\frac{1.2}{2}$$'], answer: 0.6, unit: 'V', tol: 0.01 }],
          answer: vov, unit: 'V', tol: 0.01,
        },
        say: '0.3 V each.' },
      { t: 30, title: `**(d) Currents and power.** $I_D = g_mV_{ov}/2 \\approx ${fx(id * 1e6, 3)}\\,\\mu$A, rounded to 100 µA ⇒ $I_{SS} = 200\\,\\mu$A; each folded cascode branch also gets $I = 100\\,\\mu$A. Gain ≈ 2300 ≫ 500.`,
        tex: `I_D = \\frac{g_mV_{ov}}{2} = \\frac{${fx(gm * 1e3, 3)}\\,\\mathrm m\\times 0.3}{2} = ${fx(id * 1e6, 3)}\\,\\mu\\mathrm A \\approx 100\\,\\mu\\mathrm A,\\; I_{SS} = 200\\,\\mu\\mathrm A,\\; P = V_{DD}(I_{SS} + 2I) = 1.8\\times(200\\,\\mu + 2\\times 100\\,\\mu) = ${fx(pw * 1e3, 3)}\\,\\mathrm{mW}`,
        try: {
          q: `**(d)** Using $g_m = ${fx(gm * 1e3, 3)}$ mS from (b) and $V_{ov} = ${fx(vov, 2)}$ V from (c), find the tail current $I_{SS}$ (round to a neat value). Give each folded cascode branch $I = 100\\,\\mu$A. Find the total power.`,
          hint: ['Each input device carries $I_{SS}/2$ and $g_m = 2I_D/V_{ov}$. The supply feeds the input pair and both cascode branches.', '$I_D = g_mV_{ov}/2$, $P = V_{DD}(I_{SS} + 2I)$.'],
          how: [
            `Current per input device from $g_m = 2I_D/V_{ov}$: $$I_D = \\frac{g_mV_{ov}}{2} = \\frac{${fx(gm * 1e3, 3)}\\,\\mathrm m\\times 0.3}{2} = ${fx(id * 1e6, 3)}\\,\\mu\\mathrm A$$`,
            'Round to 100 µA per side, so the tail is $$I_{SS} = 2I_D = 200\\,\\mu\\mathrm A$$',
            'The PMOS sources at the top feed each input device ($I_{SS}/2$) and its cascode branch ($I$); together they draw $$I_{total} = I_{SS} + 2I = 200\\,\\mu + 2(100\\,\\mu) = 400\\,\\mu\\mathrm A$$',
            `Power from the supply: $$P = V_{DD}I_{total} = 1.8\\times 400\\,\\mu = ${fx(pw * 1e3, 3)}\\,\\mathrm{mW}$$`,
          ],
          why: 'Power = $V_{DD}$ × every current that leaves the supply. The gain then comes out ≈ 2300, well above 500.',
          parts: [
            { q: 'The current $I_D$ each input device needs (before rounding).', hint: ['$g_m = 2I_D/V_{ov}$'], how: [`$$I_D = \\frac{g_mV_{ov}}{2} = \\frac{${fx(gm * 1e3, 3)}\\,\\mathrm m\\times 0.3}{2}$$`], answer: id, unit: 'A', tol: 0.03 },
            { q: 'Round $I_D$ to 100 µA. The total current drawn from $V_{DD}$, $I_{SS} + 2I$?', hint: ['$I_{SS} = 2I_D = 200\\,\\mu$A; each folded branch adds $I = 100\\,\\mu$A.'], how: ['$$I_{total} = 200\\,\\mu + 2(100\\,\\mu)$$'], answer: 400e-6, unit: 'A', tol: 0.01 },
          ],
          answer: pw, unit: 'W', tol: 0.02,
        },
        say: '0.72 mW, with a gain around 2300, comfortably above 500.' },
      { t: 38, ans: true, title: `**Answers:** (a) folded cascode · (b) $g_m \\ge ${fx(gm * 1e3, 3)}$ mS · (c) $V_{ov} = ${fx(vov, 2)}$ V · (d) $P = ${fx(pw * 1e3, 2)}$ mW`, say: 'Every spec turned into one number: settling into $g_m$, swing into overdrives, overdrives and currents into power.' },
    ],
  });
}, { q: 'Problem Set 1 P10' });
moveScenesBefore(['Problem Set 1 P10: design for settling and swing'], 'Lab 9: specs for a two-stage buffer');
