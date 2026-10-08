/**
 * Lectures after the mid-sem that your notes already cover (L5–L9): two-stage op amp, gain boosting,
 * CMFB (concept and techniques), input range and slew rate. Tutorials 3–6 and Quiz 2 are the worked
 * examples. L10–L14 live in stability.ts.
 */
import type { Lesson } from '../types';

export const LATE_LESSONS: Lesson[] = [
  {
    id: 'l5-twostage',
    unit: 'L5',
    title: 'Two-stage op amp: one stage for gain, one for swing',
    minutes: 12,
    refs: { razavi: '§9.3', notes: 'Lec 07', conversation: 'Tutorial 3 Q2–Q3' },
    why: 'Tutorial 3 Q2 and Q3 are two-stage op amps: find the CM level at X, Y, the gain A1·A2 and the swing.',
    picture: {
      visual: { widget: 'twoStageMini' },
      caption: 'Move the output level: it can go almost rail to rail. Move the input CM: M1 fails when its gate passes X + Vth.',
    },
    predict: {
      prompt: 'The first stage has gain 35 and the second stage gain 13. The total gain is about…',
      choices: ['48', '455', '35'],
      answer: 1,
      explain: 'Stages in cascade multiply: 35 × 13 ≈ 455 (Tutorial 3 Q2 gives 451).',
    },
    idea: `A cascode gives gain but eats swing. A **two-stage** op amp splits the jobs: the **first stage** (a differential pair, maybe cascoded) makes the gain; the **second stage** (a common-source device with a current-source load) makes the swing, because its output has only one transistor at each rail.

The gains multiply: $A = A_1 A_2$. The first stage’s output CM level (X, Y) is not free: it is the gate of the second stage, so it must sit where M5 carries its current: $V_X = V_{DD} - |V_{GS5}|$. That also caps the input CM at $V_X + V_{th}$.

The price: two high-resistance nodes, two poles — compensation (L13–L14).`,
    rule: {
      tex: ['A_v = A_1 A_2,\\quad A_1 = g_{m1}(r_{O1}\\parallel r_{O3}),\\; A_2 = g_{m5}(r_{O5}\\parallel r_{O7})', 'V_{X} = V_{DD} - |V_{GS5}|', 'V_{pp,diff} = 2(V_{DD} - |V_{ov5}| - V_{ov7})'],
      symbols: ['Av', 'gm', 'rO', 'Vov'],
    },
    worked: { bank: 'bank-t3q2' },
    yourTurn: { generators: ['l5-twostage'], count: 2 },
    lockIn: {
      summary: 'Two stages: gain from the first, swing from the second. A = A1·A2; X sits one |VGS5| below VDD; swing 2(VDD − |Vov5| − Vov7).',
      hook: '“High gain, then high swing.”',
      cards: [{ id: 'c-l5-gain', front: 'Two-stage op amp gain?', back: 'A1·A2, each a gm·(rO ‖ rO) CS-type stage.' }],
    },
  },
  {
    id: 'l6-boost',
    unit: 'L6',
    title: 'Gain boosting: make the cascode fight back harder',
    minutes: 12,
    refs: { razavi: '§9.4', notes: 'Lec 06–09', conversation: 'Tutorial 4' },
    why: 'Tutorial 4 is all gain boosting: bias the auxiliary amplifier, then find how much it multiplies Rout.',
    picture: {
      visual: { widget: 'gainBoostMini' },
      caption: 'Turn up the auxiliary gain A1 and watch Rout climb by (1 + A1). The bottom bar is the trap: a simple load throws it away.',
    },
    predict: {
      prompt: 'An auxiliary amplifier of gain A1 = 100 holds the cascode’s source still. Rout grows by about…',
      choices: ['2×', '100×', '10000×'],
      answer: 1,
      explain: 'The cascode’s gm·rO·rO term is multiplied by (1 + A1) ≈ 101.',
    },
    idea: `In a cascode, M2 fights changes in its current because its source X is loaded by rO1. With **gain boosting** an auxiliary amplifier watches X and drives M2’s gate the opposite way: if X rises, M2’s gate falls by A1 times as much. M2 fights back (1 + A1) times harder:

$R_{out} = r_{O1} + r_{O2} + (1 + A_1)\\,g_{m2}r_{O2}r_{O1}$.

With a single-transistor auxiliary (a CS stage, $A_1 = g_{m3}r_{O3}$) the whole amplifier’s gain reaches about $(g_m r_O)^3$. The cost: headroom ($V_{out,min} = V_{GS3} + V_{ov2}$) and a doublet in the frequency response. And the load must be boosted too — the load trap again.`,
    rule: {
      tex: ['R_{out} = r_{O1} + r_{O2} + (1 + A_1)\\,g_{m2}r_{O2}r_{O1}', 'A_1 = g_{m3}r_{O3}\\ (\\text{CS auxiliary})', 'V_{out,min} = V_{GS3} + V_{ov2}'],
      symbols: ['Rout', 'gm', 'rO'],
    },
    worked: { bank: 'bank-t4q1' },
    yourTurn: { generators: ['l6-boost'], count: 2 },
    lockIn: {
      summary: 'Gain boosting multiplies the cascode Rout by (1 + A1). Costs headroom (VGS3 + Vov2) and needs a boosted load too.',
      hook: '“Hold the source still and the cascode fights (1 + A1) times harder.”',
      cards: [{ id: 'c-l6-rout', front: 'Rout of a gain-boosted cascode?', back: 'rO1 + rO2 + (1 + A1)·gm2·rO2·rO1.' }],
    },
  },
  {
    id: 'l7-cmfb',
    unit: 'L7',
    title: 'Common-mode feedback: why fully differential outputs float',
    minutes: 12,
    refs: { razavi: '§9.7.1–9.7.2', notes: 'Lec 09–11', conversation: 'Tutorial 5 Q1' },
    why: 'Tutorial 5 Q1 and Quiz 2: size the triode sensing devices so the output CM sits exactly where you want it.',
    picture: {
      visual: { widget: 'cmfbMini' },
      caption: 'The two triode devices in the tail sense the outputs. Move P and see the output CM the loop settles on.',
    },
    predict: {
      prompt: 'A fully differential op amp has a PMOS current source (500 µA) on top and an NMOS pair drawing 500 µA below each output. Where does the output CM sit?',
      choices: ['Exactly mid-supply', 'Nowhere definite: a 1% current mismatch drives it to a rail', 'At VDD'],
      answer: 1,
      explain: 'Two current sources in series: any mismatch has to flow into a huge resistance, so the output voltage runs away. Something must measure the CM and correct it.',
    },
    idea: `In a fully differential stage each output sits between two **current sources**: one on top, one below. Their currents never match exactly, and the difference has nowhere to go but into a huge Rout — so the output **common mode floats** toward a rail.

**Common-mode feedback (CMFB)** fixes it: **sense** $V_{out,CM} = (V_{out1} + V_{out2})/2$, **compare** it with a reference, and **adjust** one of the current sources.

Sensing options: two resistors R1 = R2 (simple, but they load the output: gain drops to $g_m(r_O\\parallel r_O\\parallel R)$), source followers, or **deep-triode devices** in the tail whose resistance depends on $V_{out1} + V_{out2}$.`,
    rule: {
      tex: ['V_{out,CM} = \\tfrac{V_{out1} + V_{out2}}{2}', 'R_{tot} = \\dfrac{1}{\\mu_n C_{ox}\\frac{W}{L}(V_{out1} + V_{out2} - 2V_{th})}', 'V_P = 2I_D\\,R_{tot}'],
      symbols: ['VCM', 'WL', 'muCox'],
    },
    worked: { bank: 'bank-t5q1' },
    yourTurn: { generators: ['l7-triode'], count: 2 },
    lockIn: {
      summary: 'Fully differential outputs float (two current sources in series). CMFB senses Vout,CM, compares, and corrects a current source.',
      hook: '“Sense, compare, correct.”',
      cards: [
        { id: 'c-l7-why', front: 'Why does a fully differential op amp need CMFB?', back: 'Each output sits between two current sources; any mismatch drives the output CM to a rail.' },
        { id: 'c-l7-triode', front: 'Resistance of two deep-triode sensing devices in parallel?', back: '1/(µnCox(W/L)(Vout1 + Vout2 − 2Vth)).' },
      ],
    },
  },
  {
    id: 'l8-cmfb',
    unit: 'L8',
    title: 'CMFB techniques: the loop and its gain',
    minutes: 12,
    refs: { razavi: '§9.7.3', notes: 'Lec 11–12', conversation: 'Quiz 2' },
    why: 'Quiz 2 (all three parts) is a triode-sensing CMFB on a telescopic: VD4, VP, the sensing W/L, Vout,min and Rout.',
    picture: {
      visual: { widget: 'cmfbMini' },
      caption: 'The same loop, seen from its equation: whatever VP the rest of the circuit sets, Vout1 + Vout2 must follow.',
    },
    predict: {
      prompt: 'In a triode-sensing CMFB, both outputs rise by 50 mV. The triode devices’ resistance…',
      choices: ['rises, pulling the outputs further up', 'falls, pulling more current and the outputs back down', 'does not change'],
      answer: 1,
      explain: 'Higher gate voltage, lower triode resistance, more tail current, bigger drop across the loads: the outputs come back down. Negative feedback.',
    },
    idea: `Close the loop on paper: the tail current $2I_D$ must flow through the sensing resistance with $V_P$ across it, so
$V_{out1} + V_{out2} = \\dfrac{2I_D}{\\mu_n C_{ox}(W/L)\\,V_P} + 2V_{th}$.

Anything that fixes $V_P$ (for example a cascode bias: $V_P = V_{b1} - V_{GS}$) therefore fixes the output CM. In practice an **error amplifier** compares $V_{out,CM}$ with $V_{REF}$ and drives a current source (Tutorial 5 Q2, Lec 12): the **CMFB loop gain** is error-amp gain × how strongly that current source moves the output CM.

Differential signals do not disturb it: $V_{out1} + V_{out2}$ is unchanged when the outputs move in opposite directions.`,
    rule: {
      tex: ['V_{out1} + V_{out2} = \\dfrac{2I_D}{\\mu_n C_{ox}(W/L)\\,V_P} + 2V_{th}', '\\text{a differential signal leaves } V_{out1} + V_{out2}\\text{ unchanged}'],
      symbols: ['VCM', 'WL', 'Vth'],
    },
    worked: { bank: 'bank-quiz2a' },
    yourTurn: { generators: ['l7-triode'], count: 2 },
    lockIn: {
      summary: 'Triode sensing: Vout1 + Vout2 = 2ID/(µnCox(W/L)VP) + 2Vth. Fix VP and the output CM is fixed; differential signals cancel in the sum.',
      hook: '“The sum is what the loop sees.”',
      cards: [{ id: 'c-l8-sum', front: 'Output CM set by a triode CMFB loop?', back: 'Vout1 + Vout2 = 2ID/(µnCox(W/L)VP) + 2Vth.' }],
    },
  },
  {
    id: 'l9-slew',
    unit: 'L9',
    title: 'Slew rate: a fixed tap before the exponential',
    minutes: 12,
    refs: { razavi: '§9.9', notes: 'Lec 13–14', conversation: 'Tutorial 6' },
    why: 'Tutorial 6 Q1–Q3: when does an op amp slew, how long, and what limits the slew rate of a folded cascode?',
    picture: {
      visual: { widget: 'settleMini' },
      caption: 'Tick “big step”: the output ramps in a straight line (slewing) before the exponential takes over.',
    },
    predict: {
      prompt: 'A 5-T OTA with ISS = 200 µA drives 5 pF. Its slew rate is…',
      choices: ['20 V/µs', '40 V/µs', '80 V/µs'],
      answer: 1,
      explain: 'SR = ISS/CL = 200 µA / 5 pF = 40 V/µs: when the pair is fully steered the whole tail current goes into (or out of) CL.',
    },
    idea: `For a small step the output follows $1 - e^{-t/\\tau}$ with initial slope $V_{final}/\\tau$. But the output can only move as fast as the available current can charge $C_L$: the **slew rate** {{SR}}. If the linear response would need a steeper start, the op amp **slews**: a straight ramp at SR (the input pair is fully steered, $|v_d| > \\sqrt{2}V_{ov}$), then the exponential finishes the job once the remaining error is $SR\\cdot\\tau$.

Critical step: slewing starts when $V_0 A_{CL}/\\tau > SR$.
Folded cascode: if the folding current $I_P < I_{SS}$, a branch turns off and SR drops to $I_P/C_L$; with $I_P \\ge I_{SS}$ it is $I_{SS}/C_L$ both ways.`,
    analogy: 'A fixed tap filling a bucket: however far the level is from the mark, it cannot rise faster than the tap allows.',
    rule: {
      tex: ['SR = \\dfrac{I_{SS}}{C_L}', 't_{slew} = \\dfrac{V_{final} - SR\\,\\tau}{SR}', 'V_{0,crit} = \\dfrac{SR\\,\\tau}{A_{CL}}'],
      symbols: ['SR', 'tau', 'ISS', 'CL'],
    },
    worked: { bank: 'bank-t6q2' },
    yourTurn: { generators: ['l9-slew', 'u12-settle'], count: 3 },
    lockIn: {
      summary: 'SR = ISS/CL (folded: needs IP ≥ ISS). Big steps ramp at SR until the error is SR·τ, then settle exponentially.',
      hook: '“A fixed tap fills the bucket; then eat the cake.”',
      cards: [
        { id: 'c-l9-slew', front: 'When does an op amp slew?', back: 'When the linear response would need a slope above SR: V0·ACL/τ > ISS/CL.' },
        { id: 'c-l9-folded', front: 'Folded cascode slew rate?', back: 'ISS/CL if the folding current IP ≥ ISS; otherwise IP/CL (a cascode branch turns off).' },
      ],
    },
  },
];
