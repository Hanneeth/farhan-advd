/**
 * Stability and frequency compensation (Razavi 2nd ed Ch 10; lecture notes Lec 14–17).
 * Frequencies here are in Hz (poles fp1, fp2… as in the notes); phases are in degrees.
 * The loop gain is βA(s) = βA0·Π(1 − s/zr)·Π(1 + s/zl) / Π(1 + s/ωpi): the sign inversion of negative
 * feedback is NOT counted in the phase, so the danger line is −180° (Barkhausen).
 */

export interface LoopSpec {
  /** DC open-loop gain A0 (V/V). */
  a0: number;
  /** Open-loop poles in Hz. */
  poles: number[];
  /** Right-half-plane zeros in Hz (they add phase LAG, like a pole, but lift the magnitude). */
  zerosRhp?: number[];
  /** Left-half-plane zeros in Hz (phase lead). */
  zerosLhp?: number[];
  /** Feedback factor β (1 = unity-gain buffer, the worst case). */
  beta: number;
}

const deg = (rad: number) => (rad * 180) / Math.PI;
const rad = (d: number) => (d * Math.PI) / 180;

/** |βA(jf)| */
export function loopMag(s: LoopSpec, f: number): number {
  let m = s.beta * s.a0;
  for (const p of s.poles) m /= Math.hypot(1, f / p);
  for (const z of s.zerosRhp ?? []) m *= Math.hypot(1, f / z);
  for (const z of s.zerosLhp ?? []) m *= Math.hypot(1, f / z);
  return m;
}

/** ∠βA(jf) in degrees: 0 at DC, −atan(f/fp) per pole, −atan(f/fz) per RHP zero, +atan per LHP zero. */
export function loopPhase(s: LoopSpec, f: number): number {
  let ph = 0;
  for (const p of s.poles) ph -= deg(Math.atan(f / p));
  for (const z of s.zerosRhp ?? []) ph -= deg(Math.atan(f / z));
  for (const z of s.zerosLhp ?? []) ph += deg(Math.atan(f / z));
  return ph;
}

/** Bisection on log f for g(f) = 0 where g changes sign once between lo and hi. */
function bisectLog(g: (f: number) => number, lo: number, hi: number): number {
  let a = Math.log(lo);
  let b = Math.log(hi);
  const ga = g(lo);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    const gm = g(Math.exp(m));
    if (Math.sign(gm) === Math.sign(ga)) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

function span(s: LoopSpec): [number, number] {
  const all = [...s.poles, ...(s.zerosRhp ?? []), ...(s.zerosLhp ?? [])];
  return [Math.min(...all) * 1e-6, Math.max(...all) * 1e6 * Math.max(1, s.beta * s.a0)];
}

/** Gain crossover ωgx (Hz): where |βA| = 1. Undefined if the loop gain never exceeds 1. */
export function gainCrossover(s: LoopSpec): number | undefined {
  const [lo, hi] = span(s);
  if (loopMag(s, lo) <= 1) return undefined;
  if (loopMag(s, hi) >= 1) return undefined;
  return bisectLog((f) => Math.log(loopMag(s, f)), lo, hi);
}

/** Phase crossover ωpx (Hz): where ∠βA = −180°. Undefined if the phase never gets there (≤ 2 poles, no RHP zero). */
export function phaseCrossover(s: LoopSpec): number | undefined {
  const [lo, hi] = span(s);
  if (loopPhase(s, hi) > -180) return undefined;
  return bisectLog((f) => loopPhase(s, f) + 180, lo, hi);
}

/** PM = 180° + ∠βA(ωgx). */
export function phaseMargin(s: LoopSpec): number {
  const fgx = gainCrossover(s);
  if (fgx === undefined) return 180;
  return 180 + loopPhase(s, fgx);
}

/** GM (dB) = −20·log|βA(ωpx)|; Infinity if the phase never reaches −180°. */
export function gainMarginDb(s: LoopSpec): number {
  const fpx = phaseCrossover(s);
  if (fpx === undefined) return Infinity;
  return -20 * Math.log10(loopMag(s, fpx));
}

/**
 * The largest A0 that still gives a phase margin PM (Razavi Problems 10.1–10.2): find where the
 * phase equals PM − 180°, then make |βA| = 1 there.
 */
export function a0ForPhaseMargin(p: { poles: number[]; pm: number; beta: number; zerosRhp?: number[] }): { a0: number; fgx: number } {
  const probe: LoopSpec = { a0: 1, poles: p.poles, zerosRhp: p.zerosRhp, beta: 1 };
  const [lo, hi] = span({ ...probe, a0: 1e6 });
  const fgx = bisectLog((f) => loopPhase(probe, f) - (p.pm - 180), lo, hi);
  const a0 = 1 / (p.beta * loopMag(probe, fgx));
  return { a0, fgx };
}

/**
 * Closed-loop peaking at ωgx (Razavi §10.3, Lec 16): |Aclosed(ωgx)| = (1/β)·1/(2 sin(PM/2)).
 * PM 5° → 11.5, 45° → 1.3, 60° → 1.0.
 */
export function peakingFactor(pmDeg: number): number {
  return 1 / (2 * Math.sin(rad(pmDeg) / 2));
}

/** Inverse of peakingFactor: the PM that gives a closed-loop peak of k·(1/β) at ωgx (Razavi Problem 10.4). */
export function pmFromPeaking(k: number): number {
  return 2 * deg(Math.asin(1 / (2 * k)));
}

/**
 * Dominant-pole compensation (Razavi §10.4, Lec 17): keep the non-dominant poles and slide the dominant
 * pole down until PM is reached. Returns the new dominant pole (Hz) and the new ωgx.
 */
export function dominantPoleForPM(p: { a0: number; nondominant: number[]; pm: number; beta: number }): { fd: number; fgx: number } {
  const pmOf = (fd: number) => phaseMargin({ a0: p.a0, poles: [fd, ...p.nondominant], beta: p.beta });
  const lo = Math.min(...p.nondominant) * 1e-12;
  const hi = Math.min(...p.nondominant);
  const fd = bisectLog((f) => pmOf(f) - p.pm, lo, hi);
  return { fd, fgx: gainCrossover({ a0: p.a0, poles: [fd, ...p.nondominant], beta: p.beta })! };
}

/* ─── Miller compensation of the two-stage op amp (Lec 17; Razavi §10.5) ─── */

export interface MillerSpec {
  /** First-stage transconductance Gm1 and output resistance R1 (= rO2‖rO4), node capacitance C1. */
  gm1: number;
  r1: number;
  c1: number;
  /** Second-stage transconductance Gm2 (= gm6), R2 (= rO6‖rO7), C2 (the load, CL). */
  gm2: number;
  r2: number;
  c2: number;
  /** Miller capacitor CC (0 = uncompensated). */
  cc: number;
  /** Nulling resistor in series with CC (0 = none). */
  rz?: number;
}

export interface MillerResult {
  a0: number;
  a2: number;
  /** Exact poles of the two-pole denominator (rad/s), p1 < p2. */
  p1: number;
  p2: number;
  /** Notes' approximations: P1' ≈ 1/(R1·A2·CC), P2' ≈ Gm2·CC/(C1C2 + C2CC + C1CC). */
  p1Approx: number;
  p2Approx: number;
  /** Zero (rad/s): positive = right half plane. Infinity when Rz = 1/Gm2 exactly. */
  z: number;
  /** GBW = Gm1/CC (rad/s). */
  gbw: number;
}

/**
 * Vout/Vin = Gm1Gm2R1R2(1 − sCC/Gm2) / {1 + s[R1(C1 + (1 + Gm2R2)CC) + R2(C2 + CC)] + s²R1R2(C1C2 + C2CC + C1CC)}
 * (the notes' transfer function). With Rz the zero becomes 1/[CC(1/Gm2 − Rz)].
 */
export function millerTwoStage(m: MillerSpec): MillerResult {
  const a2 = m.gm2 * m.r2;
  const a0 = m.gm1 * m.r1 * a2;
  if (m.cc === 0) {
    const pa = 1 / (m.r1 * m.c1);
    const pb = 1 / (m.r2 * m.c2);
    return { a0, a2, p1: Math.min(pa, pb), p2: Math.max(pa, pb), p1Approx: pa, p2Approx: pb, z: Infinity, gbw: Infinity };
  }
  const b1 = m.r1 * (m.c1 + (1 + a2) * m.cc) + m.r2 * (m.c2 + m.cc);
  const b2 = m.r1 * m.r2 * (m.c1 * m.c2 + m.c2 * m.cc + m.c1 * m.cc);
  // Roots of b2 s² + b1 s + 1 = 0 (both negative real when b1² > 4b2): magnitudes p1, p2.
  const disc = b1 * b1 - 4 * b2;
  const sq = Math.sqrt(Math.max(disc, 0));
  const p1 = (b1 - sq) / (2 * b2);
  const p2 = (b1 + sq) / (2 * b2);
  const rz = m.rz ?? 0;
  const zden = m.cc * (1 / m.gm2 - rz);
  return {
    a0,
    a2,
    p1: disc >= 0 ? p1 : Math.sqrt(1 / b2),
    p2: disc >= 0 ? p2 : Math.sqrt(1 / b2),
    p1Approx: 1 / (m.r1 * a2 * m.cc),
    p2Approx: (m.gm2 * m.cc) / (m.c1 * m.c2 + m.c2 * m.cc + m.c1 * m.cc),
    z: zden === 0 ? Infinity : 1 / zden,
    gbw: m.gm1 / m.cc,
  };
}

/** The loop spec (β, Hz) of a Miller-compensated two-stage op amp, for PM/GM and Bode plots. */
export function millerLoop(m: MillerSpec, beta: number): LoopSpec {
  const r = millerTwoStage(m);
  const hz = (w: number) => w / (2 * Math.PI);
  const zr = Number.isFinite(r.z) && r.z > 0 ? [hz(r.z)] : [];
  const zl = Number.isFinite(r.z) && r.z < 0 ? [hz(-r.z)] : [];
  return { a0: r.a0, poles: [hz(r.p1), hz(r.p2)], zerosRhp: zr, zerosLhp: zl, beta };
}

/**
 * Choosing CC for a phase margin (unity-gain feedback, dominant p1 gives −90°):
 *   PM = 90° − atan(ωu/ωp2) − atan(ωu/ωz),  ωu = Gm1/CC,  ωp2 ≈ Gm2/CL,  ωz = Gm2/CC.
 * The RHP zero costs atan(Gm1/Gm2), independent of CC. With the zero nulled (Rz = 1/Gm2) that term drops,
 * and PM = 45° gives Razavi's CC = (Gm1/Gm2)·CL (Eq. 10.28).
 */
export function ccForPhaseMargin(p: { gm1: number; gm2: number; cl: number; pm: number; zeroNulled: boolean }): number {
  const zeroCost = p.zeroNulled ? 0 : deg(Math.atan(p.gm1 / p.gm2));
  const left = 90 - p.pm - zeroCost;
  if (left <= 0) return Infinity;
  return (p.gm1 * p.cl) / (p.gm2 * Math.tan(rad(left)));
}

/** PM of the simplified Miller model at a given CC (same assumptions as ccForPhaseMargin). */
export function millerPhaseMargin(p: { gm1: number; gm2: number; cl: number; cc: number; zeroNulled: boolean }): number {
  const wu = p.gm1 / p.cc;
  const wp2 = p.gm2 / p.cl;
  const wz = p.gm2 / p.cc;
  return 90 - deg(Math.atan(wu / wp2)) - (p.zeroNulled ? 0 : deg(Math.atan(wu / wz)));
}

/** Nulling resistor: Rz = 1/Gm2 sends the zero to infinity (Razavi Eq. 10.30). */
export function rzNull(gm2: number): number {
  return 1 / gm2;
}

/** Rz that moves the zero into the LHP on top of the second pole: (CL + C1 + CC)/(Gm2·CC) (Razavi Eq. 10.32). */
export function rzCancel(p: { gm2: number; cc: number; cl: number; c1?: number }): number {
  return (p.cl + (p.c1 ?? 0) + p.cc) / (p.gm2 * p.cc);
}

/**
 * Slew rate of a Miller two-stage op amp (Razavi §10.6): the tail current ISS charges CC, so SR = ISS/CC,
 * unless the second-stage current source I7 cannot also feed CL: then (I7 − ISS)/CL.
 */
export function twoStageSlewRate(p: { iss: number; cc: number; i7: number; cl: number }): { sr: number; limit: 'CC' | 'CL' } {
  const internal = p.iss / p.cc;
  const output = (p.i7 - p.iss) / p.cl;
  return output < internal ? { sr: Math.max(output, 0), limit: 'CL' } : { sr: internal, limit: 'CC' };
}

/* ─── Closed-loop step response (for the pictures) ─── */

function polyMul(a: number[], b: number[]): number[] {
  const out = new Array(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => (out[i + j] += x * y)));
  return out;
}

/**
 * Unit-step response of Aclosed = A/(1 + βA), normalised so the final value is 1 (i.e. divided by
 * A0/(1+βA0)). Time is in seconds. Integrated with RK4 in the controllable canonical form.
 */
export function closedLoopStep(s: LoopSpec, tEnd: number, n = 600): { t: number; y: number }[] {
  const w = (f: number) => 2 * Math.PI * f;
  // Ascending-power polynomials in s.
  let num = [s.a0];
  for (const z of s.zerosRhp ?? []) num = polyMul(num, [1, -1 / w(z)]);
  for (const z of s.zerosLhp ?? []) num = polyMul(num, [1, 1 / w(z)]);
  let den = [1];
  for (const p of s.poles) den = polyMul(den, [1, 1 / w(p)]);
  const n0 = num.length;
  const charPoly = den.map((d, i) => d + s.beta * (i < n0 ? num[i] : 0));
  const order = charPoly.length - 1;
  const lead = charPoly[order];
  const a = charPoly.map((c) => c / lead); // monic
  const b = new Array(order).fill(0).map((_, i) => (i < n0 ? num[i] / lead : 0));
  const dc = num[0] / charPoly[0];
  // x' = A x + B u,  y = C x (controllable canonical form), u = 1.
  const deriv = (x: number[]) => {
    const dx = new Array(order);
    for (let i = 0; i < order - 1; i++) dx[i] = x[i + 1];
    let last = 1;
    for (let i = 0; i < order; i++) last -= a[i] * x[i];
    dx[order - 1] = last;
    return dx;
  };
  const fastest = Math.max(...s.poles.map(w), ...(s.zerosRhp ?? []).map(w), ...(s.zerosLhp ?? []).map(w), s.beta * s.a0 * w(Math.min(...s.poles)), 1 / tEnd);
  const sub = Math.max(1, Math.ceil((tEnd / n) * fastest * 0.5));
  const h = tEnd / n / sub;
  let x = new Array(order).fill(0);
  const out: { t: number; y: number }[] = [{ t: 0, y: 0 }];
  const add = (u: number[], v: number[], k: number) => u.map((ui, i) => ui + k * v[i]);
  for (let k = 1; k <= n; k++) {
    for (let j = 0; j < sub; j++) {
      const k1 = deriv(x);
      const k2 = deriv(add(x, k1, h / 2));
      const k3 = deriv(add(x, k2, h / 2));
      const k4 = deriv(add(x, k3, h));
      x = x.map((xi, i) => xi + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    }
    let y = 0;
    for (let i = 0; i < order; i++) y += b[i] * x[i];
    out.push({ t: (k * tEnd) / n, y: y / dc });
  }
  return out;
}

/** Overshoot (fraction above the final value) of a normalised step response. */
export function overshoot(resp: { y: number }[]): number {
  return Math.max(0, Math.max(...resp.map((r) => r.y)) - 1);
}

/**
 * The hand method (Razavi Fig 10.20, Lec 17): assume the new dominant pole already gives −90° at ωgx.
 * 1. ωgx is where the non-dominant poles add up to 90° − PM of lag (for one pole: ωgx = fp2·tan(90° − PM)).
 * 2. Draw a −20 dB/dec line from βA0 down to 0 dB at ωgx: fd = ωgx/(βA0).
 */
export function dominantPoleHand(p: { a0: number; nondominant: number[]; pm: number; beta: number }): { fd: number; fgx: number } {
  const lag = (f: number) => p.nondominant.reduce((acc, fp) => acc + (Math.atan(f / fp) * 180) / Math.PI, 0);
  const target = 90 - p.pm;
  let lo = Math.min(...p.nondominant) * 1e-9;
  let hi = Math.max(...p.nondominant) * 1e9;
  for (let i = 0; i < 200; i++) {
    const m = Math.sqrt(lo * hi);
    if (lag(m) < target) lo = m;
    else hi = m;
  }
  const fgx = Math.sqrt(lo * hi);
  return { fgx, fd: fgx / (p.beta * p.a0) };
}

/**
 * A one-stage op amp (5-T OTA, telescopic, folded cascode) in feedback: the output node is the dominant
 * pole, 1/(2π·Rout·CL), and one internal node (the mirror or folding node) gives a fixed non-dominant pole
 * fnd. The load capacitor IS the compensation (Razavi HO #12: “does a telescopic op amp need compensation?”).
 */
export function oneStageLoop(p: { gm: number; rout: number; cl: number; fnd: number; beta: number }): LoopSpec {
  return { a0: p.gm * p.rout, poles: [1 / (2 * Math.PI * p.rout * p.cl), p.fnd], beta: p.beta };
}

/**
 * Smallest CL that gives a one-stage op amp the phase margin PM (hand method: the output pole gives −90°
 * at ωgx, and ωgx ≈ β·gm/CL once βA0 ≫ 1). The internal pole may use 90° − PM:
 *   β·gm/(2π·CL) = fnd·tan(90° − PM)  ⇒  CL = β·gm / (2π·fnd·tan(90° − PM)).
 * A bigger CL only adds margin (and costs speed); in a two-stage op amp CL sets the non-dominant pole instead.
 */
export function clForPhaseMargin(p: { gm: number; fnd: number; pm: number; beta: number }): number {
  return (p.beta * p.gm) / (2 * Math.PI * p.fnd * Math.tan(rad(90 - p.pm)));
}

/** Hand phase margin of a one-stage op amp: PM ≈ 90° − atan(β·gm/(2π·CL) ÷ fnd) (output pole gives −90°). */
export function oneStagePmHand(p: { gm: number; cl: number; fnd: number; beta: number }): number {
  return 90 - (Math.atan((p.beta * p.gm) / (2 * Math.PI * p.cl) / p.fnd) * 180) / Math.PI;
}
