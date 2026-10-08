/**
 * MOSFET device model — the square law, exactly as in the lecture notes.
 *
 * Every quantity is SI (V, A, Ω, S). PMOS devices use magnitudes throughout:
 * pass |VGS|, |Vth|, |VDS| and the same functions apply (CLAUDE.md §6).
 *
 * `kp` is µCox (µnCox or µpCox) in A/V², `wl` is W/L (dimensionless).
 */

export type Region = 'off' | 'triode' | 'saturation';

/** Vov = VGS − Vth. For PMOS pass |VGS| and |Vth|. */
export function overdrive(vgs: number, vth: number): number {
  return vgs - vth;
}

/** Region of operation from overdrive and VDS (magnitudes for PMOS). */
export function region(vov: number, vds: number): Region {
  if (vov <= 0) return 'off';
  return vds >= vov ? 'saturation' : 'triode';
}

/** Saturation: ID = ½ µCox (W/L) Vov² (1 + λ VDS). λ defaults to 0 (DC bias). */
export function idSat(kp: number, wl: number, vov: number, lambda = 0, vds = 0): number {
  if (vov <= 0) return 0;
  return 0.5 * kp * wl * vov * vov * (1 + lambda * vds);
}

/** Triode: ID = µCox (W/L) [ Vov·VDS − VDS²/2 ]. */
export function idTriode(kp: number, wl: number, vov: number, vds: number): number {
  if (vov <= 0) return 0;
  return kp * wl * (vov * vds - (vds * vds) / 2);
}

/** Drain current in whichever region the device is in (continuous at VDS = Vov when λ = 0). */
export function drainCurrent(kp: number, wl: number, vov: number, vds: number, lambda = 0): number {
  const r = region(vov, vds);
  if (r === 'off') return 0;
  if (r === 'triode') return idTriode(kp, wl, vov, vds);
  return idSat(kp, wl, vov, lambda, vds);
}

/** The bridge equation run backwards: Vov = √(2 ID / (µCox W/L)). */
export function vovFromId(id: number, kp: number, wl: number): number {
  return Math.sqrt((2 * id) / (kp * wl));
}

/** Design direction: W/L = 2 ID / (µCox Vov²). */
export function wlFromId(id: number, kp: number, vov: number): number {
  return (2 * id) / (kp * vov * vov);
}

/** gm = µCox (W/L) Vov. */
export function gmFromVov(kp: number, wl: number, vov: number): number {
  return kp * wl * vov;
}

/** gm = √(2 µCox (W/L) ID). */
export function gmFromId(kp: number, wl: number, id: number): number {
  return Math.sqrt(2 * kp * wl * id);
}

/** gm = 2 ID / Vov — the designer's form. */
export function gmFromIdVov(id: number, vov: number): number {
  return (2 * id) / vov;
}

/** rO = 1/(λ ID). λ = 0 gives an ideal (infinite) rO. */
export function rO(lambda: number, id: number): number {
  return lambda === 0 ? Infinity : 1 / (lambda * id);
}

/** rO = VA / ID. */
export function rOFromVA(va: number, id: number): number {
  return va / id;
}

/** VA = |V'A| · L (Sedra–Smith notation used in Tutorial 1). */
export function earlyVoltage(vaPerLength: number, length: number): number {
  return vaPerLength * length;
}

/** λ scales as 1/L: λ at length L, given λ0 at reference length L0. */
export function lambdaAtLength(lambda0: number, l0: number, l: number): number {
  return (lambda0 * l0) / l;
}

/** Intrinsic gain gm·rO = 2/(λ Vov) — independent of ID. */
export function intrinsicGain(lambda: number, vov: number): number {
  return 2 / (lambda * vov);
}

/** Deep-triode on-resistance: Ron = 1/(µCox (W/L) Vov). */
export function ronDeepTriode(kp: number, wl: number, vov: number): number {
  return 1 / (kp * wl * vov);
}

/** Triode transconductance ∂ID/∂VGS = µCox (W/L) VDS (Razavi Problem 9.1a). */
export function gmTriode(kp: number, wl: number, vds: number): number {
  return kp * wl * vds;
}

/** Triode output resistance 1/(∂ID/∂VDS) = 1/(µCox (W/L)(Vov − VDS)) (Razavi Problem 9.1a). */
export function rOTriode(kp: number, wl: number, vov: number, vds: number): number {
  return 1 / (kp * wl * (vov - vds));
}

/** NMOS fence: saturated ⟺ VD ≥ VG − Vth. */
export function nmosSaturated(vd: number, vg: number, vth: number): boolean {
  return vd >= vg - vth - 1e-12;
}

/** PMOS fence: saturated ⟺ VD ≤ VG + |Vth|. */
export function pmosSaturated(vd: number, vg: number, vthMag: number): boolean {
  return vd <= vg + vthMag + 1e-12;
}

/** Everything about one biased device, from any current + size. Used for bias tables. */
export interface BiasRow {
  id: number;
  wl: number;
  vov: number;
  vgs: number;
  gm: number;
  rO: number;
}

export function biasFromCurrent(p: { id: number; kp: number; wl: number; vth: number; lambda: number }): BiasRow {
  const vov = vovFromId(p.id, p.kp, p.wl);
  return { id: p.id, wl: p.wl, vov, vgs: p.vth + vov, gm: gmFromIdVov(p.id, vov), rO: rO(p.lambda, p.id) };
}

export function biasFromOverdrive(p: { id: number; kp: number; vov: number; vth: number; lambda: number }): BiasRow {
  const wl = wlFromId(p.id, p.kp, p.vov);
  return { id: p.id, wl, vov: p.vov, vgs: p.vth + p.vov, gm: gmFromIdVov(p.id, p.vov), rO: rO(p.lambda, p.id) };
}

/**
 * Complete DC solve of an NMOS with RD from VDD and a grounded source (λ = 0), in whichever region it lands.
 * Saturation is assumed first; if the fence fails, the triode equation
 *   VD = VDD − RD·µCox(W/L)[Vov·VD − VD²/2]
 * is solved for VD (the smaller root of (k/2)VD² − (1 + k·Vov)VD + VDD = 0, k = µCox(W/L)RD).
 */
export function solveNmosRd(p: { vdd: number; vg: number; vth: number; kp: number; wl: number; rd: number }): { region: Region; id: number; vd: number; vov: number } {
  const vov = overdrive(p.vg, p.vth);
  if (vov <= 0) return { region: 'off', id: 0, vd: p.vdd, vov };
  const idS = idSat(p.kp, p.wl, vov);
  const vdS = p.vdd - idS * p.rd;
  if (vdS >= vov) return { region: 'saturation', id: idS, vd: vdS, vov };
  const k = p.kp * p.wl * p.rd;
  const a = k / 2;
  const b = -(1 + k * vov);
  const vd = (-b - Math.sqrt(b * b - 4 * a * p.vdd)) / (2 * a);
  return { region: 'triode', id: (p.vdd - vd) / p.rd, vd, vov };
}
