/**
 * Milestone 1 lessons: U0–U5. Each follows the §5.2 template exactly:
 * why → picture → predict → idea (≤ 120 words) → rule → worked → your turn → lock it in.
 * Numbers in worked examples come from generators/solvers, never typed in by hand.
 */
import { gmFromIdVov, idSat, overdrive } from '../../physics';
import { texSI } from '../../practice/tex';
import { formatSI } from '../../practice/units';
import type { Lesson } from '../types';

// U1 worked example (custom): is it on, and what is Vov?  Values computed, not typed.
const u1 = (() => {
  const vth = 0.4;
  const cases = [0.3, 0.55, 0.7].map((vgs) => ({ vgs, vov: overdrive(vgs, vth) }));
  return { vth, cases };
})();

// U4 worked example (custom): three faces of gm on WE1's numbers.
const u4 = (() => {
  const kp = 200e-6, wl = 10, vov = 0.3;
  const id = idSat(kp, wl, vov);
  return { kp, wl, vov, id, gm: gmFromIdVov(id, vov) };
})();

export const FOUNDATION_LESSONS: Lesson[] = [
  // ─── U0 ──────────────────────────────────────────────────────────────────
  {
    id: 'u0-drops',
    unit: 'U0',
    title: 'Voltage drops: node = supply − drops',
    minutes: 8,
    refs: { conversation: 'Part 1, Module 1' },
    why: 'Every tutorial question starts by finding node voltages. Tutorial 1 Q1 asks for RD so that the drain sits at exactly 0 V.',
    picture: {
      visual: { widget: 'nodeWalk', props: { vdd: 1.8, r1: 10e3, r2: 8e3 } },
      caption: 'Drag the resistor values. Watch the current and the voltage at node A.',
    },
    predict: {
      prompt: 'You make R1 bigger and keep R2 the same. What happens to the voltage at node A?',
      choices: ['It goes up', 'It goes down', 'It stays the same'],
      answer: 1,
      explain: 'A bigger R1 takes a bigger share of the drop from the top, so less height is left at A. (The current also falls, but R1’s share of VDD still grows.)',
    },
    idea: `Think of {{VDD}} as the height of water in a tank and {{ground}} as sea level. **Current** is the flow, and a **resistor** is a narrow pipe. Every time the flow passes through a resistor it loses height: the **drop** is $I \\cdot R$.

So any node's voltage is simply **the supply minus all the drops above it**. Resistors in a single chain (series) all carry the same current, so first find that current, then walk down the chain subtracting drops. The last drop always lands exactly on ground: that is your built-in check.`,
    analogy: 'Water height = voltage, flow = current, narrow pipe = resistor, sea level = ground.',
    rule: {
      tex: ['V = I\\,R', 'I = \\dfrac{V_{DD}}{R_1 + R_2}\\quad\\text{(series)}', 'V_{\\text{node}} = V_{DD} - \\sum \\text{drops above it}'],
      symbols: ['VDD', 'I', 'R'],
    },
    worked: { generator: 'u0-drop', seed: 11 },
    yourTurn: { generators: ['u0-drop'], count: 2 },
    lockIn: {
      summary: 'Find the current, then walk down from the supply, subtracting I·R at each resistor.',
      hook: '“Node = supply minus drops.”',
      cards: [
        { id: 'c-u0-node', front: 'How do you find a node voltage in a resistor chain?', back: 'Node = VDD − (sum of the I·R drops above it). Series resistors share one current: I = VDD/(R1 + R2).' },
        { id: 'c-u0-ohm', front: '0.1 mA through 10 kΩ drops how much?', back: '1 V (V = I·R).' },
      ],
    },
  },
  {
    id: 'u0-parallel',
    unit: 'U0',
    title: 'Parallel resistors and the current divider',
    minutes: 8,
    refs: { conversation: 'Part 1 Module 1; folded-cascode lecture A3' },
    why: 'Every gain formula has a “‖” in it: Av = −gm(RD ‖ rO). And the folded-cascode Gm is a current divider.',
    picture: {
      visual: { widget: 'parallelSplit', props: { ra: 10e3, rb: 40e3, i: 100e-6 } },
      caption: 'Change RA and RB. The bar shows how the current splits between them.',
    },
    predict: {
      prompt: 'A 1 MΩ resistor and a 20 kΩ resistor are in parallel. Roughly what is the combination?',
      choices: ['About 1 MΩ', 'About 510 kΩ', 'A bit under 20 kΩ'],
      answer: 2,
      explain: '1 MΩ ‖ 20 kΩ = 19.6 kΩ. The smallest resistance wins: nearly all the current takes the easy path.',
    },
    idea: `Two resistors are **in parallel** when they connect the same two nodes, so they share one voltage. Current then has two paths, and the combination is *easier* than either alone: {{par|R₁ ‖ R₂}} $= R_1R_2/(R_1+R_2)$ is always **smaller than the smallest one**.

When a current $I$ arrives at such a node it splits, and **more goes down the easier path**. Branch A's share is set by the *other* resistor: $I_A = I\\,R_B/(R_A+R_B)$. That cross-over is the one thing people get backwards.`,
    rule: {
      tex: ['R_A \\parallel R_B = \\dfrac{R_A R_B}{R_A + R_B}', 'I_A = I\\,\\dfrac{R_B}{R_A + R_B}', 'r \\parallel r = \\dfrac{r}{2}'],
      symbols: ['par', 'I'],
      note: 'Smallest resistance in parallel wins.',
    },
    worked: { generator: 'u0-parallel', seed: 5 },
    yourTurn: { generators: ['u0-parallel'], count: 2 },
    lockIn: {
      summary: 'Parallel = product over sum, always smaller than the smallest. A current splits toward the easy path; each branch gets the other’s share.',
      hook: '“Smallest resistance in parallel wins.”',
      cards: [
        { id: 'c-u0-par', front: 'R ‖ R = ?', back: 'R/2. Two equal resistors in parallel give half.' },
        { id: 'c-u0-div', front: 'Current divider: share into branch A?', back: 'IA = I·RB/(RA + RB): the OTHER resistor goes on top.' },
      ],
    },
  },

  // ─── U1 ──────────────────────────────────────────────────────────────────
  {
    id: 'u1-mosfet',
    unit: 'U1',
    title: 'The MOSFET: a tap whose handle is the gate',
    minutes: 10,
    refs: { razavi: '§2.1–2.2', conversation: 'Part 1 Module 2' },
    why: 'Every sizing question (“find W/L”) and every headroom question starts from Vov. This lesson defines it.',
    picture: {
      visual: { widget: 'tap', props: { vth: 0.4 } },
      caption: 'Raise VGS. Nothing happens until it passes Vth; then a channel of electrons forms and thickens.',
    },
    predict: {
      prompt: 'Vth = 0.4 V. You set VGS = 0.3 V. Does a channel form?',
      choices: ['Yes, a thin one', 'No, the device is off', 'Only if VDS is large'],
      answer: 1,
      explain: 'Below threshold there is no channel at all: the device is OFF and ID = 0, whatever VDS is.',
    },
    idea: `A MOSFET has a **source** and a **drain** (two pools of electrons), a **gate** on top, and a thin layer of glass (oxide) in between. No current can ever flow into the gate.

Put a voltage {{VGS}} on the gate and it pulls electrons to the surface. Past the **threshold** {{Vth}} they join into a sheet: the **channel**. How far you go past threshold is the {{Vov|overdrive}}, $V_{ov} = V_{GS} - V_{th}$, and it sets how thick the channel is. The channel's width over length, {{WL}}, is the size of the tap.`,
    analogy: 'The MOSFET is a tap. The gate is the handle; Vth is the stiff first bit of the turn; Vov is how far you have opened it past that.',
    rule: {
      tex: ['V_{ov} = V_{GS} - V_{th}', 'V_{GS} < V_{th} \\Rightarrow \\text{OFF},\\ I_D = 0', 'I_G = 0\\quad\\text{(the gate is a capacitor plate)}'],
      symbols: ['VGS', 'Vth', 'Vov', 'WL', 'muCox'],
    },
    worked: {
      custom: {
        title: 'On or off? Find Vov',
        setup: `Vth = ${u1.vth} V. Three gate-source voltages: ${u1.cases.map((c) => c.vgs + ' V').join(', ')}.`,
        figure: { kind: 'mosBias', props: { vgs: u1.cases[1].vgs, vds: 1 } },
        steps: u1.cases.map((c) => ({
          tag: 'A' as const,
          title: `VGS = ${c.vgs} V`,
          tex: `V_{ov} = ${c.vgs} - ${u1.vth} = ${texSI(c.vov, 'V')} \\Rightarrow ${c.vov > 0 ? '\\text{ON, channel forms}' : '\\text{OFF (negative overdrive)}'}`,
        })),
      },
    },
    yourTurn: { generators: ['u2-region'], count: 2 },
    lockIn: {
      summary: 'Gate voltage builds a channel once VGS passes Vth. Overdrive Vov = VGS − Vth sets its thickness; W/L sets its size. The gate draws no current.',
      hook: '“Overdrive is the most important number in the course.”',
      cards: [
        { id: 'c-u1-vov', front: 'Define overdrive.', back: 'Vov = VGS − Vth: how far past threshold the gate is.' },
        { id: 'c-u1-gate', front: 'Why is the gate current zero?', back: 'The gate sits on glass (oxide): it is a capacitor plate, so no DC current flows in.' },
      ],
    },
  },

  // ─── U2 ──────────────────────────────────────────────────────────────────
  {
    id: 'u2-pinchoff',
    unit: 'U2',
    title: 'Triode, pinch-off, saturation: the waterfall',
    minutes: 10,
    refs: { razavi: '§2.2', conversation: 'Part 1 Module 3', notes: 'Lec 02 margin: VDS ≥ VGS − Vth' },
    why: 'Amplifiers only work in saturation, and every “is it in saturation?” check in your tutorials comes from this picture.',
    picture: {
      visual: { widget: 'channel', props: { vov: 0.3 } },
      caption: 'Slide VDS up. The channel thins toward the drain, pinches off at VDS = Vov, and then the current stops growing.',
    },
    predict: {
      prompt: 'Vov = 0.3 V. You raise VDS from 0.1 V to 0.2 V to 0.3 V. At the drain end, the channel…',
      choices: ['gets thicker', 'gets thinner and reaches zero at 0.3 V', 'stays the same thickness'],
      answer: 1,
      explain: 'At the drain end the gate only sees VGS − VDS, so the local overdrive is Vov − VDS. It reaches zero exactly when VDS = Vov: pinch-off.',
    },
    idea: `The channel is **not equally thick everywhere**. At the source end the gate sees the full $V_{ov}$; at the drain end it sees only $V_{ov} - V_{DS}$. So raising {{VDS}} thins the drain end.

While the channel still reaches the drain, the device is a resistor: **triode**. At $V_{DS} = V_{ov}$ it **pinches off**. Beyond that the extra voltage just drops across a tiny gap at the drain, and the current is set upstream by $V_{ov}$ alone: **saturation**.

In node voltages this is the {{fence}}: *the drain must stay above the gate minus one threshold*.`,
    analogy: 'A waterfall: how much water flows over is set by the river upstream, not by how tall the cliff is.',
    rule: {
      tex: ['\\text{Saturation}\\iff V_{DS} \\ge V_{ov} \\iff V_D \\ge V_G - V_{th}', '\\text{PMOS: } V_D \\le V_G + |V_{th}|'],
      symbols: ['VDS', 'Vov', 'fence', 'pinch'],
    },
    worked: { generator: 'u2-region', seed: 3 },
    yourTurn: { generators: ['u2-region'], count: 3 },
    lockIn: {
      summary: 'Channel thickness at the drain end is Vov − VDS. It pinches off at VDS = Vov. Saturated ⟺ VD ≥ VG − Vth (NMOS).',
      hook: '“The drain must stay above the gate minus one threshold.”',
      cards: [
        { id: 'c-u2-fence-n', front: 'NMOS saturation condition in node voltages?', back: 'VD ≥ VG − Vth (equivalently VDS ≥ Vov).' },
        { id: 'c-u2-fence-p', front: 'PMOS saturation condition in node voltages?', back: 'VD ≤ VG + |Vth|.' },
        { id: 'c-u2-why', front: 'Why does ID stop growing once VDS > Vov?', back: 'The channel has pinched off; extra VDS drops across the gap near the drain. The current is set upstream by Vov (the waterfall).' },
      ],
    },
  },
  {
    id: 'u2-squarelaw',
    unit: 'U2',
    title: 'The square law and λ',
    minutes: 10,
    refs: { razavi: '§2.2–2.3', conversation: 'Part 1 Module 3; A1' },
    why: 'The square law is the bridge equation in every sizing problem: Exam Q1(a) asks for W/L from a current and an overdrive.',
    picture: {
      visual: { widget: 'family', props: { kp: 200e-6, wl: 10, lambda: 0.1 } },
      caption: 'The ID–VDS family. Move VGS and VDS: the knee of every curve sits on the dashed pinch-off line VDS = Vov.',
    },
    predict: {
      prompt: 'In saturation you double the overdrive (0.2 V → 0.4 V). The drain current…',
      choices: ['doubles', 'quadruples', 'stays the same'],
      answer: 1,
      explain: 'ID ∝ Vov². Twice the overdrive gives four times the current.',
    },
    idea: `In saturation the current depends on the overdrive **squared**: $I_D = \\tfrac12\\,\\mu_n C_{ox}\\,\\tfrac{W}{L}\\,V_{ov}^2$. {{muCox}} is fixed by the process; {{WL}} and $V_{ov}$ are your two knobs.

In triode the current also depends on $V_{DS}$, like a resistor. The two formulas meet exactly at $V_{DS} = V_{ov}$.

The “flat” part is not quite flat: as $V_{DS}$ grows, the pinch-off point creeps toward the source and the current rises slightly. That slope is {{lambda}}, and longer channels have smaller λ. Use λ = 0 for DC bias unless told otherwise.`,
    rule: {
      tex: [
        '\\text{Saturation: } I_D = \\tfrac12\\,\\mu C_{ox}\\tfrac{W}{L}\\,V_{ov}^2\\,(1+\\lambda V_{DS})',
        '\\text{Triode: } I_D = \\mu C_{ox}\\tfrac{W}{L}\\left[V_{ov}V_{DS} - \\tfrac{V_{DS}^2}{2}\\right]',
        '\\text{Design: } \\tfrac{W}{L} = \\dfrac{2I_D}{\\mu C_{ox} V_{ov}^2}',
      ],
      symbols: ['ID', 'muCox', 'WL', 'Vov', 'lambda'],
      note: 'Don’t forget the ½, and square Vov, not VGS.',
    },
    worked: { generator: 'u2-region', seed: 17 },
    yourTurn: { generators: ['u2-region', 'u3-nmos-design'], count: 3 },
    lockIn: {
      summary: 'Saturation: ID = ½µCox(W/L)Vov². Triode adds VDS. Run it backwards for design: W/L = 2ID/(µCox Vov²).',
      hook: '“Double the overdrive, four times the current.”',
      cards: [
        { id: 'c-u2-sq', front: 'Saturation current (square law)?', back: 'ID = ½ µCox (W/L) Vov² (1 + λVDS); use λ = 0 for DC bias.' },
        { id: 'c-u2-tri', front: 'Triode current?', back: 'ID = µCox (W/L)[Vov·VDS − VDS²/2].' },
        { id: 'c-u2-design', front: 'W/L for a given ID and Vov?', back: 'W/L = 2ID/(µCox Vov²).' },
      ],
    },
    lab: { id: 'mosfet' },
  },

  // ─── U3 ──────────────────────────────────────────────────────────────────
  {
    id: 'u3-recipe',
    unit: 'U3',
    title: 'The DC recipe: assume, solve, walk, check',
    minutes: 12,
    refs: { razavi: '§2.2', conversation: 'Part 1 Worked Example 1' },
    why: 'Step A of the master method. Tutorial 1 Q1, Exam Q1(a) and every bias question are this recipe.',
    picture: {
      visual: { widget: 'recipeMini', props: { vdd: 1.8, vth: 0.4, kp: 200e-6, wl: 10, rd: 10e3 } },
      caption: 'Move VG. The recipe runs live: ID from the square law, VD from the drop, and the fence turns red when the device leaves saturation.',
    },
    predict: {
      prompt: 'Raise VG in this circuit. The drain voltage VD…',
      choices: ['rises', 'falls', 'stays at VDD'],
      answer: 1,
      explain: 'More VG → more overdrive → more ID → a bigger drop across RD → VD falls. Push too far and VD falls below VG − Vth: triode.',
    },
    idea: `You can't know the region before you solve, so **assume saturation**, solve, then **check**.

1. **Assume** saturation (λ = 0 for DC).
2. **Solve** the square law for $I_D$.
3. **Walk** the node voltages: start at a rail and subtract drops.
4. **Check** the fence: $V_D \\ge V_G - V_{th}$. If it fails, the device is in triode: redo with the triode equation.

Skipping step 4 is the classic way to lose marks: the numbers look fine but describe a circuit that can't exist.`,
    rule: {
      tex: [
        '\\text{1. Assume saturation}',
        '\\text{2. Solve: } I_D = \\tfrac12\\mu C_{ox}\\tfrac{W}{L}V_{ov}^2',
        '\\text{3. Walk: } V_D = V_{DD} - I_D R_D',
        '\\text{4. CHECK: } V_D \\ge V_G - V_{th}',
      ],
      symbols: ['ID', 'RD', 'VD', 'fence'],
    },
    worked: { bank: 'bank-we1' },
    yourTurn: { generators: ['u3-nmos-analysis'], count: 3 },
    lockIn: {
      summary: 'Assume saturation → square law → walk the nodes → check the fence. Always finish with the check.',
      hook: '“Assume, solve, walk, CHECK.”',
      cards: [
        { id: 'c-u3-recipe', front: 'The four moves of Step A (DC recipe)?', back: 'Assume saturation → square law → walk the node voltages → check the fence.' },
        { id: 'c-u3-we1', front: 'WE1: VDD 1.8, VG 0.7, Vth 0.4, µnCox 200µ, W/L 10, RD 10k. ID and VD?', back: 'Vov = 0.3 V, ID = 90 µA, VD = 0.9 V ≥ 0.3 V → saturated.' },
      ],
    },
    lab: { id: 'dc' },
  },
  {
    id: 'u3-pmos-design',
    unit: 'U3',
    title: 'PMOS with magnitudes, and the design direction',
    minutes: 12,
    refs: { razavi: '§2.2', conversation: 'Part 1 WE2, WE3' },
    why: 'Exam Q1(a) sizes the PMOS loads from a CM limit: a PMOS run in the design direction.',
    picture: {
      visual: { widget: 'pmosFlip', props: { vdd: 1.8, vth: 0.5, kp: 100e-6, wl: 20, rd: 5e3 } },
      caption: 'A PMOS hangs from VDD. Lower its gate to turn it on harder: everything is the NMOS picture upside down.',
    },
    predict: {
      prompt: 'PMOS source at 1.8 V, gate at 0.9 V, |Vth| = 0.5 V. What is |Vov|?',
      choices: ['0.4 V', '0.9 V', '−0.4 V'],
      answer: 0,
      explain: '|VGS| = VS − VG = 0.9 V, and |Vov| = 0.9 − 0.5 = 0.4 V. Use magnitudes and every number stays positive.',
    },
    idea: `A PMOS is an NMOS turned upside down: its source sits at the **top** (usually {{VDD}}), and it turns on when the gate goes **below** the source by more than $|V_{th}|$. Use **magnitudes** and the same square law works unchanged: $|V_{GS}| = V_S - V_G$, $|V_{ov}| = |V_{GS}| - |V_{th}|$.

The **design direction** runs the recipe backwards. Instead of “given W/L, find $I_D$”, you are told $I_D$ and $V_{ov}$ and asked for W/L, $V_G$ and $R_D$. It's the same equation solved for a different unknown.`,
    rule: {
      tex: ['|V_{GS}| = V_S - V_G,\\quad |V_{ov}| = |V_{GS}| - |V_{th}|', 'I_D = \\tfrac12\\mu_p C_{ox}\\tfrac{W}{L}|V_{ov}|^2', '\\tfrac{W}{L} = \\dfrac{2I_D}{\\mu C_{ox}V_{ov}^2},\\quad V_G = V_{th} + V_{ov}'],
      symbols: ['VGS', 'Vth', 'Vov', 'WL'],
    },
    worked: { bank: 'bank-we3' },
    yourTurn: { generators: ['u3-pmos-analysis', 'u3-nmos-design'], count: 3 },
    lockIn: {
      summary: 'PMOS: magnitudes everywhere, source at the top. Design: solve the square law for W/L; the gate sits at Vth + Vov above the source.',
      hook: '“PMOS is NMOS upside down: use magnitudes.”',
      cards: [
        { id: 'c-u3-pmos', front: 'PMOS overdrive with the source at VDD?', back: '|Vov| = (VDD − VG) − |Vth|.' },
        { id: 'c-u3-dir', front: 'Analysis vs design direction?', back: 'Analysis: W/L → Vov → ID. Design: ID and Vov → W/L = 2ID/(µCox Vov²).' },
      ],
    },
  },

  // ─── U4 ──────────────────────────────────────────────────────────────────
  {
    id: 'u4-gm',
    unit: 'U4',
    title: 'Small signal: gm is a slope',
    minutes: 10,
    refs: { razavi: '§2.4.3', conversation: 'Lecture 2 A2; Part 1 Module 5' },
    why: 'Every gain in the course is gm times a resistance. Exam Q1(b) needs gm1 = 2ID/Vov.',
    picture: {
      visual: { widget: 'tangent', props: { kp: 200e-6, wl: 10, vth: 0.4 } },
      caption: 'The ID–VGS curve is a parabola. Pick a bias point Q: for small wiggles around it, the curve looks like its tangent. That slope is gm.',
    },
    predict: {
      prompt: 'You move the bias point Q to a higher VGS. The slope gm at Q…',
      choices: ['gets steeper', 'gets flatter', 'does not change'],
      answer: 0,
      explain: 'A parabola gets steeper as you go up it. gm = µCox(W/L)·Vov grows with the overdrive.',
    },
    idea: `An amplifier handles **small wiggles riding on a DC bias**. Around the bias point Q the curved square law looks like a straight line, its **tangent**. The slope of that tangent is the **transconductance** {{gm}}: how much drain current changes per volt of gate wiggle.

Differentiate the square law and you get **three faces of the same number**. Use whichever fits what you were given. The designer's favourite is $g_m = 2I_D/V_{ov}$: current divided by overdrive.`,
    rule: {
      tex: ['g_m = \\dfrac{\\partial I_D}{\\partial V_{GS}} = \\mu C_{ox}\\tfrac{W}{L}V_{ov} = \\sqrt{2\\mu C_{ox}\\tfrac{W}{L}I_D} = \\dfrac{2I_D}{V_{ov}}'],
      symbols: ['gm', 'ID', 'Vov'],
      note: 'Sizing a device → first form. Trading width against current → second. Headroom questions → third.',
    },
    worked: {
      custom: {
        title: 'Three faces of gm on WE1’s numbers',
        setup: `µnCox = 200 µA/V², W/L = 10, Vov = 0.3 V (so ID = ${formatSI(u4.id, 'A')}).`,
        figure: { kind: 'smallSignalModel' },
        steps: [
          { tag: '·', title: 'Face 1: from the size and overdrive', tex: `g_m = (200\\mu)(10)(0.3) = ${texSI(u4.kp * u4.wl * u4.vov, 'S')}` },
          { tag: '·', title: 'Face 2: from the size and current', tex: `g_m = \\sqrt{2(200\\mu)(10)(${texSI(u4.id, 'A')})} = ${texSI(Math.sqrt(2 * u4.kp * u4.wl * u4.id), 'S')}` },
          { tag: '·', title: 'Face 3: current over overdrive', tex: `g_m = \\dfrac{2(${texSI(u4.id, 'A')})}{0.3} = ${texSI(u4.gm, 'S')}` },
          { tag: '✓', title: 'All three agree', tex: `g_m = ${texSI(u4.gm, 'S')}\\;\\checkmark` },
        ],
      },
    },
    yourTurn: { generators: ['u4-gm-ro'], count: 2 },
    lockIn: {
      summary: 'gm is the slope of ID vs VGS at the bias point. Three faces: µCox(W/L)Vov = √(2µCox(W/L)ID) = 2ID/Vov.',
      hook: '“gm is current over overdrive (times 2).”',
      cards: [
        { id: 'c-u4-gm3', front: 'Write gm three ways.', back: 'gm = µCox(W/L)Vov = √(2µCox(W/L)ID) = 2ID/Vov.' },
        { id: 'c-u4-gmwhen', front: 'Which face of gm for a headroom question?', back: 'gm = 2ID/Vov (the designer’s form).' },
      ],
    },
  },
  {
    id: 'u4-ro',
    unit: 'U4',
    title: 'rO, intrinsic gain, and the small-signal model',
    minutes: 10,
    refs: { razavi: '§2.4.3', conversation: 'Lecture 2 A2' },
    why: 'rO sets every gain in your op-amp lectures: Exam Q1(b) is gm(rO2 ‖ rO4).',
    picture: {
      visual: { widget: 'roSlope', props: { kp: 200e-6, wl: 10, vov: 0.3 } },
      caption: 'Tilt the “flat” part with λ. The steeper it is, the smaller rO. Then see the model the transistor turns into.',
    },
    predict: {
      prompt: 'You double the bias current AND the width, so the overdrive stays the same. The intrinsic gain gm·rO…',
      choices: ['doubles', 'halves', 'stays the same'],
      answer: 2,
      explain: 'gm·rO = 2/(λVov): at a fixed overdrive the current cancels, so you cannot buy gain with current. (Doubling ID in the SAME device raises Vov by √2 and actually lowers the gain.)',
    },
    idea: `The saturation curve has a small slope set by λ. Its inverse is the device's **output resistance**: $r_O = 1/(\\lambda I_D)$, what you see looking into the drain.

For small signals, replace the transistor by a **model**: an open circuit at the gate, and a current source $g_m v_{gs}$ in parallel with $r_O$ between drain and source. Three conversion rules: **DC voltage sources → ground**, **DC current sources → open**, **transistor → $g_m v_{gs} \\parallel r_O$**.

The biggest gain one device can give is {{gmro}}: $g_m r_O = 2/(\\lambda V_{ov})$. At a fixed overdrive it does not depend on $I_D$.`,
    rule: {
      tex: ['r_O = \\dfrac{1}{\\lambda I_D} = \\dfrac{V_A}{I_D}', 'g_m r_O = \\dfrac{2}{\\lambda V_{ov}}'],
      symbols: ['rO', 'lambda', 'gmro'],
      note: 'λ ∝ 1/L: a longer channel gives a bigger rO. Sedra–Smith write VA = 1/λ = |V′A|·L (Tutorial 1).',
    },
    worked: { generator: 'u4-gm-ro', seed: 23 },
    yourTurn: { generators: ['u4-gm-ro'], count: 3 },
    lockIn: {
      summary: 'rO = 1/(λID). Model: open gate, gm·vgs ‖ rO. Intrinsic gain gm·rO = 2/(λVov) does not depend on current.',
      hook: '“You can’t buy gain with current.”',
      cards: [
        { id: 'c-u4-ro', front: 'Output resistance of a saturated MOSFET?', back: 'rO = 1/(λID) = VA/ID.' },
        { id: 'c-u4-intr', front: 'Intrinsic gain, and when is it independent of ID?', back: 'gm·rO = (2ID/Vov)·(1/λID) = 2/(λVov): at a fixed overdrive ID cancels. In a fixed-size device more ID means more Vov and less gain.' },
        { id: 'c-u4-rules', front: 'Three small-signal conversion rules?', back: 'DC voltage sources → AC ground; DC current sources → open; transistor → gm·vgs ‖ rO.' },
      ],
    },
  },

  // ─── U5 ──────────────────────────────────────────────────────────────────
  {
    id: 'u5-cs',
    unit: 'U5',
    title: 'Common source: gain is the slope at Q',
    minutes: 14,
    refs: { razavi: '§3.3.1', conversation: 'Part 1 WE5; Chapter 3 lecture 2.1' },
    why: 'The CS stage is the half circuit of every differential pair and op amp you will meet. Its gain formula is the one you will use most.',
    picture: {
      visual: { widget: 'csTransfer', props: { vdd: 1.8, vth: 0.4, kp: 200e-6, wl: 10, rd: 10e3 } },
      caption: 'Sweep the bias point along the transfer curve. The dashed tangent is the gain; in triode it collapses.',
    },
    predict: {
      prompt: 'Where on the curve is the gain biggest?',
      choices: ['In the OFF region', 'In the steep saturated middle', 'Deep in triode'],
      answer: 1,
      explain: 'Gain is the slope. The curve is steepest in saturation, flat when off, and flattens again in triode.',
    },
    idea: `Input on the **gate**, output on the **drain**, source grounded: the **common-source** stage. More input → more current → bigger drop across $R_D$ → the output **falls**. It inverts.

The small-signal gain is the **slope of the transfer curve at the bias point**. With the model: $g_m v_{in}$ is pulled out of the output node, and everything touching that node ($R_D$ and $r_O$) is **in parallel**. So $A_v = -g_m (R_D \\parallel r_O)$.

This is the master method's Steps B–D: **role** (gate in, drain out = CS) → **resistance** at the output → $A_v = -G_m R_{out}$.`,
    rule: {
      tex: ['A_v = -G_m R_{out} = -g_m\\,(R_D \\parallel r_O)', '|A_v| = \\dfrac{2\\,(I_D R_D)}{V_{ov}} = \\dfrac{2\\times\\text{DC drop across } R_D}{V_{ov}}\\quad(\\lambda = 0)'],
      symbols: ['Av', 'Gm', 'Rout', 'gm', 'rO', 'RD'],
      note: 'A gain of 10 at Vov = 0.2 V needs 1 V across RD, which is impossible on a 1 V supply. That’s why chips replace RD with a transistor.',
    },
    worked: { bank: 'bank-we1' },
    yourTurn: { generators: ['u5-cs-gain', 'u5-gain-drop'], count: 3 },
    lockIn: {
      summary: 'CS: gate in, drain out, inverts. Av = −gm(RD ‖ rO) = −Gm·Rout. With a resistor load |Av| = 2·Vdrop/Vov.',
      hook: '“Av = −Gm·Rout, always.”',
      cards: [
        { id: 'c-u5-av', front: 'CS gain with a resistor load?', back: 'Av = −gm(RD ‖ rO). Without rO: −gm·RD.' },
        { id: 'c-u5-drop', front: 'Gain of a resistor-loaded stage in terms of the DC drop?', back: '|Av| = 2·(ID·RD)/Vov: twice the drop over the overdrive.' },
        { id: 'c-u5-master', front: 'The master method, Steps A–D?', back: 'A DC recipe · B roles (gate→drain = CS) · C replace loads by resistances · D Av = −Gm·Rout, fix the sign.' },
      ],
    },
  },
];
