/**
 * Your notes, Lec 09–17, the settling-time example and the current-mirror handout. Complete (every item
 * on each page), explained more briefly than Lec 01–08. Numbers come from src/physics.
 */
import { ex92, peakingFactor, wlFromId } from '../physics';
import { texNum } from '../practice/tex';
import type { NotePage } from './notes';

const E92 = ex92();
const MIRROR_WL = wlFromId(40e-6, 300e-6, 0.11);

export const NOTES_B: NotePage[] = [
  {
    id: 'lec09',
    lec: 9,
    date: '21 Aug',
    title: 'Auxiliary amplifiers for gain boosting; differential boosting; CMFB introduction',
    handout: 'L6, L7',
    img: 'lec09',
    summary: 'The folded auxiliary amplifier’s gain, boosting a differential pair (one aux per side or one differential aux), a full folded-cascode aux, both cascodes boosted, and why fully differential outputs need CMFB.',
    items: [
      {
        title: 'Folded auxiliary amplifier (M3 PMOS into M4 NMOS cascode, I3, I2)',
        explain: 'The auxiliary amp is itself an amplifier: $A_{aux} = G_{m,aux}R_{out,aux}$. Its input device is M3 ($g_{m3}$) and its output sees the cascode $g_{m4}r_{O4}r_{O3}$.',
        tex: ['A_v = G_mR_{out},\\quad G_m = g_{m1}', 'R_{out} = (1 + A_{aux})\\,g_{m2}r_{O2}r_{O1}', 'A_{aux} = G_{m,aux}R_{out,aux} = g_{m3}\\,g_{m4}r_{O4}r_{O3}', 'A_v = g_{m1}\\left[1 + g_{m3}g_{m4}r_{O4}r_{O3}\\right]g_{m2}r_{O2}r_{O1}'],
        links: [{ label: 'Lesson: gain boosting', to: 'learn/l6-boost' }],
      },
      {
        title: 'Boosting a differential pair: two single aux amps, or one differential aux',
        explain: 'Each cascode (M3, M4) needs its own booster ($A_1 = A_2$). Because the two sides move in opposite directions, one **differential** auxiliary amplifier can watch both sources and drive both gates.',
        tex: ['A_1 = A_2'],
      },
      {
        title: 'Differential boosting with CS auxiliaries (M5, M6, ISS1)',
        explain: 'Using a differential pair (M5, M6 with its own tail $I_{SS1}$) as the auxiliary costs headroom at the bottom: the output must stay above the aux tail, its $V_{GS}$ and the cascode’s overdrive.',
        tex: ['V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}'],
      },
      {
        title: 'Folded-cascode auxiliary (M5, M7, M9, M11, M13)',
        explain: 'A full folded cascode as the auxiliary: $A_{aux} = g_{m5}(R_{up,aux}\\parallel R_{down,aux})$.',
        tex: ['R_{out} = (1 + A_{aux})\\,g_{m3}r_{O3}r_{O1}', 'A_{aux} = g_{m5}\\left[g_{m11}r_{O11}r_{O13} \\parallel g_{m7}r_{O7}(r_{O9}\\parallel r_{O5})\\right]'],
        links: [{ label: 'Figure: gain boosting with a folded auxiliary', to: 'learn/l6-boost' }],
      },
      {
        title: 'Telescopic op amp with both cascodes boosted (A1, A2)',
        explain: 'Boost the NMOS cascodes with $A_1$ — a folded-cascode diff amp with **PMOS** inputs (its input CM is low, near the cascode sources) — and the PMOS cascodes with $A_2$, a folded-cascode diff amp with **NMOS** inputs (its input CM is high). Same trick on a folded-cascode main amplifier.',
      },
      {
        title: 'Common-mode feedback: why it is needed',
        explain: 'With resistor loads the output CM is set by $V_{DD} - R_D I_{SS}/2$. With current-source loads (M3, M4 from $V_b$) each output sits between a PMOS source $I_P$ and an NMOS source $I_N$: any mismatch $I_P - I_N$ flows into a huge resistance $R_P \\parallel R_N$, so the output CM is undefined.',
        tex: ['\\Delta V_{out,CM} = (I_P - I_N)(R_P\\parallel R_N)'],
        links: [{ label: 'Lesson: CMFB, why outputs float', to: 'learn/l7-cmfb' }],
      },
    ],
  },
  {
    id: 'lec10',
    lec: 10,
    date: '24 Aug',
    title: 'CMFB: CM and DM parts, the general structure, resistive and source-follower sensing',
    handout: 'L7',
    img: 'lec10',
    summary: 'Splitting inputs into CM and DM parts, the current mismatch picture, the sense → compare → correct loop, and the two simplest sensing circuits.',
    items: [
      {
        title: 'Inputs as CM + DM',
        explain: 'Any pair of inputs is a common part plus a difference part: $V_{in1} = \\frac{V_{in1}+V_{in2}}{2} + \\frac{V_{in1}-V_{in2}}{2}$, $V_{in2} = \\frac{V_{in1}+V_{in2}}{2} + \\frac{V_{in2}-V_{in1}}{2}$. The DM part swings the outputs in opposite directions (the two sine waves); the CM part moves both together.',
        tex: ['V_{CM} = \\dfrac{V_{in1}+V_{in2}}{2},\\quad v_d = V_{in1} - V_{in2}'],
        links: [{ label: 'Lesson: differential pair', to: 'learn/u10-steering' }],
      },
      {
        title: 'The mismatch current',
        explain: 'At an output node $I_P = I_N + I_X$, so $I_X = I_P - I_N$ must flow somewhere — into the output resistances $R_P$, $R_N$. That is what drives the output CM to a rail.',
        tex: ['I_X = I_P - I_N'],
      },
      {
        title: 'General structure of CMFB',
        explain: 'A **common-mode sensing circuit** produces $V_{out,CM}$; a **CMFB amplifier** compares it with $V_{REF}$; its output adjusts a current source (here the tail $I_{SS}$).',
        links: [{ label: 'Lesson: CMFB concept', to: 'learn/l7-cmfb' }],
      },
      {
        title: 'Resistive sensing (R1 = R2 between the outputs)',
        explain: 'By superposition the midpoint is the average of the outputs. The catch: $R_1$ appears in parallel with the output resistance, so the gain drops.',
        steps: [
          { tex: 'V_{out}\\big|_{V_{out1}} = V_{out1}\\dfrac{R_2}{R_1+R_2},\\quad V_{out}\\big|_{V_{out2}} = V_{out2}\\dfrac{R_1}{R_1+R_2}' },
          { tex: 'V_{out,CM} = V_{out1}\\dfrac{R_2}{R_1+R_2} + V_{out2}\\dfrac{R_1}{R_1+R_2} = \\dfrac{V_{out1}+V_{out2}}{2}', note: 'R1 = R2' },
        ],
        tex: ['A_v = g_{m1}(r_{O1}\\parallel r_{O3})\\ \\text{(without)},\\quad A_v = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R_1)\\ \\text{(with)}'],
        asked: 'Tutorial 5 Q3 (R = 10 MΩ sensing): Ad and ACM with and without CMFB.',
        links: [{ label: 'Tutorial 5 Q3 solved', to: 'practice/bank-t5q3' }],
      },
      {
        title: 'Source-follower sensing (M5, M6 with I1, I2, then R1, R2)',
        explain: 'Buffer each output with a follower first so the resistors do not load it. The sensed value is level-shifted down by one $V_{GS}$ (your example: 0.9 V outputs, 0.5 V at the follower sources). Each follower output carries the DC CM level plus the AC signal.',
        tex: ['V_{sense} = \\dfrac{V_{out1}+V_{out2}}{2} - V_{GS5,6}'],
        careful: 'The follower needs headroom: the outputs cannot drop below VGS5 + (what the current source needs), which limits the swing.',
      },
    ],
  },
  {
    id: 'lec11',
    lec: 11,
    date: '31 Aug',
    title: 'CMFB: deep-triode sensing, differential-pair sensing, the feedback loop',
    handout: 'L7–L8',
    img: 'lec11',
    summary: 'Two triode devices (M10, M11) whose total resistance depends on Vout1 + Vout2, the deep-triode Ron, a nonlinear diff-pair sensor, and the CMFB loop.',
    items: [
      {
        title: 'Deep-triode resistance',
        explain: 'In triode with small $V_{DS}$ the $V_{DS}^2$ term drops out and the device is a resistor controlled by its gate.',
        steps: [
          { tex: 'I_D = \\tfrac12\\mu_nC_{ox}\\tfrac{W}{L}\\left[2(V_{GS}-V_{th})V_{DS} - V_{DS}^2\\right]' },
          { tex: 'I_D \\approx \\mu_nC_{ox}\\tfrac{W}{L}(V_{GS}-V_{th})V_{DS}', note: 'deep triode' },
          { tex: 'R_{on} = \\dfrac{V_{DS}}{I_D} = \\dfrac{1}{\\mu_nC_{ox}\\frac{W}{L}(V_{GS}-V_{th})}' },
        ],
        links: [{ label: 'Lesson: triode and saturation', to: 'learn/u2-squarelaw' }],
      },
      {
        title: 'Triode sensing: M10 and M11 gated by the two outputs',
        explain: 'Their resistances are in parallel, and the sum depends only on $V_{out1} + V_{out2}$ — exactly the CM.',
        tex: ['R_{tot,P} = R_{on10}\\parallel R_{on11} = \\dfrac{1}{\\mu_nC_{ox}(W/L)_{10,11}(V_{out1}+V_{out2}-2V_{th})}'],
        asked: 'Quiz 2 (all parts) and Tutorial 5 Q1.',
        links: [
          { label: 'Lesson: CMFB techniques', to: 'learn/l8-cmfb' },
          { label: 'Quiz 2 Part A solved', to: 'practice/bank-quiz2a' },
        ],
      },
      {
        title: 'Saturation vs triode in one line',
        explain: 'In saturation the device is a voltage-controlled current source (VCCS), $I_D = \\frac12\\mu C_{ox}\\frac{W}{L}(V_{GS}-V_{th})^2$; in deep triode it is a voltage-controlled resistor.',
      },
      {
        title: 'Differential-pair sensing (M1–M4 with VREF, M5 as the controlled source)',
        explain: 'Two pairs compare each output with $V_{REF}$. Each half-current goes as a square of the difference, so the sensed current is **nonlinear** in the outputs: it works for small swings only.',
        tex: ['I_D \\propto (V_{REF} - V_{out1})^2 + (V_{REF} - V_{out2})^2'],
      },
      {
        title: 'Feedback mechanism and comparison',
        explain: 'The CMFB loop is a feedback loop like any other: its error is $\\approx 1/(\\beta A)$ of the loop. Your two circuits: an error amp driving the tail M11 of the input pair, and triode devices M11, M12 at the bottom of a telescopic.',
        tex: ['\\dfrac{A}{1+\\beta A},\\quad \\varepsilon \\approx \\dfrac{1}{\\beta A}'],
      },
    ],
  },
  {
    id: 'lec12',
    lec: 12,
    date: '2 Sep',
    title: 'CMFB techniques: triode-sensing equation, replica CMFB, removing the copy error',
    handout: 'L8',
    img: 'lec12',
    summary: 'Error amp on the tail or on the top sources, the output-CM equation for triode sensing, a replica branch M14–M15 that sets the CM from VREF, and M16–M18 that make the copy exact.',
    items: [
      {
        title: 'Where the CMFB amplifier acts',
        explain: 'Two versions on your page: the error amp drives the input pair’s tail M11, or it drives the bottom current sources M3, M4 of the folded cascode. Either way it changes a current until $V_{out,CM} = V_{REF}$.',
      },
      {
        title: 'Triode sensing equation',
        explain: 'The cascode bias fixes P: $V_P = V_{b1} - V_{GS3}$. The tail current $2I_D$ flows through $R_{tot,P}$, so the output CM is pinned:',
        steps: [
          { tex: 'V_{b1} - V_{GS3} = 2I_D\\,R_{tot,P} = \\dfrac{2I_D}{\\mu_nC_{ox}(W/L)_{11,12}(V_{out1}+V_{out2}-2V_{th})}' },
          { tex: 'V_{out1}+V_{out2} = \\dfrac{2I_D}{\\mu_nC_{ox}(W/L)_{11,12}}\\cdot\\dfrac{1}{V_{b1} - V_{GS3}} + 2V_{th}' },
        ],
        asked: 'Quiz 2 Part A: VP, then (W/L)11,12 so that Vout1 + Vout2 = VDD.',
        links: [{ label: 'Quiz 2 solved', to: 'practice/bank-quiz2a' }],
      },
      {
        title: 'Replica CMFB (M14, M15 copy M11–M13)',
        explain: 'A replica branch with $I_1$, M14 (copy of M11) and M15 (gate at $V_{REF}$, as wide as M12 + M13 together) sets the same gate voltage. When the outputs equal $V_{REF}$ the copy is balanced.',
        tex: ['I_{D11} = I_{D14} = I_1', '(W/L)_{14} = (W/L)_{11}', '(W/L)_{15} = (W/L)_{12} + (W/L)_{13}'],
        links: [{ label: 'Lesson: replica CMFB', to: 'learn/l8-replica' }],
      },
      {
        title: 'Removing the finite copy error (M16, M17, M18)',
        explain: 'The copy is off because $V_{DS11} \\ne V_{DS14}$. Add M17, M18 (copies of M1, M2) so M14’s drain sits where M11’s does.',
        tex: ['(W/L)_{17} = (W/L)_1,\\quad (W/L)_{18} = (W/L)_2'],
        links: [{ label: 'Problem Set 2 P5 (replica CMFB)', to: 'practice/bank-ps2-p5' }],
      },
    ],
  },
  {
    id: 'lec13',
    lec: 13,
    date: '7 Sep',
    title: 'RC step response, the closed-loop time constant, small- vs large-signal step, slew rate',
    handout: 'L1, L9',
    img: 'lec13',
    summary: 'Step response of an RC by Laplace, the feedback amplifier with Rout and CL, the 5-T OTA with a small step (linear) and a large step (all of ISS into CL).',
    items: [
      {
        title: 'RC low-pass step response',
        explain: 'Partial fractions on $\\frac{V_0}{s(1+s\\tau)}$ give the familiar exponential. The slope is largest at $t = 0$: $V_0/\\tau$.',
        steps: [
          { tex: '\\dfrac{V_{out}}{V_{in}}(s) = \\dfrac{1}{1+sRC} = \\dfrac{1}{1+s\\tau},\\quad V_{in}(s) = \\dfrac{V_0}{s}' },
          { tex: 'V_{out}(s) = V_0\\left(\\dfrac{1}{s} - \\dfrac{\\tau}{1+s\\tau}\\right)' },
          { tex: 'V_{out}(t) = V_0\\left(1 - e^{-t/\\tau}\\right)u(t),\\quad \\dfrac{dV_{out}}{dt} = \\dfrac{V_0}{\\tau}e^{-t/\\tau}' },
        ],
        links: [{ label: 'Lesson: settling', to: 'learn/u12-settling' }],
      },
      {
        title: 'Feedback amplifier with Rout and CL (R1, R2 divider)',
        explain: 'KCL at the output with $R_1 + R_2 \\gg R_{out}$ gives a one-pole closed loop. Its gain is the usual $A/(1+\\beta A)$ and its time constant is the open-loop $R_{out}C_L$ divided by $(1 + \\beta A)$.',
        steps: [
          { tex: '\\dfrac{\\left(V_{in} - V_{out}\\frac{R_2}{R_1+R_2}\\right)A - V_{out}}{R_{out}} = \\dfrac{V_{out}}{R_1+R_2} + V_{out}sC_L' },
          { tex: '\\dfrac{V_{out}}{V_{in}} = \\dfrac{A}{\\left(1 + \\frac{AR_2}{R_1+R_2}\\right)\\left[1 + \\dfrac{sC_LR_{out}}{1 + \\frac{AR_2}{R_1+R_2}}\\right]}' },
        ],
        tex: ['V_{out}(t) = V_0\\dfrac{A}{1 + A\\frac{R_2}{R_1+R_2}}\\left[1 - e^{-t/\\tau}\\right]', '\\tau = \\dfrac{C_LR_{out}}{1 + A\\frac{R_2}{R_1+R_2}}'],
        asked: 'Tutorial 6 Q1–Q2: closed-loop gain, τ, Vout after 1 ns, initial slope.',
        links: [{ label: 'Tutorial 6 Q1 solved', to: 'practice/bank-t6q1' }],
      },
      {
        title: '5-T OTA, small step: linear',
        explain: 'A small step ΔV splits as $\\pm g_m\\Delta V/2$ in the two sides; the mirror adds them, so $g_m\\Delta V$ charges $C_L$. Currents stay near $I_{SS}/2 \\pm \\Delta i_d$.',
        tex: ['V_{out}(s) = g_m\\Delta V\\dfrac{1}{sC_L}\\ \\text{(initially)},\\quad A = g_{m1,2}(r_{O2}\\parallel r_{O4})'],
      },
      {
        title: '5-T OTA, large step: slewing',
        explain: 'A big step turns M2 off: all of $I_{SS}$ goes through M1, the mirror copies it, and $I_{SS}$ charges $C_L$ at a fixed rate. Your number: 5 V/µs.',
        steps: [
          { tex: 'i = C\\dfrac{dv}{dt} \\Rightarrow \\dfrac{dv}{dt} = \\dfrac{i}{C}' },
          { tex: '\\dfrac{dV_{out}}{dt}\\Big|_{max} = \\dfrac{I_{SS}}{C_L} = SR' },
        ],
        tex: ['SR = \\dfrac{I_{SS}}{C_L}'],
        asked: 'Tutorial 6 (all three), mid-sem style "SR with CL = …".',
        links: [
          { label: 'Lesson: slew rate', to: 'learn/l9-slew' },
          { label: 'Feedback lab (big-step toggle)', to: 'labs/feedback' },
        ],
      },
    ],
  },
  {
    id: 'lec14',
    lec: 14,
    date: '9 Sep',
    title: 'Slewing in the telescopic and folded cascode; the concept of stability; Barkhausen',
    handout: 'L9, L11',
    img: 'lec14',
    summary: 'Each output of a fully differential telescopic slews at ISS/2CL (the difference at ISS/CL); the folded cascode slews from IP; loop gain βA(s) and the Barkhausen condition.',
    items: [
      {
        title: 'Telescopic slewing (fully differential)',
        explain: 'M2 off: one output loses $I_{SS}/2$, the other gains $I_{SS}/2$ (from the top sources). Each output slews at $I_{SS}/2C_L$; the difference at $I_{SS}/C_L$.',
        tex: ['\\dfrac{dV_{out1}}{dt} = -\\dfrac{I_{SS}}{2C_L},\\quad \\dfrac{dV_{out}}{dt}\\Big|_{max} = \\dfrac{dV_{out1}}{dt} - \\dfrac{dV_{out2}}{dt} = -\\dfrac{I_{SS}}{C_L}'],
        links: [{ label: 'Problem Set 2 P1 (telescopic slew)', to: 'practice/bank-ps2-p1' }],
      },
      {
        title: 'Folded-cascode slewing',
        explain: 'With the input pair fully steered, the folding branch on one side carries $I_P - I_{SS}$ and the other $I_P$; the output slews from the difference (set by $I_P$ and $I_{SS}$).',
        asked: 'Tutorial 6 Q3: slewing of a folded cascode.',
        links: [{ label: 'Tutorial 6 Q3 solved', to: 'practice/bank-t6q3' }],
      },
      {
        title: 'Concept of stability: the feedback loop',
        explain: 'Closed-loop gain $X_o/X_s = A(s)/(1 + \\beta(s)A(s))$. The **loop gain** is $\\beta(s)A(s)$; with a resistive β it is frequency independent, so $\\beta A(s)$.',
        tex: ['\\dfrac{X_o}{X_s}(s) = \\dfrac{A(s)}{1+\\beta(s)A(s)}', 'A(s) = \\dfrac{A_M}{\\left(1+\\frac{s}{\\omega_{p1}}\\right)\\left(1+\\frac{s}{\\omega_{p2}}\\right)}'],
        links: [{ label: 'Lesson: Barkhausen', to: 'learn/l11-barkhausen' }],
      },
      {
        title: 'Barkhausen criteria',
        explain: 'If at some frequency $\\omega_1$ the loop gain is exactly 1 with −180° of phase, the denominator $1 + \\beta A$ becomes 0 and the closed-loop gain is infinite: the circuit oscillates.',
        tex: ['|\\beta A(j\\omega_1)| = 1,\\quad \\angle\\beta A(j\\omega_1) = -180^\\circ \\Rightarrow A_f(j\\omega_1) = \\infty'],
      },
      {
        title: 'Complex numbers you need',
        explain: 'Magnitude and angle of $a + jb$; for each pole factor $(1 + j\\omega/\\omega_p)$ the angle is $\\tan^{-1}(\\omega/\\omega_p)$.',
        tex: ['a + jb = Me^{j\\theta} = M(\\cos\\theta + j\\sin\\theta)', 'M = \\sqrt{a^2+b^2},\\quad \\theta = \\tan^{-1}\\dfrac{b}{a}'],
      },
    ],
  },
  {
    id: 'lec15',
    lec: 15,
    date: '11 Sep',
    title: 'Bode plots of the loop gain; gain and phase margin; one- and two-pole systems',
    handout: 'L11–L12',
    img: 'lec15',
    summary: 'Magnitude and phase asymptotes, lowering β lowers the loop-gain curve, ωGX and ωPX, PM = 180° + ∠βA(ωGX), single-pole systems always stable (PM 90°), two-pole systems.',
    items: [
      {
        title: 'Bode asymptotes',
        explain: 'Each pole bends the magnitude down by −20 dB/decade from $\\omega_p$ and takes the phase from 0 to −90° between $0.1\\omega_p$ and $10\\omega_p$ (−45° at the pole).',
        tex: ['|A| = \\dfrac{A_0}{\\sqrt{1+(\\omega/\\omega_{p1})^2}\\sqrt{1+(\\omega/\\omega_{p2})^2}},\\quad \\angle = -\\tan^{-1}\\dfrac{\\omega}{\\omega_{p1}} - \\tan^{-1}\\dfrac{\\omega}{\\omega_{p2}}'],
        links: [{ label: 'Lesson: multi-pole systems', to: 'learn/l11-multipole' }],
      },
      {
        title: 'β moves the loop-gain curve',
        explain: 'Loop gain = β × A: a smaller β (bigger closed-loop gain) shifts the whole magnitude curve **down**, so it crosses 0 dB earlier, where the phase is less negative. **β = 1 (buffer) is the hardest case.**',
      },
      {
        title: 'Gain and phase crossover, margins',
        explain: '$\\omega_{GX}$: where $|\\beta A| = 1$. $\\omega_{PX}$: where $\\angle\\beta A = -180^\\circ$. Stable when $\\omega_{GX} < \\omega_{PX}$.',
        tex: ['PM = 180^\\circ + \\angle\\beta A(j\\omega)\\big|_{\\omega=\\omega_{GX}}', 'GM = -20\\log|\\beta A(j\\omega_{PX})|'],
        links: [{ label: 'Lesson: phase and gain margin', to: 'learn/l12-margins' }],
      },
      {
        title: 'Single-pole system: always stable',
        explain: 'One pole gives at most −90°, so PM = 180° − 90° = 90°. Closed loop, the pole moves up to $\\omega_{p1}(1 + \\beta A_0)$ and the gain drops by the same factor.',
        tex: ['PM = 180^\\circ - 90^\\circ = 90^\\circ', 'A_f = \\dfrac{A_0}{(1+\\beta A_0)\\left(1+\\frac{s}{\\omega_{p1}(1+\\beta A_0)}\\right)}'],
      },
      {
        title: 'Two-pole system',
        explain: 'Phase heads to −180°; the closer the second pole is to the crossover, the smaller the PM. Unity-gain frequency $\\omega_u$ = GBW for the first pole.',
        links: [{ label: 'Stability lab', to: 'labs/stability' }],
      },
    ],
  },
  {
    id: 'lec16',
    lec: 16,
    date: '16 Sep',
    title: 'Phase margin and closed-loop peaking; step responses for PM 45°, 60°, 90°',
    handout: 'L12',
    img: 'lec16',
    summary: 'A two-pole amplifier with β = 1, what a small PM does to the closed-loop gain at ωGX (5° → 11.5/β, 45° → 1.3/β, 60° → 1/β), and the step responses.',
    items: [
      {
        title: 'Two-pole amplifier, β = 1',
        explain: '−20 dB/decade after $\\omega_{p1}$, −40 dB/decade after $\\omega_{p2}$; the phase heads to −180°.',
        tex: ['PM = 180^\\circ - |\\angle\\beta A(j\\omega_{GX})|'],
      },
      {
        title: 'Closed-loop gain at ωGX',
        explain: `At $\\omega_{GX}$, $|\\beta A| = 1$, so $|A| = 1/\\beta$ and the closed-loop gain is $\\frac{1}{\\beta}\\cdot\\frac{1}{|1 + e^{-j(180^\\circ - PM)}|}$. PM = 5° gives $${texNum(peakingFactor(5), 3)}/\\beta$ (your page: 11.5/β, via $|0.0038 - j0.087|$); 45° gives $${texNum(peakingFactor(45), 2)}/\\beta$; 60° gives exactly $1/\\beta$ (no peaking).`,
        steps: [
          { tex: 'A_f(j\\omega) = \\dfrac{|A(j\\omega)|e^{-j\\angle A}}{1 + |\\beta A(j\\omega)|e^{-j\\angle\\beta A}}' },
          { tex: '|A_f(j\\omega_{GX})| = \\dfrac{\\frac{1}{\\beta}}{|1 + e^{-j175^\\circ}|} = \\dfrac{1}{\\beta}\\cdot\\dfrac{1}{|1 + \\cos175^\\circ - j\\sin175^\\circ|}', note: 'PM = 5°' },
        ],
        tex: [`PM = 5^\\circ: ${texNum(peakingFactor(5), 3)}/\\beta,\\quad 45^\\circ: ${texNum(peakingFactor(45), 2)}/\\beta,\\quad 60^\\circ: ${texNum(peakingFactor(60), 2)}/\\beta`],
        asked: 'Razavi Problem 10.4 style: PM from a measured peak, or the peak from a PM.',
        links: [
          { label: 'Lesson: ringing and peaking', to: 'learn/l12-ringing' },
          { label: 'Your Lec 16 example solved', to: 'practice/bank-lec16' },
        ],
      },
      {
        title: 'Step responses',
        explain: 'Small PM → a peak in the frequency response and **ringing** in the step response. PM = 60°: a fast response with a tiny overshoot (the usual target). PM = 90°: no overshoot but slower.',
      },
      {
        title: 'Reading the loop gain off the plot',
        explain: '$20\\log|A| - 20\\log\\frac{1}{\\beta} = 20\\log|\\beta A|$: draw the horizontal line at $1/\\beta$ on the open-loop plot; where they meet is $\\omega_{GX}$.',
        tex: ['20\\log|A(j\\omega)| - 20\\log\\tfrac{1}{\\beta} = 20\\log|\\beta A(j\\omega)|'],
      },
    ],
  },
  {
    id: 'lec17',
    lec: 17,
    date: '18 Sep',
    title: 'Frequency compensation: dominant pole, Miller effect, pole splitting, the two-stage op amp',
    handout: 'L13–L14',
    img: 'lec17',
    summary: 'The 100 dB three-pole example, moving the dominant pole, Miller multiplication CC(1 + A2), P1′ ≈ 1/(R1A2CC), the two-stage op amp’s poles and its transfer function with the RHP zero.',
    items: [
      {
        title: 'Compensation idea on the Bode plot',
        explain: 'A 100 dB amplifier with three poles crosses the $1/\\beta$ line where the phase is past −180°. Move the dominant pole down (green dashed line) until the loop gain crosses 0 dB before the second pole.',
        tex: ['20\\log A - 20\\log\\tfrac{1}{\\beta} = 20\\log A\\beta'],
        links: [
          { label: 'Lesson: dominant-pole compensation', to: 'learn/l13-dominant' },
          { label: 'Problem Set 2 P3 (this example)', to: 'practice/bank-ps2-p3' },
        ],
      },
      {
        title: 'Miller effect',
        explain: 'A capacitor $C_C$ across a gain $-A_2$ looks like $C_C(1 + A_2)$ at the input and $C_C(1 + 1/A_2)$ at the output.',
        tex: ['C_{in} = C_C(1 + A_2),\\quad C_{out} = C_C\\left(1 + \\tfrac{1}{A_2}\\right)'],
        links: [{ label: 'Lesson: Miller compensation', to: 'learn/l13-miller' }],
      },
      {
        title: 'Poles before and after compensation',
        explain: 'Without $C_C$: one pole per node. With it, the input node’s capacitance is multiplied by $(1 + A_2)$, pushing $P_1$ way down.',
        tex: ['P_1 = \\dfrac{1}{R_1C_1},\\quad P_2 = \\dfrac{1}{R_2C_2}\\ \\text{(without)}', "P_1' = \\dfrac{1}{R_1\\left[C_1 + (1+A_2)C_C\\right]} \\approx \\dfrac{1}{R_1A_2C_C}"],
      },
      {
        title: 'The two-stage op amp (M1–M7) uncompensated',
        explain: 'Node P (first-stage output) and node Q (the output) each give a pole.',
        tex: ['P_1 = \\dfrac{1}{(r_{O2}\\parallel r_{O4})C_1},\\quad P_2 = \\dfrac{1}{(r_{O6}\\parallel r_{O7})C_2}'],
        links: [{ label: 'Lesson: compensating the two-stage', to: 'learn/l14-twostage' }],
      },
      {
        title: 'Transfer function with CC: the RHP zero and pole splitting',
        explain: 'Matching the denominator to $(1 + s/\\omega_{p1})(1 + s/\\omega_{p2})$ (with $\\omega_{p2} \\gg \\omega_{p1}$) gives the split poles. The numerator has a **right-half-plane zero** at $G_{m2}/C_C$ that adds phase lag.',
        tex: [
          '\\dfrac{V_{out}}{V_{in}}(s) = \\dfrac{G_{m1}G_{m2}R_1R_2\\left(1 - s\\frac{C_C}{G_{m2}}\\right)}{1 + s\\left[\\{C_1 + (1+G_{m2}R_2)C_C\\}R_1 + R_2(C_2+C_C)\\right] + s^2R_1R_2(C_1C_2 + C_2C_C + C_1C_C)}',
          'D = \\left(1+\\dfrac{s}{\\omega_{p1}}\\right)\\left(1+\\dfrac{s}{\\omega_{p2}}\\right) = 1 + \\left(\\dfrac{1}{\\omega_{p1}} + \\dfrac{1}{\\omega_{p2}}\\right)s + \\dfrac{s^2}{\\omega_{p1}\\omega_{p2}}',
        ],
        links: [{ label: 'Lesson: the RHP zero and Rz', to: 'learn/l14-rz' }],
      },
    ],
  },
  {
    id: 'settling',
    lec: 0,
    date: 'handout',
    title: 'Settling-time example (Razavi Ex 9.2, worked by Laplace)',
    handout: 'L1',
    img: 'settling',
    priority: true,
    summary: 'Gain-of-10 amplifier that must settle within 1% in 5 ns: τ = 1/(βωu), t = 4.605τ, so ωu > 9.21 Grad/s (fu > 1.47 GHz).',
    items: [
      {
        title: 'Closed loop of a one-pole op amp',
        explain: 'Put $A(s) = A_0/(1 + s/\\omega_0)$ into $A/(1+\\beta A)$ and rearrange into "DC gain over $(1 + s\\tau)$".',
        steps: [
          { tex: '\\dfrac{V_{out}}{V_{in}}(s) = \\dfrac{A_0/(1+s/\\omega_0)}{1 + \\beta\\frac{A_0}{1+s/\\omega_0}} = \\dfrac{A_0}{1 + \\frac{s}{\\omega_0} + \\beta A_0}' },
          { tex: '= \\dfrac{A_0/(1+\\beta A_0)}{1 + \\frac{s}{(1+\\beta A_0)\\omega_0}} = \\dfrac{A_{dc,closed}}{1 + s\\tau}' },
          { tex: '\\tau = \\dfrac{1}{(1+\\beta A_0)\\omega_0} \\approx \\dfrac{1}{\\beta A_0\\omega_0} = \\dfrac{1}{\\beta\\omega_u}' },
        ],
        tex: ['A_{dc,closed} = \\dfrac{A_0}{1+\\beta A_0} \\approx \\dfrac{1}{\\beta} = 1 + \\dfrac{R_1}{R_2} \\approx 10', '\\tau = \\dfrac{1}{\\beta\\omega_u}'],
        links: [{ label: 'Lesson: speed and settling', to: 'learn/l1-speed' }],
      },
      {
        title: 'Step response and the 1% settling time',
        explain: `Partial fractions give $V_{out}(t) = aA_{dc,closed}(1 - e^{-t/\\tau})$. Within 1% means $e^{-t/\\tau} = 0.01$, so $t = ${texNum(E92.nTau, 4)}\\,\\tau$.`,
        steps: [
          { tex: 'aA_{dc,closed}\\times 0.99 = aA_{dc,closed}\\left[1 - e^{-t/\\tau}\\right] \\Rightarrow e^{-t/\\tau} = 0.01' },
          { tex: `\\dfrac{t}{\\tau} = \\ln 100 = ${texNum(E92.nTau, 4)}` },
          { tex: `t = \\dfrac{${texNum(E92.nTau, 4)}}{0.1\\,\\omega_u} < 5\\,\\text{ns} \\Rightarrow \\omega_u > ${texNum(E92.omegaU, 3)}\\,\\text{rad/s}` },
          { tex: `f_u = \\dfrac{\\omega_u}{2\\pi} > ${texNum(E92.fu, 3)}\\,\\text{Hz}` },
        ],
        tex: ['t_s = \\tau\\ln\\dfrac{1}{\\varepsilon}'],
        asked: 'Razavi Ex 9.2 and Problem Set 1 P2.',
        links: [{ label: 'Razavi Ex 9.2 solved', to: 'practice/bank-ex92' }],
      },
    ],
  },
  {
    id: 'mirror',
    lec: 0,
    date: 'handout',
    title: 'Current-mirror handout (typed, 8 pages): cascode and low-voltage cascode mirrors',
    handout: 'U6 (mirrors)',
    img: '',
    summary: 'Headroom of the cascode mirror (2Vov + Vth), its design problem, the low-voltage cascode mirror, and four ways to generate its bias Vb.',
    items: [
      {
        title: 'Cascode current mirror: minimum output voltage',
        explain: 'R sits at $V_{GS3} + V_{GS4}$, Q at $V_{GS3} + V_{GS4} - V_{GS2}$, and the output P must stay one overdrive above Q.',
        tex: ['V_{P,min} = V_{GS3} + V_{GS4} - V_{GS2} + V_{ov2} = V_{GS} + V_{ov} = 2V_{ov} + V_{thn}'],
        links: [{ label: 'Lesson: current mirrors', to: 'learn/u6-mirror' }],
      },
      {
        title: 'Design problem: headroom 0.6 V, 40 µA, µnCox = 300 µA/V², Vthn = 0.38 V',
        explain: `$0.6 = 2V_{ov} + 0.38 \\Rightarrow V_{ov} = 0.11$ V; then the square law gives $W/L = ${texNum(MIRROR_WL, 4)}$ for every device.`,
        tex: ['V_{ov} = \\dfrac{V_{P,min} - V_{thn}}{2},\\quad \\dfrac{W}{L} = \\dfrac{2I_D}{\\mu_nC_{ox}V_{ov}^2}'],
      },
      {
        title: 'Low-voltage cascode mirror',
        explain: 'Bias the cascode gate separately at $V_b = V_{ov2} + V_{GS3}$ so the output only needs $2V_{ov}$. The catch: M1 is a diode ($V_{DS1} = V_{GS1}$) but M2 now has $V_{DS2} = V_{ov}$, so the copy is not exact. Fix with $R_1$: $V_{DS1} = V_{GS1} - IR_1$, needing $IR_1 = V_{th1}$, which does not track PVT.',
        tex: ['V_b = V_{GS3} + V_{GS2} - V_{th2}', 'IR_1 \\le V_{th1}\\ \\text{(M1 saturated)},\\quad IR_1 = V_{th1}\\ \\text{(exact copy)}'],
      },
      {
        title: 'Generating Vb: options 1 and 2',
        explain: 'Option 1: M5 plus $R_2$, $V_b = V_{GS5} + I_2R_2$ with $I_2R_2 = V_{GS1} - V_{th1}$ (IR products do not track $V_{GS}$). Option 2: M5, M6 and $R_2$, $V_b = V_{GS5} + V_{GS6} - I_2R_2$, so $V_{GS1} - IR_1 = V_{GS6} - I_2R_2$: both sides now track (small body-effect error).',
      },
      {
        title: 'Modified low-voltage mirror with M0 (and its Vb)',
        explain: 'Replace $R_1$ by a level-shifting device M0: $V_{DS1} = V_b - V_{GS0}$, equal to $V_{DS2}$ when $V_{GS0} = V_{GS3}$. M0 saturated needs $V_b \\le V_{GS1} + V_{th0}$; size M0 with an overdrive well below $V_{th1}$. Generate $V_b$ with M7 (saturated) on M6 (triode), which forces $(W/L)_6 = \\frac13 (W/L)_7$.',
        steps: [
          { tex: 'V_b = V_{GS7} + V_{DS6} = V_{GS6},\\quad V_{GS7} = V_{GS0},\\; V_{DS6} = V_{ov}' },
          { tex: '\\tfrac12\\mu_nC_{ox}(W/L)_7V_{ov}^2 = \\tfrac12\\mu_nC_{ox}(W/L)_6\\left[2(2V_{ov})V_{ov} - V_{ov}^2\\right]' },
          { tex: '(W/L)_6 = \\tfrac13(W/L)_7' },
        ],
      },
      {
        title: 'Lower-power version (one current source)',
        explain: 'Stack the bias devices on the input side so one current source does everything. Advantage: less power. Disadvantage: the input side needs more voltage — node C needs at least $3V_{ov} + 2V_{th}$.',
        tex: ['V_{C,min} = 3V_{ov} + 2V_{th}'],
      },
    ],
  },
];
