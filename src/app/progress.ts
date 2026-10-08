/**
 * Mastery state and "your next step". Every unit is open (the student asked to roam freely); the
 * suggested order still follows the curriculum, and mastery is still tracked and shown.
 */
import { LESSONS, UNITS, UNIT_BY_ID } from '../content';
import type { Unit } from '../content/types';
import { getProgress, type Progress } from './store';

export type UnitState = 'locked' | 'learning' | 'mastered' | 'coming';

export function unitMastered(u: Unit, p: Progress): boolean {
  return u.lessons.length > 0 && u.lessons.every((l) => p.lessons[l]?.status === 'mastered');
}

export function unitState(u: Unit, p: Progress = getProgress()): UnitState {
  if (u.placeholder || u.lessons.length === 0) return 'coming';
  if (unitMastered(u, p)) return 'mastered';
  return 'learning';
}

export function lessonUnlocked(lessonId: string, p: Progress = getProgress()): boolean {
  const l = LESSONS.find((x) => x.id === lessonId);
  if (!l) return false;
  return unitState(UNIT_BY_ID[l.unit], p) !== 'locked';
}

export function nextLessonAfter(lessonId: string): string | undefined {
  const i = LESSONS.findIndex((l) => l.id === lessonId);
  return LESSONS[i + 1]?.id;
}

/** The first unmastered lesson in an unlocked unit: always shown as "your next step". */
export function nextStep(p: Progress = getProgress()): { lesson?: string; unit?: string; done: boolean } {
  for (const u of UNITS) {
    const st = unitState(u, p);
    if (st === 'coming') continue;
    if (st === 'locked') return { unit: u.id, done: false };
    for (const l of u.lessons) if (p.lessons[l]?.status !== 'mastered') return { lesson: l, unit: u.id, done: false };
  }
  return { done: true };
}

export function daysUntil(isoDate: string, now = new Date()): number {
  const target = new Date(isoDate + 'T00:00:00');
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}

/** A lesson counts as covered once you have reached its last step (or mastered it). */
export function lessonCovered(id: string, p: Progress = getProgress()): boolean {
  const l = p.lessons[id];
  return !!l && (l.status === 'mastered' || l.step >= 7);
}

export function unitCovered(u: Unit, p: Progress = getProgress()): boolean {
  return u.lessons.length > 0 && u.lessons.every((l) => lessonCovered(l, p));
}

/** Can you attempt this question yet? Ready once every topic it is tagged with is covered. */
export function problemReady(tags: string[], p: Progress = getProgress()): { ready: boolean; missing: string[] } {
  const missing = tags.filter((t) => UNIT_BY_ID[t] && !unitCovered(UNIT_BY_ID[t], p));
  return { ready: missing.length === 0, missing };
}

/** Solved = every part answered right at least once. */
export function problemSolved(problemId: string, keys: string[], p: Progress = getProgress()): boolean {
  const s = p.sheets?.[problemId];
  return !!s && keys.length > 0 && keys.every((k) => s[k]);
}
