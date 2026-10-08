/**
 * Single-stage amplifiers (Razavi Ch. 3). Every gain is Av = −Gm·Rout, then the sign by inspection.
 * γ = 0 (gmb = 0) throughout, as the tutorials state.
 */
import { parallel, rIntoDrain, rIntoSource } from './impedance';

/** Razavi's lemma: Av = −Gm·Rout (inverting stages). */
export function avFromGmRout(gm: number, rout: number): number {
  return -gm * rout;
}

/** CS with resistor load: Av = −gm (RD ‖ rO). */
export function csResistive(p: { gm: number; rd: number; rO?: number }): number {
  return -p.gm * parallel(p.rd, p.rO ?? Infinity);
}

/** |Av| = 2·(DC drop across RD)/Vov — why resistor loads died. */
export function csGainFromDrop(vDrop: number, vov: number): number {
  return (2 * vDrop) / vov;
}

/** CS with diode-connected load: Av = −gm1 · (1/gm2 ‖ rO2 ‖ rO1). */
export function csDiodeLoad(p: { gm1: number; gm2: number; rO1?: number; rO2?: number }): number {
  return -p.gm1 * parallel(1 / p.gm2, p.rO1 ?? Infinity, p.rO2 ?? Infinity);
}

/** Diode-load gain from sizes: |Av| = √(µ1 (W/L)1 / (µ2 (W/L)2)) — independent of ID. */
export function diodeLoadGainFromSizes(kp1: number, wl1: number, kp2: number, wl2: number): number {
  return Math.sqrt((kp1 * wl1) / (kp2 * wl2));
}

/** CS with current-source load: Av = −gm1 (rO1 ‖ rO2). */
export function csCurrentSourceLoad(p: { gm1: number; rO1: number; rO2: number }): number {
  return -p.gm1 * parallel(p.rO1, p.rO2);
}

/** CS with triode load: Av = −gm1 (Ron2 ‖ rO1). */
export function csTriodeLoad(p: { gm1: number; ron2: number; rO1?: number }): number {
  return -p.gm1 * parallel(p.ron2, p.rO1 ?? Infinity);
}

/** CS with active (complementary) load: Av = −(gm1 + gm2)(rO1 ‖ rO2). */
export function csActiveLoad(p: { gm1: number; gm2: number; rO1: number; rO2: number }): number {
  return -(p.gm1 + p.gm2) * parallel(p.rO1, p.rO2);
}

/** Degenerated Gm = gm/(1 + gm·RS) = 1/(1/gm + RS)  (λ = 0). */
export function gmDegenerated(gm: number, rs: number): number {
  return gm / (1 + gm * rs);
}

/** Degenerated CS: ratio rule |Av| = RD/(1/gm + RS), sign negative. */
export function csDegenerated(p: { gm: number; rd: number; rs: number }): number {
  return -p.rd / (1 / p.gm + p.rs);
}

/** Degenerated CS output resistance at the drain: rO + (1 + gm rO) RS, in parallel with RD. */
export function csDegeneratedRout(p: { gm: number; rO: number; rs: number; rd?: number }): number {
  return parallel(rIntoDrain({ gm: p.gm, rO: p.rO, rs: p.rs }), p.rd ?? Infinity);
}

/** Source follower: Av = RS'/(1/gm + RS') where RS' is everything at the source (incl. rO). */
export function followerGain(p: { gm: number; rs: number; rO?: number }): number {
  const rl = parallel(p.rs, p.rO ?? Infinity);
  if (!Number.isFinite(rl)) return 1;
  return rl / (1 / p.gm + rl);
}

/** Source follower output resistance: 1/gm ‖ rO ‖ RS. */
export function followerRout(p: { gm: number; rO?: number; rs?: number }): number {
  return parallel(1 / p.gm, p.rO ?? Infinity, p.rs ?? Infinity);
}

/** Common gate (λ = 0): Av = +gm·RD. */
export function cgGain(p: { gm: number; rd: number }): number {
  return p.gm * p.rd;
}

/** Common gate input resistance: (RD + rO)/(1 + gm rO). */
export function cgRin(p: { gm: number; rO?: number; rd: number }): number {
  return rIntoSource(p);
}

/** Cascode output resistance looking down: rO2 + (1 + gm2 rO2) rO1 ≈ gm2 rO2 rO1. */
export function cascodeRout(p: { gm2: number; rO2: number; rO1: number }): number {
  return rIntoDrain({ gm: p.gm2, rO: p.rO2, rs: p.rO1 });
}

/** Approximate cascode resistance gm·rO·R — the form used in the lecture notes. */
export function cascodeRoutApprox(gm: number, ro: number, rBelow: number): number {
  return gm * ro * rBelow;
}

/** Cascode amplifier: Av = −gm1 (Rcascode ‖ Rload). The load trap: a simple load wins the parallel. */
export function cascodeGain(p: { gm1: number; rCascode: number; rLoad: number }): number {
  return -p.gm1 * parallel(p.rCascode, p.rLoad);
}

/** Current mirror (λ = 0): Iout = IREF · (W/L)out / (W/L)ref. */
export function mirrorCurrent(iref: number, wlOut: number, wlRef: number): number {
  return (iref * wlOut) / wlRef;
}

/** A diode-connected device costs a full |VGS| = |Vth| + |Vov| of headroom. */
export function diodeDrop(vth: number, vov: number): number {
  return vth + vov;
}
