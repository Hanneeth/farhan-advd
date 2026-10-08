/**
 * Weave clarifications into an explanation: each one is placed right after the sentence where its topic first
 * comes up, so the explanation answers the question at that moment and then carries on. Figures go after the
 * sentence they illustrate. Pure (tested in content.test.ts).
 */
import { captionOf, type Doubt, type DoubtFig } from './doubts';

export type Woven =
  | { kind: 'text'; text: string }
  | { kind: 'aside'; q: string; a: string; figs?: string[] }
  | { kind: 'fig'; fig: DoubtFig };

const STOP = new Set(
  'the a an and or of to in is it its this that why what how does do did doesn’t isn’t can i my me we you your for on at by with from as be are was were not no so if then than there here which where when into same one two only just also why’s whats what’s mean means'.split(' '),
);

/** Words and symbols that identify a topic (TeX stripped to its letters: V_{th} → vth, g_mr_O → gmro). */
export function keywords(s: string): Set<string> {
  const plain = s
    .replace(/\$([^$]+)\$/g, (_m, t: string) => ' ' + t.replace(/\\[a-zA-Z]+/g, ' ').replace(/[_{}^|()\\,]/g, '') + ' ')
    .replace(/[_{}|]/g, '')
    .toLowerCase();
  const out = new Set<string>();
  for (const w of plain.split(/[^a-z0-9µ]+/)) if (w.length >= 2 && !STOP.has(w)) out.add(w.replace(/s$/, ''));
  return out;
}

/** Split into sentences, never inside $…$. */
export function sentences(text: string): string[] {
  const out: string[] = [];
  let cur = '', math = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    cur += c;
    if (c === '$') math = !math;
    if (!math && (c === '.' || c === '?' || c === '!') && (text[i + 1] === ' ' || i === text.length - 1) && !/\b(e\.g|i\.e|vs|approx)\.$/.test(cur)) {
      out.push(cur.trim());
      cur = '';
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function bestSentence(sents: string[], probe: string): number {
  const k = keywords(probe);
  let best = sents.length - 1, score = 0;
  sents.forEach((s, i) => {
    const ks = keywords(s);
    let n = 0;
    k.forEach((w) => ks.has(w) && n++);
    if (n > score) {
      score = n;
      best = i;
    }
  });
  return best;
}

/** Text paragraphs (blank-line separated) with asides and figures inserted after their sentences. */
export function weave(text: string, doubts: Doubt[] = [], figs: DoubtFig[] = []): Woven[] {
  const paras = text.trim().split(/\n\s*\n/);
  const sents: { p: number; s: string }[] = [];
  paras.forEach((p, i) => sentences(p.replace(/\s*\n\s*/g, ' ')).forEach((s) => sents.push({ p: i, s })));
  const after: Map<number, Woven[]> = new Map();
  const put = (i: number, w: Woven) => after.set(i, [...(after.get(i) ?? []), w]);
  const all = sents.map((x) => x.s);
  figs.forEach((f) => put(bestSentence(all, f.cap || captionOf(f.key)), { kind: 'fig', fig: f }));
  doubts.forEach((d) => put(bestSentence(all, d.q + ' ' + d.q), { kind: 'aside', q: d.q, a: d.a, figs: d.figs }));
  const out: Woven[] = [];
  let buf = '', para = 0;
  const flush = () => {
    if (buf.trim()) out.push({ kind: 'text', text: buf.trim() });
    buf = '';
  };
  sents.forEach((x, i) => {
    if (x.p !== para && buf) {
      flush();
      para = x.p;
    }
    buf += (buf ? ' ' : '') + x.s;
    const extra = after.get(i);
    if (extra) {
      flush();
      // figures first (the picture), then the clarifications that lean on it
      out.push(...extra.filter((e) => e.kind === 'fig'), ...extra.filter((e) => e.kind === 'aside'));
    }
  });
  flush();
  return out;
}
