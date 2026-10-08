import { describe, expect, it } from 'vitest';
import { formatSI, parseSI } from './units';

describe('parseSI', () => {
  const cases: Array<[string, string, number]> = [
    ['90u', 'A', 90e-6],
    ['90 µA', 'A', 90e-6],
    ['90e-6', 'A', 90e-6],
    ['0.09 mA', 'A', 90e-6],
    ['9k', 'Ω', 9e3],
    ['9 kΩ', 'Ω', 9e3],
    ['9kohm', 'Ω', 9e3],
    ['1.2M', 'Ω', 1.2e6],
    ['-5.5', 'V/V', -5.5],
    ['−5.5', 'V/V', -5.5],
    ['358 kHz', 'Hz', 358e3],
    ['0.6m', 'S', 0.6e-3],
    ['0.6 mA/V', 'S', 0.6e-3],
    ['0.6 mS', 'S', 0.6e-3],
    ['0.9', 'V', 0.9],
    ['900m', 'V', 0.9],
    ['900 mV', 'V', 0.9],
    ['54.6 ns', 's', 54.6e-9],
    ['54.6n', 's', 54.6e-9],
    ['30 V/µs', 'V/s', 30e6],
    ['30V/us', 'V/s', 30e6],
    ['4p', 'F', 4e-12],
    ['1.47 GHz', 'Hz', 1.47e9],
    ['2.5×10^-4', 'A', 2.5e-4],
  ];
  for (const [input, unit, value] of cases) {
    it(`${input} → ${value}`, () => {
      const r = parseSI(input, unit as never);
      expect(r.ok, r.error).toBe(true);
      expect(r.value!).toBeCloseTo(value, 15);
    });
  }

  it('rejects the wrong unit with a reason', () => {
    const r = parseSI('9 kΩ', 'A');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/Ω/);
  });
  it('rejects garbage', () => {
    expect(parseSI('abc', 'V').ok).toBe(false);
    expect(parseSI('', 'V').ok).toBe(false);
  });
});

describe('formatSI', () => {
  it('prefixes', () => {
    expect(formatSI(90e-6, 'A')).toBe('90 µA');
    expect(formatSI(111.11e3, 'Ω')).toBe('111 kΩ');
    expect(formatSI(0.9, 'V')).toBe('0.9 V');
    expect(formatSI(0.6e-3, 'S')).toBe('0.6 mS');
    expect(formatSI(358.1e3, 'Hz')).toBe('358 kHz');
    expect(formatSI(30e6, 'V/s')).toBe('30 V/µs');
    expect(formatSI(-5.5, 'V/V')).toBe('−5.5 V/V');
    expect(formatSI(4e-12, 'F')).toBe('4 pF');
  });
});
