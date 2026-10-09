// Run after building: node scripts/anim/checks/wires.mjs <file> [shotdir] [scene-title filter]   (exit 1 if any loose end)
// Finds wire ends that touch nothing (no other wire, device, box or dot, and no label next to them) at every stop and at the end of
// every scene; a dangling end must persist 0.8 s later to count. Screenshots each problem with the ends ringed in red.
import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
const exe = [process.env.PW_CHROME, '/opt/pw-browsers/chromium', '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'].find((p) => p && existsSync(p));
const dir = process.env.ANIM_OUT || new URL('../../../anim-dist', import.meta.url).pathname;
const [file, outDir = '/tmp/anim-wires', only] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const b = await chromium.launch(exe ? { executablePath: exe } : {});
const p = await b.newPage({ viewport: { width: 1920, height: 950 } });
await p.goto('file://' + dir + '/' + file); await p.waitForTimeout(800);
await p.evaluate(() => { Player.setDrills(false); });
const times = await p.evaluate(() => {
  const scratch = el('svg', {}, document.body); const out = [];
  SCENES.forEach((s, i) => { const S = makeCtx(scratch, s); s.build(S); const o = Player.offsets()[i];
    S.stops.forEach((st) => out.push({ i, title: s.title, t: o + st.t - 0.02, at: 'stop ' + st.t.toFixed(1) }));
    out.push({ i, title: s.title, t: o + s.dur - 0.05, at: 'end' });
    while (scratch.firstChild) scratch.removeChild(scratch.firstChild); });
  scratch.remove(); return out;
});
const probe = () => {
  const svg = document.querySelector('svg.stage') || document.querySelector('#stage svg') || document.querySelector('svg');
  const vis = (e) => { for (let n = e; n && n !== svg; n = n.parentNode) { const cs = getComputedStyle(n); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.15) return false; } return true; };
  const all = [...svg.querySelectorAll('line,polyline,polygon,circle,rect')].filter((e) => !e.closest('foreignObject, defs') && vis(e));
  const tp = (e, x, y) => { const m = e.getScreenCTM(); const q = new DOMPoint(x, y).matrixTransform(m); return [q.x, q.y]; };
  const stroke = (e) => (e.getAttribute('stroke') || getComputedStyle(e).stroke || '').toLowerCase();
  const segs = [], circles = [], ends = [];
  all.forEach((e, id) => {
    const tag = e.tagName;
    if (tag === 'circle') { const [cx, cy] = tp(e, +e.getAttribute('cx'), +e.getAttribute('cy')); const m = e.getScreenCTM(); circles.push({ id, cx, cy, r: +e.getAttribute('r') * Math.hypot(m.a, m.b), fill: (e.getAttribute('fill') || '') !== 'none' }); return; }
    let pts = [];
    if (tag === 'line') pts = [[+e.getAttribute('x1'), +e.getAttribute('y1')], [+e.getAttribute('x2'), +e.getAttribute('y2')]];
    else if (tag === 'rect') { const x = +e.getAttribute('x'), y = +e.getAttribute('y'), w = +e.getAttribute('width'), h = +e.getAttribute('height'); pts = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]; }
    else pts = [...e.points].map((q) => [q.x, q.y]);
    if (tag === 'polygon' && pts.length) pts.push(pts[0]);
    const P = pts.map(([x, y]) => tp(e, x, y));
    const fetG = e.closest('.fet'), body = !!fetG && +(e.getAttribute('stroke-width') || 0) > 3.3;
    for (let k = 0; k + 1 < P.length; k++) segs.push({ id, a: P[k], b: P[k + 1], body, fet: fetG, wire: ['#c3ccd8'].includes(stroke(e)) && !fetG && tag !== 'rect' && tag !== 'polygon' && P.length <= 12 });
    // which ends to check: plain wires and device leads, not plots, plates, arrows or dashed guides
    const sc = stroke(e), sw = +(e.getAttribute('stroke-width') || 0);
    const wireCol = sc === '#c3ccd8' || (['#a78bfa', '#2dd4bf'].includes(sc) && !!e.closest('.fet'));
    if (!wireCol || tag === 'polygon' || tag === 'rect' || e.getAttribute('stroke-dasharray') && !/^0|none/.test(e.getAttribute('stroke-dasharray')) && e.getAttribute('stroke-dashoffset') == null) return;
    if (P.length > 12 || sw > 3.3) return; // rails, channels, gate plates
    const len = P.slice(1).reduce((s, q, k) => s + Math.hypot(q[0] - P[k][0], q[1] - P[k][1]), 0);
    if (P.length === 2 && len < 34) return; // ground bars, capacitor plates
    if (+(getComputedStyle(e).strokeDashoffset || '0').replace('px', '') > 1) return; // still being drawn
    ends.push({ id, q: P[0] }, { id, q: P[P.length - 1] });
  });
  const dSeg = ([x, y], { a, b }) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy; const t = L ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / L)) : 0; return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy); };
  const texts = [...svg.querySelectorAll('text, foreignObject')].filter(vis).map((t) => t.getBoundingClientRect()).filter((r) => r.width > 0);
  const near = ([x, y], r, pad) => x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad;
  const tol = 3.2;
  const free = ends.filter(({ id, q }) => !segs.some((s) => s.id !== id && dSeg(q, s) < tol) && !circles.some((c) => { const d = Math.hypot(q[0] - c.cx, q[1] - c.cy); return Math.abs(d - c.r) < tol || (c.fill && d < c.r + tol); }) && !texts.some((r) => near(q, r, 34)));
  // a wire must never touch a transistor's channel or gate plate (that reads as a short); only its own leads may
  const segX = (s, t) => { const o = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); const d1 = o(s.a, s.b, t.a), d2 = o(s.a, s.b, t.b), d3 = o(t.a, t.b, s.a), d4 = o(t.a, t.b, s.b); return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0)); };
  const bodies = segs.filter((s) => s.body), wires = segs.filter((s) => s.wire);
  const hits = [];
  wires.forEach((w) => bodies.forEach((bd) => { if (segX(w, bd) || dSeg(w.a, bd) < 2.5 || dSeg(w.b, bd) < 2.5 || dSeg(bd.a, w) < 2.5 || dSeg(bd.b, w) < 2.5) hits.push([(bd.a[0] + bd.b[0]) / 2, (bd.a[1] + bd.b[1]) / 2]); }));
  return [...free.map((f) => f.q), ...hits].map((q) => q.map((v) => Math.round(v)));
};
let n = 0, bad = 0;
for (const T of times) {
  if (only && !T.title.includes(only)) continue;
  await p.evaluate((t) => Player.seek(t, true), T.t); await p.waitForTimeout(60);
  let f = await p.evaluate(probe);
  if (f.length) { await p.evaluate((t) => Player.seek(t, true), T.t - 0.8); await p.waitForTimeout(40); await p.evaluate((t) => Player.seek(t, true), T.t); await p.waitForTimeout(60); f = await p.evaluate(probe); }
  n++;
  if (!f.length) continue;
  bad++;
  await p.evaluate((pts) => { pts.forEach(([x, y]) => { const d = document.createElement('div'); d.className = '__ring'; Object.assign(d.style, { position: 'fixed', left: x - 14 + 'px', top: y - 14 + 'px', width: '28px', height: '28px', border: '3px solid red', borderRadius: '50%', zIndex: 99999, pointerEvents: 'none' }); document.body.appendChild(d); }); }, f);
  const name = `${outDir}/s${String(T.i).padStart(2, '0')}_${T.at.replace(/\W+/g, '')}.png`;
  await p.screenshot({ path: name });
  await p.evaluate(() => document.querySelectorAll('.__ring').forEach((d) => d.remove()));
  console.log(`#${T.i} ${T.title} @${T.at}: ${f.length} loose end(s) ${JSON.stringify(f)} → ${name}`);
}
console.log(`${n} moments checked, ${bad} with loose wire ends`);
await b.close();
process.exit(bad ? 1 : 0);
