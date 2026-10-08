/* Lesson D, Lecture 15: the loop gain on a Bode plot, gain and phase crossover, phase and gain margin, one and two poles. */
'use strict';
const L15 = 'Lec 15 · Margins on the Bode plot';
const atD15 = (x) => Math.atan(x) * 180 / Math.PI; // degrees
/* PS2 P2: with u = f/fp2 far above fp1, u²(1 + u²) = k² where k = βA0·fp1/fp2 */
const u2PS2 = (k) => (-1 + Math.sqrt(1 + 4 * k * k)) / 2;

scene(L15, 'Where Lec 14 left you: the walk to the cliff', 58, (S) => {
  header(S, 'LEC 14 → 15 · THE PICTURE FOR ALL THREE LECTURES', 'Run out of gain before you run out of phase');
  const x0 = 170, xc = 1170, yg = 560, PH = (deg) => x0 + (Math.min(180, -deg) / 180) * (xc - x0);
  // ground and cliff
  const land = S.g();
  S.el('path', { d: `M60 ${yg} L${xc} ${yg} L${xc} 860 L60 860 Z`, fill: '#162131', stroke: '#2c3a4f', 'stroke-width': 2 }, land);
  S.el('path', { d: `M${xc} ${yg} L${xc + 8} ${yg + 40} L${xc - 4} ${yg + 90} L${xc + 10} ${yg + 150} L${xc} 860`, fill: 'none', stroke: '#3b4a60', 'stroke-width': 3 }, land);
  [0, -45, -90, -135, -180].forEach((d) => { S.el('line', { x1: PH(d), y1: yg + 6, x2: PH(d), y2: yg + 22, stroke: C.muted, 'stroke-width': 2 }, land); txt(S, PH(d), yg + 48, d + '°', { size: 19, color: d === -180 ? C.bad : C.muted, anchor: 'middle', weight: d === -180 ? 800 : 500 }, land); });
  txt(S, xc + 26, yg - 20, 'cliff: −180°', { size: 22, color: C.bad, weight: 800 }, land);
  txt(S, xc + 26, yg + 8, '(Barkhausen)', { size: 18, color: C.bad }, land);
  txt(S, 90, yg + 90, 'distance walked = the phase lag of βA', { size: 20, color: C.muted }, land);
  land.style.opacity = 0; S.fade(land, 0.4, 0.8);
  // walker + energy bar
  const hk = S.g(); const rh = S.into(hk);
  S.el('circle', { cx: 0, cy: -78, r: 13, fill: '#e9eef5' });
  S.el('line', { x1: 0, y1: -64, x2: 0, y2: -30, stroke: '#e9eef5', 'stroke-width': 5, 'stroke-linecap': 'round' });
  const legA = S.el('line', { x1: 0, y1: -30, x2: -12, y2: 0, stroke: '#e9eef5', 'stroke-width': 5, 'stroke-linecap': 'round' });
  const legB = S.el('line', { x1: 0, y1: -30, x2: 12, y2: 0, stroke: '#e9eef5', 'stroke-width': 5, 'stroke-linecap': 'round' });
  S.el('line', { x1: 0, y1: -54, x2: 16, y2: -40, stroke: '#e9eef5', 'stroke-width': 5, 'stroke-linecap': 'round' });
  rh();
  const ebg = S.el('rect', { height: 16, rx: 5, fill: '#1c2532', stroke: '#33425a' }); const ebar = S.el('rect', { height: 16, rx: 5 });
  const etx = txt(S, 0, 0, '', { size: 18, weight: 700, mono: true });
  const rd = [txt(S, 1000, 200, '', { size: 21, color: C.text, mono: true, weight: 700 }), txt(S, 1000, 234, '', { size: 20, color: C.amb, mono: true }), txt(S, 1000, 268, '', { size: 20, color: C.p, mono: true })];
  const pmB = S.g(); const pmL = S.el('line', { stroke: C.ok, 'stroke-width': 4 }, pmB); const pmT = txt(S, 0, 0, '', { size: 24, color: C.ok, weight: 800, anchor: 'middle' }, pmB);
  [hk, ebg, ebar, etx, ...rd, pmB].forEach((e) => { e.style.opacity = 0; });
  [hk, ebg, ebar, etx, ...rd].forEach((e) => S.fade(e, 7, 0.5));
  const sc = (t) => (t < 26 ? { k: 100, poles: [1, 100], t0: 8, t1: 22 } : { k: 1000, poles: [1, 10, 30], t0: 28, t1: 41 });
  S.anim(0, 1e4, 'walk', (_p, t) => {
    const s = sc(t); const gx = LG.gx(s.k, s.poles);
    const e = lerp(-1.5, 2.6, clamp((t - s.t0) / (s.t1 - s.t0), 0, 1)), f = 10 ** e;
    const pxf = LG.px(s.poles), fStop = Math.min(f, gx, pxf);
    const ph = LG.ph(fStop, s.poles), m = LG.mag(fStop, s.k, s.poles), mdb = dB(m);
    let x = PH(ph), y = yg, rot = 0;
    const over = ph <= -179.9 && m > 1.001;
    if (over) { const u = clamp((t - (s.t1 - 2.5)) / 2.5, 0, 1); x = xc + 40 * u; y = yg + 200 * u * u; rot = 100 * u; }
    const step = Math.sin(t * 9) * (f < gx && ph > -179 && t > s.t0 && t < s.t1 ? 1 : 0);
    legA.setAttribute('x2', -12 * step); legB.setAttribute('x2', 12 * step);
    hk.setAttribute('transform', `translate(${x} ${y}) rotate(${rot})`);
    const bw = clamp(mdb, 0, 60) * 4;
    ebg.setAttribute('x', x - 60); ebg.setAttribute('y', y - 130); ebg.setAttribute('width', 240);
    ebar.setAttribute('x', x - 60); ebar.setAttribute('y', y - 130); ebar.setAttribute('width', bw); ebar.setAttribute('fill', mdb > 10 ? C.ok : mdb > 0.05 ? C.amb : '#3a4656');
    etx.setAttribute('x', x - 60); etx.setAttribute('y', y - 142); etx.textContent = ''; richText(etx, `energy |βA| = ${mdb > 0.05 ? fx(mdb, 3) : 0} dB`, 18); etx.setAttribute('fill', mdb > 0.05 ? C.text : C.muted);
    rd[0].textContent = s.poles.length === 2 ? 'loop 1: βA0 = 100, two poles' : 'loop 2: βA0 = 1000, three poles';
    rd[1].textContent = `phase  ${fx(ph, 3)}°`; rd[2].textContent = over ? `${fx(mdb, 3)} dB of gain left at −180°: oscillates` : f >= gx ? `gain ran out at ${fx(-ph, 3)}° of lag` : 'walking…';
    [ebg, ebar, etx].forEach((e) => { e.style.visibility = over ? 'hidden' : 'visible'; });
    const showPM = s.poles.length === 2 && f >= gx;
    pmB.style.opacity = showPM && t < 26 ? 1 : 0;
    pmL.setAttribute('x1', x + 20); pmL.setAttribute('x2', xc); pmL.setAttribute('y1', yg - 30); pmL.setAttribute('y2', yg - 30);
    pmT.setAttribute('x', (x + xc) / 2); pmT.setAttribute('y', yg - 44); pmT.textContent = `phase margin = ${fx(180 + ph, 3)}°`;
  }, E.lin);
  S.say(0.3, 'Lecture 14 ended at a cliff. If the signal going once round the loop comes back turned by 180 degrees and still at full size, it feeds itself: the amplifier oscillates.');
  S.say(7, 'Picture it as a walk. As the frequency rises, two things happen to the loop gain $\\beta A$. Its size shrinks: that is the walker’s energy, in dB. Its phase lag grows: that is how far the walker has gone towards the cliff edge at −180°.');
  S.say(16, 'This first loop runs out of energy first. The walker stops with ground to spare. That spare distance, in degrees, is the <b>phase margin</b>.');
  S.say(27, 'Now a loop with more gain and three poles. The phase reaches −180° while the energy is still above 0 dB: over the edge. This one oscillates.');
  whyBox(S, 120, 130, 760, 150, '**The whole of Lectures 15–17 in one line:** run out of gain before you run out of phase. The Bode plot of $\\beta A$ is the map of this walk.', 43);
  S.say(43, 'So Lectures 15 to 17 in one sentence: run out of gain before you run out of phase. The Bode plot of the loop gain is the map of this walk; let us draw it.');
});

scene(L15, 'Your page: one pole on the Bode plot', 58, (S) => {
  header(S, 'LEC 15 · YOUR PAGE, TOP RIGHT', 'Each pole is an arrow: a size and an angle');
  pagePeek(S, 'n15a', 900, 130, 640, 425, 0.3, 8);
  const B = bodePair(S, { x: 120, w: 640, y: 140, hm: 250, hp: 200, d0: 3, d1: 7, db0: 50, db1: -10, ph1: -90, mtitle: '20 log|A|' });
  B.g.style.opacity = 0; S.fade(B.g, 8, 0.7);
  const fp = 1e5, A0 = 100;
  const mc = S.el('polyline', { points: bodePts(B, (f) => dB(LG.mag(f, A0, [fp])), B.fyM), fill: 'none', stroke: C.volt, 'stroke-width': 3.4 });
  const pc = S.el('polyline', { points: bodePts(B, (f) => LG.ph(f, [fp]), B.fyP), fill: 'none', stroke: C.amb, 'stroke-width': 3.4 });
  [mc, pc].forEach((e) => { e.style.opacity = 0; S.fade(e, 9, 0.6); });
  // cursor
  const cur = S.el('line', { stroke: '#fff', 'stroke-width': 1.6, 'stroke-dasharray': '5 5' });
  const dm = S.el('circle', { r: 7, fill: C.volt }), dp = S.el('circle', { r: 7, fill: C.amb });
  // phasor panel
  const ox = 950, oy = 560, U = 130;
  const ph = S.g();
  S.el('line', { x1: ox - 40, y1: oy, x2: ox + 520, y2: oy, stroke: C.muted, 'stroke-width': 1.6 }, ph);
  S.el('line', { x1: ox, y1: oy + 40, x2: ox, y2: oy - 360, stroke: C.muted, 'stroke-width': 1.6 }, ph);
  txt(S, ox + 510, oy + 28, 'real', { size: 17, color: C.muted, anchor: 'end' }, ph); txt(S, ox + 10, oy - 344, 'j', { size: 19, color: C.muted, weight: 700 }, ph);
  txt(S, ox - 20, 170, 'the pole factor  1 + jω/ω_p', { size: 21, color: C.text, weight: 700 }, ph);
  const a1 = dynArrow(S, '#e9eef5', 4, ph), a2 = dynArrow(S, C.p, 4, ph), a3 = dynArrow(S, C.amb, 5, ph);
  const arc = S.el('path', { fill: 'none', stroke: C.amb, 'stroke-width': 2.4 }, ph);
  const prd = [txt(S, ox + 20, oy + 60, '', { size: 20, color: C.text, mono: true, weight: 700 }, ph), txt(S, ox + 20, oy + 92, '', { size: 20, color: C.volt, mono: true }, ph), txt(S, ox + 20, oy + 124, '', { size: 20, color: C.amb, mono: true }, ph)];
  [ph, cur, dm, dp].forEach((e) => { e.style.opacity = 0; S.fade(e, 9, 0.6); });
  const eAt = (t) => (t < 12 ? 3.3 : t < 15 ? lerp(3.3, 4, E.inout((t - 12) / 3)) : t < 21 ? 4 : t < 24 ? lerp(4, 5, E.inout((t - 21) / 3)) : t < 30 ? 5 : t < 33 ? lerp(5, 6, E.inout((t - 30) / 3)) : t < 38 ? 6 : lerp(6, 6.8, clamp((t - 38) / 4, 0, 1)));
  S.anim(0, 1e4, 'cur', (_p, t) => {
    const f = 10 ** eAt(t), r = f / fp, x = B.fxp(f);
    cur.setAttribute('x1', x); cur.setAttribute('x2', x); cur.setAttribute('y1', B.y0); cur.setAttribute('y2', B.yP + B.hp);
    dm.setAttribute('cx', x); dm.setAttribute('cy', B.fyM(dB(LG.mag(f, A0, [fp])))); dp.setAttribute('cx', x); dp.setAttribute('cy', B.fyP(LG.ph(f, [fp])));
    const h = Math.min(r, 2.6) * U;
    a1.set(ox, oy, ox + U, oy); a2.set(ox + U, oy, ox + U, oy - h); a3.set(ox, oy, ox + U, oy - h);
    const th = Math.atan(r), R = 70;
    arc.setAttribute('d', `M${ox + R} ${oy} A${R} ${R} 0 0 0 ${ox + R * Math.cos(Math.atan2(h, U))} ${oy - R * Math.sin(Math.atan2(h, U))}`);
    prd[0].textContent = `f = ${fmtHz(f)}  (ω/ωp = ${fx(r, 3)})`;
    prd[1].textContent = `size ÷ ${fx(Math.hypot(1, r), 3)}  →  ${fx(dB(LG.mag(f, A0, [fp])), 3)} dB`;
    prd[2].textContent = `angle ${fx(th * DEG, 3)}°  →  phase −${fx(th * DEG, 3)}°`;
  }, E.lin);
  S.say(0.3, 'Your page starts with the two-pole $A(s)$ and the tool to read it: every pole factor has a size and an angle. Start with one pole.');
  S.say(8, 'One pole at 100 kHz and a gain of 100, that is 40 dB. Put $s = j\\omega$: the factor $1 + j\\omega/\\omega_p$ is an arrow, 1 to the right and $\\omega/\\omega_p$ upwards.');
  S.say(15, 'At a tenth of the pole the upward part is only 0.1: the arrow barely tilts, about 6 degrees. The gain is still flat.');
  S.say(22, 'At the pole the arrow sits at 45°, with length $\\sqrt2$: the gain is 3 dB down and the phase is −45°. Your page marks exactly this point.');
  S.say(31, 'Ten times higher the arrow is nearly vertical: 84 degrees of lag, and the gain is now falling 20 dB per decade.');
  whyBox(S, 120, 690, 640, 140, '**Phase is eaten early:** the phase starts moving a decade **before** the pole and finishes a decade after, but the gain only bends **at** the pole.', 39);
  S.say(39, 'Keep this shape: the phase starts moving a decade before the pole and finishes a decade after, but the gain only bends at the pole. Phase is eaten early, and that is the root of every stability problem.');
});

scene(L15, 'Two poles: sizes multiply, angles add', 58, (S) => {
  header(S, 'LEC 15 · YOUR PAGE, TOP', 'Two arrows: sizes multiply (dB add), angles add');
  const p1 = 1e4, p2 = 1e6, A0 = 1000;
  const B = bodePair(S, { x: 120, w: 700, y: 140, hm: 270, hp: 250, d0: 2, d1: 8, db0: 70, db1: -50, ph1: -180, mtitle: '20 log|A|' });
  B.g.style.opacity = 0; S.fade(B.g, 0.3, 0.7);
  const mc = S.el('polyline', { points: bodePts(B, (f) => dB(LG.mag(f, A0, [p1, p2])), B.fyM), fill: 'none', stroke: C.volt, 'stroke-width': 3.6 });
  const q1 = S.el('polyline', { points: bodePts(B, (f) => LG.ph(f, [p1]), B.fyP), fill: 'none', stroke: C.p, 'stroke-width': 2.6, 'stroke-dasharray': '8 6' });
  const q2 = S.el('polyline', { points: bodePts(B, (f) => LG.ph(f, [p2]), B.fyP), fill: 'none', stroke: C.n, 'stroke-width': 2.6, 'stroke-dasharray': '8 6' });
  const pt = S.el('polyline', { points: bodePts(B, (f) => LG.ph(f, [p1, p2]), B.fyP), fill: 'none', stroke: C.amb, 'stroke-width': 3.8 });
  [mc, q1, q2, pt].forEach((e) => { e.style.opacity = 0; });
  S.draw(q1, 8, 2); S.draw(q2, 10, 2); S.draw(pt, 16, 3); S.draw(mc, 28, 2.5);
  q1.style.opacity = 1; q2.style.opacity = 1; pt.style.opacity = 1; mc.style.opacity = 1;
  const lab = (x, y, s, col, t0) => { const e = txt(S, x, y, s, { size: 18, color: col, weight: 700 }); e.style.opacity = 0; S.fade(e, t0, 0.5); return e; };
  lab(B.fxp(3e4), B.fyP(-30), 'pole 1 alone', C.p, 9); lab(B.fxp(3e6), B.fyP(-20), 'pole 2 alone', C.n, 11); lab(B.fxp(1.5e5), B.fyP(-118), 'sum', C.amb, 18);
  lab(B.fxp(1.2e5), B.fyM(52), '−20 dB/dec', C.volt, 30); lab(B.fxp(1.6e7), B.fyM(-2), '−40 dB/dec', C.volt, 32);
  // stacked angle bar
  const bx = 1060, byT = 200, bh = 500, U = bh / 180;
  const sb = S.g();
  S.el('rect', { x: bx, y: byT, width: 90, height: bh, rx: 6, fill: '#0e141e', stroke: '#2a3546' }, sb);
  S.el('line', { x1: bx - 20, y1: byT + bh, x2: bx + 110, y2: byT + bh, stroke: C.bad, 'stroke-width': 4 }, sb);
  txt(S, bx + 120, byT + bh + 8, '−180°: the cliff', { size: 19, color: C.bad, weight: 700 }, sb);
  txt(S, bx + 45, byT - 14, 'phase used', { size: 18, color: C.muted, anchor: 'middle' }, sb);
  const s1 = S.el('rect', { x: bx + 4, width: 82, rx: 4, fill: C.p, 'fill-opacity': 0.75 }, sb), s2 = S.el('rect', { x: bx + 4, width: 82, rx: 4, fill: C.n, 'fill-opacity': 0.75 }, sb);
  const st = [txt(S, bx + 120, 0, '', { size: 18, color: C.p, mono: true }, sb), txt(S, bx + 120, 0, '', { size: 18, color: C.n, mono: true }, sb), txt(S, bx - 20, byT + bh + 50, '', { size: 24, color: C.amb, mono: true, weight: 800 }, sb)];
  const cur = S.el('line', { stroke: '#fff', 'stroke-width': 1.6, 'stroke-dasharray': '5 5' });
  [sb, cur].forEach((e) => { e.style.opacity = 0; S.fade(e, 36, 0.6); });
  const eAt = (t) => (t < 37 ? 2.2 : lerp(2.2, 7.6, clamp((t - 37) / 14, 0, 1)));
  S.anim(0, 1e4, 'stk', (_p, t) => {
    const f = 10 ** eAt(t), a1 = Math.atan(f / p1) * DEG, a2 = Math.atan(f / p2) * DEG, x = B.fxp(f);
    cur.setAttribute('x1', x); cur.setAttribute('x2', x); cur.setAttribute('y1', B.y0); cur.setAttribute('y2', B.yP + B.hp);
    s1.setAttribute('y', byT); s1.setAttribute('height', a1 * U); s2.setAttribute('y', byT + a1 * U); s2.setAttribute('height', a2 * U);
    st[0].setAttribute('y', byT + (a1 * U) / 2 + 6); st[0].textContent = `pole 1: −${fx(a1, 3)}°`;
    st[1].setAttribute('y', byT + a1 * U + (a2 * U) / 2 + 6); st[1].textContent = a2 > 4 ? `pole 2: −${fx(a2, 3)}°` : '';
    st[0].style.visibility = a1 > 4 ? 'visible' : 'hidden';
    st[2].textContent = `total −${fx(a1 + a2, 3)}°`;
  }, E.lin);
  eqAt(S, '|A| = \\frac{A_0}{\\sqrt{1+(\\omega/\\omega_{p1})^2}\\,\\sqrt{1+(\\omega/\\omega_{p2})^2}},\\quad \\angle A = -\\tan^{-1}\\tfrac{\\omega}{\\omega_{p1}} - \\tan^{-1}\\tfrac{\\omega}{\\omega_{p2}}', 1180, 800, 2, { size: 22, w: 760 });
  S.say(0.3, 'Your page’s $A(s)$ has two poles: two arrows. Dividing by both, the sizes multiply, which in dB means they add, and the angles add.');
  S.say(8, 'Each pole’s own phase curve, dashed: the first starts moving a decade before $\\omega_{p1}$, the second a decade before $\\omega_{p2}$.');
  S.say(16, 'Add them, in amber. At $\\omega_{p1}$: −45°. Between the poles: about −90°. At $\\omega_{p2}$: −90° − 45° = −135°. Far above: towards −180°. Exactly the ticks on your page.');
  S.say(28, 'The size: −20 dB per decade after the first pole, −40 after the second. Each pole adds another −20.');
  S.say(36, 'The bar on the right is the walk again: each pole can take up to 90° of the 180° you have. Two poles only approach the cliff; a third pole can cross it.');
});

scene(L15, 'β slides the loop gain down', 54, (S) => {
  header(S, 'LEC 15 · YOUR PAGE, LOOP GAIN', 'Smaller β: the same curve, lower, crossing 0 dB earlier');
  pagePeek(S, 'n15b', 920, 130, 600, 563, 0.3, 7);
  const p1 = 1e4, p2 = 1e6, A0 = 1000;
  const B = bodePair(S, { x: 120, w: 700, y: 140, hm: 290, hp: 230, d0: 2, d1: 8, db0: 70, db1: -50, ph1: -180 });
  B.g.style.opacity = 0; S.fade(B.g, 7, 0.6);
  const aC = S.el('polyline', { points: bodePts(B, (f) => dB(LG.mag(f, A0, [p1, p2])), B.fyM), fill: 'none', stroke: C.dim, 'stroke-width': 2.4, 'stroke-dasharray': '7 6' });
  const lC = liveLine(S, C.volt, 3.8);
  const pC = S.el('polyline', { points: bodePts(B, (f) => LG.ph(f, [p1, p2]), B.fyP), fill: 'none', stroke: C.amb, 'stroke-width': 3.6 });
  const gap = dynArrow(S, C.bad, 3);
  const gd = S.el('circle', { r: 9, fill: C.ok }), drop = S.el('line', { stroke: C.ok, 'stroke-width': 2, 'stroke-dasharray': '5 5' }), pmBar = S.el('line', { stroke: C.ok, 'stroke-width': 6 });
  const rd = [txt(S, 900, 210, '', { size: 22, color: C.text, mono: true, weight: 700 }), txt(S, 900, 246, '', { size: 20, color: C.bad, mono: true }), txt(S, 900, 282, '', { size: 20, color: C.ok, mono: true }), txt(S, 900, 318, '', { size: 24, color: C.ok, mono: true, weight: 800 })];
  [aC, lC, pC, gap, gd, drop, pmBar, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 8, 0.6); });
  txt(S, B.fxp(3e2) + 14, B.fyM(64) + 4, '|A| (β = 1)', { size: 17, color: C.muted });
  const bAt = (t) => (t < 14 ? 1 : t < 26 ? 10 ** lerp(0, -2, E.inout((t - 14) / 12)) : t < 34 ? 0.01 : t < 41 ? 10 ** lerp(-2, 0, E.inout((t - 34) / 7)) : 1);
  S.anim(0, 1e4, 'beta', (_p, t) => {
    const b = bAt(t), k = b * A0;
    lC.setAttribute('points', bodePts(B, (f) => dB(LG.mag(f, k, [p1, p2])), B.fyM));
    const gx = LG.gx(k, [p1, p2]), x = B.fxp(gx), ph = LG.ph(gx, [p1, p2]);
    gap.set(B.fxp(200), B.fyM(dB(A0)), B.fxp(200), B.fyM(dB(k)) - 2, 12);
    gd.setAttribute('cx', x); gd.setAttribute('cy', B.fyM(0));
    drop.setAttribute('x1', x); drop.setAttribute('x2', x); drop.setAttribute('y1', B.fyM(0)); drop.setAttribute('y2', B.fyP(ph));
    pmBar.setAttribute('x1', x); pmBar.setAttribute('x2', x); pmBar.setAttribute('y1', B.fyP(ph)); pmBar.setAttribute('y2', B.fyP(-180));
    rd[0].textContent = `β = ${fx(b, 3)}`; rd[1].textContent = `curve lowered by 20log(1/β) = ${fx(dB(1 / b), 3)} dB`;
    rd[2].textContent = `crosses 0 dB at ${fmtHz(gx)}`; rd[3].textContent = `PM = ${fx(180 + ph, 3)}°`;
  }, E.lin);
  S.say(0.3, 'Your page draws the loop gain twice: once for β = 1, and in red for β smaller than 1. The red curve has the same shape, just lower.');
  S.say(7, 'In dB, multiplying by β subtracts $20\\log(1/\\beta)$: the whole magnitude curve slides down. The phase curve does not move at all: β is a resistor or capacitor divider, it adds no delay.');
  S.say(15, 'Watch the 0 dB crossing, the gain crossover. As β falls, the curve reaches 0 dB earlier, at a lower frequency…');
  S.say(24, '…where the phase has used less of its 180°. The green bar, the distance still left to −180°, grows. Weaker feedback is safer.');
  whyBox(S, 900, 380, 640, 170, '**β = 1 is the worst case.** The unity-gain buffer has the highest $|\\beta A|$ curve and the latest crossing. Designers check stability at β = 1.', 34);
  S.say(34, 'So more feedback is harder to stabilise, and the worst case is β = 1, the unity-gain buffer: the highest curve and the latest crossing. That is why exam questions say “unity-gain feedback”.');
});

scene(L15, 'Gain crossover, phase crossover, and the two margins', 60, (S) => {
  header(S, 'LEC 15 · YOUR PAGE, MIDDLE', 'PM: measured at ωGX. GM: measured at ωPX.');
  pagePeek(S, 'n15c', 900, 140, 640, 458, 0.3, 7);
  const k = 300, poles = [1e3, 2e5, 2e6];
  const B = bodePair(S, { x: 120, w: 720, y: 140, hm: 290, hp: 250, d0: 2, d1: 8, db0: 60, db1: -60, ph1: -270 });
  B.g.style.opacity = 0; S.fade(B.g, 7, 0.6);
  const mc = S.el('polyline', { points: bodePts(B, (f) => dB(LG.mag(f, k, poles)), B.fyM), fill: 'none', stroke: C.volt, 'stroke-width': 3.6 });
  const pc = S.el('polyline', { points: bodePts(B, (f) => LG.ph(f, poles), B.fyP), fill: 'none', stroke: C.amb, 'stroke-width': 3.6 });
  [mc, pc].forEach((e) => { e.style.opacity = 0; S.fade(e, 8, 0.6); });
  const gx = LG.gx(k, poles), px = LG.px(poles), pm = LG.pm(k, poles), gm = -dB(LG.mag(px, k, poles));
  const mk = (f, col, lab, t0) => { const g = S.g(); S.el('line', { x1: B.fxp(f), x2: B.fxp(f), y1: B.y0, y2: B.yP + B.hp, stroke: col, 'stroke-width': 2.2, 'stroke-dasharray': '6 6' }, g); txt(S, B.fxp(f), B.y0 - 12, lab, { size: 19, color: col, weight: 800, anchor: 'middle' }, g); g.style.opacity = 0; S.fade(g, t0, 0.6); return g; };
  mk(gx, C.ok, 'ω_GX', 9); mk(px, C.n, 'ω_PX', 16);
  const d1 = S.el('circle', { cx: B.fxp(gx), cy: B.fyM(0), r: 9, fill: C.ok }); d1.style.opacity = 0; S.pop(d1, 9);
  const d2 = S.el('circle', { cx: B.fxp(px), cy: B.fyP(-180), r: 9, fill: C.n }); d2.style.opacity = 0; S.pop(d2, 16);
  const pmB = S.g(); S.el('line', { x1: B.fxp(gx), x2: B.fxp(gx), y1: B.fyP(-180 + pm), y2: B.fyP(-180), stroke: C.ok, 'stroke-width': 8 }, pmB); txt(S, B.fxp(gx) - 14, B.fyP(-180 + pm / 2) + 6, `PM = ${fx(pm, 3)}°`, { size: 21, color: C.ok, weight: 800, anchor: 'end' }, pmB);
  pmB.style.opacity = 0; S.fade(pmB, 24, 0.6);
  const gmB = S.g(); S.el('line', { x1: B.fxp(px), x2: B.fxp(px), y1: B.fyM(0), y2: B.fyM(-gm), stroke: C.n, 'stroke-width': 8 }, gmB); txt(S, B.fxp(px) + 14, B.fyM(-gm / 2) + 6, `GM = ${fx(gm, 3)} dB`, { size: 21, color: C.n, weight: 800 }, gmB);
  gmB.style.opacity = 0; S.fade(gmB, 33, 0.6);
  eqAt(S, 'PM = 180^\\circ + \\angle\\beta A(j\\omega)\\big|_{\\omega = \\omega_{GX}}', 1200, 300, 24, { size: 30, w: 700, color: C.ok });
  eqAt(S, 'GM = -20\\log|\\beta A(j\\omega)|\\big|_{\\omega = \\omega_{PX}}', 1200, 390, 33, { size: 30, w: 700, color: C.n });
  S.say(0.3, 'The key picture on your page: two special frequencies on the loop-gain plots.');
  S.say(8, '<b>Gain crossover</b>, $\\omega_{GX}$: where $|\\beta A|$ falls to 1, that is 0 dB. Above it the loop gain is too small to sustain anything.');
  S.say(15, '<b>Phase crossover</b>, $\\omega_{PX}$: where the phase reaches −180°, the cliff edge. For a stable loop $\\omega_{GX}$ comes first.');
  S.say(24, '<b>Phase margin</b>: stand at $\\omega_{GX}$ and measure how far the phase still is from −180°: $PM = 180° + \\angle\\beta A$ there.');
  S.say(33, '<b>Gain margin</b>: stand at $\\omega_{PX}$ and measure how far the gain is below 0 dB.');
  whyBox(S, 900, 470, 650, 250, '**The recipe for every PM question:** ① find $\\omega_{GX}$ from $|\\beta A| = 1$; ② add up the pole angles $\\tan^{-1}(\\omega_{GX}/\\omega_{pi})$ there; ③ PM is what is left of 180°. Calculator in **degree** mode.', 42);
  S.say(42, 'The recipe for every question: one, find $\\omega_{GX}$ from $|\\beta A| = 1$. Two, add up the pole angles there. Three, the phase margin is what is left of 180°. Keep the calculator in degree mode.');
});

scene(L15, 'One pole: always stable, PM = 90°', 56, (S) => {
  header(S, 'LEC 15 · YOUR PAGE, SINGLE-POLE SYSTEM', 'One pole lags at most 90°: PM = 90°, and the pole moves up by (1 + βA0)');
  pagePeek(S, 'n15d', 1000, 120, 560, 556, 0.3, 6);
  const A0 = 100, p1 = 1e4;
  const B = bodePair(S, { x: 120, w: 640, y: 140, hm: 260, hp: 190, d0: 2, d1: 8, db0: 50, db1: -30, ph1: -90, mtitle: 'gain in dB: open loop (blue), closed loop (red)' });
  B.g.style.opacity = 0; S.fade(B.g, 6, 0.6);
  const ol = S.el('polyline', { points: bodePts(B, (f) => dB(LG.mag(f, A0, [p1])), B.fyM), fill: 'none', stroke: C.volt, 'stroke-width': 3.4 });
  const pc = S.el('polyline', { points: bodePts(B, (f) => LG.ph(f, [p1]), B.fyP), fill: 'none', stroke: C.amb, 'stroke-width': 3.4 });
  const cl = liveLine(S, C.bad, 3.6);
  const pmk = S.el('line', { stroke: C.bad, 'stroke-width': 2, 'stroke-dasharray': '6 5' }); const pml = txt(S, 0, 0, '', { size: 18, color: C.bad, weight: 700, anchor: 'middle' });
  [ol, pc, cl, pmk, pml].forEach((e) => { e.style.opacity = 0; S.fade(e, 7, 0.6); });
  S.anim(0, 1e4, 'cl', (_p, t) => {
    const u = clamp((t - 30) / 6, 0, 1), k = 1 + (A0 - 1) * u, pole = p1 * k;
    cl.setAttribute('points', bodePts(B, (f) => dB(A0 / k / Math.hypot(1, f / pole)), B.fyM));
    pmk.setAttribute('x1', B.fxp(pole)); pmk.setAttribute('x2', B.fxp(pole)); pmk.setAttribute('y1', B.fyM(dB(A0 / k)) + 10); pmk.setAttribute('y2', B.yP - 30);
    pml.setAttribute('x', B.fxp(pole) + 10); pml.setAttribute('y', B.fyM(dB(A0 / k)) - 14); pml.setAttribute('text-anchor', 'start'); pml.textContent = '';
    richText(pml, u < 0.02 ? 'ω_p1' : `ω_p1(1+βA_0) = ${fmtHz(pole)}`, 18);
  }, E.lin);
  const L = [
    ['PM = 180^\\circ + (-90^\\circ) = 90^\\circ', 8, C.ok],
    ['A_f = \\dfrac{A_0/(1 + s/\\omega_{p1})}{1 + \\beta\\,\\dfrac{A_0}{1 + s/\\omega_{p1}}}', 16, '#e9eef5'],
    ['= \\dfrac{A_0}{1 + s/\\omega_{p1} + \\beta A_0}', 23, '#e9eef5'],
    ['= \\dfrac{A_0}{(1 + \\beta A_0)\\left(1 + \\dfrac{s}{\\omega_{p1}(1 + \\beta A_0)}\\right)}', 29, '#ffd38a'],
  ];
  L.forEach(([tex, t, col], i) => eqAt(S, tex, 1180, 230 + i * 120, t, { size: 26, w: 760, h: 124, color: col }));
  S.say(0.3, 'The simplest case on your page: a single-pole amplifier with β = 1.');
  S.say(8, 'One pole lags at most 90°. At the crossover it is essentially at −90°, so $PM = 180° - 90° = 90°$. The walker can never reach the cliff: a single-pole amplifier is always, unconditionally, stable.');
  S.say(16, 'Now close the loop and follow your page’s algebra. Put $A(s)$ into $A/(1 + \\beta A)$…');
  S.say(23, '…multiply top and bottom by $1 + s/\\omega_{p1}$…');
  S.say(29, '…and take $1 + \\beta A_0$ out. Still one pole, but now at $\\omega_{p1}(1 + \\beta A_0)$: the red dashed line on your page. Watch it move.');
  whyBox(S, 120, 720, 640, 120, 'Gain ÷ $(1 + \\beta A_0)$, bandwidth × $(1 + \\beta A_0)$: the closed-loop pole lands at about $\\beta\\omega_u$, the crossover.', 40);
  S.say(40, 'Gain divided by $1 + \\beta A_0$, bandwidth multiplied by the same factor: the trade from Lectures 3 and 13. The closed-loop pole lands at about $\\beta\\omega_u$, right at the crossover.');
});

scene(L15, 'Two poles: the second pole decides the margin', 58, (S) => {
  header(S, 'LEC 15 · YOUR PAGE, TWO-POLE SYSTEMS', 'PM = 90° − tan⁻¹(ωGX/ωp2): place the second pole');
  pagePeek(S, 'n15e', 950, 140, 600, 455, 0.3, 7);
  const p1 = 1e3, gx = 1e6;
  const B = bodePair(S, { x: 120, w: 700, y: 140, hm: 270, hp: 250, d0: 2, d1: 8, db0: 70, db1: -50, ph1: -180 });
  B.g.style.opacity = 0; S.fade(B.g, 7, 0.6);
  const mc = liveLine(S, C.volt, 3.6), pc = liveLine(S, C.amb, 3.6);
  const p2m = S.el('line', { stroke: C.n, 'stroke-width': 2.4, 'stroke-dasharray': '6 5' }), p2t = txt(S, 0, 0, '', { size: 18, color: C.n, weight: 800, anchor: 'middle' });
  const gxm = S.el('line', { x1: B.fxp(gx), x2: B.fxp(gx), y1: B.y0, y2: B.yP + B.hp, stroke: C.ok, 'stroke-width': 2.2, 'stroke-dasharray': '6 6' });
  const pmB = S.el('line', { stroke: C.ok, 'stroke-width': 8 });
  const rd = [txt(S, 960, 650, '', { size: 22, color: C.n, mono: true, weight: 700 }), txt(S, 960, 690, '', { size: 26, color: C.ok, mono: true, weight: 800 })];
  [mc, pc, p2m, p2t, gxm, pmB, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 8, 0.6); });
  txt(S, B.fxp(gx) + 8, B.y0 + 20, 'ω_GX (held fixed)', { size: 17, color: C.ok });
  const rAt = (t) => (t < 14 ? 4 : t < 24 ? 10 ** lerp(Math.log10(4), 0, E.inout((t - 14) / 10)) : t < 30 ? 1 : t < 36 ? 10 ** lerp(0, Math.log10(1.732), E.inout((t - 30) / 6)) : 1.732);
  S.anim(0, 1e4, 'p2', (_p, t) => {
    const r = rAt(t), p2 = r * gx, poles = [p1, p2];
    const k = Math.hypot(1, gx / p1) * Math.hypot(1, gx / p2);
    mc.setAttribute('points', bodePts(B, (f) => dB(LG.mag(f, k, poles)), B.fyM)); pc.setAttribute('points', bodePts(B, (f) => LG.ph(f, poles), B.fyP));
    p2m.setAttribute('x1', B.fxp(p2)); p2m.setAttribute('x2', B.fxp(p2)); p2m.setAttribute('y1', B.y0 + 30); p2m.setAttribute('y2', B.yP + B.hp);
    p2t.setAttribute('x', B.fxp(p2)); p2t.setAttribute('y', B.yP + B.hp + 50); p2t.textContent = ''; richText(p2t, 'ωp2', 18);
    const ph = LG.ph(gx, poles);
    pmB.setAttribute('x1', B.fxp(gx)); pmB.setAttribute('x2', B.fxp(gx)); pmB.setAttribute('y1', B.fyP(ph)); pmB.setAttribute('y2', B.fyP(-180));
    rd[0].textContent = `ωp2 = ${fx(r, 3)} × ωGX`; rd[1].textContent = `PM = ${fx(180 + ph, 3)}°`;
  }, E.lin);
  eqAt(S, 'PM \\approx 90^\\circ - \\tan^{-1}\\frac{\\omega_{GX}}{\\omega_{p2}}', 1240, 300, 9, { size: 34, w: 620, color: '#ffd38a' });
  S.say(0.3, 'Your page’s last picture: two poles with β = 1. The first pole is far below the crossover, so by then it is already giving its full −90°.');
  S.say(9, 'So everything depends on the second pole. The margin is 90° minus what the second pole has eaten at the crossover: $PM ≈ 90° - \\tan^{-1}(\\omega_{GX}/\\omega_{p2})$.');
  S.say(16, 'Slide the second pole down towards the crossover and watch the margin shrink. Exactly at the crossover it gives 45°, so PM = 45°.');
  S.say(30, 'Push it up to 1.73 times the crossover, because $\\tan 30° = 0.577$, and PM = 60°, the usual target.');
  whyBox(S, 950, 420, 600, 170, '**Two placements to remember:** $\\omega_{p2} = \\omega_{GX}$ → 45°. $\\omega_{p2} = 1.73\\,\\omega_{GX}$ → 60°. Lecture 17’s compensation is all about placing this pole.', 40);
  S.say(40, 'Two numbers to keep: the second pole at the crossover gives 45°; at 1.73 times the crossover gives 60°. Lecture 17’s compensation is all about placing that second pole.');
});

scene(L15, 'Lecture 15 in one card', 28, (S) => {
  header(S, 'LEC 15 · REMEMBER', 'Everything from Lecture 15');
  remember(S, [
    'Loop gain $\\beta A$: sizes multiply (dB add), angles add: $\\angle = -\\sum\\tan^{-1}(\\omega/\\omega_{pi})$.',
    'Each pole: −3 dB and −45° at $\\omega_p$; phase moves from $0.1\\omega_p$ to $10\\omega_p$; gain falls 20 dB/dec after it.',
    'Smaller β lowers $|\\beta A|$, $\\omega_{GX}$ moves left: more stable. β = 1 is the worst case.',
    '$\\omega_{GX}$: $|\\beta A| = 1$. $\\omega_{PX}$: −180°. $PM = 180° + \\angle\\beta A(\\omega_{GX})$; $GM = -20\\log|\\beta A(\\omega_{PX})|$.',
    'One pole: PM = 90°, always stable; closed loop pole at $\\omega_{p1}(1+\\beta A_0)$.',
    'Two poles: $PM ≈ 90° - \\tan^{-1}(\\omega_{GX}/\\omega_{p2})$: 45° at $\\omega_{p2} = \\omega_{GX}$, 60° at $1.73\\,\\omega_{GX}$.',
  ], 0.4, 'Lecture 15 · remember');
  S.say(0.4, 'Read it once. Now every Lecture 15 question, and you solve each part first.');
});

/* ── questions ── */

scene(L15, 'Past tutorial Ex 3: a one-pole op amp at gain 100', 44, (S) => {
  pyqFrame(S, {
    tag: 'LEC 15 · QUESTION 1 OF 5', title: 'Crossover and PM of a one-pole loop', src: 'Past tutorial 2024-25 T2 Ex 3',
    q: '$A_0 = 10^5$, one pole at $f_p = 10$ Hz, otherwise ideal. Non-inverting, closed-loop gain 100. Find the frequency where $|A\\beta| = 1$, and the phase margin.', qh: 200,
    tests: 'βA0, the −20 dB/dec slope to the crossover, and PM of a single pole.',
    fig: eqFig([['\\beta A(f) = \\frac{\\beta A_0}{1 + jf/f_p}', 330, 34], ['A_0 = 10^5,\\quad f_p = 10\\,\\mathrm{Hz},\\quad A_{CL} = 100', 470, 30, C.muted]]),
    steps: [
      { t: 6, title: '**Find the crossover.** Gain 100 means β = 1/100, so the loop gain starts at $\\beta A_0 = 1000$ (60 dB). Falling 20 dB/dec after the pole, it reaches 0 dB three decades above 10 Hz.', tex: '|\\beta A| \\approx \\frac{\\beta A_0\\,f_p}{f} = 1 \\Rightarrow f_1 = \\beta A_0 f_p = 1000\\times10\\,\\mathrm{Hz} = 10\\,\\mathrm{kHz}',
        try: {
          q: 'At what frequency does the loop gain $|A\\beta|$ fall to 1?',
          hint: ['First get β from the closed-loop gain, then the low-frequency loop gain $\\beta A_0$. Above the pole, $|\\beta A|$ falls 20 dB per decade.', '$\\beta = \\frac{1}{100}$. For $f \\gg f_p$: $|\\beta A| \\approx \\frac{\\beta A_0\\,f_p}{f}$. Set it equal to 1.'],
          how: [
            'A non-inverting amplifier with gain 100 has a feedback factor of one over that. $$\\beta = \\frac{1}{100}$$',
            'The loop gain at low frequency is β times the op amp gain. $$\\beta A_0 = \\frac{10^5}{100} = 1000$$',
            'Far above the pole, $|\\beta A| = \\frac{\\beta A_0}{\\sqrt{1+(f/f_p)^2}} \\approx \\frac{\\beta A_0 f_p}{f}$. Set it to 1 and solve for f. $$f_1 = \\beta A_0\\,f_p = 1000\\times10 = 10^4\\,\\mathrm{Hz}$$',
          ],
          why: 'One pole: crossover = $\\beta A_0 f_p$ (the gain-bandwidth times β).',
          parts: [
            { q: 'What is the low-frequency loop gain $\\beta A_0$?', answer: 1e5 / 100, unit: '', tol: 0.01,
              hint: ['Gain 100 (non-inverting) means $\\beta = 1/100$.'],
              how: ['$$\\beta A_0 = \\frac{10^5}{100} = 1000$$'] },
          ],
          answer: ans('pyq-t24-ex3', 'f'), unit: 'Hz', tol: 0.02,
        }, say: 'Three decades above 10 Hz: 10 kHz. That is just $\\beta A_0 f_p$.' },
      { t: 14, title: '**Phase margin:** the only pole is 1000 times below the crossover, so its lag there is almost the full 90°.', tex: 'PM = 180^\\circ - \\tan^{-1}\\frac{f_1}{f_p} = 180^\\circ - \\tan^{-1}\\frac{10\\,\\mathrm{kHz}}{10\\,\\mathrm{Hz}} = 180^\\circ - 89.94^\\circ = 90.06^\\circ',
        try: {
          q: 'What is the phase margin?',
          hint: ['PM = 180° minus the loop’s phase lag at the crossover $f_1$ you just found. Only one pole gives lag.', '$PM = 180^\\circ - \\tan^{-1}\\frac{f_1}{f_p}$ (calculator in degree mode).'],
          how: [
            'Phase margin is what is left of 180° at the gain crossover. $$PM = 180^\\circ + \\angle\\beta A(f_1) = 180^\\circ - \\tan^{-1}\\frac{f_1}{f_p}$$',
            'The pole is far below the crossover, so its lag is almost 90°. $$\\tan^{-1}\\frac{10^4}{10} = \\tan^{-1}1000 = 89.94^\\circ$$',
            'Subtract. $$PM = 180^\\circ - 89.94^\\circ = 90.06^\\circ$$',
          ],
          why: 'One pole never lags more than 90°, so a one-pole loop always has PM ≈ 90°.',
          answer: ans('pyq-t24-ex3', 'pm'), unit: '°', tol: 0.005,
        }, say: '$\\tan^{-1}(1000) = 89.94°$, so PM = 90.06°. One pole: 90° every time.' },
      { t: 22, ans: true, title: '**Answers:** $f_1$ ≈ 10 kHz · PM ≈ 90° (90.06°)', say: 'An ideal one-pole op amp has 90° of margin whatever the gain.' },
    ],
  });
}, { q: 'Past tutorial Ex 3' });

scene(L15, 'Problem Set 2 P2: the buffer versus gain 5', 66, (S) => {
  pyqFrame(S, {
    tag: 'LEC 15 · QUESTION 2 OF 5', title: 'Same op amp, two feedback factors', src: 'Problem Set 2 P2',
    q: '$A_0 = 2000$, poles at 50 kHz and 50 MHz. Find $\\omega_{GX}$ and the PM (a) as a unity-gain buffer, (b) with β = 0.2. (c) How much does the buffer peak at $\\omega_{GX}$?', qh: 200,
    tests: 'the PM recipe with two poles, the β slide, and a first look at Lecture 16’s peaking.',
    fig: eqFig([['|\\beta A(f)| = \\frac{\\beta A_0}{\\sqrt{1 + (f/f_{p1})^2}\\,\\sqrt{1 + (f/f_{p2})^2}}', 330, 30], ['\\angle\\beta A(f) = -\\tan^{-1}\\tfrac{f}{f_{p1}} - \\tan^{-1}\\tfrac{f}{f_{p2}}', 470, 28, '#ffd38a']]),
    steps: [
      { t: 6, title: '**(a) Find the crossover.** The one-pole estimate $\\beta A_0 f_{p1}$ = 100 MHz is past $f_{p2}$, so the second pole matters: keep it. Far above $f_{p1}$, write $u = f/f_{p2}$ and solve $|\\beta A| = 1$.', tex: '|\\beta A| \\approx \\frac{\\beta A_0 f_{p1}/f_{p2}}{u\\sqrt{1+u^2}} = \\frac{2}{u\\sqrt{1+u^2}} = 1 \\Rightarrow u^4 + u^2 - 4 = 0 \\Rightarrow u^2 = 1.56,\\; u = 1.25,\\quad f_{GX} = 1.25\\times50\\,\\mathrm{MHz} = 62.5\\,\\mathrm{MHz}',
        try: {
          q: '**(a)** As a unity-gain buffer (β = 1), at what frequency $f_{GX}$ does $|\\beta A|$ fall to 1?',
          hint: ['Try the one-pole estimate $\\beta A_0 f_{p1}$ first. Is it below or above $f_{p2}$? If above, the second pole must be kept.', 'Far above $f_{p1}$: $|\\beta A| \\approx \\frac{\\beta A_0 f_{p1}}{f}\\cdot\\frac{1}{\\sqrt{1+(f/f_{p2})^2}}$. Put $u = f/f_{p2}$ and set it to 1.', 'You get $u^2(1+u^2) = 4$: a quadratic in $u^2$.'],
          how: [
            'One-pole guess: $\\beta A_0 f_{p1}$. It lands above the second pole, so the second pole cannot be ignored. $$\\beta A_0 f_{p1} = 2000\\times50\\,\\mathrm{kHz} = 100\\,\\mathrm{MHz} > f_{p2} = 50\\,\\mathrm{MHz}$$',
            'Far above $f_{p1}$ the first pole gives $f_{p1}/f$; keep the second pole exactly. With $u = f/f_{p2}$: $$|\\beta A| \\approx \\frac{\\beta A_0 f_{p1}}{f}\\cdot\\frac{1}{\\sqrt{1+u^2}} = \\frac{\\beta A_0 f_{p1}/f_{p2}}{u\\sqrt{1+u^2}} = \\frac{2}{u\\sqrt{1+u^2}}$$',
            'Set it to 1 and square: a quadratic in $u^2$. $$u^2(1+u^2) = 4 \\Rightarrow u^4 + u^2 - 4 = 0 \\Rightarrow u^2 = \\frac{-1+\\sqrt{17}}{2} = 1.56$$',
            'Take the root and go back to hertz. $$u = 1.25,\\quad f_{GX} = 1.25\\times50\\,\\mathrm{MHz} = 62.5\\,\\mathrm{MHz}$$',
          ],
          why: 'Always check the one-pole crossover against $f_{p2}$; if it is past it, solve with both poles.',
          calc: [{ what: 'Quadratic in u² (y² + y − 4 = 0)', keys: '[HOME] ▸ Equation ▸ Polynomial ▸ ax²+bx+c:  a = 1, b = 1, c = [SHIFT] [−] 4', shows: 'x₁ = 1.5616 (keep the positive root)' }, { what: 'Back to hertz', keys: '√( 1.5616 ) × 50M', shows: '62.48M', note: 'In Calculate, [Ans] does not hold the Polynomial root: retype it.' }],
          parts: [
            { q: 'Write $|\\beta A| \\approx \\frac{k}{u\\sqrt{1+u^2}}$ with $u = f/f_{p2}$. What is $k = \\beta A_0 f_{p1}/f_{p2}$?', answer: 2000 * 50e3 / 50e6, unit: '', tol: 0.01,
              hint: ['β = 1, $A_0$ = 2000, $f_{p1}$ = 50 kHz, $f_{p2}$ = 50 MHz.'],
              how: ['$$k = \\frac{2000\\times50\\,\\mathrm{k}}{50\\,\\mathrm{M}} = 2$$'] },
            { q: 'Setting $|\\beta A| = 1$ gives $u^2(1+u^2) = k^2$. Solve for $u^2$.', answer: u2PS2(2), unit: '', tol: 0.01,
              hint: ['It is a quadratic in $y = u^2$: $y^2 + y - 4 = 0$. Keep the positive root.'],
              how: ['$$u^2 = \\frac{-1+\\sqrt{1+16}}{2} = 1.56$$'] },
          ],
          answer: ans('bank-ps2-p2', 'gx1'), unit: 'Hz', tol: 0.03,
        }, say: 'The quadratic gives $f_{GX} = 62.5$ MHz: above the second pole.' },
      { t: 15, title: '**PM at 62.5 MHz:** add the two pole lags at the crossover and take them from 180°.', tex: 'PM = 180^\\circ - \\tan^{-1}\\frac{62.5\\,\\mathrm{M}}{50\\,\\mathrm{k}} - \\tan^{-1}\\frac{62.5\\,\\mathrm{M}}{50\\,\\mathrm{M}} = 180^\\circ - 89.95^\\circ - 51.33^\\circ = 38.7^\\circ',
        try: {
          q: '**(a)** What is the phase margin of the buffer?',
          hint: ['Stand at $f_{GX}$ = 62.5 MHz. Each pole lags by its own arctangent; the lags add.', '$PM = 180^\\circ - \\tan^{-1}\\frac{f_{GX}}{f_{p1}} - \\tan^{-1}\\frac{f_{GX}}{f_{p2}}$ (degree mode).'],
          how: [
            'Phase margin = 180° minus the total lag at the crossover. $$PM = 180^\\circ - \\tan^{-1}\\frac{f_{GX}}{f_{p1}} - \\tan^{-1}\\frac{f_{GX}}{f_{p2}}$$',
            'First pole (far below): almost 90°. $$\\tan^{-1}\\frac{62.5\\,\\mathrm{MHz}}{50\\,\\mathrm{kHz}} = \\tan^{-1}1250 = 89.95^\\circ$$',
            'Second pole (just below the crossover). $$\\tan^{-1}\\frac{62.5}{50} = \\tan^{-1}1.25 = 51.33^\\circ$$',
            'Subtract both from 180°. $$PM = 180^\\circ - 89.95^\\circ - 51.33^\\circ = 38.7^\\circ$$',
          ],
          why: 'Under 45°: as a buffer this op amp rings badly.',
          calc: [{ what: 'PM in one line (degree mode, prefixes)', keys: '180 − [SHIFT] [tan] 62.48M ÷ 50k ) − [SHIFT] [tan] 62.48 ÷ 50 )', shows: '38.71', note: 'For (b), edit 62.48 to 18.73 (both places) and [EXE] again: 69.62.' }],
          parts: [
            { q: 'Lag of the first pole (50 kHz) at $f_{GX}$ = 62.5 MHz?', answer: atD15(ans('bank-ps2-p2', 'gx1') / 50e3), unit: '°', tol: 0.002,
              hint: ['$\\tan^{-1}(f_{GX}/f_{p1})$, degree mode.'],
              how: ['$$\\tan^{-1}\\frac{62.5\\,\\mathrm{M}}{50\\,\\mathrm{k}} = \\tan^{-1}1250 = 89.95^\\circ$$'] },
            { q: 'Lag of the second pole (50 MHz) at the same frequency?', answer: atD15(ans('bank-ps2-p2', 'gx1') / 50e6), unit: '°', tol: 0.01,
              hint: ['$\\tan^{-1}(f_{GX}/f_{p2})$.'],
              how: ['$$\\tan^{-1}\\frac{62.5}{50} = \\tan^{-1}1.25 = 51.33^\\circ$$'] },
          ],
          answer: ans('bank-ps2-p2', 'pm1'), unit: '°', tol: 0.02,
        }, say: '89.95° + 51.3° of lag: PM = 38.7°. Too little.' },
      { t: 24, title: '**(b) β = 0.2** lowers the loop-gain curve by $20\\log 5$ = 14 dB, so it crosses 0 dB earlier, where the second pole has eaten less phase. Same equation with $\\beta A_0 f_{p1}/f_{p2} = 0.4$.', tex: 'u^2(1+u^2) = 0.4^2 \\Rightarrow u^2 = 0.140,\\; f_{GX} = 0.375\\times50\\,\\mathrm{MHz} = 18.7\\,\\mathrm{MHz},\\quad PM = 180^\\circ - 89.85^\\circ - 20.53^\\circ = 69.6^\\circ',
        try: {
          q: '**(b)** Now with β = 0.2: find the phase margin.',
          hint: ['Same two steps as (a): find the new crossover from $|\\beta A| = 1$, then add the two angles there.', 'Now $\\beta A_0 = 400$, so $\\frac{\\beta A_0 f_{p1}/f_{p2}}{u\\sqrt{1+u^2}} = \\frac{0.4}{u\\sqrt{1+u^2}} = 1$ with $u = f/f_{p2}$.'],
          how: [
            'The loop gain is now smaller. $$\\beta A_0 = 0.2\\times2000 = 400,\\quad \\frac{\\beta A_0 f_{p1}}{f_{p2}} = \\frac{400\\times50\\,\\mathrm{k}}{50\\,\\mathrm{M}} = 0.4$$',
            'Set $|\\beta A| = 1$ as in (a). $$u^2(1+u^2) = 0.16 \\Rightarrow u^2 = \\frac{-1+\\sqrt{1.64}}{2} = 0.140 \\Rightarrow u = 0.375$$',
            'Back to hertz. $$f_{GX} = 0.375\\times50\\,\\mathrm{MHz} = 18.7\\,\\mathrm{MHz}$$',
            'Add the lags and subtract from 180°. $$PM = 180^\\circ - \\tan^{-1}\\frac{18.7\\,\\mathrm{M}}{50\\,\\mathrm{k}} - \\tan^{-1}\\frac{18.7}{50} = 180^\\circ - 89.85^\\circ - 20.53^\\circ = 69.6^\\circ$$',
          ],
          why: 'Smaller β → lower curve → earlier crossover → more phase margin.',
          parts: [
            { q: 'With β = 0.2, find the new crossover $f_{GX}$.', answer: Math.sqrt(u2PS2(0.4)) * 50e6, unit: 'Hz', tol: 0.02,
              hint: ['Now $k = \\beta A_0 f_{p1}/f_{p2} = 400\\times50\\,\\mathrm{k}/50\\,\\mathrm{M} = 0.4$.', 'Solve $u^2(1+u^2) = 0.16$ for $u^2$, then $f_{GX} = u\\,f_{p2}$.'],
              how: ['$$u^2 = \\frac{-1+\\sqrt{1.64}}{2} = 0.140,\\quad u = 0.375$$', '$$f_{GX} = 0.375\\times50\\,\\mathrm{MHz} = 18.7\\,\\mathrm{MHz}$$'] },
            { q: 'Lag of the first pole (50 kHz) at 18.7 MHz?', answer: atD15(Math.sqrt(u2PS2(0.4)) * 50e6 / 50e3), unit: '°', tol: 0.002,
              hint: ['$\\tan^{-1}(f_{GX}/f_{p1})$.'],
              how: ['$$\\tan^{-1}\\frac{18.7\\,\\mathrm{M}}{50\\,\\mathrm{k}} = \\tan^{-1}375 = 89.85^\\circ$$'] },
            { q: 'Lag of the second pole (50 MHz) at 18.7 MHz?', answer: atD15(Math.sqrt(u2PS2(0.4))), unit: '°', tol: 0.01,
              hint: ['$\\tan^{-1}(f_{GX}/f_{p2})$.'],
              how: ['$$\\tan^{-1}\\frac{18.7}{50} = \\tan^{-1}0.375 = 20.53^\\circ$$'] },
          ],
          answer: ans('bank-ps2-p2', 'pm2'), unit: '°', tol: 0.02,
        }, say: 'Crossover at 18.7 MHz, where the second pole has eaten only 20°: PM = 69.6°. Weaker feedback, more margin.' },
      { t: 33, title: '**(c) Lecture 16’s peaking formula:** at $\\omega_{GX}$ the closed-loop gain is $1/\\beta$ divided by $2\\sin(PM/2)$. Use the buffer’s PM from (a).', tex: '\\frac{|A_f(\\omega_{GX})|}{1/\\beta} = \\frac{1}{2\\sin(PM/2)} = \\frac{1}{2\\sin19.36^\\circ} = \\frac{1}{2\\times0.331} = 1.51',
        try: {
          q: '**(c)** By what factor does the buffer’s closed-loop gain peak at $\\omega_{GX}$ (relative to its low-frequency gain)?',
          hint: ['At the crossover, $|\\beta A| = 1$, so $1 + \\beta A$ is two unit arrows with angle PM between them. Use the buffer’s PM from (a).', '$\\frac{|A_f(\\omega_{GX})|}{1/\\beta} = \\frac{1}{2\\sin(PM/2)}$.'],
          how: [
            'At $\\omega_{GX}$ the loop gain has size 1 and angle $PM - 180°$, so $|1 + \\beta A| = 2\\sin(PM/2)$. $$\\frac{|A_f(\\omega_{GX})|}{1/\\beta} = \\frac{1}{2\\sin(PM/2)}$$',
            'Use PM = 38.7° from (a). $$\\frac{PM}{2} = 19.36^\\circ,\\quad \\sin19.36^\\circ = 0.331$$',
            'Divide. $$\\frac{1}{2\\times0.331} = 1.51$$',
          ],
          why: 'A 51 % peak. Remember 45° → 1.3×, 60° → 1×.',
          parts: [
            { q: 'Using PM = 38.7° from (a), what is $|1 + \\beta A|$ at the crossover?', answer: 2 * Math.sin(ans('bank-ps2-p2', 'pm1') / 2 * Math.PI / 180), unit: '', tol: 0.01,
              hint: ['Two unit arrows with angle PM between them: $|1 + \\beta A| = 2\\sin(PM/2)$.'],
              how: ['$$2\\sin\\frac{38.7^\\circ}{2} = 2\\times0.331 = 0.663$$'] },
          ],
          answer: ans('bank-ps2-p2', 'pk'), unit: '×', tol: 0.02,
        }, say: '$1/(2\\sin 19.4°) = 1.51$: a 51 % peak. Lecture 16 explains why.' },
      { t: 41, ans: true, title: '**Answers:** (a) $f_{GX}$ = 62.5 MHz, PM = 38.7° · (b) $f_{GX}$ = 18.7 MHz, PM = 69.6° · (c) peak 1.51× (51 %)', say: 'Same op amp: unstable-looking as a buffer, comfortable at gain 5.' },
    ],
  });
}, { q: 'Problem Set 2 P2' });

scene(L15, '2025 mid-sem Q5 (= Razavi 10.3, 10.4): two close poles', 62, (S) => {
  pyqFrame(S, {
    tag: 'LEC 15 · QUESTION 3 OF 5', title: 'PM with two close poles, and PM from a peak', src: 'Mid-sem 2025-26 Q5 · 9 marks', paper: 'm25q5',
    q: '(a) $A_M = 1000$, poles $\\omega_{p1} = 1$ MHz and $\\omega_{p2}$, unity-gain feedback. PM for (i) $\\omega_{p2} = 2\\omega_{p1}$, (ii) $\\omega_{p2} = 4\\omega_{p1}$. (b) A unity-gain loop peaks by 50 % near the crossover: PM?', qh: 220,
    tests: 'the PM recipe when both poles sit far below $\\omega_{GX}$, and Lecture 16’s peak formula backwards. It is Razavi Problems 10.3 and 10.4 together.',
    fig: eqFig([['|\\beta A| = \\frac{A_M}{\\sqrt{1 + (\\omega/\\omega_{p1})^2}\\,\\sqrt{1 + (\\omega/\\omega_{p2})^2}}', 330, 30], ['\\angle\\beta A = -\\tan^{-1}\\tfrac{\\omega}{\\omega_{p1}} - \\tan^{-1}\\tfrac{\\omega}{\\omega_{p2}}', 470, 28, '#ffd38a']]),
    steps: [
      { t: 6, title: '**(i) Find the crossover.** With $A_M = 1000$ the crossover lands far above both poles, so each factor $\\sqrt{1+(\\omega/\\omega_p)^2}$ is just $\\omega/\\omega_p$.', tex: '|\\beta A| \\approx \\frac{A_M\\,\\omega_{p1}\\omega_{p2}}{\\omega^2} = 1 \\Rightarrow \\omega_{GX} \\approx \\sqrt{A_M\\,\\omega_{p1}\\omega_{p2}} = \\sqrt{1000\\times2}\\,\\omega_{p1} = 44.7\\,\\omega_{p1}', say: 'Both poles are far below the crossover, so $|\\beta A| ≈ 1000 \\times 2/(\\omega/\\omega_{p1})^2 = 1$: $\\omega_{GX} ≈ 44.7\\,\\omega_{p1}$.' },
      { t: 13, title: '**Add the two lags at the crossover** and take them from 180°. Both poles are far below $\\omega_{GX}$, so each gives nearly 90°.', tex: 'PM = 180^\\circ - \\tan^{-1}44.7 - \\tan^{-1}\\frac{44.7}{2} = 180^\\circ - 88.72^\\circ - 87.44^\\circ = 3.84^\\circ',
        try: {
          q: '**(a)(i)** With $\\omega_{p2} = 2\\omega_{p1}$ and the crossover found above, what is the phase margin?',
          hint: ['Stand at $\\omega_{GX} = 44.7\\,\\omega_{p1}$. Each pole lags by its own arctangent; the lags add.', '$PM = 180^\\circ - \\tan^{-1}\\frac{\\omega_{GX}}{\\omega_{p1}} - \\tan^{-1}\\frac{\\omega_{GX}}{\\omega_{p2}}$ (degree mode).'],
          how: [
            'Phase margin = 180° minus the total lag at the crossover. $$PM = 180^\\circ - \\tan^{-1}\\frac{\\omega_{GX}}{\\omega_{p1}} - \\tan^{-1}\\frac{\\omega_{GX}}{\\omega_{p2}}$$',
            'First pole: the crossover is 44.7 times above it. $$\\tan^{-1}44.7 = 88.72^\\circ$$',
            'Second pole is at $2\\omega_{p1}$, so the ratio is half as big. $$\\tan^{-1}\\frac{44.7}{2} = \\tan^{-1}22.35 = 87.44^\\circ$$',
            'Subtract both. $$PM = 180^\\circ - 88.72^\\circ - 87.44^\\circ = 3.84^\\circ$$',
          ],
          why: 'Almost an oscillator: both poles sit far below the crossover and each eats nearly 90°.',
          calc: [{ what: 'Exact crossover with the Solver (x = ω/ωp1)', keys: '[HOME] ▸ Equation ▸ Solver:  1000 ÷ ( √(1+x²) × √(1+(x÷2)²) ) = 1, start 40', shows: 'x = 44.69' }, { what: 'PM (degree mode)', keys: '180 − [SHIFT] [tan] 44.69 ) − [SHIFT] [tan] 44.69 ÷ 2 )', shows: '3.84' }],
          parts: [
            { q: 'Lag of the first pole at $\\omega_{GX} = 44.7\\,\\omega_{p1}$ (from the card above)?', answer: atD15(Math.sqrt(2000)), unit: '°', tol: 0.002,
              hint: ['$\\tan^{-1}(\\omega_{GX}/\\omega_{p1})$.'],
              how: ['$$\\tan^{-1}44.7 = 88.72^\\circ$$'] },
            { q: 'Lag of the second pole ($2\\omega_{p1}$) at $\\omega_{GX}$?', answer: atD15(Math.sqrt(2000) / 2), unit: '°', tol: 0.002,
              hint: ['$\\tan^{-1}(\\omega_{GX}/\\omega_{p2})$ = $\\tan^{-1}(44.7/2)$.'],
              how: ['$$\\tan^{-1}22.4 = 87.44^\\circ$$'] },
          ],
          answer: ans('pyq-m25-q5', 'pm2'), unit: '°', tol: 0.03,
        }, say: '88.7° + 87.4° = 176.2°: PM = 3.8°. Almost an oscillator.' },
      { t: 22, title: '**(ii) Same recipe with $\\omega_{p2} = 4\\omega_{p1}$:** new crossover, then the two lags. Moving one pole a little hardly helps.', tex: '\\omega_{GX} \\approx \\sqrt{1000\\times4}\\,\\omega_{p1} = 63.2\\,\\omega_{p1},\\quad PM = 180^\\circ - \\tan^{-1}63.2 - \\tan^{-1}15.8 = 180^\\circ - 89.09^\\circ - 86.38^\\circ = 4.53^\\circ',
        try: {
          q: '**(a)(ii)** Now $\\omega_{p2} = 4\\omega_{p1}$. What is the phase margin?',
          hint: ['Two steps, as in (i): find the new crossover from $|\\beta A| = 1$, then add the two lags there.', 'Both poles still far below: $\\omega_{GX} \\approx \\sqrt{A_M\\,\\omega_{p1}\\omega_{p2}}$. Then $PM = 180^\\circ - \\tan^{-1}\\frac{\\omega_{GX}}{\\omega_{p1}} - \\tan^{-1}\\frac{\\omega_{GX}}{\\omega_{p2}}$.'],
          how: [
            'Crossover: both poles are still far below it, so $|\\beta A| \\approx A_M\\omega_{p1}\\omega_{p2}/\\omega^2 = 1$. $$\\omega_{GX} \\approx \\sqrt{1000\\times4}\\,\\omega_{p1} = 63.2\\,\\omega_{p1}$$',
            'First pole’s lag. $$\\tan^{-1}63.2 = 89.09^\\circ$$',
            'Second pole’s lag ($\\omega_{p2} = 4\\omega_{p1}$). $$\\tan^{-1}\\frac{63.2}{4} = \\tan^{-1}15.8 = 86.38^\\circ$$',
            'Subtract both from 180°. $$PM = 180^\\circ - 89.09^\\circ - 86.38^\\circ = 4.53^\\circ$$',
          ],
          why: 'Moving $\\omega_{p2}$ from 2 to 4 times $\\omega_{p1}$ gains less than 1°: close poles under a big gain need compensation (Lec 17).',
          parts: [
            { q: 'New crossover: $\\omega_{GX}/\\omega_{p1}$ with $\\omega_{p2} = 4\\omega_{p1}$?', answer: Math.sqrt(4000), unit: '', tol: 0.01,
              hint: ['Same as (i): $\\omega_{GX} \\approx \\sqrt{A_M\\,\\omega_{p1}\\omega_{p2}}$.'],
              how: ['$$\\frac{\\omega_{GX}}{\\omega_{p1}} \\approx \\sqrt{1000\\times4} = 63.2$$'] },
            { q: 'Lag of the first pole there?', answer: atD15(Math.sqrt(4000)), unit: '°', tol: 0.002,
              hint: ['$\\tan^{-1}63.2$.'],
              how: ['$$\\tan^{-1}63.2 = 89.09^\\circ$$'] },
            { q: 'Lag of the second pole ($4\\omega_{p1}$) there?', answer: atD15(Math.sqrt(4000) / 4), unit: '°', tol: 0.002,
              hint: ['$\\tan^{-1}(63.2/4)$.'],
              how: ['$$\\tan^{-1}15.8 = 86.38^\\circ$$'] },
          ],
          answer: ans('pyq-m25-q5', 'pm4'), unit: '°', tol: 0.03,
        }, say: 'Only 4.5°. Moving one pole a little does nothing: with this much gain both poles eat almost 90° each.' },
      { t: 31, title: '**(b) Lecture 16 backwards.** At the crossover the closed-loop gain is $1/\\beta$ divided by $2\\sin(PM/2)$. A 50 % peak means that factor is 1.5; solve for PM.', tex: '\\frac{1}{2\\sin(PM/2)} = 1.5 \\Rightarrow \\sin\\frac{PM}{2} = \\frac{1}{3} \\Rightarrow PM = 2\\sin^{-1}\\frac13 = 2\\times19.47^\\circ = 38.9^\\circ',
        try: {
          q: '**(b)** A unity-gain loop peaks by 50 % near the gain crossover. What is its phase margin?',
          hint: ['Use Lecture 16’s peak formula backwards. A 50 % peak means the closed-loop gain is 1.5 times its low-frequency value.', '$\\frac{1}{2\\sin(PM/2)} = 1.5$. Solve for $\\sin(PM/2)$ first.'],
          how: [
            'At the crossover the closed-loop gain, relative to $1/\\beta$, is $1/(2\\sin(PM/2))$. A 50 % peak makes it 1.5. $$\\frac{1}{2\\sin(PM/2)} = 1.5$$',
            'Rearrange. $$\\sin\\frac{PM}{2} = \\frac{1}{2\\times1.5} = \\frac13$$',
            'Take the inverse sine (degree mode) and double it. $$PM = 2\\sin^{-1}\\frac13 = 2\\times19.47^\\circ = 38.9^\\circ$$',
          ],
          why: 'Check: 45° gives 1.3×, so a bigger 1.5× peak must mean less than 45°.',
          calc: [{ what: 'PM from the peak (degree mode)', keys: '2 [SHIFT] [sin] ( 1 ÷ ( 2 × 1.5 ) )', shows: '38.94' }],
          parts: [
            { q: 'A 50 % peak: what is $\\sin(PM/2)$?', answer: 1 / 3, unit: '', tol: 0.01,
              hint: ['$\\frac{1}{2\\sin(PM/2)} = 1.5$.'],
              how: ['$$\\sin\\frac{PM}{2} = \\frac{1}{2\\times1.5} = 0.333$$'] },
          ],
          answer: ans('pyq-m25-q5', 'pmb'), unit: '°', tol: 0.01,
        }, say: '$\\sin(PM/2) = 1/3$: PM = 38.9°. Lecture 16 shows where that formula comes from.' },
      { t: 39, ans: true, title: '**Answers:** (a)(i) PM = 3.84° · (a)(ii) PM = 4.53° · (b) PM = 38.9°', say: 'Two poles close together under a big loop gain leave almost no margin: they need compensation (Lecture 17).' },
    ],
  });
}, { q: 'Mid-sem 2025 Q5' });

scene(L15, 'Razavi 10.1: the largest A0 for 60°', 50, (S) => {
  pyqFrame(S, {
    tag: 'LEC 15 · QUESTION 4 OF 5', title: 'Work the recipe backwards', src: 'Razavi Problem 10.1',
    q: 'An amplifier has two poles, at 10 MHz and 500 MHz, in unity-gain feedback. What $A_0$ gives a phase margin of exactly 60°?', qh: 180,
    tests: 'the PM recipe in reverse: choose the crossover from the phase, then the gain from the size.',
    fig: eqFig([['|\\beta A| = \\frac{A_0}{\\sqrt{1 + (f/f_{p1})^2}\\,\\sqrt{1 + (f/f_{p2})^2}}', 330, 30], ['\\angle\\beta A = -\\tan^{-1}\\tfrac{f}{f_{p1}} - \\tan^{-1}\\tfrac{f}{f_{p2}}', 470, 28, '#ffd38a']]),
    steps: [
      { t: 6, title: '**Work backwards from the phase.** PM = 60° means the loop phase at the crossover must be −120°: the two pole lags add up to 120°.', tex: '\\tan^{-1}\\frac{f_{GX}}{10\\,\\mathrm{MHz}} + \\tan^{-1}\\frac{f_{GX}}{500\\,\\mathrm{MHz}} = 180^\\circ - 60^\\circ = 120^\\circ' },
      { t: 11, title: '**Solve for the crossover.** First guess: the first pole gives 90°, the second 30°. Correct it: near 300 MHz the first pole gives 88.2°, so the second must give 31.8°.', tex: 'f_{GX} \\approx 500\\,\\mathrm{M}\\times\\tan30^\\circ = 289\\,\\mathrm{MHz},\\quad \\tan^{-1}\\frac{f_{GX}}{500\\,\\mathrm{M}} = 120^\\circ - 88.2^\\circ = 31.8^\\circ \\Rightarrow f_{GX} = 500\\,\\mathrm{M}\\times\\tan31.8^\\circ = 311\\,\\mathrm{MHz}',
        try: {
          q: 'First step: at what frequency $f_{GX}$ must the gain crossover sit for PM = 60°?',
          hint: ['PM = 60° means the two pole lags must add to 120° at $f_{GX}$. The first pole is far below, so it gives almost (not quite) 90°.', '$\\tan^{-1}\\frac{f_{GX}}{10\\,\\mathrm{M}} + \\tan^{-1}\\frac{f_{GX}}{500\\,\\mathrm{M}} = 120^\\circ$. Guess with 90° for the first pole, then correct it.'],
          how: [
            'PM = 60° means the total lag at the crossover is 120°. $$\\tan^{-1}\\frac{f_{GX}}{10\\,\\mathrm{M}} + \\tan^{-1}\\frac{f_{GX}}{500\\,\\mathrm{M}} = 120^\\circ$$',
            'First guess: the first pole gives 90°, so the second gives 30°. $$f_{GX} \\approx 500\\,\\mathrm{M}\\times\\tan30^\\circ = 289\\,\\mathrm{MHz}$$',
            'Correct it: at about 300 MHz the first pole gives only 88.2°, so the second must give 31.8°. $$f_{GX} = 500\\,\\mathrm{M}\\times\\tan31.8^\\circ = 311\\,\\mathrm{MHz}$$',
            'Check: $\\tan^{-1}31.1 + \\tan^{-1}0.621 = 88.2^\\circ + 31.8^\\circ = 120^\\circ$ ✓',
          ],
          why: 'Calculator Solver works too: solve atan(x/10) + atan(x/500) = 120 for x in MHz.',
          calc: [{ what: 'Crossover with the Solver (x in MHz, degree mode)', keys: '[HOME] ▸ Equation ▸ Solver:  tan⁻¹(x ÷ 10) + tan⁻¹(x ÷ 500) = 120, start 300', shows: 'x = 310.55  (MHz)', note: 'tan⁻¹ = [SHIFT] [tan]; = is [SHIFT] [(]. Check L−R ≈ 0.' }],
          parts: [
            { q: 'First guess: if the first pole gave a full 90°, where would the second pole give the remaining 30°?', answer: 500e6 * Math.tan(Math.PI / 6), unit: 'Hz', tol: 0.02,
              hint: ['$\\tan^{-1}(f/500\\,\\mathrm{M}) = 30^\\circ$.'],
              how: ['$$f \\approx 500\\,\\mathrm{M}\\times\\tan30^\\circ = 289\\,\\mathrm{MHz}$$'] },
            { q: 'Correction: the first pole’s actual lag near 300 MHz (10 MHz pole)?', answer: atD15(ans('bank-r10-1', 'fgx') / 10e6), unit: '°', tol: 0.005,
              hint: ['$\\tan^{-1}(f/10\\,\\mathrm{M})$ at about 300–311 MHz.'],
              how: ['$$\\tan^{-1}31 = 88.2^\\circ$$ so the second pole must give $120 - 88.2 = 31.8^\\circ$.'] },
          ],
          answer: ans('bank-r10-1', 'fgx'), unit: 'Hz', tol: 0.03,
        }, say: 'The first pole gives about 88°, so the second needs about 32°: $f_{GX}$ = 311 MHz.' },
      { t: 21, title: '**Make |βA| = 1 there.** With β = 1, $A_0$ must exactly cancel the two pole sizes at 311 MHz.', tex: 'A_0 = \\sqrt{1 + \\left(\\frac{311}{10}\\right)^2}\\,\\sqrt{1 + \\left(\\frac{311}{500}\\right)^2} = 31.07\\times1.177 = 36.6',
        try: {
          q: 'Now: what $A_0$ makes $f_{GX}$ = 311 MHz the gain crossover?',
          hint: ['The crossover is where $|\\beta A| = 1$, and β = 1. So $A_0$ must equal the product of the two pole sizes there.', '$A_0 = \\sqrt{1 + (f_{GX}/f_{p1})^2}\\,\\sqrt{1 + (f_{GX}/f_{p2})^2}$.'],
          how: [
            'At the crossover $|\\beta A| = 1$ with β = 1, so $A_0$ equals the product of the pole sizes. $$A_0 = \\sqrt{1 + (f_{GX}/f_{p1})^2}\\,\\sqrt{1 + (f_{GX}/f_{p2})^2}$$',
            'First pole: $f_{GX}/f_{p1} = 311/10 = 31.05$. $$\\sqrt{1 + 31.05^2} = 31.07$$',
            'Second pole: $f_{GX}/f_{p2} = 311/500 = 0.621$. $$\\sqrt{1 + 0.621^2} = 1.177$$',
            'Multiply. $$A_0 = 31.07\\times1.177 = 36.6$$',
          ],
          why: 'Backwards recipe: phase → crossover → gain. Two poles 50× apart allow only about 36 for 60°.',
          calc: [{ what: 'A0 in one line', keys: '√( 1 + ( 310.55 ÷ 10 ) [x²] ) × √( 1 + ( 310.55 ÷ 500 ) [x²] )', shows: '36.58' }],
          parts: [
            { q: 'Size of the first pole factor at 311 MHz: $\\sqrt{1 + (f_{GX}/f_{p1})^2}$?', answer: Math.hypot(1, ans('bank-r10-1', 'fgx') / 10e6), unit: '', tol: 0.01,
              hint: ['$f_{GX}/f_{p1} = 311/10$.'],
              how: ['$$\\sqrt{1 + 31.05^2} = 31.07$$'] },
            { q: 'Size of the second pole factor: $\\sqrt{1 + (f_{GX}/f_{p2})^2}$?', answer: Math.hypot(1, ans('bank-r10-1', 'fgx') / 500e6), unit: '', tol: 0.01,
              hint: ['$f_{GX}/f_{p2} = 311/500$.'],
              how: ['$$\\sqrt{1 + 0.621^2} = 1.177$$'] },
          ],
          answer: ans('bank-r10-1', 'a0'), unit: '', tol: 0.02,
        }, say: '$A_0$ = 36.6. Only 36: two poles 50 times apart leave very little room for gain at 60°.' },
      { t: 29, ans: true, title: '**Answer:** $A_0 ≈ 36.6$ (crossover $f_{GX}$ = 311 MHz)', say: 'Forwards: find the crossover, then the angles. Backwards: pick the angle, then the gain.' },
    ],
  });
}, { q: 'Razavi 10.1' });

scene(L15, 'Razavi 10.2: two equal poles, gain 1 and gain 4', 46, (S) => {
  pyqFrame(S, {
    tag: 'LEC 15 · QUESTION 5 OF 5', title: 'Equal poles share the phase', src: 'Razavi Problem 10.2',
    q: 'Two poles at the same frequency $\\omega_p$. Largest $A_0$ for a 60° phase margin when the closed-loop gain is (a) 1, (b) 4?', qh: 160,
    tests: 'splitting the allowed 120° between equal poles, and how β trades against $A_0$.',
    fig: eqFig([['|\\beta A| = \\frac{\\beta A_0}{1 + (\\omega/\\omega_p)^2},\\quad \\angle\\beta A = -2\\tan^{-1}\\tfrac{\\omega}{\\omega_p}', 380, 28, '#ffd38a']]),
    steps: [
      { t: 6, title: '**Where is the crossover?** PM = 60° allows 120° of lag; two equal poles share it, 60° each.', tex: '2\\tan^{-1}\\frac{\\omega_{GX}}{\\omega_p} = 120^\\circ \\Rightarrow \\frac{\\omega_{GX}}{\\omega_p} = \\tan60^\\circ = \\sqrt3' },
      { t: 11, title: '**Make |βA| = 1 at that crossover.** Each pole factor has size² $1 + 3 = 4$ there, so $\\beta A_0$ must be 4.', tex: '|\\beta A| = \\frac{\\beta A_0}{1 + (\\sqrt3)^2} = \\frac{\\beta A_0}{4} = 1 \\Rightarrow \\beta A_0 = 4,\\quad \\beta = 1:\\; A_0 = 4',
        try: {
          q: '**(a)** Closed-loop gain 1 (β = 1): what is the largest $A_0$?',
          hint: ['The crossover must sit at $\\omega_{GX} = \\sqrt3\\,\\omega_p$. Make the loop gain exactly 1 there.', '$|\\beta A| = \\frac{\\beta A_0}{1 + (\\omega_{GX}/\\omega_p)^2} = 1$ with $\\omega_{GX}/\\omega_p = \\sqrt3$.'],
          how: [
            'For 60° of margin the two equal poles may lag 60° each at the crossover. $$\\frac{\\omega_{GX}}{\\omega_p} = \\tan60^\\circ = \\sqrt3$$',
            'Two equal poles: the size is $\\beta A_0$ divided by $1 + (\\omega/\\omega_p)^2$. Set it to 1 at the crossover. $$|\\beta A| = \\frac{\\beta A_0}{1 + 3} = \\frac{\\beta A_0}{4} = 1 \\Rightarrow \\beta A_0 = 4$$',
            'Unity gain means β = 1. $$A_0 = \\frac{4}{1} = 4$$',
          ],
          why: 'Any more gain pushes the crossover past $\\sqrt3\\,\\omega_p$ and the margin drops below 60°.',
          answer: ans('bank-r10-2', 'a'), unit: '', tol: 0.01,
        }, say: '$\\beta A_0 = 4$: as a buffer, $A_0$ = 4.' },
      { t: 19, title: '**(b) Gain 4 means β = 1/4.** The margin depends only on $\\beta A_0$, which must still be 4, so $A_0$ can be four times larger.', tex: '\\beta A_0 = 4,\\quad \\beta = \\frac14 \\Rightarrow A_0 = \\frac{4}{1/4} = 16',
        try: {
          q: '**(b)** Closed-loop gain 4: what is the largest $A_0$ now?',
          hint: ['What is β for a closed-loop gain of 4? Does the phase-margin condition care about $A_0$ or about $\\beta A_0$?', 'The condition from (a) is $\\beta A_0 = 4$, with $\\beta = 1/4$.'],
          how: [
            'A closed-loop gain of 4 means the feedback factor is a quarter. $$\\beta = \\frac{1}{4}$$',
            'The PM condition from (a) only fixes the loop gain: the crossover must still be at $\\sqrt3\\,\\omega_p$. $$\\beta A_0 = 4$$',
            'Solve for $A_0$. $$A_0 = \\frac{4}{\\beta} = \\frac{4}{1/4} = 16$$',
          ],
          why: 'Trap: answering 4 again. Weaker feedback allows four times the open-loop gain.',
          answer: ans('bank-r10-2', 'b'), unit: '', tol: 0.01,
        }, say: 'Still $\\beta A_0 = 4$, so $A_0$ = 16. Weaker feedback allows four times the gain.' },
      { t: 26, ans: true, title: '**Answers:** (a) $A_0$ = 4 (β = 1) · (b) $A_0$ = 16 (β = 1/4) — both have $\\beta A_0 = 4$', say: 'The rule behind it: the margin depends on $\\beta A_0$, not on $A_0$ alone.' },
    ],
  });
}, { q: 'Razavi 10.2' });
