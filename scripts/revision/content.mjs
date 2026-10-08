// Lec 1–8 revision sheet content. Text: **bold**, $inline TeX$. Formulas: [label, TeX]. Figures: strip keys from
// src/assets/doubts. Every formula here matches src/content/notes.ts and the lecture walks.
const r = String.raw;

export const TITLE = 'Analog revision sheet: Lectures 1–8';
export const SUB = 'EEE/INSTR F313 mid-sem · every concept, formula and figure from your notes, in lecture order';

export const SECTIONS = [
  {
    id: 'tools',
    title: '0 · The toolkit: seven ideas that solve every question',
    blocks: [
      { type: 'p', text: r`One set of example numbers is used everywhere: $V_{DD} = 1.8$ V, $|V_{th}| = 0.5$ V, $|V_{ov}| = 0.2$ V, so $|V_{GS}| = 0.7$ V. (Lec 3–4 use Ex 9.7’s 3 V supply.)` },
      {
        type: 'list',
        items: [
          r`**T1 · Saturation fences.** NMOS: $V_D \ge V_G - V_{th}$. PMOS: $V_D \le V_G + |V_{th}|$. Equivalent channel form: $|V_{DS}| \ge |V_{ov}|$.`,
          r`**T2 · Check vs link.** A **check** is source→drain through a channel: it must be $\ge |V_{ov}|$, and it is what fails. A **link** is source→gate: always exactly $|V_{GS}| = |V_{th}| + |V_{ov}|$; it only tells you where a gate sits. A fence = one check + one link written in one line.`,
          r`**T3 · Towers.** One block = one transistor; height = the voltage across it; blocks add up to $V_{DD}$; no block shorter than its $V_{ov}$; moving an input or output slides one boundary (one block grows, its neighbour shrinks); the limit is the moment a block is squeezed to its minimum (red). A “room” block is not a transistor, just spare voltage.`,
          r`**T4 · Gain by two looks.** $A_v = G_m(R_{up}\parallel R_{down})$, with $G_m \approx g_m$ of the input device.`,
          r`**T5 · Look-in resistances.** Into a drain (source grounded): $r_O$. Into a drain with $R_S$ under the source: $\approx g_mr_OR_S$ (**up multiplies**). Into a source with $R_D$ on the drain: $\dfrac{R_D + r_O}{1 + g_mr_O} \approx \dfrac{1}{g_m}$ (**down divides**). Into a gate: $\infty$.`,
          r`**T6 · Current divider.** A current reaching a node splits inversely to resistance: $I_{R_2} = I\,\dfrac{R_1}{R_1 + R_2}$. Signal current goes into a source ($1/g_m$), not into an $r_O$.`,
          r`**T7 · CM = the average of a pair.** $V_{in,CM} = \dfrac{V_{in1} + V_{in2}}{2}$, $v_d = V_{in1} - V_{in2}$. Output CM = average of the two outputs. A pole sits at every high-resistance node: $\omega_p = \dfrac{1}{RC}$.`,
        ],
      },
      { type: 'fig', key: 's-lec06-start' },
      { type: 'fig', key: 's-lec03-tower' },
      { type: 'fig', key: 's-lec05-cascode' },
      {
        type: 'method',
        title: 'Exam recipes',
        items: [
          r`**CM range / swing:** move the input (or output) towards one rail → find the block that gets squeezed → its **check** gives the limit on a node → use the **link** to reach the gate.`,
          r`**Gain:** find $G_m$ (the input device’s $g_m$; check the current divider) → look up → look down → $A_v = G_m(R_{up}\parallel R_{down})$.`,
          r`**Bandwidth:** find the high-resistance node, $\omega_p = 1/(R_{out}C_L)$; Hz = divide by $2\pi$ at the end.`,
        ],
      },
    ],
  },
  {
    id: 'lec01',
    title: 'Lec 1 · Gain and gain error (Razavi Ex 9.1)',
    blocks: [
      { type: 'p', text: r`A one-transistor gain $-g_mR_D$ drifts with process and temperature. Feedback fixes it: a huge, sloppy open-loop gain $A$ plus two resistors, whose **ratio** is precise. The resistors set the gain; $A$ only decides how close you get.` },
      { type: 'fig', key: 's-lec01-feedback' },
      {
        type: 'formulas',
        items: [
          ['feedback factor (tap across the bottom resistor)', r`\beta = \dfrac{R_2}{R_1 + R_2}`],
          ['closed-loop gain', r`A_{closed} = \dfrac{A}{1 + \beta A}`],
          ['ideal gain', r`A_{ideal} = \dfrac{1}{\beta} = 1 + \dfrac{R_1}{R_2}`],
          ['gain error', r`\varepsilon = \dfrac{1}{1 + \beta A} \approx \dfrac{1}{\beta A}`],
          ['minimum open-loop gain', r`A_{min} = \dfrac{A_{closed}}{\varepsilon}`],
        ],
      },
      { type: 'traps', items: [r`Gain 10 with 1 % error: $A \ge 1000$ (exact form gives 990; quote 1000 and say which).`, r`β uses the **bottom** resistor $R_2$. dB $= 20\log_{10}$.`, r`A buffer has $\beta = 1$, so its error is $\approx 1/A$.`] },
    ],
  },
  {
    id: 'lec02',
    title: 'Lec 2 · Specs, GBW, the differential pair and the 5-T OTA',
    blocks: [
      { type: 'p', text: r`Computed specs: **gain, bandwidth (GBW), output swing, input CM range**. One pole: gain × bandwidth is constant. Current-source loads give a large $r_O$ for only $|V_{ov}|$ of DC room.` },
      { type: 'fig', key: 's-lec02-cmdm' },
      { type: 'fig', key: 's-lec02-pair' },
      {
        type: 'formulas',
        items: [
          ['gain-bandwidth product', r`\omega_u = A_0\,\omega_0 = \text{GBW}`],
          ['fully differential pair, PMOS current-source loads', r`A_v = g_{m1,2}(r_{O1,2}\parallel r_{O3,4})`],
          ['its input CM range', r`V_{ISS} + V_{GS1} \le V_{in,CM} \le V_{DD} - |V_{ov3}| + V_{thn}`],
          ['its differential swing (×2: outputs move oppositely)', r`2\,(V_{DD} - |V_{ov3}| - V_{ov1} - V_{ISS})`],
          ['output pole', r`\omega_{p} = \dfrac{1}{(r_{O2}\parallel r_{O4})C_L}`],
        ],
      },
      { type: 'fig', key: 's-lec02-swing' },
      { type: 'p', text: r`**5-T OTA:** M3 is a diode, M4 mirrors it; both halves’ currents add at the single output, so the full $g_mv_d$ arrives. **M2’s gate is the inverting (−) input.**` },
      { type: 'fig', key: 's-lec02-ota' },
      {
        type: 'formulas',
        items: [
          ['5-T OTA gain', r`A_v = g_{m2}(r_{O2}\parallel r_{O4})`],
          ['CM ceiling (diode node, then one V_th up)', r`V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{th1}`],
          ['CM floor (tail, then a whole V_GS)', r`V_{in,CM,min} = V_{ISS} + V_{GS1}`],
          ['single-ended swing (no ×2)', r`V_{DD} - |V_{ov4}| - V_{ov2} - V_{ISS}`],
        ],
      },
      { type: 'fig', key: 's-lec02-cm' },
      { type: 'traps', items: [r`A diode costs a whole $|V_{GS}|$; a current source only $|V_{ov}|$.`, r`$V_{out,min} = V_{ISS} + V_{ov2}$ assumes the input CM at its lowest; exactly it is $V_{in,CM} - V_{th2}$.`, r`rad/s vs Hz: divide by $2\pi$ at the end.`] },
      { type: 'asked', text: 'Mid-sem Quiz 1 Part C: sizes from the CM limits, gain, swing, f−3dB with 4 pF.' },
    ],
  },
  {
    id: 'lec03',
    title: 'Lec 3 · Unity-gain buffer, telescopic cascode, the buffer window',
    blocks: [
      { type: 'p', text: r`**Buffer:** output wired to the − input, $\beta = 1$, $V_{out} \approx V_{in}$. Feedback makes the output $(1 + \beta A)$ times stiffer and $(1 + \beta A)$ times faster.` },
      { type: 'fig', key: 's-lec03-buffer' },
      {
        type: 'formulas',
        items: [
          ['buffer gain', r`A_{closed} = \dfrac{A}{1 + A} \approx 1`],
          ['closed-loop output resistance', r`R_{out,closed} = \dfrac{R_{out,open}}{1 + \beta A} \approx \dfrac{1}{g_{m2}}`],
          ['buffer bandwidth = the GBW', r`\omega = \dfrac{g_{m2}}{C_L}`],
        ],
      },
      { type: 'p', text: r`**Telescopic cascode:** cascode both the pair and the loads. Look down: $g_{m4}r_{O4}r_{O2}$; look up: $g_{m6}r_{O6}r_{O8}$; two similar values in parallel halve.` },
      { type: 'fig', key: 's-lec03-tele' },
      {
        type: 'formulas',
        items: [
          ['telescopic gain', r`A = g_{m1,2}\left[g_{m4}r_{O4}r_{O2}\parallel g_{m6}r_{O6}r_{O8}\right] \approx \dfrac{(g_mr_O)^2}{2}`],
          ['differential swing (five blocks per column)', r`2\left[V_{DD} - (|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ISS})\right]`],
          ['mirror-loaded version (diode tax)', r`V_{DD} - (|V_{ov8}| + |V_{ov6}| + |V_{thp}| + V_{ov4} + V_{ov2} + V_{ISS})`],
          ['buffer window (V_out on M2’s gate)', r`V_{b1} - V_{th4} \le V_{out} \le V_{b1} - V_{GS4} + V_{th2}`],
          ['window width', r`V_{th} - V_{ov4}`],
        ],
      },
      { type: 'fig', key: 's-lec03-headroom' },
      { type: 'fig', key: 's-lec03-vth' },
      { type: 'fig', key: 's-lec03-window' },
      { type: 'traps', items: [r`In the window, M4 gives the **floor**, M2 the **ceiling**; $V_{b1}$ only slides the window.`, r`X (M2’s drain) $= V_{b1} - V_{GS4}$ is pinned; it is not the input CM.`] },
      { type: 'asked', text: 'Mid-sem Q1(e) (buffer bandwidth gm2/2πCL); Tutorial 2 Q1–Q2; Tutorial 2 Q2(b), Tutorial 3 Q1(c) (window).' },
    ],
  },
  {
    id: 'lec04',
    title: 'Lec 4 · Designing a telescopic op amp (Razavi Ex 9.7)',
    blocks: [
      { type: 'p', text: r`Fixed order: **① power → currents, ② swing → overdrives, ③ square law → W/L, ④⑤ $g_m$, $r_O$ → check the gain**, then fix the weak side.` },
      { type: 'fig', key: 's-lec04-design' },
      {
        type: 'formulas',
        items: [
          ['currents', r`I_{total} = \dfrac{P}{V_{DD}}`],
          ['swing budget (per column)', r`|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ov9} = V_{DD} - \text{swing per side}`],
          ['square law', r`\dfrac{W}{L} = \dfrac{2I_D}{\mu C_{ox}V_{ov}^2}`],
          ['small-signal', r`g_m = \dfrac{2I_D}{V_{ov}},\quad r_O = \dfrac{1}{\lambda I_D}`],
          ['gain check', r`A_v = g_{m1,2}(R_{up}\parallel R_{down})`],
          ['fix without touching swing', r`g_mr_O \propto \sqrt{\dfrac{WL}{I_D}},\quad \lambda \propto \dfrac{1}{L}`],
        ],
      },
      { type: 'traps', items: [r`Ex 9.7: 1.5 mA per side; $V_{ov}$: tail 0.5, PMOS 0.3, NMOS 0.2 V; gain ≈ 1428 (Razavi 1416) < 2000.`, r`Double W **and** L of the PMOS only: W/L and $V_{ov}$ stay, $r_O$ doubles, gain ≈ 4000.`, r`In parallel the smaller resistance wins (here $R_{up}$).`] },
      { type: 'asked', text: 'Problem Set 1 P3, P6 and Tutorial 2 Q3: this recipe with new numbers.' },
    ],
  },
  {
    id: 'lec05',
    title: 'Lec 5 · Ex 9.6, the folding transformation, the folded cascode',
    blocks: [
      { type: 'p', text: r`**Ex 9.6:** closed through capacitors, no DC flows in $R_2$, so each gate sits at its output’s DC level: **input CM = output CM**. M1 and M3 are then squeezed after a drop of only $V_{th} - V_{ov}$.` },
      { type: 'fig', key: 's-lec05-ex96' },
      { type: 'p', text: r`**Folding:** the cascode device only needs a current pushed into its source. Flip the input device and feed it in from the side, at the fold node; add a current source for the DC path. Same $G_m$, same formula, input out of the output column.` },
      { type: 'fig', key: 's-lec05-fold' },
      { type: 'fig', key: 's-lec05-compare' },
      { type: 'fig', key: 's-lec05-folded' },
      { type: 'fig', key: 's-lec05-gm' },
      {
        type: 'formulas',
        items: [
          ['Ex 9.6 drop below the CM', r`V_{th} - V_{ov}`],
          ['folded pair currents (KCL at the fold node)', r`I_{SS2} = I_{SS1} + \dfrac{I_{SS}}{2}`],
          ['look up (PMOS cascode)', r`R_{up} = g_{m5}r_{O5}r_{O7}`],
          ['look down (two r_O on the fold node)', r`R_{down} = g_{m3}r_{O3}(r_{O1}\parallel r_{O9})`],
          ['transconductance by current divider', r`G_m \approx g_{m1}`],
          ['gain', r`A_v \approx g_{m1}(R_{up}\parallel R_{down})`],
        ],
      },
      { type: 'traps', items: [r`Keep the folding current $\ge I_{SS}$ or a cascode starves in a big step.`, r`Your page numbers M9, M10 bottom / M7, M8 top; Razavi and Tutorial 2 Q3 swap them. Same formulas.`, r`Folding costs power, a little gain, an extra pole; it buys swing and a CM range reaching a rail.`] },
      { type: 'asked', text: 'Tutorial 2 Q3, Problem Set 1 P6–P7, Tutorial 6 Q3.' },
    ],
  },
  {
    id: 'lec06',
    title: 'Lec 6 · Folded-cascode CM ranges, rail-to-rail, folded buffer, low-voltage cascode load',
    blocks: [
      { type: 'p', text: r`**PMOS input:** column M11 → P → M1 → X → M9, X held at $V_{ov9}$, link $P = V_{in} + |V_{GS1}|$. Input up: M11 squeezed. Input down: M1 squeezed — and the input can go **below ground**.` },
      { type: 'fig', key: 's-lec06-cm' },
      { type: 'p', text: r`**NMOS input:** everything flips. The fold node hangs from the top, link $S = V_{in} - V_{GS1}$; the ceiling goes **above $V_{DD}$**.` },
      { type: 'fig', key: 's-lec06-nfold' },
      {
        type: 'formulas',
        items: [
          ['PMOS-input ceiling', r`V_{in,CM,max} = V_{DD} - |V_{ov11}| - |V_{GS1}|`],
          ['PMOS-input floor (page’s two forms)', r`V_{in,CM,min} = V_{ov9} + |V_{ov1}| - |V_{GS1}| = V_{ov9} - |V_{thp}|`],
          ['NMOS-input gain', r`A_v = g_{m1,2}\left[g_{m8}r_{O8}(r_{O10}\parallel r_{O2})\parallel g_{m6}r_{O6}r_{O4}\right]`],
          ['NMOS-input CM range', r`V_{ov11} + V_{GS1} \le V_{in,CM} \le V_{DD} - |V_{ov10}| + V_{th1}`],
          ['folded buffer: both checks are floors', r`V_{out} \ge \max\left(V_{b2} - V_{th4},\; V_{b2} - V_{GS4} - |V_{th2}|\right)`],
          ['low-voltage cascode load: M5 saturated', r`V_{b1} \ge V_{DD} - |V_{GS7}| - |V_{th5}|`],
          ['low-voltage cascode load: M7 saturated', r`V_{P,max} = V_{DD} - |V_{ov7}| = V_{DD} - |V_{GS7}| + |V_{th7}|`],
        ],
      },
      { type: 'fig', key: 's-lec06-r2r' },
      { type: 'fig', key: 's-lec06-fbuf' },
      { type: 'fig', key: 's-lec06-lvc' },
      { type: 'traps', items: [r`Page numbers: ceiling 1.8 − 0.2 − 0.7 = 0.9 V; floor 0.2 − 0.5 = −0.3 V; folded buffer floor 0.8 − 0.4 = 0.4 V binds.`, r`Rail-to-rail: $G_m$ roughly doubles where both pairs are on.`, r`Last circuit: M7, M8 gates go to X (not a diode). Your page’s $V_{P,max}$ expansion should read $+|V_{th7}|$.`, r`Why $V_{ov}$ for M11 and $V_{GS}$ for M1: M11’s step is a check, M1’s step is the link to the gate.`] },
      { type: 'asked', text: 'Problem Set 1 P8 (folded CM range, minimum negative); Quiz 1 2023-24 Q2.' },
    ],
  },
  {
    id: 'lec07',
    title: 'Lec 7 · Two-stage op amps and the idea of gain boosting',
    blocks: [
      { type: 'p', text: r`**Split the jobs:** stage 1 (cascode or pair) for **gain**, stage 2 (a CS stage: one device and one current source) for **swing**. Gains multiply. Price: two high-resistance nodes → two poles → compensation (Lec 17).` },
      { type: 'fig', key: 's-lec07-twostage' },
      { type: 'fig', key: 's-lec07-swing' },
      {
        type: 'formulas',
        items: [
          ['simple two-stage', r`A_1 = g_{m1,2}(r_{O1,2}\parallel r_{O3,4}),\quad A_2 = g_{m5,6}(r_{O5,6}\parallel r_{O7,8}),\quad A = A_1A_2`],
          ['telescopic first stage', r`A_1 = g_{m1}\left[g_{m5}r_{O5}r_{O7}\parallel g_{m3}r_{O3}r_{O1}\right]`],
          ['PMOS CS second stage', r`A_2 = g_{m9}(r_{O9}\parallel r_{O11})`],
          ['level between the stages (a link)', r`X = V_{DD} - |V_{GS9}|`],
          ['every gain', r`A_v = G_m \times R_{out}`],
          ['boosted output resistance (test source)', r`R_{out} = R_S + r_O + (1 + A_1)g_mR_Sr_O`],
        ],
      },
      { type: 'fig', key: 's-lec08-boost' },
      { type: 'traps', items: [r`Gain first, swing second: stage 1’s output only moves by $V_{out}/A_2$.`, r`An amplifier in **front** of the gate does not make the stage better ("no improvement"); the amplifier must fight the **output** resistance.`, r`Test-source method: input off, apply $V_X$ at the output, $R_{out} = V_X/I_X$.`] },
      { type: 'asked', text: 'Tutorial 3 Q3 (Razavi Fig 9.24): CM level at X, Y, sizes for the swing, overall gain; Tutorial 4 Q1–Q2.' },
    ],
  },
  {
    id: 'lec08',
    title: 'Lec 8 · Gain boosting: Gm, Rout, (gm·rO)³ and three boosters',
    blocks: [
      { type: 'p', text: r`With the amplifier sensing the source, $A_1$ cancels in $G_m$ (it becomes $\approx 1/R_S$), so boosting is purely an $R_{out}$ multiplier. The booster senses M2’s source X and drives M2’s gate.` },
      { type: 'fig', key: 's-lec08-source' },
      { type: 'fig', key: 's-lec08-compare' },
      {
        type: 'formulas',
        items: [
          ['G_m with sensing (no help)', r`\dfrac{I_{out}}{V_{in}} \approx \dfrac{A_1g_m}{R_S + (1 + A_1)g_mr_OR_S} \approx \dfrac{1}{R_S}`],
          ['boosted R_out, R_S = r_O1', r`R_{out} \approx (1 + A_1)g_{m2}r_{O2}r_{O1}`],
          ['into a boosted source', r`R_{in,source} = \dfrac{R_D + r_O}{1 + (1 + A_1)g_mr_O}`],
          ['boosted cascode gain', r`A_v \approx g_{m1}(1 + A_1)g_{m2}r_{O2}r_{O1} \approx (g_mr_O)^3`],
          ['CS booster', r`A_1 = g_{m3}r_{O3},\quad V_{out,min} = V_{GS3} + V_{ov2},\quad V_{G2} = V_{GS3} + V_{GS2}`],
          ['PMOS booster (fails)', r`V_{GS2} \le |V_{th3}|`],
          ['folded booster', r`A_1 = g_{m3}\,g_{m4}r_{O4}r_{O3}`],
        ],
      },
      { type: 'fig', key: 's-lec08-impl' },
      { type: 'traps', items: [r`Cascode $(g_mr_O)^2$, boosted cascode $(g_mr_O)^3$.`, r`CS booster: X is M3’s gate (a link), so X = $V_{GS3}$ instead of $V_{ov1}$: one $V_{th}$ of swing lost.`, r`$G_m \approx g_{m1}$ still: the boosted source is only $\approx 1/((1 + A_1)g_{m2})$.`] },
      { type: 'asked', text: 'Tutorial 4 Q1(a)–(c) (bias of M2, M3; Rout; swing), Q2(e), Q3 (folded booster).' },
    ],
  },
];
