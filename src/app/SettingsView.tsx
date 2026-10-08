import { useRef, useState } from 'react';
import { exportProgress, importProgress, resetProgress, setSettings, useProgress } from './store';

export function SettingsView() {
  const p = useProgress();
  const s = p.settings;
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportProgress());
      setMsg('Progress copied. Paste it into a note to keep a backup.');
    } catch {
      setShowJson(true);
      setMsg('Copying is blocked here: select the text below and copy it yourself.');
    }
  };

  const download = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `analog-gym-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="page narrow">
      <h1>Settings</h1>
      <div className="settings card">
        <label>
          Theme
          <select value={s.theme} onChange={(e) => setSettings({ theme: e.target.value as typeof s.theme })}>
            <option value="auto">Follow system</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label>
          Circuit drawing style
          <select value={s.drawStyle} onChange={(e) => setSettings({ drawStyle: e.target.value as typeof s.drawStyle })}>
            <option value="symbol">Transistor symbols (as in your notes)</option>
            <option value="box">Simplified labelled boxes</option>
          </select>
        </label>
        <label>
          Answer tolerance
          <select value={s.tol} onChange={(e) => setSettings({ tol: Number(e.target.value) })}>
            <option value={0.01}>±1%</option>
            <option value={0.02}>±2%</option>
            <option value={0.05}>±5%</option>
          </select>
        </label>
      </div>

      <h2>Your progress file</h2>
      <p className="small muted">Progress is stored in this browser. Export (or copy) it to move it to your phone or keep a backup. Paste-import: save the copied text as a .json file and use Import.</p>
      <div className="row">
        <button type="button" className="btn" onClick={download}>
          Export progress (.json)
        </button>
        <button type="button" className="btn" onClick={copy}>
          Copy progress
        </button>
        <button type="button" className="btn" onClick={() => file.current?.click()}>
          Import progress…
        </button>
        <input
          ref={file}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const r = importProgress(await f.text());
            setMsg(r.ok ? 'Progress imported.' : r.error ?? 'Import failed.');
          }}
        />
        {confirmReset ? (
          <>
            <button
              type="button"
              className="btn"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
                setMsg('Progress erased. Settings kept.');
              }}
            >
              Yes, erase everything
            </button>
            <button type="button" className="btn ghost" onClick={() => setConfirmReset(false)}>
              Keep it
            </button>
          </>
        ) : (
          <button type="button" className="btn ghost" onClick={() => setConfirmReset(true)}>
            Reset progress…
          </button>
        )}
      </div>
      {msg && <p className="callout small">{msg}</p>}
      {showJson && <textarea className="json-box" readOnly value={exportProgress()} onFocus={(e) => e.currentTarget.select()} aria-label="Progress as JSON" />}
    </div>
  );
}
