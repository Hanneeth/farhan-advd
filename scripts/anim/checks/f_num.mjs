// Checks Lesson F's numbers (src/f_num.js) against the answer keys and the lecture's hand results. node scripts/anim/checks/f_num.mjs
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const ctx = {}; vm.createContext(ctx);
vm.runInContext(readFileSync(new URL('../src/f_num.js', import.meta.url), 'utf8') + '\nthis.FN = FN; this.F = F;', ctx);
const { FN, F } = ctx;
let bad = 0;
const near = (name, got, want, tol = 0.01) => {
  const ok = Math.abs(got - want) <= tol * Math.abs(want) + 1e-12;
  if (!ok) bad++;
  console.log(`${ok ? 'ok ' : 'BAD'} ${name}: ${+got.toPrecision(5)} (key ${want})`);
};
// Tutorial 7 Q2 key: VOL 0.147, VOH 5, VIL 0.925, VIH 1.966, NML 0.778, NMH 3.034
near('T7Q2 VOL', F.q2.vol, 0.147); near('T7Q2 VOH', F.q2.voh, 5); near('T7Q2 VIL', F.q2.vil, 0.925);
near('T7Q2 VIH', F.q2.vih, 1.966); near('T7Q2 NML', F.q2.nml, 0.778); near('T7Q2 NMH', F.q2.nmh, 3.034);
// Tutorial 7 Q3 key: W/L 90, VIL 1.505, VIH 3.09, NML 0.905, NMH 1.91
near('T7Q3 W/L', F.q3wl, 90); near('T7Q3 VIL', F.q3.vil, 1.505); near('T7Q3 VIH', F.q3.vih, 3.09);
near('T7Q3 NML', F.q3.nml, 0.905); near('T7Q3 NMH', F.q3.nmh, 1.91);
near('T7Q3 VOL back', F.q3.vol, 0.6, 0.001);
// inverter tutorial key: Q4 VIL 1.16, VIH 1.69, NML 1.16, NMH 1.61, Vth 1.48; Q3 VIL 1.07, VIH 1.55, NML 1.07, NMH 1.75
// the key's V_IL = 1.16 V is a slip: a brute-force sweep of the VTC puts the slope −1 point at 1.1985 V (the lesson flags it and accepts both)
near('CMOS Q4 Vth', F.c4.vth, 1.48); near('CMOS Q4 VIL (sweep)', F.c4.vil, 1.1985, 0.002);near('CMOS Q4 VIH', F.c4.vih, 1.69, 0.012);
near('CMOS Q4 NMH', F.c4.nmh, 1.61, 0.012);
near('CMOS Q3 VIL', F.c3.vil, 1.07, 0.012); near('CMOS Q3 VIH', F.c3.vih, 1.55, 0.012); near('CMOS Q3 NMH', F.c3.nmh, 1.75, 0.012);
// Lec 18 page: zero at 10 GB costs 5.71°, leaves 24.3°, tan = 0.451, ωp2 ≥ 2.2 GB, Cc ≥ 0.22 CL
near('Lec18 zero angle', F.rules.zDeg, 5.71); near('Lec18 left', F.rules.left, 24.3); near('Lec18 tan', F.rules.x, 0.451);
near('Lec18 ratio', F.rules.ratio, 2.2, 0.01); near('Lec18 Cc/CL', F.rules.ccOverCl, 0.22, 0.01);
// Lec 18 example: GB = A0·ωp1 (two routes agree)
near('Lec18 GB = A0·wp1', F.ex18.gbCheck, F.ex18.gb, 1e-9);
// design: independent recomputation of the chain for Tutorial 7
const s = F.t7spec, cc = 0.22 * s.cl, i5 = s.sr * cc, gm1 = 2 * Math.PI * s.gbw * cc;
near('T7Q1 Cc', F.t7.cc, 0.44e-12); near('T7Q1 I5', F.t7.i5, 8.8e-6); near('T7Q1 gm1', F.t7.gm1, gm1);
near('T7Q1 (W/L)1', F.t7.wl1, (gm1 * gm1) / (s.kn * i5));
near('T7Q1 (W/L)3', F.t7.wl3, i5 / (s.kp * (s.vdd - s.icmrP - s.vt3max + s.vt1min) ** 2));
near('T7Q1 VGS6 = VGS4 (Vov)', F.t7.vov4, Math.sqrt(i5 / (s.kp * F.t7.wl3)));
near('T7Q1 gm6 = 10 gm1', F.t7.gm6, 10 * gm1);
near('T7Q1 I6 from gm6 and Vov', F.t7.i6, (F.t7.gm6 * F.t7.vov4) / 2);
near('T7Q1 PM ≥ 60', F.t7.pm, 60, 0.01);
console.log('T7 power (µW, with bias)', (F.t7.pdAll * 1e6).toFixed(1), '· Lec 19 example power', (F.l19.pdAll * 1e6).toFixed(1), '→ fixed with (W/L)3 =', Math.ceil(F.l19fix.wl3), ':', (F.l19b.pdAll * 1e6).toFixed(1));
if (F.t7.pdAll > 300e-6) { bad++; console.log('BAD T7 power over budget'); }
if (F.l19b.pdAll > 300e-6) { bad++; console.log('BAD Lec 19 fix still over budget'); }
console.log(bad ? `${bad} FAILED` : 'all Lesson F numbers check');
process.exitCode = bad ? 1 : 0;
