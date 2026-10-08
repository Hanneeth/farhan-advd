/**
 * Mistake catalogue (CLAUDE.md §5.4): each detected mistake gets a specific hint, not just "incorrect".
 */
import type { MistakeId } from './schema';

export const MISTAKES: Record<MistakeId, { title: string; hint: string }> = {
  forgotSquare: {
    title: 'Forgot to square Vov',
    hint: 'The square law has Vov², not Vov. Doubling the overdrive gives four times the current.',
  },
  vgsForVov: {
    title: 'Used VGS where Vov was needed',
    hint: 'The square law and gm = 2ID/Vov use the overdrive Vov = VGS − Vth, not VGS itself. Subtract the threshold first.',
  },
  forgotHalf: {
    title: 'Forgot the ½ in the square law',
    hint: 'Saturation current is ½·µCox(W/L)·Vov². Your answer is exactly twice (or half) the right one, which is the missing ½.',
  },
  forgotSatCheck: {
    title: 'Forgot to check saturation',
    hint: 'Step A ends with the fence: NMOS needs VD ≥ VG − Vth; PMOS needs VD ≤ VG + |Vth|. Check it before trusting the square law.',
  },
  pmosSign: {
    title: 'PMOS sign error',
    hint: 'For PMOS use magnitudes: |VGS| = VS − VG, |Vov| = |VGS| − |Vth|. Every quantity in the square law is positive.',
  },
  forgot2pi: {
    title: 'Forgot 2π converting ω to f',
    hint: 'Poles and GBW come out in rad/s. Divide by 2π (≈ 6.28) for Hz. Your answer is off by exactly that factor.',
  },
  forgotRo: {
    title: 'Forgot rO in parallel',
    hint: 'Everything touching the output node is in parallel: RD and the transistor’s own rO. Use RD ‖ rO when λ is given.',
  },
  roNotHalf: {
    title: 'Used rO instead of rO/2',
    hint: 'Two equal resistances in parallel give half: rO ‖ rO = rO/2.',
  },
  diodeThreshold: {
    title: 'Forgot the diode costs a full threshold',
    hint: 'A diode-connected device sits at |VGS| = |Vth| + |Vov| from its rail, not just |Vov|.',
  },
  betaVsBetaA: {
    title: 'Confused β with βA',
    hint: 'β is the fraction fed back (a divider). βA is the loop gain. The error is 1/(1 + βA).',
  },
  aInsteadOfInvBeta: {
    title: 'Used A instead of 1/β for the closed-loop gain',
    hint: 'With big A the closed-loop gain is 1/β = 1 + R1/R2, not A.',
  },
  rssNot2rss: {
    title: 'Used RSS instead of 2RSS',
    hint: 'In the common-mode half circuit each half sees 2RSS: both halves push the same current through the shared RSS.',
  },
  cascodeSimpleLoad: {
    title: 'Cascode with a simple load treated as gm·rO²',
    hint: 'A simple load rO sits in parallel with the huge cascode resistance, and the smallest wins. Cascode the load too.',
  },
  unitPrefix: {
    title: 'Wrong unit prefix',
    hint: 'The digits are right but the size is off by 1000×. Check µ (10⁻⁶) vs m (10⁻³) and k vs M.',
  },
  lnValues: {
    title: 'Mixed up the ln(1/ε) values',
    hint: '1% → ln 100 = 4.6, 0.1% → ln 1000 = 6.9, 10% → 2.3. Each decade adds 2.3.',
  },
  signFlip: {
    title: 'Sign flipped',
    hint: 'Right size, wrong sign. Fix the sign by inspection: common source inverts; follower and common gate do not.',
  },
  wrongDrop: {
    title: 'Walked the drop the wrong way',
    hint: 'A node below a resistor carrying current I from VDD sits at VDD − I·R: current flows downhill, so you lose voltage going down.',
  },
  parallelAsSeries: {
    title: 'Added resistances that are in parallel',
    hint: 'Both resistors connect the same two nodes, so they are in parallel: R1R2/(R1 + R2), smaller than either.',
  },
  forgotDegeneration: {
    title: 'Ignored the source resistor (degeneration)',
    hint: 'With RS under the source the input device is weaker: Gm = gm/(1 + gm·RS). Ratio rule: |Av| = RD/(1/gm + RS).',
  },
  ratioInverted: {
    title: 'Ratio upside down',
    hint: 'A mirror copies in proportion to size: Iout = IREF × (W/L)out ÷ (W/L)ref. The output device is on top.',
  },
  wrongTerminalRule: {
    title: 'Used the wrong impedance rule',
    hint: 'Gate = ∞. Drain = big (rO, and ×gm·rO with RS under it). Source = small (≈ 1/gm). Look at WHICH terminal you are looking into.',
  },
  issNotHalf: {
    title: 'Used ISS where each device carries ISS/2',
    hint: 'The tail current splits between the two input devices at balance: each carries ID = ISS/2. Use ISS/2 in gm, Vov and rO.',
  },
  dbConversion: {
    title: 'dB conversion slip',
    hint: 'Voltage ratios use 20·log10 (not 10·log10). 1000 V/V = 60 dB; 74 dB ≈ 5000 V/V.',
  },
  vovNotVgs: {
    title: 'Used Vov where the full VGS was needed',
    hint: 'A node voltage drop across a gate-source junction is the whole VGS = Vth + Vov, not just Vov. Only stacked drain-source headroom costs Vov.',
  },
  phaseNoInversion: {
    title: 'Phase margin measured from the wrong line',
    hint: 'PM = 180° + ∠βA at ωgx. The inversion of negative feedback is already the first 180°; the margin is how far the loop phase is from −180°, not from 0°.',
  },
  usedANotBetaA: {
    title: 'Used A where the loop gain βA was needed',
    hint: 'Stability is about the LOOP gain βA. The gain crossover is where |βA| = 1, i.e. where |A| meets the 1/β line, not where |A| = 1 (unless β = 1).',
  },
  rhpZeroAsLead: {
    title: 'Treated the right-half-plane zero as helpful',
    hint: 'A RHP zero (like Gm2/CC) lifts the magnitude like a zero but LAGS the phase like a pole: subtract atan(ω/ωz) from the phase, do not add it.',
  },
  millerNoPlusOne: {
    title: 'Miller multiplier slip',
    hint: 'The capacitor sees the input swing plus the amplified output swing: CC·(1 + A2) at the input node, not CC·A2 (close for big A2, wrong for small).',
  },
  noiseOneHalf: {
    title: 'Counted only one half of the pair',
    hint: 'Both halves of a differential pair make noise, and their noise powers add: 8kTγ(…) for the pair, not 4kTγ(…).',
  },
  noiseAmplitudesAdded: {
    title: 'Added noise amplitudes instead of powers',
    hint: 'Independent noise sources add as powers (squares): total = √(v1² + v2²), not v1 + v2. Two equal sources give √2 times one, not 2 times.',
  },
  noiseBwNoPiOver2: {
    title: 'Used f−3dB as the noise bandwidth',
    hint: 'A one-pole filter lets through more noise than a brick wall at f−3dB: its noise bandwidth is (π/2)·f−3dB. With it, R cancels and you get √(kT/C).',
  },
  wrongPmTan: {
    title: 'Mixed up the phase-margin rule',
    hint: 'With the dominant pole giving −90°, PM = 90° − atan(ωu/ωp2): 45° needs ωp2 = ωu, 60° needs ωp2 = 1.73·ωu (≈ 2.2·ωu once the RHP zero at 10ωu is included).',
  },
};

/**
 * Generic detectors that apply to any numeric answer: a 1000× prefix slip, a 2π slip (Hz/rad), a sign flip.
 */
export function genericMistake(student: number, correct: number, isFrequency: boolean, tol: number): MistakeId | undefined {
  if (correct === 0) return undefined;
  const r = student / correct;
  const close = (target: number) => Math.abs(r - target) <= Math.abs(target) * tol;
  if (close(-1)) return 'signFlip';
  for (const f of [1e3, 1e-3, 1e6, 1e-6]) if (close(f) || close(-f)) return 'unitPrefix';
  if (isFrequency && (close(2 * Math.PI) || close(1 / (2 * Math.PI)))) return 'forgot2pi';
  return undefined;
}
