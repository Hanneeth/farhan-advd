/**
 * Mid-sem sprint: a short plan for the days left, then every last-minute pack in course order.
 * #/sprint/print renders the packs alone for printing or saving as a PDF.
 */
import { EXAMS } from '../content/curriculum';
import { BANK_BY_ID, UNIT_BY_ID } from '../content';
import { PACKS } from '../content/sprint';
import { daysUntil } from '../app/progress';
import { PackView } from './PackView';

const PLAN: Array<{ day: string; packs: string[]; why: string }> = [
  { day: 'Day 1', packs: ['bias', 'smallsignal', 'diffpair', 'ota', 'L1'], why: 'The tools every question uses, plus the 5-T OTA (asked every year).' },
  { day: 'Day 2', packs: ['L2', 'L3', 'L4', 'L5', 'L6'], why: 'Lec 01–08: telescopic, design, folded cascode, two-stage, gain boosting (two mid-sem questions every year).' },
  { day: 'Day 3', packs: ['cmfb', 'L9', 'stability', 'comp'], why: 'CMFB, slewing, phase margin, Miller (one question each in 2024 and 2025). Then redo the past mid-sems timed.' },
];

export function SprintView({ print }: { print?: boolean }) {
  if (print)
    return (
      <div className="sprint-print">
        <header className="sprint-cover">
          <h1>Analog VLSI (EEE/INSTR F313): last-minute formulas</h1>
          <p className="muted">One pack per topic: the idea in plain words, the formulas to memorise (how to say them and how to check them), and every question type with the paper and question where it was asked.</p>
          <ol className="sprint-toc">
            {PACKS.map((p) => (
              <li key={p.id}>{p.title}</li>
            ))}
          </ol>
        </header>
        {PACKS.map((p) => (
          <PackView key={p.id} pack={p} print />
        ))}
      </div>
    );
  const mid = EXAMS[0];
  const days = daysUntil(mid.date);
  const byId = Object.fromEntries(PACKS.map((p) => [p.id, p]));
  const pyqs = Object.values(BANK_BY_ID).filter((p) => /^Mid-sem 20/.test(p.source));
  return (
    <div className="page sprint-page">
      <h1>Mid-sem sprint</h1>
      <p className="lede">
        {days > 0 ? <><strong>{days} day{days === 1 ? '' : 's'}</strong> to the mid-sem ({mid.note}). </> : null}
        Each topic below is one page of essentials. Read the idea, say the formulas out loud, then do the questions listed under “Where it was asked” — they are your actual tutorials and past papers.
      </p>
      <div className="sprint-actions">
        <a className="btn primary" href="#/sprint/print" target="_blank" rel="noreferrer">
          Printable version (save as PDF)
        </a>
        <a className="btn ghost" href="#/practice">All past papers →</a>
        <a className="btn ghost" href="#/calc">fx-991CW recipes →</a>
      </div>
      <section className="sprint-plan">
        <h2>Exam-day clock (mid-sem: 90 min, 60 marks)</h2>
        <div className="plan-grid">
          <div className="plan-card">
            <div className="eyebrow">The pace</div>
            <p>
              <strong>1.5 min per mark</strong> is the allotment (90 ÷ 60). Aim for <strong>1.25 min per mark</strong>: a 10-mark question in 12½ min, a 20-mark one in 25 min.
            </p>
          </div>
          <div className="plan-card">
            <div className="eyebrow">How the 90 minutes go</div>
            <ul>
              <li>0–5 min: read every question, mark the ones you know cold.</li>
              <li>5–80 min: solve, easiest marks first; stop a question at its allotment.</li>
              <li>80–90 min: check units, signs, saturation fences; fill in symbolic formulas for anything unfinished (method marks).</li>
            </ul>
          </div>
          <div className="plan-card">
            <div className="eyebrow">Quizzes (30 min, 15 marks)</div>
            <p>2 min per mark allotted; aim for 1⅔ min per mark. Every question in the app has a timer with both lines marked.</p>
          </div>
        </div>
        <h2>A plan for the days left</h2>
        <div className="plan-grid">
          {PLAN.map((d) => (
            <div key={d.day} className="plan-card">
              <div className="eyebrow">{d.day}</div>
              <p className="small">{d.why}</p>
              <ul>
                {d.packs.map((id) => {
                  const p = byId[id];
                  const u = p.units[p.units.length - 1];
                  return (
                    <li key={id}>
                      <a href={`#/sprint`} onClick={(e) => { e.preventDefault(); document.getElementById(`pack-${id}`)?.scrollIntoView({ behavior: 'smooth' }); }}>
                        {p.title}
                      </a>{' '}
                      <a className="small" href={`#/topic/${u}`}>
                        questions ({UNIT_BY_ID[u].id}) →
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <p className="small muted">
          Past mid-sems in the app: {pyqs.length} questions from 2023-24, 2024-25 and 2025-26 (only those inside your current handout).
        </p>
      </section>
      {PACKS.map((p) => (
        <PackView key={p.id} pack={p} />
      ))}
    </div>
  );
}
