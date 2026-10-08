/* Lecture 7: two-stage op amps; gain boosting, the idea and the two attempts. */
'use strict';
const L7 = 'Lec 7 · Two stages & boosting';

/* the simple two-stage op amp of your Lec 7 page (circuit 1). Returns node coordinates. */
function twoStage1(S, o = {}) {
  const g = S.g();
  const r = S.into(g);
  rail(S, 300, 1310, 170);
  // stage 1: loads M3, M4 (PMOS, Vb1), pair M1, M2, tail M9
  const m3 = pmos(S, 660, 230, { name: 'M3', right: true, gl: 26 });
  const m4 = pmos(S, 940, 230, { name: 'M4', gl: 26 });
  wire(S, [[m3.gate[0], 230], [m4.gate[0], 230]]);
  txt(S, 800, 222, 'V_b1', { size: 19, color: C.muted, anchor: 'middle' });
  wire(S, [[660, 170], [660, 180]]); wire(S, [[940, 170], [940, 180]]);
  const m1 = nmos(S, 660, 420, { name: 'M1', gate: 'V_in1' });
  const m2 = nmos(S, 940, 420, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[660, 280], [660, 370]]); wire(S, [[940, 280], [940, 370]]);
  wire(S, [[660, 470], [660, 500], [940, 500], [940, 470]]);
  // o.printed: names as printed in Tutorial 3 Q2 (Razavi Fig. 9.6 problem): ideal tail I_SS, M7, M8 gates on V_b2
  if (o.printed) isrc(S, 800, 560, { label: 'I_SS', len: 50 });
  else nmos(S, 800, 560, { name: 'M9', gate: 'V_b2' });
  wire(S, [[800, 500], [800, 510]]); gnd(S, 800, 610);
  dot(S, 660, 330); dot(S, 940, 330); dot(S, 800, 500);
  txt(S, 676, 324, 'X', { size: 22, color: C.bad, weight: 750 }); txt(S, 924, 324, 'Y', { size: 22, color: C.bad, weight: 750, anchor: 'end' });
  // stage 2: PMOS CS M5, M6 with NMOS sources M7, M8
  const m5 = pmos(S, 400, 230, { name: 'M5', right: true, gl: 26, nameSide: 'l' });
  const m6 = pmos(S, 1200, 230, { name: 'M6', gl: 26, nameSide: 'r' });
  wire(S, [[400, 170], [400, 180]]); wire(S, [[1200, 170], [1200, 180]]);
  wire(S, [[m5.gate[0], 230], [520, 230], [520, 330], [660, 330]]);
  wire(S, [[m6.gate[0], 230], [1080, 230], [1080, 330], [940, 330]]);
  const m7 = nmos(S, 400, 480, { name: 'M7', gate: o.printed ? 'V_b2' : 'V_b' });
  const m8 = nmos(S, 1200, 480, { name: 'M8', gate: o.printed ? 'V_b2' : 'V_b', right: true });
  wire(S, [[400, 280], [400, 430]]); wire(S, [[1200, 280], [1200, 430]]);
  gnd(S, 400, 530); gnd(S, 1200, 530);
  dot(S, 400, 360); dot(S, 1200, 360);
  wire(S, [[400, 360], [320, 360]]); wire(S, [[1200, 360], [1280, 360]]);
  txt(S, 312, 352, 'V_out1', { size: 21, color: C.volt, weight: 700, anchor: 'end' });
  txt(S, 1288, 352, 'V_out2', { size: 21, color: C.volt, weight: 700 });
  r();
  return { g, X: [660, 330], Y: [940, 330], out1: [400, 360], out2: [1200, 360] };
}

/* a remember card over a dimmed stage (the figure behind it fades away) */
function l7Remember(S, items, t0, title) {
  const bg = S.el('rect', { x: 0, y: 100, width: 1600, height: 800, fill: C.bg });
  bg.style.opacity = 0; S.fade(bg, t0, 0.6);
  return remember(S, items, t0, title);
}

scene(L7, 'Lectures 7–12: the plan', 14, (S) => {
  titleCard(S, 'LECTURES 7 – 12', 'More gain, without losing swing', 'two stages · gain boosting · boosters · common-mode feedback', ['Lec 7 two stages', 'Lec 8 boosting', 'Lec 9 boosters', 'Lec 10 CMFB', 'Lec 11–12 sensing']);
  S.say(0.3, 'Lectures 7 to 12 answer one question: <b>how do we get a big gain and a big output swing at the same time?</b>');
  S.say(7, 'Every scene says <span class="why">why</span> we do something before <b>how</b>. Orange “your turn” stops wait for your answer.');
});

scene(L7, 'Where Lec 6 left you: gain or swing', 46, (S) => {
  header(S, 'LEC 7 · THE PROBLEM', 'A telescopic gives gain, but eats the swing');
  // column on the left
  const col = S.g();
  const r = S.into(col);
  rail(S, 250, 470, 180);
  const xs = 360;
  pmos(S, xs, 240, { name: 'M8', gate: 'V_b4' }); pmos(S, xs, 340, { name: 'M6', gate: 'V_b3' });
  nmos(S, xs, 460, { name: 'M4', gate: 'V_b2' }); nmos(S, xs, 560, { name: 'M2', gate: 'V_in' });
  isrc(S, xs, 680, { label: 'tail' });
  wire(S, [[xs, 180], [xs, 190]]); wire(S, [[xs, 290], [xs, 290]]); wire(S, [[xs, 390], [xs, 410]]); wire(S, [[xs, 510], [xs, 510]]); wire(S, [[xs, 610], [xs, 638]]);
  gnd(S, xs, 722);
  dot(S, xs, 400); wire(S, [[xs, 400], [470, 400]]); txt(S, 480, 407, 'V_out', { size: 22, color: C.volt, weight: 700 });
  r();
  S.draw(col, 0.4, 2.2);
  S.say(0.3, 'Lec 3–6 built one-stage op amps. The telescopic cascode has a huge gain, about $(g_mr_O)^2/2$ ≈ 1250 with $g_mr_O = 50$.');
  // tower beside it: blocks slide as Vout moves
  const sc = 300, yb = 760, x0 = 700;
  const tw = S.g();
  const blocks = [['tail', 0.2], ['M2', 0.2], ['M4', 0.2], ['M6', 0.2], ['M8', 0.2]];
  txt(S, x0 + 46, 150, 'its column as a tower (V_DD = 1.8 V)', { size: 21, color: C.muted, anchor: 'middle' }, tw);
  const rects = {};
  // fixed blocks: tail, M2 at bottom; M8 at top; M4 and M6 stretch with V_out
  const mk = (name, st) => { const rr = S.el('rect', { x: x0, width: 92, rx: 4, fill: TST[st][0], stroke: TST[st][1], 'stroke-width': 2 }, tw); const t = txt(S, x0 + 46, 0, name, { size: 20, color: TST[st][1], weight: 750, anchor: 'middle' }, tw); rects[name] = { rr, t }; };
  ['tail', 'M2', 'M4', 'M6', 'M8'].forEach((n) => mk(n, 'min'));
  const vo = txt(S, x0 + 120, 0, 'V_out', { size: 21, color: C.volt, weight: 700 }, tw);
  const vline = S.el('line', { x1: x0 - 10, x2: x0 + 110, stroke: C.volt, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, tw);
  S.fade(tw, 4, 0.8);
  // V_out(t): rest 1.0 V, then sweep to top (1.4) and bottom (0.6)
  const vAt = (t) => { if (t < 12) return 1.0; if (t < 17) return lerp(1.0, 1.4, E.inout(clamp((t - 12) / 4, 0, 1))); if (t < 24) return lerp(1.4, 0.6, E.inout(clamp((t - 18) / 5, 0, 1))); return lerp(0.6, 1.0, E.inout(clamp((t - 26) / 3, 0, 1))); };
  S.anim(0, 1e4, 'tw', (_p, t) => {
    const v = vAt(t);
    const lay = [['tail', 0, 0.2], ['M2', 0.2, 0.4], ['M4', 0.4, v], ['M6', v, 1.6], ['M8', 1.6, 1.8]];
    lay.forEach(([n, a, b]) => {
      const y1 = yb - b * sc, y2 = yb - a * sc;
      rects[n].rr.setAttribute('y', y1); rects[n].rr.setAttribute('height', y2 - y1);
      rects[n].t.setAttribute('y', (y1 + y2) / 2 + 7);
      const sq = b - a <= 0.2001 && (n === 'M4' || n === 'M6');
      rects[n].rr.setAttribute('fill', sq ? TST.sq[0] : (b - a > 0.21 ? TST.ok[0] : TST.min[0]));
      rects[n].rr.setAttribute('stroke', sq ? TST.sq[1] : (b - a > 0.21 ? TST.ok[1] : TST.min[1]));
      rects[n].t.setAttribute('fill', sq ? TST.sq[1] : (b - a > 0.21 ? TST.ok[1] : TST.min[1]));
    });
    vline.setAttribute('y1', yb - v * sc); vline.setAttribute('y2', yb - v * sc);
    vo.setAttribute('y', yb - v * sc + 7); vo.textContent = ''; richText(vo, `V_out = ${v.toFixed(2)} V`, 21);
  }, E.lin);
  S.say(4.2, 'Read the tower: <b>one block per transistor, its height = the voltage across it</b>. Every block needs at least its $V_{ov}$ (0.2 V).');
  S.say(12, 'Push $V_{out}$ up: the block above it (M6) shrinks until it is squeezed to 0.2 V. That is the ceiling, 1.4 V.');
  S.say(18, 'Pull $V_{out}$ down: now M4 is squeezed, at 0.6 V. Five blocks of 0.2 V leave only <b>0.8 V</b> of the 1.8 V for the output.');
  const q = whyBox(S, 1000, 300, 540, 280, '**The trade-off.** Stacking devices multiplies the gain by $g_mr_O$ each time, but **every stacked device takes a $V_{ov}$ block away from the swing**. One stage cannot be best at both.', 26);
  S.say(26.5, '<span class="why">So the question of Lecture 7:</span> can we keep the big gain and still let the output swing nearly rail to rail?');
  const a = whyBox(S, 1000, 610, 540, 150, '**Razavi’s answer:** split the jobs between **two stages**.', 36);
  S.say(36.5, 'Answer: give the two jobs to two different stages. One makes the gain, the other makes the swing.');
});

scene(L7, 'What a “stage” is', 40, (S) => {
  header(S, 'LEC 7 · BUILDING BLOCK', 'One stage = an input device + one high-resistance node');
  const g = S.g();
  const r = S.into(g);
  rail(S, 420, 760, 200);
  isrc(S, 600, 280, { label: 'load' });
  wire(S, [[600, 200], [600, 238]]);
  const m = nmos(S, 600, 470, { name: 'M1', gate: 'v_in', gl: 60 });
  wire(S, [[600, 322], [600, 420]]);
  gnd(S, 600, 520);
  dot(S, 600, 370); wire(S, [[600, 370], [730, 370]]); txt(S, 740, 378, 'v_out', { size: 24, color: C.volt, weight: 700 });
  r();
  S.draw(g, 0.3, 1.8);
  S.say(0.3, 'Strip any amplifier down to its core. An <b>input transistor</b> turns the input voltage into a current…');
  const f = S.flow([[600, 330], [600, 520]], 4, null, { speed: 70 });
  const ar = arrow(S, 660, 430, 660, 520, { color: C.cur }); S.fade(ar, 4.5, 0.5);
  label(S, 672, 486, 'g_m v_in', 4.5, { size: 24, color: C.cur, weight: 700 });
  S.say(4.5, '…a small-signal current $g_mv_{in}$. Then that current has to go somewhere: into the <b>output node</b>.');
  // R_out picture
  const rp = S.g();
  const r2 = S.into(rp);
  wire(S, [[1000, 300], [1000, 330]]);
  S.el('polygon', { points: '1000,340 1016,360 1000,380 984,360', fill: 'none', stroke: C.cur, 'stroke-width': 2.8 });
  arrow(S, 1000, 348, 1000, 374, { color: C.cur, w: 2.4, head: 9 });
  wire(S, [[1000, 390], [1000, 440]]);
  wire(S, [[1000, 300], [1180, 300]]);
  res(S, 1180, 300, 440, { label: 'R_out', lcol: C.n });
  wire(S, [[1000, 440], [1180, 440]]); gnd(S, 1090, 440);
  dot(S, 1180, 300); txt(S, 1196, 296, 'v_out', { size: 24, color: C.volt, weight: 700 });
  txt(S, 1030, 366, 'G_m v_in', { size: 22, color: C.cur, weight: 700 });
  r2();
  S.fade(rp, 10, 0.9);
  S.say(10, 'Seen from the output, every amplifier is this: a current $G_mv_{in}$ pushed into the resistance $R_{out}$ at the output node.');
  eqAt(S, 'A_v = \\frac{v_{out}}{v_{in}} = G_m\\,R_{out}', 1090, 560, 15, { size: 46 });
  S.say(15, 'So the gain is always <b>$G_m$ times $R_{out}$</b>. Keep this line: it explains everything in Lectures 7–9.');
  whyBox(S, 860, 640, 640, 170, '**A stage** = one input device + one high-resistance node. Gain = $G_m \\times R_{out}$ of that node. Every high-resistance node also makes **one pole**.', 22);
  S.say(22.5, 'A “stage” is exactly that: one input device and one high-resistance node. Each such node also carries a capacitance, so it makes one pole (it slows the amplifier down).');
  S.say(31, 'The 5-T OTA, the telescopic and the folded cascode were all <b>one</b> stage. Now we chain two of them.');
});

/* Follow the current, circuit 1 (numbers of Tutorial 3 Q2: I_SS = 1 mA, 1 mA in each stage-2 branch) */
scene(L7, 'Follow the current: two-stage op amp', 64, (S) => {
  header(S, 'LEC 7 · FOLLOW THE CURRENT', 'Circuit 1: where every milliamp goes');
  const c = twoStage1(S);
  S.draw(c.g, 0.3, 2.5);
  S.say(0.3, 'Meet circuit 1 by its currents first. Numbers from Tutorial 3 Q2: a 1 mA tail, and 1 mA in each stage-2 branch. Current always runs from $V_{DD}$ down to ground.');
  // 1. the tail sets stage 1
  current(S, [[800, 500], [800, 610]], 6, null, 'I_SS = 1 mA', { at: [950, 600] });
  S.ring(800, 500, 16, C.cur, 6, 13);
  S.say(6, 'Start at the source. The tail M9 is a current sink: it pulls $I_{SS} = 1$ mA out of node P and sends it to ground. In an NMOS the current runs drain to source: downwards.');
  // 2. the split at P
  current(S, [[660, 180], [660, 500], [790, 500]], 13, 39.4, 'I_D1 = 0.5 mA', { color: C.p, at: [745, 290] });
  current(S, [[940, 180], [940, 500], [810, 500]], 13, 39.4, 'I_D2 = 0.5 mA', { color: C.n, at: [855, 470] });
  eqAt(S, 'I_{SS} = I_{D1} + I_{D2}\\;\\Rightarrow\\; I_{D1} = I_{D2} = \\tfrac{I_{SS}}{2} = 0.5\\,\\text{mA}', 800, 700, 13, { size: 30, w: 1000 });
  S.say(13, 'Where does that 1 mA come from? Only two wires reach P: one through M1, one through M2. KCL at P: $I_{SS} = I_{D1} + I_{D2}$. Equal inputs share it equally: 0.5 mA each.');
  S.say(20, 'Each half comes down from $V_{DD}$ through a PMOS load: M3 feeds M1, M4 feeds M2. In a PMOS the current runs source to drain, so it also flows downwards. The sources set the current; the devices only share it.');
  // 3. stage 2 has its own current
  current(S, [[400, 180], [400, 530]], 27, null, 'I_D5 = 1 mA', { color: C.amb, at: [250, 290] });
  current(S, [[1200, 180], [1200, 530]], 27, null, 'I_D6 = 1 mA', { color: C.amb, at: [1350, 290] });
  S.say(27, 'Stage 2 has its <b>own</b> current, set by its own sinks M7 and M8: 1 mA from $V_{DD}$ through M5, past $V_{out1}$, down through M7. The same on the right with M6 and M8.');
  S.ring(520, 280, 18, C.volt, 33, 39);
  S.say(33, 'What flows from X into M5? Nothing: X only touches M5’s <b>gate</b>, and a gate draws no current. The stages pass a <b>voltage</b> (X sets M5’s $|V_{GS}|$), never a current.');
  S.stop(39, {
    q: 'A small differential input makes M1 carry $\\Delta I$ **more** than its 0.5 mA. The tail still pulls exactly 1 mA, and M3 still supplies exactly 0.5 mA. Where does M1’s extra $\\Delta I$ come from?',
    choices: ['The tail M9 pulls more current', 'It is drawn out of node X, so the voltage at X falls', 'It flows out of M5’s gate', 'M3 supplies the extra'],
    answer: 1,
    hint: ['List what can change: the tail is a fixed sink, M3 is a fixed source, and a gate passes no current.', 'KCL at X: $I_{D3} = I_{D1} + (\\text{current into M5’s gate})$. If $I_{D1}$ grows and nothing else can, something other than a current must give way.'],
    how: [
      'The tail is a current source: it takes $I_{SS} = 1$ mA whatever the inputs do. It cannot pull more.',
      'M3 is a current source too (its gate sits on the fixed bias $V_{b1}$), so it cannot supply more either.',
      'M5’s gate is an insulator: no current flows into or out of it.',
      'So KCL at X can only balance by the <b>voltage</b> at X changing: X falls by about $\\Delta I\\,(r_{O1}\\parallel r_{O3})$. That falling voltage is stage 1’s output signal.',
    ],
    why: 'Fixed sources fix the currents; when a device wants more than they give, the node voltage moves. That is how a current turns into a voltage (gain).',
  });
  // 4. small differential input: ±ΔI, the total stays I_SS
  current(S, [[660, 180], [660, 322]], 39.8, null, null, { color: C.p });
  current(S, [[660, 338], [660, 500], [790, 500]], 39.8, null, 'I_SS/2 + ΔI', { color: C.p, at: [775, 405] });
  current(S, [[940, 180], [940, 322]], 39.8, null, null, { color: C.n });
  current(S, [[940, 338], [940, 500], [810, 500]], 39.8, null, 'I_SS/2 − ΔI', { color: C.n, at: [825, 462] });
  const xf = chip(S, 590, 292, 'X falls', { color: C.bad, size: 17 }); xf.style.opacity = 0; S.pop(xf, 46);
  const yr = chip(S, 1012, 292, 'Y rises', { color: C.ok, size: 17 }); yr.style.opacity = 0; S.pop(yr, 46);
  eqAt(S, '\\left(\\tfrac{I_{SS}}{2} + \\Delta I\\right) + \\left(\\tfrac{I_{SS}}{2} - \\Delta I\\right) = I_{SS}', 800, 770, 39.8, { size: 30, w: 1000, color: '#ffd38a' });
  S.say(39.8, 'Now a small differential input. M1 carries $\\Delta I$ more, M2 $\\Delta I$ less. The tail total stays 1 mA: what one side gains, the other side loses.');
  S.say(46, 'M3 and M4 do not change, so M1’s extra $\\Delta I$ is pulled out of node X and X falls, while Y gets $\\Delta I$ extra and rises. Those voltage swings are the signal that stage 2 amplifies.');
  S.stop(53, {
    q: 'With no input signal, how much DC current does the whole op amp draw from $V_{DD}$? (Tutorial 3 Q2: $I_{SS} = 1$ mA, $I_{D5} = I_{D6} = 1$ mA.)',
    answer: 3e-3, unit: 'A', tol: 0.02,
    hint: ['Count every branch that starts on the $V_{DD}$ rail. Gates take nothing, so no current crosses between the stages.', '$I_{VDD} = I_{D3} + I_{D4} + I_{D5} + I_{D6}$, with $I_{D3} = I_{D4} = I_{SS}/2$.'],
    how: [
      'Stage 1 takes from $V_{DD}$ exactly what its tail sinks, through M3 and M4: $$I_{D3} + I_{D4} = \\tfrac{I_{SS}}{2} + \\tfrac{I_{SS}}{2} = 0.5 + 0.5 = 1\\,\\text{mA}$$',
      'Stage 2 has two branches of its own, set by M7 and M8: $$I_{D5} + I_{D6} = 1 + 1 = 2\\,\\text{mA}$$',
      'Add the branches on the rail: $$I_{VDD} = 1 + 2 = 3\\,\\text{mA}$$',
    ],
    why: 'Supply current = the sum of the branches hanging from $V_{DD}$. Power = $V_{DD}\\times I_{VDD}$ = 3 V × 3 mA = 9 mW.',
  });
  l7Remember(S, [
    'Current flows **down**, $V_{DD}$ to ground: NMOS drain → source, PMOS source → drain. Current never “chooses”: the **sources set it**, the devices share it.',
    'The **tail sets** stage 1. KCL at P: $I_{SS} = I_{D1} + I_{D2}$; equal inputs ⇒ $I_{SS}/2$ each, supplied by M3 and M4.',
    'Stage 2 runs on **its own** current (M7, M8 set it). Nothing flows from X into M5: a gate takes no current.',
    'Small input: $\\pm\\Delta I$ in M1, M2, the total stays $I_{SS}$. The fixed loads cannot follow, so X and Y move: that is the signal.',
    'Supply current = the branches on the rail: $I_{SS} + I_{D5} + I_{D6}$.',
  ], 53.4, 'Currents in circuit 1');
  S.say(53.4, 'The current rules of circuit 1 on one card. Next, the same circuit read for gain.');
});

scene(L7, 'The two-stage op amp (circuit 1)', 66, (S) => {
  header(S, 'LEC 7 · YOUR PAGE, CIRCUIT 1', 'Stage 1 for gain, stage 2 for swing');
  const c = twoStage1(S);
  S.draw(c.g, 0.4, 3);
  S.say(0.4, 'Your first circuit. In the middle: a differential pair M1, M2 with PMOS current-source loads M3, M4 and tail M9 — the familiar one-stage amplifier.');
  S.halo(560, 150, 480, 500, C.red, 5, null, 'A₁ · stage 1');
  S.say(5, 'That middle part is <b>stage 1</b> (your red loop). Its outputs are nodes X and Y.');
  eqAt(S, 'A_1 = g_{m1,2}\\,(r_{O1,2}\\parallel r_{O3,4})', 800, 712, 9, { size: 36 });
  S.say(9, 'Its gain: the pair’s $g_m$ times the resistance at X, which is $r_{O1}$ looking down in parallel with $r_{O3}$ looking up.');
  S.halo(270, 150, 250, 450, C.green, 16, null, 'A₂');
  S.halo(1080, 150, 250, 450, C.green, 16, null, 'A₂');
  S.say(16, 'Now the new part (green loops). X drives the gate of <b>M5</b>, a PMOS common-source device with an NMOS current source M7 below it. Same on the right with M6, M8.');
  S.say(23, 'That is <b>stage 2</b>: one transistor and one current source between the rails. Its output is $V_{out1}$ (and $V_{out2}$).');
  eqAt(S, 'A_2 = g_{m5,6}\\,(r_{O5,6}\\parallel r_{O7,8})', 800, 770, 27, { size: 36 });
  S.say(27, 'Stage 2’s gain is read the same way: $g_{m5}$ times $r_{O5}$ in parallel with $r_{O7}$. Only about $g_mr_O/2$ — modest.');
  eqAt(S, 'A = A_1 \\times A_2', 800, 835, 33, { size: 40, color: '#ffd38a' });
  S.say(33, 'Two stages in a chain: stage 1 amplifies by $A_1$, then stage 2 amplifies that again by $A_2$. <b>Gains multiply</b>: $A = A_1A_2$.');
  S.flow([[660, 380], [660, 330], [520, 330], [520, 230], [470, 230]], 40, null, { color: C.volt, speed: 50 });
  S.flow([[400, 280], [400, 360], [320, 360]], 41, null, { color: C.volt, speed: 50 });
  S.say(40, 'Follow a signal: a tiny $v_{in}$ becomes $A_1v_{in}$ at X, which is M5’s gate, and stage 2 multiplies it again at $V_{out1}$.');
  const sw = html(S, 1340, 600, 236, 230, `<div class="whybox" style="font-size:18px">${rt('With $g_mr_O = 50$:<br>$A_1 ≈ 25$, $A_2 ≈ 25$<br>**$A ≈ 625$**, and the output column has only two devices.')}</div>`);
  sw.style.opacity = 0; S.slideIn(sw, 48, 0.7);
  S.say(48, 'With $g_mr_O = 50$ each stage gives about 25, so the whole op amp gives about 625 — and the output still sits in a two-device column.');
  S.say(57, '<span class="why">Why this matters:</span> the gain came from multiplying stages, not from stacking devices in the output column.');
});

scene(L7, 'Why stage 2 can swing (and why gain comes first)', 52, (S) => {
  header(S, 'LEC 7 · WHY IT WORKS', 'Count the blocks in each output column');
  const sc = 300, yb = 760;
  txt(S, 380, 160, 'telescopic output column', { size: 22, color: C.muted, anchor: 'middle' });
  const a = tower(S, 334, yb, [{ v: 0.2, name: 'tail' }, { v: 0.2, name: 'M2' }, { v: 0.2, name: 'M4' }, { v: 0.8, name: 'room', st: 'room', note: '0.8 V' }, { v: 0.2, name: 'M6' }, { v: 0.2, name: 'M8' }], sc, { nodes: ['0', '', '', '0.6', '1.4', '', '1.8'] });
  S.fade(a, 0.3, 0.8);
  txt(S, 760, 160, 'stage 2: a CS stage', { size: 22, color: C.muted, anchor: 'middle' });
  const b = tower(S, 714, yb, [{ v: 0.2, name: 'M7' }, { v: 1.4, name: 'room', st: 'room', note: '1.4 V' }, { v: 0.2, name: 'M5' }], sc, { nodes: ['0', '0.2', '1.6', '1.8'] });
  S.fade(b, 5, 0.8);
  S.say(0.3, 'Same 1.8 V supply, same 0.2 V per block. The telescopic output column holds <b>five</b> blocks: only 0.8 V is left for the output.');
  S.say(5, 'Stage 2 is a common-source stage: <b>two</b> blocks, one device to each rail. Its output can swing 1.4 V, from 0.2 V to 1.6 V.');
  S.say(11, '<span class="why">That is the whole trick:</span> the output that has to swing far sits in a short column, so it gets almost the full supply.');
  // block diagram from the page
  const bd = S.g();
  const r = S.into(bd);
  wire(S, [[960, 330], [1040, 330]]); txt(S, 950, 338, 'V_in', { size: 22, color: C.muted, anchor: 'end' });
  S.el('rect', { x: 1040, y: 280, width: 210, height: 100, rx: 12, fill: 'rgba(248,113,113,0.08)', stroke: C.red, 'stroke-width': 2.4 });
  txt(S, 1145, 322, 'High-gain', { size: 22, color: C.red, weight: 700, anchor: 'middle' }); txt(S, 1145, 352, 'amplifier', { size: 22, color: C.red, weight: 700, anchor: 'middle' });
  wire(S, [[1250, 330], [1310, 330]]);
  S.el('rect', { x: 1310, y: 280, width: 210, height: 100, rx: 12, fill: 'rgba(74,222,128,0.08)', stroke: C.green, 'stroke-width': 2.4 });
  txt(S, 1415, 322, 'High-swing', { size: 22, color: C.green, weight: 700, anchor: 'middle' }); txt(S, 1415, 352, 'amplifier', { size: 22, color: C.green, weight: 700, anchor: 'middle' });
  wire(S, [[1520, 330], [1570, 330]]); txt(S, 1560, 310, 'V_out', { size: 22, color: C.volt, weight: 700, anchor: 'end' });
  r();
  S.fade(bd, 17, 0.8);
  S.say(17, 'Your page draws it as two blocks: a <b>high-gain amplifier</b> followed by a <b>high-swing amplifier</b>.');
  // signal sizes
  const s1 = sine(S, 1060, 1230, 470, 6, { color: C.volt, cycles: 2 }); S.draw(s1, 24, 1.2);
  const s2 = sine(S, 1330, 1500, 470, 60, { color: C.volt, cycles: 2 }); S.draw(s2, 26, 1.2);
  label(S, 1145, 560, 'stage-1 output: a few mV', 24, { size: 19, color: C.red, anchor: 'middle' });
  label(S, 1415, 560, 'final output: about 1 V', 26, { size: 19, color: C.green, anchor: 'middle' });
  S.say(24, '<span class="why">Why this order?</span> The big signal only exists at the final output. Stage 1’s output moves by just $V_{out}/A_2$ — a few millivolts…');
  S.say(31, '…so stage 1 can afford a tall, cramped stack of cascodes (lots of gain, little room). Stage 2 gets the short column because it must make the big swing.');
  whyBox(S, 960, 610, 600, 190, '**Rule:** put the gain where the signal is small, and the swing where the signal is big. Swap the stages and the cramped stage would have to make the big swing.', 38);
  S.say(38, 'Swap them, and the cramped stage would have to make the big swing — exactly what we were trying to avoid.');
});

/* circuit 2: telescopic first stage + PMOS CS second stage */
function twoStage2(S, o = {}) {
  const g = S.g(); const r = S.into(g);
  rail(S, 300, 1310, 160);
  const L = 660, R = 940;
  const m7 = pmos(S, L, 220, { name: 'M7', right: true, gl: 26 }); const m8 = pmos(S, R, 220, { name: 'M8', gl: 26 });
  wire(S, [[m7.gate[0], 220], [m8.gate[0], 220]]); txt(S, 800, 212, 'V_b3', { size: 18, color: C.muted, anchor: 'middle' });
  const m5 = pmos(S, L, 320, { name: 'M5', right: true, gl: 26 }); const m6 = pmos(S, R, 320, { name: 'M6', gl: 26 });
  wire(S, [[m5.gate[0], 320], [m6.gate[0], 320]]); txt(S, 800, 312, 'V_b2', { size: 18, color: C.muted, anchor: 'middle' });
  const m3 = nmos(S, L, 460, { name: 'M3', right: true, gl: 26 }); const m4 = nmos(S, R, 460, { name: 'M4', gl: 26 });
  wire(S, [[m3.gate[0], 460], [m4.gate[0], 460]]); txt(S, 800, 452, 'V_b1', { size: 18, color: C.muted, anchor: 'middle' });
  const m1 = nmos(S, L, 570, { name: 'M1', gate: 'V_in1' }); const m2 = nmos(S, R, 570, { name: 'M2', gate: 'V_in2', right: true });
  [[L, 160, 170], [R, 160, 170], [L, 370, 410], [R, 370, 410], [L, 510, 520], [R, 510, 520]].forEach(([x, a, b]) => wire(S, [[x, a], [x, b]]));
  wire(S, [[L, 620], [L, 650], [R, 650], [R, 620]]);
  isrc(S, 800, 700, { label: 'I_SS', len: 50 }); wire(S, [[800, 650], [800, 650]]); gnd(S, 800, 750);
  dot(S, L, 390); dot(S, R, 390);
  txt(S, L - 14, 384, 'X', { size: 22, color: C.bad, weight: 750, anchor: 'end' }); txt(S, R + 14, 384, 'Y', { size: 22, color: C.bad, weight: 750 });
  // stage 2
  const m9 = pmos(S, 400, 390, { name: 'M9', right: true, gl: 40, nameSide: 'l' });
  const m10 = pmos(S, 1200, 390, { name: 'M10', gl: 40, nameSide: 'r' });
  wire(S, [[400, 160], [400, 340]]); wire(S, [[1200, 160], [1200, 340]]);
  wire(S, [[m9.gate[0], 390], [L, 390]]); wire(S, [[m10.gate[0], 390], [R, 390]]);
  if (o.single) {
    const a = nmos(S, 400, 640, { name: 'M11', right: true, gl: 30, nameSide: 'l' }); const b = nmos(S, 1200, 640, { name: 'M12', gl: 30 });
    wire(S, [[400, 440], [400, 590]]); wire(S, [[1200, 440], [1200, 590]]);
    wire(S, [[400, 560], [470, 560], [470, 640]]); dot(S, 400, 560); dot(S, 470, 640);
    wire(S, [[a.gate[0], 640], [470, 640], [470, 800], [1130, 800], [1130, 640], [b.gate[0], 640]]);
    gnd(S, 400, 690); gnd(S, 1200, 690);
    dot(S, 1200, 510); wire(S, [[1200, 510], [1280, 510]]); txt(S, 1288, 517, 'V_out', { size: 22, color: C.volt, weight: 700 });
  } else {
    const m11 = nmos(S, 400, 620, { name: 'M11', gate: 'V_b4' }); const m12 = nmos(S, 1200, 620, { name: 'M12', gate: 'V_b4', right: true });
    wire(S, [[400, 440], [400, 570]]); wire(S, [[1200, 440], [1200, 570]]); gnd(S, 400, 670); gnd(S, 1200, 670);
    dot(S, 400, 510); dot(S, 1200, 510);
    wire(S, [[400, 510], [320, 510]]); wire(S, [[1200, 510], [1280, 510]]);
    txt(S, 312, 502, 'V_out1', { size: 21, color: C.volt, weight: 700, anchor: 'end' }); txt(S, 1288, 502, 'V_out2', { size: 21, color: C.volt, weight: 700 });
  }
  r();
  return { g };
}

/* Follow the current, circuit 2 (numbers of Tutorial 3 Q3: I_SS = 1 mA, 0.5 mA in each stage-2 branch) */
scene(L7, 'Follow the current: telescopic + CS', 64, (S) => {
  header(S, 'LEC 7 · FOLLOW THE CURRENT', 'Circuit 2: one current per column, one split at P');
  const c = twoStage2(S);
  S.draw(c.g, 0.3, 2.5);
  S.say(0.3, 'Circuit 2 is a telescopic first stage and a common-source second stage. Follow its currents with the Tutorial 3 Q3 numbers: a 1 mA tail, 0.5 mA in each stage-2 branch.');
  current(S, [[800, 650], [800, 750]], 5, null, 'I_SS = 1 mA', { at: [970, 716] });
  S.say(5, 'Start at the tail source: it pulls $I_{SS} = 1$ mA out of node P, down to ground.');
  current(S, [[660, 170], [660, 650], [790, 650]], 11, 41.4, 'I_D1 = 0.5 mA', { color: C.p, at: [800, 525] });
  current(S, [[940, 170], [940, 650], [810, 650]], 11, 41.4, 'I_D2 = 0.5 mA', { color: C.n, at: [800, 612] });
  eqAt(S, 'I_{SS} = I_{D1} + I_{D2} = 0.5 + 0.5 = 1\\,\\text{mA}', 330, 790, 11, { size: 28, w: 560 });
  S.say(11, 'Only two wires reach P. KCL at P: $I_{SS} = I_{D1} + I_{D2}$, so with equal inputs each side carries 0.5 mA.');
  S.say(17, 'Now follow the left side upwards: M1’s 0.5 mA comes through M3, which gets it through M5, which gets it from M7. A telescopic column has <b>no side exit</b>: one current through four devices in series.');
  S.say(25, 'Directions: in the PMOS M7 and M5 the current runs source to drain, in the NMOS M3 and M1 drain to source. Both are <b>downwards</b>, from $V_{DD}$ to ground.');
  current(S, [[400, 170], [400, 670]], 30, null, 'I_D9 = 0.5 mA', { color: C.amb, at: [250, 440] });
  current(S, [[1200, 170], [1200, 670]], 30, null, 'I_D10 = 0.5 mA', { color: C.amb, at: [1350, 440] });
  S.say(30, 'Stage 2 runs its own 0.5 mA per side, set by the sinks M11 and M12, through M9 and M10. X only touches M9’s gate, so no current crosses from stage 1 to stage 2.');
  S.stop(36, {
    q: 'In the left column of stage 1 (M7, M5, M3, M1), which device carries the most DC current?',
    choices: ['M7, because it is nearest $V_{DD}$', 'M1, because it is the input device', 'All four carry the same 0.5 mA', 'M3 and M5 carry 0.25 mA each'],
    answer: 2,
    hint: ['Look for a node in the column where a third wire could take current in or out.', 'The only extra wire is at X, and it ends on M9’s <b>gate</b>. Apply KCL at every node of the column: in = out.'],
    how: [
      'Walk down the column node by node: M7–M5, then X (M5–M3), then M3–M1. At each node KCL says: current in = current out.',
      'The only extra wire leaves at X, and it goes to M9’s <b>gate</b>, which takes no current.',
      'So one current flows through all four devices: $$I_{D7} = I_{D5} = I_{D3} = I_{D1} = \\tfrac{I_{SS}}{2} = 0.5\\,\\text{mA}$$',
      '“Nearest $V_{DD}$” and “input device” change nothing: devices in series share one current.',
    ],
    why: 'Telescopic = devices stacked in series: one current per column. The only split is at the tail node P.',
  });
  S.say(36.4, 'Right: one current per column. In a telescopic stage the current can leave a column only at P.');
  // small differential input
  current(S, [[660, 170], [660, 380]], 41.8, null, null, { color: C.p });
  current(S, [[660, 400], [660, 650], [790, 650]], 41.8, null, 'I_SS/2 + ΔI', { color: C.p, at: [800, 525] });
  current(S, [[940, 170], [940, 380]], 41.8, null, null, { color: C.n });
  current(S, [[940, 400], [940, 650], [810, 650]], 41.8, null, 'I_SS/2 − ΔI', { color: C.n, at: [800, 612] });
  eqAt(S, '\\left(\\tfrac{I_{SS}}{2} + \\Delta I\\right) + \\left(\\tfrac{I_{SS}}{2} - \\Delta I\\right) = I_{SS}', 1260, 790, 41.8, { size: 28, w: 600, color: '#ffd38a' });
  const xf = chip(S, 590, 352, 'X falls', { color: C.bad, size: 17 }); xf.style.opacity = 0; S.pop(xf, 48);
  const yr = chip(S, 1012, 352, 'Y rises', { color: C.ok, size: 17 }); yr.style.opacity = 0; S.pop(yr, 48);
  S.say(41.8, 'A small differential input: M1 takes $\\Delta I$ more, M2 $\\Delta I$ less, the total stays 1 mA. The cascode M3 passes M1’s change straight up to X: the same current in as out.');
  S.say(48, 'But M5 and M7 above X are fixed sources, so the extra $\\Delta I$ comes out of node X: X falls and Y rises. That is stage 1’s output signal, which M9 and M10 then amplify.');
  S.stop(54, {
    q: 'With no input signal, how much DC current does circuit 2 draw from $V_{DD}$ in total? ($I_{SS} = 1$ mA, $I_{D9} = I_{D10} = 0.5$ mA.)',
    answer: 2e-3, unit: 'A', tol: 0.02,
    hint: ['Count the columns that start on the $V_{DD}$ rail: two in stage 1 (M7, M8) and two in stage 2 (M9, M10).', '$I_{VDD} = I_{D7} + I_{D8} + I_{D9} + I_{D10}$, and each stage-1 column carries $I_{SS}/2$.'],
    how: [
      'Stage 1: each column carries half the tail current, so together $$I_{D7} + I_{D8} = \\tfrac{I_{SS}}{2} + \\tfrac{I_{SS}}{2} = 0.5 + 0.5 = 1\\,\\text{mA}$$',
      'Stage 2: its own two branches, set by M11 and M12: $$I_{D9} + I_{D10} = 0.5 + 0.5 = 1\\,\\text{mA}$$',
      'Add the branches on the rail (gates pass nothing between the stages): $$I_{VDD} = 1 + 1 = 2\\,\\text{mA}$$',
    ],
    why: 'Stacking cascodes costs no extra current: the telescopic stage still draws only $I_{SS}$.',
  });
  l7Remember(S, [
    'Telescopic column = devices **in series**: one current through M7, M5, M3, M1. No side exits (the wire at X goes to a gate).',
    'The only split is at P: $I_{SS} = I_{D1} + I_{D2}$, $I_{SS}/2$ each at balance.',
    'Directions: PMOS source → drain, NMOS drain → source, both **downwards**.',
    'Stage 2 (M9–M12) runs on its own current, set by M11, M12.',
    'Small input: $\\pm\\Delta I$, the cascodes pass it up unchanged, the fixed PMOS sources cannot, so X and Y move.',
    'Cascoding costs headroom, not current: supply current $= I_{SS} + I_{D9} + I_{D10}$.',
  ], 54.4, 'Currents in circuit 2');
  S.say(54.4, 'The current rules of circuit 2. Next, the same circuit read for gain.');
});

scene(L7, 'Telescopic first stage + CS second stage (circuit 2)', 70, (S) => {
  header(S, 'LEC 7 · YOUR PAGE, CIRCUIT 2', 'Make stage 1 a telescopic: even more gain');
  const c = twoStage2(S);
  S.draw(c.g, 0.3, 3);
  S.say(0.3, 'Your second circuit. The middle is now a full <b>telescopic cascode</b> (M1–M8): input pair, NMOS cascodes M3, M4, PMOS cascodes M5, M6 and PMOS sources M7, M8.');
  S.halo(540, 140, 520, 640, C.red, 6, null, 'stage 1 (gain)');
  S.halo(290, 300, 220, 420, C.green, 9, null, 'stage 2');
  S.halo(1090, 300, 220, 420, C.green, 9, null, 'stage 2');
  S.say(6, 'Stage 1’s outputs X and Y drive the gates of <b>M9, M10</b>: PMOS common-source devices loaded by NMOS current sources M11, M12. That is stage 2.');
  // look up / look down at X
  const up = arrow(S, 588, 360, 588, 190, { color: C.p }); S.fade(up, 14, 0.5); S.out(up, 30, 0.5);
  const dn = arrow(S, 588, 396, 588, 560, { color: C.n }); S.fade(dn, 17, 0.5); S.out(dn, 30, 0.5);
  const cu = chip(S, 470, 752, '↑ look up from X: g_m5 r_O5 r_O7', { color: C.p, size: 19 }); cu.style.opacity = 0; S.pop(cu, 14); S.out(cu, 30, 0.5);
  const cd = chip(S, 1130, 752, '↓ look down from X: g_m3 r_O3 r_O1', { color: C.n, size: 19 }); cd.style.opacity = 0; S.pop(cd, 17); S.out(cd, 30, 0.5);
  S.say(14, 'Gain of stage 1, the usual two looks from X: looking <b>up</b> you see the PMOS cascode, $g_{m5}r_{O5}r_{O7}$…');
  S.say(17, '…looking <b>down</b> you see the NMOS cascode, $g_{m3}r_{O3}r_{O1}$. The input current $g_{m1}v_{in}$ meets the two in parallel.');
  eqAt(S, 'A_1 = g_{m1}\\left[g_{m5}r_{O5}r_{O7}\\parallel g_{m3}r_{O3}r_{O1}\\right]', 800, 812, 21, { size: 32 });
  eqAt(S, 'A_2 = g_{m9}(r_{O9}\\parallel r_{O11})', 800, 860, 26, { size: 32 });
  S.say(26, 'Stage 2 is read the same way: $A_2 = g_{m9}(r_{O9}\\parallel r_{O11})$. With $g_mr_O = 50$: $A_1 ≈ 1250$, $A_2 ≈ 25$, so $A ≈ 31\\,000$.');
  // the link that sets X
  const lk = S.g();
  wire(S, [[400, 175], [470, 175], [470, 375]], { color: C.volt, w: 2.6, dash: '7 6' }, lk);
  arrow(S, 470, 360, 470, 386, { color: C.volt, w: 2.6, head: 10 }, lk);
  S.fade(lk, 33, 0.6); S.out(lk, 58, 0.5);
  const lb = chip(S, 300, 120, 'X = V_DD − |V_GS9|  (a link)', { color: C.volt, size: 20 }); lb.style.opacity = 0; S.pop(lb, 34); S.out(lb, 58, 0.5);
  S.ring(660, 390, 18, C.volt, 33, 58);
  S.say(33, '<span class="why">A detail the tutorials ask (Tutorial 3 Q2, Q3):</span> what DC voltage sits at X? X is <b>M9’s gate</b>, and M9’s source is $V_{DD}$.');
  S.say(40, 'M9 carries a fixed current, so its $|V_{GS9}|$ is fixed. That is a <b>link</b>: $X = V_{DD} - |V_{GS9}|$. Stage 2 decides where stage 1’s output sits.');
  S.say(48, 'Then check stage 1 still fits at that level: the devices between X and the rails must each keep their $V_{ov}$ block.');
  S.say(56, 'Next: what does chaining two high-resistance nodes cost us?');
});

scene(L7, 'The price: two poles', 42, (S) => {
  header(S, 'LEC 7 · YOUR BODE SKETCH', 'Every high-resistance node adds a pole');
  const x0 = 260, y0 = 640;
  const ax = axes(S, x0, y0, 900, 470, { x: 'log ω', y: '|A| (dB)' }); S.fade(ax, 0.3, 0.6);
  const zero = S.el('line', { x1: x0, y1: 520, x2: x0 + 880, y2: 520, stroke: C.dim, 'stroke-width': 1.6, 'stroke-dasharray': '5 6' });
  label(S, x0 + 890, 526, '0 dB (gain 1)', 0.8, { size: 18, color: C.muted, anchor: 'end' });
  const one = curve(S, (x) => (x < 520 ? 300 : 300 + (x - 520) * 0.62), x0, x0 + 840, { color: C.volt });
  S.draw(one, 3, 1.6);
  label(S, 300, 336, 'one stage: one pole, −20 dB/dec', 3, { size: 20, color: C.volt });
  const two = curve(S, (x) => (x < 520 ? 230 : x < 720 ? 230 + (x - 520) * 0.62 : 230 + 200 * 0.62 + (x - 720) * 1.24), x0, x0 + 840, { color: C.green });
  S.draw(two, 9, 1.8);
  label(S, 300, 214, 'two stages: higher DC gain, then −40 dB/dec', 9, { size: 20, color: C.green });
  S.say(0.3, 'Your page sketches two Bode plots. Gain in dB against frequency.');
  S.say(3, 'One stage: one high-resistance node, so <b>one pole</b>. Past it the gain falls at 20 dB per decade, and the phase lag stops at 90°.');
  S.say(9, 'Two stages: X and $V_{out}$ are both high-resistance nodes, each with its capacitance. The DC gain is higher, but there are <b>two poles</b>: −20, then −40 dB/decade.');
  const ph = whyBox(S, 1180, 200, 380, 300, '**Each pole adds up to 90° of phase lag.** Two poles can approach **180°** — and an amplifier with 180° lag inside a feedback loop can oscillate.', 17);
  S.say(17, '<span class="why">Why it matters:</span> each pole adds up to 90° of lag. With two, the lag heads to 180° before the gain drops to 1 — inside a feedback loop that rings or oscillates.');
  whyBox(S, 1180, 530, 380, 200, 'Fix (Lec 16–17): **compensation** — a capacitor across stage 2 that splits the poles apart.', 27);
  S.say(27, 'So two-stage op amps always need <b>compensation</b> (Lec 17). For now remember: more gain and more swing, paid for with a second pole.');
});

/* Follow the current, circuit 3 (single-ended: diode M11 + mirror M12) */
scene(L7, 'Follow the current: single-ended mirror version', 46, (S) => {
  header(S, 'LEC 7 · FOLLOW THE CURRENT', 'Circuit 3: a mirror copies the left branch to the right');
  const c = twoStage2(S, { single: true });
  S.draw(c.g, 0.3, 2.5);
  S.say(0.3, 'Circuit 3 is circuit 2 with one output. Stage 1 is unchanged: the tail’s 1 mA splits at P into 0.5 mA per column.');
  current(S, [[800, 650], [800, 750]], 3, null, 'I_SS = 1 mA', { at: [970, 716] });
  current(S, [[660, 170], [660, 650], [790, 650]], 3, null, 'I_SS/2', { color: C.p, at: [800, 525] });
  current(S, [[940, 170], [940, 650], [810, 650]], 3, null, 'I_SS/2', { color: C.n, at: [800, 612] });
  // the left CS branch feeds the diode
  current(S, [[400, 170], [400, 690]], 9, null, 'I_D9 = 0.5 mA', { color: C.amb, at: [250, 470] });
  S.ring(400, 560, 16, C.amb, 9, 22);
  S.say(9, 'Stage 2, left: M9 sends its 0.5 mA down into M11. M11 is a <b>diode</b> (gate tied to drain), so it turns that current into a gate voltage.');
  current(S, [[1200, 515], [1200, 690]], 15, null, 'I_D12 = 0.5 mA (copy)', { color: C.pink, at: [1400, 582] });
  S.say(15, 'M12 shares M11’s gate and source, so it <b>copies</b> the current: 0.5 mA pulled down out of the output node. The mirror sets the right branch; the gate wire itself carries nothing.');
  current(S, [[1200, 170], [1200, 505]], 21, null, 'I_D10 = 0.5 mA', { color: C.volt, at: [1350, 300] });
  const kc = chip(S, 1420, 450, 'KCL at V_out: in = out', { color: C.volt, size: 17 }); kc.style.opacity = 0; S.pop(kc, 21);
  S.say(21, 'From above, M10 pushes its 0.5 mA into the output node. KCL at $V_{out}$: 0.5 mA in from M10, 0.5 mA out through M12. Balanced, so $V_{out}$ sits still.');
  S.stop(28, {
    q: 'A small input makes X fall and Y rise. Then M9 carries $i$ **more** and M10 carries $i$ **less**. What net current leaves the output node $V_{out}$?',
    choices: ['None: the two changes cancel', '$i$ out of $V_{out}$', '$2i$ out of $V_{out}$, so $V_{out}$ falls', '$2i$ into $V_{out}$, so $V_{out}$ rises'],
    answer: 2,
    hint: ['Follow M9’s extra $i$: it goes into the diode M11, and M12 copies whatever M11 carries.', 'KCL at $V_{out}$: net out = $I_{D12} - I_{D10}$.'],
    how: [
      'M9’s extra $i$ flows into the diode M11, and the mirror M12 copies it: $$I_{D12} = 0.5\\,\\text{mA} + i \\quad\\text{(pulled out of } V_{out})$$',
      'M10 is driven the opposite way (Y rose): $$I_{D10} = 0.5\\,\\text{mA} - i \\quad\\text{(pushed into } V_{out})$$',
      'KCL at the output: $$I_{out} = I_{D12} - I_{D10} = (0.5 + i) - (0.5 - i) = 2i$$ flowing out, so $V_{out}$ falls.',
      '“They cancel” is the tempting mistake: the mirror flips the left change to the right side, so the two halves <b>add</b>.',
    ],
    why: 'Mirror rule: the diode turns a current into a gate voltage, the mirror copies it; at the output node the two halves add.',
  });
  const net = chip(S, 1420, 660, 'net 2i out: V_out falls', { color: C.bad, size: 17 }); net.style.opacity = 0; S.pop(net, 28.4);
  S.say(28.4, 'The halves add: $2i$ leaves the output node, so $V_{out}$ falls. One output, but nothing of the signal is wasted.');
  S.stop(35, {
    q: 'Suppose M12 were drawn **twice as wide** as M11 (same L), with $I_{D9} = I_{D10} = 0.5$ mA. How much current would M12 try to sink?',
    answer: 1e-3, unit: 'A', tol: 0.02,
    hint: ['M11 and M12 have the same $V_{GS}$, so their currents scale with $W/L$.', '$I_{D12} = \\dfrac{(W/L)_{12}}{(W/L)_{11}}\\,I_{D11}$, and $I_{D11} = I_{D9}$.'],
    how: [
      'M11 carries everything M9 sends down: $I_{D11} = I_{D9} = 0.5$ mA (no other wire leaves that node except gates).',
      'Same $V_{GS}$ on both mirror devices, so the current scales with the size ratio: $$I_{D12} = \\frac{(W/L)_{12}}{(W/L)_{11}}\\,I_{D11} = 2\\times0.5 = 1\\,\\text{mA}$$',
      'M10 can only give 0.5 mA, so KCL at $V_{out}$ fails: the output would crash to the bottom rail. That is why M12 must match M11 here.',
    ],
    why: 'A mirror copies current × (size ratio). At an output node the copy must match what the other side supplies.',
  });
  l7Remember(S, [
    'Stage 1 unchanged: $I_{SS}$ splits at P, $I_{SS}/2$ per column.',
    'Left CS branch: M9’s current flows into the **diode M11**, which turns it into a gate voltage.',
    '**M12 copies** M11’s current (× size ratio). The shared gate wire carries no current.',
    'KCL at $V_{out}$: $I_{D10}$ in $= I_{D12}$ out at balance.',
    'Signal: M12 pulls $(0.5 + i)$, M10 gives $(0.5 - i)$: **$2i$ net**, the halves add.',
  ], 35.4, 'Currents in circuit 3');
  S.say(35.4, 'The current rules of the mirror version. Next, the same idea in the signal picture.');
});

scene(L7, 'One output: the mirror trick (circuit 3)', 50, (S) => {
  header(S, 'LEC 7 · YOUR PAGE, CIRCUIT 3', 'Single-ended output: M11 becomes a diode, M12 copies it');
  const c = twoStage2(S, { single: true });
  S.draw(c.g, 0.2, 2.5);
  S.say(0.2, 'Same op amp, but now we want <b>one</b> output instead of two.');
  S.ring(400, 560, 16, C.amb, 4.5, 12); S.ring(1200, 640, 16, C.amb, 4.5, 12);
  S.say(4.5, 'M11 becomes a <b>diode</b> (gate tied to drain) and M12 shares its gate: a current mirror, exactly as in the 5-T OTA.');
  // currents
  S.flow([[400, 440], [400, 690]], 12, null, { speed: 70 });
  label(S, 380, 470, '+i', 12, { size: 24, color: C.cur, weight: 800, anchor: 'end' });
  S.flow([[1200, 510], [1200, 690]], 16, null, { speed: 70 });
  label(S, 1250, 600, 'M12 copies: +i out', 16, { size: 21, color: C.cur, weight: 700 });
  label(S, 1250, 440, 'M10 pushes i less in', 21, { size: 21, color: C.cur, weight: 700 });
  S.say(12, 'Follow a signal. The left CS device M9 carries $+i$ more; that current goes into the diode M11…');
  S.say(16, '…and M12 copies it, pulling $+i$ more <b>out</b> of the output. Meanwhile M10, driven the opposite way, pushes $i$ <b>less</b> in.');
  S.say(21, 'Both changes move $V_{out}$ the same way: the two halves <b>add</b>. One output, full differential gain — nothing wasted.');
  whyBox(S, 900, 800, 660, 92, 'Same idea as the 5-T OTA: the **diode turns a current into a gate voltage**, the mirror **copies it** to the other side.', 27);
  S.say(27, 'Remember the mirror’s job in one line: the diode turns a current into a gate voltage, the mirror copies it to the other side, and the halves add.');
});

scene(L7, 'Gain boosting: which factor can grow?', 56, (S) => {
  header(S, 'LEC 7 · GAIN BOOSTING', 'A_v = G_m × R_out: G_m is stuck, R_out is not');
  eqAt(S, 'A_v = G_m \\times R_{out}', 800, 190, 0.3, { size: 58 });
  const g1 = chip(S, 690, 280, 'very hard to improve', { color: C.bad, size: 20 }); g1.style.opacity = 0; S.pop(g1, 3);
  const g2 = chip(S, 960, 280, 'needs to be improved', { color: C.ok, size: 20 }); g2.style.opacity = 0; S.pop(g2, 7);
  S.say(0.3, 'A new idea to get gain. Start from the one line you know: $A_v = G_m\\times R_{out}$.');
  S.say(3, '$G_m$ is the input device’s $g_m = 2I_D/V_{ov}$. More of it needs more current (power) or a smaller overdrive: your page says <b>“very hard to improve”</b>.');
  S.say(7, '$R_{out}$ is different — your page says <b>“needs to be improved”</b>. We already know one way: stack cascodes.');
  // the stack from the page
  const st = S.g(); const r = S.into(st);
  const x = 520;
  nmos(S, x, 700, { name: 'M1', gate: 'V_in' }); nmos(S, x, 590, { name: 'M2', gate: 'V_b' }); nmos(S, x, 480, { name: 'M3', gate: 'V_b2' });
  wire(S, [[x, 640], [x, 650]]); wire(S, [[x, 530], [x, 540]]); wire(S, [[x, 380], [x, 430]]); gnd(S, x, 750);
  dot(S, x, 400); wire(S, [[x, 400], [620, 400]]); txt(S, 630, 407, 'V_out', { size: 21, color: C.volt, weight: 700 });
  r();
  S.fade(st, 11, 0.8);
  const steps = [['r_{O1}', 760, 14], ['g_{m2}r_{O2}\\,r_{O1}', 645, 18], ['g_{m3}r_{O3}\\,g_{m2}r_{O2}\\,r_{O1}', 535, 22]];
  steps.forEach(([tex, y, t]) => { const a = arrow(S, 700, y - 50, 700, y - 4, { color: C.n, w: 2.6 }); S.fade(a, t, 0.4); eqAt(S, tex, 720, y - 28, t, { size: 30, anchor: 'start', w: 600 }); });
  S.say(11, 'Your page’s stack: looking into M1’s drain you see $r_{O1}$…');
  S.say(14, '…put M2 on top and it multiplies that by $g_{m2}r_{O2}$ (“up multiplies”)…');
  S.say(18, '…add M3 and it multiplies again: $g_{m3}r_{O3}\\,g_{m2}r_{O2}\\,r_{O1}$. Each cascode gives another factor of about 50.');
  // tower cost
  const tw = tower(S, 1260, 760, [{ v: 0.2, name: 'M1' }, { v: 0.2, name: 'M2' }, { v: 0.2, name: 'M3', st: 'sq' }, { v: 1.2, name: 'room', st: 'room' }], 300, { w: 86 });
  S.fade(tw, 26, 0.8);
  label(S, 1240, 640, 'each cascode =', 26, { size: 19, color: C.bad, anchor: 'end' }); label(S, 1240, 664, 'one more block', 26, { size: 19, color: C.bad, anchor: 'end' });
  S.say(26, 'But each stacked cascode adds another $V_{ov}$ block to the output column — the swing problem again.');
  whyBox(S, 560, 790, 640, 90, '**Gain boosting:** get that ×50 multiplication **without stacking** another device.', 33);
  S.say(33, '<span class="why">So Razavi asks:</span> can we get that multiplication of $R_{out}$ <b>without</b> stacking another device? That is <b>gain boosting</b>.');
  S.say(42, 'Your page tries two ways. The first fails — and seeing why it fails makes the second one obvious.');
});

/* a device with R_S under its source, optionally with an amplifier */
scene(L7, 'Attempt 1: an amplifier in front of the gate', 70, (S) => {
  header(S, 'LEC 7 · ATTEMPT 1', 'Boost G_m by amplifying the input first?');
  // left: simple version
  const a = S.g(); const r = S.into(a);
  wire(S, [[150, 330], [190, 330]]); txt(S, 140, 338, 'V_in', { size: 21, color: C.muted, anchor: 'end' });
  const A = amp(S, 190, 330, { label: 'A₁', pm: false, w: 86, h: 80 });
  wire(S, [[276, 330], [316, 330]]);
  nmos(S, 360, 330, { name: 'M1', gl: 24 });
  wire(S, [[360, 280], [360, 230], [440, 230]]); txt(S, 448, 236, 'I_out', { size: 20, color: C.cur, weight: 700 });
  gnd(S, 360, 380);
  r();
  S.draw(a, 0.3, 1.4);
  eqAt(S, 'I_{out} = g_m A_1 V_{in}\\;\\Rightarrow\\; \\frac{I_{out}}{V_{in}} = A_1g_m', 320, 480, 2.5, { size: 30, w: 560 });
  S.say(0.3, 'The obvious idea: put an amplifier $A_1$ in front of the gate. The transistor now sees $A_1V_{in}$…');
  S.say(2.5, '…so $I_{out}/V_{in} = A_1g_m$. It looks as if $G_m$ went up by $A_1$!');
  // right: with RS and rO2
  const b = S.g(); const r2 = S.into(b);
  wire(S, [[700, 330], [740, 330]]); txt(S, 690, 338, 'V_in', { size: 21, color: C.muted, anchor: 'end' });
  amp(S, 740, 330, { label: 'A₁', pm: false, w: 86, h: 80 });
  wire(S, [[826, 330], [866, 330]]);
  nmos(S, 910, 330, { name: 'M2', gl: 24 });
  wire(S, [[910, 280], [910, 230], [990, 230]]); txt(S, 998, 236, 'I_out', { size: 20, color: C.cur, weight: 700 });
  res(S, 980, 280, 380, { label: 'r_O2', lcol: C.n }); wire(S, [[910, 270], [980, 270], [980, 280]]); wire(S, [[980, 380], [980, 392], [910, 392]]);
  res(S, 910, 392, 490, { label: 'R_S' }); gnd(S, 910, 490);
  r();
  S.draw(b, 7, 1.6);
  S.say(7, 'Now be honest about the transistor: it has its own $r_{O2}$, and below its source sits a resistance $R_S$ (in a cascode that is the input device’s $r_O$).');
  const lines = [
    ['I_o = (A_1V_{in} - I_{out}R_S)\\,g_{m2}', 12, 'The gate sees $A_1V_{in}$, but the source has risen by $I_{out}R_S$. The current source inside M2 gives $g_{m2}$ times $V_{GS}$.'],
    ['I_{out} = I_o\\,\\frac{r_{O2}}{r_{O2}+R_S}', 19, 'Part of that current leaks back through $r_{O2}$: a current divider leaves $I_o\\,r_{O2}/(r_{O2}+R_S)$ at the output.'],
    ['I_{out}\\left[1 + \\frac{g_{m2}r_{O2}R_S}{r_{O2}+R_S}\\right] = A_1V_{in}\\,g_{m2}\\frac{r_{O2}}{r_{O2}+R_S}', 26, 'Put the first line into the second and collect every $I_{out}$ on the left.'],
    ['\\frac{I_{out}}{V_{in}} = \\frac{A_1\\,g_{m2}r_{O2}}{r_{O2}+R_S+g_{m2}r_{O2}R_S}', 33, 'Solve. This is your page’s last line.'],
  ];
  lines.forEach(([tex, t, say], i) => { eqAt(S, tex, 1100, 560 + i * 72, t, { size: i === 2 ? 25 : 30, w: 980 }); S.say(t, say); });
  const fac = whyBox(S, 50, 560, 520, 290, '**Factor it:** $A_1 \\times \\frac{g_{m2}r_{O2}}{r_{O2}+R_S+g_{m2}r_{O2}R_S}$. The second factor is just the **ordinary degenerated transistor**, ≈ $1/R_S$. The transistor is **not** better; $A_1$ is simply another amplifier in front of it.', 40);
  S.say(40, '<span class="why">Read it carefully:</span> it is $A_1$ times the plain degenerated transistor, about $1/R_S$. The transistor did not get any better.');
  S.say(48, '$A_1$ is just an extra amplifier in front — a separate stage. And $R_{out}$ at the output is unchanged. Your page’s verdict: <b>“No improvement.”</b>');
  const ni = chip(S, 1340, 860, 'No improvement', { color: C.bad, size: 24 }); ni.style.opacity = 0; S.pop(ni, 48);
  S.say(57, 'Lesson: boosting the <b>input side</b> is the wrong place. The amplifier must fight the <b>output</b> resistance instead.');
});

scene(L7, 'Attempt 2: the amplifier watches the source', 88, (S) => {
  header(S, 'LEC 7 · ATTEMPT 2 (THE ONE THAT WORKS)', 'Boost R_out: the amplifier holds the source still');
  // plain degenerated device first
  const p0 = S.g(); const r0 = S.into(p0);
  nmos(S, 260, 330, { name: 'M2', gate: 'V_b' });
  wire(S, [[260, 280], [260, 230]]); res(S, 260, 380, 480, { label: 'R_S' }); gnd(S, 260, 480);
  arrow(S, 300, 250, 300, 290, { color: C.n, w: 2.4, head: 10 }); txt(S, 310, 262, 'R_out', { size: 20, color: C.n, weight: 700 });
  r0();
  S.draw(p0, 0.3, 1.2);
  eqAt(S, 'R_{out} = R_S + r_O + g_mR_Sr_O', 280, 560, 2, { size: 30, w: 500 });
  S.say(0.3, 'First recall a plain device with $R_S$ under its source (your page): looking into its drain you see $R_S + r_O + g_mR_Sr_O$ — the cascode formula.');
  // boosted circuit with test source
  const c = S.g(); const r1 = S.into(c);
  const x = 980;
  gnd(S, 620, 420); wire(S, [[620, 420], [620, 380], [660, 380]]); txt(S, 610, 372, 'V_b (AC 0)', { size: 18, color: C.muted, anchor: 'end' });
  const A = amp(S, 660, 400, { label: 'A₁', w: 110, h: 110 });
  wire(S, [[770, 400], [900, 400]]); txt(S, 800, 388, 'gate', { size: 18, color: C.muted });
  const m = nmos(S, x, 400, { name: 'M2', gl: 46 });
  wire(S, [[x, 350], [x, 250], [1120, 250], [1120, 300]]);
  S.el('circle', { cx: 1120, cy: 330, r: 26, fill: C.bg, stroke: C.amb, 'stroke-width': 2.6 });
  txt(S, 1120, 324, '+', { size: 22, color: C.amb, anchor: 'middle', weight: 800 }); txt(S, 1120, 350, '−', { size: 22, color: C.amb, anchor: 'middle', weight: 800 });
  txt(S, 1156, 338, 'V_X', { size: 22, color: C.amb, weight: 700 });
  wire(S, [[1120, 356], [1120, 600]]); gnd(S, 1120, 600);
  wire(S, [[x, 450], [x, 500]]); dot(S, x, 480);
  wire(S, [[x, 480], [620, 480], [620, 428], [660, 428]]);
  res(S, x, 500, 600, { label: 'R_S' }); gnd(S, x, 600);
  txt(S, x + 16, 474, 'source', { size: 18, color: C.muted });
  r1();
  S.draw(c, 9, 2.2);
  S.say(9, 'Now the working idea: an amplifier $A_1$ <b>watches the source</b> (its − input) and drives the <b>gate</b>. To find $R_{out}$, kill the input and push a test voltage $V_X$ into the drain.');
  // test current
  S.flow([[1120, 304], [1120, 250], [x, 250], [x, 600]], 16, null, { speed: 60 });
  label(S, 1050, 240, 'I_X', 16, { size: 22, color: C.cur, weight: 800 });
  S.say(16, 'A current $I_X$ flows in. Everything is about how hard M2 fights it.');
  // gauges
  const gx = 1260, gy = 420;
  const gauge = (i, name, col) => {
    const xx = gx + i * 100;
    S.el('rect', { x: xx, y: gy - 150, width: 50, height: 300, rx: 10, fill: '#121926', stroke: '#2a3546' });
    S.el('line', { x1: xx - 6, y1: gy, x2: xx + 56, y2: gy, stroke: C.dim, 'stroke-width': 2 });
    txt(S, xx + 25, gy + 186, name, { size: 19, color: col, anchor: 'middle', weight: 700 });
    const bar = S.el('rect', { x: xx + 8, y: gy, width: 34, height: 0, rx: 6, fill: col });
    return bar;
  };
  const gS = gauge(0, 'source', C.volt), gG = gauge(1, 'gate', C.amb), gV = gauge(2, 'V_GS', C.cur);
  const setBar = (b, v) => { b.setAttribute('y', v >= 0 ? gy - v : gy); b.setAttribute('height', Math.abs(v)); };
  S.anim(22, 3, 'gs', (p) => setBar(gS, 30 * p)); S.anim(26, 3, 'gg', (p) => setBar(gG, -120 * p)); S.anim(30, 3, 'gv', (p) => setBar(gV, -150 * p));
  label(S, gx + 25, gy - 175, '+I_{X}R_{S}', 22, { size: 19, color: C.volt, anchor: 'middle', weight: 700 });
  label(S, gx + 125, gy + 214, '−A_{1}I_{X}R_{S}', 26, { size: 19, color: C.amb, anchor: 'middle', weight: 700 });
  label(S, gx + 225, gy + 246, '−(1+A_{1})I_{X}R_{S}', 30, { size: 18, color: C.cur, anchor: 'middle', weight: 700 });
  S.say(22, '$I_X$ through $R_S$ lifts the <b>source</b> by $I_XR_S$. A plain device’s $V_{GS}$ would shrink by just that much.');
  S.say(26, 'But the amplifier sees the source rise and drives the <b>gate down</b> by $A_1I_XR_S$ (your page: “$-A_1I_XR_S$”).');
  S.say(30, 'So $V_{GS}$ shrinks by $(1 + A_1)I_XR_S$: M2 fights back $(1 + A_1)$ times harder. The drain looks $(1 + A_1)$ times stiffer.');
  const lines = [
    ['I_o = g_{m2}[-A_1I_XR_S - I_XR_S] = -g_{m2}R_SI_X(1 + A_1)', 38],
    ['I_X = I_o + \\frac{V_X - I_XR_S}{r_{O2}}', 44],
    ['\\frac{V_X}{I_X} = R_S + r_{O2} + g_{m2}(1 + A_1)R_Sr_{O2}', 50],
  ];
  lines.forEach(([tex, t], i) => eqAt(S, tex, 760, 680 + i * 66, t, { size: 30, w: 1100, color: i === 2 ? '#ffd38a' : C.text }));
  S.say(38, 'The algebra on your page: the current source inside M2 is $g_{m2}$ times $V_{GS}$, which is $-(1+A_1)I_XR_S$.');
  S.say(44, 'KCL at the drain: $I_X$ is that current plus what flows through $r_{O2}$, which sees $V_X - I_XR_S$.');
  S.say(50, 'Solve for $V_X/I_X$: <b>$R_{out} = R_S + r_{O2} + g_{m2}(1+A_1)R_Sr_{O2}$</b> — the cascode result with its big term multiplied by $(1 + A_1)$.');
  whyBox(S, 40, 620, 330, 210, 'With $g_mr_O = 50$ and $A_1 = 50$: **51× more $R_{out}$**, with **no extra device** in the output column.', 58);
  S.say(58, 'With $g_mr_O = 50$ and $A_1 = 50$ that is 51 times more output resistance — and nothing new was stacked in the output column. That is gain boosting.');
  S.say(68, '<span class="why">Remember the picture:</span> the amplifier holds the source still by moving the gate the opposite way.');
});

scene(L7, 'Lecture 7 in one card', 30, (S) => {
  header(S, 'LEC 7 · REMEMBER', 'Everything from Lecture 7');
  remember(S, [
    'Two stages split the jobs: **stage 1 gain**, **stage 2 swing** (CS, two blocks per column). $A = A_1A_2$.',
    'Simple: $A_1 = g_{m1,2}(r_{O1,2}\\parallel r_{O3,4})$, $A_2 = g_{m5,6}(r_{O5,6}\\parallel r_{O7,8})$. Telescopic stage 1: $A_1 = g_{m1}[g_{m5}r_{O5}r_{O7}\\parallel g_{m3}r_{O3}r_{O1}]$, $A_2 = g_{m9}(r_{O9}\\parallel r_{O11})$.',
    'Level between the stages is a **link**: $X = V_{DD} - |V_{GS9}|$.',
    'Price: **two poles** → needs compensation. Single output: diode M11 + mirror M12, the halves add.',
    '$A_v = G_m\\times R_{out}$: $G_m$ is hard to raise; raise $R_{out}$ without stacking.',
    'Amp in front of the gate: **no improvement** ($A_1$ × the plain degenerated device).',
    'Amp watching the source: $R_{out} = R_S + r_O + (1 + A_1)g_mR_Sr_O$.',
  ], 0.4, 'Lecture 7 · remember');
  S.say(0.4, 'Pause here and read the card once. Then three past-paper questions, solved the way you would write them in the exam.');
});

/* ── Lecture 7 past papers ── */

/* Set A (Razavi 0.5 µm) as the tutorials use it */
const L7_SET_A = 'Set A: $\\mu_nC_{ox} = 134.28\\,\\mu$A/V², $\\mu_pC_{ox} = 38.36\\,\\mu$A/V², $V_{thn} = 0.7$ V, $|V_{thp}| = 0.8$ V, $\\lambda_n = 0.1$ V⁻¹, $\\lambda_p = 0.2$ V⁻¹, $V_{DD} = 3$ V';

/* branch currents on twoStage1 as printed (figure coordinates): I_SS/2 down each first-stage branch into the tail,
   I_D5, I_D6 down the two second-stage branches */
const T3Q2_CUR = { tf: 'translate(-130 188) scale(0.76)', list: [
  [[[660, 180], [660, 500], [794, 500]], 'I_SS/2', { color: C.n, at: [690, 565] }],
  [[[940, 180], [940, 500], [806, 500]], null, { color: C.n }],
  [[[400, 180], [400, 525]], 'I_D5', { color: C.cur, at: [330, 420] }],
  [[[1200, 180], [1200, 525]], 'I_D6', { color: C.cur, at: [1265, 430] }],
] };
scene(L7, 'Tutorial 3 Q2: two-stage, level at X, gain, swing', 78, (S) => {
  const T = tfm(0.76, -130, 188);
  // every intermediate, from the givens (Set A, W/L = 200, I_SS/2 = 0.5 mA, I_D5 = 1 mA)
  const kn = 134.28e-6, kp = 38.36e-6, WL = 200;
  const vov5 = Math.sqrt(2 * 1e-3 / (kp * WL)), gm1 = Math.sqrt(2 * kn * WL * 0.5e-3), gm5 = 2 * 1e-3 / vov5;
  const rO1 = 1 / (0.1 * 0.5e-3), rO3 = 1 / (0.2 * 0.5e-3), rO5 = 1 / (0.2 * 1e-3), rO7 = 1 / (0.1 * 1e-3);
  const par = (a, b) => (a * b) / (a + b);
  const A1q2 = gm1 * par(rO1, rO3), A2q2 = gm5 * par(rO5, rO7), vov7 = Math.sqrt(2 * 1e-3 / (kn * WL));
  pyqFrame(S, {
    paper: 't3q2', tag: 'LEC 7 · PAST PAPER 1 OF 3', title: 'Two-stage op amp: what sits at X?', src: 'Tutorial 3 Q2 · Razavi 9.6',
    q: 'Your circuit 1 with $(W/L)_{1-8} = 200$, $I_{SS} = 1$ mA, $I_{D5} = I_{D6} = 1$ mA. (a) CM level at X, Y and the input-CM ceiling. (b) Gain and maximum output swing.',
    giv: L7_SET_A + '. M7, M8 are NMOS sinks of 1 mA, also $W/L = 200$.',
    qh: 270, tests: 'the **link** that pins the level between two stages, the **fence** for the input-CM ceiling, and **gain = product of stage gains**.',
    fig: (S2) => { const c = twoStage1(S2, { printed: true }); c.g.setAttribute('transform', 'translate(-130 188) scale(0.76)'); }, currents: T3Q2_CUR,
    steps: [
      { t: 7, title: '**(a) Start at stage 2: the link.** X is **M5’s gate** and M5’s source is on $V_{DD}$. M5 must carry 1 mA, so its $|V_{GS5}|$ is fixed and X sits exactly that far below $V_{DD}$ (Y the same).',
        tex: '|V_{ov5}| = \\sqrt{\\frac{2I_{D5}}{\\mu_pC_{ox}(W/L)}} = \\sqrt{\\frac{2(1\\,\\text{m})}{38.36\\,\\mu\\times200}} = 0.511\\,\\text{V},\\quad V_X = V_{DD} - |V_{thp}| - |V_{ov5}| = 3 - 0.8 - 0.511 = 1.689\\,\\text{V}', hl: [T([330, 170, 150, 130, C.volt])],
        try: {
          q: '**(a)** M5 must carry its 1 mA. What DC voltage must sit at X (the CM level of X and Y)?',
          answer: ans('bank-t3q2', 'vxy'), unit: 'V', tol: 0.01,
          parts: [
            { q: 'First: M5’s overdrive $|V_{ov5}|$ at 1 mA?', answer: vov5, unit: 'V', tol: 0.01, hint: '$|V_{ov5}| = \\sqrt{2I_{D5}/(\\mu_pC_{ox}\\,W/L)}$', how: ['$$|V_{ov5}| = \\sqrt{\\frac{2(1\\,\\text{m})}{38.36\\,\\mu\\times200}} = 0.511\\,\\text{V}$$'] },
          ],
          hint: ['X is M5’s **gate**, and M5’s source is on $V_{DD}$. Get M5’s $|V_{GS}|$ from its current, then step down from $V_{DD}$.', '$|V_{GS5}| = |V_{thp}| + \\sqrt{\\dfrac{2I_{D5}}{\\mu_pC_{ox}(W/L)}}$, then $V_X = V_{DD} - |V_{GS5}|$.'],
          how: [
            'M5 is a PMOS with its source on $V_{DD}$ and its gate on X. Only one $|V_{GS5}|$ gives 1 mA, so that fixes X (the **link**).',
            'Overdrive from the square law: $$|V_{ov5}| = \\sqrt{\\frac{2I_{D5}}{\\mu_pC_{ox}(W/L)}} = \\sqrt{\\frac{2(1\\,\\text{mA})}{38.36\\,\\mu\\text{A/V}^2\\times200}} = 0.511\\,\\text{V}$$',
            'Add the threshold: $$|V_{GS5}| = |V_{thp}| + |V_{ov5}| = 0.8 + 0.511 = 1.311\\,\\text{V}$$',
            'Step down from the rail (Y is the same by symmetry): $$V_X = V_{DD} - |V_{GS5}| = 3 - 1.311 = 1.689\\,\\text{V}$$',
          ],
          why: 'Two-stage questions start at stage 2: the second stage’s gate fixes the first stage’s output level.',
          calc: [{ what: 'X in one line (prefixes on)', keys: '3 − 0.8 − [√] ( 2 × 1m ÷ ( 38.36µ × 200 ) )', shows: '1.689', note: 'Type µ and m with [CATALOG] ▸ Engineer Symbol. Keep |Vov5| (0.5106) for part (b): [VARIABLE] ▸ A ▸ Store after computing it alone.' }],
        },
        say: 'Start where the level is forced. X is M5’s gate and M5 must carry 1 mA, so $|V_{GS5}| = 0.8 + 0.511 = 1.311$ V and $V_X = 1.689$ V.' },
      { t: 15, title: '**Input-CM ceiling: the NMOS fence.** M1’s drain is X. M1 stays saturated while its gate is at most one $V_{thn}$ above its drain.',
        tex: 'V_{in,CM,max} = V_X + V_{thn} = 1.689 + 0.7 = 2.389\\,\\text{V}', hl: [T([590, 360, 150, 120, C.n])],
        try: {
          q: '**(a)** With X at the level you just found, what is the highest input common-mode voltage that keeps M1 and M2 saturated?',
          answer: ans('bank-t3q2', 'cmMax'), unit: 'V', tol: 0.01,
          hint: ['M1’s drain is X. An NMOS stays saturated while its gate is at most one $V_{th}$ above its drain (the fence).', '$V_{in,CM,max} = V_X + V_{thn}$'],
          how: [
            'M1’s drain sits at X, which stage 2 has pinned at 1.689 V (part (a)).',
            'NMOS saturation fence: $V_D \\ge V_G - V_{th}$, so the gate may rise only to $V_G \\le V_D + V_{th}$.',
            'Put in the numbers: $$V_{in,CM,max} = V_X + V_{thn} = 1.689 + 0.7 = 2.389\\,\\text{V}$$',
          ],
          why: 'An input-CM ceiling always comes from the input device’s drain: drain + $V_{th}$.',
        },
        say: 'Ceiling: an NMOS gate may sit one $V_{th}$ above its drain. $1.689 + 0.7 = 2.389$ V.' },
      { t: 23, title: '**(b) Gains multiply.** Each stage is $g_m$ × (its two $r_O$ in parallel). Stage 1 runs 0.5 mA per side ($I_{SS}/2$): $r_{O1} = 1/(0.1\\times0.5\\,\\text{m}) = 20$ kΩ, $r_{O3} = 1/(0.2\\times0.5\\,\\text{m}) = 10$ kΩ.',
        tex: 'g_{m1} = \\sqrt{2(134.28\\,\\mu)(200)(0.5\\,\\text{m})} = 5.18\\,\\text{mS},\\quad A_1 = g_{m1}(r_{O1}\\parallel r_{O3}) = 5.18\\,\\text{m}\\times(20\\,\\text{k}\\parallel10\\,\\text{k}) = 34.5', hl: [T([560, 150, 480, 500, C.red])],
        try: {
          q: '**(b)** What is the overall small-signal gain $A$ of the op amp? (Stage 1 runs $I_{SS}/2 = 0.5$ mA per side, stage 2 runs 1 mA per side.)',
          answer: ans('bank-t3q2', 'av'), unit: 'V/V', tol: 0.03,
          parts: [
            { q: 'Stage 1: $g_{m1}$ of M1 at 0.5 mA?', answer: gm1, unit: 'S', tol: 0.02, hint: '$g_{m1} = \\sqrt{2\\mu_nC_{ox}(W/L)I_{D1}}$', how: ['$$g_{m1} = \\sqrt{2(134.28\\,\\mu)(200)(0.5\\,\\text{m})} = 5.18\\,\\text{mS}$$'] },
            { q: '$r_{O1}$ of the NMOS M1 at 0.5 mA?', answer: rO1, unit: 'Ω', tol: 0.02, hint: '$r_O = 1/(\\lambda_nI_D)$', how: ['$$r_{O1} = \\frac{1}{0.1\\times0.5\\,\\text{m}} = 20\\,\\text{k}\\Omega$$'] },
            { q: '$r_{O3}$ of the PMOS load M3 at 0.5 mA?', answer: rO3, unit: 'Ω', tol: 0.02, hint: '$r_O = 1/(\\lambda_pI_D)$ with $\\lambda_p = 0.2$ V⁻¹', how: ['$$r_{O3} = \\frac{1}{0.2\\times0.5\\,\\text{m}} = 10\\,\\text{k}\\Omega$$'] },
            { q: 'Stage-1 gain $A_1 = g_{m1}(r_{O1}\\parallel r_{O3})$?', answer: A1q2, unit: 'V/V', tol: 0.02, hint: '$20\\,\\text{k}\\parallel10\\,\\text{k} = \\frac{20\\times10}{20+10}$ kΩ', how: ['$$A_1 = 5.18\\,\\text{m}\\times(20\\,\\text{k}\\parallel10\\,\\text{k}) = 5.18\\,\\text{m}\\times6.67\\,\\text{k} = 34.5$$'] },
            { q: 'Stage 2: $g_{m5}$ of M5 at 1 mA (use $|V_{ov5}|$ from part (a))?', answer: gm5, unit: 'S', tol: 0.02, hint: '$g_m = 2I_D/|V_{ov}|$', how: ['$$g_{m5} = \\frac{2(1\\,\\text{m})}{0.511} = 3.92\\,\\text{mS}$$'] },
            { q: '$r_{O5}$ of the PMOS M5 at 1 mA?', answer: rO5, unit: 'Ω', tol: 0.02, hint: '$r_O = 1/(\\lambda_pI_D)$', how: ['$$r_{O5} = \\frac{1}{0.2\\times1\\,\\text{m}} = 5\\,\\text{k}\\Omega$$'] },
            { q: '$r_{O7}$ of the NMOS sink M7 at 1 mA?', answer: rO7, unit: 'Ω', tol: 0.02, hint: '$r_O = 1/(\\lambda_nI_D)$', how: ['$$r_{O7} = \\frac{1}{0.1\\times1\\,\\text{m}} = 10\\,\\text{k}\\Omega$$'] },
            { q: 'Stage-2 gain $A_2 = g_{m5}(r_{O5}\\parallel r_{O7})$?', answer: A2q2, unit: 'V/V', tol: 0.02, hint: '$5\\,\\text{k}\\parallel10\\,\\text{k} = 3.33$ kΩ', how: ['$$A_2 = 3.92\\,\\text{m}\\times3.33\\,\\text{k} = 13.1$$'] },
          ],
          hint: ['Two stages in a chain: for each, $g_m$ × (the $r_O$ looking down ∥ the $r_O$ looking up), then multiply.', '$A_1 = g_{m1}(r_{O1}\\parallel r_{O3})$, $A_2 = g_{m5}(r_{O5}\\parallel r_{O7})$, with $g_m = \\sqrt{2\\mu C_{ox}(W/L)I_D}$ or $2I_D/V_{ov}$, and $r_O = 1/(\\lambda I_D)$.', 'Stage 1 at 0.5 mA: $r_{O1} = 1/(0.1\\times0.5\\,\\text{m})$, $r_{O3} = 1/(0.2\\times0.5\\,\\text{m})$.'],
          how: [
            'Stage 1 input pair, M1 at 0.5 mA: $$g_{m1} = \\sqrt{2\\mu_nC_{ox}\\tfrac{W}{L}I_{D1}} = \\sqrt{2(134.28\\,\\mu)(200)(0.5\\,\\text{m})} = 5.18\\,\\text{mS}$$',
            'At X: NMOS $r_{O1} = 1/(0.1\\times0.5\\,\\text{m}) = 20$ kΩ down, PMOS $r_{O3} = 1/(0.2\\times0.5\\,\\text{m}) = 10$ kΩ up: $$A_1 = g_{m1}(r_{O1}\\parallel r_{O3}) = 5.18\\,\\text{m}\\times6.67\\,\\text{k} = 34.5$$',
            'Stage 2, M5 at 1 mA with $|V_{ov5}| = 0.511$ V from part (a): $$g_{m5} = \\frac{2I_{D5}}{|V_{ov5}|} = \\frac{2(1\\,\\text{m})}{0.511} = 3.92\\,\\text{mS}$$',
            'At $V_{out1}$: $r_{O5} = 1/(0.2\\times1\\,\\text{m}) = 5$ kΩ, $r_{O7} = 1/(0.1\\times1\\,\\text{m}) = 10$ kΩ: $$A_2 = g_{m5}(r_{O5}\\parallel r_{O7}) = 3.92\\,\\text{m}\\times3.33\\,\\text{k} = 13.1$$',
            'Gains multiply: $$A = A_1A_2 = 34.5\\times13.1 = 451$$',
          ],
          why: 'Each stage = $g_m$ × (down ∥ up); multiply the stages. Here $\\lambda_p = 2\\lambda_n$, so a PMOS $r_O$ is half an NMOS $r_O$.',
          calc: [
            { what: 'A₁, then store it', keys: '[√] ( 2 × 134.28µ × 200 × 0.5m ) × ( 20k [SHIFT][^] + 10k [SHIFT][^] ) [SHIFT][^]', shows: '34.55', note: 'Then [VARIABLE] ▸ A ▸ Store. [SHIFT][^] is x⁻¹: (a⁻¹ + b⁻¹)⁻¹ is a ∥ b.' },
            { what: 'A₂ × A₁', keys: '2 × 1m ÷ 0.5106 × ( 5k [SHIFT][^] + 10k [SHIFT][^] ) [SHIFT][^] × [SHIFT][4]', shows: '451.1', note: '0.5106 V is |Vov5| from part (a). [SHIFT][4] recalls A.' },
          ],
        },
        say: '$g_{m1} = 5.18$ mS into $20\\,\\text{k}\\parallel10\\,\\text{k}$ gives $A_1 = 34.5$; M5 at 1 mA gives $A_2 = 13.1$. Multiply: 451.' },
      { t: 27, title: '**Stage 2, the same recipe** at 1 mA: $g_{m5} = 2I_D/|V_{ov5}|$ with $|V_{ov5}|$ from (a); $r_{O5} = 1/(0.2\\times1\\,\\text{m}) = 5$ kΩ, $r_{O7} = 1/(0.1\\times1\\,\\text{m}) = 10$ kΩ. Then multiply.',
        tex: 'g_{m5} = \\tfrac{2(1\\,\\text{m})}{0.511} = 3.92\\,\\text{mS},\\quad A_2 = g_{m5}(r_{O5}\\parallel r_{O7}) = 3.92\\,\\text{m}\\times(5\\,\\text{k}\\parallel10\\,\\text{k}) = 13.1,\\quad A = A_1A_2 = 34.5\\times13.1 = 451', hl: [T([270, 150, 250, 450, C.green])] },
      { t: 31, title: '**Swing: stage 2 is a CS stage.** Each output runs from $V_{ov7}$ (M7 at its edge) up to $V_{DD} - |V_{ov5}|$ (M5 at its edge). The two outputs move oppositely, so the differential swing is twice that.',
        tex: 'V_{ov7} = \\sqrt{\\frac{2(1\\,\\text{m})}{134.28\\,\\mu\\times200}} = 0.273\\,\\text{V},\\quad V_{pp,diff} = 2[(V_{DD} - |V_{ov5}|) - V_{ov7}] = 2[(3 - 0.511) - 0.273] = 4.43\\,\\text{V}', hl: [T([330, 170, 150, 400, C.green])],
        try: {
          q: '**(b)** What is the maximum differential output swing (peak-to-peak) with M5 and M7 kept saturated?',
          answer: ans('bank-t3q2', 'swing'), unit: 'V', tol: 0.01,
          parts: [
            { q: 'First: $V_{ov7}$ of the NMOS sink M7 at 1 mA?', answer: vov7, unit: 'V', tol: 0.01, hint: '$V_{ov7} = \\sqrt{2I_{D7}/(\\mu_nC_{ox}\\,W/L)}$', how: ['$$V_{ov7} = \\sqrt{\\frac{2(1\\,\\text{m})}{134.28\\,\\mu\\times200}} = 0.273\\,\\text{V}$$'] },
            { q: 'Swing of ONE output (p-p), from $V_{ov7}$ up to $V_{DD} - |V_{ov5}|$?', answer: 3 - vov5 - vov7, unit: 'V', tol: 0.01, hint: '$(V_{DD} - |V_{ov5}|) - V_{ov7}$, with $|V_{ov5}| = 0.511$ V from (a)', how: ['$$(3 - 0.511) - 0.273 = 2.216\\,\\text{V}$$'] },
          ],
          hint: ['Each output is a CS stage: it rises until M5 reaches its edge and falls until M7 reaches its edge. The two outputs move in opposite directions.', 'One output: from $V_{ov7}$ up to $V_{DD} - |V_{ov5}|$. Differential p-p $= 2[(V_{DD} - |V_{ov5}|) - V_{ov7}]$.'],
          how: [
            'M7 is an NMOS sink at 1 mA, $W/L = 200$: $$V_{ov7} = \\sqrt{\\frac{2I_{D7}}{\\mu_nC_{ox}(W/L)}} = \\sqrt{\\frac{2(1\\,\\text{m})}{134.28\\,\\mu\\times200}} = 0.273\\,\\text{V}$$',
            'Top of one output: M5 keeps its $|V_{ov5}| = 0.511$ V from part (a): $$V_{out,max} = V_{DD} - |V_{ov5}| = 3 - 0.511 = 2.489\\,\\text{V}$$',
            'Bottom: $V_{out,min} = V_{ov7} = 0.273$ V, so one output swings $$2.489 - 0.273 = 2.216\\,\\text{V p-p}$$',
            'The two outputs swing in opposite directions, so the differential swing doubles: $$V_{pp,diff} = 2\\times2.216 = 4.43\\,\\text{V}$$',
          ],
          why: 'CS output swing = the rails minus one $V_{ov}$ at each end; differential = ×2.',
        },
        say: 'Each output runs from $V_{ov7}$ to $V_{DD} - |V_{ov5}|$; the differential output doubles it: 4.43 V p-p.' },
      { t: 38, ans: true, title: `**Answers:** $V_X = V_Y = ${fx(ans('bank-t3q2', 'vxy'), 4)}$ V · $V_{in,CM,max} = ${fx(ans('bank-t3q2', 'cmMax'), 4)}$ V · $A = ${fx(ans('bank-t3q2', 'av'), 3)}$ · swing $= ${fx(ans('bank-t3q2', 'swing'), 3)}$ V p-p (differential)`, say: 'Exam pattern: <b>link first</b> (fixes X), <b>fence second</b> (CM ceiling), then <b>gain = product</b>, then <b>swing = rails minus one $V_{ov}$ each</b>.' },
    ],
  });
}, { q: 'Tutorial 3 Q2' });

scene(L7, 'Tutorial 3 Q3: telescopic + CS, sizes from a 200 mV swing', 74, (S) => {
  const T = tfm(0.72, -110, 150);
  const vx = ans('bank-t3q3', 'vxy');
  const vov9 = Math.sqrt(2 * 0.5e-3 / (38.36e-6 * 200));
  pyqFrame(S, {
    paper: 't3q3', tag: 'LEC 7 · PAST PAPER 2 OF 3', title: 'Telescopic first stage: X level, sizes, gain', src: 'Tutorial 3 Q3 · Razavi 9.8',
    q: 'Your circuit 2: $I_{SS} = 1$ mA, $I_{D9-12} = 0.5$ mA, $(W/L)_{9-12} = 200$. (a) CM level at X, Y. (b) Tail needs 400 mV: smallest M1–M8 for a 200 mV p-p swing at X, Y. (c) Overall gain.',
    giv: L7_SET_A + '. Assume the headroom is shared **equally** by the stacked devices.', qh: 250,
    tests: 'the same **link** for X, then a **headroom budget** around X turned into sizes with the square law, then **A₁ × A₂**.',
    fig: (S2) => { const c = twoStage2(S2); c.g.setAttribute('transform', 'translate(-110 150) scale(0.72)'); },
    steps: [
      { t: 7, title: '**(a) The link, again.** X is **M9’s gate** and M9’s source is on $V_{DD}$. M9 must carry 0.5 mA, so X sits one $|V_{GS9}|$ below $V_{DD}$.',
        tex: 'V_X = V_{DD} - |V_{thp}| - \\sqrt{\\frac{2I_{D9}}{\\mu_pC_{ox}(W/L)}} = 3 - 0.8 - 0.361 = 1.839\\,\\text{V}', hl: [T([330, 330, 150, 130, C.volt])],
        try: {
          q: '**(a)** M9 must carry 0.5 mA with its source on $V_{DD}$. What CM level must X and Y sit at?',
          answer: vx, unit: 'V', tol: 0.01,
          parts: [
            { q: 'First: M9’s overdrive $|V_{ov9}|$ at 0.5 mA?', answer: vov9, unit: 'V', tol: 0.01, hint: '$|V_{ov9}| = \\sqrt{2I_{D9}/(\\mu_pC_{ox}\\,W/L)}$', how: ['$$|V_{ov9}| = \\sqrt{\\frac{2(0.5\\,\\text{m})}{38.36\\,\\mu\\times200}} = 0.361\\,\\text{V}$$'] },
          ],
          hint: ['The same link as Q2: X is M9’s gate, and M9’s source is $V_{DD}$.', '$V_X = V_{DD} - |V_{thp}| - \\sqrt{\\dfrac{2I_{D9}}{\\mu_pC_{ox}(W/L)_9}}$'],
          how: [
            'X drives M9’s gate and M9 must carry 0.5 mA, so $|V_{GS9}|$ is fixed and X sits that far below $V_{DD}$.',
            'Overdrive of M9: $$|V_{ov9}| = \\sqrt{\\frac{2(0.5\\,\\text{m})}{38.36\\,\\mu\\times200}} = 0.361\\,\\text{V}$$',
            'Step down from the rail: $$V_X = V_{DD} - |V_{thp}| - |V_{ov9}| = 3 - 0.8 - 0.361 = 1.839\\,\\text{V}$$',
          ],
          why: 'Half the current of Q2 → a smaller overdrive → X sits higher (1.839 V, not 1.689 V).',
        },
        say: 'Same first move: $X = V_{DD} - |V_{GS9}| = 1.839$ V.' },
      { t: 15, title: '**(b) Headroom budget around X.** 200 mV p-p means X moves ±0.1 V. Below the **lowest** X: tail (0.4 V) + M1 + M3. Above the **highest** X: M5 + M7. Share each part **equally** (stated assumption).',
        tex: stepTex('bank-t3q3', 1), hl: [T([560, 400, 200, 380, C.n]), T([560, 160, 200, 200, C.p])],
        try: {
          q: '**(b)** X must swing 200 mV p-p around the level from (a), and the tail needs 400 mV. If M1 and M3 share the remaining room under X equally, what overdrive $V_{ov,N}$ can each have?',
          answer: (vx - 0.1 - 0.4) / 2, unit: 'V', tol: 0.01,
          parts: [
            { q: 'First: the lowest voltage X reaches during the 200 mV p-p swing?', answer: vx - 0.1, unit: 'V', tol: 0.01, hint: '200 mV p-p = ±0.1 V around $V_X$ from (a).', how: ['$$V_{X,min} = 1.839 - 0.1 = 1.739\\,\\text{V}$$'] },
          ],
          hint: ['200 mV p-p means X moves ±0.1 V. Look at the **lowest** X: under it sit the tail, M1 and M3 in series.', '$V_{ov,N} = \\dfrac{(V_X - 0.1) - V_{ISS}}{2}$'],
          how: [
            'A 200 mV peak-to-peak swing takes X 0.1 V below its CM level: $$V_{X,min} = 1.839 - 0.1 = 1.739\\,\\text{V}$$',
            'From ground up to that point we must fit the tail (0.4 V), then M1, then M3, each needing at least its $V_{ov}$.',
            'Share what is left equally: $$V_{ov,N} = \\frac{V_{X,min} - V_{ISS}}{2} = \\frac{1.739 - 0.4}{2} = 0.669\\,\\text{V}$$',
          ],
          why: 'Headroom budget: list every device between the node and the rail, give each its $V_{ov}$; the sum must fit.',
        },
        say: 'The 200 mV swing means X moves ±0.1 V. Under its lowest point: the tail and two NMOS; above its highest point: two PMOS. Split each share equally.' },
      { t: 23, title: '**Largest overdrive ⇒ smallest device.** The square law solved for $W/L$ at 0.5 mA, with the overdrives from step 2.',
        tex: '\\frac{W}{L} = \\frac{2I_D}{\\mu C_{ox}V_{ov}^2},\\quad \\left(\\tfrac{W}{L}\\right)_{1-4} = \\frac{2(0.5\\,\\text{m})}{134.28\\,\\mu\\times0.669^2} = 16.6,\\quad \\left(\\tfrac{W}{L}\\right)_{5-8} = \\frac{2(0.5\\,\\text{m})}{38.36\\,\\mu\\times0.531^2} = 92.6',
        try: {
          q: '**(b)** With that overdrive at 0.5 mA, what is the smallest $(W/L)$ for M1–M4?',
          answer: ans('bank-t3q3', 'wlN'), unit: '', tol: 0.02,
          hint: ['The largest allowed overdrive gives the smallest device. Use the square law solved for $W/L$.', '$\\dfrac{W}{L} = \\dfrac{2I_D}{\\mu_nC_{ox}V_{ov}^2}$'],
          how: [
            'Square law: $I_D = \\tfrac12\\mu_nC_{ox}\\tfrac{W}{L}V_{ov}^2$. Solve it for $W/L$.',
            'For a fixed current, a bigger $V_{ov}$ needs a smaller $W/L$, so the largest allowed overdrive (0.669 V from the last part) gives the smallest device.',
            '$$\\frac{W}{L} = \\frac{2I_D}{\\mu_nC_{ox}V_{ov}^2} = \\frac{2(0.5\\,\\text{m})}{134.28\\,\\mu\\times0.669^2} = 16.6$$',
          ],
          why: 'The PMOS M5–M8 go the same way: $|V_{ov,P}| = (3 - 1.939)/2 = 0.531$ V gives $(W/L)_{5-8} = 92.6$.',
          calc: [{ what: 'W/L in one line (prefixes on)', keys: '2 × 0.5m ÷ ( 134.28µ × 0.6695 [x²] )', shows: '16.6', note: 'Type µ and m with [CATALOG] ▸ Engineer Symbol. Use the unrounded 0.6695: 0.67 gives 16.6 too, 0.7 would not.' }],
        },
        say: 'The smallest devices are the ones with the largest allowed overdrive: $W/L = 2I_D/(\\mu C_{ox}V_{ov}^2)$.' },
      { t: 31, title: '**(c) Stage-1 resistances at X.** Each look sees a cascode, $g_mr_Or_O$. At 0.5 mA: $r_O = 1/(\\lambda I_D)$ = 20 kΩ (NMOS), 10 kΩ (PMOS); $g_m = 2I_D/V_{ov}$ with the overdrives of step 2.',
        tex: 'g_{m1} = g_{m3} = \\tfrac{2(0.5\\,\\text{m})}{0.669} = 1.49\\,\\text{mS},\\quad R_{down} = g_{m3}r_{O3}r_{O1} = 1.49\\,\\text{m}\\times20\\,\\text{k}\\times20\\,\\text{k} = 598\\,\\text{k}\\Omega,\\quad R_{up} = g_{m5}r_{O5}r_{O7} = \\tfrac{2(0.5\\,\\text{m})}{0.531}\\times10\\,\\text{k}\\times10\\,\\text{k} = 188\\,\\text{k}\\Omega', hl: [T([540, 140, 520, 640, C.red])],
        say: '$A_1 = g_{m1}(R_{up}\\parallel R_{down}) ≈ 214$, $A_2 = g_{m9}(r_{O9}\\parallel r_{O11}) ≈ 18.5$, so $A ≈ 3950$.' },
      { t: 35, title: '**Gain = telescopic $A_1$ × CS $A_2$.** Stage 2: $g_{m9} = 2I_D/|V_{ov9}|$ with $|V_{ov9}|$ from (a); $r_{O9}$ = 10 kΩ, $r_{O11}$ = 20 kΩ.',
        tex: 'A_1 = g_{m1}(R_{up}\\parallel R_{down}) = 1.49\\,\\text{m}\\times143\\,\\text{k} = 214,\\quad A_2 = \\tfrac{2(0.5\\,\\text{m})}{0.361}\\times(10\\,\\text{k}\\parallel20\\,\\text{k}) = 18.5,\\quad A = A_1A_2 = 214\\times18.5 \\approx 3952', hl: [T([290, 300, 220, 420, C.green])] },
      { t: 38, ans: true, title: `**Answers:** $V_X = V_Y = ${fx(vx, 4)}$ V · $(W/L)_{1-4} = ${fx(ans('bank-t3q3', 'wlN'), 3)}$ · $(W/L)_{5-8} = ${fx(ans('bank-t3q3', 'wlP'), 3)}$ (equal headroom split) · $A ≈ ${fx(ans('bank-t3q3', 'av'), 3)}$`, say: 'The question doesn’t say how to split the headroom; equal sharing is the natural exam assumption. State it in one line.' },
    ],
  });
}, { q: 'Tutorial 3 Q3' });

/* regulated cascode with a CS booster (implementation 1); labels as Tutorial 4 Q1 */
function regCascode(S, o = {}) {
  const g = S.g(); const r = S.into(g);
  rail(S, 160, 760, 170);
  const xo = 560;
  isrc(S, xo, 230, { label: o.iout || 'I_2' }); wire(S, [[xo, 170], [xo, 188]]);
  dot(S, xo, 300); wire(S, [[xo, 272], [xo, 330]]); wire(S, [[xo, 300], [680, 300]]); txt(S, 690, 307, 'V_out', { size: 22, color: C.volt, weight: 700 });
  const m2 = nmos(S, xo, 380, { name: 'M2', gl: 60 });
  dot(S, xo, 460); wire(S, [[xo, 430], [xo, 490]]);
  txt(S, xo + 14, 470, 'X', { size: 22, color: C.bad, weight: 750 });
  nmos(S, xo, 540, { name: 'M1', gate: 'V_in', right: true, nameSide: 'l' }); gnd(S, xo, 590);
  // booster M3 with its load
  const xa = 330;
  isrc(S, xa, 260, { label: o.iaux || 'I_1', left: true }); wire(S, [[xa, 170], [xa, 218]]);
  wire(S, [[xa, 302], [xa, 490]]); dot(S, xa, 380);
  wire(S, [[xa, 380], [m2.gate[0], 380]]);
  if (o.pname) txt(S, xa - 14, 387, o.pname, { size: 22, color: C.bad, weight: 750, anchor: 'end' }); // node name when the paper prints one
  const m3 = nmos(S, xa, 540, { name: 'M3', right: true, gl: 40, nameSide: 'l' });
  wire(S, [[m3.gate[0], 540], [470, 540], [470, 460], [xo, 460]]);
  gnd(S, xa, 590);
  r();
  return { g };
}

/* branch currents on regCascode (figure at y + 90): the main branch carries I_2, the booster branch I_1; the two meet only at gates */
const REG_CUR = { tf: 'translate(0 90)', list: [
  [[[560, 180], [560, 585]], 'I_2', { color: C.cur, at: [510, 300] }],
  [[[330, 180], [330, 585]], 'I_1', { color: C.amb, at: [265, 440] }],
] };
/* Follow the current, regulated cascode (numbers of Tutorial 4 Q1: I_1 = 100 µA, I_2 = 0.5 mA); figure at y + 90 */
scene(L7, 'Follow the current: regulated cascode (booster M3)', 56, (S) => {
  header(S, 'LEC 7 · FOLLOW THE CURRENT', 'Regulated cascode: two branches, joined only by gates');
  const c = regCascode(S); c.g.setAttribute('transform', 'translate(0 90)');
  S.draw(c.g, 0.3, 2.2);
  S.say(0.3, 'Before Tutorial 4 Q1, follow the currents in the regulated cascode. Two separate branches hang from $V_{DD}$: the main one on the right, the booster M3 on the left.');
  current(S, [[560, 262], [560, 680]], 5, null, 'I_2 = 0.5 mA', { color: C.cur, at: [740, 340] });
  S.say(5, 'The main branch: the source $I_2 = 0.5$ mA feeds the output node, then runs down through M2 and M1 to ground. In an NMOS, drain to source: downwards.');
  current(S, [[330, 262], [330, 680]], 11, null, 'I_1 = 100 µA', { color: C.amb, at: [205, 470] });
  S.say(11, 'The booster branch: $I_1 = 100\\,\\mu$A flows down through M3 alone. It is a separate, much smaller current.');
  S.ring(470, 590, 15, C.volt, 17, 24); S.ring(445, 470, 15, C.volt, 17, 24);
  S.say(17, 'The wires between the branches end only on <b>gates</b>: X goes to M3’s gate, and the node above M3 goes to M2’s gate. Gates take no current.');
  S.stop(23, {
    q: 'How much DC current flows through M1? ($I_1 = 100\\,\\mu$A, $I_2 = 0.5$ mA.)',
    answer: 0.5e-3, unit: 'A', tol: 0.02,
    hint: ['List every wire that touches node X, and ask which of them can carry current.', 'KCL at X: $I_{D1} = I_{D2} + (\\text{current into M3’s gate})$, and a gate takes none.'],
    how: [
      'Node X has three wires: M2’s source above, M1’s drain below, and the wire to M3’s gate.',
      'A gate is an insulator, so the wire to M3 carries no DC current.',
      'KCL at X then leaves $$I_{D1} = I_{D2} = I_2 = 0.5\\,\\text{mA}$$',
      'The trap is adding the booster current ($0.5 + 0.1 = 0.6$ mA): $I_1$ flows only through M3 and never reaches M1.',
    ],
    why: 'Branches joined only by gates never share current. Supply current here: $I_1 + I_2 = 0.6$ mA.',
  });
  eqAt(S, 'I_{D1} = I_{D2} = I_2,\\qquad I_{D3} = I_1', 1180, 300, 23.4, { size: 32, w: 700 });
  S.say(23.4, 'M1 carries only $I_2$: KCL at X gives $I_{D1} = I_{D2}$. The booster’s 100 µA never leaves its own branch.');
  S.say(30, 'Now the boosting, told in currents. Suppose $V_{out}$ is pushed up a little: M2 lets a tiny extra current down, and X starts to rise.');
  const xu = chip(S, 650, 520, 'X rises', { color: C.bad, size: 17 }); xu.style.opacity = 0; S.pop(xu, 30);
  S.stop(36, {
    q: 'X rises a little. M3 (gate on X) now wants more current than the $I_1$ its source supplies. Which way does M2’s gate move, and what does that do to M2’s current?',
    choices: ['Up: M2 passes even more current', 'Down: $V_{GS2}$ shrinks and M2 throttles the extra current back', 'It stays put: M3 only affects its own branch'],
    answer: 1,
    hint: ['M3’s drain node is the same node as M2’s gate. KCL there: $I_1$ in, $I_{D3}$ out.', 'If M3 wants more than $I_1$ gives, that node’s voltage must fall.'],
    how: [
      'X up ⇒ M3’s $V_{GS}$ up ⇒ M3 wants more current than the fixed source $I_1$ supplies.',
      'KCL at M3’s drain: only $I_1$ comes in, so the node voltage falls. That node is M2’s gate: it goes <b>down</b>.',
      'M2’s source (X) went up and its gate went down, so $V_{GS2}$ shrinks a lot: M2 cuts the extra current back.',
      '“It stays put” is the trap: M3’s branch carries no current to M2, but it moves M2’s gate <b>voltage</b>. Result: $R_{out}$ grows by $(1 + A_1)$, the Lec 7 picture.',
    ],
    why: 'The booster holds X still by moving M2’s gate the opposite way.',
  });
  const gd = chip(S, 420, 430, 'gate falls', { color: C.ok, size: 17 }); gd.style.opacity = 0; S.pop(gd, 36.4);
  S.say(36.4, 'M2’s gate falls while X rises, so M2 fights the change $(1 + A_1)$ times harder. Very little extra current gets through: the output looks like a huge resistance.');
  l7Remember(S, [
    'Two branches: main $I_2$ through M2 and M1; booster $I_1$ through M3 alone. Both flow **down**.',
    'They touch only at **gates** (X → M3’s gate, M3’s drain → M2’s gate): no current crosses.',
    'KCL at X: $I_{D1} = I_{D2} = I_2$. Supply current $= I_1 + I_2$.',
    'Boosting in currents: X up ⇒ M3 pulls more than $I_1$ ⇒ M2’s gate down ⇒ M2 cuts the extra current.',
  ], 44, 'Currents in the regulated cascode');
  S.say(44, 'The current rules of the regulated cascode. Now the numbers of Tutorial 4 Q1.');
});

scene(L7, 'Tutorial 4 Q1(b): the boosted R_out with numbers', 66, (S) => {
  const T = tfm(1, 0, 90);
  const gm = Math.sqrt(2 * 172.35e-6 * 200 * 0.5e-3);      // M1, M2 at I_2 = 0.5 mA
  const A1 = Math.sqrt(2 * 172.35e-6 * 200 * 100e-6) / (0.1 * 100e-6); // g_m3 r_O3 at I_1 = 100 µA
  const gm3 = Math.sqrt(2 * 172.35e-6 * 200 * 100e-6), rO3 = 1 / (0.1 * 100e-6), rO = 1 / (0.1 * 0.5e-3);
  const Rout = ans('bank-t4q1', 'av') / gm, rOP = 1 / (0.2 * 0.5e-3);
  pyqFrame(S, {
    paper: 't4q1', tag: 'LEC 7 · PAST PAPER 3 OF 3', title: 'Regulated cascode: how big does R_out get?', src: 'Tutorial 4 Q1 (b), (c)',
    q: 'M3 (gate on X, loaded by $I_1 = 100\\,\\mu$A) drives M2’s gate; $I_2 = 0.5$ mA. $(W/L)_{1-3} = 200$. (b) Gain with ideal sources. (c) With a PMOS source for $I_2$ ($\\lambda_p = 0.2$ V⁻¹), the gain.',
    giv: '$\\mu_nC_{ox} = 172.35\\,\\mu$A/V², $V_{thn} = 0.7$ V, $\\lambda_n = 0.1$ V⁻¹, $V_{DD} = 3$ V. PMOS source for (c): $\\lambda_p = 0.2$ V⁻¹, carrying $I_2 = 0.5$ mA.', qh: 250,
    tests: 'the Lec 7 boosted-$R_{out}$ formula with real numbers, and the **load trap**.',
    currents: REG_CUR,
    fig: (S2) => { const c = regCascode(S2); c.g.setAttribute('transform', 'translate(0 90)'); },
    steps: [
      { t: 7, title: '**The booster is M3**: a CS stage (gate on X, drain on M2’s gate) with an ideal load, so its gain is $g_{m3}r_{O3}$ at $I_1 = 100\\,\\mu$A.',
        tex: 'g_{m3} = \\sqrt{2(172.35\\,\\mu)(200)(100\\,\\mu)} = 2.63\\,\\text{mS},\\quad r_{O3} = \\frac{1}{0.1\\times100\\,\\mu} = 100\\,\\text{k},\\quad A_1 = g_{m3}r_{O3} = 2.63\\,\\text{m}\\times100\\,\\text{k} = 263', hl: [T([250, 320, 170, 300, C.amb])],
        try: {
          q: '**(b)** The booster M3 is a common-source stage loaded by the ideal source $I_1 = 100\\,\\mu$A. What is its gain $A_1$?',
          answer: A1, unit: '', tol: 0.02,
          parts: [
            { q: 'First: $g_{m3}$ of M3 at $I_1 = 100\\,\\mu$A?', answer: gm3, unit: 'S', tol: 0.02, hint: '$g_{m3} = \\sqrt{2\\mu_nC_{ox}(W/L)I_1}$', how: ['$$g_{m3} = \\sqrt{2(172.35\\,\\mu)(200)(100\\,\\mu)} = 2.63\\,\\text{mS}$$'] },
            { q: '$r_{O3}$ of M3 at 100 µA?', answer: rO3, unit: 'Ω', tol: 0.02, hint: '$r_O = 1/(\\lambda_nI_D)$', how: ['$$r_{O3} = \\frac{1}{0.1\\times100\\,\\mu} = 100\\,\\text{k}\\Omega$$'] },
          ],
          hint: ['Ideal current-source load: the only resistance at M3’s drain is its own $r_{O3}$.', '$A_1 = g_{m3}r_{O3}$, with $g_{m3} = \\sqrt{2\\mu_nC_{ox}(W/L)I_1}$ and $r_{O3} = 1/(\\lambda_nI_1)$.'],
          how: [
            'M3’s gate watches X and its drain drives M2’s gate: a CS stage. An ideal load adds no resistance, so the gain is $g_{m3}r_{O3}$.',
            '$$g_{m3} = \\sqrt{2\\mu_nC_{ox}\\tfrac{W}{L}I_1} = \\sqrt{2(172.35\\,\\mu)(200)(100\\,\\mu)} = 2.63\\,\\text{mS}$$',
            '$$r_{O3} = \\frac{1}{\\lambda_nI_1} = \\frac{1}{0.1\\times100\\,\\mu} = 100\\,\\text{k}\\Omega$$',
            '$$A_1 = g_{m3}r_{O3} = 2.63\\,\\text{m}\\times100\\,\\text{k} = 263$$',
          ],
          why: 'A small bias current gives a large $r_O$: a big booster gain for very little power.',
        },
        say: 'Spot the booster: M3 watches X and drives M2’s gate. It is a CS stage with an ideal load: $A_1 = g_{m3}r_{O3} ≈ 263$.' },
      { t: 15, title: '**Plug into the Lec 7 boosted formula** with $R_S = r_{O1}$ (M1 sits under M2’s source). M1 and M2 carry $I_2 = 0.5$ mA.',
        tex: 'g_{m2} = \\sqrt{2(172.35\\,\\mu)(200)(0.5\\,\\text{m})} = 5.87\\,\\text{mS},\\quad r_{O1} = r_{O2} = \\tfrac{1}{0.1\\times0.5\\,\\text{m}} = 20\\,\\text{k},\\quad R_{out} = r_{O1} + r_{O2} + (1 + A_1)g_{m2}r_{O2}r_{O1} = 40\\,\\text{k} + 264\\times5.87\\,\\text{m}\\times20\\,\\text{k}\\times20\\,\\text{k} = 619\\,\\text{M}\\Omega', hl: [T([470, 320, 190, 300, C.n])],
        try: {
          q: '**(b)** Using $A_1$ from the last part, what is the output resistance $R_{out}$ looking down into M2’s drain? (M1 and M2 carry $I_2 = 0.5$ mA.)',
          answer: Rout, unit: 'Ω', tol: 0.03,
          parts: [
            { q: 'First: $g_{m2}$ of M2 at $I_2 = 0.5$ mA?', answer: gm, unit: 'S', tol: 0.02, hint: '$g_{m2} = \\sqrt{2\\mu_nC_{ox}(W/L)I_2}$', how: ['$$g_{m2} = \\sqrt{2(172.35\\,\\mu)(200)(0.5\\,\\text{m})} = 5.87\\,\\text{mS}$$'] },
            { q: '$r_{O1} = r_{O2}$ at 0.5 mA?', answer: rO, unit: 'Ω', tol: 0.02, hint: '$r_O = 1/(\\lambda_nI_D)$', how: ['$$r_{O1} = r_{O2} = \\frac{1}{0.1\\times0.5\\,\\text{m}} = 20\\,\\text{k}\\Omega$$'] },
          ],
          hint: ['This is the Lec 7 boosted result, with M1 as the resistance under M2’s source: $R_S = r_{O1}$.', '$R_{out} = r_{O1} + r_{O2} + (1 + A_1)g_{m2}r_{O2}r_{O1}$; the last term is the one that matters.'],
          how: [
            'M1 and M2 at 0.5 mA: $$g_{m2} = \\sqrt{2(172.35\\,\\mu)(200)(0.5\\,\\text{m})} = 5.87\\,\\text{mS},\\quad r_{O1} = r_{O2} = \\frac{1}{0.1\\times0.5\\,\\text{m}} = 20\\,\\text{k}\\Omega$$',
            'Lec 7 boosted cascode, with $R_S = r_{O1}$: $$R_{out} = r_{O1} + r_{O2} + (1 + A_1)g_{m2}r_{O2}r_{O1}$$',
            'Put in the numbers ($1 + A_1 = 264$): $$R_{out} = 40\\,\\text{k} + 264\\times5.87\\,\\text{m}\\times20\\,\\text{k}\\times20\\,\\text{k} = 619\\,\\text{M}\\Omega$$',
          ],
          why: 'A plain cascode gives $g_mr_O^2$ ≈ 2.35 MΩ; the booster multiplies it by $(1 + A_1)$ ≈ 264.',
          calc: [{ what: 'R_out in one line (prefixes on)', keys: '40k + 263.6 × [√] ( 2 × 172.35µ × 200 × 0.5m ) × 20k × 20k', shows: '619.1M', note: 'Turn on [SETTINGS] ▸ Calc Settings ▸ Engineer Symbol so the result reads 619.1M (= 619 MΩ).' }],
        },
        say: '$R_{out} = r_{O1} + r_{O2} + (1 + A_1)g_{m2}r_{O2}r_{O1}$ ≈ 619 MΩ.' },
      { t: 23, title: '**(b) Gain with an ideal $I_2$**: M1’s current $g_{m1}v_{in}$ meets only $R_{out}$ ($g_{m1} = g_{m2}$, same size and current).',
        tex: 'g_{m1} = g_{m2} = 5.87\\,\\text{mS},\\quad |A_v| = g_{m1}R_{out} = 5.87\\,\\text{m}\\times619\\,\\text{M} = 3.63\\times10^{6}', say: 'Ideal load: the gain is $g_{m1}R_{out}$ — about 3.6 million.' },
      { t: 30, title: '**(c) The load trap:** a real PMOS source ($r_O = 10$ kΩ) sits **in parallel** with the 619 MΩ, and the small one wins.',
        tex: '|A_v| = g_{m1}(R_{out}\\parallel r_{O,P}) = 5.87\\,\\text{m}\\times(619\\,\\text{M}\\parallel10\\,\\text{k}) = 5.87\\,\\text{m}\\times10\\,\\text{k} = 58.7', hl: [T([470, 180, 190, 110, C.bad])],
        try: {
          q: '**(c)** Now $I_2$ is a real PMOS current source ($\\lambda_p = 0.2$ V⁻¹, carrying $I_2 = 0.5$ mA). What is the gain magnitude $|A_v|$?',
          answer: ans('bank-t4q1', 'avP'), unit: 'V/V', tol: 0.03,
          parts: [
            { q: 'First: $g_{m1}$ of the input device M1 (0.5 mA, $W/L = 200$, $\\mu_nC_{ox} = 172.35\\,\\mu$A/V²)?', answer: gm, unit: 'S', tol: 0.02, hint: ['M1 has the same size and current as M2, so the same $g_m$. With size and current given, use the square-law form.', '$g_m = \\sqrt{2\\mu_nC_{ox}(W/L)I_D}$'], how: ['$$g_{m1} = \\sqrt{2\\mu_nC_{ox}(W/L)I_D} = \\sqrt{2(172.35\\,\\mu)(200)(0.5\\,\\text{m})} = 5.87\\,\\text{mS}$$', 'Same $W/L$ and current as M2, so $g_{m1} = g_{m2}$.'] },
            { q: 'The PMOS source’s own output resistance $r_{O,P}$ ($\\lambda_p = 0.2$ V⁻¹, 0.5 mA)?', answer: rOP, unit: 'Ω', tol: 0.02, hint: ['Channel-length modulation of the PMOS current source.', '$r_O = \\frac{1}{\\lambda_p I_D}$'], how: ['$$r_{O,P} = \\frac{1}{\\lambda_p I_2} = \\frac{1}{0.2\\times0.5\\,\\text{m}} = 10\\,\\text{k}\\Omega$$'] },
            { q: 'The resistance at the output: $R_{out}\\parallel r_{O,P}$ (the boosted $R_{out}$ = 619 MΩ from above, in parallel with $r_{O,P}$)?', answer: Rout * rOP / (Rout + rOP), unit: 'Ω', tol: 0.02, hint: 'Parallel: $\\frac{ab}{a+b}$; when one is 60 000× bigger, the result is the small one.', how: ['$$619\\,\\text{M}\\parallel10\\,\\text{k} = \\frac{619\\,\\text{M}\\times10\\,\\text{k}}{619\\,\\text{M}+10\\,\\text{k}} \\approx 10.0\\,\\text{k}\\Omega$$'] },
          ],
          hint: ['The PMOS source’s $r_O$ hangs on the output node, in parallel with the boosted $R_{out}$. In a parallel pair the small one wins.', '$|A_v| = g_{m1}(R_{out}\\parallel r_{O,P})$'],
          how: [
            'The output node sees two resistances: looking down, the boosted 619 MΩ; looking up, the PMOS source’s 10 kΩ. They are in parallel.',
            'In a parallel pair the small one wins: $$R_{out}\\parallel r_{O,P} = 619\\,\\text{M}\\parallel10\\,\\text{k} \\approx 10\\,\\text{k}\\Omega$$',
            'M1 converts $v_{in}$ to current with $g_{m1} = 5.87$ mS (from the last part): $$|A_v| = g_{m1}(R_{out}\\parallel r_{O,P}) = 5.87\\,\\text{m}\\times10\\,\\text{k} = 58.7$$',
          ],
          why: 'A boosted cascode is only as good as its load: boost (or cascode) the load too, or the gain collapses.',
          calc: [{ what: 'Parallel and gain in one line', keys: '[√] ( 2 × 172.35µ × 200 × 0.5m ) × ( 619M [SHIFT][^] + 10k [SHIFT][^] ) [SHIFT][^]', shows: '58.71', note: '[SHIFT][^] is x⁻¹. Type M (Mega) and k with [CATALOG] ▸ Engineer Symbol.' }],
        },
        say: 'With a real PMOS current source, its 10 kΩ sits in parallel with 619 MΩ — the small one wins. Gain collapses to about 59.' },
      { t: 38, ans: true, title: `**Answers:** $A_1 ≈ ${fx(A1, 3)}$, $R_{out} ≈ ${fx(ans('bank-t4q1', 'av') / gm / 1e6, 3)}$ MΩ, $|A_v| ≈ ${fx(ans('bank-t4q1', 'av') / 1e6, 3)}\\times10^6$ (ideal) and $≈ ${fx(ans('bank-t4q1', 'avP'), 3)}$ with the PMOS load`, say: 'Exam tip: whenever you boost one side, look at the other side’s resistance before you multiply.' },
    ],
  });
}, { q: 'Tutorial 4 Q1' });
