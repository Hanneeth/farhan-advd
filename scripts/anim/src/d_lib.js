/* Lesson D (Lec 15–17) helpers: loop-gain maths, a magnitude + phase Bode pair, moving arrows, your-page peeks. */
'use strict';

const DEG = 180 / Math.PI;
const dB = (x) => 20 * Math.log10(x);
/* loop gain with LHP poles and RHP zeros (an RHP zero lifts the size like a zero but lags like a pole) */
const LG = {
  mag(f, k, poles, rz = []) { let m = k; poles.forEach((p) => { m /= Math.hypot(1, f / p); }); rz.forEach((z) => { m *= Math.hypot(1, f / z); }); return m; },
  ph(f, poles, rz = []) { let a = 0; poles.forEach((p) => { a -= Math.atan(f / p); }); rz.forEach((z) => { a -= Math.atan(f / z); }); return a * DEG; },
  /* frequency where |loop| = 1 (log bisection) */
  gx(k, poles, rz = []) { let lo = -6, hi = 14; for (let i = 0; i < 90; i++) { const m = (lo + hi) / 2; if (LG.mag(10 ** m, k, poles, rz) > 1) lo = m; else hi = m; } return 10 ** ((lo + hi) / 2); },
  /* frequency where the phase reaches −180° (Infinity if never) */
  px(poles, rz = []) { if (poles.length + rz.length < 3) return Infinity; let lo = -6, hi = 14; for (let i = 0; i < 90; i++) { const m = (lo + hi) / 2; if (LG.ph(10 ** m, poles, rz) > -180) lo = m; else hi = m; } return 10 ** ((lo + hi) / 2); },
  pm(k, poles, rz = []) { return 180 + LG.ph(LG.gx(k, poles, rz), poles, rz); },
};
/* closed-loop step of the loop L(s) = ωu/(s(1 + s/p2)) with β = 1, set by its phase margin (time in units of 1/ωu) */
function stepPM(pm) {
  if (pm >= 89.9) return (t) => 1 - Math.exp(-t); // the second pole has gone to infinity: one pole
  const p2 = 1 / Math.tan((90 - pm) / DEG), wn = Math.sqrt(p2), z = p2 / (2 * wn);
  return (t) => {
    if (z < 1 - 1e-6) { const wd = wn * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * wn * t) * (Math.cos(wd * t) + (z / Math.sqrt(1 - z * z)) * Math.sin(wd * t)); }
    if (z < 1 + 1e-6) return 1 - (1 + wn * t) * Math.exp(-wn * t);
    const r1 = -wn * (z - Math.sqrt(z * z - 1)), r2 = -wn * (z + Math.sqrt(z * z - 1));
    return 1 + (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r1 - r2);
  };
}
const peakK = (pm) => 1 / (2 * Math.sin(pm / 2 / DEG));

/* a magnitude plot over a phase plot sharing one log-frequency axis. f in Hz from 10^d0 to 10^d1 */
function bodePair(S, o) {
  const x0 = o.x || 120, w = o.w || 700, y0 = o.y || 150, hm = o.hm || 300, hp = o.hp || 230, gap = o.gap || 62;
  const M = bodeFrame(S, x0, y0, w, hm, o.d0, o.d1, o.db0, o.db1, { dbStep: o.dbStep || 20, title: o.mtitle || '20 log|βA|' });
  const P = bodeFrame(S, x0, y0 + hm + gap, w, hp, o.d0, o.d1, 0, o.ph1 || -270, { dbStep: 45, unit: 'deg', title: o.ptitle || '∠βA' });
  const fxp = M.fxp, fyM = (v) => clamp(M.fy(v), y0, y0 + hm), fyP = (v) => clamp(P.fy(v), y0 + hm + gap, y0 + hm + gap + hp);
  const g = S.g(); g.appendChild(M.g); g.appendChild(P.g);
  return { g, fxp, fyM, fyP, x0, w, y0, hm, hp, yP: y0 + hm + gap, d0: o.d0, d1: o.d1 };
}
/* polyline points for a curve over the plot's frequency range */
/* points stop where the curve leaves the plot (no fake flat line along the edge) */
const bodePts = (B, fn, yfn, n = 220) => {
  const out = []; let prevOut = false;
  for (let i = 0; i <= n; i++) {
    const e = B.d0 + ((B.d1 - B.d0) * i) / n, v = fn(10 ** e), y = yfn(v), top = yfn === B.fyM ? B.y0 : B.yP, bot = top + (yfn === B.fyM ? B.hm : B.hp);
    const edge = y <= top + 0.01 || y >= bot - 0.01;
    if (edge && prevOut) continue;
    prevOut = edge;
    out.push(`${B.fxp(10 ** e).toFixed(1)},${y.toFixed(1)}`);
  }
  return out.join(' ');
};

/* your handwritten page, shown on a paper card while the redraw builds next to it */
function pagePeek(S, key, x, y, w, h, t0, t1, label = 'your page') {
  const g = S.g();
  S.el('rect', { x: x - 6, y: y - 6, width: w + 12, height: h + 12, rx: 14, fill: '#f8f6f1', stroke: '#d9d2c3', 'stroke-width': 2 }, g);
  if (PAPERS[key]) S.el('image', { href: PAPERS[key], x, y, width: w, height: h, preserveAspectRatio: 'xMidYMid meet' }, g);
  const c = chip(S, x + w - 70, y - 4, label, { color: C.amb, size: 16 }, g);
  g.style.opacity = 0;
  S.fade(g, t0, 0.7);
  if (t1) S.out(g, t1, 0.6);
  return g;
}

/* the page's two-stage op amp (M1–M7, Cc between P and Q). o.rz draws a nulling resistor. Returns node handles. */
function twoStageFig(S, o = {}) {
  const g = S.g(); const r = S.into(g);
  const X = o.x || 0, Y = o.y || 0, sc = o.sc || 1;
  g.setAttribute('transform', `translate(${X} ${Y}) scale(${sc})`);
  rail(S, 140, 760, 170);
  const m3 = pmos(S, 220, 240, { name: 'M3', right: true, gl: 30, nameSide: 'l' }); const m4 = pmos(S, 420, 240, { name: 'M4', gl: 30 });
  wire(S, [[220, 170], [220, 190]]); wire(S, [[420, 170], [420, 190]]);
  wire(S, [[m3.gate[0], 240], [m4.gate[0], 240]]); wire(S, [[220, 290], [220, 310], [280, 310], [280, 240]]); dot(S, 280, 240); dot(S, 220, 310);
  wire(S, [[220, 290], [220, 360]]); wire(S, [[420, 290], [420, 360]]);
  dot(S, 420, 320); txt(S, 432, 344, 'P', { size: 22, color: C.bad, weight: 800 });
  nmos(S, 220, 410, { name: 'M1', gate: 'V_in1', gl: 30 }); nmos(S, 420, 410, { name: 'M2', gate: 'V_in2', right: true, nameSide: 'l', gl: 30 });
  wire(S, [[220, 460], [220, 480], [420, 480], [420, 460]]); dot(S, 320, 480);
  nmos(S, 320, 530, { name: 'M5', gate: 'V_b', gl: 40 }); gnd(S, 320, 580);
  // second stage
  const m6 = pmos(S, 640, 250, { name: 'M6', gl: 30 }); wire(S, [[640, 170], [640, 200]]);
  wire(S, [[420, 320], [560, 320], [560, 250], [m6.gate[0], 250]]);
  wire(S, [[640, 300], [640, 480]]); dot(S, 640, 380); txt(S, 652, 372, 'Q', { size: 22, color: C.bad, weight: 800 });
  wire(S, [[640, 380], [740, 380]]); txt(S, 748, 387, 'V_out', { size: 20, color: C.volt, weight: 700 });
  nmos(S, 640, 530, { name: 'M7', gate: 'V_b', gl: 40 }); gnd(S, 640, 580);
  // Cc from P to Q
  const cx = 540;
  if (o.rz) { resh(S, 470, 520, 380, { label: 'R_z', lsize: 18 }); wire(S, [[420, 320], [450, 320], [450, 380], [470, 380]]); wire(S, [[520, 380], [cx - 6, 380]]); }
  else wire(S, [[420, 320], [450, 320], [450, 380], [cx - 6, 380]]);
  S.el('line', { x1: cx - 6, y1: 362, x2: cx - 6, y2: 398, stroke: C.amb, 'stroke-width': 3.6 }); S.el('line', { x1: cx + 6, y1: 362, x2: cx + 6, y2: 398, stroke: C.amb, 'stroke-width': 3.6 });
  wire(S, [[cx + 6, 380], [640, 380]]); txt(S, cx, 352, 'C_c', { size: 20, color: C.amb, weight: 700, anchor: 'middle' });
  if (o.caps !== false) {
    // C1 (the capacitance at P) as a label; C2 = CL as a real capacitor at the output
    txt(S, 404, 344, 'C_1', { size: 17, color: C.bad, weight: 700, anchor: 'end' });
    cap(S, 712, 380); txt(S, 736, 418, 'C_L', { size: 18, color: C.bad, weight: 700 });
  }
  r();
  return { g, P: [X + 420 * sc, Y + 320 * sc], Q: [X + 640 * sc, Y + 380 * sc], CC: [X + cx * sc, Y + 380 * sc], M6: [X + 640 * sc, Y + 250 * sc], M5: [X + 320 * sc, Y + 530 * sc], M7: [X + 640 * sc, Y + 530 * sc] };
}

