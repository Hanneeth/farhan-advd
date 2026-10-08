/**
 * Timed exam mode (CLAUDE.md §4, M4): a closed-book paper in the mid-sem style. Answers are hidden
 * until you hand in; then every answer is marked with the same checker (and mistake diagnosis) as
 * Practice, with the full step-by-step solution under each question.
 */
import { useEffect, useMemo, useState } from 'react';
import { GENERATOR_BY_ID } from '../content';
import { checkAnswer, type CheckResult } from '../practice/checker';
import { generate } from '../practice/generate';
import { MISTAKES } from '../practice/mistakes';
import { Givens, StepTrace } from '../practice/ProblemView';
import { QuestionFigure } from '../practice/QuestionFigure';
import { newSeed } from '../practice/rng';
import type { Problem } from '../practice/schema';
import { formatSI } from '../practice/units';
import { logMistake, recordPractice, useProgress } from '../app/store';
import { Tex } from '../ui/Tex';

interface Paper {
  id: string;
  title: string;
  minutes: number;
  note: string;
  generators: string[];
}

const PAPERS: Paper[] = [
  {
    id: 'midsem',
    title: 'Mid-semester style (90 min, closed book)',
    minutes: 90,
    note: 'Six questions across L1–L14: a 5-T OTA design, a telescopic design, a folded cascode, feedback accuracy, phase margin and two-stage compensation.',
    generators: ['u11-ota-design', 'l3-design', 'l4-folded', 'l1-gain', 'l12-pm', 'l14-cc'],
  },
  {
    id: 'quiz3',
    title: 'Quiz III style (30 min, L9–L14)',
    minutes: 30,
    note: 'Slewing, phase margin and Miller compensation.',
    generators: ['l9-slew', 'l12-pm', 'l13-miller'],
  },
  {
    id: 'digital',
    title: 'Digital check (45 min, L15–L38)',
    minutes: 45,
    note: 'CMOS VM, inverter delay, a logical-effort path and flip-flop timing.',
    generators: ['d17-vm', 'd18-delay', 'd25-path', 'd32-timing'],
  },
  {
    id: 'quiz',
    title: 'Quiz style (30 min)',
    minutes: 30,
    note: 'Three short questions: a differential pair, an OTA, and poles.',
    generators: ['u10-pair-bias', 'u11-ota', 'u12-pole'],
  },
  {
    id: 'foundations',
    title: 'Foundations check (30 min)',
    minutes: 30,
    note: 'DC recipe, small signal and a gain by inspection.',
    generators: ['u3-nmos-analysis', 'u7-cs-load', 'u9-cascode'],
  },
];

function fmt(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function ExamView() {
  const { settings } = useProgress();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [seed, setSeed] = useState(newSeed());
  const [start, setStart] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [handedIn, setHandedIn] = useState(false);

  const problems: Problem[] = useMemo(() => (paper ? paper.generators.map((g, i) => generate(GENERATOR_BY_ID[g], seed + i * 101)) : []), [paper, seed]);
  const left = paper ? paper.minutes * 60e3 - (now - start) : 0;

  useEffect(() => {
    if (!paper || handedIn) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [paper, handedIn]);

  const results = useMemo(() => {
    if (!handedIn) return {} as Record<string, CheckResult>;
    const out: Record<string, CheckResult> = {};
    problems.forEach((p, i) => p.unknowns.forEach((u) => (out[`${i}:${u.key}`] = checkAnswer(p, u.key, answers[`${i}:${u.key}`] ?? '', settings.tol))));
    return out;
  }, [handedIn, problems, answers, settings.tol]);

  const handIn = () => {
    setHandedIn(true);
    problems.forEach((p, i) =>
      p.unknowns.forEach((u) => {
        const v = answers[`${i}:${u.key}`] ?? '';
        const r = checkAnswer(p, u.key, v, settings.tol);
        if (r.status === 'invalid') return;
        recordPractice(r.status === 'correct');
        if (r.status === 'wrong') logMistake({ problem: p.id, key: u.key, mistake: r.mistake, input: v });
      }),
    );
  };

  useEffect(() => {
    if (paper && !handedIn && left <= 0) handIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  if (!paper) {
    return (
      <div className="page">
        <nav className="crumbs small">
          <a href="#/review">Review</a> › Exam mode
        </nav>
        <h1>Timed exam mode</h1>
        <p className="muted lab-intro">Closed book: no hints and no marking until you hand in. Fresh numbers every time, all checked twice.</p>
        <ul className="labs-grid">
          {PAPERS.map((pp) => (
            <li key={pp.id}>
              <button
                type="button"
                className="lab-card card exam-card"
                onClick={() => {
                  setPaper(pp);
                  setSeed(newSeed());
                  setStart(Date.now());
                  setNow(Date.now());
                  setAnswers({});
                  setHandedIn(false);
                }}
              >
                <strong>{pp.title}</strong>
                <span className="small muted">{pp.note}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const total = Object.keys(results).length;
  const right = Object.values(results).filter((r) => r.status === 'correct').length;

  return (
    <div className="page exam">
      <div className="exam-bar card" role="timer" aria-live="off">
        <strong>{paper.title}</strong>
        {handedIn ? (
          <span className={`badge ${right / Math.max(1, total) >= 0.8 ? 'ok' : 'bad'}`}>
            Score {right}/{total}
          </span>
        ) : (
          <span className={`mono exam-clock ${left < 5 * 60e3 ? 'bad' : ''}`}>{fmt(left)}</span>
        )}
        {handedIn ? (
          <button type="button" className="btn small" onClick={() => setPaper(null)}>
            New paper
          </button>
        ) : (
          <button type="button" className="btn small primary" onClick={handIn}>
            Hand in
          </button>
        )}
      </div>
      {problems.map((p, i) => (
        <section key={p.id} className="card problem exam-q">
          <h2>
            Q{i + 1}. {p.title}
          </h2>
          <p>{p.statement}</p>
          <div className="problem-body">
            {p.figure && (
              <div className="problem-figure bench">
                <QuestionFigure problem={p} reveal={handedIn} />
              </div>
            )}
            <div>
              <Givens problem={p} />
              {p.unknowns.map((u) => {
                const key = `${i}:${u.key}`;
                const r = results[key];
                return (
                  <div key={u.key} className={`answer ${r?.status === 'correct' ? 'solved' : r ? 'wrong' : ''}`}>
                    <div className="answer-label">
                      <span className="answer-sym">
                        <Tex tex={u.sym} />
                      </span>
                      <span>{u.label}</span>
                    </div>
                    {u.choices ? (
                      <div className="choices" role="group" aria-label={u.label}>
                        {u.choices.map((c, ci) => (
                          <button key={ci} type="button" className={`btn small ${answers[key] === String(ci) ? 'dark' : ''}`} disabled={handedIn} onClick={() => setAnswers((a) => ({ ...a, [key]: String(ci) }))}>
                            {c}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="input-unit">
                        <input type="text" autoComplete="off" spellCheck={false} aria-label={`${u.label} in ${u.unit || 'plain number'}`} value={answers[key] ?? ''} disabled={handedIn} onChange={(e) => setAnswers((a) => ({ ...a, [key]: e.target.value }))} />
                        {u.unit && <span className="unit-chip">{u.unit}</span>}
                      </div>
                    )}
                    {r && (
                      <p className={`feedback ${r.status}`}>
                        {r.status === 'correct' ? '✓ ' : '✗ '}
                        {r.status === 'correct' ? 'correct' : `answer: ${u.choices ? u.choices[p.answers[u.key]] : formatSI(p.answers[u.key], u.unit, 4)}`}
                        {r.status === 'wrong' && r.mistake && ` — ${MISTAKES[r.mistake].title}: ${MISTAKES[r.mistake].hint}`}
                        {r.status === 'invalid' && ' (no answer)'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {handedIn && (
            <details className="exam-solution">
              <summary>Full solution</summary>
              <StepTrace steps={p.steps} />
            </details>
          )}
        </section>
      ))}
    </div>
  );
}
