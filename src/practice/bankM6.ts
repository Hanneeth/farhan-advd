/**
 * Fixed bank for L10–L14 (your Lec 13–17 notes and Razavi §9.11–9.12, Ch 10):
 * Razavi Problems 10.1–10.4 and Example 10.6, the Lec 16 phase-margin numbers, the PSRR and noise of
 * your exam OTA, and Problem Set 2 (L9–L14), written at tutorial level with every step shown.
 * Razavi problems are restated in plain words, not copied.
 */
import {
  a0ForPhaseMargin,
  ccForPhaseMargin,
  dominantPoleHand,
  gainCrossover,
  inputNoiseFolded,
  inputNoisePair,
  millerTwoStage,
  nvPerRtHz,
  peakingFactor,
  phaseMargin,
  pmFromPeaking,
  psrr5T,
  psrrDb,
  replicaCmfbOutputCm,
  twoStageSlewRate,
  K_BOLTZMANN,
  SET_B,
} from '../physics';
import type { Problem } from './schema';
import { texNum, texSI } from './tex';

const deg = (r: number) => (r * 180) / Math.PI;
const rad = (d: number) => (d * Math.PI) / 180;
const OURS = 'Numbers chosen by the app (the book states this example with symbols only).';

function r10p1(): Problem {
  const r = a0ForPhaseMargin({ poles: [10e6, 500e6], pm: 60, beta: 1 });
  // Hand: tan-addition quadratic in f.
  const t = Math.tan(rad(60));
  const s = 1 / 10e6 + 1 / 500e6;
  const qa = t / (10e6 * 500e6);
  const f = (s + Math.sqrt(s * s + 4 * qa * t)) / (2 * qa);
  const a0 = Math.hypot(1, f / 10e6) * Math.hypot(1, f / 500e6);
  return {
    id: 'bank-r10-1',
    source: 'Razavi Problem 10.1',
    tags: ['L12'],
    title: 'Razavi 10.1: the largest A0 for 60° phase margin',
    statement: 'An amplifier with DC gain A0 has two poles, at 10 MHz and 500 MHz, and is used in unity-gain feedback. What A0 gives a phase margin of exactly 60°?',
    figure: { kind: 'loopBode', props: { spec: { a0: r.a0, poles: [10e6, 500e6], beta: 1 } } },
    givens: [
      { sym: 'f_{p1}', value: 10e6, unit: 'Hz' },
      { sym: 'f_{p2}', value: 500e6, unit: 'Hz' },
      { sym: '\\beta', value: 1, unit: '' },
    ],
    unknowns: [
      { key: 'fgx', sym: 'f_{gx}', label: 'Gain crossover', unit: 'Hz' },
      { key: 'a0', sym: 'A_0', label: 'DC gain for PM = 60°', unit: 'V/V' },
    ],
    answers: { fgx: r.fgx, a0: r.a0 },
    wrong: { a0: [{ mistake: 'wrongPmTan', value: Math.hypot(1, (500e6 * Math.tan(rad(30))) / 10e6) }] },
    steps: [
      { tag: '·', title: 'PM = 60° means the loop phase at ωgx is −120°', tex: `\\tan^{-1}\\frac{f_{gx}}{10\\,\\mathrm{MHz}} + \\tan^{-1}\\frac{f_{gx}}{500\\,\\mathrm{MHz}} = 120^\\circ` },
      { tag: '·', title: 'The first pole gives almost 90°, so the second must give about 30°: fgx a bit above 500·tan 30° = 289 MHz. Exactly:', tex: `f_{gx} = ${texSI(f, 'Hz')}`, produces: 'fgx', value: f },
      { tag: '·', title: 'Make |βA| = 1 there', tex: `A_0 = \\sqrt{1 + (${texNum(f / 10e6)})^2}\\,\\sqrt{1 + (${texNum(f / 500e6)})^2} = ${texNum(a0)}`, produces: 'a0', value: a0 },
      { tag: '✓', title: 'Only about 36: two poles 50× apart leave very little room for gain at 60°' },
    ],
    hints: ['Work back from the phase.', '−120° of loop phase at ωgx.', 'atan(f/10M) + atan(f/500M) = 120°, then A0 = √(1+(f/fp1)²)·√(1+(f/fp2)²).', 'The first pole is ≈ 88° there.'],
  };
}

function r10p2(): Problem {
  const a = a0ForPhaseMargin({ poles: [1e6, 1e6], pm: 60, beta: 1 }).a0;
  const b = a0ForPhaseMargin({ poles: [1e6, 1e6], pm: 60, beta: 0.25 }).a0;
  return {
    id: 'bank-r10-2',
    source: 'Razavi Problem 10.2',
    tags: ['L12'],
    title: 'Razavi 10.2: two equal poles, 60° margin, gain 1 and gain 4',
    statement: 'An amplifier has two poles at the same frequency ωp. What is the largest DC gain A0 for a 60° phase margin when the closed-loop gain is (a) 1 and (b) 4?',
    figure: { kind: 'loopBode', props: { spec: { a0: a, poles: [1e6, 1e6], beta: 1 } } },
    givens: [{ sym: 'f_{p1} = f_{p2}', value: 1e6, unit: 'Hz' }],
    unknowns: [
      { key: 'a', sym: 'A_0(\\beta = 1)', label: '(a) Closed-loop gain 1', unit: 'V/V' },
      { key: 'b', sym: 'A_0(\\beta = 1/4)', label: '(b) Closed-loop gain 4', unit: 'V/V' },
    ],
    answers: { a, b },
    wrong: { b: [{ mistake: 'usedANotBetaA', value: a }] },
    steps: [
      { tag: '·', title: 'Each pole must give 60° at ωgx (together 120°)', tex: `2\\tan^{-1}\\frac{\\omega_{gx}}{\\omega_p} = 120^\\circ \\Rightarrow \\omega_{gx} = \\sqrt{3}\\,\\omega_p` },
      { tag: '·', title: 'There |βA| = βA0/(1 + 3) = 1', tex: `\\beta A_0 = 4` },
      { tag: '·', title: '(a) β = 1', tex: 'A_0 = 4', produces: 'a', value: 4 },
      { tag: '·', title: '(b) β = 1/4: weaker feedback allows four times the gain', tex: 'A_0 = 16', produces: 'b', value: 16 },
    ],
    hints: ['Equal poles share the phase equally.', 'Each gives 60° at ωgx: ωgx = ωp·tan 60°.', '|βA| = βA0/(1 + (ωgx/ωp)²) = βA0/4.', 'βA0 = 4.'],
  };
}

function r10p3(): Problem {
  const pa = phaseMargin({ a0: 1000, poles: [1e6, 2e6], beta: 1 });
  const pb = phaseMargin({ a0: 1000, poles: [1e6, 4e6], beta: 1 });
  const gx = (p2: number) => {
    const a = 1 / (1e12 * p2 * p2);
    const b = 1 / 1e12 + 1 / (p2 * p2);
    return Math.sqrt((-b + Math.sqrt(b * b - 4 * a * (1 - 1e6))) / (2 * a));
  };
  const ha = 180 - deg(Math.atan(gx(2e6) / 1e6)) - deg(Math.atan(gx(2e6) / 2e6));
  const hb = 180 - deg(Math.atan(gx(4e6) / 1e6)) - deg(Math.atan(gx(4e6) / 4e6));
  return {
    id: 'bank-r10-3',
    source: 'Razavi Problem 10.3',
    tags: ['L12'],
    title: 'Razavi 10.3: A0 = 1000 with two close poles',
    statement: 'An amplifier has A0 = 1000 and poles at ωp1 = 1 MHz and ωp2. In unity-gain feedback, what is the phase margin if (a) ωp2 = 2ωp1 and (b) ωp2 = 4ωp1? (Frequencies in Hz here.)',
    figure: { kind: 'loopBode', props: { spec: { a0: 1000, poles: [1e6, 2e6], beta: 1 } } },
    givens: [
      { sym: 'A_0', value: 1000, unit: '' },
      { sym: 'f_{p1}', value: 1e6, unit: 'Hz' },
    ],
    unknowns: [
      { key: 'a', sym: 'PM_{(a)}', label: '(a) fp2 = 2 MHz', unit: '°', tol: 0.02 },
      { key: 'b', sym: 'PM_{(b)}', label: '(b) fp2 = 4 MHz', unit: '°', tol: 0.02 },
    ],
    answers: { a: pa, b: pb },
    wrong: { a: [{ mistake: 'phaseNoInversion', value: 180 - pa }] },
    steps: [
      { tag: '·', title: '|βA| = 1: (1 + f²/fp1²)(1 + f²/fp2²) = 10⁶, a quadratic in f²', tex: `f_{gx,(a)} = ${texSI(gx(2e6), 'Hz')},\\; f_{gx,(b)} = ${texSI(gx(4e6), 'Hz')}` },
      { tag: '·', title: '(a) Both poles are far below ωgx: each gives nearly 90°', tex: `PM = 180^\\circ - ${texNum(deg(Math.atan(gx(2e6) / 1e6)))}^\\circ - ${texNum(deg(Math.atan(gx(2e6) / 2e6)))}^\\circ = ${texSI(ha, '°')}`, produces: 'a', value: ha },
      { tag: '·', title: '(b) Moving fp2 up helps only a little', tex: `PM = ${texSI(hb, '°')}`, produces: 'b', value: hb },
      { tag: '✓', title: 'Almost oscillating: with this much gain the second pole must be far above A0·fp1 = 1 GHz' },
    ],
    hints: ['Where does |βA| reach 1?', 'Solve the quadratic in f².', 'PM = 180° − atan(fgx/fp1) − atan(fgx/fp2).', 'fgx ≈ 44.7 MHz in (a).'],
  };
}

function r10p4(): Problem {
  const pm = pmFromPeaking(1.5);
  return {
    id: 'bank-r10-4',
    source: 'Razavi Problem 10.4',
    tags: ['L12'],
    title: 'Razavi 10.4: 50% peaking → what phase margin?',
    statement: 'A unity-gain feedback amplifier peaks by 50% near the gain crossover. What is its phase margin?',
    figure: { kind: 'closedStep', props: { specs: [{ spec: { a0: a0ForPhaseMargin({ poles: [1e5, 1e8], pm, beta: 1 }).a0, poles: [1e5, 1e8], beta: 1 }, label: `PM ${pm.toFixed(0)}°` }] } },
    givens: [{ sym: '|A_f(\\omega_{gx})|\\beta', value: 1.5, unit: '' }],
    unknowns: [{ key: 'pm', sym: 'PM', label: 'Phase margin', unit: '°', tol: 0.01 }],
    answers: { pm },
    wrong: { pm: [{ mistake: 'phaseNoInversion', value: 180 - pm }] },
    steps: [
      { tag: '·', title: 'At ωgx: |βA| = 1 and ∠βA = PM − 180°, so |1 + βA| = 2 sin(PM/2)', tex: `|A_f(\\omega_{gx})| = \\frac{1}{\\beta}\\cdot\\frac{1}{2\\sin(PM/2)}` },
      { tag: '·', title: 'Set it equal to 1.5/β', tex: `\\sin\\frac{PM}{2} = \\frac{1}{3} \\Rightarrow PM = 2\\sin^{-1}\\frac{1}{3} = ${texSI(2 * deg(Math.asin(1 / 3)), '°')}`, produces: 'pm', value: 2 * deg(Math.asin(1 / 3)) },
      { tag: '✓', title: 'Check with Lec 16: 45° gives 1.3×, 60° gives 1.0×, so 1.5× must be below 45°' },
    ],
    hints: ['Use the Lec 16 calculation backwards.', '|1 + 1∠(PM − 180°)| = 2 sin(PM/2).', 'Peak = 1/(2 sin(PM/2)) = 1.5.', 'sin(PM/2) = 1/3.'],
  };
}

function lec16(): Problem {
  return {
    id: 'bank-lec16',
    source: 'Lecture notes Lec 16',
    tags: ['L12'],
    title: 'Lec 16: how much the closed loop peaks at PM = 5°, 45°, 60°',
    statement: 'Your Lec 16 notes compute |Af(ωgx)| for three phase margins. Using |βA(ωgx)| = 1, find |Af(ωgx)| as a multiple of 1/β for PM = 5°, 45° and 60°.',
    figure: { kind: 'loopBode', props: { spec: { a0: 1000, poles: [1e5, 1e8], beta: 1 } } },
    givens: [{ sym: '|\\beta A(\\omega_{gx})|', value: 1, unit: '' }],
    unknowns: [
      { key: 'a', sym: 'PM = 5^\\circ', label: 'Peak at PM 5°', unit: '' },
      { key: 'b', sym: 'PM = 45^\\circ', label: 'Peak at PM 45°', unit: '' },
      { key: 'c', sym: 'PM = 60^\\circ', label: 'Peak at PM 60°', unit: '' },
    ],
    answers: { a: peakingFactor(5), b: peakingFactor(45), c: peakingFactor(60) },
    wrong: {},
    steps: [
      { tag: '·', title: 'At ωgx, βA = 1·e^{−j(180° − PM)}; PM = 5° → ∠βA = −175°', tex: `|A_f| = \\frac{1}{\\beta}\\left|\\frac{e^{-j175^\\circ}}{1 + e^{-j175^\\circ}}\\right| = \\frac{1}{\\beta}\\cdot\\frac{1}{|0.0038 - j0.0872|} = \\frac{${texNum(1 / Math.hypot(1 + Math.cos(rad(-175)), Math.sin(rad(-175))))}}{\\beta}`, produces: 'a', value: 1 / Math.hypot(1 + Math.cos(rad(-175)), Math.sin(rad(-175))) },
      { tag: '·', title: 'PM = 45° → ∠βA = −135°', tex: `\\frac{1}{|0.293 - j0.707|} = ${texNum(1 / Math.hypot(1 + Math.cos(rad(-135)), Math.sin(rad(-135))))}`, produces: 'b', value: 1 / Math.hypot(1 + Math.cos(rad(-135)), Math.sin(rad(-135))) },
      { tag: '·', title: 'PM = 60° → ∠βA = −120°: exactly no peak', tex: `\\frac{1}{|0.5 - j0.866|} = ${texNum(1 / Math.hypot(1 + Math.cos(rad(-120)), Math.sin(rad(-120))))}`, produces: 'c', value: 1 / Math.hypot(1 + Math.cos(rad(-120)), Math.sin(rad(-120))) },
      { tag: '✓', title: 'Shortcut for all three: 1/(2 sin(PM/2))' },
    ],
    hints: ['Put |βA| = 1 at ωgx.', 'Write βA as cos θ + j sin θ with θ = PM − 180°.', '|Af|β = 1/|1 + βA|.', '5° → about 11.5.'],
  };
}

function ex10p6(): Problem {
  const gm1 = 1e-3, gm9 = 5e-3, cl = 2e-12;
  return {
    id: 'bank-ex10-6',
    source: 'Razavi Example 10.6',
    tags: ['L14'],
    title: 'Razavi Ex 10.6: first estimate of CC for 45°',
    statement: 'A Miller-compensated two-stage op amp has first-stage gm1 = 1 mS, second-stage gm9 = 5 mS and CL = 2 pF. Estimate CC for a 45° phase margin in unity-gain feedback: (a) ignoring the second pole’s effect on the magnitude, (b) including it.',
    figure: { kind: 'twoStageMiller', props: {} },
    givens: [
      { sym: 'g_{m1}', value: gm1, unit: 'S' },
      { sym: 'g_{m9}', value: gm9, unit: 'S' },
      { sym: 'C_L', value: cl, unit: 'F' },
    ],
    unknowns: [
      { key: 'a', sym: 'C_{C,(a)}', label: '(a) CC = (gm1/gm9)·CL', unit: 'F' },
      { key: 'b', sym: 'C_{C,(b)}', label: '(b) including ωp2 in |βA|', unit: 'F' },
    ],
    answers: { a: ccForPhaseMargin({ gm1, gm2: gm9, cl, pm: 45, zeroNulled: true }), b: (gm1 / (Math.SQRT2 * gm9)) * cl },
    wrong: { a: [{ mistake: 'ratioInverted', value: (gm9 / gm1) * cl }] },
    steps: [
      { tag: '·', title: 'After compensation: p1 ≈ 1/(gm9RLCCRS), p2 ≈ gm9/CL. For 45° the loop gain must reach 1 right at p2' },
      { tag: '·', title: 'Loop gain above p1 falls as gm1/(ωCC); set it to 1 at ω = gm9/CL', tex: `C_C = \\frac{g_{m1}}{g_{m9}}C_L = ${texSI((gm1 / gm9) * cl, 'F')}`, produces: 'a', value: (gm1 / gm9) * cl },
      { tag: '·', title: 'At p2 the second pole already cuts |βA| by √2', tex: `C_C = \\frac{g_{m1}}{\\sqrt{2}\\,g_{m9}}C_L = ${texSI((gm1 / (Math.sqrt(2) * gm9)) * cl, 'F')}`, produces: 'b', value: (gm1 / (Math.sqrt(2) * gm9)) * cl },
      { tag: '✓', title: 'A starting point: real designs use a larger CC (60°) and a smaller one if β < 1' },
    ],
    hints: ['GBW = gm1/CC, second pole ≈ gm9/CL.', '45°: put the gain crossover on the second pole.', 'gm1/CC = gm9/CL.', 'CC = 0.4 pF.'],
    flags: [OURS],
  };
}

function examPsrrNoise(): Problem {
  const gm1 = 0.8e-3, ro2 = 1 / (0.05 * 60e-6), ro4 = 1 / (0.1 * 60e-6), gm3 = (2 * 60e-6) / 0.25;
  const p = psrr5T({ gmN: gm1, roP: ro4, roN: ro2 });
  const v2 = inputNoisePair(gm1, gm3);
  const kt8 = 8 * K_BOLTZMANN * 300 * (2 / 3);
  return {
    id: 'bank-exam-psrr',
    source: 'Worked example: your exam OTA (L10)',
    tags: ['L10'],
    title: 'Your exam OTA: PSRR and input noise',
    statement: 'The mid-sem 5-T OTA has gm1 = 0.8 mS, rO2 = 333 kΩ, rO4 = 167 kΩ, |Vov3| = 0.25 V and 60 µA per side. (a) Its low-frequency PSRR in dB. (b) Its input-referred thermal noise (γ = 2/3, T = 300 K).',
    figure: { kind: 'fiveT', props: { proc: SET_B, iss: 120e-6, wl12: 26.67, wl34: 19.2, wlTail: 30, vinCm: 1.1, inspector: false } },
    givens: [
      { sym: 'g_{m1}', value: gm1, unit: 'S' },
      { sym: 'r_{O2}', value: ro2, unit: 'Ω' },
      { sym: 'r_{O4}', value: ro4, unit: 'Ω' },
      { sym: '|V_{ov3}|', value: 0.25, unit: 'V' },
    ],
    unknowns: [
      { key: 'psrr', sym: 'PSRR', label: '(a) PSRR', unit: 'dB', tol: 0.01 },
      { key: 'nv', sym: '\\overline{V_n}', label: '(b) Input noise', unit: 'nV/√Hz' },
    ],
    answers: { psrr: psrrDb(p.psrr), nv: nvPerRtHz(v2) },
    wrong: { psrr: [{ mistake: 'dbConversion', value: 10 * Math.log10(p.psrr) }], nv: [{ mistake: 'noiseOneHalf', value: nvPerRtHz(v2 / 2) }] },
    steps: [
      { tag: 'D', title: 'Signal gain = gm1(rO2 ‖ rO4) = 88.9 (your exam answer)', tex: `A_v = ${texNum(gm1 * ((ro2 * ro4) / (ro2 + ro4)))}` },
      { tag: 'B', title: 'Supply gain ≈ 1: the diode M3 carries X (and the output) along with VDD' },
      { tag: '·', title: '(a) PSRR = Av/1 in dB', tex: `20\\log_{10}${texNum(gm1 * ((ro2 * ro4) / (ro2 + ro4)))} = ${texNum(20 * Math.log10(gm1 * ((ro2 * ro4) / (ro2 + ro4))))}\\,\\mathrm{dB}`, produces: 'psrr', value: 20 * Math.log10(gm1 * ((ro2 * ro4) / (ro2 + ro4))) },
      { tag: 'C', title: 'Load gm: gm3 = 2ID/|Vov3|', tex: `g_{m3} = \\frac{2(60\\,\\mu\\mathrm{A})}{0.25} = ${texSI(gm3, 'S')}` },
      { tag: '·', title: '(b) 8kTγ(1/gm1 + gm3/gm1²), square root', tex: `\\overline{V_n} = \\sqrt{${texNum(kt8)}(1250 + ${texNum(gm3 / gm1 ** 2)})} = ${texSI(Math.sqrt(kt8 * (1 / gm1 + gm3 / gm1 ** 2)) * 1e9, 'nV/√Hz')}`, produces: 'nv', value: Math.sqrt(kt8 * (1 / gm1 + gm3 / gm1 ** 2)) * 1e9 },
    ],
    hints: ['Wiggle VDD: what does the diode do?', 'PSRR ≈ gm1(rO2‖rO4), in dB.', 'Noise: 8kTγ(1/gm1 + gm3/gm1²).', 'gm3 = 0.48 mS.'],
  };
}

/* ─── Problem Set 2 (L9–L14) ─── */

function ps2p1(): Problem {
  const iss = 1e-3, cl = 2e-12;
  return {
    id: 'bank-ps2-p1',
    source: 'Problem Set 2 P1 (L9, Lec 14)',
    tags: ['L9'],
    title: 'PS2 P1: slew rate of a fully differential telescopic op amp',
    statement: 'A fully differential telescopic op amp has ISS = 1 mA; its PMOS current sources each carry ISS/2 = 0.5 mA; each output drives CL = 2 pF. A large input step turns M2 off. Find the slope of each output and of the differential output (Lec 14).',
    figure: { kind: 'step', props: { vstep: 1, tau: 1e-9, eps: 0.01, sr: 250e6 } },
    givens: [
      { sym: 'I_{SS}', value: iss, unit: 'A' },
      { sym: 'C_L', value: cl, unit: 'F' },
    ],
    unknowns: [
      { key: 'se', sym: '|dV_{out1}/dt|', label: 'Each output', unit: 'V/s' },
      { key: 'diff', sym: '|dV_{out,d}/dt|', label: 'Differential output', unit: 'V/s' },
    ],
    answers: { se: iss / (2 * cl), diff: iss / cl },
    wrong: { se: [{ mistake: 'issNotHalf', value: iss / cl }] },
    steps: [
      { tag: '·', title: 'M2 off: M1 pulls ISS from Vout1 while the top source still pushes ISS/2 in: net −ISS/2 into CL', tex: `\\frac{dV_{out1}}{dt} = -\\frac{I_{SS}}{2C_L} = -${texSI(iss / (2 * cl), 'V/s')}`, produces: 'se', value: iss / (2 * cl) },
      { tag: '·', title: 'Vout2: nothing pulls down, the top source pushes ISS/2 in: +ISS/(2CL)' },
      { tag: '·', title: 'The difference moves at twice that', tex: `\\left|\\frac{dV_{out1}}{dt} - \\frac{dV_{out2}}{dt}\\right| = \\frac{I_{SS}}{C_L} = ${texSI(iss / cl, 'V/s')}`, produces: 'diff', value: iss / cl },
    ],
    hints: ['Count the currents into each output node.', 'Top sources give ISS/2 each; the pair gives ISS to one side only.', 'Net ±ISS/2 per side.', 'Differential = ISS/CL.'],
  };
}

function ps2p2(): Problem {
  const a0 = 2000, fp1 = 50e3, fp2 = 50e6;
  const s1 = { a0, poles: [fp1, fp2], beta: 1 };
  const s2 = { a0, poles: [fp1, fp2], beta: 0.2 };
  const gx = (k: number) => {
    const a = 1 / (fp1 * fp1 * fp2 * fp2);
    const b = 1 / (fp1 * fp1) + 1 / (fp2 * fp2);
    return Math.sqrt((-b + Math.sqrt(b * b - 4 * a * (1 - k * k))) / (2 * a));
  };
  const pmH = (k: number) => 180 - deg(Math.atan(gx(k) / fp1)) - deg(Math.atan(gx(k) / fp2));
  return {
    id: 'bank-ps2-p2',
    source: 'Problem Set 2 P2 (L11–L12)',
    tags: ['L12'],
    title: 'PS2 P2: phase margin at gain 1 and at gain 5',
    statement: 'An op amp has A0 = 2000 and poles at 50 kHz and 50 MHz. Find ωgx and the phase margin (a) as a unity-gain buffer and (b) with β = 0.2. (c) How much does the buffer peak at ωgx?',
    figure: { kind: 'loopBode', props: { spec: s1 } },
    givens: [
      { sym: 'A_0', value: a0, unit: '' },
      { sym: 'f_{p1}', value: fp1, unit: 'Hz' },
      { sym: 'f_{p2}', value: fp2, unit: 'Hz' },
    ],
    unknowns: [
      { key: 'gx1', sym: 'f_{gx}(\\beta=1)', label: '(a) ωgx', unit: 'Hz' },
      { key: 'pm1', sym: 'PM(\\beta=1)', label: '(a) PM', unit: '°', tol: 0.01 },
      { key: 'pm2', sym: 'PM(\\beta=0.2)', label: '(b) PM', unit: '°', tol: 0.01 },
      { key: 'pk', sym: '|A_f(\\omega_{gx})|\\beta', label: '(c) Peak of the buffer', unit: '' },
    ],
    answers: { gx1: gainCrossover(s1)!, pm1: phaseMargin(s1), pm2: phaseMargin(s2), pk: peakingFactor(phaseMargin(s1)) },
    wrong: { pm1: [{ mistake: 'phaseNoInversion', value: 180 - phaseMargin(s1) }] },
    steps: [
      { tag: '·', title: '(a) βA0 = 2000; solve (1 + f²/fp1²)(1 + f²/fp2²) = 2000²', tex: `f_{gx} = ${texSI(gx(2000), 'Hz')}`, produces: 'gx1', value: gx(2000) },
      { tag: '·', title: 'PM = 180° − atan(fgx/fp1) − atan(fgx/fp2)', tex: `PM = ${texSI(pmH(2000), '°')}`, produces: 'pm1', value: pmH(2000) },
      { tag: '·', title: '(b) β = 0.2: the gain curve drops by 14 dB, ωgx moves left, the phase there is kinder', tex: `f_{gx} = ${texSI(gx(400), 'Hz')},\\; PM = ${texSI(pmH(400), '°')}`, produces: 'pm2', value: pmH(400) },
      { tag: '✓', title: '(c) 1/(2 sin(PM/2)) for the buffer', tex: `${texNum(1 / (2 * Math.sin(rad(pmH(2000) / 2))))}`, produces: 'pk', value: 1 / (2 * Math.sin(rad(pmH(2000) / 2))) },
    ],
    hints: ['βA0·fp1 = 100 MHz: that is above fp2!', 'Solve the quadratic in f².', 'Lower β = more stable.', 'fgx ≈ 62.5 MHz for the buffer.'],
  };
}

function ps2p3(): Problem {
  const a0 = 1e5, beta = 0.1, fp2 = 1e6, fp3 = 10e6, fp1 = 1e3;
  const before = phaseMargin({ a0, poles: [fp1, fp2, fp3], beta });
  const h = dominantPoleHand({ a0, nondominant: [fp2, fp3], pm: 45, beta });
  return {
    id: 'bank-ps2-p3',
    source: 'Problem Set 2 P3 (L13, Lec 17)',
    tags: ['L13'],
    title: 'PS2 P3: compensate the Lec 17 three-pole amplifier',
    statement: 'The Lec 17 amplifier: A0 = 100 dB, poles at 1 kHz, 1 MHz and 10 MHz, used for a closed-loop gain of 10 (β = 0.1). (a) The phase margin as built. (b) Keeping the 1 MHz and 10 MHz poles, where must the first pole go for PM = 45°? (c) By what factor must its capacitor grow?',
    figure: { kind: 'loopBode', props: { mode: 'notes', spec: { a0, poles: [fp1, fp2, fp3], beta } } },
    givens: [
      { sym: 'A_0', value: a0, unit: '' },
      { sym: 'f_{p1}', value: fp1, unit: 'Hz' },
      { sym: 'f_{p2}', value: fp2, unit: 'Hz' },
      { sym: 'f_{p3}', value: fp3, unit: 'Hz' },
      { sym: '\\beta', value: beta, unit: '' },
    ],
    unknowns: [
      { key: 'pm0', sym: 'PM_{before}', label: '(a) PM as built', unit: '°', tol: 0.02 },
      { key: 'fd', sym: "f'_{p1}", label: '(b) New first pole', unit: 'Hz', tol: 0.03 },
      { key: 'k', sym: 'C_{new}/C_{old}', label: '(c) Capacitor factor', unit: '', tol: 0.03 },
    ],
    answers: { pm0: before, fd: h.fd, k: fp1 / h.fd },
    wrong: { fd: [{ mistake: 'usedANotBetaA', value: h.fgx / a0 }] },
    steps: [
      { tag: '·', title: '(a) βA0 = 10⁴ (80 dB above the 1/β line): find ωgx numerically, then the phase: almost nothing left', tex: `f_{gx} = ${texSI(gainCrossover({ a0, poles: [fp1, fp2, fp3], beta })!, 'Hz')},\\; PM = ${texSI(before, '°')}`, produces: 'pm0', value: before },
      { tag: '·', title: '(b) The two high poles may use only 90° − 45° = 45° at the new ωgx', tex: `\\tan^{-1}\\frac{f}{1\\,\\mathrm{MHz}} + \\tan^{-1}\\frac{f}{10\\,\\mathrm{MHz}} = 45^\\circ \\Rightarrow f_{gx} = ${texSI(h.fgx, 'Hz')}` },
      { tag: '·', title: '−20 dB/dec from βA0 = 10⁴ down to 0 dB at ωgx', tex: `f'_{p1} = \\frac{f_{gx}}{\\beta A_0} = ${texSI(h.fgx / (beta * a0), 'Hz')}`, produces: 'fd', value: h.fgx / (beta * a0) },
      { tag: '✓', title: '(c) The pole is 1/(RC): C grows by the same factor', tex: `k = ${texNum(fp1 / (h.fgx / (beta * a0)))}`, produces: 'k', value: fp1 / (h.fgx / (beta * a0)) },
    ],
    hints: ['Work on the loop gain βA, not A.', 'Where do the 1 MHz and 10 MHz poles give 45° together?', "f'p1 = ωgx/(βA0).", 'The new ωgx is 844 kHz, so the first pole goes to about 84 Hz.'],
  };
}

function ps2p4(): Problem {
  const gm1 = 0.8e-3, r1 = 111e3, c1 = 0.1e-12, gm6 = 4e-3, r2 = 20e3, cl = 4e-12;
  const cc = ccForPhaseMargin({ gm1, gm2: gm6, cl, pm: 60, zeroNulled: true });
  const ccH = (gm1 * cl * Math.tan(rad(60))) / gm6;
  const m = millerTwoStage({ gm1, r1, c1, gm2: gm6, r2, c2: cl, cc });
  const sr = twoStageSlewRate({ iss: 120e-6, cc, i7: 500e-6, cl });
  return {
    id: 'bank-ps2-p4',
    source: 'Problem Set 2 P4 (L13–L14, Lec 17)',
    tags: ['L14'],
    title: 'PS2 P4: add a second stage to your exam OTA and compensate it',
    statement: 'Your exam OTA (Gm1 = 0.8 mS, R1 = 111 kΩ, C1 = 0.1 pF, ISS = 120 µA) drives a PMOS CS stage M6 (Gm2 = 4 mS, R2 = 20 kΩ) biased by I7 = 500 µA, loaded by CL = 4 pF. With Rz = 1/Gm2: (a) CC for PM = 60° (β = 1, ωp2 ≈ Gm2/CL); (b) the GBW; (c) the dominant pole P1′ ≈ 1/(R1A2CC); (d) Rz; (e) the slew rate.',
    figure: { kind: 'twoStageMiller', props: { rz: true } },
    givens: [
      { sym: 'G_{m1}', value: gm1, unit: 'S' },
      { sym: 'R_1', value: r1, unit: 'Ω' },
      { sym: 'G_{m2}', value: gm6, unit: 'S' },
      { sym: 'R_2', value: r2, unit: 'Ω' },
      { sym: 'C_L', value: cl, unit: 'F' },
      { sym: 'I_{SS}', value: 120e-6, unit: 'A' },
      { sym: 'I_7', value: 500e-6, unit: 'A' },
    ],
    unknowns: [
      { key: 'cc', sym: 'C_C', label: '(a) CC', unit: 'F' },
      { key: 'fu', sym: 'f_u', label: '(b) GBW', unit: 'Hz' },
      { key: 'p1', sym: "P_1'", label: '(c) Dominant pole', unit: 'Hz' },
      { key: 'rz', sym: 'R_z', label: '(d) Rz', unit: 'Ω' },
      { key: 'sr', sym: 'SR', label: '(e) Slew rate', unit: 'V/s' },
    ],
    answers: { cc, fu: gm1 / (2 * Math.PI * cc), p1: m.p1Approx / (2 * Math.PI), rz: 1 / gm6, sr: sr.sr },
    wrong: { cc: [{ mistake: 'wrongPmTan', value: (gm1 * cl) / (gm6 * Math.tan(rad(60))) }], fu: [{ mistake: 'forgot2pi', value: gm1 / cc }] },
    steps: [
      { tag: '·', title: '(a) ωp2 = ωu·tan 60°: Gm2/CL = (Gm1/CC)·1.732', tex: `C_C = \\frac{0.8\\,\\mathrm{mS}\\times 4\\,\\mathrm{pF}\\times 1.732}{4\\,\\mathrm{mS}} = ${texSI(ccH, 'F')}`, produces: 'cc', value: ccH },
      { tag: '·', title: '(b) GBW = Gm1/(2πCC)', tex: `f_u = ${texSI(gm1 / (2 * Math.PI * ccH), 'Hz')}`, produces: 'fu', value: gm1 / (2 * Math.PI * ccH) },
      { tag: 'D', title: '(c) A2 = Gm2R2 = 80; node 1 sees CC(1 + A2)', tex: `P_1' = \\frac{1}{2\\pi R_1 A_2 C_C} = ${texSI(1 / (2 * Math.PI * r1 * gm6 * r2 * ccH), 'Hz')}`, produces: 'p1', value: 1 / (2 * Math.PI * r1 * gm6 * r2 * ccH) },
      { tag: '·', title: '(d) Rz = 1/Gm2 moves the RHP zero to infinity', tex: `R_z = ${texSI(1 / gm6, 'Ω')}`, produces: 'rz', value: 1 / gm6 },
      { tag: '✓', title: '(e) ISS/CC vs (I7 − ISS)/CL: the smaller wins', tex: `\\min(${texSI(120e-6 / ccH, 'V/s')},\\; ${texSI((500e-6 - 120e-6) / cl, 'V/s')}) = ${texSI(Math.min(120e-6 / ccH, (500e-6 - 120e-6) / cl), 'V/s')}`, produces: 'sr', value: Math.min(120e-6 / ccH, (500e-6 - 120e-6) / cl) },
    ],
    hints: ['GBW = Gm1/CC and ωp2 = Gm2/CL.', '60° → ωp2 = 1.73·ωu.', 'CC = Gm1·CL·tan 60°/Gm2; P1′ = 1/(2πR1A2CC).', 'CC ≈ 1.39 pF.'],
  };
}

function ps2p5(): Problem {
  const vref = 1.5, vth = 0.7, w = 12;
  const v = replicaCmfbOutputCm({ vref, vth, wl12: w, wl13: w, wl15: 30 });
  return {
    id: 'bank-ps2-p5',
    source: 'Problem Set 2 P5 (L8, Lec 12)',
    tags: ['L8'],
    title: 'PS2 P5: the replica CMFB of Lec 12',
    statement: 'In the Lec 12 folded-cascode CMFB, (W/L)11 = 40 and the sensing devices are (W/L)12 = (W/L)13 = 12. VREF = 1.5 V, Vth = 0.7 V. (a) What (W/L)14 and (W/L)15 make the output CM equal VREF? (b) If (W/L)15 = 30 is used instead, where does the output CM settle?',
    figure: { kind: 'replicaCmfb', props: { vref, vcm: v } },
    givens: [
      { sym: '(W/L)_{11}', value: 40, unit: '' },
      { sym: '(W/L)_{12,13}', value: w, unit: '' },
      { sym: 'V_{REF}', value: vref, unit: 'V' },
      { sym: 'V_{th}', value: vth, unit: 'V' },
    ],
    unknowns: [
      { key: 'w14', sym: '(W/L)_{14}', label: '(a) (W/L)14', unit: '' },
      { key: 'w15', sym: '(W/L)_{15}', label: '(a) (W/L)15', unit: '' },
      { key: 'v', sym: 'V_{out,CM}', label: '(b) Output CM', unit: 'V' },
    ],
    answers: { w14: 40, w15: 24, v },
    wrong: {},
    steps: [
      { tag: 'A', title: '(a) M14 must be M11’s twin (same current I1, same gate)', tex: '(W/L)_{14} = (W/L)_{11} = 40', produces: 'w14', value: 40 },
      { tag: 'C', title: 'M15 must equal M12 ‖ M13 in conductance', tex: '(W/L)_{15} = 12 + 12 = 24', produces: 'w15', value: 24 },
      { tag: '✓', title: '(b) Conductances must still match: 30(1.5 − 0.7) = 24(Vout,CM − 0.7)', tex: `V_{out,CM} = 0.7 + \\frac{30}{24}(0.8) = ${texSI(0.7 + (30 / 24) * 0.8, 'V')}`, produces: 'v', value: 0.7 + (30 / 24) * 0.8 },
    ],
    hints: ['Twins: same gate + same current + same size = same VGS.', 'So the resistances under them match.', 'Deep triode: conductance ∝ (W/L)(VG − Vth); parallel ones add.', '(W/L)15 = (W/L)12 + (W/L)13.'],
  };
}

function ps2p6(): Problem {
  const gm1 = 2e-3, gm7 = 1e-3, gm9 = 1.5e-3;
  const v2 = inputNoiseFolded(gm1, gm7, gm9);
  const kt8 = 8 * K_BOLTZMANN * 300 * (2 / 3);
  const sum = 1 / gm1 + gm7 / gm1 ** 2 + gm9 / gm1 ** 2;
  return {
    id: 'bank-ps2-p6',
    source: 'Problem Set 2 P6 (L10)',
    tags: ['L10'],
    title: 'PS2 P6: noise of a folded cascode',
    statement: 'A folded-cascode op amp has input gm1,2 = 2 mS, top current sources gm7,8 = 1 mS and bottom current sources gm9,10 = 1.5 mS. γ = 2/3, T = 300 K. (a) Input-referred thermal noise density. (b) What fraction of the noise power comes from the current sources?',
    figure: { kind: 'noiseShare', props: { items: [{ label: 'M1, M2', value: 1 / gm1, tone: 'p' }, { label: 'M7, M8', value: gm7 / gm1 ** 2, tone: 'p' }, { label: 'M9, M10', value: gm9 / gm1 ** 2, tone: 'n' }] } },
    givens: [
      { sym: 'g_{m1}', value: gm1, unit: 'S' },
      { sym: 'g_{m7}', value: gm7, unit: 'S' },
      { sym: 'g_{m9}', value: gm9, unit: 'S' },
    ],
    unknowns: [
      { key: 'nv', sym: '\\overline{V_n}', label: '(a) Input noise', unit: 'nV/√Hz' },
      { key: 'frac', sym: 'share', label: '(b) Share from current sources (0–1)', unit: '' },
    ],
    answers: { nv: nvPerRtHz(v2), frac: (gm7 / gm1 ** 2 + gm9 / gm1 ** 2) / sum },
    wrong: { nv: [{ mistake: 'noiseOneHalf', value: nvPerRtHz(v2 / 2) }] },
    steps: [
      { tag: '·', title: 'Wiggle each gate: M1–2, M7–8 and M9–10 all move the output; the cascodes do not', tex: `\\overline{V_n^2} = 8kT\\gamma\\left(\\frac{1}{g_{m1}} + \\frac{g_{m7}}{g_{m1}^2} + \\frac{g_{m9}}{g_{m1}^2}\\right) = ${texNum(kt8)}(500 + 250 + 375)` },
      { tag: '·', title: '(a) Square root', tex: `\\overline{V_n} = ${texSI(Math.sqrt(kt8 * 1125) * 1e9, 'nV/√Hz')}`, produces: 'nv', value: Math.sqrt(kt8 * 1125) * 1e9 },
      { tag: '✓', title: '(b) (250 + 375)/1125: more than half from the current sources: folding costs noise', tex: `${texNum(625 / 1125)}`, produces: 'frac', value: 625 / 1125 },
    ],
    hints: ['Which gates, when wiggled, move the output?', 'Current sources count as gm/gm1².', '8kTγ(1/gm1 + gm7/gm1² + gm9/gm1²).', 'Terms: 500, 250, 375 (in 1/S).'],
  };
}

export const M6_BANK: Problem[] = [r10p1(), r10p2(), r10p3(), r10p4(), lec16(), ex10p6(), examPsrrNoise(), ps2p1(), ps2p2(), ps2p3(), ps2p4(), ps2p5(), ps2p6()];
