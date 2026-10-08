/**
 * Fixed bank for Milestone 4 (handout lectures L1–L4): Tutorial 2 (Razavi 9.1–9.3), Tutorial 3
 * (Razavi 9.4, 9.6, 9.8), Problem Set 1 P1–P10 from the tutoring chat, Razavi Examples 9.1, 9.2, 9.7,
 * 9.8, and Quiz 1 Parts A and B. Restated in plain words (not copied from the book).
 *
 * Answers come only from src/physics/solvers (the direct solve). Each step recomputes its number from the
 * arithmetic it shows with the local helper `dev` (the traced solve); the fixed-bank test checks both agree.
 */
import {
  ex91,
  ex92,
  ex97,
  fiveTOtaQuiz,
  ps1P1,
  ps1P10,
  ps1P2,
  ps1P3,
  ps1P4,
  ps1P5,
  ps1P6,
  ps1P9,
  QUIZ1_A,
  QUIZ1_B,
  SET_A,
  SET_B,
  tut2Q1,
  tut2Q2,
  tut2Q3,
  tut3Q1,
  tut3Q2,
  tut3Q3,
  type OtaCmDesign,
} from '../physics';
import type { Given, Problem } from './schema';
import { texNum, texSI } from './tex';

/** Traced device numbers: written out here, independent of src/physics. */
function dev(id: number, kp: number, wl: number, vth: number, lambda: number) {
  const vov = Math.sqrt((2 * id) / (kp * wl));
  return { vov, vgs: vth + vov, gm: (2 * id) / vov, ro: 1 / (lambda * id) };
}
const par = (a: number, b: number) => (a * b) / (a + b);
const A = SET_A, B = SET_B;

const SET_A_TEXT = 'Set A (Razavi 0.5 µm): µnCox = 134.28 µA/V², µpCox = 38.36 µA/V², λn = 0.1 V⁻¹, λp = 0.2 V⁻¹ (L = 0.5 µm), Vthn = 0.7 V, |Vthp| = 0.8 V, VDD = 3 V, γ = 0.';
const SET_B_TEXT = 'Set B: µnCox = 200 µA/V², µpCox = 100 µA/V², λn = 0.05 V⁻¹, λp = 0.1 V⁻¹, Vthn = 0.4 V, |Vthp| = 0.5 V, VDD = 1.8 V.';
const setAGivens: Given[] = [
  { sym: '\\mu_n C_{ox}', value: A.kpn, unit: 'A/V²' },
  { sym: '\\mu_p C_{ox}', value: A.kpp, unit: 'A/V²' },
  { sym: 'V_{thn}', value: A.vthn, unit: 'V' },
  { sym: '|V_{thp}|', value: A.vthp, unit: 'V' },
  { sym: 'V_{DD}', value: A.vdd, unit: 'V' },
];
const ANTI_SEDRA = '“50/0.5” means W = 50 µm, L = 0.5 µm, so W/L = 100.';

// ─── Tutorial 2 ────────────────────────────────────────────────────────────

function t2q1(): Problem {
  const r = tut2Q1();
  const n = dev(0.5e-3, A.kpn, 100, A.vthn, A.lambdan);
  const p = dev(0.5e-3, A.kpp, 100, A.vthp, A.lambdap);
  const av = n.gm * par(n.ro, p.ro);
  const vmin = 1.3 - A.vthn, vmax = A.vdd - p.vov;
  return {
    id: 'bank-t2q1',
    source: 'Tutorial 2 Q1 (Razavi Problem 9.1)',
    tags: ['L2'],
    title: 'Tutorial 2 Q1: fully differential pair with PMOS current-source loads',
    statement: `${SET_A_TEXT} An NMOS pair (M1, M2) with PMOS current-source loads (M3, M4), (W/L)1–4 = 50/0.5, ISS = 1 mA, input CM = 1.3 V. (a) gm and rO in triode (derivation, see the lesson). (b) Small-signal gain and maximum output swing with every device saturated. (c) If each PMOS may enter triode by 50 mV, what is the gain at the peaks of the swing?`,
    figure: { kind: 'diffPair', props: { vdd: 3, iss: 1e-3, kp: A.kpn, wl: 100, vth: A.vthn, vin1: 1.3, vin2: 1.3, load: 'current', kpp: A.kpp, wlp: 100, vthp: A.vthp } },
    givens: [...setAGivens, { sym: '(W/L)_{1-4}', value: 100, unit: '' }, { sym: 'I_{SS}', value: 1e-3, unit: 'A' }, { sym: 'V_{in,CM}', value: 1.3, unit: 'V' }],
    unknowns: [
      { key: 'av', sym: 'A_v', label: '(b) Differential gain', unit: 'V/V' },
      { key: 'vmin', sym: 'V_{out,min}', label: '(b) Lowest output (each side)', unit: 'V' },
      { key: 'vmax', sym: 'V_{out,max}', label: '(b) Highest output (each side)', unit: 'V' },
      { key: 'peak', sym: 'A_{v,peak}', label: '(c) Gain at the swing peaks', unit: 'V/V', tol: 0.03 },
    ],
    answers: { av: r.av, vmin: r.voutMin, vmax: r.voutMax, peak: r.peak.avAtPeak },
    wrong: { av: [{ mistake: 'roNotHalf', value: n.gm * n.ro }], vmin: [{ mistake: 'vovNotVgs', value: 1.3 - n.vgs }] },
    steps: [
      { tag: 'A', title: 'Each side carries 0.5 mA', tex: `V_{ov,n} = ${texSI(n.vov, 'V')},\\;|V_{ov,p}| = ${texSI(p.vov, 'V')}` },
      { tag: 'C', title: 'gm1 and the output node rO1 ‖ rO3', tex: `g_{m1} = ${texSI(n.gm, 'S')},\\; r_{O1} = ${texSI(n.ro, 'Ω')},\\; r_{O3} = ${texSI(p.ro, 'Ω')}` },
      { tag: 'D', title: 'Half circuit: Av = gm1 (rO1 ‖ rO3)', tex: `A_v = ${texNum(av)}`, produces: 'av', value: av },
      { tag: '✓', title: 'Floor: M1 fence, VD ≥ Vin,CM − Vth', tex: `V_{out,min} = 1.3 - 0.7 = ${texSI(vmin, 'V')}`, produces: 'vmin', value: vmin },
      { tag: '✓', title: 'Ceiling: M3 needs |Vov3|', tex: `V_{out,max} = 3 - ${texNum(p.vov, 3)} = ${texSI(vmax, 'V')}`, produces: 'vmax', value: vmax },
      { tag: 'D', title: '(c) At the peak one PMOS is 50 mV into triode: its rO becomes the triode resistance; average the two halves', tex: `A_{v,peak} \\approx ${texNum(r.peak.avAtPeak)}`, produces: 'peak', value: r.peak.avAtPeak },
    ],
    hints: ['Use the half circuit: one input device, one PMOS load.', 'Gain = gm1(rO1 ‖ rO3); the swing comes from the two fences.', 'Vout ∈ [Vin,CM − Vthn, VDD − |Vov3|].', `gm1 = ${(n.gm * 1e3).toPrecision(3)} mA/V.`],
    flags: [ANTI_SEDRA, 'Part (c) is ambiguous (inventory flag 9): averaging the two halves gives 19.8; the triode half alone gives 15.2. Ask your instructor which one they want.', 'Your preliminary answers (24.4, 0.60–2.49 V) agree with the engine.'],
  };
}

function t2q2(): Problem {
  const r = tut2Q2();
  const vgsMax = (A.vdd - (1.4 - A.vthn)) / 2;
  const vovMax = vgsMax - A.vthp;
  const wl = (2 * 0.5e-3) / (A.kpp * vovMax * vovMax);
  return {
    id: 'bank-t2q2',
    source: 'Tutorial 2 Q2 (Razavi Problem 9.2)',
    tags: ['L2'],
    title: 'Tutorial 2 Q2: telescopic with a diode-connected cascode mirror',
    statement: `${SET_A_TEXT} The single-ended telescopic (Fig. 9.9 style): (W/L)1–4 = 100/0.5, ISS = 1 mA, Vb = 1.4 V; M5–M8 identical, L = 0.5 µm. (a) Minimum PMOS width for M3 to stay saturated. (b) Maximum output swing. (c) Open-loop gain.`,
    figure: { kind: 'mirrorTele', props: { proc: A, iss: 1e-3, wlN: 200, wlP: r.wlPmin, vinCm: 1.2, vb1: 1.4, vout: 1.1, bias: 'diodes' } },
    givens: [...setAGivens, { sym: '(W/L)_{1-4}', value: 200, unit: '' }, { sym: 'I_{SS}', value: 1e-3, unit: 'A' }, { sym: 'V_b', value: 1.4, unit: 'V' }],
    unknowns: [
      { key: 'w', sym: 'W_{min}', label: '(a) Minimum PMOS width (µm)', unit: '' },
      { key: 'vmin', sym: 'V_{out,min}', label: '(b) Lowest output', unit: 'V' },
      { key: 'vmax', sym: 'V_{out,max}', label: '(b) Highest output (M2 gate on the output)', unit: 'V' },
      { key: 'av', sym: 'A_v', label: '(c) Open-loop gain', unit: 'V/V' },
    ],
    answers: { w: r.wMin * 1e6, vmin: r.buffer.lower, vmax: r.buffer.upper, av: r.av },
    wrong: { vmax: [{ mistake: 'forgotSatCheck', value: r.voutMaxStack }] },
    steps: [
      { tag: 'A', title: 'Two PMOS diodes stack from VDD: M3’s drain sits at VDD − 2|VGS,p|. Fence: VD3 ≥ Vb − Vthn', tex: `3 - 2|V_{GS,p}| \\ge 1.4 - 0.7 \\Rightarrow |V_{GS,p}| \\le ${texSI(vgsMax, 'V')},\\;|V_{ov,p}| \\le ${texSI(vovMax, 'V')}` },
      { tag: 'A', title: 'Smallest W/L that carries 0.5 mA at that overdrive', tex: `\\tfrac{W}{L} = \\frac{2(0.5\\mathrm{m})}{38.36\\mu\\,(${texNum(vovMax, 3)})^2} = ${texNum(wl, 4)} \\Rightarrow W = ${texNum(wl * 0.5, 4)}\\,\\mu\\mathrm{m}`, produces: 'w', value: wl * 0.5 },
      { tag: '✓', title: 'Floor: M4 fence, Vout ≥ Vb − Vth4', tex: `V_{out,min} = 1.4 - 0.7 = ${texSI(1.4 - A.vthn, 'V')}`, produces: 'vmin', value: 1.4 - A.vthn },
      { tag: '✓', title: 'Ceiling from the stacks is VDD − |Vthp| − 2|Vov,p| = 1.50 V, but M2’s gate is on Vout: M2 leaves saturation above Vb − VGS4 + Vth2', tex: `V_{out,max} = ${texSI(r.buffer.upper, 'V')}`, produces: 'vmax', value: r.buffer.upper },
      { tag: 'D', title: 'Gain: gm1 (Rdown ‖ Rup), both ≈ gm·rO²', tex: `A_v \\approx ${texNum(r.av)}`, produces: 'av', value: r.av },
    ],
    hints: ['Where does M3’s drain sit? Count the diode drops from VDD.', 'M3 saturated needs VD3 ≥ Vb − Vthn.', 'VD3 = VDD − 2|VGS,p|; then size for |Vov,p|.', `|VGS,p| ≤ ${vgsMax.toFixed(2)} V.`],
    flags: [ANTI_SEDRA, 'Disagreement (inventory flag 8): your preliminary range was 0.70–1.50 V. That is right for the cascode stacks alone, but in Fig. 9.9 M2’s gate is tied to Vout, so the real top is 1.21 V (the Vth − Vov window of Ex 9.5).'],
  };
}

function t2q3(): Problem {
  const r = tut2Q3();
  const itot = 6e-3 / 3, iss = itot / 2, vov = (3 - 1.2) / 4;
  return {
    id: 'bank-t2q3',
    source: 'Tutorial 2 Q3 (Razavi Problem 9.3)',
    tags: ['L4'],
    title: 'Tutorial 2 Q3: design a folded cascode for 2.4 V swing and 6 mW',
    statement: `${SET_A_TEXT} Design the PMOS-input folded cascode (Fig. 9.15) for a maximum differential swing of 2.4 V and a total power of 6 mW, all L = 0.5 µm. Find the currents, the overdrives, the gain, and whether the input CM can go down to 0 V.`,
    figure: { kind: 'folded', props: { proc: A, iss: r.iss, i: r.i, wl1: r.fc.m1.wl, wl3: r.fc.m3.wl, wl5: r.fc.m5.wl, wl7: r.fc.m7.wl, wl9: r.fc.m9.wl, wl11: (2 * r.iss) / (A.kpp * 0.3 * 0.3), vinCm: 0.5, vout: 1.5 } },
    givens: [...setAGivens, { sym: 'P', value: 6e-3, unit: '' }, { sym: 'V_{pp,diff}', value: 2.4, unit: 'V' }],
    unknowns: [
      { key: 'iss', sym: 'I_{SS}', label: 'Tail current', unit: 'A' },
      { key: 'vov', sym: 'V_{ov}', label: 'Overdrive of each swing-critical device', unit: 'V' },
      { key: 'av', sym: 'A_v', label: 'Gain (Gm = gm1)', unit: 'V/V' },
      { key: 'cmMin', sym: 'V_{in,CM,min}', label: 'Lowest input CM', unit: 'V' },
    ],
    answers: { iss: r.iss, vov: r.vovEach, av: r.fc.av, cmMin: r.fc.vinCmMin },
    wrong: { av: [{ mistake: 'forgotRo', value: r.fc.avExact }] },
    steps: [
      { tag: 'A', title: 'Power budget: 6 mW / 3 V = 2 mA total; split half to the input pair, half to the two cascode branches', tex: `I_{SS} = 1\\,\\mathrm{mA},\\; I = 0.5\\,\\mathrm{mA}`, produces: 'iss', value: iss },
      { tag: 'A', title: 'Swing budget: each output swings 1.2 V; four overdrives share the rest', tex: `V_{ov} = \\frac{3 - 1.2}{4} = ${texSI(vov, 'V')}`, produces: 'vov', value: vov },
      { tag: 'D', title: 'Gain: gm1 (Rup ‖ Rdown), Rup = gm7 rO7 rO9, Rdown = gm3 rO3 (rO1 ‖ rO5)', tex: `A_v \\approx ${texNum(r.fc.av)}\\;(${texNum(r.fc.avExact)}\\text{ with the exact current divider})`, produces: 'av', value: r.fc.av },
      { tag: '✓', title: 'Input CM floor: M1’s fence against X = Vov5', tex: `V_{in,CM,min} = V_{ov5} - |V_{thp}| = ${texNum(vov, 3)} - 0.8 = ${texSI(vov - A.vthp, 'V')} < 0\\;\\checkmark`, produces: 'cmMin', value: vov - A.vthp },
    ],
    hints: ['Start with power, even if nobody asked: it fixes the currents.', 'Swing fixes the overdrives: VDD − swing/2 shared by four devices.', 'Gain = gm1·(Rup ‖ Rdown).', 'ISS = 1 mA, I = 0.5 mA.'],
    flags: ['Your preliminary (overdrives ≈ 0.45 V, Av ≈ 250, CM can reach 0 V) agrees with the engine.'],
  };
}

// ─── Tutorial 3 ────────────────────────────────────────────────────────────

function t3q1(): Problem {
  const r = tut3Q1();
  const n = dev(0.5e-3, A.kpn, 200, A.vthn, A.lambdan);
  const p = dev(0.5e-3, A.kpp, 200, A.vthp, A.lambdap);
  return {
    id: 'bank-t3q1',
    source: 'Tutorial 3 Q1 (Razavi Problem 9.4)',
    tags: ['L2'],
    title: 'Tutorial 3 Q1: telescopic with a low-voltage cascode mirror',
    statement: `${SET_A_TEXT} In Fig. 9.21(b): (W/L)1–8 = 100/0.5, ISS = 1 mA, Vb1 = 1.7 V, γ = 0. (a) Maximum input CM. (b) VX. (c) Output range if M2’s gate is tied to the output. (d) Allowed range of Vb2.`,
    figure: { kind: 'mirrorTele', props: { proc: A, iss: 1e-3, wlN: 200, wlP: 200, vinCm: 1.2, vb1: 1.7, vout: 1.3, bias: 'vb2', vb2: 1.2, buffer: true } },
    givens: [...setAGivens, { sym: '(W/L)_{1-8}', value: 200, unit: '' }, { sym: 'I_{SS}', value: 1e-3, unit: 'A' }, { sym: 'V_{b1}', value: 1.7, unit: 'V' }],
    unknowns: [
      { key: 'cmMax', sym: 'V_{in,CM,max}', label: '(a) Maximum input CM', unit: 'V' },
      { key: 'vx', sym: 'V_X', label: '(b) VX', unit: 'V' },
      { key: 'lo', sym: 'V_{out,min}', label: '(c) Lowest output (buffer)', unit: 'V' },
      { key: 'hi', sym: 'V_{out,max}', label: '(c) Highest output (buffer)', unit: 'V' },
      { key: 'vb2min', sym: 'V_{b2,min}', label: '(d) Lowest Vb2', unit: 'V' },
      { key: 'vb2max', sym: 'V_{b2,max}', label: '(d) Highest Vb2', unit: 'V' },
    ],
    answers: { cmMax: r.vinCmMax, vx: r.vx, lo: r.window.lower, hi: r.window.upper, vb2min: r.vb2Min, vb2max: r.vb2Max },
    wrong: { vx: [{ mistake: 'vovNotVgs', value: A.vdd - p.vov }] },
    steps: [
      { tag: 'A', title: '(a) M1’s drain sits at Vb1 − VGS3; its gate may rise to that plus Vth', tex: `V_{in,CM,max} = V_{b1} - V_{GS3} + V_{th} = 1.7 - ${texNum(n.vgs, 4)} + 0.7 = ${texSI(1.7 - n.vgs + A.vthn, 'V', 4)}`, produces: 'cmMax', value: 1.7 - n.vgs + A.vthn },
      { tag: 'A', title: '(b) M7’s gate is on X and its source on VDD: X sits one |VGS7| below VDD', tex: `V_X = 3 - ${texNum(p.vgs, 4)} = ${texSI(A.vdd - p.vgs, 'V', 4)}`, produces: 'vx', value: A.vdd - p.vgs },
      { tag: '✓', title: '(c) Buffer window: M4 fence below, M2 fence above', tex: `V_{b1} - V_{th} = ${texSI(1.7 - A.vthn, 'V')} \\le V_{out} \\le V_{b1} - V_{GS4} + V_{th} = ${texSI(1.7 - n.vgs + A.vthn, 'V', 4)}`, produces: 'lo', value: 1.7 - A.vthn },
      { tag: '✓', title: 'Top of the window (width Vth − Vov4)', tex: `V_{out,max} = ${texSI(1.7 - n.vgs + A.vthn, 'V', 4)}`, produces: 'hi', value: 1.7 - n.vgs + A.vthn },
      { tag: '✓', title: '(d) M5 saturated: VX ≤ Vb2 + |Vthp|', tex: `V_{b2} \\ge V_X - 0.8 = ${texSI(A.vdd - p.vgs - A.vthp, 'V', 4)}`, produces: 'vb2min', value: A.vdd - p.vgs - A.vthp },
      { tag: '✓', title: 'M7 saturated: its drain (M5’s source, Vb2 + |VGS5|) ≤ VX + |Vthp|', tex: `V_{b2} \\le V_X + 0.8 - |V_{GS5}| = ${texSI(A.vdd - p.vgs + A.vthp - p.vgs, 'V', 4)}`, produces: 'vb2max', value: A.vdd - p.vgs + A.vthp - p.vgs },
    ],
    hints: ['Walk the node voltages first: X, the NMOS cascode source, the tail.', 'Every limit is a fence: NMOS VD ≥ VG − Vth, PMOS VD ≤ VG + |Vth|.', 'Window = [Vb1 − Vth, Vb1 − VGS4 + Vth].', `VGS,n = ${n.vgs.toFixed(3)} V, |VGS,p| = ${p.vgs.toFixed(3)} V.`],
    flags: [ANTI_SEDRA],
  };
}

function t3q2(): Problem {
  const r = tut3Q2();
  const m1 = dev(0.5e-3, A.kpn, 200, A.vthn, A.lambdan);
  const m3 = dev(0.5e-3, A.kpp, 200, A.vthp, A.lambdap);
  const m5 = dev(1e-3, A.kpp, 200, A.vthp, A.lambdap);
  const m7 = dev(1e-3, A.kpn, 200, A.vthn, A.lambdan);
  const a1 = m1.gm * par(m1.ro, m3.ro), a2 = m5.gm * par(m5.ro, m7.ro);
  const vmax = A.vdd - m5.vov, vmin = m7.vov;
  return {
    id: 'bank-t3q2',
    source: 'Tutorial 3 Q2 (Razavi Problem 9.6)',
    tags: ['L5', 'L2'],
    title: 'Tutorial 3 Q2: two-stage op amp, CM level at X and Y',
    statement: `${SET_A_TEXT} Two-stage op amp (Fig. 9.23): (W/L)1–8 = 100/0.5, ISS = 1 mA. (a) What CM level at X, Y gives ID5 = ID6 = 1 mA, and how does it cap the input CM? (b) Overall gain and maximum output swing.`,
    figure: { kind: 'twoStage', props: { proc: A, iss: 1e-3, id2: 1e-3, wl: 200, vinCm: 1.5, vout: 1.5 } },
    givens: [...setAGivens, { sym: '(W/L)_{1-8}', value: 200, unit: '' }, { sym: 'I_{SS}', value: 1e-3, unit: 'A' }, { sym: 'I_{D5,6}', value: 1e-3, unit: 'A' }],
    unknowns: [
      { key: 'vxy', sym: 'V_{X,Y}', label: '(a) CM level at X and Y', unit: 'V' },
      { key: 'cmMax', sym: 'V_{in,CM,max}', label: '(a) Maximum input CM', unit: 'V' },
      { key: 'av', sym: 'A_v', label: '(b) Overall gain', unit: 'V/V' },
      { key: 'swing', sym: 'V_{pp,diff}', label: '(b) Differential swing', unit: 'V' },
    ],
    answers: { vxy: r.vxy, cmMax: r.vinCmMax, av: r.av, swing: r.diffSwing },
    wrong: { av: [{ mistake: 'forgotRo', value: a1 + a2 }] },
    steps: [
      { tag: 'A', title: '(a) M5 carries 1 mA only if its |VGS| is right: X sits one |VGS5| below VDD', tex: `V_{X,Y} = 3 - ${texNum(m5.vgs, 4)} = ${texSI(A.vdd - m5.vgs, 'V', 4)}`, produces: 'vxy', value: A.vdd - m5.vgs },
      { tag: '✓', title: 'M1’s fence against X', tex: `V_{in,CM,max} = V_X + V_{th} = ${texSI(A.vdd - m5.vgs + A.vthn, 'V', 4)}`, produces: 'cmMax', value: A.vdd - m5.vgs + A.vthn },
      { tag: 'D', title: '(b) Gain multiplies: A1 = gm1(rO1 ‖ rO3), A2 = gm5(rO5 ‖ rO7)', tex: `A_v = ${texNum(a1, 3)} \\times ${texNum(a2, 3)} = ${texNum(a1 * a2)}`, produces: 'av', value: a1 * a2 },
      { tag: '✓', title: 'Output swing: CS stages, one overdrive at each rail', tex: `2[(3 - ${texNum(m5.vov, 3)}) - ${texNum(m7.vov, 3)}] = ${texSI(2 * (vmax - vmin), 'V')}`, produces: 'swing', value: 2 * (vmax - vmin) },
    ],
    hints: ['X drives M5’s gate: its voltage fixes M5’s current.', 'VX = VDD − |VGS5| at 1 mA.', 'A = A1·A2; swing = 2(VDD − |Vov5| − Vov7).', `|VGS5| = ${m5.vgs.toFixed(3)} V.`],
    flags: [ANTI_SEDRA],
  };
}

function t3q3(): Problem {
  const r = tut3Q3();
  return {
    id: 'bank-t3q3',
    source: 'Tutorial 3 Q3 (Razavi Problem 9.8)',
    tags: ['L5', 'L3'],
    title: 'Tutorial 3 Q3: two-stage with a telescopic first stage',
    statement: `${SET_A_TEXT} Fig. 9.24: ISS = 1 mA, ID9–12 = 0.5 mA, (W/L)9–12 = 100/0.5. (a) Required CM level at X, Y. (b) If the tail needs 400 mV, choose the smallest M1–M8 that allow a 200 mV peak-to-peak swing at X and Y. (c) Overall gain.`,
    givens: [...setAGivens, { sym: 'I_{SS}', value: 1e-3, unit: 'A' }, { sym: '(W/L)_{9-12}', value: 200, unit: '' }, { sym: 'V_{ISS}', value: 0.4, unit: 'V' }],
    unknowns: [
      { key: 'vxy', sym: 'V_{X,Y}', label: '(a) CM level at X, Y', unit: 'V' },
      { key: 'wlN', sym: '(W/L)_{1-4}', label: '(b) NMOS size (equal overdrive split)', unit: '' },
      { key: 'wlP', sym: '(W/L)_{5-8}', label: '(b) PMOS size (equal overdrive split)', unit: '' },
      { key: 'av', sym: 'A_v', label: '(c) Overall gain', unit: 'V/V', tol: 0.03 },
    ],
    answers: { vxy: r.vxy, wlN: r.wlN, wlP: r.wlP, av: r.av },
    wrong: {},
    steps: [
      { tag: 'A', title: '(a) X drives M9: X = VDD − |VGS9| at 0.5 mA', tex: `V_{X,Y} = ${texSI(r.vxy, 'V', 4)}`, produces: 'vxy', value: r.vxy },
      { tag: 'A', title: '(b) Below X (−0.1 V) the tail and two NMOS share the room; above X (+0.1 V) two PMOS share the rest. Split equally', tex: `V_{ov,N} = \\frac{V_X - 0.1 - 0.4}{2} = ${texSI(r.vovN, 'V')},\\; |V_{ov,P}| = \\frac{3 - (V_X + 0.1)}{2} = ${texSI(r.vovP, 'V')}` },
      { tag: 'A', title: 'Smallest devices = largest overdrives', tex: `\\left(\\tfrac{W}{L}\\right)_{1-4} = ${texNum(r.wlN)},\\; \\left(\\tfrac{W}{L}\\right)_{5-8} = ${texNum(r.wlP)}`, produces: 'wlN', value: r.wlN },
      { tag: 'A', title: 'PMOS size', tex: `\\left(\\tfrac{W}{L}\\right)_{5-8} = ${texNum(r.wlP)}`, produces: 'wlP', value: r.wlP },
      { tag: 'D', title: '(c) Telescopic first stage × CS second stage', tex: `A_v = ${texNum(r.a1, 3)} \\times ${texNum(r.a2, 3)} = ${texNum(r.av)}`, produces: 'av', value: r.av },
    ],
    hints: ['Same trick as Q2: the second-stage gate sets X.', 'Headroom stacking around X ± 0.1 V.', 'W/L = 2ID/(µCox·Vov²) with the largest allowed Vov.', `VX = ${r.vxy.toFixed(3)} V.`],
    flags: [ANTI_SEDRA, 'Part (b) does not say how to split the headroom between the stacked devices; the engine splits it equally. A different split gives different sizes.'],
  };
}

// ─── Razavi examples ───────────────────────────────────────────────────────

function ex91p(): Problem {
  const r = ex91();
  return {
    id: 'bank-ex91',
    source: 'Razavi Example 9.1',
    tags: ['L1'],
    title: 'Ex 9.1: how much open-loop gain for 1% gain error?',
    statement: 'A non-inverting amplifier must have a closed-loop gain of 10 with a gain error below 1%. What is the minimum open-loop gain A?',
    figure: { kind: 'nonInverting', props: { r1: 9e3, r2: 1e3 } },
    givens: [
      { sym: 'A_{closed}', value: 10, unit: '' },
      { sym: '\\varepsilon', value: 0.01, unit: '' },
    ],
    unknowns: [{ key: 'a', sym: 'A_{min}', label: 'Minimum open-loop gain', unit: '', tol: 0.012 }],
    answers: { a: r.approx },
    wrong: { a: [{ mistake: 'aInsteadOfInvBeta', value: 100 }] },
    steps: [
      { tag: '·', title: 'β = 1/Aclosed = 0.1', tex: '\\beta = 0.1' },
      { tag: '·', title: 'Gain error ε = 1/(1 + βA) ≈ 1/(βA) ≤ 0.01', tex: `A \\ge \\frac{A_{closed}}{\\varepsilon} = \\frac{10}{0.01} = ${texNum(10 / 0.01)}\\;(\\text{exact: } ${texNum(r.exact)})`, produces: 'a', value: 10 / 0.01 },
    ],
    hints: ['Gain error is one over loop gain.', 'ε = 1/(1 + βA) ≈ 1/(βA).', 'A ≥ Aclosed/ε.', 'β = 1/10.'],
    flags: ['Both 1000 (design form) and 990 (exact form) are accepted.'],
  };
}

function ex92p(): Problem {
  const r = ex92();
  const wu = Math.log(100) / (0.1 * 5e-9);
  return {
    id: 'bank-ex92',
    source: 'Razavi Example 9.2',
    tags: ['L1'],
    title: 'Ex 9.2: how fast must the op amp be to settle in 5 ns?',
    statement: 'A one-pole op amp is used with a closed-loop gain of 10. The output must settle to within 1% of its final value in 5 ns after a small step. Find the minimum unity-gain frequency ωu (and fu).',
    givens: [
      { sym: 'A_{closed}', value: 10, unit: '' },
      { sym: '\\varepsilon', value: 0.01, unit: '' },
      { sym: 't_s', value: 5e-9, unit: 's' },
    ],
    unknowns: [
      { key: 'wu', sym: '\\omega_u', label: 'Minimum ωu', unit: 'rad/s' },
      { key: 'fu', sym: 'f_u', label: 'Minimum fu', unit: 'Hz' },
    ],
    answers: { wu: r.omegaU, fu: r.fu },
    wrong: { fu: [{ mistake: 'forgot2pi', value: r.omegaU }], wu: [{ mistake: 'lnValues', value: Math.log10(100) / (0.1 * 5e-9) }] },
    steps: [
      { tag: '·', title: '1% settling takes ln(100) = 4.6 time constants', tex: '\\tau \\le \\frac{5\\,\\mathrm{ns}}{4.6}' },
      { tag: '·', title: 'τ = 1/(β·ωu), so ωu ≥ ln(1/ε)/(β·t)', tex: `\\omega_u \\ge \\frac{4.605}{0.1 \\times 5\\,\\mathrm{ns}} = ${texSI(wu, 'rad/s')}`, produces: 'wu', value: wu },
      { tag: '·', title: 'Divide by 2π', tex: `f_u = ${texSI(wu / (2 * Math.PI), 'Hz')}`, produces: 'fu', value: wu / (2 * Math.PI) },
    ],
    hints: ['Settling is exponential with τ = Aclosed/ωu.', 'How many τ for 1%?', 't = τ·ln(1/ε); ωu = Aclosed·ln(1/ε)/t.', 'ln(100) = 4.605.'],
  };
}

function ex97p(): Problem {
  const r = ex97();
  const P = { name: 'Ex 9.7', kpn: 60e-6, kpp: 30e-6, vthn: 0.7, vthp: 0.7, lambdan: 0.1, lambdap: 0.2, vdd: 3 };
  const n = dev(1.5e-3, P.kpn, (2 * 1.5e-3) / (P.kpn * 0.04), P.vthn, P.lambdan);
  return {
    id: 'bank-ex97',
    source: 'Razavi Example 9.7',
    tags: ['L3'],
    title: 'Ex 9.7: design a telescopic op amp from specs',
    statement: 'Design a fully differential telescopic op amp: VDD = 3 V, power 10 mW, differential swing 3 V, gain 2000. µnCox = 60 µA/V², µpCox = 30 µA/V², λn = 0.1 V⁻¹, λp = 0.2 V⁻¹ (L = 0.5 µm), Vth = 0.7 V. Following the book: ISS = 3 mA, tail Vov9 = 0.5 V, PMOS |Vov| = 0.3 V, NMOS Vov = 0.2 V. Find the sizes, the gain, and the bias voltages.',
    figure: { kind: 'telescopic', props: { proc: { ...P, lRef: 0.5e-6 }, iss: 3e-3, wlN: r.wlN, wlP: r.wlP, wl9: r.wl9, vinCm: r.vinCm, vb1: r.vb1, vb2: r.vb2, vout: 1.65 } },
    givens: [
      { sym: 'I_{SS}', value: 3e-3, unit: 'A' },
      { sym: 'V_{ov,N}', value: 0.2, unit: 'V' },
      { sym: '|V_{ov,P}|', value: 0.3, unit: 'V' },
      { sym: 'V_{ov9}', value: 0.5, unit: 'V' },
    ],
    unknowns: [
      { key: 'wlN', sym: '(W/L)_{1-4}', label: 'NMOS size', unit: '' },
      { key: 'wlP', sym: '(W/L)_{5-8}', label: 'PMOS size', unit: '' },
      { key: 'wl9', sym: '(W/L)_9', label: 'Tail size', unit: '' },
      { key: 'av', sym: 'A_v', label: 'Gain', unit: 'V/V' },
      { key: 'vb1', sym: 'V_{b1}', label: 'NMOS cascode bias', unit: 'V' },
      { key: 'vb2', sym: 'V_{b2}', label: 'PMOS cascode bias', unit: 'V' },
    ],
    answers: { wlN: r.wlN, wlP: r.wlP, wl9: r.wl9, av: r.av, vb1: r.vb1, vb2: r.vb2 },
    wrong: {},
    steps: [
      { tag: 'A', title: 'Power: 10 mW / 3 V = 3.33 mA. About 0.33 mA goes to the bias branches (Ib1, Ib2), leaving ISS = 3 mA: 1.5 mA each side', tex: 'I_{SS} = 3\\,\\mathrm{mA}' },
      { tag: 'A', title: 'Swing: 3 V differential = 1.5 V each side; the rest (1.5 V) goes to 2|Vov,P| + 2Vov,N + Vov9 = 0.6 + 0.4 + 0.5', tex: '|V_{ov,P}| = 0.3,\\; V_{ov,N} = 0.2,\\; V_{ov9} = 0.5' },
      { tag: 'A', title: 'Sizes from the square law', tex: `\\left(\\tfrac{W}{L}\\right)_{1-4} = \\frac{2(1.5\\mathrm{m})}{60\\mu(0.2)^2} = ${texNum((2 * 1.5e-3) / (60e-6 * 0.04))}`, produces: 'wlN', value: (2 * 1.5e-3) / (60e-6 * 0.04) },
      { tag: 'A', title: 'PMOS', tex: `\\left(\\tfrac{W}{L}\\right)_{5-8} = \\frac{2(1.5\\mathrm{m})}{30\\mu(0.3)^2} = ${texNum((2 * 1.5e-3) / (30e-6 * 0.09))}`, produces: 'wlP', value: (2 * 1.5e-3) / (30e-6 * 0.09) },
      { tag: 'A', title: 'Tail', tex: `\\left(\\tfrac{W}{L}\\right)_9 = \\frac{2(3\\mathrm{m})}{60\\mu(0.5)^2} = ${texNum((2 * 3e-3) / (60e-6 * 0.25))}`, produces: 'wl9', value: (2 * 3e-3) / (60e-6 * 0.25) },
      { tag: 'D', title: 'Gain: gm1 [gm3 rO3 rO1 ‖ gm5 rO5 rO7]; the PMOS side (λp = 0.2) is the weak one', tex: `A_v \\approx ${texNum(r.av)}\\;(\\text{book: } 1416)`, produces: 'av', value: r.av },
      { tag: '✓', title: 'Gain < 2000: lengthen M5–M8 (W and L ×2, same Vov): λp halves, rO doubles', tex: `A_v \\approx ${texNum(r.avLengthened)}` },
      { tag: 'A', title: 'Bias for full swing: Vin,CM = VISS + VGS1 = 1.4 V; Vb1 = Vin,CM − Vth + VGS3', tex: `V_{b1} = 1.4 - 0.7 + ${texNum(n.vgs, 3)} = ${texSI(1.4 - 0.7 + n.vgs, 'V')}`, produces: 'vb1', value: 1.4 - 0.7 + n.vgs },
      { tag: 'A', title: 'Vb2 = VDD − |Vov7| − |VGS5|', tex: `V_{b2} = 3 - 0.3 - 1.0 = ${texSI(3 - 0.3 - (0.7 + 0.3), 'V')}`, produces: 'vb2', value: 3 - 0.3 - (0.7 + 0.3) },
    ],
    hints: ['Start with power, then swing, then overdrives, then sizes.', 'Every W/L from 2ID/(µCox·Vov²).', 'Gain = gm1(Rdown ‖ Rup).', 'ID = 1.5 mA per side.'],
    flags: ['Gain: exact square law 1429, Razavi prints 1416, your notes 1428 (inventory flag 5). All agree to 1%.'],
  };
}

function ex98p(): Problem {
  const r = ps1P9();
  const p6 = ps1P6();
  return {
    id: 'bank-ex98',
    source: 'Razavi Example 9.8 / Problem Set 1 P9',
    tags: ['L3'],
    title: 'Ex 9.8: linear scaling to drive a bigger load',
    statement: 'The folded cascode of Problem Set 1 P6 (4.5 mW, CL = 2 pF) must drive CL = 8 pF with the same unity-gain bandwidth. Scale every width and every bias current by α. Find α, the new power and the new (W/L)1,2.',
    givens: [
      { sym: 'C_{L,old}', value: 2e-12, unit: 'F' },
      { sym: 'C_{L,new}', value: 8e-12, unit: 'F' },
      { sym: 'P_{old}', value: 4.5e-3, unit: '' },
    ],
    unknowns: [
      { key: 'alpha', sym: '\\alpha', label: 'Scale factor', unit: '' },
      { key: 'power', sym: 'P_{new}', label: 'New power (W)', unit: '' },
      { key: 'wl', sym: '(W/L)_{1,2}', label: 'New input size', unit: '' },
    ],
    answers: { alpha: r.alpha, power: r.power, wl: r.wl12 },
    wrong: { alpha: [{ mistake: 'forgotSquare', value: 2 }] },
    steps: [
      { tag: '·', title: 'ωu = gm/CL. Widths and currents ×α keep every Vov, so gm ×α: need α = CL,new/CL,old', tex: `\\alpha = \\frac{8}{2} = ${texNum(8 / 2)}`, produces: 'alpha', value: 8 / 2 },
      { tag: '·', title: 'Power scales with current', tex: `P = 4\\times 4.5\\,\\mathrm{mW} = ${texNum(4 * 4.5e-3 * 1e3)}\\,\\mathrm{mW}`, produces: 'power', value: 4 * p6.power },
      { tag: '·', title: 'Widths scale too; overdrives, gain and swing do not change (rO ÷ α, gm × α)', tex: `\\left(\\tfrac{W}{L}\\right)_{1,2} = 4\\times ${texNum(p6.m1.wl)} = ${texNum(4 * p6.m1.wl)}`, produces: 'wl', value: 4 * p6.m1.wl },
    ],
    hints: ['Linear scaling only buys speed and silence.', 'What keeps Vov fixed? Scaling W and I together.', 'gm ∝ α, rO ∝ 1/α: gain unchanged, ωu = gm/CL.', 'CL grew 4×.'],
  };
}

// ─── Problem Set 1 (tutoring chat) ─────────────────────────────────────────

function p1(): Problem {
  const r = ps1P1();
  const n = dev(100e-6, B.kpn, 40, B.vthn, B.lambdan);
  const p = dev(100e-6, B.kpp, 25, B.vthp, B.lambdap);
  const v5 = Math.sqrt((2 * 200e-6) / (B.kpn * 20));
  const rout = par(n.ro, p.ro);
  return {
    id: 'bank-ps1p1',
    source: 'Problem Set 1 P1 (tutoring chat)',
    tags: ['L2', 'U11'],
    title: 'PS1 P1: five-transistor OTA, full analysis',
    statement: `${SET_B_TEXT} Five-transistor OTA: ISS = 200 µA, (W/L)1,2 = 40, (W/L)3,4 = 25, (W/L)5 = 20, CL = 2 pF. (a) Gain. (b) Input CM range. (c) Output swing. (d) −3 dB bandwidth. (e) Bandwidth with the output shorted to Vin2.`,
    figure: { kind: 'fiveT', props: { proc: B, iss: 200e-6, wl12: 40, wl34: 25, wlTail: 20, vinCm: 1.1, cl: 2e-12 } },
    givens: [{ sym: 'I_{SS}', value: 200e-6, unit: 'A' }, { sym: '(W/L)_{1,2}', value: 40, unit: '' }, { sym: '(W/L)_{3,4}', value: 25, unit: '' }, { sym: '(W/L)_5', value: 20, unit: '' }, { sym: 'C_L', value: 2e-12, unit: 'F' }],
    unknowns: [
      { key: 'av', sym: 'A_v', label: '(a) Gain', unit: 'V/V' },
      { key: 'cmMin', sym: 'V_{in,CM,min}', label: '(b) CM floor', unit: 'V' },
      { key: 'cmMax', sym: 'V_{in,CM,max}', label: '(b) CM ceiling', unit: 'V' },
      { key: 'outMin', sym: 'V_{out,min}', label: '(c) Output floor', unit: 'V' },
      { key: 'outMax', sym: 'V_{out,max}', label: '(c) Output ceiling', unit: 'V' },
      { key: 'f3', sym: 'f_{-3dB}', label: '(d) Bandwidth', unit: 'Hz' },
      { key: 'fb', sym: 'f_{buffer}', label: '(e) Buffer bandwidth', unit: 'Hz' },
    ],
    answers: { av: r.av, cmMin: r.vinCmMin, cmMax: r.vinCmMax, outMin: r.voutMin, outMax: r.voutMax, f3: r.f3dB!, fb: r.bufferF3dB! },
    wrong: { f3: [{ mistake: 'forgot2pi', value: 1 / (rout * 2e-12) }], av: [{ mistake: 'roNotHalf', value: n.gm * n.ro }] },
    steps: [
      { tag: 'A', title: 'ID = 100 µA per side', tex: `V_{ov1} = ${texSI(n.vov, 'V')},\\;|V_{ov3}| = ${texSI(p.vov, 'V')},\\;V_{ov5} = ${texSI(v5, 'V')}` },
      { tag: 'D', title: '(a) Av = gm1 (rO2 ‖ rO4)', tex: `A_v = ${texSI(n.gm, 'S')}\\times ${texSI(rout, 'Ω')} = ${texNum(n.gm * rout)}`, produces: 'av', value: n.gm * rout },
      { tag: '✓', title: '(b) Floor Vov5 + VGS1', tex: `${texSI(v5 + n.vgs, 'V')}`, produces: 'cmMin', value: v5 + n.vgs },
      { tag: '✓', title: 'Ceiling VDD − |VGS3| + Vthn', tex: `${texSI(1.8 - p.vgs + 0.4, 'V')}`, produces: 'cmMax', value: 1.8 - p.vgs + 0.4 },
      { tag: '✓', title: '(c) Output floor Vov5 + Vov2', tex: `${texSI(v5 + n.vov, 'V')}`, produces: 'outMin', value: v5 + n.vov },
      { tag: '✓', title: 'Output ceiling VDD − |Vov4|', tex: `${texSI(1.8 - p.vov, 'V')}`, produces: 'outMax', value: 1.8 - p.vov },
      { tag: '·', title: '(d) f−3dB = 1/(2π Rout CL)', tex: `${texSI(1 / (2 * Math.PI * rout * 2e-12), 'Hz')}`, produces: 'f3', value: 1 / (2 * Math.PI * rout * 2e-12) },
      { tag: '·', title: '(e) Buffer: Rout → 1/gm, f = gm/(2π CL)', tex: `${texSI(n.gm / (2 * Math.PI * 2e-12), 'Hz')}`, produces: 'fb', value: n.gm / (2 * Math.PI * 2e-12) },
    ],
    hints: ['Same five lines as your exam, forwards this time.', 'Gain gm1(rO2 ‖ rO4); fences for the ranges; 1/(2πRC) for bandwidth.', 'Buffer bandwidth ≈ gm/(2πCL).', `Vov1 = ${n.vov.toFixed(3)} V.`],
  };
}

function p2(): Problem {
  const r = ps1P2();
  const p1r = ps1P1();
  const eps = 1 / (1 + 0.2 * p1r.av);
  const tau = 1 / (0.2 * p1r.omegaU!);
  return {
    id: 'bank-ps1p2',
    source: 'Problem Set 1 P2 (tutoring chat)',
    tags: ['L1'],
    title: 'PS1 P2: gain error and settling of the P1 op amp',
    statement: 'The op amp of P1 is used in a non-inverting amplifier with closed-loop gain 5. (a) Static gain error. (b) Open-loop gain needed for 0.5% error. (c) With CL = 2 pF, the time to settle within 0.1%.',
    figure: { kind: 'nonInverting', props: { r1: 4e3, r2: 1e3, a: p1r.av, cl: 2e-12 } },
    givens: [{ sym: 'A_{closed}', value: 5, unit: '' }, { sym: 'A', value: p1r.av, unit: 'V/V' }],
    unknowns: [
      { key: 'eps', sym: '\\varepsilon', label: '(a) Gain error (fraction)', unit: '' },
      { key: 'amin', sym: 'A_{min}', label: '(b) Open-loop gain for 0.5%', unit: '' },
      { key: 'tau', sym: '\\tau', label: '(c) Time constant', unit: 's' },
      { key: 't', sym: 't_{0.1\\%}', label: '(c) Settling time', unit: 's' },
    ],
    answers: { eps: r.eps, amin: r.aMin, tau: r.tau, t: r.t },
    wrong: { t: [{ mistake: 'lnValues', value: r.tau * Math.log(100) }] },
    steps: [
      { tag: '·', title: '(a) β = 1/5; ε = 1/(1 + βA)', tex: `\\varepsilon = \\frac{1}{1 + 0.2\\times ${texNum(p1r.av, 3)}} = ${texNum(eps, 3)}`, produces: 'eps', value: eps },
      { tag: '·', title: '(b) A ≥ Aclosed/ε', tex: `A \\ge \\frac{5}{0.005} = ${texNum(5 / 0.005)}`, produces: 'amin', value: 5 / 0.005 },
      { tag: '·', title: '(c) τ = 1/(β ωu), ωu = gm1/CL', tex: `\\tau = ${texSI(tau, 's')}`, produces: 'tau', value: tau },
      { tag: '·', title: '0.1% needs ln(1000) = 6.91 τ', tex: `t = 6.91\\tau = ${texSI(tau * Math.log(1000), 's')}`, produces: 't', value: tau * Math.log(1000) },
    ],
    hints: ['β = 1/Aclosed.', 'ε = 1/(1 + βA); A ≥ Aclosed/ε.', 'τ = Aclosed/ωu; t = τ·ln(1/ε).', 'ωu = gm1/CL from P1.'],
  };
}

function p3(): Problem {
  const r = ps1P3();
  const n = dev(0.5e-3, A.kpn, 100, A.vthn, A.lambdan);
  const p = dev(0.5e-3, A.kpp, 200, A.vthp, A.lambdap);
  const av = n.gm * par(n.gm * n.ro * n.ro, p.gm * p.ro * p.ro);
  const swing = 2 * (A.vdd - 2 * p.vov - (0.4 + 2 * n.vov));
  return {
    id: 'bank-ps1p3',
    source: 'Problem Set 1 P3 (tutoring chat)',
    tags: ['L2'],
    title: 'PS1 P3: telescopic gain, swing and bias',
    statement: `${SET_A_TEXT} Fully differential telescopic: (W/L)1–4 = 50/0.5, (W/L)5–8 = 100/0.5, ISS = 1 mA, VISS = 0.4 V. (a) Gain. (b) Maximum differential swing. (c) Vin,CM, Vb1 and Vb2 for that swing.`,
    figure: { kind: 'telescopic', props: { proc: A, iss: 1e-3, wlN: 100, wlP: 200, wl9: (2 * 1e-3) / (A.kpn * 0.16), vinCm: r.bias.vinCm, vb1: r.bias.vb1, vb2: r.bias.vb2, vout: 1.5 } },
    givens: [...setAGivens, { sym: '(W/L)_{1-4}', value: 100, unit: '' }, { sym: '(W/L)_{5-8}', value: 200, unit: '' }, { sym: 'V_{ISS}', value: 0.4, unit: 'V' }],
    unknowns: [
      { key: 'av', sym: 'A_v', label: '(a) Gain', unit: 'V/V' },
      { key: 'swing', sym: 'V_{pp,diff}', label: '(b) Differential swing', unit: 'V' },
      { key: 'vinCm', sym: 'V_{in,CM}', label: '(c) Input CM', unit: 'V' },
      { key: 'vb1', sym: 'V_{b1}', label: '(c) Vb1', unit: 'V' },
      { key: 'vb2', sym: 'V_{b2}', label: '(c) Vb2', unit: 'V' },
    ],
    answers: { av: r.av, swing: r.diffSwing, vinCm: r.bias.vinCm, vb1: r.bias.vb1, vb2: r.bias.vb2 },
    wrong: { swing: [{ mistake: 'signFlip', value: swing / 2 }] },
    steps: [
      { tag: 'D', title: '(a) gm1 (gm3 rO3 rO1 ‖ gm5 rO5 rO7)', tex: `A_v = ${texNum(av)}`, produces: 'av', value: av },
      { tag: '✓', title: '(b) 2 × [VDD − 2|Vov,P| − (VISS + 2Vov,N)]', tex: `${texSI(swing, 'V')}`, produces: 'swing', value: swing },
      { tag: 'A', title: '(c) Vin,CM = VISS + VGS1', tex: `${texSI(0.4 + n.vgs, 'V', 4)}`, produces: 'vinCm', value: 0.4 + n.vgs },
      { tag: 'A', title: 'Vb1 = Vin,CM − Vth + VGS3', tex: `${texSI(0.4 + n.vgs - A.vthn + n.vgs, 'V', 4)}`, produces: 'vb1', value: 0.4 + n.vgs - A.vthn + n.vgs },
      { tag: 'A', title: 'Vb2 = VDD − |Vov7| − |VGS5|', tex: `${texSI(A.vdd - p.vov - p.vgs, 'V', 4)}`, produces: 'vb2', value: A.vdd - p.vov - p.vgs },
    ],
    hints: ['Ex 9.7 in reverse: sizes given, find the performance.', 'Swing = 2 × (ceiling − floor).', 'Full-swing bias sits every device at its edge.', `Vov,N = ${n.vov.toFixed(3)} V, |Vov,P| = ${p.vov.toFixed(3)} V.`],
    flags: [ANTI_SEDRA],
  };
}

function p4(): Problem {
  const r = ps1P4();
  const p3r = ps1P3();
  return {
    id: 'bank-ps1p4',
    source: 'Problem Set 1 P4 (tutoring chat)',
    tags: ['L2'],
    title: 'PS1 P4: raising the input CM costs swing',
    statement: 'Continue P3. (a) With Vb1 fixed at the P3 value, why can the input CM not rise at all? (b) The system needs Vin,CM = 1.6 V: how much must Vb1 rise, and what does it cost in differential swing?',
    figure: { kind: 'telescopic', props: { proc: A, iss: 1e-3, wlN: 100, wlP: 200, wl9: (2 * 1e-3) / (A.kpn * 0.16), vinCm: p3r.bias.vinCm, vb1: p3r.bias.vb1, vb2: p3r.bias.vb2, vout: 1.5 } },
    givens: [{ sym: 'V_{in,CM,new}', value: 1.6, unit: 'V' }],
    unknowns: [
      { key: 'vx', sym: 'V_X', label: '(a) VX (= Vin,CM − Vth)', unit: 'V' },
      { key: 'dvb1', sym: '\\Delta V_{b1}', label: '(b) Rise in Vb1', unit: 'V' },
      { key: 'dswing', sym: '\\Delta V_{pp,diff}', label: '(b) Change in differential swing', unit: 'V' },
    ],
    answers: { vx: r.vx, dvb1: r.dVb1, dswing: r.dSwing },
    wrong: { dswing: [{ mistake: 'signFlip', value: -r.dSwing }] },
    steps: [
      { tag: '✓', title: '(a) X = Vb1 − VGS3 sits exactly at Vin,CM − Vth: M1 is at its edge, any rise of its gate pushes it into triode', tex: `V_X = ${texSI(p3r.bias.vb1 - p3r.n.vgs, 'V', 4)}`, produces: 'vx', value: p3r.bias.vb1 - p3r.n.vgs },
      { tag: 'A', title: '(b) X must rise with the input: Vb1 rises by the same amount', tex: `\\Delta V_{b1} = 1.6 - ${texNum(p3r.bias.vinCm, 4)} = ${texSI(1.6 - p3r.bias.vinCm, 'V', 4)}`, produces: 'dvb1', value: 1.6 - p3r.bias.vinCm },
      { tag: '✓', title: 'The output floor rises by the same amount on each side: the differential swing loses twice that', tex: `\\Delta V_{pp,diff} = -2\\times ${texNum(1.6 - p3r.bias.vinCm, 3)} = ${texSI(-2 * (1.6 - p3r.bias.vinCm), 'V')}`, produces: 'dswing', value: -2 * (1.6 - p3r.bias.vinCm) },
    ],
    hints: ['In a telescopic, the input CM and the output floor are tied through X.', 'X = Vb1 − VGS3 must stay ≥ Vin,CM − Vth.', 'ΔVb1 = ΔVin,CM; each output floor rises by ΔVb1.', 'The differential swing loses 2ΔVb1.'],
  };
}

function p5(): Problem {
  const r = ps1P5();
  return {
    id: 'bank-ps1p5',
    source: 'Problem Set 1 P5 (tutoring chat)',
    tags: ['L2'],
    title: 'PS1 P5: mirror-loaded telescopic and its buffer window',
    statement: `${SET_A_TEXT} Single-ended telescopic with a diode cascode mirror: (W/L)1–8 = 100/0.5, ISS = 1 mA, Vb1 = 1.6 V. (a) VX. (b) Output range and swing. (c) Why is Vout,max not VDD − |Vov8| − |Vov6|? (d) With M2’s gate on Vout (buffer), the allowed output range.`,
    figure: { kind: 'mirrorTele', props: { proc: A, iss: 1e-3, wlN: 200, wlP: 200, vinCm: 1.2, vb1: 1.6, vout: 1.2, bias: 'diodes' } },
    givens: [...setAGivens, { sym: '(W/L)_{1-8}', value: 200, unit: '' }, { sym: 'V_{b1}', value: 1.6, unit: 'V' }],
    unknowns: [
      { key: 'vx', sym: 'V_X', label: '(a) VX', unit: 'V' },
      { key: 'min', sym: 'V_{out,min}', label: '(b) Lowest output', unit: 'V' },
      { key: 'max', sym: 'V_{out,max}', label: '(b) Highest output', unit: 'V' },
      { key: 'bufMax', sym: 'V_{out,max,buffer}', label: '(d) Highest output as a buffer', unit: 'V' },
    ],
    answers: { vx: r.vx, min: r.voutMin, max: r.voutMax, bufMax: r.buffer.upper },
    wrong: { max: [{ mistake: 'diodeThreshold', value: r.voutMax + A.vthp }] },
    steps: [
      { tag: 'A', title: '(a) X = Vb1 − VGS3', tex: `V_X = ${texSI(r.vx, 'V', 4)}`, produces: 'vx', value: r.vx },
      { tag: '✓', title: '(b) Floor: M4 fence, Vout ≥ Vb1 − Vth', tex: `${texSI(1.6 - A.vthn, 'V')}`, produces: 'min', value: 1.6 - A.vthn },
      { tag: '✓', title: 'Ceiling: the diode stack pins M6’s gate a full |Vthp| lower (c)', tex: `V_{out,max} = V_{DD} - |V_{thp}| - |V_{ov8}| - |V_{ov6}| = ${texSI(r.voutMax, 'V', 4)}`, produces: 'max', value: r.voutMax },
      { tag: '✓', title: '(d) Buffer: M2’s fence caps it at Vb1 − VGS4 + Vth (window Vth − Vov4)', tex: `${texSI(r.buffer.upper, 'V', 4)}`, produces: 'bufMax', value: r.buffer.upper },
    ],
    hints: ['Walk the NMOS side from Vb1, the PMOS side from VDD through the diodes.', 'The diode connection costs a threshold.', 'Buffer window: [Vb1 − Vth4, Vb1 − VGS4 + Vth2].', `VX = ${r.vx.toFixed(3)} V.`],
    flags: [ANTI_SEDRA, 'Double-check finding (inventory flag 11): with these PMOS sizes the diode stack puts M3’s drain at 0.678 V, below X = 0.707 V, so M3 is actually in triode. The key’s numbers assume every device saturated; the PMOS would need W/L ≥ 417. The figure shows M3 red. This is the trap Tutorial 2 Q2(a) asks about.'],
  };
}

function p6(): Problem {
  const r = ps1P6();
  const vov = (3 - 1) / 4;
  return {
    id: 'bank-ps1p6',
    source: 'Problem Set 1 P6 (tutoring chat)',
    tags: ['L4'],
    title: 'PS1 P6: design a folded cascode (2.0 V swing, 4.5 mW)',
    statement: `${SET_A_TEXT} Design the PMOS-input folded cascode for a maximum differential swing of 2.0 V and 4.5 mW total, all L = 0.5 µm, CL = 2 pF. (a) ISS and I. (b) The four swing-critical overdrives and W/L of M3–M10. (c) With |Vov1,2| = 0.3 V, (W/L)1,2. (d) Gain. (e) ωu.`,
    figure: { kind: 'folded', props: { proc: A, iss: 0.75e-3, i: 0.375e-3, wl1: r.m1.wl, wl3: r.m3.wl, wl5: r.m5.wl, wl7: r.m7.wl, wl9: r.m9.wl, wl11: (2 * 0.75e-3) / (A.kpp * 0.16), vinCm: 0.6, vout: 1.5 } },
    givens: [...setAGivens, { sym: 'P', value: 4.5e-3, unit: '' }, { sym: 'V_{pp,diff}', value: 2, unit: 'V' }, { sym: 'C_L', value: 2e-12, unit: 'F' }],
    unknowns: [
      { key: 'iss', sym: 'I_{SS}', label: '(a) Tail current', unit: 'A' },
      { key: 'vov', sym: 'V_{ov}', label: '(b) Swing-critical overdrive', unit: 'V' },
      { key: 'wl3', sym: '(W/L)_{3,4}', label: '(b) NMOS cascodes', unit: '' },
      { key: 'wl5', sym: '(W/L)_{5,6}', label: '(b) NMOS sources', unit: '' },
      { key: 'wl7', sym: '(W/L)_{7-10}', label: '(b) PMOS cascodes and sources', unit: '' },
      { key: 'wl1', sym: '(W/L)_{1,2}', label: '(c) Input pair', unit: '' },
      { key: 'av', sym: 'A_v', label: '(d) Gain', unit: 'V/V' },
      { key: 'wu', sym: '\\omega_u', label: '(e) Unity-gain bandwidth', unit: 'rad/s' },
    ],
    answers: { iss: 0.75e-3, vov: vov, wl3: r.m3.wl, wl5: r.m5.wl, wl7: r.m7.wl, wl1: r.m1.wl, av: r.av, wu: r.omegaU! },
    wrong: { wl5: [{ mistake: 'issNotHalf', value: r.m3.wl }] },
    steps: [
      { tag: 'A', title: '(a) 4.5 mW / 3 V = 1.5 mA: half to the pair, half to the two cascode branches', tex: 'I_{SS} = 0.75\\,\\mathrm{mA},\\; I = 0.375\\,\\mathrm{mA},\\; I_{D5,6} = I_{SS}/2 + I = 0.75\\,\\mathrm{mA}', produces: 'iss', value: 1.5e-3 / 2 },
      { tag: 'A', title: '(b) Each output swings 1 V; four overdrives share 3 − 1 = 2 V', tex: `V_{ov} = ${texSI(vov, 'V')}`, produces: 'vov', value: vov },
      { tag: 'A', title: 'NMOS cascodes carry I', tex: `\\left(\\tfrac{W}{L}\\right)_{3,4} = \\frac{2(0.375\\mathrm{m})}{134.28\\mu(0.5)^2} = ${texNum((2 * 0.375e-3) / (A.kpn * 0.25))}`, produces: 'wl3', value: (2 * 0.375e-3) / (A.kpn * 0.25) },
      { tag: 'A', title: 'NMOS sources carry ISS/2 + I = 0.75 mA', tex: `\\left(\\tfrac{W}{L}\\right)_{5,6} = ${texNum((2 * 0.75e-3) / (A.kpn * 0.25))}`, produces: 'wl5', value: (2 * 0.75e-3) / (A.kpn * 0.25) },
      { tag: 'A', title: 'PMOS carry I', tex: `\\left(\\tfrac{W}{L}\\right)_{7-10} = ${texNum((2 * 0.375e-3) / (A.kpp * 0.25))}`, produces: 'wl7', value: (2 * 0.375e-3) / (A.kpp * 0.25) },
      { tag: 'A', title: '(c) Input pair at 0.375 mA, |Vov| = 0.3 V', tex: `\\left(\\tfrac{W}{L}\\right)_{1,2} = ${texNum((2 * 0.375e-3) / (A.kpp * 0.09))}`, produces: 'wl1', value: (2 * 0.375e-3) / (A.kpp * 0.09) },
      { tag: 'D', title: '(d) gm1 (Rup ‖ Rdown)', tex: `A_v \\approx ${texNum(r.av)}`, produces: 'av', value: r.av },
      { tag: '·', title: '(e) ωu = gm1/CL', tex: `\\omega_u = \\frac{2(0.375\\mathrm{m})/0.3}{2\\,\\mathrm{pF}} = ${texSI((2 * 0.375e-3) / 0.3 / 2e-12, 'rad/s')}`, produces: 'wu', value: (2 * 0.375e-3) / 0.3 / 2e-12 },
    ],
    hints: ['Power → currents; swing → overdrives; then sizes.', 'Folded: the input pair is not in the output stack, so only four overdrives.', 'ID5,6 = ISS/2 + I.', 'ISS = 0.75 mA.'],
    flags: [ANTI_SEDRA],
  };
}

function p7(): Problem {
  const r = ps1P6();
  return {
    id: 'bank-ps1p7',
    source: 'Problem Set 1 P7 (tutoring chat)',
    tags: ['L4'],
    title: 'PS1 P7: how much of M1’s current reaches the output?',
    statement: 'In the P6 design you assumed Gm = gm1. At the folding node the signal current splits between the cascode source (≈ 1/gm3 ‖ rO3) and rO1 ‖ rO5. What fraction reaches the output, and what is the corrected gain?',
    figure: { kind: 'folded', props: { proc: A, iss: 0.75e-3, i: 0.375e-3, wl1: r.m1.wl, wl3: r.m3.wl, wl5: r.m5.wl, wl7: r.m7.wl, wl9: r.m9.wl, wl11: (2 * 0.75e-3) / (A.kpp * 0.16), vinCm: 0.6, vout: 1.5 } },
    givens: [],
    unknowns: [
      { key: 'frac', sym: '\\text{fraction}', label: 'Fraction reaching the output', unit: '' },
      { key: 'av', sym: 'A_v', label: 'Corrected gain', unit: 'V/V' },
    ],
    answers: { frac: r.fraction, av: r.avExact },
    wrong: { av: [{ mistake: 'forgotDegeneration', value: r.av }] },
    steps: [
      { tag: 'C', title: 'Current divider at X: the easy path is the cascode source', tex: `\\text{fraction} = \\frac{r_{O1}\\parallel r_{O5}}{(\\tfrac{1}{g_{m3}}\\parallel r_{O3}) + (r_{O1}\\parallel r_{O5})} = ${texNum(r.fraction, 4)}`, produces: 'frac', value: r.fraction },
      { tag: 'D', title: 'Scale the gain', tex: `A_v = ${texNum(r.av)} \\times ${texNum(r.fraction, 3)} = ${texNum(r.av * r.fraction)}`, produces: 'av', value: r.av * r.fraction },
    ],
    hints: ['The cascode source is the easy path.', 'Current divider: each branch gets the share set by the other resistance.', 'fraction = (rO1 ‖ rO5)/[(1/gm3 ‖ rO3) + (rO1 ‖ rO5)].', 'About 91%.'],
  };
}

function p8(): Problem {
  const r = ps1P6();
  const cmMin = 0.5 - A.vthp;
  const cmMax = A.vdd - 0.4 - (A.vthp + 0.3);
  return {
    id: 'bank-ps1p8',
    source: 'Problem Set 1 P8 (tutoring chat)',
    tags: ['L4'],
    title: 'PS1 P8: folded cascode CM ranges (input = output CM is possible)',
    statement: 'For the P6 design with the tail M11 needing 0.4 V: (a) the input CM range; (b) the output range, and a CM level that works for both input and output.',
    figure: { kind: 'folded', props: { proc: A, iss: 0.75e-3, i: 0.375e-3, wl1: r.m1.wl, wl3: r.m3.wl, wl5: r.m5.wl, wl7: r.m7.wl, wl9: r.m9.wl, wl11: (2 * 0.75e-3) / (A.kpp * 0.16), vinCm: 1.5, vout: 1.5 } },
    givens: [{ sym: 'V_{ISS}', value: 0.4, unit: 'V' }],
    unknowns: [
      { key: 'cmMin', sym: 'V_{in,CM,min}', label: '(a) Input CM floor', unit: 'V' },
      { key: 'cmMax', sym: 'V_{in,CM,max}', label: '(a) Input CM ceiling', unit: 'V' },
      { key: 'outMin', sym: 'V_{out,min}', label: '(b) Output floor', unit: 'V' },
      { key: 'outMax', sym: 'V_{out,max}', label: '(b) Output ceiling', unit: 'V' },
    ],
    answers: { cmMin: r.vinCmMin, cmMax: r.vinCmMax!, outMin: r.voutMin, outMax: r.voutMax },
    wrong: {},
    steps: [
      { tag: '✓', title: '(a) Floor: M1 fence (PMOS VD ≤ VG + |Vth|) against X = Vov5 = 0.5 V', tex: `V_{in,CM} \\ge 0.5 - 0.8 = ${texSI(cmMin, 'V')}`, produces: 'cmMin', value: cmMin },
      { tag: '✓', title: 'Ceiling: the tail needs 0.4 V below VDD, then M1 needs |VGS1| = 1.1 V', tex: `V_{in,CM} \\le 3 - 0.4 - 1.1 = ${texSI(cmMax, 'V')}`, produces: 'cmMax', value: cmMax },
      { tag: '✓', title: '(b) Output: two NMOS overdrives up, two PMOS down', tex: `V_{out} \\ge 0.5 + 0.5 = ${texSI(1, 'V')}`, produces: 'outMin', value: 0.5 + 0.5 },
      { tag: '✓', title: 'Ceiling', tex: `V_{out} \\le 3 - 0.5 - 0.5 = ${texSI(2, 'V')}\\;\\Rightarrow\\;\\text{choose } V_{CM} = 1.5\\,\\mathrm{V}`, produces: 'outMax', value: 3 - 0.5 - 0.5 },
    ],
    hints: ['Folding flips the inequality.', 'PMOS fence: VD ≤ VG + |Vth|.', 'The input range and the output range overlap from 1.0 to 1.5 V.', 'X sits at Vov5 = 0.5 V.'],
  };
}

function p10(): Problem {
  const r = ps1P10();
  const wu = Math.log(1000) / (1 * 20e-9);
  return {
    id: 'bank-ps1p10',
    source: 'Problem Set 1 P10 (tutoring chat)',
    tags: ['L4', 'L3'],
    title: 'PS1 P10: capstone, design for settling and swing',
    statement: `${SET_B_TEXT} Design a fully differential op amp: gain ≥ 500, differential swing ≥ 1.2 Vpp, CL = 2 pF, settle to 0.1% in 20 ns in unity-gain feedback, input CM = output CM. (a) Topology. (b) Required gm1,2. (c) Overdrive of the four swing-critical devices. (d) Currents, gain, power.`,
    givens: [{ sym: 'C_L', value: 2e-12, unit: 'F' }, { sym: 't_s', value: 20e-9, unit: 's' }, { sym: 'V_{pp,diff}', value: 1.2, unit: 'V' }],
    unknowns: [
      { key: 'topo', sym: '\\text{topology}', label: '(a) Topology', unit: '', choices: ['Telescopic cascode', 'Folded cascode'] },
      { key: 'gm', sym: 'g_{m,req}', label: '(b) Required gm1,2', unit: 'S' },
      { key: 'vov', sym: 'V_{ov}', label: '(c) Swing-critical overdrive', unit: 'V' },
      { key: 'power', sym: 'P', label: '(d) Power (W)', unit: '' },
    ],
    answers: { topo: 1, gm: r.gmReq, vov: r.vovEach, power: r.power },
    wrong: { topo: [{ mistake: 'forgotSatCheck', value: 0 }] },
    steps: [
      { tag: '·', title: '(a) Unity-gain feedback with input CM = output CM: the telescopic is trapped in a Vth − Vov window. Fold', tex: '\\text{folded cascode}', produces: 'topo', value: 1 },
      { tag: '·', title: '(b) β = 1: τ = 1/ωu; 0.1% in 20 ns needs 6.91τ ≤ 20 ns', tex: `g_m \\ge \\omega_u C_L = \\frac{6.91}{20\\,\\mathrm{ns}}\\times 2\\,\\mathrm{pF} = ${texSI(wu * 2e-12, 'S')}`, produces: 'gm', value: wu * 2e-12 },
      { tag: 'A', title: '(c) Each output swings 0.6 V; four overdrives share 1.8 − 0.6 = 1.2 V', tex: `V_{ov} = ${texSI((1.8 - 0.6) / 4, 'V')}`, produces: 'vov', value: (1.8 - 0.6) / 4 },
      { tag: 'D', title: '(d) ISS = 200 µA, I = 100 µA; gain ≈ 2300 ≫ 500', tex: `P = 1.8 \\times (200\\mu + 2\\times 100\\mu) = ${texNum(1.8 * 400e-6 * 1e3, 3)}\\,\\mathrm{mW}`, produces: 'power', value: 1.8 * (200e-6 + 2 * 100e-6) },
    ],
    hints: ['Which topology can have input CM = output CM in unity gain?', 'τ = 1/(β·ωu) with β = 1.', 'gm = ωu·CL; four overdrives from the swing.', 'ln(1000) = 6.91.'],
  };
}

// ─── Quiz 1 Parts A and B (same problem as the exam, other numbers) ────────

function quiz1(part: 'A' | 'B', d: OtaCmDesign): Problem {
  const { design, ota } = fiveTOtaQuiz(d);
  const id = d.iRef / 2;
  const vov5 = Math.sqrt((2 * d.iRef) / (B.kpn * d.wlTail));
  const vov1 = d.vinCmMin - vov5 - B.vthn;
  const vov3 = B.vdd - d.vinCmMax + B.vthn - B.vthp;
  const wl1 = (2 * id) / (B.kpn * vov1 * vov1);
  const wl3 = (2 * id) / (B.kpp * vov3 * vov3);
  const gm1 = (2 * id) / vov1;
  const rout = par(1 / (B.lambdan * id), 1 / (B.lambdap * id));
  return {
    id: `bank-quiz1${part.toLowerCase()}`,
    source: `Quiz 1 Part ${part}`,
    tags: ['U11', 'L2'],
    title: `Quiz 1 Part ${part}: five-transistor OTA`,
    statement: `Same circuit as your exam. I1 = ${(d.iRef * 1e6).toFixed(0)} µA, (W/L)5,6 = ${d.wlTail}, Vin,CM,min = ${d.vinCmMin} V, Vin,CM,max = ${d.vinCmMax} V, CL = ${(d.cl * 1e12).toFixed(0)} pF. ${SET_B_TEXT} Find the sizes of M1 and M3, the gain, the output swing, the bandwidth and the buffer bandwidth.`,
    figure: { kind: 'fiveT', props: { proc: B, iss: d.iRef, wl12: design.wl12, wl34: design.wl34, wlTail: d.wlTail, vinCm: (d.vinCmMin + d.vinCmMax) / 2, bias: true, cl: d.cl } },
    givens: [{ sym: 'I_1', value: d.iRef, unit: 'A' }, { sym: '(W/L)_{5,6}', value: d.wlTail, unit: '' }, { sym: 'V_{in,CM,min}', value: d.vinCmMin, unit: 'V' }, { sym: 'V_{in,CM,max}', value: d.vinCmMax, unit: 'V' }, { sym: 'C_L', value: d.cl, unit: 'F' }],
    unknowns: [
      { key: 'wl1', sym: '(W/L)_1', label: 'Size of M1, M2', unit: '' },
      { key: 'wl3', sym: '(W/L)_3', label: 'Size of M3, M4', unit: '' },
      { key: 'av', sym: 'A_v', label: 'Gain', unit: 'V/V' },
      { key: 'swing', sym: 'V_{swing}', label: 'Output swing', unit: 'V' },
      { key: 'f3', sym: 'f_{-3dB}', label: 'Bandwidth', unit: 'Hz' },
      { key: 'fb', sym: 'f_{buffer}', label: 'Buffer bandwidth', unit: 'Hz' },
    ],
    answers: { wl1: design.wl12, wl3: design.wl34, av: ota.av, swing: ota.swing, f3: ota.f3dB!, fb: ota.bufferF3dB! },
    wrong: { f3: [{ mistake: 'forgot2pi', value: ota.omegaP! }] },
    steps: [
      { tag: 'A', title: 'Tail overdrive, then the floor gives Vov1', tex: `V_{ov5} = ${texSI(vov5, 'V')},\\;V_{ov1} = ${texSI(vov1, 'V')},\\;\\left(\\tfrac{W}{L}\\right)_1 = ${texNum(wl1, 4)}`, produces: 'wl1', value: wl1 },
      { tag: 'A', title: 'The ceiling gives |Vov3|', tex: `|V_{ov3}| = ${texSI(vov3, 'V')},\\;\\left(\\tfrac{W}{L}\\right)_3 = ${texNum(wl3, 4)}`, produces: 'wl3', value: wl3 },
      { tag: 'D', title: 'Gain', tex: `A_v = g_{m1}(r_{O2}\\parallel r_{O4}) = ${texNum(gm1 * rout)}`, produces: 'av', value: gm1 * rout },
      { tag: '✓', title: 'Swing: (VDD − |Vov4|) − (Vov5 + Vov2)', tex: `${texSI(B.vdd - vov3 - (vov5 + vov1), 'V')}`, produces: 'swing', value: B.vdd - vov3 - (vov5 + vov1) },
      { tag: '·', title: 'Bandwidth', tex: `f_{-3dB} = \\frac{1}{2\\pi R_{out} C_L} = ${texSI(1 / (2 * Math.PI * rout * d.cl), 'Hz')}`, produces: 'f3', value: 1 / (2 * Math.PI * rout * d.cl) },
      { tag: '·', title: 'Buffer', tex: `f_{buffer} \\approx \\frac{g_m}{2\\pi C_L} = ${texSI(gm1 / (2 * Math.PI * d.cl), 'Hz')}`, produces: 'fb', value: gm1 / (2 * Math.PI * d.cl) },
    ],
    hints: ['Exactly the exam method.', 'Floor → Vov1; ceiling → |Vov3|.', 'Av = gm1(rO2 ‖ rO4).', `Vov5 = ${(vov5 * 1000).toFixed(0)} mV.`],
  };
}

export const M4_BANK: Problem[] = [
  t2q1(),
  t2q2(),
  t2q3(),
  t3q1(),
  t3q2(),
  t3q3(),
  ex91p(),
  ex92p(),
  ex97p(),
  ex98p(),
  p1(),
  p2(),
  p3(),
  p4(),
  p5(),
  p6(),
  p7(),
  p8(),
  p10(),
  quiz1('A', QUIZ1_A),
  quiz1('B', QUIZ1_B),
];
