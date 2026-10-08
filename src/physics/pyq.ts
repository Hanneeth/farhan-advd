/**
 * Past-year papers (2023-24, 2024-25, 2025-26 mid-sems and quizzes; the 2024-25 Tutorial 2 on stability).
 * Only questions inside the current handout (L1–L14, analog) are solved here. Each solver follows the
 * method of the official answer key; where the key slips, the test file says so and the problem carries a flag.
 */
import { gmFromId, gmFromIdVov, rO, vovFromId, wlFromId } from './device';
import { parallel } from './impedance';
import { gainCrossover, loopPhase, peakingFactor, pmFromPeaking } from './stability';

const deg = (r: number) => (r * 180) / Math.PI;
const rad = (d: number) => (d * Math.PI) / 180;

// ─── 2025-26 mid-sem ───────────────────────────────────────────────────────

/** Q1: gain-boosted cascode with a CS auxiliary M3 (Tutorial 4 Q1 with µnCox = 135 µA/V²). */
export function mid25Q1() {
  const vdd = 3, kpn = 135e-6, kpp = 40e-6, vthn = 0.7, ln = 0.1, lp = 0.2, wl = 200, wlP = 100;
  const i1 = 100e-6, i2 = 0.5e-3;
  const vov3 = vovFromId(i1, kpn, wl);
  const vx = vthn + vov3; // VX = VGS3
  const vov2 = vovFromId(i2, kpn, wl);
  const vp = vx + vthn + vov2; // VP = VX + VGS2 (gate of M2)
  const vovI2 = vovFromId(i2, kpp, wlP);
  const voutMax = vdd - vovI2;
  const voutMin = vx + vov2; // VGS3 + Vov2
  const gm1 = gmFromId(kpn, wl, i2), gm2 = gm1, gm3 = gmFromId(kpn, wl, i1);
  const ro1 = rO(ln, i2), ro2 = ro1, ro3 = rO(ln, i1), roI1 = rO(lp, i1), roI2 = rO(lp, i2);
  const a1 = gm3 * parallel(ro3, roI1);
  const rDown = a1 * gm2 * ro2 * ro1;
  const rUp = roI2;
  const av = -gm1 * parallel(rUp, rDown);
  return { vov3, vx, vov2, vp, vovI2, voutMax, voutMin, swing: voutMax - voutMin, gm1, gm3, ro1, ro3, roI1, roI2, a1, rDown, rUp, av };
}

/** Q2: design a Miller-compensated two-stage op amp (the Allen–Holberg procedure used in the key). */
export function mid25Q2() {
  const kpn = 300e-6, kpp = 60e-6, vth1max = 0.59, vth1min = 0.47, vth3max = 0.51, vdd = 1.8;
  const cl = 5e-12, sr = 50e6, gbw = 50e6, icmrPlus = 1.6, icmrMinus = 0.9;
  const cc = 0.22 * cl; // PM ≥ 60° with the RHP zero at 10·GB
  const i5 = sr * cc;
  const id1 = i5 / 2;
  const gm1 = 2 * Math.PI * gbw * cc;
  const wl1 = (gm1 * gm1) / (2 * kpn * id1);
  const wl3 = (2 * id1) / (kpp * (vdd - icmrPlus - vth3max + vth1min) ** 2);
  const vov5 = icmrMinus - Math.sqrt((2 * id1) / (kpn * wl1)) - vth1max;
  const wl5 = (2 * i5) / (kpn * vov5 * vov5);
  const gm7 = 10 * gm1; // RHP zero at 10·GB → gm7 (the second-stage PMOS) ≥ 10·gm1
  const vov3 = Math.sqrt((2 * id1) / (kpp * wl3));
  const wl7 = gm7 / (kpp * vov3); // VSG7 = VSG4: a perfect mirror
  const id7 = 0.5 * kpp * wl7 * vov3 * vov3;
  const wl8 = (wl5 * id7) / i5;
  return { cc, i5, id1, gm1, wl1, wl3, vov5, wl5, gm7, vov3, wl7, id7, wl8, iRef: i5 };
}

/** Q5(a): two poles, A0 = 1000, β = 1; PM for ωp2 = k·ωp1. Q5(b): PM from a 50% peak. */
export function mid25Q5(k: number) {
  const s = { a0: 1000, poles: [1e6, k * 1e6], beta: 1 };
  const fgx = gainCrossover(s)!;
  return { fgx, pm: 180 + loopPhase(s, fgx) };
}
export const mid25Q5b = () => pmFromPeaking(1.5);

// ─── 2024-25 mid-sem ───────────────────────────────────────────────────────

/** Q2: analyse a Miller two-stage op amp (PMOS input M1, M2; NMOS mirror M3, M4; NMOS CS M7, PMOS M8). */
export function mid24Q2() {
  const kpn = 100e-6, kpp = 50e-6, ln = 0.1, lp = 0.2, vthn = 0.4;
  const i1 = 10e-6, cc = 0.22e-12, cl = 1e-12;
  const i5 = i1 * (20 / 10); // M5 is twice M6
  const id1 = i5 / 2;
  const sr = i5 / cc;
  const gm1 = gmFromId(kpp, 10, id1);
  const gbw = gm1 / (2 * Math.PI * cc);
  const vgs4 = vthn + vovFromId(id1, kpn, 10);
  const id7 = id1 * (80 / 10); // VGS7 = VGS4, so currents scale with W/L
  const gm7 = kpn * 80 * (vgs4 - vthn);
  const ro2 = rO(lp, id1), ro4 = rO(ln, id1), ro7 = rO(ln, id7), ro8 = rO(lp, id7);
  const a1 = gm1 * parallel(ro2, ro4), a2 = gm7 * parallel(ro7, ro8);
  const a0 = a1 * a2;
  const bw = gbw / a0;
  const fp2 = gm7 / (2 * Math.PI * cl);
  const fz = gm7 / (2 * Math.PI * cc);
  const pm = 180 - deg(Math.atan(a0)) - deg(Math.atan(gbw / fp2)) - deg(Math.atan(gbw / fz));
  return { i5, sr, gm1, gbw, vgs4, id7, gm7, ro2, ro4, ro7, ro8, a1, a2, a0, bw, fp2, fz, pm };
}

/** Q3: PMOS-input mirror-loaded telescopic (cascode NMOS mirror M5–M8), and as a buffer. */
export function mid24Q3() {
  const iss = 50e-6, id = iss / 2, vovP = 0.2, vovN = 0.1, lp = 0.2, ln = 0.1, vthn = 0.4, vthp = 0.5, vb = 0.7;
  const gm2 = gmFromIdVov(id, vovP), gm4 = gm2, gm6 = gmFromIdVov(id, vovN);
  const ro2 = rO(lp, id), ro4 = ro2, ro6 = rO(ln, id), ro8 = ro6;
  const rUp = gm4 * ro4 * ro2, rDown = gm6 * ro6 * ro8;
  const av = gm2 * parallel(rUp, rDown);
  const voutMax = vb + vthp; // M4 at the edge
  const voutMin = vovN + vovN + vthn; // the diode stack costs one Vthn
  const bufMin = vb + (vthp + vovP) - vthp; // M2: VD2 = Vb + |VGS4| ≤ Vout + |Vthp|
  return { gm2, gm6, ro2, ro6, rUp, rDown, av, voutMax, voutMin, bufMin, bufMax: voutMax };
}

/** Q4: gain-boosted cascode, PMOS input M7 folded into NMOS cascode M4, PMOS cascode load M5, M6. */
export function mid24Q4() {
  const id = 10e-6, vovN = 0.1, vovP = 0.2, ln = 0.1, lp = 0.2, vthn = 0.4;
  const gm7 = gmFromIdVov(id, vovP), gm5 = gm7, gm4 = gmFromIdVov(id, vovN), gm2 = gm4;
  const ro5 = rO(lp, id), ro6 = ro5, ro7 = ro5, ro4 = rO(ln, id), ro2 = ro4, ro1 = ro4, ro3 = rO(ln, 2 * id);
  const rUpAux = gm5 * ro5 * ro6, rDownAux = gm4 * ro4 * parallel(ro3, ro7);
  const aAux = gm7 * parallel(rUpAux, rDownAux);
  const rout = aAux * gm2 * ro2 * ro1;
  const vb2Min = vovN + (vthn + vovN); // M3 saturated: Vb2 − VGS4 ≥ Vov3
  return { gm7, gm4, ro5, ro4, ro3, rUpAux, rDownAux, aAux, rout, vb2Min };
}

// ─── 2023-24 mid-sem ───────────────────────────────────────────────────────

/** Q3: design a high-swing PMOS-input telescopic (M1–M4, M9 PMOS of one size; M5–M8 NMOS of one size). */
export function mid23Q3() {
  const kpn = 100e-6, kpp = 50e-6, vthn = 0.3, vthp = 0.4, ln = 0.1, lp = 0.2, vdd = 2, cl = 10e-12, sr = 5e6;
  const voutMax = 1.28, voutMin = 0.3;
  const iss = sr * cl, id = iss / 2;
  const vovN = voutMin / 2; // Vout,min = Vov8 + Vov6
  const wlN = wlFromId(id, kpn, vovN);
  // Vout,max = VDD − |Vov9| − |Vov2| − |Vov4|; same PMOS size, M9 carries 2ID → |Vov9| = √2·|Vov|
  const vovP = (vdd - voutMax) / (2 + Math.SQRT2);
  const vov9 = Math.SQRT2 * vovP;
  const wlP = wlFromId(id, kpp, vovP);
  const vb1Min = vovN + vthn + vovN; // M7 at its edge under cascode M5
  const vb2Max = vdd - vov9 - vovP - (vthp + vovP); // M2 at its edge
  const vb3 = vdd - (vthp + vov9);
  const gm2 = gmFromIdVov(id, vovP), gm6 = gmFromIdVov(id, vovN);
  const roP = rO(lp, id), roN = rO(ln, id);
  const av = gm2 * parallel(gm2 * roP * roP, gm6 * roN * roN);
  return { iss, id, vovN, wlN, vovP, vov9, wlP, vb1Min, vb2Max, vb3, gm2, gm6, roP, roN, av };
}

/** Q5: (a) K = |Aclosed(ωgx)|·β at PM 50°; (b) Cc/CL for PM 45° with the RHP zero at 10·GBW. */
export function mid23Q5() {
  const k = peakingFactor(50);
  const x = 45 - deg(Math.atan(0.1)); // phase left for the second pole
  const ccOverCl = 0.1 / Math.tan(rad(x)); // gm2 = 10 gm1 (zero at 10·GBW)
  return { k, x, ccOverCl };
}

// ─── Quizzes ───────────────────────────────────────────────────────────────

/** 2024-25 Quiz 1 Q1: five-transistor OTA. (W/L)1,2,5 = 15/1, (W/L)3,4 = 30/2, (W/L)6 = 7.5/1, I1 = 20 µA. */
export function quiz24Q1(i1 = 20e-6) {
  const kpn = 100e-6, kpp = 50e-6, vthn = 0.4, vthp = 0.5, vdd = 1.8;
  const ln = 0.1, lp = 0.2 / 2; // λ ∝ 1/L: M3, M4 have L = 2 µm
  const iss = i1 * (15 / 7.5), id = iss / 2;
  const gm1 = gmFromId(kpn, 15, id);
  const ro2 = rO(ln, id), ro4 = rO(lp, id);
  const av = gm1 * parallel(ro2, ro4);
  const vov3 = vovFromId(id, kpp, 15), vov2 = vovFromId(id, kpn, 15), vov5 = vovFromId(iss, kpn, 15);
  const voutMax = vdd - vov3, voutMin = vov5 + vov2;
  const vinCmMax = vdd - (vthp + vov3) + vthn;
  const vinCmMin = vov5 + vthn + vov2;
  const power = vdd * (i1 + iss);
  return { iss, id, gm1, ro2, ro4, av, vov3, vov2, vov5, voutMax, voutMin, swing: voutMax - voutMin, vinCmMax, vinCmMin, power };
}

/** 2024-25 Quiz 1 Q2: the same OTA sized for SR = 10 V/µs into 2 pF. */
export function quiz24Q2() {
  const cl = 2e-12, sr = 10e6;
  const iss = sr * cl, i1 = iss * (7.5 / 15);
  const r = quiz24Q1(i1);
  const rout = parallel(r.ro2, r.ro4);
  const bw = 1 / (2 * Math.PI * rout * cl);
  const gbw = r.gm1 / (2 * Math.PI * cl);
  return { iss, i1, rout, bw, gbw, power: r.power, gm1: r.gm1 };
}

/** 2024-25 Quiz 2 Q1: Miller two-stage from its Bode data (80 dB, 15.9 kHz, 740 MHz, zero 3.18 GHz, CL 5 pF). */
export function quiz24bQ1() {
  const a0 = 1e4, fp1 = 15.9e3, fp2 = 740e6, fz = 3.18e9, cl = 5e-12;
  const gbw = a0 * fp1;
  const pm = 180 - deg(Math.atan(a0)) - deg(Math.atan(gbw / fp2)) - deg(Math.atan(gbw / fz));
  const gm2 = 2 * Math.PI * fp2 * cl; // fp2 = gm2/(2πCL)
  const cc = gm2 / (2 * Math.PI * fz); // fz = gm2/(2πCc)
  return { gbw, pm, gm2, cc };
}

/**
 * 2024-25 Quiz 2 Q2 (and the CM-gain rule of 2024-25 mid-sem Q1): resistive-sensing CMFB.
 * Ad = 50 with equal λ: Ad = gm(rO ‖ rO) = 5/Vov1 → Vov1. Optimum VO,CM = middle of the output range;
 * Vin,CM runs from Vov5 + VGS1 to VO,CM + Vth1; the CM gain allowed for ±1% = 2·0.01·VO,CM / (that range).
 */
export function quiz24bQ2() {
  const ad = 50, lambda = 0.2, vthn = 0.4, vdd = 1.8;
  const vov1 = 1 / (lambda * ad); // Ad = (2ID/Vov1)·1/(2λID) = 1/(λ·Vov1)
  const vov5 = 2 * vov1, vov3 = 3 * vov1;
  const voutMax = vdd - vov3, voutMin = vov5 + vov1;
  const vref = (voutMax + voutMin) / 2;
  const vinCmMin = vov5 + vthn + vov1, vinCmMax = vref + vthn;
  const vinCm = (vinCmMin + vinCmMax) / 2;
  const acmReq = cmGainForTolerance(vref, 0.01, vinCmMax - vinCmMin);
  return { vov1, vov5, vov3, voutMax, voutMin, vref, vinCmMin, vinCmMax, vinCm, acmReq };
}

/** The course rule for "VO,CM may vary by ±x%": the output CM moves 2x·VO,CM over the whole input CM range. */
export function cmGainForTolerance(vocm: number, tol: number, vinCmRange: number): number {
  return (2 * tol * vocm) / vinCmRange;
}

/** 2023-24 Quiz 1 Q2: NMOS-input folded cascode with |Vov| = 0.15 V, rO = 50 kΩ, gm = 1 mS, |Vth| = 0.3 V. */
export function quiz23Q2(dVb2 = 0, dVb1 = 0) {
  const vov = 0.15, ro = 50e3, gm = 1e-3, vth = 0.3, vdd = 3;
  const vinCmMin = vov + vth + vov; // tail + VGS1
  const vb1Min = vov + vth + vov; // M9 at its edge under cascode M7
  const vb2Max = vdd - vov - (vth + vov); // M5 at its edge under cascode M3
  const vb2 = vb2Max + dVb2, vb1 = vb1Min + dVb1;
  const vy = vb2 + vth + vov; // folding node = Vb2 + |VGS3|
  const vinCmMaxCalc = vy + vth; // M1 at its edge
  const vinCmMax = Math.min(vdd, vinCmMaxCalc);
  const voutMax = vb2 + vth, voutMin = vb1 - vth;
  const swing = 2 * (voutMax - voutMin);
  const rUp = gm * ro * parallel(ro, ro), rDown = gm * ro * ro;
  const av = gm * parallel(rUp, rDown);
  return { vinCmMin, vinCmMaxCalc, vinCmMax, vb1Min, vb2Max, voutMax, voutMin, swing, rUp, rDown, av };
}

// ─── 2024-25 Tutorial 2 (stability; Sedra-style questions set by the course) ──

/** Ex 1: one pole at 100 Hz, A0 = 1e5. Feedback moves the pole up by (1 + βA0). */
export function tut24Ex1(beta: number) {
  const a0 = 1e5, fp = 100;
  const factor = 1 + beta * a0;
  return { factor, fClosed: fp * factor };
}

/** Ex 2: A0 = 100, poles 1e4 and 1e6 rad/s. Closed-loop poles: s² + (ωp1 + ωp2)s + (1 + βA0)ωp1ωp2 = 0. */
export function tut24Ex2() {
  const a0 = 100, w1 = 1e4, w2 = 1e6;
  const fbCoincide = (w1 + w2) ** 2 / (4 * w1 * w2); // 1 + βA0 when the discriminant is 0
  const betaCoincide = (fbCoincide - 1) / a0;
  const fbFlat = (w1 + w2) ** 2 / (2 * w1 * w2); // Q = 1/√2
  const betaFlat = (fbFlat - 1) / a0;
  const gainFlat = a0 / fbFlat;
  return { betaCoincide, qCoincide: 0.5, betaFlat, gainFlat };
}

/** Ex 3: A0 = 1e5, fp = 10 Hz, closed-loop gain 100 (β = 0.01): where |Aβ| = 1, and the PM. */
export function tut24Ex3() {
  const a0 = 1e5, fp = 10, beta = 0.01;
  const f1 = fp * Math.sqrt((beta * a0) ** 2 - 1);
  const pm = 180 - deg(Math.atan(f1 / fp));
  return { f1, pm };
}

/** Ex 4: closed-loop gain at ω1 relative to the DC gain: 1/(2 sin(PM/2)). */
export const tut24Ex4 = (pm: number) => peakingFactor(pm);

/** Ex 5–6: 100 dB, first pole 1 MHz, second 10 MHz; stable down to a closed-loop gain of 20 dB (β = 0.1). */
export function tut24Ex56() {
  const a0 = 1e5, fp1 = 1e6, fp2 = 10e6, beta = 0.1;
  const fD = fp1 / (beta * a0); // new dominant pole: loop gain falls to 1 at the old first pole
  const fp1New = fp2 / (beta * a0); // or lower the first pole until the loop gain is 1 at fp2
  return { fD, fp1New, capFactor: fp1 / fp1New };
}
