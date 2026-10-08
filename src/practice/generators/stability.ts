/**
 * Generators for L8 (replica CMFB, Lec 12) and L10–L14 (PSRR and noise; stability; compensation).
 * Each answer comes from src/physics; each step trace recomputes it by hand (closed forms where the
 * physics module bisects), so the two independent solves check each other.
 */
import {
  a0ForPhaseMargin,
  addUncorrelated,
  ccForPhaseMargin,
  clForPhaseMargin,
  dominantPoleHand,
  gainCrossover,
  gmFromIdVov,
  inputNoisePair,
  millerTwoStage,
  nvPerRtHz,
  oneStageLoop,
  oneStagePmHand,
  rcNoiseRms,
  resistorNoise,
  peakingFactor,
  phaseMargin,
  psrr5T,
  psrrDb,
  replicaCmfbOutputCm,
  rO,
  rzNull,
  twoStageSlewRate,
  K_BOLTZMANN,
  SET_B,
} from '../../physics';
import { nice, pick, type Rng } from '../rng';
import type { Generator, GeneratorOutput, Problem } from '../schema';
import { texNum, texSI } from '../tex';

const par = (a: number, b: number) => (a * b) / (a + b);
const deg = (r: number) => (r * 180) / Math.PI;
const rad = (d: number) => (d * Math.PI) / 180;

function base(id: string, unit: string, title: string): Pick<Problem, 'id' | 'generator' | 'source' | 'tags' | 'title'> {
  return { id, generator: id, source: 'generated', tags: [unit], title };
}

/* ─── L8 (Lec 12): replica CMFB ─── */

export const genReplica: Generator = {
  id: 'l8-replica',
  unit: 'L8',
  title: 'Replica CMFB: size M15 so the output CM equals VREF',
  make(rng: Rng): GeneratorOutput {
    const vth = pick(rng, [0.4, 0.5, 0.7]);
    const vref = nice(rng, 0.9, 1.6, 0.05);
    const w = pick(rng, [5, 8, 10, 20]);
    const k = pick(rng, [1.5, 2.5, 3]);
    const wl15 = k * w;
    const vcm = replicaCmfbOutputCm({ vref, vth, wl12: w, wl13: w, wl15 });
    const need = 2 * w;
    const problem: Problem = {
      ...base('l8-replica', 'L8', 'Replica CMFB: size M15 so the output CM equals VREF'),
      statement: `In the Lec 12 CMFB, M11 (tail of the input pair) stands on the triode pair M12, M13 (gates at Vout1, Vout2, (W/L)12 = (W/L)13 = ${w}). The replica M14 carries the same current I1 with the same gate and stands on M15 (gate at VREF = ${vref} V). Vth = ${vth} V. (a) What (W/L)15 makes Vout,CM = VREF? (b) Someone used (W/L)15 = ${wl15}. Where does the output CM settle?`,
      figure: { kind: 'replicaCmfb', props: { vref, vcm } },
      givens: [
        { sym: 'V_{REF}', value: vref, unit: 'V' },
        { sym: 'V_{th}', value: vth, unit: 'V' },
        { sym: '(W/L)_{12,13}', value: w, unit: '' },
        { sym: '(W/L)_{15}', value: wl15, unit: '' },
      ],
      unknowns: [
        { key: 'need', sym: '(W/L)_{15}', label: '(a) (W/L)15 for Vout,CM = VREF', unit: '' },
        { key: 'vcm', sym: 'V_{out,CM}', label: '(b) Output CM with the wrong size', unit: 'V' },
      ],
      answers: { need, vcm },
      wrong: { need: [{ mistake: 'issNotHalf', value: w }], vcm: [{ mistake: 'vovNotVgs', value: vref * (wl15 / need) }] },
      steps: [
        { tag: 'A', title: 'M11 and M14: same gate, same current, same size → their sources sit at the same voltage', note: 'So the triode resistance under M11 must equal the one under M14: R15 = R12 ‖ R13.' },
        { tag: 'C', title: 'Deep triode: 1/R ∝ (W/L)(VG − Vth). Parallel conductances add', tex: `(W/L)_{15}(V_{REF} - V_{th}) = (W/L)_{12}(V_{out1} - V_{th}) + (W/L)_{13}(V_{out2} - V_{th})` },
        { tag: 'A', title: '(a) Equal sensing devices: Vout,CM = VREF needs (W/L)15 = (W/L)12 + (W/L)13', tex: `(W/L)_{15} = ${w} + ${w} = ${need}`, produces: 'need', value: w + w },
        { tag: '✓', title: '(b) Solve for the output CM with the size used', tex: `V_{out,CM} = V_{th} + \\frac{(W/L)_{15}}{(W/L)_{12}+(W/L)_{13}}(V_{REF}-V_{th}) = ${vth} + \\frac{${texNum(wl15)}}{${need}}(${texNum(vref - vth)}) = ${texSI(vth + (wl15 / need) * (vref - vth), 'V')}`, produces: 'vcm', value: vth + (wl15 / need) * (vref - vth) },
      ],
      hints: [
        'Two identical transistors with the same gate and the same current have the same VGS.',
        'So the two triode "resistors" under them must be equal.',
        'Deep triode conductance = µCox(W/L)(VG − Vth); parallel conductances add.',
        'M15 alone must match M12 and M13 together: (W/L)15 = (W/L)12 + (W/L)13.',
      ],
    };
    return { problem, sane: vcm > vth && vcm < 3 };
  },
};

/* ─── L10: PSRR and noise ─── */

export const genPsrr: Generator = {
  id: 'l10-psrr',
  unit: 'L10',
  title: 'PSRR of the 5-T OTA: the diode lets VDD straight through',
  make(rng: Rng): GeneratorOutput {
    const id = nice(rng, 20e-6, 150e-6, 10e-6);
    const vov = pick(rng, [0.1, 0.15, 0.2, 0.25]);
    const ln = pick(rng, [0.05, 0.1]);
    const lp = pick(rng, [0.1, 0.2]);
    const ripple = pick(rng, [5e-3, 10e-3, 20e-3]);
    const gm = gmFromIdVov(id, vov);
    const r2 = rO(ln, id);
    const r4 = rO(lp, id);
    const p = psrr5T({ gmN: gm, roP: r4, roN: r2 });
    const problem: Problem = {
      ...base('l10-psrr', 'L10', 'PSRR of the 5-T OTA: the diode lets VDD straight through'),
      statement: `A 5-T OTA (NMOS input, PMOS mirror) has ID = ${formatUA(id)} per side, input overdrive ${vov} V, λn = ${ln} V⁻¹, λp = ${lp} V⁻¹. VDD carries ${ripple * 1e3} mV of ripple. Find the gain, the PSRR (in dB) and the ripple referred to the input.`,
      figure: { kind: 'fiveT', props: { proc: SET_B, iss: 120e-6, wl12: 26.67, wl34: 19.2, wlTail: 30, vinCm: 1.1, inspector: false } },
      givens: [
        { sym: 'I_D', value: id, unit: 'A' },
        { sym: 'V_{ov1}', value: vov, unit: 'V' },
        { sym: '\\lambda_n', value: ln, unit: '' },
        { sym: '\\lambda_p', value: lp, unit: '' },
        { sym: '\\Delta V_{DD}', value: ripple, unit: 'V' },
      ],
      unknowns: [
        { key: 'av', sym: 'A_v', label: 'Signal gain', unit: 'V/V' },
        { key: 'db', sym: 'PSRR', label: 'PSRR in dB', unit: 'dB', tol: 0.01 },
        { key: 'vin', sym: '\\Delta V_{in,eq}', label: 'Supply ripple referred to the input', unit: 'V' },
      ],
      answers: { av: p.signalGain, db: psrrDb(p.psrr), vin: ripple / p.psrr },
      wrong: { db: [{ mistake: 'dbConversion', value: 10 * Math.log10(p.psrr) }], vin: [{ mistake: 'aInsteadOfInvBeta', value: ripple }] },
      steps: [
        { tag: 'C', title: 'gm and the two rO', tex: `g_m = \\frac{2I_D}{V_{ov}} = ${texSI(2 * id / vov, 'S')},\\; r_{O2} = ${texSI(1 / (ln * id), 'Ω')},\\; r_{O4} = ${texSI(1 / (lp * id), 'Ω')}` },
        { tag: 'D', title: 'Signal gain = gm(rO2 ‖ rO4)', tex: `A_v = ${texNum((2 * id / vov) * par(1 / (ln * id), 1 / (lp * id)))}`, produces: 'av', value: (2 * id / vov) * par(1 / (ln * id), 1 / (lp * id)) },
        { tag: 'B', title: 'Supply path: the diode M3 clamps X one |VGS| below VDD, and the output follows X', note: 'VDD moves → X moves the same → Vout moves the same: supply gain ≈ 1.' },
        { tag: '·', title: 'PSRR = signal gain ÷ supply gain, in dB: 20·log10', tex: `PSRR = 20\\log_{10}${texNum((2 * id / vov) * par(1 / (ln * id), 1 / (lp * id)))} = ${texNum(20 * Math.log10((2 * id / vov) * par(1 / (ln * id), 1 / (lp * id))))}\\,\\mathrm{dB}`, produces: 'db', value: 20 * Math.log10((2 * id / vov) * par(1 / (ln * id), 1 / (lp * id))) },
        { tag: '✓', title: 'Referred to the input: the ripple looks like an input of ΔVDD/PSRR', tex: `\\Delta V_{in,eq} = \\frac{${texSI(ripple, 'V')}}{${texNum((2 * id / vov) * par(1 / (ln * id), 1 / (lp * id)))}} = ${texSI(ripple / ((2 * id / vov) * par(1 / (ln * id), 1 / (lp * id))), 'V')}`, produces: 'vin', value: ripple / ((2 * id / vov) * par(1 / (ln * id), 1 / (lp * id))) },
      ],
      hints: [
        'Drawing on a bumpy bus: how much of the bump reaches the output, compared with your signal?',
        'Wiggle VDD: the diode-connected PMOS keeps its |VGS|, so X and the output ride along.',
        'PSRR = Av / (supply gain ≈ 1) = gm(rO2‖rO4); dB = 20·log10.',
        `gm = ${(2 * id / vov * 1e3).toFixed(3)} mS.`,
      ],
    };
    return { problem, sane: p.psrr > 10 };
  },
};

function formatUA(x: number) {
  return `${Number((x * 1e6).toPrecision(3))} µA`;
}

export const genNoise: Generator = {
  id: 'l10-noise',
  unit: 'L10',
  title: 'Input-referred thermal noise of a differential pair (5-T OTA / telescopic)',
  make(rng: Rng): GeneratorOutput {
    const iss = nice(rng, 100e-6, 1e-3, 50e-6);
    const vov1 = pick(rng, [0.1, 0.15, 0.2]);
    const vov3 = pick(rng, [0.2, 0.3, 0.4]);
    const gamma = 2 / 3;
    const T = 300;
    const gm1 = iss / vov1; // 2(ISS/2)/Vov
    const gm3 = iss / vov3;
    const v2 = inputNoisePair(gm1, gm3, gamma, T);
    const nv = nvPerRtHz(v2);
    const kt8 = 8 * K_BOLTZMANN * T * gamma;
    const problem: Problem = {
      ...base('l10-noise', 'L10', 'Input-referred thermal noise of a differential pair'),
      statement: `A 5-T OTA has ISS = ${formatUA(iss)}, input overdrive Vov1,2 = ${vov1} V and load (mirror) overdrive |Vov3,4| = ${vov3} V. Take γ = 2/3, T = 300 K, ignore flicker noise. Find gm1, gm3, the input-referred noise density and the fraction of the noise power that comes from the loads.`,
      figure: { kind: 'noiseShare', props: { items: [{ label: 'M1, M2', value: 1 / gm1, tone: 'n' }, { label: 'M3, M4', value: gm3 / gm1 ** 2, tone: 'p' }, { label: 'M5 (tail)', value: 0, tone: 'muted' }] } },
      givens: [
        { sym: 'I_{SS}', value: iss, unit: 'A' },
        { sym: 'V_{ov1}', value: vov1, unit: 'V' },
        { sym: '|V_{ov3}|', value: vov3, unit: 'V' },
        { sym: '\\gamma', value: gamma, unit: '' },
      ],
      unknowns: [
        { key: 'gm1', sym: 'g_{m1}', label: 'gm of the input pair', unit: 'S' },
        { key: 'gm3', sym: 'g_{m3}', label: 'gm of the loads', unit: 'S' },
        { key: 'nv', sym: '\\overline{V_n}', label: 'Input-referred noise', unit: 'nV/√Hz' },
        { key: 'frac', sym: 'share_{loads}', label: 'Share of the noise power from M3, M4 (0–1)', unit: '' },
      ],
      answers: { gm1, gm3, nv, frac: (gm3 / gm1 ** 2) / (1 / gm1 + gm3 / gm1 ** 2) },
      wrong: { nv: [{ mistake: 'noiseOneHalf', value: nv / Math.SQRT2 }], gm1: [{ mistake: 'issNotHalf', value: (2 * iss) / vov1 }] },
      steps: [
        { tag: 'C', title: 'Each side carries ISS/2: gm = 2(ISS/2)/Vov = ISS/Vov', tex: `g_{m1} = ${texSI(iss / vov1, 'S')},\\; g_{m3} = ${texSI(iss / vov3, 'S')}`, produces: 'gm1', value: iss / vov1 },
        { tag: 'C', title: 'Load gm (the same current, its own overdrive)', tex: `g_{m3} = \\frac{I_{SS}}{|V_{ov3}|} = ${texSI(iss / vov3, 'S')}`, produces: 'gm3', value: iss / vov3 },
        { tag: '·', title: 'Wiggle each gate: M1–M4 move the output, M5 (the tail) does not (differential output ignores it). Both halves count: 8kTγ', tex: `\\overline{V_n^2} = 8kT\\gamma\\left(\\frac{1}{g_{m1}} + \\frac{g_{m3}}{g_{m1}^2}\\right) = ${texNum(kt8 * (vov1 / iss + (iss / vov3) / (iss / vov1) ** 2))}\\,\\mathrm{V^2/Hz}` },
        { tag: '·', title: 'Square root, in nV/√Hz', tex: `\\overline{V_n} = ${texSI(Math.sqrt(kt8 * (vov1 / iss + (iss / vov3) / (iss / vov1) ** 2)) * 1e9, 'nV/√Hz')}`, produces: 'nv', value: Math.sqrt(kt8 * (vov1 / iss + (iss / vov3) / (iss / vov1) ** 2)) * 1e9 },
        { tag: '✓', title: 'Loads’ share = (gm3/gm1²) ÷ (1/gm1 + gm3/gm1²) = (gm3/gm1)/(1 + gm3/gm1) = Vov1/(Vov1 + Vov3)', tex: `\\frac{${vov1}}{${vov1} + ${vov3}} = ${texNum(vov1 / (vov1 + vov3))}`, produces: 'frac', value: vov1 / (vov1 + vov3) },
      ],
      hints: [
        'Razavi’s rule: wiggle each gate a little. If the output moves, that device’s noise counts.',
        'Input devices count fully; load noise counts as gm_load/gm1² (divided by the input gain).',
        '8kTγ(1/gm1 + gm3/gm1²): 8 because both halves add.',
        `gm1 = ISS/Vov1 = ${(iss / vov1 * 1e3).toFixed(2)} mS.`,
      ],
    };
    return { problem, sane: true };
  },
};

/* ─── L10: what noise is (Razavi HO #10): 4kTR, noise bandwidth, kT/C, powers add ─── */

export const genKtc: Generator = {
  id: 'l10-ktc',
  unit: 'L10',
  title: 'kT/C: the noise a resistor leaves on a capacitor',
  make(rng: Rng): GeneratorOutput {
    const r = pick(rng, [200, 500, 1e3, 2e3, 5e3, 10e3]);
    const c = pick(rng, [0.2e-12, 0.5e-12, 1e-12, 2e-12, 5e-12]);
    const vamp = pick(rng, [20e-6, 30e-6, 50e-6, 80e-6]);
    const T = 300;
    const kT = K_BOLTZMANN * T;
    const dens = Math.sqrt(resistorNoise(r, T)) * 1e9;
    const f3 = 1 / (2 * Math.PI * r * c);
    const vt = rcNoiseRms(r, c, T);
    const tot = addUncorrelated([vt, vamp]);
    // Independent route: the closed form √(kT/C), and the Pythagoras sum written out.
    const vtH = Math.sqrt(kT / c);
    const totH = Math.sqrt(vtH * vtH + vamp * vamp);
    const problem: Problem = {
      ...base('l10-ktc', 'L10', 'kT/C: the noise a resistor leaves on a capacitor'),
      statement: `A sampling switch with on-resistance R = ${fmtR(r)} charges C = ${fmtF(c)} (T = 300 K). Find (a) the resistor’s noise density √(4kTR) in nV/√Hz, (b) the RC filter’s f−3dB, (c) the total rms noise on C, and (d) the total when an amplifier adds another ${(vamp * 1e6).toFixed(0)} µV rms of its own (independent).`,
      figure: { kind: 'ktcSpectrum', props: { r, c } },
      givens: [
        { sym: 'R', value: r, unit: 'Ω' },
        { sym: 'C', value: c, unit: 'F' },
        { sym: 'v_{amp}', value: vamp, unit: 'V' },
      ],
      unknowns: [
        { key: 'dens', sym: '\\sqrt{4kTR}', label: 'Noise density of R', unit: 'nV/√Hz' },
        { key: 'f3', sym: 'f_{-3dB}', label: 'RC bandwidth', unit: 'Hz' },
        { key: 'vt', sym: 'v_{n,C}', label: 'Total rms noise on C', unit: 'V' },
        { key: 'tot', sym: 'v_{n,tot}', label: 'Total with the amplifier', unit: 'V' },
      ],
      answers: { dens, f3, vt, tot },
      wrong: {
        vt: [{ mistake: 'noiseBwNoPiOver2', value: Math.sqrt(resistorNoise(r, T) * f3) }],
        tot: [{ mistake: 'noiseAmplitudesAdded', value: vt + vamp }],
        f3: [{ mistake: 'forgot2pi', value: 1 / (r * c) }],
      },
      steps: [
        { tag: '·', title: 'Height of the spectrum: 4kTR (flat: “white”)', tex: `\\sqrt{4kTR} = \\sqrt{4(${texNum(kT)})(${r})} = ${texSI(Math.sqrt(4 * kT * r) * 1e9, 'nV/√Hz')}`, produces: 'dens', value: Math.sqrt(4 * kT * r) * 1e9 },
        { tag: '·', title: 'Width: the RC filter cuts it off at 1/(2πRC)', tex: `f_{-3dB} = \\frac{1}{2\\pi RC} = ${texSI(1 / (2 * Math.PI * r * c), 'Hz')}`, produces: 'f3', value: 1 / (2 * Math.PI * r * c) },
        { tag: '·', title: 'Area = height² × noise bandwidth (π/2)·f−3dB: R cancels, leaving kT/C', tex: `4kTR\\cdot\\frac{\\pi}{2}\\cdot\\frac{1}{2\\pi RC} = \\frac{kT}{C} \\Rightarrow \\sqrt{kT/C} = ${texSI(vtH, 'V')}`, produces: 'vt', value: vtH },
        { tag: '✓', title: 'Independent sources add as powers (Pythagoras), not amplitudes', tex: `\\sqrt{(${texSI(vtH, 'V')})^2 + (${texSI(vamp, 'V')})^2} = ${texSI(totH, 'V')}`, produces: 'tot', value: totH },
      ],
      hints: [
        'Picture the spectrum: a flat height 4kTR, cut off by the RC filter. The total is the area.',
        'A bigger R is noisier per hertz but lets through fewer hertz. What is left depends only on C.',
        'vn = √(kT/C); independent noises add as √(v1² + v2²).',
        `kT = ${texNum(kT)} J at 300 K.`,
      ],
    };
    return { problem, sane: Math.abs(vt - vtH) / vtH < 1e-9 && Math.abs(tot - totH) / totH < 1e-9 };
  },
};

/* ─── L11–L12: loops, crossovers, margins ─── */

export const genOnePoleLoop: Generator = {
  id: 'l11-onepole',
  unit: 'L11',
  title: 'One-pole loop: closed-loop gain, bandwidth and why it can never oscillate',
  make(rng: Rng): GeneratorOutput {
    const a0 = pick(rng, [1e3, 2e3, 5e3, 1e4]);
    const fp1 = pick(rng, [1e3, 2e3, 5e3, 10e3]);
    const acl = pick(rng, [1, 2, 5, 10]);
    const beta = 1 / acl;
    const k = beta * a0;
    const fgx = gainCrossover({ a0, poles: [fp1], beta })!;
    const pm = phaseMargin({ a0, poles: [fp1], beta });
    const problem: Problem = {
      ...base('l11-onepole', 'L11', 'One-pole loop: closed-loop gain, bandwidth, phase margin'),
      statement: `A one-pole amplifier (A0 = ${a0}, pole at ${fmtHz(fp1)}) is used with β = 1/${acl}. Find the closed-loop DC gain, the closed-loop −3 dB frequency, the gain crossover ωgx (in Hz) and the phase margin.`,
      figure: { kind: 'loopBode', props: { spec: { a0, poles: [fp1], beta } } },
      givens: [
        { sym: 'A_0', value: a0, unit: '' },
        { sym: 'f_{p1}', value: fp1, unit: 'Hz' },
        { sym: '\\beta', value: beta, unit: '' },
      ],
      unknowns: [
        { key: 'acl', sym: 'A_f(0)', label: 'Closed-loop DC gain', unit: 'V/V' },
        { key: 'fcl', sym: 'f_{-3dB,closed}', label: 'Closed-loop −3 dB frequency', unit: 'Hz' },
        { key: 'fgx', sym: 'f_{gx}', label: 'Gain crossover', unit: 'Hz' },
        { key: 'pm', sym: 'PM', label: 'Phase margin', unit: '°', tol: 0.005 },
      ],
      answers: { acl: a0 / (1 + k), fcl: fp1 * (1 + k), fgx, pm },
      wrong: { pm: [{ mistake: 'phaseNoInversion', value: 180 - pm }], fgx: [{ mistake: 'usedANotBetaA', value: fp1 * Math.sqrt(a0 * a0 - 1) }] },
      steps: [
        { tag: '·', title: 'Loop gain βA0', tex: `\\beta A_0 = ${texNum(k)}` },
        { tag: '·', title: 'Af = A0/(1 + βA0): just under 1/β', tex: `A_f(0) = ${texNum(a0 / (1 + k), 4)}`, produces: 'acl', value: a0 / (1 + k) },
        { tag: '·', title: 'The closed-loop pole moves up by (1 + βA0) (Lec 15)', tex: `f_{-3dB} = f_{p1}(1+\\beta A_0) = ${texSI(fp1 * (1 + k), 'Hz')}`, produces: 'fcl', value: fp1 * (1 + k) },
        { tag: '·', title: '|βA| = 1: βA0/√(1 + (f/fp1)²) = 1', tex: `f_{gx} = f_{p1}\\sqrt{(\\beta A_0)^2 - 1} = ${texSI(fp1 * Math.sqrt(k * k - 1), 'Hz')}`, produces: 'fgx', value: fp1 * Math.sqrt(k * k - 1) },
        { tag: '✓', title: 'PM = 180° + ∠βA(ωgx) = 180° − atan(fgx/fp1): one pole can never reach −180°', tex: `PM = 180^\\circ - ${texNum(deg(Math.atan(Math.sqrt(k * k - 1))))}^\\circ = ${texSI(180 - deg(Math.atan(Math.sqrt(k * k - 1))), '°')}`, produces: 'pm', value: 180 - deg(Math.atan(Math.sqrt(k * k - 1))) },
      ],
      hints: [
        'A single pole can delay the signal by at most 90°.',
        'Closed loop: gain ÷ (1 + βA0), bandwidth × (1 + βA0).',
        'fgx = fp1·√((βA0)² − 1) ≈ βA0·fp1; PM = 180° − atan(fgx/fp1).',
        `βA0 = ${k}.`,
      ],
    };
    return { problem, sane: k > 2 };
  },
};

/** Two-pole gain crossover in closed form: (1 + x²/p1²)(1 + x²/p2²) = K² is a quadratic in x². */
function twoPoleGx(k: number, p1: number, p2: number): number {
  const a = 1 / (p1 * p1 * p2 * p2);
  const b = 1 / (p1 * p1) + 1 / (p2 * p2);
  const c = 1 - k * k;
  const x2 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  return Math.sqrt(x2);
}

export const genTwoPolePm: Generator = {
  id: 'l12-pm',
  unit: 'L12',
  title: 'Two poles: gain crossover, phase margin and closed-loop peaking',
  make(rng: Rng): GeneratorOutput {
    const a0 = pick(rng, [100, 200, 500, 1000, 2000]);
    const fp1 = pick(rng, [10e3, 50e3, 100e3, 1e6]);
    const beta = pick(rng, [1, 0.5, 0.25, 0.1]);
    const fp2 = fp1 * a0 * beta * pick(rng, [0.3, 0.5, 1, 2, 3]);
    const spec = { a0, poles: [fp1, fp2], beta };
    const fgx = gainCrossover(spec)!;
    const pm = phaseMargin(spec);
    const pk = peakingFactor(pm);
    const x = twoPoleGx(beta * a0, fp1, fp2);
    const pmHand = 180 - deg(Math.atan(x / fp1)) - deg(Math.atan(x / fp2));
    const problem: Problem = {
      ...base('l12-pm', 'L12', 'Two poles: gain crossover, phase margin and closed-loop peaking'),
      statement: `An amplifier has A0 = ${a0} and poles at ${fmtHz(fp1)} and ${fmtHz(fp2)}; the feedback factor is β = ${beta}. Find ωgx (in Hz), the phase margin and how much the closed-loop response peaks at ωgx (as a multiple of 1/β).`,
      figure: { kind: 'loopBode', props: { spec } },
      givens: [
        { sym: 'A_0', value: a0, unit: '' },
        { sym: 'f_{p1}', value: fp1, unit: 'Hz' },
        { sym: 'f_{p2}', value: fp2, unit: 'Hz' },
        { sym: '\\beta', value: beta, unit: '' },
      ],
      unknowns: [
        { key: 'fgx', sym: 'f_{gx}', label: 'Gain crossover', unit: 'Hz' },
        { key: 'pm', sym: 'PM', label: 'Phase margin', unit: '°', tol: 0.01 },
        { key: 'pk', sym: '|A_f(\\omega_{gx})|\\beta', label: 'Peaking at ωgx (× 1/β)', unit: '' },
      ],
      answers: { fgx, pm, pk },
      wrong: { pm: [{ mistake: 'phaseNoInversion', value: 180 - pm }], fgx: [{ mistake: 'usedANotBetaA', value: twoPoleGx(a0, fp1, fp2) }] },
      steps: [
        { tag: '·', title: 'Loop gain at DC', tex: `\\beta A_0 = ${texNum(beta * a0)}` },
        { tag: '·', title: '|βA| = 1: (1 + f²/fp1²)(1 + f²/fp2²) = (βA0)², a quadratic in f²', tex: `f_{gx} = ${texSI(x, 'Hz')}`, produces: 'fgx', value: x },
        { tag: '·', title: 'Each pole subtracts atan(f/fp); PM = 180° + ∠βA(ωgx)', tex: `PM = 180^\\circ - ${texNum(deg(Math.atan(x / fp1)))}^\\circ - ${texNum(deg(Math.atan(x / fp2)))}^\\circ = ${texSI(pmHand, '°')}`, produces: 'pm', value: pmHand },
        { tag: '✓', title: 'Peaking at ωgx: |1 + βA| = 2 sin(PM/2), so |Af| = (1/β)·1/(2 sin(PM/2)) (Lec 16)', tex: `\\frac{1}{2\\sin(${texNum(pmHand / 2)}^\\circ)} = ${texNum(1 / (2 * Math.sin(rad(pmHand / 2))))}`, produces: 'pk', value: 1 / (2 * Math.sin(rad(pmHand / 2))) },
      ],
      hints: [
        'The danger is −180° of phase while the loop gain is still ≥ 1.',
        'Find where |βA| = 1 first; then read the phase there.',
        'PM = 180° − atan(fgx/fp1) − atan(fgx/fp2). Peaking = 1/(2 sin(PM/2)).',
        `βA0 = ${beta * a0}; fgx lies above fp1 by roughly that factor if fp2 is far away.`,
      ],
    };
    return { problem, sane: pm > 15 && pm < 88 && Math.abs(pmHand - pm) < 1e-6 && pk > 0 };
  },
};

export const genA0ForPm: Generator = {
  id: 'l12-a0',
  unit: 'L12',
  title: 'Largest A0 for a required phase margin (Razavi 10.1–10.2 style)',
  make(rng: Rng): GeneratorOutput {
    const fp1 = pick(rng, [1e6, 5e6, 10e6, 20e6]);
    const fp2 = fp1 * pick(rng, [5, 10, 20, 50]);
    const pmT = pick(rng, [45, 60]);
    const beta = pick(rng, [1, 0.5, 0.25]);
    const r = a0ForPhaseMargin({ poles: [fp1, fp2], pm: pmT, beta });
    // Hand: tan(θ1 + θ2) = tan(180° − PM) → closed-form quadratic in f.
    const t = Math.tan(rad(pmT));
    const s = 1 / fp1 + 1 / fp2;
    const qa = t / (fp1 * fp2);
    const f = (s + Math.sqrt(s * s + 4 * qa * t)) / (2 * qa);
    const a0h = (Math.hypot(1, f / fp1) * Math.hypot(1, f / fp2)) / beta;
    const problem: Problem = {
      ...base('l12-a0', 'L12', 'Largest A0 for a required phase margin'),
      statement: `An amplifier has two poles, at ${fmtHz(fp1)} and ${fmtHz(fp2)}. It is placed in a feedback loop with β = ${beta}. What is the largest A0 that still leaves a phase margin of ${pmT}°? Where is ωgx then?`,
      figure: { kind: 'loopBode', props: { spec: { a0: r.a0, poles: [fp1, fp2], beta } } },
      givens: [
        { sym: 'f_{p1}', value: fp1, unit: 'Hz' },
        { sym: 'f_{p2}', value: fp2, unit: 'Hz' },
        { sym: '\\beta', value: beta, unit: '' },
        { sym: 'PM', value: pmT, unit: '°' },
      ],
      unknowns: [
        { key: 'fgx', sym: 'f_{gx}', label: 'Gain crossover at that PM', unit: 'Hz' },
        { key: 'a0', sym: 'A_{0,max}', label: 'Largest A0', unit: 'V/V' },
      ],
      answers: { fgx: r.fgx, a0: r.a0 },
      wrong: { a0: [{ mistake: 'usedANotBetaA', value: r.a0 * beta }] },
      steps: [
        { tag: '·', title: 'Work backwards from the phase: at ωgx the loop phase must be PM − 180°', tex: `\\tan^{-1}\\frac{f}{f_{p1}} + \\tan^{-1}\\frac{f}{f_{p2}} = 180^\\circ - ${pmT}^\\circ = ${180 - pmT}^\\circ` },
        { tag: '·', title: 'Solve (tan-addition gives a quadratic in f)', tex: `f_{gx} = ${texSI(f, 'Hz')}`, produces: 'fgx', value: f },
        { tag: '·', title: 'Then choose A0 so that |βA| = 1 exactly there', tex: `A_0 = \\frac{1}{\\beta}\\sqrt{1 + \\left(\\tfrac{f_{gx}}{f_{p1}}\\right)^2}\\sqrt{1 + \\left(\\tfrac{f_{gx}}{f_{p2}}\\right)^2} = ${texNum(a0h)}`, produces: 'a0', value: a0h },
        { tag: '✓', title: 'Smaller β (more closed-loop gain) allows a bigger A0: weaker feedback is more stable' },
      ],
      hints: [
        'Start from the phase, not the gain.',
        'At ωgx: atan(f/fp1) + atan(f/fp2) = 180° − PM.',
        'Then |βA(ωgx)| = 1 fixes A0.',
        `For PM = ${pmT}°, the poles must give ${180 - pmT}° of lag at ωgx.`,
      ],
    };
    return { problem, sane: Math.abs(a0h - r.a0) / r.a0 < 1e-6 && r.a0 > 1 };
  },
};

/* ─── L13: dominant-pole and Miller compensation ─── */

export const genDominant: Generator = {
  id: 'l13-dominant',
  unit: 'L13',
  title: 'Dominant-pole compensation: slide the first pole down for a phase margin',
  make(rng: Rng): GeneratorOutput {
    const a0 = pick(rng, [1e3, 1e4, 1e5]);
    const fp1 = pick(rng, [100e3, 1e6, 2e6]);
    const fp2 = fp1 * pick(rng, [10, 20, 50]);
    const pmT = pick(rng, [45, 60]);
    const beta = pick(rng, [1, 0.5, 0.1]);
    const r = dominantPoleHand({ a0, nondominant: [fp2], pm: pmT, beta });
    const fgxH = fp2 * Math.tan(rad(90 - pmT));
    const fdH = fgxH / (beta * a0);
    const problem: Problem = {
      ...base('l13-dominant', 'L13', 'Dominant-pole compensation'),
      statement: `An op amp has A0 = ${a0}, a dominant pole at ${fmtHz(fp1)} and a second pole at ${fmtHz(fp2)}. It is used with β = ${beta}. The second pole stays where it is. Where must the dominant pole go for PM = ${pmT}°, and by what factor must the output capacitance grow?`,
      figure: { kind: 'loopBode', props: { mode: 'notes', spec: { a0, poles: [r.fd, fp2], beta } } },
      givens: [
        { sym: 'A_0', value: a0, unit: '' },
        { sym: 'f_{p1}', value: fp1, unit: 'Hz' },
        { sym: 'f_{p2}', value: fp2, unit: 'Hz' },
        { sym: '\\beta', value: beta, unit: '' },
        { sym: 'PM', value: pmT, unit: '°' },
      ],
      unknowns: [
        { key: 'fgx', sym: 'f_{gx}', label: 'New gain crossover', unit: 'Hz' },
        { key: 'fd', sym: "f'_{p1}", label: 'New dominant pole', unit: 'Hz', tol: 0.02 },
        { key: 'k', sym: 'C_{new}/C_{old}', label: 'Capacitance factor', unit: '', tol: 0.02 },
      ],
      answers: { fgx: r.fgx, fd: r.fd, k: fp1 / r.fd },
      wrong: { fd: [{ mistake: 'usedANotBetaA', value: fgxH / a0 }], fgx: [{ mistake: 'wrongPmTan', value: fp2 * Math.tan(rad(pmT)) }] },
      steps: [
        { tag: '·', title: 'The dominant pole will give −90° at ωgx; the second pole may add only 90° − PM', tex: `\\tan^{-1}\\frac{f_{gx}}{f_{p2}} = ${90 - pmT}^\\circ \\Rightarrow f_{gx} = f_{p2}\\tan ${90 - pmT}^\\circ = ${texSI(fgxH, 'Hz')}`, produces: 'fgx', value: fgxH },
        { tag: '·', title: 'Draw −20 dB/dec from βA0 down to 0 dB at ωgx (Razavi Fig 10.20)', tex: `f'_{p1} = \\frac{f_{gx}}{\\beta A_0} = ${texSI(fdH, 'Hz')}`, produces: 'fd', value: fdH },
        { tag: '✓', title: 'ωp1 = 1/(Rout·C): lowering the pole by k needs k times the capacitance', tex: `k = \\frac{${texSI(fp1, 'Hz')}}{${texSI(fdH, 'Hz')}} = ${texNum(fp1 / fdH)}`, produces: 'k', value: fp1 / fdH },
      ],
      hints: [
        'Keep the dangerous pole; make the gain fall to 1 before it matters.',
        'For 45° the new ωgx sits exactly at fp2; for 60° at fp2·tan 30° = 0.577·fp2.',
        "f'p1 = ωgx/(βA0), then C grows by fp1/f'p1.",
        `ωgx = ${fmtHz(fgxH)}.`,
      ],
    };
    return { problem, sane: fdH < fp1 && Math.abs(fdH - r.fd) / r.fd < 1e-6 };
  },
};

export const genMiller: Generator = {
  id: 'l13-miller',
  unit: 'L13',
  title: 'Miller compensation: poles before and after (pole splitting)',
  make(rng: Rng): GeneratorOutput {
    const gm1 = pick(rng, [0.5e-3, 1e-3, 2e-3]);
    const r1 = pick(rng, [100e3, 200e3, 500e3]);
    const c1 = pick(rng, [0.1e-12, 0.2e-12, 0.5e-12]);
    const gm2 = pick(rng, [2e-3, 5e-3, 10e-3]);
    const r2 = pick(rng, [20e3, 50e3, 100e3]);
    const c2 = pick(rng, [2e-12, 5e-12, 10e-12]);
    const cc = pick(rng, [1e-12, 2e-12, 3e-12]);
    const m = millerTwoStage({ gm1, r1, c1, gm2, r2, c2, cc });
    const hz = (w: number) => w / (2 * Math.PI);
    const a2 = gm2 * r2;
    const p1a = 1 / (2 * Math.PI * r1 * a2 * cc);
    const p2a = (gm2 * cc) / (2 * Math.PI * (c1 * c2 + c2 * cc + c1 * cc));
    const problem: Problem = {
      ...base('l13-miller', 'L13', 'Miller compensation: poles before and after'),
      statement: `A two-stage op amp (Lec 17 model): first stage Gm1 = ${fmtS(gm1)}, R1 = ${fmtR(r1)}, C1 = ${fmtF(c1)}; second stage Gm2 = ${fmtS(gm2)}, R2 = ${fmtR(r2)}, C2 = ${fmtF(c2)}. Find the two poles without compensation, then with CC = ${fmtF(cc)} (use P1' ≈ 1/(R1A2CC) and P2' ≈ Gm2CC/(C1C2 + C2CC + C1CC)). Answer in Hz.`,
      figure: { kind: 'millerBlock', props: {} },
      givens: [
        { sym: 'G_{m1}', value: gm1, unit: 'S' },
        { sym: 'R_1', value: r1, unit: 'Ω' },
        { sym: 'C_1', value: c1, unit: 'F' },
        { sym: 'G_{m2}', value: gm2, unit: 'S' },
        { sym: 'R_2', value: r2, unit: 'Ω' },
        { sym: 'C_2', value: c2, unit: 'F' },
        { sym: 'C_C', value: cc, unit: 'F' },
      ],
      unknowns: [
        { key: 'f1', sym: 'P_1', label: 'Pole at node 1, no CC', unit: 'Hz' },
        { key: 'f2', sym: 'P_2', label: 'Output pole, no CC', unit: 'Hz' },
        { key: 'f1c', sym: "P_1'", label: 'Dominant pole with CC', unit: 'Hz' },
        { key: 'f2c', sym: "P_2'", label: 'Output pole with CC', unit: 'Hz' },
      ],
      answers: { f1: 1 / (2 * Math.PI * r1 * c1), f2: 1 / (2 * Math.PI * r2 * c2), f1c: hz(m.p1Approx), f2c: hz(m.p2Approx) },
      wrong: { f1c: [{ mistake: 'forgot2pi', value: m.p1Approx }], f2c: [{ mistake: 'forgot2pi', value: m.p2Approx }] },
      steps: [
        { tag: 'C', title: 'Without CC: one pole per node, 1/(2πRC)', tex: `P_1 = \\frac{1}{2\\pi R_1C_1} = ${texSI(1 / (2 * Math.PI * r1 * c1), 'Hz')}`, produces: 'f1', value: 1 / (2 * Math.PI * r1 * c1) },
        { tag: 'C', title: 'Output node', tex: `P_2 = \\frac{1}{2\\pi R_2C_2} = ${texSI(1 / (2 * Math.PI * r2 * c2), 'Hz')}`, produces: 'f2', value: 1 / (2 * Math.PI * r2 * c2) },
        { tag: 'D', title: 'Second-stage gain A2 = Gm2·R2; Miller: node 1 sees CC(1 + A2)', tex: `A_2 = ${texNum(a2)},\\; C_C(1 + A_2) = ${texSI(cc * (1 + a2), 'F')}` },
        { tag: 'C', title: "P1' ≈ 1/(R1·A2·CC): pushed way down", tex: `P_1' = ${texSI(p1a, 'Hz')}`, produces: 'f1c', value: p1a },
        { tag: 'C', title: "P2' ≈ Gm2·CC/(C1C2 + C2CC + C1CC) ≈ Gm2/C2: pushed up (CC turns M6 into a diode at high f)", tex: `P_2' = ${texSI(p2a, 'Hz')}`, produces: 'f2c', value: p2a },
        { tag: '✓', title: 'Pole splitting: the poles moved APART, one down, one up' },
      ],
      hints: [
        'A capacitor across a gain stage looks (1 + gain) times bigger from its input.',
        'Before CC: 1/(2πR1C1) and 1/(2πR2C2).',
        "After: P1' ≈ 1/(2π·R1·Gm2R2·CC); P2' ≈ Gm2·CC/(2π(C1C2 + C2CC + C1CC)).",
        `A2 = ${a2.toFixed(0)}.`,
      ],
    };
    return { problem, sane: p1a < 1 / (2 * Math.PI * r1 * c1) && p2a > 1 / (2 * Math.PI * r2 * c2) };
  },
};

/* ─── L14: compensating the two-stage op amp ─── */

export const genTwoStageComp: Generator = {
  id: 'l14-cc',
  unit: 'L14',
  title: 'Two-stage op amp: choose CC, find GBW, the RHP zero, Rz and the slew rate',
  make(rng: Rng): GeneratorOutput {
    const iss = pick(rng, [50e-6, 100e-6, 200e-6]);
    const vov1 = pick(rng, [0.15, 0.2, 0.25]);
    const gm1 = iss / vov1;
    const gm2 = gm1 * pick(rng, [5, 10, 20]);
    const cl = pick(rng, [2e-12, 5e-12, 10e-12]);
    const pmT = pick(rng, [45, 60]);
    const i7 = pick(rng, [0.5e-3, 1e-3, 2e-3]);
    const cc = ccForPhaseMargin({ gm1, gm2, cl, pm: pmT, zeroNulled: true });
    const ccH = (gm1 * cl * Math.tan(rad(pmT))) / gm2;
    const fu = gm1 / (2 * Math.PI * ccH);
    const fz = gm2 / (2 * Math.PI * ccH);
    const sr = twoStageSlewRate({ iss, cc: ccH, i7, cl });
    const problem: Problem = {
      ...base('l14-cc', 'L14', 'Two-stage op amp: CC, GBW, RHP zero, Rz, slew rate'),
      statement: `The Lec 17 two-stage op amp has ISS = ${formatUA(iss)} with input overdrive ${vov1} V, second-stage Gm2 = ${fmtS(gm2)} biased by I7 = ${fmtA(i7)}, and CL = ${fmtF(cl)}. With Rz = 1/Gm2 cancelling the zero, choose CC for PM = ${pmT}° in unity-gain feedback (take ωp2 ≈ Gm2/CL). Then find the GBW, where the RHP zero would have been without Rz, Rz itself and the slew rate.`,
      figure: { kind: 'twoStageMiller', props: { rz: true } },
      givens: [
        { sym: 'I_{SS}', value: iss, unit: 'A' },
        { sym: 'V_{ov1}', value: vov1, unit: 'V' },
        { sym: 'G_{m2}', value: gm2, unit: 'S' },
        { sym: 'I_7', value: i7, unit: 'A' },
        { sym: 'C_L', value: cl, unit: 'F' },
      ],
      unknowns: [
        { key: 'cc', sym: 'C_C', label: 'Compensation capacitor', unit: 'F' },
        { key: 'fu', sym: 'f_u', label: 'GBW = Gm1/(2πCC)', unit: 'Hz' },
        { key: 'fz', sym: 'f_z', label: 'RHP zero without Rz', unit: 'Hz' },
        { key: 'rz', sym: 'R_z', label: 'Nulling resistor', unit: 'Ω' },
        { key: 'sr', sym: 'SR', label: 'Slew rate', unit: 'V/s' },
      ],
      answers: { cc, fu: gm1 / (2 * Math.PI * cc), fz: gm2 / (2 * Math.PI * cc), rz: rzNull(gm2), sr: sr.sr },
      wrong: { cc: [{ mistake: 'wrongPmTan', value: (gm1 * cl) / (gm2 * Math.tan(rad(pmT))) }], fu: [{ mistake: 'forgot2pi', value: gm1 / ccH }], sr: [{ mistake: 'aInsteadOfInvBeta', value: iss / cl }] },
      steps: [
        { tag: 'C', title: 'Gm1 = 2(ISS/2)/Vov1 = ISS/Vov1', tex: `G_{m1} = ${texSI(gm1, 'S')}` },
        { tag: '·', title: 'Dominant pole gives −90°; the output pole may take only 90° − PM: ωp2 = ωu·tan PM', tex: `\\frac{G_{m2}}{C_L} = \\frac{G_{m1}}{C_C}\\tan ${pmT}^\\circ \\Rightarrow C_C = \\frac{G_{m1}C_L\\tan ${pmT}^\\circ}{G_{m2}} = ${texSI(ccH, 'F')}`, produces: 'cc', value: ccH },
        { tag: '·', title: 'GBW: the first stage charges CC', tex: `f_u = \\frac{G_{m1}}{2\\pi C_C} = ${texSI(fu, 'Hz')}`, produces: 'fu', value: fu },
        { tag: '·', title: 'The feed-forward path through CC makes a RHP zero at Gm2/CC (it would cost atan(Gm1/Gm2) of phase)', tex: `f_z = \\frac{G_{m2}}{2\\pi C_C} = ${texSI(fz, 'Hz')}`, produces: 'fz', value: fz },
        { tag: '·', title: 'Rz = 1/Gm2 pushes that zero to infinity (Razavi Eq. 10.30)', tex: `R_z = ${texSI(1 / gm2, 'Ω')}`, produces: 'rz', value: 1 / gm2 },
        { tag: '✓', title: 'Slewing: ISS charges CC (SR = ISS/CC) unless I7 cannot also feed CL: then (I7 − ISS)/CL', tex: `SR = \\min\\left(\\frac{I_{SS}}{C_C}, \\frac{I_7 - I_{SS}}{C_L}\\right) = ${texSI(Math.min(iss / ccH, (i7 - iss) / cl), 'V/s')}`, produces: 'sr', value: Math.min(iss / ccH, (i7 - iss) / cl) },
      ],
      hints: [
        'GBW = Gm1/CC; the second pole ≈ Gm2/CL must sit far enough above it.',
        '45°: ωp2 = ωu. 60°: ωp2 = 1.73·ωu.',
        'CC = Gm1·CL·tan(PM)/Gm2; fz = Gm2/(2πCC); Rz = 1/Gm2; SR = ISS/CC.',
        `Gm1 = ${(gm1 * 1e3).toFixed(2)} mS.`,
      ],
    };
    return { problem, sane: Math.abs(ccH - cc) / cc < 1e-9 && i7 > iss };
  },
};

/* ─── L13: a one-stage op amp is compensated by its own load (Razavi HO #12) ─── */

export const genOneStage: Generator = {
  id: 'l13-onestage',
  unit: 'L13',
  title: 'One-stage op amp: CL is the dominant pole; find PM and the smallest CL',
  make(rng: Rng): GeneratorOutput {
    const iss = pick(rng, [100e-6, 200e-6, 400e-6, 500e-6]);
    const vov = pick(rng, [0.15, 0.2, 0.25]);
    const gm = iss / vov; // each input device: 2(ISS/2)/Vov
    const rout = pick(rng, [0.5e6, 1e6, 2e6]);
    const fnd = pick(rng, [100e6, 200e6, 300e6, 500e6]);
    const beta = pick(rng, [1, 1, 0.5]);
    const cl = pick(rng, [0.5e-12, 1e-12, 2e-12, 3e-12]);
    const pmT = pick(rng, [60, 70]);
    const gbw = gm / (2 * Math.PI * cl);
    const pm = oneStagePmHand({ gm, cl, fnd, beta });
    const clMin = clForPhaseMargin({ gm, fnd, pm: pmT, beta });
    const exact = phaseMargin(oneStageLoop({ gm, rout, cl, fnd, beta }));
    // Hand route.
    const fgxH = (beta * gm) / (2 * Math.PI * cl);
    const pmH = 90 - deg(Math.atan(fgxH / fnd));
    const clH = (beta * gm) / (2 * Math.PI * fnd * Math.tan(rad(90 - pmT)));
    const problem: Problem = {
      ...base('l13-onestage', 'L13', 'One-stage op amp: CL is the dominant pole'),
      statement: `A telescopic op amp has ISS = ${formatUA(iss)}, input overdrive ${vov} V, Rout = ${fmtR(rout)} and drives CL = ${fmtF(cl)}. Its only other pole (the mirror/cascode node) is at ${fmtHz(fnd)}. It is used with β = ${beta}. With the hand method (the output pole gives −90° at ωgx, and fgx ≈ β·gm/(2πCL)), find (a) gm, (b) the GBW in Hz, (c) the phase margin, and (d) the smallest CL for PM = ${pmT}°.`,
      figure: { kind: 'loopBode', props: { spec: oneStageLoop({ gm, rout, cl, fnd, beta }) } },
      givens: [
        { sym: 'I_{SS}', value: iss, unit: 'A' },
        { sym: 'V_{ov1}', value: vov, unit: 'V' },
        { sym: 'R_{out}', value: rout, unit: 'Ω' },
        { sym: 'C_L', value: cl, unit: 'F' },
        { sym: 'f_{nd}', value: fnd, unit: 'Hz' },
        { sym: '\\beta', value: beta, unit: '' },
      ],
      unknowns: [
        { key: 'gm', sym: 'g_{m1}', label: 'gm of the input pair', unit: 'S' },
        { key: 'gbw', sym: 'f_u', label: 'GBW = gm/(2πCL)', unit: 'Hz' },
        { key: 'pm', sym: 'PM', label: 'Phase margin (hand method)', unit: '°', tol: 0.01 },
        { key: 'clMin', sym: 'C_{L,min}', label: `Smallest CL for PM = ${pmT}°`, unit: 'F' },
      ],
      answers: { gm, gbw, pm, clMin },
      wrong: {
        gm: [{ mistake: 'issNotHalf', value: (2 * iss) / vov }],
        gbw: [{ mistake: 'forgot2pi', value: gm / cl }],
        clMin: [{ mistake: 'wrongPmTan', value: (beta * gm) / (2 * Math.PI * fnd * Math.tan(rad(pmT))) }],
      },
      steps: [
        { tag: 'C', title: 'Each input device carries ISS/2: gm = 2(ISS/2)/Vov', tex: `g_{m1} = \\frac{I_{SS}}{V_{ov1}} = ${texSI(iss / vov, 'S')}`, produces: 'gm', value: iss / vov },
        { tag: 'D', title: 'The output node is the dominant pole; above it the gain is gm/(ωCL)', tex: `f_u = \\frac{g_{m1}}{2\\pi C_L} = ${texSI((iss / vov) / (2 * Math.PI * cl), 'Hz')}`, produces: 'gbw', value: (iss / vov) / (2 * Math.PI * cl) },
        { tag: '·', title: 'Loop crossover fgx ≈ β·fu; the internal pole takes atan(fgx/fnd)', tex: `PM = 90^\\circ - \\tan^{-1}\\frac{${texSI(fgxH, 'Hz')}}{${texSI(fnd, 'Hz')}} = ${texSI(pmH, '°')}`, produces: 'pm', value: pmH },
        { tag: '✓', title: `For ${pmT}°: the internal pole may use ${90 - pmT}°, so fgx = fnd·tan(${90 - pmT}°); CL = β·gm/(2π·fgx)`, tex: `C_L = \\frac{\\beta g_{m1}}{2\\pi f_{nd}\\tan(${90 - pmT}^\\circ)} = ${texSI(clH, 'F')}`, produces: 'clMin', value: clH },
      ],
      hints: [
        'In a one-stage op amp the load capacitor is the compensation: the output node is the dominant pole.',
        'A bigger CL lowers fu = gm/(2πCL) while the internal pole stays put: more margin, less speed.',
        'PM ≈ 90° − atan(β·fu/fnd); for a target PM, fnd·tan(90° − PM) = β·gm/(2πCL).',
        `gm = ISS/Vov = ${(gm * 1e3).toFixed(2)} mS.`,
      ],
    };
    return { problem, sane: Math.abs(pm - pmH) < 1e-9 && Math.abs(clMin - clH) / clH < 1e-9 && pm > 20 && pm < 88 && Math.abs(exact - pm) < 5 && gm * rout > 100 };
  },
};

function fmtHz(f: number) {
  const units: Array<[number, string]> = [[1e9, 'GHz'], [1e6, 'MHz'], [1e3, 'kHz'], [1, 'Hz']];
  const [k, u] = units.find(([k]) => f >= k) ?? [1, 'Hz'];
  return `${Number((f / k).toPrecision(3))} ${u}`;
}
function fmtS(x: number) {
  return `${Number((x * 1e3).toPrecision(3))} mS`;
}
function fmtA(x: number) {
  return x >= 1e-3 ? `${Number((x * 1e3).toPrecision(3))} mA` : formatUA(x);
}
function fmtR(x: number) {
  return x >= 1e6 ? `${Number((x / 1e6).toPrecision(3))} MΩ` : `${Number((x / 1e3).toPrecision(3))} kΩ`;
}
function fmtF(x: number) {
  return `${Number((x * 1e12).toPrecision(3))} pF`;
}

export const STABILITY_GENERATORS: Generator[] = [genReplica, genPsrr, genKtc, genNoise, genOnePoleLoop, genTwoPolePm, genA0ForPm, genDominant, genOneStage, genMiller, genTwoStageComp];
