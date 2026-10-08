import { describe, expect, it } from 'vitest';
import { closedLoopPole, db, singlePoleMag, slewTime, stepResponse, stepWithSlew, unityGainFrequency } from './frequency';

describe('frequency helpers', () => {
  it('db: 1000 V/V = 60 dB', () => expect(db(1000)).toBeCloseTo(60, 9));
  it('single pole is 3 dB down at ω0 and crosses 1 at ≈ A0·ω0', () => {
    expect(db(singlePoleMag(1000, 1e6, 1e6))).toBeCloseTo(60 - 3.0103, 3);
    expect(singlePoleMag(1000, 1e6, unityGainFrequency(1000, 1e6))).toBeCloseTo(1, 3);
  });
  it('closed loop keeps GBW: gain × pole = A0·ω0', () => {
    const c = closedLoopPole(1000, 1e6, 0.1);
    expect(c.gain * c.omega).toBeCloseTo(1000 * 1e6, 3);
  });
  it('small step: no slewing, identical to the exponential', () => {
    expect(slewTime(0.1, 1e-9, 1e9)).toBe(0);
    expect(stepWithSlew(0.1, 1e-9, 1e9, 2e-9)).toBeCloseTo(stepResponse(0.1, 1e-9, 2e-9), 12);
  });
  it('big step: ramps at SR, then settles; continuous with matching slope at the hand-over', () => {
    const v = 1, tau = 10e-9, sr = 20e6; // linear slope would be 1e8 V/s > SR
    const ts = slewTime(v, tau, sr);
    expect(ts).toBeCloseTo((1 - 0.2) / 20e6, 15);
    const h = 1e-13;
    expect(stepWithSlew(v, tau, sr, ts - h)).toBeCloseTo(stepWithSlew(v, tau, sr, ts + h), 4);
    const slopeAfter = (stepWithSlew(v, tau, sr, ts + 2 * h) - stepWithSlew(v, tau, sr, ts + h)) / h;
    expect(slopeAfter / sr).toBeCloseTo(1, 3);
    expect(stepWithSlew(v, tau, sr, ts + 20 * tau)).toBeCloseTo(1, 6);
  });
});
