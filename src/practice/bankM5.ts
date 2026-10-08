/**
 * Fixed bank for the lectures after the mid-sem (L5–L9): Tutorial 4 Q1–Q2 (gain boosting), Tutorial 5 Q1
 * (triode CMFB), Tutorial 6 Q1–Q3 (slewing and settling), Quiz 2 A–C (CMFB, verified against the key).
 * Tutorials 4–6 have no answer key; each assumption is stated in the flags.
 */
import { quiz2, QUIZ2_A, QUIZ2_B, QUIZ2_C, tut4Q1, tut4Q2, tut4Q3, tut5Q1, tut5Q3, tut6Q1, tut6Q2, tut6Q3, type Quiz2Part } from '../physics';
import type { Problem } from './schema';
import { texNum, texSI } from './tex';

const NO_KEY = 'Tutorials 4–6 have no answer key. These numbers come from the engine with the assumptions listed; check them against your class solution.';

function t4q1(): Problem {
  const r = tut4Q1();
  const vov3 = Math.sqrt((2 * 100e-6) / (172.35e-6 * 200));
  const vov2 = Math.sqrt((2 * 0.5e-3) / (172.35e-6 * 200));
  return {
    id: 'bank-t4q1',
    source: 'Tutorial 4 Q1 (adapted Razavi 9.10)',
    tags: ['L6'],
    title: 'Tutorial 4 Q1: regulated cascode with an NMOS auxiliary',
    statement: 'I1 = 100 µA, I2 = 0.5 mA, (W/L)1–3 = 100/0.5, VDD = 3 V, µnCox = 172.35 µA/V², Vthn = 0.7 V, λn = 0.1 V⁻¹. M3 (gate at X = drain of M1, loaded by I1) drives M2’s gate. (a) Gate biases of M2 and M3. (b) Gain with ideal current sources. (c) With PMOS current sources ((W/L)p = 50/0.5, µpCox = 51.7 µA/V², |Vthp| = 0.8 V, λp = 0.2 V⁻¹): output swing and gain.',
    figure: { kind: 'gainBoost', props: { vx: r.vx, vg2: r.vg2, vout: 1.8, i1: 100e-6, i2: 0.5e-3 } },
    givens: [
      { sym: 'I_1', value: 100e-6, unit: 'A' },
      { sym: 'I_2', value: 0.5e-3, unit: 'A' },
      { sym: '(W/L)_{1-3}', value: 200, unit: '' },
      { sym: '\\mu_n C_{ox}', value: 172.35e-6, unit: 'A/V²' },
      { sym: 'V_{thn}', value: 0.7, unit: 'V' },
      { sym: '\\lambda_n', value: 0.1, unit: '' },
    ],
    unknowns: [
      { key: 'vx', sym: 'V_{G3} = V_X', label: '(a) Gate of M3 (= X)', unit: 'V' },
      { key: 'vg2', sym: 'V_{G2}', label: '(a) Gate of M2', unit: 'V' },
      { key: 'av', sym: '|A_v|', label: '(b) Gain, ideal sources', unit: 'V/V', tol: 0.03 },
      { key: 'vmin', sym: 'V_{out,min}', label: '(c) Lowest output', unit: 'V' },
      { key: 'vmax', sym: 'V_{out,max}', label: '(c) Highest output', unit: 'V' },
      { key: 'avP', sym: '|A_v|_{PMOS}', label: '(c) Gain with PMOS sources', unit: 'V/V', tol: 0.03 },
    ],
    answers: { vx: r.vx, vg2: r.vg2, av: r.av, vmin: r.voutMin, vmax: r.voutMax, avP: r.avP },
    wrong: { avP: [{ mistake: 'cascodeSimpleLoad', value: r.av }] },
    steps: [
      { tag: 'A', title: 'M3 carries I1 with its source at ground, so X sits one VGS3 up', tex: `V_X = 0.7 + \\sqrt{\\tfrac{2(100\\mu)}{172.35\\mu\\times 200}} = ${texSI(0.7 + vov3, 'V', 4)}`, produces: 'vx', value: 0.7 + vov3 },
      { tag: 'A', title: 'M2 carries I2 with its source at X', tex: `V_{G2} = V_X + 0.7 + \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{172.35\\mu\\times 200}} = ${texSI(0.7 + vov3 + 0.7 + vov2, 'V', 4)}`, produces: 'vg2', value: 0.7 + vov3 + 0.7 + vov2 },
      { tag: 'C', title: 'Auxiliary gain A1 = gm3·rO3; boosted Rout = rO1 + rO2 + (1 + A1)gm2 rO2 rO1', tex: `A_1 = ${texNum(r.a3)},\\; R_{out} = ${texSI(r.rout, 'Ω')}` },
      { tag: 'D', title: '(b) Av = gm1·Rout (ideal I2)', tex: `|A_v| = ${texNum(r.av)}`, produces: 'av', value: r.av },
      { tag: '✓', title: '(c) Floor: M2 fence, Vout ≥ VG2 − Vth', tex: `${texSI(r.vg2 - 0.7, 'V', 4)}`, produces: 'vmin', value: r.vg2 - 0.7 },
      { tag: '✓', title: 'Ceiling: the PMOS source needs its |Vov|', tex: `3 - \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{51.7\\mu\\times 100}} = ${texSI(3 - Math.sqrt(1e-3 / (51.7e-6 * 100)), 'V', 4)}`, produces: 'vmax', value: 3 - Math.sqrt(1e-3 / (51.7e-6 * 100)) },
      { tag: 'D', title: 'The load trap again: the PMOS rO (10 kΩ) is in parallel with hundreds of MΩ', tex: `|A_v| = g_{m1}(R_{boost}\\parallel r_{OP}) = ${texNum(r.avP)}`, produces: 'avP', value: r.avP },
    ],
    hints: ['Walk up from ground: X = VGS3, then VG2 = X + VGS2.', 'Gain boosting multiplies the cascode’s Rout by (1 + A1).', 'Rout = rO1 + rO2 + (1 + A1)gm2rO2rO1; with a PMOS load, Rout ≈ rO,p.', `A1 = gm3·rO3 = ${r.a3.toFixed(0)}.`],
    flags: [NO_KEY, 'Rout uses the lecture-notes form rO1 + rO2 + (1 + A1)gm2rO2rO1 (Lec 07).'],
  };
}

function t4q2(): Problem {
  const r = tut4Q2();
  return {
    id: 'bank-t4q2',
    source: 'Tutorial 4 Q2',
    tags: ['L6'],
    title: 'Tutorial 4 Q2: gain boosting with a PMOS auxiliary',
    figure: { kind: 'gainBoostPmos' },
    statement: 'VDD = 1.8 V, µnCox = 150 µA/V², µpCox = 100 µA/V², (W/L)n = 150, (W/L)p = 100, Vthn = 0.7 V, |Vthp| = 0.85 V, ID1 = 0.1 mA. (a) Vbp. (b) With VP = Vov1 and Vout,min = 2Vov1, is M3 saturated? (c) With Vov4 = 0.1 V, the required VS. (d) With the auxiliary removed and M5 ideal (0.1 mA), λn for a gain of about 2550. (e) With λp = 1.3λn, the gain of the full circuit.',
    givens: [
      { sym: 'V_{DD}', value: 1.8, unit: 'V' },
      { sym: 'I_{D1}', value: 0.1e-3, unit: 'A' },
      { sym: '(W/L)_n', value: 150, unit: '' },
      { sym: '(W/L)_p', value: 100, unit: '' },
    ],
    unknowns: [
      { key: 'vbp', sym: 'V_{bp}', label: '(a) Vbp', unit: 'V' },
      { key: 'm3', sym: 'M_3', label: '(b) M3 region', unit: '', choices: ['Saturated', 'Triode'] },
      { key: 'vs', sym: 'V_S', label: '(c) VS', unit: 'V' },
      { key: 'lam', sym: '\\lambda_n', label: '(d) λn (gain ≈ (gm·rO)²)', unit: '', tol: 0.025 },
    ],
    answers: { vbp: r.vbp, m3: r.m3Saturated ? 0 : 1, vs: r.vs, lam: r.lambdaApprox },
    wrong: { vbp: [{ mistake: 'vovNotVgs', value: 1.8 - Math.sqrt((2 * 0.1e-3) / (100e-6 * 100)) }] },
    steps: [
      { tag: 'A', title: '(a) M5 carries 0.1 mA: Vbp = VDD − |VGS5|', tex: `V_{bp} = 1.8 - \\left(0.85 + \\sqrt{\\tfrac{2(0.1\\mathrm{m})}{100\\mu\\times 100}}\\right) = ${texSI(1.8 - (0.85 + Math.sqrt(0.02)), 'V', 4)}`, produces: 'vbp', value: 1.8 - (0.85 + Math.sqrt(0.02)) },
      { tag: '✓', title: '(b) M3’s drain is M2’s gate: VP + VGS2. PMOS fence: VD3 ≤ VG3 + |Vthp| = VP + 0.85', tex: `V_{D3} = ${texSI(r.vg2, 'V', 4)} \\le ${texSI(r.vp + 0.85, 'V', 4)}\\;\\checkmark\\;(\\text{i.e. } V_{GS2} \\le |V_{th3}|)`, produces: 'm3', value: r.vg2 <= r.vp + 0.85 ? 0 : 1 },
      { tag: 'A', title: '(c) M4 at Vov = 0.1 V sets the current; M3 carries it', tex: `I = \\tfrac12(150\\mu)(150)(0.1)^2 = ${texSI(r.i4, 'A')},\\; V_S = V_P + |V_{GS3}| = ${texSI(r.vs, 'V', 4)}`, produces: 'vs', value: r.vp + 0.85 + Math.sqrt((2 * r.i4) / (100e-6 * 100)) },
      { tag: 'D', title: '(d) Plain cascode, ideal load: |Av| ≈ (gm·rO)² = 2550', tex: `g_m r_O = \\sqrt{2550} = 50.5,\\; \\lambda_n = \\frac{g_m}{50.5\\,I_D} = ${texNum(r.lambdaApprox, 3)}\\,\\mathrm{V^{-1}}\\;(\\text{exact form: } ${texNum(r.lambdaExact, 3)})`, produces: 'lam', value: r.gm / (Math.sqrt(2550) * 0.1e-3) },
      { tag: 'D', title: '(e) Boosted Rout is huge, but M5’s rO (λp = 1.3λn) loads the output: the load trap', tex: `|A_v| = g_m(R_{boost}\\parallel r_{O5}) \\approx ${texNum(r.av)}\\;(${texNum(r.avIdealLoad)}\\text{ with an ideal load})` },
    ],
    hints: ['Walk the node voltages first, then the fences.', 'M3 is a PMOS: saturated while VD ≤ VG + |Vth|.', 'Plain cascode gain ≈ (gm·rO)².', `gm = ${(r.gm * 1e3).toPrecision(3)} mA/V.`],
    flags: [NO_KEY, '(d) accepts both 0.420 (from (gm·rO)²) and 0.428 (from 2gm·rO + (gm·rO)²).'],
  };
}

function t5q1(): Problem {
  const r = tut5Q1();
  return {
    id: 'bank-t5q1',
    source: 'Tutorial 5 Q1 (Razavi 9.11 extended)',
    tags: ['L7'],
    title: 'Tutorial 5 Q1: size the triode CMFB devices',
    statement: 'Each branch carries 0.5 mA. M7, M8 (gates on Vout1, Vout2) form the tail in deep triode. VDD = 3 V, µnCox = 135 µA/V², µpCox = 40 µA/V², Vthn = 0.7 V, |Vthp| = 0.8 V. (a) Size M7, M8 for an output CM of 1.5 V with VP = 100 mV. (b) If all transistors have that size, Vb1. (c) The maximum differential swing.',
    figure: { kind: 'cmfbTriode', props: { vout1: 1.5, vout2: 1.5, vp: 0.1, wl: r.wl } },
    givens: [
      { sym: 'I_D', value: 0.5e-3, unit: 'A' },
      { sym: 'V_{out,CM}', value: 1.5, unit: 'V' },
      { sym: 'V_P', value: 0.1, unit: 'V' },
    ],
    unknowns: [
      { key: 'wl', sym: '(W/L)_{7,8}', label: '(a) Size of M7, M8', unit: '', tol: 0.07 },
      { key: 'vb1', sym: 'V_{b1}', label: '(b) Vb1 (all devices this size)', unit: 'V' },
      { key: 'swing', sym: 'V_{pp,diff}', label: '(c) Differential swing', unit: 'V' },
    ],
    answers: { wl: r.wlExact, vb1: r.vb1, swing: r.diffSwing },
    wrong: {},
    steps: [
      { tag: 'A', title: 'M7, M8 are in triode (VDS = VP = 0.1 V is small) with VGS = Vout,CM = 1.5 V; each carries 0.5 mA. Use the full triode equation, as the key does', tex: `0.5\\,\\mathrm{mA} = \\tfrac12 (135\\mu)\\tfrac{W}{L}\\left[2(1.5-0.7)(0.1) - 0.1^2\\right] \\Rightarrow \\left(\\tfrac{W}{L}\\right)_{7,8} = ${texNum(r.wlExact, 4)}`, produces: 'wl', value: r.wlExact },
      { tag: 'A', title: '(b) Every device this size: M5 (NMOS, 0.5 mA) needs Vov5; Vb1 sits one VGS5 above P', tex: `V_{ov5} = ${texSI(r.vovN, 'V', 3)},\\quad V_{b1} = V_P + V_{GS5} = 0.1 + 0.7 + ${texNum(r.vovN, 3)} = ${texSI(r.vb1, 'V', 4)}`, produces: 'vb1', value: r.vb1 },
      { tag: '✓', title: '(c) Lowest output: VP + Vov5 + Vov3 (two NMOS overdrives on P). Highest: VDD − |Vov9| − |Vov11| (two PMOS). Differential doubles it', tex: `V_{out} \\in [${texNum(r.voutMin, 3)},\\,${texNum(r.voutMax, 3)}]\\,\\mathrm{V},\\quad 2(${texNum(r.voutMax, 3)} - ${texNum(r.voutMin, 3)}) = ${texSI(r.diffSwing, 'V')}`, produces: 'swing', value: r.diffSwing },
    ],
    hints: ['M7 and M8 have a tiny VDS (= VP): triode.', 'Their gates are the outputs, so VGS = Vout,CM = 1.5 V.', 'ID = ½µnCox(W/L)[2(VGS − Vth)VDS − VDS²] with VDS = VP = 0.1 V.', 'Vb1 is the gate of the NMOS cascode M5 standing on P: Vb1 = VP + VGS5.'],
    flags: ['This exact question is the 2025-26 mid-sem Q4. Its key uses the full triode equation (49.38); the deep-triode shortcut (Lec 11) gives 46.3, also marked right. Key: Vb1 = 1.187 V, swing 1.412 V.'],
  };
}

function t4q3(): Problem {
  const r = tut4Q3();
  return {
    id: 'bank-t4q3',
    source: 'Tutorial 4 Q3',
    tags: ['L6'],
    title: 'Tutorial 4 Q3: gain boosting with a folded-cascode auxiliary',
    statement: 'VDD = 3 V, 3 mW in total, µnCox = 200 µA/V², µpCox = 100 µA/V², λn = 0.1 V⁻¹, λp = 0.2 V⁻¹, Vthn = 0.7 V, |Vthp| = 0.8 V. M1 = M2 = 100/0.5 carrying 500 µA. (W/L)5 = (W/L)8 = 0.4(W/L)6, (W/L)3 = 0.5(W/L)6, (W/L)4 = (W/L)9 = (W/L)1. (a) For a 2.5 V output swing, (W/L)6. (b) With VP = Vov1, R3. (c) With VDS9 = 1.15·Vov9, is M4 saturated? (d) (W/L)7, R1, R2. (e) The overall gain.',
    figure: { kind: 'gainBoostFolded' },
    givens: [
      { sym: 'V_{DD}', value: 3, unit: 'V' },
      { sym: 'P', value: 3e-3, unit: 'W' },
      { sym: 'I_{D1}', value: 500e-6, unit: 'A' },
      { sym: '(W/L)_{1}', value: 200, unit: '' },
    ],
    unknowns: [
      { key: 'wl6', sym: '(W/L)_6', label: '(a) Size of M6', unit: '' },
      { key: 'r3', sym: 'R_3', label: '(b) R3', unit: 'Ω' },
      { key: 'm4', sym: 'M_4', label: '(c) M4 region', unit: '', choices: ['Saturated', 'Triode'] },
      { key: 'wl7', sym: '(W/L)_7', label: '(d) Size of M7', unit: '' },
      { key: 'r1', sym: 'R_1', label: '(d) R1', unit: 'Ω' },
      { key: 'r2', sym: 'R_2', label: '(d) R2', unit: 'Ω' },
      { key: 'av', sym: '|A_v|', label: '(e) Overall gain', unit: 'V/V', tol: 0.03 },
    ],
    answers: { wl6: r.wl6, r3: r.r3, m4: r.m4Saturated ? 0 : 1, wl7: r.wl7, r1: r.r1, r2: r.r2, av: r.av },
    wrong: { av: [{ mistake: 'cascodeSimpleLoad', value: r.avIdealLoad }], wl6: [{ mistake: 'forgotHalf', value: r.wl6 / 2 }] },
    steps: [
      { tag: 'A', title: 'Power budget: 3 mW / 3 V = 1 mA. M6 500 µA; M8 and M5 are 0.4× M6 at the same |VGS|: 200 µA each; M3 gets what is left, M9 sinks I4 + I3', tex: `I_3 = 1 - 0.5 - 0.2 - 0.2 = ${texSI(r.i3, 'A')},\\; I_9 = ${texSI(r.i9, 'A')}` },
      { tag: 'A', title: '(a) Vout runs from 2Vov1 (M1, M2 identical) up to VDD − |Vov6|', tex: `|V_{ov6}| = 3 - 2.5 - 2(${texNum(r.vov1, 4)}) = ${texSI(r.vov6, 'V', 4)} \\Rightarrow (W/L)_6 = \\frac{2(500\\mu)}{100\\mu\\,(${texNum(r.vov6, 4)})^2} = ${texNum((2 * 500e-6) / (100e-6 * r.vov6 * r.vov6), 4)}`, produces: 'wl6', value: (2 * 500e-6) / (100e-6 * r.vov6 * r.vov6) },
      { tag: 'A', title: '(b) M3 (W/L = ½(W/L)6, 100 µA) has its gate at VP = Vov1; its source sits |VGS3| higher; R3 drops the rest', tex: `V_{S3} = ${texNum(r.vp, 4)} + 0.8 + ${texNum(r.vov3, 4)} = ${texSI(r.vs3, 'V', 4)},\\; R_3 = \\frac{3 - V_{S3}}{100\\mu} = ${texSI((3 - r.vs3) / r.i3, 'Ω')}`, produces: 'r3', value: (3 - r.vs3) / r.i3 },
      { tag: '✓', title: '(c) Node F = 1.15·Vov9; VG4 = F + VGS4; M4’s drain is M2’s gate = VP + VGS2. Fence: VD4 ≥ VG4 − Vth', tex: `V_{D4} = ${texSI(r.vd4, 'V', 4)} \\ge ${texSI(r.vg4 - 0.7, 'V', 4)}\\;\\checkmark`, produces: 'm4', value: r.vd4 >= r.vg4 - 0.7 ? 0 : 1 },
      { tag: 'A', title: '(d) M7 mirrors M9 (same VGS): widths scale with current', tex: `(W/L)_7 = 200\\times\\frac{200\\mu}{300\\mu} = ${texNum((200 * 200e-6) / 300e-6, 4)}`, produces: 'wl7', value: (200 * 200e-6) / 300e-6 },
      { tag: 'A', title: 'Walk the bias string: R2 from VGS7 up to VG4, R1 from VG4 up to M8’s drain (VDD − |VGS8|)', tex: `R_2 = \\frac{${texNum(r.vg4, 4)} - ${texNum(r.vgs7, 4)}}{200\\mu} = ${texSI((r.vg4 - r.vgs7) / 200e-6, 'Ω')},\\; R_1 = \\frac{${texNum(r.vd8, 4)} - ${texNum(r.vg4, 4)}}{200\\mu} = ${texSI((r.vd8 - r.vg4) / 200e-6, 'Ω')}`, produces: 'r2', value: (r.vg4 - r.vgs7) / 200e-6 },
      { tag: 'A', title: 'R1: from VG4 up to M8’s drain', tex: `R_1 = \\frac{${texNum(r.vd8, 4)} - ${texNum(r.vg4, 4)}}{200\\mu} = ${texSI((r.vd8 - r.vg4) / 200e-6, 'Ω')}`, produces: 'r1', value: (r.vd8 - r.vg4) / 200e-6 },
      { tag: 'C', title: '(e) Auxiliary gain: M3 is degenerated by R3 (Gm3 = gm3/(1 + gm3R3)) into rO5 ‖ (M4 cascoded over rO9)', tex: `A_{aux} = ${texNum(r.gm3eff * 1e6, 3)}\\,\\mu S \\times ${texSI(r.rAux, 'Ω')} = ${texNum(r.aAux, 3)}` },
      { tag: 'D', title: 'Boosted Rdown is MΩ, but M6 is a simple source (rO6 = 10 kΩ): smallest in parallel wins', tex: `|A_v| = g_{m1}(R_{boost}\\parallel r_{O6}) = ${texNum(r.gm1 * 1e3, 4)}\\,\\mathrm{mS}\\times(${texSI(r.rBoost, 'Ω')}\\parallel 10\\,\\mathrm{k\\Omega}) = ${texNum(r.gm1 * ((r.rBoost * r.ro6) / (r.rBoost + r.ro6)), 4)}`, produces: 'av', value: r.gm1 * ((r.rBoost * r.ro6) / (r.rBoost + r.ro6)) },
    ],
    hints: ['Start from the power: 1 mA shared between the branches; equal |VGS| means currents scale with W/L.', 'Swing: Vout from 2Vov1 to VDD − |Vov6|.', 'R3 = (VDD − VP − |VGS3|)/I3; walk the bias string node by node.', `Vov1 = ${r.vov1.toFixed(4)} V.`],
    flags: [
      NO_KEY,
      'Read from the figure: M3 is a PMOS whose drain folds into M4’s source (node F, the drain of M9); M8 and M7 are diodes; M5, M6 share M8’s gate; M9 shares M7’s gate.',
      'Currents follow from 3 mW and equal |VGS|: M8, M5 = 200 µA, M3 = 100 µA, M9 = 300 µA. λ is used only for rO.',
      '(e) The simple PMOS load M6 limits the gain to about gm1·rO6 ≈ 63: the load trap. With an ideal load the boosted gain would be about 3.6 × 10⁴.',
    ],
  };
}

function t5q2(): Problem {
  return {
    id: 'bank-t5q2',
    source: 'Tutorial 5 Q2 (Razavi Problem 9.12)',
    tags: ['L8', 'L7'],
    title: 'Tutorial 5 Q2: which pair for the CMFB amplifier, and the loop gain',
    statement: 'In the folded cascode with resistive sensing (R1, R2), an error amplifier compares Vout,CM with VREF and drives M3, M4 through VE. The error amplifier is a differential pair with an active current-mirror load. (a) NMOS or PMOS input pair? (b) Which expression is the CMFB loop gain?',
    figure: { kind: 'foldedCmfb' },
    givens: [],
    unknowns: [
      { key: 'pair', sym: '\\text{pair}', label: '(a) Input pair of the error amplifier', unit: '', choices: ['PMOS: its mirror output sits near VGS,n, the level M3, M4 need', 'NMOS: its mirror output sits near VDD − |VGS,p|'] },
      { key: 'loop', sym: 'T_{CM}', label: '(b) Loop gain', unit: '', choices: ['A_EA · gm3 · (Rup ‖ Rdown)', 'A_EA · gm3 · (R1 + R2)', 'A_EA · (Rup ‖ Rdown)', 'gm3 · (Rup ‖ Rdown)'] },
    ],
    answers: { pair: 0, loop: 0 },
    wrong: {},
    steps: [
      { tag: 'A', title: '(a) VE must sit at about VGS3 (≈ Vthn + Vov), low. A PMOS pair with an NMOS mirror puts its output one VGS,n above ground: the right level. An NMOS pair’s output sits near VDD − |VGS,p|, far too high', tex: '\\text{PMOS input pair}', produces: 'pair', value: 0 },
      { tag: 'B', title: '(b) Go round the loop: Vout,CM → (sense: gain 1) → error amp A_EA = gm,EA(rO,N ‖ rO,P) → VE → M3, M4 (gm3 each) → a CM current into each output', tex: '\\Delta I = g_{m3}\\,A_{EA}\\,\\Delta V_{out,CM}' },
      { tag: 'C', title: 'In CM no current flows through R1, R2 (both ends move together), so each output sees Rup ‖ Rdown', tex: 'T_{CM} = A_{EA}\\,g_{m3}\\,(R_{up}\\parallel R_{down})', produces: 'loop', value: 0 },
    ],
    hints: ['What DC level must VE have to bias M3, M4?', 'Where does the output of a 5-T OTA sit, for each pair type?', 'Break the loop at VE and go round: sense, amplify, convert to current, back to voltage.', 'In common mode, R1 and R2 carry no current.'],
    flags: ['Razavi 9.12 gives no device sizes, so (b) is asked as an expression. The loop is negative: Vout,CM up → VE up → more current in M3, M4 → outputs pulled down.'],
  };
}

function t5q3(): Problem {
  const r = tut5Q3();
  return {
    id: 'bank-t5q3',
    source: 'Tutorial 5 Q3',
    tags: ['L8', 'L7'],
    title: 'Tutorial 5 Q3: CM gain and CMRR with and without CMFB',
    statement: 'I1 = 50 µA, I2 = 200 µA, W/L = 50 µm/1 µm for every device, R = 10 MΩ. VDD = 1.8 V, µnCox = 100 µA/V², µpCox = 50 µA/V², λp = 0.2 V⁻¹, λn = 0.1 V⁻¹, Vthn = 0.4 V, |Vthp| = 0.5 V. Without CMFB: Ad, ACM, the optimum VO,CM and CMRR. With CMFB: the CM gain needed for ±1% on VO,CM, the CM loop gain, the CM gain achieved and the CMRR.',
    figure: { kind: 'cmfbTut5Q3' },
    givens: [
      { sym: 'I_1', value: 50e-6, unit: 'A' },
      { sym: 'I_2', value: 200e-6, unit: 'A' },
      { sym: 'W/L', value: 50, unit: '' },
      { sym: 'R', value: 10e6, unit: 'Ω' },
    ],
    unknowns: [
      { key: 'ad', sym: 'A_d', label: 'Differential gain', unit: 'V/V' },
      { key: 'acm', sym: '|A_{CM}|', label: 'CM gain, no CMFB', unit: 'V/V' },
      { key: 'vocm', sym: 'V_{O,CM}', label: 'Optimum VO,CM (middle of the swing)', unit: 'V' },
      { key: 'cmrr', sym: 'CMRR', label: 'CMRR, no CMFB', unit: '' },
      { key: 'target', sym: '|A_{CM}|_{req}', label: 'CM gain allowed by ±1%', unit: 'V/V' },
      { key: 'loop', sym: 'T_{CM}', label: 'CM loop gain', unit: '', tol: 0.03 },
      { key: 'acmfb', sym: '|A_{CM}|_{fb}', label: 'CM gain with CMFB', unit: 'V/V', tol: 0.03 },
      { key: 'cmrrfb', sym: 'CMRR_{fb}', label: 'CMRR with CMFB', unit: '', tol: 0.03 },
    ],
    answers: { ad: r.ad, acm: r.acm, vocm: r.vocm, cmrr: r.cmrr, target: r.acmTarget, loop: r.loop, acmfb: r.acmFb, cmrrfb: r.cmrrFb },
    wrong: { acm: [{ mistake: 'rssNot2rss', value: r.ro3 / (1 / r.gm1 + r.ro5) }] },
    steps: [
      { tag: 'A', title: 'Currents: M3, M4 copy I1 (50 µA each), so M5 carries 100 µA; M11 copies I2, 100 µA in each of M7, M8', tex: `g_{m1} = ${texSI(r.gm1, 'S')},\\; r_{O1} = ${texSI(r.ro1, 'Ω')},\\; r_{O3} = ${texSI(r.ro3, 'Ω')},\\; r_{O5} = ${texSI(r.ro5, 'Ω')}` },
      { tag: 'D', title: 'Differential: the R midpoint is AC ground, so each output sees rO1 ‖ rO3 ‖ R', tex: `A_d = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R) = ${texNum(r.ad, 4)}`, produces: 'ad', value: r.ad },
      { tag: 'D', title: 'Common mode: no current in the R’s; CM half circuit with 2rO5 in the source', tex: `|A_{CM}| = \\frac{r_{O3}}{1/g_{m1} + 2r_{O5}} = ${texNum(r.acm, 4)}`, produces: 'acm', value: r.acm },
      { tag: 'A', title: 'Output range: Vov5 + Vov1 up to VDD − |Vov3|; the optimum CM is its middle', tex: `V_{O,CM} = \\frac{${texNum(r.voutMin, 4)} + ${texNum(r.voutMax, 4)}}{2} = ${texSI(r.vocm, 'V', 4)}`, produces: 'vocm', value: r.vocm },
      { tag: '·', title: 'CMRR = Ad/|ACM|', tex: `${texNum(r.cmrr, 4)}\\;(${texNum(20 * Math.log10(r.cmrr), 3)}\\,\\mathrm{dB})`, produces: 'cmrr', value: r.cmrr },
      { tag: '·', title: '±1%: the output CM may move 2·1%·VO,CM while the input CM sweeps its whole range (Vov5 + VGS1 up to VO,CM + Vth1)', tex: `|A_{CM}|_{req} = \\frac{2(0.01)(${texNum(r.vocm, 3)})}{${texNum(r.vinCmMax, 3)} - ${texNum(r.vinCmMin, 3)}} = ${texNum(r.acmTarget, 3)}`, produces: 'target', value: r.acmTarget },
      { tag: 'C', title: 'Loop: ΔVO,CM → M8 (gm7/2 of pair current) → diode M9 (1/gm9 ‖ rO9 ‖ rO7) → M5 (gm5) → half per side into rO3 ‖ Rdown,CM', tex: `T = \\frac{g_{m7}}{2}\\,(${texSI(r.zDiode, 'Ω')})\\,g_{m5}\\,\\frac{1}{2}(r_{O3}\\parallel R_{dn}) = ${texNum(r.loop, 4)}`, produces: 'loop', value: r.loop },
      { tag: 'D', title: 'Feedback divides the CM gain by (1 + T); Ad is unchanged', tex: `|A_{CM}|_{fb} = \\frac{${texNum(r.acm, 4)}}{1 + ${texNum(r.loop, 4)}} = ${texNum(r.acmFb, 4)}`, produces: 'acmfb', value: r.acmFb },
      { tag: '✓', title: 'CMRR with CMFB (the circuit does not reach the 0.010 target)', tex: `\\frac{${texNum(r.ad, 4)}}{${texNum(r.acmFb, 4)}} = ${texNum(r.cmrrFb, 4)}\\;(${texNum(20 * Math.log10(r.cmrrFb), 3)}\\,\\mathrm{dB})`, produces: 'cmrrfb', value: r.cmrrFb },
    ],
    hints: ['Find every current from the mirrors first.', 'In DM the R midpoint is AC ground; in CM no current flows in the R’s.', 'CM half circuit: the tail counts as 2rO5.', `gm1 = ${(r.gm1 * 1e3).toFixed(4)} mS, rO3 = 100 kΩ.`],
    flags: [
      NO_KEY,
      'This exact question is the 2024-25 mid-sem Q1, and its key fixes the readings used here: VO,CM = middle of [Vov5 + Vov1, VDD − |Vov3|] = 0.97 V; ACM,req = 2·1%·VO,CM/(Vin,CM range) = 0.031; ACM ≈ rO3/(2rO5) = 0.5.',
      'The key’s loop gain (55.7, so ACM,f = 0.0088 and CMRR 5373) uses gm10 = 0.316 mS, but √(2·100µ·50·100µ) = 1 mS. With 1 mS the loop gain is ≈ 17, as below. If your instructor insists on 55.7, that slip is the reason.',
    ],
  };
}

function t6q1(): Problem {
  const r = tut6Q1();
  const acl = 1e4 / (1 + 1e4 * 0.2);
  const tau = (8e-12 * 50e3) / (1 + 1e4 * 0.2);
  return {
    id: 'bank-t6q1',
    source: 'Tutorial 6 Q1',
    tags: ['L9', 'L1'],
    title: 'Tutorial 6 Q1: linear settling versus slewing',
    statement: 'Non-inverting amplifier: R1 = 4 MΩ, R2 = 1 MΩ, CL = 8 pF, A = 80 dB, Rout = 50 kΩ, Imax = 160 µA. (a) Closed-loop gain, time constant, and Vout 1 ns after a 50 mV step. (b) The initial slope for that step. (c) The slew rate and the step size above which slewing starts. (d) For a 1 V step, how long the output slews.',
    figure: { kind: 'nonInverting', props: { r1: 4e6, r2: 1e6, a: 1e4, cl: 8e-12 } },
    givens: [
      { sym: 'A', value: 1e4, unit: '' },
      { sym: 'R_{out}', value: 50e3, unit: 'Ω' },
      { sym: 'C_L', value: 8e-12, unit: 'F' },
      { sym: 'I_{max}', value: 160e-6, unit: 'A' },
    ],
    unknowns: [
      { key: 'acl', sym: 'A_{CL}', label: '(a) Closed-loop gain', unit: '' },
      { key: 'tau', sym: '\\tau', label: '(a) Time constant', unit: 's' },
      { key: 'v1', sym: 'V_{out}(1\\,\\mathrm{ns})', label: '(a) Output at 1 ns', unit: 'V' },
      { key: 'slope', sym: 'dV/dt|_{0}', label: '(b) Initial slope', unit: 'V/s' },
      { key: 'sr', sym: 'SR', label: '(c) Slew rate', unit: 'V/s' },
      { key: 'v0c', sym: 'V_{0,crit}', label: '(c) Critical step', unit: 'V' },
      { key: 'ts', sym: 't_{slew}', label: '(d) Slewing time for 1 V', unit: 's' },
    ],
    answers: { acl: r.acl, tau: r.tau, v1: r.vAt1ns, slope: r.slope0, sr: r.sr, v0c: r.v0crit, ts: r.tslew },
    wrong: { acl: [{ mistake: 'aInsteadOfInvBeta', value: 1e4 }], tau: [{ mistake: 'betaVsBetaA', value: 8e-12 * 50e3 }] },
    steps: [
      { tag: '·', title: 'β = R2/(R1 + R2) = 0.2; ACL = A/(1 + βA)', tex: `A_{CL} = \\frac{10^4}{1 + 2000} = ${texNum(acl, 5)}`, produces: 'acl', value: acl },
      { tag: '·', title: 'Feedback divides the output time constant RoutCL by (1 + βA)', tex: `\\tau = \\frac{(8\\,\\mathrm{pF})(50\\,\\mathrm{k\\Omega})}{2001} = ${texSI(tau, 's')}`, produces: 'tau', value: tau },
      { tag: '·', title: 'Linear step response', tex: `V_{out} = 0.05\\times ${texNum(acl, 4)}\\,(1 - e^{-1\\,\\mathrm{ns}/\\tau}) = ${texSI(0.05 * acl * (1 - Math.exp(-1e-9 / tau)), 'V', 4)}`, produces: 'v1', value: 0.05 * acl * (1 - Math.exp(-1e-9 / tau)) },
      { tag: '·', title: '(b) Initial slope = final value / τ', tex: `\\frac{0.05\\times ${texNum(acl, 4)}}{\\tau} = ${texSI((0.05 * acl) / tau, 'V/s')}`, produces: 'slope', value: (0.05 * acl) / tau },
      { tag: '·', title: '(c) The op amp can deliver at most Imax into CL', tex: `SR = \\frac{160\\,\\mu\\mathrm{A}}{8\\,\\mathrm{pF}} = ${texSI(160e-6 / 8e-12, 'V/s')}`, produces: 'sr', value: 160e-6 / 8e-12 },
      { tag: '·', title: 'Slewing starts when V0·ACL/τ exceeds SR', tex: `V_{0,crit} = \\frac{SR\\,\\tau}{A_{CL}} = ${texSI((20e6 * tau) / acl, 'V')}`, produces: 'v0c', value: (20e6 * tau) / acl },
      { tag: '·', title: '(d) Ramp at SR until the remaining error is SR·τ, then settle linearly', tex: `t_{slew} = \\frac{V_0 A_{CL} - SR\\,\\tau}{SR} = ${texSI((acl - 20e6 * tau) / 20e6, 's')}`, produces: 'ts', value: (acl - 20e6 * tau) / 20e6 },
    ],
    hints: ['β = R2/(R1 + R2).', 'τ = RoutCL/(1 + βA) (the formula printed on the sheet).', 'Initial slope = V0·ACL/τ; slewing when that exceeds Imax/CL.', 'β = 0.2.'],
    flags: [NO_KEY],
  };
}

function t6q2(): Problem {
  const r = tut6Q2();
  return {
    id: 'bank-t6q2',
    source: 'Tutorial 6 Q2',
    tags: ['L9', 'U11'],
    title: 'Tutorial 6 Q2: a 5-T OTA slews, then settles',
    statement: 'A five-transistor OTA in a non-inverting loop: ISS = 200 µA, CL = 5 pF, R1 = 3 MΩ, R2 = 1 MΩ, µnCox(W/L)1,2 = 4 mA/V², |VA| = 20 V. (a) SR+ and SR−. (b) The differential input that turns M2 fully off. (c) For a 1.2 V input step, how long it slews. (d) Rout, the closed-loop τ, and the total time to settle within 1%.',
    figure: { kind: 'nonInverting', props: { r1: 3e6, r2: 1e6, cl: 5e-12 } },
    givens: [
      { sym: 'I_{SS}', value: 200e-6, unit: 'A' },
      { sym: 'C_L', value: 5e-12, unit: 'F' },
      { sym: '\\mu_n C_{ox} W/L', value: 4e-3, unit: 'A/V²' },
      { sym: 'V_A', value: 20, unit: 'V' },
    ],
    unknowns: [
      { key: 'sr', sym: 'SR_{\\pm}', label: '(a) Slew rate (both)', unit: 'V/s' },
      { key: 'dv', sym: '\\Delta V_{in,min}', label: '(b) Input that turns M2 off', unit: 'V' },
      { key: 'ts', sym: 't_{slew}', label: '(c) Slewing time', unit: 's', tol: 0.03 },
      { key: 'rout', sym: 'R_{out}', label: '(d) Output resistance', unit: 'Ω' },
      { key: 'tau', sym: '\\tau_{cl}', label: '(d) Closed-loop τ', unit: 's' },
      { key: 'total', sym: 't_{total}', label: '(d) Total settling time (1%)', unit: 's', tol: 0.03 },
    ],
    answers: { sr: r.sr, dv: r.dvinMin, ts: r.tslew, rout: r.rout, tau: r.tau, total: r.total },
    wrong: { dv: [{ mistake: 'forgotSatCheck', value: r.dvinMin / Math.SQRT2 }], sr: [{ mistake: 'issNotHalf', value: r.sr / 2 }] },
    steps: [
      { tag: '·', title: '(a) Either way the whole tail current charges or discharges CL (through the mirror)', tex: `SR = \\frac{200\\,\\mu}{5\\,\\mathrm{p}} = ${texSI(200e-6 / 5e-12, 'V/s')}`, produces: 'sr', value: 200e-6 / 5e-12 },
      { tag: '·', title: '(b) Full steering at √2·Vov (Vov at balance)', tex: `\\sqrt{2}\\sqrt{\\tfrac{2(100\\mu)}{4\\,\\mathrm{m}}} = ${texSI(Math.SQRT2 * Math.sqrt(200e-6 / 4e-3), 'V')}`, produces: 'dv', value: Math.SQRT2 * Math.sqrt(200e-6 / 4e-3) },
      { tag: '·', title: '(c) Slewing ends when X = βVout = V0 − ΔVin,min', tex: `V_{out} = \\frac{1.2 - ${texNum(r.dvinMin, 3)}}{0.25} = ${texSI(r.voutAtEnd, 'V')},\\; t_{slew} = \\frac{V_{out}}{SR} = ${texSI(r.voutAtEnd / r.sr, 's')}`, produces: 'ts', value: r.voutAtEnd / r.sr },
      { tag: 'C', title: '(d) Rout = rO2 ‖ rO4 = (VA/ID)/2', tex: `R_{out} = \\frac{20/100\\mu}{2} = ${texSI(20 / 100e-6 / 2, 'Ω')}`, produces: 'rout', value: 20 / 100e-6 / 2 },
      { tag: '·', title: 'τcl = RoutCL/(1 + βA0), A0 = gm·Rout', tex: `\\tau_{cl} = ${texSI(r.tau, 's')}`, produces: 'tau', value: r.tau },
      { tag: '·', title: 'Linear settling of what is left after slewing, to 1% of the final value', tex: `t_{total} = t_{slew} + \\tau\\ln\\frac{V_{final} - V_{out}(t_{slew})}{0.01\\,V_{final}} = ${texSI(r.total, 's')}`, produces: 'total', value: r.tslew + r.tau * Math.log((r.vFinal - r.voutAtEnd) / (0.01 * r.vFinal)) },
    ],
    hints: ['A 5-T OTA slews at ISS/CL both ways.', 'M2 turns off at √2·Vov.', 'τcl = RoutCL/(1 + βA0).', 'β = 1/4.'],
    flags: [NO_KEY, 'Assumes Vout starts at 0 V and the divider (4 MΩ) does not load the 100 kΩ output.'],
  };
}

function t6q3(): Problem {
  const r = tut6Q3();
  return {
    id: 'bank-t6q3',
    source: 'Tutorial 6 Q3',
    tags: ['L9', 'L4'],
    title: 'Tutorial 6 Q3: folded-cascode slew rate',
    statement: 'NMOS-input folded cascode with a cascode-mirror bottom: CL = 4 pF, ISS = 300 µA, each folding PMOS source IP = 200 µA, VA = 25 V, Vov1,2 = 150 mV. (a) SR+. (b) SR− and what limits it. (c) The condition on IP for SR = ISS/CL both ways. (d) The input step that forces full slewing.',
    figure: { kind: 'step', props: { vstep: 1, tau: 5e-9, eps: 0.01, sr: r.srPlus } },
    givens: [
      { sym: 'I_{SS}', value: 300e-6, unit: 'A' },
      { sym: 'I_P', value: 200e-6, unit: 'A' },
      { sym: 'C_L', value: 4e-12, unit: 'F' },
      { sym: 'V_{ov1,2}', value: 0.15, unit: 'V' },
    ],
    unknowns: [
      { key: 'srp', sym: 'SR_+', label: '(a) Positive slew rate', unit: 'V/s' },
      { key: 'srm', sym: 'SR_-', label: '(b) Negative slew rate', unit: 'V/s' },
      { key: 'ipmin', sym: 'I_{P,min}', label: '(c) Minimum IP for SR = ISS/CL', unit: 'A' },
      { key: 'dv', sym: '\\Delta V_{in,min}', label: '(d) Step for full slewing', unit: 'V' },
    ],
    answers: { srp: r.srPlus, srm: r.srMinus, ipmin: r.ipMin, dv: r.dvinMin },
    wrong: { srp: [{ mistake: 'issNotHalf', value: 300e-6 / 4e-12 }] },
    steps: [
      { tag: '·', title: 'Output current = (IP − ID2) − copy of (IP − ID1); a branch cannot carry negative current', tex: '\\text{with } I_P < I_{SS}\\text{ one cascode branch turns off}' },
      { tag: '·', title: '(a) ID2 → 0: the right branch delivers IP; the left branch (IP − ISS < 0) is off, so the mirror sinks nothing', tex: `SR_+ = \\frac{I_P}{C_L} = ${texSI(200e-6 / 4e-12, 'V/s')}`, produces: 'srp', value: 200e-6 / 4e-12 },
      { tag: '·', title: '(b) ID2 → ISS: the right branch is off, the mirror sinks IP. Limited by IP', tex: `SR_- = ${texSI(200e-6 / 4e-12, 'V/s')}`, produces: 'srm', value: 200e-6 / 4e-12 },
      { tag: '·', title: '(c) To slew at ISS/CL both ways, no branch may turn off', tex: `I_P \\ge I_{SS} = ${texSI(300e-6, 'A')}`, produces: 'ipmin', value: 300e-6 },
      { tag: '·', title: '(d) Full steering at √2·Vov', tex: `\\sqrt{2}\\times 0.15 = ${texSI(Math.SQRT2 * 0.15, 'V')}`, produces: 'dv', value: Math.SQRT2 * 0.15 },
    ],
    hints: ['Write the output current as (right branch) − (mirror of left branch).', 'A cascode branch carries IP − ID; it cannot go negative.', 'With IP ≥ ISS both slew rates are ISS/CL.', 'IP = 200 µA < ISS = 300 µA.'],
    flags: [NO_KEY, 'Assumes the bottom M5–M8 is a cascode current mirror (diode on the left), as drawn.'],
  };
}

function quiz2p(part: 'A' | 'B' | 'C', q: Quiz2Part): Problem {
  const r = quiz2(q);
  const vov34 = Math.sqrt((2 * q.id3) / (q.kpp * q.wlP34));
  const vov10 = Math.sqrt((2 * q.idN) / (q.kpn * q.wlN));
  const vp = q.vb1 - (q.vthn + vov10);
  const sum = 2 * q.cmFraction * q.vdd;
  return {
    id: `bank-quiz2${part.toLowerCase()}`,
    source: `Quiz 2 Part ${part}`,
    tags: ['L8', 'L7'],
    title: `Quiz 2 Part ${part}: triode-sensing CMFB on a telescopic`,
    statement: `Reconstructed from your Quiz 2 key (the question sheet was not uploaded). VDD = ${q.vdd} V, µnCox = ${q.kpn * 1e6} µA/V², µpCox = ${q.kpp * 1e6} µA/V², Vthn = ${q.vthn} V, |Vthp| = ${q.vthp} V, λn = ${q.lambdan} V⁻¹. PMOS M3,4: W/L = ${q.wlP34} at ${q.id3 * 1e6} µA. NMOS devices: W/L = ${q.wlN} at ${q.idN * 1e6} µA, Vb1 = ${q.vb1} V; output CM = ${q.cmFraction}·VDD. Find VD4, VP, (W/L)11,12 of the triode sensing pair, Vout,min and Rout looking down.`,
    figure: { kind: 'cmfbTriode', props: { vout1: q.cmFraction * q.vdd, vout2: q.cmFraction * q.vdd, tail: ['M11', 'M12'], upper: 'PMOS loads M3, M4', upper2: 'NMOS cascodes below', lower: ['NMOS', 'NMOS'] } },
    givens: [{ sym: 'V_{b1}', value: q.vb1, unit: 'V' }],
    unknowns: [
      { key: 'vd4', sym: 'V_{D4}', label: 'VD4', unit: 'V' },
      { key: 'vp', sym: 'V_P', label: 'VP', unit: 'V' },
      { key: 'wl', sym: '(W/L)_{11,12}', label: 'Sensing devices', unit: '' },
      { key: 'vmin', sym: 'V_{out,min}', label: 'Lowest output', unit: 'V' },
      { key: 'rdown', sym: 'R_{out,down}', label: 'Rout looking down', unit: 'Ω' },
    ],
    answers: { vd4: r.vd4, vp: r.vp, wl: r.wl1112, vmin: r.voutMin, rdown: r.routDown },
    wrong: {},
    steps: [
      { tag: 'A', title: 'PMOS diode node: VDD − |VGS3,4|', tex: `V_{D4} = ${texNum(q.vdd)} - (${texNum(q.vthp)} + ${texNum(vov34, 3)}) = ${texSI(q.vdd - (q.vthp + vov34), 'V', 4)}`, produces: 'vd4', value: q.vdd - (q.vthp + vov34) },
      { tag: 'A', title: 'P sits one VGS10 below Vb1', tex: `V_P = ${texNum(q.vb1)} - (${texNum(q.vthn)} + ${texNum(vov10, 3)}) = ${texSI(vp, 'V', 4)}`, produces: 'vp', value: vp },
      { tag: 'A', title: 'Triode sensing pair: VP = 2ID/(µnCox(W/L)(Vout1 + Vout2 − 2Vth))', tex: `\\left(\\tfrac{W}{L}\\right)_{11,12} = \\frac{2I_D}{\\mu_n C_{ox} V_P (${texNum(sum, 3)} - 2V_{th})} = ${texNum((2 * q.idN) / (q.kpn * vp * (sum - 2 * q.vthn)), 4)}`, produces: 'wl', value: (2 * q.idN) / (q.kpn * vp * (sum - 2 * q.vthn)) },
      { tag: '✓', title: 'Lowest output: VP + two NMOS overdrives', tex: `${texSI(vp + 2 * vov10, 'V', 4)}`, produces: 'vmin', value: vp + 2 * vov10 },
      { tag: 'C', title: 'Looking down: gm·rO·rO', tex: `R_{out,down} = ${texSI(((2 * q.idN) / vov10) * (1 / (q.lambdan * q.idN)) ** 2, 'Ω')}`, produces: 'rdown', value: ((2 * q.idN) / vov10) * (1 / (q.lambdan * q.idN)) ** 2 },
    ],
    hints: ['Walk the nodes: PMOS diode from VDD, NMOS from Vb1.', 'Triode devices act as a resistor set by the output CM.', 'VP = 2ID·Rtot with Rtot = 1/(µnCox(W/L)(Vout1 + Vout2 − 2Vth)).', `VP = ${vp.toFixed(3)} V.`],
    flags: ['The key rounds intermediates (VP = 0.11 V), so its W/L differs by up to 1.3%; both are marked right.'],
  };
}

export const M5_BANK: Problem[] = [t4q1(), t4q2(), t4q3(), t5q1(), t5q2(), t5q3(), t6q1(), t6q2(), t6q3(), quiz2p('A', QUIZ2_A), quiz2p('B', QUIZ2_B), quiz2p('C', QUIZ2_C)];
