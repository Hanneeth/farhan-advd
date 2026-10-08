import { genericMistake, MISTAKES } from './mistakes';
import type { MistakeId, Problem } from './schema';
import { formatSI, parseSI } from './units';

export const DEFAULT_TOL = 0.02;

export interface CheckResult {
  status: 'correct' | 'wrong' | 'invalid';
  message: string;
  mistake?: MistakeId;
  value?: number;
}

function within(a: number, b: number, tol: number): boolean {
  if (b === 0) return Math.abs(a) <= 1e-9;
  return Math.abs(a - b) <= Math.abs(b) * tol;
}

export function checkAnswer(problem: Problem, key: string, input: string, tol = DEFAULT_TOL): CheckResult {
  const u = problem.unknowns.find((x) => x.key === key);
  if (!u) throw new Error(`unknown ${key}`);
  if (u.choices) {
    const idx = Number(input);
    const right = problem.answers[key];
    if (idx === right) return { status: 'correct', message: `Correct: ${u.choices[right]}.`, value: idx };
    const w = (problem.wrong[key] ?? []).find((x) => x.value === idx);
    return {
      status: 'wrong',
      message: w ? MISTAKES[w.mistake].hint : `Not ${u.choices[idx]}. Check the fence again.`,
      mistake: w?.mistake,
      value: idx,
    };
  }
  const parsed = parseSI(input, u.unit);
  if (!parsed.ok) return { status: 'invalid', message: parsed.error ?? 'Could not read that.' };
  const value = parsed.value!;
  const correct = problem.answers[key];
  const t = u.tol ?? tol;
  if (within(value, correct, t)) {
    return { status: 'correct', message: `Correct: ${formatSI(correct, u.unit)}.`, value };
  }
  // Specific wrong answers the generator predicted.
  for (const w of problem.wrong[key] ?? []) {
    if (within(value, w.value, t)) {
      return { status: 'wrong', message: MISTAKES[w.mistake].hint, mistake: w.mistake, value };
    }
  }
  const g = genericMistake(value, correct, u.unit === 'Hz' || u.unit === 'rad/s', t);
  if (g) return { status: 'wrong', message: MISTAKES[g].hint, mistake: g, value };
  const ratio = value / correct;
  const direction = ratio > 1 ? 'too big' : 'too small';
  return {
    status: 'wrong',
    message: `Not yet: that is ${direction} by ${Math.abs(ratio) > 1 ? ratio.toFixed(2) : (1 / ratio).toFixed(2)}×. Try the next hint.`,
    value,
  };
}
