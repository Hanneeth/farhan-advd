import type { FigureSpec, TraceStep } from '../practice/schema';

/** An interactive widget or a static figure shown in a lesson step. */
export type Visual = { widget: string; props?: Record<string, unknown> } | FigureSpec;

export interface PredictQ {
  prompt: string;
  choices: string[];
  answer: number;
  /** Shown after answering: why the right answer is right. */
  explain: string;
}

export interface Card {
  id: string;
  front: string;
  back: string;
}

export interface WorkedCustom {
  title: string;
  setup: string;
  figure: FigureSpec;
  steps: TraceStep[];
}

export interface Lesson {
  id: string;
  unit: string;
  title: string;
  minutes: number;
  /** Where this lives in your sources. */
  refs: { razavi?: string; book?: string; notes?: string; conversation?: string };
  /** 1. Why you need this: one sentence tied to a real tutorial/exam question. */
  why: string;
  /** 2. The picture. */
  picture: { visual: Visual; caption: string };
  /** 3. Predict before the explanation. */
  predict: PredictQ;
  /** 4. The idea: ≤ 120 words, plain language. */
  idea: string;
  analogy?: string;
  /** 5. The rule, boxed, with every symbol labelled. */
  rule: { tex: string[]; symbols: string[]; note?: string };
  /** 6. Worked example: a generator seed or a fixed-bank problem (every step shown), or custom steps. */
  worked: { generator: string; seed: number } | { bank: string } | { custom: WorkedCustom };
  /** 7. Your turn: generated problems; the first is faded (method shown), the rest independent. */
  yourTurn: { generators: string[]; count: number };
  /** 8. Lock it in. */
  lockIn: { summary: string; hook: string; cards: Card[] };
  lab?: { id: string; preset?: Record<string, number> };
}

export interface Unit {
  id: string;
  title: string;
  short: string;
  group: 'foundations' | 'handout' | 'digital';
  lessons: string[];
  prereqs: string[];
  /** Handout reference, e.g. "Handout L4 · 1st ed §9.2.4–9.2.5 · 2nd ed §9.2.4–9.2.6" */
  ref?: string;
  notes?: string;
  milestone: number;
  placeholder?: boolean;
}
