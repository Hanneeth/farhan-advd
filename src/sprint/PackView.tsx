/**
 * One last-minute pack: the idea, the formulas to memorise (say it as / check it with), the memory hook and
 * every question type with the steps and the papers it came from. `onPick` opens a question on the same page.
 */
import { BANK_BY_ID } from '../content';
import type { Pack } from '../content/sprint';
import { Prose, RichText } from '../ui/RichText';
import { Tex } from '../ui/Tex';

export function PackView({ pack, onPick, print }: { pack: Pack; onPick?: (id: string) => boolean; print?: boolean }) {
  return (
    <section className={`pack ${print ? 'pack-print' : ''}`} id={`pack-${pack.id}`} aria-labelledby={`pack-h-${pack.id}`}>
      <h2 id={`pack-h-${pack.id}`} className="pack-title">
        <span className="pack-kicker">Last-minute pack</span>
        {pack.title}
      </h2>
      <div className="pack-idea">
        <h3>The idea in plain words</h3>
        <Prose text={pack.idea} />
      </div>
      <h3>Memorise these</h3>
      <div className="table-scroll">
        <table className="pack-memo">
          <thead>
            <tr>
              <th>Formula</th>
              <th>Say it as</th>
              <th>Check it with</th>
            </tr>
          </thead>
          <tbody>
            {pack.memo.map((m, i) => (
              <tr key={i}>
                <td className="pack-f">
                  <Tex tex={m.f} />
                </td>
                <td>{m.say}</td>
                <td className="muted">{m.check}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="pack-hook">
        <strong>Memory line:</strong> {pack.hook}
      </p>
      <h3>Every question type, and how to solve it</h3>
      <div className="table-scroll">
        <table className="pack-play">
          <thead>
            <tr>
              <th>If the question…</th>
              <th>Do this</th>
              <th>Where it was asked</th>
            </tr>
          </thead>
          <tbody>
            {pack.play.map((r, i) => (
              <tr key={i}>
                <td className="pack-signal">{r.signal}</td>
                <td>
                  <RichText text={r.steps} />
                </td>
                <td className="pack-src">
                  {r.ids.map((id) => {
                    const p = BANK_BY_ID[id];
                    if (!p) return null;
                    const label = `${p.source.replace(/ \(.*\)$/, '')}`;
                    return print ? (
                      <div key={id}>
                        {label} <span className="muted">({p.title.replace(/^[^:]*: /, '')})</span>
                      </div>
                    ) : (
                      <div key={id}>
                        <a
                          href={`#/practice/${id}`}
                          onClick={(e) => {
                            if (onPick?.(id)) e.preventDefault();
                          }}
                        >
                          {label}
                        </a>
                      </div>
                    );
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
