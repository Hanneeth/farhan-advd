// Run after building: node scripts/anim/checks/stops.mjs  (exit 1 on any problem). Every scene builds; page errors; KaTeX errors in stop texts and step cards; stops missing hint/how; durations.
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
const exe = [process.env.PW_CHROME, '/opt/pw-browsers/chromium', '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'].find((p) => p && existsSync(p));
const dir = process.env.ANIM_OUT || new URL('../../../anim-dist', import.meta.url).pathname;
const b = await chromium.launch(exe ? { executablePath: exe } : {});
const FILES = process.argv.slice(2).length ? process.argv.slice(2) : ['index.html', 'lec11-14.html', 'lec06.html', 'lec15-17.html', 'rev01-10.html', 'lec18-22.html'];
for (const f of FILES) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('file://' + dir + '/' + f); await p.waitForTimeout(800);
  const r = await p.evaluate(() => {
    const out = { scenes: SCENES.length, total: 0, stops: 0, noHow: [], noHint: [], katex: [], buildErr: [], stageKatex: [] };
    SCENES.forEach((s) => {
      out.total += s.dur;
      const sc = el('svg', {}, document.body);
      try {
        const S = makeCtx(sc, s); s.build(S);
        if (sc.querySelector('.katex-error')) out.stageKatex.push(s.title);
        S.stops.forEach((st) => {
          out.stops++; out.parts = (out.parts || 0) + (st.parts || []).length; (st.parts || []).forEach((P) => { if (!(typeof P.answer === 'number' && isFinite(P.answer))) out.buildErr.push('bad part answer: ' + s.title + ' | ' + P.q); });
          const hs = Array.isArray(st.hint) ? st.hint : st.hint ? [st.hint] : [];
          if (!hs.length) out.noHint.push(s.title + ' | ' + String(st.q).slice(0, 50));
          if (!st.how && !st.choices) out.noHow.push(s.title + ' | ' + String(st.q).slice(0, 50));
          const all = [st.q, ...hs, ...(st.how || []), st.why || '', ...(st.choices || []), ...((st.parts || []).flatMap((P) => [P.q, ...(Array.isArray(P.hint) ? P.hint : P.hint ? [P.hint] : []), ...(P.how || [])])), ...((st.calc || []).map((c) => typeof c === 'string' ? c : (c.what || '') + (c.note || '')))];
          all.forEach((t) => { const d = document.createElement('div'); d.innerHTML = rt(String(t)); if (d.querySelector('.katex-error')) out.katex.push(s.title + ' | ' + String(t).slice(0, 60)); });
          if (s.dur < st.t) out.buildErr.push('stop after end: ' + s.title);
        });
      } catch (e) { out.buildErr.push(s.title + ': ' + e.message); }
      sc.remove();
    });
    return out;
  });
  console.log(f, JSON.stringify({ scenes: r.scenes, min: (r.total / 60).toFixed(0), stops: r.stops, parts: r.parts }), 'errs', errs.slice(0, 3));
  if (errs.length) process.exitCode = 1;
  for (const k of ['buildErr', 'stageKatex', 'katex', 'noHint', 'noHow']) if (r[k].length) process.exitCode = 1, console.log('  ', k, r[k].length, JSON.stringify(r[k].slice(0, 6)));
  await p.close();
}
await b.close();
