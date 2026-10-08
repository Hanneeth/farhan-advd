import { FIXED_BANK } from '../practice/bank';
import { M3_BANK } from '../practice/bankM3';
import { M4_BANK } from '../practice/bankM4';
import { M5_BANK } from '../practice/bankM5';
import { M6_BANK } from '../practice/bankM6';
import { DIGITAL_BANK } from '../practice/bankD';
import { LAB_BANK } from '../practice/bankLabs';
import { CHAT_BANK } from '../practice/bankChat';
import { ALL_GENERATORS } from '../practice/generators';
import { PYQ_BANK } from '../practice/bankPyq';
import { BANK_EXTRAS } from '../practice/bankExtras';
import { BANK_FIGURES } from '../practice/bankFigures';

import type { Generator, Problem } from '../practice/schema';
import { AUDIT_CARDS } from './audit';
import { UNITS } from './curriculum';
import { FOUNDATION_LESSONS } from './lessons/foundations';
import { SINGLE_STAGE_LESSONS } from './lessons/single';
import { DIFF_LESSONS } from './lessons/diff';
import { HANDOUT_LESSONS } from './lessons/handout';
import { LATE_LESSONS } from './lessons/late';
import { STABILITY_LESSONS } from './lessons/stability';
import { DIGITAL_LESSONS } from './lessons/digital';
import type { Lesson, Unit } from './types';

const RAW_LESSONS: Lesson[] = [...FOUNDATION_LESSONS, ...SINGLE_STAGE_LESSONS, ...DIFF_LESSONS, ...HANDOUT_LESSONS, ...LATE_LESSONS, ...STABILITY_LESSONS, ...DIGITAL_LESSONS];
/** Curriculum order: by unit, then by the unit's own lesson list (so "next lesson" follows the Path). */
const ORDER: Record<string, number> = Object.fromEntries(UNITS.flatMap((u) => u.lessons).map((id, i) => [id, i]));
export const LESSONS: Lesson[] = [...RAW_LESSONS].sort((a, b) => (ORDER[a.id] ?? 1e9) - (ORDER[b.id] ?? 1e9));
export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
export const UNIT_BY_ID: Record<string, Unit> = Object.fromEntries(UNITS.map((u) => [u.id, u]));
export const GENERATORS: Generator[] = ALL_GENERATORS;
export const GENERATOR_BY_ID: Record<string, Generator> = Object.fromEntries(GENERATORS.map((g) => [g.id, g]));
export const BANK: Problem[] = [...FIXED_BANK, ...M3_BANK, ...M4_BANK, ...M5_BANK, ...M6_BANK, ...DIGITAL_BANK, ...LAB_BANK, ...CHAT_BANK, ...PYQ_BANK].map((p) => {
  const q = p.figure || !BANK_FIGURES[p.id] ? p : { ...p, figure: BANK_FIGURES[p.id] };
  const x = BANK_EXTRAS[q.id];
  return x ? { ...x, ...q, printed: q.printed ?? x.printed, key: q.key ?? x.key, inShort: q.inShort ?? x.inShort, calc: q.calc ?? x.calc } : q;
});
export const BANK_BY_ID: Record<string, Problem> = Object.fromEntries(BANK.map((p) => [p.id, p]));

export { UNITS };

/** All review cards, by id, with the lesson they come from. */
export const CARDS = [
  ...LESSONS.flatMap((l) => l.lockIn.cards.map((c) => ({ ...c, lesson: l.id, unit: l.unit }))),
  ...AUDIT_CARDS.map((c) => ({ ...c, lesson: 'audit', unit: 'Audit' })),
];
export const CARD_BY_ID = Object.fromEntries(CARDS.map((c) => [c.id, c]));

/**
 * Tutorial, problem-set, exam and lab questions for a topic. A question belongs to the LAST topic it needs (in
 * curriculum order): that is where you can first solve it. Earlier topics it uses list it as “coming up”.
 */
const UNIT_INDEX: Record<string, number> = Object.fromEntries(UNITS.map((u, i) => [u.id, i]));
export function homeUnit(p: Problem): string | undefined {
  const known = p.tags.filter((t) => UNIT_INDEX[t] !== undefined);
  return known.sort((a, b) => UNIT_INDEX[b] - UNIT_INDEX[a])[0];
}
export function sheetProblems(unitId: string): { now: Problem[]; later: Problem[] } {
  const now: Problem[] = [];
  const later: Problem[] = [];
  for (const p of BANK) {
    if (!p.tags.includes(unitId)) continue;
    (homeUnit(p) === unitId ? now : later).push(p);
  }
  return { now, later };
}
