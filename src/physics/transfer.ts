/**
 * Large-signal transfer curves Vout(Vin) of the common-source stage with every load (CS amplifier lab).
 * Each point is found by bisection on KCL at the output: I_load(Vout) = I_M1(Vin, Vout). The small-signal
 * gain is then the slope, and the lab shows it next to −Gm·Rout from stages.ts: two independent solves.
 *
 * Channel-length modulation is applied in both regions, I = I₀(1 + λ|VDS|), so the curve is continuous.
 */
import { idSat, idTriode } from './device';
import type { Process } from './process';

/** Drain current magnitude with λ in both regions (continuous at |VDS| = |Vov|). */
export function idFull(kp: number, wl: number, vov: number, vds: number, lambda: number): number {
  if (vov <= 0 || vds <= 0) return 0;
  const i0 = vds >= vov ? idSat(kp, wl, vov) : idTriode(kp, wl, vov, vds);
  return i0 * (1 + lambda * vds);
}

export type CsLoad = 'resistor' | 'diode' | 'current' | 'triode' | 'active' | 'degenerated';

export interface CsParams {
  load: CsLoad;
  proc: Process;
  wl1: number;
  /** PMOS load size (diode, current source, triode, active). */
  wl2: number;
  rd: number;
  rs: number;
  /** PMOS current-source gate voltage. */
  vb: number;
}

function bisect(f: (x: number) => number, lo: number, hi: number, n = 80): number {
  // f decreasing: f(lo) ≥ 0 ≥ f(hi)
  let a = lo, b = hi;
  if (f(a) <= 0) return a;
  if (f(b) >= 0) return b;
  for (let k = 0; k < n; k++) {
    const m = (a + b) / 2;
    if (f(m) > 0) a = m;
    else b = m;
  }
  return (a + b) / 2;
}

/** Current into the output node from the load, as a function of Vout (decreasing in Vout). */
export function loadCurrent(p: CsParams, vin: number, vout: number): number {
  const { proc } = p;
  const vdd = proc.vdd;
  switch (p.load) {
    case 'resistor':
    case 'degenerated':
      return (vdd - vout) / p.rd;
    case 'diode':
      return idFull(proc.kpp, p.wl2, vdd - vout - proc.vthp, vdd - vout, proc.lambdap);
    case 'current':
      return idFull(proc.kpp, p.wl2, vdd - p.vb - proc.vthp, vdd - vout, proc.lambdap);
    case 'triode':
      return idFull(proc.kpp, p.wl2, vdd - proc.vthp, vdd - vout, proc.lambdap);
    case 'active':
      return idFull(proc.kpp, p.wl2, vdd - vin - proc.vthp, vdd - vout, proc.lambdap);
  }
}

/** Current pulled out of the output node by M1 (with RS under its source for the degenerated stage). */
export function m1Current(p: CsParams, vin: number, vout: number): { id: number; vs: number } {
  const { proc } = p;
  if (p.load !== 'degenerated' || p.rs === 0) return { id: idFull(proc.kpn, p.wl1, vin - proc.vthn, vout, proc.lambdan), vs: 0 };
  // Solve I = f(Vin − I·RS − Vth, Vout − I·RS): the left side rises, the right side falls with I.
  const g = (i: number) => idFull(proc.kpn, p.wl1, vin - i * p.rs - proc.vthn, vout - i * p.rs, proc.lambdan) - i;
  const iMax = Math.max(0, vout / p.rs);
  const id = bisect(g, 0, iMax);
  return { id, vs: id * p.rs };
}

/** One point of the transfer curve. */
export function csOperatingPoint(p: CsParams, vin: number): { vout: number; id: number; vs: number } {
  const f = (vout: number) => loadCurrent(p, vin, vout) - m1Current(p, vin, vout).id;
  const vout = bisect(f, 0, p.proc.vdd);
  const m = m1Current(p, vin, vout);
  return { vout, id: m.id, vs: m.vs };
}

/** Slope dVout/dVin by central difference: the large-signal gain. */
export function csSlope(p: CsParams, vin: number, h = 1e-4): number {
  return (csOperatingPoint(p, vin + h).vout - csOperatingPoint(p, vin - h).vout) / (2 * h);
}

/**
 * Small-signal parameters at the operating point, as partial derivatives of the same device equations
 * (so gm·vgs ‖ rO is exact for this model): gm = ∂ID/∂VGS, rO = 1/(∂ID/∂VDS).
 */
export function smallSignalAt(kp: number, wl: number, vov: number, vds: number, lambda: number): { gm: number; rO: number } {
  const h = 1e-6;
  const gm = (idFull(kp, wl, vov + h, vds, lambda) - idFull(kp, wl, vov - h, vds, lambda)) / (2 * h);
  const gds = (idFull(kp, wl, vov, vds + h, lambda) - idFull(kp, wl, vov, vds - h, lambda)) / (2 * h);
  return { gm, rO: gds > 0 ? 1 / gds : Infinity };
}

/** The input bias that puts the output at `target` (Vout falls as Vin rises, so bisect on Vin). */
export function vinForVout(p: CsParams, target: number, lo = 0, hi = p.proc.vdd): number {
  let a = lo, b = hi;
  for (let k = 0; k < 70; k++) {
    const m = (a + b) / 2;
    if (csOperatingPoint(p, m).vout > target) a = m;
    else b = m;
  }
  return (a + b) / 2;
}
