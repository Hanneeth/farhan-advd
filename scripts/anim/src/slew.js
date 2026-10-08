/* Slew rate from zero (before Lec 13): a capacitor fills at I/C, an amplifier's current has a ceiling, and a ladder of easy questions. */
'use strict';
const LS = 'Slew rate from zero';

scene(LS, 'A capacitor fills at a fixed speed: I/C', 70, (S) => {
  header(S, 'SLEW RATE · STEP 1', 'A fixed current fills a capacitor in a straight line: slope = I/C');
  const WATER = '#38bdf8';
  // tank = capacitor, tap = current source
  const tk = S.g(); const rt = S.into(tk);
  wire(S, [[150, 220], [330, 220]], { w: 10, color: '#475569' }); txt(S, 150, 200, 'current I (a fixed flow)', { size: 19, color: C.cur, weight: 700 });
  wire(S, [[330, 220], [330, 280]], { w: 10, color: '#475569' });
  S.el('rect', { x: 230, y: 300, width: 200, height: 420, fill: 'none', stroke: '#94a3b8', 'stroke-width': 3, rx: 6 });
  txt(S, 330, 760, 'the capacitor', { size: 19, color: C.muted, anchor: 'middle' });
  rt(); S.draw(tk, 0.3, 1.2);
  const lvl = S.el('rect', { x: 232, width: 196, fill: WATER, 'fill-opacity': 0.5 });
  const wdt = S.el('rect', { x: 230, width: 0, height: 4, fill: '#fff' });
  const strm = S.el('line', { x1: 330, x2: 330, y1: 280, stroke: WATER, 'stroke-linecap': 'round', 'stroke-dasharray': '10 8' });
  const vt = txt(S, 450, 0, '', { size: 21, color: C.volt, weight: 800, mono: true });
  // plot
  const X0 = 620, Y0 = 760, W = 880, H = 500;
  const ax = axes(S, X0, Y0, W, H, { x: 'time (µs)', y: 'voltage (V)' }); ax.style.opacity = 0; S.fade(ax, 1, 0.5);
  [1, 2, 3, 4].forEach((v) => { const y = Y0 - v * 110; S.el('line', { x1: X0, x2: X0 + W, y1: y, y2: y, stroke: '#1d2633' }); txt(S, X0 - 10, y + 6, String(v), { size: 16, color: C.muted, anchor: 'end' }); });
  [0.1, 0.2, 0.3].forEach((tt) => { const x = X0 + tt * 2000; txt(S, x, Y0 + 26, String(tt), { size: 16, color: C.muted, anchor: 'middle' }); });
  const ln = liveLine(S, C.cur, 4), ln0 = S.el('polyline', { fill: 'none', stroke: C.dim, 'stroke-width': 2.4, 'stroke-dasharray': '7 6' });
  const rd = [txt(S, X0 + 470, 330, '', { size: 23, color: C.cur, mono: true, weight: 800 }), txt(S, X0 + 470, 366, '', { size: 23, color: C.p, mono: true, weight: 800 }), txt(S, X0 + 470, 410, '', { size: 28, color: C.amb, mono: true, weight: 800 })];
  [lvl, strm, vt, ln, ln0, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 4, 0.5); });
  // phases: I = 100 µA, C = 5 pF (20 V/µs) → I doubled (40) → C doubled back (20)
  const ph = (t) => (t < 22 ? { I: 100, C: 5, t0: 6 } : t < 36 ? { I: 200, C: 5, t0: 22 } : { I: 100, C: 10, t0: 36 });
  S.anim(0, 1e4, 'fill', (_p, t) => {
    const P = ph(t), sr = P.I / P.C, tt = clamp((t - P.t0) / 12, 0, 1) * 0.2, v = Math.min(4, sr * tt);
    const hpx = (v / 4) * 400, bw = 160 + 40 * (P.C / 5); // the level is the voltage; a bigger C is a wider bucket
    lvl.setAttribute('y', 718 - Math.min(hpx, 416)); lvl.setAttribute('height', Math.min(hpx, 416));
    tk.querySelector('rect').setAttribute('width', bw); lvl.setAttribute('width', bw - 4);
    strm.setAttribute('y2', 718 - Math.min(hpx, 416)); strm.setAttribute('stroke-width', 3 + P.I / 25); strm.style.strokeDashoffset = -t * 60;
    vt.setAttribute('y', 718 - Math.min(hpx, 416) + 7); vt.setAttribute('x', 230 + bw + 14); vt.textContent = `${fx(v, 3)} V`;
    ln.setAttribute('points', `${X0},${Y0} ${X0 + tt * 2000},${Y0 - v * 110}`);
    ln0.setAttribute('points', t >= 22 ? `${X0},${Y0} ${X0 + 0.2 * 2000},${Y0 - 4 * 110}` : '');
    rd[0].textContent = `I = ${P.I} µA`; rd[1].textContent = `C = ${P.C} pF`; rd[2].textContent = `slope = I/C = ${fx(sr, 3)} V/µs`;
  }, E.lin);
  S.say(0.3, 'Slew rate starts with one picture: a capacitor is a bucket. Current is water flowing in, the voltage is the water level, and the capacitance is how wide the bucket is.');
  S.say(6, 'Pour in a <b>fixed</b> current, 100 microamps into 5 picofarads. The level rises in a perfectly straight line: every microsecond it gains the same amount, 20 volts.');
  S.say(14, 'That is $i = C\\,dv/dt$ read backwards: $dv/dt = I/C$. A fixed current gives a straight ramp, with slope $I/C$.');
  S.say(22, 'Double the current: twice as fast, 40 volts per microsecond.');
  S.say(36, 'Go back to 100 microamps but make the bucket twice as wide, 10 picofarads: half as fast, 10 volts per microsecond.');
  eqAt(S, '\\frac{dV}{dt} = \\frac{I}{C},\\qquad \\frac{\\mu\\mathrm{A}}{\\mathrm{pF}} = \\frac{\\mathrm{V}}{\\mu\\mathrm{s}}', 1060, 180, 48, { size: 34, w: 800, color: '#ffd38a' });
  S.say(48, 'The unit trick that saves time in every question: microamps divided by picofarads comes out directly in volts per microsecond. 100 over 5 is 20 volts per microsecond, no powers of ten needed.');
});

scene(LS, 'Why an amplifier has a top speed', 84, (S) => {
  header(S, 'SLEW RATE · STEP 2', 'Its output current has a ceiling, so its output voltage has a top speed');
  // the pair as two taps sharing one fixed supply I_SS
  const g = S.g(); const r = S.into(g);
  txt(S, 280, 175, 'tail current I_SS = 40 µA (fixed total)', { size: 20, color: C.cur, weight: 700, anchor: 'middle' });
  S.el('rect', { x: 120, y: 200, width: 320, height: 44, rx: 8, fill: 'rgba(251,146,60,0.12)', stroke: C.cur, 'stroke-width': 2 });
  txt(S, 175, 300, 'M1 side', { size: 18, color: C.n, weight: 700, anchor: 'middle' }); txt(S, 385, 300, 'M2 side', { size: 18, color: C.p, weight: 700, anchor: 'middle' });
  S.el('rect', { x: 140, y: 320, width: 70, height: 300, rx: 6, fill: 'none', stroke: '#33425a', 'stroke-width': 2 });
  S.el('rect', { x: 350, y: 320, width: 70, height: 300, rx: 6, fill: 'none', stroke: '#33425a', 'stroke-width': 2 });
  txt(S, 280, 690, 'into C_L = difference of the two', { size: 19, color: C.amb, weight: 700, anchor: 'middle' });
  r(); S.draw(g, 0.3, 1.2);
  const b1 = S.el('rect', { x: 142, width: 66, rx: 4, fill: C.n, 'fill-opacity': 0.75 }), b2 = S.el('rect', { x: 352, width: 66, rx: 4, fill: C.p, 'fill-opacity': 0.75 });
  const t1 = txt(S, 175, 650, '', { size: 18, color: C.n, mono: true, weight: 700, anchor: 'middle' }), t2 = txt(S, 385, 650, '', { size: 18, color: C.p, mono: true, weight: 700, anchor: 'middle' });
  const outA = dynArrow(S, C.amb, 6), outT = txt(S, 280, 760, '', { size: 22, color: C.amb, mono: true, weight: 800, anchor: 'middle' });
  const stT = txt(S, 280, 800, '', { size: 21, mono: true, weight: 800, anchor: 'middle' });
  // output plot: requested (dashed) vs actual (solid)
  const X0 = 620, Y0 = 760, W = 880, H = 520;
  const ax = axes(S, X0, Y0, W, H, { x: 'time', y: 'output' });
  const req = S.el('polyline', { fill: 'none', stroke: C.dim, 'stroke-width': 2.6, 'stroke-dasharray': '7 6' }), act = liveLine(S, C.volt, 4);
  const rd = [txt(S, X0 + 420, 590, '', { size: 21, color: C.text, mono: true, weight: 700 }), txt(S, X0 + 420, 624, '', { size: 21, color: C.muted, mono: true }), txt(S, X0 + 420, 658, '', { size: 21, color: C.amb, mono: true, weight: 800 })];
  [b1, b2, t1, t2, outA, outT, stT, ax, req, act, ...rd].forEach((e) => { e.style.opacity = 0; S.fade(e, 6, 0.6); });
  const ISS = 40, CL = 2, SR = ISS / CL, tau = 0.02; // µA, pF, V/µs, µs
  const V0At = (t) => (t < 16 ? 0.1 : t < 30 ? lerp(0.1, 0.4, E.inout((t - 16) / 14)) : t < 44 ? lerp(0.4, 1.0, E.inout((t - 30) / 14)) : 1.0);
  S.anim(0, 1e4, 'sat', (_p, t) => {
    const V0 = V0At(t), want = V0 / tau, slews = want > SR;
    // current split at the start of the step (wanted output current = C·dv/dt, capped at ISS)
    const iout = Math.min(want * CL, ISS), i1 = ISS / 2 + iout / 2, i2 = ISS - i1;
    const h1 = (i1 / ISS) * 296, h2 = (i2 / ISS) * 296;
    b1.setAttribute('y', 618 - h1); b1.setAttribute('height', h1); b2.setAttribute('y', 618 - h2); b2.setAttribute('height', Math.max(h2, 0.01));
    t1.textContent = `${fx(i1, 3)} µA`; t2.textContent = `${i2 > 0.05 ? fx(i2, 3) : 0} µA`;
    outA.set(280, 706, 280, 714 + 26 * (iout / ISS), 12);
    outT.textContent = `Iout = ${fx(iout, 3)} µA`;
    stT.textContent = slews ? 'one side OFF: current capped → SLEWING' : 'both sides on: linear'; stT.setAttribute('fill', slews ? C.bad : C.ok);
    // waveforms in µs, x scale 0..0.12 µs
    const xs = (u) => X0 + (u / 0.12) * W, ys = (v) => Y0 - (v / 1.1) * 460;
    req.setAttribute('points', ptsOf(160, 0, 0.12, (u) => [xs(u), ys(V0 * (1 - Math.exp(-u / tau)))]));
    const tsl = slews ? (V0 - SR * tau) / SR : 0;
    act.setAttribute('points', ptsOf(200, 0, 0.12, (u) => [xs(u), ys(u < tsl ? SR * u : V0 - SR * tau * Math.exp(-(u - tsl) / tau) * (slews ? 1 : 0) - (slews ? 0 : V0 * Math.exp(-u / tau)))]));
    rd[0].textContent = `step V0 = ${fx(V0, 2)} V`; rd[1].textContent = `wanted start slope V0/τ = ${fx(want, 3)} V/µs`; rd[2].textContent = `top speed ISS/CL = ${SR} V/µs`;
  }, E.lin);
  S.say(0.3, 'Now an amplifier. The 5-transistor OTA’s input pair shares one fixed tail current, 40 microamps, between its two sides. The output capacitor gets the difference between the two sides.');
  S.say(6, 'A small input step tilts the split a little: one side gets a bit more, the other a bit less, and the difference charges $C_L$. The output follows the smooth exponential it is asked for, the dashed curve.');
  S.say(16, 'A bigger step asks for a steeper start, so a bigger current. The split tilts further.');
  S.say(30, 'Keep going and one side runs empty: it switches off, and the other side carries all of $I_{SS}$. That is the most current the pair can ever give.');
  S.say(42, 'Now the output can only rise as fast as $I_{SS}$ fills $C_L$: a straight ramp at $I_{SS}/C_L$, 20 volts per microsecond, instead of the steep start it wanted. That straight part is <b>slewing</b>, and $I_{SS}/C_L$ is the <b>slew rate</b>.');
  whyBox(S, 620, 120, 880, 110, '**Slewing = the amplifier is asked for more current than it has.** Check: does the wanted start slope $V_0/\\tau$ beat the slew rate?', 56);
  S.say(56, 'So every slew question is one comparison: the start slope the step wants, $V_0/\\tau$, against the top speed, the maximum current over the capacitor. Bigger wanted slope: it slews. Once the remaining gap is small enough, it finishes with the normal exponential.');
});

scene(LS, 'Slew-rate ladder 1: six small steps', 70, (S) => {
  pyqFrame(S, {
    tag: 'SLEW RATE · PRACTICE LADDER (EASY → HARDER)', title: 'Build it up one step at a time', src: 'Slew-rate ladder (Lec 13)',
    q: 'A 5-T OTA: $I_{SS}$ = 40 µA, $C_L$ = 2 pF. In feedback its closed-loop time constant is τ = 10 ns and the output must step by $V_0$ = 1 V.', qh: 170,
    fig: eqFigAt([['\\frac{dV}{dt} = \\frac{I}{C}\\;\\;(\\mu\\mathrm{A}/\\mathrm{pF} = \\mathrm{V}/\\mu\\mathrm{s})', 260, 30, undefined, 4], ['SR = \\frac{I_{SS}}{C_L}', 360, 34, undefined, 16], ['\\text{slews if } \\frac{V_0}{\\tau} > SR', 460, 30, '#ffd38a', 23], ['t_{slew} = \\frac{V_0 - SR\\,\\tau}{SR}', 560, 30, '#ffd38a', 37]]),
    per: 3,
    steps: [
      { t: 4, title: '① A fixed current fills a capacitor in a straight line: **slope = I/C**, and µA/pF is already V/µs.', tex: '\\frac{dV}{dt} = \\frac{I}{C} = \\frac{10\\,\\mu\\mathrm{A}}{1\\,\\mathrm{pF}} = 10\\,\\mathrm{V/\\mu s}',
        try: { q: '① Warm-up: a fixed 10 µA flows into a 1 pF capacitor. How fast does its voltage rise?', answer: 10, unit: 'V/µs', tol: 0.01, secs: 30,
          hint: ['A fixed current gives a straight ramp. Read $i = C\\,dv/dt$ backwards.', '$\\dfrac{dV}{dt} = \\dfrac{I}{C}$, and µA ÷ pF comes out in V/µs'],
          how: ['From $i = C\\,dv/dt$, a fixed current gives a fixed slope. $$\\frac{dV}{dt} = \\frac{I}{C}$$',
            'µA divided by pF is V/µs, so no powers of ten are needed. $$\\frac{dV}{dt} = \\frac{10\\,\\mu\\mathrm{A}}{1\\,\\mathrm{pF}} = 10\\,\\mathrm{V/\\mu s}$$'] }, say: '10 volts per microsecond.' },
      { t: 10, title: '② On a straight ramp, **time = voltage to cover ÷ slope** (distance over speed).', tex: 't = \\frac{\\Delta V}{dV/dt} = \\frac{2\\,\\mathrm{V}}{10\\,\\mathrm{V/\\mu s}} = 0.2\\,\\mu\\mathrm{s}',
        try: { q: '② At the slope from ①, how long does the voltage take to climb 2 V?', answer: 0.2, unit: 'µs', tol: 0.01, secs: 30,
          hint: ['The voltage gains the same amount every microsecond: it is distance over speed.', '$t = \\dfrac{\\Delta V}{dV/dt}$'],
          how: ['On a straight ramp the time is the voltage to cover divided by the slope. $$t = \\frac{\\Delta V}{dV/dt}$$',
            'Use the 10 V/µs from ①. $$t = \\frac{2\\,\\mathrm{V}}{10\\,\\mathrm{V/\\mu s}} = 0.2\\,\\mu\\mathrm{s}$$'] }, say: 'Time is distance over speed: 0.2 microseconds.' },
      { t: 16, title: '③ When the OTA slews, the **whole tail current $I_{SS}$ goes into $C_L$**: that is its top speed, the slew rate.', tex: 'SR = \\frac{I_{SS}}{C_L} = \\frac{40\\,\\mu\\mathrm{A}}{2\\,\\mathrm{pF}} = 20\\,\\mathrm{V/\\mu s}',
        try: { q: '③ Now the OTA on the card. What is its slew rate?', answer: 20, unit: 'V/µs', tol: 0.01, secs: 45,
          hint: ['When it slews, one side of the input pair is off and the most current the OTA can give flows into the load capacitor.', '$SR = \\dfrac{I_{SS}}{C_L}$'],
          how: ['During slewing the 5-T OTA gives all of its tail current, and it all goes into $C_L$. $$SR = \\frac{I_{SS}}{C_L}$$',
            'Substitute (µA/pF = V/µs). $$SR = \\frac{40\\,\\mu\\mathrm{A}}{2\\,\\mathrm{pF}} = 20\\,\\mathrm{V/\\mu s}$$'] }, say: 'All of $I_{SS}$ into $C_L$: 20 volts per microsecond.' },
      { t: 23, title: '④ A linear step response starts with **slope $V_0/\\tau$**. If that beats SR, the OTA cannot keep up: **it slews**.', tex: '\\frac{V_0}{\\tau} = \\frac{1\\,\\mathrm{V}}{10\\,\\mathrm{ns}} = 100\\,\\mathrm{V/\\mu s} > 20\\,\\mathrm{V/\\mu s} \\Rightarrow \\text{slews}',
        try: { parts: [{ q: 'First: what start slope $V_0/\\tau$ does the 1 V step ask for?', answer: 1 / 10e-3, unit: 'V/µs', tol: 0.02, hint: ['τ = 10 ns = 0.01 µs.'], how: ['$$\\frac{V_0}{\\tau} = \\frac{1\\,\\mathrm{V}}{0.01\\,\\mu\\mathrm{s}} = 100\\,\\mathrm{V/\\mu s}$$'] }],
          q: '④ The output must step by $V_0$ = 1 V and the loop has τ = 10 ns. Does the OTA slew?', choices: ['Yes, it slews', 'No, it stays linear'], answer: 0, secs: 45,
          hint: ['A linear response $V_0(1 - e^{-t/\\tau})$ starts with slope $V_0/\\tau$. Can the OTA move that fast?', 'It slews if $\\dfrac{V_0}{\\tau} > SR$'],
          how: ['The linear response starts with slope $$\\frac{V_0}{\\tau} = \\frac{1\\,\\mathrm{V}}{10\\,\\mathrm{ns}} = 0.1\\,\\mathrm{V/ns} = 100\\,\\mathrm{V/\\mu s}$$',
            'The OTA can only manage SR = 20 V/µs (from ③). $$100\\,\\mathrm{V/\\mu s} > 20\\,\\mathrm{V/\\mu s}$$',
            'It is asked for more current than it has, so it slews. “1 V is a small step” is the trap: what matters is the slope $V_0/\\tau$, not the size alone.'] }, say: 'It wants 100 volts per microsecond and can do 20: it slews.' },
      { t: 30, title: '⑤ At the edge the wanted slope equals SR: $V_0/\\tau = SR$, so the **largest linear step is $SR\\cdot\\tau$**.', tex: 'V_{0,max} = SR\\cdot\\tau = 20\\,\\mathrm{V/\\mu s}\\times 10\\,\\mathrm{ns} = 0.2\\,\\mathrm{V}',
        try: { q: '⑤ What is the largest step $V_0$ that does NOT slew?', answer: 0.2, unit: 'V', tol: 0.01, secs: 60,
          hint: ['At the edge, the start slope the step wants is exactly the slew rate.', '$\\dfrac{V_{0,max}}{\\tau} = SR \\;\\Rightarrow\\; V_{0,max} = SR\\cdot\\tau$'],
          how: ['It stays linear as long as $$\\frac{V_0}{\\tau} \\le SR$$',
            'At the edge, solve for $V_0$. $$V_{0,max} = SR\\cdot\\tau$$',
            'Substitute SR = 20 V/µs (from ③) and τ = 10 ns = 0.01 µs. $$V_{0,max} = 20\\,\\mathrm{V/\\mu s}\\times0.01\\,\\mu\\mathrm{s} = 0.2\\,\\mathrm{V}$$'] }, say: 'Set the wanted slope equal to the slew rate: 0.2 volts. Anything bigger slews.' },
      { t: 37, title: '⑥ The output **ramps at SR until the gap left is $SR\\cdot\\tau$**, then finishes with the normal exponential.', tex: 't_{slew} = \\frac{V_0 - SR\\,\\tau}{SR} = \\frac{1 - 0.2}{20\\,\\mathrm{V/\\mu s}} = 40\\,\\mathrm{ns}',
        try: { parts: [{ q: 'First: how many volts does the output ramp before it can finish linearly?', answer: 1 - 0.2, unit: 'V', tol: 0.02, hint: ['It ramps until the gap left is $SR\\cdot\\tau$ = 0.2 V (your answer to ⑤).'], how: ['$$V_0 - SR\\cdot\\tau = 1 - 0.2 = 0.8\\,\\mathrm{V}$$'] }],
          q: '⑥ For the 1 V step, how long does the output slew?', answer: 40, unit: 'ns', tol: 0.02, secs: 75,
          hint: ['It ramps at SR until the gap left to the final value is small enough to finish linearly. That gap is your answer to ⑤.', '$t_{slew} = \\dfrac{V_0 - SR\\,\\tau}{SR}$'],
          how: ['Slewing ends when the gap left, $V_0 - V_{out}$, needs a start slope of exactly SR, i.e. when the gap is $SR\\cdot\\tau$ (from ⑤). $$SR\\cdot\\tau = 0.2\\,\\mathrm{V}$$',
            'So the ramp covers $$1\\,\\mathrm{V} - 0.2\\,\\mathrm{V} = 0.8\\,\\mathrm{V}$$',
            'At 20 V/µs that takes $$t_{slew} = \\frac{0.8\\,\\mathrm{V}}{20\\,\\mathrm{V/\\mu s}} = 0.04\\,\\mu\\mathrm{s} = 40\\,\\mathrm{ns}$$'],
          why: 'Slewing time = (the whole step − SR·τ) ÷ SR.' }, say: 'It ramps until the remaining gap is small enough to finish linearly, 0.2 volts. So it ramps 0.8 volts at 20 volts per microsecond: 40 nanoseconds.' },
      { t: 45, ans: true, title: '**Ladder 1:** 10 V/µs · 0.2 µs · 20 V/µs · slews · 0.2 V · 40 ns', say: 'Six steps, one idea. The tutorial questions after Lecture 13 are exactly these steps with real circuits around them.' },
    ],
  });
}, { q: 'Slew-rate ladder 1' });
