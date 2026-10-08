/**
 * Fixed bank for Milestone 3: Tutorial 1 (Q1–Q5, Sedra–Smith-style differential pairs) and the mid-sem
 * exam question (5-T OTA, parts a–e; = Quiz 1 Part C). Statements are restated in plain words with the
 * course notation (§6). Answers come only from src/physics/solvers; each step recomputes its number from
 * the arithmetic it shows, and the fixed-bank test checks both agree.
 */
import { fiveTOtaQuiz, QUIZ1_C, SET_B, tut1Q1, tut1Q2, tut1Q3, tut1Q4, tut1Q5, wlFromId } from '../physics';
import type { Problem } from './schema';
import { texNum, texSI } from './tex';

const par = (a: number, b: number) => (a * b) / (a + b);
const SEDRA = 'Tutorial 1 uses Sedra–Smith symbols: k′n = µnCox, Vt = Vth, |VA| = 1/λ = |V′A|·L.';

function t1q1(): Problem {
  const r = tut1Q1();
  const vdd = 0.9, vss = -0.9, vov = 0.15, vth = 0.35, kp = 400e-6, iref = 0.1e-3, iss = 0.2e-3;
  const id = iss / 2, vgs = vth + vov;
  return {
    id: 'bank-t1q1',
    source: 'Tutorial 1 Q1',
    tags: ['U10', 'U6'],
    title: 'Tutorial 1 Q1: design a pair with a mirror tail',
    statement: 'Supplies ±0.9 V. Design the circuit so both drains sit at 0 V when both gates are at 0 V. Every transistor runs at Vov = 0.15 V; Vth = 0.35 V, µnCox = 400 µA/V², λ = 0. The reference current through R into diode Q4 is 0.1 mA and the tail Q3 carries 0.2 mA. Find RD, R, and W/L of Q1–Q4, and the input common-mode range.',
    figure: { kind: 'diffPair', props: { vdd, vss, iss, kp, wl: r.wl12, vth, vin1: 0, vin2: 0, rd: r.rd, tail: 'mirror', wlTail: r.wl3, r: r.r, names: ['Q1', 'Q2', 'Q3', 'Q4'] } },
    givens: [
      { sym: 'V_{DD}', value: vdd, unit: 'V' },
      { sym: 'V_{SS}', value: vss, unit: 'V' },
      { sym: 'V_{ov}', value: vov, unit: 'V' },
      { sym: 'V_{th}', value: vth, unit: 'V' },
      { sym: '\\mu_n C_{ox}', value: kp, unit: 'A/V²' },
      { sym: 'I_{REF}', value: iref, unit: 'A' },
      { sym: 'I_{SS}', value: iss, unit: 'A' },
    ],
    unknowns: [
      { key: 'rd', sym: 'R_D', label: 'Drain resistors', unit: 'Ω' },
      { key: 'wl12', sym: '(W/L)_{1,2}', label: 'Q1, Q2', unit: '' },
      { key: 'wl3', sym: '(W/L)_3', label: 'Q3 (tail)', unit: '' },
      { key: 'wl4', sym: '(W/L)_4', label: 'Q4 (diode)', unit: '' },
      { key: 'r', sym: 'R', label: 'Reference resistor', unit: 'Ω' },
      { key: 'cmMin', sym: 'V_{in,CM,min}', label: 'Lowest input CM', unit: 'V' },
      { key: 'cmMax', sym: 'V_{in,CM,max}', label: 'Highest input CM', unit: 'V' },
    ],
    answers: { rd: r.rd, wl12: r.wl12, wl3: r.wl3, wl4: r.wl4, r: r.r, cmMin: r.cmirMin, cmMax: r.cmirMax },
    wrong: {
      rd: [{ mistake: 'issNotHalf', value: vdd / iss }],
      wl12: [{ mistake: 'issNotHalf', value: r.wl3 }],
      r: [{ mistake: 'diodeThreshold', value: (vdd - (vss + vov)) / iref }],
      cmMin: [{ mistake: 'vovNotVgs', value: vss + 2 * vov }],
    },
    steps: [
      { tag: 'A', title: 'Q1, Q2 each carry half the tail: 0.1 mA. Drop 0.9 V across RD', tex: `R_D = \\frac{0.9 - 0}{0.1\\,\\mathrm{mA}} = ${texSI(0.9 / id, 'Ω')}`, produces: 'rd', value: 0.9 / id, highlight: ['rd1', 'rd2'] },
      { tag: 'A', title: 'Square law backwards for each device', tex: `\\left(\\tfrac{W}{L}\\right)_{1,2} = \\frac{2(0.1\\mathrm{m})}{400\\mu\\,(0.15)^2} = ${texNum((2 * id) / (kp * vov * vov), 4)}`, produces: 'wl12', value: (2 * id) / (kp * vov * vov), highlight: ['m1', 'm2'] },
      { tag: 'A', title: 'Tail Q3 carries 0.2 mA', tex: `\\left(\\tfrac{W}{L}\\right)_3 = \\frac{2(0.2\\mathrm{m})}{400\\mu\\,(0.15)^2} = ${texNum((2 * iss) / (kp * vov * vov), 4)}`, produces: 'wl3', value: (2 * iss) / (kp * vov * vov), highlight: ['m3'] },
      { tag: 'A', title: 'Diode Q4 carries IREF = 0.1 mA', tex: `\\left(\\tfrac{W}{L}\\right)_4 = \\frac{2(0.1\\mathrm{m})}{400\\mu\\,(0.15)^2} = ${texNum((2 * iref) / (kp * vov * vov), 4)}`, produces: 'wl4', value: (2 * iref) / (kp * vov * vov), highlight: ['m4'] },
      { tag: 'A', title: 'Q4’s drain sits a full VGS = 0.5 V above VSS: −0.4 V. R drops the rest', tex: `R = \\frac{0.9 - (-0.9 + 0.5)}{0.1\\,\\mathrm{mA}} = ${texSI((vdd - (vss + vgs)) / iref, 'Ω')}`, produces: 'r', value: (vdd - (vss + vgs)) / iref, highlight: ['r', 'm4'] },
      { tag: '✓', title: 'CM floor: Q3 needs Vov, then Q1 needs its VGS', tex: `V_{in,CM,min} = -0.9 + 0.15 + 0.5 = ${texSI(vss + vov + vgs, 'V')}`, produces: 'cmMin', value: vss + vov + vgs, highlight: ['m3', 'm1'] },
      { tag: '✓', title: 'CM ceiling: Q1’s fence against its drain at 0 V', tex: `V_{in,CM,max} = V_D + V_{th} = 0 + 0.35 = ${texSI(0 + vth, 'V')}`, produces: 'cmMax', value: 0 + vth, highlight: ['m1'] },
    ],
    hints: [
      'Start with currents: the tail splits 0.1 mA / 0.1 mA; the reference branch carries 0.1 mA.',
      'Each W/L comes from the square law at Vov = 0.15 V with that device’s own current.',
      'R = (VDD − VSS − VGS4)/IREF; CMIR = [VSS + Vov3 + VGS1, VD + Vth].',
      'VGS = 0.35 + 0.15 = 0.5 V for every device.',
    ],
    flags: [SEDRA, 'Your handwritten Tutorial 1 solution agrees with every number here.'],
  };
}

function t1q2(): Problem {
  const r = tut1Q2();
  return {
    id: 'bank-t1q2',
    source: 'Tutorial 1 Q2',
    tags: ['U10', 'U7'],
    title: 'Tutorial 1 Q2: pair with diode-connected PMOS loads',
    statement: 'The drain resistors of an NMOS pair are replaced by diode-connected PMOS Q3, Q4. (a) Use the half circuit to write Ad with gm and rO. (b) Neglecting rO, write Ad with µn, µp and the W/L’s. (c) µn = 4µp and equal L: find W1,2/W3,4 for Ad = 10.',
    figure: { kind: 'diffPair', props: { vdd: 1.8, iss: 20e-6, kp: 400e-6, wl: 25, vth: 0.5, vin1: 0.6, vin2: 0.6, load: 'diode', kpp: 100e-6, wlp: 1, vthp: 0.5, names: ['Q1', 'Q2', 'Q3', 'Q4'] } },
    givens: [
      { sym: 'A_d', value: 10, unit: 'V/V' },
      { sym: '\\mu_n/\\mu_p', value: 4, unit: '' },
    ],
    unknowns: [{ key: 'ratio', sym: 'W_{1,2}/W_{3,4}', label: 'Width ratio', unit: '' }],
    answers: { ratio: r.ratio },
    wrong: { ratio: [{ mistake: 'forgotSquare', value: 10 / 4 }, { mistake: 'ratioInverted', value: 4 / 100 }] },
    steps: [
      { tag: 'B', title: 'Half circuit: Q1 is a CS stage, its load Q3 is a diode', highlight: ['m1', 'l1'] },
      { tag: 'C', title: '(a) Diode load = 1/gm3 ‖ rO3; everything at the drain in parallel', tex: 'A_d = g_{m1}\\left(\\tfrac{1}{g_{m3}} \\parallel r_{O1} \\parallel r_{O3}\\right)' },
      { tag: 'D', title: '(b) Without rO: a ratio of two gm’s, and the current cancels', tex: 'A_d = \\frac{g_{m1}}{g_{m3}} = \\sqrt{\\frac{\\mu_n (W/L)_{1,2}}{\\mu_p (W/L)_{3,4}}}' },
      { tag: 'D', title: '(c) Square both sides, equal L', tex: `\\frac{W_{1,2}}{W_{3,4}} = \\frac{A_d^2}{\\mu_n/\\mu_p} = \\frac{10^2}{4} = ${texNum((10 * 10) / 4)}`, produces: 'ratio', value: (10 * 10) / 4 },
    ],
    hints: ['Diode loads look like 1/gm.', 'Ad = gm1/gm3 when rO is neglected.', 'gm = √(2µCox(W/L)ID); the same ID flows in Q1 and Q3.', 'Ad² = (µn/µp)·(W1/W3).'],
    flags: [SEDRA],
  };
}

function t1q3(): Problem {
  const r = tut1Q3();
  const kpn = 400e-6, kpp = 100e-6, id = 100e-6, vov = 0.2, L = 0.36e-6, vaPerL = 10e6;
  const va = vaPerL * L;
  const ro = va / id;
  const gm = (2 * id) / vov;
  return {
    id: 'bank-t1q3',
    source: 'Tutorial 1 Q3',
    tags: ['U10', 'U7'],
    title: 'Tutorial 1 Q3: pair with PMOS current-source loads',
    statement: '0.18 µm CMOS: µnCox = 4µpCox = 400 µA/V², |Vth| = 0.5 V, |V′A| = 10 V/µm. Bias I = 200 µA, every L is twice the minimum (0.36 µm), every |Vov| = 0.2 V. Find W/L of Q1–Q4 and the differential gain Ad.',
    figure: { kind: 'diffPair', props: { vdd: 1.8, iss: 200e-6, kp: kpn, wl: r.wl12, vth: 0.5, vin1: 0.9, vin2: 0.9, load: 'current', kpp, wlp: r.wl34, vthp: 0.5, names: ['Q1', 'Q2', 'Q3', 'Q4'] } },
    givens: [
      { sym: 'I', value: 200e-6, unit: 'A' },
      { sym: '|V_{ov}|', value: vov, unit: 'V' },
      { sym: '\\mu_n C_{ox}', value: kpn, unit: 'A/V²' },
      { sym: '\\mu_p C_{ox}', value: kpp, unit: 'A/V²' },
      { sym: "|V'_A|", value: 10, unit: '' },
      { sym: 'L', value: L, unit: '' },
    ],
    unknowns: [
      { key: 'wl12', sym: '(W/L)_{1,2}', label: 'Q1, Q2', unit: '' },
      { key: 'wl34', sym: '(W/L)_{3,4}', label: 'Q3, Q4', unit: '' },
      { key: 'ad', sym: 'A_d', label: 'Differential gain', unit: 'V/V' },
    ],
    answers: { wl12: r.wl12, wl34: r.wl34, ad: r.ad },
    wrong: { wl12: [{ mistake: 'issNotHalf', value: wlFromId(200e-6, kpn, vov) }], ad: [{ mistake: 'roNotHalf', value: gm * ro }] },
    steps: [
      { tag: 'A', title: 'Each side carries I/2 = 100 µA', tex: `\\left(\\tfrac{W}{L}\\right)_{1,2} = \\frac{2(100\\mu)}{400\\mu(0.2)^2} = ${texNum((2 * id) / (kpn * vov * vov))}`, produces: 'wl12', value: (2 * id) / (kpn * vov * vov) },
      { tag: 'A', title: 'PMOS loads, same current, µpCox four times smaller', tex: `\\left(\\tfrac{W}{L}\\right)_{3,4} = \\frac{2(100\\mu)}{100\\mu(0.2)^2} = ${texNum((2 * id) / (kpp * vov * vov))}`, produces: 'wl34', value: (2 * id) / (kpp * vov * vov) },
      { tag: 'C', title: 'Early voltage and rO', tex: `V_A = 10\\,\\tfrac{\\mathrm{V}}{\\mu\\mathrm{m}}\\times 0.36\\,\\mu\\mathrm{m} = ${texSI(va, 'V')},\\; r_O = \\frac{V_A}{I_D} = ${texSI(ro, 'Ω')}` },
      { tag: 'D', title: 'Half circuit: CS with a current-source load, rO ‖ rO = rO/2', tex: `A_d = g_m (r_{O1}\\parallel r_{O3}) = ${texSI(gm, 'S')}\\times ${texSI(par(ro, ro), 'Ω')} = ${texNum(gm * par(ro, ro))}`, produces: 'ad', value: gm * par(ro, ro) },
    ],
    hints: ['Each side carries half of I.', 'W/L from the square law; rO = VA/ID with VA = |V′A|·L.', 'Ad = gm(rO1 ‖ rO3).', 'gm = 2ID/Vov = 1 mA/V.'],
    flags: [SEDRA],
  };
}

function t1q4(): Problem {
  const r = tut1Q4();
  const vdd = 5, rss = 1e3, iss = 1e-3, k = 2.5e-3, vt = 0.7, id = iss / 2;
  const vov = Math.sqrt((2 * id) / k);
  const vcm = iss * rss + vt + vov;
  const gm = (2 * id) / vov;
  const rd = 8 / gm;
  const vd = vdd - id * rd;
  const acm = -rd / (1 / gm + 2 * rss);
  const dv = (vd - vcm + vt) / (1 - acm);
  return {
    id: 'bank-t1q4',
    source: 'Tutorial 1 Q4',
    tags: ['U10'],
    title: 'Tutorial 1 Q4: a single-supply pair with an RSS tail',
    statement: 'A pair runs from a single 5 V supply; RSS sets a 1 mA tail current. Q1, Q2 have µnCox(W/L) = 2.5 mA/V², Vth = 0.7 V, λ = 0. (a) Find VCM. (b) RD for Ad = 8. (c) The drain DC voltage. (d) The CM gain ΔVD1/ΔVCM (keep 1/gm!). (e) How much can VCM rise before Q1, Q2 enter triode?',
    figure: { kind: 'diffPair', props: { vdd, iss, kp: k, wl: 1, vth: vt, vin1: r.vcm, vin2: r.vcm, rd: r.rd, tail: 'rss', rss, names: ['Q1', 'Q2'] } },
    givens: [
      { sym: 'V_{DD}', value: vdd, unit: 'V' },
      { sym: 'R_{SS}', value: rss, unit: 'Ω' },
      { sym: 'I_{SS}', value: iss, unit: 'A' },
      { sym: '\\mu_n C_{ox} W/L', value: k, unit: 'A/V²' },
      { sym: 'V_{th}', value: vt, unit: 'V' },
      { sym: 'A_d', value: 8, unit: 'V/V' },
    ],
    unknowns: [
      { key: 'vcm', sym: 'V_{CM}', label: '(a) Required input CM', unit: 'V' },
      { key: 'rd', sym: 'R_D', label: '(b) Drain resistor', unit: 'Ω' },
      { key: 'vd', sym: 'V_D', label: '(c) Drain DC voltage', unit: 'V' },
      { key: 'acm', sym: 'A_{CM}', label: '(d) CM gain (with sign)', unit: 'V/V' },
      { key: 'dvcm', sym: '\\Delta V_{CM}', label: '(e) CM rise to the triode edge', unit: 'V' },
    ],
    answers: { vcm: r.vcm, rd: r.rd, vd: r.vd, acm: r.acm, dvcm: r.dvcm },
    wrong: {
      vcm: [{ mistake: 'vovNotVgs', value: iss * rss + vov }],
      acm: [{ mistake: 'rssNot2rss', value: -rd / (1 / gm + rss) }, { mistake: 'forgotDegeneration', value: -rd / (2 * rss) }],
      dvcm: [{ mistake: 'forgotSatCheck', value: vd - vcm + vt }],
    },
    steps: [
      { tag: 'A', title: 'Tail node: 1 mA through 1 kΩ puts the sources at 1 V', tex: `V_P = I_{SS} R_{SS} = ${texSI(iss * rss, 'V')}` },
      { tag: 'A', title: '(a) Each device carries 0.5 mA: Vov, then the gate sits a VGS above P', tex: `V_{ov} = \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{2.5\\mathrm{m}}} = ${texSI(vov, 'V')},\\; V_{CM} = 1 + 0.7 + ${texNum(vov, 4)} = ${texSI(vcm, 'V', 4)}`, produces: 'vcm', value: vcm },
      { tag: 'D', title: '(b) Differential half circuit: Ad = gm·RD', tex: `g_m = \\frac{2I_D}{V_{ov}} = ${texSI(gm, 'S')},\\; R_D = \\frac{8}{g_m} = ${texSI(rd, 'Ω', 4)}`, produces: 'rd', value: rd },
      { tag: 'A', title: '(c) Walk the drain node', tex: `V_D = 5 - (0.5\\mathrm{m})R_D = ${texSI(vd, 'V', 4)}`, produces: 'vd', value: vd },
      { tag: 'D', title: '(d) CM half circuit: each half sees 2RSS; ratio rule with 1/gm', tex: `A_{CM} = -\\frac{R_D}{1/g_m + 2R_{SS}} = ${texNum(acm, 4)}`, produces: 'acm', value: acm },
      { tag: '✓', title: '(e) Gate rises by ΔV, drain moves by ACM·ΔV. Triode when VD + ACM·ΔV = VCM + ΔV − Vth', tex: `\\Delta V_{CM} = \\frac{V_D - V_{CM} + V_{th}}{1 - A_{CM}} = ${texSI(dv, 'V')}`, produces: 'dvcm', value: dv },
    ],
    hints: ['The tail resistor fixes VP = ISS·RSS.', 'VCM = VP + VGS; Ad = gm·RD; ACM = −RD/(1/gm + 2RSS).', 'For (e): the drain falls while the gate rises, so the fence closes from both sides.', 'Vov = 0.632 V.'],
    flags: [SEDRA],
  };
}

function t1q5(): Problem {
  const r = tut1Q5();
  const k = 4e-3, va = 5, ad = 20;
  const id = (2 * k * (va / 2) ** 2) / (ad * ad);
  return {
    id: 'bank-t1q5',
    source: 'Tutorial 1 Q5',
    tags: ['U11'],
    title: 'Tutorial 1 Q5: mirror-loaded pair, find the bias current',
    statement: 'In a current-mirror-loaded pair (a 5-T OTA) every device has µCox(W/L) = 4 mA/V² and |VA| = 5 V. Find the bias current I for which vo/vid = 20 V/V.',
    figure: { kind: 'fiveT', props: { proc: { name: 'Tut 1 Q5', kpn: 4e-3, kpp: 4e-3, vthn: 0.5, vthp: 0.5, lambdan: 0.2, lambdap: 0.2, vdd: 3 }, iss: r.i, wl12: 1, wl34: 1, wlTail: 1, vinCm: 1.4 } },
    givens: [
      { sym: '\\mu C_{ox} W/L', value: k, unit: 'A/V²' },
      { sym: '|V_A|', value: va, unit: 'V' },
      { sym: 'A_d', value: ad, unit: 'V/V' },
    ],
    unknowns: [{ key: 'i', sym: 'I', label: 'Tail bias current', unit: 'A' }],
    answers: { i: r.i },
    wrong: { i: [{ mistake: 'issNotHalf', value: r.id }] },
    steps: [
      { tag: 'D', title: 'Mirror-loaded pair: Gm = gm, Rout = rO2 ‖ rO4 = rO/2', tex: 'A_d = g_m \\frac{r_O}{2} = \\sqrt{2k I_D}\\cdot\\frac{V_A}{2 I_D} = V_A\\sqrt{\\frac{k}{2 I_D}}' },
      { tag: 'A', title: 'Solve for the current in each side', tex: `I_D = \\frac{2k(V_A/2)^2}{A_d^2} = \\frac{2(4\\mathrm{m})(2.5)^2}{20^2} = ${texSI(id, 'A')}` },
      { tag: 'A', title: 'The tail carries both sides', tex: `I = 2I_D = ${texSI(2 * id, 'A')}`, produces: 'i', value: 2 * id },
    ],
    hints: ['A mirror-loaded pair has Ad = gm(rO2 ‖ rO4).', 'Write gm = √(2kID) and rO = VA/ID; ID cancels partly.', 'Ad = VA·√(k/(2ID)).', 'Each side carries I/2.'],
    flags: [SEDRA],
  };
}

function exam(): Problem {
  const { design, ota } = fiveTOtaQuiz(QUIZ1_C);
  const p = SET_B, iRef = QUIZ1_C.iRef, cl = QUIZ1_C.cl, id = iRef / 2;
  const vov5 = Math.sqrt((2 * iRef) / (p.kpn * QUIZ1_C.wlTail));
  const vov1 = QUIZ1_C.vinCmMin - vov5 - p.vthn;
  const vgs3 = p.vdd - QUIZ1_C.vinCmMax + p.vthn;
  const vov3 = vgs3 - p.vthp;
  const wl1 = (2 * id) / (p.kpn * vov1 * vov1);
  const wl3 = (2 * id) / (p.kpp * vov3 * vov3);
  const gm1 = (2 * id) / vov1;
  const ro2 = 1 / (p.lambdan * id), ro4 = 1 / (p.lambdap * id);
  const rout = par(ro2, ro4);
  const av = gm1 * rout;
  const outMax = p.vdd - vov3;
  const outMin = vov5 + vov1;
  const swing = outMax - outMin;
  const f3 = 1 / (2 * Math.PI * rout * cl);
  const fb = gm1 / (2 * Math.PI * cl);
  return {
    id: 'bank-exam-q1',
    source: 'Mid-sem exam Q1 (= Quiz 1 Part C)',
    tags: ['U11', 'U12', 'L2'],
    title: 'Exam Q1: five-transistor OTA (a–e)',
    statement: 'I1 = 120 µA into diode M6; (W/L)5 = (W/L)6 = 30; Vin,CM,min = 0.75 V, Vin,CM,max = 1.45 V. M1 = M2 and M3 = M4. µnCox = 200 µA/V², µpCox = 100 µA/V², Vthn = 0.4 V, Vthp = −0.5 V, VDD = 1.8 V, λn = 0.05 V⁻¹, λp = 0.1 V⁻¹. (a) Sizes of M1 and M3. (b) The gain. (c) The maximum output swing. (d) The −3 dB bandwidth with CL = 4 pF. (e) The bandwidth when the output is shorted to Vin2 (buffer), CL = 4 pF.',
    figure: { kind: 'fiveT', props: { proc: SET_B, iss: iRef, wl12: design.wl12, wl34: design.wl34, wlTail: QUIZ1_C.wlTail, vinCm: 1.1, bias: true, cl } },
    givens: [
      { sym: 'I_1', value: iRef, unit: 'A' },
      { sym: '(W/L)_{5,6}', value: QUIZ1_C.wlTail, unit: '' },
      { sym: 'V_{in,CM,min}', value: QUIZ1_C.vinCmMin, unit: 'V' },
      { sym: 'V_{in,CM,max}', value: QUIZ1_C.vinCmMax, unit: 'V' },
      { sym: 'C_L', value: cl, unit: 'F' },
    ],
    unknowns: [
      { key: 'wl1', sym: '(W/L)_1', label: '(a) Size of M1, M2', unit: '' },
      { key: 'wl3', sym: '(W/L)_3', label: '(a) Size of M3, M4', unit: '' },
      { key: 'av', sym: 'A_v', label: '(b) Gain', unit: 'V/V' },
      { key: 'swing', sym: 'V_{swing}', label: '(c) Maximum output swing', unit: 'V' },
      { key: 'f3', sym: 'f_{-3dB}', label: '(d) Bandwidth', unit: 'Hz' },
      { key: 'fb', sym: 'f_{buffer}', label: '(e) Buffer bandwidth', unit: 'Hz' },
    ],
    answers: { wl1: design.wl12, wl3: design.wl34, av: ota.av, swing: ota.swing, f3: ota.f3dB!, fb: ota.bufferF3dB! },
    wrong: {
      wl1: [{ mistake: 'issNotHalf', value: wlFromId(iRef, p.kpn, vov1) }],
      wl3: [{ mistake: 'diodeThreshold', value: wlFromId(id, p.kpp, vgs3) }],
      av: [{ mistake: 'roNotHalf', value: gm1 * ro2 }],
      f3: [{ mistake: 'forgot2pi', value: 1 / (rout * cl) }],
      fb: [{ mistake: 'forgot2pi', value: gm1 / cl }, { mistake: 'aInsteadOfInvBeta', value: f3 }],
    },
    steps: [
      { tag: 'A', title: 'M5 copies I1 (same size as M6): ISS = 120 µA, ID = 60 µA per side', tex: `V_{ov5} = \\sqrt{\\frac{2(120\\mu)}{200\\mu \\times 30}} = ${texSI(vov5, 'V')}`, highlight: ['m5', 'm6'] },
      { tag: 'A', title: '(a) Floor 0.75 V = Vov5 + VGS1', tex: `V_{ov1} = 0.75 - ${texNum(vov5, 3)} - 0.4 = ${texSI(vov1, 'V')},\\; \\left(\\tfrac{W}{L}\\right)_1 = \\frac{2(60\\mu)}{200\\mu\\, V_{ov1}^2} = ${texNum(wl1, 4)}`, produces: 'wl1', value: wl1, highlight: ['m1'] },
      { tag: 'A', title: '(a) Ceiling 1.45 V = VDD − |VGS3| + Vthn', tex: `|V_{GS3}| = 1.8 - 1.45 + 0.4 = ${texSI(vgs3, 'V')},\\; |V_{ov3}| = ${texSI(vov3, 'V')},\\; \\left(\\tfrac{W}{L}\\right)_3 = ${texNum(wl3, 4)}`, produces: 'wl3', value: wl3, highlight: ['m3'] },
      { tag: 'D', title: '(b) Av = gm1 (rO2 ‖ rO4)', tex: `g_{m1} = \\frac{2(60\\mu)}{${texNum(vov1, 3)}} = ${texSI(gm1, 'S')},\\; r_{O2} = ${texSI(ro2, 'Ω')},\\; r_{O4} = ${texSI(ro4, 'Ω')},\\; A_v = ${texNum(av)}`, produces: 'av', value: av, highlight: ['out'] },
      { tag: '✓', title: '(c) Ceiling VDD − |Vov4|, floor Vov5 + Vov2 (input CM at its minimum)', tex: `${texSI(outMax, 'V')} - ${texSI(outMin, 'V')} = ${texSI(swing, 'V')}`, produces: 'swing', value: swing },
      { tag: '·', title: '(d) One pole at the output node', tex: `f_{-3dB} = \\frac{1}{2\\pi R_{out} C_L} = \\frac{1}{2\\pi(${texSI(rout, 'Ω')})(4\\,\\mathrm{pF})} = ${texSI(f3, 'Hz')}`, produces: 'f3', value: f3 },
      { tag: '·', title: '(e) Buffer: Rout drops to ≈ 1/gm2, the pole jumps to gm/CL', tex: `f_{buffer} \\approx \\frac{g_{m}}{2\\pi C_L} = ${texSI(fb, 'Hz')}`, produces: 'fb', value: fb },
    ],
    hints: [
      'Part (a) is the CM-range formulas run backwards.',
      'Floor: Vov5 + VGS1. Ceiling: VDD − |VGS3| + Vthn. Then W/L from the square law with ID = 60 µA.',
      'Av = gm1(rO2 ‖ rO4); swing = (VDD − |Vov4|) − (Vov5 + Vov2); f = 1/(2πRC); buffer f ≈ gm/(2πCL).',
      `Vov5 = ${(vov5 * 1000).toFixed(0)} mV.`,
    ],
    flags: [
      'The scanned exam cut off (W/L)5,6; your Quiz 1 Part C key confirms 30.',
      '(e) Your key accepts 31.95 MHz (1/gm2 ‖ rO4) and 32.19 MHz (f−3dB·(1 + A)); the fast 1/gm route gives 31.8 MHz. All are within 2%, so all are marked right.',
      `Extra (not asked): slew rate ISS/CL = ${(ota.slewRate! / 1e6).toFixed(0)} V/µs.`,
    ],
  };
}

export const M3_BANK: Problem[] = [t1q1(), t1q2(), t1q3(), t1q4(), t1q5(), exam()];
