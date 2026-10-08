/* Slew rate, part 2 (after the Lec 14 slewing scenes): which current fills which capacitor, for every op amp, then a harder ladder. */
'use strict';

scene(L14, 'Slew rate for every op amp: which current, which capacitor', 66, (S) => {
  header(S, 'SLEW RATE · THE WHOLE PICTURE', 'Always: the most current available ÷ the capacitor it has to fill');
  const cards = [
    ['5-T OTA', 'I_{SS}\\;\\to\\;C_L', 'SR = \\frac{I_{SS}}{C_L}', 'one side off: the tail empties into C_L', C.n, 6],
    ['Telescopic (fully diff.)', '\\tfrac{I_{SS}}{2}\\;\\to\\;\\text{each } C_L', '\\text{each } \\frac{I_{SS}}{2C_L},\\;\\text{diff. } \\frac{I_{SS}}{C_L}', 'top sources keep pushing I_SS/2', C.p, 16],
    ['Folded cascode', '\\min(I_P, I_{SS})', 'SR = \\frac{\\min(I_P,\\,I_{SS})}{C_L}', 'need I_P ≥ I_SS or I_P limits', C.amb, 28],
    ['Two-stage (Miller)', 'I_5\\to C_c,\\;\\; I_7 - I_5\\to C_L', 'SR = \\min\\left(\\frac{I_5}{C_c},\\frac{I_7 - I_5}{C_L}\\right)', 'Lec 17: the tail fills C_c', C.ok, 40],
  ];
  cards.forEach(([name, flow, f, note, col, t0], i) => {
    const x = 70 + (i % 2) * 740, y = 140 + Math.floor(i / 2) * 330;
    const g = S.g();
    S.el('rect', { x, y, width: 700, height: 300, rx: 18, fill: 'rgba(255,255,255,0.025)', stroke: col, 'stroke-width': 2.4 }, g);
    txt(S, x + 24, y + 44, name, { size: 26, color: col, weight: 800 }, g);
    eq(S, flow, x + 350, y + 105, { size: 26, w: 660, color: '#cbd5e1' }, g);
    eq(S, f, x + 350, y + 185, { size: 32, w: 660, color: '#ffd38a' }, g);
    txt(S, x + 350, y + 262, note, { size: 19, color: C.muted, anchor: 'middle' }, g);
    g.style.opacity = 0; S.pop(g, t0, 0.7);
  });
  S.say(0.3, 'You have now seen slewing in four op amps. They all follow one sentence: the slew rate is the most current the circuit can deliver, divided by the capacitor that current has to fill.');
  S.say(6, 'Five-transistor OTA: one side of the pair turns off and the whole tail current goes into $C_L$.');
  S.say(16, 'Fully differential telescopic: each output gets $I_{SS}/2$, because the top current sources keep pushing their half. The two outputs move in opposite directions, so the difference moves at $I_{SS}/C_L$.');
  S.say(28, 'Folded cascode: the folding current $I_P$ must be at least $I_{SS}$, otherwise a branch runs dry and $I_P$ becomes the limit.');
  S.say(40, 'Two-stage Miller op amp, from Lecture 17: the tail current fills the compensation capacitor $C_c$, unless the output stage, $I_7 - I_5$, runs out filling $C_L$ first. The smaller one wins.');
  S.say(54, 'Questions only change which current and which capacitor. Find those two and you are done.');
});

scene(L14, 'Slew-rate ladder 2: telescopic, folded, two-stage', 70, (S) => {
  pyqFrame(S, {
    tag: 'SLEW RATE · PRACTICE LADDER 2 (HARDER)', title: 'Same idea, different circuits', src: 'Slew-rate ladder (Lec 14, 17)',
    q: '(a) Fully differential telescopic, $I_{SS}$ = 400 µA, $C_L$ = 1 pF on each output. (b) Folded cascode, $I_{SS}$ = 200 µA, $I_P$ = 150 µA, $C_L$ = 2 pF. (c) Two-stage: $I_5$ = 20 µA, $C_c$ = 1 pF, $I_7$ = 100 µA, $C_L$ = 5 pF.', qh: 220,
    fig: eqFigAt([['\\text{telescopic: each } \\frac{I_{SS}}{2C_L},\\;\\text{diff. } \\frac{I_{SS}}{C_L}', 270, 26, undefined, 4], ['\\text{folded: } \\frac{\\min(I_P, I_{SS})}{C_L}', 380, 28, undefined, 17], ['\\text{two-stage: } \\min\\left(\\frac{I_5}{C_c}, \\frac{I_7 - I_5}{C_L}\\right)', 490, 26, '#ffd38a', 37]]),
    per: 3,
    steps: [
      { t: 4, title: '(a) Fully steered, one side takes all of $I_{SS}$, but the top sources still push $I_{SS}/2$ each: **each output gets ±$I_{SS}/2$**.', tex: 'SR_{each} = \\frac{I_{SS}/2}{C_L} = \\frac{200\\,\\mu\\mathrm{A}}{1\\,\\mathrm{pF}} = 200\\,\\mathrm{V/\\mu s}',
        try: { parts: [{ q: 'First: how much current reaches each $C_L$ while slewing?', answer: 400e-6 / 2, unit: 'A', tol: 0.02, hint: ['Each top source keeps pushing $I_{SS}/2$; one side of the pair takes all of $I_{SS}$.'], how: ['$$|I_{C_L}| = \\frac{I_{SS}}{2} = \\frac{400\\,\\mu\\mathrm{A}}{2} = 200\\,\\mu\\mathrm{A}$$'] }],
          q: '(a) Telescopic: what is the slew rate of EACH single-ended output?', answer: 200, unit: 'V/µs', tol: 0.01, secs: 45,
          hint: ['When the pair is fully steered, one side sinks all of $I_{SS}$ and the other nothing, while each top current source keeps delivering $I_{SS}/2$. What net current reaches each $C_L$?', 'each output: $SR = \\dfrac{I_{SS}/2}{C_L}$'],
          how: ['Fully steered: one side of the pair sinks all of $I_{SS}$, the other sinks nothing. Each top PMOS source still delivers $I_{SS}/2$.',
            'The off side’s output gets $+I_{SS}/2$; the on side’s output gets $I_{SS}/2 - I_{SS} = -I_{SS}/2$. Either way $$|I_{C_L}| = \\frac{I_{SS}}{2} = \\frac{400\\,\\mu\\mathrm{A}}{2} = 200\\,\\mu\\mathrm{A}$$',
            'Each output therefore slews at $$SR = \\frac{200\\,\\mu\\mathrm{A}}{1\\,\\mathrm{pF}} = 200\\,\\mathrm{V/\\mu s}$$'] }, say: 'Each output gets half the tail: 200 over 1, 200 volts per microsecond.' },
      { t: 11, title: '(a) The two outputs ramp in **opposite directions**, so their difference moves at twice the speed: $I_{SS}/C_L$.', tex: 'SR_{diff} = 2\\cdot\\frac{I_{SS}}{2C_L} = \\frac{I_{SS}}{C_L} = \\frac{400\\,\\mu\\mathrm{A}}{1\\,\\mathrm{pF}} = 400\\,\\mathrm{V/\\mu s}',
        try: { q: '(a) What is the slew rate of the differential output $V_{out1} - V_{out2}$?', answer: 400, unit: 'V/µs', tol: 0.01, secs: 30,
          hint: ['One output rises while the other falls, both at the rate you just found.', '$SR_{diff} = 2\\times\\dfrac{I_{SS}}{2C_L} = \\dfrac{I_{SS}}{C_L}$'],
          how: ['From the last part, one output rises at 200 V/µs while the other falls at 200 V/µs.',
            'The difference changes by the sum of the two. $$SR_{diff} = 200 + 200 = 400\\,\\mathrm{V/\\mu s}$$',
            'Same thing in symbols: $$SR_{diff} = \\frac{I_{SS}}{C_L} = \\frac{400\\,\\mu\\mathrm{A}}{1\\,\\mathrm{pF}} = 400\\,\\mathrm{V/\\mu s}$$'] }, say: 'Opposite slopes add: 400.' },
      { t: 17, title: '(b) The pair pulls $I_{SS}$ from one folding branch, which only has $I_P$. With $I_P < I_{SS}$ the branch runs dry: **$I_P$ is the limit**.', tex: 'SR = \\frac{\\min(I_P, I_{SS})}{C_L} = \\frac{150\\,\\mu\\mathrm{A}}{2\\,\\mathrm{pF}} = 75\\,\\mathrm{V/\\mu s}',
        try: { q: '(b) Folded cascode with $I_P$ = 150 µA. What is its slew rate?', answer: 75, unit: 'V/µs', tol: 0.01, secs: 60,
          hint: ['Fully steered, the input pair tries to pull all of $I_{SS}$ out of one folding node. How much can that branch actually give?', '$SR = \\dfrac{\\min(I_P,\\,I_{SS})}{C_L}$'],
          how: ['Fully steered, the pair tries to pull $I_{SS}$ = 200 µA out of one folding node, but that branch only carries $I_P$ = 150 µA. Its cascode turns off.',
            'So the current available to charge $C_L$ is the smaller one. $$I = \\min(I_P, I_{SS}) = 150\\,\\mu\\mathrm{A}$$',
            'Slew rate. $$SR = \\frac{150\\,\\mu\\mathrm{A}}{2\\,\\mathrm{pF}} = 75\\,\\mathrm{V/\\mu s}$$'] }, say: 'The folding current is the limit: 150 over 2, 75.' },
      { t: 24, title: '(b) Raise **$I_P$ to at least $I_{SS}$** and the branch never runs dry: the tail current is the limit again.', tex: 'I_P \\ge I_{SS} = 200\\,\\mu\\mathrm{A}\\;\\Rightarrow\\; SR = \\frac{I_{SS}}{C_L} = \\frac{200\\,\\mu\\mathrm{A}}{2\\,\\mathrm{pF}} = 100\\,\\mathrm{V/\\mu s}',
        try: { q: '(b) The designer raises $I_P$ just enough that it no longer limits. What is the slew rate now?', answer: 100, unit: 'V/µs', tol: 0.01, secs: 45,
          hint: ['Once $I_P$ can supply everything the pair pulls, the tail current sets the slew rate.', '$I_P = I_{SS} \\;\\Rightarrow\\; SR = \\dfrac{I_{SS}}{C_L}$'],
          how: ['The folding branch stops being the limit once $$I_P \\ge I_{SS} = 200\\,\\mu\\mathrm{A}$$',
            'Then the full tail current reaches $C_L$. $$SR = \\frac{I_{SS}}{C_L} = \\frac{200\\,\\mu\\mathrm{A}}{2\\,\\mathrm{pF}} = 100\\,\\mathrm{V/\\mu s}$$'] }, say: 'Raise $I_P$ to 200 microamps and it is 100.' },
      { t: 31, title: '(c) Limit 1: in a Miller op amp the **first-stage tail $I_5$ fills $C_c$** while it slews.', tex: 'SR_1 = \\frac{I_5}{C_c} = \\frac{20\\,\\mu\\mathrm{A}}{1\\,\\mathrm{pF}} = 20\\,\\mathrm{V/\\mu s}',
        try: { q: '(c) Two-stage: what slew rate does the first stage allow, with its current charging $C_c$?', answer: 20, unit: 'V/µs', tol: 0.01, secs: 30,
          hint: ['During slewing the first stage’s whole tail current flows into the compensation capacitor.', '$SR_1 = \\dfrac{I_5}{C_c}$'],
          how: ['The second stage holds the inner end of $C_c$ almost still (it acts like a virtual ground), so all of the tail current $I_5$ charges $C_c$. $$SR_1 = \\frac{I_5}{C_c}$$',
            'Substitute. $$SR_1 = \\frac{20\\,\\mu\\mathrm{A}}{1\\,\\mathrm{pF}} = 20\\,\\mathrm{V/\\mu s}$$'] }, say: 'The tail into $C_c$: 20.' },
      { t: 37, title: '(c) Limit 2: the output stage has only **$I_7 - I_5$ left for $C_L$**. The op amp slews at the **smaller** of the two limits.', tex: 'SR_2 = \\frac{I_7 - I_5}{C_L} = \\frac{80\\,\\mu\\mathrm{A}}{5\\,\\mathrm{pF}} = 16\\,\\mathrm{V/\\mu s},\\; SR = \\min(20, 16) = 16\\,\\mathrm{V/\\mu s}',
        try: { parts: [{ q: 'First: how much of $I_7$ is left to charge $C_L$?', answer: 100e-6 - 20e-6, unit: 'A', tol: 0.02, hint: ['$I_5$ of the output current goes through $C_c$.'], how: ['$$I_7 - I_5 = 100 - 20 = 80\\,\\mu\\mathrm{A}$$'] }],
          q: '(c) What is the slew rate of the whole two-stage op amp?', answer: 16, unit: 'V/µs', tol: 0.01, secs: 75,
          hint: ['The output stage must also charge $C_L$, but part of $I_7$ is busy charging $C_c$. The op amp is only as fast as its slower part.', '$SR_2 = \\dfrac{I_7 - I_5}{C_L},\\; SR = \\min(SR_1, SR_2)$'],
          how: ['The output stage has $I_7$ in total, but $I_5$ of it flows through $C_c$. What is left for $C_L$: $$I_7 - I_5 = 100 - 20 = 80\\,\\mu\\mathrm{A}$$',
            'Limit 2, the output stage. $$SR_2 = \\frac{80\\,\\mu\\mathrm{A}}{5\\,\\mathrm{pF}} = 16\\,\\mathrm{V/\\mu s}$$',
            'The op amp can only go as fast as its slower part (limit 1 was 20 V/µs). $$SR = \\min(20, 16) = 16\\,\\mathrm{V/\\mu s}$$'],
          why: 'In a two-stage op amp always check both limits; here the output stage, not $C_c$, sets SR.' }, say: 'The output stage has only 80 microamps left for 5 picofarads: 16. The smaller wins, so the op amp slews at 16, set by the output stage this time.' },
      { t: 45, ans: true, title: '**Ladder 2:** 200 and 400 V/µs · 75 → 100 V/µs · 16 V/µs (output stage limits)', say: 'Now the real questions: Problem Set 2 P1 and Tutorial 6 Q3 next, and the two-stage mid-sem questions in the Lecture 15 to 17 lesson.' },
    ],
  });
}, { q: 'Slew-rate ladder 2' });

moveScenesBefore(['Slew rate for every op amp: which current, which capacitor', 'Slew-rate ladder 2: telescopic, folded, two-stage'], 'Problem Set 2 P1: telescopic slew rate');
