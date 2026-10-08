import { SheetLinks } from '../learn/SheetLinks';
import { EXAMS } from '../content/curriculum';
import { LESSON_BY_ID, UNITS } from '../content';
import { IconArrowRight, IconCheck, IconLock } from '../ui/Icons';
import { daysUntil, lessonUnlocked, nextStep, unitState, type UnitState } from './progress';
import { streak, today, useProgress } from './store';

/** A progress ring (0..1) with a label in the middle. */
export function Ring({ value, size = 64, stroke = 7, color = 'var(--signal)', children }: { value: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        {value > 0 && <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * Math.max(0, Math.min(1, value))} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />}
      </svg>
      <div className="ring-label">{children}</div>
    </div>
  );
}

export function PathView() {
  const p = useProgress();
  const ns = nextStep(p);
  const nextLesson = ns.lesson ? LESSON_BY_ID[ns.lesson] : undefined;
  const mastered = Object.values(p.lessons).filter((l) => l.status === 'mastered').length;
  const total = UNITS.reduce((n, u) => n + u.lessons.length, 0);
  const upcoming = EXAMS.map((e) => ({ ...e, days: daysUntil(e.date) })).filter((e) => e.days >= 0);
  const exam = upcoming[0];
  const due = Object.values(p.cards).filter((c) => c.due <= today()).length;
  const st = streak(p);
  const todayCount = p.activity[today()] ?? 0;
  const midsem = EXAMS[0];
  const midDays = daysUntil(midsem.date);
  const midLeft = UNITS.filter((u) => u.group !== 'digital').flatMap((u) => u.lessons).filter((l) => p.lessons[l]?.status !== 'mastered').length;

  return (
    <div className="page">
      <section className="hero card">
        <div className="hero-main">
          {exam && (
            <div className="hero-countdown">
              <span className="hero-days mono">{exam.days}</span>
              <span className="hero-days-label">
                days to the <strong>{exam.name}</strong>
                <br />
                <span className="muted small">
                  {new Date(exam.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })} · {exam.note}
                </span>
              </span>
            </div>
          )}
          <div className="hero-next">
            <div className="eyebrow">Your next step</div>
            {nextLesson ? (
              <>
                <h2>{nextLesson.title}</h2>
                <p className="muted">{nextLesson.why}</p>
                <a className="btn primary big" href={`#/learn/${nextLesson.id}`}>
                  {p.lessons[nextLesson.id] ? 'Continue lesson' : 'Start lesson'}
                  <IconArrowRight size={18} />
                </a>
              </>
            ) : ns.done ? (
              <p>Every available lesson is mastered. Mix it up in Practice or clear today's Review cards.</p>
            ) : (
              <p>Pick any lesson from the map below.</p>
            )}
            <div className="hero-quick">
              <a className="btn primary" href="#/lectures">Study lecture by lecture (your notes order) →</a>
              <a className="btn ghost" href="#/sprint">Mid-sem sprint: every topic on one page →</a>
              <a className="btn ghost" href="#/practice">Past papers →</a>
            </div>
          </div>
        </div>
        <div className="hero-side">
          <Ring value={total ? mastered / total : 0} size={112} stroke={10}>
            <span className="ring-big mono">{mastered}</span>
            <span className="ring-small">of {total} lessons</span>
          </Ring>
          <div className="hero-stats small">
            <a href="#/review" className="stat">
              <span className="mono">{due}</span> cards due
            </a>
            <a href="#/practice" className="stat">
              <span className="mono">
                {p.practice.correct}/{p.practice.attempted}
              </span>{' '}
              practice right
            </a>
          </div>
        </div>
      </section>

      <div className="plan-strip small" role="status">
        <span className={`plan-chip ${st > 0 ? 'hot' : ''}`}>
          <strong className="mono">{st}</strong>-day streak
        </span>
        <span className="plan-chip">
          today: <strong className="mono">{todayCount}</strong> {todayCount === 1 ? 'step' : 'steps'}
        </span>
        {midDays >= 0 && midLeft > 0 && (
          <span className="plan-chip plan-wide">
            Mid-sem plan: <strong className="mono">{midLeft}</strong> analog lessons left in <strong className="mono">{midDays}</strong> days → about{' '}
            <strong className="mono">{Math.ceil(midLeft / Math.max(1, midDays))}</strong> a day
          </span>
        )}
        <a className="plan-chip link" href="#/learn">
          Find any lesson →
        </a>
      </div>

      {upcoming.length > 1 && (
        <div className="exam-strip small">
          {upcoming.slice(1).map((e) => (
            <span key={e.name} className="badge">
              {e.name} · {e.days} d
            </span>
          ))}
        </div>
      )}

      <div className="path-columns">
      <section>
      <h2 className="path-heading">Foundations</h2>
      <p className="muted small">Build these first. Everything is open: go anywhere, the order is only a suggestion.</p>
      <ol className="path">
        {UNITS.filter((u) => u.group === 'foundations').map((u) => (
          <UnitRow key={u.id} id={u.id} />
        ))}
      </ol>

      </section>
      <section>
      <h2 className="path-heading">Handout lectures</h2>
      <p className="muted small">Numbered as in the course handout. The matching pages of your own notes are shown on each lecture.</p>
      <ol className="path">
        {UNITS.filter((u) => u.group === 'handout').map((u) => (
          <UnitRow key={u.id} id={u.id} />
        ))}
      </ol>
      <h2 className="path-heading">Digital VLSI (L15–L38)</h2>
      <p className="muted small">After the mid-sem: Kang & Leblebici and Weste & Harris. No notes yet: built from the textbooks.</p>
      <ol className="path">
        {UNITS.filter((u) => u.group === 'digital').map((u) => (
          <UnitRow key={u.id} id={u.id} />
        ))}
      </ol>
      </section>
      </div>
    </div>
  );
}

const STATE_LABEL: Record<UnitState, string> = { locked: 'locked', learning: 'in progress', mastered: 'mastered', coming: 'coming soon' };

function UnitRow({ id }: { id: string }) {
  const p = useProgress();
  const u = UNITS.find((x) => x.id === id)!;
  const st = unitState(u, p);
  const done = u.lessons.filter((l) => p.lessons[l]?.status === 'mastered').length;
  const frac = u.lessons.length ? done / u.lessons.length : 0;
  const started = u.lessons.some((l) => p.lessons[l]);
  const ns = nextStep(p);
  const active = st === 'learning' && (started || ns.unit === u.id);
  const label = st === 'learning' ? (started ? 'in progress' : ns.unit === u.id ? 'next up' : 'not started') : st === 'coming' ? `${STATE_LABEL[st]} · M${u.milestone}` : STATE_LABEL[st];
  return (
    <li className={`unit unit-${st}`}>
      <div className="unit-node">
        {st === 'mastered' ? (
          <span className="unit-node-done">
            <IconCheck size={18} />
          </span>
        ) : st === 'learning' ? (
          <Ring value={frac} size={38} stroke={4}>
            <span className="unit-node-id mono">{u.id}</span>
          </Ring>
        ) : (
          <span className="unit-node-idle mono">{u.id}</span>
        )}
      </div>
      <div className={`unit-card ${active ? 'card' : ''}`}>
        <div className="unit-head">
          <span className="unit-title">{u.title}</span>
          <span className={`badge ${st === 'mastered' ? 'ok' : active ? 'signal' : ''}`}>{label}</span>
        </div>
        <div className="small muted unit-sub">
          {u.short}
          {u.ref && <> · {u.ref}</>}
          {u.notes && <> · {u.notes}</>}
        </div>
        {u.lessons.length > 0 && (
          <div className="lesson-chips">
            {u.lessons.map((lid) => {
              const l = LESSON_BY_ID[lid];
              const lp = p.lessons[lid];
              const open = lessonUnlocked(lid, p);
              const cls = lp?.status === 'mastered' ? 'mastered' : lp ? 'started' : '';
              return open ? (
                <a key={lid} href={`#/learn/${lid}`} className={`lesson-chip ${cls}`}>
                  {lp?.status === 'mastered' ? <IconCheck size={15} /> : <span className="chip-dot" />}
                  {l.title}
                  {lp && lp.status !== 'mastered' && lp.best > 0 && <span className="mono small muted">{Math.round(lp.best * 100)}%</span>}
                </a>
              ) : (
                <span key={lid} className="lesson-chip locked">
                  <IconLock size={14} />
                  {l.title}
                </span>
              );
            })}
          </div>
        )}
        <SheetLinks unit={u.id} />
      </div>
    </li>
  );
}
