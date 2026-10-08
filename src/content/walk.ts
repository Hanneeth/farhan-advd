/**
 * Guided walkthroughs of your handwritten lecture pages. Each step boxes one region of the scanned page
 * (x, y, w, h in % of the page width/height), says in plain words what that region means, gives the formula
 * to keep, and a one-line way to remember it. Steps follow the page from top to bottom, in lecture order.
 */
export type Box = [number, number, number, number];

export interface WalkStep {
  t: string;
  /** Boxes on the scan (the first is where the arrow points). */
  b: Box[];
  /** Plain-language explanation (RichText: **bold**, $tex$). */
  e: string;
  f?: string[];
  /** How to remember it. */
  m?: string;
  /** Lesson where this is taught (for embedding in lessons). */
  l?: string;
  /** Practice questions that use it. */
  q?: string[];
}

export interface WalkPage {
  id: string;
  lec: number;
  date: string;
  title: string;
  img: string;
  /** Default lesson for steps without their own. */
  lesson: string;
  steps: WalkStep[];
}

export const WALKS: WalkPage[] = [
  {
    id: 'lec01',
    lec: 1,
    date: '3 Aug',
    title: 'Gain and gain error',
    img: 'lec01',
    lesson: 'l1-gain',
    steps: [
      {
        t: 'The task: gain 10, error under 1%',
        b: [[0, 2, 100, 5], [12, 7, 33, 10]],
        e: 'A single transistor (the little CS stage) gives $A_v = -g_mR_D$, but $g_m$ drifts with temperature and process, so its gain is never exactly 10. The fix used for the rest of the course: put a **big, sloppy** amplifier inside **feedback**, and let two resistors set the gain.',
        f: ['A_v = -g_mR_D\\ \\text{(not accurate)}'],
        m: 'Transistors are sloppy; resistor ratios are accurate.',
      },
      {
        t: 'The feedback circuit and β',
        b: [[10, 19, 22, 13], [10, 35, 30, 21]],
        e: 'The output goes back through $R_1$ and $R_2$. That divider hands a fraction **β** of $V_{out}$ back to the − input. The second drawing is just the divider on its own: $V_f$ is the voltage across $R_2$.',
        f: ['\\beta = \\dfrac{V_f}{V_{out}} = \\dfrac{R_2}{R_1+R_2}'],
        m: 'β = "how much of the output comes back" = the bottom resistor over the total.',
      },
      {
        t: 'Ideal gain vs actual gain',
        b: [[36, 18, 56, 14]],
        e: 'If the op amp were perfect, the two inputs would be equal and the gain would be exactly $1/\\beta$. With a finite gain $A$ the real (closed-loop) gain is a little smaller.',
        f: ['A_{ideal} = \\dfrac{1}{\\beta} = 1 + \\dfrac{R_1}{R_2} = 10', 'A_{closed} = \\dfrac{A}{1+\\beta A}'],
        m: '"A over one plus βA" — the most-used formula of the op-amp chapter.',
      },
      {
        t: 'Gain error, and the exact answer',
        b: [[52, 37, 33, 22]],
        e: 'Error = how far short the real gain falls, as a fraction of the ideal. Plugging $\\beta = 1/10$ into the exact form and asking for 1% gives $A \\ge 990$ — round up to 1000.',
        f: ['\\varepsilon = \\dfrac{A_{ideal} - A_{actual}}{A_{ideal}}'],
        q: ['bank-ex91'],
      },
      {
        t: 'Simplifying ε (the three-line algebra)',
        b: [[55, 60, 45, 22]],
        e: 'Divide by $1/\\beta$, take a common denominator, and the $\\beta A$ terms cancel. What is left is beautifully simple.',
        f: ['\\varepsilon = \\dfrac{1}{1+\\beta A}'],
        m: 'Error = one over (one plus loop gain).',
      },
      {
        t: 'The shortcut every exam uses',
        b: [[55, 82, 30, 17]],
        e: 'Since $\\beta A \\gg 1$, drop the 1. Then the minimum open-loop gain is just the closed-loop gain divided by the allowed error.',
        f: ['\\varepsilon \\approx \\dfrac{1}{\\beta A}', 'A_{min} = \\dfrac{A_{closed}}{\\varepsilon} = \\dfrac{10}{0.01} = 1000'],
        m: 'Need = gain ÷ error. Gain 10 at 1% → 1000.',
        q: ['bank-ex91', 'bank-ps1p2'],
      },
    ],
  },
  {
    id: 'lec02',
    lec: 2,
    date: '5 Aug',
    title: 'Op-amp specs; one-stage op amps',
    img: 'lec02',
    lesson: 'l2-onestage',
    steps: [
      {
        t: 'The list of op-amp specs',
        b: [[25, 0, 22, 30]],
        e: 'Every op amp is judged on: **gain, bandwidth, output swing, linearity, noise, offset** (and supply rejection). The rest of the course is about trading these against each other.',
        m: 'GBS-LNO: Gain, Bandwidth, Swing, Linearity, Noise, Offset.',
        l: 'l1-other',
      },
      {
        t: 'Bandwidth: the gain-bandwidth product',
        b: [[26, 1, 38, 14]],
        e: 'A one-pole op amp is flat at $A_0$ up to $\\omega_0$, then falls 20 dB/decade and reaches gain 1 at $\\omega_u$. Gain × bandwidth stays constant — you can spend it on either.',
        f: ['\\omega_u = A_0\\,\\omega_0 = \\text{GBW}'],
        m: 'GBW is a fixed pocket of coins.',
        l: 'l1-speed',
      },
      {
        t: 'The saturation fence (margin note)',
        b: [[0, 33, 12, 5]],
        e: 'This tiny note drives **every** swing and CM-range answer: an NMOS stays saturated while its drain is no lower than one threshold below its gate.',
        f: ['V_D \\ge V_G - V_{th}'],
        m: 'Drain can drop to gate minus Vth, no further.',
        l: 'u2-pinchoff',
      },
      {
        t: 'Fully differential pair with PMOS current-source loads',
        b: [[8, 35, 37, 17]],
        e: 'Two outputs ($V_{out1}$, $V_{out2}$), PMOS M3, M4 as current sources on top, NMOS pair M1, M2 below, tail $I_{SS}$.',
      },
      {
        t: 'Its gain and input CM range',
        b: [[10, 53, 32, 13]],
        e: 'Gain: $g_m$ times what each output sees — $r_O$ up and $r_O$ down in parallel. CM floor: the tail needs $V_{ISS}$, then M1 needs its $V_{GS}$. CM ceiling: M1’s gate can rise to its drain plus $V_{th}$, and the drain sits $|V_{ov3}|$ below VDD.',
        f: ['A_v = g_{m1}(r_{O1}\\parallel r_{O3})', 'V_{in,CM}: [V_{ISS} + V_{GS1},\\; V_{DD} - |V_{ov3}| + V_{thn}]'],
        m: 'Floor = tail + VGS. Ceiling = drain + Vth.',
      },
      {
        t: 'Its output swing (and bandwidth)',
        b: [[10, 67, 45, 26], [15, 93, 22, 6]],
        e: 'Each output can rise until the PMOS is at its edge and fall until M1 is at its edge. The differential output swings **twice** as far as one side. One pole at the output.',
        f: ['\\text{swing} = 2(V_{DD} - |V_{ov3}| - V_{ov1} - V_{ISS})', 'BW = \\dfrac{1}{(r_{O2}\\parallel r_{O4})C_L}'],
        m: 'Swing = VDD minus every overdrive in the stack; differential doubles it.',
      },
      {
        t: 'The five-transistor OTA',
        b: [[48, 35, 30, 18]],
        e: 'Same pair, but the top is a **current mirror**: M3 is a diode, M4 copies it. One output. This is your mid-sem circuit.',
        l: 'u11-ota',
      },
      {
        t: 'OTA gain and CM range',
        b: [[54, 55, 36, 13]],
        e: 'The mirror adds both halves, so the gain is the same as one side of the differential version. The ceiling is lower now: M1’s drain sits a full $|V_{GS3}|$ (diode) below VDD.',
        f: ['A_v = g_{m2}(r_{O2}\\parallel r_{O4})', 'V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{th1}'],
        m: 'A diode costs a whole VGS.',
        l: 'u11-ota-range',
        q: ['bank-exam-q1', 'pyq-q24a-q1'],
      },
      {
        t: 'OTA swing and bandwidth',
        b: [[55, 72, 45, 27]],
        e: 'Single output: from $V_{ISS} + V_{ov2}$ up to $V_{DD} - |V_{ov4}|$. One pole at the output node.',
        f: ['\\text{swing} = V_{DD} - |V_{ov4}| - V_{ov2} - V_{ISS}', 'BW = \\dfrac{1}{(r_{O2}\\parallel r_{O4})C_L}'],
        l: 'u11-ota-range',
        q: ['bank-exam-q1'],
      },
    ],
  },
  {
    id: 'lec03',
    lec: 3,
    date: '7 Aug',
    title: 'Unity-gain buffer; telescopic cascode; buffer window',
    img: 'lec03',
    lesson: 'l2-buffer',
    steps: [
      {
        t: 'The 5-T OTA as a buffer',
        b: [[0, 0, 22, 7], [5, 7, 22, 13], [0, 24, 17, 6], [24, 16, 18, 16]],
        e: 'Wire the output to the − input: $\\beta = 1$. The closed-loop gain becomes $A/(1+A) \\approx 1$ because the open-loop gain is huge.',
        f: ['A_{open} = g_{mN}(r_{ON}\\parallel r_{OP}) \\approx g_{mN}\\dfrac{r_{ON}}{2}', 'A_{closed} = \\dfrac{A_{open}}{1 + A_{open}} \\approx 1'],
        m: 'Buffer: β = 1, gain ≈ 1.',
      },
      {
        t: 'What a load sees: Rout falls to 1/gm',
        b: [[28, 4, 22, 6], [13, 33, 36, 17]],
        e: 'To a load $R_L$ the closed loop looks like a source behind a small resistor. Feedback divides the open-loop $R_{out}$ by $(1 + \\beta A)$, and for the OTA buffer everything cancels to $1/g_{m2}$.',
        f: ['R_{out,closed} = \\dfrac{R_{out,open}}{1+\\beta A} \\approx \\dfrac{1}{g_{m2}}'],
        m: 'Feedback makes the output stiff: Rout ÷ loop gain.',
      },
      {
        t: 'The pole moves up to gm/CL',
        b: [[33, 12, 16, 4], [23, 43, 25, 6]],
        e: 'Open loop the pole is $1/(R_{out}C_L)$. Closed, the same $C_L$ only sees $1/g_{m2}$, so the pole jumps to $g_{m2}/C_L$ — exactly the GBW.',
        f: ['\\omega_{closed} = \\dfrac{g_{m2}}{C_L}'],
        m: 'Buffer bandwidth = GBW = gm/CL.',
        l: 'u12-poles',
        q: ['bank-exam-q1', 'bank-chat-buffer'],
      },
      {
        t: 'Telescopic cascode op amps (both versions)',
        b: [[18, 49, 46, 17]],
        e: 'Left: fully differential, every device cascoded (M1–M8, tail). Right: single-ended with a cascode **mirror** on top (M5, M7 diode-stacked). Cascoding multiplies the output resistance by $g_mr_O$.',
        l: 'u9-telescopic',
      },
      {
        t: 'Telescopic gain = (gm·rO)²/2',
        b: [[17, 67, 40, 10]],
        e: 'Looking down: $g_mr_O\\cdot r_O$. Looking up: the same. Two equal resistances in parallel halve.',
        f: ['A = g_{m}\\left[g_{m}r_{O}^2 \\parallel g_{m}r_{O}^2\\right] = \\dfrac{(g_mr_O)^2}{2}'],
        m: 'Cascode = square the intrinsic gain, then halve.',
        q: ['bank-ps1p3'],
      },
      {
        t: 'Telescopic swing (and the mirror’s extra cost)',
        b: [[17, 77, 40, 6], [55, 62, 45, 5]],
        e: 'Each stacked device eats its overdrive. In the mirror-loaded version the diode stack costs one extra $|V_{thp}|$ at the top.',
        f: ['\\text{swing}_{diff} = 2\\left[V_{DD} - (|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ISS})\\right]', '\\text{mirror version: also} - |V_{thp}|'],
        m: 'Five overdrives in the stack; a mirror adds one Vth.',
      },
      {
        t: 'Telescopic as a buffer: two fences fight',
        b: [[60, 67, 32, 21]],
        e: 'Tie $V_{out}$ to M2’s gate. **M4** needs the output high enough (①). **M2** needs its drain $X = V_{b1} - V_{GS4}$ to stay within $V_{th}$ of its gate — which is now the output (②).',
        f: ['V_{b1} - V_{th4} \\le V_{out} \\le V_{b1} - V_{GS4} + V_{th2}'],
        m: 'The output is now also a gate, so it gets a ceiling.',
        q: ['bank-t3q1', 'bank-chat-window'],
      },
      {
        t: 'The window picture',
        b: [[46, 87, 26, 13]],
        e: 'Between $V_{b1} - V_{th4}$ and $V_{b1} - V_{GS4} + V_{th2}$ there is only $V_{th} - V_{ov}$ — about half a volt. That is why telescopics make poor buffers.',
        f: ['\\text{width} = V_{th} - V_{ov4}'],
        m: 'Buffer window = Vth − Vov.',
      },
    ],
  },
  {
    id: 'lec04',
    lec: 4,
    date: '10 Aug',
    title: 'Buffer window; designing a telescopic op amp (Ex 9.7)',
    img: 'lec04',
    lesson: 'l3-design',
    steps: [
      {
        t: 'The buffer window, derived again and shaded',
        b: [[16, 0, 30, 11], [35, 8, 36, 13], [12, 14, 28, 6]],
        e: 'Same two fences as Lec 3, now drawn as a shaded band under $V_{b1}$. The output must live inside that band.',
        f: ['V_{b1} - V_{th4} \\le V_{out} \\le V_{b1} - (V_{GS4} - V_{th2})'],
        l: 'l2-buffer',
      },
      {
        t: 'The design spec and the order of work',
        b: [[2, 22, 36, 14]],
        e: 'VDD 3 V, 10 mW, gain 2000, 3 V p-p swing, $\\mu_nC_{ox}$ = 60 µ, $\\mu_pC_{ox}$ = 30 µ, $\\lambda_n$ = 0.1, $\\lambda_p$ = 0.2. Design order: **① ID ② Vov ③ W/L ④ gm ⑤ rO**.',
        m: 'I → V → W/L → gm → rO. "I Very Wisely Get Results."',
        q: ['bank-ex97'],
      },
      {
        t: '① Currents from the power budget',
        b: [[2, 34, 57, 11]],
        e: 'Total current = power ÷ supply = 3.33 mA. A little (0.33 mA) feeds the bias branch $M_{b1}$–$M_{b3}$; the rest is the tail: 1.5 mA per side.',
        f: ['I_{total} = \\dfrac{P}{V_{DD}} = 3.33\\,\\text{mA},\\quad I_{D} = 1.5\\,\\text{mA per side}'],
        m: 'Power ÷ VDD, keep a bit for bias.',
      },
      {
        t: '② Overdrives from the swing budget',
        b: [[3, 45, 68, 10]],
        e: 'Each side swings 1.5 V, so the five stacked overdrives share the other 1.5 V. Give the tail the most (0.5), PMOS 0.3 each, NMOS 0.2 each.',
        f: ['|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ov9} = 1.5\\,\\text{V}'],
        m: 'Swing budget: what the output does not use, the overdrives get.',
      },
      {
        t: '③ W/L from the square law',
        b: [[32, 54, 50, 11]],
        e: 'Solve $I_D = \\frac12\\mu C_{ox}\\frac{W}{L}V_{ov}^2$ for W/L, device by device.',
        f: ['\\dfrac{W}{L} = \\dfrac{2I_D}{\\mu C_{ox}V_{ov}^2}:\\; (W/L)_{1-4} = 1250,\\; (W/L)_{5-8} = 1111,\\; (W/L)_9 = 400'],
        m: 'W/L = 2I over µCox Vov².',
      },
      {
        t: '④⑤ Check the gain: 1428 is too low',
        b: [[28, 65, 55, 10]],
        e: '$g_m = 2I_D/V_{ov}$, $r_O = 1/(\\lambda I_D)$. Rup (PMOS) is only 111 kΩ because $\\lambda_p$ is big; Rdown is 666 kΩ. The gain comes out 1428 — short of 2000.',
        f: ['A_v = g_{m1}(R_{up}\\parallel R_{down}) = 15\\,\\text{mS}(111\\,k \\parallel 666\\,k) \\approx 1428'],
        m: 'The weak side (PMOS) decides the gain.',
      },
      {
        t: 'Fix it: double L of M5–M8',
        b: [[45, 76, 46, 24]],
        e: 'Doubling both W and L keeps W/L (so Vov and swing stay) but halves λ, so $r_O$ doubles. Rup goes to 445 kΩ and the gain reaches about 4000.',
        f: ['g_mr_O \\propto \\sqrt{\\dfrac{WL}{I_D}},\\quad \\lambda \\propto \\dfrac{1}{L}'],
        m: 'Longer device, more intrinsic gain, same overdrive.',
        q: ['bank-ex97', 'bank-t2q3', 'pyq-m23-q3'],
      },
    ],
  },
  {
    id: 'lec05',
    lec: 5,
    date: '12 Aug',
    title: 'Closed loop through capacitors; folding; folded cascode',
    img: 'lec05',
    lesson: 'l4-folding',
    steps: [
      {
        t: 'Fully differential op amp closed through capacitors (Ex 9.6)',
        b: [[0, 0, 92, 13]],
        e: 'The capacitors block DC, so the resistors tie the input CM to the output CM: **the input gates sit at the same DC level as the outputs**. In the telescopic version (right) that decides how far the outputs can swing.',
        f: ['V_{CM} = V_b - (V_{GS3,4} - V_{th1,2})'],
        m: 'Through capacitors: input CM = output CM.',
        l: 'l2-cmchoice',
      },
      {
        t: 'The folding transformation',
        b: [[10, 16, 50, 20]],
        e: 'A cascode (M1 under M2) can be **folded**: keep M2 as the cascode, but feed its source sideways from an opposite-type input device M1, and add a current source to carry both currents. The signal current still flows through M2 to the output.',
        m: 'Fold = input device turned upside down and plugged in from the side.',
      },
      {
        t: 'Folding a differential pair: ISS1 and ISS2',
        b: [[10, 36, 60, 14]],
        e: 'Do the same to a whole pair. The bottom sources $I_{SS2}$ must now carry their own branch current **plus** the folded half-tail.',
        f: ['I_{SS2} = I_{SS1} + \\dfrac{I_{SS}}{2}'],
        m: 'Bottom sources carry both: branch + half the tail.',
      },
      {
        t: 'PMOS-input folded cascode, Rup and Rdown',
        b: [[20, 50, 45, 27]],
        e: 'Looking **up**: a PMOS cascode, $g_mr_Or_O$. Looking **down**: the NMOS cascode, but its source node also has M1’s $r_O$ hanging on it, so it is $r_{O1}\\parallel r_{O9}$ under it.',
        f: ['R_{up} = g_{m5}r_{O5}r_{O7}', 'R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O9})'],
        m: 'The fold node has two rO’s in parallel.',
        l: 'l4-gain',
      },
      {
        t: 'Gm by current divider: ≈ gm1',
        b: [[25, 77, 55, 23]],
        e: 'M1’s current $g_{m1}v_{in}$ arrives at the fold node and splits: up into M3’s source (tiny, $\\approx 1/g_{m3}$) or down into $r_{O1}\\parallel r_{O9}$ (big). Almost all goes up, so $G_m \\approx g_{m1}$.',
        f: ['I_{out} = g_{m1}v_{in}\\dfrac{r_{O1}\\parallel r_{O9}}{(1/g_{m3}\\parallel r_{O3}) + (r_{O1}\\parallel r_{O9})} \\approx g_{m1}v_{in}'],
        m: 'Current takes the easy path: into the source (1/gm).',
        l: 'l4-gain',
        q: ['bank-ps1p7', 'bank-t2q3'],
      },
    ],
  },
  {
    id: 'lec06',
    lec: 6,
    date: '14 Aug',
    title: 'Folded-cascode CM range; rail-to-rail; output shorted to input; low-voltage cascode load',
    img: 'lec06',
    lesson: 'l4-folding',
    steps: [
      {
        t: 'PMOS-input folded cascode: the CM range',
        b: [[0, 1, 52, 29]],
        e: 'Top: the PMOS tail needs $|V_{ov11}|$, then M1 needs $|V_{GS1}|$. Bottom: M1’s drain is the fold node at $V_{ov9}$, and a PMOS stays saturated until its gate is $|V_{th}|$ below its drain — so the input CM can go **below ground** (your example: −0.3 V).',
        f: ['V_{in,CM,max} = V_{DD} - |V_{ov11}| - |V_{GS1}|', 'V_{in,CM,min} = V_{ov9} - |V_{thp}|'],
        m: 'PMOS input: the floor goes below ground.',
        q: ['bank-ps1p8'],
      },
      {
        t: 'NMOS-input folded cascode',
        b: [[50, 1, 49, 25]],
        e: 'Mirror image: NMOS pair folded into PMOS sources on top. The CM ceiling can go **above VDD**.',
        f: ['A_v = g_{m1}\\left[g_{m8}r_{O8}(r_{O10}\\parallel r_{O2}) \\parallel g_{m6}r_{O6}r_{O4}\\right]', 'V_{in,CM}: [V_{ov11} + V_{GS1},\\; V_{DD} - |V_{ov10}| + V_{th1}]'],
        m: 'NMOS input: the ceiling goes above VDD.',
        q: ['pyq-q23-q2'],
      },
      {
        t: 'Rail-to-rail input: both pairs at once',
        b: [[22, 31, 40, 14]],
        e: 'An NMOS pair and a PMOS pair folded into the same cascodes. Near ground the PMOS pair works, near VDD the NMOS pair works, in the middle both do: **any input CM** is fine.',
        m: 'Two pairs = one for each rail.',
        l: 'l9-slew',
      },
      {
        t: 'Output shorted to an input',
        b: [[12, 48, 55, 31]],
        e: 'Now $V_{out}$ is M2’s gate. Two fences: M4 (NMOS cascode) needs $V_{out} \\ge V_{b2} - V_{th4}$ = 0.4 V; M2 (PMOS) needs $V_{out} \\ge V_{b2} - V_{GS4} - |V_{th2}|$ = −0.3 V. The higher one binds.',
        f: ['V_{out} \\ge \\max(V_{b2} - V_{th4},\\; V_{b2} - V_{GS4} - |V_{th2}|)'],
        m: 'Write both fences, keep the stricter one.',
      },
      {
        t: 'Cascode load without the diode tax (M7, M8 gates on X)',
        b: [[35, 78, 55, 12]],
        e: 'M7 and M8 take their gates from X, the drain of cascode M5, and M5, M6 get their own bias $V_{b1}$. M5 saturated sets the lowest $V_{b1}$; M7 saturated sets $P_{max}$. In between, the output keeps the full cascode swing. (Your page writes the last line with − |Vth7|; it should be + |Vth7|.)',
        f: ['V_{b1} \\ge V_{DD} - |V_{GS7}| - |V_{th5}|', 'V_{P,max} = V_{DD} - |V_{ov7}|'],
        m: 'Top gates on X: Vb1 sits between two fences, and the |Vthp| diode tax disappears.',
        l: 'l2-onestage',
      },
      {
        t: 'Gain boosting begins',
        b: [[30, 91, 30, 9]],
        e: 'Every gain is $G_m\\times R_{out}$. Next lectures raise $R_{out}$.',
        f: ['A_v = G_mR_{out}'],
        l: 'l6-boost',
      },
    ],
  },
  {
    id: 'lec07',
    lec: 7,
    date: '17 Aug',
    title: 'Two-stage op amps; gain boosting derivations',
    img: 'lec07',
    lesson: 'l5-twostage',
    steps: [
      {
        t: 'Two-stage op amp: red = stage 1, green = stage 2',
        b: [[8, 0, 46, 13]],
        e: 'Stage 1 (red loop) is a pair with current-source loads: it makes the **gain**. Stage 2 (green) is a CS stage on each side: one device to each rail, so it makes the **swing**. Gains multiply.',
        f: ['A_1 = g_{m1,2}(r_{O1,2}\\parallel r_{O3,4}),\\; A_2 = g_{m5,6}(r_{O5,6}\\parallel r_{O7,8}),\\; A = A_1A_2'],
        m: 'High gain, then high swing.',
        q: ['bank-t3q2'],
      },
      {
        t: 'The idea in one block diagram',
        b: [[8, 13, 40, 4]],
        e: 'A cascode gives gain but eats swing; a CS stage gives swing but little gain. Put them in series and get both.',
      },
      {
        t: 'Telescopic first stage + CS second stage',
        b: [[8, 17, 47, 15], [63, 17, 35, 8]],
        e: 'Stage 1 is now a full telescopic; stage 2 is PMOS M9 with current source M11. The Bode sketch: two poles, so more gain but the phase drops faster — that is why we compensate later.',
        f: ['A_1 = g_{m1}[g_{m5}r_{O5}r_{O7}\\parallel g_{m3}r_{O3}r_{O1}],\\; A_2 = g_{m9}(r_{O9}\\parallel r_{O11})'],
        q: ['bank-t3q3'],
      },
      {
        t: 'Single-ended version',
        b: [[10, 34, 40, 12]],
        e: 'Make M11 a diode and M12 its mirror: one output with the full differential gain.',
      },
      {
        t: 'Gain boosting: why Rout, not Gm',
        b: [[10, 47, 40, 15]],
        e: '$A_v = G_m\\times R_{out}$. $G_m$ is "very hard to improve"; $R_{out}$ "needs to be improved". Stacking cascodes multiplies Rout by $g_mr_O$ each time, but costs headroom.',
        f: ['r_{O1} \\to g_{m2}r_{O2}r_{O1} \\to g_{m3}r_{O3}g_{m2}r_{O2}r_{O1}'],
        m: 'Each cascode multiplies Rout by gm·rO.',
        l: 'l6-boost',
      },
      {
        t: 'Trying to boost Gm with an amplifier: no improvement',
        b: [[3, 60, 60, 21]],
        e: 'Put an amplifier $A_1$ in front of M1 and include a source resistor $R_S$: the extra gain is eaten by the source feedback. The result is still limited by $R_S$ — "No improvement".',
        f: ['\\dfrac{I_{out}}{V_{in}} = \\dfrac{A_1g_{m2}r_{O2}}{r_{O2} + R_S + g_{m2}r_{O2}R_S}'],
        m: 'Boosting the input does not help; boost the output resistance.',
        l: 'l6-boost',
      },
      {
        t: 'Boosting Rout: the test-source derivation',
        b: [[20, 79, 80, 21]],
        e: 'Apply $V_X$, find $I_X$. The amplifier drives M2’s gate the **opposite** way to its source ($-A_1I_XR_S$), so M2 fights $(1 + A_1)$ times harder.',
        f: ['R_{out} = R_S + r_{O2} + (1 + A_1)\\,g_{m2}R_Sr_{O2}'],
        m: 'Hold the source still and Rout × (1 + A1).',
        l: 'l6-boost',
        q: ['bank-t4q1', 'pyq-m25-q1'],
      },
    ],
  },
  {
    id: 'lec08',
    lec: 8,
    date: '19 Aug',
    title: 'Gain boosting: Gm, Rout, (gm·rO)³ and three auxiliary amplifiers',
    img: 'lec08',
    lesson: 'l6-boost',
    steps: [
      {
        t: 'Gm with the amplifier sensing the source',
        b: [[2, 0, 62, 30]],
        e: 'Gate = $(V_{in} - I_{out}R_S)A_1$, source = $I_{out}R_S$. Solving: the amplifier does not rescue $G_m$ (compare the plain degenerated device, right).',
        f: ['\\dfrac{I_{out}}{V_{in}} \\approx \\dfrac{A_1g_m}{R_S + (1+A_1)g_mr_OR_S}'],
        m: 'Gm stays ≈ 1/RS-limited; target Rout instead.',
      },
      {
        t: 'Rout with boosting (repeat)',
        b: [[12, 30, 42, 8]],
        e: 'Same result as Lec 7.',
        f: ['R_{out} = R_S + r_O + (1 + A_1)g_mR_Sr_O'],
      },
      {
        t: 'Looking into the source of a boosted device',
        b: [[8, 37, 70, 10]],
        e: 'Plain device: $\\frac{R_D + r_O}{1 + g_mr_O}$. Boosted, it fights $(1+A_1)$ times harder, so the resistance is $(1+A_1)$ times **smaller**.',
        f: ['R_{in,source} = \\dfrac{R_D + r_O}{1 + (1 + A_1)g_mr_O}'],
        m: 'Up multiplies, down divides — now by (1 + A1)·gm·rO.',
        l: 'u6-rules',
      },
      {
        t: 'Boosted cascode: Gm ≈ gm1 by current divider',
        b: [[12, 45, 85, 12]],
        e: 'M2’s source looks like $\\approx 1/((1+A_1)g_{m2})$ — tiny next to $r_{O1}$. So all of M1’s current goes up. (The small box on the right is the current-divider rule.)',
        f: ['G_m = \\dfrac{I_{out}}{V_{in}} \\approx g_{m1}', 'I_{R_2} = I\\dfrac{R_1}{R_1+R_2}'],
      },
      {
        t: 'Rout and the gain ≈ (gm·rO)³',
        b: [[22, 56, 60, 9]],
        e: 'Put $R_S = r_{O1}$. With a CS auxiliary $A_1 = g_{m3}r_{O3}$ and all $g_m$, $r_O$ equal, the gain is about $(g_mr_O)^3$.',
        f: ['R_{out} \\approx (1+A_1)g_{m2}r_{O1}r_{O2}', 'A_v \\approx g_{m1}(1+A_1)g_{m2}r_{O1}r_{O2} \\approx (g_mr_O)^3'],
        m: 'Cascode = (gm·rO)², boosted cascode = (gm·rO)³.',
        q: ['bank-t4q2'],
      },
      {
        t: 'Implementation 1: a CS auxiliary (M3 + I2)',
        b: [[18, 66, 52, 14]],
        e: 'M3 watches M2’s source and drives M2’s gate. Gain $A_1 = g_{m3}r_{O3}$. **Disadvantage:** M2’s source now sits at $V_{GS3}$, not $V_{ov1}$, so the output cannot go as low.',
        f: ['A_v = g_{m1}(1 + g_{m3}r_{O3})g_{m2}r_{O2}r_{O1}', 'V_{out,min} = V_{GS3} + V_{ov2}'],
        m: 'CS auxiliary: X sits at VGS3 instead of Vov1, so it costs one Vth of swing.',
        q: ['bank-t4q1', 'pyq-m25-q1'],
      },
      {
        t: 'Implementation 2: a PMOS auxiliary',
        b: [[22, 79, 60, 9]],
        e: 'For the PMOS M3 to stay saturated, its drain (M2’s gate) cannot be more than $|V_{th3}|$ above its gate (node P). That forces $V_{GS2} \\le |V_{th3}|$ — M2 barely on. Hard to use.',
        f: ['V_{GS2} \\le |V_{th3}|'],
        q: ['bank-t4q2'],
      },
      {
        t: 'Implementation 3: a folded-cascode auxiliary',
        b: [[12, 87, 40, 13]],
        e: 'Fold the PMOS auxiliary into an NMOS cascode M4: the auxiliary is now itself a cascode with gain $g_{m3}g_{m4}r_{O4}r_{O3}$, and the headroom problem is gone.',
        f: ['A_1 = g_{m3}\\,g_{m4}r_{O4}r_{O3}'],
        q: ['pyq-m24-q4', 'bank-t4q3'],
      },
    ],
  },
  {
    id: 'lec09',
    lec: 9,
    date: '21 Aug',
    title: 'Auxiliary amplifiers; differential boosting; CMFB intro',
    img: 'lec09',
    lesson: 'l6-boost',
    steps: [
      { t: 'Folded auxiliary: its own Gm·Rout', b: [[2, 0, 58, 19]], e: 'The auxiliary is an amplifier too: $A_{aux} = G_{m,aux}R_{out,aux}$.', f: ['A_v = g_{m1}\\left[1 + g_{m3}g_{m4}r_{O4}r_{O3}\\right]g_{m2}r_{O2}r_{O1}'] },
      { t: 'Boosting a differential pair', b: [[15, 20, 65, 10]], e: 'Each cascode needs a booster ($A_1 = A_2$); since the sides move oppositely, **one differential** auxiliary can serve both.' },
      { t: 'CS-pair auxiliary and its headroom', b: [[22, 31, 40, 12]], e: 'A pair with its own tail $I_{SS1}$ as the booster costs headroom at the bottom.', f: ['V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}'] },
      { t: 'Folded-cascode auxiliary', b: [[17, 54, 75, 14]], e: 'A whole folded cascode as the booster.', f: ['A_{aux} = g_{m5}\\left[g_{m11}r_{O11}r_{O13}\\parallel g_{m7}r_{O7}(r_{O9}\\parallel r_{O5})\\right]'], q: ['pyq-m24-q4'] },
      { t: 'Both cascodes boosted', b: [[38, 70, 45, 22]], e: 'NMOS cascodes boosted by a PMOS-input folded amp (low CM), PMOS cascodes by an NMOS-input one (high CM).' },
      { t: 'Why CMFB is needed', b: [[40, 92, 58, 8]], e: 'With current-source loads each output sits between two current sources; any mismatch flows into a huge resistance, so the output CM is undefined.', m: 'Two current sources in series: nobody sets the voltage.', l: 'l7-cmfb' },
    ],
  },
  {
    id: 'lec10',
    lec: 10,
    date: '24 Aug',
    title: 'CMFB: structure, resistive and follower sensing',
    img: 'lec10',
    lesson: 'l7-cmfb',
    steps: [
      { t: 'Any two inputs = CM + DM', b: [[0, 0, 45, 14]], e: 'Split each input into the average (CM) and half the difference (DM). DM moves the outputs oppositely; CM moves them together.', f: ['V_{CM} = \\dfrac{V_{in1}+V_{in2}}{2}'] },
      { t: 'The mismatch current', b: [[5, 8, 18, 7]], e: 'At the output $I_P = I_N + I_X$: the difference $I_X$ has to go into $R_P \\parallel R_N$, driving the CM to a rail.', f: ['I_X = I_P - I_N'] },
      { t: 'General structure of CMFB', b: [[8, 27, 45, 14]], e: '**Sense** $V_{out,CM}$, **compare** with $V_{REF}$, **correct** a current source (here the tail).', m: 'Sense, compare, correct.' },
      { t: 'Resistive sensing', b: [[8, 42, 70, 23]], e: 'Two equal resistors average the outputs (superposition). Cost: $R$ sits in parallel with the output, lowering the gain.', f: ['V_{out,CM} = \\dfrac{V_{out1}+V_{out2}}{2}', 'A_v = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R_1)'], q: ['pyq-m24-q1', 'bank-t5q3'] },
      { t: 'Follower sensing', b: [[8, 63, 50, 10], [10, 80, 90, 20]], e: 'Buffer each output with a source follower first so the resistors do not load it; the sensed level is one $V_{GS}$ lower.', f: ['V_{sense} = \\dfrac{V_{out1}+V_{out2}}{2} - V_{GS}'] },
    ],
  },
  {
    id: 'lec11',
    lec: 11,
    date: '31 Aug',
    title: 'CMFB: triode sensing, pair sensing, the loop',
    img: 'lec11',
    lesson: 'l8-cmfb',
    steps: [
      { t: 'Triode devices M10, M11 sense the outputs', b: [[40, 0, 40, 14]], e: 'Their gates are the outputs; they sit in the tail of the cascode.' },
      { t: 'Deep triode = resistor', b: [[63, 14, 36, 13]], e: 'With small $V_{DS}$ the $V_{DS}^2$ term drops out.', f: ['R_{on} = \\dfrac{1}{\\mu_nC_{ox}\\frac{W}{L}(V_{GS}-V_{th})}'], m: 'Triode = gate-controlled resistor.' },
      { t: 'Their total resistance depends on the CM', b: [[27, 15, 32, 8]], e: 'In parallel, only $V_{out1} + V_{out2}$ appears.', f: ['R_{tot} = \\dfrac{1}{\\mu_nC_{ox}(W/L)(V_{out1}+V_{out2}-2V_{th})}'], q: ['bank-quiz2a'] },
      { t: 'Saturation vs triode', b: [[36, 26, 25, 10]], e: 'Saturated = voltage-controlled current source; deep triode = voltage-controlled resistor.' },
      { t: 'Pair sensing (nonlinear)', b: [[30, 37, 62, 22]], e: 'Pairs compare each output with $V_{REF}$; currents go as squares, so it only works for small swings.', f: ['I_D \\propto (V_{REF}-V_{out1})^2 + (V_{REF}-V_{out2})^2'] },
      { t: 'The CMFB loop', b: [[0, 58, 70, 42]], e: 'A normal feedback loop: error amplifier on the tail, or triode devices at the bottom.', f: ['\\varepsilon \\approx \\dfrac{1}{\\beta A}'] },
    ],
  },
  {
    id: 'lec12',
    lec: 12,
    date: '2 Sep',
    title: 'CMFB techniques; replica CMFB',
    img: 'lec12',
    lesson: 'l8-cmfb',
    steps: [
      { t: 'Where the error amplifier acts', b: [[35, 0, 65, 10]], e: 'It drives either the input tail or the bottom sources until $V_{out,CM} = V_{REF}$.' },
      { t: 'The triode-sensing equation', b: [[42, 8, 40, 17]], e: 'The cascode bias fixes P; the tail current through $R_{tot}$ then pins the CM.', f: ['V_{out1}+V_{out2} = \\dfrac{2I_D}{\\mu_nC_{ox}(W/L)}\\cdot\\dfrac{1}{V_{b1} - V_{GS3}} + 2V_{th}'], q: ['bank-quiz2a', 'pyq-m25-q4'] },
      { t: 'Replica CMFB', b: [[15, 42, 55, 20]], e: 'M14 copies M11, M15 (gate $V_{REF}$) copies M12 ‖ M13: the outputs must average to $V_{REF}$.', f: ['(W/L)_{14} = (W/L)_{11},\\; (W/L)_{15} = (W/L)_{12} + (W/L)_{13}'], l: 'l8-replica', q: ['bank-ps2-p5'] },
      { t: 'Removing the copy error', b: [[15, 62, 82, 38]], e: 'M17, M18 (copies of M1, M2) make $V_{DS14} = V_{DS11}$.', f: ['(W/L)_{17} = (W/L)_1,\\; (W/L)_{18} = (W/L)_2'], l: 'l8-replica' },
    ],
  },
  {
    id: 'lec13',
    lec: 13,
    date: '7 Sep',
    title: 'Step response, time constant, slew rate',
    img: 'lec13',
    lesson: 'l9-slew',
    steps: [
      { t: 'RC step response', b: [[25, 0, 42, 20]], e: 'Partial fractions give the familiar exponential; the slope is steepest at t = 0.', f: ['V_{out}(t) = V_0(1 - e^{-t/\\tau}),\\; \\dfrac{dV_{out}}{dt}\\Big|_0 = \\dfrac{V_0}{\\tau}'], l: 'u12-settling' },
      { t: 'Feedback amp with Rout and CL', b: [[12, 20, 55, 28]], e: 'KCL at the output: one pole, sped up by the loop gain.', f: ['\\tau = \\dfrac{C_LR_{out}}{1 + A\\frac{R_2}{R_1+R_2}}'], q: ['bank-t6q1'] },
      { t: 'The closed-loop step', b: [[20, 52, 45, 12]], e: 'Final value is the closed-loop gain; time constant from above.', f: ['V_{out}(t) = V_0\\dfrac{A}{1+\\beta A}(1 - e^{-t/\\tau})'] },
      { t: 'Small step: linear', b: [[2, 56, 70, 20]], e: 'A small ΔV splits ±$g_m\\Delta V/2$; the mirror adds them: $g_m\\Delta V$ charges $C_L$.' },
      { t: 'Large step: slewing', b: [[24, 67, 50, 33]], e: 'M2 turns off; all of $I_{SS}$ charges $C_L$ at a fixed rate.', f: ['SR = \\dfrac{I_{SS}}{C_L}'], m: 'A fixed tap filling a bucket.', q: ['bank-t6q2'] },
    ],
  },
  {
    id: 'lec14',
    lec: 14,
    date: '9 Sep',
    title: 'Slewing of telescopic and folded; stability, Barkhausen',
    img: 'lec14',
    lesson: 'l9-slew',
    steps: [
      { t: 'Telescopic slewing', b: [[28, 0, 55, 17]], e: 'Each output slews at $I_{SS}/2C_L$; the difference at $I_{SS}/C_L$.', f: ['\\dfrac{dV_{out,d}}{dt} = \\dfrac{I_{SS}}{C_L}'], q: ['bank-ps2-p1'] },
      { t: 'Folded-cascode slewing', b: [[12, 15, 46, 13]], e: 'One branch carries $I_P - I_{SS}$: if $I_P < I_{SS}$ it turns off and the slew rate drops.', q: ['bank-t6q3'] },
      { t: 'Concept of stability', b: [[8, 28, 35, 20]], e: 'Closed loop $A/(1+\\beta A)$; the loop gain is $\\beta A(s)$.', l: 'l11-barkhausen' },
      { t: 'Barkhausen criteria', b: [[14, 58, 62, 18]], e: 'If $|\\beta A| = 1$ exactly where the phase is −180°, the denominator is zero: oscillation.', f: ['|\\beta A(j\\omega_1)| = 1,\\; \\angle\\beta A(j\\omega_1) = -180^\\circ'], m: 'Gain 1 at −180° = oscillator.', l: 'l11-barkhausen' },
      { t: 'Complex numbers you need', b: [[48, 74, 52, 26]], e: 'Magnitude and angle; each pole factor contributes $\\tan^{-1}(\\omega/\\omega_p)$.', f: ['M = \\sqrt{a^2+b^2},\\; \\theta = \\tan^{-1}\\dfrac{b}{a}'], l: 'l11-barkhausen' },
    ],
  },
  {
    id: 'lec15',
    lec: 15,
    date: '11 Sep',
    title: 'Bode plots, gain and phase margin',
    img: 'lec15',
    lesson: 'l12-margins',
    steps: [
      { t: 'Bode of A(s)', b: [[12, 0, 88, 13]], e: 'Each pole: −20 dB/dec from $\\omega_p$; phase from 0 to −90° between $0.1\\omega_p$ and $10\\omega_p$ (−45° at the pole).', l: 'l11-multipole' },
      { t: 'Smaller β lowers the curve', b: [[6, 13, 60, 17]], e: 'The red curve ($\\beta < 1$) is the blue one shifted down: it crosses 0 dB earlier, at safer phase. β = 1 is the worst case.', m: 'Buffer (β = 1) is the hardest to stabilise.', l: 'l11-multipole' },
      { t: 'Crossovers and margins', b: [[5, 30, 50, 15], [20, 45, 55, 4]], e: '$\\omega_{GX}$: where |βA| = 1. $\\omega_{PX}$: where phase = −180°.', f: ['PM = 180^\\circ + \\angle\\beta A(\\omega_{GX})'], m: 'Find ωGX first, then add up the pole angles.', q: ['pyq-m25-q5'] },
      { t: 'One pole: always stable', b: [[5, 50, 90, 32]], e: 'One pole gives at most −90°, so PM = 90°. Closing the loop moves the pole up by $(1+\\beta A_0)$.', f: ['PM = 90^\\circ', "\\omega_p' = \\omega_{p1}(1+\\beta A_0)"], q: ['pyq-t24-ex1'] },
      { t: 'Two poles', b: [[5, 82, 40, 18]], e: 'Phase heads to −180°; the closer the second pole is to crossover, the smaller the PM.', q: ['bank-r10-3'] },
    ],
  },
  {
    id: 'lec16',
    lec: 16,
    date: '16 Sep',
    title: 'Phase margin and peaking',
    img: 'lec16',
    lesson: 'l12-ringing',
    steps: [
      { t: 'Two-pole amplifier, β = 1', b: [[44, 0, 30, 14]], e: '−20 then −40 dB/dec; phase towards −180°.' },
      { t: 'PM on the plot', b: [[54, 14, 46, 17]], e: 'Read the phase at $\\omega_{GX}$ and measure its distance from −180°.', f: ['PM = 180^\\circ - |\\angle\\beta A(\\omega_{GX})|'] },
      { t: 'PM = 5°: a huge peak', b: [[40, 31, 46, 30]], e: 'At $\\omega_{GX}$, $|\\beta A| = 1$ so $|A| = 1/\\beta$; the denominator is $|1 + e^{-j175^\\circ}|$ = tiny → 11.5/β.', f: ['|A_f(\\omega_{GX})| = \\dfrac{1}{\\beta}\\cdot\\dfrac{1}{2\\sin(PM/2)}'], m: 'K = 1/(2 sin(PM/2)).', q: ['bank-lec16', 'pyq-m23-q5'] },
      { t: '45° and 60°', b: [[28, 62, 40, 16]], e: '45° → 1.3/β (30% peak). 60° → exactly 1/β: no peak.', m: '45 → 1.3, 60 → 1.0.', q: ['pyq-t24-ex4'] },
      { t: 'Step responses', b: [[2, 77, 48, 10]], e: 'Small PM rings; 60° is fast with a tiny overshoot; 90° is slow with none.' },
      { t: 'Reading 1/β on the plot', b: [[10, 42, 30, 8]], e: '$20\\log|A| - 20\\log(1/\\beta) = 20\\log|\\beta A|$: draw the $1/\\beta$ line; where it meets $|A|$ is $\\omega_{GX}$.', l: 'l13-dominant' },
    ],
  },
  {
    id: 'lec17',
    lec: 17,
    date: '18 Sep',
    title: 'Frequency compensation; Miller',
    img: 'lec17',
    lesson: 'l13-miller',
    steps: [
      { t: 'Compensation on the Bode plot', b: [[5, 0, 40, 35]], e: '100 dB, three poles: the loop gain crosses 0 dB past −180°. Move the dominant pole down (green dashed) so it crosses before the second pole.', f: ["f_D = \\dfrac{f_{gx}}{\\beta A_0}"], l: 'l13-dominant', q: ['bank-ps2-p3', 'pyq-t24-ex56'] },
      { t: 'Miller effect', b: [[5, 35, 45, 15]], e: '$C_c$ across a gain $-A_2$ looks $(1 + A_2)$ times bigger at the input.', f: ['C_{in} = C_c(1+A_2),\\; C_{out} = C_c(1 + 1/A_2)'], m: 'A capacitor across gain is multiplied by the gain.' },
      { t: 'After compensation', b: [[8, 50, 40, 9]], e: 'The first pole drops a lot with a small $C_c$.', f: ["P_1' \\approx \\dfrac{1}{R_1A_2C_c}"] },
      { t: 'Two-stage op amp and its poles', b: [[10, 60, 40, 23]], e: 'Node P (stage 1 output) and node Q (output) each give a pole.', f: ['P_1 = \\dfrac{1}{(r_{O2}\\parallel r_{O4})C_1},\\; P_2 = \\dfrac{1}{(r_{O6}\\parallel r_{O7})C_2}'], l: 'l14-twostage' },
      { t: 'Transfer function: the RHP zero', b: [[12, 83, 88, 17]], e: 'Matching the denominator gives the split poles; the numerator has a right-half-plane zero at $G_{m2}/C_c$.', f: ['\\left(1 - s\\dfrac{C_c}{G_{m2}}\\right)'], l: 'l14-rz', q: ['pyq-m24-q2', 'pyq-q24b-q1'] },
    ],
  },
  {
    id: 'settling',
    lec: 0,
    date: 'handout',
    title: 'Settling-time example (Razavi Ex 9.2)',
    img: 'settling',
    lesson: 'l1-speed',
    steps: [
      { t: 'The problem', b: [[0, 0, 65, 13]], e: 'Gain 10, settle within 1% in 5 ns. How fast must the op amp be?', q: ['bank-ex92'] },
      { t: 'Closed loop of a one-pole op amp', b: [[10, 13, 75, 22]], e: 'Substitute $A(s) = A_0/(1 + s/\\omega_0)$ and rearrange into "DC gain over $(1 + s\\tau)$".' },
      { t: 'τ and the DC gain', b: [[25, 34, 72, 9]], e: 'The pole moves up by $(1+\\beta A_0)$.', f: ['\\tau \\approx \\dfrac{1}{\\beta\\omega_u},\\; A_{dc} \\approx \\dfrac{1}{\\beta} = 10'], m: 'τ = 1/(β·ωu).' },
      { t: 'Step response', b: [[10, 44, 82, 18]], e: 'Partial fractions → $a A_{dc}(1 - e^{-t/\\tau})$.' },
      { t: '1% settling → ωu', b: [[15, 65, 55, 35]], e: '$e^{-t/\\tau} = 0.01$ → $t = 4.605\\tau$. With β = 0.1 and t < 5 ns: ωu > 9.21 Grad/s, fu > 1.47 GHz.', f: ['t_s = \\tau\\ln\\dfrac{1}{\\varepsilon}'], m: '1% = 4.6τ, 0.1% = 6.9τ.', q: ['bank-ex92', 'bank-ps1p2'] },
    ],
  },
];

export const WALK_BY_ID: Record<string, WalkPage> = Object.fromEntries(WALKS.map((w) => [w.id, w]));

export interface PlacedStep {
  page: WalkPage;
  index: number;
  lesson: string;
}

export const PLACED_STEPS: PlacedStep[] = WALKS.flatMap((page) => page.steps.map((s, index) => ({ page, index, lesson: s.l ?? page.lesson })));

/** Steps of every page that belong to a lesson, grouped by page. */
export function walkForLessons(lessons: string[]): Array<{ page: WalkPage; steps: number[] }> {
  const set = new Set(lessons);
  const out: Array<{ page: WalkPage; steps: number[] }> = [];
  for (const page of WALKS) {
    const steps = page.steps.map((s, i) => ((set.has(s.l ?? page.lesson)) ? i : -1)).filter((i) => i >= 0);
    if (steps.length) out.push({ page, steps });
  }
  return out;
}

/**
 * Everything that belongs to each lecture, in the order you met it in class: the background lessons it
 * assumes, the lessons that teach it, and every tutorial / past-paper / problem-set question on it.
 */
export const LECTURE_PLAN: Record<string, { pre: string[]; lessons: string[]; questions: string[] }> = {
  lec01: { pre: [], lessons: ['l1-gain'], questions: ['bank-ex91', 'bank-ps1p2'] },
  lec02: {
    pre: ['u2-pinchoff', 'u2-squarelaw', 'u3-recipe', 'u3-pmos-design', 'u4-gm', 'u4-ro', 'u5-cs', 'u6-rules', 'u6-mirror', 'u7-loads', 'u10-steering', 'u10-half', 'u10-cmrange', 'u11-ota', 'u11-ota-range'],
    lessons: ['l1-speed', 'l1-other', 'l2-onestage'],
    questions: ['bank-exam-q1', 'bank-quiz1a', 'bank-quiz1b', 'pyq-q24a-q1', 'pyq-q24a-q2', 'bank-t1q1', 'bank-t1q2', 'bank-t1q3', 'bank-t1q4', 'bank-t1q5', 'bank-t2q1', 'bank-ps1p1', 'bank-chat-cm94'],
  },
  lec03: {
    pre: ['u8-follower', 'u8-cg', 'u9-cascode', 'u9-telescopic', 'u12-poles'],
    lessons: ['l2-buffer', 'l2-onestage'],
    questions: ['bank-chat-buffer', 'bank-chat-window', 'bank-t2q2', 'bank-t3q1', 'bank-ps1p3', 'bank-ps1p4', 'bank-ps1p5', 'pyq-m24-q3'],
  },
  lec04: { pre: [], lessons: ['l2-buffer', 'l3-design', 'l3-scaling'], questions: ['bank-ex97', 'bank-ex98', 'pyq-m23-q3'] },
  lec05: { pre: [], lessons: ['l2-cmchoice', 'l4-folding', 'l4-gain'], questions: ['bank-t2q3', 'bank-ps1p6', 'bank-ps1p7'] },
  lec06: { pre: [], lessons: ['l4-folding', 'l4-gain', 'l3-scaling'], questions: ['bank-ps1p8', 'pyq-q23-q2', 'bank-ps1p10'] },
  lec07: { pre: [], lessons: ['l5-twostage', 'l6-boost'], questions: ['bank-t3q2', 'bank-t3q3', 'bank-t4q1'] },
  lec08: { pre: [], lessons: ['l6-boost'], questions: ['pyq-m25-q1', 'bank-t4q1', 'bank-t4q2', 'bank-t4q3'] },
  lec09: { pre: [], lessons: ['l6-boost', 'l7-cmfb'], questions: ['pyq-m24-q4', 'bank-t4q3'] },
  lec10: { pre: [], lessons: ['l7-cmfb'], questions: ['pyq-m24-q1', 'bank-t5q3', 'pyq-q24b-q2'] },
  lec11: { pre: [], lessons: ['l7-cmfb', 'l8-cmfb'], questions: ['bank-t5q1', 'pyq-m25-q4', 'bank-quiz2a', 'bank-quiz2b', 'bank-quiz2c', 'bank-t5q2'] },
  lec12: { pre: [], lessons: ['l8-cmfb', 'l8-replica'], questions: ['bank-ps2-p5'] },
  lec13: { pre: ['u12-settling'], lessons: ['l1-speed', 'l9-slew'], questions: ['bank-t6q1', 'bank-t6q2'] },
  lec14: { pre: [], lessons: ['l9-slew', 'l11-barkhausen'], questions: ['bank-ps2-p1', 'bank-t6q3', 'pyq-t24-ex1'] },
  lec15: { pre: [], lessons: ['l11-multipole', 'l12-margins'], questions: ['bank-r10-1', 'bank-r10-2', 'bank-r10-3', 'bank-ps2-p2', 'pyq-m25-q5', 'pyq-t24-ex2', 'pyq-t24-ex3'] },
  lec16: { pre: [], lessons: ['l12-ringing'], questions: ['bank-lec16', 'bank-r10-4', 'pyq-m23-q5', 'pyq-t24-ex4'] },
  lec17: {
    pre: [],
    lessons: ['l13-dominant', 'l13-onestage', 'l13-miller', 'l14-twostage', 'l14-rz'],
    questions: ['bank-ps2-p3', 'pyq-t24-ex56', 'bank-ex10-6', 'bank-ps2-p4', 'pyq-m24-q2', 'pyq-q24b-q1', 'pyq-m25-q2'],
  },
  settling: { pre: [], lessons: ['l1-speed'], questions: ['bank-ex92', 'bank-ps1p2'] },
};
