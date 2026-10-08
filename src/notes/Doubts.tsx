/**
 * An explanation with its clarifications woven in: each answer appears right after the sentence where its topic
 * first comes up (a short ↳ note), figures appear where they are needed, and then the explanation carries on.
 */
import { doubtFig } from '../assets/doubts';
import { captionOf, type Doubt, type DoubtFig } from '../content/doubts';
import { weave } from '../content/weave';
import { Prose, RichText } from '../ui/RichText';

export function DoubtFigures({ figs }: { figs?: DoubtFig[] }) {
  if (!figs?.length) return null;
  return (
    <div className="doubt-figs">
      {figs.map((f) => {
        const src = doubtFig(f.key);
        // Captions use plain V_GS3-style names; show them as real subscripts.
        const cap = (f.cap || captionOf(f.key)).replace(/\b([A-Za-z])_([A-Za-z0-9]+(?:,[A-Za-z0-9]+)*)/g, (_m, a: string, b: string) => `$${a}_{${b}}$`);
        return src ? (
          <figure key={f.key} className={'doubt-fig' + (f.key.startsWith('s-') ? ' strip' : '')}>
            <a href={src} target="_blank" rel="noreferrer" title="Open full size">
              <img src={src} alt={cap} loading="lazy" />
            </a>
            <figcaption className="small">
              <RichText text={cap} />
            </figcaption>
          </figure>
        ) : null;
      })}
    </div>
  );
}

const MARK = /\n?\s*\[\[fig:([a-z0-9-]+)\]\]\s*\n?/;

export function WovenProse({ text, doubts, figs }: { text: string; doubts?: Doubt[]; figs?: DoubtFig[] }) {
  if (MARK.test(text)) {
    // Hand-woven text: figures are placed by [[fig:key]] markers, clarifications are already in the prose.
    const parts = text.split(MARK);
    return (
      <>
        {parts.map((p, i) => (i % 2 === 1 ? <DoubtFigures key={i} figs={[{ key: p, cap: '' }]} /> : p.trim() ? <Prose key={i} text={p} /> : null))}
      </>
    );
  }
  if (!doubts?.length && !figs?.length) return <Prose text={text} />;
  return (
    <>
      {weave(text, doubts, figs).map((w, i) =>
        w.kind === 'text' ? (
          <Prose key={i} text={w.text} />
        ) : w.kind === 'fig' ? (
          <DoubtFigures key={i} figs={[w.fig]} />
        ) : (
          <div key={i} className="woven-note">
            <p>
              <strong className="woven-q">
                <RichText text={w.q} />
              </strong>{' '}
              <RichText text={w.a.replace(/\n\s*\n/g, ' ')} />
            </p>
            <DoubtFigures figs={w.figs?.map((key) => ({ key, cap: '' }))} />
          </div>
        ),
      )}
    </>
  );
}
