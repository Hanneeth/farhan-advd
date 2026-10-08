/**
 * Worked problems from the student's sources, solved only with the functions in this module.
 * These are the single source for every number the app shows for these problems; the regression
 * tests pin them to the values verified in the tutoring conversation, quiz keys and Razavi.
 *
 * Givens are written out in full so each solver doubles as a record of the problem statement.
 */
import {
  biasFromCurrent,
  biasFromOverdrive,
  earlyVoltage,
  gmFromIdVov,
  idSat,
  intrinsicGain,
  overdrive,
  rO,
  rOFromVA,
  rOTriode,
  vovFromId,
  wlFromId,
} from './device';
import { parallel } from './impedance';
import { cmGain, cmStepToTriode, diffGain } from './diffpair';
import {
  betaDivider,
  gainError,
  minOpenLoopGain,
  minOpenLoopGainExact,
  requiredOmegaU,
  settlingTime,
  settlingTimeConstants,
  tauClosed,
  toHz,
} from './frequency';
import {
  fiveTDesignFromCmLimits,
  fiveTransistorOta,
  foldedCascodePmosInput,
  fullyDifferentialSimple,
  telescopic,
  telescopicMirrorLoaded,
  unityGainWindow,
} from './opamps';
import { csResistive, diodeLoadGainFromSizes } from './stages';
import { EX_9_7, SET_A, SET_B, type Process } from './process';
import { triodeSenseVp, triodeSenseWl } from './cmfb';

// ─── Part 1 worked examples (foundations) ──────────────────────────────────

/** WE1: VDD 1.8, VG 0.7, Vth 0.4, µnCox 200µ, W/L 10, RD 10k, λ 0.1 — full analysis of a CS stage. */
export function part1WE1() {
  const vdd = 1.8, vg = 0.7, vth = 0.4, kp = 200e-6, wl = 10, rd = 10e3, lambda = 0.1;
  const vov = overdrive(vg, vth);
  const id = idSat(kp, wl, vov);
  const vd = vdd - id * rd;
  const gm = gmFromIdVov(id, vov);
  const ro = rO(lambda, id);
  return {
    vov,
    id,
    vd,
    saturated: vd >= vg - vth,
    gm,
    rO: ro,
    gmrO: gm * ro,
    av: csResistive({ gm, rd, rO: ro }),
    avNoRo: csResistive({ gm, rd }),
  };
}

/**
 * WE2 (design direction). The original statement did not survive the export; these givens are the
 * ones that reproduce the verified answers (W/L 22.2, VG 0.5 V, RD 9 kΩ) and are flagged in the inventory:
 * VDD 1.8 V, ID 100 µA, Vov 0.15 V, Vth 0.35 V, µnCox 400 µA/V², target VD = 0.9 V.
 */
export function part1WE2() {
  const vdd = 1.8, id = 100e-6, vov = 0.15, vth = 0.35, kp = 400e-6, vdTarget = 0.9;
  return { wl: wlFromId(id, kp, vov), vg: vth + vov, rd: (vdd - vdTarget) / id };
}

/** WE3 (PMOS): VS 1.8, VG 0.9, |Vth| 0.5, µpCox 100µ, W/L 20, RD 5k to ground. */
export function part1WE3() {
  const vs = 1.8, vg = 0.9, vth = 0.5, kp = 100e-6, wl = 20, rd = 5e3;
  const vov = overdrive(vs - vg, vth);
  const id = idSat(kp, wl, vov);
  const vd = id * rd;
  return { vov, id, vd, saturated: vd <= vg + vth };
}

// ─── Tutorial 1 (Sedra–Smith-style differential pairs) ─────────────────────

/** T1 Q1: VDD +0.9, VSS −0.9, Vov 0.15 all, Vtn 0.35, µnCox 400µ, λ = 0, Iref 0.1 mA, tail 0.2 mA, VD1,2 = 0. */
export function tut1Q1() {
  const vdd = 0.9, vss = -0.9, vov = 0.15, vtn = 0.35, kp = 400e-6, iref = 0.1e-3, itail = 0.2e-3;
  const id12 = itail / 2;
  const vgs = vtn + vov;
  const vd1 = 0;
  const vd4 = vss + vgs; // Q4 diode-connected: VD4 = VG4
  return {
    rd: (vdd - vd1) / id12,
    wl12: wlFromId(id12, kp, vov),
    wl3: wlFromId(itail, kp, vov),
    wl4: wlFromId(iref, kp, vov),
    r: (vdd - vd4) / iref,
    cmirMin: vss + vov + vgs,
    cmirMax: vd1 + vtn,
  };
}

/** T1 Q2: diode-loaded pair, µn = 4µp, equal L, Ad = 10 → W1,2/W3,4. */
export function tut1Q2(ad = 10, muRatio = 4) {
  // Ad = √(µn W1 / (µp W3)) ⇒ W1/W3 = Ad²/(µn/µp)
  const ratio = (ad * ad) / muRatio;
  return { ratio, check: diodeLoadGainFromSizes(muRatio, ratio, 1, 1) };
}

/** T1 Q3: µnCox = 4µpCox = 400µ, |V'A| 10 V/µm, L = 2×0.18 µm, I 200 µA, |Vov| 0.2. */
export function tut1Q3() {
  const kpn = 400e-6, kpp = 100e-6, id = 100e-6, vov = 0.2;
  const va = earlyVoltage(10 / 1e-6, 0.36e-6);
  const ro = rOFromVA(va, id);
  const gm = gmFromIdVov(id, vov);
  return { wl12: wlFromId(id, kpn, vov), wl34: wlFromId(id, kpp, vov), va, rO: ro, gm, ad: gm * parallel(ro, ro) };
}

/** T1 Q4: VDD 5, RSS 1k sets 1 mA, k'n W/L 2.5 mA/V², Vt 0.7, λ = 0, Ad = 8. */
export function tut1Q4() {
  const vdd = 5, rss = 1e3, iss = 1e-3, k = 2.5e-3, vt = 0.7, adTarget = 8;
  const id = iss / 2;
  const vp = iss * rss;
  const vov = vovFromId(id, k, 1);
  const vcm = vp + vt + vov;
  const gm = gmFromIdVov(id, vov);
  const rd = adTarget / gm;
  const vd = vdd - id * rd;
  const acm = cmGain({ gm, rd, rss });
  return { vov, vcm, gm, rd, vd, acm, dvcm: cmStepToTriode({ vd, vcm, vth: vt, acm }) };
}

/** T1 Q5: mirror-loaded pair, k'W/L 4 mA/V², |VA| 5 V, Ad 20 → I. Ad = √(2k ID)·(VA/2)/ID. */
export function tut1Q5(ad = 20, k = 4e-3, va = 5) {
  const id = (2 * k * (va / 2) ** 2) / (ad * ad);
  const gm = gmFromIdVov(id, vovFromId(id, k, 1));
  const ro = rOFromVA(va, id);
  return { id, i: 2 * id, gm, rO: ro, check: gm * parallel(ro, ro) };
}

// ─── 5-T OTA: the exam question = Quiz 1 (Part C), plus Parts A and B ──────

export interface OtaCmDesign {
  iRef: number;
  wlTail: number; // (W/L)5 = (W/L)6, 1:1 mirror
  vinCmMin: number;
  vinCmMax: number;
  cl: number;
}

export const QUIZ1_A: OtaCmDesign = { iRef: 160e-6, wlTail: 40, vinCmMin: 0.7, vinCmMax: 1.55, cl: 3e-12 };
export const QUIZ1_B: OtaCmDesign = { iRef: 200e-6, wlTail: 32, vinCmMin: 0.8, vinCmMax: 1.5, cl: 2e-12 };
/** The exam question. The scan cut off (W/L)5,6; the Quiz 1 Part C key confirms 30. */
export const QUIZ1_C: OtaCmDesign = { iRef: 120e-6, wlTail: 30, vinCmMin: 0.75, vinCmMax: 1.45, cl: 4e-12 };

export function fiveTOtaQuiz(d: OtaCmDesign, proc: Process = SET_B) {
  const iss = d.iRef; // M5 mirrors M6 1:1
  const design = fiveTDesignFromCmLimits({ proc, iss, wlTail: d.wlTail, vinCmMin: d.vinCmMin, vinCmMax: d.vinCmMax });
  const ota = fiveTransistorOta({ proc, iss, wl12: design.wl12, wl34: design.wl34, viss: design.vov5, cl: d.cl });
  return { design, ota };
}

// ─── Razavi Examples 9.1, 9.2, 9.7 ─────────────────────────────────────────

/** Ex 9.1: closed-loop gain 10, error < 1%. */
export function ex91() {
  const aClosed = 10, eps = 0.01, beta = 1 / aClosed;
  return { exact: minOpenLoopGainExact(beta, eps), approx: minOpenLoopGain(aClosed, eps) };
}

/** Ex 9.2: gain 10 (β = 0.1), settle to 1% in 5 ns → ωu. */
export function ex92() {
  const omegaU = requiredOmegaU({ beta: 0.1, eps: 0.01, t: 5e-9 });
  return { omegaU, fu: toHz(omegaU), nTau: settlingTimeConstants(0.01) };
}

/** Ex 9.7: telescopic, VDD 3, 10 mW, 3 Vpp diff swing, gain 2000. ISS 3 mA; Vov9 0.5, |Vov5–8| 0.3, Vov1–4 0.2. */
export function ex97() {
  const proc = EX_9_7;
  const iss = 3e-3, id = iss / 2, vov9 = 0.5, vovP = 0.3, vovN = 0.2;
  const wlN = wlFromId(id, proc.kpn, vovN);
  const wlP = wlFromId(id, proc.kpp, vovP);
  const wl9 = wlFromId(iss, proc.kpn, vov9);
  const first = telescopic({ proc, iss, wlN, wlP, viss: vov9 });
  // Double W and L of M5–M8: W/L (so Vov, gm) unchanged, λp halves, rO5–8 double.
  const second = telescopic({ proc, iss, wlN, wlP, viss: vov9, lambdaP: proc.lambdap / 2 });
  return {
    wlN,
    wlP,
    wl9,
    av: first.av,
    avLengthened: second.av,
    vinCm: first.bias.vinCm,
    vb1: first.bias.vb1,
    vb2: first.bias.vb2,
    voutMin: first.voutMin,
    voutMax: first.voutMax,
  };
}

// ─── Problem Set 1 (from the conversation) ─────────────────────────────────

export function ps1P1() {
  const proc = SET_B, iss = 200e-6;
  const viss = vovFromId(iss, proc.kpn, 20);
  return fiveTransistorOta({ proc, iss, wl12: 40, wl34: 25, viss, cl: 2e-12 });
}

export function ps1P2() {
  const p1 = ps1P1();
  const beta = 1 / 5;
  const eps = gainError(p1.av, beta);
  const tau = tauClosed(beta, p1.omegaU!);
  return { eps, aMin: minOpenLoopGain(5, 0.005), tau, t: settlingTime(tau, 0.001) };
}

export function ps1P3() {
  return telescopic({ proc: SET_A, iss: 1e-3, wlN: 100, wlP: 200, viss: 0.4 });
}

export function ps1P4() {
  const p3 = ps1P3();
  const vinCmNew = 1.6;
  const dVb1 = vinCmNew - p3.bias.vinCm;
  return { vx: p3.bias.vb1 - p3.n.vgs, dVb1, vb1New: p3.bias.vb1 + dVb1, dSwing: -2 * dVb1 };
}

export function ps1P5() {
  return telescopicMirrorLoaded({ proc: SET_A, iss: 1e-3, wlN: 200, wlP: 200, vb1: 1.6 });
}

/** P6: folded cascode, Set A, 2.0 V diff swing, 4.5 mW: ISS 0.75 mA, I 0.375 mA, four overdrives 0.5 V, |Vov1| 0.3. */
export function ps1P6() {
  const proc = SET_A;
  const power = 4.5e-3;
  const itot = power / proc.vdd;
  const iss = itot / 2;
  const i = iss / 2;
  const vovEach = (proc.vdd - 2.0 / 2) / 4;
  return foldedCascodePmosInput({
    proc,
    iss,
    i,
    vov1: 0.3,
    vovNcas: vovEach,
    vovNsrc: vovEach,
    vovPcas: vovEach,
    vovPsrc: vovEach,
    viss: 0.4,
    cl: 2e-12,
  });
}

/** P9: same ωu at 4× CL ⇒ α = 4. */
export function ps1P9() {
  const p6 = ps1P6();
  const alpha = 8e-12 / 2e-12;
  return { alpha, power: p6.power * alpha, wl12: p6.m1.wl * alpha };
}

/** P10: Set B folded cascode (PMOS input), unity-gain, 0.1% in 20 ns, CL 2 pF, swing 1.2 Vpp diff. */
export function ps1P10() {
  const proc = SET_B;
  const cl = 2e-12;
  const omegaU = requiredOmegaU({ beta: 1, eps: 0.001, t: 20e-9 });
  const gmReq = omegaU * cl;
  const vovEach = (proc.vdd - 1.2 / 2) / 4;
  const iss = 200e-6, i = 100e-6;
  const fc = foldedCascodePmosInput({
    proc,
    iss,
    i,
    vov1: (2 * (iss / 2)) / gmReq, // choose the input overdrive that delivers exactly gm,req
    vovNcas: vovEach,
    vovNsrc: vovEach,
    vovPcas: vovEach,
    vovPsrc: vovEach,
  });
  return { gmReq, vovEach, rout: fc.rout, av: fc.av, power: proc.vdd * (iss + 2 * i) };
}

// ─── Tutorial 2 = Razavi 9.1–9.3 (Set A) ───────────────────────────────────

/** 9.1(b): Fig. 9.6(b), (W/L)1–4 = 50/0.5, ISS 1 mA, Vin,CM 1.3 V.  (c): PMOS 50 mV into triode. */
export function tut2Q1() {
  const proc = SET_A;
  const fd = fullyDifferentialSimple({ proc, iss: 1e-3, wl12: 100, wl34: 100, viss: 0, vinCm: 1.3 });
  // (c) At the positive peak one PMOS load has |VDS| = |Vov3| − 50 mV (triode). Its drain resistance is
  // 1/(µpCox (W/L)(|Vov3| − |VDS|)); the other half is still rO2 ‖ rO4. Differential gain = average of the halves.
  const rTri = rOTriode(proc.kpp, 100, fd.p.vov, fd.p.vov - 0.05);
  const halfTriode = fd.n.gm * parallel(fd.n.rO, rTri);
  const halfSat = fd.n.gm * parallel(fd.n.rO, fd.p.rO);
  return {
    av: fd.av,
    voutMin: fd.voutMin,
    voutMax: fd.voutMax,
    singleEndedSwing: fd.singleEndedSwing,
    diffSwing: fd.diffSwing,
    peak: { rTriode: rTri, halfTriode, avAtPeak: (halfTriode + halfSat) / 2 },
  };
}

/** 9.2: Fig. 9.9, (W/L)1–4 = 100/0.5, ISS 1 mA, Vb 1.4 V; M5–M8 identical, L = 0.5 µm. */
export function tut2Q2() {
  const proc = SET_A;
  const iss = 1e-3, id = iss / 2, vb = 1.4, wlN = 200, l = 0.5e-6;
  // (a) M3's drain sits at VDD − 2|VGS,p| (two diode drops). Fence: VD3 ≥ Vb − Vthn.
  const vgsPmax = (proc.vdd - (vb - proc.vthn)) / 2;
  const vovPmax = vgsPmax - proc.vthp;
  const wlP = wlFromId(id, proc.kpp, vovPmax);
  const t = telescopicMirrorLoaded({ proc, iss, wlN, wlP, vb1: vb });
  return {
    wlPmin: wlP,
    wMin: wlP * l,
    // (b) Output range from the cascode stacks alone, and with M2's gate on the output (buffer window).
    voutMinStack: t.voutMin,
    voutMaxStack: t.voutMax,
    buffer: t.buffer,
    av: t.av,
  };
}

/** 9.3: Fig. 9.15 folded cascode (PMOS input), 2.4 V diff swing, 6 mW, L 0.5 µm. ISS 1 mA, I 0.5 mA. */
export function tut2Q3() {
  const proc = SET_A;
  const itot = 6e-3 / proc.vdd;
  const iss = itot / 2;
  const i = iss / 2;
  const vovEach = (proc.vdd - 2.4 / 2) / 4;
  const fc = foldedCascodePmosInput({
    proc,
    iss,
    i,
    vov1: vovEach,
    vovNcas: vovEach,
    vovNsrc: vovEach,
    vovPcas: vovEach,
    vovPsrc: vovEach,
  });
  return { iss, i, vovEach, fc, canReachZero: fc.vinCmMin <= 0 };
}

// ─── Tutorial 3 = Razavi 9.4, 9.6, 9.8 (Set A) ─────────────────────────────

/** 9.4: Fig. 9.21(b), (W/L)1–8 = 100/0.5, ISS 1 mA, Vb1 1.7 V. M7,M8 gates tied to X. */
export function tut3Q1() {
  const proc = SET_A;
  const id = 0.5e-3, wl = 200, vb1 = 1.7;
  const n = biasFromCurrent({ id, kp: proc.kpn, wl, vth: proc.vthn, lambda: proc.lambdan });
  const pm = biasFromCurrent({ id, kp: proc.kpp, wl, vth: proc.vthp, lambda: proc.lambdap });
  const vinCmMax = vb1 - n.vgs + proc.vthn; // M1 fence against its drain Vb1 − VGS3
  const vx = proc.vdd - pm.vgs; // M7 is diode-connected through X
  const window = unityGainWindow({ vb1, vgs4: n.vgs, vth4: proc.vthn, vth2: proc.vthn });
  // (d) M5 saturated: VX ≤ Vb2 + |Vthp|.  M7 saturated: VS5 = Vb2 + |VGS5| ≤ VX + |Vthp|.
  const vb2Min = vx - proc.vthp;
  const vb2Max = vx + proc.vthp - pm.vgs;
  return { vinCmMax, vx, window, vb2Min, vb2Max };
}

/** 9.6: Fig. 9.23 two-stage, (W/L)1–8 = 100/0.5, ISS 1 mA, ID5 = ID6 = 1 mA. */
export function tut3Q2() {
  const proc = SET_A;
  const wl = 200;
  const m1 = biasFromCurrent({ id: 0.5e-3, kp: proc.kpn, wl, vth: proc.vthn, lambda: proc.lambdan });
  const m3 = biasFromCurrent({ id: 0.5e-3, kp: proc.kpp, wl, vth: proc.vthp, lambda: proc.lambdap });
  const m5 = biasFromCurrent({ id: 1e-3, kp: proc.kpp, wl, vth: proc.vthp, lambda: proc.lambdap });
  const m7 = biasFromCurrent({ id: 1e-3, kp: proc.kpn, wl, vth: proc.vthn, lambda: proc.lambdan });
  const vxy = proc.vdd - m5.vgs;
  const a1 = m1.gm * parallel(m1.rO, m3.rO);
  const a2 = m5.gm * parallel(m5.rO, m7.rO);
  const voutMax = proc.vdd - m5.vov;
  const voutMin = m7.vov;
  return { vxy, vinCmMax: vxy + proc.vthn, a1, a2, av: a1 * a2, voutMin, voutMax, diffSwing: 2 * (voutMax - voutMin) };
}

/** 9.8: Fig. 9.24, ISS 1 mA, ID9–12 0.5 mA, (W/L)9–12 = 100/0.5, VISS 0.4 V, 200 mVpp at X, Y. */
export function tut3Q3() {
  const proc = SET_A;
  const id = 0.5e-3, wl912 = 200, viss = 0.4, swingPp = 0.2;
  const m9 = biasFromCurrent({ id, kp: proc.kpp, wl: wl912, vth: proc.vthp, lambda: proc.lambdap });
  const m11 = biasFromCurrent({ id, kp: proc.kpn, wl: wl912, vth: proc.vthn, lambda: proc.lambdan });
  const vxy = proc.vdd - m9.vgs;
  // (b) Largest overdrives (smallest devices) that keep M1–M8 saturated over X ± 0.1 V, split equally.
  const vovN = (vxy - swingPp / 2 - viss) / 2;
  const vovP = (proc.vdd - (vxy + swingPp / 2)) / 2;
  const n = biasFromOverdrive({ id, kp: proc.kpn, vov: vovN, vth: proc.vthn, lambda: proc.lambdan });
  const p = biasFromOverdrive({ id, kp: proc.kpp, vov: vovP, vth: proc.vthp, lambda: proc.lambdap });
  const rDown = n.gm * n.rO * n.rO;
  const rUp = p.gm * p.rO * p.rO;
  const a1 = n.gm * parallel(rDown, rUp);
  const a2 = m9.gm * parallel(m9.rO, m11.rO);
  return { vxy, vovN, vovP, wlN: n.wl, wlP: p.wl, a1, a2, av: a1 * a2 };
}

// ─── Quiz 2: triode-sensing CMFB on a telescopic (Parts A–C) ───────────────

export interface Quiz2Part {
  vdd: number;
  kpn: number;
  kpp: number;
  vthn: number;
  vthp: number;
  lambdan: number;
  wlP34: number;
  id3: number;
  wlN: number; // (W/L)10 and cascode/source NMOS
  idN: number;
  vb1: number;
  cmFraction: number; // Vout,CM = cmFraction × VDD
}

export const QUIZ2_A: Quiz2Part = { vdd: 1.8, kpn: 200e-6, kpp: 100e-6, vthn: 0.4, vthp: 0.5, lambdan: 0.1, wlP34: 50, id3: 50e-6, wlN: 50, idN: 40e-6, vb1: 0.6, cmFraction: 0.5 };
export const QUIZ2_B: Quiz2Part = { vdd: 1.8, kpn: 150e-6, kpp: 80e-6, vthn: 0.4, vthp: 0.5, lambdan: 0.1, wlP34: 40, id3: 80e-6, wlN: 40, idN: 50e-6, vb1: 0.6, cmFraction: 0.6 };
export const QUIZ2_C: Quiz2Part = { vdd: 1.8, kpn: 120e-6, kpp: 60e-6, vthn: 0.3, vthp: 0.45, lambdan: 0.1, wlP34: 60, id3: 120e-6, wlN: 60, idN: 60e-6, vb1: 0.55, cmFraction: 0.4 };

export function quiz2(q: Quiz2Part) {
  const vov34 = vovFromId(q.id3, q.kpp, q.wlP34);
  const vd4 = q.vdd - (vov34 + q.vthp);
  const vov10 = vovFromId(q.idN, q.kpn, q.wlN);
  const vp = q.vb1 - (q.vthn + vov10);
  const voutSum = 2 * q.cmFraction * q.vdd;
  const wl1112 = triodeSenseWl({ id: q.idN, kpn: q.kpn, vp, voutSum, vthn: q.vthn });
  const gm7 = gmFromIdVov(q.idN, vov10);
  const ro = rO(q.lambdan, q.idN);
  return {
    vov34,
    vd4,
    vov10,
    vp,
    voutSum,
    wl1112,
    vpCheck: triodeSenseVp({ id: q.idN, kpn: q.kpn, wl: wl1112, voutSum, vthn: q.vthn }),
    voutMin: vp + 2 * vov10,
    routDown: gm7 * ro * ro,
  };
}

// ─── Small helpers exposed for lessons ─────────────────────────────────────

export function feedbackDivider(r1: number, r2: number, a: number) {
  const beta = betaDivider(r1, r2);
  return { beta, ideal: 1 / beta, eps: gainError(a, beta) };
}

export { diffGain, intrinsicGain };
