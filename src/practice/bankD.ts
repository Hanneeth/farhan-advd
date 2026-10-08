/**
 * Problem Set 3 (digital, L15–L38): textbook-style problems at tutorial level, each checked by the
 * engine. No digital lecture notes or tutorial sheets yet, so every problem is flagged as app-written.
 */
import { boothRadix4, cmosVilVih, cmosVM, complexGateEffort, ffTiming, LE, pathEffort, sramReadBump, tauPHL, tauPLH } from '../physics';
import type { Problem } from './schema';
import { texNum, texSI } from './tex';

const OURS = 'Written by the app in the style of Kang & Leblebici / Weste & Harris (no digital tutorial sheets yet). Check against your class when they arrive.';

function p1(): Problem {
  const spec = { vdd: 3.3, vtn: 0.6, vtp: 0.7, kn: 200e-6, kp: 80e-6 };
  const vm = cmosVM(spec);
  const { vil, vih } = cmosVilVih(spec);
  const r = Math.sqrt(spec.kp / spec.kn);
  return {
    id: 'bank-ps3-p1',
    source: 'Problem Set 3 P1 (L17)',
    tags: ['L17', 'L15'],
    title: 'PS3 P1: an unsymmetric CMOS inverter',
    statement: 'A CMOS inverter: VDD = 3.3 V, Vthn = 0.6 V, |Vthp| = 0.7 V, kn = 200 µA/V², kp = 80 µA/V². Find VM, VIL and VIH (slope −1 points, from the square-law VTC) and both noise margins.',
    figure: { kind: 'cmosVtc', props: { spec } },
    givens: [
      { sym: 'V_{DD}', value: 3.3, unit: 'V' },
      { sym: 'V_{thn}', value: 0.6, unit: 'V' },
      { sym: '|V_{thp}|', value: 0.7, unit: 'V' },
      { sym: 'k_R', value: 2.5, unit: '' },
    ],
    unknowns: [
      { key: 'vm', sym: 'V_M', label: 'VM', unit: 'V' },
      { key: 'vil', sym: 'V_{IL}', label: 'VIL', unit: 'V' },
      { key: 'vih', sym: 'V_{IH}', label: 'VIH', unit: 'V' },
      { key: 'nml', sym: 'NM_L', label: 'NML', unit: 'V' },
      { key: 'nmh', sym: 'NM_H', label: 'NMH', unit: 'V' },
    ],
    answers: { vm, vil, vih, nml: vil, nmh: 3.3 - vih },
    wrong: {},
    steps: [
      { tag: 'A', title: 'VM: both saturated, equal currents', tex: `V_M = \\frac{0.6 + ${texNum(r)}(3.3 - 0.7)}{1 + ${texNum(r)}} = ${texSI((0.6 + r * 2.6) / (1 + r), 'V')}`, produces: 'vm', value: (0.6 + r * 2.6) / (1 + r) },
      { tag: '·', title: 'VIL: nMOS saturated, pMOS in triode, slope −1 (solve the two conditions together)', tex: `V_{IL} = ${texSI(vil, 'V')}`, produces: 'vil', value: vil },
      { tag: '·', title: 'VIH: nMOS in triode, pMOS saturated, slope −1', tex: `V_{IH} = ${texSI(vih, 'V')}`, produces: 'vih', value: vih },
      { tag: '✓', title: 'Margins with VOL = 0, VOH = VDD', tex: `NM_L = ${texSI(vil, 'V')},\\; NM_H = ${texSI(3.3 - vih, 'V')}`, produces: 'nml', value: vil },
      { tag: '✓', title: 'NMH', tex: `${texSI(3.3 - vih, 'V')}`, produces: 'nmh', value: 3.3 - vih },
    ],
    hints: ['kR = 2.5: which way does VM move?', 'At VIL the nMOS is saturated, the pMOS in triode.', 'Equate currents and set dVout/dVin = −1.', `VM = ${vm.toFixed(2)} V.`],
    flags: [OURS],
  };
}

function p2(): Problem {
  const cl = 100e-15;
  const phl = tauPHL({ cl, kn: 200e-6, vtn: 0.45, voh: 1.8, vol: 0 });
  const plh = tauPLH({ cl, kp: 80e-6, vtp: 0.45, voh: 1.8, vol: 0 });
  return {
    id: 'bank-ps3-p2',
    source: 'Problem Set 3 P2 (L18–L19)',
    tags: ['L19'],
    title: 'PS3 P2: delays, then size for equal edges',
    statement: 'VDD = 1.8 V, Vthn = |Vthp| = 0.45 V, kn = 200 µA/V², kp = 80 µA/V², CL = 100 fF. (a) τPHL and τPLH. (b) By what factor must the pMOS be widened for equal delays, and what is τP then?',
    figure: { kind: 'switching', props: { tphl: phl, tplh: plh, vdd: 1.8 } },
    givens: [
      { sym: 'k_n', value: 200e-6, unit: 'A/V²' },
      { sym: 'k_p', value: 80e-6, unit: 'A/V²' },
      { sym: 'C_L', value: cl, unit: 'F' },
    ],
    unknowns: [
      { key: 'phl', sym: '\\tau_{PHL}', label: '(a) τPHL', unit: 's' },
      { key: 'plh', sym: '\\tau_{PLH}', label: '(a) τPLH', unit: 's' },
      { key: 'k', sym: 'W_p\\times', label: '(b) pMOS widening', unit: '' },
      { key: 'tp', sym: '\\tau_P', label: '(b) τP after', unit: 's' },
    ],
    answers: { phl, plh, k: 2.5, tp: phl },
    wrong: {},
    steps: [
      { tag: '·', title: 'Kang’s formula with kn', tex: `\\tau_{PHL} = ${texSI(phl, 's')}`, produces: 'phl', value: phl },
      { tag: '·', title: 'Same form with kp (2.5× weaker → 2.5× slower)', tex: `\\tau_{PLH} = ${texSI(plh, 's')}`, produces: 'plh', value: plh },
      { tag: '·', title: 'Equal delays need kp = kn: widen the pMOS 200/80 = 2.5×', tex: '2.5', produces: 'k', value: 2.5 },
      { tag: '✓', title: 'Both edges now equal τPHL (self-loading ignored)', tex: `\\tau_P = ${texSI(phl, 's')}`, produces: 'tp', value: phl },
    ],
    hints: ['τ ∝ CL/k.', 'Kang: CL/(k(VDD − Vth))·[2Vth/(VDD − Vth) + ln(4(VDD − Vth)/VDD − 1)].', 'kp must equal kn.', 'Factor 2.5.'],
    flags: [OURS],
  };
}

function p3(): Problem {
  const r = pathEffort([{ ...LE.nand(2), b: 2 }, { ...LE.nand(3), b: 3 }, LE.nor(2)], 8, 45);
  return {
    id: 'bank-ps3-p3',
    source: 'Problem Set 3 P3 (L25, Weste-style path)',
    tags: ['L25'],
    title: 'PS3 P3: NAND2 → NAND3 → NOR2 with branching',
    statement: 'A path NAND2 → NAND3 → NOR2 has Cin = 8 and drives Cout = 45. The NAND2 output also drives one more identical NAND3 (branching 2); the NAND3 output drives two more NOR2s (branching 3). Find G, B, F, f̂, the minimum delay D, and the input capacitances x (NAND3) and y (NOR2).',
    figure: { kind: 'effortPath', props: { stages: [{ name: 'NAND2', b: 2 }, { name: 'NAND3', b: 3 }, { name: 'NOR2' }], caps: r.caps, cout: 45 } },
    givens: [
      { sym: 'C_{in}', value: 8, unit: '' },
      { sym: 'C_{out}', value: 45, unit: '' },
    ],
    unknowns: [
      { key: 'G', sym: 'G', label: 'G', unit: '' },
      { key: 'F', sym: 'F', label: 'F', unit: '' },
      { key: 'f', sym: '\\hat f', label: 'Stage effort', unit: '' },
      { key: 'D', sym: 'D', label: 'Delay (τ)', unit: '' },
      { key: 'x', sym: 'x', label: 'NAND3 input cap', unit: '' },
      { key: 'y', sym: 'y', label: 'NOR2 input cap', unit: '' },
    ],
    answers: { G: r.G, F: r.F, f: r.f, D: r.D, x: r.caps[1], y: r.caps[2] },
    wrong: {},
    steps: [
      { tag: '·', title: 'G = (4/3)(5/3)(5/3)', tex: `G = ${texNum((4 / 3) * (5 / 3) * (5 / 3))}`, produces: 'G', value: (4 / 3) * (5 / 3) * (5 / 3) },
      { tag: '·', title: 'B = 2·3 = 6, H = 45/8, F = GBH', tex: `F = ${texNum((100 / 27) * 6 * (45 / 8))}`, produces: 'F', value: (100 / 27) * 6 * (45 / 8) },
      { tag: '·', title: 'f̂ = 125^(1/3)', tex: 'f = 5', produces: 'f', value: 5 },
      { tag: '·', title: 'D = 3·5 + (2 + 3 + 2)', tex: 'D = 22\\,\\tau', produces: 'D', value: 22 },
      { tag: '·', title: 'Back from the load: y = g·Cout/f̂ = (5/3)(45)/5', tex: 'y = 15', produces: 'y', value: 15 },
      { tag: '✓', title: 'NAND3 drives 3y = 45: x = (5/3)(45)/5', tex: 'x = 15', produces: 'x', value: 15 },
    ],
    hints: ['Multiply the g’s and b’s.', 'F = GBH.', 'f̂ = F^(1/3); D = 3f̂ + P.', 'F = 125.'],
    flags: [OURS],
  };
}

function p4(): Problem {
  const e = complexGateEffort('AB+C');
  const a = e.find((x) => x.name === 'A')!;
  const c = e.find((x) => x.name === 'C')!;
  return {
    id: 'bank-ps3-p4',
    source: 'Problem Set 3 P4 (L22, L24)',
    tags: ['L22', 'L24'],
    title: 'PS3 P4: the AOI21 gate',
    statement: 'Design F = NOT(AB + C) in static CMOS sized for the drive of a unit inverter (nMOS 1, pMOS 2). Give the widths on input A and on input C, and the logical effort of each input.',
    figure: { kind: 'staticGate', props: { expr: 'AB+C' } },
    givens: [{ sym: '\\mu_n/\\mu_p', value: 2, unit: '' }],
    unknowns: [
      { key: 'wna', sym: 'W_{n,A}', label: 'nMOS width on A', unit: '' },
      { key: 'wpa', sym: 'W_{p,A}', label: 'pMOS width on A', unit: '' },
      { key: 'ga', sym: 'g_A', label: 'g of A (and B)', unit: '' },
      { key: 'gc', sym: 'g_C', label: 'g of C', unit: '' },
    ],
    answers: { wna: a.wn, wpa: a.wp, ga: a.g, gc: c.g },
    wrong: {},
    steps: [
      { tag: 'B', title: 'Pull-down: A–B in series, parallel with C; pull-up: (A ∥ B) in series with C' },
      { tag: 'C', title: 'A is in a 2-series path: Wn = 2; every pull-up path has 2 in series: Wp = 2·2', tex: 'W_{n,A} = 2,\\; W_{p,A} = 4', produces: 'wna', value: 2 },
      { tag: 'C', title: 'pMOS on A', tex: 'W_{p,A} = 4', produces: 'wpa', value: 4 },
      { tag: '·', title: 'g = (Wn + Wp)/3', tex: 'g_A = 6/3 = 2', produces: 'ga', value: 2 },
      { tag: '✓', title: 'C: Wn = 1, Wp = 4', tex: 'g_C = 5/3', produces: 'gc', value: 5 / 3 },
    ],
    hints: ['AND → series, OR → parallel in the pull-down.', 'Width = longest series path through the device.', 'g = (Wn + Wp)/3.', 'Pull-up widths are all 4.'],
    flags: [OURS],
  };
}

function p5(): Problem {
  const t = ffTiming({ tpcq: 70e-12, tccq: 40e-12, tsetup: 50e-12, thold: 80e-12, tpd: 900e-12, tcd: 25e-12, tskew: 30e-12 });
  return {
    id: 'bank-ps3-p5',
    source: 'Problem Set 3 P5 (L32–L33)',
    tags: ['L32', 'L33'],
    title: 'PS3 P5: setup, hold and skew',
    statement: 'Flip-flops: tpcq = 70 ps, tccq = 40 ps, tsetup = 50 ps, thold = 80 ps. Logic: tpd = 900 ps, tcd = 25 ps. Skew 30 ps. (a) Minimum cycle time. (b) Hold slack. (c) How much delay must be added to the short path to fix hold?',
    figure: { kind: 'flopTiming', props: { tc: 1.1e-9, tpcq: 70e-12, tpd: 900e-12, tsetup: 50e-12, tskew: 30e-12 } },
    givens: [
      { sym: 't_{pcq}', value: 70e-12, unit: 's' },
      { sym: 't_{hold}', value: 80e-12, unit: 's' },
      { sym: 't_{skew}', value: 30e-12, unit: 's' },
    ],
    unknowns: [
      { key: 'tc', sym: 'T_c', label: '(a) Minimum Tc', unit: 's' },
      { key: 'h', sym: 'slack', label: '(b) Hold slack', unit: 's' },
      { key: 'add', sym: '\\Delta t_{cd}', label: '(c) Delay to add', unit: 's' },
    ],
    answers: { tc: t.tcMin, h: t.holdSlack, add: -t.holdSlack },
    wrong: {},
    steps: [
      { tag: '·', title: 'Tc ≥ tpcq + tpd + tsetup + tskew', tex: 'T_c = 70 + 900 + 50 + 30 = 1050\\,\\mathrm{ps}', produces: 'tc', value: 1050e-12 },
      { tag: '·', title: 'tcd ≥ thold − tccq + tskew = 70 ps; we have 25 ps', tex: '\\text{slack} = 25 - 70 = -45\\,\\mathrm{ps}', produces: 'h', value: -45e-12 },
      { tag: '✓', title: 'Add at least 45 ps to the shortest path (a slower clock would not help)', tex: '45\\,\\mathrm{ps}', produces: 'add', value: 45e-12 },
    ],
    hints: ['Setup uses the long path, hold the short one.', 'Both constraints include the skew.', 'Tc ≥ tpcq + tpd + tsetup + tskew; tcd ≥ thold − tccq + tskew.', 'Hold needs 70 ps.'],
    flags: [OURS],
  };
}

function p6(): Problem {
  const bump = sramReadBump({ vdd: 1, vtn: 0.3, kAccess: 100e-6, kPulldown: 200e-6 });
  const d = boothRadix4(-77, 8);
  return {
    id: 'bank-ps3-p6',
    source: 'Problem Set 3 P6 (L37–L38)',
    tags: ['L37', 'L38'],
    title: 'PS3 P6: SRAM read bump and a Booth recoding',
    statement: '(a) A 6T cell: VDD = 1 V, Vthn = 0.3 V, access k = 100 µA/V², pull-down k = 200 µA/V² (cell ratio 2). How high does the node storing 0 rise during a read? (b) Radix-4 Booth: recode y = −77 (10110011₂); give the most significant digit d3 and the number of partial products.',
    figure: { kind: 'sramCell', props: { q: 0, reading: true, bump } },
    givens: [
      { sym: 'V_{DD}', value: 1, unit: 'V' },
      { sym: 'CR', value: 2, unit: '' },
      { sym: 'y', value: -77, unit: '' },
    ],
    unknowns: [
      { key: 'v', sym: 'V_Q', label: '(a) Read bump', unit: 'V' },
      { key: 'd3', sym: 'd_3', label: '(b) Digit d3', unit: '', tol: 0.001 },
      { key: 'n', sym: 'N_{PP}', label: '(b) Partial products', unit: '' },
    ],
    answers: { v: bump, d3: d[3], n: d.length },
    wrong: {},
    steps: [
      { tag: 'A', title: '(a) Access saturated = pull-down in triode; solve the quadratic', tex: `V_Q = ${texSI(bump, 'V')}`, produces: 'v', value: bump },
      { tag: '·', title: '(b) Bits y7 y6 y5 = 1 0 1: d3 = −2 + 0 + 1', tex: 'd_3 = -1', produces: 'd3', value: -1 },
      { tag: '✓', title: 'Digits −1, +1, −1, −1: Σ = −1 + 4 − 16 − 64 = −77; 4 partial products', tex: '4', produces: 'n', value: 4 },
    ],
    hints: ['Two nMOS fight over the 0-node.', 'Access: saturated; pull-down: triode.', 'Booth digit = −2·top + middle + bottom.', 'Check with Σ d·4^i.'],
    flags: [OURS],
  };
}

export const DIGITAL_BANK: Problem[] = [p1(), p2(), p3(), p4(), p5(), p6()];
