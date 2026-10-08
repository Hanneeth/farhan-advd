/**
 * One-stage op amps (Razavi §9.2): five-transistor OTA, fully differential current-source-loaded pair,
 * telescopic cascode (differential and mirror-loaded), unity-gain buffer window, folded cascode,
 * design helpers and linear scaling.
 */
import { biasFromCurrent, gmFromIdVov, rO, vovFromId, wlFromId } from './device';
import { currentDivider, parallel } from './impedance';
import { gbwOneStage, pole, routClosed, toHz } from './frequency';
import type { Process } from './process';

// ─── Five-transistor OTA ────────────────────────────────────────────────────

export interface FiveTInput {
  proc: Process;
  iss: number;
  wl12: number;
  wl34: number;
  /** Headroom the tail source needs. For a transistor tail pass its Vov (see tailVov()). */
  viss: number;
  cl?: number;
}

export interface FiveTResult {
  id: number;
  vov1: number;
  vgs1: number;
  vov3: number; // |Vov3|
  vgs3: number; // |VGS3|
  gm1: number;
  rO2: number;
  rO4: number;
  rout: number;
  av: number;
  vinCmMin: number;
  vinCmMax: number;
  voutMax: number;
  /** Lowest output, reached when Vin,CM sits at its minimum: VISS + Vov2. */
  voutMin: number;
  swing: number;
  omegaP?: number;
  f3dB?: number;
  omegaU?: number;
  /** Buffer (β = 1): Rout → 1/gm2 (the lecture's approximation). */
  bufferRout: number;
  /** Buffer, exact: Rout/(1 + Aopen). */
  bufferRoutExact: number;
  bufferF3dB?: number;
  bufferF3dBExact?: number;
  slewRate?: number;
}

/** Tail-device overdrive from its current and size. */
export function tailVov(iss: number, kpn: number, wlTail: number): number {
  return vovFromId(iss, kpn, wlTail);
}

export function fiveTransistorOta(p: FiveTInput): FiveTResult {
  const { proc } = p;
  const id = p.iss / 2;
  const n = biasFromCurrent({ id, kp: proc.kpn, wl: p.wl12, vth: proc.vthn, lambda: proc.lambdan });
  const pm = biasFromCurrent({ id, kp: proc.kpp, wl: p.wl34, vth: proc.vthp, lambda: proc.lambdap });
  const rout = parallel(n.rO, pm.rO);
  const av = n.gm * rout;
  const vinCmMin = p.viss + n.vgs;
  const vinCmMax = proc.vdd - pm.vgs + proc.vthn;
  const voutMax = proc.vdd - pm.vov;
  const voutMin = p.viss + n.vov;
  const bufferRout = 1 / n.gm;
  const bufferRoutExact = routClosed(rout, av, 1);
  const r: FiveTResult = {
    id,
    vov1: n.vov,
    vgs1: n.vgs,
    vov3: pm.vov,
    vgs3: pm.vgs,
    gm1: n.gm,
    rO2: n.rO,
    rO4: pm.rO,
    rout,
    av,
    vinCmMin,
    vinCmMax,
    voutMax,
    voutMin,
    swing: voutMax - voutMin,
    bufferRout,
    bufferRoutExact,
  };
  if (p.cl) {
    r.omegaP = pole(rout, p.cl);
    r.f3dB = toHz(r.omegaP);
    r.omegaU = gbwOneStage(n.gm, p.cl);
    r.bufferF3dB = toHz(pole(bufferRout, p.cl));
    r.bufferF3dBExact = toHz(pole(bufferRoutExact, p.cl));
    r.slewRate = p.iss / p.cl;
  }
  return r;
}

/**
 * Design direction used by the exam / Quiz 1: the CM limits are given, run them backwards.
 *   Vin,CM,min = Vov5 + VGS1  → VGS1 → (W/L)1,2
 *   Vin,CM,max = VDD − |VGS3| + Vthn → |VGS3| → (W/L)3,4
 */
export function fiveTDesignFromCmLimits(p: {
  proc: Process;
  iss: number;
  wlTail: number;
  vinCmMin: number;
  vinCmMax: number;
}): { vov5: number; vgs1: number; vov1: number; wl12: number; vgs3: number; vov3: number; wl34: number } {
  const { proc } = p;
  const id = p.iss / 2;
  const vov5 = tailVov(p.iss, proc.kpn, p.wlTail);
  const vgs1 = p.vinCmMin - vov5;
  const vov1 = vgs1 - proc.vthn;
  const vgs3 = proc.vdd - p.vinCmMax + proc.vthn;
  const vov3 = vgs3 - proc.vthp;
  return {
    vov5,
    vgs1,
    vov1,
    wl12: wlFromId(id, proc.kpn, vov1),
    vgs3,
    vov3,
    wl34: wlFromId(id, proc.kpp, vov3),
  };
}

// ─── Fully differential pair with current-source loads (Fig. 9.6b) ─────────

export function fullyDifferentialSimple(p: { proc: Process; iss: number; wl12: number; wl34: number; viss: number; vinCm?: number }) {
  const { proc } = p;
  const id = p.iss / 2;
  const n = biasFromCurrent({ id, kp: proc.kpn, wl: p.wl12, vth: proc.vthn, lambda: proc.lambdan });
  const pm = biasFromCurrent({ id, kp: proc.kpp, wl: p.wl34, vth: proc.vthp, lambda: proc.lambdap });
  const av = n.gm * parallel(n.rO, pm.rO);
  const voutMax = proc.vdd - pm.vov;
  // Output floor tracks the input CM: Vin,CM − Vth1, lowest possible VISS + Vov1.
  const voutMin = p.vinCm !== undefined ? p.vinCm - proc.vthn : p.viss + n.vov;
  return {
    n,
    p: pm,
    av,
    voutMax,
    voutMin,
    singleEndedSwing: voutMax - voutMin,
    diffSwing: 2 * (voutMax - voutMin),
    vinCmMin: p.viss + n.vgs,
    vinCmMax: proc.vdd - pm.vov + proc.vthn,
  };
}

// ─── Telescopic cascode ─────────────────────────────────────────────────────

export interface TelescopicInput {
  proc: Process;
  iss: number;
  /** W/L of input devices M1,2 and NMOS cascodes M3,4 */
  wlN: number;
  /** W/L of PMOS cascodes and PMOS current sources */
  wlP: number;
  viss: number;
  /** Optional separate λp (e.g. after lengthening the PMOS devices). */
  lambdaP?: number;
}

/**
 * Fully differential telescopic (Razavi Fig. 9.8 / Ex 9.7 numbering: M1,2 input, M3,4 NMOS cascode,
 * M5,6 PMOS cascode, M7,8 PMOS source). Uses the notes' form Rdown = gm3 rO3 rO1, Rup = gm5 rO5 rO7.
 */
export function telescopic(p: TelescopicInput) {
  const { proc } = p;
  const id = p.iss / 2;
  const n = biasFromCurrent({ id, kp: proc.kpn, wl: p.wlN, vth: proc.vthn, lambda: proc.lambdan });
  const pm = biasFromCurrent({ id, kp: proc.kpp, wl: p.wlP, vth: proc.vthp, lambda: p.lambdaP ?? proc.lambdap });
  const rDown = n.gm * n.rO * n.rO;
  const rUp = pm.gm * pm.rO * pm.rO;
  const rout = parallel(rDown, rUp);
  const av = n.gm * rout;
  const voutMin = p.viss + 2 * n.vov;
  const voutMax = proc.vdd - 2 * pm.vov;
  // The three bias conditions under which the full swing is available.
  const vinCm = n.vgs + p.viss;
  const vb1 = n.vgs + (vinCm - proc.vthn);
  const vb2 = proc.vdd - pm.vov - pm.vgs;
  return {
    n,
    p: pm,
    rDown,
    rUp,
    rout,
    av,
    voutMin,
    voutMax,
    diffSwing: 2 * (voutMax - voutMin),
    bias: { vinCm, vb1, vb2 },
  };
}

/**
 * Single-ended telescopic with a (diode-biased) cascode PMOS mirror (Razavi Fig. 9.9).
 * The diode stack pins the PMOS cascode gate a threshold too low:
 *   Vout,max = VDD − |Vthp| − |Vov8| − |Vov6|,   Vout,min = Vb1 − Vth4.
 */
export function telescopicMirrorLoaded(p: { proc: Process; iss: number; wlN: number; wlP: number; vb1: number }) {
  const { proc } = p;
  const id = p.iss / 2;
  const n = biasFromCurrent({ id, kp: proc.kpn, wl: p.wlN, vth: proc.vthn, lambda: proc.lambdan });
  const pm = biasFromCurrent({ id, kp: proc.kpp, wl: p.wlP, vth: proc.vthp, lambda: proc.lambdap });
  const vx = p.vb1 - n.vgs;
  const voutMin = p.vb1 - proc.vthn;
  const voutMax = proc.vdd - proc.vthp - 2 * pm.vov;
  const rDown = n.gm * n.rO * n.rO;
  const rUp = pm.gm * pm.rO * pm.rO;
  const av = n.gm * parallel(rDown, rUp);
  const window = unityGainWindow({ vb1: p.vb1, vgs4: n.vgs, vth4: proc.vthn, vth2: proc.vthn });
  return { n, p: pm, vx, voutMin, voutMax, swing: voutMax - voutMin, rDown, rUp, av, buffer: window };
}

/**
 * Telescopic in unity-gain feedback (Razavi Fig. 9.9, Ex 9.5):
 *   Vb1 − Vth4 ≤ Vout ≤ Vb1 − VGS4 + Vth2,   width = Vth2 − Vov4.
 */
export function unityGainWindow(p: { vb1: number; vgs4: number; vth4: number; vth2: number }) {
  const lower = p.vb1 - p.vth4;
  const upper = p.vb1 - p.vgs4 + p.vth2;
  return { lower, upper, width: upper - lower };
}

/**
 * Razavi Ex 9.6 (your Lec 5): a telescopic op amp in closed loop through input capacitors, so Vin,CM = Vout,CM.
 * The drains X, Y must stay between Vb − Vth3,4 (M3, M4 saturated) and Vb − (VGS3,4 − Vth1,2) (M1, M2 saturated).
 * Put VCM at the TOP edge: X can then fall to Vb − Vth3,4, and rising is free (the input gates barely move), so the
 * symmetric swing per side is ±(Vth − Vov3,4) around VCM, i.e. 4(Vth − Vov) peak-to-peak differential.
 */
export function closedLoopCmChoice(p: { vb: number; vgs34: number; vth34: number; vth12: number }) {
  const vcm = p.vb - (p.vgs34 - p.vth12);
  const floor = p.vb - p.vth34;
  const peak = vcm - floor;
  return { vcm, floor, peak, ppSide: 2 * peak, ppDiff: 4 * peak };
}

// ─── Folded cascode (PMOS input, Razavi Fig. 9.15 numbering) ───────────────
// M1,2 PMOS input; M3,4 NMOS cascodes; M5,6 NMOS folding current sources (carry ISS/2 + I);
// M7,8 PMOS cascodes; M9,10 PMOS current sources (carry I).

export interface FoldedInput {
  proc: Process;
  iss: number;
  /** Current in each cascode branch */
  i: number;
  vov1: number; // |Vov1,2|
  vovNcas: number; // Vov3,4
  vovNsrc: number; // Vov5,6
  vovPcas: number; // |Vov7,8|
  vovPsrc: number; // |Vov9,10|
  /** Headroom of the tail source (from VDD). */
  viss?: number;
  cl?: number;
}

export function foldedCascodePmosInput(p: FoldedInput) {
  const { proc } = p;
  const idIn = p.iss / 2;
  const idSrc = idIn + p.i; // ISS1 = ISS/2 + I
  const m1 = { id: idIn, vov: p.vov1, wl: wlFromId(idIn, proc.kpp, p.vov1), gm: gmFromIdVov(idIn, p.vov1), rO: rO(proc.lambdap, idIn) };
  const m3 = { id: p.i, vov: p.vovNcas, wl: wlFromId(p.i, proc.kpn, p.vovNcas), gm: gmFromIdVov(p.i, p.vovNcas), rO: rO(proc.lambdan, p.i) };
  const m5 = { id: idSrc, vov: p.vovNsrc, wl: wlFromId(idSrc, proc.kpn, p.vovNsrc), gm: gmFromIdVov(idSrc, p.vovNsrc), rO: rO(proc.lambdan, idSrc) };
  const m7 = { id: p.i, vov: p.vovPcas, wl: wlFromId(p.i, proc.kpp, p.vovPcas), gm: gmFromIdVov(p.i, p.vovPcas), rO: rO(proc.lambdap, p.i) };
  const m9 = { id: p.i, vov: p.vovPsrc, wl: wlFromId(p.i, proc.kpp, p.vovPsrc), gm: gmFromIdVov(p.i, p.vovPsrc), rO: rO(proc.lambdap, p.i) };

  const rUp = m7.gm * m7.rO * m9.rO;
  const rDown = m3.gm * m3.rO * parallel(m1.rO, m5.rO);
  const rout = parallel(rUp, rDown);
  const gmApprox = m1.gm;
  // Exact Gm by the current divider at the folding node.
  const rIntoCascodeSource = parallel(1 / m3.gm, m3.rO);
  const fraction = currentDivider(1, rIntoCascodeSource, parallel(m1.rO, m5.rO));
  const gmExact = m1.gm * fraction;
  const voutMin = p.vovNcas + p.vovNsrc;
  const voutMax = proc.vdd - p.vovPcas - p.vovPsrc;
  const singleSwing = voutMax - voutMin;
  const res = {
    m1,
    m3,
    m5,
    m7,
    m9,
    idSrc,
    power: proc.vdd * (p.iss + 2 * p.i),
    rUp,
    rDown,
    rout,
    av: gmApprox * rout,
    gmExact,
    fraction,
    avExact: gmExact * rout,
    voutMin,
    voutMax,
    singleSwing,
    diffSwing: 2 * singleSwing,
    // Input CM range: M1 fence against the folding node (at its lowest, VX = Vov5) and the tail headroom.
    vinCmMin: p.vovNsrc - proc.vthp,
    vinCmMax: p.viss !== undefined ? proc.vdd - p.viss - (proc.vthp + p.vov1) : undefined,
    omegaU: p.cl ? gbwOneStage(m1.gm, p.cl) : undefined,
  };
  return res;
}

// ─── Design helpers ─────────────────────────────────────────────────────────

/** gm·rO ∝ √(WL/ID): doubling both W and L keeps W/L (and Vov, gm) and halves λ, doubling rO. */
export function lengthenKeepingWL(lambda: number, factor: number): number {
  return lambda / factor;
}

/**
 * Linear scaling (Razavi §9.2.3, Ex 9.8): widths and currents × α.
 * Overdrives, gain and swing unchanged; gm × α; rO ÷ α; power × α.
 */
export function linearScale(p: { alpha: number; power: number; wl: number; gm: number; rO: number }) {
  return { power: p.power * p.alpha, wl: p.wl * p.alpha, gm: p.gm * p.alpha, rO: p.rO / p.alpha };
}

/** Vb1 tracking device (Razavi Eq. 9.16): VGS,b1 = Vov1,2 + VGS3,4. */
export function vb1TrackingVgs(vov12: number, vgs34: number): number {
  return vov12 + vgs34;
}
