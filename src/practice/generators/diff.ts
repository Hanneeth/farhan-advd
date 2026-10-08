/**
 * Generators for Milestone 3 (U10–U12): differential-pair bias and CMIR (Tutorial 1 Q1 style), current
 * steering, differential/common-mode gain and CMRR (Tutorial 1 Q4 style), the five-transistor OTA in the
 * analysis and design directions (exam style), poles and GBW, settling and slew rate.
 * Direct answers from src/physics; traced values from the arithmetic in each step.
 */
import {
  cmGain,
  db,
  fiveTDesignFromCmLimits,
  fiveTransistorOta,
  gbwOneStage,
  gmAtBalance,
  gmFromIdVov,
  pole,
  rO,
  settlingTime,
  slewRate,
  steering,
  tauClosed,
  toHz,
  vovFromId,
  wlFromId,
  type Process,
} from '../../physics';
import { nice, pick, type Rng } from '../rng';
import type { Generator, GeneratorOutput, Problem } from '../schema';
import { texNum, texSI } from '../tex';

function base(id: string, unit: string, title: string): Pick<Problem, 'id' | 'generator' | 'source' | 'tags' | 'title'> {
  return { id, generator: id, source: 'generated', tags: [unit], title };
}
const par = (a: number, b: number) => (a * b) / (a + b);

// ─── U10: bias a differential pair (Tutorial 1 Q1 style) ───────────────────

export const genPairBias: Generator = {
  id: 'u10-pair-bias',
  unit: 'U10',
  title: 'Design a differential pair and its tail mirror; find the CM input range',
  make(rng: Rng): GeneratorOutput {
    const vdd = pick(rng, [0.9, 1.2, 1.5]);
    const vss = -vdd;
    const vth = pick(rng, [0.3, 0.35, 0.4, 0.5]);
    const vov = nice(rng, 0.1, 0.25, 0.05);
    const kp = pick(rng, [200e-6, 300e-6, 400e-6]);
    const iss = nice(rng, 100e-6, 500e-6, 50e-6);
    const iref = pick(rng, [iss / 2, iss]);
    const vd = pick(rng, [0, 0.1, 0.2]);
    const id = iss / 2;
    const vgs = vth + vov;
    const rd = (vdd - vd) / id;
    const wl12 = wlFromId(id, kp, vov);
    const wl3 = wlFromId(iss, kp, vov);
    const r = (vdd - (vss + vgs)) / iref;
    const cmMin = vss + vov + vgs;
    const cmMax = vd + vth;
    const problem: Problem = {
      ...base('u10-pair-bias', 'U10', 'Design a differential pair and its tail mirror; find the CM input range'),
      statement: `Split supplies ±${vdd} V. Q1, Q2 form the pair; Q3 is the tail source, mirrored from diode-connected Q4, which is fed from VDD through R with IREF. All devices run at the same Vov (λ = 0). With both gates at 0 V, the drains must sit at ${vd} V. Find RD, (W/L)1,2, (W/L)3, R and the input common-mode range.`,
      figure: { kind: 'diffPair', props: { vdd, vss, iss, kp, wl: wl12, vth, vin1: 0, vin2: 0, rd, tail: 'mirror', wlTail: wl3, r, names: ['Q1', 'Q2', 'Q3', 'Q4'] } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_{SS}', value: vss, unit: 'V' },
        { sym: 'I_{SS}', value: iss, unit: 'A' },
        { sym: 'I_{REF}', value: iref, unit: 'A' },
        { sym: 'V_{ov}', value: vov, unit: 'V' },
        { sym: 'V_{th}', value: vth, unit: 'V' },
        { sym: '\\mu_n C_{ox}', value: kp, unit: 'A/V²' },
      ],
      unknowns: [
        { key: 'rd', sym: 'R_D', label: 'Drain resistors', unit: 'Ω' },
        { key: 'wl12', sym: '(W/L)_{1,2}', label: 'Input devices', unit: '' },
        { key: 'wl3', sym: '(W/L)_3', label: 'Tail device', unit: '' },
        { key: 'r', sym: 'R', label: 'Reference resistor', unit: 'Ω' },
        { key: 'cmMin', sym: 'V_{in,CM,min}', label: 'Lowest input CM', unit: 'V' },
        { key: 'cmMax', sym: 'V_{in,CM,max}', label: 'Highest input CM', unit: 'V' },
      ],
      answers: { rd, wl12, wl3, r, cmMin, cmMax },
      wrong: {
        rd: [{ mistake: 'issNotHalf', value: (vdd - vd) / iss }],
        wl12: [{ mistake: 'issNotHalf', value: wlFromId(iss, kp, vov) }, { mistake: 'forgotHalf', value: wl12 / 2 }],
        wl3: [{ mistake: 'issNotHalf', value: wl12 }],
        r: [{ mistake: 'diodeThreshold', value: (vdd - (vss + vov)) / iref }],
        cmMin: [{ mistake: 'vovNotVgs', value: vss + 2 * vov }],
        cmMax: [{ mistake: 'forgotSatCheck', value: vdd }],
      },
      steps: [
        { tag: 'A', title: 'Each input device carries half the tail current', tex: `I_{D1,2} = \\frac{I_{SS}}{2} = ${texSI(id, 'A')}` },
        { tag: 'A', title: 'Walk the drain node: RD drops VDD − VD', tex: `R_D = \\frac{V_{DD} - V_D}{I_{SS}/2} = \\frac{${texNum(vdd)} - ${texNum(vd)}}{${texSI(id, 'A')}} = ${texSI((vdd - vd) / id, 'Ω')}`, produces: 'rd', value: (vdd - vd) / id, highlight: ['rd1', 'rd2'] },
        { tag: 'A', title: 'Size the inputs for Vov at ISS/2', tex: `\\left(\\tfrac{W}{L}\\right)_{1,2} = \\frac{2 I_D}{\\mu_n C_{ox} V_{ov}^2} = ${texNum((2 * id) / (kp * vov * vov))}`, produces: 'wl12', value: (2 * id) / (kp * vov * vov), highlight: ['m1', 'm2'] },
        { tag: 'A', title: 'The tail carries all of ISS at the same Vov', tex: `\\left(\\tfrac{W}{L}\\right)_3 = \\frac{2 I_{SS}}{\\mu_n C_{ox} V_{ov}^2} = ${texNum((2 * iss) / (kp * vov * vov))}`, produces: 'wl3', value: (2 * iss) / (kp * vov * vov), highlight: ['m3'] },
        { tag: 'A', title: 'Q4 is a diode: its drain sits a full VGS above VSS. R drops the rest', tex: `R = \\frac{V_{DD} - (V_{SS} + V_{GS})}{I_{REF}} = \\frac{${texNum(vdd)} - (${texNum(vss)} + ${texNum(vgs)})}{${texSI(iref, 'A')}} = ${texSI((vdd - (vss + vth + vov)) / iref, 'Ω')}`, produces: 'r', value: (vdd - (vss + vth + vov)) / iref, highlight: ['m4', 'r'] },
        { tag: '✓', title: 'CM floor: the tail needs Vov, then Q1 needs its full VGS', tex: `V_{in,CM,min} = V_{SS} + V_{ov3} + V_{GS1} = ${texSI(vss + vov + vth + vov, 'V')}`, produces: 'cmMin', value: vss + vov + vth + vov, highlight: ['m3', 'm1'] },
        { tag: '✓', title: 'CM ceiling: Q1 fence, gate may rise to VD + Vth', tex: `V_{in,CM,max} = V_D + V_{th} = ${texSI(vd + vth, 'V')}`, produces: 'cmMax', value: vd + vth, highlight: ['m1'] },
      ],
      hints: [
        'Start from what is fixed: the tail current splits in two, and every device runs at the same Vov.',
        'DC recipe for each branch: current → size (W/L from the square law) → walk the node voltages.',
        'ID = ISS/2; RD = (VDD − VD)/ID; W/L = 2I/(µnCox·Vov²); R = (VDD − VSS − VGS)/IREF; CMIR = [VSS + Vov + VGS, VD + Vth].',
        `ID1,2 = ${(id * 1e6).toFixed(0)} µA and VGS = ${vgs.toFixed(2)} V.`,
      ],
      flags: ['Tutorial 1 uses Sedra–Smith symbols: k′n = µnCox, Vt = Vth.'],
    };
    return { problem, sane: rd > 0 && r > 0 && cmMax > cmMin + 0.05 };
  },
};

// ─── U10: current steering ─────────────────────────────────────────────────

export const genSteering: Generator = {
  id: 'u10-steering',
  unit: 'U10',
  title: 'Current steering: how far must vd go to switch the pair?',
  make(rng) {
    const kp = pick(rng, [100e-6, 200e-6, 400e-6]);
    const wl = pick(rng, [5, 10, 20, 40]);
    const iss = nice(rng, 100e-6, 400e-6, 50e-6);
    const frac = pick(rng, [0.25, 0.5, 0.75]);
    const vov = vovFromId(iss / 2, kp, wl);
    const full = Math.SQRT2 * vov;
    const dv = Number((frac * full).toFixed(3));
    const s = steering({ kp, wl, iss, dvin: dv });
    const gm = gmAtBalance(kp, wl, iss);
    const vovTr = Math.sqrt(iss / (kp * wl));
    const k = kp * wl;
    const id1Tr = (iss + 0.5 * k * dv * Math.sqrt((4 * iss) / k - dv * dv)) / 2;
    const problem: Problem = {
      ...base('u10-steering', 'U10', 'Current steering: how far must vd go to switch the pair?'),
      statement: `An NMOS pair (λ = 0) shares a tail current ISS. Find the overdrive at balance, gm of each device, the differential input that steers ALL the current to one side, and ID1 when vd = Vin1 − Vin2 = ${dv * 1000} mV.`,
      figure: { kind: 'steering', props: { kp, wl, iss, dvin: dv } },
      givens: [
        { sym: 'I_{SS}', value: iss, unit: 'A' },
        { sym: '\\mu_n C_{ox}', value: kp, unit: 'A/V²' },
        { sym: 'W/L', value: wl, unit: '' },
        { sym: 'v_d', value: dv, unit: 'V' },
      ],
      unknowns: [
        { key: 'vov', sym: 'V_{ov}', label: 'Overdrive at balance', unit: 'V' },
        { key: 'gm', sym: 'g_m', label: 'gm of each device at balance', unit: 'S' },
        { key: 'full', sym: 'v_{d,max}', label: 'vd for full steering', unit: 'V' },
        { key: 'id1', sym: 'I_{D1}', label: 'ID1 at the given vd', unit: 'A' },
      ],
      answers: { vov, gm, full, id1: s.id1 },
      wrong: { vov: [{ mistake: 'issNotHalf', value: vovFromId(iss, kp, wl) }], full: [{ mistake: 'forgotSatCheck', value: vov }], gm: [{ mistake: 'issNotHalf', value: Math.sqrt(2 * kp * wl * iss) }] },
      steps: [
        { tag: 'A', title: 'At balance each side carries ISS/2', tex: `V_{ov} = \\sqrt{\\frac{2(I_{SS}/2)}{\\mu_n C_{ox} W/L}} = \\sqrt{\\frac{I_{SS}}{\\mu_n C_{ox} W/L}} = ${texSI(vovTr, 'V')}`, produces: 'vov', value: vovTr },
        { tag: 'C', title: 'gm at balance', tex: `g_m = \\frac{2(I_{SS}/2)}{V_{ov}} = \\frac{I_{SS}}{V_{ov}} = ${texSI(iss / vovTr, 'S')}`, produces: 'gm', value: iss / vovTr },
        { tag: 'A', title: 'All the current moves to one side at √2 times the balance overdrive', tex: `v_{d,max} = \\sqrt{2}\\,V_{ov} = ${texSI(Math.SQRT2 * vovTr, 'V')}`, produces: 'full', value: Math.SQRT2 * vovTr },
        { tag: 'A', title: 'Steering law (valid while |vd| < √2·Vov)', tex: `I_{D1} = \\frac{I_{SS}}{2} + \\frac{1}{4}\\mu_n C_{ox}\\tfrac{W}{L} v_d\\sqrt{\\frac{4 I_{SS}}{\\mu_n C_{ox} W/L} - v_d^2} = ${texSI(id1Tr, 'A')}`, produces: 'id1', value: id1Tr },
        { tag: '✓', title: 'Small-signal check: ID1 ≈ ISS/2 + gm·vd/2', tex: `${texSI(iss / 2 + (gm * dv) / 2, 'A')}\\;(\\text{linear estimate})` },
      ],
      hints: [
        'At balance the tail splits evenly. Where does all of it go when vd is large?',
        'Vov at balance uses ISS/2; full steering happens at √2·Vov.',
        'ID1 − ID2 = ½µnCox(W/L)·vd·√(4ISS/(µnCox W/L) − vd²), and ID1 + ID2 = ISS.',
        `Vov = ${(vovTr * 1000).toFixed(0)} mV.`,
      ],
    };
    return { problem, sane: dv > 0 && dv < full && vov > 0.08 && vov < 0.6 };
  },
};

// ─── U10: DM gain, CM gain, CMRR (Tutorial 1 Q4 style) ─────────────────────

export const genCmGain: Generator = {
  id: 'u10-cm',
  unit: 'U10',
  title: 'Half circuits: Ad, ACM with 2RSS, and CMRR',
  make(rng) {
    const iss = nice(rng, 0.2e-3, 2e-3, 0.1e-3);
    const vov = nice(rng, 0.15, 0.4, 0.05);
    const rd = nice(rng, 2e3, 20e3, 1e3);
    const rss = nice(rng, 1e3, 20e3, 1e3);
    const id = iss / 2;
    const gm = gmFromIdVov(id, vov);
    const ad = gm * rd;
    const acm = cmGain({ gm, rd, rss });
    const cmrr = db(ad / acm);
    const gmTr = (2 * id) / vov;
    const acmTr = -rd / (1 / gmTr + 2 * rss);
    const problem: Problem = {
      ...base('u10-cm', 'U10', 'Half circuits: Ad, ACM with 2RSS, and CMRR'),
      statement: 'A resistively loaded NMOS pair (λ = 0) has its tail set by a resistor RSS carrying ISS. Find gm, the differential gain Ad = Δ(Vout1 − Vout2)/vd, the single-ended common-mode gain ACM = ΔVD1/ΔVCM, and CMRR = |Ad/ACM| in dB.',
      figure: { kind: 'halfCircuit', props: { mode: 'cm', rd, rss } },
      givens: [
        { sym: 'I_{SS}', value: iss, unit: 'A' },
        { sym: 'V_{ov}', value: vov, unit: 'V' },
        { sym: 'R_D', value: rd, unit: 'Ω' },
        { sym: 'R_{SS}', value: rss, unit: 'Ω' },
      ],
      unknowns: [
        { key: 'gm', sym: 'g_m', label: 'gm of each device', unit: 'S' },
        { key: 'ad', sym: 'A_d', label: 'Differential gain (magnitude)', unit: 'V/V' },
        { key: 'acm', sym: 'A_{CM}', label: 'CM gain (with sign)', unit: 'V/V' },
        { key: 'cmrr', sym: '\\text{CMRR}', label: 'CMRR (dB)', unit: '' },
      ],
      answers: { gm, ad, acm, cmrr },
      wrong: {
        gm: [{ mistake: 'issNotHalf', value: (2 * iss) / vov }],
        acm: [{ mistake: 'rssNot2rss', value: -rd / (1 / gm + rss) }, { mistake: 'forgotDegeneration', value: -rd / (2 * rss) }],
        cmrr: [{ mistake: 'dbConversion', value: 10 * Math.log10(ad / Math.abs(acm)) }, { mistake: 'rssNot2rss', value: db((ad * (1 / gm + rss)) / rd) }],
        ad: [{ mistake: 'issNotHalf', value: ((2 * iss) / vov) * rd }],
      },
      steps: [
        { tag: 'C', title: 'Each device carries ISS/2', tex: `g_m = \\frac{2(I_{SS}/2)}{V_{ov}} = ${texSI(gmTr, 'S')}`, produces: 'gm', value: gmTr },
        { tag: 'D', title: 'DM half circuit: the tail node P does not move (AC ground), so each half is a plain CS stage', tex: `A_d = g_m R_D = ${texNum(gmTr * rd)}`, produces: 'ad', value: gmTr * rd },
        { tag: 'C', title: 'CM half circuit: both halves push the same current through RSS, so each half sees 2RSS', tex: `\\text{source path} = \\frac{1}{g_m} + 2R_{SS} = ${texSI(1 / gmTr + 2 * rss, 'Ω')}` },
        { tag: 'D', title: 'Ratio rule', tex: `A_{CM} = -\\frac{R_D}{1/g_m + 2R_{SS}} = ${texNum(acmTr, 4)}`, produces: 'acm', value: acmTr },
        { tag: '·', title: 'CMRR in dB: 20·log of the ratio', tex: `\\text{CMRR} = 20\\log_{10}\\frac{${texNum(gmTr * rd)}}{${texNum(Math.abs(acmTr), 3)}} = ${texNum(20 * Math.log10((gmTr * rd) / Math.abs(acmTr)), 4)}\\,\\text{dB}`, produces: 'cmrr', value: 20 * Math.log10((gmTr * rd) / Math.abs(acmTr)) },
      ],
      hints: [
        'Split the problem: a differential half circuit and a common-mode half circuit.',
        'DM: the tail node is AC ground. CM: each half sees 2RSS under its source.',
        'Ad = gm·RD; ACM = −RD/(1/gm + 2RSS); CMRR = 20·log10|Ad/ACM|.',
        `gm = ${(gmTr * 1e3).toPrecision(3)} mA/V.`,
      ],
      flags: ['Ad here is the differential-output gain Δ(Vout1 − Vout2)/vd = gm·RD (Tutorial 1 Q4 convention).'],
    };
    return { problem, sane: true };
  },
};

// ─── U11: five-transistor OTA, analysis direction ──────────────────────────

function randomProc(rng: Rng): Process {
  return {
    name: 'generated',
    kpn: pick(rng, [100e-6, 200e-6, 300e-6]),
    kpp: pick(rng, [50e-6, 100e-6]),
    vthn: pick(rng, [0.4, 0.45, 0.5]),
    vthp: pick(rng, [0.4, 0.5]),
    lambdan: pick(rng, [0.05, 0.1]),
    lambdap: pick(rng, [0.05, 0.1, 0.2]),
    vdd: pick(rng, [1.8, 2.5, 3.3]),
  };
}

export const genOtaAnalysis: Generator = {
  id: 'u11-ota',
  unit: 'U11',
  title: 'Five-transistor OTA: gain, CM range, swing',
  make(rng) {
    const proc = randomProc(rng);
    const iss = nice(rng, 50e-6, 400e-6, 10e-6);
    const wl12 = pick(rng, [10, 20, 30, 50]);
    const wl34 = pick(rng, [10, 20, 40, 60]);
    const viss = nice(rng, 0.15, 0.35, 0.05);
    const o = fiveTransistorOta({ proc, iss, wl12, wl34, viss });
    const id = iss / 2;
    const vov1 = Math.sqrt((2 * id) / (proc.kpn * wl12));
    const vov3 = Math.sqrt((2 * id) / (proc.kpp * wl34));
    const gm1 = (2 * id) / vov1;
    const ro2 = 1 / (proc.lambdan * id), ro4 = 1 / (proc.lambdap * id);
    const av = gm1 * par(ro2, ro4);
    const cmMin = viss + proc.vthn + vov1;
    const cmMax = proc.vdd - (proc.vthp + vov3) + proc.vthn;
    const outMax = proc.vdd - vov3;
    const outMin = viss + vov1;
    const problem: Problem = {
      ...base('u11-ota', 'U11', 'Five-transistor OTA: gain, CM range, swing'),
      statement: 'An NMOS-input five-transistor OTA (M1,2 input, M3,4 PMOS mirror, tail M5 needing VISS) carries ISS. Find gm1, the gain, the input CM range, and the output range.',
      figure: { kind: 'fiveT', props: { proc, iss, wl12, wl34, wlTail: wlFromId(iss, proc.kpn, viss), vinCm: (o.vinCmMin + o.vinCmMax) / 2 } },
      givens: [
        { sym: 'V_{DD}', value: proc.vdd, unit: 'V' },
        { sym: 'I_{SS}', value: iss, unit: 'A' },
        { sym: '\\mu_n C_{ox}', value: proc.kpn, unit: 'A/V²' },
        { sym: '\\mu_p C_{ox}', value: proc.kpp, unit: 'A/V²' },
        { sym: 'V_{thn}', value: proc.vthn, unit: 'V' },
        { sym: '|V_{thp}|', value: proc.vthp, unit: 'V' },
        { sym: '\\lambda_n', value: proc.lambdan, unit: '' },
        { sym: '\\lambda_p', value: proc.lambdap, unit: '' },
        { sym: '(W/L)_{1,2}', value: wl12, unit: '' },
        { sym: '(W/L)_{3,4}', value: wl34, unit: '' },
        { sym: 'V_{ISS}', value: viss, unit: 'V' },
      ],
      unknowns: [
        { key: 'gm', sym: 'g_{m1}', label: 'gm of M1', unit: 'S' },
        { key: 'av', sym: 'A_v', label: 'Gain magnitude', unit: 'V/V' },
        { key: 'cmMin', sym: 'V_{in,CM,min}', label: 'Lowest input CM', unit: 'V' },
        { key: 'cmMax', sym: 'V_{in,CM,max}', label: 'Highest input CM', unit: 'V' },
        { key: 'outMin', sym: 'V_{out,min}', label: 'Lowest output', unit: 'V' },
        { key: 'outMax', sym: 'V_{out,max}', label: 'Highest output', unit: 'V' },
      ],
      answers: { gm: o.gm1, av: o.av, cmMin: o.vinCmMin, cmMax: o.vinCmMax, outMin: o.voutMin, outMax: o.voutMax },
      wrong: {
        gm: [{ mistake: 'issNotHalf', value: gmFromIdVov(iss, vovFromId(iss, proc.kpn, wl12)) }],
        av: [{ mistake: 'roNotHalf', value: gm1 * ro2 }],
        cmMin: [{ mistake: 'vovNotVgs', value: viss + vov1 }],
        cmMax: [{ mistake: 'diodeThreshold', value: proc.vdd - vov3 + proc.vthn }],
      },
      steps: [
        { tag: 'A', title: 'Each side carries ISS/2; overdrives from the square law', tex: `V_{ov1} = \\sqrt{\\tfrac{2 I_D}{\\mu_n C_{ox}(W/L)_1}} = ${texSI(vov1, 'V')},\\;|V_{ov3}| = ${texSI(vov3, 'V')}` },
        { tag: 'B', title: 'Roles: M1,2 input (CS into the output); M3 diode; M4 mirror copy = current source (rO); M5 tail', highlight: ['m1', 'm2', 'm3', 'm4'] },
        { tag: 'C', title: 'Gm = gm1: the mirror recovers the half that went through M1', tex: `G_m = g_{m1} = \\frac{2 I_D}{V_{ov1}} = ${texSI(gm1, 'S')}`, produces: 'gm', value: gm1 },
        { tag: 'D', title: 'Output node sees rO2 ‖ rO4', tex: `A_v = g_{m1}(r_{O2}\\parallel r_{O4}) = ${texSI(gm1, 'S')}\\times(${texSI(ro2, 'Ω')}\\parallel ${texSI(ro4, 'Ω')}) = ${texNum(av)}`, produces: 'av', value: av, highlight: ['out'] },
        { tag: '✓', title: 'CM floor: tail headroom + VGS1', tex: `V_{in,CM,min} = V_{ISS} + V_{GS1} = ${texSI(cmMin, 'V')}`, produces: 'cmMin', value: cmMin, highlight: ['m5', 'm1'] },
        { tag: '✓', title: 'CM ceiling: M1 fence against the diode node VDD − |VGS3|', tex: `V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{thn} = ${texSI(cmMax, 'V')}`, produces: 'cmMax', value: cmMax, highlight: ['m3', 'm1'] },
        { tag: '✓', title: 'Output floor (input CM at its lowest): VISS + Vov2', tex: `V_{out,min} = V_{ISS} + V_{ov2} = ${texSI(outMin, 'V')}`, produces: 'outMin', value: outMin },
        { tag: '✓', title: 'Output ceiling: M4 needs |Vov4|', tex: `V_{out,max} = V_{DD} - |V_{ov4}| = ${texSI(outMax, 'V')}`, produces: 'outMax', value: outMax },
      ],
      hints: [
        'The 5-T OTA is a differential pair whose mirror turns the two drain currents into one output.',
        'Gain: Gm = gm1, Rout = rO2 ‖ rO4. CM range: floor VISS + VGS1, ceiling VDD − |VGS3| + Vthn.',
        'Av = gm1(rO2 ‖ rO4); Vout ∈ [VISS + Vov2, VDD − |Vov4|].',
        `ID = ${(id * 1e6).toFixed(0)} µA per side.`,
      ],
    };
    return { problem, sane: o.vinCmMax > o.vinCmMin + 0.1 && o.voutMax > o.voutMin + 0.2 && Math.abs(av - o.av) < 1e-9 * av };
  },
};

// ─── U11: five-transistor OTA, design direction (the exam) ─────────────────

export const genOtaDesign: Generator = {
  id: 'u11-ota-design',
  unit: 'U11',
  title: 'Five-transistor OTA design: sizes from the CM range (exam style)',
  make(rng) {
    const proc: Process = { name: 'Set B', kpn: 200e-6, kpp: 100e-6, vthn: 0.4, vthp: 0.5, lambdan: 0.05, lambdap: 0.1, vdd: 1.8 };
    const iRef = nice(rng, 80e-6, 240e-6, 20e-6);
    const wlTail = pick(rng, [20, 25, 30, 40, 50]);
    const cmMin = nice(rng, 0.7, 0.9, 0.05);
    const cmMax = nice(rng, 1.3, 1.55, 0.05);
    const d = fiveTDesignFromCmLimits({ proc, iss: iRef, wlTail, vinCmMin: cmMin, vinCmMax: cmMax });
    const ota = fiveTransistorOta({ proc, iss: iRef, wl12: d.wl12, wl34: d.wl34, viss: d.vov5 });
    const vov5 = Math.sqrt((2 * iRef) / (proc.kpn * wlTail));
    const vov1 = cmMin - vov5 - proc.vthn;
    const vgs3 = proc.vdd - cmMax + proc.vthn;
    const vov3 = vgs3 - proc.vthp;
    const id = iRef / 2;
    const wl1 = (2 * id) / (proc.kpn * vov1 * vov1);
    const wl3 = (2 * id) / (proc.kpp * vov3 * vov3);
    const gm1 = (2 * id) / vov1;
    const av = gm1 * par(1 / (proc.lambdan * id), 1 / (proc.lambdap * id));
    const problem: Problem = {
      ...base('u11-ota-design', 'U11', 'Five-transistor OTA design: sizes from the CM range (exam style)'),
      statement: `As in your exam: I1 = ${(iRef * 1e6).toFixed(0)} µA feeds diode M6; (W/L)5 = (W/L)6 = ${wlTail}; Vin,CM,min = ${cmMin} V and Vin,CM,max = ${cmMax} V. µnCox = 200 µA/V², µpCox = 100 µA/V², Vthn = 0.4 V, |Vthp| = 0.5 V, VDD = 1.8 V, λn = 0.05, λp = 0.1 V⁻¹. Size M1 and M3 and find the gain.`,
      figure: { kind: 'fiveT', props: { proc, iss: iRef, wl12: d.wl12, wl34: d.wl34, wlTail, vinCm: (cmMin + cmMax) / 2, bias: true } },
      givens: [
        { sym: 'I_1', value: iRef, unit: 'A' },
        { sym: '(W/L)_{5,6}', value: wlTail, unit: '' },
        { sym: 'V_{in,CM,min}', value: cmMin, unit: 'V' },
        { sym: 'V_{in,CM,max}', value: cmMax, unit: 'V' },
      ],
      unknowns: [
        { key: 'wl1', sym: '(W/L)_{1,2}', label: 'Size of M1, M2', unit: '' },
        { key: 'wl3', sym: '(W/L)_{3,4}', label: 'Size of M3, M4', unit: '' },
        { key: 'av', sym: 'A_v', label: 'Gain magnitude', unit: 'V/V' },
      ],
      answers: { wl1: d.wl12, wl3: d.wl34, av: ota.av },
      wrong: {
        wl1: [{ mistake: 'issNotHalf', value: wlFromId(iRef, proc.kpn, d.vov1) }, { mistake: 'vovNotVgs', value: wlFromId(id, proc.kpn, cmMin - d.vov5) }],
        wl3: [{ mistake: 'issNotHalf', value: wlFromId(iRef, proc.kpp, d.vov3) }, { mistake: 'diodeThreshold', value: wlFromId(id, proc.kpp, vgs3) }],
        av: [{ mistake: 'roNotHalf', value: gm1 / (proc.lambdan * id) }],
      },
      steps: [
        { tag: 'A', title: 'M5 mirrors M6 1:1, so ISS = I1; tail overdrive', tex: `V_{ov5} = \\sqrt{\\frac{2 I_1}{\\mu_n C_{ox}(W/L)_5}} = ${texSI(vov5, 'V')}`, highlight: ['m5', 'm6'] },
        { tag: 'A', title: 'CM floor = Vov5 + VGS1, run backwards', tex: `V_{ov1} = V_{in,CM,min} - V_{ov5} - V_{thn} = ${texSI(vov1, 'V')}` },
        { tag: 'A', title: 'Size M1 for ISS/2 at that overdrive', tex: `\\left(\\tfrac{W}{L}\\right)_1 = \\frac{2(I_1/2)}{\\mu_n C_{ox} V_{ov1}^2} = ${texNum(wl1)}`, produces: 'wl1', value: wl1, highlight: ['m1'] },
        { tag: 'A', title: 'CM ceiling = VDD − |VGS3| + Vthn, run backwards', tex: `|V_{GS3}| = V_{DD} - V_{in,CM,max} + V_{thn} = ${texSI(vgs3, 'V')},\\; |V_{ov3}| = ${texSI(vov3, 'V')}` },
        { tag: 'A', title: 'Size M3 for ISS/2', tex: `\\left(\\tfrac{W}{L}\\right)_3 = \\frac{2(I_1/2)}{\\mu_p C_{ox} |V_{ov3}|^2} = ${texNum(wl3)}`, produces: 'wl3', value: wl3, highlight: ['m3'] },
        { tag: 'D', title: 'Gain = gm1 (rO2 ‖ rO4)', tex: `A_v = \\frac{2 I_D}{V_{ov1}}\\left(\\frac{1}{\\lambda_n I_D}\\parallel\\frac{1}{\\lambda_p I_D}\\right) = ${texNum(av)}`, produces: 'av', value: av },
      ],
      hints: [
        'Run the CM-range formulas backwards: each limit fixes one overdrive.',
        'Floor: Vov5 + VGS1 gives Vov1. Ceiling: VDD − |VGS3| + Vthn gives |Vov3|.',
        'W/L = 2ID/(µCox·Vov²) with ID = I1/2; Av = gm1(rO2 ‖ rO4).',
        `Vov5 = ${(vov5 * 1000).toFixed(0)} mV.`,
      ],
    };
    return { problem, sane: vov1 > 0.08 && vov3 > 0.08 && Math.abs(wl1 - d.wl12) < 1e-9 * wl1 };
  },
};

// ─── U12: poles, GBW and the buffer ────────────────────────────────────────

export const genPole: Generator = {
  id: 'u12-pole',
  unit: 'U12',
  title: 'One pole per node: f−3dB, GBW, and the buffer’s bandwidth',
  make(rng) {
    const id = nice(rng, 20e-6, 200e-6, 10e-6);
    const vov = nice(rng, 0.15, 0.3, 0.05);
    const ln = pick(rng, [0.05, 0.1]);
    const lp = pick(rng, [0.1, 0.2]);
    const cl = pick(rng, [0.5e-12, 1e-12, 2e-12, 4e-12, 5e-12]);
    const gm = gmFromIdVov(id, vov);
    const rout = par(rO(ln, id), rO(lp, id));
    const f3 = toHz(pole(rout, cl));
    const fu = toHz(gbwOneStage(gm, cl));
    const gmTr = (2 * id) / vov;
    const routTr = par(1 / (ln * id), 1 / (lp * id));
    const problem: Problem = {
      ...base('u12-pole', 'U12', 'One pole per node: f−3dB, GBW, and the buffer’s bandwidth'),
      statement: 'A one-stage OTA (5-T style) has gm1, Rout = rO2 ‖ rO4 and a load CL at its only high-resistance node. Find Rout, the open-loop −3 dB frequency, the unity-gain frequency (GBW) and the bandwidth of the same OTA used as a unity-gain buffer (in Hz).',
      givens: [
        { sym: 'I_D', value: id, unit: 'A' },
        { sym: 'V_{ov1}', value: vov, unit: 'V' },
        { sym: '\\lambda_n', value: ln, unit: '' },
        { sym: '\\lambda_p', value: lp, unit: '' },
        { sym: 'C_L', value: cl, unit: 'F' },
      ],
      unknowns: [
        { key: 'rout', sym: 'R_{out}', label: 'Output resistance', unit: 'Ω' },
        { key: 'f3', sym: 'f_{-3dB}', label: 'Open-loop bandwidth', unit: 'Hz' },
        { key: 'fu', sym: 'f_u', label: 'Unity-gain frequency (GBW)', unit: 'Hz' },
        { key: 'fb', sym: 'f_{buffer}', label: 'Buffer bandwidth', unit: 'Hz' },
      ],
      answers: { rout, f3, fu, fb: fu },
      wrong: {
        f3: [{ mistake: 'forgot2pi', value: pole(rout, cl) }],
        fu: [{ mistake: 'forgot2pi', value: gm / cl }],
        fb: [{ mistake: 'forgot2pi', value: gm / cl }, { mistake: 'aInsteadOfInvBeta', value: f3 }],
      },
      steps: [
        { tag: 'C', title: 'Rout: rO2 ‖ rO4', tex: `R_{out} = \\frac{1}{\\lambda_n I_D}\\parallel\\frac{1}{\\lambda_p I_D} = ${texSI(routTr, 'Ω')}`, produces: 'rout', value: routTr },
        { tag: '·', title: 'One pole at the output node: ω = 1/(Rout·CL), then divide by 2π', tex: `f_{-3dB} = \\frac{1}{2\\pi R_{out} C_L} = ${texSI(1 / (2 * Math.PI * routTr * cl), 'Hz')}`, produces: 'f3', value: 1 / (2 * Math.PI * routTr * cl) },
        { tag: '·', title: 'GBW: gain × bandwidth, Rout cancels', tex: `f_u = A_v f_{-3dB} = \\frac{g_m}{2\\pi C_L} = \\frac{${texSI(gmTr, 'S')}}{2\\pi\\,${texSI(cl, 'F')}} = ${texSI(gmTr / (2 * Math.PI * cl), 'Hz')}`, produces: 'fu', value: gmTr / (2 * Math.PI * cl) },
        { tag: '·', title: 'Buffer: Rout falls to about 1/gm, so the pole moves up to gm/CL = the GBW', tex: `f_{buffer} \\approx \\frac{1}{2\\pi (1/g_m) C_L} = ${texSI(gmTr / (2 * Math.PI * cl), 'Hz')}`, produces: 'fb', value: gmTr / (2 * Math.PI * cl) },
      ],
      hints: [
        'A capacitor on a node with resistance R makes a pole at 1/(R·C).',
        'Only the output node has a big resistance, so it has the dominant pole.',
        'f−3dB = 1/(2π·Rout·CL); fu = gm/(2π·CL); buffer ≈ fu.',
        `gm = ${(gmTr * 1e3).toPrecision(3)} mA/V; Rout = ${(routTr / 1e3).toPrecision(3)} kΩ.`,
      ],
      flags: ['Your exam key also accepts 1/(2πCL(1/gm ‖ rO4)) and f−3dB·(1 + A) for the buffer; they differ by < 1%.'],
    };
    return { problem, sane: true };
  },
};

// ─── U12: settling and slewing ─────────────────────────────────────────────

export const genSettling: Generator = {
  id: 'u12-settle',
  unit: 'U12',
  title: 'Settling time and slew rate',
  make(rng) {
    const aClosed = pick(rng, [1, 2, 4, 5, 10]);
    const beta = 1 / aClosed;
    const fu = pick(rng, [50e6, 100e6, 200e6, 500e6]);
    const eps = pick(rng, [0.01, 0.001]);
    const iss = nice(rng, 50e-6, 500e-6, 50e-6);
    const cl = pick(rng, [1e-12, 2e-12, 5e-12]);
    const wu = 2 * Math.PI * fu;
    const tau = tauClosed(beta, wu);
    const ts = settlingTime(tau, eps);
    const sr = slewRate(iss, cl);
    const tauTr = aClosed / (2 * Math.PI * fu);
    const tsTr = tauTr * Math.log(1 / eps);
    const problem: Problem = {
      ...base('u12-settle', 'U12', 'Settling time and slew rate'),
      statement: `A one-pole op amp with unity-gain frequency fu is used in a closed-loop amplifier of gain ${aClosed} (β = 1/${aClosed}). Find the closed-loop time constant, the time to settle within ${eps * 100}% after a small step, and the slew rate if its tail current ISS charges CL.`,
      givens: [
        { sym: 'f_u', value: fu, unit: 'Hz' },
        { sym: 'A_{closed}', value: aClosed, unit: '' },
        { sym: '\\varepsilon', value: eps, unit: '' },
        { sym: 'I_{SS}', value: iss, unit: 'A' },
        { sym: 'C_L', value: cl, unit: 'F' },
      ],
      unknowns: [
        { key: 'tau', sym: '\\tau', label: 'Closed-loop time constant', unit: 's' },
        { key: 'ts', sym: 't_s', label: 'Settling time', unit: 's' },
        { key: 'sr', sym: 'SR', label: 'Slew rate', unit: 'V/s' },
      ],
      answers: { tau, ts, sr },
      wrong: {
        tau: [{ mistake: 'forgot2pi', value: aClosed / fu }, { mistake: 'betaVsBetaA', value: 1 / wu }],
        ts: [{ mistake: 'lnValues', value: tau * Math.log10(1 / eps) }, { mistake: 'forgot2pi', value: (aClosed / fu) * Math.log(1 / eps) }],
        sr: [{ mistake: 'issNotHalf', value: iss / 2 / cl }],
      },
      steps: [
        { tag: '·', title: 'Closed-loop bandwidth = β·ωu, so τ = 1/(β·ωu) = Aclosed/ωu', tex: `\\tau = \\frac{A_{closed}}{2\\pi f_u} = \\frac{${aClosed}}{2\\pi\\times ${texSI(fu, 'Hz')}} = ${texSI(tauTr, 's')}`, produces: 'tau', value: tauTr },
        { tag: '·', title: 'Exponential settling: the error falls as e^(−t/τ). Solve e^(−t/τ) = ε', tex: `t_s = \\tau\\ln\\frac{1}{\\varepsilon} = ${texSI(tauTr, 's')}\\times ${texNum(Math.log(1 / eps), 3)} = ${texSI(tsTr, 's')}`, produces: 'ts', value: tsTr },
        { tag: '·', title: 'Slewing: the whole tail current charges CL', tex: `SR = \\frac{I_{SS}}{C_L} = ${texSI(iss / cl, 'V/s')}`, produces: 'sr', value: iss / cl },
      ],
      hints: [
        'Eating half the remaining cake each minute: exponential settling never quite ends, so pick an error band.',
        'τ = Aclosed/ωu (remember ωu = 2π·fu). Settling needs ln(1/ε) time constants: 4.6 for 1%, 6.9 for 0.1%.',
        't = τ·ln(1/ε); SR = ISS/CL.',
        `ωu = ${(wu / 1e9).toPrecision(3)} Grad/s.`,
      ],
    };
    return { problem, sane: true };
  },
};

export const DIFF_GENERATORS: Generator[] = [genPairBias, genSteering, genCmGain, genOtaAnalysis, genOtaDesign, genPole, genSettling];
