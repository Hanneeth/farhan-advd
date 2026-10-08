import { useState } from 'react';
import { QuestionFigure } from './QuestionFigure';
import { logMistake, recordPractice, useProgress } from '../app/store';
import { Tex } from '../ui/Tex';
import { RichText } from '../ui/RichText';
import { ExamTimer } from './ExamTimer';
import { calcTips, speedTips } from './exam';
import { checkAnswer, type CheckResult } from './checker';
import type { Problem, TraceStep } from './schema';
import { texSI } from './tex';
import { PAPER_IMG } from '../assets/papers';
import type { PaperImage } from './schema';

export type ProblemMode = 'worked' | 'faded' | 'independent';

const TAG_NAMES: Record<string, string> = {
  A: 'Step A · DC recipe',
  B: 'Step B · roles',
  C: 'Step C · impedances',
  D: 'Step D · gain',
  '✓': 'Check',
  '·': '',
};

export function Givens({ problem }: { problem: Problem }) {
  return (
    <dl className="givens">
      {problem.givens.map((g, i) => (
        <div key={i} className="given">
          <dt>
            <Tex tex={g.sym} />
          </dt>
          <dd className="mono">
            <Tex tex={g.unit === '' ? String(g.value) : texSI(g.value, g.unit, 4)} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function StepTrace({ steps, onFocusStep, hideValues }: { steps: TraceStep[]; onFocusStep?: (s: TraceStep | null) => void; hideValues?: boolean }) {
  return (
    <ol className="trace">
      {steps.map((s, i) => (
        <li
          key={i}
          className={`trace-step tag-${s.tag === '✓' ? 'check' : s.tag === '·' ? 'plain' : s.tag}`}
          tabIndex={0}
          onMouseEnter={() => onFocusStep?.(s)}
          onMouseLeave={() => onFocusStep?.(null)}
          onFocus={() => onFocusStep?.(s)}
          onBlur={() => onFocusStep?.(null)}
        >
          {TAG_NAMES[s.tag] && <span className="trace-tag">{TAG_NAMES[s.tag]}</span>}
          <div className="trace-title">{s.title}</div>
          {s.tex && !hideValues && (
            <div className="trace-tex">
              <Tex tex={s.tex} />
            </div>
          )}
          {s.note && <div className="small muted">{s.note}</div>}
        </li>
      ))}
    </ol>
  );
}

function AnswerRow({
  problem,
  k,
  onResult,
  disabled,
}: {
  problem: Problem;
  k: string;
  onResult: (k: string, r: CheckResult, first: boolean) => void;
  disabled?: boolean;
}) {
  const u = problem.unknowns.find((x) => x.key === k)!;
  const { settings } = useProgress();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [tries, setTries] = useState(0);
  const solved = result?.status === 'correct';
  const submit = (value: string) => {
    const r = checkAnswer(problem, k, value, settings.tol);
    setResult(r);
    if (r.status === 'invalid') return;
    const first = tries === 0;
    setTries((t) => t + 1);
    onResult(k, r, first);
    if (r.status === 'wrong') logMistake({ problem: problem.id, key: k, mistake: r.mistake, input: value });
    recordPractice(r.status === 'correct');
  };
  return (
    <div className={`answer ${solved ? 'solved' : result?.status === 'wrong' ? 'wrong' : ''}`}>
      <div className="answer-label">
        <span className="answer-sym">
          <Tex tex={u.sym} />
        </span>
        <span>{u.label}</span>
        {solved && <span className="badge ok">✓ correct</span>}
      </div>
      {u.choices ? (
        <div className="choices" role="group" aria-label={u.label}>
          {u.choices.map((c, i) => (
            <button
              key={i}
              type="button"
              className={`btn small ${solved && problem.answers[k] === i ? 'primary' : ''}`}
              disabled={disabled || solved}
              onClick={() => submit(String(i))}
            >
              {c}
            </button>
          ))}
        </div>
      ) : (
        <form
          className="answer-form"
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
        >
          <div className="input-unit">
            <input
              type="text"
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              aria-label={`${u.label} in ${u.unit || 'plain number'}`}
              placeholder={u.unit === 'A' ? 'e.g. 90u or 90 µA' : u.unit === 'Ω' ? 'e.g. 9k' : u.unit === 'S' ? 'e.g. 0.6m' : u.unit === 'V' ? 'e.g. 0.9' : 'number'}
              value={input}
              disabled={disabled || solved}
              onChange={(e) => setInput(e.target.value)}
            />
            {u.unit && <span className="unit-chip">{u.unit}</span>}
          </div>
          <button className="btn small dark" type="submit" disabled={disabled || solved || !input.trim()}>
            Check
          </button>
        </form>
      )}
      {result && (
        <p className={`feedback ${result.status}`} role="status">
          {result.status === 'correct' ? '✓ ' : result.status === 'wrong' ? '✗ ' : ''}
          {result.message}
        </p>
      )}
    </div>
  );
}

export function PaperImages({ imgs, open, label }: { imgs: PaperImage[]; open?: boolean; label: string }) {
  return (
    <details className="paper-crops" open={open}>
      <summary>{label}</summary>
      {imgs.map((im) =>
        PAPER_IMG[im.img] ? (
          <figure key={im.img} className="paper-crop">
            <img src={PAPER_IMG[im.img]} alt={im.caption} loading="lazy" />
            <figcaption className="small muted">{im.caption}</figcaption>
          </figure>
        ) : null,
      )}
    </details>
  );
}

export function InShort({ problem }: { problem: Problem }) {
  if (!problem.inShort) return null;
  return (
    <div className="inshort">
      <div className="eyebrow">In short: the concept and the formulas</div>
      <p>
        <RichText text={problem.inShort.concept} />
      </p>
      <ul className="inshort-f">
        {problem.inShort.formulas.map((f, i) => (
          <li key={i}>
            <Tex tex={f} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CalcSteps({ problem }: { problem: Problem }) {
  if (!problem.calc?.length) return null;
  return (
    <div className="calc-box">
      <div className="eyebrow">
        On your fx-991CW <a href="#/calc" className="small">(recipes)</a>
      </div>
      <ol>
        {problem.calc.map((c, i) => (
          <li key={i}>
            <span className="calc-what">{c.what}:</span> <code className="calc-keys">{c.keys}</code>
            {c.shows && <span className="calc-shows"> → {c.shows}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ProblemView({
  problem,
  mode = 'independent',
  onResult,
  compact,
  number,
}: {
  problem: Problem;
  mode?: ProblemMode;
  onResult?: (k: string, r: CheckResult, first: boolean) => void;
  compact?: boolean;
  number?: number;
}) {
  const [hints, setHints] = useState(0);
  const [showSolution, setShowSolution] = useState(mode === 'worked');
  const [focus, setFocus] = useState<TraceStep | null>(null);
  const [concept, setConcept] = useState(false);
  const [right, setRight] = useState<Record<string, boolean>>({});
  const solvedParts = Object.values(right).filter(Boolean).length;
  const calc = calcTips(problem);
  const hasFig = !!problem.figure;
  const hasPaper = !!problem.printed?.length && problem.printed.some((im) => PAPER_IMG[im.img]);
  const hasRef = hasFig || hasPaper;
  const [view, setView] = useState<'paper' | 'circuit'>(hasPaper ? 'paper' : 'circuit');
  return (
    <article className={`problem ${compact ? 'compact' : ''}`} aria-label={problem.title}>
      <header className="problem-head">
        {number !== undefined && <span className="problem-num">{number}</span>}
        <div>
          <div className="eyebrow">
            {mode === 'faded' ? 'Guided · ' : mode === 'worked' ? 'Worked example · ' : ''}
            {problem.source} · {problem.tags.join(', ')}
          </div>
          <h3>{problem.title}</h3>
        </div>
      </header>
      {mode !== 'worked' && <ExamTimer problem={problem} solvedParts={solvedParts} done={solvedParts >= problem.unknowns.length} />}
      {problem.flags && problem.flags.length > 0 && (
        <details className="problem-flags">
          <summary>
            ⚑ {problem.flags.length === 1 ? 'A note on this question' : `${problem.flags.length} notes on this question`} (assumptions, answer key)
          </summary>
          {problem.flags.map((f, i) => (
            <p key={i} className="small">
              {f}
            </p>
          ))}
        </details>
      )}
      <div className={`problem-grid ${hasRef ? 'has-figure' : ''}`}>
        {hasRef && (
          <div className="problem-left">
            <div className="problem-ref">
              {hasFig && hasPaper && (
                <div className="ref-tabs" role="tablist" aria-label="What to keep in view">
                  <button type="button" role="tab" aria-selected={view === 'paper'} className={view === 'paper' ? 'on' : ''} onClick={() => setView('paper')}>
                    Question paper
                  </button>
                  <button type="button" role="tab" aria-selected={view === 'circuit'} className={view === 'circuit' ? 'on' : ''} onClick={() => setView('circuit')}>
                    Circuit (live, highlights each step)
                  </button>
                </div>
              )}
              {hasPaper && view === 'paper' ? (
                <figure className="paper-crop ref-paper">
                  {problem.printed!.map((im) => (PAPER_IMG[im.img] ? <img key={im.img} src={PAPER_IMG[im.img]} alt={im.caption} /> : null))}
                  <figcaption className="small muted">{problem.printed![0].caption} · stays here while you scroll</figcaption>
                </figure>
              ) : (
                <div className="problem-figure bench">
                  <QuestionFigure problem={problem} reveal={mode === 'worked' || showSolution} highlight={focus?.highlight} />
                </div>
              )}
            </div>
          </div>
        )}
        <div className="problem-right">
          <div className="problem-text">
            <p>{problem.statement}</p>
            <Givens problem={problem} />
          </div>
          {calc && mode !== 'worked' && (
            <details className={`calc-hint ${calc.big ? 'big' : ''}`} open={calc.big}>
              <summary>
                {calc.big ? '🧮 Your fx-991CW saves real time here' : '🧮 Calculator tips'} <span className="small muted">({calc.why})</span>
              </summary>
              <ol>
                {calc.steps.map((c, i) => (
                  <li key={i}>
                    <span className="calc-what">{c.what}:</span> <code className="calc-keys">{c.keys}</code>
                    {c.shows && <span className="calc-shows"> → {c.shows}</span>}
                  </li>
                ))}
              </ol>
              <a className="small" href="#/calc">All nine recipes →</a>
            </details>
          )}
          {mode === 'faded' && (
            <div className="scaffold">
              <div className="eyebrow">The method (fill in the numbers yourself)</div>
              <StepTrace steps={problem.steps} hideValues />
            </div>
          )}
          {mode !== 'worked' && (
            <div className="answers">
              {problem.unknowns.map((u) => (
                <AnswerRow
                  key={u.key}
                  problem={problem}
                  k={u.key}
                  onResult={(k, r, f) => {
                    if (r.status === 'correct') setRight((o) => ({ ...o, [k]: true }));
                    onResult?.(k, r, f);
                  }}
                />
              ))}
            </div>
          )}
          {mode !== 'worked' && (
            <div className="hints">
              {problem.hints.slice(0, hints).map((h, i) => (
                <p key={i} className="hint">
                  <span className="hint-rung">Hint {i + 1}</span> {h}
                </p>
              ))}
              <div className="row">
                {hints < 4 && (
                  <button type="button" className="btn small ghost" onClick={() => setHints((h) => h + 1)}>
                    {hints === 0 ? 'I’m stuck: give me a nudge' : 'Next hint'}
                  </button>
                )}
                {problem.inShort && (
                  <button type="button" className="btn small ghost" aria-expanded={concept} onClick={() => setConcept((c) => !c)}>
                    {concept ? 'Hide concept + formulas' : 'Concept + formulas'}
                  </button>
                )}
                <button type="button" className="btn small ghost" onClick={() => setShowSolution((s) => !s)}>
                  {showSolution ? 'Hide full solution' : 'Show full solution'}
                </button>
              </div>
              {concept && !showSolution && <InShort problem={problem} />}
            </div>
          )}
          {showSolution && (
            <div className="solution">
              <InShort problem={problem} />
              <div className="eyebrow">{mode === 'worked' ? 'Worked example: hover a step to see it on the circuit' : hasFig ? 'Full solution, step by step (hover a step to see it on the circuit)' : 'Full solution, step by step'}</div>
              <StepTrace steps={problem.steps} onFocusStep={setFocus} />
              <p className="small muted">
                Answers:{' '}
                {problem.unknowns.map((u, i) => (
                  <span key={u.key}>
                    {i > 0 && ' · '}
                    <Tex tex={u.sym} /> = {u.choices ? u.choices[problem.answers[u.key]] : <Tex tex={u.unit ? texSI(problem.answers[u.key], u.unit, 3) : String(Number(problem.answers[u.key].toPrecision(3)))} />}
                  </span>
                ))}
              </p>
              <div className="speed-box">
            <div className="eyebrow">Faster in the exam</div>
            <ul>
              {speedTips(problem).map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          {calc && (
            <div className="calc-box">
              <div className="eyebrow">
                On your fx-991CW <a href="#/calc" className="small">(recipes)</a>
              </div>
              <ol>
                {calc.steps.map((c, i) => (
                  <li key={i}>
                    <span className="calc-what">{c.what}:</span> <code className="calc-keys">{c.keys}</code>
                    {c.shows && <span className="calc-shows"> → {c.shows}</span>}
                  </li>
                ))}
              </ol>
            </div>
          )}
              {problem.key && problem.key.length > 0 && <PaperImages imgs={problem.key} label="Official key / class solution (handwritten)" />}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
