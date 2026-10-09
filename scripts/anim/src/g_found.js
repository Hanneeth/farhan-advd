/* Lesson F, chapter 1: frequency, poles, bandwidth and slewing from nothing. Every idea is a picture first (a bucket,
   a pipe, a turning arrow), then the formula, then a your-turn stop. Builds exactly the tools Lec 18–19 use. */
'use strict';
const GF = 'Ground up: poles & slewing';
const EX = 'Exam-style check';

/* a water bucket: x, y = top-left, level(t) in 0..1 drawn every frame */
function bucket(S, x, y, w, h, levelAt, col = '#38bdf8') {
  const g = S.g();
  const water = S.el('rect', { x: x + 3, y: y + h, width: w - 6, height: 0, fill: col, 'fill-opacity': 0.55 }, g);
  S.el('polyline', { points: `${x},${y} ${x},${y + h} ${x + w},${y + h} ${x + w},${y}`, fill: 'none', stroke: C.wire, 'stroke-width': 3.4 }, g);
  S.anim(0, 1e4, water.id + ':lvl', (_p, t) => { const l = clamp(levelAt(t), 0, 1), hh = (h - 4) * l; water.setAttribute('y', y + h - 2 - hh); water.setAttribute('height', hh); }, E.lin);
  return g;
}
/* a plot frame with tick labels; returns mappers */
function plotBox(S, x0, y0, w, h, o = {}) {
  const g = S.g();
  S.el('rect', { x: x0, y: y0, width: w, height: h, rx: 8, fill: '#0e141e', stroke: '#222c3b' }, g);
  if (o.title) txt(S, x0 + 8, y0 - 12, o.title, { size: 18, color: C.muted }, g);
  if (o.x) txt(S, x0 + w, y0 + h + 52, o.x, { size: 17, color: C.muted, anchor: 'end' }, g);
  (o.yt || []).forEach(([v, s]) => { const yy = y0 + h - (v / (o.ymax || 1)) * h; S.el('line', { x1: x0, y1: yy, x2: x0 + w, y2: yy, stroke: '#1f2836', 'stroke-width': 1.3 }, g); txt(S, x0 - 10, yy + 6, s, { size: 16, color: C.muted, anchor: 'end' }, g); });
  (o.xt || []).forEach(([v, s]) => { const xx = x0 + (v / (o.xmax || 1)) * w; S.el('line', { x1: xx, y1: y0, x2: xx, y2: y0 + h, stroke: '#1f2836', 'stroke-width': 1.3 }, g); txt(S, xx, y0 + h + 24, s, { size: 16, color: C.muted, anchor: 'middle' }, g); });
  return { g, X: (v) => x0 + (v / (o.xmax || 1)) * w, Y: (v) => y0 + h - (v / (o.ymax || 1)) * h };
}

/* ── 1 ── */
scene(GF, 'A capacitor is a bucket for charge', 66, (S) => {
  header(S, 'GROUND UP · 1', 'A capacitor is a bucket: current fills it at a steady rate');
  const bk = bucket(S, 170, 300, 220, 300, (t) => (t < 4 ? 0 : (t - 4) / 30));
  txt(S, 280, 650, 'width of the bucket = C', { size: 21, color: C.amb, anchor: 'middle', weight: 700 });
  txt(S, 280, 684, 'water level = voltage V', { size: 21, color: '#38bdf8', anchor: 'middle', weight: 700 });
  const tap = arrow(S, 280, 200, 280, 290, { color: '#38bdf8', w: 6, head: 18 }); tap.style.opacity = 0; S.fade(tap, 4, 0.5);
  label(S, 300, 236, 'steady flow = current I', 4, { size: 21, color: '#38bdf8', weight: 700 });
  bk.style.opacity = 0; S.fade(bk, 0.3, 0.6);
  S.say(0.3, 'Start with the simplest picture. A capacitor is a bucket for charge. The water level is the voltage; how wide the bucket is, is the capacitance.');
  S.say(4, 'Pour in a steady flow — a constant current. The level rises at a steady rate: a straight line.');
  // the circuit and the ramp
  const cg = S.g(); const rc = S.into(cg);
  isrc(S, 640, 330, { label: 'I', up: false }); wire(S, [[640, 240], [640, 288]]); txt(S, 640, 230, 'from the supply', { size: 16, color: C.muted, anchor: 'middle' });
  wire(S, [[640, 372], [640, 420]]); dot(S, 640, 420); wire(S, [[640, 420], [720, 420]]); txt(S, 728, 427, 'V', { size: 22, color: C.volt, weight: 700 });
  cap(S, 640, 420, { label: 'C' });
  rc(); cg.style.opacity = 0; S.fade(cg, 10, 0.7);
  S.say(10, 'The circuit is the same thing: a current source pushing a fixed current $I$ into a capacitor $C$.');
  const P = plotBox(S, 860, 230, 600, 360, { title: 'V across C', x: 'time', xmax: 30, ymax: 1 });
  P.g.style.opacity = 0; S.fade(P.g, 12, 0.6);
  const ramp = liveLine(S, C.volt, 4);
  S.anim(14, 16, ramp.id + ':pts', (p) => { ramp.setAttribute('points', ptsOf(40, 0, 30 * p, (u) => [P.X(u), P.Y(u / 30)])); }, E.lin);
  eqAt(S, 'i = C\\,\\frac{dv}{dt}\\quad\\Rightarrow\\quad \\frac{dv}{dt} = \\frac{I}{C}', 1160, 680, 20, { size: 34, w: 700 });
  S.say(20, 'Charge piles up: $q = C\\,v$. A current is charge per second, so $i = C\\,dv/dt$. Turn it round: the voltage rises at $I/C$ volts per second.');
  whyBox(S, 860, 740, 600, 100, '**Same flow, wider bucket → slower rise.** Double $C$ and the slope halves; double $I$ and it doubles.', 28);
  S.say(28, 'Same flow into a wider bucket rises more slowly. Remember this one: it is the whole of slewing.');
  S.stop(36, {
    src: EX,
    q: 'A steady 10 µA flows into a 2 pF capacitor. How fast does its voltage rise? (answer in V/s; 1 V/µs = 10⁶ V/s)',
    hint: ['The slope of the voltage is the current divided by the capacitance.', '$\\dfrac{dv}{dt} = \\dfrac{I}{C}$'],
    how: ['A constant current into a capacitor gives a constant slope: $$\\frac{dv}{dt} = \\frac{I}{C}$$', 'Put in the numbers with their prefixes: $$\\frac{dv}{dt} = \\frac{10\\times10^{-6}}{2\\times10^{-12}} = 5\\times10^{6}\\,\\text{V/s} = 5\\,\\text{V/}\\mu\\text{s}$$'],
    why: 'Every slew rate in this course is exactly this: the largest current an amplifier can push, divided by the capacitor it pushes into.',
    answer: 5e6, unit: 'V/s', tol: 0.02,
    calc: [{ what: 'Current over capacitance', keys: '10µ ÷ 2p [EXE]', shows: '5M', note: 'Type µ and p with [CATALOG] ▸ Engineer Symbol (prefixes on: [SETTINGS] ▸ Calc Settings ▸ Engineer Symbol ▸ On).' }],
  });
  eqAt(S, '\\frac{10\\,\\mu\\text{A}}{2\\,\\text{pF}} = 5\\,\\text{V}/\\mu\\text{s}', 1160, 200, 36.4, { size: 30, w: 600, color: '#ffd38a' });
  S.say(37, '10 µA into 2 pF: 5 volts per microsecond.');
  S.say(42, 'Next: what if the water comes from a tank through a pipe, instead of a fixed flow?');
});

/* ── 2 ── */
scene(GF, 'Fill it through a resistor: the time constant τ = RC', 84, (S) => {
  header(S, 'GROUND UP · 2', 'Through a resistor the flow slows as the bucket fills: τ = RC');
  const tau = 8; // seconds of animation per τ
  const bk = bucket(S, 150, 330, 200, 280, (t) => (t < 5 ? 0 : 1 - Math.exp(-(t - 5) / tau)));
  const tank = S.g(); S.el('rect', { x: 150, y: 150, width: 200, height: 70, rx: 6, fill: '#38bdf8', 'fill-opacity': 0.55, stroke: C.wire, 'stroke-width': 3 }, tank);
  txt(S, 250, 196, 'full tank = V₀', { size: 19, color: '#04121c', anchor: 'middle', weight: 800 }, tank);
  wire(S, [[250, 220], [250, 300]], { w: 6 }, tank); txt(S, 266, 268, 'narrow pipe = R', { size: 19, color: C.amb, weight: 700 }, tank);
  tank.style.opacity = 0; S.fade(tank, 0.3, 0.6); bk.style.opacity = 0; S.fade(bk, 0.3, 0.6);
  S.say(0.3, 'Now the water comes from a full tank, through a narrow pipe. The tank is a voltage source $V_0$; the pipe is a resistor $R$; the bucket is $C$.');
  S.say(5, 'Open the pipe. At first the levels are far apart, so the flow is fast. As the bucket fills, the difference shrinks, and so does the flow. The rise keeps slowing down.');
  const P = plotBox(S, 520, 200, 560, 380, { title: 'v(t) / V₀   (time in units of τ)', xmax: 5, ymax: 1, xt: [[1, 'τ'], [2, '2τ'], [3, '3τ'], [4, '4τ'], [5, '5τ']], yt: [[0.632, '63%'], [0.95, '95%']] });
  P.g.style.opacity = 0; S.fade(P.g, 5, 0.6);
  tracePlot(S, (u) => 1 - Math.exp(-u), (u) => P.X(u), (v) => P.Y(v), 5, 45, C.volt, 5);
  eqAt(S, 'v(t) = V_0\\left(1 - e^{-t/\\tau}\\right),\\qquad \\tau = RC', 800, 680, 14, { size: 32, w: 760 });
  S.say(14, 'That curve is $v = V_0(1 - e^{-t/\\tau})$ with $\\tau = RC$: bigger pipe resistance or bigger bucket, slower fill.');
  const marks = [[1, '63 % after 1τ', 18], [3, '95 % after 3τ', 26], [4.6, '99 % after 4.6τ', 48.6]];
  marks.forEach(([u, s, t0]) => { const d = dot(S, P.X(u), P.Y(1 - Math.exp(-u)), { color: C.amb, r: 7 }); d.style.opacity = 0; S.fade(d, t0, 0.4); label(S, P.X(u) + 12, P.Y(1 - Math.exp(-u)) + 30, s, t0, { size: 18, color: C.amb, weight: 700 }); });
  S.say(18, 'Two numbers to keep: after one $\\tau$ it has covered 63 %; after three, 95 %. How long for 99 %, "settled to 1 %"? That is your next question.');
  whyBox(S, 1130, 360, 420, 200, '**Why 4.6τ for 1 %?** The gap left is $e^{-t/\\tau}$. Set it to 0.01: $t = \\tau\\ln 100 = 4.6\\tau$.', 48.8);
  S.stop(40, {
    src: EX,
    q: 'A 100 kΩ resistor charges a 2 pF capacitor from a step. What is the time constant τ?',
    hint: ['The time constant is the product of the resistance and the capacitance.', '$\\tau = RC$'],
    how: ['The pipe is $R$ and the bucket is $C$: $$\\tau = RC$$', '$$\\tau = (100\\times10^{3})(2\\times10^{-12}) = 2\\times10^{-7}\\,\\text{s} = 200\\,\\text{ns}$$'],
    why: 'kΩ × pF gives nanoseconds: 100 k × 2 p = 200 n.',
    answer: 200e-9, unit: 's', tol: 0.02,
    calc: [{ what: 'R × C', keys: '100k × 2p [EXE]', shows: '200n' }],
  });
  S.stop(48, {
    src: EX,
    q: 'With τ = 200 ns from above, how long until the output is within 1 % of its final value?',
    hint: ['The gap still left after a time t is the fraction $e^{-t/\\tau}$. Make it 1 %.', '$e^{-t/\\tau} = 0.01 \\Rightarrow t = \\tau\\ln 100$'],
    how: ['The part still missing is $e^{-t/\\tau}$. Settled to 1 % means $$e^{-t/\\tau} = 0.01$$', 'Take the natural log: $$t = \\tau\\ln 100 = 4.605\\,\\tau$$', '$$t = 4.605\\times200\\,\\text{ns} = 921\\,\\text{ns}$$'],
    why: 'Settling questions (Tutorial 6, Razavi Ex 9.2) are all this one line: $t = \\tau\\ln(1/\\text{error})$.',
    parts: [{ q: 'First: how many time constants does 1 % settling take? ($\\ln 100$)', answer: Math.log(100), unit: '', tol: 0.01, hint: ['$e^{-n} = 0.01$, so $n = \\ln 100$.'], how: ['$$n = \\ln 100 = 4.605$$'] }],
    answer: 200e-9 * Math.log(100), unit: 's', tol: 0.02,
    calc: [{ what: 'τ · ln 100', keys: '200n × [ln] 100 [EXE]', shows: '921n' }],
  });
  S.say(49, 'τ = 200 ns, and 1 % settling takes 4.6 τ ≈ 921 ns.');
  S.say(56, 'So a resistor and a capacitor together make a time constant. Next: what happens when the input does not step, but wiggles?');
});

/* ── 3 ── */
scene(GF, 'Wiggles: frequency, period and ω', 64, (S) => {
  header(S, 'GROUND UP · 3', 'A sine wave is the shadow of a turning arrow');
  const cx = 300, cy = 450, R = 140;
  S.el('circle', { cx, cy, r: R, fill: 'none', stroke: '#2a3444', 'stroke-width': 2 });
  wire(S, [[cx - R - 30, cy], [cx + R + 30, cy]], { color: '#2a3444', w: 1.6 }); wire(S, [[cx, cy - R - 30], [cx, cy + R + 30]], { color: '#2a3444', w: 1.6 });
  const arm = dynArrow(S, C.amb, 4.5); const tip = S.el('circle', { r: 8, fill: C.amb });
  const proj = S.el('line', { stroke: C.amb, 'stroke-width': 1.6, 'stroke-dasharray': '5 6' });
  const x0 = 560, w = 900, period = 6; // seconds of animation per turn
  wire(S, [[x0, cy], [x0 + w, cy]], { color: '#2a3444', w: 1.6 });
  const wave = liveLine(S, C.volt, 4);
  S.anim(2, 1e4, 'turn', (_p, t) => {
    const th = (2 * Math.PI * (t - 2)) / period, ex = cx + R * Math.cos(th), ey = cy - R * Math.sin(th);
    arm.set(cx, cy, ex, ey); tip.setAttribute('cx', ex); tip.setAttribute('cy', ey);
    proj.setAttribute('x1', ex); proj.setAttribute('y1', ey); proj.setAttribute('x2', x0); proj.setAttribute('y2', ey);
    const span = Math.min(t - 2, 18);
    wave.setAttribute('points', ptsOf(160, 0, span, (u) => [x0 + (u / 18) * w, cy - R * Math.sin((2 * Math.PI * (t - 2 - (span - u))) / period)]));
  }, E.lin);
  S.say(0.3, 'A wiggle that repeats smoothly is a sine wave. The cleanest way to see one: an arrow turning at a steady speed, and its shadow on the vertical axis.');
  S.say(5, 'Each full turn of the arrow draws one full cycle. The time for one turn is the period $T$.');
  const T0 = S.g(); const rT = S.into(T0);
  arrow(S, x0, cy + R + 50, x0 + (6 / 18) * w, cy + R + 50, { color: C.ok, w: 2.4, head: 12 }); txt(S, x0 + (3 / 18) * w, cy + R + 82, 'one period T', { size: 20, color: C.ok, anchor: 'middle', weight: 700 });
  rT(); T0.style.opacity = 0; S.fade(T0, 9, 0.5);
  eqAt(S, 'f = \\frac{1}{T}\\;\\text{(turns per second, Hz)},\\qquad \\omega = 2\\pi f\\;\\text{(radians per second)}', 1010, 180, 14, { size: 30, w: 1100 });
  S.say(14, 'Turns per second is the frequency $f$, in hertz. One turn is $2\\pi$ radians, so the angle grows at $\\omega = 2\\pi f$ radians per second. Engineers use both; formulas with $RC$ give $\\omega$.');
  whyBox(S, 1010, 680, 520, 150, '**Hz or rad/s?** $\\omega = 1/RC$ is in rad/s. Divide by $2\\pi$ to get Hz. Forgetting the $2\\pi$ is the commonest lost mark in this course.', 22);
  S.stop(30, {
    src: EX,
    q: 'A signal repeats one million times per second (f = 1 MHz). What is its angular frequency ω in rad/s?',
    hint: ['One full turn is 2π radians, and there are f turns each second.', '$\\omega = 2\\pi f$'],
    how: ['One cycle is one turn of the arrow, $2\\pi$ radians, and there are $f$ of them per second: $$\\omega = 2\\pi f$$', '$$\\omega = 2\\pi\\times10^{6} = 6.28\\times10^{6}\\,\\text{rad/s}$$'],
    answer: 2 * Math.PI * 1e6, unit: 'rad/s', tol: 0.02,
  });
  S.stop(38, {
    src: EX,
    q: 'Going the other way: a pole sits at ω = 10⁹ rad/s. What frequency is that in Hz?',
    hint: ['Undo the 2π.', '$f = \\dfrac{\\omega}{2\\pi}$'],
    how: ['$$f = \\frac{\\omega}{2\\pi} = \\frac{10^{9}}{6.283} = 159\\,\\text{MHz}$$'],
    why: 'Whenever a question gives "MHz" for a GBW or a pole, multiply by 2π before using $g_m/C$ formulas.',
    answer: 1e9 / (2 * Math.PI), unit: 'Hz', tol: 0.02,
  });
  S.say(39, '1 MHz is 6.28 million rad/s; 10⁹ rad/s is 159 MHz.');
});

/* ── 4 ── */
scene(GF, 'Why fast wiggles shrink: the pole', 88, (S) => {
  header(S, 'GROUND UP · 4', 'The capacitor has no time to fill: high frequencies come out smaller and late');
  const cg = S.g(); const rr = S.into(cg);
  txt(S, 120, 270, 'v_in', { size: 22, color: C.volt, weight: 700 }); wire(S, [[170, 262], [220, 262]]); resh(S, 220, 330, 262, { label: 'R' }); wire(S, [[330, 262], [420, 262]]); dot(S, 400, 262);
  txt(S, 430, 250, 'v_out', { size: 22, color: C.cur, weight: 700 }); cap(S, 400, 262, { label: 'C' });
  rr(); cg.style.opacity = 0; S.fade(cg, 0.3, 0.6);
  S.say(0.3, 'Put the same R and C between a wiggling input and the output. Watch the input (blue) and the voltage on the capacitor (orange) at three speeds.');
  const rows = [[0.2, 'slow: ω = 0.2 ωp', 5], [1, 'at the pole: ω = ωp', 17], [5, 'fast: ω = 5 ωp', 29]];
  rows.forEach(([r, s, t0], i) => {
    const y = 230 + i * 210, x0 = 640, w = 820, a = 52;
    const box = S.g(); S.el('rect', { x: x0, y: y - 95, width: w, height: 190, rx: 10, fill: '#0e141e', stroke: '#222c3b' }, box); txt(S, x0 + 12, y - 70, s, { size: 18, color: C.muted, weight: 700 }, box);
    box.style.opacity = 0; S.fade(box, t0, 0.5);
    const mag = 1 / Math.hypot(1, r), ph = Math.atan(r), cyc = 2.2;
    const vin = liveLine(S, C.volt, 3), vo = liveLine(S, C.cur, 4);
    S.anim(t0, 1e4, vin.id + ':w', (_p, t) => {
      const sh = (t - t0) * 1.6;
      vin.setAttribute('points', ptsOf(160, 0, 1, (u) => [x0 + 20 + u * (w - 40), y - a * Math.sin(2 * Math.PI * cyc * u - sh)]));
      vo.setAttribute('points', ptsOf(160, 0, 1, (u) => [x0 + 20 + u * (w - 40), y - a * mag * Math.sin(2 * Math.PI * cyc * u - sh - ph)]));
    }, E.lin);
    label(S, x0 + w - 14, y + 82, `out = ${fx(mag, 2)} × in, ${fx(ph * 180 / Math.PI, 2)}° late`, t0 + 3, { size: 18, color: C.cur, weight: 700, anchor: 'end' });
  });
  S.say(5, 'Slow wiggle: the capacitor has plenty of time to follow. Output almost equals input.');
  S.say(17, 'Faster: now it lags and only reaches 0.707 of the input, 45° late. This speed is special: it is the pole, $\\omega_p = 1/RC$.');
  S.say(29, 'Much faster: the capacitor barely starts filling before the input turns round. The output is small and nearly a quarter-cycle late.');
  eqAt(S, '\\left|\\frac{v_{out}}{v_{in}}\\right| = \\frac{1}{\\sqrt{1 + (\\omega/\\omega_p)^2}}', 320, 420, 40, { size: 26, w: 560 });
  eqAt(S, '\\angle = -\\tan^{-1}\\frac{\\omega}{\\omega_p},\\qquad \\omega_p = \\frac{1}{RC}', 320, 520, 40.5, { size: 26, w: 560 });
  S.say(40, 'In one line: the size falls as $1/\\sqrt{1 + (\\omega/\\omega_p)^2}$ and the lag grows as $\\tan^{-1}(\\omega/\\omega_p)$. A pole is simply the speed where a node stops keeping up.');
  whyBox(S, 40, 620, 560, 150, '**Every node with a resistance to ground and a capacitance is one pole.** An op amp is a few such nodes in a row: the two-stage has two.', 46);
  S.stop(56, {
    src: EX,
    q: 'R = 100 kΩ and C = 2 pF. At what frequency f (in Hz) is the pole?',
    hint: ['The pole in rad/s is 1/RC; divide by 2π for hertz.', '$f_p = \\dfrac{1}{2\\pi RC}$'],
    how: ['In rad/s: $$\\omega_p = \\frac{1}{RC} = \\frac{1}{(100\\,\\text{k})(2\\,\\text{p})} = 5\\times10^{6}\\,\\text{rad/s}$$', 'In hertz, divide by $2\\pi$: $$f_p = \\frac{5\\times10^{6}}{2\\pi} = 796\\,\\text{kHz}$$'],
    parts: [{ q: 'First the pole in rad/s, $\\omega_p = 1/RC$.', answer: 5e6, unit: 'rad/s', tol: 0.02, hint: ['$\\omega_p = 1/(RC)$'], how: ['$$\\omega_p = \\frac{1}{100\\,\\text{k}\\times2\\,\\text{p}} = 5\\times10^6\\,\\text{rad/s}$$'] }],
    answer: 5e6 / (2 * Math.PI), unit: 'Hz', tol: 0.02,
    calc: [{ what: 'f_p in one line', keys: '( 2 [π] × 100k × 2p ) [SHIFT][^] [EXE]', shows: '795.77k', note: '[SHIFT][^] is x⁻¹.' }],
  });
  S.stop(64, {
    src: EX,
    q: 'A signal at ten times the pole frequency (ω = 10 ωp) goes through. What fraction of its size comes out?',
    hint: ['Put ω/ωp = 10 into the size formula.', '$\\dfrac{1}{\\sqrt{1 + 10^2}}$'],
    how: ['$$\\left|\\frac{v_{out}}{v_{in}}\\right| = \\frac{1}{\\sqrt{1 + 10^2}} = \\frac{1}{\\sqrt{101}} = 0.0995$$', 'Far above the pole the size is almost exactly $\\omega_p/\\omega$: ten times faster, ten times smaller.'],
    answer: 1 / Math.sqrt(101), unit: '', tol: 0.02,
  });
  S.say(65, 'f_p ≈ 796 kHz, and ten times above it only about a tenth gets through.');
});

/* ── 5 ── */
scene(GF, 'Decibels and the Bode plot', 78, (S) => {
  header(S, 'GROUND UP · 5', 'Decibels turn "×10 smaller" into "−20": the Bode plot is just straight lines');
  const rm = remember(S, ['**dB** $= 20\\log_{10}(\\text{ratio})$: ×10 → 20 dB, ×100 → 40 dB, ×0.707 → −3 dB, ×1 → 0 dB. Every extra ×10 adds 20 dB.',
    'A pole: flat at the DC gain, then **−20 dB per decade** (every ×10 in frequency, ÷10 in size).',
    'At the pole itself the true curve is **3 dB** below the corner, and the phase is **−45°**; the phase ends at −90°.'], 0.3, 'Three facts');
  S.out(rm, 16.6, 0.4);
  S.say(0.3, 'Gains in an op amp run from 1 to a million, so we use decibels: twenty times the log of the ratio. Ten times is 20 dB, a hundred is 40 dB, and 0.707 is minus 3 dB. Each further factor of ten adds another 20.');
  S.say(9, 'Plot gain in dB against frequency on a log axis and a pole becomes two straight lines: flat, then falling 20 dB for every factor of ten in frequency.');
  S.stop(16, {
    src: EX,
    q: 'An amplifier has a DC gain of 1000. What is that in dB?',
    hint: ['dB = 20 log₁₀ of the ratio.', '$20\\log_{10}1000$'],
    how: ['$$20\\log_{10}(1000) = 20\\times3 = 60\\,\\text{dB}$$'],
    answer: 60, unit: 'dB', tol: 0.01, abs: 0.2,
  });
  // the Bode plot appears after the first check
  const sc = S.g(); S.anim(16.2, 0.6, sc.id + ':o', (p) => { sc.style.opacity = p; }); sc.style.opacity = 0;
  const restore = S.into(sc);
  const B = bodeFrame(S, 230, 170, 1000, 300, 2, 8, 80, -20, { title: '|A| in dB', dbStep: 20 });
  const P = bodeFrame(S, 230, 560, 1000, 220, 2, 8, 0, -90, { title: 'phase', dbStep: 45, unit: 'deg' });
  restore();
  const fp = 1e4, A0 = 1000;
  const mag = liveLine(S, C.volt, 4), asy = liveLine(S, C.amb, 2.4, '8 7'), ph = liveLine(S, C.cur, 4);
  S.anim(17, 8, mag.id + ':d', (p) => {
    const e1 = 2 + 6 * p;
    mag.setAttribute('points', ptsOf(200, 2, e1, (e) => [B.fxp(10 ** e), B.fy(20 * Math.log10(A0 / Math.hypot(1, 10 ** e / fp)))]));
    asy.setAttribute('points', ptsOf(200, 2, e1, (e) => [B.fxp(10 ** e), B.fy(20 * Math.log10(A0 / Math.max(1, 10 ** e / fp)))]));
    ph.setAttribute('points', ptsOf(200, 2, e1, (e) => [P.fxp(10 ** e), P.fy(-Math.atan(10 ** e / fp) * 180 / Math.PI)]));
  }, E.lin);
  label(S, B.fxp(fp) + 10, B.fy(57) - 6, 'pole: 3 dB down', 25, { size: 18, color: C.amb, weight: 700 });
  label(S, B.fxp(1e6) + 10, B.fy(20) - 10, '−20 dB / decade', 25, { size: 18, color: C.amb, weight: 700 });
  label(S, P.fxp(fp) + 12, P.fy(-45) + 6, '−45° at the pole', 25, { size: 18, color: C.cur, weight: 700 });
  S.say(17, 'Here is a gain of 1000, 60 dB, with a pole at 10 kHz. Flat, then straight down. The phase slides from 0 to −90°, passing −45° exactly at the pole.');
  S.stop(32, {
    src: EX,
    q: 'Same amplifier (60 dB, pole at 10 kHz). What is the gain in dB one decade above the pole, at 100 kHz?',
    hint: ['Above the pole the gain falls 20 dB for each factor of 10 in frequency.', '$60 - 20 = ?$'],
    how: ['One decade above the pole the straight line has dropped 20 dB: $$60 - 20 = 40\\,\\text{dB}$$', 'Exact check: $$20\\log\\frac{1000}{\\sqrt{1+10^2}} = 60 - 20.04 = 39.96\\,\\text{dB}$$'],
    answer: 40, unit: 'dB', tol: 0.01, abs: 0.2,
  });
  S.say(33, '40 dB: one decade, minus 20.');
  S.say(40, 'Where does this line hit 0 dB? Three decades above the pole, at 10 MHz: gain × bandwidth. That product is the next scene.');
});

/* ── 6 ── */
scene(GF, 'One stage: gain, bandwidth and GBW', 86, (S) => {
  header(S, 'GROUND UP · 6', 'Gain × bandwidth does not depend on R: GBW = g_m / C');
  const cg = S.g(); const rr = S.into(cg);
  isrc(S, 260, 380, { label: 'g_m v_in', up: true, lsize: 22 }); wire(S, [[260, 300], [260, 338]]); wire(S, [[260, 422], [260, 480]]);
  wire(S, [[260, 300], [520, 300]]); dot(S, 400, 300); dot(S, 520, 300);
  res(S, 400, 300, 470, { label: 'R' }); cap(S, 520, 300, { label: 'C' }); wire(S, [[400, 470], [400, 480]]);
  wire(S, [[260, 480], [400, 480]]); gnd(S, 330, 480);
  wire(S, [[520, 300], [600, 300]]); txt(S, 610, 308, 'v_out', { size: 22, color: C.cur, weight: 700 });
  rr(); cg.style.opacity = 0; S.fade(cg, 0.3, 0.6);
  S.say(0.3, 'Every amplifier stage in this course is this picture: a transistor turns the input into a current $g_m v_{in}$, and that current flows into the resistance $R$ and capacitance $C$ at its output node.');
  eqAt(S, 'A_0 = g_m R,\\qquad \\omega_{-3dB} = \\frac{1}{RC}', 360, 600, 7, { size: 32, w: 620 });
  S.say(7, 'At low frequency the capacitor does nothing: the gain is $g_m R$. And the node is one pole, at $1/RC$.');
  eqAt(S, 'A_0\\times\\omega_{-3dB} = g_m R\\cdot\\frac{1}{RC} = \\frac{g_m}{C}', 360, 690, 14, { size: 32, w: 620, color: '#ffd38a' });
  S.say(14, 'Multiply them: $R$ cancels. Gain times bandwidth is $g_m/C$, whatever $R$ is. This product is the GBW, and it is where the gain line reaches 1.');
  // live Bode: R slides, GBW stays
  const B = bodeFrame(S, 800, 180, 720, 420, 3, 10, 60, -20, { title: '|A| in dB, while R changes', dbStep: 20 });
  B.g.style.opacity = 0; S.fade(B.g, 20, 0.6);
  const gm = 1e-3, Cc = 1e-12, ln = liveLine(S, C.volt, 4), gbl = S.el('line', { stroke: C.ok, 'stroke-width': 2, 'stroke-dasharray': '6 6' });
  const rd = txt(S, 1160, 672, '', { size: 21, color: C.text, weight: 700, anchor: 'middle', mono: true });
  gbl.style.opacity = 0; S.fade(gbl, 20, 0.5);
  S.anim(20, 1e4, ln.id + ':r', (_p, t) => {
    const R = 10 ** (4 + 1.5 * (0.5 - 0.5 * Math.cos(Math.max(0, t - 20) * 0.45))), A0 = gm * R, fp = 1 / (2 * Math.PI * R * Cc);
    ln.setAttribute('points', ptsOf(160, 3, 10, (e) => [B.fxp(10 ** e), clamp(B.fy(20 * Math.log10(A0 / Math.hypot(1, 10 ** e / fp))), 180, 600)]));
    const fu = gm / (2 * Math.PI * Cc); gbl.setAttribute('x1', B.fxp(fu)); gbl.setAttribute('x2', B.fxp(fu)); gbl.setAttribute('y1', 180); gbl.setAttribute('y2', 600);
    rd.textContent = `R = ${fx(R / 1e3, 3)} kΩ   A0 = ${fx(A0, 3)}   f−3dB = ${fmtHz(fp)}   ×  →  same GBW`;
  }, E.lin);
  S.out(rd, 33, 0.4);
  S.say(20, 'Watch $R$ slide up and down. The gain rises, the bandwidth falls, and the line always hits 0 dB at the same place: the dashed green line, $g_m/2\\pi C$.');
  S.stop(34, {
    src: EX,
    q: 'A stage has g_m = 1 mS, R = 100 kΩ and C = 1 pF. What is its DC gain A₀?',
    hint: ['At DC the capacitor is open; the current meets only R.', '$A_0 = g_m R$'],
    how: ['$$A_0 = g_mR = (1\\times10^{-3})(100\\times10^{3}) = 100$$'],
    answer: 100, unit: 'V/V', tol: 0.02,
  });
  S.stop(40, {
    src: EX,
    q: 'Same stage: what is its −3 dB bandwidth in Hz?',
    hint: ['One pole at the output node.', '$f_{-3dB} = \\dfrac{1}{2\\pi RC}$'],
    how: ['$$f_{-3dB} = \\frac{1}{2\\pi RC} = \\frac{1}{2\\pi(100\\,\\text{k})(1\\,\\text{p})} = 1.59\\,\\text{MHz}$$'],
    answer: 1 / (2 * Math.PI * 1e5 * 1e-12), unit: 'Hz', tol: 0.02,
  });
  S.stop(46, {
    src: EX,
    q: 'And its gain–bandwidth product GBW in Hz? (Try it two ways: A₀ × f−3dB, and g_m / 2πC.)',
    hint: ['Multiply the two answers above, or skip R altogether.', '$GBW = A_0 f_{-3dB} = \\dfrac{g_m}{2\\pi C}$'],
    how: ['From the two answers: $$GBW = 100\\times1.59\\,\\text{MHz} = 159\\,\\text{MHz}$$', 'Without R: $$\\frac{g_m}{2\\pi C} = \\frac{10^{-3}}{2\\pi\\times10^{-12}} = 159\\,\\text{MHz}$$'],
    why: 'In the two-stage op amp the same idea gives $GB = G_{m1}/C_c$: the input transistor’s $g_m$ over the Miller capacitor.',
    answer: 1e-3 / (2 * Math.PI * 1e-12), unit: 'Hz', tol: 0.02,
  });
  S.say(47, '100, 1.59 MHz, 159 MHz. Raise R and you trade bandwidth for gain; the product stays $g_m/C$.');
});

/* ── 7 ── */
scene(GF, 'Phase: each pole costs up to 90°', 70, (S) => {
  header(S, 'GROUND UP · 7', 'The lag of a pole is the angle of an arrow: 1 across, ω/ωp up');
  const ox = 260, oy = 640, u = 180;
  wire(S, [[ox - 30, oy], [ox + 3 * u, oy]], { color: '#2a3444', w: 1.6 }); wire(S, [[ox, oy + 30], [ox, oy - 2.4 * u]], { color: '#2a3444', w: 1.6 });
  const one = arrow(S, ox, oy, ox + u, oy, { color: C.volt, w: 4 }); label(S, ox + u / 2, oy + 34, '1', 0.5, { size: 22, color: C.volt, anchor: 'middle', weight: 700 });
  const up = dynArrow(S, C.cur, 4), hyp = dynArrow(S, C.amb, 4.5);
  const ang = txt(S, ox + 40, oy - 16, '', { size: 21, color: C.amb, weight: 700 });
  const rdo = txt(S, 1120, 320, '', { size: 26, color: C.text, weight: 700, anchor: 'middle', mono: true });
  const arc = S.el('path', { fill: 'none', stroke: C.amb, 'stroke-width': 2.4 });
  S.anim(3, 24, 'sweep', (p) => {
    const r = 0.05 + 2.2 * p, a = Math.atan(r);
    up.set(ox + u, oy, ox + u, oy - r * u); hyp.set(ox, oy, ox + u, oy - r * u);
    ang.textContent = `${fx(a * 180 / Math.PI, 3)}°`;
    arc.setAttribute('d', `M ${ox + 70} ${oy} A 70 70 0 0 0 ${ox + 70 * Math.cos(a)} ${oy - 70 * Math.sin(a)}`);
    rdo.textContent = `ω/ωp = ${fx(r, 3)}   lag = ${fx(a * 180 / Math.PI, 3)}°   size = ${fx(1 / Math.hypot(1, r), 3)}`;
  }, E.inout);
  label(S, ox + u + 14, oy - 90, 'ω/ωp', 3, { size: 22, color: C.cur, weight: 700 });
  S.say(0.3, 'Why does a pole make the output late? Write the pole as $1 + j\\omega/\\omega_p$: an arrow one unit across and $\\omega/\\omega_p$ up.');
  S.say(3, 'As the frequency rises the vertical part grows. The arrow tilts up: its angle is $\\tan^{-1}(\\omega/\\omega_p)$, and the output lags by that angle. Its length grows too, and the output shrinks by it.');
  S.say(16, 'It can tilt towards 90° but never past it. One pole costs at most 90°.');
  eqAt(S, '\\angle = -\\tan^{-1}\\frac{\\omega}{\\omega_{p1}} - \\tan^{-1}\\frac{\\omega}{\\omega_{p2}}\\;\\;(\\text{two poles: the lags add})', 1120, 470, 28, { size: 26, w: 860 });
  S.say(28, 'Two poles in a row: their lags add, so the total can approach 180°. That is the danger of a two-stage op amp, and the reason for compensation.');
  S.stop(38, {
    src: EX,
    q: 'One pole, signal at twice its frequency (ω = 2 ωp). How many degrees does the output lag?',
    hint: ['The lag is the angle of the arrow 1 across, ω/ωp up.', '$\\tan^{-1}(2)$'],
    how: ['$$\\text{lag} = \\tan^{-1}\\frac{\\omega}{\\omega_p} = \\tan^{-1}2 = 63.4^\\circ$$'],
    answer: Math.atan(2) * 180 / Math.PI, unit: '°', tol: 0.01,
    calc: [{ what: 'Angle in degrees', keys: 'Degree mode, then [SHIFT][tan] 2 [EXE]', shows: '63.43' }],
  });
  S.stop(46, {
    src: EX,
    q: 'Two poles. The signal is 10× above the first pole and at half the second (ω = 10 ωp1 = 0.5 ωp2). Total lag?',
    hint: ['Find each pole’s angle, then add them.', '$\\tan^{-1}10 + \\tan^{-1}0.5$'],
    how: ['First pole: $$\\tan^{-1}10 = 84.3^\\circ$$', 'Second pole: $$\\tan^{-1}0.5 = 26.6^\\circ$$', 'They add: $$84.3 + 26.6 = 110.9^\\circ$$'],
    parts: [{ q: 'The first pole’s lag, $\\tan^{-1}10$?', answer: Math.atan(10) * 180 / Math.PI, unit: '°', tol: 0.01, hint: ['$\\tan^{-1}(\\omega/\\omega_{p1})$ with ω/ωp1 = 10.'], how: ['$$\\tan^{-1}10 = 84.3^\\circ$$'] }],
    answer: (Math.atan(10) + Math.atan(0.5)) * 180 / Math.PI, unit: '°', tol: 0.01,
  });
  S.say(47, '63.4° for one pole at 2ωp; 84.3 + 26.6 = 110.9° for the pair.');
});

/* ── 8 ── */
scene(GF, 'Phase margin in one picture', 74, (S) => {
  header(S, 'GROUND UP · 8', 'Phase margin: how far from −180° the loop is when its gain falls to 1');
  const cg = S.g(); const rr = S.into(cg);
  amp(S, 300, 300, { w: 150, h: 150, label: 'A', lsize: 30 });
  wire(S, [[160, 262], [300, 262]]); txt(S, 150, 270, 'in', { size: 21, color: C.volt, anchor: 'end', weight: 700 });
  wire(S, [[450, 300], [620, 300]]); dot(S, 560, 300); txt(S, 630, 308, 'out', { size: 21, color: C.cur, weight: 700 });
  wire(S, [[560, 300], [560, 460], [240, 460], [240, 338], [300, 338]], { color: C.amb });
  txt(S, 400, 492, 'feedback β (here β = 1)', { size: 19, color: C.amb, anchor: 'middle', weight: 700 });
  rr(); cg.style.opacity = 0; S.fade(cg, 0.3, 0.6);
  S.flow([[560, 300], [560, 460], [240, 460], [240, 338], [300, 338]], 3, 30, { color: C.amb, speed: 60 });
  S.say(0.3, 'Close a loop around the op amp. A wiggle goes in, through the amplifier, and part of it comes back to the minus input.');
  S.say(5, 'The minus input already turns it upside down: 180°. If the amplifier’s poles add another 180° of lag, the wiggle comes back in step with itself. If it is also still at least as big, it feeds itself forever: oscillation.');
  eqAt(S, 'PM = 180^\\circ - (\\text{total lag where } |\\beta A| = 1)', 1080, 230, 16, { size: 30, w: 880 });
  eqAt(S, '\\text{two-stage op amp, }\\beta = 1:\\quad PM \\approx 90^\\circ - \\tan^{-1}\\frac{GB}{\\omega_{p2}}', 1080, 330, 22, { size: 28, w: 880, color: '#ffd38a' });
  S.say(16, 'So we ask: at the frequency where the loop gain has fallen to exactly 1, how much lag is there? 180° minus that lag is the phase margin.');
  S.say(22, 'For a two-stage op amp as a buffer, the gain reaches 1 at the GBW. By then the first pole is far behind and costs its full 90°. The second pole costs $\\tan^{-1}(GB/\\omega_{p2})$. What is left is the margin.');
  whyBox(S, 660, 420, 840, 120, '**Target ≈ 60°.** Below 45° the step response rings; at 60° there is no peaking; 90° is smooth but wastes speed (Lec 16).', 30);
  S.stop(40, {
    src: EX,
    q: 'A two-stage op amp as a buffer: GB = 10 MHz, second pole at 20 MHz (first pole far below). Phase margin?',
    hint: ['The first pole costs 90°; the second costs tan⁻¹(GB/f_p2).', '$PM = 90^\\circ - \\tan^{-1}\\dfrac{GB}{f_{p2}}$'],
    how: ['At the GBW the first pole has already taken its 90°.', 'The second pole’s lag there: $$\\tan^{-1}\\frac{10}{20} = \\tan^{-1}0.5 = 26.6^\\circ$$', '$$PM = 180 - 90 - 26.6 = 63.4^\\circ$$'],
    parts: [{ q: 'First, the second pole’s lag at the GBW, $\\tan^{-1}(GB/f_{p2})$?', answer: Math.atan(0.5) * 180 / Math.PI, unit: '°', tol: 0.01, hint: ['GB/f_p2 = 10/20.'], how: ['$$\\tan^{-1}0.5 = 26.6^\\circ$$'] }],
    answer: 90 - Math.atan(0.5) * 180 / Math.PI, unit: '°', tol: 0.01,
  });
  S.stop(50, {
    src: EX,
    q: 'Same GB = 10 MHz. Where must the second pole sit for a phase margin of only 45°?',
    hint: ['45° margin means the second pole costs 45° at the GBW.', '$\\tan^{-1}(GB/f_{p2}) = 45^\\circ \\Rightarrow f_{p2} = GB$'],
    how: ['$$90 - \\tan^{-1}\\frac{GB}{f_{p2}} = 45 \\;\\Rightarrow\\; \\tan^{-1}\\frac{GB}{f_{p2}} = 45^\\circ$$', '$\\tan 45° = 1$, so $$f_{p2} = GB = 10\\,\\text{MHz}$$'],
    why: 'Second pole at the GBW → 45°. To reach 60° it must sit higher: Lec 18 shows 2.2 × GB.',
    answer: 10e6, unit: 'Hz', tol: 0.02,
  });
  S.say(51, '63.4°, and the pole must sit at the GBW itself for 45°. Lecture 18 asks the real question: where for 60°, with a zero in the way too?');
});

/* ── 9 ── */
scene(GF, 'Slewing: when the current runs out', 88, (S) => {
  header(S, 'GROUND UP · 9', 'Small step: an exponential. Large step: a straight ramp at the slew rate, then the exponential');
  const P = plotBox(S, 140, 190, 760, 420, { title: 'output after a step at t = 0', x: 'time (ns)', xmax: 400, ymax: 2.2, xt: [[100, '100'], [200, '200'], [300, '300'], [400, '400']], yt: [[1, '1 V'], [2, '2 V']] });
  P.g.style.opacity = 0; S.fade(P.g, 0.3, 0.6);
  const tau = 50, sr = 10 / 1000; // τ = 50 ns, SR = 10 V/µs = 0.01 V/ns
  const lin = (V0) => (t) => V0 * (1 - Math.exp(-t / tau));
  const slew = (V0) => { const ts = (V0 - sr * tau) / sr; return (t) => (t < ts ? sr * t : V0 - sr * tau * Math.exp(-(t - ts) / tau)); };
  tracePlot(S, lin(0.4), (u) => P.X(u), (v) => P.Y(v), 4, 12, C.volt, 400);
  label(S, P.X(330), P.Y(0.4) - 12, 'small step 0.4 V: pure exponential', 6, { size: 17, color: C.volt, weight: 700, anchor: 'middle' });
  S.say(0.3, 'Back to the bucket. An amplifier in feedback answers a small step with the exponential of scene 2: fast at first, then easing in, with $\\tau$.');
  S.say(4, 'Small step, 0.4 V: a clean exponential. Its starting slope is the step over $\\tau$: $V_0/\\tau$.');
  tracePlot(S, slew(2), (u) => P.X(u), (v) => P.Y(v), 16, 30, C.cur, 400);
  const ramp = S.el('line', { x1: P.X(0), y1: P.Y(0), x2: P.X(205), y2: P.Y(2.05), stroke: C.amb, 'stroke-width': 2.4, 'stroke-dasharray': '8 7' }); ramp.style.opacity = 0; S.fade(ramp, 22, 0.5);
  label(S, P.X(20), P.Y(1.5), 'slope = SR (straight)', 22, { size: 17, color: C.amb, weight: 700 });
  label(S, P.X(285), P.Y(2) + 34, 'large step 2 V: ramp, then exponential', 16, { size: 17, color: C.cur, weight: 700, anchor: 'middle' });
  S.say(16, 'Large step, 2 V: the exponential would want a starting slope of 2 V over 50 ns, 40 volts per microsecond. The amplifier cannot: its largest current, into its capacitor, allows only so much.');
  S.say(22, 'So it ramps in a straight line at its top speed, the slew rate. Only when the remaining gap is small enough does it switch to the normal exponential.');
  eqAt(S, 'SR = \\frac{I_{max}}{C}\\;\\;(\\text{two-stage: } \\tfrac{I_5}{C_c})', 1240, 300, 28, { size: 28, w: 620 });
  eqAt(S, '\\text{slews if }\\; \\frac{V_0}{\\tau} > SR', 1240, 400, 28.4, { size: 28, w: 620 });
  S.say(28, 'The slew rate is scene 1 again: the largest current over the capacitor it charges. In the two-stage op amp, the tail current $I_5$ into $C_c$. It slews whenever the step wants a steeper start than that: $V_0/\\tau > SR$.');
  S.stop(38, {
    src: EX,
    q: 'A two-stage op amp has I₅ = 10 µA and C_c = 1 pF. What is its slew rate (V/s)?',
    hint: ['Scene 1: largest current over the capacitor it fills.', '$SR = \\dfrac{I_5}{C_c}$'],
    how: ['When slewing, all of the tail current $I_5$ charges $C_c$: $$SR = \\frac{I_5}{C_c} = \\frac{10\\,\\mu\\text{A}}{1\\,\\text{pF}} = 10^{7}\\,\\text{V/s} = 10\\,\\text{V/}\\mu\\text{s}$$'],
    answer: 1e7, unit: 'V/s', tol: 0.02,
  });
  S.stop(46, {
    src: EX,
    q: 'Its closed-loop τ is 50 ns. What is the largest step V₀ that does NOT slew?',
    hint: ['No slewing while the wanted starting slope V₀/τ stays at or below SR.', '$V_0 = SR\\cdot\\tau$'],
    how: ['Edge case: $$\\frac{V_0}{\\tau} = SR$$', '$$V_0 = SR\\cdot\\tau = (10^{7})(50\\times10^{-9}) = 0.5\\,\\text{V}$$'],
    answer: 0.5, unit: 'V', tol: 0.02,
  });
  S.stop(54, {
    src: EX,
    q: 'Now a 2 V step. Roughly how long does it slew before linear settling takes over? (It ramps until the remaining gap is SR·τ.)',
    hint: ['It ramps from 0 until only SR·τ is left to go.', '$t_{slew} = \\dfrac{V_0 - SR\\cdot\\tau}{SR}$'],
    how: ['Linear settling takes over when the gap left equals $SR\\cdot\\tau = 0.5$ V, so the ramp covers $$2 - 0.5 = 1.5\\,\\text{V}$$', 'At 10 V/µs: $$t_{slew} = \\frac{1.5\\,\\text{V}}{10^{7}\\,\\text{V/s}} = 150\\,\\text{ns}$$'],
    why: 'This is Tutorial 6 Q1(d) and Q2(c) in one line.',
    answer: 150e-9, unit: 's', tol: 0.02,
  });
  S.say(55, '10 V/µs; up to 0.5 V it stays linear; a 2 V step slews for about 150 ns.');
});

/* ── card ── */
scene(GF, 'Ground up in one card', 30, (S) => {
  header(S, 'GROUND UP · CARD', 'Everything Lec 18–19 will use');
  remember(S, ['$i = C\\,dv/dt$: a current fills a capacitor at $I/C$ (the slew rate).',
    '$\\tau = RC$: 63 % after τ, 95 % after 3τ, 1 % settling at $4.6\\tau$.',
    '$\\omega = 2\\pi f$; a pole at $\\omega_p = 1/RC$: size $1/\\sqrt{1+(\\omega/\\omega_p)^2}$, lag $\\tan^{-1}(\\omega/\\omega_p)$, −3 dB and −45° at the pole.',
    'dB = $20\\log$; above a pole: −20 dB/decade.',
    'One stage: $A_0 = g_mR$, $\\omega_{-3dB} = 1/RC$, $GBW = g_m/C$ (R cancels).',
    'Lags add; $PM = 180° - $ lag where $|\\beta A| = 1$; two-stage buffer: $PM ≈ 90° - \\tan^{-1}(GB/\\omega_{p2})$.',
    'Slews if $V_0/\\tau > SR$; then $t_{slew} ≈ (V_0 - SR\\,\\tau)/SR$.'], 0.4, 'Ground up in one card');
  S.say(0.4, 'Seven lines, and every one of them comes back in Lectures 18 and 19.');
}, { recall: ['i equals C dv by dt: a current fills a capacitor at I over C.', 'The pole is at one over R C; above it the gain falls twenty decibels per decade.', 'Gain times bandwidth is g m over C: R cancels.', 'Phase margin is 180 degrees minus the lag where the loop gain is one.'] });
