/**
 * Generators for the digital half (L15–L38). Each answer comes from src/physics/digital; each trace
 * recomputes it by hand (closed forms), so the double-solve check holds.
 */
import {
  boothRadix4,
  carrySkipDelay,
  chargeSharing,
  cmosVM,
  complexGateEffort,
  dynamicPower,
  elmoreLadder,
  ffTiming,
  kRForVM,
  LE,
  nandVM,
  norVM,
  parseExpr,
  dual,
  netSize,
  stackDepth,
  passChainDelay,
  pathEffort,
  pseudoNmosVol,
  resistiveInverter,
  rippleDelay,
  sramReadBump,
  symmetricVilVih,
  tauPHL,
  tauPLH,
} from '../../physics';
import { nice, pick, type Rng } from '../rng';
import type { Generator, GeneratorOutput, Problem } from '../schema';
import { texNum, texSI } from '../tex';

function base(id: string, unit: string, title: string): Pick<Problem, 'id' | 'generator' | 'source' | 'tags' | 'title'> {
  return { id, generator: id, source: 'generated', tags: [unit], title };
}
const f2 = (x: number) => Number(x.toPrecision(3));

/* ─── L15: noise margins ─── */

export const genMargins: Generator = {
  id: 'd15-margins',
  unit: 'L15',
  title: 'Noise margins from VOH, VOL, VIL, VIH',
  make(rng: Rng): GeneratorOutput {
    const vdd = pick(rng, [1.8, 2.5, 3.3, 5]);
    const vt = pick(rng, [0.4, 0.5, 0.7, 1]);
    const { vil, vih } = symmetricVilVih(vdd, vt);
    const vol = pick(rng, [0, 0.05, 0.1]) * vdd;
    const voh = vdd - pick(rng, [0, 0.05]) * vdd;
    const problem: Problem = {
      ...base('d15-margins', 'L15', 'Noise margins from VOH, VOL, VIL, VIH'),
      statement: `A symmetric CMOS inverter (kR = 1, Vthn = |Vthp| = ${vt} V) runs from VDD = ${vdd} V. A driving gate guarantees VOH = ${f2(voh)} V and VOL = ${f2(vol)} V. Find VIL and VIH (slope −1 points) and the two noise margins.`,
      figure: { kind: 'noiseMargin', props: { voh, vol, vil, vih, vdd } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_{th}', value: vt, unit: 'V' },
        { sym: 'V_{OH}', value: voh, unit: 'V' },
        { sym: 'V_{OL}', value: vol, unit: 'V' },
      ],
      unknowns: [
        { key: 'vil', sym: 'V_{IL}', label: 'VIL', unit: 'V' },
        { key: 'vih', sym: 'V_{IH}', label: 'VIH', unit: 'V' },
        { key: 'nml', sym: 'NM_L', label: 'Low noise margin', unit: 'V' },
        { key: 'nmh', sym: 'NM_H', label: 'High noise margin', unit: 'V' },
      ],
      answers: { vil, vih, nml: vil - vol, nmh: voh - vih },
      wrong: { nml: [{ mistake: 'signFlip', value: vol - vil }], nmh: [{ mistake: 'signFlip', value: vih - voh }] },
      steps: [
        { tag: '·', title: 'Symmetric inverter (Kang): VIL = (3VDD + 2Vth)/8', tex: `V_{IL} = \\frac{3(${vdd}) + 2(${vt})}{8} = ${texSI((3 * vdd + 2 * vt) / 8, 'V')}`, produces: 'vil', value: (3 * vdd + 2 * vt) / 8 },
        { tag: '·', title: 'VIH = (5VDD − 2Vth)/8 (mirror image about VDD/2)', tex: `V_{IH} = \\frac{5(${vdd}) - 2(${vt})}{8} = ${texSI((5 * vdd - 2 * vt) / 8, 'V')}`, produces: 'vih', value: (5 * vdd - 2 * vt) / 8 },
        { tag: '·', title: 'NML = VIL − VOL: how much a 0 can be pushed up and still read as 0', tex: `NM_L = ${texSI((3 * vdd + 2 * vt) / 8 - vol, 'V')}`, produces: 'nml', value: (3 * vdd + 2 * vt) / 8 - vol },
        { tag: '✓', title: 'NMH = VOH − VIH', tex: `NM_H = ${texSI(voh - (5 * vdd - 2 * vt) / 8, 'V')}`, produces: 'nmh', value: voh - (5 * vdd - 2 * vt) / 8 },
      ],
      hints: ['What the driver guarantees vs what the receiver needs.', 'VIL and VIH are where the VTC slope is −1.', 'Symmetric: VIL = (3VDD + 2Vth)/8, VIH = (5VDD − 2Vth)/8; NML = VIL − VOL, NMH = VOH − VIH.', `VIL = ${f2(vil)} V.`],
    };
    return { problem, sane: vil > vol && voh > vih };
  },
};

/* ─── L16: resistive and pseudo-nMOS loads ─── */

export const genResistive: Generator = {
  id: 'd16-resistive',
  unit: 'L16',
  title: 'Resistive-load inverter: VOL, VIL, VIH and static power',
  make(rng: Rng): GeneratorOutput {
    const vdd = 5;
    const vt = pick(rng, [0.8, 1]);
    const kn = pick(rng, [50e-6, 100e-6, 200e-6]);
    const rl = pick(rng, [50e3, 100e3, 200e3]);
    const r = resistiveInverter({ vdd, vt, kn, rl });
    const a = 1 / (kn * rl);
    const vol = vdd - vt + a - Math.sqrt((vdd - vt + a) ** 2 - 2 * vdd * a);
    const problem: Problem = {
      ...base('d16-resistive', 'L16', 'Resistive-load inverter'),
      statement: `An nMOS inverter with a load resistor: VDD = ${vdd} V, Vth = ${vt} V, kn = µnCox(W/L) = ${f2(kn * 1e6)} µA/V², RL = ${f2(rl / 1e3)} kΩ (λ = 0). Find VOL, VIL, VIH, and the static power when the output is low.`,
      figure: { kind: 'inverter', props: { load: 'resistive' } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_{th}', value: vt, unit: 'V' },
        { sym: 'k_n', value: kn, unit: 'A/V²' },
        { sym: 'R_L', value: rl, unit: 'Ω' },
      ],
      unknowns: [
        { key: 'vol', sym: 'V_{OL}', label: 'VOL', unit: 'V' },
        { key: 'vil', sym: 'V_{IL}', label: 'VIL', unit: 'V' },
        { key: 'vih', sym: 'V_{IH}', label: 'VIH', unit: 'V' },
        { key: 'p', sym: 'P_{static}', label: 'Static power (output low)', unit: 'W' },
      ],
      answers: { vol: r.vol, vil: r.vil, vih: r.vih, p: r.pstatic },
      wrong: { vol: [{ mistake: 'forgotHalf', value: vdd - vt + a / 2 - Math.sqrt((vdd - vt + a / 2) ** 2 - vdd * a) }] },
      steps: [
        { tag: 'A', title: 'Output low: Vin = VOH = VDD, the nMOS is in triode. KCL: (VDD − VOL)/RL = (kn/2)[2(VDD − Vth)VOL − VOL²]', tex: `\\frac{1}{k_nR_L} = ${texSI(a, 'V')}` },
        { tag: 'A', title: 'Solve the quadratic (take the small root)', tex: `V_{OL} = V_{DD} - V_{th} + \\tfrac{1}{k_nR_L} - \\sqrt{\\left(V_{DD} - V_{th} + \\tfrac{1}{k_nR_L}\\right)^2 - \\tfrac{2V_{DD}}{k_nR_L}} = ${texSI(vol, 'V')}`, produces: 'vol', value: vol },
        { tag: '·', title: 'VIL: slope −1 with the nMOS saturated', tex: `V_{IL} = V_{th} + \\frac{1}{k_nR_L} = ${texSI(vt + a, 'V')}`, produces: 'vil', value: vt + a },
        { tag: '·', title: 'VIH: slope −1 with the nMOS in triode', tex: `V_{IH} = V_{th} + \\sqrt{\\frac{8V_{DD}}{3k_nR_L}} - \\frac{1}{k_nR_L} = ${texSI(vt + Math.sqrt((8 * vdd * a) / 3) - a, 'V')}`, produces: 'vih', value: vt + Math.sqrt((8 * vdd * a) / 3) - a },
        { tag: '✓', title: 'Static power: the resistor conducts all the time the output is low', tex: `P = V_{DD}\\frac{V_{DD} - V_{OL}}{R_L} = ${texSI((vdd * (vdd - vol)) / rl, 'W')}`, produces: 'p', value: (vdd * (vdd - vol)) / rl },
      ],
      hints: ['At the output-low point, which region is the nMOS in?', 'Triode: KCL between the resistor and the nMOS.', 'VOL: quadratic; VIL = Vth + 1/(knRL); VIH = Vth + √(8VDD/(3knRL)) − 1/(knRL).', `1/(knRL) = ${f2(a)} V.`],
    };
    return { problem, sane: r.vol < r.vil && r.vil < r.vih && r.vih < vdd };
  },
};

export const genPseudo: Generator = {
  id: 'd16-pseudo',
  unit: 'L16',
  title: 'Pseudo-nMOS inverter: VOL and static current',
  make(rng: Rng): GeneratorOutput {
    const vdd = pick(rng, [1.8, 2.5, 3.3]);
    const vt = pick(rng, [0.4, 0.5]);
    const kn = pick(rng, [200e-6, 400e-6, 800e-6]);
    const ratio = pick(rng, [3, 4, 6]);
    const kp = kn / ratio;
    const r = pseudoNmosVol({ vdd, vtn: vt, vtp: vt, kn, kp });
    const iload = (kp / 2) * (vdd - vt) ** 2;
    const a = vdd - vt;
    const vol = a - Math.sqrt(a * a - (2 * iload) / kn);
    const problem: Problem = {
      ...base('d16-pseudo', 'L16', 'Pseudo-nMOS inverter: VOL and static current'),
      statement: `A pseudo-nMOS inverter (pMOS load with its gate grounded): VDD = ${vdd} V, Vthn = |Vthp| = ${vt} V, kn = ${f2(kn * 1e6)} µA/V², kp = ${f2(kp * 1e6)} µA/V². With the input high, find the load current, VOL and the static power.`,
      figure: { kind: 'inverter', props: { load: 'pseudo' } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_{th}', value: vt, unit: 'V' },
        { sym: 'k_n', value: kn, unit: 'A/V²' },
        { sym: 'k_p', value: kp, unit: 'A/V²' },
      ],
      unknowns: [
        { key: 'i', sym: 'I_{load}', label: 'Load current', unit: 'A' },
        { key: 'vol', sym: 'V_{OL}', label: 'VOL', unit: 'V' },
        { key: 'p', sym: 'P_{static}', label: 'Static power', unit: 'W' },
      ],
      answers: { i: r.istatic, vol: r.vol, p: r.pstatic },
      wrong: { i: [{ mistake: 'forgotHalf', value: kp * (vdd - vt) ** 2 }] },
      steps: [
        { tag: 'A', title: 'The pMOS (|VGS| = VDD, VOL small) is saturated: a current source', tex: `I = \\frac{k_p}{2}(V_{DD} - |V_{thp}|)^2 = ${texSI(iload, 'A')}`, produces: 'i', value: iload },
        { tag: 'A', title: 'The nMOS (VGS = VDD) is in triode and must sink that current', tex: `\\frac{k_n}{2}\\left[2(V_{DD} - V_{thn})V_{OL} - V_{OL}^2\\right] = I \\Rightarrow V_{OL} = ${texSI(vol, 'V')}`, produces: 'vol', value: vol },
        { tag: '✓', title: 'Static power whenever the output is low', tex: `P = I\\,V_{DD} = ${texSI(iload * vdd, 'W')}`, produces: 'p', value: iload * vdd },
      ],
      hints: ['The load is a pMOS whose gate never moves.', 'With the output low it is saturated: a constant current.', 'I = (kp/2)(VDD − |Vthp|)²; then the triode nMOS equation gives VOL.', `I = ${f2(iload * 1e6)} µA.`],
    };
    return { problem, sane: Number.isFinite(vol) && vol < vt };
  },
};

/* ─── L17: CMOS VM design ─── */

export const genVM: Generator = {
  id: 'd17-vm',
  unit: 'L17',
  title: 'CMOS inverter: switching threshold VM and the kR that sets it',
  make(rng: Rng): GeneratorOutput {
    const vdd = pick(rng, [1.8, 3.3, 5]);
    const vtn = pick(rng, [0.4, 0.5, 0.7]);
    const vtp = pick(rng, [0.4, 0.5, 0.7, 0.8]);
    const kR = pick(rng, [0.5, 1, 2, 3]);
    const kp = 100e-6;
    const kn = kR * kp;
    const vm = cmosVM({ vdd, vtn, vtp, kn, kp });
    const target = vdd / 2;
    const kRt = kRForVM({ vdd, vtn, vtp, vm: target });
    const mu = pick(rng, [2, 2.5, 3]);
    const r = 1 / Math.sqrt(kR);
    const problem: Problem = {
      ...base('d17-vm', 'L17', 'CMOS VM and the kR that sets it'),
      statement: `A CMOS inverter: VDD = ${vdd} V, Vthn = ${vtn} V, |Vthp| = ${vtp} V, kR = kn/kp = ${kR}. (a) Find VM. (b) What kR puts VM at VDD/2? (c) If µn/µp = ${mu}, what (W/L)p/(W/L)n is that?`,
      figure: { kind: 'cmosVtc', props: { spec: { vdd, vtn, vtp, kn, kp } } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_{thn}', value: vtn, unit: 'V' },
        { sym: '|V_{thp}|', value: vtp, unit: 'V' },
        { sym: 'k_R', value: kR, unit: '' },
      ],
      unknowns: [
        { key: 'vm', sym: 'V_M', label: '(a) VM', unit: 'V' },
        { key: 'kr', sym: 'k_R', label: '(b) kR for VM = VDD/2', unit: '' },
        { key: 'wr', sym: '(W/L)_p/(W/L)_n', label: '(c) Width ratio', unit: '' },
      ],
      answers: { vm, kr: kRt, wr: mu / kRt },
      wrong: { vm: [{ mistake: 'ratioInverted', value: (vtn + Math.sqrt(kR) * (vdd - vtp)) / (1 + Math.sqrt(kR)) }] },
      steps: [
        { tag: 'A', title: 'At VM both devices are saturated and carry the same current: (kn/2)(VM − Vthn)² = (kp/2)(VDD − VM − |Vthp|)²', tex: `V_M = \\frac{V_{thn} + \\sqrt{1/k_R}\\,(V_{DD} - |V_{thp}|)}{1 + \\sqrt{1/k_R}} = ${texSI((vtn + r * (vdd - vtp)) / (1 + r), 'V')}`, produces: 'vm', value: (vtn + r * (vdd - vtp)) / (1 + r) },
        { tag: '·', title: 'Design: solve for kR at the target VM', tex: `k_R = \\left(\\frac{V_{DD} - |V_{thp}| - V_M}{V_M - V_{thn}}\\right)^2 = ${texNum(((vdd - vtp - target) / (target - vtn)) ** 2)}`, produces: 'kr', value: ((vdd - vtp - target) / (target - vtn)) ** 2 },
        { tag: '✓', title: 'kR = (µn/µp)·(W/L)n/(W/L)p, so the pMOS must be wider by µn/(µp·kR)', tex: `\\frac{(W/L)_p}{(W/L)_n} = \\frac{${mu}}{${texNum(((vdd - vtp - target) / (target - vtn)) ** 2)}} = ${texNum(mu / (((vdd - vtp - target) / (target - vtn)) ** 2))}`, produces: 'wr', value: mu / (((vdd - vtp - target) / (target - vtn)) ** 2) },
      ],
      hints: ['At VM, Vin = Vout and both transistors are saturated.', 'Equate the two saturation currents.', 'VM = (Vthn + √(1/kR)(VDD − |Vthp|))/(1 + √(1/kR)).', `√(1/kR) = ${f2(r)}.`],
    };
    return { problem, sane: vm > vtn && vm < vdd - vtp && kRt > 0 };
  },
};

/* ─── L18–L19: delay ─── */

export const genDelay: Generator = {
  id: 'd18-delay',
  unit: 'L18',
  title: 'CMOS inverter delays τPHL, τPLH and τP (Kang’s formula)',
  make(rng: Rng): GeneratorOutput {
    const vdd = pick(rng, [1.8, 3.3, 5]);
    const vt = pick(rng, [0.4, 0.5, 0.7, 1]);
    const kn = pick(rng, [100e-6, 200e-6, 400e-6]);
    const kp = kn / pick(rng, [1, 2, 2.5]);
    const cl = pick(rng, [50e-15, 100e-15, 200e-15, 500e-15]);
    const phl = tauPHL({ cl, kn, vtn: vt, voh: vdd, vol: 0 });
    const plh = tauPLH({ cl, kp, vtp: vt, voh: vdd, vol: 0 });
    const a = vdd - vt;
    const hand = (k: number) => (cl / (k * a)) * ((2 * vt) / a + Math.log((4 * a) / vdd - 1));
    const problem: Problem = {
      ...base('d18-delay', 'L18', 'CMOS inverter delays'),
      statement: `A CMOS inverter: VDD = ${vdd} V, Vthn = |Vthp| = ${vt} V, kn = ${f2(kn * 1e6)} µA/V², kp = ${f2(kp * 1e6)} µA/V², driving CL = ${f2(cl * 1e15)} fF (VOH = VDD, VOL = 0). Find τPHL, τPLH and the average τP.`,
      figure: { kind: 'switching', props: { tphl: phl, tplh: plh, vdd } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_{th}', value: vt, unit: 'V' },
        { sym: 'k_n', value: kn, unit: 'A/V²' },
        { sym: 'k_p', value: kp, unit: 'A/V²' },
        { sym: 'C_L', value: cl, unit: 'F' },
      ],
      unknowns: [
        { key: 'phl', sym: '\\tau_{PHL}', label: 'τPHL', unit: 's' },
        { key: 'plh', sym: '\\tau_{PLH}', label: 'τPLH', unit: 's' },
        { key: 'tp', sym: '\\tau_P', label: 'Average τP', unit: 's' },
      ],
      answers: { phl, plh, tp: (phl + plh) / 2 },
      wrong: { phl: [{ mistake: 'forgotHalf', value: phl / 2 }] },
      steps: [
        { tag: '·', title: 'Discharge through the nMOS: saturated until Vout = VDD − Vth, then triode down to VDD/2. Integrating gives', tex: `\\tau_{PHL} = \\frac{C_L}{k_n(V_{DD} - V_{th})}\\left[\\frac{2V_{th}}{V_{DD} - V_{th}} + \\ln\\left(\\frac{4(V_{DD} - V_{th})}{V_{DD}} - 1\\right)\\right] = ${texSI(hand(kn), 's')}`, produces: 'phl', value: hand(kn) },
        { tag: '·', title: 'Charge through the pMOS: the same form with kp', tex: `\\tau_{PLH} = ${texSI(hand(kp), 's')}`, produces: 'plh', value: hand(kp) },
        { tag: '✓', title: 'Average', tex: `\\tau_P = \\frac{\\tau_{PHL} + \\tau_{PLH}}{2} = ${texSI((hand(kn) + hand(kp)) / 2, 's')}`, produces: 'tp', value: (hand(kn) + hand(kp)) / 2 },
      ],
      hints: ['Delay is how long the device takes to move half the swing on CL.', 'The nMOS is saturated first, then in triode.', 'τPHL = CL/(kn(VDD − Vth))·[2Vth/(VDD − Vth) + ln(4(VDD − Vth)/VDD − 1)].', `VDD − Vth = ${f2(a)} V.`],
    };
    return { problem, sane: (4 * a) / vdd - 1 > 0 };
  },
};

export const genSizing: Generator = {
  id: 'd19-size',
  unit: 'L19',
  title: 'Sizing for equal rise and fall; how delay scales with load',
  make(rng: Rng): GeneratorOutput {
    const mu = pick(rng, [2, 2.5, 3]);
    const wn = pick(rng, [0.5, 1, 2]);
    const cl1 = pick(rng, [50e-15, 100e-15]);
    const k = pick(rng, [2, 3, 4]);
    const t1 = pick(rng, [40e-12, 60e-12, 80e-12]);
    const problem: Problem = {
      ...base('d19-size', 'L19', 'Sizing for equal rise and fall'),
      statement: `In a process with µn/µp = ${mu} (equal thresholds), an inverter’s nMOS is W = ${wn} µm. (a) What pMOS width gives τPLH = τPHL? (b) The inverter has τP = ${f2(t1 * 1e12)} ps with CL = ${f2(cl1 * 1e15)} fF. What is τP with ${k}× the load? (c) …and with ${k}× the load and both widths ${k}× larger (self-loading ignored)?`,
      figure: { kind: 'inverter', props: { load: 'cmos' } },
      givens: [
        { sym: '\\mu_n/\\mu_p', value: mu, unit: '' },
        { sym: 'W_n\\,(\\mu m)', value: wn, unit: '' },
        { sym: '\\tau_P', value: t1, unit: 's' },
      ],
      unknowns: [
        { key: 'wp', sym: 'W_p', label: '(a) pMOS width (µm)', unit: '' },
        { key: 't2', sym: '\\tau_P(k C_L)', label: '(b) Delay with more load', unit: 's' },
        { key: 't3', sym: '\\tau_P(k C_L, k W)', label: '(c) Delay, scaled up', unit: 's' },
      ],
      answers: { wp: mu * wn, t2: k * t1, t3: t1 },
      wrong: { wp: [{ mistake: 'ratioInverted', value: wn / mu }] },
      steps: [
        { tag: '·', title: 'Equal delay needs kp = kn: µpWp = µnWn', tex: `W_p = \\frac{\\mu_n}{\\mu_p}W_n = ${texNum(mu * wn)}\\,\\mu\\mathrm{m}`, produces: 'wp', value: mu * wn },
        { tag: '·', title: 'τ ∝ CL/k: more load, proportionally slower', tex: `\\tau_P = ${k}\\times ${texSI(t1, 's')} = ${texSI(k * t1, 's')}`, produces: 't2', value: k * t1 },
        { tag: '✓', title: 'Scale the widths with the load and the ratio CL/k is unchanged', tex: `\\tau_P = ${texSI(t1, 's')}`, produces: 't3', value: t1 },
      ],
      hints: ['Delay ∝ CL/k.', 'Equal rise and fall means kp = kn.', 'Wp = (µn/µp)·Wn; τ scales with CL/W.', `Wp = ${mu} × Wn.`],
    };
    return { problem, sane: true };
  },
};

/* ─── L20: NAND/NOR switching threshold ─── */

export const genGateVM: Generator = {
  id: 'd20-gate-vm',
  unit: 'L20',
  title: 'NAND and NOR: switching threshold with all inputs switching',
  make(rng: Rng): GeneratorOutput {
    const vdd = pick(rng, [3.3, 5]);
    const vt = pick(rng, [0.6, 0.8, 1]);
    const n = pick(rng, [2, 3]);
    const gate = pick(rng, ['NAND', 'NOR'] as const);
    const k = 100e-6;
    const spec = { vdd, vtn: vt, vtp: vt, kn: k, kp: k };
    const vm = gate === 'NAND' ? nandVM(spec, n) : norVM(spec, n);
    const ratio = gate === 'NAND' ? (n * k) / (k / n) : (k / n) / (n * k); // kp,eff/kn,eff
    const r = Math.sqrt(ratio);
    const problem: Problem = {
      ...base('d20-gate-vm', 'L20', 'NAND and NOR switching threshold'),
      statement: `A CMOS ${gate}${n} is built from devices with kn = kp = 100 µA/V² (each), Vthn = |Vthp| = ${vt} V, VDD = ${vdd} V. All ${n} inputs switch together. Find the equivalent kn,eff and kp,eff and the switching threshold VM.`,
      figure: { kind: 'staticGate', props: { expr: gate === 'NAND' ? 'ABC'.slice(0, n) : ['A', 'B', 'C'].slice(0, n).join('+'), sized: false } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_{th}', value: vt, unit: 'V' },
        { sym: 'k_n = k_p', value: k, unit: 'A/V²' },
        { sym: 'n', value: n, unit: '' },
      ],
      unknowns: [
        { key: 'kn', sym: 'k_{n,eff}', label: 'kn,eff (in µA/V²)', unit: '' },
        { key: 'kp', sym: 'k_{p,eff}', label: 'kp,eff (in µA/V²)', unit: '' },
        { key: 'vm', sym: 'V_M', label: 'VM', unit: 'V' },
      ],
      answers: { kn: (gate === 'NAND' ? k / n : n * k) * 1e6, kp: (gate === 'NAND' ? n * k : k / n) * 1e6, vm },
      wrong: { vm: [{ mistake: 'ratioInverted', value: gate === 'NAND' ? norVM(spec, n) : nandVM(spec, n) }] },
      steps: [
        { tag: 'B', title: gate === 'NAND' ? 'nMOS in series (k/n), pMOS in parallel (all on: n·k)' : 'nMOS in parallel (all on: n·k), pMOS in series (k/n)', tex: `k_{n,eff} = ${texSI(gate === 'NAND' ? k / n : n * k, 'A/V²')},\\; k_{p,eff} = ${texSI(gate === 'NAND' ? n * k : k / n, 'A/V²')}`, produces: 'kn', value: (gate === 'NAND' ? k / n : n * k) * 1e6 },
        { tag: 'B', title: 'pull-up equivalent', tex: `k_{p,eff} = ${texSI(gate === 'NAND' ? n * k : k / n, 'A/V²')}`, produces: 'kp', value: (gate === 'NAND' ? n * k : k / n) * 1e6 },
        { tag: '✓', title: 'Then it is an inverter: VM = (Vthn + √(kp/kn)(VDD − |Vthp|))/(1 + √(kp/kn))', tex: `V_M = \\frac{${vt} + ${texNum(r)}(${texNum(vdd - vt)})}{1 + ${texNum(r)}} = ${texSI((vt + r * (vdd - vt)) / (1 + r), 'V')}`, produces: 'vm', value: (vt + r * (vdd - vt)) / (1 + r) },
      ],
      hints: ['Replace the gate by an equivalent inverter.', 'Series devices: k/n. Parallel devices, all on: n·k.', 'Then use the inverter VM formula.', `√(kp,eff/kn,eff) = ${f2(r)}.`],
    };
    return { problem, sane: vm > vt && vm < vdd - vt };
  },
};

/* ─── L21–L22, L27: complex gates ─── */

const EXPRS = ['AB+C', 'A(B+C)', 'AB+CD', 'A(B+C)+D', '(A+B)(C+D)', 'ABC+D', 'A+BC'];

export const genComplex: Generator = {
  id: 'd22-complex',
  unit: 'L22',
  title: 'Complex CMOS gate: count, stack depth, sizes and logical effort',
  make(rng: Rng): GeneratorOutput {
    const expr = pick(rng, EXPRS);
    const pdn = parseExpr(expr);
    const pun = dual(pdn);
    const info = complexGateEffort(expr);
    const a = info[0];
    const problem: Problem = {
      ...base('d22-complex', 'L22', 'Complex CMOS gate'),
      statement: `Build F = NOT(${expr}) as one static CMOS gate. (a) How many transistors? (b) The longest series stack in the pull-down and in the pull-up. (c) Sized for the drive of a unit inverter (nMOS 1, pMOS 2), the nMOS and pMOS widths on input ${a.name} and its logical effort.`,
      figure: { kind: 'staticGate', props: { expr } },
      givens: [{ sym: '\\mu_n/\\mu_p', value: 2, unit: '' }],
      unknowns: [
        { key: 'n', sym: 'N_T', label: '(a) Transistors', unit: '' },
        { key: 'dn', sym: 'stack_n', label: '(b) Pull-down stack', unit: '' },
        { key: 'dp', sym: 'stack_p', label: '(b) Pull-up stack', unit: '' },
        { key: 'wn', sym: `W_{n,${a.name}}`, label: `(c) nMOS width on ${a.name}`, unit: '' },
        { key: 'wp', sym: `W_{p,${a.name}}`, label: `(c) pMOS width on ${a.name}`, unit: '' },
        { key: 'g', sym: `g_{${a.name}}`, label: `(c) Logical effort of ${a.name}`, unit: '' },
      ],
      answers: { n: netSize(pdn) + netSize(pun), dn: stackDepth(pdn), dp: stackDepth(pun), wn: a.wn, wp: a.wp, g: a.g },
      wrong: { dp: [{ mistake: 'parallelAsSeries', value: stackDepth(pdn) }] },
      steps: [
        { tag: 'B', title: 'Pull-down = the expression (AND → series, OR → parallel); pull-up = its dual. One nMOS and one pMOS per input', tex: `N_T = 2 \\times ${netSize(pdn)} = ${2 * netSize(pdn)}`, produces: 'n', value: 2 * netSize(pdn) },
        { tag: 'C', title: 'Longest series path in the pull-down', tex: `${stackDepth(pdn)}`, produces: 'dn', value: stackDepth(pdn) },
        { tag: 'C', title: 'Pull-up (series ↔ parallel swapped)', tex: `${stackDepth(pun)}`, produces: 'dp', value: stackDepth(pun) },
        { tag: 'C', title: `Each device is as wide as the longest series path through it (×1 nMOS, ×2 pMOS): input ${a.name}`, tex: `W_n = ${a.wn},\\; W_p = ${a.wp}`, produces: 'wn', value: a.wn },
        { tag: 'C', title: 'pMOS width', tex: `W_p = ${a.wp}`, produces: 'wp', value: a.wp },
        { tag: '✓', title: 'Logical effort = input capacitance ÷ that of a unit inverter (3)', tex: `g = \\frac{${a.wn} + ${a.wp}}{3} = ${texNum((a.wn + a.wp) / 3)}`, produces: 'g', value: (a.wn + a.wp) / 3 },
      ],
      hints: ['AND in the pull-down means series; OR means parallel.', 'The pull-up is the dual: swap series and parallel.', 'Width = unit × (longest series path through the device); g = (Wn + Wp)/3.', `Pull-down stack = ${stackDepth(pdn)}.`],
    };
    return { problem, sane: true };
  },
};

/* ─── L23–L25: RC, logical effort ─── */

export const genElmore: Generator = {
  id: 'd23-elmore',
  unit: 'L23',
  title: 'Elmore delay of an RC ladder',
  make(rng: Rng): GeneratorOutput {
    const n = pick(rng, [2, 3, 4]);
    const stages = Array.from({ length: n }, () => ({ r: pick(rng, [0.5e3, 1e3, 2e3]), c: pick(rng, [5e-15, 10e-15, 20e-15]) }));
    const t = elmoreLadder(stages);
    const terms = stages.map((s, i) => stages.slice(0, i + 1).reduce((a, x) => a + x.r, 0) * s.c);
    const problem: Problem = {
      ...base('d23-elmore', 'L23', 'Elmore delay of an RC ladder'),
      statement: `An RC ladder: ${stages.map((s, i) => `R${i + 1} = ${f2(s.r / 1e3)} kΩ, C${i + 1} = ${f2(s.c * 1e15)} fF`).join('; ')}. Find the Elmore delay to the last node.`,
      figure: { kind: 'rcLadder', props: { stages } },
      givens: stages.flatMap((s, i) => [
        { sym: `R_${i + 1}`, value: s.r, unit: 'Ω' as const },
        { sym: `C_${i + 1}`, value: s.c, unit: 'F' as const },
      ]),
      unknowns: [{ key: 't', sym: 't_{pd}', label: 'Elmore delay', unit: 's' }],
      answers: { t },
      wrong: { t: [{ mistake: 'parallelAsSeries', value: stages.reduce((a, s) => a + s.r, 0) * stages.reduce((a, s) => a + s.c, 0) }] },
      steps: [
        ...terms.map((x, i) => ({ tag: '·' as const, title: `C${i + 1} sees R1 + … + R${i + 1}`, tex: `(${stages.slice(0, i + 1).map((s) => texSI(s.r, 'Ω')).join(' + ')})\\,${texSI(stages[i].c, 'F')} = ${texSI(x, 's')}` })),
        { tag: '✓' as const, title: 'Add them up', tex: `t_{pd} = ${texSI(terms.reduce((a, b) => a + b, 0), 's')}`, produces: 't', value: terms.reduce((a, b) => a + b, 0) },
      ],
      hints: ['Each capacitor charges through every resistor between it and the driver.', 'Term for Ci: (R1 + … + Ri)·Ci.', 'Sum all the terms.', `First term: ${f2(terms[0] * 1e12)} ps.`],
    };
    return { problem, sane: true };
  },
};

export const genStage: Generator = {
  id: 'd24-stage',
  unit: 'L24',
  title: 'One gate’s delay: d = g·h + p',
  make(rng: Rng): GeneratorOutput {
    const kind = pick(rng, ['inv', 'nand2', 'nand3', 'nor2', 'nor3'] as const);
    const le = kind === 'inv' ? LE.inv : kind.startsWith('nand') ? LE.nand(Number(kind.slice(-1))) : LE.nor(Number(kind.slice(-1)));
    const fanout = pick(rng, [1, 2, 3, 4, 5]);
    const name = { inv: 'inverter', nand2: 'NAND2', nand3: 'NAND3', nor2: 'NOR2', nor3: 'NOR3' }[kind];
    const tau = pick(rng, [3e-12, 5e-12, 10e-12]);
    const d = le.g * fanout + le.p;
    const problem: Problem = {
      ...base('d24-stage', 'L24', 'One gate’s delay: d = g·h + p'),
      statement: `A ${name} drives ${fanout === 1 ? 'one identical copy' : `${fanout} identical copies`} of itself (so h = ${fanout}). Using Weste’s logical effort and parasitic delay for that gate, find g, p, the delay d in units of τ, and the delay if τ = ${f2(tau * 1e12)} ps.`,
      figure: { kind: 'effortPath', props: { stages: [{ name: kind === 'inv' ? 'INV' : name }], cout: fanout, caps: [1] } },
      givens: [
        { sym: 'h', value: fanout, unit: '' },
        { sym: '\\tau', value: tau, unit: 's' },
      ],
      unknowns: [
        { key: 'g', sym: 'g', label: 'Logical effort', unit: '' },
        { key: 'p', sym: 'p', label: 'Parasitic delay', unit: '' },
        { key: 'd', sym: 'd', label: 'Delay (τ)', unit: '' },
        { key: 't', sym: 't_{pd}', label: 'Delay (s)', unit: 's' },
      ],
      answers: { g: le.g, p: le.p, d, t: d * tau },
      wrong: { d: [{ mistake: 'forgotRo', value: le.g * fanout }] },
      steps: [
        { tag: '·', title: kind === 'inv' ? 'Inverter: g = 1, p = 1 (the reference)' : kind.startsWith('nand') ? 'NANDn: g = (n + 2)/3, p = n' : 'NORn: g = (2n + 1)/3, p = n', tex: `g = ${texNum(le.g)},\\; p = ${le.p}`, produces: 'g', value: le.g },
        { tag: '·', title: 'parasitic delay', tex: `p = ${le.p}`, produces: 'p', value: le.p },
        { tag: '·', title: 'd = g·h + p (effort delay + parasitic delay)', tex: `d = ${texNum(le.g)}\\times ${fanout} + ${le.p} = ${texNum(d)}\\,\\tau`, produces: 'd', value: d },
        { tag: '✓', title: 'In seconds', tex: `t = ${texNum(d)}\\times ${texSI(tau, 's')} = ${texSI(d * tau, 's')}`, produces: 't', value: d * tau },
      ],
      hints: ['Delay = effort part + parasitic part.', 'g says how much worse than an inverter the gate drives; h = Cout/Cin.', 'NAND: (n + 2)/3; NOR: (2n + 1)/3; p = n.', `g = ${f2(le.g)}.`],
    };
    return { problem, sane: true };
  },
};

export const genPath: Generator = {
  id: 'd25-path',
  unit: 'L25',
  title: 'Path logical effort: F, stage effort, minimum delay, sizes',
  make(rng: Rng): GeneratorOutput {
    const choices = [
      { name: 'INV', ...LE.inv },
      { name: 'NAND2', ...LE.nand(2) },
      { name: 'NAND3', ...LE.nand(3) },
      { name: 'NOR2', ...LE.nor(2) },
    ];
    const n = pick(rng, [2, 3]);
    const st = Array.from({ length: n }, () => pick(rng, choices));
    const b = n === 3 ? pick(rng, [1, 2, 3]) : 1;
    const stages = st.map((s, i) => ({ g: s.g, p: s.p, b: i === 0 ? b : 1 }));
    const cin = pick(rng, [4, 6, 8, 10]);
    const cout = cin * pick(rng, [10, 20, 45, 64]);
    const r = pathEffort(stages, cin, cout);
    const G = st.reduce((a, s) => a * s.g, 1);
    const F = G * b * (cout / cin);
    const f = F ** (1 / n);
    const P = st.reduce((a, s) => a + s.p, 0);
    const lastCin = (st[n - 1].g * cout) / f;
    const problem: Problem = {
      ...base('d25-path', 'L25', 'Path logical effort'),
      statement: `A path of ${st.map((s) => s.name).join(' → ')} has Cin = ${cin} and drives Cout = ${cout} (units of a unit inverter’s input capacitance)${b > 1 ? `; the first stage’s output also drives ${b - 1} identical off-path copies (branching b = ${b})` : ''}. Find G, F, the best stage effort f̂, the minimum delay D (τ) and the input capacitance of the last gate.`,
      figure: { kind: 'effortPath', props: { stages: st.map((s, i) => ({ name: s.name, b: i === 0 ? b : 1 })), caps: r.caps, cout } },
      givens: [
        { sym: 'C_{in}', value: cin, unit: '' },
        { sym: 'C_{out}', value: cout, unit: '' },
        { sym: 'B', value: b, unit: '' },
      ],
      unknowns: [
        { key: 'G', sym: 'G', label: 'Path logical effort', unit: '' },
        { key: 'F', sym: 'F', label: 'Path effort F = GBH', unit: '' },
        { key: 'f', sym: '\\hat f', label: 'Best stage effort', unit: '' },
        { key: 'D', sym: 'D', label: 'Minimum delay (τ)', unit: '' },
        { key: 'c', sym: 'C_{in,last}', label: 'Input capacitance of the last gate', unit: '' },
      ],
      answers: { G: r.G, F: r.F, f: r.f, D: r.D, c: r.caps[n - 1] },
      wrong: { D: [{ mistake: 'forgotRo', value: n * r.f }] },
      steps: [
        { tag: '·', title: 'G = product of the gates’ logical efforts', tex: `G = ${st.map((s) => texNum(s.g)).join('\\times ')} = ${texNum(G)}`, produces: 'G', value: G },
        { tag: '·', title: 'F = G·B·H with H = Cout/Cin', tex: `F = ${texNum(G)}\\times ${b}\\times \\frac{${cout}}{${cin}} = ${texNum(F)}`, produces: 'F', value: F },
        { tag: '·', title: 'Share the effort equally: f̂ = F^(1/N)', tex: `\\hat f = ${texNum(F)}^{1/${n}} = ${texNum(f)}`, produces: 'f', value: f },
        { tag: '·', title: 'D = N·f̂ + P', tex: `D = ${n}\\times ${texNum(f)} + ${P} = ${texNum(n * f + P)}\\,\\tau`, produces: 'D', value: n * f + P },
        { tag: '✓', title: 'Work back from the load: Cin = g·Cout/f̂', tex: `C_{in,last} = \\frac{${texNum(st[n - 1].g)}\\times ${cout}}{${texNum(f)}} = ${texNum(lastCin)}`, produces: 'c', value: lastCin },
      ],
      hints: ['Delay is least when every stage carries the same effort.', 'F = G·B·H; f̂ = F^(1/N).', 'D = N·f̂ + P; sizes: Cin = g·Cout/f̂ from the output back.', `G = ${f2(G)}.`],
    };
    return { problem, sane: Math.abs(r.D - (n * f + P)) < 1e-9 * r.D && Math.abs(r.caps[n - 1] - lastCin) < 1e-9 * lastCin };
  },
};

/* ─── L26: power ─── */

export const genPower: Generator = {
  id: 'd26-power',
  unit: 'L26',
  title: 'Dynamic and static power',
  make(rng: Rng): GeneratorOutput {
    const alpha = pick(rng, [0.05, 0.1, 0.2, 0.5]);
    const c = pick(rng, [50e-12, 100e-12, 500e-12, 1e-9]);
    const vdd = pick(rng, [0.9, 1, 1.2, 1.8]);
    const f = pick(rng, [200e6, 500e6, 1e9, 2e9]);
    const ileak = pick(rng, [10e-6, 50e-6, 200e-6, 1e-3]);
    const pd = dynamicPower({ alpha, c, vdd, f });
    const vnew = vdd * 0.8;
    const problem: Problem = {
      ...base('d26-power', 'L26', 'Dynamic and static power'),
      statement: `A block switches C = ${f2(c * 1e12)} pF with activity factor α = ${alpha} at f = ${f2(f / 1e6)} MHz from VDD = ${vdd} V and leaks ${f2(ileak * 1e6)} µA. Find the dynamic power, the static power, and the dynamic power if VDD is lowered by 20%.`,
      figure: { kind: 'inverter', props: { load: 'cmos' } },
      givens: [
        { sym: '\\alpha', value: alpha, unit: '' },
        { sym: 'C', value: c, unit: 'F' },
        { sym: 'f', value: f, unit: 'Hz' },
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'I_{leak}', value: ileak, unit: 'A' },
      ],
      unknowns: [
        { key: 'pd', sym: 'P_{dyn}', label: 'Dynamic power', unit: 'W' },
        { key: 'ps', sym: 'P_{static}', label: 'Static power', unit: 'W' },
        { key: 'pd2', sym: "P'_{dyn}", label: 'Dynamic power at 0.8·VDD', unit: 'W' },
      ],
      answers: { pd, ps: ileak * vdd, pd2: dynamicPower({ alpha, c, vdd: vnew, f }) },
      wrong: { pd: [{ mistake: 'forgotSquare', value: alpha * c * vdd * f }], pd2: [{ mistake: 'forgotSquare', value: pd * 0.8 }] },
      steps: [
        { tag: '·', title: 'P = α·C·VDD²·f', tex: `P_{dyn} = ${alpha}\\times ${texSI(c, 'F')}\\times ${vdd}^2\\times ${texSI(f, 'Hz')} = ${texSI(alpha * c * vdd * vdd * f, 'W')}`, produces: 'pd', value: alpha * c * vdd * vdd * f },
        { tag: '·', title: 'Leakage flows all the time', tex: `P_{static} = I_{leak}V_{DD} = ${texSI(ileak * vdd, 'W')}`, produces: 'ps', value: ileak * vdd },
        { tag: '✓', title: 'VDD enters squared: 0.8² = 0.64', tex: `P'_{dyn} = 0.64\\times ${texSI(alpha * c * vdd * vdd * f, 'W')} = ${texSI(0.64 * alpha * c * vdd * vdd * f, 'W')}`, produces: 'pd2', value: 0.64 * alpha * c * vdd * vdd * f },
      ],
      hints: ['Every 0→1 edge takes C·VDD² from the supply.', 'α = fraction of cycles with a 0→1 edge.', 'P = αCVDD²f; static = Ileak·VDD.', `VDD² = ${f2(vdd * vdd)}.`],
    };
    return { problem, sane: true };
  },
};

/* ─── L29–L30: dynamic and pass logic ─── */

export const genShare: Generator = {
  id: 'd29-share',
  unit: 'L29',
  title: 'Charge sharing in a dynamic gate',
  make(rng: Rng): GeneratorOutput {
    const vdd = pick(rng, [1, 1.2, 1.8]);
    const cout = pick(rng, [20e-15, 30e-15, 50e-15]);
    const cx = pick(rng, [5e-15, 10e-15, 20e-15]);
    const vm = vdd / 2;
    const v = chargeSharing({ vdd, cout, cx });
    const cmax = cout * (vdd / vm - 1);
    const problem: Problem = {
      ...base('d29-share', 'L29', 'Charge sharing'),
      statement: `A dynamic gate’s output Y (Cout = ${f2(cout * 1e15)} fF) is precharged to VDD = ${vdd} V; an internal node X (Cx = ${f2(cx * 1e15)} fF) starts at 0 V. During evaluation the top transistor turns on but the path to ground stays off. (a) Where does Y settle? (b) The next gate switches at VDD/2. What is the largest Cx it can tolerate?`,
      figure: { kind: 'dynamicGate', props: { cx: true } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'C_{out}', value: cout, unit: 'F' },
        { sym: 'C_x', value: cx, unit: 'F' },
      ],
      unknowns: [
        { key: 'v', sym: 'V_Y', label: '(a) Y after sharing', unit: 'V' },
        { key: 'cmax', sym: 'C_{x,max}', label: '(b) Largest Cx', unit: 'F' },
      ],
      answers: { v, cmax },
      wrong: { v: [{ mistake: 'ratioInverted', value: (vdd * cx) / (cout + cx) }] },
      steps: [
        { tag: '·', title: 'Charge is conserved: Cout·VDD = (Cout + Cx)·VY', tex: `V_Y = V_{DD}\\frac{C_{out}}{C_{out} + C_x} = ${texSI((vdd * cout) / (cout + cx), 'V')}`, produces: 'v', value: (vdd * cout) / (cout + cx) },
        { tag: '✓', title: 'Keep VY above VDD/2: Cout/(Cout + Cx) ≥ 1/2 → Cx ≤ Cout', tex: `C_{x,max} = ${texSI(cout, 'F')}`, produces: 'cmax', value: cout },
      ],
      hints: ['No charge is lost; it just spreads out.', 'Before: Cout·VDD. After: (Cout + Cx)·VY.', 'VY = VDD·Cout/(Cout + Cx).', 'For VY = VDD/2 you need Cx = Cout.'],
    };
    return { problem, sane: true };
  },
};

export const genPass: Generator = {
  id: 'd30-pass',
  unit: 'L30',
  title: 'Pass transistors: weak levels and chain delay',
  make(rng: Rng): GeneratorOutput {
    const vdd = pick(rng, [1.2, 1.8, 2.5, 3.3]);
    const vtn = pick(rng, [0.35, 0.45, 0.6]);
    const n = pick(rng, [3, 4, 5, 6, 8]);
    const r = pick(rng, [2e3, 5e3, 10e3]);
    const c = pick(rng, [5e-15, 10e-15]);
    const t = passChainDelay({ r, c, n });
    const problem: Problem = {
      ...base('d30-pass', 'L30', 'Pass transistors'),
      statement: `(a) An nMOS pass transistor with its gate at VDD = ${vdd} V (Vthn = ${vtn} V, no body effect) passes a 1. What voltage reaches the output? (b) A chain of ${n} transmission gates, each R = ${f2(r / 1e3)} kΩ, with C = ${f2(c * 1e15)} fF at every node: Elmore delay?`,
      figure: { kind: 'passGate', props: { vdd, vtn, vtp: vtn } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_{thn}', value: vtn, unit: 'V' },
        { sym: 'n', value: n, unit: '' },
        { sym: 'R', value: r, unit: 'Ω' },
        { sym: 'C', value: c, unit: 'F' },
      ],
      unknowns: [
        { key: 'v', sym: 'V_{out}', label: '(a) Passed 1', unit: 'V' },
        { key: 't', sym: 't_{pd}', label: '(b) Chain delay', unit: 's' },
      ],
      answers: { v: vdd - vtn, t },
      wrong: { v: [{ mistake: 'vovNotVgs', value: vdd }], t: [{ mistake: 'parallelAsSeries', value: n * r * c }] },
      steps: [
        { tag: 'A', title: 'The nMOS stops conducting when its source reaches VG − Vthn', tex: `V_{out} = V_{DD} - V_{thn} = ${texSI(vdd - vtn, 'V')}`, produces: 'v', value: vdd - vtn },
        { tag: '✓', title: 'An RC ladder of n equal sections: Elmore = RC(1 + 2 + … + n) = RC·n(n + 1)/2', tex: `t = ${texSI(r * c, 's')}\\times \\frac{${n}(${n + 1})}{2} = ${texSI((r * c * n * (n + 1)) / 2, 's')}`, produces: 't', value: (r * c * n * (n + 1)) / 2 },
      ],
      hints: ['When does an nMOS switch off as its source rises?', 'VGS must stay above Vthn.', 'Weak 1 = VDD − Vthn; chain delay = RC·n(n + 1)/2.', `n(n + 1)/2 = ${(n * (n + 1)) / 2}.`],
    };
    return { problem, sane: true };
  },
};

/* ─── L31–L33: sequencing ─── */

export const genTiming: Generator = {
  id: 'd32-timing',
  unit: 'L32',
  title: 'Flip-flop timing: minimum cycle time and hold check (with skew)',
  make(rng: Rng): GeneratorOutput {
    const ps = (x: number) => x * 1e-12;
    const tpcq = pick(rng, [50, 60, 80]), tccq = pick(rng, [30, 40]), tsetup = pick(rng, [40, 60, 80]), thold = pick(rng, [20, 40, 60]);
    const tpd = nice(rng, 300, 1500, 50);
    const tcd = pick(rng, [10, 20, 40, 60]);
    const skew = pick(rng, [0, 20, 50]);
    const t = ffTiming({ tpcq: ps(tpcq), tccq: ps(tccq), tsetup: ps(tsetup), thold: ps(thold), tpd: ps(tpd), tcd: ps(tcd), tskew: ps(skew) });
    const problem: Problem = {
      ...base('d32-timing', 'L32', 'Flip-flop timing'),
      statement: `Flip-flops with tpcq = ${tpcq} ps, tccq = ${tccq} ps, tsetup = ${tsetup} ps, thold = ${thold} ps. The logic between them has tpd = ${tpd} ps (longest) and tcd = ${tcd} ps (shortest). Clock skew ${skew} ps. Find the minimum cycle time, the maximum clock frequency and the hold slack.`,
      figure: { kind: 'flopTiming', props: { tc: t.tcMin * 1.1, tpcq: ps(tpcq), tpd: ps(tpd), tsetup: ps(tsetup), tskew: ps(skew) } },
      givens: [
        { sym: 't_{pcq}', value: ps(tpcq), unit: 's' },
        { sym: 't_{ccq}', value: ps(tccq), unit: 's' },
        { sym: 't_{setup}', value: ps(tsetup), unit: 's' },
        { sym: 't_{hold}', value: ps(thold), unit: 's' },
        { sym: 't_{pd}', value: ps(tpd), unit: 's' },
        { sym: 't_{cd}', value: ps(tcd), unit: 's' },
        { sym: 't_{skew}', value: ps(skew), unit: 's' },
      ],
      unknowns: [
        { key: 'tc', sym: 'T_{c,min}', label: 'Minimum cycle time', unit: 's' },
        { key: 'f', sym: 'f_{max}', label: 'Maximum clock', unit: 'Hz' },
        { key: 'h', sym: 'slack_{hold}', label: 'Hold slack (negative = violation)', unit: 's' },
      ],
      answers: { tc: t.tcMin, f: t.fMax, h: t.holdSlack },
      wrong: { tc: [{ mistake: 'forgotSatCheck', value: ps(tpcq + tpd + tsetup) }] },
      steps: [
        { tag: '·', title: 'Setup (max delay): launch clk→Q, logic, setup, and skew must fit in a cycle', tex: `T_c \\ge ${tpcq} + ${tpd} + ${tsetup} + ${skew} = ${tpcq + tpd + tsetup + skew}\\,\\mathrm{ps}`, produces: 'tc', value: ps(tpcq + tpd + tsetup + skew) },
        { tag: '·', title: 'fmax = 1/Tc', tex: `f_{max} = ${texSI(1 / ps(tpcq + tpd + tsetup + skew), 'Hz')}`, produces: 'f', value: 1 / ps(tpcq + tpd + tsetup + skew) },
        { tag: '✓', title: 'Hold (min delay): the fastest path must not change D before the hold time ends: tcd ≥ thold − tccq + tskew', tex: `\\text{slack} = ${tcd} - (${thold} - ${tccq} + ${skew}) = ${tcd - (thold - tccq + skew)}\\,\\mathrm{ps}`, produces: 'h', value: ps(tcd - (thold - tccq + skew)) },
      ],
      hints: ['Setup is about the slowest path; hold is about the fastest.', 'Tc ≥ tpcq + tpd + tsetup + tskew.', 'Hold: tcd ≥ thold − tccq + tskew.', `Tc,min = ${tpcq + tpd + tsetup + skew} ps.`],
    };
    return { problem, sane: true };
  },
};

/* ─── L35–L37: arithmetic ─── */

export const genAdder: Generator = {
  id: 'd36-adder',
  unit: 'L36',
  title: 'Ripple-carry vs carry-skip delay',
  make(rng: Rng): GeneratorOutput {
    const N = pick(rng, [16, 32, 64]);
    const n = pick(rng, [4, 8].filter((x) => x < N));
    const k = N / n;
    const tpg = 1, txor = 1, tao = 2, tmux = 2;
    const tr = rippleDelay({ n: N, tpg, tao, txor });
    const ts = carrySkipDelay({ n, k, tpg, tao, tmux, txor });
    const problem: Problem = {
      ...base('d36-adder', 'L36', 'Ripple-carry vs carry-skip delay'),
      statement: `An ${N}-bit adder with unit delays tpg = txor = 1, tAO = tmux = 2. (a) Ripple-carry delay. (b) Carry-skip with ${k} groups of ${n} bits. (c) The speed-up.`,
      givens: [
        { sym: 'N', value: N, unit: '' },
        { sym: 'n', value: n, unit: '' },
        { sym: 'k', value: k, unit: '' },
      ],
      unknowns: [
        { key: 'tr', sym: 't_{ripple}', label: '(a) Ripple (units)', unit: '' },
        { key: 'ts', sym: 't_{skip}', label: '(b) Carry-skip (units)', unit: '' },
        { key: 'sp', sym: 't_{ripple}/t_{skip}', label: '(c) Speed-up', unit: '' },
      ],
      answers: { tr, ts, sp: tr / ts },
      wrong: { tr: [{ mistake: 'forgotRo', value: N * tao }] },
      steps: [
        { tag: '·', title: 'Ripple: PG, then the carry through N − 1 AND-OR stages, then the sum XOR', tex: `t = t_{pg} + (N - 1)t_{AO} + t_{xor} = 1 + ${N - 1}(2) + 1 = ${1 + (N - 1) * 2 + 1}`, produces: 'tr', value: 1 + (N - 1) * 2 + 1 },
        { tag: '·', title: 'Skip: ripple through the first group, skip the middle groups, ripple through the last', tex: `t = t_{pg} + 2(n - 1)t_{AO} + (k - 1)t_{mux} + t_{xor} = 1 + ${2 * (n - 1)}(2) + ${k - 1}(2) + 1 = ${1 + 2 * (n - 1) * 2 + (k - 1) * 2 + 1}`, produces: 'ts', value: 1 + 2 * (n - 1) * 2 + (k - 1) * 2 + 1 },
        { tag: '✓', title: 'Speed-up', tex: `${texNum((1 + (N - 1) * 2 + 1) / (1 + 2 * (n - 1) * 2 + (k - 1) * 2 + 1))}`, produces: 'sp', value: (1 + (N - 1) * 2 + 1) / (1 + 2 * (n - 1) * 2 + (k - 1) * 2 + 1) },
      ],
      hints: ['The carry is the slow part.', 'Ripple: every bit waits for the previous carry.', 'Skip: a group whose bits all propagate passes its carry-in straight through a mux.', `k = ${k} groups.`],
      flags: ['Delay formulas as in Weste & Harris §11.2.2 (unit gate delays). Check them against your lecture’s version.'],
    };
    return { problem, sane: true };
  },
};

export const genBooth: Generator = {
  id: 'd37-booth',
  unit: 'L37',
  title: 'Radix-4 Booth recoding',
  make(rng: Rng): GeneratorOutput {
    const y = Math.floor(rng() * 256) - 128;
    const d = boothRadix4(y, 8);
    const problem: Problem = {
      ...base('d37-booth', 'L37', 'Radix-4 Booth recoding'),
      statement: `Recode the 8-bit two’s-complement multiplier y = ${y} (${((y + 256) % 256).toString(2).padStart(8, '0')}₂) in radix-4 Booth digits d0 (least significant) … d3. How many partial products does an 8-bit Booth multiplier need, versus a plain array?`,
      givens: [{ sym: 'y', value: y, unit: '' }],
      unknowns: [
        ...d.map((_, i) => ({ key: `d${i}`, sym: `d_${i}`, label: `Digit d${i}`, unit: '' as const, tol: 0.001 })),
        { key: 'pp', sym: 'N_{PP}', label: 'Booth partial products', unit: '' as const },
        { key: 'arr', sym: 'N_{PP,array}', label: 'Array partial products', unit: '' as const },
      ],
      answers: { ...Object.fromEntries(d.map((x, i) => [`d${i}`, x])), pp: d.length, arr: 8 },
      wrong: {},
      steps: [
        ...d.map((_, i) => {
          const bit = (k: number) => (k < 0 ? 0 : (((y % 256) + 256) % 256 >> k) & 1);
          return { tag: '·' as const, title: `Group ${i}: bits y${2 * i + 1} y${2 * i} y${2 * i - 1} = ${bit(2 * i + 1)}${bit(2 * i)}${bit(2 * i - 1)}`, tex: `d_${i} = -2(${bit(2 * i + 1)}) + ${bit(2 * i)} + ${bit(2 * i - 1)} = ${-2 * bit(2 * i + 1) + bit(2 * i) + bit(2 * i - 1)}`, produces: `d${i}`, value: -2 * bit(2 * i + 1) + bit(2 * i) + bit(2 * i - 1) };
        }),
        { tag: '·' as const, title: 'Check: Σ di·4^i', tex: `${d.map((x, i) => `(${x})4^${i}`).join(' + ')} = ${d.reduce((a, x, i) => a + x * 4 ** i, 0)}` },
        { tag: '·' as const, title: 'One partial product per digit', tex: `${d.length}`, produces: 'pp', value: d.length },
        { tag: '✓' as const, title: 'A plain array needs one per multiplier bit', tex: '8', produces: 'arr', value: 8 },
      ],
      hints: ['Group the bits in overlapping threes, starting with an imaginary y−1 = 0.', 'digit = −2·(top) + (middle) + (bottom).', 'Each digit is in {−2, −1, 0, +1, +2}.', 'Check your digits by adding di·4^i.'],
    };
    return { problem, sane: d.reduce((a, x, i) => a + x * 4 ** i, 0) === y };
  },
};

/* ─── L38: SRAM ─── */

export const genSram: Generator = {
  id: 'd38-sram',
  unit: 'L38',
  title: 'SRAM read stability and bitline timing',
  make(rng: Rng): GeneratorOutput {
    const vdd = pick(rng, [1, 1.2]);
    const vtn = pick(rng, [0.3, 0.35, 0.4]);
    const ka = 100e-6;
    const cr = pick(rng, [1.5, 2, 3]);
    const bump = sramReadBump({ vdd, vtn, kAccess: ka, kPulldown: ka * cr });
    const cbl = pick(rng, [100e-15, 200e-15, 500e-15]);
    const dv = pick(rng, [0.1, 0.15, 0.2]);
    const icell = pick(rng, [20e-6, 40e-6, 50e-6]);
    // hand: quadratic (ka/2)(a − V)² = kd(aV − V²/2), a = VDD − Vtn → (ka/2 + kd/2)V² − (ka + kd)a V + (ka/2)a² = 0
    const a = vdd - vtn;
    const kd = ka * cr;
    const A = (ka + kd) / 2, B = -(ka + kd) * a, C = (ka / 2) * a * a;
    const vh = (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A);
    const problem: Problem = {
      ...base('d38-sram', 'L38', 'SRAM read stability and bitline timing'),
      statement: `A 6T cell reads a stored 0. The bitline is precharged to VDD = ${vdd} V; the access transistor (k = 100 µA/V²) is saturated and the pull-down (cell ratio ${cr}, so k = ${cr * 100} µA/V²) is in triode. Vthn = ${vtn} V. (a) How high does the 0-node rise? (b) The cell sinks ${f2(icell * 1e6)} µA from a ${f2(cbl * 1e15)} fF bitline: how long until the bitline has dropped ${dv * 1e3} mV for the sense amplifier?`,
      figure: { kind: 'sramCell', props: { q: 0, reading: true, bump } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_{thn}', value: vtn, unit: 'V' },
        { sym: 'CR', value: cr, unit: '' },
        { sym: 'C_{BL}', value: cbl, unit: 'F' },
        { sym: 'I_{cell}', value: icell, unit: 'A' },
        { sym: '\\Delta V', value: dv, unit: 'V' },
      ],
      unknowns: [
        { key: 'v', sym: 'V_{Q}', label: '(a) Read bump', unit: 'V' },
        { key: 't', sym: 't_{read}', label: '(b) Bitline time', unit: 's' },
      ],
      answers: { v: bump, t: (cbl * dv) / icell },
      wrong: { v: [{ mistake: 'forgotHalf', value: bump / 2 }] },
      steps: [
        { tag: 'A', title: 'Access saturated (VGS = VDD − VQ) = pull-down in triode (VGS = VDD)', tex: `\\frac{k_a}{2}(V_{DD} - V_Q - V_{thn})^2 = k_d\\left[(V_{DD} - V_{thn})V_Q - \\frac{V_Q^2}{2}\\right]` },
        { tag: 'A', title: 'A quadratic in VQ: take the small root', tex: `V_Q = ${texSI(vh, 'V')}`, produces: 'v', value: vh },
        { tag: '✓', title: 'Bitline: a constant current discharging a capacitor', tex: `t = \\frac{C_{BL}\\Delta V}{I_{cell}} = ${texSI((cbl * dv) / icell, 's')}`, produces: 't', value: (cbl * dv) / icell },
      ],
      hints: ['During a read, two nMOS fight over the 0-node.', 'Access: saturated; pull-down: triode.', 'Equate the currents; for the bitline t = C·ΔV/I.', `VDD − Vthn = ${f2(a)} V.`],
    };
    return { problem, sane: Math.abs(vh - bump) < 1e-6 && bump > 0 && bump < a };
  },
};

export const DIGITAL_GENERATORS: Generator[] = [genMargins, genResistive, genPseudo, genVM, genDelay, genSizing, genGateVM, genComplex, genElmore, genStage, genPath, genPower, genShare, genPass, genTiming, genAdder, genBooth, genSram];
