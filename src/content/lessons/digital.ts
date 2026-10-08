/**
 * The digital half of the course (handout L15–L38): Kang & Leblebici Ch 5–7 (inverters, switching,
 * combinational gates) and Weste & Harris Ch 4, 5, 9–12 (delay, logical effort, power, circuit families,
 * sequencing, datapaths, SRAM). No lecture notes yet: built from the standard textbook treatments.
 */
import type { Lesson } from '../types';

const K = 'Kang & Leblebici';
const W = 'Weste & Harris';

export const DIGITAL_LESSONS: Lesson[] = [
  {
    id: 'd15-statics',
    unit: 'L15',
    title: 'The inverter as a switch: VOH, VOL, VIL, VIH and noise margins',
    minutes: 10,
    refs: { book: `${K} §5.1` },
    why: 'Every digital question starts with the inverter’s five voltages and its two noise margins (handout L15).',
    picture: { visual: { widget: 'vtcMini' }, caption: 'The VTC: flat at the top (output 1), a steep cliff, flat at the bottom (output 0). The coloured bands are the input ranges read as 0 and 1.' },
    predict: {
      prompt: 'A gate outputs its “0” as 0.3 V. The next gate reads anything below 1.1 V as 0. How much noise can the 0 survive?',
      choices: ['0.3 V', '0.8 V', '1.1 V'],
      answer: 1,
      explain: 'Noise margin low = VIL − VOL = 1.1 − 0.3 = 0.8 V: the gap between what the driver guarantees and what the receiver needs.',
    },
    idea: `An inverter is a switch that also cleans signals up. Five numbers describe it:
{{VOH}} and {{VOL}}: the output levels it actually produces.
{{VIL}} and {{VIH}}: the input voltages where the VTC slope is exactly −1. Below VIL the input safely reads 0; above VIH it reads 1; in between the gain is > 1 and the output is undefined.
{{VM}}: where Vin = Vout.

**Noise margins** ({{NM}}) are the safety gaps between a driver and a receiver: $NM_L = V_{IL} - V_{OL}$, $NM_H = V_{OH} - V_{IH}$. Bigger margins let a 0 or a 1 survive more noise.`,
    analogy: 'A light switch with a dead zone: push a little and nothing happens; push past the click and it snaps fully on.',
    rule: { tex: ['NM_L = V_{IL} - V_{OL}', 'NM_H = V_{OH} - V_{IH}', 'V_{IL}, V_{IH}: \\; dV_{out}/dV_{in} = -1'], symbols: ['VOH', 'VOL', 'VIL', 'VIH', 'NM'] },
    worked: { generator: 'd15-margins', seed: 3 },
    yourTurn: { generators: ['d15-margins'], count: 2 },
    lockIn: {
      summary: 'VOH/VOL: what the output gives; VIL/VIH: where the slope is −1; NML = VIL − VOL, NMH = VOH − VIH.',
      hook: '“Guarantee minus requirement = margin.”',
      cards: [
        { id: 'c-d15-nm', front: 'Noise margins?', back: 'NML = VIL − VOL, NMH = VOH − VIH.' },
        { id: 'c-d15-vil', front: 'How are VIL and VIH defined?', back: 'The two input voltages where the VTC slope dVout/dVin = −1.' },
      ],
    },
  },
  {
    id: 'd16-loads',
    unit: 'L16',
    title: 'Inverters with different loads: every ratioed load fights the driver',
    minutes: 12,
    refs: { book: `${K} §5.2–5.3` },
    why: 'Handout L16: resistive, depletion-nMOS and pseudo-nMOS loads, with VOL, VIL, VIH and static power.',
    picture: { visual: { widget: 'loadsMini' }, caption: 'Switch the load. For every load except CMOS, VOL is above 0 and current flows whenever the output is low.' },
    predict: {
      prompt: 'In a resistive-load inverter with the input high, VOL is…',
      choices: ['exactly 0 V', 'a little above 0 V, set by a tug-of-war', 'VDD/2'],
      answer: 1,
      explain: 'The resistor keeps pulling up while the nMOS pulls down: the output settles where their currents are equal, a little above 0.',
    },
    idea: `With a load that is always on (a resistor, a depletion nMOS, or a pMOS with its gate grounded), a low output is a **tug-of-war**: load current = driver current.

With the input high the driver is in triode. Equate: $(V_{DD} - V_{OL})/R_L = \\frac{k_n}{2}[2(V_{DD} - V_{th})V_{OL} - V_{OL}^2]$ and solve the quadratic. A stronger driver (bigger {{kR}}) gives a smaller VOL.

The price: **static power** $V_{DD}\\cdot I$ whenever the output is low, and asymmetric edges. Resistive load closed forms: $V_{IL} = V_{th} + 1/(k_nR_L)$, $V_{IH} = V_{th} + \\sqrt{8V_{DD}/(3k_nR_L)} - 1/(k_nR_L)$.`,
    analogy: 'Two people pulling a rope: the rope ends up nearer the stronger one, but never all the way.',
    rule: { tex: ['V_{OL}:\\; I_{load} = \\tfrac{k_n}{2}\\left[2(V_{DD} - V_{th})V_{OL} - V_{OL}^2\\right]', 'V_{IL} = V_{th} + \\tfrac{1}{k_nR_L},\\quad V_{IH} = V_{th} + \\sqrt{\\tfrac{8V_{DD}}{3k_nR_L}} - \\tfrac{1}{k_nR_L}', 'P_{static} = V_{DD}\\,I_{load}'], symbols: ['VOL', 'VIL', 'VIH', 'kR'] },
    worked: { generator: 'd16-resistive', seed: 2 },
    yourTurn: { generators: ['d16-resistive', 'd16-pseudo'], count: 3 },
    lockIn: {
      summary: 'Ratioed loads: VOL from load current = triode driver current; stronger driver → lower VOL; static power whenever the output is low.',
      hook: '“Tug-of-war: never quite 0, always burning.”',
      cards: [
        { id: 'c-d16-vol', front: 'How do you find VOL of a ratioed inverter?', back: 'Input high: driver in triode; set its current equal to the load current and solve the quadratic (small root).' },
        { id: 'c-d16-cost', front: 'The two costs of ratioed (non-CMOS) inverters?', back: 'VOL > 0 (depends on the size ratio) and static power whenever the output is low.' },
      ],
    },
  },
  {
    id: 'd17-cmos',
    unit: 'L17',
    title: 'The CMOS inverter: VM, sizing, and the symmetric inverter',
    minutes: 12,
    refs: { book: `${K} §5.4` },
    why: 'Handout L17: find VM, VIL, VIH and the noise margins of a CMOS inverter, and size it for a given VM.',
    picture: { visual: { widget: 'vtcMini' }, caption: 'Slide kR = kn/kp: VM moves left for a stronger nMOS, right for a stronger pMOS. At kR = 1 (equal thresholds) everything is symmetric.' },
    predict: {
      prompt: 'µn ≈ 2.5·µp. With equal W/L for both devices, VM is…',
      choices: ['exactly VDD/2', 'below VDD/2', 'above VDD/2'],
      answer: 1,
      explain: 'Equal W/L makes the nMOS 2.5× stronger (kR = 2.5), so it wins the tug-of-war sooner: the output drops at a lower input. Widen the pMOS 2.5× to centre it.',
    },
    idea: `CMOS has no fight in either steady state: one device is off, so VOH = VDD, VOL = 0 and no static current.

At the switching point {{VM}} both devices are saturated with equal currents:
$\\frac{k_n}{2}(V_M - V_{thn})^2 = \\frac{k_p}{2}(V_{DD} - V_M - |V_{thp}|)^2$, giving
$V_M = \\dfrac{V_{thn} + \\sqrt{1/k_R}(V_{DD} - |V_{thp}|)}{1 + \\sqrt{1/k_R}}$, with {{kR}} $= k_n/k_p$.

Design backwards: $k_R = \\left(\\dfrac{V_{DD} - |V_{thp}| - V_M}{V_M - V_{thn}}\\right)^2$. Symmetric case ($k_R = 1$, equal thresholds): $V_M = V_{DD}/2$, $V_{IL} = (3V_{DD} + 2V_{th})/8$, $V_{IH} = (5V_{DD} - 2V_{th})/8$.`,
    rule: { tex: ['V_M = \\dfrac{V_{thn} + \\sqrt{1/k_R}\\,(V_{DD} - |V_{thp}|)}{1 + \\sqrt{1/k_R}}', 'k_R = \\dfrac{k_n}{k_p} = \\left(\\dfrac{V_{DD} - |V_{thp}| - V_M}{V_M - V_{thn}}\\right)^2', 'k_R = 1:\\; V_{IL} = \\tfrac{3V_{DD} + 2V_{th}}{8},\\; V_{IH} = \\tfrac{5V_{DD} - 2V_{th}}{8}'], symbols: ['VM', 'kR', 'VIL', 'VIH'] },
    worked: { generator: 'd17-vm', seed: 4 },
    yourTurn: { generators: ['d17-vm', 'd15-margins'], count: 3 },
    lockIn: {
      summary: 'CMOS: VOH = VDD, VOL = 0, no static current. VM from equal saturation currents; kR = kn/kp sets it; kR = 1 → VM = VDD/2.',
      hook: '“Stronger nMOS pulls VM down.”',
      cards: [
        { id: 'c-d17-vm', front: 'CMOS switching threshold VM?', back: 'VM = (Vthn + √(1/kR)(VDD − |Vthp|))/(1 + √(1/kR)), kR = kn/kp.' },
        { id: 'c-d17-sym', front: 'Symmetric CMOS inverter VIL and VIH?', back: 'VIL = (3VDD + 2Vth)/8, VIH = (5VDD − 2Vth)/8; NML = NMH.' },
      ],
    },
  },
  {
    id: 'd18-switching',
    unit: 'L18',
    title: 'Switching: delay is the time to move half the swing on CL',
    minutes: 12,
    refs: { book: `${K} §6.1–6.2` },
    why: 'Handout L18: define τPHL, τPLH, rise and fall times, and find what makes up the load capacitance.',
    picture: { visual: { widget: 'switchMini' }, caption: 'Change the load and the device widths: the delays are measured between the 50% points of input and output.' },
    predict: {
      prompt: 'You double the load capacitance of an inverter. Its delay…',
      choices: ['stays the same', 'roughly doubles', 'roughly halves'],
      answer: 1,
      explain: 'The transistor pushes (about) the same current, so moving twice the charge takes twice the time: τ ∝ CL/k.',
    },
    idea: `A gate is slow because it must **charge or discharge a capacitor** through a transistor.

{{tauPHL}}: input rises, output falls, the nMOS discharges CL. {{tauPLH}}: the pMOS charges it. Both are measured between the 50% points; $\\tau_P = (\\tau_{PHL} + \\tau_{PLH})/2$. Rise/fall times are usually measured 10% → 90%.

The load $C_L$ is everything hanging on the output: the drain junctions of both transistors, the wire, and the gate capacitance of every gate it drives (fan-out). Delay ∝ $C_L/k$: more load or a weaker device, more delay.`,
    analogy: 'Filling or emptying a bucket through a tap: a bigger bucket or a narrower tap takes longer.',
    rule: { tex: ['\\tau_P = \\tfrac{1}{2}(\\tau_{PHL} + \\tau_{PLH})', 'C_L = C_{db,n} + C_{db,p} + C_{wire} + \\textstyle\\sum C_{g,fanout}', '\\tau \\propto C_L / k'], symbols: ['tauPHL', 'tauPLH', 'CL'] },
    worked: { generator: 'd18-delay', seed: 6 },
    yourTurn: { generators: ['d18-delay'], count: 2 },
    lockIn: {
      summary: 'Delay = time to move the output halfway, charging CL through the pMOS or discharging it through the nMOS. τ ∝ CL/k.',
      hook: '“Bucket and tap.”',
      cards: [
        { id: 'c-d18-def', front: 'τPHL and τPLH?', back: 'Input 50% → output 50% for a falling output (nMOS discharges CL) and a rising output (pMOS charges CL).' },
        { id: 'c-d18-cl', front: 'What makes up an inverter’s load capacitance?', back: 'Its own drain junctions, the wire, and the gate capacitance of every gate it drives.' },
      ],
    },
  },
  {
    id: 'd19-delaycalc',
    unit: 'L19',
    title: 'Calculating the delay: saturated, then triode',
    minutes: 12,
    refs: { book: `${K} §6.3` },
    why: 'Handout L19: Kang’s delay formula (integrating the discharge) and sizing for equal rise and fall.',
    picture: { visual: { widget: 'switchMini' }, caption: 'Make the pMOS about µn/µp times wider and the two delays become equal.' },
    predict: {
      prompt: 'For the output to rise as fast as it falls (equal thresholds), the pMOS must be…',
      choices: ['the same width as the nMOS', 'µn/µp times wider', 'µp/µn times wider'],
      answer: 1,
      explain: 'Equal delays need kp = kn: µpWp = µnWn, so Wp = (µn/µp)·Wn, about 2–3× wider.',
    },
    idea: `Follow the output as it falls from VDD: at first the nMOS is **saturated** (Vout > VDD − Vth), a constant current; then it enters **triode** and slows down. Integrating $C_L\\,dV/dt = -I_D$ from VDD to VDD/2 gives Kang’s formula:

$\\tau_{PHL} = \\dfrac{C_L}{k_n(V_{DD} - V_{thn})}\\left[\\dfrac{2V_{thn}}{V_{DD} - V_{thn}} + \\ln\\left(\\dfrac{4(V_{DD} - V_{thn})}{V_{DD}} - 1\\right)\\right]$

and the same with $k_p$, $|V_{thp}|$ for {{tauPLH}}. Quick estimate: the **average-current** method, $\\tau = C_L\\Delta V/I_{avg}$. Sizing: $W_p/W_n = \\mu_n/\\mu_p$ for equal edges; scaling W with the load keeps the delay.`,
    rule: { tex: ['\\tau_{PHL} = \\dfrac{C_L}{k_n(V_{DD} - V_{thn})}\\left[\\dfrac{2V_{thn}}{V_{DD} - V_{thn}} + \\ln\\!\\left(\\dfrac{4(V_{DD} - V_{thn})}{V_{DD}} - 1\\right)\\right]', '\\tau_{PHL} = \\tau_{PLH} \\iff k_n = k_p \\iff \\tfrac{W_p}{W_n} = \\tfrac{\\mu_n}{\\mu_p}'], symbols: ['tauPHL', 'tauPLH', 'kR', 'CL'] },
    worked: { generator: 'd19-size', seed: 3 },
    yourTurn: { generators: ['d18-delay', 'd19-size'], count: 3 },
    lockIn: {
      summary: 'τPHL: saturated phase + triode phase (Kang’s formula), ∝ CL/kn. Equal edges: Wp/Wn = µn/µp. Scale W with CL to keep the delay.',
      hook: '“Fast (saturated) then slow (triode).”',
      cards: [
        { id: 'c-d19-kang', front: 'Kang’s τPHL formula?', back: 'CL/(kn(VDD − Vth))·[2Vth/(VDD − Vth) + ln(4(VDD − Vth)/VDD − 1)].' },
        { id: 'c-d19-size', front: 'Width ratio for equal rise and fall?', back: 'Wp/Wn = µn/µp (≈ 2–3).' },
      ],
    },
  },
  {
    id: 'd20-gates',
    unit: 'L20',
    title: 'NAND and NOR: a gate is an inverter with extra switches',
    minutes: 10,
    refs: { book: `${K} §7.1–7.2` },
    why: 'Handout L20: static analysis of NAND/NOR (VM with all inputs switching) by reducing them to an equivalent inverter.',
    picture: { visual: { widget: 'nandNorMini' }, caption: 'More inputs: the NAND’s VM rises (weak series nMOS), the NOR’s falls (weak series pMOS).' },
    predict: {
      prompt: 'Two equal nMOS in series (both on) act like one transistor with…',
      choices: ['twice the k', 'the same k', 'half the k'],
      answer: 2,
      explain: 'In series the channel is twice as long: k halves. Two in parallel (both on) act like twice the width: k doubles.',
    },
    idea: `A NAND is an inverter whose pull-down is two switches in **series** and whose pull-up is two in **parallel**. A NOR is the opposite.

To analyse it, replace each network by one equivalent transistor: n equal devices in series → $k/n$; n in parallel, all switching together → $n\\cdot k$. Then use the inverter formula for {{VM}}.

So a NAND2 with all inputs switching has $k_{n,eff} = k_n/2$, $k_{p,eff} = 2k_p$: its VM moves up. To make a gate as strong as the reference inverter, widen each series device n times.`,
    rule: { tex: ['n \\text{ in series}: k_{eff} = k/n,\\qquad n \\text{ in parallel (all on)}: k_{eff} = n\\,k', 'V_M = \\dfrac{V_{thn} + \\sqrt{k_{p,eff}/k_{n,eff}}\\,(V_{DD} - |V_{thp}|)}{1 + \\sqrt{k_{p,eff}/k_{n,eff}}}'], symbols: ['VM', 'kR'] },
    worked: { generator: 'd20-gate-vm', seed: 2 },
    yourTurn: { generators: ['d20-gate-vm'], count: 2 },
    lockIn: {
      summary: 'Series: k/n; parallel (all on): n·k. Reduce the gate to an inverter and use the VM formula. Widen series devices n× for equal drive.',
      hook: '“Series halves, parallel doubles.”',
      cards: [
        { id: 'c-d20-eq', front: 'Equivalent k of n equal transistors in series? In parallel?', back: 'Series: k/n. Parallel (all on): n·k.' },
        { id: 'c-d20-nand', front: 'Why does a NAND’s VM rise with more inputs?', back: 'Its series nMOS stack is weaker (k/n) while its parallel pMOS are stronger (n·k).' },
      ],
    },
  },
  {
    id: 'd21-cmoslogic',
    unit: 'L21',
    title: 'Building any CMOS gate: series for AND, parallel for OR, then the dual',
    minutes: 10,
    refs: { book: `${K} §7.3` },
    why: 'Handout L21: draw the CMOS circuit for a given Boolean function and count its transistors.',
    picture: { visual: { widget: 'gateMini' }, caption: 'Type any expression: the pull-down is drawn from it (AND = series, OR = parallel), the pull-up is its dual.' },
    predict: {
      prompt: 'F = NOT(A·B + C). In the pull-down network, A and B are…',
      choices: ['in parallel', 'in series', 'not needed'],
      answer: 1,
      explain: 'The pull-down conducts (F = 0) when A AND B are on, OR when C is on: A–B in series, that branch in parallel with C.',
    },
    idea: `Static CMOS always makes an **inverting** function $F = \\overline{X}$. Recipe:

1. **Pull-down (nMOS)** from X: AND → series, OR → parallel. It conducts exactly when X = 1, pulling F to 0.
2. **Pull-up (pMOS)**: the **dual**: swap series ↔ parallel. It conducts exactly when X = 0.
3. Every input drives one nMOS and one pMOS: 2 transistors per input.

Exactly one network conducts for every input combination, so there is no static current and the output is always driven to a rail. A non-inverting function needs an extra inverter.`,
    rule: { tex: ['F = \\overline{X}:\\; \\text{PDN} = X\\;(\\cdot \\to \\text{series},\\; + \\to \\text{parallel})', '\\text{PUN} = \\text{dual of PDN},\\qquad N_T = 2 \\times \\text{inputs}'], symbols: ['VOH', 'VOL'] },
    worked: { generator: 'd22-complex', seed: 1 },
    yourTurn: { generators: ['d22-complex'], count: 2 },
    lockIn: {
      summary: 'Pull-down from the expression (AND series, OR parallel), pull-up = dual, 2 transistors per input, output always inverted.',
      hook: '“Down follows the formula, up is its mirror.”',
      cards: [
        { id: 'c-d21-rule', front: 'How do you draw a static CMOS gate for F = NOT(X)?', back: 'nMOS pull-down: AND → series, OR → parallel. pMOS pull-up: the dual (swap series/parallel).' },
      ],
    },
  },
  {
    id: 'd22-euler',
    unit: 'L22',
    title: 'Complex gates and the Euler path for a compact layout',
    minutes: 12,
    refs: { book: `${K} §7.4` },
    why: 'Handout L22: size a complex (AOI/OAI) gate and find an input order that lays out both networks as unbroken diffusion strips.',
    picture: { visual: { widget: 'gateMini' }, caption: 'The widths next to each device size every path to one unit transistor; the Euler path is the input order for a single strip.' },
    predict: {
      prompt: 'In F = NOT(A·B + C), sized for the drive of a unit inverter (nMOS width 1), the nMOS on A should be…',
      choices: ['1', '2', '3'],
      answer: 1,
      explain: 'A is in series with B, a path of two devices, so each must be twice as wide to match one unit transistor. C alone stays at 1.',
    },
    idea: `**Sizing**: make the worst path through each network as strong as one unit transistor. Rule: each device’s width = unit × (the number of devices in series on the longest path through it). nMOS unit 1, pMOS unit 2 (µn ≈ 2µp).

**Layout (Euler path)**: draw each network as a graph (nodes = diffusion nodes, edges = transistors). If one input order visits every edge exactly once in **both** graphs, both networks can be laid out as a single unbroken strip with the gate lines in that order: no diffusion breaks, smallest area.`,
    rule: { tex: ['W = W_{unit}\\times(\\text{longest series path through the device})', '\\text{Euler path: one input order that traces every edge once in both PDN and PUN graphs}'], symbols: ['kR'] },
    worked: { generator: 'd22-complex', seed: 5 },
    yourTurn: { generators: ['d22-complex'], count: 2 },
    lockIn: {
      summary: 'Width = unit × longest series path through the device (nMOS 1, pMOS 2). A common Euler path gives one unbroken diffusion strip per network.',
      hook: '“Longest path sets the width; one pen stroke sets the layout.”',
      cards: [
        { id: 'c-d22-size', front: 'How wide should each transistor in a complex gate be?', back: 'Unit width × the number of series devices on the longest conducting path through it.' },
        { id: 'c-d22-euler', front: 'What does a common Euler path buy you?', back: 'An input order that lays out both the pull-up and the pull-down as single unbroken diffusion strips (no breaks).' },
      ],
    },
  },
  {
    id: 'd23-rc',
    unit: 'L23',
    title: 'The RC delay model and the Elmore delay',
    minutes: 10,
    refs: { book: `${W} §4.3` },
    why: 'Handout L23: model transistors as resistors and nodes as capacitors, then estimate delay with Elmore.',
    picture: { visual: { widget: 'elmoreMini' }, caption: 'Add RC sections: the delay grows as n(n + 1)/2, because the far capacitors charge through every resistor before them.' },
    predict: {
      prompt: 'Three equal RC sections in a ladder. The Elmore delay is…',
      choices: ['3RC', '6RC', '9RC'],
      answer: 1,
      explain: 'C1 charges through R, C2 through 2R, C3 through 3R: RC(1 + 2 + 3) = 6RC.',
    },
    idea: `Weste’s model: a unit nMOS is a resistor R when on; a pMOS of the same width is 2R (half the mobility). Each transistor adds capacitance C per unit width at its gate and at its source/drain.

The **Elmore delay** of an RC tree: for every capacitor, multiply it by the total resistance on the path from the driver to it, and add them up:
$t_{pd} = \\sum_i C_i \\sum_{k \\le i} R_k$.

A ladder of n equal sections gives $RC\\,n(n+1)/2$: long series stacks and long wires are slow, quadratically.`,
    rule: { tex: ['t_{pd} = \\sum_i C_i \\left(\\sum_{\\text{path}} R\\right)', 'n \\text{ equal sections}:\\; t_{pd} = RC\\,\\dfrac{n(n+1)}{2}'], symbols: ['R', 'CL'] },
    worked: { generator: 'd23-elmore', seed: 2 },
    yourTurn: { generators: ['d23-elmore'], count: 2 },
    lockIn: {
      summary: 'On transistors are resistors (nMOS R, pMOS 2R per unit width); Elmore: Σ C × resistance from the driver. Ladders grow as n².',
      hook: '“Each capacitor pays for every resistor in front of it.”',
      cards: [{ id: 'c-d23-elmore', front: 'Elmore delay of an RC ladder?', back: 'Σ Ci × (R1 + … + Ri); n equal sections: RC·n(n + 1)/2.' }],
    },
  },
  {
    id: 'd24-linear',
    unit: 'L24',
    title: 'The linear delay model: d = g·h + p',
    minutes: 10,
    refs: { book: `${W} §4.4` },
    why: 'Handout L24: logical effort g, electrical effort h and parasitic delay p give any gate’s delay in one line.',
    picture: { visual: { widget: 'effortMini' }, caption: 'Each gate’s delay (d above it) is its effort g·h plus its parasitic delay p. Try swapping NAND for NOR.' },
    predict: {
      prompt: 'An inverter drives four copies of itself (FO4). In units of τ its delay is…',
      choices: ['4', '5', '8'],
      answer: 1,
      explain: 'g = 1, h = 4, p = 1: d = 1·4 + 1 = 5τ, the famous FO4 delay.',
    },
    idea: `Weste measures delay in units of τ (one ideal inverter driving one identical inverter, no parasitics):
$d = f + p = g\\cdot h + p$.

{{LEh}} = $C_{out}/C_{in}$: how much bigger the load is than the gate’s own input.
{{LEg}}: how much worse than an inverter the gate is at producing current for its input capacitance (inverter 1, NAND2 4/3, NOR2 5/3, NANDn (n + 2)/3, NORn (2n + 1)/3).
{{LEp}}: the delay of driving its own drains (inverter 1, n-input NAND/NOR ≈ n).

NANDs beat NORs because their series devices are the fast nMOS.`,
    rule: { tex: ['d = g\\,h + p,\\qquad h = C_{out}/C_{in}', 'g_{inv} = 1,\\; g_{NAND_n} = \\tfrac{n+2}{3},\\; g_{NOR_n} = \\tfrac{2n+1}{3};\\quad p_{inv} = 1,\\; p_n = n'], symbols: ['LEg', 'LEh', 'LEp'] },
    worked: { generator: 'd24-stage', seed: 3 },
    yourTurn: { generators: ['d24-stage'], count: 3 },
    lockIn: {
      summary: 'd = g·h + p (in τ). h = Cout/Cin; g: inverter 1, NAND (n + 2)/3, NOR (2n + 1)/3; p ≈ n. FO4 = 5τ.',
      hook: '“Effort plus parasitic.”',
      cards: [
        { id: 'c-d24-d', front: 'Linear delay model?', back: 'd = g·h + p: logical effort × electrical effort + parasitic delay (units of τ).' },
        { id: 'c-d24-g', front: 'Logical effort of NAND2, NOR2, NAND3?', back: '4/3, 5/3, 5/3 (inverter = 1).' },
      ],
    },
  },
  {
    id: 'd25-path',
    unit: 'L25',
    title: 'Logical effort of a path: share the effort equally',
    minutes: 14,
    refs: { book: `${W} §4.5` },
    why: 'Handout L25: find the fastest sizing of a chain of gates, its delay, and the best number of stages.',
    picture: { visual: { widget: 'effortMini' }, caption: 'Weste’s NAND2 → NAND3 → NOR2 path: F = 125, f̂ = 5, D = 22τ; every stage carries the same effort.' },
    predict: {
      prompt: 'A path has total effort F = 64 and 3 stages. The best effort per stage is…',
      choices: ['64/3 ≈ 21', '4', '8'],
      answer: 1,
      explain: 'Delay is least when all stages carry the same effort f̂ = F^(1/N) = 64^(1/3) = 4.',
    },
    idea: `For a whole path: $G = \\prod g_i$, $H = C_{out}/C_{in}$, branching $B = \\prod b_i$ (extra loads hanging off the path), and the **path effort** {{Fpath}} $= G\\,B\\,H$.

The delay $D = \\sum g_i h_i + P$ is smallest when every stage has the **same effort** $\\hat f = F^{1/N}$. Then $D = N\\hat f + P$.

Sizing: start at the output and walk back, $C_{in,i} = g_i C_{out,i}/\\hat f$. Too few stages means a huge effort each; too many adds parasitic delay: the best N is about $\\log_4 F$ (stage effort ≈ 4).`,
    rule: { tex: ['F = G\\,B\\,H,\\quad \\hat f = F^{1/N},\\quad D = N\\hat f + P', 'C_{in,i} = \\dfrac{g_i\\,C_{out,i}}{\\hat f},\\qquad \\hat N \\approx \\log_4 F'], symbols: ['Fpath', 'LEg', 'LEh', 'LEp'] },
    worked: { generator: 'd25-path', seed: 4 },
    yourTurn: { generators: ['d25-path'], count: 3 },
    lockIn: {
      summary: 'F = GBH; equal stage effort f̂ = F^(1/N); D = Nf̂ + P; size backwards with Cin = g·Cout/f̂; best N ≈ log4 F.',
      hook: '“Share the pushing equally; about 4 per stage.”',
      cards: [
        { id: 'c-d25-f', front: 'Path effort and minimum delay?', back: 'F = GBH; f̂ = F^(1/N); D = N·f̂ + P.' },
        { id: 'c-d25-n', front: 'Best number of stages?', back: '≈ log4 F (stage effort about 4).' },
      ],
    },
  },
  {
    id: 'd26-power',
    unit: 'L26',
    title: 'Power: α·C·VDD²·f, plus leakage',
    minutes: 10,
    refs: { book: `${W} §5.2–5.3` },
    why: 'Handout L26: compute dynamic and static power and say which knob helps most.',
    picture: { visual: { widget: 'powerMini' }, caption: 'Slide VDD: the dynamic power follows its square. α, C and f are linear.' },
    predict: {
      prompt: 'You lower VDD by 20% (same C, f, α). Dynamic power falls to…',
      choices: ['80%', '64%', '51%'],
      answer: 1,
      explain: 'P ∝ VDD²: 0.8² = 0.64.',
    },
    idea: `Every time a node rises 0 → 1, the supply delivers $C V_{DD}^2$: half is stored on C, half burnt in the pMOS; the stored half is burnt in the nMOS when it falls again.

With {{alpha}} = the chance a node makes a 0 → 1 transition in a cycle:
$P_{dyn} = \\alpha\\,C\\,V_{DD}^2\\,f$.

**Static power**: leakage (subthreshold, gate, junction) flows even when nothing switches: $P_{static} = I_{leak}V_{DD}$. A small **short-circuit** current also flows while both devices are briefly on during an edge.

Best knob: VDD (squared). Then fewer transitions (α), less capacitance, lower f.`,
    rule: { tex: ['P_{dyn} = \\alpha\\,C\\,V_{DD}^2\\,f', 'E_{0\\to1} = C V_{DD}^2\\;(\\tfrac{1}{2}CV_{DD}^2 \\text{ stored})', 'P_{static} = I_{leak}\\,V_{DD}'], symbols: ['alpha', 'VDD'] },
    worked: { generator: 'd26-power', seed: 2 },
    yourTurn: { generators: ['d26-power'], count: 2 },
    lockIn: {
      summary: 'P = αCVDD²f + Ileak·VDD. VDD is the strongest knob (squared).',
      hook: '“Square the supply.”',
      cards: [
        { id: 'c-d26-p', front: 'Dynamic power?', back: 'α·C·VDD²·f (α = probability of a 0→1 transition per cycle).' },
        { id: 'c-d26-e', front: 'Energy drawn from VDD per 0→1 transition?', back: 'C·VDD²; half is stored on C, half burnt in the pull-up.' },
      ],
    },
  },
  {
    id: 'd27-staticdesign',
    unit: 'L27',
    title: 'Static CMOS design: compound gates, bubble pushing, skewed gates',
    minutes: 10,
    refs: { book: `${W} §9.2.1` },
    why: 'Handout L27: implement logic with the fewest, fastest static CMOS stages.',
    picture: { visual: { widget: 'gateMini' }, caption: 'One compound (AOI) gate replaces an AND, an OR and an inverter: fewer stages, less delay.' },
    predict: {
      prompt: 'F = NOT(AB + CD) as one AOI22 gate needs how many transistors?',
      choices: ['4', '8', '12'],
      answer: 1,
      explain: 'Four inputs, one nMOS and one pMOS each: 8 transistors in a single stage.',
    },
    idea: `Static CMOS gates are naturally inverting, so good designs use **compound gates** (AOI, OAI) that do AND-OR-INVERT in one stage.

**Bubble pushing** (De Morgan): an AND with inverted output = an OR with inverted inputs. Push bubbles around a circuit until it maps onto NANDs, NORs and AOIs with no wasted inverters.

**Skewed gates** make one edge faster by giving that network relatively more width (e.g. a HI-skew inverter for a critical rising output). **Asymmetric gates** make the input on the critical path the fastest one (put it nearest the output).`,
    rule: { tex: ['\\overline{A\\cdot B} = \\overline{A} + \\overline{B},\\qquad \\overline{A + B} = \\overline{A}\\cdot\\overline{B}', 'AOI21: F = \\overline{AB + C}\\;(6\\text{ T}),\\quad AOI22: F = \\overline{AB + CD}\\;(8\\text{ T})'], symbols: ['LEg'] },
    worked: { generator: 'd22-complex', seed: 9 },
    yourTurn: { generators: ['d22-complex', 'd24-stage'], count: 3 },
    lockIn: {
      summary: 'Use compound (AOI/OAI) gates, push bubbles with De Morgan to avoid extra inverters, skew or reorder inputs for the critical edge.',
      hook: '“Push the bubbles, merge the stages.”',
      cards: [{ id: 'c-d27-bubble', front: 'Bubble pushing?', back: 'De Morgan: an AND with an output bubble equals an OR with input bubbles (and vice versa).' }],
    },
  },
  {
    id: 'd28-ratioed',
    unit: 'L28',
    title: 'Ratioed circuits (pseudo-nMOS) and CVSL',
    minutes: 10,
    refs: { book: `${W} §9.2.2–9.2.3` },
    why: 'Handout L28: pseudo-nMOS gates trade static power for speed and size; CVSL gives dual-rail outputs without static power.',
    picture: { visual: { widget: 'loadsMini' }, caption: 'Pick “Pseudo-nMOS”: a single always-on pMOS replaces the whole pull-up. VOL > 0 and current flows while the output is low.' },
    predict: {
      prompt: 'A pseudo-nMOS 4-input NOR needs how many transistors?',
      choices: ['5', '8', '4'],
      answer: 0,
      explain: 'Four nMOS in parallel plus one grounded-gate pMOS load: n + 1 = 5.',
    },
    idea: `**Pseudo-nMOS**: keep the nMOS pull-down, replace the pull-up by one weak pMOS with its gate at ground. Only n + 1 transistors, and wide NORs become fast (small input capacitance: Weste gives g ≈ 4/9 for the falling edge).

The cost: a **ratio** constraint (the pull-down must beat the pMOS, typically ~4× stronger, for a low VOL) and **static power** whenever the output is low.

**CVSL** (cascode voltage switch logic): two complementary nMOS pull-downs, one for F and one for $\\overline{F}$, with cross-coupled pMOS loads. Dual-rail outputs, no static power, but twice the wiring.`,
    rule: { tex: ['\\text{pseudo-nMOS: } N_T = n + 1,\\; V_{OL} > 0,\\; P_{static} = V_{DD} I_{load}', 'I_{load} = \\tfrac{k_p}{2}(V_{DD} - |V_{thp}|)^2'], symbols: ['VOL', 'kR'] },
    worked: { generator: 'd16-pseudo', seed: 1 },
    yourTurn: { generators: ['d16-pseudo'], count: 2 },
    lockIn: {
      summary: 'Pseudo-nMOS: n + 1 transistors, fast wide NORs, but VOL > 0 and static power. CVSL: dual-rail, cross-coupled pMOS, no static power.',
      hook: '“One weak pull-up, always on.”',
      cards: [
        { id: 'c-d28-pseudo', front: 'Pseudo-nMOS: pros and cons?', back: 'Few transistors (n + 1), small input cap, fast NORs; but ratioed (VOL > 0) and static power when low.' },
        { id: 'c-d28-cvsl', front: 'What is CVSL?', back: 'Two complementary nMOS pull-down networks (F and F̄) with cross-coupled pMOS loads: dual-rail, no static current.' },
      ],
    },
  },
  {
    id: 'd29-dynamic',
    unit: 'L29',
    title: 'Dynamic circuits: precharge, evaluate, and their pitfalls',
    minutes: 12,
    refs: { book: `${W} §9.2.4` },
    why: 'Handout L29: explain precharge/evaluate, domino logic, monotonicity, and compute charge sharing.',
    picture: { visual: { widget: 'dynamicMini' }, caption: 'Grow the internal capacitance Cx: when it shares charge with the precharged output, Y sags toward the switching threshold.' },
    predict: {
      prompt: 'A precharged output (30 fF at 1 V) shares its charge with an internal node of 10 fF at 0 V. It settles at…',
      choices: ['1 V', '0.75 V', '0.25 V'],
      answer: 1,
      explain: 'Charge is conserved: 30 fF·1 V = 40 fF·V → V = 0.75 V.',
    },
    idea: `A **dynamic gate** replaces the pull-up by one clocked pMOS. clk = 0: **precharge** the output to VDD. clk = 1: **evaluate**: a foot nMOS turns on and the nMOS network may discharge the output. Only n + 2 transistors and only nMOS inputs: fast.

Pitfalls:
**Monotonicity**: once discharged, the output cannot recover in that cycle, so inputs may only rise during evaluation. **Domino** logic adds an inverter after each gate so outputs rise monotonically.
**Charge sharing**: $V_Y = V_{DD}\\,C_{out}/(C_{out} + C_x)$.
**Leakage**: a weak **keeper** pMOS holds the high output.`,
    rule: { tex: ['V_Y = V_{DD}\\dfrac{C_{out}}{C_{out} + C_x}\\;\\text{(charge sharing)}', '\\text{domino: dynamic gate + static inverter} \\Rightarrow \\text{monotonically rising outputs}'], symbols: ['VDD', 'CL'] },
    worked: { generator: 'd29-share', seed: 2 },
    yourTurn: { generators: ['d29-share'], count: 2 },
    lockIn: {
      summary: 'Precharge high, then conditionally discharge. Inputs must be monotonic (domino adds an inverter). Charge sharing: VDD·Cout/(Cout + Cx). Keepers fight leakage.',
      hook: '“Fill the bucket, then maybe pull the plug: no refills until next time.”',
      cards: [
        { id: 'c-d29-share', front: 'Charge-sharing voltage?', back: 'VY = VDD·Cout/(Cout + Cx).' },
        { id: 'c-d29-mono', front: 'Why domino logic?', back: 'Dynamic outputs fall during evaluation; an inverter after each gate makes the signals passed on rise monotonically, as the next dynamic gate needs.' },
      ],
    },
  },
  {
    id: 'd30-pass',
    unit: 'L30',
    title: 'Pass-transistor logic and transmission gates',
    minutes: 10,
    refs: { book: `${W} §9.2.5` },
    why: 'Handout L30: know what level an nMOS, a pMOS and a transmission gate pass, and why long chains are slow.',
    picture: { visual: { widget: 'passMini' }, caption: 'Each row passes VDD: the nMOS stops a threshold short, the pMOS and the transmission gate pass the full rail.' },
    predict: {
      prompt: 'An nMOS pass transistor with its gate at 1.8 V (Vthn = 0.45 V) passes a 1. The output reaches…',
      choices: ['1.8 V', '1.35 V', '0.45 V'],
      answer: 1,
      explain: 'It turns off when its source reaches VG − Vthn = 1.35 V: a weak 1.',
    },
    idea: `A pass transistor is a switch in the signal path, not a pull-up/pull-down. An nMOS passes a **strong 0** but only $V_{DD} - V_{thn}$ for a 1 (weak 1); a pMOS passes a strong 1 but only $|V_{thp}|$ for a 0.

A **transmission gate** (nMOS ∥ pMOS, opposite gate signals) passes both rails. Multiplexers and XORs become very compact this way. CPL uses complementary nMOS pass networks with restoring inverters.

Downsides: weak levels must be restored, and a chain of n switches is an RC ladder: delay $\\approx RC\\,n(n+1)/2$, so insert buffers every few stages.`,
    rule: { tex: ['\\text{nMOS: } 1 \\to V_{DD} - V_{thn},\\; 0 \\to 0;\\quad \\text{pMOS: } 1 \\to V_{DD},\\; 0 \\to |V_{thp}|', '\\text{TG passes both rails};\\quad t_{chain} = RC\\,\\tfrac{n(n+1)}{2}'], symbols: ['VDD', 'Vth'] },
    worked: { generator: 'd30-pass', seed: 1 },
    yourTurn: { generators: ['d30-pass'], count: 2 },
    lockIn: {
      summary: 'nMOS: strong 0, weak 1 (VDD − Vthn); pMOS: strong 1, weak 0; TG: both. Chains grow as n²: buffer them.',
      hook: '“nMOS loves zeros, pMOS loves ones, TG loves both.”',
      cards: [{ id: 'c-d30-levels', front: 'What does an nMOS pass for a 1?', back: 'VDD − Vthn (a weak 1). A pMOS passes |Vthp| for a 0; a transmission gate passes both rails.' }],
    },
  },
  {
    id: 'd31-sequencing',
    unit: 'L31',
    title: 'Sequencing: flip-flops, latches and pulsed latches',
    minutes: 10,
    refs: { book: `${W} §10.1–10.2.1` },
    why: 'Handout L31: compare the three ways to sequence static logic and what each costs in timing.',
    picture: { visual: { widget: 'timingMini' }, caption: 'Between two flip-flops, the data must launch (tpcq), cross the logic (tpd) and arrive a setup time before the next edge.' },
    predict: {
      prompt: 'A flip-flop’s output changes…',
      choices: ['whenever D changes', 'only at the clock edge', 'while the clock is high'],
      answer: 1,
      explain: 'A flip-flop is edge-triggered: it samples D at the edge. A latch is transparent (follows D) while its clock is active.',
    },
    idea: `Sequencing elements stop fast signals from overtaking slow ones.

**Flip-flop** (edge-triggered, two latches back to back): samples D at the clock edge. Simple timing, but each cycle pays {{tpcq}} + {{tsetup}} of overhead.
**Two-phase transparent latches**: each latch is open for half a cycle. Overhead is two latch delays, but slow logic may **borrow time** from the next half-cycle.
**Pulsed latches**: one latch opened by a short pulse. The least overhead, but hold time grows with the pulse width.

The rest of L31–L33 is about when each one fails.`,
    rule: { tex: ['\\text{FF: } T_c \\ge t_{pcq} + t_{pd} + t_{setup}', '\\text{2-phase latches: } t_{pd} \\le T_c - 2t_{pdq}'], symbols: ['tpcq', 'tsetup'] },
    worked: { generator: 'd32-timing', seed: 1 },
    yourTurn: { generators: ['d32-timing'], count: 2 },
    lockIn: {
      summary: 'Flip-flops: simple, overhead tpcq + tsetup. Latches: two latch delays, time borrowing. Pulsed latches: least overhead, worse hold.',
      hook: '“Edge, window, or flash.”',
      cards: [{ id: 'c-d31-kinds', front: 'Three sequencing methods?', back: 'Flip-flops (edge), two-phase transparent latches (half-cycle windows, time borrowing), pulsed latches (a short pulse window).' }],
    },
  },
  {
    id: 'd32-maxmin',
    unit: 'L32',
    title: 'Max-delay (setup) and min-delay (hold) constraints',
    minutes: 12,
    refs: { book: `${W} §10.2.2–10.2.3` },
    why: 'Handout L32: compute the minimum cycle time and check hold for a flip-flop or latch design.',
    picture: { visual: { widget: 'timingMini' }, caption: 'Push tpd up until the slack goes red (setup). Push tcd down: the hold slack goes negative, and no clock frequency fixes it.' },
    predict: {
      prompt: 'A design fails hold. Slowing the clock…',
      choices: ['fixes it', 'does not help', 'makes it worse'],
      answer: 1,
      explain: 'Hold is a race between the shortest path and the same clock edge; the cycle time does not appear in it. Add delay to the short path instead.',
    },
    idea: `**Setup (max-delay)**: the slowest path must arrive before the next edge:
$T_c \\ge t_{pcq} + t_{pd} + t_{setup}$. Violations: slow the clock or speed up the logic.

**Hold (min-delay)**: the **fastest** path must not change D before the capturing flop has finished sampling it on the **same** edge:
$t_{cd} \\ge t_{hold} - t_{ccq}$. Violations: add delay (buffers) to short paths; the clock frequency does not help.

Latches (two-phase): $t_{pd} \\le T_c - 2t_{pdq}$; each phase needs $t_{cd} \\ge t_{hold} - t_{ccq} - t_{nonoverlap}$. A latch lets late data **borrow** up to about half a cycle minus setup.`,
    rule: { tex: ['T_c \\ge t_{pcq} + t_{pd} + t_{setup}', 't_{cd} \\ge t_{hold} - t_{ccq}', '\\text{latches: } t_{pd} \\le T_c - 2t_{pdq},\\; t_{borrow} \\le \\tfrac{T_c}{2} - (t_{setup} + t_{nonoverlap})'], symbols: ['tpcq', 'tsetup', 'thold'] },
    worked: { generator: 'd32-timing', seed: 4 },
    yourTurn: { generators: ['d32-timing'], count: 3 },
    lockIn: {
      summary: 'Setup: Tc ≥ tpcq + tpd + tsetup (fix: slower clock or faster logic). Hold: tcd ≥ thold − tccq (fix: delay the short paths).',
      hook: '“Setup is about the slow path, hold is about the fast one.”',
      cards: [
        { id: 'c-d32-setup', front: 'Flip-flop setup constraint?', back: 'Tc ≥ tpcq + tpd + tsetup.' },
        { id: 'c-d32-hold', front: 'Flip-flop hold constraint, and how to fix a violation?', back: 'tcd ≥ thold − tccq; add delay to the short path (the clock period does not help).' },
      ],
    },
  },
  {
    id: 'd33-skew',
    unit: 'L33',
    title: 'Clock skew: it eats into both setup and hold',
    minutes: 8,
    refs: { book: `${W} §10.2.5` },
    why: 'Handout L33: include clock skew in the setup and hold constraints.',
    picture: { visual: { widget: 'timingMini' }, caption: 'Add skew: the minimum cycle time grows and the hold slack shrinks, both by the skew.' },
    predict: {
      prompt: '50 ps of clock skew (worst case) changes the minimum cycle time by…',
      choices: ['0', '+50 ps', '−50 ps'],
      answer: 1,
      explain: 'In the worst case the capture clock arrives 50 ps early, so the data has 50 ps less time: Tc grows by the skew.',
    },
    idea: `The clock does not reach every flip-flop at exactly the same time. {{tskew}} is the worst-case difference between the launching and capturing clocks.

Worst case for **setup**: the capture clock arrives early: $T_c \\ge t_{pcq} + t_{pd} + t_{setup} + t_{skew}$.
Worst case for **hold**: the capture clock arrives late, giving the fast path longer to corrupt D: $t_{cd} \\ge t_{hold} - t_{ccq} + t_{skew}$.

Skew therefore costs both speed and hold margin. Latch-based designs tolerate skew better because data can borrow time.`,
    rule: { tex: ['T_c \\ge t_{pcq} + t_{pd} + t_{setup} + t_{skew}', 't_{cd} \\ge t_{hold} - t_{ccq} + t_{skew}'], symbols: ['tskew', 'tpcq', 'thold'] },
    worked: { generator: 'd32-timing', seed: 7 },
    yourTurn: { generators: ['d32-timing'], count: 2 },
    lockIn: {
      summary: 'Skew is added to both constraints: Tc grows by tskew and the hold requirement grows by tskew.',
      hook: '“Skew taxes both sides.”',
      cards: [{ id: 'c-d33-skew', front: 'Flip-flop setup and hold with skew?', back: 'Tc ≥ tpcq + tpd + tsetup + tskew; tcd ≥ thold − tccq + tskew.' }],
    },
  },
  {
    id: 'd34-latches',
    unit: 'L34',
    title: 'Latch and flip-flop circuits',
    minutes: 10,
    refs: { book: `${W} §10.3` },
    why: 'Handout L34: recognise the transmission-gate latch and the master–slave flip-flop and explain their timing parameters.',
    picture: { visual: { widget: 'timingMini' }, caption: 'The parameters tpcq, tccq, tsetup and thold used here come from the latch circuits inside each flip-flop.' },
    predict: {
      prompt: 'A master–slave flip-flop is made from…',
      choices: ['one latch', 'two latches clocked on opposite phases', 'a dynamic gate'],
      answer: 1,
      explain: 'The master is open while clk is low, the slave while clk is high: together they sample D at the rising edge.',
    },
    idea: `The simplest **latch** is a transmission gate feeding an inverter: when the clock opens the TG, Q follows D (transparent); when it closes, the value is **held** by a feedback loop (a second, clocked TG and inverter) so it does not leak away. Inverters on the input and output make it robust (no charge sharing, restored levels).

A **master–slave flip-flop** is two latches on opposite clock phases. The master opens while clk = 0; at the rising edge it closes and the slave opens, passing the captured value to Q.

Setup and hold come from the master’s feedback loop closing; clk→Q from the slave’s path.`,
    rule: { tex: ['\\text{latch: transparent while clk active, hold via a feedback loop}', '\\text{FF} = \\text{master (clk}=0\\text{ transparent)} + \\text{slave (clk}=1\\text{ transparent)}'], symbols: ['tpcq', 'tsetup', 'thold'] },
    worked: { generator: 'd32-timing', seed: 9 },
    yourTurn: { generators: ['d32-timing'], count: 2 },
    lockIn: {
      summary: 'Latch: TG + inverter, transparent when open, feedback keeps the value when closed. Flip-flop: master and slave latches on opposite phases.',
      hook: '“Two doors that are never open together.”',
      cards: [{ id: 'c-d34-ms', front: 'How does a master–slave flip-flop work?', back: 'Two latches on opposite phases: the master captures D while clk is low; at the rising edge it closes and the slave passes the value to Q.' }],
    },
  },
  {
    id: 'd35-fulladder',
    unit: 'L35',
    title: 'Adder building blocks: the full adder, generate and propagate',
    minutes: 10,
    refs: { book: `${W} §11.2.1–11.2.2` },
    why: 'Handout L35: write the full-adder equations and the generate/propagate signals every fast adder is built on.',
    picture: { visual: { widget: 'adderMini' }, caption: 'Click bits: a column generates a carry (both 1), kills it (both 0) or propagates the incoming one (exactly one 1).' },
    predict: {
      prompt: 'Bit i has A = 1, B = 0. The carry out of this column is…',
      choices: ['always 0', 'always 1', 'equal to the carry in'],
      answer: 2,
      explain: 'Exactly one input is 1: the column propagates, Cout = Cin.',
    },
    idea: `A **full adder** adds A, B and a carry-in C:
$S = A \\oplus B \\oplus C$, $C_{out} = AB + AC + BC$ (the majority).

Rewrite the carry with two signals that do not depend on C:
**generate** $G = AB$ (this column makes a carry by itself) and **propagate** $P = A \\oplus B$ (it passes the incoming carry on). Then
$C_{out} = G + P\\,C_{in}$ and $S = P \\oplus C_{in}$.

All fast adders compute G and P for every bit at once (in parallel) and then find the carries as quickly as possible.`,
    rule: { tex: ['S = A \\oplus B \\oplus C,\\qquad C_{out} = AB + C(A \\oplus B)', 'G = AB,\\; P = A \\oplus B,\\; C_{i+1} = G_i + P_iC_i'], symbols: ['GP'] },
    worked: { generator: 'd36-adder', seed: 1 },
    yourTurn: { generators: ['d36-adder', 'd37-booth'], count: 2 },
    lockIn: {
      summary: 'S = A⊕B⊕C, Cout = majority. G = AB (make a carry), P = A⊕B (pass it on): Ci+1 = Gi + PiCi.',
      hook: '“Generate, propagate, or kill.”',
      cards: [{ id: 'c-d35-gp', front: 'Generate and propagate?', back: 'G = AB, P = A⊕B; Cout = G + P·Cin; S = P⊕Cin.' }],
    },
  },
  {
    id: 'd36-adders',
    unit: 'L36',
    title: 'Ripple-carry, carry-skip and carry-lookahead adders',
    minutes: 12,
    refs: { book: `${W} §11.2.2` },
    why: 'Handout L36: compare adder delays and explain how skip and lookahead avoid the long carry ripple.',
    picture: { visual: { widget: 'adderMini' }, caption: 'Widen the adder: the ripple delay grows linearly with N, the carry-skip delay much more slowly.' },
    predict: {
      prompt: 'A 64-bit ripple-carry adder is roughly how much slower than a 16-bit one?',
      choices: ['the same', 'about 4×', 'about 16×'],
      answer: 1,
      explain: 'The carry passes through one AND-OR per bit: delay ∝ N.',
    },
    idea: `**Ripple carry**: each bit waits for the previous carry: $t = t_{pg} + (N-1)t_{AO} + t_{xor}$: linear in N.

**Carry-skip**: split into k groups of n bits. If every bit in a group propagates ($P_{group} = \\prod P_i$), a multiplexer sends the group’s carry-in straight out. Worst case: ripple through the first group, skip the middle ones, ripple through the last: $t = t_{pg} + 2(n-1)t_{AO} + (k-1)t_{mux} + t_{xor}$.

**Carry-lookahead**: expand $C_{i+1} = G_i + P_iC_i$ so each carry is a two-level function of the G, P and C0 of its group: $C_2 = G_1 + P_1G_0 + P_1P_0C_0$…, at the cost of wide gates.`,
    rule: { tex: ['t_{ripple} = t_{pg} + (N-1)\\,t_{AO} + t_{xor}', 't_{skip} = t_{pg} + 2(n-1)\\,t_{AO} + (k-1)\\,t_{mux} + t_{xor}', 'C_2 = G_1 + P_1G_0 + P_1P_0C_0\\;\\text{(lookahead)}'], symbols: ['GP'] },
    worked: { generator: 'd36-adder', seed: 3 },
    yourTurn: { generators: ['d36-adder'], count: 2 },
    lockIn: {
      summary: 'Ripple ∝ N; carry-skip lets all-propagate groups pass the carry by a mux; lookahead computes carries in two levels from G and P.',
      hook: '“Crawl, hop, or look ahead.”',
      cards: [
        { id: 'c-d36-ripple', front: 'Ripple-carry delay?', back: 'tpg + (N − 1)·tAO + txor: linear in N.' },
        { id: 'c-d36-skip', front: 'Carry-skip idea?', back: 'If every bit of a group propagates, the group’s carry-in is sent straight to its carry-out through a mux.' },
      ],
    },
  },
  {
    id: 'd37-multiplier',
    unit: 'L37',
    title: 'Binary multiplication: the array multiplier and Booth encoding',
    minutes: 12,
    refs: { book: `${W} §11.9` },
    why: 'Handout L37: count partial products, and recode a multiplier with radix-4 Booth.',
    picture: { visual: { widget: 'boothMini' }, caption: 'Slide the multiplier: each overlapping 3-bit group becomes one digit in {−2, −1, 0, +1, +2}; the digits rebuild the number.' },
    predict: {
      prompt: 'An 8-bit radix-4 Booth multiplier needs how many partial products?',
      choices: ['8', '4 (or 5 for unsigned)', '16'],
      answer: 1,
      explain: 'Each digit covers two bits: 8/2 = 4 partial products for a signed multiplier (one more for unsigned).',
    },
    idea: `Multiplying by hand: each bit of the multiplier y selects a shifted copy of x (an AND gate per bit): **M × N partial-product bits** in N rows, added by an array of adders; the product has M + N bits.

**Radix-4 Booth** halves the rows. Scan y in overlapping groups of three bits $y_{2i+1}y_{2i}y_{2i-1}$ (with $y_{-1} = 0$) and form
$d_i = -2y_{2i+1} + y_{2i} + y_{2i-1} \\in \\{-2,-1,0,1,2\\}$.
Each digit selects 0, ±x or ±2x (a shift and maybe a negation), so an N-bit multiplier needs about N/2 partial products.`,
    rule: { tex: ['\\text{array: } M\\cdot N \\text{ PP bits},\\; N \\text{ rows},\\; M + N \\text{ product bits}', 'd_i = -2y_{2i+1} + y_{2i} + y_{2i-1},\\qquad y = \\sum d_i 4^i'], symbols: ['PP'] },
    worked: { generator: 'd37-booth', seed: 5 },
    yourTurn: { generators: ['d37-booth'], count: 2 },
    lockIn: {
      summary: 'Array: one row of AND gates per multiplier bit. Booth radix-4: digits −2…2 from overlapping triples halve the rows.',
      hook: '“Look at three bits, move two.”',
      cards: [{ id: 'c-d37-booth', front: 'Radix-4 Booth digit?', back: 'd_i = −2·y(2i+1) + y(2i) + y(2i−1) ∈ {−2, −1, 0, 1, 2}; halves the number of partial products.' }],
    },
  },
  {
    id: 'd38-sram',
    unit: 'L38',
    title: 'SRAM: the 6T cell, reading, writing and the periphery',
    minutes: 12,
    refs: { book: `${W} §12.2` },
    why: 'Handout L38: explain how a 6T cell is read and written without being upset, and size its transistors.',
    picture: { visual: { widget: 'sramMini' }, caption: 'Raise the cell ratio: the 0-node bumps up less during a read. Lower the pull-up ratio: writing gets easier.' },
    predict: {
      prompt: 'For a safe read, the pull-down transistor must be…',
      choices: ['weaker than the access transistor', 'stronger than the access transistor', 'the same as the pull-up'],
      answer: 1,
      explain: 'During a read the access transistor pushes charge into the node holding 0; a stronger pull-down keeps that bump small so the cell does not flip.',
    },
    idea: `A **6T cell**: two cross-coupled inverters store a bit; two nMOS **access** transistors connect the nodes to the bitlines when the **word line** rises.

**Read**: precharge both bitlines high, raise WL. The side storing 0 discharges its bitline slowly; a sense amplifier detects a small difference ($t = C_{BL}\\Delta V/I_{cell}$). The 0-node rises a little: the **cell ratio** (pull-down ÷ access, ≳ 1.5–2) keeps it below the other inverter’s VM.
**Write**: drive one bitline low; the access transistor must overpower the pull-up, so pull-up < access.

So: pull-down > access > pull-up. The periphery adds row decoders, precharge, sense amplifiers and write drivers.`,
    rule: { tex: ['\\text{read: } \\tfrac{k_a}{2}(V_{DD} - V_Q - V_{thn})^2 = k_d\\left[(V_{DD} - V_{thn})V_Q - \\tfrac{V_Q^2}{2}\\right],\\; V_Q < V_M', '\\text{strength: pull-down} > \\text{access} > \\text{pull-up}', 't_{read} = C_{BL}\\,\\Delta V / I_{cell}'], symbols: ['CR', 'VM'] },
    worked: { generator: 'd38-sram', seed: 2 },
    yourTurn: { generators: ['d38-sram'], count: 2 },
    lockIn: {
      summary: '6T: cross-coupled inverters + 2 access nMOS. Read stability needs a strong pull-down (cell ratio); writability needs a weak pull-up. Sense amps detect a small bitline swing.',
      hook: '“Pull-down beats access beats pull-up.”',
      cards: [
        { id: 'c-d38-ratio', front: 'SRAM sizing order?', back: 'Pull-down > access (read stability) > pull-up (writability).' },
        { id: 'c-d38-read', front: 'Why do SRAMs use sense amplifiers?', back: 'The tiny cell current discharges a large bitline slowly; sensing a small ΔV (t = CBL·ΔV/I) is much faster than waiting for a full swing.' },
      ],
    },
  },
];
