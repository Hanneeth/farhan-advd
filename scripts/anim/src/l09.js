/* Lecture 9: boosters as amplifiers, differential boosting, the fully boosted telescopic, and why CMFB. */
'use strict';
const L9 = 'Lec 9 · Boosters & why CMFB';

/* a fully differential booster drawn as a box: inputs at the bottom corners, outputs at the top corners */
function dbox(S, x, y, w, h, lab, col = C.amb) {
  const g = S.g();
  S.el('rect', { x, y, width: w, height: h, rx: 12, fill: 'rgba(251,191,36,0.07)', stroke: col, 'stroke-width': 2.6 }, g);
  txt(S, x + w / 2, y + h / 2 + 8, lab, { size: 22, color: col, weight: 750, anchor: 'middle' }, g);
  return g;
}

/* the cascode pair of your Lec 9 page; mode 'two' (a booster per side) or 'one' (one differential booster) */
function pairBoost(S, mode) {
  const g = S.g(); const r = S.into(g);
  const L = 200, R = 480;
  const inward = mode === 'one';
  nmos(S, L, 260, { name: 'M3', right: inward, nameSide: inward ? 'l' : 'r' });
  nmos(S, R, 260, { name: 'M4', right: !inward, nameSide: inward ? 'r' : 'l' });
  wire(S, [[L, 210], [L, 175]]); wire(S, [[R, 210], [R, 175]]);
  txt(S, L, 166, 'V_out1', { size: 18, color: C.volt, anchor: 'middle' }); txt(S, R, 166, 'V_out2', { size: 18, color: C.volt, anchor: 'middle' });
  wire(S, [[L, 310], [L, 350]]); wire(S, [[R, 310], [R, 350]]); dot(S, L, 330); dot(S, R, 330);
  nmos(S, L, 400, { name: 'M1', gate: 'V_in1' }); nmos(S, R, 400, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[L, 450], [L, 470], [R, 470], [R, 450]]);
  isrc(S, 340, 515, { label: 'I_SS', len: 45 }); gnd(S, 340, 560);
  if (mode === 'two') {
    // label drawn by hand, further into the triangle, so it clears the + / − input signs
    amp(S, 30, 260, { w: 80, h: 90 }); txt(S, 82, 266, 'A₁', { size: 17, color: C.amb, weight: 700, anchor: 'middle' }); wire(S, [[110, 260], [136, 260]]);
    wire(S, [[L, 330], [16, 330], [16, 279], [30, 279]]);
    amp(S, 650, 260, { w: 80, h: 90, left: true }); txt(S, 598, 266, 'A₂', { size: 17, color: C.amb, weight: 700, anchor: 'middle' }); wire(S, [[570, 260], [544, 260]]);
    wire(S, [[R, 330], [664, 330], [664, 279], [650, 279]]);
  } else {
    dbox(S, 290, 222, 100, 120, 'A');
    wire(S, [[264, 260], [290, 260]]); wire(S, [[390, 260], [416, 260]]);
    wire(S, [[L, 330], [290, 330]]); wire(S, [[R, 330], [390, 330]]);
  }
  r();
  return g;
}

scene(L9, 'The booster is just another amplifier', 50, (S) => {
  header(S, 'LEC 9 · YOUR PAGE, TOP', 'A_aux = G_m,aux × R_out,aux — read it like any amplifier');
  const g = foldedBoost(S);
  S.fade(g, 0.2, 0.8);
  S.say(0.2, 'Lecture 9 opens with Lecture 8’s folded booster. Your page circles it in red and writes $A_{aux} = V_{out}/V_{in}$: treat it as an ordinary amplifier.');
  S.halo(170, 210, 410, 400, C.red, 4, null, 'A_aux = V_out / V_in');
  const ln = [
    ['A_v = G_mR_{out},\\quad G_m = g_{m1}', 8, 'The main amplifier, as always: $G_m = g_{m1}$ (the current divider of Lec 8)…'],
    ['R_{out} = (1 + A_{aux})\\,g_{m2}r_{O2}r_{O1}', 13, '…and the boosted output resistance.'],
    ['A_{aux} = G_{m,aux}R_{out,aux} = g_{m3}\\cdot g_{m4}r_{O4}r_{O3}', 18, 'The booster’s own gain, read the same way: its input device M3 gives $g_{m3}$; looking into M4’s drain you see a cascode, $g_{m4}r_{O4}r_{O3}$.'],
    ['A_v = g_{m1}\\left[1 + g_{m3}g_{m4}r_{O4}r_{O3}\\right]g_{m2}r_{O2}r_{O1}', 25, 'Substitute: your page’s final line. Roughly $(g_mr_O)^4$ — a cascode’s gain times a cascode’s gain.'],
  ];
  ln.forEach(([tex, t, say], i) => { eqAt(S, tex, 1170, 220 + i * 100, t, { size: i === 3 ? 28 : 32, w: 780, color: i === 3 ? '#ffd38a' : C.text }); S.say(t, say); });
  whyBox(S, 820, 660, 740, 150, '**Method for any boosted circuit:** find the main $G_m$, find the booster’s gain as $G_{m,aux}R_{out,aux}$, and multiply the cascode by $(1 + A_{aux})$.', 33);
  S.say(33, '<span class="why">Exam method:</span> main $G_m$, then the booster’s $G_{m,aux}R_{out,aux}$, then multiply the cascode’s resistance by $(1 + A_{aux})$.');
});

/* ── Follow the current: the scenes below trace every DC current of a circuit before it is used ── */
/* everything drawn after fcStart goes into one group that fades before the closing "remember" card */
function fcStart(S) { const all = S.g(); const back = S.into(all); return (t) => { back(); S.out(all, t, 0.5); }; }
const fcTex = (S, tex, x, y, t, o = {}) => eqAt(S, tex, x, y, t, { size: 28, w: 700, ...o });

scene(L9, 'Follow the current: boosted differential pair', 58, (S) => {
  header(S, 'LEC 9 · FOLLOW THE CURRENT', 'Boosted pair: the tail sets the current, the halves share it');
  const end = fcStart(S);
  const a = pairBoost(S, 'two'); a.setAttribute('transform', 'translate(60 140)'); S.draw(a, 0.3, 2);
  S.say(0.3, 'Before boosting anything, follow the DC current. Only one thing sets it here: the tail source at the bottom, which pulls $I_{SS}$ down into ground.');
  current(S, [[400, 612], [400, 698]], 2.6, null, 'I_SS', { at: [492, 712] });
  current(S, [[260, 318], [260, 610], [392, 610]], 7, 37, 'I_SS/2', { color: C.volt, at: [172, 650] });
  S.say(7, 'That current has to come down through the two halves. On the left it flows from the output node down through the cascode M3, then the input device M1. Both are NMOS: current goes in at the drain and out at the source, downwards.');
  current(S, [[540, 318], [540, 610], [408, 610]], 13, 37, 'I_SS/2', { color: C.pink, at: [628, 650] });
  S.say(13, 'The right half does the same through M4 and M2. With equal inputs the two halves are identical, so each carries half: $I_{SS}/2$.');
  fcTex(S, 'I_{SS} = I_{D1} + I_{D2} = \\tfrac{I_{SS}}{2} + \\tfrac{I_{SS}}{2}', 1170, 200, 18);
  S.say(18, 'KCL at the tail node: what leaves through the sink equals what arrives from the two halves.');
  S.ring(260, 470, 15, C.amb, 23, 36);
  S.say(23, 'Now the boosters. $A_1$ senses the node between M3 and M1 and drives M3’s gate. Does it change the current in the branch?');
  S.stop(28, { secs: 60, q: 'Compare the DC current in the cascode M3 with the current in the input device M1 below it.',
    choices: ['They are equal: $A_1$ only senses a node and drives a gate, so no DC current enters or leaves the branch', 'M3 carries less: part of M1’s current comes from $A_1$', 'M3 carries more: $A_1$ adds its own bias current'], answer: 0,
    hint: ['What does $A_1$ connect to? Its input is a node of the branch, its output is M3’s gate. How much DC current does a MOS gate draw?', 'KCL at the node between M3 and M1: $I_{D3} = I_{D1} + I_{into\\,A_1}$, and $I_{into\\,A_1} = 0$'],
    how: ['$A_1$’s input is a MOS gate inside the amplifier, and its output drives M3’s gate: gates draw no DC current.', 'KCL at the node between M3 and M1: $$I_{D3} = I_{D1} + 0 = \\tfrac{I_{SS}}{2}$$', 'The booster runs on its own bias current inside its triangle; that current never enters this branch. So "less" and "more" are both wrong.'],
    why: 'A booster changes voltages (it fixes the node), never the DC current of the branch.' });
  S.say(28.4, 'They are equal. Gates draw no DC current, so the booster neither adds nor takes current: one branch, one current, from the output node down to the tail.');
  current(S, [[260, 318], [260, 610], [392, 610]], 37, null, 'I_SS/2 + ΔI', { color: C.volt, at: [160, 650] });
  current(S, [[540, 318], [540, 610], [408, 610]], 37, null, 'I_SS/2 − ΔI', { color: C.pink, at: [640, 650] });
  fcTex(S, '\\left(\\tfrac{I_{SS}}{2} + \\Delta I\\right) + \\left(\\tfrac{I_{SS}}{2} - \\Delta I\\right) = I_{SS}', 1170, 290, 37);
  S.say(37, 'Now a small differential input: $V_{in1}$ up, $V_{in2}$ down. The left half takes $\\Delta I$ more and the right half $\\Delta I$ less. The tail still sinks exactly $I_{SS}$.');
  S.stop(44, { secs: 60, q: 'Take $I_{SS} = 1$ mA. A small differential input adds 20 µA to the left half. How much DC current now flows through the right cascode M4?', answer: 1e-3 - (0.5e-3 + 20e-6), unit: 'A', tol: 0.01,
    parts: [{ q: 'Current in the left half, $I_{D1}$, with the input applied?', answer: 0.5e-3 + 20e-6, unit: 'A', tol: 0.01, hint: 'At rest $I_{SS}/2$, plus the 20 µA.', how: ['$$I_{D1} = \\tfrac{1\\,\\text{mA}}{2} + 20\\,\\mu\\text{A} = 520\\,\\mu\\text{A}$$'] }],
    hint: ['The tail fixes the total: whatever the left half gains, the right half loses. M4 is in series with M2.', '$I_{D4} = I_{D2} = I_{SS} - I_{D1}$'],
    how: ['At rest each half carries half the tail: $$\\tfrac{I_{SS}}{2} = \\tfrac{1\\,\\text{mA}}{2} = 500\\,\\mu\\text{A}$$', 'The left half gains 20 µA: $$I_{D1} = 500 + 20 = 520\\,\\mu\\text{A}$$', 'KCL at the tail: the total stays $I_{SS}$: $$I_{D2} = I_{SS} - I_{D1} = 1000 - 520 = 480\\,\\mu\\text{A}$$', 'M4 is in series with M2 (the booster takes no current): $$I_{D4} = I_{D2} = 480\\,\\mu\\text{A}$$'] });
  S.say(44.4, '480 µA. In a pair, the two halves always change by the same amount in opposite directions.');
  end(49.4);
  remember(S, [
    'The tail sink sets the total: $I_{SS}$ leaves the pair through it.',
    'Each half (cascode + input device, in series) carries $I_{SS}/2$ at rest. NMOS: drain → source, downwards.',
    'A booster senses a node and drives a gate: no DC current enters or leaves the branch.',
    'Differential input: $I_{SS}/2 + \\Delta I$ and $I_{SS}/2 - \\Delta I$; the total stays $I_{SS}$.',
  ], 50, 'Follow the current · boosted pair');
  S.say(50, 'Remember: the tail sets the total, the halves share it, a booster only drives gates, and a differential input moves current from one side to the other.');
});

scene(L9, 'Boosting a differential pair: one booster for both sides', 58, (S) => {
  header(S, 'LEC 9 · DIFFERENTIAL BOOSTING', 'Two boosters (A₁ = A₂) ⇔ one differential booster');
  const a = pairBoost(S, 'two'); a.setAttribute('transform', 'translate(60 140)'); S.draw(a, 0.3, 2);
  S.say(0.3, 'A real op amp is differential. Each cascode (M3, M4) needs its own booster, and they must match: $A_1 = A_2$.');
  const eqs = txt(S, 800, 520, '⇔', { size: 60, color: C.amb, anchor: 'middle', weight: 800 }); eqs.style.opacity = 0; S.fade(eqs, 12, 0.5);
  const b = pairBoost(S, 'one'); b.setAttribute('transform', 'translate(860 140)'); S.draw(b, 12.5, 2);
  S.say(12.5, 'Your page draws an equivalent: <b>one</b> differential amplifier sitting between the two cascodes, watching both sources and driving both gates.');
  S.flow([[260, 470], [260, 430]], 20, 34, { color: C.volt, speed: 40 });
  label(S, 160, 760, 'X up, Y down', 20, { size: 20, color: C.volt, weight: 700, out: 34 });
  S.say(20, '<span class="why">Why one amplifier is enough:</span> for a differential signal, X and Y move in <b>opposite</b> directions — exactly what a differential amplifier is built to sense.');
  S.say(28, 'It sees X − Y and drives the two gates in opposite directions: both cascodes boosted, one amplifier.');
  whyBox(S, 860, 780, 680, 90, 'Same boost, half the hardware — but its own headroom cost (next).', 36);
  S.say(36, 'Half the hardware for the same boost. But that booster has inputs, and inputs have levels — which costs headroom. Next scene.');
});

/* the differential CS booster of the page (M5, M6, I_SS1) */
function diffCsBoost(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 180, 960, 140);
  const L = 420, R = 700;
  const m3 = nmos(S, L, 330, { name: 'M3' }); const m4 = nmos(S, R, 330, { name: 'M4', right: true });
  wire(S, [[L, 280], [L, 250]]); wire(S, [[R, 280], [R, 250]]);
  txt(S, L, 240, 'V_out1', { size: 19, color: C.volt, anchor: 'middle', weight: 700 }); txt(S, R, 240, 'V_out2', { size: 19, color: C.volt, anchor: 'middle', weight: 700 });
  wire(S, [[L, 380], [L, 440]]); wire(S, [[R, 380], [R, 440]]); dot(S, L, 410); dot(S, R, 410);
  txt(S, L + 12, 404, 'X', { size: 20, color: C.bad, weight: 750 }); txt(S, R - 12, 404, 'Y', { size: 20, color: C.bad, weight: 750, anchor: 'end' });
  nmos(S, L, 490, { name: 'M1', gate: 'V_in1', right: true, nameSide: 'l' }); nmos(S, R, 490, { name: 'M2', gate: 'V_in2', nameSide: 'r' });
  wire(S, [[L, 540], [L, 558], [R, 558], [R, 540]]);
  isrc(S, 560, 600, { label: 'I_SS', len: 42 }); gnd(S, 560, 642);
  // booster
  isrc(S, 250, 190, { label: 'I_1', left: true }); wire(S, [[250, 140], [250, 148]]);
  wire(S, [[250, 232], [250, 360]]); dot(S, 250, 330); wire(S, [[250, 330], [m3.gate[0], 330]]);
  const m5 = nmos(S, 250, 410, { name: 'M5', right: true, nameSide: 'l', gl: 40 });
  wire(S, [[m5.gate[0], 410], [L, 410]]);
  isrc(S, 870, 190, { label: 'I_2' }); wire(S, [[870, 140], [870, 148]]);
  wire(S, [[870, 232], [870, 360]]); dot(S, 870, 330); wire(S, [[870, 330], [m4.gate[0], 330]]);
  const m6 = nmos(S, 870, 410, { name: 'M6', nameSide: 'r', gl: 40 });
  wire(S, [[m6.gate[0], 410], [R, 410]]);
  wire(S, [[250, 460], [250, 700], [870, 700], [870, 460]]);
  isrc(S, 560, 742, { label: 'I_SS1', len: 42 }); gnd(S, 560, 784);
  r();
  return g;
}

scene(L9, 'Follow the current: differential CS booster', 62, (S) => {
  header(S, 'LEC 9 · FOLLOW THE CURRENT', 'Two circuits, two currents: the main pair and the booster');
  const end = fcStart(S);
  const g = diffCsBoost(S); S.draw(g, 0.3, 2.4);
  S.say(0.3, 'This picture holds two circuits, and each has its own current. Start with the main pair: its tail source pulls $I_{SS}$ out of the bottom node.');
  current(S, [[560, 560], [560, 640]], 2.6, null, 'I_SS', { at: [488, 615] });
  current(S, [[420, 254], [420, 558], [552, 558]], 6, null, 'I_SS/2', { color: C.volt, at: [330, 615] });
  current(S, [[700, 254], [700, 558], [568, 558]], 8, null, 'I_SS/2', { color: C.volt, at: [792, 615] });
  fcTex(S, 'I_{SS} = I_{D1} + I_{D2}', 1290, 200, 8, { w: 520 });
  S.say(6, 'It comes down the two halves: M3 then M1 on the left, M4 then M2 on the right. $I_{SS}/2$ each, flowing down through each NMOS from drain to source.');
  current(S, [[250, 143], [250, 700], [552, 700]], 13, 38, 'I_1', { color: C.amb, at: [180, 600] });
  S.say(13, 'Now the booster. On the left, the source $I_1$ hangs from $V_{DD}$ and pushes its current down into M5’s drain, straight through M5 and on to the booster’s own tail.');
  current(S, [[870, 143], [870, 700], [568, 700]], 18, 38, 'I_2', { color: C.amb, at: [940, 600] });
  current(S, [[560, 702], [560, 782]], 18, null, 'I_SS1', { color: C.pink, at: [482, 760] });
  S.say(18, 'M6 and $I_2$ do the same on the right, and both land in the booster’s tail $I_{SS1}$.');
  fcTex(S, 'I_{SS1} = I_{D5} + I_{D6}', 1290, 270, 22, { w: 520 });
  S.say(22, 'KCL at the booster’s tail: $I_{SS1} = I_{D5} + I_{D6}$. So what must the load $I_1$ be?');
  S.stop(27, { secs: 60, q: 'The booster’s tail is $I_{SS1} = 40\\,\\mu$A and its two halves are identical. What current must the load source $I_1$ supply?', answer: 20e-6, unit: 'A', tol: 0.01,
    hint: ['At M5’s drain node only two currents meet: $I_1$ coming in from above and M5’s drain current going out below. M3’s gate is also on that node but draws nothing.', '$I_1 = I_{D5}$,\\; $I_{D5} = \\tfrac{I_{SS1}}{2}$'],
    how: ['Identical halves share the booster’s tail equally: $$I_{D5} = I_{D6} = \\frac{I_{SS1}}{2} = \\frac{40\\,\\mu\\text{A}}{2} = 20\\,\\mu\\text{A}$$', 'KCL at M5’s drain node (M3’s gate takes no current): $$I_1 = I_{D5} = 20\\,\\mu\\text{A}$$'],
    why: 'Load and tail must agree: $I_1 = I_2 = I_{SS1}/2$.' });
  fcTex(S, 'I_1 = I_{D5} = \\tfrac{I_{SS1}}{2}', 1290, 340, 27.4, { w: 520, color: '#ffd38a' });
  S.say(27.4, '20 µA: half the booster’s tail. At M5’s drain node $I_1$ comes in and M5 takes it out; M3’s gate takes nothing.');
  S.say(33, 'Now let X rise a little (a signal at the main pair). M5’s gate is X, so M5 tries to carry more.');
  S.stop(38, { secs: 45, q: 'X rises a little, so M5 carries a little more current, $\\Delta I$. What happens to the current in M6?',
    choices: ['It falls by the same $\\Delta I$: the booster’s tail $I_{SS1}$ is fixed', 'It stays at $I_{SS1}/2$', 'It rises by $\\Delta I$ too'], answer: 0,
    hint: ['M5 and M6 share one tail. Can the total change?', '$I_{D6} = I_{SS1} - I_{D5}$'],
    how: ['M5 and M6 share the booster’s tail, which is fixed: $$I_{D5} + I_{D6} = I_{SS1}$$', 'If M5 gains $\\Delta I$, then $$I_{D6} = I_{SS1} - \\left(\\tfrac{I_{SS1}}{2} + \\Delta I\\right) = \\tfrac{I_{SS1}}{2} - \\Delta I$$', '"Stays" and "rises" would both break KCL at the tail.'] });
  current(S, [[250, 143], [250, 700], [552, 700]], 38.4, null, 'I_SS1/2 + ΔI', { color: C.amb, at: [160, 600] });
  current(S, [[870, 143], [870, 700], [568, 700]], 38.4, null, 'I_SS1/2 − ΔI', { color: C.amb, at: [960, 600] });
  S.say(38.4, 'M6 loses the $\\Delta I$ that M5 gains. And M5 now wants more than $I_1$ supplies, so it pulls M3’s gate node down: the booster fights the rise of X. That is the boost.');
  S.say(46, 'Notice: no booster current ever enters the main branch. The two circuits touch only at gates, M5’s gate on X and M3’s gate on M5’s drain, and gates draw no DC current.');
  end(51.4);
  remember(S, [
    'Two separate currents: the main pair ($I_{SS}$, $I_{SS}/2$ per side) and the booster ($I_{SS1}$, $I_{SS1}/2$ per side).',
    'Booster loads must match its tail: $I_1 = I_2 = I_{SS1}/2$ (KCL at M5’s drain; M3’s gate takes nothing).',
    'Signal: M5 gains $\\Delta I$, M6 loses $\\Delta I$; the tail total never changes.',
    'Booster and main pair connect only through gates: no DC current passes between them.',
  ], 52, 'Follow the current · differential CS booster');
  S.say(52, 'Remember: two circuits, two currents. The booster’s loads equal half its tail, a signal moves current from M6 to M5, and the booster only touches the main pair through gates.');
});

scene(L9, 'Differential booster with M5, M6: the headroom bill', 64, (S) => {
  header(S, 'LEC 9 · YOUR PAGE, RED CIRCLE', 'A differential CS booster: V_out,min = V_ISS1 + V_GS5 + V_ov3');
  const g = diffCsBoost(S);
  S.draw(g, 0.3, 2.4);
  S.say(0.3, 'The simplest differential booster: a pair M5, M6 with its own tail $I_{SS1}$ and loads $I_1$, $I_2$. M5’s gate watches X, its drain drives M3’s gate (same on the right).');
  S.say(8, 'Sign check: X rises → M5 conducts more → M3’s gate is pulled down → M3 fights back. Correct.');
  // the walk up from ground
  const sc = 230, yb = 820, x0 = 1150;
  const tw = tower(S, x0, yb, [{ v: 0.2, name: 'I_SS1', st: 'min', note: 'check: V_ISS1' }, { v: 0.7, name: 'M5', st: 'diode', note: 'link: V_GS5 to X' }, { v: 0.2, name: 'M3', st: 'sq', note: 'check: V_ov3' }], sc, { w: 100, nodes: ['0', '0.2', 'X 0.9', 'V_out,min 1.1'] });
  tw.style.opacity = 0; S.fade(tw, 14, 0.8);
  S.say(14, '<span class="why">The cost.</span> Walk up from ground to the lowest output: the booster’s tail needs its $V_{ISS1}$ (a check)…');
  S.say(20, '…then up a <b>link</b>: M5’s gate is X, a whole $V_{GS5}$ above M5’s source. So X sits at $V_{ISS1} + V_{GS5}$…');
  S.say(26, '…then the cascode M3 needs its own $V_{ov3}$ above X.');
  eqAt(S, 'V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}', 1240, 280, 30, { size: 34, w: 640, color: '#ffb36b' });
  S.say(30, 'Your page’s line: $V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}$ — with our numbers 1.1 V, against 0.4 V for a plain cascode.');
  whyBox(S, 960, 340, 560, 150, '**Every booster input is a level question:** walk up from ground — a $V_{ov}$ per channel (check), a $V_{GS}$ per gate (link).', 38);
  S.say(38, 'The general rule: whenever a booster’s gate sits on a cascode source, that source must hold the booster’s whole input stack up. The fix is a booster whose input works at low levels — next.');
});

/* the folded-cascode auxiliary of the page (M5, M7, M9, M11, M13) */
function foldedAuxFull(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 380, 980, 160);
  const xa = 500;
  pmos(S, xa, 210, { name: 'M13', gate: 'V_b4' }); wire(S, [[xa, 160], [xa, 160]]);
  pmos(S, xa, 310, { name: 'M11', gate: 'V_b3' });
  wire(S, [[xa, 360], [xa, 390]]); dot(S, xa, 370);
  nmos(S, xa, 440, { name: 'M7', gate: 'V_b1' });
  wire(S, [[xa, 490], [xa, 530]]); dot(S, xa, 510); txt(S, xa - 12, 516, 'F', { size: 20, color: C.bad, weight: 750, anchor: 'end' });
  nmos(S, xa, 580, { name: 'M9', gate: 'V_b2' }); gnd(S, xa, 630);
  // input M5 with its local tail
  isrc(S, 700, 440, { label: 'I_T', len: 34 }); wire(S, [[680, 406], [720, 406]], { w: 3 }); txt(S, 700, 396, 'V_DD', { size: 15, color: C.muted, anchor: 'middle' });
  const m5 = pmos(S, 700, 524, { name: 'M5', right: true, gl: 40, nameSide: 'l' });
  wire(S, [[700, 474], [700, 474]]);
  wire(S, [[700, 574], [700, 610], [580, 610], [580, 510], [xa, 510]]);
  // main cascode
  const xm = 920;
  const m3 = nmos(S, xm, 370, { name: 'M3', gl: 50 });
  wire(S, [[xm, 320], [xm, 220]]); arrow(S, xm + 40, 230, xm + 40, 280, { color: C.n, w: 2.4, head: 10 }); txt(S, xm + 50, 248, 'R_out', { size: 20, color: C.n, weight: 700 });
  wire(S, [[xa, 370], [800, 370], [800, 370], [m3.gate[0], 370]]);
  wire(S, [[xm, 420], [xm, 480]]); dot(S, xm, 450); txt(S, xm + 12, 456, 'X', { size: 20, color: C.bad, weight: 750 });
  wire(S, [[m5.gate[0], 524], [800, 524], [800, 450], [xm, 450]]);
  nmos(S, xm, 530, { name: 'M1', gate: 'V_in', right: true, nameSide: 'l' }); gnd(S, xm, 580);
  r();
  return g;
}

scene(L9, 'Follow the current: folded-cascode booster', 58, (S) => {
  header(S, 'LEC 9 · FOLLOW THE CURRENT', 'Folded booster: two currents in at F, one out');
  const end = fcStart(S);
  const g = foldedAuxFull(S); g.setAttribute('transform', 'translate(-300 40)'); S.draw(g, 0.3, 2.4);
  S.say(0.3, 'The folded-cascode booster has three currents to follow. First the input: the source $I_T$ hangs from $V_{DD}$ and pushes its current through the PMOS input M5 — PMOS current flows from source to drain, downwards — and then folds over into node F.');
  current(S, [[400, 450], [400, 650], [280, 650], [280, 550], [205, 550]], 3, 40, 'I_D5', { color: C.p, at: [340, 690] });
  current(S, [[200, 203], [200, 548]], 9, 40, 'I_D7', { color: C.n, at: [300, 300] });
  S.say(9, 'Second, the cascode branch: from $V_{DD}$ down through the PMOS load M13 and M11, then the NMOS cascode M7, into the same node F.');
  current(S, [[200, 552], [200, 668]], 14, null, 'I_D9', { color: C.cur, at: [120, 705] });
  S.say(14, 'Third, the sink M9 under F. Its current is fixed by its gate bias $V_{b2}$. Everything that arrives at F leaves through M9.');
  fcTex(S, 'I_{D9} = I_{D5} + I_{D7}', 1150, 200, 18, { w: 600 });
  S.say(18, 'KCL at the fold node: $I_{D9} = I_{D5} + I_{D7}$. Two currents in, one out — the folded-cascode signature.');
  current(S, [[620, 265], [620, 618]], 22, null, 'I_D1', { color: C.volt, at: [555, 320] });
  S.say(22, 'The main cascode M3 over M1 carries its own current from the load above. The booster touches it only at gates: M5’s gate on X, and M3’s gate driven from the booster’s output. Gates draw no DC current.');
  S.stop(29, { secs: 60, q: 'Take the 2024 mid-sem numbers: the input device M5 carries 10 µA and the cascode branch M13–M11–M7 carries 10 µA. How much must the sink M9 carry?', answer: 20e-6, unit: 'A', tol: 0.01,
    hint: ['Which currents meet at node F, and which device is the only way out?', '$I_{D9} = I_{D5} + I_{D7}$'],
    how: ['Two branches arrive at F: the folded input current and the cascode current: $$I_{D5} = 10\\,\\mu\\text{A},\\quad I_{D7} = 10\\,\\mu\\text{A}$$', 'M9 is the only path from F to ground, so KCL at F: $$I_{D9} = I_{D5} + I_{D7} = 10 + 10 = 20\\,\\mu\\text{A}$$'],
    why: 'In a folded cascode the bottom source carries the sum: size it for both branches.' });
  S.say(29.4, '20 µA: 10 from each branch. In the mid-sem paper the same sink is called M3, and the input is called M7.');
  S.say(35, 'Now a signal: X rises. M5 is PMOS, so a higher gate means a smaller $|V_{GS}|$: M5 loses a little current, $\\Delta I$.');
  S.stop(40, { secs: 45, q: 'X rises, so the PMOS input M5 carries $\\Delta I$ less. M9 is fixed by $V_{b2}$. What happens to the current in the cascode M7?',
    choices: ['It gains the same $\\Delta I$: $I_{D7} = I_{D9} - I_{D5}$', 'It loses $\\Delta I$ too', 'Nothing: M7’s gate is fixed at $V_{b1}$'], answer: 0,
    hint: ['Use KCL at F with $I_{D9}$ fixed.', '$I_{D7} = I_{D9} - I_{D5}$'],
    how: ['M9’s current cannot change (fixed gate bias): $$I_{D9} = I_{D5} + I_{D7} = \\text{const}$$', 'So if $I_{D5}$ falls by $\\Delta I$: $$I_{D7} = I_{D9} - (I_{D5} - \\Delta I) = I_{D7,0} + \\Delta I$$', 'M7’s fixed gate does not fix its current: its source F moves slightly to let the extra $\\Delta I$ through.'] });
  current(S, [[400, 450], [400, 650], [280, 650], [280, 550], [205, 550]], 40.4, null, 'I_D5 − ΔI', { color: C.p, at: [340, 690] });
  current(S, [[200, 203], [200, 548]], 40.4, null, 'I_D7 + ΔI', { color: C.n, at: [318, 300] });
  S.say(40.4, 'M7 gains exactly the $\\Delta I$ that M5 lost. The PMOS load above supplies a fixed current, so the extra pull drags the booster’s output down, and that output is M3’s gate. X rose, M3’s gate falls: the booster pushes back.');
  end(49.4);
  remember(S, [
    'Input branch: $I_T$ → PMOS M5 (source → drain, downwards) → fold node F.',
    'Cascode branch: $V_{DD}$ → M13, M11 (PMOS) → M7 (NMOS, drain → source) → F.',
    'KCL at F: $I_{D9} = I_{D5} + I_{D7}$. M9 is fixed, so what M5 loses, M7 gains.',
    'Booster and main cascode meet only at gates: no DC current between them.',
  ], 50, 'Follow the current · folded-cascode booster');
  S.say(50, 'Remember: two currents fold into F and M9 sinks their sum; when the input loses current, the cascode branch gains it.');
});

scene(L9, 'A whole folded cascode as the booster', 62, (S) => {
  header(S, 'LEC 9 · YOUR PAGE, MIDDLE', 'Folded-cascode booster: look up, look down, multiply');
  const g = foldedAuxFull(S); g.setAttribute('transform', 'translate(-300 40)');
  S.draw(g, 0.3, 2.4);
  S.halo(140, 160, 480, 520, C.red, 3, null, 'booster (red loop on your page)');
  S.say(0.3, 'The best booster we know is a full <b>folded cascode</b>. Your page: PMOS input M5 (gate on X), NMOS cascode M7, bottom source M9, PMOS cascode load M11 on M13.');
  S.say(9, 'Its output (node between M11 and M7) drives the main cascode M3’s gate. Read its gain exactly like Lec 5–6.');
  const up = arrow(S, 160, 400, 160, 300, { color: C.p }); S.fade(up, 14, 0.4);
  const cu = chip(S, 1150, 250, 'look up:  R_up,aux = g_m11 r_O11 r_O13', { color: C.p, size: 21 }); cu.style.opacity = 0; S.pop(cu, 14);
  const dn = arrow(S, 160, 420, 160, 540, { color: C.n }); S.fade(dn, 18, 0.4);
  const cd = chip(S, 1150, 320, 'look down:  R_down,aux = g_m7 r_O7 (r_O9 ∥ r_O5)', { color: C.n, size: 21 }); cd.style.opacity = 0; S.pop(cd, 18);
  S.say(14, 'Looking <b>up</b> from its output: the PMOS cascode, $g_{m11}r_{O11}r_{O13}$.');
  S.say(18, 'Looking <b>down</b>: the NMOS cascode M7, with <b>two</b> resistances on its source (the fold node F): $r_{O9}\\parallel r_{O5}$ — the folded-cascode signature.');
  const ln = [
    ['A_{aux} = G_{m,aux}R_{out,aux} = g_{m5}\\left[R_{up,aux}\\parallel R_{down,aux}\\right]', 24],
    ['= g_{m5}\\left[g_{m11}r_{O11}r_{O13}\\parallel g_{m7}r_{O7}(r_{O9}\\parallel r_{O5})\\right]', 29],
    ['R_{out} = (1 + A_{aux})\\,g_{m3}r_{O3}r_{O1}', 34],
  ];
  ln.forEach(([tex, t], i) => eqAt(S, tex, 1160, 650 + i * 72, t, { size: 26, w: 860, color: i === 2 ? '#ffd38a' : C.text }));
  S.say(24, 'So $A_{aux} = g_{m5}[R_{up,aux}\\parallel R_{down,aux}]$ — your page’s two lines.');
  S.say(34, 'And the main cascode’s $R_{out} = (1 + A_{aux})g_{m3}r_{O3}r_{O1}$. This is exactly the circuit of the 2024 mid-sem Q4 (solved below).');
  S.say(44, '<span class="why">Why a PMOS input here?</span> M5’s gate sits on X, which is low (one $V_{ov}$ above ground). A PMOS input works there — Lec 6’s rule. Next scene uses that rule twice.');
});

/* telescopic with both cascodes boosted (A1 on the NMOS cascodes, A2 on the PMOS cascodes) */
function teleBoosted(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 420, 980, 150);
  const L = 560, R = 840;
  const m7 = pmos(S, L, 205, { name: 'M7', right: true, gl: 24, nameSide: 'l' }); const m8 = pmos(S, R, 205, { name: 'M8', gl: 24, nameSide: 'r' });
  wire(S, [[m7.gate[0], 205], [m8.gate[0], 205]]); txt(S, 700, 196, 'V_b', { size: 18, color: C.muted, anchor: 'middle' });
  wire(S, [[L, 150], [L, 155]]); wire(S, [[R, 150], [R, 155]]);
  wire(S, [[L, 255], [L, 280]]); wire(S, [[R, 255], [R, 280]]); dot(S, L, 268); dot(S, R, 268);
  pmos(S, L, 330, { name: 'M5', right: true, gl: 26, nameSide: 'l' }); pmos(S, R, 330, { name: 'M6', gl: 26, nameSide: 'r' });
  dbox(S, 640, 250, 120, 100, 'A₂', C.p);
  wire(S, [[L, 268], [640, 268]]); wire(S, [[R, 268], [760, 268]]); wire(S, [[616, 330], [640, 330]]); wire(S, [[760, 330], [784, 330]]);
  wire(S, [[L, 380], [L, 440]]); wire(S, [[R, 380], [R, 440]]); dot(S, L, 410); dot(S, R, 410);
  txt(S, L - 14, 416, 'V_out1', { size: 19, color: C.volt, weight: 700, anchor: 'end' }); txt(S, R + 14, 416, 'V_out2', { size: 19, color: C.volt, weight: 700 });
  nmos(S, L, 490, { name: 'M3', right: true, gl: 26, nameSide: 'l' }); nmos(S, R, 490, { name: 'M4', gl: 26, nameSide: 'r' });
  dbox(S, 640, 470, 120, 100, 'A₁', C.n);
  wire(S, [[616, 490], [640, 490]]); wire(S, [[760, 490], [784, 490]]);
  wire(S, [[L, 540], [L, 570]]); wire(S, [[R, 540], [R, 570]]); dot(S, L, 555); dot(S, R, 555);
  wire(S, [[L, 555], [640, 555]]); wire(S, [[R, 555], [760, 555]]);
  nmos(S, L, 620, { name: 'M1', gate: 'V_in1' }); nmos(S, R, 620, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[L, 670], [L, 690], [R, 690], [R, 670]]);
  isrc(S, 700, 730, { label: 'I_SS', len: 40 }); gnd(S, 700, 770);
  r();
  return g;
}

scene(L9, 'Follow the current: fully boosted telescopic', 48, (S) => {
  header(S, 'LEC 9 · FOLLOW THE CURRENT', 'Telescopic: one current runs the whole stack on each side');
  const end = fcStart(S);
  const g = teleBoosted(S); g.setAttribute('transform', 'translate(-300 40)'); S.draw(g, 0.3, 2.6);
  S.say(0.3, 'The fully boosted telescopic is one tall stack per side, so its current story is short. The tail at the bottom pulls $I_{SS}$ out of the pair.');
  current(S, [[400, 732], [400, 808]], 2.6, null, 'I_SS', { at: [322, 790] });
  S.stop(6, { secs: 45, q: 'Current comes down from $V_{DD}$ through the PMOS cascode M5. Which way does it flow inside M5?',
    choices: ['From its source (top, towards $V_{DD}$) to its drain (bottom): downwards', 'From its drain up to its source', 'It depends on the input signal'], answer: 0,
    hint: ['Where is a PMOS’s source: on the high side or the low side?', 'PMOS: source is the higher terminal, current flows source → drain. NMOS: drain → source.'],
    how: ['A PMOS’s source is its terminal nearest $V_{DD}$ (the arrow on the symbol sits there).', 'Conventional current in a PMOS flows source → drain, so in M5 it goes **downwards**, towards the output node.', 'An NMOS (M3, M1) flows drain → source: also downwards. In a stack, everything flows down from $V_{DD}$ to ground.'] });
  current(S, [[260, 193], [260, 730], [392, 730]], 6.4, null, null, { color: C.volt });
  S.say(6.4, 'Downwards. One current runs the whole left stack: from $V_{DD}$ through the PMOS source M7, the PMOS cascode M5, the output node, the NMOS cascode M3 and the input device M1, into the tail.');
  S.stop(13, { secs: 45, q: 'Take $I_{SS} = 1$ mA with equal inputs. How much current flows through the PMOS cascode M5?', answer: 0.5e-3, unit: 'A', tol: 0.01,
    hint: ['M5 is in series with M1 (the boosters draw no current from the stack). How much of the tail current does each side carry?', '$I_{D5} = I_{D3} = I_{D1} = \\tfrac{I_{SS}}{2}$'],
    how: ['Equal inputs: the tail splits equally: $$I_{D1} = I_{D2} = \\frac{I_{SS}}{2} = \\frac{1\\,\\text{mA}}{2} = 0.5\\,\\text{mA}$$', 'M7, M5, M3 and M1 are in series (the boosters only touch gates), so they all carry it: $$I_{D5} = I_{D1} = 0.5\\,\\text{mA}$$'] });
  current(S, [[540, 193], [540, 730], [408, 730]], 13.4, null, null, { color: C.pink });
  [[150, 590, C.volt], [650, 590, C.pink]].forEach(([x, y, col]) => { const c = chip(S, x, y, 'I_SS/2', { color: col, size: 17 }); c.style.opacity = 0; S.fade(c, 13.4, 0.5); });
  S.say(13.4, 'Half a milliamp. The right stack, M8, M6, M4 and M2, carries the other half.');
  fcTex(S, 'I_{SS} = I_{D1} + I_{D2}', 1200, 200, 18, { w: 640 });
  fcTex(S, 'I_{D7} = I_{D5} = I_{D3} = I_{D1} = \\tfrac{I_{SS}}{2}', 1200, 270, 18, { w: 640 });
  S.say(18, 'KCL at the tail, and series devices share one current: each side carries $I_{SS}/2$ from top to bottom.');
  S.halo(330, 280, 140, 120, C.p, 23, 38); S.halo(330, 500, 140, 120, C.n, 23, 38);
  S.say(23, 'The boosters $A_1$ and $A_2$ are separate amplifiers with their own bias currents. They sense sources and drive gates, so they add nothing to these stacks and take nothing from them.');
  S.say(31, 'One warning for later: on each side two things try to set the same current, M7 from the top and the tail from the bottom. They never agree exactly. Hold that thought: it is the reason for CMFB at the end of this lecture.');
  end(37.4);
  remember(S, [
    'One current per side runs the whole stack: M7 → M5 → output → M3 → M1 → tail.',
    'PMOS: source → drain, downwards from $V_{DD}$. NMOS: drain → source, downwards to ground.',
    'Each side carries $I_{SS}/2$; KCL at the tail: $I_{SS} = I_{D1} + I_{D2}$.',
    'The boosters run on their own bias currents and only touch gates.',
  ], 38, 'Follow the current · boosted telescopic');
  S.say(38, 'Remember: in a telescopic, current flows straight down each stack, half the tail per side, and the boosters never join the main path.');
});

scene(L9, 'Boost both cascodes: which input type for each booster?', 66, (S) => {
  header(S, 'LEC 9 · YOUR PAGE, BOTTOM', 'A₁ uses PMOS inputs, A₂ uses NMOS inputs — because of levels');
  const g = teleBoosted(S); g.setAttribute('transform', 'translate(-300 40)');
  S.draw(g, 0.3, 2.6);
  S.say(0.3, 'Your page’s telescopic with <b>both</b> cascode pairs boosted: $A_1$ watches the NMOS cascodes M3, M4; $A_2$ watches the PMOS cascodes M5, M6.');
  // levels
  const sc = 150, yb = 470;
  const lv = S.g();
  S.el('line', { x1: 1000, y1: yb, x2: 1000, y2: yb - 1.8 * sc, stroke: C.dim, 'stroke-width': 2 }, lv);
  [[0, '0 V', C.muted], [0.4, 'M3, M4 sources ≈ 0.4 V (low)', C.n], [1.5, 'M5, M6 sources ≈ 1.5 V (high)', C.p], [1.8, 'V_DD', C.muted]].forEach(([v, t, col]) => {
    S.el('line', { x1: 990, y1: yb - v * sc, x2: 1010, y2: yb - v * sc, stroke: col, 'stroke-width': 3 }, lv);
    txt(S, 1022, yb - v * sc + 7, t, { size: 19, color: col, weight: 600 }, lv);
  });
  lv.style.opacity = 0; S.fade(lv, 9, 0.8);
  S.say(9, 'A booster’s inputs sit on the sources it watches. Where are they? M3, M4’s sources are only a couple of overdrives above ground. M5, M6’s sources are near $V_{DD}$.');
  whyBox(S, 1000, 520, 560, 150, '**A₁ (low inputs):** a folded-cascode diff amp with **PMOS inputs** — a folded PMOS pair works with its input near (even below) ground.', 18);
  S.say(18, 'So $A_1$ must accept inputs near ground: a folded-cascode amplifier with <b>PMOS</b> input devices (Lec 6: its CM floor passes ground).');
  whyBox(S, 1000, 690, 560, 130, '**A₂ (high inputs):** **NMOS inputs** — a folded NMOS pair’s CM ceiling passes $V_{DD}$.', 26);
  S.say(26, 'And $A_2$ must accept inputs near $V_{DD}$: <b>NMOS</b> input devices (their CM ceiling passes $V_{DD}$). Your page writes both labels in red.');
  S.say(36, '<span class="why">That is Lec 6 paying off:</span> the folding rule “PMOS input reaches ground, NMOS input reaches $V_{DD}$” decides how to build each booster.');
  S.say(46, 'Your page ends with the same idea applied to a folded-cascode main amplifier (input pair M1, M2 folded into the boosted cascodes). Same reasoning, same choice of booster inputs.');
});

/* the current-source-loaded pair of the CMFB scene (M3, M4 PMOS loads on V_b; M1, M2; I_SS) */
function cmLoadPair(S) {
  const b = S.g(); const r2 = S.into(b);
  rail(S, 590, 910, 170);
  pmos(S, 660, 230, { name: 'M3', right: true, gl: 30, nameSide: 'l' }); pmos(S, 840, 230, { name: 'M4', gl: 30 });
  wire(S, [[720, 230], [780, 230]]); txt(S, 750, 220, 'V_b', { size: 18, color: C.muted, anchor: 'middle' });
  wire(S, [[660, 170], [660, 180]]); wire(S, [[840, 170], [840, 180]]);
  nmos(S, 660, 330, { name: 'M1', gate: 'V_in1' }); nmos(S, 840, 330, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[660, 380], [660, 400], [840, 400], [840, 380]]); isrc(S, 750, 440, { label: 'I_SS', len: 40 }); gnd(S, 750, 480);
  r2();
  return b;
}

scene(L9, 'Follow the current: current-source loads', 48, (S) => {
  header(S, 'LEC 9 · FOLLOW THE CURRENT', 'Current-source loads: one current pushed in, one pulled out');
  const end = fcStart(S);
  const b = cmLoadPair(S); b.setAttribute('transform', 'translate(-560 -20) scale(1.5)'); S.draw(b, 0.3, 1.8);
  [[430, 400, 418, 'end'], [700, 400, 712, 'start']].forEach(([x, y, tx, an], i) => { dot(S, x, y); txt(S, tx, y + 12, i ? 'V_out2' : 'V_out1', { size: 19, color: C.volt, weight: 700, anchor: an }); });
  S.say(0.3, 'Replace the resistor loads by PMOS current sources and follow the current again. This time two different things try to set it.');
  current(S, [[565, 582], [565, 698]], 3, null, 'I_SS', { at: [472, 665] });
  current(S, [[430, 404], [430, 580], [557, 580]], 3, null, 'I_N', { color: C.n, at: [372, 530] });
  current(S, [[700, 404], [700, 580], [573, 580]], 3, null, 'I_N', { color: C.n, at: [768, 530] });
  S.say(3, 'From the bottom: the tail pulls $I_{SS}$ out of the pair, so M1 and M2 each pull $I_N = I_{SS}/2$ out of their output node.');
  current(S, [[430, 238], [430, 396]], 10, null, 'I_P', { color: C.p, at: [362, 280] });
  current(S, [[700, 238], [700, 396]], 10, null, 'I_P', { color: C.p, at: [772, 280] });
  S.say(10, 'From the top: M3 and M4 are current sources set by $V_b$. Each pushes its own $I_P$ down into an output node, PMOS source to drain.');
  fcTex(S, 'I_P = I_N + I_X', 1200, 200, 16, { w: 600 });
  S.say(16, 'KCL at each output node: what M3 pushes in should equal what M1 pulls out. Any difference, $I_X$, has to go somewhere.');
  S.stop(22, { secs: 60, q: 'Take $I_{SS} = 1$ mA, and suppose M3 is biased to push $I_P = 502\\,\\mu$A (a 0.4% mismatch). How much current $I_X$ is left over at that output node?', answer: 502e-6 - 1e-3 / 2, unit: 'A', tol: 0.01,
    parts: [{ q: 'Current $I_N$ that M1 pulls out of the node?', answer: 1e-3 / 2, unit: 'A', tol: 0.01, hint: 'Half the tail current.', how: ['$$I_N = \\tfrac{I_{SS}}{2} = 500\\,\\mu\\text{A}$$'] }],
    hint: ['M1 takes half the tail current out of the node; M3 puts $I_P$ in. The leftover is the difference.', '$I_X = I_P - I_N$,\\; $I_N = \\tfrac{I_{SS}}{2}$'],
    how: ['M1 pulls half the tail out of the node: $$I_N = \\frac{I_{SS}}{2} = \\frac{1\\,\\text{mA}}{2} = 500\\,\\mu\\text{A}$$', 'KCL at the output node: $$I_X = I_P - I_N = 502 - 500 = 2\\,\\mu\\text{A}$$'] });
  fcTex(S, 'I_X = I_P - I_N', 1200, 270, 22.4, { w: 600, color: '#ffd38a' });
  S.say(22.4, 'Only 2 µA — a mismatch no process can avoid. So where does it go?');
  S.stop(27, { secs: 45, q: 'At the output node, M3 pushes 502 µA in and M1 pulls 500 µA out. What happens?',
    choices: ['The output voltage moves until the transistors’ output resistances absorb the 2 µA: the output level drifts, possibly to a rail', 'M3 wins: M1 is forced to carry 502 µA and nothing else changes', 'M1 wins: M3 is forced down to 500 µA and nothing else changes'], answer: 0,
    hint: ['Two current sources in series: each insists on its own current. The only thing left free is the node voltage.', '$\\Delta V_{out} = I_X\\,(R_P\\parallel R_N)$'],
    how: ['Neither source simply gives in: a current source keeps its current over a wide voltage range.', 'The node voltage moves until the small changes through their output resistances cancel the mismatch: $$\\Delta V_{out} = I_X(R_P\\parallel R_N)$$', 'With $R_P\\parallel R_N$ in the hundreds of kΩ, 2 µA moves the output by about a volt: it drifts towards a rail. Nothing in the circuit sets the output common-mode level.'],
    why: 'Two current sources in series do not set a voltage: that is why CMFB exists.' });
  label(S, 300, 412, 'drifts!', 27.4, { size: 22, color: C.bad, weight: 800, anchor: 'end' });
  label(S, 795, 412, 'drifts!', 27.4, { size: 22, color: C.bad, weight: 800 });
  S.say(27.4, 'Neither source can win. The output voltages move until the devices’ output resistances soak up the mismatch, and with resistances that large a few µA moves the outputs by volts. Next scene: why that forces CMFB.');
  end(35.4);
  remember(S, [
    'Current-source loads: $I_P$ pushed in from the top (PMOS, source → drain), $I_N = I_{SS}/2$ pulled out at the bottom.',
    'KCL at each output: $I_P = I_N + I_X$; the leftover $I_X$ flows into $R_P\\parallel R_N$.',
    'Two current sources in series never agree exactly → the output CM drifts → CMFB must adjust one of them.',
  ], 36, 'Follow the current · current-source loads');
  S.say(36, 'Remember: the PMOS loads push, the pair pulls, and since the two never match exactly, the output level is undefined until CMFB adjusts one of them.');
});

/* why CMFB: RD loads vs current-source loads, and the I_P / I_N model */
scene(L9, 'Why a fully differential op amp needs CMFB', 74, (S) => {
  header(S, 'LEC 9 · COMMON-MODE FEEDBACK', 'Two current sources in series do not set a voltage');
  const a = S.g(); const r1 = S.into(a);
  rail(S, 90, 410, 170);
  res(S, 160, 170, 260, { label: 'R_D' }); res(S, 340, 170, 260, { label: 'R_D', left: true });
  nmos(S, 160, 320, { name: 'M1', gate: 'V_in1' }); nmos(S, 340, 320, { name: 'M2', gate: 'V_in2', right: true });
  wire(S, [[160, 260], [160, 270]]); wire(S, [[340, 260], [340, 270]]);
  wire(S, [[160, 370], [160, 390], [340, 390], [340, 370]]); isrc(S, 250, 430, { label: 'I_SS', len: 40 }); gnd(S, 250, 470);
  r1();
  S.draw(a, 0.3, 1.6);
  eqAt(S, 'V_{out,CM} = V_{DD} - R_D\\tfrac{I_{SS}}{2}', 250, 560, 3, { size: 28, w: 460 });
  S.say(0.3, 'With <b>resistor</b> loads the output DC level is automatic: each $R_D$ drops $R_DI_{SS}/2$, so $V_{out,CM} = V_{DD} - R_DI_{SS}/2$. Nothing to worry about.');
  const b = cmLoadPair(S);
  S.draw(b, 8, 1.6);
  const qm = label(S, 750, 560, 'V_out,CM = ?', 10, { size: 30, color: C.bad, weight: 800, anchor: 'middle' });
  S.say(8, 'Replace the resistors by PMOS current sources (for gain). Now each output sits between a PMOS source pushing $I_P$ down and the pair + tail pulling $I_N$ out.');
  // the model
  const c = S.g(); const r3 = S.into(c);
  rail(S, 1100, 1460, 170);
  isrc(S, 1180, 250, { label: 'I_P', left: true }); res(S, 1330, 170, 330, { label: 'R_P' });
  wire(S, [[1180, 170], [1180, 208]]); wire(S, [[1180, 292], [1180, 360], [1330, 360], [1330, 330]]);
  dot(S, 1255, 360); wire(S, [[1255, 360], [1255, 360]]);
  isrc(S, 1180, 450, { label: 'I_N', left: true }); res(S, 1330, 390, 540, { label: 'R_N' });
  wire(S, [[1180, 360], [1180, 408]]); wire(S, [[1330, 360], [1330, 390]]);
  gnd(S, 1180, 492); gnd(S, 1330, 540);
  wire(S, [[1330, 360], [1420, 360]]); txt(S, 1428, 367, 'V_out', { size: 22, color: C.volt, weight: 700 });
  r3();
  S.draw(c, 15, 1.8);
  S.say(15, 'Model one output node: a current source $I_P$ from the top with its output resistance $R_P$, and $I_N$ to the bottom with $R_N$ (your page’s little picture).');
  eqAt(S, 'I_P = I_N + I_X\\;\\Rightarrow\\; I_X = I_P - I_N', 1280, 600, 22, { size: 28, w: 560 });
  S.say(22, 'If the two currents are not exactly equal, the difference $I_X = I_P - I_N$ has only one place to go: into $R_P\\parallel R_N$.');
  eqAt(S, '\\Delta V_{out,CM} = (I_P - I_N)(R_P\\parallel R_N)', 1280, 670, 28, { size: 30, w: 600, color: '#ffb36b' });
  // the drift animation
  const vbar = S.el('rect', { x: 1490, y: 360, width: 18, height: 0, rx: 6, fill: C.bad });
  S.anim(34, 6, 'drift', (p) => { vbar.setAttribute('y', 360 - 180 * p); vbar.setAttribute('height', 180 * p); }, E.inout);
  label(S, 1540, 210, 'rail!', 39, { size: 20, color: C.bad, weight: 800, anchor: 'middle' });
  S.say(28, 'And $R_P\\parallel R_N$ is huge — hundreds of kΩ (more with cascodes). A mismatch of just 1 µA × 500 kΩ = 0.5 V…');
  S.say(34, '…a few µA more and the output runs into a rail. Process mismatch makes this certain: the output common-mode level is <b>undefined</b>.');
  whyBox(S, 120, 640, 880, 180, '**The fix (Lec 10–12): common-mode feedback.** Sense the output CM, compare it with a reference $V_{REF}$, and adjust one of the current sources until they match exactly. The differential signal is untouched.', 42);
  S.say(42, '<span class="why">So:</span> a high-gain fully differential amplifier always needs a loop that <b>senses</b> the output CM, <b>compares</b> it with $V_{REF}$ and <b>corrects</b> a current source. That loop is CMFB — Lectures 10–12.');
});

scene(L9, 'Lecture 9 in one card', 28, (S) => {
  header(S, 'LEC 9 · REMEMBER', 'Everything from Lecture 9');
  remember(S, [
    'The booster is an amplifier: $A_{aux} = G_{m,aux}R_{out,aux}$. Folded booster: $A_v = g_{m1}[1 + g_{m3}g_{m4}r_{O4}r_{O3}]g_{m2}r_{O2}r_{O1}$.',
    'Differential pair: $A_1 = A_2$, or **one differential booster** (X and Y move oppositely).',
    'Differential CS booster headroom: $V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}$ (check, link, check).',
    'Folded-cascode booster: $A_{aux} = g_{m5}[g_{m11}r_{O11}r_{O13}\\parallel g_{m7}r_{O7}(r_{O9}\\parallel r_{O5})]$, $R_{out} = (1+A_{aux})g_{m3}r_{O3}r_{O1}$.',
    'NMOS cascodes (low sources) → booster with **PMOS inputs**; PMOS cascodes (high) → **NMOS inputs**.',
    'Current-source loads leave the output CM undefined: $\\Delta V_{out,CM} = (I_P - I_N)(R_P\\parallel R_N)$ → need **CMFB**.',
  ], 0.4, 'Lecture 9 · remember');
  S.say(0.4, 'Now every Lecture 9 question: Tutorial 4 Q3 and the 2024 mid-sem Q4, solved part by part — you first.');
});

/* ── Lecture 9 past papers ── */
/* Tutorial 4 Q3, as printed: bias string M8–R1–R2–M7, folded booster M3 (on R3), M4, M5, M9; main M6, M2, M1 */
function t4q3Fig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 70, 880, 150);
  const xb = 140, x3 = 330, xa = 520, xm = 760;
  // bias string
  pmos(S, xb, 210, { name: 'M8', right: true, gl: 24, nameSide: 'l' }); wire(S, [[xb, 150], [xb, 160]]);
  wire(S, [[xb, 260], [xb, 275]]); dot(S, xb, 268); wire(S, [[xb, 268], [194, 268], [194, 210]]); dot(S, 194, 210);
  res(S, xb, 275, 355, { label: 'R_1', left: true }); dot(S, xb, 355); res(S, xb, 355, 435, { label: 'R_2', left: true });
  nmos(S, xb, 485, { name: 'M7', right: true, gl: 24, nameSide: 'l' }); wire(S, [[xb, 435], [xb, 435]]); dot(S, xb, 448); wire(S, [[xb, 448], [194, 448], [194, 485]]); gnd(S, xb, 535);
  wire(S, [[194, 210], [456, 210]]); // Vbp to M5
  wire(S, [[xb, 355], [440, 355], [440, 360]]); // Vb4 to M4 gate
  wire(S, [[194, 485], [470, 485]]); // Vbn to M9 gate
  // M3 on R3
  res(S, x3, 150, 230, { label: 'R_3' });
  const m3 = pmos(S, x3, 280, { name: 'M3', right: true, gl: 30, nameSide: 'l' });
  wire(S, [[x3, 330], [x3, 420], [xa, 420]]);
  // folded booster
  pmos(S, xa, 210, { name: 'M5', gl: 30 }); wire(S, [[xa, 150], [xa, 160]]);
  wire(S, [[xa, 260], [xa, 310]]); dot(S, xa, 285);
  nmos(S, xa, 360, { name: 'M4', gl: 60 });
  wire(S, [[xa, 410], [xa, 435]]); dot(S, xa, 420); txt(S, xa + 12, 436, 'F', { size: 18, color: C.bad, weight: 750 });
  nmos(S, xa, 485, { name: 'M9', gl: 30 }); gnd(S, xa, 535);
  // main
  pmos(S, xm, 210, { name: 'M6', gl: 30 }); wire(S, [[xm, 150], [xm, 160]]);
  wire(S, [[430, 210], [430, 172], [650, 172], [650, 210], [xm - 64, 210]]); dot(S, 430, 210); // Vbp on to M6 (crosses M5’s supply lead)
  wire(S, [[xm, 260], [xm, 310]]); dot(S, xm, 280); wire(S, [[xm, 280], [850, 280]]); txt(S, 858, 287, 'V_out', { size: 19, color: C.volt, weight: 700 });
  const m2 = nmos(S, xm, 360, { name: 'M2', gl: 40 });
  wire(S, [[xa, 285], [640, 285], [640, 360], [m2.gate[0], 360]]);
  wire(S, [[xm, 410], [xm, 435]]); dot(S, xm, 420); txt(S, xm + 12, 436, 'V_P', { size: 18, color: C.bad, weight: 750 });
  wire(S, [[m3.gate[0], 280], [400, 280], [400, 250], [690, 250], [690, 420], [xm, 420]]);
  nmos(S, xm, 485, { name: 'M1', gate: 'V_in', right: true, nameSide: 'l' }); gnd(S, xm, 535);
  r();
  return g;
}

scene(L9, 'Follow the current: Tutorial 4 Q3 circuit', 52, (S) => {
  header(S, 'LEC 9 · FOLLOW THE CURRENT', 'Tutorial 4 Q3: four paths from V_DD to ground');
  const end = fcStart(S);
  const g = t4q3Fig(S); g.setAttribute('transform', 'translate(0 150)'); S.draw(g, 0.3, 2.4);
  S.say(0.3, 'Before solving Tutorial 4 Q3, trace its currents. That is always step one of a design question. There are four separate paths from $V_{DD}$ to ground.');
  current(S, [[140, 302], [140, 684]], 3, null, 'I_8', { color: C.amb, at: [250, 390] });
  S.say(3, 'Path one, the bias string on the left: M8, then $R_1$ and $R_2$, then M7. One current runs through all four, so $I_8 = I_7$.');
  current(S, [[760, 302], [760, 684]], 9, null, 'I_6', { color: C.volt, at: [830, 470] });
  S.say(9, 'Path two, the main amplifier on the right: M6 pushes down from $V_{DD}$ through the cascode M2 and the input M1. Series again: $I_6 = I_2 = I_1$.');
  current(S, [[520, 302], [520, 568]], 15, null, 'I_5', { color: C.p, at: [585, 470] });
  S.say(15, 'Path three: M5 pushes its current down through the booster’s cascode M4 into node F. So $I_4 = I_5$.');
  current(S, [[330, 302], [330, 570], [512, 570]], 20, null, 'I_3', { color: C.pink, at: [270, 540] });
  S.say(20, 'Path four: the booster’s input M3 hangs from $V_{DD}$ through $R_3$, and its drain also lands on F.');
  current(S, [[520, 572], [520, 684]], 25, null, 'I_9', { color: C.cur, at: [612, 605] });
  fcTex(S, 'I_9 = I_4 + I_3', 1250, 200, 25, { w: 560 });
  fcTex(S, 'I_8 = I_7,\\quad I_6 = I_2 = I_1', 1250, 270, 25, { w: 560 });
  S.say(25, 'F has two currents coming in and one way out, the sink M9. KCL: $I_9 = I_4 + I_3$.');
  S.stop(31, { secs: 45, q: 'M5, M6 and M8 have their gates on the same node $V_{bp}$ and their sources on $V_{DD}$. How do their currents compare?',
    choices: ['In proportion to their W/L', 'All equal, whatever their sizes', 'Set by $R_1$ and $R_2$ only'], answer: 0,
    hint: ['Same gate, same source: what is the same for all three?', '$I_D = \\tfrac12\\mu_pC_{ox}\\tfrac{W}{L}(|V_{GS}| - |V_{thp}|)^2$ with one shared $|V_{GS}|$'],
    how: ['Gates on one node and sources on $V_{DD}$: all three have the same $|V_{GS}|$.', 'In the square law everything except W/L is then shared: $$I_D \\propto \\frac{W}{L}$$', 'So with $(W/L)_5 = (W/L)_8 = 0.4(W/L)_6$, M5 and M8 each carry 0.4 of M6’s current. $R_1$, $R_2$ only set voltages along the string.'] });
  S.say(31.4, 'Same $|V_{GS}|$ means current scales with W/L. That is how the paper hands you every current from the power budget.');
  S.stop(37, { secs: 45, q: 'Of the booster devices M3, M4, M5 and M9, which carries the largest current?',
    choices: ['M9', 'M5', 'M3'], answer: 0,
    hint: ['Which device collects current from more than one path?', '$I_9 = I_4 + I_3$'],
    how: ['M5 and M4 are one path, M3 is another; both end at F.', 'M9 is the only way from F to ground, so it carries their sum: $$I_9 = I_4 + I_3 > I_4,\\; I_3$$'] });
  S.say(37.4, 'M9: it carries the sum. Now the numbers, part by part, in the next scene.');
  end(41.4);
  remember(S, [
    'Four paths: bias string ($I_8 = I_7$), main amplifier ($I_6 = I_2 = I_1$), booster cascode ($I_5 = I_4$), booster input ($I_3$ through $R_3$).',
    'KCL at F: $I_9 = I_4 + I_3$.',
    'Shared $V_{bp}$: the currents of M5, M6 and M8 scale with their W/L.',
    'Supply current = power ÷ $V_{DD}$ = $I_8 + I_5 + I_3 + I_6$.',
  ], 42, 'Follow the current · Tutorial 4 Q3');
  S.say(42, 'Remember: list every path from the supply, use KCL where paths join, and use W/L ratios where gates are shared. The power budget then gives every number.');
});

scene(L9, 'Tutorial 4 Q3: folded booster, every part', 96, (S) => {
  const T = tfm(1, 0, 150);
  // every intermediate of the solution, from the givens (same numbers as the bank's solver)
  const sq = Math.sqrt, kn = 200e-6, kp = 100e-6;
  const vov1 = sq(2 * 500e-6 / (kn * 200)), wl6 = ans('bank-t4q3', 'wl6'), vov6 = 3 - 2.5 - 2 * vov1;
  const wl3 = 0.5 * wl6, vov3 = sq(2 * 100e-6 / (kp * wl3)), vs3 = vov1 + 0.8 + vov3, r3 = ans('bank-t4q3', 'r3');
  const vov9 = sq(2 * 300e-6 / (kn * 200)), vF = 1.15 * vov9, vG4 = vF + 0.7 + sq(2 * 200e-6 / (kn * 200)), vD4 = vov1 + 0.7 + vov1;
  const vgs7 = 0.7 + vov9, vgs8 = 0.8 + sq(2 * 200e-6 / (kp * 0.4 * wl6));
  const gm3 = 2 * 100e-6 / vov3, Gm3 = gm3 / (1 + gm3 * r3), ro5 = 1 / (0.2 * 200e-6), gm4 = 2 * 200e-6 / 0.1, ro4 = 1 / (0.1 * 200e-6), ro9 = 1 / (0.1 * 300e-6);
  const roAux = 1 / (1 / ro5 + 1 / (gm4 * ro4 * ro9)), aux = Gm3 * roAux;
  const gm1 = 2 * 500e-6 / vov1, ro1 = 1 / (0.1 * 500e-6), rdown = (1 + aux) * gm1 * ro1 * ro1 + 2 * ro1, ro6 = 1 / (0.2 * 500e-6);
  const f = (v, n = 4) => fx(v, n);
  const off = pyqFrame(S, {
    paper: 't4q3', tag: 'LEC 9 · PAST PAPER 1 OF 3', title: 'Folded-cascode booster, designed from a power budget', src: 'Tutorial 4 Q3',
    q: '$V_{DD} = 3$ V, 3 mW in total. $(W/L)_{1,2} = 200$ (100/0.5), each carrying 500 µA. $(W/L)_5 = (W/L)_8 = 0.4(W/L)_6$, $(W/L)_3 = 0.5(W/L)_6$, $(W/L)_{4,9} = (W/L)_1$. (a) $(W/L)_6$ for a 2.5 V swing. (b) $R_3$ with $V_P = V_{ov1}$. (c) $V_{DS9} = 1.15V_{ov9}$: is M4 saturated? (d) $(W/L)_7$, $R_1$, $R_2$. (e) Gain.',
    giv: '$\\mu_nC_{ox} = 200\\,\\mu$, $\\mu_pC_{ox} = 100\\,\\mu$A/V², $\\lambda_n = 0.1$, $\\lambda_p = 0.2$, $V_{thn} = 0.7$, $|V_{thp}| = 0.8$ V', qh: 300,
    tests: 'a full design of Lec 8’s implementation 3: **currents from power** (equal $|V_{GS}|$ → currents ∝ W/L), **swing → sizes**, **links to walk a bias string**, a **saturation check**, and the **load trap**.',
    fig: (S2) => { const g = t4q3Fig(S2); g.setAttribute('transform', 'translate(0 150)'); },
    steps: [
      { t: 8, title: '**Currents first.** Total current = power ÷ supply. M5 and M8 share M6’s $|V_{GS}|$ (same gate node $V_{bp}$, sources on $V_{DD}$), so their currents scale with W/L. **M3 gets what is left**, and M9 sinks M4’s + M3’s current', tex: 'I_{tot} = \\frac{3\\,\\mathrm{mW}}{3\\,\\mathrm{V}} = 1\\,\\mathrm{mA},\\; I_5 = I_8 = 0.4\\times500\\,\\mu = 200\\,\\mathrm{\\mu A},\\; I_3 = 1000 - 500 - 200 - 200 = 100\\,\\mathrm{\\mu A},\\; I_9 = 200 + 100 = 300\\,\\mathrm{\\mu A}', hl: [T([60, 150, 820, 120, C.cur])],
        try: { q: 'Start with the power budget. How much current flows in the booster’s input device M3?', answer: 100e-6, unit: 'A', tol: 0.02,
          parts: [
            { q: 'Total current drawn from the supply?', answer: 3e-3 / 3, unit: 'A', tol: 0.01, hint: '$I_{tot} = P/V_{DD}$', how: ['$$I_{tot} = \\frac{3\\,\\text{mW}}{3\\,\\text{V}} = 1\\,\\text{mA}$$'] },
            { q: 'Current in M5 (and in M8)? M6 carries M1’s 500 µA.', answer: 0.4 * 500e-6, unit: 'A', tol: 0.01, hint: 'Same $|V_{GS}|$ as M6, so current ∝ W/L: $I_5 = 0.4\\,I_6$.', how: ['$$I_5 = I_8 = 0.4\\times500\\,\\mu\\text{A} = 200\\,\\mu\\text{A}$$'] },
          ],
          hint: ['Total current = power ÷ $V_{DD}$. M6 carries M1’s current. M5 and M8 have the same $|V_{GS}|$ as M6 (same gate node), so their currents scale with their W/L. M3 gets what is left.', '$I_{tot} = P/V_{DD}$,\\; $I_5 = I_8 = 0.4\\,I_6$,\\; $I_3 = I_{tot} - I_6 - I_5 - I_8$'],
          how: ['Total current from the supply: $$I_{tot} = \\frac{P}{V_{DD}} = \\frac{3\\,\\text{mW}}{3\\,\\text{V}} = 1\\,\\text{mA}$$',
            'M6 sits in series with M2 and M1, so it carries M1’s current (given): $$I_6 = I_1 = 500\\,\\mu\\text{A}$$',
            'M5 and M8 have M6’s $|V_{GS}|$ and 0.4 of its W/L, so 0.4 of its current: $$I_5 = I_8 = 0.4\\times500\\,\\mu\\text{A} = 200\\,\\mu\\text{A}$$',
            'M3 gets what is left of the 1 mA: $$I_3 = 1000 - 500 - 200 - 200 = 100\\,\\mu\\text{A}$$',
            'Also note for later: M9 sinks M4’s and M3’s currents together: $$I_9 = 200 + 100 = 300\\,\\mu\\text{A}$$'],
          why: 'Design questions always start with currents: power ÷ $V_{DD}$, then W/L ratios at equal $|V_{GS}|$, then KCL.' },
        say: 'Always start with currents. Same gate voltage (all tied to $V_{bp}$) means currents scale with W/L: M5, M8 carry 200 µA; M3 gets 100 µA; M9 carries 300 µA.' },
      { t: 17, title: '**(a) Swing → overdrive → size.** $V_{out}$ can fall to $2V_{ov1}$ (M1 and M2 each keep one overdrive) and rise to $V_{DD} - |V_{ov6}|$. The 2.5 V gap fixes $|V_{ov6}|$; the 500 µA then fixes the W/L', tex: `V_{ov1} = \\sqrt{\\frac{2(500\\mu)}{200\\mu\\times200}} = ${f(vov1)}\\,\\mathrm{V},\\; |V_{ov6}| = 3 - 2.5 - 2(${f(vov1)}) = ${f(vov6)}\\,\\mathrm{V},\\; (W/L)_6 = \\frac{2(500\\mu)}{100\\mu\\,(${f(vov6)})^2} = ${f(wl6)}`, hl: [T([690, 150, 160, 290, C.p])],
        try: { q: '(a) The output must swing 2.5 V. Find $(W/L)_6$.', answer: ans('bank-t4q3', 'wl6'), unit: '', tol: 0.02,
          parts: [
            { q: '$V_{ov1}$ of M1 (W/L = 200, 500 µA)?', answer: vov1, unit: 'V', tol: 0.01, hint: '$V_{ov} = \\sqrt{2I_D/(\\mu_nC_{ox}\\,W/L)}$', how: [`$$V_{ov1} = \\sqrt{\\frac{2(500\\,\\mu)}{200\\,\\mu\\times200}} = ${f(vov1)}\\,\\text{V}$$`] },
            { q: '$|V_{ov6}|$ that leaves exactly 2.5 V of swing?', answer: vov6, unit: 'V', tol: 0.01, hint: 'Floor $2V_{ov1}$, ceiling $V_{DD} - |V_{ov6}|$, gap 2.5 V.', how: [`$$|V_{ov6}| = 3 - 2.5 - 2(${f(vov1)}) = ${f(vov6)}\\,\\text{V}$$`] },
          ],
          hint: ['Floor of the output: M1 and M2 (identical, 500 µA each) each keep one overdrive, so $2V_{ov1}$. Ceiling: M6 keeps its $|V_{ov6}|$ below $V_{DD}$. The swing is the gap between them.', '$V_{ov1} = \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)_1}}$,\\; $|V_{ov6}| = V_{DD} - 2.5 - 2V_{ov1}$,\\; $(W/L)_6 = \\frac{2I_D}{\\mu_pC_{ox}|V_{ov6}|^2}$'],
          how: ['Overdrive of M1 (and M2, identical): $$V_{ov1} = \\sqrt{\\frac{2I_D}{\\mu_nC_{ox}(W/L)_1}} = \\sqrt{\\frac{2(500\\,\\mu)}{200\\,\\mu\\times200}} = 0.1581\\,\\text{V}$$',
            'Floor of the output: two overdrives stacked: $$V_{out,min} = 2V_{ov1} = 0.3162\\,\\text{V}$$',
            'The ceiling is $V_{DD} - |V_{ov6}|$ and the gap must be 2.5 V: $$|V_{ov6}| = 3 - 2.5 - 0.3162 = 0.1838\\,\\text{V}$$',
            'Size M6 to carry 500 µA at that overdrive: $$(W/L)_6 = \\frac{2I_D}{\\mu_pC_{ox}|V_{ov6}|^2} = \\frac{2(500\\,\\mu)}{100\\,\\mu\\times0.1838^2} = 296$$'],
          why: 'Swing → overdrives → sizes. The swing fixes the PMOS overdrive; the current then fixes its W/L.',
          calc: [{ what: 'V_ov1 first', keys: '[√] ( 2 × 500µ ÷ ( 200µ × 200 ) ) [EXE]', shows: '0.1581', note: 'Type µ with [CATALOG] ▸ Engineer Symbol ▸ micro.' },
            { what: '|V_ov6| and (W/L)_6 in one line, reusing Ans', keys: '2 × 500µ ÷ ( 100µ × ( 0.5 − 2 [Ans] ) [x²] ) [EXE]', shows: '296.1', note: '0.5 = 3 − 2.5.' }] },
        say: 'Floor: two NMOS overdrives (M1, M2). Ceiling: $V_{DD} - |V_{ov6}|$. With 2.5 V between them, $|V_{ov6}| = 0.184$ V and $(W/L)_6 = 296$.' },
      { t: 26, title: '**(b) Walk up from M3’s gate.** The gate is at $V_P = V_{ov1}$; the PMOS source sits one $|V_{GS3}|$ higher (a link); $R_3$ drops the rest of $V_{DD}$ while carrying M3’s 100 µA', tex: `(W/L)_3 = 0.5(${f(wl6)}) = ${f(wl3)},\\; |V_{ov3}| = \\sqrt{\\frac{2(100\\mu)}{100\\mu\\times${f(wl3)}}} = ${f(vov3)}\\,\\mathrm{V},\\; V_{S3} = ${f(vov1)} + 0.8 + ${f(vov3)} = ${f(vs3)}\\,\\mathrm{V},\\; R_3 = \\frac{3 - ${f(vs3)}}{100\\mu} = ${f(r3 / 1e3, 3)}\\,\\mathrm{k\\Omega}`, hl: [T([260, 150, 140, 180, C.amb])],
        try: { q: '(b) M3’s gate is tied to $V_P$, and $V_P = V_{ov1}$. Find $R_3$.', answer: ans('bank-t4q3', 'r3'), unit: 'Ω', tol: 0.02,
          parts: [
            { q: '$(W/L)_3$?', answer: wl3, unit: '', tol: 0.02, hint: '$(W/L)_3 = 0.5(W/L)_6$, with $(W/L)_6$ from (a).', how: [`$$(W/L)_3 = 0.5\\times${f(wl6)} = ${f(wl3)}$$`] },
            { q: '$|V_{ov3}|$ (M3 carries 100 µA)?', answer: vov3, unit: 'V', tol: 0.01, hint: '$|V_{ov}| = \\sqrt{2I_D/(\\mu_pC_{ox}\\,W/L)}$', how: [`$$|V_{ov3}| = \\sqrt{\\frac{2(100\\,\\mu)}{100\\,\\mu\\times${f(wl3)}}} = ${f(vov3)}\\,\\text{V}$$`] },
            { q: 'Voltage at M3’s source, $V_{S3}$?', answer: vs3, unit: 'V', tol: 0.01, hint: 'Gate at $V_P = V_{ov1}$; source one $|V_{GS3}| = |V_{thp}| + |V_{ov3}|$ higher.', how: [`$$V_{S3} = ${f(vov1)} + 0.8 + ${f(vov3)} = ${f(vs3)}\\,\\text{V}$$`] },
          ],
          hint: ['Walk up from M3’s gate: its source is one $|V_{GS3}|$ higher (a link). $R_3$ sits between $V_{DD}$ and that source and carries M3’s 100 µA (from the first step).', '$|V_{ov3}| = \\sqrt{\\frac{2I_3}{\\mu_pC_{ox}(W/L)_3}}$,\\; $V_{S3} = V_P + |V_{thp}| + |V_{ov3}|$,\\; $R_3 = \\frac{V_{DD} - V_{S3}}{I_3}$'],
          how: ['M3 is half the size of M6 (from (a)): $$(W/L)_3 = 0.5\\times296.1 = 148$$',
            'Its overdrive at 100 µA: $$|V_{ov3}| = \\sqrt{\\frac{2(100\\,\\mu)}{100\\,\\mu\\times148}} = 0.1162\\,\\text{V}$$',
            'Source = gate + one $|V_{GS3}|$ (a link), with the gate at $V_P = V_{ov1} = 0.1581$ V: $$V_{S3} = 0.1581 + 0.8 + 0.1162 = 1.074\\,\\text{V}$$',
            '$R_3$ drops the rest of the supply at 100 µA: $$R_3 = \\frac{3 - 1.074}{100\\,\\mu\\text{A}} = 19.3\\,\\text{k}\\Omega$$'],
          calc: [{ what: 'R_3 in one line', keys: '( 3 − ( 0.1581 + 0.8 + [√] ( 2 × 100µ ÷ ( 100µ × 148.05 ) ) ) ) ÷ 100µ [EXE]', shows: '19.26k', note: 'Engineer Symbol display on: [SETTINGS] ▸ Calc Settings ▸ Engineer Symbol ▸ On.' }] },
        say: 'Walk the levels: M3’s gate is $V_P$; its source is one $|V_{GS3}|$ above; $R_3 = (3 - 1.074)/100\\,\\mu$A ≈ 19.3 kΩ.' },
      { t: 35, title: '**(c) Three levels, one fence.** F = $1.15V_{ov9}$; M4’s gate is one $V_{GS4}$ above F; M4’s drain is M2’s gate, one $V_{GS2}$ above $V_P$. Then the NMOS fence: saturated while $V_D \\ge V_G - V_{th}$', tex: `V_{ov9} = \\sqrt{\\frac{2(300\\mu)}{200\\mu\\times200}} = ${f(vov9)}\\,\\mathrm{V},\\; V_F = 1.15(${f(vov9)}) = ${f(vF)}\\,\\mathrm{V},\\; V_{G4} = ${f(vF)} + 0.7 + 0.1 = ${f(vG4)}\\,\\mathrm{V},\\; V_{D4} = ${f(vov1)} + 0.7 + ${f(vov1)} = ${f(vD4)}\\,\\mathrm{V} \\ge V_{G4} - 0.7 = ${f(vG4 - 0.7)}\\,\\mathrm{V}\\;\\checkmark`, hl: [T([450, 300, 140, 160, C.n])],
        try: { q: '(c) Given $V_{DS9} = 1.15\\,V_{ov9}$: is M4 in saturation?', choices: ['Yes, M4 is saturated', 'No, M4 is in triode'], answer: 0,
          parts: [
            { q: 'Voltage at node F ($= V_{DS9}$)? M9 carries 300 µA, W/L = 200.', answer: vF, unit: 'V', tol: 0.01, hint: 'First $V_{ov9} = \\sqrt{2I_D/(\\mu_nC_{ox}W/L)}$, then $V_F = 1.15V_{ov9}$.', how: [`$$V_{ov9} = \\sqrt{\\frac{2(300\\,\\mu)}{200\\,\\mu\\times200}} = ${f(vov9)}\\,\\text{V},\\quad V_F = 1.15\\times${f(vov9)} = ${f(vF)}\\,\\text{V}$$`] },
            { q: 'M4’s gate voltage $V_{G4}$? (M4: 200 µA, W/L = 200)', answer: vG4, unit: 'V', tol: 0.01, hint: 'One link above F: $V_{G4} = V_F + V_{thn} + V_{ov4}$.', how: [`$$V_{ov4} = \\sqrt{\\frac{2(200\\,\\mu)}{200\\,\\mu\\times200}} = 0.1\\,\\text{V},\\quad V_{G4} = ${f(vF)} + 0.7 + 0.1 = ${f(vG4)}\\,\\text{V}$$`] },
            { q: 'M4’s drain voltage $V_{D4}$ (it is M2’s gate)?', answer: vD4, unit: 'V', tol: 0.01, hint: 'One link above $V_P = V_{ov1}$: $V_{D4} = V_P + V_{thn} + V_{ov2}$, with $V_{ov2} = V_{ov1}$.', how: [`$$V_{D4} = ${f(vov1)} + 0.7 + ${f(vov1)} = ${f(vD4)}\\,\\text{V}$$`] },
          ],
          hint: ['You need three voltages: F (M4’s source, = $V_{DS9}$), M4’s gate (one $V_{GS4}$ above F), and M4’s drain, which is M2’s gate (one $V_{GS2}$ above $V_P$).', 'NMOS saturated while $V_{D4} \\ge V_{G4} - V_{thn}$, with $V_{G4} = V_F + V_{GS4}$ and $V_{D4} = V_P + V_{GS2}$'],
          how: ['M9 carries 300 µA with W/L = 200: $$V_{ov9} = \\sqrt{\\frac{2(300\\,\\mu)}{200\\,\\mu\\times200}} = 0.1225\\,\\text{V},\\quad V_F = 1.15\\times0.1225 = 0.1408\\,\\text{V}$$',
            'M4 carries 200 µA with W/L = 200, so $V_{ov4} = 0.1$ V; its gate is one link above F: $$V_{G4} = 0.1408 + 0.7 + 0.1 = 0.9408\\,\\text{V}$$',
            'M4’s drain is M2’s gate, one link above $V_P = 0.1581$ V (M2: 500 µA, $V_{ov2} = 0.1581$ V): $$V_{D4} = 0.1581 + 0.7 + 0.1581 = 1.016\\,\\text{V}$$',
            'NMOS fence: $$V_{G4} - V_{thn} = 0.9408 - 0.7 = 0.2408\\,\\text{V} \\le 1.016\\,\\text{V}$$ so **M4 is saturated**, with about 0.78 V to spare.'],
          why: 'Saturation checks are always: find the gate and the drain by links, then one fence.' },
        say: 'Check: M4’s drain (M2’s gate) is at 1.016 V, far above its gate minus $V_{th}$ (0.241 V). Saturated.' },
      { t: 43, title: '**(d) M7 mirrors M9** (same $V_{GS}$), so W/L scales with current: M7 carries the bias-string current $I_8 = 200$ µA, M9 carries 300 µA', tex: stepTex('bank-t4q3', 4), hl: [T([80, 430, 140, 110, C.n])],
        try: { q: '(d) M7 has its gate on the same node as M9. Find $(W/L)_7$.', answer: ans('bank-t4q3', 'wl7'), unit: '', tol: 0.02,
          hint: ['Same $V_{GS}$ (a mirror) means currents scale with W/L. M7 is at the bottom of the bias string, which is one series path from M8.', '$\\frac{(W/L)_7}{(W/L)_9} = \\frac{I_7}{I_9}$'],
          how: ['The bias string M8 → $R_1$ → $R_2$ → M7 is one series path, so M7 carries M8’s current (first step): $$I_7 = I_8 = 200\\,\\mu\\text{A}$$',
            'M9 carries 300 µA (first step) with $(W/L)_9 = (W/L)_1 = 200$.',
            'Same $V_{GS}$, so W/L in proportion to current: $$(W/L)_7 = 200\\times\\frac{200\\,\\mu}{300\\,\\mu} = 133.3$$'] },
        say: 'Same $V_{GS}$, so W/L ∝ current: $(W/L)_7 = 200\\times200/300 = 133$.' },
      { t: 51, title: '**Walk the bias string.** Each resistor = (voltage across it) ÷ 200 µA: $R_2$ from M7’s drain ($V_{GS7}$) up to $V_{G4}$, $R_1$ from $V_{G4}$ up to M8’s drain ($V_{DD} - |V_{GS8}|$)', tex: `V_{GS7} = 0.7 + ${f(vov9)} = ${f(vgs7)}\\,\\mathrm{V},\\; R_2 = \\frac{${f(vG4)} - ${f(vgs7)}}{200\\mu} = ${f(ans('bank-t4q3', 'r2'), 3)}\\,\\Omega,\\; |V_{GS8}| = 0.8 + ${f(vgs8 - 0.8)} = ${f(vgs8)}\\,\\mathrm{V},\\; R_1 = \\frac{${f(3 - vgs8)} - ${f(vG4)}}{200\\mu} = ${f(ans('bank-t4q3', 'r1') / 1e3, 3)}\\,\\mathrm{k\\Omega}`, hl: [T([80, 260, 120, 190, C.amb])],
        try: { q: '(d, continued) Walk the bias string: find $R_2$, the resistor between M7’s drain and the node that feeds M4’s gate.', answer: ans('bank-t4q3', 'r2'), unit: 'Ω', tol: 0.02,
          parts: [
            { q: '$V_{GS7}$, the voltage at M7’s drain (diode-connected, mirrors M9)?', answer: vgs7, unit: 'V', tol: 0.01, hint: 'Same $V_{GS}$ as M9, so the same overdrive $V_{ov9}$ from (c).', how: [`$$V_{GS7} = V_{thn} + V_{ov9} = 0.7 + ${f(vov9)} = ${f(vgs7)}\\,\\text{V}$$`] },
          ],
          hint: ['$R_2$ sits between two levels you already have: M7’s drain (diode-connected, so $V_{GS7}$ above ground) and $V_{G4}$ from part (c). It carries the string current, 200 µA.', '$R_2 = \\frac{V_{G4} - V_{GS7}}{I_8}$'],
          how: ['M7 has the same $V_{GS}$ as M9 (a mirror), so the same overdrive 0.1225 V: $$V_{GS7} = 0.7 + 0.1225 = 0.8225\\,\\text{V}$$',
            'The node between $R_1$ and $R_2$ is M4’s gate, from part (c): $$V_{G4} = 0.9408\\,\\text{V}$$',
            'Ohm’s law with the string current: $$R_2 = \\frac{0.9408 - 0.8225}{200\\,\\mu\\text{A}} = 592\\,\\Omega$$',
            'Same walk for $R_1$, up to M8’s drain at $V_{DD} - |V_{GS8}| = 3 - (0.8 + 0.1838) = 2.016$ V: $$R_1 = \\frac{2.016 - 0.9408}{200\\,\\mu\\text{A}} = 5.38\\,\\text{k}\\Omega$$'] },
        say: 'Bias string: each resistor is (voltage across it)/200 µA. $R_2 ≈ 592$ Ω, $R_1 ≈ 5.38$ kΩ.' },
      { t: 59, title: '**(e) The booster’s gain.** M3 has $R_3$ in its source, so its $G_m = g_{m3}/(1 + g_{m3}R_3)$ is small; it drives $r_{O5}\\parallel$(M4 cascoded over $r_{O9}$)', tex: `g_{m3} = \\frac{2(100\\mu)}{${f(vov3)}} = ${f(gm3 * 1e3)}\\,\\mathrm{mS},\\; G_{m3} = \\frac{${f(gm3 * 1e3)}\\mathrm{m}}{1 + ${f(gm3 * 1e3)}\\mathrm{m}\\times${f(r3 / 1e3)}\\mathrm{k}} = ${f(Gm3 * 1e6, 3)}\\,\\mathrm{\\mu S},\\; R_{out,aux} = r_{O5}\\parallel g_{m4}r_{O4}r_{O9} = 25\\mathrm{k}\\parallel${f(gm4 * ro4 * ro9 / 1e6, 3)}\\mathrm{M} = ${f(roAux / 1e3, 3)}\\,\\mathrm{k\\Omega},\\; A_{aux} = ${f(Gm3 * 1e6, 3)}\\,\\mathrm{\\mu S}\\times${f(roAux / 1e3, 3)}\\,\\mathrm{k\\Omega} = ${f(aux, 3)}`, hl: [T([260, 150, 400, 400, C.amb])],
        say: 'The booster’s input device has $R_3$ in its source, so its $G_m$ is only $g_{m3}/(1 + g_{m3}R_3)$ — a weak booster here, $A_{aux} ≈ 1.26$.' },
      { t: 67, title: '**The load trap.** The boost makes $R_{down}$ several MΩ, but M6 above is a plain PMOS source ($r_{O6} = 10$ kΩ). In parallel, **the smaller one wins**', tex: `g_{m1} = \\frac{2(500\\mu)}{${f(vov1)}} = ${f(gm1 * 1e3)}\\,\\mathrm{mS},\\; r_{O1} = r_{O2} = \\frac{1}{0.1(500\\mu)} = 20\\,\\mathrm{k\\Omega},\\; R_{down} = (1 + ${f(aux, 3)})(${f(gm1 * 1e3)}\\mathrm{m})(20\\mathrm{k})^2 + 40\\mathrm{k} = ${f(rdown / 1e6, 3)}\\,\\mathrm{M\\Omega},\\; R_{up} = r_{O6} = \\frac{1}{0.2(500\\mu)} = 10\\,\\mathrm{k\\Omega},\\; |A_v| = g_{m1}(R_{down}\\parallel R_{up}) = ${f(ans('bank-t4q3', 'av'), 4)}`, hl: [T([690, 150, 160, 120, C.bad])],
        try: { q: '(e) Find the overall gain $|A_v|$. Start with the booster’s gain, then the resistances seen at the output.', answer: ans('bank-t4q3', 'av'), unit: 'V/V', tol: 0.03,
          parts: [
            { q: 'The booster input M3’s effective transconductance $G_{m3}$ (degenerated by $R_3$)?', answer: Gm3, unit: 'S', tol: 0.03, hint: ['$g_{m3} = 2I_3/|V_{ov3}|$ with 100 µA and $|V_{ov3}|$ from (b).', '$G_{m3} = \\frac{g_{m3}}{1 + g_{m3}R_3}$'], how: [`$$g_{m3} = \\frac{2(100\\,\\mu)}{${f(vov3)}} = ${f(gm3 * 1e3)}\\,\\text{mS}$$`, `$$G_{m3} = \\frac{${f(gm3 * 1e3)}\\,\\text{m}}{1 + ${f(gm3 * 1e3)}\\,\\text{m}\\times${f(r3 / 1e3)}\\,\\text{k}} = ${f(Gm3 * 1e6, 3)}\\,\\mu\\text{S}$$`] },
            { q: 'The booster’s output resistance $R_{out,aux}$ (at M4’s drain)?', answer: roAux, unit: 'Ω', tol: 0.03, hint: ['Up: $r_{O5}$ (M5: 200 µA, $\\lambda_p = 0.2$). Down: M4 (200 µA, $V_{ov} = 0.1$ V) cascoded over $r_{O9}$ (300 µA).', '$R_{out,aux} = r_{O5}\\parallel g_{m4}r_{O4}r_{O9}$, $r_O = 1/(\\lambda I_D)$'], how: [`$$r_{O5} = \\frac{1}{0.2\\times200\\,\\mu} = 25\\,\\text{k}\\Omega,\\quad g_{m4}r_{O4}r_{O9} = 4\\,\\text{m}\\times50\\,\\text{k}\\times${f(ro9 / 1e3, 3)}\\,\\text{k} = ${f(gm4 * ro4 * ro9 / 1e6, 3)}\\,\\text{M}\\Omega$$`, `$$R_{out,aux} = 25\\,\\text{k}\\parallel${f(gm4 * ro4 * ro9 / 1e6, 3)}\\,\\text{M} = ${f(roAux / 1e3, 3)}\\,\\text{k}\\Omega$$`] },
            { q: 'The booster’s gain $A_{aux}$?', answer: aux, unit: '', tol: 0.03, hint: '$A_{aux} = G_{m3}R_{out,aux}$', how: [`$$A_{aux} = ${f(Gm3 * 1e6, 3)}\\,\\mu\\text{S}\\times${f(roAux / 1e3, 3)}\\,\\text{k}\\Omega = ${f(aux, 3)}$$`] },
            { q: '$g_{m1}$ of the main input device (500 µA)?', answer: gm1, unit: 'S', tol: 0.02, hint: '$g_m = 2I_D/V_{ov}$ with $V_{ov1}$ from (a).', how: [`$$g_{m1} = \\frac{2(500\\,\\mu)}{${f(vov1)}} = ${f(gm1 * 1e3)}\\,\\text{mS}$$`] },
            { q: '$R_{down}$, the boosted resistance looking down from the output?', answer: rdown, unit: 'Ω', tol: 0.03, hint: ['$r_{O1} = r_{O2} = 1/(\\lambda_nI_D)$; M2 = M1, so $g_{m2} = g_{m1}$.', '$R_{down} = (1 + A_{aux})g_{m2}r_{O2}r_{O1} + r_{O2} + r_{O1}$'], how: ['$$r_{O1} = r_{O2} = \\frac{1}{0.1\\times500\\,\\mu} = 20\\,\\text{k}\\Omega$$', `$$R_{down} = ${f(1 + aux, 4)}\\times${f(gm1 * 1e3)}\\,\\text{m}\\times(20\\,\\text{k})^2 + 40\\,\\text{k} = ${f(rdown / 1e6, 3)}\\,\\text{M}\\Omega$$`] },
            { q: '$R_{up}$, looking up into M6?', answer: ro6, unit: 'Ω', tol: 0.02, hint: 'M6 is a plain PMOS source: $R_{up} = r_{O6} = 1/(\\lambda_pI_D)$.', how: ['$$R_{up} = r_{O6} = \\frac{1}{0.2\\times500\\,\\mu} = 10\\,\\text{k}\\Omega$$'] },
          ],
          hint: ['Looking down from the output, the boosted cascode gives $(1 + A_{aux})g_{m2}r_{O2}r_{O1}$, which is huge. Looking up, M6 is a plain PMOS source: only $r_{O6}$. The output sees both in parallel.', '$|A_v| = g_{m1}\\,(R_{down}\\parallel r_{O6})$,\\; $g_m = \\frac{2I_D}{V_{ov}}$,\\; $r_O = \\frac{1}{\\lambda I_D}$'],
          how: ['M1 and M2 at 500 µA, $V_{ov} = 0.1581$ V, $\\lambda_n = 0.1$: $$g_{m1} = g_{m2} = \\frac{2(500\\,\\mu)}{0.1581} = 6.325\\,\\text{mS},\\quad r_{O1} = r_{O2} = \\frac{1}{0.1\\times500\\,\\mu} = 20\\,\\text{k}\\Omega$$',
            'Boosted resistance looking down ($g_{m2}r_{O2}r_{O1} = 2.53$ MΩ): $$R_{down} = (1 + A_{aux})g_{m2}r_{O2}r_{O1} + r_{O2} + r_{O1} = 2.256\\times2.53\\,\\text{M} + 40\\,\\text{k} ≈ 5.75\\,\\text{M}\\Omega$$',
            'Looking up: M6 is a plain PMOS source at 500 µA, $\\lambda_p = 0.2$: $$r_{O6} = \\frac{1}{0.2\\times500\\,\\mu} = 10\\,\\text{k}\\Omega$$',
            'The smaller one wins: $$|A_v| = g_{m1}(R_{down}\\parallel r_{O6}) = 6.325\\,\\text{m}\\times9.98\\,\\text{k} ≈ 63.1$$'],
          why: 'The load trap: boosting one side is wasted when the other side is a plain $r_O$.',
          calc: [{ what: 'parallel and gain in one line', keys: '6.325m × ( 5.75M [SHIFT][^] + 10k [SHIFT][^] ) [SHIFT][^] [EXE]', shows: '63.14', note: '[SHIFT][^] is x⁻¹: (a⁻¹ + b⁻¹)⁻¹ is a ∥ b.' }] },
        say: 'And the load trap again: M6’s 10 kΩ in parallel with 5.75 MΩ — gain ≈ 63.' },
      { t: 75, ans: true, title: `**Answers:** $(W/L)_6 = ${fx(ans('bank-t4q3', 'wl6'), 4)}$ · $R_3 = ${fx(ans('bank-t4q3', 'r3') / 1e3, 3)}$ kΩ · M4 saturated · $(W/L)_7 = ${fx(ans('bank-t4q3', 'wl7'), 4)}$ · $R_1 = ${fx(ans('bank-t4q3', 'r1') / 1e3, 3)}$ kΩ · $R_2 = ${fx(ans('bank-t4q3', 'r2'), 3)}$ Ω · $|A_v| ≈ ${fx(ans('bank-t4q3', 'av'), 3)}$`, say: 'Design questions always go: currents, then overdrives from the swing, then sizes, then walk every bias node with links, then check saturation, then gain.' },
    ],
  });
  // step 1 window: the five branch currents with their values (after the stop, gone before part (a))
  [[[[140, 302], [140, 684]], '200 µA', C.amb, [250, 390]], [[[760, 302], [760, 684]], '500 µA', C.volt, [834, 470]],
    [[[520, 302], [520, 568]], '200 µA', C.p, [585, 470]], [[[330, 302], [330, 570], [512, 570]], '100 µA', C.pink, [262, 540]],
    [[[520, 572], [520, 684]], '300 µA', C.cur, [612, 605]]].forEach(([pts, lab, col, at]) => current(S, pts, off + 8.2, off + 16.4, lab, { color: col, at }));
}, { q: 'Tutorial 4 Q3' });

/* 2024 mid-sem Q4, as printed: booster M6/M5 (PMOS), M4 (Vb2), M3 (Vb1), PMOS input M7 from VDD; main M2 over M1 */
function m24q4Fig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 160, 760, 150);
  const xa = 300, xm = 640;
  pmos(S, xa, 205, { name: 'M6', gate: 'V_b4' }); wire(S, [[xa, 150], [xa, 155]]);
  pmos(S, xa, 305, { name: 'M5', gate: 'V_b3' });
  wire(S, [[xa, 355], [xa, 390]]); dot(S, xa, 370); txt(S, xa - 12, 366, 'G', { size: 19, color: C.amb, weight: 750, anchor: 'end' });
  nmos(S, xa, 440, { name: 'M4', gate: 'V_b2' });
  wire(S, [[xa, 490], [xa, 530]]); dot(S, xa, 510); txt(S, xa - 12, 516, 'F', { size: 19, color: C.bad, weight: 750, anchor: 'end' });
  nmos(S, xa, 580, { name: 'M3', gate: 'V_b1' }); gnd(S, xa, 630);
  const m7 = pmos(S, 460, 460, { name: 'M7', right: true, gl: 30, nameSide: 'l' });
  wire(S, [[460, 410], [460, 396]]); wire(S, [[440, 396], [480, 396]], { w: 3 }); txt(S, 460, 386, 'V_DD', { size: 15, color: C.muted, anchor: 'middle' });
  wire(S, [[460, 510], [460, 530], [380, 530], [380, 510], [xa, 510]]);
  const m2 = nmos(S, xm, 370, { name: 'M2', gl: 50 });
  wire(S, [[xa, 370], [m2.gate[0], 370]]);
  wire(S, [[xm, 320], [xm, 230]]); arrow(S, xm + 40, 240, xm + 40, 290, { color: C.n, w: 2.4, head: 10 }); txt(S, xm + 50, 258, 'R_out', { size: 20, color: C.n, weight: 700 });
  wire(S, [[xm, 420], [xm, 480]]); dot(S, xm, 460); txt(S, xm + 12, 466, 'X', { size: 19, color: C.bad, weight: 750 });
  wire(S, [[m7.gate[0], 460], [xm, 460]]);
  nmos(S, xm, 530, { name: 'M1', gate: 'V_in', right: true, nameSide: 'l' }); gnd(S, xm, 580);
  r();
  return g;
}

scene(L9, '2024 mid-sem Q4: R_out of a folded-boosted cascode', 72, (S) => {
  const T = tfm(1, 0, 110);
  // intermediates from the givens: 10 µA in M2, M4, M5, M6, M7; 20 µA in M3; NMOS Vov 0.1 V, PMOS 0.2 V
  const gm5 = 2 * 10e-6 / 0.2, roP = 1 / (0.2 * 10e-6), gm4 = 2 * 10e-6 / 0.1, ro4 = 1 / (0.1 * 10e-6), ro3 = 1 / (0.1 * 20e-6);
  const rup = gm5 * roP * roP, rdn = gm4 * ro4 * (1 / (1 / ro3 + 1 / roP)), casc = gm4 * ro4 * ro4; // M2 = M4 numbers: 0.2 mS, 1 MΩ
  const f = (v, n = 4) => fx(v, n);
  const off = pyqFrame(S, {
    paper: 'm24q4', tag: 'LEC 9 · PAST PAPER 2 OF 3', title: 'How big is R_out with a folded-cascode booster?', src: 'Mid-sem 2024-25 Q4 · 7 marks',
    q: 'All NMOS $V_{ov} = 0.1$ V, all PMOS $|V_{ov}| = 0.2$ V, $I_{D2} = I_{D4} = I_{D7} = 10\\,\\mu$A. Find $R_{out}$ and the minimum and maximum $V_{b2}$.',
    giv: '$V_{DD} = 1.8$ V, $\\lambda_p = 0.2$, $\\lambda_n = 0.1$ V⁻¹, $V_{th0,n} = 0.4$, $|V_{th0,p}| = 0.5$ V', qh: 230,
    tests: 'the Lec 9 folded-cascode booster: **currents by KCL at the fold node**, **booster gain = $g_{m}$ × (look up ∥ look down)**, the **(1 + A)** multiplication, and one **fence** for $V_{b2}$.',
    fig: (S2) => { const g = m24q4Fig(S2); g.setAttribute('transform', 'translate(0 110)'); },
    steps: [
      { t: 8, title: '**Currents by KCL at F.** M4 and M7 each bring 10 µA into F, so M3 sinks 20 µA. Then for **every** device: $g_m = 2I_D/V_{ov}$ and $r_O = 1/(\\lambda I_D)$', tex: stepTex('pyq-m24-q4', 0), hl: [T([230, 470, 280, 160, C.cur])],
        try: { q: 'Start with the small-signal numbers. Find $g_{m7}$, the transconductance of the booster’s input device M7.', answer: 1e-4, unit: 'S', tol: 0.02,
          hint: ['M7’s current is given (10 µA) and it is a PMOS, so $|V_{ov}| = 0.2$ V. In saturation, $g_m$ needs only these two.', '$g_m = \\frac{2I_D}{|V_{ov}|}$'],
          how: ['M7’s current is given: $$I_{D7} = 10\\,\\mu\\text{A},\\quad |V_{ov7}| = 0.2\\,\\text{V (every PMOS)}$$',
            'Square law in saturation: $$g_{m7} = \\frac{2I_{D7}}{|V_{ov7}|} = \\frac{2(10\\,\\mu)}{0.2} = 0.1\\,\\text{mS}$$',
            'Same habit for the rest. KCL at F gives M3 = 10 + 10 = 20 µA; then $$g_{m4} = \\frac{2(10\\,\\mu)}{0.1} = 0.2\\,\\text{mS},\\quad r_{O4} = \\frac{1}{0.1\\times10\\,\\mu} = 1\\,\\text{M}\\Omega,\\quad r_{O3} = \\frac{1}{0.1\\times20\\,\\mu} = 500\\,\\text{k}\\Omega$$'],
          why: 'First KCL for every current, then $g_m$ and $r_O$ for every device, and only then the formulas.' },
        say: 'KCL at the fold node F: M4 and M7 each bring 10 µA, so M3 sinks 20 µA. Then every $g_m = 2I_D/V_{ov}$ and $r_O = 1/(\\lambda I_D)$.' },
      { t: 17, title: '**Booster gain = $g_{m7}$ × (look up ∥ look down) at node G.** Up: the PMOS cascode M5 on M6. Down: the NMOS cascode M4 sitting on the fold node, which carries **two** resistances, $r_{O3}\\parallel r_{O7}$', tex: `R_{up} = g_{m5}r_{O5}r_{O6} = 0.1\\mathrm{m}\\times500\\mathrm{k}\\times500\\mathrm{k} = ${f(rup / 1e6, 3)}\\,\\mathrm{M\\Omega},\\; R_{down} = g_{m4}r_{O4}(r_{O3}\\parallel r_{O7}) = 0.2\\mathrm{m}\\times1\\mathrm{M}\\times250\\mathrm{k} = ${f(rdn / 1e6, 3)}\\,\\mathrm{M\\Omega},\\; A_{aux} = 0.1\\,\\mathrm{mS}\\,(${f(rup / 1e6, 3)}\\mathrm{M}\\parallel ${f(rdn / 1e6, 3)}\\mathrm{M}) = ${f(ans('pyq-m24-q4', 'aux'), 4)}`, hl: [T([230, 150, 300, 480, C.amb])],
        try: { q: 'Find the booster’s gain $A_{aux}$ (from X, M7’s gate, to G, M2’s gate).', answer: ans('pyq-m24-q4', 'aux'), unit: '', tol: 0.02,
          parts: [
            { q: '$R_{up}$, looking up from G into the PMOS cascode M5 on M6 (10 µA each)?', answer: rup, unit: 'Ω', tol: 0.02, hint: ['PMOS at 10 µA, $|V_{ov}| = 0.2$ V, $\\lambda_p = 0.2$: find $g_{m5}$ and $r_{O5} = r_{O6}$.', '$R_{up} = g_{m5}r_{O5}r_{O6}$'], how: ['$$g_{m5} = \\frac{2(10\\,\\mu)}{0.2} = 0.1\\,\\text{mS},\\quad r_{O5} = r_{O6} = \\frac{1}{0.2\\times10\\,\\mu} = 500\\,\\text{k}\\Omega$$', `$$R_{up} = 0.1\\,\\text{m}\\times500\\,\\text{k}\\times500\\,\\text{k} = ${f(rup / 1e6, 3)}\\,\\text{M}\\Omega$$`] },
            { q: '$R_{down}$, looking down from G into M4 over the fold node?', answer: rdn, unit: 'Ω', tol: 0.02, hint: ['$g_{m4}$, $r_{O4}$, $r_{O3}$ are on the first card; $r_{O7} = 500$ kΩ (PMOS, 10 µA).', '$R_{down} = g_{m4}r_{O4}(r_{O3}\\parallel r_{O7})$'], how: ['$$r_{O3}\\parallel r_{O7} = 500\\,\\text{k}\\parallel500\\,\\text{k} = 250\\,\\text{k}\\Omega$$', `$$R_{down} = 0.2\\,\\text{m}\\times1\\,\\text{M}\\times250\\,\\text{k} = ${f(rdn / 1e6, 3)}\\,\\text{M}\\Omega$$`] },
          ],
          hint: ['The booster is the input device M7 driving node G: gain = $g_{m7}$ × (resistance at G). Look up from G: PMOS cascode M5 on M6. Look down: M4 cascoded over the fold node F, where $r_{O3}$ and $r_{O7}$ meet in parallel.', '$A_{aux} = g_{m7}\\,(R_{up}\\parallel R_{down})$,\\; $R_{up} = g_{m5}r_{O5}r_{O6}$,\\; $R_{down} = g_{m4}r_{O4}(r_{O3}\\parallel r_{O7})$'],
          how: ['PMOS devices at 10 µA ($\\lambda_p = 0.2$): $$g_{m5} = \\frac{2(10\\,\\mu)}{0.2} = 0.1\\,\\text{mS},\\quad r_{O5} = r_{O6} = r_{O7} = \\frac{1}{0.2\\times10\\,\\mu} = 500\\,\\text{k}\\Omega$$',
            'Look up from G (PMOS cascode): $$R_{up} = g_{m5}r_{O5}r_{O6} = 0.1\\,\\text{m}\\times500\\,\\text{k}\\times500\\,\\text{k} = 25\\,\\text{M}\\Omega$$',
            'Look down from G: M4 on the fold node, $r_{O3}\\parallel r_{O7} = 500\\,\\text{k}\\parallel500\\,\\text{k} = 250$ kΩ: $$R_{down} = g_{m4}r_{O4}(r_{O3}\\parallel r_{O7}) = 0.2\\,\\text{m}\\times1\\,\\text{M}\\times250\\,\\text{k} = 50\\,\\text{M}\\Omega$$',
            'Input $g_m$ times the parallel of the two: $$A_{aux} = 0.1\\,\\text{m}\\times(25\\,\\text{M}\\parallel50\\,\\text{M}) = 0.1\\,\\text{m}\\times16.7\\,\\text{M} ≈ 1667$$'],
          why: 'Folded cascode: the fold node carries two $r_O$ in parallel. Don’t forget the input device’s own $r_{O7}$.',
          calc: [{ what: 'parallel and gain in one line', keys: '0.1m × ( 25M [SHIFT][^] + 50M [SHIFT][^] ) [SHIFT][^] [EXE]', shows: '1666.67', note: '[SHIFT][^] is x⁻¹. Type M with [CATALOG] ▸ Engineer Symbol ▸ Mega.' }] },
        say: 'Look up from G: the PMOS cascode, 25 MΩ. Look down: M4 cascoded over $r_{O3}\\parallel r_{O7}$ (two r_O on the fold node), 50 MΩ. $A_{aux} = 0.1\\,\\text{mS}\\times16.7\\,\\text{M} ≈ 1667$.' },
      { t: 26, title: '**$R_{out}$:** the main cascode’s own $g_{m2}r_{O2}r_{O1}$, multiplied by $(1 + A_{aux})$', tex: `g_{m2} = \\frac{2(10\\mu)}{0.1} = 0.2\\,\\mathrm{mS},\\; r_{O2} = r_{O1} = \\frac{1}{0.1(10\\mu)} = 1\\,\\mathrm{M\\Omega},\\; g_{m2}r_{O2}r_{O1} = ${f(casc / 1e6, 3)}\\,\\mathrm{M\\Omega},\\; R_{out} = (1 + ${f(ans('pyq-m24-q4', 'aux'), 4)})\\times${f(casc / 1e6, 3)}\\,\\mathrm{M\\Omega} ≈ ${f(ans('pyq-m24-q4', 'rout') / 1e9, 3)}\\,\\mathrm{G\\Omega}`, hl: [T([570, 230, 160, 380, C.n])],
        try: { q: 'Now find $R_{out}$, looking down into M2’s drain.', answer: ans('pyq-m24-q4', 'rout'), unit: 'Ω', tol: 0.03,
          parts: [
            { q: 'The plain (unboosted) cascode $g_{m2}r_{O2}r_{O1}$? M2 and M1 carry 10 µA, NMOS $V_{ov} = 0.1$ V.', answer: casc, unit: 'Ω', tol: 0.02, hint: '$g_{m2} = 2I_D/V_{ov}$, $r_O = 1/(\\lambda_nI_D)$', how: ['$$g_{m2} = \\frac{2(10\\,\\mu)}{0.1} = 0.2\\,\\text{mS},\\quad r_{O2} = r_{O1} = \\frac{1}{0.1\\times10\\,\\mu} = 1\\,\\text{M}\\Omega$$', `$$g_{m2}r_{O2}r_{O1} = 0.2\\,\\text{m}\\times1\\,\\text{M}\\times1\\,\\text{M} = ${f(casc / 1e6, 3)}\\,\\text{M}\\Omega$$`] },
          ],
          hint: ['A boosted cascode is a plain cascode multiplied by $(1 + A_{aux})$. M2 and M1 both carry $I_{D2} = 10$ µA, NMOS $V_{ov} = 0.1$ V.', '$R_{out} ≈ (1 + A_{aux})\\,g_{m2}r_{O2}r_{O1}$'],
          how: ['Main devices at 10 µA ($\\lambda_n = 0.1$): $$g_{m2} = \\frac{2(10\\,\\mu)}{0.1} = 0.2\\,\\text{mS},\\quad r_{O2} = r_{O1} = \\frac{1}{0.1\\times10\\,\\mu} = 1\\,\\text{M}\\Omega$$',
            'The plain cascode: $$g_{m2}r_{O2}r_{O1} = 0.2\\,\\text{m}\\times1\\,\\text{M}\\times1\\,\\text{M} = 200\\,\\text{M}\\Omega$$',
            'Multiply by $(1 + A_{aux})$, with $A_{aux} = 1667$ from the last step: $$R_{out} ≈ 1668\\times200\\,\\text{M}\\Omega ≈ 333\\,\\text{G}\\Omega$$'],
          why: 'The boost multiplies the cascode by $(1 + A_{aux})$: three orders of magnitude here.' },
        say: '$R_{out} ≈ A_{aux}g_{m2}r_{O2}r_{O1} = 1667\\times0.2\\,\\text{mS}\\times1\\,\\text{M}\\times1\\,\\text{M} ≈ 333$ GΩ.' },
      { t: 35, title: '**$V_{b2,min}$:** F sits one $V_{GS4}$ below $V_{b2}$ (a link), and M3 under F needs at least its $V_{ov3}$ (a check)', tex: stepTex('pyq-m24-q4', 3), hl: [T([230, 400, 140, 230, C.bad])],
        try: { q: 'Find the smallest $V_{b2}$ that keeps every device in saturation.', answer: ans('pyq-m24-q4', 'vb2min'), unit: 'V', tol: 0.01,
          parts: [{ q: 'M4’s gate-source voltage $V_{GS4}$?', answer: 0.4 + 0.1, unit: 'V', tol: 0.01, hint: '$V_{GS} = V_{thn} + V_{ov}$', how: ['$$V_{GS4} = 0.4 + 0.1 = 0.5\\,\\text{V}$$'] }],
          hint: ['Lowering $V_{b2}$ pulls F down, because F sits one $V_{GS4}$ below M4’s gate. The device under F, M3, must keep at least its $V_{ov}$.', '$V_F = V_{b2} - V_{GS4} \\ge V_{ov3}$'],
          how: ['M4’s gate-source drop (NMOS, $V_{thn} = 0.4$ V, $V_{ov} = 0.1$ V): $$V_{GS4} = 0.4 + 0.1 = 0.5\\,\\text{V}$$',
            'F is one link below $V_{b2}$ and must stay at or above M3’s overdrive: $$V_{b2} - 0.5 \\ge 0.1$$',
            'So $$V_{b2,min} = 0.1 + 0.5 = 0.6\\,\\text{V}$$'] },
        say: 'F is one link below $V_{b2}$; M3 needs F ≥ $V_{ov3}$. So $V_{b2,min} = 0.1 + 0.5 = 0.6$ V.' },
      { t: 43, title: '**$V_{b2,max}$:** M4 must stay saturated. Its drain G is M2’s gate, one link above X; X is lowest at $V_{ov1}$. So $V_{b2} \\le G + V_{th4}$', tex: 'V_{b2} - V_{th4} \\le V_{ov1} + V_{GS2} \\Rightarrow V_{b2,max} = 0.1 + 0.5 + 0.4 = 1.0\\,\\mathrm{V}', hl: [T([230, 330, 140, 160, C.n]), T([570, 320, 160, 160, C.n])],
        try: { q: 'And the largest $V_{b2}$?', answer: 0.1 + 0.5 + 0.4, unit: 'V', tol: 0.01,
          parts: [{ q: 'Lowest voltage of node G (M4’s drain = M2’s gate), with X at its lowest, $V_{ov1}$?', answer: 0.1 + 0.5, unit: 'V', tol: 0.01, hint: '$V_G = V_X + V_{GS2}$, $V_{GS2} = V_{thn} + V_{ov}$', how: ['$$V_G = 0.1 + (0.4 + 0.1) = 0.6\\,\\text{V}$$'] }],
          hint: ['Raising $V_{b2}$ lifts M4’s gate towards its drain G. G is M2’s gate: one $V_{GS2}$ above X, and X can sit as low as $V_{ov1}$ (M1 just saturated).', 'M4 saturated: $V_{b2} - V_{thn} \\le V_G = V_{ov1} + V_{GS2}$'],
          how: ['G is M2’s gate, one link above X; take X at its lowest, $V_{ov1} = 0.1$ V: $$V_G = V_X + V_{GS2} = 0.1 + (0.4 + 0.1) = 0.6\\,\\text{V}$$',
            'NMOS fence on M4: its gate may sit at most one $V_{thn}$ above its drain: $$V_{b2} \\le V_G + V_{thn} = 0.6 + 0.4 = 1.0\\,\\text{V}$$',
            'M7’s fence allows up to 1.1 V, so M4 sets the limit: $$V_{b2,max} = 1.0\\,\\text{V}$$'],
          why: 'Bias limits: a check from below (the device under the node), a fence from above (the device itself).' },
        say: 'Raise $V_{b2}$ and M4’s gate climbs towards its drain G. G is M2’s gate: X + $V_{GS2}$ = 0.6 V at the lowest X. M4 stays saturated while $V_{b2} \\le G + V_{th4} = 1.0$ V — the key’s value. (M7’s fence gives 1.1 V, so M4 binds.)' },
      { t: 51, ans: true, title: `**Answers:** $A_{aux} ≈ 1667$ · $R_{out} ≈ 333$ GΩ · $V_{b2,min} = 0.6$ V · $V_{b2,max} = 1$ V (key)`, say: 'Pattern: KCL for currents, $g_m$ and $r_O$ for every device, booster gain by two looks, multiply the cascode by $(1 + A_{aux})$, then fences for the bias limits.' },
    ],
  });
  // step 1 window: KCL at F with the given currents
  [[[[300, 262], [300, 618]], '10 µA', C.n, [400, 360]], [[[460, 508], [460, 640], [380, 640], [380, 620], [305, 620]], '10 µA', C.p, [420, 680]],
    [[[300, 622], [300, 738]], '20 µA', C.cur, [228, 760]], [[[640, 345], [640, 688]], '10 µA', C.volt, [722, 520]]].forEach(([pts, lab, col, at]) => current(S, pts, off + 8.2, off + 16.4, lab, { color: col, at }));
}, { q: 'Mid-sem 2024 Q4' });

scene(L9, 'Exam-style check: the booster’s headroom and input type', 42, (S) => {
  const T = tfm(0.8, 40, 220);
  pyqFrame(S, {
    tag: 'LEC 9 · EXAM-STYLE CHECK (FROM YOUR PAGE)', title: 'Two quick questions an examiner would ask on Lec 9', src: 'Exam-style · built from your Lec 9 page',
    q: 'The differential CS booster (M5, M6, tail $I_{SS1}$) on a cascode pair. $V_{ISS1} = 0.2$ V, $V_{GS5} = 0.7$ V, $V_{ov3} = 0.2$ V. (a) Lowest output. (b) For the NMOS cascodes of a telescopic, which booster input type?',
    qh: 230, tests: 'the two Lec 9 ideas the tutorials lean on: **booster headroom by walking up from ground**, and **input type from the level of the node it watches**.',
    fig: (S2) => { const g = diffCsBoost(S2); g.setAttribute('transform', 'translate(40 220) scale(0.8)'); },
    steps: [
      { t: 8, title: '**(a) Walk up from ground** on the left: the booster’s tail (a check), then the link to M5’s gate, which is X, then M3’s overdrive above X (a check)', tex: 'V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3} = 0.2 + 0.7 + 0.2 = 1.1\\,\\mathrm{V}', hl: [T([180, 300, 820, 520, C.amb])],
        try: { q: '(a) With this booster in place, what is the lowest output voltage $V_{out,min}$?', answer: 0.2 + 0.7 + 0.2, unit: 'V', tol: 0.01,
          parts: [{ q: 'Lowest voltage of node X (M5’s gate)?', answer: 0.2 + 0.7, unit: 'V', tol: 0.01, hint: 'Booster tail headroom, then one $V_{GS5}$ up to M5’s gate.', how: ['$$V_X = V_{ISS1} + V_{GS5} = 0.2 + 0.7 = 0.9\\,\\text{V}$$'] }],
          hint: ['Walk up from ground on the left: the booster’s tail source, then M5 (its gate is node X), then the cascode M3 above X.', '$V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}$'],
          how: ['The booster’s tail needs its headroom (a check): $$V_{ISS1} = 0.2\\,\\text{V}$$',
            'M5’s gate is X, a whole $V_{GS5}$ above M5’s source (a link): $$V_X = 0.2 + 0.7 = 0.9\\,\\text{V}$$',
            'M3 needs its overdrive above X (a check): $$V_{out,min} = 0.9 + 0.2 = 1.1\\,\\text{V}$$'],
          why: 'Without a booster the floor is only about 0.4 V: the CS booster costs a whole $V_{GS}$.' },
        say: 'Tail 0.2 (check) + $V_{GS5}$ 0.7 (link: X is M5’s gate) + $V_{ov3}$ 0.2 (check) = 1.1 V.' },
      { t: 16, title: '**(b)** The NMOS cascodes’ sources sit low (≈ 0.2–0.4 V), so the booster must accept inputs **near ground**: a folded cascode with **PMOS** inputs', tex: '\\text{folded-cascode booster with PMOS inputs}',
        try: { q: '(b) In a telescopic, the NMOS cascodes’ sources sit near 0.3 V. Which booster should watch them?', choices: ['A folded-cascode amplifier with PMOS input devices', 'A folded-cascode amplifier with NMOS input devices'], answer: 0,
          hint: ['The booster’s inputs sit on those sources, almost at ground. Which input pair still works there? (Lec 6)', 'Input CM range: NMOS pair needs $V_{in} \\ge V_{GS} + V_{ov,tail}$; folded PMOS pair works down to $V_{in} ≈ V_{ov} - |V_{thp}|$'],
          how: ['The booster’s inputs connect to the cascode sources, so they sit at ≈ 0.3 V, almost at ground.',
            'An NMOS input pair needs its inputs at least $V_{GS} + V_{ov,tail}$, near 1 V: at 0.3 V it would be off. That is why the NMOS choice is wrong.',
            'A folded PMOS pair works down to $V_{ov} - |V_{thp}|$, which is below ground: so the booster for the NMOS cascodes uses **PMOS inputs**.',
            'Mirror rule: the PMOS cascodes’ sources sit near $V_{DD}$, so their booster uses NMOS inputs.'],
          why: 'A folded PMOS pair’s CM floor is $V_{ov} - |V_{thp}|$, below ground.' },
        say: 'Low sources need a PMOS input (its CM floor passes ground); the PMOS cascodes’ high sources need NMOS inputs.' },
      { t: 24, ans: true, title: '**Answers:** (a) 1.1 V (vs 0.4 V unboosted) · (b) PMOS-input folded cascode', say: 'Both answers come from the same habit: before using any amplifier, ask where its inputs and outputs must sit.' },
    ],
  });
}, { q: 'Exam-style (Lec 9)' });
