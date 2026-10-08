/**
 * Exam temperament helpers for every question:
 *  - timeBudget: how long this question should take in the exam (marks × minutes-per-mark when the paper gives
 *    marks; otherwise estimated from the parts and the length of the solution, calibrated to the mid-sem's
 *    60 marks in 90 minutes = 1.5 min/mark);
 *  - calcTips: fx-991CW keystrokes, the problem's own or inferred from what its solution computes, and whether
 *    the calculator is a big win here;
 *  - speedTips: how to get to the answer faster for this kind of question (no shortcuts on understanding).
 */
import type { CalcStep, Problem } from './schema';

export interface Budget {
  /** Seconds: the exam allotment (marks × minutes-per-mark). */
  total: number;
  /** Seconds: the ideal time to aim for — leaves the paper's reading + checking time spare. */
  target: number;
  /** Seconds per answer part, in order. */
  parts: number[];
  basis: string;
  marks?: number;
}

/**
 * Your exams (course handout + past papers): mid-sem 90 min for 60 marks (1.5 min/mark), closed book;
 * quizzes 30 min for 15 marks (2 min/mark). Ideal pace = allotment × 5/6: over a full mid-sem that saves
 * 15 min — about 5 to read the paper and choose an order, 10 to check answers and units at the end.
 */
export const EXAM_PACE = { midsem: { minutes: 90, marks: 60 }, quiz: { minutes: 30, marks: 15 }, idealFraction: 5 / 6 };
const MIDSEM_MIN_PER_MARK = EXAM_PACE.midsem.minutes / EXAM_PACE.midsem.marks;
const QUIZ_MIN_PER_MARK = EXAM_PACE.quiz.minutes / EXAM_PACE.quiz.marks;

function marksOf(source: string): number | undefined {
  const m = source.match(/(\d+)\s*marks?/i);
  return m ? Number(m[1]) : undefined;
}

export function timeBudget(p: Problem): Budget {
  const n = Math.max(1, p.unknowns.length);
  const marks = marksOf(p.source);
  let total: number, basis: string;
  if (marks) {
    const quiz = /quiz/i.test(p.source);
    const rate = quiz ? QUIZ_MIN_PER_MARK : MIDSEM_MIN_PER_MARK;
    total = marks * rate * 60;
    basis = `${marks} marks × ${rate} min/mark (${quiz ? 'quiz pace: 15 marks in 30 min' : 'mid-sem pace: 60 marks in 90 min'})`;
  } else {
    // Each part ≈ 2.5 min, plus reading/setting-up time, plus ~0.4 min per solution step beyond the parts.
    const extraSteps = Math.max(0, p.steps.length - n);
    const minutes = 2 + 2.5 * n + 0.4 * extraSteps + (p.figure || p.printed ? 1 : 0);
    total = Math.round(minutes * 2) * 30; // round to 30 s
    basis = `≈ 2 min to read and set up + 2.5 min per part (${n}) + time for the longer derivation steps — mid-sem pace`;
  }
  total = Math.max(120, Math.round(total / 30) * 30);
  const setup = Math.min(total * 0.2, 120);
  const each = (total - setup) / n;
  const target = Math.round((total * EXAM_PACE.idealFraction) / 30) * 30;
  return { total, target, parts: p.unknowns.map(() => each), basis, marks };
}

export function fmtTime(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// ─── Calculator: what to type, inferred from what the solution actually computes ─────────

const RECIPE: Record<string, CalcStep> = {
  eng: { what: 'Type µ, m, k, M, p directly (no powers of ten to track)', keys: '[CATALOG] ▸ Engineer Symbol ▸ µ … (set Calc Settings ▸ Engineer Symbol ▸ On once)' },
  square: { what: 'Square law in one line, both ways', keys: 'W/L = 2 × ID ÷ ( µCox × Vov² )   ·   Vov = √( 2 × ID ÷ ( µCox × W/L ) )' },
  gm: { what: 'gm and rO without rounding', keys: 'gm = 2 × ID ÷ Vov → STO A ;  rO = 1 ÷ ( λ × ID ) → STO B ;  then A × B for gm·rO' },
  parallel: { what: 'Parallel resistances (the ‖ in every gain)', keys: '( R1⁻¹ + R2⁻¹ )⁻¹   — chain as many as you need' },
  pm: { what: 'Phase margin: arctangents in DEGREE mode', keys: '180 − tan⁻¹( f ÷ fp1 ) − tan⁻¹( f ÷ fp2 ) − tan⁻¹( f ÷ fz )' },
  solver: { what: 'Crossover where |βA| = 1 (no quadratic by hand)', keys: '[HOME] ▸ Equation ▸ Solver:  βA0 ÷ ( √(1+(x÷fp1)²) × √(1+(x÷fp2)²) ) = 1' },
  ln: { what: 'Settling: ln and e^ directly', keys: 't = τ × ln( 1 ÷ ε )   ·   Vout = V0 × Acl × ( 1 − e^( −t ÷ τ ) )' },
  db: { what: 'dB ↔ V/V', keys: '20 log( x )   ·   10^( dB ÷ 20 )' },
  peak: { what: 'Peaking ↔ phase margin', keys: '1 ÷ ( 2 sin( PM ÷ 2 ) )   ·   2 sin⁻¹( 1 ÷ ( 2K ) )' },
  quad: { what: 'Quadratics (triode, degeneration)', keys: '[HOME] ▸ Equation ▸ Polynomial ▸ ax²+bx+c' },
  pi: { what: 'Frequencies: 2π once at the end', keys: 'f = gm ÷ ( 2π × CL )   — keep ω in memory, divide by 2π only for the final answer' },
};

export interface CalcAdvice {
  steps: CalcStep[];
  /** Big win: several long numeric chains, arctangent sums, a solver, or nested square roots. */
  big: boolean;
  why: string;
}

export function calcTips(p: Problem): CalcAdvice | null {
  const text = p.steps.map((s) => `${s.title} ${s.tex ?? ''}`).join(' ') + ' ' + p.statement;
  const keys: string[] = [];
  const has = (re: RegExp) => re.test(text);
  if (has(/µ|\\mu|mA|µA|pF|MHz|kΩ|\\Omega/)) keys.push('eng');
  if (has(/W\/L|\\frac\{W\}\{L\}|V_\{ov|sqrt|square law/)) keys.push('square');
  if (has(/g_\{?m|r_\{?O/)) keys.push('gm');
  if (has(/\\parallel|‖/)) keys.push('parallel');
  if (has(/tan\^\{-1\}|\\tan|PM|phase margin/i)) keys.push('pm');
  if (has(/crossover|\|\\beta A\| ?= ?1|ω_?gx|omega_\{?gx|f_\{?gx/i)) keys.push('solver');
  if (has(/\\ln|ln\(|e\^\{?-|settl/i)) keys.push('ln');
  if (has(/dB|log/)) keys.push('db');
  if (has(/sin\(|\\sin|peak/i)) keys.push('peak');
  if (has(/quadratic|polynomial/i)) keys.push('quad');
  if (has(/2\\pi|2π/)) keys.push('pi');
  const steps = [...(p.calc ?? []), ...keys.filter((k) => k !== 'eng' || !p.calc?.length).map((k) => RECIPE[k])];
  const seen = new Set<string>();
  const uniq = steps.filter((s) => (seen.has(s.what) ? false : (seen.add(s.what), true))).slice(0, 5);
  if (!uniq.length) return null;
  const heavy = ['pm', 'solver', 'parallel', 'square', 'ln', 'peak'].filter((k) => keys.includes(k)).length;
  const big = heavy >= 2 || keys.includes('solver') || keys.includes('pm') || (p.calc?.length ?? 0) > 0;
  const why = keys.includes('solver') || keys.includes('pm')
    ? 'Arctangent sums and crossover equations are where hand arithmetic eats minutes — the calculator does them in one line.'
    : keys.includes('square') && keys.includes('parallel')
      ? 'Square roots of µ-sized numbers and parallel combinations are slow and error-prone by hand; type each in one line and store results.'
      : 'Typing µ/m/k directly and storing intermediate results avoids rounding and retyping.';
  return { steps: uniq, big, why };
}

// ─── Speed: how to get there faster, by topic ─────────────────────────────────

const SPEED: Array<{ re: RegExp; tips: string[] }> = [
  { re: /^U[0-3]$/, tips: ['Write VGS = Vth + Vov the moment you know Vov — most node voltages follow by adding/subtracting.', 'Walk the nodes from the rail down in one line each; do the fence check last, in one line.'] },
  { re: /^U[4-9]$/, tips: ['Never derive gain from a small-signal model in the exam: write Av = −Gm·Rout and fill each by inspection (gate ∞, drain rO, source 1/gm).', 'gm = 2ID/Vov is the fastest form when you already have ID and Vov.'] },
  { re: /^U10$/, tips: ['Half circuits: DM → tail is ground; CM → 2RSS. Write both gains straight from the ratio rule.', 'CM range: floor = tail + VGS1, ceiling = drain + Vth — two lines, no algebra.'] },
  { re: /^U11$|^U12$|^L2$/, tips: ['5-T OTA: four standard results — gain gm(rO2‖rO4), CM range, swing, pole. Write all four formulas first, then plug numbers in a batch.', 'Given CM limits → sizes: run each fence backwards (floor gives Vov1, ceiling gives |VGS3|).', 'Buffer bandwidth = GBW = gm/(2πCL): no new calculation if you already have gm.'] },
  { re: /^L1$/, tips: ['Gain error: A ≥ Aclosed/ε — one line. Settling: t = ln(1/ε)/(βωu) — memorise ln100 = 4.6, ln1000 = 6.9.'] },
  { re: /^L3$|^L4$/, tips: ['Design questions follow a fixed order — power → currents → swing budget → Vov → W/L → gain. Write the order down first; each step is then one line.', 'Swing budget: write “VDD − swing/side = Σ overdrives” and split it immediately.', 'Folded cascode: remember the bottom sources carry ISS/2 + I before you size anything.'] },
  { re: /^L5$/, tips: ['Two-stage: X = VDD − |VGS| of the second-stage device; gains multiply — compute A1 and A2 separately and multiply at the end.'] },
  { re: /^L6$/, tips: ['Gain boosting: walk the bias up from ground (VX = VGS3, VP = VX + VGS2). Gain = −gm1(Rup ‖ A1·gm2·rO2·rO1) — with a simple PMOS load, Rup ≈ its rO decides the answer, so you can sanity-check instantly.'] },
  { re: /^L7$|^L8$/, tips: ['Triode sensing: write ID = ½µCox(W/L)[2(VGS − Vth)VDS − VDS²] with VGS = output CM and VDS = VP, solve for W/L in one line.', 'CMRR: compute Ad and ACM separately, divide at the end; dB only if asked.'] },
  { re: /^L9$/, tips: ['Slew: SR = I/C. Check whether the step slews by comparing V0·Acl/τ with SR before doing any exponential.'] },
  { re: /^L1[0-4]$/, tips: ['PM questions: find the crossover with the Solver (or the high-frequency approximation ωgx ≈ √(βA0·ωp1·ωp2)), then one arctangent sum in degree mode.', 'Peaking ↔ PM: K = 1/(2 sin(PM/2)) — one keystroke line either way.', 'Miller: SR = I5/Cc, GBW = gm1/(2πCc), p2 = gm2/(2πCL), z = gm2/(2πCc) — write all four, then plug in.'] },
];

export function speedTips(p: Problem): string[] {
  const out: string[] = [];
  for (const t of p.tags) for (const s of SPEED) if (s.re.test(t)) out.push(...s.tips);
  const b = timeBudget(p);
  out.push(`Aim for ${fmtTime(b.target)} (exam allotment ${fmtTime(b.total)}: the gap is your share of the paper’s reading and checking time). That is roughly ${fmtTime(b.parts[0] ?? b.total)} per part after a short setup. If a part has eaten double its share, write the formula with symbols (method marks) and move on.`);
  out.push('Write every formula symbolically first, then substitute; keep full precision in the calculator (STO) and round only the boxed answer, with units.');
  return [...new Set(out)];
}
