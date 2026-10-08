/** The lab simulator must agree with the hand theory wherever the theory applies. */
import { describe, expect, it } from 'vitest';
import { EX_9_7, ex97, fiveTOtaQuiz, fiveTransistorOta, otaNetlist, pairNetlist, QUIZ1_C, SET_B, smallSignalGain, solveOp, steering, telescopicNetlist, sweep } from '.';

const rel = (a: number, b: number) => Math.abs(a - b) / Math.abs(b);

describe('five-transistor OTA (exam sizes)', () => {
  const { design } = fiveTOtaQuiz(QUIZ1_C);
  const base = { proc: SET_B, i1: QUIZ1_C.iRef, wl12: design.wl12, wl34: design.wl34, wl5: QUIZ1_C.wlTail };
  it('balanced: all saturated, gain ≈ gm1(rO2 ‖ rO4)', () => {
    const net = otaNetlist({ ...base, vin1: 1.1, vin2: 1.1 });
    const op = solveOp(net);
    expect(op.converged).toBe(true);
    for (const m of Object.values(op.mos)) expect(m.region, m.name).toBe('saturation');
    const g = smallSignalGain(net, op, 'out', (n, dv) => ({ ...n, fixed: { ...n.fixed, in1: 1.1 + dv / 2, in2: 1.1 - dv / 2 } }));
    const hand = fiveTransistorOta({ proc: SET_B, iss: QUIZ1_C.iRef, wl12: design.wl12, wl34: design.wl34, viss: 0.2 }).av;
    expect(rel(g, hand)).toBeLessThan(0.08);
  });
  it('the CM range ends where the fences say (M5 below, M1 above)', () => {
    const lo = solveOp(otaNetlist({ ...base, vin1: QUIZ1_C.vinCmMin - 0.08, vin2: QUIZ1_C.vinCmMin - 0.08 }));
    expect(lo.mos.M5.region).toBe('triode');
    const hi = solveOp(otaNetlist({ ...base, vin1: QUIZ1_C.vinCmMax + 0.08, vin2: QUIZ1_C.vinCmMax + 0.08 }));
    expect(hi.mos.M1.region).toBe('triode');
    const mid = solveOp(otaNetlist({ ...base, vin1: (QUIZ1_C.vinCmMin + QUIZ1_C.vinCmMax) / 2, vin2: (QUIZ1_C.vinCmMin + QUIZ1_C.vinCmMax) / 2 }));
    expect(Object.values(mid.mos).every((m) => m.region === 'saturation')).toBe(true);
  });
  it('buffer: output follows the input within the gain error', () => {
    const op = solveOp(otaNetlist({ ...base, vin1: 1.0, vin2: 0, buffer: true }));
    expect(Math.abs(op.v.out - 1.0)).toBeLessThan(0.02);
  });
  it('large vd drives the output to its rails (transfer curve saturates)', () => {
    const ops = sweep((x) => otaNetlist({ ...base, vin1: 1.1 + x / 2, vin2: 1.1 - x / 2 }), [-0.2, 0, 0.2]);
    expect(ops[0].v.out).toBeLessThan(0.6);
    expect(ops[2].v.out).toBeGreaterThan(1.5);
  });
});

describe('differential pair', () => {
  const pr = { kp: 200e-6, wl: 20, vth: 0.4, lambda: 0, vdd: 1.8, load: 'rd' as const, rd: 5e3, kpp: 100e-6, wlp: 20, vthp: 0.5, lambdap: 0.1, tail: 'ideal' as const, iss: 200e-6 };
  it('currents follow the steering law', () => {
    for (const vd of [0, 0.05, 0.15, 0.3]) {
      const op = solveOp(pairNetlist({ ...pr, vin1: 1.1 + vd / 2, vin2: 1.1 - vd / 2 }));
      const st = steering({ kp: 200e-6, wl: 20, iss: 200e-6, dvin: vd });
      expect(Math.abs(op.mos.M1.id - st.id1)).toBeLessThan(1e-6);
    }
  });
  it('Ad = gm·RD', () => {
    const net = pairNetlist({ ...pr, vin1: 1.1, vin2: 1.1 });
    const op = solveOp(net);
    const g = smallSignalGain(net, op, 'd2', (n, dv) => ({ ...n, fixed: { ...n.fixed, in1: 1.1 + dv / 2, in2: 1.1 - dv / 2 } })) * 2;
    expect(rel(g, Math.sqrt(2 * 200e-6 * 20 * 100e-6) * 5e3)).toBeLessThan(0.01);
  });
});

describe('telescopic (Razavi Ex 9.7) with ideal CMFB', () => {
  it('nominal bias: everything saturated and the gain is near the hand value', () => {
    const e = ex97();
    const p = { proc: EX_9_7, wlN: e.wlN, wlP: e.wlP, wl9: e.wl9, vbTail: 0.7 + 0.5, vinCm: e.vinCm + 0.05, vb1: e.vb1 + 0.05, vb2: e.vb2, voutCm: (e.voutMin + e.voutMax) / 2, vd: 0, iss: 3e-3 };
    const net = telescopicNetlist(p);
    const op = solveOp(net);
    expect(op.converged).toBe(true);
    for (const m of Object.values(op.mos)) expect(m.region, m.name).toBe('saturation');
    const g = smallSignalGain(net, op, 'o2', (_n, dv) => telescopicNetlist({ ...p, vd: dv })) - smallSignalGain(net, op, 'o1', (_n, dv) => telescopicNetlist({ ...p, vd: dv }));
    // Hand value uses Rup ≈ gm·rO·rO (drops the + rO terms, ~2% each at gm·rO ≈ 100); the simulator keeps them.
    expect(rel(g, e.av)).toBeLessThan(0.1);
  });
});

describe('folded cascode (PS1 P6) with ideal CMFB', () => {
  it('nominal bias: all saturated; gain near the hand value; input CM can go below ground', async () => {
    const { foldedCascodePmosInput, foldedNodes, foldedNetlist, SET_A, wlFromId, smallSignalGain: ssg, solveOp: so } = await import('.');
    const proc = SET_A, iss = 0.75e-3, i = 0.375e-3;
    const fc = foldedCascodePmosInput({ proc, iss, i, vov1: 0.3, vovNcas: 0.5, vovNsrc: 0.5, vovPcas: 0.5, vovPsrc: 0.5, viss: 0.4, cl: 2e-12 });
    const wl11 = wlFromId(iss, proc.kpp, 0.4);
    for (const vinCm of [0.6, -0.2]) {
      const n = foldedNodes({ proc, iss, i, wl1: fc.m1.wl, wl3: fc.m3.wl, wl5: fc.m5.wl, wl7: fc.m7.wl, wl9: fc.m9.wl, wl11, vinCm, vout: 1.5 });
      const args = { proc, wl1: fc.m1.wl, wl3: fc.m3.wl, wl5: fc.m5.wl, wl7: fc.m7.wl, wl9: fc.m9.wl, wl11, vb11: n.vb11, vb5: n.vb5, vbn: n.vbn + 0.05, vbp: n.vbp - 0.05, vinCm, vd: 0, voutCm: 1.5, iss, i };
      const net = foldedNetlist(args);
      const op = so(net);
      expect(op.converged).toBe(true);
      for (const m of Object.values(op.mos)) expect(m.region, `${vinCm}: ${m.name}`).toBe('saturation');
      if (vinCm === 0.6) {
        const g = ssg(net, op, 'o1', (_n, dv) => foldedNetlist({ ...args, vd: dv })) - ssg(net, op, 'o2', (_n, dv) => foldedNetlist({ ...args, vd: dv }));
        // λ also lowers the Vov needed for the design current (gm a few % higher than 2ID/Vov,design).
        expect(Math.abs(Math.abs(g) - fc.av) / fc.av).toBeLessThan(0.1);
      }
    }
  });
});
