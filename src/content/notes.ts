/**
 * Your handwritten lecture notes, page by page. Every item on every page is typed out here, explained in
 * plain words, and linked to where the app teaches or drills it. The scanned page itself is shown next to
 * the typed version (src/assets/notes/*.webp), so nothing is lost even where the handwriting is hard to read.
 *
 * Lec 01–08 are explained in depth (derivations step by step); Lec 09–17 are complete but shorter (notes2.ts).
 * Numbers quoted from the notes come from src/physics (ex91, ex92, ex97, peakingFactor), never typed in.
 */
import { ex91, ex97 } from '../physics';
import { texNum } from '../practice/tex';

export interface NoteStep {
  tex: string;
  note?: string;
}

export interface NoteItem {
  /** Short heading, as the topic appears on your page. */
  title: string;
  /** Plain-language explanation (RichText markup: **bold**, $tex$). */
  explain: string;
  /** The formulas exactly as written in your notes (boxed). */
  tex?: string[];
  /** A derivation, one line per step, as in your notes. */
  steps?: NoteStep[];
  /** How this turns up in a question. */
  asked?: string;
  /** A correction or a warning where the notes are loose. */
  careful?: string;
  /** Where to learn or practise it: hash routes without the leading "#/". */
  links?: Array<{ label: string; to: string }>;
}

export interface NotePage {
  id: string;
  lec: number;
  date: string;
  title: string;
  /** Handout lecture(s) this page belongs to. */
  handout: string;
  img: string;
  /** One-line summary of the whole page. */
  summary: string;
  /** Lec 1–8 are the priority for the mid-sem. */
  priority?: boolean;
  items: NoteItem[];
}

const E91 = ex91();
const E97 = ex97();

export const NOTES_A: NotePage[] = [
  {
    id: 'lec01',
    lec: 1,
    date: '3 Aug',
    title: 'Gain and gain error (Razavi Ex 9.1)',
    handout: 'L1',
    img: 'lec01',
    priority: true,
    summary: 'Why an op amp needs a huge open-loop gain: design a gain-of-10 amplifier with under 1% error.',
    items: [
      {
        title: 'The task: gain 10, gain error under 1%',
        explain:
          'A single transistor (common source) gives $A_v = -g_m R_D$, but $g_m$ and $R_D$ drift with temperature and process, so the gain is not accurate. Instead we put a **high-gain op amp** inside a feedback loop. The resistors set the gain; the op amp only has to be "big enough".',
        tex: ['A_v = -g_m R_D'],
        links: [{ label: 'Lesson: gain and gain error', to: 'learn/l1-gain' }],
      },
      {
        title: 'Feedback factor β from the resistor divider',
        explain:
          'The output is fed back through $R_1$ (top) and $R_2$ (bottom). The fraction of $V_{out}$ that reaches the inverting input is $\\beta$. An ideal op amp keeps both inputs equal, so the ideal gain is $1/\\beta$.',
        tex: ['V_f = \\dfrac{R_2}{R_1 + R_2}V_{out}', '\\beta = \\dfrac{V_f}{V_{out}} = \\dfrac{R_2}{R_1+R_2}', 'A_{ideal} = \\dfrac{1}{\\beta} = \\dfrac{R_1+R_2}{R_2} = 1 + \\dfrac{R_1}{R_2} = 10'],
        asked: 'Any "non-inverting amplifier with gain 10" question: β = 0.1.',
      },
      {
        title: 'Closed-loop (actual) gain',
        explain: 'With a finite open-loop gain $A$, the real gain is a little below $1/\\beta$.',
        tex: ['A_{closed} = A_{actual} = \\dfrac{A}{1 + \\beta A}'],
      },
      {
        title: 'Gain error ε, derived',
        explain: 'The error is how far the actual gain falls short of the ideal gain, as a fraction of the ideal gain. Your page simplifies it in three lines:',
        steps: [
          { tex: '\\varepsilon = \\dfrac{A_{ideal} - A_{actual}}{A_{ideal}} = \\dfrac{\\frac{1}{\\beta} - \\frac{A}{1+\\beta A}}{\\frac{1}{\\beta}}' },
          { tex: '= \\beta \\cdot \\dfrac{1 + \\beta A - \\beta A}{\\beta(1+\\beta A)} = \\dfrac{1}{1+\\beta A}', note: 'common denominator β(1 + βA); the βA terms cancel' },
          { tex: '\\varepsilon \\approx \\dfrac{1}{\\beta A}', note: 'because βA ≫ 1' },
        ],
        tex: ['\\varepsilon = \\dfrac{1}{1+\\beta A} \\approx \\dfrac{1}{\\beta A}'],
        links: [{ label: 'Card deck: ε = 1/(1 + βA)', to: 'review' }],
      },
      {
        title: 'Minimum open-loop gain',
        explain: `Set the error at its limit and solve for A. Exactly, $0.01 \\ge 10 - \\frac{A}{1 + A/10}$ (your first line) gives $A \\ge ${texNum(E91.exact)}$; the approximation $\\varepsilon \\approx 1/(\\beta A)$ gives the round answer $A \\ge ${texNum(E91.approx)}$. Quote 1000: it is the answer the course uses.`,
        steps: [
          { tex: '0.01 \\ge \\dfrac{1}{\\beta A} = \\dfrac{10}{A}' },
          { tex: `A \\ge \\dfrac{10}{0.01} = ${texNum(E91.approx)}` },
        ],
        tex: ['A_{min} = \\dfrac{A_{closed}}{\\varepsilon}'],
        asked: 'Razavi Ex 9.1 and every "gain error" part: A ≥ Aclosed/ε.',
        links: [
          { label: 'Razavi Ex 9.1 solved', to: 'practice/bank-ex91' },
          { label: 'Feedback lab', to: 'labs/feedback' },
        ],
      },
    ],
  },
  {
    id: 'lec02',
    lec: 2,
    date: '5 Aug',
    title: 'Performance parameters; one-stage op amps (fully differential and 5-T OTA)',
    handout: 'L1–L2',
    img: 'lec02',
    priority: true,
    summary: 'The list of op-amp specs, GBW, then the two one-stage op amps: gain, input CM range, output swing and bandwidth for each.',
    items: [
      {
        title: 'The performance parameters',
        explain:
          'Every op-amp spec on your list: **1 gain, 2 bandwidth, 3 output voltage swing, 4 linearity, 5 noise, (6) offset** — plus supply rejection from the handout. Gain and bandwidth are traded through the GBW below; swing is set by the stack of transistors at the output.',
        links: [{ label: 'Lesson: swing, offset, noise, supply rejection', to: 'learn/l1-other' }],
      },
      {
        title: 'Bandwidth and GBW of a single-pole system',
        explain:
          'A one-pole op amp has flat gain $A_0$ up to its pole $\\omega_0$, then falls at −20 dB/decade and crosses gain 1 at $\\omega_u$. Gain × bandwidth is constant: the **gain-bandwidth product**.',
        tex: ['\\omega_u = A_0\\,\\omega_0 = \\text{GBW}'],
        asked: 'Settling-time questions (Ex 9.2) ask for the minimum ωu or fu.',
        links: [{ label: 'Lesson: speed, bandwidth and settling', to: 'learn/l1-speed' }],
      },
      {
        title: 'The saturation fence (margin note)',
        explain: 'Every swing and CM-range limit below comes from this one condition: an NMOS stays saturated while its drain is no lower than one threshold below its gate.',
        tex: ['V_{DS} \\ge V_{GS} - V_{th} \\iff V_D \\ge V_G - V_{th}'],
        links: [{ label: 'Lesson: the fence', to: 'learn/u2-pinchoff' }],
      },
      {
        title: 'Fully differential pair with PMOS current-source loads (M1–M4, ISS, two CL)',
        explain:
          'Each output sees $r_{O1,2}$ down and $r_{O3,4}$ up, so the gain is $g_m$ times their parallel value. The input CM range: the bottom is set by the tail needing $V_{ISS}$ plus $V_{GS1}$; the top by M1 leaving saturation when its gate climbs more than $V_{th}$ above its drain, and the drain sits at $V_{DD} - |V_{ov3}|$.',
        tex: [
          'A_v = g_{m1,2}\\,(r_{O1,2} \\parallel r_{O3,4})',
          'V_{in,CM,min} = V_{ISS} + V_{GS1}',
          'V_{in,CM,max} = V_{DD} - |V_{ov3}| + V_{thn}',
        ],
        links: [{ label: 'Lesson: one-stage op amps', to: 'learn/l2-onestage' }],
      },
      {
        title: 'Its output swing (differential)',
        explain:
          'Each output can rise to $V_{DD} - |V_{ov3,4}|$ (PMOS at its edge) and fall to $V_{ISS} + V_{ov1,2}$ (tail plus M1 at its edge). The differential output $V_{out1} - V_{out2}$ swings twice as far as one side.',
        tex: [
          'V_{out1,max} = V_{DD} - |V_{ov3}|,\\quad V_{out2,max} = V_{DD} - |V_{ov4}|',
          'V_{out1,min} = V_{ISS} + V_{ov1},\\quad V_{out2,min} = V_{ISS} + V_{ov2}',
          'V_{out,max} = V_{out1,max} - V_{out2,min},\\quad V_{out,min} = V_{out1,min} - V_{out2,max}',
          '\\text{swing} = 2\\,(V_{DD} - |V_{ov3}| - |V_{ov1}| - V_{ISS})',
        ],
        careful: 'The lowest output really is "one Vth below the input gate" (Vin,CM − Vth). Your notes write VISS + Vov1, which is the same thing when the input CM sits at its minimum, VISS + VGS1. Use VISS + Vov when asked for the maximum swing.',
      },
      {
        title: 'Its bandwidth',
        explain: 'One pole at the output: the output resistance times the load capacitor.',
        tex: ['BW = \\omega_{p1} = \\dfrac{1}{(r_{O2}\\parallel r_{O4})\\,C_L}'],
      },
      {
        title: 'Five-transistor OTA (diode M3, mirror M4, single output)',
        explain:
          'The mirror copies M1’s signal current to the output, so the full $g_m$ reaches the output (not half): same gain as one side of the differential version. The input CM top is now set by the **diode** M3: M1’s drain sits at $V_{DD} - |V_{GS3}|$, a full threshold lower.',
        tex: [
          'A_v = g_{m2}\\,(r_{O2} \\parallel r_{O4})',
          'V_{in,CM,min} = V_{ISS} + V_{GS1}',
          'V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{th1}',
          'V_{out,max} = V_{DD} - |V_{ov4}|,\\quad V_{out,min} = V_{ISS} + V_{ov2}',
          '\\text{swing} = V_{DD} - |V_{ov4}| - V_{ov2} - V_{ISS}',
          'BW = \\omega_{p1} = \\dfrac{1}{(r_{O2}\\parallel r_{O4})\\,C_L}',
        ],
        asked: 'This is the mid-sem question (Quiz 1 Part C): sizes from the CM limits, gain, swing, f−3dB with 4 pF.',
        links: [
          { label: 'Lesson: the 5-T OTA', to: 'learn/u11-ota' },
          { label: 'Lesson: OTA CM range and swing', to: 'learn/u11-ota-range' },
          { label: 'Mid-sem Q1 solved', to: 'practice/bank-exam-q1' },
          { label: 'OTA lab', to: 'labs/ota' },
        ],
      },
    ],
  },
  {
    id: 'lec03',
    lec: 3,
    date: '7 Aug',
    title: 'Unity-gain buffer; telescopic cascode (two versions); the buffer window',
    handout: 'L2',
    img: 'lec03',
    priority: true,
    summary: 'The 5-T OTA in unity feedback (Rout → 1/gm2, pole → gm2/CL), the telescopic op amp’s gain (gm·rO)²/2 and swing, and why a telescopic buffer only works in a narrow window.',
    items: [
      {
        title: '5-T OTA as a unity-gain buffer (output tied to the − input)',
        explain:
          'Output wired straight back: $\\beta = 1$. Because $A_{open} \\gg 1$, the closed-loop gain is about 1. For an NMOS-input OTA with equal $r_O$, $A_{open} = g_{mN}(r_{ON}\\parallel r_{OP}) \\approx g_{mN}r_{ON}/2$.',
        tex: ['A_{closed} = \\dfrac{A_{open}}{1 + \\beta A_{open}},\\quad \\beta = 1 \\Rightarrow A_{closed} = \\dfrac{A_{open}}{1 + A_{open}} \\approx 1', 'A_{open} = g_{mN}(r_{ON}\\parallel r_{OP}) \\approx g_{mN}\\dfrac{r_{ON}}{2}'],
        links: [{ label: 'Lesson: the unity-gain buffer', to: 'learn/l2-buffer' }],
      },
      {
        title: 'What the load sees: a source behind Rout,closed',
        explain:
          'Seen from a load $R_L$, the closed-loop op amp is a voltage source $V_{in}A_{closed}$ behind a small resistance. Feedback divides the output resistance by $(1 + \\beta A_{open})$; for the buffer that leaves $1/g_{m2}$.',
        steps: [
          { tex: 'R_{out,open} = r_{O2}\\parallel r_{O4}' },
          { tex: 'R_{out,closed} = \\dfrac{R_{out,open}}{1+\\beta A_{open}} \\approx \\dfrac{R_{out,open}}{A_{open}}' },
          { tex: '= \\dfrac{r_{O2}\\parallel r_{O4}}{g_{m2}(r_{O2}\\parallel r_{O4})} = \\dfrac{1}{g_{m2}}' },
        ],
        tex: ['R_{out,closed} \\approx \\dfrac{1}{g_{m2}}'],
      },
      {
        title: 'The buffer’s bandwidth',
        explain: 'Open loop, the pole is $1/((r_{O2}\\parallel r_{O4})C_L)$. Closed loop, the same $C_L$ sees only $1/g_{m2}$, so the pole moves up by the loop gain to $g_{m2}/C_L$ — the GBW.',
        tex: ['\\omega_{p,open} = \\dfrac{1}{(r_{O2}\\parallel r_{O4})C_L}', '\\omega_{out,closed} = \\dfrac{1}{\\frac{1}{g_{m2}}C_L} = \\dfrac{g_{m2}}{C_L}'],
        asked: 'Mid-sem Q1(e): "output short-circuited with Vin2 (buffer), bandwidth with 4 pF?" → gm2/(2πCL).',
        links: [
          { label: 'Lesson: poles and bandwidth', to: 'learn/u12-poles' },
          { label: 'Mid-sem Q1 (part e)', to: 'practice/bank-exam-q1' },
        ],
      },
      {
        title: 'Telescopic cascode op amp, fully differential (M1–M8, ISS)',
        explain:
          'Cascoding both the input pair (M3, M4 on M1, M2) and the loads (M5, M6 on M7, M8) makes each side’s resistance $g_m r_O^2$. Looking up and looking down are both $g_m r_O r_O$, and in parallel they halve.',
        steps: [
          { tex: 'A_{open} = g_{m1,2}\\left[g_{m4}r_{O4}r_{O2} \\parallel g_{m6}r_{O6}r_{O8}\\right]' },
          { tex: '= g_{mN}\\left[g_{mN}r_{ON}^2 \\parallel g_{mP}r_{OP}^2\\right]', note: 'gmP = gmN, rOP = rON' },
          { tex: '= g_{mN}\\dfrac{g_{mN}r_{ON}^2}{2} = \\dfrac{(g_{mN}r_{ON})^2}{2}' },
        ],
        tex: ['A_{open} \\approx \\dfrac{(g_m r_O)^2}{2}', '\\text{swing} = 2\\left[V_{DD} - \\{|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ISS}\\}\\right]'],
        asked: 'Tutorial 2 Q1–Q2, Razavi Ex 9.7: gain and differential swing of a telescopic.',
        links: [
          { label: 'Lesson: telescopic cascode', to: 'learn/u9-telescopic' },
          { label: 'Lesson: one-stage op amps', to: 'learn/l2-onestage' },
          { label: 'Cascode lab', to: 'labs/cascode' },
        ],
      },
      {
        title: 'Mirror-loaded telescopic (single output, diode stack M5, M7)',
        explain:
          'Replace the top current sources by a cascode mirror. The diode-connected stack (M7, M5) fixes M6’s gate at $V_{DD} - |V_{GS7}| - |V_{GS5}|$, and M6 stays saturated only while its drain is no more than $|V_{thp}|$ above that gate. So the output tops out at $V_{DD} - |V_{ov8}| - |V_{ov6}| - |V_{thp}|$: the mirror costs **one extra $|V_{thp}|$** of swing.',
        tex: ['\\text{swing} = V_{DD} - \\{|V_{ov8}| + |V_{ov6}| + |V_{thp}| + V_{ov4} + V_{ov2} + V_{ISS}\\}'],
        links: [{ label: 'Figure and lesson: one-stage op amps', to: 'learn/l2-onestage' }],
      },
      {
        title: 'Telescopic as a buffer: the output window',
        explain:
          'Tie $V_{out}$ to the gate of M2. Now the output is also an input, so two fences fight. **M4 saturated** needs the output high enough; **M2 saturated** needs its drain X (one $V_{GS4}$ below $V_{b1}$) to stay within $V_{th}$ of its gate, which is the output.',
        steps: [
          { tex: 'M4:\\; V_{out} - V_X \\ge V_{b1} - V_X - V_{th4} \\Rightarrow V_{out} \\ge V_{b1} - V_{th4}', note: '(1)' },
          { tex: 'M2:\\; V_X - V_P \\ge V_{out} - V_P - V_{th2} \\Rightarrow V_X + V_{th2} \\ge V_{out}' },
          { tex: 'V_X = V_{b1} - V_{GS4} \\Rightarrow V_{b1} - V_{GS4} + V_{th2} \\ge V_{out}', note: '(2)' },
        ],
        tex: ['V_{b1} - V_{th4} \\le V_{out} \\le V_{b1} - V_{GS4} + V_{th2}', '\\text{width} = V_{th} - V_{ov4}'],
        asked: 'Tutorial 2 Q2(b), Tutorial 3 Q1(c): "maximum output swing if the gate of M2 is tied to the output".',
        links: [
          { label: 'Lesson: the buffer window', to: 'learn/l2-buffer' },
          { label: 'Tutorial 3 Q1 solved', to: 'practice/bank-t3q1' },
        ],
      },
    ],
  },
  {
    id: 'lec04',
    lec: 4,
    date: '10 Aug',
    title: 'Buffer window (shaded); designing a telescopic op amp (Razavi Ex 9.7)',
    handout: 'L2–L3',
    img: 'lec04',
    priority: true,
    summary: 'The window drawn as a shaded band, then the full design recipe for a telescopic op amp: power → currents → swing budget → overdrives → W/L → gain → lengthen M5–M8.',
    items: [
      {
        title: 'The buffer window as a picture',
        explain:
          'Draw $V_{b1}$ at the top. The output must stay below $V_{b1} - (V_{GS4} - V_{th2})$ and above $V_{b1} - V_{th4}$. The shaded band between them is all the output gets: about $V_{th} - V_{ov}$ wide.',
        tex: ['V_{b1} - V_{th4} \\le V_{out} \\le V_{b1} - (V_{GS4} - V_{th2})'],
        links: [{ label: 'Lesson: the buffer window', to: 'learn/l2-buffer' }],
      },
      {
        title: 'Design spec (Ex 9.7)',
        explain:
          'VDD = 3 V, power 10 mW, open-loop gain 2000, differential swing 3 V peak-to-peak, µnCox = 60 µA/V², µpCox = 30 µA/V², λn = 0.1, λp = 0.2 V⁻¹ at L = 0.5 µm, γ = 0, |Vth| = 0.7 V. Design order on your page: **① ID ② Vov ③ W/L ④ gm ⑤ rO**.',
        links: [{ label: 'Lesson: the design procedure', to: 'learn/l3-design' }],
      },
      {
        title: '① Currents from the power budget',
        explain: 'Total current = power ÷ supply. A little goes to the bias branch (Mb1–Mb3, about 0.33 mA); the rest is the tail: 1.5 mA per side.',
        steps: [
          { tex: 'P_D = V_{DD}\\,I_{total} \\Rightarrow I_{total} = \\dfrac{10\\,\\text{mW}}{3\\,\\text{V}} = 3.33\\,\\text{mA}' },
          { tex: 'I_{total} = I_{b1} + I_{b3} + I_{D7} + I_{D8} = 0.33\\,\\text{mA} + 3\\,\\text{mA}' },
          { tex: 'I_{D7} = I_{D8} = 1.5\\,\\text{mA}' },
        ],
      },
      {
        title: '② Overdrives from the swing budget',
        explain: 'Each side must swing 1.5 V. What is left of VDD is shared among the five stacked overdrives. Give the tail the most (0.5 V), the PMOS 0.3 V each, the NMOS 0.2 V each.',
        steps: [
          { tex: '3 = 2\\left[3 - \\{|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ov9}\\}\\right]' },
          { tex: '|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ov9} = 1.5\\,\\text{V}' },
          { tex: 'V_{ov9} = 0.5,\\; |V_{ov8}| = |V_{ov6}| = 0.3,\\; V_{ov4} = V_{ov2} = 0.2\\,\\text{V}' },
        ],
      },
      {
        title: '③ W/L from the square law',
        explain: 'Rearrange $I_D = \\frac12 \\mu C_{ox}\\frac{W}{L}V_{ov}^2$ for W/L, device by device.',
        steps: [
          { tex: `1.5\\,\\text{mA} = \\tfrac12 (60\\,\\mu)\\tfrac{W}{L}(0.2)^2 \\Rightarrow \\left(\\tfrac{W}{L}\\right)_{1-4} = ${texNum(E97.wlN, 4)}` },
          { tex: `1.5\\,\\text{mA} = \\tfrac12 (30\\,\\mu)\\tfrac{W}{L}(0.3)^2 \\Rightarrow \\left(\\tfrac{W}{L}\\right)_{5-8} = ${texNum(E97.wlP, 4)}`, note: '≈ 555/0.5 (µm/µm)' },
          { tex: `\\left(\\tfrac{W}{L}\\right)_{9} = ${texNum(E97.wl9, 3)}`, note: '3 mA at 0.5 V' },
        ],
        tex: ['\\dfrac{W}{L} = \\dfrac{2I_D}{\\mu C_{ox}V_{ov}^2}'],
      },
      {
        title: '④⑤ Gain check: gm, rO, Rup, Rdown',
        explain: `$g_m = 2I_D/V_{ov}$ and $r_O = 1/(\\lambda I_D)$. Rup is the PMOS cascode, Rdown the NMOS cascode. The gain comes out near ${texNum(E97.av, 4)} (your page: 1428; Razavi prints 1416) — short of 2000, so it **needs to be improved**.`,
        steps: [
          { tex: 'g_{m6} = \\dfrac{2(1.5\\,\\text{m})}{0.3} = 10\\,\\text{mS},\\quad r_{O6} = r_{O8} = \\dfrac{1}{0.2 \\times 1.5\\,\\text{m}} = 3.33\\,\\text{k}\\Omega' },
          { tex: 'g_{m4} = \\dfrac{2(1.5\\,\\text{m})}{0.2} = 15\\,\\text{mS},\\quad r_{O4} = r_{O2} = \\dfrac{1}{0.1 \\times 1.5\\,\\text{m}} = 6.67\\,\\text{k}\\Omega' },
          { tex: 'R_{up} = g_{m6}r_{O6}r_{O8} \\approx 111\\,\\text{k}\\Omega,\\quad R_{down} = g_{m4}r_{O4}r_{O2} \\approx 666\\,\\text{k}\\Omega' },
          { tex: `A_v = g_{m1,2}(R_{up}\\parallel R_{down}) = 15\\,\\text{mS}\\,(111\\,\\text{k}\\parallel 666\\,\\text{k}) \\approx ${texNum(E97.av, 4)}` },
        ],
        tex: ['A_v = g_{m1,2}\\,(R_{up}\\parallel R_{down})'],
      },
      {
        title: 'Fix the gain without changing the overdrives: lengthen M5–M8',
        explain:
          'Intrinsic gain grows with the device area per unit current. Doubling **both** W and L keeps W/L (so Vov, gm and the swing stay put) but halves λ, doubling rO. Only the weak side (Rup, the PMOS) needs it.',
        steps: [
          { tex: 'g_m r_O = \\sqrt{2\\mu C_{ox}\\tfrac{W}{L}I_D}\\times\\dfrac{1}{\\lambda I_D} \\propto \\sqrt{\\dfrac{WL}{I_D}}', note: 'λ ∝ 1/L' },
          { tex: 'L = 1\\,\\mu\\text{m for M5–M8} \\Rightarrow \\lambda_p = 0.1\\,\\text{V}^{-1},\\; r_{O6} = r_{O8} = 6.67\\,\\text{k}\\Omega' },
          { tex: 'R_{up} = 10\\,\\text{mS}\\times 6.67\\,\\text{k}\\times 6.67\\,\\text{k} = 444.9\\,\\text{k}\\Omega' },
          { tex: `A_v = 15\\,\\text{mS}\\,(444.9\\,\\text{k}\\parallel 666\\,\\text{k}) \\approx ${texNum(E97.avLengthened, 2)}`, note: 'meets the 2000 spec' },
        ],
        tex: ['g_m r_O \\propto \\sqrt{\\dfrac{WL}{I_D}},\\quad \\lambda \\propto \\dfrac{1}{L}'],
        asked: 'Problem Set 1 P3, P6 and Tutorial 2 Q3 are this exact recipe with new numbers.',
        links: [
          { label: 'Razavi Ex 9.7 solved', to: 'practice/bank-ex97' },
          { label: 'Lesson: the design procedure', to: 'learn/l3-design' },
          { label: 'Lesson: linear scaling', to: 'learn/l3-scaling' },
        ],
      },
    ],
  },
  {
    id: 'lec05',
    lec: 5,
    date: '12 Aug',
    title: 'Closing the loop through capacitors (Ex 9.6); the folding transformation; folded cascode',
    handout: 'L2, L4',
    img: 'lec05',
    priority: true,
    summary: 'A fully differential op amp closed with C1–R1–R2 / C2–R3–R4, the step-by-step folding of a cascode, and the PMOS-input folded cascode with Rup, Rdown and Gm.',
    items: [
      {
        title: 'Fully differential op amp closed through C1–R1, R2 and C2–R3, R4 (Ex 9.6)',
        explain:
          'The input capacitors block DC, so the resistors tie the input CM to the output CM: **the input gates sit at the same DC level as the outputs**. In the telescopic version (M1, M3 with R1, R2 on one side) that sets where the outputs can sit and how far they swing.',
        tex: ['V_{CM} = V_b - (V_{GS3,4} - V_{th1,2})'],
        links: [{ label: 'Lesson: closed loop through capacitors', to: 'learn/l2-cmchoice' }],
      },
      {
        title: 'The folding transformation',
        explain:
          'A cascode (M1 under M2) can be **folded**: keep M2 as the cascode but feed its source from the drain of an opposite-type input device M1, and add a current source $I_2$ to carry both currents. Signal current from M1 still flows through M2 to the output. The PMOS version works the same way upside down.',
        links: [{ label: 'Lesson: folding', to: 'learn/l4-folding' }],
      },
      {
        title: 'Folding a differential pair (ISS1, ISS2)',
        explain: 'Folding the telescopic: the cascodes M3, M4 now sit on top current sources $I_{SS1}$ and the bottom sources $I_{SS2}$ carry the folded input current too.',
        tex: ['I_{SS2} = I_{SS1} + \\dfrac{I_{SS}}{2}'],
      },
      {
        title: 'PMOS-input folded cascode (M1–M11) and its output resistance',
        explain:
          'Looking **up** into the PMOS cascode (M5 on M7): $g_{m5}r_{O5}r_{O7}$. Looking **down** into the NMOS cascode (M3) whose source node also carries the input device’s $r_{O1}$ and the bottom source $r_{O9}$ in parallel.',
        tex: ['R_{up} = g_{m5}r_{O5}r_{O7}', 'R_{down} = g_{m3}r_{O3}(r_{O1}\\parallel r_{O9})'],
        careful: 'Your notes number the devices M9, M10 (bottom), M5, M6 (PMOS cascodes), M7, M8 (top). The app and Tutorial 2 Q3 use Razavi’s numbering: M5, M6 bottom, M7, M8 cascodes, M9, M10 top. Same formulas, different labels.',
        links: [{ label: 'Lesson: folded-cascode gain', to: 'learn/l4-gain' }],
      },
      {
        title: 'Gm of the folded cascode by current divider',
        explain:
          'M1’s small-signal current $g_{m1}v_{in}$ reaches the folding node and splits: into M3’s source ($\\frac{1}{g_{m3}}\\parallel r_{O3}$, small) or down into $r_{O9}\\parallel r_{O1}$ (large). Almost all of it goes up through M3, so $G_m \\approx g_{m1}$.',
        steps: [
          { tex: 'I_{out} = g_{m1}v_{in}\\times\\dfrac{r_{O9}\\parallel r_{O1}}{\\left(\\frac{1}{g_{m3}}\\parallel r_{O3}\\right) + (r_{O9}\\parallel r_{O1})}' },
          { tex: 'I_{out} \\approx g_{m1}v_{in}\\times\\dfrac{r_{O1}\\parallel r_{O9}}{r_{O1}\\parallel r_{O9}}' },
          { tex: 'G_m = \\dfrac{I_{out}}{v_{in}} \\approx g_{m1}' },
        ],
        tex: ['A_v = G_m(R_{up}\\parallel R_{down}) \\approx g_{m1}(R_{up}\\parallel R_{down})'],
        asked: 'Tutorial 2 Q3, Problem Set 1 P6–P7, Tutorial 6 Q3.',
        links: [
          { label: 'Tutorial 2 Q3 solved', to: 'practice/bank-t2q3' },
          { label: 'Folded-cascode lab', to: 'labs/folded' },
        ],
      },
    ],
  },
  {
    id: 'lec06',
    lec: 6,
    date: '14 Aug',
    title: 'Folded-cascode CM range (PMOS and NMOS input); rail-to-rail input; folded cascode as a buffer; low-voltage cascode load',
    handout: 'L4, L3, L6',
    img: 'lec06',
    priority: true,
    summary: 'Input CM limits of both folded cascodes, the NMOS-input gain, a complementary (rail-to-rail) input, the window when the output is shorted to an input, the low-voltage cascode load (M7, M8 gates on X), and the start of gain boosting.',
    items: [
      {
        title: 'PMOS-input folded cascode: input CM range',
        explain:
          'Top limit: the PMOS tail M11 needs $|V_{ov11}|$ and M1 needs $|V_{GS1}|$ below VDD. Bottom limit: M1 (PMOS) stays saturated while its gate is no more than $|V_{thp}|$ below its drain, and its drain is the folding node at $V_{ov9}$. So the input CM can go **below ground**. Your numbers: 1.8 − 0.2 − 0.7 = 0.9 V at the top, 0.2 − 0.5 = −0.3 V at the bottom.',
        steps: [
          { tex: 'V_{in,CM,max} = V_{DD} - |V_{ov11}| - |V_{GS1}|' },
          { tex: 'V_{in,CM,min} = V_{ov9} - |V_{thp}|' },
          { tex: '= V_{ov9} + |V_{ov1}| - |V_{GS1}| = V_{ov9} + |V_{ov1}| - (|V_{ov1}| + |V_{th1}|)', note: 'the same thing written with VGS1' },
        ],
        tex: ['V_{ov9} - |V_{thp}| \\le V_{in,CM} \\le V_{DD} - |V_{ov11}| - |V_{GS1}|'],
        asked: 'Problem Set 1 P8 (input CM range of a folded cascode): the minimum is negative.',
        links: [{ label: 'Lesson: folding (CM limits)', to: 'learn/l4-folding' }],
      },
      {
        title: 'NMOS-input folded cascode (M1, M2 NMOS, M11 tail; PMOS M9, M10 on top, M7, M8 PMOS cascodes, M5, M6 NMOS cascodes on M3, M4)',
        explain:
          'Same idea mirrored. The fold node now hangs from the **top** PMOS M10, so Rup carries $(r_{O10}\\parallel r_{O2})$ under the PMOS cascode M8; Rdown is the NMOS cascode M6 on M4. Input CM: bottom set by the tail and $V_{GS1}$; top by M1’s drain at $V_{DD} - |V_{ov10}|$ (it can go **above VDD**).',
        tex: [
          'A_v = g_{m1,2}\\left[g_{m8}r_{O8}(r_{O10}\\parallel r_{O2}) \\parallel g_{m6}r_{O6}r_{O4}\\right]',
          'V_{in,CM,min} = V_{ov11} + V_{GS1}',
          'V_{in,CM,max} = V_{DD} - |V_{ov10}| + V_{th1}',
        ],
        links: [{ label: 'Lesson: folded-cascode gain', to: 'learn/l4-gain' }],
      },
      {
        title: 'Rail-to-rail input: NMOS and PMOS pairs together (M1–M13)',
        explain:
          'Your bottom-left circuit puts a PMOS pair (M3, M4 with tail M13) and an NMOS pair (M1, M2) in parallel, both folding into the same cascode branch (M5–M12). When the input CM is near ground the PMOS pair works; near VDD the NMOS pair works; in the middle both do. That is how an op amp accepts **any input CM from rail to rail** (handout L9, §9.8).',
        careful: 'Gm changes as the input CM moves (one pair, both pairs, the other pair), so the gain is not constant across the range.',
        links: [{ label: 'Lesson: input range and slew rate', to: 'learn/l9-slew' }],
      },
      {
        title: 'Folded cascode with the output shorted to an input (buffer)',
        explain:
          'Tie $V_{out}$ to the gate of input PMOS M2. **M4** (NMOS cascode, gate $V_{b2}$) needs the output high enough. **M2** (PMOS) needs its drain — M4’s source, $V_{b2} - V_{GS4}$ — to stay no more than $|V_{th2}|$ above its gate. Your numbers: $0.8 - 0.4 = 0.4$ V and $0.8 - 0.6 - 0.5 = -0.3$ V, so the **M4 limit binds**: the output must stay above 0.4 V.',
        steps: [
          { tex: 'M4:\\; V_{out} - V_{S4} \\ge V_{b2} - V_{S4} - V_{th4} \\Rightarrow V_{out} \\ge V_{b2} - V_{th4}' },
          { tex: 'M2\\,(\\text{PMOS}):\\; V_{D2} \\le V_{G2} + |V_{th2}|,\\quad V_{D2} = V_{b2} - V_{GS4},\\; V_{G2} = V_{out}' },
          { tex: 'V_{out} \\ge V_{b2} - V_{GS4} - |V_{th2}|' },
        ],
        tex: ['V_{out} \\ge \\max\\left(V_{b2} - V_{th4},\\; V_{b2} - V_{GS4} - |V_{th2}|\\right)'],
        asked: 'The folded-cascode version of the buffer-window question (Tutorial 3 Q1(c) is the telescopic one).',
      },
      {
        title: 'Low-voltage cascode load: M7, M8 gates tied to X',
        explain:
          'The last circuit is a single-ended telescopic whose PMOS load is a cascode mirror with the top gates (M7, M8) tied to **X**, the drain of cascode M5 — M7 is not a diode. So $X = V_{DD} - |V_{GS7}|$. **M5 saturated** (its drain X at most $|V_{th5}|$ above its gate) gives the lowest $V_{b1}$; **M7 saturated** (its drain P keeps $|V_{ov7}|$ below VDD) gives $P_{max}$, and since $P = V_{b1} + |V_{GS5}|$ that caps $V_{b1}$. With $V_{b1}$ in between, the output keeps the full $V_{DD} - |V_{ov8}| - |V_{ov6}|$ at the top: no diode tax (compare the Lec 3 mirror).',
        tex: ['V_{b1} \\ge V_{DD} - |V_{GS7}| - |V_{th5}|', 'V_{P,max} = V_{DD} - |V_{ov7}| = V_{DD} - |V_{GS7}| + |V_{th7}|', 'V_{b1} \\le V_{DD} - |V_{ov7}| - |V_{GS5}|'],
        careful: 'Your page writes the second line as VDD − |VGS7| − |Vth7|. Since |Vov7| = |VGS7| − |Vth7|, it is + |Vth7|. Earlier versions of this guide called M7 a diode (Razavi Fig 9.12); on your page its gate goes to X, so this is the low-voltage cascode load.',
        links: [{ label: 'Lesson: one-stage op amps (cascode mirror load)', to: 'learn/l2-onestage' }],
      },
      {
        title: 'Gain boosting begins',
        explain: 'Every amplifier gain is $A_v = G_m R_{out}$. $G_m$ is hard to raise (it is set by $g_m$); $R_{out}$ is the one to improve. Lec 7–8 do it.',
        tex: ['A_v = G_m R_{out}'],
        links: [{ label: 'Lesson: gain boosting', to: 'learn/l6-boost' }],
      },
    ],
  },
  {
    id: 'lec07',
    lec: 7,
    date: '17 Aug',
    title: 'Two-stage op amps; gain boosting: why Gm cannot be boosted, and Rout boosted by (1 + A1)',
    handout: 'L5, L6',
    img: 'lec07',
    priority: true,
    summary: 'Two-stage op amps (simple and telescopic first stage, fully differential and single-ended), the "high gain, then high swing" block diagram, and the two gain-boosting derivations.',
    items: [
      {
        title: 'Two-stage op amp, simple first stage (M1–M4 + CS second stages M5–M8)',
        explain:
          'Stage 1 (red loop on your page) is a differential pair with current-source loads: it makes the gain. Stage 2 (green) is a common-source stage on each side: one device to each rail, so it makes the swing. Gains multiply.',
        tex: ['A_1 = g_{m1,2}(r_{O1,2}\\parallel r_{O3,4})', 'A_2 = g_{m5,6}(r_{O5,6}\\parallel r_{O7,8})', 'A = A_1 \\times A_2'],
        links: [{ label: 'Lesson: two-stage op amp', to: 'learn/l5-twostage' }],
      },
      {
        title: 'The idea in one picture',
        explain: '**High-gain amplifier → high-swing amplifier.** A cascode gives gain but eats swing; a CS output stage gives swing but little gain. Put them in series and get both.',
      },
      {
        title: 'Two-stage with a telescopic first stage (M1–M8 cascode, M9, M10 PMOS CS, M11, M12 current sources)',
        explain:
          'Now stage 1 is a full telescopic cascode: its gain is $g_{m1}$ times (PMOS cascode ∥ NMOS cascode). Stage 2 is PMOS M9 (M10) with an NMOS current source M11 (M12). The Bode sketch: two poles, so more gain but the phase drops faster — compensation later (L13–L14).',
        tex: ['A_1 = g_{m1}\\left[g_{m5}r_{O5}r_{O7} \\parallel g_{m3}r_{O3}r_{O1}\\right]', 'A_2 = g_{m9}(r_{O9}\\parallel r_{O11})'],
        asked: 'Tutorial 3 Q3 (Razavi Fig 9.24) is exactly this op amp: CM level at X, Y, sizes for the swing, overall gain.',
        links: [{ label: 'Tutorial 3 Q3 solved', to: 'practice/bank-t3q3' }],
      },
      {
        title: 'Single-ended version (M11 diode, M12 mirror)',
        explain: 'Make M11 a diode and M12 its mirror: the left second stage now drives the mirror, and the right side gives a single output $V_{out}$ with the full differential gain.',
      },
      {
        title: 'Gain boosting: Av = Gm × Rout',
        explain: 'Stacking more cascodes multiplies Rout by $g_m r_O$ each time ($r_{O1} \\to g_{m2}r_{O2}r_{O1} \\to g_{m3}r_{O3}g_{m2}r_{O2}r_{O1}$) but costs headroom. Gm is "very hard to improve"; Rout "needs to be improved".',
        tex: ['A_v = G_m \\times R_{out}'],
      },
      {
        title: 'Trying to boost Gm with an amplifier in front: no improvement',
        explain:
          'Put an amplifier $A_1$ before M1: $G_m = A_1 g_m$ looks bigger. But with a degeneration resistor $R_S$ (a real source), work out the current: the extra gain is eaten by the source feedback.',
        steps: [
          { tex: 'I_o = (A_1 V_{in} - I_{out}R_S)\\,g_{m2}' },
          { tex: 'I_{out} = I_o\\dfrac{r_{O2}}{r_{O2}+R_S} = (A_1V_{in} - I_{out}R_S)\\,g_{m2}\\dfrac{r_{O2}}{r_{O2}+R_S}' },
          { tex: 'I_{out}\\left[1 + \\dfrac{g_{m2}r_{O2}R_S}{r_{O2}+R_S}\\right] = A_1V_{in}\\,g_{m2}\\dfrac{r_{O2}}{r_{O2}+R_S}' },
          { tex: '\\dfrac{I_{out}}{V_{in}} = \\dfrac{A_1g_{m2}r_{O2}}{r_{O2} + R_S + g_{m2}r_{O2}R_S}', note: '"No improvement"' },
        ],
        careful: 'This is your page exactly. Lec 8 redoes it with the amplifier sensing the source and gets A1·gm/(RS + (1 + A1)gm·rO·RS): for large RS the Gm is still ≈ 1/RS, whatever A1 is.',
      },
      {
        title: 'Boosting Rout instead: the derivation with a test source',
        explain:
          'Without boosting, a degenerated device looks like $R_S + r_O + g_m R_S r_O$. Now let an amplifier $A_1$ watch the source and drive the gate the other way. Apply $V_X$, find $I_X$:',
        steps: [
          { tex: 'V_S = I_X R_S,\\quad V_G = -A_1 I_X R_S' },
          { tex: 'I_o = g_{m2}(V_G - V_S) = g_{m2}[-A_1I_XR_S - I_XR_S] = -g_{m2}R_SI_X(1 + A_1)' },
          { tex: 'I_X = I_o + \\dfrac{V_X - I_XR_S}{r_{O2}} = -g_{m2}R_SI_X(1 + A_1) + \\dfrac{V_X - I_XR_S}{r_{O2}}' },
          { tex: '\\dfrac{V_X}{I_X} = R_S + r_{O2} + g_{m2}(1 + A_1)R_S r_{O2}' },
        ],
        tex: ['R_{out} = R_S + r_O + (1 + A_1)\\,g_m R_S r_O'],
        asked: 'Tutorial 4 Q1–Q2 (gain-boosted cascode: bias, Rout, gain).',
        links: [
          { label: 'Lesson: gain boosting', to: 'learn/l6-boost' },
          { label: 'Tutorial 4 Q1 solved', to: 'practice/bank-t4q1' },
        ],
      },
    ],
  },
  {
    id: 'lec08',
    lec: 8,
    date: '19 Aug',
    title: 'Gain boosting: Gm, Rout, the (gm·rO)³ gain, and three ways to build the auxiliary amplifier',
    handout: 'L6',
    img: 'lec08',
    priority: true,
    summary: 'Redo of the Gm derivation, the resistance looking into the boosted device’s source, Gm ≈ gm1 by current division, Rout ≈ (1 + A1)gm2rO1rO2, Av ≈ (gm·rO)³, and the CS, PMOS and folded auxiliary amplifiers with their headroom costs.',
    items: [
      {
        title: 'Gm with an amplifier driving the gate and sensing the source',
        explain: 'Same circuit as Lec 7 with the amplifier’s − input on the source. The gate gets $(V_{in} - I_{out}R_S)A_1$ and the source sits at $I_{out}R_S$:',
        steps: [
          { tex: '\\big[(V_{in} - I_{out}R_S)A_1 - I_{out}R_S\\big]g_m = I_o,\\quad I_{out} = I_o\\dfrac{r_O}{r_O + R_S}' },
          { tex: 'I_{out}\\left[1 + (A_1R_S + R_S)\\dfrac{g_mr_O}{r_O + R_S}\\right] = V_{in}A_1\\dfrac{g_mr_O}{r_O+R_S}' },
          { tex: '\\dfrac{I_{out}}{V_{in}} = \\dfrac{A_1g_mr_O}{R_S + r_O + (1+A_1)R_Sg_mr_O} \\approx \\dfrac{A_1g_m}{R_S + (1+A_1)g_mr_OR_S}' },
        ],
        careful: 'Compare the plain degenerated device: gm·rO/(RS + rO + gm·RS·rO). The amplifier does not rescue Gm, which is why boosting targets Rout.',
      },
      {
        title: 'Rout of the boosted device (repeat of Lec 7)',
        explain: 'With the test source $V_X$ at the drain, the source moves by $I_XR_S$ and the gate by $-A_1I_XR_S$:',
        tex: ['R_{out} = R_S + r_O + (1 + A_1)\\,g_m R_S r_O'],
      },
      {
        title: 'Looking into the source of a boosted device',
        explain:
          'Plain device with $R_D$ on its drain: looking into the source you see $\\frac{R_D + r_O}{1 + g_mr_O}$. With the amplifier boosting it, the "fight back" is $(1 + A_1)$ times stronger, so the resistance is $(1 + A_1)$ times smaller.',
        tex: ['R_{in,source} = \\dfrac{R_D + r_O}{1 + g_mr_O}\\ \\text{(plain)}', 'R_{in,source} = \\dfrac{R_D + r_O}{1 + (1 + A_1)g_mr_O}\\ \\text{(boosted)}'],
        links: [{ label: 'Lesson: the three impedance rules', to: 'learn/u6-rules' }],
      },
      {
        title: 'Boosted cascode: Gm ≈ gm1 by current division',
        explain:
          'Input device M1 under boosted cascode M2. With $R_D \\to 0$ the source of M2 looks like $\\frac{r_{O2}}{(1 + A_1)g_{m2}r_{O2}} \\approx \\frac{1}{(1+A_1)g_{m2}}$, tiny compared with $r_{O1}$, so all of M1’s current goes up. (The small box on your page is the current divider: $I_{R2} = I\\frac{R_1}{R_1 + R_2}$.)',
        steps: [
          { tex: 'R_{in,M2} = \\dfrac{r_{O2} + R_D}{1 + (1+A_1)g_{m2}r_{O2}} \\approx \\dfrac{1}{(1+A_1)g_{m2}}' },
          { tex: 'I_{out} = g_{m1}V_{in}\\times\\dfrac{r_{O1}}{r_{O1} + \\frac{1}{(1+A_1)g_{m2}}} \\approx g_{m1}V_{in}\\dfrac{r_{O1}}{r_{O1}}' },
          { tex: 'G_m = \\dfrac{I_{out}}{V_{in}} \\approx g_{m1}' },
        ],
        tex: ['I_{R_2} = I\\,\\dfrac{R_1}{R_1+R_2}'],
      },
      {
        title: 'Rout and the gain of the boosted cascode',
        explain: 'Put $R_S = r_{O1}$ in the Rout formula. If every $g_m$ and $r_O$ is equal and the auxiliary is one CS stage ($A_1 = g_{m3}r_{O3}$), the gain is about $(g_mr_O)^3$.',
        steps: [
          { tex: 'R_{out} = r_{O1} + r_{O2} + (1+A_1)g_{m2}r_{O1}r_{O2} \\approx (1+A_1)g_{m2}r_{O1}r_{O2}' },
          { tex: 'A_v = G_mR_{out} \\approx g_{m1}(1 + A_1)g_{m2}r_{O1}r_{O2}' },
          { tex: 'A_1 = g_{m3}r_{O3} \\Rightarrow A_v \\approx (g_mr_O)^3' },
        ],
        tex: ['R_{out} \\approx (1+A_1)\\,g_{m2}r_{O1}r_{O2}', 'A_v \\approx g_{m1}(1 + A_1)g_{m2}r_{O1}r_{O2} \\approx (g_mr_O)^3'],
        asked: 'Tutorial 4 Q1(b), Q2(e): overall gain of a boosted cascode.',
        links: [{ label: 'Tutorial 4 Q2 solved', to: 'practice/bank-t4q2' }],
      },
      {
        title: 'Implementation 1: a CS auxiliary (M3 with current source I2)',
        explain:
          'The simplest $A_1$: an NMOS M3 whose gate is M2’s source and whose drain (loaded by $I_2$) drives M2’s gate. Gain $A_1 = g_{m3}r_{O3}$. **Disadvantage:** M2’s source now sits at $V_{GS3}$, not at $V_{ov1}$, so the output cannot go as low.',
        tex: ['A_v = g_{m1}(1 + g_{m3}r_{O3})g_{m2}r_{O2}r_{O1}', 'V_{out,min} = V_{GS3} + V_{ov2}'],
        asked: 'Tutorial 4 Q1(a), (c): gate bias of M2 and M3, output swing with this headroom cost.',
        links: [{ label: 'Figure: gain-boosted cascode', to: 'learn/l6-boost' }],
      },
      {
        title: 'Implementation 2: a PMOS auxiliary (M3 PMOS from VDD, I2 below)',
        explain:
          'Use a PMOS CS stage instead: gate at P (M2’s source), drain at G (M2’s gate). For M3 to stay saturated its drain G cannot be more than $|V_{th3}|$ above its gate P — which means M2 itself must run with $V_{GS2} \\le |V_{th3}|$. That is hard (M2 barely on, as the cross-section sketch shows).',
        steps: [
          { tex: 'V_{DS3} \\le V_{GS3} - V_{th3}\\ \\text{(PMOS, magnitudes)} \\Rightarrow V_G \\le V_P + |V_{th3}|' },
          { tex: 'V_P + V_{GS2} \\le V_P + |V_{th3}|' },
          { tex: 'V_{GS2} \\le |V_{th3}|' },
        ],
        tex: ['V_{GS2} \\le |V_{th3}|'],
      },
      {
        title: 'Implementation 3: a folded-cascode auxiliary (PMOS M3 folded into NMOS M4, I3 and I2)',
        explain:
          'Fold the PMOS auxiliary into an NMOS cascode M4 (gate $V_b$) with current sources $I_3$, $I_2$. The auxiliary becomes a cascode stage, so its gain is $g_{m3}$ times a cascode resistance — and the headroom problem of implementation 1 is gone.',
        tex: ['A_v = G_m R_{out} = g_{m1}(1+A_1)g_{m2}r_{O1}r_{O2}', 'A_1 = g_{m3}\\,g_{m4}r_{O4}r_{O3}'],
        links: [
          { label: 'Lesson: gain boosting', to: 'learn/l6-boost' },
          { label: 'Tutorial 4 Q3 solved', to: 'practice/bank-t4q3' },
        ],
      },
    ],
  },
];
