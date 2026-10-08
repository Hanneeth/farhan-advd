/**
 * Generators for Milestone 2 (U6–U9): the three impedance rules, current mirrors, CS with every load,
 * degeneration (ratio rule), source follower, common gate, cascode (and the load trap), telescopic swing.
 *
 * As in foundations.ts: `answers` come from src/physics (direct solve); every step's `value` is the same
 * quantity recomputed from the arithmetic written in the step (traced solve). generate() discards any
 * problem where they disagree or where a device is out of saturation.
 */
import {
  cascodeGain,
  cascodeRoutApprox,
  cgGain,
  cgRin,
  csActiveLoad,
  csCurrentSourceLoad,
  csDegenerated,
  csDiodeLoad,
  csResistive,
  followerGain,
  followerRout,
  gmDegenerated,
  gmFromIdVov,
  mirrorCurrent,
  rIntoDrain,
  rIntoSource,
  rO,
  SET_B,
  vovFromId,
  wlFromId,
} from '../../physics';
import { nice, pick, type Rng } from '../rng';
import type { Generator, GeneratorOutput, Problem } from '../schema';
import { texNum, texSI } from '../tex';

function base(id: string, unit: string, title: string): Pick<Problem, 'id' | 'generator' | 'source' | 'tags' | 'title'> {
  return { id, generator: id, source: 'generated', tags: [unit], title };
}
const par = (a: number, b: number) => (a * b) / (a + b);

// ─── U6: impedance rules ───────────────────────────────────────────────────

export const genImpedance: Generator = {
  id: 'u6-impedance',
  unit: 'U6',
  title: 'Look into a terminal: the three impedance rules',
  make(rng: Rng): GeneratorOutput {
    const terminal = pick(rng, ['drain', 'source'] as const);
    const id = nice(rng, 50e-6, 400e-6, 50e-6);
    const vov = nice(rng, 0.15, 0.3, 0.05);
    const lambda = pick(rng, [0.05, 0.1, 0.2]);
    const gm = gmFromIdVov(id, vov);
    const ro = rO(lambda, id);
    const gmTr = (2 * id) / vov;
    const roTr = 1 / (lambda * id);
    if (terminal === 'drain') {
      const rs = nice(rng, 1e3, 10e3, 1e3);
      const r = rIntoDrain({ gm, rO: ro, rs });
      const rTr = roTr + (1 + gmTr * roTr) * rs;
      const problem: Problem = {
        ...base('u6-impedance', 'U6', 'Look into a terminal: the three impedance rules'),
        statement: `An NMOS carries ID with overdrive Vov and has a resistor RS under its source; its gate is at a fixed voltage. Find gm, rO and the resistance looking into the drain.`,
        figure: { kind: 'impedance', props: { terminal: 'drain', rs, r } },
        givens: [
          { sym: 'I_D', value: id, unit: 'A' },
          { sym: 'V_{ov}', value: vov, unit: 'V' },
          { sym: '\\lambda', value: lambda, unit: '' },
          { sym: 'R_S', value: rs, unit: 'Ω' },
        ],
        unknowns: [
          { key: 'gm', sym: 'g_m', label: 'Transconductance', unit: 'S' },
          { key: 'ro', sym: 'r_O', label: 'Output resistance of the device', unit: 'Ω' },
          { key: 'r', sym: 'R_{\\text{drain}}', label: 'Resistance into the drain', unit: 'Ω' },
        ],
        answers: { gm, ro, r },
        wrong: { r: [{ mistake: 'wrongTerminalRule', value: ro + rs }, { mistake: 'wrongTerminalRule', value: ro }] },
        steps: [
          { tag: 'C', title: 'gm from the bias', tex: `g_m = \\frac{2I_D}{V_{ov}} = \\frac{2(${texSI(id, 'A')})}{${texNum(vov)}} = ${texSI(gmTr, 'S')}`, produces: 'gm', value: gmTr },
          { tag: 'C', title: 'rO from λ', tex: `r_O = \\frac{1}{\\lambda I_D} = \\frac{1}{(${lambda})(${texSI(id, 'A')})} = ${texSI(roTr, 'Ω')}`, produces: 'ro', value: roTr },
          {
            tag: 'C',
            title: 'Into the drain with RS below: rO + (1 + gm·rO)·RS. "Up multiplies"',
            tex: `R = r_O + (1 + g_m r_O)R_S = ${texSI(roTr, 'Ω')} + (1 + ${texNum(gmTr * roTr)})(${texSI(rs, 'Ω')}) = ${texSI(rTr, 'Ω')}`,
            produces: 'r',
            value: rTr,
            highlight: ['term', 'rs'],
          },
          { tag: '✓', title: 'Sense check: RS is boosted by about gm·rO', tex: `g_m r_O R_S \\approx ${texSI(gmTr * roTr * rs, 'Ω')}` },
        ],
        hints: [
          'Which terminal are you looking into? The drain is the "big" one.',
          'Rule 2: looking into the drain gives rO, and anything under the source is multiplied by gm·rO.',
          'R = rO + (1 + gm·rO)·RS with gm = 2ID/Vov and rO = 1/(λID).',
          `gm = ${(gmTr * 1e3).toPrecision(3)} mA/V and rO = ${(roTr / 1e3).toPrecision(3)} kΩ.`,
        ],
      };
      return { problem, sane: true };
    }
    const rd = nice(rng, 5e3, 50e3, 5e3);
    const r = rIntoSource({ gm, rO: ro, rd });
    const rTr = (rd + roTr) / (1 + gmTr * roTr);
    const problem: Problem = {
      ...base('u6-impedance', 'U6', 'Look into a terminal: the three impedance rules'),
      statement: 'An NMOS carries ID with overdrive Vov and has RD from its drain to VDD; its gate is fixed. Find gm, rO and the resistance looking into the source.',
      figure: { kind: 'impedance', props: { terminal: 'source', rd, r } },
      givens: [
        { sym: 'I_D', value: id, unit: 'A' },
        { sym: 'V_{ov}', value: vov, unit: 'V' },
        { sym: '\\lambda', value: lambda, unit: '' },
        { sym: 'R_D', value: rd, unit: 'Ω' },
      ],
      unknowns: [
        { key: 'gm', sym: 'g_m', label: 'Transconductance', unit: 'S' },
        { key: 'ro', sym: 'r_O', label: 'Output resistance of the device', unit: 'Ω' },
        { key: 'r', sym: 'R_{\\text{source}}', label: 'Resistance into the source', unit: 'Ω' },
      ],
      answers: { gm, ro, r },
      wrong: { r: [{ mistake: 'wrongTerminalRule', value: ro }, { mistake: 'wrongTerminalRule', value: rd + ro }] },
      steps: [
        { tag: 'C', title: 'gm from the bias', tex: `g_m = \\frac{2I_D}{V_{ov}} = ${texSI(gmTr, 'S')}`, produces: 'gm', value: gmTr },
        { tag: 'C', title: 'rO from λ', tex: `r_O = \\frac{1}{\\lambda I_D} = ${texSI(roTr, 'Ω')}`, produces: 'ro', value: roTr },
        {
          tag: 'C',
          title: 'Into the source: (RD + rO)/(1 + gm·rO) ≈ 1/gm + RD/(gm·rO). "Down divides"',
          tex: `R = \\frac{${texSI(rd, 'Ω')} + ${texSI(roTr, 'Ω')}}{1 + ${texNum(gmTr * roTr)}} = ${texSI(rTr, 'Ω')}`,
          produces: 'r',
          value: rTr,
          highlight: ['term', 'rd'],
        },
        { tag: '✓', title: 'Sense check: close to 1/gm', tex: `\\frac{1}{g_m} = ${texSI(1 / gmTr, 'Ω')}` },
      ],
      hints: [
        'The source is the "small" terminal.',
        'Rule 3: looking into the source gives about 1/gm; the drain load is divided by gm·rO.',
        'R = (RD + rO)/(1 + gm·rO).',
        `1/gm = ${(1 / gmTr / 1e3).toPrecision(3)} kΩ, so the answer is a little above that.`,
      ],
    };
    return { problem, sane: true };
  },
};

// ─── U6: current mirror ────────────────────────────────────────────────────

export const genMirror: Generator = {
  id: 'u6-mirror',
  unit: 'U6',
  title: 'Current mirror: copy, scale, headroom',
  make(rng) {
    const kp = pick(rng, [100e-6, 200e-6, 400e-6]);
    const vth = pick(rng, [0.4, 0.5]);
    const iref = nice(rng, 10e-6, 100e-6, 10e-6);
    const wlRef = pick(rng, [5, 10, 20]);
    const ratio = pick(rng, [0.5, 2, 3, 4]);
    const wlOut = wlRef * ratio;
    const iout = mirrorCurrent(iref, wlOut, wlRef);
    const vov = vovFromId(iref, kp, wlRef);
    const vgs = vth + vov;
    const ioutTr = iref * (wlOut / wlRef);
    const vovTr = Math.sqrt((2 * iref) / (kp * wlRef));
    const problem: Problem = {
      ...base('u6-mirror', 'U6', 'Current mirror: copy, scale, headroom'),
      statement: 'IREF flows into diode-connected M1; M2 shares its gate. Find the output current, the gate voltage VGS, and the lowest output voltage that keeps M2 saturated (λ = 0).',
      figure: { kind: 'mirror', props: { iref, wlRef, wlOut, iout } },
      givens: [
        { sym: 'I_{REF}', value: iref, unit: 'A' },
        { sym: '(W/L)_1', value: wlRef, unit: '' },
        { sym: '(W/L)_2', value: wlOut, unit: '' },
        { sym: '\\mu_n C_{ox}', value: kp, unit: 'A/V²' },
        { sym: 'V_{th}', value: vth, unit: 'V' },
      ],
      unknowns: [
        { key: 'iout', sym: 'I_{out}', label: 'Output current', unit: 'A' },
        { key: 'vgs', sym: 'V_{GS}', label: 'Gate voltage', unit: 'V' },
        { key: 'vmin', sym: 'V_{out,min}', label: 'Minimum output voltage', unit: 'V' },
      ],
      answers: { iout, vgs, vmin: vov },
      wrong: {
        iout: [{ mistake: 'ratioInverted', value: iref / ratio }],
        vgs: [{ mistake: 'diodeThreshold', value: vov }],
        vmin: [{ mistake: 'vovNotVgs', value: vgs }],
      },
      steps: [
        { tag: 'B', title: 'M1 is a diode: its gate is tied to its drain, so it is always saturated and sets VGS', highlight: ['m1'] },
        { tag: 'A', title: 'VGS from the reference current', tex: `V_{ov} = \\sqrt{\\frac{2I_{REF}}{\\mu_n C_{ox}(W/L)_1}} = ${texSI(vovTr, 'V')},\\quad V_{GS} = ${texNum(vth)} + ${texNum(vovTr)} = ${texSI(vth + vovTr, 'V')}`, produces: 'vgs', value: vth + vovTr, highlight: ['gate'] },
        { tag: 'A', title: 'Same VGS, so the current scales with size', tex: `I_{out} = I_{REF}\\frac{(W/L)_2}{(W/L)_1} = ${texSI(iref, 'A')} \\times ${texNum(ratio)} = ${texSI(ioutTr, 'A')}`, produces: 'iout', value: ioutTr, highlight: ['m2', 'out'] },
        { tag: '✓', title: 'Fence for M2: VD ≥ VG − Vth = Vov', tex: `V_{out} \\ge V_{GS} - V_{th} = ${texSI(vovTr, 'V')}`, produces: 'vmin', value: vovTr },
      ],
      hints: [
        'Both transistors have the same VGS. What does the same VGS mean for current?',
        'Current is proportional to W/L at a fixed VGS (square law).',
        'Iout = IREF·(W/L)2/(W/L)1; VGS = Vth + √(2IREF/(µnCox(W/L)1)); Vout,min = Vov.',
        `The size ratio is ${ratio}.`,
      ],
    };
    return { problem, sane: vov > 0.05 && vov < 0.6 };
  },
};

// ─── U7: CS with every load ────────────────────────────────────────────────

type Load = 'resistor' | 'current' | 'diode' | 'active';
const LOAD_TEXT: Record<Load, string> = {
  resistor: 'a resistor RD',
  current: 'a PMOS current source M2 (gate at a fixed bias)',
  diode: 'a diode-connected PMOS M2',
  active: 'a PMOS M2 whose gate is also driven by Vin (active/CMOS load)',
};

export const genCsLoad: Generator = {
  id: 'u7-cs-load',
  unit: 'U7',
  title: 'CS gain with any load: Av = −Gm·Rout',
  make(rng) {
    const load = pick(rng, ['resistor', 'current', 'diode', 'active'] as const);
    const id = nice(rng, 20e-6, 200e-6, 10e-6);
    const vov1 = nice(rng, 0.15, 0.3, 0.05);
    const vov2 = nice(rng, 0.15, 0.4, 0.05);
    const ln = pick(rng, [0.05, 0.1]);
    const lp = pick(rng, [0.05, 0.1, 0.2]);
    const rd = nice(rng, 5e3, 30e3, 1e3);
    const gm1 = gmFromIdVov(id, vov1);
    const gm2 = gmFromIdVov(id, vov2);
    const ro1 = rO(ln, id);
    const ro2 = rO(lp, id);
    const av =
      load === 'resistor'
        ? csResistive({ gm: gm1, rd, rO: ro1 })
        : load === 'current'
          ? csCurrentSourceLoad({ gm1, rO1: ro1, rO2: ro2 })
          : load === 'diode'
            ? csDiodeLoad({ gm1, gm2, rO1: ro1, rO2: ro2 })
            : csActiveLoad({ gm1, gm2, rO1: ro1, rO2: ro2 });
    const Gm = load === 'active' ? gm1 + gm2 : gm1;
    const rout = -av / Gm;
    // traced
    const g1 = (2 * id) / vov1, g2 = (2 * id) / vov2, r1 = 1 / (ln * id), r2 = 1 / (lp * id);
    const GmTr = load === 'active' ? g1 + g2 : g1;
    const routTr = load === 'resistor' ? par(rd, r1) : load === 'current' || load === 'active' ? par(r1, r2) : 1 / (g2 + 1 / r1 + 1 / r2);
    const avTr = -GmTr * routTr;
    const routTex =
      load === 'resistor'
        ? `R_{out} = R_D \\parallel r_{O1} = ${texSI(rd, 'Ω')} \\parallel ${texSI(r1, 'Ω')}`
        : load === 'diode'
          ? `R_{out} = \\tfrac{1}{g_{m2}} \\parallel r_{O1} \\parallel r_{O2} = ${texSI(1 / g2, 'Ω')} \\parallel ${texSI(r1, 'Ω')} \\parallel ${texSI(r2, 'Ω')}`
          : `R_{out} = r_{O1} \\parallel r_{O2} = ${texSI(r1, 'Ω')} \\parallel ${texSI(r2, 'Ω')}`;
    const figLoad = load === 'current' ? 'current' : load;
    const givens: Problem['givens'] = [
      { sym: 'I_D', value: id, unit: 'A' },
      { sym: 'V_{ov1}', value: vov1, unit: 'V' },
      { sym: '\\lambda_n', value: ln, unit: '' },
    ];
    if (load === 'resistor') givens.push({ sym: 'R_D', value: rd, unit: 'Ω' });
    else givens.push({ sym: '\\lambda_p', value: lp, unit: '' });
    if (load === 'diode' || load === 'active') givens.push({ sym: '|V_{ov2}|', value: vov2, unit: 'V' });
    const wrong: Problem['wrong'] = { av: [] };
    if (load === 'resistor') wrong.av.push({ mistake: 'forgotRo', value: -g1 * rd });
    if (load === 'current' && ln === lp) wrong.av.push({ mistake: 'roNotHalf', value: -g1 * r1 });
    if (load === 'current') wrong.av.push({ mistake: 'forgotRo', value: -g1 * r1 });
    if (load === 'diode') wrong.av.push({ mistake: 'wrongTerminalRule', value: -g1 * par(r1, r2) });
    if (load === 'active') wrong.av.push({ mistake: 'forgotDegeneration', value: -g1 * par(r1, r2) });
    const problem: Problem = {
      ...base('u7-cs-load', 'U7', 'CS gain with any load: Av = −Gm·Rout'),
      statement: `An NMOS common-source stage M1 is loaded by ${LOAD_TEXT[load]}. Both devices carry ID. Find Gm, Rout and the small-signal gain Av.`,
      figure: { kind: 'csLoad', props: { load: figLoad, id, rd: load === 'resistor' ? rd : undefined } },
      givens,
      unknowns: [
        { key: 'Gm', sym: 'G_m', label: 'Transconductance of the stage', unit: 'S' },
        { key: 'rout', sym: 'R_{out}', label: 'Output resistance', unit: 'Ω' },
        { key: 'av', sym: 'A_v', label: 'Gain', unit: 'V/V' },
      ],
      answers: { Gm, rout, av },
      wrong,
      steps: [
        { tag: 'B', title: `Roles: M1 gate→drain = common source${load === 'diode' ? '; M2 gate tied to drain = diode (1/gm)' : load === 'resistor' ? '' : load === 'active' ? '; M2 gate→drain too, so it is ALSO a CS stage' : '; M2 gate fixed = current source (rO)'}`, highlight: ['m1', 'm2'] },
        {
          tag: 'C',
          title: load === 'active' ? 'Both transistors turn the input into current: Gm = gm1 + gm2' : 'Gm: the input device alone, gm1 = 2ID/Vov1',
          tex: load === 'active' ? `G_m = \\frac{2I_D}{V_{ov1}} + \\frac{2I_D}{|V_{ov2}|} = ${texSI(GmTr, 'S')}` : `G_m = g_{m1} = \\frac{2(${texSI(id, 'A')})}{${texNum(vov1)}} = ${texSI(GmTr, 'S')}`,
          produces: 'Gm',
          value: GmTr,
          highlight: ['m1'],
        },
        { tag: 'C', title: 'Rout: everything touching the output node, in parallel (smallest wins)', tex: `${routTex} = ${texSI(routTr, 'Ω')}`, produces: 'rout', value: routTr, highlight: ['out'] },
        { tag: 'D', title: 'Av = −Gm·Rout (inverting: gate in, drain out)', tex: `A_v = -${texSI(GmTr, 'S')} \\times ${texSI(routTr, 'Ω')} = ${texNum(avTr)}`, produces: 'av', value: avTr },
      ],
      hints: [
        'Two questions: how much current does the input make (Gm), and what resistance does it flow into (Rout)?',
        'Master method Steps B–D: give every device a role, replace loads by resistances, then Av = −Gm·Rout.',
        `rO = 1/(λID); a diode load looks like 1/gm; a current-source load looks like rO.`,
        `gm1 = ${(g1 * 1e3).toPrecision(3)} mA/V.`,
      ],
    };
    return { problem, sane: Math.abs(avTr - av) <= Math.abs(av) * 1e-9 && Math.abs(rout - routTr) <= rout * 1e-9 };
  },
};

// ─── U7: degeneration and the ratio rule ───────────────────────────────────

export const genDegenerated: Generator = {
  id: 'u7-degen',
  unit: 'U7',
  title: 'Degenerated CS: the ratio rule',
  make(rng) {
    const id = nice(rng, 50e-6, 500e-6, 50e-6);
    const vov = nice(rng, 0.15, 0.4, 0.05);
    const rd = nice(rng, 5e3, 30e3, 1e3);
    const rs = nice(rng, 0.5e3, 5e3, 0.5e3);
    const gm = gmFromIdVov(id, vov);
    const Gm = gmDegenerated(gm, rs);
    const av = csDegenerated({ gm, rd, rs });
    const gmTr = (2 * id) / vov;
    const GmTr = 1 / (1 / gmTr + rs);
    const avTr = -rd / (1 / gmTr + rs);
    const problem: Problem = {
      ...base('u7-degen', 'U7', 'Degenerated CS: the ratio rule'),
      statement: 'A CS stage has RD on the drain and RS under the source (λ = 0). Find gm, the degenerated Gm and the gain.',
      figure: { kind: 'csLoad', props: { load: 'degenerated', rd, rs, id } },
      givens: [
        { sym: 'I_D', value: id, unit: 'A' },
        { sym: 'V_{ov}', value: vov, unit: 'V' },
        { sym: 'R_D', value: rd, unit: 'Ω' },
        { sym: 'R_S', value: rs, unit: 'Ω' },
      ],
      unknowns: [
        { key: 'gm', sym: 'g_m', label: 'Transconductance of M1', unit: 'S' },
        { key: 'Gm', sym: 'G_m', label: 'Degenerated Gm', unit: 'S' },
        { key: 'av', sym: 'A_v', label: 'Gain', unit: 'V/V' },
      ],
      answers: { gm, Gm, av },
      wrong: { av: [{ mistake: 'forgotDegeneration', value: -gm * rd }], Gm: [{ mistake: 'forgotDegeneration', value: gm }] },
      steps: [
        { tag: 'C', title: 'gm of M1', tex: `g_m = \\frac{2I_D}{V_{ov}} = ${texSI(gmTr, 'S')}\\quad\\Rightarrow\\quad \\frac{1}{g_m} = ${texSI(1 / gmTr, 'Ω')}`, produces: 'gm', value: gmTr, highlight: ['m1'] },
        { tag: 'C', title: 'Source path: the transistor counts as 1/gm, in series with RS', tex: `G_m = \\frac{1}{1/g_m + R_S} = \\frac{1}{${texSI(1 / gmTr, 'Ω')} + ${texSI(rs, 'Ω')}} = ${texSI(GmTr, 'S')}`, produces: 'Gm', value: GmTr, highlight: ['rs'] },
        { tag: 'D', title: 'Ratio rule: |Av| = (resistance at the drain) ÷ (resistance in the source path)', tex: `A_v = -\\frac{R_D}{1/g_m + R_S} = -\\frac{${texSI(rd, 'Ω')}}{${texSI(1 / gmTr + rs, 'Ω')}} = ${texNum(avTr)}`, produces: 'av', value: avTr, highlight: ['rd', 'rs'] },
      ],
      hints: [
        'RS fights back: as current rises, the source rises, and VGS shrinks.',
        'Use the ratio rule: the transistor itself counts as 1/gm in the source path.',
        '|Av| = RD/(1/gm + RS), negative sign (gate in, drain out).',
        `1/gm = ${(1 / gmTr / 1e3).toPrecision(3)} kΩ.`,
      ],
    };
    return { problem, sane: true };
  },
};

// ─── U8: source follower ───────────────────────────────────────────────────

export const genFollower: Generator = {
  id: 'u8-follower',
  unit: 'U8',
  title: 'Source follower: level shift, gain ≈ 1, Rout ≈ 1/gm',
  make(rng) {
    const kp = pick(rng, [100e-6, 200e-6]);
    const vth = pick(rng, [0.4, 0.5]);
    const wl = pick(rng, [10, 20, 40]);
    const i = nice(rng, 20e-6, 200e-6, 10e-6);
    const lambda = pick(rng, [0.05, 0.1]);
    const vdd = 1.8;
    const vin = nice(rng, 1.0, 1.6, 0.05);
    const vov = vovFromId(i, kp, wl);
    const vout = vin - vth - vov;
    const gm = gmFromIdVov(i, vov);
    const ro = rO(lambda, i);
    const av = followerGain({ gm, rs: Infinity, rO: ro });
    const rout = followerRout({ gm, rO: ro });
    const vovTr = Math.sqrt((2 * i) / (kp * wl));
    const voutTr = vin - (vth + vovTr);
    const gmTr = (2 * i) / vovTr;
    const roTr = 1 / (lambda * i);
    const avTr = roTr / (1 / gmTr + roTr);
    const routTr = 1 / (gmTr + 1 / roTr);
    const problem: Problem = {
      ...base('u8-follower', 'U8', 'Source follower: level shift, gain ≈ 1, Rout ≈ 1/gm'),
      statement: 'An NMOS source follower (drain at VDD) is biased by an ideal current source I from its source to ground. Find the DC output, the gain and the output resistance.',
      figure: { kind: 'follower', props: { vin, i } },
      givens: [
        { sym: 'V_{in}', value: vin, unit: 'V' },
        { sym: 'I', value: i, unit: 'A' },
        { sym: '\\mu_n C_{ox}', value: kp, unit: 'A/V²' },
        { sym: 'W/L', value: wl, unit: '' },
        { sym: 'V_{th}', value: vth, unit: 'V' },
        { sym: '\\lambda', value: lambda, unit: '' },
      ],
      unknowns: [
        { key: 'vout', sym: 'V_{out}', label: 'DC output', unit: 'V' },
        { key: 'av', sym: 'A_v', label: 'Gain', unit: 'V/V' },
        { key: 'rout', sym: 'R_{out}', label: 'Output resistance', unit: 'Ω' },
      ],
      answers: { vout, av, rout },
      wrong: { vout: [{ mistake: 'vovNotVgs', value: vin - vov }], rout: [{ mistake: 'wrongTerminalRule', value: ro }] },
      steps: [
        { tag: 'A', title: 'Overdrive from the bias current', tex: `V_{ov} = \\sqrt{\\frac{2I}{\\mu_n C_{ox} W/L}} = ${texSI(vovTr, 'V')}` },
        { tag: 'A', title: 'The output sits one full VGS below the input', tex: `V_{out} = V_{in} - (V_{th} + V_{ov}) = ${texNum(vin)} - ${texNum(vth + vovTr)} = ${texSI(voutTr, 'V')}`, produces: 'vout', value: voutTr, highlight: ['out'] },
        { tag: 'B', title: 'Role: gate→source = follower', highlight: ['m1'] },
        { tag: 'C', title: 'Load at the source: the ideal source is ∞, so only rO remains', tex: `g_m = \\frac{2I}{V_{ov}} = ${texSI(gmTr, 'S')},\\; r_O = ${texSI(roTr, 'Ω')}` },
        { tag: 'D', title: 'Ratio rule: |Av| = R at source ÷ (1/gm + R at source)', tex: `A_v = \\frac{r_O}{1/g_m + r_O} = ${texNum(avTr, 4)}`, produces: 'av', value: avTr },
        { tag: 'C', title: 'Rout: looking into the source = 1/gm ‖ rO', tex: `R_{out} = \\tfrac{1}{g_m} \\parallel r_O = ${texSI(routTr, 'Ω')}`, produces: 'rout', value: routTr, highlight: ['out'] },
      ],
      hints: [
        'The source "follows" the gate, one VGS lower.',
        'DC: Vout = Vin − VGS. Small signal: ratio rule with 1/gm in the source path.',
        'Av = rO/(1/gm + rO); Rout = 1/gm ‖ rO.',
        `VGS = ${(vth + vovTr).toFixed(3)} V.`,
      ],
    };
    return { problem, sane: voutTr > 0.15 && vdd - voutTr >= vovTr };
  },
};

// ─── U8: common gate ───────────────────────────────────────────────────────

export const genCommonGate: Generator = {
  id: 'u8-cg',
  unit: 'U8',
  title: 'Common gate: gain gm·RD, input resistance 1/gm',
  make(rng) {
    const kp = pick(rng, [100e-6, 200e-6]);
    const vth = pick(rng, [0.4, 0.5]);
    const wl = pick(rng, [10, 20, 40]);
    const i = nice(rng, 50e-6, 300e-6, 10e-6);
    const vdd = 1.8;
    const vb = nice(rng, 0.9, 1.3, 0.05);
    const rd = nice(rng, 2e3, 8e3, 0.5e3);
    const vov = vovFromId(i, kp, wl);
    const vs = vb - vth - vov;
    const vd = vdd - i * rd;
    const gm = gmFromIdVov(i, vov);
    const av = cgGain({ gm, rd });
    const rin = cgRin({ gm, rd });
    const vovTr = Math.sqrt((2 * i) / (kp * wl));
    const gmTr = (2 * i) / vovTr;
    const problem: Problem = {
      ...base('u8-cg', 'U8', 'Common gate: gain gm·RD, input resistance 1/gm'),
      statement: 'A common-gate stage: gate at Vb, the signal enters the source (biased by a current source I), RD from drain to VDD (λ = 0). Find the source and drain voltages, the gain and the input resistance.',
      figure: { kind: 'commonGate', props: { vb, i, rd } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_b', value: vb, unit: 'V' },
        { sym: 'I', value: i, unit: 'A' },
        { sym: '\\mu_n C_{ox}', value: kp, unit: 'A/V²' },
        { sym: 'W/L', value: wl, unit: '' },
        { sym: 'V_{th}', value: vth, unit: 'V' },
        { sym: 'R_D', value: rd, unit: 'Ω' },
      ],
      unknowns: [
        { key: 'vs', sym: 'V_S', label: 'Source (input) DC voltage', unit: 'V' },
        { key: 'vd', sym: 'V_D', label: 'Drain (output) DC voltage', unit: 'V' },
        { key: 'av', sym: 'A_v', label: 'Gain', unit: 'V/V' },
        { key: 'rin', sym: 'R_{in}', label: 'Input resistance', unit: 'Ω' },
      ],
      answers: { vs, vd, av, rin },
      wrong: { av: [{ mistake: 'signFlip', value: -av }], rin: [{ mistake: 'wrongTerminalRule', value: rd }], vs: [{ mistake: 'vovNotVgs', value: vb - vov }] },
      steps: [
        { tag: 'A', title: 'Source one VGS below the gate', tex: `V_S = V_b - V_{th} - \\sqrt{\\tfrac{2I}{\\mu_n C_{ox} W/L}} = ${texSI(vb - vth - vovTr, 'V')}`, produces: 'vs', value: vb - vth - vovTr, highlight: ['in'] },
        { tag: 'A', title: 'Walk the drain node', tex: `V_D = V_{DD} - I R_D = ${texSI(vdd - i * rd, 'V')}`, produces: 'vd', value: vdd - i * rd, highlight: ['out'] },
        { tag: '✓', title: 'Fence: VD ≥ Vb − Vth', tex: `${texSI(vd, 'V')} \\ge ${texSI(vb - vth, 'V')}\\;\\checkmark` },
        { tag: 'B', title: 'Role: source→drain = common gate', highlight: ['m1'] },
        { tag: 'D', title: 'Gain: non-inverting, gm·RD', tex: `A_v = +g_m R_D = ${texSI(gmTr, 'S')} \\times ${texSI(rd, 'Ω')} = ${texNum(gmTr * rd)}`, produces: 'av', value: gmTr * rd },
        { tag: 'C', title: 'Rin: looking into the source (λ = 0) = 1/gm', tex: `R_{in} = \\frac{1}{g_m} = ${texSI(1 / gmTr, 'Ω')}`, produces: 'rin', value: 1 / gmTr, highlight: ['in'] },
      ],
      hints: [
        'Same transistor, same gm, but the signal enters the source.',
        'DC first (VS = Vb − VGS, VD = VDD − I·RD), then the gain.',
        'Av = +gm·RD; Rin = 1/gm (looking into the source).',
        `gm = ${(gmTr * 1e3).toPrecision(3)} mA/V.`,
      ],
    };
    return { problem, sane: vs > 0.2 && vd >= vb - vth + 0.02 && Math.abs(rin - 1 / gmTr) < 1e-6 * rin };
  },
};

// ─── U9: cascode and the load trap ─────────────────────────────────────────

export const genCascode: Generator = {
  id: 'u9-cascode',
  unit: 'U9',
  title: 'Cascode: Rout ≈ gm·rO², and the load trap',
  make(rng) {
    const id = nice(rng, 20e-6, 200e-6, 10e-6);
    const vov = nice(rng, 0.15, 0.3, 0.05);
    const lambda = pick(rng, [0.05, 0.1, 0.2]);
    const gm = gmFromIdVov(id, vov);
    const ro = rO(lambda, id);
    const rCas = cascodeRoutApprox(gm, ro, ro);
    const avSimple = cascodeGain({ gm1: gm, rCascode: rCas, rLoad: ro });
    const avCas = cascodeGain({ gm1: gm, rCascode: rCas, rLoad: rCas });
    const gmTr = (2 * id) / vov;
    const roTr = 1 / (lambda * id);
    const rCasTr = gmTr * roTr * roTr;
    const problem: Problem = {
      ...base('u9-cascode', 'U9', 'Cascode: Rout ≈ gm·rO², and the load trap'),
      statement: 'An NMOS cascode (M1 input, M2 cascode) and every PMOS carry the same ID and have the same gm and rO (equal λ, equal Vov). Using the notes’ approximation R ≈ gm·rO·R, find the resistance looking down, then the gain with (a) a simple PMOS current-source load and (b) a PMOS cascode load.',
      figure: { kind: 'cascode', props: { load: 'cascode', proc: { ...SET_B, lambdan: lambda, lambdap: lambda }, id, wl: wlFromId(id, SET_B.kpn, vov), vb1: 0.4 + vov + 0.4 + vov + 0.05, vout: (0.4 + 2 * vov + 0.05 + 1.8 - 2 * vov) / 2 } },
      givens: [
        { sym: 'I_D', value: id, unit: 'A' },
        { sym: 'V_{ov}', value: vov, unit: 'V' },
        { sym: '\\lambda', value: lambda, unit: '' },
      ],
      unknowns: [
        { key: 'rdown', sym: 'R_{down}', label: 'Resistance looking down into M2', unit: 'Ω' },
        { key: 'avs', sym: 'A_{v,(a)}', label: 'Gain with a simple current-source load', unit: 'V/V' },
        { key: 'avc', sym: 'A_{v,(b)}', label: 'Gain with a cascode load', unit: 'V/V' },
      ],
      answers: { rdown: rCas, avs: avSimple, avc: avCas },
      wrong: { avs: [{ mistake: 'cascodeSimpleLoad', value: -gm * rCas }], rdown: [{ mistake: 'wrongTerminalRule', value: 2 * ro }] },
      steps: [
        { tag: 'C', title: 'gm and rO of every device', tex: `g_m = \\frac{2I_D}{V_{ov}} = ${texSI(gmTr, 'S')},\\; r_O = \\frac{1}{\\lambda I_D} = ${texSI(roTr, 'Ω')},\\; g_m r_O = ${texNum(gmTr * roTr)}` },
        { tag: 'C', title: 'Looking down: M1’s rO sits under M2’s source. "Up multiplies"', tex: `R_{down} \\approx g_m r_O \\cdot r_O = ${texSI(rCasTr, 'Ω')}`, produces: 'rdown', value: rCasTr, highlight: ['m1', 'm2'] },
        { tag: 'D', title: '(a) Simple load rO in parallel: the smallest wins (the load trap)', tex: `A_v = -g_m (R_{down} \\parallel r_O) = ${texNum(-gmTr * par(rCasTr, roTr))}`, produces: 'avs', value: -gmTr * par(rCasTr, roTr) },
        { tag: 'D', title: '(b) Cascode the load too: two equal gm·rO² in parallel give half', tex: `A_v = -g_m \\frac{g_m r_O^2}{2} = ${texNum((-gmTr * rCasTr) / 2)}`, produces: 'avc', value: (-gmTr * rCasTr) / 2 },
        { tag: '✓', title: 'Compare: (a) is barely above a plain CS (−gm·rO/2); (b) is about gm·rO times bigger', tex: `-\\tfrac{g_m r_O}{2} = ${texNum((-gmTr * roTr) / 2)}` },
      ],
      hints: [
        'The output node sees two resistances: looking down and looking up. Smallest wins.',
        'Looking down into a cascode: gm·rO·rO. A simple PMOS load is only rO.',
        'Av = −gm1·(Rdown ‖ Rup).',
        `gm·rO = ${(gmTr * roTr).toPrecision(3)}.`,
      ],
    };
    return { problem, sane: true };
  },
};

// ─── U9: telescopic output swing (headroom stacking) ───────────────────────

export const genTelescopicSwing: Generator = {
  id: 'u9-telescopic',
  unit: 'U9',
  title: 'Telescopic cascode: stack the overdrives, find the swing',
  make(rng) {
    const vdd = pick(rng, [1.8, 3]);
    const viss = nice(rng, 0.2, 0.5, 0.05);
    const vovN = nice(rng, 0.1, 0.3, 0.05);
    const vovP = nice(rng, 0.15, 0.35, 0.05);
    const voutMin = viss + 2 * vovN;
    const voutMax = vdd - 2 * vovP;
    const diff = 2 * (voutMax - voutMin);
    const minTr = viss + vovN + vovN;
    const maxTr = vdd - vovP - vovP;
    const problem: Problem = {
      ...base('u9-telescopic', 'U9', 'Telescopic cascode: stack the overdrives, find the swing'),
      statement: 'A fully differential telescopic cascode (tail M9, input M1,2, NMOS cascodes M3,4, PMOS cascodes M5,6, PMOS sources M7,8) is biased so every device sits exactly at the edge of saturation. Find the lowest and highest output and the differential peak-to-peak swing.',
      figure: { kind: 'telescopic', props: { proc: { ...SET_B, vdd, vthn: 0.4, vthp: 0.4 }, iss: 200e-6, wlN: wlFromId(100e-6, SET_B.kpn, vovN), wlP: wlFromId(100e-6, SET_B.kpp, vovP), wl9: wlFromId(200e-6, SET_B.kpn, viss), vinCm: viss + 0.4 + vovN, vb1: viss + vovN + 0.4 + vovN + vovN, vb2: vdd - vovP - 0.4 - vovP, vout: (voutMin + voutMax) / 2 } },
      givens: [
        { sym: 'V_{DD}', value: vdd, unit: 'V' },
        { sym: 'V_{ISS}', value: viss, unit: 'V' },
        { sym: 'V_{ov,N}', value: vovN, unit: 'V' },
        { sym: '|V_{ov,P}|', value: vovP, unit: 'V' },
      ],
      unknowns: [
        { key: 'min', sym: 'V_{out,min}', label: 'Lowest output', unit: 'V' },
        { key: 'max', sym: 'V_{out,max}', label: 'Highest output', unit: 'V' },
        { key: 'diff', sym: 'V_{pp,diff}', label: 'Differential swing (peak-to-peak)', unit: 'V' },
      ],
      answers: { min: voutMin, max: voutMax, diff },
      wrong: { diff: [{ mistake: 'signFlip', value: voutMax - voutMin }], min: [{ mistake: 'vovNotVgs', value: viss + 2 * (vovN + 0.4) }] },
      steps: [
        { tag: 'A', title: 'Floor: climb up from ground, paying |Vov| per stacked device', tex: `V_{out,min} = V_{ISS} + V_{ov1} + V_{ov3} = ${texNum(viss)} + ${texNum(vovN)} + ${texNum(vovN)} = ${texSI(minTr, 'V')}`, produces: 'min', value: minTr, highlight: ['m9', 'm1', 'm3'] },
        { tag: 'A', title: 'Ceiling: come down from VDD, paying |Vov| per PMOS', tex: `V_{out,max} = V_{DD} - |V_{ov7}| - |V_{ov5}| = ${texSI(maxTr, 'V')}`, produces: 'max', value: maxTr, highlight: ['m7', 'm5'] },
        { tag: '·', title: 'Each output swings between floor and ceiling; the two outputs move in opposite directions, so the difference doubles', tex: `V_{pp,diff} = 2(V_{out,max} - V_{out,min}) = ${texSI(2 * (maxTr - minTr), 'V')}`, produces: 'diff', value: 2 * (maxTr - minTr) },
      ],
      hints: [
        'Think of a room with a floor and a ceiling: every stacked transistor needs its breathing room.',
        'Each device in the stack costs its |Vov|; the tail costs VISS.',
        'Vout,min = VISS + Vov1 + Vov3; Vout,max = VDD − |Vov5| − |Vov7|; differential = 2 × (max − min).',
        `The floor is ${minTr.toFixed(2)} V.`,
      ],
    };
    return { problem, sane: voutMax - voutMin > 0.2 };
  },
};

export const SINGLE_STAGE_GENERATORS: Generator[] = [genImpedance, genMirror, genCsLoad, genDegenerated, genFollower, genCommonGate, genCascode, genTelescopicSwing];
