import { describe, expect, it } from 'vitest';
import {
  drainCurrent,
  gmFromId,
  gmFromIdVov,
  gmFromVov,
  idSat,
  idTriode,
  intrinsicGain,
  lambdaAtLength,
  nmosSaturated,
  overdrive,
  pmosSaturated,
  region,
  rO,
  rOTriode,
  ronDeepTriode,
  vovFromId,
  wlFromId,
} from './device';
import { currentDivider, parallel, rDiode, rIntoDrain, rIntoSource } from './impedance';

describe('square law', () => {
  it('regions from Vov and VDS', () => {
    expect(region(-0.1, 1)).toBe('off');
    expect(region(0, 1)).toBe('off');
    expect(region(0.3, 0.2)).toBe('triode');
    expect(region(0.3, 0.3)).toBe('saturation'); // boundary belongs to saturation
    expect(region(0.3, 1)).toBe('saturation');
  });

  it('triode and saturation meet at VDS = Vov when λ = 0', () => {
    const kp = 200e-6, wl = 10, vov = 0.3;
    expect(idTriode(kp, wl, vov, vov)).toBeCloseTo(idSat(kp, wl, vov), 15);
    expect(drainCurrent(kp, wl, vov, vov - 1e-9)).toBeCloseTo(drainCurrent(kp, wl, vov, vov), 12);
  });

  it('λ = 0 gives infinite rO and a flat saturation curve', () => {
    expect(rO(0, 1e-3)).toBe(Infinity);
    expect(idSat(200e-6, 10, 0.3, 0, 1.5)).toBe(idSat(200e-6, 10, 0.3, 0, 0.5));
  });

  it('forgetting the ½ doubles the current (mistake guard)', () => {
    expect(idSat(200e-6, 10, 0.3)).toBeCloseTo(90e-6, 12);
  });

  it('the three faces of gm agree', () => {
    const kp = 200e-6, wl = 10, vov = 0.3;
    const id = idSat(kp, wl, vov);
    expect(gmFromVov(kp, wl, vov)).toBeCloseTo(0.6e-3, 12);
    expect(gmFromId(kp, wl, id)).toBeCloseTo(0.6e-3, 12);
    expect(gmFromIdVov(id, vov)).toBeCloseTo(0.6e-3, 12);
  });

  it('bridge equation both directions', () => {
    const id = 100e-6, kp = 400e-6, vov = 0.15;
    const wl = wlFromId(id, kp, vov);
    expect(wl).toBeCloseTo(22.222, 3);
    expect(vovFromId(id, kp, wl)).toBeCloseTo(vov, 12);
  });

  it('intrinsic gain is independent of current', () => {
    const lambda = 0.1, vov = 0.3;
    for (const id of [10e-6, 100e-6, 1e-3]) {
      expect(gmFromIdVov(id, vov) * rO(lambda, id)).toBeCloseTo(intrinsicGain(lambda, vov), 9);
    }
  });

  it('PMOS uses magnitudes: |VGS| = VS − VG', () => {
    const vov = overdrive(1.8 - 0.9, 0.5);
    expect(vov).toBeCloseTo(0.4, 12);
    expect(idSat(100e-6, 20, vov)).toBeCloseTo(160e-6, 12);
  });

  it('fences', () => {
    expect(nmosSaturated(0.9, 0.7, 0.4)).toBe(true);
    expect(nmosSaturated(0.29, 0.7, 0.4)).toBe(false);
    expect(nmosSaturated(0.3, 0.7, 0.4)).toBe(true); // exactly on the fence
    expect(pmosSaturated(0.8, 0.9, 0.5)).toBe(true);
    expect(pmosSaturated(1.41, 0.9, 0.5)).toBe(false);
  });

  it('λ ∝ 1/L', () => {
    expect(lambdaAtLength(0.2, 0.5e-6, 1e-6)).toBeCloseTo(0.1, 12);
  });

  it('triode small-signal parameters (Razavi 9.1a)', () => {
    // deep triode: rO,triode → Ron as VDS → 0
    expect(rOTriode(100e-6, 10, 0.5, 0)).toBeCloseTo(ronDeepTriode(100e-6, 10, 0.5), 9);
  });
});

describe('impedance rules', () => {
  it('parallel: smallest wins, Infinity drops out', () => {
    expect(parallel(10e3, 10e3)).toBeCloseTo(5e3, 9);
    expect(parallel(1e6, 20e3)).toBeCloseTo(19.6e3, -2);
    expect(parallel(10e3, Infinity)).toBe(10e3);
    expect(parallel(Infinity, Infinity)).toBe(Infinity);
  });

  it('into the drain: rO, and gm·rO·RS when degenerated', () => {
    expect(rIntoDrain({ gm: 1e-3, rO: 20e3 })).toBe(20e3);
    expect(rIntoDrain({ gm: 1e-3, rO: 20e3, rs: 20e3 })).toBe(20e3 + 21 * 20e3); // 440 kΩ (Worked Example 12)
  });

  it('into the source: 1/gm, + RD/(gm rO), ∞ with an ideal current-source load', () => {
    expect(rIntoSource({ gm: 1e-3 })).toBeCloseTo(1e3, 9);
    expect(rIntoSource({ gm: 1e-3, rO: 20e3, rd: 0 })).toBeCloseTo(20e3 / 21, 6);
    expect(rIntoSource({ gm: 1e-3, rO: 20e3, rd: Infinity })).toBe(Infinity);
  });

  it('diode is 1/gm ‖ rO', () => {
    expect(rDiode(1e-3)).toBeCloseTo(1e3, 9);
  });

  it('current divider crosses over', () => {
    expect(currentDivider(1, 1e3, 9e3)).toBeCloseTo(0.9, 12);
  });
});

describe('solveNmosRd', () => {
  it('saturated case is WE1', async () => {
    const { solveNmosRd } = await import('./device');
    const r = solveNmosRd({ vdd: 1.8, vg: 0.7, vth: 0.4, kp: 200e-6, wl: 10, rd: 10e3 });
    expect(r.region).toBe('saturation');
    expect(r.vd).toBeCloseTo(0.9, 12);
  });
  it('triode case satisfies both the triode equation and KVL', async () => {
    const { solveNmosRd, idTriode } = await import('./device');
    const p = { vdd: 1.8, vg: 0.9, vth: 0.4, kp: 200e-6, wl: 10, rd: 20e3 };
    const r = solveNmosRd(p);
    expect(r.region).toBe('triode');
    expect(r.vd).toBeLessThan(r.vov);
    expect(r.id).toBeCloseTo(idTriode(p.kp, p.wl, r.vov, r.vd), 12);
    expect(p.vdd - r.id * p.rd).toBeCloseTo(r.vd, 12);
  });
  it('off case', async () => {
    const { solveNmosRd } = await import('./device');
    expect(solveNmosRd({ vdd: 1.8, vg: 0.3, vth: 0.4, kp: 200e-6, wl: 10, rd: 10e3 }).region).toBe('off');
  });
});
