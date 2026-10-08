/**
 * Common-mode feedback (Razavi §9.7) — sensing with deep-triode devices (lecture notes, Lectures 11–12).
 * Two triode devices M11, M12 with gates at Vout1, Vout2 and drains tied at P:
 *   Rtot,P = Ron11 ‖ Ron12 = 1 / (µnCox (W/L)11,12 (Vout1 + Vout2 − 2Vth))
 *   VP = 2ID · Rtot,P
 */

/** Total resistance of the two triode sensing devices in parallel. */
export function triodeSenseResistance(p: { kpn: number; wl: number; vout1: number; vout2: number; vthn: number }): number {
  return 1 / (p.kpn * p.wl * (p.vout1 + p.vout2 - 2 * p.vthn));
}

/** VP = 2 ID / (µnCox (W/L)(Vout1 + Vout2 − 2Vth)). */
export function triodeSenseVp(p: { id: number; kpn: number; wl: number; voutSum: number; vthn: number }): number {
  return (2 * p.id) / (p.kpn * p.wl * (p.voutSum - 2 * p.vthn));
}

/** Design direction: the (W/L)11,12 that puts P at a chosen VP for a target output CM level. */
export function triodeSenseWl(p: { id: number; kpn: number; vp: number; voutSum: number; vthn: number }): number {
  return (2 * p.id) / (p.kpn * p.vp * (p.voutSum - 2 * p.vthn));
}

/** Output CM set by the loop: Vout1 + Vout2 = 2ID/(µnCox (W/L)(Vb1 − VGS3)) + 2Vth. */
export function triodeSenseOutputSum(p: { id: number; kpn: number; wl: number; vp: number; vthn: number }): number {
  return (2 * p.id) / (p.kpn * p.wl * p.vp) + 2 * p.vthn;
}
