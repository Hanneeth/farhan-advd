import { useEffect, useState } from 'react';
import { DrawStyleContext } from '../circuits/primitives';
import { LessonView } from '../learn/LessonView';
import { LearnIndex } from '../learn/LearnIndex';
import { DcStepper } from '../labs/DcStepper';
import { LabsIndex } from '../labs/LabsIndex';
import { MosfetLab } from '../labs/MosfetLab';
import { ExamView } from '../review/ExamView';
import { CascodeLab, CsLab, ImpedanceLab } from '../labs/M2Labs';
import { DiffPairLab, FeedbackLab, HeadroomLab, OtaLab } from '../labs/M3Labs';
import { FoldedLab } from '../labs/M4Labs';
import { StabilityLab } from '../labs/M5Labs';
import { EffortLab, InverterLab } from '../labs/DigitalLabs';
import { PracticeView } from '../practice/PracticeView';
import { TopicView } from '../learn/TopicView';
import { ReviewView } from '../review/ReviewView';
import { Gallery } from './Gallery';
import { PathView } from './PathView';
import { SettingsView } from './SettingsView';
import { today, useProgress } from './store';
import { IconCalc, IconLab, IconLearn, IconNotes, IconPath, IconPractice, IconReview, IconSettings, IconSprint } from '../ui/Icons';
import { LecturePage, LecturesIndex } from '../notes/LecturesView';
import { SprintView } from '../sprint/SprintView';
import { CalcView } from '../calc/CalcView';

function useHash(): string {
  const [h, setH] = useState(() => window.location.hash || '#/path');
  useEffect(() => {
    const on = () => setH(window.location.hash || '#/path');
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return h;
}

const NAV = [
  { key: '1', href: '#/path', label: 'Path', match: 'path', Icon: IconPath },
  { key: '6', href: '#/lectures', label: 'Lectures', match: 'lectures', Icon: IconNotes },
  { key: '2', href: '#/learn', label: 'Learn', match: 'learn', Icon: IconLearn },
  { key: '7', href: '#/sprint', label: 'Sprint', match: 'sprint', Icon: IconSprint },
  { key: '3', href: '#/labs', label: 'Labs', match: 'labs', Icon: IconLab },
  { key: '4', href: '#/practice', label: 'Practice', match: 'practice', Icon: IconPractice },
  { key: '5', href: '#/review', label: 'Review', match: 'review', Icon: IconReview },
];

export function App() {
  const hash = useHash();
  const p = useProgress();
  const [, section, arg] = hash.split('/');

  useEffect(() => {
    // Only touch data-theme if the app set it; a host page may set its own.
    const root = document.documentElement;
    if (p.settings.theme === 'auto') {
      if (root.hasAttribute('data-app-theme')) {
        root.removeAttribute('data-theme');
        root.removeAttribute('data-app-theme');
      }
    } else {
      root.setAttribute('data-theme', p.settings.theme);
      root.setAttribute('data-app-theme', '');
    }
  }, [p.settings.theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = NAV.find((x) => x.key === e.key);
      if (n) window.location.hash = n.href;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const due = Object.values(p.cards).filter((c) => c.due <= today()).length;

  let view: React.ReactNode;
  switch (section) {
    case 'learn':
      view = arg ? <LessonView id={arg} /> : <LearnIndex />;
      break;
    case 'topic':
      view = <TopicView key={arg} unit={arg ?? ''} />;
      break;
    case 'labs':
      {
        const LAB: Record<string, () => React.ReactElement> = { mosfet: MosfetLab, dc: DcStepper, impedance: ImpedanceLab, cs: CsLab, cascode: CascodeLab, diffpair: DiffPairLab, ota: OtaLab, feedback: FeedbackLab, headroom: HeadroomLab, folded: FoldedLab, stability: StabilityLab, inverter: InverterLab, effort: EffortLab };
        const L = arg ? LAB[arg] : undefined;
        view = L ? <L /> : <LabsIndex />;
      }
      break;
    case 'practice':
      view = <PracticeView key={arg ?? ''} initial={arg} />;
      break;
    case 'review':
      view = <ReviewView />;
      break;
    case 'exam':
      view = <ExamView />;
      break;
    case 'lectures':
      view = arg ? <LecturePage id={arg} /> : <LecturesIndex />;
      break;
    case 'notes':
      view = arg ? <LecturePage id={arg} /> : <LecturesIndex />;
      break;
    case 'sprint':
      view = <SprintView print={arg === 'print'} />;
      break;
    case 'calc':
      view = <CalcView />;
      break;
    case 'settings':
      view = <SettingsView />;
      break;
    case 'gallery':
      view = <Gallery />;
      break;
    default:
      view = <PathView />;
  }

  if (section === 'sprint' && arg === 'print') return <main id="main">{view}</main>;

  return (
    <DrawStyleContext.Provider value={p.settings.drawStyle}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <a className="brand" href="#/path" aria-label="Analog Gym home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M3 12h4l2-6 4 12 2-6h6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="brand-name">Analog Gym</span>
        </a>
        <nav className="mainnav" aria-label="Main">
          {NAV.map((n) => {
            const active = section === n.match || (!section && n.match === 'path') || (section === 'topic' && n.match === 'learn');
            return (
              <a key={n.href} href={n.href} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined} title={`${n.label} (key ${n.key})`}>
                <n.Icon size={20} />
                <span>{n.label}</span>
                {n.match === 'review' && due > 0 && <span className="pill">{due}</span>}
              </a>
            );
          })}
        </nav>
        <a href="#/calc" className={`settings-link ${section === 'calc' ? 'active' : ''}`} aria-label="fx-991CW recipes" title="fx-991CW recipes">
          <IconCalc size={20} />
        </a>
        <a href="#/settings" className={`settings-link ${section === 'settings' ? 'active' : ''}`} aria-label="Settings" title="Settings">
          <IconSettings size={20} />
        </a>
      </header>
      <main id="main">{view}</main>
    </DrawStyleContext.Provider>
  );
}
