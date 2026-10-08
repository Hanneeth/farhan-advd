/* From zero: capacitors, time constants, sine waves, poles, dB, Bode plots, s, GBW, feedback and bandwidth. */
'use strict';
const LF = 'Frequency & poles from zero';
/* like eqFig, but each line may carry a time (5th item): it fades in then, so a formula never shows before its stop */
function eqFigAt(lines) {
  return (S2) => { const g = S2.g(); const r = S2.into(g); lines.forEach(([tex, y, sz, col, t]) => { const e = eq(S2, tex, 470, y, { size: sz || 28, w: 860, color: col }); if (t) { e.style.opacity = 0; S2.fade(e, t, 0.6); } }); r(); };
}
const PFX = 'Type µ, n, p, k, M with CATALOG ▸ Engineer Symbol; to see them in results: SETTINGS ▸ Calc Settings ▸ Engineer Symbol ▸ On.';

scene(LF, 'A capacitor: current in, voltage up', 64, (S) => {
  header(S, 'FROM ZERO · 1', 'A capacitor stores charge: i = C dv/dt');
  const g = S.g(); const r = S.into(g);
  rail(S, 300, 520, 200);
  isrc(S, 410, 280, { label: 'I (constant)' }); wire(S, [[410, 200], [410, 238]]);
  wire(S, [[410, 322], [410, 400]]); dot(S, 410, 400); wire(S, [[410, 400], [500, 400]]); txt(S, 508, 407, 'v', { size: 24, color: C.volt, weight: 700 });
  cap(S, 410, 400, { label: 'C' });
  r();
  S.draw(g, 0.3, 1.6);
  S.say(0.3, 'Start with the one component that makes everything slow: the <b>capacitor</b>. It is two plates; current flowing in piles charge on them, and the charge shows up as a voltage: $Q = Cv$.');
  // bucket
  S.el('rect', { x: 150, y: 300, width: 90, height: 260, rx: 10, fill: 'none', stroke: C.muted, 'stroke-width': 2.4 });
  const water = S.el('rect', { x: 153, y: 557, width: 84, height: 0, rx: 6, fill: C.volt, 'fill-opacity': 0.55 });
  txt(S, 195, 590, 'bucket', { size: 18, color: C.muted, anchor: 'middle' });
  S.flow([[410, 210], [410, 420]], 5, 26, { speed: 70 });
  S.anim(6, 12, 'wat', (p) => { water.setAttribute('y', 557 - 230 * p); water.setAttribute('height', 230 * p); }, E.lin);
  S.say(5, 'Think of a <b>bucket</b>: current is water flowing in, voltage is the water level, and $C$ is how wide the bucket is. A wide bucket (big $C$) rises slowly.');
  // graph
  const x0 = 760, y0 = 620;
  const ax = axes(S, x0, y0, 720, 430, { x: 'time t', y: 'v' }); S.fade(ax, 6, 0.6);
  const X = (t) => x0 + t * 60, Y = (v) => y0 - v * 36;
  tracePlot(S, (t) => t, X, Y, 6, 18, C.volt, 11);
  label(S, 1200, 260, 'constant current → straight line', 13, { size: 20, color: C.volt, weight: 700 });
  S.say(13, 'With a <b>constant</b> current the level rises by the same amount every second: a <b>straight ramp</b>.');
  eqAt(S, 'i = C\\,\\frac{dv}{dt}\\quad\\Rightarrow\\quad \\frac{dv}{dt} = \\frac{I}{C}', 1110, 730, 19, { size: 38, w: 800, color: '#ffd38a' });
  S.say(19, 'In symbols: $i = C\\,dv/dt$, so the slope is $dv/dt = I/C$ volts per second. Double the current → double the slope; double $C$ → half the slope.');
  tracePlot(S, (t) => 2 * t, X, Y, 26, 32, C.cur, 5.5);
  label(S, 1010, 230, '2I', 27, { size: 22, color: C.cur, weight: 800 });
  whyBox(S, 100, 640, 600, 190, '**Example (you will use this):** 100 µA into 5 pF → $\\frac{100\\,\\mu}{5\\,\\text{p}} = 20$ V/µs. The output of an op amp that can only push a fixed current into $C_L$ rises exactly like this — that is **slewing** (Lec 13).', 34);
  S.say(34, 'Units trick: µA ÷ pF gives V/µs directly. 100 µA into 5 pF ramps at 20 V/µs. Remember this picture — slewing in Lecture 13 is nothing more than this ramp.');
});


scene(LF, 'Charging through a resistor: the time constant τ', 84, (S) => {
  header(S, 'FROM ZERO · 2', 'Through a resistor the ramp slows down: τ = RC');
  const g = S.g(); const r = S.into(g);
  S.el('circle', { cx: 170, cy: 420, r: 30, fill: C.bg, stroke: C.amb, 'stroke-width': 2.6 });
  wire(S, [[156, 432], [168, 432], [168, 408], [184, 408]], { color: C.amb, w: 2.4 });
  txt(S, 120, 427, 'V_0', { size: 22, color: C.amb, weight: 700, anchor: 'end' });
  wire(S, [[170, 390], [170, 340], [240, 340]]); resh(S, 240, 380, 340, { label: 'R' }); wire(S, [[380, 340], [460, 340]]);
  dot(S, 460, 340); wire(S, [[460, 340], [560, 340]]); txt(S, 568, 347, 'v', { size: 24, color: C.volt, weight: 700 });
  cap(S, 460, 340, { label: 'C' }); wire(S, [[170, 450], [170, 382]]); gnd(S, 170, 450);
  r();
  S.draw(g, 0.3, 1.6);
  S.say(0.3, 'Now feed the capacitor from a voltage step $V_0$ through a resistor $R$. This is your Lecture 13 page’s first circuit, and every op amp output behaves like it.');
  const x0 = 740, y0 = 640, U = 115;
  const ax = axes(S, x0, y0, 780, 470, { x: 'time t', y: 'v' }); S.fade(ax, 4, 0.6);
  const X = (t) => x0 + t * U, Y = (v) => y0 - v * 380;
  const fin = S.el('line', { x1: x0, y1: Y(1), x2: x0 + 760, y2: Y(1), stroke: C.amb, 'stroke-width': 1.6, 'stroke-dasharray': '6 6' }); S.fade(fin, 4, 0.5);
  label(S, x0 + 764, Y(1) - 8, 'V_0', 4, { size: 20, color: C.amb, anchor: 'end', weight: 700 });
  // current bar
  S.el('rect', { x: 250, y: 470, width: 50, height: 230, rx: 8, fill: '#121926', stroke: '#2a3546' });
  const ib = S.el('rect', { x: 256, width: 38, rx: 6, fill: C.cur });
  txt(S, 275, 730, 'current', { size: 17, color: C.cur, anchor: 'middle' });
  S.anim(0, 1e4, 'ibar', (_p, t) => { const tt = clamp((t - 8) / 2.6, 0, 6); const h = t < 8 ? 0 : 220 * Math.exp(-tt); ib.setAttribute('y', 695 - h); ib.setAttribute('height', h); }, E.lin);
  tracePlot(S, (t) => 1 - Math.exp(-t), X, Y, 8, 23.6, C.volt, 6);
  S.say(8, 'At first the capacitor is empty, so the whole $V_0$ sits across $R$: a big current $V_0/R$ flows and $v$ shoots up.');
  S.say(14, 'But as $v$ rises, the voltage across $R$ — $V_0 - v$ — shrinks, so the current shrinks, so $v$ rises more slowly. It never quite stops: an <b>exponential</b>.');
  eqAt(S, 'v(t) = V_0\\left(1 - e^{-t/\\tau}\\right),\\qquad \\tau = RC', 380, 800, 20, { size: 34, w: 700, color: '#ffd38a' });
  S.say(20, 'The curve is $v(t) = V_0(1 - e^{-t/\\tau})$ with the <b>time constant</b> $\\tau = RC$ — ohms times farads gives seconds.');
  const marks = [[1, 0.632, '63 %  at τ', 26], [2.3, 0.9, '90 %  at 2.3τ', 31], [4.6, 0.99, '99 %  at 4.6τ', 36]];
  marks.forEach(([t, v, s2, tt]) => {
    const l = S.el('line', { x1: X(t), y1: y0, x2: X(t), y2: Y(v), stroke: C.p, 'stroke-width': 1.6, 'stroke-dasharray': '4 5' }); S.fade(l, tt, 0.5);
    const d = S.el('circle', { cx: X(t), cy: Y(v), r: 6, fill: C.p }); S.fade(d, tt, 0.5);
    label(S, X(t) + 8, Y(v) + 26, s2, tt, { size: 18, color: C.p, weight: 700 });
  });
  S.say(26, 'Landmarks to memorise: after one τ it has covered <b>63 %</b> of the way…');
  S.say(31, '…after 2.3τ, 90 %…');
  S.say(36, '…after 4.6τ, 99 % (within 1 %), and after 6.9τ, 99.9 % (within 0.1 %).');
  eqAt(S, '\\text{error after } t = e^{-t/\\tau}\\;\\Rightarrow\\; t = \\tau\\ln\\frac{1}{\\varepsilon}', 1130, 160, 41, { size: 30, w: 760 });
  S.say(41, 'Where those numbers come from: the gap left after time $t$ is $e^{-t/\\tau}$. Set it equal to the allowed error ε: $t = \\tau\\ln(1/\\varepsilon)$. $\\ln 100 = 4.6$, $\\ln 1000 = 6.9$. This is how every “settle within x %” question is solved.');
  const tg = S.el('line', { x1: X(0), y1: Y(0), x2: X(1), y2: Y(1), stroke: C.cur, 'stroke-width': 2.4, 'stroke-dasharray': '7 5' }); S.fade(tg, 52, 0.6);
  label(S, X(1) + 10, Y(1) - 12, 'starting slope = V_0/τ', 52, { size: 19, color: C.cur, weight: 700 });
  S.say(52, 'One more fact Lecture 13 needs: the <b>starting slope</b> is $V_0/\\tau$ — if it kept going straight it would reach $V_0$ in exactly one τ. A bigger step means a steeper start.');
  whyBox(S, 60, 560, 560, 120, '**Rise time** (10 % → 90 %) $= \\ln 9\\;\\tau \\approx 2.2\\tau$.', 62);
  S.say(62, 'And the lab favourite: the 10 %–90 % <b>rise time</b> is $2.2\\tau$.');
});

scene(LF, 'Sine waves: frequency, ω and phase', 62, (S) => {
  header(S, 'FROM ZERO · 3', 'A sine wave is a point going round a circle');
  const cx = 300, cy = 450, R0 = 150;
  S.el('circle', { cx, cy, r: R0, fill: 'none', stroke: '#2a3546', 'stroke-width': 2 });
  S.el('line', { x1: cx - R0 - 20, y1: cy, x2: 1520, y2: cy, stroke: '#2a3546', 'stroke-width': 1.6 });
  const arm = S.el('line', { x1: cx, y1: cy, stroke: C.volt, 'stroke-width': 3.4, 'stroke-linecap': 'round' });
  const tip = S.el('circle', { r: 8, fill: C.volt });
  const link = S.el('line', { stroke: C.volt, 'stroke-width': 1.4, 'stroke-dasharray': '4 5' });
  const wave = liveLine(S, C.volt);
  const wave2 = liveLine(S, C.cur, 3, '8 6'); wave2.style.opacity = 0;
  const xs = 560, pxPerRad = 75;
  S.anim(0, 1e4, 'rot', (_p, t) => {
    const th = Math.max(0, t - 3) * 1.1;
    const px = cx + R0 * Math.cos(th), py = cy - R0 * Math.sin(th);
    arm.setAttribute('x2', px); arm.setAttribute('y2', py); tip.setAttribute('cx', px); tip.setAttribute('cy', py);
    link.setAttribute('x1', px); link.setAttribute('y1', py); link.setAttribute('x2', xs); link.setAttribute('y2', py);
    const span = Math.min(th, 12.5);
    wave.setAttribute('points', ptsOf(200, 0, span, (u) => [xs + u * pxPerRad, cy - R0 * Math.sin(th - u)]));
    wave2.setAttribute('points', ptsOf(200, 0, span, (u) => [xs + u * pxPerRad, cy - R0 * Math.sin(th - u - Math.PI / 2)]));
  }, E.lin);
  S.say(0.3, 'Frequency is about <b>sine waves</b>. Picture a point going round a circle at a steady speed; its height, plotted against time, is a sine wave.');
  const t1 = whyBox(S, 900, 130, 640, 190, '**Frequency $f$** = turns per second (hertz, Hz). **Period** $T = 1/f$. **Angular frequency** $\\omega = 2\\pi f$ = radians per second (one turn = $2\\pi$ rad).', 9);
  S.say(9, 'How fast it goes round is the frequency $f$, in turns per second — hertz. Engineers often count in radians instead: one turn is $2\\pi$ radians, so $\\omega = 2\\pi f$ in rad/s.');
  S.say(17, '<span class="why">Units trap in every question:</span> formulas like $1/(RC)$ give ω in <b>rad/s</b>. Divide by $2\\pi$ only when the question asks for Hz.');
  S.fade(wave2, 24, 0.8);
  label(S, 1280, 690, 'same wave, 90° later', 24, { size: 20, color: C.cur, weight: 700 });
  S.say(24, '<b>Phase</b> is how far round the circle a wave is. The dashed wave is the same wave arriving a quarter-turn — <b>90°</b> — later: it <b>lags</b> by 90°.');
  whyBox(S, 900, 720, 640, 120, 'Lags of 90° and 180° are what make amplifiers ring and oscillate (Lec 14). A 180° lag turns a wave **upside down**.', 32);
  S.say(32, 'Remember two special lags: 90° (a quarter turn) and 180° (half a turn — the wave comes out upside down). Lecture 14’s stability story is built on these.');
});

scene(LF, 'Why gain falls at high frequency: the pole', 76, (S) => {
  header(S, 'FROM ZERO · 4', 'At the output node the capacitor steals the current');
  const g = S.g(); const r = S.into(g);
  wire(S, [[260, 250], [260, 300]]);
  S.el('polygon', { points: '260,310 280,334 260,358 240,334', fill: 'none', stroke: C.cur, 'stroke-width': 2.8 });
  arrow(S, 260, 318, 260, 352, { color: C.cur, w: 2.4, head: 10 });
  txt(S, 228, 342, 'g_m v_in', { size: 21, color: C.cur, weight: 700, anchor: 'end' });
  wire(S, [[260, 368], [260, 520]]);
  wire(S, [[260, 250], [620, 250]]); dot(S, 440, 250); dot(S, 620, 250);
  res(S, 440, 250, 520, { label: 'R_out', lcol: C.n }); cap(S, 620, 250, { label: 'C_L' });
  wire(S, [[260, 520], [440, 520]]); gnd(S, 440, 520);
  wire(S, [[620, 250], [700, 250]]); txt(S, 708, 257, 'v_out', { size: 22, color: C.volt, weight: 700 });
  r();
  S.draw(g, 0.3, 1.6);
  S.say(0.3, 'Every amplifier output, seen as a model: the input device pushes a current $g_mv_{in}$ into a node that has a resistance $R_{out}$ and a capacitance $C_L$ to ground.');
  S.say(6, 'At DC (frequency zero) the capacitor is an open circuit: all the current goes through $R_{out}$ and $v_{out} = g_mv_{in}R_{out}$ — the normal gain.');
  const zc = whyBox(S, 820, 130, 720, 140, 'A capacitor’s “resistance” to a sine wave is its **impedance** $\\frac{1}{\\omega C}$: huge at low frequency (open), tiny at high frequency (a short).', 11);
  S.say(11, 'For a sine wave, a capacitor acts like a resistance $1/(\\omega C)$: enormous at low frequency, tiny at high frequency.');
  // live split
  const R = 100e3, Cl = 5e-12, fp = 1 / (2 * Math.PI * R * Cl);
  const fOf = (t) => { if (t < 18) return 1e4; if (t < 36) return 10 ** (4 + 4 * E.inout(clamp((t - 18) / 16, 0, 1))); if (t < 40) return 10 ** (8 + (Math.log10(fp) - 8) * E.inout(clamp((t - 36) / 3, 0, 1))); return fp; };
  const aR = S.el('line', { x1: 440, y1: 300, x2: 440, y2: 300, stroke: C.n, 'stroke-linecap': 'round' });
  const aC = S.el('line', { x1: 620, y1: 300, x2: 620, y2: 300, stroke: C.p, 'stroke-linecap': 'round' });
  const ro = txt(S, 820, 340, '', { size: 24, color: C.text, weight: 700, mono: true });
  const ri = txt(S, 820, 390, '', { size: 21, color: C.muted, mono: true });
  const rv = txt(S, 820, 436, '', { size: 21, color: C.volt, mono: true });
  const vb = S.el('rect', { x: 820, y: 470, width: 0, height: 26, rx: 6, fill: C.volt });
  [ro, ri, rv].forEach((e) => (e.style.opacity = 0)); S.fade(ro, 18, 0.4); S.fade(ri, 18, 0.4); S.fade(rv, 18, 0.4);
  S.anim(0, 1e4, 'split', (_p, t) => {
    const f = fOf(t), k = f / fp, iR = 1 / Math.sqrt(1 + k * k), iC = k / Math.sqrt(1 + k * k);
    aR.setAttribute('stroke-width', 2 + 16 * iR); aR.setAttribute('y2', 300 + 160 * iR);
    aC.setAttribute('stroke-width', 2 + 16 * iC); aC.setAttribute('y2', 300 + 160 * iC);
    ro.textContent = 'f = ' + fmtHz(f);
    ri.textContent = `1/(ωC) = ${fx(1 / (2 * Math.PI * f * Cl) / 1e3)} kΩ   R = 100 kΩ`;
    rv.textContent = `v_out = ${fx(iR * 100, 3)} % of its DC value`;
    vb.setAttribute('width', 6.6 * iR * 100);
  }, E.lin);
  S.say(18, 'Now raise the frequency (R = 100 kΩ, C = 5 pF). Watch the two current paths: the purple arrow through $R$, the teal one through $C$.');
  S.say(25, 'As $1/(\\omega C)$ falls below $R$, more and more of the current escapes through the capacitor instead of through $R$ — and $v_{out}$, which is the current in $R$ times $R$, shrinks.');
  S.say(36, 'Back to the special frequency where the two paths are equal: $1/(\\omega C) = R$. There the output is down to 70.7 % of its DC value.');
  eqAt(S, '\\frac{1}{\\omega_pC} = R\\;\\;\\Rightarrow\\;\\; \\omega_p = \\frac{1}{RC},\\quad f_p = \\frac{1}{2\\pi RC}', 1180, 600, 42, { size: 34, w: 760, color: '#ffd38a' });
  S.say(42, 'That frequency is the <b>pole</b>: $\\omega_p = 1/(RC)$, or $f_p = 1/(2\\pi RC)$ in Hz. Here 2 Mrad/s, i.e. 318 kHz.');
  whyBox(S, 820, 680, 720, 150, '**A pole = a node with an R and a C.** Below the pole the gain is flat; above it the capacitor takes over and the gain falls. The pole’s frequency is **1/(RC)** of that node — and it is the same RC as the time constant τ.', 50);
  S.say(50, '<span class="why">The one sentence to keep:</span> every node with a resistance and a capacitance makes a pole at $1/(RC)$ — the same $RC$ as the time constant. Fast in time ⇔ high in frequency.');
});

scene(LF, 'Decibels and the Bode plot', 84, (S) => {
  header(S, 'FROM ZERO · 5', 'Draw gain on log axes: straight lines appear');
  const tb = html(S, 60, 130, 520, 420, `<table class="tbl"><tr><th>gain (×)</th><th>dB = 20 log₁₀</th></tr>
    <tr><td>1</td><td>0 dB</td></tr><tr><td>10</td><td>20 dB</td></tr><tr><td>100</td><td>40 dB</td></tr><tr><td>1000</td><td>60 dB</td></tr>
    <tr><td>2</td><td>≈ 6 dB</td></tr><tr><td>0.707 = 1/√2</td><td>−3 dB</td></tr><tr><td>0.1</td><td>−20 dB</td></tr></table>`);
  tb.style.opacity = 0; S.slideIn(tb, 0.4, 0.8);
  S.say(0.4, 'Gains range from 1 to 100 000, so engineers use <b>decibels</b>: $\\text{dB} = 20\\log_{10}(\\text{gain})$. Every ×10 adds 20 dB. A gain of 1 is 0 dB.');
  S.say(9, 'The one to remember: <b>−3 dB</b> means the gain has dropped to $1/\\sqrt2 = 0.707$ — exactly what happened at the pole.');
  const B = bodeFrame(S, 720, 150, 800, 300, 3, 9, 60, -20, { title: '|A| (dB), A_0 = 100 = 40 dB, f_p = 318 kHz' });
  B.g.style.opacity = 0; S.fade(B.g, 14, 0.7);
  const A0 = 100, fp = 318e3;
  const mag = (f) => 20 * Math.log10(A0 / Math.sqrt(1 + (f / fp) ** 2));
  const asy = S.el('polyline', { fill: 'none', stroke: C.amb, 'stroke-width': 2, 'stroke-dasharray': '8 6' });
  asy.setAttribute('points', [[3, 40], [Math.log10(fp), 40], [9, 40 - 20 * (9 - Math.log10(fp))]].map(([d, db]) => `${B.fxp(10 ** d)},${B.fy(Math.max(db, -20))}`).join(' '));
  const mline = S.el('polyline', { points: ptsOf(200, 3, 9, (d) => [B.fxp(10 ** d), B.fy(Math.max(mag(10 ** d), -20))]), fill: 'none', stroke: C.volt, 'stroke-width': 3.4 });
  S.draw(mline, 16, 2); S.fade(asy, 22, 0.6);
  S.say(14, 'The <b>Bode plot</b>: gain in dB against frequency on a <b>log</b> axis, where every decade (×10) gets the same width.');
  S.say(17, 'For one pole the curve is flat at $A_0$ (40 dB), then bends down at the pole…');
  S.say(22, '…and the dashed straight-line approximation explains the shape: flat, then falling <b>20 dB per decade</b> — ten times the frequency, one tenth of the gain.');
  // phase
  const P = bodeFrame(S, 720, 520, 800, 230, 3, 9, 0, -90, { title: 'phase (degrees)', dbStep: 45, unit: 'deg' });
  P.g.style.opacity = 0; S.fade(P.g, 30, 0.7);
  const ph = (f) => -Math.atan(f / fp) * 180 / Math.PI;
  const pline = S.el('polyline', { points: ptsOf(200, 3, 9, (d) => [P.fxp(10 ** d), P.fy(ph(10 ** d))]), fill: 'none', stroke: C.cur, 'stroke-width': 3.4 });
  S.draw(pline, 31, 2);
  S.say(30, 'The pole also delays the wave. The <b>phase</b> goes from 0° to −90°: −45° exactly at the pole, about −6° a decade below it, −84° a decade above.');
  // marker
  const mx = S.el('line', { stroke: '#ffffff', 'stroke-width': 1.6, 'stroke-dasharray': '4 4' }); mx.style.opacity = 0;
  const md = S.el('circle', { r: 7, fill: C.volt }); md.style.opacity = 0;
  const pd = S.el('circle', { r: 7, fill: C.cur }); pd.style.opacity = 0;
  const rd = txt(S, 80, 640, '', { size: 23, color: C.text, mono: true, weight: 700 }); const rd2 = txt(S, 80, 680, '', { size: 21, color: C.volt, mono: true }); const rd3 = txt(S, 80, 720, '', { size: 21, color: C.cur, mono: true });
  [mx, md, pd, rd, rd2, rd3].forEach((e) => S.fade(e, 38, 0.4));
  const fT = (t) => (t < 38 ? 1e3 : t < 50 ? 10 ** (3 + (Math.log10(fp) - 3) * E.inout((t - 38) / 12)) : t < 56 ? fp : t < 66 ? 10 ** (Math.log10(fp) + (Math.log10(fp * 10) - Math.log10(fp)) * E.inout((t - 56) / 10)) : fp * 10);
  S.anim(0, 1e4, 'mk', (_p, t) => {
    const f = fT(t), x = B.fxp(f);
    mx.setAttribute('x1', x); mx.setAttribute('x2', x); mx.setAttribute('y1', 150); mx.setAttribute('y2', 750);
    md.setAttribute('cx', x); md.setAttribute('cy', B.fy(mag(f))); pd.setAttribute('cx', x); pd.setAttribute('cy', P.fy(ph(f)));
    rd.textContent = 'f = ' + fmtHz(f); rd2.textContent = `|A| = ${fx(mag(f), 3)} dB  (×${fx(A0 / Math.sqrt(1 + (f / fp) ** 2), 3)})`; rd3.textContent = `phase = ${fx(ph(f), 3)}°`;
  }, E.lin);
  S.say(38, 'Slide along. Up to the pole the gain is still 100…');
  S.say(50, '…at the pole: 37 dB (×70.7, −3 dB) and −45°. <b>That frequency is the bandwidth</b> — the −3 dB frequency of a one-pole amplifier is its pole.');
  S.say(58, '…one decade higher: gain ×10 smaller (about 20 dB), phase −84°, nearly the full −90°.');
  whyBox(S, 60, 760, 600, 90, '**Bandwidth = −3 dB frequency = the pole** (one pole).', 68);
});

scene(LF, 'The pole in s-language (and why it is also τ)', 70, (S) => {
  header(S, 'FROM ZERO · 6', 'A(s) = A₀ / (1 + s/ω_p): one formula for frequency and time');
  eqAt(S, 'A(s) = \\frac{A_0}{1 + \\frac{s}{\\omega_p}}', 360, 210, 0.4, { size: 44, w: 600 });
  S.say(0.4, 'Your notes write every amplifier as a function of $s$. For one pole: $A(s) = A_0/(1 + s/\\omega_p)$. Here $s$ is a shorthand that does two jobs.');
  eqAt(S, 's = j\\omega \\;\\Rightarrow\\; |A| = \\frac{A_0}{\\sqrt{1 + (\\omega/\\omega_p)^2}},\\quad \\angle A = -\\tan^{-1}\\frac{\\omega}{\\omega_p}', 420, 330, 7, { size: 28, w: 820 });
  S.say(7, '<b>Job 1, frequency:</b> for a sine wave put $s = j\\omega$ ($j = \\sqrt{-1}$ marks the 90° direction). The size and angle of $1 + j\\omega/\\omega_p$ give exactly the Bode magnitude and phase you just saw.');
  eqAt(S, '\\omega = \\omega_p:\\; |A| = \\frac{A_0}{\\sqrt2},\\; -45^\\circ \\qquad \\omega = 10\\omega_p:\\; |A| \\approx \\frac{A_0}{10},\\; -84^\\circ', 420, 420, 14, { size: 26, w: 820, color: C.muted });
  // s-plane
  const ox = 1280, oy = 330;
  const sp = S.g();
  arrow(S, 960, oy, 1530, oy, { color: C.muted, w: 2, head: 11 }, sp); arrow(S, ox, 560, ox, 130, { color: C.muted, w: 2, head: 11 }, sp);
  txt(S, 1520, oy + 30, 'σ (real)', { size: 18, color: C.muted, anchor: 'end' }, sp); txt(S, ox + 10, 146, 'jω', { size: 18, color: C.muted }, sp);
  txt(S, 1120, 170, 'left half: decays', { size: 17, color: C.ok, anchor: 'middle' }, sp); txt(S, 1420, 170, 'right half: grows', { size: 17, color: C.bad, anchor: 'middle' }, sp);
  sp.style.opacity = 0; S.fade(sp, 20, 0.7);
  const xm = S.g();
  S.el('line', { x1: -12, y1: -12, x2: 12, y2: 12, stroke: C.amb, 'stroke-width': 4 }, xm); S.el('line', { x1: -12, y1: 12, x2: 12, y2: -12, stroke: C.amb, 'stroke-width': 4 }, xm);
  const xl = txt(S, 0, 40, 's = −ω_p', { size: 19, color: C.amb, weight: 700, anchor: 'middle' }, xm);
  xm.style.opacity = 0; S.fade(xm, 22, 0.5);
  S.say(20, '<b>Job 2, the pole’s location:</b> the pole is the value of $s$ that makes the denominator zero: $1 + s/\\omega_p = 0 \\Rightarrow s = -\\omega_p$. Draw it as an ✕ on the “s-plane”.');
  // step response linked to pole position
  const x0 = 960, y0 = 820;
  const ax = axes(S, x0, y0, 580, 190, { x: 't', y: 'step response' }); S.fade(ax, 30, 0.6);
  const sr = liveLine(S, C.volt); sr.style.opacity = 0; S.fade(sr, 30, 0.6);
  const wpOf = (t) => (t < 40 ? 1 : t < 48 ? 1 + 2 * E.inout((t - 40) / 8) : 3);
  S.anim(0, 1e4, 'pole', (_p, t) => {
    const w = wpOf(t);
    xm.setAttribute('transform', `translate(${ox - 95 * w} ${oy})`);
    sr.setAttribute('points', ptsOf(120, 0, 6, (u) => [x0 + u * 95, y0 - 160 * (1 - Math.exp(-w * u))]));
  }, E.lin);
  S.say(30, 'And in time? A pole at $s = -\\omega_p$ means the response contains $e^{-\\omega_pt}$ — a decaying exponential with time constant $\\tau = 1/\\omega_p$.');
  S.say(40, 'Push the pole further left (a higher $\\omega_p$): the step response gets <b>faster</b>. Same fact as before, now in pictures: high pole frequency ⇔ short time constant.');
  whyBox(S, 60, 520, 760, 200, '**Pole ⇔ time constant:** $\\tau = \\frac{1}{\\omega_p}$. A pole in the **left** half-plane decays (stable); in the **right** half it grows (unstable). Lec 14–16 are about keeping poles on the left.', 50);
  S.say(50, '<span class="why">Why this matters later:</span> a pole on the left decays; a pole on the right would grow forever. Stability (Lecture 14 onwards) is all about where the poles sit.');
});

scene(LF, 'Gain-bandwidth: why ω_u = g_m/C_L', 72, (S) => {
  header(S, 'FROM ZERO · 7', 'Past the pole, gain × frequency is constant');
  const B = bodeFrame(S, 120, 150, 840, 520, 2, 9, 80, -20, { title: '|A| (dB)' });
  B.g.style.opacity = 0; S.fade(B.g, 0.3, 0.7);
  const fu = 10e6;
  const curveFor = (A0) => ptsOf(220, 2, 9, (d) => { const f = 10 ** d, fp = fu / A0; return [B.fxp(f), B.fy(Math.max(-20, 20 * Math.log10(A0 / Math.sqrt(1 + (f / fp) ** 2))))]; });
  const ln = liveLine(S, C.volt);
  const uD = S.el('circle', { r: 8, fill: C.amb }); const uT = txt(S, 0, 0, 'f_u = 10 MHz', { size: 19, color: C.amb, weight: 700 });
  uD.setAttribute('cx', B.fxp(fu)); uD.setAttribute('cy', B.fy(0)); uT.setAttribute('x', B.fxp(fu) + 12); uT.setAttribute('y', B.fy(0) - 12);
  uD.style.opacity = 0; uT.style.opacity = 0; S.fade(uD, 12, 0.5); S.fade(uT, 12, 0.5);
  const rd = txt(S, 1010, 200, '', { size: 23, color: C.text, mono: true, weight: 700 }); const rd2 = txt(S, 1010, 240, '', { size: 21, color: C.muted, mono: true }); const rd3 = txt(S, 1010, 280, '', { size: 21, color: C.amb, mono: true });
  const A0of = (t) => (t < 24 ? 1000 : t < 34 ? 10 ** (3 + 0.5 * E.inout((t - 24) / 10)) : t < 44 ? 10 ** (3.5 - 1.5 * E.inout((t - 34) / 10)) : 100);
  S.anim(0, 1e4, 'gbw', (_p, t) => { const A0 = A0of(t); ln.setAttribute('points', curveFor(A0)); rd.textContent = `A0 = ${fx(A0, 3)}  (${fx(20 * Math.log10(A0), 3)} dB)`; rd2.textContent = `f_p = ${fmtHz(fu / A0)}`; rd3.textContent = `A0 × f_p = ${fmtHz(fu)}`; }, E.lin);
  S.say(0.3, 'Past its pole a one-pole gain falls 10× for every 10× in frequency. So the product <b>gain × frequency</b> stays the same all along that sloping line.');
  S.say(12, 'Follow the line down to gain 1 (0 dB). That frequency is the <b>unity-gain frequency</b> $\\omega_u$, and by the constant product, $\\omega_u = A_0\\,\\omega_p$: the <b>gain-bandwidth product</b>, GBW.');
  S.say(24, 'Now the 5-T OTA. $A_0 = g_mR_{out}$ and $\\omega_p = 1/(R_{out}C_L)$. Watch what happens if $R_{out}$ changes: more gain, but the pole moves down by the same factor…');
  S.say(34, '…less gain, the pole moves up. The sloping line never moves. Multiply them:');
  eqAt(S, '\\omega_u = A_0\\omega_p = g_mR_{out}\\cdot\\frac{1}{R_{out}C_L} = \\frac{g_m}{C_L}', 1250, 400, 34, { size: 30, w: 620, color: '#ffd38a' });
  S.say(44, '$R_{out}$ <b>cancels</b>: $\\omega_u = g_m/C_L$. The speed of an OTA is set only by the input $g_m$ and the load capacitor. In Hz: $f_u = g_m/(2\\pi C_L)$.');
  whyBox(S, 1000, 500, 560, 220, '**Exam uses:** “GBW ≥ 5 MHz with 5 pF” → $g_m = 2\\pi f_uC_L$. “Bandwidth of the amp” → $1/(2\\pi R_{out}C_L)$. Know which one is asked.', 52);
  S.say(52, 'So two different questions: the open-loop <b>bandwidth</b> $1/(2\\pi R_{out}C_L)$, and the <b>GBW</b> $g_m/(2\\pi C_L)$. Lab 7 and Quiz 1 ask both.');
});

scene(LF, 'Feedback trades gain for bandwidth', 80, (S) => {
  header(S, 'FROM ZERO · 8', 'Close the loop: the pole moves up by (1 + βA₀)');
  const B = bodeFrame(S, 120, 150, 840, 520, 2, 9, 80, -20, { title: '|A| (dB): open loop (blue), closed loop (orange)' });
  B.g.style.opacity = 0; S.fade(B.g, 0.3, 0.7);
  const fu = 10e6, A0 = 1000;
  const ol = S.el('polyline', { points: ptsOf(220, 2, 9, (d) => { const f = 10 ** d; return [B.fxp(f), B.fy(Math.max(-20, 20 * Math.log10(A0 / Math.sqrt(1 + (f / (fu / A0)) ** 2))))]; }), fill: 'none', stroke: C.volt, 'stroke-width': 3 });
  S.draw(ol, 0.5, 1.5);
  S.say(0.3, 'The open-loop op amp (blue): gain 1000, pole at 10 kHz, unity gain at 10 MHz.');
  const cl = liveLine(S, C.cur, 3.6); cl.style.opacity = 0; S.fade(cl, 8, 0.6);
  const bOf = (t) => (t < 30 ? 0.1 : t < 40 ? 10 ** (-1 - 1 * E.inout((t - 30) / 10)) : t < 50 ? 10 ** (-2 + 2 * E.inout((t - 40) / 10)) : 1);
  const rd = txt(S, 1010, 200, '', { size: 23, color: C.text, mono: true, weight: 700 }); const rd2 = txt(S, 1010, 240, '', { size: 21, color: C.cur, mono: true }); const rd3 = txt(S, 1010, 280, '', { size: 21, color: C.amb, mono: true });
  S.anim(0, 1e4, 'cl', (_p, t) => {
    const b = bOf(t), Acl = A0 / (1 + b * A0), fcl = (fu / A0) * (1 + b * A0);
    cl.setAttribute('points', ptsOf(220, 2, 9, (d) => { const f = 10 ** d; return [B.fxp(f), B.fy(Math.max(-20, 20 * Math.log10(Acl / Math.sqrt(1 + (f / fcl) ** 2))))]; }));
    rd.textContent = `β = ${fx(b, 3)}`; rd2.textContent = `closed-loop gain = ${fx(Acl, 3)}`; rd3.textContent = `closed-loop pole = ${fmtHz(fcl)}`;
  }, E.lin);
  S.say(8, 'Close the loop with β = 0.1 (a gain-of-10 amplifier, orange). The gain drops to about 10, but the curve now stays flat until it meets the blue line — at about 1 MHz.');
  eqAt(S, '\\frac{A(s)}{1+\\beta A(s)} = \\frac{\\frac{A_0}{1+\\beta A_0}}{1 + \\frac{s}{\\omega_p(1+\\beta A_0)}}', 1270, 420, 18, { size: 28, w: 600 });
  S.say(18, 'The algebra (one line): put $A(s) = A_0/(1+s/\\omega_p)$ into $A/(1+\\beta A)$. The gain is divided by $(1+\\beta A_0)$ and the <b>pole is multiplied</b> by $(1+\\beta A_0)$.');
  S.say(30, 'Change β and watch: less feedback → more gain, less bandwidth; more feedback → less gain, more bandwidth. The corner always slides along the blue line, so gain × bandwidth stays $\\omega_u$.');
  eqAt(S, '\\omega_{p,cl} = \\omega_p(1+\\beta A_0) \\approx \\beta\\,\\omega_u \\qquad \\tau_{cl} = \\frac{1}{\\beta\\omega_u}', 1270, 560, 44, { size: 28, w: 620, color: '#ffd38a' });
  S.say(44, 'Since $\\beta A_0 \\gg 1$: the closed-loop pole is $\\approx \\beta\\omega_u$ and the closed-loop time constant is $\\tau = 1/(\\beta\\omega_u)$. A buffer (β = 1) gets the whole $\\omega_u$.');
  whyBox(S, 1000, 640, 560, 190, '**The settling formula of Lec 13:** $t_{settle} = \\tau\\ln\\frac1\\varepsilon$ with $\\tau = \\frac{1}{\\beta\\omega_u}$. Razavi Ex 9.2 and PS1 P2 are exactly this.', 54);
  S.say(54, 'Put this together with $t = \\tau\\ln(1/\\varepsilon)$ and you can already solve every settling-time question — two of them are coming up.');
});

scene(LF, 'Frequency & poles in one card', 30, (S) => {
  header(S, 'FROM ZERO · REMEMBER', 'Everything you need for Lec 13–14');
  remember(S, [
    'Capacitor: $i = C\\,dv/dt$. Constant current → straight ramp at $I/C$ (µA/pF = V/µs).',
    'Through R: $v = V_0(1 - e^{-t/\\tau})$, $\\tau = RC$. 63 % at τ; within ε after $\\tau\\ln(1/\\varepsilon)$: 4.6τ (1 %), 6.9τ (0.1 %). Rise time 2.2τ. Starting slope $V_0/\\tau$.',
    '$\\omega = 2\\pi f$. A node with R and C makes a **pole** at $\\omega_p = 1/(RC)$; $\\tau = 1/\\omega_p$.',
    'Bode: flat, then −20 dB/decade; −3 dB (×0.707) and −45° at the pole; phase → −90°. Bandwidth = the pole.',
    'GBW: $\\omega_u = A_0\\omega_p$; OTA $\\omega_u = g_m/C_L$.',
    'Feedback: gain ÷ $(1+\\beta A_0)$, pole × $(1+\\beta A_0)$ ≈ $\\beta\\omega_u$; $\\tau_{cl} = 1/(\\beta\\omega_u)$.',
  ], 0.4, 'Frequency & poles · remember');
  S.say(0.4, 'Read it once. Then four questions that use only this chapter: Lab 1, a past tutorial on pole shifting, Lab 7 and Lab 8.');
});

/* ── questions for the foundations ── */
function rcFig(S) {
  const g = S.g(); const r = S.into(g);
  S.el('circle', { cx: 200, cy: 450, r: 30, fill: C.bg, stroke: C.amb, 'stroke-width': 2.6 });
  wire(S, [[186, 462], [198, 462], [198, 438], [214, 438]], { color: C.amb, w: 2.4 });
  wire(S, [[200, 420], [200, 360], [300, 360]]); resh(S, 300, 460, 360, { label: 'R = 1 kΩ' }); wire(S, [[460, 360], [560, 360]]);
  dot(S, 560, 360); wire(S, [[560, 360], [680, 360]]); txt(S, 688, 367, 'v_out', { size: 22, color: C.volt, weight: 700 });
  cap(S, 560, 360, { label: 'C' }); wire(S, [[200, 480], [200, 500]]); gnd(S, 200, 500);
  r(); return g;
}
scene(LF, 'Lab 1: an RC low-pass filter', 50, (S) => {
  pyqFrame(S, {
    tag: 'FROM ZERO · QUESTION 1 OF 4', title: 'Design an RC low-pass', src: 'Lab 1 (hand calculations)',
    q: 'First-order RC low-pass with $R = 1$ kΩ and a 1 ns time constant. Find $C$, the 10–90 % rise time, the DC gain and the −3 dB bandwidth.', qh: 200,
    tests: 'τ = RC, rise time = 2.2τ, and bandwidth = the pole $1/(2\\pi RC)$.',
    fig: (S2) => { const g = rcFig(S2); g.setAttribute('transform', 'translate(40 40)'); },
    steps: [
      { t: 6, title: 'The time constant of an RC circuit is **τ = RC**, so the capacitor is **C = τ/R**.', tex: 'C = \\frac{\\tau}{R} = \\frac{1\\,\\mathrm{ns}}{1\\,\\mathrm{k\\Omega}} = 1\\,\\mathrm{pF}',
        try: { q: 'Part 1: what capacitor $C$ gives the required 1 ns time constant?', answer: ans('bank-lab1', 'c'), unit: 'F', tol: 0.02,
          hint: ['The time constant of an RC circuit is the resistor times the capacitor. Rearrange it for the unknown.', '$\\tau = RC \\;\\Rightarrow\\; C = \\dfrac{\\tau}{R}$'],
          how: ['Write the time constant of a first-order RC circuit. $$\\tau = RC$$',
            'Rearrange for the unknown, the capacitor. $$C = \\frac{\\tau}{R}$$',
            'Put in τ = 1 ns and R = 1 kΩ; the powers of ten give $10^{-9}/10^{3} = 10^{-12}$. $$C = \\frac{1\\times10^{-9}\\,\\mathrm{s}}{1\\times10^{3}\\,\\Omega} = 1\\times10^{-12}\\,\\mathrm{F} = 1\\,\\mathrm{pF}$$'],
          why: 'Unit shortcut: ns ÷ kΩ = pF.' }, say: '$C = \\tau/R = 1$ ns / 1 kΩ = 1 pF.' },
      { t: 13, title: 'After a step the output is $1 - e^{-t/\\tau}$. It passes 10 % at 0.105τ and 90 % at 2.303τ, so the **rise time is ln 9 · τ ≈ 2.2τ**.', tex: 't_r = t_{90} - t_{10} = \\tau\\ln 9 \\approx 2.2\\,\\tau = 2.2\\,\\mathrm{ns}',
        try: { q: 'Part 2: what is the 10 %–90 % rise time of the output after an input step?', answer: ans('bank-lab1', 'tr'), unit: 's', tol: 0.02,
          hint: ['The step response is $1 - e^{-t/\\tau}$. Find when it reaches 10 % and when it reaches 90 %, then subtract.', '$t_{10} = \\tau\\ln\\frac{1}{0.9},\\; t_{90} = \\tau\\ln 10,\\; t_r = t_{90} - t_{10}$'],
          how: ['The output after a step rises as $$v_{out}(t) = V\\left(1 - e^{-t/\\tau}\\right)$$',
            'It reaches 10 % when $e^{-t/\\tau} = 0.9$, and 90 % when $e^{-t/\\tau} = 0.1$. $$t_{10} = \\tau\\ln\\frac{1}{0.9} = 0.105\\,\\tau,\\quad t_{90} = \\tau\\ln 10 = 2.303\\,\\tau$$',
            'Subtract to get the rise time. $$t_r = t_{90} - t_{10} = \\tau\\ln 9 \\approx 2.2\\,\\tau$$',
            'Put in τ = 1 ns. $$t_r = 2.2\\times1\\,\\mathrm{ns} = 2.2\\,\\mathrm{ns}$$'],
          why: 'Rise time = 2.2τ for any one-pole circuit. Memorise it.' }, say: '10 % is reached at 0.105τ and 90 % at 2.303τ: the difference is 2.2τ = 2.2 ns.' },
      { t: 20, title: '**DC gain = 1**: at DC the capacitor is an open circuit. The **bandwidth is the pole** $1/(RC)$ rad/s, divided by 2π to get Hz.', tex: 'f_{-3dB} = \\frac{1}{2\\pi RC} = \\frac{1}{2\\pi\\,(1\\,\\mathrm{ns})} = 159\\,\\mathrm{MHz}',
        try: { q: 'Part 3: what is the −3 dB bandwidth of the filter, in Hz?', answer: ans('bank-lab1', 'f3'), unit: 'Hz', tol: 0.02,
          hint: ['An RC low-pass has one pole at ω = 1/(RC) rad/s. The gain is 3 dB down exactly there. Convert rad/s to Hz.', '$f_{-3dB} = \\dfrac{1}{2\\pi RC} = \\dfrac{1}{2\\pi\\tau}$'],
          how: ['The only pole of an RC low-pass is at $$\\omega_p = \\frac{1}{RC} = \\frac{1}{\\tau}$$',
            'The gain is 3 dB down exactly at the pole, so that is the bandwidth. Divide by 2π to get Hz. $$f_{-3dB} = \\frac{1}{2\\pi\\tau}$$',
            'Put in τ = 1 ns. $$f_{-3dB} = \\frac{1}{2\\pi\\times1\\times10^{-9}\\,\\mathrm{s}} = 1.59\\times10^{8}\\,\\mathrm{Hz} = 159\\,\\mathrm{MHz}$$'],
          why: 'rad/s ÷ 2π = Hz. Forgetting the 2π is the most common slip.',
          calc: [{ what: '1/(2πτ) with prefixes', keys: '1 ÷ ( 2 × [SHIFT] [7] × 1n ) [EXE]', shows: '159.15M', note: PFX }] }, say: 'One pole at $1/(RC)$ rad/s; divide by $2\\pi$: 159 MHz. DC gain 1 (0 dB).' },
      { t: 27, ans: true, title: '**Answers:** $C = 1$ pF · $t_r = 2.2$ ns · DC gain 1 · $f_{-3dB} = 159$ MHz', say: 'Three facts did it all: τ = RC, rise time 2.2τ, bandwidth $1/(2\\pi\\tau)$.' },
    ],
  });
}, { q: 'Lab 1' });

scene(LF, 'Past tutorial: how far feedback moves a pole', 46, (S) => {
  pyqFrame(S, {
    tag: 'FROM ZERO · QUESTION 2 OF 4', title: 'Feedback pushes the pole up', src: 'Past tutorial 2024-25 T2 Ex 1',
    q: 'An op amp has one pole at 100 Hz and gain $10^5$; it is used with $\\beta = 0.01$. By what factor does feedback shift the pole, and to what frequency? With $\\beta$ for a gain of +1, where does it go?', qh: 220,
    tests: 'the closed-loop pole $\\omega_p(1+\\beta A_0)$ from the last theory scene.',
    fig: (S2) => { const B = bodeFrame(S2, 110, 200, 760, 460, 1, 8, 100, 0, { title: '|A| (dB): open loop and the two closed loops' }); const A0 = 1e5, fp = 100;
      S2.el('polyline', { points: ptsOf(200, 1, 8, (d) => { const f = 10 ** d; return [B.fxp(f), B.fy(Math.max(0, 20 * Math.log10(A0 / Math.sqrt(1 + (f / fp) ** 2))))]; }), fill: 'none', stroke: C.volt, 'stroke-width': 3 });
      // each closed-loop curve appears only after its stop (its corner IS the answer)
      [[0.01, C.cur, 6], [1, C.amb, 14]].forEach(([b, col, tIn]) => { const Ac = A0 / (1 + b * A0), fc = fp * (1 + b * A0); const pl = S2.el('polyline', { points: ptsOf(200, 1, 8, (d) => { const f = 10 ** d; return [B.fxp(f), B.fy(Math.max(0, 20 * Math.log10(Ac / Math.sqrt(1 + (f / fc) ** 2))))]; }), fill: 'none', stroke: col, 'stroke-width': 3, 'stroke-dasharray': '8 5' }); pl.style.opacity = 0; S2.fade(pl, tIn, 0.6); }); },
    steps: [
      { t: 6, title: 'Feedback divides the gain by $1 + \\beta A_0$ and **multiplies the pole by the same factor**.', tex: "f_p' = f_p(1 + \\beta A_0) = 100\\,\\mathrm{Hz}\\times(1 + 0.01\\times10^5) = 100\\,\\mathrm{Hz}\\times1001 = 100.1\\,\\mathrm{kHz}",
        try: { parts: [{ q: 'First: by what factor does feedback move the pole? ($1 + \\beta A_0$)', answer: 1 + 0.01 * 1e5, unit: '', tol: 0.005, hint: ['Loop gain plus one, with β = 0.01 and $A_0 = 10^5$.'], how: ['$$1 + \\beta A_0 = 1 + 0.01\\times10^5 = 1001$$'] }],
          q: '(a) With β = 0.01, to what frequency does the pole move (in Hz)?', answer: ans('pyq-t24-ex1', 'f1'), unit: 'Hz', tol: 0.01,
          hint: ['Negative feedback trades gain for bandwidth: the gain falls by $1 + \\beta A_0$ and the pole rises by the same factor.', "$f_p' = f_p\\,(1 + \\beta A_0)$"],
          how: ['Find the factor feedback works with, the loop gain plus one. $$1 + \\beta A_0 = 1 + 0.01\\times10^5 = 1001$$',
            "The pole moves up by that factor. $$f_p' = f_p(1 + \\beta A_0) = 100\\,\\mathrm{Hz}\\times1001 = 100.1\\,\\mathrm{kHz}$$",
            'Check: the gain falls by the same factor, $10^5/1001 \\approx 100$, so gain × bandwidth is still $10^5\\times100$ Hz = 10 MHz.'],
          why: 'Quick check: closed-loop pole ≈ β·f_u = 0.01 × 10 MHz = 100 kHz.' }, say: 'The pole is multiplied by $1 + \\beta A_0 = 1001$: from 100 Hz to 100.1 kHz (orange).' },
      { t: 14, title: 'A gain of +1 is a **buffer**: all of the output is fed back, so **β = 1** and the factor is $1 + A_0$.', tex: "f_p'' = 100\\,\\mathrm{Hz}\\times(1 + 1\\times10^5) = 100\\,\\mathrm{Hz}\\times100\\,001 \\approx 10\\,\\mathrm{MHz}",
        try: { parts: [{ q: 'First: β for a buffer, then the new factor $1 + \\beta A_0$?', answer: 1 + 1e5, unit: '', tol: 0.005, hint: ['A buffer feeds back all of $V_{out}$: β = 1.'], how: ['β = 1, so $$1 + \\beta A_0 = 1 + 10^5 = 100\\,001$$'] }],
          q: '(b) Now the op amp is used as a buffer (gain +1). Where is the pole now (in Hz)?', answer: ans('pyq-t24-ex1', 'f2'), unit: 'Hz', tol: 0.01,
          hint: ['A buffer feeds the whole output back to the input. What is β?', "β = 1, so $f_p'' = f_p\\,(1 + A_0)$"],
          how: ['A buffer feeds all of the output back. $$\\beta = 1$$',
            'The factor is now $$1 + \\beta A_0 = 1 + 10^5 = 100\\,001$$',
            "Multiply the open-loop pole by it. $$f_p'' = 100\\,\\mathrm{Hz}\\times100\\,001 \\approx 10\\,\\mathrm{MHz}$$"],
          why: 'A buffer’s bandwidth is the op amp’s unity-gain frequency, $f_u = A_0f_p$.' }, say: 'With β = 1 the factor is 100 001: the pole lands at 10 MHz — the op amp’s whole $f_u = A_0f_p$ (yellow).' },
      { t: 22, ans: true, title: `**Answers:** ×1001 → 100.1 kHz · buffer → 10 MHz (= $A_0f_p$)`, say: 'Quick check you can always do: the closed-loop pole is about $\\beta f_u$. Here $f_u = 10^5 \\times 100$ Hz = 10 MHz.' },
    ],
  });
}, { q: 'Past tutorial Ex 1' });

scene(LF, 'Lab 7: specs into numbers (g_m, dB)', 44, (S) => {
  pyqFrame(S, {
    tag: 'FROM ZERO · QUESTION 3 OF 4', title: 'Translate the specs of a 5-T OTA', src: 'Lab 7 (hand calculations)',
    q: 'Specs: GBW ≥ 5 MHz with $C_L = 5$ pF, DC gain ≥ 34 dB, CMRR ≥ 74 dB. Find the minimum $g_{m1,2}$, the minimum gain as a ratio and the minimum CMRR as a ratio.', qh: 220,
    tests: 'GBW = $g_m/(2\\pi C_L)$ and converting dB back to a ratio.',
    fig: (S2) => { const g = S2.g(); const r = S2.into(g); const e1 = eq(S2, 'f_u = \\frac{g_m}{2\\pi C_L}', 460, 330, { size: 52 }); const e2 = eq(S2, '\\text{ratio} = 10^{\\,\\text{dB}/20}', 460, 500, { size: 46 }); r(); [[e1, 6], [e2, 13]].forEach(([e, t]) => { e.style.opacity = 0; S2.fade(e, t, 0.6); }); },
    steps: [
      { t: 6, title: 'A one-stage OTA has **GBW = $g_m/(2\\pi C_L)$**, so the GBW spec fixes the **minimum $g_m = 2\\pi f_uC_L$**.', tex: 'g_m = 2\\pi f_u C_L = 2\\pi(5\\,\\mathrm{MHz})(5\\,\\mathrm{pF}) = 0.157\\,\\mathrm{mS}',
        try: { q: '(a) What is the minimum $g_{m1,2}$ of the input pair that meets the GBW spec?', answer: ans('bank-lab7', 'gm'), unit: 'S', tol: 0.02,
          hint: ['For a one-stage OTA the unity-gain frequency depends only on the input transconductance and the load capacitor.', '$f_u = \\dfrac{g_m}{2\\pi C_L} \\;\\Rightarrow\\; g_m = 2\\pi f_u C_L$'],
          how: ['The GBW of a one-stage OTA is gain $g_mR_{out}$ times pole $1/(2\\pi R_{out}C_L)$; $R_{out}$ cancels. $$f_u = \\frac{g_m}{2\\pi C_L}$$',
            'Rearrange for $g_m$. $$g_m = 2\\pi f_u C_L$$',
            'Put in the specs, 5 MHz and 5 pF. $$g_m = 2\\pi\\times5\\times10^{6}\\times5\\times10^{-12} = 1.57\\times10^{-4}\\,\\mathrm{S} = 0.157\\,\\mathrm{mS}$$'],
          why: 'GBW gives $g_m$ directly: no $R_{out}$ needed.' }, say: '$g_m = 2\\pi(5\\,\\text{MHz})(5\\,\\text{pF}) = 0.157$ mS.' },
      { t: 13, title: 'Voltage gain in dB is $20\\log_{10}$(ratio). **To go back: divide by 20, then raise 10 to that power.**', tex: 'A = 10^{34/20} = 10^{1.7} = 50.1',
        try: { q: '(b) The DC gain must be at least 34 dB. What is that as a plain ratio (V/V)?', answer: ans('bank-lab7', 'a'), unit: '', tol: 0.02,
          hint: ['dB for a voltage gain is $20\\log_{10}$ of the ratio. Undo the log.', '$\\text{ratio} = 10^{\\,\\text{dB}/20}$'],
          how: ['Voltage gain in dB is $$\\text{dB} = 20\\log_{10}A$$',
            'Undo it: divide by 20, then raise 10 to that power. $$A = 10^{34/20} = 10^{1.7} = 50.1$$'],
          why: 'Sanity check: every 20 dB is ×10 and 6 dB is ×2, so 34 dB = 40 − 6 dB ≈ 100 ÷ 2 = 50.',
          calc: [{ what: 'dB to a ratio', keys: '10 [^] ( 34 ÷ 20 ) [EXE]', shows: '50.1187' }] }, say: '$10^{34/20} = 50.1$.' },
      { t: 19, title: 'The **CMRR** spec converts the same way: 74 dB → $10^{74/20}$.', tex: '\\text{CMRR} = 10^{74/20} = 5012', say: '$10^{74/20} ≈ 5012$.' },
      { t: 24, ans: true, title: `**Answers:** $g_m \\ge 0.157$ mS · gain ≥ 50.1 · CMRR ≥ 5012`, say: 'GBW gives $g_m$ directly — no $R_{out}$ needed, because it cancels.' },
    ],
  });
}, { q: 'Lab 7' });

function capAmpFig(S) {
  const g = S.g(); const r = S.into(g);
  amp(S, 420, 400, { w: 130, h: 130, label: 'OTA' });
  wire(S, [[300, 368], [420, 368]]); txt(S, 292, 375, 'V_in', { size: 21, color: C.muted, anchor: 'end' });
  wire(S, [[550, 400], [700, 400]]); dot(S, 640, 400); txt(S, 708, 407, 'V_out', { size: 22, color: C.volt, weight: 700 });
  wire(S, [[640, 400], [640, 560]]);
  S.el('line', { x1: 610, y1: 560, x2: 670, y2: 560, stroke: C.wire, 'stroke-width': 3.2 }); S.el('line', { x1: 610, y1: 572, x2: 670, y2: 572, stroke: C.wire, 'stroke-width': 3.2 });
  txt(S, 680, 570, 'C_F', { size: 20, color: C.muted }); wire(S, [[640, 572], [640, 620], [380, 620], [380, 432], [420, 432]]); dot(S, 500, 620);
  wire(S, [[500, 620], [500, 660]]); S.el('line', { x1: 470, y1: 660, x2: 530, y2: 660, stroke: C.wire, 'stroke-width': 3.2 }); S.el('line', { x1: 470, y1: 672, x2: 530, y2: 672, stroke: C.wire, 'stroke-width': 3.2 });
  txt(S, 540, 670, 'C_IN', { size: 20, color: C.muted }); wire(S, [[500, 672], [500, 700]]); gnd(S, 500, 700);
  r(); return g;
}
scene(LF, 'Lab 8: behavioural op amp, closed-loop gain and bandwidth', 62, (S) => {
  pyqFrame(S, {
    tag: 'FROM ZERO · QUESTION 4 OF 4', title: 'A model op amp in a capacitive feedback loop', src: 'Lab 8 (hand calculations)',
    q: 'Behavioural OTA: $G_M = 159\\,\\mu$S, DC gain 58.75, $f_u = 5$ MHz. Non-inverting with $C_F = C_{IN} = 4$ pF (ideal gain $1 + C_{IN}/C_F$). Find $C_{OUT}$, $R_{OUT}$, β, the closed-loop DC gain and bandwidth.', qh: 240,
    tests: 'everything in this chapter at once: $f_u = G_M/(2\\pi C)$, $A_0 = G_MR$, β, $A/(1+\\beta A)$ and the pole × $(1+\\beta A_0)$.',
    fig: (S2) => { const g = capAmpFig(S2); g.setAttribute('transform', 'translate(-40 0)'); },
    steps: [
      { t: 6, title: 'The model is $G_M$ driving $R_{OUT}\\parallel C_{OUT}$: one pole, so **GBW = $G_M/(2\\pi C_{OUT})$**. Solve it for $C_{OUT}$.', tex: 'C_{OUT} = \\frac{G_M}{2\\pi f_u} = \\frac{159\\,\\mu\\mathrm{S}}{2\\pi(5\\,\\mathrm{MHz})} = 5.06\\,\\mathrm{pF}',
        try: { q: '(a) What output capacitance $C_{OUT}$ gives the stated $f_u$?', answer: ans('bank-lab8', 'cout'), unit: 'F', tol: 0.02,
          hint: ['A one-pole OTA model has its GBW set by its transconductance and its output capacitor.', '$f_u = \\dfrac{G_M}{2\\pi C_{OUT}} \\;\\Rightarrow\\; C_{OUT} = \\dfrac{G_M}{2\\pi f_u}$'],
          how: ['For a one-pole OTA the gain-bandwidth is $$f_u = \\frac{G_M}{2\\pi C_{OUT}}$$',
            'Rearrange for the capacitor. $$C_{OUT} = \\frac{G_M}{2\\pi f_u}$$',
            'Substitute 159 µS and 5 MHz. $$C_{OUT} = \\frac{159\\times10^{-6}}{2\\pi\\times5\\times10^{6}} = 5.06\\times10^{-12}\\,\\mathrm{F} = 5.06\\,\\mathrm{pF}$$'] }, say: 'From GBW: $C_{OUT} = G_M/(2\\pi f_u) = 5.06$ pF.' },
      { t: 13, title: 'At DC $C_{OUT}$ is open, so **$A_0 = G_MR_{OUT}$** and $R_{OUT} = A_0/G_M$.', tex: 'R_{OUT} = \\frac{A_0}{G_M} = \\frac{58.75}{159\\,\\mu\\mathrm{S}} = 369\\,\\mathrm{k\\Omega}',
        try: { q: '(b) What output resistance $R_{OUT}$ gives the DC gain of 58.75?', answer: ans('bank-lab8', 'rout'), unit: 'Ω', tol: 0.02,
          hint: ['At DC the capacitor is open: the gain is the transconductance times the output resistance.', '$A_0 = G_MR_{OUT} \\;\\Rightarrow\\; R_{OUT} = A_0/G_M$'],
          how: ['At DC $C_{OUT}$ is open, so all of $G_Mv_{in}$ flows through $R_{OUT}$. $$A_0 = G_M R_{OUT}$$',
            'Rearrange and substitute. $$R_{OUT} = \\frac{A_0}{G_M} = \\frac{58.75}{159\\times10^{-6}\\,\\mathrm{S}} = 369\\,\\mathrm{k\\Omega}$$'] }, say: 'From the DC gain: $R_{OUT} = 58.75/159\\,\\mu$S = 369 kΩ.' },
      { t: 20, title: '$C_F$ (to the output) and $C_{IN}$ (to ground) form a **capacitive divider**: β = $C_F/(C_F + C_{IN})$.', tex: '\\beta = \\frac{C_F}{C_F + C_{IN}} = \\frac{4\\,\\mathrm{pF}}{4\\,\\mathrm{pF} + 4\\,\\mathrm{pF}} = 0.5',
        try: { q: '(c) What is the feedback factor β?', answer: ans('bank-lab8', 'beta'), unit: '', tol: 0.01,
          hint: ['β is the fraction of $V_{out}$ that reaches the inverting input. $C_F$ and $C_{IN}$ form a divider, like $R_1$ and $R_2$.', 'Impedances are $1/(sC)$, so $\\beta = \\dfrac{C_F}{C_F + C_{IN}}$ (the capacitor to the output is on top).'],
          how: ['The feedback node sees $C_F$ up to $V_{out}$ and $C_{IN}$ down to ground: a divider with impedances $1/(sC)$. $$\\beta = \\frac{1/(sC_{IN})}{1/(sC_F) + 1/(sC_{IN})} = \\frac{C_F}{C_F + C_{IN}}$$',
            'Substitute. $$\\beta = \\frac{4\\,\\mathrm{pF}}{4\\,\\mathrm{pF} + 4\\,\\mathrm{pF}} = 0.5$$',
            'Check: the ideal gain is $1/\\beta = 2$, which matches $1 + C_{IN}/C_F = 2$.'],
          why: 'With capacitors the divider is “upside down”: C_F on top, because a bigger C is a smaller impedance.' }, say: 'A capacitive divider works like a resistive one: β = 4/(4+4) = 0.5.' },
      { t: 27, title: 'The **closed-loop DC gain is $A_0/(1 + \\beta A_0)$**: a little under the ideal 2 because $A_0$ is small.', tex: 'A_{CL} = \\frac{A_0}{1 + \\beta A_0} = \\frac{58.75}{1 + 29.375} = 1.934',
        try: { parts: [{ q: 'First: the loop gain $\\beta A_0$ (β from part c)?', answer: 0.5 * 58.75, unit: '', tol: 0.02, hint: ['Multiply β = 0.5 by $A_0$ = 58.75.'], how: ['$$\\beta A_0 = 0.5\\times58.75 = 29.375$$'] }],
          q: '(d) What is the actual closed-loop DC gain with the finite $A_0$ = 58.75?', answer: ans('bank-lab8', 'acl'), unit: '', tol: 0.01,
          hint: ['Use the feedback formula from Lec 1, with β from part (c).', '$A_{CL} = \\dfrac{A_0}{1 + \\beta A_0}$'],
          how: ['Loop gain first, with β = 0.5 from part (c). $$\\beta A_0 = 0.5\\times58.75 = 29.375$$',
            'Closed-loop gain. $$A_{CL} = \\frac{A_0}{1 + \\beta A_0} = \\frac{58.75}{30.375} = 1.934$$',
            'It falls short of the ideal $1/\\beta = 2$ by the gain error $1/(1 + \\beta A_0) = 3.3$ %.'] }, say: '$58.75/30.375 = 1.934$ — the ideal 2 is missed by the gain error $1/(1+\\beta A)$ (Lec 1).' },
      { t: 34, title: 'Open-loop pole first, **$f_0 = f_u/A_0$**; then **feedback multiplies it by $1 + \\beta A_0$**.', tex: 'f_0 = \\frac{f_u}{A_0} = \\frac{5\\,\\mathrm{MHz}}{58.75} = 85.1\\,\\mathrm{kHz},\\; f_{-3dB} = f_0(1 + \\beta A_0) = 85.1\\,\\mathrm{kHz}\\times30.375 = 2.59\\,\\mathrm{MHz}',
        try: { parts: [{ q: 'First: the open-loop pole $f_0$ of the OTA?', answer: 5e6 / 58.75, unit: 'Hz', tol: 0.02, hint: ['GBW divided by the DC gain: $f_0 = f_u/A_0$.'], how: ['$$f_0 = \\frac{f_u}{A_0} = \\frac{5\\,\\mathrm{MHz}}{58.75} = 85.1\\,\\mathrm{kHz}$$'] }],
          q: '(e) What is the closed-loop −3 dB bandwidth?', answer: ans('bank-lab8', 'bw'), unit: 'Hz', tol: 0.02,
          hint: ['Find the open-loop pole (GBW divided by the DC gain). Feedback then moves it up by the same factor it took off the gain.', '$f_0 = \\dfrac{f_u}{A_0},\\; f_{-3dB} = f_0\\,(1 + \\beta A_0)$'],
          how: ['Open-loop pole: GBW divided by DC gain. $$f_0 = \\frac{f_u}{A_0} = \\frac{5\\,\\mathrm{MHz}}{58.75} = 85.1\\,\\mathrm{kHz}$$',
            'Feedback multiplies the pole by $1 + \\beta A_0$ = 30.375 (from part d). $$f_{-3dB} = f_0(1 + \\beta A_0) = 85.1\\,\\mathrm{kHz}\\times30.375 = 2.59\\,\\mathrm{MHz}$$',
            'Check: about $\\beta f_u = 0.5\\times5$ MHz = 2.5 MHz.'],
          calc: [{ what: 'pole × (1 + βA₀) in one line', keys: '5M ÷ 58.75 × ( 1 + 0.5 × 58.75 ) [EXE]', shows: '2.5851M', note: PFX }] }, say: 'Open-loop pole 85 kHz, multiplied by 30.4: 2.59 MHz (close to $\\beta f_u = 2.5$ MHz).' },
      { t: 41, ans: true, title: `**Answers:** $C_{OUT} = 5.06$ pF · $R_{OUT} = 369$ kΩ · β = 0.5 · $A_{CL} = 1.934$ · BW = 2.59 MHz`, say: 'Notice the order: two specs fix the model (C from GBW, R from gain), then β, then the two feedback rules.' },
    ],
  });
}, { q: 'Lab 8' });
