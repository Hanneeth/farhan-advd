/**
 * Pointers to the end-of-topic page (#/topic/<unit>) that holds the topic's tutorials, PYQs, problem sets, Razavi
 * examples and lab questions. A question belongs to the LAST topic it needs, so it appears once you can solve it.
 */
import { sheetProblems, UNIT_BY_ID } from '../content';
import { problemSolved } from '../app/progress';
import { useProgress } from '../app/store';

function useCounts(unit: string) {
  const prog = useProgress();
  const { now, later } = sheetProblems(unit);
  const solved = now.filter((p) => problemSolved(p.id, p.unknowns.map((u) => u.key), prog)).length;
  return { total: now.length, solved, later: later.length };
}

/** Learn page / Path: one line per topic. */
export function SheetLinks({ unit }: { unit: string; compact?: boolean }) {
  const { total, solved } = useCounts(unit);
  if (!total) return null;
  return (
    <a className="sheet-links compact chip-link strong" href={`#/topic/${unit}`}>
      Tutorials & PYQs · {solved}/{total} solved →
    </a>
  );
}

/** Lock-in step: the end-of-topic call to action. */
export function TopicCta({ unit, lastLesson }: { unit: string; lastLesson: boolean }) {
  const { total, solved, later } = useCounts(unit);
  const u = UNIT_BY_ID[unit];
  if (!u || (!total && !later)) return null;
  if (!lastLesson)
    return (
      <p className="small muted topic-hint">
        At the end of {u.id}: {total ? `${total} tutorial and PYQ questions` : 'questions that use this topic'}.{' '}
        <a href={`#/topic/${unit}`}>Look ahead →</a>
      </p>
    );
  return (
    <div className="topic-cta">
      <p>
        <strong>You have reached the end of {u.id} {u.title}.</strong>
        <br />
        <span className="small">
          {total ? `${total} questions from your tutorials, PYQs and problem sets need only what you have covered (${solved} solved).` : 'No sheet question needs only this topic; see what comes up later.'}
        </span>
      </p>
      <a className="btn primary" href={`#/topic/${unit}`}>
        Attempt them →
      </a>
    </div>
  );
}
