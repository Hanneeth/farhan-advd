/**
 * Milestone 2 lessons: U6–U9 (impedance rules, mirrors, CS loads, degeneration, follower, common gate,
 * cascode, telescopic). Same §5.2 template; worked examples come from generators (numbers never typed in).
 */
import type { Lesson } from '../types';

export const SINGLE_STAGE_LESSONS: Lesson[] = [
  // ─── U6 ──────────────────────────────────────────────────────────────────
  {
    id: 'u6-rules',
    unit: 'U6',
    title: 'Three impedance rules: gate ∞, drain big, source small',
    minutes: 12,
    refs: { razavi: '§3.3–3.5', conversation: 'Part 2, Modules 9–10 (the three impedance rules)' },
    why: 'Every gain in your tutorials is Gm × Rout, and Rout is always built from these three rules. Exam Q1(b) needs Rout = rO2 ‖ rO4.',
    picture: {
      visual: { widget: 'impedanceMini' },
      caption: 'Pick a terminal. Dots flow in from a test source: a small resistance lets lots of current in. Drag RS or RD and watch it get multiplied or divided.',
    },
    predict: {
      prompt: 'You put RS = 10 kΩ under an NMOS source (gm·rO = 50). Looking into the drain, roughly what do you see?',
      choices: ['About rO + 10 kΩ', 'About rO + 50 × 10 kΩ', 'About 1/gm'],
      answer: 1,
      explain: 'Up multiplies: RS is boosted by (1 + gm·rO). The transistor fights any change in its current, so the drain looks far stiffer.',
    },
    idea: `Look into one terminal and ask: if I wiggle this node, how much current flows?

**Gate:** none at all, it is a capacitor plate. $R = \\infty$.
**Drain:** the device holds its current almost constant, so you see a big {{rO}}. Put {{RS}} under the source and it fights harder: $R = r_O + (1+g_m r_O)R_S \\approx g_m r_O R_S$.
**Source:** a small wiggle changes $V_{GS}$ directly, so the device answers with lots of current: $R \\approx 1/g_m$ (plus $R_D/(g_m r_O)$ if the drain is loaded).

Memory hook: **up multiplies, down divides — by $g_m r_O$.**`,
    analogy: 'The gate is a sealed door. The drain is a stubborn tap that refuses to change its flow. The source is a wide-open drain in the floor.',
    rule: {
      tex: ['R_{\\text{gate}} = \\infty', 'R_{\\text{drain}} = r_O + (1 + g_m r_O)R_S \\approx g_m r_O R_S', 'R_{\\text{source}} = \\dfrac{R_D + r_O}{1 + g_m r_O} \\approx \\dfrac{1}{g_m} + \\dfrac{R_D}{g_m r_O}'],
      symbols: ['gm', 'rO', 'RS', 'RD'],
      note: 'With RS = 0 the drain rule gives plain rO; with RD = 0 the source rule gives 1/gm ‖ rO.',
    },
    worked: { generator: 'u6-impedance', seed: 7 },
    yourTurn: { generators: ['u6-impedance'], count: 3 },
    lockIn: {
      summary: 'Gate ∞. Drain rO, and RS below it is multiplied by gm·rO. Source ≈ 1/gm, and RD above it is divided by gm·rO.',
      hook: '“Gate infinite, drain big, source small. Up multiplies, down divides — by gm·rO.”',
      cards: [
        { id: 'c-u6-gate', front: 'Resistance looking into a gate?', back: '∞ (no DC gate current).' },
        { id: 'c-u6-drain', front: 'Resistance into a drain with RS under the source?', back: 'rO + (1 + gm·rO)·RS ≈ gm·rO·RS.' },
        { id: 'c-u6-source', front: 'Resistance into a source with RD on the drain?', back: '(RD + rO)/(1 + gm·rO) ≈ 1/gm + RD/(gm·rO).' },
      ],
    },
    lab: { id: 'impedance' },
  },
  {
    id: 'u6-mirror',
    unit: 'U6',
    title: 'Diodes and current mirrors',
    minutes: 12,
    refs: { razavi: '§5.1–5.2', notes: 'Current mirror notes', conversation: 'Part 2, Module 11' },
    why: 'Every tail current in your tutorials and the exam is set by a mirror: Tutorial 1 Q1 asks for (W/L)3, (W/L)4 and R of one.',
    picture: {
      visual: { widget: 'mirrorMini' },
      caption: 'Change IREF and the size ratio. Then drag M2’s drain down and watch the copy fail below Vov.',
    },
    predict: {
      prompt: 'M2 is twice as wide as M1 and has the same VGS. IREF = 20 µA. What is Iout?',
      choices: ['10 µA', '20 µA', '40 µA'],
      answer: 2,
      explain: 'Same VGS, same overdrive; the square law then makes current proportional to W/L. Twice the width, twice the current.',
    },
    idea: `Tie a transistor’s gate to its drain: a **diode connection**. Its drain can never fall below its gate, so it is **always saturated**, and it settles at whatever {{VGS}} carries the current you push in. From outside it looks like a resistor of about $1/g_m$.

Now share that gate with a second transistor. Same $V_{GS}$ means same {{Vov}}, so by the square law its current is the **same per unit of W/L**: a **current mirror**. The copy works only while M2 stays saturated: its drain must stay above $V_{ov}$.

The price: a diode costs a **full** $V_{GS} = V_{th} + V_{ov}$ of headroom.`,
    rule: {
      tex: ['I_{out} = I_{REF}\\,\\dfrac{(W/L)_2}{(W/L)_1}', 'V_{GS} = V_{th} + \\sqrt{\\dfrac{2 I_{REF}}{\\mu_n C_{ox}(W/L)_1}}', 'V_{out} \\ge V_{ov}\\quad\\text{(M2 saturated)}'],
      symbols: ['VGS', 'Vov', 'WL', 'muCox'],
      note: 'Resistance into a diode = 1/gm ‖ rO ≈ 1/gm.',
    },
    worked: { generator: 'u6-mirror', seed: 3 },
    yourTurn: { generators: ['u6-mirror'], count: 3 },
    lockIn: {
      summary: 'Diode: gate tied to drain, always saturated, looks like 1/gm, costs a full VGS. Mirror: same VGS, current scales with W/L while the copy stays above Vov.',
      hook: '“Same VGS, same current per W/L.”',
      cards: [
        { id: 'c-u6-mirror', front: 'Current-mirror output current?', back: 'Iout = IREF·(W/L)out/(W/L)ref (λ = 0).' },
        { id: 'c-u6-diode', front: 'Small-signal resistance of a diode-connected MOSFET?', back: '1/gm ‖ rO ≈ 1/gm.' },
        { id: 'c-u6-diodecost', front: 'Headroom cost of a diode-connected device?', back: 'A full |VGS| = |Vth| + |Vov|, not just |Vov|.' },
      ],
    },
  },

  // ─── U7 ──────────────────────────────────────────────────────────────────
  {
    id: 'u7-loads',
    unit: 'U7',
    title: 'CS with every load: Av = −Gm·Rout',
    minutes: 14,
    refs: { razavi: '§3.3.2–3.3.3', conversation: 'Part 2, Module 12' },
    why: 'The 5-T OTA in your exam is a CS stage with a current-source load: Av = gm1(rO2 ‖ rO4). Same method for every load.',
    picture: {
      visual: { widget: 'csLoads' },
      caption: 'Switch the load. The input transistor never changes; watch only the output resistance (and the gain bar) change.',
    },
    predict: {
      prompt: 'Which load gives the most gain from the same input transistor?',
      choices: ['Diode-connected PMOS', 'Resistor', 'PMOS current source'],
      answer: 2,
      explain: 'Gain = Gm × Rout. A current source looks like rO (tens to hundreds of kΩ); a diode looks like 1/gm (a few kΩ). Big resistance, big gain.',
    },
    idea: `The input device M1 always does the same job: it turns $v_{in}$ into a current $g_{m1} v_{in}$. The **load decides what resistance that current flows into**. So only {{Rout}} changes:

- **Resistor:** $R_D \\parallel r_{O1}$
- **Diode:** $1/g_{m2} \\parallel r_{O1} \\parallel r_{O2}$ — small, so low gain
- **Current source:** $r_{O1} \\parallel r_{O2}$ — big, high gain
- **Active (both gates driven):** same Rout, but both devices make current: $G_m = g_{m1} + g_{m2}$

Then $A_v = -G_m R_{out}$. Everything at the output node is **in parallel**, and the smallest resistance wins.`,
    rule: {
      tex: ['A_v = -G_m R_{out}', 'R_{out}:\\; R_D\\parallel r_{O1} \\;\\big|\\; \\tfrac{1}{g_{m2}}\\parallel r_{O1}\\parallel r_{O2} \\;\\big|\\; r_{O1}\\parallel r_{O2}', 'G_m = g_{m1}\\;(\\text{active load: } g_{m1}+g_{m2})'],
      symbols: ['Gm', 'Rout', 'gm', 'rO'],
      note: 'Equal rO in parallel: rO ‖ rO = rO/2.',
    },
    worked: { generator: 'u7-cs-load', seed: 12 },
    yourTurn: { generators: ['u7-cs-load'], count: 3 },
    lockIn: {
      summary: 'Gm from the input device; Rout = everything at the output node in parallel; Av = −Gm·Rout. Diode load = low gain; current-source load = high gain.',
      hook: '“Same Gm, different Rout.”',
      cards: [
        { id: 'c-u7-cs-src', front: 'CS gain with a current-source load?', back: 'Av = −gm1(rO1 ‖ rO2).' },
        { id: 'c-u7-diode', front: 'CS gain with a diode load (λ = 0)?', back: 'Av = −gm1/gm2 = −√(µn(W/L)1/(µp(W/L)2)).' },
        { id: 'c-u7-active', front: 'CS gain with an active (CMOS) load?', back: 'Av = −(gm1 + gm2)(rO1 ‖ rO2).' },
      ],
    },
    lab: { id: 'cs' },
  },
  {
    id: 'u7-degen',
    unit: 'U7',
    title: 'Degeneration and the ratio rule',
    minutes: 10,
    refs: { razavi: '§3.3.3', conversation: 'Part 2, Module 13 (ratio rule)' },
    why: 'The ratio rule gives any gain by inspection, including the CM gain of a differential pair in Tutorial 1 Q4: ACM = −RD/(1/gm + 2RSS).',
    picture: {
      visual: { widget: 'degenMini' },
      caption: 'Slide RS from 0 upward. The gain drops from gm·RD toward the plain resistor ratio RD/RS.',
    },
    predict: {
      prompt: '1/gm = 1 kΩ, RD = 10 kΩ. You add RS = 1 kΩ. The gain magnitude becomes about…',
      choices: ['10', '5', '20'],
      answer: 1,
      explain: 'Ratio rule: RD/(1/gm + RS) = 10k/2k = 5. RS doubled the resistance in the source path, so the gain halved.',
    },
    idea: `Put a resistor {{RS}} under the source. When the input rises, the current rises, the source rises with it, and the real $V_{GS}$ rises by less: the resistor **fights back** (negative feedback). The stage becomes weaker: $G_m = g_m/(1 + g_m R_S)$.

The quickest way to get the gain is the **ratio rule**: count the transistor itself as a resistor $1/g_m$ in the source path. Then

$|A_v| = \\dfrac{\\text{resistance at the drain}}{\\text{resistance in the source path}} = \\dfrac{R_D}{1/g_m + R_S}$.

When $R_S \\gg 1/g_m$ the gain is just $R_D/R_S$: less gain, but set by resistors, so it is linear and predictable.`,
    analogy: 'A see-saw: output movement over input movement is the ratio of the two arm lengths.',
    rule: {
      tex: ['G_m = \\dfrac{g_m}{1 + g_m R_S} = \\dfrac{1}{1/g_m + R_S}', '|A_v| = \\dfrac{R_D}{1/g_m + R_S}\\quad(\\lambda = 0)'],
      symbols: ['Gm', 'gm', 'RS', 'RD'],
      note: 'Ratio rule for any stage: |Av| = (R at the output terminal) ÷ (R in the source path, the transistor counting as 1/gm).',
    },
    worked: { generator: 'u7-degen', seed: 4 },
    yourTurn: { generators: ['u7-degen', 'u7-cs-load'], count: 3 },
    lockIn: {
      summary: 'Degeneration trades gain for linearity: Gm = gm/(1 + gm·RS). Ratio rule: |Av| = RD/(1/gm + RS).',
      hook: '“Top resistance over bottom resistance; the transistor counts as 1/gm.”',
      cards: [
        { id: 'c-u7-degen', front: 'Gm of a degenerated CS stage?', back: 'gm/(1 + gm·RS) = 1/(1/gm + RS).' },
        { id: 'c-u7-ratio', front: 'State the ratio rule.', back: '|Av| = (resistance at the output terminal) ÷ (resistance in the source path, with the transistor as 1/gm).' },
      ],
    },
  },

  // ─── U8 ──────────────────────────────────────────────────────────────────
  {
    id: 'u8-follower',
    unit: 'U8',
    title: 'Source follower: a level shifter with gain ≈ 1',
    minutes: 10,
    refs: { razavi: '§3.4', conversation: 'Part 2, Module 14' },
    why: 'Followers are the output buffers and level shifters in op amps; the exam asks where the output sits, which is one VGS below the input.',
    picture: {
      visual: { widget: 'followerMini' },
      caption: 'Move Vin. The output tracks it, always one VGS lower. Change I and watch VGS change.',
    },
    predict: {
      prompt: 'Vin rises by 100 mV. By how much does the output of a source follower rise?',
      choices: ['About 100 mV', 'About 1 V (big gain)', 'It falls by 100 mV'],
      answer: 0,
      explain: 'The current is fixed by the source below, so VGS is fixed; the source must move with the gate. Gain ≈ 1, not inverting.',
    },
    idea: `Input on the **gate**, output on the **source**, drain at VDD: the **source follower** (common drain). A current source fixes the current, so $V_{GS}$ is fixed too. Then the source must **follow** the gate, one full {{VGS}} lower: $V_{out} = V_{in} - V_{GS}$.

Small signal, ratio rule: output resistance at the source over the source path $1/g_m$ plus that same resistance. With an ideal current source only {{rO}} is left: $A_v = r_O/(1/g_m + r_O) \\approx 1$.

Looking back into the output you see the **source rule**: $R_{out} \\approx 1/g_m$. Small output resistance: a good buffer.`,
    rule: {
      tex: ['V_{out} = V_{in} - V_{GS}', 'A_v = \\dfrac{R_S\\parallel r_O}{1/g_m + R_S\\parallel r_O} \\approx 1', 'R_{out} = \\tfrac{1}{g_m}\\parallel r_O'],
      symbols: ['VGS', 'gm', 'rO', 'Rout'],
      note: 'With body effect (γ ≠ 0) the gain would drop further; the tutorials take γ = 0.',
    },
    worked: { generator: 'u8-follower', seed: 5 },
    yourTurn: { generators: ['u8-follower'], count: 2 },
    lockIn: {
      summary: 'Follower: Vout = Vin − VGS, gain ≈ 1 (ratio rule), Rout ≈ 1/gm. A buffer and a level shifter.',
      hook: '“The source follows the gate, one VGS below.”',
      cards: [
        { id: 'c-u8-sf', front: 'Source follower: DC output, gain, output resistance?', back: 'Vout = Vin − VGS; Av = rO/(1/gm + rO) ≈ 1; Rout = 1/gm ‖ rO.' },
      ],
    },
  },
  {
    id: 'u8-cg',
    unit: 'U8',
    title: 'Common gate: gain gm·RD, input 1/gm',
    minutes: 10,
    refs: { razavi: '§3.5', conversation: 'Part 2, Module 15' },
    why: 'The cascode device and the folded cascode (L4) are common-gate stages; you need its gain and its low input resistance.',
    picture: {
      visual: { widget: 'cgMini' },
      caption: 'Move the gate bias Vb and RD. Watch the source follow Vb, and the drain fall as RD grows until M1 hits the fence.',
    },
    predict: {
      prompt: 'In a common-gate stage the input source moves up by 10 mV. Which way does the output (drain) move?',
      choices: ['Up', 'Down', 'It does not move'],
      answer: 0,
      explain: 'Source up with the gate fixed means VGS falls, current falls, less drop across RD: the drain rises. Non-inverting.',
    },
    idea: `Gate **fixed** at {{VG}} = Vb, signal into the **source**, output from the **drain**: the **common gate**. Raise the source and $V_{GS}$ shrinks, the current drops, the drop across {{RD}} shrinks, so the drain **rises**: gain is **positive**.

It is the CS stage turned around: same current change $g_m v_{in}$, same load, so $A_v = +g_m R_D$ ($\\lambda = 0$).

The catch: the input is the **source**, and by the source rule its resistance is only about $1/g_m$. It takes a current in and passes it up to the drain almost unchanged: that is exactly what a **cascode** device does.`,
    rule: {
      tex: ['A_v = +g_m R_D\\quad(\\lambda = 0)', 'R_{in} = \\dfrac{R_D + r_O}{1 + g_m r_O} \\approx \\dfrac{1}{g_m}'],
      symbols: ['gm', 'RD', 'VG'],
      note: 'DC: VS = Vb − VGS; fence VD ≥ Vb − Vth.',
    },
    worked: { generator: 'u8-cg', seed: 9 },
    yourTurn: { generators: ['u8-cg', 'u8-follower'], count: 3 },
    lockIn: {
      summary: 'CG: source in, drain out, gate fixed. Av = +gm·RD, Rin ≈ 1/gm. It passes current through, the heart of the cascode.',
      hook: '“Source in, drain out, current passes through.”',
      cards: [
        { id: 'c-u8-cg', front: 'Common-gate gain and input resistance?', back: 'Av = +gm·RD; Rin ≈ 1/gm (λ = 0).' },
        { id: 'c-u8-roles', front: 'Name the three roles by where the signal enters and leaves.', back: 'gate→drain = common source; gate→source = follower; source→drain = common gate.' },
      ],
    },
  },

  // ─── U9 ──────────────────────────────────────────────────────────────────
  {
    id: 'u9-cascode',
    unit: 'U9',
    title: 'The cascode: gm·rO², and the load trap',
    minutes: 14,
    refs: { razavi: '§3.6', conversation: 'Cascode lecture; Part 3, Module 16' },
    why: 'Telescopic and folded-cascode op amps (L2, L4) get their gain this way. The classic exam trap is a cascode with a simple load.',
    picture: {
      visual: { widget: 'cascodeMini' },
      caption: 'Compare the bars: rO, looking down, looking up, and their parallel combination. Then move Vb1 or Vout until a transistor turns red.',
    },
    predict: {
      prompt: 'A cascode (Rdown ≈ gm·rO²) is loaded by a simple PMOS current source (rO). The gain is about…',
      choices: ['gm·(gm·rO²), huge', 'gm·rO, the same as a plain CS', 'About 1'],
      answer: 1,
      explain: 'The output sees gm·rO² in parallel with rO. The smallest resistance wins, so Rout ≈ rO and the gain is barely better than a plain CS stage.',
    },
    idea: `Stack a common-gate device M2 on top of the input device M1. M1 still makes the current $g_m v_{in}$; M2 passes it up. Looking **down** into M2’s drain, M1’s $r_O$ sits under M2’s source, so by “up multiplies”:
$R_{down} \\approx g_{m2} r_{O2}\\, r_{O1}$ — about {{gmro}} times bigger than one device.

**The load trap:** Rout is Rdown **in parallel with** whatever is looking up. A simple PMOS source gives only $r_O$, and the smallest wins. To keep the gain you must **cascode the load too**: then $R_{out} = R_{down} \\parallel R_{up}$ and $|A_v| \\approx g_m (g_m r_O^2/2)$.

Cost: each stacked device needs its own {{Vov}} of headroom.`,
    rule: {
      tex: ['R_{down} = r_{O2} + (1 + g_{m2} r_{O2}) r_{O1} \\approx g_{m2} r_{O2} r_{O1}', 'A_v = -g_{m1}\\,(R_{down} \\parallel R_{up})', 'R_{up} = r_{O}\\ (\\text{simple}) \\quad\\text{or}\\quad g_m r_O^2\\ (\\text{cascoded})'],
      symbols: ['Rdown', 'Rup', 'gmro', 'gm', 'rO'],
      note: 'The notes use R ≈ gm·rO·R; the exact form adds rO (a few % difference).',
    },
    worked: { generator: 'u9-cascode', seed: 2 },
    yourTurn: { generators: ['u9-cascode'], count: 3 },
    lockIn: {
      summary: 'Cascode: Rdown ≈ gm·rO². The output also sees Rup; the smallest wins, so cascode the load too. Each device costs one Vov of headroom.',
      hook: '“A cascode is only as good as its load.”',
      cards: [
        { id: 'c-u9-rout', front: 'Resistance looking down into an NMOS cascode?', back: 'rO2 + (1 + gm2·rO2)·rO1 ≈ gm2·rO2·rO1.' },
        { id: 'c-u9-trap', front: 'Cascode with a simple current-source load: gain?', back: '≈ −gm1·rO (the load rO wins the parallel). Cascode the load to get ≈ gm·(gm·rO²/2).' },
      ],
    },
    lab: { id: 'cascode' },
  },
  {
    id: 'u9-telescopic',
    unit: 'U9',
    title: 'Telescopic cascode: headroom stacking',
    minutes: 14,
    refs: { razavi: '§9.2.1, Example 9.7', notes: 'Lec 03–04', conversation: 'Telescopic lecture; Problem Set 1 P3' },
    why: 'Razavi Ex 9.7 and Problem Set 1 P3 ask for the output swing and the bias voltages Vb1, Vb2 of exactly this circuit.',
    picture: {
      visual: { widget: 'telescopicMini' },
      caption: 'Every node on one axis. Slide the output past 0.9 V or 2.4 V, or move Vb1 and Vin,CM: the transistor that leaves saturation turns red.',
    },
    predict: {
      prompt: 'VDD = 3 V, VISS = 0.5 V, every NMOS Vov = 0.2 V, every PMOS |Vov| = 0.3 V. What is the lowest output?',
      choices: ['0.5 V', '0.9 V', '1.4 V'],
      answer: 1,
      explain: 'Climb from ground: VISS + Vov1 + Vov3 = 0.5 + 0.2 + 0.2 = 0.9 V. Each stacked device costs its own overdrive.',
    },
    idea: `The fully differential **telescopic** op amp stacks five devices on each side: tail M9, input M1, NMOS cascode M3, PMOS cascode M5, PMOS source M7.

Think of a **room with a floor and a ceiling**. Each stacked transistor needs {{Vov}} of breathing room to stay saturated; the tail needs {{VISS}}. So the output can only move between
floor $= V_{ISS} + V_{ov1} + V_{ov3}$ and ceiling $= V_{DD} - |V_{ov5}| - |V_{ov7}|$.

The two outputs move in opposite directions, so the **differential** swing is twice that range. The bias voltages Vb1, Vb2 must put every device exactly at its edge to get the full range.`,
    analogy: 'A room with a floor and a ceiling: every stacked transistor needs its own breathing room.',
    rule: {
      tex: ['V_{out,min} = V_{ISS} + V_{ov1} + V_{ov3}', 'V_{out,max} = V_{DD} - |V_{ov5}| - |V_{ov7}|', 'V_{pp,diff} = 2\\,(V_{out,max} - V_{out,min})'],
      symbols: ['VISS', 'Vov', 'VDD'],
      note: 'Full-swing bias (Ex 9.7): Vin,CM = VISS + VGS1; Vb1 = Vin,CM − Vth + VGS3; Vb2 = VDD − |Vov7| − |VGS5|.',
    },
    worked: { generator: 'u9-telescopic', seed: 6 },
    yourTurn: { generators: ['u9-telescopic', 'u9-cascode'], count: 3 },
    lockIn: {
      summary: 'Telescopic: gain ≈ gm·(gm·rO² ‖ gm·rO²), but every stacked device eats one Vov. Floor VISS + 2Vov(n), ceiling VDD − 2|Vov(p)|, differential swing doubles it.',
      hook: '“A room with a floor and a ceiling.”',
      cards: [
        { id: 'c-u9-tele-swing', front: 'Telescopic output swing limits?', back: 'VISS + Vov1 + Vov3 ≤ Vout ≤ VDD − |Vov5| − |Vov7|; differential = 2 × (max − min).' },
        { id: 'c-u9-tele-bias', front: 'Ex 9.7 full-swing bias voltages?', back: 'Vin,CM = VISS + VGS1; Vb1 = Vin,CM − Vth + VGS3; Vb2 = VDD − |Vov7| − |VGS5|.' },
      ],
    },
    lab: { id: 'cascode' },
  },
];
