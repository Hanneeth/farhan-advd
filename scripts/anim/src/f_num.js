/* Lesson F (Lec 18–22) numbers. Pure functions only: every number the lesson shows or checks comes from here, and
   checks/f_num.mjs tests them against the answer keys (Tutorial 7 Q2, Q3 key; inverter tutorial Q4 key). */
'use strict';

const FN = (() => {
  const RAD = 180 / Math.PI;
  const atanDeg = (x) => Math.atan(x) * RAD;

  /* phase margin of a Miller two-stage at ω = GB: the dominant pole takes ~90°, then p2 and the RHP zero */
  function pm2(gb, p2, z = Infinity) { return 180 - 90 - atanDeg(gb / p2) - (isFinite(z) ? atanDeg(gb / z) : 0); }

  /* Lec 18: the PM = 60° rules. Zero at k·GB uses tan⁻¹(1/k); what is left for p2 sets ωp2/GB. */
  function pmRules(pm = 60, k = 10) {
    const zDeg = atanDeg(1 / k), left = 180 - pm - 90 - zDeg, ratio = 1 / Math.tan(left / RAD);
    return { zDeg, left, x: Math.tan(left / RAD), ratio, ccOverCl: ratio / k };
  }

  /* Lec 18: poles, zero and GB of the small-signal model (rad/s) */
  function poles({ gm1, gm2, r1, r2, c1, c2, cc }) {
    const a1 = gm1 * r1, a2 = gm2 * r2, a0 = a1 * a2;
    const wp1 = 1 / (gm2 * r2 * r1 * cc), wp2 = (gm2 * cc) / ((c1 + c2) * cc + c1 * c2), wp2a = gm2 / (c1 + c2);
    const gb = gm1 / cc, wz = gm2 / cc;
    return { a1, a2, a0, wp1, wp2, wp2a, gb, wz, gbCheck: a0 * wp1, pm: pm2(gb, wp2, wz) };
  }

  /* Lec 19 design procedure (Allen–Holberg, as in the lecture and the 2025 mid-sem key). Names follow the LECTURE:
     M1, M2 input · M3, M4 mirror · M5 tail · M6 second-stage PMOS · M7 sink. Tutorial 7 calls them M7 (PMOS) and M8 (sink).
     s: { vdd, gbw (Hz), sr (V/s), icmrP, icmrM, cl, pdMax, kn, kp, vt1max, vt1min, vt3max (magnitude), ccRatio, zk, wl3 (optional override) } */
  function design(s) {
    const ccRatio = s.ccRatio ?? 0.22, zk = s.zk ?? 10;
    const cc = ccRatio * s.cl;
    const i5 = s.sr * cc, id1 = i5 / 2;
    const gm1 = 2 * Math.PI * s.gbw * cc;
    const wl1 = (gm1 * gm1) / (2 * s.kn * id1);
    const vgs3room = s.vdd - s.icmrP - s.vt3max + s.vt1min; // |V_ov3| allowed by ICMR+ (worst case)
    const wl3min = (2 * id1) / (s.kp * vgs3room * vgs3room);
    const wl3 = s.wl3 ?? wl3min;
    const vov1 = Math.sqrt((2 * id1) / (s.kn * wl1));
    const vds5 = s.icmrM - vov1 - s.vt1max;
    const wl5 = (2 * i5) / (s.kn * vds5 * vds5);
    const gm6 = zk * gm1;
    const vov4 = Math.sqrt((2 * id1) / (s.kp * wl3)); // |V_GS6| = |V_GS4|: M6 shares M4's overdrive
    const wl6 = gm6 / (s.kp * vov4);
    const i6 = 0.5 * s.kp * wl6 * vov4 * vov4;
    const wl7 = wl5 * (i6 / i5);
    const pdAmp = s.vdd * (i5 + i6), pdAll = s.vdd * (i5 + i5 + i6); // with a bias branch carrying I5
    const p2 = gm6 / s.cl, gb = gm1 / cc, z = gm6 / cc;
    const sr2 = (i6 - i5) / s.cl;
    return { cc, i5, id1, gm1, wl1, vgs3room, wl3min, wl3, vov1, vds5, wl5, gm6, vov4, wl6, i6, wl7, pdAmp, pdAll, p2, gb, z, pm: pm2(gb, p2, z), sr2 };
  }
  /* the smallest (W/L)3,4 that keeps the power under pdMax (bias branch counted): larger M3/M4 → smaller |V_ov4| → smaller I6 */
  function wl3ForPower(s) {
    const d = design(s), i6max = s.pdMax / s.vdd - 2 * d.i5;
    const vov = (2 * i6max) / d.gm6; // I6 = gm6·Vov/2
    return { i6max, vov, wl3: (2 * d.id1) / (s.kp * vov * vov) };
  }
  /* nulling resistor: z = 1/(Cc(1/gm6 − Rz)) → ∞ when Rz = 1/gm6 */
  const zNull = (gm6, cc, rz) => 1 / (cc * (1 / gm6 - rz));

  /* Lec 21–22: resistive-load inverter. kn = µnCox·W/L. */
  function rInv({ vdd, kn, vt0, rl }) {
    const k = kn * rl, a = vdd - vt0 + 1 / k;
    const voh = vdd;
    const vol = a - Math.sqrt(a * a - (2 * vdd) / k);
    const vil = vt0 + 1 / k, voutVil = vdd - 1 / (2 * k);
    const voutVih = Math.sqrt((2 * vdd) / (3 * k)), vih = vt0 + 2 * voutVih - 1 / k;
    const u = (-1 + Math.sqrt(1 + 2 * k * (vdd - vt0))) / k, vth = vt0 + u; // sat, Vin = Vout
    const nml = vil - vol, nmh = voh - vih;
    const iLow = (vdd - vol) / rl, pd = (vdd / 2) * iLow;
    return { k, a, voh, vol, vil, voutVil, voutVih, vih, vth, nml, nmh, iLow, pd };
  }
  /* design: kn so that the output is vol when vin = vdd (driver in triode) */
  function rInvKnForVol({ vdd, vt0, rl, vol }) { return (2 * (vdd - vol)) / (rl * (2 * (vdd - vt0) * vol - vol * vol)); }

  /* the resistive-load VTC: Vout for a given Vin (cutoff, saturation, triode) */
  function rInvVout({ vdd, kn, vt0, rl }, vin) {
    if (vin <= vt0) return vdd;
    const k = kn * rl, ov = vin - vt0, sat = vdd - (k / 2) * ov * ov;
    if (sat >= ov) return sat;
    const b = k * ov + 1;
    return (b - Math.sqrt(b * b - 2 * k * vdd)) / k;
  }
  /* the CMOS VTC by bisection on In = Ip (vtp negative) */
  function cmosVout({ vdd, kn, kp, vtn, vtp }, vin) {
    const In = (vo) => { const ov = vin - vtn; if (ov <= 0) return 0; return vo >= ov ? (kn / 2) * ov * ov : (kn / 2) * (2 * ov * vo - vo * vo); };
    const Ip = (vo) => { const ov = vdd - vin + vtp, sd = vdd - vo; if (ov <= 0) return 0; return sd >= ov ? (kp / 2) * ov * ov : (kp / 2) * (2 * ov * sd - sd * sd); };
    let lo = 0, hi = vdd;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (In(m) - Ip(m) > 0) hi = m; else lo = m; }
    return (lo + hi) / 2;
  }
  /* preview: CMOS inverter (Kang & Leblebici method). vtp is negative. */
  function cmosInv({ vdd, kn, kp, vtn, vtp }) {
    const kr = kn / kp, r = Math.sqrt(1 / kr), atp = -vtp;
    const vth = (vtn + r * (vdd - atp)) / (1 + r);
    const bis = (f, lo, hi) => { let flo = f(lo); for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2, fm = f(m); if ((fm > 0) === (flo > 0)) { lo = m; flo = fm; } else hi = m; } return (lo + hi) / 2; };
    // V_IL: NMOS saturated, PMOS linear, slope −1
    const voIL = (vin) => ((1 + kr) * vin + vdd + atp - kr * vtn) / 2;
    const fIL = (vin) => { const vo = voIL(vin); return (kn / 2) * (vin - vtn) ** 2 - (kp / 2) * (2 * (vdd - vin - atp) * (vdd - vo) - (vdd - vo) ** 2); };
    const vil = bis(fIL, vtn + 1e-6, vth);
    // V_IH: NMOS linear, PMOS saturated, slope −1
    const voIH = (vin) => (vin - vtn - (vdd - vin - atp) / kr) / 2;
    const fIH = (vin) => { const vo = voIH(vin); return (kn / 2) * (2 * (vin - vtn) * vo - vo * vo) - (kp / 2) * (vdd - vin - atp) ** 2; };
    const vih = bis(fIH, vth, vdd - atp - 1e-6);
    return { kr, vth, vil, voutVil: voIL(vil), vih, voutVih: voIH(vih), nml: vil - 0, nmh: vdd - vih };
  }
  /* Vth design: kR that puts the switching threshold at vth */
  function cmosKrForVth({ vdd, vtn, vtp, vth }) { const r = (vth - vtn) / (vdd + vtp - vth); return 1 / (r * r); }

  return { atanDeg, pm2, pmRules, poles, design, wl3ForPower, zNull, rInv, rInvKnForVol, rInvVout, cmosVout, cmosInv, cmosKrForVth };
})();

/* the problems of this lesson, with their givens (one place, so cards, stops and checks agree) */
const F = (() => {
  // Tutorial 7 Q1 (CL = 2 pF) and the Lec 19 example (CL = 5 pF): same process; V_DD = 1.8 V (lecture; Tutorial 7 prints only V_SS)
  const proc = { vdd: 1.8, kn: 300e-6, kp: 60e-6, vt1max: 0.59, vt1min: 0.47, vt3max: 0.51 };
  const t7spec = { ...proc, gbw: 30e6, sr: 20e6, icmrP: 1.6, icmrM: 0.8, cl: 2e-12, pdMax: 300e-6 };
  const l19spec = { ...proc, gbw: 30e6, sr: 20e6, icmrP: 1.6, icmrM: 0.8, cl: 5e-12, pdMax: 300e-6 };
  const t7 = FN.design(t7spec), l19 = FN.design(l19spec);
  const l19fix = FN.wl3ForPower(l19spec);
  const l19b = FN.design({ ...l19spec, wl3: Math.ceil(l19fix.wl3) });
  // Lec 18 worked example (small-signal model)
  const ex18 = FN.poles({ gm1: 0.1e-3, gm2: 1e-3, r1: 200e3, r2: 100e3, c1: 0.1e-12, c2: 2e-12, cc: 0.5e-12 });
  const rules = FN.pmRules(60, 10);
  // Tutorial 7 Q2, Q3 (resistive load)
  const q2 = FN.rInv({ vdd: 5, kn: 20e-6 * 2, vt0: 0.8, rl: 200e3 });
  const q3kn = FN.rInvKnForVol({ vdd: 5, vt0: 1, rl: 1e3, vol: 0.6 });
  const q3 = FN.rInv({ vdd: 5, kn: q3kn, vt0: 1, rl: 1e3 });
  // inverter tutorial Q4 (CMOS preview): kn = 60µ·8, kp = 25µ·12
  const c4 = FN.cmosInv({ vdd: 3.3, kn: 60e-6 * 8, kp: 25e-6 * 12, vtn: 0.6, vtp: -0.7 });
  // inverter tutorial Q3 (CMOS preview): kn = 200µ, kp = 80µ
  const c3 = FN.cmosInv({ vdd: 3.3, kn: 200e-6, kp: 80e-6, vtn: 0.6, vtp: -0.7 });
  return { proc, t7spec, l19spec, t7, l19, l19fix, l19b, ex18, rules, q2, q3kn, q3wl: q3kn / 22e-6, q3, c4, c3 };
})();
