/** Shared frame for every lab: breadcrumbs, title, intro, figures | controls, and "what to discover". */
import { useEffect, useState, type ReactNode } from 'react';

export interface Challenge {
  id: string;
  text: string;
  done: boolean;
}

/** Remembers each challenge once it has been met (so it stays ticked after you move on). */
export function useChallenges(list: Challenge[]): Record<string, boolean> {
  const [seen, setSeen] = useState<Record<string, boolean>>({});
  const key = list.filter((c) => c.done).map((c) => c.id).join(',');
  useEffect(() => {
    if (!key) return;
    setSeen((s) => {
      const next = { ...s };
      for (const k of key.split(',')) next[k] = true;
      return next;
    });
  }, [key]);
  return seen;
}

export function LabShell({ title, intro, figures, controls, challenges }: { title: string; intro: ReactNode; figures: ReactNode; controls: ReactNode; challenges: Challenge[] }) {
  const seen = useChallenges(challenges);
  const n = challenges.filter((c) => seen[c.id]).length;
  return (
    <div className="page lab">
      <nav className="crumbs small">
        <a href="#/labs">Labs</a> › {title}
      </nav>
      <h1>{title}</h1>
      <p className="muted lab-intro">{intro}</p>
      <div className="lab-grid">
        <div className="lab-figures">{figures}</div>
        <div className="lab-controls">{controls}</div>
      </div>
      <section className="discover">
        <h2>
          What to discover <span className="badge">{n}/{challenges.length}</span>
        </h2>
        <ul className="checklist">
          {challenges.map((c) => (
            <li key={c.id} className={seen[c.id] ? 'done' : ''}>
              <span aria-hidden="true">{seen[c.id] ? '✓' : '○'}</span>
              <span>{c.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
