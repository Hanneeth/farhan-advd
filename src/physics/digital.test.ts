import { describe, expect, it } from 'vitest';
import {
  arrayMultiplier,
  boothRadix4,
  carrySkipDelay,
  chargeSharing,
  cmosVilVih,
  cmosVM,
  cmosVout,
  commonEulerPath,
  complexGateEffort,
  depletionLoadVol,
  dual,
  dynamicPower,
  elmoreLadder,
  ffTiming,
  fullAdder,
  idSquare,
  kRForVM,
  LE,
  lookaheadCarries,
  maxBorrow,
  nandVM,
  netSize,
  noiseMargins,
  norVM,
  parseExpr,
  passChainDelay,
  pathEffort,
  pseudoNmosVol,
  resistiveInverter,
  rippleDelay,
  sizeNetwork,
  sramReadBump,
  sramWriteLevel,
  stackDepth,
  stageDelay,
  symmetricVilVih,
  tauPHL,
  tauPHLavg,
  tauPHLnumeric,
  tauPLH,
} from './digital';

const SYM = { vdd: 5, vtn: 1, vtp: 1, kn: 100e-6, kp: 100e-6 };

describe('CMOS inverter statics (Kang Ch 5)', () => {
  it('symmetric inverter: VM = VDD/2, VIL = (3VDD + 2VT)/8, VIH = (5VDD − 2VT)/8, equal margins', () => {
    expect(cmosVM(SYM)).toBeCloseTo(2.5, 12);
    const { vil, vih } = cmosVilVih(SYM);
    const c = symmetricVilVih(5, 1);
    expect(vil).toBeCloseTo(c.vil, 3); // 2.125
    expect(vih).toBeCloseTo(c.vih, 3); // 2.875
    const nm = noiseMargins({ voh: 5, vol: 0, vil, vih });
    expect(nm.nml).toBeCloseTo(nm.nmh, 3);
  });
  it('VTC is monotonic, rail to rail, and crosses Vin = Vout at VM', () => {
    const p = { ...SYM, kn: 200e-6 };
    expect(cmosVout(p, 0)).toBeCloseTo(5, 6);
    expect(cmosVout(p, 5)).toBeCloseTo(0, 6);
    let prev = 6;
    for (let v = 0; v <= 5; v += 0.05) {
      const o = cmosVout(p, v);
      expect(o).toBeLessThanOrEqual(prev + 1e-9);
      prev = o;
    }
    const vm = cmosVM(p);
    expect(vm).toBeLessThan(2.5); // stronger nMOS pulls VM down
    expect(Math.abs(cmosVout(p, vm - 0.01) - vm)).toBeGreaterThan(0);
  });
  it('the slope at VIL and VIH is −1 for an unsymmetric inverter too', () => {
    const p = { vdd: 3.3, vtn: 0.6, vtp: 0.7, kn: 150e-6, kp: 60e-6 };
    const { vil, vih } = cmosVilVih(p);
    const h = 1e-5;
    const slope = (v: number) => (cmosVout(p, v + h) - cmosVout(p, v - h)) / (2 * h);
    expect(slope(vil)).toBeCloseTo(-1, 2);
    expect(slope(vih)).toBeCloseTo(-1, 2);
    expect(vil).toBeLessThan(cmosVM(p));
    expect(vih).toBeGreaterThan(cmosVM(p));
  });
  it('kR for a target VM gives back that VM', () => {
    const kR = kRForVM({ vdd: 3.3, vtn: 0.6, vtp: 0.7, vm: 1.5 });
    expect(cmosVM({ vdd: 3.3, vtn: 0.6, vtp: 0.7, kn: kR * 50e-6, kp: 50e-6 })).toBeCloseTo(1.5, 10);
  });
});

describe('other loads (Kang §5.3, Weste §9.2.2)', () => {
  it('resistive load: VOL satisfies the current balance; VIL/VIH closed forms have slope −1', () => {
    const p = { vdd: 5, vt: 1, kn: 100e-6, rl: 100e3 };
    const r = resistiveInverter(p);
    expect((p.vdd - r.vol) / p.rl).toBeCloseTo(idSquare(p.kn, p.vdd, r.vol, p.vt), 12);
    const vout = (vin: number) => {
      let lo = 0,
        hi = p.vdd;
      for (let i = 0; i < 100; i++) {
        const m = (lo + hi) / 2;
        if ((p.vdd - m) / p.rl > idSquare(p.kn, vin, m, p.vt)) lo = m;
        else hi = m;
      }
      return (lo + hi) / 2;
    };
    const h = 1e-5;
    expect((vout(r.vil + h) - vout(r.vil - h)) / (2 * h)).toBeCloseTo(-1, 2);
    expect((vout(r.vih + h) - vout(r.vih - h)) / (2 * h)).toBeCloseTo(-1, 2);
    expect(vout(r.vm)).toBeCloseTo(r.vm, 4);
  });
  it('pseudo-nMOS and depletion load: VOL balances the load and driver currents', () => {
    const ps = pseudoNmosVol({ vdd: 1.8, vtn: 0.4, vtp: 0.45, kn: 400e-6, kp: 100e-6 });
    expect(idSquare(400e-6, 1.8, ps.vol, 0.4)).toBeCloseTo(ps.istatic, 12);
    const dp = depletionLoadVol({ vdd: 5, vtn: 1, vtd: 3, kn: 200e-6, kd: 20e-6 });
    expect(idSquare(200e-6, 5, dp.vol, 1)).toBeCloseTo(dp.istatic, 12);
  });
});

describe('switching (Kang §6.3)', () => {
  it('τPHL formula matches a numerical integration of the discharge', () => {
    const p = { cl: 1e-12, kn: 100e-6, vtn: 1, voh: 5, vol: 0 };
    expect(tauPHL(p) / tauPHLnumeric(p)).toBeCloseTo(1, 4);
    expect(tauPHLavg(p) / tauPHL(p)).toBeGreaterThan(0.8);
    expect(tauPHLavg(p) / tauPHL(p)).toBeLessThan(1.2);
  });
  it('τPLH mirrors τPHL: equal k and thresholds give equal delays', () => {
    const d1 = tauPHL({ cl: 1e-12, kn: 100e-6, vtn: 1, voh: 5, vol: 0 });
    const d2 = tauPLH({ cl: 1e-12, kp: 100e-6, vtp: 1, voh: 5, vol: 0 });
    expect(d2).toBeCloseTo(d1, 20);
    expect(tauPLH({ cl: 1e-12, kp: 50e-6, vtp: 1, voh: 5, vol: 0 })).toBeCloseTo(2 * d1, 20);
  });
});

describe('gates, networks, Euler paths (Kang Ch 7)', () => {
  it('NAND pulls VM up, NOR pulls it down (all inputs switching)', () => {
    expect(nandVM(SYM, 2)).toBeGreaterThan(2.5);
    expect(norVM(SYM, 2)).toBeLessThan(2.5);
  });
  it('parser, dual, transistor count, stack depth', () => {
    const n = parseExpr('A(B+C)+D');
    expect(netSize(n)).toBe(4);
    expect(stackDepth(n)).toBe(2);
    expect(stackDepth(dual(n))).toBe(3); // (A + BC)·D → A‖(B–C) in series with D
  });
  it('Weste AOI21: nMOS A,B = 2, C = 1; pMOS all 4; g(A,B) = 2, g(C) = 5/3', () => {
    const e = complexGateEffort('AB+C');
    const a = e.find((x) => x.name === 'A')!;
    const c = e.find((x) => x.name === 'C')!;
    expect([a.wn, a.wp, a.g]).toEqual([2, 4, 2]);
    expect(c.wn).toBe(1);
    expect(c.wp).toBe(4);
    expect(c.g).toBeCloseTo(5 / 3, 12);
    // NAND2 and NOR2 from the same machinery
    expect(complexGateEffort('AB')[0].g).toBeCloseTo(4 / 3, 12);
    expect(complexGateEffort('A+B')[0].g).toBeCloseTo(5 / 3, 12);
    expect(sizeNetwork(parseExpr('(AB+C)D'), 1).map((x) => x.w)).toEqual([3, 3, 2, 3]);
  });
  it('Euler path exists for AB + C and for A(B + C) + D', () => {
    expect(commonEulerPath('AB+C')).toBeDefined();
    expect(commonEulerPath('A(B+C)+D')).toBeDefined();
  });
});

describe('delay and logical effort (Weste Ch 4)', () => {
  it('Elmore ladder', () => {
    expect(elmoreLadder([{ r: 1, c: 1 }, { r: 1, c: 1 }, { r: 1, c: 1 }])).toBe(6);
  });
  it('FO4 inverter: d = 1·4 + 1 = 5τ', () => {
    expect(stageDelay(LE.inv.g, 4, LE.inv.p)).toBe(5);
    expect(LE.nand(2).g).toBeCloseTo(4 / 3, 12);
    expect(LE.nor(3).g).toBeCloseTo(7 / 3, 12);
  });
  it('Weste’s NAND2–NAND3–NOR2 path with branching 2 and 3, H = 45/8: F = 125, f̂ = 5, D = 22τ, x = y = 15', () => {
    const r = pathEffort([{ ...LE.nand(2), b: 2 }, { ...LE.nand(3), b: 3 }, LE.nor(2)], 8, 45);
    expect(r.F).toBeCloseTo(125, 9);
    expect(r.f).toBeCloseTo(5, 9);
    expect(r.D).toBeCloseTo(22, 9);
    expect(r.caps[2]).toBeCloseTo(15, 9);
    expect(r.caps[1]).toBeCloseTo(15, 9);
    expect(r.caps[0]).toBeCloseTo(8, 9);
  });
});

describe('power, dynamic logic, pass gates, sequencing', () => {
  it('α·C·VDD²·f', () => {
    expect(dynamicPower({ alpha: 0.1, c: 1e-9, vdd: 1, f: 1e9 })).toBeCloseTo(0.1, 12);
  });
  it('charge sharing and pass chains', () => {
    expect(chargeSharing({ vdd: 1, cout: 3, cx: 1 })).toBeCloseTo(0.75, 12);
    expect(passChainDelay({ r: 1, c: 1, n: 4 })).toBe(10);
  });
  it('flip-flop setup/hold with skew', () => {
    const t = ffTiming({ tpcq: 50e-12, tccq: 35e-12, tsetup: 60e-12, thold: -10e-12, tpd: 800e-12, tcd: 20e-12, tskew: 30e-12 });
    expect(t.tcMin).toBeCloseTo(940e-12, 20);
    expect(t.holdSlack).toBeCloseTo(20e-12 - (-10e-12 - 35e-12 + 30e-12), 20);
    expect(maxBorrow({ tc: 1e-9, tsetup: 50e-12, tnonoverlap: 0 })).toBeCloseTo(450e-12, 20);
  });
});

describe('arithmetic and memory', () => {
  it('full adder truth table and lookahead carries agree with ripple', () => {
    for (let x = 0; x < 8; x++) {
      const [a, b, c] = [x & 1, (x >> 1) & 1, (x >> 2) & 1];
      const r = fullAdder(a, b, c);
      expect(r.s + 2 * r.cout).toBe(a + b + c);
    }
    const A = [1, 0, 1, 1], B = [1, 1, 0, 1]; // LSB first: 13 + 11
    const c = lookaheadCarries(A, B, 0);
    expect(c[4]).toBe(1);
  });
  it('ripple and carry-skip delays', () => {
    expect(rippleDelay({ n: 16, tpg: 1, tao: 2, txor: 1 })).toBe(32);
    expect(carrySkipDelay({ n: 4, k: 4, tpg: 1, tao: 2, tmux: 2, txor: 1 })).toBe(1 + 12 + 6 + 1);
  });
  it('radix-4 Booth recoding reproduces every 8-bit signed number', () => {
    for (let y = -128; y < 128; y++) {
      const d = boothRadix4(y, 8);
      expect(d.every((x) => Math.abs(x) <= 2)).toBe(true);
      expect(d.reduce((a, x, i) => a + x * 4 ** i, 0)).toBe(y);
    }
    expect(arrayMultiplier(8, 8)).toEqual({ ppBits: 64, rows: 8, productBits: 16, boothRows: 5 });
  });
  it('SRAM: a stronger pull-down (bigger cell ratio) keeps the read bump smaller; write level balances currents', () => {
    const a = sramReadBump({ vdd: 1, vtn: 0.3, kAccess: 100e-6, kPulldown: 150e-6 });
    const b = sramReadBump({ vdd: 1, vtn: 0.3, kAccess: 100e-6, kPulldown: 300e-6 });
    expect(b).toBeLessThan(a);
    expect((100e-6 / 2) * (1 - a - 0.3) ** 2).toBeCloseTo(150e-6 * (0.7 * a - (a * a) / 2), 12);
    const w = sramWriteLevel({ vdd: 1, vtn: 0.3, vtp: 0.3, kAccess: 100e-6, kPullup: 50e-6 });
    expect((50e-6 / 2) * 0.49).toBeCloseTo(100e-6 * (0.7 * w - (w * w) / 2), 12);
  });
});
