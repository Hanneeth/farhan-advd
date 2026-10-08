import { describe, expect, it } from 'vitest';
import {
  a0ForPhaseMargin,
  ccForPhaseMargin,
  clForPhaseMargin,
  closedLoopStep,
  dominantPoleForPM,
  gainCrossover,
  gainMarginDb,
  oneStageLoop,
  millerLoop,
  millerPhaseMargin,
  millerTwoStage,
  overshoot,
  peakingFactor,
  phaseCrossover,
  phaseMargin,
  pmFromPeaking,
  rzCancel,
  rzNull,
  twoStageSlewRate,
} from './stability';
import { addUncorrelated, inputNoisePair, ktcNoiseRms, rcNoiseRms, resistorNoise, psrr5T, replicaCmfbOutputCm, thermalNoiseCurrent } from './noise';

describe('loop gain, crossovers, margins', () => {
  it('one pole: PM = 90° + a bit, never unstable, no phase crossover', () => {
    const s = { a0: 1000, poles: [1e3], beta: 1 };
    expect(gainCrossover(s)!).toBeCloseTo(1e6, -3); // ≈ A0·fp1
    expect(phaseMargin(s)).toBeGreaterThan(90);
    expect(phaseCrossover(s)).toBeUndefined();
    expect(gainMarginDb(s)).toBe(Infinity);
  });
  it('Razavi Problem 10.3 by hand: A0 = 1000, fp1 = 1 MHz, fp2 = 2 MHz → ωgx 44.7 MHz, PM 3.84°', () => {
    const s = { a0: 1000, poles: [1e6, 2e6], beta: 1 };
    expect(gainCrossover(s)! / 1e6).toBeCloseTo(44.694, 2);
    expect(phaseMargin(s)).toBeCloseTo(3.84, 1);
    expect(phaseMargin({ ...s, poles: [1e6, 4e6] })).toBeCloseTo(4.53, 1);
  });
  it('three poles: phase crossover exists and a positive GM goes with a positive PM', () => {
    const s = { a0: 1e5, poles: [1e3, 1e6, 1e7], beta: 0.01 };
    expect(phaseCrossover(s)).toBeDefined();
    const pm = phaseMargin(s);
    const gm = gainMarginDb(s);
    expect(Math.sign(pm)).toBe(Math.sign(gm));
  });
  it('lowering β makes the loop more stable (Razavi Example 10.1)', () => {
    const s = { a0: 1e4, poles: [1e3, 1e6, 3e6], beta: 1 };
    expect(phaseMargin({ ...s, beta: 0.1 })).toBeGreaterThan(phaseMargin(s));
  });
  it('Razavi Problem 10.1 by hand: poles 10 MHz, 500 MHz, PM 60° → A0 ≈ 36.6, ωgx ≈ 310.6 MHz', () => {
    const r = a0ForPhaseMargin({ poles: [10e6, 500e6], pm: 60, beta: 1 });
    expect(r.fgx / 1e6).toBeCloseTo(310.6, 0);
    expect(r.a0).toBeCloseTo(36.58, 1);
  });
  it('Razavi Problem 10.2: coincident poles, PM 60° → A0 = 4 (β = 1) and 16 (β = 1/4)', () => {
    expect(a0ForPhaseMargin({ poles: [1e6, 1e6], pm: 60, beta: 1 }).a0).toBeCloseTo(4, 6);
    expect(a0ForPhaseMargin({ poles: [1e6, 1e6], pm: 60, beta: 0.25 }).a0).toBeCloseTo(16, 5);
  });
});

describe('phase margin and peaking (Lec 16, Razavi §10.3)', () => {
  it('PM 5° → 11.5/β, 45° → 1.3/β, 60° → 1/β', () => {
    expect(peakingFactor(5)).toBeCloseTo(11.46, 2); // the notes round to 11.5
    expect(peakingFactor(45)).toBeCloseTo(1.307, 3);
    expect(peakingFactor(60)).toBeCloseTo(1, 10);
  });
  it('Razavi Problem 10.4: 50% peaking ↔ PM 38.9°', () => {
    expect(pmFromPeaking(1.5)).toBeCloseTo(38.94, 2);
    expect(peakingFactor(pmFromPeaking(1.5))).toBeCloseTo(1.5, 10);
  });
  it('step response: one pole has no overshoot; lower PM rings more', () => {
    const one = closedLoopStep({ a0: 1000, poles: [1e3], beta: 1 }, 5 / (2 * Math.PI * 1.001e6));
    expect(overshoot(one)).toBeLessThan(1e-3);
    const tau = 1 / (2 * Math.PI * 1.001e6);
    const at = one.find((p) => p.t >= tau)!;
    expect(at.y).toBeCloseTo(1 - Math.exp(-at.t / tau), 2);
    const mk = (pm: number) => {
      const { a0 } = a0ForPhaseMargin({ poles: [1e6, 1e8], pm, beta: 1 });
      return overshoot(closedLoopStep({ a0, poles: [1e6, 1e8], beta: 1 }, 20 / (2 * Math.PI * 1e8), 1500));
    };
    const o45 = mk(45);
    const o60 = mk(60);
    const o90 = mk(89);
    expect(o45).toBeGreaterThan(0.15);
    expect(o45).toBeLessThan(0.3);
    expect(o60).toBeGreaterThan(0.04);
    expect(o60).toBeLessThan(o45);
    expect(o90).toBeLessThan(0.01);
  });
});

describe('compensation', () => {
  it('dominant pole for PM 45° with a 100 MHz second pole, A0 = 1000: fd ≈ 141 kHz and ωgx ≈ fp2', () => {
    const r = dominantPoleForPM({ a0: 1000, nondominant: [100e6], pm: 45, beta: 1 });
    expect(r.fd / 1e3).toBeCloseTo(141.5, -1);
    expect(r.fgx / 1e6).toBeCloseTo(100, -1);
    expect(phaseMargin({ a0: 1000, poles: [r.fd, 100e6], beta: 1 })).toBeCloseTo(45, 6);
  });
  it('Razavi Example 10.5: with β < 1 the dominant pole may be 1/β higher for the same PM', () => {
    const a = dominantPoleForPM({ a0: 1e4, nondominant: [50e6], pm: 60, beta: 1 });
    const b = dominantPoleForPM({ a0: 1e4, nondominant: [50e6], pm: 60, beta: 0.25 });
    expect(b.fd / a.fd).toBeCloseTo(4, 1);
  });
  const m = { gm1: 1e-3, r1: 200e3, c1: 0.2e-12, gm2: 5e-3, r2: 50e3, c2: 5e-12, cc: 2e-12 };
  it('Miller: pole splitting (p1 down, p2 up) and the notes’ approximations', () => {
    const before = millerTwoStage({ ...m, cc: 0 });
    const after = millerTwoStage(m);
    expect(after.p1).toBeLessThan(before.p1);
    expect(after.p2).toBeGreaterThan(before.p2);
    expect(after.a2).toBeCloseTo(250, 9);
    expect(after.p1 / after.p1Approx).toBeGreaterThan(0.9);
    expect(after.p1 / after.p1Approx).toBeLessThan(1.1);
    expect(after.p2 / after.p2Approx).toBeGreaterThan(0.9);
    expect(after.p2 / after.p2Approx).toBeLessThan(1.1);
    expect(after.z).toBeCloseTo(m.gm2 / m.cc, 3); // RHP zero Gm2/CC
    expect(after.gbw).toBeCloseTo(m.gm1 / m.cc, 3);
    // p1·p2 = 1/b2 exactly
    const b2 = m.r1 * m.r2 * (m.c1 * m.c2 + m.c2 * m.cc + m.c1 * m.cc);
    expect(after.p1 * after.p2 * b2).toBeCloseTo(1, 9);
  });
  it('Rz = 1/Gm2 removes the zero; Rz = (CL + CC)/(Gm2·CC) puts it on the second pole', () => {
    expect(millerTwoStage({ ...m, rz: rzNull(m.gm2) }).z).toBe(Infinity);
    const rz = rzCancel({ gm2: m.gm2, cc: m.cc, cl: m.c2 });
    const z = millerTwoStage({ ...m, rz }).z; // negative = LHP
    expect(-z / (m.gm2 / m.c2)).toBeCloseTo(1, 9); // LHP, on top of Gm2/CL
  });
  it('CC for PM: Razavi Eq. 10.28 (45°, zero nulled) and the 0.22·CL rule (60°, gm2 = 10gm1)', () => {
    expect(ccForPhaseMargin({ gm1: 1e-3, gm2: 4e-3, cl: 2e-12, pm: 45, zeroNulled: true })).toBeCloseTo(0.5e-12, 20);
    const cc = ccForPhaseMargin({ gm1: 1e-3, gm2: 10e-3, cl: 1e-12, pm: 60, zeroNulled: false });
    expect(cc / 1e-12).toBeCloseTo(0.2216, 3);
    expect(millerPhaseMargin({ gm1: 1e-3, gm2: 10e-3, cl: 1e-12, cc, zeroNulled: false })).toBeCloseTo(60, 9);
  });
  it('two-stage slew: ISS/CC unless the output current source runs out', () => {
    expect(twoStageSlewRate({ iss: 100e-6, cc: 2e-12, i7: 1e-3, cl: 5e-12 })).toEqual({ sr: 50e6, limit: 'CC' });
    const r = twoStageSlewRate({ iss: 100e-6, cc: 1e-12, i7: 300e-6, cl: 10e-12 });
    expect(r.limit).toBe('CL');
    expect(r.sr).toBeCloseTo(20e6, 3);
  });
});

describe('noise and PSRR', () => {
  it('4kTγgm at 300 K', () => {
    expect(thermalNoiseCurrent(1e-3)).toBeCloseTo(4 * 1.380649e-23 * 300 * (2 / 3) * 1e-3, 30);
  });
  it('pair noise: 8kTγ(1/gm1 + gm3/gm1²); a bigger load gm adds noise', () => {
    const a = inputNoisePair(1e-3, 0.5e-3);
    expect(a).toBeCloseTo(8 * 1.380649e-23 * 300 * (2 / 3) * (1e3 + 500), 30);
    expect(inputNoisePair(1e-3, 1e-3)).toBeGreaterThan(a);
  });
  it('kT/C: 1 pF at 300 K ≈ 64.4 µV rms', () => {
    expect(ktcNoiseRms(1e-12) * 1e6).toBeCloseTo(64.36, 1);
  });
  it('5-T OTA PSRR ≈ gmN(rOP‖rON): 1 mS, 100k‖100k → 50', () => {
    expect(psrr5T({ gmN: 1e-3, roP: 100e3, roN: 100e3 }).psrr).toBeCloseTo(50, 9);
  });
  it('replica CMFB (Lec 12): (W/L)15 = (W/L)12 + (W/L)13 → Vout,CM = VREF', () => {
    expect(replicaCmfbOutputCm({ vref: 1.2, vth: 0.5, wl12: 10, wl13: 10, wl15: 20 })).toBeCloseTo(1.2, 12);
    expect(replicaCmfbOutputCm({ vref: 1.2, vth: 0.5, wl12: 10, wl13: 10, wl15: 30 })).toBeGreaterThan(1.2);
  });
});

describe('Razavi HO #10/#12 and Allen L22 intuitions', () => {
  it('RC noise: R cancels, total = √(kT/C) (Razavi HO #10)', () => {
    for (const r of [100, 1e3, 1e6]) expect(rcNoiseRms(r, 1e-12) / ktcNoiseRms(1e-12)).toBeCloseTo(1, 12);
    expect(resistorNoise(1e3) * 1e18).toBeCloseTo(16.57, 1); // 1 kΩ ≈ 4.07 nV/√Hz
  });
  it('uncorrelated sources add as powers: 3 and 4 → 5', () => {
    expect(addUncorrelated([3, 4])).toBeCloseTo(5, 12);
  });
  it('Razavi HO #12: phase −175° at ωgx → |Y/X| ≈ 11.5/β; 45° → 1.3/β', () => {
    expect(peakingFactor(5)).toBeCloseTo(11.47, 1);
    expect(peakingFactor(45)).toBeCloseTo(1.307, 3);
  });
  it('one-stage op amp: hand CL for 60° gives 60–64° (safe side); more CL = more margin', () => {
    const gm = 1e-3, rout = 2e6, fnd = 300e6;
    const cl = clForPhaseMargin({ gm, fnd, pm: 60, beta: 1 });
    expect(cl * 1e12).toBeCloseTo(0.919, 2);
    // The hand method ignores the second pole's small magnitude drop at ωgx, so it errs on the safe side.
    const exact = phaseMargin(oneStageLoop({ gm, rout, cl, fnd, beta: 1 }));
    expect(exact).toBeGreaterThan(60);
    expect(exact).toBeLessThan(64);
    const pm = (c: number) => phaseMargin(oneStageLoop({ gm, rout, cl: c, fnd, beta: 1 }));
    expect(pm(2 * cl)).toBeGreaterThan(pm(cl));
  });
  it('two-stage op amp: more CL = less margin (P2 = Gm2/CL moves down)', () => {
    const m = { gm1: 0.5e-3, r1: 400e3, c1: 0.2e-12, gm2: 2.5e-3, r2: 40e3, cc: 1.5e-12, rz: 400 };
    const pm = (cl: number) => phaseMargin(millerLoop({ ...m, c2: cl }, 1));
    expect(pm(10e-12)).toBeLessThan(pm(5e-12));
  });
  it('Allen L22 rule (zero at 10·GB, P2 ≥ 2.2·GB for 60°) ⇔ CC ≥ 0.22·CL', () => {
    const cc = ccForPhaseMargin({ gm1: 1e-3, gm2: 10e-3, cl: 1e-12, pm: 60, zeroNulled: false });
    expect(cc / 1e-12).toBeGreaterThan(0.22);
    expect(cc / 1e-12).toBeLessThan(0.223);
    // P2/GB = (Gm2/CL)/(Gm1/CC) = 10·CC/CL ≈ 2.2
    expect((10 * cc) / 1e-12).toBeCloseTo(2.2, 1);
  });
});

describe('Razavi Ex 9.6 (Lec 5): CM level of a telescopic in closed loop', () => {
  it('VCM = Vb − (VGS3,4 − Vth1,2); swing ±(Vth − Vov) per side', async () => {
    const { closedLoopCmChoice } = await import('./opamps');
    const r = closedLoopCmChoice({ vb: 1.6, vgs34: 0.9, vth34: 0.7, vth12: 0.7 });
    expect(r.vcm).toBeCloseTo(1.4, 12);
    expect(r.floor).toBeCloseTo(0.9, 12);
    expect(r.peak).toBeCloseTo(0.5, 12); // Vth − Vov = 0.7 − 0.2
    expect(r.ppDiff).toBeCloseTo(2.0, 12);
  });
});
