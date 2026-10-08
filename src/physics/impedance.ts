/**
 * The three impedance rules and the resistor algebra behind them.
 * "Gate infinite, drain big, source small. Up multiplies, down divides — by gm·rO."
 */

/** R1 ‖ R2 ‖ … — Infinity is an open circuit and drops out. Smallest resistance wins. */
export function parallel(...rs: number[]): number {
  let g = 0;
  for (const r of rs) {
    if (r === 0) return 0;
    if (Number.isFinite(r)) g += 1 / r;
  }
  return g === 0 ? Infinity : 1 / g;
}

/** Rule 1: looking into the gate. */
export const R_INTO_GATE = Infinity;

/**
 * Rule 2: looking into the drain, with RS under the source.
 * R = rO + (1 + gm·rO)·RS   (RS = 0 gives plain rO; RS = rO of a device below gives the cascode).
 */
export function rIntoDrain(p: { gm: number; rO: number; rs?: number }): number {
  const rs = p.rs ?? 0;
  if (!Number.isFinite(p.rO)) return Infinity;
  return p.rO + (1 + p.gm * p.rO) * rs;
}

/**
 * Rule 3: looking into the source, with RD on the drain.
 * R = (RD + rO)/(1 + gm·rO) ≈ 1/gm + RD/(gm·rO).  An ideal current-source drain load gives ∞.
 */
export function rIntoSource(p: { gm: number; rO?: number; rd?: number }): number {
  const ro = p.rO ?? Infinity;
  const rd = p.rd ?? 0;
  if (!Number.isFinite(rd)) return Infinity;
  if (!Number.isFinite(ro)) return 1 / p.gm;
  return (rd + ro) / (1 + p.gm * ro);
}

/** Diode-connected device: 1/gm ‖ rO. */
export function rDiode(gm: number, ro = Infinity): number {
  return parallel(1 / gm, ro);
}

/** Current divider: the share of I that flows into branch A (the other branch is B). */
export function currentDivider(i: number, rA: number, rB: number): number {
  if (!Number.isFinite(rB)) return i;
  if (!Number.isFinite(rA)) return 0;
  return (i * rB) / (rA + rB);
}

/** Voltage divider: V · R2/(R1 + R2). */
export function voltageDivider(v: number, r1: number, r2: number): number {
  return (v * r2) / (r1 + r2);
}
