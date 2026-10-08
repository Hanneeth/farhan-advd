/* Lesson D foundations after the frequency chapter: the feedback loop and βA from zero, and the arrow picture of complex numbers. */
'use strict';
const DF = 'Loop gain from zero';

scene(DF, 'The feedback loop: what βA means', 70, (S) => {
  header(S, 'FOUNDATIONS · THE LOOP', 'βA = what a signal becomes after one trip round the loop');
  const g = S.g(); const r = S.into(g);
  // summing node, amplifier A, output, divider β back to the minus input
  S.el('circle', { cx: 300, cy: 330, r: 30, fill: 'none', stroke: C.wire, 'stroke-width': 2.8 });
  txt(S, 300, 339, 'Σ', { size: 26, color: C.text, weight: 700, anchor: 'middle' });
  txt(S, 268, 300, '+', { size: 24, color: C.ok, weight: 800, anchor: 'end' }); txt(S, 318, 388, '−', { size: 28, color: C.bad, weight: 800 });
  wire(S, [[120, 330], [270, 330]]); txt(S, 120, 316, 'V_in', { size: 21, color: C.volt, weight: 700 });
  wire(S, [[330, 330], [480, 330]]);
  amp(S, 480, 330, { label: 'A', pm: false, w: 150, h: 150 });
  wire(S, [[630, 330], [900, 330]]); dot(S, 800, 330); txt(S, 910, 337, 'V_out', { size: 21, color: C.volt, weight: 700 });
  wire(S, [[800, 330], [800, 560], [640, 560]]);
  S.el('rect', { x: 480, y: 520, width: 160, height: 80, rx: 12, fill: 'rgba(52,211,153,0.07)', stroke: C.ok, 'stroke-width': 2.6 });
  txt(S, 560, 570, 'β', { size: 30, color: C.ok, weight: 800, anchor: 'middle' });
  wire(S, [[480, 560], [300, 560], [300, 360]]);
  txt(S, 560, 640, 'a divider: resistors or capacitors', { size: 18, color: C.muted, anchor: 'middle' });
  r();
  S.draw(g, 0.3, 2);
  // a pulse travelling round the loop
  const loop = [[330, 330], [630, 330], [800, 330], [800, 560], [640, 560], [480, 560], [300, 560], [300, 360]];
  const segL = loop.slice(1).map((p, i) => Math.hypot(p[0] - loop[i][0], p[1] - loop[i][1])), tot = segL.reduce((a, b) => a + b, 0);
  const at = (u) => { let d = u * tot; for (let i = 0; i < segL.length; i++) { if (d <= segL[i]) { const k = d / segL[i]; return [lerp(loop[i][0], loop[i + 1][0], k), lerp(loop[i][1], loop[i + 1][1], k), i]; } d -= segL[i]; } return loop[loop.length - 1].concat([segL.length - 1]); };
  const ball = S.el('circle', { r: 16, fill: C.cur, filter: 'url(#glow)' }); const bl = txt(S, 0, 0, '', { size: 18, color: C.cur, weight: 800, anchor: 'middle' });
  ball.style.opacity = 0; bl.style.opacity = 0; S.fade(ball, 8, 0.4); S.fade(bl, 8, 0.4);
  S.anim(0, 1e4, 'ball', (_p, t) => {
    const u = ((Math.max(0, t - 8)) / 7) % 1, [x, y, i] = at(u);
    const size = i === 0 ? 1 : i < 5 ? 100 : 10; // grows ×A in the amplifier, ×β in the divider
    ball.setAttribute('cx', x); ball.setAttribute('cy', y); ball.setAttribute('r', 10 + 4 * Math.log10(size + 1));
    bl.setAttribute('x', x + (i >= 5 ? 92 : 0)); bl.setAttribute('y', y - 26); bl.textContent = i === 0 ? '1' : i < 5 ? '× A = 100' : '× β → βA = 10';
  }, E.lin);
  eqAt(S, 'A_f = \\frac{V_{out}}{V_{in}} = \\frac{A}{1 + \\beta A}', 1240, 230, 18, { size: 38, w: 620 });
  eqAt(S, '\\text{loop gain} = \\beta A', 1240, 340, 24, { size: 36, w: 620, color: C.ok });
  S.say(0.3, 'Every op-amp circuit in this course is a loop. The input goes into a subtractor, then the amplifier A, then a divider β feeds part of the output back to the minus input.');
  S.say(8, 'Follow one small signal round the loop. The amplifier multiplies it by A, say 100. The divider takes a fraction β, say 0.1. When it arrives back at the start it has been multiplied by $\\beta A$, here 10.');
  S.say(18, 'That trip-round number is the <b>loop gain</b>, $\\beta A$. The closed-loop gain is $A/(1 + \\beta A)$: the bigger the loop gain, the closer the answer is to $1/\\beta$.');
  whyBox(S, 950, 420, 600, 260, '**Why the minus sign matters:** the returning signal is **subtracted**, so it opposes the change: that is negative feedback, calm and accurate. But if something in the loop turns the signal **upside down** (a delay of 180°), subtracting an upside-down signal is the same as **adding** it. Opposition becomes help.', 30);
  S.say(30, 'The minus sign is what makes feedback calm: the returning signal opposes the change. But if the loop turns the signal upside down, a delay of half a cycle, 180 degrees, then subtracting it is the same as adding it.');
  S.say(44, 'If on top of that the trip round gives a gain of at least 1, the signal keeps itself going with no input at all: the circuit oscillates. Capacitors make that delay, and that is why every lecture from here on is about the phase of $\\beta A$.');
  S.say(58, 'Two things to track at every frequency, then: how big $\\beta A$ is, and how much it delays the signal. The next scene gives you one picture for both.');
});

scene(DF, 'Complex numbers as arrows: size and angle', 66, (S) => {
  header(S, 'FOUNDATIONS · THE ARROW', 'A gain at one frequency is an arrow: its length is the size, its tilt is the delay');
  const ox = 360, oy = 620, U = 110;
  const pl = S.g();
  S.el('line', { x1: 100, y1: oy, x2: 800, y2: oy, stroke: C.muted, 'stroke-width': 1.8 }, pl); S.el('line', { x1: ox, y1: oy + 180, x2: ox, y2: 170, stroke: C.muted, 'stroke-width': 1.8 }, pl);
  txt(S, 790, oy + 58, 'real part', { size: 18, color: C.muted, anchor: 'end' }, pl); txt(S, ox + 12, 190, 'imaginary part (j)', { size: 18, color: C.muted }, pl);
  for (let i = -2; i <= 4; i++) if (i) { S.el('line', { x1: ox + i * U, y1: oy - 6, x2: ox + i * U, y2: oy + 6, stroke: C.muted, 'stroke-width': 1.6 }, pl); txt(S, ox + i * U, oy + 28, String(i), { size: 16, color: C.muted, anchor: 'middle' }, pl); }
  for (let i = 1; i <= 3; i++) { S.el('line', { x1: ox - 6, y1: oy - i * U, x2: ox + 6, y2: oy - i * U, stroke: C.muted, 'stroke-width': 1.6 }, pl); txt(S, ox - 14, oy - i * U + 6, `${i}j`, { size: 16, color: C.muted, anchor: 'end' }, pl); }
  pl.style.opacity = 0; S.fade(pl, 0.3, 0.6);
  const a = dynArrow(S, C.amb, 5), bx = dynArrow(S, '#e9eef5', 3), by = dynArrow(S, C.p, 3);
  const arc = S.el('path', { fill: 'none', stroke: C.amb, 'stroke-width': 2.4 });
  const rd = [txt(S, 900, 250, '', { size: 26, color: C.text, mono: true, weight: 800 }), txt(S, 900, 300, '', { size: 23, color: C.ok, mono: true }), txt(S, 900, 344, '', { size: 23, color: C.amb, mono: true })];
  [a, bx, by, arc, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 6, 0.5); });
  const pts = [[3, 0], [2, 2], [1, Math.sqrt(3)], [0, 2], [-2, 0.001]];
  const pAt = (t) => { const k = clamp(Math.floor((t - 6) / 7), 0, pts.length - 1), u = clamp((t - 6 - 7 * k) / 2, 0, 1), A = pts[Math.max(0, k - 1)], B = pts[k]; return k === 0 ? B : [lerp(A[0], B[0], E.inout(u)), lerp(A[1], B[1], E.inout(u))]; };
  S.anim(0, 1e4, 'arr', (_p, t) => {
    const [re, im] = pAt(Math.min(t, 41.9)), x = ox + re * U, y = oy - im * U;
    bx.set(ox, oy + 2, x, oy + 2); by.set(x, oy, x, y); a.set(ox, oy, x, y);
    const th = Math.atan2(im, re), R = 60;
    arc.setAttribute('d', `M${ox + R} ${oy} A${R} ${R} 0 ${th > Math.PI ? 1 : 0} 0 ${ox + R * Math.cos(th)} ${oy - R * Math.sin(th)}`);
    rd[0].textContent = `${fx(re, 3)} + j${fx(im, 3)}`;
    rd[1].textContent = `size √(a² + b²) = ${fx(Math.hypot(re, im), 3)}`;
    rd[2].textContent = `angle tan⁻¹(b/a) = ${fx(th * DEG, 3)}°`;
  }, E.lin);
  S.say(0.3, 'At one frequency, a gain has two parts: how much it multiplies the signal, and how much it delays it. One arrow carries both.');
  S.say(6, 'Write the gain as $a + jb$: walk $a$ to the right, then $b$ upwards. The arrow from the start to the end is the gain. Here 3: no tilt, no delay, size 3.');
  S.say(13, '$2 + 2j$: size $\\sqrt{2^2+2^2} = 2.83$, tilted 45°. A tilt is a delay: 45° means the wave comes out an eighth of a cycle late.');
  S.say(20, '$1 + 1.73j$: tilted 60°. $2j$: straight up, 90°, a quarter of a cycle late.');
  S.say(34, 'And pointing left, −2: 180°, half a cycle, the wave comes out upside down. That is the angle that turned the feedback loop into an oscillator.');
  whyBox(S, 900, 420, 640, 250, '**The one rule you need:** when gains multiply, their **sizes multiply** and their **angles add**. A pole divides by an arrow $1 + j\\omega/\\omega_p$, so it shrinks the size and **subtracts** its angle: a delay. Lecture 15 adds up these angles.', 44);
  S.say(44, 'The one rule for the whole lesson: when gains multiply, their sizes multiply and their angles add. A pole divides by an arrow, so it shrinks the gain and adds a delay. Phase-margin questions are nothing more than adding those angles.');
});
