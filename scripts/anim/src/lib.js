/* Drawing kit for the stage. All helpers take the scene context S and draw into S.layer. */
'use strict';

function txt(S, x, y, str, o = {}, parent) {
  const size = o.size || 22;
  const t = S.el('text', { x, y, 'font-size': size, fill: o.color || C.text, 'text-anchor': o.anchor || 'start', 'font-weight': o.weight || 500, class: o.mono ? 'mono' : null }, parent);
  if (o.italic) t.setAttribute('font-style', 'italic');
  richText(t, str, size);
  return t;
}

function wire(S, pts, o = {}, parent) {
  return S.el('polyline', { points: pts.map((p) => p.join(',')).join(' '), fill: 'none', stroke: o.color || C.wire, 'stroke-width': o.w || 2.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': o.dash || null }, parent);
}
function dot(S, x, y, o = {}, parent) { return S.el('circle', { cx: x, cy: y, r: o.r || 5.5, fill: o.color || C.wire }, parent); }
function rail(S, x1, x2, y, label = 'V_DD', parent) {
  const g = S.g({}, parent);
  wire(S, [[x1, y], [x2, y]], { w: 3.4 }, g);
  if (label) txt(S, x2 + 10, y + 7, label, { size: 20, color: C.muted }, g);
  return g;
}
function gnd(S, x, y, parent) {
  const g = S.g({}, parent);
  wire(S, [[x, y], [x, y + 12]], {}, g);
  wire(S, [[x - 15, y + 12], [x + 15, y + 12]], { w: 2.8 }, g);
  wire(S, [[x - 9, y + 18], [x + 9, y + 18]], { w: 2.4 }, g);
  wire(S, [[x - 3.5, y + 24], [x + 3.5, y + 24]], { w: 2 }, g);
  return g;
}

/* MOSFET. x = drain/source column, y = centre. o: {p, name, gate, right (gate on right), gl (gate lead), col, nameSide} */
function fet(S, x, y, o = {}, parent) {
  const g = S.g({ class: 'fet' }, parent);
  const col = o.col || (o.p ? C.p : C.n);
  const d = o.right ? 1 : -1;
  const xc = x + 20 * d, xg = xc + 10 * d, gl = o.gl ?? 34;
  const sw = { stroke: col, 'stroke-width': 2.8, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  S.el('line', { x1: xc, y1: y - 27, x2: xc, y2: y + 27, ...sw, 'stroke-width': 4.2 }, g);
  S.el('line', { x1: xg, y1: y - 22, x2: xg, y2: y + 22, ...sw, 'stroke-width': 3.4 }, g);
  S.el('polyline', { points: `${x},${y - 50} ${x},${y - 18} ${xc},${y - 18}`, ...sw }, g);
  S.el('polyline', { points: `${xc},${y + 18} ${x},${y + 18} ${x},${y + 50}`, ...sw }, g);
  S.el('line', { x1: xg, y1: y, x2: xg + gl * d, y2: y, ...sw }, g);
  if (o.p) { // arrow into the channel at the top (source)
    const tip = xc - 2 * d, base = xc - 13 * d;
    S.el('polygon', { points: `${tip},${y - 18} ${base},${y - 24} ${base},${y - 12}`, fill: col }, g);
  } else { // arrow out of the channel at the bottom (source)
    const tip = x - 2 * d, base = x - 13 * d;
    S.el('polygon', { points: `${tip},${y + 18} ${base},${y + 12} ${base},${y + 24}`, fill: col }, g);
  }
  if (o.gate) txt(S, xg + (gl + 8) * d, y + 7, o.gate, { size: o.gsize || 20, color: o.gcol || C.muted, anchor: d < 0 ? 'end' : 'start' }, g);
  if (o.name) {
    const ns = o.nameSide || (d < 0 ? 'r' : 'l');
    txt(S, x + (ns === 'r' ? 12 : -12), y + 8, o.name, { size: o.nsize || 23, color: col, weight: 750, anchor: ns === 'r' ? 'start' : 'end' }, g);
  }
  return Object.assign(g, { top: [x, y - 50], bot: [x, y + 50], gate: [xg + gl * d, y], x, y });
}
const nmos = (S, x, y, o = {}, p) => fet(S, x, y, { ...o, p: false }, p);
const pmos = (S, x, y, o = {}, p) => fet(S, x, y, { ...o, p: true }, p);

/* current source, arrow down by default. centre (x,y), leads to y±len */
function isrc(S, x, y, o = {}, parent) {
  const g = S.g({}, parent);
  const len = o.len ?? 42, col = o.col || C.wire;
  S.el('line', { x1: x, y1: y - len, x2: x, y2: y - 21, stroke: col, 'stroke-width': 2.6 }, g);
  S.el('line', { x1: x, y1: y + 21, x2: x, y2: y + len, stroke: col, 'stroke-width': 2.6 }, g);
  S.el('circle', { cx: x, cy: y, r: 21, fill: C.bg, stroke: col, 'stroke-width': 2.6 }, g);
  const up = o.up ? -1 : 1;
  S.el('line', { x1: x, y1: y - 11 * up, x2: x, y2: y + 7 * up, stroke: col, 'stroke-width': 2.6 }, g);
  S.el('polygon', { points: `${x},${y + 13 * up} ${x - 6},${y + 4 * up} ${x + 6},${y + 4 * up}`, fill: col }, g);
  if (o.label) txt(S, x + (o.left ? -30 : 30), y + 8, o.label, { size: o.lsize || 21, color: o.lcol || C.text, anchor: o.left ? 'end' : 'start' }, g);
  return Object.assign(g, { top: [x, y - len], bot: [x, y + len] });
}
/* vertical resistor between y1 and y2 at x */
function res(S, x, y1, y2, o = {}, parent) {
  const g = S.g({}, parent);
  const n = 6, a = 9, L = 12, st = (y2 - y1 - 2 * L) / n;
  const pts = [[x, y1], [x, y1 + L]];
  for (let i = 0; i < n; i++) pts.push([x + (i % 2 ? -a : a), y1 + L + st * (i + 0.5)]);
  pts.push([x, y2 - L], [x, y2]);
  wire(S, pts, { color: o.col || C.wire, w: 2.6 }, g);
  if (o.label) txt(S, x + (o.left ? -18 : 18), (y1 + y2) / 2 + 8, o.label, { size: o.lsize || 21, color: o.lcol || C.text, anchor: o.left ? 'end' : 'start' }, g);
  return g;
}
function resh(S, x1, x2, y, o = {}, parent) {
  const g = S.g({}, parent);
  const n = 6, a = 9, L = 12, st = (x2 - x1 - 2 * L) / n;
  const pts = [[x1, y], [x1 + L, y]];
  for (let i = 0; i < n; i++) pts.push([x1 + L + st * (i + 0.5), y + (i % 2 ? -a : a)]);
  pts.push([x2 - L, y], [x2, y]);
  wire(S, pts, { color: o.col || C.wire, w: 2.6 }, g);
  if (o.label) txt(S, (x1 + x2) / 2, y - 18, o.label, { size: o.lsize || 21, color: o.lcol || C.text, anchor: 'middle' }, g);
  return g;
}
function cap(S, x, y, o = {}, parent) { // vertical cap from y down to ground
  const g = S.g({}, parent);
  wire(S, [[x, y], [x, y + 18]], {}, g);
  wire(S, [[x - 16, y + 18], [x + 16, y + 18]], { w: 3.2 }, g);
  wire(S, [[x - 16, y + 27], [x + 16, y + 27]], { w: 3.2 }, g);
  wire(S, [[x, y + 27], [x, y + 42]], {}, g);
  gnd(S, x, y + 42, g);
  if (o.label) txt(S, x + 24, y + 30, o.label, { size: 20, color: C.muted }, g);
  return g;
}
/* amplifier triangle pointing right, left edge at x, centre y */
function amp(S, x, y, o = {}, parent) {
  const g = S.g({}, parent);
  const w = o.w || 96, h = o.h || 96, col = o.col || C.amb;
  const d = o.left ? -1 : 1;
  S.el('polygon', { points: `${x},${y - h / 2} ${x + w * d},${y} ${x},${y + h / 2}`, fill: 'rgba(251,191,36,0.07)', stroke: col, 'stroke-width': 2.8, 'stroke-linejoin': 'round' }, g);
  if (o.pm !== false) {
    txt(S, x + 12 * d, y - h / 4 + 9, o.flip ? '−' : '+', { size: 24, color: col, weight: 700, anchor: d < 0 ? 'end' : 'start' }, g);
    txt(S, x + 12 * d, y + h / 4 + 9, o.flip ? '+' : '−', { size: 24, color: col, weight: 700, anchor: d < 0 ? 'end' : 'start' }, g);
  }
  if (o.label) txt(S, x + w * (o.lpos ?? 0.36) * d, y + 8, o.label, { size: o.lsize || 22, color: col, weight: 700, anchor: 'middle' }, g);
  return Object.assign(g, { inP: [x, y - h / 4], inN: [x, y + h / 4], out: [x + w * d, y] });
}
function arrow(S, x1, y1, x2, y2, o = {}, parent) {
  const g = S.g({}, parent);
  const col = o.color || C.cur, w = o.w || 3;
  const ang = Math.atan2(y2 - y1, x2 - x1), hl = o.head || 14;
  const bx = x2 - Math.cos(ang) * hl, by = y2 - Math.sin(ang) * hl;
  S.el('line', { x1, y1, x2: bx, y2: by, stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-dasharray': o.dash || null }, g);
  const px = Math.sin(ang) * hl * 0.5, py = -Math.cos(ang) * hl * 0.5;
  S.el('polygon', { points: `${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`, fill: col }, g);
  return g;
}

/* KaTeX equation in a foreignObject. anchor: 'mid' | 'start' | 'end' */
function eq(S, tex, x, y, o = {}, parent) {
  const size = o.size || 34, w = o.w || 1200, h = o.h || size * 2.9;
  const ax = o.anchor === 'start' ? x : o.anchor === 'end' ? x - w : x - w / 2;
  const fo = S.el('foreignObject', { x: ax, y: y - h / 2, width: w, height: h, class: 'fo' }, parent);
  const div = document.createElement('div');
  div.className = 'eqw ' + (o.anchor === 'start' ? '' : o.anchor === 'end' ? 'end' : 'mid');
  div.style.fontSize = size + 'px';
  div.style.color = o.color || C.text;
  div.innerHTML = katex.renderToString(tex, { throwOnError: false, displayMode: false });
  fo.appendChild(div);
  return fo;
}
/* an HTML block in a foreignObject (cards, step lists, tables) */
function html(S, x, y, w, h, inner, cls = '', parent) {
  const fo = S.el('foreignObject', { x, y, width: w, height: h, class: 'fo' }, parent);
  const div = document.createElement('div');
  div.className = cls;
  div.style.height = '100%';
  div.innerHTML = inner;
  fo.appendChild(div);
  return fo;
}
/* inline rich text for HTML blocks: $tex$, $$display tex$$ (chains of = broken into aligned lines) and **bold** */
function rt(s) {
  const maths = [];
  const t = s.replace(/\$\$([^$]+)\$\$/g, (_m, x) => `\u0001${maths.push(x) - 1}\u0001`).replace(/\$([^$]+)\$/g, (_m, x) => `\u0000${maths.push(x) - 1}\u0000`);
  return t.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\u0001(\d+)\u0001/g, (_m, i) => texBlock(maths[+i]))
    .replace(/\u0000(\d+)\u0000/g, (_m, i) => katex.renderToString(maths[+i], { throwOnError: false }));
}
/* A worked line like "A = f(x) = 3·4 = 12" becomes one step per line:
     A = f(x)
       = 3·4
       = 12
   Several equations joined by \quad or ,\; go on separate lines. Already-aligned TeX is left alone. */
function autoAlign(tex) {
  if (/\\begin|\\\\/.test(tex)) return tex;
  const top = (s, re) => { // split s at matches of re that sit outside braces / \left..\right
    const out = []; let d = 0, last = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '\\' && s.startsWith('\\left', i)) { d++; i += 4; continue; }
      if (c === '\\' && s.startsWith('\\right', i)) { d--; i += 5; continue; }
      if (c === '{') d++; else if (c === '}') d--;
      else if (d === 0) { re.lastIndex = i; const m = re.exec(s); if (m && m.index === i) { out.push([s.slice(last, i), m[0]]); last = i + m[0].length; i = last - 1; } }
      if (c === '\\' && d >= 0 && s[i + 1] && /[{}]/.test(s[i + 1])) i++;
    }
    out.push([s.slice(last), '']);
    return out;
  };
  const eqs = top(tex, /,?\s*\\(?:quad|qquad)(?![a-zA-Z])\s*|,\s*\\;\s*/y).map(([p]) => p.trim()).filter(Boolean);
  const rows = [];
  for (const e of eqs) {
    const parts = top(e, /=|\\approx(?![a-zA-Z])/y);
    if (parts.length < 3 && eqs.length === 1) return tex; // a single short relation: keep it on one line
    if (parts.length === 1) { rows.push(e + ' &'); continue; }
    // lhs &= a \\ &= b \\ ...
    let row = parts[0][0].trim() + ` &${parts[0][1]} `;
    for (let k = 1; k < parts.length; k++) row += parts[k][0].trim() + (parts[k][1] ? ` \\\\ &${parts[k][1]} ` : '');
    rows.push(row);
  }
  return `\\begin{aligned}${rows.join(' \\\\[4pt] ')}\\end{aligned}`;
}
function texBlock(tex) {
  return `<div class="tb">${katex.renderToString(autoAlign(tex), { throwOnError: false, displayMode: true })}</div>`;
}
/* height an HTML block will take at a given width (measured offscreen, same stylesheet) */
function measureHTML(inner, w, cls = '') {
  let m = document.getElementById('measure');
  if (!m) { m = document.createElement('div'); m.id = 'measure'; m.className = 'fo'; m.style.cssText = 'position:absolute;left:-5000px;top:0;visibility:hidden'; document.body.appendChild(m); }
  m.style.width = w + 'px';
  m.innerHTML = `<div class="${cls}">${inner}</div>`;
  return m.firstChild.getBoundingClientRect().height;
}

/* rounded label chip on the stage */
function chip(S, x, y, str, o = {}, parent) {
  const g = S.g({}, parent);
  const size = o.size || 20, col = o.color || C.amb;
  const t = txt(S, x, y + size * 0.36, str, { size, color: col, weight: 700, anchor: 'middle' }, g);
  const b = bbox(t);
  const pad = 12;
  const r = S.el('rect', { x: b.x - pad, y: b.y - 6, width: b.width + 2 * pad, height: b.height + 12, rx: 10, fill: o.bg || 'rgba(20,26,36,0.92)', stroke: col, 'stroke-width': 1.6 }, g);
  g.insertBefore(r, t);
  return g;
}

/* A branch current you can follow: moving dashes along pts (in the direction of conventional current),
   an arrowhead on every long segment, and a label chip such as "I_SS/2 = 0.5 mA".
   o.at = [x, y] for the chip (default: beside the middle of the longest segment), o.color, o.w, o.speed.
   Shown from t0, gone at t1 (null = stays). Returns the group. */
function current(S, pts, t0, t1, label, o = {}) {
  const col = o.color || C.cur;
  const g = S.g(); const restore = S.into(g);
  S.flow(pts, t0, t1, { color: col, w: o.w || 4, speed: o.speed || 70 });
  const deco = S.g();
  let best = 0, mid = pts[0], dir = [0, 1];
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1], [x2, y2] = pts[i];
    const L = Math.hypot(x2 - x1, y2 - y1);
    if (L < 1) continue;
    const ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    if (L >= 50 || pts.length === 2) {
      const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2, a = 9;
      S.el('polygon', { points: `${cx + ux * a},${cy + uy * a} ${cx - ux * a - uy * a},${cy - uy * a + ux * a} ${cx - ux * a + uy * a},${cy - uy * a - ux * a}`, fill: col, stroke: '#0a0e15', 'stroke-width': 1.2 }, deco);
    }
    if (L > best) { best = L; mid = [(x1 + x2) / 2, (y1 + y2) / 2]; dir = [ux, uy]; }
  }
  if (label) {
    const at = o.at || [mid[0] + (Math.abs(dir[1]) > 0.5 ? 70 : 0), mid[1] + (Math.abs(dir[1]) > 0.5 ? 0 : -26)];
    chip(S, at[0], at[1], label, { color: col, size: o.size || 17 }, deco);
  }
  deco.style.opacity = 0;
  S.fade(deco, t0, 0.5);
  if (t1) S.out(deco, t1, 0.5);
  restore();
  return g;
}

/* scene header: chapter tag + title in the top-left HUD */
function header(S, tag, title) {
  const g = S.g({}, S.hud);
  txt(S, 44, 52, tag, { size: 17, color: C.cur, weight: 750 }, g).setAttribute('letter-spacing', '2.5');
  txt(S, 44, 86, title, { size: 30, color: '#f3f6fa', weight: 750 }, g);
  S.fade(g, 0, 0.6);
  return g;
}

/* plots */
function axes(S, x0, y0, w, h, o = {}, parent) {
  const g = S.g({}, parent);
  arrow(S, x0, y0, x0 + w, y0, { color: C.muted, w: 2, head: 11 }, g);
  arrow(S, x0, y0, x0, y0 - h, { color: C.muted, w: 2, head: 11 }, g);
  if (o.x) txt(S, x0 + w - 4, y0 + 30, o.x, { size: 19, color: C.muted, anchor: 'end' }, g);
  if (o.y) txt(S, x0 + 10, y0 - h + 4, o.y, { size: 19, color: C.muted }, g);
  return g;
}
function curve(S, f, x0, x1, o = {}, parent) {
  const pts = [];
  const n = o.n || 160;
  for (let i = 0; i <= n; i++) { const x = x0 + ((x1 - x0) * i) / n; pts.push([+x.toFixed(1), +f(x).toFixed(1)]); }
  return wire(S, pts, { color: o.color || C.volt, w: o.w || 3.2, dash: o.dash }, parent);
}

/* tower: stacked blocks, bottom to top. blocks: [{v, name, st: 'min'|'ok'|'sq'|'room'|'diode'}] */
const TST = { min: ['#1f2733', '#7b8797'], ok: ['#173a2c', '#34d399'], sq: ['#4a1d1d', '#f87171'], room: ['#0f1f19', '#34d399'], diode: ['#3d2a12', '#fbbf24'] };
function tower(S, x, yb, blocks, sc, o = {}, parent) {
  const g = S.g({}, parent);
  const w = o.w || 92;
  let y = yb;
  const ys = [yb];
  for (const b of blocks) {
    const hh = b.v * sc;
    const [fill, stroke] = TST[b.st || 'min'];
    S.el('rect', { x, y: y - hh, width: w, height: hh, rx: 4, fill, stroke, 'stroke-width': 2, 'stroke-dasharray': b.st === 'room' ? '6 5' : null }, g);
    if (b.name) txt(S, x + w / 2, y - hh / 2 + 8, b.name, { size: hh > 26 ? 21 : 16, color: stroke, weight: 750, anchor: 'middle' }, g);
    if (b.note) txt(S, x + w + 12, y - hh / 2 + 7, b.note, { size: 19, color: stroke, weight: b.st === 'sq' ? 700 : 500 }, g);
    y -= hh;
    ys.push(y);
  }
  if (o.nodes) o.nodes.forEach((lab, i) => { if (lab) txt(S, x - 10, ys[i] + 7, lab, { size: 18, color: C.muted, anchor: 'end' }, g); });
  return Object.assign(g, { ys });
}

/* a sine trace inside a box: centre line y, amplitude a, from x0 to x1 */
function sine(S, x0, x1, y, a, o = {}, parent) {
  const cyc = o.cycles || 2, ph = o.phase || 0;
  return curve(S, (x) => y - a * Math.sin(ph + ((x - x0) / (x1 - x0)) * cyc * 2 * Math.PI), x0, x1, { color: o.color, w: o.w || 3 }, parent);
}

/* ── plotting helpers shared by the lessons ── */
/* a moving dot + trail along y = f(t) inside a plot; t runs t0..t1 in scene time, x maps tt→px */
function tracePlot(S, f, X, Y, t0, t1, col, tmax) {
  const pl = S.el('polyline', { fill: 'none', stroke: col, 'stroke-width': 3.4, 'stroke-linecap': 'round' });
  const dt = S.el('circle', { r: 7, fill: col }); dt.style.opacity = 0;
  S.anim(t0, t1 - t0, pl.id + ':tr', (p) => {
    const n = Math.max(2, Math.round(160 * p)); const pts = [];
    for (let i = 0; i <= n; i++) { const tt = (tmax * p * i) / n; pts.push(`${X(tt).toFixed(1)},${Y(f(tt)).toFixed(1)}`); }
    pl.setAttribute('points', pts.join(' '));
    const tt = tmax * p; dt.setAttribute('cx', X(tt)); dt.setAttribute('cy', Y(f(tt))); dt.style.opacity = p > 0 && p < 1 ? 1 : 0;
  }, E.lin);
  return pl;
}

const fmtHz = (f) => (f >= 1e9 ? fx(f / 1e9) + ' GHz' : f >= 1e6 ? fx(f / 1e6) + ' MHz' : f >= 1e3 ? fx(f / 1e3) + ' kHz' : fx(f) + ' Hz');
/* log-frequency plot frame: decades d0..d1 (Hz exponents), y in dB (db0 at top .. db1 at bottom) */
function bodeFrame(S, x0, y0, w, h, d0, d1, db0, db1, o = {}) {
  const g = S.g();
  const fxp = (f) => x0 + ((Math.log10(f) - d0) / (d1 - d0)) * w;
  const fy = (db) => y0 + ((db0 - db) / (db0 - db1)) * h;
  S.el('rect', { x: x0, y: y0, width: w, height: h, fill: '#0e141e', stroke: '#222c3b', rx: 6 }, g);
  for (let d = d0; d <= d1; d++) {
    const x = fxp(10 ** d);
    S.el('line', { x1: x, y1: y0, x2: x, y2: y0 + h, stroke: '#1f2836', 'stroke-width': 1.4 }, g);
    txt(S, x, y0 + h + 24, ['1 Hz', '10 Hz', '100 Hz', '1k', '10k', '100k', '1M', '10M', '100M', '1G', '10G'][d], { size: 16, color: C.muted, anchor: 'middle' }, g);
  }
  const step = o.dbStep || 20;
  for (let db = db1; db <= db0; db += step) {
    const y = fy(db);
    S.el('line', { x1: x0, y1: y, x2: x0 + w, y2: y, stroke: db === 0 ? '#3a4a60' : '#1f2836', 'stroke-width': db === 0 ? 2 : 1.2 }, g);
    txt(S, x0 - 10, y + 6, (o.unit === 'deg' ? db + '°' : db + ' dB'), { size: 16, color: C.muted, anchor: 'end' }, g);
  }
  if (o.title) txt(S, x0 + 6, y0 - 12, o.title, { size: 18, color: C.muted }, g);
  return { g, fxp, fy };
}
/* a polyline whose points are recomputed by fn(t) every frame */
function liveLine(S, col, wd = 3.4, dash) {
  const pl = S.el('polyline', { fill: 'none', stroke: col, 'stroke-width': wd, 'stroke-linejoin': 'round', 'stroke-dasharray': dash || null });
  return pl;
}
const ptsOf = (n, a, b, fn) => { const out = []; for (let i = 0; i <= n; i++) { const u = a + ((b - a) * i) / n; const [x, y] = fn(u); out.push(`${x.toFixed(1)},${y.toFixed(1)}`); } return out.join(' '); };


/* an arrow whose ends are set every frame */
function dynArrow(S, col, w = 4, parent) {
  const g = S.g({}, parent);
  const ln = S.el('line', { stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
  const hd = S.el('polygon', { fill: col }, g);
  return Object.assign(g, {
    set(x1, y1, x2, y2, hl = 16) {
      const L = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1), h = Math.min(hl, L * 0.6);
      const bx = x2 - Math.cos(a) * h, by = y2 - Math.sin(a) * h, px = Math.sin(a) * h * 0.5, py = -Math.cos(a) * h * 0.5;
      ln.setAttribute('x1', x1); ln.setAttribute('y1', y1); ln.setAttribute('x2', bx); ln.setAttribute('y2', by);
      hd.setAttribute('points', `${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`);
      g.style.visibility = L < 1 ? 'hidden' : 'visible';
    },
  });
}

