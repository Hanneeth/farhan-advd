/**
 * Supply rejection and noise in op amps (Razavi 2nd ed §9.11–9.12, §7.2–7.6).
 * Noise powers are one-sided spectral densities: A²/Hz for currents, V²/Hz for voltages.
 */
import { parallel } from './impedance';

export const K_BOLTZMANN = 1.380649e-23;

/** Thermal noise current of a saturated MOSFET: 4kTγgm (γ ≈ 2/3 for long channels). */
export function thermalNoiseCurrent(gm: number, gamma = 2 / 3, temp = 300): number {
  return 4 * K_BOLTZMANN * temp * gamma * gm;
}

/** Referred to its own gate: 4kTγ/gm (V²/Hz). */
export function thermalNoiseGate(gm: number, gamma = 2 / 3, temp = 300): number {
  return (4 * K_BOLTZMANN * temp * gamma) / gm;
}

/** Flicker noise referred to the gate: K/(Cox·W·L·f) (V²/Hz). */
export function flickerNoiseGate(p: { k: number; cox: number; w: number; l: number; f: number }): number {
  return p.k / (p.cox * p.w * p.l * p.f);
}

/**
 * Input-referred thermal noise of a CS stage with a current-source load (gm1 input, gm2 load):
 * 4kTγ(1/gm1 + gm2/gm1²). The load's noise current is divided by gm1² when referred to the input.
 */
export function inputNoiseCs(gm1: number, gm2: number, gamma = 2 / 3, temp = 300): number {
  return 4 * K_BOLTZMANN * temp * gamma * (1 / gm1 + gm2 / gm1 ** 2);
}

/**
 * Differential pair with current-source or mirror loads (5-T OTA, telescopic: cascodes add ~nothing):
 * 8kTγ(1/gm1 + gmLoad/gm1²). The factor 8 = 2 × 4: both halves contribute (Razavi Eq. 9.88/9.94).
 */
export function inputNoisePair(gm1: number, gmLoad: number, gamma = 2 / 3, temp = 300): number {
  return 8 * K_BOLTZMANN * temp * gamma * (1 / gm1 + gmLoad / gm1 ** 2);
}

/** Folded cascode: both current-source pairs (M7–8 and M9–10) count: 8kTγ(1/gm1 + gm7/gm1² + gm9/gm1²) (Eq. 9.91). */
export function inputNoiseFolded(gm1: number, gm7: number, gm9: number, gamma = 2 / 3, temp = 300): number {
  return 8 * K_BOLTZMANN * temp * gamma * (1 / gm1 + gm7 / gm1 ** 2 + gm9 / gm1 ** 2);
}

/** √(V²/Hz) expressed in nV/√Hz. */
export function nvPerRtHz(v2: number): number {
  return Math.sqrt(v2) * 1e9;
}

/** Total noise sampled on a capacitor: √(kT/C) (V rms), whatever the resistor. */
export function ktcNoiseRms(c: number, temp = 300): number {
  return Math.sqrt((K_BOLTZMANN * temp) / c);
}

/** Integrated white noise over a one-pole bandwidth: V²·(π/2)·f−3dB (noise bandwidth). */
export function integratedWhiteNoise(v2: number, f3db: number): number {
  return v2 * (Math.PI / 2) * f3db;
}

/**
 * PSRR of the 5-T OTA (Razavi Eq. 9.81): the diode clamps node X to VDD, so the supply reaches the
 * output with gain ≈ 1, while the signal gets gmN(rOP‖rON). PSRR ≈ gmN(rOP‖rON).
 */
export function psrr5T(p: { gmN: number; roP: number; roN: number }): { supplyGain: number; signalGain: number; psrr: number } {
  const signalGain = p.gmN * parallel(p.roP, p.roN);
  return { supplyGain: 1, signalGain, psrr: signalGain };
}

/** 20·log10(PSRR). */
export function psrrDb(psrr: number): number {
  return 20 * Math.log10(psrr);
}

/**
 * Replica CMFB (Lec 12, Razavi §9.7.3): M11 and M14 carry the same current with the same gate, so their
 * sources sit at the same voltage and the deep-triode resistances must match:
 *   (W/L)15(VREF − Vth) = (W/L)12(Vout1 − Vth) + (W/L)13(Vout2 − Vth).
 * With (W/L)15 = (W/L)12 + (W/L)13 and equal sensing devices, Vout,CM = VREF.
 */
export function replicaCmfbOutputCm(p: { vref: number; vth: number; wl12: number; wl13: number; wl15: number }): number {
  return p.vth + (p.wl15 * (p.vref - p.vth)) / (p.wl12 + p.wl13);
}

/** Thermal noise voltage of a resistor: 4kTR (V²/Hz), flat (“white”). */
export function resistorNoise(r: number, temp = 300): number {
  return 4 * K_BOLTZMANN * temp * r;
}

/**
 * Total rms noise on C from a resistor R (Razavi HO #10 example): integrate 4kTR over the RC filter's noise
 * bandwidth (π/2)·1/(2πRC). R cancels: a bigger R is noisier per hertz but lets through fewer hertz.
 */
export function rcNoiseRms(r: number, c: number, temp = 300): number {
  return Math.sqrt(integratedWhiteNoise(resistorNoise(r, temp), 1 / (2 * Math.PI * r * c)));
}

/** Uncorrelated noise sources add as powers: √(v1² + v2² + …) for rms values. */
export function addUncorrelated(rms: number[]): number {
  return Math.sqrt(rms.reduce((a, v) => a + v * v, 0));
}
