import { describe, expect, it } from 'vitest';
import { BANK } from '../content';
import { calcTips, speedTips, timeBudget } from './exam';

describe('exam helpers', () => {
  it('every question gets a 2–40 min budget, speed tips, and marked papers use 1.5 min/mark', () => {
    for (const p of BANK) {
      const b = timeBudget(p);
      expect(b.total, p.id).toBeGreaterThanOrEqual(120);
      expect(b.total, p.id).toBeLessThanOrEqual(2400);
      expect(speedTips(p).length, p.id).toBeGreaterThan(1);
      calcTips(p);
    }
    const q = BANK.find((p) => p.id === 'pyq-m24-q2')!;
    expect(timeBudget(q).total).toBe(15 * 1.5 * 60);
  });
});
