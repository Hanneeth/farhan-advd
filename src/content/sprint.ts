/**
 * Last-minute packs: one per topic group, shown at the end of the topic (#/topic/<unit>) and all together on
 * #/sprint (and its printable version). Each pack: the idea in plain words, the formulas to memorise (with how
 * to say them and how to sanity-check them), a one-line memory hook, and a playbook of every question type
 * with the steps and the papers where it was asked (problem ids → links). Formulas only: no numeric answers.
 */

export interface MemoRow {
  /** TeX */
  f: string;
  say: string;
  check: string;
}

export interface PlayRow {
  /** "If the question…" */
  signal: string;
  /** "Do this" (RichText markup) */
  steps: string;
  /** Fixed-bank problem ids where this type was asked. */
  ids: string[];
}

export interface Pack {
  id: string;
  title: string;
  /** Units whose topic page shows this pack (the pack sits on the last one). */
  units: string[];
  /** Lecture-note pages that cover it. */
  notes: string[];
  idea: string;
  memo: MemoRow[];
  hook: string;
  play: PlayRow[];
}

export const PACKS: Pack[] = [
  {
    id: 'bias',
    title: 'MOSFET bias: the DC recipe',
    units: ['U0', 'U1', 'U2', 'U3'],
    notes: [],
    idea: 'Every question starts with DC. **Assume saturation**, use the square law to link ID and Vov, **walk the node voltages** from a rail (node = supply − drops), then **check the fence**. Going the other way (design), pick Vov, get W/L from the square law. PMOS: same equations with magnitudes.',
    memo: [
      { f: 'V_{ov} = V_{GS} - V_{th}', say: 'overdrive is how far the gate is above threshold', check: 'typically 0.1–0.5 V' },
      { f: 'I_D = \\tfrac12\\mu C_{ox}\\tfrac{W}{L}V_{ov}^2', say: 'current grows with the square of the overdrive', check: 'double Vov → 4× current' },
      { f: '\\dfrac{W}{L} = \\dfrac{2I_D}{\\mu C_{ox}V_{ov}^2}', say: 'square law backwards', check: 'answers 5–2000 are normal' },
      { f: 'V_D \\ge V_G - V_{th}\\ (\\text{NMOS}),\\quad V_D \\le V_G + |V_{th}|\\ (\\text{PMOS})', say: 'the fence: drain no lower (NMOS) / no higher (PMOS) than one Vth past the gate', check: 'every swing and CM limit is one of these' },
      { f: 'I_D = \\mu C_{ox}\\tfrac{W}{L}\\left[V_{ov}V_{DS} - \\tfrac{V_{DS}^2}{2}\\right]', say: 'triode: below the fence', check: 'deep triode ≈ resistor 1/(µCox(W/L)Vov)' },
    ],
    hook: '“Assume, solve, walk, check.”',
    play: [
      { signal: 'Find ID, VD for a given bias', steps: 'Vov = VGS − Vth → ID by square law → VD = VDD − ID·RD → check the fence.', ids: ['bank-we1', 'bank-we3'] },
      { signal: 'Size a device for a current / voltage', steps: 'Pick or read Vov → **W/L = 2ID/(µCox·Vov²)** → gate = Vth + Vov.', ids: ['bank-we2', 'bank-t1q1'] },
    ],
  },
  {
    id: 'smallsignal',
    title: 'Small signal, gain and the impedance rules',
    units: ['U4', 'U5', 'U6', 'U7', 'U8', 'U9'],
    notes: [],
    idea: 'Gain is always $A_v = -G_mR_{out}$. Gm is the input device’s gm (divided down by any source degeneration). Rout is everything at the output node in parallel, found with the **three impedance rules**: into a gate ∞, into a drain rO (multiplied by gm·rO for each device stacked under it), into a source 1/gm. Cascodes multiply; diodes are 1/gm; the smallest resistance in parallel wins.',
    memo: [
      { f: 'g_m = \\dfrac{2I_D}{V_{ov}} = \\sqrt{2\\mu C_{ox}\\tfrac{W}{L}I_D}', say: 'gm three ways', check: 'mS for 0.1–1 mA' },
      { f: 'r_O = \\dfrac{1}{\\lambda I_D}', say: 'output resistance is 1 over lambda I', check: 'tens–hundreds of kΩ' },
      { f: 'A_v = -G_mR_{out}', say: 'gain is Gm times Rout, sign by inspection', check: 'CS inverts; follower and CG don’t' },
      { f: 'R_{up/down} = g_mr_O\\cdot r_{O,below}', say: 'up multiplies, down divides — by gm·rO', check: 'cascode ≈ gm·rO² (MΩ)' },
      { f: 'R_{into\\,source} \\approx 1/g_m,\\quad R_{diode} = 1/g_m', say: 'looking into a source or a diode: 1/gm', check: 'kΩ' },
      { f: '|A_v| = \\dfrac{R_{output}}{R_{source\\,path}}\\ (\\text{transistor} = 1/g_m)', say: 'ratio rule for degeneration', check: 'gm·RD/(1 + gm·RS)' },
    ],
    hook: '“Gate ∞, drain rO, source 1/gm. Up multiplies, down divides.”',
    play: [
      { signal: 'Gain of any one-device stage', steps: 'STEP B roles → STEP C each load’s resistance → STEP D **Av = −Gm·Rout**.', ids: ['bank-we1'] },
      { signal: 'Cascode / telescopic output resistance', steps: 'Rdown = gm·rO·rO (NMOS stack), Rup = gm·rO·rO (PMOS stack); Rout = Rup ‖ Rdown. A simple load throws the cascode away (load trap).', ids: ['bank-lab3', 'bank-lab5'] },
    ],
  },
  {
    id: 'diffpair',
    title: 'Differential pair',
    units: ['U10'],
    notes: [],
    idea: 'Split inputs into **CM** (average) and **DM** (difference). DM: the tail node is an AC ground, use the **half circuit** — $A_d = g_m(R_D\\parallel r_O)$. CM: the tail splits into **2RSS** per half — $A_{CM} = -R_D/(1/g_m + 2R_{SS})$. The input CM range is two fences: the tail plus VGS1 at the bottom, M1 against its drain at the top.',
    memo: [
      { f: 'A_d = g_m(R_D\\parallel r_O)', say: 'half circuit = one CS stage', check: 'current-source load: gm·rO/2' },
      { f: 'A_{CM} = -\\dfrac{R_D}{1/g_m + 2R_{SS}}', say: 'CM half circuit has twice the tail', check: '≪ 1' },
      { f: 'V_{in,CM}: [V_{ISS} + V_{GS1},\\; V_{D1} + V_{th}]', say: 'CM range: tail + VGS up to drain + Vth', check: 'floor < ceiling' },
      { f: '\\Delta V_{in,full} = \\sqrt2\\,V_{ov}', say: 'the pair fully steers at √2·Vov', check: 'used in slewing' },
    ],
    hook: '“CM sees 2RSS, DM sees a ground.”',
    play: [
      { signal: 'Design a pair: RD, W/L, R, CM range', steps: 'ID = ISS/2 → RD from the drop → W/L by square law → CM floor/ceiling fences.', ids: ['bank-t1q1'] },
      { signal: 'Diode or current-source loads: Ad', steps: 'Half circuit; diode load = 1/gm3 (gain = gm1/gm3 = √(µn(W/L)1/µp(W/L)3)); current source = rO.', ids: ['bank-t1q2', 'bank-t1q3'] },
      { signal: 'Resistive tail: VCM, ACM, CM rise to triode', steps: 'VCM = VGS + ISS·RSS; Ad = gm·RD; ACM = −RD/(1/gm + 2RSS); ΔVCM = (VD − VCM + Vth)/(1 − ACM).', ids: ['bank-t1q4'] },
    ],
  },
  {
    id: 'ota',
    title: 'Five-transistor OTA and its bandwidth',
    units: ['U11', 'U12'],
    notes: ['lec02', 'lec03'],
    idea: 'The mirror adds the two half-currents, so $G_m = g_{m1}$ and $R_{out} = r_{O2}\\parallel r_{O4}$. Four exam numbers come out of one picture: the gain, the input CM range (tail + VGS1 up to VDD − |VGS3| + Vth), the output swing (one overdrive at each rail plus the tail), and one pole at the output. In unity feedback the output resistance falls to 1/gm2 and the pole jumps to $g_{m2}/C_L$ (= GBW).',
    memo: [
      { f: 'A_v = g_{m1}(r_{O2}\\parallel r_{O4})', say: 'gm times rO over two', check: '30–200' },
      { f: 'V_{in,CM,min} = V_{ov5} + V_{GS1},\\; V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{thn}', say: 'floor: tail + VGS; ceiling: the diode costs a full |VGS3|', check: 'given CM limits → solve backwards for sizes' },
      { f: '\\text{swing} = (V_{DD} - |V_{ov4}|) - (V_{ov5} + V_{ov2})', say: 'output rails minus overdrives', check: '≈ VDD − 0.5 V' },
      { f: 'f_{-3dB} = \\dfrac{1}{2\\pi(r_{O2}\\parallel r_{O4})C_L},\\quad GBW = \\dfrac{g_{m1}}{2\\pi C_L}', say: 'one pole at the output; GBW = gm/CL', check: 'GBW = Av × f−3dB' },
      { f: 'f_{buffer} = \\dfrac{g_{m2}}{2\\pi C_L},\\quad SR = \\dfrac{I_{SS}}{C_L}', say: 'buffer bandwidth = GBW; slew = tail current over CL', check: 'MHz; V/µs' },
      { f: 'P = V_{DD}(I_{ref} + I_{SS})', say: 'power counts every branch', check: 'µW–mW' },
    ],
    hook: '“The mirror recovers the lost half.”',
    play: [
      { signal: 'Given sizes → gain, swing, CM range, power', steps: 'Mirror ratio → ISS → ID → gm, rO (λ ∝ 1/L!) → the four formulas.', ids: ['pyq-q24a-q1', 'bank-ps1p1'] },
      { signal: 'Given CM limits → sizes (mid-sem style)', steps: 'Tail Vov5 from its size → floor gives VGS1 → (W/L)1; ceiling gives |VGS3| → (W/L)3; then gain, swing, f−3dB, buffer f.', ids: ['bank-exam-q1', 'bank-quiz1a', 'bank-quiz1b'] },
      { signal: 'Given SR and CL → current, BW, GBW', steps: 'ISS = SR·CL → mirror for Iref → Rout → f−3dB; GBW = gm/(2πCL).', ids: ['pyq-q24a-q2'] },
    ],
  },
  {
    id: 'L1',
    title: 'Performance parameters: gain error, settling, slewing',
    units: ['L1'],
    notes: ['lec01', 'settling', 'lec13'],
    idea: 'Feedback trades a huge, sloppy open-loop gain A for an accurate 1/β. The **error** is $\\varepsilon = 1/(1 + \\beta A)$. A one-pole op amp in feedback settles like an RC with $\\tau = 1/(\\beta\\omega_u)$; to reach error ε takes $\\ln(1/\\varepsilon)$ time constants. A big step first **slews** at $SR = I/C_L$, then settles linearly.',
    memo: [
      { f: 'A_{closed} = \\dfrac{A}{1+\\beta A} \\approx \\dfrac{1}{\\beta},\\; \\beta = \\dfrac{R_2}{R_1+R_2}', say: 'closed-loop gain ≈ 1 over beta', check: 'gain 10 → β = 0.1' },
      { f: '\\varepsilon = \\dfrac{1}{1+\\beta A} \\approx \\dfrac{1}{\\beta A},\\; A_{min} = \\dfrac{A_{closed}}{\\varepsilon}', say: 'error is 1 over loop gain', check: '1% at gain 10 → A ≥ 1000' },
      { f: '\\omega_u = A_0\\omega_0,\\; \\tau = \\dfrac{1}{\\beta\\omega_u}', say: 'GBW fixed; τ = 1/(βωu)', check: 'ns for GHz' },
      { f: 't_s = \\tau\\ln\\tfrac{1}{\\varepsilon}', say: '1% = 4.6τ, 0.1% = 6.9τ', check: 'ln 100, ln 1000' },
      { f: '\\tau_{cl} = \\dfrac{R_{out}C_L}{1+\\beta A},\\; SR = \\dfrac{I}{C_L}', say: 'feedback speeds the output node up by (1 + βA)', check: 'initial slope = V/τ' },
    ],
    hook: '“Error is one over the loop gain; settling is ln(1/ε) time constants.”',
    play: [
      { signal: 'Gain-error spec → minimum A', steps: 'β = 1/Aclosed → **A ≥ Aclosed/ε**.', ids: ['bank-ex91', 'bank-ps1p2'] },
      { signal: 'Settling-time spec → minimum ωu / fu', steps: 't = ln(1/ε)/(βωu) → solve ωu → fu = ωu/2π.', ids: ['bank-ex92'] },
      { signal: 'Closed loop with Rout and CL: τ, Vout(t), slewing', steps: 'ACL = A/(1 + βA); τ = RoutCL/(1 + βA); Vout = V0·ACL(1 − e^(−t/τ)); slews if V0·ACL/τ > SR.', ids: ['bank-t6q1'] },
    ],
  },
  {
    id: 'L2',
    title: 'One-stage op amps: telescopic, buffer window',
    units: ['L2'],
    notes: ['lec02', 'lec03', 'lec04', 'lec05'],
    idea: 'Telescopic cascode: gain $g_{m1}(R_{up}\\parallel R_{down}) \\approx (g_mr_O)^2/2$, swing = VDD minus the whole stack of overdrives (twice, differentially). A cascode-mirror load costs one extra |Vthp|. Used as a **buffer** (output tied to an input gate) two fences fight and leave a window only $V_{th} - V_{ov4}$ wide.',
    memo: [
      { f: 'A = g_{m1}\\left(g_{m3}r_{O3}r_{O1}\\parallel g_{m5}r_{O5}r_{O7}\\right)', say: 'gm times cascode ‖ cascode', check: '1000s' },
      { f: '\\text{swing}_{diff} = 2\\left[V_{DD} - \\sum |V_{ov}| - V_{ISS}\\right]', say: 'twice what the stack leaves', check: 'each device costs its |Vov|' },
      { f: 'V_{b1} - V_{th4} \\le V_{out} \\le V_{b1} - V_{GS4} + V_{th2}', say: 'buffer window, width Vth − Vov4', check: '≈ 0.5 V' },
      { f: 'V_{out,max} = V_b + |V_{thp}|\\ (\\text{PMOS cascode}),\\; V_{out,min} = 2V_{ov} + V_{thn}\\ (\\text{NMOS cascode mirror})', say: 'cascode fences', check: 'mirror stack costs a Vth' },
    ],
    hook: '“Cascodes buy gain with swing; a buffer gets only Vth − Vov.”',
    play: [
      { signal: 'Telescopic: gain, swing, bias voltages', steps: 'Currents → gm, rO each side → Rup, Rdown → gain; swing from the stack; Vb’s put devices at their edges.', ids: ['bank-ps1p3', 'pyq-m24-q3', 'bank-t2q2'] },
      { signal: 'Output tied to an input (buffer): Vout range', steps: 'Write M4’s fence (floor) and M2’s fence with its gate = Vout (ceiling or floor).', ids: ['bank-t3q1', 'pyq-m24-q3', 'bank-chat-window', 'bank-ps1p5'] },
      { signal: 'Fully differential pair with current-source loads', steps: 'Ad = gm1(rO1 ‖ rO3); each output from Vin,CM − Vth up to VDD − |Vov3|.', ids: ['bank-t2q1'] },
    ],
  },
  {
    id: 'L3',
    title: 'Design procedure and scaling',
    units: ['L3'],
    notes: ['lec04', 'lec06'],
    idea: 'One recipe for every design: **power → currents**, **swing → overdrives**, **square law → W/L**, **check the gain**, and if it is short, lengthen the weak side (×2 W and L keeps Vov, halves λ). Then set each bias voltage so its device sits at its edge. Linear scaling (W, I × α) keeps every voltage and the gain, multiplies gm and power by α.',
    memo: [
      { f: 'I = P/V_{DD}', say: 'power budget', check: 'mA' },
      { f: '\\textstyle\\sum|V_{ov}| = V_{DD} - \\text{swing per side}', say: 'swing budget', check: 'tail gets the most' },
      { f: 'g_mr_O \\propto \\sqrt{WL/I_D},\\; \\lambda \\propto 1/L', say: 'longer devices, more intrinsic gain', check: 'L × 2 → rO × 2' },
      { f: 'I_{SS} = SR\\cdot C_L', say: 'slew spec sets the tail', check: 'µA' },
      { f: 'W, I \\times\\alpha:\\; g_m\\times\\alpha,\\; r_O\\div\\alpha,\\; V_{ov}, A_v\\ \\text{same}', say: 'linear scaling', check: 'α = CL,new/CL,old' },
    ],
    hook: '“Power, swing, Vov, W/L, gain, lengthen.”',
    play: [
      { signal: 'Design a telescopic for power, swing, gain', steps: 'I from power; split overdrives; W/L each; Rup ‖ Rdown; lengthen PMOS if short; Vin,CM, Vb1, Vb2.', ids: ['bank-ex97', 'bank-t2q3', 'bank-ps1p6'] },
      { signal: 'High-swing telescopic from SR and Vout limits', steps: 'ISS = SR·CL; floor = 2 NMOS Vov; ceiling = VDD − (√2 + 2)|Vov| (tail carries 2ID); W/L; Vb’s; gain.', ids: ['pyq-m23-q3'] },
      { signal: 'Scale for a bigger load', steps: 'α = CL ratio; power × α; widths × α.', ids: ['bank-ex98'] },
    ],
  },
  {
    id: 'L4',
    title: 'Folded cascode',
    units: ['L4'],
    notes: ['lec05', 'lec06'],
    idea: 'Fold the input pair sideways into the cascodes: the bottom sources carry $I_{SS}/2 + I$. Rout = Rup ‖ Rdown with the input device’s rO in parallel at the fold node; $G_m \\approx g_{m1}$ (current divider). The big win is the **input CM range**: a PMOS input can go below ground (Vov − |Vthp|), an NMOS input above VDD.',
    memo: [
      { f: 'I_{D,bottom} = \\tfrac{I_{SS}}{2} + I', say: 'the fold node carries both', check: 'currents add' },
      { f: 'R_{up} = g_mr_Or_O,\\; R_{down} = g_mr_O(r_{O1}\\parallel r_{O,src})', say: 'the fold node has rO1 in parallel', check: 'Rdown < Rup usually' },
      { f: 'G_m \\approx g_{m1}', say: 'almost all of M1’s current goes up the cascode', check: 'fraction ≈ 0.9–1' },
      { f: 'V_{in,CM}^{PMOS}: [V_{ov} - |V_{thp}|,\\; V_{DD} - |V_{ov,tail}| - |V_{GS1}|]', say: 'PMOS input: CM below ground', check: 'negative floor' },
      { f: 'V_{in,CM}^{NMOS}: [V_{ov,tail} + V_{GS1},\\; V_Y + V_{th1}]', say: 'NMOS input: CM above VDD possible', check: 'cap at VDD' },
    ],
    hook: '“Folding flips the CM inequality.”',
    play: [
      { signal: 'Folded cascode: CM range, bias limits, swing, gain', steps: 'Fold node Y = Vb2 + |VGS3|; Vb limits put sources at their edges; output from Vb1 − Vth to Vb2 + |Vth|; gain gm(Rup ‖ Rdown).', ids: ['pyq-q23-q2', 'bank-ps1p8'] },
      { signal: 'How much of M1’s current reaches the output', steps: 'Divider: (rO1 ‖ rO5)/[(1/gm3 ‖ rO3) + (rO1 ‖ rO5)].', ids: ['bank-ps1p7'] },
      { signal: 'Design a folded cascode', steps: 'Same design recipe; four overdrives share the room; PMOS input → CM can be 0 V.', ids: ['bank-t2q3', 'bank-ps1p6'] },
    ],
  },
  {
    id: 'L5',
    title: 'Two-stage op amp',
    units: ['L5'],
    notes: ['lec07'],
    idea: 'One stage for gain, one for swing: $A = A_1A_2$. The first-stage output CM is not free — it must sit where the second-stage device carries its current (X = VDD − |VGS|), and that caps the input CM. Two high-impedance nodes mean two poles, hence compensation (L13–L14).',
    memo: [
      { f: 'A = A_1A_2,\\; A_2 = g_{m,2nd}(r_O\\parallel r_O)', say: 'gains multiply', check: '1000s–10000s' },
      { f: 'V_X = V_{DD} - |V_{GS,2nd}|', say: 'X is pinned by the second stage', check: 'input CM ≤ X + Vth' },
      { f: 'V_{pp,diff} = 2(V_{DD} - |V_{ov}| - V_{ov})', say: 'CS output: one overdrive at each rail', check: 'nearly rail to rail' },
    ],
    hook: '“High gain, then high swing.”',
    play: [
      { signal: 'Two-stage: CM at X, Y; gain; swing', steps: 'X from the second stage’s VGS; A1 × A2; swing from the CS stage.', ids: ['bank-t3q2', 'bank-t3q3'] },
    ],
  },
  {
    id: 'L6',
    title: 'Gain boosting',
    units: ['L6'],
    notes: ['lec06', 'lec07', 'lec08', 'lec09'],
    idea: 'Gm is hard to raise; **Rout is not**. An auxiliary amplifier A1 holds the cascode’s source still, so it fights back $(1 + A_1)$ times harder: $R_{out} \\approx (1 + A_1)g_{m2}r_{O2}r_{O1}$, gain $\\approx (g_mr_O)^3$. Three ways to build A1 (Lec 8): a CS stage (costs headroom: $V_{out,min} = V_{GS3} + V_{ov2}$), a PMOS CS (needs $V_{GS2} \\le |V_{th3}|$), a folded cascode (gain $g_m(R_{up,aux}\\parallel R_{down,aux})$). The load must be boosted too, or its rO decides the gain.',
    memo: [
      { f: 'R_{out} = R_S + r_O + (1+A_1)g_mR_Sr_O', say: 'test-source result (Lec 7)', check: 'A1 = 0 → plain degeneration' },
      { f: 'R_{out} \\approx (1+A_1)g_{m2}r_{O2}r_{O1},\\; G_m \\approx g_{m1}', say: 'boosted cascode', check: 'GΩ–TΩ possible' },
      { f: 'A_1 = g_{m3}r_{O3}\\ (\\text{CS}),\\; A_1 = g_{m}(R_{up,aux}\\parallel R_{down,aux})\\ (\\text{folded})', say: 'the auxiliary’s own Gm·Rout', check: '10s–1000s' },
      { f: 'V_X = V_{GS3},\\; V_{G2} = V_X + V_{GS2},\\; V_{out,min} = V_{GS3} + V_{ov2}', say: 'CS auxiliary bias and its headroom cost', check: 'walk up from ground' },
      { f: 'A_v = -g_{m1}(R_{up}\\parallel R_{down})', say: 'with a real PMOS load, Rup = its rO wins', check: 'load trap' },
    ],
    hook: '“Hold the source still and the cascode fights (1 + A1) times harder.”',
    play: [
      { signal: 'CS-auxiliary boosted cascode: bias, swing, gain', steps: 'VX = VGS3 at I1; VP = VX + VGS2 at I2; swing [VGS3 + Vov2, VDD − |Vov,I2|]; A1 = gm3(rO3 ‖ rO,I1); gain = −gm1(rO,I2 ‖ A1gm2rO2rO1).', ids: ['pyq-m25-q1', 'bank-t4q1'] },
      { signal: 'Folded-cascode auxiliary: Aaux, Rout, Vb limits', steps: 'Aaux = gm,in[gmrOrO ‖ gmrO(rO ‖ rO)] → Rout = Aaux·gm2rO2rO1; Vb2,min puts the sink at its edge.', ids: ['pyq-m24-q4', 'bank-t4q3'] },
      { signal: 'PMOS auxiliary: region checks', steps: 'PMOS fence on the auxiliary: its drain (M2’s gate) ≤ VP + |Vthp| → VGS2 ≤ |Vth3|.', ids: ['bank-t4q2'] },
    ],
  },
  {
    id: 'cmfb',
    title: 'Common-mode feedback',
    units: ['L7', 'L8'],
    notes: ['lec09', 'lec10', 'lec11', 'lec12'],
    idea: 'A fully differential output sits between two current sources, so its CM **floats**. CMFB **senses** (resistors, followers or triode devices), **compares** with VREF and **corrects** a current source. Triode sensing turns Vout1 + Vout2 into a resistance; the tail current through it fixes VP, which pins the output CM.',
    memo: [
      { f: 'R_{tot} = \\dfrac{1}{\\mu_nC_{ox}\\frac{W}{L}(V_{out1}+V_{out2}-2V_{th})}', say: 'two triode devices = one resistor', check: 'full triode: ID = ½µCox(W/L)[2VovVDS − VDS²]' },
      { f: 'V_{out1}+V_{out2} = \\dfrac{2I_D}{\\mu_nC_{ox}(W/L)V_P} + 2V_{th}', say: 'the CM equation', check: 'VP = Vb1 − VGS' },
      { f: 'A_d = g_m(r_O\\parallel r_O\\parallel R)', say: 'sensing resistors load the gain', check: 'R ≫ rO barely matters' },
      { f: 'A_{CM} \\approx \\dfrac{r_{O3}}{2r_{O5}},\\; A_{CM,fb} = \\dfrac{A_{CM}}{1+T}', say: 'CM gain without and with the loop', check: 'CMRR = Ad/ACM' },
      { f: 'A_{CM,req} = \\dfrac{2(0.01)V_{O,CM}}{V_{in,CM,max} - V_{in,CM,min}}', say: 'course rule for “±1%”', check: 'Vin,CM,max = VO,CM + Vth' },
      { f: 'V_{O,CM,opt} = \\tfrac12\\left[V_{out,min} + V_{out,max}\\right]', say: 'optimum CM = middle of the swing', check: 'VREF = that' },
    ],
    hook: '“Sense, compare, correct.”',
    play: [
      { signal: 'Size triode sensing devices for an output CM', steps: 'VGS = Vout,CM, VDS = VP; full triode ID = ½µCox(W/L)[2(VGS − Vth)VP − VP²] per device.', ids: ['pyq-m25-q4', 'bank-t5q1', 'bank-quiz2a'] },
      { signal: 'Resistive sensing: Ad, ACM, VO,CM, CMRR, loop gain', steps: 'Ad = gm(rO ‖ rO ‖ R); ACM = rO3/(1/gm + 2rO5); VO,CM = middle of the range; ACM,req by the ±1% rule; T = sense → error amp → tail; ACM/(1 + T).', ids: ['pyq-m24-q1', 'bank-t5q3', 'pyq-q24b-q2'] },
      { signal: 'Which pair for the error amp; CMFB loop gain', steps: 'Match the error amp’s input CM to the sensed level; loop gain = A_EA·gm·(Rup ‖ Rdown).', ids: ['bank-t5q2'] },
      { signal: 'Replica CMFB', steps: 'M14 = M11, (W/L)15 = (W/L)12 + (W/L)13; conductances match.', ids: ['bank-ps2-p5'] },
    ],
  },
  {
    id: 'L9',
    title: 'Slew rate and input range',
    units: ['L9', 'L10'],
    notes: ['lec13', 'lec14'],
    idea: 'A big step steers the whole tail to one side: the output ramps at **SR = I/CL** (5-T OTA: ISS/CL; fully differential telescopic: ISS/2CL per output, ISS/CL differentially; folded cascode: limited by IP). Rail-to-rail input uses an NMOS and a PMOS pair in parallel.',
    memo: [
      { f: 'SR = \\dfrac{I_{SS}}{C_L}', say: 'slew = current over capacitance', check: 'V/µs' },
      { f: '\\dfrac{dV_{out1}}{dt} = \\dfrac{I_{SS}}{2C_L},\\; \\dfrac{dV_{out,d}}{dt} = \\dfrac{I_{SS}}{C_L}', say: 'fully differential telescopic', check: 'each side half' },
      { f: '\\Delta V_{in} > \\sqrt2V_{ov} \\Rightarrow \\text{slewing}', say: 'full steering', check: '' },
    ],
    hook: '“A fixed tap fills the bucket.”',
    play: [
      { signal: '5-T OTA: slew, then settle', steps: 'SR = ISS/CL; slews until the input difference < √2Vov; then τ = RoutCL/(1 + βA0).', ids: ['bank-t6q2'] },
      { signal: 'Folded-cascode slew rate', steps: 'Output = (IP − ID2) − mirrored (IP − ID1); a branch can’t go negative; need IP ≥ ISS.', ids: ['bank-t6q3'] },
      { signal: 'Telescopic slew', steps: 'Each output ISS/(2CL); difference ISS/CL.', ids: ['bank-ps2-p1'] },
    ],
  },
  {
    id: 'stability',
    title: 'Stability: phase margin and peaking',
    units: ['L11', 'L12'],
    notes: ['lec14', 'lec15', 'lec16'],
    idea: 'The loop gain βA(jω) must fall below 1 before its phase reaches −180° (Barkhausen). $PM = 180^\\circ + \\angle\\beta A(\\omega_{GX})$. Each pole costs up to 90° (45° at the pole). One pole: always stable (PM = 90°). Two close poles with a big gain: tiny PM. Small PM shows up as **peaking**: at $\\omega_{GX}$ the closed loop is $\\frac{1/\\beta}{2\\sin(PM/2)}$.',
    memo: [
      { f: 'PM = 180^\\circ - \\sum\\tan^{-1}\\dfrac{\\omega_{GX}}{\\omega_{pi}}', say: 'add the arctangents at crossover', check: 'degree mode!' },
      { f: '|\\beta A(\\omega_{GX})| = 1:\\; \\omega_{GX} \\approx \\sqrt{\\beta A_0\\omega_{p1}\\omega_{p2}}\\ (\\text{above both poles})', say: 'crossover', check: 'β = 1 is the worst case' },
      { f: 'K = \\dfrac{1}{2\\sin(PM/2)},\\; PM = 2\\sin^{-1}\\dfrac{1}{2K}', say: 'peaking ↔ PM', check: '45° → 1.3, 60° → 1.0' },
      { f: "f_p' = f_p(1+\\beta A_0)", say: 'feedback moves one pole up', check: 'gain × BW constant' },
      { f: 'Q = \\dfrac{\\sqrt{(1+\\beta A_0)\\omega_{p1}\\omega_{p2}}}{\\omega_{p1}+\\omega_{p2}}', say: 'two-pole closed loop', check: 'coincide Q = 0.5, flat Q = 0.707' },
    ],
    hook: '“Below 1 before −180°.”',
    play: [
      { signal: 'Two poles + gain → PM', steps: 'Solve |βA| = 1 (Solver or the quadratic in f²) → PM = 180° − Σ atan.', ids: ['pyq-m25-q5', 'bank-r10-3', 'bank-r10-1', 'bank-r10-2', 'bank-ps2-p2'] },
      { signal: 'Peaking ↔ PM', steps: 'K = 1/(2 sin(PM/2)) either way.', ids: ['pyq-m25-q5', 'pyq-m23-q5', 'bank-r10-4', 'bank-lec16', 'pyq-t24-ex4'] },
      { signal: 'Feedback moves poles; coincident / maximally flat', steps: 'One pole: × (1 + βA0). Two poles: Q formula; Q = 0.5 or 0.707 → β.', ids: ['pyq-t24-ex1', 'pyq-t24-ex2', 'pyq-t24-ex3'] },
    ],
  },
  {
    id: 'comp',
    title: 'Frequency compensation: dominant pole and Miller',
    units: ['L13', 'L14'],
    notes: ['lec17'],
    idea: 'Make the loop gain cross 0 dB before the second pole: move the first pole down (**dominant pole**) or, in a two-stage op amp, put **Cc across the second stage** — the Miller effect multiplies it by (1 + A2), splitting the poles. Results: $GBW = g_{m1}/2\\pi C_c$, $f_{p2} = g_{m2}/2\\pi C_L$, RHP zero $g_{m2}/2\\pi C_c$, $SR = I_5/C_c$. $C_c \\ge 0.22C_L$ gives 60° when the zero is at 10·GBW.',
    memo: [
      { f: 'GBW = \\dfrac{g_{m1}}{2\\pi C_c},\\; f_{p2} = \\dfrac{g_{m2}}{2\\pi C_L},\\; f_z = \\dfrac{g_{m2}}{2\\pi C_c}', say: 'the three Miller numbers', check: 'fz > fp2 when Cc < CL' },
      { f: 'SR = \\dfrac{I_5}{C_c}', say: 'slew uses Cc', check: '' },
      { f: "P_1' \\approx \\dfrac{1}{R_1A_2C_c},\\; C_{in} = C_c(1+A_2)", say: 'Miller pushes the first pole down', check: '' },
      { f: 'C_c \\ge 0.22C_L\\ (60^\\circ),\\; g_{m2} \\ge 10g_{m1}\\ (z = 10\\,GB)', say: 'design rules', check: '45° with z at 10GB → 0.122CL' },
      { f: 'f_D = \\dfrac{f_{gx}}{\\beta A_0}', say: 'dominant pole from the crossover you want', check: '−20 dB/dec' },
    ],
    hook: '“Split the poles, mind the zero.”',
    play: [
      { signal: 'Analyse a Miller two-stage: SR, GBW, A0, BW, p2, z, PM', steps: 'Mirror ratios → currents → gm1, gm7, rO’s → the formulas; PM = 90° − atan(GBW/fp2) − atan(GBW/fz).', ids: ['pyq-m24-q2', 'pyq-q24b-q1'] },
      { signal: 'Design a Miller two-stage from specs', steps: 'Cc = 0.22CL → I5 = SR·Cc → gm1 = 2πGB·Cc → (W/L)1 → ICMR+ → (W/L)3 → ICMR− → (W/L)5 → gm7 = 10gm1 → (W/L)7 → (W/L)8.', ids: ['pyq-m25-q2'] },
      { signal: 'Cc vs CL for a given PM', steps: 'PM = 90° − atan(ωu/ωp2) − atan(ωu/ωz) with ωu = gm1/Cc, ωp2 = gm2/CL, ωz = gm2/Cc.', ids: ['pyq-m23-q5', 'bank-ex10-6', 'bank-ps2-p4'] },
      { signal: 'Dominant-pole compensation', steps: 'New pole = (crossover you want)/(βA0); capacitance factor = old pole / new pole.', ids: ['pyq-t24-ex56', 'bank-ps2-p3'] },
    ],
  },
];

/** The pack shown at the end of a unit’s topic page. */
export function packForUnit(unit: string): Pack | undefined {
  return PACKS.find((p) => p.units[p.units.length - 1] === unit);
}
