/**
 * Generators for the handout lectures: L1 gain error (Ex 9.1 style), L3 telescopic design from specs
 * (Ex 9.7 style), L4 folded-cascode design from specs (Tut 2 Q3 / PS1 P6 style).
 */
import { boostedRout, closedLoopCmChoice, closedLoopGain, foldedCascodePmosInput, gainError, gmFromIdVov, minOpenLoopGain, rO, slewTime, telescopic, triodeSenseWl, wlFromId, type Process } from '../../physics';

const par = (a: number, b: number) => (a * b) / (a + b);
import { nice, pick, type Rng } from '../rng';
import type { Generator, GeneratorOutput, Problem } from '../schema';
import { texNum, texSI } from '../tex';

function base(id: string, unit: string, title: string): Pick<Problem, 'id' | 'generator' | 'source' | 'tags' | 'title'> {
  return { id, generator: id, source: 'generated', tags: [unit], title };
}

export const genGainError: Generator = {
  id: 'l1-gain',
  unit: 'L1',
  title: 'Feedback: closed-loop gain, gain error, required open-loop gain',
  make(rng: Rng): GeneratorOutput {
    const acl = pick(rng, [2, 4, 5, 8, 10, 20]);
    const a = pick(rng, [100, 200, 500, 1000, 2000, 5000]);
    const epsTarget = pick(rng, [0.01, 0.005, 0.001]);
    const beta = 1 / acl;
    const acTrue = closedLoopGain(a, beta);
    const eps = gainError(a, beta);
    const amin = minOpenLoopGain(acl, epsTarget);
    const problem: Problem = {
      ...base('l1-gain', 'L1', 'Feedback: closed-loop gain, gain error, required open-loop gain'),
      statement: `A non-inverting amplifier is designed for a closed-loop gain of ${acl} (β = 1/${acl}) with an op amp of open-loop gain A = ${a}. Find the actual closed-loop gain, the gain error, and the open-loop gain needed for an error of ${epsTarget * 100}%.`,
      figure: { kind: 'nonInverting', props: { r1: (acl - 1) * 1e3, r2: 1e3, a } },
      givens: [
        { sym: '1/\\beta', value: acl, unit: '' },
        { sym: 'A', value: a, unit: '' },
        { sym: '\\varepsilon_{target}', value: epsTarget, unit: '' },
      ],
      unknowns: [
        { key: 'ac', sym: 'A_{closed}', label: 'Actual closed-loop gain', unit: '', tol: 0.001 },
        { key: 'eps', sym: '\\varepsilon', label: 'Gain error (fraction)', unit: '' },
        { key: 'amin', sym: 'A_{min}', label: 'Open-loop gain for the target error', unit: '', tol: 0.012 },
      ],
      answers: { ac: acTrue, eps, amin },
      wrong: { ac: [{ mistake: 'aInsteadOfInvBeta', value: a }], eps: [{ mistake: 'betaVsBetaA', value: beta }], amin: [{ mistake: 'aInsteadOfInvBeta', value: 1 / epsTarget }] },
      steps: [
        { tag: '·', title: 'Loop gain βA', tex: `\\beta A = \\frac{${a}}{${acl}} = ${texNum(a / acl)}` },
        { tag: '·', title: 'Aclosed = A/(1 + βA): a little under 1/β', tex: `A_{closed} = \\frac{${a}}{1 + ${texNum(a / acl)}} = ${texNum(a / (1 + a / acl), 5)}`, produces: 'ac', value: a / (1 + a / acl) },
        { tag: '·', title: 'Gain error is one over (1 + loop gain)', tex: `\\varepsilon = \\frac{1}{1 + \\beta A} = ${texNum(1 / (1 + a / acl), 4)}`, produces: 'eps', value: 1 / (1 + a / acl) },
        { tag: '·', title: 'Design form: A ≥ Aclosed/ε', tex: `A_{min} = \\frac{${acl}}{${epsTarget}} = ${texNum(acl / epsTarget)}`, produces: 'amin', value: acl / epsTarget },
      ],
      hints: ['β is what comes back; 1/β is what you get.', 'Gain error is one over loop gain.', 'Aclosed = A/(1 + βA); ε = 1/(1 + βA); Amin = Aclosed/ε.', `βA = ${(a / acl).toFixed(1)}.`],
    };
    return { problem, sane: true };
  },
};

export const genCmChoice: Generator = {
  id: 'l2-cmchoice',
  unit: 'L2',
  title: 'Telescopic in closed loop: choose the CM level for the largest swing (Ex 9.6)',
  make(rng: Rng): GeneratorOutput {
    const vth = pick(rng, [0.4, 0.5, 0.7]);
    const vov = pick(rng, [0.15, 0.2, 0.25, 0.3]);
    const vb = nice(rng, vth + 0.8, vth + 1.4, 0.05);
    const r = closedLoopCmChoice({ vb, vgs34: vth + vov, vth34: vth, vth12: vth });
    // Hand route.
    const vcmH = vb - vov;
    const floorH = vb - vth;
    const peakH = vcmH - floorH;
    const problem: Problem = {
      ...base('l2-cmchoice', 'L2', 'Telescopic in closed loop: choose the CM level'),
      statement: `A fully differential telescopic op amp is closed through input capacitors and feedback resistors (Razavi Ex 9.6), so its input and output CM levels are equal. The NMOS cascodes M3, M4 have their gates at Vb = ${vb} V and overdrive ${vov} V; every Vth = ${vth} V. (a) What output CM level VCM gives the largest symmetric swing? (b) How low can each output go? (c) What is the peak swing per side, and (d) the peak-to-peak differential swing?`,
      figure: { kind: 'cmChoice', props: { vb, vth, vov, vcm: r.vcm, amp: r.peak } },
      givens: [
        { sym: 'V_b', value: vb, unit: 'V' },
        { sym: 'V_{ov3,4}', value: vov, unit: 'V' },
        { sym: 'V_{th}', value: vth, unit: 'V' },
      ],
      unknowns: [
        { key: 'vcm', sym: 'V_{CM}', label: '(a) Best output CM level', unit: 'V' },
        { key: 'floor', sym: 'V_{X,min}', label: '(b) Lowest output', unit: 'V' },
        { key: 'peak', sym: '\\Delta V_{peak}', label: '(c) Peak swing per side', unit: 'V' },
        { key: 'pp', sym: 'V_{pp,diff}', label: '(d) Differential peak-to-peak', unit: 'V' },
      ],
      answers: { vcm: r.vcm, floor: r.floor, peak: r.peak, pp: r.ppDiff },
      wrong: { vcm: [{ mistake: 'vgsForVov', value: vb - vth }], peak: [{ mistake: 'vgsForVov', value: vth }] },
      steps: [
        { tag: 'A', title: 'The loop makes Vin,CM = Vout,CM, so the drains X, Y sit at the CM level. M1, M2 stay saturated while X ≤ Vb − (VGS3,4 − Vth1,2)', tex: `V_{CM,max} = V_b - V_{ov3,4} = ${texNum(vb)} - ${texNum(vov)} = ${texSI(vcmH, 'V', 4)}`, produces: 'vcm', value: vcmH },
        { tag: 'A', title: 'M3, M4 stay saturated while X ≥ Vb − Vth3,4 (their fence)', tex: `V_{X,min} = V_b - V_{th} = ${texSI(floorH, 'V', 4)}`, produces: 'floor', value: floorH },
        { tag: '✓', title: 'Put VCM at the top edge: X can fall Vth − Vov; rising is limited only by the PMOS loads, so the symmetric swing is ±(Vth − Vov)', tex: `\\Delta V_{peak} = V_{th} - V_{ov3,4} = ${texSI(peakH, 'V', 4)}`, produces: 'peak', value: peakH },
        { tag: '·', title: 'Each output swings ±peak; the difference swings twice as far', tex: `V_{pp,diff} = 4(V_{th} - V_{ov}) = ${texSI(4 * peakH, 'V', 4)}`, produces: 'pp', value: 4 * peakH },
      ],
      hints: [
        'In closed loop the input and output CM levels are the same, so the drains sit at the input CM.',
        'Two fences: M3, M4 need X ≥ Vb − Vth; M1, M2 need X ≤ Vb − (VGS3,4 − Vth).',
        'Put VCM at the top edge; the room to fall is Vth − Vov.',
        `Vb − Vov = ${(vb - vov).toFixed(2)} V.`,
      ],
    };
    return { problem, sane: Math.abs(r.vcm - vcmH) < 1e-9 && Math.abs(r.peak - peakH) < 1e-9 && peakH > 0.05 };
  },
};

const EX_LIKE: Process = { name: 'Ex 9.7-like', kpn: 60e-6, kpp: 30e-6, vthn: 0.7, vthp: 0.7, lambdan: 0.1, lambdap: 0.2, vdd: 3 };

export const genTeleDesign: Generator = {
  id: 'l3-design',
  unit: 'L3',
  title: 'Design a telescopic op amp from power and swing (Ex 9.7 style)',
  make(rng) {
    const proc = EX_LIKE;
    const power = pick(rng, [6, 8, 10, 12]) * 1e-3;
    const swing = pick(rng, [2, 2.4, 2.8, 3]);
    const vov9 = pick(rng, [0.3, 0.4, 0.5]);
    const vovP = pick(rng, [0.2, 0.25, 0.3]);
    const iss = power / proc.vdd;
    const vovN = (proc.vdd - swing / 2 - vov9 - 2 * vovP) / 2;
    const id = iss / 2;
    const wlN = wlFromId(id, proc.kpn, vovN);
    const wlP = wlFromId(id, proc.kpp, vovP);
    const t = vovN > 0.08 ? telescopic({ proc, iss, wlN, wlP, viss: vov9 }) : undefined;
    const problem: Problem = {
      ...base('l3-design', 'L3', 'Design a telescopic op amp from power and swing (Ex 9.7 style)'),
      statement: `Fully differential telescopic, VDD = 3 V, power ${power * 1e3} mW, differential swing ${swing} Vpp. Tail overdrive ${vov9} V, every PMOS |Vov| = ${vovP} V; the NMOS share what is left. µnCox = 60 µA/V², µpCox = 30 µA/V², Vth = 0.7 V, λn = 0.1, λp = 0.2 V⁻¹. Find ISS, the NMOS overdrive, the sizes and the gain.`,
      givens: [
        { sym: 'P', value: power, unit: '' },
        { sym: 'V_{pp,diff}', value: swing, unit: 'V' },
        { sym: 'V_{ov9}', value: vov9, unit: 'V' },
        { sym: '|V_{ov,P}|', value: vovP, unit: 'V' },
      ],
      unknowns: [
        { key: 'iss', sym: 'I_{SS}', label: 'Tail current', unit: 'A' },
        { key: 'vovN', sym: 'V_{ov,N}', label: 'NMOS overdrive', unit: 'V' },
        { key: 'wlN', sym: '(W/L)_{1-4}', label: 'NMOS size', unit: '' },
        { key: 'wlP', sym: '(W/L)_{5-8}', label: 'PMOS size', unit: '' },
        { key: 'av', sym: 'A_v', label: 'Gain', unit: 'V/V' },
      ],
      answers: { iss, vovN, wlN, wlP, av: t?.av ?? NaN },
      wrong: { vovN: [{ mistake: 'signFlip', value: proc.vdd - swing - vov9 - 2 * vovP }] },
      steps: [
        { tag: 'A', title: '1. Power → current', tex: `I_{SS} = \\frac{P}{V_{DD}} = ${texSI(power / 3, 'A')}`, produces: 'iss', value: power / 3 },
        { tag: 'A', title: '2–3. Swing → what is left for the NMOS stack (each output swings half the differential swing)', tex: `2V_{ov,N} = 3 - \\tfrac{${swing}}{2} - ${vov9} - 2(${vovP}) \\Rightarrow V_{ov,N} = ${texSI((3 - swing / 2 - vov9 - 2 * vovP) / 2, 'V')}`, produces: 'vovN', value: (3 - swing / 2 - vov9 - 2 * vovP) / 2 },
        { tag: 'A', title: '4. Sizes from the square law at ISS/2', tex: `\\left(\\tfrac{W}{L}\\right)_N = \\frac{2 I_D}{60\\mu\\,V_{ov,N}^2} = ${texNum((2 * id) / (60e-6 * vovN * vovN))}`, produces: 'wlN', value: (2 * id) / (60e-6 * vovN * vovN) },
        { tag: 'A', title: 'PMOS', tex: `\\left(\\tfrac{W}{L}\\right)_P = \\frac{2 I_D}{30\\mu\\,|V_{ov,P}|^2} = ${texNum((2 * id) / (30e-6 * vovP * vovP))}`, produces: 'wlP', value: (2 * id) / (30e-6 * vovP * vovP) },
        { tag: 'D', title: '5. Gain gm1 (gm3 rO3 rO1 ‖ gm5 rO5 rO7)', tex: `A_v = ${texNum(t?.av ?? NaN)}`, produces: 'av', value: t?.av ?? NaN },
      ],
      hints: ['Start with power, even if nobody asked.', 'Swing budget: VDD − swing/2 − Vov9 − 2|Vov,P| is what the two NMOS share.', 'W/L = 2ID/(µCox·Vov²); Av = gm1(Rdown ‖ Rup).', `ISS = ${(iss * 1e3).toFixed(2)} mA.`],
    };
    return { problem, sane: vovN > 0.08, why: 'no headroom left for the NMOS' };
  },
};

export const genFoldedDesign: Generator = {
  id: 'l4-folded',
  unit: 'L4',
  title: 'Design a folded cascode from power and swing',
  make(rng) {
    const proc: Process = { name: 'Set A', kpn: 134.28e-6, kpp: 38.36e-6, vthn: 0.7, vthp: 0.8, lambdan: 0.1, lambdap: 0.2, vdd: 3 };
    const power = pick(rng, [3, 4.5, 6, 9]) * 1e-3;
    const swing = nice(rng, 1.6, 2.8, 0.2);
    const vov1 = pick(rng, [0.2, 0.3, 0.4]);
    const itot = power / proc.vdd;
    const iss = itot / 2, i = iss / 2;
    const vov = (proc.vdd - swing / 2) / 4;
    const fc = foldedCascodePmosInput({ proc, iss, i, vov1, vovNcas: vov, vovNsrc: vov, vovPcas: vov, vovPsrc: vov });
    const problem: Problem = {
      ...base('l4-folded', 'L4', 'Design a folded cascode from power and swing'),
      statement: `Set A (VDD = 3 V). Design a PMOS-input folded cascode for ${power * 1e3} mW and a differential swing of ${swing.toFixed(1)} Vpp: half the current to the input pair, half to the two cascode branches; the four swing-critical devices share the headroom equally; |Vov1,2| = ${vov1} V. Find ISS, I, the overdrive, the NMOS source size and the gain.`,
      givens: [
        { sym: 'P', value: power, unit: '' },
        { sym: 'V_{pp,diff}', value: swing, unit: 'V' },
        { sym: '|V_{ov1,2}|', value: vov1, unit: 'V' },
      ],
      unknowns: [
        { key: 'iss', sym: 'I_{SS}', label: 'Tail current', unit: 'A' },
        { key: 'i', sym: 'I', label: 'Cascode branch current', unit: 'A' },
        { key: 'vov', sym: 'V_{ov}', label: 'Swing-critical overdrive', unit: 'V' },
        { key: 'wl5', sym: '(W/L)_{5,6}', label: 'NMOS source size', unit: '' },
        { key: 'av', sym: 'A_v', label: 'Gain (Gm = gm1)', unit: 'V/V' },
      ],
      answers: { iss, i, vov, wl5: fc.m5.wl, av: fc.av },
      wrong: { wl5: [{ mistake: 'issNotHalf', value: fc.m3.wl }], vov: [{ mistake: 'signFlip', value: (proc.vdd - swing) / 4 }] },
      steps: [
        { tag: 'A', title: 'Power → total current, split in two', tex: `I_{tot} = ${texSI(power / 3, 'A')},\\; I_{SS} = ${texSI(power / 3 / 2, 'A')}`, produces: 'iss', value: power / 3 / 2 },
        { tag: 'A', title: 'Each cascode branch gets I = ISS/2', tex: `I = ${texSI(power / 3 / 4, 'A')}`, produces: 'i', value: power / 3 / 4 },
        { tag: 'A', title: 'Four overdrives share VDD − swing/2', tex: `V_{ov} = \\frac{3 - ${texNum(swing / 2)}}{4} = ${texSI((3 - swing / 2) / 4, 'V')}`, produces: 'vov', value: (3 - swing / 2) / 4 },
        { tag: 'A', title: 'M5 carries ISS/2 + I', tex: `\\left(\\tfrac{W}{L}\\right)_5 = \\frac{2(I_{SS}/2 + I)}{134.28\\mu\\,V_{ov}^2} = ${texNum((2 * (iss / 2 + i)) / (134.28e-6 * vov * vov))}`, produces: 'wl5', value: (2 * (iss / 2 + i)) / (134.28e-6 * vov * vov) },
        { tag: 'D', title: 'Gain gm1 (Rup ‖ Rdown)', tex: `A_v \\approx ${texNum(fc.av)}`, produces: 'av', value: fc.av },
      ],
      hints: ['Folding costs current: two extra branches.', 'Only four devices in the output stack.', 'Vov = (VDD − swing/2)/4; ID5 = ISS/2 + I.', `ISS = ${(iss * 1e3).toFixed(2)} mA.`],
    };
    return { problem, sane: vov > 0.1 };
  },
};



// ─── L5 two-stage ──────────────────────────────────────────────────────────

export const genTwoStage: Generator = {
  id: 'l5-twostage',
  unit: 'L5',
  title: 'Two-stage op amp: gain multiplies, swing is set by the second stage',
  make(rng) {
    const vdd = pick(rng, [1.8, 3]);
    const i1 = nice(rng, 50e-6, 500e-6, 50e-6);
    const i2 = nice(rng, 100e-6, 1e-3, 50e-6);
    const vov1 = nice(rng, 0.15, 0.3, 0.05);
    const vov5 = nice(rng, 0.15, 0.4, 0.05);
    const vov7 = nice(rng, 0.15, 0.4, 0.05);
    const ln = pick(rng, [0.05, 0.1]);
    const lp = pick(rng, [0.1, 0.2]);
    const a1 = gmFromIdVov(i1, vov1) * par(rO(ln, i1), rO(lp, i1));
    const a2 = gmFromIdVov(i2, vov5) * par(rO(lp, i2), rO(ln, i2));
    const a1t = ((2 * i1) / vov1) * par(1 / (ln * i1), 1 / (lp * i1));
    const a2t = ((2 * i2) / vov5) * par(1 / (lp * i2), 1 / (ln * i2));
    const swing = 2 * (vdd - vov5 - vov7);
    const problem: Problem = {
      ...base('l5-twostage', 'L5', 'Two-stage op amp: gain multiplies, swing is set by the second stage'),
      statement: `A two-stage op amp (Fig. 9.23 style): stage 1 is an NMOS pair with PMOS current-source loads (ID = ${(i1 * 1e6).toFixed(0)} µA per side, Vov1 = ${vov1} V); stage 2 is a PMOS common-source device (ID = ${(i2 * 1e6).toFixed(0)} µA, |Vov5| = ${vov5} V) with an NMOS current-source load (Vov7 = ${vov7} V). λn = ${ln}, λp = ${lp} V⁻¹, VDD = ${vdd} V. Find A1, A2, the total gain and the differential output swing.`,
      givens: [
        { sym: 'I_{D1}', value: i1, unit: 'A' },
        { sym: 'I_{D5}', value: i2, unit: 'A' },
        { sym: 'V_{ov1}', value: vov1, unit: 'V' },
        { sym: '|V_{ov5}|', value: vov5, unit: 'V' },
        { sym: 'V_{ov7}', value: vov7, unit: 'V' },
      ],
      unknowns: [
        { key: 'a1', sym: 'A_1', label: 'First-stage gain', unit: 'V/V' },
        { key: 'a2', sym: 'A_2', label: 'Second-stage gain', unit: 'V/V' },
        { key: 'a', sym: 'A_v', label: 'Total gain', unit: 'V/V' },
        { key: 'swing', sym: 'V_{pp,diff}', label: 'Differential swing', unit: 'V' },
      ],
      answers: { a1, a2, a: a1 * a2, swing },
      wrong: { a: [{ mistake: 'forgotRo', value: a1 + a2 }] },
      steps: [
        { tag: 'D', title: 'Stage 1: gm1 (rO1 ‖ rO3)', tex: `A_1 = ${texNum(a1t)}`, produces: 'a1', value: a1t },
        { tag: 'D', title: 'Stage 2: a CS stage, gm5 (rO5 ‖ rO7)', tex: `A_2 = ${texNum(a2t)}`, produces: 'a2', value: a2t },
        { tag: 'D', title: 'Gains in cascade multiply', tex: `A_v = ${texNum(a1t * a2t)}`, produces: 'a', value: a1t * a2t },
        { tag: '✓', title: 'The output stage has only one device at each rail', tex: `2(V_{DD} - |V_{ov5}| - V_{ov7}) = ${texSI(2 * (vdd - vov5 - vov7), 'V')}`, produces: 'swing', value: 2 * (vdd - vov5 - vov7) },
      ],
      hints: ['High gain, then high swing: two jobs, two stages.', 'Each stage is a CS stage with a current-source load.', 'A = A1·A2; swing from the second stage.', `A1 = ${a1t.toFixed(1)}.`],
    };
    return { problem, sane: vdd - vov5 - vov7 > 0.3 };
  },
};

export const genBoost: Generator = {
  id: 'l6-boost',
  unit: 'L6',
  title: 'Gain boosting: Rout × (1 + A1)',
  make(rng) {
    const id = nice(rng, 50e-6, 500e-6, 50e-6);
    const vov = nice(rng, 0.15, 0.3, 0.05);
    const lambda = pick(rng, [0.1, 0.2]);
    const a1 = pick(rng, [10, 20, 50, 100]);
    const gm = gmFromIdVov(id, vov);
    const ro = rO(lambda, id);
    const r0 = boostedRout({ gm2: gm, rO2: ro, rO1: ro, a1: 0 });
    const rb = boostedRout({ gm2: gm, rO2: ro, rO1: ro, a1 });
    const gmt = (2 * id) / vov, rot = 1 / (lambda * id);
    const problem: Problem = {
      ...base('l6-boost', 'L6', 'Gain boosting: Rout × (1 + A1)'),
      statement: `An NMOS cascode (M1 input, M2 cascode) carries ${(id * 1e6).toFixed(0)} µA with Vov = ${vov} V and λ = ${lambda} V⁻¹. An auxiliary amplifier of gain A1 = ${a1} senses M2’s source and drives its gate. Find Rout without and with boosting, and the gain with an ideal current-source load.`,
      givens: [
        { sym: 'I_D', value: id, unit: 'A' },
        { sym: 'V_{ov}', value: vov, unit: 'V' },
        { sym: '\\lambda', value: lambda, unit: '' },
        { sym: 'A_1', value: a1, unit: '' },
      ],
      unknowns: [
        { key: 'r0', sym: 'R_{out}', label: 'Plain cascode Rout', unit: 'Ω' },
        { key: 'rb', sym: 'R_{out,boost}', label: 'Boosted Rout', unit: 'Ω' },
        { key: 'av', sym: '|A_v|', label: 'Boosted gain (ideal load)', unit: 'V/V' },
      ],
      answers: { r0, rb, av: gm * rb },
      wrong: { rb: [{ mistake: 'forgotHalf', value: a1 * r0 }] },
      steps: [
        { tag: 'C', title: 'gm and rO', tex: `g_m = ${texSI(gmt, 'S')},\; r_O = ${texSI(rot, 'Ω')}` },
        { tag: 'C', title: 'Plain cascode: rO1 + rO2 + gm2 rO2 rO1', tex: `R_{out} = ${texSI(2 * rot + gmt * rot * rot, 'Ω')}`, produces: 'r0', value: 2 * rot + gmt * rot * rot },
        { tag: 'C', title: 'The auxiliary amplifier multiplies the gm·rO·rO term by (1 + A1)', tex: `R_{out,boost} = 2r_O + (1 + ${a1})g_m r_O^2 = ${texSI(2 * rot + (1 + a1) * gmt * rot * rot, 'Ω')}`, produces: 'rb', value: 2 * rot + (1 + a1) * gmt * rot * rot },
        { tag: 'D', title: 'Gain with an ideal load', tex: `|A_v| = g_m R_{out,boost} = ${texNum(gmt * (2 * rot + (1 + a1) * gmt * rot * rot))}`, produces: 'av', value: gmt * (2 * rot + (1 + a1) * gmt * rot * rot) },
      ],
      hints: ['The aux amp holds M2’s source still, so M2 fights back harder.', 'Rout = rO1 + rO2 + (1 + A1)gm2 rO2 rO1.', 'Gain = gm1·Rout (ideal load).', `gm·rO = ${(gmt * rot).toFixed(1)}.`],
    };
    return { problem, sane: true };
  },
};

export const genTriodeSense: Generator = {
  id: 'l7-triode',
  unit: 'L7',
  title: 'Triode CMFB: size the sensing pair for a target output CM',
  make(rng) {
    const kpn = pick(rng, [100e-6, 135e-6, 200e-6]);
    const vth = pick(rng, [0.4, 0.5, 0.7]);
    const id = nice(rng, 50e-6, 500e-6, 50e-6);
    const vcm = nice(rng, vth + 0.4, vth + 1.0, 0.05);
    const vp = pick(rng, [0.05, 0.1, 0.15, 0.2]);
    const wl = triodeSenseWl({ id, kpn, vp, voutSum: 2 * vcm, vthn: vth });
    const rtot = vp / (2 * id);
    const problem: Problem = {
      ...base('l7-triode', 'L7', 'Triode CMFB: size the sensing pair for a target output CM'),
      statement: `Two deep-triode NMOS (gates on Vout1 and Vout2) form the tail of a fully differential pair; each branch carries ${(id * 1e6).toFixed(0)} µA. µnCox = ${kpn * 1e6} µA/V², Vth = ${vth} V. For an output CM of ${vcm} V with VP = ${vp * 1000} mV, find the tail resistance and W/L of each sensing device.`,
      figure: { kind: 'cmfbTriode', props: { vout1: vcm, vout2: vcm, vp, wl } },
      givens: [
        { sym: 'I_D', value: id, unit: 'A' },
        { sym: 'V_{out,CM}', value: vcm, unit: 'V' },
        { sym: 'V_P', value: vp, unit: 'V' },
      ],
      unknowns: [
        { key: 'rtot', sym: 'R_{tot}', label: 'Tail resistance (both in parallel)', unit: 'Ω' },
        { key: 'wl', sym: 'W/L', label: 'Each sensing device', unit: '' },
      ],
      answers: { rtot, wl },
      wrong: { wl: [{ mistake: 'issNotHalf', value: wl / 2 }] },
      steps: [
        { tag: 'A', title: 'Both branches’ current flows through the pair: Rtot = VP/(2ID)', tex: `R_{tot} = ${texSI(vp / (2 * id), 'Ω')}`, produces: 'rtot', value: vp / (2 * id) },
        { tag: 'A', title: 'Deep triode: Rtot = 1/(µnCox(W/L)(Vout1 + Vout2 − 2Vth))', tex: `\\frac{W}{L} = \\frac{1}{\\mu_n C_{ox} R_{tot}(2V_{CM} - 2V_{th})} = ${texNum(1 / (kpn * (vp / (2 * id)) * (2 * vcm - 2 * vth)))}`, produces: 'wl', value: 1 / (kpn * (vp / (2 * id)) * (2 * vcm - 2 * vth)) },
      ],
      hints: ['In deep triode a MOSFET is a resistor controlled by its gate.', 'The two devices are in parallel: their conductances add.', 'Rtot = VP/(2ID) = 1/(µnCox(W/L)(Vout1 + Vout2 − 2Vth)).', `Rtot = ${(rtot).toFixed(0)} Ω.`],
    };
    return { problem, sane: true };
  },
};

export const genSlewSettle: Generator = {
  id: 'l9-slew',
  unit: 'L9',
  title: 'Big step: slewing first, then linear settling',
  make(rng) {
    const iss = nice(rng, 50e-6, 400e-6, 25e-6);
    const cl = pick(rng, [1e-12, 2e-12, 4e-12, 5e-12]);
    const acl = pick(rng, [1, 2, 4]);
    const fu = pick(rng, [20e6, 50e6, 100e6]);
    const vstep = pick(rng, [0.5, 1, 1.5]);
    const tau = acl / (2 * Math.PI * fu);
    const sr = iss / cl;
    const vfinal = vstep * acl;
    const ts = slewTime(vfinal, tau, sr);
    const tLin = tau * Math.log((sr * tau) / (0.01 * vfinal));
    const problem: Problem = {
      ...base('l9-slew', 'L9', 'Big step: slewing first, then linear settling'),
      statement: `A one-stage op amp (tail ISS charging CL, unity-gain frequency fu) is used at closed-loop gain ${acl}. A ${vstep} V input step is applied. Find the slew rate, how long it slews, and the total time to settle within 1%.`,
      figure: { kind: 'step', props: { vstep: vfinal, tau, eps: 0.01, sr } },
      givens: [
        { sym: 'I_{SS}', value: iss, unit: 'A' },
        { sym: 'C_L', value: cl, unit: 'F' },
        { sym: 'f_u', value: fu, unit: 'Hz' },
        { sym: 'A_{closed}', value: acl, unit: '' },
        { sym: 'V_{step}', value: vstep, unit: 'V' },
      ],
      unknowns: [
        { key: 'sr', sym: 'SR', label: 'Slew rate', unit: 'V/s' },
        { key: 'ts', sym: 't_{slew}', label: 'Slewing time', unit: 's' },
        { key: 'tt', sym: 't_{total}', label: 'Total time to 1%', unit: 's' },
      ],
      answers: { sr, ts, tt: ts + tLin },
      wrong: { ts: [{ mistake: 'forgot2pi', value: (vfinal - sr * (acl / fu)) / sr }] },
      steps: [
        { tag: '·', title: 'SR = ISS/CL', tex: `SR = ${texSI(iss / cl, 'V/s')}`, produces: 'sr', value: iss / cl },
        { tag: '·', title: 'τ = Aclosed/ωu; the linear response would start with slope Vfinal/τ. It slews until the error left is SR·τ', tex: `\\tau = ${texSI(tau, 's')},\; t_{slew} = \\frac{V_{final} - SR\\,\\tau}{SR} = ${texSI((vfinal - (iss / cl) * tau) / (iss / cl), 's')}`, produces: 'ts', value: (vfinal - (iss / cl) * tau) / (iss / cl) },
        { tag: '·', title: 'Then settle the remaining SR·τ exponentially down to 1% of Vfinal', tex: `t_{total} = t_{slew} + \\tau\\ln\\frac{SR\\,\\tau}{0.01\\,V_{final}} = ${texSI((vfinal - (iss / cl) * tau) / (iss / cl) + tau * Math.log(((iss / cl) * tau) / (0.01 * vfinal)), 's')}`, produces: 'tt', value: (vfinal - (iss / cl) * tau) / (iss / cl) + tau * Math.log(((iss / cl) * tau) / (0.01 * vfinal)) },
      ],
      hints: ['A fixed tap fills the bucket first; then the cake gets eaten.', 'Slewing happens while Vfinal/τ would exceed ISS/CL.', 'tslew = (Vfinal − SR·τ)/SR; then τ·ln(SR·τ/(0.01·Vfinal)).', `τ = ${(tau * 1e9).toFixed(2)} ns.`],
    };
    return { problem, sane: ts > 0 && (sr * tau) / (0.01 * vfinal) > 1 };
  },
};

export const HANDOUT_GENERATORS: Generator[] = [genGainError, genCmChoice, genTeleDesign, genFoldedDesign, genTwoStage, genBoost, genTriodeSense, genSlewSettle];
