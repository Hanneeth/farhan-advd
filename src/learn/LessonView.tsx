import { useEffect, useMemo, useRef, useState } from 'react';
import { Figure } from '../circuits/registry';
import { BANK_BY_ID, GENERATOR_BY_ID, LESSON_BY_ID, UNIT_BY_ID } from '../content';
import type { Lesson } from '../content/types';
import { MASTERY, recordCheck, recordLessonStep, useProgress } from '../app/store';
import { generate } from '../practice/generate';
import { ProblemView, StepTrace } from '../practice/ProblemView';
import type { CheckResult } from '../practice/checker';
import type { Problem } from '../practice/schema';
import { newSeed } from '../practice/rng';
import { RichText, Term } from '../ui/RichText';
import { Tex } from '../ui/Tex';
import { IconArrowLeft, IconArrowRight, STEP_ICONS } from '../ui/Icons';
import { WIDGETS } from './widgets';
import { TopicCta } from './SheetLinks';
import { walkForLessons } from '../content/walk';
import { NoteWalks } from '../notes/NoteWalk';
import { nextLessonAfter } from '../app/progress';
import { IDEA_FIGURES } from '../content/ideaFigures';
import { LESSON_DOUBTS, LESSON_FIGS } from '../content/doubts';
import { WovenProse } from '../notes/Doubts';
import type { FigureSpec } from '../practice/schema';

const SECTIONS = ['Why you need this', 'The picture', 'Predict', 'The idea', 'The rule', 'Worked example', 'Your turn', 'Lock it in'];
const SHORT = ['Why', 'Picture', 'Predict', 'Idea', 'Rule', 'Example', 'Your turn', 'Lock in'];

function Visual({ v }: { v: Lesson['picture']['visual'] }) {
  if ('widget' in v) {
    const W = WIDGETS[v.widget];
    return W ? <W {...(v.props ?? {})} /> : <p className="callout bad">Missing widget {v.widget}</p>;
  }
  return (
    <div className="bench">
      <Figure kind={v.kind} props={v.props} />
    </div>
  );
}

function Predict({ lesson, onAnswered, answered }: { lesson: Lesson; onAnswered: (choice: number) => void; answered: number | null }) {
  const q = lesson.predict;
  return (
    <div className="predict">
      <p className="predict-prompt">
        <RichText text={q.prompt} />
      </p>
      <div className="choices big" role="group" aria-label="Your prediction">
        {q.choices.map((c, i) => {
          const state = answered === null ? '' : i === q.answer ? 'right' : i === answered ? 'picked-wrong' : 'faded';
          return (
            <button key={i} type="button" className={`choice-card ${state}`} disabled={answered !== null} onClick={() => onAnswered(i)} data-choice={i}>
              <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
              <span>{c}</span>
            </button>
          );
        })}
      </div>
      {answered !== null && (
        <p className={`callout ${answered === q.answer ? 'ok' : 'bad'}`} role="status">
          <strong>{answered === q.answer ? 'Right!' : 'Not quite.'}</strong> <RichText text={q.explain} />
        </p>
      )}
    </div>
  );
}

function workedProblem(l: Lesson): Problem | null {
  if ('generator' in l.worked) return generate(GENERATOR_BY_ID[l.worked.generator], l.worked.seed);
  if ('bank' in l.worked) return BANK_BY_ID[l.worked.bank];
  return null;
}

/** Figure beside the text-only steps (analog lessons): a chosen figure, else the picture if static, else the worked example's. */
function sideFigure(l: Lesson, worked: Problem | null): FigureSpec | undefined {
  if (UNIT_BY_ID[l.unit]?.group === 'digital') return undefined;
  if (IDEA_FIGURES[l.id]) return IDEA_FIGURES[l.id];
  if (!('widget' in l.picture.visual)) return l.picture.visual;
  if (worked?.figure) return worked.figure;
  if ('custom' in l.worked) return l.worked.custom.figure;
  return undefined;
}

function WithFigure({ fig, children }: { fig?: FigureSpec; children: React.ReactNode }) {
  if (!fig) return <>{children}</>;
  return (
    <div className="with-figure">
      <div className="with-figure-text">{children}</div>
      <div className="with-figure-fig bench" aria-label="Circuit for this step">
        <Figure kind={fig.kind} props={fig.props} />
      </div>
    </div>
  );
}

export function LessonView({ id }: { id: string }) {
  const lesson = LESSON_BY_ID[id];
  const lessonWalks = useMemo(() => walkForLessons([id]), [id]);
  const progress = useProgress();
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [predicted, setPredicted] = useState<number | null>(null);
  const [predictRight, setPredictRight] = useState<boolean | null>(null);
  const [seedBase, setSeedBase] = useState(() => newSeed());
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [checkSaved, setCheckSaved] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStep(0);
    setReached(0);
    setPredicted(null);
    setPredictRight(null);
    setResults({});
    setCheckSaved(false);
    setSeedBase(newSeed());
    window.scrollTo({ top: 0 });
  }, [id]);

  const worked = useMemo(() => (lesson ? workedProblem(lesson) : null), [lesson]);
  const fig = useMemo(() => (lesson ? sideFigure(lesson, worked) : undefined), [lesson, worked]);
  const turnProblems = useMemo(() => {
    if (!lesson) return [];
    const out: Problem[] = [];
    for (let i = 0; i < lesson.yourTurn.count; i++) {
      const gid = lesson.yourTurn.generators[i % lesson.yourTurn.generators.length];
      out.push(generate(GENERATOR_BY_ID[gid], seedBase + i * 101));
    }
    return out;
  }, [lesson, seedBase]);

  const totalItems = 1 + turnProblems.reduce((n, p) => n + p.unknowns.length, 0);
  const firstTryRight = (predictRight ? 1 : 0) + Object.values(results).filter(Boolean).length;
  const answeredAll = turnProblems.every((p) => p.unknowns.every((u) => `${p.id}:${u.key}` in results));
  const answeredCount = turnProblems.reduce((n, p) => n + p.unknowns.filter((u) => `${p.id}:${u.key}` in results).length, 0);
  const score = firstTryRight / totalItems;
  const numericRight = turnProblems.some((p) => p.unknowns.some((u) => !u.choices && results[`${p.id}:${u.key}`]));
  const mastered = score >= MASTERY && numericRight;

  useEffect(() => {
    if (lesson && answeredAll && !checkSaved && reached >= 6) {
      setCheckSaved(true);
      recordCheck(lesson.id, score, numericRight, lesson.lockIn.cards.map((c) => c.id));
    }
  }, [lesson, answeredAll, checkSaved, reached, score, numericRight]);

  const canNext = step !== 2 || predicted !== null;

  const go = (s: number) => {
    if (!lesson) return;
    const t = Math.max(0, Math.min(SECTIONS.length - 1, s));
    setStep(t);
    if (t > reached) {
      setReached(t);
      recordLessonStep(lesson.id, t);
    }
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowRight' && canNext && step < SECTIONS.length - 1) go(step + 1);
      if (e.key === 'ArrowLeft' && step > 0) go(step - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!lesson) return <p className="page">Lesson not found.</p>;
  const unit = UNIT_BY_ID[lesson.unit];
  const lp = progress.lessons[lesson.id];
  const next = nextLessonAfter(lesson.id);

  const onTurnResult = (p: Problem) => (k: string, r: CheckResult, first: boolean) => {
    if (!first) return;
    setResults((prev) => ({ ...prev, [`${p.id}:${k}`]: r.status === 'correct' }));
  };

  const body = (i: number) => {
    switch (i) {
      case 0:
        return (
          <WithFigure fig={fig}>
          <div className="why-block">
            <p className="why">
              <RichText text={lesson.why} />
            </p>
            <p className="small muted refs">
              {lesson.refs.razavi && <>Razavi 2nd ed {lesson.refs.razavi} · </>}
              {lesson.refs.book && <>{lesson.refs.book} · </>}
              {lesson.refs.notes && <>Your notes: {lesson.refs.notes}{lessonWalks.length ? ' (walked through on your own pages below, from step 4)' : ''} · </>}
              {lesson.refs.conversation && <>From your tutoring chat: {lesson.refs.conversation}</>}
            </p>
          </div>
          </WithFigure>
        );
      case 1:
        return (
          <>
            <Visual v={lesson.picture.visual} />
            <p className="caption">
              <RichText text={lesson.picture.caption} />
            </p>
          </>
        );
      case 2:
        return (
          <Predict
            lesson={lesson}
            answered={predicted}
            onAnswered={(choice) => {
              setPredicted(choice);
              setPredictRight(choice === lesson.predict.answer);
            }}
          />
        );
      case 3:
        return (
          <WithFigure fig={fig}>
            <div className="idea">
              <WovenProse text={lesson.idea} doubts={LESSON_DOUBTS[lesson.id]} figs={LESSON_FIGS[lesson.id]} />
            </div>
            {lesson.analogy && (
              <div className="analogy">
                <span className="eyebrow">Picture it</span>
                <p>
                  <RichText text={lesson.analogy} />
                </p>
              </div>
            )}
          </WithFigure>
        );
      case 4:
        return (
          <WithFigure fig={fig}>
            <div className="rule-box">
              {lesson.rule.tex.map((t, j) => (
                <div key={j} className="rule-line">
                  <Tex tex={t} />
                </div>
              ))}
            </div>
            <p className="small symbols">
              <span className="muted">Tap a symbol for its meaning: </span>
              {lesson.rule.symbols.map((s, j) => (
                <span key={s}>
                  {j > 0 && ' · '}
                  <Term k={s} />
                </span>
              ))}
            </p>
            {lesson.rule.note && (
              <p className="callout small">
                <RichText text={lesson.rule.note} />
              </p>
            )}
          </WithFigure>
        );
      case 5:
        if (worked) return <ProblemView problem={worked} mode="worked" />;
        if ('custom' in lesson.worked)
          return (
            <article className="problem">
              <h3>{lesson.worked.custom.title}</h3>
              <div className="problem-body">
                <div className="problem-figure bench">
                  <Figure kind={lesson.worked.custom.figure.kind} props={lesson.worked.custom.figure.props} />
                </div>
                <div className="problem-text">
                  <p>{lesson.worked.custom.setup}</p>
                </div>
              </div>
              <StepTrace steps={lesson.worked.custom.steps} />
            </article>
          );
        return null;
      case 6:
        return (
          <>
            <p className="small muted">
              Problem 1 shows the method and you fill in the numbers. After that you're on your own. Type answers like <code>90u</code>, <code>9k</code> or <code>0.6m</code>.
            </p>
            <div className="turn-progress small" aria-live="polite">
              {answeredCount}/{totalItems - 1} answers checked
            </div>
            {turnProblems.map((p, j) => (
              <ProblemView key={p.id} problem={p} mode={j === 0 ? 'faded' : 'independent'} onResult={onTurnResult(p)} compact number={j + 1} />
            ))}
          </>
        );
      default:
        return (
          <div className="lockin">
            <WithFigure fig={fig}>
              <p className="summary">
                <RichText text={lesson.lockIn.summary} />
              </p>
              <div className="hook">
                <span className="eyebrow">Memory hook</span>
                <p>{lesson.lockIn.hook}</p>
              </div>
            </WithFigure>
            {answeredAll ? (
              <div className={`score-card ${mastered ? 'ok celebrate' : 'bad'}`} role="status">
                <div className="score-ring" style={{ ['--p' as string]: `${Math.round(score * 100)}` }}>
                  <span>{Math.round(score * 100)}%</span>
                </div>
                <div>
                  <strong>{mastered ? 'Mastered!' : 'Almost there'}</strong>
                  <p className="small">
                    {firstTryRight}/{totalItems} right first time.{' '}
                    {mastered
                      ? 'These cards are now in your Review deck.'
                      : 'Mastery needs 80%, including a number answer. Try a fresh set. The cards are already in Review.'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="callout small">
                Finish the “Your turn” problems to score this lesson.{' '}
                <button type="button" className="linklike" onClick={() => go(6)}>
                  Go back to them
                </button>
              </p>
            )}
            <TopicCta unit={lesson.unit} lastLesson={UNIT_BY_ID[lesson.unit]?.lessons.at(-1) === lesson.id} />
            <div className="cards-preview">
              {lesson.lockIn.cards.map((c) => (
                <div key={c.id} className="card-mini">
                  <div className="card-front">
                    <RichText text={c.front} />
                  </div>
                  <div className="card-back small">
                    <RichText text={c.back} />
                  </div>
                </div>
              ))}
            </div>
            <div className="row">
              {!mastered && answeredAll && (
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    setSeedBase(newSeed());
                    setResults({});
                    setCheckSaved(false);
                    go(6);
                  }}
                >
                  Try a fresh set
                </button>
              )}
              {lesson.lab && (
                <a className="btn" href={`#/labs/${lesson.lab.id}`}>
                  Open the lab
                </a>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="page lesson">
      <div ref={top} className="lesson-top">
        <nav className="crumbs small">
          <a href="#/learn">Learn</a> › {unit.id} {unit.title}
        </nav>
        <header className="lesson-head">
          <h1>{lesson.title}</h1>
          <div className="row small muted">
            <span className="badge">{unit.id}</span>
            <span>{lesson.minutes} min</span>
            {lp?.status === 'mastered' && <span className="badge ok">mastered</span>}
          </div>
        </header>
      </div>
      <div className="lesson-layout">
        <aside className="lesson-side">
          <ol className="rail" aria-label="Lesson steps">
            {SECTIONS.map((s, i) => {
              const Icon = STEP_ICONS[i];
              const state = i === step ? 'current' : i <= reached ? 'done' : 'todo';
              return (
                <li key={s} className={`rail-step ${state}`}>
                  <button type="button" onClick={() => go(i)} disabled={i > reached} aria-current={i === step ? 'step' : undefined} aria-label={`Step ${i + 1}: ${s}`}>
                    <span className="rail-dot">
                      <Icon size={16} />
                    </span>
                    <span className="rail-label">{SHORT[i]}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="side-keys small muted">
            Tip: use <kbd>←</kbd> <kbd>→</kbd> to move between steps.
          </p>
        </aside>
        <div className="lesson-main">
      {SECTIONS.map((title, i) =>
        i <= reached ? (
          <section key={title} className="step-card card" hidden={i !== step} aria-labelledby={`sec-${i}`}>
            <div className="step-head">
              <span className="step-num mono">
                {i + 1}/{SECTIONS.length}
              </span>
              <h2 id={`sec-${i}`}>{title}</h2>
            </div>
            {body(i)}
          </section>
        ) : null,
      )}

      <div className="step-nav">
        <button type="button" className="btn" onClick={() => go(step - 1)} disabled={step === 0} aria-label="Previous step">
          <IconArrowLeft size={18} />
          <span className="hide-sm">Back</span>
        </button>
        <div className="step-dots" aria-hidden="true">
          {SECTIONS.map((_, i) => (
            <span key={i} className={i === step ? 'on' : i <= reached ? 'done' : ''} />
          ))}
        </div>
        {step < SECTIONS.length - 1 ? (
          <button type="button" className="btn primary big" onClick={() => go(step + 1)} disabled={!canNext}>
            {step === 2 && predicted === null ? 'Pick an answer first' : `Next: ${SHORT[step + 1]}`}
            <IconArrowRight size={18} />
          </button>
        ) : next ? (
          <a className="btn primary big" href={`#/learn/${next}`}>
            Next lesson
            <IconArrowRight size={18} />
          </a>
        ) : (
          <a className="btn primary big" href="#/path">
            Back to Path
          </a>
        )}
      </div>
      {step >= 3 && (
        <NoteWalks
          groups={lessonWalks}
          id="lesson-notes"
          title={`What your notes say about this (${lessonWalks.map((g) => (g.page.lec ? `Lec ${String(g.page.lec).padStart(2, '0')}` : 'example')).join(', ')})`}
        />
      )}
        </div>
      </div>
    </div>
  );
}
