// Lists every line the lesson can speak (subtitles, say-it-back lines, drill prompts, your-turn questions) as {k, text} → audio/<lesson>.json.
// Run after build.mjs; then `python3 scripts/anim/tts.py <lesson>` renders the missing ones; then build again.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const key = process.argv[2] || 'c';
const file = { a: 'index.html', b: 'lec11-14.html', c: 'lec06.html', d: 'lec15-17.html', e: 'rev01-10.html', f: 'lec18-22.html' }[key];
const exe = ['/opt/pw-browsers/chromium', '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'].find((p) => existsSync(p));
const b = await chromium.launch(exe ? { executablePath: exe } : {});
const p = await b.newPage();
await p.goto('file://' + join(here, '..', '..', 'anim-dist', file)); await p.waitForTimeout(800);
const lines = await p.evaluate(() => {
  const scratch = el('svg', {}, document.body); const all = [];
  SCENES.forEach((s) => {
    const S = makeCtx(scratch, s); s.build(S); S.caps.forEach((c) => c.html && all.push(c.html)); (s.recall || []).forEach((r) => all.push(r));
    // the your-turn questions, exactly as Try reads them aloud
    S.stops.forEach((st) => { const ps = st.parts || []; if (!st.q) return; all.push(st.q + (ps.length ? ' First, step 1. ' + ps[0].q : '')); ps.forEach((p, i) => i && all.push(`Step ${i + 1}. ${p.q}`)); });
    while (scratch.firstChild) scratch.removeChild(scratch.firstChild);
  });
  all.push(...Voice.PROMPTS, 'Correct.', 'Not quite.', 'Now the answer to the question.');
  const seen = new Map(); all.forEach((h) => { const text = Voice.toSpeech(h); if (text) seen.set(Voice.key(text), text); });
  return [...seen].map(([k, text]) => ({ k, text }));
});
mkdirSync(join(here, 'audio'), { recursive: true });
writeFileSync(join(here, 'audio', key + '.json'), JSON.stringify(lines, null, 1));
console.log(lines.length, 'lines →', 'audio/' + key + '.json');
await b.close();
