import { useState } from 'react';
import { CARD_BY_ID } from '../content';
import { MISTAKES } from '../practice/mistakes';
import { addCards, reviewCard, today, useProgress } from '../app/store';
import { AUDIT_CARDS } from '../content/audit';
import { RichText } from '../ui/RichText';

export function ReviewView() {
  const p = useProgress();
  const due = Object.entries(p.cards)
    .filter(([id, c]) => c.due <= today() && CARD_BY_ID[id])
    .sort((a, b) => a[1].box - b[1].box)
    .map(([id]) => id);
  const [flipped, setFlipped] = useState(false);
  const current = due[0] ? CARD_BY_ID[due[0]] : undefined;
  const total = Object.keys(p.cards).length;
  const boxes = [1, 2, 3, 4, 5].map((b) => Object.values(p.cards).filter((c) => c.box === b).length);

  const mistakeCounts: Record<string, number> = {};
  for (const m of p.mistakes) if (m.mistake) mistakeCounts[m.mistake] = (mistakeCounts[m.mistake] ?? 0) + 1;
  const topMistakes = Object.entries(mistakeCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="page narrow">
      <h1>Review</h1>
      <p className="muted small">
        Spaced repetition (Leitner): a card you know moves up a box and comes back after 1, 2, 4, 8, then 16 days. A card you miss goes back to box 1.
      </p>
      <div className="boxes" aria-label="Cards per box">
        {boxes.map((n, i) => (
          <div key={i} className="box">
            <div className="mono">{n}</div>
            <div className="small muted">box {i + 1}</div>
          </div>
        ))}
      </div>

      <section className="card review-card">
        {total === 0 ? (
          <p>No cards yet. Every lesson you finish adds its cards here.</p>
        ) : !current ? (
          <p>✓ Nothing due today. {total} cards in your deck.</p>
        ) : (
          <>
            <div className="eyebrow">
              {current.unit} · {due.length} due
            </div>
            <p className="card-q">
              <RichText text={current.front} />
            </p>
            {flipped ? (
              <>
                <p className="card-a">
                  <RichText text={current.back} />
                </p>
                <div className="row">
                  <button type="button" className="btn primary" onClick={() => { reviewCard(current.id, true); setFlipped(false); }}>
                    I knew it
                  </button>
                  <button type="button" className="btn" onClick={() => { reviewCard(current.id, false); setFlipped(false); }}>
                    Not yet
                  </button>
                </div>
              </>
            ) : (
              <button type="button" className="btn primary" onClick={() => setFlipped(true)}>
                Show answer
              </button>
            )}
          </>
        )}
      </section>

      <section>
        <h2>The 20-question audit</h2>
        <p className="muted small">From our chat: “20 things you should be able to answer cold”. {AUDIT_CARDS.every((c) => p.cards[c.id]) ? 'All 20 are in your deck.' : 'Add them to your deck; they come back on the same schedule.'}</p>
        {!AUDIT_CARDS.every((c) => p.cards[c.id]) && (
          <button type="button" className="btn" onClick={() => addCards(AUDIT_CARDS.map((c) => c.id))}>
            Add the 20 audit cards
          </button>
        )}
      </section>

      <section>
        <h2>Mistake log</h2>
        {topMistakes.length === 0 ? (
          <p className="muted">No diagnosed mistakes yet.</p>
        ) : (
          <ul className="mistakes">
            {topMistakes.map(([id, n]) => (
              <li key={id}>
                <strong>{MISTAKES[id as keyof typeof MISTAKES].title}</strong> <span className="badge bad">×{n}</span>
                <div className="small muted">{MISTAKES[id as keyof typeof MISTAKES].hint}</div>
              </li>
            ))}
          </ul>
        )}
        <p className="small muted">{p.mistakes.length} wrong answers logged in total.</p>
      </section>

      <section>
        <h2>Timed exam mode</h2>
        <p className="muted">A closed-book paper with a countdown: no hints, no marking until you hand in, then every answer diagnosed with its full solution.</p>
        <a className="btn primary" href="#/exam">
          Start a timed paper
        </a>
      </section>
    </div>
  );
}
