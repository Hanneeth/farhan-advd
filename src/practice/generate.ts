/**
 * The gate every generated problem passes through:
 *  1. the bias point must be physically sane (the generator says why not);
 *  2. the direct answers (src/physics) and the traced answers (step-by-step arithmetic) must agree.
 * A problem that fails either is discarded and logged, and a new seed is tried.
 */
import { makeRng, newSeed } from './rng';
import type { Generator, Problem } from './schema';

export interface DiscardEntry {
  generator: string;
  seed: number;
  reason: string;
}

export const discardLog: DiscardEntry[] = [];

export function traceDisagreement(p: Problem, relTol = 1e-9): string | undefined {
  for (const s of p.steps) {
    if (!s.produces || s.value === undefined) continue;
    const a = p.answers[s.produces];
    const b = s.value;
    const ok = a === b || Math.abs(a - b) <= Math.max(Math.abs(a) * relTol, 1e-15);
    if (!ok) return `${s.produces}: direct ${a} vs traced ${b}`;
  }
  for (const u of p.unknowns) {
    if (!p.steps.some((s) => s.produces === u.key)) return `${u.key} has no traced step`;
  }
  return undefined;
}

export function generate(gen: Generator, seed = newSeed(), maxTries = 200): Problem {
  for (let t = 0; t < maxTries; t++) {
    const s = (seed + t * 7919) >>> 0;
    const { problem, sane, why } = gen.make(makeRng(s));
    if (!sane) {
      discardLog.push({ generator: gen.id, seed: s, reason: why ?? 'not physically sane' });
      continue;
    }
    const d = traceDisagreement(problem);
    if (d) {
      discardLog.push({ generator: gen.id, seed: s, reason: `two solves disagree — ${d}` });
      continue;
    }
    return { ...problem, id: `${gen.id}#${s}`, seed: s };
  }
  throw new Error(`generator ${gen.id} could not produce a valid problem`);
}
