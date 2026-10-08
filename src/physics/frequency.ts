/**
 * Poles, feedback, settling and slewing (Razavi §6, §8.1, §9.1).
 * Formulas are in rad/s; convert to Hz only at the last line with toHz().
 */

export function toHz(omega: number): number {
  return omega / (2 * Math.PI);
}

export function toRad(f: number): number {
  return 2 * Math.PI * f;
}

/** One pole per node: ωp = 1/(R·C). */
export function pole(r: number, c: number): number {
  return 1 / (r * c);
}

/** GBW of a one-stage op amp: ωu = gm/CL (Rout cancels). */
export function gbwOneStage(gm: number, cl: number): number {
  return gm / cl;
}

/** ωu = A0·ω0. */
export function unityGainFrequency(a0: number, omega0: number): number {
  return a0 * omega0;
}

/** Feedback factor of a resistive divider: β = R2/(R1 + R2). */
export function betaDivider(r1: number, r2: number): number {
  return r2 / (r1 + r2);
}

/** Aclosed = A/(1 + βA). */
export function closedLoopGain(a: number, beta: number): number {
  return a / (1 + beta * a);
}

/** Gain error ε = 1/(1 + βA). */
export function gainError(a: number, beta: number): number {
  return 1 / (1 + beta * a);
}

/** Design equation (approximate, ε ≈ 1/βA): Amin = Aclosed/ε. */
export function minOpenLoopGain(aClosed: number, eps: number): number {
  return aClosed / eps;
}

/** Exact minimum open-loop gain from 1/(1+βA) ≤ ε: A ≥ (1/ε − 1)/β. */
export function minOpenLoopGainExact(beta: number, eps: number): number {
  return (1 / eps - 1) / beta;
}

/** Voltage-sensing feedback: Rout,closed = Rout/(1 + βA). */
export function routClosed(routOpen: number, a: number, beta: number): number {
  return routOpen / (1 + beta * a);
}

/** Closed-loop time constant, exact single-pole form: τ = 1/[(1 + βA0)ω0]. */
export function tauClosedExact(a0: number, omega0: number, beta: number): number {
  return 1 / ((1 + beta * a0) * omega0);
}

/** Closed-loop time constant, design form: τ ≈ 1/(β ωu) = Aclosed/ωu. */
export function tauClosed(beta: number, omegaU: number): number {
  return 1 / (beta * omegaU);
}

/** ln(1/ε): 1% → 4.605, 0.1% → 6.908. */
export function settlingTimeConstants(eps: number): number {
  return Math.log(1 / eps);
}

/** Linear settling to fractional error ε: t = τ·ln(1/ε). */
export function settlingTime(tau: number, eps: number): number {
  return tau * Math.log(1 / eps);
}

/** Required ωu for settling: ωu ≥ ln(1/ε)/(β·t). */
export function requiredOmegaU(p: { beta: number; eps: number; t: number }): number {
  return Math.log(1 / p.eps) / (p.beta * p.t);
}

/** First-order step response: final·(1 − e^(−t/τ)). */
export function stepResponse(final: number, tau: number, t: number): number {
  return final * (1 - Math.exp(-t / tau));
}

/** Slew rate SR = I/CL (V/s). */
export function slewRate(i: number, cl: number): number {
  return i / cl;
}

/** 20·log10 of a magnitude. */
export function db(x: number): number {
  return 20 * Math.log10(Math.abs(x));
}

/** Magnitude of a single-pole response A0/(1 + jω/ω0). */
export function singlePoleMag(a0: number, omega0: number, omega: number): number {
  return a0 / Math.sqrt(1 + (omega / omega0) ** 2);
}

/** Closed-loop single-pole system: DC gain A0/(1+βA0), pole (1+βA0)ω0. */
export function closedLoopPole(a0: number, omega0: number, beta: number): { gain: number; omega: number } {
  return { gain: a0 / (1 + beta * a0), omega: (1 + beta * a0) * omega0 };
}

/**
 * Large step with slewing (Razavi §9.1.4): while the linear response would need a slope above SR, the
 * output ramps at SR; once the remaining error is SR·τ it finishes exponentially with τ.
 * Returns the output at time t for a step of height vstep (starting at 0).
 */
export function stepWithSlew(vstep: number, tau: number, sr: number, t: number): number {
  if (!(sr > 0) || vstep / tau <= sr) return stepResponse(vstep, tau, t);
  const tSlew = (vstep - sr * tau) / sr;
  if (t <= tSlew) return sr * t;
  return vstep - sr * tau * Math.exp(-(t - tSlew) / tau);
}

/** Time spent slewing before linear settling takes over (0 if the step is small enough). */
export function slewTime(vstep: number, tau: number, sr: number): number {
  return vstep / tau <= sr ? 0 : (vstep - sr * tau) / sr;
}
