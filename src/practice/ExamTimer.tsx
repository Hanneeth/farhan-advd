/**
 * Exam timer for one question: start it when you begin, it counts against the realistic exam budget for this
 * question, shows the pace per part, turns amber at 75 % and red past the budget, and records your time.
 */
import { useEffect, useRef, useState } from 'react';
import type { Problem } from './schema';
import { fmtTime, timeBudget } from './exam';

const KEY = 'ag-times';
function loadBest(id: string): number | undefined {
  try {
    return (JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, number>)[id];
  } catch {
    return undefined;
  }
}
function saveBest(id: string, sec: number) {
  try {
    const all = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, number>;
    if (!all[id] || sec < all[id]) all[id] = sec;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable: timing still works */
  }
}

export function ExamTimer({ problem, solvedParts, done }: { problem: Problem; solvedParts: number; done: boolean }) {
  const b = timeBudget(problem);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState<number | undefined>(() => loadBest(problem.id));
  const last = useRef<number | null>(null);
  const finished = useRef(false);

  useEffect(() => {
    if (!running) return;
    last.current = performance.now();
    const t = window.setInterval(() => {
      const now = performance.now();
      setElapsed((e) => e + (now - (last.current ?? now)) / 1000);
      last.current = now;
    }, 250);
    return () => window.clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (done && running && !finished.current) {
      finished.current = true;
      setRunning(false);
      saveBest(problem.id, elapsed);
      setBest(loadBest(problem.id));
    }
  }, [done, running, elapsed, problem.id]);

  const frac = elapsed / b.total;
  const tone = frac > 1 ? 'over' : elapsed > b.target ? 'warn' : 'ok';
  const n = problem.unknowns.length;
  const expectedParts = Math.min(n, Math.floor(Math.max(0, elapsed - Math.min(b.total * 0.2, 120)) / (b.parts[0] || b.total)));
  const behind = running && n > 1 && solvedParts < expectedParts;
  const started = elapsed > 0;

  return (
    <div className={`exam-timer ${tone} ${running ? 'running' : ''}`} role="timer" aria-live="off">
      <div className="et-main">
        <span className="et-icon" aria-hidden="true">⏱</span>
        <span className="et-time mono">{fmtTime(elapsed)}</span>
        <span className="et-of small">
          aim <strong>{fmtTime(b.target)}</strong> · exam allotment {fmtTime(b.total)}
          {b.marks ? ` · ${b.marks} marks` : ''}
        </span>
        <div className="et-bar" aria-hidden="true">
          <div style={{ width: `${Math.min(100, frac * 100)}%` }} />
          <span className="et-aim" style={{ left: `${(b.target / b.total) * 100}%` }} title="ideal target" />
          {n > 1 &&
            b.parts.map((_, i) => {
              const at = (Math.min(b.total * 0.2, 120) + b.parts.slice(0, i + 1).reduce((a, x) => a + x, 0)) / b.total;
              return i < n - 1 ? <span key={i} className="et-tick" style={{ left: `${at * 100}%` }} /> : null;
            })}
        </div>
        <div className="et-btns">
          {!running ? (
            <button type="button" className="btn small primary" onClick={() => { finished.current = false; setRunning(true); }}>
              {started ? 'Resume' : 'Start exam timer'}
            </button>
          ) : (
            <button type="button" className="btn small" onClick={() => setRunning(false)}>
              Pause
            </button>
          )}
          {started && (
            <button type="button" className="btn small ghost" onClick={() => { setRunning(false); setElapsed(0); finished.current = false; }}>
              Reset
            </button>
          )}
        </div>
      </div>
      <div className="et-note small">
        {done && started ? (
          <>
            ✓ Done in <strong>{fmtTime(elapsed)}</strong> — {elapsed <= b.target ? 'at ideal pace: you would have time to check.' : elapsed <= b.total ? 'inside the allotment, but no checking time left — aim faster next attempt.' : `${fmtTime(elapsed - b.total)} over the allotment: redo it tomorrow against the clock.`}
            {best !== undefined && <> Best: {fmtTime(best)}.</>}
          </>
        ) : running ? (
          tone === 'warn' ? (
            <>Past the ideal target — still inside the allotment. Finish the current part, then move on.</>
          ) : tone === 'over' ? (
            <>Over budget. In the exam: write the remaining formulas symbolically for method marks and move on.</>
          ) : behind ? (
            <>Behind pace: aim for {solvedParts + 1}/{n} parts by now. Skip the stuck part, come back at the end.</>
          ) : (
            <>On pace. About {fmtTime(b.parts[0] ?? b.total)} per part ({n} part{n > 1 ? 's' : ''}).</>
          )
        ) : (
          <>
            Exam allotment: {b.basis}. Ideal = 5/6 of that, so a full 90-min paper keeps 15 min to read and check.
            {best !== undefined && <> Your best: {fmtTime(best)}.</>}
          </>
        )}
      </div>
    </div>
  );
}
