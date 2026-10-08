/** Study in lecture order: every handwritten page as a guided walk, then the questions on it. */
import { useEffect, useState } from 'react';
import { NOTE_IMG } from '../assets/papers';
import { BANK_BY_ID, LESSON_BY_ID } from '../content';
import { LECTURE_PLAN, WALKS, WALK_BY_ID } from '../content/walk';
import { orderSheet, SheetItem } from '../learn/TopicView';
import { problemSolved } from '../app/progress';
import { useProgress } from '../app/store';
import { Tex } from '../ui/Tex';
import { NoteWalk } from './NoteWalk';

export function LecturesIndex() {
  return (
    <div className="page lectures-page">
      <h1>Your lectures, one page at a time</h1>
      <p className="lede">
        Everything in the order you met it in class. Open a lecture to get: your handwritten page walked through region by region (box, arrow, enlargement, plain-words explanation, formula, memory line), the lessons that teach it, every tutorial and past-paper question on it, and its formula sheet. <strong>Lec 01–08</strong> are the mid-sem core.
      </p>
      <ol className="lec-grid">
        {WALKS.map((w) => (
          <li key={w.id} className={w.lec && w.lec <= 8 ? 'core' : ''}>
            <a href={`#/lectures/${w.id}`} className="lec-card">
              <span className="lec-thumb">{NOTE_IMG[w.img] && <img src={NOTE_IMG[w.img]} alt="" loading="lazy" />}</span>
              <span className="lec-meta">
                <span className="lec-num">{w.lec ? `Lec ${String(w.lec).padStart(2, '0')}` : 'Example'} · {w.date}</span>
                <span className="lec-title">{w.title}</span>
                <span className="small muted">{w.steps.length} steps · {LECTURE_PLAN[w.id]?.lessons.length ?? 0} lessons · {LECTURE_PLAN[w.id]?.questions.length ?? 0} questions</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function LecturePage({ id }: { id: string }) {
  const w = WALK_BY_ID[id];
  const prog = useProgress();
  const [open, setOpen] = useState<Set<string>>(new Set());
  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(new Set());
  }, [id]);
  if (!w) return <p className="page">Lecture not found.</p>;
  const i = WALKS.indexOf(w);
  const prev = WALKS[i - 1], next = WALKS[i + 1];
  const plan = LECTURE_PLAN[w.id] ?? { pre: [], lessons: [], questions: [] };
  const qs = orderSheet(plan.questions.map((q) => BANK_BY_ID[q]).filter(Boolean));
  const solved = qs.filter((p) => problemSolved(p.id, p.unknowns.map((u) => u.key), prog)).length;
  const formulas = w.steps.filter((s) => s.f?.length);
  const lab = (x: typeof w) => (x.lec ? `Lec ${String(x.lec).padStart(2, '0')}` : 'Example');
  const jump = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(to)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="page lecture-page">
      <p className="small">
        <a href="#/lectures">Lectures</a> › {lab(w)}
      </p>
      <h1>
        <span className="note-lec">{w.lec ? `Lec ${String(w.lec).padStart(2, '0')} · ${w.date}` : 'Worked example'}</span>
        {w.title}
      </h1>
      <nav className="topic-jump" aria-label="On this page">
        <a href="#lec-notes" onClick={jump('lec-notes')}>1 · Your notes, explained <span className="pill">{w.steps.length}</span></a>
        {plan.pre.length > 0 && <a href="#lec-pre" onClick={jump('lec-pre')}>Background first</a>}
        <a href="#lec-lessons" onClick={jump('lec-lessons')}>2 · Lessons</a>
        {qs.length > 0 && <a href="#lec-qs" onClick={jump('lec-qs')}>3 · Questions <span className="pill">{solved}/{qs.length}</span></a>}
        {formulas.length > 0 && <a href="#lec-f" onClick={jump('lec-f')}>4 · Formula sheet</a>}
      </nav>

      <section id="lec-notes" className="lec-sec">
        <h2 className="lec-h"><span className="lec-step">1</span> Your notes, region by region</h2>
        <p className="small muted">Click a numbered box on your page or a step on the right. Arrow keys ← → move between steps.</p>
        <NoteWalk page={w} />
      </section>

      {plan.pre.length > 0 && (
        <section id="lec-pre" className="lec-sec">
          <h2 className="lec-h"><span className="lec-step">!</span> Background this lecture assumes</h2>
          <p className="small muted">If any of these feel shaky, do them first: each is a short lesson with a picture, a prediction and practice.</p>
          <div className="lec-lessons">
            {plan.pre.map((l) => (
              <a key={l} className="lec-lesson pre" href={`#/learn/${l}`}>
                <span className="small muted">{LESSON_BY_ID[l].unit}</span>
                <strong>{LESSON_BY_ID[l].title}</strong>
              </a>
            ))}
          </div>
        </section>
      )}

      <section id="lec-lessons" className="lec-sec">
        <h2 className="lec-h"><span className="lec-step">2</span> Learn it properly</h2>
        <div className="lec-lessons">
          {plan.lessons.map((l) => (
            <a key={l} className="lec-lesson" href={`#/learn/${l}`}>
              <span className="small muted">{LESSON_BY_ID[l].unit} · {LESSON_BY_ID[l].minutes} min</span>
              <strong>{LESSON_BY_ID[l].title}</strong>
              <span className="small">{LESSON_BY_ID[l].why}</span>
            </a>
          ))}
        </div>
      </section>

      {qs.length > 0 && (
        <section id="lec-qs" className="lec-sec topic-page">
          <h2 className="lec-h"><span className="lec-step">3</span> Every question on this lecture</h2>
          <p className="small muted">Tutorials, past mid-sems and quizzes, problem sets. Each shows the question as printed (kept in view while you scroll), hints, a concept + formulas box and the full solution.</p>
          <ul className="sheet-list">
            {qs.map((p) => (
              <SheetItem
                key={p.id}
                p={p}
                here="*"
                open={open.has(p.id)}
                onToggle={() =>
                  setOpen((o) => {
                    const n = new Set(o);
                    if (n.has(p.id)) n.delete(p.id);
                    else n.add(p.id);
                    return n;
                  })
                }
              />
            ))}
          </ul>
        </section>
      )}

      {formulas.length > 0 && (
        <section id="lec-f" className="lec-sec">
          <h2 className="lec-h"><span className="lec-step">4</span> Formula sheet for {lab(w)}</h2>
          <div className="lec-fsheet">
            {formulas.map((s) => (
              <div key={s.t} className="lec-frow">
                <div className="lec-ft">{s.t}</div>
                <div className="lec-ff">
                  {s.f!.map((f, j) => (
                    <Tex key={j} tex={f} block />
                  ))}
                </div>
                {s.m && <div className="small muted">💡 {s.m}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      <nav className="note-pager">
        {prev ? <a href={`#/lectures/${prev.id}`}>← {lab(prev)}: {prev.title}</a> : <span />}
        {next ? <a href={`#/lectures/${next.id}`}>{lab(next)}: {next.title} →</a> : <span />}
      </nav>
    </div>
  );
}
