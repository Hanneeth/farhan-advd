/**
 * Two independent solves of every CS load: the slope of the large-signal curve (bisection on KCL)
 * must equal −Gm·Rout from the small-signal formulas in stages.ts.
 */
import { describe, expect, it } from 'vitest';
import { SET_B } from './process';
import { csActiveLoad, csCurrentSourceLoad, csDegenerated, csDiodeLoad, csResistive, csTriodeLoad } from './stages';
import { csOperatingPoint, csSlope, idFull, smallSignalAt, vinForVout, type CsLoad, type CsParams } from './transfer';

const proc = { ...SET_B, lambdan: 0.1, lambdap: 0.1 };
const base = (load: CsLoad): CsParams => ({ load, proc, wl1: 10, wl2: 20, rd: 10e3, rs: 2e3, vb: 1.1 });

function formula(p: CsParams, vin: number): number {
  const q = csOperatingPoint(p, vin);
  const vdd = p.proc.vdd;
  const m1 = smallSignalAt(p.proc.kpn, p.wl1, vin - q.vs - p.proc.vthn, q.vout - q.vs, p.proc.lambdan);
  const vsd = vdd - q.vout;
  switch (p.load) {
    case 'resistor':
      return csResistive({ gm: m1.gm, rd: p.rd, rO: m1.rO });
    case 'diode': {
      const m2 = smallSignalAt(p.proc.kpp, p.wl2, vsd - p.proc.vthp, vsd, p.proc.lambdap);
      return csDiodeLoad({ gm1: m1.gm, gm2: m2.gm, rO1: m1.rO, rO2: m2.rO });
    }
    case 'current': {
      const m2 = smallSignalAt(p.proc.kpp, p.wl2, vdd - p.vb - p.proc.vthp, vsd, p.proc.lambdap);
      return csCurrentSourceLoad({ gm1: m1.gm, rO1: m1.rO, rO2: m2.rO });
    }
    case 'triode': {
      const m2 = smallSignalAt(p.proc.kpp, p.wl2, vdd - p.proc.vthp, vsd, p.proc.lambdap);
      return csTriodeLoad({ gm1: m1.gm, ron2: m2.rO, rO1: m1.rO });
    }
    case 'active': {
      const m2 = smallSignalAt(p.proc.kpp, p.wl2, vdd - vin - p.proc.vthp, vsd, p.proc.lambdap);
      return csActiveLoad({ gm1: m1.gm, gm2: m2.gm, rO1: m1.rO, rO2: m2.rO });
    }
    case 'degenerated':
      return csDegenerated({ gm: m1.gm, rd: p.rd, rs: p.rs });
  }
}

describe('CS transfer curves: slope = −Gm·Rout', () => {
  const cases: Array<[CsLoad, number, Partial<CsParams>?]> = [
    ['resistor', 0.62],
    ['diode', 0.7, { wl2: 5 }],
    ['current', 0.6, {}],
    ['triode', 0.75, { wl2: 1 }],
    ['active', 0.8, { wl2: 5 }],
    ['degenerated', 0.8, { proc: { ...proc, lambdan: 0 } }],
  ];
  it.each(cases)('%s load', (load, _vin, extra) => {
    const p = { ...base(load), ...(extra ?? {}) };
    const vin = vinForVout(p, 0.9); // put the Q point mid-supply
    // find a Vin in the high-gain region near the requested one: M1 must be saturated
    const q = csOperatingPoint(p, vin);
    expect(q.vout).toBeGreaterThan(vin - q.vs - p.proc.vthn); // M1 saturated
    const slope = csSlope(p, vin);
    const f = formula(p, vin);
    expect(slope).toBeLessThan(0);
    expect(slope).toBeCloseTo(f, 1);
    expect(Math.abs(slope - f) / Math.abs(f)).toBeLessThan(0.01);
  });

  it('KCL holds at the operating point', () => {
    const p = base('resistor');
    const q = csOperatingPoint(p, 0.62);
    expect((1.8 - q.vout) / 10e3).toBeCloseTo(q.id, 9);
  });

  it('idFull is continuous at the triode edge and zero when off', () => {
    const a = idFull(200e-6, 10, 0.3, 0.3 - 1e-9, 0.1);
    const b = idFull(200e-6, 10, 0.3, 0.3 + 1e-9, 0.1);
    expect(a).toBeCloseTo(b, 12);
    expect(idFull(200e-6, 10, -0.1, 1, 0.1)).toBe(0);
  });

  it('resistor-load curve matches WE1 with λ = 0 (VD 0.9 V at VG 0.7 V)', () => {
    const p: CsParams = { ...base('resistor'), proc: { ...proc, lambdan: 0 } };
    expect(csOperatingPoint(p, 0.7).vout).toBeCloseTo(0.9, 6);
  });
});
