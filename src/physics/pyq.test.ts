/**
 * Past papers against their official keys. Where the key slips, the expected value here is the correct one
 * and the comment says what the key printed.
 */
import { describe, expect, it } from 'vitest';
import {
  mid23Q3, mid23Q5, mid24Q2, mid24Q3, mid24Q4, mid25Q1, mid25Q2, mid25Q5, mid25Q5b, quiz23Q2, quiz24bQ1, quiz24bQ2, quiz24Q1, quiz24Q2,
  tut24Ex1, tut24Ex2, tut24Ex3, tut24Ex4, tut24Ex56, tut5Q1, tut5Q3,
} from '.';

const near = (a: number, b: number, rel = 0.02) => expect(Math.abs(a - b) / Math.abs(b)).toBeLessThan(rel);

describe('2025-26 mid-sem', () => {
  it('Q1 gain boosting (key: 0.786 V, 1.678 V, 1.522 V, −52 V/V)', () => {
    const r = mid25Q1();
    near(r.vx, 0.786, 0.002); near(r.vp, 1.678, 0.002); near(r.swing, 1.522, 0.003); near(r.av, -52, 0.01);
  });
  it('Q2 Miller design (key: 1.1 pF, 55 µA, 7.21, 35.81, 16.08, 359.38, 80.69)', () => {
    const r = mid25Q2();
    near(r.cc, 1.1e-12, 0.001); near(r.i5, 55e-6, 0.001); near(r.wl1, 7.21, 0.01); near(r.wl3, 35.81, 0.01);
    near(r.wl5, 16.08, 0.02); near(r.wl7, 359.38, 0.02); near(r.wl8, 80.69, 0.03);
  });
  it('Q4 = Tutorial 5 Q1 (key: 49.38, Vb1 1.187 V, swing 1.412 V)', () => {
    const r = tut5Q1();
    near(r.wlExact, 49.38, 0.001); near(r.vb1, 1.187, 0.003); near(r.diffSwing, 1.412, 0.01);
  });
  it('Q5 PM (key: 3.84°, 4.53°, 38.94°)', () => {
    near(mid25Q5(2).pm, 3.84, 0.01); near(mid25Q5(4).pm, 4.53, 0.01); near(mid25Q5b(), 38.94, 0.002);
  });
});

describe('2024-25 mid-sem', () => {
  it('Q1 = Tutorial 5 Q3 (key: Ad 47.28, ACM 0.5, VO,CM 0.97, ACM,req 0.031, CMRR 94.56)', () => {
    const r = tut5Q3();
    near(r.ad, 47.28); near(r.acm, 0.5, 0.01); near(r.vocm, 0.97, 0.01); near(r.acmTarget, 0.031, 0.02); near(r.cmrr, 94.56, 0.02);
    // The key's loop gain (55.7) uses gm10 = 0.316 mS; √(2·100µ·50·100µ) is 1 mS, which gives ≈ 17.6.
    near(r.loop, 17.6, 0.05);
  });
  it('Q2 Miller analysis (key: 90.9 V/µs, 72.34 MHz, 1555, 46.5 kHz, 178 MHz, 810 MHz)', () => {
    const r = mid24Q2();
    near(r.sr, 90.9e6, 0.001); near(r.gbw, 72.34e6, 0.001); near(r.a0, 1555.3, 0.02); near(r.bw, 46.5e3, 0.02);
    near(r.fp2, 178.25e6, 0.02); near(r.fz, 810.24e6, 0.02);
    // The key prints 61.78°, having typed 75.34 MHz for the 72.34 MHz GBW in the arctangents.
    near(r.pm, 62.8, 0.01);
  });
  it('Q3 telescopic (key: 2222 V/V, 1.2 V, 0.6 V, buffer 0.9–1.2 V)', () => {
    const r = mid24Q3();
    near(r.av, 2222.2, 0.001); near(r.voutMax, 1.2, 0.001); near(r.voutMin, 0.6, 0.001); near(r.bufMin, 0.9, 0.001);
  });
  it('Q4 boosted Rout (key: Aaux 1666.67, Rout 333.3 GΩ, Vb2,min 0.6 V)', () => {
    const r = mid24Q4();
    near(r.aAux, 1666.67, 0.001); near(r.rout, 333.3e9, 0.001); near(r.vb2Min, 0.6, 0.001);
  });
});

describe('2023-24 mid-sem', () => {
  it('Q3 high-swing telescopic (key: 22.67, 22.22, 0.6 V, 0.88 V, 1.3 V, 1921)', () => {
    const r = mid23Q3();
    near(r.wlP, 22.67, 0.01); near(r.wlN, 22.22, 0.001); near(r.vb1Min, 0.6, 0.001); near(r.vb2Max, 0.88, 0.005);
    near(r.vb3, 1.3, 0.005); near(r.av, 1921, 0.01);
  });
  it('Q5 (key: K 1.183, Cc ≥ 0.122 CL)', () => {
    const r = mid23Q5();
    near(r.k, 1.183, 0.001); near(r.ccOverCl, 0.122, 0.005);
  });
});

describe('quizzes', () => {
  it('2024-25 Quiz 1 (key: 61.25, 1.18 V, 1.47 V, 0.79 V, 108 µW; 10 µA, 159.15 kHz, 13.77 MHz, 54 µW)', () => {
    const a = quiz24Q1();
    near(a.av, 61.25, 0.002); near(a.swing, 1.18, 0.01); near(a.vinCmMax, 1.47, 0.005); near(a.vinCmMin, 0.79, 0.01); near(a.power, 108e-6, 0.001);
    const b = quiz24Q2();
    near(b.i1, 10e-6, 0.001); near(b.bw, 159.15e3, 0.002); near(b.gbw, 13.77e6, 0.003); near(b.power, 54e-6, 0.001);
  });
  it('2024-25 Quiz 2 (key: 159 MHz, 75°, 1.16 pF; 0.9 V, 1 V, 0.03)', () => {
    const a = quiz24bQ1();
    near(a.gbw, 159e6, 0.001); near(a.pm, 75, 0.005); near(a.cc, 1.16e-12, 0.01);
    const b = quiz24bQ2();
    near(b.vref, 0.9, 0.001); near(b.vinCm, 1.0, 0.001); near(b.acmReq, 0.03, 0.001);
  });
  it('2023-24 Quiz 1 Q2 (key: 0.6 V, 3 V (3.15), 4.8 V, 0.6 V, 2.4 V, 833.33; then 3.05 V, 4.4 V)', () => {
    const a = quiz23Q2();
    near(a.vinCmMin, 0.6, 0.001); near(a.vinCmMaxCalc, 3.15, 0.001); near(a.swing, 4.8, 0.001); near(a.vb1Min, 0.6, 0.001);
    near(a.vb2Max, 2.4, 0.001); near(a.av, 833.33, 0.001);
    const b = quiz23Q2(-0.1, 0.1);
    near(b.vinCmMaxCalc, 3.05, 0.001); near(b.swing, 4.4, 0.001);
  });
});

describe('2024-25 Tutorial 2 (stability)', () => {
  it('Ex 1–6', () => {
    near(tut24Ex1(0.01).fClosed, 100.1e3, 0.001); near(tut24Ex1(1).fClosed, 10e6, 0.001);
    const e2 = tut24Ex2();
    near(e2.betaCoincide, 0.245, 0.002); near(e2.betaFlat, 0.5, 0.001); near(e2.gainFlat, 1.96, 0.002);
    const e3 = tut24Ex3();
    near(e3.f1, 10e3, 0.001); near(e3.pm, 90.06, 0.001);
    near(tut24Ex4(30), 1.932, 0.001); near(tut24Ex4(60), 1, 0.001); near(tut24Ex4(90), 0.7071, 0.001);
    const e5 = tut24Ex56();
    near(e5.fD, 100, 0.001); near(e5.fp1New, 1e3, 0.001); near(e5.capFactor, 1000, 0.001);
  });
});
