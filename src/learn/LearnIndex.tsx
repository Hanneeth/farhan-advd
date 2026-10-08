import { useState } from 'react';
import { LESSON_BY_ID, LESSONS, UNIT_BY_ID, UNITS } from '../content';
import { nextStep } from '../app/progress';
import { useProgress } from '../app/store';
import type { Unit } from '../content/types';
import { SheetLinks } from './SheetLinks';

const PARTS: Array<{ id: Unit['group']; title: string; note: string }> = [
  { id: 'foundations', title: 'Foundations (U0–U12)', note: 'The MOSFET, small signal, every single stage, the pair, the OTA, poles.' },
  { id: 'handout', title: 'Op amps (L1–L14)', note: 'The handout lectures before and around the mid-sem.' },
  { id: 'digital', title: 'Digital VLSI (L15–L38)', note: 'After the mid-sem: inverters, gates, delay, power, sequencing, datapaths, SRAM.' },
];

function LessonChip({ id }: { id: string }) {
  const p = useProgress();
  const l = LESSON_BY_ID[id];
  const st = p.lessons[id];
  const cls = st?.status === 'mastered' ? 'mastered' : st ? 'started' : '';
  return (
    <a href={`#/learn/${id}`} className={`lesson-chip ${cls}`}>
      <span className="chip-dot" />
      {l.title}
      <span className="small muted mono">{st?.status === 'mastered' ? '✓' : `${l.minutes} min`}</span>
    </a>
  );
}

export function LearnIndex() {
  const p = useProgress();
  const ns = nextStep(p);
  const [q, setQ] = useState('');
  const nextUnit = ns.lesson ? LESSON_BY_ID[ns.lesson].unit : undefined;
  const needle = q.trim().toLowerCase();
  const hits = needle
    ? LESSONS.filter((l) => {
        const u = UNIT_BY_ID[l.unit];
        return [l.title, l.id, l.unit, u?.title, u?.short, l.why].join(' ').toLowerCase().includes(needle);
      })
    : [];
  return (
    <div className="page narrow">
      <h1>Learn</h1>
      {ns.lesson && (
        <p>
          <a className="btn primary big" href={`#/learn/${ns.lesson}`}>
            Continue: {LESSON_BY_ID[ns.lesson].title} →
          </a>
        </p>
      )}
      <label className="field search">
        <span>Find a lesson</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. phase margin, folded, Miller, SRAM, L12" aria-label="Search lessons" />
      </label>
      {needle ? (
        <section className="learn-unit">
          <h2 className="small muted">{hits.length} {hits.length === 1 ? 'lesson' : 'lessons'}</h2>
          <div className="lesson-chips">
            {hits.map((l) => (
              <LessonChip key={l.id} id={l.id} />
            ))}
          </div>
        </section>
      ) : (
        PARTS.map((part) => {
          const units = UNITS.filter((u) => u.group === part.id && u.lessons.length > 0);
          const total = units.reduce((a, u) => a + u.lessons.length, 0);
          const done = units.reduce((a, u) => a + u.lessons.filter((l) => p.lessons[l]?.status === 'mastered').length, 0);
          return (
            <details key={part.id} className="learn-part" open={units.some((u) => u.id === nextUnit) || part.id !== 'digital'}>
              <summary>
                <span className="learn-part-title">{part.title}</span>
                <span className="badge">
                  {done}/{total}
                </span>
                <span className="small muted learn-part-note">{part.note}</span>
              </summary>
              {units.map((u) => (
                <section key={u.id} className="learn-unit" id={`unit-${u.id}`}>
                  <h2>
                    <span className="mono muted">{u.id}</span> {u.title}
                  </h2>
                  <div className="lesson-chips">
                    {u.lessons.map((id) => (
                      <LessonChip key={id} id={id} />
                    ))}
                  </div>
                  <SheetLinks unit={u.id} compact />
                </section>
              ))}
            </details>
          );
        })
      )}
    </div>
  );
}
