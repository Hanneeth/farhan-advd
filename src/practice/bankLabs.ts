/**
 * Lab sheets 1–9 (EEE F313 Cadence labs): only the hand-calculation parts, no simulator steps.
 * The labs size devices with a V* = 2ID/gm chart from simulation. Where a chart reading is needed, the
 * problem gives an "example chart reading" and says so: the method (ratio and proportion) is what you
 * practise; your own chart will give different numbers.
 */
import { closedLoopGain, db, gbwOneStage, pole, toHz } from '../physics';
import type { Problem } from './schema';
import { texNum, texSI } from './tex';

const CHART = 'This uses an example chart reading so you can practise the method; in the lab you read the value from your own V* chart.';

function lab1(): Problem {
  const r = 1e3, tau = 1e-9;
  const c = tau / r;
  const f3 = toHz(pole(r, c));
  return {
    id: 'bank-lab1',
    source: 'Lab 1 (hand calculations)',
    tags: ['U12'],
    title: 'Lab 1: first-order RC low-pass filter',
    statement: 'Design a first-order RC low-pass filter with R = 1 kΩ and a 1 ns time constant. Find C, the 10–90% rise time, the DC gain and the −3 dB bandwidth.',
    givens: [
      { sym: 'R', value: r, unit: 'Ω' },
      { sym: '\\tau', value: tau, unit: 's' },
    ],
    unknowns: [
      { key: 'c', sym: 'C', label: 'Capacitor', unit: 'F' },
      { key: 'tr', sym: 't_r', label: 'Rise time (10–90%)', unit: 's' },
      { key: 'f3', sym: 'f_{-3dB}', label: 'Bandwidth', unit: 'Hz' },
    ],
    answers: { c, tr: 2.2 * tau, f3 },
    wrong: { f3: [{ mistake: 'forgot2pi', value: 1 / tau }], tr: [{ mistake: 'lnValues', value: tau }] },
    steps: [
      { tag: '·', title: 'τ = RC', tex: `C = \\frac{1\\,\\mathrm{ns}}{1\\,\\mathrm{k\\Omega}} = ${texSI(1e-9 / 1e3, 'F')}`, produces: 'c', value: 1e-9 / 1e3 },
      { tag: '·', title: '10% at 0.105τ, 90% at 2.303τ: the difference is ln 9 ≈ 2.2τ', tex: `t_r = \\ln 9\\,\\tau \\approx 2.2\\tau = ${texSI(2.2e-9, 's')}`, produces: 'tr', value: 2.2 * 1e-9 },
      { tag: '·', title: 'One pole at 1/(RC); divide by 2π for Hz (DC gain = 1)', tex: `f_{-3dB} = \\frac{1}{2\\pi\\,(1\\,\\mathrm{ns})} = ${texSI(1 / (2 * Math.PI * 1e-9), 'Hz')}`, produces: 'f3', value: 1 / (2 * Math.PI * 1e-9) },
    ],
    hints: ['A capacitor charging through a resistor: τ = RC.', 'Rise time 10–90% = 2.2τ.', 'f = 1/(2πRC).', 'C = 1 pF.'],
  };
}

function lab2(): Problem {
  const vdd = 1.8, id = 100e-6, av = 8;
  const vrd = vdd / 2;
  const rd = vrd / id;
  const vstar = (2 * vrd) / av;
  const idx = 40e-6; // example chart reading at V*Q for W = 10 µm
  const w = (10e-6 * id) / idx;
  const avMax = (2 * (vdd - vstar)) / vstar;
  return {
    id: 'bank-lab2',
    source: 'Lab 2 (hand calculations)',
    tags: ['U5'],
    title: 'Lab 2: design a resistor-loaded CS amplifier with V*',
    statement: `Specs: gain −8 V/V, VDD = 1.8 V, 100 µA. The output sits at VDD/2 (so VRD = 0.9 V). Use |Av| = 2VRD/V* with V* = 2ID/gm. (a) RD. (b) The required V*. (c) Example chart reading: at that V* a W = 10 µm device carries IDX = ${idx * 1e6} µA; find W by ratio and proportion. (d) With VGS fixed, the largest gain you could get by raising RD (keep the device saturated: VDS ≥ V*).`,
    givens: [
      { sym: 'V_{DD}', value: vdd, unit: 'V' },
      { sym: 'I_D', value: id, unit: 'A' },
      { sym: '|A_v|', value: av, unit: 'V/V' },
      { sym: 'I_{DX}', value: idx, unit: 'A' },
    ],
    unknowns: [
      { key: 'rd', sym: 'R_D', label: '(a) Drain resistor', unit: 'Ω' },
      { key: 'vstar', sym: 'V^*_Q', label: '(b) Required V*', unit: 'V' },
      { key: 'w', sym: 'W', label: '(c) Width (µm)', unit: '' },
      { key: 'avmax', sym: '|A_v|_{max}', label: '(d) Maximum gain', unit: 'V/V' },
    ],
    answers: { rd, vstar, w: w * 1e6, avmax: avMax },
    wrong: { vstar: [{ mistake: 'forgotHalf', value: vrd / av }] },
    steps: [
      { tag: 'A', title: '(a) RD drops half the supply at 100 µA', tex: `R_D = \\frac{0.9}{100\\,\\mu} = ${texSI(0.9 / 100e-6, 'Ω')}`, produces: 'rd', value: 0.9 / 100e-6 },
      { tag: 'D', title: '(b) |Av| = gm·RD = (2ID/V*)·RD = 2VRD/V*', tex: `V^* = \\frac{2(0.9)}{8} = ${texSI((2 * 0.9) / 8, 'V')}`, produces: 'vstar', value: (2 * 0.9) / 8 },
      { tag: 'A', title: '(c) ID ∝ W at fixed V*: ratio and proportion', tex: `W = 10\\,\\mu\\mathrm{m}\\times\\frac{100\\,\\mu\\mathrm{A}}{${idx * 1e6}\\,\\mu\\mathrm{A}} = ${texNum((10 * 100e-6) / idx)}\\,\\mu\\mathrm{m}`, produces: 'w', value: (10 * 100e-6) / idx },
      { tag: 'D', title: '(d) Raising RD raises the gain until VD falls to V*: VRD,max = VDD − V*', tex: `|A_v|_{max} = \\frac{2(1.8 - ${texNum(vstar, 3)})}{${texNum(vstar, 3)}} = ${texNum((2 * (1.8 - vstar)) / vstar)}`, produces: 'avmax', value: (2 * (1.8 - vstar)) / vstar },
    ],
    hints: ['Gain = twice the drop over the overdrive (here V*).', 'RD = VRD/ID; V* = 2VRD/|Av|.', 'W scales with ID at the same V*.', 'V* = 0.225 V.'],
    flags: [CHART, 'With feedback (Lab 2 Part 2.4) the linear input range is about (VDD − 2V*)/|Av|.'],
  };
}

function lab3(): Problem {
  const id = 20e-6, vstar = 0.2, va = 5, cl = 1e-12;
  const gm = (2 * id) / vstar;
  const ro = va / id;
  const aCs = gm * ro;
  const aCas = aCs * aCs;
  const fCs = toHz(pole(ro, cl));
  const fu = toHz(gbwOneStage(gm, cl));
  return {
    id: 'bank-lab3',
    source: 'Lab 3 (hand calculations)',
    tags: ['U9', 'U12'],
    title: 'Lab 3: CS versus cascode gain, bandwidth and GBW',
    statement: `ID = 20 µA, V* = 200 mV, CL = 1 pF, ideal current-source loads. Example chart reading: VA = ${va} V (rO = VA/ID). Find gm, the CS gain gm·rO, the cascode gain ≈ (gm·rO)², the CS bandwidth and the GBW of both.`,
    givens: [
      { sym: 'I_D', value: id, unit: 'A' },
      { sym: 'V^*', value: vstar, unit: 'V' },
      { sym: 'V_A', value: va, unit: 'V' },
      { sym: 'C_L', value: cl, unit: 'F' },
    ],
    unknowns: [
      { key: 'gm', sym: 'g_m', label: 'gm = 2ID/V*', unit: 'S' },
      { key: 'acs', sym: 'A_{CS}', label: 'CS gain', unit: 'V/V' },
      { key: 'acas', sym: 'A_{cas}', label: 'Cascode gain', unit: 'V/V' },
      { key: 'fcs', sym: 'f_{-3dB,CS}', label: 'CS bandwidth', unit: 'Hz' },
      { key: 'fu', sym: 'GBW', label: 'GBW (both)', unit: 'Hz' },
    ],
    answers: { gm, acs: aCs, acas: aCas, fcs: fCs, fu },
    wrong: { fu: [{ mistake: 'forgot2pi', value: gm / cl }] },
    steps: [
      { tag: 'C', title: 'gm from V*', tex: `g_m = \\frac{2(20\\mu)}{0.2} = ${texSI((2 * 20e-6) / 0.2, 'S')}`, produces: 'gm', value: (2 * 20e-6) / 0.2 },
      { tag: 'D', title: 'CS with an ideal load: intrinsic gain 2VA/V*', tex: `A_{CS} = g_m r_O = \\frac{2V_A}{V^*} = ${texNum((2 * va) / vstar)}`, produces: 'acs', value: (2 * va) / vstar },
      { tag: 'D', title: 'Cascode (cascoded load too): about the square', tex: `A_{cas} \\approx (g_m r_O)^2 = ${texNum(((2 * va) / vstar) ** 2)}`, produces: 'acas', value: ((2 * va) / vstar) ** 2 },
      { tag: '·', title: 'CS pole at the output', tex: `f_{-3dB} = \\frac{1}{2\\pi r_O C_L} = ${texSI(1 / (2 * Math.PI * (va / id) * cl), 'Hz')}`, produces: 'fcs', value: 1 / (2 * Math.PI * (va / id) * cl) },
      { tag: '·', title: 'GBW = gm/(2πCL) for both: the cascode trades bandwidth for gain one-for-one', tex: `GBW = ${texSI(((2 * id) / vstar) / (2 * Math.PI * cl), 'Hz')}`, produces: 'fu', value: ((2 * id) / vstar) / (2 * Math.PI * cl) },
    ],
    hints: ['gm = 2ID/V*.', 'Intrinsic gain = 2VA/V*.', 'GBW = gm/(2πCL): Rout cancels.', 'gm = 0.2 mS.'],
    flags: [CHART],
  };
}

function lab4(): Problem {
  const id = 10e-6, vstar = 0.2, cl = 2e-12;
  const gm = (2 * id) / vstar;
  return {
    id: 'bank-lab4',
    source: 'Lab 4 (hand calculations)',
    tags: ['U8'],
    title: 'Lab 4: PMOS source follower',
    statement: 'A PMOS source follower biased at 10 µA with V* = 200 mV drives CL = 2 pF. Find gm, the output resistance (≈ 1/gm) and the output pole, and say how far the output shifts from the input.',
    givens: [
      { sym: 'I_D', value: id, unit: 'A' },
      { sym: 'V^*', value: vstar, unit: 'V' },
      { sym: 'C_L', value: cl, unit: 'F' },
    ],
    unknowns: [
      { key: 'gm', sym: 'g_m', label: 'gm', unit: 'S' },
      { key: 'rout', sym: 'R_{out}', label: 'Output resistance', unit: 'Ω' },
      { key: 'fp', sym: 'f_{p,out}', label: 'Output pole', unit: 'Hz' },
      { key: 'shift', sym: '\\text{shift}', label: 'DC shift', unit: '', choices: ['Up by |VGS| (PMOS follower)', 'Down by VGS', 'None'] },
    ],
    answers: { gm, rout: 1 / gm, fp: toHz(pole(1 / gm, cl)), shift: 0 },
    wrong: { fp: [{ mistake: 'forgot2pi', value: pole(1 / gm, cl) }] },
    steps: [
      { tag: 'C', title: 'gm = 2ID/V*', tex: `g_m = ${texSI((2 * id) / vstar, 'S')}`, produces: 'gm', value: (2 * id) / vstar },
      { tag: 'C', title: 'Looking into the source: 1/gm', tex: `R_{out} = ${texSI(vstar / (2 * id), 'Ω')}`, produces: 'rout', value: vstar / (2 * id) },
      { tag: '·', title: 'Output pole', tex: `f_p = \\frac{g_m}{2\\pi C_L} = ${texSI(((2 * id) / vstar) / (2 * Math.PI * cl), 'Hz')}`, produces: 'fp', value: ((2 * id) / vstar) / (2 * Math.PI * cl) },
      { tag: 'A', title: 'A PMOS source sits one |VGS| above its gate', tex: 'V_{out} = V_{in} + |V_{GS}|', produces: 'shift', value: 0 },
    ],
    hints: ['The source is the small terminal: 1/gm.', 'gm = 2ID/V*.', 'f = gm/(2πCL).', 'Rout = 10 kΩ.'],
    flags: ['The lab’s ringing/peaking analysis needs Cgs and Cgd from simulation; that part is not a hand calculation here.'],
  };
}

function lab5(): Problem {
  const iin = 20e-6, iout = 2 * iin, vstar = 0.2, va = 10;
  const ro = va / iout;
  const gm = (2 * iout) / vstar;
  return {
    id: 'bank-lab5',
    source: 'Lab 5 (hand calculations)',
    tags: ['U6', 'U9'],
    title: 'Lab 5: simple versus low-compliance cascode mirror',
    statement: `A mirror takes IBIN = 20 µA and gives IBOUT = 2·IBIN (output devices twice as wide). V* = 200 mV. Example chart reading: VA = ${va} V at this length. Find IBOUT, Rout of the simple mirror (rO) and of the cascode mirror (≈ gm·rO²), and the minimum output voltage of each (V* and 2V*).`,
    givens: [
      { sym: 'I_{BIN}', value: iin, unit: 'A' },
      { sym: 'V^*', value: vstar, unit: 'V' },
      { sym: 'V_A', value: va, unit: 'V' },
    ],
    unknowns: [
      { key: 'iout', sym: 'I_{BOUT}', label: 'Output current', unit: 'A' },
      { key: 'rs', sym: 'R_{out,simple}', label: 'Simple mirror Rout', unit: 'Ω' },
      { key: 'rc', sym: 'R_{out,cascode}', label: 'Cascode mirror Rout', unit: 'Ω' },
      { key: 'vmin', sym: 'V_{out,min,cascode}', label: 'Cascode minimum output', unit: 'V' },
    ],
    answers: { iout, rs: ro, rc: gm * ro * ro, vmin: 2 * vstar },
    wrong: { iout: [{ mistake: 'ratioInverted', value: iin / 2 }], vmin: [{ mistake: 'vovNotVgs', value: 0.7 + vstar }] },
    steps: [
      { tag: 'A', title: 'Twice the width, twice the current', tex: `I_{BOUT} = 2\\times 20\\,\\mu = ${texSI(2 * 20e-6, 'A')}`, produces: 'iout', value: 2 * 20e-6 },
      { tag: 'C', title: 'Simple mirror: the output device’s rO', tex: `R_{out} = \\frac{V_A}{I_{BOUT}} = ${texSI(va / (2 * 20e-6), 'Ω')}`, produces: 'rs', value: va / (2 * 20e-6) },
      { tag: 'C', title: 'Cascode: up multiplies by gm·rO', tex: `R_{out} \\approx g_m r_O^2 = ${texSI(((2 * 40e-6) / 0.2) * (va / 40e-6) ** 2, 'Ω')}`, produces: 'rc', value: ((2 * 40e-6) / 0.2) * (va / 40e-6) ** 2 },
      { tag: '✓', title: 'Low-compliance (wide-swing) cascode: two devices at their edge', tex: `V_{out,min} = 2V^* = ${texSI(2 * 0.2, 'V')}`, produces: 'vmin', value: 2 * 0.2 },
    ],
    hints: ['A mirror copies in proportion to size.', 'Simple: Rout = rO. Cascode: ≈ gm·rO².', 'The “magic battery” bias lets the cascode work down to 2V*.', 'IBOUT = 40 µA.'],
    flags: [CHART],
  };
}

function lab6(): Problem {
  const id = 20e-6, vcm = 0.7, ad = 8, cl = 1e-12;
  const rd = vcm / id;
  const vstar = (2 * vcm) / ad;
  const gm = (2 * id) / vstar;
  return {
    id: 'bank-lab6',
    source: 'Lab 6 (hand calculations)',
    tags: ['U10'],
    title: 'Lab 6: design a PMOS-input resistive diff amp',
    statement: 'PMOS-input pair with resistor loads to ground: ISS = 40 µA (20 µA each side), output CM level 0.7 V, differential gain 8 V/V, CL = 1 pF. Find RD, the required V*, gm and the bandwidth.',
    givens: [
      { sym: 'I_{SS}', value: 40e-6, unit: 'A' },
      { sym: 'V_{out,CM}', value: vcm, unit: 'V' },
      { sym: 'A_d', value: ad, unit: 'V/V' },
      { sym: 'C_L', value: cl, unit: 'F' },
    ],
    unknowns: [
      { key: 'rd', sym: 'R_D', label: 'Load resistors', unit: 'Ω' },
      { key: 'vstar', sym: 'V^*', label: 'Required V*', unit: 'V' },
      { key: 'gm', sym: 'g_m', label: 'gm of each device', unit: 'S' },
      { key: 'f3', sym: 'f_{-3dB}', label: 'Bandwidth', unit: 'Hz' },
    ],
    answers: { rd, vstar, gm, f3: toHz(pole(rd, cl)) },
    wrong: { rd: [{ mistake: 'issNotHalf', value: vcm / 40e-6 }] },
    steps: [
      { tag: 'A', title: 'The output CM is the drop across RD (loads go to ground)', tex: `R_D = \\frac{0.7}{20\\,\\mu} = ${texSI(0.7 / 20e-6, 'Ω')}`, produces: 'rd', value: 0.7 / 20e-6 },
      { tag: 'D', title: '|Ad| = gm·RD = 2VRD/V*', tex: `V^* = \\frac{2(0.7)}{8} = ${texSI((2 * 0.7) / 8, 'V')}`, produces: 'vstar', value: (2 * 0.7) / 8 },
      { tag: 'C', title: 'gm = 2ID/V*', tex: `g_m = ${texSI((2 * 20e-6) / ((2 * 0.7) / 8), 'S')}`, produces: 'gm', value: (2 * 20e-6) / ((2 * 0.7) / 8) },
      { tag: '·', title: 'Output pole RD·CL', tex: `f_{-3dB} = \\frac{1}{2\\pi(35\\,\\mathrm{k\\Omega})(1\\,\\mathrm{pF})} = ${texSI(1 / (2 * Math.PI * (0.7 / 20e-6) * 1e-12), 'Hz')}`, produces: 'f3', value: 1 / (2 * Math.PI * (0.7 / 20e-6) * 1e-12) },
    ],
    hints: ['Each side carries ISS/2.', 'Gain = twice the drop over V*.', 'f = 1/(2πRD·CL).', 'RD = 35 kΩ.'],
  };
}

function lab7(): Problem {
  const gbw = 5e6, cl = 5e-12, gainDb = 34, cmrrDb = 74;
  const gm = gbw * 2 * Math.PI * cl;
  return {
    id: 'bank-lab7',
    source: 'Lab 7 (hand calculations)',
    tags: ['U11', 'U12'],
    title: 'Lab 7: turn the 5-T OTA specs into numbers',
    statement: 'Specs: GBW ≥ 5 MHz with CL = 5 pF, DC gain ≥ 34 dB, CMRR ≥ 74 dB. Find the minimum gm1,2, the minimum gain as a ratio, and the minimum CMRR as a ratio.',
    givens: [
      { sym: 'GBW', value: gbw, unit: 'Hz' },
      { sym: 'C_L', value: cl, unit: 'F' },
    ],
    unknowns: [
      { key: 'gm', sym: 'g_{m1,2}', label: 'Minimum gm', unit: 'S' },
      { key: 'a', sym: 'A_{min}', label: 'Minimum gain (V/V)', unit: '' },
      { key: 'cmrr', sym: '\\text{CMRR}_{min}', label: 'Minimum CMRR (ratio)', unit: '' },
    ],
    answers: { gm, a: 10 ** (gainDb / 20), cmrr: 10 ** (cmrrDb / 20) },
    wrong: { gm: [{ mistake: 'forgot2pi', value: gbw * cl }], a: [{ mistake: 'dbConversion', value: 10 ** (gainDb / 10) }] },
    steps: [
      { tag: '·', title: 'GBW = gm/(2πCL)', tex: `g_m = 2\\pi(5\\,\\mathrm{MHz})(5\\,\\mathrm{pF}) = ${texSI(2 * Math.PI * 5e6 * 5e-12, 'S')}`, produces: 'gm', value: 2 * Math.PI * 5e6 * 5e-12 },
      { tag: '·', title: 'dB to a ratio: divide by 20, then 10^', tex: `10^{34/20} = ${texNum(10 ** (34 / 20))}`, produces: 'a', value: 10 ** (34 / 20) },
      { tag: '·', title: 'Same for CMRR', tex: `10^{74/20} = ${texNum(10 ** (74 / 20))}`, produces: 'cmrr', value: 10 ** (74 / 20) },
    ],
    hints: ['GBW fixes gm (CL given).', 'Voltage ratios use 20·log10.', '34 dB ≈ 50, 74 dB ≈ 5000.', 'gm ≈ 157 µS.'],
    flags: ['The gm/ID chart part of Lab 7 needs your ADT curves; the numbers here are the spec translation you do by hand first.'],
  };
}

function lab8(): Problem {
  const gmB = 159e-6, a = 58.75, fu = 5e6, cf = 4e-12, cin = 4e-12;
  const beta = cf / (cf + cin);
  const cout = gmB / (2 * Math.PI * fu);
  const rout = a / gmB;
  const acl = closedLoopGain(a, beta);
  return {
    id: 'bank-lab8',
    source: 'Lab 8 (hand calculations)',
    tags: ['L1'],
    title: 'Lab 8: behavioural op amp in a capacitive non-inverting amplifier',
    statement: 'Behavioural OTA: GM = 159 µS, DC gain Av = 58.75, fu = 5 MHz. It is used as a non-inverting amplifier with CF = 4 pF and CIN = 4 pF (ideal gain 1 + CIN/CF). Find COUT and ROUT of the model, β, the loop gain, the actual closed-loop DC gain and the closed-loop bandwidth.',
    givens: [
      { sym: 'G_M', value: gmB, unit: 'S' },
      { sym: 'A_v', value: a, unit: 'V/V' },
      { sym: 'f_u', value: fu, unit: 'Hz' },
      { sym: 'C_F', value: cf, unit: 'F' },
      { sym: 'C_{IN}', value: cin, unit: 'F' },
    ],
    unknowns: [
      { key: 'cout', sym: 'C_{OUT}', label: 'Model output capacitance', unit: 'F' },
      { key: 'rout', sym: 'R_{OUT}', label: 'Model output resistance', unit: 'Ω' },
      { key: 'beta', sym: '\\beta', label: 'Feedback factor', unit: '' },
      { key: 'acl', sym: 'A_{CL}', label: 'Closed-loop DC gain', unit: '' },
      { key: 'bw', sym: 'f_{-3dB,CL}', label: 'Closed-loop bandwidth', unit: 'Hz', tol: 0.03 },
    ],
    answers: { cout, rout, beta, acl, bw: (1 + beta * a) * (fu / a) },
    wrong: { acl: [{ mistake: 'aInsteadOfInvBeta', value: 2 }], beta: [{ mistake: 'ratioInverted', value: 1 / beta }] },
    steps: [
      { tag: '·', title: 'fu = GM/(2π·COUT)', tex: `C_{OUT} = \\frac{159\\,\\mu}{2\\pi(5\\,\\mathrm{MHz})} = ${texSI(159e-6 / (2 * Math.PI * 5e6), 'F')}`, produces: 'cout', value: 159e-6 / (2 * Math.PI * 5e6) },
      { tag: '·', title: 'Av = GM·ROUT', tex: `R_{OUT} = \\frac{58.75}{159\\,\\mu} = ${texSI(58.75 / 159e-6, 'Ω')}`, produces: 'rout', value: 58.75 / 159e-6 },
      { tag: '·', title: 'Capacitive divider: β = CF/(CF + CIN)', tex: `\\beta = \\frac{4}{4 + 4} = ${texNum(0.5)}`, produces: 'beta', value: 4e-12 / (4e-12 + 4e-12) },
      { tag: '·', title: 'A/(1 + βA): the ideal 2 is missed by the gain error', tex: `A_{CL} = \\frac{58.75}{1 + 29.375} = ${texNum(58.75 / (1 + 0.5 * 58.75), 4)}`, produces: 'acl', value: 58.75 / (1 + 0.5 * 58.75) },
      { tag: '·', title: 'Closed-loop bandwidth = (1 + βA)·f0 with f0 = fu/A', tex: `f_{-3dB} = (1 + 29.375)\\times\\frac{5\\,\\mathrm{MHz}}{58.75} = ${texSI((1 + 0.5 * 58.75) * (5e6 / 58.75), 'Hz')}`, produces: 'bw', value: (1 + 0.5 * 58.75) * (5e6 / 58.75) },
    ],
    hints: ['A one-pole model: GM into ROUT ‖ COUT.', 'β for a capacitive divider uses the capacitors like resistors, flipped: CF/(CF + CIN).', 'ACL = A/(1 + βA); BW ≈ β·fu.', 'β = 0.5.'],
    flags: [`Check: the sheet lists COUT = 4.88 pF, but GM/(2π·5 MHz) with GM = 159 µS is ${(cout * 1e12).toFixed(2)} pF (4.88 pF corresponds to GM ≈ 153 µS). Worth asking your instructor.`, `Gain desensitisation (Part 1.3): as Av goes 50 → 50 000 the closed-loop gain goes ${closedLoopGain(50, 0.5).toFixed(3)} → ${closedLoopGain(50000, 0.5).toFixed(4)}, a ${(((closedLoopGain(50000, 0.5) - closedLoopGain(50, 0.5)) / closedLoopGain(50, 0.5)) * 100).toFixed(1)}% change for a 60 dB change in A.`],
  };
}

function lab9(): Problem {
  const errPct = 0.05, tr = 70e-9, sr = 5e6, cl = 5e-12;
  const a = 1 / (errPct / 100);
  const tau = tr / 2.2;
  const fu = 1 / (2 * Math.PI * tau);
  const cc = 0.5 * cl;
  const ib1 = sr * cc;
  return {
    id: 'bank-lab9',
    source: 'Lab 9 (hand calculations)',
    tags: ['L5', 'L9'],
    title: 'Lab 9: turn the two-stage buffer specs into numbers',
    statement: 'A two-stage Miller OTA used as a unity-gain buffer: static gain error ≤ 0.05%, 10–90% rise time ≤ 70 ns, slew rate 5 V/µs, CL = 5 pF, Cc = 0.5·CL. Find the minimum DC gain (ratio and dB), τ, the required unity-gain frequency, and the first-stage current.',
    givens: [
      { sym: '\\varepsilon', value: errPct / 100, unit: '' },
      { sym: 't_r', value: tr, unit: 's' },
      { sym: 'SR', value: sr, unit: 'V/s' },
      { sym: 'C_L', value: cl, unit: 'F' },
    ],
    unknowns: [
      { key: 'a', sym: 'A_{min}', label: 'Minimum DC gain (V/V)', unit: '' },
      { key: 'adb', sym: 'A_{min,dB}', label: 'Minimum DC gain (dB)', unit: '' },
      { key: 'tau', sym: '\\tau', label: 'Time constant', unit: 's' },
      { key: 'fu', sym: 'f_u', label: 'Unity-gain frequency', unit: 'Hz' },
      { key: 'ib1', sym: 'I_{B1}', label: 'First-stage current', unit: 'A' },
    ],
    answers: { a, adb: db(a), tau, fu, ib1 },
    wrong: { adb: [{ mistake: 'dbConversion', value: 10 * Math.log10(a) }], fu: [{ mistake: 'forgot2pi', value: 1 / tau }] },
    steps: [
      { tag: '·', title: 'Buffer: ACL ≈ 1 − 1/A, so the error is 1/A', tex: `A \\ge \\frac{1}{0.0005} = ${texNum(1 / 0.0005)}`, produces: 'a', value: 1 / 0.0005 },
      { tag: '·', title: 'In dB', tex: `20\\log_{10}(2000) = ${texNum(20 * Math.log10(2000), 4)}\\,\\mathrm{dB}`, produces: 'adb', value: 20 * Math.log10(2000) },
      { tag: '·', title: 'Rise time = 2.2τ', tex: `\\tau = \\frac{70\\,\\mathrm{ns}}{2.2} = ${texSI(70e-9 / 2.2, 's')}`, produces: 'tau', value: 70e-9 / 2.2 },
      { tag: '·', title: 'β = 1: τ = 1/ωu', tex: `f_u = \\frac{1}{2\\pi\\tau} = ${texSI(1 / (2 * Math.PI * (70e-9 / 2.2)), 'Hz')}`, produces: 'fu', value: 1 / (2 * Math.PI * (70e-9 / 2.2)) },
      { tag: '·', title: 'Miller OTA: SR = IB1/Cc', tex: `I_{B1} = (5\\,\\mathrm{V/\\mu s})(2.5\\,\\mathrm{pF}) = ${texSI(5e6 * 2.5e-12, 'A')}`, produces: 'ib1', value: 5e6 * 2.5e-12 },
    ],
    hints: ['Gain error of a buffer is about 1/A.', 't(10–90%) = 2.2τ; τ = 1/ωu when β = 1.', 'SR = IB1/Cc in a Miller-compensated two-stage.', 'A ≥ 2000.'],
    flags: ['The gm/ID sizing and phase-margin parts of Lab 9 belong to L13–L14 (compensation), which arrive with those notes.'],
  };
}

export const LAB_BANK: Problem[] = [lab1(), lab2(), lab3(), lab4(), lab5(), lab6(), lab7(), lab8(), lab9()];
