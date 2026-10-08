/* Lecture 8: gain boosting in depth, and three ways to build the booster. */
'use strict';
const L8 = 'Lec 8 · Gain boosting in depth';

/* M with R_S and an amplifier that senses the source; optional test source at the drain */
function boostCell(S, o = {}) {
  const g = S.g(); const r = S.into(g);
  const x = o.x || 900, y = o.y || 400;
  if (o.vin) { wire(S, [[x - 360, y - 22], [x - 320, y - 22]]); txt(S, x - 368, y - 15, 'V_in', { size: 20, color: C.muted, anchor: 'end' }); }
  else { gnd(S, x - 340, y - 10); wire(S, [[x - 340, y - 10], [x - 340, y - 22], [x - 320, y - 22]]); }
  amp(S, x - 320, y, { label: 'A₁', w: 110, h: 100 });
  wire(S, [[x - 210, y], [x - 66, y]]);
  nmos(S, x, y, { name: o.name || 'M2', gl: 46 });
  wire(S, [[x, y - 50], [x, y - 140]]);
  wire(S, [[x, y + 50], [x, y + 90]]); dot(S, x, y + 75);
  wire(S, [[x, y + 75], [x - 340, y + 75], [x - 340, y + 25], [x - 320, y + 25]]);
  res(S, x, y + 90, y + 190, { label: 'R_S' }); gnd(S, x, y + 190);
  r();
  return { g, x, y };
}

scene(L8, 'G_m redone: the amplifier senses the source', 70, (S) => {
  header(S, 'LEC 8 · YOUR PAGE, TOP', 'Why the amplifier cannot raise G_m');
  const c = boostCell(S, { vin: true, x: 620, y: 360 });
  S.draw(c.g, 0.3, 2);
  const io = label(S, 650, 250, 'I_out', 2, { size: 21, color: C.cur, weight: 700 });
  S.say(0.3, 'Lecture 8 starts by redoing the $G_m$ attempt properly. Now the amplifier’s inputs are $V_{in}$ and the <b>source</b> of the transistor.');
  S.say(5, 'Read the two voltages your page labels: the gate gets $(V_{in} - I_{out}R_S)A_1$, and the source sits at $I_{out}R_S$.');
  const ln = [
    ['\\left[(V_{in} - I_{out}R_S)A_1 - I_{out}R_S\\right]g_m = I_o', 9, 'The current source inside the transistor is $g_m$ times $V_{GS}$ = gate minus source.'],
    ['I_{out} = I_o\\,\\frac{r_O}{r_O + R_S}', 15, 'Some current leaks back through $r_O$: the divider leaves $I_o\\,r_O/(r_O+R_S)$.'],
    ['\\frac{I_{out}}{V_{in}} = \\frac{A_1g_mr_O}{R_S + r_O + (1+A_1)R_Sg_mr_O}', 21, 'Collect the $I_{out}$ terms and divide: your page’s result.'],
    ['\\approx \\frac{A_1g_m}{R_S + (1+A_1)g_mr_OR_S} \\approx \\frac{A_1}{(1+A_1)R_S} \\approx \\frac{1}{R_S}', 28, 'For a real device the $(1+A_1)g_mr_OR_S$ term dominates. Look what happens to $A_1$…'],
  ];
  ln.forEach(([tex, t, say], i) => { eqAt(S, tex, 1180, 230 + i * 92, t, { size: i === 3 ? 30 : 32, w: 760, color: i === 3 ? '#ffd38a' : C.text }); S.say(t, say); });
  whyBox(S, 820, 640, 740, 170, '**$A_1$ cancels top and bottom.** With the amplifier sensing the source, the transistor + amplifier is a feedback loop whose $G_m$ is set by the resistor: $\\approx 1/R_S$, whatever $A_1$ is.', 34);
  S.say(34, '<span class="why">$A_1$ cancels.</span> The amplifier and transistor form a feedback loop around $R_S$, and the loop’s transconductance is just $1/R_S$ — set by the resistor, not by $A_1$.');
  eqAt(S, '\\text{plain degenerated device: }\\;\\frac{g_mr_O}{R_S + r_O + g_mR_Sr_O} \\approx \\frac{1}{R_S}', 430, 760, 44, { size: 26, w: 760, color: C.muted });
  S.say(44, 'Your page compares it with a plain degenerated device (right side): also about $1/R_S$. No gain in $G_m$ either way.');
  S.say(53, '<span class="why">Conclusion:</span> the booster amplifier’s real job is the output resistance. From now on, gain boosting means <b>multiplying $R_{out}$</b>.');
});

scene(L8, 'Looking in from the top and from the bottom', 64, (S) => {
  header(S, 'LEC 8 · TWO LOOK-IN RESULTS', 'Boosting multiplies “up” and divides “down” by (1 + A₁)');
  eqAt(S, 'R_{out} = R_S + r_O + (1 + A_1)\\,g_mR_Sr_O', 800, 170, 0.3, { size: 40 });
  S.say(0.3, 'From Lecture 7, looking <b>down</b> into the boosted drain: $R_{out} = R_S + r_O + (1+A_1)g_mR_Sr_O$.');
  // left: plain source look-in; right: boosted
  const a = S.g(); const r1 = S.into(a);
  res(S, 400, 250, 330, { label: 'R_D' }); rail(S, 360, 440, 250, '');
  nmos(S, 400, 380, { name: 'M1', gate: 'V_in' });
  wire(S, [[400, 430], [400, 500]]);
  arrow(S, 440, 520, 440, 450, { color: C.p, w: 2.6 }); txt(S, 452, 500, 'look up into the source', { size: 19, color: C.p });
  r1();
  S.draw(a, 6, 1.4);
  eqAt(S, 'R_{in} = \\frac{R_D + r_O}{1 + g_mr_O} \\approx \\frac{1}{g_m}', 420, 600, 8, { size: 34, w: 600 });
  S.say(6, 'Now look <b>up</b>, into a source (your page, right): a plain device with $R_D$ on its drain shows $(R_D + r_O)/(1 + g_mr_O)$ — about $1/g_m$, small. “Down divides.”');
  const b = S.g(); const r2 = S.into(b);
  res(S, 1150, 250, 330, { label: 'R_D' }); rail(S, 1110, 1190, 250, '');
  amp(S, 900, 380, { label: 'A₁', w: 96, h: 90 });
  wire(S, [[996, 380], [1104, 380]]);
  nmos(S, 1150, 380, { name: 'M1' });
  wire(S, [[1150, 430], [1150, 500]]); dot(S, 1150, 460);
  wire(S, [[1150, 460], [880, 460], [880, 402], [900, 402]]);
  wire(S, [[870, 358], [900, 358]]); txt(S, 862, 364, 'V_in', { size: 19, color: C.muted, anchor: 'end' });
  arrow(S, 1190, 520, 1190, 450, { color: C.p, w: 2.6 }); txt(S, 1202, 500, 'boosted', { size: 19, color: C.p });
  r2();
  S.draw(b, 16, 1.6);
  eqAt(S, 'R_{in} = \\frac{R_D + r_O}{1 + (1 + A_1)g_mr_O}', 1130, 600, 19, { size: 34, w: 640, color: '#ffd38a' });
  S.say(16, 'Boost it: the amplifier again moves the gate against any change of the source, so the device fights $(1+A_1)$ times harder…');
  S.say(22, '…and the source looks $(1+A_1)$ times <b>stiffer</b>: $(R_D + r_O)/(1 + (1+A_1)g_mr_O)$.');
  whyBox(S, 250, 690, 1100, 130, '**One rule, both directions:** boosting multiplies the resistance looking **down into a drain** by $(1+A_1)$, and divides the resistance looking **up into a source** by $(1+A_1)$.', 30);
  S.say(30, 'One rule for both directions: “up multiplies, down divides” — and boosting puts an extra $(1+A_1)$ into both.');
  S.say(42, 'Why we need the second one: in a boosted cascode, the input device’s current has to choose between going up into that stiff source or down into $r_{O1}$. Next scene.');
});

scene(L8, 'Boosted cascode: G_m ≈ g_m1 by current divider', 56, (S) => {
  header(S, 'LEC 8 · WHERE DOES M1’S CURRENT GO?', 'The current divider: G_m stays g_m1');
  const g = S.g(); const r = S.into(g);
  rail(S, 380, 640, 150);
  isrc(S, 520, 210, { label: 'I_1' }); wire(S, [[520, 150], [520, 168]]);
  dot(S, 520, 280); wire(S, [[520, 252], [520, 330]]); wire(S, [[520, 280], [620, 280]]); txt(S, 630, 287, 'V_out', { size: 21, color: C.volt, weight: 700 });
  amp(S, 260, 380, { label: 'A₁', w: 96, h: 90 });
  wire(S, [[356, 380], [474, 380]]);
  nmos(S, 520, 380, { name: 'M2' });
  wire(S, [[520, 430], [520, 490]]); dot(S, 520, 460);
  wire(S, [[520, 460], [240, 460], [240, 402], [260, 402]]); gnd(S, 230, 358); wire(S, [[230, 358], [260, 358]]);
  nmos(S, 520, 540, { name: 'M1', gate: 'V_in' }); gnd(S, 520, 590);
  r();
  S.draw(g, 0.3, 2);
  S.say(0.3, 'Your page’s boosted cascode: input M1 at the bottom, boosted cascode M2 above it, load $I_1$ on top.');
  // divider picture
  const d = S.g(); const r2 = S.into(d);
  wire(S, [[980, 250], [980, 300]]);
  S.el('polygon', { points: '980,310 996,330 980,350 964,330', fill: 'none', stroke: C.cur, 'stroke-width': 2.6 });
  arrow(S, 980, 318, 980, 344, { color: C.cur, w: 2.4, head: 9 }); txt(S, 940, 336, 'g_m1 v_in', { size: 21, color: C.cur, weight: 700, anchor: 'end' });
  wire(S, [[980, 360], [980, 420]]);
  wire(S, [[980, 250], [1180, 250]]); wire(S, [[980, 250], [1380, 250]]);
  res(S, 1180, 250, 400, { label: '1/((1+A₁)g_m2)', lcol: C.p });
  res(S, 1380, 250, 400, { label: 'r_O1', lcol: C.n });
  wire(S, [[980, 420], [1380, 420]]); wire(S, [[1180, 400], [1180, 420]]); wire(S, [[1380, 400], [1380, 420]]); gnd(S, 1180, 420);
  r2();
  S.fade(d, 8, 0.8);
  S.say(8, 'Small-signal picture at X: M1 pushes $g_{m1}v_{in}$ into the node, which has two exits — <b>up</b> into M2’s boosted source, or <b>down</b> through $r_{O1}$.');
  S.flow([[1180, 250], [1180, 420]], 14, null, { speed: 90, w: 6 });
  S.flow([[1380, 250], [1380, 420]], 14, null, { speed: 20, w: 1.4 });
  label(S, 1180, 470, '≈ 20 Ω', 14, { size: 22, color: C.p, weight: 700, anchor: 'middle' });
  label(S, 1380, 470, '≈ 50 kΩ', 14, { size: 22, color: C.n, weight: 700, anchor: 'middle' });
  S.say(14, 'With $1/g_{m2} = 1$ kΩ and $A_1 = 50$ the “up” path is about 20 Ω; $r_{O1}$ is tens of kΩ. Current takes the easy path: almost all of it goes up.');
  eqAt(S, 'I_{R_2} = I\\,\\frac{R_1}{R_1+R_2}', 1180, 560, 21, { size: 30, w: 600, color: C.muted });
  eqAt(S, 'I_{out} = g_{m1}V_{in}\\frac{r_{O1}}{r_{O1} + \\frac{1}{(1+A_1)g_{m2}}} \\approx g_{m1}V_{in}', 1050, 650, 25, { size: 32, w: 900 });
  eqAt(S, 'G_m = \\frac{I_{out}}{V_{in}} \\approx g_{m1}', 1050, 740, 31, { size: 38, color: '#ffd38a' });
  S.say(21, 'The little box on your page is the current divider: the current into $R_2$ is $I\\,R_1/(R_1+R_2)$ — the <b>other</b> resistance on top.');
  S.say(25, 'Here: $I_{out} = g_{m1}V_{in}\\,r_{O1}/(r_{O1} + 1/((1+A_1)g_{m2})) ≈ g_{m1}V_{in}$.');
  S.say(31, 'So <b>$G_m ≈ g_{m1}$</b>: boosting costs nothing at the input side. All the benefit is in $R_{out}$.');
});

scene(L8, 'Putting it together: (g_m r_O)³', 52, (S) => {
  header(S, 'LEC 8 · THE GAIN', 'Cascode (g_m r_O)², boosted cascode (g_m r_O)³');
  const rows = [
    ['R_{out} = r_{O1} + r_{O2} + (1+A_1)g_{m2}r_{O1}r_{O2}', 0.4, C.text, 'Lec 7’s formula with $R_S = r_{O1}$ (the input device sits under the source).'],
    ['\\approx (1+A_1)\\,g_{m2}r_{O1}r_{O2}', 6, C.text, 'The last term is thousands of times bigger than $r_{O1} + r_{O2}$: keep only it.'],
    ['\\text{Gain} = G_mR_{out} \\approx g_{m1}(1+A_1)\\,g_{m2}r_{O1}r_{O2}', 12, C.text, 'Multiply by $G_m ≈ g_{m1}$ from the last scene.'],
    ['A_1 = g_{m3}r_{O3} \\;\\Rightarrow\\; \\text{Gain} \\approx (g_mr_O)^3', 19, '#ffd38a', 'If the booster is one CS transistor M3, $A_1 = g_{m3}r_{O3}$. With all $g_m$ and $r_O$ equal: three factors of $g_mr_O$.'],
  ];
  rows.forEach(([tex, t, col, say], i) => { eqAt(S, tex, 800, 200 + i * 95, t, { size: 38, color: col }); S.say(t, say); });
  const tb = html(S, 220, 590, 1160, 250, `<table class="tbl"><tr><th></th><th>plain cascode</th><th>boosted cascode</th></tr>
    <tr><td>${rt('$G_m$')}</td><td>${rt('$≈ g_{m1}$')}</td><td class="same">${rt('$≈ g_{m1}$ (same)')}</td></tr>
    <tr><td>${rt('$R_{out}$')}</td><td>${rt('$g_{m2}r_{O2}r_{O1}$')}</td><td class="chg">${rt('$(1+A_1)g_{m2}r_{O2}r_{O1}$')}</td></tr>
    <tr><td>gain</td><td>${rt('$(g_mr_O)^2$ ≈ 2500')}</td><td class="chg">${rt('$(g_mr_O)^3$ ≈ 125 000')}</td></tr>
    <tr><td>output column</td><td>M2 on M1</td><td class="same">M2 on M1 — nothing stacked</td></tr></table>`);
  tb.style.opacity = 0; S.slideIn(tb, 27, 0.8);
  S.say(27, 'The comparison to remember: same $G_m$, same two devices in the output column, but $R_{out}$ and the gain grow by a whole factor of $g_mr_O$ — about 2500 → 125 000.');
  S.say(40, 'Now: how do you actually build $A_1$? Your page shows three circuits. Watch what each one costs.');
});

/* current path through a FET drawn by fet(): drain lead, across the channel, source lead. d = -1 gate left, +1 gate right */
const fetPath = (x, y, d) => [[x, y - 50], [x, y - 18], [x + 20 * d, y - 18], [x + 20 * d, y + 18], [x, y + 18], [x, y + 50]];

/* Follow the current: implementation 1. Lec 7 already followed these currents ('Follow the current: regulated cascode');
   here only what is new: the page's swapped names, and the booster current pinning X (the swing penalty). */
scene(L8, 'Follow the current: the CS booster (implementation 1)', 56, (S) => {
  header(S, 'LEC 8 · FOLLOW THE CURRENT', 'Same currents as Lec 7, new names, and what they pin');
  const c = regCascode(S, { iout: 'I_1', iaux: 'I_2' });
  c.g.setAttribute('transform', 'translate(40 40)');
  S.draw(c.g, 0.3, 2);
  S.say(0.3, 'You met these currents in Lecture 7: two columns from $V_{DD}$, joined only by gates. Your Lec 8 page draws the same circuit — but with the names swapped. Watch the letters.');
  current(S, [[600, 214], [600, 402], [580, 402], [580, 438], [600, 438], [600, 562], [620, 562], [620, 598], [600, 598], [600, 628]], 4, null, 'I_1: output', { color: C.cur, at: [725, 260] });
  current(S, [[370, 214], [370, 562], [390, 562], [390, 598], [370, 598], [370, 628]], 4, null, 'I_2: booster', { color: C.p, at: [250, 470] });
  S.say(4, 'Quick recap in the page’s names: the output source is $I_1$, through M2 and M1; the booster load is $I_2$, through M3 alone. Gates take no current, so the two never mix.');
  whyBox(S, 880, 140, 660, 140, '**Names swap between sources:** your Lec 8 page calls the output source $I_1$. The 2025 mid-sem and Tutorial 4 call it $I_2$, and $I_1$ is M3’s load. **Follow the branch, not the letter.**', 11);
  S.say(11, 'In the 2025 mid-sem and Tutorial 4 it is the other way round: $I_2$ is the output source and $I_1$ is M3’s load. Follow the branch, not the letter.');
  S.stop(18, {
    src: 'Follow the current',
    q: 'The 2025 mid-sem gives $I_1 = 100\\,\\mu$A and $I_2 = 0.5$ mA, with $I_2$ on the output column. In that paper, how much current flows through M1?',
    choices: ['0.5 mA: the paper’s $I_2$ is the output source', '100 µA: $I_1$ is always the output current', '0.6 mA: both currents add up at X'], answer: 0,
    hint: ['Find the source that sits on top of the output column (M2 over M1) in that paper.', 'M1 carries only the output column’s current; the booster’s current stays in M3.'],
    how: ['In the paper the output column is $I_2$ → M2 → M1, so $$I_{D1} = I_2 = 0.5\\,\\mathrm{mA}$$', 'Not 100 µA: that is $I_1$, M3’s load in the paper’s naming. Not 0.6 mA: X touches M3 only at its gate, which carries no current.'],
    why: 'Decide which source feeds which column from the picture, never from the subscript.',
  });
  S.say(18.4, 'In the paper, $I_2 = 0.5$ mA runs through M2 and M1, and $I_1 = 100\\,\\mu$A runs through M3 alone.');
  eqAt(S, 'V_X = V_{GS3} = V_{th} + \\sqrt{\\tfrac{2I_{D3}}{\\mu_nC_{ox}(W/L)_3}}', 1210, 360, 25, { size: 32, w: 660, color: C.p });
  S.say(25, 'What is new in Lecture 8: M3’s source is on ground and the booster current flows through it. That current fixes M3’s $V_{GS}$ — and X is M3’s gate. So the booster current <b>pins X</b> at $V_{GS3}$.');
  const vov3 = Math.sqrt(2 * 100e-6 / (135e-6 * 200));
  S.stop(32, {
    src: 'Follow the current',
    q: `In the 2025 mid-sem, M3 carries 100 µA with an overdrive $V_{ov3} = ${fx(vov3, 3)}$ V. If the booster current were made 4 times bigger (same M3), what would $V_{ov3}$ become?`,
    answer: 2 * vov3, unit: 'V', tol: 0.02,
    hint: ['In saturation the overdrive grows with the square root of the current.', '$V_{ov} = \\sqrt{\\dfrac{2I_D}{\\mu_nC_{ox}(W/L)}} \\propto \\sqrt{I_D}$'],
    how: ['Square law: $$V_{ov} \\propto \\sqrt{I_D}$$', `4 times the current gives $\\sqrt{4} = 2$ times the overdrive: $$V_{ov3} = 2\\times ${fx(vov3, 3)} = ${fx(2 * vov3, 3)}\\,\\mathrm{V}$$`, `So X rises from ${fx(0.7 + vov3, 3)} V to ${fx(0.7 + 2 * vov3, 3)} V, and the output floor (X + $V_{ov2}$) rises with it.`],
    why: 'More booster current → X higher → less output swing. The booster runs on a small current.',
  });
  S.say(32.4, 'Twice the overdrive: X goes up, and since the output floor is X plus $V_{ov2}$, the swing shrinks. That is why the booster runs on a small current.');
  whyBox(S, 880, 450, 660, 150, '**The current sets the voltage:** the booster current through M3 decides $V_{GS3}$, which is where X sits. That is the implementation-1 swing penalty, seen from the currents.', 32.4);
  remember(S, [
    'Same two columns as Lec 7: output through M2 and M1, booster through M3 alone; gates carry no current.',
    'Names swap: on your page $I_1$ is the output source; in the 2025 mid-sem and Tutorial 4 it is $I_2$. Follow the branch.',
    'The booster current pins X: $V_X = V_{GS3} = V_{th} + \\sqrt{2I_{D3}/(\\mu_nC_{ox}(W/L)_3)}$.',
    'More booster current → bigger $V_{ov3}$ → X higher → output floor higher → less swing.',
  ], 41, 'Follow the current · implementation 1');
  S.say(41, 'Remember: same currents as Lecture 7, but on this page the names are swapped, and the booster current pins X at $V_{GS3}$. Next: the gain and the swing cost.');
});

/* implementation 1, labelled as on the Lec 8 page: I1 on the output, I2 for M3 */
scene(L8, 'Implementation 1: a CS booster (the circled M3)', 74, (S) => {
  header(S, 'LEC 8 · IMPLEMENTATION 1', 'The simplest booster: one CS transistor M3');
  const c = regCascode(S, { iout: 'I_1', iaux: 'I_2' });
  c.g.setAttribute('transform', 'translate(40 40)');
  S.draw(c.g, 0.3, 2.2);
  S.halo(270, 280, 200, 380, C.red, 3, null, 'booster (circled on your page)');
  S.say(0.3, 'Implementation 1. The booster is just <b>M3</b>: its gate sits on X (M2’s source), its drain drives M2’s gate, and $I_2$ is its load. A common-source amplifier.');
  // signal intuition
  const up = arrow(S, 640, 560, 640, 500, { color: C.volt }); S.fade(up, 8, 0.4); S.out(up, 22, 0.4);
  label(S, 652, 530, 'X rises', 8, { size: 20, color: C.volt, weight: 700, out: 22 });
  const g3 = arrow(S, 300, 330, 300, 400, { color: C.amb }); S.fade(g3, 11, 0.4); S.out(g3, 22, 0.4);
  label(S, 150, 370, 'M2’s gate falls', 11, { size: 20, color: C.amb, weight: 700, out: 22 });
  S.say(8, 'Check the sign: if X rises, M3 conducts more and pulls its drain — M2’s gate — <b>down</b>. Exactly the “opposite way” the booster must push.');
  eqAt(S, 'A_1 = g_{m3}r_{O3}', 1180, 230, 15, { size: 38 });
  eqAt(S, 'A_v = g_{m1}(1 + g_{m3}r_{O3})\\,g_{m2}r_{O2}r_{O1}', 1180, 310, 18, { size: 32, w: 760 });
  S.say(15, 'Its gain is $g_{m3}r_{O3}$, so the whole gain is $g_{m1}(1 + g_{m3}r_{O3})g_{m2}r_{O2}r_{O1}$ — your page’s line.');
  // the cost: towers
  const sc = 250, yb = 800;
  const t1 = tower(S, 960, yb, [{ v: 0.2, name: 'M1', st: 'min' }, { v: 0.2, name: 'M2', st: 'sq' }], sc, { nodes: ['0', 'X 0.2', '0.4'], w: 88 });
  label(S, 1004, 660, 'plain cascode', 26, { size: 19, color: C.muted, anchor: 'middle' });
  S.fade(t1, 26, 0.6);
  const t2 = tower(S, 1260, yb, [{ v: 0.7, name: 'M1', st: 'ok', note: 'X = V_GS3' }, { v: 0.2, name: 'M2', st: 'sq' }], sc, { nodes: ['0', 'X 0.7', '0.9'], w: 88 });
  label(S, 1304, 540, 'with the CS booster', 31, { size: 19, color: C.muted, anchor: 'middle' });
  S.fade(t2, 31, 0.6);
  S.say(26, '<span class="why">The cost (green note on your page):</span> in a plain cascode, X only needs M1’s check: $V_{ov1}$, 0.2 V.');
  S.say(31, 'But now X is <b>M3’s gate</b>, and M3’s source is ground. That is a link: X must sit a whole $V_{GS3}$ (0.7 V) up — “minimum voltage $= V_{GS3}$ and not $V_{ov1}$”.');
  eqAt(S, 'V_{out,min} = V_{GS3} + V_{ov2}', 1180, 430, 38, { size: 36, color: '#ffb36b' });
  S.say(38, 'M2’s check then puts the output at least $V_{ov2}$ above X: $V_{out,min} = V_{GS3} + V_{ov2}$ = 0.9 V instead of 0.4 V. <b>Disadvantage: one $V_{th}$ of swing lost.</b>');
  S.say(50, 'Also notice (Tutorial 4 Q1(a)): M2’s gate is two links above ground, $V_{G2} = V_{GS3} + V_{GS2}$.');
  S.say(60, 'Can a PMOS booster avoid the $V_{GS3}$ penalty? That is implementation 2.');
});

/* implementation 2 (PMOS booster), as drawn on the Lec 8 page */
function impl2Fig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 160, 760, 170);
  isrc(S, 560, 230, { label: 'I_1' }); wire(S, [[560, 170], [560, 188]]);
  dot(S, 560, 300); wire(S, [[560, 272], [560, 330]]); wire(S, [[560, 300], [680, 300]]); txt(S, 690, 307, 'V_out', { size: 22, color: C.volt, weight: 700 });
  const m2 = nmos(S, 560, 380, { name: 'M2', gl: 60 });
  dot(S, 560, 460); wire(S, [[560, 430], [560, 490]]); txt(S, 574, 470, 'P', { size: 22, color: C.bad, weight: 750 });
  nmos(S, 560, 540, { name: 'M1', gate: 'V_in' }); gnd(S, 560, 590);
  const m3 = pmos(S, 330, 330, { name: 'M3', right: true, gl: 40, nameSide: 'l' });
  wire(S, [[330, 170], [330, 280]]);
  wire(S, [[m3.gate[0], 330], [470, 330], [470, 460], [560, 460]]);
  wire(S, [[330, 380], [330, 440]]); dot(S, 330, 380); wire(S, [[330, 380], [m2.gate[0], 380]]);
  txt(S, 316, 404, 'G', { size: 22, color: C.amb, weight: 750, anchor: 'end' });
  isrc(S, 330, 480, { label: 'I_2', left: true }); gnd(S, 330, 522);
  r();
  return g;
}

scene(L8, 'Follow the current: the PMOS booster (implementation 2)', 54, (S) => {
  header(S, 'LEC 8 · FOLLOW THE CURRENT', 'A PMOS booster still flows down');
  const g = impl2Fig(S);
  S.draw(g, 0.3, 2);
  S.say(0.3, 'Implementation 2’s currents. The output column is the same as before. The booster is now a PMOS, M3, hanging from $V_{DD}$, with the sink $I_2$ under it.');
  whyBox(S, 880, 140, 660, 140, '**PMOS direction:** current enters at the **source** (on top, at $V_{DD}$) and leaves at the **drain** (bottom). So it still flows **down**. NMOS: drain → source; PMOS: source → drain.', 5);
  S.say(5, 'Direction rule for a PMOS: its source is on top, at $V_{DD}$. Current goes in at the source and out at the drain — still downward.');
  S.stop(10, {
    src: 'Follow the current',
    q: 'Which way does the booster current flow through M3?',
    choices: ['From $V_{DD}$ into M3’s source, out of its drain into node G, then down through $I_2$', 'Up from $I_2$, through M3, into $V_{DD}$', 'From node P into M3’s gate, then down through $I_2$'], answer: 0,
    hint: ['For a PMOS, which terminal sits at the top, on $V_{DD}$? Current enters there.', 'PMOS: source → drain. And a gate carries no DC current.'],
    how: ['M3 is a PMOS with its source tied to $V_{DD}$: current enters a PMOS at its **source**.', 'It leaves at the **drain**, node G, and the sink $I_2$ takes it to ground: $$I_{D3} = I_2$$', 'Not option 3: P is wired to M3’s **gate**, and a gate draws no current. Not option 2: the sink pulls current **down** to ground; nothing pushes up into $V_{DD}$.'],
    why: 'NMOS: drain → source. PMOS: source → drain. Both mean “down”.',
  });
  current(S, [[330, 174], [330, 312], [350, 312], [350, 348], [330, 348], [330, 518]], 10.4, null, 'I_D3 = I_2', { color: C.p, at: [215, 240] });
  eqAt(S, '\\text{booster: }\\; V_{DD} \\to \\text{M3} \\to G \\to I_2', 1210, 340, 10.4, { size: 30, w: 640, color: C.p });
  S.say(10.4, 'So the booster current runs from $V_{DD}$, in at M3’s source, out at its drain G, and down through $I_2$: $I_{D3} = I_2$.');
  const gz = chip(S, 405, 415, 'I_G = 0', { color: C.muted, size: 16 }); gz.style.opacity = 0; S.fade(gz, 10.4, 0.5);
  S.stop(17, {
    src: 'Follow the current',
    q: 'In Tutorial 4 Q2 the output column carries 0.1 mA and the booster M3 about 0.11 mA. Three wires meet at P: M2’s source, M1’s drain and M3’s gate. How much current flows down through M1?',
    answer: 1e-4, unit: 'A', tol: 0.01,
    hint: ['Write KCL at P: what flows in equals what flows out. Which of the three wires can carry current?', '$I_{D2} = I_{D1} + I_{G3}$, with $I_{G3} = 0$.'],
    how: ['KCL at P, in = out: $$I_{D2} = I_{D1} + I_{G3}$$', 'M3’s gate is insulated, $I_{G3} = 0$, so M1 carries exactly what M2 brings down: $$I_{D1} = I_{D2} = 0.1\\,\\mathrm{mA}$$', 'The booster’s 0.11 mA never enters this column: it runs from $V_{DD}$ through M3 into $I_2$ and to ground on its own.'],
    why: 'Adding the two columns (0.21 mA) is the classic slip: they share no drain or source.',
  });
  current(S, [[560, 174], [560, 362], [540, 362], [540, 398], [560, 398], [560, 522], [540, 522], [540, 558], [560, 558], [560, 588]], 17.4, null, 'I_1', { color: C.cur, at: [700, 240] });
  eqAt(S, '\\text{output: }\\; I_{D2} = I_{D1} = I_1', 1210, 410, 17.4, { size: 30, w: 640, color: C.cur });
  S.say(17.4, 'The output column: $I_1$ flows down through M2 and then M1. Same current in each — they are in series.');
  eqAt(S, 'P:\\; I_{D2} = I_{D1} + I_{G3},\\quad I_{G3} = 0', 1210, 480, 23, { size: 30, w: 640, color: '#ffd38a' });
  S.say(23, 'KCL at P: M2 brings $I_1$ in, M1 takes it out, and M3’s gate takes nothing. The booster and the output column never exchange current.');
  whyBox(S, 880, 540, 660, 150, '**Tutorial 4 Q2 names:** $I_1$ is the PMOS **M5** (0.1 mA) on top of the output column; $I_2$ is the NMOS **M4** under the booster. Same two loops.', 30);
  S.say(30, 'In Tutorial 4 Q2 the same picture has real devices: $I_1$ is the PMOS M5 on top of the output column, and $I_2$ is the NMOS M4 under the booster.');
  remember(S, [
    'PMOS: current enters at the **source** (top, $V_{DD}$) and leaves at the **drain**: still downward.',
    'Booster column: $V_{DD}$ → M3 → G → $I_2$ → ground, so $I_{D3} = I_2$.',
    'Output column: $I_1$ → M2 → P → M1; KCL at P gives $I_{D1} = I_{D2}$ because $I_{G3} = 0$.',
    'Tutorial 4 Q2: $I_1$ = PMOS M5 (0.1 mA), $I_2$ = NMOS M4.',
  ], 38, 'Follow the current · implementation 2');
  S.say(38, 'Remember: a PMOS still carries current downward, source to drain, and the two columns only talk through gates. Now: can M3 stay saturated?');
});

scene(L8, 'Implementation 2: a PMOS booster (and why it fails)', 66, (S) => {
  header(S, 'LEC 8 · IMPLEMENTATION 2', 'PMOS booster: the fence that kills it');
  const g = impl2Fig(S);
  S.draw(g, 0.3, 2);
  S.say(0.3, 'Implementation 2: make the booster a <b>PMOS</b> CS stage. M3’s source is at $V_{DD}$, its gate on P (M2’s source), its drain G drives M2’s gate, $I_2$ below.');
  S.say(7, 'Now check if M3 can stay saturated. Use the PMOS fence: its drain may be at most $|V_{th3}|$ above its gate.');
  const ln = [
    ['V_{D3} \\le V_{G3} + |V_{th3}| \\;\\Rightarrow\\; V_G \\le V_P + |V_{th3}|', 11, 'M3’s drain is G, its gate is P: $V_G \\le V_P + |V_{th3}|$.'],
    ['V_G = V_P + V_{GS2}\\quad(\\text{a link: M2’s gate above its source})', 18, 'But G is M2’s gate and P is M2’s source — a link: $V_G = V_P + V_{GS2}$.'],
    ['V_P + V_{GS2} \\le V_P + |V_{th3}|', 24, 'Substitute.'],
    ['V_{GS2} \\le |V_{th3}|', 28, 'Cancel $V_P$: M2’s $V_{GS}$ must stay below one threshold.'],
  ];
  ln.forEach(([tex, t, say], i) => { eqAt(S, tex, 1180, 230 + i * 86, t, { size: i === 3 ? 42 : 28, w: 780, color: i === 3 ? '#ff8f86' : C.text }); S.say(t, say); });
  // cross-section sketch
  const cs = S.g(); const r2 = S.into(cs);
  S.el('rect', { x: 860, y: 640, width: 520, height: 170, rx: 8, fill: '#151c28', stroke: '#2f3b4f', 'stroke-width': 2 });
  S.el('path', { d: 'M930 640 v40 a30 30 0 0 0 60 0 v-40', fill: '#1f2a3a', stroke: C.n, 'stroke-width': 2 });
  S.el('path', { d: 'M1250 640 v40 a30 30 0 0 0 60 0 v-40', fill: '#1f2a3a', stroke: C.n, 'stroke-width': 2 });
  S.el('rect', { x: 990, y: 600, width: 260, height: 20, rx: 4, fill: '#333f52', stroke: C.amb, 'stroke-width': 2 });
  wire(S, [[1120, 560], [1120, 600]]); txt(S, 1132, 576, 'G', { size: 20, color: C.amb, weight: 700 });
  S.el('line', { x1: 990, y1: 646, x2: 1250, y2: 646, stroke: C.cur, 'stroke-width': 2, 'stroke-dasharray': '4 8' });
  txt(S, 1120, 700, 'M2: channel barely formed', { size: 20, color: C.cur, anchor: 'middle', weight: 700 });
  r2();
  S.fade(cs, 34, 0.8);
  S.say(34, 'Your page’s little cross-section shows what that means: with $V_{GS2}$ near threshold, M2’s channel is <b>barely formed</b>. M2 would need a huge width to carry its current.');
  S.say(44, '<span class="why">So implementation 2 fails</span> — not because of the gain, but because of a fence. Implementation 3 keeps the PMOS input and fixes the level problem by folding.');
});

scene(L8, 'Follow the current: the folded booster (implementation 3)', 70, (S) => {
  header(S, 'LEC 8 · FOLLOW THE CURRENT', 'The fold: M3’s current turns round into M4');
  const g = foldedBoost(S);
  S.draw(g, 0.3, 2.4);
  label(S, 284, 452, 'F', 2, { size: 22, color: C.amb, weight: 750, anchor: 'end' });
  S.say(0.3, 'The folded booster has <b>three</b> current paths. Follow them one at a time: the output column, the $I_3$ column through M4, and the PMOS M3.');
  current(S, [[600, 174], [600, 362], [580, 362], [580, 398], [600, 398], [600, 522], [580, 522], [580, 558], [600, 558], [600, 588]], 5, null, 'I_1', { color: C.cur, at: [715, 240] });
  eqAt(S, '\\text{output: }\\; I_{D2} = I_{D1} = I_1', 1210, 200, 5, { size: 30, w: 640, color: C.cur });
  S.say(5, 'Output column first: $I_1$ flows down through M2 and M1. Nothing else joins it — M2’s gate and M3’s gate draw no current.');
  current(S, [[300, 174], [300, 362], [280, 362], [280, 398], [300, 398], [300, 458]], 11, null, 'I_3', { color: C.volt, at: [190, 320] });
  eqAt(S, '\\text{M4: }\\; I_{D4} = I_3', 1210, 270, 11, { size: 30, w: 640, color: C.volt });
  S.say(11, 'Second path: $I_3$ pushes its current down into M4’s drain. The wire to M2’s gate takes nothing, so all of $I_3$ goes through M4 and arrives at node F, M4’s source.');
  current(S, [[420, 452], [420, 502], [440, 502], [440, 538], [420, 538], [420, 600], [360, 600], [360, 462], [302, 462]], 18, null, 'I_D3', { color: C.p, at: [480, 632] });
  eqAt(S, '\\text{M3: }\\; V_{DD} \\to \\text{source} \\to \\text{drain} \\to F', 1210, 340, 18, { size: 30, w: 640, color: C.p });
  S.say(18, 'Third path, the fold: the PMOS M3 takes current from its own little $V_{DD}$ rail, in at its source, out at its drain — and the wire brings it <b>round and up to node F</b>. It turns back on itself: that is the fold.');
  S.stop(26, {
    src: 'Follow the current',
    q: 'Take $I_2 = 150\\,\\mu$A (the sink under F) and $I_3 = 50\\,\\mu$A (the source above M4). How much current does M3 carry?',
    answer: 100e-6, unit: 'A', tol: 0.01,
    hint: ['Write KCL at node F, where M4’s source, M3’s drain and $I_2$ meet.', 'Into F: $I_3$ (through M4) and $I_{D3}$. Out of F: $I_2$. So $I_2 = I_3 + I_{D3}$.'],
    how: ['At node F two currents arrive: M4 brings all of $I_3$ (M2’s gate takes none), and M3 brings $I_{D3}$.', 'One current leaves: the sink $I_2$. KCL, in = out: $$I_2 = I_3 + I_{D3}$$', 'Solve for M3’s share: $$I_{D3} = I_2 - I_3 = 150\\,\\mu - 50\\,\\mu = 100\\,\\mu\\mathrm{A}$$'],
    why: 'In a fold the bottom sink is the biggest current: it carries both branches.',
  });
  current(S, [[300, 462], [300, 580]], 26.4, null, 'I_2 = I_3 + I_D3', { color: C.amb, at: [150, 470] });
  eqAt(S, 'F:\\; I_2 = I_3 + I_{D3} \\;\\Rightarrow\\; I_{D3} = I_2 - I_3', 1210, 420, 26.4, { size: 30, w: 660, color: '#ffd38a' });
  S.say(26.4, 'KCL at F: $I_3$ and M3’s current both arrive, and $I_2$ takes the sum to ground. So $I_{D3} = I_2 - I_3$: with 150 and 50 µA, M3 carries 100 µA.');
  const dm = chip(S, 470, 668, '−ΔI', { color: C.p, size: 17 }); dm.style.opacity = 0; S.fade(dm, 34, 0.5);
  S.say(34, 'Now the signal. X rises, so the PMOS M3’s gate goes up and M3 carries a little less: $-\\Delta I$. But $I_2$ and $I_3$ are fixed sources.');
  S.stop(40, {
    src: 'Follow the current',
    q: 'M3 now carries ΔI less, while the sources $I_2$ and $I_3$ stay fixed. What happens?',
    choices: ['M4 must carry ΔI more; $I_3$ cannot supply it, so M4’s drain (M2’s gate) is pulled down', '$I_2$ carries ΔI less', 'M2’s gate supplies the missing ΔI'], answer: 0,
    hint: ['$I_2$ and $I_3$ are fixed. Which device’s current is free to change?', 'KCL at F: $I_2 = I_{D4} + I_{D3}$. If $I_{D3}$ drops by ΔI, what must $I_{D4}$ do?'],
    how: ['$I_2$ is fixed, so at F: $$I_{D4} + I_{D3} = I_2 \\;\\Rightarrow\\; \\Delta I_{D4} = -\\Delta I_{D3} = +\\Delta I$$', 'M4 now wants $I_3 + \\Delta I$, but the source above it gives only $I_3$. That mismatch pulls the high-resistance node between them — M2’s gate — **down** hard: that drop is the booster’s gain.', 'So X up → M2’s gate down: the booster pushes the opposite way, as it must. A gate carries no current, so option 3 is wrong; $I_2$ is a fixed source, so option 2 is wrong.'],
    why: 'Sources fix the currents; a mismatch shows up as a big voltage swing at the high-resistance node.',
  });
  const dp = chip(S, 240, 430, '+ΔI', { color: C.volt, size: 17 }); dp.style.opacity = 0; S.fade(dp, 40.4, 0.5);
  const gd = chip(S, 400, 340, 'M2 gate ↓', { color: C.amb, size: 17 }); gd.style.opacity = 0; S.fade(gd, 40.4, 0.5);
  eqAt(S, '\\Delta I_{D3} = -\\Delta I \\;\\Rightarrow\\; \\Delta I_{D4} = +\\Delta I', 1210, 510, 40.4, { size: 30, w: 660 });
  S.say(40.4, 'M3 gives ΔI less, so M4 must take ΔI more — the total into $I_2$ stays fixed. $I_3$ can’t supply it, so M2’s gate is pulled <b>down</b>: X up, gate down.');
  whyBox(S, 880, 580, 660, 170, '**Rule of the fold:** the PMOS branch and the cascode branch **share** the bottom sink. Whatever one loses, the other gains — the total is always $I_2$.', 48);
  S.say(48, 'The rule of the fold: the PMOS branch and the M4 branch share the bottom sink. Whatever one loses, the other gains; the total is always $I_2$.');
  remember(S, [
    'Three paths: output ($I_1$ → M2 → M1), $I_3$ → M4 → F, and PMOS M3 from its own $V_{DD}$ → F.',
    'The **fold**: M3’s drain current turns round and enters node F, M4’s source.',
    'KCL at F: $I_2 = I_3 + I_{D3}$, so $I_{D3} = I_2 - I_3$: the bottom sink is the biggest.',
    'Signal: M3 loses ΔI → M4 gains ΔI (total $I_2$ fixed) → M2’s gate is pulled down.',
    'Gates draw no current: the booster and the output column talk only through voltages.',
  ], 55, 'Follow the current · implementation 3');
  S.say(55, 'Remember the fold: two branches share one sink, so whatever M3 loses, M4 gains. Now the booster’s gain.');
});

scene(L8, 'Implementation 3: the folded booster', 60, (S) => {
  header(S, 'LEC 8 · IMPLEMENTATION 3', 'Fold the PMOS booster into an NMOS cascode');
  const g = foldedBoost(S);
  S.draw(g, 0.3, 2.4);
  S.say(0.3, 'Implementation 3 (bottom of your page): the PMOS booster M3 is <b>folded</b> into an NMOS cascode M4, with current sources $I_3$ (top) and $I_2$ (bottom).');
  S.halo(170, 210, 410, 400, C.amb, 5, null, 'booster = a small folded cascode');
  S.say(5, 'M3 senses M2’s source with its gate. Its drain current is folded into M4’s source; M4 carries the signal up to its drain, which drives M2’s gate.');
  eqAt(S, 'A_1 = G_{m,aux}R_{out,aux} = g_{m3}\\,g_{m4}r_{O4}r_{O3}', 1180, 250, 12, { size: 32, w: 760 });
  S.say(12, 'The booster is itself a cascode amplifier: $G_m = g_{m3}$, and looking into M4’s drain you see a cascode, $g_{m4}r_{O4}r_{O3}$. So $A_1 = g_{m3}g_{m4}r_{O4}r_{O3}$ — about 2500 instead of 50.');
  eqAt(S, 'A_v = g_{m1}(1 + A_1)\\,g_{m2}r_{O1}r_{O2}', 1180, 340, 18, { size: 32, w: 760 });
  whyBox(S, 830, 420, 720, 200, '**Why the level problem is gone:** M3 is a PMOS whose gate sits on X. A PMOS gate can sit **low** — even near ground (Lec 6: a folded PMOS input reaches below ground). So X can stay at $V_{ov1}$: **no $V_{GS}$ lost**.', 24);
  S.say(24, '<span class="why">Why it fixes implementation 1:</span> a PMOS input is happy with its gate near ground (Lec 6), so X can stay just $V_{ov1}$ up. No $V_{GS3}$ penalty.');
  whyBox(S, 830, 650, 720, 150, '**Implementation 3 = best of both:** no swing lost, and a bigger boost ($(g_mr_O)^2$-sized $A_1$).', 36);
  S.say(36, 'Best of both: no swing lost, and a booster gain of $(g_mr_O)^2$ instead of $g_mr_O$. This is the version Tutorial 4 Q3 and the 2024 mid-sem Q4 use.');
});

scene(L8, 'Lecture 8 in one card', 30, (S) => {
  header(S, 'LEC 8 · REMEMBER', 'Everything from Lecture 8');
  remember(S, [
    'Amp sensing the source: $G_m ≈ A_1g_m/(R_S + (1+A_1)g_mr_OR_S) ≈ 1/R_S$: **$A_1$ cancels**, so boost $R_{out}$, not $G_m$.',
    'Down into a boosted drain: $R_S + r_O + (1+A_1)g_mR_Sr_O$. Up into a boosted source: $(R_D + r_O)/(1 + (1+A_1)g_mr_O)$.',
    'Boosted cascode: $G_m ≈ g_{m1}$ (current divider), $R_{out} ≈ (1+A_1)g_{m2}r_{O2}r_{O1}$, gain $≈ (g_mr_O)^3$.',
    '**Impl 1 (CS M3):** $A_1 = g_{m3}r_{O3}$, but X = $V_{GS3}$ (a link): $V_{out,min} = V_{GS3} + V_{ov2}$. $V_{G2} = V_{GS3} + V_{GS2}$.',
    '**Impl 2 (PMOS):** fence + link give $V_{GS2} \\le |V_{th3}|$: M2 barely on. Fails.',
    '**Impl 3 (folded):** $A_1 = g_{m3}g_{m4}r_{O4}r_{O3}$, no swing lost.',
  ], 0.4, 'Lecture 8 · remember');
  S.say(0.4, 'Read it once. Then: the 2025 mid-sem question on this exact circuit, and Tutorial 4.');
});

/* implementation 3 (folded booster), as drawn at the bottom of the Lec 8 page */
function foldedBoost(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 140, 760, 170);
  isrc(S, 600, 230, { label: 'I_1' }); wire(S, [[600, 170], [600, 188]]);
  dot(S, 600, 300); wire(S, [[600, 272], [600, 330]]); wire(S, [[600, 300], [700, 300]]); txt(S, 708, 307, 'V_out', { size: 22, color: C.volt, weight: 700 });
  const m2 = nmos(S, 600, 380, { name: 'M2', gl: 110 });
  dot(S, 600, 460); wire(S, [[600, 430], [600, 490]]); txt(S, 614, 474, 'X', { size: 22, color: C.bad, weight: 750 });
  nmos(S, 600, 540, { name: 'M1', gate: 'V_in' }); gnd(S, 600, 590);
  isrc(S, 300, 230, { label: 'I_3', left: true }); wire(S, [[300, 170], [300, 188]]);
  wire(S, [[300, 272], [300, 330]]); dot(S, 300, 300); wire(S, [[300, 300], [500, 300], [500, 380], [m2.gate[0], 380]]);
  nmos(S, 300, 380, { name: 'M4', gate: 'V_b' });
  dot(S, 300, 460); wire(S, [[300, 430], [300, 490]]);
  isrc(S, 300, 540, { label: 'I_2', left: true }); gnd(S, 300, 582);
  const m3 = pmos(S, 420, 520, { name: 'M3', right: true, gl: 30, nameSide: 'l' });
  wire(S, [[420, 470], [420, 446]]); wire(S, [[400, 446], [440, 446]], { w: 3 }); txt(S, 420, 436, 'V_DD', { size: 16, color: C.muted, anchor: 'middle' });
  wire(S, [[420, 570], [420, 600], [360, 600], [360, 460], [300, 460]]);
  wire(S, [[m3.gate[0], 520], [540, 520], [540, 460], [600, 460]]);
  r();
  return g;
}

/* ── Lecture 8 past papers ── */
scene(L8, '2025 mid-sem Q1: CS-boosted cascode, full solve', 92, (S) => {
  const T = tfm(1, 0, 90);
  // every intermediate, from the givens (M1–M3 W/L = 200, µnCox = 135µ, PMOS W/L = 100, µpCox = 40µ, λn = 0.1, λp = 0.2)
  const un = 135e-6, I1 = 100e-6, I2 = 0.5e-3;
  const vov3 = Math.sqrt(2 * I1 / (un * 200)), vov2 = Math.sqrt(2 * I2 / (un * 200)), vovp = Math.sqrt(2 * I2 / (40e-6 * 100));
  const gm3 = Math.sqrt(2 * un * 200 * I1), rO3 = 1 / (0.1 * I1), rOI1 = 1 / (0.2 * I1), A1 = gm3 * rO3 * rOI1 / (rO3 + rOI1);
  const gm1 = Math.sqrt(2 * un * 200 * I2), rO1 = 1 / (0.1 * I2), Rdown = A1 * gm1 * rO1 * rO1, Rup = 1 / (0.2 * I2), Rout = Rup * Rdown / (Rup + Rdown);
  const vmin = ans('pyq-m25-q1', 'vx') + vov2;
  const off = pyqFrame(S, {
    paper: 'm25q1', tag: 'LEC 8 · PAST PAPER 1 OF 3', title: 'The regulated cascode, as asked in the 2025 mid-sem', src: 'Mid-sem 2025-26 Q1 · 13 marks',
    q: '$I_1 = 100\\,\\mu$A (M3’s load, feeds P), $I_2 = 0.5$ mA (output), $(W/L)_{1,2,3} = 200$; $I_1, I_2$ are PMOS with $W/L = 100$. (a) DC voltages at X and P. (b) Maximum swing. (c) Gain.',
    giv: '$V_{DD} = 3$ V, $\\mu_nC_{ox} = 135\\,\\mu$, $\\mu_pC_{ox} = 40\\,\\mu$A/V², $V_{thn} = 0.7$, $|V_{thp}| = 0.8$ V, $\\lambda_n = 0.1$, $\\lambda_p = 0.2$ V⁻¹',
    qh: 290, tests: 'implementation 1 of Lec 8: **links up from ground** for the biases, the **booster’s swing penalty**, and the **load trap** in the gain.',
    fig: (S2) => { const c = regCascode(S2, { iout: 'I_2 (PMOS)', iaux: 'I_1 (PMOS)', pname: 'P' }); c.g.setAttribute('transform', 'translate(0 90)'); },
    steps: [
      { t: 7, title: '**(a) Walk up from ground.** M3’s source is on ground and it carries $I_1 = 100\\,\\mu$A, so its gate X sits exactly one $V_{GS3}$ up — a **link**, not a choice.',
        tex: 'V_X = V_{th} + \\sqrt{\\tfrac{2I_1}{\\mu_nC_{ox}(W/L)}} = 0.7 + \\sqrt{\\tfrac{2(100\\mu)}{135\\mu\\times 200}} = 0.7 + 0.0861 = 0.786\\,\\mathrm{V}', hl: [T([250, 470, 170, 140, C.volt])],
        try: {
          q: '**(a)** M3 carries $I_1 = 100\\,\\mu$A with its source on ground. Find the DC voltage at X.', answer: ans('pyq-m25-q1', 'vx'), unit: 'V', tol: 0.01,
          parts: [{ q: 'First M3’s overdrive $V_{ov3}$ at $I_1 = 100\\,\\mu$A.', answer: vov3, unit: 'V', tol: 0.02, hint: ['$V_{ov} = \\sqrt{\\dfrac{2I_D}{\\mu_nC_{ox}(W/L)}}$'], how: ['$$V_{ov3} = \\sqrt{\\tfrac{2(100\\mu)}{135\\mu\\times 200}} = 0.0861\\,\\mathrm{V}$$'] }],
          hint: ['X is M3’s gate and M3’s source is on ground, so X sits exactly one $V_{GS3}$ above ground (a link).', '$V_X = V_{GS3} = V_{th} + \\sqrt{\\dfrac{2I_1}{\\mu_nC_{ox}(W/L)_3}}$'],
          how: ['M3’s source is on ground and its gate is X, so X is one gate–source drop up: $$V_X = V_{GS3} = V_{th} + V_{ov3}$$', 'M3’s overdrive from its current $I_1 = 100\\,\\mu$A (square law): $$V_{ov3} = \\sqrt{\\tfrac{2I_1}{\\mu_nC_{ox}(W/L)}} = \\sqrt{\\tfrac{2(100\\mu)}{135\\mu\\times 200}} = 0.0861\\,\\mathrm{V}$$', 'Add the threshold: $$V_X = 0.7 + 0.0861 = 0.786\\,\\mathrm{V}$$'],
          why: 'Gate on X, source on ground: $V_X = V_{GS3}$. Bias voltages here are links from ground.',
          calc: [{ what: 'V_X in one line (prefixes on)', keys: '0.7 + [√] ( 2 × 100µ ÷ ( 135µ × 200 ) ) [EXE]', shows: '0.786', note: 'Type µ with [CATALOG] ▸ Engineer Symbol ▸ micro. Then [VARIABLE] ▸ A ▸ Store to keep V_X for part (b).' }],
        },
        say: 'M3 carries 100 µA with its source on ground, so its gate X sits one $V_{GS3}$ up: 0.786 V.' },
      { t: 16, title: '**(a) One more link up.** P is M2’s gate and X is M2’s source. M2 is in series with M1, so it carries the output current $I_2 = 0.5$ mA: P sits one $V_{GS2}$ above X.',
        tex: 'V_{ov2} = \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{135\\mu\\times 200}} = 0.192\\,\\mathrm{V},\\; V_P = V_X + V_{th} + V_{ov2} = 0.786 + 0.7 + 0.192 = 1.679\\,\\mathrm{V}', hl: [T([470, 330, 190, 100, C.volt])],
        try: {
          q: '**(a)** P is M2’s gate. M2 carries $I_2 = 0.5$ mA. Using $V_X$ from above, find the DC voltage at P.', answer: ans('pyq-m25-q1', 'vp'), unit: 'V', tol: 0.01,
          parts: [{ q: 'First M2’s overdrive $V_{ov2}$ (M2 carries $I_2 = 0.5$ mA).', answer: vov2, unit: 'V', tol: 0.02, hint: ['M2 is in series with M1: it carries the output current. $V_{ov} = \\sqrt{2I_D/(\\mu_nC_{ox}(W/L))}$'], how: ['$$V_{ov2} = \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{135\\mu\\times 200}} = 0.192\\,\\mathrm{V}$$'] }],
          hint: ['P is M2’s gate and X is M2’s source: a second link stacked on the first.', '$V_P = V_X + V_{GS2} = V_X + V_{th} + \\sqrt{\\dfrac{2I_2}{\\mu_nC_{ox}(W/L)_2}}$'],
          how: ['M2’s source is X and its gate is P, so P is one $V_{GS2}$ above X: $$V_P = V_X + V_{GS2}$$', 'M2 is in series with M1, so it carries the output current $I_2 = 0.5$ mA: $$V_{ov2} = \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{135\\mu\\times 200}} = 0.192\\,\\mathrm{V}$$', 'Stack the two links (X from the step above): $$V_P = 0.786 + 0.7 + 0.192 = 1.679\\,\\mathrm{V}$$'],
          why: 'Two links from ground: $V_P = V_{GS3} + V_{GS2}$.',
        },
        say: 'P sits one more link up: $V_P = V_X + V_{GS2} = 1.679$ V. Two links stacked.' },
      { t: 25, title: '**(b) Ceiling.** The PMOS source $I_2$ sits between $V_{DD}$ and the output. It stays saturated only while it keeps its $|V_{ov}|$, so $V_{out}$ can rise to $V_{DD} - |V_{ov}|$.',
        tex: '|V_{ov}| = \\sqrt{\\tfrac{2I_2}{\\mu_pC_{ox}(W/L)_p}} = \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{40\\mu\\times 100}} = 0.5\\,\\mathrm{V},\\; V_{out,max} = V_{DD} - |V_{ov}| = 3 - 0.5 = 2.5\\,\\mathrm{V}', hl: [T([470, 170, 190, 110, C.p])],
        try: {
          q: '**(b)** The output current source $I_2$ is a PMOS ($W/L = 100$) carrying 0.5 mA. How high can $V_{out}$ go before it leaves saturation?', answer: 2.5, unit: 'V', tol: 0.01,
          parts: [{ q: 'First the PMOS source’s overdrive $|V_{ov}|$ at 0.5 mA.', answer: vovp, unit: 'V', tol: 0.02, hint: ['$|V_{ov}| = \\sqrt{\\dfrac{2I_D}{\\mu_pC_{ox}(W/L)_p}}$ with $\\mu_pC_{ox} = 40\\,\\mu$A/V², $W/L = 100$.'], how: ['$$|V_{ov}| = \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{40\\mu\\times 100}} = 0.5\\,\\mathrm{V}$$'] }],
          hint: ['A PMOS current source needs its drain at least $|V_{ov}|$ below its source, which is $V_{DD}$.', '$V_{out,max} = V_{DD} - |V_{ov}|,\\quad |V_{ov}| = \\sqrt{\\dfrac{2I_2}{\\mu_pC_{ox}(W/L)_p}}$'],
          how: ['The PMOS source’s source is $V_{DD}$ and its drain is the output. To stay saturated it needs $|V_{SD}| \\ge |V_{ov}|$, so $$V_{out,max} = V_{DD} - |V_{ov}|$$', 'Its overdrive at 0.5 mA with $\\mu_pC_{ox} = 40\\,\\mu$A/V²: $$|V_{ov}| = \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{40\\mu\\times 100}} = 0.5\\,\\mathrm{V}$$', 'Subtract from the supply: $$V_{out,max} = 3 - 0.5 = 2.5\\,\\mathrm{V}$$'],
          why: 'Ceiling = $V_{DD}$ minus the top device’s $|V_{ov}|$ (not its $|V_{GS}|$).',
        },
        say: 'Ceiling: the PMOS current source on top needs its overdrive, 0.5 V: $V_{out,max} = 2.5$ V.' },
      { t: 33, title: '**(b) Floor.** M2’s source X is stuck at $V_{GS3}$ (the implementation-1 penalty), and M2 needs its own $V_{ov2}$ above that. Swing = ceiling − floor.',
        tex: 'V_{out,min} = V_X + V_{ov2} = 0.786 + 0.192 = 0.979\\,\\mathrm{V},\\; \\text{swing} = V_{out,max} - V_{out,min} = 2.5 - 0.979 = 1.521\\,\\mathrm{V}', hl: [T([470, 330, 190, 160, C.bad])],
        try: {
          q: '**(b)** Using $V_X$ from part (a) and the ceiling just found, what is the maximum output swing?', answer: ans('pyq-m25-q1', 'swing'), unit: 'V', tol: 0.01,
          parts: [{ q: 'First the floor $V_{out,min}$, set by M2.', answer: vmin, unit: 'V', tol: 0.01, hint: ['M2 needs its drain at least $V_{ov2}$ above its source X: $V_{out,min} = V_X + V_{ov2}$.'], how: ['$V_X$ and $V_{ov2}$ from part (a): $$V_{out,min} = 0.786 + 0.192 = 0.979\\,\\mathrm{V}$$'] }],
          hint: ['The floor is set by M2: its drain (the output) must stay at least $V_{ov2}$ above its source X.', '$V_{out,min} = V_X + V_{ov2}$, then swing $= V_{out,max} - V_{out,min}$.'],
          how: ['M2 stays saturated while its drain is at least $V_{ov2}$ above its source X, and X is pinned at $V_{GS3}$ by the booster: $$V_{out,min} = V_X + V_{ov2}$$', 'Use $V_X$ from (a) and M2’s overdrive at 0.5 mA (also from (a)): $$V_{out,min} = 0.786 + 0.192 = 0.979\\,\\mathrm{V}$$', 'Swing is the room between ceiling and floor: $$\\text{swing} = 2.5 - 0.979 = 1.521\\,\\mathrm{V}$$'],
          why: 'With a CS booster the floor is $V_{GS3} + V_{ov2}$, not $2V_{ov}$: one $V_{th}$ of swing lost.',
        },
        say: 'Floor: X is at $V_{GS3}$ (the implementation-1 penalty) plus $V_{ov2}$: 0.979 V. Swing = 2.5 − 0.979 = 1.52 V.' },
      { t: 42, title: '**(c) Booster gain.** M3 is a CS stage whose load $I_1$ is a **real PMOS** with its own $r_O$, so $A_1 = g_{m3}(r_{O3}\\parallel r_{O,I1})$. It multiplies the cascode’s $R_{down}$.',
        tex: 'g_{m3} = \\sqrt{2(135\\mu)(200)(100\\mu)} = 2.32\\,\\mathrm{mS},\\; r_{O3} = \\tfrac{1}{0.1\\times 100\\mu} = 100\\,\\mathrm{k\\Omega},\\; r_{O,I1} = \\tfrac{1}{0.2\\times 100\\mu} = 50\\,\\mathrm{k\\Omega},\\; A_1 = g_{m3}(r_{O3}\\parallel r_{O,I1}) = 2.32\\mathrm{m}\\times 33.3\\mathrm{k} = 77.5', hl: [T([250, 170, 170, 450, C.amb])],
        try: {
          q: '**(c)** First the booster. M3 runs at $I_1 = 100\\,\\mu$A, and its load $I_1$ is a PMOS ($\\lambda_p = 0.2$ V⁻¹), M3 has $\\lambda_n = 0.1$ V⁻¹. Find the booster gain $A_1$.', answer: A1, unit: 'V/V', tol: 0.02,
          parts: [
            { q: 'M3’s transconductance $g_{m3}$ at 100 µA.', answer: gm3, unit: 'S', tol: 0.02, hint: ['$g_m = \\sqrt{2\\mu_nC_{ox}(W/L)I_D}$'], how: ['$$g_{m3} = \\sqrt{2(135\\mu)(200)(100\\mu)} = 2.32\\,\\mathrm{mS}$$'] },
            { q: 'M3’s own output resistance $r_{O3}$ ($\\lambda_n = 0.1$ V⁻¹).', answer: rO3, unit: 'Ω', tol: 0.02, hint: ['$r_O = \\dfrac{1}{\\lambda I_D}$'], how: ['$$r_{O3} = \\tfrac{1}{0.1\\times 100\\mu} = 100\\,\\mathrm{k\\Omega}$$'] },
            { q: 'The PMOS load’s output resistance $r_{O,I1}$ ($\\lambda_p = 0.2$ V⁻¹, same 100 µA).', answer: rOI1, unit: 'Ω', tol: 0.02, hint: ['$r_O = \\dfrac{1}{\\lambda_p I_D}$'], how: ['$$r_{O,I1} = \\tfrac{1}{0.2\\times 100\\mu} = 50\\,\\mathrm{k\\Omega}$$'] },
          ],
          hint: ['M3 is a common-source stage. Its load is not ideal: the PMOS source’s own $r_O$ sits in parallel with $r_{O3}$.', '$A_1 = g_{m3}(r_{O3}\\parallel r_{O,I1}),\\; g_{m3} = \\sqrt{2\\mu_nC_{ox}(W/L)I_1},\\; r_O = \\dfrac{1}{\\lambda I_D}$'],
          how: ['M3’s transconductance at 100 µA: $$g_{m3} = \\sqrt{2\\mu_nC_{ox}(W/L)I_1} = \\sqrt{2(135\\mu)(200)(100\\mu)} = 2.32\\,\\mathrm{mS}$$', 'The two resistances at M3’s drain, from $r_O = 1/(\\lambda I_D)$: $$r_{O3} = \\tfrac{1}{0.1\\times 100\\mu} = 100\\,\\mathrm{k\\Omega},\\; r_{O,I1} = \\tfrac{1}{0.2\\times 100\\mu} = 50\\,\\mathrm{k\\Omega}$$', 'They are in parallel (33.3 kΩ), so $$A_1 = 2.32\\mathrm{m}\\times 33.3\\mathrm{k} = 77.5$$'],
          why: 'The real PMOS load cuts the booster gain: an ideal load would give $g_{m3}r_{O3} = 232$.',
          calc: [{ what: 'g_m3 × (r_O3 ∥ r_O,I1) in one line', keys: '[√] ( 2 × 135µ × 200 × 100µ ) × ( 100k [SHIFT][^] + 50k [SHIFT][^] ) [SHIFT][^] [EXE]', shows: '77.46', note: '[SHIFT][^] is x⁻¹: (1/R1 + 1/R2)⁻¹ is the parallel combination.' }],
        },
        say: 'Careful: M3’s load $I_1$ is a real PMOS, so $A_1 = g_{m3}(r_{O3}\\parallel r_{O,I1}) = 77.5$, not the ideal-load 232.' },
      { t: 51, title: '**(c) The load trap.** Looking down the output sees $R_{down} ≈ 161$ MΩ, but looking up it sees only the PMOS source’s $r_O = 10$ kΩ. In parallel, the small one wins.',
        tex: 'g_{m1} = g_{m2} = \\sqrt{2(135\\mu)(200)(0.5\\mathrm{m})} = 5.20\\,\\mathrm{mS},\\; r_{O1} = r_{O2} = \\tfrac{1}{0.1\\times 0.5\\mathrm{m}} = 20\\,\\mathrm{k\\Omega},\\; R_{down} = A_1g_{m2}r_{O2}r_{O1} = 77.5\\times 5.20\\mathrm{m}\\times 20\\mathrm{k}\\times 20\\mathrm{k} = 161\\,\\mathrm{M\\Omega},\\; R_{up} = \\tfrac{1}{\\lambda_pI_2} = \\tfrac{1}{0.2\\times 0.5\\mathrm{m}} = 10\\,\\mathrm{k\\Omega},\\; A_v = -g_{m1}(R_{up}\\parallel R_{down}) = -5.20\\mathrm{m}\\,(10\\mathrm{k}\\parallel 161\\mathrm{M}) = -51.96', hl: [T([470, 170, 190, 110, C.bad])],
        try: {
          q: '**(c)** Now the whole gain. The output current source is a PMOS at 0.5 mA ($\\lambda_p = 0.2$ V⁻¹), and $A_1$ comes from the step above. Find the size of the overall gain, $|A_v|$.', answer: -ans('pyq-m25-q1', 'av'), unit: 'V/V', tol: 0.03,
          parts: [
            { q: '$g_{m1}$ (= $g_{m2}$): M1 and M2 carry 0.5 mA.', answer: gm1, unit: 'S', tol: 0.02, hint: ['$g_m = \\sqrt{2\\mu_nC_{ox}(W/L)I_D}$'], how: ['$$g_{m1} = \\sqrt{2(135\\mu)(200)(0.5\\mathrm{m})} = 5.20\\,\\mathrm{mS}$$'] },
            { q: '$r_{O1}$ (= $r_{O2}$) at 0.5 mA, $\\lambda_n = 0.1$ V⁻¹.', answer: rO1, unit: 'Ω', tol: 0.02, hint: ['$r_O = \\dfrac{1}{\\lambda I_D}$'], how: ['$$r_{O1} = \\tfrac{1}{0.1\\times 0.5\\mathrm{m}} = 20\\,\\mathrm{k\\Omega}$$'] },
            { q: '$R_{down}$, looking down into M2’s drain, boosted by $A_1$ from the step above.', answer: Rdown, unit: 'Ω', tol: 0.03, hint: ['$R_{down} ≈ A_1\\,g_{m2}r_{O2}r_{O1}$'], how: ['$$R_{down} = 77.5\\times 5.20\\mathrm{m}\\times 20\\mathrm{k}\\times 20\\mathrm{k} = 161\\,\\mathrm{M\\Omega}$$'] },
            { q: '$R_{up}$, looking up into the PMOS output source (0.5 mA, $\\lambda_p = 0.2$ V⁻¹).', answer: Rup, unit: 'Ω', tol: 0.02, hint: ['A plain current-source transistor shows just its $r_O = 1/(\\lambda_pI_D)$.'], how: ['$$R_{up} = \\tfrac{1}{0.2\\times 0.5\\mathrm{m}} = 10\\,\\mathrm{k\\Omega}$$'] },
            { q: '$R_{out} = R_{up}\\parallel R_{down}$.', answer: Rout, unit: 'Ω', tol: 0.02, hint: ['In parallel, the much smaller resistance wins.'], how: ['$$R_{out} = 10\\mathrm{k}\\parallel 161\\mathrm{M} ≈ 10\\,\\mathrm{k\\Omega}$$'] },
          ],
          hint: ['Gain = $G_m \\times R_{out}$, with $G_m ≈ g_{m1}$ and $R_{out} = R_{up}\\parallel R_{down}$.', '$|A_v| = g_{m1}(R_{up}\\parallel R_{down}),\\; R_{up} = r_{O,I2} = \\dfrac{1}{\\lambda_pI_2}$'],
          how: ['M1 is the input device at 0.5 mA: $$g_{m1} = \\sqrt{2(135\\mu)(200)(0.5\\mathrm{m})} = 5.2\\,\\mathrm{mS}$$', 'Looking up, the PMOS source is just its $r_O$: $$R_{up} = \\tfrac{1}{0.2\\times 0.5\\mathrm{m}} = 10\\,\\mathrm{k\\Omega}$$', 'In parallel with 161 MΩ the 10 kΩ wins: $$R_{out} = 10\\mathrm{k}\\parallel 161\\mathrm{M} ≈ 10\\,\\mathrm{k\\Omega}$$', 'Multiply: $$|A_v| = 5.2\\mathrm{m}\\times 10\\mathrm{k} = 51.96$$ It is inverting, so $A_v ≈ -52$.'],
          why: 'Boosting one side is wasted if the other side is a plain $r_O$: always check both $R_{up}$ and $R_{down}$.',
          calc: [{ what: 'g_m1 × (R_up ∥ R_down)', keys: '[√] ( 2 × 135µ × 200 × 0.5m ) × ( 10k [SHIFT][^] + 161M [SHIFT][^] ) [SHIFT][^] [EXE]', shows: '51.96', note: 'Type k and M with [CATALOG] ▸ Engineer Symbol.' }],
        },
        say: 'Looking up, the PMOS source shows 10 kΩ. In parallel with 161 MΩ the 10 kΩ wins: $A_v ≈ -52$. The boost is wasted by the load.' },
      { t: 60, ans: true, title: `**Answers:** $V_X = ${fx(ans('pyq-m25-q1', 'vx'), 3)}$ V, $V_P = ${fx(ans('pyq-m25-q1', 'vp'), 4)}$ V, swing $${fx(ans('pyq-m25-q1', 'swing'), 3)}$ V, $A_v = ${fx(ans('pyq-m25-q1', 'av'), 4)}$`, say: 'Write-up order for 13 marks: biases by links from ground, ceiling from the PMOS overdrive, floor = X + $V_{ov2}$, then $A_1$, $R_{down}$, and the gain with the load in parallel.' },
    ],
  });
  // the two branch currents, shown while the bias steps use them
  current(S, [[330, 264], [330, 612], [350, 612], [350, 648], [330, 648], [330, 678]], off + 7, off + 16, 'I_1 = 100 µA', { color: C.p, at: [230, 520] });
  current(S, [[560, 264], [560, 452], [540, 452], [540, 488], [560, 488], [560, 612], [580, 612], [580, 648], [560, 648], [560, 678]], off + 16, off + 25, 'I_2 = 0.5 mA', { color: C.cur, at: [700, 560] });
}, { q: 'Mid-sem 2025 Q1' });

/* Tutorial 4 Q2's circuit (as in the app): M5 PMOS load, M2, M1; booster PMOS M3 (source VS, gate P) loaded by M4 */
function pmosBoostFig(S) {
  const g = S.g(); const r = S.into(g);
  rail(S, 440, 760, 170);
  const xo = 620;
  pmos(S, xo, 230, { name: 'M5', gate: 'V_bp', right: true, nameSide: 'l' }); wire(S, [[xo, 170], [xo, 180]]);
  dot(S, xo, 310); wire(S, [[xo, 280], [xo, 330]]); wire(S, [[xo, 310], [720, 310]]); txt(S, 728, 317, 'V_out', { size: 22, color: C.volt, weight: 700 });
  const m2 = nmos(S, xo, 380, { name: 'M2', gl: 120 });
  dot(S, xo, 460); wire(S, [[xo, 430], [xo, 490]]); txt(S, xo + 14, 474, 'P', { size: 22, color: C.bad, weight: 750 });
  nmos(S, xo, 540, { name: 'M1', gate: 'V_in' }); gnd(S, xo, 590);
  const xa = 330;
  txt(S, xa, 200, 'V_S', { size: 21, color: C.amb, weight: 700, anchor: 'middle' }); dot(S, xa, 214); wire(S, [[xa, 214], [xa, 250]]);
  const m3 = pmos(S, xa, 300, { name: 'M3', right: true, gl: 40, nameSide: 'l' });
  wire(S, [[m3.gate[0], 300], [520, 300], [520, 460], [xo, 460]]);
  wire(S, [[xa, 350], [xa, 440]]); dot(S, xa, 380); wire(S, [[xa, 380], [m2.gate[0], 380]]);
  nmos(S, xa, 490, { name: 'M4', gate: 'V_bn' }); gnd(S, xa, 540);
  r();
  return g;
}

scene(L8, 'Tutorial 4 Q2: the PMOS booster with numbers', 80, (S) => {
  const T = tfm(1, 0, 110);
  // intermediates from the givens: µnCox = 150µ, µpCox = 100µ, (W/L)n = 150, (W/L)p = 100, ID = 0.1 mA
  const vov5 = Math.sqrt(2 * 0.1e-3 / (100e-6 * 100)), vov1 = Math.sqrt(2 * 0.1e-3 / (150e-6 * 150));
  const vd3 = vov1 + 0.7 + vov1, fence3 = vov1 + 0.85;
  const gmn = Math.sqrt(2 * 150e-6 * 150 * 0.1e-3), gmro = Math.sqrt(2550), ron = gmro / gmn;
  const off = pyqFrame(S, {
    paper: 't4q2', tag: 'LEC 8 · PAST PAPER 2 OF 3', title: 'Is the PMOS booster’s M3 saturated?', src: 'Tutorial 4 Q2',
    q: 'M5 (PMOS load, gate $V_{bp}$), M2 and M1 carry $I_{D1} = 0.1$ mA. (a) $V_{bp}$. (b) With $V_P = V_{ov1}$, is M3 saturated? (c) With $V_{ov4} = 0.1$ V, the required $V_S$. (d) Booster removed, M5 ideal: λ for a gain ≈ 2550. (e) Gain with $\\lambda_p = 1.3\\lambda_n$.',
    giv: '$V_{DD} = 1.8$ V, $\\mu_nC_{ox} = 150\\,\\mu$, $\\mu_pC_{ox} = 100\\,\\mu$A/V², $(W/L)_n = 150$, $(W/L)_p = 100$, $V_{thn} = 0.7$, $|V_{thp}| = 0.85$ V',
    qh: 290, tests: 'implementation 2 of Lec 8: the **PMOS fence on M3** that forces $V_{GS2} \\le |V_{th3}|$, plus links for the biases and the load trap.',
    fig: (S2) => { const g = pmosBoostFig(S2); g.setAttribute('transform', 'translate(0 110)'); },
    steps: [
      { t: 7, title: '**(a) A link from the top.** M5’s source is on $V_{DD}$ and its gate is $V_{bp}$, so $V_{bp}$ sits one $|V_{GS5}|$ below $V_{DD}$; its 0.1 mA fixes that drop.',
        tex: 'V_{bp} = V_{DD} - |V_{GS5}| = 1.8 - \\left(0.85 + \\sqrt{\\tfrac{2(0.1\\mathrm{m})}{100\\mu\\times 100}}\\right) = 1.8 - 0.991 = 0.809\\,\\mathrm{V}', hl: [T([540, 170, 220, 120, C.p])],
        try: {
          q: '**(a)** M5 is a PMOS load carrying 0.1 mA. Find its gate bias $V_{bp}$.', answer: ans('bank-t4q2', 'vbp'), unit: 'V', tol: 0.01,
          parts: [{ q: 'First M5’s overdrive $|V_{ov5}|$ at 0.1 mA.', answer: vov5, unit: 'V', tol: 0.02, hint: ['$|V_{ov}| = \\sqrt{\\dfrac{2I_D}{\\mu_pC_{ox}(W/L)_p}}$'], how: ['$$|V_{ov5}| = \\sqrt{\\tfrac{2(0.1\\mathrm{m})}{100\\mu\\times 100}} = 0.141\\,\\mathrm{V}$$'] }],
          hint: ['M5’s source is on $V_{DD}$, so its gate is one $|V_{GS5}|$ below $V_{DD}$ (a link).', '$V_{bp} = V_{DD} - |V_{GS5}|,\\; |V_{GS5}| = |V_{thp}| + \\sqrt{\\dfrac{2I_D}{\\mu_pC_{ox}(W/L)_p}}$'],
          how: ['M5’s source sits on $V_{DD}$ and its gate is $V_{bp}$: $$V_{bp} = V_{DD} - |V_{GS5}|$$', 'Its overdrive at 0.1 mA: $$|V_{ov5}| = \\sqrt{\\tfrac{2(0.1\\mathrm{m})}{100\\mu\\times 100}} = 0.141\\,\\mathrm{V}$$', 'Add the threshold, then subtract from the supply: $$V_{bp} = 1.8 - (0.85 + 0.141) = 0.809\\,\\mathrm{V}$$'],
          why: 'Common slip: subtracting only $|V_{ov}|$ gives 1.66 V. A gate bias needs the full $|V_{GS}|$.',
        },
        say: '(a) A link from the top: $V_{bp} = V_{DD} - |V_{GS5}| = 0.809$ V.' },
      { t: 16, title: '**(b) The Lec 8 fence.** M3’s drain is M2’s gate, at $V_P + V_{GS2}$. A PMOS stays saturated while its drain is at most $|V_{thp}|$ above its gate, which is P.',
        tex: 'V_{ov1} = \\sqrt{\\tfrac{2(0.1\\mathrm{m})}{150\\mu\\times 150}} = 0.094\\,\\mathrm{V},\\; V_{D3} = V_P + V_{thn} + V_{ov2} = 0.094 + 0.7 + 0.094 = 0.889\\,\\mathrm{V},\\; V_{G3} + |V_{thp}| = 0.094 + 0.85 = 0.944\\,\\mathrm{V}\\;\\Rightarrow\\; 0.889 \\le 0.944\\;\\checkmark', hl: [T([250, 240, 170, 170, C.amb])],
        try: {
          q: '**(b)** Take $V_P = V_{ov1}$ (M1 and M2 carry 0.1 mA). Is the booster PMOS M3 saturated?',
          parts: [
            { q: '$V_P = V_{ov1}$: M1’s overdrive at 0.1 mA.', answer: vov1, unit: 'V', tol: 0.02, hint: ['$V_{ov} = \\sqrt{\\dfrac{2I_D}{\\mu_nC_{ox}(W/L)_n}}$'], how: ['$$V_{ov1} = \\sqrt{\\tfrac{2(0.1\\mathrm{m})}{150\\mu\\times 150}} = 0.094\\,\\mathrm{V}$$'] },
            { q: 'M3’s drain voltage $V_{D3}$ (it is M2’s gate; M2 also carries 0.1 mA).', answer: vd3, unit: 'V', tol: 0.01, hint: ['$V_{D3} = V_P + V_{GS2} = V_P + V_{thn} + V_{ov2}$, with $V_{ov2} = V_{ov1}$.'], how: ['$$V_{D3} = 0.094 + 0.7 + 0.094 = 0.889\\,\\mathrm{V}$$'] },
            { q: 'The highest drain voltage M3 allows in saturation, $V_{G3} + |V_{thp}|$ (its gate is P).', answer: fence3, unit: 'V', tol: 0.01, hint: ['PMOS fence: $V_D \\le V_G + |V_{thp}|$.'], how: ['$$V_{G3} + |V_{thp}| = 0.094 + 0.85 = 0.944\\,\\mathrm{V}$$'] },
          ],
          choices: ['Yes, just: its drain sits below its gate + $|V_{thp}|$', 'No: its drain is too high, so it is in triode', 'Cannot tell without λ'], answer: 0,
          hint: ['M3’s gate is P and its drain is M2’s gate. Find both voltages, then use the PMOS fence.', 'PMOS saturated while $V_{D3} \\le V_{G3} + |V_{thp}|$, with $V_{D3} = V_P + V_{GS2}$ and $V_{G3} = V_P$.'],
          how: ['M1 and M2 carry 0.1 mA with $(W/L)_n = 150$: $$V_{ov1} = V_{ov2} = \\sqrt{\\tfrac{2(0.1\\mathrm{m})}{150\\mu\\times 150}} = 0.094\\,\\mathrm{V}$$', 'M3’s drain is M2’s gate, one $V_{GS2} = 0.7 + 0.094$ above P: $$V_{D3} = 0.094 + 0.794 = 0.889\\,\\mathrm{V}$$', 'The fence for M3, whose gate is P: $$V_{G3} + |V_{thp}| = 0.094 + 0.85 = 0.944\\,\\mathrm{V}$$', '0.889 ≤ 0.944, so M3 is saturated — by only about 56 mV, because $V_{GS2} = 0.794$ V is barely below $|V_{thp}| = 0.85$ V.'],
          why: 'The fence reduces to $V_{GS2} \\le |V_{th3}|$. It is a DC check: λ is not needed.',
        },
        say: '(b) The implementation-2 fence: 0.889 ≤ 0.944, so M3 is just saturated — only because $V_{GS2}$ is barely above threshold.' },
      { t: 25, title: '**(c) The booster’s current.** M4 is the sink under M3; at $V_{ov4} = 0.1$ V it sets the booster current. M3 carries it, so $V_S$ sits one $|V_{GS3}|$ above P.',
        tex: 'I_{D4} = \\tfrac12\\mu_nC_{ox}(W/L)_nV_{ov4}^2 = \\tfrac12(150\\mu)(150)(0.1)^2 = 112.5\\,\\mu\\mathrm{A},\\; |V_{ov3}| = \\sqrt{\\tfrac{2(112.5\\mu)}{100\\mu\\times 100}} = 0.15\\,\\mathrm{V},\\; V_S = V_P + |V_{thp}| + |V_{ov3}| = 0.094 + 0.85 + 0.15 = 1.094\\,\\mathrm{V}', hl: [T([250, 180, 170, 360, C.volt])],
        try: {
          q: '**(c)** M4 (NMOS) runs at $V_{ov4} = 0.1$ V. Before finding $V_S$: what current does M4 set in the booster branch?', answer: 112.5e-6, unit: 'A', tol: 0.02,
          hint: ['M4 is a saturated NMOS: its current follows from its overdrive (square law).', '$I_{D4} = \\tfrac12\\mu_nC_{ox}(W/L)_nV_{ov4}^2$'],
          how: ['M4 is saturated, so the square law gives its current from its overdrive: $$I_{D4} = \\tfrac12\\mu_nC_{ox}(W/L)_nV_{ov4}^2$$', 'Substitute: $$I_{D4} = \\tfrac12(150\\mu)(150)(0.1)^2 = 112.5\\,\\mu\\mathrm{A}$$', 'M3 sits on top of M4 in the same column (P only touches M3’s gate), so M3 carries the same 112.5 µA. That sets $|V_{GS3}|$, and $V_S = V_P + |V_{GS3}|$ follows.'],
          why: 'In a series column the bottom sink decides the current for every device above it.',
        },
        say: '(c) M4 at 0.1 V sets 113 µA; M3’s source $V_S$ sits one $|V_{GS3}|$ above its gate P: 1.094 V.' },
      { t: 34, title: '**(d) Without the booster** it is a plain cascode with an ideal load: gain ≈ $(g_mr_O)^2$. Work back from 2550 to $g_mr_O$, then to $r_O$, then to λ.',
        tex: 'g_m = \\sqrt{2(150\\mu)(150)(0.1\\mathrm{m})} = 2.12\\,\\mathrm{mS},\\; g_mr_O = \\sqrt{2550} = 50.5,\\; r_O = \\tfrac{50.5}{2.12\\mathrm{m}} = 23.8\\,\\mathrm{k\\Omega},\\; \\lambda_n = \\tfrac{1}{r_OI_D} = \\tfrac{1}{23.8\\mathrm{k}\\times 0.1\\mathrm{m}} = 0.42\\,\\mathrm{V^{-1}}',
        try: {
          q: '**(d)** Remove the booster and make M5 an ideal 0.1 mA source. Which $\\lambda_n$ makes the gain about 2550?', answer: ans('bank-t4q2', 'lam'), unit: 'V⁻¹', tol: 0.025,
          parts: [
            { q: '$g_mr_O$ needed for a gain of 2550.', answer: gmro, unit: '', tol: 0.01, hint: ['Gain $≈ (g_mr_O)^2$: take the square root.'], how: ['$$g_mr_O = \\sqrt{2550} = 50.5$$'] },
            { q: '$g_m$ of each NMOS at 0.1 mA.', answer: gmn, unit: 'S', tol: 0.02, hint: ['$g_m = \\sqrt{2\\mu_nC_{ox}(W/L)I_D}$'], how: ['$$g_m = \\sqrt{2(150\\mu)(150)(0.1\\mathrm{m})} = 2.12\\,\\mathrm{mS}$$'] },
            { q: 'So the $r_O$ each device must have.', answer: ron, unit: 'Ω', tol: 0.02, hint: ['$r_O = (g_mr_O)/g_m$'], how: ['$$r_O = \\tfrac{50.5}{2.12\\mathrm{m}} = 23.8\\,\\mathrm{k\\Omega}$$'] },
          ],
          hint: ['A plain cascode with an ideal load has gain $≈ (g_mr_O)^2$. Undo the square first.', '$g_mr_O = \\sqrt{2550},\\; g_m = \\sqrt{2\\mu_nC_{ox}(W/L)I_D},\\; r_O = \\dfrac{1}{\\lambda I_D}$'],
          how: ['Undo the square: $$g_mr_O = \\sqrt{2550} = 50.5$$', 'Each NMOS at 0.1 mA: $$g_m = \\sqrt{2(150\\mu)(150)(0.1\\mathrm{m})} = 2.12\\,\\mathrm{mS}$$', 'So $$r_O = \\tfrac{50.5}{2.12\\mathrm{m}} = 23.8\\,\\mathrm{k\\Omega}$$', 'And from $r_O = 1/(\\lambda I_D)$: $$\\lambda_n = \\tfrac{1}{23.8\\mathrm{k}\\times 0.1\\mathrm{m}} = 0.42\\,\\mathrm{V^{-1}}$$'],
          why: 'Exam form: gain ≈ $(g_mr_O)^2$. The exact $2g_mr_O + (g_mr_O)^2$ gives 0.428; both are accepted.',
          calc: [{ what: 'λ in one line', keys: '1 ÷ ( [√] 2550 ÷ [√] ( 2 × 150µ × 150 × 0.1m ) × 0.1m ) [EXE]', shows: '0.420', note: 'The inner part √2550 ÷ g_m is r_O (23.8k); × I_D then 1 ÷ gives λ.' }],
        },
        say: '(d) Without the booster the gain is about $(g_mr_O)^2 = 2550$, so $g_mr_O = 50.5$ and $\\lambda_n = 0.42$ V⁻¹.' },
      { t: 42, title: '**(e) The load trap again.** With the booster the cascode’s $R_{out}$ is huge, but M5 (now $\\lambda_p = 1.3\\lambda_n$) shows only its own $r_{O5}$, and that small resistance sets the gain.',
        tex: 'r_{O5} = \\tfrac{1}{1.3(0.42)(0.1\\mathrm{m})} = 18.3\\,\\mathrm{k\\Omega},\\; R_{boost} \\gg r_{O5}\\;\\Rightarrow\\; |A_v| ≈ g_m(R_{boost}\\parallel r_{O5}) ≈ 2.12\\mathrm{m}\\times 18.3\\mathrm{k} ≈ 38.8', hl: [T([540, 170, 220, 120, C.bad])],
        say: '(e) The load trap again: M5 is a plain PMOS source, so the gain is about 39, although the boosted cascode alone would give 37 841.' },
      { t: 50, ans: true, title: `**Answers:** $V_{bp} = ${fx(ans('bank-t4q2', 'vbp'), 3)}$ V · M3 saturated (just) · $V_S = ${fx(ans('bank-t4q2', 'vs'), 4)}$ V · $\\lambda_n ≈ 0.42$ V⁻¹ · gain ≈ 39`, say: 'Lesson of (b): a PMOS booster only works if $V_{GS2}$ is squeezed below $|V_{th3}|$ — exactly why your page calls it a bad idea.' },
    ],
  });
  // part (c): the booster column's current, set by M4 (shown only after the stop)
  current(S, [[330, 326], [330, 392], [350, 392], [350, 428], [330, 428], [330, 582], [310, 582], [310, 618], [330, 618], [330, 648]], off + 25, off + 34, 'I_D4 = 112.5 µA', { color: C.p, at: [180, 515] });
}, { q: 'Tutorial 4 Q2' });

scene(L8, 'Tutorial 4 Q1 (a), (c): biases and swing', 70, (S) => {
  const T = tfm(1, 0, 90);
  pyqFrame(S, {
    paper: 't4q1', tag: 'LEC 8 · PAST PAPER 3 OF 3', title: 'Biases and swing of implementation 1', src: 'Tutorial 4 Q1 (a), (c)',
    q: 'Same circuit: $I_1 = 100\\,\\mu$A (M3), $I_2 = 0.5$ mA (output), $(W/L)_{1-3} = 200$. (a) Gates of M3 and M2. (c) Output swing with a PMOS source for $I_2$ ($W/L = 100$).',
    giv: '$V_{DD} = 3$ V, $\\mu_nC_{ox} = 172.35\\,\\mu$A/V², $\\mu_pC_{ox} = 51.7\\,\\mu$A/V², $V_{thn} = 0.7$ V',
    qh: 250, tests: 'the same **two stacked links** (X, then M2’s gate) and the **floor/ceiling** of implementation 1 — part (b) was solved in Lec 7.',
    currents: REG_CUR,
    fig: (S2) => { const c = regCascode(S2, { iout: 'I_2', iaux: 'I_1' }); c.g.setAttribute('transform', 'translate(0 90)'); },
    steps: [
      { t: 7, title: '**(a) Gate of M3 = X.** M3’s source is on ground and it carries $I_1 = 100\\,\\mu$A, so X sits one $V_{GS3}$ up.',
        tex: 'V_X = V_{th} + \\sqrt{\\tfrac{2I_1}{\\mu_nC_{ox}(W/L)}} = 0.7 + \\sqrt{\\tfrac{2(100\\mu)}{172.35\\mu\\times 200}} = 0.7 + 0.0762 = 0.776\\,\\mathrm{V}', hl: [T([250, 470, 170, 140, C.volt])],
        try: {
          q: '**(a)** Find the gate bias of M3 (the voltage at X).', answer: ans('bank-t4q1', 'vx'), unit: 'V', tol: 0.01,
          parts: [{ q: 'First M3’s overdrive $V_{ov3}$ at $I_1 = 100\\,\\mu$A.', answer: Math.sqrt(2 * 100e-6 / (172.35e-6 * 200)), unit: 'V', tol: 0.02, hint: ['$V_{ov} = \\sqrt{\\dfrac{2I_D}{\\mu_nC_{ox}(W/L)}}$'], how: ['$$V_{ov3} = \\sqrt{\\tfrac{2(100\\mu)}{172.35\\mu\\times 200}} = 0.0762\\,\\mathrm{V}$$'] }],
          hint: ['M3’s gate is X and its source is on ground: one link up.', '$V_X = V_{th} + \\sqrt{\\dfrac{2I_1}{\\mu_nC_{ox}(W/L)}}$'],
          how: ['X is M3’s gate and M3’s source is ground: $$V_X = V_{GS3} = V_{th} + V_{ov3}$$', 'M3 carries $I_1 = 100\\,\\mu$A: $$V_{ov3} = \\sqrt{\\tfrac{2(100\\mu)}{172.35\\mu\\times 200}} = 0.0762\\,\\mathrm{V}$$', 'Add the threshold: $$V_X = 0.7 + 0.0762 = 0.776\\,\\mathrm{V}$$'],
          why: 'Same move as the 2025 mid-sem: a gate whose device sits on ground is one $V_{GS}$ up.',
        },
        say: 'Gate of M3 = X = $V_{GS3}$ = 0.776 V.' },
      { t: 15, title: '**(a) Gate of M2.** M2’s source is X and it carries the output current $I_2 = 0.5$ mA, so its gate is one $V_{GS2}$ above X.',
        tex: 'V_{ov2} = \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{172.35\\mu\\times 200}} = 0.170\\,\\mathrm{V},\\; V_{G2} = V_X + V_{th} + V_{ov2} = 0.776 + 0.7 + 0.170 = 1.646\\,\\mathrm{V}', hl: [T([470, 330, 190, 100, C.volt])],
        try: {
          q: '**(a)** Using $V_X$ from the step above, find the gate bias of M2.', answer: ans('bank-t4q1', 'vg2'), unit: 'V', tol: 0.01,
          parts: [{ q: 'First M2’s overdrive $V_{ov2}$ at $I_2 = 0.5$ mA.', answer: Math.sqrt(2 * 0.5e-3 / (172.35e-6 * 200)), unit: 'V', tol: 0.02, hint: ['M2 is in series with M1, so it carries $I_2$. $V_{ov} = \\sqrt{2I_D/(\\mu_nC_{ox}(W/L))}$'], how: ['$$V_{ov2} = \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{172.35\\mu\\times 200}} = 0.170\\,\\mathrm{V}$$'] }],
          hint: ['M2’s gate is one $V_{GS2}$ above its source X, and M2 carries the output current $I_2$.', '$V_{G2} = V_X + V_{th} + \\sqrt{\\dfrac{2I_2}{\\mu_nC_{ox}(W/L)}}$'],
          how: ['M2’s source is X, so its gate is one link higher: $$V_{G2} = V_X + V_{GS2}$$', 'M2 is in series with M1, so it carries $I_2 = 0.5$ mA: $$V_{ov2} = \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{172.35\\mu\\times 200}} = 0.170\\,\\mathrm{V}$$', 'Stack them: $$V_{G2} = 0.776 + 0.7 + 0.170 = 1.646\\,\\mathrm{V}$$'],
          why: '$V_{G2} = V_{GS3} + V_{GS2}$: two links stacked from ground.',
          calc: [{ what: 'V_G2, reusing the stored V_X', keys: '[SHIFT] [4] + 0.7 + [√] ( 2 × 0.5m ÷ ( 172.35µ × 200 ) ) [EXE]', shows: '1.646', note: 'First store V_X from part (a): [VARIABLE] ▸ A ▸ Store; [SHIFT] [4] types A.' }],
        },
        say: 'Gate of M2 = X + $V_{GS2}$ = 1.646 V.' },
      { t: 23, title: '**(c) Floor.** M2 must stay saturated: its drain (the output) may not drop more than $V_{th}$ below its gate.',
        tex: 'V_{out,min} = V_{G2} - V_{th} = 1.646 - 0.7 = 0.946\\,\\mathrm{V}\\;(= V_X + V_{ov2})', hl: [T([470, 330, 190, 160, C.bad])],
        try: {
          q: '**(c)** Using $V_{G2}$ from part (a), what is the lowest output voltage that keeps M2 saturated?', answer: ans('bank-t4q1', 'vmin'), unit: 'V', tol: 0.01,
          hint: ['The floor is M2’s saturation fence: its drain is the output.', 'NMOS saturated while $V_D \\ge V_G - V_{th}$, so $V_{out,min} = V_{G2} - V_{th}$.'],
          how: ['M2’s drain is the output and its gate is at $V_{G2}$. NMOS fence: $$V_{out} \\ge V_{G2} - V_{th}$$', 'With $V_{G2}$ from (a): $$V_{out,min} = 1.646 - 0.7 = 0.946\\,\\mathrm{V}$$', 'Check: it equals $V_X + V_{ov2} = 0.776 + 0.170$, X plus M2’s own overdrive.'],
          why: 'Two ways to the same floor: $V_{G2} - V_{th}$ or $V_X + V_{ov2}$.',
        },
        say: 'Floor from M2’s fence: $V_{out} \\ge V_{G2} - V_{th} = 0.946$ V — the same as $V_{GS3} + V_{ov2}$.' },
      { t: 31, title: '**(c) Ceiling.** The PMOS source on top must keep its $|V_{ov}|$ between $V_{DD}$ and the output. Swing = ceiling − floor.',
        tex: '|V_{ov}| = \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{51.7\\mu\\times 100}} = 0.440\\,\\mathrm{V},\\; V_{out,max} = 3 - 0.440 = 2.56\\,\\mathrm{V},\\; \\text{swing} = 2.56 - 0.946 = 1.61\\,\\mathrm{V}', hl: [T([470, 170, 190, 110, C.p])],
        try: {
          q: '**(c)** The output current source is a PMOS ($W/L = 100$) carrying 0.5 mA from $V_{DD} = 3$ V. What is the highest output voltage?', answer: ans('bank-t4q1', 'vmax'), unit: 'V', tol: 0.01,
          parts: [{ q: 'First the PMOS source’s overdrive $|V_{ov}|$ at 0.5 mA.', answer: Math.sqrt(2 * 0.5e-3 / (51.7e-6 * 100)), unit: 'V', tol: 0.02, hint: ['$|V_{ov}| = \\sqrt{\\dfrac{2I_D}{\\mu_pC_{ox}(W/L)_p}}$'], how: ['$$|V_{ov}| = \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{51.7\\mu\\times 100}} = 0.440\\,\\mathrm{V}$$'] }],
          hint: ['The PMOS source stays saturated while its drain is at least $|V_{ov}|$ below $V_{DD}$.', '$V_{out,max} = V_{DD} - \\sqrt{\\dfrac{2I_2}{\\mu_pC_{ox}(W/L)_p}}$'],
          how: ['The top PMOS needs $|V_{SD}| \\ge |V_{ov}|$: $$V_{out,max} = V_{DD} - |V_{ov}|$$', 'Its overdrive at 0.5 mA with $\\mu_pC_{ox} = 51.7\\,\\mu$A/V²: $$|V_{ov}| = \\sqrt{\\tfrac{2(0.5\\mathrm{m})}{51.7\\mu\\times 100}} = 0.440\\,\\mathrm{V}$$', 'Subtract from the supply: $$V_{out,max} = 3 - 0.440 = 2.56\\,\\mathrm{V}$$'],
          why: 'Swing = 2.56 − 0.946 ≈ 1.61 V. The ceiling uses only $|V_{ov}|$; no threshold appears.',
        },
        say: 'Ceiling: $3 - |V_{ov}| = 2.56$ V. Swing ≈ 1.61 V.' },
      { t: 39, ans: true, title: `**Answers:** $V_{G3} = ${fx(ans('bank-t4q1', 'vx'), 4)}$ V · $V_{G2} = ${fx(ans('bank-t4q1', 'vg2'), 4)}$ V · $V_{out} \\in [${fx(ans('bank-t4q1', 'vmin'), 3)},\\,${fx(ans('bank-t4q1', 'vmax'), 3)}]$ V`, say: 'Two equivalent ways to write the floor: X + $V_{ov2}$, or M2’s gate minus $V_{th}$. Use whichever is quicker with the given numbers.' },
    ],
  });
}, { q: 'Tutorial 4 Q1' });
