/**
 * Generators for Milestone 1: U0 circuit language, U2 regions, U3 DC recipe (NMOS/PMOS, analysis and
 * design), U4 small signal, U5 common source.
 *
 * Each generator computes `answers` with src/physics (the direct solve) and builds the step trace with
 * the arithmetic written out (the traced solve). generate() refuses to show a problem unless both agree.
 */
import {
  csResistive,
  gmFromIdVov,
  gmFromVov,
  idSat,
  idTriode,
  intrinsicGain,
  overdrive,
  parallel,
  region,
  rO,
  vovFromId,
  wlFromId,
  csGainFromDrop,
  currentDivider,
} from '../../physics';
import { nice, pick, type Rng } from '../rng';
import type { Generator, GeneratorOutput, Problem } from '../schema';
import { texNum, texSI } from '../tex';

const KP_N = [100e-6, 200e-6, 300e-6, 400e-6];
const KP_P = [50e-6, 80e-6, 100e-6];

function base(id: string, unit: string, title: string): Pick<Problem, 'id' | 'generator' | 'source' | 'tags' | 'title'> {
  return { id, generator: id, source: 'generated', tags: [unit], title };
}

// ─── U0 ────────────────────────────────────────────────────────────────────

/** Two resistors in series from VDD to ground: find the current and the middle node. */
export const genVoltageDrop: Generator = {
  id: 'u0-drop',
  unit: 'U0',
  title: 'Walk the drops down a resistor stack',
  make(rng: Rng): GeneratorOutput {
    const vdd = pick(rng, [1.8, 3, 3.3, 5]);
    const r1 = nice(rng, 1e3, 20e3, 1e3);
    const r2 = nice(rng, 1e3, 20e3, 1e3);
    const i = vdd / (r1 + r2);
    const va = vdd - i * r1;
    const problem: Problem = {
      ...base('u0-drop', 'U0', 'Walk the drops down a resistor stack'),
      statement: `A current flows from VDD down through R1 and then R2 to ground. Find the current and the voltage at node A between the resistors.`,
      figure: { kind: 'resStack', props: { vdd, r1, r2 } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'R_1', value: r1, unit: 'Ω' },
        { sym: 'R_2', value: r2, unit: 'Ω' },
      ],
      unknowns: [
        { key: 'i', sym: 'I', label: 'Current', unit: 'A' },
        { key: 'va', sym: 'V_A', label: 'Node A voltage', unit: 'V' },
      ],
      answers: { i, va },
      wrong: { va: [{ mistake: 'wrongDrop', value: i * r1 }] },
      steps: [
        {
          tag: '·',
          title: 'Series: the same current flows through both, so add the resistances',
          tex: `I = \\frac{V_{DD}}{R_1 + R_2} = \\frac{${texNum(vdd)}}{${texSI(r1, 'Ω')} + ${texSI(r2, 'Ω')}} = ${texSI(vdd / (r1 + r2), 'A')}`,
          produces: 'i',
          value: vdd / (r1 + r2),
          highlight: ['r1', 'r2'],
        },
        {
          tag: '·',
          title: 'Node = supply − drops above it',
          tex: `V_A = V_{DD} - I R_1 = ${texNum(vdd)} - ${texSI(vdd / (r1 + r2), 'A')} \\times ${texSI(r1, 'Ω')} = ${texSI(vdd - (vdd / (r1 + r2)) * r1, 'V')}`,
          produces: 'va',
          value: vdd - (vdd / (r1 + r2)) * r1,
          highlight: ['r1', 'nodeA'],
        },
        { tag: '✓', title: 'Check: the drop across R2 must equal VA', tex: `I R_2 = ${texSI(i * r2, 'V')} = V_A\\;\\checkmark` },
      ],
      hints: [
        'Water flows downhill: the node sits below VDD by whatever R1 drops.',
        'First find the current. Series resistors carry the same current.',
        'I = VDD/(R1 + R2), then VA = VDD − I·R1.',
        `I = ${(i * 1e6).toPrecision(3)} µA. Now subtract I·R1 from VDD.`,
      ],
    };
    return { problem, sane: va > 0 && va < vdd };
  },
};

/** Two resistors in parallel: equivalent resistance and current split. */
export const genParallel: Generator = {
  id: 'u0-parallel',
  unit: 'U0',
  title: 'Parallel resistors and the current divider',
  make(rng) {
    const ra = nice(rng, 1e3, 50e3, 1e3);
    const rb = nice(rng, 1e3, 50e3, 1e3);
    const itot = nice(rng, 50e-6, 500e-6, 10e-6);
    const rp = parallel(ra, rb);
    const ia = currentDivider(itot, ra, rb);
    const problem: Problem = {
      ...base('u0-parallel', 'U0', 'Parallel resistors and the current divider'),
      statement: 'A current I enters a node with two resistors to ground. Find their equivalent resistance and the current through RA.',
      figure: { kind: 'parallelPair', props: { ra, rb, i: itot } },
      givens: [
        { sym: 'R_A', value: ra, unit: 'Ω' },
        { sym: 'R_B', value: rb, unit: 'Ω' },
        { sym: 'I', value: itot, unit: 'A' },
      ],
      unknowns: [
        { key: 'rp', sym: 'R_A \\parallel R_B', label: 'Equivalent resistance', unit: 'Ω' },
        { key: 'ia', sym: 'I_A', label: 'Current in RA', unit: 'A' },
      ],
      answers: { rp, ia },
      wrong: {
        rp: [{ mistake: 'parallelAsSeries', value: ra + rb }],
        ia: [{ mistake: 'parallelAsSeries', value: (itot * ra) / (ra + rb) }],
      },
      steps: [
        {
          tag: '·',
          title: 'Parallel: product over sum. The answer is smaller than either resistor',
          tex: `R_A \\parallel R_B = \\frac{R_A R_B}{R_A + R_B} = ${texSI((ra * rb) / (ra + rb), 'Ω')}`,
          produces: 'rp',
          value: (ra * rb) / (ra + rb),
        },
        {
          tag: '·',
          title: 'Current divider: branch A gets the share set by the OTHER resistor',
          tex: `I_A = I\\,\\frac{R_B}{R_A + R_B} = ${texSI((itot * rb) / (ra + rb), 'A')}`,
          produces: 'ia',
          value: (itot * rb) / (ra + rb),
        },
        { tag: '✓', title: 'Check: the node voltage is the same both ways', tex: `I_A R_A = ${texSI(ia * ra, 'V')} = I\\,(R_A \\parallel R_B)\\;\\checkmark` },
      ],
      hints: [
        'Both resistors connect the same two nodes, so they share one voltage.',
        'Parallel resistance is product over sum; the smaller resistor takes more current.',
        'IA = I·RB/(RA + RB). Note the cross-over: RB goes on top.',
        `RA ‖ RB = ${(rp / 1e3).toPrecision(3)} kΩ.`,
      ],
    };
    return { problem, sane: true };
  },
};

// ─── U2: which region? ─────────────────────────────────────────────────────

const REGIONS = ['Off (cut-off)', 'Triode', 'Saturation'];

export const genRegion: Generator = {
  id: 'u2-region',
  unit: 'U2',
  title: 'Which region, and how much current?',
  make(rng) {
    const kp = pick(rng, KP_N);
    const wl = pick(rng, [5, 10, 20, 40]);
    const vth = pick(rng, [0.4, 0.5, 0.7]);
    const vgs = nice(rng, vth + 0.1, vth + 0.6, 0.05);
    const vds = nice(rng, 0.05, 1.2, 0.05);
    const vov = overdrive(vgs, vth);
    const reg = region(vov, vds);
    const regIdx = reg === 'off' ? 0 : reg === 'triode' ? 1 : 2;
    const id = reg === 'triode' ? idTriode(kp, wl, vov, vds) : idSat(kp, wl, vov);
    const traced = reg === 'triode' ? kp * wl * (vov * vds - (vds * vds) / 2) : 0.5 * kp * wl * vov * vov;
    const problem: Problem = {
      ...base('u2-region', 'U2', 'Which region, and how much current?'),
      statement: 'An NMOS has the gate-source and drain-source voltages shown (λ = 0). Which region is it in, and what is ID?',
      figure: { kind: 'mosBias', props: { vgs, vds } },
      givens: [
        { sym: '\\mu_n C_{ox}', value: kp, unit: 'A/V²' },
        { sym: 'W/L', value: wl, unit: '' },
        { sym: 'V_{th}', value: vth, unit: 'V' },
        { sym: 'V_{GS}', value: vgs, unit: 'V' },
        { sym: 'V_{DS}', value: vds, unit: 'V' },
      ],
      unknowns: [
        { key: 'region', sym: '\\text{region}', label: 'Region', unit: '', choices: REGIONS },
        { key: 'id', sym: 'I_D', label: 'Drain current', unit: 'A' },
      ],
      answers: { region: regIdx, id },
      wrong: {
        region: [{ mistake: 'forgotSatCheck', value: reg === 'triode' ? 2 : 1 }],
        id: [
          { mistake: 'forgotHalf', value: reg === 'saturation' ? 2 * id : id / 2 },
          { mistake: 'forgotSquare', value: 0.5 * kp * wl * vov },
          { mistake: 'vgsForVov', value: 0.5 * kp * wl * vgs * vgs },
          ...(reg === 'triode' ? [{ mistake: 'forgotSatCheck' as const, value: idSat(kp, wl, vov) }] : []),
        ],
      },
      steps: [
        { tag: 'A', title: 'Overdrive first', tex: `V_{ov} = V_{GS} - V_{th} = ${texNum(vgs)} - ${texNum(vth)} = ${texSI(vov, 'V')}` },
        {
          tag: 'A',
          title: 'The fence: compare VDS with Vov',
          tex: `V_{DS} = ${texSI(vds, 'V')} \\;${vds >= vov ? '\\ge' : '<'}\\; V_{ov} = ${texSI(vov, 'V')} \\Rightarrow \\text{${REGIONS[regIdx]}}`,
          produces: 'region',
          value: regIdx,
        },
        reg === 'triode'
          ? {
              tag: 'A',
              title: 'Triode equation',
              tex: `I_D = \\mu_n C_{ox}\\tfrac{W}{L}\\left[V_{ov}V_{DS} - \\tfrac{V_{DS}^2}{2}\\right] = ${texSI(traced, 'A')}`,
              produces: 'id',
              value: traced,
            }
          : {
              tag: 'A',
              title: 'Square law',
              tex: `I_D = \\tfrac12 \\mu_n C_{ox}\\tfrac{W}{L} V_{ov}^2 = \\tfrac12 (${texSI(kp, 'A/V²')})(${wl})(${texNum(vov)})^2 = ${texSI(traced, 'A')}`,
              produces: 'id',
              value: traced,
            },
      ],
      hints: [
        'The region depends on how VDS compares with the overdrive.',
        'Saturation needs VDS ≥ Vov (the drain above the gate minus one threshold).',
        'Vov = VGS − Vth. Saturation: ½µCox(W/L)Vov². Triode: µCox(W/L)[Vov·VDS − VDS²/2].',
        `Vov = ${vov.toFixed(2)} V; compare it with VDS = ${vds.toFixed(2)} V.`,
      ],
    };
    return { problem, sane: vov > 0.05 && Math.abs(vds - vov) > 0.02 };
  },
};

// ─── U3: the DC recipe ─────────────────────────────────────────────────────

/** WE1-style analysis: NMOS with RD, find Vov, ID, VD and check the fence. */
export const genNmosAnalysis: Generator = {
  id: 'u3-nmos-analysis',
  unit: 'U3',
  title: 'DC recipe: NMOS with a drain resistor',
  make(rng) {
    const vdd = pick(rng, [1.8, 3]);
    const vth = pick(rng, [0.4, 0.5]);
    const vg = nice(rng, vth + 0.15, vth + 0.45, 0.05);
    const kp = pick(rng, KP_N);
    const wl = pick(rng, [5, 10, 20, 25]);
    const rd = nice(rng, 2e3, 20e3, 1e3);
    const vov = overdrive(vg, vth);
    const id = idSat(kp, wl, vov);
    const vd = vdd - id * rd;
    const tracedId = 0.5 * kp * wl * (vg - vth) ** 2;
    const tracedVd = vdd - tracedId * rd;
    const sat = vd >= vg - vth;
    const problem: Problem = {
      ...base('u3-nmos-analysis', 'U3', 'DC recipe: NMOS with a drain resistor'),
      statement: 'Find the overdrive, the drain current and the drain voltage, then check saturation (λ = 0 for DC).',
      figure: { kind: 'nmosRd', props: { vdd, vg, rd } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_G', value: vg, unit: 'V' },
        { sym: 'V_{th}', value: vth, unit: 'V' },
        { sym: '\\mu_n C_{ox}', value: kp, unit: 'A/V²' },
        { sym: 'W/L', value: wl, unit: '' },
        { sym: 'R_D', value: rd, unit: 'Ω' },
      ],
      unknowns: [
        { key: 'vov', sym: 'V_{ov}', label: 'Overdrive', unit: 'V' },
        { key: 'id', sym: 'I_D', label: 'Drain current', unit: 'A' },
        { key: 'vd', sym: 'V_D', label: 'Drain voltage', unit: 'V' },
      ],
      answers: { vov, id, vd },
      wrong: {
        vov: [{ mistake: 'vgsForVov', value: vg }],
        id: [
          { mistake: 'forgotHalf', value: 2 * id },
          { mistake: 'forgotSquare', value: 0.5 * kp * wl * vov },
          { mistake: 'vgsForVov', value: 0.5 * kp * wl * vg * vg },
        ],
        vd: [{ mistake: 'wrongDrop', value: id * rd }, { mistake: 'forgotHalf', value: vdd - 2 * id * rd }],
      },
      steps: [
        { tag: 'A', title: 'Assume saturation. Overdrive', tex: `V_{ov} = V_{GS} - V_{th} = ${texNum(vg)} - ${texNum(vth)} = ${texSI(vg - vth, 'V')}`, produces: 'vov', value: vg - vth, highlight: ['m1'] },
        { tag: 'A', title: 'Square law', tex: `I_D = \\tfrac12 \\mu_n C_{ox} \\tfrac{W}{L} V_{ov}^2 = \\tfrac12 (${texSI(kp, 'A/V²')})(${wl})(${texNum(vg - vth)})^2 = ${texSI(tracedId, 'A')}`, produces: 'id', value: tracedId, highlight: ['m1'] },
        { tag: 'A', title: 'Walk the node: VD = VDD − ID·RD', tex: `V_D = ${texNum(vdd)} - ${texSI(tracedId, 'A')} \\times ${texSI(rd, 'Ω')} = ${texSI(tracedVd, 'V')}`, produces: 'vd', value: tracedVd, highlight: ['rd', 'vd'] },
        { tag: '✓', title: 'CHECK the fence: VD ≥ VG − Vth?', tex: `${texSI(tracedVd, 'V')} \\ge ${texSI(vg - vth, 'V')} \\;\\checkmark\\;\\text{saturated}`, highlight: ['m1'] },
      ],
      hints: [
        'Run the DC recipe: assume saturation, then work down from the gate.',
        'Assume saturation → square law → walk the node voltages → check the fence.',
        'Vov = VG − Vth (source grounded); ID = ½µnCox(W/L)Vov²; VD = VDD − ID·RD.',
        `Vov = ${vov.toFixed(2)} V. Put it (squared!) into the square law.`,
      ],
    };
    return { problem, sane: sat && vd > 0.1 && vd < vdd - 0.1 && Math.abs(tracedVd - vd) < 1e-12, why: sat ? undefined : 'left saturation' };
  },
};

/** WE2-style design: choose W/L, VG, RD for a target ID, Vov and VD. */
export const genNmosDesign: Generator = {
  id: 'u3-nmos-design',
  unit: 'U3',
  title: 'Design direction: size the NMOS and pick RD',
  make(rng) {
    const vdd = pick(rng, [1.8, 3]);
    const vth = pick(rng, [0.35, 0.4, 0.5]);
    const kp = pick(rng, KP_N);
    const id = nice(rng, 20e-6, 200e-6, 10e-6);
    const vov = nice(rng, 0.1, 0.3, 0.05);
    const vdTarget = nice(rng, vov + 0.2, vdd - 0.3, 0.1);
    const wl = wlFromId(id, kp, vov);
    const vg = vth + vov;
    const rd = (vdd - vdTarget) / id;
    const tracedWl = (2 * id) / (kp * vov * vov);
    const problem: Problem = {
      ...base('u3-nmos-design', 'U3', 'Design direction: size the NMOS and pick RD'),
      statement: `Design the NMOS stage so it carries the given current at the given overdrive, with the drain sitting at VD = ${vdTarget.toFixed(2)} V. Find W/L, the gate voltage and RD.`,
      figure: { kind: 'nmosRd', props: { vdd, labelOnly: true } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_{th}', value: vth, unit: 'V' },
        { sym: '\\mu_n C_{ox}', value: kp, unit: 'A/V²' },
        { sym: 'I_D', value: id, unit: 'A' },
        { sym: 'V_{ov}', value: vov, unit: 'V' },
        { sym: 'V_D', value: vdTarget, unit: 'V' },
      ],
      unknowns: [
        { key: 'wl', sym: 'W/L', label: 'Aspect ratio', unit: '' },
        { key: 'vg', sym: 'V_G', label: 'Gate voltage', unit: 'V' },
        { key: 'rd', sym: 'R_D', label: 'Drain resistor', unit: 'Ω' },
      ],
      answers: { wl, vg, rd },
      wrong: {
        wl: [{ mistake: 'forgotHalf', value: wl / 2 }, { mistake: 'forgotSquare', value: (2 * id) / (kp * vov) }],
        vg: [{ mistake: 'vgsForVov', value: vov }],
        rd: [{ mistake: 'wrongDrop', value: vdTarget / id }],
      },
      steps: [
        { tag: 'A', title: 'Run the bridge equation backwards', tex: `\\tfrac{W}{L} = \\frac{2 I_D}{\\mu_n C_{ox} V_{ov}^2} = \\frac{2(${texSI(id, 'A')})}{(${texSI(kp, 'A/V²')})(${texNum(vov)})^2} = ${texNum(tracedWl)}`, produces: 'wl', value: tracedWl },
        { tag: 'A', title: 'The gate must sit one threshold plus one overdrive above the source', tex: `V_G = V_{th} + V_{ov} = ${texSI(vth + vov, 'V')}`, produces: 'vg', value: vth + vov },
        { tag: 'A', title: 'RD drops the rest', tex: `R_D = \\frac{V_{DD} - V_D}{I_D} = \\frac{${texNum(vdd)} - ${texNum(vdTarget)}}{${texSI(id, 'A')}} = ${texSI((vdd - vdTarget) / id, 'Ω')}`, produces: 'rd', value: (vdd - vdTarget) / id },
        { tag: '✓', title: 'Check the fence', tex: `V_D = ${texSI(vdTarget, 'V')} \\ge V_G - V_{th} = ${texSI(vov, 'V')}\\;\\checkmark` },
      ],
      hints: [
        'This is the design direction: you know the current and overdrive, so solve for the size.',
        'Same square law, run backwards. Then VG from the overdrive, RD from the drop.',
        'W/L = 2ID/(µCox·Vov²); VG = Vth + Vov; RD = (VDD − VD)/ID.',
        `W/L = 2 × ${(id * 1e6).toFixed(0)} µA / (${(kp * 1e6).toFixed(0)} µ × ${vov.toFixed(2)}²).`,
      ],
    };
    return { problem, sane: wl > 1 && wl < 500 && vdTarget >= vov };
  },
};

/** WE3-style PMOS analysis with RD to ground. */
export const genPmosAnalysis: Generator = {
  id: 'u3-pmos-analysis',
  unit: 'U3',
  title: 'DC recipe: PMOS with magnitudes',
  make(rng) {
    const vdd = pick(rng, [1.8, 3]);
    const vth = pick(rng, [0.5, 0.8]);
    const vsg = nice(rng, vth + 0.15, vth + 0.45, 0.05);
    const vg = vdd - vsg;
    const kp = pick(rng, KP_P);
    const wl = pick(rng, [10, 20, 40, 50]);
    const rd = nice(rng, 1e3, 10e3, 1e3);
    const vov = overdrive(vsg, vth);
    const id = idSat(kp, wl, vov);
    const vd = id * rd;
    const tracedId = 0.5 * kp * wl * (vdd - vg - vth) ** 2;
    const sat = vd <= vg + vth;
    const problem: Problem = {
      ...base('u3-pmos-analysis', 'U3', 'DC recipe: PMOS with magnitudes'),
      statement: 'The PMOS source is at VDD and RD runs from its drain to ground. Find |Vov|, ID and VD, then check saturation.',
      figure: { kind: 'pmosRd', props: { vdd, vg, rd } },
      givens: [
        { sym: 'V_S = V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_G', value: vg, unit: 'V' },
        { sym: '|V_{th}|', value: vth, unit: 'V' },
        { sym: '\\mu_p C_{ox}', value: kp, unit: 'A/V²' },
        { sym: 'W/L', value: wl, unit: '' },
        { sym: 'R_D', value: rd, unit: 'Ω' },
      ],
      unknowns: [
        { key: 'vov', sym: '|V_{ov}|', label: 'Overdrive magnitude', unit: 'V' },
        { key: 'id', sym: 'I_D', label: 'Drain current', unit: 'A' },
        { key: 'vd', sym: 'V_D', label: 'Drain voltage', unit: 'V' },
      ],
      answers: { vov, id, vd },
      wrong: {
        vov: [{ mistake: 'pmosSign', value: vg - vth }, { mistake: 'vgsForVov', value: vsg }],
        id: [
          { mistake: 'forgotHalf', value: 2 * id },
          { mistake: 'pmosSign', value: 0.5 * kp * wl * (vg - vth) ** 2 },
          { mistake: 'forgotSquare', value: 0.5 * kp * wl * vov },
        ],
        vd: [{ mistake: 'wrongDrop', value: vdd - id * rd }],
      },
      steps: [
        { tag: 'A', title: 'Magnitudes: |VGS| = VS − VG', tex: `|V_{GS}| = ${texNum(vdd)} - ${texNum(vg)} = ${texSI(vdd - vg, 'V')}` },
        { tag: 'A', title: 'Overdrive magnitude', tex: `|V_{ov}| = |V_{GS}| - |V_{th}| = ${texSI(vdd - vg - vth, 'V')}`, produces: 'vov', value: vdd - vg - vth, highlight: ['m1'] },
        { tag: 'A', title: 'Square law, all positive', tex: `I_D = \\tfrac12 \\mu_p C_{ox}\\tfrac{W}{L}|V_{ov}|^2 = ${texSI(tracedId, 'A')}`, produces: 'id', value: tracedId, highlight: ['m1'] },
        { tag: 'A', title: 'Walk up from ground: VD = ID·RD', tex: `V_D = ${texSI(tracedId, 'A')} \\times ${texSI(rd, 'Ω')} = ${texSI(tracedId * rd, 'V')}`, produces: 'vd', value: tracedId * rd, highlight: ['rd', 'vd'] },
        { tag: '✓', title: 'CHECK the PMOS fence: VD ≤ VG + |Vth|?', tex: `${texSI(tracedId * rd, 'V')} \\le ${texSI(vg + vth, 'V')}\\;\\checkmark` },
      ],
      hints: [
        'PMOS: flip it upside down in your head, and use magnitudes everywhere.',
        'Same recipe; the source is at the top, so |VGS| = VS − VG.',
        '|Vov| = VS − VG − |Vth|; ID = ½µpCox(W/L)|Vov|²; VD = ID·RD (RD goes to ground).',
        `|VGS| = ${(vdd - vg).toFixed(2)} V, so |Vov| = ${vov.toFixed(2)} V.`,
      ],
    };
    return { problem, sane: sat && vd > 0.1 };
  },
};

// ─── U4: small signal ──────────────────────────────────────────────────────

export const genGmRo: Generator = {
  id: 'u4-gm-ro',
  unit: 'U4',
  title: 'Small-signal parameters: gm, rO, gm·rO',
  make(rng) {
    const kp = pick(rng, KP_N);
    const wl = pick(rng, [10, 20, 40, 50]);
    const id = nice(rng, 20e-6, 400e-6, 10e-6);
    const lambda = pick(rng, [0.05, 0.1, 0.2]);
    const vov = vovFromId(id, kp, wl);
    const gm = gmFromIdVov(id, vov);
    const ro = rO(lambda, id);
    const tracedGm = Math.sqrt(2 * kp * wl * id); // a different face of gm
    const tracedRo = 1 / (lambda * id);
    const problem: Problem = {
      ...base('u4-gm-ro', 'U4', 'Small-signal parameters: gm, rO, gm·rO'),
      statement: 'A saturated NMOS carries ID. Find its transconductance, its output resistance and its intrinsic gain.',
      figure: { kind: 'smallSignalModel', props: {} },
      givens: [
        { sym: '\\mu_n C_{ox}', value: kp, unit: 'A/V²' },
        { sym: 'W/L', value: wl, unit: '' },
        { sym: 'I_D', value: id, unit: 'A' },
        { sym: '\\lambda', value: lambda, unit: '' },
      ],
      unknowns: [
        { key: 'gm', sym: 'g_m', label: 'Transconductance', unit: 'S' },
        { key: 'ro', sym: 'r_O', label: 'Output resistance', unit: 'Ω' },
        { key: 'gmro', sym: 'g_m r_O', label: 'Intrinsic gain', unit: 'V/V' },
      ],
      answers: { gm, ro, gmro: intrinsicGain(lambda, vov) },
      wrong: {
        gm: [{ mistake: 'forgotHalf', value: gm / 2 }],
        gmro: [{ mistake: 'forgotHalf', value: 1 / (lambda * vov) }],
      },
      steps: [
        { tag: '·', title: 'gm from current and size (no Vov needed)', tex: `g_m = \\sqrt{2\\mu_n C_{ox}\\tfrac{W}{L} I_D} = \\sqrt{2(${texSI(kp, 'A/V²')})(${wl})(${texSI(id, 'A')})} = ${texSI(tracedGm, 'S')}`, produces: 'gm', value: tracedGm },
        { tag: '·', title: 'rO from the slope of the flat part', tex: `r_O = \\frac{1}{\\lambda I_D} = \\frac{1}{(${lambda})(${texSI(id, 'A')})} = ${texSI(tracedRo, 'Ω')}`, produces: 'ro', value: tracedRo },
        { tag: '·', title: 'Multiply: the current cancels', tex: `g_m r_O = ${texNum(tracedGm * tracedRo)} \\;=\\; \\frac{2}{\\lambda V_{ov}}`, produces: 'gmro', value: tracedGm * tracedRo },
        { tag: '✓', title: 'Check with the third face of gm', tex: `V_{ov} = ${texSI(vov, 'V')},\\; g_m = \\frac{2I_D}{V_{ov}} = ${texSI(gmFromVov(kp, wl, vov), 'S')}\\;\\checkmark` },
      ],
      hints: [
        'Three faces of gm: pick the one that uses what you were given.',
        'You have ID and W/L, so use gm = √(2µCox(W/L)ID).',
        'rO = 1/(λID); intrinsic gain = gm·rO = 2/(λVov).',
        `gm = √(2 × ${(kp * 1e6).toFixed(0)}µ × ${wl} × ${(id * 1e6).toFixed(0)}µ).`,
      ],
    };
    return { problem, sane: vov > 0.05 && vov < 0.8 };
  },
};

// ─── U5: common source ─────────────────────────────────────────────────────

export const genCsGain: Generator = {
  id: 'u5-cs-gain',
  unit: 'U5',
  title: 'Common-source gain from bias to Av',
  make(rng) {
    const vdd = pick(rng, [1.8, 3]);
    const vth = pick(rng, [0.4, 0.5]);
    const vg = nice(rng, vth + 0.15, vth + 0.4, 0.05);
    const kp = pick(rng, KP_N);
    const wl = pick(rng, [5, 10, 20]);
    const rd = nice(rng, 2e3, 20e3, 1e3);
    const lambda = pick(rng, [0.05, 0.1]);
    const vov = vg - vth;
    const id = idSat(kp, wl, vov);
    const vd = vdd - id * rd;
    const gm = gmFromIdVov(id, vov);
    const ro = rO(lambda, id);
    const av = csResistive({ gm, rd, rO: ro });
    const tracedGm = kp * wl * vov;
    const tracedRout = (rd * (1 / (lambda * id))) / (rd + 1 / (lambda * id));
    const problem: Problem = {
      ...base('u5-cs-gain', 'U5', 'Common-source gain from bias to Av'),
      statement: 'Bias the stage (λ = 0 for DC), then find gm, rO and the small-signal gain including rO.',
      figure: { kind: 'nmosRd', props: { vdd, vg, rd, showVin: true } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_G', value: vg, unit: 'V' },
        { sym: 'V_{th}', value: vth, unit: 'V' },
        { sym: '\\mu_n C_{ox}', value: kp, unit: 'A/V²' },
        { sym: 'W/L', value: wl, unit: '' },
        { sym: 'R_D', value: rd, unit: 'Ω' },
        { sym: '\\lambda', value: lambda, unit: '' },
      ],
      unknowns: [
        { key: 'id', sym: 'I_D', label: 'Drain current', unit: 'A' },
        { key: 'gm', sym: 'g_m', label: 'Transconductance', unit: 'S' },
        { key: 'av', sym: 'A_v', label: 'Voltage gain (with sign)', unit: 'V/V' },
      ],
      answers: { id, gm, av },
      wrong: {
        id: [{ mistake: 'forgotHalf', value: 2 * id }, { mistake: 'forgotSquare', value: 0.5 * kp * wl * vov }],
        gm: [{ mistake: 'vgsForVov', value: (2 * id) / vg }],
        av: [
          { mistake: 'forgotRo', value: -gm * rd },
          { mistake: 'vgsForVov', value: -((2 * id) / vg) * parallel(rd, ro) },
        ],
      },
      steps: [
        { tag: 'A', title: 'DC recipe: bias current', tex: `V_{ov} = ${texSI(vov, 'V')},\\quad I_D = \\tfrac12(${texSI(kp, 'A/V²')})(${wl})(${texNum(vov)})^2 = ${texSI(0.5 * kp * wl * vov * vov, 'A')}`, produces: 'id', value: 0.5 * kp * wl * vov * vov, highlight: ['m1'] },
        { tag: '✓', title: 'Check the fence', tex: `V_D = ${texSI(vd, 'V')} \\ge V_G - V_{th} = ${texSI(vov, 'V')}\\;\\checkmark` },
        { tag: 'B', title: 'Role: signal enters the gate, leaves the drain → common source', tex: `G_m = g_m = \\mu_n C_{ox}\\tfrac{W}{L}V_{ov} = ${texSI(tracedGm, 'S')}`, produces: 'gm', value: tracedGm, highlight: ['m1'] },
        { tag: 'C', title: 'Everything at the drain, in parallel: RD and the device’s own rO', tex: `r_O = \\frac{1}{\\lambda I_D} = ${texSI(ro, 'Ω')},\\quad R_{out} = R_D \\parallel r_O = ${texSI(tracedRout, 'Ω')}`, highlight: ['rd', 'vd'] },
        { tag: 'D', title: 'Av = −Gm·Rout (CS inverts)', tex: `A_v = -(${texSI(tracedGm, 'S')})(${texSI(tracedRout, 'Ω')}) = ${texNum(-tracedGm * tracedRout)}`, produces: 'av', value: -tracedGm * tracedRout },
      ],
      hints: [
        'Two jobs: bias first (DC), then gain (small signal). Use the master method.',
        'Step A for ID; Step B: gate→drain = common source; Step C: RD ‖ rO; Step D: Av = −Gm·Rout.',
        'gm = 2ID/Vov (or µCox(W/L)Vov); rO = 1/(λID); Av = −gm(RD ‖ rO).',
        `ID = ${(id * 1e6).toPrecision(3)} µA, so gm = ${(gm * 1e3).toPrecision(3)} mS.`,
      ],
    };
    return { problem, sane: vd >= vov + 0.05 && vd < vdd - 0.1 };
  },
};

/** |Av| = 2·Vdrop/Vov: the reason resistor loads died. */
export const genGainFromDrop: Generator = {
  id: 'u5-gain-drop',
  unit: 'U5',
  title: 'Gain = twice the drop over the overdrive',
  make(rng) {
    const target = pick(rng, [5, 8, 10, 20]);
    const vov = pick(rng, [0.1, 0.15, 0.2, 0.25]);
    const vdd = pick(rng, [1, 1.2, 1.8]);
    const drop = (target * vov) / 2;
    const fits = drop < vdd - vov;
    // Direct check through the physics module: this drop must give back the target gain.
    const roundTrip = csGainFromDrop(drop, vov);
    const problem: Problem = {
      ...base('u5-gain-drop', 'U5', 'Gain = twice the drop over the overdrive'),
      statement: `A resistively loaded CS stage must give |Av| = ${target} (λ = 0) at Vov = ${vov} V. How much DC voltage must RD drop? Can it fit on a ${vdd} V supply, given the transistor needs at least Vov across it?`,
      figure: { kind: 'nmosRd', props: { vdd, labelOnly: true } },
      givens: [
        { sym: '|A_v|', value: target, unit: 'V/V' },
        { sym: 'V_{ov}', value: vov, unit: 'V' },
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
      ],
      unknowns: [
        { key: 'drop', sym: 'I_D R_D', label: 'DC drop across RD', unit: 'V' },
        { key: 'fits', sym: '\\text{fits?}', label: 'Does it fit?', unit: '', choices: ['Yes, it fits', 'No, it does not fit'] },
      ],
      answers: { drop, fits: fits ? 0 : 1 },
      wrong: { drop: [{ mistake: 'forgotHalf', value: target * vov }] },
      steps: [
        { tag: 'D', title: 'Substitute gm = 2ID/Vov into gm·RD', tex: `|A_v| = g_m R_D = \\frac{2 I_D R_D}{V_{ov}} \\Rightarrow I_D R_D = \\frac{|A_v| V_{ov}}{2} = \\frac{${target} \\times ${vov}}{2} = ${texSI(drop, 'V')}`, produces: 'drop', value: (target * vov) / 2 },
        { tag: '✓', title: 'Budget the supply', tex: `${texSI(drop, 'V')} + V_{ov} = ${texSI(drop + vov, 'V')} \\;${fits ? '\\le' : '>'}\\; ${texSI(vdd, 'V')}`, produces: 'fits', value: fits ? 0 : 1 },
      ],
      hints: [
        'Rewrite the gain using the designer’s form of gm.',
        'gm = 2ID/Vov turns gm·RD into 2·(ID·RD)/Vov.',
        'Drop = |Av|·Vov/2; then add Vov for the transistor and compare with VDD.',
        `Drop = ${target} × ${vov}/2.`,
      ],
    };
    return { problem, sane: Math.abs(roundTrip - target) < 1e-9 };
  },
};

export const FOUNDATION_GENERATORS: Generator[] = [
  genVoltageDrop,
  genParallel,
  genRegion,
  genNmosAnalysis,
  genNmosDesign,
  genPmosAnalysis,
  genGmRo,
  genCsGain,
  genGainFromDrop,
];
