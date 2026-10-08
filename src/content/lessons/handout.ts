/**
 * Handout lectures L1–L4 (Razavi §9.1–9.2.6): performance parameters, one-stage op amps, the design
 * procedure, and the folded cascode. Worked examples are the fixed-bank problems (Razavi examples,
 * Problem Set 1, Tutorials 2–3); "your turn" uses the generators.
 */
import type { Lesson } from '../types';

export const HANDOUT_LESSONS: Lesson[] = [
  // ─── L1 Performance parameters ───────────────────────────────────────────
  {
    id: 'l1-gain',
    unit: 'L1',
    title: 'Gain and feedback: why an op amp needs so much gain',
    minutes: 14,
    refs: { razavi: '§9.1.1, Example 9.1', notes: 'Lec 01', conversation: 'Lecture 1 (rebuilt): gain error' },
    why: 'Razavi Ex 9.1 and Problem Set 1 P2: “how much open-loop gain do I need for 1% accuracy?” is the first question of the op-amp chapter.',
    picture: {
      visual: { widget: 'gainErrorMini' },
      caption: 'Drag the open-loop gain. The closed-loop gain barely moves once the loop gain is large: that is feedback at work.',
    },
    predict: {
      prompt: 'An op amp with A = 1000 is wired for 1/β = 10. The actual closed-loop gain is about…',
      choices: ['10.00 exactly', '9.90', '1000'],
      answer: 1,
      explain: 'Aclosed = A/(1 + βA) = 1000/101 = 9.90. The 1% shortfall is the gain error 1/(1 + βA).',
    },
    idea: `An op amp is a super-sensitive see-saw: its open-loop gain {{Aopen}} is huge but sloppy (it changes with temperature and process). Feedback trades that sloppy gain for an accurate one.

A divider feeds a fraction {{beta}} of the output back. The closed-loop gain is $A/(1+\\beta A)$, which is almost $1/\\beta$ — set by two resistors, not by the transistors. The shortfall is the **gain error** {{eps}} $= 1/(1+\\beta A) \\approx 1/(\\beta A)$.

So accuracy is bought with gain: for error ε at closed-loop gain $1/\\beta$, you need $A \\ge A_{closed}/\\varepsilon$.`,
    analogy: 'Filling a glass while watching the line: the more attentively you watch (loop gain), the closer you stop to the mark.',
    rule: {
      tex: ['A_{closed} = \\dfrac{A}{1 + \\beta A} \\approx \\dfrac{1}{\\beta}', '\\varepsilon = \\dfrac{1}{1 + \\beta A} \\approx \\dfrac{1}{\\beta A}', 'A_{min} = \\dfrac{A_{closed}}{\\varepsilon}'],
      symbols: ['Aopen', 'beta', 'eps', 'Aclosed'],
      note: 'β = R2/(R1 + R2) for the non-inverting amplifier.',
    },
    worked: { bank: 'bank-ex91' },
    yourTurn: { generators: ['l1-gain'], count: 3 },
    lockIn: {
      summary: 'Aclosed = A/(1 + βA) ≈ 1/β; gain error ε = 1/(1 + βA); need A ≥ Aclosed/ε.',
      hook: '“Gain error is one over loop gain.”',
      cards: [
        { id: 'c-l1-acl', front: 'Closed-loop gain of a feedback amplifier?', back: 'A/(1 + βA) ≈ 1/β.' },
        { id: 'c-l1-eps', front: 'Gain error in terms of β and A?', back: 'ε = 1/(1 + βA) ≈ 1/(βA).' },
        { id: 'c-l1-amin', front: 'Minimum open-loop gain for error ε at closed-loop gain Acl?', back: 'A ≥ Acl/ε (e.g. 10/0.01 = 1000).' },
      ],
    },
    lab: { id: 'feedback' },
  },
  {
    id: 'l1-speed',
    unit: 'L1',
    title: 'Speed: bandwidth, settling and slew rate',
    minutes: 14,
    refs: { razavi: '§9.1.1, §9.1.4, Example 9.2', notes: 'Lec 01, settling example', conversation: 'Settling lecture; Tutorial 6' },
    why: 'Ex 9.2 (“settle to 1% in 5 ns — how fast must the op amp be?”) and Tutorial 6 (slewing then settling) are straight applications.',
    picture: {
      visual: { widget: 'settleMini' },
      caption: 'Raise the closed-loop gain and the settling slows down; raise the GBW and it speeds up. Tick “big step” to see slewing.',
    },
    predict: {
      prompt: 'Same op amp, closed-loop gain raised from 1 to 10. The settling time becomes…',
      choices: ['10× longer', 'the same', '10× shorter'],
      answer: 0,
      explain: 'τ = Aclosed/ωu. Ten times the closed-loop gain means ten times the time constant: feedback pushes the pole out by only (1 + βA0).',
    },
    idea: `With one pole at $\\omega_0$, the open-loop gain falls after $\\omega_0$ and crosses 1 at {{omegau}} $= A_0\\omega_0$ (the GBW — a fixed pocket of coins you can spend on gain or on bandwidth).

Closing the loop moves the pole out by $(1+\\beta A_0)$: bandwidth ≈ $\\beta\\omega_u$, and the step settles with {{tau}} $= 1/(\\beta\\omega_u) = A_{closed}/\\omega_u$. To reach error ε takes $\\tau\\ln(1/\\varepsilon)$: 4.6τ for 1%, 6.9τ for 0.1%.

A big step first **slews**: the output ramps at {{SR}} $= I_{SS}/C_L$ until the linear response can take over.`,
    analogy: 'GBW is a fixed pocket of coins. Settling: eating a share of what is left of a cake. Slewing: a fixed tap filling a bucket.',
    rule: {
      tex: ['\\omega_u = A_0\\,\\omega_0', '\\tau = \\dfrac{1}{\\beta\\,\\omega_u} = \\dfrac{A_{closed}}{\\omega_u}', 't_s = \\tau\\ln\\dfrac{1}{\\varepsilon},\\quad SR = \\dfrac{I_{SS}}{C_L}'],
      symbols: ['omegau', 'tau', 'eps', 'SR', 'beta'],
    },
    worked: { bank: 'bank-ex92' },
    yourTurn: { generators: ['u12-settle'], count: 3 },
    lockIn: {
      summary: 'GBW = A0·ω0 is fixed; closed-loop bandwidth ≈ β·ωu; τ = Aclosed/ωu; settling τ·ln(1/ε); big steps slew at ISS/CL first.',
      hook: '“Accuracy costs 2.3τ per decade.”',
      cards: [
        { id: 'c-l1-gbw', front: 'Unity-gain frequency of a one-pole op amp?', back: 'ωu = A0·ω0 (gain × bandwidth).' },
        { id: 'c-l1-bw', front: 'Closed-loop bandwidth?', back: '(1 + βA0)·ω0 ≈ β·ωu.' },
      ],
    },
    lab: { id: 'feedback' },
  },
  {
    id: 'l1-other',
    unit: 'L1',
    title: 'Swing, offset, noise and supply rejection',
    minutes: 10,
    refs: { razavi: '§9.1.2–9.1.6', notes: 'Lec 02' },
    why: 'Every design question trades these off: more swing means smaller overdrives, which means bigger devices, more noise and more capacitance.',
    picture: {
      visual: { widget: 'offsetMini' },
      caption: 'A few millivolts of input offset: small in closed loop, a disaster in open loop.',
    },
    predict: {
      prompt: 'An op amp with 5 mV of input offset is used at closed-loop gain 10. The output error is about…',
      choices: ['5 mV', '50 mV', '5 V'],
      answer: 1,
      explain: 'The offset sits at the input and is amplified by the closed-loop gain 1/β = 10: 50 mV at the output.',
    },
    idea: `**Output swing** is the room between the floor and the ceiling of the output stack: each stacked transistor eats its {{Vov}}.

**Offset** is a bathroom scale that reads 0.5 kg with nobody on it: a small input error from mismatch, multiplied by whatever gain follows.

**Noise** and **supply rejection** (PSRR — drawing on a bumpy bus) are also referred to the input: the lower the input-referred value, the better.

**Linearity**: the gain changes with the signal; negative feedback flattens it, just as it fixes the gain.

The trade: big swing → small overdrives → wide devices → more capacitance and a slower op amp.`,
    analogy: 'Offset: a bathroom scale reading 0.5 kg with nobody on it. Supply rejection: drawing steadily on a bumpy bus.',
    rule: {
      tex: ['V_{out,error} = \\dfrac{V_{os}}{\\beta}\\ (\\text{closed loop})', '\\text{swing} = V_{DD} - \\sum |V_{ov}|\\ (\\text{stacked devices})'],
      symbols: ['Vov', 'beta'],
      note: 'Swing is the ceiling; noise and offset are the floor.',
    },
    worked: { bank: 'bank-ps1p2' },
    yourTurn: { generators: ['l1-gain', 'u9-telescopic'], count: 2 },
    lockIn: {
      summary: 'Swing from the headroom stack; offset and noise referred to the input and multiplied by 1/β; feedback also linearises.',
      hook: '“Swing is the ceiling, noise and offset are the floor.”',
      cards: [
        { id: 'c-l1-offset', front: 'Output error caused by input offset Vos at closed-loop gain 1/β?', back: 'Vos/β (the offset is amplified by the closed-loop gain).' },
      ],
    },
  },

  // ─── L2 One-stage op amps ────────────────────────────────────────────────
  {
    id: 'l2-onestage',
    unit: 'L2',
    title: 'One-stage op amps: gain versus swing',
    minutes: 14,
    refs: { razavi: '§9.2.1', notes: 'Lec 02, Lec 03', conversation: 'One-stage op amps lecture; PS1 P3' },
    why: 'Tutorial 2 Q1 and PS1 P3–P4: the fully differential pair and the telescopic cascode, their gains and their swings.',
    picture: {
      visual: { widget: 'topologyCompare' },
      caption: 'Slide VDD. Each topology loses a fixed number of overdrives to headroom; the telescopic loses the most.',
    },
    predict: {
      prompt: 'Cascoding a fully differential pair (making it telescopic) roughly…',
      choices: ['doubles the gain and keeps the swing', 'squares the gain (gm·rO)² but costs two more overdrives per side', 'halves both'],
      answer: 1,
      explain: 'Rout grows by gm·rO on both sides, so the gain goes from ~gm·rO to ~(gm·rO)². Each side stacks two more devices, each costing |Vov|.',
    },
    idea: `**Fully differential, simple loads:** gain $g_{m1}(r_{O1}\\parallel r_{O3})$ ≈ gm·rO/2, swing $2(V_{DD} - |V_{ov3}| - V_{ov1} - V_{ISS})$. Its output CM floats: it needs CMFB (L7).

**Telescopic cascode:** cascode both sides, $A \\approx g_{m1}(g_m r_O^2 \\parallel g_m r_O^2)$ ≈ (gm·rO)²/2. The price: five devices in the stack, so swing $= 2[V_{DD} - (V_{ISS} + 2V_{ov,N} + 2|V_{ov,P}|)]$.

**Mirror-loaded (single-ended) telescopic:** the diode-biased PMOS cascode costs an extra |Vthp| at the top.

Full swing needs every device at its edge: Vin,CM, Vb1, Vb2 fixed exactly (Ex 9.7).`,
    rule: {
      tex: ['A_{tele} = g_{m1}\\left(g_{m3}r_{O3}r_{O1} \\parallel g_{m5}r_{O5}r_{O7}\\right)', 'V_{pp,diff} = 2\\left[V_{DD} - (V_{ISS} + V_{ov1} + V_{ov3} + |V_{ov5}| + |V_{ov7}|)\\right]'],
      symbols: ['Rdown', 'Rup', 'VISS', 'Vov'],
      note: 'Cascode squares the gain and doubles the headroom bill.',
    },
    worked: { bank: 'bank-ps1p3' },
    yourTurn: { generators: ['u9-telescopic', 'u9-cascode'], count: 3 },
    lockIn: {
      summary: 'Simple pair: gain gm·rO/2, big swing. Telescopic: (gm·rO)²/2, five overdrives per side. Mirror-loaded: lose another |Vthp|.',
      hook: '“Cascode squares the gain and doubles the headroom bill.”',
      cards: [
        { id: 'c-l2-tele', front: 'Telescopic gain and differential swing?', back: 'gm1(gm3rO3rO1 ‖ gm5rO5rO7); 2[VDD − (VISS + Vov1 + Vov3 + |Vov5| + |Vov7|)].' },
      ],
    },
    lab: { id: 'cascode' },
  },
  {
    id: 'l2-buffer',
    unit: 'L2',
    title: 'The unity-gain buffer and its window',
    minutes: 12,
    refs: { razavi: '§9.2.1, Examples 9.4–9.6', notes: 'Lec 03, Lec 04', conversation: 'Unity-gain buffer window lecture; PS1 P5' },
    why: 'Tutorial 2 Q2(b), Tutorial 3 Q1(c) and PS1 P5(d) all ask for the output range of a telescopic used as a buffer: the answer is a narrow window.',
    picture: {
      visual: { widget: 'bufferWindow' },
      caption: 'Slide the output (which is also the input). Only a narrow window keeps M2 and M4 saturated, and Vb1 only slides it.',
    },
    predict: {
      prompt: 'Vth = 0.7 V and Vov4 = 0.19 V. How wide is the buffer window of a telescopic?',
      choices: ['About 0.5 V', 'About 1.5 V', 'It depends on VDD'],
      answer: 0,
      explain: 'Window = Vth − Vov4 = 0.7 − 0.19 ≈ 0.51 V, independent of VDD and of Vb1.',
    },
    idea: `In a buffer the output is wired to the inverting input, so **the output is also a gate voltage**.

The floor comes from M4 (the NMOS cascode): $V_{out} \\ge V_{b1} - V_{th4}$.
The ceiling comes from M2, whose gate is now the output: M2’s drain is fixed at $V_{b1} - V_{GS4}$, so $V_{out} \\le V_{b1} - V_{GS4} + V_{th2}$.

Width: $V_{th} - V_{ov4}$ — roughly half a volt, whatever you do with Vb1. That is why telescopics are poor buffers and why we fold (L4).

Closing the loop also makes the output stiff: $R_{out}/(1+\\beta A)$ → about $1/g_m$.`,
    rule: {
      tex: ['V_{b1} - V_{th4} \\le V_{out} \\le V_{b1} - V_{GS4} + V_{th2}', '\\text{width} = V_{th} - V_{ov4}', 'R_{out,closed} = \\dfrac{R_{out}}{1+\\beta A}'],
      symbols: ['Vth', 'Vov', 'VGS'],
      note: 'In a buffer the output is a gate voltage.',
    },
    worked: { bank: 'bank-ps1p5' },
    yourTurn: { generators: ['u9-telescopic', 'l1-gain'], count: 2 },
    lockIn: {
      summary: 'Telescopic buffer window: Vb1 − Vth4 ≤ Vout ≤ Vb1 − VGS4 + Vth2, width Vth − Vov4. Feedback lowers Rout by (1 + βA).',
      hook: '“In a buffer the output is a gate voltage.”',
      cards: [
        { id: 'c-l2-model', front: 'Lec 3: how does a closed-loop op amp look to a load RL?', back: 'Like a source Vin·Aclosed behind Rout,closed = Rout,open/(1 + βAopen). For the 5-T OTA buffer (β = 1) that is ≈ 1/gm2, so RL barely loads it; its pole moves to gm2/CL.' },
        { id: 'c-l2-window', front: 'Output window of a telescopic in unity-gain feedback?', back: 'Vb1 − Vth4 ≤ Vout ≤ Vb1 − VGS4 + Vth2 (width Vth − Vov4).' },
      ],
    },
  },

  {
    id: 'l2-cmchoice',
    unit: 'L2',
    title: 'Closed loop through capacitors: choose the CM level',
    minutes: 10,
    refs: { razavi: '§9.2.1, Example 9.6, Fig. 9.10', notes: 'Lec 05' },
    why: 'Your Lec 5 opens with this circuit (Razavi Ex 9.6): a telescopic in closed loop, where one choice of CM level doubles the usable swing.',
    picture: {
      visual: { widget: 'cmChoiceMini' },
      caption: 'Slide VCM. Too low and M3, M4 clip the bottom of the swing; too high and M1, M2 are in triode before any signal arrives.',
    },
    predict: {
      prompt: 'The loop forces the input CM to equal the output CM. Where should VCM sit for the largest symmetric swing?',
      choices: ['At Vb − Vth (M3, M4 at their edge)', 'At Vb − (VGS3,4 − Vth) (M1, M2 at their edge)', 'Exactly at VDD/2'],
      answer: 1,
      explain: 'At the top edge X can fall a full Vth − Vov before M3, M4 leave saturation, and rising only meets the PMOS loads. At the bottom edge it cannot fall at all.',
    },
    idea: `The input capacitors block DC, so the resistors set the bias: **the input CM equals the output CM**. The drains X, Y therefore sit at the same level as the input gates.

Two fences box X in: M3, M4 need $V_X \\ge V_b - V_{th}$; M1, M2 need $V_X \\le V_b - (V_{GS3,4} - V_{th})$ at DC.

Pick the **top** edge. X can fall by $V_{th} - V_{ov}$. It can rise freely, because the op amp's gain keeps its input gates almost still; only the PMOS loads stop it. So each output swings $\\pm(V_{th} - V_{ov})$ around VCM.`,
    analogy: 'Parking in a garage with a low beam and a floor drain: park as high as the beam allows and you have the most room to bounce down.',
    rule: {
      tex: ['V_{CM} = V_b - (V_{GS3,4} - V_{th1,2}) = V_b - V_{ov3,4}', 'V_{X,min} = V_b - V_{th3,4}', '\\text{swing per side} = \\pm(V_{th} - V_{ov}),\\quad V_{pp,diff} = 4(V_{th} - V_{ov})'],
      symbols: ['VCM', 'Vth', 'Vov', 'VGS'],
      note: 'This is the buffer window’s cousin: the same two fences, but here the gates stay still, so only the bottom fence limits the swing.',
    },
    worked: { generator: 'l2-cmchoice', seed: 6 },
    yourTurn: { generators: ['l2-cmchoice'], count: 2 },
    lockIn: {
      summary: 'In closed loop Vin,CM = Vout,CM. Put VCM at Vb − (VGS3,4 − Vth): X can fall Vth − Vov to Vb − Vth; the swing is ±(Vth − Vov) per side.',
      hook: '“Park just under the beam.”',
      cards: [
        { id: 'c-l2-cmchoice', front: 'Ex 9.6: best output CM of a telescopic closed through capacitors?', back: 'VCM = Vb − (VGS3,4 − Vth1,2) (M1, M2 at their edge). X can then fall to Vb − Vth3,4: a swing of ±(Vth − Vov).' },
        { id: 'c-l2-cmwhy', front: 'Why can X rise above that VCM without pushing M1, M2 into triode?', back: 'The op amp’s high gain keeps its input gates nearly still, so M1, M2’s fence does not move; only the PMOS loads limit the upswing.' },
      ],
    },
  },
  // ─── L3 Design procedure ─────────────────────────────────────────────────
  {
    id: 'l3-design',
    unit: 'L3',
    title: 'Design procedure: power → swing → Vov → W/L → gain',
    minutes: 16,
    refs: { razavi: '§9.2.2, Example 9.7', notes: 'Lec 04', conversation: 'Design procedure lecture; PS1 P6' },
    why: 'Ex 9.7 is the template for every design question, including Problem Set 1 P6 and Tutorial 2 Q3.',
    picture: {
      visual: { widget: 'designWizard' },
      caption: 'Walk the budget top-down: power fixes the current, swing fixes how much room the overdrives share.',
    },
    predict: {
      prompt: 'The first number to fix in an op-amp design, even when nobody asks for it, is…',
      choices: ['W/L of the input pair', 'The power budget (it sets the currents)', 'The gain'],
      answer: 1,
      explain: 'Power ÷ VDD gives the total current. Every overdrive and every W/L follows from the currents.',
    },
    idea: `A recipe you can run on any spec sheet:

1. **Power → current**: $I_{SS} \\approx P/V_{DD}$ (Ex 9.7 keeps a little for bias: 10 mW → 3 mA).
2. **Swing → headroom**: each output swings half the differential swing; the rest of VDD is shared by the stacked overdrives and VISS.
3. **Choose overdrives**: largest for the tail, then PMOS, then NMOS (the input pair gets the smallest for high gm).
4. **Sizes**: every $W/L = 2I_D/(\\mu C_{ox}V_{ov}^2)$.
5. **Check the gain**. If short, **lengthen** the devices off the signal path: $g_m r_O \\propto \\sqrt{WL/I_D}$, so doubling W and L keeps Vov but doubles rO.
6. **Bias voltages** at the saturation edges (Vin,CM, Vb1, Vb2).`,
    rule: {
      tex: ['I_{SS} = \\dfrac{P}{V_{DD}}', '\\dfrac{W}{L} = \\dfrac{2I_D}{\\mu C_{ox}V_{ov}^2}', 'g_m r_O \\propto \\sqrt{\\dfrac{WL}{I_D}}'],
      symbols: ['Vov', 'WL', 'gmro'],
      note: 'Start with power, even if nobody asked. Gain lives in √(WL/ID).',
    },
    worked: { bank: 'bank-ex97' },
    yourTurn: { generators: ['l3-design'], count: 2 },
    lockIn: {
      summary: 'Power → current → swing budget → overdrives → W/L → gain check → lengthen off-path devices → bias at the edges.',
      hook: '“Start with power, even if nobody asked.”',
      cards: [
        { id: 'c-l3-steps', front: 'The six design steps (Ex 9.7)?', back: 'Power → currents; swing → headroom; choose overdrives; W/L; check gain (lengthen off-path devices); bias voltages at the edges.' },
        { id: 'c-l3-length', front: 'How do you raise gm·rO without changing Vov?', back: 'Scale W and L up together: W/L (and Vov, gm) stay, λ ∝ 1/L drops, rO rises. gm·rO ∝ √(WL/ID).' },
      ],
    },
  },
  {
    id: 'l3-scaling',
    unit: 'L3',
    title: 'Linear scaling and bias tracking',
    minutes: 10,
    refs: { razavi: '§9.2.3, Example 9.8, Fig. 9.12', notes: 'Lec 04', conversation: 'PS1 P9' },
    why: 'Ex 9.8 and Problem Set 1 P9: a bigger load at the same speed means scaling every width and current, and knowing what does not change.',
    picture: {
      visual: { widget: 'scalingMini' },
      caption: 'Scale widths and currents by α. gm and power grow, rO shrinks, and the overdrives, gain and swing stay exactly the same.',
    },
    predict: {
      prompt: 'You multiply every width and every current by 4. The DC gain…',
      choices: ['×4', '×2', 'does not change'],
      answer: 2,
      explain: 'Vov is unchanged, gm ×4 and rO ÷4: gm·rO stays the same. What you buy is the ability to drive 4× the capacitance at the same ωu.',
    },
    idea: `**Linear scaling**: multiply every width and every bias current by α. The current density stays the same, so every {{Vov}} stays the same, and so do the swing and the bias voltages. $g_m$ grows by α and $r_O$ shrinks by α, so the gain $g_m r_O$ is **unchanged**. Power grows by α.

What you gain: $\\omega_u = g_m/C_L$ stays the same with α times the load capacitance.

**Bias tracking (Fig 9.12):** make Vb1 with a device that copies $V_{ov1} + V_{GS3}$, so the cascode bias follows process and temperature instead of being a fixed number.`,
    rule: {
      tex: ['W,\\,I \\times\\alpha \\Rightarrow g_m\\times\\alpha,\\; r_O\\div\\alpha,\\; V_{ov},\\,A_v\\ \\text{unchanged}', '\\alpha = \\dfrac{C_{L,new}}{C_{L,old}}\\ (\\text{same }\\omega_u)', 'V_{GS,b1} = V_{ov1,2} + V_{GS3,4}'],
      symbols: ['Vov', 'gm', 'rO', 'omegau'],
      note: 'Linear scaling only buys speed and silence.',
    },
    worked: { bank: 'bank-ex98' },
    yourTurn: { generators: ['l3-design', 'u12-pole'], count: 2 },
    lockIn: {
      summary: 'Scale W and I by α: Vov, gain, swing unchanged; gm ×α, rO ÷α, power ×α; drives α·CL at the same ωu.',
      hook: '“Linear scaling only buys speed and silence.”',
      cards: [{ id: 'c-l3-scale', front: 'Linear scaling by α: what changes?', back: 'gm ×α, rO ÷α, power ×α, CL capability ×α. Vov, gain and swing do not change.' }],
    },
  },

  // ─── L4 Folded cascode ───────────────────────────────────────────────────
  {
    id: 'l4-folding',
    unit: 'L4',
    title: 'Folded cascode: don’t stack, fold',
    minutes: 14,
    refs: { razavi: '§9.2.4–9.2.6', notes: 'Lec 05, Lec 06', conversation: 'Folded-cascode lecture; PS1 P6, P8' },
    why: 'Tutorial 2 Q3 and Problem Set 1 P6–P8: the folded cascode fixes the telescopic’s swing and buffer problems.',
    picture: {
      visual: { widget: 'foldedMini' },
      caption: 'Eleven live transistors. Slide the input CM from below ground up to 1.5 V: the PMOS input is happy the whole way.',
    },
    predict: {
      prompt: 'In a PMOS-input folded cascode, how much current does each bottom NMOS source (M5, M6) carry?',
      choices: ['I', 'ISS/2', 'ISS/2 + I'],
      answer: 2,
      explain: 'M5 sinks both the input device’s current (ISS/2) and the cascode branch current I that flows down through M3.',
    },
    idea: `Take the telescopic, and instead of stacking the input pair under the cascodes, **fold** it: the input pair’s current is injected sideways into nodes X, Y, and flows down through NMOS sources M5, M6 that carry $I_{SS}/2 + I$.

The input pair and the tail are no longer in the output stack, so the output only pays **four** overdrives: $V_{ov3} + V_{ov5}$ below and $|V_{ov7}| + |V_{ov9}|$ above.

**Folding flips the inequality:** with a PMOS input, the input CM is held from **below** by M1’s fence against X: $V_{in,CM} \\ge V_{ov5} - |V_{thp}|$, which can be below ground. Input CM = output CM becomes possible.`,
    rule: {
      tex: ['I_{D5,6} = \\tfrac{I_{SS}}{2} + I', 'V_{out} \\in [\\,V_{ov3}+V_{ov5},\\; V_{DD} - |V_{ov7}| - |V_{ov9}|\\,]', 'V_{in,CM,min} = V_{ov5} - |V_{thp}|,\\;\\; V_{in,CM,max} = V_{DD} - V_{ISS} - |V_{GS1}|'],
      symbols: ['ISS', 'Vov', 'VISS'],
      note: 'Folding costs current (two extra branches) and adds a pole at the folding node.',
    },
    worked: { bank: 'bank-ps1p6' },
    yourTurn: { generators: ['l4-folded'], count: 2 },
    lockIn: {
      summary: 'Folded: input pair off to the side, M5,6 carry ISS/2 + I, four overdrives of headroom, PMOS input can go below ground.',
      hook: '“Don’t stack — fold. Folding flips the inequality.”',
      cards: [
        { id: 'c-l4-current', front: 'Current in M5,6 of a folded cascode?', back: 'ISS/2 + I.' },
        { id: 'c-l4-iss2', front: 'Lec 5, fully differential folded cascode: how big must the bottom sources ISS2 be?', back: 'ISS2 = ISS1 + ISS/2: they carry the cascode branch current plus half the input pair’s tail.' },
        { id: 'c-l4-swing', front: 'Folded-cascode output range?', back: 'Vov3 + Vov5 ≤ Vout ≤ VDD − |Vov7| − |Vov9| (four overdrives).' },
      ],
    },
    lab: { id: 'folded' },
  },
  {
    id: 'l4-gain',
    unit: 'L4',
    title: 'Folded-cascode gain and the current divider',
    minutes: 12,
    refs: { razavi: '§9.2.4', notes: 'Lec 05, Lec 06', conversation: 'PS1 P7' },
    why: 'Problem Set 1 P7: Gm = gm1 is an approximation; the folding node splits the signal current, and you can quantify it.',
    picture: {
      visual: { widget: 'foldedGain' },
      caption: 'Most of M1’s signal current takes the easy path into the cascode source; a few percent leaks into rO1 ‖ rO5.',
    },
    predict: {
      prompt: 'At the folding node, M1’s signal current can go into the cascode source (≈ 1/gm3) or into rO1 ‖ rO5. Most of it goes…',
      choices: ['into rO1 ‖ rO5', 'into the cascode source', 'half and half'],
      answer: 1,
      explain: 'The cascode source is the easy path: ≈ 1/gm3 is kilohms, rO1 ‖ rO5 is tens of kilohms. Smallest resistance wins.',
    },
    idea: `The gain is still {{Gm}} × {{Rout}}.

**Rout** = {{Rup}} ‖ {{Rdown}}: looking up, $g_{m7}r_{O7}r_{O9}$; looking down, $g_{m3}r_{O3}(r_{O1}\\parallel r_{O5})$ — M1 and M5 both hang on the folding node.

**Gm**: M1’s signal current arrives at X and splits by the **current divider**. The share that reaches the output is
$\\dfrac{r_{O1}\\parallel r_{O5}}{(1/g_{m3}\\parallel r_{O3}) + (r_{O1}\\parallel r_{O5})}$, typically 90%+. So $G_m \\approx g_{m1}$ is close, and the exact version is a few percent lower.`,
    rule: {
      tex: ['R_{up} = g_{m7}r_{O7}r_{O9},\\quad R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O5})', 'G_m = g_{m1}\\,\\dfrac{r_{O1}\\parallel r_{O5}}{(1/g_{m3}\\parallel r_{O3}) + (r_{O1}\\parallel r_{O5})}', 'A_v = G_m\\,(R_{up}\\parallel R_{down})'],
      symbols: ['Rup', 'Rdown', 'Gm', 'gm', 'rO'],
      note: 'Your Lec 5 numbers the folded cascode differently: bottom sources M9, M10, PMOS cascodes M5, M6, top sources M7, M8. In that numbering Rup = gm5·rO5·rO7 and Rdown = gm3·rO3·(rO1 ‖ rO9). Same formulas; the app follows Razavi and your tutorial sheets.',
    },
    worked: { bank: 'bank-ps1p7' },
    yourTurn: { generators: ['l4-folded', 'u9-cascode'], count: 2 },
    lockIn: {
      summary: 'Folded: Rup = gm7rO7rO9, Rdown = gm3rO3(rO1 ‖ rO5); Gm ≈ gm1 (current divider gives the exact few-percent loss).',
      hook: '“The cascode source is the easy path.”',
      cards: [{ id: 'c-l4-rdown', front: 'Rdown of a folded cascode?', back: 'gm3·rO3·(rO1 ‖ rO5): both M1 and M5 load the folding node.' }],
    },
    lab: { id: 'folded' },
  },
];
