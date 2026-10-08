/**
 * Solvers for the lectures after the mid-sem (L5–L9): gain boosting (Tutorial 4), CMFB (Tutorial 5),
 * slewing and settling (Tutorial 6). These tutorials are not Razavi problems and have no answer key;
 * every assumption is written next to the number (see content/inventory.md, §7b).
 */
import { gmFromIdVov, rO, vovFromId } from './device';
import { parallel } from './impedance';
import { triodeSenseWl } from './cmfb';

/** Gain-boosted (regulated) cascode, lecture-notes form: Rout = rO1 + rO2 + (1 + A1)·gm2·rO2·rO1. */
export function boostedRout(p: { gm2: number; rO2: number; rO1: number; a1: number }): number {
  return p.rO1 + p.rO2 + (1 + p.a1) * p.gm2 * p.rO2 * p.rO1;
}

/** Plain cascode in the same form (A1 = 0). */
export function cascodeRoutExact(p: { gm2: number; rO2: number; rO1: number }): number {
  return boostedRout({ ...p, a1: 0 });
}

// ─── Tutorial 4 Q1 (adapted Razavi 9.10): regulated cascode with an NMOS CS auxiliary M3 ──

export function tut4Q1() {
  const kpn = 172.35e-6, vth = 0.7, wl = 200, ln = 0.1, i1 = 100e-6, i2 = 0.5e-3, vdd = 3;
  const kpp = 51.7e-6, vthp = 0.8, lp = 0.2, wlp = 100;
  const vov3 = vovFromId(i1, kpn, wl);
  const vov2 = vovFromId(i2, kpn, wl);
  const vgs3 = vth + vov3; // X = VGS3 (M3's gate is at X, its source at ground)
  const vx = vgs3;
  const vg2 = vx + vth + vov2;
  const gm1 = gmFromIdVov(i2, vov2), gm2 = gm1, gm3 = gmFromIdVov(i1, vov3);
  const ro1 = rO(ln, i2), ro2 = ro1, ro3 = rO(ln, i1);
  // (b) ideal current sources
  const a3 = gm3 * ro3;
  const rout = boostedRout({ gm2, rO2: ro2, rO1: ro1, a1: a3 });
  const av = gm1 * rout;
  // (c) PMOS current sources
  const roP1 = rO(lp, i1), roP2 = rO(lp, i2);
  const a3p = gm3 * parallel(ro3, roP1);
  const routP = parallel(boostedRout({ gm2, rO2: ro2, rO1: ro1, a1: a3p }), roP2);
  const avP = gm1 * routP;
  const vovP2 = vovFromId(i2, kpp, wlp);
  const voutMin = vg2 - vth;
  const voutMax = vdd - vovP2;
  return { vx, vg2, vgs3, a3, rout, av, a3p, routP, avP, voutMin, voutMax, swing: voutMax - voutMin, vthp };
}

// ─── Tutorial 4 Q2: gain boosting with a PMOS CS auxiliary (M3) loaded by NMOS M4 ──

export function tut4Q2() {
  const vdd = 1.8, kpn = 150e-6, kpp = 100e-6, wln = 150, wlp = 100, vthn = 0.7, vthp = 0.85, id = 0.1e-3;
  const vov5 = vovFromId(id, kpp, wlp);
  const vbp = vdd - (vthp + vov5); // (a)
  const vov1 = vovFromId(id, kpn, wln);
  const vp = vov1; // (b) target
  const vg2 = vp + vthn + vov1; // M2's gate = M3's drain
  const m3Saturated = vg2 <= vp + vthp; // PMOS fence: VD ≤ VG + |Vth|
  const i4 = 0.5 * kpn * wln * 0.1 * 0.1; // (c) Vov4 = 0.1 V
  const vov3 = vovFromId(i4, kpp, wlp);
  const vs = vp + vthp + vov3; // M3 source
  // (d) plain cascode, ideal source: (gm rO)^2 ≈ 2550
  const gm = gmFromIdVov(id, vov1);
  const lambdaApprox = gm / (Math.sqrt(2550) * id); // gm·rO = √2550 → rO = √2550/gm → λ = 1/(rO·ID)
  const x = -1 + Math.sqrt(1 + 2550); // exact: x² + 2x = 2550 with x = gm·rO (Rout = 2rO + gm rO²)
  const lambdaExact = gm / (x * id);
  // (e) λp = 1.3 λn; the auxiliary M3/M4 boosts; M5 (PMOS, rO5) loads the output
  const ln = lambdaApprox, lp = 1.3 * ln;
  const ro = rO(ln, id), ro5 = rO(lp, id);
  const gm3 = gmFromIdVov(i4, vov3);
  const a1 = gm3 * parallel(rO(lp, i4), rO(ln, i4));
  const rBoost = boostedRout({ gm2: gm, rO2: ro, rO1: ro, a1 });
  const av = gm * parallel(rBoost, ro5);
  const avIdealLoad = gm * rBoost;
  return { vbp, vov1, vp, vg2, m3Saturated, i4, vs, gm, lambdaApprox, lambdaExact, a1, rBoost, av, avIdealLoad };
}

// ─── Tutorial 5 Q1 (Razavi 9.11 extended): triode-device CMFB in the tail ──

export function tut5Q1() {
  const vdd = 3, kpn = 135e-6, kpp = 40e-6, vthn = 0.7, vthp = 0.8, id = 0.5e-3, voutCm = 1.5, vp = 0.1;
  const wl = triodeSenseWl({ id, kpn, vp, voutSum: 2 * voutCm, vthn });
  // exact triode equation (keeps the VDS²/2 term): ID = µnCox(W/L)[(VGS − Vth)VDS − VDS²/2]
  const wlExact = id / (kpn * ((voutCm - vthn) * vp - (vp * vp) / 2));
  // (b), (c) assuming every transistor has this same W/L (the exact one, as in the 2025-26 mid-sem key)
  const vovP = vovFromId(id, kpp, wlExact);
  const vovN = vovFromId(id, kpn, wlExact);
  // Vb1 drives the NMOS cascodes M5, M6 that sit on node P: Vb1 = VP + VGS5
  const vb1 = vp + vthn + vovN;
  const voutMax = vdd - 2 * vovP;
  const voutMin = vp + 2 * vovN;
  return { wl, wlExact, vb1, vovN, vovP, vthp, voutMax, voutMin, diffSwing: 2 * (voutMax - voutMin) };
}

// ─── Tutorial 6: slewing and linear settling ───────────────────────────────

/** Q1: non-inverting amp, R1 4 MΩ, R2 1 MΩ, CL 8 pF, A0 80 dB, Rout 50 kΩ, Imax 160 µA. */
export function tut6Q1() {
  const a = 1e4, r1 = 4e6, r2 = 1e6, cl = 8e-12, rout = 50e3, imax = 160e-6, v0 = 0.05, vBig = 1;
  const beta = r2 / (r1 + r2);
  const acl = a / (1 + a * beta);
  const tau = (cl * rout) / (1 + a * beta);
  const vAt1ns = v0 * acl * (1 - Math.exp(-1e-9 / tau));
  const slope0 = (v0 * acl) / tau;
  const sr = imax / cl;
  const v0crit = (sr * tau) / acl;
  const tslew = (vBig * acl - sr * tau) / sr;
  return { beta, acl, tau, vAt1ns, slope0, sr, v0crit, tslew };
}

/** Q2: 5-T OTA in a non-inverting loop, ISS 200 µA, CL 5 pF, R1 3 MΩ, R2 1 MΩ, k = 4 mA/V², VA 20 V. */
export function tut6Q2() {
  const iss = 200e-6, cl = 5e-12, r1 = 3e6, r2 = 1e6, k = 4e-3, va = 20, v0 = 1.2;
  const beta = r2 / (r1 + r2);
  const sr = iss / cl;
  const dvinMin = Math.sqrt((2 * iss) / k); // √2·Vov at balance
  const vx = v0 - dvinMin; // X = β·Vout when M2 turns back on
  const voutAtEnd = vx / beta;
  const tslew = voutAtEnd / sr;
  const id = iss / 2;
  const ro = va / id;
  const rout = parallel(ro, ro);
  const gm = Math.sqrt(2 * k * id);
  const a0 = gm * rout;
  const w0 = 1 / (rout * cl);
  const tau = 1 / ((1 + beta * a0) * w0);
  const acl = a0 / (1 + beta * a0);
  const vFinal = acl * v0;
  const tLinear = tau * Math.log((vFinal - voutAtEnd) / (0.01 * vFinal));
  return { beta, sr, dvinMin, vx, voutAtEnd, tslew, rout, gm, a0, tau, acl, vFinal, tLinear, total: tslew + tLinear };
}

/** Q3: NMOS-input folded cascode with a cascode-mirror bottom, ISS 300 µA, IP 200 µA, CL 4 pF, Vov1,2 150 mV. */
export function tut6Q3() {
  const iss = 300e-6, ip = 200e-6, cl = 4e-12, vov = 0.15;
  // Output current = (IP − ID2) − copy of (IP − ID1), each branch clamped at ≥ 0.
  const branch = (x: number) => Math.max(0, x);
  const srPlus = (branch(ip - 0) - branch(ip - iss)) / cl;
  const srMinus = (branch(ip - 0) - branch(ip - iss)) / cl; // mirror image: sink = IP, source = max(0, IP − ISS)
  return { srPlus, srMinus, limitedBy: ip < iss ? 'IP' : 'ISS', ipMin: iss, dvinMin: Math.SQRT2 * vov };
}

// ─── Tutorial 4 Q3: gain boosting with a folded-cascode auxiliary (M3–M5, M9) ──
/**
 * Main path: M1 (input) – M2 (cascode) – M6 (PMOS source), 500 µA. Auxiliary: PMOS M3 (gate at VP, source
 * on R3 to VDD) folded into NMOS M4 (gate from the R1–R2 bias string), loads M5 (PMOS) and M9 (NMOS); its
 * output drives M2's gate. Bias string: M8 (diode) – R1 – R2 – M7 (diode). 3 mW at 3 V → 1 mA in total:
 * M6 500 µA, M8 and M5 0.4 × 500 = 200 µA each (same |VGS| as M6), so R3/M3 carry the last 100 µA and M9
 * sinks I4 + I3 = 300 µA. λ = 0 for the DC walk; λ only for rO.
 */
export function tut4Q3() {
  const vdd = 3, kpn = 200e-6, kpp = 100e-6, vthn = 0.7, vthp = 0.8, ln = 0.1, lp = 0.2;
  const wl1 = 200, i1 = 500e-6, ptot = 3e-3, swing = 2.5;
  const itot = ptot / vdd;
  const i8 = 0.4 * i1, i5 = 0.4 * i1;
  const i3 = itot - i1 - i8 - i5;
  const i4 = i5, i9 = i4 + i3;
  // (a) Vout from 2·Vov1 (M1, M2 identical, same current) up to VDD − |Vov6|
  const vov1 = vovFromId(i1, kpn, wl1);
  const vov6 = vdd - swing - 2 * vov1;
  const wl6 = (2 * i1) / (kpp * vov6 * vov6);
  // (b) VP = Vov1; M3 (W/L = 0.5·(W/L)6) carries i3: R3 drops VDD − (VP + |VGS3|)
  const wl3 = 0.5 * wl6;
  const vov3 = vovFromId(i3, kpp, wl3);
  const vp = vov1;
  const vs3 = vp + vthp + vov3;
  const r3 = (vdd - vs3) / i3;
  // (c) VDS9 = 1.15·Vov9 puts M4's source; M4 carries i4; its drain is M2's gate = VP + VGS2
  const vov9 = vovFromId(i9, kpn, wl1);
  const vf = 1.15 * vov9;
  const vov4 = vovFromId(i4, kpn, wl1);
  const vg4 = vf + vthn + vov4;
  const vd4 = vp + vthn + vov1;
  const m4Saturated = vd4 >= vg4 - vthn;
  // (d) M7 mirrors M9 (same VGS): (W/L)7 = (W/L)9·i8/i9; R2 from VGS7 up to VG4; R1 from VG4 up to M8's drain
  const wl7 = (wl1 * i8) / i9;
  const vgs7 = vthn + vov9;
  const r2 = (vg4 - vgs7) / i8;
  const wl8 = 0.4 * wl6;
  const vd8 = vdd - (vthp + vovFromId(i8, kpp, wl8));
  const r1 = (vd8 - vg4) / i8;
  // (e) gain: A_aux = Gm3·(rO5 ‖ R_up of M4), Gm3 degenerated by R3; boosted cascode loaded by rO6
  const gm1 = gmFromIdVov(i1, vov1), gm3 = gmFromIdVov(i3, vov3), gm4 = gmFromIdVov(i4, vov4);
  const ro1 = rO(ln, i1), ro6 = rO(lp, i1), ro4 = rO(ln, i4), ro5 = rO(lp, i5), ro9 = rO(ln, i9);
  const gm3eff = gm3 / (1 + gm3 * r3);
  const rAux = parallel(ro5, ro4 + (1 + gm4 * ro4) * ro9);
  const aAux = gm3eff * rAux;
  const rBoost = boostedRout({ gm2: gm1, rO2: ro1, rO1: ro1, a1: aAux });
  const av = gm1 * parallel(rBoost, ro6);
  const avIdealLoad = gm1 * rBoost;
  return { itot, i3, i4, i5, i8, i9, vov1, vov6, wl6, wl3, vov3, vp, vs3, r3, vov9, vf, vov4, vg4, vd4, m4Saturated, wl7, vgs7, r2, vd8, r1, gm1, gm3, gm3eff, rAux, aAux, rBoost, ro6, av, avIdealLoad };
}

// ─── Tutorial 5 Q3: resistive-sensing CMFB with a PMOS-input error amplifier (M7–M12) ──
/**
 * Main amplifier: NMOS pair M1, M2 (tail M5), PMOS current-source loads M3, M4 mirrored from the diode M6
 * (I1 = 50 µA → 50 µA per side, M5 carries 100 µA). The two R = 10 MΩ resistors sense VO,CM. Error amplifier:
 * PMOS pair M7 (gate VREF), M8 (gate VO,CM) with tail M11 (copy of I2 = 200 µA via M12) and diode loads M9,
 * M10; M9's gate drives M5. All W/L = 50.
 */
export function tut5Q3() {
  const vdd = 1.8, kpn = 100e-6, kpp = 50e-6, ln = 0.1, lp = 0.2, vthn = 0.4, vthp = 0.5, wl = 50, r = 10e6;
  const i1 = 50e-6, i2 = 200e-6;
  const id = i1, i5 = 2 * id, i7 = i2 / 2;
  const vov1 = vovFromId(id, kpn, wl), vov3 = vovFromId(id, kpp, wl), vov5 = vovFromId(i5, kpn, wl);
  const vov7 = vovFromId(i7, kpp, wl), vov9 = vovFromId(i7, kpn, wl);
  const gm1 = gmFromIdVov(id, vov1), gm5 = gmFromIdVov(i5, vov5), gm7 = gmFromIdVov(i7, vov7), gm9 = gmFromIdVov(i7, vov9);
  const ro1 = rO(ln, id), ro3 = rO(lp, id), ro5 = rO(ln, i5), ro7 = rO(lp, i7), ro9 = rO(ln, i7);
  // Differential mode: the midpoint of the two R's is a virtual ground, so each output sees R too.
  const ad = gm1 * parallel(parallel(ro1, ro3), r);
  // Common mode (no CMFB): no current in the R's; course formula ACM = −RD/(1/gm + 2RSS) with RD = rO3, RSS = rO5
  const acm = ro3 / (1 / gm1 + 2 * ro5);
  const cmrr = ad / acm;
  // Optimum VO,CM: the middle of the output range [Vov5 + Vov1, VDD − |Vov3|]
  const voutMin = vov5 + vov1, voutMax = vdd - vov3;
  const vocm = (voutMin + voutMax) / 2;
  // The course rule (2024-25 mid-sem key): VO,CM may move 2·1%·VO,CM while the input CM sweeps its whole range,
  // from Vov5 + VGS1 up to VO,CM + Vth1 (M1 at its edge).
  const vinCmMin = vov5 + vthn + vov1, vinCmMax = vocm + vthn;
  const acmTarget = (2 * 0.01 * vocm) / (vinCmMax - vinCmMin);
  // CM loop: ΔVO,CM → M8 → half the pair current (gm7/2) into diode M9 (1/gm9 ‖ rO9 ‖ rO7) → M5 (gm5) →
  // half of that per side into (rO3 ‖ R_down,CM), R_down,CM = rO1 + (1 + gm1 rO1)·2rO5
  const zDiode = parallel(parallel(1 / gm9, ro9), ro7);
  const rDownCm = ro1 + (1 + gm1 * ro1) * 2 * ro5;
  const loop = (gm7 / 2) * zDiode * gm5 * 0.5 * parallel(ro3, rDownCm);
  const acmFb = acm / (1 + loop);
  const cmrrFb = ad / acmFb;
  return { vov1, vov3, vov5, vov7, gm1, gm5, gm7, gm9, ro1, ro3, ro5, ad, acm, cmrr, voutMin, voutMax, vocm, vinCmMin, vinCmMax, acmTarget, zDiode, rDownCm, loop, acmFb, cmrrFb, vthn, vthp };
}
