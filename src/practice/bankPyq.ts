/**
 * Past-year papers: the 2025-26, 2024-25 and 2023-24 mid-sems, the 2024-25 and 2023-24 quizzes, and the
 * 2024-25 Tutorial 2 (stability). Only questions that are inside the current handout (analog L1–L14) are here;
 * the skipped ones are listed in content/inventory.md §13. Each shows the question as printed, a short
 * "concept + formulas" box, the full solution (numbers from src/physics/pyq.ts) and the official key.
 */
import {
  mid23Q3, mid23Q5, mid24Q2, mid24Q3, mid24Q4, mid25Q1, mid25Q2, mid25Q5, mid25Q5b, quiz23Q2, quiz24bQ1, quiz24bQ2, quiz24Q1, quiz24Q2,
  tut24Ex1, tut24Ex2, tut24Ex3, tut24Ex4, tut24Ex56,
} from '../physics';
import { M5_BANK } from './bankM5';
import type { Problem } from './schema';
import { texNum, texSI } from './tex';

function base(p: Omit<Problem, 'wrong'> & { wrong?: Problem['wrong'] }): Problem {
  return { wrong: {}, ...p };
}

// ─── 2025-26 mid-sem (9 Oct 2025) ──────────────────────────────────────────

function m25q1(): Problem {
  const r = mid25Q1();
  return base({
    id: 'pyq-m25-q1',
    source: 'Mid-sem 2025-26 Q1 (13 marks)',
    tags: ['L6'],
    title: '2025 mid-sem Q1: gain-boosted cascode with a CS auxiliary',
    statement:
      'I1 = 100 µA, I2 = 0.5 mA, (W/L)1,2,3 = 100/0.5; I1, I2 are PMOS with (W/L)p = 50/0.5. (a) DC voltages at X and P (gate biases of M3 and M2). (b) Maximum output swing. (c) Overall gain. VDD = 3 V, µnCox = 135 µA/V², µpCox = 40 µA/V², Vthn = 0.7 V, |Vthp| = 0.8 V, λn = 0.1 V⁻¹, λp = 0.2 V⁻¹.',
    printed: [{ img: 'm25q1', caption: '2025-26 mid-sem, Question 1 (as printed)' }],
    key: [{ img: 'k-m25q1', caption: 'Official solution, Q1' }],
    givens: [
      { sym: 'I_1', value: 100e-6, unit: 'A' },
      { sym: 'I_2', value: 0.5e-3, unit: 'A' },
      { sym: '(W/L)_{1,2,3}', value: 200, unit: '' },
      { sym: '\\mu_nC_{ox}', value: 135e-6, unit: 'A/V²' },
    ],
    unknowns: [
      { key: 'vx', sym: 'V_X', label: '(a) VX = gate of M3', unit: 'V', tol: 0.01 },
      { key: 'vp', sym: 'V_P', label: '(a) VP = gate of M2', unit: 'V', tol: 0.01 },
      { key: 'swing', sym: 'V_{swing}', label: '(b) Maximum output swing', unit: 'V', tol: 0.01 },
      { key: 'av', sym: 'A_v', label: '(c) Overall gain (with sign)', unit: 'V/V' },
    ],
    answers: { vx: r.vx, vp: r.vp, swing: r.swing, av: r.av },
    wrong: { av: [{ mistake: 'signFlip', value: -r.av }] },
    inShort: {
      concept: 'M3 is the auxiliary amplifier: it holds X still, so M2 fights (1 + A1) times harder. Bias by walking up from ground (X = VGS3, P = X + VGS2); swing is the room between the two fences; gain is −Gm·(Rup ‖ Rdown).',
      formulas: [
        'V_X = V_{GS3},\\quad V_P = V_X + V_{GS2}',
        'V_{out,max} = V_{DD} - |V_{ov,I_2}|,\\quad V_{out,min} = V_{GS3} + V_{ov2}',
        'A_1 = g_{m3}(r_{O3}\\parallel r_{O,I_1}),\\quad R_{down} = A_1g_{m2}r_{O2}r_{O1},\\quad R_{up} = r_{O,I_2}',
        'A_v = -g_{m1}(R_{up}\\parallel R_{down})',
      ],
    },
    steps: [
      { tag: 'A', title: 'M3 carries I1 = 100 µA with its source on ground: X sits one VGS3 up', tex: `V_{ov3} = \\sqrt{\\tfrac{2(100\\mu)}{135\\mu\\times 200}} = ${texNum(r.vov3, 3)},\\; V_X = 0.7 + ${texNum(r.vov3, 3)} = ${texSI(r.vx, 'V', 3)}`, produces: 'vx', value: r.vx },
      { tag: 'A', title: 'M2 carries I2 = 0.5 mA with its source on X: P = X + VGS2', tex: `V_{ov2} = ${texNum(r.vov2, 3)},\\; V_P = ${texNum(r.vx, 3)} + 0.7 + ${texNum(r.vov2, 3)} = ${texSI(r.vp, 'V', 4)}`, produces: 'vp', value: r.vp },
      { tag: 'A', title: 'Ceiling: the PMOS source I2 needs its |Vov| (0.5 mA, 50/0.5, µpCox 40µ)', tex: `|V_{ov,I_2}| = ${texNum(r.vovI2, 3)} \\Rightarrow V_{out,max} = ${texSI(r.voutMax, 'V', 3)}` },
      { tag: 'A', title: 'Floor: M2’s source sits at VGS3, and M2 needs its own Vov', tex: `V_{out,min} = ${texNum(r.vx, 3)} + ${texNum(r.vov2, 3)} = ${texSI(r.voutMin, 'V', 3)},\\quad \\text{swing} = ${texSI(r.swing, 'V', 4)}`, produces: 'swing', value: r.swing },
      { tag: 'C', title: 'Rdown: the auxiliary gain A1 = gm3(rO3 ‖ rO,I1) multiplies the cascode', tex: `A_1 = ${texSI(r.gm3, 'S')}\\,(${texSI(r.ro3, 'Ω')}\\parallel ${texSI(r.roI1, 'Ω')}) = ${texNum(r.a1, 3)},\\quad R_{down} = A_1g_{m2}r_{O2}r_{O1} = ${texSI(r.rDown, 'Ω')}` },
      { tag: 'D', title: 'Rup is just the PMOS source’s rO (the load trap): it sets the gain', tex: `A_v = -${texSI(r.gm1, 'S')}\\,(${texSI(r.rUp, 'Ω')}\\parallel ${texSI(r.rDown, 'Ω')}) = ${texNum(r.av, 4)}`, produces: 'av', value: r.av },
    ],
    hints: ['Walk the node voltages from ground: M3 first, then M2.', 'X = VGS3 at I1; P = X + VGS2 at I2.', 'Swing: from VGS3 + Vov2 up to VDD − |Vov| of the PMOS source.', 'Rdown ≈ gm3(rO3 ‖ rO,I1)·gm2rO2rO1 is huge; the PMOS rO (10 kΩ) decides the gain.'],
    calc: [
      { what: 'Vov of M3 in one line', keys: '√( 2 × 100 [µ] ÷ ( 135 [µ] × 200 ) )', shows: '0.08607' },
      { what: 'Gain: parallel of 10 kΩ and Rdown', keys: '−5.196[m] × ( 10[k]⁻¹ + 160.9[M]⁻¹ )⁻¹', shows: '≈ −51.96' },
    ],
    flags: ['This is Tutorial 4 Q1 with µnCox = 135 µA/V² (Tutorial 4 uses 172.35). Same method.'],
  });
}

function m25q2(): Problem {
  const r = mid25Q2();
  return base({
    id: 'pyq-m25-q2',
    source: 'Mid-sem 2025-26 Q2 (14 marks)',
    tags: ['L5', 'L14'],
    title: '2025 mid-sem Q2: design a Miller-compensated two-stage op amp',
    statement:
      'Design the two-stage op amp (find every W/L, I and Cc): DC gain 60 dB, GBW = 50 MHz, PM ≥ 60°, SR = 50 V/µs, ICMR(+) = 1.6 V, ICMR(−) = 0.9 V, CL = 5 pF. Use the minimum Cc for 60°. The mirror M3–M4 is perfect when sizing M7; M5 and M6 are the same size. µnCox = 300 µA/V², Vth1(max) = 0.59 V, Vth1(min) = 0.47 V, µpCox = 60 µA/V², |Vth3(max)| = 0.51 V, VDD = 1.8 V.',
    printed: [{ img: 'm25q2', caption: '2025-26 mid-sem, Question 2 (as printed)' }],
    key: [{ img: 'k-m25q2', caption: 'Official solution, Q2' }],
    givens: [
      { sym: 'C_L', value: 5e-12, unit: 'F' },
      { sym: 'SR', value: 50e6, unit: 'V/s' },
      { sym: 'GBW', value: 50e6, unit: 'Hz' },
    ],
    unknowns: [
      { key: 'cc', sym: 'C_c', label: 'Compensation capacitor', unit: 'F' },
      { key: 'i', sym: 'I', label: 'Bias current I (= I5)', unit: 'A' },
      { key: 'wl1', sym: '(W/L)_{1,2}', label: 'Input pair', unit: '' },
      { key: 'wl3', sym: '(W/L)_{3,4}', label: 'Mirror load', unit: '' },
      { key: 'wl5', sym: '(W/L)_{5,6}', label: 'Tail and reference', unit: '', tol: 0.03 },
      { key: 'wl7', sym: '(W/L)_{7}', label: 'Second-stage PMOS', unit: '', tol: 0.03 },
      { key: 'wl8', sym: '(W/L)_{8}', label: 'Second-stage current source', unit: '', tol: 0.04 },
    ],
    answers: { cc: r.cc, i: r.iRef, wl1: r.wl1, wl3: r.wl3, wl5: r.wl5, wl7: r.wl7, wl8: r.wl8 },
    inShort: {
      concept: 'The standard seven-step Miller design: Cc from the phase margin, the tail current from the slew rate, gm1 from the GBW, then each W/L from one spec (ICMR+ sizes the mirror, ICMR− sizes the tail, the RHP zero sizes the output device).',
      formulas: [
        'C_c \\ge 0.22\\,C_L\\ (PM\\ 60^\\circ,\\ z = 10\\,GB)',
        'I_5 = SR\\cdot C_c,\\quad g_{m1} = 2\\pi\\,GB\\,C_c,\\quad (W/L)_1 = \\dfrac{g_{m1}^2}{2\\mu_nC_{ox}I_{D1}}',
        '(W/L)_3 = \\dfrac{2I_{D3}}{\\mu_pC_{ox}\\left[V_{DD} - ICMR^+ - |V_{th3}|_{max} + V_{th1,min}\\right]^2}',
        'V_{ov5} = ICMR^- - \\sqrt{\\tfrac{2I_{D1}}{\\mu_nC_{ox}(W/L)_1}} - V_{th1,max}',
        'g_{m7} \\ge 10g_{m1},\\quad (W/L)_7 = \\dfrac{g_{m7}}{\\mu_pC_{ox}V_{ov3}},\\quad (W/L)_8 = (W/L)_5\\dfrac{I_{D7}}{I_5}',
      ],
    },
    steps: [
      { tag: '·', title: '① Cc for 60° with the zero at 10·GB: Cc ≥ 0.22 CL', tex: `C_c = 0.22\\times 5\\,\\mathrm{pF} = ${texSI(r.cc, 'F')}`, produces: 'cc', value: r.cc },
      { tag: '·', title: '② Slew rate sets the tail current (M5 = M6 so I = I5)', tex: `I_5 = SR\\cdot C_c = 50\\,\\mathrm{V/\\mu s}\\times ${texSI(r.cc, 'F')} = ${texSI(r.i5, 'A')}`, produces: 'i', value: r.iRef },
      { tag: 'A', title: '③ GBW sets gm1; square law gives (W/L)1,2 at ID1 = I5/2', tex: `g_{m1} = 2\\pi(50\\,\\mathrm{M})C_c = ${texSI(r.gm1, 'S')},\\quad (W/L)_{1,2} = \\frac{g_{m1}^2}{2(300\\mu)(${texSI(r.id1, 'A')})} = ${texNum(r.wl1, 3)}`, produces: 'wl1', value: r.wl1 },
      { tag: 'A', title: '④ ICMR(+): M1 at its edge against M3’s diode drop (worst-case thresholds)', tex: `(W/L)_{3,4} = \\frac{2(${texSI(r.id1, 'A')})}{60\\mu\\,(1.8 - 1.6 - 0.51 + 0.47)^2} = ${texNum(r.wl3, 4)}`, produces: 'wl3', value: r.wl3 },
      { tag: 'A', title: '⑤ ICMR(−): what is left for the tail after VGS1', tex: `V_{ov5} = 0.9 - ${texNum(Math.sqrt((2 * r.id1) / (300e-6 * r.wl1)), 3)} - 0.59 = ${texNum(r.vov5, 3)},\\quad (W/L)_{5,6} = ${texNum(r.wl5, 4)}`, produces: 'wl5', value: r.wl5 },
      { tag: 'A', title: '⑥ RHP zero at 10·GB → gm7 = 10gm1; perfect mirror → |Vov7| = |Vov3|', tex: `g_{m7} = ${texSI(r.gm7, 'S')},\\; |V_{ov3}| = ${texNum(r.vov3, 3)},\\; (W/L)_7 = \\frac{g_{m7}}{60\\mu\\times ${texNum(r.vov3, 3)}} = ${texNum(r.wl7, 4)}`, produces: 'wl7', value: r.wl7 },
      { tag: 'A', title: '⑦ M8 mirrors M5 and must carry I7', tex: `I_7 = \\tfrac12(60\\mu)(W/L)_7V_{ov3}^2 = ${texSI(r.id7, 'A')},\\quad (W/L)_8 = ${texNum(r.wl5, 4)}\\times\\frac{${texSI(r.id7, 'A')}}{${texSI(r.i5, 'A')}} = ${texNum(r.wl8, 4)}`, produces: 'wl8', value: r.wl8 },
    ],
    hints: ['Go in the fixed order: Cc, I5, gm1, (W/L)1, (W/L)3, (W/L)5, (W/L)7, (W/L)8.', 'Cc ≥ 0.22CL is the 60° rule when the RHP zero sits at 10·GB.', 'ICMR(+) uses the smallest Vth1 and the largest |Vth3|; ICMR(−) uses the largest Vth1.', 'gm7 ≥ 10gm1 puts the RHP zero at 10·GB.'],
    calc: [
      { what: 'gm1 from GBW', keys: '2 × π × 50 [M] × 1.1 [p]', shows: '345.6µ' },
      { what: '(W/L)3,4 in one line', keys: '2 × 27.5[µ] ÷ ( 60[µ] × ( 1.8 − 1.6 − 0.51 + 0.47 )² )', shows: '35.81' },
    ],
    flags: ['The 60 dB DC-gain spec is not used in the key’s sizing (the gain comes out well above it).', 'Key: Cc 1.1 pF, I5 55 µA, (W/L)1,2 7.21, (W/L)3,4 35.81, (W/L)5,6 16.08, (W/L)7 359.38, (W/L)8 80.69.'],
  });
}

function m25q5(): Problem {
  const a = mid25Q5(2), b = mid25Q5(4), pk = mid25Q5b();
  return base({
    id: 'pyq-m25-q5',
    source: 'Mid-sem 2025-26 Q5 (9 marks)',
    tags: ['L12'],
    title: '2025 mid-sem Q5: phase margin of two close poles, and PM from 50% peaking',
    statement: '(a) AM = 1000, poles at ωp1 and ωp2, ωp1 = 1 MHz, unity-gain feedback. PM for (i) ωp2 = 2ωp1 and (ii) ωp2 = 4ωp1. (b) A unity-gain closed loop peaks by 50% near the gain crossover: what is the PM?',
    printed: [{ img: 'm25q5', caption: '2025-26 mid-sem, Question 5 (as printed)' }],
    key: [{ img: 'k-m25q5', caption: 'Official solution, Q5' }],
    givens: [
      { sym: 'A_M', value: 1000, unit: '' },
      { sym: '\\beta', value: 1, unit: '' },
    ],
    unknowns: [
      { key: 'pm2', sym: 'PM_{(i)}', label: '(a)(i) ωp2 = 2ωp1', unit: '°', tol: 0.05 },
      { key: 'pm4', sym: 'PM_{(ii)}', label: '(a)(ii) ωp2 = 4ωp1', unit: '°', tol: 0.05 },
      { key: 'pmb', sym: 'PM_{(b)}', label: '(b) PM for 50% peaking', unit: '°' },
    ],
    answers: { pm2: a.pm, pm4: b.pm, pmb: pk },
    inShort: {
      concept: 'Find where |βA| = 1 (both poles are far below it, so each contributes almost −90°), then PM = 180° minus the two arctangents. For peaking, at ωGX the closed-loop gain is (1/β)/|1 + e^{−j(180°−PM)}| = 1/(2 sin(PM/2)).',
      formulas: [
        '|\\beta A| = \\dfrac{A_M}{\\sqrt{1+(\\omega/\\omega_{p1})^2}\\sqrt{1+(\\omega/\\omega_{p2})^2}} = 1 \\Rightarrow \\omega_{GX} \\approx \\sqrt{A_M\\omega_{p1}\\omega_{p2}}',
        'PM = 180^\\circ - \\tan^{-1}\\dfrac{\\omega_{GX}}{\\omega_{p1}} - \\tan^{-1}\\dfrac{\\omega_{GX}}{\\omega_{p2}}',
        '\\dfrac{|A_f(\\omega_{GX})|}{1/\\beta} = \\dfrac{1}{2\\sin(PM/2)} \\Rightarrow PM = 2\\sin^{-1}\\dfrac{1}{2K}',
      ],
    },
    steps: [
      { tag: '·', title: '(i) Both poles are far below ωGX: |βA| ≈ AM·ωp1ωp2/ω² = 1', tex: `\\omega_{GX} = ${texNum(a.fgx / 1e6, 4)}\\,\\omega_{p1}` },
      { tag: '·', title: 'Add up the two phase lags', tex: `PM = 180^\\circ - \\tan^{-1}(${texNum(a.fgx / 1e6, 4)}) - \\tan^{-1}(${texNum(a.fgx / 2e6, 4)}) = ${texSI(a.pm, '°', 3)}`, produces: 'pm2', value: a.pm },
      { tag: '·', title: '(ii) Same with ωp2 = 4ωp1: still tiny — two poles this close cannot be fixed by moving one a little', tex: `\\omega_{GX} = ${texNum(b.fgx / 1e6, 4)}\\,\\omega_{p1},\\quad PM = ${texSI(b.pm, '°', 3)}`, produces: 'pm4', value: b.pm },
      { tag: '·', title: '(b) 50% peaking: 1/(2 sin(PM/2)) = 1.5', tex: `PM = 2\\sin^{-1}\\frac{1}{3} = ${texSI(pk, '°', 4)}`, produces: 'pmb', value: pk },
    ],
    hints: ['With AM = 1000 and poles 1–4 MHz apart, the crossover is far above both poles.', 'Above both poles |βA| ≈ AM·ωp1ωp2/ω².', 'PM = 180° − Σ atan(ωGX/ωp).', 'Peaking: |1 + e^{jθ}| with θ = −(180° − PM).'],
    calc: [
      { what: 'Degree mode first', keys: '[SETTINGS] ▸ Calc Settings ▸ Angle Unit ▸ Degree' },
      { what: 'Crossover with the Solver', keys: '[HOME] ▸ Equation ▸ Solver:  1000 ÷ ( √(1+x²) × √(1+(x÷2)²) ) = 1   → solve near x = 40', shows: 'x = 44.71' },
      { what: 'PM', keys: '180 − tan⁻¹(44.71) − tan⁻¹(44.71 ÷ 2)', shows: '3.84' },
      { what: '(b) in one line', keys: '2 sin⁻¹( 1 ÷ (2 × 1.5) )', shows: '38.94' },
    ],
  });
}

function cloneAs(id: string, src: string, patch: Partial<Problem>): Problem {
  const p = M5_BANK.find((x) => x.id === src)!;
  return { ...p, id, ...patch };
}

// ─── 2024-25 mid-sem (8 Oct 2024) ──────────────────────────────────────────

function m24q2(): Problem {
  const r = mid24Q2();
  return base({
    id: 'pyq-m24-q2',
    source: 'Mid-sem 2024-25 Q2 (15 marks)',
    tags: ['L5', 'L14'],
    title: '2024 mid-sem Q2: analyse a Miller two-stage op amp',
    statement: 'I1 = 10 µA, (W/L)6 = 10/1, (W/L)5 = 20/1, (W/L)1,2 = 10/1, (W/L)3,4 = 10/1, (W/L)7 = 80/1, Cc = 0.22 pF, CL = 1 pF. Find SR, GBW, DC gain, bandwidth, second pole, RHP zero and PM. VDD = 1.8 V, µnCox = 100 µA/V², µpCox = 50 µA/V², λp = 0.2 V⁻¹, λn = 0.1 V⁻¹, Vthn = 0.4 V, |Vthp| = 0.5 V.',
    printed: [{ img: 'm24q2', caption: '2024-25 mid-sem, Question 2 (as printed)' }],
    key: [{ img: 'k-m24q2', caption: 'Official key, Q2' }],
    givens: [
      { sym: 'I_1', value: 10e-6, unit: 'A' },
      { sym: 'C_c', value: 0.22e-12, unit: 'F' },
      { sym: 'C_L', value: 1e-12, unit: 'F' },
    ],
    unknowns: [
      { key: 'sr', sym: 'SR', label: 'Slew rate', unit: 'V/s' },
      { key: 'gbw', sym: 'GBW', label: 'Gain-bandwidth product', unit: 'Hz' },
      { key: 'a0', sym: 'A_0', label: 'DC gain', unit: 'V/V' },
      { key: 'bw', sym: 'f_{-3dB}', label: 'Bandwidth', unit: 'Hz' },
      { key: 'fp2', sym: 'f_{p2}', label: 'Second pole', unit: 'Hz' },
      { key: 'fz', sym: 'f_z', label: 'RHP zero', unit: 'Hz' },
      { key: 'pm', sym: 'PM', label: 'Phase margin', unit: '°' },
    ],
    answers: { sr: r.sr, gbw: r.gbw, a0: r.a0, bw: r.bw, fp2: r.fp2, fz: r.fz, pm: r.pm },
    inShort: {
      concept: 'Currents first (mirror ratios), then the four Miller results: SR = I5/Cc, GBW = gm1/(2πCc), second pole gm7/(2πCL), RHP zero gm7/(2πCc). DC gain is the product of the two stage gains; bandwidth = GBW/A0.',
      formulas: [
        'SR = \\dfrac{I_5}{C_c},\\quad GBW = \\dfrac{g_{m1}}{2\\pi C_c}',
        'A_0 = g_{m1}(r_{O2}\\parallel r_{O4})\\cdot g_{m7}(r_{O7}\\parallel r_{O8}),\\quad f_{-3dB} = GBW/A_0',
        'f_{p2} = \\dfrac{g_{m7}}{2\\pi C_L},\\quad f_z = \\dfrac{g_{m7}}{2\\pi C_c}',
        'PM = 180^\\circ - \\tan^{-1}A_0 - \\tan^{-1}\\dfrac{GBW}{f_{p2}} - \\tan^{-1}\\dfrac{GBW}{f_z}',
      ],
    },
    steps: [
      { tag: 'A', title: 'M5 is twice M6: I5 = 20 µA, 10 µA per input device', tex: `SR = \\frac{20\\,\\mu A}{0.22\\,\\mathrm{pF}} = ${texSI(r.sr, 'V/s')}`, produces: 'sr', value: r.sr },
      { tag: 'D', title: 'GBW from gm1 (PMOS, 10 µA, W/L 10)', tex: `g_{m1} = ${texSI(r.gm1, 'S')},\\; GBW = \\frac{g_{m1}}{2\\pi C_c} = ${texSI(r.gbw, 'Hz')}`, produces: 'gbw', value: r.gbw },
      { tag: 'A', title: 'VGS7 = VGS4, so I7 scales with W/L: 80/10 × 10 µA', tex: `V_{GS4} = ${texSI(r.vgs4, 'V', 3)},\\; I_7 = ${texSI(r.id7, 'A')},\\; g_{m7} = ${texSI(r.gm7, 'S')}` },
      { tag: 'D', title: 'DC gain = A1·A2', tex: `A_0 = ${texSI(r.gm1, 'S')}(${texSI(r.ro2, 'Ω')}\\parallel ${texSI(r.ro4, 'Ω')})\\times ${texSI(r.gm7, 'S')}(${texSI(r.ro7, 'Ω')}\\parallel ${texSI(r.ro8, 'Ω')}) = ${texNum(r.a1, 3)}\\times ${texNum(r.a2, 3)} = ${texNum(r.a0, 4)}`, produces: 'a0', value: r.a0 },
      { tag: '·', title: 'Bandwidth = GBW / A0', tex: `f_{-3dB} = ${texSI(r.bw, 'Hz')}`, produces: 'bw', value: r.bw },
      { tag: '·', title: 'Second pole and RHP zero', tex: `f_{p2} = \\frac{g_{m7}}{2\\pi C_L} = ${texSI(r.fp2, 'Hz')},\\quad f_z = \\frac{g_{m7}}{2\\pi C_c} = ${texSI(r.fz, 'Hz')}`, produces: 'fp2', value: r.fp2 },
      { tag: '·', title: 'RHP zero (adds phase lag)', tex: `f_z = ${texSI(r.fz, 'Hz')}`, produces: 'fz', value: r.fz },
      { tag: '·', title: 'PM at ω = GBW (β = 1)', tex: `PM = 180^\\circ - 90^\\circ - \\tan^{-1}\\frac{${texNum(r.gbw / 1e6, 4)}}{${texNum(r.fp2 / 1e6, 4)}} - \\tan^{-1}\\frac{${texNum(r.gbw / 1e6, 4)}}{${texNum(r.fz / 1e6, 4)}} = ${texSI(r.pm, '°', 3)}`, produces: 'pm', value: r.pm },
    ],
    hints: ['Mirror ratios give every current: I5 = 2·I1, I7 = 8·I4.', 'SR and GBW both use Cc (not CL).', 'The second pole uses CL, the zero uses Cc, both with gm7.', 'PM: −90° from the dominant pole, minus atan(GBW/fp2) and atan(GBW/fz).'],
    calc: [{ what: 'PM in degree mode', keys: '180 − tan⁻¹(1555) − tan⁻¹(72.34 ÷ 178.3) − tan⁻¹(72.34 ÷ 810.2)', shows: '≈ 62.8' }],
    flags: ['The key prints PM = 61.78°: it typed 75.34 MHz for the 72.34 MHz GBW inside the arctangents. With 72.34 MHz the PM is ≈ 62.8°. Both are accepted (±2%).'],
  });
}

function m24q3(): Problem {
  const r = mid24Q3();
  return base({
    id: 'pyq-m24-q3',
    source: 'Mid-sem 2024-25 Q3 (10 marks)',
    tags: ['L2'],
    title: '2024 mid-sem Q3: PMOS-input telescopic with a cascode mirror, and as a buffer',
    statement: 'ISS = 50 µA, Vov1–4 = 0.2 V, Vov5–8 = 0.1 V, the tail needs 0.15 V, Vb = 0.7 V. Find the gain, Vout,max (for this Vb) and Vout,min. If Vout is shorted to Vin2, find Vout,max and Vout,min. VDD = 1.8 V, λp = 0.2 V⁻¹, λn = 0.1 V⁻¹, Vthn = 0.4 V, |Vthp| = 0.5 V.',
    printed: [{ img: 'm24q3', caption: '2024-25 mid-sem, Question 3 (as printed)' }],
    key: [{ img: 'k-m24q3', caption: 'Official key, Q3' }],
    givens: [
      { sym: 'I_{SS}', value: 50e-6, unit: 'A' },
      { sym: 'V_b', value: 0.7, unit: 'V' },
    ],
    unknowns: [
      { key: 'av', sym: 'A_v', label: 'Gain', unit: 'V/V' },
      { key: 'vmax', sym: 'V_{out,max}', label: 'Vout,max', unit: 'V' },
      { key: 'vmin', sym: 'V_{out,min}', label: 'Vout,min', unit: 'V' },
      { key: 'bmin', sym: 'V_{out,min}^{buf}', label: 'Buffer: Vout,min', unit: 'V' },
      { key: 'bmax', sym: 'V_{out,max}^{buf}', label: 'Buffer: Vout,max', unit: 'V' },
    ],
    answers: { av: r.av, vmax: r.voutMax, vmin: r.voutMin, bmin: r.bufMin, bmax: r.bufMax },
    inShort: {
      concept: 'Gain = gm2 (Rup ‖ Rdown) with both cascodes ≈ gm·rO². The output ceiling is M4’s PMOS fence (Vb + |Vthp|); the floor is the NMOS cascode mirror, whose diode stack costs one extra Vthn. As a buffer, M2’s gate is the output, so M2’s fence adds a new floor.',
      formulas: [
        'A_v = g_{m2}\\left[g_{m4}r_{O4}r_{O2} \\parallel g_{m6}r_{O6}r_{O8}\\right]',
        'V_{out,max} = V_b + |V_{thp}|,\\quad V_{out,min} = V_{ov8} + V_{ov6} + V_{thn}',
        '\\text{buffer: } V_{D2} = V_b + |V_{GS4}| \\le V_{out} + |V_{thp}| \\Rightarrow V_{out} \\ge V_b + |V_{GS4}| - |V_{thp}|',
      ],
    },
    steps: [
      { tag: 'B', title: 'Roles: M2 input (CS), M4 PMOS cascode, M6 NMOS cascode, M8 current source', tex: `g_{m2} = \\frac{2(25\\mu)}{0.2} = ${texSI(r.gm2, 'S')},\\; g_{m6} = ${texSI(r.gm6, 'S')},\\; r_{OP} = ${texSI(r.ro2, 'Ω')},\\; r_{ON} = ${texSI(r.ro6, 'Ω')}` },
      { tag: 'D', title: 'Up multiplies by gm·rO on both sides', tex: `A_v = ${texSI(r.gm2, 'S')}\\,(${texSI(r.rUp, 'Ω')}\\parallel ${texSI(r.rDown, 'Ω')}) = ${texNum(r.av, 4)}`, produces: 'av', value: r.av },
      { tag: 'A', title: 'Ceiling: M4 (gate Vb) saturated while VD ≤ VG + |Vthp|', tex: `V_{out,max} = 0.7 + 0.5 = ${texSI(r.voutMax, 'V', 2)}`, produces: 'vmax', value: r.voutMax },
      { tag: 'A', title: 'Floor: M6’s gate sits at VGS7 + VGS5 (diode stack); M6 saturated needs Vout ≥ VG6 − Vth', tex: `V_{out,min} = 0.1 + 0.1 + 0.4 = ${texSI(r.voutMin, 'V', 2)}`, produces: 'vmin', value: r.voutMin },
      { tag: '✓', title: 'Buffer: M2’s gate is Vout and its drain is M4’s source, Vb + |VGS4| = 1.4 V', tex: `1.4 \\le V_{out} + 0.5 \\Rightarrow V_{out,min} = ${texSI(r.bufMin, 'V', 2)}`, produces: 'bmin', value: r.bufMin },
      { tag: '✓', title: 'The ceiling is still M4’s fence', tex: `V_{out,max} = ${texSI(r.bufMax, 'V', 2)}`, produces: 'bmax', value: r.bufMax },
    ],
    hints: ['Write each fence: NMOS VD ≥ VG − Vth, PMOS VD ≤ VG + |Vth|.', 'M6’s gate is two VGS above ground (the diode stack).', 'For the buffer, M2’s gate moves with the output.', 'M2’s drain = Vb + |VGS4| = 0.7 + 0.7.'],
    calc: [{ what: 'Gain', keys: '0.25[m] × ( 10[M]⁻¹ + 80[M]⁻¹ )⁻¹', shows: '2222.2' }],
  });
}

function m24q4(): Problem {
  const r = mid24Q4();
  return base({
    id: 'pyq-m24-q4',
    source: 'Mid-sem 2024-25 Q4 (7 marks)',
    tags: ['L6'],
    title: '2024 mid-sem Q4: Rout of a gain-boosted cascode with a folded auxiliary',
    statement: 'Vov of every NMOS is 0.1 V, |Vov| of every PMOS is 0.2 V, ID2 = ID4 = ID7 = 10 µA. Find Rout and the minimum and maximum Vb2. VDD = 1.8 V, λp = 0.2 V⁻¹, λn = 0.1 V⁻¹, Vthn = 0.4 V, |Vthp| = 0.5 V.',
    printed: [{ img: 'm24q4', caption: '2024-25 mid-sem, Question 4 (as printed)' }],
    key: [{ img: 'k-m24q4', caption: 'Official key, Q4' }],
    givens: [
      { sym: 'I_D', value: 10e-6, unit: 'A' },
      { sym: 'V_{ov,n}', value: 0.1, unit: 'V' },
      { sym: '|V_{ov,p}|', value: 0.2, unit: 'V' },
    ],
    unknowns: [
      { key: 'aux', sym: 'A_{aux}', label: 'Auxiliary gain', unit: 'V/V' },
      { key: 'rout', sym: 'R_{out}', label: 'Rout', unit: 'Ω' },
      { key: 'vb2min', sym: 'V_{b2,min}', label: 'Minimum Vb2', unit: 'V' },
    ],
    answers: { aux: r.aAux, rout: r.rout, vb2min: r.vb2Min },
    inShort: {
      concept: 'This is Lec 8’s third implementation: the auxiliary amplifier is a folded cascode (PMOS input M7 folded into NMOS cascode M4, PMOS cascode load M5/M6). Its gain is gm7 × (Rup,aux ‖ Rdown,aux); the boosted Rout is that gain × gm2rO2rO1.',
      formulas: [
        'A_{aux} = g_{m7}\\left[g_{m5}r_{O5}r_{O6} \\parallel g_{m4}r_{O4}(r_{O3}\\parallel r_{O7})\\right]',
        'R_{out} \\approx A_{aux}\\,g_{m2}r_{O2}r_{O1}',
        'V_{b2,min} = V_{ov3} + V_{GS4}',
      ],
    },
    steps: [
      { tag: 'A', title: 'Currents: M3 carries M4’s and M7’s 10 µA each = 20 µA', tex: `g_{m7} = ${texSI(r.gm7, 'S')},\\; g_{m4} = ${texSI(r.gm4, 'S')},\\; r_{O5} = ${texSI(r.ro5, 'Ω')},\\; r_{O4} = ${texSI(r.ro4, 'Ω')},\\; r_{O3} = ${texSI(r.ro3, 'Ω')}` },
      { tag: 'C', title: 'Auxiliary: Rup,aux (PMOS cascode) ‖ Rdown,aux (NMOS cascode on rO3 ‖ rO7)', tex: `A_{aux} = ${texSI(r.gm7, 'S')}\\,(${texSI(r.rUpAux, 'Ω')}\\parallel ${texSI(r.rDownAux, 'Ω')}) = ${texNum(r.aAux, 5)}`, produces: 'aux', value: r.aAux },
      { tag: 'C', title: 'Boosted cascode: Rout ≈ Aaux·gm2rO2rO1', tex: `R_{out} = ${texNum(r.aAux, 5)}\\times 0.2\\,\\mathrm{mS}\\times 1\\,\\mathrm{M\\Omega}\\times 1\\,\\mathrm{M\\Omega} = ${texSI(r.rout, 'Ω', 4)}`, produces: 'rout', value: r.rout },
      { tag: 'A', title: 'Vb2,min: M3 must stay saturated under M4’s source', tex: `V_{b2} - V_{GS4} \\ge V_{ov3} \\Rightarrow V_{b2,min} = 0.1 + 0.5 = ${texSI(r.vb2Min, 'V', 2)}`, produces: 'vb2min', value: r.vb2Min },
    ],
    hints: ['Identify the auxiliary amplifier: input M7, cascode M4, load M5/M6, sink M3.', 'Fold node (M3’s drain) sees rO3 ‖ rO7.', 'Aaux multiplies the cascode’s gm2rO2rO1.', 'Vb2 can drop until M3 hits its edge.'],
    calc: [{ what: 'Aaux', keys: '0.1[m] × ( 25[M]⁻¹ + 50[M]⁻¹ )⁻¹', shows: '1666.7' }],
    flags: ['The key gives Vb2,max = 1 V without working; it is not checked here. Vb2,min = 0.6 V and Rout = 333.3 GΩ match the key.'],
  });
}

// ─── 2023-24 mid-sem (9 Oct 2023) ──────────────────────────────────────────

function m23q3(): Problem {
  const r = mid23Q3();
  return base({
    id: 'pyq-m23-q3',
    source: 'Mid-sem 2023-24 Q3 (14 marks)',
    tags: ['L3'],
    title: '2023 mid-sem Q3: design a high-swing PMOS-input telescopic',
    statement: 'All PMOS about the same size, all NMOS the same size. SR = 5 V/µs into 10 pF; Vout,max = 1.28 V, Vout,min = 0.3 V, VDD = 2 V. µnCox = 100 µA/V², µpCox = 50 µA/V², Vthn = 0.3 V, Vthp = −0.4 V, λn = 0.1, λp = 0.2 V⁻¹ (L = 1 µm). Find all sizes, Vb1,min, Vb2,max, Vb3 and the gain.',
    printed: [{ img: 'm23q3', caption: '2023-24 mid-sem, Question 3 (as printed)' }],
    key: [{ img: 'k-m23q3', caption: 'Official answers, Q3' }],
    givens: [
      { sym: 'SR', value: 5e6, unit: 'V/s' },
      { sym: 'C_L', value: 10e-12, unit: 'F' },
      { sym: 'V_{DD}', value: 2, unit: 'V' },
    ],
    unknowns: [
      { key: 'wlP', sym: '(W/L)_{1-4}', label: 'PMOS M1–M4 (and M9)', unit: '', tol: 0.03 },
      { key: 'wlN', sym: '(W/L)_{5-8}', label: 'NMOS M5–M8', unit: '' },
      { key: 'vb1', sym: 'V_{b1,min}', label: 'Vb1,min', unit: 'V' },
      { key: 'vb2', sym: 'V_{b2,max}', label: 'Vb2,max', unit: 'V' },
      { key: 'vb3', sym: 'V_{b3}', label: 'Vb3', unit: 'V' },
      { key: 'av', sym: 'A_v', label: 'Gain', unit: 'V/V' },
    ],
    answers: { wlP: r.wlP, wlN: r.wlN, vb1: r.vb1Min, vb2: r.vb2Max, vb3: r.vb3, av: r.av },
    inShort: {
      concept: 'Slew rate fixes ISS. The swing limits fix the overdrives: the floor is two NMOS overdrives (high-swing mirror), the ceiling is VDD minus three PMOS overdrives (M9 carries twice the current, so its overdrive is √2 larger). Square law gives W/L; bias voltages put each device at its edge.',
      formulas: [
        'I_{SS} = SR\\cdot C_L,\\quad V_{out,min} = V_{ov8} + V_{ov6}',
        'V_{DD} - V_{out,max} = |V_{ov9}| + |V_{ov2}| + |V_{ov4}| = (\\sqrt2 + 2)|V_{ov}|',
        'V_{b1,min} = V_{ov7} + V_{GS5},\\; V_{b2,max} = V_{DD} - |V_{ov9}| - |V_{ov2}| - |V_{GS4}|,\\; V_{b3} = V_{DD} - |V_{GS9}|',
        'A_v = g_{m2}\\left[g_{m4}r_{O4}r_{O2}\\parallel g_{m6}r_{O6}r_{O8}\\right]',
      ],
    },
    steps: [
      { tag: 'A', title: 'Slew rate: ISS = SR·CL = 50 µA, 25 µA per side', tex: `I_D = ${texSI(r.id, 'A')}` },
      { tag: 'A', title: 'Floor 0.3 V = two NMOS overdrives', tex: `V_{ov,N} = ${texNum(r.vovN, 3)},\\; (W/L)_{5-8} = \\frac{2(25\\mu)}{100\\mu(0.15)^2} = ${texNum(r.wlN, 4)}`, produces: 'wlN', value: r.wlN },
      { tag: 'A', title: 'Ceiling: 2 − 1.28 = 0.72 V shared by M9 (√2·|Vov|) and M2, M4', tex: `|V_{ov}| = \\frac{0.72}{2+\\sqrt2} = ${texNum(r.vovP, 3)},\\; (W/L)_{1-4,9} = ${texNum(r.wlP, 4)}`, produces: 'wlP', value: r.wlP },
      { tag: 'A', title: 'Vb1,min: M7 at its edge under cascode M5', tex: `V_{b1,min} = 0.15 + 0.3 + 0.15 = ${texSI(r.vb1Min, 'V', 2)}`, produces: 'vb1', value: r.vb1Min },
      { tag: 'A', title: 'Vb2,max: M2 at its edge (its drain is M4’s source)', tex: `V_{b2,max} = 2 - ${texNum(r.vov9, 3)} - ${texNum(r.vovP, 3)} - ${texNum(0.4 + r.vovP, 3)} = ${texSI(r.vb2Max, 'V', 3)}`, produces: 'vb2', value: r.vb2Max },
      { tag: 'A', title: 'Vb3 biases the tail M9 (50 µA)', tex: `V_{b3} = 2 - (0.4 + ${texNum(r.vov9, 3)}) = ${texSI(r.vb3, 'V', 3)}`, produces: 'vb3', value: r.vb3 },
      { tag: 'D', title: 'Gain: gm2 (Rup ‖ Rdown)', tex: `A_v = ${texSI(r.gm2, 'S')}\\,(g_{m4}r_{OP}^2 \\parallel g_{m6}r_{ON}^2) = ${texNum(r.av, 4)}`, produces: 'av', value: r.av },
    ],
    hints: ['ISS = SR × CL.', 'The high-swing NMOS mirror leaves only two overdrives at the bottom.', 'M9 carries 2ID: same W/L means √2 times the overdrive.', 'Each bias voltage puts one device exactly at its edge.'],
    calc: [{ what: 'PMOS overdrive and size', keys: '0.72 ÷ (2 + √2) → STO A;  2 × 25[µ] ÷ (50[µ] × A²)', shows: '0.2109;  22.49' }],
    flags: ['The key prints (W/L)1–4 = 22.67 (it rounds |Vov| to 0.21) and (W/L)9 = 22.22. Both are inside ±3%.'],
  });
}

function m23q5(): Problem {
  const r = mid23Q5();
  return base({
    id: 'pyq-m23-q5',
    source: 'Mid-sem 2023-24 Q5 (5 marks)',
    tags: ['L12', 'L14'],
    title: '2023 mid-sem Q5: peaking factor K at PM 50°; Cc vs CL for 45°',
    statement: '(a) If PM = 50°, |Vout/Vin(jωGX)| = K/β. Find K. (b) In a Miller-compensated OTA, for PM = 45° with the RHP zero at 10 × GBW, what relation is needed between CL and Cc?',
    printed: [{ img: 'm23q5', caption: '2023-24 mid-sem, Question 5 (as printed)' }],
    key: [{ img: 'k-m23q5', caption: 'Official answers, Q5' }],
    givens: [{ sym: 'PM', value: 50, unit: '°' }],
    unknowns: [
      { key: 'k', sym: 'K', label: '(a) K', unit: '' },
      { key: 'ratio', sym: 'C_c/C_L', label: '(b) minimum Cc / CL', unit: '' },
    ],
    answers: { k: r.k, ratio: r.ccOverCl },
    inShort: {
      concept: '(a) At ωGX the loop gain is 1∠(PM − 180°), so the closed loop is (1/β)/|1 + e^{−j(180°−PM)}| = (1/β)/(2 sin(PM/2)). (b) Two-stage Miller: ωu = gm1/Cc, ωp2 = gm2/CL, ωz = gm2/Cc. Zero at 10ωu means gm2 = 10gm1; then spend the remaining phase on the second pole.',
      formulas: ['K = \\dfrac{1}{2\\sin(PM/2)}', 'PM = 90^\\circ - \\tan^{-1}\\dfrac{\\omega_u}{\\omega_{p2}} - \\tan^{-1}\\dfrac{\\omega_u}{\\omega_z}', '\\omega_z = 10\\omega_u \\Rightarrow g_{m2} = 10g_{m1},\\quad C_c = \\dfrac{g_{m1}}{g_{m2}}\\dfrac{C_L}{\\tan(\\cdot)}'],
    },
    steps: [
      { tag: '·', title: '(a) K = 1/(2 sin 25°)', tex: `K = ${texNum(r.k, 4)}`, produces: 'k', value: r.k },
      { tag: '·', title: '(b) Phase left for the second pole: 45° − atan(0.1)', tex: `\\tan^{-1}\\frac{\\omega_u}{\\omega_{p2}} = ${texSI(r.x, '°', 4)}` },
      { tag: '·', title: 'ωp2 = ωu/tan(that), with gm2 = 10gm1', tex: `\\frac{g_{m2}}{C_L} = \\frac{g_{m1}}{C_c\\tan(${texNum(r.x, 4)}^\\circ)} \\Rightarrow C_c \\ge ${texNum(r.ccOverCl, 3)}\\,C_L`, produces: 'ratio', value: r.ccOverCl },
    ],
    hints: ['Peaking factor: 1/(2 sin(PM/2)).', 'The zero at 10ωu costs atan(0.1) = 5.7°.', 'The dominant pole costs 90°.', 'gm2 = 10gm1 because ωz/ωu = gm2/gm1.'],
    calc: [{ what: '(b)', keys: '0.1 ÷ tan( 45 − tan⁻¹(0.1) )', shows: '0.1222' }],
  });
}

// ─── Quizzes ───────────────────────────────────────────────────────────────

function q24aq1(): Problem {
  const r = quiz24Q1();
  return base({
    id: 'pyq-q24a-q1',
    source: 'Quiz 1 2024-25 Q1 (9 marks)',
    tags: ['U11'],
    title: '2024 Quiz 1 Q1: five-transistor OTA from its sizes',
    statement: '(W/L)1,2,5 = 15/1, (W/L)3,4 = 30/2, (W/L)6 = 7.5/1, I1 = 20 µA (ideal). λn = 0.1, λp = 0.2 V⁻¹ at L = 1 µm; µnCox = 100 µA/V², µpCox = 50 µA/V², Vthn = 0.4 V, |Vthp| = 0.5 V, VDD = 1.8 V. Find the gain, output swing, Vin,CM,max, Vin,CM,min and power.',
    printed: [{ img: 'q24aq1', caption: '2024-25 Quiz 1, Question 1 (as printed)' }],
    givens: [
      { sym: 'I_1', value: 20e-6, unit: 'A' },
      { sym: 'V_{DD}', value: 1.8, unit: 'V' },
    ],
    unknowns: [
      { key: 'av', sym: 'A_v', label: 'Gain', unit: 'V/V' },
      { key: 'swing', sym: 'V_{swing}', label: 'Output swing', unit: 'V' },
      { key: 'cmmax', sym: 'V_{in,CM,max}', label: 'Vin,CM,max', unit: 'V' },
      { key: 'cmmin', sym: 'V_{in,CM,min}', label: 'Vin,CM,min', unit: 'V' },
      { key: 'p', sym: 'P', label: 'Power', unit: 'W' },
    ],
    answers: { av: r.av, swing: r.swing, cmmax: r.vinCmMax, cmmin: r.vinCmMin, p: r.power },
    inShort: {
      concept: 'Mirror ratio gives ISS; λ scales as 1/L (M3, M4 have L = 2 µm, so λp = 0.1). Then the four standard OTA results.',
      formulas: ['I_{SS} = I_1\\dfrac{(W/L)_5}{(W/L)_6},\\quad \\lambda \\propto 1/L', 'A_v = g_{m1}(r_{O2}\\parallel r_{O4})', 'V_{in,CM}: [V_{ov5} + V_{GS1},\\; V_{DD} - |V_{GS3}| + V_{thn}]', '\\text{swing} = (V_{DD} - |V_{ov4}|) - (V_{ov5} + V_{ov2}),\\quad P = V_{DD}(I_1 + I_{SS})'],
    },
    steps: [
      { tag: 'A', title: 'ISS = 20 µA × 15/7.5 = 40 µA; 20 µA per side. M3, M4: L = 2 µm → λp = 0.1', tex: `g_{m1} = ${texSI(r.gm1, 'S')},\\; r_{O2} = ${texSI(r.ro2, 'Ω')},\\; r_{O4} = ${texSI(r.ro4, 'Ω')}` },
      { tag: 'D', title: 'Gain', tex: `A_v = ${texSI(r.gm1, 'S')}\\times ${texSI(r.ro2 / 2, 'Ω')} = ${texNum(r.av, 4)}`, produces: 'av', value: r.av },
      { tag: 'A', title: 'Swing: ceiling VDD − |Vov4|, floor Vov5 + Vov2', tex: `(1.8 - ${texNum(r.vov3, 3)}) - (${texNum(r.vov5, 3)} + ${texNum(r.vov2, 3)}) = ${texSI(r.swing, 'V', 3)}`, produces: 'swing', value: r.swing },
      { tag: 'A', title: 'CM ceiling: M1 against the diode M3', tex: `1.8 - (0.5 + ${texNum(r.vov3, 3)}) + 0.4 = ${texSI(r.vinCmMax, 'V', 3)}`, produces: 'cmmax', value: r.vinCmMax },
      { tag: 'A', title: 'CM floor: tail plus VGS1', tex: `${texNum(r.vov5, 3)} + 0.4 + ${texNum(r.vov2, 3)} = ${texSI(r.vinCmMin, 'V', 3)}`, produces: 'cmmin', value: r.vinCmMin },
      { tag: '·', title: 'Power: VDD × (I1 + ISS)', tex: `1.8 \\times 60\\,\\mu A = ${texSI(r.power, 'W')}`, produces: 'p', value: r.power },
    ],
    hints: ['ISS from the mirror ratio M5:M6.', 'λ halves when L doubles.', 'gm = √(2µCox(W/L)ID).', 'Power counts the reference branch too.'],
    calc: [{ what: 'gm1 and gain', keys: '√(2 × 100[µ] × 15 × 20[µ]) × ( 500[k]⁻¹ + 500[k]⁻¹ )⁻¹', shows: '61.24' }],
  });
}

function q24aq2(): Problem {
  const r = quiz24Q2();
  return base({
    id: 'pyq-q24a-q2',
    source: 'Quiz 1 2024-25 Q2 (6 marks)',
    tags: ['U12'],
    title: '2024 Quiz 1 Q2: the same OTA sized for 10 V/µs into 2 pF',
    statement: 'Same OTA and sizes. For CL = 2 pF the slew rate is 10 V/µs. Find I1, the bandwidth (Hz), the GBW (Hz) and the power.',
    printed: [{ img: 'q24aq2', caption: '2024-25 Quiz 1, Question 2 (as printed)' }],
    givens: [
      { sym: 'C_L', value: 2e-12, unit: 'F' },
      { sym: 'SR', value: 10e6, unit: 'V/s' },
    ],
    unknowns: [
      { key: 'i1', sym: 'I_1', label: 'I1', unit: 'A' },
      { key: 'bw', sym: 'f_{-3dB}', label: 'Bandwidth', unit: 'Hz' },
      { key: 'gbw', sym: 'GBW', label: 'GBW', unit: 'Hz' },
      { key: 'p', sym: 'P', label: 'Power', unit: 'W' },
    ],
    answers: { i1: r.i1, bw: r.bw, gbw: r.gbw, p: r.power },
    inShort: { concept: 'SR = ISS/CL gives the tail current, the mirror gives I1. One pole at the output: 1/(2πRoutCL); GBW = gm/(2πCL).', formulas: ['I_{SS} = SR\\cdot C_L', 'f_{-3dB} = \\dfrac{1}{2\\pi(r_{O2}\\parallel r_{O4})C_L},\\quad GBW = \\dfrac{g_{m1}}{2\\pi C_L}'] },
    steps: [
      { tag: 'A', title: 'ISS = 10 V/µs × 2 pF = 20 µA; I1 = ISS × 7.5/15', tex: `I_1 = ${texSI(r.i1, 'A')}`, produces: 'i1', value: r.i1 },
      { tag: '·', title: 'Rout = rO2 ‖ rO4 at 10 µA', tex: `f_{-3dB} = \\frac{1}{2\\pi(${texSI(r.rout, 'Ω')})(2\\,\\mathrm{pF})} = ${texSI(r.bw, 'Hz')}`, produces: 'bw', value: r.bw },
      { tag: '·', title: 'GBW = gm1/(2πCL)', tex: `g_{m1} = ${texSI(r.gm1, 'S')},\\; GBW = ${texSI(r.gbw, 'Hz')}`, produces: 'gbw', value: r.gbw },
      { tag: '·', title: 'Power', tex: `1.8 \\times 30\\,\\mu A = ${texSI(r.power, 'W')}`, produces: 'p', value: r.power },
    ],
    hints: ['Slew rate: the whole tail current charges CL.', 'ISS = 2·I1 here.', 'rO = 1/(λID) with the L-scaled λ.', 'GBW does not depend on rO.'],
    calc: [{ what: 'Bandwidth', keys: '1 ÷ ( 2π × 500[k] × 2[p] )', shows: '159.15k' }],
  });
}

function q24bq1(): Problem {
  const r = quiz24bQ1();
  return base({
    id: 'pyq-q24b-q1',
    source: 'Quiz 2 2024-25 Q1 (6 marks)',
    tags: ['L14'],
    title: '2024 Quiz 2 Q1: GBW, PM and Cc from a Miller op amp’s Bode data',
    statement: 'A Miller-compensated two-stage op amp has DC gain 80 dB, poles at 15.9 kHz and 740 MHz, and a zero at 3.18 GHz. CL = 5 pF. Find the GBW, the PM and Cc.',
    printed: [{ img: 'q24bq1', caption: '2024-25 Quiz 2, Question 1 (as printed)' }],
    givens: [
      { sym: 'A_0', value: 1e4, unit: '' },
      { sym: 'f_{p1}', value: 15.9e3, unit: 'Hz' },
      { sym: 'f_{p2}', value: 740e6, unit: 'Hz' },
      { sym: 'f_z', value: 3.18e9, unit: 'Hz' },
    ],
    unknowns: [
      { key: 'gbw', sym: 'GBW', label: 'GBW', unit: 'Hz' },
      { key: 'pm', sym: 'PM', label: 'Phase margin', unit: '°' },
      { key: 'cc', sym: 'C_c', label: 'Compensation capacitor', unit: 'F' },
    ],
    answers: { gbw: r.gbw, pm: r.pm, cc: r.cc },
    inShort: { concept: 'GBW = A0 × fp1. PM at the GBW. The second pole gives gm2 (= 2πfp2CL); the zero gm2/(2πCc) then gives Cc.', formulas: ['GBW = A_0f_{p1}', 'PM = 180^\\circ - \\tan^{-1}A_0 - \\tan^{-1}\\tfrac{GBW}{f_{p2}} - \\tan^{-1}\\tfrac{GBW}{f_z}', 'g_{m2} = 2\\pi f_{p2}C_L,\\quad C_c = \\dfrac{g_{m2}}{2\\pi f_z}'] },
    steps: [
      { tag: '·', title: 'GBW = 10⁴ × 15.9 kHz', tex: `GBW = ${texSI(r.gbw, 'Hz')}`, produces: 'gbw', value: r.gbw },
      { tag: '·', title: 'PM', tex: `PM = 180^\\circ - 90^\\circ - \\tan^{-1}\\frac{159}{740} - \\tan^{-1}\\frac{159}{3180} = ${texSI(r.pm, '°', 3)}`, produces: 'pm', value: r.pm },
      { tag: '·', title: 'gm2 from the second pole, then Cc from the zero', tex: `g_{m2} = 2\\pi(740\\,\\mathrm{M})(5\\,\\mathrm{p}) = ${texSI(r.gm2, 'S')},\\; C_c = \\frac{g_{m2}}{2\\pi(3.18\\,\\mathrm{G})} = ${texSI(r.cc, 'F')}`, produces: 'cc', value: r.cc },
    ],
    hints: ['80 dB = 10⁴.', 'GBW = A0·fp1.', 'fp2 = gm2/(2πCL), fz = gm2/(2πCc).', 'Divide them: Cc/CL = fp2/fz.'],
    calc: [{ what: 'Cc directly', keys: '5[p] × 740[M] ÷ 3.18[G]', shows: '1.164p' }],
  });
}

function q24bq2(): Problem {
  const r = quiz24bQ2();
  return base({
    id: 'pyq-q24b-q2',
    source: 'Quiz 2 2024-25 Q2 (9 marks)',
    tags: ['L7'],
    title: '2024 Quiz 2 Q2: resistive-sensing CMFB: VREF, Vin,CM and the CM gain for ±1%',
    statement: 'Differential gain 50 V/V without the sensing resistors and feedback amplifier. 2Vov1 = Vov5, 3Vov1 = |Vov3|, (W/L)3,4,6 equal. λn = λp = 0.2 V⁻¹, µnCox = 150 µA/V², µpCox = 50 µA/V², Vthn = 0.4 V, |Vthp| = 0.5 V, VDD = 1.8 V. For the optimum Vo,CM (symmetric swing) find VREF, the optimum Vin,CM, and the CM gain needed if Vo,CM may vary by ±1%.',
    printed: [{ img: 'q24bq2', caption: '2024-25 Quiz 2, Question 2 (as printed)' }],
    givens: [
      { sym: 'A_d', value: 50, unit: 'V/V' },
      { sym: '\\lambda', value: 0.2, unit: '' },
    ],
    unknowns: [
      { key: 'vref', sym: 'V_{REF}', label: 'VREF (= optimum Vo,CM)', unit: 'V' },
      { key: 'vincm', sym: 'V_{in,CM}', label: 'Optimum Vin,CM', unit: 'V' },
      { key: 'acm', sym: 'A_{CM}', label: 'CM gain with feedback', unit: 'V/V' },
    ],
    answers: { vref: r.vref, vincm: r.vinCm, acm: r.acmReq },
    inShort: {
      concept: 'Ad = gm(rO ‖ rO) = 1/(λVov1) fixes Vov1, hence every overdrive. The optimum output CM is the middle of the output range; VREF must equal it. Optimum Vin,CM is the middle of the input range. The course rule for “±1%”: the output CM may move 2·1%·Vo,CM over the whole input CM range.',
      formulas: ['A_d = \\dfrac{1}{\\lambda V_{ov1}}', 'V_{o,CM} = \\tfrac12\\left[(V_{ov5} + V_{ov1}) + (V_{DD} - |V_{ov3}|)\\right] = V_{REF}', 'V_{in,CM} \\in [V_{ov5} + V_{GS1},\\; V_{o,CM} + V_{th1}]', 'A_{CM} = \\dfrac{2(0.01)V_{o,CM}}{V_{in,CM,max} - V_{in,CM,min}}'],
    },
    steps: [
      { tag: 'D', title: 'Ad = 50 with equal λ: Vov1 = 1/(λAd)', tex: `V_{ov1} = ${texNum(r.vov1, 3)},\\; V_{ov5} = ${texNum(r.vov5, 3)},\\; |V_{ov3}| = ${texNum(r.vov3, 3)}` },
      { tag: 'A', title: 'Output range and its middle', tex: `[${texNum(r.voutMin, 3)},\\,${texNum(r.voutMax, 3)}] \\Rightarrow V_{REF} = ${texSI(r.vref, 'V', 3)}`, produces: 'vref', value: r.vref },
      { tag: 'A', title: 'Input CM range: tail + VGS1 up to Vo,CM + Vth1; take the middle', tex: `[${texNum(r.vinCmMin, 3)},\\,${texNum(r.vinCmMax, 3)}] \\Rightarrow V_{in,CM} = ${texSI(r.vinCm, 'V', 3)}`, produces: 'vincm', value: r.vinCm },
      { tag: '·', title: 'CM gain allowed by ±1%', tex: `A_{CM} = \\frac{2(0.01)(${texNum(r.vref, 3)})}{${texNum(r.vinCmMax - r.vinCmMin, 3)}} = ${texNum(r.acmReq, 3)}`, produces: 'acm', value: r.acmReq },
    ],
    hints: ['With λn = λp, Ad = 1/(λ·Vov1).', 'VREF = the middle of the output swing.', 'Input CM can reach Vo,CM + Vth before M1 enters triode.', 'Output may move ±1% of Vo,CM (2% in total) over the whole input range.'],
    calc: [{ what: 'CM gain', keys: '2 × 0.01 × 0.9 ÷ ( 1.3 − 0.7 )', shows: '0.03' }],
  });
}

function q23q2(): Problem {
  const a = quiz23Q2(), b = quiz23Q2(-0.1, 0.1);
  return base({
    id: 'pyq-q23-q2',
    source: 'Quiz 1 2023-24 Q2 (folded cascode)',
    tags: ['L4'],
    title: '2023 Quiz 1 Q2: NMOS-input folded cascode: CM range, bias limits, swing, gain',
    statement: '|Vov| = 0.15 V, rO = 50 kΩ, gm = 1 mS, |Vth| = 0.3 V for all, VDD = 3 V. Vb2 at its maximum, Vb1 at its minimum. Find Vin,CM,min, Vin,CM,max, the maximum differential swing, Vb1,min, Vb2,max and the gain. Then with Vb2 = Vb2,max − 0.1 V and Vb1 = Vb1,min + 0.1 V: Vin,CM,max and the swing.',
    printed: [{ img: 'q23q2', caption: '2023-24 Quiz 1, Question 2 (as printed)' }],
    givens: [
      { sym: '|V_{ov}|', value: 0.15, unit: 'V' },
      { sym: 'r_O', value: 50e3, unit: 'Ω' },
      { sym: 'g_m', value: 1e-3, unit: 'S' },
      { sym: 'V_{DD}', value: 3, unit: 'V' },
    ],
    unknowns: [
      { key: 'cmmin', sym: 'V_{in,CM,min}', label: 'Vin,CM,min', unit: 'V' },
      { key: 'cmmax', sym: 'V_{in,CM,max}', label: 'Vin,CM,max (formula value)', unit: 'V' },
      { key: 'swing', sym: 'V_{pp,diff}', label: 'Max differential swing', unit: 'V' },
      { key: 'vb1', sym: 'V_{b1,min}', label: 'Vb1,min', unit: 'V' },
      { key: 'vb2', sym: 'V_{b2,max}', label: 'Vb2,max', unit: 'V' },
      { key: 'av', sym: 'A_v', label: 'Gain', unit: 'V/V' },
      { key: 'cmmax2', sym: "V_{in,CM,max}'", label: 'Part 2: Vin,CM,max', unit: 'V' },
      { key: 'swing2', sym: "V_{pp,diff}'", label: 'Part 2: swing', unit: 'V' },
    ],
    answers: { cmmin: a.vinCmMin, cmmax: a.vinCmMaxCalc, swing: a.swing, vb1: a.vb1Min, vb2: a.vb2Max, av: a.av, cmmax2: b.vinCmMaxCalc, swing2: b.swing },
    inShort: {
      concept: 'NMOS input folded into PMOS cascodes M3, M4 (gate Vb2) on top sources M5, M6; NMOS cascodes M7, M8 (gate Vb1) on M9, M10. Each bias voltage is set so its device’s current source sits exactly at the edge. The input can go above VDD in principle (the fold node is high), so the key writes “3 V (3.15 V)”.',
      formulas: ['V_{in,CM,min} = V_{ov11} + V_{GS1},\\quad V_{in,CM,max} = V_Y + V_{th1},\\; V_Y = V_{b2} + |V_{GS3}|', 'V_{b2,max} = V_{DD} - |V_{ov5}| - |V_{GS3}|,\\quad V_{b1,min} = V_{ov9} + V_{GS7}', 'V_{out} \\in [V_{b1} - V_{th},\\; V_{b2} + |V_{th}|],\\quad \\text{diff swing} = 2(\\cdot)', 'A_v = g_m\\left[g_mr_O(r_O\\parallel r_O) \\parallel g_mr_Or_O\\right]'],
    },
    steps: [
      { tag: 'A', title: 'Input floor: M11 needs Vov, then M1 needs VGS', tex: `V_{in,CM,min} = 0.15 + 0.45 = ${texSI(a.vinCmMin, 'V', 2)}`, produces: 'cmmin', value: a.vinCmMin },
      { tag: 'A', title: 'Bias limits: each puts its current source at the edge', tex: `V_{b2,max} = 3 - 0.15 - 0.45 = ${texSI(a.vb2Max, 'V', 2)},\\quad V_{b1,min} = 0.15 + 0.45 = ${texSI(a.vb1Min, 'V', 2)}`, produces: 'vb2', value: a.vb2Max },
      { tag: 'A', title: 'Vb1,min', tex: `V_{b1,min} = ${texSI(a.vb1Min, 'V', 2)}`, produces: 'vb1', value: a.vb1Min },
      { tag: 'A', title: 'Input ceiling: M1’s drain is the fold node Y = Vb2 + |VGS3|; its gate may go Vth above it (capped at VDD = 3 V)', tex: `V_{in,CM,max} = ${texNum(a.vinCmMaxCalc - 0.3, 3)} + 0.3 = ${texSI(a.vinCmMaxCalc, 'V', 3)}\\;(\\text{use } 3\\,\\mathrm{V})`, produces: 'cmmax', value: a.vinCmMaxCalc },
      { tag: 'A', title: 'Output: from Vb1 − Vth up to Vb2 + |Vth|, doubled', tex: `2\\left[(${texNum(a.voutMax, 3)}) - (${texNum(a.voutMin, 3)})\\right] = ${texSI(a.swing, 'V', 2)}`, produces: 'swing', value: a.swing },
      { tag: 'D', title: 'Gain: Rup = gm rO (rO ‖ rO) (fold node), Rdown = gm rO rO', tex: `A_v = 1\\,\\mathrm{mS}\\,(${texSI(a.rUp, 'Ω')}\\parallel ${texSI(a.rDown, 'Ω')}) = ${texNum(a.av, 4)}`, produces: 'av', value: a.av },
      { tag: '✓', title: 'Part 2: Vb2 down 0.1 V lowers Y and the ceiling; Vb1 up 0.1 V raises the floor', tex: `V_{in,CM,max} = ${texSI(b.vinCmMaxCalc, 'V', 3)},\\quad \\text{swing} = ${texSI(b.swing, 'V', 2)}`, produces: 'cmmax2', value: b.vinCmMaxCalc },
      { tag: '✓', title: 'Part 2 swing', tex: `${texSI(b.swing, 'V', 2)}`, produces: 'swing2', value: b.swing },
    ],
    hints: ['Find the four node voltages first: fold node Y, the two cascode sources.', 'Vb2,max puts M5 at its edge; Vb1,min puts M9 at its edge.', 'The output floor is Vb1 − Vth (M7 fence), the ceiling Vb2 + |Vth| (M3 fence).', 'At the fold node rO1 ‖ rO5 appears under the PMOS cascode.'],
    calc: [{ what: 'Gain', keys: '1[m] × ( 1.25[M]⁻¹ + 2.5[M]⁻¹ )⁻¹', shows: '833.33' }],
  });
}

// ─── 2024-25 Tutorial 2 (stability) ────────────────────────────────────────

function tut24(): Problem[] {
  const e1a = tut24Ex1(0.01), e1b = tut24Ex1(1), e2 = tut24Ex2(), e3 = tut24Ex3(), e5 = tut24Ex56();
  return [
    base({
      id: 'pyq-t24-ex1',
      source: 'Past tutorial 2024-25 T2 Ex 1',
      tags: ['L11'],
      title: 'Past tutorial: how far feedback moves a single pole',
      statement: 'An op amp with one pole at 100 Hz and low-frequency gain 10⁵ is used with β = 0.01. By what factor does feedback shift the pole, and to what frequency? If β gives a closed-loop gain of +1, where does the pole go?',
      givens: [
        { sym: 'A_0', value: 1e5, unit: '' },
        { sym: 'f_p', value: 100, unit: 'Hz' },
      ],
      unknowns: [
        { key: 'f1', sym: "f_p'", label: 'Pole with β = 0.01', unit: 'Hz' },
        { key: 'f2', sym: "f_p''", label: 'Pole with β = 1', unit: 'Hz' },
      ],
      answers: { f1: e1a.fClosed, f2: e1b.fClosed },
      inShort: { concept: 'Closing the loop divides the gain and multiplies the pole by the same factor (1 + βA0): gain × bandwidth stays constant.', formulas: ["f_p' = f_p(1 + \\beta A_0),\\quad A_f = \\dfrac{A_0}{1+\\beta A_0}"] },
      steps: [
        { tag: '·', title: 'Factor 1 + βA0 = 1001', tex: `f_p' = 100\\times ${texNum(e1a.factor, 4)} = ${texSI(e1a.fClosed, 'Hz')}`, produces: 'f1', value: e1a.fClosed },
        { tag: '·', title: 'Gain +1 means β = 1: factor 100001', tex: `f_p'' = ${texSI(e1b.fClosed, 'Hz')}`, produces: 'f2', value: e1b.fClosed },
      ],
      hints: ['Feedback trades gain for bandwidth.', 'The pole moves by (1 + βA0).', 'β = 0.01 → 1 + 1000.', 'β = 1 → the pole reaches GBW.'],
    }),
    base({
      id: 'pyq-t24-ex2',
      source: 'Past tutorial 2024-25 T2 Ex 2',
      tags: ['L11'],
      title: 'Past tutorial: two poles closing in — coincident poles and maximally flat',
      statement: 'Low-frequency gain 100, poles at 10⁴ and 10⁶ rad/s, feedback factor β. For what β do the closed-loop poles coincide? What is Q then? For what β is the response maximally flat, and what is the closed-loop gain?',
      givens: [
        { sym: 'A_0', value: 100, unit: '' },
        { sym: '\\omega_{p1}', value: 1e4, unit: 'rad/s' },
        { sym: '\\omega_{p2}', value: 1e6, unit: 'rad/s' },
      ],
      unknowns: [
        { key: 'b1', sym: '\\beta_{coinc}', label: 'β for coincident poles', unit: '' },
        { key: 'b2', sym: '\\beta_{flat}', label: 'β for a maximally flat response', unit: '' },
        { key: 'g', sym: 'A_f', label: 'Closed-loop gain (flat case)', unit: 'V/V' },
      ],
      answers: { b1: e2.betaCoincide, b2: e2.betaFlat, g: e2.gainFlat },
      inShort: {
        concept: 'Closed loop: s² + (ωp1 + ωp2)s + (1 + βA0)ωp1ωp2 = 0. Its Q = √((1 + βA0)ωp1ωp2)/(ωp1 + ωp2). Poles coincide at Q = 0.5; maximally flat at Q = 1/√2.',
        formulas: ['Q = \\dfrac{\\sqrt{(1+\\beta A_0)\\omega_{p1}\\omega_{p2}}}{\\omega_{p1}+\\omega_{p2}}', 'Q = 0.5:\\ 1+\\beta A_0 = \\dfrac{(\\omega_{p1}+\\omega_{p2})^2}{4\\omega_{p1}\\omega_{p2}},\\quad Q = \\tfrac{1}{\\sqrt2}:\\ 1+\\beta A_0 = \\dfrac{(\\omega_{p1}+\\omega_{p2})^2}{2\\omega_{p1}\\omega_{p2}}'],
      },
      steps: [
        { tag: '·', title: 'Coincident poles: discriminant zero (Q = 0.5)', tex: `\\beta = \\frac{(1.01\\times10^6)^2/(4\\times10^{10}) - 1}{100} = ${texNum(e2.betaCoincide, 4)}`, produces: 'b1', value: e2.betaCoincide },
        { tag: '·', title: 'Maximally flat: Q = 1/√2', tex: `\\beta = ${texNum(e2.betaFlat, 4)}`, produces: 'b2', value: e2.betaFlat },
        { tag: '·', title: 'Closed-loop gain A0/(1 + βA0)', tex: `A_f = ${texNum(e2.gainFlat, 3)}`, produces: 'g', value: e2.gainFlat },
      ],
      hints: ['Write the closed-loop denominator.', 'Compare with s² + (ω0/Q)s + ω0².', 'Coincident: Q = 0.5; flat: Q = 0.707.', 'Then A0/(1 + βA0).'],
    }),
    base({
      id: 'pyq-t24-ex3',
      source: 'Past tutorial 2024-25 T2 Ex 3',
      tags: ['L12'],
      title: 'Past tutorial: crossover and PM of a one-pole op amp at gain 100',
      statement: 'A0 = 10⁵, fp = 10 Hz, otherwise ideal, non-inverting with closed-loop gain 100. Find the frequency where |Aβ| = 1, and the phase margin.',
      givens: [
        { sym: 'A_0', value: 1e5, unit: '' },
        { sym: 'f_p', value: 10, unit: 'Hz' },
      ],
      unknowns: [
        { key: 'f', sym: 'f_1', label: 'Frequency where |Aβ| = 1', unit: 'Hz' },
        { key: 'pm', sym: 'PM', label: 'Phase margin', unit: '°' },
      ],
      answers: { f: e3.f1, pm: e3.pm },
      inShort: { concept: 'β = 1/100, so βA0 = 1000: the loop gain crosses 1 three decades above the pole. One pole can never take more than 90°.', formulas: ['f_1 = f_p\\sqrt{(\\beta A_0)^2 - 1} \\approx \\beta A_0 f_p', 'PM = 180^\\circ - \\tan^{-1}(f_1/f_p)'] },
      steps: [
        { tag: '·', title: 'βA0 = 1000', tex: `f_1 = ${texSI(e3.f1, 'Hz')}`, produces: 'f', value: e3.f1 },
        { tag: '·', title: 'PM', tex: `PM = 180^\\circ - \\tan^{-1}(1000) = ${texSI(e3.pm, '°', 4)}`, produces: 'pm', value: e3.pm },
      ],
      hints: ['β = 1/(closed-loop gain).', '|βA| = βA0/√(1 + (f/fp)²).', 'One pole: phase ≥ −90°.', 'So PM ≈ 90°.'],
    }),
    base({
      id: 'pyq-t24-ex4',
      source: 'Past tutorial 2024-25 T2 Ex 4',
      tags: ['L12'],
      title: 'Past tutorial: closed-loop gain at ω1 for PM 30°, 60°, 90°',
      statement: 'Find the closed-loop gain at ω1 (where |Aβ| = 1) relative to the low-frequency gain, for phase margins of 30°, 60° and 90°.',
      givens: [{ sym: '|A\\beta(\\omega_1)|', value: 1, unit: '' }],
      unknowns: [
        { key: 'k30', sym: 'K_{30}', label: 'PM = 30°', unit: '' },
        { key: 'k60', sym: 'K_{60}', label: 'PM = 60°', unit: '' },
        { key: 'k90', sym: 'K_{90}', label: 'PM = 90°', unit: '' },
      ],
      answers: { k30: tut24Ex4(30), k60: tut24Ex4(60), k90: tut24Ex4(90) },
      inShort: { concept: 'Same as Lec 16: at ω1 the denominator is |1 + e^{−j(180°−PM)}| = 2 sin(PM/2).', formulas: ['K = \\dfrac{1}{2\\sin(PM/2)}'] },
      steps: [
        { tag: '·', title: 'PM 30°: peaks', tex: `K = ${texNum(tut24Ex4(30), 4)}`, produces: 'k30', value: tut24Ex4(30) },
        { tag: '·', title: 'PM 60°: exactly no peak', tex: `K = ${texNum(tut24Ex4(60), 3)}`, produces: 'k60', value: tut24Ex4(60) },
        { tag: '·', title: 'PM 90°: the usual −3 dB point', tex: `K = ${texNum(tut24Ex4(90), 4)}`, produces: 'k90', value: tut24Ex4(90) },
      ],
      hints: ['At ω1, Aβ = 1∠(PM − 180°).', '|1 + e^{jθ}| = 2|cos(θ/2)|.', 'With θ = PM − 180°, that is 2 sin(PM/2).', 'K = 1/(2 sin(PM/2)).'],
    }),
    base({
      id: 'pyq-t24-ex56',
      source: 'Past tutorial 2024-25 T2 Ex 5–6',
      tags: ['L13'],
      title: 'Past tutorial: dominant-pole compensation for closed-loop gains down to 20 dB',
      statement: 'A multipole amplifier: first pole 1 MHz, DC gain 100 dB, second pole 10 MHz. (Ex 5) Where must a new dominant pole go so it is stable for closed-loop gains as low as 20 dB? (Ex 6) Instead, lower the first pole (second pole unchanged): to what frequency, and by what factor must that node’s capacitance grow?',
      givens: [
        { sym: 'A_0', value: 1e5, unit: '' },
        { sym: 'f_{p1}', value: 1e6, unit: 'Hz' },
        { sym: 'f_{p2}', value: 10e6, unit: 'Hz' },
      ],
      unknowns: [
        { key: 'fd', sym: 'f_D', label: 'Ex 5: new dominant pole', unit: 'Hz' },
        { key: 'fp1', sym: "f_{p1}'", label: 'Ex 6: lowered first pole', unit: 'Hz' },
        { key: 'cf', sym: 'C\\ \\text{factor}', label: 'Ex 6: capacitance factor', unit: '' },
      ],
      answers: { fd: e5.fD, fp1: e5.fp1New, cf: e5.capFactor },
      inShort: { concept: 'Gain 20 dB → β = 0.1 → βA0 = 10⁴. Make the loop gain fall at −20 dB/dec from the new pole to 0 dB exactly where the next pole sits (≈45° PM, Sedra’s rule used in this tutorial).', formulas: ['f_D = \\dfrac{f_{p1}}{\\beta A_0}', "f_{p1}' = \\dfrac{f_{p2}}{\\beta A_0},\\quad \\dfrac{C_{new}}{C_{old}} = \\dfrac{f_{p1}}{f_{p1}'}"] },
      steps: [
        { tag: '·', title: 'Ex 5: from βA0 = 10⁴ down to 1 at 1 MHz takes four decades', tex: `f_D = \\frac{1\\,\\mathrm{MHz}}{10^4} = ${texSI(e5.fD, 'Hz')}`, produces: 'fd', value: e5.fD },
        { tag: '·', title: 'Ex 6: now the crossover is the second pole, 10 MHz', tex: `f_{p1}' = \\frac{10\\,\\mathrm{MHz}}{10^4} = ${texSI(e5.fp1New, 'Hz')}`, produces: 'fp1', value: e5.fp1New },
        { tag: '·', title: 'The pole is 1/(RC): C grows by the same factor', tex: `${texNum(e5.capFactor, 3)}\\times`, produces: 'cf', value: e5.capFactor },
      ],
      hints: ['20 dB closed loop → β = 0.1.', 'βA0 = 10⁴ = four decades.', 'Unity loop gain at the next pole.', 'f ∝ 1/C.'],
    }),
  ];
}

export const PYQ_BANK: Problem[] = [
  m25q1(),
  m25q2(),
  cloneAs('pyq-m25-q4', 'bank-t5q1', {
    source: 'Mid-sem 2025-26 Q4 (12 marks)',
    title: '2025 mid-sem Q4: size the triode CMFB devices (= Tutorial 5 Q1)',
    printed: [{ img: 'm25q4', caption: '2025-26 mid-sem, Question 4 (as printed)' }],
    key: [{ img: 'k-m25q4', caption: 'Official solution, Q4' }],
  }),
  m25q5(),
  cloneAs('pyq-m24-q1', 'bank-t5q3', {
    source: 'Mid-sem 2024-25 Q1 (20 marks)',
    title: '2024 mid-sem Q1: CMFB with R = 10 MΩ sensing (= Tutorial 5 Q3)',
    printed: [{ img: 'm24q1', caption: '2024-25 mid-sem, Question 1 (as printed)' }],
    key: [{ img: 'k-m24q1', caption: 'Official key, Q1' }],
  }),
  m24q2(),
  m24q3(),
  m24q4(),
  m23q3(),
  m23q5(),
  q24aq1(),
  q24aq2(),
  q24bq1(),
  q24bq2(),
  q23q2(),
  ...tut24(),
];
