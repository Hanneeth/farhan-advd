/* Lesson D, Lecture 17: frequency compensation, dominant pole, Miller effect, pole splitting, the two-stage op amp, RHP zero, slewing. */
'use strict';
const L17 = 'Lec 17 · Frequency compensation';

scene(L17, 'The problem: 100 dB and three poles', 62, (S) => {
  header(S, 'LEC 17 · YOUR PAGE, TOP', 'Fine at high closed-loop gain, unstable as a buffer');
  pagePeek(S, 'n17a', 1060, 120, 470, 688, 0.3, 8);
  const A0 = 1e5, poles = [1e3, 1e6, 1e7];
  const B = bodePair(S, { x: 120, w: 820, y: 140, hm: 330, hp: 250, d0: 1, d1: 8, db0: 110, db1: -30, ph1: -270, mtitle: '20 log|A|' });
  B.g.style.opacity = 0; S.fade(B.g, 7, 0.6);
  const mc = S.el('polyline', { points: bodePts(B, (f) => dB(LG.mag(f, A0, poles)), B.fyM), fill: 'none', stroke: C.volt, 'stroke-width': 3.6 });
  const pc = S.el('polyline', { points: bodePts(B, (f) => LG.ph(f, poles), B.fyP), fill: 'none', stroke: C.amb, 'stroke-width': 3.4 });
  [mc, pc].forEach((e) => { e.style.opacity = 0; S.fade(e, 8, 0.6); });
  [[1e3, 'f_p1'], [1e6, 'f_p2'], [1e7, 'f_p3']].forEach(([f, s]) => { const e = txt(S, B.fxp(f) + 6, B.fyM(-18), s, { size: 17, color: C.muted }); e.style.opacity = 0; S.fade(e, 9, 0.5); });
  const bl = S.el('line', { x1: B.x0, x2: B.x0 + B.w, stroke: C.bad, 'stroke-width': 3 }), bt = txt(S, B.x0 + 10, 0, '', { size: 18, color: C.bad, weight: 700 });
  const gd = S.el('circle', { r: 9 }), dl = S.el('line', { 'stroke-width': 2, 'stroke-dasharray': '6 5' }), pmb = S.el('line', { 'stroke-width': 7 });
  const rd = [txt(S, 980, 840, '', { size: 22, mono: true, weight: 800 })];
  [bl, bt, gd, dl, pmb, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 10, 0.6); });
  const gAt = (t) => (t < 20 ? 80 : t < 34 ? lerp(80, 0, E.inout((t - 20) / 14)) : 0);
  S.anim(0, 1e4, 'bl', (_p, t) => {
    const g = gAt(t), beta = 10 ** (-g / 20), y = B.fyM(g);
    bl.setAttribute('y1', y); bl.setAttribute('y2', y); bt.setAttribute('y', y - 10); bt.textContent = ''; richText(bt, `20 log(1/β) = ${fx(g, 3)} dB`, 18);
    const gx = LG.gx(beta * A0, poles), x = B.fxp(gx), ph = LG.ph(gx, poles), ok = ph > -180, col = ok ? C.ok : C.bad;
    gd.setAttribute('cx', x); gd.setAttribute('cy', y); gd.setAttribute('fill', col);
    dl.setAttribute('x1', x); dl.setAttribute('x2', x); dl.setAttribute('y1', y); dl.setAttribute('y2', B.fyP(ph)); dl.setAttribute('stroke', col);
    pmb.setAttribute('x1', x); pmb.setAttribute('x2', x); pmb.setAttribute('y1', B.fyP(Math.max(ph, -270))); pmb.setAttribute('y2', B.fyP(-180)); pmb.setAttribute('stroke', col);
    rd[0].textContent = `PM = ${fx(180 + ph, 3)}°${ok ? '' : '  → oscillates'}`; rd[0].setAttribute('fill', col);
  }, E.lin);
  S.say(0.3, 'Lecture 17 opens with this plot on your page: an op amp with 100 dB of gain and three poles, and a red horizontal line at $20\\log(1/\\beta)$.');
  S.say(8, 'Remember the shortcut from Lecture 16: where the gain curve meets the line is the crossover, and the gap between them is the loop gain.');
  S.say(12, 'With the line high up, a big closed-loop gain, they meet before the second pole. The phase there is only about −90°: lots of margin.');
  S.say(20, 'Now lower the line, asking for less closed-loop gain. The meeting point slides right, past the second pole, past the third… and the phase there goes beyond −180°.');
  whyBox(S, 980, 380, 560, 260, '**The job of compensation:** make the loop gain fall to 1 **before** the phase gets dangerous, for every closed-loop gain you will use, down to 1 (the buffer). Two ways: lower the first pole (this lecture’s start), or Miller-split the poles (its end).', 36);
  S.say(36, 'So the amplifier works at high gain but oscillates as a buffer. Compensation means: make the loop gain fall to 1 before the phase gets dangerous, for every gain down to 1.');
});

scene(L17, 'Dominant-pole compensation: lift your foot early', 64, (S) => {
  header(S, 'LEC 17 · YOUR PAGE, THE GREEN DASHED LINE', 'Slide the first pole down until |βA| = 1 at the second pole');
  const A0 = 1e5, beta = 1, poles0 = [1e3, 1e6, 1e7];
  const B = bodePair(S, { x: 120, w: 820, y: 140, hm: 330, hp: 250, d0: 0, d1: 8, db0: 110, db1: -30, ph1: -270, mtitle: '20 log|βA| (β = 1)' });
  B.g.style.opacity = 0; S.fade(B.g, 0.3, 0.6);
  const old = S.el('polyline', { points: bodePts(B, (f) => dB(LG.mag(f, A0, poles0)), B.fyM), fill: 'none', stroke: C.dim, 'stroke-width': 2.4, 'stroke-dasharray': '7 6' });
  const mc = liveLine(S, C.volt, 3.8), pc = liveLine(S, C.amb, 3.4);
  const fpm = S.el('line', { stroke: C.ok, 'stroke-width': 2.4, 'stroke-dasharray': '6 5' }), fpt = txt(S, 0, 0, '', { size: 18, color: C.ok, weight: 800, anchor: 'middle' });
  const gd = S.el('circle', { r: 9, fill: C.ok }), pmb = S.el('line', { 'stroke-width': 7 });
  const rd = [txt(S, 990, 230, '', { size: 22, color: C.ok, mono: true, weight: 700 }), txt(S, 990, 268, '', { size: 21, color: C.text, mono: true }), txt(S, 990, 306, '', { size: 26, mono: true, weight: 800 })];
  [old, mc, pc, fpm, fpt, gd, pmb, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 1, 0.6); });
  const fdTarget = 1e6 / (beta * A0); // GX at the second pole → PM ≈ 45°
  const fAt = (t) => (t < 14 ? 1e3 : t < 30 ? 10 ** lerp(3, Math.log10(fdTarget), E.inout((t - 14) / 16)) : fdTarget);
  S.anim(0, 1e4, 'dom', (_p, t) => {
    const fp1 = fAt(t), poles = [fp1, 1e6, 1e7];
    mc.setAttribute('points', bodePts(B, (f) => dB(LG.mag(f, A0, poles)), B.fyM)); pc.setAttribute('points', bodePts(B, (f) => LG.ph(f, poles), B.fyP));
    fpm.setAttribute('x1', B.fxp(fp1)); fpm.setAttribute('x2', B.fxp(fp1)); fpm.setAttribute('y1', B.fyM(100) + 10); fpm.setAttribute('y2', B.yP + B.hp);
    fpt.setAttribute('x', B.fxp(fp1)); fpt.setAttribute('y', B.yP + B.hp + 52); fpt.textContent = ''; richText(fpt, `fp1 = ${fmtHz(fp1)}`, 18);
    const gx = LG.gx(A0, poles), ph = LG.ph(gx, poles), ok = ph > -180;
    gd.setAttribute('cx', B.fxp(gx)); gd.setAttribute('cy', B.fyM(0));
    pmb.setAttribute('x1', B.fxp(gx)); pmb.setAttribute('x2', B.fxp(gx)); pmb.setAttribute('y1', B.fyP(Math.max(ph, -270))); pmb.setAttribute('y2', B.fyP(-180)); pmb.setAttribute('stroke', ok ? C.ok : C.bad);
    rd[0].textContent = `first pole ${fmtHz(fp1)}`; rd[1].textContent = `crossover ${fmtHz(gx)}`; rd[2].textContent = `PM = ${fx(180 + ph, 3)}°`; rd[2].setAttribute('fill', ok ? C.ok : C.bad);
  }, E.lin);
  S.say(0.3, 'The first fix, the green dashed line on your page: <b>dominant-pole compensation</b>. Leave the fast poles alone and slide the first pole down, by adding capacitance at its node.');
  S.say(6, 'Think of driving towards that cliff: instead of trying to move the cliff, you take your foot off the accelerator early. The gain starts falling sooner, so it reaches 0 dB sooner, at a frequency where the other poles have barely started to bite.');
  S.say(14, 'Watch the first pole slide down. The whole sloping part of the curve slides left with it, the crossover moves left, and the margin grows.');
  eqAt(S, "f_{p1}' = \\frac{f_{GX}}{\\beta A_0}", 1200, 470, 30, { size: 40, w: 600, color: '#ffd38a' });
  S.say(30, 'Where to stop? Put the crossover on the second pole: that leaves 45°. From $\\beta A_0$ the gain falls 20 dB per decade down to 1 at $f_{GX}$, so the new first pole is $f_{GX}/(\\beta A_0)$: here 1 MHz over $10^5$, just 10 Hz.');
  whyBox(S, 990, 580, 560, 230, '**Razavi’s drawing trick:** start at the second pole on the 0 dB line and draw a −20 dB/decade line back up until it meets the flat gain. That meeting point is the new first pole. **The price:** the bandwidth, which has collapsed to 10 Hz.', 42);
  S.say(42, 'Razavi’s shortcut on the plot: from the second pole on the 0 dB line, draw a −20 dB per decade line back up to the flat gain. The price is obvious: the open-loop bandwidth is now only 10 Hz. The Miller capacitor does it far more cheaply.');
});

scene(L17, 'The Miller effect: a capacitor across a gain', 74, (S) => {
  header(S, 'LEC 17 · YOUR PAGE, MIDDLE', 'Both ends move, in opposite directions: Cc looks (1 + A2) times bigger');
  pagePeek(S, 'n17b', 1010, 120, 540, 549, 0.3);
  const A2 = 4;
  const g = S.g(); const r = S.into(g);
  wire(S, [[120, 420], [300, 420]]); dot(S, 300, 420); txt(S, 296, 458, 'node 1', { size: 19, color: C.p, weight: 700, anchor: 'middle' });
  wire(S, [[300, 420], [380, 420]]); amp(S, 380, 420, { label: '−A₂', pm: false, w: 170, h: 150 }); wire(S, [[550, 420], [660, 420]]); dot(S, 660, 420);
  txt(S, 664, 458, 'node 2', { size: 19, color: C.n, weight: 700, anchor: 'middle' });
  wire(S, [[300, 420], [300, 250], [465, 250]]); wire(S, [[495, 250], [660, 250], [660, 420]]);
  S.el('line', { x1: 465, y1: 222, x2: 465, y2: 278, stroke: C.amb, 'stroke-width': 4.4 }); S.el('line', { x1: 495, y1: 222, x2: 495, y2: 278, stroke: C.amb, 'stroke-width': 4.4 });
  txt(S, 480, 208, 'C_c', { size: 24, color: C.amb, weight: 800, anchor: 'middle' });
  r();
  S.draw(g, 8, 1.6);
  // meters: the two node voltages side by side
  const base = 600, U = 120, m1x = 210, m2x = 330;
  const mg = S.g();
  S.el('line', { x1: 150, x2: 400, y1: base, y2: base, stroke: C.muted, 'stroke-width': 1.6 }, mg);
  const b1 = S.el('rect', { x: m1x - 24, width: 48, rx: 5, fill: C.p, 'fill-opacity': 0.75 }, mg), b2 = S.el('rect', { x: m2x - 24, width: 48, rx: 5, fill: C.n, 'fill-opacity': 0.75 }, mg);
  const span = dynArrow(S, C.amb, 3, mg), span2 = dynArrow(S, C.amb, 3, mg);
  const stx = txt(S, 470, 0, '', { size: 21, color: C.amb, weight: 800 }, mg);
  const v1t = txt(S, m1x, 0, '', { size: 17, color: C.p, anchor: 'middle', weight: 700 }, mg), v2t = txt(S, m2x, 0, '', { size: 17, color: C.n, anchor: 'middle', weight: 700 }, mg);
  mg.style.opacity = 0; S.fade(mg, 12, 0.6);
  S.anim(0, 1e4, 'mil', (_p, t) => {
    const v = 0.9 * Math.sin(Math.max(0, t - 12) * 0.9) ** 2;
    const y1 = base - v * U, y2 = base + A2 * v * U * 0.5;
    b1.setAttribute('y', y1); b1.setAttribute('height', base - y1); b2.setAttribute('y', base); b2.setAttribute('height', y2 - base);
    span.set(440, (y1 + y2) / 2, 440, y1, 12); span2.set(440, (y1 + y2) / 2, 440, y2, 12);
    stx.setAttribute('y', (y1 + y2) / 2 + 7); stx.textContent = `(1 + A₂)v = ${fx((1 + A2) * v, 2)}`;
    v1t.setAttribute('y', y1 - 10); v1t.textContent = `node 1: +v = ${fx(v, 2)}`; v2t.setAttribute('y', y2 + 24); v2t.textContent = `node 2: −A₂v = −${fx(A2 * v, 2)}`;
  }, E.lin);
  // equivalent
  const eqv = S.g(); const re = S.into(eqv);
  txt(S, 1070, 720, 'Seen from each side:', { size: 21, color: C.text, weight: 700 });
  cap(S, 1110, 760); txt(S, 1140, 800, 'C_c(1 + A₂) at node 1', { size: 20, color: C.p, weight: 800 });
  cap(S, 1420, 760); txt(S, 1450, 800, 'C_c(1 + 1/A₂)', { size: 20, color: C.n, weight: 800 });
  re(); eqv.style.opacity = 0; S.fade(eqv, 48, 0.7);
  S.say(0.3, 'The cheap way to make a very low pole is on your page: put a capacitor $C_c$ across an inverting amplifier with gain $-A_2$. This is the <b>Miller effect</b>.');
  S.say(8, 'A capacitor’s current depends on the voltage <b>across</b> it, the difference between its two ends. Here both ends move.');
  S.say(12, 'Raise node 1 by $v$. The amplifier drives node 2 the opposite way, down by $A_2v$. The voltage across $C_c$ changes by $v + A_2v = (1 + A_2)v$.');
  S.say(24, 'Picture a rope tied between two people. If one steps up 1 metre while the other steps down 4, the rope stretches 5 metres, not 1. The capacitor has to swallow $(1 + A_2)$ times the charge a grounded one would.');
  S.say(38, 'So node 1, which only moved by $v$, feels a capacitor $(1 + A_2)$ times bigger. A small $C_c$ looks enormous from the input side.');
  S.say(48, 'Seen from node 1: $C_c(1 + A_2)$. Seen from node 2, which moves a lot, the extra is small: $C_c(1 + 1/A_2)$, about $C_c$. Exactly the two labels on your page.');
  S.say(60, 'One picofarad across a gain of 100 behaves like 101 picofarads at the input. That is how a tiny on-chip capacitor makes a very low dominant pole.');
});

scene(L17, 'Before and after: P1′ ≈ 1/(R1A2Cc), and pole splitting', 66, (S) => {
  header(S, 'LEC 17 · YOUR PAGE, AFTER COMPENSATION', 'Cc pushes P1 down and P2 up: the poles split apart');
  const R1 = 500e3, C1 = 0.1e-12, R2 = 50e3, C2 = 2e-12, Gm2 = 2e-3, A2 = Gm2 * R2;
  const polesOf = (cc) => {
    const a = R1 * R2 * (C1 * C2 + C2 * cc + C1 * cc), b = R1 * (C1 + (1 + A2) * cc) + R2 * (C2 + cc);
    const D = Math.sqrt(Math.max(0, b * b - 4 * a)); const s1 = (b - D) / (2 * a), s2 = (b + D) / (2 * a);
    return [s1 / (2 * Math.PI), s2 / (2 * Math.PI)];
  };
  const x0 = 140, w = 1300, y = 360, d0 = 3, d1 = 10, fxp = (f) => x0 + ((Math.log10(f) - d0) / (d1 - d0)) * w;
  const ax = S.g();
  S.el('line', { x1: x0, x2: x0 + w, y1: y, y2: y, stroke: C.muted, 'stroke-width': 2 }, ax);
  for (let d = d0; d <= d1; d++) { S.el('line', { x1: fxp(10 ** d), x2: fxp(10 ** d), y1: y - 8, y2: y + 8, stroke: C.muted, 'stroke-width': 1.6 }, ax); txt(S, fxp(10 ** d), y + 34, fmtHz(10 ** d), { size: 17, color: C.muted, anchor: 'middle' }, ax); }
  txt(S, x0, y - 74, 'pole frequencies (log axis)', { size: 19, color: C.muted }, ax);
  ax.style.opacity = 0; S.fade(ax, 0.3, 0.6);
  const mk = (col, lab) => { const g = S.g(); S.el('line', { x1: -12, y1: -12, x2: 12, y2: 12, stroke: col, 'stroke-width': 5 }, g); S.el('line', { x1: -12, y1: 12, x2: 12, y2: -12, stroke: col, 'stroke-width': 5 }, g); const t = txt(S, 0, -26, lab, { size: 19, color: col, weight: 800, anchor: 'middle' }, g); return Object.assign(g, { t }); };
  const P1 = mk(C.p, 'P1'), P2 = mk(C.n, 'P2');
  const rd = [txt(S, 140, 470, '', { size: 23, color: C.amb, mono: true, weight: 800 }), txt(S, 140, 510, '', { size: 21, color: C.p, mono: true }), txt(S, 140, 548, '', { size: 21, color: C.n, mono: true })];
  [P1, P2, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 2, 0.5); });
  const ccAt = (t) => (t < 14 ? 0 : t < 30 ? 10 ** lerp(-16, -12, E.inout((t - 14) / 16)) : 1e-12);
  S.anim(0, 1e4, 'split', (_p, t) => {
    const cc = ccAt(t); const [f1, f2] = polesOf(cc);
    P1.setAttribute('transform', `translate(${fxp(f1)} ${y})`); P2.setAttribute('transform', `translate(${fxp(f2)} ${y})`);
    rd[0].textContent = `Cc = ${cc < 1e-15 ? '0' : fx(cc * 1e12, 3) + ' pF'}`;
    rd[1].textContent = `P1 = ${fmtHz(f1)}`; rd[2].textContent = `P2 = ${fmtHz(f2)}`;
  }, E.lin);
  eqAt(S, 'P_1 = \\frac{1}{R_1C_1},\\quad P_2 = \\frac{1}{R_2C_2}\\quad(\\text{without})', 1150, 490, 4, { size: 26, w: 760 });
  eqAt(S, "P_1' = \\frac{1}{R_1[C_1 + (1 + A_2)C_c]} \\approx \\frac{1}{R_1A_2C_c}", 1150, 590, 18, { size: 28, w: 760, color: C.p });
  eqAt(S, "P_2' \\approx \\frac{G_{m2}}{C_2}\\;\\;(= G_{m2}/C_L)", 1150, 690, 30, { size: 28, w: 760, color: C.n });
  S.say(0.3, 'Now the two-stage amplifier on your page: stage 1 drives node 1 ($R_1$, $C_1$), stage 2 drives the output ($R_2$, $C_2$). Without $C_c$ each node gives a pole, and here they sit close together, around a megahertz: a recipe for ringing.');
  S.say(14, 'Add $C_c$ and grow it. Node 1 now carries $C_1 + (1 + A_2)C_c$: the first pole dives down, your page’s $P_1\' ≈ 1/(R_1A_2C_c)$.');
  S.say(30, 'And the second pole goes <b>up</b>. At high frequency $C_c$ acts like a wire from M6’s gate to its drain, so the output stage becomes a diode with resistance about $1/G_{m2}$, and the output pole jumps to about $G_{m2}/C_2$.');
  whyBox(S, 140, 640, 640, 200, '**Pole splitting:** one small capacitor moves the first pole down by about $A_2$ and the second up by a large factor. Far-apart poles are exactly what a 60° margin needs.', 42);
  S.say(42, 'That is <b>pole splitting</b>: one small capacitor pushes the poles far apart, P1 down to a few kilohertz and P2 up past a hundred megahertz. Far-apart poles are exactly what a good phase margin needs.');
});

scene(L17, 'Your page’s two-stage op amp (M1–M7)', 64, (S) => {
  header(S, 'LEC 17 · YOUR PAGE, THE CIRCUIT', 'Two high-resistance nodes: P (stage 1) and Q (the output)');
  pagePeek(S, 'n17c', 1000, 110, 560, 538, 0.3);
  const f = twoStageFig(S, { x: 20, y: 30, sc: 1.05 });
  S.draw(f.g, 7, 2.4);
  S.say(0.3, 'Here is that two-stage amplifier as a real circuit, the one on your page. Stage 1 is the five-transistor OTA from Lecture 2: input pair M1, M2, mirror load M3, M4, tail M5.');
  S.halo(150, 160, 480, 470, C.p, 10, 30, 'STAGE 1: 5-T OTA');
  S.say(10, 'Its output node P sees two big resistances in parallel, $r_{O2}$ and $r_{O4}$, and a small capacitance $C_1$.');
  S.halo(600, 160, 280, 470, C.n, 18, 30, 'STAGE 2: CS');
  S.say(18, 'Stage 2 is a common-source PMOS M6 with the current source M7 as its load. Its output Q, the op amp’s output, sees $r_{O6}\\parallel r_{O7}$ and the load $C_L$.');
  S.flow([[441, 366], [588, 366], [588, 293], [625, 293]], 22, 40, { color: C.cur, speed: 60 });
  S.flow([[692, 345], [692, 429], [790, 429]], 22, 40, { color: C.cur, speed: 60 });
  eqAt(S, 'P_1 = \\frac{1}{(r_{O2}\\parallel r_{O4})\\,C_1}', 1240, 700, 26, { size: 30, w: 600, color: C.p });
  eqAt(S, 'P_2 = \\frac{1}{(r_{O6}\\parallel r_{O7})\\,C_2}', 1240, 790, 30, { size: 30, w: 600, color: C.n });
  S.say(26, 'Two high-resistance nodes, two low poles: your page writes them in red, $P_1 = 1/((r_{O2}\\parallel r_{O4})C_1)$ and $P_2 = 1/((r_{O6}\\parallel r_{O7})C_2)$.');
  S.say(36, '$C_c$ goes from P to Q, across the inverting second stage: exactly the Miller picture. M6 is the $-A_2$ with $A_2 = g_{m6}(r_{O6}\\parallel r_{O7})$.');
  S.say(48, 'So for this circuit: $R_1 = r_{O2}\\parallel r_{O4}$, $R_2 = r_{O6}\\parallel r_{O7}$, $G_{m1} = g_{m1}$, $G_{m2} = g_{m6}$. Every two-stage question uses this dictionary.');
});

scene(L17, 'GBW = Gm1/Cc, and choosing Cc for the margin', 72, (S) => {
  header(S, 'LEC 17 · DESIGNING Cc', 'ωu = Gm1/Cc, ωp2 = Gm2/CL: choose Cc so they are far enough apart');
  const Gm1 = 0.5e-3, Gm2 = 5e-3, CL = 2e-12, A0 = 1e4;
  const B = bodePair(S, { x: 120, w: 760, y: 140, hm: 300, hp: 240, d0: 3, d1: 10, db0: 90, db1: -30, ph1: -180 });
  B.g.style.opacity = 0; S.fade(B.g, 0.3, 0.6);
  const mc = liveLine(S, C.volt, 3.8), pc = liveLine(S, C.amb, 3.4);
  const um = S.el('line', { stroke: C.ok, 'stroke-width': 2.2, 'stroke-dasharray': '6 5' }), p2m = S.el('line', { x1: B.fxp(Gm2 / (2 * Math.PI * CL)), x2: B.fxp(Gm2 / (2 * Math.PI * CL)), y1: B.y0, y2: B.yP + B.hp, stroke: C.n, 'stroke-width': 2.2, 'stroke-dasharray': '6 5' });
  const p2l = txt(S, B.fxp(Gm2 / (2 * Math.PI * CL)) + 8, B.y0 + 22, 'G_m2/C_L', { size: 17, color: C.n, weight: 700 });
  const pmb = S.el('line', { stroke: C.ok, 'stroke-width': 7 });
  const rd = [txt(S, 940, 200, '', { size: 23, color: C.amb, mono: true, weight: 800 }), txt(S, 940, 238, '', { size: 21, color: C.ok, mono: true }), txt(S, 940, 274, '', { size: 21, color: C.n, mono: true }), txt(S, 940, 316, '', { size: 27, mono: true, weight: 800 })];
  [mc, pc, um, p2m, p2l, pmb, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 1, 0.5); });
  const ccT = (Gm1 * CL * Math.tan(60 / DEG)) / Gm2;
  const ccAt = (t) => (t < 26 ? 0.1e-12 : t < 40 ? 10 ** lerp(-13, Math.log10(ccT), E.inout((t - 26) / 14)) : ccT);
  S.anim(0, 1e4, 'cc', (_p, t) => {
    const cc = ccAt(t), fu = Gm1 / (2 * Math.PI * cc), p2 = Gm2 / (2 * Math.PI * CL), poles = [fu / A0, p2];
    mc.setAttribute('points', bodePts(B, (f) => dB(LG.mag(f, A0, poles)), B.fyM)); pc.setAttribute('points', bodePts(B, (f) => LG.ph(f, poles), B.fyP));
    const gx = LG.gx(A0, poles), ph = LG.ph(gx, poles);
    um.setAttribute('x1', B.fxp(fu)); um.setAttribute('x2', B.fxp(fu)); um.setAttribute('y1', B.y0); um.setAttribute('y2', B.yP + B.hp);
    pmb.setAttribute('x1', B.fxp(gx)); pmb.setAttribute('x2', B.fxp(gx)); pmb.setAttribute('y1', B.fyP(ph)); pmb.setAttribute('y2', B.fyP(-180));
    rd[0].textContent = `Cc = ${fx(cc * 1e12, 3)} pF`; rd[1].textContent = `GBW = Gm1/(2πC_c) = ${fmtHz(fu)}`; rd[2].textContent = `P2 = Gm2/(2πC_L) = ${fmtHz(p2)}`;
    rd[3].textContent = `PM = ${fx(180 + ph, 3)}°`; rd[3].setAttribute('fill', 180 + ph >= 59 ? C.ok : C.amb);
  }, E.lin);
  eqAt(S, '\\text{above } P_1\':\\;\\; |A| = \\frac{G_{m1}}{\\omega C_c} \\;\\Rightarrow\\; \\omega_u = \\frac{G_{m1}}{C_c}', 1230, 430, 4, { size: 26, w: 680 });
  eqAt(S, 'PM = 90^\\circ - \\tan^{-1}\\frac{\\omega_u}{\\omega_{p2}} \\;\\Rightarrow\\; C_c = \\frac{G_{m1}C_L\\tan PM}{G_{m2}}', 1230, 530, 18, { size: 24, w: 700, color: '#ffd38a' });
  eqAt(S, '45^\\circ:\\; C_c = \\tfrac{G_{m1}}{G_{m2}}C_L \\qquad 60^\\circ:\\; C_c = 1.73\\,\\tfrac{G_{m1}}{G_{m2}}C_L', 1230, 620, 34, { size: 24, w: 700 });
  S.say(0.3, 'Now design it. Above the dominant pole, stage 1’s current $G_{m1}v_{in}$ simply charges $C_c$, so the gain is $G_{m1}/(\\omega C_c)$ and it reaches 1 at $\\omega_u = G_{m1}/C_c$. The GBW depends only on stage 1 and $C_c$.');
  S.say(12, 'The second pole sits at about $G_{m2}/C_L$. With β = 1 the first pole gives its full −90°, so the margin is 90° minus the second pole’s angle at $\\omega_u$.');
  S.say(18, 'Solve for $C_c$: $C_c = G_{m1}C_L\\tan PM/G_{m2}$. Too small a $C_c$, as now, puts $\\omega_u$ right next to the second pole: a poor margin.');
  S.say(26, 'Grow $C_c$: the GBW slides left, away from P2, which stays put, and the margin climbs… until $C_c$ = 0.35 pF gives exactly 60°.');
  S.say(42, 'Two versions to memorise: 45° needs $C_c = (G_{m1}/G_{m2})C_L$, and 60° needs 1.73 times that. A bigger $G_{m2}$ (a stronger output stage) lets you use a smaller $C_c$ and keep more bandwidth.');
  whyBox(S, 940, 690, 620, 160, '**Allen’s rule** used in the papers: RHP zero at 10× GBW (so $g_{m6} = 10g_{m1}$) and 60° → $C_c \\ge 0.22\\,C_L$.', 54);
  S.say(54, 'The papers often use Allen’s version: put the right-half-plane zero (next scene) at 10 times the GBW, which means $g_{m6} = 10g_{m1}$, and then 60° needs $C_c \\ge 0.22\\,C_L$.');
});

scene(L17, 'The full transfer function and the RHP zero', 74, (S) => {
  header(S, 'LEC 17 · YOUR PAGE, BOTTOM', '(1 − sCc/Gm2): a zero in the right half plane');
  eqAt(S, '\\frac{V_{out}}{V_{in}}(s) = \\frac{G_{m1}G_{m2}R_1R_2\\left(1 - s\\frac{C_c}{G_{m2}}\\right)}{1 + s[\\{C_1 + (1 + G_{m2}R_2)C_c\\}R_1 + R_2(C_2 + C_c)] + s^2R_1R_2(C_1C_2 + C_2C_c + C_1C_c)}', 800, 190, 0.4, { size: 22, w: 1400, h: 90 });
  eqAt(S, 'D = \\left(1 + \\frac{s}{\\omega_{p1}}\\right)\\left(1 + \\frac{s}{\\omega_{p2}}\\right) \\approx 1 + \\frac{s}{\\omega_{p1}} + \\frac{s^2}{\\omega_{p1}\\omega_{p2}}', 800, 290, 6, { size: 24, w: 1200 });
  S.say(0.4, 'Your page ends with the full transfer function of the compensated two-stage op amp. Do not panic: the denominator is just the two poles in disguise.');
  S.say(6, 'Match it with $(1 + s/\\omega_{p1})(1 + s/\\omega_{p2})$, with the poles far apart. The $s$ term gives $\\omega_{p1} ≈ 1/(R_1G_{m2}R_2C_c)$, the Miller pole. Dividing the $s^2$ term by it gives $\\omega_{p2} ≈ G_{m2}/C_2$ when $C_c$ is large. Pole splitting, in algebra.');
  // two currents into Q
  const g = S.g(); const r = S.into(g);
  dot(S, 200, 520); txt(S, 190, 512, 'P', { size: 22, color: C.bad, weight: 800, anchor: 'end' });
  wire(S, [[200, 520], [300, 520]]); pmos(S, 360, 520, { name: 'M6', gl: 30 }); rail(S, 330, 400, 455, 'V_DD'); wire(S, [[360, 455], [360, 470]]);
  wire(S, [[200, 520], [200, 400], [330, 400]]);
  S.el('line', { x1: 330, y1: 380, x2: 330, y2: 420, stroke: C.amb, 'stroke-width': 4 }); S.el('line', { x1: 344, y1: 380, x2: 344, y2: 420, stroke: C.amb, 'stroke-width': 4 });
  txt(S, 337, 370, 'C_c', { size: 19, color: C.amb, weight: 800, anchor: 'middle' });
  wire(S, [[344, 400], [520, 400], [520, 640]]); wire(S, [[360, 570], [360, 640], [520, 640]]); dot(S, 520, 640); txt(S, 534, 648, 'Q', { size: 22, color: C.bad, weight: 800 });
  r(); g.style.opacity = 0; S.fade(g, 16, 0.6);
  const bars = S.g();
  const bx = 620, by1 = 470, by2 = 570, U = 200;
  txt(S, bx, by1 - 24, 'current from M6:  G_m2·v  (pulls Q down)', { size: 19, color: C.n }, bars);
  txt(S, bx, by2 - 24, 'current through C_c:  ωC_c·v  (pushes Q up)', { size: 19, color: C.amb }, bars);
  const r1 = S.el('rect', { x: bx, y: by1, height: 26, rx: 5, fill: C.n }, bars), r2 = S.el('rect', { x: bx, y: by2, height: 26, rx: 5, fill: C.amb }, bars);
  const net = txt(S, bx, 660, '', { size: 23, weight: 800, mono: true }, bars);
  bars.style.opacity = 0; S.fade(bars, 16, 0.6);
  const fAt = (t) => (t < 18 ? 0.1 : t < 32 ? 10 ** lerp(-1, 0, E.inout((t - 18) / 14)) : t < 40 ? 1 : 10 ** lerp(0, 0.6, clamp((t - 40) / 6, 0, 1)));
  S.anim(0, 1e4, 'zero', (_p, t) => {
    const x = fAt(t); r1.setAttribute('width', U); r2.setAttribute('width', Math.min(U * 2.3, U * x));
    const nz = Math.abs(1 - x) < 0.03;
    net.textContent = nz ? 'equal and opposite → no output: a ZERO at ω = G_m2/C_c' : `frequency = ${fx(x, 2)} × Gm2/Cc`;
    net.setAttribute('fill', nz ? C.bad : C.text);
  }, E.lin);
  S.say(16, 'The new thing is in the numerator: $(1 - sC_c/G_{m2})$. Where does it come from? Node P drives the output Q along <b>two</b> paths.');
  S.say(22, 'The main path: M6 turns $v$ into a current $G_{m2}v$ pulling Q down. The sneak path: $C_c$ passes a current $\\omega C_cv$ straight across, pushing Q up, the opposite sign.');
  S.say(30, 'As frequency rises the sneak current grows. At $\\omega = G_{m2}/C_c$ the two are equal and opposite and nothing reaches the output: a zero. Because of the minus sign it sits in the <b>right</b> half plane.');
  whyBox(S, 1100, 380, 450, 300, '**Why it hurts twice:** a right-half-plane zero makes the gain fall **slower** (like a normal zero) but adds phase **lag** (like a pole): $-\\tan^{-1}(\\omega/\\omega_z)$. It eats phase margin.', 42);
  S.say(42, 'A right-half-plane zero is double trouble: it slows the fall of the gain, like a zero, but it adds phase lag, like a pole. In a PM calculation it is one more angle to subtract.');
  eqAt(S, 'PM = 90^\\circ - \\tan^{-1}\\frac{\\omega_u}{\\omega_{p2}} - \\tan^{-1}\\frac{\\omega_u}{\\omega_z}', 1320, 740, 52, { size: 24, w: 560, color: '#ffd38a' });
  eqAt(S, '\\omega_z = \\frac{1}{C_c(1/G_{m2} - R_z)}:\\;\\; R_z = \\frac{1}{G_{m2}} \\Rightarrow \\omega_z \\to \\infty', 560, 800, 60, { size: 24, w: 900, color: C.ok });
  S.say(52, 'So the full margin of a two-stage op amp: 90°, minus the second pole’s angle, minus the zero’s angle, all at $\\omega_u$.');
  S.say(60, 'The fix: a resistor $R_z$ in series with $C_c$ weakens the sneak path. The zero moves to $1/(C_c(1/G_{m2} - R_z))$, and with $R_z = 1/G_{m2}$ it disappears to infinity.');
});

scene(L17, 'Slew rate of the two-stage op amp', 52, (S) => {
  header(S, 'LEC 17 → EXAMS · SLEWING', 'The tail current charges Cc: SR = I5/Cc (unless M7 runs out first)');
  const f = twoStageFig(S, { x: 0, y: 40, sc: 0.95 });
  f.g.style.opacity = 0; S.fade(f.g, 0.3, 0.7);
  S.flow([[304, 543], [304, 496], [209, 496], [209, 420]], 6, 40, { color: C.cur, speed: 70, w: 4 });
  const X0 = 960, Y0 = 640, W = 560, H = 360;
  const ax = axes(S, X0, Y0, W, H, { x: 'time', y: 'V_out' }); ax.style.opacity = 0; S.fade(ax, 8, 0.5);
  tracePlot(S, (tt) => Math.min(tt, 3) * 0.33, (tt) => X0 + tt * 120, (v) => Y0 - v * 300, 10, 18, C.cur, 4.5);
  const sl = txt(S, X0 + 30, Y0 - 250, 'slope = I₅ / C_c', { size: 22, color: C.cur, weight: 800 }); sl.style.opacity = 0; S.fade(sl, 16, 0.5);
  S.say(0.3, 'Slewing in the two-stage op amp, needed by both mid-sem questions. Give the input a big step: the pair steers completely and all of the tail current $I_5$ flows one way.');
  S.say(8, 'Node P barely moves, because the output stage around $C_c$ holds it, so that whole current goes into $C_c$. The output then ramps at $I_5/C_c$.');
  eqAt(S, 'SR = \\min\\left(\\frac{I_5}{C_c},\\;\\frac{I_7 - I_5}{C_L}\\right)', 1240, 200, 20, { size: 34, w: 600, color: '#ffd38a' });
  S.say(20, 'But the output stage must also charge $C_L$ at that rate, and on a falling edge M7 can only sink its bias current, of which $I_5$ is already going into $C_c$. So $(I_7 - I_5)/C_L$ is a second limit; the smaller one wins.');
  whyBox(S, 940, 690, 620, 150, '**Design use (2025 mid-sem):** the slew rate fixes the tail current: $I_5 = SR \\times C_c$.', 34);
  S.say(34, 'In design questions read it backwards: once $C_c$ is chosen, the slew-rate spec fixes the tail current, $I_5 = SR \\times C_c$.');
});

scene(L17, 'Lecture 17 in one card', 30, (S) => {
  header(S, 'LEC 17 · REMEMBER', 'Everything from Lecture 17');
  remember(S, [
    'Line at $20\\log(1/\\beta)$; lower line (less gain) → later crossing → less PM. The buffer is the hardest case.',
    'Dominant pole: $f_{p1}\' = f_{GX}/(\\beta A_0)$, crossover on $f_{p2}$ → 45°. Costs bandwidth.',
    'Miller: $C_c$ across $-A_2$ looks like $C_c(1+A_2)$ at the input, $C_c(1 + 1/A_2)$ at the output.',
    '$P_1\' = 1/(R_1[C_1 + (1+A_2)C_c]) ≈ 1/(R_1A_2C_c)$, $P_2\' ≈ G_{m2}/C_L$: pole splitting. Two-stage: $R_1 = r_{O2}\\parallel r_{O4}$, $R_2 = r_{O6}\\parallel r_{O7}$.',
    '$\\omega_u = G_{m1}/C_c$; $PM = 90° - \\tan^{-1}(\\omega_u/\\omega_{p2}) - \\tan^{-1}(\\omega_u/\\omega_z)$; $C_c = G_{m1}C_L\\tan PM/G_{m2}$; Allen: $C_c \\ge 0.22C_L$.',
    'RHP zero $\\omega_z = G_{m2}/C_c$ (lags like a pole); $R_z = 1/G_{m2}$ removes it. $SR = \\min(I_5/C_c,\\,(I_7 - I_5)/C_L)$.',
  ], 0.4, 'Lecture 17 · remember');
  S.say(0.4, 'Read it once. Now every compensation question, including the two biggest mid-sem questions.');
});

/* ── questions ── */
/* intermediates for the step-by-step parts, computed from the same givens as the bank answers */
const IM = (() => {
  const at = (x) => Math.atan(x) * DEG;
  // PS2 P3 (a): crossover of βA = 10⁴ with poles 1 kHz, 1 MHz, 10 MHz
  const g = (f) => 1e4 / Math.hypot(1, f / 1e3) / Math.hypot(1, f / 1e6) / Math.hypot(1, f / 1e7);
  let lo = 1e5, hi = 1e8; for (let i = 0; i < 80; i++) { const m = Math.sqrt(lo * hi); if (g(m) > 1) lo = m; else hi = m; }
  const p3 = { fgx: lo, a1: at(lo / 1e3), a2: at(lo / 1e6), a3: at(lo / 1e7) };
  // Quiz 2 2024 Q1
  const q1 = { a0: 1e4, ap: at(159 / 740), az: at(159 / 3180), gm2: 2 * Math.PI * 740e6 * 5e-12 };
  // Mid-sem 2023 Q5 (b)
  const q5 = { ratio: 10, tan: Math.tan((45 - at(0.1)) / DEG) };
  // Mid-sem 2024 Q2
  const id1 = 10e-6, i7 = 80e-6, gm1 = Math.sqrt(2 * 50e-6 * 10 * id1), gm7 = Math.sqrt(2 * 100e-6 * 80 * i7);
  const ro2 = 1 / (0.2 * id1), ro4 = 1 / (0.1 * id1), r1 = 1 / (1 / ro2 + 1 / ro4), r2 = 1 / (0.1 * i7 + 0.2 * i7);
  const gbw = ans('pyq-m24-q2', 'gbw');
  const m24 = { i5: 20e-6, gm1, ro2, ro4, a1: gm1 * r1, r2, a2: gm7 * r2, ap: at(gbw / ans('pyq-m24-q2', 'fp2')), az: at(gbw / ans('pyq-m24-q2', 'fz')) };
  // PS2 P4
  const cc4 = ans('bank-ps2-p4', 'cc');
  const p4 = { wu: 0.8e-3 / cc4, a2: 4e-3 * 20e3, ceff: 4e-3 * 20e3 * cc4, sr1: 120e-6 / cc4, sr2: (500e-6 - 120e-6) / 4e-12 };
  // Mid-sem 2025 Q2
  const M = (k) => ans('pyq-m25-q2', k);
  const ang = 90 - 60 - at(0.1), g1 = 2 * Math.PI * 50e6 * M('cc'), vov1 = Math.sqrt(2 * (M('i') / 2) / (300e-6 * M('wl1')));
  const m25 = { ang, ratio: 1 / (10 * Math.tan(ang / DEG)), gm1: g1, id1: M('i') / 2, vov3: 1.8 - 1.6 - 0.51 + 0.47, vov1, vov5: 0.9 - vov1 - 0.59, gm7: 10 * g1, i7: 0.5 * 60e-6 * M('wl7') * 0.16 ** 2 };
  return { p3, q1, q5, m24, p4, m25 };
})();
scene(L17, 'Past tutorial Ex 5–6: dominant pole for gains down to 20 dB', 52, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 1 OF 9', title: 'Two ways to compensate one amplifier', src: 'Past tutorial 2024-25 T2 Ex 5–6',
    q: 'First pole 1 MHz, DC gain 100 dB, second pole 10 MHz. (Ex 5) Where must a <b>new</b> dominant pole go to be stable for closed-loop gains down to 20 dB? (Ex 6) Instead, lower the first pole (second pole unchanged): to what frequency, and by what factor must that node’s capacitance grow?', qh: 250,
    giv: 'Stable means PM ≈ 45°: the loop gain reaches 1 at the next pole (the rule this tutorial uses).',
    tests: 'the dominant-pole rule $f_D = f_{GX}/(\\beta A_0)$ in its two versions.',
    fig: eqFig([['20\\,\\mathrm{dB} \\Rightarrow \\beta = 0.1,\\;\\; \\beta A_0 = 10^4', 290, 30], ['f_D = \\frac{f_{GX}}{\\beta A_0}', 410, 38, '#ffd38a'], ['\\text{Ex 5: } f_{GX} = 1\\,\\mathrm{MHz};\\;\\; \\text{Ex 6: } f_{GX} = 10\\,\\mathrm{MHz}', 530, 26]]),
    steps: [
      {
        t: 6, title: '**Ex 5: add a new pole below everything.** The lowest gain (20 dB) is the worst case, so β = 0.1 and βA₀ = 10⁴. The loop gain must fall to 1 exactly at the next pole up, the old 1 MHz pole.',
        tex: 'f_D = \\frac{f_{GX}}{\\beta A_0} = \\frac{1\\,\\mathrm{MHz}}{10^4} = 100\\,\\mathrm{Hz}',
        try: {
          q: '**Ex 5.** We add a brand-new dominant pole and keep all the old poles. Where must it go so the amplifier is stable for closed-loop gains down to 20 dB?',
          answer: ans('pyq-t24-ex56', 'fd'), unit: 'Hz', tol: 0.01,
          hint: ['The worst case is the lowest gain, 20 dB: turn it into β. Then the loop gain $\\beta A$ must fall at −20 dB/dec from the new pole and reach 1 exactly at the next pole up (here the old 1 MHz pole).', 'Formula: $f_D = \\dfrac{f_{GX}}{\\beta A_0}$ with $\\beta = \\dfrac{1}{\\text{closed-loop gain}}$.'],
          how: [
            'Worst case = lowest closed-loop gain. 20 dB is a gain of 10, so $$\\beta = \\frac{1}{10} = 0.1$$',
            'Loop gain at DC (100 dB is $10^5$): $$\\beta A_0 = 0.1\\times 10^5 = 10^4$$',
            'The new pole is the lowest one, so the next pole up is the old first pole: the crossover must land there. $$f_{GX} = 1\\,\\mathrm{MHz}$$',
            'Falling 20 dB per decade, $10^4$ needs 4 decades to reach 1, so the new pole sits 4 decades below the crossover: $$f_D = \\frac{f_{GX}}{\\beta A_0} = \\frac{1\\,\\mathrm{MHz}}{10^4} = 100\\,\\mathrm{Hz}$$',
          ],
          why: 'Dominant pole: $f_D = f_{GX}/(\\beta A_0)$, where $f_{GX}$ is the next pole above it.',
        },
        say: '1 MHz over $10^4$: 100 Hz.',
      },
      {
        t: 15, title: '**Ex 6: lower the existing first pole instead.** The 1 MHz pole is no longer in the way, so the crossover can sit on the next pole, 10 MHz.',
        tex: "f'_{p1} = \\frac{f_{GX}}{\\beta A_0} = \\frac{10\\,\\mathrm{MHz}}{10^4} = 1\\,\\mathrm{kHz}",
        try: {
          q: '**Ex 6.** Instead of adding a pole, we move the existing 1 MHz pole down (the 10 MHz pole stays). To what frequency must it go? (Same worst case as Ex 5: $\\beta A_0 = 10^4$.)',
          answer: ans('pyq-t24-ex56', 'fp1'), unit: 'Hz', tol: 0.01,
          hint: ['Same rule as Ex 5. Ask: after the move, which pole is the next one above it? The crossover goes there.', "$f'_{p1} = \\dfrac{f_{p2}}{\\beta A_0}$"],
          how: [
            "After the move only two poles are left: the new $f'_{p1}$ and the untouched 10 MHz pole. For 45° the crossover sits on the 10 MHz pole. $$f_{GX} = f_{p2} = 10\\,\\mathrm{MHz}$$",
            "The loop gain at DC is still $10^4$ (Ex 5), so the pole sits 4 decades below the crossover: $$f'_{p1} = \\frac{f_{GX}}{\\beta A_0} = \\frac{10\\,\\mathrm{MHz}}{10^4} = 1\\,\\mathrm{kHz}$$",
            'Compare with Ex 5: 1 kHz instead of 100 Hz, so ten times more bandwidth.',
          ],
          why: 'Moving an existing pole beats adding one: the crossover can use the next pole up.',
        },
        say: '1 kHz: ten times more bandwidth than Ex 5, because the old first pole is gone.',
      },
      {
        t: 23, title: '**The capacitor sets the pole.** A pole is $1/(2\\pi RC)$; with the same R, a pole 1000 times lower needs 1000 times the C.',
        tex: "\\frac{C_{new}}{C_{old}} = \\frac{f_{p1}}{f'_{p1}} = \\frac{1\\,\\mathrm{MHz}}{1\\,\\mathrm{kHz}} = 1000",
        try: {
          q: 'Ex 6, second half: the pole moved from 1 MHz down to your answer above. By what factor must the capacitance at that node grow? (Its resistance does not change.)',
          answer: ans('pyq-t24-ex56', 'cf'), unit: '×', tol: 0.01,
          hint: ['A pole is $1/(2\\pi RC)$. With R fixed, the pole frequency and C are inversely proportional.', "$\\dfrac{C_{new}}{C_{old}} = \\dfrac{f_{p1}}{f'_{p1}}$"],
          how: [
            'The pole is one over RC, and R stays the same, so C goes as one over the pole frequency: $$f_p = \\frac{1}{2\\pi RC} \\;\\Rightarrow\\; C \\propto \\frac{1}{f_p}$$',
            "So C grows by the same factor the pole falls: $$\\frac{C_{new}}{C_{old}} = \\frac{f_{p1}}{f'_{p1}} = \\frac{1\\,\\mathrm{MHz}}{1\\,\\mathrm{kHz}} = 1000$$",
            'A capacitor 1000 times bigger does not fit on a chip: that is why the Miller effect is used to multiply a small one.',
          ],
          why: 'Pole ∝ 1/C: lower the pole by a factor k → multiply C by k.',
        },
        say: '1000 times the capacitance. That is why we use Miller: a capacitor 1000 times bigger is impossible on chip.',
      },
      { t: 31, ans: true, title: "**Answers:** Ex 5: $f_D$ = 100 Hz · Ex 6: $f'_{p1}$ = 1 kHz, capacitance × 1000", say: 'Lowering an existing pole beats adding a new one.' },
    ],
  });
}, { q: 'Past tutorial Ex 5–6' });

scene(L17, 'Problem Set 2 P3: compensate your page’s amplifier', 56, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 2 OF 9', title: '100 dB, poles at 1 kHz, 1 MHz, 10 MHz, gain 10', src: 'Problem Set 2 P3',
    q: 'Your Lec 17 amplifier: $A_0$ = 100 dB, poles at 1 kHz, 1 MHz and 10 MHz, closed-loop gain 10 (β = 0.1). (a) PM as built. (b) Keeping the 1 MHz and 10 MHz poles, where must the first pole go for PM = 45°? (c) By what factor must its capacitor grow?', qh: 240,
    tests: 'the PM recipe with three poles, then dominant-pole compensation with two remaining poles.',
    fig: eqFig([['\\beta A_0 = 10^4', 270, 32], ['\\tan^{-1}\\frac{f}{1\\,\\mathrm{M}} + \\tan^{-1}\\frac{f}{10\\,\\mathrm{M}} = 45^\\circ', 390, 28], ["f'_{p1} = \\frac{f_{GX}}{\\beta A_0}", 510, 34, '#ffd38a']]),
    steps: [
      {
        t: 6, title: '**(a) Find the crossover, then add up the three pole angles.** With βA₀ = 10⁴ the loop gain only reaches 1 at about 3 MHz, past both high poles.',
        tex: 'f_{GX} \\approx 3.01\\,\\mathrm{MHz},\\quad PM = 180^\\circ - (89.98^\\circ + 71.65^\\circ + 16.78^\\circ) = 1.6^\\circ',
        try: {
          q: '(a) The amplifier as built, used with β = 0.1. What is its phase margin?',
          answer: ans('bank-ps2-p3', 'pm0'), unit: '°', tol: 0.1, abs: 0.3,
          parts: [
            { q: 'Loop gain at DC, $\\beta A_0$ (V/V)?', answer: 1e4, unit: '', tol: 0.01, hint: '100 dB = $10^5$; multiply by β.', how: ['$$\\beta A_0 = 0.1\\times 10^5 = 10^4$$'] },
            { q: 'Crossover $f_{GX}$, where $|\\beta A| = 1$ (Hz)?', answer: IM.p3.fgx, unit: 'Hz', tol: 0.03, hint: ['Only the 1 kHz pole would put it at 10 MHz; the 1 MHz pole makes it come earlier. Try 3 MHz.', '$\\dfrac{10^4}{\\sqrt{1 + (f/1\\mathrm{k})^2}\\sqrt{1 + (f/1\\mathrm{M})^2}\\sqrt{1 + (f/10\\mathrm{M})^2}} = 1$'], how: ['$$|\\beta A(3.01\\,\\mathrm{MHz})| = \\frac{10^4}{3010\\times 3.17\\times 1.04} \\approx 1$$'] },
            { q: 'Phase lag of the 1 MHz pole at $f_{GX}$ (degrees)?', answer: IM.p3.a2, unit: '°', tol: 0.01, hint: '$\\tan^{-1}(f_{GX}/1\\,\\mathrm{MHz})$; the 1 kHz pole gives ≈ 90°.', how: ['$$\\tan^{-1}(3.01) = 71.65^\\circ$$ (and the 1 kHz pole: $\\tan^{-1}(3010) = 89.98^\\circ$)'] },
            { q: 'Phase lag of the 10 MHz pole at $f_{GX}$ (degrees)?', answer: IM.p3.a3, unit: '°', tol: 0.02, hint: '$\\tan^{-1}(f_{GX}/10\\,\\mathrm{MHz})$', how: ['$$\\tan^{-1}(0.301) = 16.78^\\circ$$'] },
          ],
          hint: ['First find the crossover $f_{GX}$ where $|\\beta A| = 1$ (start from βA₀ = 10⁴; the gain falls ×10 per decade after 1 kHz, faster after 1 MHz). Then add the three pole angles there.', '$PM = 180^\\circ - \\tan^{-1}\\frac{f_{GX}}{1\\,\\mathrm{k}} - \\tan^{-1}\\frac{f_{GX}}{1\\,\\mathrm{M}} - \\tan^{-1}\\frac{f_{GX}}{10\\,\\mathrm{M}}$'],
          how: [
            'Loop gain at DC: $$\\beta A_0 = 0.1\\times 10^5 = 10^4$$',
            'Find where $|\\beta A| = 1$. With only the 1 kHz pole it would be at 10 MHz; the 1 MHz pole makes it fall faster. Trying values (or the Solver): $$|\\beta A(3.01\\,\\mathrm{MHz})| = \\frac{10^4}{3010\\times 3.17\\times 1.04} \\approx 1$$',
            'Each pole’s lag at $f_{GX}$: $$\\tan^{-1}(3010) = 89.98^\\circ,\\; \\tan^{-1}(3.01) = 71.65^\\circ,\\; \\tan^{-1}(0.301) = 16.78^\\circ$$',
            'The total lag is 178.4°, so almost nothing is left before 180°: $$PM = 180^\\circ - 178.4^\\circ = 1.6^\\circ$$',
          ],
          why: 'Small β (gain 10) pushes the crossover past both high poles: the amplifier would ring for ages.',
          calc: [
            { what: 'Crossover with the Solver', keys: '[HOME] ▸ Equation ▸ Solver: 10000 ÷ ( √(1+(x÷1k)[x²]) × √(1+(x÷1M)[x²]) × √(1+(x÷10M)[x²]) ) [SHIFT][(] 1, start 3M, [EXE]', shows: 'x = 3.0145M', note: 'x is [SHIFT] [0]; the Solver keeps the root in x.' },
            { what: 'PM using that x (degree mode)', keys: '180 − [SHIFT][tan] x ÷ 1k ) − [SHIFT][tan] x ÷ 1M ) − [SHIFT][tan] x ÷ 10M ) [EXE]', shows: '1.595' },
          ],
        },
        say: 'The crossover is at 3 MHz, where the three poles have used 178.4°: PM = 1.6°. It would ring for ages.',
      },
      { t: 16, title: '**(b) The new first pole will take its full 90°**, so the two high poles may use only 90° − 45° = 45° between them. Solve for the frequency where that happens.', tex: stepTex('bank-ps2-p3', 1), say: 'The new first pole will give 90°, so the other two may use 45° between them: that happens at 844 kHz.' },
      {
        t: 23, title: '**Slide down at −20 dB/dec** from βA₀ = 10⁴ at the new pole to 1 at 844 kHz: the new first pole sits 4 decades below the crossover.',
        tex: "f'_{p1} = \\frac{f_{GX}}{\\beta A_0} = \\frac{844\\,\\mathrm{kHz}}{10^4} = 84.4\\,\\mathrm{Hz}",
        try: {
          q: '(b) For PM = 45° the crossover must be at 844 kHz (step 2: there the 1 MHz and 10 MHz poles together lag 45°). Where must the first pole go?',
          answer: ans('bank-ps2-p3', 'fd'), unit: 'Hz', tol: 0.03,
          hint: ['Below the crossover only the first pole matters: the loop gain falls 20 dB/dec from βA₀ at the new pole down to 1 at $f_{GX}$.', "$f'_{p1} = \\dfrac{f_{GX}}{\\beta A_0}$"],
          how: [
            'Why 844 kHz: the new first pole gives 90°, so the other two may share 45°: $$\\tan^{-1}(0.844) + \\tan^{-1}(0.0844) = 40.16^\\circ + 4.82^\\circ \\approx 45^\\circ$$',
            "The loop gain must drop from $10^4$ to 1 between the new pole and 844 kHz, which is 4 decades: $$f'_{p1} = \\frac{f_{GX}}{\\beta A_0} = \\frac{844\\,\\mathrm{kHz}}{10^4} = 84.4\\,\\mathrm{Hz}$$",
            'Use βA₀ = 10⁴, not A₀ = 10⁵: that slip gives 8.44 Hz, ten times too low.',
          ],
        },
        say: '84.4 Hz.',
      },
      {
        t: 31, title: '**(c) Pole ∝ 1/C.** The resistance is unchanged, so the capacitor grows by the same factor the pole falls.',
        tex: "k = \\frac{C_{new}}{C_{old}} = \\frac{f_{p1}}{f'_{p1}} = \\frac{1000\\,\\mathrm{Hz}}{84.4\\,\\mathrm{Hz}} = 11.8",
        try: {
          q: '(c) The first pole moves from 1 kHz to your answer in (b). By what factor must its capacitor grow?',
          answer: ans('bank-ps2-p3', 'k'), unit: '×', tol: 0.03,
          hint: ['$f_p = 1/(2\\pi RC)$ with R unchanged.', "$k = \\dfrac{f_{p1}}{f'_{p1}}$"],
          how: [
            "The pole is one over RC and R is unchanged, so C scales as one over the pole: $$k = \\frac{C_{new}}{C_{old}} = \\frac{f_{p1}}{f'_{p1}}$$",
            'Put in the numbers: $$k = \\frac{1000\\,\\mathrm{Hz}}{84.4\\,\\mathrm{Hz}} = 11.8$$',
            'Only about 12 times: moving the existing pole is much cheaper than adding a new one.',
          ],
        },
        say: '11.8 times.',
      },
      { t: 38, ans: true, title: '**Answers:** (a) 1.6° · (b) 84.4 Hz · (c) 11.8×', say: 'Notice we never needed a 45° shortcut here: two poles share the 45°, so solve the angle equation.' },
    ],
  });
}, { q: 'Problem Set 2 P3' });

scene(L17, '2024 Quiz 2 Q1: GBW, PM and Cc from Bode data', 52, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 3 OF 9', title: 'Read a Miller op amp’s numbers', src: 'Quiz 2 2024-25 Q1 · 6 marks', paper: 'q24bq1',
    q: 'Miller-compensated two-stage: DC gain 80 dB, poles at 15.9 kHz and 740 MHz, a zero at 3.18 GHz, $C_L$ = 5 pF. Find the GBW, the PM and $C_c$.', qh: 190,
    giv: 'Assume unity feedback (β = 1) for the PM; the zero is the Miller RHP zero.',
    tests: 'GBW = $A_0f_{p1}$, the PM with a second pole and an RHP zero, and $\\omega_{p2} = g_{m2}/C_L$, $\\omega_z = g_{m2}/C_c$.',
    fig: eqFig([['GBW = A_0\\,f_{p1}', 270, 32], ['PM = 90^\\circ - \\tan^{-1}\\tfrac{GBW}{f_{p2}} - \\tan^{-1}\\tfrac{GBW}{f_z}', 390, 28], ['g_{m2} = 2\\pi f_{p2}C_L,\\;\\; C_c = \\frac{g_{m2}}{2\\pi f_z}', 510, 28, '#ffd38a']]),
    steps: [
      {
        t: 6, title: '**GBW = DC gain × dominant pole.** 80 dB is 10⁴, and above the first pole gain × frequency stays constant.',
        tex: 'A_0 = 10^{80/20} = 10^4,\\quad GBW = A_0f_{p1} = 10^4\\times 15.9\\,\\mathrm{kHz} = 159\\,\\mathrm{MHz}',
        try: {
          q: 'Find the gain-bandwidth product GBW of this op amp.',
          answer: ans('pyq-q24b-q1', 'gbw'), unit: 'Hz', tol: 0.01,
          parts: [{ q: 'DC gain $A_0$ as a plain number (V/V)?', answer: IM.q1.a0, unit: '', tol: 0.01, hint: '$A_0 = 10^{\\text{dB}/20}$', how: ['$$A_0 = 10^{80/20} = 10^4$$'] }],
          hint: ['Above the dominant pole the gain falls 20 dB/dec, so gain × frequency stays the same all the way down to unity gain. Turn 80 dB into a plain number first.', '$GBW = A_0\\,f_{p1}$ with $A_0 = 10^{80/20}$'],
          how: [
            'Convert the DC gain from dB: $$A_0 = 10^{80/20} = 10^4$$',
            'Above $f_{p1}$, gain × frequency is constant, so the gain reaches 1 at $$GBW = A_0f_{p1} = 10^4\\times 15.9\\,\\mathrm{kHz} = 159\\,\\mathrm{MHz}$$',
            'This is well below the second pole (740 MHz), so the one-pole picture is fair.',
          ],
        },
        say: '159 MHz.',
      },
      {
        t: 13, title: '**PM at the GBW:** the dominant pole takes 90°, then the second pole AND the RHP zero each take a little more.',
        tex: '\\tan^{-1}\\frac{159}{740} = 12.1^\\circ,\\quad \\tan^{-1}\\frac{159}{3180} = 2.9^\\circ,\\quad PM = 90^\\circ - 12.1^\\circ - 2.9^\\circ = 75^\\circ',
        try: {
          q: 'Find the phase margin (unity feedback, so the crossover is at the GBW you just found).',
          answer: ans('pyq-q24b-q1', 'pm'), unit: '°', tol: 0.01,
          parts: [
            { q: 'Phase lag of the second pole (740 MHz) at the GBW (degrees)?', answer: IM.q1.ap, unit: '°', tol: 0.02, hint: '$\\tan^{-1}(GBW/f_{p2})$', how: ['$$\\tan^{-1}\\frac{159}{740} = 12.1^\\circ$$'] },
            { q: 'Phase lag of the RHP zero (3.18 GHz) at the GBW (degrees)?', answer: IM.q1.az, unit: '°', tol: 0.02, hint: 'An RHP zero lags like a pole: $\\tan^{-1}(GBW/f_z)$.', how: ['$$\\tan^{-1}\\frac{159}{3180} = 2.9^\\circ$$'] },
          ],
          hint: ['At the GBW the dominant pole has used its full 90°. The second pole and the right-half-plane zero both add lag (an RHP zero lags like a pole).', '$PM = 90^\\circ - \\tan^{-1}\\frac{GBW}{f_{p2}} - \\tan^{-1}\\frac{GBW}{f_z}$'],
          how: [
            'The dominant pole is $10^4$ times below the GBW, so it gives its full 90°. Left over: $$180^\\circ - 90^\\circ = 90^\\circ$$',
            'Lag of the second pole at the GBW: $$\\tan^{-1}\\frac{159\\,\\mathrm{M}}{740\\,\\mathrm{M}} = \\tan^{-1}(0.215) = 12.1^\\circ$$',
            'The RHP zero lags too: $$\\tan^{-1}\\frac{159\\,\\mathrm{M}}{3180\\,\\mathrm{M}} = \\tan^{-1}(0.05) = 2.9^\\circ$$',
            'Subtract both: $$PM = 90^\\circ - 12.1^\\circ - 2.9^\\circ = 75^\\circ$$',
          ],
          why: 'An RHP zero is subtracted exactly like a pole.',
          calc: [{ what: 'PM in one line (degree mode)', keys: '90 − [SHIFT][tan] 159 ÷ 740 ) − [SHIFT][tan] 159 ÷ 3180 ) [EXE]', shows: '75.01' }],
        },
        say: '12.1° and 2.9°: PM = 75°.',
      },
      {
        t: 21, title: '**One $g_{m2}$, two formulas:** the second pole ($g_{m2}/C_L$) gives $g_{m2}$; the zero ($g_{m2}/C_c$) then gives $C_c$.',
        tex: stepTex('pyq-q24b-q1', 2),
        try: {
          q: 'Find the compensation capacitor $C_c$.',
          answer: ans('pyq-q24b-q1', 'cc'), unit: 'F', tol: 0.02,
          parts: [{ q: 'Second-stage transconductance $g_{m2}$, from the second pole and $C_L$ (S)?', answer: IM.q1.gm2, unit: 'S', tol: 0.02, hint: '$f_{p2} = g_{m2}/(2\\pi C_L)$', how: ['$$g_{m2} = 2\\pi(740\\,\\mathrm{M})(5\\,\\mathrm{p}) = 23.2\\,\\mathrm{mS}$$'] }],
          hint: ['In a Miller op amp the second pole is $g_{m2}/C_L$ and the RHP zero is $g_{m2}/C_c$. You know $C_L$ and both frequencies.', '$g_{m2} = 2\\pi f_{p2}C_L$, then $C_c = \\dfrac{g_{m2}}{2\\pi f_z}$'],
          how: [
            'The second pole gives $g_{m2}$: $$g_{m2} = 2\\pi f_{p2}C_L = 2\\pi(740\\,\\mathrm{MHz})(5\\,\\mathrm{pF}) = 23.2\\,\\mathrm{mS}$$',
            'The RHP zero has the same $g_{m2}$ but over $C_c$: $$C_c = \\frac{g_{m2}}{2\\pi f_z} = \\frac{23.2\\,\\mathrm{mS}}{2\\pi(3.18\\,\\mathrm{GHz})} = 1.16\\,\\mathrm{pF}$$',
            'Shortcut: divide the two formulas and $g_{m2}$ cancels: $$C_c = C_L\\frac{f_{p2}}{f_z} = 5\\,\\mathrm{pF}\\times\\frac{740}{3180} = 1.16\\,\\mathrm{pF}$$',
          ],
        },
        say: '$g_{m2}$ = 23.2 mS, so $C_c$ = 1.16 pF.',
      },
      { t: 30, ans: true, title: '**Answers:** GBW = 159 MHz · PM = 75° · $C_c$ = 1.16 pF', say: 'Every number in a Miller op amp is tied to $g_{m1}$, $g_{m2}$, $C_c$ and $C_L$.' },
    ],
  });
}, { q: 'Quiz 2 2024 Q1' });

scene(L17, '2023 mid-sem Q5: K at PM = 50°, and Cc versus CL', 52, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 4 OF 9', title: 'A peak from a margin, then Allen’s relation', src: 'Mid-sem 2023-24 Q5 · 5 marks', paper: 'm23q5',
    q: '(a) If PM = 50°, $|V_{out}/V_{in}(j\\omega_{GX})| = K/\\beta$. Find K. (b) In a Miller-compensated OTA, for PM = 45° with the RHP zero at 10 × GBW, what relation is needed between $C_L$ and $C_c$?', qh: 230,
    giv: '(b) Two-stage Miller dictionary: $\\omega_u = g_{m1}/C_c$, $\\omega_{p2} = g_{m2}/C_L$, $\\omega_z = g_{m2}/C_c$; unity feedback.',
    tests: 'Lecture 16’s peak formula, and the PM equation of a Miller op amp with its zero.',
    fig: eqFig([['K = \\frac{1}{2\\sin(PM/2)}', 270, 34], ['45^\\circ = 90^\\circ - \\tan^{-1}\\tfrac{\\omega_u}{\\omega_{p2}} - \\tan^{-1}(0.1)', 390, 26], ['\\omega_z = 10\\omega_u \\Rightarrow g_{m2} = 10g_{m1}', 500, 28, '#ffd38a']]),
    steps: [
      {
        t: 6, title: '**(a) Peaking from the margin.** At the crossover the loop gain is 1 at an angle of −(180° − PM); the closed-loop gain there is $(1/\\beta)/(2\\sin(PM/2))$.',
        tex: 'K = \\frac{1}{2\\sin(PM/2)} = \\frac{1}{2\\sin 25^\\circ} = \\frac{1}{2(0.423)} = 1.18',
        try: {
          q: '(a) With PM = 50°, the closed-loop gain at $\\omega_{GX}$ is $K/\\beta$. Find K.',
          answer: ans('pyq-m23-q5', 'k'), unit: '', tol: 0.01,
          hint: ['At $\\omega_{GX}$, $|\\beta A| = 1$ and its phase is −(180° − PM). Put that into $A/(1 + \\beta A)$: you need the size of $1 + \\beta A$.', '$K = \\dfrac{1}{2\\sin(PM/2)}$'],
          how: [
            'At the crossover βA is a unit arrow at −(180° − PM). Its distance from −1 is a chord of the unit circle: $$|1 + \\beta A| = 2\\sin\\frac{PM}{2}$$',
            'So the closed-loop gain there is $$\\left|\\frac{A}{1 + \\beta A}\\right| = \\frac{1/\\beta}{2\\sin(PM/2)} \\;\\Rightarrow\\; K = \\frac{1}{2\\sin(PM/2)}$$',
            'Put in PM = 50°: $$K = \\frac{1}{2\\sin 25^\\circ} = \\frac{1}{2(0.423)} = 1.18$$',
            'K > 1: the response peaks about 18 % above the flat 1/β.',
          ],
          calc: [{ what: 'K (degree mode)', keys: '1 ÷ ( 2 [sin] 25 ) ) [EXE]', shows: '1.183' }],
        },
        say: '1.18: an 18 % peak.',
      },
      { t: 14, title: '**(b) Share out the 45°.** The dominant pole takes 90°; the zero at 10 × GBW takes tan⁻¹(0.1) = 5.71°; what is left, 39.29°, is all the second pole may take.', tex: '\\tan^{-1}\\frac{\\omega_u}{\\omega_{p2}} = 180^\\circ - 45^\\circ - 90^\\circ - \\tan^{-1}(0.1) = 45^\\circ - 5.71^\\circ = 39.29^\\circ', say: 'The zero takes 5.7°, so the second pole may take only 39.3° at the GBW.' },
      {
        t: 21, title: '**Turn the angle into a capacitor ratio** with $\\omega_u = g_{m1}/C_c$, $\\omega_{p2} = g_{m2}/C_L$, and $g_{m2} = 10g_{m1}$ (because $\\omega_z/\\omega_u = g_{m2}/g_{m1} = 10$).',
        tex: '\\frac{g_{m2}}{g_{m1}} = \\frac{\\omega_z}{\\omega_u} = 10,\\quad \\tan 39.29^\\circ = 0.818,\\quad \\frac{C_c}{C_L} = \\frac{g_{m1}}{g_{m2}\\tan 39.29^\\circ} = \\frac{1}{10(0.818)} = 0.122',
        try: {
          q: '(b) The second pole may take 39.29° at the GBW (step 2). What is the smallest $C_c/C_L$ that gives PM = 45°?',
          answer: ans('pyq-m23-q5', 'ratio'), unit: '', tol: 0.02,
          parts: [
            { q: 'The zero is at 10 × GBW. What is $g_{m2}/g_{m1}$?', answer: IM.q5.ratio, unit: '', tol: 0.01, hint: '$\\omega_z/\\omega_u = (g_{m2}/C_c)/(g_{m1}/C_c)$', how: ['$$\\frac{\\omega_z}{\\omega_u} = \\frac{g_{m2}}{g_{m1}} = 10$$'] },
            { q: 'The second pole takes 39.29°. What is $\\omega_u/\\omega_{p2}$?', answer: IM.q5.tan, unit: '', tol: 0.01, hint: '$\\tan^{-1}(\\omega_u/\\omega_{p2}) = 39.29^\\circ$', how: ['$$\\frac{\\omega_u}{\\omega_{p2}} = \\tan 39.29^\\circ = 0.818$$'] },
          ],
          hint: ['Write each frequency with the Miller dictionary on the card. The zero at $10\\omega_u$ tells you $g_{m2}/g_{m1}$.', '$\\dfrac{\\omega_u}{\\omega_{p2}} = \\tan 39.29^\\circ \\;\\Rightarrow\\; \\dfrac{C_c}{C_L} = \\dfrac{g_{m1}}{g_{m2}\\tan 39.29^\\circ}$'],
          how: [
            'The zero at 10 × GBW fixes the transconductance ratio: $$\\frac{\\omega_z}{\\omega_u} = \\frac{g_{m2}/C_c}{g_{m1}/C_c} = \\frac{g_{m2}}{g_{m1}} = 10$$',
            'The second pole may take 39.29°, so $$\\frac{\\omega_u}{\\omega_{p2}} = \\frac{g_{m1}/C_c}{g_{m2}/C_L} = \\tan 39.29^\\circ = 0.818$$',
            'Solve for the capacitor ratio: $$\\frac{C_c}{C_L} = \\frac{g_{m1}}{g_{m2}}\\cdot\\frac{1}{0.818} = \\frac{1}{10\\times 0.818} = 0.122$$',
            'A bigger $C_c$ only adds margin, so the relation is $C_c \\ge 0.122\\,C_L$.',
          ],
          why: 'The same steps with 60° give Allen’s $C_c \\ge 0.22\\,C_L$.',
          calc: [{ what: 'Ratio in one line (degree mode)', keys: '0.1 ÷ [tan] ( 45 − [SHIFT][tan] 0.1 ) ) ) [EXE]', shows: '0.1222' }],
        },
        say: '$C_c \\ge 0.122\\,C_L$. For 60° the same steps give Allen’s 0.22.',
      },
      { t: 30, ans: true, title: '**Answers:** (a) K = 1.18 · (b) $C_c \\ge 0.122\\,C_L$', say: 'Small question, two big ideas: peaking from PM, and the zero’s share of the margin.' },
    ],
  });
}, { q: 'Mid-sem 2023 Q5' });

scene(L17, 'Razavi Ex 10.6: a first estimate of Cc', 42, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 5 OF 9', title: 'Cc for 45° in unity feedback', src: 'Razavi Example 10.6',
    q: 'Miller two-stage: $g_{m1}$ = 1 mS, $g_{m9}$ = 5 mS (second stage), $C_L$ = 2 pF. Estimate $C_c$ for 45° in unity feedback: (a) ignoring the second pole’s effect on the size, (b) including it.', qh: 210,
    giv: 'Numbers chosen by the app (the book gives this example in symbols). RHP zero ignored.',
    tests: 'GBW = $g_{m1}/C_c$ placed on $\\omega_{p2} = g_{m9}/C_L$.',
    fig: eqFig([['\\frac{g_{m1}}{C_c} = \\frac{g_{m9}}{C_L}\\;\\;(45^\\circ)', 320, 34], ['\\text{(b): } |\\beta A| \\text{ is already } 1/\\sqrt2 \\text{ at } \\omega_{p2}', 460, 26]]),
    steps: [
      {
        t: 6, title: '**(a) Put the crossover on the second pole.** Above $P_1$ the loop gain is $g_{m1}/(\\omega C_c)$; make it 1 at $\\omega_{p2} = g_{m9}/C_L$.',
        tex: 'C_c = \\frac{g_{m1}}{g_{m9}}C_L = \\frac{1\\,\\mathrm{mS}}{5\\,\\mathrm{mS}}(2\\,\\mathrm{pF}) = 0.4\\,\\mathrm{pF}',
        try: {
          q: '(a) Estimate $C_c$ for PM = 45° in unity feedback, ignoring how much the second pole lowers the gain.',
          answer: ans('bank-ex10-6', 'a'), unit: 'F', tol: 0.02,
          hint: ['For 45°, the loop gain must reach 1 exactly at the second pole. Above the first pole the loop gain is $g_{m1}/(\\omega C_c)$, and the second pole is at $g_{m9}/C_L$.', '$\\dfrac{g_{m1}}{C_c} = \\dfrac{g_{m9}}{C_L} \\;\\Rightarrow\\; C_c = \\dfrac{g_{m1}}{g_{m9}}C_L$'],
          how: [
            '45° in unity feedback: the crossover sits on the second pole. $$\\omega_u = \\omega_{p2}$$',
            'Write both with the Miller dictionary (stage 2 is $g_{m9}$ here): $$\\frac{g_{m1}}{C_c} = \\frac{g_{m9}}{C_L}$$',
            'Solve: $$C_c = \\frac{g_{m1}}{g_{m9}}C_L = \\frac{1\\,\\mathrm{mS}}{5\\,\\mathrm{mS}}\\times 2\\,\\mathrm{pF} = 0.4\\,\\mathrm{pF}$$',
          ],
          why: 'Stage 1 over stage 2. Flipping the ratio gives 10 pF.',
        },
        say: '0.4 pF.',
      },
      {
        t: 14, title: '**(b) The second pole also shrinks the gain:** at $\\omega_{p2}$ it divides $|\\beta A|$ by √2, so the crossover comes earlier and a √2 smaller $C_c$ is enough.',
        tex: 'C_c = \\frac{g_{m1}}{\\sqrt2\\,g_{m9}}C_L = \\frac{0.4\\,\\mathrm{pF}}{1.414} = 0.283\\,\\mathrm{pF}',
        try: {
          q: '(b) Now include it: at $\\omega_{p2}$ the second pole also reduces $|\\beta A|$. Estimate $C_c$ again.',
          answer: ans('bank-ex10-6', 'b'), unit: 'F', tol: 0.02,
          hint: ['At its own frequency a pole divides the gain by $\\sqrt{1 + 1^2} = \\sqrt2$. So the one-pole gain $g_{m1}/(\\omega C_c)$ only needs to be √2 at $\\omega_{p2}$.', '$\\dfrac{g_{m1}}{\\omega_{p2}C_c}\\cdot\\dfrac{1}{\\sqrt2} = 1 \\;\\Rightarrow\\; C_c = \\dfrac{g_{m1}C_L}{\\sqrt2\\,g_{m9}}$'],
          how: [
            'At $\\omega = \\omega_{p2}$ the second pole divides the gain by $$|1 + j1| = \\sqrt2$$',
            'Set the full loop gain to 1 at $\\omega_{p2} = g_{m9}/C_L$: $$\\frac{g_{m1}}{\\omega_{p2}C_c}\\cdot\\frac{1}{\\sqrt2} = 1 \\;\\Rightarrow\\; C_c = \\frac{g_{m1}C_L}{\\sqrt2\\,g_{m9}}$$',
            'That is part (a) divided by √2: $$C_c = \\frac{0.4\\,\\mathrm{pF}}{1.414} = 0.283\\,\\mathrm{pF}$$',
          ],
        },
        say: '0.28 pF: a slightly smaller capacitor is enough.',
      },
      { t: 22, ans: true, title: '**Answers:** (a) 0.4 pF · (b) 0.28 pF', say: 'A first estimate: real designs take 60° and a little extra.' },
    ],
  });
}, { q: 'Razavi Ex 10.6' });

const M24 = 'pyq-m24-q2';
scene(L17, '2024 mid-sem Q2, part 1: SR, GBW, gain, bandwidth', 66, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 6 OF 9 (PART 1)', title: 'Analyse a Miller two-stage op amp (15 marks)', src: 'Mid-sem 2024-25 Q2 · 15 marks', paper: 'm24q2',
    q: '$I_1$ = 10 µA, $(W/L)_6$ = 10, $(W/L)_5$ = 20, $(W/L)_{1,2}$ = 10, $(W/L)_{3,4}$ = 10, $(W/L)_7$ = 80, $C_c$ = 0.22 pF, $C_L$ = 1 pF. SR, GBW, DC gain, bandwidth, second pole, RHP zero, PM. $V_{DD}$ = 1.8 V, $\\mu_nC_{ox}$ = 100, $\\mu_pC_{ox}$ = 50 µA/V², $\\lambda_p$ = 0.2, $\\lambda_n$ = 0.1 V⁻¹.', qh: 280,
    giv: '$V_{thn}$ = 0.4 V, $|V_{thp}|$ = 0.5 V, all L = 1. M1, M2, M5, M6, M8 PMOS; M3, M4, M7 NMOS. M8 is assumed to carry $I_7$.',
    tests: 'every Lecture 17 formula on one circuit: mirror ratios for currents, $SR = I_5/C_c$, $GBW = g_{m1}/2\\pi C_c$, $A_1A_2$, $f_{p2} = g_{m7}/2\\pi C_L$, $f_z = g_{m7}/2\\pi C_c$, and the PM.',
    fig: paperFig('m24q2f', [['SR = \\frac{I_5}{C_c},\\;\\; GBW = \\frac{g_{m1}}{2\\pi C_c}', 600, 28], ['A_0 = g_{m1}(r_{O2}\\parallel r_{O4})\\cdot g_{m7}(r_{O7}\\parallel r_{O8}),\\;\\; f_{-3dB} = \\frac{GBW}{A_0}', 700, 24, '#ffd38a']], 400),
    steps: [
      {
        t: 6, title: '**Currents first, by mirror ratios.** M5 is twice M6, so $I_5$ = 20 µA. In a big input step all of $I_5$ charges $C_c$.',
        tex: 'I_5 = \\frac{(W/L)_5}{(W/L)_6}I_1 = 2(10\\,\\mu\\mathrm{A}) = 20\\,\\mu\\mathrm{A},\\quad SR = \\frac{I_5}{C_c} = \\frac{20\\,\\mu\\mathrm{A}}{0.22\\,\\mathrm{pF}} = 90.9\\,\\mathrm{V/\\mu s}',
        try: {
          q: 'Find the slew rate SR. (Start from the bias: $I_1$ = 10 µA flows in the diode M6.)',
          answer: ans(M24, 'sr'), unit: 'V/s', tol: 0.01,
          parts: [{ q: 'Tail current $I_5$ (A)?', answer: IM.m24.i5, unit: 'A', tol: 0.01, hint: 'M5 mirrors M6: currents scale with W/L.', how: ['$$I_5 = \\frac{20}{10}\\times 10\\,\\mu\\mathrm{A} = 20\\,\\mu\\mathrm{A}$$'] }],
          hint: ['Slewing: the input pair steers the whole tail current $I_5$ into $C_c$. Get $I_5$ from the mirror M6 → M5 (currents scale with W/L).', '$I_5 = \\dfrac{(W/L)_5}{(W/L)_6}I_1$, then $SR = \\dfrac{I_5}{C_c}$'],
          how: [
            'M6 is a PMOS diode (source = $V_{DD}$, gate tied to its drain) carrying $I_1$. M5 shares its gate and source, so the same $|V_{GS}|$ (a link) and the current scales with W/L, 20/10: $$I_5 = \\frac{(W/L)_5}{(W/L)_6}I_1 = \\frac{20}{10}\\times 10\\,\\mu\\mathrm{A} = 20\\,\\mu\\mathrm{A}$$',
            'In a large step all of $I_5$ goes through one input device into $C_c$, so the output ramps at $$SR = \\frac{I_5}{C_c} = \\frac{20\\,\\mu\\mathrm{A}}{0.22\\,\\mathrm{pF}} = 90.9\\,\\mathrm{V/\\mu s}$$',
            'In normal operation each input device carries half the tail, 10 µA (you need it next for $g_{m1}$).',
          ],
          why: '90.9 V/µs = 90.9 MV/s: the box wants V/s.',
        },
        say: 'M5 is twice M6, so $I_5$ = 20 µA and each input device carries 10 µA. SR = 90.9 V/µs.',
      },
      {
        t: 15, title: '**GBW comes from stage 1 and $C_c$ only.** Find $g_{m1}$ of the PMOS input device (10 µA, W/L = 10), then divide by $2\\pi C_c$.',
        tex: 'g_{m1} = \\sqrt{2\\mu_pC_{ox}(W/L)_1I_{D1}} = \\sqrt{2(50\\,\\mu)(10)(10\\,\\mu)} = 0.1\\,\\mathrm{mS},\\quad GBW = \\frac{g_{m1}}{2\\pi C_c} = \\frac{0.1\\,\\mathrm{mS}}{2\\pi(0.22\\,\\mathrm{pF})} = 72.3\\,\\mathrm{MHz}',
        try: {
          q: 'Find the gain-bandwidth product GBW (in Hz). The input pair M1, M2 is PMOS; $I_5$ = 20 µA from the last step.',
          answer: ans(M24, 'gbw'), unit: 'Hz', tol: 0.01,
          parts: [{ q: '$g_{m1}$ of a PMOS input device at $I_5/2$ (S)?', answer: IM.m24.gm1, unit: 'S', tol: 0.01, hint: '$g_{m1} = \\sqrt{2\\mu_pC_{ox}(W/L)_1I_{D1}}$, $I_{D1}$ = 10 µA', how: ['$$g_{m1} = \\sqrt{2(50\\,\\mu)(10)(10\\,\\mu)} = 0.1\\,\\mathrm{mS}$$'] }],
          hint: ['Above the dominant pole, stage 1’s current $g_{m1}v_{in}$ just charges $C_c$, so unity gain is at $g_{m1}/C_c$. Each input device carries $I_5/2$.', '$g_{m1} = \\sqrt{2\\mu_pC_{ox}(W/L)_1I_{D1}}$, $GBW = \\dfrac{g_{m1}}{2\\pi C_c}$'],
          how: [
            'Each input device carries half the tail: $$I_{D1} = \\frac{I_5}{2} = 10\\,\\mu\\mathrm{A}$$',
            'PMOS square law, so use $\\mu_pC_{ox}$: $$g_{m1} = \\sqrt{2\\mu_pC_{ox}(W/L)_1I_{D1}} = \\sqrt{2(50\\,\\mu)(10)(10\\,\\mu)} = 0.1\\,\\mathrm{mS}$$',
            'Divide by $2\\pi C_c$ to get hertz: $$GBW = \\frac{g_{m1}}{2\\pi C_c} = \\frac{0.1\\,\\mathrm{mS}}{2\\pi(0.22\\,\\mathrm{pF})} = 72.3\\,\\mathrm{MHz}$$',
          ],
          why: 'Forgetting the 2π gives 455 M: that is ω in rad/s, not hertz.',
        },
        say: '72.3 MHz.',
      },
      { t: 24, title: '**Second-stage current.** M7 is NMOS: source = ground, gate = stage-1 output (drain of M2/M4). At balance that node sits at $V_{DS4} = V_{DS3} = V_{GS3}$, so $V_{GS7} = V_{GS3}$ and $I_7$ scales with W/L: $I_7 = (80/10)\\times 10$ µA. $g_{m7}$ uses $\\mu_nC_{ox}$.', tex: 'I_7 = \\frac{80}{10}(10\\,\\mu\\mathrm{A}) = 80\\,\\mu\\mathrm{A},\\quad g_{m7} = \\sqrt{2(100\\,\\mu)(80)(80\\,\\mu)} = 1.13\\,\\mathrm{mS}', say: 'At balance M7’s gate sits at $V_{GS3}$, so $I_7$ scales with W/L: 80/10 × 10 µA = 80 µA, and $g_{m7}$ = 1.13 mS.' },
      {
        t: 31, title: '**DC gain = stage-1 gain × stage-2 gain.** Each stage is $g_m$ times the two output resistances in parallel, with $r_O = 1/(\\lambda I_D)$.',
        tex: '\\begin{aligned} r_{O2} &= \\tfrac{1}{0.2(10\\,\\mu)} = 500\\,\\mathrm{k\\Omega},\\;\\; r_{O4} = \\tfrac{1}{0.1(10\\,\\mu)} = 1\\,\\mathrm{M\\Omega} \\\\ A_1 &= 0.1\\,\\mathrm{mS}\\times(500\\,\\mathrm{k}\\parallel 1\\,\\mathrm{M}) = 0.1\\,\\mathrm{mS}\\times 333\\,\\mathrm{k\\Omega} = 33.3 \\\\ r_{O7}\\parallel r_{O8} &= 125\\,\\mathrm{k}\\parallel 62.5\\,\\mathrm{k} = 41.7\\,\\mathrm{k\\Omega} \\\\ A_2 &= 1.13\\,\\mathrm{mS}\\times 41.7\\,\\mathrm{k\\Omega} = 47.1 \\\\ A_0 &= A_1A_2 = 33.3\\times 47.1 = 1571 \\end{aligned}',
        try: {
          q: 'Find the DC gain $A_0$ (V/V). From the steps above: $g_{m1}$ = 0.1 mS at 10 µA per input device, $g_{m7}$ = 1.13 mS at $I_7$ = 80 µA.',
          answer: ans(M24, 'a0'), unit: '', tol: 0.02,
          parts: [
            { q: '$r_{O2}$ (PMOS input device, 10 µA) in Ω?', answer: IM.m24.ro2, unit: 'Ω', tol: 0.01, hint: '$r_O = 1/(\\lambda_pI_D)$, $\\lambda_p$ = 0.2 V⁻¹', how: ['$$r_{O2} = \\frac{1}{0.2\\times 10\\,\\mu} = 500\\,\\mathrm{k\\Omega}$$'] },
            { q: '$r_{O4}$ (NMOS load, 10 µA) in Ω?', answer: IM.m24.ro4, unit: 'Ω', tol: 0.01, hint: '$r_O = 1/(\\lambda_nI_D)$, $\\lambda_n$ = 0.1 V⁻¹', how: ['$$r_{O4} = \\frac{1}{0.1\\times 10\\,\\mu} = 1\\,\\mathrm{M\\Omega}$$'] },
            { q: 'Stage-1 gain $A_1 = g_{m1}(r_{O2}\\parallel r_{O4})$?', answer: IM.m24.a1, unit: '', tol: 0.02, hint: '500 kΩ ∥ 1 MΩ = 333 kΩ', how: ['$$A_1 = 0.1\\,\\mathrm{mS}\\times 333\\,\\mathrm{k\\Omega} = 33.3$$'] },
            { q: 'Output resistance $r_{O7}\\parallel r_{O8}$ at $I_7$ = 80 µA (Ω)?', answer: IM.m24.r2, unit: 'Ω', tol: 0.02, hint: '$r_{O7} = 1/(\\lambda_nI_7)$ (NMOS), $r_{O8} = 1/(\\lambda_pI_7)$ (PMOS)', how: ['$$r_{O7} = \\frac{1}{0.1\\times 80\\,\\mu} = 125\\,\\mathrm{k\\Omega},\\; r_{O8} = \\frac{1}{0.2\\times 80\\,\\mu} = 62.5\\,\\mathrm{k\\Omega},\\; r_{O7}\\parallel r_{O8} = 41.7\\,\\mathrm{k\\Omega}$$'] },
            { q: 'Stage-2 gain $A_2 = g_{m7}(r_{O7}\\parallel r_{O8})$?', answer: IM.m24.a2, unit: '', tol: 0.02, hint: '$g_{m7}$ = 1.13 mS (step 3 card)', how: ['$$A_2 = 1.13\\,\\mathrm{mS}\\times 41.7\\,\\mathrm{k\\Omega} = 47.1$$'] },
          ],
          hint: ['Each stage: $g_m$ × (resistance at its output node). Node 1 sees $r_{O2}\\parallel r_{O4}$ (PMOS input, NMOS load); the output sees $r_{O7}\\parallel r_{O8}$ (NMOS M7, PMOS source M8). Use $r_O = 1/(\\lambda I_D)$ with the right λ.', '$A_0 = g_{m1}(r_{O2}\\parallel r_{O4})\\cdot g_{m7}(r_{O7}\\parallel r_{O8})$'],
          how: [
            'Stage-1 resistances at 10 µA: $$r_{O2} = \\frac{1}{\\lambda_pI_D} = \\frac{1}{0.2(10\\,\\mu)} = 500\\,\\mathrm{k\\Omega},\\; r_{O4} = \\frac{1}{\\lambda_nI_D} = \\frac{1}{0.1(10\\,\\mu)} = 1\\,\\mathrm{M\\Omega}$$',
            'Stage-1 gain: $$A_1 = g_{m1}(r_{O2}\\parallel r_{O4}) = 0.1\\,\\mathrm{mS}\\times 333\\,\\mathrm{k\\Omega} = 33.3$$',
            'Stage 2 at 80 µA: $r_{O7} = 1/(0.1\\times 80\\,\\mu) = 125$ kΩ and $r_{O8} = 1/(0.2\\times 80\\,\\mu) = 62.5$ kΩ: $$A_2 = g_{m7}(r_{O7}\\parallel r_{O8}) = 1.13\\,\\mathrm{mS}\\times 41.7\\,\\mathrm{k\\Omega} = 47.1$$',
            'Multiply: $$A_0 = A_1A_2 = 33.3\\times 47.1 = 1571$$ (about 64 dB).',
          ],
          calc: [{ what: 'Both stages in one line (prefixes on)', keys: '0.1m × ( 500k [SHIFT][^] + 1M [SHIFT][^] ) [SHIFT][^] × 1.131m × ( 125k [SHIFT][^] + 62.5k [SHIFT][^] ) [SHIFT][^] [EXE]', shows: '1571', note: '[SHIFT][^] is x⁻¹: (a⁻¹ + b⁻¹)⁻¹ is a ∥ b.' }],
        },
        say: '$A_1$ = 33.3, $A_2$ = 47.1: $A_0$ = 1571, about 64 dB.',
      },
      {
        t: 41, title: '**Bandwidth = GBW ÷ DC gain.** The gain is flat up to the dominant pole, then falls so that gain × frequency = GBW.',
        tex: 'f_{-3dB} = \\frac{GBW}{A_0} = \\frac{72.3\\,\\mathrm{MHz}}{1571} = 46\\,\\mathrm{kHz}',
        try: {
          q: 'Find the open-loop −3 dB bandwidth (the dominant pole), using the GBW and $A_0$ you found.',
          answer: ans(M24, 'bw'), unit: 'Hz', tol: 0.02,
          hint: ['On the one-pole slope gain × frequency is constant: the gain is $A_0$ at the dominant pole and 1 at the GBW.', '$f_{-3dB} = \\dfrac{GBW}{A_0}$'],
          how: [
            'On the −20 dB/dec slope gain × frequency stays the same, from $A_0$ at $f_{-3dB}$ to 1 at the GBW: $$A_0\\,f_{-3dB} = 1\\times GBW$$',
            'So $$f_{-3dB} = \\frac{GBW}{A_0} = \\frac{72.3\\,\\mathrm{MHz}}{1571} = 46.0\\,\\mathrm{kHz}$$',
            'A tiny bandwidth next to a big GBW is exactly what a dominant pole is meant to do.',
          ],
        },
        say: '46 kHz: the dominant pole.',
      },
      { t: 49, ans: true, title: '**So far:** SR 90.9 V/µs · GBW 72.3 MHz · $A_0$ = 1571 · BW 46 kHz', say: 'Part 2: the second pole, the zero and the margin.' },
    ],
  });
}, { q: 'Mid-sem 2024 Q2 (1)' });

scene(L17, '2024 mid-sem Q2, part 2: second pole, zero, PM', 50, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 6 OF 9 (PART 2)', title: 'Second pole, RHP zero and phase margin', src: 'Mid-sem 2024-25 Q2 · 15 marks',
    q: 'Same op amp: $g_{m7}$ = 1.13 mS, $C_c$ = 0.22 pF, $C_L$ = 1 pF, GBW = 72.3 MHz. Find the second pole, the RHP zero and the phase margin (β = 1).', qh: 180,
    giv: 'From part 1: $I_7$ = 80 µA, $g_{m7} = \\sqrt{2\\mu_nC_{ox}(W/L)_7I_7}$ (M7 NMOS: gate = stage-1 output, drain = output node with $C_L$, $C_c$ from gate to drain); dominant pole 46 kHz.',
    tests: '$f_{p2} = g_{m7}/2\\pi C_L$, $f_z = g_{m7}/2\\pi C_c$ and the three-angle PM.',
    fig: paperFig('m24q2f', [['f_{p2} = \\frac{g_{m7}}{2\\pi C_L},\\quad f_z = \\frac{g_{m7}}{2\\pi C_c}', 600, 28], ['PM = 90^\\circ - \\tan^{-1}\\tfrac{GBW}{f_{p2}} - \\tan^{-1}\\tfrac{GBW}{f_z}', 700, 26, '#ffd38a']], 400),
    steps: [
      {
        t: 6, title: '**The second pole is the output node:** pole splitting makes the output stage look like $1/g_{m7}$, driving $C_L$.',
        tex: 'f_{p2} = \\frac{g_{m7}}{2\\pi C_L} = \\frac{1.13\\,\\mathrm{mS}}{2\\pi(1\\,\\mathrm{pF})} = 180\\,\\mathrm{MHz}',
        try: {
          q: 'Find the second (non-dominant) pole $f_{p2}$.',
          answer: ans(M24, 'fp2'), unit: 'Hz', tol: 0.02,
          hint: ['At high frequency $C_c$ ties M7’s gate to its drain, so the output node looks like a resistance $1/g_{m7}$ driving $C_L$.', '$f_{p2} = \\dfrac{g_{m7}}{2\\pi C_L}$'],
          how: [
            'At high frequency $C_c$ shorts M7’s gate to its drain, so the output stage is a diode of about $1/g_{m7}$ loaded by $C_L$: $$f_{p2} \\approx \\frac{g_{m7}}{2\\pi C_L}$$',
            'Put in $g_{m7}$ = 1.13 mS and $C_L$ = 1 pF: $$f_{p2} = \\frac{1.13\\,\\mathrm{mS}}{2\\pi(1\\,\\mathrm{pF})} = 180\\,\\mathrm{MHz}$$',
            'It is 2.5 times above the GBW (72.3 MHz): fine, but it will still eat some phase.',
          ],
        },
        say: '180 MHz.',
      },
      {
        t: 13, title: '**The RHP zero:** same $g_{m7}$, but over $C_c$. It is the frequency where the sneak current through $C_c$ cancels M7’s current.',
        tex: 'f_z = \\frac{g_{m7}}{2\\pi C_c} = \\frac{1.13\\,\\mathrm{mS}}{2\\pi(0.22\\,\\mathrm{pF})} = 818\\,\\mathrm{MHz}',
        try: {
          q: 'Find the right-half-plane zero $f_z$.',
          answer: ans(M24, 'fz'), unit: 'Hz', tol: 0.02,
          hint: ['The zero is where the current through $C_c$ ($\\omega C_cv$) equals M7’s current ($g_{m7}v$), so they cancel at the output.', '$f_z = \\dfrac{g_{m7}}{2\\pi C_c}$'],
          how: [
            'At the zero, the feed-forward current through $C_c$ equals and cancels M7’s current: $$\\omega_zC_c = g_{m7} \\;\\Rightarrow\\; f_z = \\frac{g_{m7}}{2\\pi C_c}$$',
            'Same $g_{m7}$, but the small $C_c$: $$f_z = \\frac{1.13\\,\\mathrm{mS}}{2\\pi(0.22\\,\\mathrm{pF})} = 818\\,\\mathrm{MHz}$$',
            'Quick check: $f_z/f_{p2} = C_L/C_c = 1/0.22 = 4.5$.',
          ],
        },
        say: '818 MHz.',
      },
      {
        t: 20, title: '**Phase margin at the GBW** (β = 1): 90° is left after the dominant pole; subtract the second pole’s angle and the zero’s angle.',
        tex: '\\tan^{-1}\\frac{72.3}{180} = 21.9^\\circ,\\quad \\tan^{-1}\\frac{72.3}{818} = 5.05^\\circ,\\quad PM = 90^\\circ - 21.9^\\circ - 5.05^\\circ = 63.1^\\circ',
        try: {
          q: 'Find the phase margin in unity feedback, using $f_{p2}$ and $f_z$ from the last two parts.',
          answer: ans(M24, 'pm'), unit: '°', tol: 0.01,
          parts: [
            { q: 'Phase lag of the second pole at the GBW (degrees)?', answer: IM.m24.ap, unit: '°', tol: 0.02, hint: '$\\tan^{-1}(GBW/f_{p2})$', how: ['$$\\tan^{-1}\\frac{72.3}{180} = 21.9^\\circ$$'] },
            { q: 'Phase lag of the RHP zero at the GBW (degrees)?', answer: IM.m24.az, unit: '°', tol: 0.02, hint: '$\\tan^{-1}(GBW/f_z)$', how: ['$$\\tan^{-1}\\frac{72.3}{818} = 5.05^\\circ$$'] },
          ],
          hint: ['With β = 1 the crossover is at the GBW. The dominant pole takes 90° there; the second pole and the RHP zero both add lag.', '$PM = 90^\\circ - \\tan^{-1}\\frac{GBW}{f_{p2}} - \\tan^{-1}\\frac{GBW}{f_z}$'],
          how: [
            'Crossover at the GBW; the dominant pole (46 kHz) gives its full 90°: $$180^\\circ - 90^\\circ = 90^\\circ$$',
            'Second pole: $$\\tan^{-1}\\frac{72.3}{180} = \\tan^{-1}(0.402) = 21.9^\\circ$$',
            'RHP zero (lags like a pole): $$\\tan^{-1}\\frac{72.3}{818} = \\tan^{-1}(0.0884) = 5.05^\\circ$$',
            'Subtract both: $$PM = 90^\\circ - 21.9^\\circ - 5.05^\\circ = 63.1^\\circ$$',
          ],
          calc: [{ what: 'PM in one line (degree mode)', keys: '90 − [SHIFT][tan] 72.34 ÷ 180.06 ) − [SHIFT][tan] 72.34 ÷ 818.5 ) [EXE]', shows: '63.06', note: 'The key keeps tan⁻¹(A₀) ≈ 89.96° instead of 90°: 63.1°.' }],
        },
        say: '21.9° from the pole, 5.1° from the zero: PM = 63.1°.',
      },
      { t: 28, ans: true, title: '**Answers:** $f_{p2}$ = 180 MHz · $f_z$ = 818 MHz · PM = 63.1°', say: 'Fifteen marks, one dictionary: $G_{m1} = g_{m1}$, $G_{m2} = g_{m7}$, $C_c$, $C_L$.' },
    ],
  });
}, { q: 'Mid-sem 2024 Q2 (2)' });

scene(L17, 'Problem Set 2 P4: add a second stage and compensate', 60, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 7 OF 9', title: 'Your exam OTA + a CS stage', src: 'Problem Set 2 P4',
    q: 'OTA: $G_{m1}$ = 0.8 mS, $R_1$ = 111 kΩ, $I_{SS}$ = 120 µA. PMOS CS stage M6: $G_{m2}$ = 4 mS, $R_2$ = 20 kΩ, biased by $I_7$ = 500 µA, $C_L$ = 4 pF. With $R_z = 1/G_{m2}$: (a) $C_c$ for 60° (β = 1); (b) GBW; (c) $P_1\'$; (d) $R_z$; (e) slew rate.', qh: 240,
    giv: 'Use $\\omega_{p2} \\approx G_{m2}/C_L$ and $P_1\' \\approx 1/(R_1A_2C_c)$.',
    tests: 'the design chain: $C_c$ from the margin, GBW, the Miller pole, $R_z$, and the two slew limits.',
    fig: eqFig([['C_c = \\frac{G_{m1}C_L\\tan 60^\\circ}{G_{m2}}', 260, 30], ["P_1' = \\frac{1}{2\\pi R_1A_2C_c},\\;\\; A_2 = G_{m2}R_2", 380, 28], ['SR = \\min\\left(\\tfrac{I_{SS}}{C_c},\\tfrac{I_7 - I_{SS}}{C_L}\\right)', 500, 28, '#ffd38a']]),
    steps: [
      {
        t: 6, title: '**(a) For 60°, the second pole must sit tan 60° = 1.73 times above the GBW.** Write both with the dictionary and solve for $C_c$.',
        tex: 'C_c = \\frac{G_{m1}C_L\\tan 60^\\circ}{G_{m2}} = \\frac{0.8\\,\\mathrm{mS}\\times 4\\,\\mathrm{pF}\\times 1.732}{4\\,\\mathrm{mS}} = 1.39\\,\\mathrm{pF}',
        try: {
          q: '(a) Find $C_c$ for PM = 60° in unity feedback. With $R_z = 1/G_{m2}$ the RHP zero is gone, so only the second pole costs phase.',
          answer: ans('bank-ps2-p4', 'cc'), unit: 'F', tol: 0.02,
          hint: ['PM = 90° − tan⁻¹(ω_u/ω_p2) = 60° means the second pole may take 30°, i.e. $\\omega_{p2} = \\omega_u\\tan 60^\\circ$. Use $\\omega_u = G_{m1}/C_c$ and $\\omega_{p2} = G_{m2}/C_L$.', '$C_c = \\dfrac{G_{m1}C_L\\tan 60^\\circ}{G_{m2}}$'],
          how: [
            'A 60° margin lets the second pole take only 30° at $\\omega_u$: $$\\tan^{-1}\\frac{\\omega_u}{\\omega_{p2}} = 30^\\circ \\;\\Rightarrow\\; \\omega_{p2} = \\omega_u\\tan 60^\\circ = 1.732\\,\\omega_u$$',
            'Dictionary: $$\\frac{G_{m2}}{C_L} = 1.732\\,\\frac{G_{m1}}{C_c}$$',
            'Solve for $C_c$: $$C_c = \\frac{G_{m1}C_L\\tan 60^\\circ}{G_{m2}} = \\frac{0.8\\,\\mathrm{mS}\\times 4\\,\\mathrm{pF}\\times 1.732}{4\\,\\mathrm{mS}} = 1.39\\,\\mathrm{pF}$$',
          ],
          why: 'tan 30° instead of tan 60° gives 0.46 pF: too small, only 30° of margin.',
          calc: [{ what: 'C_c in one line (degree mode, prefixes on)', keys: '0.8m × 4p × [tan] 60 ) ÷ 4m [EXE]', shows: '1.385p' }],
        },
        say: '1.39 pF.',
      },
      {
        t: 14, title: '**(b) GBW = $G_{m1}/(2\\pi C_c)$:** stage 1’s current charging $C_c$.',
        tex: '\\omega_u = \\frac{G_{m1}}{C_c} = \\frac{0.8\\,\\mathrm{mS}}{1.39\\,\\mathrm{pF}} = 577\\,\\mathrm{Mrad/s},\\quad f_u = \\frac{\\omega_u}{2\\pi} = 91.9\\,\\mathrm{MHz}',
        try: {
          q: '(b) Find the GBW (in Hz) with the $C_c$ from (a).',
          answer: ans('bank-ps2-p4', 'fu'), unit: 'Hz', tol: 0.02,
          parts: [{ q: 'Unity-gain frequency in rad/s, $\\omega_u = G_{m1}/C_c$?', answer: IM.p4.wu, unit: 'rad/s', tol: 0.02, hint: 'Use $C_c$ from (a).', how: ['$$\\omega_u = \\frac{0.8\\,\\mathrm{mS}}{1.39\\,\\mathrm{pF}} = 577\\,\\mathrm{Mrad/s}$$'] }],
          hint: ['Above the dominant pole, stage 1’s current charges $C_c$; the gain reaches 1 at $G_{m1}/C_c$ (rad/s).', '$GBW = \\dfrac{G_{m1}}{2\\pi C_c}$'],
          how: [
            'Unity-gain frequency in rad/s: $$\\omega_u = \\frac{G_{m1}}{C_c} = \\frac{0.8\\,\\mathrm{mS}}{1.39\\,\\mathrm{pF}} = 577\\,\\mathrm{Mrad/s}$$',
            'Divide by 2π for hertz: $$GBW = \\frac{577\\,\\mathrm{M}}{2\\pi} = 91.9\\,\\mathrm{MHz}$$',
            'Forgetting the 2π (577 M) is the classic slip.',
          ],
        },
        say: '91.9 MHz.',
      },
      {
        t: 22, title: '**(c) The Miller pole.** Node 1 sees $C_c$ multiplied by $(1 + A_2) \\approx A_2$, with $A_2 = G_{m2}R_2$ = 80, through $R_1$.',
        tex: "A_2 = G_{m2}R_2 = 4\\,\\mathrm{mS}\\times 20\\,\\mathrm{k\\Omega} = 80,\\quad A_2C_c = 80\\times 1.39\\,\\mathrm{pF} = 111\\,\\mathrm{pF},\\quad P_1' = \\frac{1}{2\\pi R_1A_2C_c} = \\frac{1}{2\\pi(111\\,\\mathrm{k})(111\\,\\mathrm{p})} = 12.9\\,\\mathrm{kHz}",
        try: {
          q: "(c) Find the dominant (Miller) pole $P_1'$ in Hz, with the $C_c$ from (a).",
          answer: ans('bank-ps2-p4', 'p1'), unit: 'Hz', tol: 0.02,
          parts: [
            { q: 'Second-stage gain $A_2$ (V/V)?', answer: IM.p4.a2, unit: '', tol: 0.01, hint: '$A_2 = G_{m2}R_2$', how: ['$$A_2 = 4\\,\\mathrm{mS}\\times 20\\,\\mathrm{k\\Omega} = 80$$'] },
            { q: 'Miller capacitance seen at node 1, $\\approx A_2C_c$ (F)?', answer: IM.p4.ceff, unit: 'F', tol: 0.02, hint: '$C_c(1 + A_2) \\approx A_2C_c$', how: ['$$80\\times 1.39\\,\\mathrm{pF} = 111\\,\\mathrm{pF}$$'] },
          ],
          hint: ['Node 1 (stage-1 output) sees $R_1$ and the Miller-multiplied $C_c(1 + A_2)$. First find the second-stage gain $A_2 = G_{m2}R_2$.', "$P_1' \\approx \\dfrac{1}{2\\pi R_1A_2C_c}$"],
          how: [
            'Second-stage gain: $$A_2 = G_{m2}R_2 = 4\\,\\mathrm{mS}\\times 20\\,\\mathrm{k\\Omega} = 80$$',
            'Miller: from node 1, $C_c$ looks $(1 + A_2) \\approx 80$ times bigger: $$C_{eff} \\approx A_2C_c = 80\\times 1.39\\,\\mathrm{pF} = 111\\,\\mathrm{pF}$$',
            "That capacitance with $R_1$: $$P_1' = \\frac{1}{2\\pi R_1A_2C_c} = \\frac{1}{2\\pi(111\\,\\mathrm{k\\Omega})(111\\,\\mathrm{pF})} = 12.9\\,\\mathrm{kHz}$$",
          ],
          calc: [{ what: 'Miller pole (prefixes on)', keys: '1 ÷ ( 2 [SHIFT][7] × 111k × 80 × 1.3856p ) [EXE]', shows: '12.93k', note: 'π is [SHIFT] [7].' }],
        },
        say: '12.9 kHz.',
      },
      {
        t: 30, title: '**(d) $R_z = 1/G_{m2}$** cancels the sneak path through $C_c$, pushing the RHP zero to infinity.',
        tex: 'R_z = \\frac{1}{G_{m2}} = \\frac{1}{4\\,\\mathrm{mS}} = 250\\,\\Omega',
        try: {
          q: '(d) What value of $R_z$ (in series with $C_c$) removes the RHP zero?',
          answer: ans('bank-ps2-p4', 'rz'), unit: 'Ω', tol: 0.01,
          hint: ['With $R_z$ in series, the zero moves to $1/(C_c(1/G_{m2} - R_z))$. Make the bracket zero.', '$R_z = 1/G_{m2}$'],
          how: [
            'With $R_z$ the zero is at $$\\omega_z = \\frac{1}{C_c\\,(1/G_{m2} - R_z)}$$',
            'It goes to infinity when the bracket is zero: $$R_z = \\frac{1}{G_{m2}} = \\frac{1}{4\\,\\mathrm{mS}} = 250\\,\\Omega$$',
            'A larger $R_z$ would move the zero into the left half plane, where it can even cancel the second pole.',
          ],
        },
        say: '250 Ω.',
      },
      {
        t: 37, title: '**(e) Two slew limits; the smaller wins.** $C_c$ is charged by the tail $I_{SS}$; $C_L$ by what is left of $I_7$ after $I_{SS}$ goes into $C_c$.',
        tex: '\\frac{I_{SS}}{C_c} = \\frac{120\\,\\mu\\mathrm{A}}{1.39\\,\\mathrm{pF}} = 86.6\\,\\mathrm{V/\\mu s},\\quad \\frac{I_7 - I_{SS}}{C_L} = \\frac{380\\,\\mu\\mathrm{A}}{4\\,\\mathrm{pF}} = 95\\,\\mathrm{V/\\mu s},\\quad SR = 86.6\\,\\mathrm{V/\\mu s}\\;(\\text{the smaller})',
        try: {
          q: '(e) Find the slew rate, with the $C_c$ from (a). Check both the first stage and the output stage.',
          answer: ans('bank-ps2-p4', 'sr'), unit: 'V/s', tol: 0.02,
          parts: [
            { q: 'First-stage limit $I_{SS}/C_c$ (V/s)?', answer: IM.p4.sr1, unit: 'V/s', tol: 0.02, hint: 'All of $I_{SS}$ charges $C_c$.', how: ['$$\\frac{120\\,\\mu\\mathrm{A}}{1.39\\,\\mathrm{pF}} = 86.6\\,\\mathrm{V/\\mu s}$$'] },
            { q: 'Output-stage limit $(I_7 - I_{SS})/C_L$ (V/s)?', answer: IM.p4.sr2, unit: 'V/s', tol: 0.02, hint: '$I_{SS}$ of $I_7$ already goes into $C_c$.', how: ['$$\\frac{500\\,\\mu - 120\\,\\mu}{4\\,\\mathrm{pF}} = 95\\,\\mathrm{V/\\mu s}$$'] },
          ],
          hint: ['Limit 1: the whole tail $I_{SS}$ charges $C_c$. Limit 2: on a falling edge the current source’s $I_7$ must supply $C_c$’s current $I_{SS}$ and also charge $C_L$. The slower one sets the slew rate.', '$SR = \\min\\left(\\dfrac{I_{SS}}{C_c}\\,;\\; \\dfrac{I_7 - I_{SS}}{C_L}\\right)$'],
          how: [
            'First stage: all of $I_{SS}$ into $C_c$: $$\\frac{I_{SS}}{C_c} = \\frac{120\\,\\mu\\mathrm{A}}{1.39\\,\\mathrm{pF}} = 86.6\\,\\mathrm{V/\\mu s}$$',
            'Output stage: $I_{SS}$ of $I_7$ already goes into $C_c$, the rest charges $C_L$: $$\\frac{I_7 - I_{SS}}{C_L} = \\frac{380\\,\\mu\\mathrm{A}}{4\\,\\mathrm{pF}} = 95\\,\\mathrm{V/\\mu s}$$',
            'The smaller limit wins: 86.6 V/µs (set by $C_c$).',
          ],
        },
        say: '86.6 V/µs from $C_c$; the output stage could do 95, so $C_c$ limits.',
      },
      { t: 45, ans: true, title: '**Answers:** 1.39 pF · 91.9 MHz · 12.9 kHz · 250 Ω · 86.6 V/µs', say: 'The order to remember: margin → $C_c$ → GBW → Miller pole → $R_z$ → slew.' },
    ],
  });
}, { q: 'Problem Set 2 P4' });

const M25 = 'pyq-m25-q2';
scene(L17, '2025 mid-sem Q2, part 1: Cc, I5, (W/L)1 and (W/L)3', 62, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 8 OF 9 (PART 1)', title: 'Design a Miller two-stage op amp (14 marks)', src: 'Mid-sem 2025-26 Q2 · 14 marks', paper: 'm25q2',
    q: 'DC gain 60 dB, GBW 50 MHz, PM ≥ 60°, SR 50 V/µs, ICMR(+) 1.6 V, ICMR(−) 0.9 V, $C_L$ = 5 pF; minimum $C_c$ for 60°. $\\mu_nC_{ox}$ = 300, $\\mu_pC_{ox}$ = 60 µA/V², $V_{th1}$ = 0.47–0.59 V, $|V_{th3}|_{max}$ = 0.51 V, $V_{DD}$ = 1.8 V.', qh: 250,
    giv: 'NMOS input pair M1, M2; PMOS mirror load M3, M4; M5 = M6 (so $I = I_5$). Standard choice: RHP zero at 10 × GBW.',
    tests: 'Allen’s design order: $C_c$ from the margin, $I_5$ from SR, $(W/L)_1$ from GBW, $(W/L)_3$ from ICMR(+), $(W/L)_5$ from ICMR(−), then the output stage.',
    fig: paperFig('m25q2f', [['C_c = 0.22\\,C_L,\\quad I_5 = SR\\cdot C_c', 580, 26], ['g_{m1} = 2\\pi\\,GBW\\,C_c,\\;\\; (W/L)_1 = \\frac{g_{m1}^2}{2\\mu_nC_{ox}I_{D1}}', 670, 24], ['(W/L)_3 = \\frac{2I_{D1}}{\\mu_pC_{ox}(V_{DD} - V_{in,max} - |V_{th3}|_{max} + V_{th1,min})^2}', 770, 20, '#ffd38a']], 400),
    steps: [
      {
        t: 6, title: '**① $C_c$ from the margin.** With the zero at 10 × GBW ($g_{m7} = 10g_{m1}$), 60° needs $C_c \\ge 0.22\\,C_L$ (Allen’s rule); take the minimum.',
        tex: '\\tan^{-1}\\frac{\\omega_u}{\\omega_{p2}} = 90^\\circ - 60^\\circ - 5.71^\\circ = 24.29^\\circ,\\quad \\frac{C_c}{C_L} = \\frac{1}{10\\tan 24.29^\\circ} = 0.22,\\quad C_c = 0.22\\times 5\\,\\mathrm{pF} = 1.1\\,\\mathrm{pF}',
        try: {
          q: '① Find the minimum $C_c$ for PM = 60°, with the RHP zero placed at 10 × GBW.',
          answer: ans(M25, 'cc'), unit: 'F', tol: 0.01,
          parts: [
            { q: 'Phase the second pole may take at $\\omega_u$ (degrees)?', answer: IM.m25.ang, unit: '°', tol: 0.01, hint: '90° left after the dominant pole, minus 60° of margin, minus the zero’s $\\tan^{-1}(0.1)$.', how: ['$$90^\\circ - 60^\\circ - 5.71^\\circ = 24.29^\\circ$$'] },
            { q: 'Smallest $C_c/C_L$ (with $g_{m7} = 10g_{m1}$)?', answer: IM.m25.ratio, unit: '', tol: 0.02, hint: '$\\dfrac{\\omega_u}{\\omega_{p2}} = \\dfrac{g_{m1}C_L}{g_{m7}C_c} = \\tan 24.29^\\circ$', how: ['$$\\frac{C_c}{C_L} = \\frac{1}{10\\tan 24.29^\\circ} = 0.22$$'] },
          ],
          hint: ['The zero at 10·GBW costs tan⁻¹(0.1) = 5.7° and the dominant pole 90°, so the second pole may take 24.3°. With $g_{m7} = 10g_{m1}$ that gives Allen’s rule.', '$C_c \\ge 0.22\\,C_L$'],
          how: [
            'Phase budget for the second pole: $$\\tan^{-1}\\frac{\\omega_u}{\\omega_{p2}} = 90^\\circ - 60^\\circ - \\tan^{-1}(0.1) = 24.29^\\circ$$',
            'With $\\omega_u = g_{m1}/C_c$, $\\omega_{p2} = g_{m7}/C_L$ and $g_{m7} = 10g_{m1}$: $$\\frac{C_c}{C_L} = \\frac{1}{10\\tan 24.29^\\circ} = \\frac{1}{10(0.451)} = 0.22$$',
            'Minimum capacitor: $$C_c = 0.22\\times 5\\,\\mathrm{pF} = 1.1\\,\\mathrm{pF}$$',
          ],
        },
        say: '1.1 pF.',
      },
      {
        t: 13, title: '**② The slew rate sets the tail current:** in a big step all of $I_5$ charges $C_c$, so $I_5 = SR\\times C_c$.',
        tex: stepTex(M25, 1),
        try: {
          q: '② Find the tail current $I_5$ from the slew-rate spec, with $C_c$ from ①.',
          answer: ans(M25, 'i'), unit: 'A', tol: 0.01,
          hint: ['During slewing the whole tail current charges $C_c$: $SR = I_5/C_c$. Read it backwards.', '$I_5 = SR\\times C_c$'],
          how: [
            'Slewing: $C_c$ is charged by all of $I_5$: $$SR = \\frac{I_5}{C_c}$$',
            'Read it backwards: $$I_5 = SR\\times C_c = 50\\,\\mathrm{V/\\mu s}\\times 1.1\\,\\mathrm{pF} = 55\\,\\mu\\mathrm{A}$$',
            'Units trick: V/µs × pF = µA, so it is just 50 × 1.1.',
          ],
        },
        say: '55 µA.',
      },
      {
        t: 20, title: '**③ The GBW spec fixes $g_{m1}$**, and the square law at $I_{D1} = I_5/2$ then gives $(W/L)_{1,2}$ (NMOS pair).',
        tex: stepTex(M25, 2),
        try: {
          q: '③ Size the NMOS input pair: find $(W/L)_{1,2}$ from the GBW spec (use $C_c$ and $I_5$ from ① and ②).',
          answer: ans(M25, 'wl1'), unit: '', tol: 0.02,
          parts: [
            { q: 'Required $g_{m1}$ from the GBW spec (S)?', answer: IM.m25.gm1, unit: 'S', tol: 0.02, hint: '$g_{m1} = 2\\pi\\,GBW\\,C_c$', how: ['$$g_{m1} = 2\\pi(50\\,\\mathrm{M})(1.1\\,\\mathrm{p}) = 0.346\\,\\mathrm{mS}$$'] },
            { q: 'Drain current of each input device $I_{D1}$ (A)?', answer: IM.m25.id1, unit: 'A', tol: 0.01, hint: 'The tail splits in two.', how: ['$$I_{D1} = 55\\,\\mu/2 = 27.5\\,\\mu\\mathrm{A}$$'] },
          ],
          hint: ['GBW = $g_{m1}/(2\\pi C_c)$ gives the $g_{m1}$ you need; each input device carries $I_5/2$. Then use $g_m = \\sqrt{2\\mu_nC_{ox}(W/L)I_D}$.', '$g_{m1} = 2\\pi\\,GBW\\,C_c$, $(W/L)_1 = \\dfrac{g_{m1}^2}{2\\mu_nC_{ox}I_{D1}}$'],
          how: [
            'Required $g_{m1}$ from the GBW: $$g_{m1} = 2\\pi\\,GBW\\,C_c = 2\\pi(50\\,\\mathrm{MHz})(1.1\\,\\mathrm{pF}) = 0.346\\,\\mathrm{mS}$$',
            'Current per input device: $$I_{D1} = \\frac{I_5}{2} = \\frac{55\\,\\mu\\mathrm{A}}{2} = 27.5\\,\\mu\\mathrm{A}$$',
            'Square law turned round: $$(W/L)_{1,2} = \\frac{g_{m1}^2}{2\\mu_nC_{ox}I_{D1}} = \\frac{(0.346\\,\\mathrm{mS})^2}{2(300\\,\\mu)(27.5\\,\\mu)} = 7.24$$',
          ],
          calc: [{ what: 'W/L in one line (prefixes on)', keys: '( 2 [SHIFT][7] × 50M × 1.1p ) [x²] ÷ ( 2 × 300µ × 27.5µ ) [EXE]', shows: '7.238' }],
        },
        say: '$g_{m1}$ = 0.346 mS and $(W/L)_{1,2}$ = 7.24.',
      },
      {
        t: 30, title: '**④ ICMR(+) sizes the mirror load.** At the highest input M1 is at its saturation edge; the voltage left for M3’s overdrive uses the worst-case thresholds.',
        tex: '|V_{ov3}| = V_{DD} - V_{in,max} - |V_{th3}|_{max} + V_{th1,min} = 1.8 - 1.6 - 0.51 + 0.47 = 0.16\\,\\mathrm{V},\\quad (W/L)_{3,4} = \\frac{2I_{D3}}{\\mu_pC_{ox}|V_{ov3}|^2} = \\frac{2(27.5\\,\\mu)}{60\\,\\mu(0.16)^2} = 35.8',
        try: {
          q: '④ Size the PMOS mirror load: find $(W/L)_{3,4}$ from ICMR(+) = 1.6 V. M3 carries $I_{D1}$ = 27.5 µA (from ③).',
          answer: ans(M25, 'wl3'), unit: '', tol: 0.02,
          parts: [{ q: 'Overdrive left for M3, $|V_{ov3}|$ (V)?', answer: IM.m25.vov3, unit: 'V', tol: 0.02, hint: '$|V_{ov3}| = V_{DD} - V_{in,max} - |V_{th3}|_{max} + V_{th1,min}$', how: ['$$1.8 - 1.6 - 0.51 + 0.47 = 0.16\\,\\mathrm{V}$$'] }],
          hint: ['Check on M1 (NMOS, gate = $V_{in}$): it stays saturated while its drain is above $V_{in} - V_{th1}$. Link on M3 (PMOS diode, source = $V_{DD}$): that drain sits at $V_{DD} - |V_{GS3}|$. Use the worst cases (largest $|V_{th3}|$, smallest $V_{th1}$); what is left is M3’s overdrive.', '$|V_{ov3}| = V_{DD} - V_{in,max} - |V_{th3}|_{max} + V_{th1,min}$, then $(W/L)_3 = \\dfrac{2I_{D3}}{\\mu_pC_{ox}|V_{ov3}|^2}$'],
          how: [
            'M3 is a PMOS diode (source = $V_{DD}$, gate = drain = M1’s drain), so by the link $|V_{GS3}| = |V_{th3}| + |V_{ov3}|$ M1’s drain sits at $V_{DD} - |V_{GS3}|$. M1 (NMOS, gate = $V_{in}$) must stay saturated, a check: drain ≥ $V_{in} - V_{th1}$. At the edge: $$V_{DD} - |V_{th3}| - |V_{ov3}| = V_{in,max} - V_{th1}$$',
            'Solve with the worst-case thresholds: $$|V_{ov3}| = 1.8 - 1.6 - 0.51 + 0.47 = 0.16\\,\\mathrm{V}$$',
            'Square law for M3 at 27.5 µA: $$(W/L)_{3,4} = \\frac{2I_{D3}}{\\mu_pC_{ox}|V_{ov3}|^2} = \\frac{2(27.5\\,\\mu)}{60\\,\\mu\\,(0.16)^2} = 35.8$$',
          ],
          calc: [{ what: 'W/L in one line (prefixes on)', keys: '2 × 27.5µ ÷ ( 60µ × ( 1.8 − 1.6 − 0.51 + 0.47 ) [x²] ) [EXE]', shows: '35.81' }],
        },
        say: 'Only 0.16 V of overdrive left for M3: $(W/L)_{3,4}$ = 35.8.',
      },
      { t: 40, ans: true, title: '**So far:** $C_c$ = 1.1 pF · $I_5$ = 55 µA · $(W/L)_1$ = 7.24 · $(W/L)_3$ = 35.8', say: 'Part 2: the tail and the output stage.' },
    ],
  });
}, { q: 'Mid-sem 2025 Q2 (1)' });

scene(L17, '2025 mid-sem Q2, part 2: (W/L)5, (W/L)7, (W/L)8', 54, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 8 OF 9 (PART 2)', title: 'The tail and the output stage', src: 'Mid-sem 2025-26 Q2 · 14 marks',
    q: 'Continue: ICMR(−) = 0.9 V sets $(W/L)_5$ (= $(W/L)_6$); the RHP zero at 10·GB sets $g_{m7} = 10g_{m1}$; a perfect mirror means $|V_{ov7}| = |V_{ov3}|$; M8 mirrors M5 and carries $I_7$.', qh: 210,
    giv: '$\\mu_nC_{ox}$ = 300, $\\mu_pC_{ox}$ = 60 µA/V², $V_{th1,max}$ = 0.59 V. Part 1: $I_5$ = 55 µA, $I_{D1}$ = 27.5 µA, $g_{m1}$ = 0.346 mS, $(W/L)_1$ = 7.24, $|V_{ov3}|$ = 0.16 V. M5, M8 NMOS; M7 PMOS.',
    tests: 'the floor check for the tail, the zero rule for the output device, and a mirror ratio for its current source.',
    fig: paperFig('m25q2f', [['V_{ov5} = V_{in,min} - V_{GS1} - \\ldots', 580, 24], ['g_{m7} = 10\\,g_{m1},\\;\\; (W/L)_7 = \\frac{g_{m7}}{\\mu_pC_{ox}|V_{ov3}|}', 670, 24], ['(W/L)_8 = (W/L)_5\\,\\frac{I_7}{I_5}', 770, 26, '#ffd38a']], 400),
    steps: [
      {
        t: 6, title: '**⑤ ICMR(−) sizes the tail.** At the lowest input, $V_{GS1}$ (with the largest $V_{th1}$) uses most of the 0.9 V; what is left is M5’s overdrive.',
        tex: '\\begin{aligned} V_{ov1} &= \\sqrt{\\tfrac{2(27.5\\,\\mu)}{300\\,\\mu(7.24)}} = 0.159\\,\\mathrm{V} \\\\ V_{ov5} &= V_{in,min} - V_{ov1} - V_{th1,max} = 0.9 - 0.159 - 0.59 = 0.151\\,\\mathrm{V} \\\\ (W/L)_{5,6} &= \\frac{2I_5}{\\mu_nC_{ox}V_{ov5}^2} = \\frac{2(55\\,\\mu)}{300\\,\\mu(0.151)^2} = 16.1 \\end{aligned}',
        try: {
          q: '⑤ Size the tail M5 (= M6) from ICMR(−) = 0.9 V. (Values from part 1 are on the card.)',
          answer: ans(M25, 'wl5'), unit: '', tol: 0.02,
          parts: [
            { q: 'Overdrive of M1 at $I_{D1}$ = 27.5 µA, $V_{ov1}$ (V)?', answer: IM.m25.vov1, unit: 'V', tol: 0.02, hint: '$V_{ov1} = \\sqrt{2I_{D1}/(\\mu_nC_{ox}(W/L)_1)}$', how: ['$$V_{ov1} = \\sqrt{\\frac{2(27.5\\,\\mu)}{300\\,\\mu\\times 7.24}} = 0.159\\,\\mathrm{V}$$'] },
            { q: 'Overdrive left for the tail, $V_{ov5}$ (V)?', answer: IM.m25.vov5, unit: 'V', tol: 0.02, hint: '$V_{ov5} = V_{in,min} - V_{ov1} - V_{th1,max}$', how: ['$$0.9 - 0.159 - 0.59 = 0.151\\,\\mathrm{V}$$'] },
          ],
          hint: ['Link on M1 (NMOS, gate = $V_{in}$, source = the tail node): at the lowest input the tail node (M5’s drain) is at $V_{in,min} - V_{GS1}$. Check on M5 (NMOS, source = $V_{SS}$ = 0): it needs $V_{DS5} \\ge V_{ov5}$ there. Use the largest $V_{th1}$ (worst case).', '$V_{ov5} = V_{in,min} - \\sqrt{\\dfrac{2I_{D1}}{\\mu_nC_{ox}(W/L)_1}} - V_{th1,max}$, then $(W/L)_5 = \\dfrac{2I_5}{\\mu_nC_{ox}V_{ov5}^2}$'],
          how: [
            'Overdrive of M1 at 27.5 µA: $$V_{ov1} = \\sqrt{\\frac{2I_{D1}}{\\mu_nC_{ox}(W/L)_1}} = \\sqrt{\\frac{2(27.5\\,\\mu)}{300\\,\\mu\\times 7.24}} = 0.159\\,\\mathrm{V}$$',
            'Link M1 from its gate ($V_{in,min}$) down to its source, the tail node, with $V_{GS1} = V_{th1} + V_{ov1}$; M5 (source = $V_{SS}$ = 0) needs $V_{DS5} \\ge V_{ov5}$ (check), so at the edge: $$V_{ov5} = V_{in,min} - V_{ov1} - V_{th1,max} = 0.9 - 0.159 - 0.59 = 0.151\\,\\mathrm{V}$$',
            'Square law for the tail: $$(W/L)_{5,6} = \\frac{2I_5}{\\mu_nC_{ox}V_{ov5}^2} = \\frac{2(55\\,\\mu)}{300\\,\\mu\\,(0.151)^2} = 16.1$$',
          ],
          calc: [{ what: 'All of ⑤ in one line (prefixes on)', keys: '2 × 55µ ÷ ( 300µ × ( 0.9 − √( 2 × 27.5µ ÷ ( 300µ × 7.238 ) ) − 0.59 ) [x²] ) [EXE]', shows: '16.11' }],
        },
        say: '$(W/L)_{5,6}$ = 16.1.',
      },
      {
        t: 15, title: '**⑥ The zero at 10 × GBW needs $g_{m7} = 10g_{m1}$**, and a perfect mirror gives M7 the same overdrive as M3; $g_m = \\mu_pC_{ox}(W/L)|V_{ov}|$ gives its size.',
        tex: 'g_{m7} = 10g_{m1} = 3.46\\,\\mathrm{mS},\\quad (W/L)_7 = \\frac{g_{m7}}{\\mu_pC_{ox}|V_{ov3}|} = \\frac{3.46\\,\\mathrm{mS}}{60\\,\\mu\\times 0.16} = 360',
        try: {
          q: '⑥ Size the PMOS output device: find $(W/L)_7$.',
          answer: ans(M25, 'wl7'), unit: '', tol: 0.02,
          parts: [{ q: 'Required $g_{m7}$ (S)?', answer: IM.m25.gm7, unit: 'S', tol: 0.02, hint: 'Zero at 10 × GBW: $g_{m7} = 10g_{m1}$.', how: ['$$g_{m7} = 10(0.346\\,\\mathrm{mS}) = 3.46\\,\\mathrm{mS}$$'] }],
          hint: ['RHP zero at 10·GBW: $g_{m7}/C_c = 10\\,g_{m1}/C_c$, so $g_{m7} = 10g_{m1}$. M7’s gate sits at the mirror’s drain voltage, so with a perfect mirror it has M3’s overdrive.', '$g_m = \\mu_pC_{ox}(W/L)|V_{ov}| \\;\\Rightarrow\\; (W/L)_7 = \\dfrac{g_{m7}}{\\mu_pC_{ox}|V_{ov3}|}$'],
          how: [
            'Zero at 10 × GBW: $$\\frac{g_{m7}}{C_c} = 10\\,\\frac{g_{m1}}{C_c} \\;\\Rightarrow\\; g_{m7} = 10g_{m1} = 10(0.346\\,\\mathrm{mS}) = 3.46\\,\\mathrm{mS}$$',
            'M7 is PMOS: source = $V_{DD}$, gate = stage-1 output (drain of M2/M4). A perfect mirror puts that node at $V_{DD} - |V_{GS3}|$, so $|V_{GS7}| = |V_{GS3}|$ (link) and $|V_{ov7}| = |V_{ov3}| = 0.16$ V (from ④).',
            'Use $g_m = \\mu_pC_{ox}(W/L)|V_{ov}|$: $$(W/L)_7 = \\frac{g_{m7}}{\\mu_pC_{ox}|V_{ov3}|} = \\frac{3.46\\,\\mathrm{mS}}{60\\,\\mu\\times 0.16} = 360$$',
          ],
        },
        say: '$(W/L)_7$ = 360: a wide output device.',
      },
      {
        t: 24, title: '**⑦ M8 must carry $I_7$.** Find $I_7$ from M7’s square law, then M8 copies M5 scaled by the current ratio.',
        tex: stepTex(M25, 6),
        try: {
          q: '⑦ Size the output current source M8 (it mirrors M5). Use $(W/L)_7$ = 360 from ⑥ and $(W/L)_5$ = 16.1 from ⑤.',
          answer: ans(M25, 'wl8'), unit: '', tol: 0.02,
          parts: [{ q: 'Current in M7, $I_7$ (A)?', answer: IM.m25.i7, unit: 'A', tol: 0.02, hint: '$I_7 = \\tfrac12\\mu_pC_{ox}(W/L)_7|V_{ov3}|^2$', how: ['$$I_7 = \\tfrac12(60\\,\\mu)(360)(0.16)^2 = 276\\,\\mu\\mathrm{A}$$'] }],
          hint: ['First get M7’s current from its square law; M8 must sink exactly that. M8 and M5 share a gate voltage, so currents scale with W/L.', '$I_7 = \\tfrac12\\mu_pC_{ox}(W/L)_7|V_{ov3}|^2$, $(W/L)_8 = (W/L)_5\\dfrac{I_7}{I_5}$'],
          how: [
            'Current in M7: $$I_7 = \\tfrac12\\mu_pC_{ox}(W/L)_7|V_{ov3}|^2 = \\tfrac12(60\\,\\mu)(360)(0.16)^2 = 276\\,\\mu\\mathrm{A}$$',
            'M8 (NMOS, source = $V_{SS}$) shares its gate with M5 and M6, so the same $V_{GS}$ (link) and sizes scale with currents: $$(W/L)_8 = (W/L)_5\\frac{I_7}{I_5} = 16.1\\times\\frac{276\\,\\mu\\mathrm{A}}{55\\,\\mu\\mathrm{A}} = 81$$',
          ],
          why: 'The fixed order: $C_c$ → $I_5$ → (W/L)₁ → (W/L)₃ → (W/L)₅ → (W/L)₇ → (W/L)₈.',
        },
        say: '$I_7$ = 276 µA and $(W/L)_8$ = 81.',
      },
      { t: 33, ans: true, title: '**All answers:** $C_c$ 1.1 pF · $I_5$ 55 µA · (W/L)₁ 7.24 · (W/L)₃ 35.8 · (W/L)₅ 16.1 · (W/L)₇ 360 · (W/L)₈ 81', say: 'Seven steps in a fixed order. Write the order down first in the exam, then fill in numbers.' },
    ],
  });
}, { q: 'Mid-sem 2025 Q2 (2)' });

/* compre 2023-24 Q8, computed here from the printed data (checks: key 115.6 µA, 1581, 16.04 MHz, 46.26 V/µs, 7.514 mW, 50.91°) */
const CQ8 = (() => {
  const kn = 110e-6, kp = 50e-6, ln = 0.04, lp = 0.05, vt = 0.7, vsup = 5;
  const x = (vsup - 2 * vt) / (Math.sqrt(2 / kn) + Math.sqrt(2 / kp)), i8 = x * x;
  const i5 = 2 * i8, i7 = 10 * i8, id1 = i5 / 2;
  const gm1 = Math.sqrt(2 * kn * 10 * id1), r1 = 1 / (1 / (1 / (ln * id1)) + 1 / (1 / (lp * id1)));
  const gm6 = Math.sqrt(2 * kp * 100 * i7), r2 = 1 / (ln * i7 + lp * i7);
  const a0 = gm1 * r1 * gm6 * r2, cc = 5e-12, cl = 20e-12;
  const gbw = gm1 / (2 * Math.PI * cc), sr = i5 / cc, pw = vsup * (i8 + i5 + i7);
  const fp2 = gm6 / (2 * Math.PI * cl), fz = gm6 / (2 * Math.PI * cc);
  const pm = 90 - Math.atan(gbw / fp2) * DEG - Math.atan(gbw / fz) * DEG;
  return { x, i8, i5, i7, gm1, r1, r2, a1: gm1 * r1, a2: gm6 * r2, a0, gbw, sr, pw, fp2, fz, pm, gm6, ap: Math.atan(gbw / fp2) * DEG, az: Math.atan(gbw / fz) * DEG };
})();
scene(L17, 'Compre 2023-24 Q8: a full two-stage analysis', 64, (S) => {
  pyqFrame(S, {
    tag: 'LEC 17 · QUESTION 9 OF 9 (COMPRE STYLE)', title: 'Currents, gain, GBP, SR, power, PM', src: 'Compre 2023-24 Q8 · 10 marks', paper: 'c24q8',
    q: 'Two-stage op amp, ±2.5 V, $C_c$ = 5 pF, $C_L$ = 20 pF, sizes in the figure. $V_{Tn} = |V_{Tp}|$ = 0.7 V, $\\mu_nC_{ox}$ = 110, $\\mu_pC_{ox}$ = 50 µA/V², $\\lambda_n$ = 0.04, $\\lambda_p$ = 0.05 V⁻¹. Find $I_8$, $I_5$, $I_7$, the DC gain, GBP, SR, power and PM.', qh: 250,
    giv: 'Sizes: M9 (PMOS diode) 1/1, M8 (NMOS diode) 1/1, M5 2/1, M7 10/1, M1, M2 (NMOS) 10/1, M3, M4 (PMOS) 10/1, M6 (PMOS) 100/1. All saturated; PM for β = 1.',
    tests: 'the same Miller dictionary on a ±2.5 V circuit: a diode stack sets $I_8$, mirrors give the rest.',
    fig: paperFig('c24q8f', [['5\\,\\mathrm{V} = \\sqrt{\\tfrac{2I_8}{\\mu_nC_{ox}}} + 0.7 + \\sqrt{\\tfrac{2I_8}{\\mu_pC_{ox}}} + 0.7,\\;\\; I_5 = 2I_8,\\; I_7 = 10I_8', 590, 22], ['A_0 = g_{m1}(r_{O2}\\parallel r_{O4})\\cdot g_{m6}(r_{O6}\\parallel r_{O7})', 680, 24], ['PM = 90^\\circ - \\tan^{-1}\\tfrac{GBP}{f_{p2}} - \\tan^{-1}\\tfrac{GBP}{f_z}', 770, 24, '#ffd38a']], 400),
    steps: [
      {
        t: 6, title: '**The bias branch:** M9 and M8 are diodes in series across 5 V, so their two $V_{GS}$ add up to 5 V. Then M5 = 2 × M8 and M7 = 10 × M8 by mirror ratio.',
        tex: `\\sqrt{I_8}\\,(134.8 + 200) = 5 - 1.4 = 3.6 \\Rightarrow I_8 = ${fx(CQ8.i8 * 1e6, 4)}\\,\\mu\\mathrm{A},\\quad I_5 = 2I_8 = ${fx(CQ8.i5 * 1e6, 4)}\\,\\mu\\mathrm{A},\\quad I_7 = 10I_8 = ${fx(CQ8.i7 * 1e3, 4)}\\,\\mathrm{mA}`,
        try: {
          q: 'Find the bias current $I_8$ in the diode branch (M9 and M8 in series across the 5 V supply, both W/L = 1).',
          answer: CQ8.i8, unit: 'A', tol: 0.01,
          parts: [
            { q: 'Voltage left for the two overdrives together (V)?', answer: 3.6, unit: 'V', tol: 0.01, hint: 'The two $|V_{GS}|$ add to 5 V; take away the two 0.7 V thresholds.', how: ['$$5 - 2(0.7) = 3.6\\,\\mathrm{V}$$'] },
            { q: 'Solve $\\sqrt{I_8}\\,(\\sqrt{2/110\\mu} + \\sqrt{2/50\\mu}) = 3.6$ for $\\sqrt{I_8}$ (in √A)?', answer: CQ8.x, unit: '', tol: 0.01, hint: 'The two square roots are 134.8 and 200.', how: ['$$\\sqrt{I_8} = \\frac{3.6}{134.8 + 200} = 0.01075$$'] },
          ],
          hint: ['Both are diode-connected and carry the same $I_8$, and their $V_{GS}$ add up to the full 5 V. Each $|V_{GS}| = 0.7 + \\sqrt{2I_8/\\mu C_{ox}}$.', '$5 - 2(0.7) = \\sqrt{I_8}\\left(\\sqrt{\\tfrac{2}{\\mu_nC_{ox}}} + \\sqrt{\\tfrac{2}{\\mu_pC_{ox}}}\\right)$'],
          how: [
            'M9 is a PMOS diode (source = $V_{DD}$, gate = drain) and M8 an NMOS diode (source = $V_{SS}$, gate = drain), in series with the same $I_8$. Link each, $|V_{GS}| = |V_{th}| + |V_{ov}|$; together they span the rails: $$V_{GS8} + |V_{GS9}| = 2.5 - (-2.5) = 5\\,\\mathrm{V}$$',
            'Take away the two thresholds; the overdrives share the rest: $$\\sqrt{\\frac{2I_8}{\\mu_nC_{ox}}} + \\sqrt{\\frac{2I_8}{\\mu_pC_{ox}}} = 5 - 1.4 = 3.6\\,\\mathrm{V}$$',
            'Pull out $\\sqrt{I_8}$ ($\\sqrt{2/110\\,\\mu} = 134.8$, $\\sqrt{2/50\\,\\mu} = 200$): $$\\sqrt{I_8} = \\frac{3.6}{134.8 + 200} = 0.01075$$',
            'Square it: $$I_8 = (0.01075)^2 = 115.6\\,\\mu\\mathrm{A}$$',
            'M5 and M7 (NMOS, source = $V_{SS}$) share M8’s gate, so the same $V_{GS}$ (link): currents scale with W/L, $I_5 = 2I_8 = 231$ µA and $I_7 = 10I_8 = 1.156$ mA.',
          ],
          calc: [{ what: 'I₈ in one line (prefixes on)', keys: '( 3.6 ÷ ( √( 2 ÷ 110µ ) + √( 2 ÷ 50µ ) ) ) [x²] [EXE]', shows: '115.6µ' }],
        },
        say: 'The overdrives share 3.6 V: $I_8$ = 115.6 µA. M5 is twice M8 and M7 ten times: 231 µA and 1.156 mA.',
      },
      {
        t: 16, title: '**DC gain = $A_1 \\times A_2$.** Stage 1: $g_{m1}$ at $I_5/2$ into $r_{O2}\\parallel r_{O4}$. Stage 2: $g_{m6}$ at $I_7$ into $r_{O6}\\parallel r_{O7}$.',
        tex: `\\begin{aligned} g_{m1} &= ${fx(CQ8.gm1 * 1e3, 3)}\\,\\mathrm{mS},\\;\\; r_{O2}\\parallel r_{O4} = \\tfrac{1}{0.09\\times 115.6\\,\\mu} = 96.1\\,\\mathrm{k\\Omega} \\\\ A_1 &= ${fx(CQ8.gm1 * 1e3, 3)}\\,\\mathrm{mS}\\times 96.1\\,\\mathrm{k\\Omega} = ${fx(CQ8.a1, 3)} \\\\ g_{m6} &= ${fx(CQ8.gm6 * 1e3, 3)}\\,\\mathrm{mS},\\;\\; r_{O6}\\parallel r_{O7} = \\tfrac{1}{0.09\\times 1.156\\,\\mathrm{m}} = 9.61\\,\\mathrm{k\\Omega} \\\\ A_2 &= ${fx(CQ8.gm6 * 1e3, 3)}\\,\\mathrm{mS}\\times 9.61\\,\\mathrm{k\\Omega} = ${fx(CQ8.a2, 3)} \\\\ A_0 &= A_1A_2 = ${fx(CQ8.a0, 4)} \\end{aligned}`,
        try: {
          q: 'Find the DC gain $A_0$ (V/V), using the currents from the last step.',
          answer: CQ8.a0, unit: '', tol: 0.02,
          parts: [
            { q: '$g_{m1}$ (NMOS, W/L = 10, at $I_5/2$) in S?', answer: CQ8.gm1, unit: 'S', tol: 0.02, hint: '$g_{m1} = \\sqrt{2\\mu_nC_{ox}(W/L)I_D}$, $I_D = I_5/2 = I_8$', how: ['$$g_{m1} = \\sqrt{2(110\\,\\mu)(10)(115.6\\,\\mu)} = 0.504\\,\\mathrm{mS}$$'] },
            { q: 'Stage-1 output resistance $r_{O2}\\parallel r_{O4}$ (Ω)?', answer: CQ8.r1, unit: 'Ω', tol: 0.02, hint: 'Same current in both: $1/((\\lambda_n + \\lambda_p)I_D)$', how: ['$$\\frac{1}{0.09\\times 115.6\\,\\mu} = 96.1\\,\\mathrm{k\\Omega}$$ ($r_{O2}$ = 216 kΩ, $r_{O4}$ = 173 kΩ)'] },
            { q: 'Stage-1 gain $A_1$?', answer: CQ8.a1, unit: '', tol: 0.02, hint: '$A_1 = g_{m1}(r_{O2}\\parallel r_{O4})$', how: ['$$A_1 = 0.504\\,\\mathrm{mS}\\times 96.1\\,\\mathrm{k\\Omega} = 48.5$$'] },
            { q: '$g_{m6}$ (PMOS, W/L = 100, at $I_7$) in S?', answer: CQ8.gm6, unit: 'S', tol: 0.02, hint: '$g_{m6} = \\sqrt{2\\mu_pC_{ox}(W/L)_6I_7}$', how: ['$$g_{m6} = \\sqrt{2(50\\,\\mu)(100)(1.156\\,\\mathrm{m})} = 3.40\\,\\mathrm{mS}$$'] },
            { q: 'Stage-2 output resistance $r_{O6}\\parallel r_{O7}$ (Ω)?', answer: CQ8.r2, unit: 'Ω', tol: 0.02, hint: '$1/((\\lambda_n + \\lambda_p)I_7)$', how: ['$$\\frac{1}{0.09\\times 1.156\\,\\mathrm{m}} = 9.61\\,\\mathrm{k\\Omega}$$'] },
            { q: 'Stage-2 gain $A_2$?', answer: CQ8.a2, unit: '', tol: 0.02, hint: '$A_2 = g_{m6}(r_{O6}\\parallel r_{O7})$', how: ['$$A_2 = 3.40\\,\\mathrm{mS}\\times 9.61\\,\\mathrm{k\\Omega} = 32.7$$'] },
          ],
          hint: ['Each stage is $g_m$ × (the two $r_O$ at its output in parallel). The two devices of a stage carry the same current, so $r_{On}\\parallel r_{Op} = 1/((\\lambda_n + \\lambda_p)I_D)$.', '$A_0 = \\sqrt{2\\mu_nC_{ox}(10)\\tfrac{I_5}{2}}\\cdot\\dfrac{1}{0.09\\cdot I_5/2}\\;\\times\\;\\sqrt{2\\mu_pC_{ox}(100)I_7}\\cdot\\dfrac{1}{0.09\\cdot I_7}$'],
          how: [
            'Stage 1: each input device carries $I_5/2$ = 115.6 µA: $$g_{m1} = \\sqrt{2(110\\,\\mu)(10)(115.6\\,\\mu)} = 0.504\\,\\mathrm{mS}$$',
            'Both devices see the same current, so: $$r_{O2}\\parallel r_{O4} = \\frac{1}{(\\lambda_n + \\lambda_p)I_D} = \\frac{1}{0.09\\times 115.6\\,\\mu} = 96.1\\,\\mathrm{k\\Omega}$$ and $A_1 = 0.504\\,\\mathrm{mS}\\times 96.1\\,\\mathrm{k\\Omega} = 48.5$.',
            'Stage 2 at $I_7$ = 1.156 mA: $$g_{m6} = \\sqrt{2(50\\,\\mu)(100)(1.156\\,\\mathrm{m})} = 3.40\\,\\mathrm{mS},\\quad r_{O6}\\parallel r_{O7} = \\frac{1}{0.09\\times 1.156\\,\\mathrm{m}} = 9.61\\,\\mathrm{k\\Omega}$$',
            'So $A_2 = 3.40\\,\\mathrm{mS}\\times 9.61\\,\\mathrm{k\\Omega} = 32.7$ and $$A_0 = A_1A_2 = 48.5\\times 32.7 \\approx 1584$$ (the key, rounding on the way, prints 1581).',
          ],
        },
        say: '$A_1$ = 48.5 and $A_2$ = 32.7: about 1580 (the key: 1581).',
      },
      {
        t: 26, title: '**GBP = $g_{m1}/(2\\pi C_c)$ and SR = $I_5/C_c$:** both need only stage 1 and $C_c$.',
        tex: `GBP = \\frac{g_{m1}}{2\\pi C_c} = ${fx(CQ8.gbw / 1e6, 4)}\\,\\mathrm{MHz},\\;\\; SR = \\frac{I_5}{C_c} = ${fx(CQ8.sr / 1e6, 4)}\\,\\mathrm{V/\\mu s}`,
        try: {
          q: 'Find the gain-bandwidth product GBP (in Hz), with $g_{m1}$ from the gain step.',
          answer: CQ8.gbw, unit: 'Hz', tol: 0.01,
          hint: ['Stage 1’s current charges $C_c$; unity gain is at $g_{m1}/C_c$ in rad/s.', '$GBP = \\dfrac{g_{m1}}{2\\pi C_c}$'],
          how: [
            'Stage 1 drives $C_c$: $$GBP = \\frac{g_{m1}}{2\\pi C_c} = \\frac{0.504\\,\\mathrm{mS}}{2\\pi(5\\,\\mathrm{pF})} = 16.05\\,\\mathrm{MHz}$$',
            'While you are here, the slew rate: $$SR = \\frac{I_5}{C_c} = \\frac{231\\,\\mu\\mathrm{A}}{5\\,\\mathrm{pF}} = 46.2\\,\\mathrm{V/\\mu s}$$',
            'The printed “unity-gain bandwidth 1 MHz” is not used: the key computes the GBP from the circuit.',
          ],
        },
        say: '16.05 MHz and 46.2 V/µs.',
      },
      {
        t: 35, title: '**Power and margin.** Power = supply (5 V) × every branch current. PM = 90° minus the second pole’s and the RHP zero’s angles at the GBP.',
        tex: `\\begin{aligned} P &= 5\\,\\mathrm{V}\\times(I_8 + I_5 + I_7) = ${fx(CQ8.pw * 1e3, 4)}\\,\\mathrm{mW} \\\\ f_{p2} &= \\tfrac{g_{m6}}{2\\pi C_L} = ${fx(CQ8.fp2 / 1e6, 3)}\\,\\mathrm{MHz},\\;\\; f_z = \\tfrac{g_{m6}}{2\\pi C_c} = ${fx(CQ8.fz / 1e6, 4)}\\,\\mathrm{MHz} \\\\ PM &= 90^\\circ - 30.7^\\circ - 8.4^\\circ = ${fx(CQ8.pm, 4)}^\\circ \\end{aligned}`,
        try: {
          q: 'Find the phase margin in unity feedback, using GBP = 16.05 MHz and $g_{m6}$ from the gain step.',
          answer: CQ8.pm, unit: '°', tol: 0.01,
          parts: [
            { q: 'Second pole $f_{p2}$ (Hz)?', answer: CQ8.fp2, unit: 'Hz', tol: 0.02, hint: '$f_{p2} = g_{m6}/(2\\pi C_L)$', how: ['$$\\frac{3.40\\,\\mathrm{mS}}{2\\pi(20\\,\\mathrm{pF})} = 27.1\\,\\mathrm{MHz}$$'] },
            { q: 'RHP zero $f_z$ (Hz)?', answer: CQ8.fz, unit: 'Hz', tol: 0.02, hint: '$f_z = g_{m6}/(2\\pi C_c)$', how: ['$$\\frac{3.40\\,\\mathrm{mS}}{2\\pi(5\\,\\mathrm{pF})} = 108\\,\\mathrm{MHz}$$'] },
            { q: 'Phase lag of the second pole at the GBP (degrees)?', answer: CQ8.ap, unit: '°', tol: 0.02, hint: '$\\tan^{-1}(GBP/f_{p2})$', how: ['$$\\tan^{-1}\\frac{16.05}{27.1} = 30.7^\\circ$$'] },
            { q: 'Phase lag of the RHP zero at the GBP (degrees)?', answer: CQ8.az, unit: '°', tol: 0.02, hint: '$\\tan^{-1}(GBP/f_z)$', how: ['$$\\tan^{-1}\\frac{16.05}{108} = 8.4^\\circ$$'] },
          ],
          hint: ['Find the second pole $g_{m6}/(2\\pi C_L)$ and the RHP zero $g_{m6}/(2\\pi C_c)$ first, then take their angles at the GBP.', '$PM = 90^\\circ - \\tan^{-1}\\frac{GBP}{f_{p2}} - \\tan^{-1}\\frac{GBP}{f_z}$'],
          how: [
            'Second pole (output node, $C_L$): $$f_{p2} = \\frac{g_{m6}}{2\\pi C_L} = \\frac{3.40\\,\\mathrm{mS}}{2\\pi(20\\,\\mathrm{pF})} = 27.1\\,\\mathrm{MHz}$$',
            'RHP zero (same $g_{m6}$, over $C_c$): $$f_z = \\frac{g_{m6}}{2\\pi C_c} = \\frac{3.40\\,\\mathrm{mS}}{2\\pi(5\\,\\mathrm{pF})} = 108\\,\\mathrm{MHz}$$',
            'Their angles at 16.05 MHz: $$\\tan^{-1}\\frac{16.05}{27.1} = 30.7^\\circ,\\quad \\tan^{-1}\\frac{16.05}{108} = 8.4^\\circ$$',
            'Subtract from 90°: $$PM = 90^\\circ - 30.7^\\circ - 8.4^\\circ = 50.9^\\circ$$',
          ],
          why: 'The power asked in the same part: $P = 5\\,\\mathrm{V}\\times(I_8 + I_5 + I_7) = 7.51$ mW.',
          calc: [{ what: 'PM in one line (degree mode)', keys: '90 − [SHIFT][tan] 16.05 ÷ 27.06 ) − [SHIFT][tan] 16.05 ÷ 108.2 ) [EXE]', shows: '50.89' }],
        },
        say: '7.51 mW, and a margin of 50.9°: matches the key exactly.',
      },
      { t: 44, ans: true, title: `**Answers:** 115.6 µA, 231 µA, 1.156 mA · $A_0$ ≈ 1580 · 16.05 MHz · 46.2 V/µs · 7.51 mW · 50.9°`, say: 'Note the printed “open loop unity gain bandwidth 1 MHz” is never used: the answer key computes the GBP from the circuit.' },
    ],
  });
}, { q: 'Compre 2023-24 Q8' });
