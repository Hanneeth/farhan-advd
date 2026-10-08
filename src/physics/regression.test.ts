/**
 * CLAUDE.md §11 regression table — answers verified in the tutoring conversation, the quiz keys
 * and Razavi. `near(x, expected, relTol)` checks agreement to rounding.
 */
import { describe, expect, it } from 'vitest';
import {
  QUIZ1_A,
  QUIZ1_B,
  QUIZ1_C,
  QUIZ2_A,
  QUIZ2_B,
  QUIZ2_C,
  ex91,
  ex92,
  ex97,
  fiveTOtaQuiz,
  part1WE1,
  part1WE2,
  part1WE3,
  ps1P1,
  ps1P10,
  ps1P2,
  ps1P3,
  ps1P4,
  ps1P5,
  ps1P6,
  ps1P9,
  quiz2,
  tut1Q1,
  tut1Q2,
  tut1Q3,
  tut1Q4,
  tut1Q5,
} from './solvers';

function near(actual: number, expected: number, relTol = 0.005) {
  const tol = Math.max(Math.abs(expected) * relTol, 1e-12);
  expect(Math.abs(actual - expected), `got ${actual}, expected ${expected}`).toBeLessThanOrEqual(tol);
}

const k = 1e3, u = 1e-6, m = 1e-3, M = 1e6, G = 1e9;

describe('Part 1 worked examples', () => {
  it('WE1', () => {
    const r = part1WE1();
    near(r.vov, 0.3);
    near(r.id, 90 * u);
    near(r.vd, 0.9);
    expect(r.saturated).toBe(true);
    near(r.gm, 0.6 * m);
    near(r.rO, 111.1 * k, 0.001);
    near(r.gmrO, 66.7, 0.001);
    near(r.av, -5.5, 0.002);
    near(r.avNoRo, -6);
  });
  it('WE2 (design)', () => {
    const r = part1WE2();
    near(r.wl, 22.2, 0.002);
    near(r.vg, 0.5);
    near(r.rd, 9 * k);
  });
  it('WE3 (PMOS)', () => {
    const r = part1WE3();
    near(r.vov, 0.4);
    near(r.id, 160 * u);
    near(r.vd, 0.8);
    expect(r.saturated).toBe(true);
  });
});

describe('Tutorial 1', () => {
  it('Q1', () => {
    const r = tut1Q1();
    near(r.rd, 9 * k);
    near(r.wl12, 22.22, 0.001);
    near(r.wl3, 44.44, 0.001);
    near(r.wl4, 22.22, 0.001);
    near(r.r, 13 * k);
    near(r.cmirMin, -0.25);
    near(r.cmirMax, 0.35);
  });
  it('Q2', () => near(tut1Q2().ratio, 25));
  it('Q3', () => {
    const r = tut1Q3();
    near(r.wl12, 12.5);
    near(r.wl34, 50);
    near(r.ad, 18);
  });
  it('Q4', () => {
    const r = tut1Q4();
    near(r.vcm, 2.33, 0.002);
    near(r.rd, 5.06 * k, 0.002);
    near(r.vd, 2.47, 0.002);
    near(r.acm, -1.92, 0.003);
    near(r.dvcm, 0.29, 0.02);
  });
  it('Q5', () => {
    const r = tut1Q5();
    near(r.i, 250 * u);
    near(r.check, 20);
  });
});

describe('Exam Q1 = Quiz 1 Part C (5-T OTA)', () => {
  const { design, ota } = fiveTOtaQuiz(QUIZ1_C);
  it('(a) sizes', () => {
    near(design.wl34, 19.2);
    near(design.wl12, 26.67, 0.001);
  });
  it('(b) gain', () => near(ota.av, 88.9, 0.001));
  it('(c) swing', () => {
    near(ota.voutMin, 0.35);
    near(ota.voutMax, 1.55);
    near(ota.swing, 1.2);
  });
  it('(d) f−3dB', () => near(ota.f3dB!, 358e3, 0.002));
  it('(e) buffer bandwidth: 1/gm → 31.8 MHz; quiz key also accepts 31.95 (1/gm ‖ rO4) and 32.19 (exact)', () => {
    near(ota.bufferF3dB!, 31.8e6, 0.002);
    near(ota.bufferF3dBExact!, 32.19e6, 0.002);
  });
  it('slew rate ISS/CL', () => near(ota.slewRate!, 30e6)); // 30 V/µs
});

describe('Quiz 1 Parts A and B (same method, different numbers)', () => {
  it('Part A', () => {
    const { design, ota } = fiveTOtaQuiz(QUIZ1_A);
    near(design.vov5, 0.2);
    near(design.wl12, 80);
    near(design.wl34, 71.11, 0.001);
    near(ota.av, 133.33, 0.001);
    near(ota.swing, 1.35);
    near(ota.f3dB!, 636.64e3, 0.002);
    near(ota.bufferF3dBExact!, 85.52e6, 0.002);
  });
  it('Part B (key rounds gm to 1.33 mS, giving 88.67)', () => {
    const { design, ota } = fiveTOtaQuiz(QUIZ1_B);
    near(design.vov5, 0.25);
    near(design.wl12, 44.44, 0.001);
    near(design.wl34, 50);
    near(ota.av, 88.67, 0.005);
    near(ota.swing, 1.2);
    near(ota.f3dB!, 1.19e6, 0.005);
  });
});

describe('Razavi examples', () => {
  it('Ex 9.1', () => {
    near(ex91().exact, 990);
    near(ex91().approx, 1000);
  });
  it('Ex 9.2', () => {
    near(ex92().omegaU, 9.21 * G, 0.001);
    near(ex92().fu, 1.466 * G, 0.002);
  });
  it('Ex 9.7', () => {
    const r = ex97();
    near(r.wlN, 1250);
    near(r.wlP, 1111, 0.001);
    near(r.wl9, 400);
    // ≈1.4×10³. The exact square-law value is 1429; Razavi prints 1416 (no working shown) and the
    // lecture notes 1428. All three agree to 1%; the app shows 1429 and cites the book's 1416.
    near(r.av, 1428.6, 0.001);
    near(r.av, 1416, 0.01);
    near(r.avLengthened, 4000, 0.001);
    near(r.vinCm, 1.4);
    near(r.vb1, 1.6);
    near(r.vb2, 1.7);
    near(r.voutMin, 0.9);
    near(r.voutMax, 2.4);
  });
});

describe('Problem Set 1', () => {
  it('P1', () => {
    const r = ps1P1();
    near(r.av, 84.3, 0.002);
    near(r.vinCmMin, 0.874, 0.002);
    near(r.vinCmMax, 1.417, 0.002);
    near(r.voutMin, 0.474, 0.002);
    near(r.voutMax, 1.517, 0.002);
    near(r.f3dB!, 1.19e6, 0.005);
    near(r.bufferF3dB!, 100.7e6, 0.002);
  });
  it('P2', () => {
    const r = ps1P2();
    near(r.eps, 0.056, 0.01);
    near(r.aMin, 1000);
    near(r.tau, 7.9e-9, 0.005);
    near(r.t, 54.6e-9, 0.005);
  });
  it('P3', () => {
    const r = ps1P3();
    near(r.av, 854, 0.002);
    near(r.diffSwing, 2.66, 0.002);
    near(r.bias.vinCm, 1.373, 0.001);
    near(r.bias.vb1, 1.646, 0.001);
    near(r.bias.vb2, 1.478, 0.001);
  });
  it('P4', () => {
    const r = ps1P4();
    near(r.vx, 0.673, 0.002);
    near(r.dVb1, 0.227, 0.005);
    near(r.vb1New, 1.873, 0.001);
    near(r.dSwing, -0.454, 0.005);
  });
  it('P5', () => {
    const r = ps1P5();
    near(r.vx, 0.707, 0.002);
    near(r.voutMin, 0.9);
    near(r.voutMax, 1.478, 0.001);
    near(r.buffer.lower, 0.9);
    near(r.buffer.upper, 1.407, 0.001);
    near(r.buffer.width, 0.507, 0.002);
  });
  it('P6', () => {
    const r = ps1P6();
    near(r.idSrc, 0.75 * m);
    near(r.m3.wl, 22.3, 0.003);
    near(r.m5.wl, 44.7, 0.003);
    near(r.m7.wl, 78.2, 0.002);
    near(r.m9.wl, 78.2, 0.002);
    near(r.m1.wl, 217, 0.002);
    near(r.av, 333, 0.002);
    near(r.omegaU!, 1.25 * G);
  });
  it('P7', () => {
    const r = ps1P6();
    near(r.fraction, 0.911, 0.002);
    near(r.avExact, 304, 0.003);
  });
  it('P8', () => {
    const r = ps1P6();
    near(r.vinCmMin, -0.3);
    near(r.vinCmMax!, 1.5);
    near(r.voutMin, 1.0);
    near(r.voutMax, 2.0);
  });
  it('P9', () => {
    const r = ps1P9();
    near(r.alpha, 4);
    near(r.power, 18 * m);
    near(r.wl12, 869, 0.002);
  });
  it('P10', () => {
    const r = ps1P10();
    near(r.gmReq, 0.69 * m, 0.005);
    near(r.vovEach, 0.3);
    near(r.rout, 3.3 * M, 0.02);
    near(r.av, 2300, 0.01);
    near(r.power, 0.72 * m);
  });
});

describe('Quiz 2 (triode-sensing CMFB) — key rounds intermediates to 2 decimals', () => {
  it('Part A', () => {
    const r = quiz2(QUIZ2_A);
    near(r.vd4, 1.16, 0.002);
    near(r.vp, 0.11, 0.01);
    near(r.wl1112, 3.63, 0.01);
    near(r.voutMin, 0.29, 0.01);
    near(r.routDown, 55.63 * M, 0.01);
  });
  it('Part B', () => {
    const r = quiz2(QUIZ2_B);
    near(r.vd4, 1.08, 0.005);
    near(r.vp, 0.07, 0.015);
    near(r.wl1112, 7.0, 0.015);
    near(r.routDown, 30.8 * M, 0.01);
  });
  it('Part C', () => {
    const r = quiz2(QUIZ2_C);
    near(r.vd4, 1.09, 0.002);
    near(r.vp, 0.12, 0.01);
    near(r.wl1112, 9.92, 0.01);
    near(r.voutMin, 0.38, 0.005);
    near(r.routDown, 25.66 * M, 0.01);
  });
});
