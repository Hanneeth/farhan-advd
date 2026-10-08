/**
 * Your handwritten lecture notes, page by page: the scan on the left (click to enlarge), every item on the
 * page typed out and explained on the right, with links to the lesson and the questions that use it.
 */
import { useEffect, useState } from 'react';
import { NOTE_IMG } from '../assets/papers';
import { NOTES } from '../content/notesAll';
import type { NotePage } from '../content/notesAll';
import { Prose, RichText } from '../ui/RichText';
import { Tex } from '../ui/Tex';

export function NotesIndex() {
  return (
    <div className="page notes-page">
      <h1>Your lecture notes</h1>
      <p className="lede">
        Every handwritten page, with everything on it typed out, explained step by step and linked to the lesson and the questions that use it. The scan sits next to the explanation, so nothing is lost where the handwriting is hard to read. <strong>Lec 01–08 are the mid-sem priority</strong> and are explained in the most depth.
      </p>
      <ol className="notes-list">
        {NOTES.map((n) => (
          <li key={n.id} className={n.priority ? 'priority' : ''}>
            <a href={`#/notes/${n.id}`} className="notes-card">
              <span className="notes-num">{n.lec ? `Lec ${String(n.lec).padStart(2, '0')}` : n.id === 'settling' ? 'Example' : 'Handout'}</span>
              <span className="notes-main">
                <span className="notes-title">{n.title}</span>
                <span className="small muted">
                  {n.date} · handout {n.handout} · {n.items.length} items
                </span>
              </span>
              {n.priority && <span className="badge signal">mid-sem focus</span>}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

function NoteScan({ n }: { n: NotePage }) {
  const [zoom, setZoom] = useState(false);
  const src = NOTE_IMG[n.img];
  useEffect(() => {
    if (!zoom) return;
    const on = (e: KeyboardEvent) => e.key === 'Escape' && setZoom(false);
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [zoom]);
  if (!src) return <p className="callout small">This handout is typed; everything in it is below.</p>;
  return (
    <>
      <button type="button" className="note-scan" onClick={() => setZoom(true)} aria-label="Enlarge the scanned page">
        <img src={src} alt={`Your handwritten notes, ${n.title}`} />
        <span className="note-scan-hint small">Click to enlarge</span>
      </button>
      {zoom && (
        <div className="note-zoom" role="dialog" aria-modal="true" aria-label="Scanned page" onClick={() => setZoom(false)}>
          <img src={src} alt={`Your handwritten notes, ${n.title}`} />
          <button type="button" className="btn small dark note-zoom-close" onClick={() => setZoom(false)}>
            Close (Esc)
          </button>
        </div>
      )}
    </>
  );
}

export function NotePageView({ id }: { id: string }) {
  const i = NOTES.findIndex((n) => n.id === id);
  const n = NOTES[i];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  if (!n) return <p className="page">Note page not found.</p>;
  const prev = NOTES[i - 1], next = NOTES[i + 1];
  return (
    <div className="page note-page">
      <p className="small">
        <a href="#/notes">Your notes</a> › {n.lec ? `Lec ${String(n.lec).padStart(2, '0')}` : n.title}
      </p>
      <h1>
        {n.lec ? <span className="note-lec">Lec {String(n.lec).padStart(2, '0')} · {n.date}</span> : null}
        {n.title}
      </h1>
      <p className="lede">{n.summary}</p>
      <div className={`note-grid ${NOTE_IMG[n.img] ? '' : 'no-scan'}`}>
        <aside className="note-left">
          <NoteScan n={n} />
        </aside>
        <div className="note-right">
          <ol className="note-toc small">
            {n.items.map((it, k) => (
              <li key={k}>
                <a href={`#/notes/${n.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`ni-${k}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
                  {it.title}
                </a>
              </li>
            ))}
          </ol>
          {n.items.map((it, k) => (
            <article key={k} className="note-item" id={`ni-${k}`}>
              <h2>
                <span className="note-item-num">{k + 1}</span>
                {it.title}
              </h2>
              <Prose text={it.explain} />
              {it.steps && (
                <ol className="note-steps">
                  {it.steps.map((s, j) => (
                    <li key={j}>
                      <Tex tex={s.tex} block />
                      {s.note && <span className="small muted">{s.note}</span>}
                    </li>
                  ))}
                </ol>
              )}
              {it.tex && (
                <div className="note-box">
                  {it.tex.map((t, j) => (
                    <Tex key={j} tex={t} block />
                  ))}
                </div>
              )}
              {it.careful && (
                <p className="note-careful">
                  <strong>Careful:</strong> <RichText text={it.careful} />
                </p>
              )}
              {it.asked && (
                <p className="note-asked">
                  <strong>How it is asked:</strong> {it.asked}
                </p>
              )}
              {it.links && (
                <div className="note-links">
                  {it.links.map((l) => (
                    <a key={l.to} className="chip-link" href={`#/${l.to}`}>
                      {l.label} →
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
          <nav className="note-pager">
            {prev ? <a href={`#/notes/${prev.id}`}>← {prev.lec ? `Lec ${String(prev.lec).padStart(2, '0')}` : prev.title.split(' (')[0]}</a> : <span />}
            {next ? <a href={`#/notes/${next.id}`}>{next.lec ? `Lec ${String(next.lec).padStart(2, '0')}` : next.title.split(' (')[0]} →</a> : <span />}
          </nav>
        </div>
      </div>
    </div>
  );
}
