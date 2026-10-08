/** Whole-circuit DC solves: every device's region follows from its fence. */
import { describe, expect, it } from 'vitest';
import { cascodeNodes, diffPairNodes, fiveTNodes, telescopicNodes } from './nodes';
import { EX_9_7, SET_B } from './process';
import { ex97, fiveTOtaQuiz, QUIZ1_C, tut1Q1 } from './solvers';
import { regionFromNodesPure } from './nodes.helpers';

const regions = (devs: Record<string, { kind: 'n' | 'p'; vg: number; vs: number; vd: number; vth: number }>) =>
  Object.fromEntries(Object.entries(devs).map(([k, d]) => [k, regionFromNodesPure(d)]));

describe('telescopic nodes (Razavi Ex 9.7)', () => {
  const e = ex97();
  const base = { proc: EX_9_7, iss: 3e-3, wlN: e.wlN, wlP: e.wlP, wl9: e.wl9, vinCm: e.vinCm, vb1: e.vb1, vb2: e.vb2, vout: 1.65 };
  it('reproduces the book bias: VP = 0.5, VX = 0.7, VY = 2.7', () => {
    const n = telescopicNodes(base);
    expect(n.vP).toBeCloseTo(0.5, 6);
    expect(n.vX).toBeCloseTo(0.7, 6);
    expect(n.vY).toBeCloseTo(2.7, 6);
  });
  it('all nine saturated at mid swing', () => {
    expect(Object.values(regions(telescopicNodes(base).devices)).every((r) => r === 'saturation')).toBe(true);
  });
  it('output below Vout,min = 0.9 V pushes M3/M4 into triode first', () => {
    const r = regions(telescopicNodes({ ...base, vout: 0.85 }).devices);
    expect(r.m3).toBe('triode');
    expect(r.m1).toBe('saturation');
  });
  it('Vb1 too low starves M1/M2 (they go triode)', () => {
    const r = regions(telescopicNodes({ ...base, vb1: 1.5 }).devices);
    expect(r.m1).toBe('triode');
  });
});

describe('5-T OTA nodes (exam question)', () => {
  const { design, ota } = fiveTOtaQuiz(QUIZ1_C);
  const base = { proc: SET_B, iss: QUIZ1_C.iRef, wl12: design.wl12, wl34: design.wl34, wlTail: QUIZ1_C.wlTail, vinCm: 1.1 };
  it('balanced: output sits at the diode node VDD − |VGS3|', () => {
    const n = fiveTNodes(base);
    expect(n.vOut).toBeCloseTo(SET_B.vdd - ota.vgs3, 9);
    expect(Object.values(regions(n.devices)).every((r) => r === 'saturation')).toBe(true);
  });
  it('the CM limits are exactly the fence edges', () => {
    const lo = fiveTNodes({ ...base, vinCm: QUIZ1_C.vinCmMin });
    expect(lo.devices.m5.vd - lo.devices.m5.vs).toBeCloseTo(lo.vov5, 9);
    const hi = fiveTNodes({ ...base, vinCm: QUIZ1_C.vinCmMax });
    expect(hi.devices.m1.vd).toBeCloseTo(hi.devices.m1.vg - SET_B.vthn, 9);
    expect(regions(fiveTNodes({ ...base, vinCm: QUIZ1_C.vinCmMin - 0.05 }).devices).m5).toBe('triode');
    expect(regions(fiveTNodes({ ...base, vinCm: QUIZ1_C.vinCmMax + 0.05 }).devices).m1).toBe('triode');
  });
});

describe('diff pair nodes (Tutorial 1 Q1)', () => {
  const q = tut1Q1();
  const base = { kp: 400e-6, wl: q.wl12, vth: 0.35, vdd: 0.9, vss: -0.9, iss: 0.2e-3, rd: q.rd, vin1: 0, vin2: 0, wlTail: q.wl3 };
  it('balanced: drains at 0 V, tail node at −0.5 V', () => {
    const n = diffPairNodes(base);
    expect(n.vD1).toBeCloseTo(0, 9);
    expect(n.vP).toBeCloseTo(-0.5, 9);
    expect(Object.values(regions(n.devices)).every((r) => r === 'saturation')).toBe(true);
  });
  it('CMIR edges: −0.25 V (tail fence) and +0.35 V (M1 fence)', () => {
    expect(regions(diffPairNodes({ ...base, vin1: -0.26, vin2: -0.26 }).devices).m3).toBe('triode');
    expect(regions(diffPairNodes({ ...base, vin1: -0.24, vin2: -0.24 }).devices).m3).toBe('saturation');
    expect(regions(diffPairNodes({ ...base, vin1: 0.36, vin2: 0.36 }).devices).m1).toBe('triode');
    expect(regions(diffPairNodes({ ...base, vin1: 0.34, vin2: 0.34 }).devices).m1).toBe('saturation');
  });
});

describe('cascode nodes', () => {
  it('VX = Vb1 − VGS2, and a too-low Vb1 pushes M1 into triode', () => {
    const base = { proc: SET_B, id: 100e-6, wl1: 20, wl2: 20, vb1: 1.0, vout: 1.2, load: 'current' as const };
    const n = cascodeNodes(base);
    expect(n.vX).toBeCloseTo(1.0 - (0.4 + Math.sqrt((2 * 100e-6) / (200e-6 * 20))), 9);
    expect(Object.values(regions(n.devices)).every((r) => r === 'saturation')).toBe(true);
    expect(regions(cascodeNodes({ ...base, vb1: 0.7 }).devices).m1).toBe('triode');
  });
});

import { foldedNodes, mirrorTeleNodes, twoStageNodes } from './nodes';
import { SET_A } from './process';
import { ps1P6, tut3Q1, tut3Q2 } from './solvers';

describe('folded cascode nodes (Problem Set 1 P6/P8)', () => {
  const d = ps1P6();
  const wl11 = (2 * 0.75e-3) / (SET_A.kpp * 0.4 * 0.4);
  const base = { proc: SET_A, iss: 0.75e-3, i: 0.375e-3, wl1: d.m1.wl, wl3: d.m3.wl, wl5: d.m5.wl, wl7: d.m7.wl, wl9: d.m9.wl, wl11, vinCm: 0.6, vout: 1.5 };
  it('X sits at Vov5 = 0.5 V; all eleven saturated at mid swing', () => {
    const n = foldedNodes(base);
    expect(n.vX).toBeCloseTo(0.5, 9);
    expect(Object.values(regions(n.devices)).every((r) => r === 'saturation')).toBe(true);
  });
  it('input CM limits: −0.3 V (M1 fence) and 1.5 V (tail headroom 0.4 V)', () => {
    expect(regions(foldedNodes({ ...base, vinCm: -0.31 }).devices).m1).toBe('triode');
    expect(regions(foldedNodes({ ...base, vinCm: -0.29 }).devices).m1).toBe('saturation');
    expect(regions(foldedNodes({ ...base, vinCm: 1.51 }).devices).m11).toBe('triode');
    expect(regions(foldedNodes({ ...base, vinCm: 1.49 }).devices).m11).toBe('saturation');
  });
  it('output range 1.0–2.0 V', () => {
    expect(regions(foldedNodes({ ...base, vout: 0.99 }).devices).m3).toBe('triode');
    expect(regions(foldedNodes({ ...base, vout: 2.01 }).devices).m7).toBe('triode');
  });
});

describe('mirror-loaded telescopic nodes (PS1 P5, Tut 3 Q1)', () => {
  it('P5: VX = 0.707 V and output 0.900–1.478 V; buffer window ends at 1.407 V', () => {
    const base = { proc: SET_A, iss: 1e-3, wlN: 200, wlP: 200, vinCm: 1.2, vb1: 1.6, vout: 1.2, bias: 'diodes' as const };
    const n = mirrorTeleNodes(base);
    expect(n.vX).toBeCloseTo(0.707, 3);
    // FLAG (content/inventory.md): with (W/L)5–8 = 200 the diode stack puts M3's drain at 0.678 V < VX,
    // so M3 is NOT saturated in P5 as posed. Everything else is.
    expect(n.vD3).toBeCloseTo(0.678, 3);
    const r = regions(n.devices);
    expect(r.m3).toBe('triode');
    expect(Object.entries(r).filter(([k]) => k !== 'm3').every(([, v]) => v === 'saturation')).toBe(true);
    // Wide enough PMOS (W/L ≥ 417) fixes it:
    expect(regions(mirrorTeleNodes({ ...base, wlP: 420 }).devices).m3).toBe('saturation');
    expect(regions(mirrorTeleNodes({ ...base, vout: 0.89 }).devices).m4).toBe('triode');
    expect(regions(mirrorTeleNodes({ ...base, vout: 1.49 }).devices).m6).toBe('triode');
    expect(regions(mirrorTeleNodes({ ...base, vout: 1.4, buffer: true }).devices).m2).toBe('saturation');
    expect(regions(mirrorTeleNodes({ ...base, vout: 1.42, buffer: true }).devices).m2).toBe('triode');
  });
  it('Tut 3 Q1: VX (left output) = 1.839 V with Vb2 inside 1.039–1.478 V', () => {
    const q = tut3Q1();
    const n = mirrorTeleNodes({ proc: SET_A, iss: 1e-3, wlN: 200, wlP: 200, vinCm: 1.2, vb1: 1.7, vout: 1.3, bias: 'vb2', vb2: 1.2 });
    expect(n.vD3).toBeCloseTo(q.vx, 3);
    expect(Object.values(regions(n.devices)).every((r) => r === 'saturation')).toBe(true);
    expect(regions(mirrorTeleNodes({ proc: SET_A, iss: 1e-3, wlN: 200, wlP: 200, vinCm: 1.2, vb1: 1.7, vout: 1.3, bias: 'vb2', vb2: q.vb2Min - 0.02 }).devices).m5).toBe('triode');
    expect(regions(mirrorTeleNodes({ proc: SET_A, iss: 1e-3, wlN: 200, wlP: 200, vinCm: 1.2, vb1: 1.7, vout: 1.3, bias: 'vb2', vb2: q.vb2Max + 0.02 }).devices).m7).toBe('triode');
  });
});

describe('two-stage nodes (Tut 3 Q2)', () => {
  it('X, Y at 1.689 V; M1 leaves saturation above Vin,CM = 2.389 V', () => {
    const q = tut3Q2();
    const n = twoStageNodes({ proc: SET_A, iss: 1e-3, id2: 1e-3, wl: 200, vinCm: 1.5, vout: 1.5 });
    expect(n.vXY).toBeCloseTo(q.vxy, 6);
    expect(Object.values(regions(n.devices)).every((r) => r === 'saturation')).toBe(true);
    expect(regions(twoStageNodes({ proc: SET_A, iss: 1e-3, id2: 1e-3, wl: 200, vinCm: q.vinCmMax + 0.01, vout: 1.5 }).devices).m1).toBe('triode');
  });
});
