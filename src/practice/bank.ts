/**
 * Fixed problem bank for Milestone 1: the Part 1 worked examples from the conversation.
 * Answers come only from src/physics/solvers; steps restate the working in master-method form.
 */
import { part1WE1, part1WE2, part1WE3 } from '../physics';
import type { Problem } from './schema';
import { texNum, texSI } from './tex';

function we1(): Problem {
  const r = part1WE1();
  return {
    id: 'bank-we1',
    source: 'Worked Example 1 (tutoring conversation, Part 1)',
    tags: ['U3', 'U4', 'U5'],
    title: 'WE1: analyse a common-source stage',
    statement: 'VDD = 1.8 V, VG = 0.7 V, Vth = 0.4 V, µnCox = 200 µA/V², W/L = 10, RD = 10 kΩ, λ = 0.1 V⁻¹ (λ = 0 for the DC bias). Find Vov, ID, VD, gm, rO and the gain Av.',
    figure: { kind: 'nmosRd', props: { vdd: 1.8, vg: 0.7, rd: 10e3, showVin: true } },
    givens: [
      { sym: 'V_{DD}', value: 1.8, unit: 'V' },
      { sym: 'V_G', value: 0.7, unit: 'V' },
      { sym: 'V_{th}', value: 0.4, unit: 'V' },
      { sym: '\\mu_n C_{ox}', value: 200e-6, unit: 'A/V²' },
      { sym: 'W/L', value: 10, unit: '' },
      { sym: 'R_D', value: 10e3, unit: 'Ω' },
      { sym: '\\lambda', value: 0.1, unit: '' },
    ],
    unknowns: [
      { key: 'id', sym: 'I_D', label: 'Drain current', unit: 'A' },
      { key: 'vd', sym: 'V_D', label: 'Drain voltage', unit: 'V' },
      { key: 'gm', sym: 'g_m', label: 'Transconductance', unit: 'S' },
      { key: 'ro', sym: 'r_O', label: 'Output resistance', unit: 'Ω' },
      { key: 'av', sym: 'A_v', label: 'Gain (with rO)', unit: 'V/V' },
    ],
    answers: { id: r.id, vd: r.vd, gm: r.gm, ro: r.rO, av: r.av },
    wrong: {
      id: [{ mistake: 'forgotHalf', value: 2 * r.id }],
      av: [{ mistake: 'forgotRo', value: r.avNoRo }],
    },
    steps: [
      { tag: 'A', title: 'Overdrive', tex: `V_{ov} = 0.7 - 0.4 = ${texSI(r.vov, 'V')}` },
      { tag: 'A', title: 'Square law', tex: `I_D = \\tfrac12(200\\mu)(10)(0.3)^2 = ${texSI(r.id, 'A')}`, produces: 'id', value: r.id },
      { tag: 'A', title: 'Walk the node', tex: `V_D = 1.8 - (90\\mu)(10\\mathrm{k}) = ${texSI(r.vd, 'V')}`, produces: 'vd', value: r.vd },
      { tag: '✓', title: 'Fence', tex: `0.9 \\ge 0.7 - 0.4 = 0.3\\;\\checkmark` },
      { tag: 'B', title: 'Gate in, drain out: common source', tex: `g_m = \\frac{2I_D}{V_{ov}} = ${texSI(r.gm, 'S')}`, produces: 'gm', value: r.gm },
      { tag: 'C', title: 'Output node: RD ‖ rO', tex: `r_O = \\frac{1}{(0.1)(90\\mu)} = ${texSI(r.rO, 'Ω')}`, produces: 'ro', value: r.rO },
      { tag: 'D', title: 'Av = −Gm·Rout', tex: `A_v = -0.6\\mathrm{m}\\times(10\\mathrm{k}\\parallel 111\\mathrm{k}) = ${texNum(r.av)}\\quad(${texNum(r.avNoRo)}\\text{ without } r_O)`, produces: 'av', value: r.av },
    ],
    hints: [
      'Bias first, gain second.',
      'Step A: Vov → ID → VD → fence. Then B, C, D.',
      'ID = ½µCox(W/L)Vov²; gm = 2ID/Vov; rO = 1/(λID); Av = −gm(RD ‖ rO).',
      'Vov = 0.3 V.',
    ],
  };
}

function we2(): Problem {
  const r = part1WE2();
  return {
    id: 'bank-we2',
    source: 'Worked Example 2 (tutoring conversation, Part 1)',
    tags: ['U3'],
    title: 'WE2: design a biased NMOS',
    statement: 'Design an NMOS stage on VDD = 1.8 V to carry ID = 100 µA at Vov = 0.15 V with the drain at 0.9 V. Vth = 0.35 V, µnCox = 400 µA/V². Find W/L, VG and RD.',
    flags: ['The original wording of this example was lost in the chat export; these givens reproduce its verified answers.'],
    figure: { kind: 'nmosRd', props: { vdd: 1.8, labelOnly: true } },
    givens: [
      { sym: 'V_{DD}', value: 1.8, unit: 'V' },
      { sym: 'I_D', value: 100e-6, unit: 'A' },
      { sym: 'V_{ov}', value: 0.15, unit: 'V' },
      { sym: 'V_{th}', value: 0.35, unit: 'V' },
      { sym: '\\mu_n C_{ox}', value: 400e-6, unit: 'A/V²' },
    ],
    unknowns: [
      { key: 'wl', sym: 'W/L', label: 'Aspect ratio', unit: '' },
      { key: 'vg', sym: 'V_G', label: 'Gate voltage', unit: 'V' },
      { key: 'rd', sym: 'R_D', label: 'Drain resistor', unit: 'Ω' },
    ],
    answers: { wl: r.wl, vg: r.vg, rd: r.rd },
    wrong: { wl: [{ mistake: 'forgotHalf', value: r.wl / 2 }] },
    steps: [
      { tag: 'A', title: 'Bridge equation backwards', tex: `\\tfrac{W}{L} = \\frac{2(100\\mu)}{(400\\mu)(0.15)^2} = ${texNum(r.wl)}`, produces: 'wl', value: r.wl },
      { tag: 'A', title: 'Gate = Vth + Vov', tex: `V_G = 0.35 + 0.15 = ${texSI(r.vg, 'V')}`, produces: 'vg', value: r.vg },
      { tag: 'A', title: 'RD drops VDD − VD', tex: `R_D = \\frac{1.8 - 0.9}{100\\mu} = ${texSI(r.rd, 'Ω')}`, produces: 'rd', value: r.rd },
    ],
    hints: ['Design direction.', 'Run the square law backwards.', 'W/L = 2ID/(µCox Vov²).', 'W/L ≈ 22.'],
  };
}

function we3(): Problem {
  const r = part1WE3();
  return {
    id: 'bank-we3',
    source: 'Worked Example 3 (tutoring conversation, Part 1)',
    tags: ['U3'],
    title: 'WE3: a PMOS with magnitudes',
    statement: 'A PMOS has its source at 1.8 V, gate at 0.9 V, |Vth| = 0.5 V, µpCox = 100 µA/V², W/L = 20, and RD = 5 kΩ from drain to ground. Find |Vov|, ID and VD.',
    figure: { kind: 'pmosRd', props: { vdd: 1.8, vg: 0.9, rd: 5e3 } },
    givens: [
      { sym: 'V_S', value: 1.8, unit: 'V' },
      { sym: 'V_G', value: 0.9, unit: 'V' },
      { sym: '|V_{th}|', value: 0.5, unit: 'V' },
      { sym: '\\mu_p C_{ox}', value: 100e-6, unit: 'A/V²' },
      { sym: 'W/L', value: 20, unit: '' },
      { sym: 'R_D', value: 5e3, unit: 'Ω' },
    ],
    unknowns: [
      { key: 'vov', sym: '|V_{ov}|', label: 'Overdrive magnitude', unit: 'V' },
      { key: 'id', sym: 'I_D', label: 'Drain current', unit: 'A' },
      { key: 'vd', sym: 'V_D', label: 'Drain voltage', unit: 'V' },
    ],
    answers: { vov: r.vov, id: r.id, vd: r.vd },
    wrong: { vov: [{ mistake: 'pmosSign', value: 0.4 + 0.5 }] },
    steps: [
      { tag: 'A', title: 'Magnitudes', tex: `|V_{ov}| = (1.8 - 0.9) - 0.5 = ${texSI(r.vov, 'V')}`, produces: 'vov', value: r.vov },
      { tag: 'A', title: 'Square law', tex: `I_D = \\tfrac12(100\\mu)(20)(0.4)^2 = ${texSI(r.id, 'A')}`, produces: 'id', value: r.id },
      { tag: 'A', title: 'Up from ground', tex: `V_D = (160\\mu)(5\\mathrm{k}) = ${texSI(r.vd, 'V')}`, produces: 'vd', value: r.vd },
      { tag: '✓', title: 'PMOS fence', tex: `0.8 \\le 0.9 + 0.5\\;\\checkmark` },
    ],
    hints: ['Use magnitudes.', '|VGS| = VS − VG.', '|Vov| = |VGS| − |Vth|, then the square law.', '|VGS| = 0.9 V.'],
  };
}

export const FIXED_BANK: Problem[] = [we1(), we2(), we3()];
