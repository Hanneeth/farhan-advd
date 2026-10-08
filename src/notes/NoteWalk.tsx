/**
 * A guided walk through one of your handwritten pages. Left: the scan, with every region boxed and numbered;
 * the current one is spotlighted (the rest of the page dims) and an arrow tag points at it. Right: the same
 * region zoomed in, then the plain-words explanation, the formula to keep and a line to remember it by.
 * Click a box, a step, or use ← → to move.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { NOTE_IMG } from '../assets/papers';
import { BANK_BY_ID, LESSON_BY_ID } from '../content';
import type { Box, WalkPage, WalkStep } from '../content/walk';
import { WALK_BOXES } from '../content/walkBoxes';
import { WALK_TEXT } from '../content/walkText';
import { recallsFor } from '../content/recall';
import { WALK_DOUBTS, WALK_FIGS } from '../content/doubts';
import { WOVEN } from '../content/walkWoven';
import { WovenProse } from './Doubts';
import { RichText } from '../ui/RichText';
import { Tex } from '../ui/Tex';

/** Page height ÷ width of each scan (they load at 900 px wide in the grid renders). */
const ASPECT: Record<string, number> = {
  lec01: 1215 / 900, lec02: 1132 / 900, lec03: 1328 / 900, lec04: 2793 / 900, lec05: 1876 / 900, lec06: 1521 / 900,
  lec07: 2790 / 900, lec08: 3349 / 900, lec09: 2718 / 900, lec10: 1796 / 900, lec11: 1697 / 900, lec12: 2595 / 900,
  lec13: 2273 / 900, lec14: 2074 / 900, lec15: 2391 / 900, lec16: 2178 / 900, lec17: 1846 / 900, settling: 1970 / 900,
};

function union(bs: Box[]): Box {
  const x0 = Math.min(...bs.map((b) => b[0])), y0 = Math.min(...bs.map((b) => b[1]));
  const x1 = Math.max(...bs.map((b) => b[0] + b[2])), y1 = Math.max(...bs.map((b) => b[1] + b[3]));
  const pad = 1;
  return [Math.max(0, x0 - pad), Math.max(0, y0 - pad), Math.min(100, x1 + pad) - Math.max(0, x0 - pad), Math.min(100, y1 + pad) - Math.max(0, y0 - pad)];
}

function Zoom({ src, box, aspect }: { src: string; box: Box; aspect: number }) {
  const [x, y, w, h] = box;
  // container aspect = (w% of width) : (h% of height·aspect)
  const ratio = w / (h * aspect);
  return (
    <div className="walk-zoom" style={{ aspectRatio: String(ratio), width: `min(100%, ${Math.round(380 * ratio)}px)` }}>
      <img src={src} alt="" style={{ width: `${10000 / w}%`, left: `${(-x / w) * 100}%`, top: `${(-y / h) * 100}%` }} />
    </div>
  );
}

/** The step's regions as computed from the ink (falls back to the hand-placed ones). */
function boxesOf(page: WalkPage, i: number): Box[] {
  return WALK_BOXES[page.id]?.[i] ?? page.steps[i].b;
}

export function NoteWalk({ page: raw, only, compact }: { page: WalkPage; only?: number[]; compact?: boolean }) {
  const page: WalkPage = useMemo(() => ({ ...raw, steps: raw.steps.map((s: WalkStep, i: number) => ({ ...s, b: boxesOf(raw, i) })) }), [raw]);
  const order = useMemo(() => only ?? page.steps.map((_, i) => i), [only, page]);
  const [k, setK] = useState(0);
  const idx = order[Math.min(k, order.length - 1)];
  const step = page.steps[idx];
  const src = NOTE_IMG[page.img];
  const aspect = ASPECT[page.img] ?? 1.4;
  const scan = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => setK(0), [page.id, only]);
  // Keep the boxed region in view inside the scan panel.
  useEffect(() => {
    const el = scan.current;
    if (!el) return;
    const img = el.querySelector('img');
    if (!img) return;
    const [, y, , h] = union(step.b);
    const H = img.getBoundingClientRect().height;
    const target = ((y + h / 2) / 100) * H - el.clientHeight / 2;
    el.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
  }, [idx, step]);
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (!root.current?.contains(document.activeElement) && document.activeElement !== document.body) return;
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select')) return;
      if (!root.current) return;
      const r = root.current.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      if (e.key === 'ArrowRight') setK((v) => Math.min(order.length - 1, v + 1));
      if (e.key === 'ArrowLeft') setK((v) => Math.max(0, v - 1));
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [order.length]);

  if (!src) return null;
  const main = step.b[0];
  // Where the arrow tag goes: beside the box if there is room, otherwise just under it.
  const roomRight = 100 - (main[0] + main[2]), roomLeft = main[0];
  const side: 'right' | 'left' | 'below' = roomRight >= 24 ? 'right' : roomLeft >= 24 ? 'left' : 'below';
  const midY = main[1] + Math.min(main[3], 8) / 2;
  const tagStyle =
    side === 'right'
      ? { left: `${main[0] + main[2] + 0.8}%`, top: `${midY}%` }
      : side === 'left'
        ? { right: `${100 - main[0] + 0.8}%`, top: `${midY}%` }
        : { left: `${Math.min(main[0] + 2, 55)}%`, top: `${Math.max(main[1], 1.5)}%` };
  const pos = order.indexOf(idx);

  return (
    <div className={`walk ${compact ? 'compact' : ''}`} ref={root}>
      <div className="walk-scan" ref={scan} aria-label="Your handwritten page with the regions marked">
        <div className="walk-sheet">
          <img src={src} alt={`Your handwritten notes, ${page.title}`} />
          <svg className="walk-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              {/* Dim everything except the union of this step's regions (overlaps stay clear). */}
              <mask id={`hole-${page.id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                <rect x="0" y="0" width="100" height="100" fill="white" />
                {step.b.map(([x, y, w, h], j) => (
                  <rect key={j} x={x} y={y} width={w} height={h} fill="black" />
                ))}
              </mask>
              {/* Outline only the outer edge of the union: hide stroke parts that fall inside any region. */}
              <mask id={`edge-${page.id}`} maskUnits="userSpaceOnUse" x="-1" y="-1" width="102" height="102">
                <rect x="-1" y="-1" width="102" height="102" fill="white" />
                {step.b.map(([x, y, w, h], j) => (
                  <rect key={j} x={x} y={y} width={w} height={h} fill="black" />
                ))}
              </mask>
            </defs>
            <rect className="walk-dim" x="0" y="0" width="100" height="100" mask={`url(#hole-${page.id})`} />
            <g mask={`url(#edge-${page.id})`}>
              {step.b.map(([x, y, w, h], j) => (
                <rect key={j} x={x} y={y} width={w} height={h} className="walk-box on" vectorEffect="non-scaling-stroke" />
              ))}
            </g>
          </svg>
          {order.map((i, n) => {
            const [x, y] = page.steps[i].b[0];
            return (
              <button
                key={i}
                type="button"
                className={`walk-num ${i === idx ? 'on' : ''}`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => setK(n)}
                aria-label={`Step ${n + 1}: ${page.steps[i].t}`}
              >
                {n + 1}
              </button>
            );
          })}
          <div className={`walk-tag ${side === 'right' ? 'from-right' : side === 'left' ? 'from-left' : 'from-below'}`} style={tagStyle}>
            <span className="walk-tag-num">{pos + 1}</span> {step.t}
          </div>
        </div>
      </div>

      <div className="walk-side">
        <div className="walk-head">
          <div className="eyebrow">
            {page.lec ? `Lec ${String(page.lec).padStart(2, '0')} · ${page.date}` : 'Worked example'} · step {pos + 1} of {order.length}
          </div>
          <div className="walk-nav">
            <button type="button" className="btn small" onClick={() => setK(Math.max(0, pos - 1))} disabled={pos === 0} aria-label="Previous step">
              ←
            </button>
            <div className="walk-dots" aria-hidden="true">
              {order.map((i, n) => (
                <button key={i} type="button" tabIndex={-1} className={n === pos ? 'on' : n < pos ? 'done' : ''} onClick={() => setK(n)} />
              ))}
            </div>
            <button type="button" className="btn small primary" onClick={() => setK(Math.min(order.length - 1, pos + 1))} disabled={pos === order.length - 1} aria-label="Next step">
              Next →
            </button>
          </div>
        </div>
        <article className="walk-card" key={idx}>
          <h3>
            <span className="walk-tag-num">{pos + 1}</span> {step.t}
          </h3>
          <div className="walk-zoom-wrap">
            <Zoom src={src} box={union(step.b)} aspect={aspect} />
            <span className="small muted">That is this part of your page, enlarged.</span>
          </div>
          {WALK_TEXT[page.id]?.[idx] ? (
            <>
              <p className="walk-see">
                <span className="walk-label">On your page</span> <RichText text={WALK_TEXT[page.id][idx].see} />
              </p>
              <div className="walk-explain">
                <span className="walk-label">Razavi’s way of seeing it</span>
                {WOVEN[page.id]?.[idx] ? <WovenProse text={WOVEN[page.id][idx]} /> : <WovenProse text={WALK_TEXT[page.id][idx].why} doubts={WALK_DOUBTS[page.id]?.[idx]} figs={WALK_FIGS[page.id]?.[idx]} />}
              </div>
            </>
          ) : (
            <div className="walk-explain">
              <WovenProse text={step.e} doubts={WALK_DOUBTS[page.id]?.[idx]} figs={WALK_FIGS[page.id]?.[idx]} />
            </div>
          )}
          {(() => {
            const tx = WALK_TEXT[page.id]?.[idx];
            const rc = recallsFor(page.id, `${tx?.see ?? ''} ${tx?.why ?? step.e} ${step.t}`);
            return rc.length ? (
              <div className="walk-recall">
                <span className="walk-label">Quick recall: ideas from earlier this step uses</span>
                <ul>
                  {rc.map((r) => (
                    <li key={r.id}>
                      <strong>{r.name}:</strong> {r.line}{' '}
                      <a className="small" href={`#/learn/${r.lesson}`}>
                        refresh →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null;
          })()}
          {step.f && (
            <div className="walk-formula">
              <div className="eyebrow">Keep this</div>
              {step.f.map((f, j) => (
                <Tex key={j} tex={f} block />
              ))}
            </div>
          )}
          {step.m && (
            <p className="walk-hook">
              <span aria-hidden="true">💡</span> <strong>Remember:</strong> {step.m}
            </p>
          )}
          {(step.q?.length || (step.l && LESSON_BY_ID[step.l])) && (
            <div className="walk-links">
              {step.l && LESSON_BY_ID[step.l] && !compact && (
                <a className="chip-link" href={`#/learn/${step.l}`}>
                  Lesson: {LESSON_BY_ID[step.l].title} →
                </a>
              )}
              {step.q
                ?.filter((q) => BANK_BY_ID[q])
                .map((q) => (
                  <a key={q} className="chip-link" href={`#/practice/${q}`}>
                    Asked in: {BANK_BY_ID[q].source.replace(/ \(.*\)$/, '')} →
                  </a>
                ))}
            </div>
          )}
        </article>
        <ol className="walk-list">
          {order.map((i, n) => (
            <li key={i} className={i === idx ? 'on' : ''}>
              <button type="button" onClick={() => setK(n)}>
                <span className="walk-tag-num">{n + 1}</span> {page.steps[i].t}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Several pages (e.g. all notes behind one lesson), one tab per page. */
export function NoteWalks({ groups, title, id }: { groups: Array<{ page: WalkPage; steps: number[] }>; title: string; id?: string }) {
  const [p, setP] = useState(0);
  if (!groups.length) return null;
  const g = groups[Math.min(p, groups.length - 1)];
  return (
    <section className="lecture-notes walk-section" id={id} aria-label={title}>
      <div className="lecture-notes-head">
        <div>
          <div className="eyebrow">Your handwritten lecture notes, explained region by region</div>
          <h2>{title}</h2>
        </div>
        {groups.length > 1 && (
          <div className="ref-tabs" role="tablist">
            {groups.map((x, i) => (
              <button key={x.page.id} type="button" role="tab" aria-selected={i === p} className={i === p ? 'on' : ''} onClick={() => setP(i)}>
                {x.page.lec ? `Lec ${String(x.page.lec).padStart(2, '0')}` : 'Example'}
              </button>
            ))}
          </div>
        )}
      </div>
      <NoteWalk page={g.page} only={g.steps.length === g.page.steps.length ? undefined : g.steps} compact />
    </section>
  );
}
