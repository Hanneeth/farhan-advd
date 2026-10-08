// Screenshots of chosen moments: node scripts/anim/shots.mjs <outdir> <sceneIndex:t,...>  (t in seconds within the scene; 'e' = end)
import { chromium } from 'playwright';
const [,, out, spec, file = 'index.html'] = process.argv;
const b = await chromium.launch({ executablePath: process.env.PW_CHROME || '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser' });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
const errs = [];
p.on('pageerror', (e) => errs.push(String(e)));
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('file://' + process.cwd() + '/anim-dist/' + file, { waitUntil: 'load' });
await p.waitForTimeout(1500);
const scenes = await p.evaluate(() => window.__scenes());
if (spec === 'list') { scenes.forEach((s) => console.log(s.i, s.off.toFixed(0), s.dur, s.title)); await b.close(); process.exit(0); }
const list = spec === 'all' ? scenes.flatMap((s) => [`${s.i}:e`]) : spec.split(',');
for (const it of list) {
  const [si, ts] = it.split(':');
  const s = scenes[+si];
  const t = ts === 'e' ? s.dur - 0.05 : +ts;
  await p.evaluate((g) => window.__seek(g), s.off + t);
  await p.waitForTimeout(250);
  const el = await p.$('.screen');
  await el.screenshot({ path: `${out}/s${si}-${ts}.png` });
}
console.log('scenes', scenes.length, 'total', scenes.reduce((a, s) => a + s.dur, 0).toFixed(0), 's; errors:', JSON.stringify(errs.slice(0, 5)));
await b.close();
