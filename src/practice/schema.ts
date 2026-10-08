import type { Unit } from './units';

/** A diagram to draw next to a problem or step: a key into the figure registry plus its props. */
export interface FigureSpec {
  kind: string;
  props?: Record<string, unknown>;
}

export interface Given {
  /** TeX symbol, e.g. "V_{DD}" */
  sym: string;
  value: number;
  unit: Unit;
}

export interface Unknown {
  key: string;
  /** TeX symbol, e.g. "I_D" */
  sym: string;
  label: string;
  unit: Unit;
  /** Relative tolerance override (default: settings, ±2%). */
  tol?: number;
  /** Multiple choice: the answer is the index of the right choice. */
  choices?: string[];
}

/** Master-method tags: A DC recipe, B roles, C impedances, D gain; ✓ = a check. */
export type StepTag = 'A' | 'B' | 'C' | 'D' | '✓' | '·';

export interface TraceStep {
  tag: StepTag;
  title: string;
  /** TeX: formula with the numbers substituted. */
  tex?: string;
  note?: string;
  /** Unknown key this step produces (its value is the traced answer). */
  produces?: string;
  value?: number;
  /** Figure element ids to highlight while this step is shown. */
  highlight?: string[];
}

export type MistakeId =
  | 'forgotSquare'
  | 'vgsForVov'
  | 'forgotHalf'
  | 'forgotSatCheck'
  | 'pmosSign'
  | 'forgot2pi'
  | 'forgotRo'
  | 'roNotHalf'
  | 'diodeThreshold'
  | 'betaVsBetaA'
  | 'aInsteadOfInvBeta'
  | 'rssNot2rss'
  | 'cascodeSimpleLoad'
  | 'unitPrefix'
  | 'lnValues'
  | 'signFlip'
  | 'wrongDrop'
  | 'parallelAsSeries'
  | 'forgotDegeneration'
  | 'ratioInverted'
  | 'wrongTerminalRule'
  | 'issNotHalf'
  | 'dbConversion'
  | 'vovNotVgs'
  | 'phaseNoInversion'
  | 'usedANotBetaA'
  | 'rhpZeroAsLead'
  | 'millerNoPlusOne'
  | 'noiseOneHalf'
  | 'wrongPmTan'
  | 'noiseAmplitudesAdded'
  | 'noiseBwNoPiOver2';

export interface WrongAnswer {
  mistake: MistakeId;
  value: number;
}

export interface Problem {
  id: string;
  generator?: string;
  seed?: number;
  /** e.g. "Razavi Problem 9.2", "Tutorial 1 Q4", "generated" */
  source: string;
  /** Unit / lecture ids, e.g. ["U3"] */
  tags: string[];
  title: string;
  statement: string;
  figure?: FigureSpec;
  givens: Given[];
  unknowns: Unknown[];
  answers: Record<string, number>;
  /** Known wrong values per unknown, for diagnosis. */
  wrong: Record<string, WrongAnswer[]>;
  steps: TraceStep[];
  /** Hint ladder: nudge → which method → which formula → first worked step. */
  hints: [string, string, string, string];
  /** Warnings shown with the problem (e.g. a flagged source). */
  flags?: string[];
  /** The question exactly as printed in your paper: image keys in src/assets/papers. */
  printed?: PaperImage[];
  /** The official answer key / class solution, as images. */
  key?: PaperImage[];
  /** The idea and the formulas the question needs, in one glance. */
  inShort?: { concept: string; formulas: string[] };
  /** Keystrokes on the Casio fx-991CW that make the arithmetic fast (recipes on #/calc). */
  calc?: CalcStep[];
}

export interface PaperImage {
  img: string;
  caption: string;
}

export interface CalcStep {
  /** What this does, e.g. "W/L from the square law". */
  what: string;
  /** What to type, exactly. */
  keys: string;
  /** What the screen should show. */
  shows?: string;
}

export interface GeneratorOutput {
  problem: Problem;
  /** Is every device where it should be (saturated, positive currents, inside the rails)? */
  sane: boolean;
  why?: string;
}

export interface Generator {
  id: string;
  unit: string;
  title: string;
  make: (rng: import('./rng').Rng) => GeneratorOutput;
}
