/**
 * Your lecture notes where you study them: inside each lesson and at the end of each topic. Every item is
 * typed out and explained; "See your page" opens the scanned handwritten page, so nothing is lost.
 */
import { useEffect, useState } from 'react';
import { NOTE_IMG } from '../assets/papers';
import type { PlacedNote } from '../content/notesMap';
import type { NoteItem, NotePage } from '../content/notesAll';
import { Prose, RichText } from '../ui/RichText';
import { Tex } from '../ui/Tex';

const lecLabel = (p: NotePage) => (p.lec ? `Lec ${String(p.lec).padStart(2, '0')} · ${p.date}` : p.id === 'settling' ? 'Settling example' : 'Current-mirror handout');

export function ScanModal({ page, onClose }: { page: NotePage; onClose: () => void }) {
  useEffect(() => {
    const on = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [onClose]);
  const src = NOTE_IMG[page.img];
  if (!src) return null;
  return (
    <div className="note-zoom" role="dialog" aria-modal="true" aria-label={`Your notes, ${lecLabel(page)}`} onClick={onClose}>
      <img src={src} alt={`Your handwritten notes, ${page.title}`} />
      <button type="button" className="btn small dark note-zoom-close" onClick={onClose}>
        Close (Esc)
      </button>
    </div>
  );
}

export function NoteItemBody({ item }: { item: NoteItem }) {
  return (
    <>
      <Prose text={item.explain} />
      {item.steps && (
        <ol className="note-steps">
          {item.steps.map((s, j) => (
            <li key={j}>
              <Tex tex={s.tex} block />
              {s.note && <span className="small muted">{s.note}</span>}
            </li>
          ))}
        </ol>
      )}
      {item.tex && (
        <div className="note-box">
          {item.tex.map((t, j) => (
            <Tex key={j} tex={t} block />
          ))}
        </div>
      )}
      {item.careful && (
        <p className="note-careful">
          <strong>Careful:</strong> <RichText text={item.careful} />
        </p>
      )}
      {item.asked && (
        <p className="note-asked">
          <strong>How it is asked:</strong> {item.asked}
        </p>
      )}
      {item.links && (
        <div className="note-links">
          {item.links
            .filter((l) => !l.to.startsWith('learn/'))
            .map((l) => (
              <a key={l.to} className="chip-link" href={`#/${l.to}`}>
                {l.label} →
              </a>
            ))}
        </div>
      )}
    </>
  );
}

/** The notes that belong to a lesson or a topic, as expandable cards. */
export function NotesFromLectures({ notes, title, openFirst = false, id }: { notes: PlacedNote[]; title: string; openFirst?: boolean; id?: string }) {
  const [scan, setScan] = useState<NotePage | null>(null);
  const [all, setAll] = useState<boolean | null>(null);
  if (!notes.length) return null;
  const pages = [...new Map(notes.map((n) => [n.page.id, n.page])).values()];
  return (
    <section className="lecture-notes" id={id} aria-label={title}>
      <div className="lecture-notes-head">
        <div>
          <div className="eyebrow">From your handwritten lecture notes</div>
          <h2>{title}</h2>
        </div>
        <div className="lecture-notes-actions">
          {pages.map((p) =>
            NOTE_IMG[p.img] ? (
              <button key={p.id} type="button" className="btn small ghost" onClick={() => setScan(p)}>
                See your page: {p.lec ? `Lec ${String(p.lec).padStart(2, '0')}` : 'example'}
              </button>
            ) : null,
          )}
          <button type="button" className="btn small ghost" onClick={() => setAll((a) => !a)}>
            {all ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
      </div>
      <div className="lecture-notes-list">
        {notes.map((n, i) => (
          <details key={`${n.page.id}-${n.index}-${all}`} className="note-card" open={all ?? (openFirst && i === 0)}>
            <summary>
              <span className="note-src">{lecLabel(n.page)}</span>
              <span className="note-card-title">{n.item.title}</span>
            </summary>
            <div className="note-card-body">
              <NoteItemBody item={n.item} />
            </div>
          </details>
        ))}
      </div>
      {scan && <ScanModal page={scan} onClose={() => setScan(null)} />}
    </section>
  );
}
