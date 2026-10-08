/** L5–L9 tutorial solvers, checked against hand calculations written out in the comments. */
import { describe, expect, it } from 'vitest';
import { tut4Q1, tut4Q2, tut5Q1, tut6Q1, tut6Q2, tut6Q3 } from './solvers2';

const near = (a: number, b: number, rel = 0.005) => expect(Math.abs(a - b) / Math.abs(b)).toBeLessThan(rel);

describe('Tutorial 4', () => {
  it('Q1: X = 0.776 V, VG2 = 1.647 V, gain ≈ 3.6 × 10⁶ ideal; with PMOS sources the load rO wins (≈ 58)', () => {
    const r = tut4Q1();
    near(r.vx, 0.7762); // 0.7 + √(2·100µ/(172.35µ·200))
    near(r.vg2, 1.6465);
    near(r.av, 3.635e6, 0.01);
    expect(r.avP).toBeGreaterThan(55);
    expect(r.avP).toBeLessThan(59);
    near(r.voutMin, 0.9465);
    near(r.voutMax, 2.5602);
  });
  it('Q2: Vbp 0.809 V, M3 saturated, VS 1.094 V, λn ≈ 0.42 V⁻¹', () => {
    const r = tut4Q2();
    near(r.vbp, 0.8086);
    expect(r.m3Saturated).toBe(true);
    near(r.i4, 112.5e-6);
    near(r.vs, 1.0943);
    near(r.lambdaApprox, 0.4200, 0.01);
    near(r.lambdaExact, 0.4285, 0.01);
  });
});

describe('Tutorial 5 Q1', () => {
  it('(a) deep-triode sizing 46.3 (exact triode 49.4)', () => {
    const r = tut5Q1();
    near(r.wl, 46.30);
    near(r.wlExact, 49.38);
  });
});

describe('Tutorial 6', () => {
  it('Q1: Acl 4.998, τ 199.9 ps, Vout(1 ns) 0.248 V, SR 20 V/µs, V0,crit 0.8 mV, tslew ≈ 249.7 ns', () => {
    const r = tut6Q1();
    near(r.acl, 4.9975);
    near(r.tau, 199.9e-12);
    near(r.vAt1ns, 0.2482);
    near(r.slope0, 1.25e9);
    near(r.sr, 20e6);
    near(r.v0crit, 0.8e-3);
    near(r.tslew, 249.7e-9);
  });
  it('Q2: SR 40 V/µs, ΔVin,min 0.316 V, tslew 88.4 ns, Rout 100 kΩ, τ 21.4 ns, total ≈ 156 ns', () => {
    const r = tut6Q2();
    near(r.sr, 40e6);
    near(r.dvinMin, 0.3162);
    near(r.tslew, 88.4e-9);
    near(r.rout, 100e3);
    near(r.tau, 21.41e-9);
    near(r.total, 155.6e-9, 0.01);
  });
  it('Q3: IP < ISS, so both slew rates are IP/CL = 50 V/µs; symmetric at SR = ISS/CL needs IP ≥ ISS; ΔVin,min 0.212 V', () => {
    const r = tut6Q3();
    near(r.srPlus, 50e6);
    near(r.srMinus, 50e6);
    expect(r.limitedBy).toBe('IP');
    near(r.dvinMin, 0.2121);
  });
});
