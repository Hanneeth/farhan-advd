/* Shared layouts: the past-paper solver frame, remember cards, why boxes. */
'use strict';

/* numbers from the engine-verified bank (scripts/anim/problems.json) */
const PQ = (id) => PROBLEMS[id];
const ans = (id, k) => PROBLEMS[id].answers[k];
const fx = (v, d = 3) => (+v.toPrecision(d)).toString();
const tfm = (s, dx, dy) => (r) => [r[0] * s + dx, r[1] * s + dy, r[2] * s, r[3] * s, r[4]];
const stepTex = (id, i) => PQ(id).steps[i].tex;

/* Past-paper frame. Phase 1 (o.paper): the question exactly as printed, full screen. Phase 2: redrawn circuit on the
   left (fig(S)), a short question card top-right, and the solution steps below it. Each step may carry
   try: {...} — the lesson stops BEFORE that step so you solve it first — and hl boxes that glow on the circuit.
   All step times are relative to the start of phase 2; the function returns that offset. */
function pyqFrame(S, o) {
  header(S, o.tag || 'PAST PAPER', o.title);
  const off = o.paper && PAPERS[o.paper] ? (o.intro || 9) : 0;
  if (off) {
    const ph = S.g();
    S.el('rect', { x: 60, y: 108, width: 1480, height: 770, rx: 16, fill: '#f7f5f0' }, ph);
    const img = S.el('image', { href: PAPERS[o.paper], x: 80, y: 122, width: 1440, height: 742, preserveAspectRatio: 'xMidYMid meet' }, ph);
    ph.style.opacity = 0;
    S.fade(ph, 0.2, 0.7);
    S.out(ph, off - 0.8, 0.7);
    const tg = chip(S, 1420, 96, 'as printed', { color: C.amb, size: 18 }); tg.style.opacity = 0; S.fade(tg, 0.4, 0.5); S.out(tg, off - 0.8, 0.5);
    S.say(0.3, `<b>${o.src}</b>, exactly as printed. Read it once — the lesson will make you solve every part before explaining it.`);
  }
  const pane = S.g();
  S.el('rect', { x: 36, y: 118, width: 880, height: 740, rx: 18, fill: 'rgba(255,255,255,0.015)', stroke: '#1d2633' }, pane);
  pane.style.opacity = 0; S.fade(pane, off + 0.1, 0.6);
  const fig = S.g();
  const restore = S.into(fig);
  const handles = o.fig(S) || {};
  // branch currents on the redrawn circuit (o.currents = { tf, list: [[pts, label, opts]] }, in the figure's own coordinates):
  // symbolic labels only (I_SS/2, I …), so they show the paths without giving numeric answers away
  if (o.currents) {
    const cg = S.g({ transform: o.currents.tf || null }); const rc = S.into(cg);
    o.currents.list.forEach(([pts, label, op]) => current(S, pts, off + 1.4, null, label, { size: 19, ...(op || {}) }));
    rc();
  }
  restore();
  fig.style.opacity = 0;
  S.fade(fig, off + 0.3, 0.8);
  const qInner = `<div class="qcard"><div class="src">${o.src}</div>${rt(o.q)}${o.giv ? `<div class="giv">${rt(o.giv)}</div>` : ''}</div>`;
  const qh = Math.min(430, Math.max(o.qh || 0, Math.ceil(measureHTML(qInner.replace('class="qcard"', 'class="qcard" style="height:auto"'), 620)) + 4));
  const card = html(S, 944, 118, 620, qh, qInner);
  card.style.opacity = 0;
  S.slideIn(card, off + 0.4, 0.8, 30, 0);
  const top = 118 + qh + 16, room = 862 - top, GAP = 12;
  if (o.tests) {
    const t1 = o.steps[0].t + off;
    const tb = html(S, 944, top, 620, room, `<div class="whybox"><b>What this question tests</b><br>${rt(o.tests)}</div>`);
    tb.style.opacity = 0; S.slideIn(tb, off + 1.2, 0.7); S.out(tb, t1 - 0.6, 0.5);
    S.say(off + 1.2, '<span class="why">What it tests:</span> ' + o.tests);
  }
  // each step: a numbered card, the reasoning in words, then the working one line per step; pages fill by height
  const inners = o.steps.map((st, i) => (st.ans ? `<div class="ans"><div class="t">${rt(st.title)}</div>${st.tex ? texBlock(st.tex) : ''}</div>`
    : `<div class="step"><div class="n">${i + 1}</div><div class="t">${rt(st.title)}</div>${st.tex ? `<div class="e">${texBlock(st.tex)}</div>` : ''}</div>`));
  const hs = inners.map((h) => Math.ceil(measureHTML(h, 620)) + 2);
  // a card taller than the whole column is scaled down to fit instead of being cut off
  hs.forEach((h, i) => {
    if (h <= room) return;
    const z = Math.max(0.5, (room - 4) / h);
    inners[i] = `<div style="zoom:${z.toFixed(3)}">${inners[i]}</div>`;
    hs[i] = Math.ceil(measureHTML(inners[i], 620)) + 2;
  });
  const page = [], ys = [];
  let pg = 0, y0 = top;
  hs.forEach((h, i) => { if (i > 0 && y0 + h > top + room) { pg++; y0 = top; } page.push(pg); ys.push(y0); y0 += h + GAP; });
  o.steps.forEach((st, i) => {
    const y = ys[i];
    const T0 = off + st.t;
    const fo = html(S, 944, y, 620, Math.min(hs[i], room), inners[i]);
    fo.style.opacity = 0;
    S.slideIn(fo, T0, 0.7, 0, 18);
    const nextPage = page.findIndex((p, j) => j > i && p > page[i]);
    // the next step marked fresh: '<caption>' hides this card (and the old caption) before its stop, when this card's
    // result would give the next answer away (e.g. SR+ = SR− by symmetry); otherwise cards leave when their page turns
    const fr = o.steps[i + 1] && o.steps[i + 1].fresh ? i + 1 : -1;
    if (fr > 0) S.out(fo, off + o.steps[fr].t - 1.2, 0.4);
    else if (nextPage > 0) S.out(fo, off + o.steps[nextPage].t - 0.6, 0.5);
    if (st.say) S.say(T0, st.say);
    if (st.fresh) S.say(T0 - 1.1, st.fresh);
    if (st.try) S.stop(T0 - 0.4, { src: o.src, top, ...st.try });
    (st.hl || []).forEach(([x, y2, w, h, col]) => {
      const tEnd = off + (o.steps[i + 1] ? o.steps[i + 1].t : st.t + 6);
      const r = S.el('rect', { x, y: y2, width: w, height: h, rx: 14, fill: 'none', stroke: col || C.amb, 'stroke-width': 3, filter: 'url(#glow)' });
      r.style.opacity = 0;
      S.fade(r, T0, 0.5);
      S.anim(tEnd, 0.4, r.id + ':o', (p) => { r.style.opacity = 1 - p; });
    });
  });
  if (off && !o.noSay) S.say(off + 0.3, o.lead || 'The circuit, redrawn. Try each part when the lesson stops — then watch how it is done.');
  return off;
}

/* big "remember" card */
function remember(S, items, t0 = 0.5, title = 'Remember') {
  const body = `<div class="rem"><h3>${title}</h3><ul>${items.map((i) => `<li>${rt(i)}</li>`).join('')}</ul></div>`;
  const fo = html(S, 170, 130, 1260, 700, body);
  S.slideIn(fo, t0, 0.9, 0, 30);
  return fo;
}
function whyBox(S, x, y, w, h, s, t0, t1) {
  const fo = html(S, x, y, w, h, `<div class="whybox">${rt(s)}</div>`);
  fo.style.opacity = 0;
  S.slideIn(fo, t0, 0.7, 0, 14);
  if (t1) S.out(fo, t1, 0.5);
  return fo;
}
function eqAt(S, tex, x, y, t0, o = {}) {
  const e = eq(S, tex, x, y, o);
  e.style.opacity = 0;
  S.slideIn(e, t0, 0.7, 0, 16);
  if (o.out) S.out(e, o.out, 0.5);
  return e;
}
function label(S, x, y, s, t0, o = {}) {
  const t = txt(S, x, y, s, o);
  t.style.opacity = 0;
  S.fade(t, t0, 0.5);
  if (o.out) S.out(t, o.out, 0.4);
  return t;
}
function glowBox(S, x, y, w, h, col, t0, t1) {
  const r = S.el('rect', { x, y, width: w, height: h, rx: 14, fill: 'none', stroke: col, 'stroke-width': 3, filter: 'url(#glow)' });
  r.style.opacity = 0;
  S.fade(r, t0, 0.5);
  if (t1) S.out(r, t1, 0.4);
  return r;
}
/* title card at the start of a lecture */
function titleCard(S, num, title, sub, items) {
  const g = S.g();
  txt(S, 800, 300, num, { size: 26, color: C.cur, weight: 800, anchor: 'middle' }, g).setAttribute('letter-spacing', '6');
  txt(S, 800, 380, title, { size: 64, color: '#f5f7fa', weight: 800, anchor: 'middle' }, g);
  txt(S, 800, 432, sub, { size: 26, color: C.muted, anchor: 'middle' }, g);
  S.fade(g, 0.2, 1.0);
  items.forEach((s, i) => {
    const c = chip(S, 800 + (i - (items.length - 1) / 2) * 290, 540, s, { size: 20, color: [C.n, C.p, C.amb, C.cur, C.volt, C.ok][i % 6] });
    c.style.opacity = 0;
    S.pop(c, 1.6 + i * 0.35);
  });
}

/* ── formula sheet and flashcards (shown under the player) ── */
var FORMULAS = [
  ['Lec 7 · two stages and the boosting idea', [
    ['Two-stage gain', 'A = A_1 \\times A_2'],
    ['Simple stage 1 / stage 2', 'A_1 = g_{m1,2}(r_{O1,2}\\parallel r_{O3,4}),\\; A_2 = g_{m5,6}(r_{O5,6}\\parallel r_{O7,8})'],
    ['Telescopic stage 1', 'A_1 = g_{m1}[g_{m5}r_{O5}r_{O7}\\parallel g_{m3}r_{O3}r_{O1}]'],
    ['PMOS CS stage 2', 'A_2 = g_{m9}(r_{O9}\\parallel r_{O11})'],
    ['Level between stages (a link)', 'V_X = V_{DD} - |V_{GS9}|'],
    ['Every gain', 'A_v = G_m \\times R_{out}'],
    ['Degenerated device', 'R_{out} = R_S + r_O + g_mR_Sr_O'],
    ['Boosted (amp watches the source)', 'R_{out} = R_S + r_O + (1 + A_1)g_mR_Sr_O'],
  ]],
  ['Lec 8 · gain boosting in depth', [
    ['G_m with the amp sensing the source', '\\frac{I_{out}}{V_{in}} \\approx \\frac{A_1g_m}{R_S + (1+A_1)g_mr_OR_S} \\approx \\frac{1}{R_S}'],
    ['Into a boosted source', 'R_{in} = \\frac{R_D + r_O}{1 + (1+A_1)g_mr_O}'],
    ['Boosted cascode', 'R_{out} \\approx (1+A_1)g_{m2}r_{O2}r_{O1},\\; G_m \\approx g_{m1}'],
    ['Gain', 'A_v \\approx g_{m1}(1+A_1)g_{m2}r_{O2}r_{O1} \\approx (g_mr_O)^3'],
    ['CS booster', 'A_1 = g_{m3}r_{O3},\\; V_{out,min} = V_{GS3} + V_{ov2}'],
    ['PMOS booster fails', 'V_{GS2} \\le |V_{th3}|'],
    ['Folded booster', 'A_1 = g_{m3}\\,g_{m4}r_{O4}r_{O3}'],
  ]],
  ['Lec 9 · boosters and why CMFB', [
    ['Booster gain', 'A_{aux} = G_{m,aux}R_{out,aux}'],
    ['Full boosted gain', 'A_v = g_{m1}[1 + g_{m3}g_{m4}r_{O4}r_{O3}]g_{m2}r_{O2}r_{O1}'],
    ['Differential booster headroom', 'V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}'],
    ['Folded-cascode booster', 'A_{aux} = g_{m5}[g_{m11}r_{O11}r_{O13}\\parallel g_{m7}r_{O7}(r_{O9}\\parallel r_{O5})]'],
    ['Output CM drift', '\\Delta V_{out,CM} = (I_P - I_N)(R_P\\parallel R_N)'],
  ]],
  ['Lec 10 · CMFB structure and sensing', [
    ['CM and DM', 'V_{CM} = \\frac{V_1 + V_2}{2},\\; v_d = V_1 - V_2'],
    ['Resistive sensing', 'V_{out,CM} = V_{out1}\\frac{R_2}{R_1+R_2} + V_{out2}\\frac{R_1}{R_1+R_2} = \\frac{V_{out1}+V_{out2}}{2}'],
    ['Gain with sensing resistors', 'A_v = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R_1)'],
    ['Follower sensing', 'V_{sense} = \\frac{V_{out1}+V_{out2}}{2} - V_{GS5,6}'],
    ['CM gain allowed by ±x %', '|A_{CM}| = \\frac{2x\\,V_{O,CM}}{\\Delta V_{in,CM}}'],
  ]],
  ['Lec 11–12 · triode sensing and replica', [
    ['Deep triode', 'R_{on} = \\frac{1}{\\mu_nC_{ox}\\frac{W}{L}(V_{GS}-V_{th})}'],
    ['Triode pair', 'R_{tot} = \\frac{1}{\\mu_nC_{ox}\\frac{W}{L}(V_{out1}+V_{out2}-2V_{th})}'],
    ['Pinned output CM', 'V_{out1}+V_{out2} = \\frac{2I_D}{\\mu_nC_{ox}(W/L)}\\cdot\\frac{1}{V_{b1}-V_{GS3}} + 2V_{th}'],
    ['Replica sizes', '(W/L)_{14} = (W/L)_{11},\\; (W/L)_{15} = (W/L)_{12} + (W/L)_{13}'],
    ['Copy-error fix', '(W/L)_{17} = (W/L)_1,\\; (W/L)_{18} = (W/L)_2'],
    ['Feedback error', '\\varepsilon \\approx \\frac{1}{\\beta A}'],
  ]],
];
var CARDS = [
  ['Why two stages?', 'Stage 1 (cascode) gives gain, stage 2 (CS, two devices per column) gives swing. Gains multiply.'],
  ['Why gain first, swing second?', 'Only the final output must swing far; stage 1 moves by $V_{out}/A_2$, so it can afford a tall stack.'],
  ['What sets the DC level at X in a two-stage op amp?', 'Stage 2’s device: X is M9’s gate, so $X = V_{DD} - |V_{GS9}|$ (a link).'],
  ['Price of two stages?', 'Two high-R nodes → two poles → phase heads to −180°: needs compensation.'],
  ['Why not boost $G_m$?', 'With the amp sensing the source, $A_1$ cancels and $G_m \\approx 1/R_S$.'],
  ['Boosted $R_{out}$?', '$R_S + r_O + (1+A_1)g_mR_Sr_O$: the gate is pulled the opposite way, so $V_{GS}$ changes $(1+A_1)$× more.'],
  ['Boosted cascode gain?', '$g_{m1}(1+A_1)g_{m2}r_{O2}r_{O1} \\approx (g_mr_O)^3$ with a CS booster.'],
  ['Cost of the CS booster?', 'X sits at $V_{GS3}$ (a link), not $V_{ov1}$: $V_{out,min} = V_{GS3} + V_{ov2}$.'],
  ['Why does the PMOS booster fail?', 'Its fence needs $V_{GS2} \\le |V_{th3}|$: M2 barely on.'],
  ['Which input pair boosts the NMOS cascodes?', 'PMOS input (folded): the NMOS cascode sources sit low, and a PMOS input works near ground.'],
  ['Why does a fully differential amp need CMFB?', 'Each output sits between two current sources; any mismatch × huge R drives the CM to a rail.'],
  ['Three blocks of CMFB?', 'Sense the output CM → compare with $V_{REF}$ (CMFB amp) → correct a current source.'],
  ['Problem with resistive sensing?', '$R$ appears in parallel with the output: $A_v = g_{m1}(r_{O1}\\parallel r_{O3}\\parallel R)$.'],
  ['Follower sensing shifts the level by?', 'One $V_{GS}$: $V_{sense} = V_{out,CM} - V_{GS}$.'],
  ['Why do triode sensors see only the CM?', 'Parallel conductances add: only $V_{out1}+V_{out2}$ appears.'],
  ['Replica CMFB rule?', 'M14 = M11, M15 = M12 + M13 with $V_{REF}$ on its gate: balanced only when $V_{out,CM} = V_{REF}$.'],
];

/* a stack of equations as the redraw panel of a question frame */
const eqFig = (lines) => (S2) => { const g = S2.g(); const r = S2.into(g); lines.forEach(([tex, y, sz, col]) => eq(S2, tex, 470, y, { size: sz || 28, w: 860, color: col })); r(); };
/* move scenes (by title) to just before another scene, keeping chapters and indices in step */
function moveScenesBefore(titles, before) {
  const mv = titles.map((t) => SCENES.find((s) => s.title === t)).filter(Boolean);
  const anchor = SCENES.find((s) => s.title === before);
  if (!anchor || !mv.length) return;
  mv.forEach((s) => SCENES.splice(SCENES.indexOf(s), 1));
  SCENES.splice(SCENES.indexOf(anchor), 0, ...mv);
  SCENES.forEach((s, i) => { s.index = i; });
  CHAPTERS.forEach((c) => { c.scenes = SCENES.filter((s) => s.ch === c.name); });
}

/* the printed circuit in the redraw panel (left of the question frame), with a few key equations under it */
const paperFig = (key, eqs = [], h = 380) => (S2) => {
  const g = S2.g(); const r = S2.into(g);
  S2.el('rect', { x: 60, y: 140, width: 820, height: h, rx: 12, fill: '#f8f6f1' });
  if (PAPERS[key]) S2.el('image', { href: PAPERS[key], x: 72, y: 150, width: 796, height: h - 20, preserveAspectRatio: 'xMidYMid meet' });
  eqs.forEach(([tex, y, sz, col]) => eq(S2, tex, 470, y, { size: sz || 26, w: 860, color: col }));
  r();
};
