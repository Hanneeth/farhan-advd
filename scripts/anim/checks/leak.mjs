// For every your-turn stop: is the answer already visible (stage or caption) at the moment the lesson stops?
// node scripts/anim/checks/leak.mjs index.html [more files] — flags numbers matching a stop's answer that are already on
// screen or in the caption when it stops; most flags are coincidences (a given equal to the answer): judge each one.
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
const exe = [process.env.PW_CHROME, '/opt/pw-browsers/chromium', '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'].find((p) => p && existsSync(p));
const dir = process.env.ANIM_OUT || new URL('../../../anim-dist', import.meta.url).pathname;
const files = process.argv.slice(2);
const b = await chromium.launch(exe ? { executablePath: exe } : {});
let total = 0, flagged = 0;
for (const f of files) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto('file://' + dir + '/' + f); await p.waitForTimeout(800);
  const res = await p.evaluate(async () => {
    const svg = document.querySelector('svg.stage');
    const scratch = el('svg', {}, document.body);
    const out = [];
    const scenes = window.__scenes();
    for (const s of scenes) {
      const S = makeCtx(scratch, SCENES[s.i]); SCENES[s.i].build(S);
      const stops = S.stops.map((x) => ({ ...x }));
      while (scratch.firstChild) scratch.removeChild(scratch.firstChild);
      for (const st of stops) {
        window.__seek(s.off + st.t);
        const vis = (n) => { for (let e = n; e && e !== svg; e = e.parentNode) { if (e.style && e.style.opacity !== '' && +e.style.opacity < 0.08) return false; if (e.style && e.style.display === 'none') return false; } return true; };
        const texts = [];
        const walk = (n) => {
          if (n.nodeType === 3) { if (n.textContent.trim() && vis(n.parentNode)) texts.push(n.textContent); return; }
          if (n.classList && (n.classList.contains('katex-mathml'))) return;
          n.childNodes.forEach(walk);
        };
        walk(svg);
        const stage = texts.join(' ').replace(/\s+/g, ' ');
        const cap = document.querySelector('.subs').innerText;
        out.push({ scene: s.i, title: s.title, t: st.t, q: st.q, answer: st.answer, choices: st.choices ? st.choices[st.answer] : null, stage, cap });
      }
    }
    return out;
  });
  for (const r of res) {
    total++;
    const hits = [];
    const scan = (txt, where) => {
      const norm = txt.replace(/−/g, '-').replace(/(\d),(\d{3})/g, '$1$2');
      if (r.answer != null && typeof r.answer === 'number' && r.answer !== 0) {
        const v = Math.abs(r.answer);
        const cands = []; for (let k = -6; k <= 6; k++) cands.push(v * 10 ** (3 * k));
        cands.push(v * 100);
        for (const m of norm.matchAll(/\d+(?:\.\d+)?/g)) {
          const n = +m[0]; if (!n) continue;
          if (v >= 1 && v < 10 && Number.isInteger(v) && m[0].length < 2) continue; // tiny integers are noise
          if (cands.some((c) => Math.abs(n - c) / c < 0.012 && m[0].replace('.', '').replace(/^0+/, '').length >= 2)) hits.push(`${where}: …${norm.slice(Math.max(0, m.index - 70), m.index + 30)}…`);
        }
      }
      if (r.choices) { const c = r.choices.replace(/<[^>]+>/g, '').trim(); if (c.length > 6 && norm.includes(c.slice(0, 30))) hits.push(`${where} (choice): ${c.slice(0, 60)}`); }
    };
    scan(r.stage, 'stage'); scan(r.cap, 'caption'); scan(r.q.replace(/<[^>]+>/g, ' '), 'question');
    if (hits.length) { flagged++; console.log(`\n[${f}] scene ${r.scene} "${r.title}" t=${r.t.toFixed(1)} ans=${r.answer}\n  Q: ${r.q.replace(/<[^>]+>/g, '').slice(0, 140)}\n  ` + [...new Set(hits)].slice(0, 4).join('\n  ')); }
  }
  await p.close();
}
console.log(`\n${flagged} of ${total} stops flagged`);
await b.close();
