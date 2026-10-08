/**
 * Differential pair (Razavi Ch. 4): CM/DM split, current steering, half circuits, CMRR, CM input range.
 */
import { parallel } from './impedance';

/** Split two inputs into VCM and vd. */
export function splitInputs(vin1: number, vin2: number): { vcm: number; vd: number } {
  return { vcm: (vin1 + vin2) / 2, vd: vin1 - vin2 };
}

/**
 * Large-signal steering (Razavi Eq. 4.xx):
 * ID1 − ID2 = ½ µCox(W/L) ΔVin √(4 ISS/(µCox W/L) − ΔVin²), clipped at ±ISS beyond ±√2·Vov.
 */
export function steering(p: { kp: number; wl: number; iss: number; dvin: number }): { id1: number; id2: number } {
  const k = p.kp * p.wl;
  const dvMax = Math.sqrt((2 * p.iss) / k);
  let diff: number;
  if (Math.abs(p.dvin) >= dvMax) diff = Math.sign(p.dvin) * p.iss;
  else diff = 0.5 * k * p.dvin * Math.sqrt((4 * p.iss) / k - p.dvin * p.dvin);
  return { id1: (p.iss + diff) / 2, id2: (p.iss - diff) / 2 };
}

/** Full steering happens at ΔVin = √2 · Vov (Vov of each device at balance). */
export function fullSteeringVoltage(vovBalance: number): number {
  return Math.SQRT2 * vovBalance;
}

/** gm of each device at balance = √(µCox (W/L) ISS). */
export function gmAtBalance(kp: number, wl: number, iss: number): number {
  return Math.sqrt(kp * wl * iss);
}

/** Differential gain from the half circuit: Ad = −gm (R_load ‖ rO). */
export function diffGain(p: { gm: number; rLoad: number; rO?: number }): number {
  return -p.gm * parallel(p.rLoad, p.rO ?? Infinity);
}

/** Common-mode gain, CM half circuit with 2RSS: ACM = −RD/(1/gm + 2RSS). */
export function cmGain(p: { gm: number; rd: number; rss: number }): number {
  return -p.rd / (1 / p.gm + 2 * p.rss);
}

/** CMRR ≈ (1 + 2 gm RSS) · gm/Δgm (mismatch-limited). */
export function cmrrMismatch(p: { gm: number; dgm: number; rss: number }): number {
  return ((1 + 2 * p.gm * p.rss) * p.gm) / p.dgm;
}

/** Input CM range lower limit: VISS + VGS1 (VISS = headroom of the tail source, not a supply). */
export function vinCmMin(viss: number, vgs1: number): number {
  return viss + vgs1;
}

/** Input CM range upper limit: M1's fence, VD1 + Vth1. */
export function vinCmMax(vd1: number, vth1: number): number {
  return vd1 + vth1;
}

/**
 * CM step that pushes the input devices to the triode edge (Tutorial 1 Q4e):
 * the drain moves by ACM·ΔVCM while the gate moves by ΔVCM.
 */
export function cmStepToTriode(p: { vd: number; vcm: number; vth: number; acm: number }): number {
  return (p.vd - p.vcm + p.vth) / (1 - p.acm);
}
