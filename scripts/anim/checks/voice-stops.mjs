// Run after building: node scripts/anim/checks/voice-stops.mjs <file> [N stops] [1 = fake fast voice]   (exit 1 if a line is cut off)
// For N stops spread through a lesson: seek 8 s before the stop, play with the voice on, and log whether any line is cut off before the question opens.
import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
const exe = [process.env.PW_CHROME, '/opt/pw-browsers/chromium', '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'].find((p) => p && existsSync(p));
const dir = process.env.ANIM_OUT || new URL('../../../anim-dist', import.meta.url).pathname;
const [file, N = 8, fake = '0'] = process.argv.slice(2);
const b = await chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: ['--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage({ viewport: { width: 1920, height: 950 } });
await p.addInitScript((fk) => {
  const log = (window.__vlog = []);
  const on = () => !!document.querySelector('.try.on');
  if (fk === '1') {
    let cur = null, timer = null, q = [];
    const fs = { speaking: false, paused: false, getVoices: () => [{ name: 'Fake', lang: 'en-US', localService: true }], speak(u) { q.push(u); if (!cur) nx(); },
      cancel() { if (cur) log.push({ ev: 'cut', text: cur.text, tryOpen: on() }); clearTimeout(timer); cur = null; q = []; fs.speaking = false; }, pause() {}, resume() {} };
    function nx() { cur = q.shift(); if (!cur) { fs.speaking = false; return; } fs.speaking = true; log.push({ ev: 'start', text: cur.text, tryOpen: on() }); const u = cur; timer = setTimeout(() => { cur = null; u.onend && u.onend(); nx(); }, 60 * u.text.split(' ').length); }
    Object.defineProperty(window, 'speechSynthesis', { value: fs }); window.SpeechSynthesisUtterance = function (t) { this.text = t; };
  }
  const pz = HTMLMediaElement.prototype.pause, pl = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () { log.push({ ev: 'start', text: 'audio', tryOpen: on() }); return pl.call(this); };
  HTMLMediaElement.prototype.pause = function () { if (!this.ended && this.currentTime < (this.duration || 1e9) - 0.05) log.push({ ev: 'cut', text: `audio ${this.currentTime.toFixed(2)}/${(this.duration || 0).toFixed(2)}`, tryOpen: on() }); return pz.call(this); };
  try { localStorage.setItem('alab.pace', '0'); localStorage.setItem('alab.voiceOn', '1'); } catch (_) {}
}, fake);
await p.goto('file://' + dir + '/' + file); await p.waitForTimeout(1000);
const stops = await p.evaluate(() => { const sc = el('svg', {}, document.body), out = []; SCENES.forEach((s, i) => { const S = makeCtx(sc, s); s.build(S); S.stops.forEach((st) => out.push(Player.offsets()[i] + st.t)); while (sc.firstChild) sc.removeChild(sc.firstChild); }); sc.remove(); return out; });
const pick = Array.from({ length: +N }, (_, k) => stops[Math.floor((k * stops.length) / +N)]);
console.log('voice:', await p.evaluate(() => Voice.current()?.name), '| studio lines:', await p.evaluate(() => Object.keys(AUDIO).length));
let cutAll = 0;
for (const T of pick) {
  await p.evaluate((t) => { window.__vlog.length = 0; Player.setDrills(false); Player.seek(Math.max(0, t - 8), true); Player.play(); }, T);
  const t0 = Date.now(); let opened = false;
  while (Date.now() - t0 < 60000) { await p.waitForTimeout(200); if (await p.evaluate(() => Try.isOpen())) { opened = true; break; } }
  await p.waitForTimeout(1500);
  const log = await p.evaluate(() => window.__vlog.slice());
  const cuts = log.filter((e) => e.ev === 'cut' && !e.tryOpen);
  cutAll += cuts.length;
  const read = log.filter((e) => e.ev === 'start' && e.tryOpen).length;
  console.log(`stop @${T.toFixed(1)}s: opened ${opened} after ${((Date.now() - t0) / 1000).toFixed(1)}s, lines ${log.filter((e) => e.ev === 'start').length}, cut ${cuts.length}${cuts.length ? ' ' + JSON.stringify(cuts.map((c) => c.text.slice(0, 60))) : ''}, question read: ${read > 0}`);
  await p.evaluate(() => { const sk = [...document.querySelectorAll('.try .row button')].find((x) => x.textContent === 'Skip'); sk && sk.click(); Player.pause(); });
}
await b.close();
process.exit(cutAll ? 1 : 0);
