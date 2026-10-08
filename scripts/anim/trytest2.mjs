import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser' });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const errs = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('file://' + process.cwd() + '/anim-dist/lec11-14.html'); await p.waitForTimeout(1200);
const sc = await p.evaluate(() => window.__scenes());
const s = sc.find((x) => x.title.startsWith('Tutorial 6 Q1'));
await p.evaluate((t) => window.__seek(t), s.off + 14.5); await p.click('#play'); await p.waitForTimeout(2200);
console.log('stop:', await p.$eval('.try', (e) => e.classList.contains('on')), '|', (await p.$eval('.try .p', (e) => e.textContent)).slice(0, 50));
await p.fill('.try input', '4.9975'); await p.click('.try .row button.go');
console.log('->', await p.$eval('.try .fb', (e) => e.textContent));
await p.click('text=Continue ▶'); await p.waitForTimeout(1200);
console.log('overlay off:', !(await p.$eval('.try', (e) => e.classList.contains('on'))));
// count stops in the whole lesson
console.log('Q scenes:', sc.length, 'errors:', JSON.stringify(errs));
await b.close();
