/* One more lab from the guide: Lab 3 (CS versus cascode: gain, bandwidth, GBW), placed with the other frequency labs. */
'use strict';
scene(LF, 'Lab 3: CS versus cascode, gain against bandwidth', 54, (S) => {
  pyqFrame(S, {
    tag: 'FREQUENCY · LAB QUESTION', title: 'More gain, same GBW', src: 'Lab 3 (hand calculations)',
    q: '$I_D$ = 20 µA, $V^*$ = 200 mV, $C_L$ = 1 pF, ideal loads, $V_A$ = 5 V ($r_O = V_A/I_D$). Find $g_m$, the CS gain, the cascode gain, the CS bandwidth and the GBW of both.', qh: 190,
    tests: 'gain = $g_mr_O$, a pole $1/(2\\pi r_OC_L)$, and GBW = $g_m/(2\\pi C_L)$: the cascode multiplies gain and divides bandwidth by the same factor.',
    fig: eqFigAt([['g_m = \\frac{2I_D}{V^*},\\quad r_O = \\frac{V_A}{I_D}', 280, 30, undefined, 6], ['f_{-3dB} = \\frac{1}{2\\pi R_{out}C_L},\\quad GBW = \\frac{g_m}{2\\pi C_L}', 420, 28, '#ffd38a', 23]]),
    steps: [
      { t: 6, title: '$V^*$ is defined by $g_m = 2I_D/V^*$ (it plays the role of $V_{ov}$), so **$g_m$ follows from the current alone**.', tex: 'g_m = \\frac{2I_D}{V^*} = \\frac{2(20\\,\\mu\\mathrm{A})}{0.2\\,\\mathrm{V}} = 0.2\\,\\mathrm{mS}',
        try: { q: '(a) What is the transconductance $g_m$ of the transistor?', answer: ans('bank-lab3', 'gm'), unit: 'S', tol: 0.01,
          hint: ['$V^*$ works like the overdrive in $g_m = 2I_D/V_{ov}$.', '$g_m = \\dfrac{2I_D}{V^*}$'],
          how: ['In the square-law picture $g_m = 2I_D/V_{ov}$; the lab uses $V^*$ in place of $V_{ov}$. $$g_m = \\frac{2I_D}{V^*}$$',
            'Substitute $I_D$ = 20 µA and $V^*$ = 0.2 V. $$g_m = \\frac{2\\times20\\times10^{-6}\\,\\mathrm{A}}{0.2\\,\\mathrm{V}} = 2\\times10^{-4}\\,\\mathrm{S} = 0.2\\,\\mathrm{mS}$$'] }, say: '0.2 mS.' },
      { t: 12, title: 'With an ideal load the output sees only $r_O = V_A/I_D$, so the **CS gain is $g_mr_O$**.', tex: 'r_O = \\frac{5\\,\\mathrm{V}}{20\\,\\mu\\mathrm{A}} = 250\\,\\mathrm{k\\Omega},\\; A_{CS} = g_m r_O = (0.2\\,\\mathrm{mS})(250\\,\\mathrm{k\\Omega}) = 50',
        try: { parts: [{ q: 'First: the transistor’s output resistance $r_O$?', answer: 5 / 20e-6, unit: 'Ω', tol: 0.02, hint: ['$r_O = V_A/I_D$ with $V_A$ = 5 V, $I_D$ = 20 µA.'], how: ['$$r_O = \\frac{V_A}{I_D} = \\frac{5\\,\\mathrm{V}}{20\\,\\mu\\mathrm{A}} = 250\\,\\mathrm{k\\Omega}$$'] }],
          q: '(b) What is the magnitude of the CS stage gain with an ideal current-source load?', answer: ans('bank-lab3', 'acs'), unit: '', tol: 0.01,
          hint: ['An ideal load adds nothing in parallel: the only resistance at the output is the transistor’s own $r_O$.', '$|A_{CS}| = g_m r_O,\\; r_O = \\dfrac{V_A}{I_D}$'],
          how: ['Output resistance of the transistor. $$r_O = \\frac{V_A}{I_D} = \\frac{5\\,\\mathrm{V}}{20\\,\\mu\\mathrm{A}} = 250\\,\\mathrm{k\\Omega}$$',
            'The ideal load is an open circuit for small signals, so with $g_m$ = 0.2 mS from part (a): $$|A_{CS}| = g_m r_O = 0.2\\,\\mathrm{mS}\\times250\\,\\mathrm{k\\Omega} = 50$$',
            'Shortcut: the current cancels, $g_mr_O = \\frac{2I_D}{V^*}\\cdot\\frac{V_A}{I_D} = \\frac{2V_A}{V^*} = \\frac{10}{0.2} = 50$.'] }, say: '50.' },
      { t: 18, title: 'The cascode multiplies the output resistance by about $g_mr_O$, so the **cascode gain ≈ $(g_mr_O)^2$**.', tex: 'A_{cas} \\approx (g_m r_O)^2 = 50^2 = 2500', say: 'About the square: 2500.' },
      { t: 23, title: 'The CS output node has $R_{out} = r_O$ and $C_L$: **one pole, $f_{-3dB} = 1/(2\\pi r_OC_L)$**.', tex: 'f_{-3dB} = \\frac{1}{2\\pi r_O C_L} = \\frac{1}{2\\pi(250\\,\\mathrm{k\\Omega})(1\\,\\mathrm{pF})} = 637\\,\\mathrm{kHz}',
        try: { q: '(c) What is the −3 dB bandwidth of the CS stage?', answer: ans('bank-lab3', 'fcs'), unit: 'Hz', tol: 0.02,
          hint: ['The only pole is at the output node: the resistance there with $C_L$.', '$f_{-3dB} = \\dfrac{1}{2\\pi R_{out}C_L}$, with $R_{out} = r_O$'],
          how: ['The output node has $R_{out} = r_O$ = 250 kΩ (from part b) and $C_L$ = 1 pF: one pole. $$f_{-3dB} = \\frac{1}{2\\pi r_O C_L}$$',
            'Substitute. $$f_{-3dB} = \\frac{1}{2\\pi\\times250\\times10^{3}\\times1\\times10^{-12}} = 637\\,\\mathrm{kHz}$$'],
          calc: [{ what: '1/(2π r_O C_L)', keys: '1 ÷ ( 2 × [SHIFT] [7] × 250k × 1p ) [EXE]', shows: '636.62k', note: PFX }] }, say: '637 kHz.' },
      { t: 30, title: 'Gain × bandwidth: $R_{out}$ cancels, so **GBW = $g_m/(2\\pi C_L)$**, the same for the CS and the cascode.', tex: 'GBW = g_mR_{out}\\cdot\\frac{1}{2\\pi R_{out}C_L} = \\frac{g_m}{2\\pi C_L} = \\frac{0.2\\,\\mathrm{mS}}{2\\pi(1\\,\\mathrm{pF})} = 31.8\\,\\mathrm{MHz}',
        try: { q: '(d) What is the GBW of the CS stage (and of the cascode)?', answer: ans('bank-lab3', 'fu'), unit: 'Hz', tol: 0.02,
          hint: ['Multiply the gain by the bandwidth and watch what cancels.', '$GBW = g_mR_{out}\\cdot\\dfrac{1}{2\\pi R_{out}C_L} = \\dfrac{g_m}{2\\pi C_L}$'],
          how: ['Gain times bandwidth: the output resistance cancels. $$GBW = g_mR_{out}\\cdot\\frac{1}{2\\pi R_{out}C_L} = \\frac{g_m}{2\\pi C_L}$$',
            'Substitute $g_m$ = 0.2 mS and $C_L$ = 1 pF. $$GBW = \\frac{0.2\\times10^{-3}}{2\\pi\\times1\\times10^{-12}} = 31.8\\,\\mathrm{MHz}$$',
            'Check with the CS numbers: 50 × 637 kHz = 31.8 MHz.',
            'The cascode has the same $g_m$ and $C_L$, so the same GBW: 50 times the gain, one fiftieth of the bandwidth.'] }, say: '31.8 MHz for both: the cascode has 50 times the gain and a fiftieth of the bandwidth.' },
      { t: 37, ans: true, title: '**Answers:** 0.2 mS · 50 · 2500 · 637 kHz · GBW 31.8 MHz (both)', say: 'Gain-bandwidth is fixed by $g_m$ and $C_L$; the output resistance only trades one for the other.' },
    ],
  });
}, { q: 'Lab 3' });
moveScenesBefore(['Lab 3: CS versus cascode, gain against bandwidth'], 'Lab 7: specs into numbers (g_m, dB)');
