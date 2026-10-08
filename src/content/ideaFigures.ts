/**
 * The figure shown beside the text-only lesson steps (Idea, Rule, Lock it in). By default a lesson reuses the
 * figure of its worked example (the same circuit the numbers are about); these entries pick a figure for
 * lessons whose worked example has none, or where another figure matches the idea better.
 */
import type { FigureSpec } from '../practice/schema';
import { EX_9_7, ex97, tut5Q1 } from '../physics';

const E97 = ex97();

export const IDEA_FIGURES: Record<string, FigureSpec> = {
  'u12-poles': { kind: 'bode', props: { a0: 1000, f0: 1e5, beta: 0.1 } },
  'u12-settling': { kind: 'step', props: { vstep: 1, tau: 5e-9, eps: 0.01 } },
  'l1-speed': { kind: 'step', props: { vstep: 1, tau: 5e-9, eps: 0.001 } },
  'l3-scaling': {
    kind: 'telescopic',
    props: { proc: EX_9_7, iss: 3e-3, wlN: E97.wlN, wlP: E97.wlP, wl9: E97.wl9, vinCm: E97.vinCm, vb1: E97.vb1, vb2: E97.vb2, vout: 1.65 },
  },
  'l2-cmchoice': { kind: 'capFeedback' },
  'l3-design': { kind: 'telescopicBias' },
  'l4-folding': { kind: 'foldingSteps' },
  'l8-cmfb': { kind: 'cmfbTriode', props: { vout1: 1.5, vout2: 1.5, vp: 0.1, wl: tut5Q1().wl } },
  'l9-slew': { kind: 'step', props: { vstep: 1, tau: 5e-9, eps: 0.01, sr: 100e6 } },
  'l11-barkhausen': { kind: 'barkhausen', props: { loopGain: 1, lag: 180 } },
  'l12-ringing': {
    kind: 'closedStep',
    props: {
      specs: [
        { spec: { a0: 1000, poles: [1e5, 1.1e8], beta: 1 }, label: 'PM 45°' },
        { spec: { a0: 1000, poles: [1e5, 1e9], beta: 1 }, label: 'PM 84°' },
      ],
    },
  },
};
