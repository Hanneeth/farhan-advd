/* Lecture 13: step response, the closed-loop time constant, small vs large step, slewing. */
'use strict';
const L13 = 'Lec 13 · Settling & slewing';

/* the page's model: amplifier A with R_out, divider R1/R2, load C_L */
function ampModel(S) {
  const g = S.g(); const r = S.into(g);
  wire(S, [[200, 382], [300, 382]]); txt(S, 192, 389, 'V_in', { size: 21, color: C.muted, anchor: 'end' });
  amp(S, 300, 410, { w: 130, h: 130, label: 'A' });
  resh(S, 430, 560, 410, { label: 'R_out', lcol: C.n });
  wire(S, [[560, 410], [820, 410]]); dot(S, 640, 410); dot(S, 760, 410); txt(S, 828, 417, 'V_out', { size: 22, color: C.volt, weight: 700 });
  res(S, 640, 410, 520, { label: 'R_1' }); dot(S, 640, 540); res(S, 640, 540, 650, { label: 'R_2' }); gnd(S, 640, 650);
  wire(S, [[640, 520], [640, 540]]);
  cap(S, 760, 410, { label: 'C_L' });
  wire(S, [[640, 540], [260, 540], [260, 442], [300, 442]]);
  S.el('rect', { x: 280, y: 320, width: 300, height: 180, rx: 12, fill: 'none', stroke: C.dim, 'stroke-width': 1.6, 'stroke-dasharray': '6 6' });
  txt(S, 430, 312, 'the op amp', { size: 17, color: C.muted, anchor: 'middle' });
  r(); return g;
}
/* 5-T OTA in the page's non-inverting loop */
function otaLoop(S, o = {}) {
  const g = S.g(); const r = S.into(g);
  rail(S, 260, 720, 170);
  const m3 = pmos(S, 340, 230, { name: 'M3', right: true, gl: 26, nameSide: 'l' }); const m4 = pmos(S, 560, 230, { name: 'M4', gl: 26 });
  wire(S, [[340, 170], [340, 180]]); wire(S, [[560, 170], [560, 180]]);
  wire(S, [[m3.gate[0], 230], [m4.gate[0], 230]]); wire(S, [[340, 280], [340, 380]]); dot(S, 340, 300); wire(S, [[340, 300], [400, 300], [400, 230]]); dot(S, 400, 230);
  wire(S, [[560, 280], [560, 380]]); dot(S, 560, 320); wire(S, [[560, 320], [800, 320]]); txt(S, 808, 327, 'V_out', { size: 22, color: C.volt, weight: 700 });
  nmos(S, 340, 430, { name: 'M1', gate: 'V_in' }); const m2 = nmos(S, 560, 430, { name: 'M2', right: true, gl: 40 });
  wire(S, [[340, 480], [340, 500], [560, 500], [560, 480]]); isrc(S, 450, 545, { label: 'I_SS', len: 45 }); gnd(S, 450, 590);
  dot(S, 680, 320); res(S, 680, 320, 430, { label: 'R_1' }); dot(S, 680, 450); res(S, 680, 450, 560, { label: 'R_2' }); gnd(S, 680, 560); wire(S, [[680, 430], [680, 450]]);
  wire(S, [[m2.gate[0], 430], [640, 430], [640, 450], [680, 450]]); txt(S, 650, 474, 'X', { size: 19, color: C.bad, weight: 750 });
  dot(S, 760, 320); cap(S, 760, 320, { label: 'C_L' });
  r(); return g;
}

scene(L13, 'Your page: the RC step response by Laplace', 70, (S) => {
  header(S, 'LEC 13 · YOUR PAGE, TOP', 'Step in, exponential out — the derivation on your page');
  S.say(0.3, 'Lecture 13 opens with the RC circuit you just met, solved the way your page does it: with the Laplace transform. You only need two table entries.');
  const tb = html(S, 60, 130, 560, 250, `<table class="tbl"><tr><th>in time</th><th>in s</th></tr><tr><td>a step of size $V_0$</td><td>${rt('$V_0/s$')}</td></tr><tr><td>${rt('$e^{-at}$')}</td><td>${rt('$1/(s + a)$')}</td></tr><tr><td>a capacitor</td><td>${rt('impedance $1/(sC)$')}</td></tr></table>`.replace(/\$([^$]+)\$/g, (m) => rt(m)));
  tb.style.opacity = 0; S.slideIn(tb, 2, 0.8);
  S.say(2, 'Laplace turns calculus into algebra: a step of size $V_0$ becomes $V_0/s$; $e^{-at}$ becomes $1/(s+a)$; a capacitor behaves like a resistance $1/(sC)$.');
  const lines = [
    ['\\frac{V_{out}}{V_{in}}(s) = \\frac{1/sC}{1/sC + R} = \\frac{1}{1 + s\\tau}', 9, 'The circuit is a divider: $C$ (as $1/sC$) under $R$. Simplify: $1/(1 + sRC) = 1/(1 + s\\tau)$.'],
    ['V_{out}(s) = \\frac{1}{1+s\\tau}\\cdot\\frac{V_0}{s} = V_0\\left(\\frac{1}{s} - \\frac{\\tau}{1+s\\tau}\\right)', 16, 'Multiply by the step $V_0/s$ and split into two simple fractions (partial fractions: $A = 1$, $B = -\\tau$ on your page).'],
    ['= V_0\\left(\\frac1s - \\frac{1}{s + 1/\\tau}\\right)\\;\\Rightarrow\\; V_{out}(t) = V_0\\left(1 - e^{-t/\\tau}\\right)', 24, 'Each piece is in the table: $1/s$ is the step, $1/(s+1/\\tau)$ is $e^{-t/\\tau}$. The exponential appears.'],
    ['\\frac{dV_{out}}{dt} = \\frac{V_0}{\\tau}e^{-t/\\tau}', 32, 'Differentiate: the slope starts at $V_0/\\tau$ and dies away. Your page calls this a <b>linear amplifier</b> response.'],
  ];
  lines.forEach(([tex, t, say], i) => { eqAt(S, tex, 1100, 190 + i * 115, t, { size: i === 2 ? 25 : 28, w: 860, color: i === 3 ? '#ffd38a' : C.text }); S.say(t, say); });
  const x0 = 120, y0 = 800;
  const ax = axes(S, x0, y0, 520, 330, { x: 't', y: 'V_out' }); S.fade(ax, 36, 0.6);
  [[1, C.volt], [0.66, C.ok], [0.33, C.cur]].forEach(([k, col], i) => tracePlot(S, (t) => k * (1 - Math.exp(-t)), (t) => x0 + t * 85, (v) => y0 - v * 290, 37 + i * 1.5, 42 + i * 1.5, col, 6));
  S.say(37, '<span class="why">“Linear” means:</span> double the step and the whole curve doubles — same shape, same τ, and a starting slope twice as steep. Your page sketches three such curves. Keep that last fact: it is what breaks when the op amp <b>slews</b>.');
});

scene(L13, 'The op amp in a loop: τ = R_out C_L / (1 + βA)', 84, (S) => {
  header(S, 'LEC 13 · YOUR PAGE, MIDDLE', 'Feedback divides the output time constant by (1 + βA)');
  const g = ampModel(S); g.setAttribute('transform', 'translate(-140 0)');
  S.draw(g, 0.3, 2);
  S.say(0.3, 'Your page’s model of a real op amp: an ideal gain $A$ followed by its output resistance $R_{out}$, driving the load $C_L$ and the feedback divider $R_1$, $R_2$.');
  S.say(6, 'The feedback factor is the divider ratio, $\\beta = R_2/(R_1+R_2)$, exactly as in Lecture 1.');
  const lines = [
    ['\\frac{\\left(V_{in} - \\beta V_{out}\\right)A - V_{out}}{R_{out}} = \\frac{V_{out}}{R_1+R_2} + V_{out}\\,sC_L', 10, 'KCL at the output (your page): the current through $R_{out}$ — the amplifier’s voltage minus $V_{out}$, over $R_{out}$ — feeds the divider and the capacitor.'],
    ['R_1 + R_2 \\gg R_{out}:\\quad AV_{in} = V_{out}\\left[1 + \\beta A + sC_LR_{out}\\right]', 18, 'The divider is megohms, $R_{out}$ is kilohms, so drop the divider’s current. Collect $V_{out}$.'],
    ['\\frac{V_{out}}{V_{in}} = \\frac{A}{1+\\beta A}\\cdot\\frac{1}{1 + \\frac{sC_LR_{out}}{1+\\beta A}}', 25, 'Factor out $(1 + \\beta A)$: a DC gain $A/(1+\\beta A)$ times a one-pole factor.'],
    ['\\tau = \\frac{R_{out}C_L}{1+\\beta A},\\qquad V_{out}(t) = V_0\\frac{A}{1+\\beta A}\\left(1 - e^{-t/\\tau}\\right)', 32, 'Read off the time constant: the open-loop $R_{out}C_L$, <b>divided by $(1 + \\beta A)$</b>. Feedback makes the output $(1+\\beta A)$ times faster.'],
  ];
  lines.forEach(([tex, t, say], i) => { eqAt(S, tex, 1130, 180 + i * 105, t, { size: i === 3 ? 26 : 26, w: 820, color: i === 3 ? '#ffd38a' : C.text }); S.say(t, say); });
  whyBox(S, 60, 680, 760, 160, 'Same answer as the foundations chapter: with $A = g_mR_{out}$, $\\frac{R_{out}C_L}{\\beta A} = \\frac{C_L}{\\beta g_m} = \\frac{1}{\\beta\\omega_u}$. Use whichever form the question’s data fits.', 42);
  S.say(42, 'Check it against the foundations: with $A = g_mR_{out}$ this is $C_L/(\\beta g_m) = 1/(\\beta\\omega_u)$. Two forms, one fact — Tutorial 6 uses the $R_{out}C_L/(1+\\beta A)$ form.');
  whyBox(S, 880, 640, 680, 190, '**Closed-loop gain** $A_{CL} = \\frac{A}{1+\\beta A} \\approx \\frac1\\beta$, **final value** $V_0A_{CL}$, **starting slope** $\\frac{V_0A_{CL}}{\\tau}$ — proportional to the step size.', 52);
  S.say(52, 'Three numbers every step question needs: the closed-loop gain, the final value $V_0A_{CL}$, and the starting slope $V_0A_{CL}/\\tau$. Note that the slope grows with the step.');
});

scene(L13, '5-T OTA, small step: why it is linear', 66, (S) => {
  header(S, 'LEC 13 · SMALL STEP', 'A small ΔV steers a little current; the output responds in proportion');
  const g = otaLoop(S); g.setAttribute('transform', 'translate(-120 40)');
  S.fade(g, 0.2, 0.8);
  S.say(0.2, 'Now the real circuit on your page: a 5-T OTA in the same non-inverting loop. $V_{in}$ is on M1’s gate; the divider brings $V_{out}$ back to M2’s gate (node X).');
  S.say(6, 'At rest both sides carry $I_{SS}/2$. Apply a <b>small</b> step $\\Delta V$ between the gates.');
  const lab = (x, y, s2, t, col) => label(S, x, y, s2, t, { size: 19, color: col || C.cur, weight: 700 });
  lab(20, 700, 'M1: I_SS/2 + g_mΔV/2', 10); lab(400, 700, 'M2: I_SS/2 − g_mΔV/2', 10);
  lab(20, 345, 'M3: +g_mΔV/2', 14); lab(520, 250, 'M4 copies: +g_mΔV/2', 14); // right of the M4 name, below V_DD
  S.flow([[220, 340], [220, 580]], 10, null, { speed: 80, w: 4.5 }); S.flow([[440, 340], [440, 580]], 10, null, { speed: 50, w: 2.4 });
  S.say(10, 'M1 takes $g_m\\Delta V/2$ more; M2 takes $g_m\\Delta V/2$ less (the tail keeps the total fixed).');
  S.say(14, 'The diode M3 and mirror M4 copy M1’s extra current to the output side. At the output: M4 pushes $g_m\\Delta V/2$ more in, M2 pulls $g_m\\Delta V/2$ less out.');
  eqAt(S, 'i_{out} = g_m\\,\\Delta V\\quad\\Rightarrow\\quad V_{out}(s) = g_m\\Delta V\\cdot\\frac{1}{sC_L}', 1140, 300, 20, { size: 30, w: 780 });
  S.say(20, 'Net: $g_m\\Delta V$ flows into the output node (your page writes $V_{out}(s) = g_m\\Delta V/(sC_L)$ for the capacitor alone).');
  whyBox(S, 820, 400, 740, 220, '**Linear:** the output current is **proportional** to ΔV. Bigger step → bigger current → steeper start. As $V_{out}$ rises, the feedback raises X, ΔV shrinks, the current shrinks — the exponential settle of the last scene, with $\\tau = 1/(\\beta\\omega_u)$.', 26);
  S.say(26, 'That proportionality is what “linear” means here. And as the output rises, X rises with it, ΔV shrinks, the current shrinks: the exponential approach with $\\tau = 1/(\\beta\\omega_u)$.');
  S.say(40, 'But $g_m\\Delta V$ cannot grow forever: the pair can never deliver more than its tail current $I_{SS}$. Next scene: what happens when the step is large.');
});

scene(L13, '5-T OTA, large step: slewing', 86, (S) => {
  header(S, 'LEC 13 · LARGE STEP', 'All of I_SS goes into C_L: the output ramps at I_SS / C_L');
  const g = otaLoop(S); g.setAttribute('transform', 'translate(-120 40)');
  S.fade(g, 0.2, 0.8);
  S.say(0.2, 'Same circuit, now a <b>large</b> step. Watch the current in M2 as ΔV grows.');
  // transfer curve
  const x0 = 960, y0 = 440, W2 = 560, H2 = 280;
  const ax = axes(S, x0, y0, W2, H2, { x: 'ΔV', y: 'output current' }); S.fade(ax, 3, 0.6);
  const vov = 0.2;
  const iout = (dv) => { const lim = Math.SQRT2 * vov; if (dv >= lim) return 1; return (dv / (2 * vov * vov)) * Math.sqrt(4 * vov * vov - dv * dv) / 1; };
  const Xd = (dv) => x0 + dv * 1000, Yd = (i) => y0 - i * 240;
  const cv = S.el('polyline', { points: ptsOf(120, 0, 0.5, (dv) => [Xd(dv), Yd(Math.min(1, iout(dv)))]), fill: 'none', stroke: C.cur, 'stroke-width': 3.4 });
  S.draw(cv, 4, 2.5);
  const lin = S.el('line', { x1: Xd(0), y1: Yd(0), x2: Xd(0.24), y2: Yd(0.24 / 0.2), stroke: C.dim, 'stroke-width': 2, 'stroke-dasharray': '6 5' }); S.fade(lin, 6, 0.5);
  const isl = S.el('line', { x1: x0, y1: Yd(1), x2: x0 + W2, y2: Yd(1), stroke: C.amb, 'stroke-width': 1.6, 'stroke-dasharray': '6 6' }); S.fade(isl, 8, 0.5);
  label(S, x0 + W2 - 4, Yd(1) - 10, 'I_SS (all of it)', 8, { size: 18, color: C.amb, anchor: 'end', weight: 700 });
  const vl = S.el('line', { x1: Xd(0.283), y1: y0, x2: Xd(0.283), y2: Yd(1), stroke: C.bad, 'stroke-width': 1.8, 'stroke-dasharray': '4 4' }); S.fade(vl, 12, 0.5);
  label(S, Xd(0.283), y0 + 30, '√2 V_ov: M2 off', 12, { size: 18, color: C.bad, anchor: 'middle', weight: 700 });
  S.say(4, 'For small ΔV the output current grows in proportion (dashed line, $g_m\\Delta V$). But it bends over…');
  S.say(8, '…because it can never exceed $I_{SS}$: once ΔV reaches $\\sqrt2V_{ov}$, M2 is fully <b>off</b> and M1 carries the whole tail current.');
  const off = S.g(); S.el('line', { x1: 410, y1: 440, x2: 470, y2: 500, stroke: C.bad, 'stroke-width': 5 }, off); S.el('line', { x1: 470, y1: 440, x2: 410, y2: 500, stroke: C.bad, 'stroke-width': 5 }, off);
  off.style.opacity = 0; S.fade(off, 16, 0.4);
  label(S, 470, 400, 'M2 off', 16, { size: 21, color: C.bad, weight: 800 });
  S.flow([[220, 340], [220, 580]], 16, null, { speed: 90, w: 6 });
  label(S, 80, 240, 'M3 carries I_SS', 18, { size: 19, color: C.cur, weight: 700 }); label(S, 520, 250, 'M4 copies I_SS → C_L', 18, { size: 19, color: C.cur, weight: 700 });
  S.say(16, 'Now the circuit is current-limited: M1 carries $I_{SS}$, M3 and M4 copy it, and a <b>fixed</b> current $I_{SS}$ flows into $C_L$ — no matter how large the step is.');
  eqAt(S, 'i = C_L\\frac{dV}{dt}\\;\\Rightarrow\\; \\left.\\frac{dV_{out}}{dt}\\right|_{max} = \\frac{I_{SS}}{C_L} = SR', 1240, 540, 24, { size: 30, w: 640, color: '#ffd38a' });
  S.say(24, 'A fixed current into a capacitor — the very first scene of the foundations: a <b>straight ramp</b> at $I_{SS}/C_L$. That maximum slope is the <b>slew rate</b>. Your page: $dv/dt|_{max} = I_{SS}/C_L = 5$ V/µs.');
  // ramp vs exponential
  const px = 960, py = 860;
  const ax2 = axes(S, px, py, 560, 230, { x: 't', y: 'V_out' }); S.fade(ax2, 32, 0.6);
  const ideal = S.el('polyline', { points: ptsOf(120, 0, 6, (t) => [px + t * 90, py - 200 * (1 - Math.exp(-t * 2.2))]), fill: 'none', stroke: C.dim, 'stroke-width': 2.4, 'stroke-dasharray': '6 5' });
  S.draw(ideal, 32, 1.4);
  const rp = S.el('polyline', { points: ptsOf(160, 0, 6, (t) => [px + t * 90, py - 200 * Math.min(1, t < 0.75 ? t * 0.95 : 1 - (1 - 0.7125) * Math.exp(-(t - 0.75) * 2.2))]), fill: 'none', stroke: C.volt, 'stroke-width': 3.4 });
  S.draw(rp, 35, 2);
  label(S, px + 130, py - 120, 'slewing: straight ramp', 35, { size: 18, color: C.volt, weight: 700 });
  label(S, px + 330, py - 210, 'ideal linear (dashed)', 33, { size: 17, color: C.muted });
  S.say(32, 'Compare: the linear response would start much steeper (dashed). The real output can only ramp at the slew rate, then — once the error is small enough for the pair to come out of full steering — it finishes with the normal exponential.');
  whyBox(S, 60, 700, 820, 140, '**Slewing = the op amp has run out of current.** It is a **large-signal** effect: the output becomes a ramp at $SR = I_{max}/C_L$, independent of the step size. For the 5-T OTA $I_{max} = I_{SS}$, in both directions (the mirror copies).', 44);
  S.say(44, '<span class="why">Remember why:</span> slewing happens because the input pair has handed over all the current it has. More step cannot make more current, so the slope is capped at $I_{SS}/C_L$ — up and down for the 5-T OTA.');
});

scene(L13, 'Full steering: why √2·V_ov', 50, (S) => {
  header(S, 'LEC 13 · WHEN IS THE PAIR FULLY STEERED?', 'ΔV_in,min = √2 V_ov (V_ov at balance)');
  const lines = [
    ['\\text{balance: } \\frac{I_{SS}}{2} = \\tfrac12k\\,V_{ov}^2', 0.4, 'At balance each device carries $I_{SS}/2$ with overdrive $V_{ov}$ (k = µC_{ox}W/L).'],
    ['\\text{M1 alone carries } I_{SS}:\\; I_{SS} = \\tfrac12k\\,V_{ov1}^2 \\;\\Rightarrow\\; V_{ov1} = \\sqrt2\\,V_{ov}', 8, 'Fully steered, M1 alone carries $I_{SS}$ — twice the current, so √2 times the overdrive.'],
    ['\\text{M2 just off: } V_{GS2} = V_{th}', 16, 'M2 is just off: its gate is exactly one $V_{th}$ above the shared source.'],
    ['\\Delta V = V_{GS1} - V_{GS2} = (V_{th} + \\sqrt2V_{ov}) - V_{th} = \\sqrt2\\,V_{ov}', 22, 'Subtract: the thresholds cancel. The pair is fully steered once the gate difference reaches $\\sqrt2 V_{ov}$.'],
  ];
  lines.forEach(([tex, t, say], i) => { eqAt(S, tex, 800, 200 + i * 110, t, { size: 32, w: 1300, color: i === 3 ? '#ffd38a' : C.text }); S.say(t, say); });
  whyBox(S, 260, 650, 1080, 160, '**Used in:** Tutorial 6 Q2(b) ($V_{ov} = \\sqrt{2(100\\,\\mu)/4\\,\\text{m}} = 0.224$ V → 0.316 V) and Tutorial 6 Q3(d) ($\\sqrt2\\times0.15 = 0.212$ V). Below this step the pair still has both devices on: the response is (nearly) linear.', 30);
  S.say(30, 'Both slew-rate tutorials ask for this number. Smaller than $\\sqrt2V_{ov}$: both devices conduct and the response is roughly linear. Larger: full slewing.');
});

scene(L13, 'When does it slew, and for how long?', 80, (S) => {
  header(S, 'LEC 13 · THE TIMING', 'Ramp at SR until the exponential can take over');
  const x0 = 100, y0 = 780, U = 118, V = 480;
  const ax = axes(S, x0, y0, 720, 560, { x: 't', y: 'V_out' }); S.fade(ax, 0.3, 0.6);
  const Vf = 1, tau = 0.6, SR = 0.9;
  const tsl = (Vf - SR * tau) / SR;
  const real = (t) => (t < tsl ? SR * t : Vf - SR * tau * Math.exp(-(t - tsl) / tau));
  const X = (t) => x0 + t * U, Y = (v) => y0 - v * V;
  S.el('line', { x1: x0, y1: Y(Vf), x2: x0 + 700, y2: Y(Vf), stroke: C.amb, 'stroke-width': 1.6, 'stroke-dasharray': '6 6' });
  label(S, x0 + 700, Y(Vf) - 10, 'final value V_0A_CL', 1, { size: 18, color: C.amb, anchor: 'end', weight: 700 });
  const lin = S.el('polyline', { points: ptsOf(120, 0, 5.5, (t) => [X(t), Y(Vf * (1 - Math.exp(-t / tau)))]), fill: 'none', stroke: C.dim, 'stroke-width': 2.4, 'stroke-dasharray': '6 5' });
  S.draw(lin, 2, 1.6);
  const tg = S.el('line', { x1: X(0), y1: Y(0), x2: X(tau), y2: Y(Vf), stroke: C.muted, 'stroke-width': 1.6 }); S.fade(tg, 4, 0.5);
  label(S, X(tau) + 14, Y(Vf) + 48, '← linear start: V_0A_CL/τ', 4, { size: 17, color: C.muted });
  S.say(2, 'Dashed: what a perfectly linear op amp would do. It starts with slope $V_0A_{CL}/\\tau$ — and that grows with the step size.');
  const sl = S.el('line', { x1: X(0), y1: Y(0), x2: X(1.0), y2: Y(1.0 * SR), stroke: C.cur, 'stroke-width': 2, 'stroke-dasharray': '3 5' }); S.fade(sl, 9, 0.5);
  label(S, X(1.0) + 12, Y(SR) + 40, 'max slope = SR', 9, { size: 17, color: C.cur, weight: 700 });
  S.say(9, 'The op amp can never go steeper than SR. So the test is a comparison:');
  eqAt(S, '\\text{slews if }\\; \\frac{V_0A_{CL}}{\\tau} > SR \\;\\iff\\; V_0 > V_{0,crit} = \\frac{SR\\,\\tau}{A_{CL}}', 1260, 210, 13, { size: 26, w: 640 });
  S.say(13, 'It slews if the linear starting slope $V_0A_{CL}/\\tau$ would exceed SR — that is, if the step is bigger than $V_{0,crit} = SR\\,\\tau/A_{CL}$ (Tutorial 6 Q1(c)).');
  tracePlot(S, real, X, Y, 20, 30, C.volt, 5.5);
  const tl = S.el('line', { x1: X(tsl), y1: y0, x2: X(tsl), y2: Y(real(tsl)), stroke: C.bad, 'stroke-width': 1.8, 'stroke-dasharray': '4 4' }); S.fade(tl, 26, 0.5);
  label(S, X(tsl), y0 + 30, 't_slew', 26, { size: 19, color: C.bad, anchor: 'middle', weight: 700 });
  S.say(20, 'The real output (blue): a straight ramp at SR… then it bends into the normal exponential.');
  S.say(26, 'When does it switch? When the exponential’s own slope has fallen to SR. An exponential with gap $G$ to go has slope $G/\\tau$, so the switch happens when the remaining gap is $SR\\cdot\\tau$.');
  eqAt(S, 't_{slew} = \\frac{V_0A_{CL} - SR\\,\\tau}{SR}', 1260, 330, 34, { size: 30, w: 640, color: '#ffd38a' });
  S.say(34, 'Ramp at SR from 0 up to $V_0A_{CL} - SR\\tau$: that takes $t_{slew} = (V_0A_{CL} - SR\\tau)/SR$ (Tutorial 6 Q1(d)).');
  eqAt(S, 't_{total} = t_{slew} + \\tau\\ln\\frac{\\text{gap left}}{\\varepsilon\\,V_{final}}', 1260, 430, 40, { size: 28, w: 640, color: '#ffd38a' });
  S.say(40, 'Then settle linearly: the remaining gap decays as $e^{-t/\\tau}$, so add $\\tau\\ln(\\text{gap}/(\\varepsilon V_{final}))$ to reach within ε. That is Tutorial 6 Q2(d).');
  whyBox(S, 1040, 520, 520, 260, '**Exam recipe for any step:** ① $A_{CL}$ and τ (closed loop). ② $SR = I_{max}/C_L$. ③ Compare $V_0A_{CL}/\\tau$ with SR. ④ If it slews: $t_{slew}$, then the exponential for the rest.', 48);
  S.say(48, 'The recipe for every step-response question: closed-loop gain and τ; slew rate; compare; if it slews, ramp time then exponential. Six questions use it next.');
});

scene(L13, 'Lecture 13 in one card', 28, (S) => {
  header(S, 'LEC 13 · REMEMBER', 'Everything from Lecture 13');
  remember(S, [
    'Laplace: step = $V_0/s$, $1/(s+a) \\leftrightarrow e^{-at}$. RC: $V_0(1 - e^{-t/\\tau})$, slope $\\frac{V_0}{\\tau}e^{-t/\\tau}$.',
    'Op amp with $R_{out}$, $C_L$ in a loop: gain $\\frac{A}{1+\\beta A}$, $\\tau = \\frac{R_{out}C_L}{1+\\beta A} = \\frac{1}{\\beta\\omega_u}$.',
    'Small step: output current $g_m\\Delta V$ — **linear**, start slope ∝ step.',
    'Large step: pair fully steered at $\\sqrt2V_{ov}$; all $I_{SS}$ into $C_L$; **SR = $I_{SS}/C_L$**.',
    'Slews if $V_0A_{CL}/\\tau > SR$. $t_{slew} = (V_0A_{CL} - SR\\tau)/SR$, then $\\tau\\ln(\\text{gap}/\\varepsilon V_f)$.',
  ], 0.4, 'Lecture 13 · remember');
  S.say(0.4, 'Now every Lecture 13 question: Razavi Ex 9.2, Problem Set 1 P2, Tutorial 6 Q1 and Q2, Quiz 1 2024 Q2 and Lab 9.');
});

/* ── Lecture 13 questions ── */
scene(L13, 'Razavi Ex 9.2: how fast must the op amp be?', 46, (S) => {
  pyqFrame(S, {
    tag: 'LEC 13 · QUESTION 1 OF 6', title: 'Settle within 1 % in 5 ns', src: 'Razavi Example 9.2',
    q: 'A one-pole op amp is used with a closed-loop gain of 10. The output must settle within 1 % in 5 ns after a small step. Minimum $\\omega_u$ (and $f_u$)?', qh: 200,
    tests: 'settling time $\\tau\\ln(1/\\varepsilon)$ with the closed-loop $\\tau = 1/(\\beta\\omega_u)$.',
    fig: (S2) => { const g = ampModel(S2); g.setAttribute('transform', 'translate(-120 40)'); },
    steps: [
      { t: 6, title: 'After a small step the error left decays as $e^{-t/\\tau}$. **1 % needs ln 100 = 4.6 time constants**, so τ can be at most 5 ns / 4.6.', tex: '\\tau \\le \\frac{t_s}{\\ln 100} = \\frac{5\\,\\mathrm{ns}}{4.605} = 1.086\\,\\mathrm{ns}',
        try: { parts: [{ q: 'First: how many time constants does settling to 1 % take?', answer: Math.log(100), unit: '', tol: 0.02, hint: ['Solve $e^{-t/\\tau} = 0.01$ for $t/\\tau$.'], how: ['$$\\frac{t}{\\tau} = \\ln\\frac{1}{0.01} = \\ln 100 = 4.605$$'] }],
          q: '(a) What is the largest closed-loop time constant τ that still settles within 1 % in 5 ns?', answer: 5e-9 / Math.log(100), unit: 's', tol: 0.02,
          hint: ['A one-pole loop settles exponentially: the fraction still missing is $e^{-t/\\tau}$. Make it 1 % at 5 ns.', '$e^{-t_s/\\tau} = 0.01 \\;\\Rightarrow\\; \\tau = \\dfrac{t_s}{\\ln(1/0.01)}$'],
          how: ['The fraction of the step still missing after time t is $$\\varepsilon(t) = e^{-t/\\tau}$$',
            'We need ε = 1 % at $t_s$ = 5 ns. Take logs of both sides. $$t_s = \\tau\\ln\\frac{1}{0.01} = \\tau\\ln100 = 4.605\\,\\tau$$',
            'So the time constant can be at most $$\\tau \\le \\frac{5\\,\\mathrm{ns}}{4.605} = 1.086\\,\\mathrm{ns}$$'],
          why: '1 % → 4.6τ and 0.1 % → 6.9τ: learn these two numbers.',
          calc: [{ what: 't ÷ ln 100', keys: '5n ÷ [SHIFT] [log■□] 100 ) [EXE]', shows: '1.0857n', note: PFX }] }, say: '$e^{-t/\\tau} = 0.01 \\Rightarrow t = 4.6\\tau$, so $\\tau \\le 5\\,\\text{ns}/4.6 = 1.09$ ns.' },
      { t: 14, title: 'A closed-loop gain of 10 means **β = 0.1**. A one-pole loop has bandwidth $\\beta\\omega_u$, so **τ = 1/(βω_u)**.', tex: '\\omega_u \\ge \\frac{1}{\\beta\\tau} = \\frac{1}{0.1\\times1.086\\,\\mathrm{ns}} = 9.21\\,\\mathrm{Grad/s}',
        try: { parts: [{ q: 'First: the feedback factor β for a closed-loop gain of 10?', answer: 0.1, unit: '', tol: 0.01, hint: ['β = 1/(ideal closed-loop gain).'], how: ['$$\\beta = \\frac{1}{10} = 0.1$$'] }],
          q: '(b) Using τ from part (a), what is the minimum unity-gain bandwidth $\\omega_u$ of the op amp (in rad/s)?', answer: ans('bank-ex92', 'wu'), unit: 'rad/s', tol: 0.02,
          hint: ['The closed-loop bandwidth of a one-pole op amp is $\\beta\\omega_u$, and τ is one over it. β comes from the closed-loop gain.', '$\\beta = \\dfrac{1}{A_{CL}},\\; \\tau = \\dfrac{1}{\\beta\\omega_u} \\;\\Rightarrow\\; \\omega_u = \\dfrac{1}{\\beta\\tau}$'],
          how: ['A closed-loop gain of 10 means $$\\beta = \\frac{1}{10} = 0.1$$',
            'The loop’s bandwidth is $\\beta\\omega_u$, so $$\\tau = \\frac{1}{\\beta\\omega_u}$$',
            'Rearrange and use τ ≤ 1.086 ns from part (a). A smaller τ needs a larger $\\omega_u$, so this is a minimum. $$\\omega_u \\ge \\frac{1}{\\beta\\tau} = \\frac{1}{0.1\\times1.086\\times10^{-9}} = 9.21\\times10^{9}\\,\\mathrm{rad/s}$$'],
          calc: [{ what: '1/(βτ)', keys: '1 ÷ ( 0.1 × 1.0857n ) [EXE]', shows: '9.2107G', note: PFX }] }, say: '$\\omega_u \\ge 1/(\\beta\\tau) = 9.21$ Grad/s.' },
      { t: 21, title: 'Convert to Hz: **divide by 2π**.', tex: 'f_u = \\frac{\\omega_u}{2\\pi} = \\frac{9.21\\,\\mathrm{Grad/s}}{2\\pi} = 1.47\\,\\mathrm{GHz}', say: 'Divide by $2\\pi$: $f_u \\ge 1.47$ GHz.' },
      { t: 27, ans: true, title: '**Answers:** $\\omega_u \\ge 9.21$ Grad/s, $f_u \\ge 1.47$ GHz', say: 'Two lines: ε → number of τ; τ → $\\omega_u$ through β.' },
    ],
  });
}, { q: 'Razavi Ex 9.2' });

scene(L13, 'Problem Set 1 P2: gain error and settling', 54, (S) => {
  pyqFrame(S, {
    tag: 'LEC 13 · QUESTION 2 OF 6', title: 'The P1 op amp in a gain-of-5 loop', src: 'Problem Set 1 P2',
    q: 'The 5-T OTA of P1 ($A = 84.3$, $g_{m1} = 1.265$ mS) in a non-inverting amplifier of gain 5. (a) Static gain error. (b) $A$ needed for 0.5 % error. (c) With $C_L = 2$ pF, the time to settle within 0.1 %.', qh: 230,
    tests: 'Lec 1’s error $1/(1+\\beta A)$, then τ = $1/(\\beta\\omega_u)$ with $\\omega_u = g_m/C_L$, then 6.9τ.',
    fig: (S2) => { const g = otaLoop(S2); g.setAttribute('transform', 'translate(-120 60)'); },
    steps: [
      { t: 6, title: '(a) Gain 5 means **β = 1/5**. The static gain error is **ε = 1/(1 + βA)**.', tex: '\\varepsilon = \\frac{1}{1 + \\beta A} = \\frac{1}{1 + 0.2\\times84.3} = 0.056 = 5.6\\,\\%',
        try: { parts: [{ q: 'First: the feedback factor β for a gain of 5?', answer: 0.2, unit: '', tol: 0.01, hint: ['β = 1/(ideal gain).'], how: ['$$\\beta = \\frac{1}{5} = 0.2$$'] }, { q: 'Next: the loop gain βA?', answer: 0.2 * 84.3, unit: '', tol: 0.02, hint: ['A = 84.3 from P1.'], how: ['$$\\beta A = 0.2\\times84.3 = 16.86$$'] }],
          q: '(a) What is the static gain error ε, as a fraction?', answer: ans('bank-ps1p2', 'eps'), unit: '', tol: 0.02,
          hint: ['β is one over the ideal gain. The error is how far the loop gain is from infinite.', '$\\beta = \\dfrac{1}{5},\\; \\varepsilon = \\dfrac{1}{1 + \\beta A}$'],
          how: ['A non-inverting amplifier with ideal gain 5 has $$\\beta = \\frac{1}{5} = 0.2$$',
            'Loop gain, with A = 84.3 from P1. $$\\beta A = 0.2\\times84.3 = 16.86$$',
            'Relative gain error. $$\\varepsilon = \\frac{1}{1 + \\beta A} = \\frac{1}{17.86} = 0.056$$'],
          why: 'So the gain is 5.6 % below 5: far too much for a precision amplifier.' }, say: '$\\varepsilon = 1/(1 + 0.2\\times84.3) = 5.6$ %.' },
      { t: 13, title: '(b) For a small error $\\beta A \\gg 1$, so $\\varepsilon \\approx 1/(\\beta A)$ and **$A \\ge (1/\\beta)/\\varepsilon$**.', tex: 'A \\ge \\frac{1/\\beta}{\\varepsilon} = \\frac{5}{0.005} = 1000', say: 'For 0.5 %: $A \\ge 5/0.005 = 1000$.' },
      { t: 19, title: '(c) The OTA’s unity-gain frequency is **$\\omega_u = g_{m1}/C_L$**, and the loop has **τ = 1/(βω_u)**.', tex: '\\omega_u = \\frac{g_{m1}}{C_L} = \\frac{1.265\\,\\mathrm{mS}}{2\\,\\mathrm{pF}} = 632\\,\\mathrm{Mrad/s},\\; \\tau = \\frac{C_L}{\\beta g_{m1}} = \\frac{2\\,\\mathrm{pF}}{0.2\\times1.265\\,\\mathrm{mS}} = 7.91\\,\\mathrm{ns}',
        try: { parts: [{ q: 'First: the OTA’s unity-gain frequency $\\omega_u$ (rad/s)?', answer: 1 / (0.2 * ans('bank-ps1p2', 'tau')), unit: 'rad/s', tol: 0.02, hint: ['$\\omega_u = g_{m1}/C_L$.'], how: ['$$\\omega_u = \\frac{1.265\\,\\mathrm{mS}}{2\\,\\mathrm{pF}} = 632\\,\\mathrm{Mrad/s}$$'] }],
          q: '(c) With $C_L$ = 2 pF, what is the closed-loop time constant τ?', answer: ans('bank-ps1p2', 'tau'), unit: 's', tol: 0.02,
          hint: ['First the op amp’s unity-gain frequency from $g_{m1}$ and $C_L$; the loop bandwidth is β times that.', '$\\omega_u = \\dfrac{g_{m1}}{C_L},\\; \\tau = \\dfrac{1}{\\beta\\omega_u}$'],
          how: ['Unity-gain frequency of the 5-T OTA ($g_{m1}$ = 1.265 mS from P1). $$\\omega_u = \\frac{g_{m1}}{C_L} = \\frac{1.265\\,\\mathrm{mS}}{2\\,\\mathrm{pF}} = 632\\,\\mathrm{Mrad/s}$$',
            'The closed-loop bandwidth is $\\beta\\omega_u$ (β = 0.2 from part a); τ is its inverse. $$\\tau = \\frac{1}{\\beta\\omega_u} = \\frac{1}{0.2\\times632\\times10^{6}} = 7.91\\,\\mathrm{ns}$$'],
          calc: [{ what: 'τ = C_L/(β g_m1)', keys: '2p ÷ ( 0.2 × 1.265m ) [EXE]', shows: '7.9051n', note: PFX }] }, say: '$\\omega_u = 1.26\\,\\text{mS}/2\\,\\text{pF} = 632$ Mrad/s; $\\tau = 1/(0.2\\times632\\text{M}) = 7.91$ ns.' },
      { t: 27, title: 'Settling to 0.1 % needs **ln 1000 = 6.91 time constants**.', tex: 't_s = \\tau\\ln\\frac{1}{0.001} = 6.91\\times7.91\\,\\mathrm{ns} = 54.6\\,\\mathrm{ns}',
        try: { q: '(c) How long does the output take to settle within 0.1 % after a small step?', answer: ans('bank-ps1p2', 't'), unit: 's', tol: 0.02,
          hint: ['Same exponential as always: the fraction still missing is $e^{-t/\\tau}$. Set it to 0.1 %.', '$t_s = \\tau\\ln\\dfrac{1}{0.001}$'],
          how: ['The error left after time t is $$e^{-t/\\tau}$$',
            'Set it to 0.001 and solve for t. $$t_s = \\tau\\ln1000 = 6.91\\,\\tau$$',
            'Use τ = 7.91 ns from the last step. $$t_s = 6.91\\times7.91\\,\\mathrm{ns} = 54.6\\,\\mathrm{ns}$$'],
          calc: [{ what: 'τ × ln 1000', keys: '7.905n × [SHIFT] [log■□] 1000 ) [EXE]', shows: '54.607n' }] }, say: '$6.91\\tau = 54.6$ ns.' },
      { t: 34, ans: true, title: '**Answers:** ε = 5.6 % · $A \\ge 1000$ · $t \\approx 54.6$ ns', say: 'Gain error and settling time come from the same loop gain — first Lec 1, then Lec 13.' },
    ],
  });
}, { q: 'Problem Set 1 P2' });

scene(L13, 'Tutorial 6 Q1: linear settling versus slewing', 90, (S) => {
  pyqFrame(S, {
    paper: 't6q1', tag: 'LEC 13 · QUESTION 3 OF 6', title: 'One op amp, a small step and a big one', src: 'Tutorial 6 Q1',
    q: '$R_1 = 4$ MΩ, $R_2 = 1$ MΩ, $C_L = 8$ pF, $A = 80$ dB, $R_{out} = 50$ kΩ, $I_{max} = 160\\,\\mu$A. (a) $A_{CL}$, τ, $V_{out}$ 1 ns after a 50 mV step. (b) Initial slope. (c) SR and the step above which it slews. (d) For a 1 V step, how long it slews.', qh: 270,
    tests: 'the whole Lec 13 recipe: closed-loop gain and τ, the exponential, the starting slope, SR, the critical step and the slewing time.',
    fig: (S2) => { const g = ampModel(S2); g.setAttribute('transform', 'translate(-120 40)'); },
    steps: [
      { t: 7, title: '80 dB is **A = 10⁴**. The resistors give **β = R₂/(R₁+R₂) = 0.2**. Then the feedback formula $A_{CL} = A/(1+\\beta A)$.', tex: 'A_{CL} = \\frac{A}{1 + \\beta A} = \\frac{10^4}{1 + 0.2\\times10^4} = \\frac{10^4}{2001} = 4.9975',
        try: { parts: [{ q: 'First: 80 dB as a ratio?', answer: 1e4, unit: '', tol: 0.01, hint: ['ratio = $10^{\\text{dB}/20}$.'], how: ['$$A = 10^{80/20} = 10^4$$'] }, { q: 'Next: the feedback factor β from the resistors?', answer: 0.2, unit: '', tol: 0.01, hint: ['$\\beta = R_2/(R_1 + R_2)$ with $R_1$ = 4 MΩ, $R_2$ = 1 MΩ.'], how: ['$$\\beta = \\frac{1}{4 + 1} = 0.2$$'] }],
          q: '(a) What is the exact closed-loop gain $A_{CL}$, with the finite open-loop gain?', answer: ans('bank-t6q1', 'acl'), unit: '', tol: 0.005,
          hint: ['Turn 80 dB into a ratio, find β from the resistor divider, then use the feedback formula.', '$A = 10^{80/20},\\; \\beta = \\dfrac{R_2}{R_1 + R_2},\\; A_{CL} = \\dfrac{A}{1 + \\beta A}$'],
          how: ['Open-loop gain as a ratio. $$A = 10^{80/20} = 10^4$$',
            'The output is fed back through $R_1$ (top) and $R_2$ (bottom). $$\\beta = \\frac{R_2}{R_1 + R_2} = \\frac{1}{4 + 1} = 0.2$$',
            'Feedback formula. $$A_{CL} = \\frac{A}{1 + \\beta A} = \\frac{10^4}{1 + 2000} = 4.9975$$'],
          why: 'Just under the ideal 1/β = 5.' }, say: '80 dB is $10^4$. $A_{CL} = 10^4/2001 = 4.9975$.' },
      { t: 15, title: 'Without feedback the output pole has time constant $R_{out}C_L$. **Feedback divides it by $1 + \\beta A$.**', tex: '\\tau = \\frac{R_{out}C_L}{1 + \\beta A} = \\frac{(50\\,\\mathrm{k\\Omega})(8\\,\\mathrm{pF})}{2001} = \\frac{400\\,\\mathrm{ns}}{2001} = 200\\,\\mathrm{ps}',
        try: { parts: [{ q: 'First: the open-loop time constant $R_{out}C_L$?', answer: 50e3 * 8e-12, unit: 's', tol: 0.02, hint: ['Multiply $R_{out}$ = 50 kΩ by $C_L$ = 8 pF.'], how: ['$$R_{out}C_L = 50\\,\\mathrm{k\\Omega}\\times8\\,\\mathrm{pF} = 400\\,\\mathrm{ns}$$'] }],
          q: '(a) What is the closed-loop time constant τ?', answer: ans('bank-t6q1', 'tau'), unit: 's', tol: 0.02,
          hint: ['Without feedback the output pole is $R_{out}$ with $C_L$. Feedback makes the loop faster by $1 + \\beta A$.', '$\\tau = \\dfrac{R_{out}C_L}{1 + \\beta A}$'],
          how: ['Open-loop time constant at the output. $$R_{out}C_L = 50\\,\\mathrm{k\\Omega}\\times8\\,\\mathrm{pF} = 400\\,\\mathrm{ns}$$',
            'Feedback shrinks it by $1 + \\beta A$ = 2001 (from the last step). $$\\tau = \\frac{400\\,\\mathrm{ns}}{2001} = 0.2\\,\\mathrm{ns} = 200\\,\\mathrm{ps}$$'] }, say: 'Open loop $R_{out}C_L = 400$ ns; divided by 2001: τ = 200 ps.' },
      { t: 23, title: 'A small step settles **linearly**: $V_{out}(t) = V_0A_{CL}(1 - e^{-t/\\tau})$. 1 ns is 5τ.', tex: 'V_{out} = 0.05\\times4.9975\\,(1 - e^{-1\\,\\mathrm{ns}/0.2\\,\\mathrm{ns}}) = 0.2499\\times(1 - e^{-5}) = 0.248\\,\\mathrm{V}',
        try: { parts: [{ q: 'First: the final value $V_0A_{CL}$ the output heads to?', answer: 0.05 * ans('bank-t6q1', 'acl'), unit: 'V', tol: 0.02, hint: ['$A_{CL}$ = 4.9975 from the first stop.'], how: ['$$V_0A_{CL} = 0.05\\times4.9975 = 0.2499\\,\\mathrm{V}$$'] }, { q: 'Next: how many time constants is 1 ns?', answer: 1e-9 / ans('bank-t6q1', 'tau'), unit: '', tol: 0.02, hint: ['τ = 0.2 ns from the last stop.'], how: ['$$\\frac{t}{\\tau} = \\frac{1\\,\\mathrm{ns}}{0.2\\,\\mathrm{ns}} = 5$$'] }],
          q: '(a) A 50 mV step is applied at the input. Assuming linear settling, what is $V_{out}$ 1 ns later?', answer: ans('bank-t6q1', 'v1'), unit: 'V', tol: 0.01,
          hint: ['The output heads exponentially to its final value $V_0A_{CL}$ with time constant τ.', '$V_{out}(t) = V_0A_{CL}\\left(1 - e^{-t/\\tau}\\right)$'],
          how: ['The final value the output is heading to. $$V_0A_{CL} = 0.05\\,\\mathrm{V}\\times4.9975 = 0.2499\\,\\mathrm{V}$$',
            'How many time constants is 1 ns (τ = 0.2 ns from the last step)? $$\\frac{t}{\\tau} = \\frac{1\\,\\mathrm{ns}}{0.2\\,\\mathrm{ns}} = 5$$',
            'Exponential approach. $$V_{out} = 0.2499\\times(1 - e^{-5}) = 0.2499\\times0.9933 = 0.248\\,\\mathrm{V}$$'],
          calc: [{ what: 'the whole exponential in one line', keys: '0.05 × 4.9975 × ( 1 − [SHIFT] [8] [^] [SHIFT] [−] 1n ÷ 0.1999n ) [EXE]', shows: '0.24820', note: 'e is [SHIFT] [8]; the minus sign in the exponent is [SHIFT] [−]. Type n with CATALOG ▸ Engineer Symbol.' }] }, say: '1 ns is 5τ, so it is within 0.7 %: 0.248 V.' },
      { t: 31, title: '(b) Differentiate the step response at t = 0: the exponential **starts with slope (final value)/τ**.', tex: '\\frac{dV_{out}}{dt}\\Big|_{0} = \\frac{V_0A_{CL}}{\\tau} = \\frac{0.2499\\,\\mathrm{V}}{200\\,\\mathrm{ps}} = 1250\\,\\mathrm{V/\\mu s}',
        try: { q: '(b) In that linear response, what is the slope of $V_{out}$ at the very start of the step?', answer: ans('bank-t6q1', 'slope') / 1e6, unit: 'V/µs', tol: 0.02,
          hint: ['Differentiate $V_0A_{CL}(1 - e^{-t/\\tau})$ and put t = 0.', '$\\dfrac{dV_{out}}{dt}\\Big|_{t=0} = \\dfrac{V_0A_{CL}}{\\tau}$'],
          how: ['Differentiate the step response. $$\\frac{dV_{out}}{dt} = \\frac{V_0A_{CL}}{\\tau}e^{-t/\\tau}$$',
            'At t = 0 the exponential is 1. Use 0.2499 V and τ = 200 ps from part (a). $$\\frac{V_0A_{CL}}{\\tau} = \\frac{0.2499\\,\\mathrm{V}}{200\\times10^{-12}\\,\\mathrm{s}} = 1.25\\times10^{9}\\,\\mathrm{V/s}$$',
            'In the usual units ($10^6$ V/s = 1 V/µs): $$1.25\\times10^{9}\\,\\mathrm{V/s} = 1250\\,\\mathrm{V/\\mu s}$$'] }, say: 'Starting slope $V_0A_{CL}/\\tau = 1250$ V/µs.' },
      { t: 39, title: '(c) In slewing the op amp gives its most current, $I_{max}$, and it all fills $C_L$: **SR = $I_{max}/C_L$**.', tex: 'SR = \\frac{I_{max}}{C_L} = \\frac{160\\,\\mu\\mathrm{A}}{8\\,\\mathrm{pF}} = 20\\,\\mathrm{V/\\mu s}',
        try: { q: '(c) What is the slew rate of the op amp?', answer: ans('bank-t6q1', 'sr') / 1e6, unit: 'V/µs', tol: 0.02,
          hint: ['The fastest the output can move is when all the available current charges the load capacitor.', '$SR = \\dfrac{I_{max}}{C_L}$ (and µA/pF = V/µs)'],
          how: ['Slewing: the op amp gives its maximum current and it all goes into $C_L$. From $i = C\\,dv/dt$: $$SR = \\frac{I_{max}}{C_L}$$',
            'Substitute; µA ÷ pF comes out directly in V/µs. $$SR = \\frac{160\\,\\mu\\mathrm{A}}{8\\,\\mathrm{pF}} = 20\\,\\mathrm{V/\\mu s}$$',
            'Compare with part (b): the 50 mV step asked for 1250 V/µs, far more than 20, so even that small step slews.'] }, say: '160 µA / 8 pF = 20 V/µs. So the 50 mV step, needing 1250 V/µs, actually slews!' },
      { t: 47, title: '(c) It slews when the wanted start slope beats SR, **$V_0A_{CL}/\\tau > SR$**. The largest linear step is $SR\\cdot\\tau/A_{CL}$.', tex: 'V_{0,crit} = \\frac{SR\\,\\tau}{A_{CL}} = \\frac{(20\\,\\mathrm{V/\\mu s})(200\\,\\mathrm{ps})}{4.9975} = 0.8\\,\\mathrm{mV}',
        try: { q: '(c) Above what input step size $V_0$ does the op amp slew?', answer: ans('bank-t6q1', 'v0c'), unit: 'V', tol: 0.02,
          hint: ['The linear response asks for a start slope $V_0A_{CL}/\\tau$ (part b). It slews when that is more than SR. Set them equal.', '$\\dfrac{V_{0,crit}A_{CL}}{\\tau} = SR \\;\\Rightarrow\\; V_{0,crit} = \\dfrac{SR\\,\\tau}{A_{CL}}$'],
          how: ['A step $V_0$ asks for a start slope of $$\\frac{V_0A_{CL}}{\\tau}$$',
            'It stays linear only while that is at most SR. At the edge: $$V_{0,crit} = \\frac{SR\\,\\tau}{A_{CL}}$$',
            'Substitute SR = 20 V/µs = $2\\times10^7$ V/s, τ = 200 ps. $$V_{0,crit} = \\frac{2\\times10^{7}\\times200\\times10^{-12}}{4.9975} = \\frac{4\\,\\mathrm{mV}}{4.9975} = 0.8\\,\\mathrm{mV}$$'] }, say: '$V_{0,crit} = 20\\,\\text{V/µs}\\times200\\,\\text{ps}/5 = 0.8$ mV — anything bigger slews.' },
      { t: 56, title: '(d) A 1 V step slews: the output **ramps at SR until the gap left is only SR·τ**, then finishes linearly.', tex: 'SR\\cdot\\tau = (20\\,\\mathrm{V/\\mu s})(200\\,\\mathrm{ps}) = 4\\,\\mathrm{mV},\\; t_{slew} = \\frac{V_0A_{CL} - SR\\,\\tau}{SR} = \\frac{4.9975\\,\\mathrm{V} - 4\\,\\mathrm{mV}}{20\\,\\mathrm{V/\\mu s}} = 250\\,\\mathrm{ns}',
        try: { parts: [{ q: 'First: the final output value for a 1 V step?', answer: ans('bank-t6q1', 'acl'), unit: 'V', tol: 0.005, hint: ['Final value = $V_0A_{CL}$.'], how: ['$$V_0A_{CL} = 1\\times4.9975 = 4.9975\\,\\mathrm{V}$$'] }, { q: 'Next: the gap $SR\\cdot\\tau$ at which slewing stops?', answer: ans('bank-t6q1', 'sr') * ans('bank-t6q1', 'tau'), unit: 'V', tol: 0.02, hint: ['SR = 20 V/µs, τ = 200 ps from earlier stops.'], how: ['$$SR\\cdot\\tau = 20\\,\\mathrm{V/\\mu s}\\times200\\,\\mathrm{ps} = 4\\,\\mathrm{mV}$$'] }],
          q: '(d) For a 1 V input step, how long does the output slew?', answer: ans('bank-t6q1', 'ts'), unit: 's', tol: 0.02,
          hint: ['The output ramps at SR until the gap left to its final value is small enough to finish linearly. That gap is $SR\\cdot\\tau$.', '$t_{slew} = \\dfrac{V_0A_{CL} - SR\\,\\tau}{SR}$'],
          how: ['Final output value. $$V_0A_{CL} = 1\\,\\mathrm{V}\\times4.9975 = 4.9975\\,\\mathrm{V}$$',
            'Slewing stops when the gap left needs a slope of exactly SR, i.e. when the gap is $$SR\\cdot\\tau = 20\\,\\mathrm{V/\\mu s}\\times200\\,\\mathrm{ps} = 4\\,\\mathrm{mV}$$',
            'So the ramp covers 4.9975 V − 0.004 V = 4.9935 V at 20 V/µs. $$t_{slew} = \\frac{4.9935\\,\\mathrm{V}}{20\\,\\mathrm{V/\\mu s}} = 0.250\\,\\mu\\mathrm{s} = 250\\,\\mathrm{ns}$$'] }, say: '$(4.9975 - 0.004)/20\\,\\text{V/µs} ≈ 250$ ns of pure ramp.' },
      { t: 64, ans: true, title: `**Answers:** $A_{CL} = 4.9975$ · τ = 200 ps · $V_{out}(1\\,\\text{ns}) = 0.248$ V · 1250 V/µs · SR = 20 V/µs · $V_{0,crit} = 0.8$ mV · $t_{slew} = 250$ ns`, say: 'Moral: with a fast loop, even tiny steps hit the slew limit — speed is then set by current, not by τ.' },
    ],
  });
}, { q: 'Tutorial 6 Q1' });

scene(L13, 'Tutorial 6 Q2: a 5-T OTA slews, then settles', 94, (S) => {
  // intermediates for the step-by-step parts (same numbers as the bank answers)
  const T6Q2 = (() => { const gm = Math.sqrt(2 * 4e-3 * 100e-6), a0 = gm * ans('bank-t6q2', 'rout'), vf = 1.2 * a0 / (1 + 0.25 * a0), gap = vf - (1.2 - ans('bank-t6q2', 'dv')) / 0.25;
    return { gm, a0, vf, gap, tlin: ans('bank-t6q2', 'tau') * Math.log(gap / (0.01 * vf)) }; })();
  pyqFrame(S, {
    paper: 't6q2', tag: 'LEC 13 · QUESTION 4 OF 6', title: 'Slew, then settle: the full timeline', src: 'Tutorial 6 Q2',
    q: '$I_{SS} = 200\\,\\mu$A, $C_L = 5$ pF, $R_1 = 3$ MΩ, $R_2 = 1$ MΩ, $\\mu_nC_{ox}(W/L)_{1,2} = 4$ mA/V², $|V_A| = 20$ V. (a) SR±. (b) Step that turns M2 off. (c) Slewing time for a 1.2 V step. (d) $R_{out}$, $\\tau_{cl}$, total time to 1 %.', qh: 250,
    tests: 'SR of the 5-T OTA, full steering at $\\sqrt2V_{ov}$, when slewing ends, then linear settling.',
    fig: (S2) => { const g = otaLoop(S2); g.setAttribute('transform', 'translate(-120 60)'); },
    steps: [
      { t: 7, title: '(a) In either direction **all of $I_{SS}$** charges or discharges $C_L$ (the mirror copies it one way), so **SR+ = SR− = $I_{SS}/C_L$**.', tex: 'SR = \\frac{I_{SS}}{C_L} = \\frac{200\\,\\mu\\mathrm{A}}{5\\,\\mathrm{pF}} = 40\\,\\mathrm{V/\\mu s}',
        try: { q: '(a) What are the slew rates SR+ and SR− of this OTA?', answer: ans('bank-t6q2', 'sr') / 1e6, unit: 'V/µs', tol: 0.02,
          hint: ['After a big step one input transistor turns off and the whole tail current goes one way. Where does it end up?', '$SR = \\dfrac{I_{SS}}{C_L}$'],
          how: ['Big positive step: M2 turns off. M1 takes all of $I_{SS}$; the mirror M3–M4 copies it and pushes it into $C_L$. $$SR^+ = \\frac{I_{SS}}{C_L}$$',
            'Big negative step: M1 turns off, the mirror gives nothing, and M2 pulls all of $I_{SS}$ out of $C_L$. $$SR^- = \\frac{I_{SS}}{C_L}$$',
            'Substitute (µA/pF = V/µs). $$SR = \\frac{200\\,\\mu\\mathrm{A}}{5\\,\\mathrm{pF}} = 40\\,\\mathrm{V/\\mu s}$$'],
          why: 'A 5-T OTA slews equally fast both ways.' }, say: 'SR+ = SR− = $I_{SS}/C_L$ = 40 V/µs.' },
      { t: 15, title: '(b) The pair is **fully steered (M2 off) at $\\sqrt2\\,V_{ov}$**, where $V_{ov}$ is the overdrive at balance (100 µA each).', tex: '\\Delta V_{in,min} = \\sqrt2\\,V_{ov} = \\sqrt2\\sqrt{\\frac{2(100\\,\\mu\\mathrm{A})}{4\\,\\mathrm{mA/V^2}}} = \\sqrt2\\times0.224\\,\\mathrm{V} = 0.316\\,\\mathrm{V}',
        try: { parts: [{ q: 'First: the overdrive $V_{ov}$ of M1, M2 at balance?', answer: Math.sqrt(2 * 100e-6 / 4e-3), unit: 'V', tol: 0.02, hint: ['At balance $I_D = I_{SS}/2$ = 100 µA; $V_{ov} = \\sqrt{2I_D/(\\mu_nC_{ox}W/L)}$.'], how: ['$$V_{ov} = \\sqrt{\\frac{2\\times100\\,\\mu}{4\\,\\mathrm{m}}} = 0.224\\,\\mathrm{V}$$'] }],
          q: '(b) What is the smallest differential input step that turns M2 completely off?', answer: ans('bank-t6q2', 'dv'), unit: 'V', tol: 0.01,
          hint: ['Full steering happens at $\\sqrt2$ times the overdrive the pair has at balance, when each side carries $I_{SS}/2$.', '$V_{ov} = \\sqrt{\\dfrac{2(I_{SS}/2)}{\\mu_nC_{ox}(W/L)}},\\; \\Delta V_{in,min} = \\sqrt2\\,V_{ov}$'],
          how: ['At balance each side carries half the tail. $$I_D = \\frac{I_{SS}}{2} = 100\\,\\mu\\mathrm{A}$$',
            'Overdrive at balance from the square law, with $\\mu_nC_{ox}(W/L)$ = 4 mA/V². $$V_{ov} = \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)}} = \\sqrt{\\frac{2\\times100\\,\\mu}{4\\,\\mathrm{m}}} = 0.224\\,\\mathrm{V}$$',
            'The pair is fully steered (M2 off) at $$\\Delta V_{in,min} = \\sqrt2\\,V_{ov} = 1.414\\times0.224 = 0.316\\,\\mathrm{V}$$'],
          calc: [{ what: '√2 · √(2I_D/k) = √(4I_D/k) in one go', keys: '[√] 4 × 100µ ÷ 4m [EXE]', shows: '0.31623', note: 'Type µ and m with CATALOG ▸ Engineer Symbol.' }] }, say: '$V_{ov} = \\sqrt{2(100\\,\\mu)/4\\,\\text{m}} = 0.224$ V, so 0.316 V.' },
      { t: 23, title: '(c) The pair stays fully steered until the fed-back voltage **X = β$V_{out}$ comes within $\\sqrt2V_{ov}$ of the input**. Until then the output ramps at SR.', tex: 'V_{out} = \\frac{V_0 - \\sqrt2V_{ov}}{\\beta} = \\frac{1.2 - 0.316}{0.25} = 3.54\\,\\mathrm{V},\\; t_{slew} = \\frac{3.54\\,\\mathrm{V}}{40\\,\\mathrm{V/\\mu s}} = 88.4\\,\\mathrm{ns}',
        try: { parts: [{ q: 'First: the feedback factor β?', answer: 0.25, unit: '', tol: 0.01, hint: ['$\\beta = R_2/(R_1 + R_2)$ with $R_1$ = 3 MΩ, $R_2$ = 1 MΩ.'], how: ['$$\\beta = \\frac{1}{3 + 1} = 0.25$$'] }, { q: 'Next: $V_{out}$ at the moment slewing ends?', answer: (1.2 - ans('bank-t6q2', 'dv')) / 0.25, unit: 'V', tol: 0.02, hint: ['Slewing ends when $V_0 - \\beta V_{out} = \\sqrt2V_{ov}$ = 0.316 V.'], how: ['$$V_{out} = \\frac{1.2 - 0.316}{0.25} = 3.54\\,\\mathrm{V}$$'] }],
          q: '(c) A 1.2 V step is applied at the input. How long does the output slew?', answer: ans('bank-t6q2', 'ts'), unit: 's', tol: 0.03,
          hint: ['The pair stays fully steered while $V_{in} - X > \\sqrt2V_{ov}$, where $X = \\beta V_{out}$ is the fed-back voltage. Find the $V_{out}$ where that stops, then how long the ramp takes to get there.', '$\\beta = \\dfrac{R_2}{R_1 + R_2},\\; V_{out} = \\dfrac{V_0 - \\sqrt2V_{ov}}{\\beta},\\; t_{slew} = \\dfrac{V_{out}}{SR}$'],
          how: ['Feedback factor from the resistor divider. $$\\beta = \\frac{R_2}{R_1 + R_2} = \\frac{1}{3 + 1} = 0.25$$',
            'Slewing lasts while the difference at the pair is at least $\\sqrt2V_{ov}$ = 0.316 V (part b). It ends when $$V_0 - \\beta V_{out} = 0.316\\,\\mathrm{V}$$',
            'Solve for the output at that moment. $$V_{out} = \\frac{1.2 - 0.316}{0.25} = 3.54\\,\\mathrm{V}$$',
            'The output got there on a straight ramp at SR = 40 V/µs (part a). $$t_{slew} = \\frac{3.54\\,\\mathrm{V}}{40\\,\\mathrm{V/\\mu s}} = 0.0884\\,\\mu\\mathrm{s} = 88.4\\,\\mathrm{ns}$$'] }, say: 'The pair stays fully steered until $V_{in} - X = 0.316$ V: $V_{out} = (1.2 - 0.316)/0.25 = 3.54$ V, reached after $3.54/40\\,\\text{V/µs} = 88$ ns.' },
      { t: 32, title: '(d) The output node sees **$r_{O2}\\parallel r_{O4}$**, each $r_O = |V_A|/I_D$ at 100 µA.', tex: 'r_O = \\frac{20\\,\\mathrm{V}}{100\\,\\mu\\mathrm{A}} = 200\\,\\mathrm{k\\Omega},\\; R_{out} = r_{O2}\\parallel r_{O4} = \\frac{200\\,\\mathrm{k\\Omega}}{2} = 100\\,\\mathrm{k\\Omega}',
        try: { parts: [{ q: 'First: $r_O$ of each output transistor?', answer: 20 / 100e-6, unit: 'Ω', tol: 0.02, hint: ['$r_O = |V_A|/I_D$ with $I_D$ = 100 µA.'], how: ['$$r_O = \\frac{20\\,\\mathrm{V}}{100\\,\\mu\\mathrm{A}} = 200\\,\\mathrm{k\\Omega}$$'] }],
          q: '(d) What is the output resistance $R_{out}$ of the OTA?', answer: ans('bank-t6q2', 'rout'), unit: 'Ω', tol: 0.01,
          hint: ['Look into the output node: the input-side device M2 and the mirror device M4 are both there, in parallel.', '$R_{out} = r_{O2}\\parallel r_{O4},\\; r_O = \\dfrac{|V_A|}{I_D}$'],
          how: ['Each output transistor carries half the tail. $$I_D = \\frac{200\\,\\mu\\mathrm{A}}{2} = 100\\,\\mu\\mathrm{A}$$',
            'Each has (same $|V_A|$ = 20 V for both types) $$r_O = \\frac{|V_A|}{I_D} = \\frac{20\\,\\mathrm{V}}{100\\,\\mu\\mathrm{A}} = 200\\,\\mathrm{k\\Omega}$$',
            'Two equal resistors in parallel give half. $$R_{out} = \\frac{200\\,\\mathrm{k\\Omega}}{2} = 100\\,\\mathrm{k\\Omega}$$'] }, say: 'Each $r_O = 200$ kΩ; in parallel 100 kΩ.' },
      { t: 40, title: 'The DC gain is **$A_0 = g_mR_{out}$**, and the loop divides the open-loop time constant $R_{out}C_L$ by **$1 + \\beta A_0$**.', tex: 'g_m = \\sqrt{2(4\\,\\mathrm{m})(100\\,\\mu)} = 0.894\\,\\mathrm{mS},\\; A_0 = g_mR_{out} = 0.894\\,\\mathrm{mS}\\times100\\,\\mathrm{k\\Omega} = 89.4,\\; \\tau_{cl} = \\frac{R_{out}C_L}{1 + \\beta A_0} = \\frac{500\\,\\mathrm{ns}}{23.4} = 21.4\\,\\mathrm{ns}',
        try: { parts: [{ q: 'First: $g_m$ of M1, M2 at 100 µA?', answer: T6Q2.gm, unit: 'S', tol: 0.02, hint: ['$g_m = \\sqrt{2\\mu_nC_{ox}(W/L)I_D}$.'], how: ['$$g_m = \\sqrt{2\\times4\\,\\mathrm{m}\\times100\\,\\mu} = 0.894\\,\\mathrm{mS}$$'] }, { q: 'Next: the DC gain $A_0$?', answer: T6Q2.a0, unit: '', tol: 0.02, hint: ['$A_0 = g_mR_{out}$ with $R_{out}$ = 100 kΩ.'], how: ['$$A_0 = 0.894\\,\\mathrm{mS}\\times100\\,\\mathrm{k\\Omega} = 89.4$$'] }, { q: 'Next: the loop factor $1 + \\beta A_0$?', answer: 1 + 0.25 * T6Q2.a0, unit: '', tol: 0.02, hint: ['β = 0.25.'], how: ['$$1 + 0.25\\times89.4 = 23.4$$'] }],
          q: '(d) What is the closed-loop time constant $\\tau_{cl}$?', answer: ans('bank-t6q2', 'tau'), unit: 's', tol: 0.03,
          hint: ['You need the DC gain ($g_m$ at 100 µA, times $R_{out}$) and the open-loop time constant $R_{out}C_L$.', '$g_m = \\sqrt{2\\mu_nC_{ox}(W/L)I_D},\\; A_0 = g_mR_{out},\\; \\tau_{cl} = \\dfrac{R_{out}C_L}{1 + \\beta A_0}$'],
          how: ['Transconductance of each input device at $I_D$ = 100 µA. $$g_m = \\sqrt{2\\times4\\,\\mathrm{mA/V^2}\\times100\\,\\mu\\mathrm{A}} = 0.894\\,\\mathrm{mS}$$',
            'DC gain, with $R_{out}$ = 100 kΩ from the last step. $$A_0 = g_mR_{out} = 0.894\\,\\mathrm{mS}\\times100\\,\\mathrm{k\\Omega} = 89.4$$',
            'Loop factor with β = 0.25 (part c). $$1 + \\beta A_0 = 1 + 0.25\\times89.4 = 23.4$$',
            'The open-loop τ is $R_{out}C_L$ = 100 kΩ × 5 pF = 500 ns; feedback divides it. $$\\tau_{cl} = \\frac{500\\,\\mathrm{ns}}{23.4} = 21.4\\,\\mathrm{ns}$$'] }, say: '$A_0 = 89.4$, $1 + \\beta A_0 = 23.4$; $\\tau = 500\\,\\text{ns}/23.4 = 21.4$ ns.' },
      { t: 49, title: 'After slewing, **the gap left settles exponentially** with $\\tau_{cl}$. Stop when it is 1 % of the final value, then **add the two phases**.', tex: 'V_{final} = 1.2\\cdot\\frac{89.4}{23.4} = 4.595\\,\\mathrm{V},\\; \\text{gap} = 4.595 - 3.535 = 1.06\\,\\mathrm{V},\\; t_{total} = t_{slew} + \\tau_{cl}\\ln\\frac{V_{final} - V_{out}(t_{slew})}{0.01\\,V_{final}} = 88.4 + 21.4\\ln\\frac{1.06}{0.0460} = 88.4 + 67.2 = 156\\,\\mathrm{ns}',
        try: { parts: [{ q: 'First: the final output value $V_{final}$?', answer: T6Q2.vf, unit: 'V', tol: 0.02, hint: ['$V_{final} = V_0A_0/(1 + \\beta A_0)$.'], how: ['$$V_{final} = 1.2\\times\\frac{89.4}{23.4} = 4.595\\,\\mathrm{V}$$'] }, { q: 'Next: the gap left when slewing ends?', answer: T6Q2.gap, unit: 'V', tol: 0.02, hint: ['Slewing ended at $V_{out}$ = 3.535 V (part c).'], how: ['$$4.595 - 3.535 = 1.06\\,\\mathrm{V}$$'] }, { q: 'Next: the linear settling time $t_{lin}$ for that gap to reach 1 % of $V_{final}$?', answer: T6Q2.tlin, unit: 's', tol: 0.02, hint: ['$t_{lin} = \\tau_{cl}\\ln\\frac{\\text{gap}}{0.01V_{final}}$ with $\\tau_{cl}$ = 21.4 ns.'], how: ['$$t_{lin} = 21.4\\,\\mathrm{ns}\\times\\ln\\frac{1.06}{0.0460} = 67.2\\,\\mathrm{ns}$$'] }],
          q: '(d) For the 1.2 V step, what is the total time until the output is within 1 % of its final value?', answer: ans('bank-t6q2', 'total'), unit: 's', tol: 0.03,
          hint: ['Two phases: the slewing ramp from part (c), then an exponential with $\\tau_{cl}$ that must shrink the gap left to 1 % of the final value.', '$V_{final} = V_0\\dfrac{A_0}{1 + \\beta A_0},\\; t_{lin} = \\tau_{cl}\\ln\\dfrac{V_{final} - V_{out}(t_{slew})}{0.01\\,V_{final}}$'],
          how: ['Final output value with the finite gain. $$V_{final} = V_0\\frac{A_0}{1 + \\beta A_0} = 1.2\\times\\frac{89.4}{23.4} = 4.595\\,\\mathrm{V}$$',
            'When slewing ended (part c) the output was at 3.535 V, so the gap left is $$4.595 - 3.535 = 1.06\\,\\mathrm{V}$$',
            'That gap decays as $e^{-t/\\tau_{cl}}$ and must shrink to 1 % of 4.595 V = 0.0460 V. $$t_{lin} = \\tau_{cl}\\ln\\frac{1.06}{0.0460} = 21.4\\,\\mathrm{ns}\\times3.14 = 67.2\\,\\mathrm{ns}$$',
            'Add the two phases. $$t_{total} = t_{slew} + t_{lin} = 88.4 + 67.2 = 156\\,\\mathrm{ns}$$'],
          why: 'Slew first (straight line), then settle (exponential): two formulas, then add.',
          calc: [{ what: 'both phases in one line', keys: '88.4n + 21.4n × [SHIFT] [log■□] 1.06 ÷ 0.04595 ) [EXE]', shows: '155.6n', note: 'ln is [SHIFT] [log■□]; close its bracket before [EXE].' }] }, say: 'Gap 1.05 V must shrink to 1 % of 4.59 V: $21.4\\,\\text{ns}\\times\\ln(1.05/0.0459) = 67$ ns. Total ≈ 156 ns.' },
      { t: 58, ans: true, title: `**Answers:** SR = 40 V/µs · ΔV = 0.316 V · $t_{slew}$ = 88 ns · $R_{out}$ = 100 kΩ · $\\tau_{cl}$ = 21.4 ns · total ≈ 156 ns`, say: 'Two phases, two formulas: current-limited ramp, then exponential. Slewing usually dominates for big steps.' },
    ],
  });
}, { q: 'Tutorial 6 Q2' });

/* Quiz 1 2024-25 Q1/Q2 exactly as printed: 5-T OTA (M1, M2 on V_in1, V_in2; PMOS mirror M3 (diode), M4), tail M5 mirroring the
   diode M6, which I_1 feeds from V_DD; output on M4/M2. */
function q24aFig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 120, 760, 170);
  isrc(S, 220, 400, { label: 'I_1', left: true, len: 45 }); wire(S, [[220, 170], [220, 355]]); wire(S, [[220, 445], [220, 520]]);
  const m6 = nmos(S, 220, 570, { name: 'M6', right: true, gl: 40, nameSide: 'l' });
  const m5 = nmos(S, 520, 570, { name: 'M5', gl: 40 });
  wire(S, [[m6.gate[0], 570], [m5.gate[0], 570]]); wire(S, [[220, 535], [290, 535], [290, 570]]); dot(S, 220, 535); dot(S, 290, 570);
  gnd(S, 220, 620); gnd(S, 520, 620);
  const m3 = pmos(S, 400, 250, { name: 'M3', right: true, gl: 30, nameSide: 'l' }); const m4 = pmos(S, 640, 250, { name: 'M4', gl: 30 });
  wire(S, [[400, 170], [400, 200]]); wire(S, [[640, 170], [640, 200]]); wire(S, [[m3.gate[0], 250], [m4.gate[0], 250]]);
  wire(S, [[400, 300], [400, 380]]); wire(S, [[640, 300], [640, 380]]);
  wire(S, [[400, 330], [480, 330], [480, 250]]); dot(S, 400, 330); dot(S, 480, 250);
  dot(S, 640, 340); wire(S, [[640, 340], [740, 340]]); txt(S, 748, 347, 'V_out', { size: 21, color: C.volt, weight: 700 });
  nmos(S, 400, 430, { name: 'M1', gate: 'V_in1' }); nmos(S, 640, 430, { name: 'M2', gate: 'V_in2', right: true, nameSide: 'l' });
  wire(S, [[400, 480], [400, 500], [640, 500], [640, 480]]); dot(S, 520, 500); wire(S, [[520, 500], [520, 520]]);
  r(); return g;
}
const Q24A_CUR = { tf: 'translate(-20 60)', list: [
  [[[220, 180], [220, 610]], 'I_1', { color: C.amb, at: [140, 500] }],
  [[[400, 180], [400, 500], [512, 500]], 'I_SS/2', { color: C.cur, at: [330, 470] }],
  [[[640, 180], [640, 500], [528, 500]], 'I_SS/2', { color: C.pink, at: [710, 470] }],
  [[[520, 504], [520, 610]], 'I_SS', { color: C.ok, at: [600, 640] }],
] };
scene(L13, 'Quiz 1 2024 Q2: size the OTA from a slew rate', 60, (S) => {
  pyqFrame(S, {
    paper: 'q24aq2', tag: 'LEC 13 · QUESTION 5 OF 6', title: 'Slew rate sets the tail current', src: 'Quiz 1 2024-25 Q2 · 6 marks',
    q: 'Same 5-T OTA as Q1 ($(W/L)_5 = 15/1$ tail, mirror reference M6 = 7.5/1 carrying $I_1$; $\\lambda = 0.1$ for both types at these lengths). With $C_L = 2$ pF the slew rate is 10 V/µs. Find $I_1$, the bandwidth, the GBW and the power.', qh: 260,
    giv: 'From Q1: $\\mu_nC_{ox}$ = 100 µA/V², $(W/L)_{1,2}$ = 15/1, $V_{DD}$ = 1.8 V; λ = 0.1 V⁻¹ for the NMOS (L = 1 µm) and the PMOS (L = 2 µm).',
    tests: 'SR = $I_{SS}/C_L$ backwards, mirror ratios, bandwidth $1/(2\\pi R_{out}C_L)$ vs GBW $g_m/(2\\pi C_L)$.',
    fig: (S2) => { const g = q24aFig(S2); g.setAttribute('transform', 'translate(-20 60)'); }, currents: Q24A_CUR, // the circuit as printed
    steps: [
      { t: 7, title: 'Read the slew rate backwards: **$I_{SS} = SR\\cdot C_L$**. The tail M5 (15/1) mirrors M6 (7.5/1), so **$I_{SS} = 2I_1$**.', tex: 'I_{SS} = SR\\cdot C_L = (10\\,\\mathrm{V/\\mu s})(2\\,\\mathrm{pF}) = 20\\,\\mu\\mathrm{A},\\; I_1 = I_{SS}\\cdot\\frac{7.5}{15} = 10\\,\\mu\\mathrm{A}',
        try: { parts: [{ q: 'First: the tail current $I_{SS}$ the slew rate needs?', answer: 10e6 * 2e-12, unit: 'A', tol: 0.02, hint: ['$I_{SS} = SR\\cdot C_L$.'], how: ['$$I_{SS} = 10\\,\\mathrm{V/\\mu s}\\times2\\,\\mathrm{pF} = 20\\,\\mu\\mathrm{A}$$'] }],
          q: 'What reference current $I_1$ gives the required slew rate?', answer: ans('pyq-q24a-q2', 'i1'), unit: 'A', tol: 0.02,
          hint: ['For a 5-T OTA the slew rate is the tail current over $C_L$: use it backwards. Then the tail M5 copies M6, scaled by their W/L.', '$I_{SS} = SR\\cdot C_L,\\; \\dfrac{I_{SS}}{I_1} = \\dfrac{(W/L)_5}{(W/L)_6}$'],
          how: ['For a 5-T OTA, SR = $I_{SS}/C_L$, so (V/µs × pF = µA) $$I_{SS} = SR\\cdot C_L = 10\\,\\mathrm{V/\\mu s}\\times2\\,\\mathrm{pF} = 20\\,\\mu\\mathrm{A}$$',
            'The tail M5 (15/1) mirrors M6 (7.5/1), so it carries twice $I_1$. $$I_1 = I_{SS}\\times\\frac{7.5}{15} = \\frac{20\\,\\mu\\mathrm{A}}{2} = 10\\,\\mu\\mathrm{A}$$'] }, say: '$I_{SS} = 10\\,\\text{V/µs}\\times2\\,\\text{pF} = 20\\,\\mu$A; the tail is twice M6, so $I_1 = 10\\,\\mu$A.' },
      { t: 16, title: 'The bandwidth is the **output pole**: $R_{out} = r_{O2}\\parallel r_{O4}$, with 10 µA in each side and λ = 0.1 V⁻¹.', tex: 'r_O = \\frac{1}{\\lambda I_D} = \\frac{1}{0.1\\times10\\,\\mu\\mathrm{A}} = 1\\,\\mathrm{M\\Omega},\\; R_{out} = r_{O2}\\parallel r_{O4} = 500\\,\\mathrm{k\\Omega},\\; f_{-3dB} = \\frac{1}{2\\pi(500\\,\\mathrm{k\\Omega})(2\\,\\mathrm{pF})} = 159\\,\\mathrm{kHz}',
        try: { parts: [{ q: 'First: $r_O$ of M2 (and M4) at $I_D = I_{SS}/2$?', answer: 1 / (0.1 * 10e-6), unit: 'Ω', tol: 0.02, hint: ['$r_O = 1/(\\lambda I_D)$, λ = 0.1 V⁻¹, $I_D$ = 10 µA.'], how: ['$$r_O = \\frac{1}{0.1\\times10\\,\\mu\\mathrm{A}} = 1\\,\\mathrm{M\\Omega}$$'] }, { q: 'Next: $R_{out} = r_{O2}\\parallel r_{O4}$?', answer: 1e6 / 2, unit: 'Ω', tol: 0.02, hint: ['Two equal resistors in parallel: half.'], how: ['$$R_{out} = 1\\,\\mathrm{M\\Omega}\\parallel1\\,\\mathrm{M\\Omega} = 500\\,\\mathrm{k\\Omega}$$'] }],
          q: 'What is the −3 dB bandwidth of the OTA?', answer: ans('pyq-q24a-q2', 'bw'), unit: 'Hz', tol: 0.02,
          hint: ['The pole that matters is at the output: $R_{out}$ with $C_L$. Each side carries $I_{SS}/2$.', '$r_O = \\dfrac{1}{\\lambda I_D},\\; R_{out} = r_{O2}\\parallel r_{O4},\\; f_{-3dB} = \\dfrac{1}{2\\pi R_{out}C_L}$'],
          how: ['Each side carries half the tail ($I_{SS}$ = 20 µA from the last step). $$I_D = \\frac{I_{SS}}{2} = 10\\,\\mu\\mathrm{A}$$',
            'With λ = 0.1 V⁻¹ for both devices at these lengths: $$r_{O2} = r_{O4} = \\frac{1}{\\lambda I_D} = \\frac{1}{0.1\\times10\\,\\mu\\mathrm{A}} = 1\\,\\mathrm{M\\Omega}$$',
            'In parallel. $$R_{out} = 1\\,\\mathrm{M\\Omega}\\parallel1\\,\\mathrm{M\\Omega} = 500\\,\\mathrm{k\\Omega}$$',
            'Output pole. $$f_{-3dB} = \\frac{1}{2\\pi R_{out}C_L} = \\frac{1}{2\\pi\\times500\\,\\mathrm{k\\Omega}\\times2\\,\\mathrm{pF}} = 159\\,\\mathrm{kHz}$$'],
          calc: [{ what: 'parallel r_O and the pole in one line', keys: '1 ÷ ( 2 × [SHIFT] [7] × ( 1M [SHIFT] [^] + 1M [SHIFT] [^] ) [SHIFT] [^] × 2p ) [EXE]', shows: '159.15k', note: 'x⁻¹ is [SHIFT] [^]. ' + PFX }] }, say: '$R_{out} = 1\\,\\text{M}\\parallel1\\,\\text{M} = 500$ kΩ; $f_{-3dB} = 159$ kHz.' },
      { t: 25, title: '**GBW = $g_{m1}/(2\\pi C_L)$** ($R_{out}$ cancels), with $g_{m1}$ from the square law at 10 µA.', tex: 'g_{m1} = \\sqrt{2(100\\,\\mu)(15)(10\\,\\mu)} = 0.173\\,\\mathrm{mS},\\; GBW = \\frac{0.173\\,\\mathrm{mS}}{2\\pi(2\\,\\mathrm{pF})} = 13.8\\,\\mathrm{MHz}',
        try: { parts: [{ q: 'First: $g_{m1}$ at $I_D$ = 10 µA?', answer: Math.sqrt(2 * 100e-6 * 15 * 10e-6), unit: 'S', tol: 0.02, hint: ['$g_{m1} = \\sqrt{2\\mu_nC_{ox}(W/L)_1I_D}$.'], how: ['$$g_{m1} = \\sqrt{2\\times100\\,\\mu\\times15\\times10\\,\\mu} = 0.173\\,\\mathrm{mS}$$'] }],
          q: 'What is the gain-bandwidth product (GBW), in Hz?', answer: ans('pyq-q24a-q2', 'gbw'), unit: 'Hz', tol: 0.02,
          hint: ['GBW of a one-stage OTA uses only the input $g_m$ and $C_L$. Find $g_{m1}$ at $I_D$ = 10 µA from the square law.', '$g_{m1} = \\sqrt{2\\mu_nC_{ox}(W/L)_1I_D},\\; GBW = \\dfrac{g_{m1}}{2\\pi C_L}$'],
          how: ['Input transconductance at $I_D$ = 10 µA, with $\\mu_nC_{ox}$ = 100 µA/V² and $(W/L)_1$ = 15. $$g_{m1} = \\sqrt{2\\mu_nC_{ox}(W/L)_1I_D} = \\sqrt{2\\times100\\,\\mu\\times15\\times10\\,\\mu} = 0.173\\,\\mathrm{mS}$$',
            'Gain-bandwidth. $$GBW = \\frac{g_{m1}}{2\\pi C_L} = \\frac{0.173\\times10^{-3}}{2\\pi\\times2\\times10^{-12}} = 13.8\\,\\mathrm{MHz}$$',
            'Check: DC gain $g_{m1}R_{out}$ = 0.173 mS × 500 kΩ = 86.6, and 86.6 × 159 kHz = 13.8 MHz.'],
          calc: [{ what: 'g_m and GBW in one line', keys: '[√] 2 × 100µ × 15 × 10µ ▶ ÷ ( 2 × [SHIFT] [7] × 2p ) [EXE]', shows: '13.783M', note: '▶ leaves the square-root box before ÷.' }] }, say: 'GBW = 0.173 mS/(2π·2 pF) = 13.8 MHz — about 87 times the bandwidth, i.e. the DC gain.' },
      { t: 33, title: 'The **power** is $V_{DD}$ times every current drawn from the supply: the $I_1$ branch plus the tail.', tex: 'P = V_{DD}(I_1 + I_{SS}) = 1.8\\,\\mathrm{V}\\times(10 + 20)\\,\\mu\\mathrm{A} = 54\\,\\mu\\mathrm{W}', say: '1.8 V × 30 µA = 54 µW.' },
      { t: 39, ans: true, title: '**Answers:** $I_1 = 10\\,\\mu$A · BW = 159 kHz · GBW = 13.8 MHz · P = 54 µW', say: 'Keep bandwidth (uses $R_{out}$) and GBW (uses only $g_m$) apart — this quiz asks both.' },
    ],
  });
}, { q: 'Quiz 1 2024 Q2' });

scene(L13, 'Lab 9: specs for a two-stage buffer', 56, (S) => {
  pyqFrame(S, {
    tag: 'LEC 13 · QUESTION 6 OF 6', title: 'Gain error, rise time and slew rate as numbers', src: 'Lab 9 (hand calculations)',
    q: 'A two-stage Miller OTA as a unity-gain buffer: gain error ≤ 0.05 %, 10–90 % rise time ≤ 70 ns, SR = 5 V/µs, $C_L = 5$ pF, $C_c = 0.5C_L$. Minimum DC gain (ratio, dB), τ, the required $f_u$ and the first-stage current.', qh: 240,
    tests: 'Lec 1 error, rise time 2.2τ, τ = $1/\\omega_u$ for a buffer, and SR = $I/C$ for the capacitor the slewing current charges.',
    fig: (S2) => { const g = S2.g(); const r = S2.into(g); amp(S2, 380, 420, { w: 150, h: 150, label: 'A' }); wire(S2, [[260, 382], [380, 382]]); txt(S2, 250, 389, 'V_in', { size: 21, color: C.muted, anchor: 'end' }); wire(S2, [[530, 420], [700, 420]]); dot(S2, 620, 420); wire(S2, [[620, 420], [620, 560], [340, 560], [340, 458], [380, 458]]); txt(S2, 708, 427, 'V_out', { size: 22, color: C.volt, weight: 700 }); dot(S2, 660, 420); cap(S2, 660, 420); txt(S2, 690, 486, 'C_L', { size: 20, color: C.muted }); txt(S2, 480, 610, 'buffer: β = 1', { size: 21, color: C.amb, anchor: 'middle', weight: 700 }); r(); },
    steps: [
      { t: 6, title: 'A buffer has β = 1, so the gain error is **$1/(1 + A) \\approx 1/A$**.', tex: 'A \\ge \\frac{1}{\\varepsilon} = \\frac{1}{0.0005} = 2000\\;(66\\,\\mathrm{dB})',
        try: { q: 'What minimum DC gain $A$ (as a ratio) keeps the buffer’s gain error within 0.05 %?', answer: ans('bank-lab9', 'a'), unit: '', tol: 0.01,
          hint: ['The static error of a feedback amplifier is $1/(1 + \\beta A)$. What is β for a buffer?', '$\\varepsilon = \\dfrac{1}{1 + A} \\approx \\dfrac{1}{A} \\;\\Rightarrow\\; A \\ge \\dfrac{1}{\\varepsilon}$'],
          how: ['A unity-gain buffer feeds all of $V_{out}$ back. $$\\beta = 1$$',
            'Gain error. $$\\varepsilon = \\frac{1}{1 + \\beta A} \\approx \\frac{1}{A}$$',
            'Set ε = 0.05 % = 0.0005. $$A \\ge \\frac{1}{0.0005} = 2000$$',
            'In dB. $$20\\log_{10}2000 = 66\\,\\mathrm{dB}$$'] }, say: '$A \\ge 1/0.0005 = 2000$, i.e. 66 dB.' },
      { t: 13, title: 'The 10–90 % **rise time of a one-pole response is 2.2τ**, so τ = $t_r/2.2$.', tex: '\\tau = \\frac{t_r}{2.2} = \\frac{70\\,\\mathrm{ns}}{2.2} = 31.8\\,\\mathrm{ns}',
        try: { q: 'What closed-loop time constant τ just meets the 70 ns rise-time spec?', answer: ans('bank-lab9', 'tau'), unit: 's', tol: 0.02,
          hint: ['The 10 %–90 % rise time of a one-pole response is a fixed number of time constants.', '$t_r = \\tau\\ln 9 \\approx 2.2\\,\\tau$'],
          how: ['For a one-pole step response $$t_r = \\tau\\ln 9 \\approx 2.2\\,\\tau$$',
            'Rearrange and substitute. $$\\tau = \\frac{t_r}{2.2} = \\frac{70\\,\\mathrm{ns}}{2.2} = 31.8\\,\\mathrm{ns}$$'] }, say: 'τ = 70/2.2 = 31.8 ns.' },
      { t: 20, title: 'In a buffer (β = 1) the loop bandwidth is $\\omega_u$ itself: **τ = 1/ω_u**, so $f_u = 1/(2\\pi\\tau)$.', tex: 'f_u = \\frac{1}{2\\pi\\tau} = \\frac{1}{2\\pi(31.8\\,\\mathrm{ns})} = 5\\,\\mathrm{MHz}',
        try: { q: 'What unity-gain frequency $f_u$ (in Hz) must the op amp have?', answer: ans('bank-lab9', 'fu'), unit: 'Hz', tol: 0.02,
          hint: ['The closed-loop τ is $1/(\\beta\\omega_u)$, and β = 1 for a buffer.', '$\\tau = \\dfrac{1}{\\omega_u} \\;\\Rightarrow\\; f_u = \\dfrac{1}{2\\pi\\tau}$'],
          how: ['Closed-loop time constant of a one-pole op amp, with β = 1. $$\\tau = \\frac{1}{\\beta\\omega_u} = \\frac{1}{\\omega_u}$$',
            'So $\\omega_u = 1/\\tau$; divide by 2π for Hz, with τ = 31.8 ns from the last step. $$f_u = \\frac{1}{2\\pi\\tau} = \\frac{1}{2\\pi\\times31.8\\times10^{-9}} = 5\\,\\mathrm{MHz}$$'],
          calc: [{ what: 'rise time straight to f_u', keys: '1 ÷ ( 2 × [SHIFT] [7] × 70n ÷ 2.2 ) [EXE]', shows: '5.002M', note: PFX }] }, say: '$f_u = 1/(2\\pi\\tau) = 5$ MHz.' },
      { t: 27, title: 'In a Miller op amp the first-stage current **slews $C_c$** (Lec 17): **SR = $I_{B1}/C_c$**, with $C_c = 0.5C_L$.', tex: 'C_c = 0.5\\times5\\,\\mathrm{pF} = 2.5\\,\\mathrm{pF},\\; I_{B1} = SR\\cdot C_c = (5\\,\\mathrm{V/\\mu s})(2.5\\,\\mathrm{pF}) = 12.5\\,\\mu\\mathrm{A}',
        try: { parts: [{ q: 'First: the compensation capacitor $C_c$?', answer: 0.5 * 5e-12, unit: 'F', tol: 0.02, hint: ['$C_c = 0.5\\,C_L$ with $C_L$ = 5 pF.'], how: ['$$C_c = 0.5\\times5\\,\\mathrm{pF} = 2.5\\,\\mathrm{pF}$$'] }],
          q: 'What first-stage (tail) current $I_{B1}$ gives SR = 5 V/µs?', answer: ans('bank-lab9', 'ib1'), unit: 'A', tol: 0.02,
          hint: ['In a two-stage Miller op amp the first stage’s tail current has to charge the compensation capacitor $C_c$ while it slews. Find $C_c$ first.', '$C_c = 0.5\\,C_L,\\; SR = \\dfrac{I_{B1}}{C_c} \\;\\Rightarrow\\; I_{B1} = SR\\cdot C_c$'],
          how: ['Compensation capacitor. $$C_c = 0.5\\times5\\,\\mathrm{pF} = 2.5\\,\\mathrm{pF}$$',
            'During slewing the whole first-stage tail current flows into $C_c$. $$SR = \\frac{I_{B1}}{C_c}$$',
            'Rearrange (V/µs × pF = µA). $$I_{B1} = SR\\cdot C_c = 5\\,\\mathrm{V/\\mu s}\\times2.5\\,\\mathrm{pF} = 12.5\\,\\mu\\mathrm{A}$$'] }, say: 'Same $i = C\\,dv/dt$, but in a Miller op amp the first-stage current slews $C_c$: $I_{B1} = 5\\,\\text{V/µs}\\times2.5\\,\\text{pF} = 12.5\\,\\mu$A.' },
      { t: 34, ans: true, title: '**Answers:** A ≥ 2000 (66 dB) · τ = 31.8 ns · $f_u$ = 5 MHz · $I_{B1}$ = 12.5 µA', say: 'Each spec maps to one formula you now know.' },
    ],
  });
}, { q: 'Lab 9' });
