/**
 * Process parameter sets. Magnitudes for PMOS (vthp = |Vthp|).
 * λ values are at the stated reference length; use lambdaAtLength() for other L.
 */
export interface Process {
  name: string;
  kpn: number; // µnCox, A/V²
  kpp: number; // µpCox, A/V²
  vthn: number;
  vthp: number; // |Vthp|
  lambdan: number; // V⁻¹ at lRef
  lambdap: number; // V⁻¹ at lRef
  lRef?: number; // m
  vdd: number;
}

/** Tutorials 2–3 and Problem Set 1 "Set A" (Razavi Table 2.1, L = 0.5 µm). */
export const SET_A: Process = {
  name: 'Set A (0.5 µm, Razavi Table 2.1)',
  kpn: 134.28e-6,
  kpp: 38.36e-6,
  vthn: 0.7,
  vthp: 0.8,
  lambdan: 0.1,
  lambdap: 0.2,
  lRef: 0.5e-6,
  vdd: 3,
};

/** Problem Set 1 "Set B" and the Quiz 1 / exam 5-T OTA process. */
export const SET_B: Process = {
  name: 'Set B (1.8 V)',
  kpn: 200e-6,
  kpp: 100e-6,
  vthn: 0.4,
  vthp: 0.5,
  lambdan: 0.05,
  lambdap: 0.1,
  vdd: 1.8,
};

/** Razavi Example 9.7 process. */
export const EX_9_7: Process = {
  name: 'Razavi Example 9.7',
  kpn: 60e-6,
  kpp: 30e-6,
  vthn: 0.7,
  vthp: 0.7,
  lambdan: 0.1,
  lambdap: 0.2,
  lRef: 0.5e-6,
  vdd: 3,
};
