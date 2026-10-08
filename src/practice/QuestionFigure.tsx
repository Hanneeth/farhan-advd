/**
 * A problem's figure in “question mode”: every number drawn on it that is not given (in the givens or the
 * statement) is replaced by “?”, and the hover inspector is off, so the figure never gives away an answer or an
 * intermediate step. With `reveal` (worked examples, or once the full solution is open) it is drawn as is.
 */
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Figure } from '../circuits/registry';
import type { Problem } from './schema';
import { parseSI } from './units';

/** A number with an SI unit (“0.65 V”, “9 kΩ”, “120 µA”, “630 ps”) or a bare number with a decimal point. */
const TOKEN = /[−-]?\d+(?:\.\d+)?\s?(?:[pnuµmkMG])?(?:V|A|Ω|F|Hz|s|W)(?![a-zA-Z])|[−-]?\d+\.\d+(?![\d.])/g;

type Val = { v: number; u: string };
const UNIT = /(V|A|Ω|F|Hz|s|W)$/;

function valueOf(token: string): Val | undefined {
  const t = token.replace('−', '-').replace(/\s/g, '');
  const r = parseSI(t, '');
  if (!r.ok || r.value === undefined) return undefined;
  return { v: r.value, u: t.match(UNIT)?.[1] ?? '' };
}

/** Values the student is allowed to see on the figure: the givens and every number in the statement (with units). */
function allowedValues(p: Problem): Val[] {
  const vals: Val[] = p.givens.map((g) => ({ v: g.value, u: (g.unit.match(UNIT)?.[1] ?? '') as string }));
  for (const m of p.statement.match(TOKEN) ?? []) {
    const v = valueOf(m);
    if (v) vals.push(v);
  }
  return vals;
}

function isAllowed(x: Val, allowed: Val[]): boolean {
  return allowed.some((a) => a.u === x.u && (a.v === 0 ? Math.abs(x.v) < 1e-12 : Math.abs(x.v - a.v) <= Math.abs(a.v) * 0.006));
}

function mask(root: HTMLElement, allowed: Val[]) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if ((n.parentElement?.closest('svg') ?? null) !== null) nodes.push(n as Text);
  for (const n of nodes) {
    const text = n.data;
    TOKEN.lastIndex = 0;
    if (!TOKEN.test(text)) continue;
    TOKEN.lastIndex = 0;
    const out = text.replace(TOKEN, (tok) => {
      const v = valueOf(tok);
      return v === undefined || isAllowed(v, allowed) ? tok : '?';
    });
    if (out !== text) n.data = out;
  }
}

export function QuestionFigure({ problem, reveal, highlight }: { problem: Problem; reveal?: boolean; highlight?: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const allowed = useMemo(() => allowedValues(problem), [problem]);
  const fig = problem.figure!;
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reveal) return;
    mask(el, allowed);
    // Figures re-render their own text (e.g. live labels); mask again whenever the drawing changes.
    const obs = new MutationObserver(() => {
      obs.disconnect();
      mask(el, allowed);
      obs.observe(el, { subtree: true, childList: true, characterData: true });
    });
    obs.observe(el, { subtree: true, childList: true, characterData: true });
    return () => obs.disconnect();
  });
  return (
    <div ref={ref} key={reveal ? 'shown' : 'masked'}>
      <Figure kind={fig.kind} props={reveal ? fig.props : { ...(fig.props ?? {}), inspector: false }} highlight={highlight} />
    </div>
  );
}
