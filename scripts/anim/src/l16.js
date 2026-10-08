/* Lesson D, Lecture 16: reading PM, why small PM means a peak, 5°/45°/60°, peaking = ringing, the 1/β line. */
'use strict';
const L16 = 'Lec 16 · What phase margin looks like';

scene(L16, 'Your page: reading PM off the two plots', 56, (S) => {
  header(S, 'LEC 16 · YOUR PAGE, TOP', 'Find ωGX on the gain plot, read the phase there, measure the gap to −180°');
  pagePeek(S, 'n16a', 1010, 120, 450, 684, 0.3, 7);
  const k = 2000, poles = [5e4, 5e7];
  const B = bodePair(S, { x: 120, w: 760, y: 140, hm: 290, hp: 250, d0: 3, d1: 9, db0: 80, db1: -40, ph1: -180 });
  B.g.style.opacity = 0; S.fade(B.g, 7, 0.6);
  const mc = S.el('polyline', { points: bodePts(B, (f) => dB(LG.mag(f, k, poles)), B.fyM), fill: 'none', stroke: C.volt, 'stroke-width': 3.6 });
  const pc = S.el('polyline', { points: bodePts(B, (f) => LG.ph(f, poles), B.fyP), fill: 'none', stroke: C.amb, 'stroke-width': 3.6 });
  [mc, pc].forEach((e) => { e.style.opacity = 0; S.fade(e, 8, 0.6); });
  const lab = (x, y, s, col, t0) => { const e = txt(S, x, y, s, { size: 18, color: col, weight: 700 }); e.style.opacity = 0; S.fade(e, t0, 0.5); };
  lab(B.fxp(2e5), B.fyM(55), '−20 dB/dec', C.volt, 9); lab(B.fxp(1.6e8), B.fyM(-22), '−40 dB/dec', C.volt, 10);
  const gx = LG.gx(k, poles), ph = LG.ph(gx, poles), pm = 180 + ph;
  // step 1: a dot slides along the gain curve to 0 dB; step 2: drop to the phase; step 3: the gap
  const dt = S.el('circle', { r: 10, fill: C.ok }); dt.style.opacity = 0; S.fade(dt, 12, 0.4);
  S.anim(12, 6, 'slide', (p) => { const f = 10 ** lerp(4, Math.log10(gx), p); dt.setAttribute('cx', B.fxp(f)); dt.setAttribute('cy', B.fyM(dB(LG.mag(f, k, poles)))); }, E.inout);
  const dl = S.el('line', { x1: B.fxp(gx), x2: B.fxp(gx), y1: B.fyM(0), y2: B.fyM(0), stroke: C.ok, 'stroke-width': 2.4, 'stroke-dasharray': '6 5' });
  S.anim(19, 3, 'drop', (p) => { dl.setAttribute('y2', lerp(B.fyM(0), B.fyP(ph), p)); }, E.inout);
  const pd = S.el('circle', { cx: B.fxp(gx), cy: B.fyP(ph), r: 9, fill: C.amb }); pd.style.opacity = 0; S.pop(pd, 22);
  const gapL = S.el('line', { x1: B.fxp(gx), x2: B.fxp(gx), y1: B.fyP(ph), y2: B.fyP(ph), stroke: C.ok, 'stroke-width': 8 });
  S.anim(25, 2, 'gap', (p) => { gapL.setAttribute('y2', lerp(B.fyP(ph), B.fyP(-180), p)); }, E.inout);
  lab(B.fxp(gx) + 16, B.fyP(-180 + pm / 2) + 6, `PM = ${fx(pm, 3)}°`, C.ok, 27);
  lab(B.fxp(gx) + 16, B.fyM(0) - 14, 'ω_GX', C.ok, 18);
  eqAt(S, 'PM = 180^\\circ - |\\angle\\beta A(j\\omega_{GX})|', 1240, 260, 27, { size: 32, w: 640, color: C.ok });
  S.say(0.3, 'Lecture 16 starts with your page’s two-pole amplifier at β = 1: −20 dB per decade after the first pole, −40 after the second, and the phase heading for −180°.');
  S.say(9, 'Reading the phase margin off the two plots is a three-step routine you should be able to do in your sleep.');
  S.say(12, 'One: on the gain plot, slide along the curve to where it crosses 0 dB. That is $\\omega_{GX}$.');
  S.say(19, 'Two: drop straight down to the phase plot at the same frequency and read the phase.');
  S.say(25, 'Three: measure the gap from there to −180°. That gap is the phase margin.');
  whyBox(S, 950, 360, 600, 220, '**Your page’s example:** at $\\omega_{GX}$ the phase reads −175°, so $PM = 180° - 175° = 5°$. The walker is 5° from the cliff. What does that do to the closed loop? Next scene.', 34);
  S.say(34, 'Your page’s example: at the crossover the phase is −175°, so the margin is only 5°. The loop does not oscillate, but it is five degrees from the cliff. What does that do to the closed-loop gain?');
});

scene(L16, 'Why a small PM makes a big peak: two arrows', 76, (S) => {
  header(S, 'LEC 16 · YOUR PAGE, MIDDLE', 'At ωGX, 1 + βA is two unit arrows: small PM, they nearly cancel');
  eqAt(S, 'A_f(j\\omega_{GX}) = \\frac{A}{1 + \\beta A},\\quad |\\beta A| = 1 \\Rightarrow |A| = \\frac{1}{\\beta}', 470, 190, 0.4, { size: 28, w: 820 });
  eqAt(S, '|A_f(\\omega_{GX})| = \\frac{1}{\\beta}\\cdot\\frac{1}{|1 + 1\\angle(PM - 180^\\circ)|}', 470, 280, 6, { size: 28, w: 820, color: '#ffd38a' });
  // vector diagram
  const ox = 320, oy = 620, U = 180;
  const pl = S.g();
  S.el('line', { x1: 60, y1: oy, x2: 640, y2: oy, stroke: C.muted, 'stroke-width': 1.6 }, pl); S.el('line', { x1: ox, y1: oy + 220, x2: ox, y2: oy - 200, stroke: C.muted, 'stroke-width': 1.6 }, pl);
  S.el('circle', { cx: ox + U, cy: oy, r: U, fill: 'none', stroke: '#26324a', 'stroke-width': 1.6, 'stroke-dasharray': '4 6' }, pl);
  pl.style.opacity = 0; S.fade(pl, 12, 0.6);
  const aOne = dynArrow(S, '#e9eef5', 5), aBA = dynArrow(S, C.amb, 5), aSum = dynArrow(S, C.ok, 6);
  const lOne = txt(S, ox + U / 2, oy + 30, '1', { size: 22, color: '#e9eef5', weight: 800, anchor: 'middle' });
  const lBA = txt(S, 0, 0, 'βA (size 1)', { size: 20, color: C.amb, weight: 700 }), lSum = txt(S, 0, 0, '1 + βA', { size: 20, color: C.ok, weight: 800 });
  const arc = S.el('path', { fill: 'none', stroke: C.amb, 'stroke-width': 2.2 }), lAng = txt(S, 0, 0, '', { size: 18, color: C.amb });
  [aOne, aBA, aSum, lOne, lBA, lSum, arc, lAng].forEach((e) => { e.style.opacity = 0; S.fade(e, 12, 0.6); });
  // closed-loop gain plot
  const X0 = 760, Y0 = 820, W = 760, H = 330;
  const ax = axes(S, X0, Y0, W, H, { x: 'frequency (log)', y: '|A_f|·β' }); ax.style.opacity = 0; S.fade(ax, 12, 0.6);
  const oneL = S.el('line', { x1: X0, x2: X0 + W, y1: Y0 - 100, y2: Y0 - 100, stroke: '#3a4a60', 'stroke-dasharray': '5 6' }); txt(S, X0 + W, Y0 - 108, '1 (= 1/β)', { size: 16, color: C.muted, anchor: 'end' });
  const clc = liveLine(S, C.ok, 3.6);
  const rd = [txt(S, 1010, 210, '', { size: 24, color: C.amb, mono: true, weight: 700 }), txt(S, 1010, 248, '', { size: 22, color: C.ok, mono: true }), txt(S, 1010, 290, '', { size: 28, color: C.ok, mono: true, weight: 800 })];
  [oneL, clc, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 12, 0.6); });
  const pmAt = (t) => (t < 20 ? 90 : t < 32 ? lerp(90, 45, E.inout((t - 20) / 12)) : t < 40 ? 45 : t < 50 ? lerp(45, 5, E.inout((t - 40) / 10)) : t < 60 ? 5 : lerp(5, 60, E.inout(clamp((t - 60) / 6, 0, 1))));
  S.anim(0, 1e4, 'vec', (_p, t) => {
    const pm = pmAt(t), th = (pm - 180) / DEG;
    const bx = ox + U + U * Math.cos(th), by = oy - U * Math.sin(th);
    aOne.set(ox, oy, ox + U, oy); aBA.set(ox + U, oy, bx, by); aSum.set(ox, oy, bx, by);
    lBA.setAttribute('x', Math.max(ox + U + 20, (ox + U + bx) / 2 + 30)); lBA.setAttribute('y', Math.max(oy + 56, (oy + by) / 2 + 30));
    lSum.setAttribute('x', (ox + bx) / 2 - 90); lSum.setAttribute('y', (oy + by) / 2 + 28);
    const R = 50; arc.setAttribute('d', `M${ox + U + R} ${oy} A${R} ${R} 0 0 1 ${ox + U + R * Math.cos(th)} ${oy - R * Math.sin(th)}`);
    lAng.setAttribute('x', ox + U + 150); lAng.setAttribute('y', oy + 66); lAng.textContent = `∠βA = ${fx(pm - 180, 3)}°`;
    const mag = 2 * Math.sin(pm / 2 / DEG), K = 1 / mag;
    rd[0].textContent = `PM = ${fx(pm, 3)}°`; rd[1].textContent = `|1 + βA| = 2 sin(PM/2) = ${fx(mag, 3)}`; rd[2].textContent = `|Af|·β = ${fx(K, 3)}`;
    // closed loop of L(s) = ωu/(s(1+s/p2)) with that PM, ωu at the plot centre
    const p2 = 1 / Math.tan((90 - pm) / DEG);
    clc.setAttribute('points', ptsOf(200, -2, 1.5, (e) => { const w = 10 ** e; const re = 1 - w * w / p2, im = w; const m = 1 / Math.hypot(re, im); return [X0 + ((e + 2) / 3.5) * W, Y0 - 100 * Math.min(m, 3.2)]; }));
  }, E.lin);
  S.say(0.4, 'Why should a small margin matter if the loop does not oscillate? Your page answers it. At the crossover $|\\beta A| = 1$, so $|A| = 1/\\beta$ there.');
  S.say(6, 'So the closed-loop gain at the crossover is $1/\\beta$ divided by the size of $1 + \\beta A$, where $\\beta A$ is an arrow of length 1 pointing at $PM - 180°$.');
  S.say(12, 'Draw it. The white arrow is the 1. The amber arrow is $\\beta A$, length 1. Their sum, in green, is $1 + \\beta A$.');
  S.say(20, 'With a big margin the two arrows open wide and the green arrow is long: the closed-loop gain stays at or below $1/\\beta$. Now shrink the margin…');
  S.say(40, '…and the amber arrow folds back over the white one. They nearly cancel, the green arrow shrinks to almost nothing, and dividing by it makes the closed-loop gain shoot up: a <b>peak</b>.');
  eqAt(S, '|1 + \\beta A| = 2\\sin\\frac{PM}{2} \\;\\Rightarrow\\; |A_f(\\omega_{GX})| = \\frac{1}{\\beta}\\cdot\\frac{1}{2\\sin(PM/2)}', 1140, 380, 52, { size: 22, w: 760, color: C.ok });
  S.say(52, 'Two unit arrows with an angle PM between them: the gap is $2\\sin(PM/2)$. So the peak is $1/(2\\sin(PM/2))$ times $1/\\beta$. At 5°: about 11.5 times. That is your page’s number.');
});

scene(L16, 'Your page’s three numbers: 5°, 45°, 60°', 54, (S) => {
  header(S, 'LEC 16 · YOUR PAGE, THE CALCULATIONS', '5° → 11.5/β · 45° → 1.3/β · 60° → 1/β');
  pagePeek(S, 'n16b', 60, 140, 700, 650, 0.3, 30);
  const card = (x, pm, val, col, t0, note) => {
    const g = S.g();
    S.el('rect', { x, y: 170, width: 230, height: 300, rx: 18, fill: 'rgba(255,255,255,0.03)', stroke: col, 'stroke-width': 2.4 }, g);
    txt(S, x + 115, 220, `PM = ${pm}°`, { size: 26, color: col, weight: 800, anchor: 'middle' }, g);
    txt(S, x + 115, 300, val, { size: 44, color: '#fff', weight: 800, anchor: 'middle' }, g);
    txt(S, x + 115, 340, '× 1/β at ω_GX', { size: 18, color: C.muted, anchor: 'middle' }, g);
    txt(S, x + 115, 420, note, { size: 18, color: col, anchor: 'middle', weight: 700 }, g);
    g.style.opacity = 0; S.pop(g, t0); return g;
  };
  card(820, 5, fx(peakK(5), 3), C.bad, 4, 'nearly oscillating'); card(1060, 45, fx(peakK(45), 2), C.amb, 14, '30 % peak'); card(1300, 60, fx(peakK(60), 2), C.ok, 24, 'no peak');
  eqAt(S, '\\frac{1}{|1 + \\cos175^\\circ - j\\sin175^\\circ|} = \\frac{1}{|0.0038 - j0.087|} = 11.5', 1180, 540, 4, { size: 24, w: 740 });
  eqAt(S, '\\frac{1}{|1 + \\cos135^\\circ - j\\sin135^\\circ|} = \\frac{1}{|0.293 - j0.707|} = 1.31', 1180, 620, 14, { size: 24, w: 740 });
  eqAt(S, '\\frac{1}{|1 + \\cos120^\\circ - j\\sin120^\\circ|} = \\frac{1}{|0.5 - j0.866|} = 1', 1180, 700, 24, { size: 24, w: 740 });
  const c90 = txt(S, 1180, 790, 'and 90° → 1/(2 sin 45°) = 0.707: the ordinary −3 dB point (past tutorial Ex 4)', { size: 20, color: C.muted, anchor: 'middle' }); c90.style.opacity = 0; S.fade(c90, 34, 0.6);
  S.say(0.3, 'Your page does it the long way, with cos and sin. PM = 5° means $\\angle\\beta A = -175°$. Then $1 + \\cos175° - j\\sin175° = 0.0038 - j0.087$, whose size is 0.087: the gain is 11.5 over β.');
  S.say(14, 'PM = 45°: the angle is −135°, $1 + \\beta A = 0.293 - j0.707$, size 0.765: a gain of 1.3 over β, a 30 % peak.');
  S.say(24, 'PM = 60°: $0.5 - j0.866$ has size exactly 1. The gain at the crossover is exactly $1/\\beta$: no peak at all. That is why 60° is the favourite target.');
  S.say(34, 'And the shortcut does all of them in one go: $1/(2\\sin(PM/2))$. For 90° it gives 0.707, the ordinary 3 dB point of a single pole. Memorise 45 → 1.3 and 60 → 1.');
});

scene(L16, 'Peaking in frequency is ringing in time', 72, (S) => {
  header(S, 'LEC 16 · YOUR PAGE, BOTTOM', 'Small PM bounces like a car with worn shock absorbers');
  pagePeek(S, 'n16c', 960, 130, 580, 598, 0.3, 8);
  // step-response plot
  const X0 = 110, Y0 = 760, W = 760, H = 480, T = 14;
  const ax = axes(S, X0, Y0, W, H, { x: 'time', y: 'output step' }); ax.style.opacity = 0; S.fade(ax, 1, 0.6);
  const yOf = (v) => Y0 - 300 * v, xOf = (tt) => X0 + (tt / T) * W;
  const fin = S.el('line', { x1: X0, x2: X0 + W, y1: yOf(1), y2: yOf(1), stroke: '#3a4a60', 'stroke-dasharray': '5 6' }); fin.style.opacity = 0; S.fade(fin, 1, 0.5);
  const cases = [[15, C.bad, 2], [45, C.amb, 12], [60, C.ok, 22], [90, C.volt, 32]];
  // PM 90° is drawn at a lower bandwidth: getting 90° costs more compensation (Lec 17), so it really is slower
  const resp = (pm) => (pm >= 89.9 ? (tt) => 1 - Math.exp(-0.45 * tt) : stepPM(pm));
  cases.forEach(([pm, col, t0], k) => {
    tracePlot(S, resp(pm), xOf, yOf, t0, t0 + 6, col, T);
    const lg = S.g(); S.el('line', { x1: X0 + W - 210, x2: X0 + W - 176, y1: Y0 - H + 30 + 30 * k, y2: Y0 - H + 30 + 30 * k, stroke: col, 'stroke-width': 4 }, lg);
    txt(S, X0 + W - 166, Y0 - H + 37 + 30 * k, `PM ${pm}°${pm === 90 ? ' (more compensation)' : ''}`, { size: 18, color: col, weight: 800 }, lg);
    lg.style.opacity = 0; S.fade(lg, t0, 0.4);
  });
  // the car
  const car = S.g(); const rc = S.into(car);
  S.el('rect', { x: -70, y: -46, width: 140, height: 40, rx: 12, fill: '#2563eb', stroke: '#93c5fd', 'stroke-width': 2 });
  S.el('rect', { x: -40, y: -70, width: 80, height: 28, rx: 9, fill: '#1d4ed8', stroke: '#93c5fd', 'stroke-width': 2 });
  rc();
  const wh = [S.el('circle', { r: 15, fill: '#111827', stroke: '#9ca3af', 'stroke-width': 4 }), S.el('circle', { r: 15, fill: '#111827', stroke: '#9ca3af', 'stroke-width': 4 })];
  const spr = [S.el('polyline', { fill: 'none', stroke: '#cbd5e1', 'stroke-width': 2.4 }), S.el('polyline', { fill: 'none', stroke: '#cbd5e1', 'stroke-width': 2.4 })];
  const road = S.el('path', { d: 'M960 790 L1250 790 L1250 750 L1560 750', fill: 'none', stroke: '#64748b', 'stroke-width': 5 });
  const ctag = txt(S, 1260, 560, '', { size: 24, weight: 800, anchor: 'middle' });
  [car, ...wh, ...spr, road, ctag].forEach((e) => { e.style.opacity = 0; S.fade(e, 9, 0.6); });
  const cx = 1260;
  S.anim(0, 1e4, 'car', (_p, t) => {
    const c = t < 12 ? cases[0] : t < 22 ? cases[1] : t < 32 ? cases[2] : cases[3];
    const t0 = c[2] === 2 ? 9.5 : c[2]; const u = Math.max(0, t - t0) * 2.2;
    const lift = 40 * resp(c[0])(u); // wheels go up 40 px at the kerb; the body follows the step response
    const wy = 775 - (u > 0 ? 40 : 0);
    wh[0].setAttribute('cx', cx - 45); wh[1].setAttribute('cx', cx + 45); wh.forEach((w) => w.setAttribute('cy', wy));
    const by = 700 - lift;
    car.setAttribute('transform', `translate(${cx} ${by})`);
    [-45, 45].forEach((dx, i) => { const y1 = by - 6, y2 = wy - 15, n = 6; const pts = []; for (let j = 0; j <= n; j++) pts.push(`${cx + dx + (j % 2 ? 7 : -7) * (j > 0 && j < n ? 1 : 0)},${lerp(y1, y2, j / n)}`); spr[i].setAttribute('points', pts.join(' ')); });
    ctag.setAttribute('fill', c[1]); ctag.textContent = `PM = ${c[0]}°`;
  }, E.lin);
  S.say(0.3, 'Your page sketches what the peak looks like in time: the step response. Here are four phase margins, and a car going up a kerb to feel them.');
  S.say(9, 'PM = 15°: the output shoots past and rings for a long time, like a car with no shock absorbers bouncing on and on.');
  S.say(12, 'PM = 45°: one clear overshoot and a little ringing: the 30 % peak from the last scene, seen in time.');
  S.say(22, 'PM = 60°: up fast, a tiny overshoot, settled. That is the comfortable ride and the usual design target.');
  S.say(32, 'PM = 90°: no overshoot at all, but it creeps up slowly, like a car with stiff, over-damped suspension.');
  whyBox(S, 960, 120, 580, 190, '**Your page’s square wave:** the red trace (PM = 60°) reaches the top quickly and flat; the green one (PM = 90°) is smooth but never quite gets there before the input flips.', 44);
  S.say(44, 'That is exactly your page’s square-wave sketch: red, PM 60°, gets to the top fast; green, PM 90°, is smooth but slow. Peaking in frequency and ringing in time are the same fact.');
  S.say(56, 'One honest caveat from Razavi: phase margin is a small-signal idea. A big step also slews (Lecture 13), and that is a separate limit.');
});

scene(L16, 'The 1/β line: reading βA off the open-loop plot', 50, (S) => {
  header(S, 'LEC 16 · YOUR PAGE, LAST SKETCH', '20 log|A| − 20 log(1/β) = 20 log|βA|');
  const A0 = 1e5, poles = [1e3, 1e6, 1e7];
  const B = bodePair(S, { x: 120, w: 760, y: 140, hm: 330, hp: 230, d0: 1, d1: 8, db0: 110, db1: -30, ph1: -270, mtitle: '20 log|A| (open loop)' });
  B.g.style.opacity = 0; S.fade(B.g, 0.3, 0.6);
  const mc = S.el('polyline', { points: bodePts(B, (f) => dB(LG.mag(f, A0, poles)), B.fyM), fill: 'none', stroke: C.volt, 'stroke-width': 3.6 });
  const pc = S.el('polyline', { points: bodePts(B, (f) => LG.ph(f, poles), B.fyP), fill: 'none', stroke: C.amb, 'stroke-width': 3.4 });
  [mc, pc].forEach((e) => { e.style.opacity = 0; S.fade(e, 1, 0.6); });
  const bl = S.el('line', { x1: B.x0, x2: B.x0 + B.w, stroke: C.bad, 'stroke-width': 3 }), bt = txt(S, B.x0 + B.w - 6, 0, '', { size: 18, color: C.bad, weight: 700, anchor: 'end' });
  const gd = S.el('circle', { r: 9, fill: C.ok }), dl = S.el('line', { stroke: C.ok, 'stroke-width': 2, 'stroke-dasharray': '6 5' }), pmb = S.el('line', { stroke: C.ok, 'stroke-width': 7 });
  const gapA = dynArrow(S, C.n, 3);
  const rd = [txt(S, 940, 220, '', { size: 22, color: C.bad, mono: true, weight: 700 }), txt(S, 940, 258, '', { size: 21, color: C.ok, mono: true }), txt(S, 940, 296, '', { size: 26, color: C.ok, mono: true, weight: 800 })];
  [bl, bt, gd, dl, pmb, gapA, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 6, 0.6); });
  const gAt = (t) => (t < 16 ? 80 : t < 28 ? lerp(80, 20, E.inout((t - 16) / 12)) : t < 34 ? 20 : t < 40 ? lerp(20, 0, E.inout((t - 34) / 6)) : 0);
  S.anim(0, 1e4, 'line', (_p, t) => {
    const g = gAt(t), beta = 10 ** (-g / 20), y = B.fyM(g);
    bl.setAttribute('y1', y); bl.setAttribute('y2', y); bt.setAttribute('y', y - 10); bt.textContent = ''; richText(bt, `20 log(1/β) = ${fx(g, 3)} dB`, 18);
    const gx = LG.gx(beta * A0, poles), x = B.fxp(gx), ph = LG.ph(gx, poles);
    gd.setAttribute('cx', x); gd.setAttribute('cy', y);
    dl.setAttribute('x1', x); dl.setAttribute('x2', x); dl.setAttribute('y1', y); dl.setAttribute('y2', B.fyP(ph));
    pmb.setAttribute('x1', x); pmb.setAttribute('x2', x); pmb.setAttribute('y1', B.fyP(Math.max(ph, -270))); pmb.setAttribute('y2', B.fyP(-180)); pmb.setAttribute('stroke', ph > -180 ? C.ok : C.bad);
    gapA.set(B.fxp(30), y, B.fxp(30), B.fyM(100) + 2, 12);
    rd[0].textContent = `closed-loop gain 1/β = ${fx(1 / beta, 3)}`; rd[1].textContent = `|A| meets the line at ${fmtHz(gx)}`;
    rd[2].textContent = `PM = ${fx(180 + ph, 3)}°`; rd[2].setAttribute('fill', ph > -180 ? C.ok : C.bad);
  }, E.lin);
  S.say(0.3, 'The last sketch on your page is a shortcut you will use in Lecture 17. You usually get the open-loop plot $|A|$, not the loop gain.');
  S.say(6, 'In dB, $20\\log|\\beta A| = 20\\log|A| - 20\\log(1/\\beta)$. So draw a horizontal line at $20\\log(1/\\beta)$, the closed-loop gain in dB. The gap between $|A|$ and the line is the loop gain.');
  S.say(16, 'Where $|A|$ meets the line, the loop gain is 0 dB: that is $\\omega_{GX}$. Lower the line, a smaller closed-loop gain, and the meeting point moves right, into worse phase.');
  S.say(34, 'At a closed-loop gain of 1 this three-pole amplifier meets the line where the phase is already past −180°: the buffer oscillates. Lecture 17 fixes exactly this.');
});

scene(L16, 'Lecture 16 in one card', 28, (S) => {
  header(S, 'LEC 16 · REMEMBER', 'Everything from Lecture 16');
  remember(S, [
    'Reading PM: slide to 0 dB on the gain plot ($\\omega_{GX}$), drop to the phase plot, gap to −180°.',
    'At $\\omega_{GX}$: $|A| = 1/\\beta$ and $|A_f| = \\frac{1}{\\beta}\\cdot\\frac{1}{|1 + 1\\angle(PM - 180°)|} = \\frac{1}{\\beta}\\cdot\\frac{1}{2\\sin(PM/2)}$.',
    '5° → 11.5/β (your page: $|0.0038 - j0.087|$) · 45° → 1.3/β · 60° → exactly 1/β · 90° → 0.707/β.',
    'Peaking in frequency = ringing in time. 60°: fast, tiny overshoot (the target). 90°: no overshoot, slow.',
    'Open-loop plot: line at $20\\log(1/\\beta)$; where $|A|$ meets it is $\\omega_{GX}$.',
    'Backwards: PM from a peak K: $PM = 2\\sin^{-1}\\frac{1}{2K}$ (50 % → 38.9°).',
  ], 0.4, 'Lecture 16 · remember');
  S.say(0.4, 'Read it once. Now the Lecture 16 questions.');
});

scene(L16, 'Your Lec 16 example: 5°, 45°, 60°', 44, (S) => {
  pyqFrame(S, {
    tag: 'LEC 16 · QUESTION 1 OF 3', title: 'The closed-loop gain at ωGX', src: 'Lecture notes Lec 16',
    q: 'Using $|\\beta A(\\omega_{GX})| = 1$, find $|A_f(\\omega_{GX})|$ as a multiple of $1/\\beta$ for PM = 5°, 45° and 60°.', qh: 170,
    tests: 'writing βA as $\\cos\\theta + j\\sin\\theta$ at the crossover, and the size of $1 + \\beta A$.',
    fig: eqFig([['\\beta A(\\omega_{GX}) = 1\\angle(PM - 180^\\circ)', 300, 32], ['|A_f|\\,\\beta = \\frac{1}{|1 + \\cos\\theta + j\\sin\\theta|}', 430, 32, '#ffd38a']]),
    steps: [
      { t: 6, title: '**PM = 5°:** the loop gain is a unit arrow at θ = −175°, almost pointing back at −1. Add 1 and take the size: nearly zero, so a huge peak.', tex: '|1 + \\beta A| = |1 + \\cos175^\\circ - j\\sin175^\\circ| = |0.0038 - j0.0872| = 0.0873,\\quad |A_f|\\,\\beta = \\frac{1}{0.0873} = 11.5',
        try: {
          q: 'PM = 5°: what is $|A_f(\\omega_{GX})|$ as a multiple of $1/\\beta$?',
          hint: ['At the crossover βA is an arrow of length 1 at angle θ = PM − 180°. Write $1 + \\beta A$ in real and imaginary parts, then take its size.', '$|A_f|\\,\\beta = \\frac{1}{|1 + \\cos\\theta + j\\sin\\theta|}$ with θ = −175°.'],
          how: [
            'At $\\omega_{GX}$, $|A| = 1/\\beta$, so $|A_f| = \\frac{|A|}{|1+\\beta A|} = \\frac{1}{\\beta}\\cdot\\frac{1}{|1+\\beta A|}$. The loop gain is a unit arrow at $\\theta = PM - 180^\\circ$. $$\\theta = 5^\\circ - 180^\\circ = -175^\\circ$$',
            'Write $1 + \\beta A$ in parts. $$1 + \\cos(-175^\\circ) + j\\sin(-175^\\circ) = 1 - 0.9962 - j0.0872 = 0.0038 - j0.0872$$',
            'Its size (Pythagoras). $$|1 + \\beta A| = \\sqrt{0.0038^2 + 0.0872^2} = 0.0873$$',
            'Divide. $$|A_f|\\,\\beta = \\frac{1}{0.0873} = 11.5$$',
          ],
          why: 'Shortcut: $\\frac{1}{2\\sin(PM/2)} = \\frac{1}{2\\sin2.5^\\circ} = 11.5$.',
          calc: [{ what: 'Size of 1 + βA in one line (degree mode)', keys: '1 ÷ √( ( 1 + cos( 175 ) ) [x²] + sin( 175 ) [x²] )', shows: '11.46' }],
          parts: [
            { q: 'PM = 5°: what is $|1 + \\beta A|$ at the crossover?', answer: 2 * Math.sin(2.5 * Math.PI / 180), unit: '', tol: 0.01,
              hint: ['θ = PM − 180° = −175°. Size of $1 + \\cos\\theta + j\\sin\\theta$.'],
              how: ['$$|0.0038 - j0.0872| = \\sqrt{0.0038^2 + 0.0872^2} = 0.0873$$'] },
          ],
          answer: ans('bank-lec16', 'a'), unit: '×', tol: 0.02,
        }, say: '$1/0.0873 = 11.5$.' },
      { t: 14, title: '**PM = 45°:** θ = −135°. The arrows open wider, $1 + \\beta A$ is longer, and the peak is much smaller.', tex: '|1 + \\cos135^\\circ - j\\sin135^\\circ| = |0.293 - j0.707| = 0.765,\\quad |A_f|\\,\\beta = \\frac{1}{0.765} = 1.31',
        try: {
          q: 'PM = 45°: what is $|A_f(\\omega_{GX})|$ as a multiple of $1/\\beta$?',
          hint: ['Same recipe: θ = PM − 180°, then the size of $1 + \\cos\\theta + j\\sin\\theta$.', 'θ = −135°: $\\cos135^\\circ = -0.707$, $\\sin135^\\circ = 0.707$.'],
          how: [
            'The loop gain’s angle at the crossover. $$\\theta = 45^\\circ - 180^\\circ = -135^\\circ$$',
            'Write $1 + \\beta A$ in parts. $$1 + \\cos(-135^\\circ) + j\\sin(-135^\\circ) = 1 - 0.707 - j0.707 = 0.293 - j0.707$$',
            'Its size. $$\\sqrt{0.293^2 + 0.707^2} = 0.765$$',
            'Divide. $$|A_f|\\,\\beta = \\frac{1}{0.765} = 1.31$$',
          ],
          why: '45° → about a 30 % peak.',
          parts: [
            { q: 'PM = 45°: what is $|1 + \\beta A|$ at the crossover?', answer: 2 * Math.sin(22.5 * Math.PI / 180), unit: '', tol: 0.01,
              hint: ['θ = −135°: $1 + \\cos\\theta = 0.293$, $\\sin\\theta = -0.707$.'],
              how: ['$$|0.293 - j0.707| = \\sqrt{0.293^2 + 0.707^2} = 0.765$$'] },
          ],
          answer: ans('bank-lec16', 'b'), unit: '×', tol: 0.02,
        }, say: '$1/0.765 = 1.31$.' },
      { t: 21, title: '**PM = 60°:** θ = −120°. Now $1 + \\beta A$ has size exactly 1: the gain at the crossover is exactly $1/\\beta$, no peak.', tex: '|1 + \\cos120^\\circ - j\\sin120^\\circ| = |0.5 - j0.866| = \\sqrt{0.25 + 0.75} = 1,\\quad |A_f|\\,\\beta = 1',
        try: {
          q: 'PM = 60°: what is $|A_f(\\omega_{GX})|$ as a multiple of $1/\\beta$?',
          hint: ['Same recipe with θ = −120°.', '$\\cos120^\\circ = -0.5$, $\\sin120^\\circ = 0.866$.'],
          how: [
            'The loop gain’s angle at the crossover. $$\\theta = 60^\\circ - 180^\\circ = -120^\\circ$$',
            'Write $1 + \\beta A$ in parts. $$1 + \\cos(-120^\\circ) + j\\sin(-120^\\circ) = 1 - 0.5 - j0.866 = 0.5 - j0.866$$',
            'Its size: $0.5^2 + 0.866^2 = 0.25 + 0.75 = 1$. $$|1 + \\beta A| = 1 \\Rightarrow |A_f|\\,\\beta = 1$$',
          ],
          why: '60° gives exactly $1/\\beta$ at the crossover: no peak. That is why 60° is the usual target.',
          answer: ans('bank-lec16', 'c'), unit: '×', tol: 0.01,
        }, say: 'Exactly 1.' },
      { t: 28, ans: true, title: '**Answers:** PM 5° → 11.5 · 45° → 1.31 · 60° → 1 (times $1/\\beta$). Shortcut: $1/(2\\sin(PM/2))$', say: 'In the exam use the shortcut, but know where it comes from.' },
    ],
  });
}, { q: 'Lec 16 example' });

scene(L16, 'Past tutorial Ex 4: 30°, 60°, 90°', 40, (S) => {
  pyqFrame(S, {
    tag: 'LEC 16 · QUESTION 2 OF 3', title: 'Closed-loop gain at ω1 for three margins', src: 'Past tutorial 2024-25 T2 Ex 4',
    q: 'Find the closed-loop gain at $\\omega_1$ (where $|A\\beta| = 1$) relative to the low-frequency gain, for phase margins of 30°, 60° and 90°.', qh: 170,
    tests: 'the peak formula, including the 90° case that gives the usual −3 dB.',
    fig: eqFig([['A\\beta(\\omega_1) = 1\\angle(PM - 180^\\circ),\\quad \\text{low-frequency gain} \\approx 1/\\beta', 380, 28, '#ffd38a']]),
    steps: [
      { t: 6, title: '**PM = 30°.** At $\\omega_1$ the two unit arrows (1 and $A\\beta$) have angle PM between them, so $|1 + A\\beta| = 2\\sin(PM/2)$ and the gain ratio is its inverse.', tex: 'K = \\frac{1}{2\\sin(PM/2)} = \\frac{1}{2\\sin15^\\circ} = \\frac{1}{2\\times0.259} = 1.93',
        try: {
          q: 'PM = 30°: the closed-loop gain at $\\omega_1$ is how many times the low-frequency gain?',
          hint: ['At $\\omega_1$, $|A| = 1/\\beta$ and $A\\beta$ is a unit arrow at PM − 180°. The ratio is $1/|1 + A\\beta|$.', 'Two unit arrows with angle PM between them: $|1 + A\\beta| = 2\\sin(PM/2)$, so $K = \\frac{1}{2\\sin(PM/2)}$.'],
          how: [
            'At $\\omega_1$: $|A| = 1/\\beta$ (the low-frequency closed-loop gain), so the ratio is set by $|1 + A\\beta|$ alone. $$K = \\frac{|A_f(\\omega_1)|}{1/\\beta} = \\frac{1}{|1 + A\\beta|}$$',
            '$A\\beta$ is a unit arrow at PM − 180°; adding 1 gives $2\\sin(PM/2)$. $$|1 + A\\beta| = 2\\sin\\frac{PM}{2} = 2\\sin15^\\circ = 0.518$$',
            'Invert. $$K = \\frac{1}{0.518} = 1.93$$',
          ],
          why: 'Small margin, big peak: 30° nearly doubles the gain at $\\omega_1$.',
          calc: [{ what: 'Peak factor (degree mode)', keys: '1 ÷ ( 2 sin( 30 ÷ 2 ) )', shows: '1.932', note: 'Edit 30 to 60 or 90 with ◀ and [EXE] again for the other parts.' }],
          parts: [
            { q: 'PM = 30°: what is $|1 + A\\beta|$ at $\\omega_1$?', answer: 2 * Math.sin(15 * Math.PI / 180), unit: '', tol: 0.01,
              hint: ['Two unit arrows with angle PM between them: $|1 + A\\beta| = 2\\sin(PM/2)$.'],
              how: ['$$2\\sin15^\\circ = 2\\times0.259 = 0.518$$'] },
          ],
          answer: ans('pyq-t24-ex4', 'k30'), unit: '×', tol: 0.01,
        }, say: '1.93: almost double the gain at the crossover.' },
      { t: 13, title: '**PM = 60°:** $\\sin30^\\circ = 0.5$, so $|1 + A\\beta| = 1$ exactly: no peak.', tex: 'K = \\frac{1}{2\\sin30^\\circ} = \\frac{1}{2\\times0.5} = 1',
        try: {
          q: 'PM = 60°: the closed-loop gain at $\\omega_1$ is how many times the low-frequency gain?',
          hint: ['Same formula as for 30°.', '$K = \\frac{1}{2\\sin(PM/2)}$ with PM/2 = 30°.'],
          how: [
            'Use the peak formula. $$K = \\frac{1}{2\\sin(PM/2)} = \\frac{1}{2\\sin30^\\circ}$$',
            '$\\sin30^\\circ = 0.5$. $$K = \\frac{1}{2\\times0.5} = 1$$',
          ],
          why: '60°: flat at $\\omega_1$ — the usual design target.',
          answer: ans('pyq-t24-ex4', 'k60'), unit: '×', tol: 0.01,
        }, say: 'Exactly 1.' },
      { t: 19, title: '**PM = 90°:** $\\sin45^\\circ = 0.707$, so K = 0.707: the ordinary −3 dB point of a one-pole response.', tex: 'K = \\frac{1}{2\\sin45^\\circ} = \\frac{1}{2\\times0.707} = 0.707\\;(-3\\,\\mathrm{dB})',
        try: {
          q: 'PM = 90°: the closed-loop gain at $\\omega_1$ is how many times the low-frequency gain?',
          hint: ['Same formula again.', '$K = \\frac{1}{2\\sin(PM/2)}$ with PM/2 = 45°.'],
          how: [
            'Use the peak formula. $$K = \\frac{1}{2\\sin45^\\circ}$$',
            '$\\sin45^\\circ = 0.707$. $$K = \\frac{1}{2\\times0.707} = 0.707$$',
            'That is $20\\log0.707 = -3$ dB: a one-pole loop is 3 dB down at the crossover, no peak at all.',
          ],
          why: 'Remember the ladder: 30° → 1.93, 45° → 1.31, 60° → 1, 90° → 0.707.',
          answer: ans('pyq-t24-ex4', 'k90'), unit: '×', tol: 0.01,
        }, say: '0.707: the −3 dB point of a one-pole response.' },
      { t: 25, ans: true, title: '**Answers:** PM 30° → 1.93 · 60° → 1 · 90° → 0.707 (times the low-frequency gain)', say: 'Three margins, three shapes: peaking, flat, rolled off.' },
    ],
  });
}, { q: 'Past tutorial Ex 4' });

scene(L16, 'Razavi 10.4: what PM gives a 50 % peak?', 34, (S) => {
  pyqFrame(S, {
    tag: 'LEC 16 · QUESTION 3 OF 3', title: 'Read the margin from the peak', src: 'Razavi Problem 10.4',
    q: 'A unity-gain feedback amplifier peaks by 50 % near the gain crossover. What is its phase margin?', qh: 150,
    tests: 'the peak formula backwards (it is also part (b) of the 2025 mid-sem Q5).',
    fig: eqFig([['\\frac{|A_f(\\omega_{GX})|}{1/\\beta} = \\frac{1}{2\\sin(PM/2)}', 380, 34, '#ffd38a']]),
    steps: [
      { t: 6, title: '**Set the peak to 1.5 and solve backwards.** A 50 % peak means the gain at the crossover is 1.5 times the low-frequency gain.', tex: '\\frac{1}{2\\sin(PM/2)} = 1.5 \\Rightarrow \\sin\\frac{PM}{2} = \\frac{1}{3} \\Rightarrow PM = 2\\sin^{-1}\\frac13 = 2\\times19.47^\\circ = 38.9^\\circ',
        try: {
          q: 'What phase margin gives a 50 % peak at the gain crossover?',
          hint: ['A 50 % peak means the closed-loop gain there is 1.5 times its low-frequency value. Use Lecture 16’s peak formula backwards.', '$\\frac{1}{2\\sin(PM/2)} = 1.5$. Solve for $\\sin(PM/2)$, then use $\\sin^{-1}$.'],
          how: [
            'At the crossover, $|A_f|$ relative to its low-frequency value $1/\\beta$ is $1/(2\\sin(PM/2))$. Set it to 1.5. $$\\frac{1}{2\\sin(PM/2)} = 1.5$$',
            'Rearrange. $$\\sin\\frac{PM}{2} = \\frac{1}{2\\times1.5} = \\frac13$$',
            'Inverse sine (degree mode), then double. $$PM = 2\\sin^{-1}\\frac13 = 2\\times19.47^\\circ = 38.9^\\circ$$',
          ],
          why: 'Sanity check: 45° gives 1.3×, so a bigger 1.5× peak must have less than 45°.',
          calc: [{ what: 'PM from the peak (degree mode)', keys: '2 [SHIFT] [sin] ( 1 ÷ ( 2 × 1.5 ) )', shows: '38.94' }],
          parts: [
            { q: 'A 50 % peak: what is $\\sin(PM/2)$?', answer: 1 / 3, unit: '', tol: 0.01,
              hint: ['$\\frac{1}{2\\sin(PM/2)} = 1.5$.'],
              how: ['$$\\sin\\frac{PM}{2} = \\frac{1}{2\\times1.5} = 0.333$$'] },
          ],
          answer: ans('bank-r10-4', 'pm'), unit: '°', tol: 0.01,
        }, say: '$2\\times19.47° = 38.9°$.' },
      { t: 14, title: '**Check against the numbers you know:** 45° gives 1.3×, 60° gives 1×. A larger 1.5× peak must mean a smaller margin, below 45°. ✓', tex: '45^\\circ \\to 1.3,\\; 60^\\circ \\to 1 \\;\\Rightarrow\\; 1.5 \\text{ must be below } 45^\\circ' },
      { t: 20, ans: true, title: '**Answer:** PM ≈ 38.9°', say: 'A sanity check you can always do: more peak, less margin.' },
    ],
  });
}, { q: 'Razavi 10.4' });
