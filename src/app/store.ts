/**
 * Progress store: lesson mastery, review cards, the mistake log, practice stats and settings.
 * Persisted to localStorage (wrapped in try/catch) with JSON export/import.
 */
import { useSyncExternalStore } from 'react';
import type { MistakeId } from '../practice/schema';

export type LessonStatus = 'learning' | 'mastered';

export interface LessonProgress {
  status: LessonStatus;
  best: number; // best check score, 0..1
  attempts: number;
  step: number; // furthest step reached
}

export interface CardState {
  box: number; // Leitner box 1..5
  due: number; // epoch day
}

export interface MistakeEntry {
  t: number;
  problem: string;
  key: string;
  mistake?: MistakeId;
  input: string;
}

export interface Settings {
  theme: 'auto' | 'light' | 'dark';
  drawStyle: 'symbol' | 'box';
  tol: number;
  unlockAll: boolean;
}

export interface Progress {
  version: 1;
  lessons: Record<string, LessonProgress>;
  cards: Record<string, CardState>;
  mistakes: MistakeEntry[];
  practice: { attempted: number; correct: number };
  settings: Settings;
  /** Actions per day (epoch day → count): lesson steps, checks, practice answers, reviews. For the streak. */
  activity: Record<number, number>;
  /** Tutorial / PYQ / problem-set questions: which parts you have got right at least once. */
  sheets: Record<string, Record<string, boolean>>;
}

const KEY = 'analog-gym/progress/v1';

export function emptyProgress(): Progress {
  return {
    version: 1,
    lessons: {},
    cards: {},
    mistakes: [],
    practice: { attempted: 0, correct: 0 },
    settings: { theme: 'auto', drawStyle: 'symbol', tol: 0.02, unlockAll: false },
    activity: {},
    sheets: {},
  };
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyProgress();
    return migrate(JSON.parse(raw));
  } catch {
    return emptyProgress();
  }
}

export function migrate(x: unknown): Progress {
  const base = emptyProgress();
  if (!x || typeof x !== 'object') return base;
  const p = x as Partial<Progress>;
  return {
    version: 1,
    lessons: p.lessons ?? {},
    cards: p.cards ?? {},
    mistakes: Array.isArray(p.mistakes) ? p.mistakes.slice(-500) : [],
    practice: p.practice ?? base.practice,
    settings: { ...base.settings, ...(p.settings ?? {}) },
    activity: p.activity && typeof p.activity === 'object' ? p.activity : {},
    sheets: p.sheets && typeof p.sheets === 'object' ? p.sheets : {},
  };
}

let state: Progress = typeof window === 'undefined' ? emptyProgress() : load();
const listeners = new Set<() => void>();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: progress lives for this session only */
  }
}

export function update(fn: (p: Progress) => Progress) {
  state = fn(state);
  save();
  listeners.forEach((l) => l());
}

export function getProgress(): Progress {
  return state;
}

export function useProgress(): Progress {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}

// ─── Actions ───────────────────────────────────────────────────────────────

export const MASTERY = 0.8;

export function today(): number {
  return Math.floor(Date.now() / 86_400_000);
}

function bump(p: Progress): Progress['activity'] {
  const d = today();
  return { ...p.activity, [d]: (p.activity[d] ?? 0) + 1 };
}

/** Consecutive days with activity, ending today (or yesterday, if nothing yet today). */
export function streak(p: Progress, now = today()): number {
  let d = p.activity[now] ? now : now - 1;
  let n = 0;
  while (p.activity[d]) {
    n++;
    d--;
  }
  return n;
}

export function recordLessonStep(id: string, step: number) {
  update((p) => {
    const cur = p.lessons[id] ?? { status: 'learning', best: 0, attempts: 0, step: 0 };
    return { ...p, activity: bump(p), lessons: { ...p.lessons, [id]: { ...cur, step: Math.max(cur.step, step) } } };
  });
}

/** Record one part of a tutorial / PYQ question; a part stays “right” once you have got it right. */
export function recordSheetPart(problemId: string, key: string, correct: boolean) {
  update((p) => {
    const cur = p.sheets[problemId] ?? {};
    return { ...p, activity: bump(p), sheets: { ...p.sheets, [problemId]: { ...cur, [key]: cur[key] || correct } } };
  });
}

/** Record a mastery check. Mastered at ≥ 80% with at least one numeric problem correct. */
export function recordCheck(id: string, score: number, numericCorrect: boolean, cardIds: string[]) {
  update((p) => {
    const cur = p.lessons[id] ?? { status: 'learning', best: 0, attempts: 0, step: 0 };
    const mastered = cur.status === 'mastered' || (score >= MASTERY && numericCorrect);
    const cards = { ...p.cards };
    for (const c of cardIds) if (!cards[c]) cards[c] = { box: 1, due: today() };
    return {
      ...p,
      activity: bump(p),
      cards,
      lessons: { ...p.lessons, [id]: { ...cur, attempts: cur.attempts + 1, best: Math.max(cur.best, score), status: mastered ? 'mastered' : 'learning' } },
    };
  });
}

/** Add cards to the review deck (due today) without touching lesson progress. */
export function addCards(ids: string[]) {
  update((p) => {
    const cards = { ...p.cards };
    for (const c of ids) if (!cards[c]) cards[c] = { box: 1, due: today() };
    return { ...p, cards };
  });
}

export function logMistake(e: Omit<MistakeEntry, 't'>) {
  update((p) => ({ ...p, mistakes: [...p.mistakes, { ...e, t: Date.now() }].slice(-500) }));
}

export function recordPractice(correct: boolean) {
  update((p) => ({ ...p, activity: bump(p), practice: { attempted: p.practice.attempted + 1, correct: p.practice.correct + (correct ? 1 : 0) } }));
}

/** Leitner: right → next box (interval 1, 2, 4, 8, 16 days); wrong → box 1, due today. */
export const LEITNER_DAYS = [0, 1, 2, 4, 8, 16];

export function reviewCard(id: string, right: boolean) {
  update((p) => {
    const cur = p.cards[id] ?? { box: 1, due: today() };
    const box = right ? Math.min(5, cur.box + 1) : 1;
    return { ...p, activity: bump(p), cards: { ...p.cards, [id]: { box, due: today() + (right ? LEITNER_DAYS[box] : 0) } } };
  });
}

export function setSettings(s: Partial<Settings>) {
  update((p) => ({ ...p, settings: { ...p.settings, ...s } }));
}

export function exportProgress(): string {
  return JSON.stringify(state, null, 2);
}

export function importProgress(json: string): { ok: boolean; error?: string } {
  try {
    const parsed = JSON.parse(json);
    if (parsed?.version !== 1) return { ok: false, error: 'That file is not an Analog Gym progress export.' };
    update(() => migrate(parsed));
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not read that file as JSON.' };
  }
}

export function resetProgress() {
  update(() => ({ ...emptyProgress(), settings: state.settings }));
}
